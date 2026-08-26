// ============================================================================
// 11-sinf, Dars 46. ALMASHTIRISHLAR: SINOV DTM.
//
// B6 blokining to'rtinchi darsi -- va DTM REJIMIDAGI birinchisi.
//   kontrakt: src/books/grade11/ETALON_11SINF.md, 1.2-band (DTM anatomiyasi)
//   asbob:    `GraphProjection`, `TransformChain`, `AnswerValue`, `Probe`
//   tayanch:  kursning 9-14 darslari (daraja, ildiz, logarifm)
//
// DARSNING BITTA GAPI: bu dars yangi narsa bermaydi -- u qaysi joyda teshik
// borligini KO'RSATADI. Masala darrov beriladi, tushuntirish yo'q.
//
// NEGA TUSHUNTIRISH YO'Q. Metodist qarori 2026-08-21: takrorlash bloki DTM
// rejimida ishlaydi. `support`, `rule` va `newcase` ekranlari olib tashlandi,
// ularning o'rniga masalalar turadi. Etalon 1.2-bandi shu anatomiyani
// belgilaydi, va `MODE` satri tekshiruvga ham shuni aytadi.
//
// SONLAR TEKSHIRILDI:
//   ildiz((−3)²) = 3, chunki ildiz manfiy bo'lmaydi
//   ildiz(x²) = |x|:  x = 5 -> 5;  x = −5 -> 5;  x = 0 -> 0;  x = −0,5 -> 0,5
//   (−2)⁻³ = −1/8, ya'ni ISHORA saqlanadi
//   log₂(x − 1) < 2  ->  1 < x < 5
//   4ˣ = 8  ->  2²ˣ = 2³  ->  x = 1,5
//   log₂(x²) = 4  ->  x² = 16  ->  x = ±4 (ikkisi ham ODZ da)
//   3ˣ hech qachon nol emas: 3⁻² = 1/9, 3⁰ = 1, 3² = 9
//   9ˣ − 4·3ˣ + 3 = 0  ->  t² − 4t + 3 = 0  ->  t = 1; 3  ->  x = 0; 1
//   log₀,₅ 8 = −3;  log₀,₂ 25 = −2
//   ildiz(49x²) da x < 0  ->  −7x
//   ODZ: log(x − 1) + log(3 − x)  ->  (1; 3)
//   blits: ildiz((−7)²) = 7;  5⁻² = 1/25;  27ˣ = 3 -> x = 1/3;
//          log₃(x + 4) ODZ: x > −4;  0,2ˣ manfiy bo'lmaydi
//   audit: ildiz(x²) = 6  ->  |x| = 6  ->  x = ±6, bitta ildiz tushib qolgan
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_46',
  title: L('Almashtirishlar: sinov DTM', 'Преобразования: пробный ДТМ', 'Transformations: a mock exam'),
}

const BLOCK = { label: 'B6', from: 43, to: 49, current: 46 }

// DTM REJIMI. Etalon 1.2-bandi: tushuntirish bloki yo'q, masala darrov beriladi.
const MODE = 'dtm'

// y = log₂(x − 1)
const LOG2M = (x) => Math.log(x - 1) / Math.log(2)

// ============================================================
// SLAYD 1. XUK. Ildiz va modul: ikki urinish.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Sinov DTM', 'Пробный ДТМ', 'Mock exam'),
  title: L('Ildiz ostidan nima chiqadi', 'Что выходит из-под корня', 'What comes out from under the root'),
  expr: '√((−3)²)',
  rows: [
    {
      id: 'a',
      name: L('Karim', 'Карим', 'Karim'),
      value: '−3',
    },
    {
      id: 'b',
      name: L('Nargiza', 'Наргиза', 'Nargiza'),
      value: '3',
    },
  ],
  probe: {
    question: L(
      "Qaysi javob to'g'ri?",
      'Какой ответ верный?',
      'Which answer is right?',
    ),
    afterPredict: L(
      'Javobingiz yozib olindi. Endi masalalar boshlanadi.',
      'Твой ответ записан. Теперь начинаются задачи.',
      'Your answer is saved. Now the problems begin.',
    ),
    items: [
      { id: 'a', label: '3' },
      { id: 'b', label: '−3' },
      { id: 'c', label: '±3' },
      { id: 'd', label: '9' },
    ],
  },
  holds: [4200, 4500, 3200],
  audio: [
    A('mount', "Bu dars yangi mavzu bermaydi. Bu sinov: masalalar darrov beriladi, va natija qaysi joyda teshik borligini ko'rsatadi.", 'Этот урок не даёт новой темы. Это проверка: задачи идут сразу, а результат показывает, где дырка.', 'This lesson brings no new topic. It is a check: the problems come at once, and the result shows where the gap is.'),
    A('r1', "Karim ildiz ostidagi kvadratni yo'qotdi va minus uchni qoldirdi.", 'Карим убрал квадрат из-под корня и оставил минус три.', 'Karim cancelled the square under the root and left minus three.'),
    A('r2', "Nargiza esa uch deb javob berdi.", 'А Наргиза ответила три.', 'Nargiza answered three.'),
    A('ask', "Sizningcha qaysi javob to'g'ri. Hozircha shunchaki taxmin qiling.", 'Как думаешь, какой ответ верный. Пока просто предположи.', 'Which answer do you think is right. Just make a guess for now.'),
  ],
}

