// ============================================================================
// 11-sinf, Dars 28. KONUS.
//
// B4 blokining ikkinchi darsi. Faqat MA'LUMOT.
//   kontrakt: src/books/grade11/ETALON_11SINF.md
//   asbob:    `SpinBoard` -- aylanish va kesim rejimlari
//
// DARSNING BITTA GAPI: konusda IKKITA har xil uzunlik bor -- balandlik va
// yasovchi, va ular Pifagor teoremasi bilan bog'langan, qo'shish bilan emas.
//
// Xuk aynan shu xatoni oladi: r = 3, h = 4 bo'lganda yasovchi 5, lekin
// o'quvchi 7 deb qo'shib yuboradi. Uchlik 3-4-5 ataylab: son butun chiqadi
// va bahs formulaga emas, MA'NOga boradi.
//
// Sonlar tekshirilgan: l = ildiz(9+16) = 5; o'q kesimi -- teng yonli
// uchburchak, asosi 6, yon tomonlari 5, balandligi 4, yuzasi 12;
// balandlikning yarmida kesim radiusi 1,5.
//
// DARSLIK HAQIDA. Geometriya qismining konus bo'limi repozitoriyda yo'q
// (`PODXOD_11SINF.md` §2, 4-nomuvofiqlik). Metodist qarori 2026-08-15:
// darsliksiz ketamiz. Shu sababli o'zbekcha atamalar -- DRAFT, ularni
// o'zbek matematika metodisti tasdiqlashi kerak.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_28',
  title: L('Konus', 'Конус', 'The cone'),
}

const BLOCK = { label: 'B4', from: 26, to: 33, current: 28 }

// Profil: uchburchakning gipotenuzasi. x = 0 da uch, x = 4 da radius 3.
const CONE = (x) => (3 * x) / 4

