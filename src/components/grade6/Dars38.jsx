// ============================================================
// 6 КЛАСС, УРОК 38 «Длина окружности»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б10, третий урок. Число пи не объявляется, а получается из
// опыта: три разных круга обмеряют ниткой, и отношение длины к диаметру
// каждый раз выходит около трёх с небольшим. Отсюда C = пи d, а формула
// C = 2 пи r получается подстановкой d = 2r из урока 37.
//
// Сцена — измерительный уголок в кабинете труда: банки, нитка, линейка.
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
  lessonId: 'grade6-38',
  lessonTitle: {
    ru: 'Длина окружности',
    uz: 'Aylana uzunligi',
    en: 'The circumference',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 samokat: bir aylanishda qancha
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 diametr esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 tajriba: uzunlik diametrga bo'linadi
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: C = pi d
  { id: 's_rad',    type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 C = 2 pi r va teskari hisob
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: g'ildirak
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: radiusni d o'rniga qo'yish
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_len',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 uzunlikni topish x3
  { id: 's_back',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 teskari va yarim aylana x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: qaysi formula
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: g'ildirak
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Один оборот колеса', uz: "G'ildirakning bir aylanishi", en: 'One turn of the wheel' },
    lead: {
      ru: 'Диаметр колеса самоката 20 см. Колесо сделало ровно один оборот.',
      uz: "Samokat g'ildiragining diametri 20 sm. G'ildirak roppa-rosa bir marta aylandi.",
      en: 'A scooter wheel is 20 cm across. It made exactly one full turn.',
    },
    voice_a: { ru: 'Отабек: проехали 20 см.', uz: "Otabek: 20 sm yurildi.", en: 'Otabek: it went 20 cm.' },
    voice_b: { ru: 'Азиза: больше, около 63 см.', uz: "Aziza: ko'proq, taxminan 63 sm.", en: 'Aziza: more, about 63 cm.' },
    ask: { ru: 'Какой путь проехал самокат?', uz: "Samokat qancha yo'l yurdi?", en: 'How far did the scooter travel?' },
    options: [
      { ru: '20 см', uz: '20 sm', en: '20 cm' },
      { ru: 'около 63 см', uz: 'taxminan 63 sm', en: 'about 63 cm' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'Диаметр колеса самоката двадцать сантиметров. Колесо прокатилось и сделало ровно один полный оборот.',
          'Отабек говорит, что самокат проехал двадцать сантиметров, столько же, сколько ширина колеса. Азиза отвечает, что путь больше, около шестидесяти трёх сантиметров. Какой путь проехал самокат? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Samokat g'ildiragining diametri yigirma santimetr. G'ildirak dumalab, roppa-rosa bir marta to'liq aylandi.",
          "Otabek samokat yigirma santimetr yurdi, ya'ni g'ildirak eni qancha bo'lsa shuncha deydi. Aziza esa yo'l ko'proq, taxminan oltmish uch santimetr deb javob beradi. Samokat qancha yo'l yurdi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'A scooter wheel is twenty centimetres across. It rolled and made exactly one full turn.',
          'Otabek says the scooter went twenty centimetres, the same as the width of the wheel. Aziza answers that the distance is larger, about sixty three centimetres. How far did the scooter travel? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Диаметр и сама линия', uz: "Diametr va chiziqning o'zi", en: 'The diameter and the line itself' },
    done: {
      ru: 'Диаметр — прямая через центр, а окружность — линия вокруг. Понятно, что линия длиннее, но во сколько раз?',
      uz: "Diametr markazdan o'tuvchi to'g'ri chiziq, aylana esa atrofdagi chiziq. Chiziq uzunroq ekani tushunarli, lekin necha marta?",
      en: 'The diameter is a straight line through the centre, the circle runs around. Clearly the line is longer, but by how much?',
    },
    audio: {
      ru: [
        'Вспомним прошлый урок. Диаметр это прямой отрезок от края до края через центр.',
        'А сама окружность идёт по краю, огибая круг. Понятно, что она длиннее диаметра: прямой путь всегда короче обхода.',
        'Но во сколько раз длиннее? Об этом и весь сегодняшний урок.',
      ],
      uz: [
        "O'tgan darsni eslaymiz. Diametr bu chetdan markaz orqali chetgacha to'g'ri kesma.",
        "Aylananing o'zi esa chetidan, doirani aylanib boradi. U diametrdan uzun ekani tushunarli: to'g'ri yo'l aylanma yo'ldan doim qisqa.",
        "Ammo necha marta uzun? Bugungi butun dars shu haqda.",
      ],
      en: [
        'Recall the last lesson. The diameter is a straight segment from edge to edge through the centre.',
        'The circle itself runs along the edge, going around. Clearly it is longer than the diameter: a straight path always beats a detour.',
        'But how many times longer? That is what today is about.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Опыт с ниткой', uz: 'Ip bilan tajriba', en: 'The string experiment' },
    rows: [
      { d: '4', c: '12,6', q: '3,1' },
      { d: '7', c: '22,0', q: '3,1' },
      { d: '10', c: '31,4', q: '3,1' },
    ],
    lines: [
      { ru: 'обмотали три банки ниткой и померили', uz: "uchta bankani ip bilan o'rab o'lchadik", en: 'we wrapped three jars with string and measured' },
      { ru: 'делим длину на диаметр — каждый раз около 3,1', uz: "uzunlikni diametrga bo'lamiz — har safar taxminan 3,1", en: 'divide the length by the diameter: about 3.1 each time' },
      { ru: 'это число называют пи: C = πd', uz: 'bu son pi deb ataladi: C = πd', en: 'that number is called pi: C = πd' },
    ],
    done: {
      ru: 'Отношение длины окружности к диаметру одинаково у любого круга. Его обозначили буквой π и считают равным примерно 3,14.',
      uz: "Aylana uzunligining diametrga nisbati har qanday doirada bir xil. Uni π harfi bilan belgilashadi va taxminan 3,14 deb olishadi.",
      en: 'The ratio of the circumference to the diameter is the same for every circle. It is written π and taken as about 3.14.',
    },
    audio: {
      ru: [
        'Возьмём три банки разного размера. Каждую обмотаем ниткой ровно один раз, распрямим нитку и померим линейкой.',
        'Теперь у каждой банки разделим длину нитки на диаметр. Первая: двенадцать и шесть на четыре. Вторая: двадцать два на семь. Третья: тридцать один и четыре на десять. Каждый раз выходит примерно три и одна десятая.',
        'Размер банки не важен, отношение всегда одно и то же. Это число обозначили греческой буквой пи и считают равным примерно трём целым четырнадцати сотым. Значит длина окружности равна пи умножить на диаметр.',
      ],
      uz: [
        "Har xil o'lchamdagi uchta bankani olamiz. Har birini roppa-rosa bir marta ip bilan o'raymiz, ipni yozib chizg'ich bilan o'lchaymiz.",
        "Endi har bir bankada ip uzunligini diametrga bo'lamiz. Birinchisi: o'n ikki butun olti bo'linsin to'rtga. Ikkinchisi: yigirma ikki bo'linsin yettiga. Uchinchisi: o'ttiz bir butun to'rt bo'linsin o'nga. Har safar taxminan uch butun o'ndan bir chiqadi.",
        "Banka o'lchami muhim emas, nisbat har doim bir xil. Bu son yunon pi harfi bilan belgilangan va taxminan uch butun yuzdan o'n to'rt deb olinadi. Demak aylana uzunligi pi karra diametrga teng.",
      ],
      en: [
        'Take three jars of different sizes. Wrap each with string exactly once, straighten the string and measure it with a ruler.',
        'Now divide each string length by the diameter. First: twelve point six by four. Second: twenty two by seven. Third: thirty one point four by ten. Each time it comes out about three point one.',
        'The size of the jar does not matter, the ratio is always the same. That number is written with the Greek letter pi and taken as about three point one four. So the circumference equals pi times the diameter.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Считаем длину', uz: 'Uzunlikni hisoblaymiz', en: 'Computing the length' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: 'диаметр банки 10 см', uz: 'banka diametri 10 sm', en: 'the jar is 10 cm across' },
      { ru: 'C = π · d = 3,14 · 10', uz: 'C = π · d = 3,14 · 10', en: 'C = π · d = 3.14 · 10' },
      { ru: 'C = 31,4 см', uz: 'C = 31,4 sm', en: 'C = 31.4 cm' },
    ],
    demo_note: {
      ru: 'Длина окружности всегда чуть больше трёх диаметров. Это удобная проверка на глаз.',
      uz: "Aylana uzunligi har doim uchta diametrdan sal ko'proq. Bu ko'z bilan tekshirishga qulay.",
      en: 'A circumference is always a bit more than three diameters. That is a handy eyeball check.',
    },
    play_ask: { ru: 'Диаметр 5 см. Чему равна длина окружности?', uz: 'Diametr 5 sm. Aylana uzunligi nechaga teng?', en: 'The diameter is 5 cm. What is the circumference?' },
    play_opts: ['15,7 см', '8,14 см', '1,59 см'],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. 3,14 · 5 = 15,7 см, это чуть больше трёх диаметров.',
      uz: "To'g'ri. 3,14 · 5 = 15,7 sm, bu uchta diametrdan sal ko'p.",
      en: 'Right. 3.14 · 5 = 15.7 cm, a bit more than three diameters.',
    },
    play_wrong: [
      null,
      { ru: 'Это сумма, а нужно умножение.', uz: "Bu yig'indi, ko'paytirish kerak esa.", en: 'That is a sum, but multiplication is needed.' },
      { ru: 'Это деление, а длина больше диаметра, а не меньше.', uz: "Bu bo'lish, uzunlik esa diametrdan katta, kichik emas.", en: 'That divides, but the length is bigger than the diameter, not smaller.' },
    ],
    audio: {
      intro: {
        ru: 'Покажу расчёт на примере. Диаметр банки десять сантиметров.',
        uz: "Hisobni misolda ko'rsataman. Banka diametri o'n santimetr.",
        en: 'I will show the calculation on an example. The jar is ten centimetres across.',
      },
      demo: {
        ru: 'Длина окружности равна пи умножить на диаметр. Пи берём равным трём целым четырнадцати сотым. Умножаем на десять и получаем тридцать один и четыре десятых сантиметра. Проверим на глаз: три диаметра это тридцать, а у нас чуть больше. Сходится.',
        uz: "Aylana uzunligi pi karra diametrga teng. Pi ni uch butun yuzdan o'n to'rt deb olamiz. O'nga ko'paytiramiz va o'ttiz bir butun o'ndan to'rt santimetr olamiz. Ko'z bilan tekshiramiz: uchta diametr o'ttiz, bizda esa sal ko'p. To'g'ri keldi.",
        en: 'The circumference is pi times the diameter. Take pi as three point one four. Multiply by ten and get thirty one point four centimetres. Eyeball check: three diameters make thirty and ours is a bit more. It fits.',
      },
      play: {
        ru: 'Теперь ваша очередь. Диаметр пять сантиметров. Чему равна длина окружности?',
        uz: 'Endi sizning navbatingiz. Diametr besh santimetr. Aylana uzunligi nechaga teng?',
        en: 'Now it is your turn. The diameter is five centimetres. What is the circumference?',
      },
      ok: {
        ru: 'Верно. Три целых четырнадцать сотых умножить на пять это пятнадцать и семь десятых.',
        uz: "To'g'ri. Uch butun yuzdan o'n to'rt karra besh o'n besh butun o'ndan yetti.",
        en: 'Right. Three point one four times five is fifteen point seven.',
      },
      wrong: {
        ru: 'Длина окружности примерно втрое с небольшим больше диаметра, значит нужно умножение.',
        uz: "Aylana uzunligi diametrdan taxminan uch barobar va sal ko'p, demak ko'paytirish kerak.",
        en: 'A circumference is a bit more than three diameters, so multiply.',
      },
    },
  },

  s_rad: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Через радиус и обратно', uz: 'Radius orqali va teskarisiga', en: 'Through the radius and back' },
    lines: [
      { ru: 'd = 2r, значит C = π · 2r = 2πr', uz: 'd = 2r, demak C = π · 2r = 2πr', en: 'd = 2r, so C = π · 2r = 2πr' },
      { ru: 'радиус 3 см: C = 2 · 3,14 · 3 = 18,84 см', uz: 'radius 3 sm: C = 2 · 3,14 · 3 = 18,84 sm', en: 'radius 3 cm: C = 2 · 3.14 · 3 = 18.84 cm' },
      { ru: 'известна длина: d = C : π', uz: "uzunlik ma'lum: d = C : π", en: 'if the length is known: d = C : π' },
    ],
    done: {
      ru: 'Формулы две, но она одна: 2πr получается из πd подстановкой d = 2r. А по длине диаметр находят делением.',
      uz: "Formula ikkita ko'rinadi, aslida bitta: 2πr formulasi πd ga d = 2r qo'yishdan chiqadi. Uzunlik orqali diametr esa bo'lish bilan topiladi.",
      en: 'There seem to be two formulas but it is one: 2πr comes from πd by putting d = 2r. And from the length the diameter comes by dividing.',
    },
    audio: {
      ru: [
        'Часто известен не диаметр, а радиус. Но диаметр это два радиуса, значит длина окружности равна пи умножить на два эр, то есть два пи эр.',
        'Например, радиус три сантиметра. Два умножить на три целых четырнадцать сотых умножить на три это восемнадцать и восемьдесят четыре сотых сантиметра.',
        'Работает и обратный ход. Если известна длина, диаметр находят делением: длину разделить на пи. Так по обхвату дерева узнают его толщину, не спиливая.',
      ],
      uz: [
        "Ko'pincha diametr emas, radius ma'lum bo'ladi. Ammo diametr ikkita radius, demak aylana uzunligi pi karra ikki er, ya'ni ikki pi er ga teng.",
        "Masalan, radius uch santimetr. Ikki karra uch butun yuzdan o'n to'rt karra uch o'n sakkiz butun yuzdan sakson to'rt santimetr.",
        "Teskari yo'l ham ishlaydi. Uzunlik ma'lum bo'lsa, diametr bo'lish bilan topiladi: uzunlikni pi ga bo'lamiz. Daraxtning yo'g'onligi ham kesmasdan, aylanasi orqali shunday bilinadi.",
      ],
      en: [
        'Often the radius is known instead of the diameter. But a diameter is two radii, so the circumference is pi times two r, that is two pi r.',
        'For example, a radius of three centimetres. Two times three point one four times three is eighteen point eight four centimetres.',
        'The reverse works too. If the length is known, the diameter comes from dividing: length by pi. That is how the thickness of a tree is found from its girth without cutting it.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Путь самоката', uz: "Samokatning yo'li", en: 'The scooter’s distance' },
    lead: { ru: 'Диаметр колеса 20 см. Колесо сделало 10 оборотов.', uz: "G'ildirak diametri 20 sm. G'ildirak 10 marta aylandi.", en: 'A 20 cm wheel makes 10 turns.' },
    steps: [
      { ru: 'один оборот: 3,14 · 20 = 62,8 см', uz: 'bir aylanish: 3,14 · 20 = 62,8 sm', en: 'one turn: 3.14 · 20 = 62.8 cm' },
      { ru: 'десять оборотов: 62,8 · 10 = 628 см', uz: "o'n aylanish: 62,8 · 10 = 628 sm", en: 'ten turns: 62.8 · 10 = 628 cm' },
      { ru: 'это 6 м 28 см', uz: 'bu 6 m 28 sm', en: 'that is 6 m 28 cm' },
    ],
    done: {
      ru: 'За один оборот колесо проезжает ровно свою длину окружности. Права была Азиза: 62,8 см, а не 20.',
      uz: "Bir aylanishda g'ildirak aynan o'z aylana uzunligicha yuradi. Aziza haq edi: 20 emas, 62,8 sm.",
      en: 'In one turn a wheel covers exactly its own circumference. Aziza was right: 62.8 cm, not 20.',
    },
    audio: {
      ru: [
        'Решаем вместе. Диаметр колеса двадцать сантиметров, колесо сделало десять оборотов.',
        'За один оборот колесо проезжает ровно свою длину окружности: три целых четырнадцать сотых умножить на двадцать это шестьдесят два и восемь десятых сантиметра.',
        'За десять оборотов путь в десять раз больше: шестьсот двадцать восемь сантиметров, то есть шесть метров двадцать восемь сантиметров. Отабек назвал диаметр вместо длины окружности. Права была Азиза.',
      ],
      uz: [
        "Birga yechamiz. G'ildirak diametri yigirma santimetr, g'ildirak o'n marta aylandi.",
        "Bir aylanishda g'ildirak aynan o'z aylana uzunligicha yuradi: uch butun yuzdan o'n to'rt karra yigirma oltmish ikki butun o'ndan sakkiz santimetr.",
        "O'n aylanishda yo'l o'n barobar ko'p: olti yuz yigirma sakkiz santimetr, ya'ni olti metru yigirma sakkiz santimetr. Otabek aylana uzunligi o'rniga diametrni aytdi. Aziza haq edi.",
      ],
      en: [
        'Let us solve it together. The wheel is twenty centimetres across and made ten turns.',
        'In one turn the wheel covers exactly its circumference: three point one four times twenty is sixty two point eight centimetres.',
        'Ten turns give ten times that: six hundred twenty eight centimetres, or six metres twenty eight centimetres. Otabek named the diameter instead of the circumference. Aziza was right.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilishadi', en: 'Where mistakes happen' },
    title: { ru: 'Радиус вместо диаметра', uz: "Diametr o'rniga radius", en: 'Radius in place of diameter' },
    bad_line: { ru: 'ошибка: r = 5, пишут C = 3,14 · 5 = 15,7', uz: 'xato: r = 5, C = 3,14 · 5 = 15,7 deb yoziladi', en: 'mistake: r = 5 giving C = 3.14 · 5 = 15.7' },
    good_line: { ru: 'верно: C = 2 · 3,14 · 5 = 31,4', uz: "to'g'ri: C = 2 · 3,14 · 5 = 31,4", en: 'right: C = 2 · 3.14 · 5 = 31.4' },
    warn_line: { ru: 'проверка на глаз: длина чуть больше трёх диаметров', uz: "ko'z bilan tekshiruv: uzunlik uchta diametrdan sal ko'p", en: 'eyeball check: the length is a bit over three diameters' },
    done: {
      ru: 'В формулу C = πd подставляют именно диаметр. Если дан радиус, его сначала удваивают или берут формулу 2πr.',
      uz: "C = πd formulasiga aynan diametr qo'yiladi. Radius berilgan bo'lsa, avval ikkilantiriladi yoki 2πr formulasi olinadi.",
      en: 'The formula C = πd takes the diameter. If the radius is given, double it first or use 2πr.',
    },
    audio: {
      ru: [
        'Главная ошибка урока. В формулу с пи и диаметром подставляют радиус, и ответ выходит вдвое меньше нужного.',
        'Лечится проверкой на глаз. Радиус пять, значит диаметр десять, а длина окружности чуть больше трёх диаметров, то есть около тридцати. Пятнадцать с половиной сюда никак не годится.',
        'Если дан радиус, либо сначала найдите диаметр, либо считайте по формуле два пи эр. Это одна и та же формула.',
      ],
      uz: [
        "Darsning asosiy xatosi. Pi va diametrli formulaga radius qo'yiladi va javob kerakligidan ikki barobar kichik chiqadi.",
        "Ko'z bilan tekshirish yordam beradi. Radius besh, demak diametr o'n, aylana uzunligi esa uchta diametrdan sal ko'p, ya'ni taxminan o'ttiz. O'n besh yarim bu yerga sira to'g'ri kelmaydi.",
        "Radius berilgan bo'lsa, yo avval diametrni toping, yo ikki pi er formulasi bilan hisoblang. Bu bitta formulaning o'zi.",
      ],
      en: [
        'The main mistake here. The radius is put into the formula with pi and the diameter, and the answer comes out half of what it should be.',
        'An eyeball check catches it. Radius five means diameter ten, and a circumference is a bit over three diameters, about thirty. Fifteen and a half cannot fit.',
        'If the radius is given, either find the diameter first or use two pi r. It is the same formula.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Длина окружности', uz: 'Aylana uzunligi', en: 'The circumference' },
    rule_1: {
      ru: 'Отношение длины окружности к её диаметру одинаково у всех кругов. Это число обозначают π и берут равным примерно 3,14. Отсюда C = πd и C = 2πr.',
      uz: "Aylana uzunligining diametriga nisbati barcha doiralarda bir xil. Bu son π bilan belgilanadi va taxminan 3,14 deb olinadi. Bundan C = πd va C = 2πr.",
      en: 'The ratio of a circumference to its diameter is the same for every circle. That number is written π and taken as about 3.14. Hence C = πd and C = 2πr.',
    },
    rule_2: {
      ru: 'Если известна длина, диаметр находят делением на π. За один оборот колесо проезжает свою длину окружности. Самокат: 3,14 · 20 = 62,8 см. Права была Азиза.',
      uz: "Uzunlik ma'lum bo'lsa, diametr π ga bo'lish bilan topiladi. Bir aylanishda g'ildirak o'z aylana uzunligicha yuradi. Samokat: 3,14 · 20 = 62,8 sm. Aziza haq edi.",
      en: 'If the length is known, the diameter comes from dividing by π. In one turn a wheel covers its own circumference. The scooter: 3.14 · 20 = 62.8 cm. Aziza was right.',
    },
    audio: {
      ru: 'Запомним правило. Отношение длины окружности к её диаметру одинаково у всех кругов, каким бы ни был их размер. Это число обозначают греческой буквой пи и берут равным примерно трём целым четырнадцати сотым. Отсюда длина окружности равна пи умножить на диаметр или два пи умножить на радиус. Если известна длина, диаметр находят делением на пи. За один оборот колесо проезжает свою длину окружности. Вернёмся к самокату. Три целых четырнадцать сотых умножить на двадцать это шестьдесят два и восемь десятых сантиметра. Права была Азиза.',
      uz: "Qoidani eslab qolamiz. Aylana uzunligining diametriga nisbati o'lchamidan qat'i nazar barcha doiralarda bir xil. Bu son yunon pi harfi bilan belgilanadi va taxminan uch butun yuzdan o'n to'rt deb olinadi. Bundan aylana uzunligi pi karra diametr yoki ikki pi karra radiusga teng. Uzunlik ma'lum bo'lsa, diametr pi ga bo'lish bilan topiladi. Bir aylanishda g'ildirak o'z aylana uzunligicha yuradi. Samokatga qaytamiz. Uch butun yuzdan o'n to'rt karra yigirma oltmish ikki butun o'ndan sakkiz santimetr. Aziza haq edi.",
      en: 'Let us remember the rule. The ratio of a circumference to its diameter is the same for every circle whatever its size. That number is written with the Greek letter pi and taken as about three point one four. So the circumference is pi times the diameter, or two pi times the radius. If the length is known, the diameter comes from dividing by pi. In one turn a wheel covers its own circumference. Back to the scooter. Three point one four times twenty is sixty two point eight centimetres. Aziza was right.',
    },
  },

  s_len: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Находим длину', uz: 'Uzunlikni topamiz', en: 'Finding the length' },
    lead: { ru: 'Считай π равным 3,14.', uz: "π ni 3,14 deb oling.", en: 'Take π as 3.14.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Диаметр 4 см. Длина окружности?', uz: 'Diametr 4 sm. Aylana uzunligi?', en: 'Diameter 4 cm. Circumference?' },
        opts: ['12,56 см', '7,14 см', '1,27 см'],
        correct: 0,
        ok: { ru: 'Верно. 3,14 · 4 = 12,56 см.', uz: "To'g'ri. 3,14 · 4 = 12,56 sm.", en: 'Right. 3.14 · 4 = 12.56 cm.' },
        wrong: [
          null,
          { ru: 'Это сумма, а нужно умножение.', uz: "Bu yig'indi, ko'paytirish kerak esa.", en: 'That is a sum, but multiplication is needed.' },
          { ru: 'Длина больше диаметра, а не меньше.', uz: 'Uzunlik diametrdan katta, kichik emas.', en: 'The length exceeds the diameter, not the other way.' },
        ],
      },
      {
        q: { ru: 'Радиус 10 см. Длина окружности?', uz: 'Radius 10 sm. Aylana uzunligi?', en: 'Radius 10 cm. Circumference?' },
        opts: ['62,8 см', '31,4 см', '20 см'],
        correct: 0,
        ok: { ru: 'Верно. Диаметр 20, значит 3,14 · 20 = 62,8 см.', uz: "To'g'ri. Diametr 20, demak 3,14 · 20 = 62,8 sm.", en: 'Right. The diameter is 20, so 3.14 · 20 = 62.8 cm.' },
        wrong: [
          null,
          { ru: 'Радиус подставили вместо диаметра, ответ вдвое меньше.', uz: "Diametr o'rniga radius qo'yilgan, javob ikki barobar kichik.", en: 'The radius was used instead of the diameter: half the answer.' },
          { ru: 'Это диаметр, а спрашивали длину окружности.', uz: "Bu diametr, so'ralgani esa aylana uzunligi.", en: 'That is the diameter, but the circumference was asked.' },
        ],
      },
      {
        q: { ru: 'Диаметр колеса 50 см. Путь за один оборот?', uz: "G'ildirak diametri 50 sm. Bir aylanishdagi yo'l?", en: 'A 50 cm wheel. Distance in one turn?' },
        opts: ['157 см', '50 см', '25 см'],
        correct: 0,
        ok: { ru: 'Верно. 3,14 · 50 = 157 см.', uz: "To'g'ri. 3,14 · 50 = 157 sm.", en: 'Right. 3.14 · 50 = 157 cm.' },
        wrong: [
          null,
          { ru: 'Колесо катится ободом, а не поперечником.', uz: "G'ildirak chetiga tayanib dumalaydi, ko'ndalangiga emas.", en: 'A wheel rolls on its rim, not across its width.' },
          { ru: 'Это радиус, а путь равен длине окружности.', uz: "Bu radius, yo'l esa aylana uzunligiga teng.", en: 'That is the radius; the distance equals the circumference.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на длину. Если дан радиус, сначала найдите диаметр.',
        uz: "Uzunlik mashqi. Radius berilgan bo'lsa, avval diametrni toping.",
        en: 'Practice on length. If the radius is given, find the diameter first.',
      },
    },
  },

  s_back: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Обратный ход и половинка', uz: "Teskari yo'l va yarim aylana", en: 'Backwards and half a circle' },
    lead: { ru: 'По длине находим диаметр делением.', uz: "Uzunlik orqali diametrni bo'lish bilan topamiz.", en: 'From the length the diameter comes by dividing.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Длина окружности 62,8 см. Диаметр?', uz: 'Aylana uzunligi 62,8 sm. Diametr?', en: 'Circumference 62.8 cm. Diameter?' },
        opts: ['20 см', '197 см', '10 см'],
        correct: 0,
        ok: { ru: 'Верно. 62,8 : 3,14 = 20 см.', uz: "To'g'ri. 62,8 : 3,14 = 20 sm.", en: 'Right. 62.8 : 3.14 = 20 cm.' },
        wrong: [
          null,
          { ru: 'Умножают, когда ищут длину, а она уже известна.', uz: "Uzunlik qidirilganda ko'paytiriladi, u esa ma'lum.", en: 'You multiply to find the length, which is known.' },
          { ru: 'Это радиус, а спрашивали диаметр.', uz: "Bu radius, so'ralgani esa diametr.", en: 'That is the radius, but the diameter was asked.' },
        ],
      },
      {
        q: { ru: 'Длина окружности 31,4 см. Радиус?', uz: 'Aylana uzunligi 31,4 sm. Radius?', en: 'Circumference 31.4 cm. Radius?' },
        opts: ['5 см', '10 см', '15,7 см'],
        correct: 0,
        ok: { ru: 'Верно. Диаметр 10, значит радиус 5 см.', uz: "To'g'ri. Diametr 10, demak radius 5 sm.", en: 'Right. The diameter is 10, so the radius is 5 cm.' },
        wrong: [
          null,
          { ru: 'Это диаметр, радиус вдвое меньше.', uz: 'Bu diametr, radius ikki barobar kichik.', en: 'That is the diameter; the radius is half.' },
          { ru: 'Так делят длину пополам, а нужно делить на π.', uz: "Bunda uzunlik teng ikkiga bo'lingan, π ga bo'lish kerak esa.", en: 'That halves the length, but you divide by π.' },
        ],
      },
      {
        q: { ru: 'Полукруглая арка, диаметр 6 м. Длина дуги?', uz: 'Yarim doira ravoq, diametri 6 m. Yoy uzunligi?', en: 'A semicircular arch, diameter 6 m. Arc length?' },
        opts: ['9,42 м', '18,84 м', '3 м'],
        correct: 0,
        ok: { ru: 'Верно. Вся окружность 18,84, половина 9,42 м.', uz: "To'g'ri. Butun aylana 18,84, yarmi 9,42 m.", en: 'Right. The full circle is 18.84, half is 9.42 m.' },
        wrong: [
          null,
          { ru: 'Это вся окружность, а нужна половина.', uz: 'Bu butun aylana, yarmi kerak esa.', en: 'That is the whole circle, but half is needed.' },
          { ru: 'Это радиус, а спрашивали длину дуги.', uz: "Bu radius, so'ralgani esa yoy uzunligi.", en: 'That is the radius, but the arc length was asked.' },
        ],
      },
      {
        q: { ru: 'Чему примерно равно π?', uz: 'π taxminan nechaga teng?', en: 'What is π approximately?' },
        opts: ['3,14', '2', '3,4'],
        correct: 0,
        ok: { ru: 'Верно. Чуть больше трёх.', uz: "To'g'ri. Uchdan sal ko'p.", en: 'Right. A bit over three.' },
        wrong: [
          null,
          { ru: 'Тогда окружность была бы всего вдвое длиннее диаметра.', uz: "U holda aylana diametrdan atigi ikki barobar uzun bo'lardi.", en: 'Then a circumference would be only twice the diameter.' },
          { ru: 'Цифры переставлены: после запятой идёт единица.', uz: "Raqamlar almashtirilgan: verguldan keyin bir turadi.", en: 'The digits are swapped: a one comes first after the point.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на обратный ход. Если известна длина, делите на пи.',
        uz: "Teskari yo'l mashqi. Uzunlik ma'lum bo'lsa, pi ga bo'ling.",
        en: 'Practice going backwards. If the length is known, divide by pi.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Какая формула нужна', uz: 'Qaysi formula kerak', en: 'Which formula fits' },
    lead: { ru: 'Смотри, что дано: диаметр, радиус или сама длина.', uz: "Nima berilganiga qarang: diametr, radius yoki uzunlikning o'zi.", en: 'See what is given: diameter, radius or the length itself.' },
    bin_a: { ru: 'Умножаем на π', uz: "π ga ko'paytiramiz", en: 'Multiply by π' },
    bin_b: { ru: 'Делим на π', uz: "π ga bo'lamiz", en: 'Divide by π' },
    cards: [
      { label: { ru: 'дан диаметр, ищем длину', uz: 'diametr berilgan, uzunlik kerak', en: 'diameter given, length wanted' }, bin: 'a' },
      { label: { ru: 'дан радиус, ищем длину', uz: 'radius berilgan, uzunlik kerak', en: 'radius given, length wanted' }, bin: 'a' },
      { label: { ru: 'дан радиус колеса, ищем путь', uz: "g'ildirak radiusi berilgan, yo'l kerak", en: 'wheel radius given, distance wanted' }, bin: 'a' },
      { label: { ru: 'дана длина, ищем диаметр', uz: 'uzunlik berilgan, diametr kerak', en: 'length given, diameter wanted' }, bin: 'b' },
      { label: { ru: 'дана длина, ищем радиус', uz: 'uzunlik berilgan, radius kerak', en: 'length given, radius wanted' }, bin: 'b' },
      { label: { ru: 'дан обхват дерева, ищем толщину', uz: "daraxt aylanasi berilgan, yo'g'onligi kerak", en: 'tree girth given, thickness wanted' }, bin: 'b' },
    ],
    hint: {
      ru: 'Ищем саму линию — умножаем, ищем поперечник — делим.',
      uz: "Chiziqning o'zini qidirsak ko'paytiramiz, ko'ndalangini qidirsak bo'lamiz.",
      en: 'Looking for the line itself, multiply. Looking for the width, divide.',
    },
    correct_text: {
      ru: 'Верно. Длина всегда больше поперечника, это и подсказывает действие.',
      uz: "To'g'ri. Uzunlik doim ko'ndalangdan katta, bu amalni ham aytib turadi.",
      en: 'Right. The length always exceeds the width, and that hints at the operation.',
    },
    audio: {
      intro: {
        ru: 'Разложите случаи по двум корзинам. Если ищем длину, умножаем на пи, если поперечник, то делим.',
        uz: "Hollarni ikki savatga ajrating. Uzunlik kerak bo'lsa pi ga ko'paytiramiz, ko'ndalang kerak bo'lsa bo'lamiz.",
        en: 'Sort the cases into two baskets. Multiply by pi for the length, divide for the width.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Посмотри, что именно ищут.', uz: 'Bu yerga emas. Nima qidirilayotganiga qarang.', en: 'Not here. Look at what is being sought.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Отабек: «Радиус 6, значит C = 3,14 · 6 = 18,84». Проверь.', uz: "Otabek: «Radius 6, demak C = 3,14 · 6 = 18,84». Tekshiring.", en: 'Otabek: “Radius 6, so C = 3.14 · 6 = 18.84.” Check it.' },
        opts: [
          { ru: 'Нет: нужен диаметр 12, будет 37,68', uz: "Yo'q: diametr 12 kerak, 37,68 bo'ladi", en: 'No: the diameter is 12, giving 37.68' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет 9,42', uz: "Yo'q, 9,42 bo'ladi", en: 'No, it is 9.42' },
        ],
        correct: 0,
        ok: { ru: 'Верно. В формулу подставляют диаметр, а не радиус.', uz: "To'g'ri. Formulaga radius emas, diametr qo'yiladi.", en: 'Right. The formula takes the diameter, not the radius.' },
        wrong: [
          null,
          { ru: 'Проверь на глаз: диаметр 12, значит длина около 36.', uz: "Ko'z bilan tekshiring: diametr 12, demak uzunlik taxminan 36.", en: 'Eyeball it: diameter 12 means a length near 36.' },
          { ru: 'Так вышло бы у половины окружности радиуса 3.', uz: "Bu radiusi 3 bo'lgan yarim aylanada chiqardi.", en: 'That would be half a circle of radius 3.' },
        ],
      },
      {
        q: { ru: 'Азиза: «Длина 15,7, значит диаметр 15,7 · 3,14». Проверь.', uz: "Aziza: «Uzunlik 15,7, demak diametr 15,7 · 3,14». Tekshiring.", en: 'Aziza: “Length 15.7, so diameter 15.7 · 3.14.” Check it.' },
        opts: [
          { ru: 'Нет: нужно делить, диаметр 5', uz: "Yo'q: bo'lish kerak, diametr 5", en: 'No: divide instead, the diameter is 5' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, диаметр 10', uz: "Yo'q, diametr 10", en: 'No, the diameter is 10' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Диаметр меньше длины, значит делим.', uz: "To'g'ri. Diametr uzunlikdan kichik, demak bo'lamiz.", en: 'Right. The diameter is smaller than the length, so divide.' },
        wrong: [
          null,
          { ru: 'Умножение сделало бы диаметр больше самой окружности.', uz: "Ko'paytirish diametrni aylananing o'zidan katta qilardi.", en: 'Multiplying would make the diameter exceed the circle.' },
          { ru: 'Десять было бы при длине 31,4.', uz: "O'n uzunlik 31,4 bo'lganda chiqardi.", en: 'Ten would come from a length of 31.4.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в выборе величины, и в выборе действия.',
        uz: "Birovning yechimini tekshiring. Xato kattalikni tanlashda ham, amalni tanlashda ham bo'ladi.",
        en: 'Check someone else’s work. A mistake can be in the quantity chosen and in the operation.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Колесо самоката', uz: "Samokat g'ildiragi", en: 'The scooter wheel' },
    lead: { ru: 'Диаметр колеса 20 см, длина окружности 62,8 см.', uz: "G'ildirak diametri 20 sm, aylana uzunligi 62,8 sm.", en: 'The wheel is 20 cm across, its circumference 62.8 cm.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сколько проедет самокат за 5 оборотов?', uz: "Samokat 5 aylanishda qancha yuradi?", en: 'How far in 5 turns?' },
        opts: [
          { ru: '314 см', uz: '314 sm', en: '314 cm' },
          { ru: '100 см', uz: '100 sm', en: '100 cm' },
          { ru: '12,56 см', uz: '12,56 sm', en: '12.56 cm' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 62,8 · 5 = 314 см.', uz: "To'g'ri. 62,8 · 5 = 314 sm.", en: 'Right. 62.8 · 5 = 314 cm.' },
        wrong: [
          null,
          { ru: 'Это диаметр, умноженный на 5, а колесо катится ободом.', uz: "Bu 5 ga ko'paytirilgan diametr, g'ildirak esa chetiga tayanib dumalaydi.", en: 'That is the diameter times 5, but a wheel rolls on its rim.' },
          { ru: 'Это длина, разделённая на 5, а нужно умножить.', uz: "Bu 5 ga bo'lingan uzunlik, ko'paytirish kerak esa.", en: 'That divides the length by 5 instead of multiplying.' },
        ],
      },
      {
        q: { ru: 'Сколько оборотов сделает колесо на пути 628 см?', uz: "628 sm yo'lda g'ildirak necha marta aylanadi?", en: 'How many turns over 628 cm?' },
        opts: ['10', '31', '5'],
        correct: 0,
        ok: { ru: 'Верно. 628 : 62,8 = 10 оборотов.', uz: "To'g'ri. 628 : 62,8 = 10 aylanish.", en: 'Right. 628 : 62.8 = 10 turns.' },
        wrong: [
          null,
          { ru: 'Делить надо на длину окружности, а не на диаметр.', uz: "Aylana uzunligiga bo'lish kerak, diametrga emas.", en: 'Divide by the circumference, not the diameter.' },
          { ru: 'Проверь: 5 оборотов дают только 314 см.', uz: 'Tekshiring: 5 aylanish atigi 314 sm beradi.', en: 'Check: five turns give only 314 cm.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про самокат. Диаметр колеса двадцать сантиметров, длина окружности шестьдесят два и восемь десятых сантиметра.',
        uz: "Samokat haqida masala. G'ildirak diametri yigirma santimetr, aylana uzunligi oltmish ikki butun o'ndan sakkiz santimetr.",
        en: 'A scooter problem. The wheel is twenty centimetres across and its circumference is sixty two point eight centimetres.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 314,
        q: { ru: 'Диаметр колеса 100 см. Найди длину окружности в см.', uz: "G'ildirak diametri 100 sm. Aylana uzunligini sm da toping.", en: 'A wheel is 100 cm across. Find its circumference in cm.' },
        hint: { ru: 'Умножь 3,14 на 100.', uz: "3,14 ni 100 ga ko'paytiring.", en: 'Multiply 3.14 by 100.' },
        hint_audio: { ru: 'Длина окружности это пи умножить на диаметр, то есть три целых четырнадцать сотых умножить на сто.', uz: "Aylana uzunligi pi karra diametr, ya'ni uch butun yuzdan o'n to'rt karra yuz.", en: 'The circumference is pi times the diameter, that is three point one four times one hundred.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Радиус 4 см. Длина окружности?', uz: 'Radius 4 sm. Aylana uzunligi?', en: 'Radius 4 cm. Circumference?' },
        opts: ['12,56 см', '6,28 см', '25,12 см', '8 см'],
        wrong: [
          { ru: 'Радиус подставили вместо диаметра.', uz: "Diametr o'rniga radius qo'yilgan.", en: 'The radius was used instead of the diameter.' },
          { ru: 'Так вышло бы при радиусе 1.', uz: "Radius 1 bo'lganda shunday chiqardi.", en: 'That would be a radius of one.' },
          null,
          { ru: 'Это диаметр, а спрашивали длину.', uz: "Bu diametr, so'ralgani esa uzunlik.", en: 'That is the diameter, but the length was asked.' },
        ],
        correct: { ru: 'Верно. Диаметр 8, значит 3,14 · 8 = 25,12 см.', uz: "To'g'ri. Diametr 8, demak 3,14 · 8 = 25,12 sm.", en: 'Right. The diameter is 8, so 3.14 · 8 = 25.12 cm.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Длина окружности 94,2 см. Диаметр?', uz: 'Aylana uzunligi 94,2 sm. Diametr?', en: 'Circumference 94.2 cm. Diameter?' },
        opts: ['15 см', '30 см', '296 см', '47,1 см'],
        wrong: [
          { ru: 'Это радиус, а спрашивали диаметр.', uz: "Bu radius, so'ralgani esa diametr.", en: 'That is the radius, but the diameter was asked.' },
          null,
          { ru: 'Умножают, когда ищут длину, а она известна.', uz: "Uzunlik qidirilganda ko'paytiriladi, u esa ma'lum.", en: 'You multiply to find the length, which is known.' },
          { ru: 'Так делят длину пополам, а нужно на π.', uz: "Bunda uzunlik teng ikkiga bo'lingan, π ga bo'lish kerak esa.", en: 'That halves the length instead of dividing by π.' },
        ],
        correct: { ru: 'Верно. 94,2 : 3,14 = 30 см.', uz: "To'g'ri. 94,2 : 3,14 = 30 sm.", en: 'Right. 94.2 : 3.14 = 30 cm.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Что показывает число π?', uz: "π soni nimani ko'rsatadi?", en: 'What does π show?' },
        opts: [
          { ru: 'длину любой окружности', uz: 'har qanday aylana uzunligini', en: 'the length of any circle' },
          { ru: 'радиус круга', uz: 'doira radiusini', en: 'the radius of a disc' },
          { ru: 'площадь круга', uz: 'doira yuzasini', en: 'the area of a disc' },
          { ru: 'во сколько раз длина больше диаметра', uz: 'uzunlik diametrdan necha marta katta ekanini', en: 'how many times the length beats the diameter' },
        ],
        wrong: [
          { ru: 'Длина зависит от размера, а π у всех кругов одно.', uz: "Uzunlik o'lchamga bog'liq, π esa barcha doiralarda bitta.", en: 'The length depends on size, but π is the same for all.' },
          { ru: 'Радиус у каждого круга свой.', uz: "Har bir doiraning radiusi o'ziniki.", en: 'Every circle has its own radius.' },
          { ru: 'Площадь это другая величина, о ней следующий урок.', uz: 'Yuza boshqa kattalik, u haqda keyingi dars.', en: 'Area is a different quantity, that is the next lesson.' },
          null,
        ],
        correct: { ru: 'Верно. Это отношение, и оно одинаково у всех кругов.', uz: "To'g'ri. Bu nisbat va u barcha doiralarda bir xil.", en: 'Right. It is a ratio and it is the same for every circle.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Колесо диаметром 20 см сделало один оборот. Путь?', uz: "Diametri 20 sm bo'lgan g'ildirak bir marta aylandi. Yo'l?", en: 'A 20 cm wheel made one turn. Distance?' },
        opts: [
          { ru: '62,8 см', uz: '62,8 sm', en: '62.8 cm' },
          { ru: '20 см', uz: '20 sm', en: '20 cm' },
          { ru: '31,4 см', uz: '31,4 sm', en: '31.4 cm' },
          { ru: '10 см', uz: '10 sm', en: '10 cm' },
        ],
        wrong: [
          null,
          { ru: 'Это диаметр, а колесо катится ободом.', uz: "Bu diametr, g'ildirak esa chetiga tayanib dumalaydi.", en: 'That is the diameter, but a wheel rolls on its rim.' },
          { ru: 'Так вышло бы при диаметре 10.', uz: "Diametr 10 bo'lganda shunday chiqardi.", en: 'That would be a diameter of ten.' },
          { ru: 'Это радиус колеса.', uz: "Bu g'ildirak radiusi.", en: 'That is the radius of the wheel.' },
        ],
        correct: { ru: 'Верно. За оборот колесо проезжает свою длину окружности.', uz: "To'g'ri. Bir aylanishda g'ildirak o'z aylana uzunligicha yuradi.", en: 'Right. In one turn a wheel covers its own circumference.' },
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
      ru: 'Число π никогда не кончается и не повторяется: 3,14159 и дальше без конца. В древности брали просто 3, потом 22 : 7. А в 1424 году в Самарканде, в обсерватории Улугбека, аль-Каши вычислил π с шестнадцатью верными знаками после запятой. Этот рекорд держался почти двести лет.',
      uz: "π soni hech qachon tugamaydi va takrorlanmaydi: 3,14159 va yana cheksiz. Qadimda oddiygina 3, keyin 22 : 7 olingan. 1424 yilda esa Samarqandda, Ulug'bek rasadxonasida al-Koshiy π ni verguldan keyin o'n oltita to'g'ri raqam bilan hisoblab chiqdi. Bu rekord deyarli ikki yuz yil turdi.",
      en: 'The number π never ends and never repeats: 3.14159 and on forever. In antiquity people simply used 3, later 22 : 7. And in 1424 in Samarkand, at Ulugh Beg’s observatory, al-Kashi computed π to sixteen correct decimal places. That record stood for almost two hundred years.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Число пи никогда не кончается и не повторяется: три целых, дальше один, четыре, один, пять, девять и так без конца. В древности брали просто три, потом двадцать два седьмых. А в тысяча четыреста двадцать четвёртом году в Самарканде, в обсерватории Улугбека, аль-Каши вычислил пи с шестнадцатью верными знаками после запятой. Этот рекорд держался почти двести лет.',
      uz: "Bilasizmi? Pi soni hech qachon tugamaydi va takrorlanmaydi: uch butun, keyin bir, to'rt, bir, besh, to'qqiz va shu tariqa cheksiz. Qadimda oddiygina uch, keyin yigirma ikkidan yetti olingan. Ming to'rt yuz yigirma to'rtinchi yilda esa Samarqandda, Ulug'bek rasadxonasida al-Koshiy pi ni verguldan keyin o'n oltita to'g'ri raqam bilan hisoblab chiqdi. Bu rekord deyarli ikki yuz yil turdi.",
      en: 'Did you know? The number pi never ends and never repeats: three point one four one five nine and on forever. In antiquity people simply used three, later twenty two sevenths. And in fourteen twenty four in Samarkand, at Ulugh Beg’s observatory, al-Kashi computed pi to sixteen correct decimal places. That record stood for almost two hundred years.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Геометрия', uz: 'Matematika · Geometriya', en: 'Mathematics · Geometry' },
    heading: { ru: 'Длина окружности', uz: 'Aylana uzunligi', en: 'The circumference' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'C = πd и C = 2πr', uz: 'C = πd va C = 2πr', en: 'C = πd and C = 2πr' },
    brief_2: { ru: 'π примерно 3,14 у любого круга', uz: 'π har qanday doirada taxminan 3,14', en: 'π is about 3.14 for every circle' },
    brief_3: { ru: 'за оборот колесо проезжает C', uz: "bir aylanishda g'ildirak C yuradi", en: 'one turn covers C' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Проверка на глаз', uz: "Ko'z bilan tekshiruv", en: 'The eyeball check' },
    memo_a1: { ru: 'длина чуть больше трёх диаметров', uz: "uzunlik uchta diametrdan sal ko'p", en: 'a bit over three diameters' },
    memo_q2: { ru: 'Известна длина', uz: "Uzunlik ma'lum", en: 'Length known' },
    memo_a2: { ru: 'диаметр = C : π', uz: 'diametr = C : π', en: 'diameter = C : π' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'подставить радиус вместо диаметра', uz: "diametr o'rniga radius qo'yish", en: 'using the radius as the diameter' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Отношение длины окружности к диаметру одинаково у всех кругов, это число пи, примерно три целых четырнадцать сотых. Длина равна пи умножить на диаметр или два пи умножить на радиус. Если известна длина, диаметр находят делением на пи.',
        'Самокат: колесо диаметром двадцать сантиметров за оборот проезжает шестьдесят два и восемь десятых сантиметра.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Aylana uzunligining diametrga nisbati barcha doiralarda bir xil, bu pi soni, taxminan uch butun yuzdan o'n to'rt. Uzunlik pi karra diametr yoki ikki pi karra radiusga teng. Uzunlik ma'lum bo'lsa, diametr pi ga bo'lish bilan topiladi.",
        "Samokat: diametri yigirma santimetr bo'lgan g'ildirak bir aylanishda oltmish ikki butun o'ndan sakkiz santimetr yuradi.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'The ratio of circumference to diameter is the same for every circle: the number pi, about three point one four. The length is pi times the diameter, or two pi times the radius. If the length is known, the diameter comes from dividing by pi.',
        'The scooter: a twenty centimetre wheel covers sixty two point eight centimetres per turn.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Через диаметр', uz: 'Usul. Diametr orqali', en: 'Method. Through the diameter' },
    m1_steps: {
      ru: ['Найди диаметр: если дан радиус, удвой', 'Умножь диаметр на 3,14', 'Проверь на глаз: чуть больше трёх диаметров'],
      uz: ["Diametrni toping: radius berilgan bo'lsa, ikkilantiring", "Diametrni 3,14 ga ko'paytiring", "Ko'z bilan tekshiring: uchta diametrdan sal ko'p"],
      en: ['Find the diameter: double the radius if that is given', 'Multiply the diameter by 3.14', 'Eyeball it: a bit over three diameters'],
    },
    m1_no: {
      ru: 'Если известна длина, действие обратное: делим на π.',
      uz: "Uzunlik ma'lum bo'lsa, amal teskari: π ga bo'lamiz.",
      en: 'If the length is known, reverse it: divide by π.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: измерительный уголок в кабинете труда.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d38wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EAF4F9"/><stop offset="100%" stopColor="#F9F4EB"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d38wall)"/>

    {/* Школьное крыльцо и дорожка */}
    <rect x="0" y="118" width="400" height="36" fill="#C6BFAF"/>
    <path d="M0 118 h400" stroke="#A8A192" strokeWidth="2"/>
    <g opacity="0.9">
      <rect x="14" y="46" width="74" height="72" rx="4" fill="#E4D9C6" stroke="#C9A472" strokeWidth="2"/>
      <rect x="30" y="76" width="20" height="42" rx="2" fill="#B08A55"/>
      <rect x="58" y="58" width="18" height="16" rx="2" fill="#7ECBE6"/>
    </g>

    {/* След от колеса на дорожке: один оборот */}
    <path d="M150 138 h124" stroke="#8E8578" strokeWidth="2.4" strokeDasharray="7 5"/>
    <path d="M150 132 v12 M274 132 v12" stroke="#8E8578" strokeWidth="2.4"/>
    <text x="212" y="152" textAnchor="middle" fill="#8A8883"
      fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fontWeight="700">1 aylanish</text>

    {/* Самокат: колесо катится по дорожке */}
    <g className="d38-roll">
      <circle cx="0" cy="0" r="20" fill="none" stroke="#3B3730" strokeWidth="4"/>
      <circle cx="0" cy="0" r="3.4" fill="#3B3730"/>
      <path className="d38-spoke" d="M0 -20 v40 M-20 0 h40" stroke="#7B7367" strokeWidth="2"/>
    </g>
    <g>
      <circle cx="306" cy="118" r="20" fill="none" stroke="#3B3730" strokeWidth="4"/>
      <path d="M306 98 L306 60 h-52" stroke="#019ACB" strokeWidth="5" strokeLinecap="round"/>
      <path d="M170 118 h136" stroke="#019ACB" strokeWidth="5" strokeLinecap="round"/>
      <path d="M254 60 h-16" stroke="#3B3730" strokeWidth="4" strokeLinecap="round"/>
    </g>

    {/* Табличка с диаметром */}
    <g>
      <rect x="292" y="14" width="94" height="32" rx="5" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2"/>
      <text x="339" y="35" textAnchor="middle" fill="#D9603F"
        fontFamily="'JetBrains Mono', monospace" fontSize="14" fontWeight="700">d = 20</text>
    </g>

    <Person x={122} ground={118} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={94} ground={118} head={13} shirt="#F5C77E" hair="#5A4636"/>
  </svg>
);

// Итог: окружность разворачивается в три диаметра с хвостиком.
const FinalScene = () => {
  const lang = useLang();
  const d = 76;
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      <circle cx="46" cy="42" r={d / 2} fill="none" stroke="#019ACB" strokeWidth="3.4"/>
      <path d={`M${46 - d / 2} 42 h${d}`} stroke="#D9603F" strokeWidth="2.4"/>
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <rect x={106 + k * d} y="34" width={d - 3} height="16" rx="3" fill="#E7F5FA" stroke="#019ACB" strokeWidth="1.6"/>
          <text x={106 + k * d + d / 2} y="46" textAnchor="middle" fill="#019ACB"
            fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700">d</text>
        </g>
      ))}
      <rect x={106 + 3 * d} y="34" width={d * 0.14} height="16" rx="3" fill="#FBF3D6" stroke="#8A6A22" strokeWidth="1.6"/>
      <text x="200" y="76" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="11" fontWeight="700">
        {tri(lang, 'три диаметра и ещё немного', "uchta diametr va yana ozgina", 'three diameters and a bit more')}
      </text>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Прибор урока: окружность разворачивается в полосу длиной пи d.
const Unroll = ({ d = 60, marks = 3, tail = true, size = 'mid' }) => {
  const cy = 54;
  const x0 = 12 + d;
  return (
    <span className={'d38-unroll-box d38-unroll-' + size}>
      <svg viewBox="0 0 340 96" aria-hidden="true">
        <circle cx={12 + d / 2} cy={cy} r={d / 2} fill="none" stroke="#019ACB" strokeWidth="3.2"/>
        <path d={`M12 ${cy} h${d}`} stroke="#D9603F" strokeWidth="2.4"/>
        <text x={12 + d / 2} y={cy - d / 2 - 6} textAnchor="middle" fill="#D9603F"
          fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">d</text>
        <path d={`M${x0 + 6} ${cy + 22} h${3.14 * d}`} stroke="#8E8578" strokeWidth="2"/>
        {Array.from({ length: marks }, (_, k) => (
          <g key={k}>
            <rect x={x0 + 6 + k * d} y={cy + 6} width={d - 3} height="16" rx="3"
              fill="#E7F5FA" stroke="#019ACB" strokeWidth="1.6"/>
            <text x={x0 + 6 + k * d + d / 2} y={cy + 18} textAnchor="middle" fill="#019ACB"
              fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700">d</text>
          </g>
        ))}
        {tail && (
          <rect x={x0 + 6 + marks * d} y={cy + 6} width={d * 0.14} height="16" rx="3"
            fill="#FBF3D6" stroke="#8A6A22" strokeWidth="1.6"/>
        )}
      </svg>
    </span>
  );
};

// Опыт с ниткой: три круга, отношение одно и то же.
const RatioTable = ({ rows, shown }) => {
  const lang = useLang();
  return (
    <span className="d38-table">
      <span className="d38-thead">
        <i>d</i>
        <i>C</i>
        <i>{tri(lang, 'C : d', 'C : d', 'C : d')}</i>
      </span>
      {rows.map((r, i) => (
        <span key={r.d} className={'d38-trow d38-fade' + (i <= shown ? ' d38-on' : '')}>
          <i className="d38-td">{r.d}</i>
          <i className="d38-tc">{r.c}</i>
          <i className="d38-tq">{r.q}</i>
        </span>
      ))}
    </span>
  );
};

const Line = ({ node, on }) => (
  <span className={'d38-line d38-fade' + (on ? ' d38-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d38-stage">
        <span className="d38-circ">
          <svg viewBox="0 0 160 110" aria-hidden="true">
            <circle cx="80" cy="56" r="44" fill="none" stroke="#019ACB" strokeWidth="3.4"/>
            <path d="M36 56 h88" stroke="#D9603F" strokeWidth="3"/>
            <text x="80" y="50" textAnchor="middle" fill="#D9603F"
              fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="700">d</text>
          </svg>
        </span>
        <span className={'d38-chips d38-fade' + (step >= 1 ? ' d38-on' : '')}>
          <i className="d38-chip-l">{tri(lang, 'линия длиннее прямой', "chiziq to'g'ridan uzunroq", 'the curve beats the straight line')}</i>
          <i className="d38-chip-w">{tri(lang, 'но во сколько раз?', 'lekin necha marta?', 'but how many times?')}</i>
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

// Ядро: опыт с ниткой.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d38-stage d38-stage-row">
        <RatioTable rows={c.rows} shown={step >= 1 ? 2 : 0}/>
        <span className="d38-col">
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

// Через радиус и обратный ход.
const RadBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_rad;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d38-stage">
        <span className="d38-form">
          <i className="d38-form-a">C = πd</i>
          <b>=</b>
          <i className={'d38-form-b d38-fade' + (step >= 1 ? ' d38-on' : '')}>2πr</i>
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
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{mt(t(c.lead))}</p>
      <div className="frame fade-up delay-1 d38-stage">
        <Unroll d={54} size="sm" marks={step >= 1 ? 3 : 1} tail={step >= 1}/>
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

// Граница: радиус вместо диаметра.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d38-stage">
        <span className="d38-pair d38-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d38-pair d38-pair-good d38-fade' + (step >= 1 ? ' d38-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d38-pair d38-pair-warn d38-fade' + (step >= 2 ? ' d38-on' : '')}>
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
        <div className={'d38-banner fade-up delay-1' + (phase === 'play' ? ' d38-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d38-stage d38-stage-tool">
          {phase === 'demo' ? (
            <>
              <Unroll d={44} size="xs" marks={shown >= 1 ? 3 : 1} tail={shown >= 1}/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d38-verdict' + (done ? ' d38-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
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
          <div className="d38-acts fade-up">
            <button className="d38-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d38-btn d38-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenRad = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_rad} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <RadBody step={step}/>}/>
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
      <div className="d38-stage">
        <Unroll d={44} size="xs"/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenLen = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_len} asideNode={methodAside}/>
);
const ScreenBack = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_back} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: колесо и его развёртка.
const TaskFig = () => (
  <div className="d38-task-fig">
    <Unroll d={44} size="xs"/>
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
.d38-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d38-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d38-stage-tool .d38-line { font-size: clamp(12px, 2vw, 16px); }
.d38-stage-row { flex-direction: row; align-items: center; justify-content: center; gap: clamp(10px, 2.4vw, 22px); flex-wrap: wrap; }
.d38-col { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.1vw, 9px); flex: 1 1 200px; min-width: 0; }

/* Развёртка окружности */
.d38-unroll-box { display: block; width: 100%; max-width: 330px; }
.d38-unroll-sm { max-width: 290px; }
.d38-unroll-xs { max-width: 240px; }
.d38-unroll-box svg { width: 100%; height: auto; display: block; }
.d38-circ { display: block; width: 100%; max-width: 150px; }
.d38-circ svg { width: 100%; height: auto; display: block; }

.d38-fade { opacity: 0; transition: opacity 420ms linear; }
.d38-on { opacity: 1; }
.d38-line { font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 16px); font-weight: 700; color: #494550; text-align: center; }

/* Таблица опыта */
.d38-table { display: flex; flex-direction: column; gap: 4px; flex: 0 1 230px; }
.d38-thead, .d38-trow { display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; gap: 6px; }
.d38-thead i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.8vw, 12px); font-weight: 700; color: #8A8883; text-align: center; }
.d38-trow { padding: clamp(4px, 0.9vw, 7px) clamp(5px, 1.1vw, 9px); border-radius: 10px; background: #F4F1EA; border: 1px solid #E9E3D9; }
.d38-trow i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-weight: 700; text-align: center; font-size: clamp(11px, 2vw, 15px); }
.d38-td { color: #D9603F; }
.d38-tc { color: #494550; }
.d38-tq { color: #1F7A4D; }

/* Формулы */
.d38-form { display: inline-flex; align-items: center; gap: clamp(8px, 1.7vw, 14px); flex-wrap: wrap; justify-content: center; }
.d38-form b { font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3vw, 24px); color: #8A8883; }
.d38-form i { font-style: normal; padding: 6px 15px; border-radius: 12px; font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3vw, 25px); font-weight: 700; }
.d38-form-a { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }
.d38-form-b { background: #E3F0E8; border: 1px solid #A9CFBA; color: #1F7A4D; }

/* Подписи */
.d38-chips { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d38-chips i { font-style: normal; padding: 5px 12px; border-radius: 10px; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 15px); font-weight: 700; }
.d38-chip-l { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }
.d38-chip-w { background: #FBF3D6; border: 1px solid #E4CE93; color: #8A6A22; }

/* Строки экрана границы */
.d38-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d38-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d38-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d38-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d38-task-fig { display: flex; justify-content: center; width: 100%; }

/* Экран 4 */
.d38-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d38-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d38-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d38-verdict-on { opacity: 1; }
.d38-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d38-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d38-btn:disabled { opacity: 0.45; cursor: default; }
.d38-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d38-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: колесо катится по дорожке и крутится */
.d38-roll { animation: d38Roll 6000ms linear infinite; }
@keyframes d38Roll { from { transform: translate(150px, 118px) rotate(0deg); } to { transform: translate(274px, 118px) rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .d38-roll { animation: none; transform: translate(212px, 118px); } }
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function CircumferenceLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenRad, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenLen, ScreenBack, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