// ============================================================
// SLAYD 2. MASALA 1. Ildiz va modul.
// ============================================================
const S2 = {
  role: 'points',
  section: 'practice',
  led: 'student',
  tag: 'root_modulus',
  eyebrow: L('Masala 1', 'Задача 1', 'Problem 1'),
  title: L('Qaysi yozuvda qoida yiqiladi', 'Где правило падает', 'Where the rule falls'),
  expr: '√(x²)',
  goal: L('birinchi qoidani sinash', 'проверить первое правило', 'test the first rule'),
  rule: L(
    "Har bir qiymatda ildizni hisoblaymiz.",
    'В каждом значении считаем корень.',
    'At each value we compute the root.',
  ),
  pick: L('Qaysi qiymatni tekshiramiz?', 'Какое значение проверим?', 'Which value shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('x chiqadi', 'выходит x', 'x comes out'), value: 'x' },
    { id: 'b', key: 'inB', name: L('modul chiqadi', 'выходит модуль', 'the modulus comes out'), value: '|x|' },
  ],
  points: [
    {
      id: 'q1', label: 'x = 5', num: '5', step: 'calc', verdict: 'out',
      calc: L('ikkisi ham 5', 'оба дают 5', 'both give 5'),
      sol: false, inA: true, inB: true,
    },
    {
      id: 'q2', label: 'x = −5', num: '5', step: 'calc', verdict: 'in',
      calc: L('birinchisi −5 berardi', 'первое дало бы −5', 'the first would give −5'),
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q3', label: 'x = 0', num: '0', step: 'calc', verdict: 'out',
      calc: L("nolda farq yo'q", 'в нуле разницы нет', 'at zero there is no difference'),
      sol: false, inA: true, inB: true,
    },
    {
      id: 'q4', label: 'x = −0,5', num: '0,5', step: 'calc', verdict: 'in',
      calc: L('yana ishora almashdi', 'знак снова сменился', 'the sign flipped again'),
      sol: true, inA: false, inB: true,
    },
  ],
  probe: {
    question: L(
      '√(x²) nimaga teng?',
      'Чему равно √(x²)?',
      'What does √(x²) equal?',
    ),
    items: [
      { id: 'b', label: '|x|', correct: true },
      { id: 'a', label: 'x', hint: L("Manfiy x da bu yolg'on: ildiz manfiy son bermaydi.", 'При отрицательном x это ложь: корень не даёт отрицательного числа.', 'For negative x that is false: a root never gives a negative number.') },
      { id: 'c', label: '±x', hint: L("Ildiz BITTA son beradi, ikkitasini emas.", 'Корень даёт ОДНО число, а не два.', 'A root gives ONE number, not two.') },
      { id: 'd', label: 'x²', hint: L("Kvadrat ildiz bilan qisqaradi, lekin modul qoladi.", 'Квадрат сокращается с корнем, но модуль остаётся.', 'The square cancels with the root, but the modulus stays.') },
    ],
  },
  holds: [3000, 2400, 2600, 8000],
  audio: [
    A('mount', "Birinchi masala. Ikki da'vo bor, va to'rtta qiymat ularni sinaydi.", 'Первая задача. Есть два утверждения, и четыре значения их испытают.', 'The first problem. There are two claims, and four values will test them.'),
    A('mount', "Qiymatni o'zingiz tanlaysiz.", 'Значение выбираешь сам.', 'You choose the value yourself.'),
    A('calc', 'Hisoblaymiz.', 'Считаем.', 'We compute.'),
    A('mark', "Mana natija. Musbat x da ikki qoida bir xil javob beradi, shuning uchun farq ko'rinmaydi. Manfiy x da esa birinchi qoida manfiy son berardi, ildiz esa manfiy bo'lmaydi. Demak ildiz ostidan modul chiqadi.", 'Вот результат. При положительном x оба правила дают одно и то же, поэтому разница не видна. А при отрицательном первое правило дало бы отрицательное число, а корень отрицательным не бывает. Значит из-под корня выходит модуль.', 'Here is the result. For positive x both rules agree, so the difference is invisible. For negative x the first rule would give a negative number, and a root is never negative. So the modulus comes out.'),
  ],
}

// ============================================================
// SLAYD 3. MASALA 2. Manfiy ko'rsatkich ishorani saqlaydi.
// ============================================================
const S3 = {
  role: 'sign',
  section: 'practice',
  led: 'student',
  tag: 'neg_exponent',
  eyebrow: L('Masala 2', 'Задача 2', 'Problem 2'),
  title: L("Ishorani qo'ying", 'Поставь знак', 'Place the sign'),
  left: L(
    "Asos MANFIY, daraja toq",
    'Основание МИНУС, степень нечётная',
    'A MINUS base, an odd power',
  ),
  template: ['(−2)⁻³ =  ', { slot: 0 }, ' 1/8'],
  signs: ['+', '−'],
  answer: '−',
  checkNote: L(
    "manfiy ko'rsatkich kasrni teskari qiladi, ishorani esa tegmaydi",
    'отрицательный показатель переворачивает дробь, а знак не трогает',
    'a negative exponent flips the fraction and leaves the sign alone',
  ),
  wrongs: [
    { key: '+', hint: L("Toq darajada manfiy asos manfiy qoladi: minus ikki karra minus ikki karra minus ikki minus sakkiz beradi.", 'В нечётной степени отрицательное основание остаётся отрицательным: минус два на минус два на минус два даёт минус восемь.', 'In an odd power a negative base stays negative: minus two times minus two times minus two gives minus eight.') },
  ],
  probe: {
    question: L(
      "Manfiy ko'rsatkich nima qiladi?",
      'Что делает отрицательный показатель?',
      'What does a negative exponent do?',
    ),
    items: [
      { id: 'a', label: L('kasrni teskari qiladi', 'переворачивает дробь', 'flips the fraction'), correct: true },
      { id: 'b', label: L('ishorani almashtiradi', 'меняет знак', 'flips the sign'), hint: L("Ishorani asos belgilaydi, ko'rsatkich esa faqat kasrni teskari qiladi.", 'Знак определяет основание, а показатель только переворачивает дробь.', 'The base decides the sign, the exponent only flips the fraction.') },
      { id: 'c', label: L('nol beradi', 'даёт ноль', 'gives zero'), hint: L("Daraja nolga aylanmaydi: u faqat kichrayadi.", 'Степень не обращается в ноль: она только уменьшается.', 'A power never becomes zero: it only gets smaller.') },
      { id: 'd', label: L('hech nima', 'ничего', 'nothing'), hint: L("Farq bor: ikki darajada to'rt, minus ikki darajada esa bir chorak.", 'Разница есть: во второй степени четыре, а в минус второй одна четвёртая.', 'There is a difference: to the second power four, to the minus second a quarter.') },
    ],
  },
  audio: [
    A('mount', "Ikkinchi masala. Asos manfiy, ko'rsatkich esa manfiy va toq.", 'Вторая задача. Основание отрицательное, а показатель отрицательный и нечётный.', 'The second problem. The base is negative, and the exponent is negative and odd.'),
    A('write', "Ishorani qo'ying.", 'Поставь знак.', 'Place the sign.'),
  ],
}

// ============================================================
// SLAYD 4. MASALA 3. Chizma: tengsizlik qayerda yashaydi.
// ============================================================
const S4 = {
  role: 'graph',
  section: 'practice',
  tag: 'log_domain',
  drag: false,
  eyebrow: L('Masala 3', 'Задача 3', 'Problem 3'),
  title: L('Tengsizlik qayerda yashaydi', 'Где живёт неравенство', 'Where the inequality lives'),
  chip: 'log₂(x − 1) < 2',
  graph: {
    fn: LOG2M,
    xDomain: [0, 9],
    yDomain: [-3, 3.4],
    asymptote: 1,
    hline: 2,
    cross: 5,
    shade: { from: 1, to: 5 },
    shadeLabel: '(1; 5)',
    xTicks: [{ v: 1 }, { v: 2 }, { v: 5 }],
    yTicks: [{ v: 0 }, { v: 2 }],
    height: 168,
  },
  probe: {
    question: L(
      "Nega yechimlar birdan chapda yo'q?",
      'Почему решений нет левее единицы?',
      'Why are there no solutions left of one?',
    ),
    items: [
      { id: 'a', label: L('u yerda chiziq mavjud emas', 'там кривой не существует', 'the curve does not exist there'), correct: true },
      { id: 'b', label: L('u yerda chiziq juda past', 'там кривая слишком низко', 'the curve is too low there'), hint: L("Pastda bo'lish yechim bo'lishga xalaqit bermaydi: aksincha, tengsizlik shuni talab qiladi. Chiziq u yerda umuman yo'q.", 'Быть низко не мешает быть решением: наоборот, неравенство этого и требует. Кривой там вообще нет.', 'Being low does not prevent a solution: the inequality asks for it. The curve is simply not there.') },
      { id: 'c', label: L('u yerda asos manfiy', 'там основание отрицательно', 'the base is negative there'), hint: L("Asos ikki va o'zgarmaydi. Chegara argumentdan keladi.", 'Основание два и не меняется. Граница идёт от аргумента.', 'The base is two and does not change. The boundary comes from the argument.') },
      { id: 'd', label: L('u yerda beshdan katta', 'там больше пяти', 'it is more than five there'), hint: L("Besh o'ng chegara, savol esa chap chegara haqida.", 'Пять это правая граница, а вопрос о левой.', 'Five is the right boundary, the question is about the left one.') },
    ],
  },
  holds: [4500, 5000],
  audio: [
    A('mount', "Uchinchi masala chizmada. Egri chiziq faqat birdan o'ngda mavjud, chunki logarifm argumenti musbat bo'lishi kerak.", 'Третья задача на чертеже. Кривая существует только правее единицы, потому что аргумент логарифма обязан быть положительным.', 'The third problem is on a drawing. The curve exists only right of one, because the argument of a logarithm must be positive.'),
    A('mount', "Ikki chegara bor: chapda argument sharti, o'ngda esa tengsizlikning o'zi. Javob ularning kesishmasi.", 'Есть две границы: слева условие на аргумент, справа само неравенство. Ответ это их пересечение.', 'There are two boundaries: on the left the condition on the argument, on the right the inequality itself. The answer is their intersection.'),
  ],
}

