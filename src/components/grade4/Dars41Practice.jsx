// ============================================================================
// 4-SINF · 41-DARS AMALIYOTI · SIMMETRIYA VA BURILISH SIMMETRIYASI
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
//
// Skelet: src/books/grade4/AMALIYOT_41_51_SKELET.md §4.
// Mexanika raskladkasi: scripts/grade4-practice-41-51-layout.mjs
//   mc · shade · order · numpad · gap · mc · sort · shade · match · sort
//
// NEGA BITTA FAYL VA NEGA INFRATUZILMA ICHKARIDA. LMS darsni bitta avtonom
// .jsx sifatida qabul qiladi: lokal import ko'tarilmaydi, uslublar ham fayl
// ichida bo'lishi kerak. Shuning uchun CLAUDE.md §5 (umumiy kodni import
// qilish) dan ONGLI chekinish: mexanika komponentlari va uslublar shu faylda
// takrorlanadi. Boshqa yo'l yo'q — 3-sinfdagi kabi bo'lish LMS ga yuklashni
// imkonsiz qiladi.
//
// NAZARIYADAN FARQ. Nazariy dars 360 : 3, 360 : 4 va 360 : 6 ni ishlatgan,
// shuning uchun bu yerda besh bargli guldasta (360 : 5 = 72) turadi. Naqsh
// kataklari, panel sonlari va shakllar ham boshqa.
//
// SAHNA. Har topshiriqda haqiqiy model: katakli panel, naqsh lentasi,
// guldasta, shakl belgilari. Model yechimning birinchi qadamini bermaydi,
// animatsiya to'g'ri javobga ishora qilmaydi. Saralash va moslashtirishda
// modelni kartalarning o'zi tashiydi, shuning uchun alohida sahna yo'q.
//
// KATAK KARTASI (`map`): `.` bo'sh, `#` berilgan, `+` bo'yalishi kerak,
// `-` bosiladi lekin bo'yalmaydi, `*` belgilangan uch, `?` noma'lum.
// Rasm va javob bitta manbadan chiqadi: ular bir-biridan ayrilib qolmaydi.
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
const tx = (value, lang) => (value && typeof value === 'object' && !Array.isArray(value) ? value[normalizeLang(lang)] ?? '' : value);

const UI = {
  title: b('Урок 41. Практика: симметрия и поворотная симметрия', "41-dars. Amaliyot: simmetriya va burilish simmetriyasi", 'Lesson 41. Practice: line and rotational symmetry'),
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
  allSolved: b('Все 10 заданий решены.', "10 ta topshiriqning barchasi yechildi.", 'All 10 tasks have been solved.'),
  rule: b('Запомни', 'Eslab qoling', 'Remember'),
  typeAnswer: b('Введи числовой ответ', 'Sonli javobni kiriting', 'Enter a numerical answer'),
  clear: b('Стереть', "O'chirish", 'Delete'),
  matchHint: b('Выбери карточку слева, потом пару справа.', "Avval chapdagi kartani, keyin o'ngdagi juftini tanlang.", 'Choose a card on the left, then its match on the right.'),
  orderHint: b('Выбери место, потом карточку шага.', 'Avval joyni, keyin qadam kartasini tanlang.', 'Choose a position, then a step card.'),
  sortHint: b('Выбери карточку, потом группу.', 'Avval kartani, keyin guruhni tanlang.', 'Choose a card, then a group.'),
  shadeHint: b('Нажимай на клетки справа.', "O'ngdagi kataklarni bosing.", 'Tap the cells on the right.'),
  gapHint: b('Нажми на промежуток между элементами.', 'Elementlar orasidagi bo\'shliqqa bosing.', 'Tap the gap between the elements.'),
  ticksAxis: b('ось', "o'q", 'axis'),
  cell: b('клетка', 'katak', 'cell'),
  returnCard: b('Вернуть карточку', 'Kartani qaytarish', 'Return the card'),
};

