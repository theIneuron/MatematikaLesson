// ============================================================================
// 7-sinf, Dars 42. UCHBURCHAKLAR TENGLIGI ALOMATLARI.
// (Признаки равенства треугольников)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// SHU DARSDAN «O'LCHOV ISBOT EMAS» TALABI ISHGA TUSHADI (etalon § 9): asbob
// o'lchagan yig'indi endi «taxmin» deb imzolanadi (`guess: true`). 40 va
// 41-darslarda o'lchash temaning o'zi edi, shuning uchun u yerda yorliq
// yo'q edi.
//
// DARSNING O'ZAGI ASBOB BILAN KO'RSATILADI, MATN BILAN EMAS. Ikki tomon
// yetarli emasligi shunday chiqadi: A va B qotib turadi, C esa boshqa
// tugunga ko'chadi, va A C tomoni O'SHA-O'SHA besh bo'lib qoladi -- lekin
// burchak o'zgardi va uchinchi tomon o'zgardi. Ya'ni «ikki tomon mos keldi»
// hech nimani isbotlamaydi. Uch tugun maxsus tanlangan: A(-4;-1) dan besh
// masofada bir nechta to'r tuguni bor, va ular chizmada aniq ko'rinadi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_42'
const LESSON_TITLE = L('Uchburchaklar tengligi alomatlari', 'Признаки равенства треугольников', 'Tests for congruent triangles')
const LESSON_NO = L('42-dars', 'Урок 42', 'Lesson 42')
const BLOCK = { label: L('B7-blok', 'Блок Б7', 'Block B7'), from: 40, to: 48, current: 42 }

