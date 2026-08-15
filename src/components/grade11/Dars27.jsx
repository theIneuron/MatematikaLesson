// ============================================================================
// 11-sinf, Dars 27. SILINDR.
//
// B4 blokining birinchi yig'ilgan darsi. Faqat MA'LUMOT.
//   kontrakt: src/books/grade11/ETALON_11SINF.md
//   asbob:    `SpinBoard` (tools.jsx) -- aylanish jismi, besh harakat
//
// DARSNING BITTA GAPI: silindr -- to'rtburchakning TOMONI atrofida
// aylanishi, va qaysi tomon olinsa, shunday silindr chiqadi.
//
// Xuk aynan shu yerda: bitta 3 ga 2 to'rtburchak ikki xil silindr beradi.
// Uch tomoni atrofida r = 2, l = 3, hajmi 12 pi. Ikki tomoni atrofida
// r = 3, l = 2, hajmi 18 pi. Sonlar tekshirilgan.
//
// Darslik: 1-qism, «Prizma va silindr» bobi, 174-bet. U yerdan:
//   -- o'q kesimi TO'RTBURCHAK;
//   -- teorema S yon = 2 pi r l, ya'ni radius va YASOVCHI;
//   -- 82-rasm: yoyilma -- doira, to'rtburchak, doira.
// Belgilash darslikniki: r va l. `h` harfi bu bobda YO'Q, bizda ham yo'q.
// Masalalar 285 va 292 shu bobdan.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_27',
  title: L('Silindr', 'Цилиндр', 'The cylinder'),
}

const BLOCK = { label: 'B4', from: 26, to: 33, current: 27 }

// Profil funksiyalari: aylanganda mos silindr chiqadi.
const CYL2 = () => 2      // r = 2, oraliq 0..3  -> V = 12 pi
const CYL3 = () => 3      // r = 3, oraliq 0..2  -> V = 18 pi

