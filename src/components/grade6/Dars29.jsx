// ============================================================
// 6 КЛАСС, УРОК 29 «Умножение и деление рациональных чисел»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б7, третий урок. Правило знаков не объявляется, а выводится:
// умножение на положительное — повтор шага из урока 27, а «минус на
// минус» получается из лесенки закономерности, где произведение растёт
// на одно и то же число.
//
// Сцена — школьный батискаф в бассейне-модели: ноль это поверхность воды.
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
  lessonId: 'grade6-29',
  lessonTitle: {
    ru: 'Умножение и деление рациональных чисел',
    uz: "Ratsional sonlarni ko'paytirish va bo'lish",
    en: 'Multiplying and dividing rational numbers',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 batiskaf: 2 daqiqa oldin qayerda edi
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 bir xil qo'shiluvchilar esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 manfiyni musbatga ko'paytirish
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: ishoralar jadvali
  { id: 's_stair',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 narvon: minus minusga plyus beradi
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: bo'lish
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: qoida qo'shishga tegishli emas
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_sign',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 faqat ishora x3
  { id: 's_calc',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 hisoblash x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: natija ishorasi
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: batiskaf
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Батискаф под водой', uz: 'Suv ostidagi batiskaf', en: 'The bathyscaphe underwater' },
    lead: {
      ru: 'Модель батискафа опускается на 3 м каждую минуту. Сейчас она на глубине 12 м.',
      uz: "Batiskaf modeli har daqiqada 3 m pastga tushadi. Hozir u 12 m chuqurlikda.",
      en: 'The model bathyscaphe sinks 3 m every minute. Right now it is 12 m deep.',
    },
    voice_a: { ru: 'Озод: 2 минуты назад была на 18 метрах.', uz: 'Ozod: 2 daqiqa oldin 18 metrda edi.', en: 'Ozod: two minutes ago it was at 18 metres.' },
    voice_b: { ru: 'Нигора: нет, на 6 метрах.', uz: "Nigora: yo'q, 6 metrda edi.", en: 'Nigora: no, at 6 metres.' },
    ask: { ru: 'На какой глубине была модель 2 минуты назад?', uz: 'Model 2 daqiqa oldin qanday chuqurlikda edi?', en: 'How deep was the model two minutes ago?' },
    options: [
      { ru: 'на 18 м', uz: '18 m da', en: 'at 18 m' },
      { ru: 'на 6 м', uz: '6 m da', en: 'at 6 m' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'В бассейне испытывают модель батискафа. Она опускается на три метра каждую минуту. Сейчас модель на глубине двенадцать метров.',
          'Озод говорит, что две минуты назад она была на восемнадцати метрах, а Нигора что на шести. На какой глубине была модель две минуты назад? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Basseynda batiskaf modeli sinovdan o'tkazilmoqda. U har daqiqada uch metr pastga tushadi. Hozir model o'n ikki metr chuqurlikda.",
          "Ozod ikki daqiqa oldin u o'n sakkiz metrda edi deydi, Nigora esa oltida deydi. Model ikki daqiqa oldin qanday chuqurlikda edi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'A bathyscaphe model is being tested in a pool. It sinks three metres every minute. Right now it is twelve metres deep.',
          'Ozod says two minutes ago it was at eighteen metres, Nigora says at six. How deep was the model two minutes ago? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Умножение — короткая запись сложения', uz: "Ko'paytirish — qo'shishning qisqa yozuvi", en: 'Multiplication is short for addition' },
    done: {
      ru: 'Четыре одинаковых слагаемых записывают умножением. Это работает и тогда, когда слагаемое отрицательное.',
      uz: "To'rtta bir xil qo'shiluvchi ko'paytirish bilan yoziladi. Qo'shiluvchi manfiy bo'lganda ham shunday.",
      en: 'Four equal addends are written as a product. This works when the addend is negative too.',
    },
    audio: {
      ru: [
        'Вспомним начальную школу. Пять плюс пять плюс пять это три раза по пять, то есть три умножить на пять.',
        'Умножение это короткая запись одинаковых слагаемых.',
        'А теперь главный вопрос сегодняшнего урока: что будет, если слагаемое отрицательное?',
      ],
      uz: [
        "Boshlang'ich sinfni eslaymiz. Besh qo'shuv besh qo'shuv besh bu uch marta besh, ya'ni uch karra besh.",
        "Ko'paytirish bir xil qo'shiluvchilarning qisqa yozuvi.",
        "Endi bugungi darsning asosiy savoli: qo'shiluvchi manfiy bo'lsa nima bo'ladi?",
      ],
      en: [
        'Recall primary school. Five plus five plus five is three fives, that is three times five.',
        'Multiplication is a short way to write equal addends.',
        'Now the main question of today: what if the addend is negative?',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Отрицательное на положительное', uz: "Manfiyni musbatga ko'paytirish", en: 'Negative times positive' },
    lines: [
      { ru: '(−3) + (−3) + (−3) + (−3)', uz: '(−3) + (−3) + (−3) + (−3)', en: '(−3) + (−3) + (−3) + (−3)' },
      { ru: '(−3) · 4', uz: '(−3) · 4', en: '(−3) · 4' },
      { ru: '= −12: глубина 12 метров', uz: '= −12: chuqurlik 12 metr', en: '= −12: a depth of 12 metres' },
    ],
    done: {
      ru: 'Четыре шага вниз по 3 метра дают 12 метров вниз. Знаки разные — произведение отрицательное.',
      uz: "Har biri 3 metrdan to'rtta pastga qadam 12 metr pastni beradi. Ishoralar har xil — ko'paytma manfiy.",
      en: 'Four steps down of 3 metres each give 12 metres down. Different signs mean a negative product.',
    },
    audio: {
      ru: [
        'Модель опускается на три метра каждую минуту. За четыре минуты это минус три плюс минус три плюс минус три плюс минус три.',
        'Короче: минус три умножить на четыре. Четыре одинаковых шага вниз.',
        'Получилось минус двенадцать, то есть глубина двенадцать метров. Когда знаки разные, произведение отрицательное.',
      ],
      uz: [
        "Model har daqiqada uch metr pastga tushadi. To'rt daqiqada bu minus uch qo'shuv minus uch qo'shuv minus uch qo'shuv minus uch.",
        "Qisqacha: minus uch karra to'rt. To'rtta bir xil pastga qadam.",
        "Minus o'n ikki chiqdi, ya'ni chuqurlik o'n ikki metr. Ishoralar har xil bo'lganda ko'paytma manfiy.",
      ],
      en: [
        'The model sinks three metres a minute. Over four minutes that is minus three plus minus three plus minus three plus minus three.',
        'Shorter: minus three times four. Four equal steps down.',
        'That gives minus twelve, a depth of twelve metres. When the signs differ, the product is negative.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Считаем модули, потом знак', uz: 'Modullarni, keyin ishorani', en: 'Absolute values first, sign second' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: '(−4) · 6: модули 4 и 6', uz: '(−4) · 6: modullar 4 va 6', en: '(−4) · 6: absolute values 4 and 6' },
      { ru: '4 · 6 = 24', uz: '4 · 6 = 24', en: '4 · 6 = 24' },
      { ru: 'знаки разные: −24', uz: 'ishoralar har xil: −24', en: 'signs differ: −24' },
    ],
    demo_note: {
      ru: 'Сначала перемножаем модули, знак ставим в конце. Так работа делится на два простых шага.',
      uz: "Avval modullarni ko'paytiramiz, ishorani oxirida qo'yamiz. Shunda ish ikki oddiy qadamga bo'linadi.",
      en: 'Multiply the absolute values first and set the sign at the end. That splits the work into two simple steps.',
    },
    play_ask: { ru: 'Сколько будет (−5) · 3?', uz: '(−5) · 3 nechaga teng?', en: 'What is (−5) · 3?' },
    play_opts: ['−15', '15', '−8'],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. 5 · 3 = 15, знаки разные, значит минус.',
      uz: "To'g'ri. 5 · 3 = 15, ishoralar har xil, demak minus.",
      en: 'Right. 5 · 3 = 15 and the signs differ, so minus.',
    },
    play_wrong: [
      null,
      { ru: 'Один множитель отрицательный, произведение не может быть положительным.', uz: "Bir ko'paytuvchi manfiy, ko'paytma musbat bo'lolmaydi.", en: 'One factor is negative, so the product cannot be positive.' },
      { ru: 'Это сложение, а здесь умножение.', uz: "Bu qo'shish, bu yerda esa ko'paytirish.", en: 'That is addition, but here we multiply.' },
    ],
    audio: {
      intro: {
        ru: 'Покажу порядок работы на примере минус четыре умножить на шесть.',
        uz: "Ish tartibini minus to'rt karra olti misolida ko'rsataman.",
        en: 'I will show the working order on minus four times six.',
      },
      demo: {
        ru: 'Сначала берём модули: четыре и шесть. Перемножаем, получается двадцать четыре. Теперь знак: множители с разными знаками, значит минус двадцать четыре.',
        uz: "Avval modullarni olamiz: to'rt va olti. Ko'paytiramiz, yigirma to'rt chiqadi. Endi ishora: ko'paytuvchilar ishoralari har xil, demak minus yigirma to'rt.",
        en: 'First take the absolute values: four and six. Multiply them to get twenty four. Now the sign: the factors have different signs, so minus twenty four.',
      },
      play: {
        ru: 'Теперь ваша очередь. Сколько будет минус пять умножить на три?',
        uz: 'Endi sizning navbatingiz. Minus besh karra uch nechaga teng?',
        en: 'Now it is your turn. What is minus five times three?',
      },
      ok: {
        ru: 'Верно. Пять на три пятнадцать, знаки разные, поэтому минус.',
        uz: "To'g'ri. Besh karra uch o'n besh, ishoralar har xil, shuning uchun minus.",
        en: 'Right. Five times three is fifteen, the signs differ, so minus.',
      },
      wrong: {
        ru: 'Сначала перемножьте модули, потом посмотрите на знаки множителей.',
        uz: "Avval modullarni ko'paytiring, keyin ko'paytuvchilar ishoralariga qarang.",
        en: 'Multiply the absolute values first, then look at the signs of the factors.',
      },
    },
  },

  s_stair: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Минус на минус', uz: 'Minus minusga', en: 'Minus times minus' },
    lead: { ru: 'Смотри, как меняется произведение, когда второй множитель уменьшается на 1.', uz: "Ikkinchi ko'paytuvchi 1 ga kamayganda ko'paytma qanday o'zgarishiga qarang.", en: 'Watch the product change as the second factor drops by 1.' },
    stair: [
      { mul: '(−3) · 2', res: '−6' },
      { mul: '(−3) · 1', res: '−3' },
      { mul: '(−3) · 0', res: '0' },
      { mul: '(−3) · (−1)', res: '3' },
      { mul: '(−3) · (−2)', res: '6' },
    ],
    done: {
      ru: 'Каждый раз результат растёт на 3, и лесенка сама переходит через ноль. Значит (−3) · (−2) = 6: модель была на 6 метрах, выше. Права была Нигора.',
      uz: "Har safar natija 3 ga o'sadi va narvon o'zi noldan o'tadi. Demak (−3) · (−2) = 6: model 6 metrda, yuqoriroqda edi. Nigora haq edi.",
      en: 'Each time the result grows by 3, and the ladder crosses zero on its own. So (−3) · (−2) = 6: the model was at 6 metres, higher up. Nigora was right.',
    },
    audio: {
      ru: [
        'Что будет, если оба множителя отрицательные? Посмотрим на лесенку. Минус три на два это минус шесть. Минус три на один это минус три. Минус три на ноль это ноль.',
        'Каждый раз результат вырастает на три. Продолжим лесенку: минус три на минус один даёт три, минус три на минус два даёт шесть.',
        'Вернёмся к батискафу. Две минуты назад это минус две минуты, скорость минус три метра в минуту. Минус три на минус два это плюс шесть, значит модель была на шесть метров выше, чем сейчас. Глубина была шесть метров. Права была Нигора.',
      ],
      uz: [
        "Ikkala ko'paytuvchi ham manfiy bo'lsa nima bo'ladi? Narvonga qaraymiz. Minus uch karra ikki bu minus olti. Minus uch karra bir bu minus uch. Minus uch karra nol bu nol.",
        "Har safar natija uchga o'sadi. Narvonni davom ettiramiz: minus uch karra minus bir uchni beradi, minus uch karra minus ikki oltini beradi.",
        "Batiskafga qaytamiz. Ikki daqiqa oldin bu minus ikki daqiqa, tezlik esa daqiqasiga minus uch metr. Minus uch karra minus ikki plyus olti, demak model hozirgidan olti metr yuqorida edi. Chuqurlik olti metr edi. Nigora haq edi.",
      ],
      en: [
        'What if both factors are negative? Look at the ladder. Minus three times two is minus six. Minus three times one is minus three. Minus three times zero is zero.',
        'Each time the result grows by three. Continue the ladder: minus three times minus one gives three, minus three times minus two gives six.',
        'Back to the bathyscaphe. Two minutes ago is minus two minutes, the speed is minus three metres a minute. Minus three times minus two is plus six, six metres higher than now. The model was six metres deep. Nigora was right.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Деление подчиняется тому же правилу', uz: "Bo'lish ham shu qoidaga bo'ysunadi", en: 'Division follows the same rule' },
    lead: { ru: 'Считаем (−36) : (−4) · (−2) по шагам.', uz: "(−36) : (−4) · (−2) ni qadamlab hisoblaymiz.", en: 'Compute (−36) : (−4) · (−2) step by step.' },
    steps: [
      { ru: '36 : 4 = 9, знаки одинаковые: 9', uz: "36 : 4 = 9, ishoralar bir xil: 9", en: '36 : 4 = 9, equal signs: 9' },
      { ru: '9 · 2 = 18, знаки разные: −18', uz: '9 · 2 = 18, ishoralar har xil: −18', en: '9 · 2 = 18, different signs: −18' },
      { ru: 'итог: −18', uz: 'natija: −18', en: 'result: −18' },
    ],
    done: {
      ru: 'Деление проверяется умножением: 9 · (−4) = −36, значит частное найдено верно. Порядок — слева направо.',
      uz: "Bo'lish ko'paytirish bilan tekshiriladi: 9 · (−4) = −36, demak bo'linma to'g'ri topilgan. Tartib — chapdan o'ngga.",
      en: 'Division is checked by multiplication: 9 · (−4) = −36, so the quotient is right. Work left to right.',
    },
    audio: {
      ru: [
        'Решаем вместе. Минус тридцать шесть разделить на минус четыре и умножить на минус два.',
        'Первый шаг: модули тридцать шесть и четыре дают девять. Знаки у делимого и делителя одинаковые, значит частное положительное. Девять.',
        'Второй шаг: девять на два восемнадцать, знаки разные, значит минус восемнадцать. Проверим первый шаг умножением: девять на минус четыре это минус тридцать шесть. Сходится.',
      ],
      uz: [
        "Birga yechamiz. Minus o'ttiz olti bo'linsin minus to'rtga va ko'paytirilsin minus ikkiga.",
        "Birinchi qadam: o'ttiz olti va to'rt modullari to'qqizni beradi. Bo'linuvchi va bo'luvchi ishoralari bir xil, demak bo'linma musbat. To'qqiz.",
        "Ikkinchi qadam: to'qqiz karra ikki o'n sakkiz, ishoralar har xil, demak minus o'n sakkiz. Birinchi qadamni ko'paytirish bilan tekshiramiz: to'qqiz karra minus to'rt bu minus o'ttiz olti. To'g'ri keldi.",
      ],
      en: [
        'Let us solve it together. Minus thirty six divided by minus four and multiplied by minus two.',
        'First step: the absolute values thirty six and four give nine. The dividend and divisor have equal signs, so the quotient is positive. Nine.',
        'Second step: nine times two is eighteen, different signs, so minus eighteen. Check the first step by multiplying: nine times minus four is minus thirty six. It matches.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilishadi', en: 'Where mistakes happen' },
    title: { ru: 'Правило знаков не про сложение', uz: "Ishoralar qoidasi qo'shishga tegishli emas", en: 'The sign rule is not about addition' },
    bad_line: { ru: 'ошибка: −3 + (−3) = 6, «минус на минус»', uz: "xato: −3 + (−3) = 6, «minus minusga»", en: 'mistake: −3 + (−3) = 6, “minus times minus”' },
    good_line: { ru: 'верно: −3 + (−3) = −6, а (−3) · (−3) = 9', uz: "to'g'ri: −3 + (−3) = −6, (−3) · (−3) = 9 esa boshqa", en: 'right: −3 + (−3) = −6, while (−3) · (−3) = 9' },
    warn_line: { ru: 'делить на ноль нельзя: −7 : 0 не существует', uz: "nolga bo'lib bo'lmaydi: −7 : 0 mavjud emas", en: 'no division by zero: −7 : 0 does not exist' },
    done: {
      ru: 'Правило знаков работает только для умножения и деления. В сложении знак решают модули, как в уроке 27.',
      uz: "Ishoralar qoidasi faqat ko'paytirish va bo'lishda ishlaydi. Qo'shishda ishorani modullar hal qiladi, 27-darsdagidek.",
      en: 'The sign rule works only for multiplication and division. In addition the absolute values decide, as in lesson 27.',
    },
    audio: {
      ru: [
        'Самая частая ошибка этого урока. Ученик выучил, что минус на минус даёт плюс, и переносит это на сложение. Минус три плюс минус три пишет как шесть.',
        'Но это разные действия. В сложении оба шага идут влево, ответ минус шесть. А вот произведение минус три на минус три действительно даёт девять.',
        'И ещё одно: делить на ноль нельзя ни при каких знаках. Такого частного не существует.',
      ],
      uz: [
        "Bu darsning eng ko'p uchraydigan xatosi. O'quvchi minus minusga plyus beradi deb yodlab oladi va buni qo'shishga ko'chiradi. Minus uch qo'shuv minus uchni olti deb yozadi.",
        "Lekin bular boshqa amallar. Qo'shishda ikkala qadam ham chapga boradi, javob minus olti. Minus uch karra minus uch ko'paytmasi esa haqiqatan to'qqizni beradi.",
        "Yana biri: hech qanday ishorada nolga bo'lib bo'lmaydi. Bunday bo'linma mavjud emas.",
      ],
      en: [
        'The most common mistake of this lesson. A student learns that minus times minus is plus and carries it into addition, writing minus three plus minus three as six.',
        'But these are different operations. In addition both steps go left and the answer is minus six. The product minus three times minus three really is nine.',
        'And one more: division by zero is impossible with any signs. Such a quotient does not exist.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Правило знаков', uz: 'Ishoralar qoidasi', en: 'The sign rule' },
    rule_1: {
      ru: 'Перемножаем или делим модули, а знак ставим по множителям: одинаковые знаки дают плюс, разные — минус. Для умножения и деления правило одно.',
      uz: "Modullarni ko'paytiramiz yoki bo'lamiz, ishorani esa ko'paytuvchilarga qarab qo'yamiz: bir xil ishoralar plyus, har xillari minus beradi. Ko'paytirish va bo'lish uchun qoida bitta.",
      en: 'Multiply or divide the absolute values, then set the sign from the factors: equal signs give plus, different ones give minus. One rule for both operations.',
    },
    rule_2: {
      ru: 'На ноль делить нельзя. Батискаф: (−3) · (−2) = 6, две минуты назад модель была на 6 метрах. Права была Нигора.',
      uz: "Nolga bo'lib bo'lmaydi. Batiskaf: (−3) · (−2) = 6, ikki daqiqa oldin model 6 metrda edi. Nigora haq edi.",
      en: 'Never divide by zero. The bathyscaphe: (−3) · (−2) = 6, two minutes ago the model was at 6 metres. Nigora was right.',
    },
    audio: {
      ru: 'Запомним правило. Сначала работаем с модулями: перемножаем их или делим. Потом ставим знак. Если знаки множителей одинаковые, ответ положительный. Если разные, отрицательный. Для деления правило то же самое. На ноль делить нельзя. Вернёмся к батискафу. Минус три умножить на минус два это шесть: две минуты назад модель была на глубине шесть метров. Права была Нигора.',
      uz: "Qoidani eslab qolamiz. Avval modullar bilan ishlaymiz: ularni ko'paytiramiz yoki bo'lamiz. Keyin ishora qo'yamiz. Ko'paytuvchilar ishorasi bir xil bo'lsa, javob musbat. Har xil bo'lsa, manfiy. Bo'lish uchun qoida ham o'sha. Nolga bo'lib bo'lmaydi. Batiskafga qaytamiz. Minus uch karra minus ikki bu olti: ikki daqiqa oldin model olti metr chuqurlikda edi. Nigora haq edi.",
      en: 'Let us remember the rule. First work with the absolute values: multiply or divide them. Then set the sign. Equal signs give a positive answer, different signs a negative one. Division follows the same rule. Never divide by zero. Back to the bathyscaphe. Minus three times minus two is six: two minutes ago the model was six metres deep. Nigora was right.',
    },
  },

  s_sign: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Только знак', uz: 'Faqat ishora', en: 'The sign only' },
    lead: { ru: 'Считать не нужно: назови знак результата.', uz: 'Hisoblash shart emas: natija ishorasini ayting.', en: 'No computing: just name the sign of the result.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Какой знак у (−7) · 8?', uz: '(−7) · 8 ishorasi qanday?', en: 'What sign does (−7) · 8 have?' },
        opts: [
          { ru: 'минус', uz: 'minus', en: 'minus' },
          { ru: 'плюс', uz: 'plyus', en: 'plus' },
          { ru: 'ноль', uz: 'nol', en: 'zero' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Знаки разные, значит минус.', uz: "To'g'ri. Ishoralar har xil, demak minus.", en: 'Right. Different signs mean minus.' },
        wrong: [
          null,
          { ru: 'Плюс бывает, когда знаки одинаковые.', uz: "Plyus ishoralar bir xil bo'lganda bo'ladi.", en: 'Plus happens when the signs match.' },
          { ru: 'Ноль получится, только если множитель нулевой.', uz: "Nol faqat ko'paytuvchi nol bo'lganda chiqadi.", en: 'Zero appears only if a factor is zero.' },
        ],
      },
      {
        q: { ru: 'Какой знак у (−54) : (−6)?', uz: '(−54) : (−6) ishorasi qanday?', en: 'What sign does (−54) : (−6) have?' },
        opts: [
          { ru: 'плюс', uz: 'plyus', en: 'plus' },
          { ru: 'минус', uz: 'minus', en: 'minus' },
          { ru: 'зависит от порядка', uz: "tartibga bog'liq", en: 'it depends on the order' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Знаки одинаковые, частное положительное.', uz: "To'g'ri. Ishoralar bir xil, bo'linma musbat.", en: 'Right. Equal signs give a positive quotient.' },
        wrong: [
          null,
          { ru: 'Минус бывает при разных знаках.', uz: "Minus har xil ishorada bo'ladi.", en: 'Minus happens with different signs.' },
          { ru: 'Знак от порядка не зависит, он зависит от знаков чисел.', uz: "Ishora tartibga emas, sonlar ishorasiga bog'liq.", en: 'The sign depends on the numbers, not on the order.' },
        ],
      },
      {
        q: { ru: 'Какой знак у (−2) · (−3) · (−4)?', uz: '(−2) · (−3) · (−4) ishorasi qanday?', en: 'What sign does (−2) · (−3) · (−4) have?' },
        opts: [
          { ru: 'минус', uz: 'minus', en: 'minus' },
          { ru: 'плюс', uz: 'plyus', en: 'plus' },
          { ru: 'нельзя определить', uz: "aniqlab bo'lmaydi", en: 'cannot be determined' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Первые два дали плюс, третий минус вернул минус.', uz: "To'g'ri. Dastlabki ikkitasi plyus berdi, uchinchi minus minusni qaytardi.", en: 'Right. The first two gave plus, the third minus brought the minus back.' },
        wrong: [
          null,
          { ru: 'Минусов три, то есть нечётное число.', uz: "Minuslar uchta, ya'ni toq son.", en: 'There are three minuses, an odd number.' },
          { ru: 'Определить можно: считаем минусы по порядку.', uz: 'Aniqlash mumkin: minuslarni tartib bilan sanaymiz.', en: 'It can be determined: count the minuses in order.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на знак. Считать до конца не нужно, смотрите только на знаки.',
        uz: 'Ishora mashqi. Oxirigacha hisoblash shart emas, faqat ishoralarga qarang.',
        en: 'Practice on signs. No need to compute, just look at the signs.',
      },
    },
  },

  s_calc: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Считаем до конца', uz: 'Oxirigacha hisoblaymiz', en: 'Compute in full' },
    lead: { ru: 'Модули, потом знак.', uz: 'Modullar, keyin ishora.', en: 'Absolute values, then the sign.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: '(−6) · 7', uz: '(−6) · 7', en: '(−6) · 7' },
        opts: ['−42', '42', '−13'],
        correct: 0,
        ok: { ru: 'Верно. 6 · 7 = 42, знаки разные.', uz: "To'g'ri. 6 · 7 = 42, ishoralar har xil.", en: 'Right. 6 · 7 = 42 with different signs.' },
        wrong: [
          null,
          { ru: 'Один множитель отрицательный, произведение тоже.', uz: "Bir ko'paytuvchi manfiy, ko'paytma ham shunday.", en: 'One factor is negative, so is the product.' },
          { ru: 'Это сумма, а здесь произведение.', uz: "Bu yig'indi, bu yerda esa ko'paytma.", en: 'That is a sum, but here we have a product.' },
        ],
      },
      {
        q: { ru: '(−8) · (−5)', uz: '(−8) · (−5)', en: '(−8) · (−5)' },
        opts: ['40', '−40', '−13'],
        correct: 0,
        ok: { ru: 'Верно. Знаки одинаковые, произведение положительное.', uz: "To'g'ri. Ishoralar bir xil, ko'paytma musbat.", en: 'Right. Equal signs give a positive product.' },
        wrong: [
          null,
          { ru: 'Два минуса дают плюс при умножении.', uz: "Ikki minus ko'paytirishda plyus beradi.", en: 'Two minuses give a plus in multiplication.' },
          { ru: 'Это сложение модулей, а не умножение.', uz: "Bu modullarni qo'shish, ko'paytirish emas.", en: 'That adds the absolute values instead of multiplying.' },
        ],
      },
      {
        q: { ru: '(−45) : 9', uz: '(−45) : 9', en: '(−45) : 9' },
        opts: ['−5', '5', '−36'],
        correct: 0,
        ok: { ru: 'Верно. 45 : 9 = 5, знаки разные.', uz: "To'g'ri. 45 : 9 = 5, ishoralar har xil.", en: 'Right. 45 : 9 = 5 with different signs.' },
        wrong: [
          null,
          { ru: 'Делимое отрицательное, делитель нет: частное отрицательное.', uz: "Bo'linuvchi manfiy, bo'luvchi esa yo'q: bo'linma manfiy.", en: 'The dividend is negative and the divisor is not: the quotient is negative.' },
          { ru: 'Это вычитание, а здесь деление.', uz: "Bu ayirish, bu yerda esa bo'lish.", en: 'That is subtraction, but here we divide.' },
        ],
      },
      {
        q: { ru: 'Сколько минусов должно быть, чтобы произведение было положительным?', uz: "Ko'paytma musbat bo'lishi uchun nechta minus bo'lishi kerak?", en: 'How many minuses make a product positive?' },
        opts: [
          { ru: 'чётное число', uz: 'juft son', en: 'an even number' },
          { ru: 'нечётное число', uz: 'toq son', en: 'an odd number' },
          { ru: 'ровно два', uz: 'roppa-rosa ikkita', en: 'exactly two' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Минусы гасятся парами.', uz: "To'g'ri. Minuslar juft-juft bo'lib so'nadi.", en: 'Right. The minuses cancel in pairs.' },
        wrong: [
          null,
          { ru: 'Один минус даёт отрицательный результат.', uz: 'Bitta minus manfiy natija beradi.', en: 'One minus gives a negative result.' },
          { ru: 'Четыре минуса тоже дают плюс.', uz: "To'rtta minus ham plyus beradi.", en: 'Four minuses also give a plus.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на вычисления. Сначала модули, потом знак.',
        uz: 'Hisoblash mashqi. Avval modullar, keyin ishora.',
        en: 'Computation practice. Absolute values first, then the sign.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Какой знак у результата', uz: 'Natija ishorasi qanday', en: 'What sign will the result have' },
    lead: { ru: 'Считай минусы, а не значения.', uz: 'Qiymatlarni emas, minuslarni sanang.', en: 'Count the minuses, not the values.' },
    bin_a: { ru: 'Результат положительный', uz: 'Natija musbat', en: 'The result is positive' },
    bin_b: { ru: 'Результат отрицательный', uz: 'Natija manfiy', en: 'The result is negative' },
    cards: [
      { label: '(−4) · (−5)', bin: 'a' },
      { label: '(−18) : (−3)', bin: 'a' },
      { label: '(−2) · (−2) · 3', bin: 'a' },
      { label: '(−9) · 4', bin: 'b' },
      { label: '20 : (−5)', bin: 'b' },
      { label: '(−1) · (−2) · (−3)', bin: 'b' },
    ],
    hint: {
      ru: 'Чётное число минусов даёт плюс, нечётное — минус.',
      uz: 'Juft sondagi minus plyus, toq sondagi minus beradi.',
      en: 'An even number of minuses gives plus, an odd number gives minus.',
    },
    correct_text: {
      ru: 'Верно. Минусы гасятся парами, и значения считать не пришлось.',
      uz: "To'g'ri. Minuslar juft-juft so'ndi, qiymatlarni hisoblash kerak bo'lmadi.",
      en: 'Right. The minuses cancelled in pairs and no values were needed.',
    },
    audio: {
      intro: {
        ru: 'Разложите выражения по двум корзинам. Смотрите на количество минусов.',
        uz: 'Ifodalarni ikki savatga ajrating. Minuslar soniga qarang.',
        en: 'Sort the expressions into two baskets. Look at how many minuses there are.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Посчитай минусы.', uz: 'Bu yerga emas. Minuslarni sanang.', en: 'Not here. Count the minuses.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Озод: «−4 + (−6) = 24, минус на минус даёт плюс». Проверь.', uz: "Ozod: «−4 + (−6) = 24, minus minusga plyus beradi». Tekshiring.", en: 'Ozod: “−4 + (−6) = 24, minus times minus is plus.” Check it.' },
        opts: [
          { ru: 'Нет: это сложение, ответ −10', uz: "Yo'q: bu qo'shish, javob −10", en: 'No: this is addition, the answer is −10' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет −24', uz: "Yo'q, −24 bo'ladi", en: 'No, it is −24' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Правило знаков — только для умножения и деления.', uz: "To'g'ri. Ishoralar qoidasi faqat ko'paytirish va bo'lish uchun.", en: 'Right. The sign rule is only for multiplication and division.' },
        wrong: [
          null,
          { ru: 'Здесь стоит плюс, значит идут два шага влево.', uz: 'Bu yerda plyus turibdi, demak ikki qadam chapga boradi.', en: 'There is a plus here, so both steps go left.' },
          { ru: 'Двадцать четыре получилось бы при умножении.', uz: "Yigirma to'rt ko'paytirishda chiqardi.", en: 'Twenty four would come from multiplying.' },
        ],
      },
      {
        q: { ru: 'Нигора: «(−20) : (−4) = −5». Проверь.', uz: "Nigora: «(−20) : (−4) = −5». Tekshiring.", en: 'Nigora: “(−20) : (−4) = −5.” Check it.' },
        opts: [
          { ru: 'Нет: знаки одинаковые, будет 5', uz: "Yo'q: ishoralar bir xil, 5 bo'ladi", en: 'No: equal signs, it is 5' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет −24', uz: "Yo'q, −24 bo'ladi", en: 'No, it is −24' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Проверка умножением: 5 · (−4) = −20.', uz: "To'g'ri. Ko'paytirish bilan tekshiruv: 5 · (−4) = −20.", en: 'Right. Check by multiplying: 5 · (−4) = −20.' },
        wrong: [
          null,
          { ru: 'Минус пять на минус четыре дало бы двадцать, а не минус двадцать.', uz: "Minus besh karra minus to'rt yigirmani berardi, minus yigirmani emas.", en: 'Minus five times minus four would give twenty, not minus twenty.' },
          { ru: 'Это вычитание, а здесь деление.', uz: "Bu ayirish, bu yerda esa bo'lish.", en: 'That is subtraction, but here we divide.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в выборе действия, и в знаке.',
        uz: "Birovning yechimini tekshiring. Xato amalni tanlashda ham, ishorada ham bo'ladi.",
        en: 'Check someone else’s work. A mistake can be in the operation and in the sign.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Погружение модели', uz: "Model cho'kishi", en: 'The model dives' },
    lead: { ru: 'Модель опускается на 3 м каждую минуту от поверхности.', uz: 'Model suv yuzasidan har daqiqada 3 m pastga tushadi.', en: 'The model sinks 3 m every minute from the surface.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Где будет модель через 7 минут?', uz: "Model 7 daqiqadan keyin qayerda bo'ladi?", en: 'Where will the model be after 7 minutes?' },
        opts: ['−21', '21', '−10'],
        correct: 0,
        ok: { ru: 'Верно. (−3) · 7 = −21, глубина 21 метр.', uz: "To'g'ri. (−3) · 7 = −21, chuqurlik 21 metr.", en: 'Right. (−3) · 7 = −21, a depth of 21 metres.' },
        wrong: [
          null,
          { ru: 'Модель идёт вниз, значит координата отрицательная.', uz: 'Model pastga boradi, demak koordinata manfiy.', en: 'The model goes down, so the coordinate is negative.' },
          { ru: 'Это сумма, а нужно умножение.', uz: "Bu yig'indi, ko'paytirish kerak esa.", en: 'That is a sum, but multiplication is needed.' },
        ],
      },
      {
        q: { ru: 'Через сколько минут модель будет на −27?', uz: 'Model necha daqiqada −27 ga tushadi?', en: 'After how many minutes is the model at −27?' },
        opts: ['9', '−9', '24'],
        correct: 0,
        ok: { ru: 'Верно. (−27) : (−3) = 9 минут.', uz: "To'g'ri. (−27) : (−3) = 9 daqiqa.", en: 'Right. (−27) : (−3) = 9 minutes.' },
        wrong: [
          null,
          { ru: 'Знаки одинаковые, частное положительное. Время не бывает отрицательным.', uz: "Ishoralar bir xil, bo'linma musbat. Vaqt manfiy bo'lmaydi.", en: 'Equal signs give a positive quotient. Time is not negative.' },
          { ru: 'Это разность, а нужно деление.', uz: "Bu ayirma, bo'lish kerak esa.", en: 'That is a difference, but division is needed.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про модель батискафа. Она опускается на три метра каждую минуту от поверхности воды.',
        uz: "Batiskaf modeli haqida masala. U suv yuzasidan har daqiqada uch metr pastga tushadi.",
        en: 'A bathyscaphe model problem. It sinks three metres every minute from the water surface.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 56,
        q: { ru: 'Вычисли (−8) · (−7). Набери ответ.', uz: '(−8) · (−7) ni hisoblang. Javobni tering.', en: 'Compute (−8) · (−7). Type the answer.' },
        hint: { ru: 'Модули 8 и 7, знаки одинаковые.', uz: 'Modullar 8 va 7, ishoralar bir xil.', en: 'Absolute values 8 and 7, equal signs.' },
        hint_audio: { ru: 'Перемножьте модули восемь и семь, а знаки у множителей одинаковые, значит ответ положительный.', uz: "Sakkiz va yetti modullarini ko'paytiring, ko'paytuvchilar ishorasi bir xil, demak javob musbat.", en: 'Multiply the absolute values eight and seven; the signs match, so the answer is positive.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Сколько будет (−63) : 7?', uz: '(−63) : 7 nechaga teng?', en: 'What is (−63) : 7?' },
        opts: ['9', '−56', '−9', '56'],
        wrong: [
          { ru: 'Знаки разные, частное отрицательное.', uz: "Ishoralar har xil, bo'linma manfiy.", en: 'Different signs give a negative quotient.' },
          { ru: 'Это разность, а здесь деление.', uz: "Bu ayirma, bu yerda esa bo'lish.", en: 'That is a difference, but here we divide.' },
          null,
          { ru: 'Это сумма модулей, а нужно частное.', uz: "Bu modullar yig'indisi, bo'linma kerak esa.", en: 'That is a sum, but a quotient is needed.' },
        ],
        correct: { ru: 'Верно. 63 : 7 = 9, знаки разные.', uz: "To'g'ri. 63 : 7 = 9, ishoralar har xil.", en: 'Right. 63 : 7 = 9 with different signs.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Какой знак у (−1) · (−2) · (−3) · (−4)?', uz: '(−1) · (−2) · (−3) · (−4) ishorasi qanday?', en: 'What sign does (−1) · (−2) · (−3) · (−4) have?' },
        opts: [
          { ru: 'минус', uz: 'minus', en: 'minus' },
          { ru: 'плюс', uz: 'plyus', en: 'plus' },
          { ru: 'ноль', uz: 'nol', en: 'zero' },
          { ru: 'нельзя определить', uz: "aniqlab bo'lmaydi", en: 'cannot be determined' },
        ],
        wrong: [
          { ru: 'Минусов четыре, они гасятся парами.', uz: "Minuslar to'rtta, ular juft-juft so'nadi.", en: 'There are four minuses and they cancel in pairs.' },
          null,
          { ru: 'Ноль появился бы только с нулевым множителем.', uz: "Nol faqat nol ko'paytuvchi bilan paydo bo'lardi.", en: 'Zero would need a zero factor.' },
          { ru: 'Определить можно: достаточно сосчитать минусы.', uz: 'Aniqlash mumkin: minuslarni sanash kifoya.', en: 'It can be determined: just count the minuses.' },
        ],
        correct: { ru: 'Верно. Чётное число минусов даёт плюс.', uz: "To'g'ri. Juft sondagi minus plyus beradi.", en: 'Right. An even number of minuses gives a plus.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Что нельзя сделать ни при каких знаках?', uz: "Hech qanday ishorada nima qilib bo'lmaydi?", en: 'What is impossible with any signs?' },
        opts: [
          { ru: 'умножить на ноль', uz: "nolga ko'paytirish", en: 'multiply by zero' },
          { ru: 'разделить ноль на число', uz: "nolni songa bo'lish", en: 'divide zero by a number' },
          { ru: 'умножить два минуса', uz: "ikki minusni ko'paytirish", en: 'multiply two minuses' },
          { ru: 'разделить на ноль', uz: "nolga bo'lish", en: 'divide by zero' },
        ],
        wrong: [
          { ru: 'Умножить на ноль можно, получится ноль.', uz: "Nolga ko'paytirish mumkin, nol chiqadi.", en: 'You can multiply by zero and get zero.' },
          { ru: 'Ноль разделить на число можно, получится ноль.', uz: "Nolni songa bo'lish mumkin, nol chiqadi.", en: 'Zero divided by a number is zero.' },
          { ru: 'Два минуса перемножить можно, получится плюс.', uz: "Ikki minusni ko'paytirish mumkin, plyus chiqadi.", en: 'Two minuses can be multiplied and give a plus.' },
          null,
        ],
        correct: { ru: 'Верно. Деление на ноль не существует.', uz: "To'g'ri. Nolga bo'lish mavjud emas.", en: 'Right. Division by zero does not exist.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Батискаф опускается на 4 м в минуту. Где он через 6 минут?', uz: 'Batiskaf daqiqasiga 4 m tushadi. 6 daqiqadan keyin qayerda?', en: 'A bathyscaphe sinks 4 m a minute. Where is it after 6 minutes?' },
        opts: ['−24', '24', '−10', '10'],
        wrong: [
          null,
          { ru: 'Он идёт вниз, координата отрицательная.', uz: 'U pastga boradi, koordinata manfiy.', en: 'It goes down, so the coordinate is negative.' },
          { ru: 'Это сумма, а нужно произведение.', uz: "Bu yig'indi, ko'paytma kerak esa.", en: 'That is a sum, but a product is needed.' },
          { ru: 'И знак, и действие выбраны неверно.', uz: "Ishora ham, amal ham noto'g'ri tanlangan.", en: 'Both the sign and the operation are wrong.' },
        ],
        correct: { ru: 'Верно. (−4) · 6 = −24 метра.', uz: "To'g'ri. (−4) · 6 = −24 metr.", en: 'Right. (−4) · 6 = −24 metres.' },
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
      ru: 'В 1960 году батискаф «Триест» опустился на дно Марианской впадины, на 10 911 метров. Спуск занял почти 5 часов: аппарат шёл со средней скоростью около 37 метров в минуту. Именно такие задачи и решают умножением отрицательного числа на время.',
      uz: "1960 yilda «Triyest» batiskafi Marian botig'ining tubiga, 10 911 metrga tushdi. Tushish deyarli 5 soat davom etdi: apparat o'rtacha daqiqasiga 37 metr tezlikda bordi. Aynan shunday masalalar manfiy sonni vaqtga ko'paytirish bilan yechiladi.",
      en: 'In 1960 the bathyscaphe Trieste reached the bottom of the Mariana Trench at 10,911 metres. The descent took almost 5 hours at an average of about 37 metres per minute. These are exactly the problems solved by multiplying a negative number by time.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? В тысяча девятьсот шестидесятом году батискаф Триест опустился на дно Марианской впадины, на десять тысяч девятьсот одиннадцать метров. Спуск занял почти пять часов: аппарат шёл со средней скоростью около тридцати семи метров в минуту. Именно такие задачи и решают умножением отрицательного числа на время.',
      uz: "Bilasizmi? Ming to'qqiz yuz oltmishinchi yilda Triyest batiskafi Marian botig'ining tubiga, o'n ming to'qqiz yuz o'n bir metrga tushdi. Tushish deyarli besh soat davom etdi: apparat o'rtacha daqiqasiga o'ttiz yetti metr tezlikda bordi. Aynan shunday masalalar manfiy sonni vaqtga ko'paytirish bilan yechiladi.",
      en: 'Did you know? In nineteen sixty the bathyscaphe Trieste reached the bottom of the Mariana Trench, ten thousand nine hundred eleven metres down. The descent took almost five hours at an average of about thirty seven metres per minute. These are exactly the problems solved by multiplying a negative number by time.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Отрицательные числа', uz: 'Matematika · Manfiy sonlar', en: 'Mathematics · Negative numbers' },
    heading: { ru: 'Умножение и деление', uz: "Ko'paytirish va bo'lish", en: 'Multiplication and division' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'сначала модули, потом знак', uz: 'avval modullar, keyin ishora', en: 'absolute values first, sign second' },
    brief_2: { ru: 'знаки одинаковые — плюс', uz: 'ishoralar bir xil — plyus', en: 'equal signs give plus' },
    brief_3: { ru: 'знаки разные — минус', uz: 'har xil — minus', en: 'different signs give minus' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Чётное число минусов', uz: 'Juft sondagi minus', en: 'An even number of minuses' },
    memo_a1: { ru: 'даёт плюс', uz: 'plyus beradi', en: 'gives plus' },
    memo_q2: { ru: 'Деление на ноль', uz: "Nolga bo'lish", en: 'Division by zero' },
    memo_a2: { ru: 'не существует', uz: 'mavjud emas', en: 'does not exist' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'применить правило к сложению', uz: "qoidani qo'shishga qo'llash", en: 'using the rule for addition' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Сначала работаем с модулями: перемножаем их или делим. Потом ставим знак. Одинаковые знаки дают плюс, разные минус. Для умножения и деления правило одно, а на ноль делить нельзя.',
        'Батискаф: минус три на минус два это шесть метров.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Avval modullar bilan ishlaymiz: ularni ko'paytiramiz yoki bo'lamiz. Keyin ishora qo'yamiz. Bir xil ishoralar plyus, har xillari minus beradi. Ko'paytirish va bo'lish uchun qoida bitta, nolga bo'lib esa bo'lmaydi.",
        "Batiskaf: minus uch karra minus ikki bu olti metr.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'First work with the absolute values: multiply or divide them. Then set the sign. Equal signs give plus, different ones give minus. One rule for both operations, and never divide by zero.',
        'The bathyscaphe: minus three times minus two is six metres.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Два шага', uz: 'Usul. Ikki qadam', en: 'Method. Two steps' },
    m1_steps: {
      ru: ['Перемножь или раздели модули', 'Посмотри на знаки множителей', 'Одинаковые — плюс, разные — минус'],
      uz: ["Modullarni ko'paytiring yoki bo'ling", "Ko'paytuvchilar ishorasiga qarang", "Bir xil — plyus, har xil — minus"],
      en: ['Multiply or divide the absolute values', 'Look at the signs of the factors', 'Equal give plus, different give minus'],
    },
    m1_no: {
      ru: 'Правило знаков не работает для сложения и вычитания: там решают модули.',
      uz: "Ishoralar qoidasi qo'shish va ayirishda ishlamaydi: u yerda modullar hal qiladi.",
      en: 'The sign rule does not work for addition and subtraction: there the absolute values decide.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: испытательный бассейн, поверхность воды — ноль шкалы.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d29hall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#F1E8D8"/>
      </linearGradient>
      <linearGradient id="d29water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8FCBE0"/><stop offset="100%" stopColor="#3E7F9C"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d29hall)"/>

    {/* Стена лаборатории с лампами */}
    {[0, 1, 2].map((k) => (
      <g key={k}>
        <rect x={54 + k * 96} y="6" width="26" height="5" rx="2.5" fill="#F5C77E"/>
        <path d={`M${67 + k * 96} 11 v6`} stroke="#C9A472" strokeWidth="1.4"/>
      </g>
    ))}

    {/* Бассейн: вода от отметки 0 вниз */}
    <rect x="86" y="34" width="230" height="112" rx="6" fill="#B4A48C"/>
    <rect x="92" y="40" width="218" height="106" fill="url(#d29water)"/>
    <path className="d29-wave" d="M92 44 q22 -5 44 0 q22 5 44 0 q22 -5 44 0 q22 5 44 0 q22 -5 44 0"
      fill="none" stroke="#FFFDF7" strokeWidth="2" opacity="0.6"/>

    {/* Шкала глубин у борта */}
    <g>
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          <path d={`M92 ${44 + k * 32} h14`} stroke="#FFFDF7" strokeWidth="1.6" opacity="0.75"/>
          <text x="112" y={48 + k * 32} fill="#FFFDF7"
            fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700" opacity="0.9">
            {k === 0 ? '0' : '−' + k * 6}
          </text>
        </g>
      ))}
    </g>

    {/* Модель батискафа: висит на тросе и медленно идёт вниз */}
    <path d="M232 40 v14" stroke="#FFFDF7" strokeWidth="1.4" opacity="0.7"/>
    <g className="d29-sub">
      <ellipse cx="0" cy="0" rx="20" ry="12" fill="#F5C77E" stroke="#C9A472" strokeWidth="2"/>
      <circle cx="6" cy="-1" r="5" fill="#EAF4F9" stroke="#C9A472" strokeWidth="1.4"/>
      <path d="M-20 0 l-9 -6 v12 z" fill="#D9603F"/>
      <circle className="d29-bub" cx="-26" cy="-8" r="3" fill="#FFFDF7" opacity="0.75"/>
    </g>

    {/* Пульт и двое наблюдателей */}
    <rect x="326" y="96" width="52" height="34" rx="4" fill="#3B3730"/>
    <rect x="331" y="101" width="42" height="18" rx="3" fill="#2A2723"/>
    <text x="352" y="115" textAnchor="middle" fill="#7ECBE6"
      fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">−12</text>
    <circle className="d29-bub" cx="370" cy="125" r="3" fill="#8FBF7F"/>
    <Person x={344} ground={146} head={12} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={372} ground={146} head={12} shirt="#8FBF7F" hair="#5A4636"/>
    <Person x={54} ground={146} head={12} shirt="#D9603F" hair="#3E3128"/>
    <rect x="0" y="146" width="400" height="8" fill="#D2A96F"/>
  </svg>
);

// Итог: таблица знаков.
const FinalScene = () => {
  const lang = useLang();
  const rows = [
    { a: '+', b: '+', r: '+', tone: '#1F7A4D' },
    { a: '−', b: '−', r: '+', tone: '#1F7A4D' },
    { a: '+', b: '−', r: '−', tone: '#D9603F' },
    { a: '−', b: '+', r: '−', tone: '#D9603F' },
  ];
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      {rows.map((row, i) => (
        <g key={i} transform={`translate(${14 + i * 96}, 18)`}>
          <rect x="0" y="0" width="82" height="42" rx="8" fill="#FFFDF7" stroke={row.tone} strokeWidth="2"/>
          <text x="41" y="28" textAnchor="middle" fill={row.tone}
            fontFamily="'JetBrains Mono', monospace" fontSize="17" fontWeight="700">
            {row.a} · {row.b} = {row.r}
          </text>
        </g>
      ))}
      <text x="200" y="78" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="11" fontWeight="700">
        {tri(lang, 'одинаковые дают плюс, разные минус',
          'bir xillari plyus, har xillari minus beradi',
          'equal signs give plus, different ones minus')}
      </text>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Прямая из уроков 24-28: повторяющийся шаг вниз даёт произведение.
const NumLine = ({ from = -15, to = 3, points = [], arcs = [], size = 'mid', tick = 1 }) => {
  const n = to - from;
  const step = 380 / n;
  const y = 52;
  const px = (v) => 10 + (v - from) * step;
  return (
    <span className={'d29-line-box d29-line-' + size}>
      <svg viewBox="0 0 400 78" aria-hidden="true">
        <defs>
          <marker id="d29ar-r" markerWidth="7" markerHeight="7" refX="5.4" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 z" fill="#D9603F"/>
          </marker>
          <marker id="d29ar-l" markerWidth="7" markerHeight="7" refX="5.4" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 z" fill="#019ACB"/>
          </marker>
        </defs>
        <path d={`M4 ${y} h392`} stroke="#8E8578" strokeWidth="2.2"/>
        {Array.from({ length: n + 1 }, (_, i) => {
          const v = from + i;
          const x = px(v);
          const big = v % tick === 0;
          if (!big && tick > 1) return null;
          return (
            <g key={v}>
              <path d={`M${x} ${y - 5} v10`} stroke="#8E8578" strokeWidth={v === 0 ? 3 : 1.2}/>
              <text x={x} y={y + 20} textAnchor="middle" fill={v === 0 ? '#494550' : '#8A8883'}
                fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="700">{v}</text>
            </g>
          );
        })}
        {arcs.map((a, i) => {
          const right = a.to > a.from;
          const tone = right ? '#D9603F' : '#019ACB';
          const mid = (a.from + a.to) / 2;
          const rise = Math.min(30, 11 + Math.abs(a.to - a.from) * step * 0.32);
          return (
            <g key={i}>
              <path d={`M${px(a.from)} ${y - 4} Q ${px(mid)} ${y - rise * 2} ${px(a.to)} ${y - 4}`}
                fill="none" stroke={tone} strokeWidth="2" strokeLinecap="round"
                markerEnd={right ? 'url(#d29ar-r)' : 'url(#d29ar-l)'}/>
              {a.name && (
                <text x={px(mid)} y={y - rise - 4} textAnchor="middle" fill={tone}
                  fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">{a.name}</text>
              )}
            </g>
          );
        })}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={px(p.v)} cy={y} r="6" fill={p.tone || (p.v < 0 ? '#019ACB' : '#D9603F')}/>
            {p.name && (
              <text x={px(p.v)} y={y + 20} textAnchor="middle" fill={p.tone || (p.v < 0 ? '#019ACB' : '#D9603F')}
                fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">{p.name}</text>
            )}
          </g>
        ))}
      </svg>
    </span>
  );
};

// Прибор урока: лесенка закономерности, где произведение растёт на одно и то же число.
const Stair = ({ rows, shown }) => (
  <span className="d29-stair">
    {rows.map((r, i) => (
      <span key={r.mul} className={'d29-step d29-fade' + (i <= shown ? ' d29-on' : '') + (i >= 3 ? ' d29-step-hot' : '')}>
        <i className="d29-step-mul">{r.mul}</i>
        <i className="d29-step-eq">=</i>
        <i className="d29-step-res">{r.res}</i>
      </span>
    ))}
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d29-line d29-fade' + (on ? ' d29-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d29-stage">
        <span className="d29-sum">
          <i>5</i><b>+</b><i>5</i><b>+</b><i>5</i>
        </span>
        <span className={'d29-chips d29-fade' + (step >= 1 ? ' d29-on' : '')}>
          <i className="d29-chip-g">3 · 5 = 15</i>
          <i className="d29-chip-l">{tri(lang, 'три раза по 5', "uch marta 5 dan", 'three fives')}</i>
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

// Ядро: четыре одинаковых шага вниз.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  const arcs = [];
  const upTo = step >= 1 ? 4 : 2;
  for (let k = 0; k < upTo; k += 1) arcs.push({ from: -k * 3, to: -(k + 1) * 3, name: '−3' });
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d29-stage">
        <NumLine from={-15} to={3} arcs={arcs} tick={3}
          points={step >= 1 ? [{ v: -12, name: '−12' }] : [{ v: -6, name: '−6' }]}/>
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

// Лесенка: минус на минус.
const StairBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_stair;
  const shown = step >= 2 ? 4 : (step >= 1 ? 3 : 2);
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{mt(t(c.lead))}</p>
      <div className="frame fade-up delay-1 d29-stage">
        <Stair rows={c.stair} shown={shown}/>
        <span className={'d29-chips d29-fade' + (step >= 1 ? ' d29-on' : '')}>
          <i className="d29-chip-g">{tri(lang, 'каждый раз на 3 больше', "har safar 3 ga ko'p", 'three more each time')}</i>
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
      <div className="frame fade-up delay-1 d29-stage">
        <span className="d29-expr">(−36) : (−4) · (−2)</span>
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

// Граница: правило знаков не переносится на сложение.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d29-stage">
        <span className="d29-pair d29-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d29-pair d29-pair-good d29-fade' + (step >= 1 ? ' d29-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d29-pair d29-pair-warn d29-fade' + (step >= 2 ? ' d29-on' : '')}>
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
        <div className={'d29-banner fade-up delay-1' + (phase === 'play' ? ' d29-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d29-stage d29-stage-tool">
          {phase === 'demo' ? (
            <>
              <span className="d29-two">
                <i className={'d29-two-box' + (shown >= 0 ? ' d29-two-on' : '')}>|−4| · |6| = 24</i>
                <i className={'d29-two-box d29-two-sign' + (shown >= 1 ? ' d29-two-on' : '')}>− · + = −</i>
              </span>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d29-verdict' + (done ? ' d29-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
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
          <div className="d29-acts fade-up">
            <button className="d29-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d29-btn d29-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenStair = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_stair} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <StairBody step={step}/>}/>
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
      <div className="d29-stage">
        <span className="d29-two">
          <i className="d29-two-box d29-two-on">(+) · (+) = +</i>
          <i className="d29-two-box d29-two-on">(−) · (−) = +</i>
          <i className="d29-two-box d29-two-sign d29-two-on">(+) · (−) = −</i>
        </span>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenSign = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_sign} asideNode={methodAside}/>
);
const ScreenCalc = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_calc} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: погружение по одной и той же шкале.
const TaskFig = ({ idx }) => {
  const arcs = [];
  const steps = idx >= 1 ? 9 : 7;
  for (let k = 0; k < steps; k += 1) arcs.push({ from: -k * 3, to: -(k + 1) * 3 });
  return (
    <div className="d29-task-fig">
      <NumLine from={-30} to={3} size="sm" tick={3} arcs={arcs}
        points={[{ v: -steps * 3, name: '−' + steps * 3 }]}/>
    </div>
  );
};

const ScreenTask = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_task}
    figureNode={(it, idx) => <TaskFig idx={idx}/>}/>
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
.d29-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d29-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d29-stage-tool .d29-line { font-size: clamp(12px, 2vw, 16px); }

/* Прямая с повторяющимся шагом */
.d29-line-box { display: block; width: 100%; }
.d29-line-box svg { width: 100%; height: auto; display: block; }
.d29-line-sm { max-width: 92%; }

.d29-fade { opacity: 0; transition: opacity 420ms linear; }
.d29-on { opacity: 1; }
.d29-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.3vw, 17px); font-weight: 700; color: #494550; text-align: center; }
.d29-expr { font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.2vw, 26px); font-weight: 700; color: #494550; }

/* Повторяющееся слагаемое */
.d29-sum { display: inline-flex; align-items: center; gap: 10px; }
.d29-sum i { font-style: normal; width: clamp(34px, 6vw, 48px); height: clamp(34px, 6vw, 48px); display: inline-flex; align-items: center; justify-content: center; border-radius: 12px; background: #E7F5FA; border: 1px solid #B6DCEA; font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3vw, 24px); font-weight: 700; color: #019ACB; }
.d29-sum b { font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3vw, 22px); color: #8A8883; }

/* Лесенка закономерности */
.d29-stair { display: flex; flex-direction: column; gap: clamp(4px, 0.9vw, 7px); width: 100%; align-items: center; }
.d29-step { display: inline-flex; align-items: center; gap: 10px; padding: clamp(4px, 0.9vw, 7px) clamp(10px, 2vw, 16px); border-radius: 12px; background: #F4F1EA; border: 1px solid #E9E3D9; }
.d29-step-hot { background: #E3F0E8; border-color: #A9CFBA; }
.d29-step i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-weight: 700; }
.d29-step-mul { font-size: clamp(13px, 2.4vw, 18px); color: #494550; min-width: clamp(90px, 17vw, 128px); text-align: right; }
.d29-step-eq { font-size: clamp(13px, 2.4vw, 18px); color: #8A8883; }
.d29-step-res { font-size: clamp(14px, 2.6vw, 20px); color: #019ACB; min-width: clamp(34px, 6vw, 48px); text-align: left; }
.d29-step-hot .d29-step-res { color: #1F7A4D; }

/* Подписи */
.d29-chips { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d29-chips i { font-style: normal; padding: 5px 12px; border-radius: 10px; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 15px); font-weight: 700; }
.d29-chip-g { background: #E3F0E8; border: 1px solid #A9CFBA; color: #1F7A4D; }
.d29-chip-l { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }

/* Два шага на экране 4 и таблица знаков */
.d29-two { display: inline-flex; gap: clamp(8px, 1.6vw, 14px); flex-wrap: wrap; justify-content: center; }
.d29-two-box { font-style: normal; padding: 6px 14px; border-radius: 12px; background: #F4F1EA; border: 1px solid #E9E3D9; font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 2.6vw, 20px); font-weight: 700; color: #8A8883; opacity: 0.4; transition: opacity 420ms linear, color 420ms linear; }
.d29-two-on { opacity: 1; color: #1F7A4D; background: #E3F0E8; border-color: #A9CFBA; }
.d29-two-sign.d29-two-on { color: #D9603F; background: #FFF1EC; border-color: #F3C4B4; }

/* Строки экрана границы */
.d29-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d29-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d29-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d29-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d29-task-fig { display: block; width: 100%; }

/* Экран 4 */
.d29-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d29-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d29-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d29-verdict-on { opacity: 1; }
.d29-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d29-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d29-btn:disabled { opacity: 0.45; cursor: default; }
.d29-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d29-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: модель уходит вниз, по воде идёт волна, всплывает пузырь */
.d29-sub { animation: d29Sub 7000ms ease-in-out infinite; }
@keyframes d29Sub { 0% { transform: translate(232px, 58px); } 100% { transform: translate(232px, 122px); } }
.d29-wave { animation: d29Wave 4200ms ease-in-out infinite; }
@keyframes d29Wave { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(10px); } }
.d29-bub { animation: d29Bub 2600ms ease-in-out infinite; }
@keyframes d29Bub { 0% { opacity: 0.8; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-14px); } }
@media (prefers-reduced-motion: reduce) { .d29-sub { animation: none; transform: translate(232px, 92px); } .d29-wave, .d29-bub { animation: none; } }
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function MulDivRationalLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenStair, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenSign, ScreenCalc, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
