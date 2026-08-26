// ============================================================================
// 11-sinf, Dars 38. TEKISLIK TENGLAMASI.
//
// B5 blokining to'rtinchi darsi.
//   kontrakt: src/books/grade11/ETALON_11SINF.md
//   asbob:    `SpaceFrame`, `plane` rejimi
//
// MANBA YO'Q. 11-sinf darsligida bu tema yo'q -- na birinchi qismda (I bob
// to'rt bo'limdan iborat: koordinatalar 113, vektorlar 122, almashtirishlar
// 133, takrorlash 142), na ikkinchi qismda (matn qatlami bo'yicha qidiruv
// nol natija berdi). Metodist qarori 2026-08-20: MANBASIZ yozamiz.
//
// Shuning uchun butun matematika 37-darsdan CHIQARILADI: `a · b = 0` bo'lsa
// vektorlar perpendikular. Nuqta tekislikda yotadi degani -- normal bilan
// ko'paytma nol. Boshqa hech narsa kerak emas.
//
// ATAMALAR: `tekislik tenglamasi` va `normal vektor` -- DRAFT, darslikda
// yo'q, o'zbek metodistining tasdig'i kerak.
//
// SONLAR TEKSHIRILDI:
//   x + 2y + 2z = 6:  (6;0;0), (0;3;0), (0;0;3), (2;1;1) yotadi; (1;1;1) yo'q
//   ikki tenglama bitta tekislik: x+2y+2z=6 va 2x+4y+4z=12
//   M(1;2;3), n(2;-1;3):  d = -(2-2+9) = -9  ->  2x - y + 3z - 9 = 0
//   (4;0;0) dan 2x+y-2z=5 ga parallel:  d = -8  ->  2x + y - 2z - 8 = 0
//   blits: normal (3;-1;5); (1;1;2) yotadi; Oxy bu z=0; d = -6
//   13-slayd: d ning ISHORASI almashtirilmagan, tekshiruv 18 beradi, 0 emas
//
// VEKTOR KO'PAYTMA YO'Q: tekislikni uch nuqta bo'yicha yozish uchun u kerak
// bo'lardi, programmada esa yo'q. Shuning uchun 11-slaydda «berilgan
// tekislikka PARALLEL» turadi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_38',
  title: L('Tekislik tenglamasi', 'Уравнение плоскости', 'The equation of a plane'),
}

const BLOCK = { label: 'B5', from: 35, to: 41, current: 38 }

