// ============================================================================
// 7-sinf, Dars 45. PARALLEL CHIZIQLAR VA KESUVCHI.
// (Параллельные прямые и углы при секущей)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// BU DARS 44-DARSNING QARZINI YOPADI. O'sha darsda burchaklar yig'indisi
// O'LCHANDI va «qonuniyat» deb atalgan edi, isbot esa parallel chiziqlarga
// qoldirilgan edi. Shuning uchun KO'CHIRISH ekrani (13) bu yerda maishiy
// masala emas: uchdan asosga PARALLEL chiziq o'tkaziladi, va uchta burchak
// yoyilgan burchakni to'ldiradi. O'lchov xulosaga aylanadi.
//
// CHIZMA TUGUNLARDA QOTIRILGAN. Kesuvchi (-4;-4) dan (4;4) gacha o'tadi va
// parallel chiziqlarni AYNAN tugunlarda kesadi: (2;2) va (-2;-2). Shuning
// uchun burchak aynan 45 daraja bo'ladi va yorliq chizmaga yolg'on
// gapirmaydi. Bu tanlov tasodifiy emas: boshqa qiyalikda kesishish tugunga
// tushmaydi va yorliqdagi son chizmadan farq qilardi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_45'
const LESSON_TITLE = L('Parallel chiziqlar va kesuvchi', 'Параллельные прямые и секущая', 'Parallel lines and a transversal')
const LESSON_NO = L('45-dars', 'Урок 45', 'Lesson 45')
const BLOCK = { label: L('B7-blok', 'Блок Б7', 'Block B7'), from: 40, to: 48, current: 45 }

