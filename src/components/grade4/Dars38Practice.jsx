// ============================================================================
// 4-SINF · 38-DARS AMALIYOTI · GEOMETRIK YASASHLAR
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
//
// SKELET: src/books/grade4/AMALIYOT_31_40_SKELET.md §5.8.
// Raskladka (scripts/grade4-practice-31-40-layout.mjs):
//   match · missing · construct · slots · mc · missing · slots · sort · construct · order
//
// NEGA BITTA FAYL VA NEGA CHIZMALAR SHU YERDA. LMS darsni bitta avtonom .jsx
// sifatida qabul qiladi: lokal import yo'q. Asbob va yasash chizmasi shu faylda
// yoziladi. CLAUDE.md §5 nusxa taqiqiga zid emas — LMS kontrakti majbur qiladi.
//
// DIZAYN: Dars01Practice.jsx. RUS TILIDA MUROJAAT — «ты».
//
// `construct` KARTALARI FAQAT SONLI. Browser-solver yasash kartasini KO'RINADIGAN
// MATNI bo'yicha topadi, shuning uchun karta matni uch tilda bir xil bo'lishi
// shart. Daraja belgisi (°) shunday, so'z esa emas. Shu sababli 03 va 09
// topshiriqlarida bola so'z emas, BURCHAK QIYMATLARINI yig'adi — bu darsning
// «yasagandan keyin tekshirish» qadamiga to'g'ri keladi.
//
// ⊥ va ∥ belgilari ATAYIN ishlatilmadi: nazariy Dars38 da ular yo'q, faqat
// so'zlar bor. Amaliyot nazariy darsdan tashqariga chiqmaydi.
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
    'Урок 38. Практика: геометрические построения',
    '38-dars. Amaliyot: geometrik yasashlar',
    'Lesson 38. Practice: geometric constructions',
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
    'Нажми работу, потом её ящик.',
    'Ishni bosing, keyin uning qutisini bosing.',
    'Tap a job, then its box.',
  ),
  constructHint: b(
    'Нажимай карточки по порядку. Нажми занятое место, чтобы освободить его.',
    'Kartalarni tartib bilan bosing. Bo\'shatish uchun band joyni bosing.',
    'Tap the cards in order. Tap a filled place to clear it.',
  ),
  emptyPlace: b('пусто', "bo'sh", 'empty'),
  returnCard: b('Вернуть', 'Qaytarish', 'Return'),
};

const LESSON_META = {
  lessonId: 'num-4-38-practice',
  lessonTitle: UI.title,
  grade: 4,
  lessonNumber: 38,
  activityType: 'practice',
  taskCount: 10,
  resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'step-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'record-build', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'slot-fill', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'step-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'slot-fill', type: 'practice', scored: true, scope: 'module-mikro' },
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

const TOOLS = {
  ruler: b('линейка', "chizg'ich", 'a ruler'),
  square: b('угольник', "go'niya", 'a set square'),
  protractor: b('транспортир', 'transportir', 'a protractor'),
};

