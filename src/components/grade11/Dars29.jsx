// ============================================================================
// 11-sinf, Dars 29. SHAR VA SFERA.
//
// B4 blokining uchinchi darsi. Faqat MA'LUMOT.
//   kontrakt: src/books/grade11/ETALON_11SINF.md
//   asbob:    `SpinBoard`, `section` rejimi -- tekislik o'q bo'ylab yuradi
//
// DARSNING BITTA GAPI: sharning har qanday kesimi -- DOIRA, lekin uning
// radiusi markazdan uzoqlashgan sari kamayadi, va bu kamayish AYIRISH emas,
// Pifagor bo'yicha boradi.
//
// Xuk aynan shu xatoni oladi: R = 5, markazdan 3 uzoqlikdagi kesim radiusi
// 2 emas, 4. Uchlik 3-4-5 ataylab -- 28-darsdagi bilan bir xil, va o'quvchi
// bog'lanishni o'zi ko'radi.
//
// Sonlar tekshirilgan: ildiz(25 - 9) = 4; markazdagi kesim radiusi 5,
// yuzasi 25 pi; d = 3 dagi kesim yuzasi 16 pi; d = 4 da radius 3.
//
// DARSLIK HAQIDA. Geometriya qismining shar bo'limi repozitoriyda yo'q.
// Metodist qarori 2026-08-15: darsliksiz ketamiz, o'zbekcha atamalar DRAFT
// va o'zbek matematika metodisti tasdiqlashini talab qiladi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_29',
  title: L('Shar va sfera', 'Шар и сфера', 'The ball and the sphere'),
}

const BLOCK = { label: 'B4', from: 26, to: 33, current: 29 }

// Profil: yarim doira radiusi 5. Aylanganda shar chiqadi.
const BALL = (x) => Math.sqrt(Math.max(0, 25 - x * x))

