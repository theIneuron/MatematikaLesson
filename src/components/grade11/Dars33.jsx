// ============================================================================
// 11-sinf, Dars 33. SHAR HAJMI.
//
// B4 blokining yettinchi darsi va hajmlar uchligining oxirgisi.
//   kontrakt: src/books/grade11/ETALON_11SINF.md
//   asbob:    `SpinBoard`, `disks` rejimi
//
// DARSNING BITTA GAPI: sharda kesimlar HAR XIL, shuning uchun disklar
// yig'indisi faqat yaqinlashadi -- aniq javob limitda chiqadi.
//
// UCHLIKNING YAKUNI. 31-darsda kesimlar bir xil edi va yig'indi darrov
// aniq chiqdi. 32-darsda ular kvadratik kamaydi va uchdan bir tug'ildi.
// Bu yerda ular Pifagor bo'yicha o'zgaradi, va javob to'rt uchdan pi R kub.
// Uch dars bitta g'oyaning uch bosqichi.
//
// SONLAR VA TUZOQ. R = 3 da shar hajmi 36 pi, va sfera yuzasi ham 36 pi.
// Bu TASODIF, va u 13-slaydda ataylab ishlatilgan: son to'g'ri chiqadi,
// yo'l esa xato. R = 6 da ular ajraladi: 288 pi va 144 pi.
//
// Disklar bilan tekshirildi: 4 disk 116,63; 8 disk 113,98; 16 disk 113,32;
// aniq qiymat 113,10. Yuqoridan yaqinlashadi.
//
// Arximed nisbati: shar o'zini o'rab turgan silindrning uchdan ikkisi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_33',
  title: L('Shar hajmi', 'Объём шара', 'The volume of a ball'),
}

const BLOCK = { label: 'B4', from: 26, to: 33, current: 33 }

// Yarim doira radiusi 3: aylanganda shar chiqadi.
const BALL = (x) => Math.sqrt(Math.max(0, 9 - x * x))