// Zanjir amallari: ikki masalaning amallari BIR ro'yxatda.
const ACTIONS_46 = [
  { id: 'base', label: L('bir asosga keltirish', 'привести к одному основанию', 'reduce to one base') },
  { id: 'exp', label: L("ko'rsatkichlarni tenglashtirish", 'приравнять показатели', 'equate the exponents') },
  { id: 'subst', label: L('almashtirish kiritish', 'ввести замену', 'introduce a substitution') },
  { id: 'solve', label: L('kvadrat tenglamani yechish', 'решить квадратное', 'solve the quadratic') },
  { id: 'back', label: L('iksga qaytish', 'вернуться к иксу', 'go back to x') },
]

// ============================================================
// SLAYD 5. MASALA 4. Zanjir: bir asos.
// ============================================================
const S5 = {
  role: 'chain',
  section: 'practice',
  led: 'student',
  tag: 'same_base',
  noLine: true,
  eyebrow: L('Masala 4', 'Задача 4', 'Problem 4'),
  title: L('Bir asosga', 'К одному основанию', 'To one base'),
  start: '4ˣ = 8',
  actions: ACTIONS_46,
  steps: [
    {
      action: 'base',
      to: '2²ˣ = 2³',
      wrongs: [
        { action: 'exp', hint: L("Ko'rsatkichlarni tenglashtirish uchun asoslar bir xil bo'lishi kerak.", 'Чтобы приравнять показатели, основания должны совпасть.', 'To equate exponents the bases must match.') },
        { action: 'subst', hint: L("Almashtirish kvadrat tenglamada kerak bo'ladi.", 'Замена понадобится в квадратном уравнении.', 'A substitution will be needed in the quadratic.') },
        { action: 'solve', hint: L("Hozircha kvadrat tenglama yo'q.", 'Квадратного уравнения пока нет.', 'There is no quadratic yet.') },
      ],
    },
    {
      action: 'exp',
      to: '2x = 3',
      wrongs: [
        { action: 'base', hint: L("Asoslar allaqachon bir xil: ikkitasi ham ikki.", 'Основания уже одинаковы: оба два.', 'The bases already match: both are two.') },
        { action: 'back', hint: L("Qaytish uchun almashtirish kiritilishi kerak edi.", 'Чтобы возвращаться, нужна была замена.', 'To go back a substitution was needed.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['1,5', '2', '3', '0,5'],
    value: ['1,5'],
    label: 'x =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '2', hint: L("Ikki bu asos, javob emas.", 'Два это основание, а не ответ.', 'Two is the base, not the answer.') },
      { key: '3', hint: L("Uch bu o'ngdagi ko'rsatkich. Chapda esa ikki iks turadi.", 'Три это показатель справа. А слева стоит два икс.', 'Three is the exponent on the right. On the left there is two x.') },
      { key: '0,5', hint: L("Teskari bo'lingan: uchni ikkiga bo'lish kerak.", 'Поделено наоборот: нужно три делить на два.', 'Divided the wrong way: three must be divided by two.') },
      { key: '*', hint: L("Ikki iks uchga teng, demak iks bir butun besh.", 'Два икс равно трём, значит икс один и пять десятых.', 'Two x equals three, so x is one point five.') },
    ],
  },
  audio: [
    A('mount', "To'rtinchi masala. Ro'yxatda boshqa masalaning amallari ham bor.", 'Четвёртая задача. В списке есть действия и другой задачи.', 'The fourth problem. The list also holds actions of another problem.'),
    A('step3', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 6. MASALA 5. Ikki yo'l: ildiz tushib qoldi.
// ============================================================
const S6 = {
  role: 'twoway',
  section: 'practice',
  tag: 'equal_roots',
  eyebrow: L('Masala 5', 'Задача 5', 'Problem 5'),
  title: L('Nechta ildiz bor', 'Сколько корней', 'How many roots'),
  expr: 'log₂(x²) = 4',
  need: L('hamma ildizlar', 'все корни', 'all the roots'),
  answerLabel: L("to'g'ri javob", 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      txt: L('bitta ildiz yozdi', 'взял один корень', 'took one root'),
      point: {
        label: L('uning javobi', 'его ответ', 'his answer'),
        calc: '4',
        verdict: 'out',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L('ikkalasini tekshirdi', 'проверила оба знака', 'checked both'),
      point: {
        label: L('uning javobi', 'её ответ', 'her answer'),
        calc: '±4',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['±4', '4', '−4', '2'],
    value: ['±4'],
    label: 'x =',
    prompt: L('Hamma ildizlarni yozing', 'Запиши все корни', 'Write all the roots'),
    wrongs: [
      { key: '4', hint: L("Minus to'rt ham to'g'ri keladi: kvadratga ko'tarilganda o'n olti chiqadi va logarifm to'rt beradi.", 'Минус четыре тоже подходит: в квадрате шестнадцать, и логарифм даёт четыре.', 'Minus four fits too: squared it is sixteen, and the logarithm gives four.') },
      { key: '−4', hint: L("To'rt ham to'g'ri keladi: ikkalasi ham ildiz.", 'Четыре тоже подходит: оба являются корнями.', 'Four fits as well: both are roots.') },
      { key: '2', hint: L("Ikkiga o'n olti emas, to'rt to'g'ri keladi. Kvadrat o'n olti bo'lishi kerak.", 'Двойке отвечает четыре, а не шестнадцать. Квадрат должен быть шестнадцать.', 'Two gives four, not sixteen. The square must be sixteen.') },
      { key: '*', hint: L("Kvadrat o'n oltiga teng, va ikki ishora ham ODZ ga kiradi.", 'Квадрат равен шестнадцати, и оба знака входят в область.', 'The square equals sixteen, and both signs are in the domain.') },
    ],
  },
  holds: [4200, 4500, 5500],
  audio: [
    A('mount', "Beshinchi masala. Ikki o'quvchi bir tenglamani ikki xil yechdi.", 'Пятая задача. Два ученика решили одно уравнение по-разному.', 'The fifth problem. Two students solved one equation differently.'),
    A('p1', "Aziz kvadratdan ildiz oldi va faqat musbat ishorani yozdi.", 'Азиз извлёк корень из квадрата и записал только положительный знак.', 'Aziz took the root of the square and wrote only the positive sign.'),
    A('p2', "Dilnoza esa ikki ishorani ham tekshirdi. Ikkisi ham argumentni musbat qoldiradi, demak ikkisi ham ildiz.", 'А Дилноза проверила оба знака. Оба оставляют аргумент положительным, значит оба являются корнями.', 'Dilnoza checked both signs. Both keep the argument positive, so both are roots.'),
    A('write', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 7. MASALA 6. Daraja nolga aylanadimi.
// ============================================================
const S7 = {
  role: 'points',
  section: 'practice',
  led: 'student',
  tag: 'positive_power',
  eyebrow: L('Masala 6', 'Задача 6', 'Problem 6'),
  title: L('Daraja nolga aylanadimi', 'Обращается ли степень в ноль', 'Can a power become zero'),
  expr: '3ˣ',
  goal: L("nol bo'ladigan joyni izlash", 'искать место, где выходит ноль', 'look for a place where zero appears'),
  rule: L(
    "Har bir ko'rsatkichda darajani hisoblaymiz.",
    'При каждом показателе считаем степень.',
    'At each exponent we compute the power.',
  ),
  pick: L("Qaysi ko'rsatkichni tekshiramiz?", 'Какой показатель проверим?', 'Which exponent shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L("nol bo'lishi mumkin", 'ноль возможен', 'zero is possible'), value: '0' },
    { id: 'b', key: 'inB', name: L('doim musbat', 'всегда плюс', 'always positive'), value: '> 0' },
  ],
  points: [
    {
      id: 'q1', label: 'x = −2', num: '1/9', step: 'calc', verdict: 'in',
      calc: L('kichik, lekin musbat', 'маленькое, но положительное', 'small but positive'),
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q2', label: 'x = 0', num: '1', step: 'calc', verdict: 'in',
      calc: L('nol daraja bir beradi', 'нулевая степень даёт один', 'the zero power gives one'),
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q3', label: 'x = 2', num: '9', step: 'calc', verdict: 'in',
      calc: L('musbat va katta', 'положительное и большое', 'positive and large'),
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q4', label: 'x = −10', num: '1/59049', step: 'calc', verdict: 'in',
      calc: L('juda kichik, lekin nol emas', 'очень маленькое, но не ноль', 'very small but not zero'),
      sol: true, inA: false, inB: true,
    },
  ],
  probe: {
    question: L(
      "3ˣ nol bo'lishi mumkinmi?",
      'Может ли 3ˣ быть нулём?',
      'Can 3ˣ be zero?',
    ),
    items: [
      { id: 'b', label: L("yo'q, hech qachon", 'нет, никогда', 'no, never'), correct: true },
      { id: 'a', label: L('ha, manfiy x da', 'да, при отрицательном x', 'yes, for negative x'), hint: L("Manfiy x kasr beradi, va kasr nolga yaqin bo'lsa ham nol emas.", 'Отрицательный x даёт дробь, а дробь близка к нулю, но не ноль.', 'A negative x gives a fraction, and a fraction is close to zero but not zero.') },
      { id: 'c', label: L("ha, x nol bo'lganda", 'да, при x равном нулю', 'yes, when x is zero'), hint: L("Nol darajada bir chiqadi, nol emas.", 'В нулевой степени выходит один, а не ноль.', 'The zero power gives one, not zero.') },
      { id: 'd', label: L("faqat asos nol bo'lsa", 'только если основание ноль', 'only if the base is zero'), hint: L("Asos uch va o'zgarmaydi, savol esa ko'rsatkich haqida.", 'Основание три и не меняется, а вопрос о показателе.', 'The base is three and does not change, the question is about the exponent.') },
    ],
  },
  holds: [3000, 2400, 2600, 8000],
  audio: [
    A('mount', "Oltinchi masala. Bu safar nol izlaymiz.", 'Шестая задача. На этот раз ищем ноль.', 'The sixth problem. This time we hunt for a zero.'),
    A('mount', "Ko'rsatkichni o'zingiz tanlaysiz.", 'Показатель выбираешь сам.', 'You choose the exponent yourself.'),
    A('calc', 'Hisoblaymiz.', 'Считаем.', 'We compute.'),
    A('mark', "To'rtta qiymat ham musbat chiqdi. Manfiy ko'rsatkichda daraja kasrga aylanadi va nolga yaqinlashadi, lekin unga tegmaydi. Shu sababli ko'rsatkichli funksiya hech qachon nol bo'lmaydi, va tenglamada uni nolga tenglashtirish mumkin emas.", 'Все четыре значения вышли положительными. При отрицательном показателе степень становится дробью и приближается к нулю, но не касается его. Поэтому показательная функция никогда не равна нулю, и приравнивать её к нулю нельзя.', 'All four values came out positive. For a negative exponent the power becomes a fraction and approaches zero without touching it. So an exponential is never zero, and it cannot be set equal to zero.'),
  ],
}

// ============================================================
// SLAYD 8. MASALA 7. Mustaqil: almashtirish.
// ============================================================
const S8 = {
  role: 'chain',
  section: 'practice',
  led: 'student',
  tag: 'substitution',
  noLine: true,
  solo: true,
  eyebrow: L('Masala 7', 'Задача 7', 'Problem 7'),
  title: L('Imtihondagidek', 'Как на экзамене', 'As on the exam'),
  start: '9ˣ − 4 · 3ˣ + 3 = 0',
  actions: ACTIONS_46,
  hint: L(
    "To'qqiz darajasi uch darajasining kvadrati.",
    'Девять в степени это квадрат трёх в степени.',
    'Nine to the power is the square of three to the power.',
  ),
  steps: [
    {
      action: 'subst',
      to: 't² − 4t + 3 = 0',
      wrongs: [
        { action: 'base', hint: L("Asoslar allaqachon bog'liq: to'qqiz uchning kvadrati. Yangi harf kerak.", 'Основания уже связаны: девять это квадрат трёх. Нужна новая буква.', 'The bases are already linked: nine is three squared. A new letter is needed.') },
        { action: 'exp', hint: L("Ko'rsatkichlarni tenglashtirish uchun ikki tomonda bitta daraja bo'lishi kerak.", 'Чтобы приравнять показатели, с двух сторон должна быть одна степень.', 'To equate exponents there must be a single power on each side.') },
        { action: 'back', hint: L("Qaytish uchun avval almashtirish kiritilishi kerak.", 'Чтобы вернуться, сначала нужна замена.', 'To go back, a substitution must come first.') },
      ],
    },
    {
      action: 'solve',
      to: 't = 1;  t = 3',
      wrongs: [
        { action: 'subst', hint: L("Almashtirish kiritildi: t bu uch daraja iks.", 'Замена введена: t это три в степени икс.', 'The substitution is in: t is three to the x.') },
        { action: 'back', hint: L("Qaytishdan oldin t topilishi kerak.", 'Прежде чем возвращаться, надо найти t.', 'Before going back, t must be found.') },
      ],
    },
    {
      action: 'back',
      to: 'x = 0;  x = 1',
      wrongs: [
        { action: 'solve', hint: L("Kvadrat tenglama yechildi: bir va uch.", 'Квадратное решено: один и три.', 'The quadratic is solved: one and three.') },
        { action: 'base', hint: L("Asoslar bilan ish tugadi, endi iksga qaytish kerak.", 'С основаниями закончили, теперь надо вернуться к иксу.', 'The bases are done, now go back to x.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['0;  1', '1;  3', '0', '1'],
    value: ['0;  1'],
    label: 'x =',
    prompt: L('Hamma ildizlarni yozing', 'Запиши все корни', 'Write all the roots'),
    wrongs: [
      { key: '1;  3', hint: L("Bu t ning qiymatlari. Iks uchun uch daraja iks bir va uchga teng bo'lishi kerak.", 'Это значения t. Для икса нужно, чтобы три в степени икс равнялось одному и трём.', 'Those are the values of t. For x we need three to the x to equal one and three.') },
      { key: '0', hint: L("Bitta ildiz tushib qolgan: t uchga teng bo'lganda iks bir chiqadi.", 'Потерян один корень: когда t равно трём, икс равен единице.', 'One root is lost: when t is three, x is one.') },
      { key: '1', hint: L("Bitta ildiz tushib qolgan: t birga teng bo'lganda iks nol chiqadi.", 'Потерян один корень: когда t равно единице, икс равен нулю.', 'One root is lost: when t is one, x is zero.') },
      { key: '*', hint: L("Uch daraja iks birga teng bo'lsa iks nol, uchga teng bo'lsa iks bir.", 'Если три в степени икс равно одному, икс ноль; если трём, икс один.', 'If three to the x is one, x is zero; if three, x is one.') },
    ],
  },
  audio: [
    A('mount', "Yettinchi masala mustaqil, imtihondagidek. Yordam yo'q.", 'Седьмая задача самостоятельная, как на экзамене. Подсказок нет.', 'The seventh problem is on your own, as on the exam. No hints.'),
    A('step4', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 9. MASALA 8. Asos birdan kichik.
// ============================================================
const S9 = {
  role: 'sign',
  section: 'practice',
  led: 'student',
  tag: 'base_direction',
  eyebrow: L('Masala 8', 'Задача 8', 'Problem 8'),
  title: L("Ishorani qo'ying", 'Поставь знак', 'Place the sign'),
  left: L(
    'Asos birdan KICHIK',
    'Основание МЕНЬШЕ единицы',
    'The base is LESS than one',
  ),
  template: ['log₀,₅ 8 =  ', { slot: 0 }, ' 3'],
  signs: ['+', '−'],
  answer: '−',
  checkNote: L(
    'yarimni uch marta olsak sakkiz emas, sakkizdan bir chiqadi',
    'если взять половину трижды, выйдет одна восьмая, а не восемь',
    'taking a half three times gives one eighth, not eight',
  ),
  wrongs: [
    { key: '+', hint: L("Musbat uch bo'lsa, yarim darajasi uch sakkizga teng bo'lardi. Aslida u sakkizdan bir.", 'Если бы было плюс три, половина в третьей равнялась бы восьми. На самом деле это одна восьмая.', 'If it were plus three, a half cubed would be eight. In fact it is one eighth.') },
  ],
  probe: {
    question: L(
      "Asos birdan kichik bo'lsa nima o'zgaradi?",
      'Что меняется, если основание меньше единицы?',
      'What changes when the base is less than one?',
    ),
    items: [
      { id: 'a', label: L("yo'nalish teskari bo'ladi", 'направление обратное', 'the direction reverses'), correct: true },
      { id: 'b', label: L('hech nima', 'ничего', 'nothing'), hint: L("Farq bor: bunday logarifm katta sonda MANFIY qiymat beradi.", 'Разница есть: такой логарифм на большом числе даёт ОТРИЦАТЕЛЬНОЕ значение.', 'There is a difference: such a logarithm gives a NEGATIVE value on a large number.') },
      { id: 'c', label: L('logarifm mavjud emas', 'логарифм не существует', 'the logarithm does not exist'), hint: L("Mavjud: asos musbat va birga teng bo'lmasa yetadi.", 'Существует: достаточно, чтобы основание было положительным и не равным единице.', 'It exists: the base need only be positive and not one.') },
      { id: 'd', label: L("argument manfiy bo'ladi", 'аргумент становится отрицательным', 'the argument becomes negative'), hint: L("Argument har doim musbat qoladi, o'zgargan narsa esa natijaning ishorasi.", 'Аргумент всегда остаётся положительным, а меняется знак результата.', 'The argument always stays positive, what changes is the sign of the result.') },
    ],
  },
  audio: [
    A('mount', "Sakkizinchi masala. Asos birdan kichik, va bu hammasini o'zgartiradi.", 'Восьмая задача. Основание меньше единицы, и это всё меняет.', 'The eighth problem. The base is less than one, and that changes everything.'),
    A('write', "Ishorani qo'ying.", 'Поставь знак.', 'Place the sign.'),
  ],
}

// ============================================================
// SLAYD 10. MASALA 9. Teskari masala: ildizni soddalashtirish.
// ============================================================
const S10 = {
  role: 'build',
  section: 'practice',
  led: 'student',
  tag: 'root_modulus',
  right: '2/2',
  eyebrow: L('Masala 9', 'Задача 9', 'Problem 9'),
  title: L("Yozuvni yig'ing", 'Собери запись', 'Build the record'),
  targetLabel: L('Shart', 'Условие', 'The condition'),
  targetValue: 'x < 0',
  tasks: [
    {
      prompt: L('√(49x²) ni soddalashtiring', 'Упрости √(49x²)', 'Simplify √(49x²)'),
      template: ['√(49x²) = ', { slot: 0 }],
      parts: ['−7x', '7x', '49x', 'x'],
      answer: ['−7x'],
      doneLabel: '−7x',
      wrongs: [
        { key: '7x', hint: L("x manfiy, demak yetti iks ham manfiy. Ildiz esa manfiy bo'lmaydi.", 'x отрицателен, значит семь икс тоже отрицательно. А корень отрицательным не бывает.', 'x is negative, so seven x is negative too. And a root is never negative.') },
        { key: '49x', hint: L("Kvadrat ildiz bilan qisqaradi: qirq to'qqizdan yetti chiqadi.", 'Квадрат сокращается с корнем: из сорока девяти выходит семь.', 'The square cancels with the root: forty nine gives seven.') },
        { key: '*', hint: L("Modul chiqadi, va manfiy x da modul minus iksga teng.", 'Выходит модуль, а при отрицательном x модуль равен минус икс.', 'The modulus comes out, and for negative x the modulus is minus x.') },
      ],
    },
    {
      prompt: L('1/9 ni 3 asosida yozing', 'Запиши 1/9 по основанию 3', 'Write 1/9 with base 3'),
      template: ['1/9 = 3', { slot: 0 }],
      parts: ['⁻²', '²', '⁻¹', '⁻³'],
      answer: ['⁻²'],
      doneLabel: '3⁻²',
      wrongs: [
        { key: '²', hint: L("Musbat ko'rsatkich to'qqizni beradi, kasrni esa manfiy ko'rsatkich beradi.", 'Положительный показатель даёт девять, а дробь даёт отрицательный.', 'A positive exponent gives nine, the fraction needs a negative one.') },
        { key: '⁻³', hint: L("Minus uch yigirma yettidan birni beradi.", 'Минус три даёт одну двадцать седьмую.', 'Minus three gives one twenty seventh.') },
        { key: '*', hint: L("To'qqiz uchning kvadrati, kasr esa minus ikkinchi daraja.", 'Девять это три в квадрате, а дробь это минус вторая степень.', 'Nine is three squared, and the fraction is the minus second power.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'qqizinchi masala teskari: yozuvni o'zingiz yig'asiz. Shartga qarang: iks manfiy.", 'Девятая задача обратная: запись собираешь сам. Смотри условие: икс отрицателен.', 'The ninth problem is reverse: you build the record. Look at the condition: x is negative.'),
    A('built1', "Endi ikkinchisi.", 'Теперь второе.', 'Now the second.'),
  ],
}

// ============================================================
// SLAYD 11. MASALA 10. ODZ ikki shartning kesishmasi.
// ============================================================
const S11 = {
  role: 'twoway',
  section: 'practice',
  tag: 'intersection',
  eyebrow: L('Masala 10', 'Задача 10', 'Problem 10'),
  title: L('ODZ qayerda', 'Где область', 'Where the domain is'),
  expr: 'log(x − 1) + log(3 − x)',
  need: L('ikki shart birga', 'два условия вместе', 'both conditions together'),
  answerLabel: L("to'g'ri javob", 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      txt: L('birinchi shartni oldi', 'взял первое условие', 'took the first'),
      point: {
        label: L('uning javobi', 'его ответ', 'his answer'),
        calc: '(1; +∞)',
        verdict: 'out',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L('kesishmani oldi', 'взяла пересечение', 'took both'),
      point: {
        label: L('uning javobi', 'её ответ', 'her answer'),
        calc: '(1; 3)',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['(1; 3)', '(1; +∞)', '(3; +∞)', '(−∞; 3)'],
    value: ['(1; 3)'],
    label: L('ODZ:', 'область:', 'domain:'),
    prompt: L('ODZ ni yozing', 'Запиши область', 'Write the domain'),
    wrongs: [
      { key: '(1; +∞)', hint: L("Ikkinchi logarifm uch minus iksni talab qiladi, va u faqat uchdan chapda musbat.", 'Второй логарифм требует три минус икс, а это положительно только левее трёх.', 'The second logarithm needs three minus x, positive only left of three.') },
      { key: '(3; +∞)', hint: L("Uchdan o'ngda ikkinchi argument manfiy bo'lib qoladi.", 'Правее трёх второй аргумент становится отрицательным.', 'Right of three the second argument becomes negative.') },
      { key: '(−∞; 3)', hint: L("Birinchi logarifm iks minus birni talab qiladi: birdan chapda u manfiy.", 'Первый логарифм требует икс минус один: левее единицы он отрицателен.', 'The first logarithm needs x minus one: left of one it is negative.') },
      { key: '*', hint: L("Ikki shart birga ishlaydi: iks birdan katta VA uchdan kichik.", 'Два условия работают вместе: икс больше одного И меньше трёх.', 'Both conditions work together: x greater than one AND less than three.') },
    ],
  },
  holds: [4200, 4500, 5500],
  audio: [
    A('mount', "O'ninchi masala. Ikkita logarifm bor, demak ikkita shart bor.", 'Десятая задача. Два логарифма, значит два условия.', 'The tenth problem. Two logarithms, so two conditions.'),
    A('p1', "Aziz birinchi shartni yozdi va shu bilan to'xtadi.", 'Азиз записал первое условие и на этом остановился.', 'Aziz wrote the first condition and stopped there.'),
    A('p2', "Dilnoza esa ikkisini birga qo'ydi. Har bir logarifm o'z argumentini musbat talab qiladi, va javob ikki shartning kesishmasi bo'ladi.", 'А Дилноза поставила их вместе. Каждый логарифм требует свой аргумент положительным, и ответ это пересечение двух условий.', 'Dilnoza put them together. Each logarithm needs its own argument positive, and the answer is the intersection of both conditions.'),
    A('write', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
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
      id: 'b1', tag: 'root_modulus', ask: true, cols: 2,
      done: '7',
      prompt: '√((−7)²)',
      items: [
        { id: 'a', label: '7', correct: true },
        { id: 'b', label: '−7', hint: L("Ildiz manfiy son bermaydi.", 'Корень не даёт отрицательного числа.', 'A root never gives a negative number.') },
        { id: 'c', label: '±7', hint: L("Ildiz BITTA son beradi.", 'Корень даёт ОДНО число.', 'A root gives ONE number.') },
        { id: 'd', label: '49', hint: L("Kvadrat ildiz bilan qisqaradi.", 'Квадрат сокращается с корнем.', 'The square cancels with the root.') },
      ],
    },
    {
      id: 'b2', tag: 'neg_exponent', ask: true, cols: 2,
      done: '1/25',
      prompt: '5⁻²',
      items: [
        { id: 'a', label: '1/25', correct: true },
        { id: 'b', label: '−25', hint: L("Manfiy ko'rsatkich ishorani almashtirmaydi, kasrni teskari qiladi.", 'Отрицательный показатель не меняет знак, он переворачивает дробь.', 'A negative exponent does not flip the sign, it flips the fraction.') },
        { id: 'c', label: '25', hint: L("Manfiy ko'rsatkich e'tibordan qolgan.", 'Отрицательный показатель не учтён.', 'The negative exponent is ignored.') },
        { id: 'd', label: '−1/25', hint: L("Asos musbat, demak natija ham musbat.", 'Основание положительно, значит и результат положителен.', 'The base is positive, so the result is positive.') },
      ],
    },
    {
      id: 'b3', tag: 'same_base', ask: true, cols: 2,
      done: '1/3',
      prompt: '27ˣ = 3',
      items: [
        { id: 'a', label: '1/3', correct: true },
        { id: 'b', label: '3', hint: L("Uch daraja uch yigirma yetti beradi, teskari kerak.", 'Три в третьей даёт двадцать семь, а нужно наоборот.', 'Three cubed gives twenty seven, we need the reverse.') },
        { id: 'c', label: '9', hint: L("To'qqiz juda katta: yigirma yetti darajasi to'qqiz juda katta son beradi.", 'Девять слишком много: двадцать семь в девятой даёт огромное число.', 'Nine is far too large: twenty seven to the ninth is enormous.') },
        { id: 'd', label: '−1/3', hint: L("Manfiy ko'rsatkich kasr berardi, o'ngda esa uch turadi.", 'Отрицательный показатель дал бы дробь, а справа стоит три.', 'A negative exponent would give a fraction, and the right side is three.') },
      ],
    },
    {
      id: 'b4', tag: 'log_domain', ask: true, cols: 2,
      done: 'x > −4',
      prompt: L('log₃(x + 4) ODZ si?', 'Область log₃(x + 4)?', 'The domain of log₃(x + 4)?'),
      items: [
        { id: 'a', label: 'x > −4', correct: true },
        { id: 'b', label: 'x > 4', hint: L("Ishora almashgan: qavs ichida plyus to'rt turadi.", 'Знак перепутан: в скобке стоит плюс четыре.', 'The sign is confused: the bracket has plus four.') },
        { id: 'c', label: 'x ≠ −4', hint: L("Nolga teng bo'lmaslik yetmaydi: argument MUSBAT bo'lishi kerak.", 'Не равно нулю недостаточно: аргумент должен быть ПОЛОЖИТЕЛЬНЫМ.', 'Not equal to zero is not enough: the argument must be POSITIVE.') },
        { id: 'd', label: L('hamma x', 'все x', 'all x'), hint: L("Chap tomonda argument manfiy bo'lib qoladi.", 'Слева аргумент становится отрицательным.', 'On the left the argument becomes negative.') },
      ],
    },
    {
      id: 'b5', tag: 'positive_power', ask: true, cols: 2,
      done: L("yo'q", 'нет', 'no'),
      prompt: L("0,2ˣ manfiy bo'lishi mumkinmi?", 'Может ли 0,2ˣ быть отрицательным?', 'Can 0,2ˣ be negative?'),
      items: [
        { id: 'a', label: L("yo'q", 'нет', 'no'), correct: true },
        { id: 'b', label: L('ha, manfiy x da', 'да, при отрицательном x', 'yes, for negative x'), hint: L("Manfiy ko'rsatkich sonni KATTA qiladi, lekin musbat qoldiradi.", 'Отрицательный показатель делает число БОЛЬШИМ, но оставляет положительным.', 'A negative exponent makes the number LARGER, but keeps it positive.') },
        { id: 'c', label: L('ha, katta x da', 'да, при большом x', 'yes, for large x'), hint: L("Katta ko'rsatkichda daraja nolga yaqinlashadi, lekin musbat qoladi.", 'При большом показателе степень приближается к нулю, но остаётся положительной.', 'For a large exponent the power approaches zero but stays positive.') },
        { id: 'd', label: L("asos manfiy bo'lsa", 'если основание отрицательно', 'if the base is negative'), hint: L("Asos nol butun ikki, va u musbat.", 'Основание ноль целых две десятых, и оно положительно.', 'The base is zero point two, and it is positive.') },
      ],
    },
    {
      id: 'b6', tag: 'base_direction', ask: true, cols: 2,
      done: '−2',
      prompt: 'log₀,₂ 25',
      items: [
        { id: 'a', label: '−2', correct: true },
        { id: 'b', label: '2', hint: L("Nol butun ikki kvadratda nol butun nol to'rt beradi, yigirma besh emas.", 'Ноль целых две десятых в квадрате даёт ноль целых ноль четыре, а не двадцать пять.', 'Zero point two squared gives zero point zero four, not twenty five.') },
        { id: 'c', label: '−5', hint: L("Beshinchi daraja emas: yigirma besh beshning kvadrati.", 'Не пятая степень: двадцать пять это квадрат пяти.', 'Not the fifth power: twenty five is five squared.') },
        { id: 'd', label: '5', hint: L("Ikkita xato birga: daraja ham, ishora ham.", 'Две ошибки сразу: и степень, и знак.', 'Two errors at once: the power and the sign.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits. Oltita savol, va faqat shu ekran natijaga kiradi.", 'Блиц. Шесть вопросов, и только этот экран идёт в результат.', 'Quick round. Six questions, and only this screen counts.'),
  ],
}

// ============================================================
// SLAYD 13. XATONI TOPING. Bitta ildiz tushib qolgan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'root_modulus',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Bir satr xato', 'Одна строка неверна', 'One line is wrong'),
  rows: [
    { id: 'r1', text: '√(x²) = 6' },
    { id: 'r2', text: '|x| = 6' },
    { id: 'r3', text: 'x = 6' },
    { id: 'r4', text: L('tekshiruv: √(6²) = 6', 'проверка: √(6²) = 6', 'check: √(6²) = 6') },
    { id: 'r5', text: L('javob: x = 6', 'ответ: x = 6', 'answer: x = 6') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Modulga o'tish to'g'ri: ildiz ostidan modul chiqadi.", 'Переход к модулю верен: из-под корня выходит модуль.', 'The step to the modulus is right: the modulus comes out of the root.'),
    r4: L("Tekshiruv rost: oltining kvadrat ildizi haqiqatan olti. Lekin u BITTA ildizni tekshiradi.", 'Проверка верна: корень из шести в квадрате действительно шесть. Но она проверяет ОДИН корень.', 'The check is true: the root of six squared is six. But it checks ONE root.'),
    r5: L("Oxirgi satr faqat ko'chirma, xato undan oldin.", 'Последняя строка только перепись, ошибка выше.', 'The last line is just a copy, the error is above.'),
  },
  proofPoint: L('modul ikki javob beradi', 'модуль даёт два ответа', 'the modulus gives two answers'),
  proof: L(
    "Modul oltiga teng bo'lsa, iks olti YOKI minus olti bo'ladi. Uchinchi satrda ikkinchisi tushib qolgan. Tekshiruv esa xatoni yashirdi, chunki u faqat topilgan javobni sinadi.",
    'Если модуль равен шести, то икс шесть ИЛИ минус шесть. В третьей строке второй корень потерян. А проверка скрыла ошибку, потому что она испытывает только найденный ответ.',
    'If the modulus is six, then x is six OR minus six. The third line lost the second root. And the check hid the error, because it only tests the answer already found.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('ikkinchi ildiz tushib qolgan', 'потерян второй корень', 'the second root is lost'), correct: true },
      { id: 'b', label: L('modul xato ochilgan', 'модуль раскрыт неверно', 'the modulus is opened wrong'), hint: L("Modulga o'tish to'g'ri, undan keyingi qadam esa yarim.", 'Переход к модулю верен, а следующий шаг сделан наполовину.', 'The step to the modulus is right, the next step is only half done.') },
      { id: 'c', label: L('tekshiruv xato', 'проверка неверна', 'the check is wrong'), hint: L("Tekshiruv rost hisoblangan, lekin u ikkinchi ildizni ko'rmadi.", 'Проверка посчитана верно, но второго корня она не увидела.', 'The check is computed right, but it never saw the second root.') },
      { id: 'd', label: L("javob to'g'ri", 'ответ верный', 'the answer is right'), hint: L("Javob yarim: minus olti ham ildiz.", 'Ответ половинчатый: минус шесть тоже корень.', 'The answer is half: minus six is a root too.') },
    ],
  },
  audio: [
    A('mount', "Masalalar tugadi. Endi boshqaning yechimiga qaraymiz.", 'Задачи закончились. Теперь посмотрим на чужое решение.', 'The problems are done. Now let us look at someone else solution.'),
    A('q1', "Diqqat: bu yechimda tekshiruv ham bor, va u to'g'ri hisoblangan. Xato baribir bor.", 'Внимание: в этом решении есть и проверка, и она посчитана верно. Ошибка всё равно есть.', 'Careful: this solution even has a check, and it is computed right. The error is there anyway.'),
    A('proof', "Qarang: modul oltiga teng bo'lsa, iks olti yoki minus olti. Uchinchi satrda faqat bittasi yozilgan. Tekshiruv esa yordam bermadi, chunki u faqat yozilgan javobni sinaydi, tushib qolgan ildizni esa izlamaydi. Shu sababli tekshiruv har doim ikki tomondan bo'lishi kerak: javob to'g'rimi, va hamma javob topildimi.", 'Смотри: если модуль равен шести, то икс шесть или минус шесть. В третьей строке записан только один. А проверка не помогла, потому что она испытывает только записанный ответ и не ищет потерянный корень. Поэтому проверка всегда должна быть с двух сторон: верен ли ответ и найдены ли все ответы.', 'Look: if the modulus is six, then x is six or minus six. The third line writes only one. The check did not help, because it only tests the written answer and never hunts for a lost root. So a check must always cut both ways: is the answer right, and are all the answers found.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'same_base',
  right: '2/2',
  eyebrow: L('Teskari masala', 'Обратная задача', 'The reverse task'),
  title: L('Bir asosga keltiring', 'Приведи к одному основанию', 'Reduce to one base'),
  targetLabel: L('Asos', 'Основание', 'The base'),
  targetValue: '2',
  tasks: [
    {
      prompt: L('8 ni 2 asosida yozing', 'Запиши 8 по основанию 2', 'Write 8 with base 2'),
      template: ['8 = 2', { slot: 0 }],
      parts: ['³', '²', '⁴', '⁻³'],
      answer: ['³'],
      doneLabel: '2³',
      wrongs: [
        { key: '²', hint: L("Ikkining kvadrati to'rt.", 'Два в квадрате четыре.', 'Two squared is four.') },
        { key: '⁴', hint: L("Ikkining to'rtinchi darajasi o'n olti.", 'Два в четвёртой шестнадцать.', 'Two to the fourth is sixteen.') },
        { key: '*', hint: L("Ikkini uch marta ko'paytirsak sakkiz chiqadi.", 'Если умножить два трижды, выйдет восемь.', 'Multiplying two three times gives eight.') },
      ],
    },
    {
      prompt: L('1/16 ni 2 asosida yozing', 'Запиши 1/16 по основанию 2', 'Write 1/16 with base 2'),
      template: ['1/16 = 2', { slot: 0 }],
      parts: ['⁻⁴', '⁴', '⁻²', '⁻¹'],
      answer: ['⁻⁴'],
      doneLabel: '2⁻⁴',
      wrongs: [
        { key: '⁴', hint: L("Musbat ko'rsatkich o'n oltini beradi, kasr uchun manfiy kerak.", 'Положительный показатель даёт шестнадцать, для дроби нужен отрицательный.', 'A positive exponent gives sixteen, the fraction needs a negative one.') },
        { key: '⁻²', hint: L("Minus ikki to'rtdan birni beradi.", 'Минус два даёт одну четвёртую.', 'Minus two gives one quarter.') },
        { key: '*', hint: L("O'n olti ikkining to'rtinchi darajasi, kasr esa manfiy ko'rsatkich.", 'Шестнадцать это два в четвёртой, а дробь это отрицательный показатель.', 'Sixteen is two to the fourth, and the fraction means a negative exponent.') },
      ],
    },
  ],
  audio: [
    A('mount', "Xato topildi. Oxirgi topshiriq: sonni bitta asosga keltirish.", 'Ошибка найдена. Последнее задание: привести число к одному основанию.', 'The error is found. The last task: bring a number to one base.'),
    A('built1', "Endi kasr bilan.", 'Теперь с дробью.', 'Now with a fraction.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN. Kamchiliklar xaritasi.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'root_modulus',
  gapMap: true,
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L('Qayerda teshik bor', 'Где дырка', 'Where the gap is'),
  law: L('modul, ODZ, bir asos', 'модуль, область, одно основание', 'the modulus, the domain, one base'),
  ruleLines: [
    L('juft darajali ildiz modul beradi', 'корень чётной степени даёт модуль', 'an even root gives the modulus'),
    L('logarifmda argument musbat', 'в логарифме аргумент положителен', 'in a logarithm the argument is positive'),
    L("ko'rsatkichli funksiya nol bo'lmaydi", 'показательная не бывает нулём', 'an exponential is never zero'),
  ],
  predicts: [
    {
      screen: 0,
      expr: '√((−3)²)',
      right: '3',
      map: { a: '3', b: '−3', c: '±3', d: '9' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '√((−3)²) = |−3| = 3',
  },
  levels: {
    full: L('Bu blok DTM da siz uchun yopildi', 'Этот блок на ДТМ у тебя закрыт', 'This block is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L("Xaritada ko'rsatilgan darslarga qayting", 'Вернись к урокам, указанным в карте', 'Go back to the lessons named in the map'),
  },
  probe: {
    question: L(
      'Sinov nima uchun kerak?',
      'Зачем нужна проверка?',
      'What is a check for?',
    ),
    items: [
      { id: 'a', label: L('teshik qayerda ekanini bilish', 'узнать, где дырка', 'to learn where the gap is'), correct: true },
      { id: 'b', label: L('baho olish', 'получить оценку', 'to get a mark'), hint: L("Baho bu yerda maqsad emas: bir son nima takrorlashni aytmaydi.", 'Оценка здесь не цель: одно число не говорит, что повторять.', 'A mark is not the aim: one number does not say what to review.') },
      { id: 'c', label: L("yangi mavzu o'rganish", 'изучить новую тему', 'to learn a new topic'), hint: L("Bu darsda yangi mavzu yo'q: hammasi allaqachon o'tilgan.", 'В этом уроке новой темы нет: всё уже пройдено.', 'This lesson has no new topic: everything is already covered.') },
      { id: 'd', label: L("vaqtni o'lchash", 'измерить время', 'to measure the time'), hint: L("Taymer bor, lekin u urinishni olib qo'ymaydi: u faqat ko'rsatadi.", 'Таймер есть, но он не отбирает попытку: он только показывает.', 'There is a timer, but it takes no attempt away: it only shows.') },
    ],
  },
  sheetTitle: L('Almashtirishlar · shpargalka', 'Преобразования · шпаргалка', 'Transformations · cheat sheet'),
  sheetSrc: L('11-sinf · 46-dars', '11 класс · урок 46', 'Grade 11 · lesson 46'),
  lifehack: L(
    "Juft ildiz ostidan modul chiqadi, va manfiy x da modul minus iks.",
    'Из-под чётного корня выходит модуль, а при отрицательном x модуль это минус икс.',
    'An even root gives the modulus, and for negative x the modulus is minus x.',
  ),
  holds: [3200, 6000, 6500],
  audio: [
    A('mount', "Sinov tugadi. Endi natijaga qaraymiz.", 'Проверка закончена. Теперь посмотрим на результат.', 'The check is over. Now let us look at the result.'),
    A('p1', "Mana taxminingiz va mana javob. Ildiz ostidan modul chiqadi, shuning uchun uch.", 'Вот твоя догадка и вот ответ. Из-под корня выходит модуль, поэтому три.', 'Here is your guess and here is the answer. The modulus comes out of the root, so three.'),
    A('rule', "O'ng tomonda kamchiliklar xaritasi. Bu foiz emas, ro'yxat: qaysi blokda qaysi joy xato bergan. Xaritada nima ko'rinsa, o'sha darsga qaytish kerak. Uchta narsa esa har imtihonda uchraydi: juft darajali ildiz modul beradi, logarifmning argumenti musbat bo'ladi, va ko'rsatkichli funksiya nolga aylanmaydi.", 'Справа карта пробелов. Это не процент, а список: в каком блоке какое место дало ошибку. Что видно в карте, к тому уроку и надо вернуться. А три вещи встречаются на каждом экзамене: корень чётной степени даёт модуль, аргумент логарифма положителен, показательная функция не обращается в ноль.', 'On the right is your gap map. It is not a percentage but a list: which block, which spot gave an error. Whatever shows in the map, that is the lesson to return to. And three things appear in every exam: an even root gives the modulus, the argument of a logarithm is positive, and an exponential never becomes zero.'),
    A('q', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  mode: MODE,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
