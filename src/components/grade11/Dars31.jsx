// ============================================================================
// 11-sinf, Dars 31. PRIZMA VA SILINDR HAJMI.
//
// B4 blokining beshinchi darsi. Faqat MA'LUMOT.
//   kontrakt: src/books/grade11/ETALON_11SINF.md
//   asbob:    `SpinBoard`, `disks` rejimi -- jism qatlamlarga bo'linadi
//
// DARSNING BITTA GAPI: hajm asos yuzasini BALANDLIKKA ko'paytiradi, va
// qiyalik hajmni o'zgartirmaydi -- Kavalyeri prinsipi.
//
// Xuk: tangalar ustuni qiyalantirildi. Hajm o'zgardimi? Yo'q. Lekin qiya
// silindrda yasovchi balandlikdan uzun, va uni h o'rniga qo'yish o'n ikki
// pi o'rniga yigirma pi beradi -- 28-darsdagi xatoning davomi.
//
// QATLAMLAR SHU YERDA ANIQ. Silindrning har bir qatlami bir xil, shuning
// uchun yig'indi taxminiy emas: S karra h roppa rosa chiqadi. 33-darsda
// qatlamlar har xil bo'ladi va u yerda limit kerak bo'ladi. Bu ikki darsni
// bog'laydigan fikr.
//
// Sonlar tekshirilgan: silindr r = 2, h = 3, V = 12 pi; prizma 3 ga 2,
// h = 4, V = 24; darslikdagi 295-masala: 3 litr suv 15 sm, detal 4 sm
// ko'tardi, demak detal hajmi 0,8 litr = 800 kub santimetr.
//
// Darslik: 1-qism, «Prizma va silindr» bobi -- bu blokdagi YAGONA dars,
// bunda darslik bor. 295-masala shu bobdan.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_31',
  title: L('Prizma va silindr hajmi', 'Объём призмы и цилиндра', 'Volume of a prism and a cylinder'),
}

const BLOCK = { label: 'B4', from: 26, to: 33, current: 31 }

const CYL = () => 2