// ============================================================
// SLAYD 1. XUK. Yasovchi besh yoki yetti.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Konus', 'Конус', 'The cone'),
  title: L('Yasovchi qancha', 'Чему равна образующая', 'How long is the generator'),
  expr: 'r = 3,  h = 4',
  rows: [
    {
      id: 'a',
      name: L('birinchi', 'первый', 'the first'),
      value: '3 + 4 = 7',
    },
    {
      id: 'b',
      name: L('ikkinchi', 'второй', 'the second'),
      value: '√(9 + 16) = 5',
    },
  ],
  probe: {
    question: L('Yasovchi nechaga teng?', 'Чему равна образующая?', 'What is the generator?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi chizmaga qaraymiz.",
      'Твой ответ записан. Сейчас посмотрим на чертёж.',
      'Your answer is saved. Now let us look at the drawing.',
    ),
    items: [
      { id: 'a', label: '7' },
      { id: 'b', label: '5' },
      { id: 'both', label: '12' },
      { id: 'none', label: '25' },
    ],
  },
  holds: [5000, 4500, 4500, 4000],
  audio: [
    A('mount', "O'tgan darsda to'rtburchak aylanib silindr berdi. Bugun aylanadigan figura uchburchak bo'ladi, va shu bilan bitta yangi uzunlik paydo bo'ladi.", 'На прошлом уроке прямоугольник дал цилиндр. Сегодня вращаться будет треугольник, и вместе с ним появится одна новая длина.', 'Last lesson a rectangle gave a cylinder. Today a triangle will spin, and with it one new length appears.'),
    A('r1', "Radius uch, balandlik to'rt. Birinchi fikr: yasovchi ularning yig'indisi, ya'ni yetti.", 'Радиус три, высота четыре. Первое мнение: образующая это их сумма, то есть семь.', 'Radius three, height four. The first opinion: the generator is their sum, that is seven.'),
    A('r2', "Ikkinchi fikr: yasovchi Pifagor teoremasidan chiqadi va beshga teng.", 'Второе мнение: образующая выходит по теореме Пифагора и равна пяти.', 'The second opinion: the generator follows from Pythagoras and equals five.'),
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
    "Bittasi o'tgan darsdan, ikkitasi 8-sinfdan. Bu baholanmaydi.",
    'Одна с прошлого урока, две из 8 класса. Это не оценивается.',
    'One from last lesson, two from grade 8. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Aylanish jismi', 'Тело вращения', 'A solid of revolution'),
      short: L('27-darsdan', 'из урока 27', 'from lesson 27'),
      ex: [{ e: L('figura + o\'q', 'фигура + ось', 'a figure and an axis'), why: L("o'q tanlovi jismni belgilaydi", 'выбор оси задаёт тело', 'the axis decides the solid') }],
    },
    {
      id: 'c2',
      title: L('Pifagor teoremasi', 'Теорема Пифагора', 'Pythagoras'),
      short: L('8-sinfdan', 'из 8 класса', 'from grade 8'),
      ex: [{ e: 'c² = a² + b²', why: L('kvadratlar qo\'shiladi, uzunliklar emas', 'складываются квадраты, а не длины', 'squares add, not lengths') }],
    },
    {
      id: 'c3',
      title: L('Teng yonli uchburchak', 'Равнобедренный треугольник', 'An isosceles triangle'),
      short: L('8-sinfdan', 'из 8 класса', 'from grade 8'),
      ex: [{ e: L('ikki tomoni teng', 'две стороны равны', 'two equal sides'), why: L("balandlik asosni teng bo'ladi", 'высота делит основание пополам', 'the height halves the base') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L('Katetlar 3 va 4. Gipotenuza?', 'Катеты 3 и 4. Гипотенуза?', 'Legs 3 and 4. The hypotenuse?'),
      cols: 4,
      items: [
        { id: 'a', label: '5', correct: true },
        { id: 'b', label: '7', hint: L("Bu katetlarning yig'indisi. Pifagorda kvadratlar qo'shiladi.", 'Это сумма катетов. У Пифагора складываются квадраты.', 'That is the sum of the legs. Pythagoras adds the squares.') },
        { id: 'c', label: '25', hint: L("Bu gipotenuzaning KVADRATI. Ildiz olish qolgan.", 'Это КВАДРАТ гипотенузы. Осталось извлечь корень.', 'That is the SQUARE of the hypotenuse. The root is still to be taken.') },
        { id: 'd', label: '12', hint: L("Bu katetlarning ko'paytmasi.", 'Это произведение катетов.', 'That is the product of the legs.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L('Gipotenuza har doim kattaroqmi?', 'Гипотенуза всегда больше?', 'Is the hypotenuse always larger?'),
      cols: 2,
      items: [
        { id: 'a', label: L('ha, har bir katetdan', 'да, каждого катета', 'yes, than each leg'), correct: true },
        { id: 'b', label: L("yo'q", 'нет', 'no'), hint: L("Kvadrati ikkala kvadratning yig'indisi, demak u kattaroq.", 'Её квадрат это сумма двух квадратов, значит она больше.', 'Its square is the sum of two squares, so it is larger.') },
        { id: 'c', label: L("yig'indisidan ham katta", 'больше и их суммы', 'larger than their sum too'), hint: L("Yo'q: uchburchak tengsizligi bo'yicha u yig'indidan kichik.", 'Нет: по неравенству треугольника она меньше суммы.', 'No: by the triangle inequality it is less than the sum.') },
        { id: 'd', label: L("shartga bog'liq", 'зависит от условия', 'depends'), hint: L("Bog'liq emas: bu har doim shunday.", 'Не зависит: это всегда так.', 'It does not: this always holds.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L('Asos 6, balandlik 4. Uchburchak yuzasi?', 'Основание 6, высота 4. Площадь треугольника?', 'Base 6, height 4. The area?'),
      cols: 4,
      items: [
        { id: 'a', label: '12', correct: true },
        { id: 'b', label: '24', hint: L("Ikkiga bo'lish unutilgan.", 'Забыли поделить на два.', 'The division by two was forgotten.') },
        { id: 'c', label: '10', hint: L("Qo'shish emas, ko'paytirish va ikkiga bo'lish.", 'Не сложение, а умножение и деление на два.', 'Not adding: multiply and halve.') },
        { id: 'd', label: '6', hint: L("Balandlik hisobga olinmagan.", 'Высота не учтена.', 'The height was ignored.') },
      ],
    },
  ],
  holds: [3000, 4500, 4500, 4500, 4000, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch o'tgan darsdan: aylanish jismi tekis figuradan va o'qdan tug'iladi.", 'Первая опора с прошлого урока: тело вращения рождается из плоской фигуры и оси.', 'The first basic from last lesson: a solid of revolution is born from a flat figure and an axis.'),
    A('c2', "Ikkinchi tayanch sakkizinchi sinfdan: Pifagor teoremasi. Diqqat qiling, unda KVADRATLAR qo'shiladi, uzunliklarning o'zi emas.", 'Вторая опора из восьмого класса: теорема Пифагора. Обрати внимание, в ней складываются КВАДРАТЫ, а не сами длины.', 'The second basic from grade eight: Pythagoras. Note that it adds SQUARES, not the lengths themselves.'),
    A('c3', "Uchinchi tayanch: teng yonli uchburchak. Uning balandligi asosni teng ikkiga bo'ladi, va bu bugun kerak bo'ladi.", 'Третья опора: равнобедренный треугольник. Его высота делит основание пополам, и это сегодня понадобится.', 'The third basic: an isosceles triangle. Its height halves the base, and that will be needed today.'),
    A('recap', "Uchtasi birga bugungi javobni beradi.", 'Три вместе и дают сегодняшний ответ.', 'The three together give today\'s answer.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. UCHTA UZUNLIKNI SANAYMIZ.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'slant_vs_height',
  eyebrow: L('Uchta uzunlik', 'Три длины', 'Three lengths'),
  title: L('Ular bir xil emas', 'Они не одно и то же', 'They are not the same'),
  expr: 'r = 3,  h = 4',
  goal: L('yasovchini topish', 'найти образующую', 'find the generator'),
  rule: L(
    "Konusda uchta uzunlik bor. Har birini alohida ko'ramiz.",
    'В конусе три длины. Посмотрим каждую отдельно.',
    'A cone has three lengths. Let us look at each.',
  ),
  pick: L('Qaysi uzunlikni ko\'ramiz?', 'Какую длину посмотрим?', 'Which length shall we look at?'),
  claims: [
    { id: 'a', key: 'inA', name: L("qo'shdi", 'сложил', 'added'), value: '7' },
    { id: 'b', key: 'inB', name: L('Pifagor', 'Пифагор', 'Pythagoras'), value: '5' },
  ],
  points: [
    {
      id: 'q1', label: L('radius', 'радиус', 'radius'), num: '3', step: 'calc', verdict: 'out',
      role: L('asosda yotadi', 'лежит в основании', 'lies in the base'),
      calc: L("o'qqa perpendikulyar", 'перпендикулярен оси', 'perpendicular to the axis'),
      sol: false, inA: false, inB: false,
    },
    {
      id: 'q2', label: L('balandlik', 'высота', 'height'), num: '4', step: 'calc', verdict: 'out',
      role: L("o'q bo'ylab", 'вдоль оси', 'along the axis'),
      calc: L('uchdan asosgacha', 'от вершины до основания', 'apex to base'),
      sol: false, inA: false, inB: false,
    },
    {
      id: 'q3', label: L('yasovchi', 'образующая', 'generator'), num: '5', step: 'calc', verdict: 'in',
      role: L('sirt bo\'ylab', 'по поверхности', 'along the surface'),
      calc: '√(9 + 16) = 5',
      sol: true, inA: false, inB: true,
    },
  ],
  probe: {
    question: L("Nega 7 emas?", 'Почему не 7?', 'Why not 7?'),
    items: [
      {
        id: 'b', label: L('gipotenuza yig\'indidan kichik', 'гипотенуза меньше суммы катетов', 'the hypotenuse is less than the sum'), correct: true,
        ok: L(
          "To'g'ri. Yetti bo'lishi uchun uchburchak yoyilib chiziqqa aylanishi kerak edi. Pifagorda kvadratlar qo'shiladi, uzunliklar emas.",
          'Верно. Чтобы вышло семь, треугольник должен был бы распрямиться в линию. У Пифагора складываются квадраты, а не длины.',
          'Correct. To get seven the triangle would have to straighten into a line. Pythagoras adds squares, not lengths.',
        ),
      },
      {
        id: 'a', label: L('yasovchi radiusga teng', 'образующая равна радиусу', 'the generator equals the radius'),
        hint: L("Teng emas: u gipotenuza, ya'ni har bir katetdan uzunroq.", 'Не равна: это гипотенуза, она длиннее каждого катета.', 'Not equal: it is the hypotenuse, longer than each leg.'),
      },
      {
        id: 'c', label: L('balandlik yasovchidan uzun', 'высота длиннее образующей', 'the height is longer'),
        hint: L("Aksincha: to'rt beshdan kichik.", 'Наоборот: четыре меньше пяти.', 'The other way: four is less than five.'),
      },
      {
        id: 'd', label: L("hisoblashda xato", 'ошибка в вычислении', 'a computation slip'),
        hint: L("Hisob to'g'ri: to'qqiz plyus o'n olti yigirma besh, ildizi besh. Xato usulda.", 'Вычисление верно: девять плюс шестнадцать двадцать пять, корень пять. Ошибка в способе.', 'The computation is right: nine plus sixteen is twenty five, root five. The method is the error.'),
      },
    ],
  },
  holds: [2500, 4500, 1500, 2500, 9500, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Endi konusdagi uzunliklarni ajratamiz.', 'Опора восстановлена. Теперь разведём длины в конусе.', 'The basics are back. Now let us separate the lengths in a cone.'),
    A('mount', "Konusda uchta uzunlik bor va ular uch xil yo'nalishda yotadi. Har birini alohida ko'rib chiqamiz.", 'В конусе три длины, и они лежат в трёх разных направлениях. Разберём каждую отдельно.', 'A cone has three lengths lying in three different directions. Let us take each separately.'),
    A('mount', "Qaysi uzunlikdan boshlashni tanlang.", 'Выбери, с какой длины начать.', 'Choose which length to start with.'),
    A('calc', 'Ko\'ramiz.', 'Смотрим.', 'We look.'),
    A('mark', "Mana uchalasi. Radius asosda yotadi, balandlik o'q bo'ylab ketadi, yasovchi esa sirt bo'ylab uchdan asos chetigacha boradi. Radius va balandlik katetlar, yasovchi gipotenuza. Shuning uchun u besh, yetti emas. Yetti bo'lishi uchun burchak yoyilib, uchburchak chiziqqa aylanishi kerak edi.", 'Вот все три. Радиус лежит в основании, высота идёт по оси, а образующая по поверхности от вершины до края основания. Радиус и высота это катеты, образующая гипотенуза. Поэтому она пять, а не семь. Чтобы вышло семь, угол должен был бы распрямиться и треугольник стал бы линией.', 'Here are all three. The radius lies in the base, the height runs along the axis, and the generator goes along the surface from apex to base edge. The radius and height are the legs, the generator the hypotenuse. So it is five, not seven. Seven would need the angle to straighten and the triangle to become a line.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: UCHBURCHAK AYLANADI.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'slant_vs_height',
  eyebrow: L('Aylantiramiz', 'Вращаем', 'Let us spin it'),
  title: L('Uchburchakdan konus', 'Из треугольника конус', 'A cone from a triangle'),
  chip: 'r = 3,  h = 4,  l = 5',
  solid: {
    fn: CONE,
    a: 0,
    b: 4,
    xDomain: [-0.5, 4.5],
    yDomain: [-3.4, 3.4],
    interactive: true,
    height: 152,
    caption: L('jismni barmoq bilan burish mumkin', 'тело можно повернуть пальцем', 'you can turn the solid with a finger'),
  },
  spinSteps: 3,
  bonus: L(
    "To'g'ri burchakli uchburchak katet atrofida aylandi. Ikkinchi katet asos radiusini chizdi, gipotenuza esa yon sirtni supurdi. Shuning uchun yasovchi gipotenuza bo'ladi.",
    'Прямоугольный треугольник обошёл круг вокруг катета. Второй катет прочертил радиус основания, а гипотенуза заметала боковую поверхность. Поэтому образующая и есть гипотенуза.',
    'A right triangle went round about one leg. The other leg drew the base radius, and the hypotenuse swept the side surface. That is why the generator is the hypotenuse.',
  ),
  probe: {
    question: L("Yon sirtni nima supuradi?", 'Что заметает боковую поверхность?', 'What sweeps the side surface?'),
    items: [
      { id: 'a', label: L('gipotenuza', 'гипотенуза', 'the hypotenuse'), correct: true },
      { id: 'b', label: L("o'qdagi katet", 'катет на оси', 'the leg on the axis'), hint: L("U joyidan qimirlamaydi: o'qning o'zi.", 'Он не двигается: это сама ось.', 'It does not move: it is the axis itself.') },
      { id: 'c', label: L('ikkinchi katet', 'второй катет', 'the other leg'), hint: L("U asosni chizadi, yon sirtni emas.", 'Он чертит основание, а не боковую поверхность.', 'It draws the base, not the side surface.') },
      { id: 'd', label: L('uchala tomon ham', 'все три стороны', 'all three sides'), hint: L("O'qdagi tomon qimirlamaydi, demak uchtasi emas.", 'Сторона на оси не двигается, значит не все три.', 'The side on the axis does not move, so not all three.') },
    ],
  },
  holds: [4500, 2900, 1700, 6500],
  audio: [
    A('mount', "Uzunliklar ajratildi. Endi jism qanday paydo bo'lishini ko'ramiz.", 'Длины разведены. Теперь увидим, как появляется тело.', 'The lengths are separated. Now let us see how the solid appears.'),
    A('one', "Uchburchak katet atrofida burila boshladi.", 'Треугольник начал поворот вокруг катета.', 'The triangle has begun turning about a leg.'),
    A('two', "Yarim aylanish.", 'Половина оборота.', 'Half a turn.'),
    A('three', "To'liq aylanish, konus tayyor. Endi uni barmoq bilan burib ko'ring. Diqqat qiling: uchidan asosgacha boradigan har qanday to'g'ri chiziq bir xil uzunlikda, va bu yasovchi. Balandlik esa jismning ichida, o'q bo'ylab yotadi, va uni sirtda ko'rib bo'lmaydi.", 'Полный оборот, конус готов. Теперь поверни его пальцем. Обрати внимание: любая прямая от вершины до основания имеет одну и ту же длину, и это образующая. А высота лежит внутри тела, вдоль оси, и на поверхности её не видно.', 'A full turn, the cone is ready. Now turn it with a finger. Notice: every straight line from apex to base has the same length, and that is the generator. The height lies inside the solid along the axis, and it is not visible on the surface.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'slant_vs_height',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Uchta uzunlik, bitta bog\'lanish', 'Три длины, одна связь', 'Three lengths, one link'),
  rows: ['l² = r² + h²', '25 = 9 + 16'],
  probe: {
    question: L(
      "r = 6, l = 10 bo'lsa, balandlik?",
      'Высота при r = 6, l = 10?',
      'The height with r = 6, l = 10?',
    ),
    items: [
      { id: 'a', label: '8', correct: true },
      { id: 'b', label: '4', hint: L("Bu ayirma. Kvadratlar ayiriladi: yuz minus o'ttiz olti, oltmish to'rt, ildizi sakkiz.", 'Это разность. Вычитаются квадраты: сто минус тридцать шесть, шестьдесят четыре, корень восемь.', 'That is the difference. Squares subtract: a hundred minus thirty six is sixty four, root eight.') },
      { id: 'c', label: '16', hint: L("Bu balandlikning kvadrati emas: oltmish to'rt. Ildiz olish kerak.", 'Это не квадрат высоты: он шестьдесят четыре. Нужен корень.', 'That is not the square of the height: it is sixty four. Take the root.') },
      { id: 'd', label: '64', hint: L("Bu kvadrat. Ildizi sakkiz.", 'Это квадрат. Его корень восемь.', 'That is the square. Its root is eight.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Konus', 'Правило 1. Конус', 'Rule 1. The cone'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'l² = r² + h²',
    lines: [
      L("konus -- to'g'ri burchakli uchburchakning katet atrofida aylanishi", 'конус это вращение прямоугольного треугольника вокруг катета', 'a cone is a right triangle spun about a leg'),
      L("o'qdagi katet balandlik, ikkinchisi radius", 'катет на оси это высота, второй радиус', 'the leg on the axis is the height, the other the radius'),
      L('gipotenuza yasovchi bo\'ladi', 'гипотенуза становится образующей', 'the hypotenuse becomes the generator'),
      L("uchtasi Pifagor bilan bog'langan, qo'shish bilan emas", 'три связаны Пифагором, а не сложением', 'the three are linked by Pythagoras, not by adding'),
    ],
    example: L('misol:  5² = 3² + 4²', 'пример:  5² = 3² + 4²', 'example:  5² = 3² + 4²'),
  },
  holds: [4000, 6500, 4500],
  audio: [
    A('mount', "Jism ko'rildi. Endi bog'lanishni yozamiz.", 'Тело увидели. Теперь запишем связь.', 'We saw the solid. Now let us write the link.'),
    A('def', "Konus bu to'g'ri burchakli uchburchakning katet atrofida aylanishi. O'qdagi katet balandlik bo'ladi, ikkinchisi radius, gipotenuza esa yasovchi. Uchalasi Pifagor teoremasi bilan bog'langan: yasovchining kvadrati radius va balandlik kvadratlarining yig'indisiga teng.", 'Конус это вращение прямоугольного треугольника вокруг катета. Катет на оси становится высотой, второй радиусом, а гипотенуза образующей. Все три связаны теоремой Пифагора: квадрат образующей равен сумме квадратов радиуса и высоты.', 'A cone is a right triangle spun about a leg. The leg on the axis becomes the height, the other the radius, and the hypotenuse the generator. All three are linked by Pythagoras: the square of the generator equals the squares of radius and height added.'),
    A('rule', "To'g'ri. Va teskari yo'l ham ishlaydi: yasovchi va radius berilsa, balandlik kvadratlar ayirmasidan chiqadi.", 'Верно. И обратный ход работает: зная образующую и радиус, высоту находят через разность квадратов.', 'Correct. And it works backwards: given the generator and radius, the height comes from the difference of squares.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: kesim.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'axial_section',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Konusni kesamiz', 'Режем конус', 'Cutting the cone'),
  was: { label: UI.was, expr: L("silindrda -- to'rtburchak", 'у цилиндра прямоугольник', 'a rectangle for the cylinder') },
  now: { label: UI.now, expr: L("konusning o'q kesimi -- ?", 'осевое сечение конуса — ?', 'the cone axial section — ?') },
  probe1: {
    question: L('Qanday figura chiqadi?', 'Какая фигура получится?', 'What figure appears?'),
    items: [
      { id: 'a', label: L('teng yonli uchburchak', 'равнобедренный треугольник', 'an isosceles triangle'), correct: true },
      { id: 'b', label: L("to'rtburchak", 'прямоугольник', 'a rectangle'), hint: L("To'rtburchak silindrda edi: u yerda yon tomonlar parallel.", 'Прямоугольник был у цилиндра: там боковые стороны параллельны.', 'The rectangle belonged to the cylinder: its sides are parallel.') },
      { id: 'c', label: L('to\'g\'ri burchakli uchburchak', 'прямоугольный треугольник', 'a right triangle'), hint: L("To'g'ri burchakli faqat yarmi. Tekislik o'qdan o'tib, ikkala yarmini ham oladi.", 'Прямоугольный это лишь половина. Плоскость проходит через ось и берёт обе половины.', 'A right triangle is only half. The plane passes through the axis and takes both halves.') },
      { id: 'd', label: L('doira', 'круг', 'a circle'), hint: L("Doira ko'ndalang kesimda chiqadi.", 'Круг даёт сечение поперёк оси.', 'A circle comes from the cut across the axis.') },
    ],
  },
  probe2: {
    cols: 4,
    question: L('Uning yuzasi qancha?', 'Чему равна его площадь?', 'What is its area?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '12' },
      { id: 'b', label: '24' },
      { id: 'c', label: '15' },
      { id: 'd', label: '10' },
    ],
  },
  holds: [4500, 6000, 2100, 3000],
  audio: [
    A('mount', "Silindrni o'q bo'ylab kesganda to'rtburchak chiqqan edi: yon tomonlari parallel.", 'Когда мы резали цилиндр вдоль оси, выходил прямоугольник: его боковые стороны параллельны.', 'When we cut the cylinder along the axis, a rectangle came out: its sides are parallel.'),
    A('now', "Konusda esa yon tomonlar uchda uchrashadi. Tekislikni yana o'q bo'ylab yuritamiz.", 'А у конуса боковые стороны сходятся в вершине. Проведём плоскость снова вдоль оси.', 'In a cone the sides meet at the apex. Let us run the plane along the axis again.'),
    A('q1', "Qanday figura chiqadi?", 'Какая фигура получится?', 'What figure appears?'),
    A('q2', "Sizningcha uning yuzasi qancha? Asosi olti, balandligi to'rt. Shunchaki taxmin qiling.", 'Как думаешь, чему равна его площадь? Основание шесть, высота четыре. Просто предположи.', 'What do you think its area is? Base six, height four. Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'axial_section',
  eyebrow: L('Ikkalasini tekshiramiz', 'Проверим оба', 'Let us check both'),
  title: L('Ikki nomzod', 'Два кандидата', 'Two candidates'),
  expr: L("o'q kesimi:  asos 6,  balandlik 4", 'осевое сечение: основание 6, высота 4', 'axial section: base 6, height 4'),
  need: '= ?',
  answerLabel: L('yuzasi', 'площадь', 'the area'),
  cards: [
    {
      tag: L('A nomzod', 'кандидат A', 'candidate A'),
      txt: '6 · 4 = 24',
      point: {
        label: L("to'rtburchakdek", 'как у прямоугольника', 'as for a rectangle'),
        calc: L('yarmi ortiqcha   ✗', 'лишняя половина   ✗', 'half too much   ✗'),
        verdict: 'out',
      },
    },
    {
      tag: L('B nomzod', 'кандидат B', 'candidate B'),
      txt: '6 · 4 / 2 = 12',
      point: {
        label: L('uchburchak', 'треугольник', 'a triangle'),
        calc: L('asos karra balandlik, ikkiga   ✓', 'основание на высоту, пополам   ✓', 'base times height, halved   ✓'),
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['12', '24', '15', '10'],
    value: ['12'],
    label: L('yuzasi =', 'площадь =', 'area ='),
    prompt: L('Yuzani yozing', 'Запиши площадь', 'Write the area'),
    wrongs: [
      { key: '24', hint: L("Bu to'rtburchakning yuzasi. Bizda uchburchak, demak ikkiga bo'linadi.", 'Это площадь прямоугольника. У нас треугольник, значит делим на два.', 'That is a rectangle area. Ours is a triangle, so halve it.') },
      { key: '15', hint: L("Bu yasovchi karra uch. Yuzada balandlik ishlatiladi, yasovchi emas.", 'Это образующая на три. В площади участвует высота, а не образующая.', 'That is the generator times three. The area uses the height, not the generator.') },
      { key: '*', hint: L("Olti karra to'rt bo'lingan ikki.", 'Шесть на четыре пополам.', 'Six times four, halved.') },
    ],
  },
  holds: [3500, 5500, 5500, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi ikkala nomzodni ham tekshiramiz.', 'Прогноз есть. Теперь проверим обоих кандидатов.', 'The guess is made. Now let us check both candidates.'),
    A('p1', "Birinchi nomzod asosni balandlikka ko'paytirdi va yigirma to'rt oldi. Lekin bu to'rtburchakning yuzasi. Kesimimiz uchburchak, va u to'rtburchakning yarmini egallaydi.", 'Первый кандидат умножил основание на высоту и получил двадцать четыре. Но это площадь прямоугольника. А наше сечение треугольник, и он занимает половину прямоугольника.', 'The first candidate multiplied base by height and got twenty four. But that is a rectangle area. Our section is a triangle, and it fills half of that rectangle.'),
    A('p2', "Ikkinchi nomzod ikkiga bo'ldi: o'n ikki. Va yana bir narsaga e'tibor bering: yuzada BALANDLIK ishlatildi, yasovchi emas. Yasovchi keyingi darsda, sirt yuzasida kerak bo'ladi.", 'Второй кандидат поделил на два: двенадцать. И обрати внимание ещё на одно: в площади участвовала ВЫСОТА, а не образующая. Образующая понадобится на следующем уроке, в площади поверхности.', 'The second candidate halved it: twelve. And note one more thing: the area used the HEIGHT, not the generator. The generator will be needed next lesson, in the surface area.'),
    A('write', "Yuzani yozing.", 'Запиши площадь.', 'Write the area.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2: KESIMLAR.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'axial_section',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Ikki xil kesim', 'Два вида сечения', 'Two kinds of section'),
  cases: [
    {
      label: L("o'q bo'ylab", 'вдоль оси', 'along the axis'),
      text: L('teng yonli uchburchak', 'равнобедренный треугольник', 'an isosceles triangle'),
      tone: 'graph',
    },
    {
      label: L('asosga parallel', 'параллельно основанию', 'parallel to the base'),
      text: L('kichikroq doira', 'круг поменьше', 'a smaller circle'),
      tone: 'accent',
    },
  ],
  rows: [
    L("o'q kesimi: asosi 2r, yon tomonlari l", 'осевое: основание 2r, боковые l', 'axial: base 2r, sides l'),
    L('balandlik yarmida: radius 1,5', 'на середине высоты: радиус 1,5', 'at mid height: radius 1,5'),
  ],
  probe: {
    question: L(
      "Balandlikning yarmida radius qancha?",
      'Каков радиус на середине высоты?',
      'What is the radius at mid height?',
    ),
    items: [
      { id: 'a', label: '1,5', correct: true },
      { id: 'b', label: '3', hint: L("Uch bu asosdagi radius. Uchga yaqinlashgan sari doira kichrayadi.", 'Три это радиус у основания. Ближе к вершине круг меньше.', 'Three is the radius at the base. Nearer the apex the circle shrinks.') },
      { id: 'c', label: '2', hint: L("Kamayish tekis: yarmida radius ham yarmi bo'ladi.", 'Убывание равномерное: на середине и радиус половинный.', 'The shrinking is even: at the middle the radius is half.') },
      { id: 'd', label: '2,5', hint: L("Bu yasovchining yarmi, radiusniki emas.", 'Это половина образующей, а не радиуса.', 'That is half the generator, not the radius.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Kesimlar', 'Правило 2. Сечения', 'Rule 2. Sections'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L("o'q bo'ylab uchburchak, ko'ndalang doira", 'вдоль оси треугольник, поперёк круг', 'a triangle along, a circle across'),
    lines: [
      L("o'q kesimi teng yonli: yon tomonlari yasovchilar", 'осевое равнобедренное: боковые это образующие', 'the axial one is isosceles: the sides are generators'),
      L('uning balandligi konus balandligi', 'его высота это высота конуса', 'its height is the cone height'),
      L('asosga parallel kesim -- doira, radiusi kamayadi', 'сечение параллельно основанию это круг, радиус убывает', 'a section parallel to the base is a circle with shrinking radius'),
      L('uchga yaqinlashganda radius nolga intiladi', 'у вершины радиус стремится к нулю', 'at the apex the radius tends to zero'),
    ],
    example: L('misol:  yuzasi 6 · 4 / 2 = 12', 'пример:  площадь 6 · 4 / 2 = 12', 'example:  area 6 · 4 / 2 = 12'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('balandlik ichkarida, yasovchi sirtda', 'высота внутри, образующая на поверхности', 'the height inside, the generator on the surface'),
    lines: [
      L('1. radius va balandlik -- katetlar', '1. радиус и высота это катеты', '1. the radius and height are the legs'),
      L('2. yasovchi -- gipotenuza', '2. образующая это гипотенуза', '2. the generator is the hypotenuse'),
      L("3. yuzada balandlik, sirtda yasovchi", '3. в площади высота, в поверхности образующая', '3. height for area, generator for surface'),
      L("4. qo'shmang: kvadratlar qo'shiladi", '4. не складывай: складываются квадраты', '4. do not add: the squares add'),
    ],
  },
  holds: [4000, 6500, 2900, 3700],
  audio: [
    A('mount', 'Kesim topildi. Endi ikkala kesimni ham yozamiz.', 'Сечение найдено. Теперь запишем оба сечения.', 'The section is found. Now let us write both sections.'),
    A('rows', "O'q bo'ylab kesim teng yonli uchburchak beradi, va uning yon tomonlari yasovchilar. Asosga parallel kesim esa doira beradi, lekin radiusi asosdagidan kichik: uchga qancha yaqin bo'lsa, shuncha kichik. Balandlikning o'rtasida radius ham roppa rosa yarmi bo'ladi.", 'Сечение вдоль оси даёт равнобедренный треугольник, и его боковые стороны это образующие. А сечение параллельно основанию даёт круг, но радиус меньше, чем у основания: чем ближе к вершине, тем меньше. На середине высоты радиус ровно вдвое меньше.', 'The section along the axis gives an isosceles triangle whose sides are generators. A section parallel to the base gives a circle, but with a radius smaller than the base one: the nearer the apex, the smaller. At mid height the radius is exactly half.'),
    A('q', "Savol: balandlikning yarmida radius qancha?", 'Вопрос: каков радиус на середине высоты?', 'The question: what is the radius at mid height?'),
    A('rule', "To'g'ri. Kamayish tekis, chunki yon chiziq to'g'ri.", 'Верно. Убывание равномерное, потому что боковая линия прямая.', 'Correct. The shrinking is even, because the side line is straight.'),
    A('both', 'Endi butun darsni bitta qoidaga yig\'ing.', 'А теперь собери весь урок в одно правило.', 'Now combine the whole lesson into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. AMALNI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'slant_vs_height',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Amalni qo\'ying', 'Поставь действие', 'Place the operation'),
  left: L('yasovchi: r = 6, h = 8', 'образующая: r = 6, h = 8', 'the generator: r = 6, h = 8'),
  template: ['l² = 36 ', { slot: 0 }, ' 64'],
  signs: ['+', '−'],
  answer: '+',
  checkNote: L(
    "Gipotenuza qidirilyapti: kvadratlar QO'SHILADI",
    'Ищем гипотенузу: квадраты СКЛАДЫВАЮТСЯ',
    'We are after the hypotenuse: the squares ADD',
  ),
  wrongs: [
    { key: '−', hint: L("Ayirish katet qidirilganda ishlatiladi. Bu yerda gipotenuza kerak, u ikkalasidan ham uzun.", 'Вычитание нужно, когда ищут катет. Здесь нужна гипотенуза, она длиннее обоих.', 'Subtracting is for finding a leg. Here we need the hypotenuse, longer than both.') },
  ],
  probe: {
    question: L("Qachon ayiriladi?", 'Когда вычитают?', 'When do we subtract?'),
    items: [
      { id: 'a', label: L('katet qidirilganda', 'когда ищут катет', 'when a leg is sought'), correct: true },
      { id: 'b', label: L('hech qachon', 'никогда', 'never'), hint: L("Ayiriladi: yasovchi va radius berilsa, balandlik shundan chiqadi.", 'Вычитают: зная образующую и радиус, находят высоту.', 'It happens: given the generator and radius, the height follows.') },
      { id: 'c', label: L('har doim', 'всегда', 'always'), hint: L("Har doim emas: gipotenuzada qo'shiladi.", 'Не всегда: для гипотенузы складывают.', 'Not always: for the hypotenuse we add.') },
      { id: 'd', label: L("sonlar katta bo'lsa", 'если числа большие', 'with large numbers'), hint: L("Sonlarning kattaligi amalni tanlamaydi.", 'Величина чисел действие не выбирает.', 'The size of the numbers does not choose the operation.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Amalni qo'ying.", 'Поставь действие.', 'Place the operation.'),
    A('checked', "Bo'ldi. Endi ta'riflang: qachon ayiriladi?", 'Получилось. Теперь сформулируй: когда вычитают?', 'Done. Now put it into words: when do we subtract?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'sq', label: L('kvadratlarni yozish', 'записать квадраты', 'write the squares') },
  { id: 'sum', label: L("qo'shish", 'сложить', 'add') },
  { id: 'sub', label: L('ayirish', 'вычесть', 'subtract') },
  { id: 'root', label: L('ildiz olish', 'извлечь корень', 'take the root') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'slant_vs_height',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: L('r = 6, l = 10. Balandlik?', 'r = 6, l = 10. Высота?', 'r = 6, l = 10. The height?'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'sq',
      to: '100  va  36',
      wrongs: [
        { action: 'sub', hint: L("Avval kvadratlarni yozing: ayiriladigan narsa kerak.", 'Сначала запиши квадраты: нужно, что вычитать.', 'Write the squares first: you need something to subtract.') },
        { action: 'sum', hint: L("Qo'shish gipotenuzaga. Bu yerda u berilgan.", 'Сложение для гипотенузы. Здесь она дана.', 'Adding is for the hypotenuse. Here it is given.') },
        { action: 'root', hint: L("Ildiz oxirida.", 'Корень в конце.', 'The root comes last.') },
      ],
    },
    {
      action: 'sub',
      to: '100 − 36 = 64',
      wrongs: [
        { action: 'sq', hint: L("Yozilgan: yuz va o'ttiz olti.", 'Записано: сто и тридцать шесть.', 'Written: a hundred and thirty six.') },
        { action: 'sum', hint: L("Qo'shsak yuz o'ttiz olti chiqadi, va bu gipotenuzaning kvadratidan katta.", 'Сложение даст сто тридцать шесть, а это больше квадрата гипотенузы.', 'Adding gives a hundred thirty six, more than the hypotenuse squared.') },
        { action: 'root', hint: L("Avval ayiring.", 'Сначала вычти.', 'Subtract first.') },
      ],
    },
    {
      action: 'root',
      to: '√64 = 8',
      wrongs: [
        { action: 'sq', hint: L("Kvadratlar yozilgan.", 'Квадраты записаны.', 'The squares are written.') },
        { action: 'sub', hint: L("Ayirilgan: oltmish to'rt.", 'Вычтено: шестьдесят четыре.', 'Subtracted: sixty four.') },
        { action: 'sum', hint: L("Qo'shish bu yerda kerak emas.", 'Сложение здесь не нужно.', 'No adding is needed here.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['8', '64', '4', '16'],
    value: ['8'],
    label: 'h =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '64', hint: L("Bu balandlikning kvadrati. Ildiz olish qolgan.", 'Это квадрат высоты. Осталось извлечь корень.', 'That is the height squared. The root is still to be taken.') },
      { key: '4', hint: L("Bu o'n minus olti. Kvadratlar ayiriladi, uzunliklar emas.", 'Это десять минус шесть. Вычитаются квадраты, а не длины.', 'That is ten minus six. Squares subtract, not lengths.') },
      { key: '*', hint: L("Oltmish to'rtning ildizi.", 'Корень из шестидесяти четырёх.', 'The root of sixty four.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi teskari masalani o\'tamiz.', 'Правило сформулировано. Пройдём обратную задачу.', 'The rule is stated. Let us work the reverse problem.'),
    A('start', "Bu safar yasovchi berilgan, balandlik esa noma'lum. Diqqat: ro'yxatda ortiqcha amal bor.", 'На этот раз дана образующая, а высота неизвестна. Внимание: в списке есть лишнее действие.', 'This time the generator is given and the height unknown. Careful: the list has one superfluous action.'),
    A('step4', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'axial_section',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Kesim yuzasi', 'Площадь сечения', 'The area of the section'),
  start: L('r = 5, h = 12. O\'q kesimi?', 'r = 5, h = 12. Осевое сечение?', 'r = 5, h = 12. The axial section?'),
  actions: ACTIONS_10,
  hint: L(
    "Kesim uchburchak: asosi 2r, balandligi h.",
    'Сечение треугольник: основание 2r, высота h.',
    'The section is a triangle: base 2r, height h.',
  ),
  steps: [
    {
      action: 'sq',
      to: L('asos 10,  balandlik 12', 'основание 10, высота 12', 'base 10, height 12'),
      wrongs: [
        { action: 'sum', hint: L("Avval kesimning tomonlarini yozing.", 'Сначала запиши стороны сечения.', 'Write the sides of the section first.') },
        { action: 'sub', hint: L("Ayirish bu yerda kerak emas.", 'Вычитание здесь не нужно.', 'No subtracting is needed here.') },
        { action: 'root', hint: L("Ildiz yasovchini topishga kerak, yuzaga emas.", 'Корень нужен для образующей, а не для площади.', 'The root is for the generator, not for the area.') },
      ],
    },
    {
      action: 'sum',
      to: '10 · 12 / 2 = 60',
      wrongs: [
        { action: 'sq', hint: L("Yozilgan: o'n va o'n ikki.", 'Записано: десять и двенадцать.', 'Written: ten and twelve.') },
        { action: 'sub', hint: L("Ayirish kerak emas.", 'Вычитание не нужно.', 'No subtracting needed.') },
        { action: 'root', hint: L("Ildiz kerak emas: yuzada faqat asos va balandlik.", 'Корень не нужен: в площади только основание и высота.', 'No root: the area uses only base and height.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['60', '120', '30', '65'],
    value: ['60'],
    label: 'S =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '120', hint: L("Ikkiga bo'lish unutilgan: bu uchburchak.", 'Забыли поделить на два: это треугольник.', 'The halving was forgotten: it is a triangle.') },
      { key: '30', hint: L("Asos ikki r, ya'ni o'n, besh emas.", 'Основание два эр, то есть десять, а не пять.', 'The base is two r, that is ten, not five.') },
      { key: '65', hint: L("Bu yasovchi bilan sanalgan. Yuzada balandlik ishlatiladi.", 'Это посчитано с образующей. В площади участвует высота.', 'That used the generator. The area uses the height.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Radius besh, balandlik o'n ikki. Diqqat: kesimning asosi radiusga emas, DIAMETRga teng.", 'Радиус пять, высота двенадцать. Внимание: основание сечения равно не радиусу, а ДИАМЕТРУ.', 'Radius five, height twelve. Careful: the base of the section equals the DIAMETER, not the radius.'),
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
      id: 'b1', tag: 'slant_vs_height', ask: true, cols: 4,
      done: 'l = 5',
      prompt: L('r = 3, h = 4. Yasovchi?', 'r = 3, h = 4. Образующая?', 'r = 3, h = 4. The generator?'),
      items: [
        { id: 'a', label: '5', correct: true },
        { id: 'b', label: '7', hint: L("Bu yig'indi. Kvadratlar qo'shiladi.", 'Это сумма. Складываются квадраты.', 'That is the sum. The squares add.') },
        { id: 'c', label: '25', hint: L("Bu kvadrat, ildizi besh.", 'Это квадрат, его корень пять.', 'That is the square, its root is five.') },
        { id: 'd', label: '1', hint: L("Bu ayirma. Ayirma katet qidirilganda ishlatiladi.", 'Это разность. Разность нужна, когда ищут катет.', 'That is the difference. It is for finding a leg.') },
      ],
    },
    {
      id: 'b2', tag: 'slant_vs_height', ask: true, cols: 4,
      done: 'h = 8',
      prompt: L('r = 6, l = 10. Balandlik?', 'r = 6, l = 10. Высота?', 'r = 6, l = 10. The height?'),
      items: [
        { id: 'a', label: '8', correct: true },
        { id: 'b', label: '4', hint: L("Bu uzunliklarning ayirmasi. Kvadratlar ayiriladi.", 'Это разность длин. Вычитаются квадраты.', 'That is the difference of lengths. Squares subtract.') },
        { id: 'c', label: '16', hint: L("Bu ham emas: yuz minus o'ttiz olti oltmish to'rt.", 'И не это: сто минус тридцать шесть шестьдесят четыре.', 'Not that either: a hundred minus thirty six is sixty four.') },
        { id: 'd', label: '64', hint: L("Bu kvadrat, ildizi sakkiz.", 'Это квадрат, его корень восемь.', 'That is the square, its root is eight.') },
      ],
    },
    {
      id: 'b3', tag: 'axial_section', ask: true, cols: 2,
      done: L('teng yonli uchburchak', 'равнобедренный треугольник', 'an isosceles triangle'),
      prompt: L("Konusning o'q kesimi?", 'Осевое сечение конуса?', 'The axial section of a cone?'),
      items: [
        { id: 'a', label: L('teng yonli uchburchak', 'равнобедренный треугольник', 'an isosceles triangle'), correct: true },
        { id: 'b', label: L("to'rtburchak", 'прямоугольник', 'a rectangle'), hint: L("To'rtburchak silindrniki.", 'Прямоугольник у цилиндра.', 'The rectangle belongs to the cylinder.') },
        { id: 'c', label: L('doira', 'круг', 'a circle'), hint: L("Doira ko'ndalang kesimda.", 'Круг в сечении поперёк оси.', 'The circle is in the cut across the axis.') },
        { id: 'd', label: L('kvadrat', 'квадрат', 'a square'), hint: L("Kvadrat silindrda uchraydi, konusda uchburchak.", 'Квадрат встречается у цилиндра, у конуса треугольник.', 'A square happens with a cylinder; a cone gives a triangle.') },
      ],
    },
    {
      id: 'b4', tag: 'axial_section', ask: true, cols: 4,
      done: 'S = 12',
      prompt: L('r = 3, h = 4. Kesim yuzasi?', 'r = 3, h = 4. Площадь сечения?', 'r = 3, h = 4. The section area?'),
      items: [
        { id: 'a', label: '12', correct: true },
        { id: 'b', label: '24', hint: L("Ikkiga bo'lish unutilgan.", 'Забыли поделить на два.', 'The halving was forgotten.') },
        { id: 'c', label: '6', hint: L("Asos ikki r, ya'ni olti, uch emas.", 'Основание два эр, то есть шесть, а не три.', 'The base is two r, six, not three.') },
        { id: 'd', label: '15', hint: L("Bu yasovchi bilan. Yuzada balandlik.", 'Это с образующей. В площади высота.', 'That used the generator. The area uses the height.') },
      ],
    },
    {
      id: 'b5', tag: 'slant_vs_height', ask: true, cols: 2,
      done: L('yasovchi uzunroq', 'образующая длиннее', 'the generator is longer'),
      prompt: L(
        "Yasovchi va balandlik: qaysi biri uzunroq?",
        'Образующая и высота: что длиннее?',
        'The generator and the height: which is longer?',
      ),
      items: [
        { id: 'a', label: L('yasovchi', 'образующая', 'the generator'), correct: true },
        { id: 'b', label: L('balandlik', 'высота', 'the height'), hint: L("Balandlik katet, yasovchi gipotenuza: gipotenuza uzunroq.", 'Высота катет, образующая гипотенуза: гипотенуза длиннее.', 'The height is a leg, the generator the hypotenuse: the hypotenuse is longer.') },
        { id: 'c', label: L('teng', 'равны', 'equal'), hint: L("Teng bo'lishi uchun radius nol bo'lishi kerak, ya'ni konus yo'q.", 'Равны они были бы при нулевом радиусе, то есть конуса нет.', 'They would be equal only at zero radius, that is no cone at all.') },
        { id: 'd', label: L("shartga bog'liq", 'зависит от условия', 'depends'), hint: L("Bog'liq emas: gipotenuza har doim uzunroq.", 'Не зависит: гипотенуза всегда длиннее.', 'It does not: the hypotenuse is always longer.') },
      ],
    },
    {
      id: 'b6', tag: 'axial_section', ask: true, cols: 4,
      done: 'r = 1,5',
      prompt: L("Balandlik yarmida radius? (r = 3)", 'Радиус на середине высоты? (r = 3)', 'The radius at mid height? (r = 3)'),
      items: [
        { id: 'a', label: '1,5', correct: true },
        { id: 'b', label: '3', hint: L("Uch bu asosda. Yuqorida doira kichrayadi.", 'Три это у основания. Выше круг меньше.', 'Three is at the base. Higher up the circle shrinks.') },
        { id: 'c', label: '2', hint: L("Kamayish tekis: yarmida yarmi.", 'Убывание равномерное: на середине половина.', 'The shrinking is even: half at the middle.') },
        { id: 'd', label: '0', hint: L("Nol faqat uchda.", 'Ноль только в вершине.', 'Zero only at the apex.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Endi teskarisi.", 'Теперь обратное.', 'Now the reverse.'),
    A('q3', "Kesim shakli.", 'Форма сечения.', 'The shape of the section.'),
    A('q4', "Kesim yuzasi.", 'Площадь сечения.', 'The area of the section.'),
    A('q5', "Solishtirish.", 'Сравнение.', 'A comparison.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'slant_vs_height',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Yasovchi balandlik o\'rniga qo\'yilgan', 'Образующую поставили вместо высоты', 'The generator replaced the height'),
  rows: [
    { id: 'r1', text: 'r = 3,  l = 5' },
    { id: 'r2', text: L("o'q kesimi: asos 6", 'осевое сечение: основание 6', 'axial section: base 6') },
    { id: 'r3', text: L('yuzasi: 6 · 5 / 2 = 15', 'площадь: 6 · 5 / 2 = 15', 'area: 6 · 5 / 2 = 15') },
    { id: 'r4', text: L('javob: 15', 'ответ: 15', 'answer: 15') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Asos to'g'ri: ikki r, ya'ni olti.", 'Основание верно: два эр, то есть шесть.', 'The base is right: two r, that is six.'),
    r4: L("Javob xato, lekin u oldingi satrda xato bo'lgan.", 'Ответ неверный, но неверным он стал строкой раньше.', 'The answer is wrong, but it became wrong one line earlier.'),
  },
  proofPoint: L('yuzada balandlik turadi', 'в площади стоит высота', 'the area takes the height'),
  proof: L(
    "Uchburchak yuzasida asos va unga tushirilgan BALANDLIK ishlatiladi. Bu yerda balandlik o'rniga yasovchi qo'yilgan. Balandlikni topamiz: besh kvadrat minus uch kvadrat, yigirma besh minus to'qqiz, o'n olti, ildizi to'rt. Demak yuza olti karra to'rt bo'lingan ikki, ya'ni o'n ikki.",
    'В площади треугольника участвуют основание и опущенная на него ВЫСОТА. Здесь вместо высоты подставили образующую. Найдём высоту: пять в квадрате минус три в квадрате, двадцать пять минус девять, шестнадцать, корень четыре. Значит площадь шесть на четыре пополам, то есть двенадцать.',
    'A triangle area uses the base and the HEIGHT dropped onto it. Here the generator was put in place of the height. Let us find the height: five squared minus three squared, twenty five minus nine, sixteen, root four. So the area is six times four halved, that is twelve.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('balandlik o\'rniga yasovchi', 'вместо высоты образующая', 'the generator instead of the height'), correct: true },
      { id: 'b', label: L("asos noto'g'ri", 'неверное основание', 'the base is wrong'), hint: L("Asos to'g'ri: ikki r olti.", 'Основание верно: два эр шесть.', 'The base is right: two r is six.') },
      { id: 'c', label: L("ikkiga bo'lish ortiqcha", 'деление на два лишнее', 'the halving is unnecessary'), hint: L("Kerak: kesim uchburchak.", 'Нужно: сечение треугольник.', 'It is needed: the section is a triangle.') },
      { id: 'd', label: L("arifmetikada xato", 'ошибка в арифметике', 'an arithmetic slip'), hint: L("Arifmetika to'g'ri: olti karra besh bo'lingan ikki o'n besh. Xato tanlovda.", 'Арифметика верна: шесть на пять пополам пятнадцать. Ошибка в выборе.', 'The arithmetic is right: six times five halved is fifteen. The choice is the error.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda arifmetika to'g'ri, lekin javob xato. Xato birinchi marta paydo bo'lgan satrni toping.", 'Здесь арифметика верна, а ответ неверный. Найди строку, в которой ошибка появилась впервые.', 'Here the arithmetic is right but the answer is wrong. Find the line where the error first appeared.'),
    A('proof', "Qarang: uchburchak yuzasida asos va unga tushirilgan balandlik ishlatiladi, yasovchi emas. Balandlikni Pifagordan topamiz: yigirma besh minus to'qqiz, o'n olti, ildizi to'rt. Yuza esa o'n ikki chiqadi.", 'Смотри: в площади треугольника участвуют основание и опущенная на него высота, а не образующая. Высоту найдём по Пифагору: двадцать пять минус девять, шестнадцать, корень четыре. И площадь выходит двенадцать.', 'Look: a triangle area uses the base and the height dropped onto it, not the generator. Find the height by Pythagoras: twenty five minus nine is sixteen, root four. And the area comes out twelve.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'slant_vs_height',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Yozuvni yig\'ing', 'Собери запись', 'Build the record'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L('qidirilgani gipotenuzami', 'ищем ли гипотенузу', 'is the hypotenuse sought'),
  tasks: [
    {
      prompt: L('r = 3, h = 4. Yasovchi?', 'r = 3, h = 4. Образующая?', 'r = 3, h = 4. The generator?'),
      template: ['l² = 9 ', { slot: 0 }, ' 16 = ', { slot: 1 }],
      parts: ['+', '−', '25', '7'],
      answer: ['+', '25'],
      doneLabel: 'l = 5',
      wrongs: [
        { key: '−|7', hint: L("Gipotenuza qidirilyapti: kvadratlar qo'shiladi.", 'Ищем гипотенузу: квадраты складываются.', 'The hypotenuse is sought: the squares add.') },
        { key: '*', hint: L("To'qqiz plyus o'n olti yigirma besh.", 'Девять плюс шестнадцать двадцать пять.', 'Nine plus sixteen is twenty five.') },
      ],
    },
    {
      prompt: L('r = 6, l = 10. Balandlik?', 'r = 6, l = 10. Высота?', 'r = 6, l = 10. The height?'),
      template: ['h² = 100 ', { slot: 0 }, ' 36 = ', { slot: 1 }],
      parts: ['−', '+', '64', '136'],
      answer: ['−', '64'],
      doneLabel: 'h = 8',
      wrongs: [
        { key: '+|136', hint: L("Katet qidirilyapti, u gipotenuzadan kichik: kvadratlar ayiriladi.", 'Ищем катет, он меньше гипотенузы: квадраты вычитаются.', 'A leg is sought, smaller than the hypotenuse: the squares subtract.') },
        { key: '*', hint: L("Yuz minus o'ttiz olti oltmish to'rt.", 'Сто минус тридцать шесть шестьдесят четыре.', 'A hundred minus thirty six is sixty four.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi, va u yerda amal boshqa bo'ladi.", 'А теперь второе, и там действие будет другим.', 'And now the second, where the operation differs.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'slant_vs_height',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: 'l² = r² + h²',
  ruleLines: [
    L("konus -- uchburchakning katet atrofida aylanishi", 'конус это вращение треугольника вокруг катета', 'a cone is a triangle spun about a leg'),
    L('balandlik ichkarida, yasovchi sirtda', 'высота внутри, образующая на поверхности', 'the height inside, the generator on the surface'),
    L("o'q kesimi -- teng yonli uchburchak", 'осевое сечение равнобедренный треугольник', 'the axial section is an isosceles triangle'),
  ],
  predicts: [
    {
      screen: 0,
      expr: 'r = 3,  h = 4',
      right: '5',
      map: { a: '7', b: '5', both: '12', none: '25' },
    },
    {
      screen: 5,
      expr: L('kesim yuzasi', 'площадь сечения', 'the section area'),
      right: '12',
      map: { a: '12', b: '24', c: '15', d: '10' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '5  ≠  7',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Uch uzunlik ekraniga qayting', 'Вернись к экрану с тремя длинами', 'Go back to the three lengths screen'),
  },
  probe: {
    question: L(
      "Masalada yasovchi berilgan. Yuzani sanashdan oldin nima kerak?",
      'В задаче дана образующая. Что нужно перед счётом площади?',
      'A problem gives the generator. What is needed before the area?',
    ),
    items: [
      { id: 'a', label: L('balandlikni topish', 'найти высоту', 'find the height'), correct: true },
      { id: 'b', label: L('darrov ko\'paytirish', 'сразу умножать', 'multiply at once'), hint: L("Aynan shu xato o'n beshni bergan edi.", 'Именно эта ошибка и дала пятнадцать.', 'That very mistake gave fifteen.') },
      { id: 'c', label: L('radiusni ikkilash', 'удвоить радиус', 'double the radius'), hint: L("Bu kerak, lekin asos uchun. Balandlik baribir yetishmaydi.", 'Это нужно, но для основания. Высоты всё равно не хватает.', 'That is needed, but for the base. The height is still missing.') },
      { id: 'd', label: L('hech narsa', 'ничего', 'nothing'), hint: L("Kerak: yuzada balandlik turadi, va u berilmagan.", 'Нужно: в площади стоит высота, а её не дали.', 'Something is: the area needs the height, and it was not given.') },
    ],
  },
  sheetTitle: L('Konus · shpargalka', 'Конус · шпаргалка', 'The cone · cheat sheet'),
  sheetSrc: L('11-sinf · 28-dars', '11 класс · урок 28', 'Grade 11 · lesson 28'),
  lifehack: L(
    "Konus masalasida birinchi ish: uchta uzunlikdan qaysi biri berilganini belgilang.",
    'В задаче про конус первое дело: отметь, какие из трёх длин даны.',
    'In a cone problem the first move: mark which of the three lengths are given.',
  ),
  holds: [2500, 4900, 7500, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Yasovchi besh, yetti emas.", 'Вот твои прогнозы и вот как оказалось. Образующая пять, а не семь.', 'Here are your guesses and here is how it turned out. The generator is five, not seven.'),
    A('rule', "Va mana asosiy fikr. Konusda uchta uzunlik bor, va ular bir biriga o'xshamaydi. Radius asosda yotadi, balandlik jismning ichida, o'q bo'ylab, yasovchi esa sirt bo'ylab. Uchalasi Pifagor bilan bog'langan. Yuza sanashda balandlik kerak, sirt sanashda yasovchi, va aynan shu ikkisini almashtirib yuborish eng ko'p uchraydigan xato.", 'И вот главная мысль. В конусе три длины, и они не одно и то же. Радиус лежит в основании, высота внутри тела вдоль оси, а образующая по поверхности. Все три связаны Пифагором. Для площади нужна высота, для поверхности образующая, и перепутать именно эти две самая частая ошибка.', 'And here is the main point. A cone has three lengths, and they are not the same. The radius lies in the base, the height inside along the axis, the generator along the surface. All three are linked by Pythagoras. Area needs the height, surface needs the generator, and swapping those two is the commonest mistake.'),
    A('q', "Oxirgi savol.", 'Последний вопрос.', 'The last question.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
