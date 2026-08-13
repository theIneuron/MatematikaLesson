import React from 'react';
import { AncientHallBg, BitSVG, HALL_SLAB, LUMO_CAST, createLesson, useLang, tri } from './_kit/index.jsx';
import { LESSON_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars41 — "Fazoviy shakllar: piramida va konus" (num-3-41)
// Б5 «KRISTALL ARXITEKTURA» — blokning YAKUNI
// Syujet: kristall kvartal tugaydi (SYUJET_3SINF.md 194-satr, reja 45-satr).
// SAHNA: 8-DARS zali kitdan, markazda darsning tuguni — kristall modellar.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, 188-190-bet).
// YADRO: fazoviy shaklning BALANDLIGI bor, u varaqqa sig'maydi. Piramidaning asosi
//   ko'pburchak va hamma yon yog'i bitta uchda uchrashadi; konusning asosi doira,
//   yon sirti esa silliq.
// Misconception: M1 uchburchak va piramidani bir xil deb bilish; M2 konusni silindr bilan
//   chalkashtirish; M3 faqat ko'rinadigan yoqlarni sanash; M4 «piramida har doim
//   to'rtburchak asosli».
// FactCard: konus tekis yotqizilsa aylana bo'ylab dumalaydi, silindr esa to'g'ri chiziq
//   bo'ylab — shuning uchun yo'l g'altaklari konus shaklida bo'ladi.
// Bu dars MA'LUMOT fayli: ekranlar va mexanika kitda (`createLesson`).
// ============================================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'grade3-41',
  lessonTitle: { ru: 'Урок 41. Пространственные фигуры: пирамида и конус', uz: '41-dars. Fazoviy shakllar: piramida va konus', en: 'Lesson 41. Solid figures: the pyramid and the cone' }
};
// STRUKTURA: s0 xuk model va chizma · s1 piramida tuzilishi · s2 konus tuzilishi ·
// s3 QOIDA asos va uch · s4 chizma bo'yicha shakl · s5 saralash tekis yoki fazoviy ·
// s6 test konus yoki silindr · s7 konsol yoqlar va uchlar · s8 xatoni top (ko'rinadigan
// yoqlar) · s9 Bit tuzog'i (piramida faqat to'rtburchak asosli) · s10 trenajyor yoqlar ·
// s11 trenajyor uchlar · s12 masala karkas · s13 final + FactCard · s14 blok yakuni.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's5',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's12', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's13', type: 'test',        template: 'custom',   scored: true,  scope: 'diagnostic' },
  { id: 's14', type: 'summary',     template: 'custom',   scored: false, scope: null }
];