const TAGS = {
  Z1: L('ikki element yetarli deb hisoblandi', 'два элемента приняты за достаточные', 'two elements taken as enough'),
  Z2: L("burchak tomonlar orasida emas", 'угол не между сторонами', 'the angle is not between the sides'),
  Z3: L('burchaklar bo\'yicha tenglik', 'равенство по углам', 'congruence claimed from angles'),
  Z4: L("o'lchov isbot deb olindi", 'измерение принято за доказательство', 'a measurement taken as proof'),
  Z5: L('alomat tanlanmadi', 'признак не выбран', 'the test was not chosen'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Ikki tomon mos keldi -- bu yetarlimi.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L('TENGLIK ALOMATLARI', 'ПРИЗНАКИ РАВЕНСТВА', 'TESTS FOR CONGRUENCE'),
  noBack: true,
  noNotes: true,
  title: L('Nechta element kerak', 'Сколько элементов нужно', 'How many elements are needed'),
  gate: {
    source: { kind: 'plain', tokens: ['5', '6', '?'] },
    rows: [
      { tokens: [L('yetarli', 'достаточно', 'enough')], value: '2' },
      { tokens: [L('kerak', 'нужен', 'needed')], value: '3' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Ikki uchburchakda ikkita tomon mos keldi: 5 va 6. Ular teng bo'lishi uchun shu yetarlimi, yoki uchinchi element ham kerakmi?",
      'У двух треугольников совпали две стороны: 5 и 6. Достаточно ли этого для их равенства, или нужен третий элемент?',
      'Two triangles have two matching sides: 5 and 6. Is that enough for them to be equal, or is a third element needed?',
    ),
    items: [
      {
        id: 'three',
        label: L('uchinchi element kerak', 'нужен третий элемент', 'a third element is needed'),
        hint: L(
          "Taxminingiz qabul qilindi. Chizmada tekshiramiz.",
          'Прогноз принят. Проверим на чертеже.',
          'Your prediction is taken. We will check it on the drawing.',
        ),
      },
      {
        id: 'two',
        label: L('ikkita yetarli', 'двух достаточно', 'two are enough'),
        hint: L(
          "Chizmada tekshiramiz: ikki tomonni qoldirib, uchinchisini o'zgartirib ko'ramiz.",
          'Проверим на чертеже: оставим две стороны и попробуем изменить третью.',
          'We will check on the drawing: keep two sides and try changing the third.',
        ),
      },
      {
        id: 'always',
        label: L('ular har doim teng', 'они всегда равны', 'they are always equal'),
        hint: L(
          "Har doim emas: ikki tomon saqlanib, uchburchak boshqa bo'lib qolishi mumkin.",
          'Не всегда: две стороны могут сохраниться, а треугольник стать другим.',
          'Not always: two sides may stay while the triangle becomes different.',
        ),
      },
      {
        id: 'never',
        label: L('hech qachon aytib bo\'lmaydi', 'сказать нельзя никогда', 'it can never be told'),
        hint: L(
          "Aytish mumkin: shart to'g'ri tanlansa, tenglik isbotlanadi.",
          'Сказать можно: при верно выбранном условии равенство доказывается.',
          'It can be told: with the right condition the equality is proved.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Ikki uchburchakda ikki tomon bir xil chiqdi: besh va olti.", 'У двух треугольников две стороны вышли одинаковыми: пять и шесть.', 'Two triangles have two sides the same: five and six.'),
    A('mount', "Savol: shu bilan uchburchaklar teng deb aytish mumkinmi.", 'Вопрос: можно ли уже сказать, что треугольники равны.', 'The question: can we already say the triangles are equal.'),
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
        "Uchburchakda nechta element bor: tomonlar va burchaklar birga?",
        'Сколько элементов у треугольника: стороны и углы вместе?',
        'How many elements does a triangle have: sides and angles together?',
      ),
      ok: L("Uch tomon va uch burchak: oltita element.", 'Три стороны и три угла: шесть элементов.', 'Three sides and three angles: six elements.'),
      items: [
        { id: 'a', label: '6', correct: true },
        { id: 'b', label: '3', tag: 'Z1', hint: L("Uchta tomon bor, lekin burchaklar ham sanaladi.", 'Три стороны есть, но углы тоже считаются.', 'There are three sides, but the angles count too.') },
        { id: 'c', label: '4', tag: 'Z1', hint: L("Uch tomon va uch burchak bor.", 'Есть три стороны и три угла.', 'There are three sides and three angles.') },
        { id: 'd', label: '9', tag: 'Z6', hint: L("Uch qo'shuv uch olti bo'ladi.", 'Три плюс три это шесть.', 'Three plus three is six.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Ikki uchburchak teng deganda nima tushuniladi?",
        'Что значит, что два треугольника равны?',
        'What does it mean that two triangles are equal?',
      ),
      ok: L("Ustma-ust qo'yilganda ular to'liq mos tushadi.", 'При наложении они полностью совпадают.', 'Laid one on the other they match completely.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L("ustma-ust qo'yilganda mos tushadi", 'совпадают при наложении', 'they match when laid over'),
        },
        {
          id: 'b',
          tag: 'Z3',
          label: L('shakli bir xil', 'форма одинаковая', 'the shape is the same'),
          hint: L("Shakl bir xil bo'lib, o'lchami har xil bo'lishi mumkin.", 'Форма может быть одинаковой, а размер разным.', 'The shape may match while the size differs.'),
        },
        {
          id: 'c',
          tag: 'Z1',
          label: L('bir tomoni teng', 'одна сторона равна', 'one side is equal'),
          hint: L("Bitta tomon juda kam.", 'Одной стороны слишком мало.', 'One side is far too little.'),
        },
        {
          id: 'd',
          tag: 'Z3',
          label: L('yuzalari teng', 'площади равны', 'the areas are equal'),
          hint: L("Yuza teng bo'lib, uchburchaklar har xil bo'lishi mumkin.", 'Площади могут быть равны, а треугольники разными.', 'Areas can match while the triangles differ.'),
        },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Ikki tomon orasidagi burchak qaysi burchak?",
        'Какой угол называют углом между двумя сторонами?',
        'Which angle is the angle between two sides?',
      ),
      ok: L("Shu ikki tomon chiqadigan uchdagi burchak.", 'Тот, что при вершине, откуда выходят эти две стороны.', 'The one at the vertex the two sides come out of.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('ikki tomon chiqadigan uchdagi', 'при вершине этих сторон', 'at the vertex of those sides'),
        },
        {
          id: 'b',
          tag: 'Z2',
          label: L('eng katta burchak', 'самый большой угол', 'the largest angle'),
          hint: L("Kattaligi muhim emas, o'rni muhim.", 'Важен не размер, а место.', 'Not the size matters but the place.'),
        },
        {
          id: 'c',
          tag: 'Z2',
          label: L("uchinchi tomon qarshisidagi", 'против третьей стороны', 'opposite the third side'),
          hint: L("Uchinchi tomon qarshisidagi burchak aynan shu burchak, lekin ta'rifi o'rni bo'yicha beriladi.", 'Против третьей стороны это он и есть, но определяют его по месту.', 'That is the same angle, but it is defined by its place.'),
        },
        {
          id: 'd',
          tag: 'Z2',
          label: L("to'g'ri burchak", 'прямой угол', 'the right angle'),
          hint: L("To'g'ri burchak bo'lishi shart emas.", 'Он не обязан быть прямым.', 'It need not be a right angle.'),
        },
      ],
    },
  ],
  audio: [
    A('mount', "Uch savol: element nima, tenglik nima va orasidagi burchak nima.", 'Три вопроса: что такое элемент, что такое равенство и что такое угол между.', 'Three questions: what an element is, what equality is, and what the angle between is.'),
    A('1', "Ikkinchisi tenglikning ma'nosi haqida.", 'Второй про смысл равенства.', 'The second is about the meaning of equality.'),
    A('2', "Uchinchisi burchakning o'rni haqida.", 'Третий про место угла.', 'The third is about the place of the angle.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. IKKI TOMON YETARLI EMAS -- ASBOB KO'RSATADI.
// A va B qotib turadi. C ko'chadi, A C tomoni besh bo'lib qoladi,
// lekin burchak va uchinchi tomon o'zgaradi.
// ============================================================
const S3 = {
  kind: 'figure',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Ikki tomon qoldi, uchburchak o\'zgardi', 'Две стороны остались, треугольник изменился', 'Two sides stayed, the triangle changed'),
  pts: { A: { x: -4, y: -1 }, B: { x: 2, y: -1 }, C: { x: -1, y: 3 } },
  move: 'C',
  pick: { x: 0, y: 2 },
  show: { sides: true },
  caption: L(
    "A B tomoni 6, A C tomoni 5. C ni (0; 2) tuguniga ko'chiring: A C yana 5 bo'lib qoladi.",
    'Сторона A B равна 6, сторона A C равна 5. Перенеси C в узел (0; 2): A C снова окажется 5.',
    'The side A B is 6 and A C is 5. Move C to the node (0; 2): A C will be 5 again.',
  ),
  options: [
    { id: 'a', label: L('uchinchi tomon o\'zgardi', 'третья сторона изменилась', 'the third side changed') },
    { id: 'b', label: L('hamma tomon o\'zgardi', 'все стороны изменились', 'all the sides changed') },
    { id: 'c', label: L('hech nima o\'zgarmadi', 'ничего не изменилось', 'nothing changed') },
    { id: 'd', label: L('uchburchak yo\'qoldi', 'треугольник исчез', 'the triangle vanished') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("A B va A C o'sha-o'sha qoldi: olti va besh. Faqat uchinchisi o'zgardi.", 'A B и A C остались теми же: шесть и пять. Изменилась только третья.', 'A B and A C stayed the same: six and five. Only the third changed.') },
    { key: 'c', tag: 'Z1', hint: L("Uchinchi tomonning soniga qarang: u ko'chirishdan oldin boshqa edi.", 'Посмотри на число у третьей стороны: до переноса оно было другим.', 'Look at the number on the third side: before the move it was different.') },
    { key: 'd', tag: 'Z1', hint: L("Uchburchak joyida: uchta uch ham bor.", 'Треугольник на месте: все три вершины есть.', 'The triangle is there: all three vertices remain.') },
  ],
  note: L(
    "Ikki tomon bir xil bo'lib qoldi, uchburchak esa boshqa bo'ldi. Demak IKKI TOMON MOS KELISHI tenglikni isbotlamaydi: ular orasidagi burchak ham kerak.",
    'Две стороны остались одинаковыми, а треугольник стал другим. Значит СОВПАДЕНИЕ ДВУХ СТОРОН равенства не доказывает: нужен ещё угол между ними.',
    'Two sides stayed the same and the triangle became different. So TWO MATCHING SIDES prove nothing: the angle between them is needed too.',
  ),
  audio: [
    A('mount', "A va B qotib turadi. C ni siljitamiz, lekin A C tomonini besh qoldiramiz.", 'A и B закреплены. Сдвинем C, но сторону A C оставим равной пяти.', 'A and B are fixed. We move C but keep the side A C equal to five.'),
    A('mount', "Nol ; ikki tugunini bosing.", 'Нажми на узел ноль ; два.', 'Tap the node zero ; two.'),
    A('move', "Ikki tomon o'sha-o'sha. Uchinchisiga qarang.", 'Две стороны те же. Посмотри на третью.', 'Two sides are the same. Look at the third.'),
  ],
}

// ============================================================
// 4. FARQLASH. UCH TOMON YETARLI: uch tugun qotgach uchburchak
// bitta bo'lib qoladi.
// ============================================================
const S4 = {
  kind: 'figure',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Uch tomon berilganda', 'Когда даны три стороны', 'When three sides are given'),
  pts: { A: { x: -4, y: -1 }, B: { x: 2, y: -1 }, C: { x: -1, y: 3 } },
  show: { sides: true, angles: true },
  guess: true,
  caption: L(
    "Tomonlari 6, 5 va 5. Bu uchta sonni saqlab, uchni boshqa tugunga ko'chirib bo'lmaydi.",
    'Стороны 6, 5 и 5. Сохранив эти три числа, вершину в другой узел не перенести.',
    'The sides are 6, 5 and 5. Keeping these three numbers, the vertex cannot go to another node.',
  ),
  options: [
    { id: 'a', label: L('uchburchak yagona bo\'ladi', 'треугольник получается единственный', 'the triangle is unique') },
    { id: 'b', label: L('bunday uchburchak ko\'p', 'таких треугольников много', 'there are many such triangles') },
    { id: 'c', label: L('burchaklarni ham berish kerak', 'нужно задать и углы', 'the angles must be given too') },
    { id: 'd', label: L('uchta tomon kam', 'трёх сторон мало', 'three sides are too few') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Uchni ko'chirishga urinib ko'ring: uchta son bir vaqtda saqlanmaydi.", 'Попробуй перенести вершину: три числа сразу не сохранятся.', 'Try moving the vertex: the three numbers cannot all stay.') },
    { key: 'c', tag: 'Z3', hint: L("Burchaklar o'zi chiqadi: chizmada ular allaqachon yozilgan.", 'Углы получаются сами: на чертеже они уже написаны.', 'The angles come out by themselves: they are already written on the drawing.') },
    { key: 'd', tag: 'Z1', hint: L("Uchta tomon uchburchakni to'liq belgilaydi.", 'Три стороны полностью задают треугольник.', 'Three sides fix the triangle completely.') },
  ],
  note: L(
    "UCH TOMON MOS KELSA uchburchaklar teng: bu birinchi alomat. Uchta tomon uchburchakni to'liq belgilaydi, burchaklar esa ulardan o'zi chiqadi.",
    'ЕСЛИ СОВПАЛИ ТРИ СТОРОНЫ, треугольники равны: это первый признак. Три стороны полностью задают треугольник, а углы выходят из них сами.',
    'IF THREE SIDES MATCH the triangles are equal: that is the first test. Three sides fix the triangle completely, and the angles follow.',
  ),
  audio: [
    A('mount', "Endi uchta tomon ham berilgan: olti, besh va besh.", 'Теперь даны все три стороны: шесть, пять и пять.', 'Now all three sides are given: six, five and five.'),
    A('mount', "Burchaklar chizmada yozilgan, lekin ular O'LCHOV, ya'ni taxmin. Isbot esa tomonlardan chiqadi.", 'Углы на чертеже написаны, но это ИЗМЕРЕНИЕ, то есть предположение. А доказательство идёт от сторон.', 'The angles are written on the drawing, but that is a MEASUREMENT, a guess. The proof comes from the sides.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. Chizmasiz: uch son mos keldi.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Chizmasiz xulosa', 'Вывод без чертежа', 'A conclusion without a drawing'),
  given: L(
    "Birinchi uchburchakda tomonlar 7, 4 va ular orasidagi burchak 50 daraja. Ikkinchisida ham xuddi shunday.",
    'В первом треугольнике стороны 7, 4 и угол между ними 50 градусов. Во втором то же самое.',
    'The first triangle has sides 7, 4 and a 50 degree angle between them. The second has the same.',
  ),
  template: ['7 = 7,   4 = 4,   50° = 50°   →   ', { slot: 0 }],
  parts: [
    { id: 'a', label: L('teng', 'равны', 'equal') },
    { id: 'b', label: L('teng emas', 'не равны', 'not equal') },
    { id: 'c', label: L("uchinchi tomonni o'lchash kerak", 'нужно измерить третью сторону', 'the third side must be measured') },
    { id: 'd', label: L('bilib bo\'lmaydi', 'узнать нельзя', 'it cannot be known') },
  ],
  answer: ['a'],
  prompt: L(
    "Xulosani yozing.",
    'Запиши вывод.',
    'Write the conclusion.',
  ),
  checkNote: L(
    "Ikki tomon va ular ORASIDAGI burchak mos keldi, bu esa ikkinchi alomat. Chizma ham, o'lchov ham kerak emas.",
    'Совпали две стороны и угол МЕЖДУ ними, а это второй признак. Ни чертежа, ни измерения не нужно.',
    'Two sides and the angle BETWEEN them matched, and that is the second test. Neither a drawing nor a measurement is needed.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z5', hint: L("Uch element mos keldi, va burchak tomonlar orasida turadi.", 'Совпали три элемента, и угол стоит между сторонами.', 'Three elements matched, and the angle is between the sides.') },
    { key: 'c', tag: 'Z4', hint: L("O'lchash kerak emas: alomat o'lchovsiz ishlaydi.", 'Измерять не нужно: признак работает без измерения.', 'No measuring is needed: the test works without it.') },
    { key: 'd', tag: 'Z5', hint: L("Bilish mumkin: bu ikkinchi alomat.", 'Можно узнать: это второй признак.', 'It can be known: this is the second test.') },
  ],
  audio: [
    A('mount', "Chizma yo'q. Faqat uchta son mos keldi, va bu yetarli.", 'Чертежа нет. Совпали только три числа, и этого достаточно.', 'No drawing. Only three numbers matched, and that is enough.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. UCH TOMON BO'YICHA UCHNI TIKLASH.
// ============================================================
const S6 = {
  kind: 'figure',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Uchni tiklang', 'Восстанови вершину', 'Restore the vertex'),
  pts: { A: { x: -4, y: -1 }, B: { x: 2, y: -1 }, C: { x: 1, y: 3 } },
  move: 'C',
  pick: { x: -1, y: 3 },
  show: { sides: true },
  caption: L(
    "A B tomoni 6. C ni shunday qo'yingki, A C va B C ikkovi 5 bo'lsin.",
    'Сторона A B равна 6. Поставь C так, чтобы A C и B C были по 5.',
    'The side A B is 6. Place C so that A C and B C are both 5.',
  ),
  options: [
    { id: 'a', label: L('faqat bitta joy to\'g\'ri keldi', 'подошло только одно место', 'only one place fitted') },
    { id: 'b', label: L('bir nechta joy to\'g\'ri keladi', 'подходит несколько мест', 'several places fit') },
    { id: 'c', label: L('bunday joy yo\'q', 'такого места нет', 'there is no such place') },
    { id: 'd', label: L('burchakni ham berish kerak edi', 'нужно было задать и угол', 'the angle had to be given too') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("To'r tugunlari orasida faqat bittasi ikki shartni bir vaqtda bajaradi.", 'Среди узлов сетки только один выполняет оба условия сразу.', 'Among the grid nodes only one meets both conditions at once.') },
    { key: 'c', tag: 'Z1', hint: L("Bor: siz uni topdingiz.", 'Есть: ты его нашёл.', 'There is one: you found it.') },
    { key: 'd', tag: 'Z1', hint: L("Kerak emas: uch tomon yetarli.", 'Не нужно: трёх сторон достаточно.', 'Not needed: three sides are enough.') },
  ],
  note: L(
    "Uch tomon berilganda uch bitta joyga tushadi. Aynan shuning uchun uch tomon bo'yicha tenglikni ISBOTLASH mumkin, o'lchovga tayanmasdan.",
    'Когда даны три стороны, вершина встаёт в одно место. Именно поэтому по трём сторонам равенство можно ДОКАЗАТЬ, не опираясь на измерение.',
    'With three sides given the vertex lands in one place. That is exactly why three sides let you PROVE equality without leaning on a measurement.',
  ),
  audio: [
    A('mount', "Ikki shart bor: A C besh va B C besh.", 'Есть два условия: A C равно пяти и B C равно пяти.', 'There are two conditions: A C is five and B C is five.'),
    A('mount', "Ikkovini bir vaqtda bajaradigan tugunni toping.", 'Найди узел, где оба выполняются сразу.', 'Find the node where both hold at once.'),
    A('move', "Tomonlarni tekshiring.", 'Проверь стороны.', 'Check the sides.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT. UCH BURCHAK MOS KELDI -- TENGLIK CHIQMAYDI.
// ============================================================
const S7 = {
  kind: 'figure',
  role: 'explain',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Uch burchak yetmaydi', 'Трёх углов не хватает', 'Three angles are not enough'),
  pts: { A: { x: -4, y: -2 }, B: { x: 0, y: -2 }, C: { x: -4, y: 1 } },
  show: { sides: true, angles: true },
  guess: true,
  caption: L(
    "Bu uchburchakning burchaklari 90, 53 va 37 daraja. Boshqa uchburchakda ham xuddi shu burchaklar bo'lsa, ular tengmi?",
    'Углы этого треугольника 90, 53 и 37 градусов. Если у другого треугольника такие же углы, они равны?',
    'This triangle has angles of 90, 53 and 37 degrees. If another triangle has the same angles, are they equal?',
  ),
  options: [
    { id: 'a', label: L("yo'q, o'lchami har xil bo'lishi mumkin", 'нет, размер может отличаться', 'no, the size may differ') },
    { id: 'b', label: L('ha, albatta teng', 'да, обязательно равны', 'yes, they must be equal') },
    { id: 'c', label: L('ha, chunki uch element mos keldi', 'да, ведь совпали три элемента', 'yes, three elements matched') },
    { id: 'd', label: L('bunday uchburchak yo\'q', 'такого треугольника нет', 'no such triangle exists') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Hamma tomonini ikki barobar qiling: burchaklar o'zgarmaydi, uchburchak esa katta bo'ladi.", 'Увеличь все стороны вдвое: углы не изменятся, а треугольник станет больше.', 'Double every side: the angles stay, but the triangle grows.') },
    { key: 'c', tag: 'Z3', hint: L("Uchta element mos keldi, lekin ularning hammasi burchak: o'lcham haqida hech narsa yo'q.", 'Совпали три элемента, но все они углы: о размере ничего нет.', 'Three elements matched, but all are angles: nothing about size.') },
    { key: 'd', tag: 'Z6', hint: L("To'qson qo'shuv ellik uch qo'shuv o'ttiz yetti bir yuz sakson beradi.", 'Девяносто плюс пятьдесят три плюс тридцать семь дают сто восемьдесят.', 'Ninety plus fifty three plus thirty seven gives one hundred eighty.') },
  ],
  note: L(
    "Burchaklar SHAKLNI belgilaydi, O'LCHAMNI esa yo'q. Shuning uchun har bir alomatda kamida BITTA TOMON bo'lishi shart.",
    'Углы задают ФОРМУ, но не РАЗМЕР. Поэтому в каждом признаке обязательно есть хотя бы ОДНА СТОРОНА.',
    'Angles fix the SHAPE but not the SIZE. That is why every test must include at least ONE SIDE.',
  ),
  audio: [
    A('mount', "Chizmada to'g'ri burchakli uchburchak turibdi.", 'На чертеже прямоугольный треугольник.', 'A right triangle is on the drawing.'),
    A('mount', "Uch burchagi mos kelgan ikkinchi uchburchakni o'ylab ko'ring. U albatta shunday bo'ladimi.", 'Представь второй треугольник с такими же тремя углами. Обязательно ли он такой же.', 'Imagine a second triangle with the same three angles. Must it be the same.'),
  ],
}

// ============================================================
// 8. QOIDA. UCH ALOMAT.
// ============================================================
const S8 = {
  kind: 'rule',
  tag: 'Z5',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L('uch tomon mos kelsa teng', 'три стороны совпали значит равны', 'three matching sides means equal') },
    { id: 'f2', label: L('ikki tomon va orasidagi burchak mos kelsa teng', 'две стороны и угол между ними значит равны', 'two sides and the angle between means equal') },
    { id: 'f3', label: L('bir tomon va unga yopishgan ikki burchak mos kelsa teng', 'сторона и два прилежащих угла значит равны', 'a side and the two angles on it means equal') },
    { id: 'f4', label: L('har alomatda kamida bir tomon bor', 'в каждом признаке есть хотя бы одна сторона', 'every test has at least one side') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval uch tomon, keyin ikki tomon va burchak, keyin tomon va ikki burchak, oxirida umumiy shart.",
    'Порядок нарушен. Сначала три стороны, потом две стороны и угол, потом сторона и два угла, в конце общее условие.',
    'The order is off. Three sides first, then two sides and the angle, then a side and two angles, and the common condition last.',
  ),
  lawChips: [
    { label: '=', tone: 's2' },
    { label: '3', tone: 's1' },
    { label: '90°', tone: 'off' },
    { label: '( )', tone: 'par' },
  ],
  lawSweep: L(
    'tenglik, uchta element, burchak, juftlik',
    'равенство, три элемента, угол, пара',
    'equality, three elements, the angle, the pair',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Uchburchaklar teng bo'lishi uchun UCHTA mos element yetarli: uch tomon; yoki ikki tomon va ular ORASIDAGI burchak; yoki bir tomon va unga YOPISHGAN ikki burchak.",
        'Для равенства треугольников достаточно ТРЁХ соответствующих элементов: три стороны; либо две стороны и угол МЕЖДУ ними; либо сторона и два ПРИЛЕЖАЩИХ к ней угла.',
        'THREE matching elements suffice for equality: three sides; or two sides and the angle BETWEEN them; or a side and the two angles ON it.',
      ),
      L(
        "Har bir alomatda kamida bitta TOMON bor: uch burchak faqat shaklni beradi, o'lchamni esa bermaydi. Uchburchakni o'lchab tekshirish isbot emas: o'lchov taxmin, alomat esa isbot.",
        'В каждом признаке есть хотя бы одна СТОРОНА: три угла дают только форму, но не размер. Проверка измерением не доказательство: измерение это предположение, а признак это доказательство.',
        'Every test has at least one SIDE: three angles give only the shape, not the size. Checking by measuring is no proof: a measurement is a guess, a test is a proof.',
      ),
    ],
  },
  hookCap: L(
    'Uchta element  --  tenglik',
    'Три элемента — равенство',
    'Three elements — equality',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L('uch tomon', 'три стороны', 'three sides'),
    L('tomon, burchak, tomon', 'сторона, угол, сторона', 'side, angle, side'),
    L('burchak, tomon, burchak', 'угол, сторона, угол', 'angle, side, angle'),
  ],
  audio: [
    A('mount', "Uch alomatni ko'rdik. Endi ularni tartib bilan yig'amiz.", 'Мы увидели три признака. Теперь соберём их по порядку.', 'We saw three tests. Now let us put them in order.'),
    A('ok', "To'g'ri. Har alomatda tomon bor, va bu bekorga emas.", 'Верно. В каждом признаке есть сторона, и это не случайно.', 'Correct. Every test has a side, and that is not by chance.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI.
// ============================================================
const S9 = {
  kind: 'chain',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Yetarlimi', 'Достаточно ли', 'Is it enough'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Ikki uchburchakda uchta tomon mos keldi. Ular tengmi?",
        'У двух треугольников совпали три стороны. Равны ли они?',
        'Two triangles have three matching sides. Are they equal?',
      ),
      ok: L("Ha: bu birinchi alomat.", 'Да: это первый признак.', 'Yes: that is the first test.'),
      items: [
        { id: 'a', correct: true, label: L('ha', 'да', 'yes') },
        { id: 'b', tag: 'Z5', label: L("yo'q", 'нет', 'no'), hint: L("Uch tomon uchburchakni to'liq belgilaydi.", 'Три стороны полностью задают треугольник.', 'Three sides fix the triangle completely.') },
        { id: 'c', tag: 'Z4', label: L("burchaklarni o'lchash kerak", 'нужно измерить углы', 'the angles must be measured'), hint: L("O'lchov kerak emas: alomat yetarli.", 'Измерение не нужно: признака достаточно.', 'No measurement is needed: the test is enough.') },
        { id: 'd', tag: 'Z5', label: L('bilib bo\'lmaydi', 'узнать нельзя', 'it cannot be known'), hint: L("Bilish mumkin: alomat aynan shu haqida.", 'Можно: признак как раз об этом.', 'It can: the test is exactly about this.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Ikki uchburchakda uchta burchak mos keldi. Ular tengmi?",
        'У двух треугольников совпали три угла. Равны ли они?',
        'Two triangles have three matching angles. Are they equal?',
      ),
      ok: L("Yo'q: burchaklar shaklni beradi, o'lchamni bermaydi.", 'Нет: углы дают форму, но не размер.', 'No: angles give the shape, not the size.'),
      items: [
        { id: 'a', correct: true, label: L("yo'q", 'нет', 'no') },
        { id: 'b', tag: 'Z3', label: L('ha', 'да', 'yes'), hint: L("Hamma tomonini ikki barobar qilsangiz burchaklar o'zgarmaydi.", 'Увеличь все стороны вдвое, и углы не изменятся.', 'Double all the sides and the angles stay.') },
        { id: 'c', tag: 'Z3', label: L('ha, uchta element bor', 'да, три элемента есть', 'yes, three elements'), hint: L("Uchtasi ham burchak, tomon esa yo'q.", 'Все три угла, а стороны нет.', 'All three are angles, there is no side.') },
        { id: 'd', tag: 'Z5', label: L('faqat to\'g\'ri burchaklida', 'только в прямоугольных', 'only in right triangles'), hint: L("To'g'ri burchak ham o'lchamni bermaydi.", 'Прямой угол размера тоже не даёт.', 'A right angle gives no size either.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Ikki tomon va ular orasidagi burchak mos keldi. Bu qaysi alomat?",
        'Совпали две стороны и угол между ними. Какой это признак?',
        'Two sides and the angle between them matched. Which test is that?',
      ),
      ok: L("Ikkinchi alomat: tomon, burchak, tomon.", 'Второй признак: сторона, угол, сторона.', 'The second test: side, angle, side.'),
      items: [
        { id: 'a', correct: true, label: L('ikkinchi', 'второй', 'the second') },
        { id: 'b', tag: 'Z5', label: L('birinchi', 'первый', 'the first'), hint: L("Birinchisi uch tomon haqida.", 'Первый про три стороны.', 'The first is about three sides.') },
        { id: 'c', tag: 'Z5', label: L('uchinchi', 'третий', 'the third'), hint: L("Uchinchisi tomon va ikki burchak haqida.", 'Третий про сторону и два угла.', 'The third is about a side and two angles.') },
        { id: 'd', tag: 'Z5', label: L('bunday alomat yo\'q', 'такого признака нет', 'no such test'), hint: L("Bor, va u eng ko'p ishlatiladigan alomat.", 'Есть, и это самый употребимый признак.', 'There is, and it is the most used one.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uchburchaklarni chizg'ich bilan o'lchab tenglikni isbotlash mumkinmi?",
        'Можно ли доказать равенство, измерив треугольники линейкой?',
        'Can equality be proved by measuring the triangles with a ruler?',
      ),
      ok: L("Yo'q: o'lchov taxmin beradi, isbot esa alomatdan chiqadi.", 'Нет: измерение даёт предположение, а доказательство идёт от признака.', 'No: a measurement gives a guess, the proof comes from a test.'),
      items: [
        { id: 'a', correct: true, label: L("yo'q", 'нет', 'no') },
        { id: 'b', tag: 'Z4', label: L('ha', 'да', 'yes'), hint: L("O'lchov har doim taqriban bo'ladi.", 'Измерение всегда приблизительно.', 'A measurement is always approximate.') },
        { id: 'c', tag: 'Z4', label: L('ha, agar aniq o\'lchasa', 'да, если измерить точно', 'yes, if measured precisely'), hint: L("Aniqroq o'lchov ham isbot bo'lmaydi: u faqat bitta chizma haqida gapiradi.", 'Более точное измерение доказательством не станет: оно говорит лишь об одном чертеже.', 'A finer measurement is still no proof: it speaks of one drawing only.') },
        { id: 'd', tag: 'Z4', label: L('faqat kichik uchburchaklarda', 'только для маленьких', 'only for small ones'), hint: L("O'lcham bunga aloqasi yo'q.", 'Размер здесь ни при чём.', 'Size has nothing to do with it.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Ikkinchisi burchaklar haqida, oxirgisi o'lchov haqida.", 'Четыре вопроса. Второй про углы, последний про измерение.', 'Four questions. The second about angles, the last about measuring.'),
    A('1', "Ikkinchisida faqat burchaklar mos keldi.", 'Во втором совпали только углы.', 'In the second only the angles matched.'),
    A('2', "Uchinchisida alomat raqamini ayting.", 'В третьем назови номер признака.', 'In the third name the number of the test.'),
    A('3', "Oxirgisi isbot haqida.", 'Последний про доказательство.', 'The last is about proof.'),
  ],
}

// ============================================================
// 10. MASHQ 2. IKKI QADAM: xulosa va alomat.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Xulosa va alomat', 'Вывод и признак', 'The conclusion and the test'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  given: L(
    "Ikki uchburchakda bir tomon 8 ga teng, va unga yopishgan burchaklar 40 va 70 daraja. Ikkinchisida ham xuddi shunday.",
    'У двух треугольников одна сторона равна 8, а прилежащие к ней углы 40 и 70 градусов. У второго то же самое.',
    'Two triangles have a side equal to 8 with adjacent angles of 40 and 70 degrees. The second is the same.',
  ),
  template: ['8 = 8,   40° = 40°,   70° = 70°   →   ', { slot: 0 },  ',   ', { slot: 1 }],
  parts: [
    { id: 'a', label: L('teng', 'равны', 'equal') },
    { id: 'b', label: L('uchinchi alomat', 'третий признак', 'the third test') },
    { id: 'c', label: L('teng emas', 'не равны', 'not equal') },
    { id: 'd', label: L('birinchi alomat', 'первый признак', 'the first test') },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Xulosani va alomat raqamini yozing.",
    'Запиши вывод и номер признака.',
    'Write the conclusion and the number of the test.',
  ),
  checkNote: L(
    "Bir tomon va unga yopishgan ikki burchak mos keldi: bu uchinchi alomat. Uchinchi burchakni hisoblash ham kerak emas.",
    'Совпали сторона и два прилежащих к ней угла: это третий признак. Третий угол считать даже не нужно.',
    'A side and the two angles on it matched: that is the third test. The third angle need not even be computed.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z5', hint: L("Uchta element mos keldi, va ular orasida tomon bor.", 'Совпали три элемента, и среди них есть сторона.', 'Three elements matched, and one of them is a side.') },
    { key: 'd', tag: 'Z5', hint: L("Birinchi alomat uch tomon haqida, bu yerda esa bitta tomon.", 'Первый признак про три стороны, а здесь одна.', 'The first test is about three sides, here there is one.') },
    { key: '*', tag: 'Z5', hint: L("Avval xulosa, keyin alomat raqami.", 'Сначала вывод, потом номер признака.', 'The conclusion first, then the number of the test.') },
  ],
  probe: {
    question: L("Uchinchi burchak nechcha daraja?", 'Сколько градусов третий угол?', 'How many degrees is the third angle?'),
    items: [
      { id: 'a', correct: true, label: '70°' },
      { id: 'b', tag: 'Z6', label: '110°', hint: L("Bir yuz sakson dan yuz o'n ayirilsa yetmish qoladi.", 'Сто восемьдесят минус сто десять это семьдесят.', 'One hundred eighty minus one hundred ten is seventy.') },
      { id: 'c', tag: 'Z6', label: '40°', hint: L("Qirq allaqachon berilgan burchak.", 'Сорок это уже данный угол.', 'Forty is already one of the given angles.') },
      { id: 'd', tag: 'Z6', label: '80°', hint: L("Qirq qo'shuv yetmish yuz o'n bo'ladi.", 'Сорок плюс семьдесят это сто десять.', 'Forty plus seventy is one hundred ten.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam: avval xulosa, keyin alomat raqami.", 'Два шага: сначала вывод, потом номер признака.', 'Two steps: the conclusion first, then the test number.'),
    A('two', "Endi alomatni tanlang.", 'Теперь выбери признак.', 'Now choose the test.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Yetarli yoki yetarli emas', 'Достаточно или нет', 'Enough or not'),
  given: L(
    "Ikki uchburchakda 9 va 4 tomonlari mos keldi. Boshqa hech narsa ma'lum emas.",
    'У двух треугольников совпали стороны 9 и 4. Больше ничего не известно.',
    'Two triangles have matching sides 9 and 4. Nothing else is known.',
  ),
  template: ['9 = 9,   4 = 4   →   ', { slot: 0 }],
  parts: [
    { id: 'a', label: L('xulosa chiqarib bo\'lmaydi', 'вывод сделать нельзя', 'no conclusion can be drawn') },
    { id: 'b', label: L('teng', 'равны', 'equal') },
    { id: 'c', label: L('teng emas', 'не равны', 'not equal') },
    { id: 'd', label: L('birinchi alomat', 'первый признак', 'the first test') },
  ],
  answer: ['a'],
  prompt: L(
    "Xulosani yozing.",
    'Запиши вывод.',
    'Write the conclusion.',
  ),
  checkNote: L(
    "Ikki element uchta emas. Uchinchisi -- orasidagi burchak yoki uchinchi tomon -- yetishmaydi, shuning uchun hech narsa aytib bo'lmaydi.",
    'Двух элементов не три. Не хватает третьего — угла между ними или третьей стороны, поэтому сказать нельзя ничего.',
    'Two elements are not three. The third one — the angle between or the third side — is missing, so nothing can be said.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Ikki tomon yetarli emas: buni chizmada ko'rdik.", 'Двух сторон недостаточно: мы это видели на чертеже.', 'Two sides are not enough: we saw that on the drawing.') },
    { key: 'c', tag: 'Z1', hint: L("Teng emas deyish ham mumkin emas: ular teng bo'lib chiqishi ham mumkin.", 'Сказать не равны тоже нельзя: они могут оказаться равными.', 'Saying they are unequal is also wrong: they may turn out equal.') },
    { key: 'd', tag: 'Z5', hint: L("Birinchi alomat UCH tomonni talab qiladi.", 'Первый признак требует ТРИ стороны.', 'The first test needs THREE sides.') },
  ],
  audio: [
    A('mount', "Bu safar yordam yo'q. Ikki element berilgan.", 'На этот раз без помощи. Дано два элемента.', 'No help this time. Two elements are given.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Uchta element mos keldi, lekin burchak
// TOMONLAR ORASIDA EMAS.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Uchta element haqiqatda mos keldi. Shunday bo'lsa ham, qaysi qator xato?",
    'Три элемента действительно совпали. И всё же какая строка ошибочна?',
    'Three elements really did match. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: L('tomonlar 7 va 9 mos keldi', 'стороны 7 и 9 совпали', 'the sides 7 and 9 matched') },
    { id: 'r2', text: L('7 qarshisidagi burchak 40° mos keldi', 'угол 40° против стороны 7 совпал', 'the 40° angle opposite the side 7 matched') },
    { id: 'r3', text: L('40° tomonlar orasida turadi', 'угол 40° лежит между сторонами', 'the 40° angle lies between the sides') },
    { id: 'r4', text: L('ikkinchi alomat bo\'yicha teng', 'равны по второму признаку', 'equal by the second test') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("To'g'ri: ikki tomon haqiqatda mos keldi.", 'Верно: две стороны действительно совпали.', 'Right: two sides really matched.'),
    r2: L("To'g'ri: burchak ham mos keldi, va u 7 qarshisida turadi.", 'Верно: угол тоже совпал, и он лежит против стороны 7.', 'Right: the angle matched too, and it lies opposite the side 7.'),
    r4: L("Bu qator oldingisidan chiqqan. Xato esa undan YUQORIDA.", 'Эта строка выходит из предыдущей. А ошибка ВЫШЕ неё.', 'This line follows from the one before. The mistake is ABOVE it.'),
  },
  tags: { r1: 'Z2', r2: 'Z2', r4: 'Z1' },
  proofFill: {
    template: ['40°  ',  { slot: 0 }, '   →   ', { slot: 1 }],
    parts: [
      { id: 'a', label: L('tomonlar orasida emas', 'не между сторонами', 'not between the sides') },
      { id: 'b', label: L('alomat ishlamaydi', 'признак не работает', 'the test does not apply') },
      { id: 'c', label: L('tomonlar orasida', 'между сторонами', 'between the sides') },
      { id: 'd', label: L('alomat ishlaydi', 'признак работает', 'the test applies') },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Burchakning o'rnini va xulosani tuzating.",
      'Исправь место угла и вывод.',
      'Fix the place of the angle and the conclusion.',
    ),
    checkNote: L(
      "Ikkinchi alomat burchak tomonlar ORASIDA bo'lishini talab qiladi. Bu yerda burchak tomon QARSHISIDA turadi, shuning uchun alomat ishlamaydi va tenglik isbotlanmagan.",
      'Второй признак требует, чтобы угол был МЕЖДУ сторонами. Здесь угол лежит ПРОТИВ стороны, поэтому признак не работает и равенство не доказано.',
      'The second test needs the angle BETWEEN the sides. Here the angle lies OPPOSITE a side, so the test does not apply and equality is not proved.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z2', hint: L("Qatorda yozilgan: burchak 7 QARSHISIDA.", 'В строке написано: угол ПРОТИВ стороны 7.', 'The line says: the angle is OPPOSITE the side 7.') },
      { key: 'd', tag: 'Z2', hint: L("Burchak o'z joyida bo'lmasa, alomat ishlamaydi.", 'Если угол не на своём месте, признак не работает.', 'If the angle is not in its place, the test does not apply.') },
      { key: '*', tag: 'Z2', hint: L("Element soni yetarli, o'rni esa yo'q.", 'Число элементов подходит, а место нет.', 'The count of elements fits, the place does not.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda uchta element haqiqatda mos keldi.", 'В этой ловушке три элемента действительно совпали.', 'In this trap three elements really matched.'),
    A('mount', "Shunday bo'lsa ham xulosa noto'g'ri. Burchakning o'rniga qarang.", 'И всё же вывод неверен. Посмотри на место угла.', 'And yet the conclusion is wrong. Look at where the angle is.'),
    A('proof', "Topdingiz. Burchak tomonlar orasida emas edi.", 'Нашёл. Угол был не между сторонами.', 'You found it. The angle was not between the sides.'),
    A('done', "Alomatda element soni ham, o'rni ham muhim.", 'В признаке важно и число элементов, и их место.', 'In a test both the count and the place of the elements matter.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. IKKI OYNA: bir xilmi.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Ikki uchburchak oyna', 'Два треугольных стекла', 'Two triangular panes'),
  given: L(
    "Ustaxonada ikki uchburchak oyna kesilgan. Ikkovining tomonlari 30, 40 va 50 santimetr. Ular bir-birining o'rniga to'g'ri keladimi?",
    'В мастерской вырезали два треугольных стекла. У обоих стороны 30, 40 и 50 сантиметров. Подойдут ли они одно на место другого?',
    'A workshop cut two triangular panes. Both have sides of 30, 40 and 50 centimetres. Will each fit the other place?',
  ),
  template: ['30, 40, 50 = 30, 40, 50   →   ', { slot: 0 }],
  parts: [
    { id: 'a', label: L("to'g'ri keladi", 'подойдут', 'they will fit') },
    { id: 'b', label: L('kelmaydi', 'не подойдут', 'they will not fit') },
    { id: 'c', label: L("burchaklarni o'lchash kerak", 'нужно измерить углы', 'the angles must be measured') },
    { id: 'd', label: L('bilib bo\'lmaydi', 'узнать нельзя', 'it cannot be known') },
  ],
  answer: ['a'],
  prompt: L(
    "Xulosani yozing.",
    'Запиши вывод.',
    'Write the conclusion.',
  ),
  checkNote: L(
    "Uch tomon mos keldi, demak oynalar teng va bir-birining o'rniga to'g'ri keladi. Usta burchakni o'lchamaydi ham: uch tomon yetarli.",
    'Совпали три стороны, значит стёкла равны и подойдут одно на место другого. Мастер даже не измеряет углы: трёх сторон достаточно.',
    'Three sides matched, so the panes are equal and each fits the other place. The worker does not even measure the angles: three sides are enough.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z5', hint: L("Uch tomon mos kelsa uchburchaklar teng.", 'Если совпали три стороны, треугольники равны.', 'If three sides match the triangles are equal.') },
    { key: 'c', tag: 'Z4', hint: L("O'lchash kerak emas: birinchi alomat ishlaydi.", 'Измерять не нужно: работает первый признак.', 'No measuring needed: the first test applies.') },
    { key: 'd', tag: 'Z5', hint: L("Bilish mumkin: uch tomon yetarli.", 'Можно: трёх сторон достаточно.', 'It can be known: three sides are enough.') },
  ],
  audio: [
    A('mount', "Ustaxonada ikki oyna kesilgan, tomonlari bir xil.", 'В мастерской вырезали два стекла с одинаковыми сторонами.', 'A workshop cut two panes with the same sides.'),
    A('mount', "Usta burchaklarni o'lchashi kerakmi.", 'Нужно ли мастеру измерять углы.', 'Does the worker need to measure the angles.'),
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
        "Tenglik uchun nechta mos element yetarli?",
        'Сколько соответствующих элементов достаточно для равенства?',
        'How many matching elements are enough for equality?',
      ),
      ok: L("Uchta, va ular orasida tomon bo'lishi kerak.", 'Три, и среди них должна быть сторона.', 'Three, and one of them must be a side.'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '2', tag: 'Z1', hint: L("Ikkita yetmaydi: chizmada ko'rdik.", 'Двух не хватает: мы видели на чертеже.', 'Two are not enough: we saw it on the drawing.') },
        { id: 'c', label: '6', tag: 'Z1', hint: L("Oltita element bor, lekin hammasini tekshirish kerak emas.", 'Элементов шесть, но проверять все не нужно.', 'There are six elements, but not all need checking.') },
        { id: 'd', label: '1', tag: 'Z1', hint: L("Bitta element juda kam.", 'Одного элемента слишком мало.', 'One element is far too little.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uch burchak mos kelishi tenglikni beradimi?",
        'Даёт ли равенство совпадение трёх углов?',
        'Do three matching angles give equality?',
      ),
      ok: L("Yo'q: kamida bir tomon kerak.", 'Нет: нужна хотя бы одна сторона.', 'No: at least one side is needed.'),
      items: [
        { id: 'a', correct: true, label: L("yo'q", 'нет', 'no') },
        { id: 'b', tag: 'Z3', label: L('ha', 'да', 'yes'), hint: L("Burchaklar o'lchamni bermaydi.", 'Углы не дают размера.', 'Angles give no size.') },
        { id: 'c', tag: 'Z3', label: L('ha, uchtasi bor', 'да, их три', 'yes, there are three'), hint: L("Son yetarli, lekin tomon yo'q.", 'Число подходит, но стороны нет.', 'The count fits, but there is no side.') },
        { id: 'd', tag: 'Z5', label: L('faqat teng yonlida', 'только в равнобедренном', 'only in an isosceles one'), hint: L("Tur bunga yordam bermaydi.", 'Вид здесь не поможет.', 'The kind does not help here.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Ikkinchi alomatda burchak qayerda turishi kerak?",
        'Где должен стоять угол во втором признаке?',
        'Where must the angle stand in the second test?',
      ),
      ok: L("Ikki tomon orasida.", 'Между двумя сторонами.', 'Between the two sides.'),
      items: [
        { id: 'a', correct: true, label: L('tomonlar orasida', 'между сторонами', 'between the sides') },
        { id: 'b', tag: 'Z2', label: L('tomon qarshisida', 'против стороны', 'opposite a side'), hint: L("Qarshisida bo'lsa alomat ishlamaydi.", 'Если против, признак не работает.', 'If opposite, the test does not apply.') },
        { id: 'c', tag: 'Z2', label: L('farqi yo\'q', 'не важно', 'it does not matter'), hint: L("Muhim: tuzoqda aynan shuning ustida yiqildik.", 'Важно: на этом мы и споткнулись в ловушке.', 'It matters: that is what tripped us in the trap.') },
        { id: 'd', tag: 'Z2', label: L('eng katta tomon yonida', 'у самой большой стороны', 'at the largest side'), hint: L("Kattaligi muhim emas, o'rni muhim.", 'Важен не размер, а место.', 'Not the size but the place matters.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Chizg'ich bilan o'lchash isbot bo'ladimi?",
        'Является ли измерение линейкой доказательством?',
        'Is measuring with a ruler a proof?',
      ),
      ok: L("Yo'q: o'lchov taxmin, isbot esa alomatdan chiqadi.", 'Нет: измерение это предположение, а доказательство идёт от признака.', 'No: a measurement is a guess, the proof comes from a test.'),
      items: [
        { id: 'a', correct: true, label: L("yo'q", 'нет', 'no') },
        { id: 'b', tag: 'Z4', label: L('ha', 'да', 'yes'), hint: L("O'lchov bitta chizma haqida gapiradi.", 'Измерение говорит об одном чертеже.', 'A measurement speaks of one drawing.') },
        { id: 'c', tag: 'Z4', label: L('ha, aniq o\'lchasa', 'да, если точно', 'yes, if precise'), hint: L("Aniqlik isbot o'rnini bosmaydi.", 'Точность не заменяет доказательства.', 'Precision does not replace a proof.') },
        { id: 'd', tag: 'Z4', label: L('ba\'zan', 'иногда', 'sometimes'), hint: L("Isbot ba'zan ishlamaydi degan narsa yo'q.", 'Доказательства, которое работает иногда, не бывает.', 'There is no such thing as a proof that works sometimes.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Yagona baholanadigan ekran.", 'Блиц, четыре вопроса. Единственный оцениваемый экран.', 'Quick round, four questions. The only graded screen.'),
    A('1', "Ikkinchisi burchaklar haqida.", 'Второй про углы.', 'The second is about angles.'),
    A('2', "Uchinchisi burchakning o'rni haqida.", 'Третий про место угла.', 'The third is about the place of the angle.'),
    A('3', "Oxirgisi o'lchov haqida.", 'Последний про измерение.', 'The last is about measuring.'),
  ],
}

// ============================================================
// 15. YAKUN.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Uchta element, va bittasi tomon', 'Три элемента, и один из них сторона', 'Three elements, one of them a side'),
  gate: S1.gate,
  fix: {
    tokens: [L('kerak', 'нужен', 'needed')],
    value: '3',
    sign: '=',
    hint: L('Pastki tabloni bosing', 'Нажми на нижнее табло', 'Tap the lower board'),
  },
  fixSay: L(
    "Ikki tomon yetarli emas: chizmada ikki tomonni qoldirib, uchburchakni o'zgartirib ko'rdik. Uchinchi element kerak, va u burchak yoki uchinchi tomon bo'ladi.",
    'Двух сторон недостаточно: на чертеже мы оставили две стороны и изменили треугольник. Нужен третий элемент, и это либо угол, либо третья сторона.',
    'Two sides are not enough: on the drawing we kept two sides and changed the triangle. A third element is needed, either the angle or the third side.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    three: L('uchinchi element kerak', 'нужен третий элемент', 'a third element is needed'),
    two: L('ikkita yetarli', 'двух достаточно', 'two are enough'),
    always: L('har doim teng', 'всегда равны', 'always equal'),
    never: L('aytib bo\'lmaydi', 'сказать нельзя', 'it cannot be told'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['6, 5, 5', '7, 4, 50°', '8, 40°, 70°', '90°, 53°, 37°'],
  twoLabel: L('Uch alomat', 'Три признака', 'Three tests'),
  twoA: L(
    'tomon, tomon, tomon',
    'сторона, сторона, сторона',
    'side, side, side',
  ),
  twoB: L(
    'tomon, burchak, tomon  --  burchak, tomon, burchak',
    'сторона, угол, сторона  —  угол, сторона, угол',
    'side, angle, side  —  angle, side, angle',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    'teng yonli uchburchak va uning xossalari',
    'равнобедренный треугольник и его свойства',
    'the isosceles triangle and its properties',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz.", 'Вернёмся к началу. Вот что ты предполагал.', 'Back to the start. This is what you predicted.'),
    A('mount', "Uchta element kerak, va ular orasida kamida bitta tomon bo'lishi shart.", 'Нужно три элемента, и среди них обязательна хотя бы одна сторона.', 'Three elements are needed, and at least one must be a side.'),
    A('mount', "Keyingi darsda teng yonli uchburchakni yaqindan ko'ramiz.", 'На следующем уроке рассмотрим равнобедренный треугольник поближе.', 'Next lesson we look closely at the isosceles triangle.'),
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
