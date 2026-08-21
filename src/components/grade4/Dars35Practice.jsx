// ============================================================================
// 4-SINF · 35-DARS AMALIYOTI · UCHBURCHAK TURLARI
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
//
// SKELET: src/books/grade4/AMALIYOT_31_40_SKELET.md §5.5.
// Raskladka (scripts/grade4-practice-31-40-layout.mjs):
//   match · order · sort · slots · missing · match · sort · mc · order · missing
//
// NEGA BITTA FAYL VA NEGA CHIZMALAR SHU YERDA. LMS darsni bitta avtonom .jsx
// sifatida qabul qiladi: lokal import yo'q. Uchburchak chizmasi shu faylda
// yoziladi. CLAUDE.md §5 nusxa taqiqiga zid emas — LMS kontrakti majbur qiladi.
//
// DIZAYN: Dars01Practice.jsx. RUS TILIDA MUROJAAT — «ты».
//
// MATEMATIK ANIQLIK (metodist tasdiqlagan, 2026-08-21). «Teng tomonli» va
// «teng yonli» ni bir-birini rad etuvchi qutilarga bo'lish yolg'on model beradi:
// teng tomonli uchburchak ayni vaqtda teng yonli hamdir. Shuning uchun saralash
// qutilari XOSSA bilan nomlanadi: «uchta tomoni teng», «faqat ikkita tomoni
// teng», «hech bir tomoni teng emas».
//
// CHIZMA QOIDASI. Uchburchak haqiqiy geometriya bilan yasaladi: burchaklardan
// yoki tomonlardan uchlar hisoblanadi (kosinuslar teoremasi va sinuslar
// teoremasi), shuning uchun rasm ma'lumotdan ajralib qolmaydi.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

// ---- MATCH-FIX (metodist qarori 2026-08-21) --------------------------------
// Juftlashtirish uch narsani kafolatlaydi:
//   1) juftlikning ikki tomoni bir xil rang va bir xil belgi oladi — uchta
//      qator uchta rangda ko'rinadi va bola nimani nima bilan bog'laganini
//      ko'zi bilan ko'radi;
//   2) band kartochkani boshqa qatorga berish mumkin, shuning uchun hammasini
//      juftlagandan keyin ham xatoni tuzatish yo'li bor — tupik yo'q;
//   3) o'ng ustun chap ustun bilan bir qatorga tushmaydi: to'g'ri javob
//      qarshisida turib qolsa, bola o'ylamay bir qatorga bosadi.
// Blok har darsda takrorlanadi ATAYLAB: LMS avtonom fayl talab qiladi
// (scripts/build-grade4-practice-lms.mjs — lokal import yo'q).
const MATCH_TONES = 6;
// Chap ustundagi qatorlarning kaliti = `pairs` obyektining kaliti.
const matchRows = (task) => (task.pairs || []).map((pair) => pair.id);
const matchTone = (rows, key) => {
  const row = rows.findIndex((item) => String(item) === String(key));
  return row < 0 ? '' : ` p4-tone${(row % MATCH_TONES) + 1}`;
};
const matchToneLeft = (task, pairs, rowKey) => (
  pairs[rowKey] === undefined ? '' : matchTone(matchRows(task), rowKey)
);
const matchToneRight = (task, pairs, rightKey) => {
  const rows = matchRows(task);
  const owner = rows.find(
    (key) => pairs[key] !== undefined && String(pairs[key]) === String(rightKey),
  );
  return owner === undefined ? '' : matchTone(rows, owner);
};
// Kartochka band bo'lsa, eski juftlik bo'shatiladi: bitta kartochka bir vaqtda
// faqat bitta qatorga tegishli bo'ladi.
const matchTie = (pairs, rowKey, rightKey) => {
  const next = {};
  Object.keys(pairs).forEach((key) => {
    if (String(pairs[key]) !== String(rightKey)) next[key] = pairs[key];
  });
  next[rowKey] = rightKey;
  return next;
};
// O'ng ustunni shunday joylaydi, ki hech bir karta o'z juftining qarshisida
// turmaydi. Aralashtirish tasodifiy, lekin natijasi tekshiriladi.
const matchSpread = (cards, aligned) => {
  const list = Array.isArray(cards) ? [...cards] : [];
  if (list.length < 2) return list;
  const stuck = () => list.some((card, row) => aligned(card, row));
  for (let attempt = 0; attempt < 24 && stuck(); attempt += 1) {
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
  }
  for (let pass = 0; pass <= list.length && stuck(); pass += 1) {
    for (let i = 0; i < list.length; i += 1) {
      if (!aligned(list[i], i)) continue;
      const j = (i + 1) % list.length;
      [list[i], list[j]] = [list[j], list[i]];
    }
  }
  return list;
};
// ---- MATCH-FIX tugashi ----------------------------------------------------

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
    'Урок 35. Практика: виды треугольников',
    '35-dars. Amaliyot: uchburchak turlari',
    'Lesson 35. Practice: types of triangles',
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
    'Нажми фигуру, потом её ящик.',
    'Figurani bosing, keyin uning qutisini bosing.',
    'Tap a figure, then its box.',
  ),
  returnCard: b('Вернуть', 'Qaytarish', 'Return'),
};

const LESSON_META = {
  lessonId: 'num-4-35-practice',
  lessonTitle: UI.title,
  grade: 4,
  lessonNumber: 35,
  activityType: 'practice',
  taskCount: 10,
  resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'sorting', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'slot-fill', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'step-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'sorting', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-choice', type: 'practice', scored: true, scope: 'module-mikro' },
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

const ANGLE_NAMES = {
  acute: b('остроугольный', "o'tkir burchakli", 'acute-angled'),
  right: b('прямоугольный', "to'g'ri burchakli", 'right-angled'),
  obtuse: b('тупоугольный', "o'tmas burchakli", 'obtuse-angled'),
};
const SIDE_NAMES = {
  three: b('три стороны равны', 'uchta tomoni teng', 'all three sides equal'),
  two: b('только две стороны равны', 'faqat ikkita tomoni teng', 'only two sides equal'),
  none: b('ни одна сторона не равна другой', 'hech bir tomoni teng emas', 'no two sides equal'),
};