// ============================================================
// SLAYD 1. XUK. Ikki tenglama, bitta tekislik.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Tekislik tenglamasi', 'Уравнение плоскости', 'The equation of a plane'),
  title: L('Ikki tenglama, bitta tekislikmi', 'Два уравнения, одна плоскость?', 'Two equations, one plane?'),
  expr: L('ikki yozuv', 'две записи', 'two records'),
  rows: [
    { id: 'a', name: L('Aziz', 'Азиз', 'Aziz'), value: 'x + 2y + 2z = 6' },
    { id: 'b', name: L('Dilnoza', 'Дилноза', 'Dilnoza'), value: '2x + 4y + 4z = 12' },
  ],
  probe: {
    question: L(
      'Bu bitta tekislikmi yoki ikkitami?',
      'Это одна плоскость или две?',
      'Is this one plane or two?',
    ),
    afterPredict: L(
      'Javobingiz yozib olindi. Endi tekshiramiz.',
      'Твой ответ записан. Сейчас проверим.',
      'Your answer is saved. Now we will check.',
    ),
    items: [
      { id: 'a', label: L('bitta', 'одна', 'one') },
      { id: 'b', label: L('ikkita', 'две', 'two') },
      { id: 'c', label: L('ikkitasi parallel', 'две параллельные', 'two parallel ones') },
      { id: 'd', label: L("aniqlanmaydi", 'не определить', 'cannot tell') },
    ],
  },
  holds: [4500, 4000, 4000],
  audio: [
    A('mount', "O'tgan darsda skalyar ko'paytma nolga aylanganda vektorlar perpendikular bo'lishini ko'rdik. Bugun shu nol tekislikni beradi.", 'На прошлом уроке мы увидели, что при нулевом скалярном произведении векторы перпендикулярны. Сегодня этот нуль даст плоскость.', 'Last lesson we saw that a zero dot product means perpendicular vectors. Today that zero will give a plane.'),
    A('r1', "Aziz tekislikni bir tenglama bilan yozdi.", 'Азиз записывает плоскость одним уравнением.', 'Aziz wrote a plane with one equation.'),
    A('r2', "Dilnoza esa boshqa tenglama yozdi: har bir koeffitsiyent ikki barobar katta.", 'А Дилноза записывает другое уравнение: каждый коэффициент вдвое больше.', 'Dilnoza wrote another equation: every coefficient is twice as large.'),
    A('ask', "Sizningcha bu bitta tekislikmi. Hozircha shunchaki taxmin qiling.", 'Как думаешь, это одна плоскость. Пока просто предположи.', 'Do you think this is one plane. Just make a guess for now.'),
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
      title: L('Nol ko\'paytma', 'Нулевое произведение', 'A zero product'),
      short: L('37-darsdan', 'из урока 37', 'from lesson 37'),
      ex: [{ e: 'a · b = 0', why: L('perpendikular', 'перпендикулярны', 'perpendicular') }],
    },
    {
      id: 'c2',
      title: L('Vektor koordinatalari', 'Координаты вектора', 'Vector coordinates'),
      short: L('36-darsdan', 'из урока 36', 'from lesson 36'),
      ex: [{ e: L('oxiri − boshi', 'конец − начало', 'the end − the start'), why: L('har bir o\'q bo\'ylab', 'по каждой оси', 'along each axis') }],
    },
    {
      id: 'c3',
      title: L('Nuqtani qo\'yish', 'Подстановка точки', 'Substituting a point'),
      short: L('35-darsdan', 'из урока 35', 'from lesson 35'),
      ex: [{ e: L('yozuvga qo\'yish', 'подставить в запись', 'put it in the record'), why: L('tekshiruv', 'проверка', 'a check') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true, cols: 4,
      prompt: '(2; −1; 2) · (1; 2; 0)',
      items: [
        { id: 'a', label: '0', correct: true },
        { id: 'b', label: '4', hint: L("Ikkinchi ko'paytma manfiy: minus bir karra ikki.", 'Второе произведение отрицательное: минус один на два.', 'The second product is negative: minus one times two.') },
        { id: 'c', label: '2', hint: L("Uchinchi ko'paytma nol, lekin ikkinchisi minus ikki.", 'Третье произведение нуль, а второе минус два.', 'The third product is zero, and the second is minus two.') },
        { id: 'd', label: '−4', hint: L("Birinchi ko'paytma musbat: ikki karra bir.", 'Первое произведение положительное: два на один.', 'The first product is positive: two times one.') },
      ],
    },
    {
      id: 't2', ask: true, cols: 4,
      prompt: L('AB, agar A (1; 1; 1), B (3; 2; 1)', 'AB, если A (1; 1; 1), B (3; 2; 1)', 'AB, if A (1; 1; 1), B (3; 2; 1)'),
      items: [
        { id: 'a', label: '(2; 1; 0)', correct: true },
        { id: 'b', label: '(4; 3; 2)', hint: L("Bu yig'indi, vektorda esa ayirma.", 'Это сумма, а в векторе разность.', 'That is the sum, a vector takes the difference.') },
        { id: 'c', label: '(−2; −1; 0)', hint: L("Bu BA: boshi bilan oxiri almashtirilgan.", 'Это BA: начало и конец переставлены.', 'That is BA: the start and the end are swapped.') },
        { id: 'd', label: '(3; 2; 1)', hint: L("Bu B nuqtaning o'zi.", 'Это сама точка B.', 'That is the point B itself.') },
      ],
    },
    {
      id: 't3', ask: true, cols: 2,
      prompt: L('(1; 2; 3) nuqta z = 3 tekisligida yotadimi?', 'Лежит ли точка (1; 2; 3) в плоскости z = 3?', 'Does the point (1; 2; 3) lie in the plane z = 3?'),
      items: [
        { id: 'a', label: L('ha', 'да', 'yes'), correct: true },
        { id: 'b', label: L("yo'q", 'нет', 'no'), hint: L("Shart faqat applikataga tegishli, va u aynan uch.", 'Условие касается только аппликаты, и она равна трём.', 'The condition concerns only the applicate, and it is three.') },
      ],
    },
  ],
  holds: [3000, 4500, 4000, 4000, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch o'tgan darsdan: ko'paytma nol bo'lsa, vektorlar perpendikular. Bugun butun dars shu ustiga quriladi.", 'Первая опора с прошлого урока: если произведение нуль, векторы перпендикулярны. На этом и построен весь сегодняшний урок.', 'The first basic from last lesson: a zero product means perpendicular vectors. The whole lesson is built on it.'),
    A('c2', "Ikkinchi tayanch: vektor koordinatalari oxiridan boshini ayirib chiqadi.", 'Вторая опора: координаты вектора получаются из конца минус начало.', 'The second basic: vector coordinates come from the end minus the start.'),
    A('c3', "Uchinchi tayanch: nuqtani yozuvga qo'yib tekshirish mumkin.", 'Третья опора: точку можно проверить подстановкой в запись.', 'The third basic: a point can be checked by substituting it into the record.'),
    A('recap', 'Uchtasi birga bugungi javobni beradi.', 'Три вместе и дают сегодняшний ответ.', 'The three together give today\'s answer.'),
    A('tasks', 'Endi uchta qisqa topshiriq.', 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. MEZON: nuqta tekislikda yotadimi.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'check_by_point',
  eyebrow: L('Nuqtani qo\'yamiz', 'Подставляем точку', 'Substituting a point'),
  title: L('Qaysi nuqta tekislikda yotadi', 'Какая точка лежит в плоскости', 'Which point lies in the plane'),
  expr: 'x + 2y + 2z = 6',
  goal: L('mezonni topish', 'найти признак', 'find the criterion'),
  rule: L(
    "Tekislikda yotgan nuqtalarni izlaymiz. Har birini yozuvga qo'yamiz.",
    'Ищем точки, которые лежат в плоскости. Каждую подставляем в запись.',
    'We look for the points lying in the plane. We substitute each of them.',
  ),
  pick: L('Qaysi nuqtani qo\'yamiz?', 'Какую точку подставим?', 'Which point shall we substitute?'),
  claims: [
    { id: 'a', key: 'inA', name: L('koordinatalari musbat', 'координаты положительны', 'the coordinates are positive'), value: '> 0' },
    { id: 'b', key: 'inB', name: L("qo'yganda 6 chiqadi", 'подстановка даёт 6', 'the substitution gives 6'), value: '= 6' },
  ],
  points: [
    {
      id: 'q1', label: '(6; 0; 0)', num: '(6; 0; 0)', step: 'calc', verdict: 'in',
      calc: '6 + 0 + 0 = 6',
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q2', label: '(2; 1; 1)', num: '(2; 1; 1)', step: 'calc', verdict: 'in',
      calc: '2 + 2 + 2 = 6',
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q3', label: '(1; 1; 1)', num: '(1; 1; 1)', step: 'calc', verdict: 'out',
      calc: '1 + 2 + 2 = 5',
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q4', label: '(0; 3; 0)', num: '(0; 3; 0)', step: 'calc', verdict: 'in',
      calc: '0 + 6 + 0 = 6',
      sol: true, inA: false, inB: true,
    },
  ],
  probe: {
    question: L(
      'Nuqta tekislikda yotishini nima aytadi?',
      'Что говорит, что точка лежит в плоскости?',
      'What tells that a point lies in the plane?',
    ),
    items: [
      { id: 'b', label: L("qo'yganda tenglik bajarilishi", 'подстановка даёт равенство', 'the substitution gives equality'), correct: true },
      { id: 'a', label: L('koordinatalarning musbatligi', 'положительность координат', 'the coordinates being positive'), hint: L("Uchinchi nuqtaning hamma koordinatasi musbat, lekin u yotmaydi: besh chiqdi.", 'У третьей точки все координаты положительны, но она не лежит: вышло пять.', 'The third point has all positive coordinates, yet it does not lie there: five came out.') },
      { id: 'c', label: L('nollarning soni', 'число нулей', 'the count of zeros'), hint: L("Birinchi va to'rtinchi nuqtada ikkita nol, ikkinchisida esa nol yo'q, uchtasi ham yotadi.", 'В первой и четвёртой по два нуля, во второй нулей нет, и все три лежат.', 'The first and fourth have two zeros, the second none, and all three lie there.') },
      { id: 'd', label: L('koordinatalar yig\'indisi', 'сумма координат', 'the sum of the coordinates'), hint: L("Yig'indi emas: ikkinchi va uchinchi koordinata IKKIGA ko'paytiriladi.", 'Не сумма: вторая и третья координаты умножаются на ДВА.', 'Not the sum: the second and third coordinates are multiplied by TWO.') },
    ],
  },
  holds: [3000, 4500, 2500, 2600, 9000],
  audio: [
    A('mount', 'Taxmin bor. Endi mezonni topamiz.', 'Прогноз есть. Теперь найдём признак.', 'The guess is made. Now let us find the criterion.'),
    A('mount', "Ikki da'vo bor. Biri koordinatalar musbat bo'lsa yotadi deydi, ikkinchisi qo'yganda oltita chiqsa deydi.", 'Есть два утверждения. Одно говорит, что лежит при положительных координатах, а другое, что подстановка даёт шесть.', 'There are two claims. One says positive coordinates mean it lies there, the other says the substitution must give six.'),
    A('mount', "To'rtta nuqtani birma bir qo'yamiz.", 'Подставим четыре точки по одной.', 'Let us substitute four points one by one.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Mana natija. Birinchi, ikkinchi va to'rtinchi nuqtalar oltita berdi, ya'ni yotadi. Uchinchisi besh berdi va yotmaydi, garchi uning hamma koordinatasi musbat. Demak birinchi da'vo yiqildi: musbatlik hech narsani aytmaydi, tenglik aytadi.", 'Вот результат. Первая, вторая и четвёртая точки дали шесть, значит лежат. Третья дала пять и не лежит, хотя все её координаты положительны. Значит первое утверждение упало: положительность ничего не говорит, говорит равенство.', 'Here is the result. The first, second and fourth points gave six, so they lie there. The third gave five and does not, though all its coordinates are positive. The first claim fell: positivity tells nothing, the equality tells.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: NUQTA, NORMAL, TEKISLIK.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'plane_normal',
  drag: false,
  graphSteps: 2,
  eyebrow: L('Chizma', 'Чертёж', 'The drawing'),
  title: L('Nuqta va normal tekislikni beradi', 'Точка и нормаль задают плоскость', 'A point and a normal give a plane'),
  chip: 'n (1; 2; 2),  M (2; 1; 1)',
  space: {
    mode: 'plane',
    box: [[0, 7], [0, 4], [0, 4]],
    height: 200,
    interactive: true,
    points: [
      { at: [2, 1, 1], label: 'M', tone: 'accent', coords: true },
    ],
    planes: [
      { n: [1, 2, 2], d: -6, label: 'α', at: [2, 1, 1], showAt: 1 },
    ],
    caption: L('karkasni barmoq bilan burish mumkin', 'каркас можно повернуть пальцем', 'you can turn the frame with a finger'),
  },
  bonus: L(
    "Tekislikda yotgan HAR QANDAY vektor normalga perpendikular. Aynan shu narsa tenglamani beradi: ko'paytma nolga teng.",
    'ЛЮБОЙ вектор, лежащий в плоскости, перпендикулярен нормали. Именно это и даёт уравнение: произведение равно нулю.',
    'EVERY vector lying in the plane is perpendicular to the normal. That is exactly what gives the equation: the product is zero.',
  ),
  probe: {
    question: L(
      "x + 2y + 2z = 6 tekisligiga qaysi vektor perpendikular?",
      'Какой вектор перпендикулярен плоскости x + 2y + 2z = 6?',
      'Which vector is perpendicular to the plane x + 2y + 2z = 6?',
    ),
    items: [
      { id: 'a', label: '(1; 2; 2)', correct: true },
      { id: 'b', label: '(6; 0; 0)', hint: L("Bu tekislikning NUQTASI, yo'nalish emas.", 'Это ТОЧКА плоскости, а не направление.', 'That is a POINT of the plane, not a direction.') },
      { id: 'c', label: '(1; 1; 1)', hint: L("Koeffitsiyentlar teng emas: ikkinchisi va uchinchisi ikkiga teng.", 'Коэффициенты не равны: второй и третий равны двум.', 'The coefficients are not equal: the second and third are two.') },
      { id: 'd', label: '(6; 3; 3)', hint: L("Bu o'qlar bilan kesishish nuqtalari, ular yo'nalish bermaydi.", 'Это точки пересечения с осями, они не дают направление.', 'Those are the axis intercepts, they give no direction.') },
    ],
  },
  holds: [4000, 6500],
  audio: [
    A('mount', "Mezon topildi. Endi chizmaga qaraymiz. Karkasda bitta nuqta turadi va undan strelka chiqadi. Bu strelka NORMAL deb ataladi.", 'Признак найден. Теперь посмотрим на чертёж. В каркасе стоит одна точка, и из неё выходит стрелка. Эту стрелку называют НОРМАЛЬЮ.', 'The criterion is found. Now let us look at the drawing. One point stands in the frame with an arrow leaving it. That arrow is called the NORMAL.'),
    A('one', "Va mana tekislik. U nuqtadan o'tadi va strelkaga perpendikular. Ikkita narsa yetdi: bitta nuqta va bitta yo'nalish. Uchta nuqta shart emas.", 'И вот плоскость. Она проходит через точку и перпендикулярна стрелке. Хватило двух вещей: одной точки и одного направления. Три точки не обязательны.', 'And here is the plane. It passes through the point and is perpendicular to the arrow. Two things were enough: one point and one direction. Three points are not required.'),
    A('two', "Diqqat qiling: tekislikda yotgan har qanday vektor shu strelkaga perpendikular. Ko'paytmasi esa nol. Keyingi ekranda aynan shundan tenglama chiqadi.", 'Обрати внимание: любой вектор, лежащий в плоскости, перпендикулярен этой стрелке. А произведение при этом нуль. На следующем экране именно из этого и выйдет уравнение.', 'Note this: every vector lying in the plane is perpendicular to that arrow. And the product is zero. On the next screen the equation comes out of exactly this.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1. Tenglama qanday chiqadi.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'plane_normal',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Noldan tenglamaga', 'От нуля к уравнению', 'From zero to an equation'),
  rows: [
    'n · MM₀ = 0',
    'a(x − x₀) + b(y − y₀) + c(z − z₀) = 0',
    'ax + by + cz + d = 0',
  ],
  probe: {
    question: L(
      'Tenglamadagi koeffitsiyentlar nima?',
      'Что такое коэффициенты в уравнении?',
      'What are the coefficients in the equation?',
    ),
    items: [
      { id: 'a', label: L('normal koordinatalari', 'координаты нормали', 'the normal coordinates'), correct: true },
      { id: 'b', label: L('nuqta koordinatalari', 'координаты точки', 'the point coordinates'), hint: L("Nuqta ozod hadga kiradi, koeffitsiyentlarga esa normal.", 'Точка входит в свободный член, а в коэффициенты нормаль.', 'The point enters the free term, the normal enters the coefficients.') },
      { id: 'c', label: L("o'qlar bilan kesishish", 'пересечения с осями', 'the axis intercepts'), hint: L("Kesishishlarni tenglamadan keyin topish mumkin, lekin ular koeffitsiyent emas.", 'Пересечения можно найти из уравнения, но они не коэффициенты.', 'The intercepts follow from the equation, but they are not the coefficients.') },
      { id: 'd', label: L('ixtiyoriy sonlar', 'произвольные числа', 'arbitrary numbers'), hint: L("Ixtiyoriy emas: ular tekislikning yo'nalishini belgilaydi.", 'Не произвольные: они задают направление плоскости.', 'Not arbitrary: they set the direction of the plane.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Tenglama', 'Правило 1. Уравнение', 'Rule 1. The equation'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'ax + by + cz + d = 0',
    lines: [
      L('koeffitsiyentlar -- normalning koordinatalari', 'коэффициенты это координаты нормали', 'the coefficients are the normal coordinates'),
      L('d nuqtani qo\'yib topiladi', 'd находится подстановкой точки', 'd comes from substituting the point'),
      L("nuqta tekislikda yotsa, tenglama bajariladi", 'если точка лежит, уравнение выполняется', 'if the point lies there, the equation holds'),
      L('uchta nuqta shart emas: nuqta va yo\'nalish yetadi', 'три точки не нужны: хватит точки и направления', 'three points are not needed: a point and a direction suffice'),
    ],
    example: L('misol:  n (1; 2; 2), M (2; 1; 1)  →  x + 2y + 2z − 6 = 0', 'пример:  n (1; 2; 2), M (2; 1; 1)  →  x + 2y + 2z − 6 = 0', 'example:  n (1; 2; 2), M (2; 1; 1)  →  x + 2y + 2z − 6 = 0'),
  },
  holds: [4000, 8000, 4500],
  audio: [
    A('mount', 'Chizma ko\'rildi. Endi tenglamani chiqaramiz.', 'Чертёж увидели. Теперь выведем уравнение.', 'We saw the drawing. Now let us derive the equation.'),
    A('def', "M nuqta tekislikda yotsin. Unda M nol M vektori tekislikda yotadi, ya'ni normalga perpendikular. Demak ularning skalyar ko'paytmasi nolga teng. Qavslarni ochsak, ikslar, igreklar va zetlar oldida normalning koordinatalari turadi, qolgani esa bitta songa yig'iladi. Shu son ozod had deb ataladi.", 'Пусть точка M лежит в плоскости. Тогда вектор M нулевое M лежит в плоскости, то есть перпендикулярен нормали. Значит их скалярное произведение равно нулю. Раскроем скобки: перед иксом, игреком и зетом стоят координаты нормали, а остальное собирается в одно число. Это число называют свободным членом.', 'Let the point M lie in the plane. Then the vector M zero M lies in the plane, so it is perpendicular to the normal. Their dot product is therefore zero. Expanding the brackets, the coordinates of the normal stand before x, y and z, and the rest collects into one number. That number is called the free term.'),
    A('rule', "To'g'ri. Koeffitsiyentlarga qarab normalni darrov o'qish mumkin, va aksincha.", 'Верно. По коэффициентам нормаль читается сразу, и наоборот.', 'Correct. The normal reads off the coefficients at once, and back.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: tenglama ikkiga ko'paytirildi.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'plane_normal',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Tenglama ikkiga ko\'paytirildi', 'Уравнение умножили на два', 'The equation was doubled'),
  was: { label: UI.was, expr: 'x + 2y + 2z − 6 = 0' },
  now: { label: UI.now, expr: '2x + 4y + 4z − 12 = 0' },
  probe1: {
    cols: 2,
    question: L('Ikkinchi tenglamaning normali qanday?', 'Какова нормаль второго уравнения?', 'What is the normal of the second equation?'),
    items: [
      { id: 'a', label: '(2; 4; 4)', correct: true },
      { id: 'b', label: '(1; 2; 2)', hint: L("Koeffitsiyentlar ikki barobar katta, ya'ni normal ham ikki barobar uzun.", 'Коэффициенты вдвое больше, значит и нормаль вдвое длиннее.', 'The coefficients are twice as large, so the normal is twice as long.') },
    ],
  },
  probe2: {
    // Ikki ustun: uzun variant to'rt ustunda 36 px kesilardi.
    cols: 2,
    question: L(
      'Tekislikning o\'zi o\'zgardimi?',
      'Изменилась ли сама плоскость?',
      'Did the plane itself change?',
    ),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: L("yo'q, o'sha", 'нет, та же', 'no, the same') },
      { id: 'b', label: L('ha, parallel siljidi', 'да, сдвинулась параллельно', 'yes, it shifted') },
      { id: 'c', label: L('ha, burildi', 'да, повернулась', 'yes, it turned') },
      { id: 'd', label: L("aniqlanmaydi", 'не определить', 'cannot tell') },
    ],
  },
  holds: [4000, 5000, 3000],
  audio: [
    A('mount', "Tenglama yozildi. Endi uni ikkiga ko'paytiramiz.", 'Уравнение записали. Теперь умножим его на два.', 'The equation is written. Now let us double it.'),
    A('now', "Har bir koeffitsiyent va ozod had ikki barobar katta bo'ldi. Normal ikki barobar uzun, chunki koeffitsiyentlar aynan normal.", 'Каждый коэффициент и свободный член стали вдвое больше. Нормаль вдвое длиннее, потому что коэффициенты и есть нормаль.', 'Every coefficient and the free term became twice as large. The normal is twice as long, because the coefficients are the normal.'),
    A('q1', 'Ikkinchi tenglamaning normali qanday?', 'Какова нормаль второго уравнения?', 'What is the normal of the second equation?'),
    A('q2', "Endi taxmin qiling: tekislikning o'zi o'zgardimi.", 'Теперь предположи: изменилась ли сама плоскость.', 'Now make a guess: did the plane itself change.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD: bitta nuqta, ikki tenglama.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'plane_normal',
  eyebrow: L('Ikkalasini tekshiramiz', 'Проверим оба', 'Let us check both'),
  title: L('Bitta nuqta, ikki tenglama', 'Одна точка, два уравнения', 'One point, two equations'),
  expr: L('nuqta (2; 1; 1)', 'точка (2; 1; 1)', 'the point (2; 1; 1)'),
  need: L('tenglik bajarilsin', 'равенство должно выполняться', 'the equality must hold'),
  answerLabel: L('eng kichik butun normal', 'наименьшая целая нормаль', 'the smallest integer normal'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      txt: 'x + 2y + 2z = 6',
      point: { label: L('qo\'ydik', 'подставили', 'substituted'), calc: '6 = 6', verdict: 'in' },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: '2x + 4y + 4z = 12',
      point: { label: L('qo\'ydik', 'подставили', 'substituted'), calc: '12 = 12', verdict: 'in' },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['(1; 2; 2)', '(2; 4; 4)', '(6; 3; 3)', '(1; 1; 1)'],
    value: ['(1; 2; 2)'],
    label: 'n =',
    prompt: L('Normalni eng kichik butun sonlarda yozing', 'Запиши нормаль в наименьших целых', 'Write the normal in smallest integers'),
    wrongs: [
      { key: '(2; 4; 4)', hint: L("Bu ham normal, lekin ikki barobar uzun. Eng kichigi so'raldi.", 'Это тоже нормаль, но вдвое длиннее. Спрашивают наименьшую.', 'That is a normal too, but twice as long. The smallest was asked.') },
      { key: '(6; 3; 3)', hint: L("Bu o'qlar bilan kesishish nuqtalari, normal emas.", 'Это точки пересечения с осями, а не нормаль.', 'Those are the axis intercepts, not the normal.') },
      { key: '(1; 1; 1)', hint: L("Koeffitsiyentlar teng emas: bir, ikki, ikki.", 'Коэффициенты не равны: один, два, два.', 'The coefficients are not equal: one, two, two.') },
      { key: '*', hint: L("Ikkinchi tenglamani ikkiga bo'lsak, birinchisi chiqadi.", 'Если поделить второе уравнение на два, выйдет первое.', 'Dividing the second equation by two gives the first.') },
    ],
  },
  holds: [4000, 4500, 6000],
  audio: [
    A('mount', "Taxmin bor. Endi nuqtani ikkala tenglamaga ham qo'yamiz.", 'Прогноз есть. Теперь подставим точку в оба уравнения.', 'The guess is made. Now let us substitute the point into both equations.'),
    A('p1', "Birinchisiga qo'ysak, olti teng olti chiqadi. Nuqta yotadi.", 'В первое подставили, вышло шесть равно шести. Точка лежит.', 'Substituted into the first, six equals six. The point lies there.'),
    A('p2', "Ikkinchisiga qo'ysak, o'n ikki teng o'n ikki. Nuqta ham yotadi. Demak ikkala tenglama ham bitta tekislikni beradi, chunki ular bir biridan faqat ko'paytuvchi bilan farq qiladi. Endi normalni eng kichik butun sonlarda yozing.", 'Во второе подставили, двенадцать равно двенадцати. Точка тоже лежит. Значит оба уравнения задают одну плоскость, потому что отличаются лишь множителем. Теперь запиши нормаль в наименьших целых.', 'Substituted into the second, twelve equals twelve. The point lies there too. So both equations give one plane, because they differ only by a factor. Now write the normal in smallest integers.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2. Ozod had va maxsus holatlar.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'plane_free_term',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Ozod had va maxsus holatlar', 'Свободный член и особые случаи', 'The free term and the special cases'),
  cases: [
    {
      label: L('koeffitsiyentlar', 'коэффициенты', 'the coefficients'),
      text: L('normalni beradi', 'дают нормаль', 'give the normal'),
      tone: 'graph',
    },
    {
      label: L('ozod had', 'свободный член', 'the free term'),
      text: L('joyni beradi', 'даёт место', 'gives the position'),
      tone: 'accent',
    },
  ],
  rows: [
    L('d = 0  →  koordinata boshidan o\'tadi', 'd = 0  →  проходит через начало', 'd = 0  →  passes through the origin'),
    L('z = 0  →  Oxy tekisligi', 'z = 0  →  плоскость Oxy', 'z = 0  →  the plane Oxy'),
  ],
  probe: {
    question: L(
      'y = 4 tenglamasi qanday tekislikni beradi?',
      'Какую плоскость задаёт уравнение y = 4?',
      'What plane does the equation y = 4 give?',
    ),
    items: [
      { id: 'a', label: L('Oxz ga parallel', 'параллельную Oxz', 'parallel to Oxz'), correct: true },
      { id: 'b', label: L('Oxy ga parallel', 'параллельную Oxy', 'parallel to Oxy'), hint: L("Oxy ga parallel tekislikda applikata qotirilgan bo'ladi, bu yerda esa ordinata.", 'У плоскости, параллельной Oxy, закреплена аппликата, а здесь ордината.', 'A plane parallel to Oxy fixes the applicate, here the ordinate is fixed.') },
      { id: 'c', label: L("Oy o'qi", 'ось Oy', 'the Oy axis'), hint: L("O'q emas, tekislik: iks va zet ixtiyoriy qoladi.", 'Не ось, а плоскость: икс и зет остаются любыми.', 'Not an axis but a plane: x and z stay arbitrary.') },
      { id: 'd', label: L('koordinata boshidan o\'tadi', 'проходит через начало', 'passes through the origin'), hint: L("Boshda ordinata nol, bu yerda esa to'rt.", 'В начале ордината нуль, а здесь четыре.', 'At the origin the ordinate is zero, here it is four.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Maxsus holatlar', 'Правило 2. Особые случаи', 'Rule 2. Special cases'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('koeffitsiyent nol  →  o\'qqa parallel', 'коэффициент нуль  →  параллельна оси', 'a zero coefficient  →  parallel to an axis'),
    lines: [
      L('tenglama ko\'paytuvchiga qadar aniqlanadi', 'уравнение определено с точностью до множителя', 'the equation is defined up to a factor'),
      L('d = 0 bo\'lsa koordinata boshidan o\'tadi', 'при d = 0 проходит через начало координат', 'with d = 0 it passes through the origin'),
      L('z = 0 bu Oxy, x = 0 bu Oyz', 'z = 0 это Oxy, x = 0 это Oyz', 'z = 0 is Oxy, x = 0 is Oyz'),
      L('parallel tekisliklarning normali bir xil', 'у параллельных плоскостей нормаль одна', 'parallel planes share the normal'),
    ],
    example: L('misol:  y − 4 = 0,  normal (0; 1; 0)', 'пример:  y − 4 = 0, нормаль (0; 1; 0)', 'example:  y − 4 = 0, the normal (0; 1; 0)'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('tekislik = nuqta + normal', 'плоскость = точка + нормаль', 'a plane = a point + a normal'),
    lines: [
      L('1. normalni koeffitsiyentlardan o\'qing', '1. нормаль читай из коэффициентов', '1. read the normal off the coefficients'),
      L('2. ozod hadni nuqtani qo\'yib toping', '2. свободный член найди подстановкой точки', '2. find the free term by substituting the point'),
      L('3. tekshirish ham qo\'yish bilan', '3. проверка тоже подстановкой', '3. the check is a substitution too'),
      L('4. ko\'paytuvchi tekislikni o\'zgartirmaydi', '4. множитель плоскость не меняет', '4. a factor does not change the plane'),
    ],
  },
  holds: [4000, 7000, 2600],
  audio: [
    A('mount', "Normal yozildi. Endi ozod hadga qaraymiz.", 'Нормаль записали. Теперь посмотрим на свободный член.', 'The normal is written. Now let us look at the free term.'),
    A('rows', "Ozod had tekislikning joyini beradi. Agar u nol bo'lsa, tekislik koordinata boshidan o'tadi. Agar koeffitsiyentlardan biri nol bo'lsa, tekislik mos o'qqa parallel bo'ladi. Masalan zet teng nol bu Oxy tekisligining o'zi, igrek teng to'rt esa Oxz ga parallel tekislik.", 'Свободный член даёт место плоскости. Если он нуль, плоскость проходит через начало координат. Если один из коэффициентов нуль, плоскость параллельна соответствующей оси. Например зет равно нулю это сама плоскость Oxy, а игрек равно четырём это плоскость, параллельная Oxz.', 'The free term gives the position of the plane. If it is zero, the plane passes through the origin. If one coefficient is zero, the plane is parallel to the matching axis. For instance z equals zero is the plane Oxy itself, and y equals four is a plane parallel to Oxz.'),
    A('rule', "To'g'ri.", 'Верно.', 'Correct.'),
    A('both', 'Endi butun darsni bitta qoidaga yig\'ing.', 'А теперь собери весь урок в одно правило.', 'Now combine the whole lesson into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. ISHORANI O'ZI QO'YADI: ozod hadning ishorasi.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'plane_free_term',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Ozod hadning ishorasi', 'Знак свободного члена', 'The sign of the free term'),
  left: 'M (2; 1; 1),  n (1; 2; 2)',
  template: ['x + 2y + 2z ', { slot: 0 }, ' 6 = 0'],
  signs: ['+', '−'],
  answer: '−',
  checkNote: L(
    "Nuqtani qo'yganda nol chiqishi kerak",
    'При подстановке точки должен выйти нуль',
    'Substituting the point must give zero',
  ),
  wrongs: [
    { key: '+', hint: L("Plyus bilan nuqtani qo'ysak o'n ikki chiqadi, nol emas.", 'С плюсом подстановка точки даёт двенадцать, а не нуль.', 'With a plus the substitution gives twelve, not zero.') },
  ],
  probe: {
    question: L("Bu tekislik koordinata boshidan o'tadimi?", 'Проходит ли эта плоскость через начало координат?', 'Does this plane pass through the origin?'),
    items: [
      { id: 'a', label: L("yo'q", 'нет', 'no'), correct: true },
      { id: 'b', label: L('ha', 'да', 'yes'), hint: L("Boshni qo'ysak minus olti chiqadi, nol emas.", 'Если подставить нуль, выйдет минус шесть, а не нуль.', 'Substituting the origin gives minus six, not zero.') },
      { id: 'c', label: L("normalga bog'liq", 'зависит от нормали', 'depends on the normal'), hint: L("Bunga ozod had javob beradi, normal emas.", 'На это отвечает свободный член, а не нормаль.', 'The free term answers that, not the normal.') },
      { id: 'd', label: L("aniqlanmaydi", 'не определить', 'cannot tell'), hint: L("Aniqlanadi: nolni qo'yib ko'rish yetadi.", 'Определяется: достаточно подставить нуль.', 'It can: substituting zero is enough.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Ozod hadning ishorasini qo'ying.", 'Поставь знак свободного члена.', 'Place the sign of the free term.'),
    A('checked', "Bo'ldi. Endi koordinata boshi haqida javob bering.", 'Готово. Теперь ответь про начало координат.', 'Done. Now answer about the origin.'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'coef', label: L('normalni koeffitsiyentga qo\'yish', 'поставить нормаль в коэффициенты', 'put the normal into the coefficients') },
  { id: 'put', label: L('nuqtani qo\'yish', 'подставить точку', 'substitute the point') },
  { id: 'd', label: L('ozod hadni topish', 'найти свободный член', 'find the free term') },
  { id: 'len', label: L('normal uzunligini topish', 'найти длину нормали', 'find the normal length') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'plane_free_term',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Tenglamani yozamiz', 'Записываем уравнение', 'Writing the equation'),
  start: 'M (1; 2; 3),  n (2; −1; 3)',
  actions: ACTIONS_10,
  steps: [
    {
      action: 'coef',
      to: '2x − y + 3z + d = 0',
      wrongs: [
        { action: 'put', hint: L("Avval koeffitsiyentlarni yozing, keyin nuqtani qo'yasiz.", 'Сначала запиши коэффициенты, потом подставишь точку.', 'First write the coefficients, then substitute the point.') },
        { action: 'd', hint: L("Ozod had keyin chiqadi: avval tenglamaning shakli kerak.", 'Свободный член выйдет потом: сначала нужна форма уравнения.', 'The free term comes later: first the shape of the equation.') },
        { action: 'len', hint: L("Uzunlik bu masalada kerak emas.", 'Длина в этой задаче не нужна.', 'The length is not needed here.') },
      ],
    },
    {
      action: 'put',
      to: '2 − 2 + 9 + d = 0',
      wrongs: [
        { action: 'coef', hint: L("Koeffitsiyentlar joyida: ikki, minus bir, uch.", 'Коэффициенты на месте: два, минус один, три.', 'The coefficients are in place: two, minus one, three.') },
        { action: 'd', hint: L("Ozod hadni topish uchun avval nuqtani qo'yish kerak.", 'Чтобы найти свободный член, надо сначала подставить точку.', 'To find the free term, substitute the point first.') },
        { action: 'len', hint: L("Kerak emas.", 'Не нужно.', 'Not needed.') },
      ],
    },
    {
      action: 'd',
      to: 'd = −9',
      wrongs: [
        { action: 'put', hint: L("Nuqta qo'yilgan: to'qqiz chiqdi.", 'Точка подставлена: вышло девять.', 'The point is substituted: nine came out.') },
        { action: 'coef', hint: L("Koeffitsiyentlar joyida.", 'Коэффициенты на месте.', 'The coefficients are in place.') },
        { action: 'len', hint: L("Kerak emas.", 'Не нужно.', 'Not needed.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['2x − y + 3z − 9 = 0', '2x − y + 3z + 9 = 0', 'x + 2y + 3z − 9 = 0', '2x − y + 3z = 0'],
    value: ['2x − y + 3z − 9 = 0'],
    label: L('tenglama', 'уравнение', 'the equation'),
    prompt: L('Tenglamani yozing', 'Запиши уравнение', 'Write the equation'),
    wrongs: [
      { key: '2x − y + 3z + 9 = 0', hint: L("Ishora almashtirilmagan: nuqta to'qqiz berdi, ozod had esa minus to'qqiz.", 'Знак не сменён: точка дала девять, а свободный член минус девять.', 'The sign was not flipped: the point gave nine, so the free term is minus nine.') },
      { key: 'x + 2y + 3z − 9 = 0', hint: L("Koeffitsiyentlar normaldan olinadi: ikki, minus bir, uch.", 'Коэффициенты берутся из нормали: два, минус один, три.', 'The coefficients come from the normal: two, minus one, three.') },
      { key: '2x − y + 3z = 0', hint: L("Bu tekislik koordinata boshidan o'tardi, nuqtamiz esa boshqa.", 'Такая плоскость проходила бы через начало координат, а наша точка другая.', 'Such a plane would pass through the origin, and our point is elsewhere.') },
      { key: '*', hint: L("Nuqta to'qqiz berdi, demak ozod had minus to'qqiz.", 'Точка дала девять, значит свободный член минус девять.', 'The point gave nine, so the free term is minus nine.') },
    ],
  },
  audio: [
    A('mount', 'Ishora qo\'yildi. Endi to\'liq masalani o\'tamiz.', 'Знак поставлен. Пройдём полную задачу.', 'The sign is placed. Let us work a full problem.'),
    A('start', "Diqqat: ro'yxatda ortiqcha amal ham bor -- normal uzunligi bu yerda kerak emas.", 'Внимание: в списке есть лишнее действие, и это длина нормали. Она здесь ни при чём.', 'Careful: the list holds a superfluous action, the normal length. It is beside the point here.'),
    A('step4', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL: parallel tekislik.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'plane_normal',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Parallel tekislik', 'Параллельная плоскость', 'A parallel plane'),
  // Uch tilda bir xil yozuv: inglizcha varianti 13 px kesilardi.
  start: '(4; 0; 0),   ∥ 2x + y − 2z = 5',
  actions: ACTIONS_10,
  hint: L(
    "Parallel tekisliklarning normali bir xil.",
    'У параллельных плоскостей нормаль одна.',
    'Parallel planes share the normal.',
  ),
  steps: [
    {
      action: 'coef',
      to: '2x + y − 2z + d = 0',
      wrongs: [
        { action: 'put', hint: L("Avval normalni ko'chirib yozing: u o'sha.", 'Сначала перепиши нормаль: она та же.', 'First carry over the normal: it is the same.') },
        { action: 'd', hint: L("Ozod had keyin.", 'Свободный член потом.', 'The free term comes later.') },
        { action: 'len', hint: L("Uzunlik kerak emas.", 'Длина не нужна.', 'The length is not needed.') },
      ],
    },
    {
      action: 'put',
      to: '8 + d = 0',
      wrongs: [
        { action: 'coef', hint: L("Koeffitsiyentlar joyida.", 'Коэффициенты на месте.', 'The coefficients are in place.') },
        { action: 'd', hint: L("Avval nuqtani qo'ying.", 'Сначала подставь точку.', 'Substitute the point first.') },
        { action: 'len', hint: L("Kerak emas.", 'Не нужно.', 'Not needed.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['2x + y − 2z − 8 = 0', '2x + y − 2z + 8 = 0', '2x + y − 2z − 5 = 0', '4x + y − 2z − 8 = 0'],
    value: ['2x + y − 2z − 8 = 0'],
    label: L('tenglama', 'уравнение', 'the equation'),
    prompt: L('Tenglamani yozing', 'Запиши уравнение', 'Write the equation'),
    wrongs: [
      { key: '2x + y − 2z + 8 = 0', hint: L("Ishora almashtirilmagan: nuqta sakkiz berdi.", 'Знак не сменён: точка дала восемь.', 'The sign was not flipped: the point gave eight.') },
      { key: '2x + y − 2z − 5 = 0', hint: L("Bu berilgan tekislikning o'zi. Bizga (4; 0; 0) dan o'tadigani kerak.", 'Это сама данная плоскость. Нам нужна проходящая через (4; 0; 0).', 'That is the given plane itself. We need the one through (4; 0; 0).') },
      { key: '4x + y − 2z − 8 = 0', hint: L("Normal o'zgarmaydi: parallel tekisliklarda u bir xil.", 'Нормаль не меняется: у параллельных плоскостей она одна.', 'The normal does not change: parallel planes share it.') },
      { key: '*', hint: L("Nuqtani qo'ysak sakkiz chiqadi, demak ozod had minus sakkiz.", 'Подстановка точки даёт восемь, значит свободный член минус восемь.', 'The substitution gives eight, so the free term is minus eight.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Parallel tekislikning normali o'zgarmaydi, faqat ozod had boshqa bo'ladi.", 'У параллельной плоскости нормаль не меняется, другим будет только свободный член.', 'A parallel plane keeps the normal, only the free term differs.'),
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
      id: 'b1', tag: 'plane_normal', ask: true, cols: 4,
      done: '(3; −1; 5)',
      prompt: L('3x − y + 5z + 7 = 0 normali?', 'Нормаль 3x − y + 5z + 7 = 0?', 'The normal of 3x − y + 5z + 7 = 0?'),
      items: [
        { id: 'a', label: '(3; −1; 5)', correct: true },
        { id: 'b', label: '(3; 1; 5)', hint: L("Ikkinchi koeffitsiyent manfiy: minus igrek.", 'Второй коэффициент отрицательный: минус игрек.', 'The second coefficient is negative: minus y.') },
        { id: 'c', label: '(3; −1; 5; 7)', hint: L("Ozod had normalga kirmaydi: normal uch sondan.", 'Свободный член в нормаль не входит: нормаль из трёх чисел.', 'The free term is not part of the normal: a normal has three numbers.') },
        { id: 'd', label: '(7; 7; 7)', hint: L("Bu ozod had, va u yo'nalish bermaydi.", 'Это свободный член, он не даёт направления.', 'That is the free term, it gives no direction.') },
      ],
    },
    {
      id: 'b2', tag: 'check_by_point', ask: true, cols: 2,
      done: L('ha', 'да', 'yes'),
      prompt: L('(1; 1; 2) nuqta x + y + z = 4 da yotadimi?', 'Лежит ли (1; 1; 2) в x + y + z = 4?', 'Does (1; 1; 2) lie in x + y + z = 4?'),
      items: [
        { id: 'a', label: L('ha', 'да', 'yes'), correct: true },
        { id: 'b', label: L("yo'q", 'нет', 'no'), hint: L("Bir plyus bir plyus ikki to'rt beradi, ya'ni tenglik bajariladi.", 'Один плюс один плюс два даёт четыре, равенство выполняется.', 'One plus one plus two is four, the equality holds.') },
      ],
    },
    {
      id: 'b3', tag: 'plane_normal', ask: true, cols: 4,
      done: 'z = 0',
      prompt: L('Oxy tekisligining tenglamasi?', 'Уравнение плоскости Oxy?', 'The equation of the plane Oxy?'),
      items: [
        { id: 'a', label: 'z = 0', correct: true },
        { id: 'b', label: 'x = 0', hint: L("Iks teng nol bu Oyz tekisligi.", 'Икс равно нулю это плоскость Oyz.', 'x equals zero is the plane Oyz.') },
        { id: 'c', label: 'y = 0', hint: L("Igrek teng nol bu Oxz tekisligi.", 'Игрек равно нулю это плоскость Oxz.', 'y equals zero is the plane Oxz.') },
        { id: 'd', label: 'x + y = 0', hint: L("Bu Oz o'qidan o'tadigan qiya tekislik.", 'Это наклонная плоскость через ось Oz.', 'That is a slanted plane through the Oz axis.') },
      ],
    },
    {
      id: 'b4', tag: 'plane_free_term', ask: true, cols: 2,
      done: L('ha', 'да', 'yes'),
      prompt: L('2x + 3y − z = 0 boshdan o\'tadimi?', 'Проходит ли 2x + 3y − z = 0 через начало?', 'Does 2x + 3y − z = 0 pass through the origin?'),
      items: [
        { id: 'a', label: L('ha', 'да', 'yes'), correct: true },
        { id: 'b', label: L("yo'q", 'нет', 'no'), hint: L("Ozod had nol, ya'ni nolni qo'yganda tenglik bajariladi.", 'Свободный член нуль, значит подстановка нуля даёт равенство.', 'The free term is zero, so substituting zero satisfies the equation.') },
      ],
    },
    {
      id: 'b5', tag: 'plane_parallel', ask: true, cols: 2,
      done: L('Oxz ga parallel', 'параллельна Oxz', 'parallel to Oxz'),
      prompt: L('y = 4 qanday tekislik?', 'Что за плоскость y = 4?', 'What plane is y = 4?'),
      items: [
        { id: 'a', label: L('Oxz ga parallel', 'параллельна Oxz', 'parallel to Oxz'), correct: true },
        { id: 'b', label: L('Oxy ga parallel', 'параллельна Oxy', 'parallel to Oxy'), hint: L("Oxy ga parallel tekislikda applikata qotirilgan.", 'У плоскости, параллельной Oxy, закреплена аппликата.', 'A plane parallel to Oxy fixes the applicate.') },
        { id: 'c', label: L('Oyz ga parallel', 'параллельна Oyz', 'parallel to Oyz'), hint: L("Oyz ga parallel tekislikda abssissa qotirilgan.", 'У плоскости, параллельной Oyz, закреплена абсцисса.', 'A plane parallel to Oyz fixes the abscissa.') },
        { id: 'd', label: L("Oy o'qi", 'ось Oy', 'the Oy axis'), hint: L("O'q emas, tekislik.", 'Не ось, а плоскость.', 'Not an axis but a plane.') },
      ],
    },
    {
      id: 'b6', tag: 'plane_free_term', ask: true, cols: 4,
      done: 'd = −6',
      prompt: 'M (1; 1; 1), n (1; 2; 3). d?',
      items: [
        { id: 'a', label: '−6', correct: true },
        { id: 'b', label: '6', hint: L("Ishora almashadi: nuqta olti berdi, ozod had minus olti.", 'Знак меняется: точка дала шесть, свободный член минус шесть.', 'The sign flips: the point gave six, the free term is minus six.') },
        { id: 'c', label: '0', hint: L("Nol bo'lsa tekislik boshdan o'tardi, bizning nuqta esa boshqa.", 'При нуле плоскость проходила бы через начало координат, а наша точка другая.', 'With zero the plane would pass through the origin, our point is elsewhere.') },
        { id: 'd', label: '−3', hint: L("Uchala ko'paytmani qo'shish kerak: bir plyus ikki plyus uch.", 'Надо сложить все три произведения: один плюс два плюс три.', 'All three products must be added: one plus two plus three.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', 'Nuqtani qo\'yish.', 'Подстановка точки.', 'Substituting a point.'),
    A('q3', 'Koordinata tekisligi.', 'Координатная плоскость.', 'A coordinate plane.'),
    A('q4', 'Ozod had.', 'Свободный член.', 'The free term.'),
    A('q5', 'Parallellik.', 'Параллельность.', 'Parallelism.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: d ning ishorasi.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'plane_free_term',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Uchta satr to\'g\'ri, bittasi yo\'q', 'Три строки верны, одна нет', 'Three lines are right, one is not'),
  rows: [
    { id: 'r1', text: 'M (1; 2; 3),  n (2; −1; 3)' },
    { id: 'r2', text: '2x − y + 3z + d = 0' },
    { id: 'r3', text: '2 − 2 + 9 = 9' },
    { id: 'r4', text: 'd = 9' },
    { id: 'r5', text: '2x − y + 3z + 9 = 0' },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Koeffitsiyentlar normaldan to'g'ri ko'chirilgan.", 'Коэффициенты верно взяты из нормали.', 'The coefficients are correctly taken from the normal.'),
    r3: L("Hisob to'g'ri: ikki minus ikki plyus to'qqiz to'qqiz beradi.", 'Счёт верен: два минус два плюс девять даёт девять.', 'The arithmetic is right: two minus two plus nine is nine.'),
    r5: L("Bu satr oldingisidan to'g'ri chiqadi. Xato yuqorida.", 'Эта строка верно следует из предыдущей. Ошибка выше.', 'This line follows correctly. The error is above.'),
  },
  proofPoint: L('ishora almashtirilmagan', 'знак не сменён', 'the sign was not flipped'),
  proof: L(
    "Nuqta to'qqiz berdi, lekin tenglamada nol chiqishi kerak. Demak d minus to'qqiz. Tekshiruv: ikki minus ikki plyus to'qqiz plyus to'qqiz o'n sakkiz beradi, nol emas.",
    'Точка дала девять, а в уравнении должен выйти нуль. Значит d равно минус девяти. Проверка: два минус два плюс девять плюс девять даёт восемнадцать, а не нуль.',
    'The point gave nine, while the equation must give zero. So d is minus nine. The check: two minus two plus nine plus nine gives eighteen, not zero.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('d ning ishorasi', 'знак d', 'the sign of d'), correct: true },
      { id: 'b', label: L('koeffitsiyentlar', 'коэффициенты', 'the coefficients'), hint: L("Koeffitsiyentlar normaldan to'g'ri olingan: ikki, minus bir, uch.", 'Коэффициенты взяты из нормали верно: два, минус один, три.', 'The coefficients are right: two, minus one, three.') },
      { id: 'c', label: L('arifmetika', 'арифметика', 'the arithmetic'), hint: L("Uchinchi satrda hisob to'g'ri: to'qqiz.", 'В третьей строке счёт верен: девять.', 'In the third line the arithmetic is right: nine.') },
      { id: 'd', label: L("nuqta noto'g'ri qo'yilgan", 'точка подставлена неверно', 'the point was substituted wrongly'), hint: L("Qo'yish to'g'ri: ikki karra bir, minus ikki, uch karra uch.", 'Подстановка верна: два на один, минус два, три на три.', 'The substitution is right: two times one, minus two, three times three.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Diqqat: uchta satr haqiqatan to'g'ri, hisob ham to'g'ri. Xato bittasida.", 'Внимание: три строки действительно верны, и счёт верен. Ошибка в одной.', 'Careful: three lines are truly right, and the arithmetic too. The error is in one.'),
    A('proof', "Qarang: nuqtani qo'yganda to'qqiz chiqdi. Lekin tenglamada nol chiqishi kerak, shuning uchun ozod had minus to'qqiz bo'ladi. Yozilgan javobni tekshirsak: ikki minus ikki plyus to'qqiz plyus to'qqiz o'n sakkiz beradi. Nol emas, ya'ni nuqta bu tekislikda yotmaydi.", 'Смотри: подстановка точки дала девять. Но в уравнении должен выйти нуль, поэтому свободный член равен минус девяти. Проверим записанный ответ: два минус два плюс девять плюс девять даёт восемнадцать. Не нуль, то есть точка на этой плоскости не лежит.', 'Look: substituting the point gave nine. But the equation must give zero, so the free term is minus nine. Check the written answer: two minus two plus nine plus nine gives eighteen. Not zero, so the point does not lie on that plane.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'plane_normal',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Tenglamani yig\'ing', 'Собери уравнение', 'Build the equation'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L('nuqtani qo\'yganda nol', 'подстановка точки даёт нуль', 'the substitution gives zero'),
  tasks: [
    {
      prompt: 'n (1; 2; 2),  M (2; 1; 1)',
      template: ['x + ', { slot: 0 }, 'y + 2z ', { slot: 1 }, ' = 0'],
      parts: ['2', '1', '− 6', '+ 6'],
      answer: ['2', '− 6'],
      doneLabel: 'x + 2y + 2z − 6 = 0',
      wrongs: [
        { key: '2|+ 6', hint: L("Nuqtani qo'yganda nol chiqishi kerak, plyus bilan esa o'n ikki chiqadi.", 'При подстановке должен выйти нуль, а с плюсом выходит двенадцать.', 'The substitution must give zero, with a plus it gives twelve.') },
        { key: '*', hint: L("Ikkinchi koeffitsiyent normaldan olinadi: ikki.", 'Второй коэффициент берётся из нормали: два.', 'The second coefficient comes from the normal: two.') },
      ],
    },
    {
      prompt: L('Oxz ga parallel, balandligi 4', 'параллельно Oxz, на высоте 4', 'parallel to Oxz, at height 4'),
      template: [{ slot: 0 }, ' ', { slot: 1 }, ' = 0'],
      parts: ['y', 'z', '− 4', '+ 4'],
      answer: ['y', '− 4'],
      doneLabel: 'y − 4 = 0',
      wrongs: [
        { key: 'z|− 4', hint: L("Oxz ga parallel tekislikda ORDINATA qotirilgan, applikata emas.", 'У плоскости, параллельной Oxz, закреплена ОРДИНАТА, а не аппликата.', 'A plane parallel to Oxz fixes the ORDINATE, not the applicate.') },
        { key: 'y|+ 4', hint: L("To'rtta balandlikda ordinata to'rtga teng, ya'ni igrek minus to'rt nolga teng.", 'На высоте четыре ордината равна четырём, то есть игрек минус четыре равно нулю.', 'At height four the ordinate is four, that is y minus four equals zero.') },
        { key: '*', hint: L("Qotirilgan koordinata ordinata, va u to'rtga teng.", 'Закреплённая координата это ордината, и она равна четырём.', 'The fixed coordinate is the ordinate, and it equals four.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari: normal va nuqta bor, tenglama kerak.', 'Ошибка найдена. Последнее задание обратное: есть нормаль и точка, нужно уравнение.', 'The error is found. The last task is reverse: a normal and a point are given, the equation is needed.'),
    A('built1', "Endi ikkinchisi: koordinata tekisligiga parallel tekislik.", 'Теперь второе: плоскость, параллельная координатной.', 'Now the second: a plane parallel to a coordinate one.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'plane_normal',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: 'ax + by + cz + d = 0',
  ruleLines: [
    L('koeffitsiyentlar bu normal', 'коэффициенты это нормаль', 'the coefficients are the normal'),
    L("ozod had nuqtani qo'yib topiladi", 'свободный член находят подстановкой точки', 'the free term comes from substituting the point'),
    L("ko'paytuvchi tekislikni o'zgartirmaydi", 'множитель плоскость не меняет', 'a factor does not change the plane'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('bitta tekislikmi', 'одна ли плоскость', 'is it one plane'),
      right: L('bitta', 'одна', 'one'),
      map: {
        a: L('bitta', 'одна', 'one'),
        b: L('ikkita', 'две', 'two'),
        c: L('parallel ikkita', 'две параллельные', 'two parallel'),
        d: L('aniqlanmaydi', 'не определить', 'cannot tell'),
      },
    },
    {
      screen: 5,
      expr: L("ikkiga ko'paytirilgach", 'после умножения на два', 'after doubling'),
      right: L("o'sha tekislik", 'та же плоскость', 'the same plane'),
      map: {
        a: L("o'sha", 'та же', 'the same'),
        b: L('siljidi', 'сдвинулась', 'shifted'),
        c: L('burildi', 'повернулась', 'turned'),
        d: L('aniqlanmaydi', 'не определить', 'cannot tell'),
      },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: L('ikki tenglama → bitta nuqta ikkalasida → bitta tekislik', 'два уравнения → точка в обоих → одна плоскость', 'two equations → the point in both → one plane'),
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L("Qoida va chizma ekraniga qayting", 'Вернись к правилу и к экрану с чертежом', 'Go back to the rule and the drawing screen'),
  },
  probe: {
    question: L(
      "Nega uchta nuqta shart emas?",
      'Почему три точки не обязательны?',
      'Why are three points not required?',
    ),
    items: [
      { id: 'a', label: L('nuqta va normal yetadi', 'хватает точки и нормали', 'a point and a normal suffice'), correct: true },
      { id: 'b', label: L('uchta nuqta ko\'p', 'три точки это много', 'three points are too many'), hint: L("Gap sonda emas: normal yo'nalishni to'liq belgilaydi.", 'Дело не в количестве: нормаль полностью задаёт направление.', 'It is not about the count: a normal fully fixes the direction.') },
      { id: 'c', label: L('uchta nuqta bilan bo\'lmaydi', 'через три точки нельзя', 'three points cannot do it'), hint: L("Mumkin, lekin buning uchun boshqa asbob kerak bo'lardi.", 'Можно, но для этого понадобился бы другой инструмент.', 'It can, but that would need another tool.') },
      { id: 'd', label: L('tenglama uchta sondan', 'уравнение из трёх чисел', 'the equation has three numbers'), hint: L("Tenglamada to'rtta son: uchta koeffitsiyent va ozod had.", 'В уравнении четыре числа: три коэффициента и свободный член.', 'The equation has four numbers: three coefficients and the free term.') },
    ],
  },
  sheetTitle: L('Tekislik tenglamasi · shpargalka', 'Уравнение плоскости · шпаргалка', 'The plane equation · cheat sheet'),
  sheetSrc: L('11-sinf · 38-dars', '11 класс · урок 38', 'Grade 11 · lesson 38'),
  lifehack: L(
    "Koeffitsiyentlarga qarang: ular normal. Ozod hadni nuqta beradi.",
    'Смотри на коэффициенты: это нормаль. Свободный член даёт точка.',
    'Look at the coefficients: they are the normal. The point gives the free term.',
  ),
  holds: [3000, 6000, 7000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Ikki tenglama bitta tekislikni berdi, chunki ular faqat ko'paytuvchi bilan farq qiladi.", 'Вот твои прогнозы и вот как оказалось. Два уравнения задали одну плоскость, потому что отличаются лишь множителем.', 'Here are your guesses and here is how it turned out. The two equations gave one plane, because they differ only by a factor.'),
    A('rule', "Va mana darsning umumiy fikri. Tekislikni bitta nuqta va bitta yo'nalish belgilaydi. Yo'nalish normal deb ataladi, va u to'g'ridan to'g'ri koeffitsiyentlarda turadi. Ozod hadni nuqtani qo'yib topamiz, va ishorasini almashtirishni esdan chiqarmaymiz. Keyingi darsda shu normal ikki tekislik orasidagi burchakni beradi.", 'И вот общая мысль урока. Плоскость задают одна точка и одно направление. Направление называют нормалью, и оно стоит прямо в коэффициентах. Свободный член находим подстановкой точки и не забываем сменить знак. На следующем уроке эта нормаль даст угол между двумя плоскостями.', 'And here is the shared thought of the lesson. A plane is set by one point and one direction. The direction is called the normal, and it sits right in the coefficients. The free term comes from substituting the point, and the sign must be flipped. Next lesson this normal will give the angle between two planes.'),
    A('q', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