const CONTENT = {
  // s0 — XUK: chizma va model.
  s0: {
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish', en: 'Hook' },
    topic: { ru: 'Пирамида и конус', uz: 'Piramida va konus', en: 'The pyramid and the cone' },
    lead: { ru: 'На столе модель, на листе чертёж', uz: 'Stolda model, varaqda chizma', en: 'A model on the table, a drawing on the sheet' },
    order_cap: { ru: 'чем модель отличается от рисунка', uz: 'model rasmdan nimasi bilan farq qiladi', en: 'how a model differs from a picture' },
    plate: ['5', '◺', '5'],
    q: { ru: 'Чем модель отличается от плоской фигуры?', uz: "Model tekis shakldan nimasi bilan farq qiladi?", en: 'How does a model differ from a flat figure?' },
    opt0: { ru: 'у неё есть высота', uz: 'unda balandlik bor', en: 'it has height' },
    opt1: { ru: 'она больше', uz: 'u kattaroq', en: 'it is bigger' },
    opt2: { ru: 'у неё больше сторон', uz: 'unda tomon ko\'p', en: 'it has more sides' },
    opt3: { ru: 'она тяжелее', uz: 'u og\'irroq', en: 'it is heavier' },
    audio: {
      intro: {
        ru: [
          'Мы разобрали фигуры на листе. Осталось выйти с листа.',
          'На столе стоит модель, а рядом её чертёж на бумаге.',
          'Чертёж можно накрыть ладонью, а модель нет.',
          'Как думаешь, чем модель отличается от плоской фигуры?'
        ],
        uz: [
          "Varaqdagi shakllarni ko'rib chiqdik. Endi varaqdan chiqish qoldi.",
          "Stolda model turibdi, yonida esa uning qog'ozdagi chizmasi.",
          "Chizmani kaft bilan yopish mumkin, modelni esa yo'q.",
          "Sizningcha, model tekis shakldan nimasi bilan farq qiladi?"
        ],
        en: ['We have sorted out the figures on a sheet. All that is left is to leave the sheet.', 'A model stands on the table, and beside it its drawing on paper.', 'The drawing can be covered with your palm, the model cannot.', 'How do you think a model differs from a flat figure?']
      },
      on_correct: { ru: 'Верно! У модели есть высота, поэтому она не ложится на лист. Такие фигуры называют пространственными.', uz: "To'g'ri! Modelda balandlik bor, shuning uchun u varaqqa yotmaydi. Bunday shakllar fazoviy deyiladi.", en: 'Right! A model has height, so it does not lie flat on a sheet. Such figures are called solid figures.' },
      on_wrong1: { ru: 'Размер тут ни при чём. Большой квадрат всё равно останется плоским.', uz: "O'lcham bu yerda hech nima. Katta kvadrat baribir tekisligicha qoladi.", en: 'Size has nothing to do with it. A big square will still stay flat.' },
      on_wrong2: { ru: 'Сторон может быть и меньше. Дело в высоте.', uz: "Tomon kamroq ham bo'lishi mumkin. Gap balandlikda.", en: 'There can be fewer sides. It is about height.' },
      on_idk: { ru: 'Ничего. Сейчас рассмотрим модели поближе.', uz: "Hechqisi yo'q. Hozir modellarni yaqindan ko'ramiz.", en: 'Never mind. Let us look at the models more closely.' }
    }
  },

  // s1 — MODEL: piramida tuzilishi.
  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    lead: { ru: 'Разбираем пирамиду', uz: 'Piramidani ko\'rib chiqamiz', en: 'Taking the pyramid apart' },
    task_line: 'основание и боковые грани',
    task_line_uz: "asos va yon yoqlar",
    task_line_en: 'the base and the side faces',
    step1: { ru: 'основание — многоугольник', uz: "asos — ko'pburchak", en: 'the base — a polygon' },
    step1_cap: { ru: 'снизу лежит плоская фигура', uz: 'pastda tekis shakl yotadi', en: 'a flat figure lies at the bottom' },
    step2: { ru: 'грани сходятся в вершине', uz: 'yoqlar uchda tutashadi', en: 'the faces meet at a vertex' },
    step2_cap: { ru: 'все боковые встречаются в одной точке', uz: 'hamma yon yoq bitta nuqtada uchrashadi', en: 'all the side faces meet at one point' },
    res: { ru: 'основание + вершина', uz: 'asos + uch', en: 'base + vertex' },
    btn1: { ru: 'Посмотреть основание', uz: 'Asosga qarash', en: 'Look at the base' },
    btn2: { ru: 'Посмотреть боковые грани', uz: 'Yon yoqlarga qarash', en: 'Look at the side faces' },
    done_text: { ru: 'У пирамиды снизу многоугольник, а все боковые грани сходятся в одной вершине.', uz: "Piramidaning pastida ko'pburchak, hamma yon yog'i esa bitta uchda uchrashadi.", en: 'A pyramid has a polygon at the bottom, and all its side faces meet at one vertex.' },
    audio: {
      ru: [
        'Возьмём пирамиду и разберём её по частям.',
        'Внизу лежит плоская фигура, многоугольник. Её называют основанием.',
        'От каждой стороны основания вверх идёт треугольная грань, и все они встречаются в одной точке. Эта точка и есть вершина пирамиды.'
      ],
      uz: [
        "Piramidani olib, qismlarga ajratamiz.",
        "Pastda tekis shakl, ko'pburchak yotadi. Uni asos deyishadi.",
        "Asosning har bir tomonidan yuqoriga uchburchak yoq ketadi va ularning hammasi bitta nuqtada uchrashadi. Bu nuqta piramidaning uchi."
      ],
      en: ['Let us take a pyramid and go through its parts.', 'A flat figure lies at the bottom, a polygon. It is called the base.', 'From each side of the base a triangular face goes up, and they all meet at one point. That point is the vertex of the pyramid.']
    }
  },

  // s2 — MODEL: konus tuzilishi.
  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    w: 4,
    h: 4,
    lead: { ru: 'Теперь конус', uz: 'Endi konus', en: 'Now the cone' },
    capA: { ru: 'основание — круг', uz: 'asos — doira', en: 'the base — a circle' },
    capB: { ru: 'боковая поверхность гладкая', uz: 'yon sirti silliq', en: 'the side surface is smooth' },
    res: { ru: 'круг и одна вершина', uz: 'doira va bitta uch', en: 'a circle and one vertex' },
    btn1: { ru: 'Посмотреть основание', uz: 'Asosga qarash', en: 'Look at the base' },
    btn2: { ru: 'Провести рукой по боку', uz: "Yon tomonini qo'l bilan silash", en: 'Run your hand along the side' },
    done_text: { ru: 'У конуса основание круглое, боковая поверхность гладкая, а сверху одна вершина.', uz: "Konusning asosi dumaloq, yon sirti silliq, tepasida esa bitta uch.", en: 'A cone has a round base, a smooth side surface and one vertex on top.' },
    audio: {
      ru: [
        'Теперь возьмём конус.',
        'Внизу у него круг. Углов у круга нет, значит и рёбер по бокам не будет.',
        'Боковая поверхность у конуса гладкая, без граней, и она сходится в одну вершину. Этим конус и отличается от пирамиды.'
      ],
      uz: [
        "Endi konusni olamiz.",
        "Uning pastida doira bor. Doirada burchak yo'q, demak yon tomonlarida qirra ham bo'lmaydi.",
        "Konusning yon sirti silliq, yoqsiz, va u bitta uchda tutashadi. Konus piramidadan shu bilan farq qiladi."
      ],
      en: ['Now let us take a cone.', 'It has a circle at the bottom. A circle has no angles, so there will be no edges at the sides.', 'The side surface of a cone is smooth, with no faces, and it comes together at one vertex. That is what makes a cone different from a pyramid.']
    }
  },

  // s3 — QOIDA: asosga qarab nomlanadi.
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    q: { ru: 'В основании пирамиды треугольник. Как её назвать?', uz: "Piramidaning asosida uchburchak. Uni qanday atash kerak?", en: 'A pyramid has a triangle at its base. What do we call it?' },
    opts: [
      { ru: 'треугольная пирамида', uz: 'uchburchak asosli piramida', en: 'a triangular pyramid' },
      { ru: 'просто треугольник', uz: 'shunchaki uchburchak', en: 'simply a triangle' },
      { ru: 'четырёхугольная пирамида', uz: "to'rtburchak asosli piramida", en: 'a quadrangular pyramid' },
      { ru: 'конус', uz: 'konus', en: 'a cone' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Треугольник плоский, его можно накрыть ладонью. Пирамида нет.', uz: "Uchburchak tekis, uni kaft bilan yopsa bo'ladi. Piramidani esa yo'q.", en: 'A triangle is flat, you can cover it with your palm. A pyramid you cannot.' },
      2: { ru: 'Четырёхугольной её назовут, если внизу будет четырёхугольник.', uz: "Pastida to'rtburchak bo'lsa, uni to'rtburchak asosli deyishadi.", en: 'It is called quadrangular if there is a quadrilateral at the bottom.' },
      3: { ru: 'У конуса основание круглое, а тут треугольник.', uz: "Konusning asosi dumaloq, bu yerda esa uchburchak.", en: 'A cone has a round base, and here there is a triangle.' }
    },
    on_correct: { ru: 'Верно. Пирамиду называют по её основанию.', uz: "To'g'ri. Piramida asosiga qarab ataladi.", en: 'Right. A pyramid is named by its base.' },
    rule_lines: {
      ru: ['пирамида: основание многоугольник, грани в одной вершине', 'конус: основание круг, бок гладкий', 'название даёт основание'],
      uz: ["piramida: asosi ko'pburchak, yoqlari bitta uchda", "konus: asosi doira, yoni silliq", "nomni asos beradi"],
      en: ['pyramid: a polygon base, faces at one vertex', 'cone: a circle base, a smooth side', 'the base gives the name']
    },
    rule_ex: { ru: 'треугольная, четырёхугольная пирамида', uz: "uchburchakli, to'rtburchakli piramida", en: 'triangular, quadrangular pyramid' },
    rule_speech: { ru: 'У пирамиды в основании многоугольник, а боковые грани сходятся в одной вершине. Называют пирамиду по основанию. Если внизу треугольник, она треугольная, если четырёхугольник, то четырёхугольная. У конуса основание круглое, а бок гладкий.', uz: "Piramidaning asosida ko'pburchak, yon yoqlari esa bitta uchda uchrashadi. Piramida asosiga qarab ataladi. Pastida uchburchak bo'lsa, u uchburchak asosli, to'rtburchak bo'lsa, to'rtburchak asosli. Konusning asosi dumaloq, yoni silliq.", en: 'A pyramid has a polygon at its base, and its side faces meet at one vertex. A pyramid is named by its base. If there is a triangle at the bottom, it is triangular, if a quadrilateral, then quadrangular. A cone has a round base and a smooth side.' },
    audio: {
      intro: { ru: 'Соберём правило. Мы посмотрели пирамиду и конус.', uz: "Qoidani yig'amiz. Piramida va konusni ko'rdik.", en: 'Let us gather the rule. We have looked at the pyramid and the cone.' }
    }
  },

  // s4 — CHIZMA: shaklni tanish (o'z chizmasi).
  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma', en: 'The drawing' },
    q: { ru: 'Какая это фигура?', uz: 'Bu qanday shakl?', en: 'What figure is this?' },
    fig_w: 4,
    fig_h: 4,
    opts: [
      { ru: 'четырёхугольная пирамида', uz: "to'rtburchak asosli piramida", en: 'a quadrangular pyramid' },
      { ru: 'треугольная пирамида', uz: 'uchburchak asosli piramida', en: 'a triangular pyramid' },
      { ru: 'конус', uz: 'konus', en: 'a cone' },
      { ru: 'треугольник', uz: 'uchburchak', en: 'a triangle' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Посчитай стороны основания, их четыре.', uz: "Asos tomonlarini sanang, ular to'rtta.", en: 'Count the sides of the base, there are four.' },
      2: { ru: 'У конуса основание круглое, а тут углы.', uz: "Konusning asosi dumaloq, bu yerda esa burchaklar.", en: 'A cone has a round base, and here there are angles.' },
      3: { ru: 'Треугольник плоский, а у этой фигуры есть высота.', uz: "Uchburchak tekis, bu shaklda esa balandlik bor.", en: 'A triangle is flat, and this figure has height.' }
    },
    audio: {
      intro: { ru: 'Посмотри на чертёж. Основание нарисовано пунктиром, потому что его не видно. Какая это фигура?', uz: "Chizmaga qarang. Asos ko'rinmagani uchun uzuq chiziq bilan chizilgan. Bu qanday shakl?", en: 'Look at the drawing. The base is drawn with a dotted line because it cannot be seen. What figure is this?' },
      on_correct: { ru: 'Верно. В основании четырёхугольник.', uz: "To'g'ri. Asosida to'rtburchak bor.", en: 'Right. There is a quadrilateral at the base.' },
      on_wrong: { ru: 'Считай стороны основания, они и дают название.', uz: "Asos tomonlarini sanang, nomni ular beradi.", en: 'Count the sides of the base, they give the name.' }
    }
  },

  // s5 — SARALASH: tekis yoki fazoviy.
  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash', en: 'Sorting' },
    lead: { ru: 'Разложи фигуры', uz: 'Shakllarni ajrating', en: 'Sort the figures' },
    bin_a: { ru: 'плоские', uz: 'tekis', en: 'flat' },
    bin_b: { ru: 'пространственные', uz: 'fazoviy', en: 'solid' },
    items: [
      { n: { ru: 'квадрат', uz: 'kvadrat', en: 'a square' }, a: true, hint: { ru: 'Квадрат целиком ложится на лист.', uz: "Kvadrat butunlay varaqqa yotadi.", en: 'A square lies wholly on a sheet.' } },
      { n: { ru: 'пирамида', uz: 'piramida', en: 'a pyramid' }, a: false, hint: { ru: 'У пирамиды есть высота.', uz: "Piramidada balandlik bor.", en: 'A pyramid has height.' } },
      { n: { ru: 'круг', uz: 'doira', en: 'a circle' }, a: true, hint: { ru: 'Круг плоский, это не шар.', uz: "Doira tekis, bu shar emas.", en: 'A circle is flat, it is not a ball.' } },
      { n: { ru: 'конус', uz: 'konus', en: 'a cone' }, a: false, hint: { ru: 'Конус стоит на столе и имеет высоту.', uz: "Konus stolda turadi va balandligi bor.", en: 'A cone stands on the table and has height.' } }
    ],
    audio: {
      intro: { ru: 'Четыре фигуры. Отправь каждую в свою корзину.', uz: "To'rtta shakl. Har birini o'z savatiga yuboring.", en: 'Four figures. Send each one to its basket.' },
      on_correct: { ru: 'Всё на месте. Плоская фигура ложится на лист, у пространственной есть высота.', uz: "Hammasi joyida. Tekis shakl varaqqa yotadi, fazoviyda esa balandlik bor.", en: 'All in place. A flat figure lies on a sheet, a solid one has height.' },
      on_wrong: { ru: 'Спроси себя, ляжет ли эта фигура на лист целиком.', uz: "O'zingizdan so'rang, bu shakl varaqqa butunlay yotadimi.", en: 'Ask yourself whether this figure will lie wholly on a sheet.' }
    }
  },

  // s6 — TEST: konus yoki silindr (M2).
  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv', en: 'Checking' },
    q: { ru: 'У фигуры два круглых основания и нет вершины. Что это?', uz: "Shaklning ikkita dumaloq asosi bor va uchi yo'q. Bu nima?", en: 'A figure has two round bases and no vertex. What is it?' },
    opts: [
      { ru: 'цилиндр', uz: 'silindr', en: 'a cylinder' },
      { ru: 'конус', uz: 'konus', en: 'a cone' },
      { ru: 'пирамида', uz: 'piramida', en: 'a pyramid' },
      { ru: 'круг', uz: 'doira', en: 'a circle' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'У конуса основание одно, а сверху вершина.', uz: "Konusning asosi bitta, tepasida esa uch bor.", en: 'A cone has one base and a vertex on top.' },
      2: { ru: 'У пирамиды основание с углами, а не круг.', uz: "Piramidaning asosi burchakli, doira emas.", en: 'A pyramid has a base with angles, not a circle.' },
      3: { ru: 'Круг плоский, у него вообще нет высоты.', uz: "Doira tekis, unda umuman balandlik yo'q.", en: 'A circle is flat, it has no height at all.' }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. У фигуры два круглых основания и нет вершины. Что это?', uz: "Tez savol. Shaklning ikkita dumaloq asosi bor va uchi yo'q. Bu nima?", en: 'A quick question. A figure has two round bases and no vertex. What is it?' },
      on_correct: { ru: 'Верно. Это цилиндр. Конус от него отличается вершиной.', uz: "To'g'ri. Bu silindr. Konus undan uchi bilan farq qiladi.", en: 'Right. It is a cylinder. A cone differs from it by its vertex.' },
      on_wrong: { ru: 'Считай основания и ищи вершину.', uz: "Asoslarni sanang va uchni qidiring.", en: 'Count the bases and look for a vertex.' }
    }
  },

  // s7 — KONSOL: yoqlar va uchlar.
  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol', en: 'Console' },
    lead: { ru: 'Считаем части четырёхугольной пирамиды', uz: "To'rtburchak asosli piramida qismlarini sanaymiz", en: 'Counting the parts of a quadrangular pyramid' },
    swap_line: { ru: 'пирамида с квадратным основанием', uz: 'asosi kvadrat piramida', en: 'a pyramid with a square base' },
    cells: [
      { head: { ru: 'боковых граней', uz: 'yon yoq', en: 'side faces' }, label: { ru: 'штук', uz: 'dona', en: 'pieces' }, ans: 4, hint: { ru: 'От каждой стороны основания идёт грань.', uz: "Asosning har bir tomonidan yoq ketadi.", en: 'A face goes up from each side of the base.' } },
      { head: { ru: 'всего граней', uz: 'jami yoq', en: 'faces in all' }, label: { ru: 'с основанием', uz: 'asosi bilan', en: 'with the base' }, ans: 5, hint: { ru: 'К боковым добавь основание.', uz: "Yon yoqlarga asosni qo'shing.", en: 'Add the base to the side faces.' } },
      { head: { ru: 'вершин', uz: 'uch', en: 'vertices' }, label: { ru: 'штук', uz: 'dona', en: 'pieces' }, ans: 5, hint: { ru: 'Четыре внизу и одна наверху.', uz: "Pastda to'rtta, tepada bitta.", en: 'Four at the bottom and one on top.' } }
    ],
    check: { ru: '4 боковых, 5 граней, 5 вершин', uz: '4 yon, 5 yoq, 5 uch', en: '4 side faces, 5 faces, 5 vertices' },
    check_label: { ru: 'основание тоже грань', uz: 'asos ham yoq', en: 'the base is a face too' },
    audio: {
      intro: { ru: 'Заполни три окна. Боковые грани, все грани и вершины пирамиды.', uz: "Uchta oynani to'ldiring. Piramidaning yon yoqlari, hamma yoqlari va uchlari.", en: 'Fill three windows. The side faces, all the faces and the vertices of the pyramid.' },
      on_correct: { ru: 'Четыре боковые грани, всего пять, и пять вершин. Основание тоже считается гранью.', uz: "To'rtta yon yoq, jami beshta, va beshta uch. Asos ham yoq hisoblanadi.", en: 'Four side faces, five in all, and five vertices. The base counts as a face too.' }
    }
  },

  // s8 — XATONI TOP: faqat ko'rinadigan yoqlar (M3).
  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    q: { ru: 'У четырёхугольной пирамиды насчитали 3 грани. Где ошибка?', uz: "To'rtburchak asosli piramidada 3 ta yoq sanalibdi. Xato qayerda?", en: 'A quadrangular pyramid was counted as having 3 faces. Where is the mistake?' },
    fig_line: { ru: 'считали только видимые', uz: "faqat ko'rinadiganini sanashdi", en: 'only the visible ones were counted' },
    opts: [
      { ru: 'не сосчитали скрытые грани', uz: 'yashiringan yoqlar sanalmagan', en: 'the hidden faces were not counted' },
      { ru: 'ошибки нет', uz: "xato yo'q", en: 'there is no mistake' },
      { ru: 'основание не грань', uz: 'asos yoq emas', en: 'the base is not a face' },
      { ru: 'граней всегда четыре', uz: "yoq har doim to'rtta", en: 'there are always four faces' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'На чертеже видно не всё. Задняя грань и основание тоже есть.', uz: "Chizmada hammasi ko'rinmaydi. Orqa yoq va asos ham bor.", en: 'Not everything is visible on a drawing. The back face and the base are there too.' },
      2: { ru: 'Основание считается гранью, это плоская часть фигуры.', uz: "Asos yoq hisoblanadi, bu shaklning tekis qismi.", en: 'The base counts as a face, it is a flat part of the figure.' },
      3: { ru: 'Число граней зависит от основания, оно не всегда четыре.', uz: "Yoq soni asosga bog'liq, u har doim to'rtta emas.", en: 'The number of faces depends on the base, it is not always four.' }
    },
    audio: {
      intro: { ru: 'Кто-то посчитал грани по рисунку и получил три. Найди ошибку.', uz: "Kimdir rasmga qarab yoqlarni sanab, uchta olibdi. Xatoni toping.", en: 'Someone counted the faces from the picture and got three. Find the mistake.' },
      on_correct: { ru: 'Верно. Часть граней на чертеже не видна, но они есть. Всего у такой пирамиды пять граней.', uz: "To'g'ri. Yoqlarning bir qismi chizmada ko'rinmaydi, lekin ular bor. Bunday piramidada jami beshta yoq.", en: 'Right. Some faces cannot be seen on the drawing, but they are there. Such a pyramid has five faces in all.' },
      on_wrong: { ru: 'Поверни фигуру мысленно и посчитай все грани, включая нижнюю.', uz: "Shaklni xayolan buring va pastkisi bilan birga hamma yoqni sanang.", en: 'Turn the figure in your mind and count all the faces, including the bottom one.' }
    }
  },

  // s9 — BIT TUZOG'I: piramida faqat to'rtburchak asosli (M4).
  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i", en: "Bit's trap" },
    lead: { ru: 'Бит разбирает модели кристаллов', uz: 'Bit kristall modellarini ajratyapti', en: 'Bit is sorting out crystal models' },
    lines: ['в основании модели треугольник', 'Бит: значит это не пирамида'],
    lines_uz: ["model asosida uchburchak", "Bit: demak bu piramida emas"],
    lines_en: ['the model has a triangle at its base', 'Bit: so it is not a pyramid'],
    line_cap: { ru: 'Бит: пирамида бывает только с квадратом внизу', uz: "Bit: piramida faqat pastida kvadrat bilan bo'ladi", en: 'Bit: a pyramid only comes with a square at the bottom' },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?', en: 'Is that so?' },
    trap_opts: { ru: ['нет, основанием может быть любой многоугольник', 'да, внизу всегда квадрат'], uz: ["yo'q, asos har qanday ko'pburchak bo'lishi mumkin", 'ha, pastda har doim kvadrat'], en: ['no, the base can be any polygon', 'yes, there is always a square at the bottom'] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Основанием пирамиды бывает любой многоугольник. Если внизу треугольник, пирамиду называют треугольной, и граней у неё четыре, а не пять.', uz: "Ha. Piramidaning asosi har qanday ko'pburchak bo'lishi mumkin. Pastida uchburchak bo'lsa, piramida uchburchak asosli deyiladi va unda beshta emas, to'rtta yoq bo'ladi.", en: 'Yes. The base of a pyramid can be any polygon. If there is a triangle at the bottom, the pyramid is called triangular, and it has four faces, not five.' },
    trap_wrong: { ru: 'Посмотри на модель с треугольником внизу. Боковые грани всё так же сходятся в одной вершине, значит это пирамида.', uz: "Pastida uchburchak bo'lgan modelga qarang. Yon yoqlar o'shanday bitta uchda uchrashadi, demak bu piramida.", en: 'Look at the model with a triangle at the bottom. The side faces still meet at one vertex, so it is a pyramid.' },
    audio: {
      ru: [
        'Бит разбирает модели кристаллов.',
        'У этой модели внизу треугольник. Значит пирамидой её звать нельзя, у пирамиды внизу квадрат.',
        'Так ли это?'
      ],
      uz: [
        "Bit kristall modellarini ajratyapti.",
        "Bu modelning pastida uchburchak. Demak uni piramida deb bo'lmaydi, piramidaning pastida kvadrat bo'ladi.",
        "Shundaymi?"
      ],
      en: ['Bit is sorting out crystal models.', 'This model has a triangle at the bottom. So it cannot be called a pyramid, a pyramid has a square at the bottom.', 'Is that so?']
    }
  },

  // s10 — TRENAJYOR: yoqlar soni.
  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Сколько всего граней у треугольной пирамиды?', uz: "Uchburchak asosli piramidada jami nechta yoq bor?", en: 'How many faces does a triangular pyramid have in all?' },
    ans: 4,
    check: '3 + 1',
    check_label: { ru: 'боковые и основание', uz: 'yon yoqlar va asos', en: 'the side faces and the base' },
    hint: { ru: 'Три боковые грани и основание.', uz: "Uchta yon yoq va asos.", en: 'Three side faces and the base.' },
    audio: {
      intro: { ru: 'Теперь считай сам. Сколько всего граней у треугольной пирамиды?', uz: "Endi o'zingiz hisoblang. Uchburchak asosli piramidada jami nechta yoq bor?", en: 'Now count on your own. How many faces does a triangular pyramid have in all?' },
      on_correct: { ru: 'Четыре. Три боковые и основание.', uz: "To'rtta. Uchta yon yoq va asos.", en: 'Four. Three side ones and the base.' }
    }
  },

  // s11 — TRENAJYOR: uchlar soni.
  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Сколько вершин у треугольной пирамиды?', uz: "Uchburchak asosli piramidada nechta uch bor?", en: 'How many vertices does a triangular pyramid have?' },
    ans: 4,
    check: '3 + 1',
    check_label: { ru: 'основание и верх', uz: 'asos va tepa', en: 'the base and the top' },
    hint: { ru: 'Три вершины внизу и одна наверху.', uz: "Pastda uchta uch, tepada bitta.", en: 'Three vertices at the bottom and one on top.' },
    audio: {
      intro: { ru: 'И ещё вопрос. Сколько вершин у треугольной пирамиды?', uz: "Yana savol. Uchburchak asosli piramidada nechta uch bor?", en: 'And one more question. How many vertices does a triangular pyramid have?' },
      on_correct: { ru: 'Четыре. Три внизу и одна наверху.', uz: "To'rtta. Pastda uchta, tepada bitta.", en: 'Four. Three at the bottom and one on top.' }
    }
  },

  // s12 — MASALA: karkas modeli.
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    lead: { ru: 'Каркас кристальной модели', uz: 'Kristall model karkasi', en: 'The frame of a crystal model' },
    q: { ru: 'Модель пирамиды с квадратным основанием собирают из стержней. Сколько всего рёбер и сколько метров стержня уйдёт, если каждое ребро 2 м?', uz: "Kvadrat asosli piramida modeli sterjenlardan yig'iladi. Jami nechta qirra bor va har bir qirra 2 m bo'lsa, necha metr sterjen ketadi?", en: 'A model of a pyramid with a square base is built from rods. How many edges are there in all and how many metres of rod will be used if each edge is 2 m?' },
    q_speech: { ru: 'модель пирамиды с квадратным основанием собирают из стержней. Сколько всего рёбер и сколько метров стержня уйдёт, если каждое ребро два метра?', uz: "kvadrat asosli piramida modeli sterjenlardan yig'iladi. Jami nechta qirra bor va har bir qirra ikki metr bo'lsa, necha metr sterjen ketadi?", en: 'a model of a pyramid with a square base is built from rods. How many edges are there in all and how many metres of rod will be used if each edge is two metres?' },
    tbl_heads: [
      { ru: 'основание', uz: 'asos', en: 'the base' },
      { ru: 'боковые', uz: 'yon', en: 'the side ones' },
      { ru: 'вопрос', uz: 'savol', en: 'question' }
    ],
    tbl_cells: ['4', '4', '?'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?', en: 'Which operation do we start with?' },
    opts: [
      { ru: 'сложить рёбра основания и боковые', uz: "asos va yon qirralarni qo'shish", en: 'add the base edges and the side ones' },
      { ru: 'умножить 4 на 2', uz: "4 ni 2 ga ko'paytirish", en: 'multiply 4 by 2' },
      { ru: 'посчитать грани', uz: 'yoqlarni sanash', en: 'count the faces' },
      { ru: 'посчитать вершины', uz: 'uchlarni sanash', en: 'count the vertices' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Умножать рано. Сколько всего рёбер, ещё не сосчитали.', uz: "Ko'paytirish erta. Jami nechta qirra ekanini hali sanamadik.", en: 'It is too early to multiply. We have not counted all the edges yet.' },
      2: { ru: 'Грани это поверхности, а стержни идут по рёбрам.', uz: "Yoqlar bu sirtlar, sterjenlar esa qirralar bo'ylab ketadi.", en: 'Faces are surfaces, and the rods run along the edges.' },
      3: { ru: 'Вершины это точки, из них стержень не сделаешь.', uz: "Uchlar bu nuqtalar, ulardan sterjen yasalmaydi.", en: 'Vertices are points, you cannot make a rod out of them.' }
    },
    pick_ok: { ru: 'Верно. Сначала все рёбра, потом метры.', uz: "To'g'ri. Avval hamma qirra, keyin metrlar.", en: 'Right. First all the edges, then the metres.' },
    step1_q: { ru: 'Сколько всего рёбер у пирамиды?', uz: 'Piramidada jami nechta qirra bor?', en: 'How many edges does the pyramid have in all?' },
    ans1: 8,
    hint1: { ru: 'Четыре ребра в основании и четыре боковых.', uz: "Asosda to'rtta qirra va to'rtta yon qirra.", en: 'Four edges in the base and four side ones.' },
    step2_q: { ru: 'Сколько метров стержня уйдёт?', uz: 'Necha metr sterjen ketadi?', en: 'How many metres of rod will be used?' },
    ans2: 16,
    hint2: { ru: 'Восемь рёбер по два метра.', uz: "Ikki metrdan sakkizta qirra.", en: 'Eight edges of two metres.' },
    check: { ru: '8 рёбер, 16 м', uz: '8 qirra, 16 m', en: '8 edges, 16 m' },
    setup_audio: { ru: 'Модель собирают из стержней. Посмотри на таблицу и реши, с чего начать.', uz: "Model sterjenlardan yig'ilyapti. Jadvalga qarang va nimadan boshlashni hal qiling.", en: 'The model is built from rods. Look at the table and decide where to start.' },
    audio: {
      intro: { ru: 'Пирамиду с квадратным основанием собирают из стержней по два метра. Сколько рёбер и сколько метров?', uz: "Kvadrat asosli piramida ikki metrli sterjenlardan yig'ilyapti. Nechta qirra va necha metr?", en: 'A pyramid with a square base is built from rods of two metres. How many edges and how many metres?' },
      on_correct: { ru: 'Восемь рёбер и шестнадцать метров стержня. Четыре ребра внизу и четыре по бокам.', uz: "Sakkizta qirra va o'n olti metr sterjen. Pastda to'rtta qirra va yon tomonda to'rtta.", en: 'Eight edges and sixteen metres of rod. Four edges at the bottom and four at the sides.' },
      on_wrong: { ru: 'Сначала посчитай рёбра внизу и по бокам, потом умножай.', uz: "Avval pastdagi va yondagi qirralarni sanang, keyin ko'paytiring.", en: 'First count the edges at the bottom and at the sides, then multiply.' }
    }
  },

  // s13 — FINAL: uchta topshiriq + FaktCard.
  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy', en: 'Final' },
    intro_line: { ru: 'Три задания. Считай и скрытые части', uz: "Uchta topshiriq. Yashiringan qismlarni ham sanang", en: 'Three tasks. Count the hidden parts too' },
    items: [
      {
        kind: 'num',
        q: { ru: 'Сколько граней у четырёхугольной пирамиды?', uz: "To'rtburchak asosli piramidada nechta yoq bor?", en: 'How many faces does a quadrangular pyramid have?' },
        q_speech: { ru: 'сколько граней у четырёхугольной пирамиды?', uz: "to'rtburchak asosli piramidada nechta yoq bor?", en: 'how many faces does a quadrangular pyramid have?' },
        ans: 5,
        hint: { ru: 'Четыре боковые и основание.', uz: "To'rtta yon yoq va asos.", en: 'Four side ones and the base.' }
      },
      {
        kind: 'num',
        q: { ru: 'Сколько рёбер у треугольной пирамиды?', uz: "Uchburchak asosli piramidada nechta qirra bor?", en: 'How many edges does a triangular pyramid have?' },
        q_speech: { ru: 'сколько рёбер у треугольной пирамиды?', uz: "uchburchak asosli piramidada nechta qirra bor?", en: 'how many edges does a triangular pyramid have?' },
        ans: 6,
        hint: { ru: 'Три ребра в основании и три боковых.', uz: "Asosda uchta qirra va uchta yon qirra.", en: 'Three edges in the base and three side ones.' }
      },
      {
        kind: 'num',
        q: { ru: 'Сколько плоских граней у конуса?', uz: 'Konusda nechta tekis yoq bor?', en: 'How many flat faces does a cone have?' },
        q_speech: { ru: 'сколько плоских граней у конуса?', uz: 'konusda nechta tekis yoq bor?', en: 'how many flat faces does a cone have?' },
        ans: 1,
        hint: { ru: 'Плоское у конуса только основание.', uz: "Konusda faqat asos tekis.", en: 'The only flat part of a cone is its base.' }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?', en: 'Which line is wrong?' },
    fact_text: {
      ru: 'Положи конус на бок и толкни — он покатится не прямо, а по кругу, вокруг своей вершины. Цилиндр в тех же условиях едет прямо. Поэтому дорожные катки и валики у мельниц иногда делают чуть конусными, чтобы они шли по дуге, а не буксовали.',
      uz: "Konusni yonboshiga qo'yib turting — u to'g'riga emas, o'z uchi atrofida aylana bo'ylab dumalaydi. Silindr esa xuddi shu sharoitda to'g'ri ketadi. Shuning uchun yo'l g'altaklari va tegirmon validlarini ba'zan biroz konus shaklida qiladi, ular sirg'anmasdan yoy bo'ylab yursin deb.",
      en: 'Lay a cone on its side and push it — it will roll not straight but in a circle, around its vertex. A cylinder in the same conditions goes straight. That is why road rollers and mill rollers are sometimes made slightly conical, so that they follow a curve instead of slipping.'
    },
    fact_audio: {
      ru: 'Вот что легко проверить дома. Положи конус на бок и толкни его. Он покатится не прямо, а по кругу, будто привязан к своей вершине. А цилиндр в тех же условиях уедет прямо. Причина простая. У цилиндра оба конца одинаковой ширины, а у конуса один конец широкий, другой узкий, и широкий проходит больший путь. Поэтому дорожные катки и валики иногда делают слегка конусными, чтобы машина шла по дуге и колёса не буксовали.',
      uz: "Mana uyda oson tekshiriladigan narsa. Konusni yonboshiga qo'yib turting. U to'g'riga emas, o'z uchiga bog'langandek aylana bo'ylab dumalaydi. Silindr esa xuddi shu sharoitda to'g'ri ketadi. Sababi oddiy. Silindrning ikkala uchi bir xil kenglikda, konusning bir uchi keng, ikkinchisi tor, keng uchi esa uzunroq yo'l bosadi. Shuning uchun yo'l g'altaklari va validlarni ba'zan biroz konus qiladi, mashina yoy bo'ylab yursin va g'ildiraklar sirg'anmasin deb.",
      en: 'Here is something easy to check at home. Lay a cone on its side and push it. It will roll not straight but in a circle, as if tied to its vertex. A cylinder in the same conditions will go straight. The reason is simple. A cylinder has both ends the same width, while a cone has one wide end and one narrow one, and the wide end travels a longer path. That is why road rollers are sometimes made slightly conical, so that the machine follows a curve and the wheels do not slip.'
    },
    audio: {
      intro: { ru: 'Три задания напоследок. Не забывай про части, которых не видно.', uz: "Oxirida uchta topshiriq. Ko'rinmaydigan qismlarni unutmang.", en: 'Three tasks at the end. Do not forget the parts that cannot be seen.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Считай все части, включая скрытые.', uz: "Yashiringanlari bilan birga hamma qismni sanang.", en: 'Count all the parts, including the hidden ones.' }
    }
  },

  // s14 — YAKUN: blok tugadi.
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun', en: 'Result' },
    mission_done: { ru: 'Кристальный квартал построен!', uz: 'Kristall kvartal qurildi!', en: 'The crystal quarter is built!' },
    cando: {
      ru: ['отличаю плоскую фигуру от пространственной', 'называю пирамиду по основанию', 'считаю грани и вершины, в том числе скрытые'],
      uz: ["tekis shaklni fazoviysidan ajrataman", "piramidani asosiga qarab atayman", "yashiringanlari bilan yoq va uchlarni sanayman"],
      en: ['I tell a flat figure from a solid one', 'I name a pyramid by its base', 'I count faces and vertices, including the hidden ones']
    },
    rule_recap: { ru: 'У пирамиды основание многоугольник и одна вершина, у конуса основание круг и гладкий бок.', uz: "Piramidaning asosi ko'pburchak va bitta uchi bor, konusning asosi doira va yoni silliq.", en: 'A pyramid has a polygon base and one vertex, a cone has a circle base and a smooth side.' },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi', en: 'builds on' },
    conn_refs: { ru: 'урок 39: виды треугольников; урок 40: симметрия', uz: "39-dars: uchburchak turlari; 40-dars: simmetriya", en: 'lesson 39: kinds of triangles; lesson 40: symmetry' },
    conn_label_next: { ru: 'дальше', uz: 'keyin', en: 'next' },
    conn_next: { ru: 'блок закончен: от площади до объёмных фигур', uz: 'blok tugadi: yuzadan fazoviy shakllargacha', en: 'the block is finished: from area to solid figures' },
    audio: {
      ru: 'Кристальный квартал построен. Оглянись, какой путь мы прошли. Сначала считали клетки внутри фигуры и научились находить площадь умножением. Потом сравнивали фигуры и поняли, что сравнивать нужно по названной мерке. Дальше решали задачи, где вопрос сам подсказывает величину. А в конце вышли с листа. У пирамиды в основании многоугольник, и все боковые грани сходятся в одной вершине. У конуса основание круглое, а бок гладкий. И запомни главное про чертёж. То, чего на нём не видно, всё равно существует, и это тоже нужно считать!',
      uz: "Kristall kvartal qurildi. Bosib o'tgan yo'limizga qarang. Avval shakl ichidagi kataklarni sanab, yuzani ko'paytirish bilan topishni o'rgandik. Keyin shakllarni solishtirib, aytilgan o'lchov bo'yicha solishtirish kerakligini tushundik. So'ng savolning o'zi kattalikni aytadigan masalalarni yechdik. Oxirida esa varaqdan chiqdik. Piramidaning asosida ko'pburchak, hamma yon yog'i bitta uchda uchrashadi. Konusning asosi dumaloq, yoni silliq. Va chizma haqida asosiysini eslab qoling. Unda ko'rinmayotgan narsa baribir mavjud, uni ham sanash kerak!",
      en: 'The crystal quarter is built. Look back at the road we have travelled. First we counted the squares inside a figure and learned to find area by multiplying. Then we compared figures and understood that comparing has to be done by a named measure. After that we solved problems where the question itself tells you the quantity. And at the end we left the sheet. A pyramid has a polygon at its base, and all its side faces meet at one vertex. A cone has a round base and a smooth side. And remember the main thing about a drawing. What cannot be seen on it still exists, and it has to be counted too!'
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Возьмём пирамиду.', uz: 'Piramidani olamiz.', en: 'Let us take the pyramid.' },
  s2:  { ru: 'Теперь конус.', uz: 'Endi konus.', en: 'Now the cone.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz.", en: 'Let us gather this into a rule.' },
  s4:  { ru: 'Прочитай чертёж.', uz: "Chizmani o'qing.", en: 'Read the drawing.' },
  s5:  { ru: 'Разложи фигуры.', uz: 'Shakllarni ajrating.', en: 'Sort the figures.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.', en: 'A quick question.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring.", en: 'Fill the console.' },
  s8:  { ru: 'Тут посчитали не всё.', uz: 'Bu yerda hammasi sanalmabdi.', en: 'Here not everything was counted.' },
  s9:  { ru: 'А вот и Бит со своим правилом.', uz: "Mana Bit ham o'z qoidasi bilan.", en: 'And here is Bit with his rule.' },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang.", en: 'Now count on your own.' },
  s11: { ru: 'И ещё одна модель.', uz: 'Yana bitta model.', en: 'And one more model.' },
  s12: { ru: 'Задача от сборщиков.', uz: "Yig'uvchilardan masala.", en: 'A task from the builders.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.', en: 'The final check.' },
  s14: { ru: 'Подведём итог блока.', uz: 'Blok yakunini yasaymiz.', en: 'Let us sum up the block.' }
};

const S14_PAYOFF = {
  ru: 'Квартал построен. Фигуры вышли с листа и встали на стол.',
  uz: "Kvartal qurildi. Shakllar varaqdan chiqib, stolda turdi.",
  en: 'The quarter is built. The figures left the sheet and stood on the table.'
};

// --- ZAL TAXTASI (D41): markazda kristall modellar — piramida va konus, ular yonida
// tekis chizmalari. Blok shu yerda tugaydi.
const ModelNodeLayer = () => {
  const lang = useLang();
  return (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path d="M150 158 h100 l8 18 h-116 Z" fill="#B49A6E"/>
    <rect x={HALL_SLAB.x} y={HALL_SLAB.y} width={HALL_SLAB.w} height={HALL_SLAB.h} rx="5" fill="#E4D3AC" stroke="#8A7550" strokeWidth="2"/>
    <rect x="130" y="99" width="140" height="11" rx="2" fill="#C6AE7E"/>
    <text x="200" y="107.5" textAnchor="middle" fontSize="7" letterSpacing="2" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'МОДЕЛИ', 'MODELLAR', 'THE MODELS')}</text>
    <g transform="translate(158 150)">
      <path d="M-26 0 L0 -34 L26 0 Z" fill="#DCEBF5" stroke="#2E7E9E" strokeWidth="1.6"/>
      <path d="M-26 0 L0 8 L26 0" fill="#EAF4FA" stroke="#2E7E9E" strokeWidth="1.4"/>
      <path d="M0 -34 L0 8" stroke="#7FA8BF" strokeWidth="1" strokeDasharray="3 3"/>
      <text x="0" y="20" textAnchor="middle" fontSize="6.5" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'пирамида', 'piramida', 'a pyramid')}</text>
    </g>
    <g transform="translate(238 150)">
      <path d="M-20 0 A20 7 0 0 0 20 0 L0 -34 Z" fill="#FFD98A" stroke="#C06A2E" strokeWidth="1.6"/>
      <ellipse cx="0" cy="0" rx="20" ry="7" fill="#FFE6A6" stroke="#C06A2E" strokeWidth="1.4"/>
      <text x="0" y="20" textAnchor="middle" fontSize="6.5" fill="#8A5A2E" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'конус', 'konus', 'a cone')}</text>
    </g>
    {/* chap artefakt: tekis chizma varaqda */}
    <g transform="translate(88 158)">
      <rect x="-22" y="6" width="44" height="14" rx="3" fill="#B49A6E" stroke="#8A7550" strokeWidth="1"/>
      <rect x="-16" y="-16" width="32" height="18" fill="#F7F1E4" stroke="#8A7550" strokeWidth="1.2"/>
      <path d="M-10 -2 L0 -12 L10 -2 Z" fill="none" stroke="#2E7E9E" strokeWidth="1.4"/>
      <text x="0" y="-20" textAnchor="middle" fontSize="5" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'ЧЕРТЁЖ', 'CHIZMA', 'THE DRAWING')}</text>
    </g>
    {/* o'ng artefakt: yoq va uch sanog'i */}
    <g transform="translate(300 104)">
      <rect x="0" y="0" width="34" height="42" rx="3" fill="#E4D3AC" stroke="#8A7550" strokeWidth="1"/>
      <text x="17" y="16" textAnchor="middle" fontSize="9" fontWeight="800" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">5</text>
      <text x="17" y="26" textAnchor="middle" fontSize="5" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'ГРАНИ', 'YOQ', 'THE FACES')}</text>
      <text x="17" y="38" textAnchor="middle" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">5</text>
    </g>
    <circle className="lm-glow" cx="300" cy="92" r="2.4" fill="#BFF0C8"/>
  </svg>
  );
};

const LessonScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <AncientHallBg fill/>
      <ModelNodeLayer/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- EKRAN CHIZMASI (s4): to'rtburchak asosli piramida, asos uzuq chiziq bilan.
const PyramidFig = () => {
  const lang = useLang();
  return (
  <svg viewBox="0 0 200 140" style={{ width: 'min(240px, 78%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <path d="M100 18 L38 96 L112 116 Z" fill="#EAF4FA" stroke="#2E7E9E" strokeWidth="2.2" strokeLinejoin="round"/>
    <path d="M100 18 L162 96 L112 116 Z" fill="#DCEBF5" stroke="#2E7E9E" strokeWidth="2.2" strokeLinejoin="round"/>
    <path d="M38 96 L112 116 L162 96" fill="none" stroke="#2E7E9E" strokeWidth="2.2" strokeLinejoin="round"/>
    <path d="M38 96 L88 78 L162 96" fill="none" stroke="#7FA8BF" strokeWidth="1.6" strokeDasharray="5 4"/>
    <path d="M88 78 L100 18" fill="none" stroke="#7FA8BF" strokeWidth="1.4" strokeDasharray="5 4"/>
    <text x="100" y="134" textAnchor="middle" fontSize="9" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'основание', 'asos', 'the base')}</text>
  </svg>
  );
};

