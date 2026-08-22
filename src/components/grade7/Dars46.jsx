// ============================================================================
// 7-sinf, Dars 46. TO'G'RI BURCHAKLI UCHBURCHAK. TOMONLAR VA BURCHAKLAR
// NISBATI.
// (Прямоугольные треугольники и соотношения сторон и углов)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// METODIST QARORI 2026-08-21: bu tema BITTA darsda qoladi va NISBATNI oladi.
//
// PIFAGOR TEOREMASI BU DARSDA YO'Q -- u 8-sinfda. Shuning uchun gipotenuza
// uzunligi HISOBLANMAYDI, balki asbob bilan O'LCHANADI: chizmada 3, 4 va 5
// chiqadi, va darsning xulosasi «gipotenuza istalgan katetdan uzun» bo'ladi,
// «beshga teng, chunki uch kvadrat qo'shuv to'rt kvadrat» emas. Xukda esa
// aynan shu tuzoq turadi: katetlarni qo'shib yetti deb yozish.
//
// CHIZMALAR TUGUNLARDA ANIQ: 3-4-5 uchburchagi to'r tugunlarida yotadi,
// teng katetli uchburchak ham (4 va 4). O'ttiz darajali holat esa chizmada
// KO'RSATILMAYDI: to'rda u aniq chiqmaydi, shuning uchun u yozuv bilan
// beriladi va sababi bir qatorda aytiladi -- katet bo'ylab akslantirilsa
// teng tomonli uchburchak chiqadi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_46'
const LESSON_TITLE = L("To'g'ri burchakli uchburchak", 'Прямоугольный треугольник', 'The right triangle')
const LESSON_NO = L('46-dars', 'Урок 46', 'Lesson 46')
const BLOCK = { label: L('B7-blok', 'Блок Б7', 'Block B7'), from: 40, to: 48, current: 46 }

