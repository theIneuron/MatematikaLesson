// ============================================================================
// 7-sinf, Dars 38. CHIZIQLI TENGLAMALAR SISTEMASI: GRAFIK USUL.
// (Системы линейных уравнений: графический способ)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// DARS HAJMI METODIST QARORI BILAN CHEKLANGAN (2026-08-21): rejada bu dars
// «yechish usullari va masalalar» deb yozilgan, lekin bitta darsda GRAFIK
// USUL va TEKSHIRUV qoladi. Etalon (§2, B6) aynan shu ikki xatoni nomlaydi:
//   -- x topildi, y esa yozilmadi;
//   -- kesishish nuqtasi «ko'z bilan» olindi.
// O'rniga qo'yish va qo'shish usullari bu darsga kirmaydi.
//
// ASBOB IKKI CHIZIQ CHIZADI. Yechim -- ularning KESISHISHI, va u JUFTLIK
// bilan yoziladi: o'quvchi nuqtani o'zi qo'yadi, keyin uni ikki tenglamaga
// ham qo'yib tekshiradi. «Ko'z bilan» olingan nuqta shu tekshiruvda yiqiladi.
//
// UCH HOLAT KO'RSATILADI: kesishadi (bitta yechim), parallel (yechim yo'q),
// ustma-ust tushadi (cheksiz ko'p yechim).
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_38'
const LESSON_TITLE = L('Chiziqli tenglamalar sistemasi', 'Системы линейных уравнений', 'Systems of linear equations')
const LESSON_NO = L('38-dars', 'Урок 38', 'Lesson 38')
const BLOCK = { label: L('B6-blok', 'Блок Б6', 'Block B6'), from: 33, to: 39, current: 38 }

const BOX = { x0: -6, x1: 6, y0: -4, y1: 4 }

