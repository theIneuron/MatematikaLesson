// ============================================================
// 6 КЛАСС, УРОК 44 «Объём пространственных фигур и единицы измерения»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б12, третий урок. Объём вводится как счёт кубиков, тем же ходом,
// каким в уроке 39 площадь считалась квадратиками. Главный узел урока —
// единицы: один кубический дециметр это тысяча кубических сантиметров
// и ровно один литр. Хук ловит именно потерю перевода единиц.
//
// Сцена — кабинет биологии, аквариум наполняют водой.
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
  lessonId: 'grade6-44',
  lessonTitle: {
    ru: 'Объём и единицы измерения',
    uz: "Hajm va o'lchov birliklari",
    en: 'Volume and its units',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 akvarium: necha litr
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 yuza kvadratchalar bilan
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 hajm kubchalar bilan: V = abc
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: uch o'lchov ko'paytmasi
  { id: 's_unit',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 1 dm³ = 1000 cm³ = 1 litr
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: akvarium
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: 10 emas, 1000
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_vol',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 hajmni topish x3
  { id: 's_conv',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 birliklar va litr x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: yuzami yoki hajm
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: akvarium
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    title: { ru: 'Сколько воды в аквариуме', uz: 'Akvariumda qancha suv', en: 'How much water in the tank' },
    lead: {
      ru: 'Аквариум 40 см в длину, 20 в ширину и 25 в высоту. Его наполняют доверху.',
      uz: "Akvarium uzunligi 40 sm, kengligi 20, balandligi 25. U to'ldiriladi.",
      en: 'A tank is 40 cm long, 20 wide and 25 tall. It is filled to the top.',
    },
    voice_a: { ru: 'Санжар: 20 000 литров.', uz: 'Sanjar: 20 000 litr.', en: 'Sanjar: 20 000 litres.' },
    voice_b: { ru: 'Мадина: 20 литров.', uz: 'Madina: 20 litr.', en: 'Madina: 20 litres.' },
    ask: { ru: 'Сколько воды войдёт в аквариум?', uz: "Akvariumga qancha suv sig'adi?", en: 'How much water fits in?' },
    options: [
      { ru: '20 000 л', uz: '20 000 l', en: '20 000 L' },
      { ru: '20 л', uz: '20 l', en: '20 L' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'В кабинете биологии наполняют аквариум. Он сорок сантиметров в длину, двадцать в ширину и двадцать пять в высоту.',
          'Санжар перемножил измерения и говорит, что войдёт двадцать тысяч литров. Мадина отвечает, что двадцать. Сколько воды войдёт в аквариум? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Biologiya xonasida akvarium to'ldirilmoqda. Uning uzunligi qirq santimetr, kengligi yigirma, balandligi yigirma besh.",
          "Sanjar o'lchovlarni ko'paytirib, yigirma ming litr sig'adi deydi. Madina esa yigirma deb javob beradi. Akvariumga qancha suv sig'adi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'In the biology room a tank is being filled. It is forty centimetres long, twenty wide and twenty five tall.',
          'Sanjar multiplied the measurements and says twenty thousand litres fit. Madina answers twenty. How much water fits in? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    title: { ru: 'Площадь считали квадратиками', uz: 'Yuzani kvadratchalar bilan sanardik', en: 'Area was counted in squares' },
    done: {
      ru: 'Площадь измеряют квадратиками, и единица получается квадратной. Объём будем измерять кубиками, и единица станет кубической.',
      uz: "Yuza kvadratchalar bilan o'lchanadi va birlik kvadrat bo'ladi. Hajmni kubchalar bilan o'lchaymiz va birlik kub bo'ladi.",
      en: 'Area is measured in little squares, so the unit is square. Volume will be measured in little cubes, so the unit becomes cubic.',
    },
    audio: {
      ru: [
        'Вспомним площадь. Мы укладывали в фигуру квадратики со стороной один сантиметр и считали, сколько их поместилось. Поэтому единица называется квадратный сантиметр.',
        'С объёмом будет то же самое, только вместо квадратиков кубики.',
        'Кубик со стороной один сантиметр называют кубическим сантиметром. Осталось посчитать, сколько таких кубиков войдёт в коробку.',
      ],
      uz: [
        "Yuzani eslaymiz. Shakl ichiga tomoni bir santimetr kvadratchalarni joylab, nechtasi sig'ganini sanardik. Shuning uchun birlik kvadrat santimetr deb ataladi.",
        "Hajm bilan ham xuddi shunday bo'ladi, faqat kvadratchalar o'rniga kubchalar.",
        "Tomoni bir santimetr kubcha kub santimetr deb ataladi. Endi qutiga shunday kubchalardan nechtasi sig'ishini sanash qoldi.",
      ],
      en: [
        'Recall area. We laid squares of side one centimetre inside a shape and counted how many fit. That is why the unit is a square centimetre.',
        'Volume works the same way, only with cubes instead of squares.',
        'A cube of side one centimetre is called a cubic centimetre. All that is left is counting how many fit in a box.',
      ],
    },
  },

  s_core: {
    title: { ru: 'Считаем кубики слоями', uz: 'Kubchalarni qavatlab sanaymiz', en: 'Counting cubes layer by layer' },
    lines: [
      { ru: 'в одном слое: 5 · 4 = 20 кубиков', uz: 'bir qavatda: 5 · 4 = 20 kubcha', en: 'in one layer: 5 · 4 = 20 cubes' },
      { ru: 'слоёв столько, какова высота: 3', uz: "qavatlar balandlik qancha bo'lsa shuncha: 3", en: 'the layers match the height: 3' },
      { ru: 'V = 5 · 4 · 3 = 60 см³', uz: 'V = 5 · 4 · 3 = 60 sm³', en: 'V = 5 · 4 · 3 = 60 cm³' },
    ],
    done: {
      ru: 'Объём прямоугольной коробки равен произведению трёх измерений. У куба все три равны, поэтому объём — сторона трижды.',
      uz: "To'g'ri burchakli qutining hajmi uch o'lchovning ko'paytmasiga teng. Kubda uchalasi teng, shuning uchun hajm tomon uch marta.",
      en: 'The volume of a rectangular box is the product of its three measurements. In a cube all three are equal, so the volume is the side three times.',
    },
    audio: {
      ru: [
        'Возьмём коробку пять на четыре сантиметра, высотой три. Выложим дно кубиками: в ряду пять, рядов четыре, значит в слое двадцать кубиков.',
        'Теперь ставим второй такой же слой, потом третий. Слоёв ровно столько, какова высота, то есть три.',
        'Всего кубиков двадцать умножить на три, то есть шестьдесят. Значит объём равен произведению длины, ширины и высоты. У куба все три измерения одинаковые, поэтому объём это сторона, умноженная сама на себя трижды.',
      ],
      uz: [
        "Besh karra to'rt santimetr, balandligi uch qutini olamiz. Tubini kubchalar bilan to'ldiramiz: qatorda beshta, qator to'rtta, demak qavatda yigirmata kubcha.",
        "Endi xuddi shunday ikkinchi qavatni, keyin uchinchisini qo'yamiz. Qavatlar balandlik qancha bo'lsa shuncha, ya'ni uchta.",
        "Jami kubchalar yigirma karra uch, ya'ni oltmish. Demak hajm uzunlik, kenglik va balandlik ko'paytmasiga teng. Kubda uchala o'lchov bir xil, shuning uchun hajm tomonni o'ziga uch marta ko'paytirish.",
      ],
      en: [
        'Take a box five by four centimetres and three tall. Cover the bottom with cubes: five in a row, four rows, so twenty cubes in a layer.',
        'Now add a second identical layer, then a third. There are as many layers as the height, that is three.',
        'Altogether twenty times three, that is sixty cubes. So the volume is length times width times height. In a cube all three are equal, so the volume is the side multiplied by itself three times.',
      ],
    },
  },

  s_tool: {
    title: { ru: 'Три измерения', uz: "Uch o'lchov", en: 'Three measurements' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: 'коробка 6 на 3, высота 2', uz: 'quti 6 ga 3, balandligi 2', en: 'a box 6 by 3, height 2' },
      { ru: 'дно: 6 · 3 = 18 кубиков', uz: 'tubi: 6 · 3 = 18 kubcha', en: 'the bottom: 6 · 3 = 18 cubes' },
      { ru: 'два слоя: 18 · 2 = 36 см³', uz: 'ikki qavat: 18 · 2 = 36 sm³', en: 'two layers: 18 · 2 = 36 cm³' },
    ],
    demo_note: {
      ru: 'Порядок множителей не важен, но единица всегда кубическая: кубиков считаем, значит и единица кубическая.',
      uz: "Ko'paytuvchilar tartibi muhim emas, birlik esa doim kub: kubcha sanaymiz, demak birlik ham kub.",
      en: 'The order of factors does not matter, but the unit is always cubic: we count cubes, so the unit is cubic.',
    },
    play_ask: { ru: 'Коробка 7 на 2, высота 3. Объём?', uz: 'Quti 7 ga 2, balandligi 3. Hajmi?', en: 'A box 7 by 2, height 3. Volume?' },
    play_opts: [
          { ru: '42 см³', uz: '42 sm³', en: '42 cm³' },
          { ru: '12 см³', uz: '12 sm³', en: '12 cm³' },
          { ru: '14 см³', uz: '14 sm³', en: '14 cm³' },
        ],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. 7 · 2 = 14 в слое, три слоя дают 42 см³.',
      uz: "To'g'ri. Qavatda 7 · 2 = 14, uch qavat 42 sm³ beradi.",
      en: 'Right. 7 · 2 = 14 per layer, three layers give 42 cm³.',
    },
    play_wrong: [
      null,
      { ru: 'Это сумма измерений, а объём считают умножением.', uz: "Bu o'lchovlar yig'indisi, hajm esa ko'paytirish bilan topiladi.", en: 'That is a sum; volume comes from multiplying.' },
      { ru: 'Это только один слой, а слоёв три.', uz: 'Bu faqat bitta qavat, qavatlar esa uchta.', en: 'That is one layer, but there are three.' },
    ],
    audio: {
      intro: {
        ru: 'Покажу расчёт. Коробка шесть на три сантиметра, высотой два.',
        uz: "Hisobni ko'rsataman. Quti olti karra uch santimetr, balandligi ikki.",
        en: 'I will show the calculation. A box six by three centimetres, two tall.',
      },
      demo: {
        ru: 'Считаем дно: шесть на три это восемнадцать кубиков в слое. Высота два, значит слоёв тоже два. Восемнадцать умножить на два это тридцать шесть кубических сантиметров.',
        uz: "Tubini hisoblaymiz: olti karra uch qavatda o'n sakkiz kubcha. Balandlik ikki, demak qavatlar ham ikkita. O'n sakkiz karra ikki o'ttiz olti kub santimetr.",
        en: 'Count the bottom: six by three is eighteen cubes per layer. The height is two, so there are two layers. Eighteen times two is thirty six cubic centimetres.',
      },
      play: {
        ru: 'Теперь ваша очередь. Коробка семь на два сантиметра, высотой три. Чему равен объём?',
        uz: 'Endi sizning navbatingiz. Quti yetti karra ikki santimetr, balandligi uch. Hajmi nechaga teng?',
        en: 'Now it is your turn. A box seven by two centimetres, three tall. What is the volume?',
      },
      ok: {
        ru: 'Верно. Четырнадцать в слое, а слоёв три.',
        uz: "To'g'ri. Qavatda o'n to'rt, qavatlar esa uchta.",
        en: 'Right. Fourteen per layer and three layers.',
      },
      wrong: {
        ru: 'Перемножьте все три измерения: длину, ширину и высоту.',
        uz: "Uchala o'lchovni ko'paytiring: uzunlik, kenglik va balandlik.",
        en: 'Multiply all three: length, width and height.',
      },
    },
  },

  s_unit: {
    title: { ru: 'Дециметр, литр и тысяча', uz: 'Detsimetr, litr va ming', en: 'Decimetre, litre and a thousand' },
    lines: [
      { ru: 'кубик 10 на 10 на 10 см — это 1 дм³', uz: '10 ga 10 ga 10 sm kubcha — bu 1 dm³', en: 'a 10 by 10 by 10 cm cube is 1 dm³' },
      { ru: 'в нём 10 · 10 · 10 = 1000 см³', uz: 'unda 10 · 10 · 10 = 1000 sm³', en: 'it holds 10 · 10 · 10 = 1000 cm³' },
      { ru: '1 дм³ = 1 литр', uz: '1 dm³ = 1 litr', en: '1 dm³ = 1 litre' },
    ],
    done: {
      ru: 'Литр — это и есть объём кубика со стороной 10 см. Поэтому кубические сантиметры переводят в литры делением на 1000.',
      uz: "Litr aynan tomoni 10 sm bo'lgan kubchaning hajmi. Shuning uchun kub santimetrlar 1000 ga bo'lib litrga o'tkaziladi.",
      en: 'A litre is exactly the volume of a cube with side 10 cm. So cubic centimetres become litres by dividing by 1000.',
    },
    audio: {
      ru: [
        'Возьмём кубик со стороной один дециметр, то есть десять сантиметров. Его объём один кубический дециметр.',
        'А сколько в нём кубических сантиметров? Десять на десять на десять, то есть тысяча. Не десять и не сто, а именно тысяча: измерений три, и каждое выросло в десять раз.',
        'И самое полезное: один кубический дециметр это ровно один литр. Так и придумали литр. Значит из кубических сантиметров в литры переходят делением на тысячу.',
      ],
      uz: [
        "Tomoni bir detsimetr, ya'ni o'n santimetr kubchani olamiz. Uning hajmi bir kub detsimetr.",
        "Unda nechta kub santimetr bor? O'n karra o'n karra o'n, ya'ni ming. O'n ham, yuz ham emas, aynan ming: o'lchov uchta va har biri o'n barobar oshdi.",
        "Eng foydalisi: bir kub detsimetr roppa-rosa bir litr. Litr shunday o'ylab topilgan. Demak kub santimetrdan litrga mingga bo'lib o'tiladi.",
      ],
      en: [
        'Take a cube with side one decimetre, that is ten centimetres. Its volume is one cubic decimetre.',
        'How many cubic centimetres are in it? Ten by ten by ten, that is a thousand. Not ten and not a hundred but exactly a thousand: there are three measurements and each grew ten times.',
        'And the most useful part: one cubic decimetre is exactly one litre. That is how the litre was defined. So cubic centimetres become litres by dividing by a thousand.',
      ],
    },
  },

  s_solve: {
    title: { ru: 'Аквариум в литрах', uz: 'Akvarium litrda', en: 'The tank in litres' },
    lead: { ru: 'Аквариум 40 на 20 см, высота 25 см.', uz: 'Akvarium 40 ga 20 sm, balandligi 25 sm.', en: 'The tank is 40 by 20 cm, 25 cm tall.' },
    steps: [
      { ru: '40 · 20 = 800 см² в слое', uz: 'qavatda 40 · 20 = 800 sm²', en: '40 · 20 = 800 cm² per layer' },
      { ru: '800 · 25 = 20 000 см³', uz: '800 · 25 = 20 000 sm³', en: '800 · 25 = 20 000 cm³' },
      { ru: '20 000 : 1000 = 20 литров', uz: '20 000 : 1000 = 20 litr', en: '20 000 : 1000 = 20 litres' },
    ],
    done: {
      ru: 'Число 20 000 верное, но это кубические сантиметры, а не литры. После деления на 1000 получается 20 литров. Права была Мадина.',
      uz: "20 000 soni to'g'ri, ammo bu kub santimetr, litr emas. 1000 ga bo'lgandan keyin 20 litr chiqadi. Madina haq edi.",
      en: 'The number 20 000 is right, but those are cubic centimetres, not litres. Dividing by 1000 gives 20 litres. Madina was right.',
    },
    audio: {
      ru: [
        'Решаем вместе. Дно аквариума сорок на двадцать, это восемьсот квадратных сантиметров. Высота двадцать пять, значит слоёв двадцать пять.',
        'Восемьсот умножить на двадцать пять это двадцать тысяч кубических сантиметров. Санжар это число и назвал, но он назвал его литрами.',
        'А в одном литре тысяча кубических сантиметров. Делим двадцать тысяч на тысячу и получаем двадцать литров. Права была Мадина: число посчитано верно, ошибка была в единице.',
      ],
      uz: [
        "Birga yechamiz. Akvarium tubi qirq karra yigirma, bu sakkiz yuz kvadrat santimetr. Balandlik yigirma besh, demak qavatlar yigirma beshta.",
        "Sakkiz yuz karra yigirma besh yigirma ming kub santimetr. Sanjar shu sonni aytdi, lekin uni litr deb atadi.",
        "Bir litrda esa ming kub santimetr bor. Yigirma mingni mingga bo'lib, yigirma litr olamiz. Madina haq edi: son to'g'ri hisoblangan, xato birlikda edi.",
      ],
      en: [
        'Let us solve it together. The bottom is forty by twenty, that is eight hundred square centimetres. The height is twenty five, so twenty five layers.',
        'Eight hundred times twenty five is twenty thousand cubic centimetres. Sanjar named that number but called it litres.',
        'And one litre holds a thousand cubic centimetres. Divide twenty thousand by a thousand and get twenty litres. Madina was right: the number was computed correctly, the error was in the unit.',
      ],
    },
  },

  s_edge: {
    title: { ru: 'Не десять, а тысяча', uz: "O'n emas, ming", en: 'Not ten but a thousand' },
    bad_line: { ru: 'ошибка: 1 дм³ = 10 см³', uz: 'xato: 1 dm³ = 10 sm³', en: 'mistake: 1 dm³ = 10 cm³' },
    good_line: { ru: 'верно: 1 дм³ = 1000 см³ = 1 литр', uz: "to'g'ri: 1 dm³ = 1000 sm³ = 1 litr", en: 'right: 1 dm³ = 1000 cm³ = 1 litre' },
    warn_line: { ru: 'ошибка: 20 000 см³ назвали литрами', uz: 'xato: 20 000 sm³ litr deb atalgan', en: 'mistake: 20 000 cm³ called litres' },
    done: {
      ru: 'В объёме измерений три, поэтому при переходе от дециметра к сантиметру число растёт в 1000 раз, а не в 10. И единицу в ответе называют вслух.',
      uz: "Hajmda o'lchov uchta, shuning uchun detsimetrdan santimetrga o'tishda son 10 emas, 1000 barobar oshadi. Javobdagi birlik esa ovoz chiqarib aytiladi.",
      en: 'Volume has three measurements, so going from decimetres to centimetres multiplies the number by 1000, not 10. And say the unit out loud.',
    },
    audio: {
      ru: [
        'Главная ошибка урока в единицах. В одном дециметре десять сантиметров, и кажется, что и в кубическом дециметре десять кубических сантиметров.',
        'Но кубик десять на десять на десять содержит тысячу маленьких кубиков. Измерений три, и каждое выросло в десять раз: десять умножить на десять умножить на десять.',
        'Вторая ошибка отсюда же: посчитали правильное число, но назвали его не той единицей. Двадцать тысяч это кубические сантиметры, а в литрах будет двадцать. Всегда проговаривайте единицу вместе с числом.',
      ],
      uz: [
        "Darsning asosiy xatosi birliklarda. Bir detsimetrda o'n santimetr bor va kub detsimetrda ham o'n kub santimetr bordek tuyuladi.",
        "Ammo o'n karra o'n karra o'n kubcha mingta kichik kubchani o'z ichiga oladi. O'lchov uchta va har biri o'n barobar oshdi: o'n karra o'n karra o'n.",
        "Ikkinchi xato shundan: to'g'ri son hisoblangan, lekin noto'g'ri birlik bilan atalgan. Yigirma ming bu kub santimetr, litrda esa yigirma bo'ladi. Birlikni doim son bilan birga aytib chiqing.",
      ],
      en: [
        'The main mistake here is in units. One decimetre holds ten centimetres, so it feels like a cubic decimetre holds ten cubic centimetres.',
        'But a ten by ten by ten cube contains a thousand small cubes. There are three measurements and each grew ten times: ten times ten times ten.',
        'The second mistake follows: the number was right but named with the wrong unit. Twenty thousand are cubic centimetres, and in litres it is twenty. Always say the unit together with the number.',
      ],
    },
  },

  s_rule: {
    title: { ru: 'Объём и его единицы', uz: 'Hajm va uning birliklari', en: 'Volume and its units' },
    rule_1: {
      ru: 'Объём прямоугольной коробки равен произведению длины, ширины и высоты: V = a · b · c. У куба все измерения равны. Единица объёма кубическая.',
      uz: "To'g'ri burchakli qutining hajmi uzunlik, kenglik va balandlik ko'paytmasiga teng: V = a · b · c. Kubda barcha o'lchovlar teng. Hajm birligi kub.",
      en: 'The volume of a rectangular box is length times width times height: V = a · b · c. A cube has equal measurements. The unit of volume is cubic.',
    },
    rule_2: {
      ru: '1 дм³ = 1000 см³ и 1 дм³ = 1 литр. Аквариум: 20 000 см³, то есть 20 литров. Права была Мадина.',
      uz: "1 dm³ = 1000 sm³ va 1 dm³ = 1 litr. Akvarium: 20 000 sm³, ya'ni 20 litr. Madina haq edi.",
      en: '1 dm³ = 1000 cm³ and 1 dm³ = 1 litre. The tank: 20 000 cm³, that is 20 litres. Madina was right.',
    },
    audio: {
      ru: 'Запомним правило. Объём прямоугольной коробки равен произведению длины, ширины и высоты, потому что в одном слое умещается длина на ширину кубиков, а слоёв столько, какова высота. У куба все три измерения равны. Единица объёма всегда кубическая. Один кубический дециметр это тысяча кубических сантиметров и ровно один литр. Вернёмся к аквариуму. Двадцать тысяч кубических сантиметров это двадцать литров. Права была Мадина.',
      uz: "Qoidani eslab qolamiz. To'g'ri burchakli qutining hajmi uzunlik, kenglik va balandlik ko'paytmasiga teng, chunki bir qavatga uzunlik karra kenglik kubcha joylashadi, qavatlar esa balandlik qancha bo'lsa shuncha. Kubda uchala o'lchov teng. Hajm birligi doim kub. Bir kub detsimetr ming kub santimetr va roppa-rosa bir litr. Akvariumga qaytamiz. Yigirma ming kub santimetr bu yigirma litr. Madina haq edi.",
      en: 'Let us remember the rule. The volume of a rectangular box is length times width times height, because one layer holds length by width cubes and there are as many layers as the height. A cube has three equal measurements. The unit of volume is always cubic. One cubic decimetre is a thousand cubic centimetres and exactly one litre. Back to the tank. Twenty thousand cubic centimetres is twenty litres. Madina was right.',
    },
  },

  s_vol: {
    title: { ru: 'Находим объём', uz: 'Hajmni topamiz', en: 'Finding the volume' },
    lead: { ru: 'Перемножь три измерения.', uz: "Uch o'lchovni ko'paytiring.", en: 'Multiply the three measurements.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Коробка 5 на 3, высота 4. Объём?', uz: 'Quti 5 ga 3, balandligi 4. Hajmi?', en: 'A box 5 by 3, height 4. Volume?' },
        opts: [
          { ru: '60 см³', uz: '60 sm³', en: '60 cm³' },
          { ru: '12 см³', uz: '12 sm³', en: '12 cm³' },
          { ru: '15 см³', uz: '15 sm³', en: '15 cm³' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 5 · 3 · 4 = 60 см³.', uz: "To'g'ri. 5 · 3 · 4 = 60 sm³.", en: 'Right. 5 · 3 · 4 = 60 cm³.' },
        wrong: [
          null,
          { ru: 'Это сумма измерений, а объём считают умножением.', uz: "Bu o'lchovlar yig'indisi, hajm ko'paytirish bilan topiladi.", en: 'That is a sum; volume multiplies.' },
          { ru: 'Это только один слой, высоту не учли.', uz: 'Bu faqat bitta qavat, balandlik hisobga olinmagan.', en: 'That is one layer; the height was ignored.' },
        ],
      },
      {
        q: { ru: 'Куб со стороной 3 см. Объём?', uz: 'Tomoni 3 sm kub. Hajmi?', en: 'A cube of side 3 cm. Volume?' },
        opts: [
          { ru: '27 см³', uz: '27 sm³', en: '27 cm³' },
          { ru: '9 см³', uz: '9 sm³', en: '9 cm³' },
          { ru: '12 см³', uz: '12 sm³', en: '12 cm³' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 3 · 3 · 3 = 27 см³.', uz: "To'g'ri. 3 · 3 · 3 = 27 sm³.", en: 'Right. 3 · 3 · 3 = 27 cm³.' },
        wrong: [
          null,
          { ru: 'Это площадь одной грани.', uz: 'Bu bitta yoqning yuzi.', en: 'That is the area of one face.' },
          { ru: 'Это сумма всех рёбер одной грани.', uz: "Bu bitta yoq qirralarining yig'indisi.", en: 'That is a sum of edges.' },
        ],
      },
      {
        q: { ru: 'Коробка 10 на 10, высота 10. Объём?', uz: 'Quti 10 ga 10, balandligi 10. Hajmi?', en: 'A box 10 by 10, height 10. Volume?' },
        opts: [
          { ru: '1000 см³', uz: '1000 sm³', en: '1000 cm³' },
          { ru: '100 см³', uz: '100 sm³', en: '100 cm³' },
          { ru: '30 см³', uz: '30 sm³', en: '30 cm³' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Это кубический дециметр, то есть литр.', uz: "To'g'ri. Bu kub detsimetr, ya'ni litr.", en: 'Right. That is a cubic decimetre, a litre.' },
        wrong: [
          null,
          { ru: 'Это площадь дна, высоту не учли.', uz: 'Bu tubning yuzi, balandlik hisobga olinmagan.', en: 'That is the bottom area; the height was ignored.' },
          { ru: 'Измерения перемножают, а не складывают.', uz: "O'lchovlar ko'paytiriladi, qo'shilmaydi.", en: 'The measurements multiply, they do not add.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на объём. Перемножайте все три измерения и не забывайте кубическую единицу.',
        uz: "Hajm mashqi. Uchala o'lchovni ko'paytiring va kub birlikni unutmang.",
        en: 'Practice on volume. Multiply all three and remember the cubic unit.',
      },
    },
  },

  s_conv: {
    title: { ru: 'Единицы и литры', uz: 'Birliklar va litrlar', en: 'Units and litres' },
    lead: { ru: 'В одном литре 1000 кубических сантиметров.', uz: 'Bir litrda 1000 kub santimetr bor.', en: 'One litre holds 1000 cubic centimetres.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сколько см³ в 1 дм³?', uz: '1 dm³ da nechta sm³ bor?', en: 'How many cm³ in 1 dm³?' },
        opts: ['1000', '10', '100'],
        correct: 0,
        ok: { ru: 'Верно. 10 · 10 · 10 = 1000.', uz: "To'g'ri. 10 · 10 · 10 = 1000.", en: 'Right. 10 · 10 · 10 = 1000.' },
        wrong: [
          null,
          { ru: 'Десять сантиметров в дециметре, но измерений три.', uz: "Detsimetrda o'n santimetr, lekin o'lchov uchta.", en: 'Ten centimetres per decimetre, but there are three measurements.' },
          { ru: 'Сто было бы для площади, а у объёма измерений три.', uz: "Yuz yuza uchun bo'lardi, hajmda esa o'lchov uchta.", en: 'A hundred fits area; volume has three measurements.' },
        ],
      },
      {
        q: { ru: '5000 см³ — сколько это литров?', uz: '5000 sm³ necha litr?', en: '5000 cm³ is how many litres?' },
        opts: [
          { ru: '5 л', uz: '5 l', en: '5 L' },
          { ru: '50 л', uz: '50 l', en: '50 L' },
          { ru: '500 л', uz: '500 l', en: '500 L' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 5000 : 1000 = 5 литров.', uz: "To'g'ri. 5000 : 1000 = 5 litr.", en: 'Right. 5000 : 1000 = 5 litres.' },
        wrong: [
          null,
          { ru: 'Делить нужно на 1000, а не на 100.', uz: "1000 ga bo'lish kerak, 100 ga emas.", en: 'Divide by 1000, not 100.' },
          { ru: 'Делить нужно на 1000, а не на 10.', uz: "1000 ga bo'lish kerak, 10 ga emas.", en: 'Divide by 1000, not 10.' },
        ],
      },
      {
        q: { ru: 'Бак 30 на 20 см, высота 50 см. Сколько литров?', uz: 'Bak 30 ga 20 sm, balandligi 50 sm. Necha litr?', en: 'A tank 30 by 20 cm, 50 tall. Litres?' },
        opts: [
          { ru: '30 л', uz: '30 l', en: '30 L' },
          { ru: '30 000 л', uz: '30 000 l', en: '30,000 L' },
          { ru: '300 л', uz: '300 l', en: '300 L' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 30 000 см³ это 30 литров.', uz: "To'g'ri. 30 000 sm³ bu 30 litr.", en: 'Right. 30 000 cm³ is 30 litres.' },
        wrong: [
          null,
          { ru: 'Это кубические сантиметры, а спрашивали литры.', uz: "Bu kub santimetr, so'ralgani esa litr.", en: 'Those are cubic centimetres, but litres were asked.' },
          { ru: 'Делить надо на 1000, а не на 100.', uz: "1000 ga bo'lish kerak, 100 ga emas.", en: 'Divide by 1000, not 100.' },
        ],
      },
      {
        q: { ru: 'В чём измеряют объём?', uz: "Hajm nimada o'lchanadi?", en: 'What are the units of volume?' },
        opts: [
          { ru: 'в кубических сантиметрах', uz: 'kub santimetrda', en: 'in cubic centimetres' },
          { ru: 'в квадратных сантиметрах', uz: 'kvadrat santimetrda', en: 'in square centimetres' },
          { ru: 'в сантиметрах', uz: 'santimetrda', en: 'in centimetres' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Считаем кубики, значит единица кубическая.', uz: "To'g'ri. Kubcha sanaymiz, demak birlik kub.", en: 'Right. We count cubes, so the unit is cubic.' },
        wrong: [
          null,
          { ru: 'Так измеряют площадь.', uz: "Bunday yuza o'lchanadi.", en: 'That measures area.' },
          { ru: 'Так измеряют длину.', uz: "Bunday uzunlik o'lchanadi.", en: 'That measures length.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на единицы. Помните: из кубических сантиметров в литры делят на тысячу.',
        uz: "Birliklar mashqi. Yodda tuting: kub santimetrdan litrga mingga bo'linadi.",
        en: 'Practice on units. Remember: cubic centimetres to litres divide by a thousand.',
      },
    },
  },

  s_bins: {
    title: { ru: 'Площадь или объём', uz: 'Yuzami yoki hajm', en: 'Area or volume' },
    lead: { ru: 'Смотри, покрывают поверхность или заполняют внутри.', uz: "Yuzani qoplaydimi yoki ichini to'ldiradimi, qarang.", en: 'See whether it covers a surface or fills the inside.' },
    bin_a: { ru: 'Это площадь', uz: 'Bu yuza', en: 'Area' },
    bin_b: { ru: 'Это объём', uz: 'Bu hajm', en: 'Volume' },
    cards: [
      { label: { ru: 'краска на стену', uz: "devorga bo'yoq", en: 'paint for a wall' }, bin: 'a' },
      { label: { ru: 'плитка на пол', uz: 'polga plitka', en: 'tiles for a floor' }, bin: 'a' },
      { label: { ru: 'обои на комнату', uz: 'xonaga oboy', en: 'wallpaper for a room' }, bin: 'a' },
      { label: { ru: 'вода в аквариум', uz: 'akvariumga suv', en: 'water for a tank' }, bin: 'b' },
      { label: { ru: 'песок в ящик', uz: 'yashikka qum', en: 'sand for a box' }, bin: 'b' },
      { label: { ru: 'воздух в комнате', uz: 'xonadagi havo', en: 'air in a room' }, bin: 'b' },
    ],
    hint: {
      ru: 'Площадь измеряют квадратиками, объём — кубиками.',
      uz: "Yuza kvadratchalar, hajm esa kubchalar bilan o'lchanadi.",
      en: 'Area is measured in squares, volume in cubes.',
    },
    correct_text: {
      ru: 'Верно. Единица в ответе сразу показывает, что искали.',
      uz: "To'g'ri. Javobdagi birlik nima qidirilganini darrov ko'rsatadi.",
      en: 'Right. The unit in the answer shows what was sought.',
    },
    audio: {
      intro: {
        ru: 'Разложите случаи по двум корзинам. Спросите себя: это покрывает поверхность или заполняет внутри?',
        uz: "Hollarni ikki savatga ajrating. O'zingizdan so'rang: bu yuzani qoplaydimi yoki ichini to'ldiradimi?",
        en: 'Sort the cases into two baskets. Ask yourself: does it cover a surface or fill the inside?',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Поверхность или внутренность?', uz: 'Bu yerga emas. Yuzami yoki ichkarisi?', en: 'Not here. Surface or inside?' },
    },
  },

  s_error: {
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Санжар: «2 дм³ = 20 см³». Проверь.', uz: "Sanjar: «2 dm³ = 20 sm³». Tekshiring.", en: 'Sanjar: “2 dm³ = 20 cm³.” Check it.' },
        opts: [
          { ru: 'Нет: 2 дм³ = 2000 см³', uz: "Yo'q: 2 dm³ = 2000 sm³", en: 'No: 2 dm³ = 2000 cm³' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет 200 см³', uz: "Yo'q, 200 sm³ bo'ladi", en: 'No, it is 200 cm³' },
        ],
        correct: 0,
        ok: { ru: 'Верно. В одном дм³ тысяча см³.', uz: "To'g'ri. Bir dm³ da ming sm³ bor.", en: 'Right. One dm³ holds a thousand cm³.' },
        wrong: [
          null,
          { ru: 'Измерений три, поэтому множитель тысяча.', uz: "O'lchov uchta, shuning uchun ko'paytuvchi ming.", en: 'Three measurements mean a factor of a thousand.' },
          { ru: 'Сто это множитель для площади.', uz: "Yuz yuza uchun ko'paytuvchi.", en: 'A hundred is the factor for area.' },
        ],
      },
      {
        q: { ru: 'Мадина: «Объём 8000 см³, значит 8000 литров». Проверь.', uz: "Madina: «Hajm 8000 sm³, demak 8000 litr». Tekshiring.", en: 'Madina: “Volume 8000 cm³, so 8000 litres.” Check it.' },
        opts: [
          { ru: 'Нет: это 8 литров', uz: "Yo'q: bu 8 litr", en: 'No: that is 8 litres' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, это 80 литров', uz: "Yo'q, bu 80 litr", en: 'No, that is 80 litres' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Делим на 1000, ведь литр это 1000 см³.', uz: "To'g'ri. 1000 ga bo'lamiz, axir litr 1000 sm³.", en: 'Right. Divide by 1000, since a litre is 1000 cm³.' },
        wrong: [
          null,
          { ru: 'Кубические сантиметры и литры это разные единицы.', uz: 'Kub santimetr va litr har xil birliklar.', en: 'Cubic centimetres and litres are different units.' },
          { ru: 'Делить надо на 1000, а не на 100.', uz: "1000 ga bo'lish kerak, 100 ga emas.", en: 'Divide by 1000, not 100.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в переводе единиц, и в их названии.',
        uz: "Birovning yechimini tekshiring. Xato birliklarni o'tkazishda ham, ularni atashda ham bo'ladi.",
        en: 'Check someone else’s work. A mistake can be in converting units and in naming them.',
      },
    },
  },

  s_task: {
    title: { ru: 'Аквариум и лейка', uz: 'Akvarium va chelak', en: 'The tank and the jug' },
    lead: { ru: 'Аквариум 40 на 20 см, высота 25 см. Лейка на 5 литров.', uz: 'Akvarium 40 ga 20 sm, balandligi 25 sm. Chelak 5 litrlik.', en: 'The tank is 40 by 20 by 25 cm. The jug holds 5 litres.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сколько литров войдёт в аквариум?', uz: "Akvariumga necha litr sig'adi?", en: 'How many litres fit in the tank?' },
        opts: [
          { ru: '20 л', uz: '20 l', en: '20 L' },
          { ru: '20 000 л', uz: '20 000 l', en: '20,000 L' },
          { ru: '2 л', uz: '2 l', en: '2 L' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 20 000 см³ это 20 литров.', uz: "To'g'ri. 20 000 sm³ bu 20 litr.", en: 'Right. 20 000 cm³ is 20 litres.' },
        wrong: [
          null,
          { ru: 'Это кубические сантиметры, а не литры.', uz: 'Bu kub santimetr, litr emas.', en: 'Those are cubic centimetres, not litres.' },
          { ru: 'Делить надо на 1000, а не на 10 000.', uz: "1000 ga bo'lish kerak, 10 000 ga emas.", en: 'Divide by 1000, not 10 000.' },
        ],
      },
      {
        q: { ru: 'Сколько раз придётся принести полную лейку?', uz: "To'la chelakni necha marta olib kelish kerak?", en: 'How many full jugs are needed?' },
        opts: ['4', '5', '100'],
        correct: 0,
        ok: { ru: 'Верно. 20 : 5 = 4 лейки.', uz: "To'g'ri. 20 : 5 = 4 chelak.", en: 'Right. 20 : 5 = 4 jugs.' },
        wrong: [
          null,
          { ru: 'Это объём лейки, а не число походов.', uz: 'Bu chelak hajmi, borish soni emas.', en: 'That is the jug’s volume, not the number of trips.' },
          { ru: 'Делить нужно литры на литры.', uz: "Litrni litrga bo'lish kerak.", en: 'Divide litres by litres.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про аквариум. Он сорок на двадцать сантиметров, высотой двадцать пять, а лейка вмещает пять литров.',
        uz: "Akvarium haqida masala. U qirq karra yigirma santimetr, balandligi yigirma besh, chelak esa besh litr suv oladi.",
        en: 'A tank problem. It is forty by twenty centimetres, twenty five tall, and the jug holds five litres.',
      },
    },
  },

  s_final: {
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 1000,
        q: { ru: 'Сколько кубических сантиметров в одном литре?', uz: 'Bir litrda nechta kub santimetr bor?', en: 'How many cubic centimetres in one litre?' },
        hint: { ru: 'Это кубик 10 на 10 на 10.', uz: 'Bu 10 ga 10 ga 10 kubcha.', en: 'It is a 10 by 10 by 10 cube.' },
        hint_audio: { ru: 'Литр это кубик со стороной десять сантиметров, значит перемножьте десять на десять на десять.', uz: "Litr tomoni o'n santimetr kubcha, demak o'n karra o'n karra o'nni ko'paytiring.", en: 'A litre is a cube of side ten centimetres, so multiply ten by ten by ten.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Коробка 4 на 5, высота 6. Объём?', uz: 'Quti 4 ga 5, balandligi 6. Hajmi?', en: 'A box 4 by 5, height 6. Volume?' },
        opts_i18n: [
          { ru: '15 см³', uz: '15 sm³', en: '15 cm³' },
          { ru: '20 см³', uz: '20 sm³', en: '20 cm³' },
          { ru: '120 см³', uz: '120 sm³', en: '120 cm³' },
          { ru: '30 см³', uz: '30 sm³', en: '30 cm³' },
        ],
        wrong: [
          { ru: 'Это сумма измерений.', uz: "Bu o'lchovlar yig'indisi.", en: 'That is a sum of measurements.' },
          { ru: 'Это только один слой.', uz: 'Bu faqat bitta qavat.', en: 'That is one layer only.' },
          null,
          { ru: 'Высота учтена не полностью.', uz: "Balandlik to'liq hisobga olinmagan.", en: 'The height was not fully used.' },
        ],
        correct: { ru: 'Верно. 4 · 5 · 6 = 120 см³.', uz: "To'g'ri. 4 · 5 · 6 = 120 sm³.", en: 'Right. 4 · 5 · 6 = 120 cm³.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: '7000 см³ — сколько это литров?', uz: '7000 sm³ necha litr?', en: '7000 cm³ is how many litres?' },
        opts_i18n: [
          { ru: '70 л', uz: '70 l', en: '70 L' },
          { ru: '7 л', uz: '7 l', en: '7 L' },
          { ru: '700 л', uz: '700 l', en: '700 L' },
          { ru: '7000 л', uz: '7000 l', en: '7000 L' },
        ],
        wrong: [
          { ru: 'Делить нужно на 1000, а не на 100.', uz: "1000 ga bo'lish kerak, 100 ga emas.", en: 'Divide by 1000, not 100.' },
          null,
          { ru: 'Делить нужно на 1000, а не на 10.', uz: "1000 ga bo'lish kerak, 10 ga emas.", en: 'Divide by 1000, not 10.' },
          { ru: 'Это то же число, только с другой единицей.', uz: "Bu o'sha son, faqat birligi boshqa.", en: 'That is the same number with a different unit.' },
        ],
        correct: { ru: 'Верно. 7000 : 1000 = 7 литров.', uz: "To'g'ri. 7000 : 1000 = 7 litr.", en: 'Right. 7000 : 1000 = 7 litres.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Куб со стороной 10 см. Как называется его объём?', uz: 'Tomoni 10 sm kub. Uning hajmi qanday ataladi?', en: 'A cube of side 10 cm. What is its volume called?' },
        opts: [
          { ru: '10 см³', uz: '10 sm³', en: '10 cm³' },
          { ru: '100 см³', uz: '100 sm³', en: '100 cm³' },
          { ru: '10 литров', uz: '10 litr', en: '10 litres' },
          { ru: '1 литр, или 1 дм³', uz: '1 litr, yoki 1 dm³', en: '1 litre, or 1 dm³' },
        ],
        wrong: [
          { ru: 'Десять это длина стороны, а не объём.', uz: "O'n bu tomon uzunligi, hajm emas.", en: 'Ten is the side length, not the volume.' },
          { ru: 'Сто это площадь одной грани.', uz: 'Yuz bu bitta yoqning yuzi.', en: 'A hundred is the area of one face.' },
          { ru: 'Такой кубик вмещает ровно один литр.', uz: "Bunday kubcha roppa-rosa bir litr oladi.", en: 'Such a cube holds exactly one litre.' },
          null,
        ],
        correct: { ru: 'Верно. 1000 см³ = 1 дм³ = 1 литр.', uz: "To'g'ri. 1000 sm³ = 1 dm³ = 1 litr.", en: 'Right. 1000 cm³ = 1 dm³ = 1 litre.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Аквариум 40 на 20 на 25 см. Сколько литров?', uz: 'Akvarium 40 ga 20 ga 25 sm. Necha litr?', en: 'A tank 40 by 20 by 25 cm. Litres?' },
        opts_i18n: [
          { ru: '20 л', uz: '20 l', en: '20 L' },
          { ru: '20 000 л', uz: '20 000 l', en: '20,000 L' },
          { ru: '200 л', uz: '200 l', en: '200 L' },
          { ru: '2000 л', uz: '2000 l', en: '2000 L' },
        ],
        wrong: [
          null,
          { ru: 'Это кубические сантиметры, а не литры.', uz: 'Bu kub santimetr, litr emas.', en: 'Those are cubic centimetres, not litres.' },
          { ru: 'Делить надо на 1000.', uz: "1000 ga bo'lish kerak.", en: 'Divide by 1000.' },
          { ru: 'Делить надо на 1000, а не на 10.', uz: "1000 ga bo'lish kerak, 10 ga emas.", en: 'Divide by 1000, not 10.' },
        ],
        correct: { ru: 'Верно. 20 000 см³ это 20 литров.', uz: "To'g'ri. 20 000 sm³ bu 20 litr.", en: 'Right. 20 000 cm³ is 20 litres.' },
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
      ru: 'Литр придумали как объём кубика со стороной 10 см, и это связало между собой длину, объём и массу: литр чистой воды весит примерно один килограмм. Поэтому пятилитровая бутыль воды тянет около пяти килограммов, а полный аквариум на 20 литров — примерно 20 кг, не считая стекла.',
      uz: "Litr tomoni 10 sm bo'lgan kubchaning hajmi sifatida o'ylab topilgan va bu uzunlik, hajm va massani bir-biriga bog'lagan: bir litr toza suv taxminan bir kilogramm keladi. Shuning uchun besh litrlik suv baklashkasi taxminan besh kilogramm, 20 litrlik to'la akvarium esa shishani hisobga olmasa ham taxminan 20 kg tortadi.",
      en: 'The litre was defined as the volume of a cube with side 10 cm, and that tied length, volume and mass together: a litre of pure water weighs about one kilogram. So a five litre bottle weighs some five kilograms, and a full 20 litre tank about 20 kg without the glass.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Литр придумали как объём кубика со стороной десять сантиметров, и это связало между собой длину, объём и массу: литр чистой воды весит примерно один килограмм. Поэтому пятилитровая бутыль воды тянет около пяти килограммов, а полный аквариум на двадцать литров примерно двадцать килограммов, не считая стекла.',
      uz: "Bilasizmi? Litr tomoni o'n santimetr bo'lgan kubchaning hajmi sifatida o'ylab topilgan va bu uzunlik, hajm va massani bir-biriga bog'lagan: bir litr toza suv taxminan bir kilogramm keladi. Shuning uchun besh litrlik suv baklashkasi taxminan besh kilogramm, yigirma litrlik to'la akvarium esa shishani hisobga olmasa ham taxminan yigirma kilogramm tortadi.",
      en: 'Did you know? The litre was defined as the volume of a cube with side ten centimetres, and that tied length, volume and mass together: a litre of pure water weighs about one kilogram. So a five litre bottle weighs some five kilograms, and a full twenty litre tank about twenty kilograms without the glass.',
    },
  },

  s14: {
    banner: { ru: 'Математика · Геометрия', uz: 'Matematika · Geometriya', en: 'Mathematics · Geometry' },
    heading: { ru: 'Объём', uz: 'Hajm', en: 'Volume' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'V = a · b · c, у куба сторона трижды', uz: 'V = a · b · c, kubda tomon uch marta', en: 'V = a · b · c; in a cube, the side thrice' },
    brief_2: { ru: 'единица объёма кубическая', uz: 'hajm birligi kub', en: 'the unit of volume is cubic' },
    brief_3: { ru: '1 дм³ = 1000 см³ = 1 литр', uz: '1 dm³ = 1000 sm³ = 1 litr', en: '1 dm³ = 1000 cm³ = 1 litre' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Из см³ в литры', uz: "sm³ dan litrga", en: 'From cm³ to litres' },
    memo_a1: { ru: 'делим на 1000', uz: "1000 ga bo'lamiz", en: 'divide by 1000' },
    memo_q2: { ru: 'Литр воды', uz: 'Bir litr suv', en: 'A litre of water' },
    memo_a2: { ru: 'весит около 1 кг', uz: 'taxminan 1 kg keladi', en: 'weighs about 1 kg' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'назвать см³ литрами', uz: 'sm³ ni litr deb atash', en: 'calling cm³ litres' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Объём прямоугольной коробки равен произведению длины, ширины и высоты, а у куба это сторона, взятая трижды. Единица объёма всегда кубическая. Один кубический дециметр это тысяча кубических сантиметров и ровно один литр.',
        'Аквариум: двадцать тысяч кубических сантиметров это двадцать литров.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "To'g'ri burchakli qutining hajmi uzunlik, kenglik va balandlik ko'paytmasiga teng, kubda esa bu uch marta olingan tomon. Hajm birligi doim kub. Bir kub detsimetr ming kub santimetr va roppa-rosa bir litr.",
        "Akvarium: yigirma ming kub santimetr bu yigirma litr.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'The volume of a rectangular box is length times width times height, and for a cube it is the side taken three times. The unit of volume is always cubic. One cubic decimetre is a thousand cubic centimetres and exactly one litre.',
        'The tank: twenty thousand cubic centimetres is twenty litres.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Слой и высота', uz: 'Usul. Qavat va balandlik', en: 'Method. Layer and height' },
    m1_steps: {
      ru: ['Посчитай кубики в одном слое: длина на ширину', 'Умножь на высоту: столько слоёв', 'Назови единицу: кубическая, а в литрах делим на 1000'],
      uz: ['Bir qavatdagi kubchalarni sanang: uzunlik karra kenglik', "Balandlikka ko'paytiring: qavatlar shuncha", "Birlikni ayting: kub, litrda esa 1000 ga bo'lamiz"],
      en: ['Count cubes in one layer: length by width', 'Multiply by the height: that many layers', 'Name the unit: cubic, and for litres divide by 1000'],
    },
    m1_no: {
      ru: 'В объёме три измерения, поэтому дециметр даёт множитель 1000, а не 10.',
      uz: "Hajmda uchta o'lchov bor, shuning uchun detsimetr 10 emas, 1000 ko'paytuvchi beradi.",
      en: 'Volume has three measurements, so a decimetre gives a factor of 1000, not 10.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: кабинет биологии, аквариум наполняют водой.
// ============================================================
// СЦЕНА ХУКА — кабинет биологии. Стандарт методиста 2026-08-19:
//   1. предметы соотносятся между собой по-настоящему. Аквариум 40 на 25 см
//      нарисован в пропорции 1,6 (152 на 95 единиц, 3,8 единицы на сантиметр),
//      глубина 20 см показана не подписью, а третьим измерением коробки;
//      лейка ровно вполовину длины аквариума — это её настоящий размер;
//   2. фигуры детей стоят целиком, и это единственная условность масштаба:
//      честный рост ребёнка в этом кадре был бы втрое выше самого кадра
//      (решение методиста);
//   3. движение: главное происходит ОДИН раз — лейка наклоняется и
//      возвращается. Дальше остаётся только микрожизнь: медленный дрейф рыбки,
//      мелкая рябь и два пузырька со дна. Уровень воды не анимируется.
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d44wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EAF4F9"/><stop offset="100%" stopColor="#F9F4EB"/>
      </linearGradient>
      <linearGradient id="d44water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8FCBE0"/><stop offset="100%" stopColor="#4F9EBB"/>
      </linearGradient>
      <clipPath id="d44tankIn">
        <rect x="135" y="34" width="146" height="89"/>
      </clipPath>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d44wall)"/>

    {/* Полка с банками и растением */}
    <g opacity="0.9">
      <rect x="10" y="46" width="86" height="5" rx="2.5" fill="#C9A472"/>
      <rect x="18" y="22" width="18" height="24" rx="3" fill="#E7F5FA" stroke="#B6DCEA" strokeWidth="1.4"/>
      <rect x="42" y="16" width="18" height="30" rx="3" fill="#E7F5FA" stroke="#B6DCEA" strokeWidth="1.4"/>
      <rect x="68" y="30" width="20" height="16" rx="3" fill="#D98A5A"/>
      <path d="M78 30 q-10 -14 -2 -20 q8 8 2 20" fill="#8FBF7F"/>
    </g>

    {/* Пол и тень аквариума на нём: коробка стоит, а не висит */}
    <rect x="0" y="126" width="400" height="28" fill="#D2A96F"/>
    <ellipse cx="228" cy="128" rx="98" ry="5" fill="rgba(90, 62, 34, 0.18)"/>

    {/* АКВАРИУМ. Передняя грань 40 на 25 см, к ней пристроены верх и правый
        бок — так видно третье измерение, 20 см в глубину. */}
    <g>
      <path d="M132 31 L284 31 L318 9 L166 9 Z" fill="#EAF6FB" stroke="#8E8578" strokeWidth="2.2"/>
      <path d="M284 31 L318 9 L318 104 L284 126 Z" fill="#DCEDF5" stroke="#8E8578" strokeWidth="2.2"/>

      {/* вода налита на две трети: уровень 60, задняя кромка выше на глубину */}
      <path d="M135 60 L281 60 L315 38 L169 38 Z" fill="#A8D8E9"/>
      <path d="M281 60 L315 38 L315 101 L281 123 Z" fill="#5FA6C4"/>
      <rect x="135" y="60" width="146" height="63" fill="url(#d44water)"/>

      {/* грунт на дне */}
      <g clipPath="url(#d44tankIn)">
        <rect x="135" y="116" width="146" height="7" fill="#C9A472"/>
        <path d="M281 116 L315 94 L315 101 L281 123 Z" fill="#B08A57"/>
      </g>

      <path className="d44-wave" d="M137 62 q18 -4 36 0 q18 4 36 0 q18 -4 36 0 q18 4 30 0"
        fill="none" stroke="#FFFDF7" strokeWidth="1.8" opacity="0.55"/>

      <g clipPath="url(#d44tankIn)">
        <g className="d44-fish">
          <ellipse cx="0" cy="0" rx="11" ry="6.5" fill="#F5C77E"/>
          <path d="M11 0 l8 -5.5 v11 z" fill="#F5C77E"/>
          <circle cx="-4.5" cy="-1.8" r="1.5" fill="#3B3730"/>
        </g>
        <circle className="d44-bub1" cx="186" cy="118" r="2.4" fill="#FFFFFF" opacity="0.7"/>
        <circle className="d44-bub2" cx="243" cy="119" r="1.8" fill="#FFFFFF" opacity="0.6"/>
      </g>

      {/* передняя грань стекла поверх воды: блик и рамка */}
      <path d="M141 118 L141 40 L168 40" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.35"/>
      <rect x="132" y="31" width="152" height="95" rx="3" fill="none" stroke="#8E8578" strokeWidth="3"/>
    </g>

    {/* ЛЕЙКА. Длина 19 см при аквариуме 40 см — настоящее соотношение.
        Наклоняется один раз и возвращается: главное движение сцены. */}
    <g className="d44-jug">
      <path d="M-30 -14 q10 -12 20 -1" fill="none" stroke="#4F9EBB" strokeWidth="3" strokeLinecap="round"/>
      <rect x="-34" y="-13" width="34" height="25" rx="6" fill="#7ECBE6" stroke="#4F9EBB" strokeWidth="1.8"/>
      <path d="M-34 -4 l-17 9" stroke="#4F9EBB" strokeWidth="4" strokeLinecap="round"/>
      <path d="M-51 5 l-5 3" stroke="#4F9EBB" strokeWidth="5" strokeLinecap="round"/>
    </g>

    {/* Спорят двое, значит на сцене двое: Санжар слева у полки, Мадина справа
        у аквариума (эталон §5: сказано «участники» — стоят участники). */}
    <Person x={96} ground={126} head={13} shirt="#7ECBE6" hair="#5A4636"/>
    <Person x={362} ground={126} head={13} shirt="#8FBF7F" hair="#3E3128"/>

    {/* Три измерения подписаны там, где они и есть: длина под передней гранью,
        высота сбоку от неё, глубина вдоль верхнего ребра. */}
    <text x="208" y="147" textAnchor="middle" fill="#6B5A3E"
      fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">40</text>
    <text x="324" y="84" fill="#8A8883"
      fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">25</text>
    <text x="185" y="23" textAnchor="middle" fill="#8A8883"
      fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">20</text>
  </svg>
);

// Итог: кубик 10 на 10 на 10 равен литру.
// ФИНАЛ ВОЗВРАЩАЕТ МЕСТО (эталон §5, пилот 2026-08-19). Было: три плашки
// «10 = 1000 sm³ = 1 litr» — верная запись, но кабинет биологии, аквариум и
// человек с урока исчезали, и спор Санжара с Мадиной оставался без развязки на
// картинке. Стало: тот же кабинет и тот же аквариум, только полный, рядом та,
// чей ответ оказался верным, и на нём стоит ответ спора. Единицы никуда не
// делись: под ответом мелкой строкой те же двадцать тысяч кубических
// сантиметров, из-за которых Санжар и ошибся.
const FinalScene = () => {
  const lang = useLang();
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <defs>
        <linearGradient id="d44wfin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8FCBE0"/><stop offset="100%" stopColor="#4F9EBB"/>
        </linearGradient>
        <clipPath id="d44finIn">
          <rect x="123" y="21" width="84" height="50"/>
        </clipPath>
      </defs>
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>

      {/* та же полка с банками и растением, что в хуке */}
      <g opacity="0.9">
        <rect x="10" y="34" width="60" height="4" rx="2" fill="#C9A472"/>
        <rect x="16" y="16" width="13" height="18" rx="2.5" fill="#E7F5FA" stroke="#B6DCEA" strokeWidth="1.2"/>
        <rect x="34" y="12" width="13" height="22" rx="2.5" fill="#E7F5FA" stroke="#B6DCEA" strokeWidth="1.2"/>
        <rect x="52" y="22" width="14" height="12" rx="2.5" fill="#D98A5A"/>
        <path d="M59 22 q-7 -10 -1.5 -14 q5.5 6 1.5 14" fill="#8FBF7F"/>
      </g>

      <rect x="0" y="74" width="400" height="18" fill="#D2A96F"/>
      <ellipse cx="175" cy="76" rx="60" ry="3.5" fill="rgba(90, 62, 34, 0.18)"/>

      {/* ТОТ ЖЕ АКВАРИУМ, что в хуке: те же пропорции 40 на 25 и та же глубина,
          только теперь налит доверху — вода стоит вровень с кромкой. */}
      <g>
        <path d="M120 18 L210 18 L230 5 L140 5 Z" fill="#EAF6FB" stroke="#8E8578" strokeWidth="1.8"/>
        <path d="M210 18 L230 5 L230 61 L210 74 Z" fill="#DCEDF5" stroke="#8E8578" strokeWidth="1.8"/>

        <path d="M123 21 L207 21 L227 8 L143 8 Z" fill="#A8D8E9"/>
        <path d="M207 21 L227 8 L227 58 L207 71 Z" fill="#5FA6C4"/>
        <rect x="123" y="21" width="84" height="50" fill="url(#d44wfin)"/>

        <g clipPath="url(#d44finIn)">
          <rect x="123" y="66" width="84" height="5" fill="#C9A472"/>
          <g className="d44-fish-fin">
            <ellipse cx="0" cy="0" rx="9" ry="5.5" fill="#F5C77E"/>
            <path d="M9 0 l7 -4.5 v9 z" fill="#F5C77E"/>
            <circle cx="-3.6" cy="-1.5" r="1.3" fill="#3B3730"/>
          </g>
          <circle className="d44-bub-fin" cx="168" cy="66" r="2" fill="#FFFFFF" opacity="0.65"/>
        </g>

        <path className="d44-wave" d="M125 24 q14 -3 28 0 q14 3 28 0 q14 -3 24 0"
          fill="none" stroke="#FFFDF7" strokeWidth="1.6" opacity="0.55"/>
        <path d="M128 68 L128 26 L146 26" fill="none" stroke="#FFFFFF" strokeWidth="2.4" opacity="0.35"/>
        <rect x="120" y="18" width="90" height="56" rx="2.5" fill="none" stroke="#8E8578" strokeWidth="2.4"/>
      </g>

      {/* Мадина у аквариума: спор закончился её ответом */}
      <Person x={262} ground={74} head={9} shirt="#8FBF7F" hair="#3E3128"/>

      <rect x="300" y="18" width="88" height="30" rx="8" fill="#E3F0E8" stroke="#1F7A4D" strokeWidth="2"/>
      <text x="344" y="38" textAnchor="middle" fill="#1F7A4D"
        fontFamily="'JetBrains Mono', monospace" fontSize="15" fontWeight="700">
        {tri(lang, '20 л', '20 litr', '20 L')}
      </text>
      <text x="344" y="62" textAnchor="middle" fill="#8A8883"
        fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700">
        {tri(lang, '20 000 см³', '20 000 sm³', '20 000 cm³')}
      </text>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Прибор урока: коробка из кубиков, слои появляются по очереди.
const BoxCubes = ({ a = 5, b = 4, layers = 1, total = 3, size = 'mid' }) => {
  const cw = 15; const dx = 7; const dy = -5; const x0 = 40; const y0 = 118;
  const cells = [];
  for (let L = 0; L < Math.min(layers, total); L += 1) {
    for (let j = b - 1; j >= 0; j -= 1) {
      for (let i = 0; i < a; i += 1) {
        const x = x0 + i * cw + j * dx;
        const y = y0 + j * dy - L * 11;
        cells.push(
          <g key={`${L}-${j}-${i}`}>
            <rect x={x} y={y - 11} width={cw - 1} height="11" fill={L === 0 ? '#E7F5FA' : '#A9CFBA'}
              stroke={L === 0 ? '#019ACB' : '#1F7A4D'} strokeWidth="1"/>
          </g>,
        );
      }
    }
  }
  return (
    <span className={'d44-box-box d44-box-' + size}>
      <svg viewBox="0 0 260 140" aria-hidden="true">
        {cells}
        <text x={x0 + (a * cw) / 2} y={y0 + 18} textAnchor="middle" fill="#8A8883"
          fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">{a}</text>
        <text x={x0 + a * cw + b * dx + 8} y={y0 + b * dy} fill="#8A8883"
          fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">{b}</text>
        <text x={x0 - 14} y={y0 - total * 11 + 4} fill="#D9603F"
          fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">{total}</text>
      </svg>
    </span>
  );
};

// Кубический дециметр: тысяча маленьких кубиков.
const DmCube = ({ show = 0 }) => (
  <span className="d44-dm-box">
    <svg viewBox="0 0 260 128" aria-hidden="true">
      <path d="M46 108 h72 v-64 h-72 z" fill="#E3F0E8" stroke="#1F7A4D" strokeWidth="2.2"/>
      <path d="M46 44 l20 -18 h72 l-20 18 z" fill="#A9CFBA" stroke="#1F7A4D" strokeWidth="2.2"/>
      <path d="M118 108 l20 -18 v-64 l-20 18 z" fill="#C3DFCE" stroke="#1F7A4D" strokeWidth="2.2"/>
      {show >= 1 && (
        <g opacity="0.7">
          {Array.from({ length: 9 }, (_, i) => (
            <path key={'v' + i} d={`M${46 + (i + 1) * 7.2} 108 v-64`} stroke="#1F7A4D" strokeWidth="0.7"/>
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <path key={'h' + i} d={`M46 ${108 - (i + 1) * 6.4} h72`} stroke="#1F7A4D" strokeWidth="0.7"/>
          ))}
        </g>
      )}
      <text x="82" y="124" textAnchor="middle" fill="#8A8883"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">10 sm</text>
      {show >= 2 && (
        <g>
          <rect x="160" y="44" width="88" height="44" rx="8" fill="#FBF3D6" stroke="#8A6A22" strokeWidth="2"/>
          <text x="204" y="62" textAnchor="middle" fill="#8A6A22"
            fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">1000</text>
          <text x="204" y="80" textAnchor="middle" fill="#8A6A22"
            fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">sm³</text>
        </g>
      )}
    </svg>
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d44-line d44-fade' + (on ? ' d44-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d44-stage">
        <span className="d44-two">
          <i className="d44-two-a">1 sm²</i>
          <b>→</b>
          <i className={'d44-two-b d44-fade' + (step >= 1 ? ' d44-on' : '')}>1 sm³</i>
        </span>
        <span className={'d44-chips d44-fade' + (step >= 1 ? ' d44-on' : '')}>
          <i className="d44-chip-l">{tri(lang, 'квадратик', 'kvadratcha', 'a square')}</i>
          <i className="d44-chip-g">{tri(lang, 'кубик', 'kubcha', 'a cube')}</i>
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

// Ядро: слои кубиков.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d44-stage d44-stage-row">
        <BoxCubes size="sm" a={5} b={4} total={3} layers={step >= 1 ? 3 : 1}/>
        <span className="d44-col">
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

// Единицы: дециметр, литр, тысяча.
const UnitBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_unit;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d44-stage d44-stage-row">
        <DmCube show={step}/>
        <span className="d44-col">
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

const SolveBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_solve;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{mt(t(c.lead))}</p>
      <div className="frame fade-up delay-1 d44-stage">
        <span className="d44-two">
          <i className="d44-two-a">20 000 sm³</i>
          <b>:1000</b>
          <i className={'d44-two-b d44-fade' + (step >= 1 ? ' d44-on' : '')}>20 l</i>
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

// Граница: не десять, а тысяча.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d44-stage">
        <span className="d44-pair d44-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d44-pair d44-pair-good d44-fade' + (step >= 1 ? ' d44-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d44-pair d44-pair-warn d44-fade' + (step >= 2 ? ' d44-on' : '')}>
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
        correctAnswer: t(c.play_opts[c.play_correct]), studentAnswer: t(c.play_opts[i]),
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
    <Stage screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <div className={'d44-banner fade-up delay-1' + (phase === 'play' ? ' d44-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d44-stage d44-stage-tool d44-stage-row">
          {phase === 'demo' ? (
            <>
              <BoxCubes size="xs" a={6} b={3} total={2} layers={shown >= 1 ? 2 : 1}/>
              <span className="d44-col">
                {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
                <p className={'body d44-verdict' + (done ? ' d44-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
              </span>
            </>
          ) : (
            <span className="d44-col">
              <p className="body" style={{ margin: '0 0 10px', fontWeight: 600 }}>{mt(t(c.play_ask))}</p>
              <div className="sv-opts">
                {c.play_opts.map((o, i) => (
                  <button key={i} className={'option'
                    + (solved && i === c.play_correct ? ' option-correct' : '')
                    + (!solved && picked === i ? ' option-picked-wrong' : '')}
                  disabled={solved} onClick={() => answer(i)}>{mt(t(o))}</button>
                ))}
              </div>
              {picked !== null && !solved && <HintBlock show>{mt(t(c.play_wrong[picked] || c.play_ok))}</HintBlock>}
              {solved && (
                <FeedbackBlock show isCorrect>
                  <p className="body" style={{ margin: 0 }}>{mt(t(c.play_ok))}</p>
                </FeedbackBlock>
              )}
            </span>
          )}
        </div>

        {phase === 'demo' && (
          <div className="d44-acts fade-up">
            <button className="d44-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d44-btn d44-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenUnit = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_unit} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <UnitBody step={step}/>}/>
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
      <div className="d44-stage">
        <DmCube show={2}/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenVol = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_vol} asideNode={methodAside}/>
);
const ScreenConv = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_conv} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: аквариум и лейка.
const TaskFig = ({ idx }) => (
  <div className="d44-task-fig">
    <svg viewBox="0 0 260 104" aria-hidden="true">
      <rect x="20" y="20" width="130" height="66" rx="4" fill="#DFF0F7" stroke="#8E8578" strokeWidth="2.4"/>
      <rect x="24" y="34" width="122" height="48" fill="#8FCBE0"/>
      <text x="85" y="100" textAnchor="middle" fill="#8A8883"
        fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700">20 l</text>
      <g opacity={idx >= 1 ? 1 : 0.3}>
        {[0, 1, 2, 3].map((k) => (
          <g key={k}>
            <rect x={178 + (k % 2) * 34} y={26 + Math.floor(k / 2) * 34} width="26" height="22" rx="4"
              fill="#7ECBE6" stroke="#4F9EBB" strokeWidth="1.4"/>
            <text x={191 + (k % 2) * 34} y={41 + Math.floor(k / 2) * 34} textAnchor="middle" fill="#1B6C87"
              fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="700">5</text>
          </g>
        ))}
      </g>
    </svg>
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
.d44-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d44-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d44-stage-tool .d44-line { font-size: clamp(12px, 2vw, 16px); }
.d44-stage-row { flex-direction: row; align-items: center; justify-content: center; gap: clamp(10px, 2.4vw, 22px); flex-wrap: wrap; }
.d44-col { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.1vw, 9px); flex: 1 1 200px; min-width: 0; }

/* Коробка из кубиков и кубический дециметр */
.d44-box-box { display: block; width: 100%; max-width: 260px; }
.d44-box-sm { max-width: 226px; }
.d44-box-xs { max-width: 190px; }
.d44-box-box svg { width: 100%; height: auto; display: block; }
.d44-dm-box { display: block; width: 100%; max-width: 250px; }
.d44-dm-box svg { width: 100%; height: auto; display: block; }

.d44-fade { opacity: 0; transition: opacity 420ms linear; }
.d44-on { opacity: 1; }
.d44-line { font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 16px); font-weight: 700; color: #494550; text-align: center; }

/* Переход между единицами */
.d44-two { display: inline-flex; align-items: center; gap: clamp(6px, 1.4vw, 12px); flex-wrap: wrap; justify-content: center; }
.d44-two b { font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 18px); color: #8A8883; }
.d44-two i { font-style: normal; padding: 6px 14px; border-radius: 12px; font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 2.6vw, 21px); font-weight: 700; }
.d44-two-a { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }
.d44-two-b { background: #E3F0E8; border: 1px solid #A9CFBA; color: #1F7A4D; }

/* Подписи */
.d44-chips { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d44-chips i { font-style: normal; padding: 5px 12px; border-radius: 10px; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 15px); font-weight: 700; }
.d44-chip-l { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }
.d44-chip-g { background: #E3F0E8; border: 1px solid #A9CFBA; color: #1F7A4D; }

/* Строки экрана границы */
.d44-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d44-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d44-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d44-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d44-task-fig { display: flex; justify-content: center; width: 100%; }
.d44-task-fig svg { width: 100%; max-width: 260px; height: auto; display: block; }

/* Экран 4 */
.d44-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d44-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d44-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d44-verdict-on { opacity: 1; }
.d44-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d44-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d44-btn:disabled { opacity: 0.45; cursor: default; }
.d44-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d44-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* ДВИЖЕНИЕ СЦЕНЫ. Правило методиста 2026-08-19: главное движение проходит
   ОДИН раз, дальше сцена только тихо живёт. Поэтому лейка наклоняется и
   возвращается однократно (iteration-count 1), а рыбка, рябь и пузырьки идут
   медленно и мелко — их видно, только если смотреть на них.
   Рыбка нарисована головой ВЛЕВО (глаз на минус четыре, хвост на плюс
   одиннадцать), поэтому вправо она плывёт отзеркаленной. */
.d44-fish { animation: d44Fish 17000ms ease-in-out infinite; }
@keyframes d44Fish {
  0%, 100% { transform: translate(176px, 88px) scaleX(-1); }
  46% { transform: translate(244px, 96px) scaleX(-1); }
  50% { transform: translate(248px, 95px) scaleX(1); }
  96% { transform: translate(176px, 88px) scaleX(1); }
}
/* Пузырьки идут со дна вверх и гаснут у поверхности: всплывают, а не висят. */
.d44-bub1 { animation: d44Bub1 7200ms ease-in 900ms infinite; }
@keyframes d44Bub1 {
  0% { transform: translateY(0); opacity: 0; }
  12% { opacity: 0.7; }
  85% { opacity: 0.55; }
  100% { transform: translateY(-56px); opacity: 0; }
}
.d44-bub2 { animation: d44Bub2 9000ms ease-in 3400ms infinite; }
@keyframes d44Bub2 {
  0% { transform: translateY(0); opacity: 0; }
  15% { opacity: 0.6; }
  85% { opacity: 0.45; }
  100% { transform: translateY(-58px); opacity: 0; }
}
.d44-wave { animation: d44Wave 6400ms ease-in-out infinite; }
@keyframes d44Wave { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(6px); } }
/* Рыбка финала плавает по своим координатам: кадр финала 400 на 92, а d44Fish
   написан под кадр хука 400 на 154 и вынес бы её за стекло. */
.d44-fish-fin { animation: d44FishFin 19000ms ease-in-out infinite; }
@keyframes d44FishFin {
  0%, 100% { transform: translate(150px, 44px) scaleX(-1); }
  46% { transform: translate(196px, 50px) scaleX(-1); }
  50% { transform: translate(199px, 49px) scaleX(1); }
  96% { transform: translate(150px, 44px) scaleX(1); }
}
.d44-bub-fin { animation: d44BubFin 8600ms ease-in 1600ms infinite; }
@keyframes d44BubFin {
  0% { transform: translateY(0); opacity: 0; }
  14% { opacity: 0.6; }
  85% { opacity: 0.45; }
  100% { transform: translateY(-42px); opacity: 0; }
}
/* Лейка: единственное крупное движение сцены, ровно один проход. */
/* transform-origin здесь ОБЯЗАН быть нулевым: keyframes уже переносят группу
   на её место, а origin в пикселях сдвинул бы точку вращения второй раз —
   предмет при повороте улетает от своего места (проверено 2026-08-19). */
.d44-jug { animation: d44Jug 3200ms cubic-bezier(0.35, 0, 0.25, 1) 900ms 1 both; transform-origin: 0 0; }
@keyframes d44Jug {
  0% { transform: translate(272px, 22px) rotate(0deg); }
  38% { transform: translate(272px, 22px) rotate(15deg); }
  68% { transform: translate(272px, 22px) rotate(15deg); }
  100% { transform: translate(272px, 22px) rotate(0deg); }
}
@media (prefers-reduced-motion: reduce) {
  .d44-fish { animation: none; transform: translate(210px, 92px) scaleX(-1); }
  .d44-fish-fin { animation: none; transform: translate(172px, 47px) scaleX(-1); }
  .d44-bub1, .d44-bub2, .d44-bub-fin { animation: none; opacity: 0; }
  .d44-wave { animation: none; }
  .d44-jug { animation: none; transform: translate(272px, 22px); }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function VolumeLesson({
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
  });

  const [current, setCurrent] = useState(Math.min(PREVIEW_START, TOTAL_SCREENS - 1));
  const [answers, setAnswers] = useState([]);

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenUnit, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenVol, ScreenConv, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