const TASKS = [
  {
    id: '01', level: 'green', kind: 'match', skillTag: 'tool_to_question',
    visual: { type: 'tool-rack' },
    setup: b(
      'На чертёжном столе лежат три инструмента. Каждый отвечает на свой вопрос.',
      'Chizmaxona stolida uchta asbob yotadi. Har biri o\'z savoliga javob beradi.',
      'Three instruments lie on the drafting table. Each answers its own question.',
    ),
    prompt: b(
      'Соедини задачу с нужным инструментом.',
      'Vazifani kerakli asbob bilan birlashtiring.',
      'Match each job with the instrument it needs.',
    ),
    pairs: [
      {
        id: 'length', left: b('длина отрезка', 'kesma uzunligi', 'the length of a segment'),
        correctRight: 'ruler',
      },
      {
        id: 'right-angle', left: b('прямой угол', "to'g'ri burchak", 'a right angle'),
        correctRight: 'square',
      },
      {
        id: 'any-angle', left: b('угол в 110 градусов', '110 darajali burchak', 'an angle of 110 degrees'),
        correctRight: 'protractor',
      },
    ],
    right: [
      { id: 'ruler', text: TOOLS.ruler },
      { id: 'square', text: TOOLS.square },
      { id: 'protractor', text: TOOLS.protractor },
    ],
    wrong: [b(
      'Спроси про каждую задачу: измеряют длину, ставят прямой угол или отсчитывают градусы?',
      "Har vazifa haqida so'rang: uzunlik o'lchanadimi, to'g'ri burchak qo'yiladimi yoki daraja sanaladimi?",
      'Ask about each job: is a length measured, a right angle set, or degrees counted off?',
    )],
    secondHint: b(
      'Угольник даёт только прямой угол, а транспортир — любой.',
      "Go'niya faqat to'g'ri burchak beradi, transportir esa istalganini.",
      'A set square gives only a right angle, while a protractor gives any angle.',
    ),
    thirdHint: b(
      'Линейка — для длины, угольник — для 90 градусов, транспортир — для 110 градусов.',
      "Chizg'ich — uzunlik uchun, go'niya — 90 daraja uchun, transportir — 110 daraja uchun.",
      'A ruler is for length, a set square for 90 degrees, a protractor for 110 degrees.',
    ),
    correctText: b(
      'Верно. Каждый инструмент отвечает на один вопрос.',
      "To'g'ri. Har bir asbob bitta savolga javob beradi.",
      'Correct. Each instrument answers one question.',
    ),
    rule: b(
      'Один инструмент не заменяет остальные.',
      'Bitta asbob boshqalarning o\'rnini bosmaydi.',
      'One instrument does not replace the others.',
    ),
  },

  {
    id: '02', level: 'green', kind: 'missing', skillTag: 'align_the_tool',
    visual: { type: 'square-misaligned' },
    setup: b(
      'Угольник положили на чертёж, но его основание лежит криво.',
      "Go'niya chizmaga qo'yildi, lekin asosi qiyshiq yotadi.",
      'The set square is on the drawing, but its base lies crooked.',
    ),
    prompt: b(
      'Что делают дальше?',
      'Keyin nima qilinadi?',
      'What comes next?',
    ),
    options: [
      option('align', 'точно совмещают основание с линией', "asosni chiziqqa aniq moslashtiradi", 'align the base exactly with the line', true),
      option('draw-now', 'сразу проводят линию', 'darrov chiziq o\'tkazadi', 'draw the line straight away', false,
        'Пока основание лежит криво, угол получится не прямым.',
        "Asos qiyshiq yotguncha, burchak to'g'ri chiqmaydi.",
        'While the base lies crooked, the angle will not come out right.'),
      option('take-protractor', 'берут транспортир', 'transportirni oladi', 'take the protractor', false,
        'Транспортир тоже нужно совмещать. Инструмент не в этом виноват.',
        'Transportirni ham moslash kerak. Asbob bunda aybdor emas.',
        'A protractor must be aligned too. The instrument is not at fault.'),
      option('by-eye', 'поправляют на глаз', "ko'zga qarab to'g'rilaydi", 'straighten it by eye', false,
        'На глаз — это не построение: инструмент совмещают точно.',
        "Ko'zga qarab — bu yasash emas: asbob aniq moslanadi.",
        'By eye is not construction: the instrument is aligned exactly.'),
    ],
    secondHint: b(
      'Инструмент работает только тогда, когда он точно лежит на линии.',
      'Asbob faqat chiziqqa aniq yotganda ishlaydi.',
      'An instrument works only when it lies exactly on the line.',
    ),
    thirdHint: b(
      'Сначала совмещение, потом линия, потом проверка.',
      'Avval moslash, keyin chiziq, keyin tekshiruv.',
      'First the alignment, then the line, then the check.',
    ),
    correctText: b(
      'Верно. Основание угольника точно совмещают с линией.',
      "To'g'ri. Go'niyaning asosi chiziqqa aniq moslashtiriladi.",
      'Correct. The base of the set square is aligned exactly with the line.',
    ),
    rule: b(
      'Пока инструмент не совмещён, линию не проводят.',
      'Asbob moslanmaguncha chiziq o\'tkazilmaydi.',
      'The line is not drawn until the instrument is aligned.',
    ),
  },

  {
    id: '03', level: 'yellow', kind: 'construct', skillTag: 'adjacent_angle_record',
    slotCount: 2, answer: ['110°', '70°'],
    cards: [
      { id: 'c110', symbol: '110°' },
      { id: 'c70', symbol: '70°' },
      { id: 'c90', symbol: '90°' },
      { id: 'c180', symbol: '180°' },
    ],
    visual: { type: 'crossing-lines', main: 110 },
    setup: b(
      'Две линии пересеклись. Транспортир показал, что один угол равен 110 градусам.',
      'Ikki chiziq kesishdi. Transportir bir burchak 110 darajaga tengligini ko\'rsatdi.',
      'Two lines have crossed. The protractor showed that one angle is 110 degrees.',
    ),
    prompt: b(
      'Собери запись двух углов при одной линии: сначала измеренный, потом соседний.',
      "Bitta chiziqdagi ikki burchak yozuvini yig'ing: avval o'lchangani, keyin qo'shnisi.",
      'Build the record of the two angles on one line: first the measured one, then its neighbour.',
    ),
    wrongBySequence: {
      '110°90°': b(
        'Прямой угол здесь не получается: измеренный угол не равен 90 градусам.',
        "Bu yerda to'g'ri burchak chiqmaydi: o'lchangan burchak 90 darajaga teng emas.",
        'A right angle does not appear here: the measured angle is not 90 degrees.',
      ),
      '110°180°': b(
        '180 градусов — это оба угла вместе, а не соседний угол.',
        "180 daraja — bu ikki burchak birgalikda, qo'shni burchak emas.",
        '180 degrees is both angles together, not the neighbouring angle.',
      ),
      '70°110°': b(
        'Порядок обратный: сначала идёт измеренный угол.',
        "Tartib teskari: avval o'lchangan burchak turadi.",
        'The order is reversed: the measured angle comes first.',
      ),
    },
    wrong: [b(
      'Два угла при одной линии вместе дают развёрнутый угол.',
      'Bitta chiziqdagi ikki burchak birgalikda yoyiq burchak beradi.',
      'Two angles on one line together make a straight angle.',
    )],
    secondHint: b(
      'Развёрнутый угол равен 180 градусам.',
      'Yoyiq burchak 180 darajaga teng.',
      'A straight angle is 180 degrees.',
    ),
    thirdHint: b(
      '180 − 110 = 70.',
      '180 − 110 = 70.',
      '180 − 110 = 70.',
    ),
    correctText: b(
      'Верно. 110 и 70 градусов вместе дают 180: это проверка построения.',
      "To'g'ri. 110 va 70 daraja birgalikda 180 beradi: bu yasashning tekshiruvi.",
      'Correct. 110 and 70 degrees together make 180: that is the check on the construction.',
    ),
    rule: b(
      'Углы при одной линии проверяют суммой: она равна 180 градусам.',
      "Bitta chiziqdagi burchaklar yig'indi bilan tekshiriladi: u 180 darajaga teng.",
      'Angles on one line are checked by their sum: it equals 180 degrees.',
    ),
  },

  {
    id: '04', level: 'yellow', kind: 'slots', skillTag: 'perpendicular_steps',
    visual: { type: 'line-with-point' },
    setup: b(
      'На линии отмечена точка. Через неё нужно провести перпендикуляр.',
      "Chiziqda nuqta belgilangan. Undan perpendikulyar o'tkazish kerak.",
      'A point is marked on the line. A perpendicular must be drawn through it.',
    ),
    prompt: b(
      'Заполни протокол построения.',
      'Yasash bayonnomasini to\'ldiring.',
      'Complete the construction protocol.',
    ),
    slots: [
      {
        id: 'step-1', label: b('Шаг 1', '1-qadam', 'Step 1'), correct: 'mark',
        wrong: b(
          'Сначала отмечают то, через что пойдёт линия.',
          "Avval chiziq nimadan o'tishi belgilanadi.",
          'First mark the thing the line will pass through.',
        ),
      },
      {
        id: 'step-2', label: b('Шаг 2', '2-qadam', 'Step 2'), correct: 'align',
        wrong: b(
          'До черчения инструмент совмещают с линией.',
          'Chizishdan oldin asbob chiziqqa moslashtiriladi.',
          'Before drawing, the instrument is aligned with the line.',
        ),
      },
      {
        id: 'step-3', label: b('Шаг 3', '3-qadam', 'Step 3'), correct: 'draw',
        wrong: b(
          'Линию проводят только после совмещения.',
          'Chiziq faqat moslashtirilgandan keyin o\'tkaziladi.',
          'The line is drawn only after the alignment.',
        ),
      },
      {
        id: 'step-4', label: b('Шаг 4', '4-qadam', 'Step 4'), correct: 'verify',
        wrong: b(
          'Построение заканчивается проверкой, а не линией.',
          'Yasash tekshiruv bilan tugaydi, chiziq bilan emas.',
          'A construction ends with a check, not with the line.',
        ),
      },
    ],
    cards: [
      { id: 'mark', text: b('отмечаем точку', 'nuqtani belgilaymiz', 'mark the point') },
      { id: 'align', text: b('совмещаем угольник с линией', "go'niyani chiziqqa moslaymiz", 'align the set square with the line') },
      { id: 'draw', text: b('проводим линию', "chiziqni o'tkazamiz", 'draw the line') },
      { id: 'verify', text: b('проверяем прямой угол', "to'g'ri burchakni tekshiramiz", 'check the right angle') },
      { id: 'guess', text: b('прикидываем на глаз', "ko'zga qarab taxmin qilamiz", 'estimate by eye') },
      { id: 'erase', text: b('стираем линию', "chiziqni o'chiramiz", 'erase the line') },
    ],
    secondHint: b(
      'В протоколе нет шага «на глаз».',
      "Bayonnomada «ko'zga qarab» qadami yo'q.",
      'The protocol has no step called by eye.',
    ),
    thirdHint: b(
      'Точка, совмещение, линия, проверка.',
      'Nuqta, moslash, chiziq, tekshiruv.',
      'Point, alignment, line, check.',
    ),
    correctText: b(
      'Верно. Проверка стоит последней и завершает построение.',
      "To'g'ri. Tekshiruv oxirida turadi va yasashni yakunlaydi.",
      'Correct. The check comes last and completes the construction.',
    ),
    rule: b(
      'Построение без проверки не считается законченным.',
      'Tekshiruvsiz yasash tugallangan hisoblanmaydi.',
      'A construction without a check is not finished.',
    ),
  },

  {
    id: '05', level: 'yellow', kind: 'mc', skillTag: 'missing_tool',
    visual: { type: 'protocol-blank', text: b('… → 90°', '… → 90°', '… → 90°') },
    setup: b(
      'В протоколе пропало название инструмента: «Из точки к линии проводим прямой угол с помощью …».',
      "Bayonnomada asbob nomi tushib qolgan: «Nuqtadan chiziqqa … bilan to'g'ri burchak yasaymiz».",
      'The name of the instrument is missing from the protocol: from the point to the line, draw a right angle using …',
    ),
    prompt: b(
      'Какой инструмент пропущен?',
      'Qaysi asbob tushib qolgan?',
      'Which instrument is missing?',
    ),
    options: [
      option('square', 'угольник', "go'niya", 'a set square', true),
      option('ruler', 'линейка', "chizg'ich", 'a ruler', false,
        'Линейка даёт длину, но не задаёт прямой угол.',
        "Chizg'ich uzunlik beradi, lekin to'g'ri burchakni belgilamaydi.",
        'A ruler gives length but does not set a right angle.'),
      option('protractor-scale', 'шкала транспортира', 'transportir shkalasi', 'the protractor scale', false,
        'Транспортиром прямой угол тоже можно поставить, но в протоколе указан самый простой инструмент для 90 градусов.',
        "Transportir bilan ham to'g'ri burchak qo'yish mumkin, lekin bayonnomada 90 daraja uchun eng oddiy asbob ko'rsatilgan.",
        'A protractor can set a right angle too, but the protocol names the simplest instrument for 90 degrees.'),
      option('eye', 'глаз', "ko'z", 'the eye', false,
        'Глаз — не инструмент построения.',
        "Ko'z — yasash asbobi emas.",
        'The eye is not a construction instrument.'),
    ],
    secondHint: b(
      'Речь идёт именно о прямом угле.',
      "Gap aynan to'g'ri burchak haqida ketmoqda.",
      'The point here is a right angle in particular.',
    ),
    thirdHint: b(
      'Прямой угол уже встроен в один из инструментов.',
      "To'g'ri burchak asboblardan birining ichiga o'rnatilgan.",
      'A right angle is already built into one of the instruments.',
    ),
    correctText: b(
      'Верно. Угольник несёт прямой угол в себе.',
      "To'g'ri. Go'niya to'g'ri burchakni o'zida saqlaydi.",
      'Correct. A set square carries a right angle in itself.',
    ),
    rule: b(
      'Инструмент выбирают по тому, что именно нужно построить.',
      'Asbob aynan nima yasash kerakligiga qarab tanlanadi.',
      'The instrument is chosen by what exactly has to be constructed.',
    ),
  },

  {
    id: '06', level: 'yellow', kind: 'missing', skillTag: 'window_frame_lines',
    visual: { type: 'frame' },
    setup: b(
      'В оконной раме противоположные стороны должны оставаться на одном расстоянии друг от друга по всей длине.',
      "Deraza ramkasida qarama-qarshi tomonlar butun uzunlik bo'ylab bir-biridan bir xil masofada qolishi kerak.",
      'In a window frame the opposite sides must stay the same distance apart along their whole length.',
    ),
    prompt: b(
      'Какими должны быть эти линии?',
      'Bu chiziqlar qanday bo\'lishi kerak?',
      'What must these lines be?',
    ),
    options: [
      option('parallel', 'параллельными', 'parallel', 'parallel', true),
      option('perpendicular', 'перпендикулярными', 'perpendikulyar', 'perpendicular', false,
        'Перпендикулярные линии пересекаются под прямым углом, а не идут рядом.',
        "Perpendikulyar chiziqlar to'g'ri burchak ostida kesishadi, yonma-yon bormaydi.",
        'Perpendicular lines cross at a right angle rather than running alongside.'),
      option('crossing', 'пересекающимися', 'kesishuvchi', 'crossing', false,
        'Если линии пересекутся, расстояние между ними изменится.',
        "Chiziqlar kesishsa, ular orasidagi masofa o'zgaradi.",
        'If the lines cross, the distance between them changes.'),
      option('straight-angle', 'развёрнутыми', 'yoyiq', 'straight', false,
        'Развёрнутый — это про угол, а не про пару линий.',
        'Yoyiq — bu burchak haqida, chiziqlar jufti haqida emas.',
        'Straight describes an angle, not a pair of lines.'),
    ],
    secondHint: b(
      'Расстояние не меняется только у одной пары линий.',
      "Masofa faqat bitta chiziqlar juftida o'zgarmaydi.",
      'The distance stays the same for only one kind of pair of lines.',
    ),
    thirdHint: b(
      'Такие линии никогда не пересекаются.',
      'Bunday chiziqlar hech qachon kesishmaydi.',
      'Such lines never cross.',
    ),
    correctText: b(
      'Верно. Стороны рамы параллельны: расстояние между ними одинаково всюду.',
      "To'g'ri. Ramka tomonlari parallel: ular orasidagi masofa hamma joyda bir xil.",
      'Correct. The frame sides are parallel: the distance between them is the same everywhere.',
    ),
    rule: b(
      'Параллельные линии не пересекаются, перпендикулярные пересекаются под прямым углом.',
      "Parallel chiziqlar kesishmaydi, perpendikulyarlar to'g'ri burchak ostida kesishadi.",
      'Parallel lines never cross; perpendicular lines cross at a right angle.',
    ),
  },

  {
    id: '07', level: 'yellow', kind: 'slots', skillTag: 'order_to_tool',
    visual: { type: 'order-sheet', rows: 3 },
    setup: b(
      'В чертёжную пришли три заказа сразу.',
      'Chizmaxonaga birdan uchta buyurtma keldi.',
      'Three orders arrived at the drafting room at once.',
    ),
    prompt: b(
      'Подбери инструмент для каждого заказа.',
      'Har buyurtma uchun asbob tanlang.',
      'Choose the instrument for each order.',
    ),
    slots: [
      {
        id: 'segment', label: b('отрезок 15 см', 'kesma 15 cm', 'a 15 cm segment'), correct: 'ruler',
        wrong: b(
          'Здесь задана длина, а не угол.',
          'Bu yerda uzunlik berilgan, burchak emas.',
          'A length is given here, not an angle.',
        ),
      },
      {
        id: 'right', label: b('прямой угол', "to'g'ri burchak", 'a right angle'), correct: 'square',
        wrong: b(
          'Для 90 градусов есть инструмент, где этот угол уже готов.',
          "90 daraja uchun bu burchak allaqachon tayyor bo'lgan asbob bor.",
          'For 90 degrees there is an instrument where this angle is already there.',
        ),
      },
      {
        id: 'angle', label: b('угол 110 градусов', '110 darajali burchak', 'an angle of 110 degrees'), correct: 'protractor',
        wrong: b(
          '110 градусов нельзя взять готовым: их отсчитывают по шкале.',
          "110 darajani tayyor holda olib bo'lmaydi: u shkaladan sanaladi.",
          '110 degrees cannot be taken ready-made: it is counted off on a scale.',
        ),
      },
    ],
    cards: [
      { id: 'ruler', text: TOOLS.ruler },
      { id: 'square', text: TOOLS.square },
      { id: 'protractor', text: TOOLS.protractor },
      { id: 'eye', text: b('глаз', "ko'z", 'the eye') },
    ],
    secondHint: b(
      'Один инструмент отвечает за длину, другой за прямой угол, третий за любой угол.',
      "Bitta asbob uzunlikka, ikkinchisi to'g'ri burchakka, uchinchisi istalgan burchakka javob beradi.",
      'One instrument answers for length, another for the right angle, the third for any angle.',
    ),
    thirdHint: b(
      'Линейка, угольник, транспортир — в этом порядке.',
      "Chizg'ich, go'niya, transportir — shu tartibda.",
      'Ruler, set square, protractor, in that order.',
    ),
    correctText: b(
      'Верно. Каждый заказ получил свой инструмент.',
      "To'g'ri. Har buyurtma o'z asbobini oldi.",
      'Correct. Each order got its own instrument.',
    ),
    rule: b(
      'Инструмент подбирают под вопрос заказа, а не под привычку.',
      'Asbob buyurtma savoliga qarab tanlanadi, odatga qarab emas.',
      'The instrument is chosen for the question in the order, not from habit.',
    ),
  },

  {
    id: '08', level: 'red', kind: 'sort', skillTag: 'by_eye_trap',
    visual: { type: 'jobs', count: 4 },
    setup: b(
      'Четыре работы сдали в чертёжную. Не каждая из них — построение.',
      "Chizmaxonaga to'rtta ish topshirildi. Ularning har biri yasash emas.",
      'Four jobs were handed in to the drafting room. Not every one of them is a construction.',
    ),
    prompt: b(
      'Разложи работы по ящикам.',
      'Ishlarni qutilarga joylashtiring.',
      'Sort the jobs into the boxes.',
    ),
    bins: [
      { id: 'construction', label: b('построение', 'yasash', 'construction') },
      { id: 'by-eye', label: b('на глаз', "ko'zga qarab", 'by eye') },
    ],
    items: [
      {
        id: 'j-square', text: '90° ⌐', bin: 'construction',
        wrong: b(
          'Здесь угол задан инструментом, у которого прямой угол уже есть.',
          "Bu yerda burchak to'g'ri burchagi bor asbob bilan belgilangan.",
          'Here the angle was set by an instrument that already carries a right angle.',
        ),
      },
      {
        id: 'j-eye-right', text: '90° ?', bin: 'by-eye',
        wrong: b(
          'Знак вопроса означает, что угол никем не проверен.',
          "Savol belgisi burchak hech kim tomonidan tekshirilmaganini bildiradi.",
          'The question mark means nobody has checked the angle.',
        ),
      },
      {
        id: 'j-protractor', text: '65° ✓', bin: 'construction',
        wrong: b(
          'Галочка означает, что угол отсчитан по шкале и проверен.',
          'Belgi burchak shkaladan sanalgan va tekshirilganini bildiradi.',
          'The tick means the angle was counted on a scale and checked.',
        ),
      },
      {
        id: 'j-freehand', text: '— ?', bin: 'by-eye',
        wrong: b(
          'Линия без инструмента и без проверки — это не построение.',
          'Asbobsiz va tekshiruvsiz chiziq — bu yasash emas.',
          'A line drawn with no instrument and no check is not a construction.',
        ),
      },
    ],
    wrong: [b(
      'Построение опирается на инструмент и заканчивается проверкой.',
      'Yasash asbobga tayanadi va tekshiruv bilan tugaydi.',
      'A construction relies on an instrument and ends with a check.',
    )],
    secondHint: b(
      'Знак вопроса значит, что проверки не было.',
      "Savol belgisi tekshiruv bo'lmaganini bildiradi.",
      'A question mark means there was no check.',
    ),
    thirdHint: b(
      'Работы с инструментом и галочкой — построения, остальные — на глаз.',
      "Asbobli va belgili ishlar — yasash, qolganlari — ko'zga qarab.",
      'The jobs with an instrument and a tick are constructions; the rest are by eye.',
    ),
    correctText: b(
      'Верно. Без инструмента и проверки это рисунок, а не построение.',
      "To'g'ri. Asbob va tekshiruvsiz bu rasm, yasash emas.",
      'Correct. With no instrument and no check it is a drawing, not a construction.',
    ),
    rule: b(
      'Построение всегда можно проверить; рисунок на глаз — нельзя.',
      "Yasashni har doim tekshirish mumkin; ko'zga qarab chizilgan rasmni — yo'q.",
      'A construction can always be checked; a drawing made by eye cannot.',
    ),
  },

  {
    id: '09', level: 'red', kind: 'construct', skillTag: 'repair_the_construction',
    slotCount: 2, answer: ['90°', '90°'],
    cards: [
      { id: 'w83', symbol: '83°' },
      { id: 'w97', symbol: '97°' },
      { id: 'r90a', symbol: '90°' },
      { id: 'r90b', symbol: '90°' },
    ],
    visual: { type: 'crossing-lines', main: 83, error: true },
    setup: b(
      'Бит провёл линию на глаз, и по обе стороны получились 83 и 97 градусов. Нужен перпендикуляр.',
      "Bit chiziqni ko'zga qarab o'tkazdi va ikki tomonda 83 va 97 daraja chiqdi. Perpendikulyar kerak.",
      'Bit drew the line by eye, and 83 and 97 degrees came out on the two sides. A perpendicular is needed.',
    ),
    prompt: b(
      'Собери запись двух углов, которая получится после исправления.',
      "Tuzatishdan keyin chiqadigan ikki burchak yozuvini yig'ing.",
      'Build the record of the two angles that will appear after the correction.',
    ),
    wrongBySequence: {
      '83°97°': b(
        'Это запись до исправления: она и показывает ошибку.',
        'Bu tuzatishdan oldingi yozuv: u xatoni ko\'rsatib turadi.',
        'That is the record before the correction: it shows the error itself.',
      ),
      '90°83°': b(
        'После исправления оба угла одинаковые, а не один из них.',
        "Tuzatishdan keyin ikkala burchak bir xil bo'ladi, faqat bittasi emas.",
        'After the correction both angles are the same, not just one of them.',
      ),
      '97°83°': b(
        'Это те же неверные углы, только в другом порядке.',
        "Bu xuddi shu noto'g'ri burchaklar, faqat boshqa tartibda.",
        'Those are the same wrong angles, just in a different order.',
      ),
    },
    wrong: [b(
      'Перпендикуляр даёт прямой угол с каждой стороны от линии.',
      "Perpendikulyar chiziqning har tomonida to'g'ri burchak beradi.",
      'A perpendicular gives a right angle on each side of the line.',
    )],
    secondHint: b(
      '83 и 97 вместе дают 180, но по отдельности прямыми не являются.',
      "83 va 97 birgalikda 180 beradi, lekin alohida to'g'ri burchak emas.",
      '83 and 97 add up to 180, but neither of them is a right angle.',
    ),
    thirdHint: b(
      '180 разделить на 2 равно 90, и так с каждой стороны.',
      "180 ni 2 ga bo'lsak 90 bo'ladi, har tomonda ham shunday.",
      '180 divided by 2 is 90, and it is the same on each side.',
    ),
    correctText: b(
      'Верно. Перпендикуляр даёт 90 и 90 градусов, а не 83 и 97.',
      "To'g'ri. Perpendikulyar 90 va 90 daraja beradi, 83 va 97 emas.",
      'Correct. A perpendicular gives 90 and 90 degrees, not 83 and 97.',
    ),
    rule: b(
      'Ошибку построения видно по проверке: оба угла должны стать прямыми.',
      "Yasash xatosi tekshiruvda ko'rinadi: ikkala burchak ham to'g'ri bo'lishi kerak.",
      'A construction error shows up in the check: both angles must become right angles.',
    ),
  },

  {
    id: '10', level: 'red', kind: 'order', skillTag: 'drop_a_perpendicular',
    visual: { type: 'line-with-outside-point' },
    setup: b(
      'Теперь точка лежит не на линии, а в стороне от неё. Перпендикуляр нужно опустить из этой точки.',
      "Endi nuqta chiziqda emas, undan chetda yotadi. Perpendikulyarni shu nuqtadan tushirish kerak.",
      'Now the point does not lie on the line but off to the side. The perpendicular must be dropped from that point.',
    ),
    prompt: b(
      'Расставь шаги построения по порядку.',
      'Yasash qadamlarini tartib bilan joylashtiring.',
      'Put the construction steps in order.',
    ),
    steps: [
      { id: 'step-1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 'step-2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 'step-3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 'step-4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'to-line', text: b('Ставим угольник основанием на линию', "Go'niyani asosi bilan chiziqqa qo'yamiz", 'Put the base of the set square on the line'), order: 0 },
      { id: 'slide', text: b('Двигаем его до точки', 'Uni nuqtagacha suramiz', 'Slide it up to the point'), order: 1 },
      { id: 'draw', text: b('Проводим линию через точку', "Nuqtadan chiziq o'tkazamiz", 'Draw the line through the point'), order: 2 },
      { id: 'verify', text: b('Проверяем прямой угол', "To'g'ri burchakni tekshiramiz", 'Check the right angle'), order: 3 },
    ],
    wrong: [b(
      'Основание сначала ложится на линию, и только потом ищут точку.',
      'Asos avval chiziqqa yotadi, keyin nuqta qidiriladi.',
      'The base is laid on the line first, and only then the point is found.',
    )],
    secondHint: b(
      'Прямой угол задаёт линия, поэтому инструмент совмещают с ней.',
      "To'g'ri burchakni chiziq belgilaydi, shuning uchun asbob unga moslanadi.",
      'The right angle is set by the line, so the instrument is aligned with it.',
    ),
    thirdHint: b(
      'Линия, точка, черчение, проверка — порядок тот же, что и раньше.',
      'Chiziq, nuqta, chizish, tekshiruv — tartib avvalgidek.',
      'Line, point, drawing, check: the same order as before.',
    ),
    correctText: b(
      'Верно. Порядок построения не изменился, изменилось только место точки.',
      "To'g'ri. Yasash tartibi o'zgarmadi, faqat nuqtaning joyi o'zgardi.",
      'Correct. The construction order has not changed, only the position of the point.',
    ),
    rule: b(
      'Один порядок работает и для точки на линии, и для точки вне неё.',
      'Bitta tartib chiziqdagi nuqta uchun ham, undan tashqaridagi nuqta uchun ham ishlaydi.',
      'One order works for a point on the line and for a point off it.',
    ),
  },
];

