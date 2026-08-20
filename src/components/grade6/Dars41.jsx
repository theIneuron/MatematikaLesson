// ============================================================
// 6 КЛАСС, УРОК 41 «Центральная симметрия»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б11, третий урок. Центральная симметрия вводится как поворот на
// пол-оборота, а не как второе зеркало. Отдельный экран отдан тому, что
// ось и центр — разные свойства: у равнобедренного треугольника есть
// ось и нет центра, у скошенного четырёхугольника наоборот.
//
// Сцена — школьная площадка, карусель с бумажными фигурами.
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
  lessonId: 'grade6-41',
  lessonTitle: {
    ru: 'Центральная симметрия',
    uz: 'Markaziy simmetriya',
    en: 'Point symmetry',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 karusel: qaysi shakl mos tushadi
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 o'q simmetriyasi esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 markaz: yarim aylanish
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: nuqtani markaz orqali
  { id: 's_which',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 o'q va markaz — boshqa xossalar
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: koordinatalar
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: ikki ishora ham o'zgaradi
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_has',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 markaz bormi x3
  { id: 's_coord',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 koordinatalar x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: markaz bormi
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: karusel
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    title: { ru: 'Пол-оборота карусели', uz: 'Karuselning yarim aylanishi', en: 'Half a turn of the roundabout' },
    lead: {
      ru: 'На карусели четырёхугольник и домик. Её повернули на пол-оборота.',
      uz: "Karuselda ikki shakl yotibdi: qiyshiq to'rtburchak va uycha. Karusel yarim aylantirildi.",
      en: 'Two paper shapes lie on the roundabout: a slanted quadrilateral and a little house. It is turned half a turn.',
    },
    voice_a: { ru: 'Азиз: это домик.', uz: "Aziz: bu uycha.", en: 'Aziz: the house did.' },
    voice_b: { ru: 'Гулноза: нет, четырёхугольник.', uz: "Gulnoza: yo'q, to'rtburchak.", en: 'Gulnoza: no, the quadrilateral did.' },
    ask: { ru: 'Какая фигура совпала со своим контуром?', uz: "Qaysi shakl o'z konturi bilan mos tushdi?", en: 'Which shape matched its own outline?' },
    options: [
      { ru: 'домик', uz: 'uycha', en: 'the house' },
      { ru: 'четырёхугольник', uz: "to'rtburchak", en: 'the quadrilateral' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'На школьной площадке на карусель положили две бумажные фигуры и обвели их. Одна фигура это скошенный четырёхугольник, вторая похожа на домик с треугольной крышей.',
          'Карусель повернули ровно на пол-оборота. Азиз говорит, что домик лёг точно в свой контур, а Гулноза что четырёхугольник. Какая фигура совпала со своим контуром? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Maktab maydonchasida karuselga ikki qog'oz shakl qo'yilib, atrofi chizib olindi. Bir shakl qiyshiq to'rtburchak, ikkinchisi uchburchak tomli uychaga o'xshaydi.",
          "Karusel roppa-rosa yarim aylantirildi. Aziz uycha aynan o'z konturiga tushdi deydi, Gulnoza esa to'rtburchak deydi. Qaysi shakl o'z konturi bilan mos tushdi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'On the school playground two paper shapes were placed on the roundabout and traced. One is a slanted quadrilateral, the other looks like a house with a triangular roof.',
          'The roundabout was turned exactly half a turn. Aziz says the house landed on its outline, Gulnoza says the quadrilateral did. Which shape matched its outline? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    title: { ru: 'Зеркало прошлого урока', uz: "O'tgan darsdagi ko'zgu", en: 'Last lesson’s mirror' },
    done: {
      ru: 'При отражении фигуру переворачивают через линию. Сегодня фигуру не переворачивают, а поворачивают вокруг точки.',
      uz: "Akslantirishda shakl chiziq orqali o'giriladi. Bugun shakl o'girilmaydi, nuqta atrofida buriladi.",
      en: 'A reflection flips a shape across a line. Today the shape is not flipped but turned around a point.',
    },
    audio: {
      ru: [
        'Вспомним прошлый урок. Ось симметрии это линия сгиба: точка и её пара лежат по разные стороны на равном расстоянии.',
        'Отражение похоже на зеркало, фигура переворачивается.',
        'Сегодня движение другое: фигуру не переворачивают, а поворачивают вокруг одной точки. Правило будет похожим, но не таким же.',
      ],
      uz: [
        "O'tgan darsni eslaymiz. Simmetriya o'qi bu buklash chizig'i: nuqta va uning jufti har xil tomonda teng masofada yotadi.",
        "Akslantirish ko'zguga o'xshaydi, shakl o'giriladi.",
        "Bugun harakat boshqa: shakl o'girilmaydi, bitta nuqta atrofida buriladi. Qoida o'xshash bo'ladi, lekin aynan o'shanday emas.",
      ],
      en: [
        'Recall the last lesson. An axis of symmetry is a fold line: a point and its pair lie on opposite sides at equal distance.',
        'A reflection is like a mirror, the shape flips over.',
        'Today the motion is different: the shape is not flipped but turned around a single point. The rule will be similar but not the same.',
      ],
    },
  },

  s_core: {
    title: { ru: 'Поворот на пол-оборота', uz: 'Yarim aylanish', en: 'A half turn' },
    lines: [
      { ru: 'ставим булавку в точку O и поворачиваем', uz: "O nuqtaga to'g'nog'ich sanchib buramiz", en: 'pin the shape at O and turn it' },
      { ru: 'точка A уходит в Aʹ по прямой через O', uz: "A nuqtasi O orqali to'g'ri chiziq bo'ylab Aʹ ga o'tadi", en: 'point A goes to Aʹ along the line through O' },
      { ru: 'O — середина отрезка AAʹ', uz: "O — AAʹ kesmasining o'rtasi", en: 'O is the midpoint of AAʹ' },
    ],
    done: {
      ru: 'Точку O называют центром симметрии. Каждая точка и её пара лежат на одной прямой с центром, и центр делит этот отрезок пополам.',
      uz: "O nuqtasini simmetriya markazi deb atashadi. Har bir nuqta va uning jufti markaz bilan bitta to'g'ri chiziqda yotadi, markaz esa bu kesmani teng ikkiga bo'ladi.",
      en: 'The point O is called the centre of symmetry. Every point and its pair lie on one line with the centre, and the centre halves that segment.',
    },
    audio: {
      ru: [
        'Возьмём фигуру, воткнём булавку в одну точку и повернём фигуру на пол-оборота. Эту точку называют центром симметрии.',
        'Посмотрим, куда уехала точка А. Она оказалась на прямой, которая проходит через центр, но с другой стороны.',
        'И главное: расстояние от центра до А и от центра до её пары одинаковое. Значит центр делит отрезок между ними ровно пополам. Это и есть точная проверка.',
      ],
      uz: [
        "Shaklni olib, bitta nuqtaga to'g'nog'ich sanchamiz va shaklni yarim aylantiramiz. Bu nuqtani simmetriya markazi deb atashadi.",
        "A nuqtasi qayoqqa ketganiga qaraymiz. U markazdan o'tuvchi to'g'ri chiziqda, lekin boshqa tomonda paydo bo'ldi.",
        "Asosiysi: markazdan A gacha va markazdan uning juftigacha masofa bir xil. Demak markaz ular orasidagi kesmani roppa-rosa teng ikkiga bo'ladi. Aniq tekshiruv aynan shu.",
      ],
      en: [
        'Take a shape, pin it at one point and turn it half a turn. That point is called the centre of symmetry.',
        'See where point A went. It ended up on the line through the centre, but on the other side.',
        'And the key part: the distance from the centre to A equals the distance from the centre to its pair. So the centre halves the segment between them. That is the exact test.',
      ],
    },
  },

  s_tool: {
    title: { ru: 'Строим пару через центр', uz: 'Markaz orqali juftini quramiz', en: 'Building the pair through the centre' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: 'проводим прямую от A через центр O', uz: "A dan O markaz orqali to'g'ri chiziq o'tkazamiz", en: 'draw the line from A through the centre O' },
      { ru: 'продолжаем на такое же расстояние', uz: 'xuddi shu masofaga davom etamiz', en: 'continue the same distance' },
      { ru: 'там и стоит пара Aʹ', uz: "Aʹ jufti shu yerda turadi", en: 'the pair Aʹ stands there' },
    ],
    demo_note: {
      ru: 'Пара всегда на прямой через центр, по другую сторону, на том же расстоянии. Центр остаётся на месте.',
      uz: "Juft har doim markaz orqali o'tgan to'g'ri chiziqda, boshqa tomonda, xuddi shu masofada bo'ladi. Markaz joyida qoladi.",
      en: 'The pair is always on the line through the centre, on the other side, the same distance away. The centre stays put.',
    },
    play_ask: { ru: 'A на 3 клетки вправо и 2 вверх от центра. Где Aʹ?', uz: "A markazdan 3 katak o'ngda va 2 katak tepada. Aʹ qayerda?", en: 'A is 3 right and 2 up from the centre. Where is Aʹ?' },
    play_opts: [
      { ru: '3 влево и 2 вниз', uz: '3 chapga va 2 pastga', en: '3 left and 2 down' },
      { ru: '3 влево и 2 вверх', uz: '3 chapga va 2 tepaga', en: '3 left and 2 up' },
      { ru: '3 вправо и 2 вниз', uz: "3 o'ngga va 2 pastga", en: '3 right and 2 down' },
    ],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. Обе стороны меняются: и вправо-влево, и вверх-вниз.',
      uz: "To'g'ri. Ikkala tomon o'zgaradi: o'ng-chap ham, tepa-past ham.",
      en: 'Right. Both directions flip: left-right and up-down.',
    },
    play_wrong: [
      null,
      { ru: 'Так работает зеркало через вертикальную ось, а не поворот.', uz: "Bunday vertikal o'q orqali ko'zgu ishlaydi, burilish emas.", en: 'That is a mirror in the vertical axis, not a turn.' },
      { ru: 'Так работает зеркало через горизонтальную ось.', uz: "Bunday gorizontal o'q orqali ko'zgu ishlaydi.", en: 'That is a mirror in the horizontal axis.' },
    ],
    audio: {
      intro: {
        ru: 'Покажу, как строят пару через центр. Центр отметим точкой O на клетчатом поле.',
        uz: "Markaz orqali juft qanday qurilishini ko'rsataman. Markazni katakli maydonda O nuqtasi bilan belgilaymiz.",
        en: 'I will show how a pair is built through the centre. Mark the centre as O on squared paper.',
      },
      demo: {
        ru: 'Проводим прямую от точки А через центр и продолжаем её дальше. Теперь отмеряем от центра такое же расстояние, как было до А, и ставим пару. Обратите внимание: изменились обе стороны сразу, и по горизонтали, и по вертикали.',
        uz: "A nuqtadan markaz orqali to'g'ri chiziq o'tkazib, uni davom ettiramiz. Endi markazdan A gacha bo'lgan masofani o'lchab, juftini qo'yamiz. E'tibor bering: ikkala tomon birdan o'zgardi, gorizontal ham, vertikal ham.",
        en: 'Draw the line from A through the centre and continue it. Now measure from the centre the same distance as to A and mark the pair. Notice that both directions changed at once, horizontal and vertical.',
      },
      play: {
        ru: 'Теперь ваша очередь. Точка А стоит на три клетки вправо и две вверх от центра. Где её пара?',
        uz: "Endi sizning navbatingiz. A nuqtasi markazdan uch katak o'ngda va ikki katak tepada. Uning jufti qayerda?",
        en: 'Now it is your turn. Point A is three cells right and two up from the centre. Where is its pair?',
      },
      ok: {
        ru: 'Верно. Три клетки влево и две вниз: меняются оба направления.',
        uz: "To'g'ri. Uch katak chapga va ikki katak pastga: ikkala yo'nalish ham o'zgaradi.",
        en: 'Right. Three left and two down: both directions flip.',
      },
      wrong: {
        ru: 'При повороте на пол-оборота меняются оба направления сразу, а не одно.',
        uz: "Yarim aylanishda ikkala yo'nalish birdan o'zgaradi, bittasi emas.",
        en: 'A half turn flips both directions at once, not just one.',
      },
    },
  },

  s_which: {
    title: { ru: 'Ось и центр — разные свойства', uz: "O'q va markaz — boshqa xossalar", en: 'Axis and centre are different things' },
    lines: [
      { ru: 'у прямоугольника есть и оси, и центр', uz: "to'g'ri to'rtburchakda o'qlar ham, markaz ham bor", en: 'a rectangle has axes and a centre' },
      { ru: 'у скошенного четырёхугольника центр есть, осей нет', uz: "qiyshiq to'rtburchakda markaz bor, o'q yo'q", en: 'a slanted quadrilateral has a centre but no axis' },
      { ru: 'у домика ось есть, а центра нет', uz: "uychada o'q bor, markaz yo'q", en: 'the house has an axis but no centre' },
    ],
    done: {
      ru: 'Одно свойство не следует из другого. Домик при повороте встаёт крышей вниз, значит центра у него нет. Права была Гулноза.',
      uz: "Bir xossa ikkinchisidan kelib chiqmaydi. Uycha burilganda tomi pastga qaraydi, demak unda markaz yo'q. Gulnoza haq edi.",
      en: 'One property does not follow from the other. Turned, the house stands roof down, so it has no centre. Gulnoza was right.',
    },
    audio: {
      ru: [
        'Проверим фигуры. Прямоугольник повернули на пол-оборота: он лёг точно в свой контур. Значит центр есть, и он в точке пересечения диагоналей.',
        'Теперь скошенный четырёхугольник. Осей симметрии у него нет: как ни сложи, половинки не совпадут. А вот при повороте на пол-оборота он совпал сам с собой. Центр есть, осей нет.',
        'И домик. Ось симметрии у него есть, вертикальная. Но при повороте крыша оказалась внизу, а значит центра симметрии нет. Права была Гулноза.',
      ],
      uz: [
        "Shakllarni tekshiramiz. To'g'ri to'rtburchak yarim aylantirildi: u aynan o'z konturiga tushdi. Demak markaz bor va u diagonallar kesishgan nuqtada.",
        "Endi qiyshiq to'rtburchak. Unda simmetriya o'qlari yo'q: qanday buklasa ham yarmilar mos tushmaydi. Yarim aylanishda esa u o'zi bilan mos tushdi. Markaz bor, o'q yo'q.",
        "Uycha esa. Unda vertikal simmetriya o'qi bor. Ammo burilganda tomi pastga tushdi, demak simmetriya markazi yo'q. Gulnoza haq edi.",
      ],
      en: [
        'Check the shapes. A rectangle turned half a turn lands exactly on its outline. So it has a centre, where the diagonals cross.',
        'Now the slanted quadrilateral. It has no axes: fold it any way and the halves will not match. But a half turn brings it onto itself. Centre yes, axis no.',
        'And the house. It does have a vertical axis. But turned, the roof ends up at the bottom, so it has no centre of symmetry. Gulnoza was right.',
      ],
    },
  },

  s_solve: {
    title: { ru: 'Через начало координат', uz: 'Koordinata boshi orqali', en: 'Through the origin' },
    lead: { ru: 'Точка A (4; 3). Центр симметрии — начало координат.', uz: "A (4; 3) nuqtasi. Simmetriya markazi — koordinata boshi.", en: 'Point A (4; 3). The centre is the origin.' },
    steps: [
      { ru: 'первое число меняет знак: −4', uz: "birinchi son ishorasini o'zgartiradi: −4", en: 'the first number flips: −4' },
      { ru: 'второе тоже: −3', uz: 'ikkinchisi ham: −3', en: 'the second flips too: −3' },
      { ru: 'пара: (−4; −3)', uz: 'jufti: (−4; −3)', en: 'the pair: (−4; −3)' },
    ],
    done: {
      ru: 'При симметрии относительно начала координат меняются знаки у обоих чисел. Точка уходит в противоположную четверть.',
      uz: "Koordinata boshiga nisbatan simmetriyada ikkala sonning ishorasi o'zgaradi. Nuqta qarama-qarshi chorakka o'tadi.",
      en: 'Under symmetry about the origin both numbers change sign. The point moves to the opposite quarter.',
    },
    audio: {
      ru: [
        'Решаем вместе. Точка А стоит в четырёх клетках вправо и трёх вверх, то есть четыре и три. Центром симметрии возьмём начало координат.',
        'Идём от точки через начало координат и продолжаем на такое же расстояние. По горизонтали четыре клетки уходят в другую сторону, значит первое число становится минус четыре.',
        'По вертикали то же самое: три вверх превращаются в три вниз, второе число минус три. Пара это минус четыре и минус три. Точка ушла из правой верхней четверти в левую нижнюю, то есть в противоположную.',
      ],
      uz: [
        "Birga yechamiz. A nuqtasi to'rt katak o'ngda va uch katak tepada, ya'ni to'rt va uch. Simmetriya markazi qilib koordinata boshini olamiz.",
        "Nuqtadan koordinata boshi orqali borib, xuddi shu masofaga davom etamiz. Gorizontal bo'yicha to'rt katak boshqa tomonga ketadi, demak birinchi son minus to'rt bo'ladi.",
        "Vertikal bo'yicha ham shunday: tepaga uch pastga uchga aylanadi, ikkinchi son minus uch. Jufti minus to'rt va minus uch. Nuqta o'ng tepa chorakdan chap pastga, ya'ni qarama-qarshi chorakka o'tdi.",
      ],
      en: [
        'Let us solve it together. Point A sits four cells right and three up, that is four and three. Take the origin as the centre.',
        'Go from the point through the origin and continue the same distance. Horizontally the four cells go the other way, so the first number becomes minus four.',
        'Vertically the same: three up becomes three down, the second number minus three. The pair is minus four and minus three. The point moved from the top right quarter to the bottom left, the opposite one.',
      ],
    },
  },

  s_edge: {
    title: { ru: 'Меняются оба знака', uz: "Ikkala ishora o'zgaradi", en: 'Both signs change' },
    bad_line: { ru: 'ошибка: (4; 3) через центр даёт (−4; 3)', uz: 'xato: (4; 3) markaz orqali (−4; 3) beradi', en: 'mistake: (4; 3) through the centre gives (−4; 3)' },
    good_line: { ru: 'верно: (−4; −3), знаки меняют оба числа', uz: "to'g'ri: (−4; −3), ikkala son ishorasini o'zgartiradi", en: 'right: (−4; −3), both numbers flip' },
    warn_line: { ru: 'ошибка: у домика есть ось, значит есть и центр', uz: "xato: uychada o'q bor, demak markaz ham bor", en: 'mistake: the house has an axis so it has a centre' },
    done: {
      ru: 'Отражение меняет один знак, поворот на пол-оборота — оба. И одно свойство не влечёт другое: ось есть, а центра может не быть.',
      uz: "Akslantirish bitta ishorani, yarim aylanish esa ikkalasini o'zgartiradi. Bir xossa ikkinchisini keltirmaydi: o'q bo'lsa ham markaz bo'lmasligi mumkin.",
      en: 'A reflection flips one sign, a half turn flips both. And one property does not imply the other: an axis can exist without a centre.',
    },
    audio: {
      ru: [
        'Две частые ошибки урока. Первая: центральную симметрию делают как осевую и меняют знак только у одного числа.',
        'Но при повороте на пол-оборота точка уходит и по горизонтали, и по вертикали. Значит знаки меняют оба числа: минус четыре и минус три.',
        'Вторая ошибка: решают, что если у фигуры есть ось, то есть и центр. Домик это опровергает: ось у него есть, а при повороте крыша оказывается внизу. Ось и центр надо проверять по отдельности.',
      ],
      uz: [
        "Darsning tez-tez uchraydigan ikki xatosi. Birinchisi: markaziy simmetriyani o'q simmetriyasidek bajarib, faqat bitta sonning ishorasini o'zgartirishadi.",
        "Ammo yarim aylanishda nuqta gorizontal bo'yicha ham, vertikal bo'yicha ham ketadi. Demak ikkala son ishorasini o'zgartiradi: minus to'rt va minus uch.",
        "Ikkinchi xato: shaklda o'q bo'lsa, markaz ham bor deb hisoblashadi. Uycha buni rad etadi: unda o'q bor, burilganda esa tom pastga tushadi. O'q va markazni alohida tekshirish kerak.",
      ],
      en: [
        'Two common mistakes here. First: point symmetry is done like a reflection and only one number flips.',
        'But a half turn moves the point both horizontally and vertically. So both numbers flip: minus four and minus three.',
        'The second mistake: assuming that a shape with an axis must have a centre. The house disproves it: it has an axis, yet turned, the roof ends up at the bottom. Axis and centre must be checked separately.',
      ],
    },
  },

  s_rule: {
    title: { ru: 'Центр симметрии', uz: 'Simmetriya markazi', en: 'The centre of symmetry' },
    rule_1: {
      ru: 'Центр симметрии — точка, вокруг которой фигуру можно повернуть на пол-оборота так, что она совпадёт сама с собой. Точка и её пара лежат на одной прямой с центром, и центр делит отрезок между ними пополам.',
      uz: "Simmetriya markazi — shaklni uning atrofida yarim aylantirganda shakl o'zi bilan mos tushadigan nuqta. Nuqta va uning jufti markaz bilan bitta to'g'ri chiziqda yotadi, markaz esa ular orasidagi kesmani teng ikkiga bo'ladi.",
      en: 'A centre of symmetry is a point around which a shape can be turned half a turn onto itself. A point and its pair lie on one line with the centre, and the centre halves the segment between them.',
    },
    rule_2: {
      ru: 'Относительно начала координат меняются знаки у обоих чисел. Ось и центр — независимые свойства. Карусель: контур совпал у четырёхугольника, права была Гулноза.',
      uz: "Koordinata boshiga nisbatan ikkala sonning ishorasi o'zgaradi. O'q va markaz — mustaqil xossalar. Karusel: kontur to'rtburchakda mos tushdi, Gulnoza haq edi.",
      en: 'About the origin both numbers change sign. Axis and centre are independent properties. The roundabout: the quadrilateral matched, so Gulnoza was right.',
    },
    audio: {
      ru: 'Запомним правило. Центр симметрии это точка, вокруг которой фигуру можно повернуть на пол-оборота так, что она совпадёт сама с собой. Точка и её пара лежат на одной прямой с центром, и центр делит отрезок между ними ровно пополам. При симметрии относительно начала координат знаки меняются у обоих чисел, и точка уходит в противоположную четверть. Ось и центр это независимые свойства: одно может быть без другого. Вернёмся к карусели. Со своим контуром совпал скошенный четырёхугольник. Права была Гулноза.',
      uz: "Qoidani eslab qolamiz. Simmetriya markazi bu shaklni uning atrofida yarim aylantirganda shakl o'zi bilan mos tushadigan nuqta. Nuqta va uning jufti markaz bilan bitta to'g'ri chiziqda yotadi, markaz esa ular orasidagi kesmani roppa-rosa teng ikkiga bo'ladi. Koordinata boshiga nisbatan simmetriyada ikkala sonning ishorasi o'zgaradi va nuqta qarama-qarshi chorakka o'tadi. O'q va markaz mustaqil xossalar: biri ikkinchisisiz ham bo'ladi. Karuselga qaytamiz. O'z konturi bilan qiyshiq to'rtburchak mos tushdi. Gulnoza haq edi.",
      en: 'Let us remember the rule. A centre of symmetry is a point around which a shape can be turned half a turn onto itself. A point and its pair lie on one line with the centre, and the centre halves the segment between them exactly. Under symmetry about the origin both numbers change sign and the point moves to the opposite quarter. Axis and centre are independent properties: one can exist without the other. Back to the roundabout. The slanted quadrilateral matched its outline. Gulnoza was right.',
    },
  },

  s_has: {
    title: { ru: 'Есть ли центр?', uz: 'Markaz bormi?', en: 'Does it have a centre?' },
    lead: { ru: 'Мысленно поверни фигуру на пол-оборота.', uz: 'Shaklni xayolan yarim aylantiring.', en: 'Turn the shape half a turn in your head.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Есть ли центр симметрии у прямоугольника?', uz: "To'g'ri to'rtburchakda simmetriya markazi bormi?", en: 'Has a rectangle a centre of symmetry?' },
        opts: [
          { ru: 'да, точка пересечения диагоналей', uz: 'ha, diagonallar kesishgan nuqta', en: 'yes, where the diagonals cross' },
          { ru: 'нет', uz: "yo'q", en: 'no' },
          { ru: 'только у квадрата', uz: 'faqat kvadratda', en: 'only a square has one' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Поворот на пол-оборота даёт тот же прямоугольник.', uz: "To'g'ri. Yarim aylanish xuddi shu to'g'ri to'rtburchakni beradi.", en: 'Right. A half turn gives the same rectangle.' },
        wrong: [
          null,
          { ru: 'Поверните прямоугольник на пол-оборота: он совпадёт.', uz: "To'g'ri to'rtburchakni yarim aylantiring: u mos tushadi.", en: 'Turn a rectangle half a turn: it matches.' },
          { ru: 'У квадрата тоже есть, но не только у него.', uz: 'Kvadratda ham bor, lekin faqat unda emas.', en: 'A square has one too, but not only a square.' },
        ],
      },
      {
        q: { ru: 'Есть ли центр у равнобедренного треугольника?', uz: 'Teng yonli uchburchakda markaz bormi?', en: 'Has an isosceles triangle a centre?' },
        opts: [
          { ru: 'нет, вершина уходит вниз', uz: "yo'q, uchi pastga ketadi", en: 'no, the apex goes down' },
          { ru: 'да, в середине', uz: "ha, o'rtasida", en: 'yes, in the middle' },
          { ru: 'да, в вершине', uz: 'ha, uchida', en: 'yes, at the apex' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Ось симметрии есть, а центра нет.', uz: "To'g'ri. Simmetriya o'qi bor, markaz yo'q.", en: 'Right. It has an axis but no centre.' },
        wrong: [
          null,
          { ru: 'Поверните треугольник: вершина окажется снизу.', uz: "Uchburchakni burang: uchi pastda bo'ladi.", en: 'Turn the triangle: the apex ends up below.' },
          { ru: 'Из вершины поворот тоже не даёт совпадения.', uz: 'Uchidan burish ham moslik bermaydi.', en: 'Turning about the apex does not match either.' },
        ],
      },
      {
        q: { ru: 'Есть ли центр симметрии у круга?', uz: 'Doirada simmetriya markazi bormi?', en: 'Has a disc a centre of symmetry?' },
        opts: [
          { ru: 'да, его центр', uz: 'ha, uning markazi', en: 'yes, its centre' },
          { ru: 'нет', uz: "yo'q", en: 'no' },
          { ru: 'да, любая точка', uz: 'ha, istalgan nuqta', en: 'yes, any point' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Круг совпадает с собой при любом повороте вокруг центра.', uz: "To'g'ri. Doira markaz atrofidagi har qanday burilishda o'zi bilan mos tushadi.", en: 'Right. A disc matches itself under any turn about the centre.' },
        wrong: [
          null,
          { ru: 'Поверните круг вокруг центра: он не изменится.', uz: "Doirani markaz atrofida burang: u o'zgarmaydi.", en: 'Turn a disc about its centre: nothing changes.' },
          { ru: 'Вокруг другой точки круг сдвинется в сторону.', uz: 'Boshqa nuqta atrofida doira yonga suriladi.', en: 'About another point the disc shifts aside.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на центр. Мысленно поворачивайте фигуру на пол-оборота и смотрите, совпала ли она.',
        uz: "Markaz mashqi. Shaklni xayolan yarim aylantirib, mos tushganiga qarang.",
        en: 'Practice on centres. Turn the shape half a turn in your head and see if it matches.',
      },
    },
  },

  s_coord: {
    title: { ru: 'Пара через начало координат', uz: 'Koordinata boshi orqali juft', en: 'The pair through the origin' },
    lead: { ru: 'Меняются знаки у обоих чисел.', uz: "Ikkala sonning ishorasi o'zgaradi.", en: 'Both numbers change sign.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Пара точки (2; 5) относительно начала координат?', uz: '(2; 5) nuqtasining koordinata boshiga nisbatan jufti?', en: 'The pair of (2; 5) about the origin?' },
        opts: ['(−2; −5)', '(−2; 5)', '(2; −5)'],
        correct: 0,
        ok: { ru: 'Верно. Оба знака поменялись.', uz: "To'g'ri. Ikkala ishora o'zgardi.", en: 'Right. Both signs flipped.' },
        wrong: [
          null,
          { ru: 'Так работает отражение через ось y.', uz: "Bunday y o'qi orqali akslantirish ishlaydi.", en: 'That is a reflection in the y axis.' },
          { ru: 'Так работает отражение через ось x.', uz: "Bunday x o'qi orqali akslantirish ishlaydi.", en: 'That is a reflection in the x axis.' },
        ],
      },
      {
        q: { ru: 'Пара точки (−6; 1) относительно начала координат?', uz: '(−6; 1) nuqtasining jufti?', en: 'The pair of (−6; 1)?' },
        opts: ['(6; −1)', '(−6; −1)', '(6; 1)'],
        correct: 0,
        ok: { ru: 'Верно. Минус стал плюсом, плюс минусом.', uz: "To'g'ri. Minus plyus, plyus minus bo'ldi.", en: 'Right. Minus became plus and plus became minus.' },
        wrong: [
          null,
          { ru: 'Первое число тоже меняет знак.', uz: "Birinchi son ham ishorasini o'zgartiradi.", en: 'The first number flips too.' },
          { ru: 'Второе число тоже меняет знак.', uz: "Ikkinchi son ham ishorasini o'zgartiradi.", en: 'The second number flips too.' },
        ],
      },
      {
        q: { ru: 'В какую четверть уйдёт точка из правой верхней?', uz: "O'ng tepadagi nuqta qaysi chorakka o'tadi?", en: 'Where does a top right point go?' },
        opts: [
          { ru: 'в левую нижнюю', uz: 'chap pastga', en: 'bottom left' },
          { ru: 'в левую верхнюю', uz: 'chap tepaga', en: 'top left' },
          { ru: 'в правую нижнюю', uz: "o'ng pastga", en: 'bottom right' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Точка уходит в противоположную четверть.', uz: "To'g'ri. Nuqta qarama-qarshi chorakka o'tadi.", en: 'Right. The point goes to the opposite quarter.' },
        wrong: [
          null,
          { ru: 'Так вышло бы при отражении через ось y.', uz: "y o'qi orqali akslantirishda shunday bo'lardi.", en: 'That would be a reflection in the y axis.' },
          { ru: 'Так вышло бы при отражении через ось x.', uz: "x o'qi orqali akslantirishda shunday bo'lardi.", en: 'That would be a reflection in the x axis.' },
        ],
      },
      {
        q: { ru: 'Чем центральная симметрия отличается от осевой?', uz: "Markaziy simmetriya o'q simmetriyasidan nimasi bilan farq qiladi?", en: 'How does point symmetry differ from reflection?' },
        opts: [
          { ru: 'меняются оба знака, а не один', uz: "bitta emas, ikkala ishora o'zgaradi", en: 'both signs flip, not one' },
          { ru: 'ничем', uz: 'hech nimasi bilan', en: 'no difference' },
          { ru: 'расстояние не сохраняется', uz: 'masofa saqlanmaydi', en: 'the distance is not kept' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Поворот на пол-оборота против одного зеркала.', uz: "To'g'ri. Yarim aylanish bitta ko'zguga qarshi.", en: 'Right. A half turn versus a single mirror.' },
        wrong: [
          null,
          { ru: 'Осевая меняет один знак, центральная оба.', uz: "O'q simmetriyasi bitta, markaziy ikkalasini o'zgartiradi.", en: 'A reflection flips one sign, a half turn both.' },
          { ru: 'Расстояние сохраняется в обоих случаях.', uz: 'Masofa ikkala holda ham saqlanadi.', en: 'The distance is kept in both.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на координаты. При симметрии относительно начала координат меняются оба знака.',
        uz: "Koordinatalar mashqi. Koordinata boshiga nisbatan simmetriyada ikkala ishora o'zgaradi.",
        en: 'Practice on coordinates. About the origin both signs flip.',
      },
    },
  },

  s_bins: {
    title: { ru: 'Есть ли центр симметрии?', uz: 'Simmetriya markazi bormi?', en: 'Does it have a centre?' },
    lead: { ru: 'Проверяй поворотом на пол-оборота.', uz: 'Yarim aylantirib tekshiring.', en: 'Test with a half turn.' },
    bin_a: { ru: 'Центр есть', uz: 'Markaz bor', en: 'Has a centre' },
    bin_b: { ru: 'Центра нет', uz: "Markaz yo'q", en: 'No centre' },
    cards: [
      { label: { ru: 'прямоугольник', uz: "to'g'ri to'rtburchak", en: 'a rectangle' }, bin: 'a' },
      { label: { ru: 'круг', uz: 'doira', en: 'a disc' }, bin: 'a' },
      { label: { ru: 'скошенный четырёхугольник', uz: "qiyshiq to'rtburchak", en: 'a slanted quadrilateral' }, bin: 'a' },
      { label: { ru: 'равнобедренный треугольник', uz: 'teng yonli uchburchak', en: 'an isosceles triangle' }, bin: 'b' },
      { label: { ru: 'домик с крышей', uz: 'tomli uycha', en: 'a house with a roof' }, bin: 'b' },
      { label: { ru: 'полукруг', uz: 'yarim doira', en: 'a half disc' }, bin: 'b' },
    ],
    hint: {
      ru: 'Поверни фигуру на пол-оборота: если контур совпал, центр есть.',
      uz: "Shaklni yarim aylantiring: kontur mos tushsa, markaz bor.",
      en: 'Turn the shape half a turn: if the outline matches, there is a centre.',
    },
    correct_text: {
      ru: 'Верно. Наличие оси ничего не говорит о центре и наоборот.',
      uz: "To'g'ri. O'qning bo'lishi markaz haqida hech nima demaydi va teskarisi.",
      en: 'Right. Having an axis says nothing about a centre, and the reverse.',
    },
    audio: {
      intro: {
        ru: 'Разложите фигуры по двум корзинам. Проверяйте поворотом на пол-оборота.',
        uz: 'Shakllarni ikki savatga ajrating. Yarim aylantirib tekshiring.',
        en: 'Sort the shapes into two baskets. Test with a half turn.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Поверни фигуру мысленно.', uz: 'Bu yerga emas. Shaklni xayolan burang.', en: 'Not here. Turn the shape in your head.' },
    },
  },

  s_error: {
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: «(5; 2) через начало координат даёт (−5; 2)». Проверь.', uz: "Aziz: «(5; 2) koordinata boshi orqali (−5; 2) beradi». Tekshiring.", en: 'Aziz: “(5; 2) about the origin gives (−5; 2).” Check it.' },
        opts: [
          { ru: 'Нет: меняются оба знака, будет (−5; −2)', uz: "Yo'q: ikkala ishora o'zgaradi, (−5; −2) bo'ladi", en: 'No: both signs flip, it is (−5; −2)' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет (5; −2)', uz: "Yo'q, (5; −2) bo'ladi", en: 'No, it is (5; −2)' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Так записана осевая симметрия, а не центральная.', uz: "To'g'ri. Bunday o'q simmetriyasi yozilgan, markaziy emas.", en: 'Right. That is a reflection, not a half turn.' },
        wrong: [
          null,
          { ru: 'При повороте точка уходит и по вертикали тоже.', uz: "Burilishda nuqta vertikal bo'yicha ham ketadi.", en: 'A turn moves the point vertically too.' },
          { ru: 'Первое число тоже меняет знак.', uz: "Birinchi son ham ishorasini o'zgartiradi.", en: 'The first number flips as well.' },
        ],
      },
      {
        q: { ru: 'Гулноза: «У домика есть ось, значит есть и центр». Проверь.', uz: "Gulnoza: «Uychada o'q bor, demak markaz ham bor». Tekshiring.", en: 'Gulnoza: “The house has an axis, so it has a centre.” Check it.' },
        opts: [
          { ru: 'Нет: при повороте крыша окажется внизу', uz: "Yo'q: burilishda tom pastda bo'ladi", en: 'No: turned, the roof ends up below' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, у домика вообще нет оси', uz: "Yo'q, uychada o'q umuman yo'q", en: 'No, the house has no axis at all' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Ось и центр проверяют по отдельности.', uz: "To'g'ri. O'q va markaz alohida tekshiriladi.", en: 'Right. Axis and centre are checked separately.' },
        wrong: [
          null,
          { ru: 'Одно свойство не влечёт другое.', uz: 'Bir xossa ikkinchisini keltirmaydi.', en: 'One property does not imply the other.' },
          { ru: 'Вертикальная ось у домика как раз есть.', uz: "Uychada vertikal o'q aynan bor.", en: 'The house does have a vertical axis.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в знаках, и в путанице оси с центром.',
        uz: "Birovning yechimini tekshiring. Xato ishoralarda ham, o'qni markaz bilan chalkashtirishda ham bo'ladi.",
        en: 'Check someone else’s work. A mistake can be in the signs and in confusing axis with centre.',
      },
    },
  },

  s_task: {
    title: { ru: 'Карусель повернулась', uz: 'Karusel burildi', en: 'The roundabout turned' },
    lead: { ru: 'Центр карусели — точка O. Азиз сидит в 2 м от центра.', uz: "Karusel markazi — O nuqta. Aziz markazdan 2 m da o'tirgan.", en: 'The centre is O. Aziz sits 2 m from it.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'После пол-оборота на каком расстоянии от центра Азиз?', uz: 'Yarim aylanishdan keyin Aziz markazdan qanday masofada?', en: 'After a half turn, how far from the centre is Aziz?' },
        opts: [
          { ru: '2 м', uz: '2 m', en: '2 m' },
          { ru: '4 м', uz: '4 m', en: '4 m' },
          { ru: '1 м', uz: '1 m', en: '1 m' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Расстояние до центра сохраняется.', uz: "To'g'ri. Markazgacha masofa saqlanadi.", en: 'Right. The distance to the centre is kept.' },
        wrong: [
          null,
          { ru: 'Расстояние не удваивается, оно то же.', uz: "Masofa ikkilanmaydi, u o'sha.", en: 'The distance does not double, it stays.' },
          { ru: 'Расстояние не уменьшается.', uz: 'Masofa kamaymaydi.', en: 'The distance does not shrink.' },
        ],
      },
      {
        q: { ru: 'Гулноза сидела напротив Азиза. Где она теперь?', uz: "Gulnoza Azizning ro'parasida o'tirgan edi. U endi qayerda?", en: 'Gulnoza sat opposite Aziz. Where is she now?' },
        opts: [
          { ru: 'на месте, где сидел Азиз', uz: "Aziz o'tirgan joyda", en: 'where Aziz was sitting' },
          { ru: 'в центре карусели', uz: 'karusel markazida', en: 'at the centre' },
          { ru: 'там же, где была', uz: "o'sha joyida", en: 'exactly where she was' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Пол-оборота меняет их местами.', uz: "To'g'ri. Yarim aylanish ularni o'rin almashtiradi.", en: 'Right. A half turn swaps them.' },
        wrong: [
          null,
          { ru: 'В центре остаётся только сам центр.', uz: "Markazda faqat markazning o'zi qoladi.", en: 'Only the centre itself stays at the centre.' },
          { ru: 'На месте остаются лишь точки центра.', uz: 'Joyida faqat markaz nuqtalari qoladi.', en: 'Only the centre point stays put.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про карусель. Центр карусели точка О, Азиз сидит в двух метрах от центра, Гулноза напротив него.',
        uz: "Karusel haqida masala. Karusel markazi O nuqta, Aziz markazdan ikki metrda, Gulnoza uning ro'parasida o'tirgan.",
        en: 'A roundabout problem. The centre is O, Aziz sits two metres from it and Gulnoza opposite him.',
      },
    },
  },

  s_final: {
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 180,
        q: { ru: 'На сколько градусов поворачивают фигуру при центральной симметрии?', uz: 'Markaziy simmetriyada shakl necha darajaga buriladi?', en: 'How many degrees is the turn in point symmetry?' },
        hint: { ru: 'Пол-оборота это половина от 360.', uz: 'Yarim aylanish bu 360 ning yarmi.', en: 'A half turn is half of 360.' },
        hint_audio: { ru: 'Полный оборот это триста шестьдесят градусов, а нам нужна его половина.', uz: "To'liq aylanish uch yuz oltmish daraja, bizga esa uning yarmi kerak.", en: 'A full turn is three hundred sixty degrees and we need half of it.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Пара точки (3; 7) относительно начала координат?', uz: '(3; 7) nuqtasining koordinata boshiga nisbatan jufti?', en: 'The pair of (3; 7) about the origin?' },
        opts: ['(−3; 7)', '(3; −7)', '(−3; −7)', '(7; 3)'],
        wrong: [
          { ru: 'Так работает отражение через ось y.', uz: "Bunday y o'qi orqali akslantirish ishlaydi.", en: 'That is a reflection in the y axis.' },
          { ru: 'Так работает отражение через ось x.', uz: "Bunday x o'qi orqali akslantirish ishlaydi.", en: 'That is a reflection in the x axis.' },
          null,
          { ru: 'Числа не переставляются местами.', uz: "Sonlar o'rin almashmaydi.", en: 'The numbers do not swap.' },
        ],
        correct: { ru: 'Верно. Меняются знаки у обоих чисел.', uz: "To'g'ri. Ikkala sonning ishorasi o'zgaradi.", en: 'Right. Both numbers change sign.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'У какой фигуры есть центр, но нет оси симметрии?', uz: "Qaysi shaklda markaz bor, lekin simmetriya o'qi yo'q?", en: 'Which shape has a centre but no axis?' },
        opts: [
          { ru: 'у квадрата', uz: 'kvadratda', en: 'a square' },
          { ru: 'у скошенного четырёхугольника', uz: "qiyshiq to'rtburchakda", en: 'a slanted quadrilateral' },
          { ru: 'у равнобедренного треугольника', uz: 'teng yonli uchburchakda', en: 'an isosceles triangle' },
          { ru: 'у круга', uz: 'doirada', en: 'a disc' },
        ],
        wrong: [
          { ru: 'У квадрата есть и центр, и четыре оси.', uz: "Kvadratda markaz ham, to'rtta o'q ham bor.", en: 'A square has both a centre and four axes.' },
          null,
          { ru: 'Здесь наоборот: ось есть, а центра нет.', uz: "Bu yerda teskarisi: o'q bor, markaz yo'q.", en: 'That is the reverse: axis yes, centre no.' },
          { ru: 'У круга осей бесконечно много.', uz: "Doirada o'qlar cheksiz ko'p.", en: 'A disc has infinitely many axes.' },
        ],
        correct: { ru: 'Верно. Ось и центр — независимые свойства.', uz: "To'g'ri. O'q va markaz mustaqil xossalar.", en: 'Right. Axis and centre are independent.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Что верно про центр симметрии?', uz: "Simmetriya markazi haqida nima to'g'ri?", en: 'What is true of a centre of symmetry?' },
        opts: [
          { ru: 'он всегда вне фигуры', uz: 'u har doim shakldan tashqarida', en: 'it is always outside the shape' },
          { ru: 'он меняет расстояния', uz: "u masofalarni o'zgartiradi", en: 'it changes distances' },
          { ru: 'он совпадает с осью', uz: "u o'q bilan mos tushadi", en: 'it coincides with an axis' },
          { ru: 'он середина отрезка между точкой и её парой', uz: "u nuqta va jufti orasidagi kesmaning o'rtasi", en: 'it is the midpoint of the segment' },
        ],
        wrong: [
          { ru: 'У прямоугольника центр внутри.', uz: "To'g'ri to'rtburchakda markaz ichkarida.", en: 'A rectangle’s centre is inside.' },
          { ru: 'Расстояния сохраняются.', uz: 'Masofalar saqlanadi.', en: 'Distances are preserved.' },
          { ru: 'Центр это точка, а ось это линия.', uz: "Markaz nuqta, o'q esa chiziq.", en: 'A centre is a point, an axis is a line.' },
          null,
        ],
        correct: { ru: 'Верно. Это и есть точная проверка.', uz: "To'g'ri. Aniq tekshiruv shu.", en: 'Right. That is the exact test.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Карусель повернулась на пол-оборота. Что стало с двумя сидящими напротив?', uz: "Karusel yarim burildi. Ro'para o'tirgan ikkovga nima bo'ldi?", en: 'The roundabout made a half turn. What happened to two sitting opposite?' },
        opts: [
          { ru: 'поменялись местами', uz: "o'rin almashdi", en: 'they swapped places' },
          { ru: 'оба остались на месте', uz: 'ikkalasi joyida qoldi', en: 'both stayed put' },
          { ru: 'оказались рядом', uz: "yonma-yon bo'ldi", en: 'they ended up side by side' },
          { ru: 'оба попали в центр', uz: 'ikkalasi markazga tushdi', en: 'both moved to the centre' },
        ],
        wrong: [
          null,
          { ru: 'На месте остаётся только центр.', uz: 'Joyida faqat markaz qoladi.', en: 'Only the centre stays put.' },
          { ru: 'Пол-оборота переводит точку в противоположную.', uz: "Yarim aylanish nuqtani qarama-qarshisiga o'tkazadi.", en: 'A half turn sends a point to the opposite one.' },
          { ru: 'В центр попадает только сам центр.', uz: "Markazga faqat markazning o'zi tushadi.", en: 'Only the centre lands at the centre.' },
        ],
        correct: { ru: 'Верно. Каждый оказался на месте другого.', uz: "To'g'ri. Har biri boshqasining joyiga tushdi.", en: 'Right. Each took the other’s place.' },
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
      ru: 'Центральная симметрия видна прямо в цифрах. Нули и восьмёрки при повороте на пол-оборота остаются собой, а шестёрка превращается в девятку. Поэтому на чертежах и в нумерации мест иногда подчёркивают 6 и 9: без подчёркивания непонятно, с какой стороны смотрели на лист.',
      uz: "Markaziy simmetriya to'g'ridan-to'g'ri raqamlarda ko'rinadi. Nol va sakkiz yarim aylanishda o'zi bo'lib qoladi, olti esa to'qqizga aylanadi. Shuning uchun chizmalarda va joy raqamlarida ba'zan 6 va 9 tagiga chizib qo'yiladi: chizmasiz varaqqa qaysi tomondan qaralganini bilib bo'lmaydi.",
      en: 'Point symmetry shows up right in the digits. Zeros and eights stay themselves under a half turn, while a six becomes a nine. That is why drawings and seat numbers sometimes underline 6 and 9: without it you cannot tell which way up the sheet was.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Центральная симметрия видна прямо в цифрах. Нули и восьмёрки при повороте на пол-оборота остаются собой, а шестёрка превращается в девятку. Поэтому на чертежах и в нумерации мест иногда подчёркивают шесть и девять: без подчёркивания непонятно, с какой стороны смотрели на лист.',
      uz: "Bilasizmi? Markaziy simmetriya to'g'ridan-to'g'ri raqamlarda ko'rinadi. Nol va sakkiz yarim aylanishda o'zi bo'lib qoladi, olti esa to'qqizga aylanadi. Shuning uchun chizmalarda va joy raqamlarida ba'zan olti va to'qqiz tagiga chizib qo'yiladi: chizmasiz varaqqa qaysi tomondan qaralganini bilib bo'lmaydi.",
      en: 'Did you know? Point symmetry shows up right in the digits. Zeros and eights stay themselves under a half turn, while a six becomes a nine. That is why drawings and seat numbers sometimes underline six and nine: without it you cannot tell which way up the sheet was.',
    },
  },

  s14: {
    banner: { ru: 'Математика · Геометрия', uz: 'Matematika · Geometriya', en: 'Mathematics · Geometry' },
    heading: { ru: 'Центральная симметрия', uz: 'Markaziy simmetriya', en: 'Point symmetry' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'центр — поворот на пол-оборота', uz: 'markaz — yarim aylanish', en: 'a centre means a half turn' },
    brief_2: { ru: 'центр — середина отрезка AAʹ', uz: "markaz — AAʹ kesmasining o'rtasi", en: 'the centre is the midpoint of AAʹ' },
    brief_3: { ru: 'через начало координат меняются оба знака', uz: "koordinata boshi orqali ikkala ishora o'zgaradi", en: 'about the origin both signs flip' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Ось и центр', uz: "O'q va markaz", en: 'Axis and centre' },
    memo_a1: { ru: 'независимы друг от друга', uz: 'bir-biridan mustaqil', en: 'are independent' },
    memo_q2: { ru: 'Расстояние до центра', uz: 'Markazgacha masofa', en: 'Distance to the centre' },
    memo_a2: { ru: 'сохраняется', uz: 'saqlanadi', en: 'is preserved' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'сменить только один знак', uz: "faqat bitta ishorani o'zgartirish", en: 'flipping only one sign' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Центр симметрии это точка, вокруг которой фигуру можно повернуть на пол-оборота так, что она совпадёт сама с собой. Центр лежит на прямой между точкой и её парой и делит этот отрезок пополам. При симметрии относительно начала координат меняются знаки у обоих чисел.',
        'Карусель: со своим контуром совпал скошенный четырёхугольник, а не домик.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Simmetriya markazi bu shaklni uning atrofida yarim aylantirganda shakl o'zi bilan mos tushadigan nuqta. Markaz nuqta va uning jufti orasidagi to'g'ri chiziqda yotadi va bu kesmani teng ikkiga bo'ladi. Koordinata boshiga nisbatan simmetriyada ikkala sonning ishorasi o'zgaradi.",
        "Karusel: o'z konturi bilan uycha emas, qiyshiq to'rtburchak mos tushdi.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'A centre of symmetry is a point around which a shape turns half a turn onto itself. The centre lies on the line between a point and its pair and halves that segment. About the origin both numbers change sign.',
        'The roundabout: the slanted quadrilateral matched its outline, not the house.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Через центр насквозь', uz: "Usul. Markaz orqali o'tib", en: 'Method. Straight through the centre' },
    m1_steps: {
      ru: ['Проведи прямую от точки через центр', 'Отмерь от центра то же расстояние', 'Поставь пару по другую сторону'],
      uz: ["Nuqtadan markaz orqali to'g'ri chiziq o'tkazing", "Markazdan xuddi shu masofani o'lchang", "Juftini boshqa tomonga qo'ying"],
      en: ['Draw the line from the point through the centre', 'Measure the same distance from the centre', 'Mark the pair on the other side'],
    },
    m1_no: {
      ru: 'При повороте меняются оба направления: и вправо-влево, и вверх-вниз.',
      uz: "Burilishda ikkala yo'nalish o'zgaradi: o'ng-chap ham, tepa-past ham.",
      en: 'A turn flips both directions: left-right and up-down.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: школьная площадка, карусель с бумажными фигурами.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d41sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EAF4F9"/><stop offset="100%" stopColor="#F9F4EB"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d41sky)"/>

    {/* Деревья и школа на заднем плане */}
    <g opacity="0.85">
      <rect x="14" y="40" width="66" height="60" rx="4" fill="#E4D9C6" stroke="#C9A472" strokeWidth="2"/>
      <rect x="26" y="54" width="16" height="14" rx="2" fill="#7ECBE6"/>
      <rect x="52" y="54" width="16" height="14" rx="2" fill="#7ECBE6"/>
      <rect x="38" y="78" width="18" height="22" rx="2" fill="#B08A55"/>
      <rect x="352" y="60" width="7" height="40" fill="#8B6A45"/>
      <circle className="d41-tree" cx="356" cy="52" r="18" fill="#8FBF7F"/>
    </g>
    <rect x="0" y="100" width="400" height="54" fill="#C6BFAF"/>

    {/* Карусель: круглая платформа, вращается */}
    <g>
      <ellipse cx="212" cy="112" rx="86" ry="22" fill="#B4A48C"/>
      {/* Круглая платформа, видимая под углом, при повороте силуэта НЕ меняет —
          едут фигуры на ней. Поэтому платформа стоит, а группа с фигурами
          поворачивается внутри сплюснутой системы координат: 20 к 82 — то же
          сжатие, что и у самой платформы, поэтому фигуры едут точно по ней. */}
      <ellipse cx="212" cy="108" rx="82" ry="20" fill="#D9B989" stroke="#B08A55" strokeWidth="2"/>
      <path d="M130 108 h164 M212 88 v40" stroke="#B08A55" strokeWidth="1.6"/>
      <g transform="translate(212, 108) scale(1, 0.244)">
        <g className="d41-spin">
          <path d="M-62 -25 l22 -41 l26 25 l-22 41 z" fill="#7ECBE6" stroke="#4F9EBB" strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"/>
          <path d="M26 -8 l18 -49 l18 49 l-6 41 h-24 z" fill="#F5C77E" stroke="#C9A472" strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"/>
        </g>
      </g>
      <circle cx="212" cy="108" r="4.4" fill="#3B3730"/>
      <text x="212" y="146" textAnchor="middle" fill="#8A8883"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">O</text>
    </g>

    <Person x={116} ground={112} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={318} ground={112} head={13} shirt="#8FBF7F" hair="#5A4636"/>
  </svg>
);

// Итог: фигура и её поворот на пол-оборота.
const FinalScene = () => {
  const lang = useLang();
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      <path d="M120 46 h160" stroke="#8A8883" strokeWidth="1.2" strokeDasharray="4 4"/>
      <path d="M130 26 l40 -8 l30 12 l-40 8 z" fill="#A9CFBA" stroke="#1F7A4D" strokeWidth="2"/>
      <path d="M270 66 l-40 8 l-30 -12 l40 -8 z" fill="#A9CFBA" stroke="#1F7A4D" strokeWidth="2"/>
      <circle cx="200" cy="46" r="5" fill="#D9603F"/>
      <text x="200" y="34" textAnchor="middle" fill="#D9603F"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">O</text>
      <text x="200" y="86" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="11" fontWeight="700">
        {tri(lang, 'центр делит отрезок пополам',
          "markaz kesmani teng ikkiga bo'ladi",
          'the centre halves the segment')}
      </text>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Прибор урока: клетчатое поле с центром, точкой и её парой.
const Turn = ({ dx = 3, dy = 2, pair = false, ray = false, size = 'mid' }) => {
  const cell = 18; const ox = 140; const oy = 78;
  const px = (n) => ox + n * cell;
  const py = (n) => oy - n * cell;
  return (
    <span className={'d41-turn-box d41-turn-' + size}>
      <svg viewBox="0 0 280 156" aria-hidden="true">
        <g opacity="0.5">
          {Array.from({ length: 15 }, (_, i) => (
            <path key={'v' + i} d={`M${14 + i * cell} 12 v132`} stroke="#E3DCCE" strokeWidth="1"/>
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <path key={'h' + i} d={`M14 ${12 + i * cell} h${14 * cell}`} stroke="#E3DCCE" strokeWidth="1"/>
          ))}
        </g>
        {ray && (
          <path d={`M${px(dx)} ${py(dy)} L${px(-dx)} ${py(-dy)}`}
            stroke="#8A8883" strokeWidth="1.6" strokeDasharray="4 4"/>
        )}
        <circle cx={ox} cy={oy} r="5" fill="#D9603F"/>
        <text x={ox - 10} y={oy + 16} textAnchor="end" fill="#D9603F"
          fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">O</text>
        <circle cx={px(dx)} cy={py(dy)} r="6" fill="#019ACB"/>
        <text x={px(dx)} y={py(dy) - 11} textAnchor="middle" fill="#019ACB"
          fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">A</text>
        {pair && (
          <g>
            <circle cx={px(-dx)} cy={py(-dy)} r="6" fill="#1F7A4D"/>
            <text x={px(-dx)} y={py(-dy) + 20} textAnchor="middle" fill="#1F7A4D"
              fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">Aʹ</text>
          </g>
        )}
      </svg>
    </span>
  );
};

// Три фигуры: у кого ось, у кого центр.
const ShapeSet = ({ show = 0 }) => (
  <span className="d41-set-box">
    <svg viewBox="0 0 300 110" aria-hidden="true">
      <g>
        <rect x="14" y="30" width="70" height="46" fill="#E7F5FA" stroke="#019ACB" strokeWidth="2.2"/>
        <circle cx="49" cy="53" r="4" fill="#D9603F"/>
        <text x="49" y="96" textAnchor="middle" fill="#8A8883"
          fontFamily="'Manrope', system-ui, sans-serif" fontSize="9" fontWeight="700">o + m</text>
      </g>
      <g className={'d41-fade' + (show >= 1 ? ' d41-on' : '')}>
        <path d="M108 76 l28 -46 l50 8 l-28 46 z" fill="#E3F0E8" stroke="#1F7A4D" strokeWidth="2.2"/>
        <circle cx="147" cy="53" r="4" fill="#D9603F"/>
        <text x="147" y="96" textAnchor="middle" fill="#8A8883"
          fontFamily="'Manrope', system-ui, sans-serif" fontSize="9" fontWeight="700">m</text>
      </g>
      <g className={'d41-fade' + (show >= 2 ? ' d41-on' : '')}>
        <path d="M212 76 l32 -46 l32 46 z" fill="#FBF3D6" stroke="#8A6A22" strokeWidth="2.2"/>
        <path d="M244 22 v60" stroke="#8A6A22" strokeWidth="1.8" strokeDasharray="5 4"/>
        <text x="244" y="96" textAnchor="middle" fill="#8A8883"
          fontFamily="'Manrope', system-ui, sans-serif" fontSize="9" fontWeight="700">o</text>
      </g>
    </svg>
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d41-line d41-fade' + (on ? ' d41-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d41-stage">
        <span className="d41-mir">
          <svg viewBox="0 0 240 96" aria-hidden="true">
            <path d="M120 8 v80" stroke="#D9603F" strokeWidth="2.4" strokeDasharray="6 4"/>
            <path d="M120 48 L74 26 L56 48 L74 70 z" fill="#E7F5FA" stroke="#019ACB" strokeWidth="2"/>
            <path d="M120 48 L166 26 L184 48 L166 70 z" fill="#E7F5FA" stroke="#019ACB" strokeWidth="2"/>
          </svg>
        </span>
        <span className={'d41-chips d41-fade' + (step >= 1 ? ' d41-on' : '')}>
          <i className="d41-chip-l">{tri(lang, 'зеркало: фигуру переворачивают', "ko'zgu: shakl o'giriladi", 'a mirror flips the shape')}</i>
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

// Ядро: поворот на пол-оборота.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d41-stage d41-stage-row">
        <Turn size="sm" dx={3} dy={2} pair={step >= 1} ray={step >= 2}/>
        <span className="d41-col">
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

// Ось и центр — разные свойства.
const WhichBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_which;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d41-stage">
        <ShapeSet show={step}/>
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
      <div className="frame fade-up delay-1 d41-stage d41-stage-row">
        <Turn size="sm" dx={4} dy={3} pair={step >= 1} ray={step >= 1}/>
        <span className="d41-col">
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

// Граница: меняются оба знака.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d41-stage">
        <span className="d41-pair d41-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d41-pair d41-pair-good d41-fade' + (step >= 1 ? ' d41-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d41-pair d41-pair-warn d41-fade' + (step >= 2 ? ' d41-on' : '')}>
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
        <div className={'d41-banner fade-up delay-1' + (phase === 'play' ? ' d41-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d41-stage d41-stage-tool d41-stage-row">
          {phase === 'demo' ? (
            <>
              <Turn size="xs" dx={3} dy={2} pair={shown >= 2} ray={shown >= 1}/>
              <span className="d41-col">
                {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
                <p className={'body d41-verdict' + (done ? ' d41-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
              </span>
            </>
          ) : (
            <span className="d41-col">
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
          <div className="d41-acts fade-up">
            <button className="d41-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d41-btn d41-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenWhich = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_which} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <WhichBody step={step}/>}/>
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
      <div className="d41-stage d41-stage-flat">
        <Turn size="xs" dx={3} dy={2} pair ray/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenHas = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_has} asideNode={methodAside}/>
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

// Задача: карусель сверху, двое напротив.
const TaskFig = ({ idx }) => (
  <div className="d41-task-fig">
    <svg viewBox="0 0 240 134" aria-hidden="true">
      <circle cx="120" cy="60" r="48" fill="#F4EEDF" stroke="#C9A472" strokeWidth="2.4"/>
      <circle cx="120" cy="60" r="4.4" fill="#D9603F"/>
      <text x="120" y="52" textAnchor="middle" fill="#D9603F"
        fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700">O</text>
      <circle cx={idx >= 1 ? 168 : 72} cy="60" r="8" fill="#019ACB"/>
      <circle cx={idx >= 1 ? 72 : 168} cy="60" r="8" fill="#8FBF7F"/>
      <path d="M72 60 h96" stroke="#8A8883" strokeWidth="1.4" strokeDasharray="4 4"/>
      <text x="120" y="126" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fontWeight="700">2 m</text>
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
.d41-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
/* Экран правила НА ТЕЛЕФОНЕ: чертёж лежит внутри рамки, и своя подкладка
   удваивала отступ — по-русски содержимое уходило под нижнюю панель. Высота
   чертежа ограничена, иначе он растягивается по ширине и отыгрывает высоту
   обратно. Десктоп не тронут: там места хватало. */
@media (max-width: 639.98px) {
  .d41-stage-flat { padding: 0 !important; }
  .d41-stage-flat svg { max-height: 88px; }
}
.d41-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d41-stage-tool .d41-line { font-size: clamp(12px, 2vw, 16px); }
.d41-stage-row { flex-direction: row; align-items: center; justify-content: center; gap: clamp(10px, 2.4vw, 22px); flex-wrap: wrap; }
.d41-col { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.1vw, 9px); flex: 1 1 200px; min-width: 0; }

/* Клетчатое поле с центром */
.d41-turn-box { display: block; width: 100%; max-width: 270px; }
.d41-turn-sm { max-width: 234px; }
.d41-turn-xs { max-width: 190px; }
.d41-turn-box svg { width: 100%; height: auto; display: block; }
.d41-set-box { display: block; width: 100%; max-width: 300px; }
.d41-set-box svg { width: 100%; height: auto; display: block; }
.d41-mir { display: block; width: 100%; max-width: 240px; }
.d41-mir svg { width: 100%; height: auto; display: block; }

.d41-fade { opacity: 0; transition: opacity 420ms linear; }
.d41-on { opacity: 1; }
.d41-line { font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 16px); font-weight: 700; color: #494550; text-align: center; }

/* Подписи */
.d41-chips { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d41-chips i { font-style: normal; padding: 5px 12px; border-radius: 10px; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 15px); font-weight: 700; }
.d41-chip-l { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }

/* Строки экрана границы */
.d41-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d41-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d41-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d41-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d41-task-fig { display: flex; justify-content: center; width: 100%; }
.d41-task-fig svg { width: 100%; max-width: 240px; height: auto; display: block; }

/* Экран 4 */
.d41-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d41-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d41-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d41-verdict-on { opacity: 1; }
.d41-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d41-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d41-btn:disabled { opacity: 0.45; cursor: default; }
.d41-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d41-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: карусель делает пол-оборота и замирает */
/* Пол-оборота — ровно один раз: карусель поворачивается на 180 градусов и
   остаётся так. Перенос и сжатие делает внешняя группа, здесь только поворот,
   поэтому transform-origin нулевой. */
.d41-spin { animation: d41Spin 3400ms cubic-bezier(0.3, 0, 0.2, 1) 1000ms 1 both; transform-origin: 0 0; }
@keyframes d41Spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(180deg); }
}
.d41-tree { animation: d41Tree 8200ms ease-in-out infinite; transform-origin: 356px 70px; }
@keyframes d41Tree {
  0%, 100% { transform: rotate(-1.2deg); }
  50% { transform: rotate(1.2deg); }
}
@media (prefers-reduced-motion: reduce) {
  .d41-spin { animation: none; transform: rotate(180deg); }
  .d41-tree { animation: none; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function CentralSymmetryLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenWhich, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenHas, ScreenCoord, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