// --- EKRAN CHIZMASI (s8): o'sha piramida, ko'rinadigan va yashiringan yoqlari ajratilgan.
const HiddenFacesFig = () => (
  <svg viewBox="0 0 220 130" style={{ width: 'min(260px, 82%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <g transform="translate(10 6)">
      <path d="M80 12 L24 86 L92 104 Z" fill="#EAF4FA" stroke="#2E7E9E" strokeWidth="2"/>
      <path d="M80 12 L140 86 L92 104 Z" fill="#DCEBF5" stroke="#2E7E9E" strokeWidth="2"/>
      <path d="M24 86 L74 68 L140 86" fill="none" stroke="#C06A2E" strokeWidth="1.8" strokeDasharray="5 4"/>
      <path d="M74 68 L80 12" fill="none" stroke="#C06A2E" strokeWidth="1.6" strokeDasharray="5 4"/>
      <text x="46" y="120" fontSize="8" fill="#2E7E9E" fontFamily="'JetBrains Mono', monospace">2</text>
      <text x="120" y="120" fontSize="8" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">?</text>
    </g>
    <g transform="translate(178 58)">
      <circle r="17" fill="none" stroke="#C06A2E" strokeWidth="2.2"/>
      <text x="0" y="5" textAnchor="middle" fontSize="14" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">3</text>
    </g>
  </svg>
);

// --- FACTCARD QAHRAMONI: konus aylana bo'ylab, silindr to'g'ri bo'ylab dumalaydi.
const RollFig = () => (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <g transform="translate(16 30)">
      <path d="M0 0 L58 12 L0 24 Z" fill="#FFD98A" stroke="#C06A2E" strokeWidth="1.8" strokeLinejoin="round"/>
      <ellipse cx="58" cy="12" rx="4" ry="12" fill="#FFE6A6" stroke="#C06A2E" strokeWidth="1.6"/>
      <path d="M4 44 a56 22 0 0 0 74 8" fill="none" stroke="#C06A2E" strokeWidth="2" strokeDasharray="5 4"/>
      <path d="M74 48 l6 4 l-7 3" fill="none" stroke="#C06A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <g transform="translate(126 30)">
      <rect x="6" y="0" width="52" height="24" fill="#DCEBF5" stroke="#2E7E9E" strokeWidth="1.8"/>
      <ellipse cx="6" cy="12" rx="5" ry="12" fill="#EAF4FA" stroke="#2E7E9E" strokeWidth="1.6"/>
      <ellipse cx="58" cy="12" rx="5" ry="12" fill="#EAF4FA" stroke="#2E7E9E" strokeWidth="1.6"/>
      <path d="M4 48 h64" fill="none" stroke="#2E7E9E" strokeWidth="2" strokeDasharray="5 4"/>
      <path d="M62 44 l6 4 l-6 4" fill="none" stroke="#2E7E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
);

export default createLesson({
  TOTAL_SCREENS, LESSON_META, SCREEN_META, CONTENT, BRIDGES, S14_PAYOFF,
  STYLES: LESSON_STYLES,
  Scene: LessonScene,
  FactFig: RollFig,
  figs: { s4: <PyramidFig/>, s8: <HiddenFacesFig/> }
});