// ============================================================
// SLAYD 1. XUK. Disklar yig'indisi.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Shar hajmi', 'Объём шара', 'The volume of a ball'),
  title: L('Disklar aniq javob beradimi', 'Дадут ли слои точный ответ', 'Will the layers give an exact answer'),
  expr: L('shar,  R = 3', 'шар, R = 3', 'a ball, R = 3'),
  rows: [
    {
      id: 'a',
      name: L('birinchi', 'первый', 'the first'),
      value: L('ha, silindrdagidek', 'да, как у цилиндра', 'yes, as with the cylinder'),
    },
    {
      id: 'b',
      name: L('ikkinchi', 'второй', 'the second'),
      value: L("yo'q, faqat yaqinlashadi", 'нет, только приблизится', 'no, it only approaches'),
    },
  ],
  probe: {
    question: L('Kim haq?', 'Кто прав?', 'Who is right?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi disklarni sanaymiz.",
      'Твой ответ записан. Сейчас посчитаем слои.',
      'Your answer is saved. Now we will count the layers.',
    ),
    items: [
      { id: 'a', label: L('birinchi', 'первый', 'the first') },
      { id: 'b', label: L('ikkinchi', 'второй', 'the second') },
      { id: 'both', label: L('ikkalasi ham', 'оба', 'both') },
      { id: 'none', label: L('hech kim', 'никто', 'nobody') },
    ],
  },
  holds: [5000, 4500, 4000, 4000],
  audio: [
    A('mount', "Hajmlar uchligining oxirgi darsi. Silindrda disklar aniq javob berdi, konusda uchdan bir tug'ildi. Endi shar.", 'Последний урок тройки про объёмы. У цилиндра слои дали точный ответ, у конуса родилась треть. Теперь шар.', 'The last lesson of the volume trio. For the cylinder the layers gave an exact answer, for the cone a third was born. Now the ball.'),
    A('r1', "Birinchi fikr: sharni ham disklarga bo'lamiz va aniq javob olamiz, xuddi silindrdagidek.", 'Первое мнение: разделим шар на слои и получим точный ответ, как у цилиндра.', 'The first opinion: split the ball into layers and get an exact answer, as with the cylinder.'),
    A('r2', "Ikkinchi fikr: bu yerda disklar aniq javob bermaydi, faqat yaqinlashadi.", 'Второе мнение: здесь слои точного ответа не дадут, только приблизятся.', 'The second opinion: here the layers will not give an exact answer, only approach it.'),
    A('ask', "Sizningcha kim haq? Hozircha shunchaki taxmin qiling.", 'Как думаешь, кто прав? Пока просто предположи.', 'Who do you think is right? Just make a guess for now.'),
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
      title: L('Kesim radiusi', 'Радиус сечения', 'The section radius'),
      short: L('29-darsdan', 'из урока 29', 'from lesson 29'),
      ex: [{ e: 'r² = R² − d²', why: L('Pifagor bo\'yicha', 'по Пифагору', 'by Pythagoras') }],
    },
    {
      id: 'c2',
      title: L('Qatlam hajmi', 'Объём слоя', 'A layer volume'),
      short: L('31-darsdan', 'из урока 31', 'from lesson 31'),
      ex: [{ e: L('yuza karra qalinlik', 'площадь на толщину', 'area times thickness'), why: L('har qanday jismda', 'у любого тела', 'for any solid') }],
    },
    {
      id: 'c3',
      title: L('Limit', 'Предел', 'A limit'),
      short: L('32-darsdan', 'из урока 32', 'from lesson 32'),
      ex: [{ e: '30/64 → 1/3', why: L('qatlamlar yupqalashganda', 'при утончении слоёв', 'as the layers thin') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L('R = 3, d = 2. Kesim radiusi kvadrati?', 'R = 3, d = 2. Квадрат радиуса сечения?', 'R = 3, d = 2. The section radius squared?'),
      cols: 4,
      items: [
        { id: 'a', label: '5', correct: true },
        { id: 'b', label: '1', hint: L("Bu uzunliklarning ayirmasi kvadrati. Kvadratlar ayiriladi: to'qqiz minus to'rt.", 'Это квадрат разности длин. Вычитаются квадраты: девять минус четыре.', 'That is the squared difference of lengths. Squares subtract: nine minus four.') },
        { id: 'c', label: '13', hint: L("Bu yig'indi. Kesim radiusi R dan kichik bo'lishi kerak.", 'Это сумма. Радиус сечения должен быть меньше R.', 'That is the sum. The section radius must be smaller than R.') },
        { id: 'd', label: '25', hint: L("Bu boshqa shar uchun edi.", 'Это было для другого шара.', 'That was for another ball.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L('Qatlam hajmi qanday topiladi?', 'Как находят объём слоя?', 'How is a layer volume found?'),
      cols: 2,
      items: [
        { id: 'a', label: L('yuza karra qalinlik', 'площадь на толщину', 'area times thickness'), correct: true },
        { id: 'b', label: L('radius karra qalinlik', 'радиус на толщину', 'radius times thickness'), hint: L("Hajmga yuza kiradi, radius emas.", 'В объём входит площадь, а не радиус.', 'A volume takes the area, not the radius.') },
        { id: 'c', label: L('aylana karra qalinlik', 'окружность на толщину', 'circumference times thickness'), hint: L("Bu qatlamning yon sirti.", 'Это боковая поверхность слоя.', 'That is the layer side surface.') },
        { id: 'd', label: L('qalinlik kubda', 'толщина в кубе', 'thickness cubed'), hint: L("Kub bu yerda kerak emas.", 'Куб здесь ни при чём.', 'Cubes are beside the point.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L('Silindrda yig\'indi aniq edimi?', 'У цилиндра сумма была точной?', 'Was the cylinder sum exact?'),
      cols: 2,
      items: [
        { id: 'a', label: L('ha, kesimlar bir xil', 'да, сечения одинаковы', 'yes, the sections match'), correct: true },
        { id: 'b', label: L("yo'q, taxminiy", 'нет, приблизительной', 'no, approximate'), hint: L("Aniq edi: uch, olti va o'n ikki qatlamda bir xil son chiqqan.", 'Точной: на трёх, шести и двенадцати слоях выходило одно число.', 'It was exact: three, six and twelve layers gave the same number.') },
        { id: 'c', label: L("qatlamlar soniga bog'liq", 'зависело от числа слоёв', 'depended on the count'), hint: L("Bog'liq emas edi, va bu silindrning xossasi.", 'Не зависело, и это свойство цилиндра.', 'It did not, and that is the cylinder property.') },
        { id: 'd', label: L('esimda yo\'q', 'не помню', 'I forget'), hint: L("Aniq edi: kesimlar bir xil bo'lgani uchun.", 'Была точной: потому что сечения одинаковы.', 'It was exact: because the sections match.') },
      ],
    },
  ],
  holds: [3000, 4000, 4000, 4000, 4000, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch yigirma to'qqizinchi darsdan: sharning kesim radiusi Pifagor bo'yicha topiladi.", 'Первая опора из двадцать девятого урока: радиус сечения шара находят по Пифагору.', 'The first basic from lesson twenty nine: the ball section radius comes from Pythagoras.'),
    A('c2', "Ikkinchi tayanch o'ttiz birinchi darsdan: qatlamning hajmi yuza karra qalinlik.", 'Вторая опора из тридцать первого урока: объём слоя это площадь на толщину.', 'The second basic from lesson thirty one: a layer volume is area times thickness.'),
    A('c3', "Uchinchi tayanch o'tgan darsdan: qatlamlar yupqalashganda yig'indi limitga intiladi.", 'Третья опора с прошлого урока: при утончении слоёв сумма стремится к пределу.', 'The third basic from last lesson: as layers thin, the sum tends to a limit.'),
    A('recap', "Uchtasi birga bugungi javobni beradi.", 'Три вместе и дают сегодняшний ответ.', 'The three together give today\'s answer.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. DISKLARNI SANAYMIZ.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'limit_needed',
  eyebrow: L('Disklarni sanaymiz', 'Считаем слои', 'Counting the layers'),
  title: L('Yig\'indi yaqinlashadi', 'Сумма приближается', 'The sum approaches'),
  expr: L('R = 3,  aniq 36π', 'R = 3, точно 36π', 'R = 3, exactly 36π'),
  goal: L('yig\'indi qayerga intilishini ko\'rish', 'увидеть, куда стремится сумма', 'see where the sum tends'),
  rule: L(
    "Disklar sonini ikki barobar oshiramiz.",
    'Удваиваем число слоёв.',
    'We double the layer count.',
  ),
  pick: L('Nechta disk olamiz?', 'Сколько слоёв возьмём?', 'How many layers shall we take?'),
  claims: [
    { id: 'a', key: 'inA', name: L('aniq', 'точно', 'exact'), value: '=' },
    { id: 'b', key: 'inB', name: L('yaqinlashadi', 'приближается', 'approaching'), value: '→' },
  ],
  points: [
    {
      id: 'q1', label: L('4 disk', '4 слоя', '4 layers'), num: '116,6', step: 'calc', verdict: 'out',
      role: L("katta", 'больше', 'above'),
      calc: L('farq 3,5', 'разница 3,5', 'gap 3,5'),
      sol: false, inA: false, inB: true,
    },
    {
      id: 'q2', label: L('8 disk', '8 слоёв', '8 layers'), num: '114,0', step: 'calc', verdict: 'out',
      role: L('yaqinroq', 'ближе', 'closer'),
      calc: L('farq 0,9', 'разница 0,9', 'gap 0,9'),
      sol: false, inA: false, inB: true,
    },
    {
      id: 'q3', label: L('16 disk', '16 слоёв', '16 layers'), num: '113,3', step: 'calc', verdict: 'in',
      role: L("deyarli aniq", 'почти точно', 'nearly exact'),
      calc: L('farq 0,2', 'разница 0,2', 'gap 0,2'),
      sol: true, inA: false, inB: true,
    },
  ],
  probe: {
    question: L("Nega sharda yig'indi aniq emas?", 'Почему у шара сумма не точна?', 'Why is the ball sum not exact?'),
    items: [
      {
        id: 'b', label: L('kesimlar har xil', 'сечения разные', 'the sections differ'), correct: true,
        ok: L(
          "To'g'ri. Har bir disk o'z markazidagi radius bilan chizilgan, chetlarida esa shar torroq. Shuning uchun disklar biroz ortiqcha oladi, va yig'indi yuqoridan yaqinlashadi.",
          'Верно. Каждый слой построен по радиусу в своей середине, а по краям шар уже. Поэтому слои берут лишнее, и сумма приближается сверху.',
          'Correct. Each layer is drawn with the radius at its middle, while at its edges the ball is narrower. So the layers take a little extra, and the sum approaches from above.',
        ),
      },
      {
        id: 'a', label: L("sonlar noqulay", 'числа неудобные', 'the numbers are awkward'),
        hint: L("Sonlar oddiy: to'qqiz minus x kvadrat. Masala shaklda.", 'Числа простые: девять минус икс в квадрате. Дело в форме.', 'The numbers are simple: nine minus x squared. The shape is the point.'),
      },
      {
        id: 'c', label: L("disklar juda kam", 'слоёв слишком мало', 'too few layers'),
        hint: L("Ko'paytirsak yaqinlashadi, lekin hech qachon aniq bo'lmaydi: har doim ozgina ortiqcha qoladi.", 'С ростом числа приближается, но точной не станет: всегда остаётся немного лишнего.', 'More layers get closer, but never exact: a little extra always remains.'),
      },
      {
        id: 'd', label: L("formula xato", 'формула неверна', 'the formula is wrong'),
        hint: L("Formula to'g'ri: yig'indi aynan unga intilyapti.", 'Формула верна: сумма как раз к ней и стремится.', 'The formula is right: the sum is tending to it.'),
      },
    ],
  },
  holds: [2500, 4500, 1500, 2500, 9500, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Endi disklarni sanaymiz.', 'Опора восстановлена. Теперь посчитаем слои.', 'The basics are back. Now let us count the layers.'),
    A('mount', "Har bir diskning radiusi o'z markazidan olinadi va Pifagor bilan sanaladi.", 'Радиус каждого слоя берётся в его середине и считается по Пифагору.', 'Each layer radius is taken at its middle and computed by Pythagoras.'),
    A('mount', "Nechta disk olishni tanlang.", 'Выбери, сколько слоёв взять.', 'Choose how many layers to take.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Mana uchala son. To'rtta diskda bir yuz o'n olti butun olti, sakkiztada bir yuz o'n to'rt, o'n oltitada bir yuz o'n uch butun uch. Aniq qiymat bir yuz o'n uch butun bir. Yig'indi yaqinlashyapti, lekin hech qachon unga yetmaydi. Sabab: har bir disk o'z markazidagi radius bilan chizilgan, chetlarida esa shar torroq, va disk chetdan chiqib turadi.", 'Вот все три числа. На четырёх слоях сто шестнадцать и шесть, на восьми сто четырнадцать, на шестнадцати сто тринадцать и три. Точное значение сто тринадцать и один. Сумма приближается, но никогда его не достигает. Причина: каждый слой построен по радиусу в своей середине, а по краям шар уже, и слой выступает наружу.', 'Here are all three numbers. Four layers give a hundred sixteen point six, eight give a hundred fourteen, sixteen give a hundred thirteen point three. The exact value is a hundred thirteen point one. The sum approaches but never reaches it. The reason: each layer uses the radius at its middle, while at the edges the ball is narrower, so the layer sticks out.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: DISKLAR.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'limit_needed',
  eyebrow: L('Disklar', 'Слои', 'Layers'),
  title: L('Disklar mayda bo\'lib boradi', 'Слои становятся мельче', 'The layers get finer'),
  chip: L('R = 3,  aniq 36π', 'R = 3, точно 36π', 'R = 3, exactly 36π'),
  solid: {
    fn: BALL,
    a: -3,
    b: 3,
    xDomain: [-3.4, 3.4],
    yDomain: [-3.4, 3.4],
    mode: 'disks',
    spin: 1,
    diskSteps: [4, 8, 16],
    showV: true,
    tilt0: 0.5,
    interactive: true,
    height: 158,
    caption: L('jismni barmoq bilan burish mumkin', 'тело можно повернуть пальцем', 'you can turn the solid with a finger'),
  },
  cellSteps: 3,
  bonus: L(
    "Disklar mayda bo'lgan sari ular jismga zichroq yopishadi, va son aniq qiymatga yaqinlashadi. Silindrda bunday kutish shart emas edi: u yerda birinchi urinishdayoq aniq chiqqandi.",
    'Чем мельче слои, тем плотнее они прилегают к телу, и число приближается к точному. У цилиндра ждать не приходилось: там точное значение выходило с первой попытки.',
    'The finer the layers, the tighter they hug the solid, and the number nears the exact value. With the cylinder no waiting was needed: it was exact on the first try.',
  ),
  probe: {
    question: L("Yig'indi qaysi tomondan yaqinlashadi?", 'С какой стороны приближается сумма?', 'From which side does the sum approach?'),
    items: [
      { id: 'a', label: L('yuqoridan', 'сверху', 'from above'), correct: true },
      { id: 'b', label: L('pastdan', 'снизу', 'from below'), hint: L("Sonlar kamayib boryapti: bir yuz o'n olti, bir yuz o'n to'rt, bir yuz o'n uch.", 'Числа убывают: сто шестнадцать, сто четырнадцать, сто тринадцать.', 'The numbers fall: a hundred sixteen, a hundred fourteen, a hundred thirteen.') },
      { id: 'c', label: L('goh yuqoridan, goh pastdan', 'то сверху, то снизу', 'now above, now below'), hint: L("Uchala son ham aniqdan katta.", 'Все три числа больше точного.', 'All three numbers exceed the exact value.') },
      { id: 'd', label: L('yaqinlashmaydi', 'не приближается', 'it does not approach'), hint: L("Farq kamayyapti: uch butun besh, nol butun to'qqiz, nol butun ikki.", 'Разница уменьшается: три и пять, ноль и девять, ноль и два.', 'The gap shrinks: three point five, zero point nine, zero point two.') },
    ],
  },
  holds: [2900, 4500, 2500, 6500],
  audio: [
    A('mount', "Sonlar sanaldi. Endi disklarni ko'ramiz.", 'Числа посчитаны. Теперь увидим слои.', 'The numbers are computed. Now let us see the layers.'),
    A('one', "To'rtta disk. Ular jismdan sezilarli chiqib turibdi.", 'Четыре слоя. Они заметно выступают за тело.', 'Four layers. They stick out noticeably.'),
    A('two', "Sakkizta: chiqib turgan qism kamaydi.", 'Восемь: выступающая часть уменьшилась.', 'Eight: the overhang shrank.'),
    A('three', "O'n oltita, va disklar deyarli jismning shakliga tushdi. Son ham aniq qiymatga yaqinlashdi. Agar shu yo'lni davom ettirsak, chegarada aniq javob chiqadi, va u to'rt uchdan pi karra R kub.", 'Шестнадцать, и слои почти легли по форме тела. Число тоже приблизилось к точному. Если продолжить этот путь, в пределе выйдет точный ответ, и он равен четыре третьих пи эр куб.', 'Sixteen, and the layers nearly follow the shape. The number came close as well. Continue this path and the limit gives the exact answer: four thirds pi R cubed.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'limit_needed',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Shar hajmi', 'Объём шара', 'The ball volume'),
  rows: ['V = (4/3) πR³', 'V = (4/3) π · 27 = 36π'],
  probe: {
    question: L(
      "R = 6. Shar hajmi?",
      'R = 6. Объём шара?',
      'R = 6. The ball volume?',
    ),
    items: [
      { id: 'a', label: '288π', correct: true },
      { id: 'b', label: '144π', hint: L("Bu SFERA yuzasi, hajm emas. Hajmda R kubda.", 'Это площадь СФЕРЫ, а не объём. В объёме эр в кубе.', 'That is the SPHERE area, not the volume. Volume cubes R.') },
      { id: 'c', label: '72π', hint: L("To'rt uchdan koeffitsienti tushib qolgan ko'rinadi.", 'Похоже, потерян коэффициент четыре третьих.', 'The four thirds coefficient seems lost.') },
      { id: 'd', label: '216π', hint: L("Bu R kub, lekin to'rt uchdan pi ko'paytirilmagan.", 'Это эр в кубе без множителя четыре третьих пи.', 'That is R cubed without the four thirds pi factor.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Shar', 'Правило 1. Шар', 'Rule 1. The ball'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'V = (4/3) πR³',
    lines: [
      L("kesimlar har xil, shuning uchun yig'indi limitda aniq bo'ladi", 'сечения разные, поэтому сумма точна лишь в пределе', 'the sections differ, so the sum is exact only in the limit'),
      L('R kubda: hajm uchinchi darajada o\'sadi', 'эр в кубе: объём растёт в третьей степени', 'R is cubed: volume grows to the third power'),
      L("R ni ikki barobar oshirsak, hajm sakkiz barobar", 'удвоив R, объём вырастет в восемь раз', 'double R and the volume grows eightfold'),
      L("sfera yuzasi bilan aralashtirmang: u 4πR²", 'не путай с площадью сферы: она 4πR²', 'do not confuse with the sphere area: that is 4πR²'),
    ],
    example: L('misol:  (4/3) π · 216 = 288π', 'пример:  (4/3) π · 216 = 288π', 'example:  (4/3) π · 216 = 288π'),
  },
  holds: [4000, 6000, 4500],
  audio: [
    A('mount', "Disklar ko'rildi. Endi formulani yozamiz.", 'Слои увидели. Теперь запишем формулу.', 'We saw the layers. Now let us write the formula.'),
    A('def', "Sharning hajmi to'rt uchdan pi karra R kubga teng. Bu yerda R kubda turadi, va bu muhim: sfera yuzasida u kvadratda edi. Ikkita formula bir biriga o'xshaydi, lekin biri sirt, ikkinchisi jism haqida.", 'Объём шара равен четыре третьих пи эр куб. Здесь эр в кубе, и это важно: в площади сферы он был в квадрате. Две формулы похожи, но одна про поверхность, другая про тело.', 'The ball volume is four thirds pi R cubed. Here R is cubed, and that matters: in the sphere area it was squared. The two formulas resemble each other, but one is about a surface, the other about a solid.'),
    A('rule', "To'g'ri. Va tekshiruv: R ni ikki barobar oshirsak, hajm sakkiz barobar oshadi, yuza esa faqat to'rt barobar.", 'Верно. И проверка: удвоив эр, объём вырастет в восемь раз, а площадь только вчетверо.', 'Correct. And a check: doubling R grows the volume eightfold, the area only fourfold.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: Arximed nisbati.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'limit_needed',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Sharni silindrga solamiz', 'Вложим шар в цилиндр', 'Put the ball in a cylinder'),
  was: { label: UI.was, expr: L('shar:  36π', 'шар: 36π', 'ball: 36π') },
  now: { label: UI.now, expr: L("uni o'rab turgan silindr:  ?", 'описанный цилиндр: ?', 'the enclosing cylinder: ?') },
  probe1: {
    question: L('Silindrning o\'lchamlari?', 'Каковы размеры цилиндра?', 'What are the cylinder sizes?'),
    items: [
      { id: 'a', label: 'r = 3, h = 6', correct: true },
      { id: 'b', label: 'r = 3, h = 3', hint: L("Balandlik diametrga teng: shar silindrga tegib turishi kerak.", 'Высота равна диаметру: шар должен касаться цилиндра.', 'The height equals the diameter: the ball must touch the cylinder.') },
      { id: 'c', label: 'r = 6, h = 6', hint: L("Radius sharnikidek: uch.", 'Радиус как у шара: три.', 'The radius matches the ball: three.') },
      { id: 'd', label: 'r = 6, h = 3', hint: L("Ikkalasi ham almashtirilgan.", 'Оба перепутаны.', 'Both are swapped.') },
    ],
  },
  probe2: {
    cols: 4,
    question: L('Shar silindrning qanchasi?', 'Какую часть цилиндра занимает шар?', 'What part of the cylinder is the ball?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '2/3' },
      { id: 'b', label: '1/2' },
      { id: 'c', label: '3/4' },
      { id: 'd', label: '1/3' },
    ],
  },
  holds: [4500, 5500, 2500, 3000],
  audio: [
    A('mount', "Sharning hajmini topdik: o'ttiz olti pi.", 'Объём шара нашли: тридцать шесть пи.', 'We found the ball volume: thirty six pi.'),
    A('now', "Endi uni eng kichik silindrga solamiz: shar devorlariga ham, tagiga ham, ustiga ham tegib tursin. Ikki ming yil oldin Arximed aynan shu nisbatni topgan va uni o'z qabr toshiga o'yishni so'ragan.", 'Теперь вложим его в наименьший цилиндр: пусть шар касается и стенок, и дна, и крышки. Две тысячи лет назад Архимед нашёл именно это отношение и просил высечь его на своём надгробии.', 'Now put it in the smallest cylinder: let the ball touch the wall, the bottom and the top. Two thousand years ago Archimedes found this very ratio and asked for it on his tombstone.'),
    A('q1', "Silindrning o'lchamlari qanday?", 'Каковы размеры цилиндра?', 'What are the cylinder sizes?'),
    A('q2', "Sizningcha shar silindrning qanchasini egallaydi? Shunchaki taxmin qiling.", 'Как думаешь, какую часть цилиндра занимает шар? Просто предположи.', 'What part of the cylinder do you think the ball takes? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'limit_needed',
  eyebrow: L('Ikkalasini sanaymiz', 'Посчитаем оба', 'Let us compute both'),
  title: L('Shar va silindr', 'Шар и цилиндр', 'Ball and cylinder'),
  expr: 'R = 3',
  need: '= ?',
  answerLabel: L('nisbat', 'отношение', 'the ratio'),
  cards: [
    {
      tag: L('shar', 'шар', 'the ball'),
      txt: '(4/3) π · 27',
      point: {
        label: L('hajm', 'объём', 'volume'),
        calc: '36π',
        verdict: 'in',
      },
    },
    {
      tag: L('silindr', 'цилиндр', 'the cylinder'),
      txt: 'π · 9 · 6',
      point: {
        label: L('hajm', 'объём', 'volume'),
        calc: '54π',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['2/3', '1/2', '3/4', '1/3'],
    value: ['2/3'],
    label: L('nisbat =', 'отношение =', 'ratio ='),
    prompt: L('Nisbatni yozing', 'Запиши отношение', 'Write the ratio'),
    wrongs: [
      { key: '1/2', hint: L("Yarim bo'lishi uchun silindr yetmish ikki pi bo'lishi kerak edi. U esa ellik to'rt pi.", 'Для половины цилиндр должен был бы быть семьдесят два пи. А он пятьдесят четыре пи.', 'For a half the cylinder would need seventy two pi. It is fifty four pi.') },
      { key: '1/3', hint: L("Uchdan bir konusniki edi. Shar undan kattaroq joy egallaydi.", 'Треть была у конуса. Шар занимает больше места.', 'A third belonged to the cone. A ball takes more room.') },
      { key: '*', hint: L("O'ttiz olti bo'lingan ellik to'rt.", 'Тридцать шесть делить на пятьдесят четыре.', 'Thirty six over fifty four.') },
    ],
  },
  holds: [3500, 5500, 4900, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi ikkalasini ham sanaymiz.', 'Прогноз есть. Теперь посчитаем оба.', 'The guess is made. Now let us compute both.'),
    A('p1', "Shar: to'rt uchdan pi karra yigirma yetti, ya'ni o'ttiz olti pi.", 'Шар: четыре третьих пи на двадцать семь, то есть тридцать шесть пи.', 'The ball: four thirds pi times twenty seven, that is thirty six pi.'),
    A('p2', "Silindr: asosi to'qqiz pi, balandligi olti, jami ellik to'rt pi. Nisbat o'ttiz olti bo'lingan ellik to'rt, ya'ni uchdan ikki. Bu Arximed topgan nisbat, va u har qanday radiusda bir xil chiqadi.", 'Цилиндр: основание девять пи, высота шесть, всего пятьдесят четыре пи. Отношение тридцать шесть к пятидесяти четырём, то есть две трети. Это отношение и нашёл Архимед, и при любом радиусе оно одно и то же.', 'The cylinder: base nine pi, height six, fifty four pi in all. The ratio is thirty six over fifty four, that is two thirds. This is the ratio Archimedes found, and it holds for any radius.'),
    A('write', "Nisbatni yozing.", 'Запиши отношение.', 'Write the ratio.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'limit_needed',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Uch jism, uch koeffitsient', 'Три тела, три коэффициента', 'Three solids, three coefficients'),
  cases: [
    {
      label: L('silindr', 'цилиндр', 'cylinder'),
      text: L('to\'liq: 1', 'полный: 1', 'full: 1'),
      tone: 'graph',
    },
    {
      label: L('shar va konus', 'шар и конус', 'ball and cone'),
      text: '2/3  va  1/3',
      tone: 'accent',
    },
  ],
  rows: [
    L('silindr 54π, shar 36π, konus 18π', 'цилиндр 54π, шар 36π, конус 18π', 'cylinder 54π, ball 36π, cone 18π'),
    L('1 : 2/3 : 1/3 -- uchi bor jism kichik', '1 : 2/3 : 1/3 -- с вершиной меньше', '1 : 2/3 : 1/3 -- an apex means less'),
  ],
  probe: {
    question: L(
      "Shar va konus birga silindrni to'ldiradimi?",
      'Шар и конус вместе заполнят цилиндр?',
      'Do the ball and cone together fill the cylinder?',
    ),
    items: [
      { id: 'a', label: L('ha, uchdan ikki plyus uchdan bir', 'да, две трети плюс треть', 'yes, two thirds plus a third'), correct: true },
      { id: 'b', label: L("yo'q, joy ortadi", 'нет, останется место', 'no, room is left'), hint: L("Uchdan ikki plyus uchdan bir roppa rosa bir.", 'Две трети плюс треть это ровно единица.', 'Two thirds plus a third is exactly one.') },
      { id: 'c', label: L("yo'q, sig'maydi", 'нет, не поместятся', 'no, they will not fit'), hint: L("Hajmlar bo'yicha aniq sig'adi: o'ttiz olti plyus o'n sakkiz ellik to'rt.", 'По объёмам помещаются точно: тридцать шесть плюс восемнадцать пятьдесят четыре.', 'By volume they fit exactly: thirty six plus eighteen is fifty four.') },
      { id: 'd', label: L("bilib bo'lmaydi", 'не определить', 'cannot tell'), hint: L("Mumkin: hajmlarni sanadik.", 'Можно: объёмы мы посчитали.', 'It can: we computed the volumes.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Nisbatlar', 'Правило 2. Отношения', 'Rule 2. The ratios'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('silindr : shar : konus = 3 : 2 : 1', 'цилиндр : шар : конус = 3 : 2 : 1', 'cylinder : ball : cone = 3 : 2 : 1'),
    lines: [
      L('bir xil radius va balandlikda olingan uch jism', 'три тела при одном радиусе и высоте', 'three solids at the same radius and height'),
      L('shar silindrning uchdan ikkisi -- Arximed nisbati', 'шар это две трети цилиндра, отношение Архимеда', 'the ball is two thirds of the cylinder, the Archimedes ratio'),
      L("konus uchdan biri, va ular birga silindrni to'ldiradi", 'конус треть, и вместе они заполняют цилиндр', 'the cone is a third, and together they fill it'),
      L('nisbat radiusga bog\'liq emas', 'отношение не зависит от радиуса', 'the ratio does not depend on the radius'),
    ],
    example: L('misol:  36π + 18π = 54π', 'пример:  36π + 18π = 54π', 'example:  36π + 18π = 54π'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('kesimlar har xil -- limit kerak', 'сечения разные — нужен предел', 'different sections need a limit'),
    lines: [
      L('1. jismni disklarga bo\'ling', '1. раздели тело на слои', '1. split the solid into layers'),
      L('2. kesimlar bir xil bo\'lsa, yig\'indi aniq', '2. если сечения одинаковы, сумма точна', '2. if the sections match, the sum is exact'),
      L('3. har xil bo\'lsa, u faqat yaqinlashadi', '3. если разные, она лишь приближается', '3. if they differ, it only approaches'),
      L('4. aniq javob limitda chiqadi', '4. точный ответ выходит в пределе', '4. the exact answer comes in the limit'),
    ],
  },
  holds: [4000, 6000, 2900, 5000],
  audio: [
    A('mount', 'Nisbat topildi. Endi uchala jismni yonma yon qo\'yamiz.', 'Отношение найдено. Теперь поставим три тела рядом.', 'The ratio is found. Now let us put the three solids side by side.'),
    A('rows', "Bir xil radius va balandlikda uchta jism: silindr ellik to'rt pi, shar o'ttiz olti pi, konus o'n sakkiz pi. Nisbat uch, ikki, bir. Ya'ni shar va konus birga silindrni roppa rosa to'ldiradi.", 'При одном радиусе и высоте три тела: цилиндр пятьдесят четыре пи, шар тридцать шесть пи, конус восемнадцать пи. Отношение три, два, один. То есть шар и конус вместе заполняют цилиндр ровно.', 'At the same radius and height, three solids: the cylinder fifty four pi, the ball thirty six pi, the cone eighteen pi. The ratio is three, two, one. So the ball and the cone together fill the cylinder exactly.'),
    A('q', "Savol: shar va konus birga silindrni to'ldiradimi?", 'Вопрос: шар и конус вместе заполнят цилиндр?', 'The question: do the ball and cone together fill the cylinder?'),
    A('rule', "To'g'ri. Bu nisbatni Arximed topgan va o'z qabr toshiga o'yishni so'ragan: shar va uni o'rab turgan silindr.", 'Верно. Это отношение нашёл Архимед и просил высечь его на своём надгробии: шар и описанный цилиндр.', 'Correct. Archimedes found this ratio and asked for it on his tombstone: a ball and its enclosing cylinder.'),
    A('both', 'Endi butun darsni bitta qoidaga yig\'ing.', 'А теперь собери весь урок в одно правило.', 'Now combine the whole lesson into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. AMALNI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'limit_needed',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Darajani qo\'ying', 'Поставь степень', 'Place the power'),
  left: L('shar hajmi, R = 3', 'объём шара, R = 3', 'ball volume, R = 3'),
  template: ['V = (4/3) π · 3', { slot: 0 }],
  signs: ['³', '²'],
  answer: '³',
  checkNote: L(
    "Hajm -- uchinchi daraja, yuza -- ikkinchi",
    'Объём это третья степень, площадь вторая',
    'Volume is the third power, area the second',
  ),
  wrongs: [
    { key: '²', hint: L("Kvadrat sfera YUZASIda turadi. Hajmda daraja uchinchi, chunki uchala o'lcham ham qatnashadi.", 'Квадрат стоит в ПЛОЩАДИ сферы. В объёме степень третья, потому что участвуют все три измерения.', 'The square belongs to the sphere AREA. Volume takes the third power, because all three dimensions take part.') },
  ],
  probe: {
    question: L("R ikki barobar oshsa, hajm?", 'Если R удвоить, объём?', 'If R doubles, the volume?'),
    items: [
      { id: 'a', label: L('sakkiz barobar', 'в восемь раз', 'eight times'), correct: true },
      { id: 'b', label: L("to'rt barobar", 'вчетверо', 'four times'), hint: L("To'rt barobar yuza oshadi.", 'Вчетверо растёт площадь.', 'Fourfold is the area.') },
      { id: 'c', label: L('ikki barobar', 'вдвое', 'twice'), hint: L("Ikki barobar faqat uzunlik.", 'Вдвое только длина.', 'Twice is only the length.') },
      { id: 'd', label: L("o'n olti barobar", 'в шестнадцать раз', 'sixteen times'), hint: L("Bu to'rtinchi daraja bo'lardi.", 'Это была бы четвёртая степень.', 'That would be the fourth power.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Darajani qo'ying.", 'Поставь степень.', 'Place the power.'),
    A('checked', "Bo'ldi. Endi ta'riflang.", 'Получилось. Теперь сформулируй.', 'Done. Now put it into words.'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'cube', label: L('R kubni sanash', 'посчитать R в кубе', 'compute R cubed') },
  { id: 'coef', label: L("4/3 ga ko'paytirish", 'умножить на 4/3', 'multiply by 4/3') },
  { id: 'sq', label: L('R kvadratni sanash', 'посчитать R в квадрате', 'compute R squared') },
  { id: 'four', label: L("4 ga ko'paytirish", 'умножить на 4', 'multiply by 4') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'limit_needed',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: L('shar R = 6. Hajm?', 'шар R = 6. Объём?', 'a ball R = 6. Volume?'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'cube',
      to: '6³ = 216',
      wrongs: [
        { action: 'sq', hint: L("Kvadrat sfera yuzasiga kerak. Hajmda kub.", 'Квадрат нужен площади сферы. В объёме куб.', 'The square is for the sphere area. Volume takes the cube.') },
        { action: 'coef', hint: L("Avval nimani ko'paytirishni toping.", 'Сначала найди, что умножать.', 'First find what to multiply.') },
        { action: 'four', hint: L("To'rtga ko'paytirish yuzada. Hajmda to'rt uchdan.", 'Умножение на четыре в площади. В объёме четыре третьих.', 'Times four is for the area. Volume takes four thirds.') },
      ],
    },
    {
      action: 'coef',
      to: '(4/3) · 216 = 288',
      wrongs: [
        { action: 'cube', hint: L("Sanalgan: ikki yuz o'n olti.", 'Посчитано: двести шестнадцать.', 'Computed: two hundred sixteen.') },
        { action: 'sq', hint: L("Kvadrat kerak emas.", 'Квадрат не нужен.', 'No square needed.') },
        { action: 'four', hint: L("To'rt emas, to'rt uchdan.", 'Не четыре, а четыре третьих.', 'Not four but four thirds.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['288π', '144π', '216π', '96π'],
    value: ['288π'],
    label: 'V =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '144π', hint: L("Bu sfera YUZASI: to'rt pi karra o'ttiz olti. So'ralgani hajm.", 'Это ПЛОЩАДЬ сферы: четыре пи на тридцать шесть. Спрашивают объём.', 'That is the sphere AREA: four pi times thirty six. The volume was asked.') },
      { key: '216π', hint: L("To'rt uchdan koeffitsienti qo'llanmagan.", 'Не применён коэффициент четыре третьих.', 'The four thirds coefficient was not applied.') },
      { key: '*', hint: L("To'rt uchdan karra ikki yuz o'n olti.", 'Четыре третьих на двести шестнадцать.', 'Four thirds times two hundred sixteen.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi masalani o\'tamiz.', 'Правило сформулировано. Пройдём задачу.', 'The rule is stated. Let us work a problem.'),
    A('start', "Diqqat: ro'yxatda yuzaga tegishli amallar ham bor. Ular ortiqcha.", 'Внимание: в списке есть действия для площади. Они лишние.', 'Careful: the list holds actions for the area. They are superfluous.'),
    A('step3', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'limit_needed',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Yarim shar', 'Полушар', 'A half ball'),
  start: L('yarim shar, R = 3. Hajm?', 'полушар, R = 3. Объём?', 'a half ball, R = 3. Volume?'),
  actions: ACTIONS_10,
  hint: L(
    "Avval butun sharni sanang.",
    'Сначала посчитай целый шар.',
    'Compute the whole ball first.',
  ),
  steps: [
    {
      action: 'cube',
      to: '3³ = 27',
      wrongs: [
        { action: 'sq', hint: L("Kvadrat yuzaga.", 'Квадрат для площади.', 'The square is for the area.') },
        { action: 'coef', hint: L("Avval R kubni sanang.", 'Сначала посчитай R в кубе.', 'Compute R cubed first.') },
        { action: 'four', hint: L("To'rtga emas, to'rt uchdanga.", 'Не на четыре, а на четыре третьих.', 'Not by four but by four thirds.') },
      ],
    },
    {
      action: 'coef',
      to: '(4/3) · 27 = 36',
      wrongs: [
        { action: 'cube', hint: L("Sanalgan: yigirma yetti.", 'Посчитано: двадцать семь.', 'Computed: twenty seven.') },
        { action: 'sq', hint: L("Kerak emas.", 'Не нужно.', 'Not needed.') },
        { action: 'four', hint: L("To'rt uchdan.", 'Четыре третьих.', 'Four thirds.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['18π', '36π', '9π', '12π'],
    value: ['18π'],
    label: 'V =',
    prompt: L('Yarim sharning hajmini yozing', 'Запиши объём полушара', 'Write the half ball volume'),
    wrongs: [
      { key: '36π', hint: L("Bu butun shar. So'ralgani yarmi.", 'Это целый шар. Спрашивают половину.', 'That is the whole ball. Half was asked.') },
      { key: '9π', hint: L("Bu chorak. O'ttiz oltining yarmi o'n sakkiz.", 'Это четверть. Половина тридцати шести это восемнадцать.', 'That is a quarter. Half of thirty six is eighteen.') },
      { key: '*', hint: L("Butun shar o'ttiz olti pi, yarmi o'n sakkiz pi.", 'Целый шар тридцать шесть пи, половина восемнадцать пи.', 'The whole ball is thirty six pi, half is eighteen pi.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Yarim shar. Diqqat: formulada alohida o'zgarish yo'q, oxirida ikkiga bo'lish kifoya.", 'Полушар. Внимание: отдельного изменения в формуле нет, достаточно в конце поделить на два.', 'A half ball. Careful: no special change to the formula, just halve at the end.'),
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
      id: 'b1', tag: 'limit_needed', ask: true, cols: 4,
      done: '36π',
      prompt: L('shar R = 3. Hajm?', 'шар R = 3. Объём?', 'ball R = 3. Volume?'),
      items: [
        { id: 'a', label: '36π', correct: true },
        { id: 'b', label: '27π', hint: L("To'rt uchdan koeffitsienti qo'llanmagan.", 'Не применён коэффициент четыре третьих.', 'The four thirds coefficient was not applied.') },
        { id: 'c', label: '12π', hint: L("Bu konusniki bo'lardi.", 'Это было бы для конуса.', 'That would be the cone.') },
        { id: 'd', label: '9π', hint: L("Bu katta doiraning yuzasi.", 'Это площадь большого круга.', 'That is the great circle area.') },
      ],
    },
    {
      id: 'b2', tag: 'limit_needed', ask: true, cols: 4,
      done: '288π',
      prompt: L('shar R = 6. Hajm?', 'шар R = 6. Объём?', 'ball R = 6. Volume?'),
      items: [
        { id: 'a', label: '288π', correct: true },
        { id: 'b', label: '144π', hint: L("Bu sfera yuzasi.", 'Это площадь сферы.', 'That is the sphere area.') },
        { id: 'c', label: '216π', hint: L("Koeffitsient qo'llanmagan.", 'Коэффициент не применён.', 'The coefficient was not applied.') },
        { id: 'd', label: '72π', hint: L("Kub emas, kvadrat olingan ko'rinadi.", 'Похоже, взят квадрат вместо куба.', 'The square seems to have been used instead of the cube.') },
      ],
    },
    {
      id: 'b3', tag: 'limit_needed', ask: true, cols: 2,
      done: L("yo'q, faqat yaqinlashadi", 'нет, только приближается', 'no, it only approaches'),
      prompt: L("Sharda disklar yig'indisi aniqmi?", 'У шара сумма слоёв точна?', 'Is the ball layer sum exact?'),
      items: [
        { id: 'a', label: L("yo'q, yaqinlashadi", 'нет, приближается', 'no, it approaches'), correct: true },
        { id: 'b', label: L('ha, aniq', 'да, точна', 'yes, exact'), hint: L("Aniq faqat silindrda: u yerda kesimlar bir xil.", 'Точна только у цилиндра: там сечения одинаковы.', 'Exact only for the cylinder: its sections match.') },
        { id: 'c', label: L("16 diskdan keyin aniq", 'после 16 слоёв точна', 'exact after 16 layers'), hint: L("O'n oltita diskda ham farq bor: nol butun ikki.", 'И на шестнадцати слоях есть разница: ноль целых два.', 'Even at sixteen layers a gap remains: zero point two.') },
        { id: 'd', label: L("radiusga bog'liq", 'зависит от радиуса', 'depends on the radius'), hint: L("Bog'liq emas: har qanday sharda shunday.", 'Не зависит: так у любого шара.', 'It does not: so it goes for any ball.') },
      ],
    },
    {
      id: 'b4', tag: 'limit_needed', ask: true, cols: 4,
      done: '2/3',
      prompt: L("Shar o'rab turgan silindrning qanchasi?", 'Какую часть описанного цилиндра занимает шар?', 'What part of the enclosing cylinder is the ball?'),
      items: [
        { id: 'a', label: '2/3', correct: true },
        { id: 'b', label: '1/2', hint: L("Yarim emas: o'ttiz olti bo'lingan ellik to'rt.", 'Не половина: тридцать шесть делить на пятьдесят четыре.', 'Not a half: thirty six over fifty four.') },
        { id: 'c', label: '1/3', hint: L("Uchdan bir konusniki.", 'Треть у конуса.', 'A third is the cone.') },
        { id: 'd', label: '3/4', hint: L("Ko'p: nisbat uchdan ikki.", 'Много: отношение две трети.', 'Too much: the ratio is two thirds.') },
      ],
    },
    {
      id: 'b5', tag: 'limit_needed', ask: true, cols: 4,
      done: L('sakkiz barobar', 'в восемь раз', 'eight times'),
      prompt: L('R ikki barobar. Hajm?', 'R вдвое больше. Объём?', 'R doubled. The volume?'),
      items: [
        { id: 'a', label: '×8', correct: true },
        { id: 'b', label: '×4', hint: L("To'rt barobar yuza.", 'Вчетверо площадь.', 'Fourfold is the area.') },
        { id: 'c', label: '×2', hint: L("Ikki barobar uzunlik.", 'Вдвое длина.', 'Twice is the length.') },
        { id: 'd', label: '×6', hint: L("Daraja uchinchi: ikki kubda sakkiz.", 'Степень третья: два в кубе восемь.', 'The power is three: two cubed is eight.') },
      ],
    },
    {
      id: 'b6', tag: 'limit_needed', ask: true, cols: 4,
      done: '18π',
      prompt: L('yarim shar, R = 3. Hajm?', 'полушар, R = 3. Объём?', 'half ball, R = 3. Volume?'),
      items: [
        { id: 'a', label: '18π', correct: true },
        { id: 'b', label: '36π', hint: L("Bu butun shar.", 'Это целый шар.', 'That is the whole ball.') },
        { id: 'c', label: '12π', hint: L("Uchga bo'lingan. Yarmi uchun ikkiga.", 'Поделено на три. Для половины на два.', 'Divided by three. Halving needs two.') },
        { id: 'd', label: '9π', hint: L("Bu chorak.", 'Это четверть.', 'That is a quarter.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Boshqa radius.", 'Другой радиус.', 'Another radius.'),
    A('q3', "Disklar haqida.", 'Про слои.', 'About the layers.'),
    A('q4', "Arximed nisbati.", 'Отношение Архимеда.', 'The Archimedes ratio.'),
    A('q5', "Masshtab.", 'Масштаб.', 'Scale.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO. Son mos keladi, yo'l xato.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'limit_needed',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Son to\'g\'ri, yo\'l xato', 'Число верное, путь неверный', 'Right number, wrong path'),
  rows: [
    { id: 'r1', text: L('shar R = 3, hajm kerak', 'шар R = 3, нужен объём', 'ball R = 3, volume needed') },
    { id: 'r2', text: 'V = 4πR²' },
    { id: 'r3', text: 'V = 4π · 9 = 36π' },
    { id: 'r4', text: L('javob: 36π', 'ответ: 36π', 'answer: 36π') },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r3: L("Bu satr oldingisidan to'g'ri chiqadi. Xato formulada.", 'Эта строка верно следует из предыдущей. Ошибка в формуле.', 'This line follows correctly. The error is in the formula.'),
    r4: L("Son to'g'ri chiqib qolgan, va aynan shu qiyin qiladi.", 'Число случайно совпало, и это как раз усложняет дело.', 'The number happens to match, and that is what makes it hard.'),
  },
  proofPoint: L('bu sfera yuzasining formulasi', 'это формула площади сферы', 'that is the sphere area formula'),
  proof: L(
    "Yozilgan formula sfera YUZASIniki, hajmniki emas. R = 3 da ular tasodifan bir xil son beradi: o'ttiz olti pi. Lekin R = 6 olsak, yuza yuz qirq to'rt pi, hajm esa ikki yuz sakson sakkiz pi. Bir xil son tasodif edi.",
    'Записанная формула это ПЛОЩАДЬ сферы, а не объём. При R = 3 они случайно дают одно число: тридцать шесть пи. Но возьми R = 6, и площадь сто сорок четыре пи, а объём двести восемьдесят восемь пи. Совпадение было случайным.',
    'The formula written is the sphere AREA, not the volume. At R = 3 they coincide by accident: thirty six pi. But take R = 6 and the area is a hundred forty four pi while the volume is two hundred eighty eight pi. The match was chance.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('yuza formulasi olingan', 'взята формула площади', 'the area formula was used'), correct: true },
      { id: 'b', label: L("javob noto'g'ri", 'ответ неверный', 'the answer is wrong'), hint: L("Bu safar son to'g'ri: R = 3 da ular mos keladi. Xato yo'lda.", 'На этот раз число верное: при R = 3 они совпадают. Ошибка в пути.', 'This time the number is right: at R = 3 they coincide. The path is the error.') },
      { id: 'c', label: L("arifmetikada xato", 'ошибка в арифметике', 'an arithmetic slip'), hint: L("Arifmetika to'g'ri: to'rt pi karra to'qqiz o'ttiz olti pi.", 'Арифметика верна: четыре пи на девять тридцать шесть пи.', 'The arithmetic is right: four pi times nine is thirty six pi.') },
      { id: 'd', label: L("radius noto'g'ri", 'неверный радиус', 'the radius is wrong'), hint: L("Radius shartdan: uch.", 'Радиус из условия: три.', 'The radius is from the problem: three.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Diqqat: bu yerda javob to'g'ri son chiqqan. Shunga qaramay yechimda xato bor. Uni toping.", 'Внимание: здесь ответ вышел верным числом. И всё же в решении есть ошибка. Найди её.', 'Careful: here the answer came out as the right number. And still the solution has an error. Find it.'),
    A('proof', "Qarang: yozilgan formula sfera yuzasiniki. Radius uchda ular tasodifan bir xil son beradi, o'ttiz olti pi. Lekin radiusni olti qilsak, yuza yuz qirq to'rt pi, hajm esa ikki yuz sakson sakkiz pi bo'ladi. Ya'ni bu usul boshqa sonda darrov yolg'on javob beradi.", 'Смотри: записанная формула это площадь сферы. При радиусе три они случайно дают одно число, тридцать шесть пи. Но сделай радиус шесть, и площадь станет сто сорок четыре пи, а объём двести восемьдесят восемь. То есть на другом числе способ сразу даст неверный ответ.', 'Look: the formula written is the sphere area. At radius three they coincide by accident, thirty six pi. But make the radius six and the area becomes a hundred forty four pi while the volume is two hundred eighty eight. So on another number this method fails at once.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'limit_needed',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Yozuvni yig\'ing', 'Собери запись', 'Build the record'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L('sirtmi yoki jism', 'поверхность или тело', 'surface or solid'),
  tasks: [
    {
      prompt: L('R = 2. Sfera yuzasi', 'R = 2. Площадь сферы', 'R = 2. Sphere area'),
      template: ['S = 4π · ', { slot: 0 }, ' = ', { slot: 1 }],
      parts: ['4', '8', '16π', '32π/3'],
      answer: ['4', '16π'],
      doneLabel: 'S = 16π',
      wrongs: [
        { key: '8|32π/3', hint: L("Sakkiz bu R kub: u hajmda ishlatiladi.", 'Восемь это эр в кубе: оно для объёма.', 'Eight is R cubed: that is for the volume.') },
        { key: '*', hint: L("Yuzada R kvadrat: to'rt.", 'В площади эр в квадрате: четыре.', 'The area takes R squared: four.') },
      ],
    },
    {
      prompt: L('R = 2. Shar hajmi', 'R = 2. Объём шара', 'R = 2. Ball volume'),
      template: ['V = (4/3) π · ', { slot: 0 }, ' = ', { slot: 1 }],
      parts: ['8', '4', '32π/3', '16π'],
      answer: ['8', '32π/3'],
      doneLabel: 'V = 32π/3',
      wrongs: [
        { key: '4|16π', hint: L("To'rt bu R kvadrat: u yuzada. Hajmda kub.", 'Четыре это эр в квадрате: оно в площади. В объёме куб.', 'Four is R squared: that is the area. Volume takes the cube.') },
        { key: '*', hint: L("Hajmda R kub: sakkiz.", 'В объёме эр в кубе: восемь.', 'The volume takes R cubed: eight.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi. Radius o'sha, lekin daraja boshqa.", 'А теперь второе. Радиус тот же, а степень другая.', 'And now the second. The same radius, a different power.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN. Blok yopiladi.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'limit_needed',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: 'V = (4/3) πR³',
  ruleLines: [
    L("kesimlar har xil, shuning uchun limit kerak", 'сечения разные, поэтому нужен предел', 'the sections differ, so a limit is needed'),
    L('shar silindrning uchdan ikkisi -- Arximed', 'шар это две трети цилиндра — Архимед', 'the ball is two thirds of the cylinder — Archimedes'),
    L("hajmda R kub, yuzada R kvadrat", 'в объёме R куб, в площади R квадрат', 'volume cubes R, area squares it'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('disklar aniqmi', 'точны ли слои', 'are the layers exact'),
      right: L('yaqinlashadi', 'приближаются', 'they approach'),
      map: {
        a: L('aniq', 'точны', 'exact'),
        b: L('yaqinlashadi', 'приближаются', 'approach'),
        both: L('ikkalasi', 'оба', 'both'),
        none: L('hech kim', 'никто', 'nobody'),
      },
    },
    {
      screen: 5,
      expr: L('shar / silindr', 'шар / цилиндр', 'ball / cylinder'),
      right: '2/3',
      map: { a: '2/3', b: '1/2', c: '3/4', d: '1/3' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '116,6 → 114,0 → 113,3 → 36π',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Disklar ekraniga qayting', 'Вернись к экрану со слоями', 'Go back to the layers screen'),
  },
  probe: {
    question: L(
      "Uch dars, uch jism. Nima ularni bog'ladi?",
      'Три урока, три тела. Что их связало?',
      'Three lessons, three solids. What tied them together?',
    ),
    items: [
      { id: 'a', label: L('jism qatlamlardan yig\'iladi', 'тело собирается из слоёв', 'a solid is built from layers'), correct: true },
      { id: 'b', label: L('hammasi aylanish jismi', 'все тела вращения', 'all are solids of revolution'), hint: L("Bu rost, lekin savol HISOBLASH usuli haqida.", 'Это правда, но вопрос про способ ВЫЧИСЛЕНИЯ.', 'True, but the question is about the way of COMPUTING.') },
      { id: 'c', label: L('hammasida pi bor', 'везде есть пи', 'pi appears in all'), hint: L("Prizmada pi yo'q, lekin qatlamlar usuli u yerda ham ishladi.", 'У призмы пи нет, а способ со слоями там работал.', 'A prism has no pi, yet the layer method worked there.') },
      { id: 'd', label: L("hech narsa", 'ничего', 'nothing'), hint: L("Bog'ladi: uchala darsda ham jism qatlamlarga bo'lindi.", 'Связало: во всех трёх уроках тело делили на слои.', 'Something did: all three lessons split the solid into layers.') },
    ],
  },
  sheetTitle: L('Shar hajmi · shpargalka', 'Объём шара · шпаргалка', 'Ball volume · cheat sheet'),
  sheetSrc: L('11-sinf · 33-dars', '11 класс · урок 33', 'Grade 11 · lesson 33'),
  lifehack: L(
    "Kub yoki kvadrat? Jism kerak bo'lsa kub, sirt kerak bo'lsa kvadrat.",
    'Куб или квадрат? Нужно тело — куб, нужна поверхность — квадрат.',
    'Cube or square? A solid takes the cube, a surface the square.',
  ),
  holds: [2500, 5500, 7500, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Disklar aniq javob bermadi, faqat yaqinlashdi.", 'Вот твои прогнозы и вот как оказалось. Слои точного ответа не дали, только приблизились.', 'Here are your guesses and here is how it turned out. The layers gave no exact answer, only an approach.'),
    A('rule', "Va mana uchala darsning umumiy fikri. Har qanday jismning hajmini qatlamlarga bo'lib topish mumkin. Silindrda kesimlar bir xil, va yig'indi darrov aniq chiqadi. Konusda ular kvadratik kamayadi, va uchdan bir tug'iladi. Sharda ular Pifagor bo'yicha o'zgaradi, va aniq javob faqat limitda chiqadi. Bitta usul, uch xil natija.", 'И вот общая мысль всех трёх уроков. Объём любого тела можно найти, разделив его на слои. У цилиндра сечения одинаковы, и сумма выходит точной сразу. У конуса они убывают квадратично, и рождается треть. У шара они меняются по Пифагору, и точный ответ выходит только в пределе. Один способ, три разных результата.', 'And here is the thought shared by all three lessons. Any solid volume can be found by splitting it into layers. In a cylinder the sections match and the sum is exact at once. In a cone they shrink quadratically and a third is born. In a ball they change by Pythagoras and the exact answer comes only in the limit. One method, three different outcomes.'),
    A('q', "Oxirgi savol: nima uchala darsni bog'ladi?", 'Последний вопрос: что связало все три урока?', 'The last question: what tied all three lessons together?'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
