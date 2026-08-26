// ============================================================================
// 11-sinf, Dars 36. VEKTORLAR USTIDA AMALLAR.
//
// B5 blokining ikkinchi darsi.
//   kontrakt: src/books/grade11/ETALON_11SINF.md
//   asbob:    `SpaceFrame`, `vec` va `sum` rejimlari
//   darslik:  1-qism, 122-124-betlar, 39-65 masalalar, bob testi 142-bet
//
// DARSNING BITTA GAPI: vektor uchta son bilan beriladi, va bu sonlar bilan
// ishlash HAR BIR O'Q bo'ylab alohida boradi -- qo'shish ham, songa
// ko'paytirish ham.
//
// XUK darslikning 20.c rasmidan: oqqush, qisqichbaqa va cho'rtan aravani uch
// tomonga tortadi. Darslik o'zi shunday yozadi: qahramonlar aravani joyidan
// qo'zg'ata olmaydi.
//
// SONLAR TEKSHIRILDI:
//   1-masala (123-bet): A(2;7;-3), B(1;0;3), C(-3;-4;5), D(-2;3;-1)
//     AB = DC = (-1;-7;6);  BA = (1;7;-6);  BC = AD = (-4;-4;2)
//     |AB|^2 = 86,  |BA|^2 = 86 (uzunlik bir xil, tartib boshqa!),  |BC| = 6
//   44-masala: |a| = |b|, a(2;1;3), b(-1;x;2) -> 14 = 5 + x^2 -> x = +-3
//   qayiq: (120;0;0) + (0;90;0) = (120;90;0), uzunligi 150
//   57.1-masala: a(1;-4;0) - b(-4;8;0) = (5;-12;0), uzunligi 13
//   blits: AB(2;3;4);  |(2;-6;3)| = 7;  2b = (-8;16;4);  m = 2
//
// QAYIQ SONLARI O'ZGARTIRILDI. Darslikda 120 va 100 N, javobi ildiz ostida
// 24400 -- kalkulyator kerak bo'lardi. 90 va 120 olindi: 3-4-5 uchligi,
// javob 150 butun son. Bu chetlanish shu yerda yozib qo'yildi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_36',
  title: L('Vektorlar ustida amallar', 'Действия над векторами', 'Operations on vectors'),
}

const BLOCK = { label: 'B5', from: 35, to: 41, current: 36 }

