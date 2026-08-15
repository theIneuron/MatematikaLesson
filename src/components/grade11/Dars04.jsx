// ============================================================================
// 11-sinf, Dars 04. ANIQ INTEGRAL.  (Определённый интеграл)
//
// B1 blokining TO'RTINCHI darsi. Faqat MA'LUMOT.
//   raskadrovka: src/books/grade11/DARS04_SKELET.md
//   kontrakt:    src/books/grade11/ETALON_11SINF.md
//
// BU DARSDA NYUTON-LEYBNITS FORMULASI YO'Q. U 5-darsda. Bu yerda hamma yuza
// MAKTAB FIGURASI bilan hisoblanadi: to'g'ri to'rtburchak, uchburchak,
// trapetsiya. Aks holda 4-dars formulani e'lon qilishga, 5-dars esa uni
// boshqa sonlar bilan takrorlashga aylanadi.
//
// DARSNING BITTA GAPI: chapdan o'ngga to'plangan yuza -- bu FUNKSIYA, va
// uning hosilasi egri chiziqning o'ziga teng. O'quvchi buni qo'li bilan
// ko'radi: chegarani tortadi va yuza qayerda tezroq to'planishini aytadi.
//
// Ikkinchi gap: INTEGRAL va FIGURANING YUZASI -- har xil kattaliklar.
// O'qdan pastda integral ayiriladi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'
// 11-ekran DTM formatida: funksiya FORMULA bilan emas, CHIZMA bilan beriladi.
// Profil imtihonining 8-topshirig'i aynan shunday so'raydi: «rasmga qarab
// aniq integralni hisoblang». Shuning uchun asbob dars ichiga chaqiriladi --
// bu `fig` eshigi, 12-darsda `BaseSlider` xuddi shunday berilgan.
import { AreaBoard } from './tools.jsx'

const META = {
  id: 'alg_11_04',
  title: L('Aniq integral', 'Определённый интеграл', 'The definite integral'),
}

const BLOCK = { label: 'B1', from: 1, to: 7, current: 4 }