// ============================================================
// SLAYD 1. XUK. Qiyalangan ustun.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Hajm', 'Объём', 'Volume'),
  title: L('Ustunni qiyalantirdik', 'Наклонили стопку', 'The stack was tilted'),
  expr: L('asos va balandlik o\'sha', 'основание и высота те же', 'same base, same height'),
  rows: [
    {
      id: 'a',
      name: L('birinchi', 'первый', 'the first'),
      value: L('hajm ortdi', 'объём вырос', 'the volume grew'),
    },
    {
      id: 'b',
      name: L('ikkinchi', 'второй', 'the second'),
      value: L("hajm o'sha", 'объём тот же', 'the volume is the same'),
    },
  ],
  probe: {
    question: L('Hajm o\'zgardimi?', 'Изменился ли объём?', 'Did the volume change?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi jismni qatlamlarga bo'lamiz.",
      'Твой ответ записан. Сейчас разделим тело на слои.',
      'Your answer is saved. Now we will split the solid into layers.',
    ),
    items: [
      { id: 'a', label: L('ortdi', 'вырос', 'grew') },
      { id: 'b', label: L("o'zgarmadi", 'не изменился', 'unchanged') },
      { id: 'both', label: L('kamaydi', 'уменьшился', 'shrank') },
      { id: 'none', label: L("bilib bo'lmaydi", 'не определить', 'cannot tell') },
    ],
  },
  holds: [5000, 4500, 4000, 4000],
  audio: [
    A('mount', "Jismlarni yasadik va sirtlarini sanadik. Endi eng asosiysi: ichida qancha joy bor.", 'Мы построили тела и посчитали их поверхности. Теперь главное: сколько места внутри.', 'We built the solids and computed their surfaces. Now the main thing: how much room is inside.'),
    A('r1', "Bir xil tangalarni ustun qilib taxlaymiz, keyin ustunni qiyalantiramiz. Birinchi fikr: qiya ustun uzunroq, demak hajm ortdi.", 'Сложим одинаковые монеты в стопку, потом наклоним её. Первое мнение: наклонная стопка длиннее, значит объём вырос.', 'Stack identical coins, then tilt the stack. The first opinion: a tilted stack is longer, so the volume grew.'),
    A('r2', "Ikkinchi fikr: tangalar o'sha tangalar, hech biri qo'shilmadi va yo'qolmadi, demak hajm o'sha.", 'Второе мнение: монеты те же, ни одна не добавилась и не исчезла, значит объём тот же.', 'The second opinion: the same coins, none added and none lost, so the volume is the same.'),
    A('ask', "Sizningcha hajm o'zgardimi? Hozircha shunchaki taxmin qiling.", 'Как думаешь, изменился ли объём? Пока просто предположи.', 'Do you think the volume changed? Just make a guess for now.'),
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
    "Ikkitasi tanish, bittasi bugun kengayadi. Bu baholanmaydi.",
    'Две знакомы, одна сегодня расширится. Это не оценивается.',
    'Two are familiar, one widens today. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Doira yuzasi', 'Площадь круга', 'The area of a circle'),
      short: L('asos uchun', 'для основания', 'for the base'),
      ex: [{ e: 'S = πr²', why: L('silindrning asosi', 'основание цилиндра', 'the cylinder base') }],
    },
    {
      id: 'c2',
      title: L("Ko'pburchak yuzasi", 'Площадь многоугольника', 'Polygon area'),
      short: L('prizma uchun', 'для призмы', 'for the prism'),
      ex: [{ e: 'S = a · b', why: L("to'rtburchak asos", 'прямоугольное основание', 'a rectangular base') }],
    },
    {
      id: 'c3',
      title: L('Balandlik', 'Высота', 'The height'),
      short: L('28-darsdan', 'из урока 28', 'from lesson 28'),
      ex: [{ e: L("asosga perpendikulyar", 'перпендикуляр к основанию', 'perpendicular to the base'), why: L('yasovchi bilan bir xil emas', 'это не образующая', 'not the same as the generator') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L('r = 2. Asos yuzasi?', 'r = 2. Площадь основания?', 'r = 2. The base area?'),
      cols: 4,
      items: [
        { id: 'a', label: '4π', correct: true },
        { id: 'b', label: '2π', hint: L("Bu aylana uzunligi.", 'Это длина окружности.', 'That is the circumference.') },
        { id: 'c', label: '16π', hint: L("Radius kvadratda: ikki kvadrat to'rt.", 'Радиус в квадрате: два в квадрате четыре.', 'The radius is squared: two squared is four.') },
        { id: 'd', label: '4', hint: L("Pi tushib qolgan.", 'Потерялось пи.', 'Pi is missing.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L('Asos 6, balandlik 4. Hajm?', 'Основание 6, высота 4. Объём?', 'Base 6, height 4. Volume?'),
      cols: 4,
      items: [
        { id: 'a', label: '24', correct: true },
        { id: 'b', label: '10', hint: L("Qo'shish emas, ko'paytirish.", 'Не сложение, а умножение.', 'Not adding but multiplying.') },
        { id: 'c', label: '12', hint: L("Ikkiga bo'lish kerak emas: bu hajm, uchburchak emas.", 'Делить на два не нужно: это объём, а не треугольник.', 'No halving: this is a volume, not a triangle.') },
        { id: 'd', label: '6', hint: L("Balandlik hisobga olinmagan.", 'Высота не учтена.', 'The height was ignored.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L('Balandlik nima?', 'Что такое высота?', 'What is the height?'),
      cols: 2,
      items: [
        { id: 'a', label: L('asoslar orasidagi perpendikulyar', 'перпендикуляр между основаниями', 'the perpendicular between the bases'), correct: true },
        { id: 'b', label: L('yon qirra', 'боковое ребро', 'a side edge'), hint: L("Qiya jismda yon qirra balandlikdan uzun.", 'У наклонного тела боковое ребро длиннее высоты.', 'In a tilted solid a side edge is longer than the height.') },
        { id: 'c', label: L('eng uzun kesma', 'самый длинный отрезок', 'the longest segment'), hint: L("Eng uzun kesma diagonal bo'lishi mumkin.", 'Самым длинным может быть диагональ.', 'The longest can be a diagonal.') },
        { id: 'd', label: L('asosning tomoni', 'сторона основания', 'a base side'), hint: L("Asosning tomoni asosda yotadi.", 'Сторона основания лежит в основании.', 'A base side lies in the base.') },
      ],
    },
  ],
  holds: [3000, 4000, 4000, 4500, 4000, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch: doira yuzasi. Silindrning asosi shu.", 'Первая опора: площадь круга. Это основание цилиндра.', 'The first basic: the area of a circle. That is the cylinder base.'),
    A('c2', "Ikkinchi tayanch: ko'pburchak yuzasi. Prizmaning asosi har qanday ko'pburchak bo'lishi mumkin.", 'Вторая опора: площадь многоугольника. Основанием призмы может быть любой многоугольник.', 'The second basic: polygon area. A prism base can be any polygon.'),
    A('c3', "Uchinchi tayanch: balandlik. Bu asoslar orasidagi perpendikulyar, va u yon qirra bilan bir xil emas. Bugun aynan shu farq muhim bo'ladi.", 'Третья опора: высота. Это перпендикуляр между основаниями, и это не боковое ребро. Сегодня как раз эта разница и будет важна.', 'The third basic: the height. It is the perpendicular between the bases, not a side edge. Today that very difference will matter.'),
    A('recap', "Uchtasi birga bugungi formulani beradi.", 'Три вместе и дают сегодняшнюю формулу.', 'The three together give today\'s formula.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. QATLAMLARNI SANAYMIZ.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'cavalieri',
  eyebrow: L('Qatlamlarga bo\'lamiz', 'Разделим на слои', 'Split into layers'),
  title: L('Qatlamlar bir xil', 'Слои одинаковы', 'The layers are alike'),
  expr: L('silindr:  r = 2,  h = 3', 'цилиндр: r = 2, h = 3', 'cylinder: r = 2, h = 3'),
  goal: L('hajmni qatlamlardan yig\'ish', 'собрать объём из слоёв', 'build the volume from layers'),
  rule: L(
    "Jismni yupqa qatlamlarga bo'lamiz va yig'amiz.",
    'Разделим тело на тонкие слои и сложим.',
    'Let us split the solid into thin layers and add them.',
  ),
  pick: L('Nechta qatlam olamiz?', 'Сколько слоёв возьмём?', 'How many layers shall we take?'),
  claims: [
    { id: 'a', key: 'inA', name: L('taxminiy', 'приблизительно', 'approximate'), value: '≈' },
    { id: 'b', key: 'inB', name: L('aniq', 'точно', 'exact'), value: '=' },
  ],
  points: [
    {
      id: 'q1', label: L('3 qatlam', '3 слоя', '3 layers'), num: '12π', step: 'calc', verdict: 'in',
      role: L('har biri 4π · 1', 'каждый 4π · 1', 'each 4π · 1'),
      calc: '4π · 1 · 3 = 12π',
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q2', label: L('6 qatlam', '6 слоёв', '6 layers'), num: '12π', step: 'calc', verdict: 'in',
      role: L("yupqaroq, lekin o'sha", 'тоньше, но то же', 'thinner, yet the same'),
      calc: '4π · 0,5 · 6 = 12π',
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q3', label: L('12 qatlam', '12 слоёв', '12 layers'), num: '12π', step: 'calc', verdict: 'in',
      role: L("yana o'sha", 'снова то же', 'the same again'),
      calc: '4π · 0,25 · 12 = 12π',
      sol: true, inA: false, inB: true,
    },
  ],
  probe: {
    question: L("Nega qatlamlar soni javobni o'zgartirmaydi?", 'Почему число слоёв не меняет ответ?', 'Why does the layer count not change the answer?'),
    items: [
      {
        id: 'b', label: L('qatlamlar bir xil, kesim hamma joyda bir', 'слои одинаковы, сечение везде одно', 'the layers are alike, the section is the same everywhere'), correct: true,
        ok: L(
          "To'g'ri. Silindrda har bir kesim bir xil doira, shuning uchun yig'indi taxminiy emas, ANIQ chiqadi. Sharda bunday bo'lmaydi, va u yerda limit kerak bo'ladi.",
          'Верно. У цилиндра каждое сечение это один и тот же круг, поэтому сумма не приблизительная, а ТОЧНАЯ. У шара так не выйдет, и там понадобится предел.',
          'Correct. In a cylinder every section is the same circle, so the sum is not approximate but EXACT. A ball will not behave so, and there a limit is needed.',
        ),
      },
      {
        id: 'a', label: L('tasodif', 'случайность', 'chance'),
        hint: L("Tasodif emas: uch marta bir xil chiqdi, va sabab bor.", 'Не случайность: трижды вышло одно, и причина есть.', 'Not chance: three times the same, and there is a reason.'),
      },
      {
        id: 'c', label: L('sonlar qulay tanlangan', 'числа подобраны удобно', 'the numbers were chosen kindly'),
        hint: L("Har qanday sonda shunday bo'ladi: qalinlik kamayadi, soni ortadi.", 'Так будет при любых числах: толщина падает, число растёт.', 'It holds for any numbers: thickness falls, count rises.'),
      },
      {
        id: 'd', label: L("qatlamlar juda yupqa", 'слои слишком тонкие', 'the layers are too thin'),
        hint: L("Uchta qatlam yupqa emas, lekin javob o'sha.", 'Три слоя не тонкие, а ответ тот же.', 'Three layers are not thin, yet the answer is the same.'),
      },
    ],
  },
  holds: [2500, 5500, 1500, 2500, 9500, 4000],
  audio: [
    A('mount', "Tayanch tiklandi. Endi jismni qatlamlarga bo'lamiz.", 'Опора восстановлена. Теперь разделим тело на слои.', 'The basics are back. Now let us split the solid into layers.'),
    A('mount', "Har bir qatlam yupqa silindr: uning hajmi asos yuzasi karra qalinlik.", 'Каждый слой это тонкий цилиндр: его объём площадь основания на толщину.', 'Each layer is a thin cylinder: its volume is the base area times the thickness.'),
    A('mount', "Nechta qatlam olishni tanlang.", 'Выбери, сколько слоёв взять.', 'Choose how many layers to take.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Uch marta sanadik, uch marta o'n ikki pi chiqdi. Sabab: silindrning hamma kesimlari bir xil doira. Qatlam qalinligi ikki barobar kamaysa, soni ikki barobar ortadi, va ko'paytma o'zgarmaydi. Shuning uchun bu yerda yig'indi taxminiy emas, aniq. Sharda esa kesimlar har xil bo'ladi, va o'ttiz uchinchi darsda bizga limit kerak bo'ladi.", 'Считали трижды, трижды вышло двенадцать пи. Причина: у цилиндра все сечения это один и тот же круг. Толщина слоя падает вдвое, число слоёв растёт вдвое, и произведение не меняется. Поэтому сумма здесь не приблизительная, а точная. А у шара сечения разные, и на тридцать третьем уроке нам понадобится предел.', 'We counted three times and got twelve pi three times. The reason: every section of a cylinder is the same circle. Halve the layer thickness and the count doubles, so the product holds. That is why the sum here is exact, not approximate. In a ball the sections differ, and in lesson thirty three we will need a limit.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: QATLAMLAR.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'cavalieri',
  eyebrow: L('Qatlamlar', 'Слои', 'Layers'),
  title: L('Jism qatlamlardan yig\'ilgan', 'Тело собрано из слоёв', 'The solid is built from layers'),
  chip: 'r = 2,  h = 3',
  solid: {
    fn: CYL,
    a: 0,
    b: 3,
    xDomain: [-0.5, 3.5],
    yDomain: [-2.7, 2.7],
    mode: 'disks',
    spin: 1,
    diskSteps: [3, 6, 12],
    showV: true,
    interactive: true,
    height: 152,
    caption: L('jismni barmoq bilan burish mumkin', 'тело можно повернуть пальцем', 'you can turn the solid with a finger'),
  },
  cellSteps: 3,
  bonus: L(
    "Qatlamlar soni ortdi, qalinligi kamaydi, lekin son o'zgarmadi: o'n ikki pi. Silindrda har bir kesim bir xil, shuning uchun bu yig'indi aniq.",
    'Слоёв стало больше, толщина меньше, а число не изменилось: двенадцать пи. У цилиндра каждое сечение одинаково, поэтому сумма точная.',
    'More layers, thinner ones, and the number held: twelve pi. Every section of a cylinder is alike, so the sum is exact.',
  ),
  probe: {
    question: L("Bitta qatlamning hajmi nimaga teng?", 'Чему равен объём одного слоя?', 'What is the volume of one layer?'),
    items: [
      { id: 'a', label: L('asos yuzasi karra qalinlik', 'площадь основания на толщину', 'base area times thickness'), correct: true },
      { id: 'b', label: L('asos yuzasi karra balandlik', 'площадь основания на высоту', 'base area times height'), hint: L("Bu butun jismning hajmi, bitta qatlamniki emas.", 'Это объём всего тела, а не одного слоя.', 'That is the whole solid, not one layer.') },
      { id: 'c', label: L('aylana uzunligi karra qalinlik', 'длина окружности на толщину', 'circumference times thickness'), hint: L("Bu qatlamning YON SIRTI, hajmi emas.", 'Это БОКОВАЯ ПОВЕРХНОСТЬ слоя, а не объём.', 'That is the layer SIDE SURFACE, not its volume.') },
      { id: 'd', label: L('qalinlik kubda', 'толщина в кубе', 'thickness cubed'), hint: L("Kub faqat uchala o'lcham teng bo'lganda.", 'Куб только когда все три размера равны.', 'A cube only when all three sizes are equal.') },
    ],
  },
  holds: [2900, 4500, 4500, 6500],
  audio: [
    A('mount', "Sonlar sanaldi. Endi qatlamlarni ko'ramiz.", 'Числа посчитаны. Теперь увидим слои.', 'The numbers are computed. Now let us see the layers.'),
    A('one', "Uchta qatlam. Har biri yupqa silindr, hajmi asos karra qalinlik.", 'Три слоя. Каждый тонкий цилиндр, объём основание на толщину.', 'Three layers. Each a thin cylinder, volume base times thickness.'),
    A('two', "Olti qatlam: yupqaroq, ko'proq. Son o'sha.", 'Шесть слоёв: тоньше, больше. Число то же.', 'Six layers: thinner, more of them. The number holds.'),
    A('three', "O'n ikki qatlam, va son yana o'zgarmadi. Bu silindrning xossasi: hamma kesimlar bir xil.", 'Двенадцать слоёв, и число снова не изменилось. Это свойство цилиндра: все сечения одинаковы.', 'Twelve layers, and the number held again. That is the cylinder property: all sections are alike.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'cavalieri',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Hajm: asos karra balandlik', 'Объём: основание на высоту', 'Volume: base times height'),
  rows: ['V = S · h', 'V = 4π · 3 = 12π'],
  probe: {
    question: L(
      "Prizma: asos 6, balandlik 4. Hajm?",
      'Призма: основание 6, высота 4. Объём?',
      'A prism: base 6, height 4. Volume?',
    ),
    items: [
      { id: 'a', label: '24', correct: true },
      { id: 'b', label: '10', hint: L("Qo'shish emas, ko'paytirish.", 'Не сложение, а умножение.', 'Not adding but multiplying.') },
      { id: 'c', label: '12', hint: L("Ikkiga bo'lish kerak emas.", 'Делить на два не нужно.', 'No halving needed.') },
      { id: 'd', label: '48', hint: L("Ikki barobar ko'p.", 'Вдвое больше.', 'Twice too much.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Hajm', 'Правило 1. Объём', 'Rule 1. Volume'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'V = S · h',
    lines: [
      L("prizma va silindr uchun formula BIR XIL", 'для призмы и цилиндра формула ОДНА', 'the formula is THE SAME for prism and cylinder'),
      L('farq faqat asosda: ko\'pburchak yoki doira', 'разница только в основании: многоугольник или круг', 'only the base differs: a polygon or a circle'),
      L("h -- balandlik, ya'ni perpendikulyar", 'h это высота, то есть перпендикуляр', 'h is the height, that is the perpendicular'),
      L("qatlamlar bir xil bo'lgani uchun yig'indi aniq", 'слои одинаковы, поэтому сумма точная', 'the layers are alike, so the sum is exact'),
    ],
    example: L('misol:  6 · 4 = 24', 'пример:  6 · 4 = 24', 'example:  6 · 4 = 24'),
  },
  holds: [4000, 6000, 4500],
  audio: [
    A('mount', "Qatlamlar ko'rildi. Endi formulani yozamiz.", 'Слои увидели. Теперь запишем формулу.', 'We saw the layers. Now let us write the formula.'),
    A('def', "Prizma va silindr uchun formula bitta: hajm asos yuzasi karra balandlik. Farq faqat asosda. Prizmada u ko'pburchak, silindrda doira, lekin ikkalasi ham bir xil ishlaydi, chunki ikkalasi ham bir xil qatlamlardan yig'ilgan.", 'Для призмы и цилиндра формула одна: объём это площадь основания на высоту. Разница только в основании. У призмы многоугольник, у цилиндра круг, но работают они одинаково, потому что оба собраны из одинаковых слоёв.', 'For a prism and a cylinder the formula is one: volume is base area times height. Only the base differs. A polygon for a prism, a circle for a cylinder, yet both behave alike, because both are built from identical layers.'),
    A('rule', "To'g'ri. Va diqqat: formulada balandlik turadi, yon qirra emas.", 'Верно. И внимание: в формуле стоит высота, а не боковое ребро.', 'Correct. And note: the formula holds the height, not a side edge.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: qiya jism.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'cavalieri',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Qiya silindr', 'Наклонный цилиндр', 'A tilted cylinder'),
  was: { label: UI.was, expr: L('to\'g\'ri:  h = 3,  V = 12π', 'прямой: h = 3, V = 12π', 'upright: h = 3, V = 12π') },
  now: { label: UI.now, expr: L('qiya:  yasovchi 5,  h = 3', 'наклонный: образующая 5, h = 3', 'tilted: generator 5, h = 3') },
  probe1: {
    question: L('Formulaga nimani qo\'yamiz?', 'Что подставить в формулу?', 'What goes into the formula?'),
    items: [
      { id: 'a', label: L('balandlikni, 3', 'высоту, 3', 'the height, 3'), correct: true },
      { id: 'b', label: L('yasovchini, 5', 'образующую, 5', 'the generator, 5'), hint: L("Yasovchi qiya ketadi. Qatlamlar esa gorizontal yotadi, va ular balandlik bo'ylab taxlanadi.", 'Образующая идёт наклонно. А слои лежат горизонтально и укладываются по высоте.', 'The generator runs slanted. The layers lie flat and stack along the height.') },
      { id: 'c', label: L("ikkalasining o'rtachasini", 'среднее из двух', 'the average of both'), hint: L("O'rtacha bu yerda ma'nosiz: qatlamlar soni balandlik bilan aniqlanadi.", 'Среднее здесь бессмысленно: число слоёв задаёт высота.', 'An average is meaningless here: the height sets how many layers fit.') },
      { id: 'd', label: L("hech qaysini", 'ничего', 'neither'), hint: L("Hajmni sanash mumkin: asos va balandlik yetadi.", 'Объём посчитать можно: хватает основания и высоты.', 'The volume can be found: the base and the height suffice.') },
    ],
  },
  probe2: {
    cols: 4,
    question: L('Qiya silindrning hajmi?', 'Объём наклонного цилиндра?', 'The volume of the tilted cylinder?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '12π' },
      { id: 'b', label: '20π' },
      { id: 'c', label: '16π' },
      { id: 'd', label: '10π' },
    ],
  },
  holds: [4500, 5500, 2500, 3000],
  audio: [
    A('mount', "To'g'ri silindr uchun javob o'n ikki pi edi.", 'Для прямого цилиндра ответ был двенадцать пи.', 'For the upright cylinder the answer was twelve pi.'),
    A('now', "Endi uni qiyalantiramiz. Asos o'sha, balandlik o'sha uch, lekin yasovchi endi besh. Ikkita son bor, va ulardan bittasi formulaga tushadi.", 'Теперь наклоним его. Основание то же, высота те же три, но образующая теперь пять. Есть два числа, и одно из них идёт в формулу.', 'Now let us tilt it. The same base, the same height of three, but the generator is now five. Two numbers, and one of them goes into the formula.'),
    A('q1', "Formulaga nimani qo'yamiz?", 'Что подставить в формулу?', 'What goes into the formula?'),
    A('q2', "Sizningcha hajm qancha? Shunchaki taxmin qiling.", 'Как думаешь, чему равен объём? Просто предположи.', 'What do you think the volume is? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'cavalieri',
  eyebrow: L('Ikkalasini tekshiramiz', 'Проверим оба', 'Let us check both'),
  title: L('Ikki nomzod', 'Два кандидата', 'Two candidates'),
  expr: L('qiya silindr:  asos 4π', 'наклонный: основание 4π', 'tilted: base 4π'),
  need: '= ?',
  answerLabel: L('hajm', 'объём', 'the volume'),
  cards: [
    {
      tag: L('A nomzod', 'кандидат A', 'candidate A'),
      txt: '4π · 5 = 20π',
      point: {
        label: L('yasovchi qo\'yilgan', 'подставлена образующая', 'the generator was used'),
        calc: L('qatlamlar sig\'maydi   ✗', 'слои не помещаются   ✗', 'the layers do not fit   ✗'),
        verdict: 'out',
      },
    },
    {
      tag: L('B nomzod', 'кандидат B', 'candidate B'),
      txt: '4π · 3 = 12π',
      point: {
        label: L('balandlik qo\'yilgan', 'подставлена высота', 'the height was used'),
        calc: L("o'sha tangalar   ✓", 'те же монеты   ✓', 'the same coins   ✓'),
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['12π', '20π', '16π', '10π'],
    value: ['12π'],
    label: 'V =',
    prompt: L('Hajmni yozing', 'Запиши объём', 'Write the volume'),
    wrongs: [
      { key: '20π', hint: L("Yasovchi qo'yilgan. Qiya ustunda tangalar soni o'zgarmadi, demak hajm ham o'zgarmaydi.", 'Подставлена образующая. В наклонной стопке число монет не изменилось, значит и объём тот же.', 'The generator was used. Tilting the stack did not change the coin count, so the volume holds.') },
      { key: '16π', hint: L("Bu oraliq son: na balandlik, na yasovchi.", 'Это промежуточное число: ни высота, ни образующая.', 'That is in between: neither the height nor the generator.') },
      { key: '*', hint: L("To'rt pi karra uch.", 'Четыре пи на три.', 'Four pi times three.') },
    ],
  },
  holds: [3500, 5500, 6000, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi ikkala nomzodni ham tekshiramiz.', 'Прогноз есть. Теперь проверим обоих кандидатов.', 'The guess is made. Now let us check both candidates.'),
    A('p1', "Birinchi nomzod yasovchini qo'ydi va yigirma pi oldi. Lekin tangalarni eslang: ustunni qiyalantirganda ularning soni o'zgarmadi. Qatlamlar gorizontal yotadi va ular balandlik bo'ylab taxlanadi, yasovchi bo'ylab emas.", 'Первый кандидат подставил образующую и получил двадцать пи. Но вспомни монеты: при наклоне стопки их число не изменилось. Слои лежат горизонтально и укладываются по высоте, а не вдоль образующей.', 'The first candidate used the generator and got twenty pi. But recall the coins: tilting the stack did not change their count. The layers lie flat and stack along the height, not along the generator.'),
    A('p2', "Ikkinchi nomzod balandlikni qo'ydi: o'n ikki pi, ya'ni to'g'ri silindrdagi bilan bir xil. Bu Kavalyeri prinsipi: agar ikki jismning asoslari teng bo'lsa va har bir balandlikda kesimlari teng bo'lsa, hajmlari ham teng.", 'Второй кандидат подставил высоту: двенадцать пи, столько же, сколько у прямого. Это принцип Кавальери: если у двух тел равные основания и на каждой высоте равные сечения, то и объёмы равны.', 'The second candidate used the height: twelve pi, the same as the upright one. This is the Cavalieri principle: if two solids have equal bases and equal sections at every height, their volumes are equal.'),
    A('write', "Hajmni yozing.", 'Запиши объём.', 'Write the volume.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2: KAVALYERI.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'cavalieri',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Qiyalik hajmni o\'zgartirmaydi', 'Наклон не меняет объём', 'Tilting does not change the volume'),
  cases: [
    {
      label: L("to'g'ri", 'прямой', 'upright'),
      text: '4π · 3 = 12π',
      tone: 'graph',
    },
    {
      label: L('qiya', 'наклонный', 'tilted'),
      text: '4π · 3 = 12π',
      tone: 'accent',
    },
  ],
  rows: [
    L('asoslar teng, kesimlar teng', 'основания равны, сечения равны', 'equal bases, equal sections'),
    L('demak hajmlar ham teng', 'значит равны и объёмы', 'so the volumes are equal too'),
  ],
  probe: {
    question: L(
      "Kavalyeri prinsipi nima deydi?",
      'Что говорит принцип Кавальери?',
      'What does the Cavalieri principle say?',
    ),
    items: [
      { id: 'a', label: L('kesimlar teng bo\'lsa, hajmlar teng', 'равны сечения — равны объёмы', 'equal sections mean equal volumes'), correct: true },
      { id: 'b', label: L('qiya jismning hajmi kattaroq', 'у наклонного тела объём больше', 'a tilted solid has more volume'), hint: L("Aksincha: hajm o'zgarmaydi.", 'Наоборот: объём не меняется.', 'On the contrary: the volume does not change.') },
      { id: 'c', label: L('hamma jismlarning hajmi teng', 'у всех тел объёмы равны', 'all solids have equal volumes'), hint: L("Faqat kesimlari teng bo'lganlarniki: konusniki teng emas.", 'Только у тех, у кого равны сечения: у конуса не равны.', 'Only for those with equal sections: a cone does not qualify.') },
      { id: 'd', label: L("faqat silindr uchun", 'только для цилиндра', 'only for cylinders'), hint: L("Har qanday jism uchun: prizma, konus, shar.", 'Для любых тел: призмы, конуса, шара.', 'For any solids: prisms, cones, balls.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Kavalyeri', 'Правило 2. Кавальери', 'Rule 2. Cavalieri'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('teng kesimlar -- teng hajmlar', 'равные сечения — равные объёмы', 'equal sections mean equal volumes'),
    lines: [
      L('har bir balandlikda kesimlar teng bo\'lsa yetarli', 'достаточно, чтобы сечения были равны на каждой высоте', 'it suffices that sections match at every height'),
      L("shakl har xil bo'lishi mumkin, hajm o'sha", 'форма может быть разной, объём тот же', 'the shape may differ, the volume holds'),
      L("shuning uchun qiya jismda ham V = S · h", 'поэтому и у наклонного тела V = S · h', 'so a tilted solid also has V = S · h'),
      L('formulaga BALANDLIK tushadi, yon qirra emas', 'в формулу идёт ВЫСОТА, а не боковое ребро', 'the HEIGHT goes into the formula, not the side edge'),
    ],
    example: L('misol:  qiya ham 12π', 'пример:  у наклонного тоже 12π', 'example:  the tilted one is 12π too'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'V = S · h',
    lines: [
      L('1. asos yuzasini toping', '1. найди площадь основания', '1. find the base area'),
      L('2. BALANDLIKNI toping, yon qirrani emas', '2. найди ВЫСОТУ, а не боковое ребро', '2. find the HEIGHT, not the side edge'),
      L("3. ko'paytiring", '3. умножь', '3. multiply'),
      L('4. qiyalik javobga ta\'sir qilmaydi', '4. наклон на ответ не влияет', '4. tilting does not affect the answer'),
    ],
  },
  holds: [4000, 6000, 2900, 5000],
  audio: [
    A('mount', 'Ikkala nomzod tekshirildi. Endi qoidani yozamiz.', 'Оба кандидата проверены. Теперь запишем правило.', 'Both candidates are checked. Now let us write the rule.'),
    A('rows', "Bu Kavalyeri prinsipi. Agar ikki jismning har bir balandlikdagi kesimlari teng bo'lsa, ularning hajmlari ham teng. Tangalar ustuni buni yaxshi ko'rsatadi: qiyalantirsangiz ham, tangalar soni o'zgarmaydi.", 'Это принцип Кавальери. Если у двух тел на каждой высоте равные сечения, то равны и объёмы. Стопка монет показывает это лучше всего: как ни наклоняй, число монет не меняется.', 'This is the Cavalieri principle. If two solids have equal sections at every height, their volumes are equal. A stack of coins shows it best: tilt as you like, the coin count holds.'),
    A('q', "Savol: Kavalyeri prinsipi nima deydi?", 'Вопрос: что говорит принцип Кавальери?', 'The question: what does the Cavalieri principle say?'),
    A('rule', "To'g'ri. Va bu prinsip keyingi ikki darsda ham kerak bo'ladi: konus va shar hajmi ham shu yo'l bilan chiqariladi.", 'Верно. И этот принцип понадобится в следующих двух уроках: объёмы конуса и шара выводят тем же путём.', 'Correct. And this principle will serve in the next two lessons: the cone and ball volumes are derived the same way.'),
    A('both', 'Endi butun darsni bitta qoidaga yig\'ing.', 'А теперь собери весь урок в одно правило.', 'Now combine the whole lesson into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. AMALNI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'cavalieri',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Uzunlikni qo\'ying', 'Поставь длину', 'Place the length'),
  left: L('qiya prizma, asos 6, qirra 7', 'наклонная: основание 6, ребро 7', 'tilted: base 6, edge 7'),
  template: ['V = 6 · ', { slot: 0 }],
  signs: ['5', '7'],
  answer: '5',
  checkNote: L(
    "Qatlamlar BALANDLIK bo'ylab taxlanadi",
    'Слои укладываются по ВЫСОТЕ',
    'The layers stack along the HEIGHT',
  ),
  wrongs: [
    { key: '7', hint: L("Bu yon qirra: u qiya ketadi. Qatlamlar esa gorizontal.", 'Это боковое ребро: оно идёт наклонно. А слои горизонтальны.', 'That is the side edge: it runs slanted. The layers are horizontal.') },
  ],
  probe: {
    question: L("Nega qirra emas?", 'Почему не ребро?', 'Why not the edge?'),
    items: [
      { id: 'a', label: L('qatlamlar balandlik bo\'ylab taxlanadi', 'слои укладываются по высоте', 'the layers stack along the height'), correct: true },
      { id: 'b', label: L('qirra noaniq', 'ребро неточно', 'the edge is imprecise'), hint: L("Qirra aniq berilgan: yetti. Masala unda emas.", 'Ребро задано точно: семь. Дело не в этом.', 'The edge is given exactly: seven. That is not the issue.') },
      { id: 'c', label: L('qirra har doim ortiqcha', 'ребро всегда лишнее', 'the edge is always superfluous'), hint: L("Ortiqcha emas: yon sirtni sanashda u kerak.", 'Не лишнее: оно нужно для боковой поверхности.', 'Not superfluous: it is needed for the side surface.') },
      { id: 'd', label: L("shunday kelishilgan", 'так договорились', 'a convention'), hint: L("Kelishuv emas: tangalar ustuni buni ko'rsatdi.", 'Не договорённость: стопка монет это показала.', 'Not a convention: the coin stack showed it.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Uzunlikni qo'ying.", 'Поставь длину.', 'Place the length.'),
    A('checked', "Bo'ldi. Endi ta'riflang: nega qirra emas?", 'Получилось. Теперь сформулируй: почему не ребро?', 'Done. Now put it into words: why not the edge?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'base', label: L('asos yuzasini topish', 'найти площадь основания', 'find the base area') },
  { id: 'height', label: L('balandlikni aniqlash', 'определить высоту', 'identify the height') },
  { id: 'mul', label: L("ko'paytirish", 'умножить', 'multiply') },
  { id: 'side', label: L('yon sirtni sanash', 'посчитать боковую', 'compute the side area') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'cavalieri',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: L('qiya silindr: r = 3, h = 4', 'наклонный цилиндр: r = 3, h = 4', 'a tilted cylinder: r = 3, h = 4'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'base',
      to: 'π · 9 = 9π',
      wrongs: [
        { action: 'mul', hint: L("Avval nimani ko'paytirishni toping.", 'Сначала найди, что умножать.', 'First find what to multiply.') },
        { action: 'height', hint: L("Balandlik shartda berilgan: to'rt.", 'Высота дана в условии: четыре.', 'The height is given: four.') },
        { action: 'side', hint: L("Yon sirt bu yerda so'ralmagan.", 'Боковая здесь не спрашивается.', 'The side area is not asked here.') },
      ],
    },
    {
      action: 'mul',
      to: '9π · 4 = 36π',
      wrongs: [
        { action: 'base', hint: L("Topilgan: to'qqiz pi.", 'Найдено: девять пи.', 'Found: nine pi.') },
        { action: 'height', hint: L("Balandlik ma'lum.", 'Высота известна.', 'The height is known.') },
        { action: 'side', hint: L("Yon sirt kerak emas.", 'Боковая не нужна.', 'The side area is not needed.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['36π', '45π', '12π', '36'],
    value: ['36π'],
    label: 'V =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '45π', hint: L("Yasovchi qo'yilgan ko'rinadi. Qiyalik hajmni o'zgartirmaydi: balandlik to'rt.", 'Похоже, подставлена образующая. Наклон объём не меняет: высота четыре.', 'The generator seems to have been used. Tilting does not change the volume: the height is four.') },
      { key: '12π', hint: L("Radius kvadratga ko'tarilmagan.", 'Радиус не возведён в квадрат.', 'The radius was not squared.') },
      { key: '*', hint: L("To'qqiz pi karra to'rt.", 'Девять пи на четыре.', 'Nine pi times four.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi masalani o\'tamiz.', 'Правило сформулировано. Пройдём задачу.', 'The rule is stated. Let us work a problem.'),
    A('start', "Diqqat: jism qiya, lekin bu javobga ta'sir qilmaydi. Ro'yxatda ortiqcha amal bor.", 'Внимание: тело наклонное, но на ответ это не влияет. В списке есть лишнее действие.', 'Careful: the solid is tilted, but that does not affect the answer. The list has one superfluous action.'),
    A('step3', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL. Darslikdagi 295-masala.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'cavalieri',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Idishdagi detal', 'Деталь в сосуде', 'A part in a vessel'),
  start: L('3 l -> 15 sm,  detal +4 sm', '3 л -> 15 см,  деталь +4 см', '3 l -> 15 cm,  part +4 cm'),
  actions: ACTIONS_10,
  hint: L(
    "Bir santimetrga qancha suv to'g'ri keladi?",
    'Сколько воды приходится на один сантиметр?',
    'How much water sits in one centimetre?',
  ),
  steps: [
    {
      action: 'base',
      to: L('1 sm -> 0,2 l', '1 см -> 0,2 л', '1 cm -> 0,2 l'),
      wrongs: [
        { action: 'mul', hint: L("Avval bir santimetrga qancha suv to'g'ri kelishini toping.", 'Сначала найди, сколько воды на один сантиметр.', 'First find how much water sits in one centimetre.') },
        { action: 'height', hint: L("Balandliklar berilgan: o'n besh va to'rt.", 'Высоты даны: пятнадцать и четыре.', 'The heights are given: fifteen and four.') },
        { action: 'side', hint: L("Yon sirt bu yerda kerak emas.", 'Боковая здесь не нужна.', 'The side area is not needed here.') },
      ],
    },
    {
      action: 'mul',
      to: L('0,2 · 4 = 0,8 litr', '0,2 · 4 = 0,8 л', '0,2 · 4 = 0,8 litres'),
      wrongs: [
        { action: 'base', hint: L("Topilgan: nol butun ikki litr.", 'Найдено: ноль целых два литра.', 'Found: zero point two litres.') },
        { action: 'height', hint: L("Balandliklar ma'lum.", 'Высоты известны.', 'The heights are known.') },
        { action: 'side', hint: L("Kerak emas.", 'Не нужно.', 'Not needed.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['800', '600', '1200', '80'],
    value: ['800'],
    label: L("hajm, sm³ =", 'объём, см³ =', 'volume, cm³ ='),
    prompt: L('Detal hajmini yozing', 'Запиши объём детали', 'Write the volume of the part'),
    wrongs: [
      { key: '600', hint: L("Bu uch litrning beshdan bir qismi bo'lardi. Bizga to'rt santimetr kerak, uch emas.", 'Это была бы пятая часть трёх литров. Нам нужны четыре сантиметра, а не три.', 'That would be a fifth of three litres. We need four centimetres, not three.') },
      { key: '1200', hint: L("Ikki barobar ko'p: bir santimetrda nol butun ikki litr.", 'Вдвое больше: в одном сантиметре ноль целых два литра.', 'Twice too much: one centimetre holds zero point two litres.') },
      { key: '80', hint: L("O'n barobar kichik: nol butun sakkiz litr bu sakkiz yuz kub santimetr.", 'В десять раз меньше: ноль целых восемь литра это восемьсот кубических сантиметров.', 'Ten times too small: zero point eight litres is eight hundred cubic centimetres.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil. Bu masala darslikdan.", 'Теперь полностью сам. Эта задача из учебника.', 'Now completely on your own. This problem is from the textbook.'),
    A('go', "Idish silindr shaklida. Uch litr suv o'n besh santimetr ko'taradi. Detal suvga botirilganda daraja yana to'rt santimetrga ko'tarildi. Diqqat: idishning radiusi berilmagan, va u kerak ham emas.", 'Сосуд цилиндрический. Три литра воды дают пятнадцать сантиметров. Когда деталь погрузили, уровень поднялся ещё на четыре сантиметра. Внимание: радиус сосуда не дан, и он не нужен.', 'The vessel is cylindrical. Three litres of water give fifteen centimetres. When a part was submerged the level rose four centimetres more. Careful: the vessel radius is not given, and it is not needed.'),
    A('answered', "Javobni kub santimetrda yozing.", 'Запиши ответ в кубических сантиметрах.', 'Write the answer in cubic centimetres.'),
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
      id: 'b1', tag: 'cavalieri', ask: true, cols: 4,
      done: '12π',
      prompt: L('r = 2, h = 3. Silindr hajmi?', 'r = 2, h = 3. Объём цилиндра?', 'r = 2, h = 3. The cylinder volume?'),
      items: [
        { id: 'a', label: '12π', correct: true },
        { id: 'b', label: '6π', hint: L("Radius kvadratda.", 'Радиус в квадрате.', 'The radius is squared.') },
        { id: 'c', label: '24π', hint: L("Ikki barobar ko'p.", 'Вдвое больше.', 'Twice too much.') },
        { id: 'd', label: '12', hint: L("Pi tushib qolgan.", 'Потерялось пи.', 'Pi is missing.') },
      ],
    },
    {
      id: 'b2', tag: 'cavalieri', ask: true, cols: 2,
      done: L("o'zgarmaydi", 'не изменится', 'unchanged'),
      prompt: L('Jismni qiyalantirdik. Hajm?', 'Тело наклонили. Объём?', 'The solid was tilted. The volume?'),
      items: [
        { id: 'a', label: L("o'zgarmaydi", 'не изменится', 'unchanged'), correct: true },
        { id: 'b', label: L('ortadi', 'вырастет', 'grows'), hint: L("Tangalar soni o'zgarmadi.", 'Число монет не изменилось.', 'The coin count did not change.') },
        { id: 'c', label: L('kamayadi', 'уменьшится', 'shrinks'), hint: L("Hech narsa yo'qolmadi.", 'Ничего не исчезло.', 'Nothing was lost.') },
        { id: 'd', label: L("burchakka bog'liq", 'зависит от угла', 'depends on the angle'), hint: L("Bog'liq emas: Kavalyeri prinsipi.", 'Не зависит: принцип Кавальери.', 'It does not: Cavalieri.') },
      ],
    },
    {
      id: 'b3', tag: 'cavalieri', ask: true, cols: 2,
      done: L('balandlik', 'высота', 'the height'),
      prompt: L('Qiya jismda formulaga nima tushadi?', 'Что идёт в формулу у наклонного тела?', 'What goes into the formula for a tilted solid?'),
      items: [
        { id: 'a', label: L('balandlik', 'высота', 'the height'), correct: true },
        { id: 'b', label: L('yon qirra', 'боковое ребро', 'the side edge'), hint: L("Qirra qiya ketadi, qatlamlar esa gorizontal.", 'Ребро идёт наклонно, а слои горизонтальны.', 'The edge runs slanted, the layers are horizontal.') },
        { id: 'c', label: L("o'rtachasi", 'среднее', 'the average'), hint: L("O'rtacha bu yerda ma'nosiz.", 'Среднее здесь бессмысленно.', 'An average is meaningless here.') },
        { id: 'd', label: L('diagonal', 'диагональ', 'the diagonal'), hint: L("Diagonal umuman boshqa kesma.", 'Диагональ это совсем другой отрезок.', 'The diagonal is another segment entirely.') },
      ],
    },
    {
      id: 'b4', tag: 'cavalieri', ask: true, cols: 4,
      done: '24',
      prompt: L('Prizma: asos 6, h = 4. Hajm?', 'Призма: основание 6, h = 4. Объём?', 'Prism: base 6, h = 4. Volume?'),
      items: [
        { id: 'a', label: '24', correct: true },
        { id: 'b', label: '10', hint: L("Ko'paytirish kerak.", 'Нужно умножение.', 'Multiplying is needed.') },
        { id: 'c', label: '12', hint: L("Ikkiga bo'lish kerak emas.", 'Делить на два не нужно.', 'No halving needed.') },
        { id: 'd', label: '48', hint: L("Ikki barobar ko'p.", 'Вдвое больше.', 'Twice too much.') },
      ],
    },
    {
      id: 'b5', tag: 'cavalieri', ask: true, cols: 2,
      done: L('aniq', 'точная', 'exact'),
      prompt: L(
        "Silindrda qatlamlar yig'indisi taxminiymi?",
        'Сумма слоёв у цилиндра приблизительная?',
        'Is the layer sum for a cylinder approximate?',
      ),
      items: [
        { id: 'a', label: L("yo'q, aniq", 'нет, точная', 'no, exact'), correct: true },
        { id: 'b', label: L('ha, taxminiy', 'да, приблизительная', 'yes, approximate'), hint: L("Kesimlar bir xil bo'lgani uchun aniq. Sharda taxminiy bo'ladi.", 'Точная, потому что сечения одинаковы. У шара будет приблизительная.', 'Exact, because the sections are alike. A ball will be approximate.') },
        { id: 'c', label: L("qatlamlar soniga bog'liq", 'зависит от числа слоёв', 'depends on the count'), hint: L("Bog'liq emas: uch, olti va o'n ikkida bir xil chiqdi.", 'Не зависит: при трёх, шести и двенадцати вышло одно.', 'It does not: three, six and twelve gave the same.') },
        { id: 'd', label: L("radiusga bog'liq", 'зависит от радиуса', 'depends on the radius'), hint: L("Bog'liq emas.", 'Не зависит.', 'It does not.') },
      ],
    },
    {
      id: 'b6', tag: 'cavalieri', ask: true, cols: 4,
      done: '400',
      prompt: L('1 sm -> 0,1 l. 4 sm necha sm³?', '1 см -> 0,1 л. 4 см это сколько см³?', '1 cm -> 0,1 l. How many cm³ in 4 cm?'),
      items: [
        { id: 'a', label: '400', correct: true },
        { id: 'b', label: '40', hint: L("Bir litr ming kub santimetr.", 'Один литр это тысяча кубических сантиметров.', 'One litre is a thousand cubic centimetres.') },
        { id: 'c', label: '4000', hint: L("O'n barobar ko'p: nol butun to'rt litr.", 'В десять раз больше: ноль целых четыре литра.', 'Ten times too much: zero point four litres.') },
        { id: 'd', label: '0,4', hint: L("Bu litrda. So'ralgani kub santimetr.", 'Это в литрах. Спрашивают кубические сантиметры.', 'That is in litres. Cubic centimetres are asked.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Qiyalik haqida.", 'Про наклон.', 'About tilting.'),
    A('q3', "Formulaga nima tushadi.", 'Что идёт в формулу.', 'What goes into the formula.'),
    A('q4', "Prizma.", 'Призма.', 'A prism.'),
    A('q5', "Qatlamlar haqida.", 'Про слои.', 'About the layers.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'cavalieri',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Qiya jismda qirra qo\'yilgan', 'У наклонного подставили ребро', 'The edge was used for a tilted solid'),
  rows: [
    { id: 'r1', text: L('qiya silindr: r = 2, h = 3, yasovchi 5', 'наклонный: r = 2, h = 3, образующая 5', 'tilted: r = 2, h = 3, generator 5') },
    { id: 'r2', text: L('asos: π · 4 = 4π', 'основание: π · 4 = 4π', 'base: π · 4 = 4π') },
    { id: 'r3', text: '4π · 5 = 20π' },
    { id: 'r4', text: L('javob: 20π', 'ответ: 20π', 'answer: 20π') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Asos to'g'ri sanalgan.", 'Основание посчитано верно.', 'The base is right.'),
    r4: L("Javob xato, lekin u oldingi satrda xato bo'lgan.", 'Ответ неверный, но неверным он стал строкой раньше.', 'The answer is wrong, but it became wrong one line earlier.'),
  },
  proofPoint: L('qatlamlar balandlik bo\'ylab', 'слои по высоте', 'layers along the height'),
  proof: L(
    "Qiyalik hajmni o'zgartirmaydi. Tangalar ustunini eslang: qiyalantirganda tangalar soni o'zgarmadi. Formulaga balandlik tushadi, ya'ni uch, va javob o'n ikki pi.",
    'Наклон объём не меняет. Вспомни стопку монет: при наклоне число монет не изменилось. В формулу идёт высота, то есть три, и ответ двенадцать пи.',
    'Tilting does not change the volume. Recall the coin stack: tilting did not change the count. The height goes into the formula, that is three, and the answer is twelve pi.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('balandlik o\'rniga yasovchi', 'вместо высоты образующая', 'the generator instead of the height'), correct: true },
      { id: 'b', label: L("asos noto'g'ri", 'основание неверно', 'the base is wrong'), hint: L("Asos to'g'ri: pi karra to'rt.", 'Основание верно: пи на четыре.', 'The base is right: pi times four.') },
      { id: 'c', label: L("qiya jismda formula ishlamaydi", 'у наклонного формула не работает', 'the formula fails for tilted solids'), hint: L("Ishlaydi: Kavalyeri prinsipi shuni kafolatlaydi.", 'Работает: это и гарантирует принцип Кавальери.', 'It works: Cavalieri guarantees it.') },
      { id: 'd', label: L("arifmetikada xato", 'ошибка в арифметике', 'an arithmetic slip'), hint: L("Arifmetika to'g'ri: to'rt pi karra besh yigirma pi.", 'Арифметика верна: четыре пи на пять двадцать пи.', 'The arithmetic is right: four pi times five is twenty pi.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Xato birinchi marta paydo bo'lgan satrni toping.", 'Найди строку, в которой ошибка появилась впервые.', 'Find the line where the error first appeared.'),
    A('proof', "Qarang: qiyalik hajmni o'zgartirmaydi, va buni tangalar ustuni ko'rsatgan edi. Formulaga balandlik tushadi, ya'ni uch. Javob o'n ikki pi, yigirma emas.", 'Смотри: наклон объём не меняет, и это показала стопка монет. В формулу идёт высота, то есть три. Ответ двенадцать пи, а не двадцать.', 'Look: tilting does not change the volume, as the coin stack showed. The height goes into the formula, that is three. The answer is twelve pi, not twenty.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'cavalieri',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Yozuvni yig\'ing', 'Собери запись', 'Build the record'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: 'V = S · h',
  tasks: [
    {
      prompt: L('silindr: r = 3, h = 2', 'цилиндр: r = 3, h = 2', 'cylinder: r = 3, h = 2'),
      template: ['V = ', { slot: 0 }, ' · ', { slot: 1 }],
      parts: ['9π', '2', '6π', '3'],
      answer: ['9π', '2'],
      doneLabel: '9π · 2 = 18π',
      wrongs: [
        { key: '6π|2', hint: L("Olti pi bu aylana uzunligi, asos yuzasi emas.", 'Шесть пи это длина окружности, а не площадь основания.', 'Six pi is the circumference, not the base area.') },
        { key: '*', hint: L("Asos pi karra to'qqiz, balandlik ikki.", 'Основание пи на девять, высота два.', 'The base is pi times nine, the height two.') },
      ],
    },
    {
      prompt: L('qiya prizma: asos 5, h = 4, qirra 6', 'наклонная призма: основание 5, h = 4, ребро 6', 'tilted prism: base 5, h = 4, edge 6'),
      template: ['V = ', { slot: 0 }, ' · ', { slot: 1 }],
      parts: ['5', '4', '6', '20'],
      answer: ['5', '4'],
      doneLabel: '5 · 4 = 20',
      wrongs: [
        { key: '5|6', hint: L("Olti bu yon qirra. Qatlamlar balandlik bo'ylab taxlanadi.", 'Шесть это боковое ребро. Слои укладываются по высоте.', 'Six is the side edge. The layers stack along the height.') },
        { key: '*', hint: L("Asos besh, balandlik to'rt.", 'Основание пять, высота четыре.', 'The base is five, the height four.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi, va u yerda ortiqcha son bor.", 'А теперь второе, и там есть лишнее число.', 'And now the second, with one number too many.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'cavalieri',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: 'V = S · h',
  ruleLines: [
    L("prizma va silindrda formula bir xil", 'у призмы и цилиндра формула одна', 'prism and cylinder share the formula'),
    L('qiyalik hajmni o\'zgartirmaydi: Kavalyeri', 'наклон не меняет объём: Кавальери', 'tilting does not change the volume: Cavalieri'),
    L("qatlamlar bir xil, shuning uchun yig'indi aniq", 'слои одинаковы, поэтому сумма точная', 'the layers are alike, so the sum is exact'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('ustunni qiyalantirdik', 'наклонили стопку', 'the stack was tilted'),
      right: L("o'zgarmadi", 'не изменился', 'unchanged'),
      map: {
        a: L('ortdi', 'вырос', 'grew'),
        b: L("o'zgarmadi", 'не изменился', 'unchanged'),
        both: L('kamaydi', 'уменьшился', 'shrank'),
        none: L("bilib bo'lmaydi", 'не определить', 'cannot tell'),
      },
    },
    {
      screen: 5,
      expr: L('qiya silindr', 'наклонный цилиндр', 'tilted cylinder'),
      right: '12π',
      map: { a: '12π', b: '20π', c: '16π', d: '10π' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '12π  =  12π',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Qatlamlar ekraniga qayting', 'Вернись к экрану со слоями', 'Go back to the layers screen'),
  },
  probe: {
    question: L(
      "Sharda ham qatlamlar yig'indisi aniq bo'ladimi?",
      'У шара сумма слоёв тоже будет точной?',
      'Will the layer sum be exact for a ball too?',
    ),
    items: [
      { id: 'a', label: L("yo'q, kesimlar har xil", 'нет, сечения разные', 'no, the sections differ'), correct: true },
      { id: 'b', label: L('ha, har doim aniq', 'да, всегда точная', 'yes, always exact'), hint: L("Silindrda aniq, chunki kesimlar bir xil. Sharda ular kichrayadi.", 'У цилиндра точная, потому что сечения одинаковы. У шара они уменьшаются.', 'Exact for a cylinder because the sections match. In a ball they shrink.') },
      { id: 'c', label: L("qatlamlar soniga bog'liq", 'зависит от числа слоёв', 'depends on the count'), hint: L("Qatlam ko'paytirilsa yaqinlashadi, lekin aniq bo'lmaydi.", 'С ростом числа слоёв приближается, но точной не станет.', 'More layers get closer, but never exact.') },
      { id: 'd', label: L("shar uchun qatlam ishlamaydi", 'для шара слои не работают', 'layers fail for a ball'), hint: L("Ishlaydi, faqat limit bilan. Bu o'ttiz uchinchi dars.", 'Работают, только через предел. Это тридцать третий урок.', 'They work, but through a limit. That is lesson thirty three.') },
    ],
  },
  sheetTitle: L('Hajm · shpargalka', 'Объём · шпаргалка', 'Volume · cheat sheet'),
  sheetSrc: L('11-sinf · 31-dars', '11 класс · урок 31', 'Grade 11 · lesson 31'),
  lifehack: L(
    "Qiya jism ko'rsangiz, balandlikni qidiring: yon qirra javobga kirmaydi.",
    'Увидел наклонное тело — ищи высоту: боковое ребро в ответ не входит.',
    'See a tilted solid? Look for the height: the side edge is not in the answer.',
  ),
  holds: [2500, 5500, 7500, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Qiyalantirilgan ustunning hajmi o'zgarmadi.", 'Вот твои прогнозы и вот как оказалось. У наклонённой стопки объём не изменился.', 'Here are your guesses and here is how it turned out. The tilted stack kept its volume.'),
    A('rule', "Va mana asosiy fikr. Prizma va silindrning hajmi bitta formula bilan sanaladi: asos karra balandlik. Qiyalik javobga ta'sir qilmaydi, chunki qatlamlar soni o'zgarmaydi. Va yana bir narsa keyingi darslarga: bu yerda yig'indi aniq chiqdi, chunki hamma kesimlar bir xil edi. Konus va sharda ular har xil bo'ladi.", 'И вот главная мысль. Объём призмы и цилиндра считают одной формулой: основание на высоту. Наклон на ответ не влияет, потому что число слоёв не меняется. И ещё одно на будущее: здесь сумма вышла точной, потому что все сечения были одинаковы. У конуса и шара они будут разными.', 'And here is the main point. Prism and cylinder volumes share one formula: base times height. Tilting does not affect the answer, because the layer count holds. And one more thing for later: here the sum came out exact because all sections were alike. In a cone and a ball they will differ.'),
    A('q', "Oxirgi savol: sharda ham yig'indi aniq bo'ladimi?", 'Последний вопрос: у шара сумма тоже будет точной?', 'The last question: will the sum be exact for a ball too?'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