const LESSON_META = {
  lessonId: 'sym-4-41-practice',
  lessonTitle: UI.title,
  grade: 4,
  lessonNumber: 41,
  activityType: 'practice',
  taskCount: 10,
  resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'grid-shading', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'axis-placement', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'word-problem', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'sorting', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-shading', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const TASKS = [
  {
    id: '01', level: 'green', kind: 'mc', skillTag: 'axis_recognition',
    // Vertikal bo'yicha simmetrik, gorizontal bo'yicha emas: pastda ikki qator
    // bir xil, yuqorida esa naqsh kengayadi.
    visual: { type: 'grid', cols: 6, rows: 6, map: ['..##..', '.####.', '##..##', '.####.', '..##..', '..##..'] },
    setup: b(
      'Мастерская орнамента прислала чертёж новой панели. Панель можно сгибать по разным линиям.',
      "Naqsh ustaxonasi yangi panel chizmasini yubordi. Panelni turli chiziqlar bo'ylab buklab ko'rish mumkin.",
      'The pattern workshop has sent a drawing of a new panel. The panel can be folded along different lines.',
    ),
    prompt: b(
      'Какая линия является осью симметрии этой фигуры?',
      "Qaysi chiziq bu shaklning simmetriya o'qi?",
      'Which line is the axis of symmetry of this figure?',
    ),
    options: [
      option('vertical', 'Вертикальная средняя линия', "Vertikal o'rta chiziq", 'The vertical middle line', true),
      option('horizontal', 'Горизонтальная средняя линия', "Gorizontal o'rta chiziq", 'The horizontal middle line', false,
        'При сгибе по горизонтальной линии верхняя часть оказывается длиннее нижней. Сосчитай строки сверху и снизу.',
        "Gorizontal chiziq bo'ylab buklaganda yuqori qism pastdan uzunroq bo'lib chiqadi. Qatorlarni yuqoridan va pastdan sanab ko'ring.",
        'Folding along the horizontal line leaves the top part longer than the bottom. Count the rows from the top and from the bottom.'),
      option('diagonal', 'Диагональ', 'Diagonal', 'The diagonal', false,
        'Диагональ может разделить фигуру на две равные по площади части, но при сгибе клетки не совпадают. Равная площадь ещё не ось.',
        "Diagonal shaklni yuzasi teng ikki qismga bo'lishi mumkin, lekin buklaganda kataklar ustma-ust tushmaydi. Teng yuza hali o'q degani emas.",
        'A diagonal may split the figure into two parts of equal area, but the cells do not match when folded. Equal area is not yet an axis.'),
      option('none', 'Оси симметрии нет', "Simmetriya o'qi yo'q", 'There is no axis of symmetry', false,
        'Одна ось есть. Согни фигуру по вертикальной средней линии.',
        "Bitta o'q bor. Shaklni vertikal o'rta chiziq bo'ylab buklab ko'ring.",
        'There is one axis. Fold the figure along the vertical middle line.'),
    ],
    secondHint: b(
      'В каждой строке сравни клетки на левом и на правом краю.',
      "Har qatorda chap va o'ng chetdagi kataklarni juftlab solishtiring.",
      'In each row compare the cells at the left edge and at the right edge.',
    ),
    thirdHint: b(
      'В третьей строке слева две клетки и справа две — линия стоит вертикально.',
      "Uchinchi qatorda chapda ikkita, o'ngda ham ikkita katak bor — chiziq tik turadi.",
      'In the third row there are two cells on the left and two on the right, so the line stands vertically.',
    ),
    correctText: b(
      'Верно. При сгибе по вертикальной средней линии каждая клетка ложится на свою пару.',
      "To'g'ri. Vertikal o'rta chiziq bo'ylab buklaganda har katak o'z juftiga tushadi.",
      'Correct. Folding along the vertical middle line puts every cell onto its pair.',
    ),
    rule: b(
      'Ось симметрии — линия, по которой две половины полностью совпадают при сгибе.',
      "Simmetriya o'qi — buklaganda ikki yarim to'liq ustma-ust tushadigan chiziq.",
      'An axis of symmetry is a line where the two halves match exactly when the figure is folded.',
    ),
  },

  {
    id: '02', level: 'green', kind: 'shade', skillTag: 'mirror_cells',
    // O'q 3 va 4-ustun orasidan o'tadi. Chapda 7 katak berilgan, o'ngda
    // 7 katak bo'yalishi kerak; qolgan o'ng kataklar bosiladi, lekin xato.
    visual: {
      type: 'grid', cols: 8, rows: 4, axis: { dir: 'v', gap: 4 },
      map: ['...#+---', '..##++--', '.###+++-', '...#+---'],
    },
    setup: b(
      'Станок вырезал только левую половину узора. Правая должна получиться по закону зеркала.',
      "Dastgoh naqshning faqat chap yarmini kesdi. O'ng yarmi ko'zgu qonuni bilan chiqishi kerak.",
      'The cutter has cut only the left half of the pattern. The right half must come from the law of the mirror.',
    ),
    prompt: b(
      'Закрась справа клетки, которые отражают левую половину.',
      "O'ng tomonda chap yarmni aks ettiradigan kataklarni bo'yang.",
      'Shade the cells on the right that reflect the left half.',
    ),
    wrongRules: [
      { when: 'count', text: b(
        'Закрашено не столько клеток, сколько в левой половине. Сосчитай закрашенные клетки слева.',
        "Bo'yalgan kataklar soni chap yarimdagi kataklar soniga teng emas. Chapdagi kataklarni sanab ko'ring.",
        'The number of shaded cells does not match the left half. Count the shaded cells on the left.',
      ) },
      { when: 'place', text: b(
        'Клеток столько, сколько нужно, но стоят они не на своих местах. Считай, сколько клеток от оси до каждой клетки.',
        "Kataklar soni to'g'ri, lekin o'rni to'g'ri emas. Har katakdan o'qgacha nechta katak borligini sanang.",
        'The count is right but the places are not. Count how many cells there are from the axis to each cell.',
      ) },
    ],
    secondHint: b(
      'В третьей строке слева три клетки: на расстоянии одной, двух и трёх клеток от оси.',
      "Uchinchi qatorda chapda uchta katak bor: o'qdan bir, ikki va uch katak masofada.",
      'In the third row there are three cells on the left: one, two and three cells away from the axis.',
    ),
    thirdHint: b(
      'Клетка в одной клетке слева от оси отражается в клетку в одной клетке справа от оси.',
      "O'qdan bir katak chapda turgan katakning aksi o'qdan bir katak o'ngda turadi.",
      'A cell one cell to the left of the axis is reflected into the cell one cell to the right of the axis.',
    ),
    correctText: b(
      'Верно. Каждая клетка стоит на своём расстоянии от оси, и узор закрывается на стыке.',
      "To'g'ri. Har katak o'qdan o'z masofasida turadi va naqsh chokda yopiladi.",
      'Correct. Every cell stands at its own distance from the axis, and the pattern closes at the seam.',
    ),
    rule: b(
      'Взаимно симметричные клетки лежат на одинаковом расстоянии от оси симметрии.',
      "O'zaro simmetrik kataklar simmetriya o'qidan bir xil masofada yotadi.",
      'Mutually symmetric cells lie at the same distance from the axis of symmetry.',
    ),
  },

  {
    id: '03', level: 'yellow', kind: 'order', skillTag: 'construction_order',
    visual: {
      type: 'grid', cols: 6, rows: 4, axis: { dir: 'v', gap: 3 }, perpRow: 1,
      map: ['......', '.*..?.', '......', '......'],
    },
    setup: b(
      'Фигуру строят по вершинам, и порядок шагов здесь важен.',
      "Shakl uchlari bo'yicha quriladi va bu yerda qadamlar tartibi muhim.",
      'A figure is built vertex by vertex, and the order of the steps matters.',
    ),
    prompt: b(
      'Расставь шаги построения отражения по порядку.',
      "Ko'zgu qurish qadamlarini tartib bilan joylashtiring.",
      'Put the steps of building the reflection in order.',
    ),
    steps: [
      { id: 's1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 's2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 's3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 's4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'axis', text: b('Отметить ось', "O'qni belgilash", 'Mark the axis'), order: 0 },
      { id: 'perp', text: b('Провести перпендикуляр к оси', "O'qqa tik yo'l chizish", 'Draw a perpendicular to the axis'), order: 1 },
      { id: 'count', text: b('Отсчитать равное расстояние', 'Teng masofani sanash', 'Count an equal distance'), order: 2 },
      { id: 'join', text: b('Соединить точки', 'Nuqtalarni tutashtirish', 'Join the points'), order: 3 },
    ],
    wrong: [b(
      'Сначала ось, затем расстояние, и только в конце линия. Точку не ставят, не измерив расстояние.',
      "Avval o'q, keyin masofa, oxirida chiziq. Masofa o'lchanmasdan nuqta qo'yilmaydi.",
      'First the axis, then the distance, and only at the end the line. A point is not placed before the distance is measured.',
    )],
    secondHint: b(
      'На первом шаге ничего не измеряют: только отмечают ось.',
      "Birinchi qadamda hech narsa o'lchanmaydi: faqat o'q belgilanadi.",
      'Nothing is measured at the first step: only the axis is marked.',
    ),
    thirdHint: b(
      'Соединение — последний шаг, после того как все вершины встали на свои места.',
      "Tutashtirish oxirgi qadam: barcha uchlar o'z joyiga tushgandan keyin bajariladi.",
      'Joining is the last step, once all the vertices are in their places.',
    ),
    correctText: b(
      'Верно. Ось, перпендикуляр, равное расстояние, соединение.',
      "To'g'ri. O'q, tik yo'l, teng masofa, tutashtirish.",
      'Correct. Axis, perpendicular, equal distance, joining.',
    ),
    rule: b(
      'Каждую вершину ставят на своё расстояние от оси, и только потом соединяют.',
      "Har bir uch o'qdan o'z masofasiga qo'yiladi va faqat keyin tutashtiriladi.",
      'Each vertex is placed at its own distance from the axis, and only then are they joined.',
    ),
  },

  {
    id: '04', level: 'yellow', kind: 'numpad', skillTag: 'turn_angle', answer: '72', maxLen: 3,
    visual: { type: 'rosette', petals: 5 },
    setup: b(
      'Круглая розетка построена поворотом одного лепестка. За один оборот она пять раз ложится на себя.',
      "Dumaloq guldasta bitta bargni burish bilan qurilgan. U bir aylanishda besh marta o'ziga mos tushadi.",
      'A round rosette is built by turning a single petal. In one full turn it lands on itself five times.',
    ),
    prompt: b(
      'Чему равен наименьший угол поворота? Ответ в градусах.',
      'Eng kichik burish burchagi necha darajaga teng?',
      'What is the smallest angle of rotation, in degrees?',
    ),
    wrong: [b(
      'Полный оборот — 360 градусов. Его делят на число совпадений.',
      "Bir aylanish 360 daraja. Uni mos tushishlar soniga bo'lish kerak.",
      'A full turn is 360 degrees. Divide it by the number of matches.',
    )],
    secondHint: b(
      'Розетка ложится на себя пять раз, значит 360 делим на пять.',
      "Guldasta besh marta o'ziga mos tushadi, demak 360 ni beshga bo'lamiz.",
      'The rosette lands on itself five times, so divide 360 by five.',
    ),
    thirdHint: b('360 : 5 = 72.', '360 : 5 = 72.', '360 : 5 = 72.'),
    correctText: b(
      'Верно. 360 : 5 = 72. Каждые семьдесят два градуса розетка ложится на себя.',
      "To'g'ri. 360 : 5 = 72. Har yetmish ikki darajada guldasta o'ziga mos tushadi.",
      'Correct. 360 : 5 = 72. Every seventy-two degrees the rosette lands on itself.',
    ),
    rule: b(
      'Сколько раз фигура совпадает с собой за оборот, на столько и делят 360.',
      "Shakl bir aylanishda necha marta o'ziga mos tushsa, 360 shu songa bo'linadi.",
      'However many times a figure matches itself in one turn, 360 is divided by that number.',
    ),
  },

  {
    id: '05', level: 'yellow', kind: 'gap', skillTag: 'axis_position', correctGap: 4,
    visual: { type: 'strip', heights: [1, 2, 3, 4, 4, 3, 2, 1] },
    setup: b(
      'Лента узора собрана из восьми элементов. Станок не отметил, где проходит стык.',
      "Naqsh lentasi sakkiz elementdan yig'ilgan. Dastgoh chok qayerdan o'tishini belgilamagan.",
      'The pattern strip is made of eight elements. The cutter has not marked where the seam runs.',
    ),
    prompt: b(
      'Через какой промежуток проходит ось симметрии?',
      "Simmetriya o'qi qaysi bo'shliqdan o'tadi?",
      'Which gap does the axis of symmetry run through?',
    ),
    gapWrong: {
      1: b('Слева остался один элемент, справа семь. Ось делит ленту на две равные части.',
        "Chapda bitta, o'ngda yettita element qoldi. O'q lentani teng ikki qismga ajratadi.",
        'One element is left on the left and seven on the right. The axis splits the strip into two equal parts.'),
      2: b('Слева два элемента, справа шесть. Части пока не равны.',
        "Chapda ikkita, o'ngda oltita element qoldi. Qismlar hali teng emas.",
        'Two elements on the left and six on the right. The parts are not equal yet.'),
      3: b('Слева три элемента, справа пять. Промежуток нужно сдвинуть ещё правее.',
        "Chapda uchta, o'ngda beshta element qoldi. Bo'shliqni yana o'ngga surish kerak.",
        'Three elements on the left and five on the right. The gap has to move further to the right.'),
      5: b('Слева пять элементов, справа три. Промежуток ушёл на один вправо.',
        "Chapda beshta, o'ngda uchta element qoldi. Bo'shliq bir qadam o'ngga surilib ketgan.",
        'Five elements on the left and three on the right. The gap has moved one step too far right.'),
      6: b('Слева шесть элементов, справа два. Части не равны.',
        "Chapda oltita, o'ngda ikkita element qoldi. Qismlar teng emas.",
        'Six elements on the left and two on the right. The parts are not equal.'),
      7: b('Слева семь элементов, справа один. Ось не может стоять у самого края.',
        "Chapda yettita, o'ngda bitta element qoldi. O'q chetning o'zida turolmaydi.",
        'Seven elements on the left and one on the right. The axis cannot stand at the very edge.'),
    },
    secondHint: b(
      'Сосчитай элементы слева и справа и найди место, где их одинаково.',
      "Elementlarni chapdan va o'ngdan sanab, ikki tomonda teng bo'ladigan joyni toping.",
      'Count the elements on the left and on the right and find the place where they are equal.',
    ),
    thirdHint: b(
      'Восемь элементов делятся на четыре и четыре.',
      "Sakkiz element to'rt va to'rtga bo'linadi.",
      'Eight elements split into four and four.',
    ),
    correctText: b(
      'Верно. Слева четыре элемента и справа четыре: два самых высоких стоят у стыка.',
      "To'g'ri. Chapda to'rt element, o'ngda to'rt element: eng baland ikkitasi chokka tegib turadi.",
      'Correct. Four elements on the left and four on the right: the two tallest stand at the seam.',
    ),
    rule: b(
      'При чётном числе элементов ось проходит между двумя средними.',
      "Elementlar soni juft bo'lsa, o'q ikki o'rta element orasidan o'tadi.",
      'When the number of elements is even, the axis runs between the two middle ones.',
    ),
  },

  {
    id: '06', level: 'yellow', kind: 'mc', skillTag: 'axis_shared_count',
    visual: { type: 'halves' },
    setup: b(
      'Мастерская пересчитала одну половину панели: в ней четырнадцать элементов. Три из них стоят на самой оси симметрии и принадлежат обеим половинам.',
      "Ustaxona panelning bir yarmini sanab chiqdi: unda o'n to'rt element bor. Shundan uchtasi simmetriya o'qi ustida turadi va ikki yarimga birdek tegishli.",
      'The workshop has counted one half of the panel: it contains fourteen elements. Three of them stand on the axis of symmetry itself and belong to both halves.',
    ),
    prompt: b(
      'Сколько элементов будет во всей панели?',
      "Butun panelda nechta element bo'ladi?",
      'How many elements will there be in the whole panel?',
    ),
    options: [
      option('twenty-five', '25 элементов', '25 element', '25 elements', true),
      option('twenty-eight', '28 элементов', '28 element', '28 elements', false,
        'Три элемента на оси посчитаны дважды. В панели они стоят по одному разу.',
        "O'q ustidagi uchta element ikki marta sanalgan. Panelda ular bir marta turadi.",
        'The three elements on the axis have been counted twice. In the panel they stand once each.'),
      option('twenty-two', '22 элемента', '22 element', '22 elements', false,
        'Три элемента на оси тоже есть в панели, их пропустили.',
        "O'q ustidagi uchta element ham panelda bor, ular tashlab ketilgan.",
        'The three elements on the axis are part of the panel too; they have been left out.'),
      option('seventeen', '17 элементов', '17 element', '17 elements', false,
        'Вторая половина даёт не три, а одиннадцать новых элементов.',
        "Ikkinchi yarim uchta emas, o'n bitta yangi element beradi.",
        'The second half gives eleven new elements, not three.'),
    ],
    secondHint: b(
      'Сколько элементов стоит не на оси? Именно они удваиваются.',
      "O'q ustida turmagan elementlar nechta? Aynan ular ikkilanadi.",
      'How many elements are not on the axis? Those are the ones that double.',
    ),
    thirdHint: b(
      'Удваиваются 14 − 3 = 11 элементов, а три на оси остаются по одному разу: 11 + 11 + 3.',
      "14 − 3 = 11 element ikkilanadi, o'q ustidagi uchtasi bir marta qoladi: 11 + 11 + 3.",
      'The 14 − 3 = 11 elements double, and the three on the axis stay once: 11 + 11 + 3.',
    ),
    correctText: b(
      'Верно. 11 + 11 + 3 = 25 элементов.',
      "To'g'ri. 11 + 11 + 3 = 25 element.",
      'Correct. 11 + 11 + 3 = 25 elements.',
    ),
    rule: b(
      'Элемент на оси принадлежит обеим половинам и считается один раз.',
      "O'q ustida turgan element ikki yarimga tegishli va bir marta sanaladi.",
      'An element on the axis belongs to both halves and is counted once.',
    ),
  },

  {
    id: '07', level: 'yellow', kind: 'sort', skillTag: 'axis_count_sorting',
    setup: b(
      'Мастерская просит разобрать шесть фигур перед выбором узора.',
      "Ustaxona naqsh tanlashdan oldin olti shaklni saralashni so'radi.",
      'Before choosing a pattern the workshop asks for six figures to be sorted.',
    ),
    prompt: b(
      'Разложи фигуры по числу осей симметрии.',
      "Shakllarni simmetriya o'qlari soniga qarab guruhlarga joylashtiring.",
      'Sort the figures by the number of axes of symmetry.',
    ),
    bins: [
      { id: 'one', label: b('Одна ось', "Bitta o'q", 'One axis') },
      { id: 'many', label: b('Больше одной', "Bittadan ko'p", 'More than one') },
      { id: 'none', label: b('Осей нет', "O'q yo'q", 'No axes') },
    ],
    items: [
      { id: 'triangle', glyph: 'triangle', bin: 'one', text: b('Равнобедренный треугольник', 'Teng yonli uchburchak', 'Isosceles triangle') },
      { id: 'trapezoid', glyph: 'trapezoid', bin: 'one', text: b('Равнобедренная трапеция', 'Teng yonli trapetsiya', 'Isosceles trapezium') },
      { id: 'square', glyph: 'square', bin: 'many', text: b('Квадрат', 'Kvadrat', 'Square') },
      { id: 'rect', glyph: 'rect', bin: 'many', text: b('Прямоугольник', "To'g'ri to'rtburchak", 'Rectangle') },
      { id: 'parallelogram', glyph: 'parallelogram', bin: 'none', text: b('Параллелограмм', 'Parallelogramm', 'Parallelogram') },
      { id: 'fshape', glyph: 'fshape', bin: 'none', text: b('Фигура «F»', "«F» shakli", 'The letter F shape') },
    ],
    wrong: [b(
      'Согни каждую фигуру мысленно: линия становится осью только тогда, когда половины совпадают.',
      "Har shaklni buklab ko'ring: chiziq faqat yarimlar ustma-ust tushganda o'q bo'ladi.",
      'Fold each figure in your mind: a line becomes an axis only when the halves match.',
    )],
    secondHint: b(
      'Квадрат можно согнуть по четырём линиям, а прямоугольник — по двум.',
      "Kvadratni to'rt xil chiziq bo'ylab buklash mumkin, to'g'ri to'rtburchakni esa ikki xil.",
      'A square can be folded along four lines and a rectangle along two.',
    ),
    thirdHint: b(
      'У параллелограмма и фигуры «F» ни одна линия сгиба не совмещает половины.',
      "Parallelogramm va «F» shaklida hech qaysi buklash chizig'i yarimlarni moslamaydi.",
      'For the parallelogram and the F shape no fold line makes the halves match.',
    ),
    correctText: b(
      'Верно. У равнобедренных фигур одна ось, у квадрата и прямоугольника больше одной, у остальных осей нет.',
      "To'g'ri. Teng yonli shakllarda bitta o'q, kvadrat va to'g'ri to'rtburchakda bittadan ko'p, qolganlarida yo'q.",
      'Correct. The isosceles figures have one axis, the square and the rectangle have more than one, and the others have none.',
    ),
    rule: b(
      'У фигуры может быть несколько осей симметрии, а может не быть ни одной.',
      "Bir shaklda bir nechta simmetriya o'qi bo'lishi mumkin, bittasi ham bo'lmasligi mumkin.",
      'A figure may have several axes of symmetry, or none at all.',
    ),
  },

  {
    id: '08', level: 'red', kind: 'shade', skillTag: 'odd_axis_boundary',
    // Chegaraviy holat: o'q katak chizig'i bo'ylab emas, o'rtadagi ustun
    // ustidan o'tadi. O'q ustuni bosiladi (`-`), lekin bo'yalmaydi: chapda
    // unga mos katak yo'q.
    visual: {
      type: 'grid', cols: 7, rows: 3, axis: { dir: 'v', col: 3 },
      map: ['..#-+--', '.##-++-', '###-+++'],
    },
    setup: b(
      'В этой панели ось симметрии проходит не по линии клеток, а по среднему столбцу.',
      "Bu panelda simmetriya o'qi katak chizig'i bo'ylab emas, o'rtadagi ustun ustidan o'tadi.",
      'In this panel the axis of symmetry does not run along a cell line but through the middle column.',
    ),
    prompt: b(
      'Закрась справа клетки, которые отражают левую часть.',
      "O'ng tomonda chap qismni aks ettiradigan kataklarni bo'yang.",
      'Shade the cells on the right that reflect the left part.',
    ),
    wrongRules: [
      { when: 'axis', text: b(
        'Средний столбец стоит на самой оси: слева для него нет пары, поэтому он не удваивается.',
        "O'rtadagi ustun o'qning ustida turadi: chapda unga mos katak yo'q, shuning uchun u ikkilanmaydi.",
        'The middle column stands on the axis itself: it has no pair on the left, so it does not double.',
      ) },
      { when: 'count', text: b(
        'Справа должно быть столько же клеток, сколько закрашено слева.',
        "Chapda nechta katak bo'yalgan bo'lsa, o'ngda ham shuncha bo'lishi kerak.",
        'There must be as many cells on the right as are shaded on the left.',
      ) },
      { when: 'place', text: b(
        'Число клеток верное, а места нет: отсчитай расстояние от среднего столбца заново.',
        "Kataklar soni to'g'ri, lekin o'rni to'g'ri emas: masofani o'rtadagi ustundan qaytadan sanang.",
        'The number of cells is right but the places are not: count the distance from the middle column again.',
      ) },
    ],
    secondHint: b(
      'Средний столбец не считают: расстояние измеряют от него.',
      "O'rtadagi ustunni sanamaymiz: masofa shu ustundan o'lchanadi.",
      'The middle column is not counted: the distance is measured from it.',
    ),
    thirdHint: b(
      'В нижней строке слева три клетки, значит справа тоже три.',
      "Pastki qatorda chapda uchta katak bor, demak o'ngda ham uchta bo'ladi.",
      'In the bottom row there are three cells on the left, so there are three on the right too.',
    ),
    correctText: b(
      'Верно. Закрашено шесть клеток, а столбец на оси остался пустым.',
      "To'g'ri. Oltita katak bo'yaldi, o'q ustidagi ustun bo'sh qoldi.",
      'Correct. Six cells have been shaded and the column on the axis has stayed empty.',
    ),
    rule: b(
      'Если ось проходит по клеткам, этот столбец не удваивается.',
      "O'q kataklar ustidan o'tsa, o'sha ustun ikkilanmaydi.",
      'If the axis runs through cells, that column does not double.',
    ),
  },

  {
    id: '09', level: 'red', kind: 'match', skillTag: 'mirror_error',
    setup: b(
      'Bit попробовал четыре раза, и ни один узор не закрылся на стыке.',
      "Bit to'rt marta urinib ko'rdi, hech bir naqsh chokda yopilmadi.",
      'Bit tried four times and not one pattern closed at the seam.',
    ),
    prompt: b(
      'Соедини каждый результат с названием ошибки.',
      'Har natijani xato nomiga ulang.',
      'Match each result to the name of the error.',
    ),
    pairs: [
      { id: 'copy', glyph: 'copy', left: b('Листья смотрят в одну сторону', "Barglar bir tomonga qaragan", 'The leaves point the same way'), correctRight: 'not-mirror' },
      { id: 'far', glyph: 'far', left: b('Правая половина дальше от оси', "O'ng yarim o'qdan uzoqda", 'The right half is further from the axis'), correctRight: 'distance' },
      { id: 'turned', glyph: 'turned', left: b('Правая половина легла набок', "O'ng yarim yonboshlab tushgan", 'The right half has landed on its side'), correctRight: 'rotated' },
      { id: 'partial', glyph: 'partial', left: b('Перенесена только одна вершина', "Faqat bitta uch ko'chirilgan", 'Only one vertex has been carried over'), correctRight: 'unfinished' },
    ],
    right: [
      { id: 'not-mirror', text: b('Копия, а не зеркало', "Ko'zgu emas, nusxa", 'A copy, not a mirror') },
      { id: 'distance', text: b('Расстояние взято не равным', 'Masofa teng olinmagan', 'The distance is not equal') },
      { id: 'rotated', text: b('Вместо зеркала поворот', "Ko'zgu o'rniga burilgan", 'A turn instead of a mirror') },
      { id: 'unfinished', text: b('Перенесены не все вершины', "Hamma uch ko'chirilmagan", 'Not all the vertices were carried over') },
    ],
    wrong: [b(
      'Смотри, чем именно нарушен стык: направлением, расстоянием, поворотом или незаконченностью.',
      "Chok aynan nima bilan buzilganiga qarang: yo'nalish, masofa, burilish yoki tugallanmaganlik.",
      'Look at what exactly breaks the seam: direction, distance, a turn or being unfinished.',
    )],
    secondHint: b(
      'В копии листья смотрят в одну сторону, а при повороте их направление идёт по кругу.',
      "Nusxada barglar bir tomonga qaraydi, burilganda esa yo'nalish aylana bo'ylab o'zgaradi.",
      'In a copy the leaves point the same way, while after a turn their direction runs around a circle.',
    ),
    thirdHint: b(
      'При ошибке расстояния направление верное, только половина отодвинута от оси.',
      "Masofa xatosida yo'nalish to'g'ri, faqat yarim o'qdan siljitilgan.",
      'With a distance error the direction is right; only the half has been moved away from the axis.',
    ),
    correctText: b(
      'Верно. Четыре ошибки разные: направление, расстояние, поворот и незаконченность.',
      "To'g'ri. To'rt xato to'rt xil: yo'nalish, masofa, burilish va tugallanmaganlik.",
      'Correct. The four errors are different: direction, distance, a turn and being unfinished.',
    ),
    rule: b(
      'Проверку начинают с направления, затем сверяют расстояние.',
      "Tekshiruv yo'nalishdan boshlanadi, keyin masofa solishtiriladi.",
      'A check starts with the direction, and then the distance is compared.',
    ),
  },

  {
    id: '10', level: 'red', kind: 'sort', skillTag: 'rotational_transfer',
    setup: b(
      'Для пола станции выбрали шесть плиток. Теперь их проверяют поворотом, а не сгибом.',
      "Bekat poli uchun olti koshin tanlandi. Endi ular buklash bilan emas, burish bilan tekshiriladi.",
      'Six tiles have been chosen for the station floor. Now they are checked by turning, not by folding.',
    ),
    prompt: b(
      'Разложи плитки по наименьшему углу поворота.',
      'Koshinlarni eng kichik burish burchagiga qarab guruhlarga joylashtiring.',
      'Sort the tiles by their smallest angle of rotation.',
    ),
    bins: [
      { id: 'ninety', label: b('Совпадает при 90°', "90 darajada mos tushadi", 'Matches at 90°') },
      { id: 'oneeighty', label: b('Совпадает при 180°', "180 darajada mos tushadi", 'Matches at 180°') },
      { id: 'never', label: b('Поворотной симметрии нет', "Burish simmetriyasi yo'q", 'No rotational symmetry') },
    ],
    items: [
      { id: 'square', glyph: 'square', bin: 'ninety', text: b('Квадратная плитка', 'Kvadrat koshin', 'Square tile') },
      { id: 'rosette4', glyph: 'rosette4', bin: 'ninety', text: b('Узор из четырёх лепестков', "To'rt bargli naqsh", 'Four-petal pattern') },
      { id: 'rosette2', glyph: 'rosette2', bin: 'oneeighty', text: b('Узор из двух лепестков', 'Ikki bargli naqsh', 'Two-petal pattern') },
      { id: 'rect', glyph: 'rect', bin: 'oneeighty', text: b('Прямоугольная плитка', "To'g'ri to'rtburchak koshin", 'Rectangular tile') },
      { id: 'triangle', glyph: 'triangle', bin: 'never', text: b('Равнобедренная плитка', 'Teng yonli koshin', 'Isosceles tile') },
      { id: 'fshape', glyph: 'fshape', bin: 'never', text: b('Плитка «F»', "«F» koshin", 'The F tile') },
    ],
    wrong: [b(
      'Поверни плитку вокруг центра и найди наименьший угол, при котором узор ложится на себя.',
      "Koshinni markaz atrofida burib, naqsh o'ziga mos tushadigan eng kichik burchakni toping.",
      'Turn the tile about its centre and find the smallest angle at which the pattern lands on itself.',
    )],
    secondHint: b(
      'Если за оборот фигура совпадает четыре раза, это 360 : 4, а если два — 360 : 2.',
      "Bir aylanishda to'rt marta mos tushsa 360 : 4, ikki marta mos tushsa 360 : 2 bo'ladi.",
      'If a figure matches four times in a turn that is 360 : 4, and if twice, 360 : 2.',
    ),
    thirdHint: b(
      'Равнобедренная плитка и плитка «F» возвращаются к себе только после полного оборота.',
      "Teng yonli koshin va «F» koshin faqat to'liq aylanishdan keyin o'ziga qaytadi.",
      'The isosceles tile and the F tile return to themselves only after a full turn.',
    ),
    correctText: b(
      'Верно. Кто совпадает четыре раза — при 90°, кто два раза — при 180°.',
      "To'g'ri. To'rt marta mos tushganlar 90 darajada, ikki marta mos tushganlar 180 darajada qaytadi.",
      'Correct. Those that match four times do so at 90°, and those that match twice at 180°.',
    ),
    rule: b(
      'Поворотную симметрию проверяют не сгибом: фигуру поворачивают вокруг центра.',
      "Burish simmetriyasi buklash bilan tekshirilmaydi: shakl markaz atrofida buriladi.",
      'Rotational symmetry is not checked by folding: the figure is turned about its centre.',
    ),
  },
];