const adaptive = (task, pickedOption, slotWrong, itemWrong, sequenceWrong, attempts) => {
  if (attempts >= 3) return task.thirdHint;
  if (attempts >= 2) return task.secondHint;
  if (pickedOption?.wrong) return pickedOption.wrong;
  if (sequenceWrong) return sequenceWrong;
  if (slotWrong) return slotWrong;
  if (itemWrong) return itemWrong;
  return task.wrong?.[0] || task.secondHint;
};

// ---------------------------------------------------------------------------
// CHIZMALAR. Yasash asboblari va chiziqlar. Kesishgan chiziqlar burchakdan
// yasaladi: 03 da 110°, 09 da 83° — ya'ni rasm ma'lumotdan chiqadi va xato
// holat ko'zga ko'rinadi.
// ---------------------------------------------------------------------------
function Visual({ task, lang }) {
  const visual = task.visual;
  if (!visual) return null;

  if (visual.type === 'tool-rack') {
    return (
      <div className="p4-visual p4-visual-row">
        <svg className="p4-svg p4-svg-narrow" viewBox="0 0 110 46" role="img" aria-label={tx(TOOLS.ruler, lang)}>
          <rect x="5" y="16" width="100" height="16" rx="3" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="1.8" />
          {Array.from({ length: 10 }, (_, index) => (
            <line key={index} x1={11 + index * 10} y1="16" x2={11 + index * 10} y2={index % 5 === 0 ? 26 : 22}
              stroke={T.cyan} strokeWidth="1.2" />
          ))}
        </svg>
        <svg className="p4-svg p4-svg-narrow" viewBox="0 0 90 66" role="img" aria-label={tx(TOOLS.square, lang)}>
          <path d="M10 58 H80 L10 12 Z" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="1.8" />
          <path d="M10 46 h12 v12" fill="none" stroke={T.navy} strokeWidth="1.6" />
        </svg>
        <svg className="p4-svg p4-svg-narrow" viewBox="0 0 100 58" role="img" aria-label={tx(TOOLS.protractor, lang)}>
          <path d="M8 50 A42 42 0 0 1 92 50 Z" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="1.8" />
          {Array.from({ length: 7 }, (_, index) => {
            const angle = (Math.PI / 6) * index;
            return (
              <line key={index} x1={50 + 42 * Math.cos(angle)} y1={50 - 42 * Math.sin(angle)}
                x2={50 + 34 * Math.cos(angle)} y2={50 - 34 * Math.sin(angle)} stroke={T.cyan} strokeWidth="1.2" />
            );
          })}
          <circle cx="50" cy="50" r="2.6" fill={T.accent} />
        </svg>
      </div>
    );
  }

  if (visual.type === 'square-misaligned') {
    return (
      <div className="p4-visual">
        <svg className="p4-svg" viewBox="0 0 280 96" role="img" aria-label={tx(task.setup, lang)}>
          <path d="M20 74 H260" stroke={T.navy} strokeWidth="2.4" strokeLinecap="round" />
          <g transform="rotate(-9 90 70)">
            <path d="M60 70 H140 L60 26 Z" fill="rgba(22,143,163,.14)" stroke={T.warn} strokeWidth="2" strokeDasharray="5 4" />
          </g>
          <text x="252" y="92" textAnchor="end" className="p4-svg-cut">?</text>
        </svg>
      </div>
    );
  }

  if (visual.type === 'crossing-lines') {
    const rad = (visual.main * Math.PI) / 180;
    return (
      <div className="p4-visual">
        <svg className="p4-svg" viewBox="0 0 280 110" role="img" aria-label={`${visual.main}°`}>
          <path d="M20 76 H260" stroke={T.navy} strokeWidth="2.4" strokeLinecap="round" />
          <path d={`M${140 - 74 * Math.cos(rad)} ${76 + 74 * Math.sin(rad)} L${140 + 74 * Math.cos(rad)} ${76 - 74 * Math.sin(rad)}`}
            stroke={visual.error ? T.warn : T.accent} strokeWidth="2.4" strokeLinecap="round" />
          <path d={`M${140 + 26} 76 A26 26 0 0 0 ${140 + 26 * Math.cos(rad)} ${76 - 26 * Math.sin(rad)}`}
            fill="none" stroke={visual.error ? T.warn : T.accent} strokeWidth="1.6" />
          <text x={150 + 30 * Math.cos(rad / 2)} y={70 - 30 * Math.sin(rad / 2)} className="p4-svg-top">{visual.main}°</text>
          <text x={104} y={68} textAnchor="end" className="p4-svg-cut">?</text>
          <circle cx="140" cy="76" r="3.4" fill={visual.error ? T.warn : T.accent} />
        </svg>
      </div>
    );
  }

  if (visual.type === 'line-with-point' || visual.type === 'line-with-outside-point') {
    const outside = visual.type === 'line-with-outside-point';
    return (
      <div className="p4-visual">
        <svg className="p4-svg" viewBox="0 0 280 96" role="img" aria-label={tx(task.setup, lang)}>
          <path d="M20 68 H260" stroke={T.navy} strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="140" cy={outside ? 26 : 68} r="4.4" fill={T.accent} />
          {outside && <line x1="140" y1="30" x2="140" y2="64" stroke={T.ink3} strokeWidth="1.2" strokeDasharray="4 4" />}
          <text x="150" y={outside ? 22 : 60} className="p4-svg-top">A</text>
        </svg>
      </div>
    );
  }

  if (visual.type === 'protocol-blank') {
    return <div className="p4-visual"><strong>{tx(visual.text, lang)}</strong></div>;
  }

  if (visual.type === 'frame') {
    return (
      <div className="p4-visual">
        <svg className="p4-svg" viewBox="0 0 240 104" role="img" aria-label={tx(task.setup, lang)}>
          <rect x="18" y="14" width="204" height="76" rx="4" fill="none" stroke={T.navy} strokeWidth="2.4" />
          <line x1="120" y1="14" x2="120" y2="90" stroke={T.cyan} strokeWidth="2" />
          <line x1="18" y1="52" x2="222" y2="52" stroke={T.cyan} strokeWidth="2" strokeDasharray="6 4" />
        </svg>
      </div>
    );
  }

  if (visual.type === 'order-sheet') {
    return (
      <div className="p4-visual">
        <span className="p4-form">
          {Array.from({ length: visual.rows }, (_, index) => <i key={index} style={{ animationDelay: `${index * 70}ms` }} />)}
        </span>
      </div>
    );
  }

  if (visual.type === 'jobs') {
    return (
      <div className="p4-visual p4-visual-row">
        {Array.from({ length: visual.count }, (_, index) => (
          <span className="p4-job" key={index} style={{ animationDelay: `${index * 70}ms` }}>{index + 1}</span>
        ))}
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

// `platform` berilganda tugma qatori chizilmaydi: uni LMS o'zi beradi va
// tekshiruvni `registerCheck` orqali chaqiradi (LMS kontrakti).
function Task({ task, lang, isLast, onSolved, shuffleSeed ,
  platform = false, mode, onReady, registerCheck, onSubmit, playCorrect, playWrong,
}) {
  const [pickedId, setPickedId] = useState(null);
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [placed, setPlaced] = useState({});
  const [activeCell, setActiveCell] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [activeItem, setActiveItem] = useState(null);
  const [built, setBuilt] = useState([]);
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

  const symbolOf = (cardId) => task.cards?.find((card) => card.id === cardId)?.symbol;
  const builtSequence = built.map(symbolOf).join('');

  const answerReady = (() => {
    if (task.options) return pickedId !== null;
    if (task.kind === 'construct') return built.length === task.slotCount;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id]);
    if (task.kind === 'sort') return task.items.every((item) => assignments[item.id]);
    if (task.kind === 'slots') return task.slots.every((slot) => placed[slot.id]);
    return task.steps.every((step) => placed[step.id]);
  })();

  const answerCorrect = () => {
    if (task.options) return task.options.find((item) => item.id === pickedId)?.correct === true;
    if (task.kind === 'construct') return built.map(symbolOf).join('|') === task.answer.join('|');
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
    setBuilt([]);
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
  const sequenceWrong = task.kind === 'construct' ? task.wrongBySequence?.[builtSequence] : null;
  const cardText = (cardId) => tx(task.cards?.find((card) => card.id === cardId)?.text, lang);

  const studentAnswer = (() => {
    if (task.options) return { optionId: pickedId, text: pickedOption?.text };
    if (task.kind === 'construct') return { sequence: built.map(symbolOf) };
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
    if (task.kind === 'construct') return { sequence: task.answer };
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

  // --- LMS platforma kontrakti ------------------------------------------
  // Mexanikaga tegilmaydi: natija mavjud holatlardan o'qiladi.
  useEffect(() => { onReady?.(Boolean(answerReady) && !solved && mode !== 'review'); },
    [answerReady, solved, mode, onReady]);
  const checkRef = useRef(check);
  useEffect(() => { checkRef.current = check; });
  useEffect(() => { registerCheck?.(() => checkRef.current?.()); }, [registerCheck]);
  const reportedRef = useRef(-1);
  useEffect(() => {
    if (!checked) return;
    if (reportedRef.current === attempts) return;
    reportedRef.current = attempts;
    (solved ? playCorrect : playWrong)?.();
    onSubmit?.({
      questionText: typeof task.prompt === 'object' ? task.prompt.uz : String(task.prompt ?? ''),
      correct: Boolean(solved),
      meta: { taskId: task.id, kind: task.kind, attempts: attempts },
    });
  }, [attempts, checked, solved, onSubmit, playCorrect, playWrong, task]);
  // ----------------------------------------------------------------------
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

      {task.kind === 'construct' && (
        <div className="p4-construct">
          <p className="p4-note">{tx(UI.constructHint, lang)}</p>
          <div className="p4-build-row" role="group" aria-label={tx(task.prompt, lang)}>
            {Array.from({ length: task.slotCount }, (_, index) => {
              const cardId = built[index];
              const state = checked && cardId
                ? (task.answer[index] === symbolOf(cardId) ? 'is-ok' : 'is-no')
                : '';
              return (
                <button type="button" key={index} className={`p4-build-slot ${cardId ? 'is-filled' : ''} ${state}`}
                  disabled={solved || !cardId}
                  aria-label={cardId ? `${index + 1}: ${symbolOf(cardId)}` : `${index + 1}: ${tx(UI.emptyPlace, lang)}`}
                  onClick={() => {
                    checkingRef.current = false;
                    setBuilt((old) => old.filter((_, position) => position !== index));
                    setChecked(false);
                  }}>
                  {cardId ? symbolOf(cardId) : '·'}
                </button>
              );
            })}
          </div>
          <div className="p4-card-bank">
            {bankCards.map((card) => {
              const used = built.includes(card.id);
              return (
                <button type="button" key={card.id} className={`p4-card ${used ? 'is-used' : ''}`}
                  disabled={solved || used || built.length >= task.slotCount}
                  onClick={() => {
                    checkingRef.current = false;
                    setBuilt((old) => (old.length >= task.slotCount ? old : [...old, card.id]));
                    setChecked(false);
                  }}>
                  {card.symbol}
                </button>
              );
            })}
          </div>
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
          text={solved ? task.correctText : adaptive(task, pickedOption, slotWrong, firstWrongItem?.wrong, sequenceWrong, attempts)} />
      )}

      {!platform && <div className="p4-actions">
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
      </div>}
    </section>
  );
}

export default function Grade4Dars38Practice({ studentName, lang: langProp, onFinished }) {
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
.p4-svg { width: 100%; max-width: 300px; height: auto; }
.p4-svg-narrow { max-width: 104px; }
.p4-svg text { font: 700 12px 'JetBrains Mono', monospace; }
.p4-svg-top { fill: ${T.navy}; }
.p4-svg-cut { fill: ${T.ink2}; }
.p4-form { display: grid; gap: 7px; }
.p4-form i { display: block; width: min(200px, 56vw); height: 15px; border-radius: 4px; background: rgba(23, 59, 82, .1); animation: p4-drop .5s cubic-bezier(.22, 1.2, .36, 1) both; }
.p4-job { display: grid; place-items: center; width: 40px; height: 50px; border-radius: 10px; background: ${T.cyanSoft}; color: ${T.cyan}; font: 800 17px 'JetBrains Mono', monospace; animation: p4-drop .5s cubic-bezier(.22, 1.2, .36, 1) both; }

.p4-options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
.p4-option { display: flex; align-items: center; gap: 9px; min-width: 44px; min-height: 56px; padding: 10px 12px; text-align: left; border: 1px solid rgba(23, 59, 82, .12); border-radius: 14px; background: ${T.paper}; color: ${T.ink}; font: 700 clamp(12.5px, 1.9vw, 14.5px)/1.35 'Manrope', sans-serif; cursor: pointer; transition: transform .16s, border-color .2s, background .2s; }
.p4-option:hover:not(:disabled) { border-color: rgba(22, 143, 163, .4); transform: translateY(-2px); }
.p4-letter { flex: 0 0 26px; display: grid; place-items: center; width: 26px; height: 26px; border-radius: 8px; background: ${T.cyanSoft}; color: ${T.cyan}; font: 800 11px 'JetBrains Mono', monospace; }
.p4-option.is-on { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-option.is-ok { border-color: rgba(34, 122, 83, .4); background: ${T.successSoft}; color: ${T.success}; }
.p4-option.is-ok .p4-letter { background: ${T.success}; color: #fff; }
.p4-option.is-no { border-color: rgba(169, 111, 19, .4); background: ${T.warnSoft}; color: ${T.warn}; }
.p4-option.is-no .p4-letter { background: ${T.warn}; color: #fff; }

.p4-construct { display: grid; gap: 7px; justify-items: center; }
.p4-build-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.p4-build-slot { min-width: 64px; min-height: 52px; border: 2px dashed rgba(23, 59, 82, .22); border-radius: 12px; background: #FBFBF8; color: ${T.ink3}; font: 800 clamp(14px, 3vw, 18px) 'JetBrains Mono', monospace; cursor: pointer; }
.p4-build-slot.is-filled { border-style: solid; border-color: ${T.cyan}; background: ${T.paper}; color: ${T.navy}; }
.p4-build-slot.is-ok { border-color: ${T.success}; background: ${T.successSoft}; color: ${T.success}; }
.p4-build-slot.is-no { border-color: ${T.warn}; background: ${T.warnSoft}; color: ${T.warn}; }

.p4-match-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 7px; }
.p4-match-col { display: grid; gap: 8px; }
.p4-match button, .p4-order button, .p4-slots button { min-width: 44px; min-height: 48px; padding: 8px 10px; border: 1px solid rgba(23, 59, 82, .12); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 700 clamp(11px, 1.75vw, 13px)/1.3 'Manrope', sans-serif; cursor: pointer; transition: transform .16s, border-color .2s, background .2s; }
.p4-match button:hover:not(:disabled), .p4-order button:hover:not(:disabled), .p4-slots button:hover:not(:disabled) { border-color: rgba(22, 143, 163, .4); transform: translateY(-2px); }
.p4-match button.is-active, .p4-order button.is-active, .p4-slots button.is-active { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-match button.is-tied, .p4-slots button.is-tied { border-color: rgba(34, 122, 83, .35); }
.p4-match button small { display: block; margin-top: 3px; color: ${T.success}; font-size: 10.5px; }
.p4-match button.is-used, .p4-card.is-used { background: ${T.successSoft}; opacity: .62; }

.p4-order-slots { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px; margin-top: 7px; }
.p4-slot-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; margin-top: 7px; }
.p4-order-slots button, .p4-slot { display: grid; gap: 3px; place-items: center; }
.p4-order-slots small, .p4-slot small { color: ${T.ink3}; font-size: 10px; }
.p4-order-slots b, .p4-slot b { font: 800 clamp(10px, 1.6vw, 12px)/1.2 'Manrope', sans-serif; text-align: center; }
.p4-card-bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; margin-top: 8px; }
.p4-card { min-width: 44px; min-height: 46px; padding: 7px 11px; border: 1px solid rgba(23, 59, 82, .12); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 800 12px/1.25 'Manrope', sans-serif; cursor: pointer; }

.p4-sort { display: grid; gap: 7px; }
.p4-sort-pool { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; min-height: 52px; padding: 7px; border: 1px dashed rgba(23, 59, 82, .2); border-radius: 12px; }
.p4-pool-done { display: grid; place-items: center; color: ${T.success}; font-size: 20px; font-weight: 800; }
.p4-sort-token { min-width: 64px; min-height: 44px; padding: 7px 11px; border: 1px solid rgba(23, 59, 82, .14); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 800 14px 'JetBrains Mono', monospace; cursor: pointer; }
.p4-sort-token.is-active { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-sort-token.is-ok { border-color: ${T.success}; background: ${T.successSoft}; color: ${T.success}; }
.p4-sort-token.is-no { border-color: ${T.warn}; background: ${T.warnSoft}; color: ${T.warn}; }
.p4-sort-bins { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; }
.p4-sort-bin { display: grid; gap: 5px; align-content: start; padding: 7px; border-radius: 12px; background: #FBFBF8; box-shadow: inset 0 0 0 1px rgba(23, 59, 82, .08); }
.p4-sort-bin-head { min-width: 44px; min-height: 44px; padding: 7px 8px; border: 0; border-radius: 10px; background: ${T.cyanSoft}; color: ${T.cyan}; font: 800 11.5px/1.25 'Manrope', sans-serif; cursor: pointer; }
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