const TASKS = [
  {
    id: '01', level: 'green', kind: 'match', skillTag: 'two_name_recognition',
    visual: { type: 'triangles', items: [{ angles: [75, 62, 43] }, { angles: [90, 65, 25] }, { angles: [115, 42, 23] }] },
    setup: b(
      'На бланк фермы пришли три чертежа с подписанными углами.',
      "Ferma blankasiga burchaklari imzolangan uchta chizma keldi.",
      'Three drawings with labelled angles arrived on the truss form.',
    ),
    prompt: b(
      'Соедини треугольник с его названием по углам.',
      'Uchburchakni burchaklari bo\'yicha nomi bilan birlashtiring.',
      'Match each triangle with its name by angles.',
    ),
    pairs: [
      { id: 't75', left: b('75°, 62°, 43°', '75°, 62°, 43°', '75°, 62°, 43°'), correctRight: 'acute' },
      { id: 't90', left: b('90°, 65°, 25°', '90°, 65°, 25°', '90°, 65°, 25°'), correctRight: 'right' },
      { id: 't115', left: b('115°, 42°, 23°', '115°, 42°, 23°', '115°, 42°, 23°'), correctRight: 'obtuse' },
    ],
    right: [
      { id: 'acute', text: ANGLE_NAMES.acute },
      { id: 'right', text: ANGLE_NAMES.right },
      { id: 'obtuse', text: ANGLE_NAMES.obtuse },
    ],
    wrong: [b(
      'Название по углам решает самый большой угол, а не большинство углов.',
      "Burchaklar bo'yicha nomni eng katta burchak hal qiladi, burchaklar ko'pchiligi emas.",
      'The name by angles is decided by the largest angle, not by the majority of the angles.',
    )],
    secondHint: b(
      'В каждом треугольнике найди самый большой угол и сравни его с 90 градусами.',
      "Har uchburchakda eng katta burchakni topib, uni 90 daraja bilan solishtiring.",
      'Find the largest angle in each triangle and compare it with 90 degrees.',
    ),
    thirdHint: b(
      'Самые большие углы здесь 75, 90 и 115 градусов.',
      'Bu yerdagi eng katta burchaklar 75, 90 va 115 daraja.',
      'The largest angles here are 75, 90 and 115 degrees.',
    ),
    correctText: b(
      'Верно. Тип по углам задаёт только самый большой угол.',
      "To'g'ri. Burchaklar bo'yicha turni faqat eng katta burchak belgilaydi.",
      'Correct. The type by angles is set only by the largest angle.',
    ),
    rule: b(
      'Название по углам даёт самый большой угол треугольника.',
      "Burchaklar bo'yicha nomni uchburchakning eng katta burchagi beradi.",
      'The name by angles comes from the largest angle of the triangle.',
    ),
  },

  {
    id: '02', level: 'green', kind: 'order', skillTag: 'naming_order',
    visual: { type: 'two-line-form' },
    setup: b(
      'В бланке фермы две строки: название по углам и название по сторонам.',
      "Ferma blankasida ikki qator bor: burchaklar bo'yicha nom va tomonlar bo'yicha nom.",
      'The truss form has two lines: the name by angles and the name by sides.',
    ),
    prompt: b(
      'Расставь шаги заполнения бланка по порядку.',
      'Blankani to\'ldirish qadamlarini tartib bilan joylashtiring.',
      'Put the steps for completing the form in order.',
    ),
    steps: [
      { id: 'step-1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 'step-2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 'step-3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 'step-4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'biggest', text: b('Находим самый большой угол', 'Eng katta burchakni topamiz', 'Find the largest angle'), order: 0 },
      { id: 'angle-name', text: b('Пишем название по углам', "Burchaklar bo'yicha nomni yozamiz", 'Write the name by angles'), order: 1 },
      { id: 'count-sides', text: b('Считаем равные стороны', 'Teng tomonlarni sanaymiz', 'Count the equal sides'), order: 2 },
      { id: 'side-name', text: b('Пишем название по сторонам', "Tomonlar bo'yicha nomni yozamiz", 'Write the name by sides'), order: 3 },
    ],
    wrong: [b(
      'Обе строки заполняются, и каждая по своему признаку: сначала углы, потом стороны.',
      "Ikkala qator to'ldiriladi va har biri o'z belgisi bo'yicha: avval burchaklar, keyin tomonlar.",
      'Both lines are filled in, each by its own feature: angles first, then sides.',
    )],
    secondHint: b(
      'Одного названия мало: бланк не примут с пустой строкой.',
      "Bitta nom yetmaydi: bo'sh qatorli blanka qabul qilinmaydi.",
      'One name is not enough: the form is not accepted with an empty line.',
    ),
    thirdHint: b(
      'Порядок такой: угол, название по углам, стороны, название по сторонам.',
      "Tartib shunday: burchak, burchaklar bo'yicha nom, tomonlar, tomonlar bo'yicha nom.",
      'The order is: angle, name by angles, sides, name by sides.',
    ),
    correctText: b(
      'Верно. У треугольника два названия, и оба верны одновременно.',
      "To'g'ri. Uchburchakning ikkita nomi bor va ikkalasi ham bir vaqtda to'g'ri.",
      'Correct. A triangle has two names, and both are true at the same time.',
    ),
    rule: b(
      'Один треугольник получает два названия: по углам и по сторонам.',
      "Bitta uchburchak ikkita nom oladi: burchaklar bo'yicha va tomonlar bo'yicha.",
      'One triangle gets two names: by its angles and by its sides.',
    ),
  },

  {
    id: '03', level: 'yellow', kind: 'sort', skillTag: 'sort_by_sides',
    visual: { type: 'triangles', items: [{ sides: [6, 6, 6] }, { sides: [7, 7, 4] }, { sides: [8, 8, 3] }, { sides: [5, 8, 9] }] },
    setup: b(
      'У четырёх ферм измерены стороны.',
      "To'rtta fermaning tomonlari o'lchangan.",
      'The sides of four trusses have been measured.',
    ),
    prompt: b(
      'Разложи фермы по числу равных сторон.',
      'Fermalarni teng tomonlari soniga qarab joylashtiring.',
      'Sort the trusses by how many of their sides are equal.',
    ),
    bins: [
      { id: 'three', label: SIDE_NAMES.three },
      { id: 'two', label: SIDE_NAMES.two },
      { id: 'none', label: SIDE_NAMES.none },
    ],
    items: [
      {
        id: 's666', text: '6 · 6 · 6', bin: 'three',
        wrong: b(
          'Сравни здесь все три стороны между собой.',
          'Bu yerda uchala tomonni bir-biri bilan solishtiring.',
          'Compare all three sides with each other here.',
        ),
      },
      {
        id: 's774', text: '7 · 7 · 4', bin: 'two',
        wrong: b(
          'Посчитай, сколько сторон совпадает: все три или только две?',
          'Nechta tomon mos kelishini sanang: uchtasi ham yoki faqat ikkitasi?',
          'Count how many sides match: all three, or only two?',
        ),
      },
      {
        id: 's883', text: '8 · 8 · 3', bin: 'two',
        wrong: b(
          'Третья сторона здесь заметно короче двух равных.',
          'Bu yerda uchinchi tomon ikkita teng tomondan sezilarli qisqa.',
          'The third side here is noticeably shorter than the two equal ones.',
        ),
      },
      {
        id: 's589', text: '5 · 8 · 9', bin: 'none',
        wrong: b(
          'Проверь, есть ли здесь хотя бы одна пара равных сторон.',
          'Bu yerda hech bo\'lmasa bitta teng tomonlar jufti bormi, tekshiring.',
          'Check whether there is even one pair of equal sides here.',
        ),
      },
    ],
    wrong: [b(
      'Ящик выбирают по числу равных сторон, а не по виду чертежа.',
      'Quti teng tomonlar soniga qarab tanlanadi, chizmaning ko\'rinishiga qarab emas.',
      'The box is chosen by the number of equal sides, not by how the drawing looks.',
    )],
    secondHint: b(
      'Выпиши три числа и найди совпадения.',
      'Uchta sonni yozib olib, mos kelganlarini toping.',
      'Write out the three numbers and find the matches.',
    ),
    thirdHint: b(
      '6 · 6 · 6 — три равные; 7 · 7 · 4 и 8 · 8 · 3 — по две; 5 · 8 · 9 — ни одной.',
      "6 · 6 · 6 — uchtasi teng; 7 · 7 · 4 va 8 · 8 · 3 — ikkitasi; 5 · 8 · 9 — hech biri.",
      '6 · 6 · 6 has three equal; 7 · 7 · 4 and 8 · 8 · 3 have two; 5 · 8 · 9 has none.',
    ),
    correctText: b(
      'Верно. Название по сторонам зависит только от числа равных сторон.',
      "To'g'ri. Tomonlar bo'yicha nom faqat teng tomonlar soniga bog'liq.",
      'Correct. The name by sides depends only on the number of equal sides.',
    ),
    rule: b(
      'Треугольник с тремя равными сторонами — особый случай треугольника с двумя равными.',
      'Uchta tomoni teng uchburchak — ikkita tomoni teng uchburchakning maxsus holi.',
      'A triangle with three equal sides is a special case of one with two equal sides.',
    ),
  },

  {
    id: '04', level: 'yellow', kind: 'slots', skillTag: 'fill_both_names',
    visual: { type: 'triangles', items: [{ angles: [90, 45, 45], marks: ['equal', 'equal'] }] },
    setup: b(
      'У фермы один угол прямой, а две стороны при нём одинаковой длины.',
      "Fermaning bir burchagi to'g'ri, undagi ikki tomon esa bir xil uzunlikda.",
      'One angle of the truss is right, and the two sides at it are the same length.',
    ),
    prompt: b(
      'Заполни обе строки бланка.',
      'Blankaning ikkala qatorini to\'ldiring.',
      'Fill in both lines of the form.',
    ),
    slots: [
      {
        id: 'by-angles', label: b('По углам', "Burchaklar bo'yicha", 'By angles'), correct: 'right-card',
        wrong: b(
          'В этой строке смотрят только на самый большой угол.',
          'Bu qatorda faqat eng katta burchakka qaraladi.',
          'This line looks only at the largest angle.',
        ),
      },
      {
        id: 'by-sides', label: b('По сторонам', "Tomonlar bo'yicha", 'By sides'), correct: 'two-card',
        wrong: b(
          'В этой строке считают равные стороны, а не углы.',
          'Bu qatorda burchaklar emas, teng tomonlar sanaladi.',
          'This line counts the equal sides, not the angles.',
        ),
      },
    ],
    cards: [
      { id: 'right-card', text: ANGLE_NAMES.right },
      { id: 'two-card', text: SIDE_NAMES.two },
      { id: 'obtuse-card', text: ANGLE_NAMES.obtuse },
      { id: 'three-card', text: SIDE_NAMES.three },
    ],
    secondHint: b(
      'Самый большой угол здесь ровно 90 градусов.',
      "Bu yerda eng katta burchak aynan 90 daraja.",
      'The largest angle here is exactly 90 degrees.',
    ),
    thirdHint: b(
      'Прямой угол даёт первую строку, две равные стороны — вторую.',
      "To'g'ri burchak birinchi qatorni, ikkita teng tomon esa ikkinchisini beradi.",
      'The right angle gives the first line and the two equal sides give the second.',
    ),
    correctText: b(
      'Верно. Обе строки заполнены, и обе верны.',
      "To'g'ri. Ikkala qator to'ldirildi va ikkalasi ham to'g'ri.",
      'Correct. Both lines are filled in and both are true.',
    ),
    rule: b(
      'Углы и стороны — два независимых признака одного треугольника.',
      'Burchaklar va tomonlar — bitta uchburchakning ikki mustaqil belgisi.',
      'Angles and sides are two independent features of the same triangle.',
    ),
  },

  {
    id: '05', level: 'yellow', kind: 'missing', skillTag: 'two_right_angles',
    visual: { type: 'triangles', items: [{ angles: [90, 52, 38], hideLabels: [1, 2] }] },
    setup: b(
      'В бланке заполнена только первая строка: один угол прямой. Остальные два угла закрыты.',
      "Blankada faqat birinchi qator to'ldirilgan: bir burchak to'g'ri. Qolgan ikki burchak berkitilgan.",
      'Only the first line of the form is filled in: one angle is right. The other two angles are covered.',
    ),
    prompt: b(
      'Какими должны быть остальные два угла?',
      'Qolgan ikki burchak qanday bo\'lishi kerak?',
      'What must the other two angles be?',
    ),
    options: [
      option('both-acute', 'оба острые', "ikkalasi ham o'tkir", 'both acute', true),
      option('one-right', 'один из них прямой', "biri to'g'ri", 'one of them right', false,
        'Два прямых угла уже дают две стороны на одной прямой — треугольник не замкнётся.',
        "Ikkita to'g'ri burchak ikki tomonni bitta chiziqqa qo'yadi — uchburchak yopilmaydi.",
        'Two right angles already put two sides on one line, so the triangle would not close.'),
      option('one-obtuse', 'один из них тупой', "biri o'tmas", 'one of them obtuse', false,
        'Тупой угол вместе с прямым не оставит места третьему углу.',
        "O'tmas burchak to'g'ri burchak bilan birga uchinchi burchakka joy qoldirmaydi.",
        'An obtuse angle together with a right angle leaves no room for a third angle.'),
      option('both-right', 'оба прямые', "ikkalasi ham to'g'ri", 'both right', false,
        'Тогда прямых углов будет три, а такой треугольник не существует.',
        "Unda to'g'ri burchak uchta bo'ladi, bunday uchburchak esa mavjud emas.",
        'Then there would be three right angles, and such a triangle does not exist.'),
    ],
    secondHint: b(
      'Прямой угол в треугольнике может быть только один.',
      "Uchburchakda to'g'ri burchak faqat bitta bo'lishi mumkin.",
      'A triangle can have only one right angle.',
    ),
    thirdHint: b(
      'После прямого угла остальным двум остаётся только раскрытие меньше 90 градусов.',
      "To'g'ri burchakdan keyin qolgan ikkitasiga faqat 90 darajadan kichik ochilish qoladi.",
      'After the right angle, the other two can only open by less than 90 degrees.',
    ),
    correctText: b(
      'Верно. При прямом угле остальные два всегда острые.',
      "To'g'ri. To'g'ri burchak bo'lsa, qolgan ikkitasi doim o'tkir bo'ladi.",
      'Correct. When one angle is right, the other two are always acute.',
    ),
    rule: b(
      'В треугольнике не бывает двух прямых углов.',
      "Uchburchakda ikkita to'g'ri burchak bo'lmaydi.",
      'A triangle never has two right angles.',
    ),
  },

  {
    id: '06', level: 'yellow', kind: 'match', skillTag: 'truss_selection',
    visual: { type: 'order-sheet', rows: 3 },
    setup: b(
      'В цех пришли три заказа на фермы, и в каждом описан только признак.',
      "Sexga fermalarga uchta buyurtma keldi, har birida faqat belgi tasvirlangan.",
      'Three truss orders arrived at the shop, and each one describes only a feature.',
    ),
    prompt: b(
      'Соедини заказ с подходящей фермой.',
      'Buyurtmani mos ferma bilan birlashtiring.',
      'Match each order with a suitable truss.',
    ),
    pairs: [
      {
        id: 'roof-slopes',
        left: b('оба ската крыши одинаково наклонены', 'tomning ikki yoni bir xil qiya', 'both roof slopes lean equally'),
        correctRight: 'two-equal',
      },
      {
        id: 'corner',
        left: b('в углу нужен прямой угол', "burchakda to'g'ri burchak kerak", 'a right angle is needed in the corner'),
        correctRight: 'right-angled',
      },
      {
        id: 'grid',
        left: b('решётка из одинаковых стержней', 'bir xil sterjenlardan panjara', 'a grid of identical rods'),
        correctRight: 'three-equal',
      },
    ],
    right: [
      { id: 'two-equal', text: SIDE_NAMES.two },
      { id: 'right-angled', text: ANGLE_NAMES.right },
      { id: 'three-equal', text: SIDE_NAMES.three },
    ],
    wrong: [b(
      'Читай, что именно задано в заказе: угол или длины стержней.',
      "Buyurtmada aynan nima berilganini o'qing: burchakmi yoki sterjen uzunliklari.",
      'Read what the order actually gives: an angle or the lengths of the rods.',
    )],
    secondHint: b(
      'Если в заказе говорят про наклон и длины — это признак сторон.',
      "Agar buyurtmada qiyalik va uzunlik haqida gapirilsa — bu tomonlar belgisi.",
      'If the order speaks about lean and lengths, that is a feature of the sides.',
    ),
    thirdHint: b(
      'Одинаковый наклон двух скатов даёт две равные стороны; одинаковые стержни — три.',
      "Ikki yonning bir xil qiyaligi ikkita teng tomon beradi; bir xil sterjenlar esa uchta.",
      'Two slopes leaning equally give two equal sides; identical rods give three.',
    ),
    correctText: b(
      'Верно. Признак заказа сразу указывает нужное название.',
      "To'g'ri. Buyurtmadagi belgi kerakli nomni darrov ko'rsatadi.",
      'Correct. The feature in the order points straight to the name needed.',
    ),
    rule: b(
      'Если признак уже дан, его не измеряют заново.',
      "Belgi allaqachon berilgan bo'lsa, uni qaytadan o'lchamaydi.",
      'When a feature is already given, it is not measured again.',
    ),
  },

  {
    id: '07', level: 'yellow', kind: 'sort', skillTag: 'sort_by_angles',
    visual: { type: 'triangles', items: [{ angles: [78, 64, 38] }, { angles: [90, 68, 22] }, { angles: [105, 52, 23] }, { angles: [68, 58, 54] }] },
    setup: b(
      'У четырёх ферм подписан самый большой угол.',
      "To'rtta fermaning eng katta burchagi imzolangan.",
      'The largest angle of four trusses is labelled.',
    ),
    prompt: b(
      'Разложи фермы по названию по углам.',
      "Fermalarni burchaklar bo'yicha nomiga qarab joylashtiring.",
      'Sort the trusses by their name by angles.',
    ),
    bins: [
      { id: 'acute', label: ANGLE_NAMES.acute },
      { id: 'right', label: ANGLE_NAMES.right },
      { id: 'obtuse', label: ANGLE_NAMES.obtuse },
    ],
    items: [
      {
        id: 'a78', text: '78°', bin: 'acute',
        wrong: b(
          'Сравни 78 с 90 градусами.',
          '78 ni 90 daraja bilan solishtiring.',
          'Compare 78 with 90 degrees.',
        ),
      },
      {
        id: 'a90', text: '90°', bin: 'right',
        wrong: b(
          'Проверь, ровно ли 90 градусов в этой подписи.',
          'Bu imzoda aynan 90 daraja bor-yo\'qligini tekshiring.',
          'Check whether this label shows exactly 90 degrees.',
        ),
      },
      {
        id: 'a105', text: '105°', bin: 'obtuse',
        wrong: b(
          'Сравни 105 с 90 градусами.',
          '105 ni 90 daraja bilan solishtiring.',
          'Compare 105 with 90 degrees.',
        ),
      },
      {
        id: 'a68', text: '68°', bin: 'acute',
        wrong: b(
          'Сравни 68 с 90 градусами.',
          '68 ni 90 daraja bilan solishtiring.',
          'Compare 68 with 90 degrees.',
        ),
      },
    ],
    wrong: [b(
      'Ящик задаёт самый большой угол, а не число острых углов.',
      "Qutini eng katta burchak belgilaydi, o'tkir burchaklar soni emas.",
      'The box is set by the largest angle, not by how many acute angles there are.',
    )],
    secondHint: b(
      'Меньше 90 — остроугольный; ровно 90 — прямоугольный; больше 90 — тупоугольный.',
      "90 dan kichik — o'tkir burchakli; aynan 90 — to'g'ri burchakli; 90 dan katta — o'tmas burchakli.",
      'Less than 90 is acute-angled; exactly 90 is right-angled; more than 90 is obtuse-angled.',
    ),
    thirdHint: b(
      '78 и 68 меньше 90; 90 равно 90; 105 больше 90.',
      '78 va 68 — 90 dan kichik; 90 — 90 ga teng; 105 — 90 dan katta.',
      '78 and 68 are less than 90; 90 equals 90; 105 is more than 90.',
    ),
    correctText: b(
      'Верно. В каждом треугольнике решает один угол — самый большой.',
      "To'g'ri. Har uchburchakda bitta burchak — eng kattasi hal qiladi.",
      'Correct. In each triangle one angle decides: the largest one.',
    ),
    rule: b(
      'Два острых угла есть в любом треугольнике, поэтому они ничего не решают.',
      "Ikkita o'tkir burchak har qanday uchburchakda bor, shuning uchun ular hech narsani hal qilmaydi.",
      'Every triangle has two acute angles, so they decide nothing.',
    ),
  },

  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'impossible_triangle',
    visual: { type: 'claim-cards', count: 4 },
    setup: b(
      'В цехе обсуждают, какие фермы вообще бывают.',
      'Sexda qanday fermalar umuman bo\'lishi mumkinligi muhokama qilinadi.',
      'The shop is discussing which trusses can exist at all.',
    ),
    prompt: b(
      'Какой треугольник существовать не может?',
      'Qaysi uchburchak mavjud bo\'lishi mumkin emas?',
      'Which triangle cannot exist?',
    ),
    options: [
      option('two-right', 'с двумя прямыми углами', "ikkita to'g'ri burchakli", 'with two right angles', true),
      option('obtuse-two-equal', 'тупоугольный с двумя равными сторонами', "ikkita teng tomonli o'tmas burchakli", 'obtuse-angled with two equal sides', false,
        'Такая ферма бывает: тупой угол стоит между двумя равными стержнями.',
        "Bunday ferma bo'ladi: o'tmas burchak ikki teng sterjen orasida turadi.",
        'Such a truss exists: the obtuse angle sits between two equal rods.'),
      option('right-two-equal', 'прямоугольный с двумя равными сторонами', "ikkita teng tomonli to'g'ri burchakli", 'right-angled with two equal sides', false,
        'Такая ферма бывает — именно её заполняли в четвёртом задании.',
        "Bunday ferma bo'ladi — aynan uni to'rtinchi topshiriqda to'ldirdik.",
        'Such a truss exists: it is exactly the one filled in during task four.'),
      option('acute-three-equal', 'остроугольный с тремя равными сторонами', "uchta teng tomonli o'tkir burchakli", 'acute-angled with three equal sides', false,
        'Такая ферма бывает: у решётки из одинаковых стержней все углы острые.',
        "Bunday ferma bo'ladi: bir xil sterjenlardan panjarada hamma burchak o'tkir.",
        'Such a truss exists: a grid of identical rods has all its angles acute.'),
    ],
    secondHint: b(
      'Проверь, сколько прямых углов может быть в одном треугольнике.',
      "Bitta uchburchakda nechta to'g'ri burchak bo'lishi mumkinligini tekshiring.",
      'Check how many right angles one triangle can have.',
    ),
    thirdHint: b(
      'Два прямых угла ставят две стороны на одну прямую, и фигура не замыкается.',
      "Ikkita to'g'ri burchak ikki tomonni bitta chiziqqa qo'yadi va figura yopilmaydi.",
      'Two right angles put two sides on one line and the figure does not close.',
    ),
    correctText: b(
      'Верно. Два прямых угла в треугольнике невозможны.',
      "To'g'ri. Uchburchakda ikkita to'g'ri burchak bo'lishi mumkin emas.",
      'Correct. Two right angles in a triangle are impossible.',
    ),
    rule: b(
      'Два названия сочетаются свободно, но прямой угол в треугольнике только один.',
      "Ikki nom erkin birlashadi, lekin uchburchakda to'g'ri burchak faqat bitta.",
      'The two names combine freely, but a triangle has only one right angle.',
    ),
  },

  {
    id: '09', level: 'red', kind: 'order', skillTag: 'repair_naming_order',
    visual: { type: 'triangles', items: [{ angles: [112, 42, 26], error: true }] },
    setup: b(
      'Бит написал «остроугольный», потому что два угла из трёх острые. Самый большой угол здесь 112 градусов.',
      "Bit «o'tkir burchakli» deb yozdi, chunki uchta burchakdan ikkitasi o'tkir. Bu yerda eng katta burchak 112 daraja.",
      'Bit wrote acute-angled because two of the three angles are acute. The largest angle here is 112 degrees.',
    ),
    prompt: b(
      'Расставь шаги исправления по порядку.',
      'Tuzatish qadamlarini tartib bilan joylashtiring.',
      'Put the correction steps in order.',
    ),
    steps: [
      { id: 'step-1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 'step-2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 'step-3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 'step-4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'find', text: b('Находим самый большой угол', 'Eng katta burchakni topamiz', 'Find the largest angle'), order: 0 },
      { id: 'value', text: b('Он равен 112°', 'U 112° ga teng', 'It equals 112°'), order: 1 },
      { id: 'conclude', text: b('Значит тупоугольный', "Demak o'tmas burchakli", 'So it is obtuse-angled'), order: 2 },
      { id: 'second-line', text: b('Считаем стороны и пишем вторую строку', "Tomonlarni sanab, ikkinchi qatorni yozamiz", 'Count the sides and write the second line'), order: 3 },
    ],
    wrong: [b(
      'Исправление начинается с признака: какой угол самый большой.',
      'Tuzatish belgidan boshlanadi: qaysi burchak eng katta.',
      'The correction starts from the feature: which angle is the largest.',
    )],
    secondHint: b(
      'Число острых углов на название по углам не влияет.',
      "O'tkir burchaklar soni burchaklar bo'yicha nomga ta'sir qilmaydi.",
      'The number of acute angles does not affect the name by angles.',
    ),
    thirdHint: b(
      '112 больше 90, поэтому треугольник тупоугольный.',
      "112 — 90 dan katta, shuning uchun uchburchak o'tmas burchakli.",
      '112 is more than 90, so the triangle is obtuse-angled.',
    ),
    correctText: b(
      'Верно. Ошибка была в признаке: считали количество, а решает величина.',
      "To'g'ri. Xato belgida edi: sonini sanagan, hal qiluvchi esa kattaligi.",
      'Correct. The error was in the feature: the count was used, but the size decides.',
    ),
    rule: b(
      'Название по углам решает величина самого большого угла, а не количество острых.',
      "Burchaklar bo'yicha nomni eng katta burchakning kattaligi hal qiladi, o'tkirlar soni emas.",
      'The name by angles is decided by the size of the largest angle, not the number of acute ones.',
    ),
  },

  {
    id: '10', level: 'red', kind: 'missing', skillTag: 'name_from_description',
    visual: { type: 'record-plate', text: b('9 см · 9 см · 9 см', '9 cm · 9 cm · 9 cm', '9 cm · 9 cm · 9 cm') },
    setup: b(
      'В новом заказе чертежа нет: известно только, что все три стороны равны 9 см.',
      "Yangi buyurtmada chizma yo'q: faqat uchala tomon 9 cm ga tengligi ma'lum.",
      'The new order has no drawing: it is known only that all three sides are 9 cm.',
    ),
    prompt: b(
      'Что можно сказать про углы этой фермы?',
      'Bu fermaning burchaklari haqida nima deyish mumkin?',
      'What can be said about the angles of this truss?',
    ),
    options: [
      option('all-acute-equal', 'все три угла острые и равны между собой', "uchala burchak o'tkir va o'zaro teng", 'all three angles are acute and equal', true),
      option('one-right', 'один из углов прямой', "burchaklardan biri to'g'ri", 'one of the angles is right', false,
        'Прямой угол потребовал бы, чтобы одна сторона была длиннее двух других.',
        "To'g'ri burchak bir tomonning boshqa ikkitasidan uzun bo'lishini talab qilardi.",
        'A right angle would require one side to be longer than the other two.'),
      option('one-obtuse', 'один из углов тупой', "burchaklardan biri o'tmas", 'one of the angles is obtuse', false,
        'Против тупого угла всегда лежит самая длинная сторона, а здесь все стороны равны.',
        "O'tmas burchak qarshisida doim eng uzun tomon yotadi, bu yerda esa hamma tomon teng.",
        'The longest side always lies opposite an obtuse angle, but here all the sides are equal.'),
      option('unknown', 'по сторонам про углы сказать нельзя', "tomonlarga qarab burchaklar haqida aytib bo'lmaydi", 'the sides tell nothing about the angles', false,
        'Равные стороны задают и равные углы: признак работает в обе стороны.',
        'Teng tomonlar teng burchaklarni ham belgilaydi: belgi ikki tomonga ishlaydi.',
        'Equal sides also fix equal angles: the feature works both ways.'),
    ],
    secondHint: b(
      'Против равных сторон в треугольнике лежат равные углы.',
      'Uchburchakda teng tomonlar qarshisida teng burchaklar yotadi.',
      'Equal angles lie opposite equal sides in a triangle.',
    ),
    thirdHint: b(
      'Если все три угла равны, ни один из них не может дойти до 90 градусов.',
      "Agar uchala burchak teng bo'lsa, hech biri 90 darajaga yetolmaydi.",
      'If all three angles are equal, none of them can reach 90 degrees.',
    ),
    correctText: b(
      'Верно. Три равные стороны дают три равных острых угла.',
      "To'g'ri. Uchta teng tomon uchta teng o'tkir burchak beradi.",
      'Correct. Three equal sides give three equal acute angles.',
    ),
    rule: b(
      'Признак сторон позволяет назвать и углы: измерять заново не нужно.',
      'Tomonlar belgisi burchaklarni ham aytishga imkon beradi: qaytadan o\'lchash shart emas.',
      'A feature of the sides also names the angles: no new measurement is needed.',
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
// CHIZMALAR. Uchburchak haqiqiy geometriya bilan yasaladi.
//   `angles` berilsa — sinuslar teoremasi bilan tomonlar topiladi;
//   `sides` berilsa — kosinuslar teoremasi bilan burchaklar topiladi.
// Shundan keyin uchlar ramkaga sig'dirib normallashtiriladi, ya'ni imzo va
// rasm bitta manbadan chiqadi.
// ---------------------------------------------------------------------------
const trianglePoints = ({ angles, sides }) => {
  let a;
  let bSide;
  let cSide;
  let angleA;
  if (sides) {
    [a, bSide, cSide] = sides;
    angleA = Math.acos((bSide * bSide + cSide * cSide - a * a) / (2 * bSide * cSide));
  } else {
    const [A, B, C] = angles.map((value) => (value * Math.PI) / 180);
    angleA = A;
    cSide = 1;
    bSide = Math.sin(B) / Math.sin(C);
  }
  const points = [
    { x: 0, y: 0 },
    { x: cSide, y: 0 },
    { x: bSide * Math.cos(angleA), y: bSide * Math.sin(angleA) },
  ];
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);
  const scale = Math.min(96 / (width || 1), 62 / (height || 1));
  return points.map((point) => ({
    x: 12 + (point.x - Math.min(...xs)) * scale,
    y: 76 - (point.y - Math.min(...ys)) * scale,
  }));
};

const TriangleSvg = ({ item }) => {
  const points = trianglePoints(item);
  const path = points.map((point) => `${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' L');
  const centroid = {
    x: points.reduce((sum, point) => sum + point.x, 0) / 3,
    y: points.reduce((sum, point) => sum + point.y, 0) / 3,
  };
  const hidden = item.hideLabels || [];
  return (
    <svg className="p4-triangle" viewBox="0 0 122 92" aria-hidden="true">
      <path d={`M${path} Z`} fill={item.error ? T.warnSoft : T.cyanSoft} stroke={item.error ? T.warn : T.cyan} strokeWidth="2" />
      {item.angles && item.angles.map((value, index) => {
        if (hidden.includes(index)) {
          return (
            <text key={index} x={points[index].x + (centroid.x - points[index].x) * 0.34}
              y={points[index].y + (centroid.y - points[index].y) * 0.34 + 4} textAnchor="middle" className="p4-tri-hidden">?</text>
          );
        }
        return (
          <text key={index} x={points[index].x + (centroid.x - points[index].x) * 0.34}
            y={points[index].y + (centroid.y - points[index].y) * 0.34 + 4} textAnchor="middle" className="p4-tri-label">
            {value}
          </text>
        );
      })}
      {item.sides && item.sides.map((value, index) => {
        const from = points[(index + 1) % 3];
        const to = points[(index + 2) % 3];
        const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
        return (
          <text key={index} x={mid.x + (mid.x - centroid.x) * 0.3} y={mid.y + (mid.y - centroid.y) * 0.3 + 3}
            textAnchor="middle" className="p4-tri-label">{value}</text>
        );
      })}
    </svg>
  );
};

function Visual({ task, lang }) {
  const visual = task.visual;
  if (!visual) return null;

  if (visual.type === 'triangles') {
    return (
      <div className="p4-visual p4-visual-row">
        {visual.items.map((item, index) => (
          <span className="p4-tri-cell" key={index} style={{ animationDelay: `${index * 70}ms` }}>
            <TriangleSvg item={item} />
          </span>
        ))}
      </div>
    );
  }

  if (visual.type === 'two-line-form') {
    return (
      <div className="p4-visual">
        <span className="p4-form">
          <i />
          <i />
        </span>
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

  if (visual.type === 'claim-cards') {
    return (
      <div className="p4-visual p4-visual-row">
        {Array.from({ length: visual.count }, (_, index) => (
          <span className="p4-claim" key={index} style={{ animationDelay: `${index * 70}ms` }}>{'ABCD'[index]}</span>
        ))}
      </div>
    );
  }

  if (visual.type === 'record-plate') {
    return <div className="p4-visual"><strong>{tx(visual.text, lang)}</strong></div>;
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
  const rightCards = useMemo(() => matchSpread(task.right, (card, row) => card.id === task.pairs[row]?.correctRight), [shuffleSeed, task.id, task.right]);
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

      {task.kind === 'match' && (
        <div className="p4-match">
          <p className="p4-note">{tx(UI.matchHint, lang)}</p>
          <div className="p4-match-grid">
            <section className="p4-match-col">
              {task.pairs.map((pair) => (
                <button type="button" key={pair.id} disabled={solved} aria-pressed={activeLeft === pair.id}
                  className={`${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''}${matchToneLeft(task, pairs, pair.id)}`}
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
                  <button type="button" key={item.id} className={`${used ? 'is-used' : ''}${matchToneRight(task, pairs, item.id)}`}
                    disabled={solved || activeLeft === null}
                    onClick={() => {
                      checkingRef.current = false;
                      setPairs((old) => matchTie(old, activeLeft, item.id));
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

export default function Grade4Dars35Practice({ studentName, lang: langProp, onFinished }) {
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
.p4-triangle { width: clamp(72px, 19vw, 116px); height: auto; animation: p4-drop .5s cubic-bezier(.22, 1.2, .36, 1) both; }
.p4-tri-cell { display: grid; justify-items: center; }
.p4-tri-label { fill: ${T.navy}; font: 800 11px 'JetBrains Mono', monospace; }
.p4-tri-hidden { fill: ${T.accent}; font: 800 13px 'JetBrains Mono', monospace; }
.p4-form { display: grid; gap: 7px; }
.p4-form i { display: block; width: min(212px, 60vw); height: 15px; border-radius: 4px; background: rgba(23, 59, 82, .1); animation: p4-drop .5s cubic-bezier(.22, 1.2, .36, 1) both; }
.p4-claim { display: grid; place-items: center; width: 42px; height: 52px; border-radius: 10px; background: ${T.cyanSoft}; color: ${T.cyan}; font: 800 18px 'JetBrains Mono', monospace; animation: p4-drop .5s cubic-bezier(.22, 1.2, .36, 1) both; }

.p4-options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
.p4-option { display: flex; align-items: center; gap: 9px; min-width: 44px; min-height: 56px; padding: 10px 12px; text-align: left; border: 1px solid rgba(23, 59, 82, .12); border-radius: 14px; background: ${T.paper}; color: ${T.ink}; font: 700 clamp(13px, 1.9vw, 15px)/1.35 'Manrope', sans-serif; cursor: pointer; transition: transform .16s, border-color .2s, background .2s; }
.p4-option:hover:not(:disabled) { border-color: rgba(22, 143, 163, .4); transform: translateY(-2px); }
.p4-letter { flex: 0 0 26px; display: grid; place-items: center; width: 26px; height: 26px; border-radius: 8px; background: ${T.cyanSoft}; color: ${T.cyan}; font: 800 11px 'JetBrains Mono', monospace; }
.p4-option.is-on { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-option.is-ok { border-color: rgba(34, 122, 83, .4); background: ${T.successSoft}; color: ${T.success}; }
.p4-option.is-ok .p4-letter { background: ${T.success}; color: #fff; }
.p4-option.is-no { border-color: rgba(169, 111, 19, .4); background: ${T.warnSoft}; color: ${T.warn}; }
.p4-option.is-no .p4-letter { background: ${T.warn}; color: #fff; }

.p4-match-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 7px; }
.p4-match-col { display: grid; gap: 8px; }
.p4-match button, .p4-order button, .p4-slots button { min-width: 44px; min-height: 48px; padding: 8px 10px; border: 1px solid rgba(23, 59, 82, .12); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 700 clamp(11.5px, 1.8vw, 13.5px)/1.3 'Manrope', sans-serif; cursor: pointer; transition: transform .16s, border-color .2s, background .2s; }
.p4-match button:hover:not(:disabled), .p4-order button:hover:not(:disabled), .p4-slots button:hover:not(:disabled) { border-color: rgba(22, 143, 163, .4); transform: translateY(-2px); }
.p4-match button.is-active, .p4-order button.is-active, .p4-slots button.is-active { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-match button.is-tied, .p4-slots button.is-tied { border-color: rgba(34, 122, 83, .35); }
.p4-match button small { display: block; margin-top: 3px; color: ${T.success}; font-size: 11px; }
.p4-match button.is-used, .p4-card.is-used { background: ${T.successSoft}; opacity: .62; }

.p4-order-slots, .p4-slot-list { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px; margin-top: 7px; }
.p4-slot-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.p4-order-slots button, .p4-slot { display: grid; gap: 3px; place-items: center; }
.p4-order-slots small, .p4-slot small { color: ${T.ink3}; font-size: 10px; }
.p4-order-slots b, .p4-slot b { font: 800 clamp(10.5px, 1.7vw, 12.5px)/1.2 'Manrope', sans-serif; text-align: center; }
.p4-card-bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; margin-top: 8px; }
.p4-card { min-width: 44px; min-height: 46px; padding: 7px 11px; border: 1px solid rgba(23, 59, 82, .12); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 800 12px 'Manrope', sans-serif; cursor: pointer; }

.p4-sort { display: grid; gap: 7px; }
.p4-sort-pool { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; min-height: 52px; padding: 7px; border: 1px dashed rgba(23, 59, 82, .2); border-radius: 12px; }
.p4-pool-done { display: grid; place-items: center; color: ${T.success}; font-size: 20px; font-weight: 800; }
.p4-sort-token { min-width: 60px; min-height: 44px; padding: 7px 11px; border: 1px solid rgba(23, 59, 82, .14); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 800 14px 'JetBrains Mono', monospace; cursor: pointer; }
.p4-sort-token.is-active { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-sort-token.is-ok { border-color: ${T.success}; background: ${T.successSoft}; color: ${T.success}; }
.p4-sort-token.is-no { border-color: ${T.warn}; background: ${T.warnSoft}; color: ${T.warn}; }
.p4-sort-bins { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; }
.p4-sort-bin { display: grid; gap: 5px; align-content: start; padding: 7px; border-radius: 12px; background: #FBFBF8; box-shadow: inset 0 0 0 1px rgba(23, 59, 82, .08); }
.p4-sort-bin-head { min-width: 44px; min-height: 44px; padding: 7px 8px; border: 0; border-radius: 10px; background: ${T.cyanSoft}; color: ${T.cyan}; font: 800 11px/1.25 'Manrope', sans-serif; cursor: pointer; }
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
  .p4-option, .p4-match button, .p4-order button, .p4-slots button { min-height: 44px !important; padding: 5px 8px !important; font-size: 11.5px !important; }
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

/* MATCH-FIX boshlanishi — metodist qarori 2026-08-21.
   Juftlikning ikki tomoni bir xil rang va bir xil belgi oladi: uchta qator
   uchta rangda ko'rinadi. Rang tanlangan (is-active) va band (is-used)
   holatlaridan ustun turishi kerak, shuning uchun !important. Tanlov va
   tekshiruv holatlari esa rangdan ustun: ular pastda, keyingi qatorlarda.
   Blok har darsda takrorlanadi ATAYLAB: LMS avtonom fayl talab qiladi. */
.p4-match [class*="p4-tone"],.g4p-match [class*="p4-tone"]{position:relative;opacity:1!important}
.p4-match [class*="p4-tone"]::before,.g4p-match [class*="p4-tone"]::before{position:absolute;top:2px;left:4px;font-size:9px;line-height:1;opacity:.9;pointer-events:none}
.p4-match [class*="p4-tone"] b,.g4p-match [class*="p4-tone"] b,.p4-match [class*="p4-tone"] small,.g4p-match [class*="p4-tone"] small{color:inherit!important}
.p4-match .p4-tone1,.g4p-match .p4-tone1{background:#DCF0F3!important;border-color:#0E7C8F!important;box-shadow:inset 0 0 0 2px #0E7C8F!important;color:#0B5A68!important}
.p4-match .p4-tone1::before,.g4p-match .p4-tone1::before{content:"●";color:#0E7C8F}
.p4-match .p4-tone2,.g4p-match .p4-tone2{background:#FBEBCB!important;border-color:#A2690F!important;box-shadow:inset 0 0 0 2px #A2690F!important;color:#6E4708!important}
.p4-match .p4-tone2::before,.g4p-match .p4-tone2::before{content:"▲";color:#A2690F}
.p4-match .p4-tone3,.g4p-match .p4-tone3{background:#E9E4F7!important;border-color:#5E45AD!important;box-shadow:inset 0 0 0 2px #5E45AD!important;color:#3E2E75!important}
.p4-match .p4-tone3::before,.g4p-match .p4-tone3::before{content:"■";color:#5E45AD}
.p4-match .p4-tone4,.g4p-match .p4-tone4{background:#FBE2EA!important;border-color:#AE3760!important;box-shadow:inset 0 0 0 2px #AE3760!important;color:#77223F!important}
.p4-match .p4-tone4::before,.g4p-match .p4-tone4::before{content:"◆";color:#AE3760}
.p4-match .p4-tone5,.g4p-match .p4-tone5{background:#E2E8F0!important;border-color:#3C5A80!important;box-shadow:inset 0 0 0 2px #3C5A80!important;color:#27405C!important}
.p4-match .p4-tone5::before,.g4p-match .p4-tone5::before{content:"★";color:#3C5A80}
.p4-match .p4-tone6,.g4p-match .p4-tone6{background:#DFF0E4!important;border-color:#1F7A4C!important;box-shadow:inset 0 0 0 2px #1F7A4C!important;color:#145536!important}
.p4-match .p4-tone6::before,.g4p-match .p4-tone6::before{content:"✚";color:#1F7A4C}
.p4-match .is-active,.g4p-match .is-active{background:#FFF0EA!important;border-color:#FF5B35!important;box-shadow:inset 0 0 0 2px #FF5B35!important;color:#12212C!important}
.p4-match .is-ok,.g4p-match .is-ok{background:#E7F3EC!important;border-color:#227A53!important;box-shadow:inset 0 0 0 2px #227A53!important;color:#1B5E40!important}
.p4-match .is-no,.g4p-match .is-no{background:#FFF5D9!important;border-color:#A96F13!important;box-shadow:inset 0 0 0 2px #A96F13!important;color:#7C5210!important}
/* MATCH-FIX tugashi */
/* NOSCROLL boshlanishi — metodist qarori 2026-08-21.
   Past ekranda (1280x720 noutbuk, 360x640 telefon) topshiriq skrollga
   ketmasligi kerak: bola «Tekshirish» tugmasini ko'rmasa, uni bosmaydi.
   Faqat BO'SH JOY qisqaradi — bosiladigan maydon 44 px dan kichraymaydi
   (MOBIL_DESKTOP_MOSLASH.md). Blok har darsda takrorlanadi ATAYLAB: LMS
   avtonom fayl talab qiladi. */
@media (max-height:820px){
.p4-root,.g4p-root{padding-bottom:12px}
.p4-head,.g4p-head{padding-top:52px;padding-bottom:4px}
.p4-task,.g4p-task{gap:8px}
.p4-eyebrow,.g4p-eyebrow{margin-top:0}
.p4-ask,.g4p-ask{margin-top:0}
.p4-note,.g4p-note{margin-top:4px}
.p4-actions,.g4p-actions{margin-top:0}
.p4-figure{padding-top:8px;padding-bottom:8px}
.p4-pad,.g4p-pad{padding:8px;gap:6px}
.p4-pad-display,.g4p-pad-display{min-height:44px}
.p4-pad-keys,.g4p-pad-keys{gap:5px}
.p4-options,.g4p-options{gap:7px}
.p4-match-cols,.g4p-match-cols{gap:8px;margin-top:4px}
.p4-match-col,.g4p-match-col{gap:6px}
.p4-header,.g4p-header{margin-bottom:4px}
.p4-header h1,.g4p-header h1{margin-top:2px}
.p4-task-top{margin-bottom:2px}
.p4-setup,.g4p-setup{line-height:1.4}
.p4-match-item,.g4p-match-item{min-height:44px;padding-top:5px;padding-bottom:5px}
.p4-match button,.g4p-match button{min-height:44px;padding-top:5px;padding-bottom:5px}
.p4-fb,.p4-feedback,.g4p-feedback{padding-top:9px;padding-bottom:9px}
.p4-rule,.g4p-rule{margin-top:6px}
.p4-cells,.p4-grid{gap:4px}
.p4-card-bank,.p4-order-slots,.p4-slot-list,.p4-sort-pool{gap:6px}
}
@media (max-height:760px){
.p4-head,.g4p-head{padding-bottom:0}
.p4-main,.g4p-main{padding-top:0;padding-bottom:0}
.p4-root,.g4p-root{padding-bottom:8px}
.p4-task,.g4p-task{gap:5px}
.p4-figure{padding-top:4px;padding-bottom:4px}
.p4-eyebrow,.g4p-eyebrow{font-size:10px}
.p4-setup,.g4p-setup{font-size:clamp(13px,1.8vw,14px)}
.p4-ask,.g4p-ask{font-size:clamp(15px,2.2vw,18px)}
.p4-pad,.g4p-pad{padding:4px;gap:4px}
.p4-pad-keys,.g4p-pad-keys{gap:4px}
.p4-pad-display,.g4p-pad-display{min-height:40px}
.p4-visual,.g4p-visual{padding-top:8px;padding-bottom:8px;min-height:0}
.p4-svg,.g4p-svg{max-height:96px}
}
@media (max-height:700px){
.p4-head,.g4p-head{padding-top:52px;padding-bottom:2px}
.p4-task,.g4p-task{gap:6px}
.p4-figure{padding-top:6px;padding-bottom:6px}
.p4-bignum,.g4p-bignum{font-size:clamp(20px,4.4vw,30px)}
.p4-pad,.g4p-pad{padding:6px;gap:5px}
.p4-match-col,.g4p-match-col{gap:5px}
}
/* NOSCROLL tugashi */
`;
