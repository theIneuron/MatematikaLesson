// ============================================================
// 6 КЛАСС, УРОК 15 «Периодические десятичные дроби и округление»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Урок 14 показал, что с запятой считать можно. Здесь выясняется, что не
// всякая обыкновенная дробь превращается в конечную десятичную, и появляется
// второй инструмент — округление, то есть честная замена длинного числа.
//
// Сцена — кухня школьной столовой: котёл компота и три кувшина.
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
  Frac,
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
  FB_SCI,
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
  lessonId: 'grade6-15',
  lessonTitle: {
    ru: 'Периодические дроби и округление',
    uz: "Davriy kasrlar va yaxlitlash",
    en: 'Repeating decimals and rounding',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 oshxona: 10 litr uch ko'zaga
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 kasrni o'nliga aylantirish
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 qoldiq takrorlanadi — davr
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: maxrajga qarab tanish
  { id: 's_round',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 yaxlitlash qoidasi
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: 5/11
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: bir marta yaxlitlanadi
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_kind',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 chekli yoki davriy x3
  { id: 's_rnd',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 yaxlitlash x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: chekli / davriy
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: kompot
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Компот на три кувшина', uz: 'Uch ko\'zaga kompot', en: 'Compote for three jugs' },
    lead: {
      ru: 'В столовой сварили 10 литров компота и разливают поровну в 3 кувшина.',
      uz: "Oshxonada 10 litr kompot pishirildi va u 3 ta ko'zaga teng quyilyapti.",
      en: 'The canteen made 10 litres of compote and pours it equally into 3 jugs.',
    },
    voice_a: { ru: 'Азиз: по 3,3 литра ровно.', uz: 'Aziz: roppa-rosa 3,3 litrdan.', en: 'Aziz: exactly 3.3 litres each.' },
    voice_b: { ru: 'Дилноза: это деление не закончится.', uz: "Dilnoza: bu bo'lish tugamaydi.", en: 'Dilnoza: this division never ends.' },
    ask: { ru: 'Сколько будет в каждом кувшине?', uz: "Har bir ko'zada qancha bo'ladi?", en: 'How much goes into each jug?' },
    options: [
      { ru: 'Ровно 3,3 литра', uz: 'Roppa-rosa 3,3 litr', en: 'Exactly 3.3 litres' },
      { ru: 'Число с бесконечным хвостом', uz: 'Cheksiz dumli son', en: 'A number with an endless tail' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'В школьной столовой сварили десять литров компота и разливают его поровну в три кувшина.',
          'Азиз говорит, что выйдет ровно по три целых три десятых литра, а Дилноза что это деление не закончится. Сколько будет в каждом кувшине? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Maktab oshxonasida o'n litr kompot pishirildi va u uchta ko'zaga teng quyilyapti.",
          "Aziz roppa-rosa uch butun uch o'ndan litrdan chiqadi deydi, Dilnoza esa bu bo'lish tugamaydi deydi. Har bir ko'zada qancha bo'ladi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'The school canteen made ten litres of compote and pours it equally into three jugs.',
          'Aziz says it will be exactly three point three litres each, Dilnoza says this division never ends. How much goes into each jug? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Дробь можно записать десятичной', uz: "Kasrni o'nli ko'rinishda yozish", en: 'A fraction can become a decimal' },
    rows: [
      { n: 1, d: 2, dec: '0,5' },
      { n: 1, d: 4, dec: '0,25' },
      { n: 7, d: 20, dec: '0,35' },
    ],
    done: {
      ru: 'Черта дроби — это знак деления. Здесь деление закончилось, и запись получилась короткой.',
      uz: "Kasr chizig'i bo'lish belgisi. Bu yerda bo'lish tugadi va yozuv qisqa chiqdi.",
      en: 'The fraction bar is a division sign. Here the division ended and the notation stayed short.',
    },
    audio: {
      ru: [
        'Вспомним, что черта дроби это знак деления. Одну вторую можно записать как ноль целых пять десятых.',
        'Одна четвёртая это ноль целых двадцать пять сотых.',
        'Семь двадцатых это ноль целых тридцать пять сотых. Во всех трёх случаях деление закончилось. Сегодня посмотрим, что бывает, когда оно не заканчивается.',
      ],
      uz: [
        "Kasr chizig'i bo'lish belgisi ekanini eslaymiz. Bir ikkidanni nol butun besh o'ndan deb yozish mumkin.",
        "Bir to'rtdan bu nol butun yigirma besh yuzdan.",
        "Yetti yigirmadan bu nol butun o'ttiz besh yuzdan. Uchala holda ham bo'lish tugadi. Bugun u tugamaganda nima bo'lishini ko'ramiz.",
      ],
      en: [
        'Recall that the fraction bar is a division sign. One half can be written as zero point five.',
        'One quarter is zero point two five.',
        'Seven twentieths is zero point three five. In all three the division ended. Today we look at what happens when it does not.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Остаток повторяется', uz: 'Qoldiq takrorlanadi', en: 'The remainder repeats' },
    steps: [
      { ru: '10 : 3 = 3, остаток 1', uz: "10 : 3 = 3, qoldiq 1", en: '10 ÷ 3 = 3, remainder 1' },
      { ru: '10 : 3 = 3,3, остаток снова 1', uz: '10 : 3 = 3,3, qoldiq yana 1', en: '10 ÷ 3 = 3.3, remainder 1 again' },
      { ru: '3,333… = 3,(3)', uz: '3,333… = 3,(3)', en: '3.333… = 3.(3)' },
    ],
    done: {
      ru: 'Остаток каждый раз один и тот же, значит и цифра повторяется без конца. Такую дробь называют периодической, а повторяющуюся часть пишут в скобках. Права была Дилноза.',
      uz: "Qoldiq har safar bir xil, demak raqam ham cheksiz takrorlanadi. Bunday kasr davriy deyiladi, takrorlanuvchi qism qavsda yoziladi. Dilnoza haq edi.",
      en: 'The remainder is the same every time, so the digit repeats forever. Such a decimal is called repeating and the repeating part is written in brackets. Dilnoza was right.',
    },
    audio: {
      ru: [
        'Разделим десять на три уголком. Три помещается три раза, остаётся один.',
        'Сносим ноль, снова делим на три и снова получаем в остатке один. Дальше повторится то же самое.',
        'Раз остаток каждый раз одинаковый, то и цифра тройка будет повторяться без конца. Такую дробь называют периодической и записывают три целых и три в скобках. Права была Дилноза.',
      ],
      uz: [
        "O'nni uchga ustunda bo'lamiz. Uch uch marta sig'adi, bir qoladi.",
        "Nolni tushiramiz, yana uchga bo'lamiz va yana qoldiq bir chiqadi. Keyin ham xuddi shu takrorlanadi.",
        "Qoldiq har safar bir xil ekan, uch raqami ham cheksiz takrorlanadi. Bunday kasr davriy deyiladi va uch butun, qavsda uch deb yoziladi. Dilnoza haq edi.",
      ],
      en: [
        'Divide ten by three in a column. Three fits three times and one is left.',
        'Bring down a zero, divide by three again and the remainder is one again. From here the same thing repeats.',
        'Since the remainder is always the same, the digit three repeats forever. Such a decimal is called repeating and is written as three point and three in brackets. Dilnoza was right.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Узнаём по знаменателю', uz: 'Maxrajga qarab tanish', en: 'Tell by the denominator' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: '7/20: знаменатель 20 = 2 · 2 · 5', uz: '7/20: maxraj 20 = 2 · 2 · 5', en: '7/20: the denominator 20 = 2 · 2 · 5' },
      { ru: 'только двойки и пятёрки → конечная 0,35', uz: 'faqat ikki va besh → chekli 0,35', en: 'only twos and fives → finite 0.35' },
      { ru: '5/6: 6 = 2 · 3, есть тройка → 0,8(3)', uz: '5/6: 6 = 2 · 3, uch bor → 0,8(3)', en: '5/6: 6 = 2 · 3, a three appears → 0.8(3)' },
    ],
    demo_note: {
      ru: 'Смотрим на разложение знаменателя несократимой дроби. Только 2 и 5 — запись конечная. Появился другой множитель — дробь периодическая.',
      uz: "Qisqarmas kasr maxrajining yoyilmasiga qaraymiz. Faqat 2 va 5 bo'lsa yozuv chekli. Boshqa ko'paytuvchi chiqsa, kasr davriy.",
      en: 'Look at the prime factors of an irreducible fraction’s denominator. Only 2 and 5 means a finite decimal. Any other factor means a repeating one.',
    },
    play_ask: { ru: 'Какая запись у 3/8: конечная или периодическая?', uz: "3/8 qanday yoziladi: chekli yoki davriy?", en: 'Is 3/8 finite or repeating?' },
    play_opts: [
      { ru: 'Конечная', uz: 'Chekli', en: 'Finite' },
      { ru: 'Периодическая', uz: 'Davriy', en: 'Repeating' },
      { ru: 'Нельзя определить', uz: "Aniqlab bo'lmaydi", en: 'Impossible to tell' },
    ],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. 8 = 2 · 2 · 2, кроме двоек множителей нет, значит 3/8 = 0,375.',
      uz: "To'g'ri. 8 = 2 · 2 · 2, ikkidan boshqa ko'paytuvchi yo'q, demak 3/8 = 0,375.",
      en: 'Right. 8 = 2 · 2 · 2 with no other factors, so 3/8 = 0.375.',
    },
    play_wrong: [
      null,
      { ru: 'Периодической она была бы при множителе 3 или 7, а тут только двойки.', uz: "Davriy bo'lishi uchun 3 yoki 7 kerak, bu yerda esa faqat ikkilar.", en: 'It would repeat with a factor 3 or 7, but here there are only twos.' },
      { ru: 'Определить можно: разложи знаменатель на простые множители.', uz: "Aniqlash mumkin: maxrajni tub ko'paytuvchilarga yoying.", en: 'You can tell: factor the denominator into primes.' },
    ],
    audio: {
      intro: {
        ru: 'Есть способ узнать заранее, будет ли дробь конечной. Надо сократить её и разложить знаменатель на простые множители. Покажу на семи двадцатых и пяти шестых.',
        uz: "Kasr chekli bo'ladimi yoki yo'qmi, oldindan bilish usuli bor. Uni qisqartirib, maxrajni tub ko'paytuvchilarga yoyish kerak. Yetti yigirmadan va besh oltidan misolida ko'rsataman.",
        en: 'There is a way to know in advance whether a fraction is finite. Reduce it and factor the denominator into primes. I will show it on seven twentieths and five sixths.',
      },
      demo: {
        ru: 'Двадцать это два умножить на два и на пять. Только двойки и пятёрки, значит запись конечная. А шесть это два умножить на три. Тройка мешает, и дробь получается периодической.',
        uz: "Yigirma bu ikki karra ikki karra besh. Faqat ikki va besh, demak yozuv chekli. Olti esa ikki karra uch. Uch xalaqit beradi va kasr davriy chiqadi.",
        en: 'Twenty is two times two times five. Only twos and fives, so the decimal is finite. Six is two times three. The three gets in the way and the decimal repeats.',
      },
      play: {
        ru: 'Теперь ваша очередь. Какая запись у трёх восьмых: конечная или периодическая?',
        uz: "Endi sizning navbatingiz. Uch sakkizdan qanday yoziladi: chekli yoki davriy?",
        en: 'Now it is your turn. Is three eighths finite or repeating?',
      },
      ok: {
        ru: 'Верно. Восемь это два умножить на два и на два, поэтому запись конечная.',
        uz: "To'g'ri. Sakkiz bu ikki karra ikki karra ikki, shuning uchun yozuv chekli.",
        en: 'Right. Eight is two times two times two, so the decimal is finite.',
      },
      wrong: {
        ru: 'Разложите знаменатель на простые множители и посмотрите, есть ли там что-то кроме двоек и пятёрок.',
        uz: "Maxrajni tub ko'paytuvchilarga yoying va ikki bilan beshdan boshqa narsa bor-yo'qligiga qarang.",
        en: 'Factor the denominator into primes and see whether anything besides twos and fives appears.',
      },
    },
  },

  s_round: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Округление: смотрим на следующую цифру', uz: 'Yaxlitlash: keyingi raqamga qaraymiz', en: 'Rounding: look at the next digit' },
    lines: [
      { ru: '3,333… → до десятых: следующая цифра 3, меньше 5 → 3,3', uz: "3,333… → o'ndanlargacha: keyingi raqam 3, 5 dan kichik → 3,3", en: '3.333… → to tenths: the next digit is 3, less than 5 → 3.3' },
      { ru: '0,8(3) → до сотых: следующая цифра 3 → 0,83', uz: '0,8(3) → yuzdanlargacha: keyingi raqam 3 → 0,83', en: '0.8(3) → to hundredths: the next digit is 3 → 0.83' },
      { ru: '2,47 → до десятых: следующая цифра 7 → 2,5', uz: "2,47 → o'ndanlargacha: keyingi raqam 7 → 2,5", en: '2.47 → to tenths: the next digit is 7 → 2.5' },
    ],
    done: {
      ru: 'Правило одно: если следующая цифра меньше 5, разряд оставляем; если 5 или больше, увеличиваем на единицу.',
      uz: "Qoida bitta: keyingi raqam 5 dan kichik bo'lsa xona o'zgarmaydi, 5 yoki katta bo'lsa bittaga oshadi.",
      en: 'One rule: if the next digit is under 5 the place stays, if it is 5 or more the place goes up by one.',
    },
    audio: {
      ru: [
        'Бесконечный хвост в жизни не нужен, поэтому число округляют. Смотрим на цифру сразу после нужного разряда.',
        'В три целых три в периоде после десятых стоит тройка. Она меньше пяти, значит десятые не меняются: три целых три десятых.',
        'А в два целых сорок семь сотых после десятых стоит семёрка. Она больше пяти, поэтому десятые растут на единицу: два целых пять десятых. Смотреть надо только на одну следующую цифру.',
      ],
      uz: [
        "Cheksiz dum hayotda kerak emas, shuning uchun son yaxlitlanadi. Kerakli xonadan keyingi raqamga qaraymiz.",
        "Uch butun, davrda uch sonida o'ndanlardan keyin uch turadi. U beshdan kichik, demak o'ndanlar o'zgarmaydi: uch butun uch o'ndan.",
        "Ikki butun qirq yetti yuzdanda esa o'ndanlardan keyin yetti turadi. U beshdan katta, shuning uchun o'ndanlar bittaga oshadi: ikki butun besh o'ndan. Faqat bitta keyingi raqamga qarash kerak.",
      ],
      en: [
        'An endless tail is useless in real life, so numbers are rounded. Look at the digit right after the place you need.',
        'In three point three repeating, the digit after tenths is three. It is under five, so the tenths stay: three point three.',
        'In two point four seven the digit after tenths is seven. It is above five, so the tenths go up by one: two point five. Only the single next digit matters.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Запишем 5/11 десятичной', uz: "5/11 ni o'nli ko'rinishda yozamiz", en: 'Write 5/11 as a decimal' },
    lead: { ru: '11 не раскладывается на двойки и пятёрки — ждём период.', uz: "11 ikki va beshga yoyilmaydi — davrni kutamiz.", en: '11 has no twos or fives, so expect a repeat.' },
    steps: [
      { ru: '5 : 11 = 0,4545…', uz: '5 : 11 = 0,4545…', en: '5 ÷ 11 = 0.4545…' },
      { ru: 'повторяются две цифры: 0,(45)', uz: 'ikki raqam takrorlanadi: 0,(45)', en: 'two digits repeat: 0.(45)' },
      { ru: 'до сотых: следующая цифра 4 → 0,45', uz: 'yuzdanlargacha: keyingi raqam 4 → 0,45', en: 'to hundredths: the next digit is 4 → 0.45' },
    ],
    done: {
      ru: 'Период здесь из двух цифр. Округление до сотых дало 0,45 — короткое число, почти равное исходному.',
      uz: "Bu yerda davr ikki raqamdan iborat. Yuzdanlargacha yaxlitlash 0,45 berdi — qisqa son, dastlabkisiga deyarli teng.",
      en: 'The period here is two digits long. Rounding to hundredths gave 0.45, a short number almost equal to the original.',
    },
    audio: {
      ru: [
        'Решаем вместе. Пять разделить на одиннадцать. Одиннадцать это простое число, двоек и пятёрок в нём нет, значит будет период.',
        'Делим и получаем ноль целых сорок пять сорок пять и так далее. Повторяются сразу две цифры, поэтому в скобки берём обе.',
        'Округлим до сотых. После сотых идёт четвёрка, она меньше пяти, значит сотые не меняются. Ответ ноль целых сорок пять сотых.',
      ],
      uz: [
        "Birga yechamiz. Beshni o'n birga bo'lamiz. O'n bir tub son, unda ikki ham, besh ham yo'q, demak davr bo'ladi.",
        "Bo'lamiz va nol butun qirq besh qirq besh va hokazo chiqadi. Ikkita raqam birdan takrorlanadi, shuning uchun qavsga ikkalasini olamiz.",
        "Yuzdanlargacha yaxlitlaymiz. Yuzdanlardan keyin to'rt turadi, u beshdan kichik, demak yuzdanlar o'zgarmaydi. Javob nol butun qirq besh yuzdan.",
      ],
      en: [
        'Let us solve it together. Five divided by eleven. Eleven is prime with no twos or fives, so a period is coming.',
        'Divide and get zero point four five four five and so on. Two digits repeat, so both go into the brackets.',
        'Round to hundredths. The digit after hundredths is four, less than five, so the hundredths stay. The answer is zero point four five.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilinadi', en: 'Where mistakes happen' },
    title: { ru: 'Округляем один раз', uz: 'Bir marta yaxlitlaymiz', en: 'Round only once' },
    bad_line: { ru: '2,449 → 2,45 → 2,5', uz: '2,449 → 2,45 → 2,5', en: '2.449 → 2.45 → 2.5' },
    good_line: { ru: '2,449 → до десятых сразу: 2,4', uz: "2,449 → o'ndanlargacha darrov: 2,4", en: '2.449 → straight to tenths: 2.4' },
    keep_line: { ru: 'период не обрывают: 0,(3) это не 0,3', uz: 'davr uzilmaydi: 0,(3) bu 0,3 emas', en: 'a period is not cut off: 0.(3) is not 0.3' },
    done: {
      ru: 'Округление идёт от исходного числа к нужному разряду, а не по шагам. И скобки в периодической дроби не украшение: 0,(3) больше, чем 0,3.',
      uz: "Yaxlitlash dastlabki sondan kerakli xonaga qarab qilinadi, qadamlab emas. Davriy kasrdagi qavs esa bezak emas: 0,(3) soni 0,3 dan katta.",
      en: 'Rounding goes from the original number straight to the needed place, not step by step. And the brackets are not decoration: 0.(3) is greater than 0.3.',
    },
    audio: {
      ru: [
        'Первая ошибка это округление по шагам. Два целых четыреста сорок девять тысячных сначала округляют до сотых, получают два целых сорок пять сотых, а потом до десятых и получают два целых пять десятых.',
        'Так делать нельзя. Смотреть надо сразу на нужный разряд: после десятых стоит четвёрка, значит ответ два целых четыре десятых.',
        'Вторая ошибка это обрывать период. Ноль целых три в периоде это не ноль целых три десятых: тройка повторяется бесконечно, поэтому число немного больше.',
      ],
      uz: [
        "Birinchi xato bu qadamlab yaxlitlash. Ikki butun to'rt yuz qirq to'qqiz mingdanni avval yuzdanlargacha yaxlitlab ikki butun qirq besh yuzdan olishadi, keyin o'ndanlargacha yaxlitlab ikki butun besh o'ndan olishadi.",
        "Bunday qilib bo'lmaydi. Darrov kerakli xonaga qarash kerak: o'ndanlardan keyin to'rt turadi, demak javob ikki butun to'rt o'ndan.",
        "Ikkinchi xato davrni uzish. Nol butun, davrda uch bu nol butun uch o'ndan emas: uch cheksiz takrorlanadi, shuning uchun son sal kattaroq.",
      ],
      en: [
        'The first mistake is rounding in steps. Two point four four nine is first rounded to hundredths giving two point four five, and then to tenths giving two point five.',
        'That is not allowed. Look straight at the place you need: after tenths comes four, so the answer is two point four.',
        'The second mistake is cutting the period. Zero point three repeating is not zero point three: the three repeats forever, so the number is slightly larger.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Период и округление', uz: 'Davr va yaxlitlash', en: 'Periods and rounding' },
    rule_1: {
      ru: 'Если у несократимой дроби в знаменателе только 2 и 5, десятичная запись конечная. Иначе она периодическая, и повторяющуюся часть пишут в скобках.',
      uz: "Qisqarmas kasr maxrajida faqat 2 va 5 bo'lsa, o'nli yozuv chekli. Aks holda u davriy bo'ladi va takrorlanuvchi qism qavsda yoziladi.",
      en: 'If an irreducible fraction has only 2 and 5 in its denominator, the decimal is finite. Otherwise it repeats and the repeating part goes in brackets.',
    },
    rule_2: {
      ru: 'Округляем по следующей цифре: меньше 5 — разряд не меняется, 5 и больше — растёт на единицу. Компот: 10 : 3 = 3,(3), примерно 3,3 литра. Права была Дилноза.',
      uz: "Keyingi raqamga qarab yaxlitlaymiz: 5 dan kichik bo'lsa xona o'zgarmaydi, 5 va katta bo'lsa bittaga oshadi. Kompot: 10 : 3 = 3,(3), taxminan 3,3 litr. Dilnoza haq edi.",
      en: 'Round by the next digit: under 5 the place stays, 5 or more it goes up. The compote: 10 ÷ 3 = 3.(3), about 3.3 litres. Dilnoza was right.',
    },
    audio: {
      ru: 'Запомним правило. Если у несократимой дроби в знаменателе только двойки и пятёрки, десятичная запись конечная, иначе дробь периодическая и повторяющуюся часть пишут в скобках. Округляют по следующей цифре: меньше пяти разряд остаётся, пять и больше растёт на единицу. Вернёмся к компоту. Десять разделить на три это три целых три в периоде, примерно три целых три десятых литра. Права была Дилноза.',
      uz: "Qoidani eslab qolamiz. Qisqarmas kasr maxrajida faqat ikki va besh bo'lsa, o'nli yozuv chekli, aks holda kasr davriy bo'ladi va takrorlanuvchi qism qavsda yoziladi. Yaxlitlash keyingi raqamga qarab qilinadi: beshdan kichik bo'lsa xona qoladi, besh va katta bo'lsa bittaga oshadi. Kompotga qaytamiz. O'nni uchga bo'lsak uch butun, davrda uch chiqadi, taxminan uch butun uch o'ndan litr. Dilnoza haq edi.",
      en: 'Let us remember the rule. If an irreducible fraction has only twos and fives in the denominator, the decimal is finite, otherwise it repeats and the repeating part goes in brackets. Rounding uses the next digit: under five the place stays, five or more it goes up by one. Back to the compote. Ten divided by three is three point three repeating, about three point three litres. Dilnoza was right.',
    },
  },

  s_kind: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Конечная или периодическая', uz: 'Chekli yoki davriy', en: 'Finite or repeating' },
    lead: { ru: 'Сократи дробь и разложи знаменатель.', uz: 'Kasrni qisqartiring va maxrajni yoying.', en: 'Reduce the fraction and factor the denominator.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Какая запись у 7/25?', uz: '7/25 qanday yoziladi?', en: 'What is 7/25 like?' },
        opts: [
          { ru: 'Конечная', uz: 'Chekli', en: 'Finite' },
          { ru: 'Периодическая', uz: 'Davriy', en: 'Repeating' },
          { ru: 'Целое число', uz: 'Butun son', en: 'A whole number' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 25 = 5 · 5, значит 7/25 = 0,28.', uz: "To'g'ri. 25 = 5 · 5, demak 7/25 = 0,28.", en: 'Right. 25 = 5 · 5, so 7/25 = 0.28.' },
        wrong: [
          null,
          { ru: 'В 25 только пятёрки, а они запись не портят.', uz: "25 da faqat beshlar bor, ular yozuvni buzmaydi.", en: 'Twenty five has only fives, and they do not spoil the decimal.' },
          { ru: '7 на 25 нацело не делится.', uz: "7 soni 25 ga butun bo'linmaydi.", en: 'Seven does not divide by 25 exactly.' },
        ],
      },
      {
        q: { ru: 'Какая запись у 4/9?', uz: '4/9 qanday yoziladi?', en: 'What is 4/9 like?' },
        opts: [
          { ru: 'Конечная', uz: 'Chekli', en: 'Finite' },
          { ru: 'Периодическая', uz: 'Davriy', en: 'Repeating' },
          { ru: 'Ровно 0,5', uz: 'Roppa-rosa 0,5', en: 'Exactly 0.5' },
        ],
        correct: 1,
        ok: { ru: 'Верно. 9 = 3 · 3, тройки дают период: 0,(4).', uz: "To'g'ri. 9 = 3 · 3, uchlar davr beradi: 0,(4).", en: 'Right. 9 = 3 · 3 and threes create a period: 0.(4).' },
        wrong: [
          { ru: 'Конечной она была бы только при двойках и пятёрках.', uz: "Chekli bo'lishi uchun faqat ikki va besh kerak edi.", en: 'It would be finite only with twos and fives.' },
          null,
          { ru: '0,5 — это 1/2, а 4/9 чуть меньше.', uz: '0,5 bu 1/2, 4/9 esa sal kichik.', en: '0.5 is 1/2, and 4/9 is slightly less.' },
        ],
      },
      {
        q: { ru: 'Какая запись у 6/15?', uz: '6/15 qanday yoziladi?', en: 'What is 6/15 like?' },
        opts: [
          { ru: 'Конечная', uz: 'Chekli', en: 'Finite' },
          { ru: 'Периодическая', uz: 'Davriy', en: 'Repeating' },
          { ru: 'Зависит от округления', uz: "Yaxlitlashga bog'liq", en: 'Depends on the rounding' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 6/15 сокращается до 2/5, а 5 даёт конечную запись 0,4.', uz: "To'g'ri. 6/15 qisqarib 2/5 bo'ladi, 5 esa chekli yozuv beradi: 0,4.", en: 'Right. 6/15 reduces to 2/5, and 5 gives the finite 0.4.' },
        wrong: [
          null,
          { ru: 'Сначала сократи: в 15 есть тройка, но она уходит.', uz: "Avval qisqartiring: 15 da uch bor, lekin u ketadi.", en: 'Reduce first: the three in 15 cancels out.' },
          { ru: 'Округление тут ни при чём: важен знаменатель.', uz: "Yaxlitlashning aloqasi yo'q: maxraj muhim.", en: 'Rounding is irrelevant here: the denominator decides.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика. Сначала сокращайте дробь, потом смотрите на знаменатель.',
        uz: 'Mashq. Avval kasrni qisqartiring, keyin maxrajga qarang.',
        en: 'Practice. Reduce the fraction first, then look at the denominator.',
      },
    },
  },

  s_rnd: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Округление', uz: 'Yaxlitlash', en: 'Rounding' },
    lead: { ru: 'Смотри только на одну цифру после нужного разряда.', uz: 'Kerakli xonadan keyingi bitta raqamga qarang.', en: 'Look at just one digit after the place you need.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Округли 4,62 до десятых', uz: "4,62 ni o'ndanlargacha yaxlitlang", en: 'Round 4.62 to tenths' },
        opts: ['4,6', '4,7', '5'],
        correct: 0,
        ok: { ru: 'Верно. После десятых стоит 2, это меньше 5.', uz: "To'g'ri. O'ndanlardan keyin 2 turadi, u 5 dan kichik.", en: 'Right. After tenths comes 2, which is less than 5.' },
        wrong: [
          null,
          { ru: 'Разряд растёт только при 5 и больше.', uz: "Xona faqat 5 va kattaroqda oshadi.", en: 'The place grows only for 5 or more.' },
          { ru: 'Это округление до целых, а просят до десятых.', uz: "Bu butungacha yaxlitlash, so'ralgani o'ndanlargacha.", en: 'That is rounding to whole numbers, but tenths were asked.' },
        ],
      },
      {
        q: { ru: 'Округли 0,375 до сотых', uz: '0,375 ni yuzdanlargacha yaxlitlang', en: 'Round 0.375 to hundredths' },
        opts: ['0,37', '0,38', '0,4'],
        correct: 1,
        ok: { ru: 'Верно. После сотых стоит 5, значит сотые растут.', uz: "To'g'ri. Yuzdanlardan keyin 5 turadi, demak yuzdanlar oshadi.", en: 'Right. After hundredths comes 5, so the hundredths go up.' },
        wrong: [
          { ru: 'При пятёрке разряд увеличивают, а не оставляют.', uz: 'Besh bo\'lsa xona oshadi, qolmaydi.', en: 'With a five the place goes up, it does not stay.' },
          null,
          { ru: 'Это округление до десятых.', uz: "Bu o'ndanlargacha yaxlitlash.", en: 'That is rounding to tenths.' },
        ],
      },
      {
        q: { ru: 'Округли 3,(3) до десятых', uz: "3,(3) ni o'ndanlargacha yaxlitlang", en: 'Round 3.(3) to tenths' },
        opts: ['3,3', '3,4', '3'],
        correct: 0,
        ok: { ru: 'Верно. В периоде тройка, она меньше 5.', uz: "To'g'ri. Davrda uch turibdi, u 5 dan kichik.", en: 'Right. The repeating digit is three, less than 5.' },
        wrong: [
          null,
          { ru: 'Хвост из троек не дотягивает до половины десятой.', uz: "Uchlardan iborat dum o'ndanning yarmiga yetmaydi.", en: 'A tail of threes never reaches half a tenth.' },
          { ru: 'Это округление до целых.', uz: 'Bu butungacha yaxlitlash.', en: 'That is rounding to whole numbers.' },
        ],
      },
      {
        q: { ru: 'Округли 12,96 до десятых', uz: "12,96 ni o'ndanlargacha yaxlitlang", en: 'Round 12.96 to tenths' },
        opts: ['12,9', '13', '13,0'],
        correct: 2,
        ok: { ru: 'Верно. 9 десятых плюс единица дают 13,0: разряд переполнился.', uz: "To'g'ri. To'qqiz o'ndanga bir qo'shilsa 13,0 chiqadi: xona to'lib ketdi.", en: 'Right. Nine tenths plus one gives 13.0: the place overflowed.' },
        wrong: [
          { ru: 'После десятых стоит 6, значит разряд растёт.', uz: "O'ndanlardan keyin 6 turadi, demak xona oshadi.", en: 'After tenths comes 6, so the place goes up.' },
          { ru: 'Почти: до десятых пишут 13,0, чтобы разряд был виден.', uz: "Deyarli: o'ndanlargacha 13,0 deb yoziladi, xona ko'rinib tursin.", en: 'Almost: to tenths it is written 13.0 so the place stays visible.' },
          null,
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на округление. Одна цифра после нужного разряда решает всё.',
        uz: 'Yaxlitlash mashqi. Kerakli xonadan keyingi bitta raqam hammasini hal qiladi.',
        en: 'Rounding practice. One digit after the needed place decides everything.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Разложи по знаменателю', uz: 'Maxrajga qarab ajrating', en: 'Sort by the denominator' },
    lead: { ru: 'Только 2 и 5 в знаменателе — запись конечная.', uz: "Maxrajda faqat 2 va 5 bo'lsa — yozuv chekli.", en: 'Only 2 and 5 in the denominator means a finite decimal.' },
    bin_a: { ru: 'Конечная', uz: 'Chekli', en: 'Finite' },
    bin_b: { ru: 'Периодическая', uz: 'Davriy', en: 'Repeating' },
    cards: [
      { label: '1/4', bin: 'a' },
      { label: '1/3', bin: 'b' },
      { label: '3/5', bin: 'a' },
      { label: '5/6', bin: 'b' },
      { label: '7/8', bin: 'a' },
      { label: '2/7', bin: 'b' },
    ],
    hint: {
      ru: 'Разложи знаменатель: если появились 3 или 7, будет период.',
      uz: "Maxrajni yoying: 3 yoki 7 chiqsa, davr bo'ladi.",
      en: 'Factor the denominator: if a 3 or a 7 shows up, there will be a period.',
    },
    correct_text: {
      ru: 'Верно. 4, 5 и 8 состоят только из двоек и пятёрок, а 3, 6 и 7 дают период.',
      uz: "To'g'ri. 4, 5 va 8 faqat ikki va beshdan iborat, 3, 6 va 7 esa davr beradi.",
      en: 'Right. 4, 5 and 8 are built only from twos and fives, while 3, 6 and 7 create a period.',
    },
    audio: {
      intro: {
        ru: 'Разложите дроби по двум корзинам. Считать не обязательно, смотрите на знаменатель.',
        uz: 'Kasrlarni ikki savatga ajrating. Hisoblash shart emas, maxrajga qarang.',
        en: 'Sort the fractions into two baskets. No need to compute, just look at the denominator.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Разложи знаменатель на простые множители.', uz: "Bu yerga emas. Maxrajni tub ko'paytuvchilarga yoying.", en: 'Not here. Factor the denominator into primes.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз округлил 2,449 до десятых так: 2,45, потом 2,5. Что не так?', uz: "Aziz 2,449 ni o'ndanlargacha shunday yaxlitladi: 2,45, keyin 2,5. Nimasi noto'g'ri?", en: 'Aziz rounded 2.449 to tenths as 2.45, then 2.5. What is wrong?' },
        opts: [
          { ru: 'Округлял по шагам, а надо сразу', uz: 'Qadamlab yaxlitladi, darrov qilish kerak edi', en: 'He rounded in steps instead of at once' },
          { ru: 'Ошибки нет', uz: "Xato yo'q", en: 'There is no mistake' },
          { ru: 'Неверно выбрал разряд', uz: "Xonani noto'g'ri tanladi", en: 'He picked the wrong place' },
        ],
        correct: 0,
        ok: { ru: 'Верно. После десятых стоит 4, значит ответ 2,4.', uz: "To'g'ri. O'ndanlardan keyin 4 turadi, demak javob 2,4.", en: 'Right. After tenths comes 4, so the answer is 2.4.' },
        wrong: [
          null,
          { ru: 'Ошибка есть: два округления подряд дали лишнюю десятую.', uz: "Xato bor: ketma-ket ikki yaxlitlash ortiqcha o'ndan berdi.", en: 'There is a mistake: two roundings added an extra tenth.' },
          { ru: 'Разряд он выбрал верно, ошибка в порядке действий.', uz: "Xonani to'g'ri tanladi, xato amallar tartibida.", en: 'The place is right; the order of actions is wrong.' },
        ],
      },
      {
        q: { ru: 'Дилноза: «0,(6) это то же самое, что 0,6». Проверь.', uz: "Dilnoza: «0,(6) bu 0,6 ning o'zi». Tekshiring.", en: 'Dilnoza: “0.(6) is the same as 0.6.” Check it.' },
        opts: [
          { ru: 'Нет: у 0,(6) шестёрки не кончаются, это больше', uz: "Yo'q: 0,(6) da oltilar tugamaydi, u kattaroq", en: 'No: in 0.(6) the sixes never end, so it is larger' },
          { ru: 'Да, одно и то же', uz: "Ha, bir xil", en: 'Yes, the same' },
          { ru: 'Нет, 0,(6) меньше', uz: "Yo'q, 0,(6) kichikroq", en: 'No, 0.(6) is smaller' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 0,(6) это 2/3, а 0,6 это 3/5. Первое чуть больше.', uz: "To'g'ri. 0,(6) bu 2/3, 0,6 esa 3/5. Birinchisi sal kattaroq.", en: 'Right. 0.(6) is 2/3 and 0.6 is 3/5. The first is slightly larger.' },
        wrong: [
          null,
          { ru: 'Скобки означают бесконечный хвост, он добавляет числу вес.', uz: "Qavs cheksiz dumni bildiradi, u songa vazn qo'shadi.", en: 'The brackets mean an endless tail, which adds to the number.' },
          { ru: 'Наоборот: бесконечные шестёрки делают число больше.', uz: "Aksincha: cheksiz oltilar sonni kattalashtiradi.", en: 'The opposite: the endless sixes make it larger.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в числе, и в самом правиле.',
        uz: "Birovning yechimini tekshiring. Xato sonda ham, qoidaning o'zida ham bo'lishi mumkin.",
        en: 'Check someone else’s work. A mistake can be in the number and in the rule itself.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Компот по кувшинам', uz: "Ko'zalarga kompot", en: 'Compote into jugs' },
    lead: { ru: '10 литров компота разливают в 3 кувшина поровну.', uz: "10 litr kompot 3 ta ko'zaga teng quyiladi.", en: '10 litres of compote are poured equally into 3 jugs.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сколько литров в одном кувшине?', uz: "Bitta ko'zada necha litr bo'ladi?", en: 'How many litres in one jug?' },
        opts: ['3,(3)', '3,3', '30'],
        correct: 0,
        ok: { ru: 'Верно. 10 : 3 = 3,(3) — тройка повторяется без конца.', uz: "To'g'ri. 10 : 3 = 3,(3) — uch cheksiz takrorlanadi.", en: 'Right. 10 ÷ 3 = 3.(3), the three repeats forever.' },
        wrong: [
          null,
          { ru: 'Почти: это уже округление, а точное значение с периодом.', uz: "Deyarli: bu allaqachon yaxlitlash, aniq qiymati esa davrli.", en: 'Almost: that is the rounded value; the exact one has a period.' },
          { ru: 'Слишком много: всего компота десять литров.', uz: "Juda ko'p: kompot jami o'n litr.", en: 'Too much: there are only ten litres in total.' },
        ],
      },
      {
        q: { ru: 'Сколько написать на ценнике, округлив до десятых?', uz: "Narx yorlig'iga o'ndanlargacha yaxlitlab nima yoziladi?", en: 'What goes on the label, rounded to tenths?' },
        opts: ['3,3 л', '3,4 л', '3 л'],
        correct: 0,
        ok: { ru: 'Верно. Следующая цифра 3, она меньше 5, значит 3,3 литра.', uz: "To'g'ri. Keyingi raqam 3, u 5 dan kichik, demak 3,3 litr.", en: 'Right. The next digit is 3, less than 5, so 3.3 litres.' },
        wrong: [
          null,
          { ru: 'Разряд растёт только при 5 и больше.', uz: 'Xona faqat 5 va kattaroqda oshadi.', en: 'The place grows only for 5 or more.' },
          { ru: 'Это округление до целых, а просят до десятых.', uz: "Bu butungacha yaxlitlash, so'ralgani o'ndanlargacha.", en: 'That is rounding to whole numbers, not tenths.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про компот. Десять литров разливают в три кувшина поровну.',
        uz: "Kompot haqida masala. O'n litr uchta ko'zaga teng quyiladi.",
        en: 'A compote problem. Ten litres are poured equally into three jugs.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 6,
        q: { ru: 'Округли 5,84 до десятых. Какая цифра станет в десятых? Набери её.', uz: "5,84 ni o'ndanlargacha yaxlitlang. O'ndanlar xonasida qaysi raqam turadi? Uni tering.", en: 'Round 5.84 to tenths. Which digit ends up in the tenths place? Type it.' },
        hint: { ru: 'После десятых стоит 4 — меньше 5, значит цифра 8 не меняется? Проверь ещё раз: 8 и 4.', uz: "O'ndanlardan keyin 4 turadi — 5 dan kichik. Yana bir bor tekshiring: 8 va 4.", en: 'After tenths comes 4, which is under 5. Check again: 8 and 4.' },
        hint_audio: { ru: 'Смотрите на цифру после десятых. Если она меньше пяти, десятые не меняются.', uz: "O'ndanlardan keyingi raqamga qarang. Agar u beshdan kichik bo'lsa, o'ndanlar o'zgarmaydi.", en: 'Look at the digit after tenths. If it is under five, the tenths do not change.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Какая дробь даёт периодическую запись?', uz: 'Qaysi kasr davriy yozuv beradi?', en: 'Which fraction gives a repeating decimal?' },
        opts: ['3/4', '9/20', '5/12', '7/50'],
        wrong: [
          { ru: '4 = 2 · 2, запись конечная: 0,75.', uz: '4 = 2 · 2, yozuv chekli: 0,75.', en: '4 = 2 · 2, so the decimal is finite: 0.75.' },
          { ru: '20 = 2 · 2 · 5, запись конечная: 0,45.', uz: '20 = 2 · 2 · 5, yozuv chekli: 0,45.', en: '20 = 2 · 2 · 5, so it is finite: 0.45.' },
          null,
          { ru: '50 = 2 · 5 · 5, запись конечная: 0,14.', uz: '50 = 2 · 5 · 5, yozuv chekli: 0,14.', en: '50 = 2 · 5 · 5, so it is finite: 0.14.' },
        ],
        correct: { ru: 'Верно. 12 = 2 · 2 · 3, тройка даёт период: 0,41(6).', uz: "To'g'ri. 12 = 2 · 2 · 3, uch davr beradi: 0,41(6).", en: 'Right. 12 = 2 · 2 · 3 and the three creates a period: 0.41(6).' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Округли 7,048 до сотых', uz: '7,048 ni yuzdanlargacha yaxlitlang', en: 'Round 7.048 to hundredths' },
        opts: ['7,04', '7,05', '7,1', '7,048'],
        wrong: [
          { ru: 'После сотых стоит 8, значит разряд растёт.', uz: 'Yuzdanlardan keyin 8 turadi, demak xona oshadi.', en: 'After hundredths comes 8, so the place goes up.' },
          null,
          { ru: 'Это округление до десятых.', uz: "Bu o'ndanlargacha yaxlitlash.", en: 'That is rounding to tenths.' },
          { ru: 'Число не изменилось: округления не было.', uz: "Son o'zgarmadi: yaxlitlash bo'lmadi.", en: 'The number is unchanged: no rounding happened.' },
        ],
        correct: { ru: 'Верно. 4 сотых плюс единица дают 5 сотых.', uz: "To'g'ri. To'rt yuzdanga bir qo'shilsa besh yuzdan bo'ladi.", en: 'Right. Four hundredths plus one gives five hundredths.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Что значит запись 0,(27)?', uz: '0,(27) yozuvi nimani anglatadi?', en: 'What does 0.(27) mean?' },
        opts: [
          { ru: 'Повторяются две цифры: 0,272727…', uz: 'Ikki raqam takrorlanadi: 0,272727…', en: 'Two digits repeat: 0.272727…' },
          { ru: 'Число ровно 0,27', uz: 'Son roppa-rosa 0,27', en: 'The number is exactly 0.27' },
          { ru: 'Повторяется только семёрка', uz: 'Faqat yetti takrorlanadi', en: 'Only the seven repeats' },
          { ru: 'Это округление до сотых', uz: 'Bu yuzdanlargacha yaxlitlash', en: 'It is a rounding to hundredths' },
        ],
        wrong: [
          null,
          { ru: 'Скобки как раз и означают, что запись не кончается.', uz: "Qavs aynan yozuv tugamasligini bildiradi.", en: 'The brackets mean exactly that the decimal does not end.' },
          { ru: 'В скобках обе цифры, значит повторяются обе.', uz: 'Qavsda ikkala raqam bor, demak ikkalasi takrorlanadi.', en: 'Both digits are in the brackets, so both repeat.' },
          { ru: 'Округление скобок не ставит.', uz: 'Yaxlitlash qavs qo\'ymaydi.', en: 'Rounding does not use brackets.' },
        ],
        correct: { ru: 'Верно. В скобках стоит период — повторяющаяся группа цифр.', uz: "To'g'ri. Qavsda davr, ya'ni takrorlanuvchi raqamlar guruhi turadi.", en: 'Right. The brackets hold the period, the repeating group of digits.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: '7 конфет делят на 3 детей. Сколько достанется каждому?', uz: "7 ta konfet 3 bolaga bo'linadi. Har biriga qancha tegadi?", en: 'Seven sweets are shared between three children. How much each?' },
        opts: ['2,7', '2,1', '3', '2,(3)'],
        wrong: [
          { ru: 'Это не то деление: 7 : 3 начинается с двух и трёх десятых.', uz: "Bu boshqa bo'lish: 7 : 3 ikki butun uch o'ndandan boshlanadi.", en: 'Not that division: 7 ÷ 3 starts at two point three.' },
          { ru: 'Проверь умножением: 2,1 · 3 = 6,3, а конфет 7.', uz: "Ko'paytirib tekshiring: 2,1 · 3 = 6,3, konfet esa 7 ta.", en: 'Check by multiplying: 2.1 · 3 = 6.3, but there are 7 sweets.' },
          { ru: 'Три на каждого это девять конфет, а их семь.', uz: "Har biriga uchtadan bo'lsa to'qqizta bo'ladi, ular esa yettita.", en: 'Three each would need nine sweets, and there are seven.' },
          null,
        ],
        correct: { ru: 'Верно. 7 : 3 = 2,(3), примерно 2,3 конфеты.', uz: "To'g'ri. 7 : 3 = 2,(3), taxminan 2,3 konfet.", en: 'Right. 7 ÷ 3 = 2.(3), about 2.3 sweets.' },
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
      ru: 'У дроби 1/7 период из шести цифр: 0,(142857). Умножь эти шесть цифр на 2, 3, 4, 5 или 6 — получатся те же цифры в том же порядке по кругу. Математики называют такие числа циклическими.',
      uz: "1/7 kasrining davri olti raqamdan iborat: 0,(142857). Shu olti raqamni 2, 3, 4, 5 yoki 6 ga ko'paytiring — o'sha raqamlar aylana bo'ylab o'sha tartibda chiqadi. Matematiklar bunday sonlarni siklik deb ataydi.",
      en: 'The fraction 1/7 has a six digit period: 0.(142857). Multiply those six digits by 2, 3, 4, 5 or 6 and the same digits come back in the same cyclic order. Mathematicians call such numbers cyclic.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? У дроби одна седьмая период из шести цифр: сто сорок две тысячи восемьсот пятьдесят семь. Если умножить это число на два, три, четыре, пять или шесть, получатся те же цифры в том же порядке по кругу. Такие числа называют циклическими.',
      uz: "Bilasizmi? Bir yettidan kasrining davri olti raqamdan iborat: bir yuz qirq ikki ming sakkiz yuz ellik yetti. Bu sonni ikkiga, uchga, to'rtga, beshga yoki oltiga ko'paytirsangiz, o'sha raqamlar aylana bo'ylab o'sha tartibda chiqadi. Bunday sonlar siklik deyiladi.",
      en: 'Did you know? The fraction one seventh has a six digit period: one hundred forty two thousand eight hundred fifty seven. Multiply it by two, three, four, five or six and the same digits return in the same cyclic order. Such numbers are called cyclic.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Десятичные дроби', uz: "Matematika · O'nli kasrlar", en: 'Mathematics · Decimals' },
    heading: { ru: 'Период и округление', uz: 'Davr va yaxlitlash', en: 'Periods and rounding' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'в знаменателе только 2 и 5 — запись конечная', uz: 'maxrajda faqat 2 va 5 — yozuv chekli', en: 'only 2 and 5 below: the decimal ends' },
    brief_2: { ru: 'иначе появляется период в скобках', uz: 'aks holda qavsdagi davr paydo bo\'ladi', en: 'otherwise a period appears in brackets' },
    brief_3: { ru: 'округляем по одной следующей цифре', uz: 'bitta keyingi raqamga qarab yaxlitlaymiz', en: 'round by the single next digit' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Период', uz: 'Davr', en: 'Period' },
    memo_a1: { ru: 'повторяющиеся цифры в скобках', uz: 'qavsdagi takrorlanuvchi raqamlar', en: 'the repeating digits in brackets' },
    memo_q2: { ru: 'Правило округления', uz: 'Yaxlitlash qoidasi', en: 'Rounding rule' },
    memo_a2: { ru: 'меньше 5 — оставляем, 5 и больше — растёт', uz: '5 dan kichik — qoladi, 5 va katta — oshadi', en: 'under 5 stays, 5 or more goes up' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'округлять по шагам', uz: 'qadamlab yaxlitlash', en: 'rounding in steps' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Если у несократимой дроби в знаменателе только двойки и пятёрки, десятичная запись конечная, иначе появляется период. Округляют по одной следующей цифре и только один раз.',
        'Компот: десять литров на три кувшина это три целых три в периоде, примерно три целых три десятых литра.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Qisqarmas kasr maxrajida faqat ikki va besh bo'lsa, o'nli yozuv chekli, aks holda davr paydo bo'ladi. Yaxlitlash bitta keyingi raqamga qarab va faqat bir marta qilinadi.",
        "Kompot: o'n litr uchta ko'zaga bu uch butun, davrda uch, taxminan uch butun uch o'ndan litr.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'If an irreducible fraction has only twos and fives in the denominator, the decimal is finite, otherwise a period appears. Round by the single next digit and only once.',
        'The compote: ten litres into three jugs is three point three repeating, about three point three litres.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Проверить знаменатель', uz: 'Usul. Maxrajni tekshirish', en: 'Method. Check the denominator' },
    m1_steps: {
      ru: ['Сократи дробь до несократимой', 'Разложи знаменатель на простые множители', 'Только 2 и 5 — запись конечная, иначе период'],
      uz: ['Kasrni qisqarmas holga keltiring', "Maxrajni tub ko'paytuvchilarga yoying", 'Faqat 2 va 5 — chekli, aks holda davriy'],
      en: ['Reduce the fraction fully', 'Factor the denominator into primes', 'Only 2 and 5 means finite, otherwise a period'],
    },
    m1_no: {
      ru: 'Округление не меняет вид дроби: 0,(3) остаётся периодической, а 0,3 это уже другое число.',
      uz: "Yaxlitlash kasr turini o'zgartirmaydi: 0,(3) davriy bo'lib qoladi, 0,3 esa boshqa son.",
      en: 'Rounding does not change the kind: 0.(3) stays repeating, while 0.3 is a different number.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: кухня школьной столовой. На хуке вопрос, в итоге ответ.
// ============================================================
const JugSvg = ({ x, y, s = 1, level = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0 h34 v40 q0 6 -6 6 h-22 q-6 0 -6 -6 Z" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2"/>
    {level > 0 && (
      <path d={`M2 ${44 - level} h30 v${level - 4} q0 4 -4 4 h-22 q-4 0 -4 -4 Z`} fill="#D9603F" opacity="0.75"/>
    )}
    <path d="M34 10 q12 4 12 14 q0 10 -12 12" fill="none" stroke="#C9A472" strokeWidth="2.6"/>
  </g>
);

const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d15wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d15wall)"/>

    {/* Кафель на стене и полка с посудой */}
    <g opacity="0.35">
      {[0, 26, 52, 78].map((ty) => <path key={ty} d={`M0 ${ty + 8} h400`} stroke="#DCCFB6" strokeWidth="1"/>)}
      {[0, 40, 80, 120, 160, 200, 240, 280, 320, 360].map((tx) => <path key={tx} d={`M${tx} 8 v80`} stroke="#DCCFB6" strokeWidth="1"/>)}
    </g>
    <g>
      <rect x="12" y="30" width="92" height="6" rx="2" fill="#C9A472"/>
      {[18, 40, 62, 84].map((px, i) => (
        <circle key={px} cx={px + 6} cy="24" r="7" fill={['#E5DAC6', '#DCEDF5', '#E5DAC6', '#FBF3D6'][i]} stroke="#C9A472"/>
      ))}
    </g>

    {/* Котёл на плите: пар поднимается */}
    <g>
      <rect x="132" y="66" width="88" height="46" rx="6" fill="#8E8578"/>
      <ellipse cx="176" cy="66" rx="44" ry="9" fill="#6F6759"/>
      <ellipse cx="176" cy="66" rx="36" ry="7" fill="#D9603F" opacity="0.8"/>
      <path d="M124 78 h-10 M228 78 h10" stroke="#6F6759" strokeWidth="5" strokeLinecap="round"/>
      <g className="d15-steam">
        <path d="M160 58 q5 -8 0 -15 q-5 -7 0 -13" stroke="#C9C7C2" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M186 60 q5 -7 0 -13 q-5 -6 0 -11" stroke="#C9C7C2" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </g>
    </g>

    {/* Половник наливает: движение принадлежит сцене */}
    <g className="d15-ladle">
      <path d="M232 60 l22 -20" stroke="#B08A57" strokeWidth="3" strokeLinecap="round"/>
      <path d="M226 60 a8 8 0 0 0 14 0 Z" fill="#8E8578"/>
    </g>

    {/* Три кувшина: пока пустые, ответа на сцене нет */}
    <JugSvg x={252} y={66} s={0.9}/>
    <JugSvg x={300} y={66} s={0.9}/>
    <JugSvg x={348} y={66} s={0.9}/>

    {/* Повар и дежурный */}
    <Person x={60} ground={124} head={13} shirt="#FFFDF7" hair="#3E3128"/>
    <Person x={104} ground={124} head={12} shirt="#7ECBE6" hair="#5A4636"/>

    {/* Стол раздачи */}
    <rect x="0" y="120" width="400" height="34" fill="#D2A96F"/>
    <rect x="0" y="120" width="400" height="5" fill="#C9884A"/>
    <g>
      <rect x="150" y="128" width="60" height="16" rx="3" fill="#FFFDF7" stroke="#E9E3D9"/>
      {[158, 172, 186, 200].map((gx) => <circle key={gx} cx={gx} cy="136" r="4" fill="#F5C77E"/>)}
    </g>
  </svg>
);

// Итог: три кувшина налиты одинаково, под ними запись с периодом.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
    <JugSvg x={70} y={8} s={1.05} level={30}/>
    <JugSvg x={170} y={8} s={1.05} level={30}/>
    <JugSvg x={270} y={8} s={1.05} level={30}/>
    <g fill="#1F7A4D" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fontSize="14">
      <text x="200" y="82" textAnchor="middle">10 : 3 = 3,(3)</text>
    </g>
  </svg>
);

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
const Line = ({ node, on }) => (
  <span className={'d15-line d15-fade' + (on ? ' d15-on' : '')}>{mt(node)}</span>
);

// Лента цифр: период подсвечен и повторяется.
const Digits = ({ head, period, times = 3, tail = true }) => (
  <span className="d15-digits">
    <b>{head}</b>
    {Array.from({ length: times }, (_, i) => <i key={i}>{period}</i>)}
    {tail && <span className="d15-tail">…</span>}
  </span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d15-stage">
        {c.rows.map((r, i) => (
          <span key={r.dec} className={'d15-pairline d15-fade' + (step >= i ? ' d15-on' : '')}>
            <Frac n={r.n} d={r.d} size="mid"/>
            <span className="d15-op">=</span>
            <b className="d15-dec d15-dec-ok">{r.dec}</b>
          </span>
        ))}
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Ядро: деление уголком, остаток повторяется.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d15-stage">
        <span className="d15-rests">
          {[1, 1, 1].map((r, i) => (
            <i key={i} className={'d15-fade' + (step >= (i === 0 ? 0 : 1) ? ' d15-on' : '')}>{r}</i>
          ))}
        </span>
        {c.steps.map((s, i) => <Line key={i} node={t(s)} on={step >= i}/>)}
        <span className={'d15-fade' + (step >= 2 ? ' d15-on' : '')}>
          <Digits head="3," period="3"/>
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

const RoundBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_round;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d15-stage">
        {c.lines.map((l, i) => (
          <span key={i} className={'d15-pair d15-fade' + (step >= Math.min(i, 2) ? ' d15-on' : '')
            + (i === 2 ? ' d15-pair-up' : ' d15-pair-keep')}>
            <Line node={t(l)} on/>
          </span>
        ))}
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
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>
      <div className="frame fade-up delay-1 d15-stage">
        <span className={'d15-fade' + (step >= 1 ? ' d15-on' : '')}>
          <Digits head="0," period="45"/>
        </span>
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

// Граница: округление по шагам и обрыв периода.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d15-stage">
        <span className="d15-pair d15-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d15-pair d15-pair-good d15-fade' + (step >= 1 ? ' d15-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d15-pair d15-pair-warn d15-fade' + (step >= 2 ? ' d15-on' : '')}>
          <Line node={t(c.keep_line)} on/>
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
        correctAnswer: pickL(c.play_opts[c.play_correct], lang), studentAnswer: pickL(c.play_opts[i], lang),
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
        <div className={'d15-banner fade-up delay-1' + (phase === 'play' ? ' d15-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d15-stage d15-stage-tool">
          {phase === 'demo' ? (
            <>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <span className={'d15-fade' + (done ? ' d15-on' : '')}>
                <Digits head="0,8" period="3"/>
              </span>
              <p className={'body d15-verdict' + (done ? ' d15-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
            </>
          ) : (
            <>
              <p className="body" style={{ margin: '0 0 10px', fontWeight: 600 }}>{mt(t(c.play_ask))}</p>
              <div className="sv-opts sv-opts-col">
                {c.play_opts.map((o, i) => (
                  <button key={i} className={'option'
                    + (solved && i === c.play_correct ? ' option-correct' : '')
                    + (!solved && picked === i ? ' option-picked-wrong' : '')}
                  disabled={solved} onClick={() => answer(i)}>{t(o)}</button>
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
          <div className="d15-acts fade-up">
            <button className="d15-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d15-btn d15-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenRound = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_round} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <RoundBody step={step}/>}/>
);
const ScreenSolve = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_solve} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <SolveBody step={step}/>}/>
);
const ScreenEdge = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_edge} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <EdgeBody step={step}/>}/>
);
const ScreenRule = (props) => (
  <RuleScreen {...props} screenContent={CONTENT.s_rule} totalScreens={TOTAL_SCREENS}
    exampleNode={(
      <div className="d15-stage">
        <Digits head="3," period="3"/>
        <span className="d15-pairline">
          <b className="d15-dec">3,(3)</b>
          <span className="d15-op">→</span>
          <b className="d15-dec d15-dec-ok">3,3</b>
        </span>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenKind = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_kind} asideNode={methodAside}/>
);
const ScreenRnd = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_rnd} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: три кувшина, во втором задании ценник с округлением.
const TaskFig = ({ idx }) => (
  <div className="d15-task-fig">
    <svg viewBox="0 0 240 60" aria-hidden="true">
      <JugSvg x={20} y={6} s={0.9} level={26}/>
      <JugSvg x={100} y={6} s={0.9} level={26}/>
      <JugSvg x={180} y={6} s={0.9} level={26}/>
    </svg>
    <span className="d15-task-cap">{idx >= 1 ? '3,3' : '3,(3)'}</span>
  </div>
);

const ScreenTask = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_task}
    figureNode={(it, idx) => <TaskFig idx={idx}/>}/>
);

const ScreenFinal = (props) => (
  <FinalPanel {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_final}
    factNode={<FactCard badge={FB_SCI} anim={<AnimDigits/>} text={CONTENT.s_final.fact}/>}/>
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
.d15-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d15-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d15-stage-tool .d15-line { font-size: clamp(12px, 2vw, 15px); }

.d15-fade { opacity: 0; transition: opacity 420ms linear; }
.d15-on { opacity: 1; }
.d15-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.3vw, 17px); font-weight: 700; color: #494550; }
.d15-op { font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 2.8vw, 21px); font-weight: 700; color: #8A8883; }
.d15-dec { font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.2vw, 25px); font-weight: 700; color: #494550; }
.d15-dec-ok { color: #1F7A4D; }
.d15-pairline { display: inline-flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center; }

/* Лента цифр: период выделен */
.d15-digits { display: inline-flex; align-items: baseline; gap: 2px; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(20px, 4vw, 30px); color: #494550; }
.d15-digits i { font-style: normal; padding: 0 3px; border-radius: 5px; background: #FBF3D6; color: #C99B3A; }
.d15-tail { color: #C9C7C2; letter-spacing: 2px; }

/* Повторяющиеся остатки */
.d15-rests { display: inline-flex; gap: 8px; }
.d15-rests i { display: grid; place-items: center; font-style: normal; width: clamp(24px, 5vw, 36px); height: clamp(24px, 5vw, 36px); border-radius: 50%; border: 2px dashed #C99B3A; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #C99B3A; }

/* Строки правил и границы */
.d15-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d15-pair-keep { background: #E7F5FA; border: 1px solid #B6DCEA; }
.d15-pair-up { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d15-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d15-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d15-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d15-task-fig { display: flex; flex-direction: column; gap: 4px; align-items: center; }
.d15-task-fig svg { width: clamp(160px, 40vw, 240px); height: auto; }
.d15-task-cap { font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 2.8vw, 21px); font-weight: 700; color: #1F7A4D; }

/* Экран 4 */
.d15-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d15-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d15-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d15-verdict-on { opacity: 1; }
.d15-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d15-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d15-btn:disabled { opacity: 0.45; cursor: default; }
.d15-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d15-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: пар над котлом и половник */
.d15-steam { animation: d15Steam 3400ms ease-in-out infinite; }
@keyframes d15Steam { 0%, 100% { opacity: 0.25; transform: translateY(2px); } 50% { opacity: 0.8; transform: translateY(-5px); } }
.d15-ladle { transform-origin: 232px 60px; animation: d15Ladle 5000ms ease-in-out infinite; }
@keyframes d15Ladle { 0%, 60%, 100% { transform: rotate(0deg); } 78% { transform: rotate(-14deg); } }
@media (prefers-reduced-motion: reduce) { .d15-steam, .d15-ladle { animation: none; } }

@media (max-width: 639.98px) {
  .d15-digits { font-size: 18px; }
  .d15-rests i { width: 22px; height: 22px; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function RepeatingDecimalsLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenRound, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenKind, ScreenRnd, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
