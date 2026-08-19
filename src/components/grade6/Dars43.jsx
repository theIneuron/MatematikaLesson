// ============================================================
// 6 КЛАСС, УРОК 43 «Площадь треугольника и составных фигур»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б12, второй урок. Формула S = ah : 2 получается складыванием:
// два одинаковых треугольника дают прямоугольник, значит один занимает
// его половину. Отдельный экран отдан тому, что наклон не важен: при
// одном основании и одной высоте площадь одна и та же.
//
// Сцена — школьный кружок, делают воздушного змея из бумаги.
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
  lessonId: 'grade6-43',
  lessonTitle: {
    ru: 'Площадь треугольника и составных фигур',
    uz: 'Uchburchak va murakkab shakllar yuzi',
    en: 'Area of triangles and compound shapes',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 varrak: ikki yelkan
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 to'rtburchak yuzi esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 ikki uchburchak to'rtburchak beradi
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: asos, balandlik, yarim
  { id: 's_lean',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 qiyalik muhim emas
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: murakkab shakl
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: 2 ga bo'lish va balandlik
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_area',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 yuzani topish x3
  { id: 's_comp',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 murakkab va teskari x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: qo'shamizmi yoki ayiramizmi
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: varrak
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Два паруса для змея', uz: 'Varrak uchun ikki yelkan', en: 'Two sails for the kite' },
    lead: {
      ru: 'Оба паруса треугольные, основание 8 см и высота 5 см. Но один прямой, другой скошенный.',
      uz: "Ikkala yelkan uchburchak, asosi 8 sm va balandligi 5 sm. Biri to'g'ri, ikkinchisi qiyshiq.",
      en: 'Both sails are triangles with base 8 cm and height 5 cm. One is upright, the other slanted.',
    },
    voice_a: { ru: 'Отабек: на скошенный бумаги уйдёт больше.', uz: "Otabek: qiyshig'iga qog'oz ko'proq ketadi.", en: 'Otabek: the slanted one needs more paper.' },
    voice_b: { ru: 'Лола: одинаково.', uz: 'Lola: bir xil.', en: 'Lola: the same amount.' },
    ask: { ru: 'На какой парус уйдёт больше бумаги?', uz: "Qaysi yelkanga ko'proq qog'oz ketadi?", en: 'Which sail needs more paper?' },
    options: [
      { ru: 'на скошенный', uz: "qiyshig'iga", en: 'the slanted one' },
      { ru: 'одинаково', uz: 'bir xil', en: 'the same' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'В кружке делают воздушного змея. Для него нужны два треугольных паруса. У обоих основание восемь сантиметров и высота пять, но один треугольник стоит прямо, а второй сильно скошен набок.',
          'Отабек говорит, что на скошенный парус бумаги уйдёт больше: он выглядит вытянутым. Лола отвечает, что одинаково. На какой парус уйдёт больше бумаги? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "To'garakda varrak yasalmoqda. Unga ikkita uchburchak yelkan kerak. Ikkalasining asosi sakkiz santimetr va balandligi besh, lekin bir uchburchak tik turadi, ikkinchisi esa yonga qattiq qiyshaygan.",
          "Otabek qiyshiq yelkanga qog'oz ko'proq ketadi deydi: u cho'zilgan ko'rinadi. Lola esa bir xil deb javob beradi. Qaysi yelkanga ko'proq qog'oz ketadi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'The club is making a kite. It needs two triangular sails. Both have a base of eight centimetres and a height of five, but one triangle stands upright while the other leans far to the side.',
          'Otabek says the slanted sail needs more paper: it looks stretched. Lola answers they are the same. Which sail needs more paper? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Площадь прямоугольника', uz: "To'rtburchak yuzi", en: 'The area of a rectangle' },
    done: {
      ru: 'Площадь прямоугольника — произведение сторон. Через прямоугольник мы и найдём площадь треугольника.',
      uz: "To'rtburchak yuzi tomonlar ko'paytmasi. Uchburchak yuzini ham to'rtburchak orqali topamiz.",
      en: 'A rectangle’s area is the product of its sides. Through a rectangle we will find a triangle’s area.',
    },
    audio: {
      ru: [
        'Вспомним площадь прямоугольника. Она равна произведению двух сторон: сколько клеток в ряду, умножить на число рядов.',
        'Например, восемь на пять это сорок клеток.',
        'А как найти площадь треугольника? Хитрость в том, чтобы свести его к знакомому прямоугольнику.',
      ],
      uz: [
        "To'rtburchak yuzini eslaymiz. U ikki tomonning ko'paytmasiga teng: qatordagi kataklar soni karra qatorlar soni.",
        "Masalan, sakkiz karra besh qirq katak.",
        "Uchburchak yuzini qanday topamiz? Hiylasi shunda: uni tanish to'rtburchakka keltirish kerak.",
      ],
      en: [
        'Recall the area of a rectangle. It is the product of two sides: cells in a row times the number of rows.',
        'For example, eight by five is forty cells.',
        'And how do we find a triangle’s area? The trick is to reduce it to the familiar rectangle.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Два треугольника — прямоугольник', uz: "Ikki uchburchak — to'rtburchak", en: 'Two triangles make a rectangle' },
    lines: [
      { ru: 'берём второй такой же треугольник', uz: 'ikkinchi xuddi shunday uchburchakni olamiz', en: 'take a second identical triangle' },
      { ru: 'переворачиваем и приставляем: вышел прямоугольник', uz: "o'girib qo'yamiz: to'rtburchak chiqdi", en: 'flip it and attach: a rectangle appears' },
      { ru: 'значит S = a · h : 2', uz: 'demak S = a · h : 2', en: 'so S = a · h : 2' },
    ],
    done: {
      ru: 'Основание — сторона, на которую опираемся. Высота — перпендикуляр к ней. Треугольник занимает половину прямоугольника со сторонами a и h.',
      uz: "Asos — tayanadigan tomon. Balandlik — unga perpendikular. Uchburchak tomonlari a va h bo'lgan to'rtburchakning yarmini egallaydi.",
      en: 'The base is the side you rest on. The height is the perpendicular to it. A triangle takes half of the rectangle with sides a and h.',
    },
    audio: {
      ru: [
        'Возьмём треугольник и вырежем второй точно такой же. Перевернём его и приставим к первому.',
        'Получился прямоугольник. Его стороны это основание треугольника и высота, проведённая к этому основанию.',
        'Площадь прямоугольника равна основание умножить на высоту, а треугольник занимает ровно половину. Значит площадь треугольника это основание умножить на высоту и разделить на два.',
      ],
      uz: [
        "Uchburchakni olib, xuddi shunday ikkinchisini qirqib olamiz. Uni o'girib, birinchisiga qo'shamiz.",
        "To'rtburchak hosil bo'ldi. Uning tomonlari uchburchakning asosi va shu asosga tushirilgan balandlik.",
        "To'rtburchak yuzi asos karra balandlikka teng, uchburchak esa roppa-rosa yarmini egallaydi. Demak uchburchak yuzi asos karra balandlik bo'linsin ikkiga.",
      ],
      en: [
        'Take a triangle and cut out a second one exactly like it. Flip it over and attach it to the first.',
        'A rectangle appears. Its sides are the base of the triangle and the height drawn to that base.',
        'The rectangle’s area is base times height, and the triangle takes exactly half. So a triangle’s area is base times height divided by two.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Основание, высота, половина', uz: 'Asos, balandlik, yarim', en: 'Base, height, half' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: 'основание 8, высота 5', uz: 'asos 8, balandlik 5', en: 'base 8, height 5' },
      { ru: 'прямоугольник: 8 · 5 = 40', uz: "to'rtburchak: 8 · 5 = 40", en: 'the rectangle: 8 · 5 = 40' },
      { ru: 'треугольник вдвое меньше: 20 см²', uz: 'uchburchak ikki barobar kichik: 20 sm²', en: 'the triangle is half: 20 cm²' },
    ],
    demo_note: {
      ru: 'Сначала считаем прямоугольник, потом делим на два. Высота обязательно перпендикулярна основанию.',
      uz: "Avval to'rtburchakni hisoblaymiz, keyin ikkiga bo'lamiz. Balandlik albatta asosga perpendikular.",
      en: 'First the rectangle, then divide by two. The height must be perpendicular to the base.',
    },
    play_ask: { ru: 'Основание 6, высота 4. Площадь треугольника?', uz: 'Asos 6, balandlik 4. Uchburchak yuzi?', en: 'Base 6, height 4. Area of the triangle?' },
    play_opts: [
          { ru: '12 см²', uz: '12 sm²', en: '12 cm²' },
          { ru: '24 см²', uz: '24 sm²', en: '24 cm²' },
          { ru: '10 см²', uz: '10 sm²', en: '10 cm²' },
        ],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. 6 · 4 = 24, потом 24 : 2 = 12 см².',
      uz: "To'g'ri. 6 · 4 = 24, keyin 24 : 2 = 12 sm².",
      en: 'Right. 6 · 4 = 24, then 24 : 2 = 12 cm².',
    },
    play_wrong: [
      null,
      { ru: 'Это площадь прямоугольника, треугольник вдвое меньше.', uz: "Bu to'rtburchak yuzi, uchburchak ikki barobar kichik.", en: 'That is the rectangle; the triangle is half.' },
      { ru: 'Это сумма сторон, а площадь считают умножением.', uz: "Bu tomonlar yig'indisi, yuza esa ko'paytirish bilan topiladi.", en: 'That is a sum; area comes from multiplying.' },
    ],
    audio: {
      intro: {
        ru: 'Покажу расчёт. У треугольника основание восемь сантиметров, высота пять.',
        uz: "Hisobni ko'rsataman. Uchburchakning asosi sakkiz santimetr, balandligi besh.",
        en: 'I will show the calculation. The triangle has base eight centimetres and height five.',
      },
      demo: {
        ru: 'Достроим треугольник до прямоугольника со сторонами восемь и пять. Его площадь сорок квадратных сантиметров. Треугольник это ровно половина, значит двадцать квадратных сантиметров. Сначала перемножаем, потом делим на два.',
        uz: "Uchburchakni tomonlari sakkiz va besh bo'lgan to'rtburchakka to'ldiramiz. Uning yuzi qirq kvadrat santimetr. Uchburchak roppa-rosa yarmi, demak yigirma kvadrat santimetr. Avval ko'paytiramiz, keyin ikkiga bo'lamiz.",
        en: 'Complete the triangle to a rectangle with sides eight and five. Its area is forty square centimetres. The triangle is exactly half, so twenty square centimetres. Multiply first, then divide by two.',
      },
      play: {
        ru: 'Теперь ваша очередь. Основание шесть, высота четыре. Чему равна площадь треугольника?',
        uz: "Endi sizning navbatingiz. Asos olti, balandlik to'rt. Uchburchak yuzi nechaga teng?",
        en: 'Now it is your turn. Base six, height four. What is the area of the triangle?',
      },
      ok: {
        ru: 'Верно. Шесть на четыре двадцать четыре, половина это двенадцать.',
        uz: "To'g'ri. Olti karra to'rt yigirma to'rt, yarmi o'n ikki.",
        en: 'Right. Six times four is twenty four and half of that is twelve.',
      },
      wrong: {
        ru: 'Перемножьте основание и высоту, а потом обязательно разделите на два.',
        uz: "Asos va balandlikni ko'paytiring, keyin albatta ikkiga bo'ling.",
        en: 'Multiply base by height and then be sure to divide by two.',
      },
    },
  },

  s_lean: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Наклон не важен', uz: 'Qiyalik muhim emas', en: 'The lean does not matter' },
    lines: [
      { ru: 'основание одно и то же: 8', uz: 'asos bir xil: 8', en: 'the same base: 8' },
      { ru: 'высота одна и та же: 5', uz: 'balandlik bir xil: 5', en: 'the same height: 5' },
      { ru: 'значит и площадь одна: 20 см²', uz: 'demak yuza ham bitta: 20 sm²', en: 'so the same area: 20 cm²' },
    ],
    done: {
      ru: 'Вершину можно двигать вдоль верхней линии сколько угодно: площадь не изменится. Права была Лола.',
      uz: "Uchni yuqori chiziq bo'ylab xohlagancha surish mumkin: yuza o'zgarmaydi. Lola haq edi.",
      en: 'You may slide the apex along the top line as far as you like: the area does not change. Lola was right.',
    },
    audio: {
      ru: [
        'Возьмём треугольник и начнём двигать его верхнюю вершину вправо, не поднимая и не опуская.',
        'Основание осталось тем же, высота тоже: вершина скользит по одной и той же линии. А значит и достроенный прямоугольник тот же.',
        'Площадь не изменилась ни на клетку, хотя фигура выглядит совсем иначе. Права была Лола: бумаги на оба паруса уйдёт одинаково.',
      ],
      uz: [
        "Uchburchakni olib, uning yuqori uchini ko'tarmasdan va tushirmasdan o'ngga sura boshlaymiz.",
        "Asos o'sha qoldi, balandlik ham: uch bitta chiziq bo'ylab siljiydi. Demak to'ldirilgan to'rtburchak ham o'sha.",
        "Shakl butunlay boshqacha ko'rinsa ham, yuza bir katakka ham o'zgarmadi. Lola haq edi: ikkala yelkanga qog'oz bir xil ketadi.",
      ],
      en: [
        'Take a triangle and start sliding its top vertex to the right without raising or lowering it.',
        'The base stayed the same and so did the height: the apex slides along one line. So the completed rectangle is the same too.',
        'The area did not change by a single cell, though the shape looks entirely different. Lola was right: both sails take the same paper.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Составная фигура', uz: 'Murakkab shakl', en: 'A compound shape' },
    lead: { ru: 'Змей из двух треугольников: верхний 6 на 4, нижний 6 на 2.', uz: "Ikki uchburchakdan varrak: yuqorisi 6 ga 4, pastkisi 6 ga 2.", en: 'A kite of two triangles: top 6 by 4, bottom 6 by 2.' },
    steps: [
      { ru: 'верхний: 6 · 4 : 2 = 12', uz: 'yuqorisi: 6 · 4 : 2 = 12', en: 'top: 6 · 4 : 2 = 12' },
      { ru: 'нижний: 6 · 2 : 2 = 6', uz: 'pastkisi: 6 · 2 : 2 = 6', en: 'bottom: 6 · 2 : 2 = 6' },
      { ru: 'вместе: 12 + 6 = 18 см²', uz: 'birga: 12 + 6 = 18 sm²', en: 'together: 12 + 6 = 18 cm²' },
    ],
    done: {
      ru: 'Сложную фигуру разбивают на простые части и складывают их площади. Иногда наоборот: обводят большим прямоугольником и вычитают лишнее.',
      uz: "Murakkab shakl oddiy qismlarga bo'linadi va ularning yuzalari qo'shiladi. Ba'zan teskarisi: katta to'rtburchak bilan o'rab, ortiqchasi ayiriladi.",
      en: 'A complex shape is cut into simple parts and their areas added. Sometimes the reverse: box it in and subtract the extra.',
    },
    audio: {
      ru: [
        'Решаем вместе. Змей состоит из двух треугольников с общим основанием шесть сантиметров. У верхнего высота четыре, у нижнего два.',
        'Считаем верхний: шесть на четыре двадцать четыре, делим на два, получается двенадцать. Нижний: шесть на два двенадцать, делим на два, получается шесть.',
        'Складываем части: двенадцать плюс шесть это восемнадцать квадратных сантиметров. Так работают со всеми составными фигурами: разбить на простые и сложить. А иногда удобнее обвести фигуру прямоугольником и вычесть лишние углы.',
      ],
      uz: [
        "Birga yechamiz. Varrak umumiy asosi olti santimetr bo'lgan ikki uchburchakdan iborat. Yuqorisining balandligi to'rt, pastkisining ikki.",
        "Yuqorisini hisoblaymiz: olti karra to'rt yigirma to'rt, ikkiga bo'lamiz, o'n ikki chiqadi. Pastkisi: olti karra ikki o'n ikki, ikkiga bo'lamiz, olti chiqadi.",
        "Qismlarni qo'shamiz: o'n ikki qo'shuv olti bu o'n sakkiz kvadrat santimetr. Barcha murakkab shakllar bilan shunday ishlanadi: oddiy qismlarga bo'lib qo'shish. Ba'zan esa shaklni to'rtburchak bilan o'rab, ortiqcha burchaklarni ayirish qulayroq.",
      ],
      en: [
        'Let us solve it together. The kite is two triangles sharing a base of six centimetres. The top one has height four, the bottom one two.',
        'The top: six times four is twenty four, divided by two gives twelve. The bottom: six times two is twelve, divided by two gives six.',
        'Add the parts: twelve plus six is eighteen square centimetres. That is how all compound shapes work: cut into simple parts and add. Sometimes it is easier to box the shape in a rectangle and subtract the extra corners.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilinadi', en: 'Where mistakes happen' },
    title: { ru: 'Про двойку и про высоту', uz: 'Ikki va balandlik haqida', en: 'About the two and the height' },
    bad_line: { ru: 'ошибка: 8 · 5 = 40, забыли разделить на 2', uz: "xato: 8 · 5 = 40, 2 ga bo'lish unutilgan", en: 'mistake: 8 · 5 = 40, forgot to halve' },
    good_line: { ru: 'верно: 40 : 2 = 20 см²', uz: "to'g'ri: 40 : 2 = 20 sm²", en: 'right: 40 : 2 = 20 cm²' },
    warn_line: { ru: 'ошибка: взяли боковую сторону вместо высоты', uz: "xato: balandlik o'rniga yon tomon olingan", en: 'mistake: a side was used instead of the height' },
    done: {
      ru: 'Высота — это перпендикуляр к основанию, а не наклонная сторона. У скошенного треугольника высота короче боковой стороны.',
      uz: "Balandlik asosga perpendikular, qiya tomon emas. Qiyshiq uchburchakda balandlik yon tomondan qisqa.",
      en: 'The height is the perpendicular to the base, not a slanted side. In a leaning triangle the height is shorter than the side.',
    },
    audio: {
      ru: [
        'Две частые ошибки урока. Первая: перемножили основание и высоту и на этом остановились. Но так посчитан прямоугольник, а треугольник вдвое меньше.',
        'Проверка простая: если ответ вышел таким же, как у прямоугольника, значит двойку потеряли.',
        'Вторая ошибка: вместо высоты берут наклонную боковую сторону, потому что её длина написана на чертеже. Но высота идёт к основанию строго под прямым углом, и у скошенного треугольника она короче.',
      ],
      uz: [
        "Darsning tez-tez uchraydigan ikki xatosi. Birinchisi: asos va balandlikni ko'paytirib, shu bilan to'xtashadi. Ammo bunda to'rtburchak hisoblangan, uchburchak esa ikki barobar kichik.",
        "Tekshiruv oddiy: javob to'rtburchakdagidek chiqsa, demak ikki yo'qolgan.",
        "Ikkinchi xato: balandlik o'rniga qiya yon tomon olinadi, chunki uning uzunligi chizmada yozilgan. Ammo balandlik asosga qat'iy to'g'ri burchak ostida boradi va qiyshiq uchburchakda u qisqaroq.",
      ],
      en: [
        'Two common mistakes here. First: multiply base by height and stop. But that is the rectangle, and a triangle is half of it.',
        'The check is simple: if your answer equals the rectangle’s, the two went missing.',
        'The second mistake: taking a slanted side instead of the height because its length is printed on the drawing. But the height meets the base at a right angle, and in a leaning triangle it is shorter.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Половина прямоугольника', uz: "To'rtburchakning yarmi", en: 'Half a rectangle' },
    rule_1: {
      ru: 'Площадь треугольника равна основанию, умноженному на высоту, делённому на два: S = ah : 2. Высота — перпендикуляр от вершины к основанию.',
      uz: "Uchburchak yuzi asos karra balandlik bo'linsin ikkiga: S = ah : 2. Balandlik — uchdan asosga tushirilgan perpendikular.",
      en: 'The area of a triangle is base times height divided by two: S = ah : 2. The height is the perpendicular from the apex to the base.',
    },
    rule_2: {
      ru: 'При одном основании и одной высоте площадь не зависит от наклона. Составные фигуры разбивают на части и складывают либо обводят прямоугольником и вычитают. Змей: парусов два, площадь одна. Права была Лола.',
      uz: "Bir xil asos va balandlikda yuza qiyalikka bog'liq emas. Murakkab shakllar qismlarga bo'lib qo'shiladi yoki to'rtburchak bilan o'rab ayiriladi. Varrak: yelkan ikkita, yuza bitta. Lola haq edi.",
      en: 'With the same base and height the area does not depend on the lean. Compound shapes are cut and added, or boxed in and subtracted. The kite: two sails, one area. Lola was right.',
    },
    audio: {
      ru: 'Запомним правило. Площадь треугольника равна основанию, умноженному на высоту и делённому на два, потому что два одинаковых треугольника складываются в прямоугольник. Высота это перпендикуляр от вершины к основанию, а не наклонная сторона. При одном основании и одной высоте площадь не зависит от наклона. Составные фигуры разбивают на простые части и складывают площади, а иногда обводят прямоугольником и вычитают лишнее. Вернёмся к змею. У обоих парусов основание и высота одинаковые, значит и бумаги уйдёт одинаково. Права была Лола.',
      uz: "Qoidani eslab qolamiz. Uchburchak yuzi asos karra balandlik bo'linsin ikkiga, chunki ikkita bir xil uchburchak to'rtburchakka yig'iladi. Balandlik uchdan asosga tushirilgan perpendikular, qiya tomon emas. Bir xil asos va balandlikda yuza qiyalikka bog'liq emas. Murakkab shakllar oddiy qismlarga bo'linib yuzalari qo'shiladi, ba'zan to'rtburchak bilan o'rab ortiqchasi ayiriladi. Varrakka qaytamiz. Ikkala yelkanning asosi va balandligi bir xil, demak qog'oz ham bir xil ketadi. Lola haq edi.",
      en: 'Let us remember the rule. The area of a triangle is base times height divided by two, because two identical triangles make a rectangle. The height is the perpendicular from the apex to the base, not a slanted side. With the same base and height the area does not depend on the lean. Compound shapes are cut into simple parts and added, or boxed in and the extra subtracted. Back to the kite. Both sails share base and height, so they take the same paper. Lola was right.',
    },
  },

  s_area: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Площадь треугольника', uz: 'Uchburchak yuzi', en: 'The area of a triangle' },
    lead: { ru: 'Перемножь и раздели на два.', uz: "Ko'paytirib, ikkiga bo'ling.", en: 'Multiply, then halve.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Основание 10, высота 6. Площадь?', uz: 'Asos 10, balandlik 6. Yuza?', en: 'Base 10, height 6. Area?' },
        opts: [
          { ru: '30 см²', uz: '30 sm²', en: '30 cm²' },
          { ru: '60 см²', uz: '60 sm²', en: '60 cm²' },
          { ru: '16 см²', uz: '16 sm²', en: '16 cm²' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 10 · 6 = 60, потом 60 : 2 = 30.', uz: "To'g'ri. 10 · 6 = 60, keyin 60 : 2 = 30.", en: 'Right. 10 · 6 = 60, then 60 : 2 = 30.' },
        wrong: [
          null,
          { ru: 'Это прямоугольник, треугольник вдвое меньше.', uz: "Bu to'rtburchak, uchburchak ikki barobar kichik.", en: 'That is the rectangle; the triangle is half.' },
          { ru: 'Это сумма, а площадь считают умножением.', uz: "Bu yig'indi, yuza ko'paytirish bilan topiladi.", en: 'That is a sum; area comes from multiplying.' },
        ],
      },
      {
        q: { ru: 'Основание 7, высота 4. Площадь?', uz: 'Asos 7, balandlik 4. Yuza?', en: 'Base 7, height 4. Area?' },
        opts: [
          { ru: '14 см²', uz: '14 sm²', en: '14 cm²' },
          { ru: '28 см²', uz: '28 sm²', en: '28 cm²' },
          { ru: '11 см²', uz: '11 sm²', en: '11 cm²' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 7 · 4 = 28, половина 14.', uz: "To'g'ri. 7 · 4 = 28, yarmi 14.", en: 'Right. 7 · 4 = 28, half is 14.' },
        wrong: [
          null,
          { ru: 'Двойку потеряли.', uz: "Ikki yo'qolgan.", en: 'The two went missing.' },
          { ru: 'Это сумма сторон, а не площадь.', uz: "Bu tomonlar yig'indisi, yuza emas.", en: 'That is a sum of sides, not an area.' },
        ],
      },
      {
        q: { ru: 'Площадь 24 см², основание 8. Высота?', uz: 'Yuza 24 sm², asos 8. Balandlik?', en: 'Area 24 cm², base 8. Height?' },
        opts: ['6', '3', '12'],
        correct: 0,
        ok: { ru: 'Верно. Прямоугольник 48, значит высота 48 : 8 = 6.', uz: "To'g'ri. To'rtburchak 48, demak balandlik 48 : 8 = 6.", en: 'Right. The rectangle is 48, so the height is 48 : 8 = 6.' },
        wrong: [
          null,
          { ru: 'Сначала удвойте площадь: треугольник это половина.', uz: 'Avval yuzani ikkilantiring: uchburchak yarmi.', en: 'First double the area: a triangle is half.' },
          { ru: 'Проверьте: 8 · 12 : 2 даёт 48, а нужно 24.', uz: 'Tekshiring: 8 · 12 : 2 48 beradi, kerakli 24 esa.', en: 'Check: 8 · 12 : 2 gives 48, but 24 is needed.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на площадь. Не забывайте делить на два.',
        uz: "Yuza mashqi. Ikkiga bo'lishni unutmang.",
        en: 'Practice on area. Do not forget to halve.',
      },
    },
  },

  s_comp: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Составные фигуры', uz: 'Murakkab shakllar', en: 'Compound shapes' },
    lead: { ru: 'Разбей на части или обведи и вычти.', uz: "Qismlarga bo'ling yoki o'rab ayiring.", en: 'Cut into parts, or box in and subtract.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Два треугольника: 6 · 4 : 2 и 6 · 2 : 2. Вместе?', uz: 'Ikki uchburchak: 6 · 4 : 2 va 6 · 2 : 2. Birga?', en: 'Two triangles: 6 · 4 : 2 and 6 · 2 : 2. Together?' },
        opts: [
          { ru: '18 см²', uz: '18 sm²', en: '18 cm²' },
          { ru: '12 см²', uz: '12 sm²', en: '12 cm²' },
          { ru: '36 см²', uz: '36 sm²', en: '36 cm²' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 12 + 6 = 18 см².', uz: "To'g'ri. 12 + 6 = 18 sm².", en: 'Right. 12 + 6 = 18 cm².' },
        wrong: [
          null,
          { ru: 'Это только верхний треугольник.', uz: 'Bu faqat yuqori uchburchak.', en: 'That is only the top triangle.' },
          { ru: 'Части складывают после деления на два.', uz: "Qismlar ikkiga bo'lingandan keyin qo'shiladi.", en: 'The parts are added after halving.' },
        ],
      },
      {
        q: { ru: 'Прямоугольник 10 на 6, из него вырезали треугольник 10 на 6 : 2. Что осталось?', uz: "10 ga 6 to'rtburchakdan 10 ga 6 : 2 uchburchak qirqib olindi. Nima qoldi?", en: 'From a 10 by 6 rectangle a triangle 10 by 6 : 2 was cut. What remains?' },
        opts: [
          { ru: '30 см²', uz: '30 sm²', en: '30 cm²' },
          { ru: '60 см²', uz: '60 sm²', en: '60 cm²' },
          { ru: '15 см²', uz: '15 sm²', en: '15 cm²' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 60 − 30 = 30 см².', uz: "To'g'ri. 60 − 30 = 30 sm².", en: 'Right. 60 − 30 = 30 cm².' },
        wrong: [
          null,
          { ru: 'Это весь прямоугольник, а часть вырезали.', uz: "Bu butun to'rtburchak, bir qismi esa qirqib olingan.", en: 'That is the whole rectangle, but a piece was cut out.' },
          { ru: 'Треугольник занял половину, а не три четверти.', uz: "Uchburchak yarmini egalladi, to'rtdan uchini emas.", en: 'The triangle took half, not three quarters.' },
        ],
      },
      {
        q: { ru: 'Два треугольника: основание 8 и высота 3 у каждого. Вместе?', uz: 'Ikki uchburchak: har birining asosi 8, balandligi 3. Birga?', en: 'Two triangles, each base 8 height 3. Together?' },
        opts: [
          { ru: '24 см²', uz: '24 sm²', en: '24 cm²' },
          { ru: '12 см²', uz: '12 sm²', en: '12 cm²' },
          { ru: '48 см²', uz: '48 sm²', en: '48 cm²' },
        ],
        correct: 0,
        ok: { ru: 'Верно. По 12 каждый, вместе 24 см².', uz: "To'g'ri. Har biri 12, birga 24 sm².", en: 'Right. Twelve each, twenty four together.' },
        wrong: [
          null,
          { ru: 'Это площадь одного треугольника.', uz: 'Bu bitta uchburchakning yuzi.', en: 'That is one triangle.' },
          { ru: 'Про деление на два забыли.', uz: "Ikkiga bo'lish unutilgan.", en: 'The halving was forgotten.' },
        ],
      },
      {
        q: { ru: 'Как удобнее найти площадь фигуры с вырезанным углом?', uz: "Burchagi qirqilgan shakl yuzini qanday topish qulay?", en: 'How best to find the area of a shape with a cut corner?' },
        opts: [
          { ru: 'обвести прямоугольником и вычесть', uz: "to'rtburchak bilan o'rab ayirish", en: 'box it in and subtract' },
          { ru: 'измерить линейкой по краю', uz: "chetidan chizg'ich bilan o'lchash", en: 'measure along the edge' },
          { ru: 'сложить длины сторон', uz: "tomonlar uzunligini qo'shish", en: 'add the side lengths' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Считают большой прямоугольник и убирают лишнее.', uz: "To'g'ri. Katta to'rtburchak hisoblanadi va ortiqchasi olib tashlanadi.", en: 'Right. Compute the big rectangle and remove the extra.' },
        wrong: [
          null,
          { ru: 'По краю измеряют периметр, а не площадь.', uz: "Chetidan perimetr o'lchanadi, yuza emas.", en: 'The edge gives a perimeter, not an area.' },
          { ru: 'Сумма сторон это периметр.', uz: "Tomonlar yig'indisi bu perimetr.", en: 'The sum of sides is the perimeter.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на составные фигуры. Части складывают, лишнее вычитают.',
        uz: "Murakkab shakllar mashqi. Qismlar qo'shiladi, ortiqchasi ayiriladi.",
        en: 'Practice on compound shapes. Parts add, extras subtract.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Сложить или вычесть', uz: "Qo'shishmi yoki ayirish", en: 'Add or subtract' },
    lead: { ru: 'Смотри, фигура собрана из частей или из неё вырезали.', uz: "Shakl qismlardan yig'ilganmi yoki undan qirqib olinganmi, qarang.", en: 'See whether the shape is built up or cut into.' },
    bin_a: { ru: 'Складываем части', uz: "Qismlarni qo'shamiz", en: 'Add the parts' },
    bin_b: { ru: 'Вычитаем лишнее', uz: 'Ortiqchani ayiramiz', en: 'Subtract the extra' },
    cards: [
      { label: { ru: 'змей из двух треугольников', uz: 'ikki uchburchakdan varrak', en: 'a kite of two triangles' }, bin: 'a' },
      { label: { ru: 'дом: квадрат и крыша', uz: 'uy: kvadrat va tom', en: 'a house: square plus roof' }, bin: 'a' },
      { label: { ru: 'буква из двух полосок', uz: 'ikki tasmadan harf', en: 'a letter of two strips' }, bin: 'a' },
      { label: { ru: 'лист с отрезанным углом', uz: 'burchagi qirqilgan varaq', en: 'a sheet with a cut corner' }, bin: 'b' },
      { label: { ru: 'рамка вокруг картины', uz: 'rasm atrofidagi ramka', en: 'a frame around a picture' }, bin: 'b' },
      { label: { ru: 'доска с круглым отверстием', uz: 'dumaloq teshikli taxta', en: 'a board with a round hole' }, bin: 'b' },
    ],
    hint: {
      ru: 'Если фигуру собрали из кусков — складываем. Если из целого что-то убрали — вычитаем.',
      uz: "Shakl bo'laklardan yig'ilgan bo'lsa qo'shamiz. Butundan nimadir olingan bo'lsa ayiramiz.",
      en: 'Built from pieces: add. Something removed from a whole: subtract.',
    },
    correct_text: {
      ru: 'Верно. Обе дороги ведут к ответу, важно выбрать удобную.',
      uz: "To'g'ri. Ikkala yo'l ham javobga olib boradi, qulayini tanlash muhim.",
      en: 'Right. Both routes reach the answer; pick the convenient one.',
    },
    audio: {
      intro: {
        ru: 'Разложите случаи по двум корзинам. Спросите себя: фигуру собрали или из неё вырезали?',
        uz: "Hollarni ikki savatga ajrating. O'zingizdan so'rang: shakl yig'ilganmi yoki undan qirqilganmi?",
        en: 'Sort the cases into two baskets. Ask yourself: was the shape built up or cut into?',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Собрали или вырезали?', uz: "Bu yerga emas. Yig'ilganmi yoki qirqilganmi?", en: 'Not here. Built up or cut into?' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Отабек: «Основание 9, высота 4, площадь 36 см²». Проверь.', uz: "Otabek: «Asos 9, balandlik 4, yuza 36 sm²». Tekshiring.", en: 'Otabek: “Base 9, height 4, area 36 cm².” Check it.' },
        opts: [
          { ru: 'Нет: это прямоугольник, у треугольника 18 см²', uz: "Yo'q: bu to'rtburchak, uchburchakda 18 sm²", en: 'No: that is the rectangle, the triangle is 18 cm²' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет 72 см²', uz: "Yo'q, 72 sm² bo'ladi", en: 'No, it is 72 cm²' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Двойку потеряли.', uz: "To'g'ri. Ikki yo'qolgan.", en: 'Right. The two went missing.' },
        wrong: [
          null,
          { ru: 'Треугольник занимает половину прямоугольника.', uz: "Uchburchak to'rtburchakning yarmini egallaydi.", en: 'A triangle takes half the rectangle.' },
          { ru: 'Площадь не удваивают, её делят на два.', uz: "Yuza ikkilantirilmaydi, ikkiga bo'linadi.", en: 'The area is halved, not doubled.' },
        ],
      },
      {
        q: { ru: 'Лола: «У скошенного треугольника площадь больше». Проверь.', uz: "Lola: «Qiyshiq uchburchakning yuzi katta». Tekshiring.", en: 'Lola: “A leaning triangle has more area.” Check it.' },
        opts: [
          { ru: 'Нет: при том же основании и высоте площадь та же', uz: "Yo'q: asos va balandlik bir xil bo'lsa, yuza ham o'sha", en: 'No: same base and height means same area' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, она меньше', uz: "Yo'q, u kichikroq", en: 'No, it is smaller' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Вершина скользит по одной линии, высота не меняется.', uz: "To'g'ri. Uch bitta chiziq bo'ylab siljiydi, balandlik o'zgarmaydi.", en: 'Right. The apex slides along one line, the height stays.' },
        wrong: [
          null,
          { ru: 'В формуле участвуют только основание и высота.', uz: 'Formulada faqat asos va balandlik qatnashadi.', en: 'Only base and height appear in the formula.' },
          { ru: 'Площадь не меняется ни в ту, ни в другую сторону.', uz: "Yuza na u tomonga, na bu tomonga o'zgaradi.", en: 'The area does not change either way.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в двойке, и в понимании высоты.',
        uz: "Birovning yechimini tekshiring. Xato ikkida ham, balandlikni tushunishda ham bo'ladi.",
        en: 'Check someone else’s work. A mistake can be in the two and in understanding the height.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Бумага на змея', uz: "Varrakka qog'oz", en: 'Paper for the kite' },
    lead: { ru: 'Змей из двух треугольников с общим основанием 6 см.', uz: "Umumiy asosi 6 sm bo'lgan ikki uchburchakdan varrak.", en: 'A kite of two triangles sharing a 6 cm base.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Верхний треугольник: высота 4. Его площадь?', uz: 'Yuqori uchburchak: balandligi 4. Uning yuzi?', en: 'Top triangle, height 4. Its area?' },
        opts: [
          { ru: '12 см²', uz: '12 sm²', en: '12 cm²' },
          { ru: '24 см²', uz: '24 sm²', en: '24 cm²' },
          { ru: '10 см²', uz: '10 sm²', en: '10 cm²' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 6 · 4 : 2 = 12 см².', uz: "To'g'ri. 6 · 4 : 2 = 12 sm².", en: 'Right. 6 · 4 : 2 = 12 cm².' },
        wrong: [
          null,
          { ru: 'Это прямоугольник, треугольник вдвое меньше.', uz: "Bu to'rtburchak, uchburchak ikki barobar kichik.", en: 'That is the rectangle; the triangle is half.' },
          { ru: 'Это сумма, а не площадь.', uz: "Bu yig'indi, yuza emas.", en: 'That is a sum, not an area.' },
        ],
      },
      {
        q: { ru: 'Нижний треугольник: высота 2. Сколько бумаги на весь змей?', uz: "Pastki uchburchak: balandligi 2. Butun varrakka qancha qog'oz?", en: 'Bottom triangle, height 2. Paper for the whole kite?' },
        opts_i18n: [
          { ru: '18 см²', uz: '18 sm²', en: '18 cm²' },
          { ru: '12 см²', uz: '12 sm²', en: '12 cm²' },
          { ru: '30 см²', uz: '30 sm²', en: '30 cm²' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 12 + 6 = 18 см².', uz: "To'g'ri. 12 + 6 = 18 sm².", en: 'Right. 12 + 6 = 18 cm².' },
        wrong: [
          null,
          { ru: 'Нижний треугольник тоже нужно посчитать.', uz: 'Pastki uchburchakni ham hisoblash kerak.', en: 'The bottom triangle counts too.' },
          { ru: 'Про деление на два забыли в одной из частей.', uz: "Qismlardan birida ikkiga bo'lish unutilgan.", en: 'The halving was skipped in one part.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про змея. Он собран из двух треугольников с общим основанием шесть сантиметров.',
        uz: "Varrak haqida masala. U umumiy asosi olti santimetr bo'lgan ikki uchburchakdan yig'ilgan.",
        en: 'A kite problem. It is built of two triangles sharing a base of six centimetres.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 21,
        q: { ru: 'Основание 7, высота 6. Найди площадь в см².', uz: 'Asos 7, balandlik 6. Yuzani sm² da toping.', en: 'Base 7, height 6. Find the area in cm².' },
        hint: { ru: '7 · 6 = 42, дальше раздели на 2.', uz: "7 · 6 = 42, keyin 2 ga bo'ling.", en: '7 · 6 = 42, then halve.' },
        hint_audio: { ru: 'Сначала перемножьте основание и высоту, получится сорок два, а потом разделите на два.', uz: "Avval asos va balandlikni ko'paytiring, qirq ikki chiqadi, keyin ikkiga bo'ling.", en: 'First multiply base by height to get forty two, then divide by two.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Основание 12, высота 5. Площадь треугольника?', uz: 'Asos 12, balandlik 5. Uchburchak yuzi?', en: 'Base 12, height 5. Area?' },
        opts_i18n: [
          { ru: '60 см²', uz: '60 sm²', en: '60 cm²' },
          { ru: '17 см²', uz: '17 sm²', en: '17 cm²' },
          { ru: '30 см²', uz: '30 sm²', en: '30 cm²' },
          { ru: '120 см²', uz: '120 sm²', en: '120 cm²' },
        ],
        wrong: [
          { ru: 'Это прямоугольник, треугольник вдвое меньше.', uz: "Bu to'rtburchak, uchburchak ikki barobar kichik.", en: 'That is the rectangle; the triangle is half.' },
          { ru: 'Это сумма, а площадь считают умножением.', uz: "Bu yig'indi, yuza ko'paytirish bilan topiladi.", en: 'That is a sum; area comes from multiplying.' },
          null,
          { ru: 'Площадь не удваивают.', uz: 'Yuza ikkilantirilmaydi.', en: 'The area is not doubled.' },
        ],
        correct: { ru: 'Верно. 12 · 5 = 60, половина 30 см².', uz: "To'g'ri. 12 · 5 = 60, yarmi 30 sm².", en: 'Right. 12 · 5 = 60, half is 30 cm².' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Что такое высота треугольника?', uz: 'Uchburchak balandligi nima?', en: 'What is the height of a triangle?' },
        opts: [
          { ru: 'самая длинная сторона', uz: 'eng uzun tomon', en: 'the longest side' },
          { ru: 'перпендикуляр от вершины к основанию', uz: 'uchdan asosga perpendikular', en: 'the perpendicular from apex to base' },
          { ru: 'половина основания', uz: 'asosning yarmi', en: 'half the base' },
          { ru: 'любая боковая сторона', uz: 'istalgan yon tomon', en: 'any slanted side' },
        ],
        wrong: [
          { ru: 'Длина стороны и высота это разные вещи.', uz: 'Tomon uzunligi va balandlik boshqa-boshqa narsa.', en: 'A side length and a height are different.' },
          null,
          { ru: 'Половина основания в формуле не участвует.', uz: 'Asosning yarmi formulada qatnashmaydi.', en: 'Half the base is not in the formula.' },
          { ru: 'Боковая сторона наклонная, а высота нет.', uz: "Yon tomon qiya, balandlik esa yo'q.", en: 'A slanted side leans, a height does not.' },
        ],
        correct: { ru: 'Верно. Высота идёт под прямым углом к основанию.', uz: "To'g'ri. Balandlik asosga to'g'ri burchak ostida boradi.", en: 'Right. The height meets the base at a right angle.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Два треугольника с одним основанием и высотой. Их площади?', uz: 'Asosi va balandligi bir xil ikki uchburchak. Yuzalari?', en: 'Two triangles with the same base and height. Their areas?' },
        opts: [
          { ru: 'у скошенного больше', uz: "qiyshig'ida katta", en: 'the leaning one is bigger' },
          { ru: 'у прямого больше', uz: "tikida katta", en: 'the upright one is bigger' },
          { ru: 'зависит от сторон', uz: "tomonlarga bog'liq", en: 'it depends on the sides' },
          { ru: 'одинаковые', uz: 'bir xil', en: 'equal' },
        ],
        wrong: [
          { ru: 'Наклон в формулу не входит.', uz: 'Qiyalik formulaga kirmaydi.', en: 'The lean is not in the formula.' },
          { ru: 'Форма не влияет на площадь.', uz: "Shakl yuzaga ta'sir qilmaydi.", en: 'The shape does not affect the area.' },
          { ru: 'В формуле только основание и высота.', uz: 'Formulada faqat asos va balandlik bor.', en: 'Only base and height are in the formula.' },
          null,
        ],
        correct: { ru: 'Верно. Вершину можно двигать вдоль линии.', uz: "To'g'ri. Uchni chiziq bo'ylab surish mumkin.", en: 'Right. The apex may slide along the line.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Змей: треугольники 6 на 4 и 6 на 2. Сколько бумаги?', uz: "Varrak: 6 ga 4 va 6 ga 2 uchburchaklar. Qancha qog'oz?", en: 'Kite: triangles 6 by 4 and 6 by 2. How much paper?' },
        opts_i18n: [
          { ru: '18 см²', uz: '18 sm²', en: '18 cm²' },
          { ru: '36 см²', uz: '36 sm²', en: '36 cm²' },
          { ru: '12 см²', uz: '12 sm²', en: '12 cm²' },
          { ru: '9 см²', uz: '9 sm²', en: '9 cm²' },
        ],
        wrong: [
          null,
          { ru: 'Про деление на два забыли в обеих частях.', uz: "Ikkala qismda ikkiga bo'lish unutilgan.", en: 'The halving was skipped in both parts.' },
          { ru: 'Это только верхний треугольник.', uz: 'Bu faqat yuqori uchburchak.', en: 'That is only the top triangle.' },
          { ru: 'Это половина ответа.', uz: 'Bu javobning yarmi.', en: 'That is half the answer.' },
        ],
        correct: { ru: 'Верно. 12 + 6 = 18 см².', uz: "To'g'ri. 12 + 6 = 18 sm².", en: 'Right. 12 + 6 = 18 cm².' },
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
      ru: 'Для полёта важна именно площадь, а не форма. Подъёмная сила крыла растёт вместе с его площадью, поэтому у больших парящих птиц крылья широкие, а у мелких быстрых узкие. Поэтому же воздушный змей с большим парусом поднимается на слабом ветру, а маленький требует сильного.',
      uz: "Uchish uchun aynan yuza muhim, shakl emas. Qanotning ko'tarish kuchi uning yuzasi bilan birga o'sadi, shuning uchun katta suzib yuruvchi qushlarning qanoti keng, mayda tez qushlarniki esa ingichka. Shu sababdan katta yelkanli varrak kuchsiz shamolda ko'tariladi, kichigi esa kuchli shamol talab qiladi.",
      en: 'For flight it is area that matters, not shape. A wing’s lift grows with its area, which is why large soaring birds have broad wings and small fast ones narrow. For the same reason a kite with a big sail rises in a light breeze while a small one needs a strong wind.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Для полёта важна именно площадь, а не форма. Подъёмная сила крыла растёт вместе с его площадью, поэтому у больших парящих птиц крылья широкие, а у мелких быстрых узкие. Поэтому же воздушный змей с большим парусом поднимается на слабом ветру, а маленький требует сильного.',
      uz: "Bilasizmi? Uchish uchun aynan yuza muhim, shakl emas. Qanotning ko'tarish kuchi uning yuzasi bilan birga o'sadi, shuning uchun katta suzib yuruvchi qushlarning qanoti keng, mayda tez qushlarniki esa ingichka. Shu sababdan katta yelkanli varrak kuchsiz shamolda ko'tariladi, kichigi esa kuchli shamol talab qiladi.",
      en: 'Did you know? For flight it is area that matters, not shape. A wing’s lift grows with its area, which is why large soaring birds have broad wings and small fast ones narrow. For the same reason a kite with a big sail rises in a light breeze while a small one needs a strong wind.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Геометрия', uz: 'Matematika · Geometriya', en: 'Mathematics · Geometry' },
    heading: { ru: 'Площадь треугольника', uz: 'Uchburchak yuzi', en: 'Area of a triangle' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'S = a · h : 2', uz: 'S = a · h : 2', en: 'S = a · h : 2' },
    brief_2: { ru: 'высота перпендикулярна основанию', uz: 'balandlik asosga perpendikular', en: 'the height is perpendicular to the base' },
    brief_3: { ru: 'наклон площадь не меняет', uz: "qiyalik yuzani o'zgartirmaydi", en: 'the lean does not change the area' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Два треугольника', uz: 'Ikki uchburchak', en: 'Two triangles' },
    memo_a1: { ru: 'дают прямоугольник', uz: "to'rtburchak beradi", en: 'make a rectangle' },
    memo_q2: { ru: 'Составная фигура', uz: 'Murakkab shakl', en: 'A compound shape' },
    memo_a2: { ru: 'сложить части или вычесть лишнее', uz: "qismlarni qo'shish yoki ortiqchani ayirish", en: 'add parts or subtract extras' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'забыть разделить на два', uz: "ikkiga bo'lishni unutish", en: 'forgetting to halve' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Площадь треугольника равна основанию, умноженному на высоту и делённому на два, потому что два одинаковых треугольника складываются в прямоугольник. Высота идёт к основанию под прямым углом, а наклон фигуры площадь не меняет. Составные фигуры разбивают на части или обводят прямоугольником и вычитают лишнее.',
        'Змей: на оба паруса бумаги уйдёт одинаково.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Uchburchak yuzi asos karra balandlik bo'linsin ikkiga, chunki ikkita bir xil uchburchak to'rtburchakka yig'iladi. Balandlik asosga to'g'ri burchak ostida boradi, shaklning qiyaligi esa yuzani o'zgartirmaydi. Murakkab shakllar qismlarga bo'linadi yoki to'rtburchak bilan o'ralib ortiqchasi ayiriladi.",
        "Varrak: ikkala yelkanga qog'oz bir xil ketadi.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'The area of a triangle is base times height divided by two, because two identical triangles make a rectangle. The height meets the base at a right angle, and the lean does not change the area. Compound shapes are cut into parts or boxed in with the extra subtracted.',
        'The kite: both sails take the same paper.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Дострой и раздели', uz: "Usul. To'ldiring va bo'ling", en: 'Method. Complete and halve' },
    m1_steps: {
      ru: ['Выбери основание и найди высоту к нему', 'Перемножь основание и высоту', 'Раздели результат на два'],
      uz: ['Asosni tanlang va unga balandlikni toping', "Asos va balandlikni ko'paytiring", "Natijani ikkiga bo'ling"],
      en: ['Choose a base and find the height to it', 'Multiply base by height', 'Divide the result by two'],
    },
    m1_no: {
      ru: 'Наклонная боковая сторона не высота: высота идёт под прямым углом.',
      uz: "Qiya yon tomon balandlik emas: balandlik to'g'ri burchak ostida boradi.",
      en: 'A slanted side is not a height: a height meets the base at a right angle.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: кружок, делают воздушного змея из бумаги.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d43sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#DDEEF7"/><stop offset="100%" stopColor="#F9F4EB"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d43sky)"/>

    {/* Небо: облачко и готовый змей в воздухе */}
    <g opacity="0.75">
      <ellipse cx="66" cy="30" rx="24" ry="11" fill="#FFFDF7"/>
      <ellipse cx="86" cy="26" rx="16" ry="9" fill="#FFFDF7"/>
    </g>
    <g className="d43-fly">
      <path d="M0 0 L14 -18 L28 0 L14 22 z" fill="#7ECBE6" stroke="#4F9EBB" strokeWidth="1.6"/>
      <path d="M14 22 q6 12 -4 18 q10 4 4 14" fill="none" stroke="#D9603F" strokeWidth="1.4"/>
    </g>

    {/* Стол: два бумажных паруса, прямой и скошенный */}
    <rect x="0" y="118" width="400" height="36" fill="#D2A96F"/>
    <rect x="0" y="114" width="400" height="6" fill="#C9A472"/>

    {/* Оба паруса в одном масштабе: 8 единиц на сантиметр, поэтому основание
        8 см это 64 единицы, а высота 5 см — ровно 40. Раньше высота была 46,
        то есть паруса спорили с условием задачи.
        У скошенного паруса основание продлено пунктиром: высота падает ЗА
        основание, и это видно, а не сказано словами. */}
    <g>
      <path d="M118 112 L182 112 L118 72 z" fill="#E7F5FA" stroke="#019ACB" strokeWidth="2.2"/>
      <path d="M118 112 v-40" stroke="#D9603F" strokeWidth="1.8" strokeDasharray="4 3"/>
      <text x="150" y="128" textAnchor="middle" fill="#6B5A3E"
        fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700">8</text>
      <text x="108" y="94" textAnchor="middle" fill="#D9603F"
        fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700">5</text>

      <path d="M222 112 L286 112 L316 72 z" fill="#FBF3D6" stroke="#8A6A22" strokeWidth="2.2"/>
      <path d="M286 112 h34" stroke="#8A6A22" strokeWidth="1.2" strokeDasharray="4 4"/>
      <path d="M316 112 v-40" stroke="#D9603F" strokeWidth="1.8" strokeDasharray="4 3"/>
      <text x="254" y="128" textAnchor="middle" fill="#6B5A3E"
        fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700">8</text>
      <text x="330" y="94" textAnchor="middle" fill="#D9603F"
        fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700">5</text>
    </g>

    <Person x={46} ground={118} head={13} shirt="#8FBF7F" hair="#3E3128"/>
    <Person x={80} ground={118} head={13} shirt="#F5C77E" hair="#5A4636"/>
  </svg>
);

// Итог: два треугольника складываются в прямоугольник.
// ФИНАЛ — тот же стол и те же два паруса. Ответ виден предметом: у обоих
// основание 8 и высота 5, и площадь одна и та же. Наклон ничего не меняет.
const FinalScene = () => {
  const lang = useLang();
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      <g className="d43-fly-fin">
        <path d="M0 0 L9 -12 L18 0 L9 14 z" fill="#7ECBE6" stroke="#4F9EBB" strokeWidth="1.2"/>
      </g>
      <rect x="0" y="66" width="400" height="5" fill="#C9A472"/>
      <rect x="0" y="71" width="400" height="21" fill="#D2A96F"/>

      {/* те же паруса, тот же масштаб: основание 48, высота 30 */}
      <path d="M40 66 L88 66 L40 36 z" fill="#E7F5FA" stroke="#019ACB" strokeWidth="2"/>
      <path d="M40 66 v-30" stroke="#D9603F" strokeWidth="1.4" strokeDasharray="4 3"/>
      <path d="M132 66 L180 66 L204 36 z" fill="#FBF3D6" stroke="#8A6A22" strokeWidth="2"/>
      <path d="M180 66 h24" stroke="#8A6A22" strokeWidth="1" strokeDasharray="4 4"/>
      <path d="M204 66 v-30" stroke="#D9603F" strokeWidth="1.4" strokeDasharray="4 3"/>

      <text x="64" y="84" textAnchor="middle" fill="#1F7A4D"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">20</text>
      <text x="168" y="84" textAnchor="middle" fill="#1F7A4D"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">20</text>
      <text x="112" y="52" textAnchor="middle" fill="#1F7A4D"
        fontFamily="'JetBrains Mono', monospace" fontSize="15" fontWeight="700">=</text>

      <Person x={246} ground={66} head={9} shirt="#F5C77E" hair="#5A4636"/>

      <rect x="284" y="24" width="104" height="30" rx="8" fill="#E3F0E8" stroke="#1F7A4D" strokeWidth="2"/>
      <text x="336" y="44" textAnchor="middle" fill="#1F7A4D"
        fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="700">a · h : 2</text>
      <text x="336" y="84" textAnchor="middle" fill="#6B5A3E"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fontWeight="700">
        {tri(lang, 'наклон не меняет', "qiyalik o'zgartirmaydi", 'the slant changes nothing')}
      </text>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Прибор урока: треугольник на клетчатом поле, достраиваемый до прямоугольника.
const TriBox = ({ a = 8, h = 5, lean = 0, box = false, half = false, size = 'mid' }) => {
  const cell = 16; const x0 = 40; const y0 = 112;
  const bx = x0 + a * cell;
  const ax = x0 + lean * cell;
  return (
    <span className={'d43-box d43-box-' + size}>
      <svg viewBox="0 0 300 150" aria-hidden="true">
        <g opacity="0.5">
          {Array.from({ length: 14 }, (_, i) => (
            <path key={'v' + i} d={`M${x0 + i * cell} 24 v${y0 - 24}`} stroke="#E3DCCE" strokeWidth="1"/>
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <path key={'h' + i} d={`M${x0} ${y0 - i * cell} h${13 * cell}`} stroke="#E3DCCE" strokeWidth="1"/>
          ))}
        </g>
        {box && (
          <rect x={x0} y={y0 - h * cell} width={a * cell} height={h * cell}
            fill="#E3F0E8" opacity="0.5" stroke="#1F7A4D" strokeWidth="1.8" strokeDasharray="5 4"/>
        )}
        {half && (
          <path d={`M${x0} ${y0 - h * cell} L${bx} ${y0 - h * cell} L${bx} ${y0} z`}
            fill="#FBF3D6" opacity="0.7" stroke="#8A6A22" strokeWidth="1.6"/>
        )}
        <path d={`M${x0} ${y0} L${bx} ${y0} L${ax} ${y0 - h * cell} z`}
          fill="#E7F5FA" stroke="#019ACB" strokeWidth="2.6"/>
        <path d={`M${ax} ${y0} L${ax} ${y0 - h * cell}`} stroke="#D9603F" strokeWidth="2" strokeDasharray="4 3"/>
        <text x={(x0 + bx) / 2} y={y0 + 16} textAnchor="middle" fill="#8A8883"
          fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">{a}</text>
        <text x={ax + 8} y={y0 - h * cell / 2} fill="#D9603F"
          fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">{h}</text>
      </svg>
    </span>
  );
};

// Составная фигура: змей из двух треугольников.
const Kite = ({ show = 0 }) => (
  <span className="d43-kite-box">
    <svg viewBox="0 0 240 140" aria-hidden="true">
      <path d="M40 76 L160 76 L100 28 z" fill={show >= 1 ? '#A9CFBA' : '#E7F5FA'}
        stroke="#1F7A4D" strokeWidth="2.2"/>
      <path d="M40 76 L160 76 L100 100 z" fill={show >= 2 ? '#FBF3D6' : '#F4F1EA'}
        stroke="#8A6A22" strokeWidth="2.2"/>
      <path d="M100 28 v72" stroke="#D9603F" strokeWidth="1.6" strokeDasharray="4 3"/>
      <text x="100" y="122" textAnchor="middle" fill="#8A8883"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">6</text>
      <text x="188" y="52" fill="#1F7A4D" fontFamily="'JetBrains Mono', monospace"
        fontSize="12" fontWeight="700">{show >= 1 ? '12' : '4'}</text>
      <text x="188" y="96" fill="#8A6A22" fontFamily="'JetBrains Mono', monospace"
        fontSize="12" fontWeight="700">{show >= 2 ? '6' : '2'}</text>
    </svg>
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d43-line d43-fade' + (on ? ' d43-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d43-stage">
        <span className="d43-rect">
          <svg viewBox="0 0 220 110" aria-hidden="true">
            <g opacity="0.5">
              {Array.from({ length: 9 }, (_, i) => (
                <path key={'v' + i} d={`M${20 + i * 20} 18 v80`} stroke="#E3DCCE" strokeWidth="1"/>
              ))}
              {Array.from({ length: 6 }, (_, i) => (
                <path key={'h' + i} d={`M20 ${18 + i * 16} h160`} stroke="#E3DCCE" strokeWidth="1"/>
              ))}
            </g>
            <rect x="20" y="18" width="160" height="80" fill="#E3F0E8" opacity="0.65" stroke="#1F7A4D" strokeWidth="2.2"/>
            <text x="100" y="64" textAnchor="middle" fill="#1F7A4D"
              fontFamily="'JetBrains Mono', monospace" fontSize="15" fontWeight="700">8 · 5 = 40</text>
          </svg>
        </span>
        <span className={'d43-chips d43-fade' + (step >= 1 ? ' d43-on' : '')}>
          <i className="d43-chip-g">{tri(lang, 'площадь прямоугольника', "to'rtburchak yuzi", 'area of a rectangle')}</i>
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

// Ядро: достраиваем до прямоугольника.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d43-stage d43-stage-row">
        <TriBox size="sm" a={8} h={5} lean={0} half={step >= 1} box={step >= 1}/>
        <span className="d43-col">
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

// Наклон не важен.
const LeanBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_lean;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d43-stage d43-stage-row">
        <TriBox size="sm" a={8} h={5} lean={step >= 1 ? 8 : 3} box/>
        <span className="d43-col">
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
      <div className="frame fade-up delay-1 d43-stage d43-stage-row">
        <Kite show={step}/>
        <span className="d43-col">
          {c.steps.map((s, i) => <Line key={i} node={t(s)} on={step >= i}/>)}
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

// Граница: двойка и высота.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d43-stage">
        <span className="d43-pair d43-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d43-pair d43-pair-good d43-fade' + (step >= 1 ? ' d43-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d43-pair d43-pair-warn d43-fade' + (step >= 2 ? ' d43-on' : '')}>
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
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <div className={'d43-banner fade-up delay-1' + (phase === 'play' ? ' d43-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d43-stage d43-stage-tool d43-stage-row">
          {phase === 'demo' ? (
            <>
              <TriBox size="xs" a={8} h={5} lean={2} box={shown >= 1} half={shown >= 1}/>
              <span className="d43-col">
                {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
                <p className={'body d43-verdict' + (done ? ' d43-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
              </span>
            </>
          ) : (
            <span className="d43-col">
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
          <div className="d43-acts fade-up">
            <button className="d43-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d43-btn d43-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenLean = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_lean} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <LeanBody step={step}/>}/>
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
      <div className="d43-stage">
        <TriBox size="xs" a={8} h={5} lean={0} box half/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenArea = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_area} asideNode={methodAside}/>
);
const ScreenComp = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_comp} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: змей по частям.
const TaskFig = ({ idx }) => (
  <div className="d43-task-fig">
    <Kite show={idx >= 1 ? 2 : 1}/>
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
.d43-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d43-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d43-stage-tool .d43-line { font-size: clamp(12px, 2vw, 16px); }
.d43-stage-row { flex-direction: row; align-items: center; justify-content: center; gap: clamp(10px, 2.4vw, 22px); flex-wrap: wrap; }
.d43-col { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.1vw, 9px); flex: 1 1 200px; min-width: 0; }

/* Треугольник на клетчатом поле */
.d43-box { display: block; width: 100%; max-width: 280px; }
.d43-box-sm { max-width: 240px; }
.d43-box-xs { max-width: 196px; }
.d43-box svg { width: 100%; height: auto; display: block; }
.d43-kite-box { display: block; width: 100%; max-width: 230px; }
.d43-kite-box svg { width: 100%; height: auto; display: block; }
.d43-rect { display: block; width: 100%; max-width: 220px; }
.d43-rect svg { width: 100%; height: auto; display: block; }

.d43-fade { opacity: 0; transition: opacity 420ms linear; }
.d43-on { opacity: 1; }
.d43-line { font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 16px); font-weight: 700; color: #494550; text-align: center; }

/* Подписи */
.d43-chips { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d43-chips i { font-style: normal; padding: 5px 12px; border-radius: 10px; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 15px); font-weight: 700; }
.d43-chip-g { background: #E3F0E8; border: 1px solid #A9CFBA; color: #1F7A4D; }

/* Строки экрана границы */
.d43-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d43-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d43-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d43-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d43-task-fig { display: flex; justify-content: center; width: 100%; }

/* Экран 4 */
.d43-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d43-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d43-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d43-verdict-on { opacity: 1; }
.d43-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d43-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d43-btn:disabled { opacity: 0.45; cursor: default; }
.d43-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d43-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: змей качается в небе */
/* Змей в небе — фоновая жизнь: качается медленно и мелко, крупного движения на
   сцене нет. Перенос внутри keyframes, поэтому transform-origin не задаём. */
.d43-fly { animation: d43Fly 7600ms ease-in-out infinite; }
@keyframes d43Fly {
  0%, 100% { transform: translate(304px, 42px) rotate(-6deg); }
  50% { transform: translate(316px, 34px) rotate(6deg); }
}
.d43-fly-fin { animation: d43FlyFin 8200ms ease-in-out infinite; }
@keyframes d43FlyFin {
  0%, 100% { transform: translate(300px, 24px) rotate(-6deg); }
  50% { transform: translate(310px, 18px) rotate(6deg); }
}
@media (prefers-reduced-motion: reduce) {
  .d43-fly { animation: none; transform: translate(310px, 38px); }
  .d43-fly-fin { animation: none; transform: translate(305px, 21px); }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function TriangleAreaLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenLean, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenArea, ScreenComp, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
