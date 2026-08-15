// ============================================================================
// 11-sinf, Dars 10. KO'RSATKICHLI TENGSIZLIKLAR.  (Показательные неравенства)
//
// B2 blokining ikkinchi darsi. Faqat MA'LUMOT: ekran tanasi `screens.jsx` da,
// mexanika `tools.jsx` da, infratuzilma `core.jsx` da.
//   raskadrovka: src/books/grade11/DARS10_SKELET.md
//   kontrakt:    src/books/grade11/ETALON_11SINF.md
//
// Etalondan (12-dars) farqi NOL ekran: rollar ham, tartib ham aynan o'sha.
// Sababi oddiy -- 12-dars logarifmik tengsizliklar, bu esa ko'rsatkichli, ya'ni
// ASOS haqidagi o'sha hikoya, faqat ikki dars oldinroq va ARGUMENTGA SHARTSIZ.
//
// Darsning o'zagi: javob ORALIQ, va ishorani asos hal qiladi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_10',
  title: L('Ko\'rsatkichli tengsizliklar', 'Показательные неравенства', 'Exponential inequalities'),
}

const BLOCK = { label: 'B2', from: 9, to: 14, current: 10 }

// Son o'qlari.
const AXIS_1 = { min: 0, max: 12, ticks: [{ v: 5 }, { v: 6 }, { v: 7 }] }
const AXIS_2 = { min: -8, max: 9, ticks: [{ v: -4 }, { v: 0 }, { v: 5 }] }
const AXIS_3 = { min: -2, max: 6, ticks: [{ v: 2 }] }
const AXIS_4 = { min: 0, max: 8, ticks: [{ v: 3 }] }

const EQ_HOOK = '(0,5)ˣ < 1/64'
const EQ_RULE = '4ˣ ≥ 64'
const EQ_NEW = '0,4ˣ²⁻ˣ⁻²⁰ > 1'

