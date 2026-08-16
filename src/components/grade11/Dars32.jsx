// ============================================================================
// 11-sinf, Dars 32. PIRAMIDA VA KONUS HAJMI.
//
// B4 blokining oltinchi darsi. Faqat MA'LUMOT.
//   kontrakt: src/books/grade11/ETALON_11SINF.md
//   asbob:    `SpinBoard`, `pour` va `disks` rejimlari
//
// DARSNING BITTA GAPI: uchdan bir koeffitsienti yodlanmaydi -- u avval
// TO'KISH bilan ko'riladi, keyin disklar bilan isbotlanadi.
//
// IKKI QADAM ATAYLAB AJRATILGAN. To'kish -- bu TAXMIN: konus silindrga uch
// marta sig'di. Taxmin isbot emas, va buni o'quvchiga ochiq aytamiz.
// Isbot disklardan chiqadi: kesim radiusi chiziqli o'sadi, yuza esa
// kvadratik, va kvadratlar yig'indisi to'g'ri to'rtburchaknikidan roppa
// rosa uch barobar kichik. Bu darslikdagi yo'l (2-qism, 4-8 betlar), faqat
// integral belgisisiz -- integralning o'zi 4-darsda berilgan.
//
// Sonlar tekshirilgan: konus r = 3, h = 4 -> 12 pi; o'sha asos va
// balandlikdagi silindr 36 pi; nisbat aniq uchdan bir. Integral bilan
// sonli tekshiruv: 37,6991, ya'ni 12 pi.
//
// Konus 28-darsdagi bilan BIR XIL: r = 3, h = 4, l = 5. O'quvchi jismni
// tanib turadi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_32',
  title: L('Piramida va konus hajmi', 'Объём пирамиды и конуса', 'Volume of a pyramid and a cone'),
}

const BLOCK = { label: 'B4', from: 26, to: 33, current: 32 }

// Konus profili: x = 0 da uch, x = 4 da radius 3.
const CONE = (x) => (3 * x) / 4