// ============================================================
// SLAYD 1. XUK. Kesim radiusi.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Shar va sfera', 'Шар и сфера', 'The ball and the sphere'),
  title: L('Kesim radiusi', 'Радиус сечения', 'The radius of the section'),
  expr: L('R = 5,  markazdan 3', 'R = 5, от центра 3', 'R = 5, 3 from the centre'),
  rows: [
    {
      id: 'a',
      name: L('birinchi', 'первый', 'the first'),
      value: '5 − 3 = 2',
    },
    {
      id: 'b',
      name: L('ikkinchi', 'второй', 'the second'),
      value: '√(25 − 9) = 4',
    },
  ],
  probe: {
    question: L('Kesim radiusi qancha?', 'Каков радиус сечения?', 'What is the section radius?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi tekislikni yurgizamiz.",
      'Твой ответ записан. Сейчас проведём плоскость.',
      'Your answer is saved. Now we will run the plane.',
    ),
    items: [
      { id: 'a', label: '2' },
      { id: 'b', label: '4' },
      { id: 'both', label: '3' },
      { id: 'none', label: '5' },
    ],
  },
  holds: [5000, 4500, 4500, 4000],
  audio: [
    A('mount', "Uchinchi jism. Silindrni to'rtburchak berdi, konusni uchburchak, sharni esa yarim doira beradi.", 'Третье тело. Цилиндр дал прямоугольник, конус треугольник, а шар даст полукруг.', 'The third solid. The cylinder came from a rectangle, the cone from a triangle, and the ball will come from a semicircle.'),
    A('r1', "Sharning radiusi besh. Markazdan uch masofada uni tekislik bilan kesamiz. Birinchi fikr: kesim radiusi besh minus uch, ya'ni ikki.", 'Радиус шара пять. На расстоянии три от центра режем его плоскостью. Первое мнение: радиус сечения пять минус три, то есть два.', 'The radius of the ball is five. At a distance of three from the centre we cut it with a plane. The first opinion: the section radius is five minus three, that is two.'),
    A('r2', "Ikkinchi fikr: bu yerda ham Pifagor ishlaydi, va javob to'rt.", 'Второе мнение: здесь тоже работает Пифагор, и ответ четыре.', 'The second opinion: Pythagoras works here too, and the answer is four.'),
    A('ask', "Sizningcha qaysi javob to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какой ответ верный? Пока просто предположи.', 'Which answer do you think is right? Just make a guess for now.'),
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
    "Ikkitasi o'tgan darslardan, bittasi 8-sinfdan. Bu baholanmaydi.",
    'Две с прошлых уроков, одна из 8 класса. Это не оценивается.',
    'Two from earlier lessons, one from grade 8. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Aylanish jismi', 'Тело вращения', 'A solid of revolution'),
      short: L('27 va 28-darsdan', 'из уроков 27 и 28', 'from lessons 27 and 28'),
      ex: [{ e: L("figura + o'q", 'фигура + ось', 'a figure and an axis'), why: L('yarim doira sharni beradi', 'полукруг даёт шар', 'a semicircle gives a ball') }],
    },
    {
      id: 'c2',
      title: L('Pifagor teoremasi', 'Теорема Пифагора', 'Pythagoras'),
      short: L('28-darsdan', 'из урока 28', 'from lesson 28'),
      ex: [{ e: 'a² = c² − b²', why: L('katet qidirilsa, ayiriladi', 'ищем катет, значит вычитаем', 'a leg is sought, so subtract') }],
    },
    {
      id: 'c3',
      title: L('Doira yuzasi', 'Площадь круга', 'The area of a circle'),
      short: L('8-sinfdan', 'из 8 класса', 'from grade 8'),
      ex: [{ e: 'S = πr²', why: L('kesim yuzasi shundan', 'площадь сечения отсюда', 'the section area comes from it') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L('Gipotenuza 5, katet 3. Ikkinchi katet?', 'Гипотенуза 5, катет 3. Второй катет?', 'Hypotenuse 5, leg 3. The other leg?'),
      cols: 4,
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '2', hint: L("Bu uzunliklarning ayirmasi. Kvadratlar ayiriladi: yigirma besh minus to'qqiz.", 'Это разность длин. Вычитаются квадраты: двадцать пять минус девять.', 'That is the difference of lengths. Squares subtract: twenty five minus nine.') },
        { id: 'c', label: '16', hint: L("Bu katetning kvadrati. Ildizi to'rt.", 'Это квадрат катета. Его корень четыре.', 'That is the leg squared. Its root is four.') },
        { id: 'd', label: '8', hint: L("Bu yig'indi.", 'Это сумма.', 'That is the sum.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L('Yarim doira nima beradi?', 'Что даёт полукруг?', 'What does a semicircle give?'),
      cols: 4,
      items: [
        { id: 'a', label: L('shar', 'шар', 'a ball'), correct: true },
        { id: 'b', label: L('silindr', 'цилиндр', 'a cylinder'), hint: L("Silindrni to'rtburchak beradi.", 'Цилиндр даёт прямоугольник.', 'A rectangle gives a cylinder.') },
        { id: 'c', label: L('konus', 'конус', 'a cone'), hint: L("Konusni uchburchak beradi.", 'Конус даёт треугольник.', 'A triangle gives a cone.') },
        { id: 'd', label: L('doira', 'круг', 'a circle'), hint: L("Doira tekis figura. Aylanish jism beradi.", 'Круг плоская фигура. Вращение даёт тело.', 'A circle is flat. Spinning gives a solid.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L('r = 4 bo\'lsa, doira yuzasi?', 'Площадь круга при r = 4?', 'The area of a circle with r = 4?'),
      cols: 4,
      items: [
        { id: 'a', label: '16π', correct: true },
        { id: 'b', label: '8π', hint: L("Bu aylana uzunligi.", 'Это длина окружности.', 'That is the circumference.') },
        { id: 'c', label: '4π', hint: L("Radius kvadratga ko'tarilmagan.", 'Радиус не возведён в квадрат.', 'The radius was not squared.') },
        { id: 'd', label: '16', hint: L("Pi tushib qolgan.", 'Потерялось пи.', 'Pi is missing.') },
      ],
    },
  ],
  holds: [3000, 4500, 4500, 4000, 4000, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch: aylanish jismi. Bu safar aylanadigan figura yarim doira bo'ladi.", 'Первая опора: тело вращения. На этот раз вращаться будет полукруг.', 'The first basic: a solid of revolution. This time a semicircle will spin.'),
    A('c2', "Ikkinchi tayanch o'tgan darsdan: katet qidirilganda kvadratlar ayiriladi.", 'Вторая опора с прошлого урока: когда ищут катет, квадраты вычитают.', 'The second basic from last lesson: when a leg is sought, the squares subtract.'),
    A('c3', "Uchinchi tayanch: doira yuzasi. Bugun u kesimning yuzasi bo'ladi.", 'Третья опора: площадь круга. Сегодня это будет площадь сечения.', 'The third basic: the area of a circle. Today it becomes the area of a section.'),
    A('recap', "Uchtasi birga bugungi javobni beradi.", 'Три вместе и дают сегодняшний ответ.', 'The three together give today\'s answer.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. UCHTA KESIM.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'section_radius',
  eyebrow: L('Uchta kesim', 'Три сечения', 'Three sections'),
  title: L('Radius markazdan uzoqlashganda', 'Радиус при удалении от центра', 'The radius as we leave the centre'),
  expr: 'R = 5',
  goal: L('kesim radiusi qanday kamayadi', 'как убывает радиус сечения', 'how the section radius shrinks'),
  rule: L(
    "Uch xil masofada kesamiz va radiusni sanaymiz.",
    'Разрежем на трёх расстояниях и посчитаем радиус.',
    'Let us cut at three distances and compute the radius.',
  ),
  pick: L('Qaysi masofani olamiz?', 'Какое расстояние возьмём?', 'Which distance shall we take?'),
  claims: [
    { id: 'a', key: 'inA', name: L('ayirish', 'вычитание', 'subtracting'), value: '5 − d' },
    { id: 'b', key: 'inB', name: L('Pifagor', 'Пифагор', 'Pythagoras'), value: '√(25 − d²)' },
  ],
  points: [
    {
      id: 'q1', label: 'd = 0', num: 'r = 5', step: 'calc', verdict: 'in',
      role: L('katta doira', 'большой круг', 'the great circle'),
      calc: L('markaz orqali', 'через центр', 'through the centre'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q2', label: 'd = 3', num: 'r = 4', step: 'calc', verdict: 'in',
      role: L("ayirish 2 berardi", 'вычитание дало бы 2', 'subtracting would give 2'),
      calc: '√(25 − 9) = 4',
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q3', label: 'd = 4', num: 'r = 3', step: 'calc', verdict: 'in',
      role: L("ayirish 1 berardi", 'вычитание дало бы 1', 'subtracting would give 1'),
      calc: '√(25 − 16) = 3',
      sol: true, inA: false, inB: true,
    },
  ],
  probe: {
    question: L("Nega ayirish ishlamaydi?", 'Почему вычитание не работает?', 'Why does subtracting fail?'),
    items: [
      {
        id: 'b', label: L('radius, masofa va R uchburchak hosil qiladi', 'радиус, расстояние и R образуют треугольник', 'the radius, the distance and R form a triangle'), correct: true,
        ok: L(
          "To'g'ri. Markazdan kesim chetigacha borsak, to'g'ri burchakli uchburchak chiqadi: katetlari masofa va kesim radiusi, gipotenuzasi esa sharning radiusi.",
          'Верно. Если пройти от центра до края сечения, получается прямоугольный треугольник: катеты это расстояние и радиус сечения, а гипотенуза радиус шара.',
          'Correct. Going from the centre to the edge of the section gives a right triangle: the legs are the distance and the section radius, the hypotenuse is the ball radius.',
        ),
      },
      {
        id: 'a', label: L('ayirish har doim xato', 'вычитание всегда неверно', 'subtracting is always wrong'),
        hint: L("Har doim emas: kvadratlar ayiriladi. Uzunliklarni ayirish xato.", 'Не всегда: вычитаются квадраты. Неверно вычитать длины.', 'Not always: the squares subtract. Subtracting lengths is what is wrong.'),
      },
      {
        id: 'c', label: L('sonlar noqulay', 'числа неудобные', 'the numbers are awkward'),
        hint: L("Sonlar aynan qulay: to'rt va uch butun chiqdi.", 'Числа как раз удобные: четыре и три вышли целыми.', 'The numbers are convenient: four and three came out whole.'),
      },
      {
        id: 'd', label: L("shar juda katta", 'шар слишком большой', 'the ball is too large'),
        hint: L("Kattaligi ahamiyatsiz: har qanday R da shunday bo'ladi.", 'Величина не важна: так будет при любом R.', 'The size does not matter: this holds for any R.'),
      },
    ],
  },
  holds: [2500, 5500, 1500, 2500, 10000, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Endi uch xil masofada kesamiz.', 'Опора восстановлена. Теперь разрежем на трёх расстояниях.', 'The basics are back. Now let us cut at three distances.'),
    A('mount', "Har safar kesim doira bo'ladi, lekin uning radiusi har xil.", 'Каждый раз сечение будет кругом, но радиус у него разный.', 'Each time the section is a circle, but its radius differs.'),
    A('mount', "Qaysi masofadan boshlashni tanlang.", 'Выбери, с какого расстояния начать.', 'Choose which distance to start with.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Mana uchala kesim. Markazda radius eng katta, beshga teng, va bunday doira KATTA DOIRA deyiladi. Uch masofada radius to'rt, to'rt masofada esa uch. Ayirish ikki va bir berardi, va bu xato. Sabab: markaz, kesim markazi va kesim cheti to'g'ri burchakli uchburchak hosil qiladi, unda sharning radiusi gipotenuza bo'ladi.", 'Вот все три сечения. В центре радиус наибольший, равен пяти, и такой круг называется БОЛЬШИМ. На расстоянии три радиус четыре, на расстоянии четыре радиус три. Вычитание дало бы два и один, и это неверно. Причина: центр, центр сечения и край сечения образуют прямоугольный треугольник, где радиус шара это гипотенуза.', 'Here are all three sections. At the centre the radius is largest, five, and such a circle is called a great circle. At distance three the radius is four, at distance four it is three. Subtracting would give two and one, and that is wrong. The reason: the centre, the section centre and the section edge form a right triangle where the ball radius is the hypotenuse.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: TEKISLIK O'Q BO'YLAB YURADI.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'section_radius',
  eyebrow: L('Tekislikni yurgizamiz', 'Ведём плоскость', 'Running the plane'),
  title: L('Kesim kichrayadi', 'Сечение уменьшается', 'The section shrinks'),
  chip: 'R = 5',
  solid: {
    fn: BALL,
    a: -5,
    b: 5,
    xDomain: [-5.6, 5.6],
    yDomain: [-5.6, 5.6],
    mode: 'section',
    spin: 1,
    cuts: [0, 3, 4],
    tilt0: 0.55,
    interactive: true,
    height: 158,
    rLabel: 'r',
    caption: L('jismni barmoq bilan burish mumkin', 'тело можно повернуть пальцем', 'you can turn the solid with a finger'),
  },
  cellSteps: 3,
  bonus: L(
    "Tekislik markazdan uzoqlashgan sari kesim kichrayadi, lekin u har doim DOIRA bo'lib qoladi. Ekranda u ellipsdek ko'rinadi -- bu faqat qarash burchagi, jismni burib ko'ring.",
    'Чем дальше плоскость от центра, тем меньше сечение, но оно всегда остаётся КРУГОМ. На экране он выглядит эллипсом — это лишь угол взгляда, поверни тело.',
    'The farther the plane from the centre, the smaller the section, yet it always stays a CIRCLE. On screen it looks like an ellipse, but that is only the viewing angle: turn the solid.',
  ),
  probe: {
    question: L("Kesim qachon eng katta bo'ladi?", 'Когда сечение наибольшее?', 'When is the section largest?'),
    items: [
      { id: 'a', label: L('markaz orqali o\'tganda', 'когда проходит через центр', 'when it passes the centre'), correct: true },
      { id: 'b', label: L('chetida', 'у края', 'at the edge'), hint: L("Chetida kesim nuqtaga aylanadi.", 'У края сечение стягивается в точку.', 'At the edge the section shrinks to a point.') },
      { id: 'c', label: L('har doim bir xil', 'всегда одинаково', 'always the same'), hint: L("Bir xil emas: besh, to'rt, uch.", 'Не одинаково: пять, четыре, три.', 'Not the same: five, four, three.') },
      { id: 'd', label: L("burchakka bog'liq", 'зависит от угла', 'depends on the angle'), hint: L("Burchak ahamiyatsiz: faqat markazgacha masofa muhim.", 'Угол не важен: важно лишь расстояние до центра.', 'The angle does not matter: only the distance to the centre does.') },
    ],
  },
  holds: [4500, 5500, 3300, 6500],
  audio: [
    A('mount', "Sonlar sanaldi. Endi tekislikni haqiqatan yurgizamiz.", 'Числа посчитаны. Теперь по-настоящему проведём плоскость.', 'The numbers are computed. Now let us actually run the plane.'),
    A('one', "Tekislik markazdan o'tyapti. Kesim eng katta: radiusi besh. Bu katta doira.", 'Плоскость проходит через центр. Сечение наибольшее: радиус пять. Это большой круг.', 'The plane passes through the centre. The section is largest: radius five. That is the great circle.'),
    A('two', "Uch masofaga siljitdik. Radius to'rtga tushdi.", 'Сдвинули на расстояние три. Радиус упал до четырёх.', 'Moved to distance three. The radius fell to four.'),
    A('three', "To'rt masofada radius uch. Va shu yerda muhim narsa: kesim har doim doira bo'lib qolaveradi. Ekranda u ellipsdek ko'rinadi, lekin bu faqat qarash burchagi. Jismni buring va ishonch hosil qiling.", 'На расстоянии четыре радиус три. И вот что важно: сечение всегда остаётся кругом. На экране оно похоже на эллипс, но это лишь угол взгляда. Поверни тело и убедись.', 'At distance four the radius is three. And here is what matters: the section always stays a circle. On screen it resembles an ellipse, but that is only the viewing angle. Turn the solid and see.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'section_radius',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Kesim radiusi', 'Радиус сечения', 'The section radius'),
  rows: ['r² = R² − d²', '16 = 25 − 9'],
  probe: {
    question: L(
      "R = 13, d = 5. Kesim radiusi?",
      'R = 13, d = 5. Радиус сечения?',
      'R = 13, d = 5. The section radius?',
    ),
    items: [
      { id: 'a', label: '12', correct: true },
      { id: 'b', label: '8', hint: L("Bu uzunliklarning ayirmasi. Kvadratlar ayiriladi: yuz oltmish to'qqiz minus yigirma besh.", 'Это разность длин. Вычитаются квадраты: сто шестьдесят девять минус двадцать пять.', 'That is the difference of lengths. Squares subtract: a hundred sixty nine minus twenty five.') },
      { id: 'c', label: '144', hint: L("Bu kvadrat, ildizi o'n ikki.", 'Это квадрат, его корень двенадцать.', 'That is the square, its root is twelve.') },
      { id: 'd', label: '18', hint: L("Bu yig'indi.", 'Это сумма.', 'That is the sum.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Kesim', 'Правило 1. Сечение', 'Rule 1. The section'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'r² = R² − d²',
    lines: [
      L("sharning har qanday tekis kesimi -- DOIRA", 'любое плоское сечение шара это КРУГ', 'every plane section of a ball is a CIRCLE'),
      L('markazdan uzoqlashganda radius kamayadi', 'при удалении от центра радиус убывает', 'the radius shrinks as we leave the centre'),
      L('markaz orqali o\'tgan kesim -- katta doira', 'сечение через центр это большой круг', 'the section through the centre is the great circle'),
      L("kamayish Pifagor bo'yicha, ayirish bilan emas", 'убывание по Пифагору, а не вычитанием', 'the shrinking follows Pythagoras, not subtraction'),
    ],
    example: L('misol:  4² = 5² − 3²', 'пример:  4² = 5² − 3²', 'example:  4² = 5² − 3²'),
  },
  holds: [4000, 6500, 4500],
  audio: [
    A('mount', "Kesimlar ko'rildi. Endi qoidani yozamiz.", 'Сечения увидели. Теперь запишем правило.', 'We saw the sections. Now let us write the rule.'),
    A('def', "Sharning har qanday tekis kesimi doira bo'ladi. Uning radiusi markazgacha bo'lgan masofaga bog'liq, va bog'lanish Pifagor teoremasi bo'yicha: kesim radiusining kvadrati sharning radiusi kvadratidan masofa kvadratini ayirganga teng. Markazdan o'tgan kesim eng katta bo'ladi va katta doira deyiladi.", 'Любое плоское сечение шара это круг. Его радиус зависит от расстояния до центра, и связь по теореме Пифагора: квадрат радиуса сечения равен квадрату радиуса шара минус квадрат расстояния. Сечение через центр наибольшее и называется большим кругом.', 'Every plane section of a ball is a circle. Its radius depends on the distance to the centre, and the link is Pythagoras: the section radius squared equals the ball radius squared minus the distance squared. The section through the centre is the largest and is called the great circle.'),
    A('rule', "To'g'ri. Va teskari yo'l ham ishlaydi: kesim radiusi berilsa, markazgacha masofani topish mumkin.", 'Верно. И обратный ход работает: зная радиус сечения, можно найти расстояние до центра.', 'Correct. And it works backwards: given the section radius, the distance to the centre follows.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: shar va sfera.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'ball_vs_sphere',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Ikki so\'z, ikki narsa', 'Два слова, две вещи', 'Two words, two things'),
  was: { label: UI.was, expr: L('kesim radiusini sanadik', 'считали радиус сечения', 'we computed the section radius') },
  now: { label: UI.now, expr: L('shar va sfera -- bir xilmi?', 'шар и сфера — одно ли это?', 'ball and sphere — the same?') },
  probe1: {
    question: L('Sfera nima?', 'Что такое сфера?', 'What is a sphere?'),
    items: [
      { id: 'a', label: L('faqat sirt', 'только поверхность', 'the surface only'), correct: true },
      { id: 'b', label: L('sirt va ichi', 'поверхность и внутренность', 'surface and interior'), hint: L("Bu SHAR. Sfera faqat chegara, ichi unga kirmaydi.", 'Это ШАР. Сфера только граница, внутренность в неё не входит.', 'That is the BALL. A sphere is only the boundary, the interior is not part of it.') },
      { id: 'c', label: L('katta doira', 'большой круг', 'the great circle'), hint: L("Katta doira bu kesim, tekis figura.", 'Большой круг это сечение, плоская фигура.', 'The great circle is a section, a flat figure.') },
      { id: 'd', label: L("shar bilan bir xil", 'то же, что шар', 'the same as a ball'), hint: L("Bir xil emas: birining hajmi bor, ikkinchisining faqat yuzasi.", 'Не одно и то же: у одного есть объём, у другой только площадь.', 'Not the same: one has volume, the other only area.') },
    ],
  },
  probe2: {
    cols: 2,
    question: L('Nimasi bilan farq qiladi?', 'Чем они различаются?', 'How do they differ?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: L('sharda hajm, sferada yuza', 'у шара объём, у сферы площадь', 'volume for the ball, area for the sphere') },
      { id: 'b', label: L('radiusi bilan', 'радиусом', 'by the radius') },
      { id: 'c', label: L('hech nima bilan', 'ничем', 'in no way') },
      { id: 'd', label: L('shakli bilan', 'формой', 'by shape') },
    ],
  },
  holds: [4500, 5500, 1700, 3000],
  audio: [
    A('mount', "Kesim radiusi bilan aniqlandik. Endi ikkita so'z haqida.", 'С радиусом сечения разобрались. Теперь про два слова.', 'The section radius is settled. Now about two words.'),
    A('now', "Kundalik nutqda shar va sfera bir xil ishlatiladi, matematikada esa yo'q. Bu ikki har xil obyekt, va ular uchun har xil kattaliklar sanaladi.", 'В обиходе шар и сферу говорят как одно, а в математике нет. Это два разных объекта, и величины для них считают разные.', 'In everyday speech ball and sphere are used alike, but not in mathematics. They are two different objects, and different quantities are computed for them.'),
    A('q1', "Sfera nima?", 'Что такое сфера?', 'What is a sphere?'),
    A('q2', "Sizningcha ular nimasi bilan farq qiladi? Shunchaki taxmin qiling.", 'Как думаешь, чем они различаются? Просто предположи.', 'How do you think they differ? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'ball_vs_sphere',
  eyebrow: L('Ikkalasini ajratamiz', 'Разведём оба', 'Let us separate them'),
  title: L('Shar va sfera', 'Шар и сфера', 'Ball and sphere'),
  expr: 'R = 5',
  need: '= ?',
  answerLabel: L('sfera yuzasi', 'площадь сферы', 'the sphere area'),
  cards: [
    {
      tag: L('shar', 'шар', 'the ball'),
      txt: L('sirt va ichi', 'поверхность и внутренность', 'surface and interior'),
      point: {
        label: L('nima sanaladi', 'что считают', 'what is computed'),
        calc: L('hajm', 'объём', 'volume'),
        verdict: 'in',
      },
    },
    {
      tag: L('sfera', 'сфера', 'the sphere'),
      txt: L('faqat sirt', 'только поверхность', 'the surface only'),
      point: {
        label: L('nima sanaladi', 'что считают', 'what is computed'),
        calc: L('yuza', 'площадь', 'area'),
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['100π', '25π', '50π', '125π'],
    value: ['100π'],
    label: 'S =',
    prompt: L('Sfera yuzasini yozing:  S = 4πR²', 'Запиши площадь сферы: S = 4πR²', 'Write the sphere area: S = 4πR²'),
    wrongs: [
      { key: '25π', hint: L("Bu katta doiraning yuzasi. Sfera yuzasi undan to'rt barobar katta.", 'Это площадь большого круга. Площадь сферы вчетверо больше.', 'That is the great circle area. The sphere area is four times that.') },
      { key: '125π', hint: L("Bu R kubga o'xshaydi: u hajmda uchraydi, yuzada emas.", 'Это похоже на R в кубе: он встречается в объёме, а не в площади.', 'That looks like R cubed: it belongs to the volume, not the area.') },
      { key: '*', hint: L("To'rt karra pi karra yigirma besh.", 'Четыре на пи на двадцать пять.', 'Four times pi times twenty five.') },
    ],
  },
  holds: [3500, 5500, 5500, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi ikkalasini ham ajratamiz.', 'Прогноз есть. Теперь разведём оба.', 'The guess is made. Now let us separate them.'),
    A('p1', "Shar bu sirt va uning ichidagi hamma narsa. Shuning uchun shar uchun HAJM sanaladi.", 'Шар это поверхность и всё, что внутри неё. Поэтому для шара считают ОБЪЁМ.', 'A ball is the surface together with everything inside. So for a ball we compute VOLUME.'),
    A('p2', "Sfera esa faqat chegara, ichi unga kirmaydi. Sfera uchun YUZA sanaladi, va u to'rt pi karra R kvadratga teng. Diqqat qiling: bu katta doira yuzasidan roppa rosa to'rt barobar katta.", 'А сфера это только граница, внутренность в неё не входит. Для сферы считают ПЛОЩАДЬ, и она равна четыре пи эр квадрат. Обрати внимание: это ровно вчетверо больше площади большого круга.', 'A sphere is only the boundary, the interior is not part of it. For a sphere we compute AREA, and it equals four pi R squared. Note: that is exactly four times the great circle area.'),
    A('write', "Yuzani yozing.", 'Запиши площадь.', 'Write the area.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'ball_vs_sphere',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Nimani sanaymiz', 'Что считаем', 'What we compute'),
  cases: [
    {
      label: L('shar', 'шар', 'the ball'),
      text: 'V = 4/3 πR³',
      tone: 'graph',
    },
    {
      label: L('sfera', 'сфера', 'the sphere'),
      text: 'S = 4πR²',
      tone: 'accent',
    },
  ],
  rows: [
    L('katta doira: 25π', 'большой круг: 25π', 'great circle: 25π'),
    L('sfera: 100π, ya\'ni to\'rt barobar', 'сфера: 100π, то есть вчетверо', 'sphere: 100π, four times that'),
  ],
  probe: {
    question: L(
      "R ni ikki barobar oshirsak, sfera yuzasi qanday o'zgaradi?",
      'Если R увеличить вдвое, как изменится площадь сферы?',
      'If R doubles, how does the sphere area change?',
    ),
    items: [
      { id: 'a', label: L("to'rt barobar", 'вчетверо', 'four times'), correct: true },
      { id: 'b', label: L('ikki barobar', 'вдвое', 'twice'), hint: L("Yuzada R kvadratda: ikki kvadrat to'rt.", 'В площади эр в квадрате: два в квадрате четыре.', 'In the area R is squared: two squared is four.') },
      { id: 'c', label: L('sakkiz barobar', 'в восемь раз', 'eight times'), hint: L("Sakkiz barobar HAJM oshadi: u yerda R kubda.", 'В восемь раз растёт ОБЪЁМ: там эр в кубе.', 'Eight times is how the VOLUME grows: there R is cubed.') },
      { id: 'd', label: L("o'zgarmaydi", 'не изменится', 'no change'), hint: L("O'zgaradi: R yuzaga to'g'ridan to'g'ri kiradi.", 'Изменится: эр прямо входит в площадь.', 'It changes: R enters the area directly.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Shar va sfera', 'Правило 2. Шар и сфера', 'Rule 2. Ball and sphere'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('sferada yuza, sharda hajm', 'у сферы площадь, у шара объём', 'area for a sphere, volume for a ball'),
    lines: [
      L('sfera -- sirt, shar -- sirt va ichi', 'сфера это поверхность, шар это поверхность и внутренность', 'a sphere is the surface, a ball is surface and interior'),
      L('sfera yuzasi 4πR², katta doiradan to\'rt barobar katta', 'площадь сферы 4πR², вчетверо больше большого круга', 'the sphere area is 4πR², four times the great circle'),
      L('shar hajmi 4/3 πR³', 'объём шара 4/3 πR³', 'the ball volume is 4/3 πR³'),
      L("R ikki barobar: yuza to'rt, hajm sakkiz barobar", 'R вдвое: площадь вчетверо, объём в восемь раз', 'R doubles: area four times, volume eight times'),
    ],
    example: L('misol:  4π · 25 = 100π', 'пример:  4π · 25 = 100π', 'example:  4π · 25 = 100π'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('kesim har doim doira', 'сечение всегда круг', 'the section is always a circle'),
    lines: [
      L("1. kesim doira, radiusi r² = R² − d²", '1. сечение круг, радиус r² = R² − d²', '1. the section is a circle, r² = R² − d²'),
      L('2. markaz orqali -- katta doira', '2. через центр это большой круг', '2. through the centre is the great circle'),
      L('3. sfera -- sirt: yuza 4πR²', '3. сфера это поверхность: площадь 4πR²', '3. a sphere is the surface: area 4πR²'),
      L('4. shar -- jism: hajm 4/3 πR³', '4. шар это тело: объём 4/3 πR³', '4. a ball is the solid: volume 4/3 πR³'),
    ],
  },
  holds: [2500, 5500, 4500, 5000],
  audio: [
    A('mount', 'Ikkalasi ajratildi. Endi yozib qo\'yamiz.', 'Оба разведены. Теперь запишем.', 'Both are separated. Now let us write it down.'),
    A('rows', "Katta doiraning yuzasi yigirma besh pi, sferaniki esa yuz pi. Farq roppa rosa to'rt barobar, va bu tasodif emas: sfera yuzasi har doim katta doiradan to'rt barobar katta.", 'Площадь большого круга двадцать пять пи, а сферы сто пи. Разница ровно вчетверо, и это не случайность: площадь сферы всегда вчетверо больше большого круга.', 'The great circle area is twenty five pi, the sphere area a hundred pi. Exactly four times, and that is no accident: a sphere area is always four times its great circle.'),
    A('q', "Savol: R ni ikki barobar oshirsak, yuza qanday o'zgaradi?", 'Вопрос: если R увеличить вдвое, как изменится площадь?', 'The question: if R doubles, how does the area change?'),
    A('rule', "To'g'ri. Yuzada R kvadratda, hajmda esa kubda: shuning uchun hajm sakkiz barobar oshadi. Bu farqni keyingi darslarda yana ko'ramiz.", 'Верно. В площади эр в квадрате, а в объёме в кубе: поэтому объём вырастет в восемь раз. Эту разницу мы ещё увидим на следующих уроках.', 'Correct. In the area R is squared, in the volume cubed: so the volume grows eightfold. We will meet this difference again in later lessons.'),
    A('both', 'Endi butun darsni bitta qoidaga yig\'ing.', 'А теперь собери весь урок в одно правило.', 'Now combine the whole lesson into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. AMALNI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'section_radius',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Amalni qo\'ying', 'Поставь действие', 'Place the operation'),
  left: L('kesim radiusi: R = 13, d = 5', 'радиус сечения: R = 13, d = 5', 'the section radius: R = 13, d = 5'),
  template: ['r² = 169 ', { slot: 0 }, ' 25'],
  signs: ['−', '+'],
  answer: '−',
  checkNote: L(
    "Kesim radiusi sharnikidan KICHIK: kvadratlar ayiriladi",
    'Радиус сечения МЕНЬШЕ радиуса шара: квадраты вычитаются',
    'The section radius is SMALLER than the ball radius: the squares subtract',
  ),
  wrongs: [
    { key: '+', hint: L("Qo'shsak kesim radiusi shardan katta chiqadi, va bu mumkin emas.", 'Сложение даст радиус сечения больше шара, а это невозможно.', 'Adding would make the section radius exceed the ball, which is impossible.') },
  ],
  probe: {
    question: L("Kesim radiusi R dan katta bo'la oladimi?", 'Может ли радиус сечения превысить R?', 'Can the section radius exceed R?'),
    items: [
      { id: 'a', label: L("yo'q, hech qachon", 'нет, никогда', 'no, never'), correct: true },
      { id: 'b', label: L('ha, chetida', 'да, у края', 'yes, at the edge'), hint: L("Chetida u nolga intiladi, aksincha.", 'У края он стремится к нулю, наоборот.', 'At the edge it tends to zero, the opposite.') },
      { id: 'c', label: L('ha, qiya kesganda', 'да, при наклонном сечении', 'yes, with a slanted cut'), hint: L("Qiya kesim ham doira beradi, va u ham kattaroq bo'la olmaydi.", 'Наклонное сечение тоже даёт круг, и он тоже не может быть больше.', 'A slanted cut also gives a circle, and it cannot be larger either.') },
      { id: 'd', label: L("bog'liq", 'зависит', 'depends'), hint: L("Bog'liq emas: eng kattasi katta doira, radiusi R.", 'Не зависит: наибольшее это большой круг радиуса R.', 'It does not: the largest is the great circle of radius R.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Amalni qo'ying.", 'Поставь действие.', 'Place the operation.'),
    A('checked', "Bo'ldi. Endi ta'riflang.", 'Получилось. Теперь сформулируй.', 'Done. Now put it into words.'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'sq', label: L('kvadratlarni yozish', 'записать квадраты', 'write the squares') },
  { id: 'sub', label: L('ayirish', 'вычесть', 'subtract') },
  { id: 'root', label: L('ildiz olish', 'извлечь корень', 'take the root') },
  { id: 'area', label: L('yuzani topish', 'найти площадь', 'find the area') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'section_radius',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: L('R = 5, d = 3. Kesim yuzasi?', 'R = 5, d = 3. Площадь сечения?', 'R = 5, d = 3. The section area?'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'sq',
      to: '25  va  9',
      wrongs: [
        { action: 'sub', hint: L("Avval kvadratlarni yozing.", 'Сначала запиши квадраты.', 'Write the squares first.') },
        { action: 'root', hint: L("Ildiz keyinroq.", 'Корень позже.', 'The root comes later.') },
        { action: 'area', hint: L("Yuza oxirida: avval radius kerak.", 'Площадь в конце: сначала нужен радиус.', 'The area last: the radius comes first.') },
      ],
    },
    {
      action: 'sub',
      to: '25 − 9 = 16',
      wrongs: [
        { action: 'sq', hint: L("Yozilgan: yigirma besh va to'qqiz.", 'Записано: двадцать пять и девять.', 'Written: twenty five and nine.') },
        { action: 'root', hint: L("Avval ayiring.", 'Сначала вычти.', 'Subtract first.') },
        { action: 'area', hint: L("Radius hali topilmagan.", 'Радиус ещё не найден.', 'The radius is not found yet.') },
      ],
    },
    {
      action: 'root',
      to: 'r = 4',
      wrongs: [
        { action: 'sq', hint: L("Kvadratlar yozilgan.", 'Квадраты записаны.', 'The squares are written.') },
        { action: 'sub', hint: L("Ayirilgan: o'n olti.", 'Вычтено: шестнадцать.', 'Subtracted: sixteen.') },
        { action: 'area', hint: L("Radius o'n olti emas: ildiz olish kerak.", 'Радиус не шестнадцать: нужен корень.', 'The radius is not sixteen: take the root.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['16π', '4π', '25π', '16'],
    value: ['16π'],
    label: 'S =',
    prompt: L('Yuzani yozing', 'Запиши площадь', 'Write the area'),
    wrongs: [
      { key: '4π', hint: L("Bu ayirish javobi bo'lardi: radius ikki. Aslida radius to'rt.", 'Это был бы ответ вычитания: радиус два. На деле радиус четыре.', 'That would be the subtraction answer: radius two. In fact the radius is four.') },
      { key: '25π', hint: L("Bu katta doira, markazdagi kesim.", 'Это большой круг, сечение через центр.', 'That is the great circle, the section through the centre.') },
      { key: '*', hint: L("Radius to'rt, yuzasi pi karra o'n olti.", 'Радиус четыре, площадь пи на шестнадцать.', 'The radius is four, the area pi times sixteen.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi to\'liq masalani o\'tamiz.', 'Правило сформулировано. Пройдём полную задачу.', 'The rule is stated. Let us work a full problem.'),
    A('start', "Diqqat: ro'yxatda ortiqcha amal bor, va oxirgi qadam radius emas, yuza.", 'Внимание: в списке есть лишнее действие, и последний шаг это не радиус, а площадь.', 'Careful: the list has one superfluous action, and the last step is the area, not the radius.'),
    A('step4', 'Endi yuzani yozing.', 'Теперь запиши площадь.', 'Now write the area.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'ball_vs_sphere',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Sfera yuzasi', 'Площадь сферы', 'The sphere area'),
  start: L('R = 3. Sfera yuzasi?', 'R = 3. Площадь сферы?', 'R = 3. The sphere area?'),
  actions: ACTIONS_10,
  hint: L(
    "Sfera yuzasi: to'rt pi karra R kvadrat.",
    'Площадь сферы: четыре пи на R в квадрате.',
    'The sphere area: four pi times R squared.',
  ),
  steps: [
    {
      action: 'sq',
      to: 'R² = 9',
      wrongs: [
        { action: 'area', hint: L("Avval R kvadratni sanang.", 'Сначала посчитай R в квадрате.', 'Compute R squared first.') },
        { action: 'sub', hint: L("Ayiriladigan narsa yo'q: kesim haqida gap yo'q.", 'Вычитать нечего: о сечении речи нет.', 'Nothing to subtract: no section here.') },
        { action: 'root', hint: L("Ildiz kerak emas.", 'Корень не нужен.', 'No root needed.') },
      ],
    },
    {
      action: 'area',
      to: '4π · 9 = 36π',
      wrongs: [
        { action: 'sq', hint: L("Sanalgan: to'qqiz.", 'Посчитано: девять.', 'Computed: nine.') },
        { action: 'sub', hint: L("Ayirish bu yerda kerak emas.", 'Вычитание здесь не нужно.', 'No subtracting here.') },
        { action: 'root', hint: L("Ildiz kerak emas.", 'Корень не нужен.', 'No root needed.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['36π', '9π', '12π', '36'],
    value: ['36π'],
    label: 'S =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '9π', hint: L("Bu katta doiraning yuzasi. Sfera undan to'rt barobar katta.", 'Это площадь большого круга. Сфера вчетверо больше.', 'That is the great circle area. The sphere is four times that.') },
      { key: '12π', hint: L("R kvadratga ko'tarilmagan: to'rt pi karra to'qqiz.", 'Эр не возведён в квадрат: четыре пи на девять.', 'R was not squared: four pi times nine.') },
      { key: '*', hint: L("To'rt karra to'qqiz o'ttiz olti.", 'Четыре на девять тридцать шесть.', 'Four times nine is thirty six.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Diqqat: so'ralgani SFERA yuzasi, ya'ni sirt. Katta doira bilan aralashtirmang.", 'Внимание: спрашивают площадь СФЕРЫ, то есть поверхности. Не спутай с большим кругом.', 'Careful: the SPHERE area is asked, that is the surface. Do not confuse it with the great circle.'),
    A('answered', "Javobni yozing.", 'Запиши ответ.', 'Write the answer.'),
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
      id: 'b1', tag: 'section_radius', ask: true, cols: 4,
      done: 'r = 4',
      prompt: L('R = 5, d = 3. Kesim radiusi?', 'R = 5, d = 3. Радиус сечения?', 'R = 5, d = 3. The section radius?'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '2', hint: L("Bu uzunliklarning ayirmasi. Kvadratlar ayiriladi.", 'Это разность длин. Вычитаются квадраты.', 'That is the difference of lengths. Squares subtract.') },
        { id: 'c', label: '16', hint: L("Bu kvadrat, ildizi to'rt.", 'Это квадрат, корень четыре.', 'That is the square, root four.') },
        { id: 'd', label: '8', hint: L("Bu yig'indi.", 'Это сумма.', 'That is the sum.') },
      ],
    },
    {
      id: 'b2', tag: 'section_radius', ask: true, cols: 2,
      done: L('doira', 'круг', 'a circle'),
      prompt: L('Sharning tekis kesimi qanday figura?', 'Какая фигура в плоском сечении шара?', 'What figure is a plane section of a ball?'),
      items: [
        { id: 'a', label: L('har doim doira', 'всегда круг', 'always a circle'), correct: true },
        { id: 'b', label: L('ellips', 'эллипс', 'an ellipse'), hint: L("Ellips faqat qiya qaraganda ko'rinadi.", 'Эллипс это лишь вид под углом.', 'An ellipse is only the angled view.') },
        { id: 'c', label: L("qiya kesganda ellips", 'при наклоне эллипс', 'an ellipse when slanted'), hint: L("Yo'q: shar hamma tomonga bir xil, qanday kessangiz ham doira.", 'Нет: шар одинаков во все стороны, как ни режь, будет круг.', 'No: a ball is alike in all directions, any cut gives a circle.') },
        { id: 'd', label: L("bog'liq", 'зависит', 'depends'), hint: L("Bog'liq emas: har doim doira.", 'Не зависит: всегда круг.', 'It does not: always a circle.') },
      ],
    },
    {
      id: 'b3', tag: 'ball_vs_sphere', ask: true, cols: 4,
      done: 'S = 100π',
      prompt: L('R = 5. Sfera yuzasi?', 'R = 5. Площадь сферы?', 'R = 5. The sphere area?'),
      items: [
        { id: 'a', label: '100π', correct: true },
        { id: 'b', label: '25π', hint: L("Bu katta doira. Sfera to'rt barobar katta.", 'Это большой круг. Сфера вчетверо больше.', 'That is the great circle. The sphere is four times more.') },
        { id: 'c', label: '20π', hint: L("R kvadratga ko'tarilmagan.", 'Эр не возведён в квадрат.', 'R was not squared.') },
        { id: 'd', label: '500π', hint: L("Bu R kub bilan, ya'ni hajmga o'xshaydi.", 'Это с эр в кубе, похоже на объём.', 'That uses R cubed, closer to a volume.') },
      ],
    },
    {
      id: 'b4', tag: 'ball_vs_sphere', ask: true, cols: 2,
      done: L('sfera -- sirt', 'сфера это поверхность', 'a sphere is the surface'),
      prompt: L('Sfera va shar farqi?', 'Разница сферы и шара?', 'The difference between sphere and ball?'),
      items: [
        { id: 'a', label: L('sfera sirt, shar jism', 'сфера поверхность, шар тело', 'sphere is surface, ball is solid'), correct: true },
        { id: 'b', label: L('farqi yo\'q', 'разницы нет', 'no difference'), hint: L("Farq bor: birida yuza, ikkinchisida hajm sanaladi.", 'Разница есть: у одной считают площадь, у другого объём.', 'There is: one gets an area, the other a volume.') },
        { id: 'c', label: L('radiusi bilan', 'радиусом', 'the radius'), hint: L("Radius ikkalasida ham bir xil bo'lishi mumkin.", 'Радиус у них может быть одинаковым.', 'The radius can be the same for both.') },
        { id: 'd', label: L('shar tekis figura', 'шар плоская фигура', 'a ball is flat'), hint: L("Shar jism, tekis figura emas.", 'Шар это тело, а не плоская фигура.', 'A ball is a solid, not a flat figure.') },
      ],
    },
    {
      id: 'b5', tag: 'section_radius', ask: true, cols: 4,
      done: 'd = 4',
      prompt: L('R = 5, kesim radiusi 3. Masofa?', 'R = 5, радиус сечения 3. Расстояние?', 'R = 5, section radius 3. The distance?'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '2', hint: L("Bu uzunliklarning ayirmasi. Yigirma besh minus to'qqiz o'n olti.", 'Это разность длин. Двадцать пять минус девять шестнадцать.', 'That is the difference of lengths. Twenty five minus nine is sixteen.') },
        { id: 'c', label: '8', hint: L("Masofa R dan katta bo'la olmaydi.", 'Расстояние не может превышать R.', 'The distance cannot exceed R.') },
        { id: 'd', label: '16', hint: L("Bu kvadrat, ildizi to'rt.", 'Это квадрат, корень четыре.', 'That is the square, root four.') },
      ],
    },
    {
      id: 'b6', tag: 'ball_vs_sphere', ask: true, cols: 2,
      done: L('sakkiz barobar', 'в восемь раз', 'eight times'),
      prompt: L("R ikki barobar oshdi. Hajm?", 'R вырос вдвое. Объём?', 'R doubled. The volume?'),
      items: [
        { id: 'a', label: L('sakkiz barobar', 'в восемь раз', 'eight times'), correct: true },
        { id: 'b', label: L("to'rt barobar", 'вчетверо', 'four times'), hint: L("To'rt barobar YUZA oshadi. Hajmda R kubda.", 'Вчетверо растёт ПЛОЩАДЬ. В объёме эр в кубе.', 'Four times is the AREA. In the volume R is cubed.') },
        { id: 'c', label: L('ikki barobar', 'вдвое', 'twice'), hint: L("Ikki barobar faqat uzunlik oshadi.", 'Вдвое растёт только длина.', 'Twice is only the length.') },
        { id: 'd', label: L("o'n olti barobar", 'в шестнадцать раз', 'sixteen times'), hint: L("Bu to'rtinchi daraja bo'lardi. Hajmda uchinchi.", 'Это была бы четвёртая степень. В объёме третья.', 'That would be the fourth power. The volume takes the third.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Kesim shakli.", 'Форма сечения.', 'The shape of the section.'),
    A('q3', "Sfera yuzasi.", 'Площадь сферы.', 'The sphere area.'),
    A('q4', "Ikki so'z.", 'Два слова.', 'Two words.'),
    A('q5', "Teskari masala.", 'Обратная задача.', 'The reverse problem.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'section_radius',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Uzunliklar ayirilgan', 'Вычли длины', 'Lengths were subtracted'),
  rows: [
    { id: 'r1', text: 'R = 10,  d = 6' },
    { id: 'r2', text: L('kesim radiusi: 10 − 6 = 4', 'радиус сечения: 10 − 6 = 4', 'section radius: 10 − 6 = 4') },
    { id: 'r3', text: L('yuzasi: π · 16 = 16π', 'площадь: π · 16 = 16π', 'area: π · 16 = 16π') },
    { id: 'r4', text: L('javob: 16π', 'ответ: 16π', 'answer: 16π') },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r3: L("Bu satr oldingisidan to'g'ri chiqadi: radius to'rt bo'lsa, yuza o'n olti pi.", 'Эта строка верно следует из предыдущей: если радиус четыре, площадь шестнадцать пи.', 'This line follows correctly: if the radius is four, the area is sixteen pi.'),
    r4: L("Javob xato, lekin u ikkinchi satrda xato bo'lgan.", 'Ответ неверный, но неверным он стал во второй строке.', 'The answer is wrong, but it went wrong in the second line.'),
  },
  proofPoint: L('kvadratlar ayiriladi', 'вычитаются квадраты', 'the squares subtract'),
  proof: L(
    "Kesim radiusi uzunliklarni ayirib topilmaydi. To'g'ri yo'l: yuz minus o'ttiz olti, oltmish to'rt, ildizi sakkiz. Demak radius sakkiz, yuzasi esa oltmish to'rt pi. Xato javob to'rt barobar kichik.",
    'Радиус сечения не находят вычитанием длин. Верный путь: сто минус тридцать шесть, шестьдесят четыре, корень восемь. Значит радиус восемь, а площадь шестьдесят четыре пи. Неверный ответ вчетверо меньше.',
    'The section radius is not found by subtracting lengths. The right way: a hundred minus thirty six is sixty four, root eight. So the radius is eight and the area sixty four pi. The wrong answer is four times too small.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L("kvadratlar o'rniga uzunliklar ayirilgan", 'вместо квадратов вычли длины', 'lengths were subtracted instead of squares'), correct: true },
      { id: 'b', label: L("yuza noto'g'ri sanalgan", 'площадь посчитана неверно', 'the area is miscomputed'), hint: L("Yuza to'g'ri sanalgan: pi karra radius kvadrat.", 'Площадь посчитана верно: пи на радиус в квадрате.', 'The area is right: pi times the radius squared.') },
      { id: 'c', label: L("ildiz olinmagan", 'не извлекли корень', 'no root was taken'), hint: L("Ildiz bu yerda umuman ishlatilmagan, chunki kvadratlar yozilmagan.", 'Корень здесь вообще не применяли, потому что квадраты не записали.', 'The root was never used, because the squares were never written.') },
      { id: 'd', label: L("shart xato", 'условие неверно', 'the problem is wrong'), hint: L("Shart normal: masofa radiusdan kichik.", 'Условие нормальное: расстояние меньше радиуса.', 'The problem is fine: the distance is less than the radius.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Xato birinchi marta paydo bo'lgan satrni toping.", 'Найди строку, в которой ошибка появилась впервые.', 'Find the line where the error first appeared.'),
    A('proof', "Qarang: kesim radiusi uzunliklarni ayirib topilmaydi. To'g'ri yo'lda kvadratlar ayiriladi: yuz minus o'ttiz olti oltmish to'rt, ildizi sakkiz. Yuza esa oltmish to'rt pi, ya'ni javob to'rt barobar kichik chiqqan.", 'Смотри: радиус сечения не находят вычитанием длин. В верном пути вычитаются квадраты: сто минус тридцать шесть шестьдесят четыре, корень восемь. А площадь шестьдесят четыре пи, то есть ответ вышел вчетверо меньше.', 'Look: the section radius is not found by subtracting lengths. The right way subtracts squares: a hundred minus thirty six is sixty four, root eight. And the area is sixty four pi, so the answer came out four times too small.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'ball_vs_sphere',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Yozuvni yig\'ing', 'Собери запись', 'Build the record'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L('sirtmi yoki jism', 'поверхность или тело', 'surface or solid'),
  tasks: [
    {
      prompt: L('R = 2. Sfera yuzasi', 'R = 2. Площадь сферы', 'R = 2. The sphere area'),
      template: ['S = 4π · ', { slot: 0 }, ' = ', { slot: 1 }],
      parts: ['4', '8', '16π', '32π'],
      answer: ['4', '16π'],
      doneLabel: 'S = 16π',
      wrongs: [
        { key: '8|32π', hint: L("Sakkiz bu R kub, u hajmga kerak. Yuzada R kvadrat.", 'Восемь это эр в кубе, оно нужно объёму. В площади эр в квадрате.', 'Eight is R cubed, needed for the volume. The area takes R squared.') },
        { key: '*', hint: L("R kvadrat to'rt, to'rt pi karra to'rt o'n olti pi.", 'Эр в квадрате четыре, четыре пи на четыре шестнадцать пи.', 'R squared is four, four pi times four is sixteen pi.') },
      ],
    },
    {
      prompt: L('R = 5, d = 4. Kesim radiusi', 'R = 5, d = 4. Радиус сечения', 'R = 5, d = 4. The section radius'),
      template: ['r² = 25 ', { slot: 0 }, ' 16 = ', { slot: 1 }],
      parts: ['−', '+', '9', '41'],
      answer: ['−', '9'],
      doneLabel: 'r = 3',
      wrongs: [
        { key: '+|41', hint: L("Kesim radiusi shardan kichik bo'lishi kerak: kvadratlar ayiriladi.", 'Радиус сечения должен быть меньше шара: квадраты вычитаются.', 'The section radius must be smaller than the ball: the squares subtract.') },
        { key: '*', hint: L("Yigirma besh minus o'n olti to'qqiz.", 'Двадцать пять минус шестнадцать девять.', 'Twenty five minus sixteen is nine.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi, va u kesim haqida.", 'А теперь второе, и оно про сечение.', 'And now the second, about the section.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'section_radius',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: 'r² = R² − d²',
  ruleLines: [
    L("sharning har qanday kesimi -- doira", 'любое сечение шара это круг', 'every section of a ball is a circle'),
    L('markazdan uzoqlashganda radius Pifagor bo\'yicha kamayadi', 'при удалении от центра радиус убывает по Пифагору', 'away from the centre the radius shrinks by Pythagoras'),
    L('sferada yuza, sharda hajm', 'у сферы площадь, у шара объём', 'area for the sphere, volume for the ball'),
  ],
  predicts: [
    {
      screen: 0,
      expr: 'R = 5,  d = 3',
      right: '4',
      map: { a: '2', b: '4', both: '3', none: '5' },
    },
    {
      screen: 5,
      expr: L('shar va sfera', 'шар и сфера', 'ball and sphere'),
      right: L('hajm va yuza', 'объём и площадь', 'volume and area'),
      map: {
        a: L('hajm va yuza', 'объём и площадь', 'volume and area'),
        b: L('radiusi', 'радиусом', 'the radius'),
        c: L('hech nima', 'ничем', 'nothing'),
        d: L('shakli', 'формой', 'shape'),
      },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '4  ≠  2',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Kesim ekraniga qayting', 'Вернись к экрану с сечением', 'Go back to the section screen'),
  },
  probe: {
    question: L(
      "Uchala darsda bitta narsa takrorlandi. Nima?",
      'Во всех трёх уроках повторилось одно. Что?',
      'One thing repeated in all three lessons. What?',
    ),
    items: [
      { id: 'a', label: L('Pifagor teoremasi', 'теорема Пифагора', 'Pythagoras'), correct: true },
      { id: 'b', label: L('doira yuzasi', 'площадь круга', 'the area of a circle'), hint: L("Doira ko'p uchradi, lekin silindrda Pifagor kerak emas edi. Bog'lovchi narsa boshqa.", 'Круг встречался часто, но у цилиндра Пифагор не был нужен. Связывает другое.', 'The circle appeared often, but the cylinder needed no Pythagoras. Something else ties them.') },
      { id: 'c', label: L('aylanish', 'вращение', 'spinning'), hint: L("Bu rost, lekin savol HISOBLASH usuli haqida.", 'Это правда, но вопрос про способ ВЫЧИСЛЕНИЯ.', 'True, but the question is about the way of COMPUTING.') },
      { id: 'd', label: L('hech narsa', 'ничего', 'nothing'), hint: L("Takrorlandi: konusda yasovchi, sharda kesim radiusi -- ikkalasi ham Pifagordan.", 'Повторилось: у конуса образующая, у шара радиус сечения, и то и другое по Пифагору.', 'Something did: the cone generator and the ball section radius, both by Pythagoras.') },
    ],
  },
  sheetTitle: L('Shar va sfera · shpargalka', 'Шар и сфера · шпаргалка', 'Ball and sphere · cheat sheet'),
  sheetSrc: L('11-sinf · 29-dars', '11 класс · урок 29', 'Grade 11 · lesson 29'),
  lifehack: L(
    "Shar masalasida markazdan chizma chizing: uchburchak o'zi ko'rinadi.",
    'В задаче про шар проведи отрезок из центра: треугольник проявится сам.',
    'In a ball problem draw a segment from the centre: the triangle shows itself.',
  ),
  holds: [2500, 5500, 7500, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Kesim radiusi to'rt, ikki emas.", 'Вот твои прогнозы и вот как оказалось. Радиус сечения четыре, а не два.', 'Here are your guesses and here is how it turned out. The section radius is four, not two.'),
    A('rule', "Va mana asosiy fikr. Sharning har qanday kesimi doira, va uning radiusi markazdan uzoqlashgan sari kamayadi. Lekin kamayish ayirish bilan emas, Pifagor bilan boradi. Va yana: sfera bu sirt, shar bu jism. Sirt uchun yuza, jism uchun hajm sanaladi.", 'И вот главная мысль. Любое сечение шара круг, и его радиус убывает при удалении от центра. Но убывает не вычитанием, а по Пифагору. И ещё: сфера это поверхность, шар это тело. Для поверхности считают площадь, для тела объём.', 'And here is the main point. Every section of a ball is a circle, and its radius shrinks away from the centre. But it shrinks by Pythagoras, not by subtraction. And one more: a sphere is the surface, a ball the solid. Surface gets an area, a solid gets a volume.'),
    A('q', "Oxirgi savol: uchala darsda bitta narsa takrorlandi. Nima?", 'Последний вопрос: во всех трёх уроках повторилось одно. Что?', 'The last question: one thing repeated in all three lessons. What?'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
