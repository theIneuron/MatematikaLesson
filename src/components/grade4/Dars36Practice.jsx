// ============================================================================
// 4-SINF · 36-DARS AMALIYOTI · TO'G'RI TO'RTBURCHAK VA KVADRAT
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
//
// SKELET: src/books/grade4/AMALIYOT_31_40_SKELET.md §5.6.
// Raskladka (scripts/grade4-practice-31-40-layout.mjs):
//   mc · missing · match · order · slots · mc · order · sort · slots · match
//
// NEGA BITTA FAYL VA NEGA CHIZMALAR SHU YERDA. LMS darsni bitta avtonom .jsx
// sifatida qabul qiladi: lokal import yo'q. To'rtburchak chizmasi shu faylda
// yoziladi. CLAUDE.md §5 nusxa taqiqiga zid emas — LMS kontrakti majbur qiladi.
//
// DIZAYN: Dars01Practice.jsx. RUS TILIDA MUROJAAT — «ты».
//
// CHIZMA QOIDASI. Romb aynan romb bo'lib chiziladi: tomonlari teng, burchagi
// 65 daraja, ya'ni to'g'ri emas. Shundan bola «teng tomon — kvadratlikning
// yagona belgisi» degan yolg'on modelni CHIZMADAN ko'radi, matndan emas.
// Burchak to'g'ri bo'lgan joyda kvadratcha belgisi turadi.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

const T = {
  bg: '#F5F5F0',
  paper: '#FFFFFF',
  ink: '#12212C',
  ink2: '#50616D',
  ink3: '#87949D',
  accent: '#FF5B35',
  accentSoft: '#FFF0EA',
  cyan: '#168FA3',
  cyanSoft: '#E5F5F6',
  navy: '#173B52',
  success: '#227A53',
  successSoft: '#E7F3EC',
  warn: '#A96F13',
  warnSoft: '#FFF5D9',
};

const b = (ru, uz, en) => ({ ru, uz, en });
const option = (id, ru, uz, en, correct = false, wrongRu = '', wrongUz = '', wrongEn = '') => ({
  id, text: b(ru, uz, en), correct, wrong: wrongRu ? b(wrongRu, wrongUz, wrongEn) : null,
});
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => (SUPPORTED_LANGS.includes(value) ? value : 'uz');
const tx = (value, lang) => (
  value && typeof value === 'object' && !Array.isArray(value) ? value[lang] ?? '' : value
);

const UI = {
  title: b(
    'Урок 36. Практика: прямоугольник и квадрат',
    "36-dars. Amaliyot: to'g'ri to'rtburchak va kvadrat",
    'Lesson 36. Practice: rectangle and square',
  ),
  language: b('Язык', 'Til', 'Language'),
  task: b('Задание', 'Topshiriq', 'Task'),
  level: {
    green: b('Базовое', 'Asosiy', 'Core'),
    yellow: b('Применение', "Qo'llash", 'Application'),
    red: b('Перенос', "Ko'chirish", 'Transfer'),
  },
  check: b('Проверить', 'Tekshirish', 'Check'),
  retry: b('Исправить ответ', 'Javobni tuzatish', 'Correct the answer'),
  next: b('Следующее', 'Keyingisi', 'Next'),
  finish: b('Завершить', 'Yakunlash', 'Finish'),
  again: b('Пройти заново', 'Qaytadan ishlash', 'Try again'),
  done: b('Практика пройдена', 'Amaliyot tugadi', 'Practice complete'),
  firstTry: b('верно с первой проверки', "birinchi tekshiruvda to'g'ri", 'correct on the first check'),
  allSolved: b('Все 10 заданий решены.', '10 ta topshiriqning barchasi yechildi.', 'All 10 tasks have been solved.'),
  rule: b('Запомни', 'Eslab qoling', 'Remember'),
  matchHint: b(
    'Нажми карточку слева, потом её пару справа.',
    "Chapdagi kartani bosing, keyin uning juftini o'ngdan tanlang.",
    'Tap a card on the left, then its match on the right.',
  ),
  orderHint: b(
    'Нажми место, потом карточку шага.',
    'Avval joyni, keyin qadam kartasini bosing.',
    'Tap a position, then a step card.',
  ),
  slotHint: b(
    'Нажми строку, потом карточку для неё.',
    'Avval qatorni, keyin unga mos kartani bosing.',
    'Tap a row, then the card that belongs in it.',
  ),
  sortHint: b(
    'Нажми панель, потом её ящик.',
    'Panelni bosing, keyin uning qutisini bosing.',
    'Tap a panel, then its box.',
  ),
  returnCard: b('Вернуть', 'Qaytarish', 'Return'),
};

