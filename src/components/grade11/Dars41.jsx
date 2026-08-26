// ============================================================================
// 11-sinf, Dars 41. FAZODA ALMASHTIRISHLAR VA O'XSHASHLIK.
//
// B5 blokining OXIRGI darsi -- blok shu bilan yopiladi.
//   kontrakt: src/books/grade11/ETALON_11SINF.md
//   asbob:    `SpaceFrame`, `map` rejimi
//   darslik:  1-qism, 133-139-betlar (3-bo'lim to'liq), 83-114 masalalar
//
// METODIST QARORI 2026-08-20: darslikning 3-bo'limi (o'n bet, yetti kichik
// bo'lim) BITTA darsga yig'iladi. Shuning uchun: 1-qoida hamma
// HARAKATLARni bitta koordinata jadvaliga yig'adi, 2-qoida esa
// O'XSHASHLIK va gomotetiyani beradi. Burish faqat kadrda ko'rsatiladi,
// masalalarga kirmaydi -- aks holda dars ikkiga bo'linardi.
//
// DARSNING BITTA GAPI: harakat masofani saqlaydi, o'xshashlik esa faqat
// SHAKLNI saqlaydi. Gomotetiya k noldan va bir dan farqli bo'lsa, harakat
// EMAS.
//
// SONLAR TEKSHIRILDI:
//   1-masala (134-bet): P(−2; 4; 6) + p(3; 2; 5) = (1; 6; 11)
//   2-masala (135-bet): A(1; 2; 3), markaz O(2; 4; 6) -> (3; 6; 9)
//   Oxy ga nisbatan (1; 2; 3) -> (1; 2; −3)
//   gomotetiya k = 2, markaz boshda: (1; 2; 3) -> (2; 4; 6)
//   111-masala: A(2; 4; 0), O(−1; 2; 2), k = 0,5 -> (0,5; 3; 1)
//   mustaqil: A(4; 2; −3), O(−2; 3; −1) -> (−8; 4; 1)
//   106-masala: 12 sm qirra, k = 3 -> 36;  k = 1/2 -> 6
//   13-slayd xatosi: (A + O) / 2 = (1,5; 3; 4,5) -- bu O'RTA, tasvir emas
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_41',
  title: L("Almashtirishlar va o'xshashlik", 'Преобразования и подобие', 'Transformations and similarity'),
}

const BLOCK = { label: 'B5', from: 35, to: 41, current: 41 }

// ============================================================
// SLAYD 1. XUK. Matryoshkalar: teng yoki o'xshash.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L("Almashtirishlar va o'xshashlik", 'Преобразования и подобие', 'Transformations and similarity'),
  title: L('Teng yoki o\'xshash', 'Равные или подобные', 'Equal or similar'),
  expr: L('ikkita matryoshka', 'две матрёшки', 'two nesting dolls'),
  rows: [
    { id: 'a', name: L('Aziz', 'Азиз', 'Aziz'), value: L('teng shakllar', 'равные фигуры', 'equal figures') },
    { id: 'b', name: L('Dilnoza', 'Дилноза', 'Dilnoza'), value: L("o'xshash shakllar", 'подобные фигуры', 'similar figures') },
  ],
  probe: {
    question: L('Kim haq?', 'Кто прав?', 'Who is right?'),
    afterPredict: L(
      'Javobingiz yozib olindi. Endi tekshiramiz.',
      'Твой ответ записан. Сейчас проверим.',
      'Your answer is saved. Now we will check.',
    ),
    items: [
      { id: 'a', label: L('Aziz', 'Азиз', 'Aziz') },
      { id: 'b', label: L('Dilnoza', 'Дилноза', 'Dilnoza') },
      { id: 'both', label: L('ikkalasi ham', 'оба', 'both') },
      { id: 'none', label: L('hech kim', 'никто', 'nobody') },
    ],
  },
  holds: [4500, 4000, 3900],
  audio: [
    A('mount', "Blokning oxirgi darsi. Bugun shakllarni ko'chiramiz, aylantiramiz va kattalashtiramiz.", 'Последний урок блока. Сегодня будем переносить фигуры, отражать и увеличивать.', 'The last lesson of the block. Today we will shift figures, reflect and enlarge them.'),
    A('r1', "Ikkita matryoshka bir xil shaklda, lekin o'lchamlari boshqa. Aziz ularni teng shakllar deydi.", 'Две матрёшки одинаковой формы, но разного размера. Азиз называет их равными фигурами.', 'Two dolls of the same shape but different size. Aziz calls them equal figures.'),
    A('r2', "Dilnoza esa ularni o'xshash shakllar deydi.", 'А Дилноза называет их подобными фигурами.', 'Dilnoza calls them similar figures.'),
    A('ask', "Sizningcha kim haq. Hozircha shunchaki taxmin qiling.", 'Как думаешь, кто прав. Пока просто предположи.', 'Who do you think is right. Just make a guess for now.'),
  ],
}