// ============================================================
// SLAYD 1. XUK. Ikki javob, umumiy soni yo'q.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Ko\'rsatkichli tengsizliklar', 'Показательные неравенства', 'Exponential inequalities'),
  title: L('Ikki javob. Kim haq?', 'Два ответа. Кто прав?', 'Two answers. Who is right?'),
  expr: EQ_HOOK,
  axis: AXIS_1,
  rows: [
    {
      id: 'a',
      name: L('birinchi yechim', 'первое решение', 'first solution'),
      value: '(6; +∞)',
      set: { from: 6, to: null, tone: 'ink' },
    },
    {
      id: 'b',
      name: L('ikkinchi yechim', 'второе решение', 'second solution'),
      value: '(−∞; 6)',
      set: { from: null, to: 6, tone: 'tip' },
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi uni nuqta bilan tekshiramiz.",
      'Твой ответ записан. Сейчас проверим его точкой.',
      'Your answer is saved. Now we will check it with a point.',
    ),
    items: [
      { id: 'a', label: L('birinchi', 'первое', 'the first') },
      { id: 'b', label: L('ikkinchi', 'второе', 'the second') },
      { id: 'both', label: L('ikkisi ham', 'оба', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни один', 'neither') },
    ],
  },
  holds: [4500, 3000, 6500, 4000],
  audio: [
    A('mount', 'Ikki kishi bitta tengsizlikni yechdi va turli javob oldi.', 'Двое решили одно и то же неравенство и получили разные ответы.', 'Two students solved the same inequality and got different answers.'),
    A('r1', "Birinchi javob: oltidan o'ngdagi hamma sonlar.", 'Первый ответ: все числа правее шестёрки.', 'The first answer: all numbers to the right of six.'),
    A('r2', "Ikkinchi javob: oltidan chapdagi hamma sonlar. Qarang, ikkala javobda birorta ham umumiy son yo'q.", 'Второй ответ: все числа левее шестёрки. Смотри, у этих двух ответов нет ни одного общего числа.', 'The second answer: all numbers to the left of six. Look, these two answers have not a single number in common.'),
    A('ask', "Sizningcha qaysi javob to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какой ответ верный? Пока просто предположи.', 'Which answer do you think is correct? Just make a guess for now.'),
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
    "Bahsni hal qilishdan oldin uch narsani eslab olamiz. Ularsiz javobni tekshirib bo'lmaydi. Bu baholanmaydi.",
    'Прежде чем решать спор, вспомним три вещи. Без них ответ не проверить. Это не оценивается.',
    'Before settling the argument, let us recall three things. Without them the answer cannot be checked. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Bitta son — turli asoslar', 'Одно число — разные основания', 'One number, different bases'),
      short: L('turli asoslar', 'разные основания', 'different bases'),
      ex: [
        { e: '64 = 2⁶', why: '2 · 2 · 2 · 2 · 2 · 2' },
        { e: '81 = 3⁴', why: '3 · 3 · 3 · 3' },
      ],
    },
    {
      id: 'c2',
      title: L('Kasr asos — manfiy ko\'rsatkich', 'Дробное основание — отрицательный показатель', 'A fractional base is a negative exponent'),
      short: L('kasr asos', 'дробное основание', 'a fractional base'),
      ex: [
        { e: '0,5 = 2⁻¹', why: '1 : 2 = 0,5' },
        { e: '1/64 = 2⁻⁶', why: L('bir bo\'linadi 2⁶ ga', 'единица делится на 2⁶', 'one divided by 2⁶') },
      ],
    },
    {
      // Darsning O'ZAGI: yo'nalish.
      id: 'c3',
      title: L('Asos yo\'nalishni belgilaydi', 'Основание задаёт направление', 'The base sets the direction'),
      short: L('asos yo\'nalishni belgilaydi', 'основание задаёт направление', 'the base sets the direction'),
      ex: [
        { e: '2¹ = 2  →  2³ = 8', why: L("ko'rsatkich o'sdi — qiymat ham o'sdi", 'показатель вырос — и значение выросло', 'the exponent grew, so did the value') },
        { e: '(0,5)¹ = 0,5  →  (0,5)³ = 0,125', why: L("ko'rsatkich o'sdi — qiymat KAMAYDI", 'показатель вырос — а значение УПАЛО', 'the exponent grew, the value FELL') },
      ],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L('64 = 2 ning qaysi darajasi?', '64 = 2 в какой степени?', '64 = 2 to what power?'),
      cols: 4,
      items: [
        { id: 'a', label: '6', correct: true },
        { id: 'b', label: '5', hint: L("Ikkining beshinchi darajasi o'ttiz ikki.", 'Два в пятой это тридцать два.', 'Two to the fifth is thirty two.') },
        { id: 'c', label: '8', hint: L("Ikkining sakkizinchi darajasi ikki yuz ellik olti.", 'Два в восьмой это двести пятьдесят шесть.', 'Two to the eighth is two hundred fifty six.') },
        { id: 'd', label: '32', hint: L("O'ttiz ikki bu natija, ko'rsatkich emas.", 'Тридцать два это результат, а не показатель.', 'Thirty two is the result, not the exponent.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L('0,5 ni daraja ko\'rinishida yozing', 'Запиши 0,5 в виде степени двойки', 'Write 0,5 as a power of two'),
      cols: 4,
      items: [
        { id: 'a', label: '2⁻¹', correct: true },
        { id: 'b', label: '2¹', hint: L("Ikkining birinchi darajasi ikki, nol butun besh emas.", 'Два в первой это два, а не нуль целых пять.', 'Two to the first is two, not zero point five.') },
        { id: 'c', label: '2⁰', hint: L('Nolinchi daraja birga teng.', 'Нулевая степень равна единице.', 'The zero power equals one.') },
        { id: 'd', label: '2⁻²', hint: L("Ikkining minus ikkinchi darajasi bir chorak.", 'Два в минус второй это одна четвёртая.', 'Two to the power minus two is one quarter.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L("(0,5)³ va (0,5)⁵ dan qaysi biri katta?", 'Что больше: (0,5)³ или (0,5)⁵ ?', 'Which is greater, (0,5)³ or (0,5)⁵ ?'),
      cols: 2,
      items: [
        { id: 'a', label: '(0,5)³', correct: true },
        { id: 'b', label: '(0,5)⁵', hint: L("Asos birdan kichik: ko'rsatkich o'ssa, qiymat kamayadi.", 'Основание меньше единицы: чем больше показатель, тем меньше значение.', 'The base is less than one: the bigger the exponent, the smaller the value.') },
        { id: 'c', label: L('teng', 'равны', 'they are equal'), hint: L("Ko'rsatkichlar turlicha, demak qiymatlar ham turlicha.", 'Показатели разные, значит и значения разные.', 'The exponents differ, so the values differ.') },
        { id: 'd', label: L("solishtirib bo'lmaydi", 'нельзя сравнить', 'cannot be compared'), hint: L('Mumkin: ikkisini hisoblang, bir sakkizdan va bir o\'ttiz ikkidan.', 'Можно: посчитай оба, одна восьмая и одна тридцать вторая.', 'You can: compute both, one eighth and one thirty second.') },
      ],
    },
  ],
  holds: [4500, 9000, 9000, 10000, 6500, 6000],
  audio: [
    A('mount', 'Bahsni hal qilishdan oldin uch narsani tiklaymiz. Bu baho emas.', 'Прежде чем решать спор, восстановим три вещи. Это не оценка.', 'Before we settle the argument, let us restore three things. This is not graded.'),
    A('c1', "Birinchi tayanch. Oltmish to'rt bu ikkining oltinchi darajasi, sakson bir bu uchning to'rtinchi darajasi. Bitta sonni turli asoslar bilan yozish mumkin.", 'Первая опора. Шестьдесят четыре это два в шестой, восемьдесят один это три в четвёртой. Одно и то же число можно записать разными основаниями.', 'First basic. Sixty four is two to the sixth, eighty one is three to the fourth. The same number can be written with different bases.'),
    A('c2', "Ikkinchi tayanch. Kasr asos bu manfiy ko'rsatkich. Nol butun besh bu ikkining minus birinchi darajasi, bir oltmish to'rtdan esa ikkining minus oltinchi darajasi.", 'Вторая опора. Дробное основание это отрицательный показатель. Нуль целых пять это два в минус первой, а одна шестьдесят четвёртая это два в минус шестой.', 'Second basic. A fractional base is a negative exponent. Zero point five is two to the power minus one, and one sixty fourth is two to the power minus six.'),
    A('c3', "Uchinchi tayanch, va bugun eng muhimi. Asos ikki bo'lganda ko'rsatkich o'sdi va qiymat ham o'sdi. Asos nol butun besh bo'lganda ko'rsatkich o'sdi, qiymat esa kamaydi. Yo'nalishni ASOS belgilaydi.", 'Третья опора, и сегодня она главная. При основании два показатель вырос, и значение выросло. При основании нуль целых пять показатель вырос, а значение упало. Направление задаёт ОСНОВАНИЕ.', 'Third basic, and today the main one. With base two the exponent grew and the value grew. With base zero point five the exponent grew but the value fell. The direction is set by the BASE.'),
    A('recap', "Qisqacha: bitta son turli asoslar bilan, kasr asos manfiy ko'rsatkich, va yo'nalishni asos belgilaydi.", 'Коротко: одно число разными основаниями, дробное основание это минус в показателе, и направление задаёт основание.', 'Briefly: one number with different bases, a fractional base is a minus in the exponent, and the base sets the direction.'),
    A('tasks', "Endi tayanchlarni bitta tugmaga yig'aman. Endi uchta qisqa topshiriq.", 'Теперь я сворачиваю опоры в одну кнопку. Теперь три коротких задания.', 'Now I am folding the basics into one button. Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. Bahsni NUQTA hal qiladi. Uchinchi nuqta -- CHEGARA.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'check_by_point',
  eyebrow: L('Nuqta bilan tekshiramiz', 'Проверим точкой', 'Let us check with a point'),
  title: L('Bahsni nuqta hal qiladi', 'Спор решает точка', 'A point settles it'),
  expr: EQ_HOOK,
  goal: L('chap tomon 1/64 dan KICHIK', 'слева МЕНЬШЕ 1/64', 'the left side is LESS than 1/64'),
  rule: L(
    "Yechim bo'lgan son to'g'ri javobning ICHIDA yotishi shart. Ikki javobni ajratadigan sonni izlaymiz.",
    'Число-решение обязано лежать ВНУТРИ верного ответа. Ищем число, которое разводит эти два ответа.',
    'A number that is a solution must lie INSIDE the correct answer. We are looking for a number that separates these two answers.',
  ),
  pick: L('Qaysi nuqtani olamiz?', 'Какую точку взять?', 'Which point shall we take?'),
  claims: [
    { id: 'a', key: 'inA', name: L('birinchi yechim', 'первое решение', 'first solution'), value: '(6; +∞)' },
    { id: 'b', key: 'inB', name: L('ikkinchi yechim', 'второе решение', 'second solution'), value: '(−∞; 6)' },
  ],
  axis: AXIS_1,
  sets: [{ from: 6, to: null, tone: 'graph' }, { from: null, to: 6, tone: 'tip' }],
  points: [
    {
      id: 'p7', label: 'x = 7', num: '7', mark: 7, step: 'calc', verdict: 'in',
      role: L("oltidan o'ngda", 'правее шестёрки', 'right of six'),
      calc: L('(0,5)⁷ = 1/128,  va 1/128 < 1/64', '(0,5)⁷ = 1/128,  и 1/128 < 1/64', '(0,5)⁷ = 1/128,  and 1/128 < 1/64'),
      sol: true, inA: true, inB: false,
    },
    {
      id: 'p5', label: 'x = 5', num: '5', mark: 5, step: 'calc', verdict: 'out',
      role: L('oltidan chapda', 'левее шестёрки', 'left of six'),
      calc: L('(0,5)⁵ = 1/32,  lekin 1/32 > 1/64', '(0,5)⁵ = 1/32,  но 1/32 > 1/64', '(0,5)⁵ = 1/32,  but 1/32 > 1/64'),
      sol: false, inA: false, inB: true,
    },
    {
      id: 'p6', label: 'x = 6', num: '6', mark: 6, step: 'calc', verdict: 'out',
      role: L('chegaraning o\'zi', 'сама граница', 'the boundary itself'),
      calc: L('(0,5)⁶ = 1/64,  teng, kichik emas', '(0,5)⁶ = 1/64,  равно, а не меньше', '(0,5)⁶ = 1/64,  equal, not less'),
      sol: false, inA: false, inB: false,
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    items: [
      {
        id: 'a', label: '(6; +∞)', correct: true,
        ok: L("To'g'ri. Yettilik bir javobga kiradi, ikkinchisiga kirmaydi. Tekshirish usuli aynan shu.", 'Верно. Семёрка проходит по одному ответу и не проходит по другому. Это и есть способ проверки.', 'Correct. Seven fits one answer and fails the other. That is the way to check.'),
      },
      {
        id: 'b', label: '(−∞; 6)',
        hint: L("Yettini oling. Chapda bir bir yuz yigirma sakkizdan chiqadi, va bu bir oltmish to'rtdan kichik. Demak yetti yechim, bu javobga esa u kirmaydi.", 'Возьми семёрку. Слева получается одна сто двадцать восьмая, и это меньше одной шестьдесят четвёртой. Значит семёрка решение, а в этот ответ она не входит.', 'Take seven. On the left you get one one hundred twenty eighth, and that is less than one sixty fourth. So seven is a solution, yet this answer does not contain it.'),
      },
    ],
  },
  holds: [2500, 6500, 6500, 2500, 14000, 4500],
  audio: [
    A('mount', 'Tayanch tiklandi. Bahsga qaytamiz.', 'Опора восстановлена. Вернёмся к спору.', 'The basics are back. Let us return to the argument.'),
    A('mount', "Bahs bahs bilan emas, son bilan hal qilinadi. Agar son yechim bo'lsa, u to'g'ri javobning ichida yotishi shart.", 'Спор решается не спором, а числом. Если число решение, оно обязано лежать внутри верного ответа.', 'An argument is settled by a number. If a number is a solution, it must lie inside the correct answer.'),
    A('mount', "Nuqtani tanlang. Uni boshlang'ich tengsizlikka qo'yamiz va chap tomonni bir oltmish to'rtdan bilan solishtiramiz.", 'Выбери число. Мы подставим его в исходное неравенство и сравним левую часть с одной шестьдесят четвёртой.', 'Pick a number. We will substitute it into the original inequality and compare the left side with one sixty fourth.'),
    A('calc', 'Hisoblaymiz va solishtiramiz.', 'Считаем и сравниваем.', 'We compute and compare.'),
    A('mark', "Uch nuqta tekshirildi. Yetti yechim, va u faqat birinchi javobda bor. Besh yechim emas, u esa faqat ikkinchisida. Va oltining o'zi: chapda aynan bir oltmish to'rtdan chiqadi, ishora esa qat'iy, demak chegara javobga KIRMAYDI.", 'Три числа проверены. Семёрка решение, и она есть только в первом ответе. Пятёрка не решение, а она есть только во втором. И сама шестёрка: слева получается ровно одна шестьдесят четвёртая, а знак строгий, значит граница в ответ НЕ входит.', 'Three numbers checked. Seven is a solution and it is only in the first answer. Five is not a solution and it is only in the second. And six itself: the left side gives exactly one sixty fourth, and the sign is strict, so the boundary is NOT in the answer.'),
    A('next', 'Bitta son ikki javobni ajratdi. Qaysi biri to\'g\'ri?', 'Одно число развело два ответа. Какой из них верный?', 'One number separated the two answers. Which of them is correct?'),
  ],
}

// ============================================================
// SLAYD 4. GRAFIK: kamayuvchi chiziqda «kichikroq» degani «o'ngroq».
// ============================================================
const HALF_POW = (x) => Math.pow(0.5, x)

const S4 = {
  role: 'graph',
  tag: 'base_direction',
  drag: false,
  eyebrow: L('Bu tengsizlik qayerda yashaydi', 'Где живёт это неравенство', 'Where this inequality lives'),
  title: L('Kamayuvchi chiziq', 'Убывающая кривая', 'A decreasing curve'),
  chip: 'y = (0,5)ˣ',
  graph: {
    fn: HALF_POW,
    xDomain: [2, 10],
    yDomain: [-0.02, 0.22],
    hline: 1 / 64,
    cross: 6,
    drop: true,
    dropLabel: 'x = 6',
    shade: { from: 6, to: 10 },
    shadeLabel: '(6; +∞)',
    xTicks: [{ v: 4 }, { v: 6 }, { v: 8 }],
    yTicks: [{ v: 0 }, { v: 1 / 64, label: '1/64' }],
    height: 168,
  },
  bonus: L(
    "Yarim yemirilish davri shunday ishlaydi: har qadamda modda ikki barobar kamayadi, nolga esa hech qachon yetmaydi.",
    'Так работает период полураспада: на каждом шаге вещества вдвое меньше, а нуля оно не достигает никогда.',
    'This is how a half-life works: at every step there is half as much substance, and it never reaches zero.',
  ),
  probe: {
    question: L("Nega yechimlar oltidan O'NGDA?", 'Почему решения ПРАВЕЕ шестёрки?', 'Why are the solutions to the RIGHT of six?'),
    items: [
      { id: 'a', label: L('chiziq kamayadi: o\'ngga ketsak, qiymat kichrayadi', 'кривая убывает: правее значение меньше', 'the curve decreases: further right the value is smaller'), correct: true },
      { id: 'b', label: L("chunki ishora kichik", 'потому что знак меньше', 'because the sign is less-than'), hint: L("Ishora bir xil bo'lganda ham, asos ikki bo'lsa javob chapda bo'lardi. Chiziqqa qarang.", 'При том же знаке, но с основанием два, ответ был бы слева. Смотри на кривую.', 'With the same sign but base two the answer would be on the left. Look at the curve.') },
      { id: 'c', label: L("chunki 1/64 kichik son", 'потому что 1/64 маленькое число', 'because 1/64 is a small number'), hint: L("Sonning kichikligi emas, chiziqning yo'nalishi hal qiladi.", 'Решает не малость числа, а направление кривой.', 'It is not the smallness of the number that decides, but the direction of the curve.') },
      { id: 'd', label: L('chunki 0,5 musbat', 'потому что 0,5 положительно', 'because 0,5 is positive'), hint: L("Asos har doim musbat. Muhimi u birdan katta yoki kichikligi.", 'Основание всегда положительно. Важно, больше оно единицы или меньше.', 'The base is always positive. What matters is whether it is greater or less than one.') },
    ],
  },
  holds: [5000, 6000, 6000, 4000, 7000],
  audio: [
    A('mount', "Nuqta qaysi javob to'g'ri ekanini ko'rsatdi. Endi nega shundayligini ko'ramiz.", 'Точка показала, какой ответ верный. Теперь посмотрим, почему так.', 'The point showed which answer is correct. Now let us see why.'),
    A('curve', "Mana chiziq, nol butun beshning iks darajasi. U pastga ketadi: o'ngga qarab qiymat kichrayadi.", 'Вот кривая, нуль целых пять в степени икс. Она идёт вниз: чем правее, тем значение меньше.', 'Here is the curve, zero point five to the power x. It goes down: the further right, the smaller the value.'),
    A('line', "Endi bir oltmish to'rtdan balandligida to'g'ri chiziq. U chiziqni oltida kesib o'tadi.", 'Теперь прямая на высоте одна шестьдесят четвёртая. Она пересекает кривую в шестёрке.', 'Now a line at height one sixty fourth. It crosses the curve at six.'),
    A('drop', "Kesishishning o'qdagi soyasi bu olti. Chegara shu yerda.", 'Тень пересечения на оси это шестёрка. Граница здесь.', 'The shadow of the intersection on the axis is six. The boundary is here.'),
    A('shade', "Bizga chiziq to'g'ri chiziqdan PAST bo'lgan joy kerak. Kamayuvchi chiziqda bu joy O'NGDA. Mana butun javob: oltidan cheksizlikkacha.", 'Нам нужно, где кривая НИЖЕ прямой. У убывающей кривой это место СПРАВА. Вот и весь ответ: от шести до бесконечности.', 'We need where the curve is BELOW the line. On a decreasing curve that place is to the RIGHT. And that is the whole answer: from six to infinity.'),
  ],
}

// ============================================================
// SLAYD 5. 1-QOIDA: asos birdan katta.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'same_base',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Asos birdan katta', 'Основание больше единицы', 'Base greater than one'),
  rows: [EQ_RULE, '64 = 4³', '4ˣ ≥ 4³'],
  probe: {
    question: L(
      "Asos 4 birdan katta, funksiya o'sadi. Ko'rsatkichlar uchun nima to'g'ri?",
      'Основание 4 больше единицы, функция возрастает. Что тогда верно для показателей?',
      'The base 4 is greater than one, the function increases. What is then true for the exponents?',
    ),
    items: [
      { id: 'a', label: L("ishora o'zgarmaydi: x ≥ 3", 'знак тот же: x ≥ 3', 'the sign stays: x ≥ 3'), correct: true },
      { id: 'b', label: L('ishora o\'zgaradi: x ≤ 3', 'знак меняется: x ≤ 3', 'the sign flips: x ≤ 3'), hint: L("Bu kamayuvchi funksiya uchun. Asos to'rt birdan katta, chiziq yuqoriga ketadi.", 'Это для убывающей функции. Основание четыре больше единицы, кривая идёт вверх.', 'That is for a decreasing function. The base four is greater than one, the curve goes up.') },
      { id: 'c', label: L("ko'rsatkichlarni solishtirib bo'lmaydi", 'показатели сравнить нельзя', 'the exponents cannot be compared'), hint: L('Mumkin: funksiya monoton.', 'Можно: функция монотонна.', 'You can: the function is monotone.') },
      { id: 'd', label: L("ko'rsatkichlar teng", 'показатели равны', 'the exponents are equal'), hint: L("Tenglik yo'q, tengsizlik bor.", 'Равенства нет, есть неравенство.', 'There is no equality here, there is an inequality.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Asos birdan katta', 'Правило 1. Основание больше единицы', 'Rule 1. Base greater than one'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'a > 1:   aᶠ > aᵍ  ⟺  f > g',
    lines: [
      L('ikki tomonni bitta asosga keltir', 'приведи обе части к одному основанию', 'bring both sides to one base'),
      L("a > 1: funksiya o'sadi — ishora o'sha qoladi", 'a > 1: функция возрастает — знак остаётся тем же', 'a > 1: the function increases — the sign stays'),
      L('qat\'iy ishora qat\'iy qoladi, tengli ishora tengli', 'строгий знак остаётся строгим, нестрогий нестрогим', 'a strict sign stays strict, a non-strict one stays non-strict'),
    ],
    example: L('misol:  4ˣ ≥ 64  →  [3; +∞)', 'пример:  4ˣ ≥ 64  →  [3; +∞)', 'example:  4ˣ ≥ 64  →  [3; +∞)'),
  },
  holds: [4000, 5000, 4500],
  audio: [
    A('mount', "Rasmni ko'rdik. Endi yozuv bilan olamiz, va eng oson holatdan boshlaymiz.", 'Картинку мы увидели. Теперь получим то же записью, и начнём с самого лёгкого случая.', 'We have seen the picture. Now let us do it in writing, starting with the easiest case.'),
    A('toBase', "Chapda asos to'rt, o'ngda oltmish to'rt. Oltmish to'rt bu to'rtning kubi.", 'Слева основание четыре, справа шестьдесят четыре. Шестьдесят четыре это четыре в кубе.', 'On the left the base is four, on the right sixty four. Sixty four is four cubed.'),
    A('same', "Endi ikki tomonda ham to'rt. Asos birdan katta, chiziq yuqoriga ketadi.", 'Теперь с обеих сторон четвёрка. Основание больше единицы, кривая идёт вверх.', 'Now four on both sides. The base is greater than one, the curve goes up.'),
    A('rule', "To'g'ri. Chiziq yuqoriga ketsa, kattaroq qiymatga kattaroq ko'rsatkich to'g'ri keladi, demak ishora o'zgarmaydi.", 'Верно. Если кривая идёт вверх, большему значению отвечает больший показатель, значит знак не меняется.', 'Correct. If the curve goes up, a bigger value has a bigger exponent, so the sign does not change.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: o'ngda BIR, ko'rsatkichda kvadrat.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'base_direction',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('O\'ngda bir', 'Справа единица', 'One on the right'),
  was: { label: UI.was, expr: EQ_RULE },
  now: { label: UI.now, expr: EQ_NEW },
  probe1: {
    question: L('Ikkinchi yozuv birinchisidan nimasi bilan farq qiladi?', 'Чем вторая запись отличается от первой?', 'How does the second record differ from the first?'),
    items: [
      { id: 'a', label: L("asos birdan kichik, o'ngda esa bir", 'основание меньше единицы, а справа единица', 'the base is less than one, and the right side is one'), correct: true },
      { id: 'b', label: L('ko\'rsatkichda kvadrat bor', 'в показателе квадрат', 'there is a square in the exponent'), hint: L("Kvadrat bor, lekin u ishorani hal qilmaydi. Asosga qarang.", 'Квадрат есть, но он не решает знак. Смотри на основание.', 'There is a square, but it does not decide the sign. Look at the base.') },
      { id: 'c', label: L('ishora boshqa', 'знак другой', 'the sign is different'), hint: L("Ishora har qanday bo'lishi mumkin edi. Muhimi asos.", 'Знак мог быть любым. Важно основание.', 'The sign could have been anything. The base is what matters.') },
      { id: 'd', label: L("o'ngda daraja yo'q", 'справа нет степени', 'there is no power on the right'), hint: L("Bor: bir bu nol butun to'rtning nolinchi darajasi.", 'Есть: единица это нуль целых четыре в нулевой степени.', 'There is: one is zero point four to the power zero.') },
    ],
  },
  probe2: {
    question: L('Nima chiqadi?', 'Что получится?', 'What will come out?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '(−4; 5)' },
      { id: 'b', label: '(−∞; −4)' },
      { id: 'c', label: '(5; +∞)' },
      { id: 'd', label: L('yechim yo\'q', 'решений нет', 'no solutions') },
    ],
  },
  holds: [3000, 8000, 3500, 3500],
  audio: [
    A('mount', "Birinchi qoida tayyor. Endi qiyinroq holat.", 'Первое правило готово. Теперь случай потруднее.', 'The first rule is ready. Now a harder case.'),
    A('now', "Asos nol butun to'rt, ya'ni birdan kichik. O'ngda esa bir. Bir bu istalgan asosning nolinchi darajasi.", 'Основание нуль целых четыре, то есть меньше единицы. А справа единица. Единица это любое основание в нулевой степени.', 'The base is zero point four, that is less than one. And on the right there is one. One is any base to the power zero.'),
    A('q1', 'Bu yozuv oldingisidan nimasi bilan farq qiladi?', 'Чем эта запись отличается от прежней?', 'How does this record differ from the previous one?'),
    A('q2', 'Sizningcha nima chiqadi? Shunchaki taxmin qiling.', 'Как думаешь, что получится? Просто предположи.', 'What do you think will come out? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NUQTA. Javobni o'quvchi O'ZI yozadi.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'base_direction',
  eyebrow: L('Nuqtalar bilan tekshiramiz', 'Проверим точками', 'Let us check with points'),
  title: L('Ikki nuqta — ikki javob', 'Две точки — два ответа', 'Two points, two answers'),
  expr: '0,4ˣ²⁻ˣ⁻²⁰ > 1,      1 = 0,4⁰',
  axis: AXIS_2,
  need: '> 1',
  answerLabel: 'A',
  cards: [
    {
      tag: UI.answerA,
      set: { from: -4, to: 5, tone: 'graph' },
      txt: '(−4; 5)',
      mark: 0,
      point: {
        label: 'x = 0',
        calc: L("ko'rsatkich −20, kasr manfiy darajada — birdan KATTA", 'показатель −20, дробь в минус степени — БОЛЬШЕ единицы', 'exponent −20, a fraction to a negative power is GREATER than one'),
        verdict: 'in',
      },
    },
    {
      tag: UI.answerB,
      set: { from: 5, to: null, tone: 'tip' },
      txt: '(5; +∞)',
      mark: 6,
      point: {
        label: 'x = 6',
        calc: L("ko'rsatkich 10, kasr musbat darajada — birdan KICHIK", 'показатель 10, дробь в плюс степени — МЕНЬШЕ единицы', 'exponent 10, a fraction to a positive power is LESS than one'),
        verdict: 'out',
      },
    },
  ],
  answer: {
    numbers: ['−4', '0', '5', '+∞'],
    value: ['−4', '5'],
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '5|+∞', hint: L("x = 6 ni qo'ying: ko'rsatkich o'n, va kasr musbat darajada birdan kichik. Demak oltilik yechim emas.", 'Подставь x = 6: показатель десять, а дробь в положительной степени меньше единицы. Значит шестёрка не решение.', 'Substitute x = 6: the exponent is ten, and a fraction to a positive power is less than one. So six is not a solution.') },
      { key: '*', hint: L("Nolni tekshiring: u javobga kirishi kerak. Oltini tekshiring: u kirmasligi kerak.", 'Проверь ноль: он должен входить. Проверь шестёрку: она входить не должна.', 'Check zero: it must be in. Check six: it must not be.') },
    ],
  },
  holds: [3000, 8000, 6500, 5000],
  audio: [
    A('mount', 'Siz javobni taxmin qildingiz. Uni nuqtalar bilan tekshiramiz.', 'Прогноз есть. Проверим его точками.', 'You made a guess. Let us check it with points.'),
    A('p1', "Nolni olamiz. Ko'rsatkich minus yigirma bo'ladi. Kasr manfiy darajada birdan katta chiqadi, demak nol yechim.", 'Берём ноль. Показатель получается минус двадцать. Дробь в отрицательной степени больше единицы, значит ноль решение.', 'Take zero. The exponent becomes minus twenty. A fraction to a negative power is greater than one, so zero is a solution.'),
    A('p2', "Endi oltini. Ko'rsatkich o'n bo'ladi. Kasr musbat darajada birdan kichik, demak olti yechim emas.", 'Теперь шестёрку. Показатель получается десять. Дробь в положительной степени меньше единицы, значит шестёрка не решение.', 'Now six. The exponent becomes ten. A fraction to a positive power is less than one, so six is not a solution.'),
    A('write', "Demak bizga ko'rsatkich MANFIY bo'lgan joy kerak. Javobni o'zingiz yozing.", 'Значит нам нужно там, где показатель ОТРИЦАТЕЛЬНЫЙ. Запиши ответ сам.', 'So we need where the exponent is NEGATIVE. Write the answer yourself.'),
  ],
}

// ============================================================
// SLAYD 8. 2-QOIDA va BITTA JAMLANMA.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'base_direction',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Bitta qoida', 'Одно правило', 'One rule'),
  cases: [
    {
      label: L("a > 1 · o'sadi", 'a > 1 · возрастает', 'a > 1 · increasing'),
      text: L("ishora o'zgarmaydi", 'знак тот же', 'the sign stays'),
      tone: 'graph',
    },
    {
      label: L('0 < a < 1 · kamayadi', '0 < a < 1 · убывает', '0 < a < 1 · decreasing'),
      text: L("ishora o'zgaradi", 'знак меняется', 'the sign flips'),
      tone: 'accent',
    },
  ],
  rows: ['0,4ˣ²⁻ˣ⁻²⁰ > 0,4⁰', 'x² − x − 20 < 0'],
  probe: {
    question: L("Nega ikkinchi satrda ishora o'zgardi?", 'Почему во второй строке знак поменялся?', 'Why did the sign flip in the second line?'),
    items: [
      { id: 'a', label: L('asos birdan kichik, funksiya kamayadi', 'основание меньше единицы, функция убывает', 'the base is less than one, the function decreases'), correct: true },
      { id: 'b', label: L("chunki o'ngda nol", 'потому что справа ноль', 'because the right side is zero'), hint: L("O'ngdagi nol bu ko'rsatkich, u ishorani hal qilmaydi.", 'Ноль справа это показатель, он знак не решает.', 'The zero on the right is an exponent, it does not decide the sign.') },
      { id: 'c', label: L("chunki ko'rsatkichda kvadrat", 'потому что в показателе квадрат', 'because there is a square in the exponent'), hint: L("Kvadrat keyin, tengsizlikni yechishda kerak bo'ladi. Ishorani asos hal qildi.", 'Квадрат понадобится потом, при решении неравенства. Знак решило основание.', 'The square matters later, when solving. The base decided the sign.') },
      { id: 'd', label: L("ishora o'zgarmadi", 'знак не менялся', 'the sign did not flip'), hint: L("Yuqorida katta, pastda kichik. O'zgardi.", 'Наверху больше, внизу меньше. Поменялся.', 'Above it is greater-than, below it is less-than. It flipped.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Asos birdan kichik', 'Правило 2. Основание меньше единицы', 'Rule 2. Base less than one'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: '0 < a < 1:   aᶠ > aᵍ  ⟺  f < g',
    lines: [
      L('usul o\'sha: ikki tomonni bitta asosga keltir', 'приём тот же: приведи обе части к одному основанию', 'the same device: bring both sides to one base'),
      L('0 < a < 1: funksiya kamayadi — ishora O\'ZGARADI', '0 < a < 1: функция убывает — знак МЕНЯЕТСЯ', '0 < a < 1: the function decreases — the sign FLIPS'),
      L('1 = a⁰, ya\'ni o\'ngdagi bir ham daraja', '1 = a⁰, то есть единица справа это тоже степень', '1 = a⁰, so the one on the right is a power too'),
    ],
    example: L('misol:  0,4ˣ²⁻ˣ⁻²⁰ > 1  →  (−4; 5)', 'пример:  0,4ˣ²⁻ˣ⁻²⁰ > 1  →  (−4; 5)', 'example:  0,4ˣ²⁻ˣ⁻²⁰ > 1  →  (−4; 5)'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'aᶠ ∨ aᵍ',
    lines: [
      L('1. ikki tomonni bitta asosga keltir', '1. приведи обе части к одному основанию', '1. bring both sides to one base'),
      L("2. asos birdan katta — ishora o'sha, kichik — ishora o'zgaradi", '2. основание больше единицы — знак тот же, меньше — знак меняется', '2. base greater than one — same sign, less — the sign flips'),
      L("3. ko'rsatkichlar tengsizligini yech", '3. реши неравенство для показателей', '3. solve the inequality for the exponents'),
      L('4. javobni ichkaridagi va tashqaridagi nuqta bilan tekshir', '4. проверь ответ точкой внутри и точкой снаружи', '4. check the answer with a point inside and a point outside'),
    ],
  },
  holds: [4500, 6000, 4000, 5000],
  audio: [
    A('mount', "Nuqtalar javobni ko'rsatdi. Endi uni yozuv bilan olamiz.", 'Точки показали ответ. Теперь получим его записью.', 'The points showed the answer. Now let us get it in writing.'),
    A('toBase', "O'ngdagi birni daraja qilib yozamiz: bir bu nol butun to'rtning nolinchi darajasi. Endi ikki tomonda ham bir xil asos.", 'Запишем единицу справа как степень: единица это нуль целых четыре в нулевой. Теперь с обеих сторон одно основание.', 'Let us write the one on the right as a power: one is zero point four to the power zero. Now both sides have the same base.'),
    A('q', "Endi ko'rsatkichlarni solishtiramiz. Diqqat qiling: ishora o'zgardi. Nega?", 'Теперь сравниваем показатели. Обрати внимание: знак поменялся. Почему?', 'Now we compare the exponents. Notice: the sign flipped. Why?'),
    A('rule', "To'g'ri. Asos birdan kichik, funksiya kamayadi, shuning uchun ishora o'zgaradi.", 'Верно. Основание меньше единицы, функция убывает, поэтому знак меняется.', 'Correct. The base is less than one, the function decreases, so the sign flips.'),
    A('both', 'Endi ikkala holatni bitta qoidaga yig\'ing.', 'А теперь собери оба случая в одно правило.', 'Now combine both cases into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. ISHORANI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'base_direction',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L("Ishorani qo'ying", 'Поставь знак', 'Place the sign'),
  left: '(0,5)ˣ < (0,5)⁶',
  template: ['x', { slot: 0 }, '6'],
  signs: ['<', '>'],
  answer: '>',
  checkNote: L(
    'Tekshiruv: x = 7 chapda yechim, va yetti oltidan katta',
    'Проверка: x = 7 слева решение, и семь больше шести',
    'Check: x = 7 is a solution on the left, and seven is greater than six',
  ),
  wrongs: [
    { key: '<', hint: L("Yettini qo'ying. Chapda u yechim, o'ngda esa yetti oltidan kichik chiqadi — yolg'on. Demak yozuvlar teng kuchli emas.", 'Подставь семёрку. Слева она решение, а справа получается семь меньше шести — ложь. Значит записи не равносильны.', 'Substitute seven. On the left it is a solution, on the right you get seven is less than six, which is false. So the records are not equivalent.') },
  ],
  probe: {
    question: L("Ishora yo'nalishi nimaga bog'liq?", 'От чего зависит направление знака?', 'What does the direction of the sign depend on?'),
    items: [
      { id: 'a', label: L("funksiya o'sadimi yoki kamayadimi", 'возрастает функция или убывает', 'whether the function increases or decreases'), correct: true },
      { id: 'b', label: L("boshlang'ich ishoraga", 'от исходного знака', 'on the original sign'), hint: L("Boshlang'ich ishorani aynan o'zimiz o'zgartiramiz. Savol shundaki, nega bunga haqlimiz.", 'Исходный знак мы как раз и меняем. Вопрос в том, почему нам можно.', 'The original sign is exactly what we change. The question is why we are allowed to.') },
      { id: 'c', label: L("o'ngdagi songa", 'от числа справа', 'on the number on the right'), hint: L("Oltini boshqa songa almashtiring — yo'nalish o'sha qoladi.", 'Замени шестёрку любым числом, направление останется тем же.', 'Replace six with any number, the direction stays the same.') },
      { id: 'd', label: L('iksning ishorasiga', 'от знака икса', 'on the sign of x'), hint: L("Iks manfiy ham bo'lishi mumkin, bu hech narsani o'zgartirmaydi.", 'Икс может быть и отрицательным, это ничего не меняет.', 'x may be negative, that changes nothing.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "O'ng yozuv chapiga teng kuchli bo'lishi uchun ishorani qo'ying.", 'Поставь знак так, чтобы правая запись была равносильна левой.', 'Place the sign so that the right record is equivalent to the left one.'),
    A('checked', "Bo'ldi. Endi ta'riflang: yo'nalish nimaga bog'liq?", 'Получилось. Теперь сформулируй: от чего зависит направление?', 'Done. Now put it into words: what does the direction depend on?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'sameBase', label: L('bitta asosga keltirish', 'привести к одному основанию', 'bring to one base') },
  { id: 'keep', label: L("ko'rsatkichlarni solishtirish, ishora o'sha", 'сравнить показатели, знак тот же', 'compare the exponents, same sign') },
  { id: 'flip', label: L("ko'rsatkichlarni solishtirish, ishora o'zgaradi", 'сравнить показатели, знак меняется', 'compare the exponents, sign flips') },
  { id: 'solve', label: L('chiziqli tengsizlikni yechish', 'решить линейное неравенство', 'solve the linear inequality') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'base_direction',
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: '3⁶⁻ˣ > 3³ˣ⁻²',
  actions: ACTIONS_10,
  axis: AXIS_3,
  correctSet: { from: null, to: 2 },
  steps: [
    {
      action: 'keep',
      to: '6 − x > 3x − 2',
      wrongs: [
        {
          action: 'flip',
          set: { from: 2, to: null },
          hint: L("Asos uch, u birdan KATTA — ishora o'zgarmaydi. Qarang: to'plam ikkidan o'ngga ketdi. x = 3 ni boshlang'ich tengsizlikka qo'ying — kirmaydi.", 'Основание три, оно БОЛЬШЕ единицы — знак не меняется. Смотри: множество уехало вправо от двойки. Подставь x = 3 в исходное — не входит.', 'The base is three, which is GREATER than one — the sign does not change. Look: the set moved to the right of two. Substitute x = 3 into the original — it is not a solution.'),
        },
        { action: 'sameBase', hint: L("Asoslar allaqachon bir xil, ikkalasi ham uch.", 'Основания уже одинаковы, оба три.', 'The bases are already the same, both are three.') },
        { action: 'solve', hint: L("Avval ko'rsatkichlarga o'tish kerak.", 'Сначала надо перейти к показателям.', 'You must move to the exponents first.') },
      ],
    },
    {
      action: 'solve',
      to: '8 > 4x,   x < 2',
      wrongs: [
        { action: 'keep', hint: L("Ko'rsatkichlarga allaqachon o'tildi.", 'К показателям уже перешли.', 'We already moved to the exponents.') },
        { action: 'flip', hint: L("Ko'rsatkichlarga allaqachon o'tildi.", 'К показателям уже перешли.', 'We already moved to the exponents.') },
        { action: 'sameBase', hint: L("Daraja qolmadi.", 'Степеней больше нет.', 'There are no powers left.') },
      ],
    },
  ],
  answer: {
    numbers: ['−∞', '0', '2', '+∞'],
    value: ['−∞', '2'],
    prompt: L('Javobni imtihonda yozganingizdek yozing', 'Запиши ответ так, как пишут на экзамене', 'Write the answer the way you would on the exam'),
    wrongs: [{ key: '*', hint: L("Oxirgi satrga qarang: iks ikkidan kichik.", 'Смотри на последнюю строку: икс меньше двух.', 'Look at the last line: x is less than two.') }],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi bu misolni to\'liq o\'tamiz.', 'Правило сформулировано. Пройдём этот пример целиком.', 'The rule is yours now. Let us go through this example completely.'),
    A('start', "Asoslar bir xil, ikkalasi ham uch. Nimadan boshlashni tanlang.", 'Основания одинаковые, оба три. Выбери, с чего начать.', 'The bases are the same, both are three. Choose where to start.'),
    A('step3', 'Endi javobni imtihonda yozganingizdek yozing.', 'Теперь запиши ответ так, как пишут на экзамене.', 'Now write the answer the way you would on the exam.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL, SON O'QISIZ. Ikkala tuzoq birga.
// ============================================================
const ACTIONS_11 = [
  { id: 'sameBase', label: L('bitta asosga keltirish', 'привести к одному основанию', 'bring to one base') },
  { id: 'keep', label: L("ko'rsatkichlarni solishtirish, ishora o'sha", 'сравнить показатели, знак тот же', 'compare the exponents, same sign') },
  { id: 'flip', label: L("ko'rsatkichlarni solishtirish, ishora o'zgaradi", 'сравнить показатели, знак меняется', 'compare the exponents, sign flips') },
  { id: 'solve', label: L('chiziqli tengsizlikni yechish', 'решить линейное неравенство', 'solve the linear inequality') },
]

const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'neg_exponent',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Tengsizlikni yeching', 'Реши неравенство', 'Solve the inequality'),
  start: '(1/9)ˣ < 1/27',
  actions: ACTIONS_11,
  hint: L(
    "Bir to'qqizdan bu uchning minus ikkinchi darajasi, bir yigirma yettidan esa minus uchinchi.",
    'Одна девятая это три в минус второй, а одна двадцать седьмая это три в минус третьей.',
    'One ninth is three to the power minus two, and one twenty seventh is three to the power minus three.',
  ),
  steps: [
    {
      action: 'sameBase',
      to: '3⁻²ˣ < 3⁻³',
      wrongs: [
        { action: 'keep', hint: L("Asoslar hali turlicha: chapda bir to'qqizdan, o'ngda bir yigirma yettidan.", 'Основания пока разные: слева одна девятая, справа одна двадцать седьмая.', 'The bases still differ: one ninth on the left, one twenty seventh on the right.') },
        { action: 'flip', hint: L("Asoslar hali turlicha. Avval ikkalasini uchga keltiring.", 'Основания пока разные. Сначала приведи оба к тройке.', 'The bases still differ. First bring both to three.') },
        { action: 'solve', hint: L("Yechadigan tengsizlik hali yo'q.", 'Решать ещё нечего.', 'There is nothing to solve yet.') },
      ],
    },
    {
      action: 'keep',
      to: '−2x < −3',
      wrongs: [
        { action: 'flip', hint: L("Asos endi UCH, u birdan katta. Ishora o'zgarmaydi. Aylanish keyinroq, boshqa sababdan bo'ladi.", 'Основание теперь ТРОЙКА, оно больше единицы. Знак не меняется. Переворот будет позже и по другой причине.', 'The base is now THREE, which is greater than one. The sign does not change. The flip comes later and for another reason.') },
        { action: 'sameBase', hint: L("Asoslar allaqachon bir xil.", 'Основания уже одинаковы.', 'The bases are already the same.') },
        { action: 'solve', hint: L("Avval ko'rsatkichlarga o'ting.", 'Сначала перейди к показателям.', 'First move to the exponents.') },
      ],
    },
    {
      action: 'solve',
      to: 'x > 1,5',
      wrongs: [
        { action: 'keep', hint: L("Ko'rsatkichlarga o'tildi.", 'К показателям уже перешли.', 'We already moved to the exponents.') },
        { action: 'flip', hint: L("Ko'rsatkichlarga o'tildi.", 'К показателям уже перешли.', 'We already moved to the exponents.') },
        { action: 'sameBase', hint: L("Daraja qolmadi.", 'Степеней больше нет.', 'There are no powers left.') },
      ],
    },
  ],
  answer: {
    numbers: ['−∞', '0', '1,5', '3', '+∞'],
    value: ['1,5', '+∞'],
    prompt: L("Javobni oraliq ko'rinishida yozing", 'Запиши ответ промежутком', 'Write the answer as an interval'),
    wrongs: [
      { key: '−∞|1,5', hint: L("Minus ikki iks minus uchdan kichik. Manfiy songa bo'lganda ishora AYLANADI: iks bir yarimdan katta. x = 2 ni tekshiring.", 'Минус два икс меньше минус трёх. При делении на отрицательное знак ПЕРЕВОРАЧИВАЕТСЯ: икс больше полутора. Проверь x = 2.', 'Minus two x is less than minus three. Dividing by a negative FLIPS the sign: x is greater than one and a half. Check x = 2.') },
      { key: '−∞|3', hint: L("Uchlik chegara emas. Chegara bir yarim: minus uchni minus ikkiga bo'ling.", 'Тройка не граница. Граница полтора: раздели минус три на минус два.', 'Three is not the boundary. The boundary is one and a half: divide minus three by minus two.') },
      { key: '*', hint: L("x = 2 ni tekshiring: bir to'qqizdan kvadrat bu bir sakson birdan, va u bir yigirma yettidan kichik.", 'Проверь x = 2: одна девятая в квадрате это одна восемьдесят первая, и это меньше одной двадцать седьмой.', 'Check x = 2: one ninth squared is one eighty first, and that is less than one twenty seventh.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, o'qsiz, xuddi imtihondagidek.", 'Теперь полностью сам, и без прямой, как на экзамене.', 'Now completely on your own, and without the line, as on the exam.'),
    A('go', "Asoslarga qarang: ikkalasini ham uchga keltirish mumkin. Va oxirida diqqat qiling: manfiy songa bo'lish ham ishorani aylantiradi.", 'Смотри на основания: оба приводятся к тройке. И в конце будь внимателен: деление на отрицательное тоже переворачивает знак.', 'Look at the bases: both can be brought to three. And at the end be careful: dividing by a negative also flips the sign.'),
    A('answered', "Javobni oraliq ko'rinishida yozing.", 'Ответ запиши промежутком.', 'Write the answer as an interval.'),
  ],
}

// ============================================================
// SLAYD 12. BLITS. OLTI SAVOL.
// ============================================================
const S12 = {
  role: 'blitz',
  led: 'student',
  eyebrow: L('Blits', 'Блиц', 'Quick round'),
  title: L('Olti savol', 'Шесть вопросов', 'Six questions'),
  items: [
    {
      id: 'b1', tag: 'same_base', prompt: '3ˣ ≤ 81', cols: 4,
      items: [
        { id: 'a', label: '(−∞; 4]', correct: true },
        { id: 'b', label: '(−∞; 4)', hint: L("Ishora tengli, demak chegara javobga kiradi va kvadrat qavs qo'yiladi.", 'Знак нестрогий, значит граница входит и скобка квадратная.', 'The sign is non-strict, so the boundary is included and the bracket is square.') },
        { id: 'c', label: '[4; +∞)', hint: L("Asos uch birdan katta, ishora o'zgarmaydi: iks to'rtdan kichik.", 'Основание три больше единицы, знак не меняется: икс меньше четырёх.', 'The base three is greater than one, the sign stays: x is less than four.') },
        { id: 'd', label: '(−∞; 3]', hint: L("Sakson bir bu uchning to'rtinchi darajasi, uchinchi emas.", 'Восемьдесят один это три в четвёртой, а не в третьей.', 'Eighty one is three to the fourth, not the third.') },
      ],
    },
    {
      id: 'b2', tag: 'base_direction', ask: true, cols: 2,
      done: L("ishora o'zgaradi:  (0,2)ˣ > 5", 'знак меняется:  (0,2)ˣ > 5', 'the sign flips:  (0,2)ˣ > 5'),
      prompt: L("Qaysi tengsizlikda ko'rsatkichlar orasidagi ishora o'zgaradi?", 'В каком неравенстве знак между показателями поменяется?', 'In which inequality will the sign between the exponents flip?'),
      items: [
        { id: 'a', label: '(0,2)ˣ > 5', correct: true },
        { id: 'b', label: '2ˣ > 5', hint: L("Asos ikki birdan katta, ishora o'sha qoladi.", 'Основание два больше единицы, знак останется.', 'The base two is greater than one, the sign stays.') },
        { id: 'c', label: '3ˣ < 5', hint: L("Asos uch birdan katta. Boshlang'ich ishoraning yo'nalishi bu yerda ahamiyatsiz.", 'Основание три больше единицы. Направление исходного знака тут ни при чём.', 'The base three is greater than one. The direction of the original sign is irrelevant.') },
        { id: 'd', label: '7ˣ > 2', hint: L("Yetti birdan katta. Birdan KICHIK asosni izlang.", 'Семь больше единицы. Ищи основание МЕНЬШЕ единицы.', 'Seven is greater than one. Look for a base LESS than one.') },
      ],
    },
    {
      id: 'b3', tag: 'same_base', prompt: '5²ˣ ≥ 5ˣ⁺³', cols: 4,
      items: [
        { id: 'a', label: '[3; +∞)', correct: true },
        { id: 'b', label: '(−∞; 3]', hint: L("Asos besh birdan katta, ishora o'zgarmaydi: ikki iks iks plyus uchdan katta yoki teng.", 'Основание пять больше единицы, знак не меняется: два икс больше или равно икс плюс три.', 'The base five is greater than one, the sign stays: two x is greater than or equal to x plus three.') },
        { id: 'c', label: '[1; +∞)', hint: L("Ikki iks minus iks bu iks, va u uchdan katta yoki teng.", 'Два икс минус икс это икс, и он больше или равен трём.', 'Two x minus x is x, and it is greater than or equal to three.') },
        { id: 'd', label: '(3; +∞)', hint: L("Ishora tengli, demak uchlik javobga kiradi.", 'Знак нестрогий, значит тройка входит в ответ.', 'The sign is non-strict, so three is included.') },
      ],
    },
    {
      id: 'b4', tag: 'check_by_point', ask: true, cols: 1,
      done: L('tekshiruv:  ichkaridagi va tashqaridagi nuqta', 'проверка:  точка внутри и точка снаружи', 'check:  a point inside and outside'),
      prompt: L(
        "(0,5)ˣ < 1/64 uchun sizda (6; +∞) javobi chiqdi. Uning to'g'riligiga eng tez qanday ishonch hosil qilasiz?",
        'У тебя вышел ответ (6; +∞) для (0,5)ˣ < 1/64. Как быстрее всего убедиться, что он верный?',
        'You got the answer (6; +∞) for (0,5)ˣ < 1/64. What is the fastest way to make sure it is correct?',
      ),
      items: [
        { id: 'a', label: L("ichkaridagi va tashqaridagi nuqtani qo'yish", 'подставить точку внутри и точку снаружи', 'substitute a point inside and a point outside'), correct: true },
        { id: 'b', label: L("o'sha usul bilan ikkinchi marta yechish", 'решить второй раз тем же способом', 'solve it a second time the same way'), hint: L("O'sha usul bilan o'sha xatoni takrorlaysiz.", 'Тем же способом повторишь ту же ошибку.', 'The same way will repeat the same mistake.') },
        { id: 'c', label: L('faqat chegarani tekshirish', 'проверить только границу', 'check only the boundary'), hint: L("Chegara javobga kirmaydi. Ichkaridagi va tashqaridagi sonni tekshirish kerak.", 'Граница в ответ не входит. Проверять надо число внутри и число снаружи.', 'The boundary is not in the answer. Check a number inside and a number outside.') },
        { id: 'd', label: L('nechta butun son kirganini sanash', 'посчитать, сколько целых чисел вошло', 'count how many whole numbers are included'), hint: L("Bu tekshiruv emas: sonlar soni hech narsani isbotlamaydi.", 'Это не проверка: количество чисел ничего не доказывает.', 'That is not a check: the count proves nothing.') },
      ],
    },
    {
      id: 'b5', tag: 'neg_exponent', prompt: '(1/2)ˣ > 8', cols: 4,
      items: [
        { id: 'a', label: '(−∞; −3)', correct: true },
        { id: 'b', label: '(3; +∞)', hint: L("Bir ikkidan bu ikkining minus birinchi darajasi. Minusni yo'qotmang.", 'Одна вторая это два в минус первой. Минус не потеряй.', 'One half is two to the power minus one. Do not lose the minus.') },
        { id: 'c', label: '(−∞; 3)', hint: L("Sakkiz bu ikkining kubi, demak chegara minus uch.", 'Восемь это два в кубе, значит граница минус три.', 'Eight is two cubed, so the boundary is minus three.') },
        { id: 'd', label: '(−3; +∞)', hint: L("Asos birdan kichik, ishora aylanadi: iks minus uchdan KICHIK.", 'Основание меньше единицы, знак переворачивается: икс МЕНЬШЕ минус трёх.', 'The base is less than one, the sign flips: x is LESS than minus three.') },
      ],
    },
    {
      id: 'b6', tag: 'base_direction', ask: true, cols: 4,
      done: '(0,3)ˣ ≥ (0,3)⁵  ⟺  x ≤ 5',
      prompt: L("(0,3)ˣ ≥ (0,3)⁵ uchun nima to'g'ri?", 'Что верно для (0,3)ˣ ≥ (0,3)⁵ ?', 'What is true for (0,3)ˣ ≥ (0,3)⁵ ?'),
      items: [
        { id: 'a', label: 'x ≤ 5', correct: true },
        { id: 'b', label: 'x ≥ 5', hint: L("Asos nol butun uch, u birdan kichik. Ishora aylanadi.", 'Основание нуль целых три, оно меньше единицы. Знак переворачивается.', 'The base is zero point three, less than one. The sign flips.') },
        { id: 'c', label: 'x < 5', hint: L("Ishora tengli edi, tengli qoladi.", 'Знак был нестрогий, нестрогим и останется.', 'The sign was non-strict and stays non-strict.') },
        { id: 'd', label: 'x = 5', hint: L("Tenglik emas, tengsizlik.", 'Это неравенство, а не равенство.', 'This is an inequality, not an equation.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', 'Asoslarga qarang.', 'Смотри на основания.', 'Look at the bases.'),
    A('q3', "Bu yerda ikki tomonda ham daraja.", 'Здесь степень с обеих сторон.', 'Here there is a power on both sides.'),
    A('q4', 'Tekshiruv haqida savol.', 'Вопрос про проверку.', 'A question about checking.'),
    A('q5', 'Asos kasr.', 'Основание дробное.', 'The base is a fraction.'),
    A('q6', "Oxirgi. Ishora tengli.", 'Последний. Знак нестрогий.', 'The last one. The sign is non-strict.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'base_direction',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L("Qadamlar to'g'ri, javob xato", 'Шаги верны, ответ нет', 'Steps right, answer wrong'),
  rows: [
    { id: 'r1', text: '(0,5)ˣ < 0,25' },
    { id: 'r2', text: '(0,5)ˣ < (0,5)²' },
    { id: 'r3', text: 'x < 2' },
    { id: 'r4', text: '(−∞; 2)' },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu boshlang'ich tengsizlik, unda xato bo'lishi mumkin emas.", 'Это исходное неравенство, ошибки в нём быть не может.', 'This is the original inequality, there can be no error in it.'),
    r2: L("Bu satr to'g'ri: nol butun yigirma besh bu nol butun beshning kvadrati.", 'Эта строка верна: нуль целых двадцать пять это нуль целых пять в квадрате.', 'This line is correct: zero point two five is zero point five squared.'),
    r4: L("Javob haqiqatan xato. Lekin u oldin xato bo'lgan, qayerda ekanini toping.", 'Ответ действительно неверный. Но неверным он стал раньше, найди, где именно.', 'The answer is indeed wrong. But it became wrong earlier, find exactly where.'),
  },
  proofPoint: 'x = 0',
  proof: L(
    "x = 0 da chapda bir chiqadi, va bir nol butun yigirma beshdan katta. Demak nol yechim emas, javobga esa u kiradi. To'g'risi: asos birdan kichik, ishora aylanadi, x > 2",
    'При x = 0 слева получается единица, а единица больше нуля целых двадцати пяти. Значит ноль не решение, а в ответ он входит. Верно: основание меньше единицы, знак переворачивается, x > 2',
    'At x = 0 the left side is one, and one is greater than zero point two five. So zero is not a solution, yet the answer contains it. Correct: the base is less than one, the sign flips, x > 2',
  ),
  probe: {
    question: L('Qaysi qoida buzilgan?', 'Какое правило нарушено?', 'Which rule was broken?'),
    items: [
      { id: 'a', label: L("asos birdan kichik — ishora aylanishi kerak edi", 'основание меньше единицы — знак должен был перевернуться', 'the base is less than one — the sign had to flip'), correct: true },
      { id: 'b', label: L('asoslar turlicha edi', 'основания были разные', 'the bases were different'), hint: L("Asoslar bir xil qilingan, buni 2-satrda ko'rasiz.", 'Основания приведены, это видно в строке 2.', 'The bases were brought together, you can see it in line 2.') },
      { id: 'c', label: L("0,25 noto'g'ri yozilgan", '0,25 записано неверно', '0,25 was written incorrectly'), hint: L("Nol butun yigirma besh bu nol butun beshning kvadrati, to'g'ri.", 'Нуль целых двадцать пять это нуль целых пять в квадрате, верно.', 'Zero point two five is zero point five squared, correct.') },
      { id: 'd', label: L('amallar tartibi', 'порядок действий', 'order of operations'), hint: L("Tartib to'g'ri: avval asos, keyin ko'rsatkichlar.", 'Порядок правильный: сначала основание, потом показатели.', 'The order is right: the base first, then the exponents.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda hamma qadam to'g'ri ko'rinadi. Shunga qaramay javob xato. Xato birinchi marta paydo bo'lgan satrni toping.", 'Все шаги здесь выглядят верными. И всё же ответ неверный. Найди строку, в которой ошибка появилась впервые.', 'Every step here looks correct. And still the answer is wrong. Find the line where the error first appeared.'),
    A('proof', "Nuqta bilan tekshiramiz. Nolni qo'ysak, chapda bir chiqadi, va bir nol butun yigirma beshdan katta. Demak nol yechim emas, javobga esa kiradi.", 'Проверим точкой. Подставим ноль: слева получается единица, а единица больше нуля целых двадцати пяти. Значит ноль не решение, а в ответ он входит.', 'Let us check with a point. Substitute zero: the left side is one, and one is greater than zero point two five. So zero is not a solution, yet the answer contains it.'),
    A('q2', 'Qaysi qoida buzilgan?', 'Какое правило нарушено?', 'Which rule was broken?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const PARTS_14 = ['2ˣ', '(0,5)ˣ', '≥', '≤', '8', '1/8']

const S14 = {
  role: 'build',
  led: 'student',
  tag: 'base_direction',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Teskari yig\'ing', 'Собери обратно', 'Build it back'),
  axis: AXIS_4,
  sets: [{ from: 3, to: null, tone: 'graph' }],
  targetValue: '[3; +∞)',
  tasks: [
    {
      prompt: L('Asosi 2 bo\'lsin', 'Пусть основание будет 2', 'Let the base be 2'),
      template: [{ slot: 0 }, { slot: 1 }, { slot: 2 }],
      parts: PARTS_14,
      answer: ['2ˣ', '≥', '8'],
      doneLabel: L('birinchi usul:  2ˣ ≥ 8', 'первый способ: 2ˣ ≥ 8', 'first way: 2ˣ ≥ 8'),
      wrongs: [
        { key: '2ˣ|≤|8', hint: L("Bu to'plam uchdan chapda, kerak esa o'ngda.", 'Это множество левее тройки, а нужно правее.', 'This set is to the left of three, but we need to the right.') },
        { key: '2ˣ|≥|1/8', hint: L("Bir sakkizdan bu ikkining minus kubi, chegara minus uch chiqadi.", 'Одна восьмая это два в минус кубе, граница получится минус три.', 'One eighth is two to the power minus three, the boundary would be minus three.') },
        { key: '*', hint: L("Asos ikki birdan katta: ishora o'zgarmaydi, chegara esa uch.", 'Основание два больше единицы: знак не меняется, а граница три.', 'The base two is greater than one: the sign stays, and the boundary is three.') },
      ],
    },
    {
      prompt: L("Endi asosi 0,5 bo'lsin, javob esa o'sha", 'А теперь основание 0,5, а ответ тот же', 'Now let the base be 0,5, with the same answer'),
      template: [{ slot: 0 }, { slot: 1 }, { slot: 2 }],
      parts: PARTS_14,
      answer: ['(0,5)ˣ', '≤', '1/8'],
      doneLabel: L('ikkinchi usul:  (0,5)ˣ ≤ 1/8', 'второй способ: (0,5)ˣ ≤ 1/8', 'second way: (0,5)ˣ ≤ 1/8'),
      wrongs: [
        { key: '(0,5)ˣ|≥|1/8', hint: L("Asos birdan kichik: ishora aylanadi, demak yig'ishda uni teskari qo'yish kerak.", 'Основание меньше единицы: знак переворачивается, значит собирать надо обратный.', 'The base is less than one: the sign flips, so you must assemble the opposite one.') },
        { key: '(0,5)ˣ|≤|8', hint: L("Sakkiz bu nol butun beshning minus kubi, chegara minus uch chiqadi.", 'Восемь это нуль целых пять в минус кубе, граница получится минус три.', 'Eight is zero point five to the power minus three, the boundary would be minus three.') },
        { key: '*', hint: L("x = 3 ni tekshiring: chapda bir sakkizdan chiqishi kerak, va u javobga kirsin.", 'Проверь x = 3: слева должна получиться одна восьмая, и она должна входить в ответ.', 'Check x = 3: the left side must be one eighth, and it must be included.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi o'sha javob, lekin asos nol butun besh bo'lishi kerak.", 'А теперь тот же ответ, но основание должно быть нуль целых пять.', 'And now the same answer, but the base must be zero point five.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'check_by_point',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: 'a > 1: ishora o\'sha  ·  0 < a < 1: ishora aylanadi',
  ruleLines: [
    L('1. ikki tomonni bitta asosga keltir', '1. приведи обе части к одному основанию', '1. bring both sides to one base'),
    L("2. a > 1 — ishora o'sha, 0 < a < 1 — ishora aylanadi", '2. a > 1 — знак тот же, 0 < a < 1 — знак меняется', '2. a > 1 — same sign, 0 < a < 1 — the sign flips'),
    L('3. javobni ichkaridagi va tashqaridagi nuqta bilan tekshir', '3. проверь ответ точкой внутри и точкой снаружи', '3. check the answer with a point inside and a point outside'),
  ],
  predicts: [
    {
      screen: 0,
      expr: EQ_HOOK,
      right: '(6; +∞)',
      map: { a: '(6; +∞)', b: '(−∞; 6)', both: '—', none: '—' },
    },
    {
      screen: 5,
      expr: EQ_NEW,
      right: '(−4; 5)',
      map: { a: '(−4; 5)', b: '(−∞; −4)', c: '(5; +∞)', d: '—' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '(0,5)ˣ < 1/64   →   (0,5)ˣ < (0,5)⁶   →   x > 6',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Qoidaga va kamayuvchi chiziq ekraniga qayting', 'Вернись к правилу и к экрану с убывающей кривой', 'Go back to the rule and to the decreasing-curve screen'),
  },
  probe: {
    question: L('Ishonchingiz bo\'lmasa, javobingizni qanday tekshirasiz?', 'Как проверить свой ответ, если сомневаешься?', 'How do you check your answer when you are unsure?'),
    items: [
      { id: 'a', label: L('ichkaridagi va tashqaridagi nuqta', 'точка внутри и точка снаружи', 'a point inside and a point outside'), correct: true },
      { id: 'b', label: L("o'sha usul bilan qayta yechish", 'решить второй раз тем же способом', 'solve it again the same way'), hint: L("O'sha usul o'sha xatoni takrorlaydi.", 'Тот же способ повторит ту же ошибку.', 'The same way repeats the same mistake.') },
      { id: 'c', label: L('darslikka qarash', 'посмотреть в учебник', 'look in the textbook'), hint: L("Darslikda aynan sizning tengsizligingiz bo'lmaydi.", 'В учебнике не будет именно твоего неравенства.', 'The textbook will not contain your exact inequality.') },
      { id: 'd', label: L('hech qanday', 'никак', 'there is no way'), hint: L('Butun dars tekshirdik. Nima bilan ekanini eslang.', 'Мы весь урок проверяли. Вспомни, чем.', 'We were checking all lesson. Recall with what.') },
    ],
  },
  sheetTitle: L('Ko\'rsatkichli tengsizliklar · shpargalka', 'Показательные неравенства · шпаргалка', 'Exponential inequalities · cheat sheet'),
  sheetSrc: L('11-sinf · 10-dars', '11 класс · урок 10', 'Grade 11 · lesson 10'),
  lifehack: L(
    "10 sekundlik tekshiruv: javob ICHIDAN bitta son va TASHQARISIDAN bitta son ol. Biri o'tishi, ikkinchisi o'tmasligi kerak.",
    'Проверка за 10 секунд: возьми число ВНУТРИ ответа и число СНАРУЖИ. Одно должно пройти, другое нет.',
    'A 10-second check: take a number INSIDE your answer and one OUTSIDE. One must pass, the other must fail.',
  ),
  holds: [2500, 8000, 4000, 4500],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminingiz va mana qanday chiqdi. Taxminda xato qilish normal edi, biz shuning uchun tekshirdik.", 'Вот твой прогноз и вот как оказалось. Ошибиться в догадке было нормально, именно поэтому мы проверяли.', 'Here is your guess and here is how it turned out. Being wrong in a guess was fine, that is exactly why we checked.'),
    A('rule', "Va mana dars boshlangan tengsizlik. Endi u ikki qadamda yechiladi.", 'А вот неравенство, с которого урок начался. Теперь оно решается за два шага.', 'And here is the inequality the lesson began with. Now it takes two steps.'),
    A('q', "Va eng muhimi: javobga ishonchingiz bo'lmasa, o'zingiz tekshirish usuli bor.", 'И главное: если сомневаешься в ответе, есть способ проверить самому.', 'And the main thing: if you are unsure of the answer, there is a way to check it yourself.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