const TAGS = {
  Z1: L('x topildi, y esa yo\'q', 'нашли x, забыли y', 'x was found, y was forgotten'),
  Z2: L('kesishish ko\'z bilan olindi', 'пересечение взято на глаз', 'the crossing was taken by eye'),
  Z3: L('ishora yo\'qoldi', 'знак потерян', 'the sign was lost'),
  Z4: L('yechim juftlik bilan yozilmadi', 'решение не записано парой', 'the answer was not written as a pair'),
  Z5: L('parallel va kesishuvchi almashtirildi', 'параллельные и пересекающиеся спутаны', 'parallel and crossing lines were mixed up'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Javobda nechta son bo'lishi kerak.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L('TENGLAMALAR SISTEMASI', 'СИСТЕМА УРАВНЕНИЙ', 'A SYSTEM OF EQUATIONS'),
  noBack: true,
  noNotes: true,
  title: L('Javobda nechta son', 'Сколько чисел в ответе', 'How many numbers in the answer'),
  gate: {
    source: { kind: 'plain', tokens: ['x', '+', 'y', '=', '3'] },
    rows: [
      { tokens: ['x', '=', '2'], value: '1' },
      { tokens: ['(2;', '1)'], value: '2' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Sistemani ikkovi yechdi. Tabloda javobdagi sonlar soni turadi. Kim haq?",
      'Систему решили двое. На табло число чисел в ответе. Кто прав?',
      'Two students solved the system. The boards show how many numbers each answer holds. Who is right?',
    ),
    items: [
      {
        id: 'pair',
        label: L('Juftlik yozgani', 'Тот, кто записал пару', 'The one who wrote a pair'),
        hint: L(
          "Taxminingiz qabul qilindi. Tekislikda tekshiramiz.",
          'Прогноз принят. Проверим на плоскости.',
          'Your prediction is taken. We will check it on the plane.',
        ),
      },
      {
        id: 'one',
        label: L('Faqat x ni yozgani', 'Тот, кто записал только x', 'The one who wrote only x'),
        hint: L(
          "Sistemada ikki noma'lum bor, demak javobda ham ikki son bo'lishi kerak.",
          'В системе два неизвестных, значит и в ответе должно быть два числа.',
          'A system has two unknowns, so the answer must hold two numbers.',
        ),
      },
      {
        id: 'three',
        label: L('Javobda uch son bo\'ladi', 'В ответе будет три числа', 'The answer holds three numbers'),
        hint: L(
          "Noma'lumlar ikkita: x va y. Uchinchisi yo'q.",
          'Неизвестных два: x и y. Третьего нет.',
          'There are two unknowns: x and y. There is no third.',
        ),
      },
      {
        id: 'none',
        label: L('Bunday sistemani yechib bo\'lmaydi', 'Такую систему решить нельзя', 'Such a system cannot be solved'),
        hint: L(
          "Yechish mumkin: ikki chiziq chiziladi va ularning kesishishi topiladi.",
          'Решить можно: рисуют две прямые и находят их пересечение.',
          'It can be solved: draw two lines and find where they cross.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Ikki o'quvchi bitta sistemani yechdi va javobni boshqacha yozdi.", 'Два ученика решили одну систему и записали ответ по-разному.', 'Two students solved one system and wrote the answer differently.'),
    A('mount', "Tabloda javobdagi sonlar soni turadi: bittasida bir, ikkinchisida ikki.", 'На табло число чисел в ответе: у одного одно, у другого два.', 'The boards show how many numbers the answer holds: one for one, two for the other.'),
    A('mount', "Qaysi biri to'g'ri deb taxmin qilasiz.", 'Который из них верен, по-твоему.', 'Which of them do you predict is right.'),
  ],
}

// ============================================================
// 2. TAYANCH. Tenglamaga son qo'yish va juftlikni tekshirish.
// KVOTA EKRANI.
// ============================================================
const S2 = {
  kind: 'chain',
  role: 'support',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uch qisqa savol', 'Три коротких вопроса', 'Three short questions'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "x + y = 3 tenglamasida x ikkiga teng bo'lsa, y nechchi?",
        'В уравнении x + y = 3, если x равен двум, чему равен y?',
        'In x + y = 3, if x is two, what is y?',
      ),
      ok: L("Uchdan ikki ayirilsa bir qoladi.", 'Три минус два это один.', 'Three minus two is one.'),
      items: [
        { id: 'a', label: '1', correct: true },
        { id: 'b', label: '5', tag: 'Z6', hint: L("Ikki ayiriladi, qo'shilmaydi.", 'Два вычитается, а не прибавляется.', 'Two is subtracted, not added.') },
        { id: 'c', label: '2', tag: 'Z1', hint: L("Ikki bu x, y esa boshqa son.", 'Два это x, а y другое число.', 'Two is x, and y is another number.') },
        { id: 'd', label: '3', tag: 'Z6', hint: L("Uch bu yig'indi, y esa uning bir qismi.", 'Три это сумма, а y её часть.', 'Three is the sum, y is one part of it.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "(2; 1) juftligi x − y = 1 tenglamasini qanoatlantiradimi?",
        'Удовлетворяет ли пара (2; 1) уравнению x − y = 1?',
        'Does the pair (2; 1) satisfy x − y = 1?',
      ),
      ok: L("Ikkidan bir ayirilsa bir chiqadi, va tenglikning o'ng tomoni ham bir.", 'Два минус один это один, и справа тоже один.', 'Two minus one is one, and the right side is one too.'),
      items: [
        { id: 'a', correct: true, label: L('ha', 'да', 'yes') },
        { id: 'b', tag: 'Z2', label: L("yo'q", 'нет', 'no'), hint: L("Sonlarni qo'ying: ikki minus bir bir beradi.", 'Подставь числа: два минус один это один.', 'Substitute: two minus one is one.') },
        { id: 'c', tag: 'Z1', label: L('faqat x ni tekshirish kerak', 'надо проверить только x', 'only x should be checked'), hint: L("Tenglamada ikki noma'lum bor, ikkovi ham qo'yiladi.", 'В уравнении два неизвестных, подставляются оба.', 'The equation has two unknowns, both go in.') },
        { id: 'd', tag: 'Z4', label: L('aniqlab bo\'lmaydi', 'определить нельзя', 'it cannot be decided'), hint: L("Aniqlanadi: juftlikni tenglamaga qo'yish yetadi.", 'Определяется: достаточно подставить пару в уравнение.', 'It can be decided: put the pair into the equation.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "x + y = 3 tenglamasidan y ni ajratsak nima chiqadi?",
        'Если из x + y = 3 выразить y, что получится?',
        'Expressing y from x + y = 3 gives what?',
      ),
      ok: L("x ni o'ng tomonga o'tkazsak ishorasi almashadi.", 'Перенос x в правую часть меняет его знак.', 'Moving x to the right flips its sign.'),
      items: [
        { id: 'a', label: 'y = 3 − x', correct: true },
        { id: 'b', label: 'y = 3 + x', tag: 'Z3', hint: L("O'tkazishda ishora almashadi.", 'При переносе знак меняется.', 'Moving a term flips its sign.') },
        { id: 'c', label: 'y = x − 3', tag: 'Z3', hint: L("Uchlik o'z joyida qoladi, x esa unga qo'shilmaydi.", 'Тройка остаётся на месте, а x к ней не прибавляется.', 'The three stays put, and x is not added to it.') },
        { id: 'd', label: 'y = 3x', tag: 'Z6', hint: L("Bu qo'shish, ko'paytirish emas.", 'Это сложение, а не умножение.', 'That is addition, not multiplication.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol. Bugun ikki tenglama birga ishlaydi.", 'Три коротких вопроса. Сегодня два уравнения работают вместе.', 'Three short questions. Today two equations work together.'),
    A('1', "Ikkinchisi juftlikni tekshirish haqida.", 'Второй про проверку пары.', 'The second is about checking a pair.'),
    A('2', "Uchinchisi grafik uchun kerak bo'ladi.", 'Третий понадобится для графика.', 'The third will be needed for the graph.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. IKKI CHIZIQ: yechim -- KESISHISH.
// ============================================================
const S3 = {
  kind: 'plane',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Yechim -- kesishish', 'Решение это пересечение', 'The answer is the crossing'),
  range: BOX,
  fn: [
    { id: 'a', f: (x) => x - 1 },
    { id: 'b', f: (x) => -x + 3 },
  ],
  pick: { x: 2, y: 1 },
  caption: L(
    "Ikki tenglama ikki chiziq berdi: y = x − 1 va y = −x + 3. Ular kesishgan nuqtani belgilang.",
    'Два уравнения дали две прямые: y = x − 1 и y = −x + 3. Отметь точку их пересечения.',
    'Two equations gave two lines: y = x − 1 and y = −x + 3. Mark where they cross.',
  ),
  options: [
    { id: 'a', label: L('juftlik: ikki son', 'пара: два числа', 'a pair: two numbers') },
    { id: 'b', label: L('bitta son', 'одно число', 'one number') },
    { id: 'c', label: L('uch son', 'три числа', 'three numbers') },
    { id: 'd', label: L('javob yo\'q', 'ответа нет', 'no answer') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Nuqtaning ikki koordinatasi bor, va ikkovi ham javobga kiradi.", 'У точки две координаты, и обе входят в ответ.', 'The point has two coordinates, and both belong to the answer.') },
    { key: 'c', tag: 'Z4', hint: L("Tekislikda nuqta ikki son bilan beriladi.", 'На плоскости точка задаётся двумя числами.', 'On a plane a point is given by two numbers.') },
    { key: 'd', tag: 'Z5', hint: L("Chiziqlar kesishdi, demak yechim bor.", 'Прямые пересеклись, значит решение есть.', 'The lines crossed, so a solution exists.') },
  ],
  note: L(
    "Sistemaning yechimi -- ikki chiziqning KESISHGAN nuqtasi. U ikki son bilan yoziladi, chunki bir vaqtda ikki tenglamani ham qanoatlantiradi.",
    'Решение системы это точка ПЕРЕСЕЧЕНИЯ двух прямых. Оно записывается двумя числами, потому что удовлетворяет обоим уравнениям сразу.',
    'The solution of a system is where the two lines CROSS. It is written as two numbers, because it satisfies both equations at once.',
  ),
  audio: [
    A('mount', "Sistemada ikki tenglama bor, va har biri o'z chizig'ini beradi.", 'В системе два уравнения, и каждое даёт свою прямую.', 'A system has two equations, and each gives its own line.'),
    A('mount', "Ikkovini bir vaqtda qanoatlantiradigan nuqta faqat kesishishda bo'ladi.", 'Точка, удовлетворяющая обоим сразу, есть только в пересечении.', 'A point satisfying both at once exists only at the crossing.'),
    A('dot', "Nuqta qo'yildi. Javobda nechta son bo'lishini ayting.", 'Точка поставлена. Скажи, сколько чисел в ответе.', 'The point is placed. Say how many numbers the answer holds.'),
  ],
}

// ============================================================
// 4. FARQLASH. PARALLEL chiziqlar: yechim YO'Q.
// ============================================================
const S4 = {
  kind: 'plane',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Chiziqlar kesishmasa', 'Если прямые не пересекаются', 'When the lines never cross'),
  range: BOX,
  fn: [
    { id: 'a', f: (x) => x + 1 },
    { id: 'b', f: (x) => x - 2 },
  ],
  caption: L(
    "Bu safar chiziqlar y = x + 1 va y = x − 2. Ularning qiyaligi bir xil. Sistemaning yechimi bormi?",
    'На этот раз прямые y = x + 1 и y = x − 2. Наклон у них одинаковый. Есть ли у системы решение?',
    'This time the lines are y = x + 1 and y = x − 2. Their tilts are equal. Does the system have a solution?',
  ),
  options: [
    { id: 'a', label: L('yechim yo\'q', 'решения нет', 'there is no solution') },
    { id: 'b', label: L('bitta yechim', 'одно решение', 'one solution') },
    { id: 'c', label: L('cheksiz ko\'p yechim', 'бесконечно много решений', 'infinitely many solutions') },
    { id: 'd', label: L('aniqlab bo\'lmaydi', 'определить нельзя', 'it cannot be decided') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z5', hint: L("Bitta yechim uchun chiziqlar kesishishi kerak, bular esa parallel.", 'Для одного решения прямые должны пересечься, а эти параллельны.', 'One solution needs the lines to cross, but these are parallel.') },
    { key: 'c', tag: 'Z5', hint: L("Cheksiz yechim chiziqlar ustma-ust tushganda bo'ladi, bu yerda esa ular alohida.", 'Бесконечно много бывает, когда прямые совпадают, а здесь они разные.', 'Infinitely many happens when the lines coincide, here they are apart.') },
    { key: 'd', tag: 'Z2', hint: L("Aniqlanadi: qiyaliklar bir xil, kesishgan joy esa yo'q.", 'Определяется: наклоны одинаковы, а пересечения нет.', 'It can be decided: the tilts match and there is no crossing.') },
  ],
  note: L(
    "Qiyaligi bir xil, lekin b si boshqa chiziqlar PARALLEL bo'ladi va hech qachon kesishmaydi. Bunday sistemaning yechimi yo'q.",
    'Прямые с одинаковым наклоном, но разным b ПАРАЛЛЕЛЬНЫ и никогда не пересекаются. У такой системы решения нет.',
    'Lines with equal tilts but different b are PARALLEL and never cross. Such a system has no solution.',
  ),
  audio: [
    A('mount', "Ikki chiziq, lekin ularning qiyaligi bir xil.", 'Две прямые, но наклон у них одинаковый.', 'Two lines, but their tilts are equal.'),
    A('mount', "Chizmaga qarang: ular uchrashadimi.", 'Посмотри на чертёж: встречаются ли они.', 'Look at the drawing: do they ever meet.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. Yechim JUFTLIK bilan yoziladi.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Yechimni yozish', 'Запись решения', 'Writing the solution'),
  given: L(
    "Kesishish nuqtasi topildi: abssissasi ikki, ordinatasi bir. Yechimni yozing.",
    'Точка пересечения найдена: абсцисса два, ордината один. Запиши решение.',
    'The crossing was found: abscissa two, ordinate one. Write the solution.',
  ),
  template: ['(', { slot: 0 }, '; ', { slot: 1 }, ')'],
  parts: [
    { id: 'a', label: '2' },
    { id: 'b', label: '1' },
    { id: 'c', label: '3' },
    { id: 'd', label: '0' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Yechimni juftlik bilan yozing.",
    'Запиши решение парой.',
    'Write the solution as a pair.',
  ),
  checkNote: L(
    "Sistemaning yechimi juftlik bilan yoziladi: birinchi son x, ikkinchisi y. Faqat x ni yozish yarim javob bo'ladi.",
    'Решение системы записывается парой: первое число x, второе y. Записать только x значит дать половину ответа.',
    'A system solution is written as a pair: the first number x, the second y. Writing only x gives half an answer.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z6', hint: L("Uchlik tenglamaning o'ng tomonida turgan edi, yechimda emas.", 'Тройка стояла в правой части уравнения, а не в решении.', 'The three was on the right side of the equation, not in the solution.') },
    { key: 'd', tag: 'Z6', hint: L("Nol bu koordinatalar boshi, kesishish esa boshqa joyda.", 'Ноль это начало координат, а пересечение в другом месте.', 'Zero is the origin, the crossing is elsewhere.') },
    { key: '*', tag: 'Z4', hint: L("Avval abssissa, keyin ordinata.", 'Сначала абсцисса, потом ордината.', 'The abscissa first, then the ordinate.') },
  ],
  audio: [
    A('mount', "Yechim topildi, endi uni to'g'ri yozish kerak.", 'Решение найдено, теперь надо его верно записать.', 'The solution is found, now it must be written right.'),
    A('mount', "Ikki noma'lum bor, demak javobda ikki son.", 'Два неизвестных, значит в ответе два числа.', 'Two unknowns mean two numbers in the answer.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. Yana kesishish, boshqa chiziqlar.
// ============================================================
const S6 = {
  kind: 'plane',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Yana bir sistema', 'Ещё одна система', 'One more system'),
  range: BOX,
  fn: [
    { id: 'a', f: (x) => 2 * x },
    { id: 'b', f: (x) => -x + 3 },
  ],
  pick: { x: 1, y: 2 },
  caption: L(
    "y = 2x va y = −x + 3. Kesishish nuqtasini belgilang.",
    'y = 2x и y = −x + 3. Отметь точку пересечения.',
    'y = 2x and y = −x + 3. Mark the crossing point.',
  ),
  options: [
    { id: 'a', label: '(1; 2)' },
    { id: 'b', label: '(2; 1)' },
    { id: 'c', label: '(0; 3)' },
    { id: 'd', label: '(3; 0)' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z4', hint: L("Tartibga diqqat: abssissa bir, ordinata esa ikki.", 'Внимание на порядок: абсцисса один, а ордината два.', 'Watch the order: the abscissa is one, the ordinate two.') },
    { key: 'c', tag: 'Z2', hint: L("Bu ikkinchi chiziqning y o'qini kesgan joyi, kesishish emas.", 'Это место, где вторая прямая пересекает ось y, а не пересечение прямых.', 'That is where the second line meets the y axis, not the crossing.') },
    { key: 'd', tag: 'Z2', hint: L("Bu ikkinchi chiziqning x o'qini kesgan joyi.", 'Это место, где вторая прямая пересекает ось x.', 'That is where the second line meets the x axis.') },
  ],
  note: L(
    "Kesishishni topgandan keyin uni IKKI tenglamaga ham qo'yib tekshirish kerak. Faqat shunda javob ishonchli bo'ladi.",
    'После того как пересечение найдено, его надо подставить в ОБА уравнения. Только тогда ответ надёжен.',
    'Once the crossing is found it must go into BOTH equations. Only then is the answer reliable.',
  ),
  audio: [
    A('mount', "Ikki chiziq yana kesishadi, lekin joyi boshqa.", 'Две прямые снова пересекаются, но место другое.', 'The two lines cross again, but elsewhere.'),
    A('mount', "Kesishish nuqtasini belgilang.", 'Отметь точку пересечения.', 'Mark the crossing point.'),
    A('dot', "Endi juftlikni tanlang va tartibga diqqat qiling.", 'Теперь выбери пару и следи за порядком.', 'Now choose the pair and watch the order.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT: chiziqlar USTMA-UST tushdi.
// ============================================================
const S7 = {
  kind: 'plane',
  role: 'explain',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Chiziqlar ustma-ust tushsa', 'Если прямые совпали', 'When the lines coincide'),
  range: BOX,
  fn: [
    { id: 'a', f: (x) => x + 1 },
    { id: 'b', f: (x) => x + 1 },
  ],
  caption: L(
    "Ikki tenglama bir xil chiziqni berdi: y = x + 1 va uning ikki barobari. Yechim nechta?",
    'Два уравнения дали одну прямую: y = x + 1 и то же, умноженное на два. Сколько решений?',
    'Two equations gave one line: y = x + 1 and the same doubled. How many solutions?',
  ),
  options: [
    { id: 'a', label: L('cheksiz ko\'p', 'бесконечно много', 'infinitely many') },
    { id: 'b', label: L('bitta', 'одно', 'one') },
    { id: 'c', label: L('yechim yo\'q', 'решения нет', 'none') },
    { id: 'd', label: L('ikkita', 'два', 'two') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z5', hint: L("Bitta yechim chiziqlar bitta nuqtada uchrashganda bo'ladi, bu yerda esa ular butunlay bir xil.", 'Одно решение бывает, когда прямые встречаются в одной точке, а здесь они совпадают целиком.', 'One solution happens when lines meet at one point, here they coincide entirely.') },
    { key: 'c', tag: 'Z5', hint: L("Yechim yo'q holat parallel chiziqlarda bo'ladi, bular esa ustma-ust tushdi.", 'Случай без решений бывает у параллельных, а эти совпали.', 'No solution happens with parallel lines, these coincide.') },
    { key: 'd', tag: 'Z5', hint: L("Ikki to'g'ri chiziq ikki nuqtada kesishmaydi: ular yoki bitta nuqtada, yoki butunlay birga.", 'Две прямые не пересекаются в двух точках: либо в одной, либо совпадают.', 'Two lines never cross at two points: either one point or they coincide.') },
  ],
  note: L(
    "Ikki tenglama bir xil chiziqni bergan bo'lsa, chiziqning HAR nuqtasi yechim bo'ladi -- ya'ni yechim cheksiz ko'p. Uch holat bor: kesishadi, parallel, ustma-ust.",
    'Если два уравнения дали одну прямую, то решением будет КАЖДАЯ её точка — то есть решений бесконечно много. Всего три случая: пересекаются, параллельны, совпадают.',
    'If two equations gave one line, EVERY point of it is a solution — infinitely many. There are three cases: crossing, parallel, coinciding.',
  ),
  audio: [
    A('mount', "Bu safar ikki tenglama bir xil chiziqni berdi.", 'На этот раз два уравнения дали одну и ту же прямую.', 'This time the two equations gave the same line.'),
    A('mount', "Har nuqta ikki tenglamani ham qanoatlantiradi. Yechim nechta bo'ladi.", 'Каждая точка удовлетворяет обоим уравнениям. Сколько будет решений.', 'Every point satisfies both equations. How many solutions is that.'),
  ],
}

// ============================================================
// 8. QOIDA.
// ============================================================
const S8 = {
  kind: 'rule',
  tag: 'Z1',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L('har tenglama o\'z chizig\'ini beradi', 'каждое уравнение даёт свою прямую', 'each equation gives its own line') },
    { id: 'f2', label: L('yechim -- ularning kesishishi', 'решение это их пересечение', 'the solution is where they cross') },
    { id: 'f3', label: L('va u juftlik bilan yoziladi', 'и оно записывается парой', 'and it is written as a pair') },
    { id: 'f4', label: L("keyin ikki tenglamaga ham qo'yib tekshiriladi", 'потом проверяется в обоих уравнениях', 'then it is checked in both equations') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval chiziqlar, keyin kesishish, keyin yozuv, oxirida tekshiruv.",
    'Порядок нарушен. Сначала прямые, потом пересечение, потом запись, в конце проверка.',
    'The order is off. Lines first, then the crossing, then the record, and the check last.',
  ),
  lawChips: [
    { label: '( ; )', tone: 'par' },
    { label: '2', tone: 'off' },
    { label: '=', tone: 's2' },
    { label: '+', tone: 's1' },
  ],
  lawSweep: L(
    'juftlik, ikki tenglama, tenglik, tekshiruv',
    'пара, два уравнения, равенство, проверка',
    'the pair, two equations, equality, the check',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Sistemadagi har tenglama o'z to'g'ri chizig'ini beradi. Sistemaning yechimi -- shu chiziqlarning kesishgan nuqtasi, va u JUFTLIK bilan yoziladi: birinchi son x, ikkinchisi y.",
        'Каждое уравнение системы даёт свою прямую. Решение системы это точка их пересечения, и оно записывается ПАРОЙ: первое число x, второе y.',
        'Each equation of a system gives its own line. The solution is where the lines cross, written as a PAIR: the first number x, the second y.',
      ),
      L(
        "Kesishish nuqtasi chizmadan olinadi, lekin javob bo'lishdan oldin IKKI tenglamaga ham qo'yib tekshiriladi. Chiziqlar parallel bo'lsa yechim yo'q, ustma-ust tushsa esa cheksiz ko'p.",
        'Точка пересечения берётся с чертежа, но прежде чем стать ответом, подставляется в ОБА уравнения. Если прямые параллельны, решений нет; если совпадают, их бесконечно много.',
        'The crossing is taken from the drawing, but before becoming the answer it goes into BOTH equations. Parallel lines mean no solution, coinciding lines mean infinitely many.',
      ),
    ],
  },
  hookCap: L(
    'Ikki noma\'lum  --  ikki son',
    'Два неизвестных — два числа',
    'Two unknowns, two numbers',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L('har tenglama -- chiziq', 'каждое уравнение это прямая', 'each equation is a line'),
    L('yechim -- kesishish', 'решение это пересечение', 'the solution is the crossing'),
    L('tekshiruv -- ikkovida', 'проверка в обоих', 'the check goes in both'),
  ],
  audio: [
    A('mount', "Uch holatni ko'rdik: kesishish, parallel va ustma-ust. Endi qoidani yig'amiz.", 'Три случая мы увидели: пересечение, параллельные и совпадение. Теперь соберём правило.', 'We have seen three cases: crossing, parallel and coinciding. Now let us build the rule.'),
    A('ok', "To'g'ri. Keyingi dars blokni yopadi: variantlarni sanash.", 'Верно. Следующий урок закрывает блок: подсчёт вариантов.', 'Correct. The next lesson closes the block: counting variants.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI.
// ============================================================
const S9 = {
  kind: 'chain',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Javobni toping', 'Найди ответ', 'Find the answer'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Sistemaning yechimi nechta son bilan yoziladi?",
        'Сколькими числами записывается решение системы?',
        'How many numbers write the solution of a system?',
      ),
      ok: L("Ikki noma'lum bor, demak ikki son.", 'Два неизвестных, значит два числа.', 'Two unknowns, so two numbers.'),
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '1', tag: 'Z1', hint: L("Faqat x ni yozish yarim javob bo'ladi.", 'Записать только x значит дать половину ответа.', 'Writing only x gives half an answer.') },
        { id: 'c', label: '3', tag: 'Z4', hint: L("Noma'lumlar ikkita.", 'Неизвестных два.', 'There are two unknowns.') },
        { id: 'd', label: '4', tag: 'Z4', hint: L("Ikki tenglama bor, lekin noma'lum ikkita.", 'Уравнений два, но неизвестных тоже два.', 'There are two equations, and two unknowns.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Chiziqlarning qiyaligi bir xil, b si esa boshqa. Yechim nechta?",
        'Наклоны прямых одинаковы, а b разные. Сколько решений?',
        'The tilts are equal and the b differ. How many solutions?',
      ),
      ok: L("Bunday chiziqlar parallel va kesishmaydi.", 'Такие прямые параллельны и не пересекаются.', 'Such lines are parallel and never cross.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L("yechim yo'q", 'решений нет', 'no solutions'),
        },
        {
          id: 'b',
          tag: 'Z5',
          label: L('bitta', 'одно', 'one'),
          hint: L("Bitta yechim uchun chiziqlar kesishishi kerak.", 'Для одного решения прямые должны пересечься.', 'One solution needs the lines to cross.'),
        },
        {
          id: 'c',
          tag: 'Z5',
          label: L('cheksiz ko\'p', 'бесконечно много', 'infinitely many'),
          hint: L("Cheksiz ko'p yechim chiziqlar ustma-ust tushganda bo'ladi.", 'Бесконечно много бывает при совпадении прямых.', 'Infinitely many happens when the lines coincide.'),
        },
        {
          id: 'd',
          tag: 'Z2',
          label: L('aniqlab bo\'lmaydi', 'определить нельзя', 'cannot be decided'),
          hint: L("Aniqlanadi: qiyaliklar teng, b lar boshqa -- demak parallel.", 'Определяется: наклоны равны, b разные — значит параллельны.', 'It can be decided: equal tilts, different b means parallel.'),
        },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "(1; 2) juftligi y = 2x sistemasining birinchi tenglamasini qanoatlantiradimi?",
        'Удовлетворяет ли пара (1; 2) уравнению y = 2x?',
        'Does the pair (1; 2) satisfy y = 2x?',
      ),
      ok: L("Ikki karra bir ikki beradi, ordinata ham ikki.", 'Два на один это два, и ордината два.', 'Two times one is two, and the ordinate is two.'),
      items: [
        { id: 'a', correct: true, label: L('ha', 'да', 'yes') },
        { id: 'b', tag: 'Z2', label: L("yo'q", 'нет', 'no'), hint: L("Sonlarni qo'ying: ikki karra bir ikki.", 'Подставь числа: два на один это два.', 'Substitute: two times one is two.') },
        { id: 'c', tag: 'Z1', label: L('faqat x ni tekshirish kerak', 'надо проверить только x', 'only x should be checked'), hint: L("Tenglamada ikki noma'lum bor.", 'В уравнении два неизвестных.', 'The equation has two unknowns.') },
        { id: 'd', tag: 'Z2', label: L('chizma kerak', 'нужен чертёж', 'a drawing is needed'), hint: L("Son qo'yish yetadi.", 'Достаточно подстановки.', 'Substituting is enough.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Ikki tenglama bitta chiziqni berdi. Yechim nechta?",
        'Два уравнения дали одну прямую. Сколько решений?',
        'Two equations gave one line. How many solutions?',
      ),
      ok: L("Chiziqning har nuqtasi yechim bo'ladi.", 'Каждая точка прямой будет решением.', 'Every point of the line is a solution.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('cheksiz ko\'p', 'бесконечно много', 'infinitely many'),
        },
        {
          id: 'b',
          tag: 'Z5',
          label: L('bitta', 'одно', 'one'),
          hint: L("Bitta nuqta emas, chiziqning hammasi mos keladi.", 'Подходит не одна точка, а вся прямая.', 'Not one point but the whole line fits.'),
        },
        {
          id: 'c',
          tag: 'Z5',
          label: L("yechim yo'q", 'решений нет', 'no solutions'),
          hint: L("Chiziqlar uchrashdi, va butunlay uchrashdi.", 'Прямые встретились, и встретились полностью.', 'The lines met, and met entirely.'),
        },
        {
          id: 'd',
          tag: 'Z4',
          label: L('ikkita', 'два', 'two'),
          hint: L("Ikki to'g'ri chiziq ikki nuqtada kesishmaydi.", 'Две прямые не пересекаются в двух точках.', 'Two lines do not cross at two points.'),
        },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Uch holat va bitta tekshiruv.", 'Четыре вопроса. Три случая и одна проверка.', 'Four questions. Three cases and one check.'),
    A('1', "Ikkinchisi parallel chiziqlar haqida.", 'Второй про параллельные.', 'The second is about parallel lines.'),
    A('2', "Uchinchisi son qo'yish bilan tekshiriladi.", 'Третий проверяется подстановкой.', 'The third is checked by substituting.'),
    A('3', "Oxirgisi ustma-ust tushgan chiziqlar haqida.", 'Последний про совпавшие прямые.', 'The last is about coinciding lines.'),
  ],
}

// ============================================================
// 10. MASHQ 2. QADAMLAR ATALGAN: ikki tenglamada tekshirish.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Ikki tenglamada tekshirish', 'Проверка в двух уравнениях', 'Checking in both equations'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  given: L(
    "Sistemaning yechimi (2; 1) deb topildi. Uni ikki tenglamaga ham qo'yib ko'ramiz.",
    'Решением системы нашли (2; 1). Подставим его в оба уравнения.',
    'The solution of the system was found to be (2; 1). Let us put it into both equations.',
  ),
  template: ['x − y = ', { slot: 0 }, ',   x + y = ', { slot: 1 }],
  parts: [
    { id: 'a', label: '1' },
    { id: 'b', label: '3' },
    { id: 'c', label: '2' },
    { id: 'd', label: '0' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ikki tenglamaning chap tomonini hisoblang.",
    'Посчитай левые части обоих уравнений.',
    'Work out the left sides of both equations.',
  ),
  checkNote: L(
    "Ikki minus bir bir beradi, ikki qo'shuv bir esa uch. Ikkovi ham tenglamalarning o'ng tomoniga to'g'ri keldi.",
    'Два минус один это один, а два плюс один это три. Оба совпали с правыми частями уравнений.',
    'Two minus one is one, two plus one is three. Both matched the right sides.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z6', hint: L("Ikki minus bir bir beradi, ikki emas.", 'Два минус один это один, а не два.', 'Two minus one is one, not two.') },
    { key: 'd', tag: 'Z6', hint: L("Ikki qo'shuv bir uch beradi.", 'Два плюс один это три.', 'Two plus one is three.') },
    { key: '*', tag: 'Z1', hint: L("Har tenglamaga ikki son ham qo'yiladi.", 'В каждое уравнение подставляются оба числа.', 'Both numbers go into each equation.') },
  ],
  probe: {
    question: L("Demak (2; 1) yechimmi?", 'Значит, (2; 1) решение?', 'So is (2; 1) a solution?'),
    items: [
      {
        id: 'a',
        correct: true,
        label: L('ha: ikki tenglama ham bajarildi', 'да: оба уравнения выполнились', 'yes: both equations held'),
      },
      {
        id: 'b',
        tag: 'Z1',
        label: L('bitta tenglama yetardi', 'хватило бы одного уравнения', 'one equation would have been enough'),
        hint: L("Bitta tenglamani cheksiz juftlik qanoatlantiradi, sistemani esa bittasi.", 'Одному уравнению удовлетворяет бесконечно много пар, а системе одна.', 'One equation is satisfied by infinitely many pairs, the system by one.'),
      },
      {
        id: 'c',
        tag: 'Z2',
        label: L("yo'q", 'нет', 'no'),
        hint: L("Ikki hisob ham tenglamalarning o'ng tomoniga to'g'ri keldi.", 'Оба подсчёта совпали с правыми частями.', 'Both computations matched the right sides.'),
      },
      {
        id: 'd',
        tag: 'Z2',
        label: L('chizma kerak', 'нужен чертёж', 'a drawing is needed'),
        hint: L("Chizma yordam beradi, lekin isbot son qo'yish bilan bo'ladi.", 'Чертёж помогает, но доказательство даёт подстановка.', 'A drawing helps, but the proof comes from substituting.'),
      },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval ikki tenglamani hisoblash, keyin xulosa.", 'Два шага. Сначала посчитать оба уравнения, потом вывод.', 'Two steps. Compute both equations first, then conclude.'),
    A('mount', "Juftlik ikkala tenglamaga ham qo'yiladi.", 'Пара подставляется в оба уравнения.', 'The pair goes into both equations.'),
    A('two', "Endi ikkinchi qadam.", 'Теперь второй шаг.', 'Now the second step.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ. Juftlik yechim emasligini ko'rsatish.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Yechim emasligini ko\'rsatish', 'Показать, что не решение', 'Showing it is not a solution'),
  given: L(
    "(3; 0) juftligi sistemaning yechimimi? Birinchi tenglama x − y = 1, ikkinchisi x + y = 3.",
    'Является ли пара (3; 0) решением системы? Первое уравнение x − y = 1, второе x + y = 3.',
    'Is the pair (3; 0) a solution? The first equation is x − y = 1, the second x + y = 3.',
  ),
  template: ['3 − 0 = ', { slot: 0 }, '   →   ', { slot: 1 }],
  parts: [
    { id: 'a', label: '3' },
    { id: 'b', label: L('yechim emas', 'не решение', 'not a solution') },
    { id: 'c', label: '1' },
    { id: 'd', label: L('yechim', 'решение', 'a solution') },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Birinchi tenglamani hisoblang va xulosa qiling.",
    'Посчитай первое уравнение и сделай вывод.',
    'Compute the first equation and conclude.',
  ),
  checkNote: L(
    "Uch minus nol uch beradi, tenglamaning o'ng tomoni esa bir. Bitta tenglama bajarilmasa, juftlik yechim bo'lmaydi -- ikkinchisini tekshirish shart emas.",
    'Три минус ноль это три, а справа в уравнении один. Если хотя бы одно уравнение не выполнилось, пара не решение — второе проверять не обязательно.',
    'Three minus zero is three, but the right side is one. If even one equation fails, the pair is not a solution — no need to check the other.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z6', hint: L("Uch minus nol uchga teng.", 'Три минус ноль это три.', 'Three minus zero is three.') },
    { key: 'd', tag: 'Z2', hint: L("Uch va bir teng emas, demak birinchi tenglama bajarilmadi.", 'Три и один не равны, значит первое уравнение не выполнилось.', 'Three and one differ, so the first equation failed.') },
    { key: '*', tag: 'Z1', hint: L("Yechim IKKI tenglamani ham qanoatlantirishi kerak.", 'Решение обязано удовлетворять ОБОИМ уравнениям.', 'A solution must satisfy BOTH equations.') },
  ],
  audio: [
    A('mount', "Bu safar juftlik berilgan, va u yechim emasligi mumkin.", 'На этот раз пара дана, и она может не быть решением.', 'This time the pair is given, and it may not be a solution.'),
    A('mount', "Bitta tenglama bajarilmasa, tekshiruv shu yerda tugaydi.", 'Если одно уравнение не выполнилось, проверка на этом кончается.', 'If one equation fails, the check ends there.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Kesishish KO'Z BILAN olingan: chizmada u
// yaqin turgan, lekin son qo'yish rad etadi.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Chiziqlar to'g'ri qurilgan va kesishish chizmadan olingan. Shunday bo'lsa ham, qaysi qator xato?",
    'Прямые построены верно, и пересечение взято с чертежа. И всё же какая строка ошибочна?',
    'The lines are built right and the crossing was taken from the drawing. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: 'x − y = 1' },
    { id: 'r2', text: 'x + y = 3' },
    { id: 'r3', text: L('chizmadan: (3; 1)', 'с чертежа: (3; 1)', 'from the drawing: (3; 1)') },
    { id: 'r4', text: L('tekshirish shart emas', 'проверять не нужно', 'no check is needed') },
    { id: 'r5', text: L('javob: (3; 1)', 'ответ: (3; 1)', 'answer: (3; 1)') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu birinchi tenglama.", 'Это первое уравнение.', 'That is the first equation.'),
    r2: L("Bu ikkinchi tenglama.", 'Это второе уравнение.', 'That is the second equation.'),
    r4: L("Bu qator oldingisidan chiqqan. Xato esa undan YUQORIDA.", 'Эта строка выходит из предыдущей. А ошибка ВЫШЕ неё.', 'This line follows from the one before. The mistake is ABOVE it.'),
    r5: L("Bu qator oldingisidan chiqqan. Xato esa undan YUQORIDA.", 'Эта строка выходит из предыдущей. А ошибка ВЫШЕ неё.', 'This line follows from the one before. The mistake is ABOVE it.'),
  },
  tags: { r1: 'Z2', r2: 'Z2', r4: 'Z2', r5: 'Z2' },
  proofFill: {
    template: ['3 + 1 = ', { slot: 0 }, '   →   ', { slot: 1 }],
    parts: [
      { id: 'a', label: '4' },
      { id: 'b', label: L('yechim emas', 'не решение', 'not a solution') },
      { id: 'c', label: '3' },
      { id: 'd', label: L('yechim', 'решение', 'a solution') },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Ikkinchi tenglamaga qo'yib ko'ring va xulosani tuzating.",
      'Подставь во второе уравнение и исправь вывод.',
      'Substitute into the second equation and fix the conclusion.',
    ),
    checkNote: L(
      "Uch qo'shuv bir to'rt beradi, tenglamaning o'ng tomoni esa uch. Demak chizmadan olingan nuqta yechim emas: ko'z bilan olingan javob tekshiruvdan o'tmadi.",
      'Три плюс один это четыре, а справа в уравнении три. Значит взятая с чертежа точка не решение: ответ на глаз проверку не прошёл.',
      'Three plus one is four, but the right side is three. So the point taken from the drawing is not a solution: the eyeball answer failed the check.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z6', hint: L("Uch qo'shuv bir to'rtga teng.", 'Три плюс один это четыре.', 'Three plus one is four.') },
      { key: 'd', tag: 'Z2', hint: L("To'rt va uch teng emas.", 'Четыре и три не равны.', 'Four and three differ.') },
      { key: '*', tag: 'Z2', hint: L("Chizmadan olingan nuqta har doim tekshiriladi.", 'Точка, взятая с чертежа, всегда проверяется.', 'A point taken from a drawing is always checked.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda chiziqlar to'g'ri qurilgan.", 'В этой ловушке прямые построены верно.', 'In this trap the lines are built right.'),
    A('mount', "Shunday bo'lsa ham javob noto'g'ri. Xato birinchi qaysi qatorda.", 'И всё же ответ неверен. В какой строке ошибка впервые.', 'And yet the answer is wrong. Which line has the mistake first.'),
    A('proof', "Topdingiz. Chizmadan olingan nuqta ikkinchi tenglamani qanoatlantirmadi.", 'Нашёл. Точка с чертежа не удовлетворила второму уравнению.', 'You found it. The point from the drawing failed the second equation.'),
    A('done', "Ko'z bilan olingan nuqta javob bo'lolmaydi: uni tekshirish kerak.", 'Точка, взятая на глаз, не может быть ответом: её надо проверить.', 'An eyeballed point cannot be the answer: it must be checked.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. IKKI VELICHINA: masala sistemaga aylanadi.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L('KO\'CHIRISH', 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Masaladan sistemaga', 'От задачи к системе', 'From a problem to a system'),
  given: L(
    "Ikki daftar va bitta ruchka birga uch ming so'm. Daftar bilan ruchkaning ayirmasi esa bir ming so'm. Sistemani yozing.",
    'Две тетради и одна ручка вместе стоят три тысячи сумов. А разница между тетрадью и ручкой одна тысяча. Запиши систему.',
    'Two notebooks and one pen cost three thousand together. The difference between a notebook and a pen is one thousand. Write the system.',
  ),
  template: ['x + y = ', { slot: 0 }, ',   x − y = ', { slot: 1 }],
  parts: [
    { id: 'a', label: '3' },
    { id: 'b', label: '1' },
    { id: 'c', label: '2' },
    { id: 'd', label: '4' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ikki tenglamaning o'ng tomonini yozing.",
    'Запиши правые части двух уравнений.',
    'Write the right sides of the two equations.',
  ),
  checkNote: L(
    "Birinchi shart yig'indini beradi, ikkinchisi ayirmani. Ikki shart -- ikki tenglama, va ular birga sistema bo'ladi.",
    'Первое условие даёт сумму, второе разность. Два условия это два уравнения, и вместе они система.',
    'The first condition gives the sum, the second the difference. Two conditions make two equations, and together a system.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z6', hint: L("Yig'indi uch ming so'm deb berilgan.", 'Сумма дана как три тысячи.', 'The sum is given as three thousand.') },
    { key: 'd', tag: 'Z6', hint: L("Sonlar qo'shilmaydi: har shart o'z tenglamasini beradi.", 'Числа не складываются: каждое условие даёт своё уравнение.', 'The numbers are not added: each condition gives its own equation.') },
    { key: '*', tag: 'Z4', hint: L("Birinchi shart yig'indi, ikkinchisi ayirma.", 'Первое условие сумма, второе разность.', 'The first condition is the sum, the second the difference.') },
  ],
  audio: [
    A('mount', "Masalada ikki noma'lum bo'lsa, ikki shart ham bo'ladi.", 'Если в задаче два неизвестных, то и условий два.', 'If a problem has two unknowns, it has two conditions.'),
    A('mount', "Har shart bitta tenglama beradi, ikkovi birga sistema bo'ladi.", 'Каждое условие даёт одно уравнение, вместе они система.', 'Each condition gives one equation, together they form a system.'),
  ],
}

// ============================================================
// 14. BLITS. Baholanadigan YAGONA ekran.
// ============================================================
const S14 = {
  kind: 'blitz',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("To'rt savol", 'Четыре вопроса', 'Four questions'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Sistemaning yechimi qanday yoziladi?",
        'Как записывается решение системы?',
        'How is the solution of a system written?',
      ),
      ok: L("Juftlik bilan: birinchi son x, ikkinchisi y.", 'Парой: первое число x, второе y.', 'As a pair: the first number x, the second y.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('juftlik bilan', 'парой', 'as a pair'),
        },
        {
          id: 'b',
          tag: 'Z1',
          label: L('faqat x bilan', 'только через x', 'with x only'),
          hint: L("Ikki noma'lum bor.", 'Неизвестных два.', 'There are two unknowns.'),
        },
        {
          id: 'c',
          tag: 'Z4',
          label: L('uch son bilan', 'тремя числами', 'with three numbers'),
          hint: L("Uchinchi noma'lum yo'q.", 'Третьего неизвестного нет.', 'There is no third unknown.'),
        },
        {
          id: 'd',
          tag: 'Z4',
          label: L('chizma bilan', 'чертежом', 'with a drawing'),
          hint: L("Chizma yordam beradi, lekin javob sonlar bilan yoziladi.", 'Чертёж помогает, но ответ пишется числами.', 'A drawing helps, but the answer is written in numbers.'),
        },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Chiziqlar parallel bo'lsa yechim nechta?",
        'Сколько решений, если прямые параллельны?',
        'How many solutions if the lines are parallel?',
      ),
      ok: L("Parallel chiziqlar kesishmaydi.", 'Параллельные прямые не пересекаются.', 'Parallel lines never cross.'),
      items: [
        { id: 'a', correct: true, label: L("yo'q", 'нет', 'none') },
        { id: 'b', tag: 'Z5', label: L('bitta', 'одно', 'one'), hint: L("Kesishish yo'q, demak umumiy nuqta ham yo'q.", 'Пересечения нет, значит нет и общей точки.', 'No crossing means no shared point.') },
        { id: 'c', tag: 'Z5', label: L('cheksiz', 'бесконечно', 'infinitely many'), hint: L("Bu ustma-ust tushgan chiziqlarda bo'ladi.", 'Так бывает у совпавших прямых.', 'That happens with coinciding lines.') },
        { id: 'd', tag: 'Z2', label: L('bilib bo\'lmaydi', 'узнать нельзя', 'cannot be known'), hint: L("Bilib bo'ladi: parallel chiziqlar uchrashmaydi.", 'Можно: параллельные не встречаются.', 'It can: parallel lines never meet.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "(1; 2) juftligi x + y = 3 ni qanoatlantiradimi?",
        'Удовлетворяет ли пара (1; 2) уравнению x + y = 3?',
        'Does the pair (1; 2) satisfy x + y = 3?',
      ),
      ok: L("Bir qo'shuv ikki uch beradi.", 'Один плюс два это три.', 'One plus two is three.'),
      items: [
        { id: 'a', correct: true, label: L('ha', 'да', 'yes') },
        { id: 'b', tag: 'Z2', label: L("yo'q", 'нет', 'no'), hint: L("Sonlarni qo'ying: bir qo'shuv ikki uch.", 'Подставь: один плюс два это три.', 'Substitute: one plus two is three.') },
        { id: 'c', tag: 'Z1', label: L('faqat x kerak', 'нужен только x', 'only x is needed'), hint: L("Ikki noma'lum ham qo'yiladi.", 'Подставляются оба неизвестных.', 'Both unknowns go in.') },
        { id: 'd', tag: 'Z6', label: L('aniqlab bo\'lmaydi', 'определить нельзя', 'cannot be decided'), hint: L("Aniqlanadi: qo'shish yetadi.", 'Определяется: достаточно сложить.', 'It can: adding is enough.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Chizmadan olingan nuqta bilan nima qilish kerak?",
        'Что надо сделать с точкой, взятой с чертежа?',
        'What must be done with a point taken from a drawing?',
      ),
      ok: L("Uni ikki tenglamaga ham qo'yib tekshirish kerak.", 'Её надо подставить в оба уравнения.', 'It must be put into both equations.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('ikki tenglamada tekshirish', 'проверить в двух уравнениях', 'check it in both equations'),
        },
        {
          id: 'b',
          tag: 'Z2',
          label: L('darrov javob deb yozish', 'сразу записать в ответ', 'write it straight into the answer'),
          hint: L("Chizma aniq emas: nuqta yaqin turgan bo'lishi mumkin.", 'Чертёж неточен: точка может стоять рядом.', 'A drawing is not exact: the point may sit nearby.'),
        },
        {
          id: 'c',
          tag: 'Z1',
          label: L('faqat birinchi tenglamada tekshirish', 'проверить в первом уравнении', 'check it in the first equation'),
          hint: L("Bitta tenglamani cheksiz juftlik qanoatlantiradi.", 'Одному уравнению удовлетворяет бесконечно много пар.', 'One equation is satisfied by infinitely many pairs.'),
        },
        {
          id: 'd',
          tag: 'Z2',
          label: L('chizmani kattalashtirish', 'увеличить чертёж', 'enlarge the drawing'),
          hint: L("Kattalashtirish aniqlik bermaydi, son qo'yish esa beradi.", 'Увеличение точности не даёт, а подстановка даёт.', 'Enlarging gives no exactness, substituting does.'),
        },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisi parallel chiziqlar haqida.", 'Второй про параллельные.', 'The second is about parallel lines.'),
    A('2', "Uchinchisi tekshiruv haqida.", 'Третий про проверку.', 'The third is about the check.'),
    A('3', "Oxirgisi butun darsning qoidasi.", 'Последний это правило всего урока.', 'The last is the rule of the whole lesson.'),
  ],
}

// ============================================================
// 15. YAKUN.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Ikki noma\'lum -- ikki son', 'Два неизвестных — два числа', 'Two unknowns, two numbers'),
  gate: S1.gate,
  fix: {
    tokens: ['(2;', '1)'],
    value: '2',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Sistemada ikki noma'lum bor, shuning uchun javob juftlik bilan yoziladi. Faqat x ni yozish yarim javob bo'ladi.",
    'В системе два неизвестных, поэтому ответ записывается парой. Записать только x значит дать половину ответа.',
    'A system has two unknowns, so the answer is written as a pair. Writing only x gives half an answer.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    pair: L('juftlik', 'пара', 'a pair'),
    one: L('faqat x', 'только x', 'x only'),
    three: L('uch son', 'три числа', 'three numbers'),
    none: L('yechib bo\'lmaydi', 'решить нельзя', 'cannot be solved'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['(2; 1) → 2', 'y = x + 1 → 0', 'y = 2x → (1; 2)', '(3; 1) → 4'],
  twoLabel: L('B6 bloki davom etadi', 'Блок Б6 продолжается', 'Block B6 continues'),
  twoA: L(
    'yechim  →  kesishish',
    'решение  →  пересечение',
    'the solution  →  the crossing',
  ),
  twoB: L(
    "chizmadan olingan  →  tekshiriladi",
    'взято с чертежа  →  проверяется',
    'taken from the drawing  →  gets checked',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    'variantlarni sanash',
    'подсчёт вариантов',
    'counting variants',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzating.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugungi ish ikki narsadan chiqdi: yechim -- kesishish, va u tekshiriladi.", 'Вся сегодняшняя работа вышла из двух вещей: решение это пересечение, и оно проверяется.', 'All of today came from two things: the solution is the crossing, and it gets checked.'),
    A('mount', "Keyingi dars blokni yopadi: variantlar sanaladi.", 'Следующий урок закрывает блок: считаем варианты.', 'The next lesson closes the block: counting variants.'),
  ],
}

export default makeLesson({
  id: LESSON_ID,
  title: LESSON_TITLE,
  no: LESSON_NO,
  block: BLOCK,
  tags: TAGS,
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