// ============================================================
// SLAYD 1. XUK. Bitta qog'oz, ikki silindr.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Silindr', 'Цилиндр', 'The cylinder'),
  title: L('Bitta qog\'oz, ikki silindr', 'Один лист, два цилиндра', 'One sheet, two cylinders'),
  expr: L('3 × 2 to\'rtburchak', 'прямоугольник 3 × 2', 'a 3 × 2 rectangle'),
  rows: [
    {
      id: 'a',
      name: L('uzun tomon atrofida', 'вокруг длинной стороны', 'about the long side'),
      value: 'r = 2,  l = 3',
    },
    {
      id: 'b',
      name: L('qisqa tomon atrofida', 'вокруг короткой стороны', 'about the short side'),
      value: 'r = 3,  l = 2',
    },
  ],
  probe: {
    question: L('Hajmlari tengmi?', 'Объёмы равны?', 'Are the volumes equal?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi ikkalasini ham sanaymiz.",
      'Твой ответ записан. Сейчас посчитаем оба.',
      'Your answer is saved. Now we will compute both.',
    ),
    items: [
      { id: 'a', label: L('teng', 'равны', 'equal') },
      { id: 'b', label: L('birinchisi katta', 'первый больше', 'the first is larger') },
      { id: 'both', label: L('ikkinchisi katta', 'второй больше', 'the second is larger') },
      { id: 'none', label: L("aniqlab bo'lmaydi", 'нельзя определить', 'cannot be determined') },
    ],
  },
  holds: [5000, 5000, 4500, 4000],
  audio: [
    A('mount', "Yangi blok. Endi jismlar tekislikdan chiqadi, lekin ular osmondan tushmaydi: har biri tanish tekis figurani aylantirishdan hosil bo'ladi.", 'Новый блок. Теперь тела выходят из плоскости, но они не берутся ниоткуда: каждое получается вращением знакомой плоской фигуры.', 'A new block. Solids now leave the plane, but they come from somewhere: each one is a familiar flat figure set spinning.'),
    A('r1', "Uch ga ikki to'rtburchakni uzun tomoni atrofida aylantiramiz. Radius ikki, balandlik uch.", 'Прямоугольник три на два вращаем вокруг длинной стороны. Радиус два, высота три.', 'We spin a three by two rectangle about its long side. Radius two, height three.'),
    A('r2', "Endi o'sha qog'ozni qisqa tomoni atrofida aylantiramiz. Radius uch, balandlik ikki. Qog'oz o'sha, yuzasi o'sha.", 'Теперь тот же лист вращаем вокруг короткой стороны. Радиус три, высота два. Лист тот же, площадь та же.', 'Now we spin the same sheet about its short side. Radius three, height two. The same sheet, the same area.'),
    A('ask', "Sizningcha hajmlari tengmi? Hozircha shunchaki taxmin qiling.", 'Как думаешь, объёмы равны? Пока просто предположи.', 'Do you think the volumes are equal? Just make a guess for now.'),
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
    "Uchtasi ham tanish: doira, to'rtburchak va hajm. Bu baholanmaydi.",
    'Все три знакомы: круг, прямоугольник и объём. Это не оценивается.',
    'All three are familiar: the circle, the rectangle and volume. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Doira yuzasi', 'Площадь круга', 'The area of a circle'),
      short: L('8-sinfdan', 'из 8 класса', 'from grade 8'),
      ex: [{ e: 'S = πr²', why: L('radius kvadratga ko\'tariladi', 'радиус в квадрате', 'the radius is squared') }],
    },
    {
      id: 'c2',
      title: L('Aylana uzunligi', 'Длина окружности', 'The circumference'),
      short: L('8-sinfdan', 'из 8 класса', 'from grade 8'),
      ex: [{ e: 'C = 2πr', why: L('yoyilmada shu uzunlik chiqadi', 'она станет стороной развёртки', 'it becomes a side of the net') }],
    },
    {
      id: 'c3',
      title: L('Hajm', 'Объём', 'Volume'),
      short: L('asos va balandlik', 'основание и высота', 'base and height'),
      ex: [{ e: 'V = S · l', why: L('asos yuzasi karra balandlik', 'площадь основания на высоту', 'base area times height') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L('r = 2 bo\'lsa, doira yuzasi?', 'Площадь круга при r = 2?', 'The area of a circle with r = 2?'),
      cols: 4,
      items: [
        { id: 'a', label: '4π', correct: true },
        { id: 'b', label: '2π', hint: L("Bu aylana uzunligining yarmi. Yuzada radius kvadratga ko'tariladi.", 'Это половина длины окружности. В площади радиус в квадрате.', 'That is half the circumference. In the area the radius is squared.') },
        { id: 'c', label: '16π', hint: L("Bu r ning kvadrati emas, to'rtinchi darajasi.", 'Это не квадрат радиуса, а четвёртая степень.', 'That is not the square of the radius but the fourth power.') },
        { id: 'd', label: '4', hint: L("Pi tushib qolgan: yuza pi karra r kvadrat.", 'Потерялось пи: площадь это пи на эр в квадрате.', 'Pi is missing: the area is pi times r squared.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L('r = 2 bo\'lsa, aylana uzunligi?', 'Длина окружности при r = 2?', 'The circumference with r = 2?'),
      cols: 4,
      items: [
        { id: 'a', label: '4π', correct: true },
        { id: 'b', label: '2π', hint: L("Bu r ga teng radiusnikidir. Uzunlik ikki pi karra r.", 'Это для радиуса один. Длина это два пи эр.', 'That is for radius one. The length is two pi r.') },
        { id: 'c', label: '8π', hint: L("Bu diametr bo'yicha: ikki pi karra diametr emas, radius.", 'Это по диаметру: два пи умножают на радиус, а не на диаметр.', 'That uses the diameter: two pi multiplies the radius, not the diameter.') },
        { id: 'd', label: 'π', hint: L("Kichik: ikki pi karra ikki.", 'Мало: два пи на два.', 'Too small: two pi times two.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L('Asos 4π, balandlik 3. Hajm?', 'Основание 4π, высота 3. Объём?', 'Base 4π, height 3. Volume?'),
      cols: 4,
      items: [
        { id: 'a', label: '12π', correct: true },
        { id: 'b', label: '7π', hint: L("Qo'shish emas, ko'paytirish: asos karra balandlik.", 'Не сложение, а умножение: основание на высоту.', 'Not adding but multiplying: base times height.') },
        { id: 'c', label: '4π', hint: L("Balandlik hisobga olinmagan.", 'Высота не учтена.', 'The height was ignored.') },
        { id: 'd', label: '12', hint: L("Pi tushib qolgan.", 'Потерялось пи.', 'Pi is missing.') },
      ],
    },
  ],
  holds: [3000, 4500, 4500, 4000, 4000, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch: doira yuzasi pi karra radius kvadrat. Bugun u silindrning asosi bo'ladi.", 'Первая опора: площадь круга пи эр квадрат. Сегодня это основание цилиндра.', 'The first basic: the area of a circle is pi r squared. Today it is the base of the cylinder.'),
    A('c2', "Ikkinchi tayanch: aylana uzunligi ikki pi karra radius. U keyingi darsda yoyilmaning tomoni bo'lib chiqadi.", 'Вторая опора: длина окружности два пи эр. На следующем уроке она станет стороной развёртки.', 'The second basic: the circumference is two pi r. Next lesson it becomes a side of the net.'),
    A('c3', "Uchinchi tayanch: hajm bu asos yuzasi karra balandlik. Bu qoida silindrga ham ishlaydi.", 'Третья опора: объём это площадь основания на высоту. Это правило работает и для цилиндра.', 'The third basic: volume is base area times height. That rule works for the cylinder too.'),
    A('recap', "Uchtasi birga bugungi javobni beradi.", 'Три вместе и дают сегодняшний ответ.', 'The three together give today\'s answer.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. IKKALA SILINDRNI SANAYMIZ.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'axis_matters',
  eyebrow: L('Ikkalasini sanaymiz', 'Посчитаем оба', 'Let us compute both'),
  title: L('Qaysi o\'q, shunday jism', 'Какая ось, такое тело', 'The axis decides the solid'),
  expr: L('3 × 2 to\'rtburchak', 'прямоугольник 3 × 2', 'a 3 × 2 rectangle'),
  goal: L('hajmlarni solishtirish', 'сравнить объёмы', 'compare the volumes'),
  rule: L(
    "Har bir holat uchun asos yuzasini va hajmni sanaymiz.",
    'Для каждого случая посчитаем площадь основания и объём.',
    'For each case we compute the base area and the volume.',
  ),
  pick: L('Qaysi o\'qni olamiz?', 'Какую ось возьмём?', 'Which axis shall we take?'),
  claims: [
    { id: 'a', key: 'inA', name: L('uzun tomon', 'длинная сторона', 'long side'), value: '12π' },
    { id: 'b', key: 'inB', name: L('qisqa tomon', 'короткая сторона', 'short side'), value: '18π' },
  ],
  points: [
    {
      id: 'q1', label: L('uzun tomon', 'длинная', 'long'), num: 'r = 2', step: 'calc', verdict: 'out',
      role: L('asos 4π', 'основание 4π', 'base 4π'),
      calc: '4π · 3 = 12π',
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q2', label: L('qisqa tomon', 'короткая', 'short'), num: 'r = 3', step: 'calc', verdict: 'in',
      role: L('asos 9π', 'основание 9π', 'base 9π'),
      calc: '9π · 2 = 18π',
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q3', label: L('farqi', 'разница', 'the gap'), num: '6π', step: 'calc', verdict: 'in',
      role: L('yarim barobardan ko\'p', 'больше чем в полтора раза', 'over one and a half times'),
      calc: '18π − 12π = 6π',
      sol: true, inA: false, inB: true,
    },
  ],
  probe: {
    question: L("Nega hajmlar har xil?", 'Почему объёмы разные?', 'Why do the volumes differ?'),
    items: [
      {
        id: 'b', label: L('radius kvadratga ko\'tariladi', 'радиус входит в квадрате', 'the radius is squared'), correct: true,
        ok: L(
          "To'g'ri. Radiusni bir yarim barobar oshirsak, asos yuzasi ikki chorak barobar oshadi, balandlik esa faqat bir yarim barobar kamayadi.",
          'Верно. Радиус вырос в полтора раза, а площадь основания в два с четвертью, тогда как высота упала лишь в полтора.',
          'Correct. The radius grew one and a half times, the base area two and a quarter times, while the height fell only one and a half.',
        ),
      },
      {
        id: 'a', label: L("qog'oz yuzasi o'zgardi", 'изменилась площадь листа', 'the sheet area changed'),
        hint: L("Qog'oz o'sha: uch karra ikki, olti. O'zgargani uning qanday aylanishi.", 'Лист тот же: три на два, шесть. Изменилось то, как он вращается.', 'The sheet is the same: three by two, six. What changed is how it spins.'),
      },
      {
        id: 'c', label: L('balandlik muhimroq', 'высота важнее', 'the height matters more'),
        hint: L("Aksincha: balandlik birinchi darajada, radius esa kvadratda.", 'Наоборот: высота в первой степени, а радиус в квадрате.', 'The other way round: the height is to the first power, the radius squared.'),
      },
      {
        id: 'd', label: L('tasodif', 'случайность', 'chance'),
        hint: L("Tasodif emas: sonlar aniq, o'n ikki pi va o'n sakkiz pi.", 'Не случайность: числа точные, двенадцать пи и восемнадцать пи.', 'Not chance: the numbers are exact, twelve pi and eighteen pi.'),
      },
    ],
  },
  holds: [2500, 4100, 1500, 2500, 10000, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Endi ikkala silindrni ham sanaymiz.', 'Опора восстановлена. Теперь посчитаем оба цилиндра.', 'The basics are back. Now let us compute both cylinders.'),
    A('mount', "Har birida asos yuzasini topamiz va balandlikka ko'paytiramiz.", 'В каждом найдём площадь основания и умножим на высоту.', 'In each we find the base area and multiply by the height.'),
    A('mount', "Qaysi o'qdan boshlashni tanlang.", 'Выбери, с какой оси начать.', 'Choose which axis to start with.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Mana javob. Uzun tomon atrofida o'n ikki pi, qisqa tomon atrofida esa o'n sakkiz pi. Bir xil qog'oz, farqi olti pi. Sabab oddiy: hajmda radius kvadratga ko'tariladi, balandlik esa birinchi darajada qoladi. Shuning uchun radiusni oshirish balandlikni oshirishdan foydaliroq.", 'Вот ответ. Вокруг длинной стороны двенадцать пи, вокруг короткой восемнадцать пи. Один и тот же лист, разница шесть пи. Причина простая: в объёме радиус входит в квадрате, а высота в первой степени. Поэтому увеличить радиус выгоднее, чем высоту.', 'Here is the answer. About the long side twelve pi, about the short side eighteen pi. The same sheet, a gap of six pi. The reason is simple: in the volume the radius is squared while the height stays first power. So growing the radius pays more than growing the height.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: TO'RTBURCHAK AYLANADI.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'axis_matters',
  eyebrow: L('Aylantiramiz', 'Вращаем', 'Let us spin it'),
  title: L('To\'rtburchakdan silindr', 'Из прямоугольника цилиндр', 'A cylinder from a rectangle'),
  chip: 'r = 2,  l = 3',
  solid: {
    fn: CYL2,
    a: 0,
    b: 3,
    xDomain: [-0.5, 3.5],
    yDomain: [-2.7, 2.7],
    showV: true,
    interactive: true,
    height: 152,
    caption: L('jismni barmoq bilan burish mumkin', 'тело можно повернуть пальцем', 'you can turn the solid with a finger'),
  },
  spinSteps: 3,
  bonus: L(
    "To'rtburchak o'z tomoni atrofida to'liq aylanib chiqdi va silindrni supurdi. Asoslar -- ikkita bir xil doira, yon tomoni esa o'sha to'rtburchakning izi.",
    'Прямоугольник обошёл полный круг вокруг своей стороны и заметал цилиндр. Основания — два одинаковых круга, а боковая поверхность это след того же прямоугольника.',
    'The rectangle went full circle about its side and swept out the cylinder. The bases are two equal circles, and the side surface is the trace of that same rectangle.',
  ),
  probe: {
    question: L("Silindrning asosi qanday figura?", 'Какая фигура в основании цилиндра?', 'What figure is the cylinder base?'),
    items: [
      { id: 'a', label: L('doira', 'круг', 'a circle'), correct: true },
      { id: 'b', label: L("to'rtburchak", 'прямоугольник', 'a rectangle'), hint: L("To'rtburchak aylanadi, lekin asosda uning izi -- doira turadi.", 'Прямоугольник вращается, но в основании остаётся его след — круг.', 'The rectangle spins, but the base holds its trace: a circle.') },
      { id: 'c', label: L('ellips', 'эллипс', 'an ellipse'), hint: L("Ellips bu doiraning qiyada ko'ringan holati. Jismni burib ko'ring: u doiraga aylanadi.", 'Эллипс это круг, увиденный под углом. Поверни тело: он станет кругом.', 'An ellipse is a circle seen at an angle. Turn the solid: it becomes a circle.') },
      { id: 'd', label: L('kvadrat', 'квадрат', 'a square'), hint: L("Kvadrat o'q kesimida uchraydi, asosda emas.", 'Квадрат встречается в осевом сечении, а не в основании.', 'A square can appear in the axial section, not in the base.') },
    ],
  },
  holds: [4500, 5500, 3300, 6500],
  audio: [
    A('mount', "Sonlar sanaldi. Endi jismning o'zi qanday paydo bo'lishini ko'ramiz.", 'Числа посчитаны. Теперь увидим, как появляется само тело.', 'The numbers are computed. Now let us see how the solid itself appears.'),
    A('one', "To'rtburchak o'z tomoni atrofida burila boshladi. Uning izi ortidan yuzani qoldiryapti.", 'Прямоугольник начал поворот вокруг своей стороны. Его след оставляет за собой поверхность.', 'The rectangle has begun turning about its side. Its trace leaves a surface behind.'),
    A('two', "Yarim aylanish. Endi tanish shakl ko'rina boshladi.", 'Половина оборота. Уже проступает знакомая форма.', 'Half a turn. The familiar shape is emerging.'),
    A('three', "To'liq aylanish, va silindr tayyor. Endi uni barmoq bilan burib ko'ring: yon tomonga tortsangiz yasovchi o'q atrofida yuradi, yuqoriga tortsangiz qarash burchagi o'zgaradi va asoslar ochiladi. Diqqat qiling: qanday bursangiz ham, kesim doira bo'lib qolaveradi.", 'Полный оборот, и цилиндр готов. Теперь поверни его пальцем: если потянешь вбок, образующая пойдёт вокруг оси, а если вверх, изменится угол взгляда и основания раскроются. Обрати внимание: как ни поворачивай, сечение остаётся кругом.', 'A full turn, and the cylinder is ready. Now turn it with a finger: drag sideways and the generating line travels around the axis, drag up and the viewing angle changes so the bases open. Notice: however you turn it, the section stays a circle.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'axis_matters',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Silindr nima', 'Что такое цилиндр', 'What a cylinder is'),
  rows: ['V = πr² · l', 'V = π · 4 · 3 = 12π'],
  probe: {
    question: L(
      "r = 3, l = 2 bo'lsa, hajm?",
      'Объём при r = 3, l = 2?',
      'The volume with r = 3, l = 2?',
    ),
    items: [
      { id: 'a', label: '18π', correct: true },
      { id: 'b', label: '12π', hint: L("Bu boshqa silindrniki: u yerda radius ikki edi.", 'Это для другого цилиндра: там радиус был два.', 'That is the other cylinder: its radius was two.') },
      { id: 'c', label: '6π', hint: L("Radius kvadratga ko'tarilmagan: uch kvadrat to'qqiz.", 'Радиус не возведён в квадрат: три в квадрате девять.', 'The radius was not squared: three squared is nine.') },
      { id: 'd', label: '36π', hint: L("Diametr olingan ko'rinadi. Formulada radius turadi.", 'Похоже, взят диаметр. В формуле стоит радиус.', 'The diameter seems to have been used. The formula takes the radius.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Silindr', 'Правило 1. Цилиндр', 'Rule 1. The cylinder'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'V = πr² · l',
    lines: [
      L("silindr -- to'rtburchakning tomoni atrofida aylanishi", 'цилиндр это вращение прямоугольника вокруг его стороны', 'a cylinder is a rectangle spun about its side'),
      L("o'q atrofidagi tomon YASOVCHI bo'ladi, ikkinchisi radius", 'сторона у оси становится образующей, вторая радиусом', 'the side at the axis becomes the generator, the other the radius'),
      L("hajm: asos yuzasi karra yasovchi", 'объём: площадь основания на образующую', 'volume: base area times the generator'),
      L("radius kvadratda, shuning uchun u kuchliroq ta'sir qiladi", 'радиус в квадрате, поэтому он влияет сильнее', 'the radius is squared, so it weighs more'),
    ],
    example: L('misol:  π · 9 · 2 = 18π', 'пример:  π · 9 · 2 = 18π', 'example:  π · 9 · 2 = 18π'),
  },
  holds: [4000, 6500, 4500],
  audio: [
    A('mount', "Jism ko'rildi. Endi uni yozib qo'yamiz.", 'Тело увидели. Теперь запишем его.', 'We saw the solid. Now let us write it down.'),
    A('def', "Silindr -- bu to'rtburchakning o'z tomoni atrofida aylanishi. O'q ustidagi tomon yasovchi deyiladi, unga perpendikulyar tomon esa radius bo'ladi. Hajm asos yuzasini yasovchiga ko'paytirib topiladi.", 'Цилиндр это вращение прямоугольника вокруг своей стороны. Сторона на оси называется образующей, а перпендикулярная ей становится радиусом. Объём находят умножением площади основания на образующую.', 'A cylinder is a rectangle spun about its own side. The side on the axis is called the generator, and the side across it becomes the radius. The volume is the base area times the generator.'),
    A('rule', "To'g'ri. Va tekshiruv: radius kvadratda turadi, shuning uchun uni oshirish balandlikni oshirishdan ko'ra kuchliroq ishlaydi.", 'Верно. И проверка: радиус стоит в квадрате, поэтому увеличивать его выгоднее, чем высоту.', 'Correct. And a check: the radius is squared, so raising it works harder than raising the height.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: o'q kesimi.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'axial_section',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Silindrni o\'q bo\'ylab kesamiz', 'Режем цилиндр вдоль оси', 'Cutting the cylinder along the axis'),
  was: { label: UI.was, expr: L('kesim o\'qqa perpendikulyar → doira', 'сечение поперёк оси → круг', 'a cut across the axis → a circle') },
  now: { label: UI.now, expr: L('kesim o\'q bo\'ylab → ?', 'сечение вдоль оси → ?', 'a cut along the axis → ?') },
  probe1: {
    question: L('Perpendikulyar kesimda nima chiqadi?', 'Что даёт сечение поперёк оси?', 'What does a cut across the axis give?'),
    items: [
      { id: 'a', label: L('doira', 'круг', 'a circle'), correct: true },
      { id: 'b', label: L('ellips', 'эллипс', 'an ellipse'), hint: L("Ellips faqat qiya qaraganda ko'rinadi. Kesimning o'zi doira.", 'Эллипс это лишь вид под углом. Само сечение круг.', 'An ellipse is only the angled view. The section itself is a circle.') },
      { id: 'c', label: L("to'rtburchak", 'прямоугольник', 'a rectangle'), hint: L("To'rtburchak boshqa yo'nalishda chiqadi, va bu keyingi savol.", 'Прямоугольник получится при другом направлении, и это следующий вопрос.', 'A rectangle comes from the other direction, and that is the next question.') },
      { id: 'd', label: L('kvadrat', 'квадрат', 'a square'), hint: L("Kvadrat ham o'q bo'ylab kesimda uchraydi.", 'Квадрат тоже встречается в сечении вдоль оси.', 'A square also belongs to the cut along the axis.') },
    ],
  },
  probe2: {
    cols: 2,
    question: L('O\'q bo\'ylab kesimda nima chiqadi?', 'Что даёт сечение вдоль оси?', 'What does a cut along the axis give?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: L("to'rtburchak 2r × l", 'прямоугольник 2r × l', 'a rectangle 2r × l') },
      { id: 'b', label: L('doira', 'круг', 'a circle') },
      { id: 'c', label: L("to'rtburchak r × l", 'прямоугольник r × l', 'a rectangle r × l') },
      { id: 'd', label: L('ellips', 'эллипс', 'an ellipse') },
    ],
  },
  holds: [4500, 6000, 2100, 3000],
  audio: [
    A('mount', "Silindrni ko'ndalang kesganda doira chiqishini ko'rdik: bu asosning o'zi.", 'Мы видели, что поперёк оси цилиндр даёт круг: это и есть основание.', 'We saw that across the axis the cylinder gives a circle: that is the base itself.'),
    A('now', "Endi boshqacha kesamiz: pichoqni o'q bo'ylab yuritamiz, ya'ni tekislik o'qning o'zidan o'tadi. Bunday kesim alohida nomga ega, u O'Q KESIMI deyiladi.", 'Теперь режем иначе: ведём нож вдоль оси, то есть плоскость проходит через саму ось. У такого сечения есть отдельное имя, оно называется ОСЕВЫМ.', 'Now we cut differently: the blade runs along the axis, so the plane passes through the axis itself. Such a section has its own name, it is called axial.'),
    A('q1', "Avval eskisini eslaymiz.", 'Сначала вспомним прежнее.', 'First let us recall the old one.'),
    A('q2', "Sizningcha o'q kesimida nima chiqadi? Shunchaki taxmin qiling.", 'Как думаешь, что даст осевое сечение? Просто предположи.', 'What do you think the axial section gives? Just make a guess.'),
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
  expr: L('o\'q kesimi,  r = 2,  l = 3', 'осевое сечение, r = 2, l = 3', 'axial section, r = 2, l = 3'),
  need: '= ?',
  answerLabel: L('tomonlari', 'стороны', 'the sides'),
  cards: [
    {
      tag: L('A nomzod', 'кандидат A', 'candidate A'),
      txt: 'r × l',
      point: {
        label: L('yarmi olingan', 'взята половина', 'half taken'),
        calc: L('faqat bir yon   ✗', 'только одна сторона   ✗', 'one side only   ✗'),
        verdict: 'out',
      },
    },
    {
      tag: L('B nomzod', 'кандидат B', 'candidate B'),
      txt: '2r × l',
      point: {
        label: L('o\'q ikki yoni', 'обе стороны оси', 'both sides of the axis'),
        calc: '4 × 3   ✓',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['12', '6', '24', '4'],
    value: ['12'],
    label: L('yuzasi =', 'площадь =', 'area ='),
    prompt: L('Kesim yuzasini yozing', 'Запиши площадь сечения', 'Write the area of the section'),
    wrongs: [
      { key: '6', hint: L("Bu yarim kesim: o'qning bir tomoni. Tekislik jismni butunlay kesib o'tadi.", 'Это половина сечения: одна сторона от оси. Плоскость режет тело насквозь.', 'That is half the section: one side of the axis. The plane cuts right through.') },
      { key: '24', hint: L("Ikki barobar ko'p: tomonlari to'rt va uch.", 'Вдвое больше: стороны четыре и три.', 'Twice too much: the sides are four and three.') },
      { key: '*', hint: L("Tomonlari ikki r va l, ya'ni to'rt va uch.", 'Стороны два эр и эль, то есть четыре и три.', 'The sides are two r and l, that is four and three.') },
    ],
  },
  holds: [3500, 6000, 6000, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi ikkala nomzodni ham tekshiramiz.', 'Прогноз есть. Теперь проверим обоих кандидатов.', 'The guess is made. Now let us check both candidates.'),
    A('p1', "Birinchi nomzod tomonlarini r va l deb oldi. Lekin tekislik o'qdan o'tadi va jismni butunlay kesadi: o'qning ikkala tomonida ham radius bor. Ya'ni bu yarim kesim.", 'Первый кандидат взял стороны эр и эль. Но плоскость проходит через ось и режет тело насквозь: радиус есть по обе стороны оси. То есть это половина сечения.', 'The first candidate took the sides r and l. But the plane goes through the axis and cuts the solid right across: there is a radius on both sides. So that is half the section.'),
    A('p2', "Ikkinchi nomzod ikki r ni oldi. To'rt ga uch, va yuzasi o'n ikki. Va e'tibor bering: kesim TO'RTBURCHAK. Agar u kvadrat bo'lsa, demak ikki r yasovchiga teng.", 'Второй кандидат взял два эр. Четыре на три, площадь двенадцать. И заметь: сечение это ПРЯМОУГОЛЬНИК. А если он квадрат, значит два эр равны образующей.', 'The second candidate took two r. Four by three, area twelve. And note: the section is a RECTANGLE. If it happens to be a square, then two r equals the generator.'),
    A('write', "Yuzani yozing.", 'Запиши площадь.', 'Write the area.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2: O'Q KESIMI VA YON SIRT.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'axial_section',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Kesim va yon sirt', 'Сечение и боковая поверхность', 'The section and the side'),
  cases: [
    {
      label: L('o\'q bo\'ylab', 'вдоль оси', 'along the axis'),
      text: L("to'rtburchak 2r × l", 'прямоугольник 2r × l', 'a rectangle 2r × l'),
      tone: 'graph',
    },
    {
      label: L('o\'qqa ko\'ndalang', 'поперёк оси', 'across the axis'),
      text: L('doira, radiusi r', 'круг радиуса r', 'a circle of radius r'),
      tone: 'accent',
    },
  ],
  rows: ['S = 2πr · l', 'S = 2π · 2 · 3 = 12π'],
  probe: {
    question: L(
      "Yon sirt yuzasi nimaga bog'liq?",
      'От чего зависит боковая поверхность?',
      'What does the side area depend on?',
    ),
    items: [
      { id: 'a', label: L('aylana uzunligi va yasovchi', 'длина окружности и образующая', 'the circumference and the generator'), correct: true },
      { id: 'b', label: L('asos yuzasi va yasovchi', 'площадь основания и образующая', 'the base area and the generator'), hint: L("Bu hajm: asos YUZASI karra yasovchi. Yon sirt esa aylana UZUNLIGIdan chiqadi.", 'Это объём: ПЛОЩАДЬ основания на образующую. А боковая идёт от ДЛИНЫ окружности.', 'That is the volume: base AREA times generator. The side comes from the circumference LENGTH.') },
      { id: 'c', label: L("faqat radiusga", 'только от радиуса', 'the radius alone'), hint: L("Yasovchi ham kerak: baland silindrning yon sirti kattaroq.", 'Образующая тоже нужна: у высокого цилиндра боковая больше.', 'The generator matters too: a taller cylinder has more side surface.') },
      { id: 'd', label: L('kesim yuzasiga', 'от площади сечения', 'the section area'), hint: L("Kesim boshqa narsa: u tekis figura, sirt esa jismning tashqarisi.", 'Сечение это другое: оно плоская фигура, а поверхность это внешнее тела.', 'The section is different: it is a flat figure, the surface is the outside of the solid.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Kesim', 'Правило 2. Сечение', 'Rule 2. The section'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'S = 2πr · l',
    lines: [
      L("o'q kesimi -- to'rtburchak, tomonlari 2r va l", 'осевое сечение это прямоугольник со сторонами 2r и l', 'the axial section is a rectangle with sides 2r and l'),
      L("agar u kvadrat bo'lsa, 2r = l", 'если он квадрат, то 2r = l', 'if it is a square, then 2r = l'),
      L("yon sirt: aylana uzunligi karra yasovchi", 'боковая поверхность: длина окружности на образующую', 'the side area: circumference times generator'),
      L("to'liq sirtga ikkita asos ham qo'shiladi", 'к полной поверхности добавляются два основания', 'the total surface adds the two bases'),
    ],
    example: L('misol:  2π · 2 · 3 = 12π', 'пример:  2π · 2 · 3 = 12π', 'example:  2π · 2 · 3 = 12π'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L("silindr -- aylanayotgan to'rtburchak", 'цилиндр это вращающийся прямоугольник', 'a cylinder is a spinning rectangle'),
    lines: [
      L("1. o'qni toping: qaysi tomon atrofida aylanadi", '1. найди ось: вокруг какой стороны вращаем', '1. find the axis: which side we spin about'),
      L("2. o'qdagi tomon yasovchi, ikkinchisi radius", '2. сторона на оси образующая, вторая радиус', '2. the side on the axis is the generator, the other the radius'),
      L('3. hajm: πr² karra l', '3. объём: πr² на l', '3. volume: πr² times l'),
      L('4. yon sirt: 2πr karra l', '4. боковая: 2πr на l', '4. the side: 2πr times l'),
    ],
  },
  holds: [4000, 6500, 2900, 5000],
  audio: [
    A('mount', 'Kesim topildi. Endi ikkala kesimni ham va sirtni yozamiz.', 'Сечение найдено. Теперь запишем оба сечения и поверхность.', 'The section is found. Now let us write both sections and the surface.'),
    A('rows', "Ikki xil kesim ikki xil figura beradi: o'q bo'ylab to'rtburchak, o'qqa ko'ndalang esa doira. Yon sirt bilan ham ehtiyot bo'ling: u aylana UZUNLIGIdan chiqadi, asos YUZASIdan emas. Hajmda yuza, sirtda uzunlik.", 'Два разных сечения дают две разные фигуры: вдоль оси прямоугольник, поперёк круг. С боковой поверхностью тоже осторожно: она идёт от ДЛИНЫ окружности, а не от площади основания. В объёме площадь, в поверхности длина.', 'Two different cuts give two different figures: along the axis a rectangle, across it a circle. Be careful with the side area too: it comes from the circumference LENGTH, not the base area. Area in the volume, length in the surface.'),
    A('q', "Savol: yon sirt nimaga bog'liq?", 'Вопрос: от чего зависит боковая поверхность?', 'The question: what does the side area depend on?'),
    A('rule', "To'g'ri. Va agar o'q kesimi kvadrat bo'lib chiqsa, bu ikki r yasovchiga teng degani -- shundan radiusni topish mumkin.", 'Верно. А если осевое сечение оказалось квадратом, значит два эр равны образующей, и отсюда можно найти радиус.', 'Correct. And if the axial section turns out to be a square, then two r equals the generator, and the radius follows.'),
    A('both', 'Endi butun darsni bitta qoidaga yig\'ing.', 'А теперь собери весь урок в одно правило.', 'Now combine the whole lesson into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. AMALNI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'axis_matters',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Darajani qo\'ying', 'Поставь степень', 'Place the power'),
  left: L('hajm:  r = 2,  l = 3', 'объём: r = 2, l = 3', 'volume: r = 2, l = 3'),
  template: ['V = π · 2', { slot: 0 }, ' · 3'],
  signs: ['²', '³'],
  answer: '²',
  checkNote: L(
    "Asos -- DOIRA, uning yuzasi πr²",
    'Основание это КРУГ, его площадь πr²',
    'The base is a CIRCLE, its area is πr²',
  ),
  wrongs: [
    { key: '³', hint: L("Kub bo'lsa balandlik ikki marta hisobga olinardi. Asos yuzasida radius ikki marta, balandlik esa alohida.", 'В кубе высота учлась бы дважды. В площади основания радиус дважды, а высота отдельно.', 'A cube would count the height twice. The base area takes the radius twice, the height separately.') },
  ],
  probe: {
    question: L("Nega aynan kvadrat?", 'Почему именно квадрат?', 'Why squared?'),
    items: [
      { id: 'a', label: L('asos doira, yuzasi πr²', 'основание круг, его площадь πr²', 'the base is a circle, area πr²'), correct: true },
      { id: 'b', label: L("shunday qulay", 'так удобнее', 'it is more convenient'), hint: L("Qulaylik emas: yuza formulasidan kelib chiqadi.", 'Не удобство: следует из формулы площади.', 'Not convenience: it follows from the area formula.') },
      { id: 'c', label: L("hajm har doim kubda", 'объём всегда в кубе', 'volume is always cubed'), hint: L("Yo'q: kub faqat uchala o'lcham teng bo'lganda chiqadi.", 'Нет: куб получается, только когда все три размера равны.', 'No: a cube arises only when all three sizes are equal.') },
      { id: 'd', label: L("shunday kelishilgan", 'так договорились', 'that is the convention'), hint: L("Kelishuv emas: doira yuzasi 8-sinfda isbotlangan.", 'Не договорённость: площадь круга доказана в 8 классе.', 'Not a convention: the area of a circle was proved in grade 8.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Darajani qo'ying.", 'Поставь степень.', 'Place the power.'),
    A('checked', "Bo'ldi. Endi ta'riflang: nega aynan kvadrat?", 'Получилось. Теперь сформулируй: почему именно квадрат?', 'Done. Now put it into words: why squared?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'circ', label: L('aylana uzunligini topish', 'найти длину окружности', 'find the circumference') },
  { id: 'area', label: L('asos yuzasini topish', 'найти площадь основания', 'find the base area') },
  { id: 'mul', label: L('yasovchiga ko\'paytirish', 'умножить на образующую', 'multiply by the generator') },
  { id: 'add', label: L('asoslarni qo\'shish', 'прибавить основания', 'add the bases') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'lateral_vs_total',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: L('r = 2, l = 3. Yon sirt?', 'r = 2, l = 3. Боковая поверхность?', 'r = 2, l = 3. The side area?'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'circ',
      to: '2π · 2 = 4π',
      wrongs: [
        { action: 'area', hint: L("Yuza hajmga kerak. Yon sirt aylana UZUNLIGIdan boshlanadi.", 'Площадь нужна объёму. Боковая начинается с ДЛИНЫ окружности.', 'The area is for the volume. The side starts from the circumference LENGTH.') },
        { action: 'mul', hint: L("Avval nimani ko'paytirishni toping.", 'Сначала найди, что умножать.', 'First find what to multiply.') },
        { action: 'add', hint: L("Asoslar yon sirtga kirmaydi.", 'Основания в боковую не входят.', 'The bases are not part of the side area.') },
      ],
    },
    {
      action: 'mul',
      to: '4π · 3 = 12π',
      wrongs: [
        { action: 'circ', hint: L("Topilgan: to'rt pi.", 'Найдено: четыре пи.', 'Found: four pi.') },
        { action: 'area', hint: L("Yuza bu yerda kerak emas.", 'Площадь здесь не нужна.', 'The area is not needed here.') },
        { action: 'add', hint: L("So'ralgani YON sirt, to'liq emas.", 'Спрашивают БОКОВУЮ, а не полную.', 'The SIDE area is asked, not the total.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['12π', '20π', '6π', '12'],
    value: ['12π'],
    label: L('S yon =', 'S бок =', 'S side ='),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '20π', hint: L("Bu to'liq sirt: yon plyus ikkita asos. So'ralgani yon sirt.", 'Это полная поверхность: боковая плюс два основания. Спрашивали боковую.', 'That is the total: the side plus two bases. The side was asked.') },
      { key: '6π', hint: L("Aylana uzunligi ikki pi karra r, ya'ni to'rt pi, ikki pi emas.", 'Длина окружности два пи эр, то есть четыре пи, а не два пи.', 'The circumference is two pi r, that is four pi, not two pi.') },
      { key: '*', hint: L("To'rt pi karra uch.", 'Четыре пи на три.', 'Four pi times three.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi darslik masalasini o\'tamiz.', 'Правило сформулировано. Пройдём задачу из учебника.', 'The rule is stated. Let us work a textbook problem.'),
    A('start', "Diqqat: ro'yxatda ortiqcha amal bor. Nimadan boshlashni tanlang.", 'Внимание: в списке есть лишнее действие. Выбери, с чего начать.', 'Careful: the list has one superfluous action. Choose where to start.'),
    A('step3', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'axis_matters',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Hajmni toping', 'Найди объём', 'Find the volume'),
  start: 'r = 3,  l = r + 2',
  actions: ACTIONS_10,
  hint: L(
    "Avval yasovchini sanang: u radiusdan 2 ga uzun.",
    'Сначала посчитай образующую: она на 2 длиннее радиуса.',
    'First compute the generator: it is 2 longer than the radius.',
  ),
  steps: [
    {
      action: 'area',
      to: 'π · 9 = 9π',
      wrongs: [
        { action: 'circ', hint: L("Uzunlik yon sirtga kerak. Hajmga YUZA kerak.", 'Длина нужна боковой. Объёму нужна ПЛОЩАДЬ.', 'The length is for the side area. Volume needs the AREA.') },
        { action: 'mul', hint: L("Avval nimani ko'paytirishni toping.", 'Сначала найди, что умножать.', 'First find what to multiply.') },
        { action: 'add', hint: L("Qo'shish bu yerda kerak emas.", 'Сложение здесь не нужно.', 'No adding is needed here.') },
      ],
    },
    {
      action: 'mul',
      to: '9π · 5 = 45π',
      wrongs: [
        { action: 'area', hint: L("Topilgan: to'qqiz pi.", 'Найдено: девять пи.', 'Found: nine pi.') },
        { action: 'circ', hint: L("Uzunlik bu yerda kerak emas.", 'Длина здесь не нужна.', 'The length is not needed here.') },
        { action: 'add', hint: L("Ko'paytirish kerak, qo'shish emas.", 'Нужно умножение, а не сложение.', 'Multiplying is needed, not adding.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['45π', '27π', '15π', '45'],
    value: ['45π'],
    label: 'V =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '27π', hint: L("Yasovchi uch emas, besh: u radiusdan ikkiga uzun.", 'Образующая не три, а пять: она на два длиннее радиуса.', 'The generator is not three but five: it is two longer than the radius.') },
      { key: '15π', hint: L("Radius kvadratga ko'tarilmagan: uch kvadrat to'qqiz.", 'Радиус не возведён в квадрат: три в квадрате девять.', 'The radius was not squared: three squared is nine.') },
      { key: '*', hint: L("To'qqiz pi karra besh.", 'Девять пи на пять.', 'Nine pi times five.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Radius uch, yasovchi esa radiusdan ikkiga uzun. Diqqat: yasovchi shartda to'g'ridan to'g'ri berilmagan.", 'Радиус три, а образующая на два длиннее радиуса. Внимание: образующая прямо в условии не дана.', 'The radius is three, and the generator is two longer than the radius. Careful: the generator is not given directly.'),
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
      id: 'b1', tag: 'axis_matters', ask: true, cols: 4,
      done: 'V = 12π',
      prompt: L('r = 2, l = 3. Hajm?', 'r = 2, l = 3. Объём?', 'r = 2, l = 3. Volume?'),
      items: [
        { id: 'a', label: '12π', correct: true },
        { id: 'b', label: '6π', hint: L("Radius kvadratda: ikki kvadrat to'rt.", 'Радиус в квадрате: два в квадрате четыре.', 'The radius is squared: two squared is four.') },
        { id: 'c', label: '18π', hint: L("Bu ikkinchi silindrniki, u yerda radius uch.", 'Это для второго цилиндра, там радиус три.', 'That is the second cylinder, its radius is three.') },
        { id: 'd', label: '24π', hint: L("Diametr olingan ko'rinadi.", 'Похоже, взят диаметр.', 'The diameter seems to have been used.') },
      ],
    },
    {
      id: 'b2', tag: 'lateral_vs_total', ask: true, cols: 4,
      done: L('S yon = 12π', 'S бок = 12π', 'S side = 12π'),
      prompt: L('r = 2, l = 3. Yon sirt?', 'r = 2, l = 3. Боковая?', 'r = 2, l = 3. Side area?'),
      items: [
        { id: 'a', label: '12π', correct: true },
        { id: 'b', label: '20π', hint: L("Bu to'liq sirt: ikkita asos qo'shilgan.", 'Это полная: добавлены два основания.', 'That is the total: two bases were added.') },
        { id: 'c', label: '6π', hint: L("Aylana uzunligi to'rt pi, ikki pi emas.", 'Длина окружности четыре пи, а не два пи.', 'The circumference is four pi, not two pi.') },
        { id: 'd', label: '4π', hint: L("Yasovchiga ko'paytirilmagan.", 'Не умножено на образующую.', 'Not multiplied by the generator.') },
      ],
    },
    {
      id: 'b3', tag: 'axial_section', ask: true, cols: 2,
      done: L("to'rtburchak", 'прямоугольник', 'a rectangle'),
      prompt: L("Silindrning o'q kesimi qanday figura?", 'Какая фигура в осевом сечении цилиндра?', 'What figure is the axial section?'),
      items: [
        { id: 'a', label: L("to'rtburchak", 'прямоугольник', 'a rectangle'), correct: true },
        { id: 'b', label: L('doira', 'круг', 'a circle'), hint: L("Doira ko'ndalang kesimda chiqadi.", 'Круг даёт сечение поперёк оси.', 'A circle comes from the cut across the axis.') },
        { id: 'c', label: L('ellips', 'эллипс', 'an ellipse'), hint: L("Ellips faqat qiya qaraganda ko'rinadi.", 'Эллипс это лишь вид под углом.', 'An ellipse is only the angled view.') },
        { id: 'd', label: L('uchburchak', 'треугольник', 'a triangle'), hint: L("Uchburchak konusda chiqadi, silindrda emas.", 'Треугольник даёт конус, а не цилиндр.', 'A triangle belongs to the cone, not the cylinder.') },
      ],
    },
    {
      id: 'b4', tag: 'axial_section', ask: true, cols: 4,
      done: 'r = 3',
      prompt: L("O'q kesimi kvadrat, l = 6. Radius?", 'Осевое сечение квадрат, l = 6. Радиус?', 'The axial section is a square, l = 6. The radius?'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '6', hint: L("Bu kvadratning tomoni, ya'ni DIAMETR. Radius uning yarmi.", 'Это сторона квадрата, то есть ДИАМЕТР. Радиус его половина.', 'That is the side of the square, the DIAMETER. The radius is half.') },
        { id: 'c', label: '12', hint: L("Aksincha: ikki r yasovchiga teng, demak r kichikroq.", 'Наоборот: два эр равны образующей, значит эр меньше.', 'The other way: two r equals the generator, so r is smaller.') },
        { id: 'd', label: '36', hint: L("Bu kvadratning yuzasi.", 'Это площадь квадрата.', 'That is the area of the square.') },
      ],
    },
    {
      id: 'b5', tag: 'axis_matters', ask: true, cols: 2,
      done: L('qisqa tomon atrofida', 'вокруг короткой стороны', 'about the short side'),
      prompt: L(
        "3 × 2 qog'oz: qaysi aylanish hajmi kattaroq?",
        'Лист 3 × 2: какое вращение даёт больший объём?',
        'A 3 × 2 sheet: which spin gives more volume?',
      ),
      items: [
        { id: 'a', label: L('qisqa tomon atrofida', 'вокруг короткой', 'about the short side'), correct: true },
        { id: 'b', label: L('uzun tomon atrofida', 'вокруг длинной', 'about the long side'), hint: L("Unda radius ikki bo'ladi, va hajm o'n ikki pi. Qisqa tomonda esa o'n sakkiz pi.", 'Тогда радиус два и объём двенадцать пи. А вокруг короткой восемнадцать пи.', 'Then the radius is two and the volume twelve pi. About the short side it is eighteen pi.') },
        { id: 'c', label: L('teng', 'одинаково', 'the same'), hint: L("Teng emas: o'n ikki pi va o'n sakkiz pi.", 'Не одинаково: двенадцать пи и восемнадцать пи.', 'Not the same: twelve pi and eighteen pi.') },
        { id: 'd', label: L("qog'oz o'lchamiga bog'liq", 'зависит от размера листа', 'depends on the sheet'), hint: L("Qog'oz berilgan: uch ga ikki.", 'Лист задан: три на два.', 'The sheet is given: three by two.') },
      ],
    },
    {
      id: 'b6', tag: 'lateral_vs_total', ask: true, cols: 4,
      done: L("to'liq = 20π", 'полная = 20π', 'total = 20π'),
      prompt: L("r = 2, l = 3. To'liq sirt?", 'r = 2, l = 3. Полная поверхность?', 'r = 2, l = 3. Total surface?'),
      items: [
        { id: 'a', label: '20π', correct: true },
        { id: 'b', label: '12π', hint: L("Bu faqat yon sirt: ikkita asos qo'shilmagan.", 'Это только боковая: не добавлены два основания.', 'That is the side only: the two bases are missing.') },
        { id: 'c', label: '16π', hint: L("Bitta asos qo'shilgan, asos esa ikkita.", 'Добавлено одно основание, а их два.', 'One base was added, but there are two.') },
        { id: 'd', label: '24π', hint: L("Ko'p: yon o'n ikki pi, asoslar sakkiz pi.", 'Много: боковая двенадцать пи, основания восемь пи.', 'Too much: the side is twelve pi, the bases eight pi.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Endi yon sirt.", 'Теперь боковая.', 'Now the side area.'),
    A('q3', "Kesim shakli.", 'Форма сечения.', 'The shape of the section.'),
    A('q4', "Kvadrat kesim.", 'Квадратное сечение.', 'A square section.'),
    A('q5', "Qaysi o'q.", 'Какая ось.', 'Which axis.'),
    A('q6', "Oxirgi savol: to'liq sirt.", 'Последний вопрос: полная поверхность.', 'The last question: total surface.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'lateral_vs_total',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L("Yon sirt asos yuzasidan chiqarilgan", 'Боковую вывели из площади основания', 'The side area came from the base area'),
  rows: [
    { id: 'r1', text: 'r = 2,  l = 3' },
    { id: 'r2', text: L('asos yuzasi: π · 4 = 4π', 'площадь основания: π · 4 = 4π', 'base area: π · 4 = 4π') },
    { id: 'r3', text: L('yon sirt: 4π · 3 = 12π', 'боковая: 4π · 3 = 12π', 'side: 4π · 3 = 12π') },
    { id: 'r4', text: L('javob: 12π', 'ответ: 12π', 'answer: 12π') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Asos yuzasi to'g'ri sanalgan: pi karra to'rt.", 'Площадь основания посчитана верно: пи на четыре.', 'The base area is right: pi times four.'),
    r4: L("Son to'g'ri chiqib qolgan, lekin yo'l xato: buni ko'rish qiyin, shuning uchun oldingi satrga qarang.", 'Число случайно совпало, но путь неверный: это заметить трудно, посмотри строкой выше.', 'The number happens to match, but the path is wrong: hard to spot, look one line up.'),
  },
  proofPoint: L('yon sirt uzunlikdan chiqadi', 'боковая идёт от длины', 'the side comes from a length'),
  proof: L(
    "Yon sirt aylana UZUNLIGIga ko'paytiriladi, asos YUZASIga emas. Bu yerda javob tasodifan to'g'ri chiqdi, chunki r = 2 da yuza ham, uzunlik ham to'rt pi. r = 3 olsak, yuza to'qqiz pi, uzunlik esa olti pi, va javoblar ajraladi.",
    'Боковую умножают на ДЛИНУ окружности, а не на ПЛОЩАДЬ основания. Здесь ответ совпал случайно: при r = 2 и площадь, и длина равны четырём пи. Возьми r = 3, и площадь девять пи, длина шесть пи, а ответы разойдутся.',
    'The side area multiplies the circumference LENGTH, not the base AREA. Here the answer matched by accident: at r = 2 both the area and the length are four pi. Take r = 3 and the area is nine pi, the length six pi, and the answers part.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L("uzunlik o'rniga yuza olingan", 'вместо длины взята площадь', 'the area was used instead of the length'), correct: true },
      { id: 'b', label: L("javob noto'g'ri", 'ответ неверный', 'the answer is wrong'), hint: L("Bu safar son to'g'ri: r = 2 da yuza ham, uzunlik ham to'rt pi. Xato yo'lda.", 'На этот раз число верное: при r = 2 и площадь, и длина равны четырём пи. Ошибка в пути.', 'This time the number is right: at r = 2 both equal four pi. The error is in the path.') },
      { id: 'c', label: L("asos yuzasi xato sanalgan", 'площадь основания посчитана неверно', 'the base area is miscomputed'), hint: L("To'g'ri sanalgan: pi karra ikki kvadrat.", 'Посчитана верно: пи на два в квадрате.', 'It is right: pi times two squared.') },
      { id: 'd', label: L("yasovchi noto'g'ri", 'образующая неверна', 'the generator is wrong'), hint: L("Yasovchi shartdan: uch.", 'Образующая из условия: три.', 'The generator is from the problem: three.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda javob to'g'ri son, va aynan shu qiyin qiladi. Xato birinchi marta paydo bo'lgan satrni toping.", 'Здесь ответ верное число, и это как раз усложняет дело. Найди строку, в которой ошибка появилась впервые.', 'Here the answer is the right number, and that is what makes it hard. Find the line where the error first appeared.'),
    A('proof', "Qarang: yon sirt aylana uzunligiga ko'paytiriladi, asos yuzasiga emas. Bu yerda ular tasodifan teng: radius ikkida yuza ham, uzunlik ham to'rt pi. Radiusni uch qilsak, yuza to'qqiz pi, uzunlik olti pi bo'ladi, va bu usul yolg'on javob beradi.", 'Смотри: боковую умножают на длину окружности, а не на площадь основания. Здесь они случайно совпали: при радиусе два и площадь, и длина равны четырём пи. Сделай радиус три, и площадь станет девять пи, длина шесть пи, и способ даст неверный ответ.', 'Look: the side area multiplies the circumference, not the base area. Here they coincide by accident: at radius two both are four pi. Make the radius three and the area is nine pi, the length six pi, and this method gives a false answer.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'lateral_vs_total',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Yozuvni yig\'ing', 'Собери запись', 'Build the record'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L('yuza yoki uzunlik', 'площадь или длина', 'area or length'),
  tasks: [
    {
      prompt: L('hajm, r = 2, l = 3', 'объём, r = 2, l = 3', 'volume, r = 2, l = 3'),
      template: ['V = ', { slot: 0 }, ' · ', { slot: 1 }],
      parts: ['4π', '3', '2π', '12'],
      answer: ['4π', '3'],
      doneLabel: '4π · 3 = 12π',
      wrongs: [
        { key: '2π|3', hint: L("Ikki pi bu aylana uzunligi, u yon sirtga kerak. Hajmga asos yuzasi kerak.", 'Два пи это длина окружности, она нужна боковой. Объёму нужна площадь основания.', 'Two pi is the circumference, needed for the side. Volume needs the base area.') },
        { key: '*', hint: L("Hajm: asos yuzasi karra yasovchi.", 'Объём: площадь основания на образующую.', 'Volume: base area times the generator.') },
      ],
    },
    {
      prompt: L('yon sirt, r = 2, l = 3', 'боковая, r = 2, l = 3', 'side area, r = 2, l = 3'),
      template: ['S = ', { slot: 0 }, ' · ', { slot: 1 }],
      parts: ['4π', '3', '2', '12π'],
      answer: ['4π', '3'],
      doneLabel: '4π · 3 = 12π',
      wrongs: [
        { key: '12π|3', hint: L("O'n ikki pi bu tayyor javob, ko'paytuvchi emas.", 'Двенадцать пи это уже ответ, а не множитель.', 'Twelve pi is the answer already, not a factor.') },
        { key: '*', hint: L("Yon sirt: aylana uzunligi karra yasovchi. Uzunlik ham to'rt pi chiqadi.", 'Боковая: длина окружности на образующую. Длина тоже равна четырём пи.', 'The side: circumference times generator. The circumference is also four pi.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi. Diqqat: sonlar bir xil, lekin ma'nosi boshqa.", 'А теперь второе. Внимание: числа те же, а смысл другой.', 'And now the second. Careful: the same numbers, a different meaning.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'axis_matters',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: 'V = πr² · l',
  ruleLines: [
    L("silindr -- to'rtburchakning tomoni atrofida aylanishi", 'цилиндр это вращение прямоугольника вокруг стороны', 'a cylinder is a rectangle spun about its side'),
    L("qaysi tomon o'q bo'lsa, shunday jism chiqadi", 'какая сторона стала осью, такое и тело', 'whichever side becomes the axis decides the solid'),
    L("hajmga asos yuzasi, sirtga aylana uzunligi", 'объёму площадь основания, поверхности длина окружности', 'area for the volume, circumference for the surface'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('3 × 2, hajmlar teng?', '3 × 2, объёмы равны?', '3 × 2, equal volumes?'),
      right: L('ikkinchisi katta', 'второй больше', 'the second is larger'),
      map: {
        a: L('teng', 'равны', 'equal'),
        b: L('birinchisi katta', 'первый больше', 'the first'),
        both: L('ikkinchisi katta', 'второй больше', 'the second'),
        none: L("bilib bo'lmaydi", 'не определить', 'cannot tell'),
      },
    },
    {
      screen: 5,
      expr: L("kesim", 'сечение', 'the section'),
      right: '2r × l',
      map: {
        a: '2r × l',
        b: L('doira', 'круг', 'a circle'),
        c: 'r × l',
        d: L('ellips', 'эллипс', 'an ellipse'),
      },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '12π  <  18π',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Aylanish ekraniga qayting', 'Вернись к экрану с вращением', 'Go back to the spinning screen'),
  },
  probe: {
    question: L(
      "Nega radiusni oshirish foydaliroq?",
      'Почему выгоднее увеличить радиус?',
      'Why does growing the radius pay more?',
    ),
    items: [
      { id: 'a', label: L('u kvadratga ko\'tariladi', 'он входит в квадрате', 'it is squared'), correct: true },
      { id: 'b', label: L('u kattaroq son', 'он большее число', 'it is the bigger number'), hint: L("Kattaligi ahamiyatsiz: masala darajada.", 'Величина не важна: дело в степени.', 'The size does not matter: it is about the power.') },
      { id: 'c', label: L('shunday chiqib qoldi', 'так получилось', 'it just happened'), hint: L("Tasodif emas: hajmda r kvadrat turadi.", 'Не случайность: в объёме стоит эр в квадрате.', 'Not chance: the volume holds r squared.') },
      { id: 'd', label: L('har doim ham foydali emas', 'не всегда выгоднее', 'not always'), hint: L("Bu javob ehtiyotkor, lekin sabab baribir darajada.", 'Ответ осторожный, но причина всё равно в степени.', 'A cautious answer, but the reason is still the power.') },
    ],
  },
  sheetTitle: L('Silindr · shpargalka', 'Цилиндр · шпаргалка', 'The cylinder · cheat sheet'),
  sheetSrc: L('11-sinf · 27-dars', '11 класс · урок 27', 'Grade 11 · lesson 27'),
  lifehack: L(
    "Qog'ozni aylantirishdan oldin qaysi tomon o'q bo'lishini belgilang: javob shundan boshlanadi.",
    'Прежде чем вращать лист, отметь, какая сторона станет осью: с этого начинается ответ.',
    'Before spinning a sheet, mark which side becomes the axis: the answer starts there.',
  ),
  holds: [2500, 7000, 7500, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Bir xil qog'ozdan ikki xil silindr, va ularning hajmlari teng emas.", 'Вот твои прогнозы и вот как оказалось. Из одного листа два разных цилиндра, и объёмы у них не равны.', 'Here are your guesses and here is how it turned out. One sheet, two different cylinders, and their volumes are not equal.'),
    A('rule', "Va mana asosiy fikr. Silindr osmondan tushmaydi: u to'rtburchakning aylanishi. Qaysi tomon o'q bo'lsa, shunday jism chiqadi, va shu tanlov javobni belgilaydi. Yana bir narsani eslab qoling: hajmga asos yuzasi kerak, sirtga esa aylana uzunligi. Bu ikkisini almashtirib yuborish eng ko'p uchraydigan xato.", 'И вот главная мысль. Цилиндр не берётся ниоткуда: это вращение прямоугольника. Какая сторона стала осью, такое и тело, и этот выбор задаёт ответ. И запомни ещё одно: объёму нужна площадь основания, а поверхности длина окружности. Перепутать их самая частая ошибка.', 'And here is the main point. A cylinder comes from somewhere: it is a spun rectangle. Whichever side becomes the axis decides the solid, and that choice decides the answer. And remember one more thing: the volume needs the base area, the surface needs the circumference. Swapping them is the commonest mistake.'),
    A('q', "Oxirgi savol: nega radiusni oshirish foydaliroq?", 'Последний вопрос: почему выгоднее увеличить радиус?', 'The last question: why does growing the radius pay more?'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
