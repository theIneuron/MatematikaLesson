// ============================================================
// 6 КЛАСС, УРОК 40 «Осевая симметрия»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б11, второй урок. Ось симметрии вводится как линия сгиба: лист
// складывают, и половинки совпадают. Отсюда получается и признак точки
// (равные расстояния по перпендикуляру), и правило в координатах из
// урока 30. Хук ловит главную ошибку: диагональ прямоугольника осью
// симметрии не является.
//
// Сцена — кружок вышивки, сюзане с зеркальным орнаментом.
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
  lessonId: 'grade6-40',
  lessonTitle: {
    ru: 'Осевая симметрия',
    uz: "O'q simmetriyasi",
    en: 'Reflection symmetry',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 so'zana: nechta o'q
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 masofa va teng kesmalar
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 buklash chizig'i: ko'zgu
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: nuqtani akslantirish
  { id: 's_axes',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 shakllarning simmetriya o'qlari
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: koordinatalar
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: diagonal o'q emas
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_count',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 o'qlarni sanash x3
  { id: 's_coord',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 koordinatalar x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: o'qi bormi
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: so'zana
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    title: { ru: 'Салфетка для сюзане', uz: "So'zana uchun salfetka", en: 'A cloth for the embroidery' },
    lead: {
      ru: 'Салфетка прямоугольная. Её складывают, чтобы узор с двух половинок совпал.',
      uz: "Salfetka to'g'ri to'rtburchak. Naqsh ikki yarmida mos tushishi uchun uni buklaydilar.",
      en: 'The cloth is a rectangle. It is folded so the pattern on both halves matches.',
    },
    voice_a: { ru: 'Бекзод: сложить можно 4 способами.', uz: "Bekzod: 4 xil usulda buklash mumkin.", en: 'Bekzod: it folds four ways.' },
    voice_b: { ru: 'Мехри: только 2.', uz: 'Mehri: faqat 2 xil.', en: 'Mehri: only two.' },
    ask: { ru: 'Сколько осей симметрии у прямоугольника?', uz: "To'g'ri to'rtburchakning nechta simmetriya o'qi bor?", en: 'How many symmetry axes has a rectangle?' },
    options: [
      { ru: '4', uz: '4', en: '4' },
      { ru: '2', uz: '2', en: '2' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'В кружке вышивки готовят сюзане. Прямоугольную салфетку складывают пополам так, чтобы узор на двух половинках точно совпал.',
          'Бекзод говорит, что сложить можно четырьмя способами: вдоль, поперёк и по двум диагоналям. Мехри отвечает, что только двумя. Сколько осей симметрии у прямоугольника? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Kashtachilik to'garagida so'zana tayyorlanmoqda. To'g'ri to'rtburchak salfetka naqsh ikki yarmida aniq mos tushadigan qilib buklanadi.",
          "Bekzod to'rt xil usulda buklash mumkin deydi: bo'yiga, ko'ndalangiga va ikki diagonal bo'ylab. Mehri esa faqat ikki xil deb javob beradi. To'g'ri to'rtburchakning nechta simmetriya o'qi bor? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'The embroidery club is making a suzani. A rectangular cloth is folded in half so the pattern on both halves matches exactly.',
          'Bekzod says it folds four ways: lengthwise, crosswise and along both diagonals. Mehri answers only two. How many symmetry axes has a rectangle? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    title: { ru: 'Равные расстояния', uz: 'Teng masofalar', en: 'Equal distances' },
    done: {
      ru: 'Расстояние от точки до линии измеряют по перпендикуляру — по самому короткому пути. Это и будет главным признаком.',
      uz: "Nuqtadan chiziqgacha masofa perpendikular bo'ylab, eng qisqa yo'l bilan o'lchanadi. Aynan shu asosiy belgi bo'ladi.",
      en: 'The distance from a point to a line is measured along the perpendicular, the shortest path. That will be the key test.',
    },
    audio: {
      ru: [
        'Вспомним про расстояние. От точки до прямой его меряют не как попало, а по самому короткому пути, то есть по перпендикуляру.',
        'Если две точки удалены от прямой на одинаковое расстояние и лежат по разные стороны, они как бы отражают друг друга.',
        'Сегодня из этого и вырастет вся симметрия.',
      ],
      uz: [
        "Masofani eslaymiz. Nuqtadan to'g'ri chiziqgacha masofa qanday bo'lsa unday emas, eng qisqa yo'l, ya'ni perpendikular bo'ylab o'lchanadi.",
        "Ikki nuqta chiziqdan bir xil masofada bo'lsa va har xil tomonda yotsa, ular bir-birini go'yo aks ettiradi.",
        "Bugun butun simmetriya shundan o'sib chiqadi.",
      ],
      en: [
        'Recall distance. From a point to a line it is measured not any old way but along the shortest path, the perpendicular.',
        'If two points are the same distance from a line and lie on opposite sides, they mirror each other.',
        'All of symmetry will grow out of that today.',
      ],
    },
  },

  s_core: {
    title: { ru: 'Линия сгиба — это зеркало', uz: "Buklash chizig'i — ko'zgu", en: 'The fold line is a mirror' },
    lines: [
      { ru: 'сложили лист — половинки совпали', uz: 'varaqni bukladik — yarmilar mos tushdi', en: 'fold the sheet: the halves match' },
      { ru: 'точка и её пара равноудалены от линии', uz: 'nuqta va uning jufti chiziqdan teng masofada', en: 'a point and its pair are equally far from the line' },
      { ru: 'отрезок между ними перпендикулярен оси', uz: "ular orasidagi kesma o'qqa perpendikular", en: 'the segment between them is perpendicular to the axis' },
    ],
    done: {
      ru: 'Линию сгиба называют осью симметрии. Каждая точка переходит в свою пару по другую сторону, на то же расстояние.',
      uz: "Buklash chizig'i simmetriya o'qi deb ataladi. Har bir nuqta boshqa tomondagi juftiga, xuddi shu masofaga o'tadi.",
      en: 'The fold line is called an axis of symmetry. Every point moves to its pair on the other side, the same distance away.',
    },
    audio: {
      ru: [
        'Возьмём лист с узором и сложим его. Если половинки совпали до последней линии, значит сгиб прошёл по особой линии. Её называют осью симметрии.',
        'Посмотрим на одну точку узора. Её пара лежит по другую сторону оси, ровно на таком же расстоянии.',
        'И ещё: отрезок, соединяющий точку с её парой, всегда перпендикулярен оси. Это и есть точная проверка: равные расстояния и перпендикуляр.',
      ],
      uz: [
        "Naqshli varaqni olib buklaymiz. Yarmilar oxirgi chizigigacha mos tushsa, demak buklash alohida chiziq bo'ylab o'tgan. Uni simmetriya o'qi deb atashadi.",
        "Naqshning bitta nuqtasiga qaraymiz. Uning jufti o'qning boshqa tomonida, aynan shunday masofada yotadi.",
        "Yana: nuqtani jufti bilan tutashtiruvchi kesma har doim o'qqa perpendikular. Aniq tekshiruv aynan shu: teng masofalar va perpendikular.",
      ],
      en: [
        'Take a patterned sheet and fold it. If the halves match down to the last line, the fold ran along a special line. It is called an axis of symmetry.',
        'Look at one point of the pattern. Its pair lies on the other side of the axis, exactly the same distance away.',
        'And one more thing: the segment joining a point to its pair is always perpendicular to the axis. That is the exact test: equal distances and a perpendicular.',
      ],
    },
  },

  s_tool: {
    title: { ru: 'Отражаем точку', uz: 'Nuqtani akslantiramiz', en: 'Reflecting a point' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: 'точка в 3 клетках справа от оси', uz: "nuqta o'qdan 3 katak o'ngda", en: 'the point is 3 cells right of the axis' },
      { ru: 'идём по перпендикуляру на другую сторону', uz: "perpendikular bo'ylab boshqa tomonga o'tamiz", en: 'go along the perpendicular to the other side' },
      { ru: 'отмеряем те же 3 клетки', uz: "xuddi shu 3 katakni o'lchaymiz", en: 'measure the same 3 cells' },
    ],
    demo_note: {
      ru: 'Расстояние сохраняется, сторона меняется. Точки на самой оси остаются на месте.',
      uz: "Masofa saqlanadi, tomon o'zgaradi. O'qning o'zidagi nuqtalar joyida qoladi.",
      en: 'The distance is kept, the side changes. Points on the axis itself stay put.',
    },
    play_ask: { ru: 'Точка в 5 клетках слева от оси. Где её пара?', uz: "Nuqta o'qdan 5 katak chapda. Uning jufti qayerda?", en: 'A point 5 cells left of the axis. Where is its pair?' },
    play_opts: [
      { ru: 'в 5 клетках справа', uz: "5 katak o'ngda", en: '5 cells right' },
      { ru: 'в 10 клетках справа', uz: "10 katak o'ngda", en: '10 cells right' },
      { ru: 'в 5 клетках слева', uz: '5 katak chapda', en: '5 cells left' },
    ],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. То же расстояние, другая сторона.',
      uz: "To'g'ri. O'sha masofa, boshqa tomon.",
      en: 'Right. Same distance, other side.',
    },
    play_wrong: [
      null,
      { ru: 'Расстояние не удваивается: оно такое же, как было.', uz: "Masofa ikkilanmaydi: u avvalgidek qoladi.", en: 'The distance does not double: it stays the same.' },
      { ru: 'Пара лежит по другую сторону оси.', uz: "Juft o'qning boshqa tomonida yotadi.", en: 'The pair lies on the other side of the axis.' },
    ],
    audio: {
      intro: {
        ru: 'Покажу, как отражают точку. Ось проведём вертикально по клетчатому полю.',
        uz: "Nuqta qanday akslantirilishini ko'rsataman. O'qni katakli maydonda vertikal o'tkazamiz.",
        en: 'I will show how a point is reflected. The axis runs vertically on squared paper.',
      },
      demo: {
        ru: 'Точка стоит в трёх клетках справа от оси. Идём от неё к оси по перпендикуляру и продолжаем на ту же длину в другую сторону. Отмеряем три клетки влево и ставим пару. Расстояние сохранилось, сторона поменялась.',
        uz: "Nuqta o'qdan uch katak o'ngda turibdi. Undan o'qqa perpendikular bo'ylab boramiz va boshqa tomonga xuddi shu uzunlikda davom etamiz. Uch katak chapga o'lchab, juftini qo'yamiz. Masofa saqlandi, tomon o'zgardi.",
        en: 'The point sits three cells right of the axis. Go from it to the axis along the perpendicular and continue the same length on the other side. Measure three cells left and mark the pair. The distance is kept, the side changed.',
      },
      play: {
        ru: 'Теперь ваша очередь. Точка в пяти клетках слева от оси. Где её пара?',
        uz: "Endi sizning navbatingiz. Nuqta o'qdan besh katak chapda. Uning jufti qayerda?",
        en: 'Now it is your turn. A point five cells left of the axis. Where is its pair?',
      },
      ok: {
        ru: 'Верно. Пять клеток, но с другой стороны.',
        uz: "To'g'ri. Besh katak, lekin boshqa tomonda.",
        en: 'Right. Five cells, but on the other side.',
      },
      wrong: {
        ru: 'Расстояние до оси остаётся тем же, меняется только сторона.',
        uz: "O'qgacha masofa o'sha qoladi, faqat tomon o'zgaradi.",
        en: 'The distance to the axis stays the same, only the side changes.',
      },
    },
  },

  s_axes: {
    title: { ru: 'Сколько осей у фигуры', uz: "Shaklning nechta o'qi bor", en: 'How many axes a shape has' },
    lines: [
      { ru: 'у прямоугольника 2 оси: вдоль и поперёк', uz: "to'g'ri to'rtburchakda 2 o'q: bo'yiga va ko'ndalangiga", en: 'a rectangle has 2: lengthwise and crosswise' },
      { ru: 'у квадрата 4: ещё две по диагоналям', uz: "kvadratda 4: yana ikkitasi diagonallar bo'ylab", en: 'a square has 4: two more along the diagonals' },
      { ru: 'у круга осей бесконечно много', uz: "doirada o'qlar cheksiz ko'p", en: 'a disc has infinitely many' },
    ],
    done: {
      ru: 'Ось есть только там, где сгиб даёт полное совпадение. У прямоугольника диагональ этого не даёт, значит осей 2. Права была Мехри.',
      uz: "O'q faqat buklash to'liq mos tushirgan joyda bo'ladi. To'g'ri to'rtburchakda diagonal buni bermaydi, demak o'qlar 2 ta. Mehri haq edi.",
      en: 'An axis exists only where the fold gives a full match. A rectangle’s diagonal does not, so it has 2. Mehri was right.',
    },
    audio: {
      ru: [
        'Попробуем сложить прямоугольник. Вдоль совпало, поперёк совпало. Теперь по диагонали: углы разошлись, длинная сторона легла на короткую. Совпадения нет, значит диагональ осью не является.',
        'У квадрата стороны равны, и по диагонали всё совпадает. Поэтому у квадрата четыре оси, а у прямоугольника только две. Права была Мехри.',
        'А у круга любая прямая через центр даёт полное совпадение, поэтому осей у него бесконечно много.',
      ],
      uz: [
        "To'g'ri to'rtburchakni buklab ko'ramiz. Bo'yiga mos tushdi, ko'ndalangiga ham. Endi diagonal bo'ylab: burchaklar ajralib ketdi, uzun tomon qisqasining ustiga tushdi. Moslik yo'q, demak diagonal o'q emas.",
        "Kvadratning tomonlari teng, diagonal bo'ylab ham hammasi mos tushadi. Shuning uchun kvadratda to'rtta o'q, to'g'ri to'rtburchakda esa faqat ikkita. Mehri haq edi.",
        "Doirada esa markazdan o'tgan har qanday to'g'ri chiziq to'liq moslik beradi, shuning uchun unda o'qlar cheksiz ko'p.",
      ],
      en: [
        'Try folding a rectangle. Lengthwise it matches, crosswise it matches. Now along the diagonal: the corners part and the long side lands on the short one. No match, so the diagonal is not an axis.',
        'A square has equal sides, and along the diagonal everything matches. So a square has four axes and a rectangle only two. Mehri was right.',
        'And in a disc every line through the centre gives a full match, so it has infinitely many axes.',
      ],
    },
  },

  s_solve: {
    title: { ru: 'Отражение на плоскости', uz: 'Tekislikda akslantirish', en: 'Reflection on the plane' },
    lead: { ru: 'Точка A (3; 2). Отразим её через ось y, потом через ось x.', uz: "A (3; 2) nuqtasi. Uni y o'qi, keyin x o'qi orqali akslantiramiz.", en: 'Point A (3; 2). Reflect it in the y axis, then in the x axis.' },
    steps: [
      { ru: 'через ось y: знак меняет первое число, (−3; 2)', uz: "y o'qi orqali: birinchi son ishorasini o'zgartiradi, (−3; 2)", en: 'in the y axis: the first number flips, (−3; 2)' },
      { ru: 'через ось x: знак меняет второе, (3; −2)', uz: "x o'qi orqali: ikkinchisi o'zgaradi, (3; −2)", en: 'in the x axis: the second flips, (3; −2)' },
      { ru: 'расстояние до оси сохраняется', uz: "o'qgacha masofa saqlanadi", en: 'the distance to the axis is kept' },
    ],
    done: {
      ru: 'Отражение через вертикальную ось меняет знак у первой координаты, через горизонтальную — у второй. Второе число при этом не трогают.',
      uz: "Vertikal o'q orqali akslantirish birinchi koordinata ishorasini, gorizontal o'q orqali ikkinchisini o'zgartiradi. Qolgan songa tegilmaydi.",
      en: 'Reflecting in the vertical axis flips the first coordinate, in the horizontal one the second. The other number is untouched.',
    },
    audio: {
      ru: [
        'Решаем вместе. Точка А стоит в трёх клетках вправо и двух вверх, то есть три и два.',
        'Отразим её через вертикальную ось. Расстояние по горизонтали три сохраняется, но уходит в другую сторону: получается минус три и два. По вертикали ничего не менялось.',
        'Теперь отразим исходную точку через горизонтальную ось. Первое число остаётся тройкой, а второе меняет знак: три и минус два. Всё то же правило: расстояние до оси то же, сторона другая.',
      ],
      uz: [
        "Birga yechamiz. A nuqtasi uch katak o'ngda va ikki katak tepada turibdi, ya'ni uch va ikki.",
        "Uni vertikal o'q orqali akslantiramiz. Gorizontal bo'yicha uch masofa saqlanadi, lekin boshqa tomonga ketadi: minus uch va ikki chiqadi. Vertikal bo'yicha hech nima o'zgarmadi.",
        "Endi dastlabki nuqtani gorizontal o'q orqali akslantiramiz. Birinchi son uch bo'lib qoladi, ikkinchisi esa ishorasini o'zgartiradi: uch va minus ikki. Qoida o'sha: o'qgacha masofa o'sha, tomon boshqa.",
      ],
      en: [
        'Let us solve it together. Point A sits three cells right and two up, that is three and two.',
        'Reflect it in the vertical axis. The horizontal distance of three is kept but goes the other way: minus three and two. Nothing changed vertically.',
        'Now reflect the original point in the horizontal axis. The first number stays three and the second flips: three and minus two. Same rule: same distance to the axis, other side.',
      ],
    },
  },

  s_edge: {
    title: { ru: 'Диагональ не всегда ось', uz: "Diagonal har doim o'q emas", en: 'A diagonal is not always an axis' },
    bad_line: { ru: 'ошибка: у прямоугольника 4 оси, как у квадрата', uz: "xato: to'g'ri to'rtburchakda kvadratdek 4 o'q", en: 'mistake: a rectangle has 4 axes like a square' },
    good_line: { ru: 'верно: по диагонали половинки не совпадают, осей 2', uz: "to'g'ri: diagonal bo'ylab yarmilar mos tushmaydi, o'q 2 ta", en: 'right: the halves do not match along a diagonal, so 2' },
    warn_line: { ru: 'ошибка: пару просто сдвинули, а не отразили', uz: "xato: juft akslantirilmay, shunchaki surilgan", en: 'mistake: the pair was shifted, not reflected' },
    done: {
      ru: 'Проверка одна: мысленно сложить по линии. Если совпало — ось, если нет — не ось, как бы красиво линия ни лежала.',
      uz: "Tekshiruv bitta: chiziq bo'ylab xayolan buklash. Mos tushsa — o'q, tushmasa — o'q emas, chiziq qanchalik chiroyli yotmasin.",
      en: 'One test: mentally fold along the line. If it matches it is an axis; if not it is not, however pretty the line looks.',
    },
    audio: {
      ru: [
        'Главная ошибка урока. Диагональ выглядит как ось симметрии, ведь она делит фигуру на две равные части.',
        'Но равные части и симметрия это не одно и то же. Сложите прямоугольник по диагонали: части равны по площади, а наложить их друг на друга не получится. Значит диагональ не ось.',
        'Вторая ошибка: точку не отражают, а сдвигают в ту же сторону. Тогда узор не совпадёт при складывании.',
      ],
      uz: [
        "Darsning asosiy xatosi. Diagonal simmetriya o'qiga o'xshaydi, axir u shaklni ikki teng qismga bo'ladi.",
        "Ammo teng qismlar va simmetriya bir narsa emas. To'g'ri to'rtburchakni diagonal bo'ylab buklang: qismlar yuzi bo'yicha teng, lekin ularni bir-birining ustiga qo'yib bo'lmaydi. Demak diagonal o'q emas.",
        "Ikkinchi xato: nuqta akslantirilmay, o'sha tomonga suriladi. Unda buklashda naqsh mos tushmaydi.",
      ],
      en: [
        'The main mistake here. A diagonal looks like an axis, since it cuts the shape into two equal parts.',
        'But equal parts and symmetry are not the same. Fold a rectangle along a diagonal: the parts are equal in area, yet they will not lay on top of each other. So the diagonal is not an axis.',
        'The second mistake: the point is shifted the same way instead of being reflected. Then the pattern will not match when folded.',
      ],
    },
  },

  s_rule: {
    title: { ru: 'Ось симметрии', uz: "Simmetriya o'qi", en: 'The axis of symmetry' },
    rule_1: {
      ru: 'Ось симметрии — линия, по которой фигуру можно сложить так, что половинки совпадут. Точка и её пара лежат по разные стороны оси на равном расстоянии, а отрезок между ними перпендикулярен оси.',
      uz: "Simmetriya o'qi — shaklni buklaganda yarmilari mos tushadigan chiziq. Nuqta va uning jufti o'qning har xil tomonida teng masofada yotadi, ular orasidagi kesma esa o'qqa perpendikular.",
      en: 'An axis of symmetry is a line along which a shape folds so the halves match. A point and its pair lie on opposite sides at equal distance, and the segment between them is perpendicular to the axis.',
    },
    rule_2: {
      ru: 'На плоскости отражение через ось y меняет знак первой координаты, через ось x — второй. Салфетка: у прямоугольника 2 оси, права была Мехри.',
      uz: "Tekislikda y o'qi orqali akslantirish birinchi koordinata ishorasini, x o'qi orqali ikkinchisini o'zgartiradi. Salfetka: to'g'ri to'rtburchakda 2 o'q, Mehri haq edi.",
      en: 'On the plane, reflecting in the y axis flips the first coordinate, in the x axis the second. The cloth: a rectangle has 2 axes, so Mehri was right.',
    },
    audio: {
      ru: 'Запомним правило. Ось симметрии это линия, по которой фигуру можно сложить так, что половинки совпадут. Точка и её пара лежат по разные стороны оси на равном расстоянии, а отрезок между ними перпендикулярен оси. На плоскости отражение через вертикальную ось меняет знак первой координаты, а через горизонтальную знак второй. Вернёмся к салфетке. У прямоугольника две оси симметрии, а по диагонали половинки не совпадают. Права была Мехри.',
      uz: "Qoidani eslab qolamiz. Simmetriya o'qi bu shaklni buklaganda yarmilari mos tushadigan chiziq. Nuqta va uning jufti o'qning har xil tomonida teng masofada yotadi, ular orasidagi kesma esa o'qqa perpendikular. Tekislikda vertikal o'q orqali akslantirish birinchi koordinata ishorasini, gorizontal o'q orqali ikkinchisining ishorasini o'zgartiradi. Salfetkaga qaytamiz. To'g'ri to'rtburchakning ikkita simmetriya o'qi bor, diagonal bo'ylab esa yarmilar mos tushmaydi. Mehri haq edi.",
      en: 'Let us remember the rule. An axis of symmetry is a line along which a shape folds so the halves match. A point and its pair lie on opposite sides at equal distance, and the segment between them is perpendicular to the axis. On the plane, reflecting in the vertical axis flips the first coordinate and in the horizontal one the second. Back to the cloth. A rectangle has two axes of symmetry, and along a diagonal the halves do not match. Mehri was right.',
    },
  },

  s_count: {
    title: { ru: 'Считаем оси', uz: "O'qlarni sanaymiz", en: 'Counting the axes' },
    lead: { ru: 'Мысленно складывай фигуру и смотри, совпало ли.', uz: 'Shaklni xayolan buklab, mos tushganiga qarang.', en: 'Fold the shape in your head and see if it matches.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сколько осей симметрии у квадрата?', uz: "Kvadratning nechta simmetriya o'qi bor?", en: 'How many axes has a square?' },
        opts: ['4', '2', '1'],
        correct: 0,
        ok: { ru: 'Верно. Две через середины сторон и две по диагоналям.', uz: "To'g'ri. Ikkitasi tomonlar o'rtasidan, ikkitasi diagonallar bo'ylab.", en: 'Right. Two through the side midpoints and two along the diagonals.' },
        wrong: [
          null,
          { ru: 'У квадрата стороны равны, поэтому диагонали тоже оси.', uz: "Kvadratning tomonlari teng, shuning uchun diagonallar ham o'q.", en: 'A square has equal sides, so the diagonals are axes too.' },
          { ru: 'Складывать квадрат можно не одним способом.', uz: "Kvadratni bir emas, bir necha usulda buklash mumkin.", en: 'A square folds in more than one way.' },
        ],
      },
      {
        q: { ru: 'Сколько осей симметрии у круга?', uz: "Doiraning nechta simmetriya o'qi bor?", en: 'How many axes has a disc?' },
        opts: [
          { ru: 'бесконечно много', uz: "cheksiz ko'p", en: 'infinitely many' },
          { ru: 'ровно 2', uz: 'roppa-rosa 2', en: 'exactly 2' },
          { ru: 'ни одной', uz: "birortasi ham yo'q", en: 'none' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Любая прямая через центр подходит.', uz: "To'g'ri. Markazdan o'tgan har qanday to'g'ri chiziq to'g'ri keladi.", en: 'Right. Every line through the centre works.' },
        wrong: [
          null,
          { ru: 'Круг можно сложить не только вдоль и поперёк.', uz: "Doirani faqat bo'yiga va ko'ndalangiga emas, boshqa yo'nalishda ham buklash mumkin.", en: 'A disc folds in more directions than two.' },
          { ru: 'Круг складывается пополам, значит ось есть.', uz: "Doira teng ikkiga buklanadi, demak o'q bor.", en: 'A disc folds in half, so it has an axis.' },
        ],
      },
      {
        q: { ru: 'Сколько осей у равнобедренного треугольника?', uz: "Teng yonli uchburchakning nechta o'qi bor?", en: 'How many axes has an isosceles triangle?' },
        opts: ['1', '3', '0'],
        correct: 0,
        ok: { ru: 'Верно. Одна, через вершину и середину основания.', uz: "To'g'ri. Bittasi, uchidan va asos o'rtasidan.", en: 'Right. One, through the apex and the base midpoint.' },
        wrong: [
          null,
          { ru: 'Три оси у равностороннего, а у этого стороны разные.', uz: "Uchta o'q teng tomonlida bo'ladi, bunda esa tomonlar har xil.", en: 'Three axes belong to an equilateral triangle.' },
          { ru: 'Две равные стороны как раз дают ось.', uz: "Ikki teng tomon aynan o'q beradi.", en: 'Two equal sides are exactly what gives an axis.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на оси. Мысленно складывайте фигуру и смотрите, совпали ли половинки.',
        uz: "O'qlar mashqi. Shaklni xayolan buklab, yarmilar mos tushganiga qarang.",
        en: 'Practice on axes. Fold the shape in your head and see whether the halves match.',
      },
    },
  },

  s_coord: {
    title: { ru: 'Отражение в координатах', uz: 'Koordinatalarda akslantirish', en: 'Reflection in coordinates' },
    lead: { ru: 'Через ось y меняется первое число, через ось x — второе.', uz: "y o'qi orqali birinchi son, x o'qi orqali ikkinchisi o'zgaradi.", en: 'The y axis flips the first number, the x axis the second.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Точку (4; 1) отразили через ось y. Где она?', uz: "(4; 1) nuqtasi y o'qi orqali akslantirildi. U qayerda?", en: 'The point (4; 1) is reflected in the y axis. Where is it?' },
        opts: ['(−4; 1)', '(4; −1)', '(−4; −1)'],
        correct: 0,
        ok: { ru: 'Верно. Знак меняется только у первого числа.', uz: "To'g'ri. Ishora faqat birinchi sonda o'zgaradi.", en: 'Right. Only the first number flips.' },
        wrong: [
          null,
          { ru: 'Так отражают через ось x.', uz: "Bunday x o'qi orqali akslantiriladi.", en: 'That reflects in the x axis.' },
          { ru: 'Оба числа меняются при повороте, а не при отражении.', uz: "Ikkala son burilishda o'zgaradi, akslantirishda emas.", en: 'Both flip under a rotation, not a reflection.' },
        ],
      },
      {
        q: { ru: 'Точку (−2; 5) отразили через ось x. Где она?', uz: "(−2; 5) nuqtasi x o'qi orqali akslantirildi. U qayerda?", en: 'The point (−2; 5) is reflected in the x axis. Where?' },
        opts: ['(−2; −5)', '(2; 5)', '(2; −5)'],
        correct: 0,
        ok: { ru: 'Верно. Знак меняется у второго числа.', uz: "To'g'ri. Ishora ikkinchi sonda o'zgaradi.", en: 'Right. The second number flips.' },
        wrong: [
          null,
          { ru: 'Так отражают через ось y.', uz: "Bunday y o'qi orqali akslantiriladi.", en: 'That reflects in the y axis.' },
          { ru: 'Через одну ось меняется только одно число.', uz: "Bitta o'q orqali faqat bitta son o'zgaradi.", en: 'One axis flips only one number.' },
        ],
      },
      {
        q: { ru: 'Точка (0; 3) лежит на оси y. Где её пара?', uz: "(0; 3) nuqtasi y o'qida yotadi. Uning jufti qayerda?", en: 'The point (0; 3) lies on the y axis. Its pair?' },
        opts: [
          { ru: 'там же, (0; 3)', uz: "o'sha yerda, (0; 3)", en: 'in place, (0; 3)' },
          { ru: '(0; −3)', uz: '(0; −3)', en: '(0; −3)' },
          { ru: '(3; 0)', uz: '(3; 0)', en: '(3; 0)' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Точки самой оси остаются на месте.', uz: "To'g'ri. O'qning o'z nuqtalari joyida qoladi.", en: 'Right. Points on the axis stay put.' },
        wrong: [
          null,
          { ru: 'Так вышло бы при отражении через ось x.', uz: "x o'qi orqali akslantirishda shunday bo'lardi.", en: 'That would be a reflection in the x axis.' },
          { ru: 'Числа не переставляются местами.', uz: "Sonlar o'rin almashmaydi.", en: 'The numbers do not swap places.' },
        ],
      },
      {
        q: { ru: 'Что сохраняется при отражении?', uz: 'Akslantirishda nima saqlanadi?', en: 'What is preserved by a reflection?' },
        opts: [
          { ru: 'расстояние до оси', uz: "o'qgacha masofa", en: 'the distance to the axis' },
          { ru: 'сторона от оси', uz: "o'qdan tomon", en: 'the side of the axis' },
          { ru: 'знаки координат', uz: 'koordinatalar ishorasi', en: 'the signs of the coordinates' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Расстояние то же, сторона другая.', uz: "To'g'ri. Masofa o'sha, tomon boshqa.", en: 'Right. Same distance, other side.' },
        wrong: [
          null,
          { ru: 'Сторона как раз меняется, иначе это не отражение.', uz: "Tomon aynan o'zgaradi, aks holda bu akslantirish emas.", en: 'The side is exactly what changes.' },
          { ru: 'Один из знаков обязательно меняется.', uz: "Ishoralardan biri albatta o'zgaradi.", en: 'One of the signs must flip.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на координаты. Смотрите, через какую ось отражают.',
        uz: "Koordinatalar mashqi. Qaysi o'q orqali akslantirilayotganiga qarang.",
        en: 'Practice on coordinates. See which axis the reflection uses.',
      },
    },
  },

  s_bins: {
    title: { ru: 'Есть ли ось симметрии?', uz: "Simmetriya o'qi bormi?", en: 'Does it have an axis?' },
    lead: { ru: 'Проверяй складыванием: совпало или нет?', uz: "Buklab tekshiring: mos tushdimi yoki yo'q?", en: 'Test by folding: match or no match?' },
    bin_a: { ru: 'Ось есть', uz: "O'q bor", en: 'Has an axis' },
    bin_b: { ru: 'Оси нет', uz: "O'q yo'q", en: 'No axis' },
    cards: [
      { label: { ru: 'квадрат', uz: 'kvadrat', en: 'a square' }, bin: 'a' },
      { label: { ru: 'круг', uz: 'doira', en: 'a disc' }, bin: 'a' },
      { label: { ru: 'равнобедренный треугольник', uz: 'teng yonli uchburchak', en: 'an isosceles triangle' }, bin: 'a' },
      { label: { ru: 'разносторонний треугольник', uz: 'har xil tomonli uchburchak', en: 'a scalene triangle' }, bin: 'b' },
      { label: { ru: 'спираль', uz: 'spiral', en: 'a spiral' }, bin: 'b' },
      { label: { ru: 'запятая', uz: 'vergul', en: 'a comma' }, bin: 'b' },
    ],
    hint: {
      ru: 'Ось есть, если фигуру можно сложить так, что половинки лягут точно друг на друга.',
      uz: "Shaklni yarmilari bir-birining ustiga aniq tushadigan qilib buklash mumkin bo'lsa, o'q bor.",
      en: 'An axis exists if the shape folds so the halves lie exactly on top of each other.',
    },
    correct_text: {
      ru: 'Верно. Симметрия это не «две равные части», а точное совпадение при складывании.',
      uz: "To'g'ri. Simmetriya bu «ikki teng qism» emas, buklaganda aniq moslik.",
      en: 'Right. Symmetry is not “two equal parts” but an exact match when folded.',
    },
    audio: {
      intro: {
        ru: 'Разложите фигуры по двум корзинам. Проверяйте складыванием.',
        uz: 'Shakllarni ikki savatga ajrating. Buklab tekshiring.',
        en: 'Sort the shapes into two baskets. Test by folding.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Попробуй сложить мысленно.', uz: "Bu yerga emas. Xayolan buklab ko'ring.", en: 'Not here. Try folding it in your head.' },
    },
  },

  s_error: {
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Бекзод: «Диагональ делит прямоугольник пополам, значит это ось». Проверь.', uz: "Bekzod: «Diagonal to'g'ri to'rtburchakni teng ikkiga bo'ladi, demak bu o'q». Tekshiring.", en: 'Bekzod: “A diagonal halves a rectangle, so it is an axis.” Check it.' },
        opts: [
          { ru: 'Нет: части равны, но при сгибе не совпадают', uz: "Yo'q: qismlar teng, lekin buklaganda mos tushmaydi", en: 'No: the parts are equal but do not match when folded' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, диагональ вообще не делит пополам', uz: "Yo'q, diagonal umuman teng ikkiga bo'lmaydi", en: 'No, a diagonal does not halve it at all' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Равные части и симметрия это разные вещи.', uz: "To'g'ri. Teng qismlar va simmetriya boshqa-boshqa narsa.", en: 'Right. Equal parts and symmetry are different things.' },
        wrong: [
          null,
          { ru: 'Сложите по диагонали: длинная сторона ляжет на короткую.', uz: "Diagonal bo'ylab buklang: uzun tomon qisqasining ustiga tushadi.", en: 'Fold along the diagonal: the long side lands on the short one.' },
          { ru: 'Делит пополам, но по площади, а не зеркально.', uz: "Teng ikkiga bo'ladi, lekin yuzi bo'yicha, ko'zgudek emas.", en: 'It halves the area but not as a mirror.' },
        ],
      },
      {
        q: { ru: 'Мехри: «(5; 2) через ось y даёт (5; −2)». Проверь.', uz: "Mehri: «(5; 2) y o'qi orqali (5; −2) beradi». Tekshiring.", en: 'Mehri: “(5; 2) in the y axis gives (5; −2).” Check it.' },
        opts: [
          { ru: 'Нет: через ось y меняется первое число, (−5; 2)', uz: "Yo'q: y o'qi orqali birinchi son o'zgaradi, (−5; 2)", en: 'No: the y axis flips the first number, (−5; 2)' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет (−5; −2)', uz: "Yo'q, (−5; −2) bo'ladi", en: 'No, it is (−5; −2)' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Ось y вертикальная, значит меняется горизонталь.', uz: "To'g'ri. y o'qi vertikal, demak gorizontal o'zgaradi.", en: 'Right. The y axis is vertical, so the horizontal part flips.' },
        wrong: [
          null,
          { ru: 'Так отражают через горизонтальную ось.', uz: "Bunday gorizontal o'q orqali akslantiriladi.", en: 'That reflects in the horizontal axis.' },
          { ru: 'Через одну ось меняется только одно число.', uz: "Bitta o'q orqali faqat bitta son o'zgaradi.", en: 'One axis flips only one number.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в осях фигуры, и в координатах.',
        uz: "Birovning yechimini tekshiring. Xato shakl o'qlarida ham, koordinatalarda ham bo'ladi.",
        en: 'Check someone else’s work. A mistake can be in the axes of a shape and in the coordinates.',
      },
    },
  },

  s_task: {
    title: { ru: 'Узор на сюзане', uz: "So'zanadagi naqsh", en: 'The suzani pattern' },
    lead: { ru: 'Мастерица вышила левую половину и складывает салфетку.', uz: "Kashtachi chap yarmini tikdi va salfetkani buklaydi.", en: 'The embroiderer stitched the left half and folds the cloth.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Цветок в 6 см слева от сгиба. Где его пара?', uz: "Gul bukilishdan 6 sm chapda. Uning jufti qayerda?", en: 'A flower 6 cm left of the fold. Where is its pair?' },
        opts: [
          { ru: 'в 6 см справа', uz: "6 sm o'ngda", en: '6 cm to the right' },
          { ru: 'в 12 см справа', uz: "12 sm o'ngda", en: '12 cm to the right' },
          { ru: 'в 3 см справа', uz: "3 sm o'ngda", en: '3 cm to the right' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Расстояние то же, сторона другая.', uz: "To'g'ri. Masofa o'sha, tomon boshqa.", en: 'Right. Same distance, other side.' },
        wrong: [
          null,
          { ru: 'Расстояние не удваивается.', uz: 'Masofa ikkilanmaydi.', en: 'The distance does not double.' },
          { ru: 'Расстояние не уменьшается вдвое.', uz: 'Masofa ikki barobar kamaymaydi.', en: 'The distance is not halved.' },
        ],
      },
      {
        q: { ru: 'На левой половине 7 цветков. Сколько будет всего?', uz: "Chap yarmida 7 ta gul. Jami nechta bo'ladi?", en: 'Seven flowers on the left half. How many in total?' },
        opts: ['14', '7', '21'],
        correct: 0,
        ok: { ru: 'Верно. У каждого цветка появится пара.', uz: "To'g'ri. Har bir gulning jufti paydo bo'ladi.", en: 'Right. Every flower gets a pair.' },
        wrong: [
          null,
          { ru: 'Отражение добавляет столько же цветков.', uz: "Akslantirish shuncha gul qo'shadi.", en: 'The reflection adds the same number again.' },
          { ru: 'Половинок две, а не три.', uz: 'Yarmilar ikkita, uchta emas.', en: 'There are two halves, not three.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про сюзане. Мастерица вышила левую половину узора и складывает салфетку по линии сгиба.',
        uz: "So'zana haqida masala. Kashtachi naqshning chap yarmini tikdi va salfetkani bukilish chizig'i bo'ylab buklaydi.",
        en: 'A suzani problem. The embroiderer stitched the left half and folds the cloth along the fold line.',
      },
    },
  },

  s_final: {
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 4,
        q: { ru: 'Сколько осей симметрии у квадрата? Набери число.', uz: "Kvadratning nechta simmetriya o'qi bor? Sonni tering.", en: 'How many axes has a square? Type the number.' },
        hint: { ru: 'Две через середины сторон и две по диагоналям.', uz: "Ikkitasi tomonlar o'rtasidan, ikkitasi diagonallar bo'ylab.", en: 'Two through the side midpoints and two along the diagonals.' },
        hint_audio: { ru: 'Складывайте квадрат вдоль, поперёк и по двум диагоналям: каждый раз половинки совпадают.', uz: "Kvadratni bo'yiga, ko'ndalangiga va ikki diagonal bo'ylab buklang: har safar yarmilar mos tushadi.", en: 'Fold a square lengthwise, crosswise and along both diagonals: the halves match every time.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Точку (7; 3) отразили через ось y. Где она?', uz: "(7; 3) nuqtasi y o'qi orqali akslantirildi. U qayerda?", en: 'The point (7; 3) reflected in the y axis. Where?' },
        opts: ['(7; −3)', '(−7; −3)', '(−7; 3)', '(3; 7)'],
        wrong: [
          { ru: 'Так отражают через ось x.', uz: "Bunday x o'qi orqali akslantiriladi.", en: 'That reflects in the x axis.' },
          { ru: 'Через одну ось меняется только одно число.', uz: "Bitta o'q orqali faqat bitta son o'zgaradi.", en: 'One axis flips only one number.' },
          null,
          { ru: 'Числа не переставляются местами.', uz: "Sonlar o'rin almashmaydi.", en: 'The numbers do not swap.' },
        ],
        correct: { ru: 'Верно. Ось y вертикальная, меняется первое число.', uz: "To'g'ri. y o'qi vertikal, birinchi son o'zgaradi.", en: 'Right. The y axis is vertical, so the first number flips.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Сколько осей симметрии у прямоугольника?', uz: "To'g'ri to'rtburchakning nechta o'qi bor?", en: 'How many axes has a rectangle?' },
        opts_i18n: [
          { ru: '4', uz: '4', en: '4' },
          { ru: '2', uz: '2', en: '2' },
          { ru: '1', uz: '1', en: '1' },
          { ru: 'бесконечно много', uz: "cheksiz ko'p", en: 'infinitely many' },
        ],
        wrong: [
          { ru: 'Четыре у квадрата: там все стороны равны.', uz: "To'rtta kvadratda: unda barcha tomonlar teng.", en: 'Four belongs to a square with equal sides.' },
          null,
          { ru: 'Прямоугольник складывается и вдоль, и поперёк.', uz: "To'g'ri to'rtburchak bo'yiga ham, ko'ndalangiga ham buklanadi.", en: 'A rectangle folds both lengthwise and crosswise.' },
          { ru: 'Бесконечно много осей только у круга.', uz: "Cheksiz ko'p o'q faqat doirada.", en: 'Only a disc has infinitely many.' },
        ],
        correct: { ru: 'Верно. По диагонали половинки не совпадают.', uz: "To'g'ri. Diagonal bo'ylab yarmilar mos tushmaydi.", en: 'Right. Along a diagonal the halves do not match.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Что верно про точку и её пару?', uz: "Nuqta va uning jufti haqida nima to'g'ri?", en: 'What is true of a point and its pair?' },
        opts: [
          { ru: 'лежат по одну сторону оси', uz: "o'qning bir tomonida yotadi", en: 'they lie on the same side' },
          { ru: 'расстояния до оси разные', uz: "o'qgacha masofalari har xil", en: 'their distances differ' },
          { ru: 'отрезок между ними идёт вдоль оси', uz: "ular orasidagi kesma o'q bo'ylab boradi", en: 'the segment runs along the axis' },
          { ru: 'равноудалены и отрезок перпендикулярен оси', uz: "teng masofada va kesma o'qqa perpendikular", en: 'equally far, with a perpendicular segment' },
        ],
        wrong: [
          { ru: 'Пара всегда по другую сторону.', uz: 'Juft har doim boshqa tomonda.', en: 'The pair is always on the other side.' },
          { ru: 'Расстояния как раз равны.', uz: 'Masofalar aynan teng.', en: 'The distances are exactly equal.' },
          { ru: 'Отрезок пересекает ось под прямым углом.', uz: "Kesma o'qni to'g'ri burchak ostida kesadi.", en: 'The segment crosses the axis at a right angle.' },
          null,
        ],
        correct: { ru: 'Верно. Это и есть точная проверка симметрии.', uz: "To'g'ri. Bu simmetriyaning aniq tekshiruvi.", en: 'Right. That is the exact test for symmetry.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Цветок в 9 см от сгиба. Где его пара на сюзане?', uz: "Gul bukilishdan 9 sm da. So'zanada uning jufti qayerda?", en: 'A flower 9 cm from the fold. Where is its pair?' },
        opts: [
          { ru: 'в 9 см по другую сторону', uz: '9 sm boshqa tomonda', en: '9 cm on the other side' },
          { ru: 'в 18 см по другую сторону', uz: '18 sm boshqa tomonda', en: '18 cm on the other side' },
          { ru: 'в 9 см по ту же сторону', uz: "9 sm o'sha tomonda", en: '9 cm on the same side' },
          { ru: 'на самом сгибе', uz: 'aynan bukilishda', en: 'on the fold itself' },
        ],
        wrong: [
          null,
          { ru: 'Расстояние сохраняется, а не удваивается.', uz: 'Masofa saqlanadi, ikkilanmaydi.', en: 'The distance is kept, not doubled.' },
          { ru: 'Тогда узор не совпал бы при складывании.', uz: 'U holda buklaganda naqsh mos tushmasdi.', en: 'Then the pattern would not match when folded.' },
          { ru: 'На сгибе остаются только точки самой линии.', uz: "Bukilishda faqat chiziqning o'z nuqtalari qoladi.", en: 'Only points of the line itself stay on the fold.' },
        ],
        correct: { ru: 'Верно. Такое же расстояние, но зеркально.', uz: "To'g'ri. Xuddi shu masofa, lekin ko'zgudek.", en: 'Right. The same distance, but mirrored.' },
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
      ru: 'Снаружи живое почти всегда симметрично: крылья бабочки, лицо, лапы. Так удобнее двигаться прямо и держать равновесие. А внутри симметрии нет: сердце смещено влево, печень справа, кишечник свёрнут спиралью. Снаружи важна ориентация в движении, внутри — плотная упаковка.',
      uz: "Tashqi tomondan tirik jonzot deyarli har doim simmetrik: kapalak qanotlari, yuz, panjalar. Shunda to'g'ri harakatlanish va muvozanat saqlash qulay. Ichkarida esa simmetriya yo'q: yurak chapga surilgan, jigar o'ngda, ichak spiral shaklida o'ralgan. Tashqarida harakat yo'nalishi, ichkarida esa zich joylashuv muhim.",
      en: 'On the outside living things are almost always symmetric: butterfly wings, faces, limbs. That makes moving straight and balancing easier. Inside there is no symmetry: the heart sits left, the liver right, the gut coils. Outside, orientation in motion matters; inside, tight packing does.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Снаружи живое почти всегда симметрично: крылья бабочки, лицо, лапы. Так удобнее двигаться прямо и держать равновесие. А внутри симметрии нет: сердце смещено влево, печень справа, кишечник свёрнут спиралью. Снаружи важна ориентация в движении, а внутри плотная упаковка.',
      uz: "Bilasizmi? Tashqi tomondan tirik jonzot deyarli har doim simmetrik: kapalak qanotlari, yuz, panjalar. Shunda to'g'ri harakatlanish va muvozanat saqlash qulay. Ichkarida esa simmetriya yo'q: yurak chapga surilgan, jigar o'ngda, ichak spiral shaklida o'ralgan. Tashqarida harakat yo'nalishi, ichkarida esa zich joylashuv muhim.",
      en: 'Did you know? On the outside living things are almost always symmetric: butterfly wings, faces, limbs. That makes moving straight and balancing easier. Inside there is no symmetry: the heart sits left, the liver right, the gut coils. Outside, orientation in motion matters; inside, tight packing does.',
    },
  },

  s14: {
    banner: { ru: 'Математика · Геометрия', uz: 'Matematika · Geometriya', en: 'Mathematics · Geometry' },
    heading: { ru: 'Осевая симметрия', uz: "O'q simmetriyasi", en: 'Reflection symmetry' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'ось — линия сгиба, половинки совпадают', uz: "o'q — buklash chizig'i, yarmilar mos tushadi", en: 'an axis is a fold line: the halves match' },
    brief_2: { ru: 'точка и пара равноудалены от оси', uz: "nuqta va jufti o'qdan teng masofada", en: 'a point and its pair are equally far' },
    brief_3: { ru: 'через ось y меняется первое число', uz: "y o'qi orqali birinchi son o'zgaradi", en: 'the y axis flips the first number' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Прямоугольник', uz: "To'g'ri to'rtburchak", en: 'A rectangle' },
    memo_a1: { ru: 'имеет 2 оси, не 4', uz: "2 o'qi bor, 4 emas", en: 'has 2 axes, not 4' },
    memo_q2: { ru: 'Точки на оси', uz: "O'qdagi nuqtalar", en: 'Points on the axis' },
    memo_a2: { ru: 'остаются на месте', uz: 'joyida qoladi', en: 'stay put' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'считать диагональ осью', uz: "diagonalni o'q deb hisoblash", en: 'calling a diagonal an axis' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Ось симметрии это линия сгиба, по которой половинки фигуры совпадают. Точка и её пара лежат по разные стороны оси на равном расстоянии, а отрезок между ними перпендикулярен оси. Отражение через вертикальную ось меняет знак первой координаты, через горизонтальную второй.',
        'Салфетка: у прямоугольника две оси, а не четыре.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Simmetriya o'qi bu buklash chizig'i, uning bo'yicha shakl yarmilari mos tushadi. Nuqta va uning jufti o'qning har xil tomonida teng masofada yotadi, kesma esa o'qqa perpendikular. Vertikal o'q orqali akslantirish birinchi koordinata ishorasini, gorizontal orqali ikkinchisini o'zgartiradi.",
        "Salfetka: to'g'ri to'rtburchakda ikkita o'q, to'rtta emas.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'An axis of symmetry is a fold line along which the halves match. A point and its pair lie on opposite sides at equal distance, and the segment between them is perpendicular to the axis. Reflecting in the vertical axis flips the first coordinate, in the horizontal one the second.',
        'The cloth: a rectangle has two axes, not four.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Сложи мысленно', uz: 'Usul. Xayolan buklang', en: 'Method. Fold it mentally' },
    m1_steps: {
      ru: ['Проведи линию и мысленно сложи по ней', 'Проверь, совпали ли половинки', 'Для точки отмерь то же расстояние с другой стороны'],
      uz: ["Chiziq o'tkazing va uning bo'yicha xayolan buklang", 'Yarmilar mos tushganini tekshiring', "Nuqta uchun boshqa tomonga xuddi shu masofani o'lchang"],
      en: ['Draw a line and fold along it in your head', 'Check whether the halves match', 'For a point, measure the same distance on the other side'],
    },
    m1_no: {
      ru: 'Равные по площади части ещё не значат симметрию: диагональ прямоугольника не ось.',
      uz: "Yuzi teng qismlar hali simmetriya emas: to'g'ri to'rtburchak diagonali o'q emas.",
      en: 'Equal areas do not mean symmetry: a rectangle’s diagonal is not an axis.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: кружок вышивки, сюзане на пяльцах.
// ============================================================
// СЦЕНА ХУКА — кружок вышивки. Салфетка натянута на раму и стоит на столе:
// раньше прямоугольник висел в воздухе, а стола под ним не было.
// Четыре линии сгиба нарисованы ОДИНАКОВО: сцена показывает, что пробуют, но
// не подсказывает, какие из них подойдут — это и есть вопрос экрана.
// Движение одно и один раз: правая половина складывается на левую и
// возвращается. Дальше живёт только игла со стежком.
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d40wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#EFE4D2"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d40wall)"/>

    {/* Готовое сюзане на стене: зеркальный орнамент */}
    <g>
      <rect x="10" y="10" width="88" height="82" rx="4" fill="#F4EEDF" stroke="#C9A472" strokeWidth="2"/>
      <path d="M54 10 v82" stroke="#C9A472" strokeWidth="1.2" strokeDasharray="5 4"/>
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <circle cx={36} cy={28 + k * 24} r="7.5" fill="#D9603F" opacity="0.8"/>
          <circle cx={72} cy={28 + k * 24} r="7.5" fill="#D9603F" opacity="0.8"/>
          <path d={`M36 ${28 + k * 24} h-12`} stroke="#3F5B4A" strokeWidth="1.8"/>
          <path d={`M72 ${28 + k * 24} h12`} stroke="#3F5B4A" strokeWidth="1.8"/>
        </g>
      ))}
    </g>

    <rect x="0" y="124" width="400" height="30" fill="#D2A96F"/>
    <Person x={344} ground={124} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={380} ground={124} head={13} shirt="#8FBF7F" hair="#5A4636"/>

    {/* Стол */}
    <rect x="118" y="112" width="214" height="7" rx="2" fill="#C9A472"/>
    <rect x="118" y="119" width="214" height="5" fill="#B08A57"/>

    {/* Рама с натянутой салфеткой */}
    <g>
      <rect x="132" y="28" width="186" height="86" rx="4" fill="#C9A472"/>
      <rect x="140" y="36" width="170" height="70" rx="2" fill="#FFFDF7" stroke="#E4D9C6" strokeWidth="1.4"/>

      {/* левая половина узора */}
      <g>
        <path d="M172 58 q10 -12 20 0 q-10 10 -20 0" fill="#8FBF7F"/>
        <circle cx="182" cy="86" r="6" fill="#F5C77E"/>
      </g>
      {/* правая половина складывается на левую */}
      <g className="d40-fold">
        <path d="M258 58 q10 -12 20 0 q-10 10 -20 0" fill="#8FBF7F"/>
        <circle cx="268" cy="86" r="6" fill="#F5C77E"/>
      </g>

      {/* четыре линии сгиба, которые пробуют: все одинаковые */}
      <g stroke="#8A8883" strokeWidth="1.6" strokeDasharray="6 4" opacity="0.75">
        <path d="M225 36 v70"/>
        <path d="M140 71 h170"/>
        <path d="M140 36 L310 106"/>
        <path d="M310 36 L140 106"/>
      </g>
    </g>

    {/* Игла со стежком: единственная фоновая жизнь */}
    <g className="d40-needle">
      <path d="M0 0 l14 -14" stroke="#8E8578" strokeWidth="2" strokeLinecap="round"/>
      <path d="M0 0 q-8 6 -14 4" fill="none" stroke="#D9603F" strokeWidth="1.6"/>
    </g>
  </svg>
);

// ФИНАЛ — та же рама на том же столе. Ответ виден предметом: две линии, по
// которым половинки совпали, зелёные; две диагонали перечёркнуты — по ним не
// совпало. Рядом счёт: осей две.
const FinalScene = () => {
  const lang = useLang();
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      <rect x="0" y="74" width="400" height="18" fill="#D2A96F"/>
      <rect x="26" y="66" width="180" height="5" rx="2" fill="#C9A472"/>
      <rect x="26" y="71" width="180" height="3" fill="#B08A57"/>

      <g>
        <rect x="36" y="10" width="160" height="58" rx="3" fill="#C9A472"/>
        <rect x="42" y="16" width="148" height="46" rx="2" fill="#FFFDF7" stroke="#E4D9C6" strokeWidth="1.2"/>
        <g>
          <path d="M74 32 q8 -10 16 0 q-8 8 -16 0" fill="#8FBF7F"/>
          <path d="M142 32 q8 -10 16 0 q-8 8 -16 0" fill="#8FBF7F"/>
          <circle cx="82" cy="50" r="5" fill="#F5C77E"/>
          <circle cx="150" cy="50" r="5" fill="#F5C77E"/>
        </g>
        {/* две настоящие оси */}
        <g stroke="#1F7A4D" strokeWidth="2" strokeDasharray="6 4">
          <path d="M116 16 v46"/>
          <path d="M42 39 h148"/>
        </g>
        {/* две диагонали, которые не подошли */}
        <g stroke="#C9C7C2" strokeWidth="1.4" strokeDasharray="4 5">
          <path d="M42 16 L190 62"/>
          <path d="M190 16 L42 62"/>
        </g>
      </g>

      <Person x={238} ground={74} head={9} shirt="#8FBF7F" hair="#5A4636"/>

      <rect x="278" y="20" width="104" height="34" rx="8" fill="#E3F0E8" stroke="#1F7A4D" strokeWidth="2"/>
      <text x="330" y="43" textAnchor="middle" fill="#1F7A4D"
        fontFamily="'JetBrains Mono', monospace" fontSize="17" fontWeight="700">2</text>
      <text x="330" y="70" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fontWeight="700">
        {tri(lang, 'оси симметрии', "simmetriya o'qlari", 'axes of symmetry')}
      </text>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Прибор урока: клетчатое поле с осью, точкой и её парой.
const Mirror = ({ dx = 3, pair = false, ticks = false, size = 'mid' }) => {
  const cell = 18; const ax = 140; const cy = 84;
  const px = (n) => ax + n * cell;
  return (
    <span className={'d40-mirror-box d40-mirror-' + size}>
      <svg viewBox="0 0 280 156" aria-hidden="true">
        <g opacity="0.5">
          {Array.from({ length: 15 }, (_, i) => (
            <path key={'v' + i} d={`M${14 + i * cell} 18 v120`} stroke="#E3DCCE" strokeWidth="1"/>
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <path key={'h' + i} d={`M14 ${18 + i * cell} h${14 * cell}`} stroke="#E3DCCE" strokeWidth="1"/>
          ))}
        </g>
        <path d={`M${ax} 14 v128`} stroke="#D9603F" strokeWidth="2.6" strokeDasharray="6 4"/>
        <text x={ax} y="10" textAnchor="middle" fill="#D9603F"
          fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700">o</text>

        <circle cx={px(dx)} cy={cy} r="6" fill="#019ACB"/>
        <text x={px(dx)} y={cy - 12} textAnchor="middle" fill="#019ACB"
          fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">A</text>
        {pair && (
          <g>
            <circle cx={px(-dx)} cy={cy} r="6" fill="#1F7A4D"/>
            <text x={px(-dx)} y={cy - 12} textAnchor="middle" fill="#1F7A4D"
              fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">A'</text>
          </g>
        )}
        {ticks && (
          <g>
            <path d={`M${px(-dx)} ${cy} H${px(dx)}`} stroke="#8A8883" strokeWidth="1.4" strokeDasharray="3 3"/>
            <text x={px(dx / 2)} y={cy + 18} textAnchor="middle" fill="#8A8883"
              fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700">{dx}</text>
            <text x={px(-dx / 2)} y={cy + 18} textAnchor="middle" fill="#8A8883"
              fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700">{dx}</text>
          </g>
        )}
      </svg>
    </span>
  );
};

// Фигура и её оси симметрии.
const Axes = ({ kind = 'rect', show = 0 }) => (
  <span className="d40-axes-box">
    <svg viewBox="0 0 260 120" aria-hidden="true">
      {kind === 'rect' && (
        <g>
          <rect x="24" y="24" width="120" height="72" fill="#E7F5FA" stroke="#019ACB" strokeWidth="2.4"/>
          {show >= 1 && <path d="M84 18 v84" stroke="#1F7A4D" strokeWidth="2.4" strokeDasharray="6 4"/>}
          {show >= 1 && <path d="M18 60 h132" stroke="#1F7A4D" strokeWidth="2.4" strokeDasharray="6 4"/>}
          {show >= 2 && <path d="M24 24 L144 96 M144 24 L24 96" stroke="#D9603F" strokeWidth="1.8" strokeDasharray="4 5"/>}
          {show >= 2 && (
            <text x="200" y="64" textAnchor="middle" fill="#D9603F"
              fontFamily="'JetBrains Mono', monospace" fontSize="20" fontWeight="700">2</text>
          )}
        </g>
      )}
      {kind === 'square' && (
        <g>
          <rect x="52" y="24" width="72" height="72" fill="#E3F0E8" stroke="#1F7A4D" strokeWidth="2.4"/>
          <path d="M88 18 v84 M46 60 h84" stroke="#1F7A4D" strokeWidth="2.4" strokeDasharray="6 4"/>
          <path d="M52 24 L124 96 M124 24 L52 96" stroke="#1F7A4D" strokeWidth="2.4" strokeDasharray="6 4"/>
          <text x="196" y="64" textAnchor="middle" fill="#1F7A4D"
            fontFamily="'JetBrains Mono', monospace" fontSize="20" fontWeight="700">4</text>
        </g>
      )}
    </svg>
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d40-line d40-fade' + (on ? ' d40-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d40-stage">
        <Mirror size="sm" dx={3} pair={step >= 1} ticks={step >= 1}/>
        <span className={'d40-chips d40-fade' + (step >= 2 ? ' d40-on' : '')}>
          <i className="d40-chip-l">{tri(lang, 'по перпендикуляру', "perpendikular bo'ylab", 'along the perpendicular')}</i>
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

// Ядро: сгиб как зеркало.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d40-stage d40-stage-row">
        <Mirror size="sm" dx={4} pair={step >= 1} ticks={step >= 2}/>
        <span className="d40-col">
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

// Оси фигур.
const AxesBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_axes;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d40-stage d40-stage-row">
        {step >= 1 ? <Axes kind="square"/> : <Axes kind="rect" show={step >= 0 ? 2 : 1}/>}
        <span className="d40-col">
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
      <div className="frame fade-up delay-1 d40-stage">
        <span className="d40-coord">
          <i className="d40-c-a">(3; 2)</i>
          <b>→</b>
          <i className={'d40-c-b d40-fade' + (step >= 0 ? ' d40-on' : '')}>(−3; 2)</i>
          <b className={'d40-fade' + (step >= 1 ? ' d40-on' : '')}>·</b>
          <i className={'d40-c-c d40-fade' + (step >= 1 ? ' d40-on' : '')}>(3; −2)</i>
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

// Граница: диагональ не ось.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d40-stage">
        <span className="d40-pair d40-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d40-pair d40-pair-good d40-fade' + (step >= 1 ? ' d40-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d40-pair d40-pair-warn d40-fade' + (step >= 2 ? ' d40-on' : '')}>
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
    <Stage screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <div className={'d40-banner fade-up delay-1' + (phase === 'play' ? ' d40-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d40-stage d40-stage-tool d40-stage-row">
          {phase === 'demo' ? (
            <>
              <Mirror size="xs" dx={3} pair={shown >= 1} ticks={shown >= 2}/>
              <span className="d40-col">
                {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
                <p className={'body d40-verdict' + (done ? ' d40-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
              </span>
            </>
          ) : (
            <span className="d40-col">
              <p className="body" style={{ margin: '0 0 10px', fontWeight: 600 }}>{mt(t(c.play_ask))}</p>
              <div className="sv-opts">
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
            </span>
          )}
        </div>

        {phase === 'demo' && (
          <div className="d40-acts fade-up">
            <button className="d40-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d40-btn d40-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenAxes = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_axes} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <AxesBody step={step}/>}/>
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
      <div className="d40-stage d40-stage-flat">
        <Mirror size="xs" dx={3} pair ticks/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenCount = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_count} asideNode={methodAside}/>
);
const ScreenCoord = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_coord} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: половина узора и её отражение.
const TaskFig = ({ idx }) => (
  <div className="d40-task-fig">
    <svg viewBox="0 0 260 114" aria-hidden="true">
      <rect x="18" y="14" width="224" height="76" rx="3" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2"/>
      <path d="M130 10 v84" stroke="#D9603F" strokeWidth="2.4" strokeDasharray="6 4"/>
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <circle cx={64} cy={30 + k * 22} r="7" fill="#8FBF7F"/>
          <g opacity={idx >= 1 ? 1 : 0.25}>
            <circle cx={196} cy={30 + k * 22} r="7" fill="#8FBF7F"/>
          </g>
        </g>
      ))}
      <text x="64" y="110" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="9" fontWeight="700">6 cm</text>
      <text x="196" y="110" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="9" fontWeight="700">6 cm</text>
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
.d40-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
/* Экран правила НА ТЕЛЕФОНЕ: чертёж лежит внутри рамки, и своя подкладка
   удваивала отступ — по-русски содержимое уходило под нижнюю панель. Высота
   чертежа ограничена, иначе он растягивается по ширине и отыгрывает высоту
   обратно. Десктоп не тронут: там места хватало. */
@media (max-width: 639.98px) {
  .d40-stage-flat { padding: 0 !important; }
  .d40-stage-flat svg { max-height: 88px; }
}
.d40-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d40-stage-tool .d40-line { font-size: clamp(12px, 2vw, 16px); }
.d40-stage-row { flex-direction: row; align-items: center; justify-content: center; gap: clamp(10px, 2.4vw, 22px); flex-wrap: wrap; }
.d40-col { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.1vw, 9px); flex: 1 1 200px; min-width: 0; }

/* Клетчатое поле с осью */
.d40-mirror-box { display: block; width: 100%; max-width: 270px; }
.d40-mirror-sm { max-width: 234px; }
.d40-mirror-xs { max-width: 196px; }
.d40-mirror-box svg { width: 100%; height: auto; display: block; }
.d40-axes-box { display: block; width: 100%; max-width: 240px; }
.d40-axes-box svg { width: 100%; height: auto; display: block; }

.d40-fade { opacity: 0; transition: opacity 420ms linear; }
.d40-on { opacity: 1; }
.d40-line { font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 16px); font-weight: 700; color: #494550; text-align: center; }

/* Координаты */
.d40-coord { display: inline-flex; align-items: center; gap: clamp(6px, 1.4vw, 12px); flex-wrap: wrap; justify-content: center; }
.d40-coord b { font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 2.6vw, 20px); color: #8A8883; }
.d40-coord i { font-style: normal; padding: 6px 14px; border-radius: 12px; font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 2.6vw, 21px); font-weight: 700; }
.d40-c-a { background: #F4F1EA; border: 1px solid #E9E3D9; color: #494550; }
.d40-c-b { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }
.d40-c-c { background: #E3F0E8; border: 1px solid #A9CFBA; color: #1F7A4D; }

/* Подписи */
.d40-chips { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d40-chips i { font-style: normal; padding: 5px 12px; border-radius: 10px; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 15px); font-weight: 700; }
.d40-chip-l { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }

/* Строки экрана границы */
.d40-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d40-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d40-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d40-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d40-task-fig { display: flex; justify-content: center; width: 100%; }
.d40-task-fig svg { width: 100%; max-width: 260px; height: auto; display: block; }

/* Экран 4 */
.d40-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d40-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d40-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d40-verdict-on { opacity: 1; }
.d40-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d40-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d40-btn:disabled { opacity: 0.45; cursor: default; }
.d40-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d40-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: линия сгиба мигает, иголка делает стежок */
/* Складывание — одно движение за проход: правая половина узора поворачивается
   вокруг вертикальной линии сгиба (225) на левую и возвращается. Это настоящий
   сгиб: зеркальное отражение относительно оси, а не сдвиг.
   В keyframes НЕТ переноса, поэтому transform-origin здесь указывать МОЖНО и
   нужно — это и есть линия сгиба. */
.d40-fold { animation: d40Fold 4200ms ease-in-out 900ms 1 both; transform-origin: 225px 71px; }
@keyframes d40Fold {
  0% { transform: scaleX(1); }
  38% { transform: scaleX(-1); }
  68% { transform: scaleX(-1); }
  100% { transform: scaleX(1); }
}
.d40-needle { animation: d40Needle 3400ms ease-in-out infinite; transform-origin: 0 0; }
@keyframes d40Needle {
  0%, 100% { transform: translate(300px, 96px); }
  50% { transform: translate(310px, 86px); }
}
@media (prefers-reduced-motion: reduce) {
  .d40-fold { animation: none; }
  .d40-needle { animation: none; transform: translate(304px, 92px); }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function AxisSymmetryLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenAxes, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenCount, ScreenCoord, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