const TAGS = {
  Z1: L('mos burchaklar tengligi', 'равенство соответственных углов', 'the equality of corresponding angles'),
  Z2: L('almashinuvchi burchaklar', 'накрест лежащие углы', 'alternate angles'),
  Z3: L("bir tomonli burchaklar yig'indisi", 'сумма односторонних углов', 'the sum of co-interior angles'),
  Z4: L('parallellik sharti', 'условие параллельности', 'the condition for being parallel'),
  Z5: L("qo'shni burchak bilan aralashtirildi", 'спутано со смежным углом', 'confused with the adjacent angle'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Kesuvchi ikkinchi chiziqda qanday burchak beradi.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L('PARALLEL CHIZIQLAR', 'ПАРАЛЛЕЛЬНЫЕ ПРЯМЫЕ', 'PARALLEL LINES'),
  noBack: true,
  noNotes: true,
  title: L('Ikkinchi kesishishda', 'На втором пересечении', 'At the second crossing'),
  gate: {
    source: { kind: 'plain', tokens: ['45°', '?'] },
    rows: [
      { tokens: ['135°'], value: '135' },
      { tokens: ['45°'], value: '45' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Bitta kesuvchi ikki parallel chiziqni kesib o'tdi. Birinchi kesishishda burchak 45 daraja chiqdi. Ikkinchi kesishishda xuddi shu joydagi burchak nechcha daraja bo'ladi?",
      'Одна секущая пересекла две параллельные прямые. На первом пересечении угол вышел 45 градусов. Сколько градусов будет угол на том же месте второго пересечения?',
      'One transversal crossed two parallel lines. At the first crossing the angle came out 45 degrees. What will the angle in the same position at the second crossing be?',
    ),
    items: [
      {
        id: 'same',
        label: L('ham 45 daraja', 'тоже 45 градусов', '45 degrees as well'),
        hint: L(
          "Taxminingiz qabul qilindi. Chizmada tekshiramiz.",
          'Прогноз принят. Проверим на чертеже.',
          'Your prediction is taken. We will check it on the drawing.',
        ),
      },
      {
        id: 'adj',
        label: L('135 daraja', '135 градусов', '135 degrees'),
        hint: L(
          "Bir yuz o'ttiz besh chizmada bor, lekin boshqa joyda. Chizmada ko'rsatamiz.",
          'Сто тридцать пять на чертеже есть, но в другом месте. Покажем на чертеже.',
          'One hundred thirty five is on the drawing, but elsewhere. We will show it.',
        ),
      },
      {
        id: 'ninety',
        label: L('90 daraja', '90 градусов', '90 degrees'),
        hint: L(
          "To'qson faqat kesuvchi tik tushganda chiqadi, bu yerda esa u qiya.",
          'Девяносто выходит, только если секущая перпендикулярна, а здесь она наклонная.',
          'Ninety appears only when the transversal is perpendicular, and here it is slanted.',
        ),
      },
      {
        id: 'cant',
        label: L('bilib bo\'lmaydi', 'узнать нельзя', 'it cannot be known'),
        hint: L(
          "Bilib bo'ladi: chiziqlar parallel bo'lgani javob beradi.",
          'Можно: ответ даёт сама параллельность прямых.',
          'It can: the parallelism itself gives the answer.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Ikki parallel chiziq va bitta kesuvchi.", 'Две параллельные прямые и одна секущая.', 'Two parallel lines and one transversal.'),
    A('mount', "Birinchi kesishishdagi burchak qirq besh daraja. Ikkinchisida nechchi bo'ladi deb taxmin qilasiz.", 'Угол на первом пересечении сорок пять градусов. Каким, по-твоему, будет на втором.', 'The angle at the first crossing is forty five degrees. What do you predict at the second.'),
  ],
}

// ============================================================
// 2. TAYANCH. KVOTA EKRANI.
// ============================================================
const S2 = {
  kind: 'chain',
  role: 'support',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uchta savol', 'Три вопроса', 'Three questions'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Qanday chiziqlar parallel deb ataladi?",
        'Какие прямые называют параллельными?',
        'Which lines are called parallel?',
      ),
      ok: L("Kesishmaydigan chiziqlar: ular orasidagi masofa hamma joyda bir xil.", 'Те, что не пересекаются: расстояние между ними всюду одинаково.', 'Ones that never cross: the distance between them is the same everywhere.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('kesishmaydigan chiziqlar', 'не пересекающиеся прямые', 'lines that never cross'),
        },
        {
          id: 'b',
          tag: 'Z4',
          label: L('bir xil uzunlikdagi chiziqlar', 'прямые одной длины', 'lines of the same length'),
          hint: L("To'g'ri chiziq cheksiz, uzunligi haqida gapirib bo'lmaydi.", 'Прямая бесконечна, о её длине говорить нельзя.', 'A line is endless, its length cannot be spoken of.'),
        },
        {
          id: 'c',
          tag: 'Z4',
          label: L('tik turgan chiziqlar', 'вертикальные прямые', 'upright lines'),
          hint: L("Parallel chiziqlar qiya ham bo'lishi mumkin.", 'Параллельные могут быть и наклонными.', 'Parallel lines may be slanted too.'),
        },
        {
          id: 'd',
          tag: 'Z4',
          label: L('bir nuqtada kesishadigan', 'пересекающиеся в одной точке', 'meeting at one point'),
          hint: L("Aynan teskarisi: parallel chiziqlar kesishmaydi.", 'Как раз наоборот: параллельные не пересекаются.', 'Quite the opposite: parallel lines do not meet.'),
        },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Vertikal burchaklar haqida nima to'g'ri?",
        'Что верно о вертикальных углах?',
        'What is true about vertical angles?',
      ),
      ok: L("Ular teng.", 'Они равны.', 'They are equal.'),
      items: [
        { id: 'a', correct: true, label: L('ular teng', 'они равны', 'they are equal') },
        { id: 'b', tag: 'Z5', label: L("yig'indisi 180", 'их сумма 180', 'they sum to 180'), hint: L("Bu qo'shni burchaklar haqida.", 'Это про смежные углы.', 'That is about adjacent angles.') },
        { id: 'c', tag: 'Z5', label: L("har doim to'g'ri", 'всегда прямые', 'always right angles'), hint: L("Ular har qanday bo'lishi mumkin, faqat teng.", 'Они могут быть любыми, только равными.', 'They may be any size, only equal.') },
        { id: 'd', tag: 'Z5', label: L('yonma-yon turadi', 'стоят рядом', 'they stand side by side'), hint: L("Yonma-yon turganlari qo'shni.", 'Рядом стоят смежные.', 'The adjacent ones stand side by side.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Bir burchak 45 daraja. Uning qo'shnisi?",
        'Один угол 45 градусов. Его смежный?',
        'One angle is 45 degrees. Its adjacent one?',
      ),
      ok: L("Bir yuz sakson dan qirq besh ayirilsa bir yuz o'ttiz besh.", 'Сто восемьдесят минус сорок пять это сто тридцать пять.', 'One hundred eighty minus forty five is one hundred thirty five.'),
      items: [
        { id: 'a', label: '135°', correct: true },
        { id: 'b', label: '45°', tag: 'Z5', hint: L("Teng bo'lishi vertikal burchakda.", 'Равным бывает вертикальный угол.', 'The vertical one is the equal one.') },
        { id: 'c', label: '55°', tag: 'Z6', hint: L("Bir yuz sakson dan ayiriladi.", 'Вычитают из ста восьмидесяти.', 'Subtract from one hundred eighty.') },
        { id: 'd', label: '315°', tag: 'Z6', hint: L("Yig'indi 180, uch yuz oltmish emas.", 'Сумма 180, а не триста шестьдесят.', 'The sum is 180, not three hundred sixty.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch savol: parallellik, vertikal burchaklar va qo'shni burchak.", 'Три вопроса: параллельность, вертикальные углы и смежный угол.', 'Three questions: parallelism, vertical angles and the adjacent angle.'),
    A('1', "Ikkinchisi vertikal burchaklar haqida.", 'Второй про вертикальные углы.', 'The second is about vertical angles.'),
    A('2', "Uchinchisida qirq besh berilgan.", 'В третьем дано сорок пять.', 'The third gives forty five.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. MOS BURCHAKLAR TENG.
// Kesishishlar (2;2) va (-2;-2) tugunlarida, burchak aynan 45.
// ============================================================
const S3 = {
  kind: 'figure',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Bir xil joydagi burchaklar', 'Углы на одном и том же месте', 'Angles in the same position'),
  pts: {
    A: { x: -5, y: 2 }, B: { x: 5, y: 2 },
    C: { x: -5, y: -2 }, D: { x: 5, y: -2 },
    E: { x: -4, y: -4 }, F: { x: 4, y: 4 },
  },
  seg: [['A', 'B'], ['C', 'D'], ['E', 'F']],
  notes: [
    { x: 3.4, y: 2.7, text: '45°', mark: true },
    { x: -0.6, y: -1.3, text: '45°', mark: true },
  ],
  caption: L(
    "A B va C D parallel. E F kesuvchi ularni ikki joyda kesdi. Yoritilgan burchaklar bir xil joyda turadi: chiziqning ustida va kesuvchining o'ng tomonida.",
    'A B и C D параллельны. Секущая E F пересекла их в двух местах. Подсвеченные углы стоят на одном месте: над прямой и справа от секущей.',
    'A B and C D are parallel. The transversal E F crossed them in two places. The highlighted angles are in the same position: above the line and right of the transversal.',
  ),
  options: [
    { id: 'a', label: L('ular teng', 'они равны', 'they are equal') },
    { id: 'b', label: L("yig'indisi 180", 'их сумма 180', 'they sum to 180') },
    { id: 'c', label: L('ikkinchisi kattaroq', 'второй больше', 'the second is larger') },
    { id: 'd', label: L('ular bog\'liq emas', 'они не связаны', 'they are unrelated') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("180 boshqa juftlikda chiqadi: kesuvchining bir tomonidagi burchaklarda.", '180 выходит у другой пары: у углов с одной стороны секущей.', '180 appears for another pair: the angles on one side of the transversal.') },
    { key: 'c', tag: 'Z1', hint: L("Chizmadagi sonlarga qarang: ikkovi ham qirq besh.", 'Посмотри на числа на чертеже: оба сорок пять.', 'Look at the numbers on the drawing: both are forty five.') },
    { key: 'd', tag: 'Z1', hint: L("Bog'liq: chiziqlar parallel bo'lgani ularni bog'laydi.", 'Связаны: их связывает параллельность прямых.', 'They are linked: the parallel lines link them.') },
  ],
  note: L(
    "Parallel chiziqlarni kesuvchi kesganda BIR XIL JOYDA turgan burchaklar teng. Bunday burchaklar MOS burchaklar deb ataladi. Kesuvchi qiyaligini o'zgartirsa ikkovi birga o'zgaradi, lekin tengligi qolaveradi.",
    'Когда секущая пересекает параллельные прямые, углы, стоящие НА ОДНОМ МЕСТЕ, равны. Такие углы называются СООТВЕТСТВЕННЫМИ. Наклон секущей меняет их обоих сразу, но равенство остаётся.',
    'When a transversal crosses parallel lines, the angles in the SAME POSITION are equal. Such angles are called CORRESPONDING. Tilting the transversal changes both at once, but the equality stays.',
  ),
  audio: [
    A('mount', "Ikki parallel chiziq va bitta kesuvchi.", 'Две параллельные прямые и одна секущая.', 'Two parallel lines and one transversal.'),
    A('mount', "Yoritilgan burchaklar bir xil joyda turadi: chiziq ustida va kesuvchidan o'ngda.", 'Подсвеченные углы стоят на одном месте: над прямой и справа от секущей.', 'The highlighted angles are in the same position: above the line, right of the transversal.'),
  ],
}

// ============================================================
// 4. FARQLASH. UCH JUFTLIK: mos, almashinuvchi va bir tomonli.
// ============================================================
const S4 = {
  kind: 'figure',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Uchinchi juftlik', 'Третья пара', 'The third pair'),
  pts: {
    A: { x: -5, y: 2 }, B: { x: 5, y: 2 },
    C: { x: -5, y: -2 }, D: { x: 5, y: -2 },
    E: { x: -4, y: -4 }, F: { x: 4, y: 4 },
  },
  seg: [['A', 'B'], ['C', 'D'], ['E', 'F']],
  notes: [
    { x: 0.6, y: 1.4, text: '135°', mark: true },
    { x: -0.6, y: -1.3, text: '45°', mark: true },
  ],
  caption: L(
    "Endi boshqa juftlik yoritilgan: ikkovi ham kesuvchining o'ng tomonida, lekin biri yuqori chiziqning ostida, ikkinchisi pastki chiziqning ustida.",
    'Теперь подсвечена другая пара: оба справа от секущей, но один под верхней прямой, а другой над нижней.',
    'Now another pair is highlighted: both are right of the transversal, but one is below the upper line and the other above the lower one.',
  ),
  options: [
    { id: 'a', label: L("yig'indisi 180", 'их сумма 180', 'they sum to 180') },
    { id: 'b', label: L('ular teng', 'они равны', 'they are equal') },
    { id: 'c', label: L("yig'indisi 90", 'их сумма 90', 'they sum to 90') },
    { id: 'd', label: L('ular bog\'liq emas', 'они не связаны', 'they are unrelated') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Sonlarga qarang: qirq besh va bir yuz o'ttiz besh teng emas.", 'Посмотри на числа: сорок пять и сто тридцать пять не равны.', 'Look at the numbers: forty five and one hundred thirty five are not equal.') },
    { key: 'c', tag: 'Z3', hint: L("Qirq besh va bir yuz o'ttiz beshni qo'shib ko'ring.", 'Сложи сорок пять и сто тридцать пять.', 'Add forty five and one hundred thirty five.') },
    { key: 'd', tag: 'Z3', hint: L("Bog'liq: bittasi ikkinchisining qo'shnisiga teng.", 'Связаны: один равен смежному со вторым.', 'They are linked: one equals the neighbour of the other.') },
  ],
  note: L(
    "Kesuvchining BIR TOMONIDA, chiziqlarning ORASIDA turgan burchaklar BIR TOMONLI deb ataladi, va ularning yig'indisi 180 daraja. Kesuvchining IKKI TOMONIDA, chiziqlar orasida turganlari esa ALMASHINUVCHI burchaklar va ular teng.",
    'Углы, стоящие с ОДНОЙ СТОРОНЫ секущей и МЕЖДУ прямыми, называются ОДНОСТОРОННИМИ, и их сумма равна 180 градусам. А те, что по РАЗНЫЕ СТОРОНЫ секущей между прямыми, называются НАКРЕСТ ЛЕЖАЩИМИ и они равны.',
    'Angles on ONE SIDE of the transversal and BETWEEN the lines are called CO-INTERIOR, and they add to 180 degrees. Those on OPPOSITE sides of the transversal between the lines are ALTERNATE and they are equal.',
  ),
  audio: [
    A('mount', "Chizma o'sha-o'sha, yoritilgan juftlik esa boshqa.", 'Чертёж тот же, а подсвечена другая пара.', 'The same drawing, a different pair highlighted.'),
    A('mount', "Ikkovi kesuvchining bir tomonida va chiziqlar orasida turadi.", 'Оба с одной стороны секущей и между прямыми.', 'Both are on one side of the transversal and between the lines.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. Chizmasiz.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Chizmasiz', 'Без чертежа', 'Without a drawing'),
  given: L(
    "Kesuvchi ikki parallel chiziqni kesdi. Bir tomonli burchaklardan biri 110 daraja. Ikkinchisi nechcha daraja?",
    'Секущая пересекла две параллельные прямые. Один из односторонних углов 110 градусов. Сколько градусов второй?',
    'A transversal crossed two parallel lines. One co-interior angle is 110 degrees. How big is the other?',
  ),
  template: ['180° − 110° = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '70°' },
    { id: 'b', label: '110°' },
    { id: 'c', label: '80°' },
    { id: 'd', label: '250°' },
  ],
  answer: ['a'],
  prompt: L(
    "Ikkinchi burchakni hisoblang.",
    'Посчитай второй угол.',
    'Work out the second angle.',
  ),
  checkNote: L(
    "Bir tomonli burchaklarning yig'indisi 180 daraja, shuning uchun ikkinchisi ayirma bilan topiladi.",
    'Сумма односторонних углов 180 градусов, поэтому второй находится вычитанием.',
    'Co-interior angles add to 180 degrees, so the second comes from subtracting.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Teng bo'lishi mos va almashinuvchi burchaklarda, bir tomonlilarda esa yig'indi 180.", 'Равны соответственные и накрест лежащие, а у односторонних сумма 180.', 'Corresponding and alternate angles are equal; co-interior ones sum to 180.') },
    { key: 'c', tag: 'Z6', hint: L("Bir yuz sakson dan bir yuz o'n ayirilsa yetmish qoladi.", 'Сто восемьдесят минус сто десять это семьдесят.', 'One hundred eighty minus one hundred ten is seventy.') },
    { key: 'd', tag: 'Z3', hint: L("Yig'indi 180, shuning uchun ayiriladi.", 'Сумма 180, поэтому вычитают.', 'The sum is 180, so we subtract.') },
  ],
  audio: [
    A('mount', "Chizma yo'q, juftlikning nomi esa yetarli.", 'Чертежа нет, а названия пары достаточно.', 'No drawing, and the name of the pair is enough.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. IKKINCHI CHIZIQNI PARALLEL QILING.
// ============================================================
const S6 = {
  kind: 'figure',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Parallel qilib qo\'ying', 'Сделай параллельной', 'Make it parallel'),
  pts: { A: { x: -5, y: 2 }, B: { x: 5, y: 2 }, C: { x: -5, y: -2 }, D: { x: 4, y: -4 } },
  seg: [['A', 'B'], ['C', 'D']],
  move: 'D',
  pick: { x: 5, y: -2 },
  caption: L(
    "A B chizig'i gorizontal. D nuqtasini shunday ko'chiringki, C D chizig'i A B ga parallel bo'lsin.",
    'Прямая A B горизонтальна. Перенеси точку D так, чтобы прямая C D стала параллельна A B.',
    'The line A B is horizontal. Move the point D so that the line C D becomes parallel to A B.',
  ),
  options: [
    { id: 'a', label: L('chiziqlar orasidagi masofa hamma joyda bir xil', 'расстояние между прямыми всюду одинаково', 'the distance between the lines is the same everywhere') },
    { id: 'b', label: L('chiziqlar chetda kesishadi', 'прямые пересекутся у края', 'the lines cross near the edge') },
    { id: 'c', label: L('masofa o\'ngga borgan sari kattalashadi', 'расстояние растёт вправо', 'the distance grows to the right') },
    { id: 'd', label: L('chiziqlar ustma-ust tushdi', 'прямые совпали', 'the lines coincided') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z4', hint: L("Parallel chiziqlar kesishmaydi: ular hamma joyda to'rt katak masofada.", 'Параллельные не пересекаются: они всюду на расстоянии четырёх клеток.', 'Parallel lines never cross: they are four cells apart everywhere.') },
    { key: 'c', tag: 'Z4', hint: L("Ko'chirishdan OLDIN shunday edi. Endi masofa tenglashdi.", 'Так было ДО переноса. Теперь расстояние выровнялось.', 'That was BEFORE the move. Now the distance is even.') },
    { key: 'd', tag: 'Z4', hint: L("Ustma-ust tushmadi: ular to'rt katak masofada.", 'Не совпали: между ними четыре клетки.', 'They did not coincide: they are four cells apart.') },
  ],
  note: L(
    "Parallel chiziqlar orasidagi masofa hamma joyda bir xil. Aynan shu narsa mos burchaklarni teng qiladi: ikkinchi chiziq birinchisining aynan nusxasi, faqat pastga surilgan.",
    'Расстояние между параллельными прямыми всюду одинаково. Именно это делает соответственные углы равными: вторая прямая точная копия первой, только сдвинутая вниз.',
    'The distance between parallel lines is the same everywhere. That is exactly what makes corresponding angles equal: the second line is a copy of the first, only shifted down.',
  ),
  audio: [
    A('mount', "Pastki chiziq hozircha qiya turadi.", 'Нижняя прямая пока наклонная.', 'The lower line is slanted for now.'),
    A('mount', "D ni ko'chiring: chiziq gorizontal bo'lishi kerak.", 'Перенеси D: прямая должна стать горизонтальной.', 'Move D: the line must become horizontal.'),
    A('move', "Endi chiziqlar orasidagi kataklarni ikki joyda sanang.", 'Теперь посчитай клетки между прямыми в двух местах.', 'Now count the cells between the lines in two places.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT. KESUVCHI TIK TUSHDI.
// ============================================================
const S7 = {
  kind: 'figure',
  role: 'explain',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Kesuvchi tik tushganda', 'Когда секущая перпендикулярна', 'When the transversal is perpendicular'),
  pts: {
    A: { x: -5, y: 2 }, B: { x: 5, y: 2 },
    C: { x: -5, y: -2 }, D: { x: 5, y: -2 },
    E: { x: 0, y: -4 }, F: { x: 0, y: 4 },
  },
  seg: [['A', 'B'], ['C', 'D'], ['E', 'F']],
  notes: [
    { x: 1.2, y: 2.8, text: '90°', mark: true },
    { x: 1.2, y: -1.2, text: '90°', mark: true },
  ],
  caption: L(
    "Kesuvchi endi parallel chiziqlarga tik tushdi. Sakkiz burchak hosil bo'ldi.",
    'Теперь секущая перпендикулярна параллельным прямым. Получилось восемь углов.',
    'Now the transversal is perpendicular to the parallel lines. Eight angles appeared.',
  ),
  options: [
    { id: 'a', label: L('sakkizta ham 90 daraja', 'все восемь по 90 градусов', 'all eight are 90 degrees') },
    { id: 'b', label: L('to\'rttasi 90, to\'rttasi boshqa', 'четыре по 90, четыре другие', 'four are 90, four are not') },
    { id: 'c', label: L('ikkitasi 90, qolgani 45', 'два по 90, остальные 45', 'two are 90, the rest 45') },
    { id: 'd', label: L('burchak hosil bo\'lmaydi', 'углы не образуются', 'no angles appear') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Bir tomonli burchaklarning yig'indisi 180: 90 va 90 ham shu shartga to'g'ri keladi.", 'Сумма односторонних 180: девяносто и девяносто как раз подходят.', 'Co-interior angles sum to 180: ninety and ninety fit exactly.') },
    { key: 'c', tag: 'Z1', hint: L("Qirq besh qiya kesuvchida chiqardi, bu yerda esa u tik.", 'Сорок пять выходило у наклонной секущей, а здесь она перпендикулярна.', 'Forty five came from a slanted transversal, here it is perpendicular.') },
    { key: 'd', tag: 'Z1', hint: L("Hosil bo'ladi: har kesishishda to'rtta burchak bor.", 'Образуются: на каждом пересечении четыре угла.', 'They do: four angles at each crossing.') },
  ],
  note: L(
    "Kesuvchi tik tushganda sakkiz burchak ham 90 daraja bo'ladi. Uch juftlikning hammasi bir vaqtda bajariladi: mos burchaklar teng, almashinuvchilar teng, bir tomonlilar esa 90 qo'shuv 90, ya'ni 180.",
    'Когда секущая перпендикулярна, все восемь углов равны 90 градусам. Все три пары выполняются сразу: соответственные равны, накрест лежащие равны, а односторонние дают 90 плюс 90, то есть 180.',
    'With a perpendicular transversal all eight angles are 90 degrees. All three pairs hold at once: corresponding equal, alternate equal, and co-interior give 90 plus 90, that is 180.',
  ),
  audio: [
    A('mount', "Kesuvchini tik holatga qo'ydik.", 'Мы поставили секущую перпендикулярно.', 'We set the transversal upright.'),
    A('mount', "Endi burchaklar nechcha bo'lganini ayting.", 'Скажи, какими стали углы.', 'Say what the angles became.'),
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
    { id: 'f1', label: L('kesuvchi parallel chiziqlarni kesganda', 'когда секущая пересекает параллельные', 'when a transversal crosses parallel lines') },
    { id: 'f2', label: L('mos burchaklar teng bo\'ladi', 'соответственные углы равны', 'the corresponding angles are equal') },
    { id: 'f3', label: L('almashinuvchi burchaklar ham teng', 'накрест лежащие тоже равны', 'the alternate angles are equal too') },
    { id: 'f4', label: L("bir tomonlilarning yig'indisi 180", 'а сумма односторонних 180', 'and the co-interior ones sum to 180') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval shart, keyin ikki tenglik, oxirida yig'indi.",
    'Порядок нарушен. Сначала условие, потом два равенства, в конце сумма.',
    'The order is off. The condition first, then the two equalities, and the sum last.',
  ),
  lawChips: [
    { label: '=', tone: 's2' },
    { label: '180°', tone: 'off' },
    { label: '90°', tone: 's1' },
    { label: '( )', tone: 'par' },
  ],
  lawSweep: L(
    "tenglik, yig'indi, to'g'ri burchak, juftlik",
    'равенство, сумма, прямой угол, пара',
    'equality, the sum, the right angle, the pair',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Kesuvchi parallel chiziqlarni kesganda MOS burchaklar teng, ALMASHINUVCHI burchaklar teng, BIR TOMONLI burchaklarning yig'indisi esa 180 darajaga teng.",
        'Когда секущая пересекает параллельные прямые, СООТВЕТСТВЕННЫЕ углы равны, НАКРЕСТ ЛЕЖАЩИЕ углы равны, а сумма ОДНОСТОРОННИХ углов равна 180 градусам.',
        'When a transversal crosses parallel lines the CORRESPONDING angles are equal, the ALTERNATE angles are equal, and the CO-INTERIOR angles add to 180 degrees.',
      ),
      L(
        "Teskarisi ham to'g'ri va u parallellik ALOMATI: mos burchaklar teng bo'lsa yoki almashinuvchilar teng bo'lsa, chiziqlar parallel. Aynan shu alomat uchburchak burchaklari yig'indisini isbotlashga imkon beradi.",
        'Верно и обратное, и это ПРИЗНАК параллельности: если соответственные углы равны или равны накрест лежащие, прямые параллельны. Именно этот признак позволяет доказать сумму углов треугольника.',
        'The converse holds too and it is a TEST for parallelism: if the corresponding or the alternate angles are equal, the lines are parallel. It is this test that lets us prove the angle sum of a triangle.',
      ),
    ],
  },
  hookCap: L(
    'Mos burchaklar  --  teng',
    'Соответственные — равны',
    'Corresponding — equal',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L('bir xil joyda  --  mos', 'на одном месте это соответственные', 'same position means corresponding'),
    L('qarama-qarshi  --  almashinuvchi', 'по разные стороны это накрест лежащие', 'opposite sides means alternate'),
    L('bir tomonda  --  180', 'с одной стороны это 180', 'one side means 180'),
  ],
  audio: [
    A('mount', "Uch juftlikni ko'rdik. Endi qoidani yig'amiz.", 'Мы увидели три пары. Теперь соберём правило.', 'We saw three pairs. Now let us build the rule.'),
    A('ok', "To'g'ri. Endi shu qoida bilan o'tgan darsning qonuniyatini isbotlaymiz.", 'Верно. Теперь этим правилом докажем закономерность прошлого урока.', 'Correct. Now we use this rule to prove last lesson regularity.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI.
// ============================================================
const S9 = {
  kind: 'chain',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Juftlikni tanlang', 'Выбери пару', 'Pick the pair'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Mos burchaklardan biri 65 daraja. Ikkinchisi?",
        'Один из соответственных углов 65 градусов. Второй?',
        'One corresponding angle is 65 degrees. The other?',
      ),
      ok: L("Ham 65: mos burchaklar teng.", 'Тоже 65: соответственные равны.', '65 too: corresponding angles are equal.'),
      items: [
        { id: 'a', label: '65°', correct: true },
        { id: 'b', label: '115°', tag: 'Z3', hint: L("Bu bir tomonli burchak bo'lardi.", 'Это был бы односторонний угол.', 'That would be the co-interior angle.') },
        { id: 'c', label: '25°', tag: 'Z6', hint: L("To'qsonga to'ldirish boshqa masala.", 'Дополнение до девяноста это другая задача.', 'Filling up to ninety is another problem.') },
        { id: 'd', label: '35°', tag: 'Z6', hint: L("Mos burchaklar aynan teng.", 'Соответственные углы в точности равны.', 'Corresponding angles are exactly equal.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Bir tomonli burchaklardan biri 120 daraja. Ikkinchisi?",
        'Один из односторонних углов 120 градусов. Второй?',
        'One co-interior angle is 120 degrees. The other?',
      ),
      ok: L("Oltmish: yig'indisi bir yuz sakson.", 'Шестьдесят: их сумма сто восемьдесят.', 'Sixty: they sum to one hundred eighty.'),
      items: [
        { id: 'a', label: '60°', correct: true },
        { id: 'b', label: '120°', tag: 'Z3', hint: L("Teng bo'lishi mos va almashinuvchi burchaklarda.", 'Равны соответственные и накрест лежащие.', 'Corresponding and alternate angles are the equal ones.') },
        { id: 'c', label: '240°', tag: 'Z3', hint: L("Yig'indi 180 daraja.", 'Сумма 180 градусов.', 'The sum is 180 degrees.') },
        { id: 'd', label: '30°', tag: 'Z6', hint: L("Bir yuz sakson dan bir yuz yigirma ayirilsa oltmish.", 'Сто восемьдесят минус сто двадцать это шестьдесят.', 'One hundred eighty minus one hundred twenty is sixty.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Almashinuvchi burchaklar teng chiqdi. Chiziqlar haqida nima aytish mumkin?",
        'Накрест лежащие углы вышли равными. Что можно сказать о прямых?',
        'The alternate angles came out equal. What can be said about the lines?',
      ),
      ok: L("Ular parallel: bu parallellik alomati.", 'Они параллельны: это признак параллельности.', 'They are parallel: that is the test for parallelism.'),
      items: [
        { id: 'a', correct: true, label: L('ular parallel', 'они параллельны', 'they are parallel') },
        { id: 'b', tag: 'Z4', label: L('ular kesishadi', 'они пересекаются', 'they cross'), hint: L("Kesishsa burchaklar teng chiqmasdi.", 'Если бы пересекались, углы не вышли бы равными.', 'If they crossed the angles would not be equal.') },
        { id: 'c', tag: 'Z4', label: L('bilib bo\'lmaydi', 'узнать нельзя', 'it cannot be known'), hint: L("Bilish mumkin: teskari qoida ham to'g'ri.", 'Можно: обратное правило тоже верно.', 'It can: the converse rule holds too.') },
        { id: 'd', tag: 'Z4', label: L('ular perpendikulyar', 'они перпендикулярны', 'they are perpendicular'), hint: L("Perpendikulyarlik burchak 90 bo'lganda bo'ladi.", 'Перпендикулярность бывает, когда угол 90.', 'Perpendicular means the angle is 90.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Kesuvchi ikki parallel chiziq bilan nechta burchak hosil qiladi?",
        'Сколько углов образует секущая с двумя параллельными прямыми?',
        'How many angles does a transversal make with two parallel lines?',
      ),
      ok: L("Sakkizta: har kesishishda to'rtta.", 'Восемь: по четыре на каждом пересечении.', 'Eight: four at each crossing.'),
      items: [
        { id: 'a', label: '8', correct: true },
        { id: 'b', label: '4', tag: 'Z6', hint: L("To'rttasi bitta kesishishda, kesishish esa ikkita.", 'Четыре на одном пересечении, а пересечений два.', 'Four at one crossing, and there are two crossings.') },
        { id: 'c', label: '6', tag: 'Z6', hint: L("Har kesishishda to'rtta burchak bor.", 'На каждом пересечении по четыре угла.', 'Each crossing has four angles.') },
        { id: 'd', label: '2', tag: 'Z6', hint: L("Ikkita kesishish bor, har birida to'rtta burchak.", 'Пересечений два, и в каждом четыре угла.', 'There are two crossings with four angles each.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Juftlikning nomiga diqqat qiling.", 'Четыре вопроса. Следи за названием пары.', 'Four questions. Watch the name of the pair.'),
    A('1', "Ikkinchisi bir tomonli burchaklar haqida.", 'Второй про односторонние углы.', 'The second is about co-interior angles.'),
    A('2', "Uchinchisi teskari qoida haqida.", 'Третий про обратное правило.', 'The third is about the converse.'),
    A('3', "Oxirgisida burchaklarni sanang.", 'В последнем посчитай углы.', 'In the last one count the angles.'),
  ],
}

// ============================================================
// 10. MASHQ 2. IKKI QADAM.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Mos va bir tomonli', 'Соответственный и односторонний', 'Corresponding and co-interior'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  given: L(
    "Kesuvchi ikki parallel chiziqni kesdi va bir burchak 72 daraja chiqdi. Unga MOS burchakni va u bilan BIR TOMONLI burchakni yozing.",
    'Секущая пересекла две параллельные прямые, и один угол вышел 72 градуса. Запиши СООТВЕТСТВЕННЫЙ ему угол и ОДНОСТОРОННИЙ с ним.',
    'A transversal crossed two parallel lines and one angle came out 72 degrees. Write the CORRESPONDING angle and the CO-INTERIOR one.',
  ),
  template: ['72°  →  ', { slot: 0 }, ',   180° − 72° = ', { slot: 1 }],
  parts: [
    { id: 'a', label: '72°' },
    { id: 'b', label: '108°' },
    { id: 'c', label: '18°' },
    { id: 'd', label: '144°' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Mos burchakni va bir tomonli burchakni yozing.",
    'Запиши соответственный угол и односторонний.',
    'Write the corresponding angle and the co-interior one.',
  ),
  checkNote: L(
    "Mos burchak berilganiga teng, bir tomonli esa uni 180 gacha to'ldiradi. Ikkovi bir chizmada yonma-yon turadi va ularni almashtirmaslik kerak.",
    'Соответственный угол равен данному, а односторонний дополняет его до 180. Оба стоят рядом на одном чертеже, и их не надо путать.',
    'The corresponding angle equals the given one, the co-interior one fills it to 180. Both sit side by side on one drawing and must not be swapped.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z6', hint: L("To'qsonga to'ldirish boshqa masala.", 'Дополнение до девяноста это другая задача.', 'Filling up to ninety is another problem.') },
    { key: 'd', tag: 'Z3', hint: L("Ikki barobar qilish emas, 180 gacha to'ldirish kerak.", 'Нужно не удвоить, а дополнить до 180.', 'Not doubling but filling up to 180.') },
    { key: '*', tag: 'Z1', hint: L("Birinchi bo'shliq tenglik, ikkinchisi ayirma.", 'Первый пропуск это равенство, второй разность.', 'The first gap is equality, the second a difference.') },
  ],
  probe: {
    question: L("Almashinuvchi burchak nechcha daraja?", 'Сколько градусов накрест лежащий угол?', 'How big is the alternate angle?'),
    items: [
      { id: 'a', correct: true, label: '72°' },
      { id: 'b', tag: 'Z2', label: '108°', hint: L("Bir yuz sakkiz bir tomonli burchak edi.", 'Сто восемь это был односторонний угол.', 'One hundred eight was the co-interior angle.') },
      { id: 'c', tag: 'Z2', label: '18°', hint: L("Almashinuvchi burchak berilganiga teng.", 'Накрест лежащий равен данному.', 'The alternate angle equals the given one.') },
      { id: 'd', tag: 'Z2', label: '90°', hint: L("To'qson faqat tik kesuvchida chiqadi.", 'Девяносто выходит только у перпендикулярной секущей.', 'Ninety appears only with a perpendicular transversal.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam: mos burchak va bir tomonli burchak.", 'Два шага: соответственный угол и односторонний.', 'Two steps: the corresponding angle and the co-interior one.'),
    A('two', "Endi ikkinchi juftlik.", 'Теперь вторая пара.', 'Now the second pair.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Almashinuvchi burchak', 'Накрест лежащий угол', 'The alternate angle'),
  given: L(
    "Kesuvchi ikki parallel chiziqni kesdi. Almashinuvchi burchaklardan biri 38 daraja. Ikkinchisi nechcha daraja?",
    'Секущая пересекла две параллельные прямые. Один из накрест лежащих углов 38 градусов. Сколько градусов второй?',
    'A transversal crossed two parallel lines. One alternate angle is 38 degrees. How big is the other?',
  ),
  template: ['38°  =  ', { slot: 0 }],
  parts: [
    { id: 'a', label: '38°' },
    { id: 'b', label: '142°' },
    { id: 'c', label: '52°' },
    { id: 'd', label: '76°' },
  ],
  answer: ['a'],
  prompt: L(
    "Ikkinchi burchakni yozing.",
    'Запиши второй угол.',
    'Write the second angle.',
  ),
  checkNote: L(
    "Almashinuvchi burchaklar teng, shuning uchun hisoblash kerak emas: ikkinchisi ham 38 daraja.",
    'Накрест лежащие углы равны, поэтому считать не нужно: второй тоже 38 градусов.',
    'Alternate angles are equal, so nothing needs computing: the second is 38 degrees too.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Bu bir tomonli burchak bo'lardi.", 'Это был бы односторонний угол.', 'That would be the co-interior angle.') },
    { key: 'c', tag: 'Z6', hint: L("To'qsonga to'ldirish boshqa masala.", 'Дополнение до девяноста это другая задача.', 'Filling up to ninety is another problem.') },
    { key: 'd', tag: 'Z2', hint: L("Ikki barobar qilish kerak emas: burchaklar teng.", 'Удваивать не нужно: углы равны.', 'No doubling: the angles are equal.') },
  ],
  audio: [
    A('mount', "Bu safar yordam yo'q. Juftlikning nomiga qarang.", 'На этот раз без помощи. Смотри на название пары.', 'No help this time. Look at the name of the pair.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Juftlik TO'G'RI nomlangan, lekin chiziqlar
// PARALLEL EMAS.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Juftlik to'g'ri nomlangan. Shunday bo'lsa ham, qaysi qator xato?",
    'Пара названа верно. И всё же какая строка ошибочна?',
    'The pair is named correctly. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: L('ikki chiziqni kesuvchi kesdi', 'секущая пересекла две прямые', 'a transversal crossed two lines') },
    { id: 'r2', text: L('chiziqlar parallelligi ma\'lum emas', 'о параллельности прямых не сказано', 'nothing is said about them being parallel') },
    { id: 'r3', text: L('bu burchaklar mos burchaklar', 'эти углы соответственные', 'these angles are corresponding') },
    { id: 'r4', text: L('chiziqlar parallel', 'прямые параллельны', 'the lines are parallel') },
    { id: 'r5', text: L('demak ular teng', 'значит они равны', 'so they are equal') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu shart.", 'Это условие.', 'That is the condition.'),
    r2: L("To'g'ri: parallellik haqida hech narsa aytilmagan.", 'Верно: про параллельность ничего не сказано.', 'Right: nothing was said about parallelism.'),
    r3: L("To'g'ri: joylashuvi bo'yicha ular haqiqatda mos burchaklar.", 'Верно: по расположению это действительно соответственные углы.', 'Right: by position they really are corresponding angles.'),
      r5: L("Bu qator oldingisidan chiqqan. Xato esa undan YUQORIDA.", 'Эта строка выходит из предыдущей. А ошибка ВЫШЕ неё.', 'This line follows from the one before. The mistake is ABOVE it.'),
  },
  tags: { r1: 'Z4', r2: 'Z4', r3: 'Z1' , r5: 'Z4' },
  proofFill: {
    template: [{ slot: 0 }, '   →   ', { slot: 1 }],
    parts: [
      { id: 'a', label: L('parallellik yo\'q', 'параллельности нет', 'there is no parallelism') },
      { id: 'b', label: L('tenglik chiqmaydi', 'равенства не выходит', 'no equality follows') },
      { id: 'c', label: L('parallellik bor', 'параллельность есть', 'they are parallel') },
      { id: 'd', label: L('tenglik chiqadi', 'равенство выходит', 'equality follows') },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Shartni va xulosani tuzating.",
      'Исправь условие и вывод.',
      'Fix the condition and the conclusion.',
    ),
    checkNote: L(
      "Mos burchaklar TENG bo'lishi faqat chiziqlar PARALLEL bo'lganda. Joylashuvning nomi tenglikni bermaydi: qiya chiziqlarda ham mos burchaklar bor, lekin ular har xil.",
      'Соответственные углы РАВНЫ только тогда, когда прямые ПАРАЛЛЕЛЬНЫ. Название расположения равенства не даёт: у непараллельных прямых соответственные углы тоже есть, но они разные.',
      'Corresponding angles are EQUAL only when the lines are PARALLEL. The name of the position gives no equality: non-parallel lines have corresponding angles too, but different ones.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z4', hint: L("Qatorda yozilgan: parallellik haqida hech narsa ma'lum emas.", 'В строке написано: о параллельности ничего не известно.', 'The line says: nothing is known about parallelism.') },
      { key: 'd', tag: 'Z4', hint: L("Tenglik parallellikdan chiqadi, nomdan emas.", 'Равенство идёт от параллельности, а не от названия.', 'Equality comes from parallelism, not from a name.') },
      { key: '*', tag: 'Z4', hint: L("Shart yetishmaydi.", 'Не хватает условия.', 'A condition is missing.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda juftlik to'g'ri nomlangan.", 'В этой ловушке пара названа верно.', 'In this trap the pair is named correctly.'),
    A('mount', "Lekin bitta shart yetishmaydi. Qaysi biri.", 'Но не хватает одного условия. Какого.', 'But one condition is missing. Which one.'),
    A('proof', "Topdingiz. Parallellik haqida hech narsa aytilmagan edi.", 'Нашёл. Про параллельность ничего не было сказано.', 'You found it. Nothing was said about parallelism.'),
    A('done', "Nom joylashuvni beradi, tenglikni esa parallellik beradi.", 'Название даёт расположение, а равенство даёт параллельность.', 'A name gives the position, parallelism gives the equality.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. 44-DARSNING QARZI YOPILADI: uchdan asosga
// PARALLEL chiziq o'tkazamiz, va uchta burchak yoyilgan burchakni
// to'ldiradi.
// ============================================================
const S13 = {
  kind: 'figure',
  role: 'transfer',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Yig\'indi isbotlanadi', 'Сумма получает доказательство', 'The sum gets its proof'),
  pts: {
    G: { x: -5, y: 2 }, H: { x: 5, y: 2 },
    A: { x: -3, y: -2 }, B: { x: 3, y: -2 }, C: { x: 0, y: 2 },
  },
  seg: [['G', 'H'], ['A', 'B'], ['B', 'C'], ['C', 'A']],
  notes: [
    { x: -1.5, y: 1.5, text: '1', mark: true },
    { x: 0, y: 1.2, text: '3' },
    { x: 1.5, y: 1.5, text: '2', mark: true },
    { x: -2.1, y: -1.3, text: '1', mark: true },
    { x: 2.1, y: -1.3, text: '2', mark: true },
  ],
  caption: L(
    "Uchburchakning C uchidan asosga PARALLEL chiziq o'tkazdik. Uchdagi uchta burchak yoyilgan burchakni to'ldiradi.",
    'Через вершину C провели прямую, ПАРАЛЛЕЛЬНУЮ основанию. Три угла при вершине заполняют развёрнутый угол.',
    'Through the vertex C we drew a line PARALLEL to the base. The three angles at the vertex fill a straight angle.',
  ),
  options: [
    { id: 'a', label: L("almashinuvchi burchaklar teng, demak yig'indi 180", 'накрест лежащие равны, значит сумма 180', 'alternate angles are equal, so the sum is 180') },
    { id: 'b', label: L("chizmada shunday chiqdi", 'так вышло на чертеже', 'that is how the drawing came out') },
    { id: 'c', label: L("burchaklarni o'lchash kerak", 'надо измерить углы', 'the angles must be measured') },
    { id: 'd', label: L('bu faqat shu uchburchakda', 'это только в этом треугольнике', 'this holds only in this triangle') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Chizma emas: 1 va 1 almashinuvchi burchaklar, 2 va 2 ham almashinuvchi. Ular parallellik tufayli teng.", 'Не чертёж: 1 и 1 накрест лежащие, 2 и 2 тоже. Они равны из-за параллельности.', 'Not the drawing: 1 and 1 are alternate angles, so are 2 and 2. They are equal because of the parallel line.') },
    { key: 'c', tag: 'Z2', hint: L("O'lchash kerak emas: tenglik qoidadan chiqadi.", 'Измерять не нужно: равенство идёт из правила.', 'No measuring: the equality comes from the rule.') },
    { key: 'd', tag: 'Z2', hint: L("Har qanday uchburchakda uchdan parallel chiziq o'tkazish mumkin.", 'В любом треугольнике можно провести через вершину параллельную прямую.', 'In any triangle a parallel line can be drawn through the vertex.') },
  ],
  note: L(
    "Uchdagi uchta burchak birga yoyilgan burchakni beradi, ya'ni 180 daraja. Ularning ikkitasi uchburchakning burchaklariga ALMASHINUVCHI, demak teng, uchinchisi esa uchburchakning uchinchi burchagining o'zi. Shuning uchun uchburchak burchaklari yig'indisi 180 daraja. O'tgan darsdagi o'lchov endi xulosaga aylandi.",
    'Три угла при вершине вместе дают развёрнутый угол, то есть 180 градусов. Два из них НАКРЕСТ ЛЕЖАЩИЕ с углами треугольника, значит равны им, а третий и есть третий угол треугольника. Поэтому сумма углов треугольника равна 180 градусам. Измерение прошлого урока стало выводом.',
    'The three angles at the vertex make a straight angle, that is 180 degrees. Two of them are ALTERNATE to the angles of the triangle, so equal to them, and the third is the third angle itself. Hence the angles of a triangle add to 180 degrees. Last lesson measurement has become a conclusion.',
  ),
  audio: [
    A('mount', "O'tgan darsda yig'indini o'lchagan edik va isbotni shu darsga qoldirgan edik.", 'На прошлом уроке мы измерили сумму и оставили доказательство на этот урок.', 'Last lesson we measured the sum and left the proof for today.'),
    A('mount', "Uchdan asosga parallel chiziq o'tkazdik. Bir xil raqamlar almashinuvchi burchaklarni ko'rsatadi.", 'Через вершину провели прямую, параллельную основанию. Одинаковые цифры показывают накрест лежащие углы.', 'Through the vertex we drew a line parallel to the base. Equal digits mark the alternate angles.'),
    A('mount', "Uchdagi uchta burchak to'g'ri chiziqni to'ldiradi.", 'Три угла при вершине заполняют прямую линию.', 'The three angles at the vertex fill a straight line.'),
  ],
}

// ============================================================
// 14. BLITS.
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
        "Mos burchaklardan biri 50 daraja. Ikkinchisi?",
        'Один из соответственных углов 50 градусов. Второй?',
        'One corresponding angle is 50 degrees. The other?',
      ),
      ok: L("Ham 50 daraja.", 'Тоже 50 градусов.', '50 degrees too.'),
      items: [
        { id: 'a', label: '50°', correct: true },
        { id: 'b', label: '130°', tag: 'Z3', hint: L("Bu bir tomonli burchak.", 'Это односторонний угол.', 'That is the co-interior angle.') },
        { id: 'c', label: '40°', tag: 'Z6', hint: L("To'qsonga to'ldirish boshqa masala.", 'Дополнение до девяноста это другая задача.', 'Filling up to ninety is another problem.') },
        { id: 'd', label: '100°', tag: 'Z2', hint: L("Ikki barobar qilish kerak emas.", 'Удваивать не нужно.', 'No doubling needed.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Bir tomonli burchaklar haqida nima to'g'ri?",
        'Что верно об односторонних углах?',
        'What is true about co-interior angles?',
      ),
      ok: L("Yig'indisi 180 daraja.", 'Их сумма 180 градусов.', 'They add to 180 degrees.'),
      items: [
        { id: 'a', correct: true, label: L("yig'indisi 180", 'сумма 180', 'they sum to 180') },
        { id: 'b', tag: 'Z3', label: L('ular teng', 'они равны', 'they are equal'), hint: L("Teng bo'lishi mos va almashinuvchilarda.", 'Равны соответственные и накрест лежащие.', 'The equal ones are corresponding and alternate.') },
        { id: 'c', tag: 'Z3', label: L("yig'indisi 90", 'сумма 90', 'they sum to 90'), hint: L("Ular yoyilgan burchakni to'ldiradi.", 'Они заполняют развёрнутый угол.', 'They fill a straight angle.') },
        { id: 'd', tag: 'Z3', label: L('ular vertikal', 'они вертикальные', 'they are vertical'), hint: L("Vertikal burchaklar bir kesishishda bo'ladi.", 'Вертикальные углы бывают на одном пересечении.', 'Vertical angles occur at one crossing.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Mos burchaklar teng chiqdi. Chiziqlar parallelmi?",
        'Соответственные углы вышли равными. Прямые параллельны?',
        'The corresponding angles came out equal. Are the lines parallel?',
      ),
      ok: L("Ha: bu parallellik alomati.", 'Да: это признак параллельности.', 'Yes: that is the test for parallelism.'),
      items: [
        { id: 'a', correct: true, label: L('ha', 'да', 'yes') },
        { id: 'b', tag: 'Z4', label: L("yo'q", 'нет', 'no'), hint: L("Teskari qoida ham to'g'ri.", 'Обратное правило тоже верно.', 'The converse rule holds too.') },
        { id: 'c', tag: 'Z4', label: L("o'lchash kerak", 'нужно измерить', 'measuring is needed'), hint: L("Tenglik allaqachon berilgan.", 'Равенство уже дано.', 'The equality is already given.') },
        { id: 'd', tag: 'Z4', label: L('faqat tik kesuvchida', 'только при перпендикулярной секущей', 'only with a perpendicular transversal'), hint: L("Kesuvchi qiya bo'lsa ham ishlaydi.", 'Работает и с наклонной секущей.', 'It works with a slanted transversal too.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uchburchak burchaklari yig'indisi nima uchun 180?",
        'Почему сумма углов треугольника равна 180?',
        'Why do the angles of a triangle add to 180?',
      ),
      ok: L("Uchdan parallel chiziq o'tkazilganda almashinuvchi burchaklar teng bo'ladi va uchtasi yoyilgan burchakni to'ldiradi.", 'Через вершину проводят параллельную прямую, накрест лежащие углы равны, и три угла заполняют развёрнутый.', 'A parallel line through the vertex makes the alternate angles equal, and the three fill a straight angle.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('almashinuvchi burchaklar tufayli', 'из-за накрест лежащих углов', 'because of the alternate angles'),
        },
        {
          id: 'b',
          tag: 'Z2',
          label: L("o'lchov shunday ko'rsatgani uchun", 'потому что так показало измерение', 'because the measurement showed so'),
          hint: L("O'lchov taxmin edi, isbot esa parallel chiziqdan chiqdi.", 'Измерение было предположением, а доказательство вышло из параллельной прямой.', 'The measurement was a guess; the proof came from the parallel line.'),
        },
        {
          id: 'c',
          tag: 'Z2',
          label: L('shunchaki qoida', 'просто такое правило', 'it is just a rule'),
          hint: L("Qoidaning sababi bor, va biz uni ko'rdik.", 'У правила есть причина, и мы её видели.', 'The rule has a reason, and we saw it.'),
        },
        {
          id: 'd',
          tag: 'Z3',
          label: L("bir tomonli burchaklar tufayli", 'из-за односторонних углов', 'because of the co-interior angles'),
          hint: L("Isbotda almashinuvchi burchaklar ishlatildi.", 'В доказательстве работали накрест лежащие углы.', 'The proof used the alternate angles.'),
        },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Yagona baholanadigan ekran.", 'Блиц, четыре вопроса. Единственный оцениваемый экран.', 'Quick round, four questions. The only graded screen.'),
    A('1', "Ikkinchisi bir tomonli burchaklar haqida.", 'Второй про односторонние углы.', 'The second is about co-interior angles.'),
    A('2', "Uchinchisi parallellik alomati haqida.", 'Третий про признак параллельности.', 'The third is about the test for parallelism.'),
    A('3', "Oxirgisi isbot haqida.", 'Последний про доказательство.', 'The last is about the proof.'),
  ],
}

// ============================================================
// 15. YAKUN.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Parallellik burchaklarni bog\'laydi', 'Параллельность связывает углы', 'Parallelism ties the angles together'),
  gate: S1.gate,
  fix: {
    tokens: ['45°'],
    value: '45',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Mos burchaklar teng, shuning uchun ikkinchi kesishishda ham qirq besh daraja. Bir yuz o'ttiz besh chizmada bor, lekin u qo'shni burchak.",
    'Соответственные углы равны, поэтому и на втором пересечении сорок пять градусов. Сто тридцать пять на чертеже есть, но это смежный угол.',
    'Corresponding angles are equal, so the second crossing also gives forty five degrees. One hundred thirty five is on the drawing, but that is the adjacent angle.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    same: L('ham 45 daraja', 'тоже 45 градусов', '45 degrees too'),
    adj: L('135 daraja', '135 градусов', '135 degrees'),
    ninety: L('90 daraja', '90 градусов', '90 degrees'),
    cant: L('bilib bo\'lmaydi', 'узнать нельзя', 'cannot be known'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['45° = 45°', '180 − 110 = 70', '90°', '180'],
  twoLabel: L('Uch juftlik', 'Три пары', 'Three pairs'),
  twoA: L(
    'mos va almashinuvchi  →  teng',
    'соответственные и накрест лежащие  →  равны',
    'corresponding and alternate  →  equal',
  ),
  twoB: L(
    'bir tomonli  →  180',
    'односторонние  →  180',
    'co-interior  →  180',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "to'g'ri burchakli uchburchak va tomonlar bilan burchaklar nisbati",
    'прямоугольные треугольники и соотношения сторон и углов',
    'right triangles and how sides relate to angles',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz.", 'Вернёмся к началу. Вот что ты предполагал.', 'Back to the start. This is what you predicted.'),
    A('mount', "Bugun o'tgan darsning qarzi yopildi: yig'indi endi o'lchov emas, xulosa.", 'Сегодня закрыт долг прошлого урока: сумма теперь не измерение, а вывод.', 'Today last lesson debt is paid: the sum is now a conclusion, not a measurement.'),
    A('mount', "Keyingi darsda to'g'ri burchakli uchburchakni ko'ramiz.", 'На следующем уроке рассмотрим прямоугольный треугольник.', 'Next lesson we look at the right triangle.'),
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
