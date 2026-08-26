// ============================================================================
// 11-sinf, Dars 47. TENGLAMALAR VA TENGSIZLIKLAR: SINOV DTM.
//
// B6 blokining beshinchi darsi, DTM rejimida ikkinchisi.
//   kontrakt: src/books/grade11/ETALON_11SINF.md, 1.2-band (DTM anatomiyasi)
//   asbob:    `GraphProjection`, `TransformChain`, `AnswerValue`, `Probe`
//   tayanch:  kursning 9-13 darslari (ko'rsatkichli va logarifmik tenglamalar,
//             tengsizliklar, sistemalar)
//
// DARSNING BITTA GAPI: teng kuchli bo'lmagan o'tish begona ildiz keltiradi,
// va asos birdan kichik bo'lsa tengsizlikning yo'nalishi almashadi.
//
// SONLAR TEKSHIRILDI:
//   ildiz(x + 6) = x:  kvadratga ko'tarilsa x² − x − 6 = 0, ildizlari 3 va −2.
//     Tekshiruv: x = 3 -> ildiz(9) = 3 (rost);  x = −2 -> ildiz(4) = 2, −2 emas.
//     Demak javob BITTA: x = 3
//   0,5ˣ > 0,25  ->  x < 2   (asos birdan kichik, yo'nalish almashadi)
//   2ˣ < 8  ->  x < 3
//   5ˣ⁺¹ = 125  ->  x + 1 = 3  ->  x = 2
//   (x − 1)(x − 3) ≥ 0  ->  (−∞; 1] va [3; +∞)
//   log₂(x − 3) = 2:  x = 7.  x = 1 va x = 3 da argument musbat emas, x = 4 da 0
//   2²ˣ − 5·2ˣ + 4 = 0  ->  t = 1; 4  ->  x = 0; 2
//   log₂ x < 3  ->  0 < x < 8
//   (1/3)ˣ ≥ 9  ->  x ≤ −2
//   blits: 2ˣ⁻¹ = 16 -> x = 5;  ildiz(x) = −2 yechimsiz;  0,5ˣ < 8 -> x > −3;
//          log₅(2x − 6) ODZ: x > 3;  9ˣ − 3ˣ almashtirishda t² − t;
//          x > 2 va x < 7 -> (2; 7)
//   audit: kvadratga ko'tarilgandan keyin tekshiruv o'tkazilmagan
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_47',
  title: L('Tenglama va tengsizlik: sinov DTM', 'Уравнения и неравенства: пробный ДТМ', 'Equations and inequalities: a mock exam'),
}

const BLOCK = { label: 'B6', from: 43, to: 49, current: 47 }

// DTM REJIMI. Etalon 1.2-bandi.
const MODE = 'dtm'

// y = 2ˣ
const EXP2 = (x) => Math.pow(2, x)

// ============================================================
// SLAYD 1. XUK. Nechta ildiz bor.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Sinov DTM', 'Пробный ДТМ', 'Mock exam'),
  title: L('Nechta ildiz bor', 'Сколько корней', 'How many roots'),
  expr: '√(x + 6) = x',
  rows: [
    {
      id: 'a',
      name: L('Karim', 'Карим', 'Karim'),
      value: L('ikkita: 3 va −2', 'два: 3 и −2', 'two: 3 and −2'),
    },
    {
      id: 'b',
      name: L('Nargiza', 'Наргиза', 'Nargiza'),
      value: L('bitta: 3', 'один: 3', 'one: 3'),
    },
  ],
  probe: {
    question: L(
      'Tenglamaning nechta ildizi bor?',
      'Сколько корней у уравнения?',
      'How many roots does the equation have?',
    ),
    afterPredict: L(
      'Javobingiz yozib olindi. Endi masalalar boshlanadi.',
      'Твой ответ записан. Теперь начинаются задачи.',
      'Your answer is saved. Now the problems begin.',
    ),
    items: [
      { id: 'a', label: L('bitta', 'один', 'one') },
      { id: 'b', label: L('ikkita', 'два', 'two') },
      { id: 'c', label: L('bitta ham yo\'q', 'ни одного', 'none') },
      { id: 'd', label: L('uchta', 'три', 'three') },
    ],
  },
  holds: [4200, 4500, 3600],
  audio: [
    A('mount', "Ikkinchi sinov. Masalalar darrov beriladi, natija esa teshik qayerda ekanini ko'rsatadi.", 'Вторая проверка. Задачи идут сразу, а результат покажет, где дырка.', 'The second check. The problems come at once, and the result shows where the gap is.'),
    A('r1', "Karim ikki tomonni kvadratga ko'tardi, kvadrat tenglamani yechdi va ikkita ildiz yozdi.", 'Карим возвёл обе части в квадрат, решил квадратное уравнение и записал два корня.', 'Karim squared both sides, solved the quadratic and wrote two roots.'),
    A('r2', "Nargiza esa bitta ildiz qoldirdi.", 'А Наргиза оставила один корень.', 'Nargiza left one root.'),
    A('ask', "Sizningcha nechta ildiz bor. Taxmin qiling.", 'Как думаешь, сколько корней. Предположи.', 'How many roots do you think there are. Make a guess.'),
  ],
}