// ============================================================
// SLAYD 1. XUK. Yuza bir tekis o'sadimi yoki tezlashib.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Aniq integral', 'Определённый интеграл', 'The definite integral'),
  title: L("Yuza qanday o'sadi", 'Как растёт площадь', 'How the area grows'),
  expr: L('f = x ostidagi yuza', 'Площадь под f = x', 'The area under f = x'),
  rows: [
    {
      id: 'a',
      name: L("bir tekis o'sadi", 'растёт равномерно', 'grows evenly'),
      value: 'S = x',
    },
    {
      id: 'b',
      name: L("tobora tezroq o'sadi", 'растёт всё быстрее', 'grows faster and faster'),
      value: 'S = x²/2',
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi yuzani oddiy geometriya bilan sanaymiz.",
      'Твой ответ записан. Сейчас посчитаем площадь обычной геометрией.',
      'Your answer is saved. Now we will count the area with plain geometry.',
    ),
    items: [
      { id: 'a', label: L('birinchi', 'первое', 'the first') },
      { id: 'b', label: L('ikkinchi', 'второе', 'the second') },
      { id: 'both', label: L('ikkisi ham', 'оба', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни один', 'neither') },
    ],
  },
  holds: [5000, 5000, 5000, 4000],
  audio: [
    A('mount', "Uch dars boshlang'ich funksiyani qidirdik. Bugun boshqa savol: egri chiziq ostidagi yuza. Va integral belgisining ikkita chekkasi paydo bo'ladi.", 'Три урока мы искали первообразную. Сегодня другой вопрос: площадь под кривой. И у знака интеграла появятся два края.', 'For three lessons we looked for the antiderivative. Today a different question: the area under the curve. And the integral sign will get two ends.'),
    A('r1', "Birinchi yechim: chegara qancha siljisa, yuza shuncha ortadi, ya'ni bir tekis.", 'Первое решение: насколько сдвинулась граница, настолько выросла площадь, то есть равномерно.', 'The first solution: the area grows as much as the boundary moves, that is, evenly.'),
    A('r2', "Ikkinchi yechim: chegara o'ngga ketgan sari qo'shiladigan bo'lak balandroq bo'ladi, demak yuza tobora tezroq o'sadi.", 'Второе решение: чем правее граница, тем выше добавляемый кусок, значит площадь растёт всё быстрее.', 'The second solution: the further right the boundary, the taller the piece added, so the area grows faster and faster.'),
    A('ask', "Sizningcha qaysi yechim to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какое решение верное? Пока просто предположи.', 'Which solution do you think is correct? Just make a guess for now.'),
  ],
}

// ============================================================
// SLAYD 2. TAYANCH: uchta figuraning yuzasi.
// ============================================================
const S2 = {
  role: 'support',
  eyebrow: L('Tayanchni tekshirish', 'Проверка опоры', 'Checking the basics'),
  title: L('Uch figura', 'Три фигуры', 'Three figures'),
  lead: L(
    "Bugun hamma yuza maktab figurasi bilan sanaladi. Uchtasini eslaymiz. Bu baholanmaydi.",
    'Сегодня все площади считаются школьными фигурами. Вспомним три. Это не оценивается.',
    'Today every area is counted with a school figure. Let us recall three. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L("To'g'ri to'rtburchak", 'Прямоугольник', 'The rectangle'),
      short: L("bo'yi karra eni", 'длина на ширину', 'length times width'),
      ex: [{ e: 'S = 3 · 2 = 6', why: L('eng oddiysi', 'самая простая', 'the simplest one') }],
    },
    {
      id: 'c2',
      title: L('Uchburchak', 'Треугольник', 'The triangle'),
      short: L('asos karra balandlik, ikkiga', 'основание на высоту, пополам', 'base times height, halved'),
      ex: [{ e: 'S = 4 · 4 / 2 = 8', why: L('yarim to\'rtburchak', 'половина прямоугольника', 'half a rectangle') }],
    },
    {
      id: 'c3',
      title: L('Trapetsiya', 'Трапеция', 'The trapezium'),
      short: L('asoslar yarim yig\'indisi karra balandlik', 'полусумма оснований на высоту', 'half-sum of the bases times the height'),
      ex: [{ e: 'S = (1 + 3)/2 · 4 = 8', why: L('to\'rtburchak va uchburchak', 'прямоугольник и треугольник', 'a rectangle and a triangle') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L('Katetlari 3 va 3 bo\'lgan uchburchak yuzasi?', 'Площадь треугольника с катетами 3 и 3 ?', 'The area of a triangle with legs 3 and 3 ?'),
      cols: 4,
      items: [
        { id: 'a', label: '4,5', correct: true },
        { id: 'b', label: '9', hint: L("Bu to'rtburchakning yuzasi. Uchburchak uning yarmi.", 'Это площадь прямоугольника. Треугольник половина от него.', 'That is the area of the rectangle. The triangle is half of it.') },
        { id: 'c', label: '3', hint: L("Bu tomon, yuza emas.", 'Это сторона, а не площадь.', 'That is a side, not an area.') },
        { id: 'd', label: '6', hint: L("Uch karra uch bu to'qqiz, uning yarmi to'rt yarim.", 'Три на три это девять, половина от него четыре с половиной.', 'Three times three is nine, half of it is four and a half.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L('Asoslari 2 va 4, balandligi 3 bo\'lgan trapetsiya?', 'Трапеция с основаниями 2 и 4, высотой 3 ?', 'A trapezium with bases 2 and 4, height 3 ?'),
      cols: 4,
      items: [
        { id: 'a', label: '9', correct: true },
        { id: 'b', label: '12', hint: L("Asoslarning yarim yig'indisi uch, uchga ko'paytiring: to'qqiz.", 'Полусумма оснований три, умножь на три: девять.', 'The half-sum of the bases is three, multiply by three: nine.') },
        { id: 'c', label: '6', hint: L("Yarim yig'indi uch, balandlik ham uch.", 'Полусумма три, и высота тоже три.', 'The half-sum is three, and the height is three too.') },
        { id: 'd', label: '18', hint: L("Yarmiga bo'lish unutildi.", 'Забыли поделить пополам.', 'The halving was forgotten.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L("f = x ostida, 0 dan 3 gacha qanday figura turibdi?", 'Какая фигура стоит под f = x, от 0 до 3 ?', 'What figure stands under f = x, from 0 to 3 ?'),
      cols: 2,
      items: [
        { id: 'a', label: L('katetlari 3 va 3 uchburchak', 'треугольник с катетами 3 и 3', 'a triangle with legs 3 and 3'), correct: true },
        { id: 'b', label: L('tomoni 3 kvadrat', 'квадрат со стороной 3', 'a square with side 3'), hint: L("Yuqoridan chegara egri chiziq, u qiya ketadi.", 'Сверху граница это кривая, она идёт наклонно.', 'The upper boundary is the curve, and it goes at a slant.') },
        { id: 'c', label: L('asoslari 0 va 3 trapetsiya', 'трапеция с основаниями 0 и 3', 'a trapezium with bases 0 and 3'), hint: L("Bir asosi nolga teng bo'lsa, trapetsiya uchburchakka aylanadi. Javob shunday atalgani aniqroq.", 'Если одно основание равно нулю, трапеция превращается в треугольник. Так ответ точнее.', 'When one base is zero, the trapezium becomes a triangle. That name is more exact.') },
        { id: 'd', label: L('to\'g\'ri to\'rtburchak', 'прямоугольник', 'a rectangle'), hint: L("To'rtburchakning tepasi gorizontal, bu yerda esa qiya.", 'У прямоугольника верх горизонтальный, а здесь наклонный.', 'A rectangle has a horizontal top, here it is slanted.') },
      ],
    },
  ],
  holds: [3000, 4500, 5500, 6500, 4500, 3500],
  audio: [
    A('mount', 'Uch figurani tiklaymiz. Bu baho emas.', 'Восстановим три фигуры. Это не оценка.', 'Let us restore three figures. This is not graded.'),
    A('c1', "Birinchi: to'g'ri to'rtburchak, yuzasi bo'yi karra eni.", 'Первая: прямоугольник, площадь это длина на ширину.', 'First: the rectangle, its area is length times width.'),
    A('c2', "Ikkinchi: uchburchak. Asosni balandlikka ko'paytirib, ikkiga bo'lamiz. Bu to'rtburchakning yarmi.", 'Вторая: треугольник. Основание умножаем на высоту и делим пополам. Это половина прямоугольника.', 'Second: the triangle. Multiply the base by the height and halve it. That is half a rectangle.'),
    A('c3', "Uchinchi: trapetsiya. Asoslarning yarim yig'indisini balandlikka ko'paytiramiz. Bugun uchalasi ham kerak bo'ladi.", 'Третья: трапеция. Полусумму оснований умножаем на высоту. Сегодня понадобятся все три.', 'Third: the trapezium. Multiply the half-sum of the bases by the height. All three will be needed today.'),
    A('recap', "Qisqacha: to'rtburchak ko'paytma, uchburchak yarmi, trapetsiya yarim yig'indi karra balandlik.", 'Коротко: прямоугольник произведение, треугольник половина, трапеция полусумма на высоту.', 'Briefly: the rectangle is a product, the triangle a half, the trapezium a half-sum times the height.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. Bahsni GEOMETRIYA hal qiladi.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'accumulation',
  eyebrow: L('Uchburchak bilan tekshiramiz', 'Проверим треугольником', 'Let us check with the triangle'),
  title: L('Bahsni figura hal qiladi', 'Спор решает фигура', 'The figure settles it'),
  expr: L('x = 3 da yuza 4,5', 'при x = 3 площадь равна 4,5', 'at x = 3 the area is 4,5'),
  goal: L('4,5 chiqsin', 'должно выйти 4,5', 'it must give 4,5'),
  rule: L(
    "Figura bu katetlari x va x bo'lgan uchburchak, ya'ni yuzasi x karra x, ikkiga.",
    'Фигура это треугольник с катетами x и x, значит площадь равна x на x, пополам.',
    'The figure is a triangle with legs x and x, so the area is x times x, halved.',
  ),
  pick: L('Qaysi javobni tekshiramiz?', 'Какой ответ проверим?', 'Which answer shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L("bir tekis", 'равномерно', 'evenly'), value: 'S = x' },
    { id: 'b', key: 'inB', name: L("tezlashib", 'с ускорением', 'accelerating'), value: 'S = x²/2' },
  ],
  points: [
    {
      id: 'q1', label: 'S = x', num: 'x', step: 'calc', verdict: 'out',
      role: L('birinchi javob', 'первый ответ', 'the first answer'),
      calc: 'x = 3:   3  ≠  4,5   ✗',
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q2', label: 'S = x²/2', num: 'x²/2', step: 'calc', verdict: 'in',
      role: L('ikkinchi javob', 'второй ответ', 'the second answer'),
      calc: 'x = 3:   4,5  =  4,5   ✓',
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q3', label: 'S = x²', num: 'x²', step: 'calc', verdict: 'out',
      role: L('nazorat uchun', 'для контроля', 'as a control'),
      calc: 'x = 3:   9  ≠  4,5   ✗',
      sol: false, inA: false, inB: false,
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    items: [
      {
        id: 'b', label: L('ikkinchi', 'второе', 'the second'), correct: true,
        ok: L(
          "To'g'ri. Yuza kvadrat bo'yicha o'sadi, chunki qo'shiladigan bo'lak tobora balandroq.",
          'Верно. Площадь растёт по квадрату, потому что добавляемый кусок всё выше.',
          'Correct. The area grows as a square, because the piece added is ever taller.',
        ),
      },
      {
        id: 'a', label: L('birinchi', 'первое', 'the first'),
        hint: L("x = 2 da ikkalasi ham ikki berdi, va shu chalg'itadi. x = 3 ni oling: uch va to'rt yarim, bir xil emas.", 'При x = 2 оба дали два, это и сбивает. Возьми x = 3: три и четыре с половиной, не одно и то же.', 'At x = 2 both gave two, and that is what misleads. Take x = 3: three and four and a half, not the same.'),
      },
      {
        id: 'both', label: L('ikkisi ham', 'оба', 'both'),
        hint: L("Ular o'zgarmasga emas, butunlay boshqacha o'sadi: biri to'g'ri chiziq, ikkinchisi parabola.", 'Они отличаются не постоянной, а самим ростом: одна прямая, другая парабола.', 'They differ not by a constant but by how they grow: one is a line, the other a parabola.'),
      },
      {
        id: 'none', label: L('hech qaysi', 'ни один', 'neither'),
        hint: L("Bittasi mos keldi: uchburchak x = 3 da to'rt yarim berdi.", 'Один подошёл: треугольник при x = 3 дал четыре с половиной.', 'One fitted: the triangle at x = 3 gave four and a half.'),
      },
    ],
  },
  holds: [2500, 6500, 1500, 2500, 11000, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Bahsga qaytamiz.', 'Опора восстановлена. Вернёмся к спору.', 'The basics are back. Let us return to the argument.'),
    A('mount', "Yuzani sanash uchun integral kerak emas. f teng iks ostidagi figura bu katetlari iks va iks bo'lgan uchburchak.", 'Чтобы посчитать площадь, интеграл не нужен. Фигура под эф равно икс это треугольник с катетами икс и икс.', 'To count the area no integral is needed. The figure under f equals x is a triangle with legs x and x.'),
    A('mount', "Javobni tanlang.", 'Выбери ответ.', 'Pick an answer.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Uch javob tekshirildi. Diqqat qiling: iks teng ikki nuqtasida birinchi va ikkinchi javob bir xil son beradi, ikki. Bitta nuqta yetmaydi. Iks teng uch da esa ular ajraladi: uch va to'rt yarim. Uchburchak to'rt yarim beradi, demak ikkinchi javob.", 'Три ответа проверены. Обрати внимание: в точке икс равно два первый и второй ответ дают одно и то же число, два. Одной точки мало. А при икс равно три они расходятся: три и четыре с половиной. Треугольник даёт четыре с половиной, значит второй ответ.', 'Three answers checked. Note this: at the point x equals two the first and second answers give the same number, two. One point is not enough. At x equals three they part: three and four and a half. The triangle gives four and a half, so the second answer.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: chegarani o'quvchi tortadi.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'accumulation',
  eyebrow: L('Chegarani torting', 'Потяни границу', 'Drag the boundary'),
  title: L("To'plangan yuzaning o'z grafigi bor", 'У накопленной площади свой график', 'The accumulated area has its own graph'),
  chip: 'f = x',
  graph: {
    fn: (x) => x,
    xDomain: [-0.2, 4.3],
    yDomain: [-0.5, 4.6],
    xTicks: [{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }],
    yTicks: [{ v: 0 }],
    a: 0,
    bStart: 1,
    step: 0.5,
    trace: true,
    fLabel: 'f = x',
    sLabel: 'S',
    areaLabel: L('yuza', 'площадь', 'area'),
    height: 132,
  },
  graphSteps: 3,
  bonus: L(
    "To'plangan yuza qayerda tezroq o'sadi? Egri chiziq balandroq bo'lgan joyda. Bu S ning hosilasi f ga teng degani.",
    'Где накопленная площадь растёт быстрее? Там, где кривая выше. Это и значит, что производная S равна f.',
    'Where does the accumulated area grow faster? Where the curve is higher. That is exactly what it means that the derivative of S equals f.',
  ),
  probe: {
    question: L("Yuza qayerda tezroq to'planadi?", 'Где площадь набирается быстрее?', 'Where does the area build up faster?'),
    items: [
      { id: 'a', label: L('egri chiziq balandroq joyda', 'там, где кривая выше', 'where the curve is higher'), correct: true },
      { id: 'b', label: L('hamma joyda bir xil', 'везде одинаково', 'the same everywhere'), hint: L("Pastdagi egri chiziq izi to'g'ri chiziq emas, u egilib boradi. Demak tezlik o'zgaradi.", 'След внизу не прямая, он загибается. Значит скорость меняется.', 'The trace below is not a straight line, it bends. So the speed changes.') },
      { id: 'c', label: L('nolga yaqin joyda', 'ближе к нулю', 'closer to zero'), hint: L("Nolga yaqin joyda egri chiziq past, va qo'shiladigan bo'lak ingichka.", 'Около нуля кривая низкая, и добавляемый кусок тонкий.', 'Near zero the curve is low, and the piece added is thin.') },
      { id: 'd', label: L("chegara qayerda to'xtasa", 'там, где остановили границу', 'where the boundary was stopped'), hint: L("Chegara qayerda to'xtasa ham, tezlik o'sha nuqtadagi balandlikka bog'liq.", 'Где бы ни остановили границу, скорость зависит от высоты в этой точке.', 'Wherever the boundary stops, the speed depends on the height at that point.') },
    ],
  },
  holds: [4500, 6000, 6500, 8000],
  audio: [
    A('mount', "Bahs yopildi. Endi asbobga qaraymiz: o'ng chegara sizning qo'lingizda.", 'Спор закрыт. Теперь посмотрим на прибор: правая граница в твоих руках.', 'The argument is settled. Now look at the instrument: the right boundary is in your hands.'),
    A('one', "Chegarani torting. Bo'yalgan uchburchak o'sadi, va yuza soni uning ortidan yuguradi.", 'Потяни границу. Закрашенный треугольник растёт, и число площади бежит за ним.', 'Drag the boundary. The shaded triangle grows, and the area number runs after it.'),
    A('two', "Pastda ikkinchi panel: har bir chegara uchun to'plangan yuza nuqta qo'yadi. Nuqtalar iz qoldiradi, va iz to'g'ri chiziq emas, parabola.", 'Внизу вторая панель: для каждой границы накопленная площадь ставит точку. Точки оставляют след, и след не прямая, а парабола.', 'Below is a second panel: for each boundary the accumulated area puts a point. The points leave a trace, and the trace is not a line but a parabola.'),
    A('tangent', "Va mana asosiy savol. Yuza qayerda tezroq to'planadi? Chegarani sekin torting va pastki izga qarang: boshida u yassi, keyin tikroq. Ya'ni yuza egri chiziq balandroq bo'lgan joyda tezroq o'sadi.", 'И вот главный вопрос. Где площадь набирается быстрее? Тяни границу медленно и смотри на нижний след: сначала он пологий, потом круче. То есть площадь растёт быстрее там, где кривая выше.', 'And here is the main question. Where does the area build up faster? Drag the boundary slowly and watch the lower trace: at first it is gentle, then steeper. So the area grows faster where the curve is higher.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1: egri chiziqli trapetsiya va belgining chekkalari.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'accumulation',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Belgining ikki chekkasi', 'Два края у знака', 'Two ends for the sign'),
  rows: [
    'S = ∫ₐᵇ f(x) dx',
    '∫₀³ x dx = 4,5',
  ],
  probe: {
    question: L(
      "∫ₐᵇ f(x)dx yozuvi nimani bildiradi?",
      'Что обозначает запись ∫ₐᵇ f(x)dx ?',
      'What does ∫ₐᵇ f(x)dx denote?',
    ),
    items: [
      { id: 'a', label: L("a dan b gacha egri chiziq ostidagi yuza", 'площадь под кривой от a до b', 'the area under the curve from a to b'), correct: true },
      { id: 'b', label: L("boshlang'ich funksiyalar oilasi", 'семейство первообразных', 'the family of antiderivatives'), hint: L("Chekkasiz belgi oilani bildirardi. Chekkalar paydo bo'lsa, javob SON bo'ladi.", 'Значок без краёв обозначал семейство. Как только появились края, ответ становится ЧИСЛОМ.', 'The sign without ends denoted a family. Once the ends appear, the answer becomes a NUMBER.') },
      { id: 'c', label: L('egri chiziqning uzunligi', 'длина кривой', 'the length of the curve'), hint: L("Uzunlik boshqa masala. Bu yerda pastdagi figura o'lchanadi.", 'Длина это другая задача. Здесь измеряется фигура под кривой.', 'Length is a different problem. Here the figure under the curve is measured.') },
      { id: 'd', label: L("b nuqtadagi qiymat", 'значение в точке b', 'the value at the point b'), hint: L("Bitta nuqtadagi qiymat bu balandlik. Yuza esa butun oraliqdan yig'iladi.", 'Значение в одной точке это высота. А площадь собирается со всего отрезка.', 'The value at one point is a height. The area is gathered from the whole segment.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Egri chiziqli trapetsiya', 'Правило 1. Криволинейная трапеция', 'Rule 1. The curvilinear trapezium'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'S = ∫ₐᵇ f(x) dx',
    lines: [
      L("yuqoridan egri chiziq, pastdan o'q, yonlardan ikki vertikal", 'сверху кривая, снизу ось, по бокам две вертикали', 'the curve above, the axis below, two verticals at the sides'),
      L("a va b belgining chekkalarida yoziladi", 'a и b пишутся у краёв значка', 'a and b are written at the ends of the sign'),
      L("chekkalar paydo bo'lsa, javob son bo'ladi, funksiya emas", 'как появились края, ответ становится числом, а не функцией', 'once the ends appear, the answer is a number, not a function'),
      L("S(a) = 0: bo'sh oraliqda yuza yo'q", 'S(a) = 0: на пустом отрезке площади нет', 'S(a) = 0: an empty segment has no area'),
    ],
    example: L('misol:  ∫₀³ x dx = 4,5', 'пример:  ∫₀³ x dx = 4,5', 'example:  ∫₀³ x dx = 4,5'),
  },
  holds: [4000, 6500, 4500],
  audio: [
    A('mount', "Asbobda ko'rdik. Endi buni yozib qo'yamiz.", 'На приборе увидели. Теперь это запишем.', 'We saw it on the instrument. Now let us write it down.'),
    A('def', "Yuqoridan egri chiziq, pastdan o'q, yonlardan ikkita vertikal bilan chegaralangan figura egri chiziqli trapetsiya deyiladi. Uning yuzasi integral belgisi bilan yoziladi, faqat endi belgining ikkita chekkasi bor: pastda a, tepada b.", 'Фигуру, ограниченную сверху кривой, снизу осью, а по бокам двумя вертикалями, называют криволинейной трапецией. Её площадь записывают знаком интеграла, только теперь у знака два края: внизу a, вверху b.', 'A figure bounded above by the curve, below by the axis and at the sides by two verticals is called a curvilinear trapezium. Its area is written with the integral sign, only now the sign has two ends: a below, b above.'),
    A('rule', "To'g'ri. Chekkalar paydo bo'lishi bilan javob funksiya emas, SON bo'ladi. Ana shu farq aniqmas integraldan.", 'Верно. Как только появились края, ответ это уже не функция, а ЧИСЛО. Вот в чём отличие от неопределённого интеграла.', 'Correct. Once the ends appear, the answer is no longer a function but a NUMBER. That is the difference from the indefinite integral.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: egri chiziq o'q ostiga tushdi.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'signed_area',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L("Egri chiziq o'q ostida", 'Кривая ушла под ось', 'The curve went below the axis'),
  was: { label: UI.was, expr: 'f = x,   0 … 3   →   4,5' },
  now: { label: UI.now, expr: 'f = x − 2,   0 … 3   →   ?' },
  probe1: {
    question: L('Bu holat oldingisidan nimasi bilan farq qiladi?', 'Чем этот случай отличается от прежнего?', 'How does this case differ from the previous one?'),
    items: [
      { id: 'a', label: L("egri chiziqning bir qismi o'q ostida qoldi", 'часть кривой оказалась под осью', 'part of the curve ended up below the axis'), correct: true },
      { id: 'b', label: L("egri chiziq endi to'g'ri chiziq emas", 'кривая больше не прямая', 'the curve is no longer a line'), hint: L("U hamon to'g'ri chiziq, faqat pastroq surilgan.", 'Она всё ещё прямая, просто сдвинута ниже.', 'It is still a line, just moved lower.') },
      { id: 'c', label: L('oraliq uzunroq', 'отрезок стал длиннее', 'the segment got longer'), hint: L("Oraliq o'sha: noldan uchgacha.", 'Отрезок тот же: от нуля до трёх.', 'The segment is the same: from zero to three.') },
      { id: 'd', label: L("figura endi uchburchak emas", 'фигура больше не треугольник', 'the figure is no longer a triangle'), hint: L("Uchburchak, faqat ikkita: biri o'q ostida, biri ustida.", 'Треугольник, только их два: один под осью, другой над.', 'Triangles, only there are two: one below the axis, one above.') },
    ],
  },
  probe2: {
    cols: 2,
    question: L('Integral nimaga teng?', 'Чему равен интеграл?', 'What does the integral equal?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '−1,5' },
      { id: 'b', label: '2,5' },
      { id: 'c', label: '4,5' },
      { id: 'd', label: '1,5' },
    ],
  },
  holds: [4500, 7000, 4000, 3000],
  audio: [
    A('mount', "Birinchi holatda egri chiziq butun oraliqda o'q ustida edi, va yuza oddiy uchburchak berdi.", 'В первом случае кривая на всём отрезке была над осью, и площадь дала обычный треугольник.', 'In the first case the curve was above the axis on the whole segment, and the area gave a plain triangle.'),
    A('now', "Endi to'g'ri chiziq ikki birlik pastga surildi. Noldan ikkigacha u o'q ostida, ikkidan uchgacha ustida. Ikkita uchburchak, va ular har xil tomonda.", 'Теперь прямая сдвинута на две единицы вниз. От нуля до двух она под осью, от двух до трёх над. Два треугольника, и они по разные стороны.', 'Now the line is moved two units down. From zero to two it is below the axis, from two to three above. Two triangles, and they are on different sides.'),
    A('q1', 'Bu holat oldingisidan nimasi bilan farq qiladi?', 'Чем этот случай отличается от прежнего?', 'How does this case differ from the previous one?'),
    A('q2', 'Sizningcha integral nimaga teng? Shunchaki taxmin qiling.', 'Как думаешь, чему равен интеграл? Просто предположи.', 'What do you think the integral equals? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD: integral yoki figuraning yuzasi.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'signed_area',
  eyebrow: L('Ikkalasi ham to\'g\'ri son', 'Оба числа верные', 'Both numbers are correct'),
  title: L('Ikki nomzod', 'Два кандидата', 'Two candidates'),
  expr: 'f = x − 2,   0 … 3',
  need: '= ?',
  answerLabel: L('integral', 'интеграл', 'the integral'),
  cards: [
    {
      tag: L('figuraning yuzasi', 'площадь фигуры', 'the area of the figure'),
      txt: 'S = 2,5',
      point: {
        label: L('ikki uchburchak', 'два треугольника', 'two triangles'),
        calc: '2 + 0,5 = 2,5',
        verdict: 'out',
      },
    },
    {
      tag: L('integral', 'интеграл', 'the integral'),
      txt: '∫ = −1,5',
      point: {
        label: L('pastdagisi ayiriladi', 'нижний вычитается', 'the lower one is subtracted'),
        calc: '−2 + 0,5 = −1,5',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['−1,5', '2,5', '1,5', '4,5'],
    value: ['−1,5'],
    label: '∫ =',
    prompt: L('Integralni yozing', 'Запиши интеграл', 'Write the integral'),
    wrongs: [
      { key: '2,5', hint: L("Bu figuraning yuzasi, va u ham to'g'ri son. Lekin savol integral haqida: pastdagi bo'lak minus bilan kiradi.", 'Это площадь фигуры, и это тоже верное число. Но вопрос про интеграл: нижний кусок входит с минусом.', 'That is the area of the figure, and it is a correct number too. But the question is about the integral: the lower piece enters with a minus.') },
      { key: '1,5', hint: L("Ishora teskari: pastdagi bo'lak kattaroq, demak yig'indi manfiy.", 'Знак обратный: нижний кусок больше, значит сумма отрицательная.', 'The sign is reversed: the lower piece is bigger, so the sum is negative.') },
      { key: '*', hint: L("Ikki bo'lakni ishorasi bilan qo'shing: pastdagisi minus ikki, tepadagisi plyus nol butun besh.", 'Сложи два куска со знаками: нижний минус два, верхний плюс ноль целых пять.', 'Add the two pieces with their signs: the lower one minus two, the upper one plus zero point five.') },
    ],
  },
  holds: [3500, 7500, 6500, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi ikkala sonni ham sanaymiz.', 'Прогноз есть. Теперь посчитаем оба числа.', 'The guess is made. Now let us count both numbers.'),
    A('p1', "Birinchi son: figuraning yuzasi. Pastdagi uchburchakning katetlari ikki va ikki, yuzasi ikki. Tepadagisining katetlari bir va bir, yuzasi nol butun besh. Jami ikki butun besh.", 'Первое число: площадь фигуры. У нижнего треугольника катеты два и два, площадь два. У верхнего катеты один и один, площадь ноль целых пять. Всего два целых пять.', 'The first number: the area of the figure. The lower triangle has legs two and two, area two. The upper one has legs one and one, area zero point five. Two point five in total.'),
    A('p2', "Ikkinchi son: integral. U bir xil sanaladi, faqat o'q ostidagi bo'lak minus bilan kiradi. Minus ikki plyus nol butun besh, ya'ni minus bir butun besh.", 'Второе число: интеграл. Он считается так же, только кусок под осью входит с минусом. Минус два плюс ноль целых пять, то есть минус один целых пять.', 'The second number: the integral. It counts the same way, only the piece below the axis enters with a minus. Minus two plus zero point five, that is minus one point five.'),
    A('write', "Ikkala son ham to'g'ri, lekin ular har xil savolga javob beradi. Integralni yozing.", 'Оба числа верные, но отвечают на разные вопросы. Запиши интеграл.', 'Both numbers are correct, but they answer different questions. Write the integral.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2: ISHORA va jamlanma.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'signed_area',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Integralning ishorasi', 'Знак интеграла', 'The sign of the integral'),
  cases: [
    {
      label: L("o'q ustida", 'над осью', 'above the axis'),
      text: L("bo'lak plyus bilan kiradi", 'кусок входит с плюсом', 'the piece enters with a plus'),
      tone: 'graph',
    },
    {
      label: L("o'q ostida", 'под осью', 'below the axis'),
      text: L("bo'lak minus bilan kiradi", 'кусок входит с минусом', 'the piece enters with a minus'),
      tone: 'accent',
    },
  ],
  rows: ['f > 0   →   ∫ > 0', 'f < 0   →   ∫ < 0'],
  probe: {
    question: L("Integral manfiy bo'lishi mumkinmi?", 'Может ли интеграл быть отрицательным?', 'Can the integral be negative?'),
    items: [
      { id: 'a', label: L("ha, agar egri chiziq o'q ostida bo'lsa", 'да, если кривая под осью', 'yes, if the curve is below the axis'), correct: true },
      { id: 'b', label: L("yo'q, yuza manfiy bo'lmaydi", 'нет, площадь не бывает отрицательной', 'no, an area is never negative'), hint: L("Figuraning yuzasi manfiy bo'lmaydi, bu rost. Integral esa yuza EMAS: u ishorali kattalik.", 'Площадь фигуры не бывает, это верно. Но интеграл это НЕ площадь: это величина со знаком.', 'The area of a figure is not, that is true. But the integral is NOT an area: it is a signed quantity.') },
      { id: 'c', label: L("faqat chegaralar joyi almashsa", 'только если поменять местами края', 'only if the ends are swapped'), hint: L("Bu ham ishorani o'zgartiradi, lekin bu boshqa sabab. Bu yerda egri chiziqning o'zi pastda.", 'Это тоже меняет знак, но причина другая. Здесь сама кривая внизу.', 'That also flips the sign, but for a different reason. Here the curve itself is below.') },
      { id: 'd', label: L("faqat f manfiy son bo'lsa", 'только если f отрицательное число', 'only if f is a negative number'), hint: L("f funksiya, son emas: u bir joyda musbat, boshqa joyda manfiy bo'lishi mumkin.", 'f это функция, а не число: где-то она положительна, где-то отрицательна.', 'f is a function, not a number: it can be positive in one place and negative in another.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Ishora', 'Правило 2. Знак', 'Rule 2. The sign'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'f < 0   →   ∫ < 0',
    lines: [
      L("integral bu ishorali kattalik, figuraning yuzasi emas", 'интеграл это величина со знаком, а не площадь фигуры', 'the integral is a signed quantity, not the area of a figure'),
      L("o'q ostidagi bo'lak ayiriladi", 'кусок под осью вычитается', 'the piece below the axis is subtracted'),
      L("figuraning yuzasi kerak bo'lsa, bo'laklar modul bilan qo'shiladi", 'если нужна площадь фигуры, куски складывают по модулю', 'if the area of the figure is needed, the pieces are added by absolute value'),
      L('javob manfiy chiqsa, bu xato emas', 'отрицательный ответ это не ошибка', 'a negative answer is not a mistake'),
    ],
    example: L('misol:  ∫₀³ (x − 2) dx = −1,5', 'пример:  ∫₀³ (x − 2) dx = −1,5', 'example:  ∫₀³ (x − 2) dx = −1,5'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: "S' = f",
    lines: [
      L("1. yuza chapdan o'ngga to'planadi, S(a) = 0", '1. площадь накапливается слева направо, S(a) = 0', '1. the area accumulates left to right, S(a) = 0'),
      L("2. egri chiziq balandroq bo'lgan joyda tezroq to'planadi", '2. быстрее там, где кривая выше', '2. faster where the curve is higher'),
      L("3. o'q ostidagi bo'lak ayiriladi", '3. кусок под осью вычитается', '3. the piece below the axis is subtracted'),
      L('4. integral son, figuraning yuzasi esa boshqa savol', '4. интеграл это число, а площадь фигуры другой вопрос', '4. the integral is a number, the area of a figure is a different question'),
    ],
  },
  holds: [4000, 6000, 4000, 5500],
  audio: [
    A('mount', "Ikki son ajratildi. Endi qoidani yozamiz.", 'Два числа разведены. Теперь запишем правило.', 'The two numbers are separated. Now let us write the rule.'),
    A('rows', "Egri chiziq o'q ustida bo'lsa, bo'lak plyus bilan kiradi. O'q ostida bo'lsa, minus bilan. Boshqa hech narsa o'zgarmaydi: figura o'sha figura, faqat oldida ishora.", 'Если кривая над осью, кусок входит с плюсом. Если под осью, с минусом. Больше ничего не меняется: фигура та же, просто перед ней знак.', 'If the curve is above the axis, the piece enters with a plus. If below, with a minus. Nothing else changes: the figure is the same, only a sign in front of it.'),
    A('q', "Savol: integral manfiy bo'lishi mumkinmi?", 'Вопрос: может ли интеграл быть отрицательным?', 'The question: can the integral be negative?'),
    A('rule', "To'g'ri. Va shuni yodda tuting: manfiy javob xato emas. Xato bu figuraning yuzasini so'raganda manfiy son yozish.", 'Верно. И запомни: отрицательный ответ не ошибка. Ошибка это написать отрицательное число, когда спросили площадь фигуры.', 'Correct. And remember: a negative answer is not a mistake. The mistake is writing a negative number when the area of a figure was asked.'),
    A('both', 'Endi butun darsni bitta qoidaga yig\'ing.', 'А теперь собери весь урок в одно правило.', 'Now combine the whole lesson into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. ISHORANI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'signed_area',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Ishorani qo\'ying', 'Поставь знак', 'Place the sign'),
  left: 'f = x − 2,   0 … 2',
  template: ['∫ = ', { slot: 0 }, ' 2'],
  signs: ['+', '−'],
  answer: '−',
  checkNote: L(
    "Butun bo'lak o'q ostida: 0 dan 2 gacha x − 2 manfiy",
    'Весь кусок под осью: от 0 до 2 выражение x − 2 отрицательно',
    'The whole piece is below the axis: from 0 to 2 the expression x − 2 is negative',
  ),
  wrongs: [
    { key: '+', hint: L("Nolni qo'ying: nol minus ikki bu minus ikki, ya'ni egri chiziq o'q ostida.", 'Подставь ноль: ноль минус два это минус два, значит кривая под осью.', 'Substitute zero: zero minus two is minus two, so the curve is below the axis.') },
  ],
  probe: {
    question: L("Ishora nimaga qarab qo'yiladi?", 'По чему ставится знак?', 'What decides the sign?'),
    items: [
      { id: 'a', label: L("egri chiziq o'qning qaysi tomonida turganiga", 'по тому, с какой стороны оси идёт кривая', 'by which side of the axis the curve runs'), correct: true },
      { id: 'b', label: L("oraliqning uzunligiga", 'по длине отрезка', 'by the length of the segment'), hint: L("Uzunlik yuzaning kattaligini beradi, ishorani emas.", 'Длина даёт величину площади, а не знак.', 'The length gives the size of the area, not the sign.') },
      { id: 'c', label: L("chegaralarning ishorasiga", 'по знаку самих границ', 'by the sign of the boundaries themselves'), hint: L("Bu yerda ikkala chegara ham musbat, integral esa manfiy.", 'Здесь обе границы положительны, а интеграл отрицателен.', 'Here both boundaries are positive, yet the integral is negative.') },
      { id: 'd', label: L('har doim plyus', 'всегда плюс', 'always a plus'), hint: L("O'q ostida minus. Buni endigina ko'rdik.", 'Под осью минус. Мы это только что видели.', 'Below the axis it is a minus. We have just seen that.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Ishorani qo'ying.", 'Поставь знак.', 'Place the sign.'),
    A('checked', "Bo'ldi. Endi ta'riflang: ishora nimaga qarab qo'yiladi?", 'Получилось. Теперь сформулируй: по чему ставится знак?', 'Done. Now put it into words: what decides the sign?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'split', label: L('figuralarga ajratish', 'разбить на фигуры', 'split into figures') },
  { id: 'calc', label: L('yuzalarni sanash', 'посчитать площади', 'count the areas') },
  { id: 'sum', label: L("qo'shish", 'сложить', 'add them up') },
  { id: 'sign', label: L("ishorani hisobga olish", 'учесть знак', 'account for the sign') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'accumulation',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: '∫₀⁴ (x/2 + 1) dx',
  actions: ACTIONS_10,
  steps: [
    {
      action: 'split',
      to: '4 · 1   +   4 · 2 / 2',
      wrongs: [
        { action: 'calc', hint: L("Avval figuralarga ajrating: pastda to'rtburchak, tepada uchburchak.", 'Сначала разбей на фигуры: снизу прямоугольник, сверху треугольник.', 'Split into figures first: a rectangle below, a triangle above.') },
        { action: 'sum', hint: L("Hali qo'shadigan narsa yo'q.", 'Пока складывать нечего.', 'There is nothing to add yet.') },
        { action: 'sign', hint: L("Butun figura o'q ustida: ishora plyus.", 'Вся фигура над осью: знак плюс.', 'The whole figure is above the axis: the sign is a plus.') },
      ],
    },
    {
      action: 'calc',
      to: '4   +   4',
      wrongs: [
        { action: 'split', hint: L("Allaqachon ajratilgan.", 'Уже разбито.', 'It is already split.') },
        { action: 'sum', hint: L("Avval har birini sanang.", 'Сначала посчитай каждую.', 'Count each one first.') },
        { action: 'sign', hint: L("Ishora plyus: figura o'q ustida.", 'Знак плюс: фигура над осью.', 'The sign is a plus: the figure is above the axis.') },
      ],
    },
    {
      action: 'sum',
      to: '∫ = 8',
      wrongs: [
        { action: 'split', hint: L("Allaqachon ajratilgan.", 'Уже разбито.', 'It is already split.') },
        { action: 'calc', hint: L("Yuzalar sanalgan: to'rt va to'rt.", 'Площади посчитаны: четыре и четыре.', 'The areas are counted: four and four.') },
        { action: 'sign', hint: L("Ishora plyus, u hech narsani o'zgartirmaydi.", 'Знак плюс, он ничего не меняет.', 'The sign is a plus, it changes nothing.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['8', '6', '10', '16'],
    value: ['8'],
    label: '∫ =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '6', hint: L("Trapetsiya bilan tekshiring: asoslari bir va uch, balandligi to'rt.", 'Проверь трапецией: основания один и три, высота четыре.', 'Check with the trapezium: the bases are one and three, the height is four.') },
      { key: '16', hint: L("Bu to'rtburchakning yuzasi, tepasi to'g'ri chiziq bilan kesilmagan.", 'Это площадь прямоугольника, у которого верх не срезан прямой.', 'That is the area of a rectangle whose top is not cut by the line.') },
      { key: '*', hint: L("Ikkita figura: to'rtburchak to'rt karra bir va uchburchak to'rt karra ikki, ikkiga.", 'Две фигуры: прямоугольник четыре на один и треугольник четыре на два, пополам.', 'Two figures: a rectangle four by one and a triangle four by two, halved.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi trapetsiyani sanaymiz.', 'Правило сформулировано. Посчитаем трапецию.', 'The rule is stated. Let us count the trapezium.'),
    A('start', "Nolda balandlik bir, to'rtda balandlik uch. Nimadan boshlashni tanlang.", 'В нуле высота один, в четырёх высота три. Выбери, с чего начать.', 'At zero the height is one, at four the height is three. Choose where to start.'),
    A('step4', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'signed_area',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Rasmga qarab hisoblang', 'Посчитай по рисунку', 'Count it from the picture'),
  // Funksiya formulasi BERILMAYDI: uni chizma aytadi. Imtihonda shunday.
  start: '∫₋₁² f(x) dx',
  fig: () => (
    <AreaBoard
      fn={(x) => x}
      xDomain={[-1.6, 2.6]}
      yDomain={[-1.6, 2.4]}
      xTicks={[{ v: -1 }, { v: 1 }, { v: 2 }]}
      yTicks={[{ v: 0 }]}
      a={-1}
      b={2}
      height={112}
    />
  ),
  actions: ACTIONS_10,
  hint: L(
    "Chap bo'lak o'q ostida qoladi.",
    'Левый кусок остаётся под осью.',
    'The left piece stays below the axis.',
  ),
  steps: [
    {
      action: 'split',
      to: '(−1 … 0)   va   (0 … 2)',
      wrongs: [
        { action: 'calc', hint: L("Avval ajrating: nolda egri chiziq o'qni kesib o'tadi.", 'Сначала разбей: в нуле кривая пересекает ось.', 'Split first: at zero the curve crosses the axis.') },
        { action: 'sum', hint: L("Hali qo'shadigan narsa yo'q.", 'Пока складывать нечего.', 'There is nothing to add yet.') },
        { action: 'sign', hint: L("Avval bo'laklarni ajrating, keyin ishora.", 'Сначала раздели куски, потом знак.', 'Separate the pieces first, then the sign.') },
      ],
    },
    {
      action: 'sign',
      to: '−0,5   va   +2',
      wrongs: [
        { action: 'split', hint: L("Allaqachon ajratilgan.", 'Уже разбито.', 'It is already split.') },
        { action: 'calc', hint: L("Yuzalar sanalgan: nol butun besh va ikki.", 'Площади посчитаны: ноль целых пять и два.', 'The areas are counted: zero point five and two.') },
        { action: 'sum', hint: L("Ishorasiz qo'shsangiz, javob noto'g'ri chiqadi.", 'Если сложить без знаков, ответ выйдет неверный.', 'Adding without the signs gives a wrong answer.') },
      ],
    },
    {
      action: 'sum',
      to: '∫ = 1,5',
      wrongs: [
        { action: 'split', hint: L("Allaqachon ajratilgan.", 'Уже разбито.', 'It is already split.') },
        { action: 'calc', hint: L("Sanalgan.", 'Посчитано.', 'Counted.') },
        { action: 'sign', hint: L("Ishoralar qo'yildi.", 'Знаки уже поставлены.', 'The signs are already placed.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['1,5', '2,5', '−1,5', '0,5'],
    value: ['1,5'],
    label: '∫ =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '2,5', hint: L("Bu figuraning yuzasi. Integralda chap bo'lak minus bilan kiradi.", 'Это площадь фигуры. В интеграле левый кусок входит с минусом.', 'That is the area of the figure. In the integral the left piece enters with a minus.') },
      { key: '−1,5', hint: L("Ishora teskari: o'ng bo'lak kattaroq, demak yig'indi musbat.", 'Знак обратный: правый кусок больше, значит сумма положительная.', 'The sign is reversed: the right piece is bigger, so the sum is positive.') },
      { key: '*', hint: L("Chap uchburchak minus nol butun besh, o'ng uchburchak plyus ikki.", 'Левый треугольник минус ноль целых пять, правый плюс два.', 'The left triangle is minus zero point five, the right one plus two.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Chegara minus birdan ikkigacha, va egri chiziq yo'lda o'qni kesib o'tadi.", 'Границы от минус одного до двух, и кривая по дороге пересекает ось.', 'The boundaries run from minus one to two, and the curve crosses the axis on the way.'),
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
      id: 'b1', tag: 'accumulation', ask: true, cols: 4,
      done: '∫₀² 3 dx = 6',
      prompt: L('∫₀² 3 dx = ?', 'Чему равен ∫₀² 3 dx ?', 'What is ∫₀² 3 dx ?'),
      items: [
        { id: 'a', label: '6', correct: true },
        { id: 'b', label: '3', hint: L("Balandlik uch, eni ikki: figura to'rtburchak.", 'Высота три, ширина два: фигура прямоугольник.', 'Height three, width two: the figure is a rectangle.') },
        { id: 'c', label: '5', hint: L("Ko'paytirish kerak, qo'shish emas.", 'Надо умножить, а не сложить.', 'You must multiply, not add.') },
        { id: 'd', label: '1,5', hint: L("Bu to'rtburchak, uchburchak emas: ikkiga bo'lish shart emas.", 'Это прямоугольник, а не треугольник: делить пополам не нужно.', 'That is a rectangle, not a triangle: no halving is needed.') },
      ],
    },
    {
      id: 'b2', tag: 'accumulation', ask: true, cols: 4,
      done: '∫₀¹ x dx = 0,5',
      prompt: L('∫₀¹ x dx = ?', 'Чему равен ∫₀¹ x dx ?', 'What is ∫₀¹ x dx ?'),
      items: [
        { id: 'a', label: '0,5', correct: true },
        { id: 'b', label: '1', hint: L("Figura uchburchak: katetlari bir va bir, yuzasi yarim.", 'Фигура треугольник: катеты один и один, площадь половина.', 'The figure is a triangle: legs one and one, area a half.') },
        { id: 'c', label: '2', hint: L("Ikkiga bo'lish kerak, ko'paytirish emas.", 'Надо поделить пополам, а не умножить.', 'You must halve, not multiply.') },
        { id: 'd', label: '0', hint: L("Figura bor: ingichka, lekin yuzasi noldan katta.", 'Фигура есть: узкая, но площадь больше нуля.', 'There is a figure: narrow, but its area is greater than zero.') },
      ],
    },
    {
      id: 'b3', tag: 'signed_area', ask: true, cols: 2,
      done: L("o'q ostida integral manfiy", 'под осью интеграл отрицателен', 'below the axis the integral is negative'),
      prompt: L(
        "Egri chiziq butun oraliqda o'q ostida. Integralning ishorasi?",
        'Кривая на всём отрезке под осью. Какой знак у интеграла?',
        'The curve is below the axis on the whole segment. What is the sign of the integral?',
      ),
      items: [
        { id: 'a', label: L('manfiy', 'отрицательный', 'negative'), correct: true },
        { id: 'b', label: L('musbat', 'положительный', 'positive'), hint: L("O'q ostidagi bo'lak ayiriladi.", 'Кусок под осью вычитается.', 'The piece below the axis is subtracted.') },
        { id: 'c', label: L('nol', 'ноль', 'zero'), hint: L("Nol faqat bo'laklar bir birini yo'qotganda chiqadi.", 'Ноль выйдет только если куски погасят друг друга.', 'Zero comes out only if the pieces cancel each other.') },
        { id: 'd', label: L('aniqlab bo\'lmaydi', 'определить нельзя', 'it cannot be determined'), hint: L("Mumkin: butun oraliqda pastda demak manfiy.", 'Можно: раз на всём отрезке внизу, значит отрицательный.', 'It can: below on the whole segment means negative.') },
      ],
    },
    {
      id: 'b4', tag: 'accumulation', ask: true, cols: 2,
      done: 'S(a) = 0',
      prompt: L('S(a) nechaga teng?', 'Чему равно S(a) ?', 'What does S(a) equal?'),
      items: [
        { id: 'a', label: '0', correct: true },
        { id: 'b', label: 'f(a)', hint: L("Bu balandlik. Yuza esa hali to'planmagan.", 'Это высота. А площадь ещё не накоплена.', 'That is a height. The area is not accumulated yet.') },
        { id: 'c', label: 'a', hint: L("Bu chegaraning o'zi, yuza emas.", 'Это сама граница, а не площадь.', 'That is the boundary itself, not an area.') },
        { id: 'd', label: L("aniqlanmagan", 'не определено', 'undefined'), hint: L("Aniqlangan: bo'sh oraliqning yuzasi nol.", 'Определено: площадь пустого отрезка ноль.', 'It is defined: the area of an empty segment is zero.') },
      ],
    },
    {
      id: 'b5', tag: 'accumulation', ask: true, cols: 2,
      done: L('egri chiziq balandroq joyda', 'там, где кривая выше', 'where the curve is higher'),
      prompt: L("Yuza qayerda tezroq to'planadi?", 'Где площадь набирается быстрее?', 'Where does the area build up faster?'),
      items: [
        { id: 'a', label: L('egri chiziq balandroq joyda', 'там, где кривая выше', 'where the curve is higher'), correct: true },
        { id: 'b', label: L("chegaraga yaqin joyda", 'ближе к границе', 'closer to the boundary'), hint: L("Chegaraning joyi muhim emas, balandlik muhim.", 'Место границы не важно, важна высота.', 'The place of the boundary does not matter, the height does.') },
        { id: 'c', label: L('hamma joyda bir xil', 'везде одинаково', 'the same everywhere'), hint: L("Unda to'plangan yuzaning izi to'g'ri chiziq bo'lardi.", 'Тогда след накопленной площади был бы прямой.', 'Then the trace of the accumulated area would be a straight line.') },
        { id: 'd', label: L("egri chiziq pastroq joyda", 'там, где кривая ниже', 'where the curve is lower'), hint: L("Aksincha: past egri chiziq ingichka bo'lak qo'shadi.", 'Наоборот: низкая кривая добавляет тонкий кусок.', 'The opposite: a low curve adds a thin piece.') },
      ],
    },
    {
      id: 'b6', tag: 'signed_area', ask: true, cols: 2,
      done: L('manfiy javob xato emas', 'отрицательный ответ не ошибка', 'a negative answer is not a mistake'),
      prompt: L(
        'Integral manfiy chiqdi. Bu xatomi?',
        'Интеграл вышел отрицательным. Это ошибка?',
        'The integral came out negative. Is that a mistake?',
      ),
      items: [
        { id: 'a', label: L("yo'q, agar egri chiziq o'q ostida bo'lsa", 'нет, если кривая под осью', 'no, if the curve is below the axis'), correct: true },
        { id: 'b', label: L('ha, yuza manfiy bo\'lmaydi', 'да, площадь не бывает отрицательной', 'yes, an area is never negative'), hint: L("Figuraning yuzasi manfiy bo'lmaydi. Integral esa yuza emas.", 'Площадь фигуры не бывает. Но интеграл это не площадь.', 'The area of a figure is not. But the integral is not an area.') },
        { id: 'c', label: L('ha, har doim', 'да, всегда', 'yes, always'), hint: L("Manfiy integral butunlay normal natija.", 'Отрицательный интеграл совершенно нормальный результат.', 'A negative integral is a perfectly normal result.') },
        { id: 'd', label: L("faqat chegaralar manfiy bo'lsa", 'только если границы отрицательны', 'only if the boundaries are negative'), hint: L("Chegaralarning ishorasi bunga aloqador emas.", 'Знак границ к этому не относится.', 'The sign of the boundaries is beside the point.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Endi uchburchak.", 'Теперь треугольник.', 'Now a triangle.'),
    A('q3', "Ishora haqida.", 'Про знак.', 'About the sign.'),
    A('q4', "Boshlanish nuqtasi.", 'Про начало отсчёта.', 'About the starting point.'),
    A('q5', "Tezlik haqida.", 'Про скорость.', 'About the speed.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: savol almashtirilgan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'signed_area',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Hamma satr to\'g\'ri, javob xato', 'Все строки верны, ответ неверный', 'Every line is right, the answer is wrong'),
  rows: [
    { id: 'r1', text: L('f = x − 2,  0 dan 3 gacha', 'f = x − 2, от 0 до 3', 'f = x − 2, from 0 to 3') },
    { id: 'r2', text: L("o'q ostida yuza 2, ustida 0,5", 'под осью площадь 2, над осью 0,5', 'below the axis area 2, above 0,5') },
    { id: 'r3', text: L('jami 2,5', 'всего 2,5', '2,5 in total') },
    { id: 'r4', text: L('javob: integral = 2,5', 'ответ: интеграл = 2,5', 'answer: the integral = 2,5') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu shartning o'zi, unda xato yo'q.", 'Это само условие, ошибки в нём нет.', 'This is the problem itself, there is no error in it.'),
    r2: L("Ikkala yuza ham to'g'ri sanalgan: ikki va nol butun besh.", 'Обе площади посчитаны верно: два и ноль целых пять.', 'Both areas are counted correctly: two and zero point five.'),
    r3: L("Bu satr ham to'g'ri, lekin u FIGURANING yuzasi. Xato keyingi satrda paydo bo'ladi.", 'Эта строка тоже верна, но это площадь ФИГУРЫ. Ошибка появляется в следующей строке.', 'This line is correct too, but it is the area of the FIGURE. The error appears in the next line.'),
  },
  proofPoint: '−2 + 0,5 = −1,5',
  proof: L(
    "Hamma satr to'g'ri, lekin oxirgisida savol almashtirilgan. Figuraning yuzasi haqiqatan ikki butun besh. Integralda esa pastdagi bo'lak minus bilan kiradi, va minus bir butun besh chiqadi.",
    'Все строки верны, но в последней подменён вопрос. Площадь фигуры действительно два целых пять. А в интеграле нижний кусок входит с минусом, и получается минус один целых пять.',
    'Every line is correct, but the last one swaps the question. The area of the figure really is two point five. But in the integral the lower piece enters with a minus, and it comes out minus one point five.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L("figuraning yuzasi integral deb yozilgan", 'площадь фигуры записана как интеграл', 'the area of the figure was written as the integral'), correct: true },
      { id: 'b', label: L("yuzalar noto'g'ri sanalgan", 'площади посчитаны неверно', 'the areas were counted wrongly'), hint: L("Sanoq to'g'ri: katetlari ikki va ikki, hamda bir va bir.", 'Счёт верный: катеты два и два, а также один и один.', 'The counting is right: legs two and two, and one and one.') },
      { id: 'c', label: L('oraliq xato olingan', 'взят не тот отрезок', 'the wrong segment was taken'), hint: L("Oraliq shartdagidek: noldan uchgacha.", 'Отрезок как в условии: от нуля до трёх.', 'The segment is as in the problem: from zero to three.') },
      { id: 'd', label: L("figura noto'g'ri aniqlangan", 'фигура определена неверно', 'the figure was identified wrongly'), hint: L("Figura to'g'ri: ikkita uchburchak.", 'Фигура верна: два треугольника.', 'The figure is right: two triangles.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda hamma satr to'g'ri sanalgan, va shunga qaramay javob xato. Xato birinchi marta paydo bo'lgan satrni toping.", 'Здесь все строки посчитаны верно, и всё равно ответ неверный. Найди строку, в которой ошибка появилась впервые.', 'Here every line is counted correctly, and still the answer is wrong. Find the line where the error first appeared.'),
    A('proof', "Qarang: ikki butun besh bu figuraning yuzasi, va u to'g'ri. Lekin so'ralgani integral, va unda pastdagi bo'lak minus bilan kiradi. Bu darsning eng qimmat xatosi: sanoq to'g'ri, savol esa almashtirilgan.", 'Смотри: два целых пять это площадь фигуры, и она верна. Но спрашивали интеграл, а в нём нижний кусок входит с минусом. Это самая дорогая ошибка урока: счёт верный, а вопрос подменён.', 'Look: two point five is the area of the figure, and it is correct. But the integral was asked, and in it the lower piece enters with a minus. This is the most expensive mistake of the lesson: the counting is right, the question is swapped.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'signed_area',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Bo\'laklardan yig\'ing', 'Собери из кусков', 'Build it from pieces'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L("har bo'lak o'z ishorasi bilan", 'каждый кусок со своим знаком', 'each piece with its own sign'),
  tasks: [
    {
      prompt: 'f = x − 2,   0 … 3',
      template: ['∫ = ', { slot: 0 }, '  +  ', { slot: 1 }],
      parts: ['−2', '2', '0,5', '−0,5'],
      answer: ['−2', '0,5'],
      doneLabel: '−2 + 0,5 = −1,5',
      wrongs: [
        { key: '2|0,5', hint: L("Birinchi bo'lak o'q ostida: u minus bilan kiradi.", 'Первый кусок под осью: он входит с минусом.', 'The first piece is below the axis: it enters with a minus.') },
        { key: '*', hint: L("Chapdagi uchburchak pastda, o'ngdagisi tepada.", 'Левый треугольник внизу, правый наверху.', 'The left triangle is below, the right one above.') },
      ],
    },
    {
      prompt: 'f = x,   −1 … 2',
      template: ['∫ = ', { slot: 0 }, '  +  ', { slot: 1 }],
      parts: ['−0,5', '0,5', '2', '−2'],
      answer: ['−0,5', '2'],
      doneLabel: '−0,5 + 2 = 1,5',
      wrongs: [
        { key: '0,5|2', hint: L("Minus birdan nolgacha egri chiziq o'q ostida.", 'От минус одного до нуля кривая под осью.', 'From minus one to zero the curve is below the axis.') },
        { key: '*', hint: L("Chap uchburchakning katetlari bir va bir, o'ngdagisiniki ikki va ikki.", 'У левого треугольника катеты один и один, у правого два и два.', 'The left triangle has legs one and one, the right one two and two.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi: chegaralar minus birdan boshlanadi.", 'А теперь второе: границы начинаются с минус одного.', 'And now the second one: the boundaries start at minus one.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'accumulation',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: "S' = f",
  ruleLines: [
    L("yuza chapdan o'ngga to'planadi va S(a) = 0", 'площадь накапливается слева направо, S(a) = 0', 'the area accumulates left to right, S(a) = 0'),
    L("egri chiziq balandroq bo'lgan joyda tezroq", 'быстрее там, где кривая выше', 'faster where the curve is higher'),
    L("o'q ostidagi bo'lak ayiriladi: integral yuza emas", 'кусок под осью вычитается: интеграл это не площадь', 'the piece below the axis is subtracted: the integral is not an area'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L("f = x ostidagi yuza", 'площадь под f = x', 'the area under f = x'),
      right: 'S = x²/2',
      map: {
        a: 'S = x',
        b: 'S = x²/2',
        both: '—',
        none: '—',
      },
    },
    {
      screen: 5,
      expr: 'f = x − 2,  0 … 3',
      right: '−1,5',
      map: { a: '−1,5', b: '2,5', c: '4,5', d: '1,5' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '∫₀³ x dx = 4,5   =   3 · 3 / 2',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Asbobga qayting va chegarani yana torting', 'Вернись к прибору и снова потяни границу', 'Go back to the instrument and drag the boundary again'),
  },
  probe: {
    question: L(
      "Keyingi darsda nima yengillashadi?",
      'Что станет проще на следующем уроке?',
      'What will become easier next lesson?',
    ),
    items: [
      { id: 'a', label: L("yuzani figurasiz, boshlang'ich funksiya orqali sanash", 'считать площадь без фигуры, через первообразную', 'counting the area without a figure, through the antiderivative'), correct: true },
      { id: 'b', label: L('figuralarni tezroq chizish', 'быстрее рисовать фигуры', 'drawing figures faster'), hint: L("Chizish bu vosita edi. Keyingi dars uni umuman kerak qilmaydi.", 'Рисование было средством. Следующий урок сделает его вообще не нужным.', 'Drawing was a means. The next lesson makes it unnecessary altogether.') },
      { id: 'c', label: L('ishorani unutish', 'забыть про знак', 'forgetting the sign'), hint: L("Ishora qoladi: u formulada ham o'zi chiqadi.", 'Знак останется: он и в формуле получается сам.', 'The sign stays: it comes out of the formula on its own.') },
      { id: 'd', label: L('hech narsa', 'ничего', 'nothing'), hint: L("Yengillashadi: uchburchak va trapetsiya o'rniga ikkita son ayiriladi.", 'Станет: вместо треугольников и трапеций вычитаются два числа.', 'It will: instead of triangles and trapezia, two numbers get subtracted.') },
    ],
  },
  sheetTitle: L('Aniq integral · shpargalka', 'Определённый интеграл · шпаргалка', 'The definite integral · cheat sheet'),
  sheetSrc: L('11-sinf · 4-dars', '11 класс · урок 4', 'Grade 11 · lesson 4'),
  lifehack: L(
    "Javobni ishora bilan tekshiring: egri chiziq asosan o'q ostida bo'lsa, integral manfiy chiqishi SHART.",
    'Проверяй ответ знаком: если кривая в основном под осью, интеграл ОБЯЗАН выйти отрицательным.',
    'Check the answer by its sign: if the curve is mostly below the axis, the integral MUST come out negative.',
  ),
  holds: [2500, 8000, 7000, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Birinchi savolda yuza kvadrat bo'yicha o'sdi, va buni oddiy uchburchak ko'rsatdi.", 'Вот твои прогнозы и вот как оказалось. В первом вопросе площадь росла по квадрату, и показал это обычный треугольник.', 'Here are your guesses and here is how it turned out. In the first question the area grew as a square, and a plain triangle showed it.'),
    A('rule', "Va mana asosiy fikr. To'plangan yuza bu funksiya, va u qayerda tezroq o'sadi degan savolning javobi egri chiziqning balandligi. Ya'ni yuzaning hosilasi egri chiziqning o'ziga teng. Keyingi darsda shundan formula chiqadi.", 'И вот главная мысль. Накопленная площадь это функция, и ответ на вопрос, где она растёт быстрее, это высота кривой. То есть производная площади равна самой кривой. На следующем уроке из этого выйдет формула.', 'And here is the main point. The accumulated area is a function, and the answer to where it grows faster is the height of the curve. So the derivative of the area equals the curve itself. Next lesson a formula will come out of this.'),
    A('q', "Oxirgi savol: keyingi darsda nima yengillashadi?", 'Последний вопрос: что станет проще на следующем уроке?', 'The last question: what will become easier next lesson?'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
