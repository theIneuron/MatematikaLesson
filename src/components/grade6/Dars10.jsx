// ============================================================
// 6 КЛАСС, УРОК 10 «Сложение и вычитание дробей с разными знаменателями»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Урок 9 научил приводить к общей разметке. Здесь на этой разметке
// начинают считать: одинаковые доли складываются и вычитаются как штуки.
//
// Сцена — стенгазета: лист ватмана, который класс закрашивает полосами.
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
  lessonId: 'grade6-10',
  lessonTitle: {
    ru: 'Сложение и вычитание дробей',
    uz: "Kasrlarni qo'shish va ayirish",
    en: 'Adding and subtracting fractions',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 devoriy gazeta: 1/3 va 1/4
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 umumiy maxraj esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 bir xil ulushlar qo'shiladi
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: keltir, qo'sh, qisqartir
  { id: 's_sub',    type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 ayirish ham xuddi shunday
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: 3/4 - 2/5
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: maxrajlar qo'shilmaydi
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_add',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 qo'shish x3
  { id: 's_minus',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 ayirish x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: yarimdan katta yoki kichik
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: gazeta
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Стенгазета на двоих', uz: 'Ikki kishilik devoriy gazeta', en: 'A wall paper for two' },
    lead: {
      ru: 'Класс готовит стенгазету. Азиз оформил 1/3 листа, Дилноза 1/4.',
      uz: "Sinf devoriy gazeta tayyorlayapti. Aziz varaqning 1/3 qismini, Dilnoza 1/4 qismini bezadi.",
      en: 'The class is making a wall paper. Aziz filled 1/3 of the sheet, Dilnoza 1/4.',
    },
    voice_a: { ru: 'Азиз: мы закрыли больше половины листа.', uz: "Aziz: varaqning yarmidan ko'pini to'ldirdik.", en: 'Aziz: we covered more than half the sheet.' },
    voice_b: { ru: 'Дилноза: нет, меньше половины.', uz: "Dilnoza: yo'q, yarmidan kam.", en: 'Dilnoza: no, less than half.' },
    ask: { ru: 'Кто прав?', uz: 'Kim haq?', en: 'Who is right?' },
    options: [
      { ru: 'Больше половины', uz: "Yarmidan ko'p", en: 'More than half' },
      { ru: 'Меньше половины', uz: 'Yarmidan kam', en: 'Less than half' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'Класс готовит стенгазету. Азиз оформил одну третью листа, Дилноза одну четвёртую.',
          'Азиз говорит, что вместе они закрыли больше половины листа, а Дилноза что меньше. Кто прав? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Sinf devoriy gazeta tayyorlayapti. Aziz varaqning bir uchdan qismini, Dilnoza bir to'rtdan qismini bezadi.",
          "Aziz birgalikda varaqning yarmidan ko'pini to'ldirdik deydi, Dilnoza esa kam deydi. Kim haq? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'The class is making a wall paper. Aziz filled one third of the sheet, Dilnoza one quarter.',
          'Aziz says together they covered more than half the sheet, Dilnoza says less. Who is right? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Сначала общая разметка', uz: 'Avval umumiy belgi', en: 'A shared scale first' },
    a: { n: 1, d: 3, to: { n: 4, d: 12 } },
    b: { n: 1, d: 4, to: { n: 3, d: 12 } },
    done: {
      ru: 'НОК(3, 4) = 12. Теперь обе части измерены одинаковыми долями — двенадцатыми.',
      uz: "EKUK(3, 4) = 12. Endi ikkala qism bir xil ulushlar bilan, o'n ikkidanlar bilan o'lchandi.",
      en: 'LCM(3, 4) = 12. Now both parts are measured in the same twelfths.',
    },
    audio: {
      ru: [
        'Вспомним прошлый урок. Третьи и четвёртые доли складывать напрямую нельзя: клетки разного размера.',
        'Наименьшее общее кратное трёх и четырёх двенадцать. Одна третья становится четырьмя двенадцатыми.',
        'Одна четвёртая становится тремя двенадцатыми. Теперь обе части измерены одинаковыми долями, и с ними уже можно считать.',
      ],
      uz: [
        "O'tgan darsni eslaymiz. Uchdan va to'rtdan ulushlarni to'g'ridan-to'g'ri qo'shib bo'lmaydi: katakchalar har xil.",
        "Uch va to'rtning eng kichik umumiy karralisi o'n ikki. Bir uchdan to'rt o'n ikkidan bo'ladi.",
        "Bir to'rtdan uch o'n ikkidan bo'ladi. Endi ikkala qism bir xil ulushlar bilan o'lchandi va ular bilan hisoblasa bo'ladi.",
      ],
      en: [
        'Let us recall the last lesson. Thirds and quarters cannot be added directly: the cells differ in size.',
        'The least common multiple of three and four is twelve. One third becomes four twelfths.',
        'One quarter becomes three twelfths. Both parts are measured in the same units now, so we can count with them.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Складываем числители', uz: "Suratlarni qo'shamiz", en: 'Add the numerators' },
    sum: { n: 7, d: 12 },
    half: { n: 6, d: 12 },
    done: {
      ru: '4/12 и 3/12 — это 7 одинаковых долей. Половина листа — 6/12, значит закрыли больше половины. Прав был Азиз.',
      uz: "4/12 va 3/12 bu 7 ta bir xil ulush. Varaqning yarmi 6/12, demak yarmidan ko'pi to'ldirilgan. Aziz haq edi.",
      en: '4/12 and 3/12 make 7 equal parts. Half the sheet is 6/12, so more than half is covered. Aziz was right.',
    },
    audio: {
      ru: [
        'Доли стали одинаковыми, и теперь их можно считать как предметы. Четыре двенадцатых и три двенадцатых.',
        'Всего семь двенадцатых. Знаменатель не меняется: доля осталась той же, изменилось только их количество.',
        'Половина листа это шесть двенадцатых. Семь больше шести, значит закрыли больше половины. Прав был Азиз.',
      ],
      uz: [
        "Ulushlar bir xil bo'ldi, endi ularni narsalar kabi sanash mumkin. To'rt o'n ikkidan va uch o'n ikkidan.",
        "Jami yetti o'n ikkidan. Maxraj o'zgarmaydi: ulushning o'zi o'sha, faqat soni o'zgardi.",
        "Varaqning yarmi olti o'n ikkidan. Yetti oltidan katta, demak yarmidan ko'pi to'ldirilgan. Aziz haq edi.",
      ],
      en: [
        'The parts are equal now, so they can be counted like objects. Four twelfths and three twelfths.',
        'Seven twelfths in total. The denominator stays: the part itself is the same, only how many changed.',
        'Half the sheet is six twelfths. Seven is more than six, so more than half is covered. Aziz was right.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Три шага сложения', uz: "Qo'shishning uch qadami", en: 'Three steps of addition' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: '1/6 + 1/4', uz: '1/6 + 1/4', en: '1/6 + 1/4' },
      { ru: 'НОК(6, 4) = 12 → 2/12 + 3/12', uz: 'EKUK(6, 4) = 12 → 2/12 + 3/12', en: 'LCM(6, 4) = 12 → 2/12 + 3/12' },
      { ru: '2 + 3 = 5 → 5/12', uz: '2 + 3 = 5 → 5/12', en: '2 + 3 = 5 → 5/12' },
    ],
    demo_note: {
      ru: 'Привели к общему знаменателю, сложили числители, знаменатель оставили. 5/12 дальше не сокращается.',
      uz: "Umumiy maxrajga keltirdik, suratlarni qo'shdik, maxrajni qoldirdik. 5/12 boshqa qisqarmaydi.",
      en: 'We reached a common denominator, added the numerators and kept the denominator. 5/12 does not reduce further.',
    },
    play_ask: { ru: 'Сколько будет 1/2 + 1/6?', uz: '1/2 + 1/6 nechaga teng?', en: 'What is 1/2 + 1/6?' },
    play_opts: ['2/8', '2/3', '1/3'],
    play_correct: 1,
    play_ok: {
      ru: 'Верно. 1/2 = 3/6, значит 3/6 + 1/6 = 4/6, а это 2/3 после сокращения.',
      uz: "To'g'ri. 1/2 = 3/6, demak 3/6 + 1/6 = 4/6, qisqartirilgandan keyin esa 2/3.",
      en: 'Right. 1/2 = 3/6, so 3/6 + 1/6 = 4/6, which reduces to 2/3.',
    },
    play_wrong: [
      { ru: 'Так сложили и числители, и знаменатели. Знаменатель — это размер доли, его не складывают.', uz: "Bunda surat ham, maxraj ham qo'shilgan. Maxraj ulush kattaligi, u qo'shilmaydi.", en: 'That added numerators and denominators. The denominator is the size of a part and is not added.' },
      null,
      { ru: 'Это разность, а не сумма: 3/6 минус 1/6 равно 2/6.', uz: "Bu ayirma, yig'indi emas: 3/6 minus 1/6 teng 2/6.", en: 'That is the difference, not the sum: 3/6 minus 1/6 is 2/6.' },
    ],
    audio: {
      intro: {
        ru: 'Способ из трёх шагов. Привести к общему знаменателю, сложить числители, знаменатель оставить прежним. Покажу на одной шестой и одной четвёртой.',
        uz: "Uch qadamli usul. Umumiy maxrajga keltirish, suratlarni qo'shish, maxrajni o'zgarishsiz qoldirish. Bir oltidan va bir to'rtdan misolida ko'rsataman.",
        en: 'A three step method. Bring to a common denominator, add the numerators, keep the denominator. I will show it on one sixth and one quarter.',
      },
      demo: {
        ru: 'Наименьшее общее кратное шести и четырёх двенадцать. Получаются две двенадцатых и три двенадцатых. Складываем числители и получаем пять двенадцатых.',
        uz: "Olti va to'rtning eng kichik umumiy karralisi o'n ikki. Ikki o'n ikkidan va uch o'n ikkidan chiqadi. Suratlarni qo'shamiz va besh o'n ikkidan chiqadi.",
        en: 'The least common multiple of six and four is twelve. That gives two twelfths and three twelfths. Add the numerators to get five twelfths.',
      },
      play: {
        ru: 'Теперь ваша очередь. Сколько будет одна вторая плюс одна шестая?',
        uz: "Endi sizning navbatingiz. Bir ikkidan qo'shuv bir oltidan nechaga teng?",
        en: 'Now it is your turn. What is one half plus one sixth?',
      },
      ok: {
        ru: 'Верно. Одна вторая это три шестых, вместе с одной шестой выходит четыре шестых, то есть две третьих.',
        uz: "To'g'ri. Bir ikkidan bu uch oltidan, bir oltidan bilan birga to'rt oltidan, ya'ni ikki uchdan chiqadi.",
        en: 'Right. One half is three sixths, together with one sixth that is four sixths, which is two thirds.',
      },
      wrong: {
        ru: 'Сначала приведите дроби к одному знаменателю, потом складывайте только числители.',
        uz: "Avval kasrlarni bitta maxrajga keltiring, keyin faqat suratlarni qo'shing.",
        en: 'First bring the fractions to one denominator, then add only the numerators.',
      },
    },
  },

  s_sub: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Вычитание тем же способом', uz: "Ayirish ham shu usulda", en: 'Subtraction the same way' },
    lines: [
      { ru: '5/6 − 1/4', uz: '5/6 − 1/4', en: '5/6 − 1/4' },
      { ru: 'НОК(6, 4) = 12 → 10/12 − 3/12', uz: 'EKUK(6, 4) = 12 → 10/12 − 3/12', en: 'LCM(6, 4) = 12 → 10/12 − 3/12' },
      { ru: '10 − 3 = 7 → 7/12', uz: '10 − 3 = 7 → 7/12', en: '10 − 3 = 7 → 7/12' },
    ],
    done: {
      ru: 'Разница только в знаке: доли приводим к общим, а числители вычитаем.',
      uz: "Farq faqat ishorada: ulushlarni umumiyga keltiramiz, suratlarni esa ayiramiz.",
      en: 'The only difference is the sign: the parts are made equal and the numerators are subtracted.',
    },
    audio: {
      ru: [
        'Вычитание идёт по тому же плану. Пять шестых минус одна четвёртая.',
        'Общий знаменатель двенадцать. Получаются десять двенадцатых и три двенадцатых.',
        'Вычитаем числители: десять минус три равно семь. Ответ семь двенадцатых. Знаменатель снова не тронули.',
      ],
      uz: [
        "Ayirish ham xuddi shu reja bo'yicha boradi. Besh oltidan minus bir to'rtdan.",
        "Umumiy maxraj o'n ikki. O'n o'n ikkidan va uch o'n ikkidan chiqadi.",
        "Suratlarni ayiramiz: o'n minus uch teng yetti. Javob yetti o'n ikkidan. Maxrajga yana tegilmadi.",
      ],
      en: [
        'Subtraction follows the same plan. Five sixths minus one quarter.',
        'The common denominator is twelve. That gives ten twelfths and three twelfths.',
        'Subtract the numerators: ten minus three is seven. The answer is seven twelfths. The denominator was left alone again.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Посчитаем 3/4 − 2/5', uz: '3/4 − 2/5 ni hisoblaymiz', en: 'Let us compute 3/4 − 2/5' },
    lead: { ru: 'Знаменатели взаимно простые, поэтому НОК равен их произведению.', uz: "Maxrajlar o'zaro tub, shuning uchun EKUK ularning ko'paytmasiga teng.", en: 'The denominators are coprime, so the LCM is their product.' },
    steps: [
      { ru: 'НОК(4, 5) = 20', uz: 'EKUK(4, 5) = 20', en: 'LCM(4, 5) = 20' },
      { ru: '3/4 = 15/20, 2/5 = 8/20', uz: '3/4 = 15/20, 2/5 = 8/20', en: '3/4 = 15/20, 2/5 = 8/20' },
      { ru: '15 − 8 = 7 → 7/20', uz: '15 − 8 = 7 → 7/20', en: '15 − 8 = 7 → 7/20' },
    ],
    done: {
      ru: 'Ответ 7/20. У 7 и 20 общих делителей нет, сокращать нечего.',
      uz: "Javob 7/20. 7 va 20 da umumiy bo'luvchi yo'q, qisqartirishga narsa yo'q.",
      en: 'The answer is 7/20. Seven and twenty share no divisor, so nothing reduces.',
    },
    audio: {
      ru: [
        'Решаем вместе. Три четвёртых минус две пятых. Четыре и пять взаимно простые, общий знаменатель двадцать.',
        'Три четвёртых это пятнадцать двадцатых, две пятых это восемь двадцатых.',
        'Пятнадцать минус восемь равно семь. Ответ семь двадцатых. Сократить его нельзя: у семи и двадцати общих делителей нет.',
      ],
      uz: [
        "Birga yechamiz. Uch to'rtdan minus ikki beshdan. To'rt va besh o'zaro tub, umumiy maxraj yigirma.",
        "Uch to'rtdan bu o'n besh yigirmadan, ikki beshdan bu sakkiz yigirmadan.",
        "O'n besh minus sakkiz teng yetti. Javob yetti yigirmadan. Uni qisqartirib bo'lmaydi: yetti va yigirmada umumiy bo'luvchi yo'q.",
      ],
      en: [
        'Let us solve it together. Three quarters minus two fifths. Four and five are coprime, so the common denominator is twenty.',
        'Three quarters is fifteen twentieths, two fifths is eight twentieths.',
        'Fifteen minus eight is seven. The answer is seven twentieths and it cannot be reduced: seven and twenty share no divisor.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilinadi', en: 'Where mistakes happen' },
    title: { ru: 'Знаменатели не складывают', uz: "Maxrajlar qo'shilmaydi", en: 'Denominators are never added' },
    bad_line: { ru: '1/2 + 1/3 = 2/5', uz: '1/2 + 1/3 = 2/5', en: '1/2 + 1/3 = 2/5' },
    good_line: { ru: '1/2 + 1/3 = 3/6 + 2/6 = 5/6', uz: '1/2 + 1/3 = 3/6 + 2/6 = 5/6', en: '1/2 + 1/3 = 3/6 + 2/6 = 5/6' },
    done: {
      ru: 'Проверка прикидкой: сумма не может быть меньше слагаемого, а 2/5 меньше 1/2. Значит запись неверная.',
      uz: "Chamalab tekshirish: yig'indi qo'shiluvchidan kichik bo'lolmaydi, 2/5 esa 1/2 dan kichik. Demak yozuv noto'g'ri.",
      en: 'A quick check: a sum cannot be smaller than one of its terms, and 2/5 is less than 1/2. So the line is wrong.',
    },
    audio: {
      ru: [
        'Самая частая ошибка в теме. Складывают числители и заодно знаменатели и пишут две пятых.',
        'Так нельзя. Знаменатель говорит, какого размера доля, а не сколько их. Складывать можно только одинаковые доли.',
        'Проверить легко на глаз. Сумма не бывает меньше слагаемого, а две пятых меньше одной второй. Верный ответ пять шестых.',
      ],
      uz: [
        "Mavzudagi eng ko'p uchraydigan xato. Suratlarni ham, maxrajlarni ham qo'shib, ikki beshdan deb yozishadi.",
        "Bunday qilib bo'lmaydi. Maxraj ulush kattaligini aytadi, sonini emas. Faqat bir xil ulushlarni qo'shish mumkin.",
        "Buni ko'z bilan tekshirish oson. Yig'indi qo'shiluvchidan kichik bo'lmaydi, ikki beshdan esa bir ikkidandan kichik. To'g'ri javob besh oltidan.",
      ],
      en: [
        'The most common mistake in this topic. People add the numerators and the denominators and write two fifths.',
        'That is not allowed. The denominator says how large a part is, not how many. Only equal parts can be added.',
        'It is easy to check by eye. A sum is never smaller than a term, and two fifths is less than one half. The right answer is five sixths.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Как складывать и вычитать', uz: "Qanday qo'shiladi va ayiriladi", en: 'How to add and subtract' },
    rule_1: {
      ru: 'Приводим дроби к общему знаменателю, складываем или вычитаем числители, знаменатель оставляем прежним. Ответ по возможности сокращаем.',
      uz: "Kasrlarni umumiy maxrajga keltiramiz, suratlarni qo'shamiz yoki ayiramiz, maxrajni o'zgarishsiz qoldiramiz. Javobni imkon bo'lsa qisqartiramiz.",
      en: 'Bring the fractions to a common denominator, add or subtract the numerators and keep the denominator. Reduce the answer if possible.',
    },
    rule_2: {
      ru: 'Знаменатели никогда не складывают. Стенгазета: 1/3 + 1/4 = 7/12, а половина листа 6/12. Прав был Азиз.',
      uz: "Maxrajlar hech qachon qo'shilmaydi. Devoriy gazeta: 1/3 + 1/4 = 7/12, varaqning yarmi esa 6/12. Aziz haq edi.",
      en: 'Denominators are never added. The wall paper: 1/3 + 1/4 = 7/12, and half the sheet is 6/12. Aziz was right.',
    },
    audio: {
      ru: 'Запомним правило. Приводим дроби к общему знаменателю, складываем или вычитаем числители, а знаменатель оставляем прежним. Ответ по возможности сокращаем. Знаменатели не складывают никогда. Вернёмся к стенгазете. Одна третья плюс одна четвёртая это семь двенадцатых, а половина листа шесть двенадцатых. Значит закрыли больше половины и прав был Азиз.',
      uz: "Qoidani eslab qolamiz. Kasrlarni umumiy maxrajga keltiramiz, suratlarni qo'shamiz yoki ayiramiz, maxrajni esa o'zgarishsiz qoldiramiz. Javobni imkon bo'lsa qisqartiramiz. Maxrajlar hech qachon qo'shilmaydi. Devoriy gazetaga qaytamiz. Bir uchdan qo'shuv bir to'rtdan bu yetti o'n ikkidan, varaqning yarmi esa olti o'n ikkidan. Demak yarmidan ko'pi to'ldirilgan va Aziz haq edi.",
      en: 'Let us remember the rule. Bring the fractions to a common denominator, add or subtract the numerators and keep the denominator. Reduce the answer if possible. Denominators are never added. Back to the wall paper. One third plus one quarter is seven twelfths, and half the sheet is six twelfths. So more than half is covered and Aziz was right.',
    },
  },

  s_add: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Сложение', uz: "Qo'shish", en: 'Addition' },
    lead: { ru: 'Сначала общий знаменатель, потом числители.', uz: 'Avval umumiy maxraj, keyin suratlar.', en: 'The common denominator first, then the numerators.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '1/4 + 1/8', uz: '1/4 + 1/8', en: '1/4 + 1/8' },
        opts: ['2/12', '3/8', '1/2'],
        correct: 1,
        ok: { ru: 'Верно. 1/4 = 2/8, и 2/8 + 1/8 = 3/8.', uz: "To'g'ri. 1/4 = 2/8, va 2/8 + 1/8 = 3/8.", en: 'Right. 1/4 = 2/8 and 2/8 + 1/8 = 3/8.' },
        wrong: [
          { ru: 'Здесь сложены и числители, и знаменатели.', uz: "Bu yerda surat ham, maxraj ham qo'shilgan.", en: 'Here both numerators and denominators were added.' },
          null,
          { ru: '1/2 — это 4/8, а сумма 3/8.', uz: "1/2 bu 4/8, yig'indi esa 3/8.", en: 'A half is 4/8, and the sum is 3/8.' },
        ],
      },
      {
        q: { ru: '1/3 + 1/6', uz: '1/3 + 1/6', en: '1/3 + 1/6' },
        opts: ['1/2', '2/9', '1/9'],
        correct: 0,
        ok: { ru: 'Верно. 1/3 = 2/6, и 2/6 + 1/6 = 3/6 = 1/2.', uz: "To'g'ri. 1/3 = 2/6, va 2/6 + 1/6 = 3/6 = 1/2.", en: 'Right. 1/3 = 2/6 and 2/6 + 1/6 = 3/6 = 1/2.' },
        wrong: [
          null,
          { ru: 'Знаменатели не складывают: 3 и 6 приводят к 6.', uz: "Maxrajlar qo'shilmaydi: 3 va 6 oltiga keltiriladi.", en: 'Denominators are not added: 3 and 6 go to 6.' },
          { ru: 'Сумма не может быть меньше слагаемого 1/3.', uz: "Yig'indi 1/3 qo'shiluvchidan kichik bo'lolmaydi.", en: 'A sum cannot be less than the term 1/3.' },
        ],
      },
      {
        q: { ru: '2/5 + 1/2', uz: '2/5 + 1/2', en: '2/5 + 1/2' },
        opts: ['3/7', '9/10', '3/10'],
        correct: 1,
        ok: { ru: 'Верно. 2/5 = 4/10, 1/2 = 5/10, вместе 9/10.', uz: "To'g'ri. 2/5 = 4/10, 1/2 = 5/10, birgalikda 9/10.", en: 'Right. 2/5 = 4/10, 1/2 = 5/10, together 9/10.' },
        wrong: [
          { ru: 'Так сложены знаменатели, а это запрещено.', uz: "Bu yerda maxrajlar qo'shilgan, bunday qilib bo'lmaydi.", en: 'The denominators were added, which is not allowed.' },
          null,
          { ru: '3/10 меньше, чем 1/2, а сумма должна быть больше.', uz: "3/10 soni 1/2 dan kichik, yig'indi esa kattaroq bo'lishi kerak.", en: '3/10 is less than a half, and the sum must be larger.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на сложение. Не забывайте про общий знаменатель.',
        uz: "Qo'shish mashqi. Umumiy maxrajni unutmang.",
        en: 'Addition practice. Do not forget the common denominator.',
      },
    },
  },

  s_minus: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Вычитание', uz: 'Ayirish', en: 'Subtraction' },
    lead: { ru: 'План тот же: общий знаменатель, потом числители.', uz: 'Reja o\'sha: umumiy maxraj, keyin suratlar.', en: 'The same plan: common denominator, then numerators.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '3/4 − 1/2', uz: '3/4 − 1/2', en: '3/4 − 1/2' },
        opts: ['2/2', '1/4', '1/2'],
        correct: 1,
        ok: { ru: 'Верно. 1/2 = 2/4, и 3/4 − 2/4 = 1/4.', uz: "To'g'ri. 1/2 = 2/4, va 3/4 − 2/4 = 1/4.", en: 'Right. 1/2 = 2/4 and 3/4 − 2/4 = 1/4.' },
        wrong: [
          { ru: 'Здесь вычтены и числители, и знаменатели.', uz: 'Bu yerda surat ham, maxraj ham ayirilgan.', en: 'Here both numerators and denominators were subtracted.' },
          null,
          { ru: '1/2 — это 2/4, а разность 1/4.', uz: '1/2 bu 2/4, ayirma esa 1/4.', en: 'A half is 2/4, and the difference is 1/4.' },
        ],
      },
      {
        q: { ru: '5/6 − 1/3', uz: '5/6 − 1/3', en: '5/6 − 1/3' },
        opts: ['1/2', '4/3', '2/3'],
        correct: 0,
        ok: { ru: 'Верно. 1/3 = 2/6, и 5/6 − 2/6 = 3/6 = 1/2.', uz: "To'g'ri. 1/3 = 2/6, va 5/6 − 2/6 = 3/6 = 1/2.", en: 'Right. 1/3 = 2/6 and 5/6 − 2/6 = 3/6 = 1/2.' },
        wrong: [
          null,
          { ru: 'Разность не бывает больше уменьшаемого 5/6.', uz: "Ayirma kamayuvchi 5/6 dan katta bo'lmaydi.", en: 'A difference is never larger than 5/6, the number we subtract from.' },
          { ru: '2/3 — это 4/6, а разность 3/6.', uz: '2/3 bu 4/6, ayirma esa 3/6.', en: 'Two thirds is 4/6, and the difference is 3/6.' },
        ],
      },
      {
        q: { ru: '7/10 − 1/5', uz: '7/10 − 1/5', en: '7/10 − 1/5' },
        opts: ['6/5', '1/2', '6/10'],
        correct: 1,
        ok: { ru: 'Верно. 1/5 = 2/10, 7/10 − 2/10 = 5/10 = 1/2.', uz: "To'g'ri. 1/5 = 2/10, 7/10 − 2/10 = 5/10 = 1/2.", en: 'Right. 1/5 = 2/10, 7/10 − 2/10 = 5/10 = 1/2.' },
        wrong: [
          { ru: 'Знаменатели при вычитании не трогают.', uz: 'Ayirishda maxrajlarga tegilmaydi.', en: 'Denominators are left alone when subtracting.' },
          null,
          { ru: 'Почти: 5/10 надо сократить до 1/2, а 6/10 это другое число.', uz: "Deyarli: 5/10 ni 1/2 gacha qisqartirish kerak, 6/10 esa boshqa son.", en: 'Almost: 5/10 should reduce to 1/2, and 6/10 is a different number.' },
        ],
      },
      {
        q: { ru: '1 − 3/8', uz: '1 − 3/8', en: '1 − 3/8' },
        opts: ['5/8', '3/8', '1/8'],
        correct: 0,
        ok: { ru: 'Верно. Единица — это 8/8, и 8/8 − 3/8 = 5/8.', uz: "To'g'ri. Bir bu 8/8, va 8/8 − 3/8 = 5/8.", en: 'Right. One is 8/8 and 8/8 − 3/8 = 5/8.' },
        wrong: [
          null,
          { ru: 'Это то, что вычитали. Осталось 8/8 минус 3/8.', uz: 'Bu ayirilgan son. Qolgani 8/8 minus 3/8.', en: 'That is what was subtracted. What remains is 8/8 minus 3/8.' },
          { ru: 'Слишком мало: от целого убрали меньше половины.', uz: 'Juda kam: butundan yarmidan kami olindi.', en: 'Too little: less than half was taken from the whole.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на вычитание. Целое можно записать дробью с нужным знаменателем.',
        uz: 'Ayirish mashqi. Butunni kerakli maxrajli kasr bilan yozish mumkin.',
        en: 'Subtraction practice. A whole can be written as a fraction with the denominator you need.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Больше или меньше половины', uz: 'Yarmidan katta yoki kichik', en: 'More or less than a half' },
    lead: { ru: 'Считать до конца не обязательно: сравни с половиной.', uz: 'Oxirigacha hisoblash shart emas: yarim bilan solishtiring.', en: 'You need not finish the computation: compare with a half.' },
    bin_a: { ru: 'Больше 1/2', uz: '1/2 dan katta', en: 'More than 1/2' },
    bin_b: { ru: 'Меньше 1/2', uz: '1/2 dan kichik', en: 'Less than 1/2' },
    cards: [
      { label: '1/3 + 1/4', bin: 'a' },
      { label: '1/6 + 1/4', bin: 'b' },
      { label: '1/2 + 1/8', bin: 'a' },
      { label: '3/4 − 1/3', bin: 'b' },
      { label: '2/3 − 1/12', bin: 'a' },
      { label: '5/6 − 1/2', bin: 'b' },
    ],
    hint: {
      ru: 'Приведи к общему знаменателю и сравни числитель с половиной знаменателя.',
      uz: 'Umumiy maxrajga keltiring va suratni maxrajning yarmi bilan solishtiring.',
      en: 'Bring to a common denominator and compare the numerator with half the denominator.',
    },
    correct_text: {
      ru: 'Верно. 7/12, 5/8 и 7/12 больше половины, а 5/12, 5/12 и 1/3 меньше.',
      uz: "To'g'ri. 7/12, 5/8 va 7/12 yarimdan katta, 5/12, 5/12 va 1/3 esa kichik.",
      en: 'Right. 7/12, 5/8 and 7/12 are more than a half, while 5/12, 5/12 and 1/3 are less.',
    },
    audio: {
      intro: {
        ru: 'Разложите примеры по двум корзинам. Считать до конца не обязательно, сравнивайте с половиной.',
        uz: 'Misollarni ikki savatga ajrating. Oxirigacha hisoblash shart emas, yarim bilan solishtiring.',
        en: 'Sort the expressions into two baskets. You need not finish the computation, just compare with a half.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Сравни числитель с половиной знаменателя.', uz: 'Bu yerga emas. Suratni maxrajning yarmi bilan solishtiring.', en: 'Not here. Compare the numerator with half the denominator.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: 1/4 + 1/3 = 2/7. Где ошибка?', uz: 'Aziz: 1/4 + 1/3 = 2/7. Xato qayerda?', en: 'Aziz: 1/4 + 1/3 = 2/7. Where is the mistake?' },
        opts: [
          { ru: 'Сложил и знаменатели', uz: "Maxrajlarni ham qo'shdi", en: 'He added the denominators too' },
          { ru: 'Ошибки нет', uz: "Xato yo'q", en: 'There is no mistake' },
          { ru: 'Неверно сократил', uz: "Noto'g'ri qisqartirdi", en: 'He reduced it wrongly' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Надо привести к 12: 3/12 + 4/12 = 7/12.', uz: "To'g'ri. 12 ga keltirish kerak: 3/12 + 4/12 = 7/12.", en: 'Right. Bring both to 12: 3/12 + 4/12 = 7/12.' },
        wrong: [
          null,
          { ru: 'Ошибка есть: 2/7 меньше 1/3, а сумма должна быть больше.', uz: "Xato bor: 2/7 soni 1/3 dan kichik, yig'indi esa kattaroq bo'lishi kerak.", en: 'There is a mistake: 2/7 is less than 1/3, and the sum must be larger.' },
          { ru: 'Сокращения здесь вообще не было.', uz: "Bu yerda qisqartirish umuman bo'lmagan.", en: 'There was no reducing here at all.' },
        ],
      },
      {
        q: { ru: 'Дилноза: 5/8 − 1/4 = 4/4. Проверь.', uz: 'Dilnoza: 5/8 − 1/4 = 4/4. Tekshiring.', en: 'Dilnoza: 5/8 − 1/4 = 4/4. Check it.' },
        opts: [
          { ru: 'Нет: надо 5/8 − 2/8 = 3/8', uz: "Yo'q: 5/8 − 2/8 = 3/8 bo'lishi kerak", en: 'No: it should be 5/8 − 2/8 = 3/8' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет 4/8', uz: "Yo'q, 4/8 bo'ladi", en: 'No, it is 4/8' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Вычли и числители, и знаменатели, а знаменатель трогать нельзя.', uz: "To'g'ri. Surat ham, maxraj ham ayirilgan, maxrajga esa tegib bo'lmaydi.", en: 'Right. Both numerators and denominators were subtracted, but the denominator must stay.' },
        wrong: [
          null,
          { ru: '4/4 — это целое, а разность меньше 5/8.', uz: "4/4 bu butun son, ayirma esa 5/8 dan kichik.", en: '4/4 is a whole, and the difference is less than 5/8.' },
          { ru: '1/4 это 2/8, значит 5/8 минус 2/8 равно 3/8.', uz: '1/4 bu 2/8, demak 5/8 minus 2/8 teng 3/8.', en: 'A quarter is 2/8, so 5/8 minus 2/8 is 3/8.' },
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
    title: { ru: 'Осталось место', uz: 'Joy qoldi', en: 'Space left over' },
    lead: { ru: 'На стенгазете Азиз занял 1/3 листа, Дилноза 1/4.', uz: "Devoriy gazetada Aziz varaqning 1/3, Dilnoza 1/4 qismini egalladi.", en: 'On the wall paper Aziz took 1/3 of the sheet and Dilnoza 1/4.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Какую часть листа они заняли вместе?', uz: 'Birgalikda varaqning qaysi qismini egallashdi?', en: 'What part of the sheet did they fill together?' },
        opts: ['7/12', '2/7', '5/12'],
        correct: 0,
        ok: { ru: 'Верно. 4/12 + 3/12 = 7/12.', uz: "To'g'ri. 4/12 + 3/12 = 7/12.", en: 'Right. 4/12 + 3/12 = 7/12.' },
        wrong: [
          null,
          { ru: 'Знаменатели не складывают.', uz: "Maxrajlar qo'shilmaydi.", en: 'Denominators are not added.' },
          { ru: '5/12 меньше: посчитай 1/3 как 4/12.', uz: '5/12 kichikroq: 1/3 ni 4/12 deb hisoblang.', en: '5/12 is too small: count 1/3 as 4/12.' },
        ],
      },
      {
        q: { ru: 'Сколько места осталось свободным?', uz: 'Qancha joy bo\'sh qoldi?', en: 'How much space is left free?' },
        opts: ['5/12', '1/12', '7/12'],
        correct: 0,
        ok: { ru: 'Верно. 12/12 − 7/12 = 5/12 листа.', uz: "To'g'ri. 12/12 − 7/12 = 5/12 varaq.", en: 'Right. 12/12 − 7/12 = 5/12 of the sheet.' },
        wrong: [
          null,
          { ru: 'Слишком мало: занято 7 долей из 12, свободно 5.', uz: "Juda kam: 12 dan 7 ulush band, 5 tasi bo'sh.", en: 'Too little: 7 of 12 parts are taken, 5 are free.' },
          { ru: '7/12 — это занятая часть, а не свободная.', uz: "7/12 bu band qism, bo'sh qism emas.", en: '7/12 is the filled part, not the free one.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про стенгазету. Азиз занял одну третью листа, Дилноза одну четвёртую.',
        uz: "Devoriy gazeta haqida masala. Aziz varaqning bir uchdan qismini, Dilnoza bir to'rtdan qismini egalladi.",
        en: 'A wall paper problem. Aziz took one third of the sheet, Dilnoza one quarter.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 12,
        q: { ru: 'Реши 1/4 + 1/6. Какой знаменатель в ответе? Набери число.', uz: '1/4 + 1/6 ni yeching. Javobdagi maxraj qanday? Sonni tering.', en: 'Solve 1/4 + 1/6. What denominator does the answer have? Type the number.' },
        hint: { ru: 'НОК(4, 6) = 12, а 3/12 + 2/12 = 5/12 не сокращается.', uz: 'EKUK(4, 6) = 12, 3/12 + 2/12 = 5/12 esa qisqarmaydi.', en: 'LCM(4, 6) = 12, and 3/12 + 2/12 = 5/12 does not reduce.' },
        hint_audio: { ru: 'Наименьшее общее кратное четырёх и шести двенадцать. Три двенадцатых плюс две двенадцатых равно пять двенадцатых, и это не сокращается.', uz: "To'rt va oltining eng kichik umumiy karralisi o'n ikki. Uch o'n ikkidan qo'shuv ikki o'n ikkidan teng besh o'n ikkidan, bu qisqarmaydi.", en: 'The least common multiple of four and six is twelve. Three twelfths plus two twelfths is five twelfths, which does not reduce.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Сколько будет 2/3 + 1/6?', uz: '2/3 + 1/6 nechaga teng?', en: 'What is 2/3 + 1/6?' },
        opts: ['3/9', '1/2', '5/6', '3/6'],
        wrong: [
          { ru: 'Так сложены знаменатели.', uz: "Bu yerda maxrajlar qo'shilgan.", en: 'The denominators were added here.' },
          { ru: 'Сумма не может быть меньше 2/3.', uz: "Yig'indi 2/3 dan kichik bo'lolmaydi.", en: 'The sum cannot be less than 2/3.' },
          null,
          { ru: '3/6 это 1/2, а 2/3 уже больше половины.', uz: '3/6 bu 1/2, 2/3 esa yarimdan katta.', en: '3/6 is a half, and 2/3 is already more than that.' },
        ],
        correct: { ru: 'Верно. 2/3 = 4/6, и 4/6 + 1/6 = 5/6.', uz: "To'g'ri. 2/3 = 4/6, va 4/6 + 1/6 = 5/6.", en: 'Right. 2/3 = 4/6 and 4/6 + 1/6 = 5/6.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Сколько будет 1 − 2/5?', uz: '1 − 2/5 nechaga teng?', en: 'What is 1 − 2/5?' },
        opts: ['2/5', '3/5', '5/2', '1/5'],
        wrong: [
          { ru: 'Это то, что вычитали.', uz: 'Bu ayirilgan son.', en: 'That is what was subtracted.' },
          null,
          { ru: 'Результат не может быть больше целого.', uz: "Natija butundan katta bo'lolmaydi.", en: 'The result cannot exceed the whole.' },
          { ru: 'Целое это 5/5, значит осталось 3/5.', uz: "Butun bu 5/5, demak 3/5 qoldi.", en: 'The whole is 5/5, so 3/5 remains.' },
        ],
        correct: { ru: 'Верно. 5/5 − 2/5 = 3/5.', uz: "To'g'ri. 5/5 − 2/5 = 3/5.", en: 'Right. 5/5 − 2/5 = 3/5.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Что происходит со знаменателем при сложении дробей?', uz: "Kasrlarni qo'shishda maxraj bilan nima bo'ladi?", en: 'What happens to the denominator when adding fractions?' },
        opts: [
          { ru: 'Остаётся общим знаменателем', uz: 'Umumiy maxraj bo\'lib qoladi', en: 'It stays as the common denominator' },
          { ru: 'Складывается', uz: "Qo'shiladi", en: 'It gets added' },
          { ru: 'Умножается', uz: "Ko'paytiriladi", en: 'It gets multiplied' },
          { ru: 'Становится числителем', uz: 'Suratga aylanadi', en: 'It becomes the numerator' },
        ],
        wrong: [
          null,
          { ru: 'Складывать знаменатели нельзя: это размер доли.', uz: "Maxrajlarni qo'shib bo'lmaydi: bu ulush kattaligi.", en: 'Denominators are not added: that is the size of a part.' },
          { ru: 'Умножение знаменателей это поиск общего, а не сложение.', uz: "Maxrajlarni ko'paytirish umumiysini topish, qo'shish emas.", en: 'Multiplying denominators finds a common one, it is not addition.' },
          { ru: 'Числитель и знаменатель ролями не меняются.', uz: "Surat va maxraj o'rin almashmaydi.", en: 'Numerator and denominator do not swap roles.' },
        ],
        correct: { ru: 'Верно. Меняется только числитель — количество долей.', uz: "To'g'ri. Faqat surat, ya'ni ulushlar soni o'zgaradi.", en: 'Right. Only the numerator changes, the count of parts.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Азиз прочитал 1/2 книги, потом ещё 1/6. Сколько осталось?', uz: 'Aziz kitobning 1/2 qismini, keyin yana 1/6 qismini o\'qidi. Qancha qoldi?', en: 'Aziz read 1/2 of a book, then another 1/6. How much is left?' },
        opts: ['1/8', '2/3', '1/2', '1/3'],
        wrong: [
          { ru: 'Знаменатели складывать нельзя.', uz: "Maxrajlarni qo'shib bo'lmaydi.", en: 'Denominators cannot be added.' },
          { ru: '2/3 — это прочитанная часть, а спрашивают об остатке.', uz: "2/3 bu o'qilgan qism, savol esa qolgani haqida.", en: '2/3 is the part he read, and the question is about the rest.' },
          { ru: 'Половина осталась бы, если бы он читал только один раз.', uz: "Faqat bir marta o'qiganda yarmi qolardi.", en: 'Half would remain if he had read only once.' },
          null,
        ],
        correct: { ru: 'Верно. 1/2 + 1/6 = 4/6 = 2/3, осталось 1/3.', uz: "To'g'ri. 1/2 + 1/6 = 4/6 = 2/3, 1/3 qoldi.", en: 'Right. 1/2 + 1/6 = 4/6 = 2/3, so 1/3 is left.' },
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
      ru: 'В нотах длительности устроены как дроби: половинная, четвертная, восьмая. Такт в размере 4/4 набирается ровно до целого, и музыканты складывают доли так же, как мы на этом уроке.',
      uz: "Notalarda cho'zimlar kasrga o'xshaydi: yarim, chorak, sakkizdan bir. 4/4 o'lchovdagi takt aynan butungacha to'ladi, musiqachilar ulushlarni xuddi shu darsdagidek qo'shadi.",
      en: 'In music, note lengths work like fractions: a half, a quarter, an eighth. A bar in 4/4 fills up to exactly one whole, and musicians add parts just as we did in this lesson.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? В нотах длительности устроены как дроби: половинная, четвертная, восьмая. Такт набирается ровно до целого, и музыканты складывают доли так же, как мы на этом уроке.',
      uz: "Bilasizmi? Notalarda cho'zimlar kasrga o'xshaydi: yarim, chorak, sakkizdan bir. Takt aynan butungacha to'ladi, musiqachilar ulushlarni xuddi shu darsdagidek qo'shadi.",
      en: 'Did you know? In music, note lengths work like fractions: a half, a quarter, an eighth. A bar fills up to exactly one whole, and musicians add parts just as we did today.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Дроби', uz: 'Matematika · Kasrlar', en: 'Mathematics · Fractions' },
    heading: { ru: 'Сложение и вычитание', uz: "Qo'shish va ayirish", en: 'Adding and subtracting' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'сначала общий знаменатель', uz: 'avval umumiy maxraj', en: 'common denominator first' },
    brief_2: { ru: 'считаем только числители', uz: 'faqat suratlarni hisoblaymiz', en: 'count only the numerators' },
    brief_3: { ru: 'ответ сокращаем', uz: 'javobni qisqartiramiz', en: 'reduce the answer' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Знаменатель', uz: 'Maxraj', en: 'Denominator' },
    memo_a1: { ru: 'размер доли, его не складывают', uz: "ulush kattaligi, u qo'shilmaydi", en: 'the size of a part, never added' },
    memo_q2: { ru: 'Числитель', uz: 'Surat', en: 'Numerator' },
    memo_a2: { ru: 'количество долей, его и считают', uz: 'ulushlar soni, hisob shunga tegishli', en: 'how many parts, that is what you count' },
    memo_q3: { ru: 'Проверка', uz: 'Tekshiruv', en: 'Check' },
    memo_a3: { ru: 'сумма больше слагаемого, разность меньше', uz: "yig'indi qo'shiluvchidan katta, ayirma kichik", en: 'a sum is larger, a difference smaller' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Дроби приводим к общему знаменателю, складываем или вычитаем числители, а знаменатель оставляем прежним. Ответ по возможности сокращаем.',
        'Стенгазета: одна третья плюс одна четвёртая это семь двенадцатых, а половина листа шесть двенадцатых. Значит закрыли больше половины.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Kasrlarni umumiy maxrajga keltiramiz, suratlarni qo'shamiz yoki ayiramiz, maxrajni esa o'zgarishsiz qoldiramiz. Javobni imkon bo'lsa qisqartiramiz.",
        "Devoriy gazeta: bir uchdan qo'shuv bir to'rtdan bu yetti o'n ikkidan, varaqning yarmi esa olti o'n ikkidan. Demak yarmidan ko'pi to'ldirilgan.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'Bring the fractions to a common denominator, add or subtract the numerators and keep the denominator. Reduce the answer if possible.',
        'The wall paper: one third plus one quarter is seven twelfths, and half the sheet is six twelfths. So more than half is covered.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Три шага', uz: 'Usul. Uch qadam', en: 'Method. Three steps' },
    m1_steps: {
      ru: ['Приведи дроби к общему знаменателю', 'Сложи или вычти числители', 'Сократи ответ, если можно'],
      uz: ['Kasrlarni umumiy maxrajga keltiring', "Suratlarni qo'shing yoki ayiring", "Imkon bo'lsa javobni qisqartiring"],
      en: ['Bring the fractions to a common denominator', 'Add or subtract the numerators', 'Reduce the answer if possible'],
    },
    m1_no: {
      ru: 'Знаменатель в ответе тот же, что общий. Складывать знаменатели нельзя.',
      uz: "Javobdagi maxraj umumiy maxrajning o'zi. Maxrajlarni qo'shib bo'lmaydi.",
      en: 'The answer keeps the common denominator. Denominators are never added.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: стенгазета. На хуке вопрос, в итоге ответ.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d10wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d10wall)"/>

    {/* Лист ватмана на стене. Разметки НЕТ: на глаз не решить, кто прав */}
    <g className="d10-sheet">
      <rect x="96" y="12" width="208" height="96" rx="3" fill="#FFFDF7" stroke="#DCCFB6" strokeWidth="2"/>
      {/* Часть Азиза слева и часть Дилнозы справа: рисунки, а не клетки */}
      <path d="M100 16 h64 v88 h-64 Z" fill="#DCEDF5"/>
      <path d="M252 16 h48 v88 h-48 Z" fill="#FBF3D6"/>
      <g opacity="0.85">
        <circle cx="122" cy="40" r="11" fill="#7ECBE6"/>
        <path d="M106 66 h50 M106 76 h44 M106 86 h50" stroke="#019ACB" strokeWidth="2.4" strokeLinecap="round"/>
        <path d="M262 34 h30 M262 44 h26" stroke="#C99B3A" strokeWidth="2.4" strokeLinecap="round"/>
        <path d="M276 60 l7 14 l-14 0 Z" fill="#F5C77E"/>
        <path d="M262 86 h32" stroke="#C99B3A" strokeWidth="2.4" strokeLinecap="round"/>
      </g>
      {/* Скотч по углам */}
      <rect x="90" y="8" width="18" height="8" rx="2" fill="#E9E3D9" opacity="0.9" transform="rotate(-20 99 12)"/>
      <rect x="292" y="8" width="18" height="8" rx="2" fill="#E9E3D9" opacity="0.9" transform="rotate(20 301 12)"/>
    </g>

    {/* Дети с кистями */}
    <Person x={62} ground={122} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={340} ground={122} head={13} shirt="#F5C77E" hair="#5A4636"/>
    <g className="d10-brush">
      <path d="M84 96 l14 -16" stroke="#B08A57" strokeWidth="3" strokeLinecap="round"/>
      <path d="M96 78 l6 -7" stroke="#019ACB" strokeWidth="5" strokeLinecap="round"/>
    </g>

    {/* Стол с красками, банкой воды и клеем */}
    <rect x="0" y="118" width="400" height="36" fill="#D2A96F"/>
    <rect x="0" y="118" width="400" height="5" fill="#C9884A"/>
    <g>
      <rect x="150" y="126" width="76" height="18" rx="3" fill="#F1E4CB" stroke="#C9A472"/>
      {[156, 174, 192, 210].map((px, i) => (
        <circle key={px} cx={px + 6} cy="135" r="6" fill={['#7ECBE6', '#F5C77E', '#D98A5A', '#8FBF7F'][i]}/>
      ))}
    </g>
    <g>
      <rect x="244" y="124" width="20" height="22" rx="3" fill="#DCEDF5" stroke="#C9A472"/>
      <path d="M254 124 v-12" stroke="#B08A57" strokeWidth="2.4"/>
      <circle cx="254" cy="130" r="3" fill="#7ECBE6" className="d10-drop"/>
    </g>
    <g>
      <rect x="100" y="130" width="12" height="16" rx="2" fill="#FFFDF7" stroke="#C9A472"/>
      <rect x="103" y="124" width="6" height="7" rx="2" fill="#C9884A"/>
    </g>
  </svg>
);

// Итог: тот же лист, но с разметкой на 12 долей и линией половины.
const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
    <rect x="40" y="14" width="320" height="52" rx="3" fill="#FFFDF7" stroke="#DCCFB6" strokeWidth="2"/>
    {Array.from({ length: 12 }, (_, i) => {
      const w = 320 / 12;
      const fill = i < 4 ? '#7ECBE6' : (i < 7 ? '#F5C77E' : '#FFFDF7');
      return <rect key={i} x={40 + w * i} y="14" width={w} height="52" fill={fill} stroke="#DCCFB6"/>;
    })}
    <path d="M200 8 v64" stroke="#1F7A4D" strokeWidth="2.4" strokeDasharray="5 4"/>
    <g fill="#1F7A4D" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fontSize="13">
      <text x="120" y="84" textAnchor="middle">4 + 3 = 7</text>
      <text x="286" y="84" textAnchor="middle">7 / 12</text>
    </g>
  </svg>
);

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Полоса листа: segs — куски разного цвета подряд, mark — линия половины.
const Strip = ({ total, segs, mark = false, size = 'mid' }) => {
  let filled = 0;
  const cells = Array.from({ length: total }, () => null);
  segs.forEach((seg) => {
    for (let i = 0; i < seg.count && filled < total; i += 1, filled += 1) cells[filled] = seg.tone;
  });
  return (
    <span className={'d10-strip d10-strip-' + size}>
      {cells.map((tone, i) => (
        <i key={i} className={tone ? 'on tone-' + tone : ''}/>
      ))}
      {mark && <span className="d10-half" style={{ left: `${(Math.floor(total / 2) / total) * 100}%` }}/>}
    </span>
  );
};

const Line = ({ node, on }) => (
  <span className={'d10-line d10-fade' + (on ? ' d10-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d10-stage">
        <span className="d10-row">
          <Strip total={c.a.d} segs={[{ count: c.a.n, tone: 'a' }]}/>
          <Frac n={c.a.n} d={c.a.d} size="mid"/>
          {step >= 1 && <span className="d10-op d10-on">→</span>}
          {step >= 1 && <Frac n={c.a.to.n} d={c.a.to.d} size="mid"/>}
        </span>
        <span className="d10-row">
          <Strip total={c.b.d} segs={[{ count: c.b.n, tone: 'b' }]}/>
          <Frac n={c.b.n} d={c.b.d} size="mid"/>
          {step >= 2 && <span className="d10-op d10-on">→</span>}
          {step >= 2 && <Frac n={c.b.to.n} d={c.b.to.d} size="mid"/>}
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

// Ядро: два куска ложатся на один лист, и видно линию половины.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d10-stage">
        <Strip total={12} segs={[{ count: 4, tone: 'a' }]}/>
        <span className={'d10-fade' + (step >= 1 ? ' d10-on' : '')}>
          <Strip total={12} segs={[{ count: 4, tone: 'a' }, { count: 3, tone: 'b' }]}/>
        </span>
        <span className={'d10-sum d10-fade' + (step >= 1 ? ' d10-on' : '')}>
          <Frac n="4" d="12" size="mid"/><span className="d10-op d10-on">+</span>
          <Frac n="3" d="12" size="mid"/><span className="d10-op d10-on">=</span>
          <Frac n={c.sum.n} d={c.sum.d} size="mid"/>
        </span>
        <span className={'d10-fade' + (step >= 2 ? ' d10-on' : '')}>
          <Strip total={12} segs={[{ count: 4, tone: 'a' }, { count: 3, tone: 'b' }]} mark/>
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

const SubBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_sub;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d10-stage">
        <Strip total={12} segs={[{ count: 10, tone: 'a' }]}/>
        <span className={'d10-fade' + (step >= 2 ? ' d10-on' : '')}>
          <Strip total={12} segs={[{ count: 7, tone: 'ok' }]}/>
        </span>
        {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
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
      <div className="frame fade-up delay-1 d10-stage">
        <Strip total={20} segs={[{ count: 15, tone: 'a' }]} size="sm"/>
        <span className={'d10-fade' + (step >= 2 ? ' d10-on' : '')}>
          <Strip total={20} segs={[{ count: 7, tone: 'ok' }]} size="sm"/>
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

// Граница: сложение знаменателей ломает число, это видно на полосе.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d10-stage">
        <span className="d10-pair d10-pair-bad">
          <Line node={t(c.bad_line)} on/>
          <Strip total={5} segs={[{ count: 2, tone: 'b' }]}/>
        </span>
        <span className={'d10-pair d10-pair-good d10-fade' + (step >= 2 ? ' d10-on' : '')}>
          <Line node={t(c.good_line)} on/>
          <Strip total={6} segs={[{ count: 5, tone: 'ok' }]}/>
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
        <div className={'d10-banner fade-up delay-1' + (phase === 'play' ? ' d10-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d10-stage d10-stage-tool">
          {phase === 'demo' ? (
            <>
              <Strip total={12} size="sm"
                segs={done ? [{ count: 2, tone: 'a' }, { count: 3, tone: 'b' }] : [{ count: 2, tone: 'a' }]}/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d10-verdict' + (done ? ' d10-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
            </>
          ) : (
            <>
              <p className="body" style={{ margin: '0 0 10px', fontWeight: 600 }}>{mt(t(c.play_ask))}</p>
              <div className="sv-opts">
                {c.play_opts.map((o, i) => (
                  <button key={o} className={'option'
                    + (solved && i === c.play_correct ? ' option-correct' : '')
                    + (!solved && picked === i ? ' option-picked-wrong' : '')}
                  disabled={solved} onClick={() => answer(i)}>{mt(o)}</button>
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
          <div className="d10-acts fade-up">
            <button className="d10-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d10-btn d10-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenSub = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_sub} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <SubBody step={step}/>}/>
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
      <div className="d10-stage">
        <Strip total={12} segs={[{ count: 4, tone: 'a' }, { count: 3, tone: 'b' }]} mark/>
        <span className="d10-sum">
          <Frac n="4" d="12" size="mid"/><span className="d10-op d10-on">+</span>
          <Frac n="3" d="12" size="mid"/><span className="d10-op d10-on">=</span>
          <Frac n="7" d="12" size="mid"/>
        </span>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenAdd = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_add} asideNode={methodAside}/>
);
const ScreenMinus = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_minus} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: тот же лист на 12 долей.
const TaskFig = ({ idx }) => (
  <div className="d10-task-fig">
    <Strip total={12}
      segs={idx >= 1 ? [{ count: 7, tone: 'a' }] : [{ count: 4, tone: 'a' }, { count: 3, tone: 'b' }]}
      mark/>
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
.d10-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d10-row { display: flex; align-items: center; gap: clamp(8px, 1.8vw, 14px); flex-wrap: wrap; justify-content: center; }

/* Полоса листа */
.d10-strip { position: relative; display: inline-flex; gap: 1px; border-radius: 4px; border: 1px solid #DCCFB6; overflow: visible; }
.d10-strip i { display: block; background: #F7F0E2; }
.d10-strip-mid i { width: clamp(11px, 2.3vw, 20px); height: clamp(22px, 3.6vw, 30px); }
.d10-strip-sm i { width: clamp(7px, 1.5vw, 13px); height: clamp(20px, 3.2vw, 26px); }
.d10-strip i.tone-a { background: #7ECBE6; }
.d10-strip i.tone-b { background: #F5C77E; }
.d10-strip i.tone-ok { background: #7FBF95; }
.d10-half { position: absolute; top: -6px; bottom: -6px; width: 2px; background: #1F7A4D; }

.d10-fade { opacity: 0; transition: opacity 420ms linear; }
.d10-on { opacity: 1; }
.d10-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 2.6vw, 19px); font-weight: 700; color: #494550; }
.d10-op { font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 2.8vw, 21px); font-weight: 700; color: #8A8883; }
.d10-sum { display: inline-flex; align-items: center; gap: 6px; }

/* Пары «неверно и верно» */
.d10-pair { display: flex; align-items: center; justify-content: center; gap: clamp(10px, 2.2vw, 18px); flex-wrap: wrap; width: 100%; padding: clamp(8px, 1.6vw, 12px); border-radius: 14px; }
.d10-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d10-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }

/* Экран 4 плотнее: строки, полоса и карточка способа не помещались на 390 */
.d10-stage-tool { gap: clamp(4px, 0.9vw, 7px) !important; padding: clamp(8px, 1.7vw, 12px) !important; }
.d10-stage-tool .d10-line { font-size: clamp(12px, 2vw, 16px); }
.d10-stage-tool .d10-verdict { min-height: 0; }
.d10-stage-tool .d10-strip-sm i { height: clamp(14px, 2.4vw, 20px); }

/* Задача */
.d10-task-fig { display: flex; justify-content: center; }

/* Экран 4 */
.d10-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(14px, 2.4vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 6px 13px; }
.d10-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d10-verdict { margin: 0; min-height: 22px; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d10-verdict-on { opacity: 1; }
.d10-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d10-btn { height: 40px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d10-btn:disabled { opacity: 0.45; cursor: default; }
.d10-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d10-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: кисть, капля краски, лист на скотче */
.d10-brush { transform-origin: 84px 96px; animation: d10Brush 3600ms ease-in-out infinite; }
@keyframes d10Brush { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(6deg); } }
.d10-drop { animation: d10Drop 4200ms ease-in-out infinite; }
@keyframes d10Drop { 0%, 60% { opacity: 0; transform: translateY(0); } 70% { opacity: 1; } 100% { opacity: 0; transform: translateY(12px); } }
.d10-sheet { transform-origin: 200px 12px; animation: d10Sheet 6000ms ease-in-out infinite; }
@keyframes d10Sheet { 0%, 100% { transform: rotate(-0.5deg); } 50% { transform: rotate(0.5deg); } }
@media (prefers-reduced-motion: reduce) { .d10-brush, .d10-drop, .d10-sheet { animation: none; } }

@media (max-width: 639.98px) {
  .d10-strip-mid i { width: 10px; height: 20px; }
  .d10-strip-sm i { width: 6px; height: 18px; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function AddSubFractionsLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenSub, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenAdd, ScreenMinus, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