// ============================================================
// SLAYD 1. XUK. Necha marta sig'adi.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Hajm', 'Объём', 'Volume'),
  title: L('Necha marta sig\'adi', 'Сколько раз поместится', 'How many times it fits'),
  expr: L('bir xil asos va balandlik', 'одно основание и высота', 'same base, same height'),
  rows: [
    {
      id: 'a',
      name: L('birinchi', 'первый', 'the first'),
      value: L('ikki marta', 'два раза', 'twice'),
    },
    {
      id: 'b',
      name: L('ikkinchi', 'второй', 'the second'),
      value: L('uch marta', 'три раза', 'three times'),
    },
  ],
  probe: {
    question: L('Konus silindrga necha marta sig\'adi?', 'Сколько раз конус поместится в цилиндр?', 'How many times does the cone fit the cylinder?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi to'kib ko'ramiz.",
      'Твой ответ записан. Сейчас перельём и посмотрим.',
      'Your answer is saved. Now let us pour and see.',
    ),
    items: [
      { id: 'a', label: '2' },
      { id: 'b', label: '3' },
      { id: 'both', label: '1,5' },
      { id: 'none', label: '4' },
    ],
  },
  holds: [5000, 4000, 2500, 4000],
  audio: [
    A('mount', "O'tgan darsda hajm asos karra balandlik ekanini ko'rdik. Lekin bu faqat qatlamlari bir xil jismlar uchun. Konusda qatlamlar har xil, va formula boshqacha bo'ladi.", 'На прошлом уроке мы видели, что объём это основание на высоту. Но это только для тел с одинаковыми слоями. У конуса слои разные, и формула будет другой.', 'Last lesson we saw that volume is base times height. But that holds only for solids with identical layers. A cone has different layers, and its formula will differ.'),
    A('r1', "Konus va silindr olamiz: asoslari bir xil, balandliklari ham. Konusni suvga to'ldirib, silindrga to'kamiz. Birinchi fikr: ikki marta to'ldiradi.", 'Возьмём конус и цилиндр: основания одинаковы, высоты тоже. Наполним конус водой и перельём в цилиндр. Первое мнение: наполнит за два раза.', 'Take a cone and a cylinder with the same base and height. Fill the cone with water and pour it into the cylinder. The first opinion: two pours fill it.'),
    A('r2', "Ikkinchi fikr: uch marta.", 'Второе мнение: за три раза.', 'The second opinion: three pours.'),
    A('ask', "Sizningcha necha marta? Hozircha shunchaki taxmin qiling.", 'Как думаешь, сколько раз? Пока просто предположи.', 'How many times do you think? Just make a guess for now.'),
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
    "Uchtasi ham o'tgan darslardan. Bu baholanmaydi.",
    'Все три с прошлых уроков. Это не оценивается.',
    'All three from earlier lessons. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Silindr hajmi', 'Объём цилиндра', 'Cylinder volume'),
      short: L('31-darsdan', 'из урока 31', 'from lesson 31'),
      ex: [{ e: 'V = S · h', why: L('qatlamlar bir xil', 'слои одинаковы', 'the layers are alike') }],
    },
    {
      id: 'c2',
      title: L('Konus kesimi', 'Сечение конуса', 'A cone section'),
      short: L('28-darsdan', 'из урока 28', 'from lesson 28'),
      ex: [{ e: L('uchga yaqin -- kichikroq', 'ближе к вершине меньше', 'smaller near the apex'), why: L('radius tekis kamayadi', 'радиус убывает равномерно', 'the radius shrinks evenly') }],
    },
    {
      id: 'c3',
      title: L('Doira yuzasi', 'Площадь круга', 'Circle area'),
      short: L('8-sinfdan', 'из 8 класса', 'from grade 8'),
      ex: [{ e: 'S = πr²', why: L('radius kvadratda', 'радиус в квадрате', 'the radius is squared') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L('r = 3, h = 4. Silindr hajmi?', 'r = 3, h = 4. Объём цилиндра?', 'r = 3, h = 4. Cylinder volume?'),
      cols: 4,
      items: [
        { id: 'a', label: '36π', correct: true },
        { id: 'b', label: '12π', hint: L("Bu konusniki bo'lib chiqadi. Silindrda uchdan bir yo'q.", 'Это окажется объёмом конуса. У цилиндра трети нет.', 'That will turn out to be the cone. A cylinder has no third.') },
        { id: 'c', label: '24π', hint: L("Radius kvadratda: uch kvadrat to'qqiz.", 'Радиус в квадрате: три в квадрате девять.', 'The radius is squared: three squared is nine.') },
        { id: 'd', label: '9π', hint: L("Bu asos yuzasi, balandlik hisobga olinmagan.", 'Это площадь основания, высота не учтена.', 'That is the base area, the height was ignored.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L("Balandlik yarmida konus radiusi (r = 3)?", 'Радиус конуса на середине высоты (r = 3)?', 'The cone radius at mid height (r = 3)?'),
      cols: 4,
      items: [
        { id: 'a', label: '1,5', correct: true },
        { id: 'b', label: '3', hint: L("Uch bu asosda.", 'Три это у основания.', 'Three is at the base.') },
        { id: 'c', label: '2', hint: L("Kamayish tekis: yarmida yarmi.", 'Убывание равномерное: на середине половина.', 'The shrinking is even: half at the middle.') },
        { id: 'd', label: '0', hint: L("Nol faqat uchda.", 'Ноль только в вершине.', 'Zero only at the apex.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L('Radius yarmi bo\'lsa, yuza?', 'Если радиус вдвое меньше, площадь?', 'If the radius halves, the area?'),
      cols: 4,
      items: [
        { id: 'a', label: L("to'rt barobar kichik", 'вчетверо меньше', 'four times smaller'), correct: true },
        { id: 'b', label: L('ikki barobar kichik', 'вдвое меньше', 'twice smaller'), hint: L("Radius kvadratda: yarmi kvadratda chorak bo'ladi.", 'Радиус в квадрате: половина в квадрате это четверть.', 'The radius is squared: a half squared is a quarter.') },
        { id: 'c', label: L("o'zgarmaydi", 'не изменится', 'unchanged'), hint: L("O'zgaradi: yuza radiusga bog'liq.", 'Изменится: площадь зависит от радиуса.', 'It changes: the area depends on the radius.') },
        { id: 'd', label: L('sakkiz barobar kichik', 'в восемь раз меньше', 'eight times smaller'), hint: L("Sakkiz barobar hajmda bo'lardi: u kubda.", 'В восемь раз было бы у объёма: там куб.', 'Eightfold belongs to volume: that is cubed.') },
      ],
    },
  ],
  holds: [3000, 4000, 4500, 4000, 4000, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch o'tgan darsdan: silindrning hajmi asos karra balandlik, va u aniq, chunki qatlamlar bir xil.", 'Первая опора с прошлого урока: объём цилиндра это основание на высоту, и он точный, потому что слои одинаковы.', 'The first basic from last lesson: a cylinder volume is base times height, and it is exact because the layers are alike.'),
    A('c2', "Ikkinchi tayanch yigirma sakkizinchi darsdan: konusning kesimi uchga yaqinlashgan sari kichrayadi, va kamayish tekis.", 'Вторая опора из двадцать восьмого урока: сечение конуса уменьшается к вершине, и убывание равномерное.', 'The second basic from lesson twenty eight: a cone section shrinks towards the apex, and the shrinking is even.'),
    A('c3', "Uchinchi tayanch: doira yuzasida radius kvadratga ko'tariladi. Bugun aynan shu narsa uchdan birni tug'diradi.", 'Третья опора: в площади круга радиус в квадрате. Сегодня именно это и породит треть.', 'The third basic: the area of a circle squares the radius. Today that is what will produce the third.'),
    A('recap', "Uchtasi birga bugungi javobni beradi.", 'Три вместе и дают сегодняшний ответ.', 'The three together give today\'s answer.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. UCH MARTA TO'KAMIZ.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'third_coefficient',
  eyebrow: L('To\'kib ko\'ramiz', 'Перельём и посмотрим', 'Let us pour and see'),
  title: L('Uch marta to\'ldirdi', 'Наполнил за три раза', 'Three pours filled it'),
  expr: L('konus va silindr: r = 3, h = 4', 'конус и цилиндр: r = 3, h = 4', 'cone and cylinder: r = 3, h = 4'),
  goal: L('nisbatni topish', 'найти отношение', 'find the ratio'),
  rule: L(
    "Har to'kishdan keyin silindrdagi daraja qanchaga ko'tarilganini qaraymiz.",
    'После каждого переливания смотрим, насколько поднялся уровень.',
    'After each pour we watch how far the level rose.',
  ),
  pick: L('Nechinchi to\'kish?', 'Какое переливание?', 'Which pour?'),
  claims: [
    { id: 'a', key: 'inA', name: L('ikki marta', 'два раза', 'twice'), value: '1/2' },
    { id: 'b', key: 'inB', name: L('uch marta', 'три раза', 'three times'), value: '1/3' },
  ],
  points: [
    {
      id: 'q1', label: L('birinchi', 'первое', 'first'), num: '1/3', step: 'calc', verdict: 'in',
      role: L('uchdan bir to\'ldi', 'заполнилась треть', 'a third filled'),
      calc: L('daraja 4 dan 1,33 ga', 'уровень 1,33 из 4', 'level 1,33 of 4'),
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q2', label: L('ikkinchi', 'второе', 'second'), num: '2/3', step: 'calc', verdict: 'in',
      role: L("hali to'lmadi", 'ещё не полон', 'not full yet'),
      calc: L('daraja 2,67', 'уровень 2,67', 'level 2,67'),
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q3', label: L('uchinchi', 'третье', 'third'), num: '3/3', step: 'calc', verdict: 'in',
      role: L("to'ldi, aniq", 'полон, точно', 'full, exactly'),
      calc: '36π = 3 · 12π',
      sol: true, inA: false, inB: true,
    },
  ],
  probe: {
    question: L("To'kish nimani ko'rsatdi?", 'Что показало переливание?', 'What did the pouring show?'),
    items: [
      {
        id: 'b', label: L('uchdan bir, lekin isbot emas', 'треть, но не доказательство', 'a third, but not a proof'), correct: true,
        ok: L(
          "To'g'ri. Tajriba nisbatni KO'RSATDI, lekin isbotlamadi. Isbotni hozir chiqaramiz.",
          'Верно. Опыт ПОКАЗАЛ отношение, но не доказал. Доказательство выведем сейчас.',
          'Correct. The experiment SHOWED the ratio but did not prove it. We will derive the proof now.',
        ),
      },
      {
        id: 'a', label: L('formulani isbotladi', 'доказало формулу', 'it proved the formula'),
        hint: L("Tajriba isbot emas: u faqat taxmin beradi. Matematikada isbot boshqacha bo'ladi.", 'Опыт не доказательство: он даёт лишь догадку. В математике доказательство иное.', 'An experiment is not a proof: it gives a guess. Proof in mathematics is another matter.'),
      },
      {
        id: 'c', label: L('hech narsa', 'ничего', 'nothing'),
        hint: L("Ko'rsatdi: nisbat aniq uchdan bir chiqdi, va bu tasodif emas.", 'Показало: отношение вышло ровно треть, и это не случайность.', 'It did show: the ratio came out exactly a third, and that is no accident.'),
      },
      {
        id: 'd', label: L('nisbat yarim', 'отношение половина', 'the ratio is a half'),
        hint: L("Ikki marta to'kish silindrni to'ldirmadi: uchinchisi kerak bo'ldi.", 'Два переливания цилиндр не наполнили: понадобилось третье.', 'Two pours did not fill the cylinder: a third was needed.'),
      },
    ],
  },
  holds: [2500, 3700, 1500, 2500, 9500, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Endi tajriba qilamiz.', 'Опора восстановлена. Теперь опыт.', 'The basics are back. Now an experiment.'),
    A('mount', "Konusni to'ldirib, silindrga to'kamiz va darajani kuzatamiz.", 'Наполняем конус и переливаем в цилиндр, следя за уровнем.', 'We fill the cone, pour it into the cylinder and watch the level.'),
    A('mount', "Nechinchi to'kishni ko'rishni tanlang.", 'Выбери, какое переливание посмотреть.', 'Choose which pour to look at.'),
    A('calc', 'Ko\'ramiz.', 'Смотрим.', 'We look.'),
    A('mark', "Uch marta to'kish silindrni roppa rosa to'ldirdi. Demak konusning hajmi silindrnikidan uch barobar kichik. Lekin diqqat: bu TAJRIBA, va tajriba matematikada isbot emas. Suv to'kilishi mumkin, o'lchov xato bo'lishi mumkin. Nisbatni ko'rdik, endi uni isbotlash kerak.", 'Три переливания наполнили цилиндр ровно. Значит объём конуса втрое меньше. Но внимание: это ОПЫТ, а опыт в математике не доказательство. Вода могла пролиться, измерение оказаться неточным. Отношение мы увидели, теперь его надо доказать.', 'Three pours filled the cylinder exactly. So the cone volume is three times smaller. But note: this is an EXPERIMENT, and an experiment is not a proof in mathematics. Water can spill, a measurement can be off. We have seen the ratio; now it must be proved.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: TO'KISH.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'third_coefficient',
  eyebrow: L('To\'kamiz', 'Переливаем', 'Pouring'),
  title: L('Uch to\'kish, bitta silindr', 'Три переливания, один цилиндр', 'Three pours, one cylinder'),
  chip: 'r = 3,  h = 4',
  solid: {
    mode: 'pour',
    R: 3,
    hh: 4,
    fills: [1, 2, 3],
    height: 152,
    caption: L('konusdan silindrga', 'из конуса в цилиндр', 'from the cone into the cylinder'),
  },
  cellSteps: 3,
  bonus: L(
    "Uch marta va aniq. Bu koeffitsient uchdan bir qayerdan kelganini KO'RSATADI, lekin isbotlamaydi: isbot keyingi ekranlarda, disklardan chiqadi.",
    'Три раза и точно. Это ПОКАЗЫВАЕТ, откуда взялась треть, но не доказывает: доказательство дальше, из слоёв.',
    'Three times, exactly. This SHOWS where the third comes from, but does not prove it: the proof comes next, from the layers.',
  ),
  probe: {
    question: L("Nega konus kichikroq?", 'Почему конус меньше?', 'Why is the cone smaller?'),
    items: [
      { id: 'a', label: L('uning kesimlari kichrayadi', 'его сечения уменьшаются', 'its sections shrink'), correct: true },
      { id: 'b', label: L('u pastroq', 'он ниже', 'it is lower'), hint: L("Balandliklari teng: shart shunday.", 'Высоты равны: так задано.', 'The heights are equal: so it is given.') },
      { id: 'c', label: L('asosi kichikroq', 'основание меньше', 'the base is smaller'), hint: L("Asoslar ham teng.", 'Основания тоже равны.', 'The bases are equal too.') },
      { id: 'd', label: L("shakli uchli", 'форма острая', 'the shape is pointed'), hint: L("Bu rost, lekin sabab aniqroq: har bir balandlikda kesim silindrnikidan kichik.", 'Это правда, но причина точнее: на каждой высоте сечение меньше, чем у цилиндра.', 'True, but the reason is sharper: at every height the section is smaller than the cylinder one.') },
    ],
  },
  holds: [4500, 4500, 2100, 6500],
  audio: [
    A('mount', "Nisbat ko'rindi. Endi to'kishni yana bir bor, sekin ko'ramiz.", 'Отношение проступило. Теперь посмотрим переливание ещё раз, медленно.', 'The ratio has shown itself. Now let us watch the pouring again, slowly.'),
    A('one', "Birinchi to'kish: silindr uchdan bir to'ldi.", 'Первое переливание: цилиндр заполнен на треть.', 'The first pour: the cylinder is a third full.'),
    A('two', "Ikkinchi: uchdan ikki.", 'Второе: две трети.', 'The second: two thirds.'),
    A('three', "Uchinchi: to'ldi. Endi savol tug'iladi: nega aynan uch? Sabab shundaki, konusning har bir kesimi silindrnikidan kichik, va uchga yaqinlashgan sari juda tez kichrayadi.", 'Третье: полон. И теперь возникает вопрос: почему именно три? Причина в том, что каждое сечение конуса меньше цилиндрического, и к вершине оно уменьшается очень быстро.', 'The third: full. And now the question arises: why exactly three? Because every cone section is smaller than the cylinder one, and towards the apex it shrinks very fast.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'third_coefficient',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Uchdan bir', 'Одна треть', 'One third'),
  rows: ['V = (1/3) · S · h', 'V = (1/3) · 9π · 4 = 12π'],
  probe: {
    question: L(
      "Piramida: asos 12, h = 5. Hajm?",
      'Пирамида: основание 12, h = 5. Объём?',
      'A pyramid: base 12, h = 5. Volume?',
    ),
    items: [
      { id: 'a', label: '20', correct: true },
      { id: 'b', label: '60', hint: L("Uchdan bir unutilgan.", 'Забыта треть.', 'The third was forgotten.') },
      { id: 'c', label: '30', hint: L("Ikkiga bo'lingan. Piramidada uchga.", 'Поделено на два. У пирамиды на три.', 'Divided by two. A pyramid divides by three.') },
      { id: 'd', label: '17', hint: L("Qo'shish emas, ko'paytirish va uchga bo'lish.", 'Не сложение, а умножение и деление на три.', 'Not adding: multiply and divide by three.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Uchdan bir', 'Правило 1. Треть', 'Rule 1. A third'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'V = (1/3) · S · h',
    lines: [
      L("piramida va konus uchun formula BIR XIL", 'для пирамиды и конуса формула ОДНА', 'the formula is THE SAME for pyramid and cone'),
      L("uchdan bir chiqadi, chunki kesimlar uchga tomon kichrayadi", 'треть появляется, потому что сечения убывают к вершине', 'the third appears because the sections shrink to the apex'),
      L("h -- balandlik, yasovchi emas", 'h это высота, а не образующая', 'h is the height, not the generator'),
      L("to'kish buni ko'rsatdi, isbot esa keyingi ekranda", 'переливание это показало, доказательство на следующем экране', 'pouring showed it, the proof is on the next screen'),
    ],
    example: L('misol:  (1/3) · 12 · 5 = 20', 'пример:  (1/3) · 12 · 5 = 20', 'example:  (1/3) · 12 · 5 = 20'),
  },
  holds: [4000, 6000, 4500],
  audio: [
    A('mount', "Nisbat ko'rildi. Endi formulani yozamiz.", 'Отношение увидели. Теперь запишем формулу.', 'We saw the ratio. Now let us write the formula.'),
    A('def', "Piramida va konus uchun formula bitta: uchdan bir karra asos karra balandlik. Farq faqat asosda, xuddi prizma va silindrdagidek. Va diqqat: bu yerda ham balandlik turadi, yasovchi emas.", 'Для пирамиды и конуса формула одна: одна треть на основание на высоту. Разница только в основании, как у призмы и цилиндра. И внимание: здесь тоже стоит высота, а не образующая.', 'For a pyramid and a cone the formula is one: a third times base times height. Only the base differs, as with prism and cylinder. And note: here too it is the height, not the generator.'),
    A('rule', "To'g'ri. Lekin savol ochiq qoldi: uchdan bir qayerdan keldi? To'kish buni ko'rsatdi, endi isbotlaymiz.", 'Верно. Но вопрос остался открытым: откуда взялась треть? Переливание её показало, теперь докажем.', 'Correct. But the question stays open: where did the third come from? Pouring showed it, now let us prove it.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: isbot kerak.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'third_coefficient',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Tajriba yetarli emas', 'Опыта недостаточно', 'The experiment is not enough'),
  was: { label: UI.was, expr: L("to'kish: uch marta", 'переливание: три раза', 'pouring: three times') },
  now: { label: UI.now, expr: L('nega aynan uch?', 'почему именно три?', 'why exactly three?') },
  probe1: {
    question: L('Tajriba nima bera oladi?', 'Что может дать опыт?', 'What can an experiment give?'),
    items: [
      { id: 'a', label: L('taxmin', 'догадку', 'a guess'), correct: true },
      { id: 'b', label: L('isbot', 'доказательство', 'a proof'), hint: L("Isbot uchun har qanday konus uchun to'g'riligini ko'rsatish kerak, bittasi uchun emas.", 'Для доказательства нужно показать, что верно для любого конуса, а не для одного.', 'A proof must hold for every cone, not for one.') },
      { id: 'c', label: L('hech narsa', 'ничего', 'nothing'), hint: L("Beradi: taxminsiz nimani isbotlashni bilmasdik.", 'Даёт: без догадки мы не знали бы, что доказывать.', 'It does: without a guess we would not know what to prove.') },
      { id: 'd', label: L('formulani', 'формулу', 'the formula'), hint: L("Formula taxmindan chiqdi, lekin uni isbotlash kerak.", 'Формула вышла из догадки, но её надо доказать.', 'The formula came from a guess, but it must be proved.') },
    ],
  },
  probe2: {
    cols: 2,
    question: L('Isbotni qayerdan olamiz?', 'Откуда возьмём доказательство?', 'Where will the proof come from?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: L('qatlamlardan', 'из слоёв', 'from the layers') },
      { id: 'b', label: L('yana bir tajribadan', 'из ещё одного опыта', 'from another experiment') },
      { id: 'c', label: L("o'lchashdan", 'из измерения', 'from measuring') },
      { id: 'd', label: L("isbot kerak emas", 'доказательство не нужно', 'no proof is needed') },
    ],
  },
  holds: [2500, 5500, 2500, 3000],
  audio: [
    A('mount', "To'kish uch martani ko'rsatdi.", 'Переливание показало три раза.', 'Pouring showed three times.'),
    A('now', "Lekin bu bitta konus edi. Boshqasida boshqacha bo'lmasligiga kim kafolat beradi? Matematikada bunday kafolatni faqat isbot beradi.", 'Но это был один конус. Кто поручится, что у другого не выйдет иначе? В математике такую гарантию даёт только доказательство.', 'But that was one cone. Who guarantees another will not differ? In mathematics only a proof gives that guarantee.'),
    A('q1', "Tajriba nima bera oladi?", 'Что может дать опыт?', 'What can an experiment give?'),
    A('q2', "Sizningcha isbotni qayerdan olamiz? Shunchaki taxmin qiling.", 'Как думаешь, откуда возьмём доказательство? Просто предположи.', 'Where do you think the proof will come from? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD: disklar.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'third_coefficient',
  eyebrow: L('Disklar bilan tekshiramiz', 'Проверим слоями', 'Let us check with layers'),
  title: L('Kesimlar qanday kamayadi', 'Как убывают сечения', 'How the sections shrink'),
  expr: L('konus, 4 qatlam', 'конус, 4 слоя', 'a cone, 4 layers'),
  need: '= ?',
  answerLabel: L('nisbat', 'отношение', 'the ratio'),
  cards: [
    {
      tag: L('radius', 'радиус', 'radius'),
      txt: L('tekis kamayadi', 'убывает равномерно', 'shrinks evenly'),
      point: {
        label: L('to\'rt qatlamda', 'на четырёх слоях', 'over four layers'),
        calc: '3 · (1, 2, 3, 4) / 4',
        verdict: 'in',
      },
    },
    {
      tag: L('yuza', 'площадь', 'area'),
      txt: L('kvadratik kamayadi', 'убывает квадратично', 'shrinks quadratically'),
      point: {
        label: L('kvadratlar yig\'indisi', 'сумма квадратов', 'the sum of squares'),
        calc: '1 + 4 + 9 + 16 = 30',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['30 / 64', '30 / 16', '10 / 16', '4 / 16'],
    value: ['30 / 64'],
    label: L('nisbat =', 'отношение =', 'ratio ='),
    prompt: L("Konus qatlamlari silindrnikiga nisbatan", 'Слои конуса к слоям цилиндра', 'Cone layers over cylinder layers'),
    wrongs: [
      { key: '30 / 16', hint: L("Silindrda har bir qatlamning yuzasi to'liq: to'rtta qatlamda 16 plyus 16 plyus 16 plyus 16, ya'ni 64.", 'У цилиндра каждый слой полный: на четырёх слоях 16 плюс 16 плюс 16 плюс 16, то есть 64.', 'Every cylinder layer is full: over four layers 16 plus 16 plus 16 plus 16, that is 64.') },
      { key: '10 / 16', hint: L("O'n bu radiuslar yig'indisi. Hajmda esa YUZALAR, ya'ni kvadratlar qo'shiladi.", 'Десять это сумма радиусов. А в объёме складываются ПЛОЩАДИ, то есть квадраты.', 'Ten is the sum of radii. Volumes add AREAS, that is squares.') },
      { key: '*', hint: L("Yuqorida kvadratlar yig'indisi, pastda to'rtta to'liq kesim.", 'Сверху сумма квадратов, снизу четыре полных сечения.', 'Above the sum of squares, below four full sections.') },
    ],
  },
  holds: [3500, 6000, 6000, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi disklar bilan tekshiramiz.', 'Прогноз есть. Теперь проверим слоями.', 'The guess is made. Now let us check with layers.'),
    A('p1', "Konusni to'rtta qatlamga bo'lamiz. Radius tekis o'sadi: uchdan asosga tomon u to'rtdan bir, to'rtdan ikki, to'rtdan uch va to'liq radiusni oladi.", 'Разделим конус на четыре слоя. Радиус растёт равномерно: от вершины к основанию он берёт четверть, половину, три четверти и полный радиус.', 'Split the cone into four layers. The radius grows evenly: from apex to base it takes a quarter, a half, three quarters and the full radius.'),
    A('p2', "Lekin hajmga radius emas, YUZA kiradi, va yuzada radius kvadratga ko'tariladi. Shuning uchun qatlamlar bir, to'rt, to'qqiz va o'n olti ulushni oladi, jami o'ttiz. Silindrda esa har bir qatlam to'liq, ya'ni o'n oltidan, jami oltmish to'rt. O'ttiz bo'lingan oltmish to'rt bu deyarli uchdan bir, va qatlamlar ko'paygan sari u aniq uchdan birga yaqinlashadi.", 'Но в объём входит не радиус, а ПЛОЩАДЬ, а в площади радиус в квадрате. Поэтому слои берут одну, четыре, девять и шестнадцать долей, всего тридцать. А у цилиндра каждый слой полный, по шестнадцать, всего шестьдесят четыре. Тридцать делить на шестьдесят четыре это почти треть, и с ростом числа слоёв стремится к ней точно.', 'But volume takes the AREA, not the radius, and the area squares the radius. So the layers take one, four, nine and sixteen shares, thirty in all. In the cylinder every layer is full, sixteen each, sixty four in all. Thirty over sixty four is nearly a third, and with more layers it tends to exactly a third.'),
    A('write', "Nisbatni yozing.", 'Запиши отношение.', 'Write the ratio.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2: ISBOT.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'third_coefficient',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Uchdan bir qayerdan', 'Откуда треть', 'Where the third comes from'),
  cases: [
    {
      label: L('4 qatlam', '4 слоя', '4 layers'),
      text: '30 / 64 ≈ 0,47',
      tone: 'graph',
    },
    {
      label: L("ko'p qatlam", 'много слоёв', 'many layers'),
      text: '→ 1/3',
      tone: 'accent',
    },
  ],
  rows: [
    L("yuza r kvadratga bog'liq", 'площадь зависит от r в квадрате', 'the area follows r squared'),
    L("yig'indi 1/3 ga intiladi", 'сумма стремится к 1/3', 'the sum tends to 1/3'),
  ],
  probe: {
    question: L(
      "Nega 4 qatlamda aniq uchdan bir chiqmadi?",
      'Почему на 4 слоях не вышло ровно треть?',
      'Why did four layers not give exactly a third?',
    ),
    items: [
      { id: 'a', label: L("qatlamlar yo'g'on, ular jismdan chiqib turadi", 'слои толстые и выступают за тело', 'the layers are thick and stick out'), correct: true },
      { id: 'b', label: L('formula xato', 'формула неверна', 'the formula is wrong'), hint: L("Formula to'g'ri: qatlamlar ko'paysa, nisbat unga yaqinlashadi.", 'Формула верна: с ростом числа слоёв отношение к ней приближается.', 'The formula is right: more layers bring the ratio to it.') },
      { id: 'c', label: L("to'kish xato edi", 'переливание было неверным', 'the pouring was wrong'), hint: L("To'kish to'g'ri uchni ko'rsatgan edi.", 'Переливание показало верную тройку.', 'The pouring showed the right three.') },
      { id: 'd', label: L('sonlar noqulay', 'числа неудобные', 'awkward numbers'), hint: L("Sonlar oddiy: bir, to'rt, to'qqiz, o'n olti.", 'Числа простые: один, четыре, девять, шестнадцать.', 'The numbers are simple: one, four, nine, sixteen.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Isbot', 'Правило 2. Доказательство', 'Rule 2. The proof'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('kvadratlar yig\'indisi → 1/3', 'сумма квадратов → 1/3', 'the sum of squares → 1/3'),
    lines: [
      L('konus kesimi radiusi tekis kamayadi', 'радиус сечения конуса убывает равномерно', 'the cone section radius shrinks evenly'),
      L("yuza esa kvadratik kamayadi: r² ga bog'liq", 'а площадь квадратично: она зависит от r²', 'the area shrinks quadratically: it follows r²'),
      L("qatlamlar yupqalashganda yig'indi 1/3 ga intiladi", 'при утончении слоёв сумма стремится к 1/3', 'as layers thin, the sum tends to 1/3'),
      L("shuning uchun har qanday konus va piramidada 1/3", 'поэтому 1/3 у любого конуса и пирамиды', 'hence 1/3 for every cone and pyramid'),
    ],
    example: L('misol:  30 / 64 → 1/3', 'пример:  30 / 64 → 1/3', 'example:  30 / 64 → 1/3'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('uchli jism uchdan bir', 'тело с вершиной это треть', 'a solid with an apex is a third'),
    lines: [
      L('1. asos va balandlikni toping', '1. найди основание и высоту', '1. find the base and the height'),
      L("2. ko'paytiring", '2. умножь', '2. multiply'),
      L('3. uchga bo\'ling', '3. подели на три', '3. divide by three'),
      L("4. sabab: kesimlar kvadratik kamayadi", '4. причина: сечения убывают квадратично', '4. the reason: sections shrink quadratically'),
    ],
  },
  holds: [4000, 6500, 4500, 5000],
  audio: [
    A('mount', 'Nisbat sanaldi. Endi isbotni yozamiz.', 'Отношение посчитано. Теперь запишем доказательство.', 'The ratio is computed. Now let us write the proof.'),
    A('rows', "Mana butun isbot. Konusning kesim radiusi uchdan asosga tekis o'sadi. Lekin hajmga yuza kiradi, va yuzada radius kvadratga ko'tariladi. Shuning uchun qatlamlar yig'indisida kvadratlar to'planadi: bir, to'rt, to'qqiz, o'n olti. To'rtta qatlamda nisbat nol butun qirq yetti chiqdi. Qatlamlarni yupqalashtirsak, u uchdan birga yaqinlashadi va chegarada aynan uchdan bir bo'ladi.", 'Вот всё доказательство. Радиус сечения конуса растёт от вершины к основанию равномерно. Но в объём входит площадь, а в площади радиус в квадрате. Поэтому в сумме слоёв накапливаются квадраты: один, четыре, девять, шестнадцать. На четырёх слоях отношение вышло ноль целых сорок семь. Утоньшая слои, оно приближается к трети и в пределе равно ей точно.', 'Here is the whole proof. The cone section radius grows evenly from apex to base. But volume takes the area, and the area squares the radius. So the layer sum accumulates squares: one, four, nine, sixteen. Over four layers the ratio came to zero point four seven. Thin the layers and it approaches a third, equalling it exactly in the limit.'),
    A('q', "Savol: nega to'rtta qatlamda aniq uchdan bir chiqmadi?", 'Вопрос: почему на четырёх слоях не вышло ровно треть?', 'The question: why did four layers not give exactly a third?'),
    A('rule', "To'g'ri. Va e'tibor bering: o'ttiz birinchi darsda silindrda yig'indi darrov aniq chiqqan edi, chunki u yerda kesimlar bir xil. Bu yerda esa ular har xil, va shuning uchun limit kerak.", 'Верно. И заметь: в тридцать первом уроке у цилиндра сумма выходила точной сразу, потому что там сечения одинаковы. А здесь они разные, и поэтому нужен предел.', 'Correct. And note: in lesson thirty one the cylinder sum was exact at once, because its sections are alike. Here they differ, and that is why a limit is needed.'),
    A('both', 'Endi butun darsni bitta qoidaga yig\'ing.', 'А теперь собери весь урок в одно правило.', 'Now combine the whole lesson into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. AMALNI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'third_coefficient',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Bo\'luvchini qo\'ying', 'Поставь делитель', 'Place the divisor'),
  left: L('konus: asos 9π, balandlik 4', 'конус: основание 9π, высота 4', 'a cone: base 9π, height 4'),
  template: ['V = 9π · 4 / ', { slot: 0 }],
  signs: ['3', '2'],
  answer: '3',
  checkNote: L(
    "Uchli jism -- uchdan bir",
    'Тело с вершиной это треть',
    'A solid with an apex is a third',
  ),
  wrongs: [
    { key: '2', hint: L("Yarim bu uchburchakning yuzasi uchun. Hajmda uchdan bir, chunki kesimlar kvadratik kamayadi.", 'Половина это для площади треугольника. В объёме треть, потому что сечения убывают квадратично.', 'A half is for a triangle area. Volume takes a third, because sections shrink quadratically.') },
  ],
  probe: {
    question: L("Nega yarim emas?", 'Почему не половина?', 'Why not a half?'),
    items: [
      { id: 'a', label: L('yuza kvadratik kamayadi', 'площадь убывает квадратично', 'the area shrinks quadratically'), correct: true },
      { id: 'b', label: L("shunday kelishilgan", 'так договорились', 'a convention'), hint: L("Kelishuv emas: to'kish ham, disklar ham uchni berdi.", 'Не договорённость: и переливание, и слои дали три.', 'Not a convention: both pouring and layers gave three.') },
      { id: 'c', label: L('uchburchak yarim edi', 'треугольник был половиной', 'the triangle was a half'), hint: L("Tekislikda yarim, fazoda uchdan bir: bu farq aynan kvadratdan.", 'На плоскости половина, в пространстве треть: разница как раз из квадрата.', 'A half in the plane, a third in space: the difference comes from the square.') },
      { id: 'd', label: L('tasodif', 'случайность', 'chance'), hint: L("Tasodif emas: har qanday konusda shunday.", 'Не случайность: так у любого конуса.', 'Not chance: it holds for every cone.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Bo'luvchini qo'ying.", 'Поставь делитель.', 'Place the divisor.'),
    A('checked', "Bo'ldi. Endi ta'riflang: nega yarim emas?", 'Получилось. Теперь сформулируй: почему не половина?', 'Done. Now put it into words: why not a half?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'base', label: L('asos yuzasini topish', 'найти площадь основания', 'find the base area') },
  { id: 'mul', label: L('balandlikka ko\'paytirish', 'умножить на высоту', 'multiply by the height') },
  { id: 'third', label: L('uchga bo\'lish', 'поделить на три', 'divide by three') },
  { id: 'gen', label: L('yasovchini topish', 'найти образующую', 'find the generator') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'third_coefficient',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: L('konus: r = 3, h = 4', 'конус: r = 3, h = 4', 'a cone: r = 3, h = 4'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'base',
      to: 'π · 9 = 9π',
      wrongs: [
        { action: 'mul', hint: L("Avval nimani ko'paytirishni toping.", 'Сначала найди, что умножать.', 'First find what to multiply.') },
        { action: 'third', hint: L("Uchga bo'lish oxirida.", 'Деление на три в конце.', 'Dividing by three comes last.') },
        { action: 'gen', hint: L("Yasovchi hajmda ishlatilmaydi.", 'Образующая в объёме не участвует.', 'The generator is not used in the volume.') },
      ],
    },
    {
      action: 'mul',
      to: '9π · 4 = 36π',
      wrongs: [
        { action: 'base', hint: L("Topilgan: to'qqiz pi.", 'Найдено: девять пи.', 'Found: nine pi.') },
        { action: 'third', hint: L("Avval ko'paytiring.", 'Сначала умножь.', 'Multiply first.') },
        { action: 'gen', hint: L("Yasovchi kerak emas.", 'Образующая не нужна.', 'The generator is not needed.') },
      ],
    },
    {
      action: 'third',
      to: '36π / 3 = 12π',
      wrongs: [
        { action: 'base', hint: L("Topilgan.", 'Найдено.', 'Found.') },
        { action: 'mul', hint: L("Ko'paytirilgan: o'ttiz olti pi.", 'Умножено: тридцать шесть пи.', 'Multiplied: thirty six pi.') },
        { action: 'gen', hint: L("Yasovchi kerak emas.", 'Образующая не нужна.', 'The generator is not needed.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['12π', '36π', '18π', '15π'],
    value: ['12π'],
    label: 'V =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '36π', hint: L("Uchga bo'lish unutilgan: bu silindrning hajmi.", 'Забыто деление на три: это объём цилиндра.', 'The division by three was forgotten: that is the cylinder.') },
      { key: '18π', hint: L("Ikkiga bo'lingan. Uchli jismda uchga.", 'Поделено на два. У тела с вершиной на три.', 'Divided by two. A solid with an apex divides by three.') },
      { key: '15π', hint: L("Bu yon sirt, hajm emas.", 'Это боковая поверхность, а не объём.', 'That is the side area, not the volume.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi masalani o\'tamiz.', 'Правило сформулировано. Пройдём задачу.', 'The rule is stated. Let us work a problem.'),
    A('start', "Bu o'sha konus, yigirma sakkizinchi darsdagi. Diqqat: ro'yxatda ortiqcha amal bor.", 'Это тот же конус, что в двадцать восьмом уроке. Внимание: в списке есть лишнее действие.', 'This is the same cone as in lesson twenty eight. Careful: the list has one superfluous action.'),
    A('step4', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'third_coefficient',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Piramida hajmi', 'Объём пирамиды', 'A pyramid volume'),
  start: L('asos -- kvadrat 6 × 6, h = 5', 'основание квадрат 6 × 6, h = 5', 'base a 6 × 6 square, h = 5'),
  actions: ACTIONS_10,
  hint: L(
    "Asos kvadrat: yuzasi tomon karra tomon.",
    'Основание квадрат: площадь сторона на сторону.',
    'The base is a square: area is side times side.',
  ),
  steps: [
    {
      action: 'base',
      to: '6 · 6 = 36',
      wrongs: [
        { action: 'mul', hint: L("Avval asosni toping.", 'Сначала найди основание.', 'Find the base first.') },
        { action: 'third', hint: L("Uchga bo'lish oxirida.", 'Деление на три в конце.', 'Dividing by three comes last.') },
        { action: 'gen', hint: L("Piramidada yasovchi yo'q, apofema bor, lekin u hajmga kirmaydi.", 'У пирамиды нет образующей, есть апофема, но в объём она не входит.', 'A pyramid has no generator but an apothem, and it is not in the volume.') },
      ],
    },
    {
      action: 'mul',
      to: '36 · 5 = 180',
      wrongs: [
        { action: 'base', hint: L("Topilgan: o'ttiz olti.", 'Найдено: тридцать шесть.', 'Found: thirty six.') },
        { action: 'third', hint: L("Avval ko'paytiring.", 'Сначала умножь.', 'Multiply first.') },
        { action: 'gen', hint: L("Kerak emas.", 'Не нужно.', 'Not needed.') },
      ],
    },
    {
      action: 'third',
      to: '180 / 3 = 60',
      wrongs: [
        { action: 'base', hint: L("Topilgan.", 'Найдено.', 'Found.') },
        { action: 'mul', hint: L("Ko'paytirilgan: bir yuz sakson.", 'Умножено: сто восемьдесят.', 'Multiplied: a hundred eighty.') },
        { action: 'gen', hint: L("Kerak emas.", 'Не нужно.', 'Not needed.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['60', '180', '90', '30'],
    value: ['60'],
    label: 'V =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '180', hint: L("Uchga bo'lish unutilgan: bu prizmaning hajmi.", 'Забыто деление на три: это объём призмы.', 'The division by three was forgotten: that is the prism.') },
      { key: '90', hint: L("Ikkiga bo'lingan. Uchli jismda uchga.", 'Поделено на два. У тела с вершиной на три.', 'Divided by two. A solid with an apex divides by three.') },
      { key: '*', hint: L("O'ttiz olti karra besh bo'lingan uch.", 'Тридцать шесть на пять и поделить на три.', 'Thirty six times five over three.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Bu safar piramida, asosi kvadrat. Formula o'sha: konus bilan piramidaning hajmi bir xil yo'l bilan sanaladi.", 'На этот раз пирамида с квадратным основанием. Формула та же: объём конуса и пирамиды считают одинаково.', 'This time a pyramid with a square base. The formula is the same: cone and pyramid volumes are computed alike.'),
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
      id: 'b1', tag: 'third_coefficient', ask: true, cols: 4,
      done: '12π',
      prompt: L('konus r = 3, h = 4. Hajm?', 'конус r = 3, h = 4. Объём?', 'cone r = 3, h = 4. Volume?'),
      items: [
        { id: 'a', label: '12π', correct: true },
        { id: 'b', label: '36π', hint: L("Uchga bo'lish unutilgan.", 'Забыто деление на три.', 'The third was forgotten.') },
        { id: 'c', label: '18π', hint: L("Ikkiga bo'lingan.", 'Поделено на два.', 'Divided by two.') },
        { id: 'd', label: '15π', hint: L("Bu yon sirt.", 'Это боковая поверхность.', 'That is the side area.') },
      ],
    },
    {
      id: 'b2', tag: 'third_coefficient', ask: true, cols: 4,
      done: '20',
      prompt: L('piramida: asos 12, h = 5?', 'пирамида: основание 12, h = 5?', 'pyramid: base 12, h = 5?'),
      items: [
        { id: 'a', label: '20', correct: true },
        { id: 'b', label: '60', hint: L("Uchga bo'lish unutilgan.", 'Забыто деление на три.', 'The third was forgotten.') },
        { id: 'c', label: '30', hint: L("Ikkiga bo'lingan.", 'Поделено на два.', 'Divided by two.') },
        { id: 'd', label: '17', hint: L("Qo'shish emas.", 'Не сложение.', 'Not adding.') },
      ],
    },
    {
      id: 'b3', tag: 'third_coefficient', ask: true, cols: 2,
      done: L('uch marta', 'три раза', 'three times'),
      prompt: L('Konus silindrga necha marta sig\'adi?', 'Сколько раз конус входит в цилиндр?', 'How many times does a cone fit a cylinder?'),
      items: [
        { id: 'a', label: L('uch marta', 'три раза', 'three times'), correct: true },
        { id: 'b', label: L('ikki marta', 'два раза', 'twice'), hint: L("Ikki marta to'kish silindrni to'ldirmadi.", 'Два переливания цилиндр не наполнили.', 'Two pours did not fill it.') },
        { id: 'c', label: L('bir marta', 'один раз', 'once'), hint: L("Bir martada faqat uchdan bir to'ldi.", 'За один раз заполнилась лишь треть.', 'One pour filled only a third.') },
        { id: 'd', label: L("o'lchamiga bog'liq", 'зависит от размера', 'depends on size'), hint: L("Bog'liq emas: har qanday o'lchamda uch marta.", 'Не зависит: при любом размере три раза.', 'It does not: three times at any size.') },
      ],
    },
    {
      id: 'b4', tag: 'third_coefficient', ask: true, cols: 2,
      done: L('taxmin', 'догадку', 'a guess'),
      prompt: L("To'kish tajribasi nima berdi?", 'Что дал опыт с переливанием?', 'What did the pouring experiment give?'),
      items: [
        { id: 'a', label: L('taxmin, isbot emas', 'догадку, не доказательство', 'a guess, not a proof'), correct: true },
        { id: 'b', label: L("to'liq isbot", 'полное доказательство', 'a full proof'), hint: L("Bitta tajriba hamma konuslar uchun kafolat bermaydi.", 'Один опыт не даёт гарантии для всех конусов.', 'One experiment guarantees nothing for all cones.') },
        { id: 'c', label: L('hech narsa', 'ничего', 'nothing'), hint: L("Berdi: nimani isbotlashni ko'rsatdi.", 'Дал: показал, что доказывать.', 'It did: it showed what to prove.') },
        { id: 'd', label: L("noto'g'ri nisbat", 'неверное отношение', 'a wrong ratio'), hint: L("Nisbat to'g'ri chiqdi.", 'Отношение вышло верным.', 'The ratio came out right.') },
      ],
    },
    {
      id: 'b5', tag: 'third_coefficient', ask: true, cols: 2,
      done: L('kvadratik', 'квадратично', 'quadratically'),
      prompt: L('Konus kesimining yuzasi qanday kamayadi?', 'Как убывает площадь сечения конуса?', 'How does a cone section area shrink?'),
      items: [
        { id: 'a', label: L('kvadratik', 'квадратично', 'quadratically'), correct: true },
        { id: 'b', label: L('tekis', 'равномерно', 'evenly'), hint: L("Tekis kamayadigan narsa -- RADIUS. Yuzada u kvadratga ko'tariladi.", 'Равномерно убывает РАДИУС. В площади он в квадрате.', 'The RADIUS shrinks evenly. The area squares it.') },
        { id: 'c', label: L('kubik', 'кубически', 'cubically'), hint: L("Kub hajmda uchraydi, yuzada kvadrat.", 'Куб встречается в объёме, в площади квадрат.', 'Cubes belong to volumes, squares to areas.') },
        { id: 'd', label: L("kamaymaydi", 'не убывает', 'it does not'), hint: L("Kamayadi: uchda u nolga aylanadi.", 'Убывает: в вершине она обращается в ноль.', 'It does: at the apex it becomes zero.') },
      ],
    },
    {
      id: 'b6', tag: 'third_coefficient', ask: true, cols: 4,
      done: '4π',
      prompt: L('konus r = 2, h = 3. Hajm?', 'конус r = 2, h = 3. Объём?', 'cone r = 2, h = 3. Volume?'),
      items: [
        { id: 'a', label: '4π', correct: true },
        { id: 'b', label: '12π', hint: L("Bu silindrniki: uchga bo'lish unutilgan.", 'Это для цилиндра: забыто деление на три.', 'That is the cylinder: the third was forgotten.') },
        { id: 'c', label: '6π', hint: L("Ikkiga bo'lingan.", 'Поделено на два.', 'Divided by two.') },
        { id: 'd', label: '2π', hint: L("Radius kvadratga ko'tarilmagan.", 'Радиус не возведён в квадрат.', 'The radius was not squared.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Endi piramida.", 'Теперь пирамида.', 'Now the pyramid.'),
    A('q3', "To'kish.", 'Переливание.', 'The pouring.'),
    A('q4', "Tajriba haqida.", 'Про опыт.', 'About the experiment.'),
    A('q5', "Kesimlar.", 'Сечения.', 'The sections.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'third_coefficient',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Uchdan bir unutilgan', 'Забыли треть', 'The third was forgotten'),
  rows: [
    { id: 'r1', text: L('konus: r = 6, h = 5', 'конус: r = 6, h = 5', 'cone: r = 6, h = 5') },
    { id: 'r2', text: L('asos: π · 36 = 36π', 'основание: π · 36 = 36π', 'base: π · 36 = 36π') },
    { id: 'r3', text: '36π · 5 = 180π' },
    { id: 'r4', text: L('javob: 180π', 'ответ: 180π', 'answer: 180π') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Asos to'g'ri sanalgan.", 'Основание посчитано верно.', 'The base is right.'),
    r3: L("Bu ham to'g'ri: asos karra balandlik. Lekin bu hali javob emas.", 'И это верно: основание на высоту. Но это ещё не ответ.', 'That is right too: base times height. But it is not the answer yet.'),
  },
  proofPoint: L('bu silindrning hajmi', 'это объём цилиндра', 'that is the cylinder volume'),
  proof: L(
    "Bir yuz sakson pi -- bu o'sha asos va balandlikdagi SILINDRning hajmi. Konus undan uch barobar kichik, ya'ni oltmish pi. Oxirgi qadam, uchga bo'lish, bajarilmagan.",
    'Сто восемьдесят пи это объём ЦИЛИНДРА с тем же основанием и высотой. Конус втрое меньше, то есть шестьдесят пи. Последний шаг, деление на три, не сделан.',
    'A hundred eighty pi is the CYLINDER volume with the same base and height. A cone is three times smaller, that is sixty pi. The last step, dividing by three, was skipped.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L("uchga bo'lish bajarilmagan", 'не выполнено деление на три', 'the division by three is missing'), correct: true },
      { id: 'b', label: L("asos noto'g'ri", 'основание неверно', 'the base is wrong'), hint: L("Asos to'g'ri: pi karra o'ttiz olti.", 'Основание верно: пи на тридцать шесть.', 'The base is right: pi times thirty six.') },
      { id: 'c', label: L("balandlik noto'g'ri", 'высота неверна', 'the height is wrong'), hint: L("Balandlik shartdan: besh.", 'Высота из условия: пять.', 'The height is from the problem: five.') },
      { id: 'd', label: L("yasovchi kerak edi", 'нужна была образующая', 'the generator was needed'), hint: L("Hajmda yasovchi ishlatilmaydi.", 'В объёме образующая не участвует.', 'The generator is not used in the volume.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda hamma satr to'g'ri, lekin yechim tugallanmagan. Xato paydo bo'lgan satrni toping.", 'Здесь все строки верны, но решение не доведено. Найди строку, в которой появилась ошибка.', 'Here every line is right, but the solution is unfinished. Find the line where the error appears.'),
    A('proof', "Qarang: bir yuz sakson pi bu o'sha asos va balandlikdagi silindrning hajmi. Konus undan uch barobar kichik. Oxirgi qadam bajarilmagan, va javob uch barobar katta chiqib qolgan.", 'Смотри: сто восемьдесят пи это объём цилиндра с тем же основанием и высотой. Конус втрое меньше. Последний шаг не сделан, и ответ вышел втрое больше.', 'Look: a hundred eighty pi is the cylinder volume with the same base and height. A cone is three times smaller. The last step was skipped, and the answer came out three times too large.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'third_coefficient',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Yozuvni yig\'ing', 'Собери запись', 'Build the record'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L('uchi bormi', 'есть ли вершина', 'is there an apex'),
  tasks: [
    {
      prompt: L('silindr: asos 9π, h = 4', 'цилиндр: основание 9π, h = 4', 'cylinder: base 9π, h = 4'),
      template: ['V = 9π · 4 / ', { slot: 0 }, ' = ', { slot: 1 }],
      parts: ['1', '3', '36π', '12π'],
      answer: ['1', '36π'],
      doneLabel: 'V = 36π',
      wrongs: [
        { key: '3|12π', hint: L("Uchga bo'lish uchli jismlar uchun. Silindrda uch yo'q.", 'Деление на три для тел с вершиной. У цилиндра вершины нет.', 'Dividing by three is for solids with an apex. A cylinder has none.') },
        { key: '*', hint: L("Silindrda bo'lish yo'q: to'qqiz pi karra to'rt.", 'У цилиндра деления нет: девять пи на четыре.', 'No division for a cylinder: nine pi times four.') },
      ],
    },
    {
      prompt: L('konus: asos 9π, h = 4', 'конус: основание 9π, h = 4', 'cone: base 9π, h = 4'),
      template: ['V = 9π · 4 / ', { slot: 0 }, ' = ', { slot: 1 }],
      parts: ['3', '1', '12π', '36π'],
      answer: ['3', '12π'],
      doneLabel: 'V = 12π',
      wrongs: [
        { key: '1|36π', hint: L("Konusda uch bor, demak uchga bo'linadi.", 'У конуса есть вершина, значит делим на три.', 'A cone has an apex, so divide by three.') },
        { key: '*', hint: L("O'ttiz olti pi bo'lingan uch.", 'Тридцать шесть пи поделить на три.', 'Thirty six pi over three.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi. Sonlar bir xil, lekin jismning uchi bor.", 'А теперь второе. Числа те же, но у тела есть вершина.', 'And now the second. The same numbers, but the solid has an apex.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'third_coefficient',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: 'V = (1/3) · S · h',
  ruleLines: [
    L("uchli jismda uchdan bir", 'у тела с вершиной треть', 'a solid with an apex takes a third'),
    L("to'kish -- taxmin, disklar -- isbot", 'переливание догадка, слои доказательство', 'pouring guesses, layers prove'),
    L('sabab: yuza kvadratik kamayadi', 'причина: площадь убывает квадратично', 'the reason: the area shrinks quadratically'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('necha marta sig\'adi', 'сколько раз поместится', 'how many times it fits'),
      right: '3',
      map: { a: '2', b: '3', both: '1,5', none: '4' },
    },
    {
      screen: 5,
      expr: L('isbot qayerdan', 'откуда доказательство', 'where the proof comes from'),
      right: L('qatlamlardan', 'из слоёв', 'from the layers'),
      map: {
        a: L('qatlamlardan', 'из слоёв', 'from layers'),
        b: L('tajribadan', 'из опыта', 'from experiment'),
        c: L("o'lchashdan", 'из измерения', 'from measuring'),
        d: L('kerak emas', 'не нужно', 'not needed'),
      },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '36π = 3 · 12π',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('To\'kish ekraniga qayting', 'Вернись к экрану с переливанием', 'Go back to the pouring screen'),
  },
  probe: {
    question: L(
      "Tajriba va isbot: farqi nimada?",
      'Опыт и доказательство: в чём разница?',
      'Experiment and proof: what is the difference?',
    ),
    items: [
      { id: 'a', label: L('tajriba bitta holatni, isbot hammasini', 'опыт про один случай, доказательство про все', 'an experiment covers one case, a proof all'), correct: true },
      { id: 'b', label: L("farqi yo'q", 'разницы нет', 'no difference'), hint: L("Farq bor: to'kish bitta konusni ko'rsatdi, disklar esa har qandayini.", 'Разница есть: переливание показало один конус, слои любой.', 'There is: pouring showed one cone, the layers show any.') },
      { id: 'c', label: L('isbot aniqroq o\'lchaydi', 'доказательство точнее измеряет', 'a proof measures more precisely'), hint: L("Isbot umuman o'lchamaydi: u mulohaza.", 'Доказательство вообще не измеряет: это рассуждение.', 'A proof does not measure at all: it is reasoning.') },
      { id: 'd', label: L('tajriba ishonchliroq', 'опыт надёжнее', 'an experiment is safer'), hint: L("Aksincha: tajribada suv to'kilishi mumkin, mulohazada esa yo'q.", 'Наоборот: в опыте вода может пролиться, в рассуждении нет.', 'The other way: water can spill in an experiment, not in reasoning.') },
    ],
  },
  sheetTitle: L('Uchdan bir · shpargalka', 'Треть · шпаргалка', 'The third · cheat sheet'),
  sheetSrc: L('11-sinf · 32-dars', '11 класс · урок 32', 'Grade 11 · lesson 32'),
  lifehack: L(
    "Jismning uchi bormi? Bor bo'lsa, javobni uchga bo'ling.",
    'Есть ли у тела вершина? Если есть, подели ответ на три.',
    'Does the solid have an apex? If so, divide the answer by three.',
  ),
  holds: [2500, 5500, 7500, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Konus silindrga uch marta sig'di.", 'Вот твои прогнозы и вот как оказалось. Конус вошёл в цилиндр три раза.', 'Here are your guesses and here is how it turned out. The cone fitted the cylinder three times.'),
    A('rule', "Va mana asosiy fikr. Uchli jismning hajmi uchdan bir karra asos karra balandlik. Lekin bugun formuladan muhimroq narsa bor: biz uni ikki bosqichda oldik. Avval to'kish taxmin berdi, keyin qatlamlar isbotladi. Tajriba matematikada nimani isbotlashni ko'rsatadi, isbotni esa mulohaza beradi.", 'И вот главная мысль. Объём тела с вершиной это треть на основание на высоту. Но сегодня есть кое-что важнее формулы: мы получили её в два шага. Сначала переливание дало догадку, потом слои её доказали. Опыт в математике показывает, что доказывать, а доказательство даёт рассуждение.', 'And here is the main point. The volume of a solid with an apex is a third times base times height. But today something matters more than the formula: we got it in two steps. Pouring gave the guess, the layers proved it. In mathematics an experiment shows what to prove; the proof comes from reasoning.'),
    A('q', "Oxirgi savol: tajriba va isbotning farqi nimada?", 'Последний вопрос: в чём разница опыта и доказательства?', 'The last question: what is the difference between experiment and proof?'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