const LESSON_META = {
  lessonId: 'num-4-36-practice',
  lessonTitle: UI.title,
  grade: 4,
  lessonNumber: 36,
  activityType: 'practice',
  taskCount: 10,
  resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'property-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'slot-fill', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-sort', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const BOX_NAMES = {
  square: b('квадрат', 'kvadrat', 'square'),
  rectOnly: b('прямоугольник, но не квадрат', "to'g'ri to'rtburchak, lekin kvadrat emas", 'rectangle but not a square'),
  neither: b('ни то, ни другое', 'ikkisi ham emas', 'neither of the two'),
};

const TASKS = [
  {
    id: '01', level: 'green', kind: 'mc', skillTag: 'extra_property',
    visual: { type: 'quads', items: [{ w: 15, h: 15, right: true }, { w: 24, h: 15, right: true }] },
    setup: b(
      'Рядом лежат квадратная и прямоугольная панели. У обеих по четыре прямых угла.',
      "Yonma-yon kvadrat va to'g'ri to'rtburchak panel yotadi. Ikkalasida ham to'rtta to'g'ri burchak bor.",
      'A square panel and a rectangular panel lie side by side. Both have four right angles.',
    ),
    prompt: b(
      'Что есть у квадрата СВЕРХ свойств прямоугольника?',
      "Kvadratda to'g'ri to'rtburchak xossalaridan ORTIQ nima bor?",
      'What does a square have BEYOND the properties of a rectangle?',
    ),
    options: [
      option('all-sides', 'все четыре стороны равны', "to'rtta tomoni ham teng", 'all four sides are equal', true),
      option('four-right', 'четыре прямых угла', "to'rtta to'g'ri burchak", 'four right angles', false,
        'Четыре прямых угла есть и у прямоугольника, значит это общее свойство.',
        "To'rtta to'g'ri burchak to'g'ri to'rtburchakda ham bor, demak bu umumiy xossa.",
        'A rectangle also has four right angles, so this is a shared property.'),
      option('opposite', 'противоположные стороны равны', 'qarama-qarshi tomonlari teng', 'opposite sides are equal', false,
        'Это тоже общее свойство: у прямоугольника противоположные стороны равны.',
        "Bu ham umumiy xossa: to'g'ri to'rtburchakda qarama-qarshi tomonlar teng.",
        'This is shared too: a rectangle has equal opposite sides.'),
      option('four-sides', 'четыре стороны', "to'rtta tomon", 'four sides', false,
        'Четыре стороны есть у любого четырёхугольника.',
        "To'rtta tomon har qanday to'rtburchakda bor.",
        'Any quadrilateral has four sides.'),
    ],
    secondHint: b(
      'Общее свойство есть у обеих панелей. Особое — только у одной.',
      'Umumiy xossa ikkala panelda ham bor. Maxsus xossa — faqat bittasida.',
      'A shared property belongs to both panels. A special one belongs to just one.',
    ),
    thirdHint: b(
      'Сравни длины сторон: у прямоугольной панели 24 и 15, у квадратной — все 15.',
      "Tomon uzunliklarini solishtiring: to'g'ri to'rtburchakda 24 va 15, kvadratda — hammasi 15.",
      'Compare the side lengths: the rectangular panel has 24 and 15, the square has 15 all round.',
    ),
    correctText: b(
      'Верно. Особое свойство квадрата — четыре равные стороны.',
      "To'g'ri. Kvadratning maxsus xossasi — to'rtta teng tomon.",
      'Correct. The special property of a square is its four equal sides.',
    ),
    rule: b(
      'У квадрата есть все свойства прямоугольника и ещё одно своё.',
      "Kvadratda to'g'ri to'rtburchakning hamma xossasi bor va ustiga yana bittasi qo'shiladi.",
      'A square has every property of a rectangle plus one of its own.',
    ),
  },

  {
    id: '02', level: 'green', kind: 'missing', skillTag: 'restore_property_line',
    visual: { type: 'property-card', figure: { w: 14, h: 14, right: true } },
    setup: b(
      'В карточке квадратной панели строка про углы заполнена, а строка про стороны пустая.',
      "Kvadrat panel kartasida burchaklar qatori to'ldirilgan, tomonlar qatori esa bo'sh.",
      'On the square panel card the line about angles is filled in, but the line about sides is empty.',
    ),
    prompt: b(
      'Что стоит в строке про стороны?',
      'Tomonlar qatorida nima turadi?',
      'What belongs in the line about the sides?',
    ),
    options: [
      option('four-equal', 'все четыре равны', "to'rttasi ham teng", 'all four are equal', true),
      option('opposite-only', 'противоположные равны, соседние разные', 'qarama-qarshilari teng, qo\'shnilari har xil', 'opposite equal, adjacent different', false,
        'Это строка прямоугольника, который не является квадратом.',
        "Bu kvadrat bo'lmagan to'g'ri to'rtburchakning qatori.",
        'That is the line for a rectangle that is not a square.'),
      option('none-equal', 'ни одна не равна другой', 'hech biri teng emas', 'no two are equal', false,
        'Тогда у панели не было бы даже равных противоположных сторон.',
        "Unda panelda qarama-qarshi teng tomonlar ham bo'lmasdi.",
        'Then the panel would not even have equal opposite sides.'),
      option('two-equal', 'равны только две', 'faqat ikkitasi teng', 'only two are equal', false,
        'Проверь по чертежу: сколько сторон панели имеют одинаковую длину?',
        "Chizmaga qarab tekshiring: panelning nechta tomoni bir xil uzunlikda?",
        'Check the drawing: how many sides of the panel have the same length?'),
    ],
    secondHint: b(
      'На чертеже подписана длина каждой стороны.',
      'Chizmada har tomonning uzunligi imzolangan.',
      'The drawing labels the length of every side.',
    ),
    thirdHint: b(
      'Все четыре стороны здесь по 14 дм.',
      "Bu yerda to'rtala tomon 14 dm.",
      'All four sides here are 14 dm.',
    ),
    correctText: b(
      'Верно. У квадрата все четыре стороны равны.',
      "To'g'ri. Kvadratning to'rtala tomoni teng.",
      'Correct. All four sides of a square are equal.',
    ),
    rule: b(
      'Карточку заполняют по двум признакам: углы и стороны.',
      "Karta ikki belgi bo'yicha to'ldiriladi: burchaklar va tomonlar.",
      'The card is filled in by two features: angles and sides.',
    ),
  },

  {
    id: '03', level: 'yellow', kind: 'match', skillTag: 'figure_to_statement',
    visual: { type: 'quads', items: [{ w: 15, h: 15, right: true }, { w: 21, h: 12, right: true }, { w: 15, h: 15, angle: 65 }] },
    setup: b(
      'На столе три панели: квадратная, прямоугольная и ромб со стороной 15 дм.',
      "Stolda uchta panel bor: kvadrat, to'g'ri to'rtburchak va tomoni 15 dm bo'lgan romb.",
      'Three panels are on the table: a square, a rectangle and a rhombus with a 15 dm side.',
    ),
    prompt: b(
      'Соедини панель с верным утверждением о ней.',
      'Panelni u haqidagi to\'g\'ri gap bilan birlashtiring.',
      'Match each panel with the true statement about it.',
    ),
    pairs: [
      {
        id: 'square', left: b('квадрат 15 дм', 'kvadrat 15 dm', 'square 15 dm'),
        correctRight: 'also-rect',
      },
      {
        id: 'rect', left: b('панель 21 × 12 дм', 'panel 21 × 12 dm', 'panel 21 × 12 dm'),
        correctRight: 'not-square',
      },
      {
        id: 'rhombus', left: b('ромб 15 дм, угол 65°', 'romb 15 dm, burchak 65°', 'rhombus 15 dm, angle 65°'),
        correctRight: 'no-right-angles',
      },
    ],
    right: [
      { id: 'also-rect', text: b('это и прямоугольник тоже', "bu to'g'ri to'rtburchak ham", 'this is a rectangle too') },
      { id: 'not-square', text: b('прямоугольник, но не квадрат', "to'g'ri to'rtburchak, kvadrat emas", 'a rectangle but not a square') },
      { id: 'no-right-angles', text: b('стороны равны, но углы не прямые', "tomonlari teng, lekin burchaklari to'g'ri emas", 'equal sides but no right angles') },
    ],
    wrong: [b(
      'Смотри на два признака сразу: углы и стороны. Одного признака мало.',
      'Ikki belgiga birdan qarang: burchaklar va tomonlar. Bitta belgi yetmaydi.',
      'Look at both features at once: angles and sides. One feature is not enough.',
    )],
    secondHint: b(
      'У ромба стороны равны, но кто сказал, что углы прямые?',
      "Rombning tomonlari teng, lekin burchaklari to'g'ri deb kim aytdi?",
      'A rhombus has equal sides, but who said its angles are right?',
    ),
    thirdHint: b(
      'Квадрат подходит под определение прямоугольника; панель 21 × 12 — нет под квадрат; ромб с углом 65° — не прямоугольник.',
      "Kvadrat to'g'ri to'rtburchak ta'rifiga mos; 21 × 12 panel kvadratga mos emas; 65° burchakli romb to'g'ri to'rtburchak emas.",
      'A square fits the definition of a rectangle; the 21 × 12 panel is not a square; a rhombus with a 65° angle is not a rectangle.',
    ),
    correctText: b(
      'Верно. Равные стороны сами по себе квадрата не делают.',
      "To'g'ri. Teng tomonlar o'z-o'zidan kvadrat qilmaydi.",
      'Correct. Equal sides alone do not make a square.',
    ),
    rule: b(
      'Квадрат — это и равные стороны, и прямые углы одновременно.',
      "Kvadrat — bu ayni vaqtda teng tomonlar ham, to'g'ri burchaklar ham.",
      'A square means equal sides and right angles at the same time.',
    ),
  },

  {
    id: '04', level: 'yellow', kind: 'order', skillTag: 'panel_check_order',
    visual: { type: 'check-sheet', rows: 4 },
    setup: b(
      'Панель принимают по протоколу проверки.',
      'Panel tekshiruv bayonnomasi bo\'yicha qabul qilinadi.',
      'A panel is accepted according to a checking protocol.',
    ),
    prompt: b(
      'Расставь шаги проверки по порядку.',
      'Tekshiruv qadamlarini tartib bilan joylashtiring.',
      'Put the checking steps in order.',
    ),
    steps: [
      { id: 'step-1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 'step-2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 'step-3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 'step-4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'look-angles', text: b('Смотрим углы', 'Burchaklarga qaraymiz', 'Look at the angles'), order: 0 },
      { id: 'four-right', text: b('Все четыре прямые?', "To'rttasi ham to'g'rimi?", 'Are all four right?'), order: 1 },
      { id: 'look-sides', text: b('Смотрим стороны', 'Tomonlarga qaraymiz', 'Look at the sides'), order: 2 },
      { id: 'four-equal', text: b('Все четыре равны?', "To'rttasi ham tengmi?", 'Are all four equal?'), order: 3 },
    ],
    wrong: [b(
      'Сначала углы: без прямых углов дальше проверять нечего.',
      "Avval burchaklar: to'g'ri burchak bo'lmasa, keyingisini tekshirishning hojati yo'q.",
      'Angles first: with no right angles there is nothing further to check.',
    )],
    secondHint: b(
      'Ромб проходит проверку сторон, но не проходит проверку углов.',
      'Romb tomonlar tekshiruvidan o\'tadi, lekin burchaklar tekshiruvidan o\'tmaydi.',
      'A rhombus passes the check on sides but fails the check on angles.',
    ),
    thirdHint: b(
      'Порядок такой: углы, четыре прямых, стороны, четыре равных.',
      "Tartib shunday: burchaklar, to'rtta to'g'ri, tomonlar, to'rtta teng.",
      'The order is: angles, four right, sides, four equal.',
    ),
    correctText: b(
      'Верно. Углы проверяют первыми, поэтому ромб отсеивается сразу.',
      "To'g'ri. Burchaklar birinchi tekshiriladi, shuning uchun romb darrov chiqib ketadi.",
      'Correct. The angles are checked first, so the rhombus is ruled out at once.',
    ),
    rule: b(
      'Вывод делают после обеих проверок, а не после одной.',
      'Xulosa ikkala tekshiruvdan keyin chiqariladi, bittasidan keyin emas.',
      'The conclusion comes after both checks, not after one.',
    ),
  },

  {
    id: '05', level: 'yellow', kind: 'slots', skillTag: 'nesting_slots',
    visual: { type: 'nesting' },
    setup: b(
      'На складе одна коробка стоит внутри другой: квадратные панели лежат внутри прямоугольных.',
      "Omborda bitta quti boshqasining ichida turadi: kvadrat panellar to'g'ri to'rtburchaklar ichida yotadi.",
      'In the store one box sits inside another: the square panels lie inside the rectangular ones.',
    ),
    prompt: b(
      'Дополни два утверждения.',
      'Ikki gapni to\'ldiring.',
      'Complete the two statements.',
    ),
    slots: [
      {
        id: 'every-square', label: b('Каждый квадрат — это…', 'Har bir kvadrat — bu…', 'Every square is…'), correct: 'is-rect',
        wrong: b(
          'Квадрат проходит обе проверки прямоугольника, значит он входит в его коробку.',
          "Kvadrat to'g'ri to'rtburchakning ikkala tekshiruvidan o'tadi, demak uning qutisiga kiradi.",
          'A square passes both checks for a rectangle, so it belongs in that box.',
        ),
      },
      {
        id: 'every-rect', label: b('Каждый прямоугольник…', "Har bir to'g'ri to'rtburchak…", 'Every rectangle…'), correct: 'not-always',
        wrong: b(
          'Панель 21 × 12 — прямоугольник, но квадратом её не назовёшь.',
          "21 × 12 panel to'g'ri to'rtburchak, lekin uni kvadrat deb bo'lmaydi.",
          'The 21 × 12 panel is a rectangle, but it cannot be called a square.',
        ),
      },
    ],
    cards: [
      { id: 'is-rect', text: b('прямоугольник', "to'g'ri to'rtburchak", 'a rectangle') },
      { id: 'not-always', text: b('не обязательно квадрат', "kvadrat bo'lishi shart emas", 'not necessarily a square') },
      { id: 'is-square', text: b('квадрат', 'kvadrat', 'a square') },
      { id: 'not-rect', text: b('не прямоугольник', "to'g'ri to'rtburchak emas", 'not a rectangle') },
    ],
    secondHint: b(
      'Одно утверждение верно всегда, другое — не всегда.',
      "Bitta gap doim to'g'ri, ikkinchisi — doim emas.",
      'One statement is always true, the other is not always true.',
    ),
    thirdHint: b(
      'Маленькая коробка лежит внутри большой, а не наоборот.',
      'Kichik quti kattasining ichida yotadi, teskarisi emas.',
      'The small box sits inside the big one, not the other way round.',
    ),
    correctText: b(
      'Верно. Квадраты лежат внутри прямоугольников, а не наоборот.',
      "To'g'ri. Kvadratlar to'g'ri to'rtburchaklar ichida yotadi, teskarisi emas.",
      'Correct. Squares lie inside the rectangles, not the other way round.',
    ),
    rule: b(
      'Множество квадратов входит в множество прямоугольников.',
      "Kvadratlar to'plami to'g'ri to'rtburchaklar to'plamiga kiradi.",
      'The set of squares is contained in the set of rectangles.',
    ),
  },

  {
    id: '06', level: 'yellow', kind: 'mc', skillTag: 'facade_order',
    visual: { type: 'store-boxes' },
    setup: b(
      'На фасад заказали квадратные панели со стороной 18 дм. На складе есть только ящик с надписью «прямоугольные панели».',
      "Fasadga tomoni 18 dm bo'lgan kvadrat panellar buyurildi. Omborda faqat «to'g'ri to'rtburchak panellar» yozuvli quti bor.",
      'Square panels with an 18 dm side were ordered for the facade. The store has only a box labelled rectangular panels.',
    ),
    prompt: b(
      'Можно ли взять нужные панели из этого ящика?',
      'Kerakli panellarni shu qutidan olish mumkinmi?',
      'Can the panels needed be taken from that box?',
    ),
    options: [
      option('yes-square-is-rect', 'да, квадрат — это тоже прямоугольник', "ha, kvadrat — bu to'g'ri to'rtburchak ham", 'yes, a square is a rectangle too', true),
      option('no-other-figure', 'нет, это другая фигура', "yo'q, bu boshqa figura", 'no, that is a different figure', false,
        'Квадрат не другая фигура, а особый прямоугольник.',
        "Kvadrat boshqa figura emas, balki maxsus to'g'ri to'rtburchak.",
        'A square is not a different figure but a special rectangle.'),
      option('only-if-equal', 'только если стороны окажутся равными', "faqat tomonlari teng chiqsa", 'only if the sides turn out equal', false,
        'У квадрата стороны равны по определению, проверять это заново не нужно.',
        "Kvadratning tomonlari ta'rifiga ko'ra teng, buni qaytadan tekshirish shart emas.",
        'A square has equal sides by definition; there is no need to check that again.'),
      option('cannot-tell', 'по надписи определить нельзя', "yozuvga qarab aniqlab bo'lmaydi", 'the label does not let you decide', false,
        'Надписи достаточно: в ящике прямоугольники, а квадраты входят в них.',
        "Yozuv yetarli: qutida to'g'ri to'rtburchaklar bor, kvadratlar esa ularga kiradi.",
        'The label is enough: the box holds rectangles, and squares are among them.'),
    ],
    secondHint: b(
      'Вспомни, какая коробка лежит внутри какой.',
      'Qaysi quti qaysining ichida yotganini eslang.',
      'Recall which box sits inside which.',
    ),
    thirdHint: b(
      'Квадрат проходит обе проверки прямоугольника, значит лежит в его ящике.',
      "Kvadrat to'g'ri to'rtburchakning ikkala tekshiruvidan o'tadi, demak uning qutisida yotadi.",
      'A square passes both rectangle checks, so it lies in that box.',
    ),
    correctText: b(
      'Верно. Квадратные панели лежат в ящике прямоугольных.',
      "To'g'ri. Kvadrat panellar to'g'ri to'rtburchaklar qutisida yotadi.",
      'Correct. The square panels lie in the box of rectangular ones.',
    ),
    rule: b(
      'Особый случай остаётся внутри общего, а не рядом с ним.',
      'Maxsus hol umumiyning ichida qoladi, uning yonida emas.',
      'A special case stays inside the general one, not beside it.',
    ),
  },

  {
    id: '07', level: 'yellow', kind: 'order', skillTag: 'nesting_order',
    visual: { type: 'nesting' },
    setup: b(
      'Четыре названия нужно расставить от самого общего к самому частному.',
      "To'rtta nomni eng umumiydan eng xususiygacha joylashtirish kerak.",
      'Four names must be arranged from the most general to the most specific.',
    ),
    prompt: b(
      'Расставь названия от самого общего к самому частному.',
      'Nomlarni eng umumiydan eng xususiygacha joylashtiring.',
      'Arrange the names from the most general to the most specific.',
    ),
    steps: [
      { id: 'place-1', label: b('1-е', "1-o'rin", '1st') },
      { id: 'place-2', label: b('2-е', "2-o'rin", '2nd') },
      { id: 'place-3', label: b('3-е', "3-o'rin", '3rd') },
      { id: 'place-4', label: b('4-е', "4-o'rin", '4th') },
    ],
    cards: [
      { id: 'polygon', text: b('многоугольник', "ko'pburchak", 'polygon'), order: 0 },
      { id: 'quad', text: b('четырёхугольник', "to'rtburchak", 'quadrilateral'), order: 1 },
      { id: 'rect', text: b('прямоугольник', "to'g'ri to'rtburchak", 'rectangle'), order: 2 },
      { id: 'square', text: b('квадрат', 'kvadrat', 'square'), order: 3 },
    ],
    wrong: [b(
      'Каждое следующее название добавляет новое требование, а не убирает его.',
      "Har keyingi nom yangi talab qo'shadi, uni olib tashlamaydi.",
      'Each next name adds a new requirement rather than removing one.',
    )],
    secondHint: b(
      'Чем больше требований, тем частнее название.',
      'Talab qancha ko\'p bo\'lsa, nom shuncha xususiy bo\'ladi.',
      'The more requirements, the more specific the name.',
    ),
    thirdHint: b(
      'У четырёхугольника четыре стороны, у прямоугольника ещё и прямые углы, у квадрата ещё и равные стороны.',
      "To'rtburchakda to'rtta tomon, to'g'ri to'rtburchakda ustiga to'g'ri burchaklar, kvadratda esa yana teng tomonlar bor.",
      'A quadrilateral has four sides, a rectangle adds right angles, and a square adds equal sides.',
    ),
    correctText: b(
      'Верно. Каждый шаг добавляет одно требование.',
      "To'g'ri. Har qadam bitta talab qo'shadi.",
      'Correct. Each step adds one requirement.',
    ),
    rule: b(
      'Частный случай наследует все требования общего.',
      'Xususiy hol umumiyning barcha talablarini oladi.',
      'A special case inherits every requirement of the general one.',
    ),
  },

  {
    id: '08', level: 'red', kind: 'sort', skillTag: 'rhombus_boundary',
    visual: { type: 'quads', items: [{ w: 14, h: 14, right: true }, { w: 24, h: 15, right: true }, { w: 14, h: 14, angle: 65 }, { w: 18, h: 18, right: true }] },
    setup: b(
      'Четыре панели: две с равными сторонами и прямыми углами, одна прямоугольная и одна с равными сторонами, но углом 65 градусов.',
      "To'rtta panel: ikkitasida teng tomon va to'g'ri burchak, bittasi to'g'ri to'rtburchak, bittasida esa teng tomon bor, lekin burchak 65 daraja.",
      'Four panels: two with equal sides and right angles, one rectangular, and one with equal sides but a 65-degree angle.',
    ),
    prompt: b(
      'Разложи панели по ящикам.',
      'Panellarni qutilarga joylashtiring.',
      'Sort the panels into the boxes.',
    ),
    bins: [
      { id: 'square', label: BOX_NAMES.square },
      { id: 'rect-only', label: BOX_NAMES.rectOnly },
      { id: 'neither', label: BOX_NAMES.neither },
    ],
    items: [
      {
        id: 'p14sq', text: '14 · 14 · 90°', bin: 'square',
        wrong: b(
          'Здесь выполнены оба требования сразу. Проверь и углы, и стороны.',
          'Bu yerda ikkala talab birdan bajarilgan. Burchaklarni ham, tomonlarni ham tekshiring.',
          'Both requirements are met here. Check both the angles and the sides.',
        ),
      },
      {
        id: 'p2415', text: '24 · 15 · 90°', bin: 'rect-only',
        wrong: b(
          'Углы прямые, но сравни длины соседних сторон.',
          "Burchaklar to'g'ri, lekin qo'shni tomonlar uzunligini solishtiring.",
          'The angles are right, but compare the lengths of the adjacent sides.',
        ),
      },
      {
        id: 'p14rh', text: '14 · 14 · 65°', bin: 'neither',
        wrong: b(
          'Стороны равны, но что с углами? Проверь второе требование.',
          'Tomonlar teng, burchaklar-chi? Ikkinchi talabni tekshiring.',
          'The sides are equal, but what about the angles? Check the second requirement.',
        ),
      },
      {
        id: 'p18sq', text: '18 · 18 · 90°', bin: 'square',
        wrong: b(
          'Сравни эту панель с той, у которой стороны по 14 дм.',
          'Bu panelni tomonlari 14 dm bo\'lgan panel bilan solishtiring.',
          'Compare this panel with the one whose sides are 14 dm.',
        ),
      },
    ],
    wrong: [b(
      'Ящик выбирают по двум требованиям сразу: прямые углы и равные стороны.',
      "Quti ikki talabga birdan qarab tanlanadi: to'g'ri burchaklar va teng tomonlar.",
      'The box is chosen by both requirements at once: right angles and equal sides.',
    )],
    secondHint: b(
      'Панель с углом 65 градусов не проходит проверку углов.',
      '65 darajali burchakli panel burchaklar tekshiruvidan o\'tmaydi.',
      'The panel with a 65-degree angle fails the check on angles.',
    ),
    thirdHint: b(
      '14 · 14 · 90° и 18 · 18 · 90° — квадраты; 24 · 15 · 90° — прямоугольник; 14 · 14 · 65° — ни то, ни другое.',
      "14 · 14 · 90° va 18 · 18 · 90° — kvadrat; 24 · 15 · 90° — to'g'ri to'rtburchak; 14 · 14 · 65° — ikkisi ham emas.",
      '14 · 14 · 90° and 18 · 18 · 90° are squares; 24 · 15 · 90° is a rectangle; 14 · 14 · 65° is neither.',
    ),
    correctText: b(
      'Верно. Равные стороны без прямых углов квадрата не дают.',
      "To'g'ri. To'g'ri burchaksiz teng tomonlar kvadrat bermaydi.",
      'Correct. Equal sides without right angles do not make a square.',
    ),
    rule: b(
      'Одно требование из двух — это ещё не квадрат.',
      'Ikki talabdan bittasi — bu hali kvadrat emas.',
      'One requirement out of two does not yet make a square.',
    ),
  },

  {
    id: '09', level: 'red', kind: 'slots', skillTag: 'repair_sorting',
    visual: { type: 'store-boxes', error: true },
    setup: b(
      'Бит положил квадратные панели в ящик «другие фигуры», и партия фасада не собралась.',
      "Bit kvadrat panellarni «boshqa figuralar» qutisiga qo'ydi va fasad partiyasi to'liq chiqmadi.",
      'Bit put the square panels into the other figures box, and the facade batch did not come out complete.',
    ),
    prompt: b(
      'Заполни строки разбора ошибки.',
      'Xato tahlili qatorlarini to\'ldiring.',
      'Fill in the rows of the error analysis.',
    ),
    slots: [
      {
        id: 'bit-box', label: b('Ящик Бита', 'Bit qo\'ygan quti', 'Bit box'), correct: 'other-card',
        wrong: b(
          'В эту строку идёт надпись того ящика, куда панели попали по ошибке.',
          "Bu qatorga panellar xato bilan tushgan qutining yozuvi yoziladi.",
          'This line takes the label of the box the panels ended up in by mistake.',
        ),
      },
      {
        id: 'right-box', label: b('Верный ящик', "To'g'ri quti", 'Correct box'), correct: 'rect-card',
        wrong: b(
          'Квадрат проходит обе проверки прямоугольника.',
          "Kvadrat to'g'ri to'rtburchakning ikkala tekshiruvidan o'tadi.",
          'A square passes both checks for a rectangle.',
        ),
      },
      {
        id: 'error-name', label: b('Название ошибки', 'Xato nomi', 'Name of the error'), correct: 'split-card',
        wrong: b(
          'Назови, что именно сделано неверно, а не куда переложить панели.',
          "Panellarni qayerga ko'chirishni emas, aynan nima noto'g'ri qilinganini ayting.",
          'Name what was done wrongly, not where to move the panels.',
        ),
      },
    ],
    cards: [
      { id: 'other-card', text: b('другие фигуры', 'boshqa figuralar', 'other figures') },
      { id: 'rect-card', text: b('прямоугольные панели', "to'g'ri to'rtburchak panellar", 'rectangular panels') },
      { id: 'split-card', text: b('квадрат отделён от прямоугольника', "kvadrat to'g'ri to'rtburchakdan ajratilgan", 'the square was separated from the rectangle') },
      { id: 'squares-card', text: b('квадратные панели', 'kvadrat panellar', 'square panels') },
      { id: 'angle-card', text: b('углы измерены неверно', "burchaklar noto'g'ri o'lchangan", 'the angles were measured wrongly') },
    ],
    secondHint: b(
      'Ошибка не в измерении, а в том, куда отнесли квадрат.',
      "Xato o'lchashda emas, kvadratni qayerga kiritishda.",
      'The error is not in the measuring but in where the square was placed.',
    ),
    thirdHint: b(
      'Квадратные панели должны были попасть в ящик прямоугольных.',
      "Kvadrat panellar to'g'ri to'rtburchaklar qutisiga tushishi kerak edi.",
      'The square panels should have gone into the box of rectangular ones.',
    ),
    correctText: b(
      'Верно. Ошибка в том, что квадрат вывели из прямоугольников.',
      "To'g'ri. Xato shundaki, kvadrat to'g'ri to'rtburchaklardan chiqarib qo'yilgan.",
      'Correct. The error is that the square was taken out of the rectangles.',
    ),
    rule: b(
      'Сначала называют характер ошибки, потом исправляют раскладку.',
      'Avval xatoning tabiati nomlanadi, keyin joylashuv tuzatiladi.',
      'First name the nature of the error, then correct the arrangement.',
    ),
  },

  {
    id: '10', level: 'red', kind: 'match', skillTag: 'name_from_description',
    visual: { type: 'order-sheet', rows: 3 },
    setup: b(
      'В новом заказе чертежей нет — только описания.',
      "Yangi buyurtmada chizma yo'q — faqat tavsiflar bor.",
      'The new order has no drawings, only descriptions.',
    ),
    prompt: b(
      'Соедини описание с названием фигуры.',
      'Tavsifni figura nomi bilan birlashtiring.',
      'Match each description with the name of the figure.',
    ),
    pairs: [
      {
        id: 'd-rect',
        left: b('четыре прямых угла, соседние стороны разные', "to'rtta to'g'ri burchak, qo'shni tomonlari har xil", 'four right angles, adjacent sides different'),
        correctRight: 'rect-only',
      },
      {
        id: 'd-square',
        left: b('четыре прямых угла, четыре равные стороны', "to'rtta to'g'ri burchak, to'rtta teng tomon", 'four right angles, four equal sides'),
        correctRight: 'square',
      },
      {
        id: 'd-neither',
        left: b('четыре равные стороны, прямых углов нет', "to'rtta teng tomon, to'g'ri burchak yo'q", 'four equal sides, no right angles'),
        correctRight: 'neither',
      },
    ],
    right: [
      { id: 'rect-only', text: BOX_NAMES.rectOnly },
      { id: 'square', text: BOX_NAMES.square },
      { id: 'neither', text: BOX_NAMES.neither },
    ],
    wrong: [b(
      'Проверь по описанию оба признака: сначала углы, потом стороны.',
      'Tavsifga qarab ikkala belgini tekshiring: avval burchaklar, keyin tomonlar.',
      'Check both features in the description: angles first, then sides.',
    )],
    secondHint: b(
      'Если про прямые углы не сказано, значит их нет.',
      "To'g'ri burchaklar haqida aytilmagan bo'lsa, demak ular yo'q.",
      'If right angles are not mentioned, they are not there.',
    ),
    thirdHint: b(
      'Оба признака выполнены — квадрат; только углы — прямоугольник; только стороны — ни то, ни другое.',
      "Ikkala belgi bajarilgan — kvadrat; faqat burchaklar — to'g'ri to'rtburchak; faqat tomonlar — ikkisi ham emas.",
      'Both features met means a square; only the angles means a rectangle; only the sides means neither.',
    ),
    correctText: b(
      'Верно. Название читается прямо из двух признаков, без чертежа.',
      "To'g'ri. Nom chizmasiz, to'g'ridan-to'g'ri ikki belgidan o'qiladi.",
      'Correct. The name is read straight from the two features, with no drawing.',
    ),
    rule: b(
      'Углы и стороны вместе дают название; по одному признаку решать нельзя.',
      "Burchaklar va tomonlar birgalikda nom beradi; bitta belgi bilan hal qilib bo'lmaydi.",
      'Angles and sides together give the name; one feature alone cannot decide.',
    ),
  },
];

const adaptive = (task, pickedOption, slotWrong, itemWrong, attempts) => {
  if (attempts >= 3) return task.thirdHint;
  if (attempts >= 2) return task.secondHint;
  if (pickedOption?.wrong) return pickedOption.wrong;
  if (slotWrong) return slotWrong;
  if (itemWrong) return itemWrong;
  return task.wrong?.[0] || task.secondHint;
};

// ---------------------------------------------------------------------------
// CHIZMALAR. To'rtburchak o'lchamlardan yasaladi: `right: true` bo'lsa tik
// burchaklar va kvadratcha belgisi chiziladi, `angle` berilsa figura shu
// burchakka qiyshaytiriladi (romb). Rasm va imzo bitta manbadan chiqadi.
// ---------------------------------------------------------------------------
const QuadSvg = ({ item }) => {
  const scale = 3.1;
  const w = item.w * scale;
  const h = item.h * scale;
  const skew = item.angle ? Math.cos((item.angle * Math.PI) / 180) * h : 0;
  const points = item.angle
    ? [[0, h], [w, h], [w + skew, 0], [skew, 0]]
    : [[0, h], [w, h], [w, 0], [0, 0]];
  const width = w + Math.abs(skew) + 26;
  return (
    <svg className="p4-quad" viewBox={`0 0 ${width} ${h + 26}`} aria-hidden="true">
      <polygon points={points.map(([x, y]) => `${x + 13},${y + 13}`).join(' ')}
        fill={item.angle ? T.warnSoft : T.cyanSoft} stroke={item.angle ? T.warn : T.cyan} strokeWidth="2" />
      {item.right && <path d={`M13 ${h + 13 - 11} v11 h11`} fill="none" stroke={T.navy} strokeWidth="1.6" />}
      {item.angle && <text x={item.angle ? 24 : 18} y={h + 8} className="p4-quad-label">{item.angle}°</text>}
      <text x={w / 2 + 13} y={h + 24} textAnchor="middle" className="p4-quad-label">{item.w}</text>
      <text x={6} y={h / 2 + 16} textAnchor="middle" className="p4-quad-label">{item.h}</text>
    </svg>
  );
};

function Visual({ task, lang }) {
  const visual = task.visual;
  if (!visual) return null;

  if (visual.type === 'quads') {
    return (
      <div className="p4-visual p4-visual-row">
        {visual.items.map((item, index) => (
          <span className="p4-quad-cell" key={index} style={{ animationDelay: `${index * 70}ms` }}>
            <QuadSvg item={item} />
          </span>
        ))}
      </div>
    );
  }

  if (visual.type === 'property-card') {
    return (
      <div className="p4-visual p4-visual-row">
        <QuadSvg item={visual.figure} />
        <span className="p4-form">
          <i className="is-filled" />
          <i />
        </span>
      </div>
    );
  }

  if (visual.type === 'check-sheet' || visual.type === 'order-sheet') {
    return (
      <div className="p4-visual">
        <span className="p4-form">
          {Array.from({ length: visual.rows }, (_, index) => <i key={index} style={{ animationDelay: `${index * 70}ms` }} />)}
        </span>
      </div>
    );
  }

  if (visual.type === 'nesting') {
    return (
      <div className="p4-visual">
        <svg className="p4-svg" viewBox="0 0 300 108" role="img" aria-label={tx(task.setup, lang)}>
          <rect x="18" y="14" width="264" height="80" rx="14" fill="none" stroke={T.cyan} strokeWidth="2" />
          <rect x="150" y="30" width="118" height="48" rx="11" fill={T.cyanSoft} stroke={T.accent} strokeWidth="2" />
        </svg>
      </div>
    );
  }

  if (visual.type === 'store-boxes') {
    return (
      <div className="p4-visual p4-visual-row">
        <svg className="p4-svg p4-svg-narrow" viewBox="0 0 120 84" role="img" aria-label={tx(task.setup, lang)}>
          <path d="M10 26 H110 V78 H10 Z" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="2" />
          <path d="M10 26 L24 12 H96 L110 26" fill={T.paper} stroke={T.cyan} strokeWidth="2" />
        </svg>
        <svg className="p4-svg p4-svg-narrow" viewBox="0 0 120 84" role="img" aria-hidden="true">
          <path d="M10 26 H110 V78 H10 Z" fill={visual.error ? T.warnSoft : T.paper} stroke={visual.error ? T.warn : T.ink3} strokeWidth="2" />
          <path d="M10 26 L24 12 H96 L110 26" fill={T.paper} stroke={visual.error ? T.warn : T.ink3} strokeWidth="2" />
        </svg>
      </div>
    );
  }

  return null;
}

function Feedback({ ok, text, rule, lang, feedbackRef }) {
  return (
    <div ref={feedbackRef} className={`p4-feedback ${ok ? 'is-ok' : 'is-no'}`} role="status" aria-live="polite">
      <p>{tx(text, lang)}</p>
      {ok && <p className="p4-rule"><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>}
    </div>
  );
}

function Task({ task, lang, isLast, onSolved, shuffleSeed }) {
  const [pickedId, setPickedId] = useState(null);
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [placed, setPlaced] = useState({});
  const [activeCell, setActiveCell] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [activeItem, setActiveItem] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const checkingRef = useRef(false);
  const advancedRef = useRef(false);
  const feedbackRef = useRef(null);

  // Xato javobdan keyin variantlar qayta aralashadi (metodist qarori 2026-08-21).
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task kaliti atayin yangi aralashtirish beradi
  const options = useMemo(() => shuffle(task.options || []), [shuffleSeed, task.id, task.options, wrongRound]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task kaliti atayin yangi aralashtirish beradi
  const rightCards = useMemo(() => shuffle(task.right || []), [shuffleSeed, task.id, task.right]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task kaliti atayin yangi aralashtirish beradi
  const bankCards = useMemo(() => shuffle(task.cards || []), [shuffleSeed, task.id, task.cards]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task kaliti atayin yangi aralashtirish beradi
  const sortItems = useMemo(() => shuffle(task.items || []), [shuffleSeed, task.id, task.items]);

  useEffect(() => {
    if (checked) window.setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
  }, [checked]);

  const answerReady = (() => {
    if (task.options) return pickedId !== null;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id]);
    if (task.kind === 'sort') return task.items.every((item) => assignments[item.id]);
    if (task.kind === 'slots') return task.slots.every((slot) => placed[slot.id]);
    return task.steps.every((step) => placed[step.id]);
  })();

  const answerCorrect = () => {
    if (task.options) return task.options.find((item) => item.id === pickedId)?.correct === true;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    if (task.kind === 'sort') return task.items.every((item) => assignments[item.id] === item.bin);
    if (task.kind === 'slots') return task.slots.every((slot) => placed[slot.id] === slot.correct);
    return task.cards.every((card) => placed[task.steps[card.order].id] === card.id);
  };

  const clearResponse = () => {
    checkingRef.current = false;
    setChecked(false);
    setPickedId(null);
    setPairs({});
    setActiveLeft(null);
    setPlaced({});
    setActiveCell(null);
    setAssignments({});
    setActiveItem(null);
  };

  const check = () => {
    if (!answerReady || solved || checked || checkingRef.current) return;
    checkingRef.current = true;
    setAttempts((old) => old + 1);
    setChecked(true);
    if (answerCorrect()) setSolved(true); else setWrongRound((old) => old + 1);
  };

  const placeCard = (cardId) => {
    if (solved || activeCell === null) return;
    checkingRef.current = false;
    setPlaced((old) => {
      const next = { ...old };
      Object.keys(next).forEach((key) => { if (next[key] === cardId) delete next[key]; });
      next[activeCell] = cardId;
      return next;
    });
    setActiveCell(null);
    setChecked(false);
  };

  const pickedOption = task.options ? task.options.find((item) => item.id === pickedId) : null;
  const slotWrong = task.kind === 'slots'
    ? task.slots.find((slot) => placed[slot.id] !== slot.correct)?.wrong
    : null;
  const firstWrongItem = task.kind === 'sort'
    ? task.items.find((item) => assignments[item.id] && assignments[item.id] !== item.bin)
    : null;
  const cardText = (cardId) => tx(task.cards?.find((card) => card.id === cardId)?.text, lang);

  const studentAnswer = (() => {
    if (task.options) return { optionId: pickedId, text: pickedOption?.text };
    if (task.kind === 'match') return { pairs };
    if (task.kind === 'sort') return { bins: assignments };
    if (task.kind === 'slots') return { slots: placed };
    return { order: task.steps.map((step) => placed[step.id]) };
  })();

  const correctAnswer = (() => {
    if (task.options) {
      const item = task.options.find((candidate) => candidate.correct);
      return { optionId: item.id, text: item.text };
    }
    if (task.kind === 'match') {
      return { pairs: Object.fromEntries(task.pairs.map((pair) => [pair.id, pair.correctRight])) };
    }
    if (task.kind === 'sort') {
      return { bins: Object.fromEntries(task.items.map((item) => [item.id, item.bin])) };
    }
    if (task.kind === 'slots') {
      return { slots: Object.fromEntries(task.slots.map((slot) => [slot.id, slot.correct])) };
    }
    return { order: task.cards.slice().sort((a, c) => a.order - c.order).map((card) => card.id) };
  })();

  const optionClass = (item) => {
    if (pickedId !== item.id) return '';
    if (!checked) return 'is-on';
    return item.correct ? 'is-ok' : 'is-no';
  };

  const unassigned = sortItems.filter((item) => !assignments[item.id]);

  return (
    <section className="p4-task" aria-labelledby={`task-${task.id}`}>
      <p className={`p4-eyebrow is-${task.level}`}>
        <span>{tx(UI.level[task.level], lang)}</span> · {tx(UI.task, lang)} {Number(task.id)}
      </p>
      <p className="p4-setup">{tx(task.setup, lang)}</p>
      <h2 id={`task-${task.id}`}>{tx(task.prompt, lang)}</h2>
      <Visual task={task} lang={lang} />

      {task.options && (
        <div className={task.kind === 'missing' ? 'p4-missing p4-options' : 'p4-options'}>
          {options.map((item, index) => (
            <button type="button" key={item.id} className={`p4-option ${optionClass(item)}`}
              disabled={solved} aria-pressed={pickedId === item.id}
              onClick={() => { checkingRef.current = false; setPickedId(item.id); setChecked(false); }}>
              <span className="p4-letter">{'ABCD'[index]}</span>
              {tx(item.text, lang)}
            </button>
          ))}
        </div>
      )}

      {task.kind === 'match' && (
        <div className="p4-match">
          <p className="p4-note">{tx(UI.matchHint, lang)}</p>
          <div className="p4-match-grid">
            <section className="p4-match-col">
              {task.pairs.map((pair) => (
                <button type="button" key={pair.id} disabled={solved} aria-pressed={activeLeft === pair.id}
                  className={`${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''}`}
                  onClick={() => { checkingRef.current = false; setActiveLeft(pair.id); setChecked(false); }}>
                  {tx(pair.left, lang)}
                  {pairs[pair.id] && (
                    <small>{tx(task.right.find((item) => item.id === pairs[pair.id])?.text, lang)}</small>
                  )}
                </button>
              ))}
            </section>
            <section className="p4-match-col">
              {rightCards.map((item) => {
                const used = Object.values(pairs).includes(item.id);
                return (
                  <button type="button" key={item.id} className={used ? 'is-used' : ''}
                    disabled={solved || activeLeft === null || used}
                    onClick={() => {
                      checkingRef.current = false;
                      setPairs((old) => ({ ...old, [activeLeft]: item.id }));
                      setActiveLeft(null);
                      setChecked(false);
                    }}>
                    {tx(item.text, lang)}
                  </button>
                );
              })}
            </section>
          </div>
        </div>
      )}

      {task.kind === 'order' && (
        <div className="p4-order">
          <p className="p4-note">{tx(UI.orderHint, lang)}</p>
          <div className="p4-order-slots">
            {task.steps.map((step) => (
              <button type="button" key={step.id} disabled={solved} aria-pressed={activeCell === step.id}
                className={activeCell === step.id ? 'is-active' : ''}
                onClick={() => { checkingRef.current = false; setActiveCell(step.id); setChecked(false); }}>
                <small>{tx(step.label, lang)}</small>
                <b>{placed[step.id] ? cardText(placed[step.id]) : '—'}</b>
              </button>
            ))}
          </div>
          <div className="p4-card-bank">
            {bankCards.map((card) => {
              const used = Object.values(placed).includes(card.id);
              return (
                <button type="button" key={card.id} className={`p4-card ${used ? 'is-used' : ''}`}
                  disabled={solved || activeCell === null || used} onClick={() => placeCard(card.id)}>
                  {tx(card.text, lang)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {task.kind === 'slots' && (
        <div className="p4-slots">
          <p className="p4-note">{tx(UI.slotHint, lang)}</p>
          <div className="p4-slot-list">
            {task.slots.map((slot) => (
              <button type="button" key={slot.id} disabled={solved} aria-pressed={activeCell === slot.id}
                className={`p4-slot ${activeCell === slot.id ? 'is-active' : ''} ${placed[slot.id] ? 'is-tied' : ''}`}
                onClick={() => { checkingRef.current = false; setActiveCell(slot.id); setChecked(false); }}>
                <small>{tx(slot.label, lang)}</small>
                <b>{placed[slot.id] ? cardText(placed[slot.id]) : '—'}</b>
              </button>
            ))}
          </div>
          <div className="p4-card-bank">
            {bankCards.map((card) => {
              const used = Object.values(placed).includes(card.id);
              return (
                <button type="button" key={card.id} className={`p4-card ${used ? 'is-used' : ''}`}
                  disabled={solved || activeCell === null || used} onClick={() => placeCard(card.id)}>
                  {tx(card.text, lang)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {task.kind === 'sort' && (
        <div className="p4-sort">
          <p className="p4-note">{tx(UI.sortHint, lang)}</p>
          <div className="p4-sort-pool" role="group" aria-label={tx(task.prompt, lang)}>
            {unassigned.map((item) => (
              <button type="button" key={item.id} disabled={solved} aria-pressed={activeItem === item.id}
                className={`p4-sort-token ${activeItem === item.id ? 'is-active' : ''}`}
                onClick={() => { checkingRef.current = false; setActiveItem(item.id); setChecked(false); }}>
                {tx(item.text, lang)}
              </button>
            ))}
            {unassigned.length === 0 && <span className="p4-pool-done" aria-hidden="true">✓</span>}
          </div>
          <div className="p4-sort-bins">
            {task.bins.map((bin) => (
              <div className="p4-sort-bin" key={bin.id}>
                <button type="button" className="p4-sort-bin-head" disabled={solved || activeItem === null}
                  onClick={() => {
                    if (activeItem === null) return;
                    checkingRef.current = false;
                    setAssignments((old) => ({ ...old, [activeItem]: bin.id }));
                    setActiveItem(null);
                    setChecked(false);
                  }}>
                  {tx(bin.label, lang)}
                </button>
                <div className="p4-sort-bin-items">
                  {sortItems.filter((item) => assignments[item.id] === bin.id).map((item) => (
                    <button type="button" key={item.id} disabled={solved}
                      className={`p4-sort-token is-placed ${checked && item.bin !== bin.id ? 'is-no' : ''} ${checked && item.bin === bin.id ? 'is-ok' : ''}`}
                      aria-label={`${tx(UI.returnCard, lang)} ${tx(item.text, lang)}`}
                      onClick={() => {
                        checkingRef.current = false;
                        setAssignments((old) => {
                          const next = { ...old };
                          delete next[item.id];
                          return next;
                        });
                        setChecked(false);
                      }}>
                      {tx(item.text, lang)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {checked && (
        <Feedback feedbackRef={feedbackRef} ok={solved} lang={lang} rule={task.rule}
          text={solved ? task.correctText : adaptive(task, pickedOption, slotWrong, firstWrongItem?.wrong, attempts)} />
      )}

      <div className="p4-actions">
        {!checked && !solved && (
          <button type="button" className="p4-btn" disabled={!answerReady} onClick={check}>
            {tx(UI.check, lang)}
          </button>
        )}
        {checked && !solved && (
          <button type="button" className="p4-btn p4-btn-ghost is-ghost" onClick={clearResponse}>
            {tx(UI.retry, lang)}
          </button>
        )}
        {solved && (
          <button type="button" className="p4-btn p4-btn-ready is-ready" disabled={advancing}
            onClick={() => {
              if (advancedRef.current) return;
              advancedRef.current = true;
              checkingRef.current = false;
              setAdvancing(true);
              onSolved({
                taskId: task.id,
                taskNumber: Number(task.id),
                level: task.level,
                kind: task.kind,
                skillTag: task.skillTag,
                attempts,
                firstTry: attempts === 1,
                correct: true,
                setup: task.setup,
                prompt: task.prompt,
                studentAnswer,
                correctAnswer,
                answerChoices: task.options
                  ? options.map(({ id, text, correct }) => ({ id, text, correct }))
                  : task.right ?? task.cards ?? task.items ?? null,
                screenMeta: SCREEN_META.find((screen) => screen.taskId === task.id),
              });
            }}>
            {tx(isLast ? UI.finish : UI.next, lang)}
          </button>
        )}
      </div>
    </section>
  );
}

export default function Grade4Dars36Practice({ studentName, lang: langProp, onFinished }) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = normalizeLang(preview ? previewLang : langProp);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [firstTry, setFirstTry] = useState(0);
  const [finished, setFinished] = useState(false);
  const [runId, setRunId] = useState(0);
  const finishedRef = useRef(false);
  const startedAtRef = useRef(0);

  useEffect(() => { if (!startedAtRef.current) startedAtRef.current = Date.now(); }, []);

  const task = TASKS[index];
  const total = TASKS.length;
  const percent = Math.round(((finished ? total : index) / total) * 100);

  const onSolved = (record) => {
    const nextAnswers = [...answers, record];
    const nextFirstTry = firstTry + (record.firstTry ? 1 : 0);
    setAnswers(nextAnswers);
    setFirstTry(nextFirstTry);
    if (index !== total - 1) { setIndex((old) => old + 1); return; }
    if (finishedRef.current) return;
    finishedRef.current = true;
    setFinished(true);
    const scorePercent = Math.round((nextFirstTry / total) * 100);
    const levelBreakdown = ['green', 'yellow', 'red'].reduce((result, level) => ({
      ...result,
      [level]: {
        total: TASKS.filter((item) => item.level === level).length,
        firstTry: nextAnswers.filter((item) => item.level === level && item.firstTry).length,
      },
    }), {});
    onFinished?.({
      lessonId: LESSON_META.lessonId,
      lessonTitle: tx(LESSON_META.lessonTitle, lang),
      lessonTitleLocalized: LESSON_META.lessonTitle,
      studentName: studentName || null,
      activityType: 'practice',
      completed: true,
      totalQuestions: total,
      answeredQuestions: total,
      correctAnswers: nextFirstTry,
      firstTryCorrect: nextFirstTry,
      scorePercent,
      finalScore: nextFirstTry,
      finalTotal: total,
      passed: nextFirstTry >= 6,
      firstTryStats: { total, firstTryCorrect: nextFirstTry, correct: nextFirstTry, answered: total, scorePercent },
      attemptsTotal: nextAnswers.reduce((sum, item) => sum + item.attempts, 0),
      // eslint-disable-next-line react-hooks/purity -- davomiylik amaliyot yakunlanganda olinadi
      durationSec: startedAtRef.current ? Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000)) : 0,
      skillTags: [...new Set(TASKS.map((item) => item.skillTag))],
      levelBreakdown,
      lessonMeta: LESSON_META,
      screenMeta: SCREEN_META,
      answers: nextAnswers,
    });
  };

  const restart = () => {
    finishedRef.current = false;
    startedAtRef.current = Date.now();
    setIndex(0);
    setAnswers([]);
    setFirstTry(0);
    setFinished(false);
    setRunId((old) => old + 1);
  };

  return (
    <div className="p4-root">
      <style>{STYLES}</style>
      {preview && (
        <div className="p4-lang" role="group" aria-label={tx(UI.language, lang)}>
          {SUPPORTED_LANGS.map((code) => (
            <button type="button" key={code} aria-pressed={lang === code}
              className={lang === code ? 'is-active' : ''} onClick={() => setPreviewLang(code)}>
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <header>
        <div className="p4-progress" role="progressbar" aria-label={tx(UI.title, lang)}
          aria-valuemin="0" aria-valuemax={total} aria-valuenow={finished ? total : index}>
          <i style={{ width: `${percent}%` }} />
        </div>
        <div>
          <span className="p4-title">{tx(UI.title, lang)}</span>
          <b className="p4-counter">{finished ? total : index + 1} / {total}</b>
        </div>
      </header>

      <main>
        {finished ? (
          <section className="p4-done" aria-live="polite">
            <h2>{tx(UI.done, lang)}</h2>
            <strong>{firstTry}<small>/ {total}</small></strong>
            <p>{tx(UI.firstTry, lang)}</p>
            <p>{tx(UI.allSolved, lang)}</p>
            <button type="button" className="p4-btn p4-btn-ready" onClick={restart}>{tx(UI.again, lang)}</button>
          </section>
        ) : (
          <Task key={`${runId}-${task.id}`} task={task} lang={lang} isLast={index === total - 1}
            onSolved={onSolved} shuffleSeed={`${LESSON_META.lessonId}:${runId}`} />
        )}
      </main>
    </div>
  );
}

const STYLES = `
.p4-root { position: relative; min-height: 100dvh; overflow-x: clip; padding: 0 0 24px; background: ${T.bg} !important; color: ${T.ink}; font-family: 'Manrope', system-ui, sans-serif; }
.p4-root *, .p4-root *::before, .p4-root *::after { box-sizing: border-box; }
.p4-root p, .p4-root h2 { margin: 0; }
.p4-root button:focus-visible { outline: 3px solid rgba(22, 143, 163, .45); outline-offset: 3px; }

.p4-lang { position: absolute; top: 8px; right: 8px; z-index: 9; display: flex; gap: 6px; }
.p4-lang button { min-width: 44px; min-height: 44px; padding: 0 10px; border: 0; border-radius: 99px; background: ${T.paper}; color: ${T.ink2}; font: 800 11px 'Manrope', sans-serif; cursor: pointer; box-shadow: 0 4px 12px -8px rgba(23, 59, 82, .4); }
.p4-lang button.is-active { background: ${T.accent}; color: #fff; }

.p4-root > header { padding: 46px clamp(12px, 4vw, 24px) 8px; }
.p4-root > header > div, .p4-root > main { width: min(720px, 100%) !important; margin-inline: auto; }
.p4-progress { height: 6px; border: 0; border-radius: 99px; background: rgba(23, 59, 82, .12); overflow: hidden; }
.p4-progress i { display: block; height: 100%; background: linear-gradient(90deg, ${T.cyan}, ${T.accent}); transition: width .4s ease; }
.p4-root > header > div:last-child { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; margin-top: 8px; }
.p4-title { font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; font-size: clamp(15px, 2.4vw, 19px); }
.p4-counter { white-space: nowrap; font: 700 13px 'JetBrains Mono', monospace; color: ${T.ink3}; }

.p4-root > main { padding: 4px clamp(12px, 4vw, 24px); }
.p4-task { display: grid; gap: 12px; }
.p4-eyebrow, .p4-eyebrow.is-green, .p4-eyebrow.is-yellow, .p4-eyebrow.is-red { color: ${T.accent}; font-size: 11px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
.p4-setup { color: ${T.ink2}; font-size: clamp(14px, 2vw, 16px); line-height: 1.5; }
.p4-task h2 { font: 600 clamp(17px, 2.6vw, 21px)/1.25 'Source Serif 4', Georgia, serif; color: ${T.ink}; }
.p4-note { color: ${T.ink3}; font-size: 13px; }

.p4-visual { display: grid; place-items: center; gap: 8px; min-height: 108px; padding: 12px 10px; border-radius: 16px; background: ${T.paper} !important; box-shadow: inset 0 0 0 1px rgba(23, 59, 82, .08); overflow: hidden; }
.p4-visual-row { grid-auto-flow: column; grid-auto-columns: max-content; align-items: end; }
.p4-visual strong { text-align: center; color: ${T.navy}; font: 800 clamp(20px, 4.4vw, 30px)/1.25 'JetBrains Mono', monospace; }
.p4-svg { width: 100%; max-width: 320px; height: auto; }
.p4-svg-narrow { max-width: 116px; }
.p4-quad { width: clamp(76px, 20vw, 128px); height: auto; animation: p4-drop .5s cubic-bezier(.22, 1.2, .36, 1) both; }
.p4-quad-cell { display: grid; justify-items: center; }
.p4-quad-label { fill: ${T.ink2}; font: 800 10px 'JetBrains Mono', monospace; }
.p4-form { display: grid; gap: 7px; }
.p4-form i { display: block; width: min(196px, 54vw); height: 15px; border-radius: 4px; background: rgba(23, 59, 82, .1); animation: p4-drop .5s cubic-bezier(.22, 1.2, .36, 1) both; }
.p4-form i.is-filled { background: ${T.cyanSoft}; box-shadow: inset 0 0 0 1px ${T.cyan}; }

.p4-options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
.p4-option { display: flex; align-items: center; gap: 9px; min-width: 44px; min-height: 56px; padding: 10px 12px; text-align: left; border: 1px solid rgba(23, 59, 82, .12); border-radius: 14px; background: ${T.paper}; color: ${T.ink}; font: 700 clamp(12.5px, 1.9vw, 14.5px)/1.35 'Manrope', sans-serif; cursor: pointer; transition: transform .16s, border-color .2s, background .2s; }
.p4-option:hover:not(:disabled) { border-color: rgba(22, 143, 163, .4); transform: translateY(-2px); }
.p4-letter { flex: 0 0 26px; display: grid; place-items: center; width: 26px; height: 26px; border-radius: 8px; background: ${T.cyanSoft}; color: ${T.cyan}; font: 800 11px 'JetBrains Mono', monospace; }
.p4-option.is-on { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-option.is-ok { border-color: rgba(34, 122, 83, .4); background: ${T.successSoft}; color: ${T.success}; }
.p4-option.is-ok .p4-letter { background: ${T.success}; color: #fff; }
.p4-option.is-no { border-color: rgba(169, 111, 19, .4); background: ${T.warnSoft}; color: ${T.warn}; }
.p4-option.is-no .p4-letter { background: ${T.warn}; color: #fff; }

.p4-match-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 7px; }
.p4-match-col { display: grid; gap: 8px; }
.p4-match button, .p4-order button, .p4-slots button { min-width: 44px; min-height: 48px; padding: 8px 10px; border: 1px solid rgba(23, 59, 82, .12); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 700 clamp(11px, 1.75vw, 13px)/1.3 'Manrope', sans-serif; cursor: pointer; transition: transform .16s, border-color .2s, background .2s; }
.p4-match button:hover:not(:disabled), .p4-order button:hover:not(:disabled), .p4-slots button:hover:not(:disabled) { border-color: rgba(22, 143, 163, .4); transform: translateY(-2px); }
.p4-match button.is-active, .p4-order button.is-active, .p4-slots button.is-active { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-match button.is-tied, .p4-slots button.is-tied { border-color: rgba(34, 122, 83, .35); }
.p4-match button small { display: block; margin-top: 3px; color: ${T.success}; font-size: 10.5px; }
.p4-match button.is-used, .p4-card.is-used { background: ${T.successSoft}; opacity: .62; }

.p4-order-slots { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px; margin-top: 7px; }
.p4-slot-list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; margin-top: 7px; }
.p4-order-slots button, .p4-slot { display: grid; gap: 3px; place-items: center; }
.p4-order-slots small, .p4-slot small { color: ${T.ink3}; font-size: 10px; }
.p4-order-slots b, .p4-slot b { font: 800 clamp(10px, 1.6vw, 12px)/1.2 'Manrope', sans-serif; text-align: center; }
.p4-card-bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; margin-top: 8px; }
.p4-card { min-width: 44px; min-height: 46px; padding: 7px 11px; border: 1px solid rgba(23, 59, 82, .12); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 800 11.5px/1.25 'Manrope', sans-serif; cursor: pointer; }

.p4-sort { display: grid; gap: 7px; }
.p4-sort-pool { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; min-height: 52px; padding: 7px; border: 1px dashed rgba(23, 59, 82, .2); border-radius: 12px; }
.p4-pool-done { display: grid; place-items: center; color: ${T.success}; font-size: 20px; font-weight: 800; }
.p4-sort-token { min-width: 72px; min-height: 44px; padding: 7px 10px; border: 1px solid rgba(23, 59, 82, .14); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 800 12.5px 'JetBrains Mono', monospace; cursor: pointer; }
.p4-sort-token.is-active { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-sort-token.is-ok { border-color: ${T.success}; background: ${T.successSoft}; color: ${T.success}; }
.p4-sort-token.is-no { border-color: ${T.warn}; background: ${T.warnSoft}; color: ${T.warn}; }
.p4-sort-bins { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; }
.p4-sort-bin { display: grid; gap: 5px; align-content: start; padding: 7px; border-radius: 12px; background: #FBFBF8; box-shadow: inset 0 0 0 1px rgba(23, 59, 82, .08); }
.p4-sort-bin-head { min-width: 44px; min-height: 44px; padding: 7px 8px; border: 0; border-radius: 10px; background: ${T.cyanSoft}; color: ${T.cyan}; font: 800 10.5px/1.25 'Manrope', sans-serif; cursor: pointer; }
.p4-sort-bin-head:disabled { opacity: .62; cursor: default; }
.p4-sort-bin-items { display: flex; flex-wrap: wrap; gap: 5px; min-height: 30px; }

.p4-feedback { padding: 12px 14px; border-radius: 14px; line-height: 1.45; }
.p4-feedback.is-ok { background: ${T.successSoft}; color: #1B6644; box-shadow: inset 4px 0 0 ${T.success}; }
.p4-feedback.is-no { background: ${T.warnSoft}; color: #8A5C10; box-shadow: inset 4px 0 0 ${T.warn}; }
.p4-feedback p { font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(14px, 2.1vw, 16px); }
.p4-feedback .p4-rule { margin-top: 5px; color: ${T.ink2}; }

.p4-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; }
.p4-actions .p4-btn, .p4-done .p4-btn { min-width: 44px; min-height: 46px; padding: 10px 22px; border: 0; border-radius: 12px; background: ${T.paper}; color: ${T.accent}; font: 800 14px 'Manrope', sans-serif; cursor: pointer; box-shadow: 0 8px 20px -10px rgba(255, 91, 53, .5), inset 0 0 0 1px rgba(255, 91, 53, .2); }
.p4-actions .p4-btn:disabled { opacity: .45; cursor: not-allowed; box-shadow: none; }
.p4-actions button.p4-btn-ghost { background: transparent; color: ${T.ink2}; box-shadow: none; }
.p4-actions button.p4-btn-ready, .p4-done button.p4-btn-ready { background: ${T.accent}; color: #fff; }

.p4-done { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 20px 12px; text-align: center; }
.p4-done h2 { font: 600 clamp(19px, 3vw, 24px) 'Source Serif 4', Georgia, serif; }
.p4-done > strong { font: 800 clamp(32px, 7vw, 44px) 'JetBrains Mono', monospace; color: ${T.success}; }
.p4-done > strong small { font-size: 14px; color: ${T.ink3}; }
.p4-done p { color: ${T.ink2}; }

@keyframes p4-drop { 0% { opacity: 0; transform: translateY(-10px) scale(.86); } 70% { opacity: 1; transform: translateY(1px) scale(1.03); } 100% { opacity: 1; transform: none; } }
@keyframes p4-rise { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: none; } }

@media (max-width: 520px) {
  .p4-options { grid-template-columns: 1fr; }
  .p4-order-slots { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .p4-slot-list { grid-template-columns: 1fr; }
  .p4-sort-bins { grid-template-columns: 1fr; }
  .p4-root > header { padding-top: 54px; }
}
@media (max-width: 640px) and (max-height: 700px) {
  .p4-root > header { padding: 40px 10px 3px !important; }
  .p4-root > main { padding: 1px 8px !important; }
  .p4-task { gap: 5px !important; }
  .p4-setup { font-size: 12px; line-height: 1.3; }
  .p4-task h2 { font-size: 16px !important; }
  .p4-visual { min-height: 76px !important; padding: 8px 10px !important; }
  .p4-visual strong { font-size: 18px; }
  .p4-options { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 5px !important; }
  .p4-option, .p4-match button, .p4-order button, .p4-slots button { min-height: 44px !important; padding: 5px 8px !important; font-size: 11px !important; }
  .p4-actions .p4-btn, .p4-done .p4-btn { min-height: 44px !important; padding: 7px 14px; }
  .p4-feedback { padding: 8px 10px; }
}
@media (prefers-reduced-motion: reduce) {
  .p4-root *, .p4-root *::before, .p4-root *::after { scroll-behavior: auto !important; animation: none !important; transition: none !important; }
}

/* PRACTICE-FIX boshlanishi — metodist qarori 2026-08-21.
   1) Tekshirish tugmasi o'ngda (2-dars etaloni).
   2) Moslashtirishda ikki tomondagi kartochkalar bir xil o'lchamda: ustun grid
      bo'ladi va qatorlari 1fr, shuning uchun juftlar qator bo'yicha tekislanadi.
   Bu blok har darsda takrorlanadi ATAYLAB: LMS avtonom fayl talab qiladi. */
.p4-actions, .g4p-actions { justify-content: flex-end; }
.p4-match-cols, .g4p-match-cols { align-items: stretch; }
.p4-match-col, .g4p-match-col { display: grid; grid-auto-rows: 1fr; align-content: stretch; }
/* PRACTICE-FIX tugashi */
`;