const TAGS = {
  Z1: L('gipotenuza va katet', 'гипотенуза и катет', 'the hypotenuse and a leg'),
  Z2: L("o'tkir burchaklar yig'indisi", 'сумма острых углов', 'the sum of the acute angles'),
  Z3: L('katta tomon va katta burchak', 'большая сторона и больший угол', 'the larger side and the larger angle'),
  Z4: L('katetlar qo\'shildi', 'катеты сложены', 'the legs were added'),
  Z5: L("o'ttiz daraja holati", 'случай тридцати градусов', 'the thirty degree case'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Uchinchi tomon nechchi chiqadi.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L("TO'G'RI BURCHAKLI UCHBURCHAK", 'ПРЯМОУГОЛЬНЫЙ ТРЕУГОЛЬНИК', 'THE RIGHT TRIANGLE'),
  noBack: true,
  noNotes: true,
  title: L('Uchinchi tomon', 'Третья сторона', 'The third side'),
  gate: {
    source: { kind: 'plain', tokens: ['3', '4', '?'] },
    rows: [
      { tokens: ['3 + 4'], value: '7' },
      { tokens: ['?'], value: '5' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "To'g'ri burchakli uchburchakning to'g'ri burchak yonidagi tomonlari 3 va 4. Uchinchi tomon nechchi chiqadi? U chizmada o'lchanadi.",
      'У прямоугольного треугольника стороны при прямом угле равны 3 и 4. Сколько выйдет третья сторона? Её измерят на чертеже.',
      'A right triangle has sides of 3 and 4 at the right angle. What will the third side be? It will be measured on the drawing.',
    ),
    items: [
      {
        id: 'five',
        label: '5',
        hint: L(
          "Taxminingiz qabul qilindi. Chizmada o'lchaymiz.",
          'Прогноз принят. Измерим на чертеже.',
          'Your prediction is taken. We will measure it on the drawing.',
        ),
      },
      {
        id: 'seven',
        label: '7',
        hint: L(
          "Yetti bu ikki tomonning yig'indisi. Lekin uchburchakda ikki tomon yig'indisi uchinchisidan KATTA bo'lishi kerak edi, teng emas.",
          'Семь это сумма двух сторон. Но в треугольнике сумма двух сторон должна быть БОЛЬШЕ третьей, а не равна ей.',
          'Seven is the sum of the two sides. But in a triangle the sum of two sides must be GREATER than the third, not equal.',
        ),
      },
      {
        id: 'four',
        label: '4',
        hint: L(
          "To'rt allaqachon bor. Uchinchi tomon undan uzun chiqadi.",
          'Четыре уже есть. Третья сторона выйдет длиннее.',
          'Four is already there. The third side comes out longer.',
        ),
      },
      {
        id: 'cant',
        label: L('bilib bo\'lmaydi', 'узнать нельзя', 'it cannot be known'),
        hint: L(
          "O'lchov chizmada bajariladi, va aniq son chiqadi.",
          'Измерение сделают на чертеже, и выйдет точное число.',
          'The measuring happens on the drawing, and an exact number comes out.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "To'g'ri burchakli uchburchak. To'g'ri burchak yonidagi tomonlar uch va to'rt.", 'Прямоугольный треугольник. Стороны при прямом угле три и четыре.', 'A right triangle. The sides at the right angle are three and four.'),
    A('mount', "Uchinchi tomon nechchi chiqadi deb taxmin qilasiz.", 'Какой, по-твоему, выйдет третья сторона.', 'What do you predict the third side will be.'),
  ],
}

// ============================================================
// 2. TAYANCH. KVOTA EKRANI.
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
        "Uchburchakda nechta to'g'ri burchak bo'lishi mumkin?",
        'Сколько прямых углов может быть в треугольнике?',
        'How many right angles can a triangle have?',
      ),
      ok: L("Bittasi: ikkitasi allaqachon bir yuz sakson beradi.", 'Один: два уже дают сто восемьдесят.', 'One: two already make one hundred eighty.'),
      items: [
        { id: 'a', label: '1', correct: true },
        { id: 'b', label: '2', tag: 'Z2', hint: L("Ikki to'qson bir yuz sakson beradi, uchinchi burchakka joy qolmaydi.", 'Два девяноста дают сто восемьдесят, третьему углу места нет.', 'Two nineties make one hundred eighty, leaving no room for a third.') },
        { id: 'c', label: '3', tag: 'Z2', hint: L("Uchta to'qson ikki yuz yetmish beradi.", 'Три девяноста дают двести семьдесят.', 'Three nineties make two hundred seventy.') },
        { id: 'd', label: '0', tag: 'Z2', hint: L("Bittasi bo'lishi mumkin, va bunday uchburchak to'g'ri burchakli deb ataladi.", 'Один может быть, и такой треугольник называется прямоугольным.', 'One can be, and such a triangle is called right-angled.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uchburchak burchaklarining yig'indisi nechcha daraja?",
        'Сколько градусов сумма углов треугольника?',
        'What is the sum of the angles of a triangle?',
      ),
      ok: L("Bir yuz sakson, va bu o'tgan darsda isbotlangan.", 'Сто восемьдесят, и это доказано на прошлом уроке.', 'One hundred eighty, proved last lesson.'),
      items: [
        { id: 'a', label: '180°', correct: true },
        { id: 'b', label: '90°', tag: 'Z2', hint: L("To'qson bitta burchak bo'lishi mumkin.", 'Девяносто может быть одним углом.', 'Ninety may be one angle.') },
        { id: 'c', label: '360°', tag: 'Z2', hint: L("Uch yuz oltmish to'liq aylanish.", 'Триста шестьдесят это полный оборот.', 'Three hundred sixty is a full turn.') },
        { id: 'd', label: '270°', tag: 'Z2', hint: L("Yig'indi yoyilgan burchakka teng.", 'Сумма равна развёрнутому углу.', 'The sum equals a straight angle.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uchburchakda ikki tomonning yig'indisi uchinchisi bilan qanday bog'langan?",
        'Как связана сумма двух сторон треугольника с третьей?',
        'How does the sum of two sides of a triangle relate to the third?',
      ),
      ok: L("Yig'indi uchinchisidan katta bo'lishi kerak.", 'Сумма должна быть больше третьей.', 'The sum must be greater than the third.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('yig\'indi kattaroq', 'сумма больше', 'the sum is greater'),
        },
        {
          id: 'b',
          tag: 'Z4',
          label: L("yig'indi teng", 'сумма равна', 'the sum is equal'),
          hint: L("Teng bo'lsa uchburchak yopilmaydi: uchlar bir chiziqda qoladi.", 'Если равна, треугольник не замкнётся: вершины лежат на прямой.', 'If equal the triangle cannot close: the vertices lie on a line.'),
        },
        {
          id: 'c',
          tag: 'Z4',
          label: L("yig'indi kichikroq", 'сумма меньше', 'the sum is smaller'),
          hint: L("Kichik bo'lsa tomonlar uchinchisiga yetmaydi.", 'Если меньше, стороны не дотянутся до третьей.', 'If smaller the sides cannot reach across.'),
        },
        {
          id: 'd',
          tag: 'Z4',
          label: L('bog\'liq emas', 'не связана', 'unrelated'),
          hint: L("Bog'liq: bu uchburchakning mavjudlik sharti.", 'Связана: это условие существования треугольника.', 'It is related: that is the condition for the triangle to exist.'),
        },
      ],
    },
  ],
  audio: [
    A('mount', "Uch savol: to'g'ri burchaklar soni, yig'indi va tomonlar sharti.", 'Три вопроса: число прямых углов, сумма и условие для сторон.', 'Three questions: the count of right angles, the sum, and the condition on sides.'),
    A('1', "Ikkinchisi o'tgan darsdan.", 'Второй с прошлого урока.', 'The second is from last lesson.'),
    A('2', "Uchinchisi tomonlar haqida.", 'Третий про стороны.', 'The third is about sides.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. GIPOTENUZA -- ENG UZUN TOMON.
// ============================================================
const S3 = {
  kind: 'figure',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Eng uzun tomon qaysi', 'Какая сторона самая длинная', 'Which side is the longest'),
  pts: { A: { x: -4, y: -2 }, B: { x: 0, y: -2 }, C: { x: -4, y: 1 } },
  show: { sides: true, angles: true },
  mark: ['A'],
  guess: true,
  caption: L(
    "To'g'ri burchak A da. Uchta tomon va uchta burchak o'lchandi.",
    'Прямой угол при A. Три стороны и три угла измерены.',
    'The right angle is at A. The three sides and the three angles are measured.',
  ),
  options: [
    { id: 'a', label: L("to'g'ri burchak qarshisidagi tomon", 'сторона против прямого угла', 'the side opposite the right angle') },
    { id: 'b', label: L('eng kichik burchak qarshisidagi', 'сторона против самого малого угла', 'the side opposite the smallest angle') },
    { id: 'c', label: L('uchtasi ham teng', 'все три равны', 'all three are equal') },
    { id: 'd', label: L("uzunligi 7 chiqdi", 'её длина вышла 7', 'its length came out 7') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Aynan teskarisi: kichik burchak qarshisida kichik tomon yotadi.", 'Как раз наоборот: против малого угла лежит малая сторона.', 'Quite the opposite: the small side lies opposite the small angle.') },
    { key: 'c', tag: 'Z1', hint: L("Chizmadagi uchta sonni solishtiring.", 'Сравни три числа на чертеже.', 'Compare the three numbers on the drawing.') },
    { key: 'd', tag: 'Z4', hint: L("Chizmadagi songa qarang: u besh, yetti emas. Yetti ikki tomonning yig'indisi edi.", 'Посмотри на число на чертеже: оно пять, а не семь. Семь это была сумма двух сторон.', 'Look at the number on the drawing: it is five, not seven. Seven was the sum of the two sides.') },
  ],
  note: L(
    "To'g'ri burchak yonidagi tomonlar KATETLAR, to'g'ri burchak qarshisidagi tomon esa GIPOTENUZA deb ataladi. Gipotenuza har doim eng uzun tomon: u eng katta burchak qarshisida yotadi. Nima uchun aynan besh chiqqani 8-sinfda ochiladi -- bugun muhimi shu: gipotenuza istalgan katetdan uzun.",
    'Стороны при прямом угле называются КАТЕТАМИ, а сторона против прямого угла ГИПОТЕНУЗОЙ. Гипотенуза всегда самая длинная: она лежит против самого большого угла. Почему вышло именно пять, раскроется в 8 классе — сегодня важно другое: гипотенуза длиннее любого катета.',
    'The sides at the right angle are the LEGS, and the side opposite it is the HYPOTENUSE. The hypotenuse is always the longest: it lies opposite the largest angle. Why exactly five will come in grade 8 — today what matters is that the hypotenuse beats every leg.',
  ),
  audio: [
    A('mount', "To'g'ri burchak A uchida turadi va yoritilgan.", 'Прямой угол при вершине A и он подсвечен.', 'The right angle is at A and it is highlighted.'),
    A('mount', "Uchta tomon o'lchandi. Eng uzuni qaysi ekanini ayting.", 'Три стороны измерены. Скажи, какая самая длинная.', 'The three sides are measured. Say which is longest.'),
  ],
}

// ============================================================
// 4. FARQLASH. KATTA BURCHAK QARSHISIDA KATTA TOMON.
// ============================================================
const S4 = {
  kind: 'figure',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Nisbat to\'g\'ri burchaksiz ham ishlaydi', 'Соотношение работает и без прямого угла', 'The relation works without a right angle too'),
  pts: { A: { x: -4, y: -2 }, B: { x: 3, y: -2 }, C: { x: -2, y: 2 } },
  move: 'C',
  pick: { x: -3, y: 3 },
  show: { sides: true, angles: true },
  guess: true,
  caption: L(
    "Bu uchburchakda to'g'ri burchak yo'q. C ni (−3; 3) tuguniga ko'chiring va eng uzun tomon bilan eng katta burchakni kuzatib turing.",
    'В этом треугольнике прямого угла нет. Перенеси C в узел (−3; 3) и следи за самой длинной стороной и самым большим углом.',
    'This triangle has no right angle. Move C to the node (−3; 3) and watch the longest side and the largest angle.',
  ),
  options: [
    { id: 'a', label: L('eng katta burchak eng uzun tomon qarshisida qoldi', 'самый большой угол остался против самой длинной стороны', 'the largest angle stayed opposite the longest side') },
    { id: 'b', label: L('eng katta burchak eng qisqa tomon qarshisiga o\'tdi', 'самый большой угол перешёл против самой короткой', 'the largest angle moved opposite the shortest side') },
    { id: 'c', label: L('bog\'liqlik yo\'qoldi', 'связь пропала', 'the link disappeared') },
    { id: 'd', label: L('tomonlar o\'zgarmadi', 'стороны не изменились', 'the sides did not change') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Sonlarni solishtiring: eng katta burchak eng uzun tomonga qaragan.", 'Сравни числа: самый большой угол смотрит на самую длинную сторону.', 'Compare the numbers: the largest angle faces the longest side.') },
    { key: 'c', tag: 'Z3', hint: L("Yo'qolmadi: ko'chirishdan keyin ham katta burchak katta tomon qarshisida.", 'Не пропала: и после переноса большой угол против большой стороны.', 'It did not: after the move the large angle still faces the large side.') },
    { key: 'd', tag: 'Z3', hint: L("Tomonlar o'zgardi: C ning o'rni o'zgardi.", 'Стороны изменились: место C изменилось.', 'The sides changed: C changed place.') },
  ],
  note: L(
    "Nisbat har qanday uchburchakda ishlaydi: KATTA BURCHAK qarshisida KATTA TOMON yotadi, kichik burchak qarshisida esa kichik tomon. To'g'ri burchakli uchburchak shu qoidaning xususiy holati: eng katta burchak 90 daraja, va uning qarshisidagi gipotenuza eng uzun.",
    'Соотношение работает в любом треугольнике: против БОЛЬШЕГО УГЛА лежит БОЛЬШАЯ СТОРОНА, а против меньшего угла меньшая сторона. Прямоугольный треугольник это частный случай того же правила: самый большой угол 90 градусов, и гипотенуза против него самая длинная.',
    'The relation holds in any triangle: the LARGER SIDE lies opposite the LARGER ANGLE, and the smaller side opposite the smaller angle. A right triangle is a special case: the largest angle is 90 degrees and the hypotenuse opposite it is longest.',
  ),
  audio: [
    A('mount', "Endi to'g'ri burchaksiz uchburchak.", 'Теперь треугольник без прямого угла.', 'Now a triangle with no right angle.'),
    A('mount', "Uchni ko'chiring va sonlarni solishtiring.", 'Перенеси вершину и сравни числа.', 'Move the vertex and compare the numbers.'),
    A('move', "Eng uzun tomonni va eng katta burchakni toping.", 'Найди самую длинную сторону и самый большой угол.', 'Find the longest side and the largest angle.'),
  ],
}


// ============================================================
// 5. IKKINCHI KO'RINISH. Chizmasiz: uchta son.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Chizmasiz', 'Без чертежа', 'Without a drawing'),
  given: L(
    "Uchburchakning tomonlari 5, 9 va 7. Eng katta burchak qaysi tomon qarshisida yotadi?",
    'Стороны треугольника 5, 9 и 7. Против какой стороны лежит самый большой угол?',
    'The sides of a triangle are 5, 9 and 7. Which side does the largest angle face?',
  ),
  template: ['9 > 7 > 5   →   ', { slot: 0 }],
  parts: [
    { id: 'a', label: '9' },
    { id: 'b', label: '5' },
    { id: 'c', label: '7' },
    { id: 'd', label: L('bilib bo\'lmaydi', 'узнать нельзя', 'it cannot be known') },
  ],
  answer: ['a'],
  prompt: L(
    "Eng katta burchak qarshisidagi tomonni yozing.",
    'Запиши сторону против самого большого угла.',
    'Write the side opposite the largest angle.',
  ),
  checkNote: L(
    "Eng uzun tomon 9, demak eng katta burchak uning qarshisida. Burchaklarning aniq qiymati kerak emas: tartib yetarli.",
    'Самая длинная сторона 9, значит самый большой угол против неё. Точные значения углов не нужны: достаточно порядка.',
    'The longest side is 9, so the largest angle faces it. The exact angle values are not needed: the order is enough.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Besh eng qisqa tomon: uning qarshisida eng kichik burchak.", 'Пять это самая короткая сторона: против неё самый малый угол.', 'Five is the shortest side: the smallest angle faces it.') },
    { key: 'c', tag: 'Z3', hint: L("Yetti o'rtada turadi, ya'ni burchagi ham o'rtacha.", 'Семь стоит в середине, значит и угол средний.', 'Seven is in the middle, so its angle is the middle one.') },
    { key: 'd', tag: 'Z3', hint: L("Bilish mumkin: tomonlarni solishtirish yetarli.", 'Можно: достаточно сравнить стороны.', 'It can be known: comparing the sides is enough.') },
  ],
  audio: [
    A('mount', "Chizma yo'q, uchta son bor.", 'Чертежа нет, есть три числа.', 'No drawing, three numbers.'),
    A('mount', "Nisbat sonlar bo'yicha ham ishlaydi.", 'Соотношение работает и по числам.', 'The relation works on numbers too.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. KATETLARNI TENGLASHTIRING.
// ============================================================
const S6 = {
  kind: 'figure',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Katetlarni tenglashtiring', 'Уравняй катеты', 'Make the legs equal'),
  pts: { A: { x: -3, y: -3 }, B: { x: 1, y: -3 }, C: { x: -3, y: 0 } },
  move: 'C',
  pick: { x: -3, y: 1 },
  show: { sides: true, angles: true },
  guess: true,
  caption: L(
    "To'g'ri burchak A da va u joyida qoladi. C ni shunday ko'chiringki, ikki katet teng bo'lsin.",
    'Прямой угол при A и он остаётся на месте. Перенеси C так, чтобы два катета стали равны.',
    'The right angle is at A and stays there. Move C so that the two legs become equal.',
  ),
  options: [
    { id: 'a', label: L("o'tkir burchaklar 45 va 45 bo'ldi", 'острые углы стали 45 и 45', 'the acute angles became 45 and 45') },
    { id: 'b', label: L("o'tkir burchaklar 90 va 90 bo'ldi", 'острые углы стали 90 и 90', 'the acute angles became 90 and 90') },
    { id: 'c', label: L('gipotenuza katetga teng bo\'ldi', 'гипотенуза стала равна катету', 'the hypotenuse became equal to a leg') },
    { id: 'd', label: L("to'g'ri burchak yo'qoldi", 'прямой угол исчез', 'the right angle vanished') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Ikki to'qson bir yuz sakson beradi, to'g'ri burchak esa allaqachon olingan.", 'Два девяноста дают сто восемьдесят, а прямой угол уже занят.', 'Two nineties make one hundred eighty, and the right angle is taken.') },
    { key: 'c', tag: 'Z1', hint: L("Gipotenuza har doim uzunroq: chizmadagi sonlarga qarang.", 'Гипотенуза всегда длиннее: посмотри на числа.', 'The hypotenuse is always longer: look at the numbers.') },
    { key: 'd', tag: 'Z1', hint: L("To'g'ri burchak A da qoldi: C tik qatorda turadi.", 'Прямой угол остался при A: C стоит в вертикальном ряду.', 'The right angle stayed at A: C is in the upright row.') },
  ],
  note: L(
    "Katetlar teng bo'lganda o'tkir burchaklar ham teng bo'ladi. Ular birga 90 daraja beradi, demak har biri 45 daraja. Bunday uchburchak ayni vaqtda to'g'ri burchakli va teng yonli bo'ladi.",
    'Когда катеты равны, острые углы тоже равны. Вместе они дают 90 градусов, значит по 45. Такой треугольник сразу и прямоугольный, и равнобедренный.',
    'When the legs are equal the acute angles are equal too. Together they give 90 degrees, so 45 each. Such a triangle is right-angled and isosceles at once.',
  ),
  audio: [
    A('mount', "To'g'ri burchak A da. Katetlar hozircha har xil.", 'Прямой угол при A. Катеты пока разные.', 'The right angle is at A. The legs differ for now.'),
    A('mount', "C ni tik qator bo'ylab ko'chiring.", 'Перенеси C по вертикальному ряду.', 'Move C along the upright row.'),
    A('move', "O'tkir burchaklarga qarang.", 'Посмотри на острые углы.', 'Look at the acute angles.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT. O'TTIZ DARAJA.
// Chizmada ko'rsatilmaydi: to'r tugunlarida bu uchburchak aniq
// chiqmaydi, va asbob yolg'on son ko'rsatardi.
// ============================================================
const S7 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('O\'ttiz daraja', 'Тридцать градусов', 'Thirty degrees'),
  given: L(
    "To'g'ri burchakli uchburchakda bir o'tkir burchak 30 daraja, gipotenuza esa 12 ga teng. Shu burchak qarshisidagi katet nechchi?",
    'В прямоугольном треугольнике один острый угол 30 градусов, а гипотенуза равна 12. Сколько равен катет против этого угла?',
    'In a right triangle one acute angle is 30 degrees and the hypotenuse is 12. How long is the leg opposite that angle?',
  ),
  template: ['12 : 2 = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '6' },
    { id: 'b', label: '12' },
    { id: 'c', label: '4' },
    { id: 'd', label: '30' },
  ],
  answer: ['a'],
  prompt: L(
    "Katetni hisoblang.",
    'Посчитай катет.',
    'Work out the leg.',
  ),
  checkNote: L(
    "O'ttiz daraja qarshisidagi katet gipotenuzaning yarmiga teng. Sababi oddiy: uchburchakni shu katet bo'ylab akslantirsak, burchaklari 60, 60 va 60 bo'lgan teng tomonli uchburchak chiqadi, va gipotenuza uning tomoni bo'ladi.",
    'Катет против тридцати градусов равен половине гипотенузы. Причина простая: отразим треугольник через этот катет и получим равносторонний треугольник с углами 60, 60 и 60, а гипотенуза станет его стороной.',
    'The leg opposite thirty degrees is half the hypotenuse. The reason is simple: reflect the triangle across that leg and you get an equilateral triangle with angles 60, 60 and 60, with the hypotenuse as its side.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z5', hint: L("O'n ikki gipotenuza, katet esa undan qisqa.", 'Двенадцать это гипотенуза, а катет короче.', 'Twelve is the hypotenuse, and the leg is shorter.') },
    { key: 'c', tag: 'Z6', hint: L("Ikkiga bo'linadi, uchga emas.", 'Делят на два, а не на три.', 'Halve it, do not divide by three.') },
    { key: 'd', tag: 'Z5', hint: L("O'ttiz bu burchak, javob esa uzunlik.", 'Тридцать это угол, а ответ длина.', 'Thirty is the angle, the answer is a length.') },
  ],
  audio: [
    A('mount', "Alohida esda qoladigan holat: o'tkir burchak o'ttiz daraja.", 'Особый случай, который стоит запомнить: острый угол тридцать градусов.', 'A special case worth remembering: an acute angle of thirty degrees.'),
    A('mount', "Shu burchak qarshisidagi katet gipotenuzaning yarmiga teng.", 'Катет против этого угла равен половине гипотенузы.', 'The leg opposite that angle is half the hypotenuse.'),
  ],
}

// ============================================================
// 8. QOIDA.
// ============================================================
const S8 = {
  kind: 'rule',
  tag: 'Z3',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L("to'g'ri burchak yonidagi tomonlar katetlar", 'стороны при прямом угле это катеты', 'the sides at the right angle are the legs') },
    { id: 'f2', label: L('qarshisidagisi esa gipotenuza', 'а против него гипотенуза', 'and opposite it is the hypotenuse') },
    { id: 'f3', label: L('katta burchak qarshisida katta tomon', 'против большего угла большая сторона', 'the larger side faces the larger angle') },
    { id: 'f4', label: L("shuning uchun gipotenuza eng uzun", 'поэтому гипотенуза самая длинная', 'so the hypotenuse is the longest') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval tomonlarning nomlari, keyin nisbat, oxirida undan chiqadigan xulosa.",
    'Порядок нарушен. Сначала названия сторон, потом соотношение, в конце вывод из него.',
    'The order is off. The names of the sides first, then the relation, and its consequence last.',
  ),
  lawChips: [
    { label: '90°', tone: 's1' },
    { label: '>', tone: 'off' },
    { label: '=', tone: 's2' },
    { label: '( )', tone: 'par' },
  ],
  lawSweep: L(
    "to'g'ri burchak, kattalik, tenglik, juftlik",
    'прямой угол, больше, равенство, пара',
    'the right angle, greater, equality, the pair',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "To'g'ri burchakli uchburchakda to'g'ri burchak yonidagi tomonlar KATETLAR, qarshisidagi tomon esa GIPOTENUZA. O'tkir burchaklar birga 90 daraja beradi, chunki uchtasining yig'indisi 180.",
        'В прямоугольном треугольнике стороны при прямом угле это КАТЕТЫ, а сторона против него ГИПОТЕНУЗА. Острые углы вместе дают 90 градусов, ведь сумма всех трёх 180.',
        'In a right triangle the sides at the right angle are the LEGS and the side opposite is the HYPOTENUSE. The acute angles add to 90 degrees, since all three make 180.',
      ),
      L(
        "Har qanday uchburchakda katta burchak qarshisida katta tomon yotadi. Shuning uchun gipotenuza eng uzun tomon. Va alohida holat: 30 daraja qarshisidagi katet gipotenuzaning yarmiga teng.",
        'В любом треугольнике против большего угла лежит большая сторона. Поэтому гипотенуза самая длинная сторона. И особый случай: катет против 30 градусов равен половине гипотенузы.',
        'In any triangle the larger side lies opposite the larger angle. So the hypotenuse is the longest side. And a special case: the leg opposite 30 degrees is half the hypotenuse.',
      ),
    ],
  },
  hookCap: L(
    'Gipotenuza  --  eng uzun',
    'Гипотенуза — самая длинная',
    'The hypotenuse — the longest',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("katetlar  --  to'g'ri burchak yonida", 'катеты при прямом угле', 'the legs sit at the right angle'),
    L("o'tkir burchaklar  --  birga 90", 'острые углы вместе 90', 'the acute angles make 90'),
    L('30 daraja  --  yarim gipotenuza', '30 градусов это половина гипотенузы', '30 degrees means half the hypotenuse'),
  ],
  audio: [
    A('mount', "Tomonlarning nomlarini va nisbatni ko'rdik. Endi qoidani yig'amiz.", 'Мы увидели названия сторон и соотношение. Теперь соберём правило.', 'We saw the names of the sides and the relation. Now let us build the rule.'),
    A('ok', "To'g'ri. Gipotenuza uzunligini hisoblash 8-sinfda ochiladi.", 'Верно. Вычисление длины гипотенузы раскроется в 8 классе.', 'Correct. Computing the hypotenuse comes in grade 8.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI.
// ============================================================
const S9 = {
  kind: 'chain',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Tomon va burchak', 'Сторона и угол', 'The side and the angle'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "To'g'ri burchakli uchburchakda bir o'tkir burchak 62 daraja. Ikkinchisi?",
        'В прямоугольном треугольнике один острый угол 62 градуса. Второй?',
        'In a right triangle one acute angle is 62 degrees. The second?',
      ),
      ok: L("To'qson dan oltmish ikki ayirilsa yigirma sakkiz.", 'Девяносто минус шестьдесят два это двадцать восемь.', 'Ninety minus sixty two is twenty eight.'),
      items: [
        { id: 'a', label: '28°', correct: true },
        { id: 'b', label: '118°', tag: 'Z2', hint: L("O'tkir burchak 90 dan kichik bo'lishi kerak.", 'Острый угол должен быть меньше 90.', 'An acute angle must be under 90.') },
        { id: 'c', label: '38°', tag: 'Z6', hint: L("To'qson dan ayiriladi, yuz dan emas.", 'Вычитают из девяноста, а не из ста.', 'Subtract from ninety, not one hundred.') },
        { id: 'd', label: '62°', tag: 'Z2', hint: L("Teng bo'lishi katetlar teng bo'lganda.", 'Равными они бывают, когда равны катеты.', 'They are equal when the legs are equal.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uchburchakda burchaklar 40, 60 va 80. Eng uzun tomon qaysi burchak qarshisida?",
        'Углы треугольника 40, 60 и 80. Против какого угла самая длинная сторона?',
        'The angles are 40, 60 and 80. Which angle does the longest side face?',
      ),
      ok: L("Sakson daraja qarshisida: eng katta burchak.", 'Против восьмидесяти градусов: это самый большой угол.', 'Opposite eighty degrees: the largest angle.'),
      items: [
        { id: 'a', label: '80°', correct: true },
        { id: 'b', label: '40°', tag: 'Z3', hint: L("Qirq eng kichik burchak: uning qarshisida eng qisqa tomon.", 'Сорок это самый малый угол: против него самая короткая сторона.', 'Forty is the smallest: the shortest side faces it.') },
        { id: 'c', label: '60°', tag: 'Z3', hint: L("Oltmish o'rtada turadi.", 'Шестьдесят стоит в середине.', 'Sixty is in the middle.') },
        { id: 'd', tag: 'Z3', label: L('bilib bo\'lmaydi', 'узнать нельзя', 'it cannot be known'), hint: L("Bilish mumkin: burchaklarni solishtirish yetarli.", 'Можно: достаточно сравнить углы.', 'It can: comparing the angles is enough.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Gipotenuza 20, bir o'tkir burchak 30 daraja. Shu burchak qarshisidagi katet?",
        'Гипотенуза 20, один острый угол 30 градусов. Катет против этого угла?',
        'The hypotenuse is 20 and one acute angle is 30 degrees. The leg opposite it?',
      ),
      ok: L("O'n: gipotenuzaning yarmi.", 'Десять: половина гипотенузы.', 'Ten: half the hypotenuse.'),
      items: [
        { id: 'a', label: '10', correct: true },
        { id: 'b', label: '20', tag: 'Z5', hint: L("Yigirma gipotenuzaning o'zi.", 'Двадцать это сама гипотенуза.', 'Twenty is the hypotenuse itself.') },
        { id: 'c', label: '30', tag: 'Z5', hint: L("O'ttiz bu burchak, javob esa uzunlik.", 'Тридцать это угол, а ответ длина.', 'Thirty is the angle, the answer is a length.') },
        { id: 'd', label: '15', tag: 'Z6', hint: L("Yigirmaning yarmi o'n.", 'Половина двадцати это десять.', 'Half of twenty is ten.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Gipotenuza katetdan qisqa bo'la oladimi?",
        'Может ли гипотенуза быть короче катета?',
        'Can the hypotenuse be shorter than a leg?',
      ),
      ok: L("Yo'q: u eng katta burchak qarshisida yotadi va eng uzun bo'ladi.", 'Нет: она лежит против самого большого угла и потому самая длинная.', 'No: it faces the largest angle and so is the longest.'),
      items: [
        { id: 'a', correct: true, label: L("yo'q", 'нет', 'no') },
        { id: 'b', tag: 'Z1', label: L('ha', 'да', 'yes'), hint: L("To'g'ri burchak eng katta, va qarshisidagi tomon eng uzun.", 'Прямой угол самый большой, и сторона против него самая длинная.', 'The right angle is the largest, and the side facing it is the longest.') },
        { id: 'c', tag: 'Z1', label: L('katetlar teng bo\'lsa', 'если катеты равны', 'if the legs are equal'), hint: L("Katetlar teng bo'lsa ham gipotenuza uzunroq qoladi.", 'Даже при равных катетах гипотенуза длиннее.', 'Even with equal legs the hypotenuse is longer.') },
        { id: 'd', tag: 'Z1', label: L("o'lchamga bog'liq", 'зависит от размера', 'it depends on the size'), hint: L("O'lcham nisbatni o'zgartirmaydi.", 'Размер соотношения не меняет.', 'Size does not change the relation.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Ikkinchisi nisbat haqida.", 'Четыре вопроса. Второй про соотношение.', 'Four questions. The second is about the relation.'),
    A('1', "Ikkinchisida burchaklar berilgan.", 'Во втором даны углы.', 'The second gives the angles.'),
    A('2', "Uchinchisi o'ttiz daraja holati.", 'Третий это случай тридцати градусов.', 'The third is the thirty degree case.'),
    A('3', "Oxirgisi gipotenuza haqida.", 'Последний про гипотенузу.', 'The last is about the hypotenuse.'),
  ],
}

// ============================================================
// 10. MASHQ 2. IKKI QADAM.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Burchak va tomon', 'Угол и сторона', 'The angle and the side'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  given: L(
    "To'g'ri burchakli uchburchakda bir o'tkir burchak 30 daraja, gipotenuza 16. Ikkinchi o'tkir burchakni va 30 daraja qarshisidagi katetni yozing.",
    'В прямоугольном треугольнике один острый угол 30 градусов, гипотенуза 16. Запиши второй острый угол и катет против 30 градусов.',
    'In a right triangle one acute angle is 30 degrees and the hypotenuse is 16. Write the second acute angle and the leg opposite the 30 degrees.',
  ),
  template: ['90 − 30 = ', { slot: 0 }, ',   16 : 2 = ', { slot: 1 }],
  parts: [
    { id: 'a', label: '60' },
    { id: 'b', label: '8' },
    { id: 'c', label: '150' },
    { id: 'd', label: '16' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ikkinchi o'tkir burchakni va katetni yozing.",
    'Запиши второй острый угол и катет.',
    'Write the second acute angle and the leg.',
  ),
  checkNote: L(
    "O'tkir burchaklar birga 90 beradi, shuning uchun ikkinchisi 60 daraja. O'ttiz daraja qarshisidagi katet esa gipotenuzaning yarmi, ya'ni 8.",
    'Острые углы вместе дают 90, поэтому второй 60 градусов. А катет против тридцати градусов это половина гипотенузы, то есть 8.',
    'The acute angles make 90, so the second is 60 degrees. And the leg opposite thirty degrees is half the hypotenuse, that is 8.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z2', hint: L("Bir yuz sakson dan emas, to'qson dan ayiriladi: to'g'ri burchak allaqachon olingan.", 'Вычитают не из ста восьмидесяти, а из девяноста: прямой угол уже занят.', 'Subtract from ninety, not one hundred eighty: the right angle is taken.') },
    { key: 'd', tag: 'Z5', hint: L("O'n olti gipotenuza, katet esa uning yarmi.", 'Шестнадцать это гипотенуза, а катет её половина.', 'Sixteen is the hypotenuse, the leg is half of it.') },
    { key: '*', tag: 'Z2', hint: L("Birinchi bo'shliq burchak, ikkinchisi uzunlik.", 'Первый пропуск это угол, второй длина.', 'The first gap is an angle, the second a length.') },
  ],
  probe: {
    question: L("Bu uchburchakda eng uzun tomon qaysi?", 'Какая сторона в этом треугольнике самая длинная?', 'Which side of this triangle is the longest?'),
    items: [
      { id: 'a', correct: true, label: L('gipotenuza', 'гипотенуза', 'the hypotenuse') },
      { id: 'b', tag: 'Z1', label: L('30 daraja qarshisidagi katet', 'катет против 30 градусов', 'the leg opposite 30 degrees'), hint: L("U eng kichik burchak qarshisida: eng qisqa.", 'Он против самого малого угла: самый короткий.', 'It faces the smallest angle: the shortest one.') },
      { id: 'c', tag: 'Z1', label: L('60 daraja qarshisidagi katet', 'катет против 60 градусов', 'the leg opposite 60 degrees'), hint: L("Oltmish to'qsondan kichik, demak bu tomon gipotenuzadan qisqa.", 'Шестьдесят меньше девяноста, значит эта сторона короче гипотенузы.', 'Sixty is under ninety, so that side is shorter than the hypotenuse.') },
      { id: 'd', tag: 'Z1', label: L('uchtasi teng', 'все три равны', 'all three are equal'), hint: L("Teng tomonli uchburchakda to'g'ri burchak bo'lmaydi.", 'В равностороннем треугольнике прямого угла не бывает.', 'An equilateral triangle has no right angle.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam: burchak va uzunlik.", 'Два шага: угол и длина.', 'Two steps: the angle and the length.'),
    A('two', "Endi katetni topamiz.", 'Теперь найдём катет.', 'Now we find the leg.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Eng qisqa tomon', 'Самая короткая сторона', 'The shortest side'),
  given: L(
    "To'g'ri burchakli uchburchakda o'tkir burchaklar 25 va 65 daraja. Eng qisqa tomon qaysi burchak qarshisida yotadi?",
    'В прямоугольном треугольнике острые углы 25 и 65 градусов. Против какого угла лежит самая короткая сторона?',
    'A right triangle has acute angles of 25 and 65 degrees. Which angle does the shortest side face?',
  ),
  template: ['25° < 65° < 90°   →   ', { slot: 0 }],
  parts: [
    { id: 'a', label: '25°' },
    { id: 'b', label: '65°' },
    { id: 'c', label: '90°' },
    { id: 'd', label: L('bilib bo\'lmaydi', 'узнать нельзя', 'it cannot be known') },
  ],
  answer: ['a'],
  prompt: L(
    "Eng qisqa tomon qarshisidagi burchakni yozing.",
    'Запиши угол против самой короткой стороны.',
    'Write the angle opposite the shortest side.',
  ),
  checkNote: L(
    "Eng kichik burchak 25 daraja, demak eng qisqa tomon uning qarshisida yotadi. Eng uzuni esa 90 daraja qarshisida, ya'ni gipotenuza.",
    'Самый малый угол 25 градусов, значит самая короткая сторона против него. А самая длинная против 90 градусов, то есть гипотенуза.',
    'The smallest angle is 25 degrees, so the shortest side faces it. The longest faces 90 degrees, that is the hypotenuse.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Oltmish besh o'rtada: uning qarshisida o'rtacha tomon.", 'Шестьдесят пять в середине: против него средняя сторона.', 'Sixty five is in the middle: the middle side faces it.') },
    { key: 'c', tag: 'Z1', hint: L("To'qson eng katta burchak: uning qarshisida eng UZUN tomon.", 'Девяносто самый большой угол: против него самая ДЛИННАЯ сторона.', 'Ninety is the largest: the LONGEST side faces it.') },
    { key: 'd', tag: 'Z3', hint: L("Bilish mumkin: burchaklarni solishtirish yetarli.", 'Можно: достаточно сравнить углы.', 'It can be known: comparing the angles is enough.') },
  ],
  audio: [
    A('mount', "Bu safar yordam yo'q.", 'На этот раз без помощи.', 'No help this time.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). KATETLAR QO'SHILGAN.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Qo'shish to'g'ri bajarilgan. Shunday bo'lsa ham, qaysi qator xato?",
    'Сложение выполнено верно. И всё же какая строка ошибочна?',
    'The addition is done correctly. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: L('katetlar 6 va 8', 'катеты 6 и 8', 'the legs are 6 and 8') },
    { id: 'r2', text: L('gipotenuza = katetlar yig\'indisi', 'гипотенуза = сумма катетов', 'hypotenuse = the sum of the legs') },
    { id: 'r3', text: '6 + 8 = 14' },
    { id: 'r4', text: L('javob: gipotenuza 14', 'ответ: гипотенуза 14', 'answer: the hypotenuse is 14') },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu berilgan katetlar.", 'Это данные катеты.', 'Those are the given legs.'),
    r3: L("Hisob to'g'ri: olti qo'shuv sakkiz o'n to'rt.", 'Счёт верен: шесть плюс восемь это четырнадцать.', 'The arithmetic is right: six plus eight is fourteen.'),
    r4: L("Bu qator oldingisidan chiqqan. Xato esa undan YUQORIDA.", 'Эта строка выходит из предыдущей. А ошибка ВЫШЕ неё.', 'This line follows from the one before. The mistake is ABOVE it.'),
  },
  tags: { r1: 'Z4', r3: 'Z4', r4: 'Z1' },
  proofFill: {
    template: ['6 + 8 = 14   →   ', { slot: 0 }, ',   ', { slot: 1 }],
    parts: [
      { id: 'a', label: L('gipotenuza 14 dan qisqa', 'гипотенуза короче 14', 'the hypotenuse is under 14') },
      { id: 'b', label: L('katetlar qo\'shilmaydi', 'катеты не складывают', 'the legs are not added') },
      { id: 'c', label: L('gipotenuza aynan 14', 'гипотенуза ровно 14', 'the hypotenuse is exactly 14') },
      { id: 'd', label: L('katetlar qo\'shiladi', 'катеты складывают', 'the legs are added') },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Xulosani tuzating va sababini ko'rsating.",
      'Исправь вывод и укажи причину.',
      'Fix the conclusion and give the reason.',
    ),
    checkNote: L(
      "Ikki tomon yig'indisi uchinchisidan KATTA bo'lishi kerak, teng emas. Demak gipotenuza 14 dan qisqa. Katetlarni qo'shib gipotenuza chiqmaydi: uni qanday hisoblash 8-sinfda ochiladi, hozir esa u chizmada o'lchanadi.",
      'Сумма двух сторон должна быть БОЛЬШЕ третьей, а не равна ей. Значит гипотенуза короче 14. Складывая катеты, гипотенузу не получить: как её вычислять, раскроется в 8 классе, а сейчас её измеряют на чертеже.',
      'The sum of two sides must be GREATER than the third, not equal. So the hypotenuse is under 14. Adding the legs does not give it: how to compute it comes in grade 8, for now it is measured on the drawing.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z4', hint: L("Teng bo'lsa uchburchak yopilmasdi: uchlar bir chiziqda qolardi.", 'Если бы равнялась, треугольник не замкнулся бы: вершины легли бы на прямую.', 'If it were equal the triangle could not close: the vertices would lie on a line.') },
      { key: 'd', tag: 'Z4', hint: L("Qo'shish uzunlikni beradi, lekin gipotenuzani emas.", 'Сложение даёт длину, но не гипотенузу.', 'Adding gives a length, but not the hypotenuse.') },
      { key: '*', tag: 'Z4', hint: L("Chizmada uch va to'rt katetlarda gipotenuza besh chiqqan edi, yetti emas.", 'На чертеже при катетах три и четыре гипотенуза вышла пять, а не семь.', 'On the drawing with legs three and four the hypotenuse came out five, not seven.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda qo'shish to'g'ri bajarilgan.", 'В этой ловушке сложение выполнено верно.', 'In this trap the addition is done correctly.'),
    A('mount', "Lekin qo'shish natijasi gipotenuza emas.", 'Но результат сложения это не гипотенуза.', 'But the result of the addition is not the hypotenuse.'),
    A('proof', "Topdingiz. Xukda ham xuddi shu tuzoq turgan edi.", 'Нашёл. В хуке стояла та же ловушка.', 'You found it. The hook held the same trap.'),
    A('done', "Yig'indi uchinchi tomondan katta bo'lishi kerak, teng emas.", 'Сумма должна быть больше третьей стороны, а не равна ей.', 'The sum must be greater than the third side, not equal to it.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. NARVON.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Narvon devorga', 'Лестница к стене', 'A ladder against a wall'),
  given: L(
    "Narvon devorga tirab qo'yilgan va yer bilan 30 daraja burchak hosil qilgan. Narvonning uzunligi 4 metr. Uning yuqori uchi yerdan qancha balandda?",
    'Лестницу приставили к стене, и с землёй она образует угол 30 градусов. Длина лестницы 4 метра. На какой высоте её верхний конец?',
    'A ladder leans on a wall making a 30 degree angle with the ground. The ladder is 4 metres long. How high is its upper end?',
  ),
  template: ['4 : 2 = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '2' },
    { id: 'b', label: '4' },
    { id: 'c', label: '1' },
    { id: 'd', label: '30' },
  ],
  answer: ['a'],
  prompt: L(
    "Balandlikni metrda yozing.",
    'Запиши высоту в метрах.',
    'Write the height in metres.',
  ),
  checkNote: L(
    "Narvon, devor va yer to'g'ri burchakli uchburchak beradi. Narvon gipotenuza, balandlik esa 30 daraja qarshisidagi katet, ya'ni gipotenuzaning yarmi: 2 metr.",
    'Лестница, стена и земля дают прямоугольный треугольник. Лестница это гипотенуза, а высота это катет против 30 градусов, то есть половина гипотенузы: 2 метра.',
    'The ladder, the wall and the ground make a right triangle. The ladder is the hypotenuse and the height is the leg opposite 30 degrees, half the hypotenuse: 2 metres.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z5', hint: L("To'rt narvonning uzunligi, ya'ni gipotenuza.", 'Четыре это длина лестницы, то есть гипотенуза.', 'Four is the ladder length, the hypotenuse.') },
    { key: 'c', tag: 'Z6', hint: L("To'rtning yarmi ikki.", 'Половина четырёх это два.', 'Half of four is two.') },
    { key: 'd', tag: 'Z5', hint: L("O'ttiz bu burchak, javob esa balandlik.", 'Тридцать это угол, а ответ высота.', 'Thirty is the angle, the answer is a height.') },
  ],
  audio: [
    A('mount', "Narvon, devor va yer uchburchak beradi.", 'Лестница, стена и земля дают треугольник.', 'The ladder, the wall and the ground make a triangle.'),
    A('mount', "Burchak o'ttiz daraja, va bu alohida holat.", 'Угол тридцать градусов, а это особый случай.', 'The angle is thirty degrees, and that is the special case.'),
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
        "Bir o'tkir burchak 35 daraja. Ikkinchisi?",
        'Один острый угол 35 градусов. Второй?',
        'One acute angle is 35 degrees. The second?',
      ),
      ok: L("Ellik besh: birga to'qson.", 'Пятьдесят пять: вместе девяносто.', 'Fifty five: together ninety.'),
      items: [
        { id: 'a', label: '55°', correct: true },
        { id: 'b', label: '145°', tag: 'Z2', hint: L("O'tkir burchak 90 dan kichik.", 'Острый угол меньше 90.', 'An acute angle is under 90.') },
        { id: 'c', label: '65°', tag: 'Z6', hint: L("To'qson dan o'ttiz besh ayirilsa ellik besh.", 'Девяносто минус тридцать пять это пятьдесят пять.', 'Ninety minus thirty five is fifty five.') },
        { id: 'd', label: '35°', tag: 'Z2', hint: L("Teng bo'lishi katetlar teng bo'lganda.", 'Равны они при равных катетах.', 'They are equal when the legs are.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "To'g'ri burchak qarshisidagi tomon qanday ataladi?",
        'Как называется сторона против прямого угла?',
        'What is the side opposite the right angle called?',
      ),
      ok: L("Gipotenuza.", 'Гипотенуза.', 'The hypotenuse.'),
      items: [
        { id: 'a', correct: true, label: L('gipotenuza', 'гипотенуза', 'the hypotenuse') },
        { id: 'b', tag: 'Z1', label: L('katet', 'катет', 'a leg'), hint: L("Katetlar to'g'ri burchak yonida turadi.", 'Катеты стоят при прямом угле.', 'The legs sit at the right angle.') },
        { id: 'c', tag: 'Z1', label: L('asos', 'основание', 'the base'), hint: L("Asos teng yonli uchburchakning atamasi.", 'Основание это термин равнобедренного треугольника.', 'The base is a term for an isosceles triangle.') },
        { id: 'd', tag: 'Z1', label: L('balandlik', 'высота', 'the height'), hint: L("Balandlik tomon emas, chiziq.", 'Высота это не сторона, а линия.', 'The height is a line, not a side.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Katetlar 5 va 12. Gipotenuza 17 bo'la oladimi?",
        'Катеты 5 и 12. Может ли гипотенуза быть 17?',
        'The legs are 5 and 12. Can the hypotenuse be 17?',
      ),
      ok: L("Yo'q: besh qo'shuv o'n ikki aynan o'n yetti, uchburchak esa yopilmasdi.", 'Нет: пять плюс двенадцать это ровно семнадцать, и треугольник не замкнулся бы.', 'No: five plus twelve is exactly seventeen, and the triangle could not close.'),
      items: [
        { id: 'a', correct: true, label: L("yo'q", 'нет', 'no') },
        { id: 'b', tag: 'Z4', label: L('ha', 'да', 'yes'), hint: L("Yig'indi uchinchi tomondan KATTA bo'lishi kerak.", 'Сумма должна быть БОЛЬШЕ третьей стороны.', 'The sum must be GREATER than the third side.') },
        { id: 'c', tag: 'Z4', label: L("o'lchash kerak", 'нужно измерить', 'measuring is needed'), hint: L("Qo'shish yetarli.", 'Достаточно сложить.', 'Adding is enough.') },
        { id: 'd', tag: 'Z4', label: L('faqat katta uchburchakda', 'только в большом треугольнике', 'only in a large triangle'), hint: L("O'lcham bunga aloqasi yo'q.", 'Размер здесь ни при чём.', 'Size is beside the point.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uchburchakda burchaklar 50, 60 va 70. Eng qisqa tomon qaysi burchak qarshisida?",
        'Углы 50, 60 и 70. Против какого угла самая короткая сторона?',
        'The angles are 50, 60 and 70. Which angle does the shortest side face?',
      ),
      ok: L("Ellik daraja qarshisida: eng kichik burchak.", 'Против пятидесяти градусов: самый малый угол.', 'Opposite fifty degrees: the smallest angle.'),
      items: [
        { id: 'a', label: '50°', correct: true },
        { id: 'b', label: '70°', tag: 'Z3', hint: L("Yetmish eng katta: uning qarshisida eng uzun tomon.", 'Семьдесят самый большой: против него самая длинная.', 'Seventy is the largest: the longest side faces it.') },
        { id: 'c', label: '60°', tag: 'Z3', hint: L("Oltmish o'rtada.", 'Шестьдесят в середине.', 'Sixty is in the middle.') },
        { id: 'd', tag: 'Z3', label: L('uchtasi teng', 'все три равны', 'all three are equal'), hint: L("Burchaklar har xil, demak tomonlar ham har xil.", 'Углы разные, значит и стороны разные.', 'The angles differ, so the sides differ.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Yagona baholanadigan ekran.", 'Блиц, четыре вопроса. Единственный оцениваемый экран.', 'Quick round, four questions. The only graded screen.'),
    A('1', "Ikkinchisi atamalar haqida.", 'Второй про названия.', 'The second is about the names.'),
    A('2', "Uchinchisida qo'shib tekshiring.", 'В третьем проверь сложением.', 'In the third check by adding.'),
    A('3', "Oxirgisi nisbat haqida.", 'Последний про соотношение.', 'The last is about the relation.'),
  ],
}

// ============================================================
// 15. YAKUN.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Katta burchak, katta tomon', 'Больший угол, большая сторона', 'The larger angle, the larger side'),
  gate: S1.gate,
  fix: {
    tokens: ['?'],
    value: '5',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Katetlarni qo'shib bo'lmaydi: ikki tomonning yig'indisi uchinchisidan katta bo'lishi kerak. Chizmada besh o'lchandi, va gipotenuza istalgan katetdan uzun bo'lib qoldi.",
    'Складывать катеты нельзя: сумма двух сторон должна быть больше третьей. На чертеже измерено пять, и гипотенуза оказалась длиннее любого катета.',
    'The legs cannot be added: the sum of two sides must exceed the third. The drawing measured five, and the hypotenuse came out longer than either leg.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    five: '5',
    seven: '7',
    four: '4',
    cant: L('bilib bo\'lmaydi', 'узнать нельзя', 'cannot be known'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['3, 4, 5', '90 − 62 = 28', '9 > 7 > 5', '12 : 2 = 6'],
  twoLabel: L('Ikki xulosa', 'Два вывода', 'Two conclusions'),
  twoA: L(
    "o'tkir burchaklar  →  birga 90",
    'острые углы  →  вместе 90',
    'the acute angles  →  ninety together',
  ),
  twoB: L(
    'gipotenuza  →  eng uzun',
    'гипотенуза  →  самая длинная',
    'the hypotenuse  →  the longest',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    'sirkul va chizg\'ich bilan yasashlar',
    'построения циркулем и линейкой',
    'constructions with compass and straightedge',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz.", 'Вернёмся к началу. Вот что ты предполагал.', 'Back to the start. This is what you predicted.'),
    A('mount', "Gipotenuzani hisoblash 8-sinfda ochiladi, bugun esa uning eng uzun ekanini bildik.", 'Вычисление гипотенузы раскроется в 8 классе, а сегодня мы узнали, что она самая длинная.', 'Computing the hypotenuse comes in grade 8; today we learned it is the longest.'),
    A('mount', "Keyingi darsda sirkul va chizg'ich bilan yasashga o'tamiz.", 'На следующем уроке перейдём к построениям циркулем и линейкой.', 'Next lesson we move to constructions with compass and straightedge.'),
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