// ============================================================
// SLAYD 1. XUK. Uch tomonga tortilgan arava.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Vektorlar ustida amallar', 'Действия над векторами', 'Operations on vectors'),
  title: L('Arava qayoqqa ketadi', 'Куда поедет телега', 'Where will the cart go'),
  expr: L('uch tomonga tortilgan arava', 'телегу тянут в три стороны', 'a cart pulled three ways'),
  rows: [
    {
      id: 'a',
      name: L('birinchi', 'первый', 'the first'),
      value: L('eng kuchli tomonga', 'в сторону самой большой силы', 'toward the largest force'),
    },
    {
      id: 'b',
      name: L('ikkinchi', 'второй', 'the second'),
      value: L('hech qayoqqa', 'никуда', 'nowhere'),
    },
  ],
  probe: {
    question: L('Kim haq?', 'Кто прав?', 'Who is right?'),
    afterPredict: L(
      'Javobingiz yozib olindi. Endi kuchlarni qo\'shamiz.',
      'Твой ответ записан. Сейчас сложим силы.',
      'Your answer is saved. Now we will add the forces.',
    ),
    items: [
      { id: 'a', label: L('birinchi', 'первый', 'the first') },
      { id: 'b', label: L('ikkinchi', 'второй', 'the second') },
      { id: 'both', label: L('ikkalasi ham', 'оба', 'both') },
      { id: 'none', label: L('hech kim', 'никто', 'nobody') },
    ],
  },
  holds: [4000, 5500, 3900],
  audio: [
    A('mount', "O'tgan darsda joyni uchta son berdi. Bugun shu uchlik bilan ishlaymiz.", 'На прошлом уроке место задали три числа. Сегодня будем работать с этой тройкой.', 'Last lesson three numbers gave a place. Today we work with that triple.'),
    A('r1', "Mashhur masal: oqqush, qisqichbaqa va cho'rtan aravani uch tomonga tortadi. Birinchi fikr: arava eng kuchli tomonga ketadi.", 'Известная басня: лебедь, рак и щука тянут телегу в три стороны. Первое мнение: телега поедет в сторону самой большой силы.', 'A famous fable: a swan, a crayfish and a pike pull a cart three ways. The first opinion: the cart goes toward the largest force.'),
    A('r2', "Ikkinchi fikr: arava joyidan qo'zg'almaydi.", 'Второе мнение: телега вообще не двинется с места.', 'The second opinion: the cart will not move at all.'),
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
    "Birinchisi o'tgan darsdan, qolgani quyi sinflardan. Bu baholanmaydi.",
    'Первая с прошлого урока, остальные из младших классов. Это не оценивается.',
    'The first from last lesson, the rest from earlier grades. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Uchlik va tartib', 'Тройка и порядок', 'The triple and the order'),
      short: L('35-darsdan', 'из урока 35', 'from lesson 35'),
      ex: [{ e: '(x; y; z)', why: L("har bir son o'z o'qida", 'каждое число на своей оси', 'each number on its own axis') }],
    },
    {
      id: 'c2',
      title: L('Pifagor', 'Пифагор', 'Pythagoras'),
      short: L('uzunlik uchun', 'для длины', 'for a length'),
      ex: [{ e: '√(9 + 16) = 5', why: L('katetlar bo\'yicha gipotenuza', 'гипотенуза по катетам', 'the hypotenuse from the legs') }],
    },
    {
      id: 'c3',
      title: L('Ishora va yo\'nalish', 'Знак и направление', 'Sign and direction'),
      short: L("o'q bo'ylab", 'вдоль оси', 'along an axis'),
      ex: [{ e: L('minus -- teskari tomon', 'минус — обратная сторона', 'minus is the opposite way'), why: L('uzunlik esa o\'zgarmaydi', 'а длина не меняется', 'while the length stays') }],
    },
  ],
  tasks: [
    {
      // Ikki ustun: to'rttada uzun variantlar telefonda kesilardi.
      id: 't1', ask: true, cols: 2,
      prompt: L('(0; 4; 5) nuqta qayerda yotadi?', 'Где лежит точка (0; 4; 5)?', 'Where does the point (0; 4; 5) lie?'),
      items: [
        { id: 'a', label: L('Oyz tekisligida', 'в плоскости Oyz', 'in the plane Oyz'), correct: true },
        { id: 'b', label: L("Oy o'qida", 'на оси Oy', 'on the Oy axis'), hint: L("O'qda ikkita nol bo'lardi, bu yerda bittasi.", 'На оси было бы два нуля, здесь один.', 'On an axis there would be two zeros, here there is one.') },
        { id: 'c', label: L('Oxy tekisligida', 'в плоскости Oxy', 'in the plane Oxy'), hint: L("Nolga aylangan koordinata abssissa, applikata emas.", 'Нулём стала абсцисса, а не аппликата.', 'The abscissa vanished, not the applicate.') },
        { id: 'd', label: L('oktanta ichida', 'внутри октанта', 'inside an octant'), hint: L("Ichida nol bo'lmasligi kerak.", 'Внутри нулей быть не должно.', 'Inside there are no zeros.') },
      ],
    },
    {
      id: 't2', ask: true, cols: 4,
      prompt: '√(36 + 64)',
      items: [
        { id: 'a', label: '10', correct: true },
        { id: 'b', label: '14', hint: L("Bu ildizlar yig'indisi. Ildiz ostida yuz turadi.", 'Это сумма корней. Под корнем сто.', 'That is the sum of the roots. Under the root there is a hundred.') },
        { id: 'c', label: '50', hint: L("Bu ildiz ostidagi sonning yarmi.", 'Это половина числа под корнем.', 'That is half the number under the root.') },
        { id: 'd', label: '100', hint: L("Bu ildiz ostidagi sonning o'zi.", 'Это само число под корнем.', 'That is the number under the root itself.') },
      ],
    },
    {
      id: 't3', ask: true, cols: 2,
      prompt: L('Son manfiy bo\'lsa, yo\'nalish?', 'Если число отрицательное, направление?', 'If the number is negative, the direction?'),
      items: [
        { id: 'a', label: L('teskari', 'обратное', 'the opposite'), correct: true },
        { id: 'b', label: L("o'sha", 'то же', 'the same'), hint: L("Minus aynan yo'nalishni aylantiradi, uzunlikni esa tegmaydi.", 'Минус как раз разворачивает направление, а длину не трогает.', 'A minus is what turns the direction, leaving the length alone.') },
      ],
    },
  ],
  holds: [3000, 4500, 4000, 4500, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch o'tgan darsdan: nuqtani uchta son beradi va har biri o'z o'qiga bog'langan.", 'Первая опора с прошлого урока: точку задают три числа, и каждое привязано к своей оси.', 'The first basic from last lesson: three numbers give a point, and each belongs to its own axis.'),
    A('c2', "Ikkinchi tayanch: Pifagor teoremasi ikki katet bo'yicha gipotenuzani beradi.", 'Вторая опора: теорема Пифагора даёт гипотенузу по двум катетам.', 'The second basic: the Pythagorean theorem gives the hypotenuse from two legs.'),
    A('c3', "Uchinchi tayanch: manfiy son yo'nalishni teskari qiladi, uzunlikni esa o'zgartirmaydi.", 'Третья опора: отрицательное число разворачивает направление, а длину не меняет.', 'The third basic: a negative number reverses the direction and leaves the length.'),
    A('recap', 'Uchtasi birga bugungi javobni beradi.', 'Три вместе и дают сегодняшний ответ.', 'The three together give today\'s answer.'),
    A('tasks', 'Endi uchta qisqa topshiriq.', 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. MEZONNI O'ZI TOPADI: vektorlar qachon teng.
//
// Ikki da'vogar: «uzunligi bir xil bo'lsa teng» va «koordinatalari bir xil
// bo'lsa teng». BA vektori birinchisini YIQITADI: uzunligi aynan bir xil,
// lekin yo'nalishi teskari.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'vector_order',
  eyebrow: L('Tenglikni tekshiramiz', 'Проверяем равенство', 'Checking equality'),
  title: L('Qaysi vektor AB ga teng', 'Какой вектор равен AB', 'Which vector equals AB'),
  expr: 'AB (−1; −7; 6)',
  goal: L('mezonni topish', 'найти признак', 'find the criterion'),
  rule: L(
    "Har bir vektorni oxiri minus boshi bilan sanaymiz.",
    'Каждый вектор считаем как конец минус начало.',
    'Each vector we compute as the end minus the start.',
  ),
  pick: L('Qaysi vektorni tekshiramiz?', 'Какой вектор проверим?', 'Which vector shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('uzunligi bir xil', 'та же длина', 'the same length'), value: '|v|' },
    { id: 'b', key: 'inB', name: L('koordinatalari bir xil', 'те же координаты', 'the same coordinates'), value: '(v)' },
  ],
  points: [
    {
      id: 'q1', label: 'DC', num: '(−1; −7; 6)', step: 'calc', verdict: 'in',
      calc: L('xuddi shu uchlik', 'та же тройка', 'the same triple'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q2', label: 'BA', num: '(1; 7; −6)', step: 'calc', verdict: 'out',
      calc: L("uzunligi bir xil, ishoralari teskari", 'длина та же, знаки противоположны', 'the same length, opposite signs'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q3', label: 'BC', num: '(−4; −4; 2)', step: 'calc', verdict: 'out',
      calc: L('boshqa uchlik, uzunligi olti', 'другая тройка, длина шесть', 'another triple, length six'),
      sol: false, inA: false, inB: false,
    },
    {
      id: 'q4', label: 'AD', num: '(−4; −4; 2)', step: 'calc', verdict: 'out',
      calc: L('BC ga teng, AB ga emas', 'равен BC, а не AB', 'equals BC, not AB'),
      sol: false, inA: false, inB: false,
    },
  ],
  probe: {
    question: L(
      'Vektorlar qachon teng?',
      'Когда векторы равны?',
      'When are two vectors equal?',
    ),
    items: [
      { id: 'b', label: L('koordinatalari teng bo\'lsa', 'когда равны координаты', 'when the coordinates match'), correct: true },
      { id: 'a', label: L("uzunligi teng bo'lsa", 'когда равны длины', 'when the lengths match'), hint: L("BA ning uzunligi AB bilan bir xil, lekin u teskari tomonga qaraydi.", 'У BA длина та же, что у AB, но смотрит он в обратную сторону.', 'BA has the same length as AB, but it points the opposite way.') },
      { id: 'c', label: L('yonma-yon turgan bo\'lsa', 'когда нарисованы рядом', 'when drawn side by side'), hint: L("Joy hech narsani hal qilmaydi: DC boshqa yerda turadi, lekin AB ga teng.", 'Место ничего не решает: DC нарисован в другом месте, но равен AB.', 'The place decides nothing: DC is drawn elsewhere yet equals AB.') },
      { id: 'd', label: L('bir tekislikda yotsa', 'когда лежат в одной плоскости', 'when they lie in one plane'), hint: L("Bir tekislikda yotish tenglik emas: BC va AD bir xil, AB esa boshqa.", 'Лежать в одной плоскости не значит быть равными: BC и AD совпали, а AB другой.', 'Lying in one plane is not equality: BC and AD match, AB differs.') },
    ],
  },
  holds: [3000, 4000, 2500, 2600, 9000],
  audio: [
    A('mount', 'Taxmin bor. Endi tenglikning mezonini topamiz.', 'Прогноз есть. Теперь найдём признак равенства.', 'The guess is made. Now let us find the criterion of equality.'),
    A('mount', "Ikki da'vo bor. Biri uzunlik bir xil bo'lsa teng deydi, ikkinchisi koordinatalar bir xil bo'lsa deydi.", 'Есть два утверждения. Одно говорит, что равны при равной длине, а другое, что при равных координатах.', 'There are two claims. One says equal lengths mean equal vectors, the other says equal coordinates do.'),
    A('mount', "To'rtta vektorni birma bir sanaymiz.", 'Посчитаем четыре вектора по одному.', 'Let us compute four vectors one by one.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Mana natija. DC ning uchligi AB bilan aynan bir xil, demak u teng. BA ning uzunligi ham xuddi shunday, lekin ishoralari teskari, va u teng emas. Aynan shu vektor birinchi da'voni yiqitdi: uzunlik yetmaydi. BC va AD bir biriga teng, AB ga esa emas.", 'Вот результат. У DC тройка ровно та же, что у AB, значит он равен. У BA длина такая же, но знаки противоположны, и он не равен. Именно этот вектор и уронил первое утверждение: длины недостаточно. BC и AD равны друг другу, а AB нет.', 'Here is the result. DC has exactly the same triple as AB, so it is equal. BA has the same length but opposite signs, and it is not equal. That very vector felled the first claim: length is not enough. BC and AD equal each other, but not AB.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: ERKIN VEKTOR. Bir xil uchlik, boshqa joy.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'free_vector',
  drag: false,
  graphSteps: 3,
  eyebrow: L('Chizma', 'Чертёж', 'The drawing'),
  title: L('Bir xil uchlik, boshqa joy', 'Та же тройка, другое место', 'The same triple, another place'),
  chip: '|a| = 5',
  space: {
    mode: 'vec',
    box: [3, 7, 5],
    interactive: true,
    height: 200,
    value: 'len',
    valueLabel: '|a|',
    vectors: [
      { from: [1, 0, 0], to: [1, 3, 4], label: 'a', coords: true },
      { from: [1, 3, 0], to: [1, 6, 4], label: 'b', tone: 'accent', coords: true, showAt: 2 },
    ],
    caption: L('karkasni barmoq bilan burish mumkin', 'каркас можно повернуть пальцем', 'you can turn the frame with a finger'),
  },
  bonus: L(
    "Geometriyada vektor ERKIN: uni istalgan nuqtaga qo'yish mumkin. Fizikada esa u nuqtaga qo'yilgan bo'ladi, va kuch qayerga qo'yilgani muhim.",
    'В геометрии вектор СВОБОДНЫЙ: его можно приложить к любой точке. В физике он приложен к точке, и место приложения силы важно.',
    'In geometry a vector is FREE: it can be placed at any point. In physics it is applied at a point, and where a force is applied matters.',
  ),
  probe: {
    question: L(
      "b vektorning uchligi qanday?",
      'Какова тройка вектора b?',
      'What is the triple of the vector b?',
    ),
    items: [
      { id: 'a', label: '(0; 3; 4)', correct: true },
      { id: 'b', label: '(1; 5; 4)', hint: L("Bu vektorning OXIRI, uchligi emas. Oxiridan boshini ayirish kerak.", 'Это КОНЕЦ вектора, а не тройка. Из конца надо вычесть начало.', 'That is the END of the vector, not its triple. Subtract the start from the end.') },
      { id: 'c', label: '(0; 2; 0)', hint: L("Bu ikki vektor orasidagi surilish, b ning o'zi emas.", 'Это сдвиг между двумя векторами, а не сам b.', 'That is the offset between the two vectors, not b itself.') },
      { id: 'd', label: '(0; −3; −4)', hint: L("Ishoralar teskari: bu b ning qarama-qarshisi.", 'Знаки противоположны: это вектор, обратный b.', 'The signs are opposite: that is the vector opposite to b.') },
    ],
  },
  holds: [3500, 6000, 5500],
  audio: [
    A('mount', "Mezon topildi. Endi chizmaga qaraymiz. Karkasda bitta strelka turadi.", 'Признак найден. Теперь посмотрим на чертёж. В каркасе стоит одна стрелка.', 'The criterion is found. Now let us look at the drawing. One arrow stands in the frame.'),
    A('one', "Uning uchligi o'zi yozildi: nol, uch, to'rt. Uzunligi Pifagor bo'yicha besh, chunki to'qqiz plyus o'n olti yigirma beshni beradi.", 'Его тройка выписалась сама: нуль, три, четыре. Длина по Пифагору пять, потому что девять плюс шестнадцать даёт двадцать пять.', 'Its triple wrote itself: zero, three, four. The length by Pythagoras is five, because nine plus sixteen gives twenty five.'),
    A('two', "Endi ikkinchi strelka paydo bo'ldi, boshqa joyda. Uchligi esa aynan o'sha. Demak bu bitta va o'sha vektor, faqat boshqa nuqtaga qo'yilgan.", 'Теперь появилась вторая стрелка, в другом месте. А тройка у неё ровно та же. Значит это один и тот же вектор, просто приложенный к другой точке.', 'Now a second arrow appeared, elsewhere. Its triple is exactly the same. So it is one and the same vector, only applied at another point.'),
    A('three', "Shuning uchun geometriyada vektor erkin deb ataladi: joyi emas, uchligi muhim.", 'Поэтому в геометрии вектор называют свободным: важна не его позиция, а тройка.', 'That is why in geometry a vector is called free: its triple matters, not its position.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1. Uchlik va uzunlik.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'vector_order',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Uchlik va uzunlik', 'Тройка и длина', 'The triple and the length'),
  rows: [
    L('AB = oxiri − boshi', 'AB = конец − начало', 'AB = the end − the start'),
    '|a| = √(a₁² + a₂² + a₃²)',
  ],
  probe: {
    question: L('AB va BA bitta vektormi?', 'AB и BA это один вектор?', 'Are AB and BA one vector?'),
    items: [
      { id: 'a', label: L("yo'q", 'нет', 'no'), correct: true },
      { id: 'b', label: L('ha, uzunligi bir xil', 'да, длина та же', 'yes, the same length'), hint: L("Uzunligi bir xil, lekin yo'nalishi teskari, va uchlikdagi ishoralar boshqa.", 'Длина та же, но направление обратное, и знаки в тройке другие.', 'The length is the same, but the direction is reversed and the signs differ.') },
      { id: 'c', label: L('ha, bitta kesmada', 'да, на одном отрезке', 'yes, on one segment'), hint: L("Kesma bitta, vektor esa ikkita: kesmaning yo'nalishi yo'q, vektorda bor.", 'Отрезок один, а вектора два: у отрезка нет направления, у вектора есть.', 'The segment is one, the vectors are two: a segment has no direction, a vector has.') },
      { id: 'd', label: L("chizmasiz aytib bo'lmaydi", 'без чертежа не сказать', 'cannot tell without a drawing'), hint: L("Chizma kerak emas: ayirish tartibi hammasini aytdi.", 'Чертёж не нужен: порядок вычитания уже всё определяет.', 'No drawing is needed: the order of subtraction has told everything.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Vektor', 'Правило 1. Вектор', 'Rule 1. The vector'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('AB = oxiri − boshi', 'AB = конец − начало', 'AB = the end − the start'),
    lines: [
      L('teng vektorlarning uchliklari teng', 'у равных векторов равны тройки', 'equal vectors have equal triples'),
      L("vektor ERKIN: joyi ahamiyatsiz", 'вектор СВОБОДНЫЙ: место не важно', 'a vector is FREE: its place does not matter'),
      L('BA da hamma ishoralar teskari', 'у BA все знаки противоположны', 'in BA every sign is reversed'),
      L('uzunlik uchta koordinata bo\'yicha Pifagor', 'длина это Пифагор по трём координатам', 'the length is Pythagoras over three coordinates'),
    ],
    example: L('misol:  |(0; 3; 4)| = 5', 'пример:  |(0; 3; 4)| = 5', 'example:  |(0; 3; 4)| = 5'),
  },
  holds: [4000, 7000, 4500],
  audio: [
    A('mount', 'Chizma ko\'rildi. Endi qoidani yozamiz.', 'Чертёж увидели. Теперь запишем правило.', 'We saw the drawing. Now let us write the rule.'),
    A('def', "Vektorning uchligi oxiridan boshini ayirib topiladi. Shuning uchun AB va BA boshqa vektorlar: ularning ishoralari qarama-qarshi. Uzunlik esa uchta koordinata bo'yicha Pifagor: kvadratlar yig'indisidan ildiz.", 'Тройку вектора находят, вычитая начало из конца. Поэтому AB и BA разные векторы: у них противоположные знаки. А длина это Пифагор по трём координатам, корень из суммы квадратов.', 'A vector triple is found by subtracting the start from the end. So AB and BA are different vectors: their signs are opposite. The length is Pythagoras over three coordinates, the root of the sum of squares.'),
    A('rule', "To'g'ri. Va tekshiruv: ishoralarni almashtirsangiz, vektor teskari tomonga qaraydi, uzunligi esa o'zgarmaydi.", 'Верно. И проверка: поменяй знаки, и вектор смотрит в обратную сторону, а длина та же.', 'Correct. And a check: flip the signs and the vector points the other way, while the length stays.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: ikkita vektor qo'shiladi.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'len_of_sum',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Ikkita vektor qo\'shiladi', 'Складываем два вектора', 'Adding two vectors'),
  was: { label: UI.was, expr: L('bitta vektor:  |a| = 5', 'один вектор: |a| = 5', 'one vector: |a| = 5') },
  now: { label: UI.now, expr: L('a va b:  |a + b| = ?', 'a и b: |a + b| = ?', 'a and b: |a + b| = ?') },
  probe1: {
    cols: 2,
    question: L('Yig\'indining uchligi qanday topiladi?', 'Как находят тройку суммы?', 'How is the triple of the sum found?'),
    items: [
      { id: 'a', label: L('har bir koordinata alohida', 'каждая координата отдельно', 'each coordinate on its own'), correct: true },
      { id: 'b', label: L('uzunliklar qo\'shiladi', 'складываются длины', 'the lengths are added'), hint: L("Uzunlik uchlikdan keyin sanaladi, uning o'rniga emas.", 'Длина считается после тройки, а не вместо неё.', 'The length is computed after the triple, not instead of it.') },
    ],
  },
  probe2: {
    // Ikki ustun: uzun variant telefonda kesilardi.
    cols: 2,
    question: L(
      "Yig'indining uzunligi uzunliklar yig'indisiga tengmi?",
      'Длина суммы равна сумме длин?',
      'Does the length of the sum equal the sum of the lengths?',
    ),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: L('ha, doim', 'да, всегда', 'yes, always') },
      { id: 'b', label: L("yo'q, doim kichik", 'нет, всегда меньше', 'no, always smaller') },
      { id: 'c', label: L("yo'q, doim katta", 'нет, всегда больше', 'no, always larger') },
      { id: 'd', label: L("yo'nalishlarga bog'liq", 'зависит от направлений', 'it depends on the directions') },
    ],
  },
  holds: [4000, 5000, 3000],
  audio: [
    A('mount', "Bitta vektorni bilamiz. Endi ikkitasi bo'ladi.", 'Один вектор мы знаем. Теперь их станет два.', 'We know one vector. Now there will be two.'),
    A('now', "Ikkita vektorni qo'shsak, yana vektor chiqadi. Uning uchligi qanday topiladi va uzunligi nimaga teng bo'ladi.", 'Если сложить два вектора, снова получится вектор. Как найти его тройку и чему равна его длина.', 'Adding two vectors gives a vector again. How is its triple found and what is its length.'),
    A('q1', "Yig'indining uchligi qanday topiladi?", 'Как находят тройку суммы?', 'How is the triple of the sum found?'),
    A('q2', "Endi taxmin qiling: yig'indining uzunligi uzunliklar yig'indisiga tengmi.", 'Теперь предположи: равна ли длина суммы сумме длин.', 'Now make a guess: does the length of the sum equal the sum of the lengths.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD, IKKALASI HAM TO'G'RI. 44-masala.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'check_by_point',
  eyebrow: L('Ikki nomzod', 'Два кандидата', 'Two candidates'),
  title: L('Uzunliklar teng bo\'lsin', 'Пусть длины равны', 'Let the lengths be equal'),
  expr: 'a (2; 1; 3),  b (−1; x; 2)',
  need: L('kvadratlar yig\'indisi 14', 'сумма квадратов 14', 'the sum of squares is 14'),
  answerLabel: L('x ning qiymatlari', 'значения x', 'the values of x'),
  cards: [
    {
      tag: 'x = 3',
      txt: '1 + 9 + 4 = 14',
      point: {
        label: L('kvadratlar yig\'indisi', 'сумма квадратов', 'the sum of squares'),
        calc: '14',
        verdict: 'in',
      },
    },
    {
      tag: 'x = −3',
      txt: '1 + 9 + 4 = 14',
      point: {
        label: L('kvadratlar yig\'indisi', 'сумма квадратов', 'the sum of squares'),
        calc: '14',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['±3', '3', '−3', '9'],
    value: ['±3'],
    label: 'x =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '3', hint: L("Ikkinchi ildiz yo'qoldi: kvadrat ikkita ishorani beradi.", 'Второй корень потерян: квадрат даёт два знака.', 'The second root is lost: a square gives two signs.') },
      { key: '−3', hint: L("Bu bitta ildiz. Musbat ildiz ham shartni qanoatlantiradi.", 'Это один корень. Положительный корень тоже подходит.', 'That is one root. The positive root fits as well.') },
      { key: '9', hint: L("Bu x kvadrat, so'ralgani esa x.", 'Это x в квадрате, а спрашивают x.', 'That is x squared, but x was asked.') },
      { key: '*', hint: L("O'n to'rt minus besh to'qqiz, ya'ni x kvadrat to'qqizga teng.", 'Четырнадцать минус пять девять, то есть x в квадрате равен девяти.', 'Fourteen minus five is nine, so x squared equals nine.') },
    ],
  },
  holds: [4000, 4500, 6000],
  audio: [
    A('mount', "Taxmin bor. Bu ekranda esa boshqa savol: uzunliklar qachon teng bo'ladi.", 'Прогноз есть. А на этом экране другой вопрос: когда длины равны.', 'The guess is made. This screen asks another question: when are the lengths equal.'),
    A('p1', "a ning kvadratlar yig'indisi to'rt plyus bir plyus to'qqiz, ya'ni o'n to'rt. b da esa bir plyus x kvadrat plyus to'rt. Demak x kvadrat to'qqizga teng.", 'У a сумма квадратов четыре плюс один плюс девять, то есть четырнадцать. У b это один плюс x в квадрате плюс четыре. Значит x в квадрате равен девяти.', 'For a the sum of squares is four plus one plus nine, that is fourteen. For b it is one plus x squared plus four. So x squared equals nine.'),
    A('p2', "Va endi eng muhimi: to'qqizning ildizi ikkita, uch va minus uch. Ikkala qiymat ham shartni qanoatlantiradi, chunki kvadratga ko'tarilganda ishora yo'qoladi. Javobni yozing.", 'И теперь главное: у девяти два корня, три и минус три. Оба значения подходят, потому что при возведении в квадрат знак исчезает. Запиши ответ.', 'And now the main point: nine has two roots, three and minus three. Both values fit, because squaring loses the sign. Write the answer.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2. Qo'shish, songa ko'paytirish, keyin bitta qoida.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'sum_rule',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Qo\'shish va songa ko\'paytirish', 'Сложение и умножение на число', 'Adding and scaling'),
  cases: [
    {
      label: L('qo\'shish', 'сложение', 'addition'),
      text: L('koordinatalar bo\'yicha', 'по координатам', 'coordinate by coordinate'),
      tone: 'graph',
    },
    {
      label: L('songa ko\'paytirish', 'умножение на число', 'scaling'),
      text: L('uzunlik va ishora', 'длина и знак', 'length and sign'),
      tone: 'accent',
    },
  ],
  rows: [
    'a (3; 0; 0) + b (0; 4; 0) = (3; 4; 0)',
    '|a| + |b| = 7,  |a + b| = 5',
  ],
  probe: {
    question: L(
      '−3b ning uzunligi qanday, agar |b| = 5 bo\'lsa?',
      'Какова длина −3b, если |b| = 5?',
      'What is the length of −3b if |b| = 5?',
    ),
    items: [
      { id: 'a', label: '15', correct: true },
      { id: 'b', label: '−15', hint: L("Uzunlik manfiy bo'lmaydi: minus yo'nalishni aylantiradi.", 'Длина не бывает отрицательной: минус разворачивает направление.', 'A length is never negative: the minus reverses the direction.') },
      { id: 'c', label: '5', hint: L("Uch barobar cho'zildi, ya'ni uzunlik ham uch barobar.", 'Растянули втрое, значит и длина втрое.', 'It was stretched threefold, so the length grows threefold.') },
      { id: 'd', label: '45', hint: L("Bu uzunlikni to'qqizga ko'paytirish bo'lardi.", 'Это было бы умножение длины на девять.', 'That would be multiplying the length by nine.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Amallar', 'Правило 2. Действия', 'Rule 2. The operations'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'a + b = (a₁ + b₁; a₂ + b₂; a₃ + b₃)',
    lines: [
      L('uchburchak, parallelogramm va parallelepiped -- bitta amal', 'треугольник, параллелограмм и параллелепипед — одно действие', 'triangle, parallelogram and box are one operation'),
      L('λa da har bir koordinata λ ga ko\'paytiriladi', 'в λa каждая координата умножается на λ', 'in λa each coordinate is multiplied by λ'),
      L('λ manfiy bo\'lsa yo\'nalish teskari, uzunlik |λ| barobar', 'при λ меньше нуля направление обратное, длина в |λ| раз', 'for λ below zero the direction flips, the length scales by |λ|'),
      L("yig'indining uzunligi uzunliklar yig'indisidan katta bo'lmaydi", 'длина суммы не больше суммы длин', 'the length of a sum never exceeds the sum of the lengths'),
    ],
    example: L('misol:  2 · (1; −3; 2) = (2; −6; 4)', 'пример:  2 · (1; −3; 2) = (2; −6; 4)', 'example:  2 · (1; −3; 2) = (2; −6; 4)'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('amallar HAR BIR o\'q bo\'ylab alohida boradi', 'действия идут по КАЖДОЙ оси отдельно', 'the operations go along EACH axis on its own'),
    lines: [
      L('1. uchlik oxiridan boshini ayirib chiqadi', '1. тройка получается из конца минус начало', '1. the triple comes from the end minus the start'),
      L('2. qo\'shish har bir koordinatada alohida', '2. сложение в каждой координате отдельно', '2. addition in each coordinate separately'),
      L('3. songa ko\'paytirish ham shunday', '3. умножение на число так же', '3. scaling likewise'),
      L('4. uzunlik esa oxirida, Pifagor bilan', '4. а длина в конце, по Пифагору', '4. and the length at the end, by Pythagoras'),
    ],
  },
  holds: [4000, 8000, 2600],
  audio: [
    A('mount', "Ikki ildiz topildi. Endi ikkinchi qoida.", 'Два корня нашли. Теперь второе правило.', 'The two roots are found. Now the second rule.'),
    A('rows', "Vektorlar koordinatalar bo'yicha qo'shiladi. Uch, nol, nol plyus nol, to'rt, nol uch, to'rt, nol beradi. Uzunliklar yig'indisi esa yetti, yig'indining uzunligi bes. Ya'ni uzunliklarni qo'shib bo'lmaydi: ular faqat bir tomonga qaragan vektorlarda qo'shiladi.", 'Векторы складываются по координатам. Три, нуль, нуль плюс нуль, четыре, нуль даёт три, четыре, нуль. А сумма длин семь, длина суммы пять. То есть длины складывать нельзя: они складываются только у векторов одного направления.', 'Vectors add coordinate by coordinate. Three, zero, zero plus zero, four, zero gives three, four, zero. The sum of lengths is seven, the length of the sum is five. So lengths cannot be added: they add only for vectors of one direction.'),
    A('rule', "To'g'ri.", 'Верно.', 'Correct.'),
    A('both', 'Endi butun darsni bitta qoidaga yig\'ing.', 'А теперь собери весь урок в одно правило.', 'Now combine the whole lesson into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. ISHORANI O'ZI QO'YADI: λ ning ishorasi.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'scale_sign',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('λ ning ishorasi', 'Знак λ', 'The sign of λ'),
  // Satr QISQA: `g11-expr-mid` ko'chirmaydi, va o'zbekcha matn telefonda
  // 108 px kesilardi -- jimgina, chunki `.stage-content` clip qiladi.
  left: L('λa TESKARI, ikki barobar uzun', 'λa НАПРОТИВ a, вдвое длиннее', 'λa is OPPOSITE, twice as long'),
  template: ['λ = ', { slot: 0 }, ' 2'],
  signs: ['+', '−'],
  answer: '−',
  checkNote: L(
    "Qarama-qarshi yo'nalish manfiy songa mos keladi",
    'Обратное направление отвечает отрицательному числу',
    'The opposite direction answers to a negative number',
  ),
  wrongs: [
    { key: '+', hint: L("Musbat son yo'nalishni saqlaydi, faqat cho'zadi. Bizga esa teskari tomon kerak.", 'Положительное число сохраняет направление, только растягивает. А нам нужна обратная сторона.', 'A positive number keeps the direction and only stretches. We need the opposite way.') },
  ],
  probe: {
    question: L("λa ning uzunligi qanday?", 'Какова длина λa?', 'What is the length of λa?'),
    items: [
      { id: 'a', label: L("|a| ning ikki barobari", 'вдвое больше |a|', 'twice |a|'), correct: true },
      { id: 'b', label: L("|a| ning yarmi", 'вдвое меньше |a|', 'half of |a|'), hint: L("Ikkiga ko'paytirildi, bo'linmadi.", 'Умножили на два, а не поделили.', 'It was multiplied by two, not divided.') },
      { id: 'c', label: L('manfiy', 'отрицательная', 'negative'), hint: L("Uzunlik manfiy bo'lmaydi: minus yo'nalishda qoladi.", 'Длина не бывает отрицательной: минус остаётся в направлении.', 'A length is never negative: the minus stays in the direction.') },
      { id: 'd', label: L("|a| bilan bir xil", 'такая же, как |a|', 'the same as |a|'), hint: L("Ikki barobar cho'zilgan vektorning uzunligi ham ikki barobar.", 'У вектора, растянутого вдвое, и длина вдвое.', 'A vector stretched twofold has twice the length.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "λ ning ishorasini qo'ying.", 'Поставь знак λ.', 'Place the sign of λ.'),
    A('checked', "Bo'ldi. Endi uzunlik haqida javob bering.", 'Готово. Теперь ответь про длину.', 'Done. Now answer about the length.'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ: qayiq. 65-masala, sonlari o'zgartirilgan.
// ============================================================
const ACTIONS_10 = [
  { id: 'sum', label: L("koordinatalar bo'yicha qo'shish", 'сложить по координатам', 'add coordinate by coordinate') },
  { id: 'sub', label: L("koordinatalar bo'yicha ayirish", 'вычесть по координатам', 'subtract coordinate by coordinate') },
  { id: 'len', label: L('uzunlikni topish', 'найти длину', 'find the length') },
  { id: 'addlen', label: L("uzunliklarni qo'shish", 'сложить длины', 'add the lengths') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'sum_rule',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qayiqni qanday kuch ushlaydi', 'Какая сила держит лодку', 'What force holds the boat'),
  start: L('oqim (0; 90; 0),  shamol (120; 0; 0)', 'течение (0; 90; 0),  ветер (120; 0; 0)', 'current (0; 90; 0),  wind (120; 0; 0)'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'sum',
      to: '(120; 90; 0)',
      wrongs: [
        { action: 'addlen', hint: L("Uzunliklarni qo'shish ikki yuz o'nni berardi, lekin kuchlar bir tomonga qaragan emas.", 'Сложение длин дало бы двести десять, но силы направлены не в одну сторону.', 'Adding the lengths would give two hundred ten, but the forces do not point one way.') },
        { action: 'len', hint: L("Avval yig'indining uchligini toping.", 'Сначала найди тройку суммы.', 'First find the triple of the sum.') },
        { action: 'sub', hint: L("Ayirish emas: ikki kuch birga ta'sir qiladi, ya'ni qo'shiladi.", 'Не вычитание: две силы действуют вместе, то есть складываются.', 'Not subtraction: the two forces act together, so they add.') },
      ],
    },
    {
      action: 'len',
      to: '150',
      wrongs: [
        { action: 'sum', hint: L("Qo'shildi: bir yuz yigirma, to'qson, nol.", 'Сложено: сто двадцать, девяносто, нуль.', 'Added: one hundred twenty, ninety, zero.') },
        { action: 'addlen', hint: L("Uzunliklar yig'indisi emas, YIG'INDINING uzunligi kerak.", 'Нужна не сумма длин, а длина СУММЫ.', 'Not the sum of the lengths, but the length of the SUM.') },
        { action: 'sub', hint: L("Ayirish kerak emas.", 'Вычитать не нужно.', 'No subtraction needed.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['150', '210', '30', '75'],
    value: ['150'],
    label: L('kuch =', 'сила =', 'force ='),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '210', hint: L("Bu uzunliklar yig'indisi. Kuchlar perpendikular, shuning uchun Pifagor kerak.", 'Это сумма длин. Силы перпендикулярны, поэтому нужен Пифагор.', 'That is the sum of the lengths. The forces are perpendicular, so Pythagoras is needed.') },
      { key: '30', hint: L("Bu ayirma. Kuchlar bir birini so'ndirmaydi: ular perpendikular.", 'Это разность. Силы друг друга не гасят: они перпендикулярны.', 'That is the difference. The forces do not cancel: they are perpendicular.') },
      { key: '75', hint: L("Bu yarmi. Yig'indining uzunligi bir yuz ellik.", 'Это половина. Длина суммы сто пятьдесят.', 'That is half. The length of the sum is one hundred fifty.') },
      { key: '*', hint: L("O'n to'rt ming to'rt yuz plyus sakkiz ming yuz yigirma ikki ming besh yuz beradi, uning ildizi bir yuz ellik.", 'Четырнадцать тысяч четыреста плюс восемь тысяч сто даёт двадцать две тысячи пятьсот, корень из этого сто пятьдесят.', 'Fourteen thousand four hundred plus eight thousand one hundred gives twenty two thousand five hundred, whose root is one hundred fifty.') },
    ],
  },
  audio: [
    A('mount', 'Ishora qo\'yildi. Endi masalani o\'tamiz.', 'Знак поставлен. Пройдём задачу.', 'The sign is placed. Let us work a problem.'),
    A('start', "Qayiqqa ikki kuch ta'sir qiladi: oqim va shamol. Ular perpendikular. Diqqat: ro'yxatda uzunliklarni qo'shish amali ham bor, va u tuzoq.", 'На лодку действуют две силы: течение и ветер. Они перпендикулярны. Внимание: в списке есть сложение длин, и это ловушка.', 'Two forces act on the boat: the current and the wind. They are perpendicular. Careful: the list holds adding the lengths, and that is a trap.'),
    A('step3', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL: 57-masala.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'sum_rule',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Ayirma va uning uzunligi', 'Разность и её длина', 'A difference and its length'),
  start: 'a (1; −4; 0),  b (−4; 8; 0)',
  actions: ACTIONS_10,
  hint: L(
    "Ayirish ham koordinatalar bo'yicha boradi.",
    'Вычитание тоже идёт по координатам.',
    'Subtraction also goes coordinate by coordinate.',
  ),
  steps: [
    {
      action: 'sub',
      to: '(5; −12; 0)',
      wrongs: [
        { action: 'sum', hint: L("Shartda ayirma so'ralgan: a minus b.", 'В условии просят разность: a минус b.', 'The problem asks for the difference: a minus b.') },
        { action: 'len', hint: L("Avval uchlikni toping.", 'Сначала найди тройку.', 'First find the triple.') },
        { action: 'addlen', hint: L("Uzunliklar bu yerda ham qo'shilmaydi.", 'Длины и здесь не складываются.', 'Lengths do not add here either.') },
      ],
    },
    {
      action: 'len',
      to: '13',
      wrongs: [
        { action: 'sub', hint: L("Uchlik topildi: besh, minus o'n ikki, nol.", 'Тройка найдена: пять, минус двенадцать, нуль.', 'The triple is found: five, minus twelve, zero.') },
        { action: 'sum', hint: L("Qo'shish kerak emas.", 'Складывать не нужно.', 'No addition needed.') },
        { action: 'addlen', hint: L("Uzunliklar yig'indisi emas.", 'Не сумма длин.', 'Not the sum of the lengths.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['13', '17', '169', '7'],
    value: ['13'],
    label: '|c| =',
    prompt: L('Uzunlikni yozing', 'Запиши длину', 'Write the length'),
    wrongs: [
      { key: '17', hint: L("Bu besh plyus o'n ikki. Kvadratlar ostida ildiz kerak.", 'Это пять плюс двенадцать. Нужен корень из суммы квадратов.', 'That is five plus twelve. The root of the sum of squares is needed.') },
      { key: '169', hint: L("Bu ildiz ostidagi son. Ildizini oling.", 'Это число под корнем. Возьми корень.', 'That is the number under the root. Take the root.') },
      { key: '7', hint: L("Bu ayirma. Yigirma besh plyus bir yuz qirq to'rt bir yuz oltmish to'qqiz.", 'Это разность. Двадцать пять плюс сто сорок четыре сто шестьдесят девять.', 'That is the difference. Twenty five plus a hundred forty four is a hundred sixty nine.') },
      { key: '*', hint: L("Yigirma besh plyus bir yuz qirq to'rt bir yuz oltmish to'qqiz, uning ildizi o'n uch.", 'Двадцать пять плюс сто сорок четыре сто шестьдесят девять, корень из этого тринадцать.', 'Twenty five plus a hundred forty four is a hundred sixty nine, whose root is thirteen.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "a minus b ni toping va uzunligini hisoblang.", 'Найди a минус b и посчитай длину.', 'Find a minus b and compute the length.'),
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
      id: 'b1', tag: 'vector_order', ask: true, cols: 4,
      done: '(2; 3; 4)',
      prompt: L('AB, agar A (3; 1; 2), B (5; 4; 6)', 'AB, если A (3; 1; 2), B (5; 4; 6)', 'AB, if A (3; 1; 2), B (5; 4; 6)'),
      items: [
        { id: 'a', label: '(2; 3; 4)', correct: true },
        { id: 'b', label: '(−2; −3; −4)', hint: L("Bu BA: boshi bilan oxiri almashtirilgan.", 'Это BA: начало и конец переставлены.', 'That is BA: the start and the end are swapped.') },
        { id: 'c', label: '(8; 5; 8)', hint: L("Bu yig'indi. Vektorda ayirma turadi.", 'Это сумма. В векторе стоит разность.', 'That is the sum. A vector takes the difference.') },
        { id: 'd', label: '(5; 4; 6)', hint: L("Bu B nuqtaning o'zi.", 'Это сама точка B.', 'That is the point B itself.') },
      ],
    },
    {
      id: 'b2', tag: 'check_by_point', ask: true, cols: 4,
      done: '7',
      prompt: L('|a|, agar a (2; −6; 3)', '|a|, если a (2; −6; 3)', '|a|, if a (2; −6; 3)'),
      items: [
        { id: 'a', label: '7', correct: true },
        { id: 'b', label: '11', hint: L("Bu modullar yig'indisi. Kvadratlar yig'indisidan ildiz kerak.", 'Это сумма модулей. Нужен корень из суммы квадратов.', 'That is the sum of absolute values. The root of the sum of squares is needed.') },
        { id: 'c', label: '49', hint: L("Bu ildiz ostidagi son.", 'Это число под корнем.', 'That is the number under the root.') },
        { id: 'd', label: '−1', hint: L("Uzunlik manfiy bo'lmaydi.", 'Длина не бывает отрицательной.', 'A length is never negative.') },
      ],
    },
    {
      id: 'b3', tag: 'scale_sign', ask: true, cols: 4,
      done: '(−8; 16; 4)',
      prompt: L('2b, agar b (−4; 8; 2)', '2b, если b (−4; 8; 2)', '2b, if b (−4; 8; 2)'),
      items: [
        { id: 'a', label: '(−8; 16; 4)', correct: true },
        { id: 'b', label: '(−2; 4; 1)', hint: L("Bu ikkiga bo'lish.", 'Это деление на два.', 'That is division by two.') },
        { id: 'c', label: '(8; −16; −4)', hint: L("Ishoralar aylandi, lekin ikki musbat son.", 'Знаки развернулись, а двойка положительная.', 'The signs flipped, yet two is positive.') },
        { id: 'd', label: '(−4; 16; 4)', hint: L("Birinchi koordinata ko'paytirilmagan.", 'Первая координата не умножена.', 'The first coordinate was not multiplied.') },
      ],
    },
    {
      id: 'b4', tag: 'sum_rule', ask: true, cols: 4,
      done: 'CF',
      prompt: 'CD + DE + EF',
      items: [
        { id: 'a', label: 'CF', correct: true },
        { id: 'b', label: 'CE', hint: L("Bu faqat ikkita qadam. Uchinchisi F ga olib boradi.", 'Это только два шага. Третий ведёт в F.', 'That is only two steps. The third leads to F.') },
        { id: 'c', label: 'DF', hint: L("Yo'l C dan boshlanadi.", 'Путь начинается в C.', 'The path starts at C.') },
        { id: 'd', label: L('nol vektor', 'нулевой вектор', 'the zero vector'), hint: L("Nol chiqishi uchun yo'l boshiga qaytishi kerak edi.", 'Для нуля путь должен был вернуться в начало.', 'For zero the path would have to return to the start.') },
      ],
    },
    {
      id: 'b5', tag: 'len_of_sum', ask: true, cols: 2,
      done: L("teng emas", 'не равна', 'not equal'),
      prompt: 'a (3; 0; 0), b (0; 4; 0). |a + b| = |a| + |b| ?',
      items: [
        { id: 'a', label: L("yo'q: 5 va 7", 'нет: 5 и 7', 'no: 5 and 7'), correct: true },
        { id: 'b', label: L('ha, teng', 'да, равны', 'yes, equal'), hint: L("Yig'indi uch, to'rt, nol, uzunligi besh. Uzunliklar yig'indisi esa yetti.", 'Сумма три, четыре, нуль, её длина пять. А сумма длин семь.', 'The sum is three, four, zero, its length five. The sum of lengths is seven.') },
      ],
    },
    {
      id: 'b6', tag: 'collinear_prop', ask: true, cols: 4,
      done: 'm = 2',
      prompt: L('a (m; 4; −3) va b (4; 8; −6) kollinear. m?', 'a (m; 4; −3) и b (4; 8; −6) коллинеарны. m?', 'a (m; 4; −3) and b (4; 8; −6) are collinear. m?'),
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '8', hint: L("Nisbat yarim: to'rt sakkizga, minus uch minus oltiga.", 'Отношение половина: четыре к восьми, минус три к минус шести.', 'The ratio is a half: four to eight, minus three to minus six.') },
        { id: 'c', label: '1', hint: L("Bunda nisbat chorak bo'lardi, qolganlari esa yarim.", 'Тогда отношение было бы четверть, а у остальных половина.', 'Then the ratio would be a quarter, while the others give a half.') },
        { id: 'd', label: '−2', hint: L("Ishora mos kelmaydi: to'rt va sakkiz ikkisi ham musbat.", 'Знак не сходится: четыре и восемь оба положительны.', 'The sign does not fit: four and eight are both positive.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', 'Uzunlik.', 'Длина.', 'A length.'),
    A('q3', "Songa ko'paytirish.", 'Умножение на число.', 'Scaling.'),
    A('q4', 'Zanjir.', 'Цепочка.', 'A chain.'),
    A('q5', "Uzunliklar yig'indisi.", 'Сумма длин.', 'The sum of lengths.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: ayirish TARTIBI.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'vector_order',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Uchlik chiqdi, yo\'nalish teskari', 'Тройка вышла, направление обратное', 'The triple came out, the direction reversed'),
  rows: [
    { id: 'r1', text: L('A (3; 1; 2),  B (5; 4; 6).  AB kerak', 'A (3; 1; 2),  B (5; 4; 6).  Нужен AB', 'A (3; 1; 2),  B (5; 4; 6).  AB is needed') },
    { id: 'r2', text: 'AB = (3 − 5;  1 − 4;  2 − 6)' },
    { id: 'r3', text: 'AB = (−2; −3; −4)' },
    { id: 'r4', text: '|AB| = √29' },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r3: L("Bu satr oldingisidan to'g'ri chiqadi. Xato yuqorida.", 'Эта строка верно следует из предыдущей. Ошибка выше.', 'This line follows correctly. The error is above.'),
    r4: L("Uzunlik to'g'ri sanalgan, va u ikki uchlikda ham bir xil.", 'Длина посчитана верно, и она одна и та же у обеих троек.', 'The length is computed right, and it is the same for both triples.'),
  },
  proofPoint: L('boshi bilan oxiri almashtirilgan', 'начало и конец переставлены', 'the start and the end are swapped'),
  proof: L(
    "Ayirish TARTIBI buzilgan: boshidan oxiri ayirilgan. To'g'risi besh minus uch, to'rt minus bir, olti minus ikki, ya'ni ikki, uch, to'rt. Uzunlik esa ikkalasida bir xil, shuning uchun uzunlik xatoni ko'rsatmaydi.",
    'Нарушен ПОРЯДОК вычитания: из первой точки вычли вторую. Верно пять минус три, четыре минус один, шесть минус два, то есть два, три, четыре. А длина у обеих троек одна, поэтому длина ошибку не покажет.',
    'The ORDER of subtraction is broken: the end was taken from the start. Correctly five minus three, four minus one, six minus two, that is two, three, four. The length is the same for both triples, so the length will not reveal the error.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('ayirish tartibi', 'порядок вычитания', 'the order of subtraction'), correct: true },
      { id: 'b', label: L('arifmetikada xato', 'ошибка в арифметике', 'an arithmetic slip'), hint: L("Arifmetika to'g'ri: uch minus besh minus ikki. Xato tartibda.", 'Арифметика верна: три минус пять минус два. Ошибка в порядке.', 'The arithmetic is right: three minus five is minus two. The order is the error.') },
      { id: 'c', label: L('uzunlik xato', 'длина неверна', 'the length is wrong'), hint: L("Uzunlik to'g'ri: to'rt plyus to'qqiz plyus o'n olti yigirma to'qqiz.", 'Длина верна: четыре плюс девять плюс шестнадцать двадцать девять.', 'The length is right: four plus nine plus sixteen is twenty nine.') },
      { id: 'd', label: L("nuqtalar almashtirilgan", 'точки перепутаны', 'the points are swapped'), hint: L("Shartda A birinchi, B ikkinchi, va bu to'g'ri yozilgan.", 'В условии A первая, B вторая, и записано это верно.', 'In the problem A is first, B second, and that is written right.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Diqqat: uzunlik bu yerda to'g'ri chiqqan, va aynan shu qiyin qiladi. Xatoni toping.", 'Внимание: длина здесь вышла верной, и это как раз усложняет дело. Найди ошибку.', 'Careful: the length came out right here, and that is what makes it hard. Find the error.'),
    A('proof', "Qarang: ikkinchi satrda boshidan oxiri ayirilgan. To'g'risi oxiridan boshini ayirish, ya'ni besh minus uch, to'rt minus bir, olti minus ikki. Uzunlik esa ikkala uchlikda bir xil, shuning uchun uzunlik bilan tekshirib xatoni topib bo'lmaydi.", 'Смотри: во второй строке из первой точки вычли вторую. Правильно наоборот: из второй вычитают первую, то есть пять минус три, четыре минус один, шесть минус два. А длина у обеих троек одинакова, поэтому проверкой длины ошибку не найти.', 'Look: in the second line the end was taken from the start. Correctly the start is taken from the end, that is five minus three, four minus one, six minus two. The length is the same for both triples, so checking the length will not find the error.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'scale_sign',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Yozuvni yig\'ing', 'Собери запись', 'Build the record'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L('ishora va uzunlik', 'знак и длина', 'the sign and the length'),
  tasks: [
    {
      prompt: L('2a, agar a (1; −3; 2)', '2a, если a (1; −3; 2)', '2a, if a (1; −3; 2)'),
      template: ['( 2 ;  ', { slot: 0 }, ' ;  ', { slot: 1 }, ' )'],
      parts: ['−6', '6', '4', '−4'],
      answer: ['−6', '4'],
      doneLabel: '(2; −6; 4)',
      wrongs: [
        { key: '6|4', hint: L("Ikki musbat son: ishoralar saqlanadi.", 'Двойка положительна: знаки сохраняются.', 'Two is positive: the signs are kept.') },
        { key: '*', hint: L("Har bir koordinata ikkiga ko'paytiriladi, ishorasi bilan.", 'Каждая координата умножается на два, вместе со знаком.', 'Each coordinate is multiplied by two, sign included.') },
      ],
    },
    {
      prompt: L('a ga qarama-qarshi vektor, a (1; −3; 2)', 'вектор, обратный a, если a (1; −3; 2)', 'the vector opposite to a, if a (1; −3; 2)'),
      template: ['( −1 ;  ', { slot: 0 }, ' ;  ', { slot: 1 }, ' )'],
      parts: ['3', '−3', '−2', '2'],
      answer: ['3', '−2'],
      doneLabel: '(−1; 3; −2)',
      wrongs: [
        { key: '−3|2', hint: L("Qarama-qarshi vektorda HAMMA ishora almashadi.", 'У обратного вектора меняются ВСЕ знаки.', 'The opposite vector flips EVERY sign.') },
        { key: '*', hint: L("Minus bir marta hammasiga qo'llanadi: bu minus bir ga ko'paytirish.", 'Минус применяется ко всему сразу: это умножение на минус один.', 'The minus applies to all at once: it is multiplying by minus one.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari: natija bor, yozuv kerak.', 'Ошибка найдена. Последнее задание обратное: есть результат, нужна запись.', 'The error is found. The last task is reverse: the result is given, the record is needed.'),
    A('built1', "Endi ikkinchisi. Bu safar cho'zish emas, aylantirish.", 'Теперь второе. На этот раз не растяжение, а разворот.', 'Now the second. This time not a stretch but a flip.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'sum_rule',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: 'a + b = (a₁ + b₁; a₂ + b₂; a₃ + b₃)',
  ruleLines: [
    L('uchlik oxiridan boshini ayirib chiqadi', 'тройка получается из конца минус начало', 'the triple comes from the end minus the start'),
    L("amallar har bir o'q bo'ylab alohida boradi", 'действия идут по каждой оси отдельно', 'the operations go along each axis on its own'),
    L("uzunlik oxirida, Pifagor bilan; uzunliklar qo'shilmaydi", 'длина в конце, по Пифагору; длины не складываются', 'the length at the end, by Pythagoras; lengths do not add'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('arava ketadimi', 'поедет ли телега', 'will the cart go'),
      right: L('hech qayoqqa', 'никуда', 'nowhere'),
      map: {
        a: L('eng kuchli tomonga', 'к самой большой силе', 'to the largest force'),
        b: L('hech qayoqqa', 'никуда', 'nowhere'),
        both: L('ikkalasi', 'оба', 'both'),
        none: L('hech kim', 'никто', 'nobody'),
      },
    },
    {
      screen: 5,
      // Taxmin jadvalining ustuni tor: o'zbekcha 32 px kesilardi.
      expr: L("yig'indi", 'сумма длин', 'the sum'),
      right: L("yo'nalishlarga bog'liq", 'зависит от направлений', 'depends on the directions'),
      map: {
        a: L('ha, doim', 'да, всегда', 'yes, always'),
        b: L('doim kichik', 'всегда меньше', 'always smaller'),
        c: L('doim katta', 'всегда больше', 'always larger'),
        d: L("yo'nalishlarga bog'liq", 'зависит от направлений', 'depends on the directions'),
      },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: L('uch kuch → yig\'indisi nol → arava turadi', 'три силы → сумма нулевая → телега стоит', 'three forces → zero sum → the cart stands'),
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L("Qoida va chizma ekraniga qayting", 'Вернись к правилу и к экрану с чертежом', 'Go back to the rule and the drawing screen'),
  },
  probe: {
    question: L(
      "Nega uzunliklarni qo'shib bo'lmaydi?",
      'Почему длины нельзя складывать?',
      'Why can lengths not be added?',
    ),
    items: [
      { id: 'a', label: L("yo'nalish ham hisobga kiradi", 'направление тоже участвует', 'the direction takes part too'), correct: true },
      { id: 'b', label: L('sonlar noqulay', 'числа неудобные', 'the numbers are awkward'), hint: L("Sonlar oddiy edi: uch, to'rt va besh.", 'Числа были простые: три, четыре и пять.', 'The numbers were simple: three, four and five.') },
      { id: 'c', label: L('Pifagor ishlamaydi', 'Пифагор не работает', 'Pythagoras does not work'), hint: L("Pifagor aynan ishlaydi, va u besh beradi. Yetti esa boshqa hisob.", 'Пифагор как раз работает и даёт пять. А семь это другой счёт.', 'Pythagoras does work and gives five. Seven is a different count.') },
      { id: 'd', label: L("qo'shish mumkin", 'складывать можно', 'they can be added'), hint: L("Faqat bir tomonga qaragan vektorlarda mumkin, umumiy holda esa yo'q.", 'Только у векторов одного направления, а в общем случае нет.', 'Only for vectors of one direction, not in general.') },
    ],
  },
  sheetTitle: L('Vektorlar ustida amallar · shpargalka', 'Действия над векторами · шпаргалка', 'Vector operations · cheat sheet'),
  sheetSrc: L('11-sinf · 36-dars', '11 класс · урок 36', 'Grade 11 · lesson 36'),
  lifehack: L(
    "Uchlik bilan ishlang, uzunlikni esa oxirida sanang.",
    'Работай с тройкой, а длину считай в конце.',
    'Work with the triple, and compute the length at the end.',
  ),
  holds: [3000, 6000, 7000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Arava joyidan qo'zg'almaydi, chunki uch kuchning yig'indisi nolga teng. Uzunliklar esa faqat bir tomonga qaragan vektorlarda qo'shiladi.", 'Вот твои прогнозы и вот как оказалось. Телега не двинется, потому что сумма трёх сил равна нулю. А длины складываются только у векторов одного направления.', 'Here are your guesses and here is how it turned out. The cart will not move, because the sum of the three forces is zero. And lengths add only for vectors of one direction.'),
    A('rule', "Va mana darsning umumiy fikri. Vektor uchta son, va bu sonlar bilan ishlash har bir o'q bo'ylab alohida boradi. Qo'shish alohida, songa ko'paytirish alohida. Uzunlik esa oxirida sanaladi, Pifagor bilan, va uni qo'shib bo'lmaydi. Keyingi darsda ikki vektorning burchagi keladi.", 'И вот общая мысль урока. Вектор это три числа, и работа с ними идёт по каждой оси отдельно. Сложение отдельно, умножение на число отдельно. А длина считается в конце, по Пифагору, и складывать её нельзя. На следующем уроке придёт угол между двумя векторами.', 'And here is the shared thought of the lesson. A vector is three numbers, and work with them goes along each axis separately. Addition separately, scaling separately. The length is computed at the end, by Pythagoras, and it cannot be added. Next lesson brings the angle between two vectors.'),
    A('q', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