const shuffle = (items) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
};

const adaptive = (task, pickedOption, attempts, custom) => (
  attempts >= 3 ? task.thirdHint
    : attempts >= 2 ? task.secondHint
      : custom || pickedOption?.wrong || task.wrong?.[0] || task.secondHint
);

// Katak kartasidan indekslar: rasm va javob bitta manbadan chiqadi.
const cellsOf = (visual, chars) => {
  const found = [];
  visual.map.forEach((row, rowIndex) => {
    row.split('').forEach((char, colIndex) => {
      if (chars.includes(char)) found.push(rowIndex * visual.cols + colIndex);
    });
  });
  return found;
};

// ---------------------------------------------------------------------------
// MODELLAR
// ---------------------------------------------------------------------------

function GridFigure({ visual, selected = [], onToggle, disabled = false, resolved = false, hint = false, lang }) {
  const targets = cellsOf(visual, '+');
  const axis = visual.axis;
  const axisStyle = axis
    ? axis.col !== undefined
      ? { left: `${((axis.col + 0.5) / visual.cols) * 100}%` }
      : { left: `${(axis.gap / visual.cols) * 100}%` }
    : null;
  return (
    <div className={`p4-grid-wrap ${hint ? 'is-hint' : ''}`}>
      <div className="p4-grid" style={{ '--p4-cols': visual.cols }}>
        {visual.map.map((row, rowIndex) => row.split('').map((char, colIndex) => {
          const index = rowIndex * visual.cols + colIndex;
          const picked = selected.includes(index);
          const isTarget = targets.includes(index);
          const className = [
            'p4-cell',
            char === '#' ? 'is-given' : '',
            char === '*' ? 'is-marked' : '',
            char === '?' ? 'is-unknown' : '',
            picked ? (resolved && isTarget ? 'is-success' : 'is-picked') : '',
          ].filter(Boolean).join(' ');
          const tappable = onToggle && !disabled && (char === '+' || char === '-');
          return tappable
            ? (
              <button
                type="button"
                key={index}
                className={className}
                data-cell={`${rowIndex}-${colIndex}`}
                aria-pressed={picked}
                aria-label={`${tx(UI.cell, lang)} ${rowIndex + 1} ${colIndex + 1}`}
                onClick={() => onToggle(index)}
              />
            )
            : <span key={index} className={className} aria-hidden="true">{char === '?' ? '?' : ''}</span>;
        }))}
        {axisStyle && <span className="p4-grid-axis" style={axisStyle} aria-label={tx(UI.ticksAxis, lang)} />}
        {visual.perpRow !== undefined && (
          <span
            className="p4-grid-perp"
            style={{ top: `${((visual.perpRow + 0.5) / visual.rows) * 100}%` }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

function Rosette({ petals }) {
  const angle = 360 / petals;
  return (
    <svg className="p4-rosette" viewBox="0 0 120 120" role="img" aria-label={`${petals}`}>
      {Array.from({ length: petals }, (_, index) => (
        <ellipse
          key={index}
          cx="60" cy="30" rx="13" ry="27"
          fill={T.cyanSoft} stroke={T.cyan} strokeWidth="2.5"
          transform={`rotate(${index * angle} 60 60)`}
        />
      ))}
      <circle cx="60" cy="60" r="5" fill={T.accent} />
    </svg>
  );
}

function Halves() {
  return (
    <svg className="p4-halves" viewBox="0 0 220 110" role="img" aria-hidden="true">
      <rect x="8" y="12" width="94" height="86" rx="10" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="2.5" />
      {[24, 40, 56, 72, 88].map((y) => (
        <line key={y} x1="16" y1={y} x2="94" y2={y} stroke={T.cyan} strokeWidth="2" opacity="0.5" />
      ))}
      <rect x="118" y="12" width="94" height="86" rx="10" fill={T.paper} stroke={T.ink3} strokeWidth="2.5" strokeDasharray="6 5" />
      <text x="165" y="68" textAnchor="middle" fill={T.ink3} fontSize="34" fontFamily="'JetBrains Mono', monospace" fontWeight="800">?</text>
      <line x1="110" y1="4" x2="110" y2="106" stroke={T.accent} strokeWidth="3" strokeDasharray="8 6" />
    </svg>
  );
}

// Bo'shliq mexanikasi Dars01 kontraktini saqlaydi: `p4-gap` sinfi va raqamli
// aria-label. Raqamning ma'nosi guruh sarlavhasidan chiqadi.
function PatternStrip({ heights, picked, onPick, disabled, state, lang }) {
  const items = [];
  heights.forEach((height, index) => {
    items.push(
      <span key={`bar${index}`} className="p4-bar" style={{ height: `${16 + height * 11}px` }} aria-hidden="true" />,
    );
    if (index < heights.length - 1) {
      const gap = index + 1;
      const chosen = picked === gap;
      const className = ['p4-gap', chosen ? 'is-picked' : '', chosen && state ? `is-${state}` : ''].filter(Boolean).join(' ');
      items.push(
        <button
          type="button"
          key={`gap${gap}`}
          className={className}
          disabled={disabled}
          aria-label={String(gap)}
          aria-pressed={chosen}
          onClick={() => onPick(gap)}
        ><i /></button>,
      );
    }
  });
  return <div className="p4-strip" role="group" aria-label={tx(UI.gapHint, lang)}>{items}</div>;
}

// Shakl belgilari: saralash va moslashtirish kartalari o'z modelini tashiydi.
function ShapeGlyph({ kind }) {
  const stroke = { fill: T.cyanSoft, stroke: T.cyan, strokeWidth: 2.5 };
  const shapes = {
    triangle: <polygon points="22,6 40,38 4,38" {...stroke} />,
    trapezoid: <polygon points="13,8 31,8 40,36 4,36" {...stroke} />,
    square: <rect x="7" y="7" width="30" height="30" rx="3" {...stroke} />,
    rect: <rect x="3" y="12" width="38" height="20" rx="3" {...stroke} />,
    parallelogram: <polygon points="13,8 41,8 31,36 3,36" {...stroke} />,
    fshape: <path d="M12 6 H34 V14 H20 V19 H31 V27 H20 V38 H12 Z" {...stroke} />,
    rosette4: (
      <g>
        {[0, 90, 180, 270].map((angle) => (
          <ellipse key={angle} cx="22" cy="11" rx="6" ry="10" transform={`rotate(${angle} 22 22)`} {...stroke} />
        ))}
        <circle cx="22" cy="22" r="3" fill={T.accent} />
      </g>
    ),
    rosette2: (
      <g>
        {[0, 180].map((angle) => (
          <ellipse key={angle} cx="22" cy="11" rx="6" ry="10" transform={`rotate(${angle} 22 22)`} {...stroke} />
        ))}
        <circle cx="22" cy="22" r="3" fill={T.accent} />
      </g>
    ),
  };
  return <svg className="p4-glyph" viewBox="0 0 44 44" aria-hidden="true">{shapes[kind]}</svg>;
}

// Xato natija belgilari: chapda to'g'ri yarim, o'ngda Bit chizgani.
function MirrorGlyph({ kind }) {
  const leaf = (transform) => (
    <path d="M0 0 L11 -7 L11 7 Z" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="2" transform={transform} />
  );
  // Chapdagi barg har doim o'qqa qaraydi. O'ngdagisi xatoni ko'rsatadi:
  // `copy` — chapdagi bilan BIR TOMONGA qaragan (ko'zgu emas), `far` — to'g'ri
  // qaragan, lekin o'qdan uzoqda, `turned` — burilgan, `partial` — tugallanmagan.
  const right = {
    copy: leaf('translate(38 20) scale(-1 1)'),
    far: leaf('translate(58 20)'),
    turned: leaf('translate(38 20) rotate(90)'),
    partial: <circle cx="40" cy="20" r="3.5" fill={T.warnSoft} stroke={T.warn} strokeWidth="2" />,
  };
  return (
    <svg className="p4-glyph is-wide" viewBox="0 0 72 40" aria-hidden="true">
      {leaf('translate(22 20) scale(-1 1)')}
      <line x1="30" y1="4" x2="30" y2="36" stroke={T.accent} strokeWidth="2.5" strokeDasharray="5 4" />
      {right[kind]}
    </svg>
  );
}

function NumPad({ value, onChange, max, disabled, lang }) {
  return (
    <div className="p4-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}>
      <div className="p4-pad-display">{value || '—'}</div>
      <div className="p4-pad-keys">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
          <button type="button" key={digit} disabled={disabled} onClick={() => onChange(value.length >= max ? value : `${value}${digit}`)}>{digit}</button>
        ))}
        <button type="button" className="is-delete" disabled={disabled} aria-label={tx(UI.clear, lang)} onClick={() => onChange(value.slice(0, -1))}>⌫</button>
      </div>
    </div>
  );
}

function Feedback({ ok, text, rule, lang, feedbackRef }) {
  return (
    <div ref={feedbackRef} className={`p4-feedback ${ok ? 'is-ok' : 'is-no'}`} role="status" aria-live="polite">
      <p>{tx(text, lang)}</p>
      {ok && <p className="p4-rule"><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// BITTA TOPSHIRIQ
// ---------------------------------------------------------------------------

// `platform` berilganda tugma qatori chizilmaydi: uni LMS o'zi beradi va
// tekshiruvni `registerCheck` orqali chaqiradi (LMS kontrakti).
function Task({ task, lang, isLast, onSolved, shuffleSeed ,
  platform = false, mode, onReady, registerCheck, onSubmit, playCorrect, playWrong,
}) {
  const [pickedId, setPickedId] = useState(null);
  const [typed, setTyped] = useState('');
  const [gap, setGap] = useState(null);
  const [selected, setSelected] = useState([]);
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [placed, setPlaced] = useState({});
  const [activeStep, setActiveStep] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [activeToken, setActiveToken] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const checkingRef = useRef(false);
  const advancedRef = useRef(false);
  const feedbackRef = useRef(null);

  // Xato javobdan keyin variantlar qayta aralashadi (metodist qarori 2026-08-21).
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task keys intentionally trigger a fresh shuffle
  const options = useMemo(() => shuffle(task.options || []), [shuffleSeed, task.id, task.options, wrongRound]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task keys intentionally trigger a fresh shuffle
  const rightCards = useMemo(() => matchSpread(task.right, (card, row) => card.id === task.pairs[row]?.correctRight), [shuffleSeed, task.id, task.right]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task keys intentionally trigger a fresh shuffle
  const orderCards = useMemo(() => shuffle(task.cards || []), [shuffleSeed, task.id, task.cards]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task keys intentionally trigger a fresh shuffle
  const sortTokens = useMemo(() => shuffle(task.items || []), [shuffleSeed, task.id, task.items]);

  useEffect(() => {
    if (checked) window.setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
  }, [checked]);

  const targets = task.kind === 'shade' ? cellsOf(task.visual, '+') : [];
  const axisCells = task.kind === 'shade' && task.visual.axis?.col !== undefined
    ? cellsOf(task.visual, '-').filter((index) => index % task.visual.cols === task.visual.axis.col)
    : [];

  const answerReady = (() => {
    if (task.kind === 'mc') return pickedId !== null;
    if (task.kind === 'numpad') return typed.length > 0;
    if (task.kind === 'gap') return gap !== null;
    if (task.kind === 'shade') return selected.length > 0;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id]);
    if (task.kind === 'order') return task.steps.every((step) => placed[step.id]);
    return task.items.every((item) => assignments[item.id]);
  })();

  const answerCorrect = () => {
    if (task.kind === 'mc') return task.options.find((item) => item.id === pickedId)?.correct === true;
    if (task.kind === 'numpad') return typed === task.answer;
    if (task.kind === 'gap') return gap === task.correctGap;
    if (task.kind === 'shade') return selected.length === targets.length && targets.every((index) => selected.includes(index));
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    if (task.kind === 'order') return task.cards.every((card) => placed[task.steps[card.order].id] === card.id);
    return task.items.every((item) => assignments[item.id] === item.bin);
  };

  // Tahlil xato TURINI nomlaydi, javobni bermaydi.
  const customWrong = (() => {
    if (task.kind === 'gap') return task.gapWrong?.[gap];
    if (task.kind === 'shade') {
      const rules = task.wrongRules || [];
      const rule = selected.some((index) => axisCells.includes(index))
        ? rules.find((item) => item.when === 'axis')
        : selected.length !== targets.length
          ? rules.find((item) => item.when === 'count')
          : rules.find((item) => item.when === 'place');
      return rule?.text;
    }
    return null;
  })();

  const pickedOption = task.kind === 'mc' ? task.options.find((item) => item.id === pickedId) : null;
  const hintLevel = checked && !solved ? attempts : 0;

  const clearResponse = () => {
    checkingRef.current = false;
    setChecked(false); setPickedId(null); setTyped(''); setGap(null); setSelected([]);
    setPairs({}); setActiveLeft(null); setPlaced({}); setActiveStep(null);
    setAssignments({}); setActiveToken(null);
  };
  const setAnswer = (setter, value) => { checkingRef.current = false; setter(value); setChecked(false); };
  const check = () => {
    if (!answerReady || solved || checked || checkingRef.current) return;
    checkingRef.current = true;
    setAttempts((old) => old + 1);
    setChecked(true);
    if (answerCorrect()) setSolved(true); else setWrongRound((old) => old + 1);
  };

  const studentAnswer = (() => {
    if (task.kind === 'mc') return { optionId: pickedId, text: pickedOption?.text };
    if (task.kind === 'numpad') return { value: typed };
    if (task.kind === 'gap') return { gap };
    if (task.kind === 'shade') return { cells: [...selected].sort((a, c) => a - c) };
    if (task.kind === 'match') return { pairs };
    if (task.kind === 'order') return { order: task.steps.map((step) => placed[step.id]) };
    return { bins: assignments };
  })();

  const correctAnswer = (() => {
    if (task.kind === 'mc') {
      const item = task.options.find((candidate) => candidate.correct);
      return { optionId: item.id, text: item.text };
    }
    if (task.kind === 'numpad') return { value: task.answer };
    if (task.kind === 'gap') return { gap: task.correctGap };
    if (task.kind === 'shade') return { cells: targets };
    if (task.kind === 'match') return { pairs: Object.fromEntries(task.pairs.map((pair) => [pair.id, pair.correctRight])) };
    if (task.kind === 'order') return { order: task.cards.slice().sort((a, c) => a.order - c.order).map((card) => card.id) };
    return { bins: Object.fromEntries(task.items.map((item) => [item.id, item.bin])) };
  })();

  const firstSortWrong = task.kind === 'sort' && checked && !solved
    ? task.items.find((item) => assignments[item.id] && assignments[item.id] !== item.bin)?.id
    : null;

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
    <section className={`p4-task ${hintLevel >= 2 ? 'is-hint' : ''}`} aria-labelledby={`task-${task.id}`}>
      <p className="p4-eyebrow"><span>{tx(UI.level[task.level], lang)}</span> · {tx(UI.task, lang)} {Number(task.id)}</p>
      <p className="p4-setup">{tx(task.setup, lang)}</p>

      {task.visual?.type === 'grid' && task.kind !== 'shade' && (
        <div className="p4-visual"><GridFigure visual={task.visual} hint={hintLevel >= 2} lang={lang} /></div>
      )}
      {task.visual?.type === 'rosette' && <div className="p4-visual"><Rosette petals={task.visual.petals} /></div>}
      {task.visual?.type === 'halves' && <div className="p4-visual"><Halves /></div>}

      <h2 id={`task-${task.id}`} className="p4-ask">{tx(task.prompt, lang)}</h2>

      {task.kind === 'mc' && (
        <div className="p4-options">
          {options.map((item, index) => (
            <button
              type="button"
              key={item.id}
              disabled={solved}
              aria-pressed={pickedId === item.id}
              className={`p4-option ${pickedId === item.id ? (checked ? (item.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`}
              onClick={() => setAnswer(setPickedId, item.id)}
            >
              <span className="p4-letter">{'ABCD'[index]}</span>
              <span>{tx(item.text, lang)}</span>
            </button>
          ))}
        </div>
      )}

      {task.kind === 'numpad' && (
        <NumPad value={typed} onChange={(value) => setAnswer(setTyped, value)} max={task.maxLen || 4} disabled={solved} lang={lang} />
      )}

      {task.kind === 'gap' && (
        <div className="p4-visual is-strip">
          <PatternStrip
            heights={task.visual.heights}
            picked={gap}
            onPick={(value) => setAnswer(setGap, value)}
            disabled={solved}
            state={checked ? (gap === task.correctGap ? 'ok' : 'no') : null}
            lang={lang}
          />
          <p className="p4-note">{tx(UI.gapHint, lang)}</p>
        </div>
      )}

      {task.kind === 'shade' && (
        <div className="p4-visual">
          <GridFigure
            visual={task.visual}
            selected={selected}
            onToggle={(index) => setAnswer(setSelected, selected.includes(index) ? selected.filter((value) => value !== index) : [...selected, index])}
            disabled={solved}
            resolved={solved}
            hint={hintLevel >= 2}
            lang={lang}
          />
          <p className="p4-note">{tx(UI.shadeHint, lang)}</p>
        </div>
      )}

      {task.kind === 'match' && (
        <div className="p4-match">
          <p className="p4-note">{tx(UI.matchHint, lang)}</p>
          <div className="p4-match-cols">
            <div className="p4-match-col">
              {task.pairs.map((pair) => (
                <button
                  type="button"
                  key={pair.id}
                  disabled={solved}
                  aria-pressed={activeLeft === pair.id}
                  className={`p4-match-item ${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''}${matchToneLeft(task, pairs, pair.id)}`}
                  onClick={() => { checkingRef.current = false; setActiveLeft(pair.id); setChecked(false); }}
                >
                  {pair.glyph && <MirrorGlyph kind={pair.glyph} />}
                  <span>{tx(pair.left, lang)}</span>
                  {pairs[pair.id] && <b>{tx(task.right.find((item) => item.id === pairs[pair.id])?.text, lang)}</b>}
                </button>
              ))}
            </div>
            <div className="p4-match-col">
              {rightCards.map((item) => {
                const used = Object.values(pairs).includes(item.id);
                return (
                  <button
                    type="button"
                    key={item.id}
                    disabled={solved || activeLeft === null}
                    className={`p4-match-item ${used ? 'is-used' : ''}${matchToneRight(task, pairs, item.id)}`}
                    onClick={() => {
                      checkingRef.current = false;
                      setPairs((old) => matchTie(old, activeLeft, item.id));
                      setActiveLeft(null);
                      setChecked(false);
                    }}
                  >{tx(item.text, lang)}</button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {task.kind === 'order' && (
        <div className="p4-order">
          <p className="p4-note">{tx(UI.orderHint, lang)}</p>
          <div className="p4-order-slots">
            {task.steps.map((step) => (
              <button
                type="button"
                key={step.id}
                disabled={solved}
                aria-pressed={activeStep === step.id}
                className={`p4-order-slot ${activeStep === step.id ? 'is-active' : ''}`}
                onClick={() => { checkingRef.current = false; setActiveStep(step.id); setChecked(false); }}
              >
                <small>{tx(step.label, lang)}</small>
                <b>{placed[step.id] ? tx(task.cards.find((card) => card.id === placed[step.id])?.text, lang) : '—'}</b>
              </button>
            ))}
          </div>
          <div className="p4-card-bank">
            {orderCards.map((card) => {
              const used = Object.values(placed).includes(card.id);
              return (
                <button
                  type="button"
                  key={card.id}
                  disabled={solved || activeStep === null || used}
                  className={`p4-card ${used ? 'is-used' : ''}`}
                  onClick={() => {
                    checkingRef.current = false;
                    setPlaced((old) => ({ ...old, [activeStep]: card.id }));
                    setActiveStep(null);
                    setChecked(false);
                  }}
                >{tx(card.text, lang)}</button>
              );
            })}
          </div>
        </div>
      )}

      {task.kind === 'sort' && (
        <div className="p4-sort">
          <p className="p4-note">{tx(UI.sortHint, lang)}</p>
          <div className="p4-sort-pool">
            {sortTokens.filter((item) => !assignments[item.id]).map((item) => (
              <button
                type="button"
                key={item.id}
                disabled={solved}
                aria-pressed={activeToken === item.id}
                className={`p4-sort-token ${activeToken === item.id ? 'is-active' : ''}`}
                onClick={() => { checkingRef.current = false; setActiveToken(item.id); setChecked(false); }}
              >
                <ShapeGlyph kind={item.glyph} />
                <span>{tx(item.text, lang)}</span>
              </button>
            ))}
            {sortTokens.every((item) => assignments[item.id]) && <span className="p4-pool-done">✓</span>}
          </div>
          <div className="p4-sort-bins">
            {task.bins.map((bin) => (
              <div className="p4-sort-bin" key={bin.id}>
                <button
                  type="button"
                  className="p4-sort-bin-head"
                  disabled={solved || activeToken === null}
                  onClick={() => {
                    if (activeToken === null) return;
                    checkingRef.current = false;
                    setAssignments((old) => ({ ...old, [activeToken]: bin.id }));
                    setActiveToken(null);
                    setChecked(false);
                  }}
                >{tx(bin.label, lang)}</button>
                <div className="p4-sort-bin-items">
                  {sortTokens.filter((item) => assignments[item.id] === bin.id).map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      disabled={solved}
                      className={`p4-sort-token is-placed ${firstSortWrong === item.id ? 'is-no' : ''}`}
                      aria-label={`${tx(UI.returnCard, lang)} ${tx(item.text, lang)}`}
                      onClick={() => {
                        checkingRef.current = false;
                        setAssignments((old) => {
                          const next = { ...old };
                          delete next[item.id];
                          return next;
                        });
                        setActiveToken(item.id);
                        setChecked(false);
                      }}
                    >
                      <ShapeGlyph kind={item.glyph} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {checked && (
        <Feedback
          feedbackRef={feedbackRef}
          ok={solved}
          text={solved ? task.correctText : adaptive(task, pickedOption, attempts, customWrong)}
          rule={task.rule}
          lang={lang}
        />
      )}

      {!platform && <div className="p4-actions">
        {!checked && !solved && (
          <button type="button" className="p4-btn" disabled={!answerReady} onClick={check}>{tx(UI.check, lang)}</button>
        )}
        {checked && !solved && (
          <button type="button" className="p4-btn p4-btn-ghost" onClick={clearResponse}>{tx(UI.retry, lang)}</button>
        )}
        {solved && (
          <button
            type="button"
            className="p4-btn p4-btn-ready"
            disabled={advancing}
            onClick={() => {
              if (advancedRef.current) return;
              advancedRef.current = true;
              checkingRef.current = false;
              setAdvancing(true);
              onSolved({
                taskId: task.id, taskNumber: Number(task.id), level: task.level, kind: task.kind,
                skillTag: task.skillTag, attempts, firstTry: attempts === 1, correct: true,
                setup: task.setup, prompt: task.prompt, studentAnswer, correctAnswer,
                answerChoices: task.kind === 'mc'
                  ? options.map(({ id, text, correct }) => ({ id, text, correct: Boolean(correct) }))
                  : task.right ?? task.cards ?? task.items ?? null,
                screenMeta: SCREEN_META.find((screen) => screen.taskId === task.id),
              });
            }}
          >{tx(isLast ? UI.finish : UI.next, lang)}</button>
        )}
      </div>}
    </section>
  );
}

// ---------------------------------------------------------------------------
// HOST
// ---------------------------------------------------------------------------

export default function Grade4Dars41Practice({ studentName, lang: langProp, onFinished }) {
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
  const percent = Math.round(((finished ? 10 : index) / 10) * 100);

  const onSolved = (record) => {
    const nextAnswers = [...answers, record];
    const nextFirstTry = firstTry + (record.firstTry ? 1 : 0);
    setAnswers(nextAnswers);
    setFirstTry(nextFirstTry);
    if (index !== 9) { setIndex((old) => old + 1); return; }
    if (finishedRef.current) return;
    finishedRef.current = true;
    setFinished(true);
    const scorePercent = Math.round((nextFirstTry / 10) * 100);
    const levelBreakdown = ['green', 'yellow', 'red'].reduce((result, level) => ({
      ...result,
      [level]: {
        total: TASKS.filter((item) => item.level === level).length,
        firstTry: nextAnswers.filter((item) => item.level === level && item.firstTry).length,
      },
    }), {});
    onFinished?.({
      lessonId: LESSON_META.lessonId, lessonTitle: tx(LESSON_META.lessonTitle, lang),
      lessonTitleLocalized: LESSON_META.lessonTitle, studentName: studentName || null,
      activityType: 'practice', completed: true, totalQuestions: 10, answeredQuestions: 10,
      correctAnswers: nextFirstTry, firstTryCorrect: nextFirstTry, scorePercent,
      finalScore: nextFirstTry, finalTotal: 10, passed: nextFirstTry >= 6,
      firstTryStats: { total: 10, firstTryCorrect: nextFirstTry, correct: nextFirstTry, answered: 10, scorePercent },
      attemptsTotal: nextAnswers.reduce((sum, item) => sum + item.attempts, 0),
      // eslint-disable-next-line react-hooks/purity -- duration is captured when the lesson finishes
      durationSec: startedAtRef.current ? Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000)) : 0,
      skillTags: [...new Set(TASKS.map((item) => item.skillTag))],
      levelBreakdown, lessonMeta: LESSON_META, screenMeta: SCREEN_META, answers: nextAnswers,
    });
  };

  const restart = () => {
    finishedRef.current = false;
    startedAtRef.current = Date.now();
    setIndex(0); setAnswers([]); setFirstTry(0); setFinished(false); setRunId((old) => old + 1);
  };

  return (
    <div className="p4-root">
      <style>{STYLES}</style>
      {preview && (
        <div className="p4-lang" role="group" aria-label={tx(UI.language, lang)}>
          {SUPPORTED_LANGS.map((code) => (
            <button type="button" key={code} aria-pressed={lang === code} className={lang === code ? 'is-active' : ''} onClick={() => setPreviewLang(code)}>
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      )}
      <header className="p4-head">
        <div className="p4-progress" role="progressbar" aria-label={tx(UI.title, lang)} aria-valuemin="0" aria-valuemax="10" aria-valuenow={finished ? 10 : index}>
          <div className="p4-progress-bar" style={{ width: `${percent}%` }} />
        </div>
        <div className="p4-head-row">
          <span className="p4-title">{tx(UI.title, lang)}</span>
          <span className="p4-counter">{finished ? 10 : index + 1} / 10</span>
        </div>
      </header>
      <main className="p4-main">
        {finished ? (
          <section className="p4-done" aria-live="polite">
            <h2>{tx(UI.done, lang)}</h2>
            <p className="p4-score"><b>{firstTry}</b><span>/ 10</span></p>
            <p className="p4-note">{tx(UI.firstTry, lang)}</p>
            <p className="p4-complete">{tx(UI.allSolved, lang)}</p>
            <button type="button" className="p4-btn p4-btn-ready" onClick={restart}>{tx(UI.again, lang)}</button>
          </section>
        ) : (
          <Task
            key={`${runId}-${task.id}`}
            task={task}
            lang={lang}
            isLast={index === 9}
            onSolved={onSolved}
            shuffleSeed={`${LESSON_META.lessonId}:${runId}`}
          />
        )}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// USLUBLAR — fayl ichida: LMS ga alohida .css bormaydi.
// ---------------------------------------------------------------------------
const STYLES = `
.p4-root{position:relative;display:flex;flex-direction:column;min-height:100dvh;overflow-x:clip;padding:0 0 22px;font-family:'Manrope',system-ui,sans-serif;color:${T.ink};background:${T.bg}}
.p4-root *,.p4-root *::before,.p4-root *::after{box-sizing:border-box}
.p4-root h2,.p4-root p{margin:0}
.p4-root button:focus-visible{outline:3px solid rgba(22,143,163,.45);outline-offset:3px}
.p4-lang{position:absolute;top:8px;right:8px;z-index:9;display:flex;gap:6px}
.p4-lang button{min-width:44px;min-height:44px;padding:0 10px;border:0;border-radius:99px;background:${T.paper};color:${T.ink2};font:800 11px 'Manrope',sans-serif;cursor:pointer;box-shadow:0 4px 12px -8px rgba(23,59,82,.4)}
.p4-lang button.is-active{background:${T.accent};color:#fff}
.p4-head{padding:46px clamp(12px,4vw,24px) 8px}
.p4-progress,.p4-head-row,.p4-main{width:min(720px,100%);margin-inline:auto}
.p4-progress{height:6px;border-radius:99px;background:rgba(23,59,82,.12);overflow:hidden}
.p4-progress-bar{height:100%;background:linear-gradient(90deg,${T.cyan},${T.accent});transition:width .4s ease}
.p4-head-row{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-top:8px}
.p4-title{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(15px,2.4vw,19px)}
.p4-counter{white-space:nowrap;font:700 13px 'JetBrains Mono',monospace;color:${T.ink3}}
.p4-main{flex:1;padding:4px clamp(12px,4vw,24px)}
.p4-task{display:flex;flex-direction:column;gap:11px}
.p4-eyebrow{color:${T.accent};font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
.p4-setup{color:${T.ink2};font-size:clamp(14px,2vw,16px);line-height:1.5}
.p4-ask{font:600 clamp(17px,2.6vw,21px)/1.25 'Source Serif 4',Georgia,serif;color:${T.ink}}
.p4-note{color:${T.ink3};font-size:13px;line-height:1.4}
.p4-visual{display:flex;flex-direction:column;align-items:center;gap:8px;width:100%;min-height:118px;padding:14px 10px;border-radius:16px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08);overflow:hidden}
.p4-visual.is-strip{padding:10px}
/* Katak o'lchami ustunlar sonidan chiqadi va yuqoridan cheklangan: aspect-ratio
   bilan kenglikka moslashtirilganda 6 qatorli panjara 470 px balandlikka
   chiqib, ekranda vertikal skroll paydo bo'ldi. */
.p4-grid-wrap{display:flex;justify-content:center;width:100%}
.p4-grid-wrap.is-hint{outline:3px solid rgba(255,91,53,.2);outline-offset:5px;border-radius:8px}
.p4-grid{position:relative;display:grid;gap:3px;--p4-cell:clamp(22px,calc((min(100vw,660px) - 64px) / var(--p4-cols)),42px);grid-template-columns:repeat(var(--p4-cols),var(--p4-cell))}
.p4-cell{position:relative;width:var(--p4-cell);height:var(--p4-cell);min-width:0;padding:0;border:0;border-radius:6px;background:${T.cyanSoft};box-shadow:inset 0 0 0 1px rgba(22,143,163,.18);font:800 16px 'JetBrains Mono',monospace;color:${T.ink3};display:grid;place-items:center}
.p4-grid button.p4-cell{cursor:pointer;background:#FBFBF8;box-shadow:inset 0 0 0 1px rgba(23,59,82,.14)}
.p4-grid button.p4-cell:hover:not(:disabled){box-shadow:inset 0 0 0 2px rgba(22,143,163,.45)}
.p4-cell.is-given{background:${T.cyan};box-shadow:none;animation:p4-cell-in .3s both}
.p4-cell.is-marked{background:${T.accent};box-shadow:none}
.p4-cell.is-unknown{background:${T.paper};box-shadow:inset 0 0 0 2px rgba(23,59,82,.18)}
/* Holat qoidalari button elementiga bog'lanmaydi: topshiriq yechilgandan keyin
   katak span ga aylanadi va bolaning bo'yagan ishi ekranda qolishi kerak. */
.p4-grid .p4-cell.is-picked{background:${T.accent};box-shadow:none}
.p4-grid .p4-cell.is-success{background:${T.success};box-shadow:none}
.p4-grid-axis{position:absolute;top:-7px;bottom:-7px;width:0;border-left:3px dashed ${T.accent};transform:translateX(-1.5px);pointer-events:none}
.p4-grid-perp{position:absolute;left:16%;width:34%;height:0;border-top:2px dashed ${T.ink3};pointer-events:none}
/* Guldasta va panel sxemasi balandlikka bog'lanadi: kenglik bo'yicha
   o'lchanganda ular past ekranda joyni yeb, vertikal skroll bergan. */
.p4-rosette{width:auto;height:clamp(88px,15vh,126px)}
.p4-halves{width:min(100%,300px);height:auto}
.p4-strip{display:flex;align-items:flex-end;justify-content:center;width:100%}
.p4-bar{display:block;width:clamp(16px,5vw,26px);border-radius:5px 5px 2px 2px;background:linear-gradient(180deg,${T.cyanSoft},${T.cyan});box-shadow:inset 0 0 0 1px rgba(22,143,163,.3)}
.p4-gap{display:inline-flex;align-items:flex-end;justify-content:center;width:clamp(14px,4vw,22px);min-width:14px;min-height:44px;padding:0;border:0;background:transparent;cursor:pointer}
.p4-gap i{display:block;width:3px;height:34px;border-radius:2px;background:rgba(23,59,82,.14);transition:background .2s,height .2s}
.p4-gap:hover:not(:disabled) i{background:rgba(22,143,163,.5)}
.p4-gap.is-picked i{height:74px;background:${T.accent}}
.p4-gap.is-ok i{background:${T.success}}
.p4-gap.is-no i{background:${T.warn}}
.p4-glyph{width:34px;height:34px;flex:0 0 auto}
.p4-glyph.is-wide{width:56px;height:31px}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.p4-option{display:flex;align-items:center;gap:9px;min-width:44px;min-height:56px;padding:10px 12px;text-align:left;border:1px solid rgba(23,59,82,.12);border-radius:14px;background:${T.paper};color:${T.ink};font:700 clamp(13px,1.9vw,15px)/1.35 'Manrope',sans-serif;cursor:pointer;transition:transform .16s,border-color .2s,background .2s}
.p4-option:hover:not(:disabled){border-color:rgba(22,143,163,.4);transform:translateY(-2px)}
.p4-letter{flex:0 0 26px;width:26px;height:26px;border-radius:8px;display:grid;place-items:center;background:${T.cyanSoft};color:${T.cyan};font:800 11px 'JetBrains Mono',monospace}
.p4-option.is-on{border-color:${T.accent};background:${T.accentSoft}}
.p4-option.is-ok{border-color:rgba(34,122,83,.4);background:${T.successSoft};color:${T.success}}
.p4-option.is-ok .p4-letter{background:${T.success};color:#fff}
.p4-option.is-no{border-color:rgba(169,111,19,.4);background:${T.warnSoft};color:${T.warn}}
.p4-option.is-no .p4-letter{background:${T.warn};color:#fff}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:8px;width:min(240px,100%);margin:0 auto;padding:12px;border-radius:18px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8);box-shadow:inset 0 1px rgba(255,255,255,.9)}
.p4-pad-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:50px;border:2px solid ${T.accent};border-radius:13px;background:${T.paper};color:${T.navy};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;letter-spacing:2px}
.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:100%}
.p4-pad-keys button{min-width:44px;min-height:44px;border:1px solid rgba(23,59,82,.16);border-radius:12px;background:${T.paper};color:${T.navy};font:800 clamp(18px,3.6vw,22px) 'JetBrains Mono',monospace;cursor:pointer}
.p4-pad-keys button:hover:not(:disabled){border-color:${T.cyan}}
.p4-pad-keys .is-delete{background:${T.accentSoft};color:${T.accent}}
.p4-match-cols{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:7px}
.p4-match-col{display:grid;gap:8px;align-content:start}
.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-width:44px;min-height:48px;padding:8px 9px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:700 clamp(12px,2vw,14px)/1.3 'Manrope',sans-serif;text-align:center;cursor:pointer}
.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-match-item.is-tied{border-color:rgba(34,122,83,.35)}
.p4-match-item.is-used{background:${T.successSoft};opacity:.65}
.p4-match-item:disabled{cursor:default}
.p4-match-item b{color:${T.success};font-size:12px}
.p4-order-slots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:7px}
.p4-order-slot{display:grid;place-items:center;gap:4px;min-width:44px;min-height:74px;padding:7px;border:1px solid rgba(23,59,82,.12);border-radius:13px;background:${T.paper};color:${T.ink2};font-family:inherit;cursor:pointer}
.p4-order-slot.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-order-slot small{font-weight:800}
.p4-order-slot b{font:700 11px/1.25 'Manrope',sans-serif;color:${T.navy}}
.p4-card-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-top:8px}
.p4-card{min-width:44px;min-height:46px;padding:8px 11px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:700 12px/1.3 'Manrope',sans-serif;cursor:pointer}
.p4-card.is-used{background:${T.cyanSoft};opacity:.7}
.p4-sort{display:flex;flex-direction:column;gap:10px}
.p4-sort-pool{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;min-height:64px;padding:8px;border-radius:14px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}
.p4-pool-done{color:${T.success};font-size:26px}
.p4-sort-token{display:flex;align-items:center;gap:7px;min-width:44px;min-height:44px;padding:6px 10px;border:1px solid rgba(23,59,82,.14);border-radius:12px;background:${T.paper};color:${T.navy};font:700 12px/1.25 'Manrope',sans-serif;cursor:pointer}
.p4-sort-token.is-active{border-color:${T.accent};background:${T.accentSoft};transform:translateY(-2px)}
.p4-sort-token.is-placed{padding:5px}
.p4-sort-token.is-no{border-color:${T.warn};background:${T.warnSoft}}
.p4-sort-bins{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}
.p4-sort-bin{min-height:120px;padding:8px;border-radius:14px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}
.p4-sort-bin-head{width:100%;min-width:44px;min-height:44px;padding:8px 6px;border:0;border-radius:10px;background:${T.cyanSoft};color:${T.cyan};font:800 12px/1.25 'Manrope',sans-serif;cursor:pointer}
.p4-sort-bin-head:disabled{cursor:default;opacity:.78}
.p4-sort-bin-items{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:6px;padding-top:8px}
.p4-feedback{padding:12px 14px;border-radius:14px;line-height:1.45;animation:p4-result .22s ease both}
.p4-feedback.is-ok{background:${T.successSoft};color:#1B6644;box-shadow:inset 4px 0 0 ${T.success}}
.p4-feedback.is-no{background:${T.warnSoft};color:#8A5C10;box-shadow:inset 4px 0 0 ${T.warn}}
.p4-feedback p{font-family:'Source Serif 4',Georgia,serif;font-size:clamp(14px,2.1vw,16px)}
.p4-rule{margin-top:6px!important;color:${T.ink2}}
.p4-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px}
.p4-btn{min-width:44px;min-height:46px;padding:10px 22px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font:800 14px 'Manrope',sans-serif;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5),inset 0 0 0 1px rgba(255,91,53,.2)}
.p4-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}
.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}
.p4-btn-ready{background:${T.accent};color:#fff}
.p4-done{display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 12px;text-align:center}
.p4-done h2{font:600 clamp(19px,3vw,24px) 'Source Serif 4',Georgia,serif}
.p4-score{display:flex;align-items:baseline;gap:5px;font-family:'JetBrains Mono',monospace}
.p4-score b{color:${T.success};font-size:clamp(32px,7vw,44px)}
.p4-score span{color:${T.ink3};font-size:15px}
.p4-complete{color:${T.ink2}}
@keyframes p4-cell-in{from{opacity:.4;transform:scale(.92)}to{opacity:1;transform:none}}
@keyframes p4-result{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
/* Yuqoridan 64 px: platformaning o'z til paneli (y 8..60) sarlavha bilan
   ustma-ust tushmasligi kerak — compact-mobile da aynan shu bo'lgan. */
@media(max-width:520px){
  .p4-options{grid-template-columns:1fr}
  .p4-order-slots{grid-template-columns:repeat(2,minmax(0,1fr))}
  .p4-order-slot{min-height:60px;padding:6px}
  /* Uchta guruh bir ustunda joylashsa blok cho'zilib ketadi: guruh sarlavhasi
     va kartalar bir qatorda turadi, balandlik uch baravar kamayadi. */
  .p4-sort-bins{grid-template-columns:1fr;gap:6px}
  .p4-sort-bin{display:flex;align-items:center;gap:8px;min-height:56px;padding:6px}
  .p4-sort-bin-head{flex:0 0 40%;min-height:44px;padding:6px 4px;font-size:11px}
  .p4-sort-bin-items{flex:1;justify-content:flex-start;padding-top:0}
  .p4-sort-pool{min-height:56px;gap:6px}
  .p4-main{padding:4px 8px}
  .p4-head{padding:64px 8px 6px}
  .p4-visual{padding:10px 6px;min-height:104px}
  .p4-task{gap:8px}
  .p4-grid{--p4-cell:clamp(20px,calc((100vw - 48px) / var(--p4-cols)),32px)}
}
@media(max-width:640px) and (max-height:700px){
  .p4-head{padding:64px 8px 3px!important}
  .p4-grid{--p4-cell:clamp(18px,calc((100vw - 48px) / var(--p4-cols)),30px)!important}
  .p4-task{gap:6px!important}
  .p4-setup{font-size:12.5px;line-height:1.35}
  .p4-ask{font-size:16px!important}
  .p4-visual{min-height:82px!important;padding:8px 6px!important}
  .p4-options{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:6px!important}
  .p4-option{min-height:46px!important;padding:6px 8px!important;font-size:12px!important}
  .p4-btn{min-height:44px!important;padding:8px 16px}
  .p4-feedback{padding:9px 11px}
}
@media(prefers-reduced-motion:reduce){
  .p4-root *,.p4-root *::before,.p4-root *::after{scroll-behavior:auto!important;animation:none!important;transition:none!important}
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
.p4-match .p4-tone2,.g4p-match .p4-tone2{background:#E9E4F7!important;border-color:#5E45AD!important;box-shadow:inset 0 0 0 2px #5E45AD!important;color:#3E2E75!important}
.p4-match .p4-tone2::before,.g4p-match .p4-tone2::before{content:"■";color:#5E45AD}
.p4-match .p4-tone3,.g4p-match .p4-tone3{background:#FBE2EA!important;border-color:#AE3760!important;box-shadow:inset 0 0 0 2px #AE3760!important;color:#77223F!important}
.p4-match .p4-tone3::before,.g4p-match .p4-tone3::before{content:"◆";color:#AE3760}
.p4-match .p4-tone4,.g4p-match .p4-tone4{background:#E2E8F0!important;border-color:#3C5A80!important;box-shadow:inset 0 0 0 2px #3C5A80!important;color:#27405C!important}
.p4-match .p4-tone4::before,.g4p-match .p4-tone4::before{content:"★";color:#3C5A80}
.p4-match .p4-tone5,.g4p-match .p4-tone5{background:#EFE6DA!important;border-color:#6B4A2B!important;box-shadow:inset 0 0 0 2px #6B4A2B!important;color:#4A3219!important}
.p4-match .p4-tone5::before,.g4p-match .p4-tone5::before{content:"▲";color:#6B4A2B}
.p4-match .p4-tone6,.g4p-match .p4-tone6{background:#FBEBCB!important;border-color:#A2690F!important;box-shadow:inset 0 0 0 2px #A2690F!important;color:#6E4708!important}
.p4-match .p4-tone6::before,.g4p-match .p4-tone6::before{content:"✚";color:#A2690F}
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