// ============================================================
// SLAYD 2. TAYANCH.
// ============================================================
const S2 = {
  role: 'support',
  eyebrow: L('Tayanchni tekshirish', 'Проверка опоры', 'Checking the basics'),
  title: L('Uch tayanch', 'Три опоры', 'Three basics'),
  lead: L(
    "Uchtasi ham shu blokdan. Bu baholanmaydi.",
    'Все три из этого блока. Это не оценивается.',
    'All three from this block. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Kesma o\'rtasi', 'Середина отрезка', 'A midpoint'),
      short: L('35-darsdan', 'из урока 35', 'from lesson 35'),
      ex: [{ e: L('yarim yig\'indi', 'полусумма', 'the half sum'), why: L('har bir koordinatada', 'по каждой координате', 'in each coordinate') }],
    },
    {
      id: 'c2',
      title: L('Songa ko\'paytirish', 'Умножение на число', 'Scaling'),
      short: L('36-darsdan', 'из урока 36', 'from lesson 36'),
      ex: [{ e: 'λa', why: L('uzunlik |λ| barobar', 'длина в |λ| раз', 'the length by |λ|') }],
    },
    {
      id: 'c3',
      title: L('Masofa', 'Расстояние', 'Distance'),
      short: L('40-darsdan', 'из урока 40', 'from lesson 40'),
      ex: [{ e: L('vektor uzunligi', 'длина вектора', 'a vector length'), why: L('nuqtadan nuqtagacha', 'от точки до точки', 'from point to point') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true, cols: 2,
      prompt: L('(1; 2; 3) va (3; 6; 9) o\'rtasi?', 'Середина (1; 2; 3) и (3; 6; 9)?', 'The midpoint of (1; 2; 3) and (3; 6; 9)?'),
      items: [
        { id: 'a', label: '(2; 4; 6)', correct: true },
        { id: 'b', label: '(4; 8; 12)', hint: L("Bu yig'indi, ikkiga bo'linmagan.", 'Это сумма, не поделённая на два.', 'That is the sum, not halved.') },
        { id: 'c', label: '(2; 4; 3)', hint: L("Uchinchi koordinata ham bo'linadi: uch plyus to'qqiz o'n ikki.", 'Третья координата тоже делится: три плюс девять двенадцать.', 'The third coordinate is halved too: three plus nine is twelve.') },
        { id: 'd', label: '(1; 2; 3)', hint: L("Bu birinchi nuqtaning o'zi.", 'Это сама первая точка.', 'That is the first point itself.') },
      ],
    },
    {
      id: 't2', ask: true, cols: 4,
      prompt: L("|−3a|, agar |a| = 4", '|−3a|, если |a| = 4', '|−3a|, if |a| = 4'),
      items: [
        { id: 'a', label: '12', correct: true },
        { id: 'b', label: '−12', hint: L("Uzunlik manfiy bo'lmaydi.", 'Длина не бывает отрицательной.', 'A length is never negative.') },
        { id: 'c', label: '4', hint: L("Uch barobar cho'zildi.", 'Растянули втрое.', 'It was stretched threefold.') },
        { id: 'd', label: '7', hint: L("Bu yig'indi. Uzunlik ko'paytiriladi.", 'Это сумма. Длина умножается.', 'That is a sum. A length multiplies.') },
      ],
    },
    {
      id: 't3', ask: true, cols: 2,
      prompt: L('Harakat masofani saqlaydimi?', 'Сохраняет ли движение расстояния?', 'Does a motion keep distances?'),
      items: [
        { id: 'a', label: L('ha', 'да', 'yes'), correct: true },
        { id: 'b', label: L("yo'q", 'нет', 'no'), hint: L("Harakatning ta'rifi aynan shu: masofalar saqlanadi.", 'Определение движения именно в этом: расстояния сохраняются.', 'That is the very definition of a motion: distances are kept.') },
      ],
    },
  ],
  holds: [3000, 4000, 4000, 4000, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch: kesma o'rtasi uchlarning yarim yig'indisi.", 'Первая опора: середина отрезка это полусумма концов.', 'The first basic: a midpoint is the half sum of the ends.'),
    A('c2', "Ikkinchi tayanch: vektorni songa ko'paytirganda uzunlik shu sonning moduliga ko'payadi.", 'Вторая опора: при умножении вектора на число длина растёт в модуль этого числа раз.', 'The second basic: scaling a vector multiplies the length by the absolute value of the number.'),
    A('c3', "Uchinchi tayanch o'tgan darsdan: nuqtadan nuqtagacha masofa vektorning uzunligi.", 'Третья опора с прошлого урока: расстояние от точки до точки это длина вектора.', 'The third basic from last lesson: a point to point distance is a vector length.'),
    A('recap', 'Uchtasi birga bugungi javobni beradi.', 'Три вместе и дают сегодняшний ответ.', 'The three together give today\'s answer.'),
    A('tasks', 'Endi uchta qisqa topshiriq.', 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. MEZON: qaysi almashtirish HARAKAT.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'move_vs_similar',
  eyebrow: L('Masofani tekshiramiz', 'Проверяем расстояние', 'Checking the distance'),
  title: L('Qaysi almashtirish harakat', 'Какое преобразование движение', 'Which transformation is a motion'),
  expr: 'A (1; 2; 3)',
  goal: L('harakatni ajratish', 'отделить движение', 'tell a motion apart'),
  rule: L('Tasvirni topamiz.', 'Находим образ.', 'We find the image.'),
  pick: L('Qaysi almashtirishni tekshiramiz?', 'Какое преобразование проверим?', 'Which transformation shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('hammasi harakat', 'все движения', 'all are motions'), value: '=' },
    { id: 'b', key: 'inB', name: L('gomotetiya harakat emas', 'гомотетия не движение', 'homothety is not'), value: '≠' },
  ],
  points: [
    {
      id: 'q1', label: L("ko'chirish", 'перенос', 'a shift'), num: '(4; 4; 8)', step: 'calc', verdict: 'in',
      calc: L("masofa o'sha", 'расстояния те же', 'distances kept'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q3', label: 'O (2; 4; 6)', num: '(3; 6; 9)', step: 'calc', verdict: 'in',
      calc: L('markazdan teng', 'равно от центра', 'equal from the centre'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q4', label: 'k = 2', num: '(2; 4; 6)', step: 'calc', verdict: 'out',
      calc: L('masofa ×2', 'расстояния ×2', 'distances ×2'),
      sol: false, inA: true, inB: false,
    },
  ],
  probe: {
    question: L(
      'Qaysi almashtirish masofani saqlamaydi?',
      'Какое преобразование не сохраняет расстояния?',
      'Which transformation does not keep distances?',
    ),
    items: [
      { id: 'd', label: L('gomotetiya k = 2', 'гомотетия k = 2', 'homothety k = 2'), correct: true },
      { id: 'a', label: L("ko'chirish", 'перенос', 'a shift'), hint: L("Hamma nuqta bir xil vektorga suriladi.", 'Все точки сдвигаются на один вектор.', 'Every point moves by the same vector.') },
      { id: 'b', label: L('simmetriya', 'симметрия', 'a symmetry'), hint: L('Faqat ishora almashadi.', 'Меняется только знак.', 'Only a sign flips.') },
      { id: 'c', label: L('markaziy simmetriya', 'центральная симметрия', 'central symmetry'), hint: L('Bu ham harakat.', 'Это тоже движение.', 'That is a motion too.') },
    ],
  },
  holds: [3000, 4500, 2500, 2600, 9000],
  audio: [
    A('mount', 'Taxmin bor. Endi mezonni topamiz.', 'Прогноз есть. Теперь найдём признак.', 'The guess is made. Now let us find the criterion.'),
    A('mount', "Bitta nuqtaga to'rt xil almashtirish qo'llaymiz va har birida masofa saqlanganini tekshiramiz.", 'К одной точке применим четыре преобразования и в каждом проверим, сохранилось ли расстояние.', 'We apply four transformations to one point and check in each whether the distance is kept.'),
    A('mount', "To'rtta almashtirishni birma bir bajaramiz.", 'Выполним четыре преобразования по одному.', 'Let us do the four transformations one by one.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Mana natija. Ko'chirish va markaziy simmetriya masofani saqladi: bular harakat. Gomotetiya esa masofani ikki barobar oshirdi, ya'ni u harakat emas. Shakl o'sha qoldi, o'lcham esa o'zgardi. Aynan shu farq matryoshkalar savoliga javob beradi.", 'Вот результат. Перенос и центральная симметрия сохранили расстояния: это движения. А гомотетия увеличила расстояние вдвое, значит она не движение. Форма осталась той же, а размер изменился. Именно это различие и отвечает на вопрос про матрёшек.', 'Here is the result. The shift and the central symmetry kept the distances: those are motions. The homothety doubled the distance, so it is not a motion. The shape stayed, the size changed. That very difference answers the question about the dolls.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: TO'RT ALMASHTIRISH KETMA-KET.
// `steps` -- har kadrda BOSHQA almashtirish, asbob tasvirni o'zi hisoblaydi.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'sym_coord',
  drag: false,
  graphSteps: 3,
  eyebrow: L('Chizma', 'Чертёж', 'The drawing'),
  title: L('To\'rt almashtirish, bitta tetraedr', 'Четыре преобразования, один тетраэдр', 'Four transformations, one tetrahedron'),
  chip: L('qora -- shakl, qizil -- tasvir', 'чёрный — фигура, красный — образ', 'black is the figure, red is the image'),
  space: {
    mode: 'map',
    box: [[-3, 4], [-3, 5], [-3, 4]],
    height: 205,
    interactive: true,
    map: { kind: 'shift', shape: 'tetra', vec: [1, 2, 1], t: 1 },
    steps: [
      { map: { kind: 'shift', shape: 'tetra', vec: [1, 2, 1], t: 1 } },
      { map: { kind: 'plane', shape: 'tetra', plane: 'Oxy', t: 1 } },
      { map: { kind: 'center', shape: 'tetra', center: [0, 0, 0], t: 1 } },
      { map: { kind: 'homothety', shape: 'tetra', center: [0, 0, 0], k: 2, t: 1 } },
    ],
    caption: L('karkasni barmoq bilan burish mumkin', 'каркас можно повернуть пальцем', 'you can turn the frame with a finger'),
  },
  bonus: L(
    "Uchta birinchi almashtirishda tasvir shaklga TENG: qirralarning uzunligi o'zgarmadi. To'rtinchisida esa faqat SHAKL saqlandi.",
    'В первых трёх преобразованиях образ РАВЕН фигуре: длины рёбер не изменились. В четвёртом сохранилась только ФОРМА.',
    'In the first three the image is EQUAL to the figure: the edge lengths stayed. In the fourth only the SHAPE survived.',
  ),
  probe: {
    question: L(
      "Qaysi kadrda qirralar uzunligi o'zgardi?",
      'В каком кадре изменились длины рёбер?',
      'In which frame did the edge lengths change?',
    ),
    items: [
      { id: 'd', label: L('gomotetiyada', 'в гомотетии', 'in the homothety'), correct: true },
      { id: 'a', label: L("ko'chirishda", 'в переносе', 'in the shift'), hint: L("Ko'chirishda shakl faqat joyini o'zgartirdi.", 'При переносе фигура только сменила место.', 'A shift only changed the place of the figure.') },
      { id: 'b', label: L('simmetriyada', 'в симметрии', 'in the symmetry'), hint: L("Simmetriya ko'zguga o'xshaydi: o'lcham o'zgarmaydi.", 'Симметрия как зеркало: размер не меняется.', 'A symmetry is like a mirror: the size stays.') },
      { id: 'c', label: L('markaziy simmetriyada', 'в центральной симметрии', 'in the central symmetry'), hint: L("Markazdan ikki tomonga teng masofada: uzunlik o'sha.", 'На равном расстоянии по обе стороны от центра: длина та же.', 'At equal distances on both sides of the centre: the length stays.') },
    ],
  },
  holds: [4000, 4500, 4500],
  audio: [
    A('mount', "Mezon topildi. Endi chizmaga qaraymiz. Qora tetraedr -- shakl, qizil -- uning tasviri. Birinchi kadrda ko'chirish: tasvir vektor bo'ylab surildi.", 'Признак найден. Теперь посмотрим на чертёж. Чёрный тетраэдр это фигура, красный это её образ. В первом кадре перенос: образ сдвинулся по вектору.', 'The criterion is found. Now let us look at the drawing. The black tetrahedron is the figure, the red one its image. The first frame shows a shift: the image moved along a vector.'),
    A('one', "Ikkinchi kadr: Oxy tekisligiga nisbatan simmetriya. Tasvir polning tagiga tushdi, applikatalar ishorasini almashtirdi.", 'Второй кадр: симметрия относительно плоскости Oxy. Образ ушёл под пол, аппликаты сменили знак.', 'The second frame: symmetry about the plane Oxy. The image went below the floor, the applicates flipped sign.'),
    A('two', "Uchinchi kadr: koordinata boshiga nisbatan markaziy simmetriya. Har bir cho'qqi markazdan qarama-qarshi tomonda, va shu masofada.", 'Третий кадр: центральная симметрия относительно начала координат. Каждая вершина по другую сторону от центра и на том же расстоянии.', 'The third frame: central symmetry about the origin. Every vertex is on the other side of the centre at the same distance.'),
    A('three', "To'rtinchi kadr: gomotetiya, koeffitsiyenti ikki. Nurlar markazdan chiqadi, va tasvir ikki barobar katta. Shakli o'sha, o'lchami boshqa.", 'Четвёртый кадр: гомотетия с коэффициентом два. Лучи выходят из центра, и образ вдвое больше. Форма та же, размер другой.', 'The fourth frame: a homothety with coefficient two. Rays leave the centre and the image is twice as large. The shape is the same, the size differs.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1. Harakatlar va koordinatalar jadvali.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'sym_coord',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Harakatlar jadvali', 'Таблица движений', 'The table of motions'),
  rows: [
    '(x + a;  y + b;  z + c)',
    // Jadval UCH satrga: bitta uzun satr telefonda 26 px kesilardi.
    'Oxy:  (x; y; −z)',
    'O:  (−x; −y; −z)',
  ],
  probe: {
    question: L(
      'Oxz ga nisbatan (5; −2; 7) qaysi nuqtaga o\'tadi?',
      'В какую точку перейдёт (5; −2; 7) при симметрии относительно Oxz?',
      'Where does (5; −2; 7) go under symmetry about Oxz?',
    ),
    items: [
      { id: 'a', label: '(5; 2; 7)', correct: true },
      { id: 'b', label: '(−5; −2; 7)', hint: L("Bu Oyz ga nisbatan: u yerda abssissa ishorasini almashtiradi.", 'Это относительно Oyz: там знак меняет абсцисса.', 'That is about Oyz: there the abscissa flips.') },
      { id: 'c', label: '(5; −2; −7)', hint: L("Bu Oxy ga nisbatan: u yerda applikata almashadi.", 'Это относительно Oxy: там меняется аппликата.', 'That is about Oxy: there the applicate flips.') },
      { id: 'd', label: '(−5; 2; −7)', hint: L("Bu koordinata boshiga nisbatan: uchala ishora ham almashadi.", 'Это относительно начала координат: меняются все три знака.', 'That is about the origin: all three signs flip.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Harakat', 'Правило 1. Движение', 'Rule 1. A motion'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('harakat masofani saqlaydi', 'движение сохраняет расстояния', 'a motion keeps distances'),
    lines: [
      L("ko'chirishda har bir koordinataga o'z soni qo'shiladi", 'при переносе к каждой координате прибавляется своё число', 'a shift adds its own number to each coordinate'),
      L('tekislikka nisbatan simmetriyada BITTA ishora almashadi', 'при симметрии относительно плоскости меняется ОДИН знак', 'a plane symmetry flips ONE sign'),
      L("o'qqa nisbatan IKKITA, markazga nisbatan UCHTASI", 'относительно оси ДВА, относительно центра ВСЕ ТРИ', 'an axis flips TWO, a centre flips ALL THREE'),
      L('markaziy simmetriyada tasvir 2C − A', 'при центральной симметрии образ 2C − A', 'central symmetry gives the image 2C − A'),
    ],
    example: L('misol:  A (1; 2; 3), markaz (2; 4; 6)  →  (3; 6; 9)', 'пример:  A (1; 2; 3), центр (2; 4; 6)  →  (3; 6; 9)', 'example:  A (1; 2; 3), centre (2; 4; 6)  →  (3; 6; 9)'),
  },
  holds: [4000, 8000, 4500],
  audio: [
    A('mount', 'Chizma ko\'rildi. Endi qoidani yozamiz.', 'Чертёж увидели. Теперь запишем правило.', 'We saw the drawing. Now let us write the rule.'),
    A('def', "Harakat masofani saqlaydi, va uning uchta turini biz ko'rdik. Ko'chirishda har bir koordinataga o'z soni qo'shiladi. Tekislikka nisbatan simmetriyada bitta koordinata ishorasini almashtiradi, o'qqa nisbatan ikkitasi, koordinata boshiga nisbatan esa uchtasi. Markaziy simmetriyada tasvirni topish uchun markazni ikkilantirib nuqtani ayirish kifoya.", 'Движение сохраняет расстояния, и три его вида мы увидели. При переносе к каждой координате прибавляется своё число. При симметрии относительно плоскости знак меняет одна координата, относительно оси две, относительно начала координат все три. А при центральной симметрии образ находят, удвоив центр и вычтя точку.', 'A motion keeps distances, and we saw three of its kinds. A shift adds its own number to each coordinate. A plane symmetry flips one coordinate, an axis two, the origin all three. And central symmetry finds the image by doubling the centre and subtracting the point.'),
    A('rule', "To'g'ri. Va tekshiruv oson: qaysi tekislikka nisbatan simmetriya bo'lsa, o'sha tekislikda YO'Q koordinata ishorasini almashtiradi.", 'Верно. И проверка простая: при симметрии относительно плоскости знак меняет та координата, которой в этой плоскости НЕТ.', 'Correct. And an easy check: in a plane symmetry the coordinate that flips is the one MISSING from that plane.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: gomotetiya.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'homothety_k',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('O\'lcham o\'zgaradi', 'Размер меняется', 'The size changes'),
  was: { label: UI.was, expr: L('harakat: masofa o\'sha', 'движение: расстояния те же', 'a motion: distances kept') },
  now: { label: UI.now, expr: L('gomotetiya k = 2', 'гомотетия k = 2', 'homothety k = 2') },
  probe1: {
    cols: 2,
    question: L('Qirralar uzunligi qanday o\'zgaradi?', 'Как изменятся длины рёбер?', 'How do the edge lengths change?'),
    items: [
      { id: 'a', label: L('ikki barobar', 'вдвое', 'twofold'), correct: true },
      { id: 'b', label: L("o'zgarmaydi", 'не изменятся', 'they stay'), hint: L("Gomotetiya harakat emas: o'lchamlar aynan o'zgaradi.", 'Гомотетия не движение: размеры как раз меняются.', 'A homothety is not a motion: the sizes do change.') },
    ],
  },
  probe2: {
    cols: 4,
    question: L(
      'Hajm necha barobar oshadi?',
      'Во сколько раз вырастет объём?',
      'By what factor does the volume grow?',
    ),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '×2' },
      { id: 'b', label: '×4' },
      { id: 'c', label: '×6' },
      { id: 'd', label: '×8' },
    ],
  },
  holds: [4000, 5000, 3000],
  audio: [
    A('mount', "Harakatlar yozildi. Endi harakat BO'LMAGAN almashtirish.", 'Движения записали. Теперь преобразование, которое движением НЕ является.', 'The motions are written. Now a transformation that is NOT a motion.'),
    A('now', "Gomotetiyada har bir nuqta markazdan k barobar uzoqlashadi. Shakl saqlanadi, o'lcham esa o'zgaradi.", 'При гомотетии каждая точка удаляется от центра в k раз. Форма сохраняется, а размер меняется.', 'In a homothety every point moves k times away from the centre. The shape is kept, the size changes.'),
    A('q1', 'Qirralar uzunligi qanday o\'zgaradi?', 'Как изменятся длины рёбер?', 'How do the edge lengths change?'),
    A('q2', "Endi taxmin qiling: hajm necha barobar oshadi.", 'Теперь предположи: во сколько раз вырастет объём.', 'Now make a guess: by what factor does the volume grow.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD: uzunlik va hajm.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'homothety_k',
  eyebrow: L('Ikkalasini sanaymiz', 'Посчитаем оба', 'Let us compute both'),
  title: L('Uzunlik va hajm', 'Длина и объём', 'Length and volume'),
  expr: 'k = 2',
  need: L('necha barobar', 'во сколько раз', 'by what factor'),
  answerLabel: L('hajm', 'объём', 'the volume'),
  cards: [
    {
      tag: L('uzunlik', 'длина', 'a length'),
      txt: L('bir o\'lchov', 'одно измерение', 'one dimension'),
      point: { label: L('necha barobar', 'во сколько раз', 'the factor'), calc: '×2', verdict: 'in' },
    },
    {
      tag: L('hajm', 'объём', 'a volume'),
      txt: L('uch o\'lchov', 'три измерения', 'three dimensions'),
      point: { label: L('necha barobar', 'во сколько раз', 'the factor'), calc: '×8', verdict: 'in' },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['×8', '×2', '×4', '×6'],
    value: ['×8'],
    label: L('hajm', 'объём', 'volume'),
    prompt: L('Hajmni yozing', 'Запиши для объёма', 'Write it for the volume'),
    wrongs: [
      { key: '×2', hint: L("Ikki barobar faqat uzunlik oshadi: u bitta o'lchov.", 'Вдвое растёт только длина: она одно измерение.', 'Only the length doubles: it is one dimension.') },
      { key: '×4', hint: L("To'rt barobar YUZA oshadi: u ikki o'lchov.", 'Вчетверо растёт ПЛОЩАДЬ: она два измерения.', 'The AREA quadruples: it is two dimensions.') },
      { key: '×6', hint: L("Oltita yoq bor, lekin savol hajm haqida: uch o'lchov ko'paytiriladi.", 'Граней шесть, но вопрос про объём: перемножаются три измерения.', 'There are six faces, but the question is the volume: three dimensions multiply.') },
      { key: '*', hint: L("Uch o'lchov ham ikki barobar: ikki karra ikki karra ikki sakkiz.", 'Все три измерения вдвое: два на два на два восемь.', 'All three dimensions double: two times two times two is eight.') },
    ],
  },
  holds: [4000, 4500, 6000],
  audio: [
    A('mount', "Taxmin bor. Endi uchala o'lchovni ham sanaymiz.", 'Прогноз есть. Теперь посчитаем все три измерения.', 'The guess is made. Now let us count all three dimensions.'),
    A('p1', "Uzunlik bitta o'lchov, va u ikki barobar oshadi.", 'Длина это одно измерение, и она растёт вдвое.', 'A length is one dimension, and it doubles.'),
    A('p2', "Yuza ikki o'lchov: ikki karra ikki, ya'ni to'rt barobar. Hajm esa uch o'lchov: ikki karra ikki karra ikki, ya'ni sakkiz barobar. Yozing.", 'Площадь два измерения: два на два, то есть вчетверо. А объём три измерения: два на два на два, то есть в восемь раз. Запиши.', 'An area is two dimensions: two times two, fourfold. A volume is three: two times two times two, eightfold. Write it.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2. O'xshashlik va gomotetiya.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'move_vs_similar',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L("O'xshashlik va gomotetiya", 'Подобие и гомотетия', 'Similarity and homothety'),
  cases: [
    {
      label: L('harakat', 'движение', 'a motion'),
      text: L('masofa saqlanadi', 'расстояния сохраняются', 'distances are kept'),
      tone: 'graph',
    },
    {
      label: L("o'xshashlik", 'подобие', 'similarity'),
      text: L('faqat shakl saqlanadi', 'сохраняется только форма', 'only the shape is kept'),
      tone: 'accent',
    },
  ],
  rows: [
    // Satrlar QISQA: ruscha variant 135 px, inglizchasi 59 px kesilardi.
    '×|k|,   ×k²,   ×|k|³',
    L('k = ±1 -- harakat', 'k = ±1 — движение', 'k = ±1 is a motion'),
  ],
  probe: {
    question: L(
      'Qirrasi 12 sm bo\'lgan tetraedr, k = 1/2. Yangi qirra?',
      'Тетраэдр с ребром 12 см, k = 1/2. Новое ребро?',
      'A tetrahedron with a 12 cm edge, k = 1/2. The new edge?',
    ),
    items: [
      { id: 'a', label: '6', correct: true },
      { id: 'b', label: '24', hint: L("Yarim koeffitsiyent kichraytiradi, kattalashtirmaydi.", 'Коэффициент одна вторая уменьшает, а не увеличивает.', 'A coefficient of a half shrinks, not grows.') },
      { id: 'c', label: '3', hint: L("Bu to'rtga bo'lish bo'lardi.", 'Это было бы деление на четыре.', 'That would be dividing by four.') },
      { id: 'd', label: '12', hint: L("O'lcham o'zgaradi: k bir ga teng emas.", 'Размер меняется: k не равен единице.', 'The size changes: k is not one.') },
    ],
  },
  rule: {
    badge: L("2-qoida. O'xshashlik", 'Правило 2. Подобие', 'Rule 2. Similarity'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'OX₁ = k · OX',
    lines: [
      L('gomotetiya markazdan chiqadigan nurlar bo\'ylab ishlaydi', 'гомотетия работает по лучам из центра', 'a homothety works along rays from the centre'),
      L('k manfiy bo\'lsa tasvir markazning boshqa tomonida', 'при k меньше нуля образ по другую сторону центра', 'for k below zero the image is on the other side'),
      L("uzunlik |k| barobar, yuza k kvadrat, hajm |k| kub barobar", 'длина в |k| раз, площадь в k², объём в |k|³', 'length by |k|, area by k², volume by |k|³'),
      L("k bir yoki minus bir bo'lsagina harakat chiqadi", 'движение выходит только при k равном одному или минус одному', 'a motion appears only for k equal to one or minus one'),
    ],
    example: L('misol:  12 sm,  k = 1/2  →  6 sm', 'пример:  12 см,  k = 1/2  →  6 см', 'example:  12 cm,  k = 1/2  →  6 cm'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('harakat masofani, o\'xshashlik shaklni saqlaydi', 'движение сохраняет расстояния, подобие форму', 'a motion keeps distances, similarity keeps shape'),
    lines: [
      L('1. harakatlar: ko\'chirish va simmetriyalar', '1. движения: перенос и симметрии', '1. motions: a shift and the symmetries'),
      L('2. ularda koordinatalar jadval bo\'yicha o\'zgaradi', '2. в них координаты меняются по таблице', '2. there the coordinates change by the table'),
      L('3. gomotetiya harakat emas: o\'lcham o\'zgaradi', '3. гомотетия не движение: меняется размер', '3. a homothety is not a motion: the size changes'),
      L('4. o\'lchov soni darajani beradi: 1, 2, 3', '4. число измерений даёт степень: 1, 2, 3', '4. the count of dimensions gives the power: 1, 2, 3'),
    ],
  },
  holds: [4000, 7500, 2600],
  audio: [
    A('mount', "Hajm sanaldi. Endi ikkinchi qoida.", 'Объём посчитали. Теперь второе правило.', 'The volume is computed. Now the second rule.'),
    A('rows', "Gomotetiyada har bir nuqta markazdan chiqadigan nur bo'ylab k barobar uzoqlashadi. Uzunlik k moduliga, yuza k kvadratiga, hajm esa k modulining kubiga ko'payadi. Va e'tibor bering: k bir ga teng bo'lsa shakl o'z joyida qoladi, minus bir bo'lsa markaziy simmetriya chiqadi. Faqat shu ikki holatda gomotetiya harakat bo'ladi.", 'При гомотетии каждая точка удаляется от центра по лучу в k раз. Длина растёт в модуль k раз, площадь в k в квадрате, а объём в модуль k в кубе. И обрати внимание: при k равном единице фигура остаётся на месте, при минус единице выходит центральная симметрия. Только в этих двух случаях гомотетия является движением.', 'In a homothety every point moves k times away from the centre along a ray. A length grows by the absolute value of k, an area by k squared, a volume by the cube. And note: at k equal to one the figure stays, at minus one central symmetry appears. Only in those two cases is a homothety a motion.'),
    A('rule', "To'g'ri.", 'Верно.', 'Correct.'),
    A('both', 'Endi butun darsni bitta qoidaga yig\'ing.', 'А теперь собери весь урок в одно правило.', 'Now combine the whole lesson into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. ISHORANI O'ZI QO'YADI: k ning ishorasi.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'homothety_k',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('k ning ishorasi', 'Знак k', 'The sign of k'),
  left: L('tasvir markazning BOSHQA tomonida', 'образ по ДРУГУЮ сторону центра', 'the image is on the OTHER side'),
  template: ['k = ', { slot: 0 }, ' 2'],
  signs: ['+', '−'],
  answer: '−',
  checkNote: L(
    "Manfiy koeffitsiyent tasvirni markazdan o'tkazib yuboradi",
    'Отрицательный коэффициент переносит образ через центр',
    'A negative coefficient sends the image through the centre',
  ),
  wrongs: [
    { key: '+', hint: L("Musbat k da tasvir markazning O'SHA tomonida qoladi, shartda esa boshqa tomon.", 'При положительном k образ остаётся с ТОЙ ЖЕ стороны центра, а в условии другая.', 'For a positive k the image stays on the SAME side, the problem says the other.') },
  ],
  probe: {
    question: L("k = −2 da uzunlik qanday o'zgaradi?", 'Как изменится длина при k = −2?', 'How does a length change at k = −2?'),
    items: [
      { id: 'a', label: L('ikki barobar oshadi', 'вырастет вдвое', 'it doubles'), correct: true },
      { id: 'b', label: L('ikki barobar kamayadi', 'уменьшится вдвое', 'it halves'), hint: L("Kamayish uchun modul birdan kichik bo'lishi kerak.", 'Для уменьшения модуль должен быть меньше единицы.', 'To shrink, the absolute value must be below one.') },
      { id: 'c', label: L('manfiy bo\'ladi', 'станет отрицательной', 'it turns negative'), hint: L("Uzunlik manfiy bo'lmaydi: minus faqat yo'nalishga tegishli.", 'Длина не бывает отрицательной: минус только про направление.', 'A length is never negative: the minus is only about direction.') },
      { id: 'd', label: L("o'zgarmaydi", 'не изменится', 'it stays'), hint: L("Moduli ikki, ya'ni uzunlik ikki barobar oshadi.", 'Модуль два, значит длина вырастет вдвое.', 'The absolute value is two, so the length doubles.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "k ning ishorasini qo'ying.", 'Поставь знак k.', 'Place the sign of k.'),
    A('checked', "Bo'ldi. Endi uzunlik haqida javob bering.", 'Готово. Теперь ответь про длину.', 'Done. Now answer about the length.'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ. Darslikning 111-masalasi.
// ============================================================
const ACTIONS_10 = [
  { id: 'vec', label: L('markazdan vektorni topish', 'найти вектор от центра', 'find the vector from the centre') },
  { id: 'mul', label: L("k ga ko'paytirish", 'умножить на k', 'multiply by k') },
  { id: 'add', label: L("markazga qo'shish", 'прибавить центр', 'add the centre') },
  { id: 'mid', label: L("o'rtasini topish", 'найти середину', 'find the midpoint') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'homothety_k',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Gomotetiya tasvirini topamiz', 'Находим образ при гомотетии', 'Finding a homothety image'),
  start: L('A (2; 4; 0),  markaz O (−1; 2; 2),  k = 0,5', 'A (2; 4; 0),  центр O (−1; 2; 2),  k = 0,5', 'A (2; 4; 0),  centre O (−1; 2; 2),  k = 0,5'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'vec',
      to: 'OA (3; 2; −2)',
      wrongs: [
        { action: 'mul', hint: L("Avval nimani ko'paytirishni toping: markazdan nuqtagacha vektor.", 'Сначала найди, что умножать: вектор от центра к точке.', 'First find what to multiply: the vector from the centre to the point.') },
        { action: 'add', hint: L("Qo'shish oxirgi qadam.", 'Прибавление это последний шаг.', 'Adding is the last step.') },
        { action: 'mid', hint: L("O'rta bu boshqa masala: gomotetiyada k ixtiyoriy.", 'Середина это другая задача: в гомотетии k любой.', 'A midpoint is another task: in a homothety k is arbitrary.') },
      ],
    },
    {
      action: 'mul',
      to: '0,5 · OA = (1,5; 1; −1)',
      wrongs: [
        { action: 'vec', hint: L("Vektor topilgan: uch, ikki, minus ikki.", 'Вектор найден: три, два, минус два.', 'The vector is found: three, two, minus two.') },
        { action: 'add', hint: L("Avval k ga ko'paytiring.", 'Сначала умножь на k.', 'Multiply by k first.') },
        { action: 'mid', hint: L("Kerak emas.", 'Не нужно.', 'Not needed.') },
      ],
    },
    {
      action: 'add',
      to: 'O + (1,5; 1; −1)',
      wrongs: [
        { action: 'vec', hint: L("Vektor joyida.", 'Вектор на месте.', 'The vector is in place.') },
        { action: 'mul', hint: L("Ko'paytirildi: bir butun besh, bir, minus bir.", 'Умножено: одна целая пять, один, минус один.', 'Multiplied: one point five, one, minus one.') },
        { action: 'mid', hint: L("Kerak emas.", 'Не нужно.', 'Not needed.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['(0,5; 3; 1)', '(1,5; 1; −1)', '(3; 6; 1)', '(0,5; 3; 3)'],
    value: ['(0,5; 3; 1)'],
    label: 'A₁ =',
    prompt: L('Tasvirni yozing', 'Запиши образ', 'Write the image'),
    wrongs: [
      { key: '(1,5; 1; −1)', hint: L("Bu vektor, nuqta emas: markazni qo'shish qolgan.", 'Это вектор, а не точка: осталось прибавить центр.', 'That is the vector, not the point: the centre must be added.') },
      { key: '(3; 6; 1)', hint: L("Bu markazni qo'shmasdan ikkilantirish bo'lardi.", 'Это было бы удвоение без прибавления центра.', 'That would be doubling without adding the centre.') },
      { key: '(0,5; 3; 3)', hint: L("Uchinchi koordinatada ishora yo'qolgan: minus bir qo'shiladi.", 'В третьей координате потерян знак: прибавляется минус один.', 'The sign is lost in the third coordinate: minus one is added.') },
      { key: '*', hint: L("Markaz minus bir, ikki, ikki, va unga bir butun besh, bir, minus bir qo'shiladi.", 'Центр минус один, два, два, и к нему прибавляется одна целая пять, один, минус один.', 'The centre is minus one, two, two, and one point five, one, minus one is added to it.') },
    ],
  },
  audio: [
    A('mount', 'Ishora qo\'yildi. Endi to\'liq masalani o\'tamiz.', 'Знак поставлен. Пройдём полную задачу.', 'The sign is placed. Let us work a full problem.'),
    A('start', "Diqqat: markaz koordinata boshida emas, shuning uchun uch qadam kerak bo'ladi.", 'Внимание: центр не в начале координат, поэтому понадобятся три шага.', 'Careful: the centre is not at the origin, so three steps are needed.'),
    A('step4', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL: markaziy simmetriya.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'sym_coord',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Markaziy simmetriya', 'Центральная симметрия', 'Central symmetry'),
  start: L('A (4; 2; −3),  markaz O (−2; 3; −1)', 'A (4; 2; −3),  центр O (−2; 3; −1)', 'A (4; 2; −3),  centre O (−2; 3; −1)'),
  actions: ACTIONS_10,
  hint: L(
    "Markaz kesmaning o'rtasi, ya'ni tasvir 2O minus A.",
    'Центр это середина отрезка, значит образ равен 2O минус A.',
    'The centre is the midpoint, so the image is 2O minus A.',
  ),
  steps: [
    {
      action: 'mul',
      to: '2O = (−4; 6; −2)',
      wrongs: [
        { action: 'vec', hint: L("Bu yo'l ham ishlaydi, lekin qisqasi markazni ikkilantirish.", 'Этот путь тоже работает, но короче удвоить центр.', 'That path works too, but doubling the centre is shorter.') },
        { action: 'add', hint: L("Avval markazni ikkilantiring.", 'Сначала удвой центр.', 'Double the centre first.') },
        { action: 'mid', hint: L("O'rta ma'lum: u markazning o'zi.", 'Середина известна: это сам центр.', 'The midpoint is known: it is the centre itself.') },
      ],
    },
    {
      action: 'add',
      to: '2O − A',
      wrongs: [
        { action: 'mul', hint: L("Ikkilantirildi: minus to'rt, olti, minus ikki.", 'Удвоено: минус четыре, шесть, минус два.', 'Doubled: minus four, six, minus two.') },
        { action: 'vec', hint: L("Kerak emas.", 'Не нужно.', 'Not needed.') },
        { action: 'mid', hint: L("Kerak emas.", 'Не нужно.', 'Not needed.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['(−8; 4; 1)', '(1; 2,5; −2)', '(−4; 6; −2)', '(8; −4; −1)'],
    value: ['(−8; 4; 1)'],
    label: 'A₁ =',
    prompt: L('Tasvirni yozing', 'Запиши образ', 'Write the image'),
    wrongs: [
      { key: '(1; 2,5; −2)', hint: L("Bu A va O ning o'rtasi. Markaz esa A va tasvirning o'rtasi.", 'Это середина A и O. А центр это середина A и образа.', 'That is the midpoint of A and O. The centre is the midpoint of A and the image.') },
      { key: '(−4; 6; −2)', hint: L("Bu ikkilantirilgan markaz, A ayirilmagan.", 'Это удвоенный центр, A не вычтено.', 'That is the doubled centre, A was not subtracted.') },
      { key: '(8; −4; −1)', hint: L("Hamma ishora almashtirilgan, lekin markaz hisobga olinmagan.", 'Все знаки сменены, но центр не учтён.', 'Every sign flipped, but the centre was ignored.') },
      { key: '*', hint: L("Minus to'rt minus to'rt minus sakkiz, olti minus ikki to'rt, minus ikki plyus uch bir.", 'Минус четыре минус четыре минус восемь, шесть минус два четыре, минус два плюс три один.', 'Minus four minus four is minus eight, six minus two is four, minus two plus three is one.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Markaz kesmaning o'rtasi bo'lgani uchun tasvirni ikki qadamda topish mumkin.", 'Так как центр это середина отрезка, образ находится в два шага.', 'Since the centre is the midpoint, the image takes two steps.'),
    A('answered', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 12. BLITS.
// ============================================================
const S12 = {
  role: 'blitz',
  led: 'student',
  eyebrow: L('Blits', 'Блиц', 'Quick round'),
  title: L('Olti savol', 'Шесть вопросов', 'Six questions'),
  items: [
    {
      id: 'b1', tag: 'sym_coord', ask: true, cols: 4,
      done: '(1; 6; 11)',
      prompt: L('P (−2; 4; 6) ni (3; 2; 5) ga ko\'chirish', 'Перенос P (−2; 4; 6) на (3; 2; 5)', 'Shift P (−2; 4; 6) by (3; 2; 5)'),
      items: [
        { id: 'a', label: '(1; 6; 11)', correct: true },
        { id: 'b', label: '(−5; 2; 1)', hint: L("Bu ayirma. Ko'chirishda vektor QO'SHILADI.", 'Это разность. При переносе вектор ПРИБАВЛЯЕТСЯ.', 'That is the difference. A shift ADDS the vector.') },
        { id: 'c', label: '(1; 6; 1)', hint: L("Uchinchi koordinata: olti plyus besh o'n bir.", 'Третья координата: шесть плюс пять одиннадцать.', 'The third coordinate: six plus five is eleven.') },
        { id: 'd', label: '(3; 2; 5)', hint: L("Bu vektorning o'zi.", 'Это сам вектор.', 'That is the vector itself.') },
      ],
    },
    {
      id: 'b2', tag: 'sym_coord', ask: true, cols: 4,
      done: '(1; 2; 3)',
      prompt: L('Oxy ga nisbatan (1; 2; −3)', 'Относительно Oxy точка (1; 2; −3)', 'About Oxy the point (1; 2; −3)'),
      items: [
        { id: 'a', label: '(1; 2; 3)', correct: true },
        { id: 'b', label: '(−1; −2; −3)', hint: L("Bu koordinata boshiga nisbatan.", 'Это относительно начала координат.', 'That is about the origin.') },
        { id: 'c', label: '(1; −2; −3)', hint: L("Bu Oxz ga nisbatan.", 'Это относительно Oxz.', 'That is about Oxz.') },
        { id: 'd', label: '(−1; 2; −3)', hint: L("Bu Oyz ga nisbatan.", 'Это относительно Oyz.', 'That is about Oyz.') },
      ],
    },
    {
      // Ikki ustun: «central symmetry» to'rt ustunda kesilardi.
      id: 'b3', tag: 'move_vs_similar', ask: true, cols: 2,
      done: L('markaziy simmetriya', 'центральная симметрия', 'central symmetry'),
      prompt: L('k = −1 bo\'lgan gomotetiya bu...', 'Гомотетия с k = −1 это...', 'A homothety with k = −1 is...'),
      items: [
        { id: 'a', label: L('markaziy simmetriya', 'центральная симметрия', 'central symmetry'), correct: true },
        { id: 'b', label: L("ko'chirish", 'перенос', 'a shift'), hint: L("Ko'chirishda markaz yo'q, va hamma nuqta bir tomonga suriladi.", 'При переносе центра нет, и все точки идут в одну сторону.', 'A shift has no centre, and all points go one way.') },
        { id: 'c', label: L('shaklning o\'zi', 'сама фигура', 'the figure itself'), hint: L("Bu k bir ga teng bo'lganda.", 'Это при k равном единице.', 'That happens at k equal to one.') },
        { id: 'd', label: L('harakat emas', 'не движение', 'not a motion'), hint: L("Harakat: uzunlik moduli bir, ya'ni o'zgarmaydi.", 'Движение: модуль равен единице, значит длина не меняется.', 'A motion: the absolute value is one, so lengths stay.') },
      ],
    },
    {
      id: 'b4', tag: 'homothety_k', ask: true, cols: 4,
      done: '6',
      prompt: L('Qirra 12, k = 1/2. Yangi qirra?', 'Ребро 12, k = 1/2. Новое ребро?', 'An edge of 12, k = 1/2. The new edge?'),
      items: [
        { id: 'a', label: '6', correct: true },
        { id: 'b', label: '24', hint: L("Yarim kichraytiradi.", 'Одна вторая уменьшает.', 'A half shrinks.') },
        { id: 'c', label: '3', hint: L("Bu to'rtga bo'lish.", 'Это деление на четыре.', 'That is dividing by four.') },
        { id: 'd', label: '12', hint: L("O'lcham o'zgaradi.", 'Размер меняется.', 'The size changes.') },
      ],
    },
    {
      id: 'b5', tag: 'homothety_k', ask: true, cols: 4,
      done: '×27',
      prompt: L('k = 3. Hajm necha barobar?', 'k = 3. Во сколько раз объём?', 'k = 3. The volume factor?'),
      items: [
        { id: 'a', label: '×27', correct: true },
        { id: 'b', label: '×3', hint: L("Uch barobar faqat uzunlik.", 'Втрое только длина.', 'Threefold is only the length.') },
        { id: 'c', label: '×9', hint: L("To'qqiz barobar yuza.", 'В девять раз площадь.', 'Ninefold is the area.') },
        { id: 'd', label: '×6', hint: L("Hajmda daraja uchinchi: uch kubda yigirma yetti.", 'В объёме степень третья: три в кубе двадцать семь.', 'A volume takes the third power: three cubed is twenty seven.') },
      ],
    },
    {
      id: 'b6', tag: 'move_vs_similar', ask: true, cols: 2,
      done: L("yo'q", 'нет', 'no'),
      prompt: L('k = 2 bo\'lgan gomotetiya harakatmi?', 'Является ли гомотетия с k = 2 движением?', 'Is a homothety with k = 2 a motion?'),
      items: [
        { id: 'a', label: L("yo'q", 'нет', 'no'), correct: true },
        { id: 'b', label: L('ha', 'да', 'yes'), hint: L("Harakat masofani saqlaydi, bu yerda esa u ikki barobar oshadi.", 'Движение сохраняет расстояния, а здесь они растут вдвое.', 'A motion keeps distances, here they double.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', 'Simmetriya.', 'Симметрия.', 'A symmetry.'),
    A('q3', 'Manfiy koeffitsiyent.', 'Отрицательный коэффициент.', 'A negative coefficient.'),
    A('q4', 'Qirra.', 'Ребро.', 'An edge.'),
    A('q5', 'Hajm.', 'Объём.', 'A volume.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: markaz o'rta deb olingan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'sym_coord',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Uchta satr to\'g\'ri, bittasi yo\'q', 'Три строки верны, одна нет', 'Three lines are right, one is not'),
  rows: [
    { id: 'r1', text: L('A (1; 2; 3),  markaz O (2; 4; 6)', 'A (1; 2; 3),  центр O (2; 4; 6)', 'A (1; 2; 3),  centre O (2; 4; 6)') },
    { id: 'r2', text: L('O -- AA₁ kesmaning o\'rtasi', 'O это середина отрезка AA₁', 'O is the midpoint of AA₁') },
    { id: 'r3', text: 'A₁ = (A + O) / 2' },
    { id: 'r4', text: 'A₁ = (1,5; 3; 4,5)' },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("To'g'ri: markaziy simmetriyaning ta'rifi aynan shu.", 'Верно: это и есть определение центральной симметрии.', 'Right: that is the definition of central symmetry.'),
    r4: L("Bu satr oldingisidan to'g'ri chiqadi. Xato yuqorida.", 'Эта строка верно следует из предыдущей. Ошибка выше.', 'This line follows correctly. The error is above.'),
  },
  proofPoint: L('formula teskari yozilgan', 'формула записана наоборот', 'the formula is inverted'),
  proof: L(
    "O nuqta O'RTA, ya'ni O = (A + A₁) / 2. Bundan A₁ = 2O − A, ya'ni to'rt minus bir, sakkiz minus ikki, o'n ikki minus uch: (3; 6; 9). Yozilgan javob esa A va O ning o'rtasi.",
    'Точка O это СЕРЕДИНА, то есть O = (A + A₁) / 2. Отсюда A₁ = 2O − A, то есть четыре минус один, восемь минус два, двенадцать минус три: (3; 6; 9). А записанный ответ это середина A и O.',
    'The point O is the MIDPOINT, that is O = (A + A₁) / 2. Hence A₁ = 2O − A, that is four minus one, eight minus two, twelve minus three: (3; 6; 9). The written answer is the midpoint of A and O.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L("formula teskari", 'формула наоборот', 'the formula is inverted'), correct: true },
      { id: 'b', label: L('arifmetika', 'арифметика', 'the arithmetic'), hint: L("Arifmetika to'g'ri: bir plyus ikki bo'lingan ikki bir butun besh.", 'Арифметика верна: один плюс два делить на два одна целая пять.', 'The arithmetic is right: one plus two over two is one point five.') },
      { id: 'c', label: L("markaz noto'g'ri", 'неверный центр', 'the wrong centre'), hint: L("Markaz shartdan olingan.", 'Центр взят из условия.', 'The centre is from the problem.') },
      { id: 'd', label: L('xato yo\'q', 'ошибки нет', 'no error'), hint: L("Xato bor: yozilgan nuqta A va O orasida, tasvir esa O ning boshqa tomonida bo'lishi kerak.", 'Ошибка есть: записанная точка между A и O, а образ должен быть по другую сторону от O.', 'There is an error: the written point lies between A and O, while the image must be beyond O.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Diqqat: ikkinchi satr ta'rifni to'g'ri aytadi, arifmetika ham to'g'ri. Xato uchinchi satrda.", 'Внимание: вторая строка верно называет определение, арифметика тоже верна. Ошибка в третьей строке.', 'Careful: the second line states the definition right, and the arithmetic is right too. The error is in the third line.'),
    A('proof', "Qarang: O nuqta o'rta, ya'ni A va tasvirning yarim yig'indisi. Demak tasvirni topish uchun markazni ikkilantirib nuqtani ayirish kerak: A bir tasvir teng ikki O minus A. Bu uch, olti, to'qqizni beradi. Yozilgan javob esa A va O ning o'rtasi bo'lib chiqdi, ya'ni tasvir markazdan o'tib ketmadi.", 'Смотри: точка O это середина, то есть полусумма A и образа. Значит, чтобы найти образ, надо удвоить центр и вычесть точку: A один равно два O минус A. Это даёт три, шесть, девять. А записанный ответ оказался серединой A и O, то есть образ не перешёл через центр.', 'Look: the point O is the midpoint, the half sum of A and the image. So to find the image we double the centre and subtract the point: A one equals two O minus A. That gives three, six, nine. The written answer turned out to be the midpoint of A and O, so the image never crossed the centre.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'sym_coord',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Tasvirni yig\'ing', 'Собери образ', 'Build the image'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L('qaysi ishora almashadi', 'какой знак меняется', 'which sign flips'),
  tasks: [
    {
      prompt: L('Oyz ga nisbatan (4; −1; 5)', 'Относительно Oyz точка (4; −1; 5)', 'About Oyz the point (4; −1; 5)'),
      template: ['( ', { slot: 0 }, ' ;  −1 ;  ', { slot: 1 }, ' )'],
      parts: ['−4', '4', '5', '−5'],
      answer: ['−4', '5'],
      doneLabel: '(−4; −1; 5)',
      wrongs: [
        { key: '4|5', hint: L("Oyz da abssissa YO'Q, ya'ni aynan u ishorasini almashtiradi.", 'В Oyz абсциссы НЕТ, значит именно она меняет знак.', 'Oyz has NO abscissa, so that is the one that flips.') },
        { key: '−4|−5', hint: L("Applikata o'z joyida qoladi: u Oyz tekisligida bor.", 'Аппликата остаётся: она есть в плоскости Oyz.', 'The applicate stays: it belongs to the plane Oyz.') },
        { key: '*', hint: L("Tekislik nomida yo'q koordinata ishorasini almashtiradi.", 'Знак меняет координата, которой нет в названии плоскости.', 'The coordinate missing from the plane name flips.') },
      ],
    },
    {
      prompt: L('(3; 1; 2) ni (−1; 2; −2) ga ko\'chirish', 'Перенос (3; 1; 2) на (−1; 2; −2)', 'Shift (3; 1; 2) by (−1; 2; −2)'),
      template: ['( 2 ;  ', { slot: 0 }, ' ;  ', { slot: 1 }, ' )'],
      parts: ['3', '1', '0', '4'],
      answer: ['3', '0'],
      doneLabel: '(2; 3; 0)',
      wrongs: [
        { key: '1|0', hint: L("Ikkinchi koordinata: bir plyus ikki uch.", 'Вторая координата: один плюс два три.', 'The second coordinate: one plus two is three.') },
        { key: '3|4', hint: L("Uchinchi koordinata: ikki plyus minus ikki nol.", 'Третья координата: два плюс минус два нуль.', 'The third coordinate: two plus minus two is zero.') },
        { key: '*', hint: L("Ko'chirishda vektor qo'shiladi, har bir koordinataga o'z soni.", 'При переносе вектор прибавляется, к каждой координате своё число.', 'A shift adds the vector, each coordinate its own number.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari: almashtirish bor, tasvir kerak.', 'Ошибка найдена. Последнее задание обратное: есть преобразование, нужен образ.', 'The error is found. The last task is reverse: the transformation is given, the image is needed.'),
    A('built1', "Endi ikkinchisi: ko'chirish.", 'Теперь второе: перенос.', 'Now the second: a shift.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN. BLOK YOPILADI.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'move_vs_similar',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: 'OX₁ = k · OX',
  ruleLines: [
    L('harakat masofani saqlaydi', 'движение сохраняет расстояния', 'a motion keeps distances'),
    L("o'xshashlik faqat shaklni saqlaydi", 'подобие сохраняет только форму', 'similarity keeps only the shape'),
    L("uzunlik |k|, yuza k², hajm |k|³ barobar", 'длина в |k|, площадь в k², объём в |k|³', 'length by |k|, area by k², volume by |k|³'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('matryoshkalar', 'матрёшки', 'the dolls'),
      right: L("o'xshash", 'подобные', 'similar'),
      map: {
        a: L('teng', 'равные', 'equal'),
        b: L("o'xshash", 'подобные', 'similar'),
        both: L('ikkalasi', 'оба', 'both'),
        none: L('hech kim', 'никто', 'nobody'),
      },
    },
    {
      screen: 5,
      expr: L('hajm, k = 2', 'объём, k = 2', 'the volume, k = 2'),
      right: '×8',
      map: { a: '×2', b: '×4', c: '×6', d: '×8' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: L('teng yoki o\'xshash → shakl o\'sha, o\'lcham boshqa → o\'xshash', 'равные или подобные → форма та же, размер другой → подобные', 'equal or similar → same shape, other size → similar'),
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L("Qoida va jadval ekraniga qayting", 'Вернись к правилу и к экрану с таблицей', 'Go back to the rule and the table screen'),
  },
  probe: {
    question: L(
      "Blokning boshidan oxirigacha nima o'zgarmadi?",
      'Что не изменилось от начала блока до конца?',
      'What stayed the same from the start of the block to its end?',
    ),
    items: [
      { id: 'a', label: L('koordinatalar bilan ishlash', 'работа с координатами', 'working with coordinates'), correct: true },
      { id: 'b', label: L('formulalar', 'формулы', 'the formulas'), hint: L("Formulalar har darsda yangi edi, usul esa bir xil.", 'Формулы в каждом уроке были новые, а способ один.', 'The formulas were new each lesson, the method one.') },
      { id: 'c', label: L('chizmalar', 'чертежи', 'the drawings'), hint: L("Chizmalar ham o'zgardi: nuqta, vektor, tekislik, shakl.", 'Чертежи тоже менялись: точка, вектор, плоскость, фигура.', 'The drawings changed too: a point, a vector, a plane, a figure.') },
      { id: 'd', label: L('hech narsa', 'ничего', 'nothing'), hint: L("Bitta narsa o'zgarmadi: hammasi uchta son bilan hal qilindi.", 'Одно не менялось: всё решалось тремя числами.', 'One thing did not change: everything was settled by three numbers.') },
    ],
  },
  sheetTitle: L("Almashtirishlar · shpargalka", 'Преобразования · шпаргалка', 'Transformations · cheat sheet'),
  sheetSrc: L('11-sinf · 41-dars', '11 класс · урок 41', 'Grade 11 · lesson 41'),
  lifehack: L(
    "k ning moduli bir bo'lsa harakat, aks holda o'xshashlik.",
    'Модуль k равен единице — движение, иначе подобие.',
    'If the absolute value of k is one it is a motion, otherwise similarity.',
  ),
  holds: [3000, 6000, 8000],
  audio: [
    A('mount', 'Dars tugadi, va u bilan birga blok ham yopildi. Boshiga qaytamiz.', 'Урок закончен, а с ним закрыт и блок. Вернёмся к началу.', 'The lesson is over, and with it the block is closed. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Matryoshkalar o'xshash, teng emas. Va hajm sakkiz barobar oshadi, uzunlik esa faqat ikki.", 'Вот твои прогнозы и вот как оказалось. Матрёшки подобные, а не равные. И объём растёт в восемь раз, а длина только вдвое.', 'Here are your guesses and here is how it turned out. The dolls are similar, not equal. And the volume grows eightfold while the length only doubles.'),
    A('rule', "Va mana butun blokning umumiy fikri. Yetti darsda bitta usul ishladi: fazodagi har qanday savol uchta son bilan hal qilinadi. Nuqtaning joyi, vektorning uchligi, tekislikning normali, burchak, masofa va tasvir. Har birida biz koordinatalar bilan ishladik, va chizma faqat tekshiruv uchun kerak bo'ldi. Blok yopildi.", 'И вот общая мысль всего блока. В семи уроках работал один способ: любой вопрос в пространстве решается тремя числами. Место точки, тройка вектора, нормаль плоскости, угол, расстояние и образ. Везде мы работали с координатами, а чертёж был нужен только для проверки. Блок закрыт.', 'And here is the thought shared by the whole block. Across seven lessons one method worked: any question in space is settled by three numbers. A point position, a vector triple, a plane normal, an angle, a distance and an image. Everywhere we worked with coordinates, and the drawing was needed only as a check. The block is closed.'),
    A('q', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