// ============================================================
// SLAYD 2. MASALA 1. Nomzodlarni ASL yozuvga qo'yish.
// ============================================================
const S2 = {
  role: 'points',
  section: 'practice',
  led: 'student',
  tag: 'equal_roots',
  eyebrow: L('Masala 1', 'Задача 1', 'Problem 1'),
  title: L('Qaysi nomzod tekshiruvdan o\'tadi', 'Какой кандидат проходит проверку', 'Which candidate survives the check'),
  expr: '√(x + 6) = x',
  goal: L('nomzodlarni asl yozuvga qo\'yish', 'подставить кандидатов в исходную запись', 'substitute the candidates into the original'),
  rule: L(
    "Har bir nomzodni ASL tenglamaga qo'yamiz.",
    'Каждого кандидата подставляем в ИСХОДНОЕ уравнение.',
    'We substitute each candidate into the ORIGINAL equation.',
  ),
  pick: L('Qaysi nomzodni tekshiramiz?', 'Какого кандидата проверим?', 'Which candidate shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('ikki ildiz ham', 'оба корня', 'both roots'), value: '2' },
    { id: 'b', key: 'inB', name: L('faqat tekshiruvdan o\'tgani', 'только прошедший проверку', 'only the one that survives'), value: '1' },
  ],
  points: [
    {
      id: 'q1', label: 'x = 3', num: '3 = 3', step: 'calc', verdict: 'in',
      calc: L('ildiz uchga teng', 'корень равен трём', 'the root is three'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q2', label: 'x = −2', num: '2 ≠ −2', step: 'calc', verdict: 'out',
      calc: L('ildiz ikki, minus emas', 'корень два, не минус два', 'the root is two, not minus'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q3', label: 'x = −3', num: '1,73 ≠ −3', step: 'calc', verdict: 'out',
      calc: L('chapda plyus, o\'ngda minus', 'слева плюс, справа минус', 'plus left, minus right'),
      sol: false, inA: false, inB: false,
    },
    {
      id: 'q4', label: 'x = 2', num: '2,83 ≠ 2', step: 'calc', verdict: 'out',
      calc: L('ildiz ikkidan katta', 'корень больше двух', 'the root exceeds two'),
      sol: false, inA: false, inB: false,
    },
  ],
  probe: {
    question: L(
      'Nima uchun minus ikki yaramaydi?',
      'Почему минус два не годится?',
      'Why does minus two fail?',
    ),
    items: [
      { id: 'a', label: L('ildiz manfiy bo\'lmaydi', 'корень не бывает отрицательным', 'a root is never negative'), correct: true },
      { id: 'b', label: L('kvadrat tenglama xato', 'квадратное уравнение неверно', 'the quadratic is wrong'), hint: L("Kvadrat tenglama to'g'ri yechilgan: uning ildizlari haqiqatan uch va minus ikki.", 'Квадратное решено верно: его корни действительно три и минус два.', 'The quadratic is solved right: its roots really are three and minus two.') },
      { id: 'c', label: L('minus ikki ODZ ga kirmaydi', 'минус два вне области', 'minus two is outside the domain'), hint: L("Ildiz ostidagi ifoda minus ikkida to'rtga teng, ya'ni musbat. Muammo O'NG tomonda.", 'Под корнем при минус двух четыре, то есть положительно. Проблема в ПРАВОЙ части.', 'Under the root at minus two we get four, which is positive. The problem is on the RIGHT side.') },
      { id: 'd', label: L('yaraydi', 'годится', 'it does fit'), hint: L("Qo'yib ko'rish yetadi: chapda ikki, o'ngda minus ikki chiqadi.", 'Достаточно подставить: слева два, справа минус два.', 'Substituting is enough: two on the left, minus two on the right.') },
    ],
  },
  holds: [3000, 2400, 2600, 8500],
  audio: [
    A('mount', "Birinchi masala. Kvadratga ko'tarish ikkita nomzod berdi, va ularni tekshirish kerak.", 'Первая задача. Возведение в квадрат дало двух кандидатов, и их надо проверить.', 'The first problem. Squaring gave two candidates, and they must be checked.'),
    A('mount', "Nomzodni o'zingiz tanlaysiz.", 'Кандидата выбираешь сам.', 'You choose the candidate yourself.'),
    A('calc', 'Qo\'yamiz.', 'Подставляем.', 'We substitute.'),
    A('mark', "Mana natija. Uchta nomzod yiqildi, faqat uch qoldi. Sababi bitta: kvadrat ildiz manfiy son bermaydi, o'ng tomonda esa manfiy son turgan. Kvadratga ko'tarish bu farqni yo'q qiladi, shuning uchun bunday o'tishdan keyin tekshiruv MAJBURIY.", 'Вот результат. Три кандидата упали, остался только три. Причина одна: квадратный корень не даёт отрицательного числа, а справа стояло отрицательное. Возведение в квадрат стирает эту разницу, поэтому после такого перехода проверка ОБЯЗАТЕЛЬНА.', 'Here is the result. Three candidates fell, only three survived. The reason is one: a square root never gives a negative number, and the right side was negative. Squaring erases that difference, so after such a step a check is MANDATORY.'),
  ],
}

// ============================================================
// SLAYD 3. MASALA 2. Asos birdan kichik.
// ============================================================
const S3 = {
  role: 'sign',
  section: 'practice',
  led: 'student',
  tag: 'base_direction',
  eyebrow: L('Masala 2', 'Задача 2', 'Problem 2'),
  title: L('Yo\'nalishni qo\'ying', 'Поставь направление', 'Place the direction'),
  left: L(
    'Asos birdan KICHIK',
    'Основание МЕНЬШЕ единицы',
    'The base is LESS than one',
  ),
  template: ['0,5ˣ > 0,25  ⇒  x  ', { slot: 0 }, ' 2'],
  signs: ['<', '>'],
  answer: '<',
  checkNote: L(
    'nolni qo\'yib ko\'ring: bir chorakdan katta, demak nol javobga kiradi',
    'подставь ноль: один больше одной четвёртой, значит ноль входит в ответ',
    'try zero: one is more than a quarter, so zero belongs to the answer',
  ),
  wrongs: [
    { key: '>', hint: L("Uchni qo'yib ko'ring: nol butun bir yigirma beshdan bir chorakdan kichik, demak uch yaramaydi.", 'Подставь три: ноль целых сто двадцать пять тысячных меньше четверти, значит три не годится.', 'Try three: zero point one two five is less than a quarter, so three fails.') },
  ],
  probe: {
    question: L(
      'Yo\'nalish qachon almashadi?',
      'Когда направление меняется?',
      'When does the direction flip?',
    ),
    items: [
      { id: 'a', label: L('asos birdan kichik bo\'lganda', 'когда основание меньше единицы', 'when the base is less than one'), correct: true },
      { id: 'b', label: L('har doim', 'всегда', 'always'), hint: L("Asos birdan katta bo'lsa yo'nalish saqlanadi.", 'Если основание больше единицы, направление сохраняется.', 'If the base is more than one, the direction holds.') },
      { id: 'c', label: L('hech qachon', 'никогда', 'never'), hint: L("Almashadi: yarim daraja o'sganda KICHRAYADI.", 'Меняется: половина в степени при росте показателя УМЕНЬШАЕТСЯ.', 'It does flip: a half to a power DECREASES as the exponent grows.') },
      { id: 'd', label: L('argument manfiy bo\'lganda', 'когда аргумент отрицателен', 'when the argument is negative'), hint: L("Ko'rsatkich manfiy bo'lishi mumkin, va bu yo'nalishga ta'sir qilmaydi.", 'Показатель может быть отрицательным, и на направление это не влияет.', 'The exponent may be negative, and that does not affect the direction.') },
    ],
  },
  audio: [
    A('mount', "Ikkinchi masala. Asos yarim, ya'ni birdan kichik.", 'Вторая задача. Основание половина, то есть меньше единицы.', 'The second problem. The base is a half, less than one.'),
    A('write', "Yo'nalishni qo'ying.", 'Поставь направление.', 'Place the direction.'),
  ],
}

// ============================================================
// SLAYD 4. MASALA 3. Chizma: tengsizlik qayerda.
// ============================================================
const S4 = {
  role: 'graph',
  section: 'practice',
  tag: 'intersection',
  drag: false,
  eyebrow: L('Masala 3', 'Задача 3', 'Problem 3'),
  title: L('Chiziq to\'g\'ri chiziqdan qachon past', 'Когда кривая ниже прямой', 'When the curve is below the line'),
  chip: '2ˣ < 8',
  graph: {
    fn: EXP2,
    xDomain: [-1, 5],
    yDomain: [-2, 13],
    hline: 8,
    cross: 3,
    shade: { from: -1, to: 3 },
    shadeLabel: 'x < 3',
    xTicks: [{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }],
    yTicks: [{ v: 4 }, { v: 8 }, { v: 12 }],
    height: 168,
  },
  probe: {
    question: L(
      'Javob qayerda tugaydi?',
      'Где заканчивается ответ?',
      'Where does the answer end?',
    ),
    items: [
      { id: 'a', label: L('kesishgan joyda', 'в точке пересечения', 'at the crossing point'), correct: true },
      { id: 'b', label: L('nolda', 'в нуле', 'at zero'), hint: L("Nolda chiziq allaqachon pastda, demak nol javobga kiradi.", 'В нуле кривая уже ниже, значит ноль входит в ответ.', 'At zero the curve is already below, so zero belongs to the answer.') },
      { id: 'c', label: L('chiziq boshlanganda', 'где кривая начинается', 'where the curve begins'), hint: L("Ko'rsatkichli funksiya hamma joyda mavjud: chapda ham chiziq bor.", 'Показательная существует всюду: слева кривая тоже есть.', 'An exponential exists everywhere: the curve is on the left too.') },
      { id: 'd', label: L('sakkizda', 'в восьмёрке', 'at eight'), hint: L("Sakkiz bu to'g'ri chiziqning balandligi, javob esa iks o'qida o'lchanadi.", 'Восемь это высота прямой, а ответ измеряется по оси икс.', 'Eight is the height of the line, and the answer is measured along the x axis.') },
    ],
  },
  holds: [4500, 5000],
  audio: [
    A('mount', "Uchinchi masala chizmada. Ko'rsatkichli chiziq o'sadi, va sakkiz balandligida to'g'ri chiziqni kesib o'tadi.", 'Третья задача на чертеже. Показательная кривая растёт и на высоте восемь пересекает прямую.', 'The third problem is on a drawing. The exponential curve rises and crosses the line at height eight.'),
    A('mount', "Kesishishdan chapda chiziq pastda, o'ngda esa yuqorida. Javob shu chegaraga qadar.", 'Левее пересечения кривая ниже, а правее выше. Ответ идёт до этой границы.', 'Left of the crossing the curve is below, right of it above. The answer runs up to that boundary.'),
  ],
}

// Zanjir amallari: ikki masalaning amallari bir ro'yxatda.
const ACTIONS_47 = [
  { id: 'base', label: L('bir asosga keltirish', 'привести к одному основанию', 'reduce to one base') },
  { id: 'exp', label: L("ko'rsatkichlarni tenglashtirish", 'приравнять показатели', 'equate the exponents') },
  { id: 'subst', label: L('almashtirish kiritish', 'ввести замену', 'introduce a substitution') },
  { id: 'solve', label: L('kvadrat tenglamani yechish', 'решить квадратное', 'solve the quadratic') },
  { id: 'back', label: L('iksga qaytish', 'вернуться к иксу', 'go back to x') },
]

// ============================================================
// SLAYD 5. MASALA 4. Zanjir.
// ============================================================
const S5 = {
  role: 'chain',
  section: 'practice',
  led: 'student',
  tag: 'same_base',
  noLine: true,
  eyebrow: L('Masala 4', 'Задача 4', 'Problem 4'),
  title: L('Bir asosga', 'К одному основанию', 'To one base'),
  start: '5ˣ⁺¹ = 125',
  actions: ACTIONS_47,
  steps: [
    {
      action: 'base',
      to: '5ˣ⁺¹ = 5³',
      wrongs: [
        { action: 'exp', hint: L("Tenglashtirish uchun o'ngda ham daraja bo'lishi kerak.", 'Чтобы приравнивать, справа тоже должна быть степень.', 'To equate, the right side must be a power too.') },
        { action: 'subst', hint: L("Almashtirish kvadrat tenglamada kerak bo'ladi.", 'Замена понадобится в квадратном уравнении.', 'A substitution will be needed in the quadratic.') },
        { action: 'solve', hint: L("Kvadrat tenglama yo'q.", 'Квадратного уравнения нет.', 'There is no quadratic.') },
      ],
    },
    {
      action: 'exp',
      to: 'x + 1 = 3',
      wrongs: [
        { action: 'base', hint: L("Asoslar allaqachon bir xil: ikkitasi ham besh.", 'Основания уже одинаковы: оба пять.', 'The bases already match: both are five.') },
        { action: 'back', hint: L("Qaytish uchun almashtirish kerak edi.", 'Чтобы возвращаться, нужна была замена.', 'To go back a substitution was needed.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['2', '3', '4', '25'],
    value: ['2'],
    label: 'x =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '3', hint: L("Uch bu ko'rsatkich, iks esa undan bittaga kichik.", 'Три это показатель, а икс на единицу меньше.', 'Three is the exponent, and x is one less.') },
      { key: '4', hint: L("Bir qo'shilgan, aslida ayirilishi kerak edi.", 'Единица прибавлена, а надо было вычесть.', 'One was added, but it had to be subtracted.') },
      { key: '25', hint: L("Yigirma besh beshning kvadrati, javob esa ko'rsatkich haqida.", 'Двадцать пять это пять в квадрате, а ответ о показателе.', 'Twenty five is five squared, and the answer is about the exponent.') },
      { key: '*', hint: L("Iks plyus bir uchga teng, demak iks ikki.", 'Икс плюс один равно трём, значит икс два.', 'x plus one equals three, so x is two.') },
    ],
  },
  audio: [
    A('mount', "To'rtinchi masala. Ro'yxatda boshqa masalaning amallari ham bor.", 'Четвёртая задача. В списке есть действия и другой задачи.', 'The fourth problem. The list also holds actions of another problem.'),
    A('step3', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 6. MASALA 5. Ko'paytma nolga teng yoki katta.
// ============================================================
const S6 = {
  role: 'twoway',
  section: 'practice',
  tag: 'intersection',
  eyebrow: L('Masala 5', 'Задача 5', 'Problem 5'),
  title: L('Ko\'paytma qayerda musbat', 'Где произведение положительно', 'Where the product is positive'),
  expr: '(x − 1)(x − 3) ≥ 0',
  need: L('ikki oraliq', 'два промежутка', 'two intervals'),
  answerLabel: L('to\'g\'ri javob', 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      txt: L('ildizlar orasini oldi', 'взял между корнями', 'took the middle'),
      point: {
        label: L('uning javobi', 'его ответ', 'his answer'),
        calc: '[1; 3]',
        verdict: 'out',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L('chekkalarni oldi', 'взяла края', 'took the ends'),
      point: {
        label: L('uning javobi', 'её ответ', 'her answer'),
        calc: '(−∞; 1] ∪ [3; +∞)',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['(−∞; 1] ∪ [3; +∞)', '[1; 3]', '(1; 3)', '(−∞; 3]'],
    value: ['(−∞; 1] ∪ [3; +∞)'],
    label: L('javob:', 'ответ:', 'answer:'),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '[1; 3]', hint: L("Ikkida tekshirib ko'ring: bir karra minus bir minus bir beradi, ya'ni manfiy.", 'Проверь в двойке: один на минус один даёт минус один, то есть отрицательно.', 'Check at two: one times minus one gives minus one, that is negative.') },
      { key: '(1; 3)', hint: L("Bu ham o'rta oraliq, faqat uchlari olinmagan.", 'Это тоже средний промежуток, только без концов.', 'That is the middle interval again, only without its ends.') },
      { key: '(−∞; 3]', hint: L("Bir va uch orasida ko'paytma manfiy, demak bu oraliq butun holda javob bo'lolmaydi.", 'Между одним и тремя произведение отрицательно, значит целиком этот промежуток ответом быть не может.', 'Between one and three the product is negative, so that whole interval cannot be the answer.') },
      { key: '*', hint: L("Ikki ko'paytuvchi bir xil ishorada bo'lishi kerak: ikkisi ham musbat yoki ikkisi ham manfiy.", 'Два множителя должны быть одного знака: оба положительны или оба отрицательны.', 'The two factors must share a sign: both positive or both negative.') },
    ],
  },
  holds: [4200, 4200, 5500],
  audio: [
    A('mount', "Beshinchi masala. Ikki o'quvchi bitta tengsizlikni boshqacha yechdi.", 'Пятая задача. Два ученика решили одно неравенство по-разному.', 'The fifth problem. Two students solved one inequality differently.'),
    A('p1', "Aziz ildizlar orasini oldi. Lekin u yerda bitta ko'paytuvchi musbat, ikkinchisi manfiy.", 'Азиз взял промежуток между корнями. Но там один множитель положителен, а второй отрицателен.', 'Aziz took the part between the roots. But there one factor is positive and the other negative.'),
    A('p2', "Dilnoza esa chekka oraliqlarni oldi. Chapda ikki ko'paytuvchi ham manfiy, va minus karra minus plyus beradi. O'ngda ikkisi ham musbat. Javob ikki oraliqning birlashmasi.", 'А Дилноза взяла крайние промежутки. Слева оба множителя отрицательны, а минус на минус даёт плюс. Справа оба положительны. Ответ это объединение двух промежутков.', 'Dilnoza took the outer intervals. On the left both factors are negative, and minus times minus gives plus. On the right both are positive. The answer is the union of two intervals.'),
    A('write', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 7. MASALA 6. Logarifmning ODZ si.
// ============================================================
const S7 = {
  role: 'points',
  section: 'practice',
  led: 'student',
  tag: 'log_domain',
  eyebrow: L('Masala 6', 'Задача 6', 'Problem 6'),
  title: L('Qaysi qiymat mumkin', 'Какое значение возможно', 'Which value is allowed'),
  expr: 'log₂(x − 3) = 2',
  goal: L('argumentni tekshirish', 'проверить аргумент', 'check the argument'),
  rule: L(
    "Har bir qiymatda argumentni hisoblaymiz.",
    'В каждом значении считаем аргумент.',
    'At each value we compute the argument.',
  ),
  pick: L('Qaysi qiymatni tekshiramiz?', 'Какое значение проверим?', 'Which value shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('nol ham mumkin', 'ноль тоже можно', 'zero is allowed'), value: '≥ 0' },
    { id: 'b', key: 'inB', name: L('faqat musbat', 'только плюс', 'positive only'), value: '> 0' },
  ],
  points: [
    {
      id: 'q1', label: 'x = 1', num: '−2', step: 'calc', verdict: 'out',
      calc: L('argument manfiy', 'аргумент минус', 'the argument is minus'),
      sol: false, inA: false, inB: false,
    },
    {
      id: 'q2', label: 'x = 3', num: '0', step: 'calc', verdict: 'out',
      calc: L('argument nol', 'аргумент ноль', 'the argument is zero'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q3', label: 'x = 4', num: '1', step: 'calc', verdict: 'out',
      calc: L('logarifm nol, ikki emas', 'логарифм ноль, не два', 'the logarithm is zero, not two'),
      sol: false, inA: true, inB: true,
    },
    {
      id: 'q4', label: 'x = 7', num: '4', step: 'calc', verdict: 'in',
      calc: L('ikki kvadrat to\'rt', 'два в квадрате четыре', 'two squared is four'),
      sol: true, inA: true, inB: true,
    },
  ],
  probe: {
    question: L(
      'Argument nolga teng bo\'lishi mumkinmi?',
      'Может ли аргумент быть нулём?',
      'May the argument be zero?',
    ),
    items: [
      { id: 'b', label: L('yo\'q, faqat musbat', 'нет, только положительный', 'no, positive only'), correct: true },
      { id: 'a', label: L('ha, mumkin', 'да, может', 'yes, it may'), hint: L("Nolning logarifmi yo'q: hech qanday daraja nolni bermaydi.", 'Логарифма нуля нет: никакая степень не даёт ноль.', 'There is no logarithm of zero: no power gives zero.') },
      { id: 'c', label: L('asosga bog\'liq', 'зависит от основания', 'it depends on the base'), hint: L("Asos ahamiyatsiz: har qanday musbat asosda ham nol chiqmaydi.", 'Основание не важно: ни при каком положительном основании ноль не выходит.', 'The base does not matter: no positive base ever gives zero.') },
      { id: 'd', label: L('faqat ikki asosida', 'только при основании два', 'only for base two'), hint: L("Ikki asosida ham nol chiqmaydi: ikki darajalari doim musbat.", 'При основании два ноль тоже не выходит: степени двух всегда положительны.', 'Base two gives no zero either: powers of two are always positive.') },
    ],
  },
  holds: [3000, 2400, 2600, 8000],
  audio: [
    A('mount', "Oltinchi masala. To'rtta qiymat, va faqat bittasi to'g'ri.", 'Шестая задача. Четыре значения, и верно только одно.', 'The sixth problem. Four values, and only one is right.'),
    A('mount', "Qiymatni o'zingiz tanlaysiz.", 'Значение выбираешь сам.', 'You choose the value yourself.'),
    A('calc', 'Hisoblaymiz.', 'Считаем.', 'We compute.'),
    A('mark', "Mana natija. Birda argument manfiy, uchda nol: ikki holatda ham logarifm mavjud emas. To'rtda logarifm bor, lekin u nolga teng, tenglama esa ikkini talab qiladi. Faqat yettida hammasi to'g'ri keladi: argument to'rt, va uning logarifmi ikki.", 'Вот результат. В единице аргумент отрицателен, в трёх ноль: в обоих случаях логарифма нет. В четырёх логарифм есть, но он равен нулю, а уравнение требует двух. Только в семи всё сходится: аргумент четыре, и его логарифм два.', 'Here is the result. At one the argument is negative, at three it is zero: in both cases there is no logarithm. At four the logarithm exists but equals zero, and the equation asks for two. Only at seven everything fits: the argument is four and its logarithm is two.'),
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
  start: '2²ˣ − 5 · 2ˣ + 4 = 0',
  actions: ACTIONS_47,
  hint: L(
    "Ikki daraja ikki iks bu ikki daraja iksning kvadrati.",
    'Два в степени два икс это квадрат двух в степени икс.',
    'Two to the two x is the square of two to the x.',
  ),
  steps: [
    {
      action: 'subst',
      to: 't² − 5t + 4 = 0',
      wrongs: [
        { action: 'base', hint: L("Asoslar allaqachon bir xil: ikkitasi ham ikki. Yangi harf kerak.", 'Основания уже одинаковы: оба два. Нужна новая буква.', 'The bases already match: both are two. A new letter is needed.') },
        { action: 'exp', hint: L("Ko'rsatkichlarni tenglashtirish uchun ikki tomonda bitta daraja bo'lishi kerak.", 'Чтобы приравнять показатели, с двух сторон должна быть одна степень.', 'To equate exponents there must be one power on each side.') },
        { action: 'back', hint: L("Qaytish uchun avval almashtirish kerak.", 'Чтобы вернуться, сначала нужна замена.', 'To go back, a substitution comes first.') },
      ],
    },
    {
      action: 'solve',
      to: 't = 1;  t = 4',
      wrongs: [
        { action: 'subst', hint: L("Almashtirish kiritildi: t bu ikki daraja iks.", 'Замена введена: t это два в степени икс.', 'The substitution is in: t is two to the x.') },
        { action: 'back', hint: L("Qaytishdan oldin t topilishi kerak.", 'Прежде чем возвращаться, надо найти t.', 'Before going back, t must be found.') },
      ],
    },
    {
      action: 'back',
      to: 'x = 0;  x = 2',
      wrongs: [
        { action: 'solve', hint: L("Kvadrat tenglama yechildi: bir va to'rt.", 'Квадратное решено: один и четыре.', 'The quadratic is solved: one and four.') },
        { action: 'base', hint: L("Asoslar bilan ish tugadi.", 'С основаниями закончили.', 'The bases are done.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['0;  2', '1;  4', '0', '2'],
    value: ['0;  2'],
    label: 'x =',
    prompt: L('Hamma ildizlarni yozing', 'Запиши все корни', 'Write all the roots'),
    wrongs: [
      { key: '1;  4', hint: L("Bu t ning qiymatlari. Iks uchun ikki daraja iks bir va to'rtga teng bo'lishi kerak.", 'Это значения t. Для икса нужно, чтобы два в степени икс равнялось одному и четырём.', 'Those are the values of t. For x we need two to the x to equal one and four.') },
      { key: '0', hint: L("Bitta ildiz tushib qolgan: t to'rtga teng bo'lganda iks ikki chiqadi.", 'Потерян один корень: когда t равно четырём, икс равен двум.', 'One root is lost: when t is four, x is two.') },
      { key: '2', hint: L("Bitta ildiz tushib qolgan: t birga teng bo'lganda iks nol chiqadi.", 'Потерян один корень: когда t равно единице, икс равен нулю.', 'One root is lost: when t is one, x is zero.') },
      { key: '*', hint: L("Ikki daraja iks birga teng bo'lsa iks nol, to'rtga teng bo'lsa iks ikki.", 'Если два в степени икс равно одному, икс ноль; если четырём, икс два.', 'If two to the x is one, x is zero; if four, x is two.') },
    ],
  },
  audio: [
    A('mount', "Yettinchi masala mustaqil, imtihondagidek.", 'Седьмая задача самостоятельная, как на экзамене.', 'The seventh problem is on your own, as on the exam.'),
    A('step4', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 9. MASALA 8. Logarifmik tengsizlik.
// ============================================================
const S9 = {
  role: 'sign',
  section: 'practice',
  led: 'student',
  tag: 'log_domain',
  eyebrow: L('Masala 8', 'Задача 8', 'Problem 8'),
  title: L('Chegarani qo\'ying', 'Поставь границу', 'Place the boundary'),
  left: L(
    'Asos birdan KATTA',
    'Основание БОЛЬШЕ единицы',
    'The base is MORE than one',
  ),
  template: ['log₂ x < 3  ⇒  x  ', { slot: 0 }, ' 8'],
  signs: ['<', '>'],
  answer: '<',
  checkNote: L(
    'ikkinchi shart ham bor: x musbat bo\'lishi kerak',
    'есть и второе условие: x должен быть положительным',
    'there is a second condition too: x must be positive',
  ),
  wrongs: [
    { key: '>', hint: L("O'n oltini qo'yib ko'ring: uning logarifmi to'rt, va u uchdan katta.", 'Подставь шестнадцать: его логарифм четыре, а это больше трёх.', 'Try sixteen: its logarithm is four, which is more than three.') },
  ],
  probe: {
    question: L(
      'Javob to\'liq qanday yoziladi?',
      'Как записывается полный ответ?',
      'How is the full answer written?',
    ),
    items: [
      { id: 'a', label: '0 < x < 8', correct: true },
      { id: 'b', label: 'x < 8', hint: L("Manfiy iksda logarifm mavjud emas, demak chap chegara ham kerak.", 'При отрицательном икс логарифма нет, значит нужна и левая граница.', 'For negative x there is no logarithm, so the left boundary is needed too.') },
      { id: 'c', label: 'x > 0', hint: L("Bu faqat ODZ. Tengsizlikning o'zi o'ng chegarani beradi.", 'Это только область. Само неравенство даёт правую границу.', 'That is only the domain. The inequality itself gives the right boundary.') },
      { id: 'd', label: 'x > 8', hint: L("Yo'nalish teskari: asos birdan katta, demak yo'nalish saqlanadi.", 'Направление обратное: основание больше единицы, значит направление сохраняется.', 'The direction is reversed: the base is more than one, so the direction holds.') },
    ],
  },
  audio: [
    A('mount', "Sakkizinchi masala. Bu safar asos birdan katta.", 'Восьмая задача. На этот раз основание больше единицы.', 'The eighth problem. This time the base is more than one.'),
    A('write', "Chegarani qo'ying.", 'Поставь границу.', 'Place the boundary.'),
  ],
}

// ============================================================
// SLAYD 10. MASALA 9. Teskari masala: ODZ ni yig'ish.
// ============================================================
const S10 = {
  role: 'build',
  section: 'practice',
  led: 'student',
  tag: 'intersection',
  right: '2/2',
  eyebrow: L('Masala 9', 'Задача 9', 'Problem 9'),
  title: L('ODZ ni yig\'ing', 'Собери область', 'Build the domain'),
  targetLabel: L('Ifoda', 'Выражение', 'The expression'),
  targetValue: '√(x − 2) / (x − 5)',
  tasks: [
    {
      prompt: L('Ikki shartni yozing', 'Запиши два условия', 'Write the two conditions'),
      template: ['x ', { slot: 0 }, ' 2,    x ', { slot: 1 }, ' 5'],
      parts: ['≥', '≠', '>', '='],
      answer: ['≥', '≠'],
      doneLabel: 'x ≥ 2,  x ≠ 5',
      wrongs: [
        { key: '>|≠', hint: L("Ikkida ildiz nolga teng, va bu mumkin: nolning ildizi bor.", 'В двойке корень равен нулю, и это можно: корень из нуля есть.', 'At two the root is zero, and that is allowed: the root of zero exists.') },
        { key: '≥|=', hint: L("Maxraj nolga TENG bo'lmasligi kerak.", 'Знаменатель НЕ должен равняться нулю.', 'The bottom must NOT equal zero.') },
        { key: '*', hint: L("Ildiz ostida nol mumkin, maxrajda esa nol mumkin emas.", 'Под корнем ноль можно, а в знаменателе нельзя.', 'Zero is allowed under the root, but not in the bottom.') },
      ],
    },
    {
      prompt: L('32 ni 2 asosida yozing', 'Запиши 32 по основанию 2', 'Write 32 with base 2'),
      template: ['32 = 2', { slot: 0 }],
      parts: ['⁵', '⁴', '⁶', '⁻⁵'],
      answer: ['⁵'],
      doneLabel: '2⁵',
      wrongs: [
        { key: '⁴', hint: L("Ikkining to'rtinchi darajasi o'n olti.", 'Два в четвёртой шестнадцать.', 'Two to the fourth is sixteen.') },
        { key: '⁶', hint: L("Ikkining oltinchi darajasi oltmish to'rt.", 'Два в шестой шестьдесят четыре.', 'Two to the sixth is sixty four.') },
        { key: '*', hint: L("Ikkini besh marta ko'paytirsak o'ttiz ikki chiqadi.", 'Если умножить два пять раз, выйдет тридцать два.', 'Multiplying two five times gives thirty two.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'qqizinchi masala teskari: shartlarni o'zingiz yozasiz. Ildiz va maxraj bir xil talab qo'ymaydi.", 'Девятая задача обратная: условия записываешь сам. Корень и знаменатель требуют разного.', 'The ninth problem is reverse: you write the conditions. A root and a denominator ask for different things.'),
    A('built1', "Endi ikkinchisi.", 'Теперь второе.', 'Now the second.'),
  ],
}

// ============================================================
// SLAYD 11. MASALA 10. Asos birdan kichik: tengsizlik.
// ============================================================
const S11 = {
  role: 'twoway',
  section: 'practice',
  tag: 'base_direction',
  eyebrow: L('Masala 10', 'Задача 10', 'Problem 10'),
  title: L('Yo\'nalish qayoqqa', 'Куда направление', 'Which way the direction'),
  expr: '(1/3)ˣ ≥ 9',
  need: L('yo\'nalishning tomoni', 'сторона направления', 'the side of the direction'),
  answerLabel: L('to\'g\'ri javob', 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      txt: L("yo'nalishni saqladi", 'сохранил направление', 'kept it'),
      point: {
        label: L('uning javobi', 'его ответ', 'his answer'),
        calc: 'x ≥ −2',
        verdict: 'out',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L("yo'nalishni burdi", 'сменила направление', 'flipped it'),
      point: {
        label: L('uning javobi', 'её ответ', 'her answer'),
        calc: 'x ≤ −2',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['(−∞; −2]', '[−2; +∞)', '(−∞; 2]', '[2; +∞)'],
    value: ['(−∞; −2]'],
    label: L('javob:', 'ответ:', 'answer:'),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '[−2; +∞)', hint: L("Nolni qo'yib ko'ring: bir to'qqizdan kichik, demak nol javobga kirmaydi.", 'Подставь ноль: один меньше девяти, значит ноль в ответ не входит.', 'Try zero: one is less than nine, so zero is not in the answer.') },
      { key: '(−∞; 2]', hint: L("Ishora yo'qolgan: uch daraja minus iks to'qqizdan katta bo'lishi kerak, ya'ni minus iks ikkidan katta.", 'Потерян знак: три в степени минус икс должно быть больше девяти, то есть минус икс больше двух.', 'The sign is lost: three to the minus x must exceed nine, so minus x is more than two.') },
      { key: '[2; +∞)', hint: L("Ikkita xato birga: ishora ham, yo'nalish ham.", 'Две ошибки сразу: и знак, и направление.', 'Two errors at once: the sign and the direction.') },
      { key: '*', hint: L("Bir bo'lingan uch bu uch daraja minus bir. Tengsizlik minus iks ikkidan katta yoki teng beradi.", 'Одна третья это три в минус первой. Неравенство даёт минус икс больше или равно двум.', 'One third is three to the minus one. The inequality gives minus x at least two.') },
    ],
  },
  holds: [4200, 3200, 5500],
  audio: [
    A('mount', "O'ninchi masala, oxirgisi. Asos birdan kichik.", 'Десятая задача, последняя. Основание меньше единицы.', 'The tenth problem, the last one. The base is less than one.'),
    A('p1', "Aziz yo'nalishni saqlab qoldi.", 'Азиз сохранил направление.', 'Aziz kept the direction.'),
    A('p2', "Dilnoza esa uni almashtirdi. Bir bo'lingan uch bu uchning manfiy darajasi, va ko'rsatkich manfiy bo'lganda tengsizlik teskari buriladi. Tekshiruv oson: nolni qo'ysak, chapda bir chiqadi, va bir to'qqizdan kichik.", 'А Дилноза его сменила. Одна третья это три в отрицательной степени, и при отрицательном показателе неравенство переворачивается. Проверка простая: подставим ноль, слева выйдет один, а один меньше девяти.', 'Dilnoza flipped it. One third is three to a negative power, and with a negative exponent the inequality turns over. The check is easy: put zero, the left side is one, and one is less than nine.'),
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
      id: 'b1', tag: 'same_base', ask: true, cols: 2,
      done: '5',
      prompt: '2ˣ⁻¹ = 16',
      items: [
        { id: 'a', label: '5', correct: true },
        { id: 'b', label: '4', hint: L("To'rt bu ko'rsatkich, iks esa undan bittaga katta.", 'Четыре это показатель, а икс на единицу больше.', 'Four is the exponent, and x is one more.') },
        { id: 'c', label: '3', hint: L("Bir ayirilgan, aslida qo'shilishi kerak edi.", 'Единица вычтена, а надо было прибавить.', 'One was subtracted, but it had to be added.') },
        { id: 'd', label: '8', hint: L("Sakkiz o'n oltining yarmi, javob esa ko'rsatkich haqida.", 'Восемь это половина шестнадцати, а ответ о показателе.', 'Eight is half of sixteen, and the answer is about the exponent.') },
      ],
    },
    {
      id: 'b2', tag: 'equal_roots', ask: true, cols: 2,
      done: L('yechim yo\'q', 'решений нет', 'no solutions'),
      prompt: '√x = −2',
      items: [
        { id: 'a', label: L('yechim yo\'q', 'решений нет', 'no solutions'), correct: true },
        { id: 'b', label: 'x = 4', hint: L("To'rtning ildizi ikki, minus ikki emas.", 'Корень из четырёх два, а не минус два.', 'The root of four is two, not minus two.') },
        { id: 'c', label: 'x = −4', hint: L("Manfiy sondan juft ildiz olinmaydi.", 'Из отрицательного числа чётный корень не извлекают.', 'An even root of a negative number does not exist.') },
        { id: 'd', label: 'x = 2', hint: L("Ikkining ildizi bir butun to'rt, va u manfiy emas.", 'Корень из двух примерно один и четыре, и он не отрицателен.', 'The root of two is about one point four, and it is not negative.') },
      ],
    },
    {
      id: 'b3', tag: 'base_direction', ask: true, cols: 2,
      done: 'x > −3',
      prompt: '0,5ˣ < 8',
      items: [
        { id: 'a', label: 'x > −3', correct: true },
        { id: 'b', label: 'x < −3', hint: L("Minus to'rtni qo'yib ko'ring: o'n olti sakkizdan katta, demak yaramaydi.", 'Подставь минус четыре: шестнадцать больше восьми, значит не годится.', 'Try minus four: sixteen is more than eight, so it fails.') },
        { id: 'c', label: 'x > 3', hint: L("Nolni qo'yib ko'ring: bir sakkizdan kichik, demak nol ham javobga kiradi.", 'Подставь ноль: один меньше восьми, значит ноль тоже входит.', 'Try zero: one is less than eight, so zero is in the answer too.') },
        { id: 'd', label: 'x < 3', hint: L("Yo'nalish ham, ishora ham xato.", 'И направление, и знак неверны.', 'Both the direction and the sign are wrong.') },
      ],
    },
    {
      id: 'b4', tag: 'log_domain', ask: true, cols: 2,
      done: 'x > 3',
      prompt: L('log₅(2x − 6) ODZ si?', 'Область log₅(2x − 6)?', 'The domain of log₅(2x − 6)?'),
      items: [
        { id: 'a', label: 'x > 3', correct: true },
        { id: 'b', label: 'x > 6', hint: L("Ikkiga bo'linmagan: ikki iks oltidan katta bo'lsa, iks uchdan katta.", 'Не поделено на два: если два икс больше шести, икс больше трёх.', 'Not halved: if two x exceeds six, x exceeds three.') },
        { id: 'c', label: 'x ≥ 3', hint: L("Uchda argument nolga teng, va nolning logarifmi yo'q.", 'В трёх аргумент равен нулю, а логарифма нуля нет.', 'At three the argument is zero, and there is no logarithm of zero.') },
        { id: 'd', label: 'x > −3', hint: L("Ishora almashgan: minus olti ko'chirilganda plyus bo'ladi.", 'Знак перепутан: при переносе минус шесть становится плюсом.', 'The sign is confused: moving minus six makes it a plus.') },
      ],
    },
    {
      id: 'b5', tag: 'substitution', ask: true, cols: 2,
      done: 't² − t',
      prompt: L('9ˣ − 3ˣ da t = 3ˣ almashtirish?', 'Замена t = 3ˣ в 9ˣ − 3ˣ?', 'The substitution t = 3ˣ in 9ˣ − 3ˣ?'),
      items: [
        { id: 'a', label: 't² − t', correct: true },
        { id: 'b', label: '3t − t', hint: L("To'qqiz uchning kvadrati, demak to'qqiz daraja iks t ning KVADRATI.", 'Девять это три в квадрате, значит девять в степени икс это КВАДРАТ t.', 'Nine is three squared, so nine to the x is t SQUARED.') },
        { id: 'c', label: 't − t', hint: L("Ikki had bir xil emas: birinchisi kvadrat.", 'Два члена не одинаковы: первый в квадрате.', 'The two terms are not the same: the first is squared.') },
        { id: 'd', label: 't² − 3t', hint: L("Ikkinchi had aynan t ga teng, uchga ko'paytirilmaydi.", 'Второй член равен именно t, на три он не умножается.', 'The second term is exactly t, not multiplied by three.') },
      ],
    },
    {
      id: 'b6', tag: 'intersection', ask: true, cols: 2,
      done: '(2; 7)',
      prompt: L('x > 2 va x < 7 sistemasi?', 'Система x > 2 и x < 7?', 'The system x > 2 and x < 7?'),
      items: [
        { id: 'a', label: '(2; 7)', correct: true },
        { id: 'b', label: L('yechim yo\'q', 'решений нет', 'no solutions'), hint: L("Uchta, to'rtta, beshta -- hammasi ikki shartga ham to'g'ri keladi.", 'Три, четыре, пять — все подходят обоим условиям.', 'Three, four, five all satisfy both conditions.') },
        { id: 'c', label: '(−∞; 2) ∪ (7; +∞)', hint: L("Bu birlashma, sistema esa KESISHMA talab qiladi.", 'Это объединение, а система требует ПЕРЕСЕЧЕНИЯ.', 'That is a union, and a system asks for an INTERSECTION.') },
        { id: 'd', label: '[2; 7]', hint: L("Uchlar kirmaydi: shartlarda qat'iy tengsizlik turadi.", 'Концы не входят: в условиях строгие неравенства.', 'The ends are out: the conditions are strict.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits. Oltita savol, va faqat shu ekran natijaga kiradi.", 'Блиц. Шесть вопросов, и только этот экран идёт в результат.', 'Quick round. Six questions, and only this screen counts.'),
  ],
}

// ============================================================
// SLAYD 13. XATONI TOPING. Tekshiruv o'tkazilmagan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'equal_roots',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Bir satr xato', 'Одна строка неверна', 'One line is wrong'),
  rows: [
    { id: 'r1', text: '√(x + 6) = x' },
    { id: 'r2', text: 'x + 6 = x²' },
    { id: 'r3', text: 'x² − x − 6 = 0' },
    { id: 'r4', text: L('javob: x = 3;  x = −2', 'ответ: x = 3;  x = −2', 'answer: x = 3;  x = −2') },
    { id: 'r5', text: L('tekshiruv: yo\'q', 'проверка: нет', 'check: none') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Kvadratga ko'tarish mumkin, lekin u teng kuchli emas: aynan shu joyda begona ildiz tug'iladi.", 'Возводить в квадрат можно, но это не равносильный переход: именно здесь рождается посторонний корень.', 'Squaring is allowed, but it is not an equivalent step: this is where an extraneous root is born.'),
    r3: L("Kvadrat tenglama to'g'ri yozilgan.", 'Квадратное уравнение записано верно.', 'The quadratic is written right.'),
    r5: L("Bu satr xatoni AYTADI, lekin o'zi xato emas.", 'Эта строка ГОВОРИТ об ошибке, но сама ошибкой не является.', 'This line NAMES the error, but is not the error itself.'),
  },
  proofPoint: L('minus ikki tekshiruvdan o\'tmaydi', 'минус два не проходит проверку', 'minus two fails the check'),
  proof: L(
    "Kvadrat tenglamaning ildizlari haqiqatan uch va minus ikki. Lekin ular ASL tenglamaning ildizi degani emas. Minus ikkini qo'ysak, chapda to'rtning ildizi, ya'ni ikki chiqadi, o'ngda esa minus ikki. Demak javob bitta.",
    'Корни квадратного действительно три и минус два. Но это не значит, что они корни ИСХОДНОГО уравнения. Подставим минус два: слева корень из четырёх, то есть два, а справа минус два. Значит ответ один.',
    'The roots of the quadratic really are three and minus two. But that does not make them roots of the ORIGINAL equation. Put minus two: on the left the root of four, that is two, and on the right minus two. So the answer is one.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('tekshiruv o\'tkazilmagan', 'проверка не сделана', 'the check was skipped'), correct: true },
      { id: 'b', label: L('kvadrat tenglama xato', 'квадратное уравнение неверно', 'the quadratic is wrong'), hint: L("Kvadrat tenglama to'g'ri: iks kvadrat minus iks minus olti.", 'Квадратное верно: икс квадрат минус икс минус шесть.', 'The quadratic is right: x squared minus x minus six.') },
      { id: 'c', label: L('kvadratga ko\'tarish mumkin emas', 'возводить в квадрат нельзя', 'squaring is not allowed'), hint: L("Mumkin, lekin keyin tekshiruv kerak: o'tish teng kuchli emas.", 'Можно, но потом нужна проверка: переход не равносильный.', 'It is allowed, but a check must follow: the step is not equivalent.') },
      { id: 'd', label: L('javob to\'g\'ri', 'ответ верный', 'the answer is right'), hint: L("Javobda ikkita ildiz bor, aslida esa bitta.", 'В ответе два корня, а на самом деле один.', 'The answer has two roots, and in fact there is one.') },
    ],
  },
  audio: [
    A('mount', "Masalalar tugadi. Endi boshqaning yechimiga qaraymiz.", 'Задачи закончились. Теперь посмотрим на чужое решение.', 'The problems are done. Now let us look at someone else solution.'),
    A('q1', "Diqqat: bu yechimda har bir o'tish qoidaga muvofiq. Xato baribir bor.", 'Внимание: в этом решении каждый переход по правилам. Ошибка всё равно есть.', 'Careful: in this solution every step follows a rule. The error is there anyway.'),
    A('proof', "Qarang: kvadratga ko'tarish teng kuchli o'tish emas. U manfiy o'ng tomonni musbat qilib qo'yadi, va shu sababli yangi, begona ildiz paydo bo'ladi. Kvadrat tenglama to'g'ri yechilgan, lekin uning ildizlari faqat NOMZOD. Minus ikkini asl tenglamaga qo'ysak, chapda ikki, o'ngda minus ikki chiqadi, va tenglik buziladi. Shuning uchun bunday o'tishdan keyin tekshiruv yechimning bir qismi.", 'Смотри: возведение в квадрат не равносильный переход. Он делает отрицательную правую часть положительной, и поэтому появляется новый, посторонний корень. Квадратное решено верно, но его корни только КАНДИДАТЫ. Подставим минус два в исходное: слева два, справа минус два, и равенство ломается. Поэтому после такого перехода проверка это часть решения.', 'Look: squaring is not an equivalent step. It turns a negative right side into a positive one, and so a new, extraneous root appears. The quadratic is solved right, but its roots are only CANDIDATES. Put minus two into the original: two on the left, minus two on the right, and the equality breaks. So after such a step the check is part of the solution.'),
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
      prompt: L('1/8 ni 2 asosida yozing', 'Запиши 1/8 по основанию 2', 'Write 1/8 with base 2'),
      template: ['1/8 = 2', { slot: 0 }],
      parts: ['⁻³', '³', '⁻²', '⁻⁸'],
      answer: ['⁻³'],
      doneLabel: '2⁻³',
      wrongs: [
        { key: '³', hint: L("Musbat ko'rsatkich sakkizni beradi, kasr uchun manfiy kerak.", 'Положительный показатель даёт восемь, для дроби нужен отрицательный.', 'A positive exponent gives eight, the fraction needs a negative one.') },
        { key: '⁻²', hint: L("Minus ikki to'rtdan birni beradi.", 'Минус два даёт одну четвёртую.', 'Minus two gives one quarter.') },
        { key: '*', hint: L("Sakkiz ikkining kub darajasi, kasr esa manfiy ko'rsatkich.", 'Восемь это два в кубе, а дробь это отрицательный показатель.', 'Eight is two cubed, and the fraction means a negative exponent.') },
      ],
    },
    {
      prompt: L('√2 ni 2 asosida yozing', 'Запиши √2 по основанию 2', 'Write √2 with base 2'),
      template: ['√2 = 2', { slot: 0 }],
      parts: ['^(1/2)', '²', '^(−1/2)', '^(1/4)'],
      answer: ['^(1/2)'],
      doneLabel: '2^(1/2)',
      wrongs: [
        { key: '²', hint: L("Kvadrat ildizni emas, kvadratni beradi.", 'Квадрат даёт не корень, а квадрат.', 'A square gives a square, not a root.') },
        { key: '^(−1/2)', hint: L("Manfiy ko'rsatkich bir bo'lingan ildizni beradi.", 'Отрицательный показатель даёт единицу делить на корень.', 'A negative exponent gives one over the root.') },
        { key: '*', hint: L("Kvadrat ildiz bu yarim ko'rsatkich.", 'Квадратный корень это показатель одна вторая.', 'A square root is the exponent one half.') },
      ],
    },
  ],
  audio: [
    A('mount', "Xato topildi. Oxirgi topshiriq: sonni bitta asosga keltirish.", 'Ошибка найдена. Последнее задание: привести число к одному основанию.', 'The error is found. The last task: bring a number to one base.'),
    A('built1', "Endi ildiz bilan.", 'Теперь с корнем.', 'Now with a root.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'equal_roots',
  gapMap: true,
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L('Qayerda teshik bor', 'Где дырка', 'Where the gap is'),
  law: L('tekshiruv yechimning qismi', 'проверка это часть решения', 'the check is part of the solution'),
  ruleLines: [
    L("kvadratga ko'tarish begona ildiz beradi", 'возведение в квадрат даёт посторонний корень', 'squaring gives an extraneous root'),
    L("asos birdan kichik bo'lsa yo'nalish almashadi", 'основание меньше единицы меняет направление', 'a base under one flips the direction'),
    L('logarifmda ikki shart birga ishlaydi', 'в логарифме два условия работают вместе', 'in a logarithm two conditions work together'),
  ],
  predicts: [
    {
      screen: 0,
      expr: '√(x + 6) = x',
      right: L('bitta', 'один', 'one'),
      map: {
        a: L('bitta', 'один', 'one'),
        b: L('ikkita', 'два', 'two'),
        c: L('bitta ham yo\'q', 'ни одного', 'none'),
        d: L('uchta', 'три', 'three'),
      },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: L('3 va −2 → tekshiruv → 3', '3 и −2 → проверка → 3', '3 and −2 → the check → 3'),
  },
  levels: {
    full: L('Bu blok DTM da siz uchun yopildi', 'Этот блок на ДТМ у тебя закрыт', 'This block is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Xaritada ko\'rsatilgan darslarga qayting', 'Вернись к урокам, указанным в карте', 'Go back to the lessons named in the map'),
  },
  probe: {
    question: L(
      'Tekshiruv qachon MAJBURIY?',
      'Когда проверка ОБЯЗАТЕЛЬНА?',
      'When is a check MANDATORY?',
    ),
    items: [
      { id: 'a', label: L('teng kuchli bo\'lmagan o\'tishdan keyin', 'после неравносильного перехода', 'after a step that is not equivalent'), correct: true },
      { id: 'b', label: L('har doim', 'всегда', 'always'), hint: L("Yomon emas, lekin savol boshqacha: qachon uni TASHLAB KETISH mumkin emas.", 'Не плохо, но вопрос в другом: когда её нельзя ПРОПУСТИТЬ.', 'Not a bad habit, but the question is when it cannot be SKIPPED.') },
      { id: 'c', label: L('hech qachon', 'никогда', 'never'), hint: L("Bu darsda tekshiruv begona ildizni ushladi.", 'На этом уроке проверка поймала посторонний корень.', 'In this lesson the check caught an extraneous root.') },
      { id: 'd', label: L('faqat logarifmda', 'только в логарифме', 'only in a logarithm'), hint: L("Kvadratga ko'tarishda logarifm yo'q edi, tekshiruv esa kerak bo'ldi.", 'При возведении в квадрат логарифма не было, а проверка понадобилась.', 'There was no logarithm in the squaring, and a check was still needed.') },
    ],
  },
  sheetTitle: L('Tenglama va tengsizlik · shpargalka', 'Уравнения и неравенства · шпаргалка', 'Equations and inequalities · cheat sheet'),
  sheetSrc: L('11-sinf · 47-dars', '11 класс · урок 47', 'Grade 11 · lesson 47'),
  lifehack: L(
    "Kvadratga ko'targan bo'lsangiz, javobni asl yozuvga qo'yib ko'ring.",
    'Если возводил в квадрат, подставь ответ в исходную запись.',
    'If you squared, put the answer back into the original record.',
  ),
  holds: [3200, 5500, 6500],
  audio: [
    A('mount', "Sinov tugadi. Natijaga qaraymiz.", 'Проверка закончена. Смотрим результат.', 'The check is over. Let us look at the result.'),
    A('p1', "Mana taxminingiz va mana javob. Ildiz bitta, chunki minus ikki tekshiruvdan o'tmadi.", 'Вот твоя догадка и вот ответ. Корень один, потому что минус два не прошёл проверку.', 'Here is your guess and here is the answer. There is one root, because minus two failed the check.'),
    A('rule', "O'ng tomonda kamchiliklar xaritasi. Uchta narsa esa har imtihonda uchraydi. Birinchisi: kvadratga ko'tarish teng kuchli o'tish emas, shuning uchun undan keyin tekshiruv majburiy. Ikkinchisi: asos birdan kichik bo'lsa tengsizlikning yo'nalishi almashadi. Uchinchisi: logarifmda argument sharti va tengsizlikning o'zi birga ishlaydi, va javob ularning kesishmasi.", 'Справа карта пробелов. А три вещи встречаются на каждом экзамене. Первая: возведение в квадрат не равносильный переход, поэтому после него проверка обязательна. Вторая: если основание меньше единицы, направление неравенства меняется. Третья: в логарифме условие на аргумент и само неравенство работают вместе, и ответ это их пересечение.', 'On the right is your gap map. And three things appear in every exam. First: squaring is not an equivalent step, so a check must follow. Second: a base under one flips the direction of an inequality. Third: in a logarithm the condition on the argument and the inequality itself work together, and the answer is their intersection.'),
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
