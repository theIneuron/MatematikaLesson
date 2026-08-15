// ============================================================================
// 11-sinf, Dars 13. SISTEMALAR.  (Системы)
//
// B2 blokining beshinchi darsi. Faqat MA'LUMOT.
//   raskadrovka: src/books/grade11/DARS13_SKELET.md
//   kontrakt:    src/books/grade11/ETALON_11SINF.md
//
// Etalondan (12-dars) farqi NOL ekran.
//
// DARSNING BITTA SO'ZI: sistema bu VA, YOKI emas. Javob ikki to'plamning
// KESISHMASI -- va u bitta son o'qida ko'rinadi.
//
// Darsdagi hamma tengsizlik QAT'IY: aks holda javob `[3; 9)` ko'rinishida
// bo'lardi, javob yozish asbobi esa dumaloq qavs chizadi. Birinchi sistemalar
// darsida yozuv shakllarini aralashtirib bo'lmaydi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_13',
  title: L('Sistemalar', 'Системы', 'Systems'),
}

const BLOCK = { label: 'B2', from: 9, to: 14, current: 13 }

const AXIS_1 = { min: 0, max: 22, ticks: [{ v: 3 }, { v: 16 }, { v: 20 }] }
const AXIS_3 = { min: 0, max: 6, ticks: [{ v: 1 }, { v: 3 }] }

const SYS_HOOK = '2ˣ > 8,   log₂ x < 4'
const SYS_NEW = '2ˣ⁺ʸ = 8,   x − y = 1'

// ============================================================
// SLAYD 1. XUK.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Sistemalar', 'Системы', 'Systems'),
  title: L('Ikki javob. Kim haq?', 'Два ответа. Кто прав?', 'Two answers. Who is right?'),
  expr: SYS_HOOK,
  axis: AXIS_1,
  rows: [
    {
      id: 'a',
      name: L('birinchi yechim', 'первое решение', 'first solution'),
      value: '(3; 16)',
      set: { from: 3, to: 16, tone: 'ink' },
    },
    {
      id: 'b',
      name: L('ikkinchi yechim', 'второе решение', 'second solution'),
      value: '(0; +∞)',
      set: { from: 0, to: null, tone: 'tip' },
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
  holds: [4000, 3500, 6500, 4000],
  audio: [
    A('mount', "Bu safar yozuv bitta emas, ikkita. Ular birga turibdi, va shuni sistema deyiladi.", 'На этот раз запись не одна, а две. Они стоят вместе, и это называется системой.', 'This time there is not one record but two. They stand together, and that is called a system.'),
    A('r1', "Birinchi javob: uch bilan o'n olti orasidagi sonlar.", 'Первый ответ: числа между тройкой и шестнадцатью.', 'The first answer: the numbers between three and sixteen.'),
    A('r2', "Ikkinchi javob: noldan katta hamma sonlar. Bu ancha keng, va ikkinchi javob birinchisini butunlay ichiga oladi.", 'Второй ответ: все числа больше нуля. Это заметно шире, и второй ответ целиком включает в себя первый.', 'The second answer: all numbers greater than zero. That is much wider, and the second answer fully contains the first.'),
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
    "Bahsni hal qilishdan oldin uch narsani eslab olamiz. Bu baholanmaydi.",
    'Прежде чем решать спор, вспомним три вещи. Это не оценивается.',
    'Before settling the argument, let us recall three things. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Daraja va logarifm — bitta juftlik', 'Степень и логарифм — одна пара', 'A power and a logarithm are one pair'),
      short: L('daraja va logarifm', 'степень и логарифм', 'power and logarithm'),
      ex: [
        { e: '8 = 2³', why: 'log₂ 8 = 3' },
        { e: '16 = 2⁴', why: 'log₂ 16 = 4' },
      ],
    },
    {
      id: 'c2',
      title: L('Logarifm ostida faqat musbat son', 'Под логарифмом только положительное', 'Only a positive number under a logarithm'),
      short: L('ostida faqat musbat', 'под логарифмом только плюс', 'only a plus under it'),
      ex: [
        { e: 'log₂ x  →  x > 0', why: L('bu shart o\'zi keladi', 'это условие приходит само', 'this condition comes by itself') },
      ],
    },
    {
      // Darsning O'ZAGI.
      id: 'c3',
      title: L('Kesishma — umumiy qism', 'Пересечение — общая часть', 'An intersection is the common part'),
      short: L('kesishma — umumiy qism', 'пересечение — общая часть', 'an intersection is the common part'),
      ex: [
        { e: 'x > 3   va   x < 16', why: L('ikkalasi ham bajariladigan sonlar', 'числа, где выполняются оба', 'the numbers where both hold') },
        { e: '→ (3; 16)', why: L('faqat umumiy qism', 'только общая часть', 'only the common part') },
      ],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L('16 = 2 ning qaysi darajasi?', '16 = 2 в какой степени?', '16 = 2 to what power?'),
      cols: 4,
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '3', hint: L("Ikkining kubi sakkiz.", 'Два в кубе это восемь.', 'Two cubed is eight.') },
        { id: 'c', label: '8', hint: L("Sakkiz bu ikkining kubi, o'n olti emas.", 'Восемь это два в кубе, а не шестнадцать.', 'Eight is two cubed, not sixteen.') },
        { id: 'd', label: '2', hint: L("Ikkining kvadrati to'rt.", 'Два в квадрате это четыре.', 'Two squared is four.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L("x > 3 va x < 16 shartlarini qaysi son BIRGA bajaradi?", 'Какое число выполняет ОБА условия: x > 3 и x < 16 ?', 'Which number satisfies BOTH conditions: x > 3 and x < 16 ?'),
      cols: 4,
      items: [
        { id: 'a', label: '10', correct: true },
        { id: 'b', label: '2', hint: L("Ikki uchdan kichik, birinchi shart bajarilmadi.", 'Двойка меньше тройки, первое условие не выполнено.', 'Two is less than three, the first condition fails.') },
        { id: 'c', label: '20', hint: L("Yigirma o'n oltidan katta, ikkinchi shart bajarilmadi.", 'Двадцать больше шестнадцати, второе условие не выполнено.', 'Twenty is greater than sixteen, the second condition fails.') },
        { id: 'd', label: '3', hint: L("Uchning o'zi kirmaydi: ishora qat'iy.", 'Сама тройка не входит: знак строгий.', 'Three itself is not included: the sign is strict.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L("«Sistema» so'zi nimani anglatadi?", 'Что означает слово «система»?', 'What does the word "system" mean?'),
      cols: 2,
      items: [
        { id: 'a', label: L('ikkala shart ham bajariladi', 'выполняются оба условия', 'both conditions hold'), correct: true },
        { id: 'b', label: L('kamida bittasi bajariladi', 'выполняется хотя бы одно', 'at least one holds'), hint: L("Bu «yoki» bo'lardi. Sistemada esa «va».", 'Это было бы «или». В системе же «и».', 'That would be "or". In a system it is "and".') },
        { id: 'c', label: L('shartlar qo\'shiladi', 'условия складываются', 'the conditions are added'), hint: L("Shartlar qo'shilmaydi: har biri o'z to'plamini beradi, keyin umumiy qism olinadi.", 'Условия не складываются: каждое даёт своё множество, потом берётся общая часть.', 'Conditions are not added: each gives its own set, then the common part is taken.') },
        { id: 'd', label: L('ikkinchisi birinchisidan kelib chiqadi', 'второе следует из первого', 'the second follows from the first'), hint: L("Kelib chiqmaydi: ular mustaqil shartlar.", 'Не следует: это независимые условия.', 'It does not: they are independent conditions.') },
      ],
    },
  ],
  holds: [4000, 7000, 5000, 8000, 6000, 5500],
  audio: [
    A('mount', 'Uch narsani tiklaymiz. Bu baho emas.', 'Восстановим три вещи. Это не оценка.', 'Let us restore three things. This is not graded.'),
    A('c1', "Birinchi tayanch. Sakkiz bu ikkining kubi, o'n olti esa ikkining to'rtinchi darajasi. Bugun ikkala son ham chegara bo'ladi.", 'Первая опора. Восемь это два в кубе, а шестнадцать это два в четвёртой. Сегодня оба числа станут границами.', 'First basic. Eight is two cubed, sixteen is two to the fourth. Today both numbers will become boundaries.'),
    A('c2', "Ikkinchi tayanch. Logarifm ostida faqat musbat son turadi, ya'ni logarifmli shart o'zi bilan yana bitta chegara olib keladi.", 'Вторая опора. Под логарифмом стоит только положительное, то есть условие с логарифмом само приносит с собой ещё одну границу.', 'Second basic. Only a positive number stands under a logarithm, so a condition with a logarithm brings one more boundary with it.'),
    A('c3', "Uchinchi tayanch, va bugun asosiysi. Kesishma bu umumiy qism. Iks uchdan katta va iks o'n oltidan kichik bo'lsa, javob faqat ular ikkalasi ham bajariladigan joy.", 'Третья опора, и сегодня она главная. Пересечение это общая часть. Если икс больше трёх и икс меньше шестнадцати, ответ только там, где выполняются оба.', 'Third basic, and today the main one. An intersection is the common part. If x is greater than three and x is less than sixteen, the answer is only where both hold.'),
    A('recap', "Qisqacha: sakkiz va o'n olti ikkining darajalari, logarifm musbatlikni talab qiladi, kesishma esa umumiy qism.", 'Коротко: восемь и шестнадцать это степени двойки, логарифм требует положительности, а пересечение это общая часть.', 'Briefly: eight and sixteen are powers of two, a logarithm requires positivity, and an intersection is the common part.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. Har nuqta O'Z ishini qiladi.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'intersection',
  eyebrow: L('Nuqta bilan tekshiramiz', 'Проверим точкой', 'Let us check with a point'),
  title: L('Ikkala shart ham bajarilsin', 'Оба условия сразу', 'Both conditions at once'),
  expr: SYS_HOOK,
  goal: L('IKKALASI ham bajarilishi kerak', 'должны выполниться ОБА', 'BOTH must hold'),
  rule: L(
    "Son sistemaning yechimi bo'ladi, agar u IKKALA shartni ham bajarsa. Bittasi yetarli emas.",
    'Число является решением системы, если оно выполняет ОБА условия. Одного мало.',
    'A number is a solution of the system if it satisfies BOTH conditions. One is not enough.',
  ),
  pick: L('Qaysi sonni qo\'yamiz?', 'Какое число подставим?', 'Which number shall we substitute?'),
  claims: [
    { id: 'a', key: 'inA', name: L('birinchi yechim', 'первое решение', 'first solution'), value: '(3; 16)' },
    { id: 'b', key: 'inB', name: L('ikkinchi yechim', 'второе решение', 'second solution'), value: '(0; +∞)' },
  ],
  axis: AXIS_1,
  sets: [{ from: 3, to: 16, tone: 'graph' }, { from: 0, to: null, tone: 'tip' }],
  points: [
    {
      id: 'p4', label: 'x = 4', num: '4', mark: 4, step: 'calc', verdict: 'in',
      role: L('ikkala shart ham', 'оба условия', 'both conditions'),
      calc: L('16 > 8 ✓   va   log₂ 4 = 2 < 4 ✓', '16 > 8 ✓   и   log₂ 4 = 2 < 4 ✓', '16 > 8 ✓   and   log₂ 4 = 2 < 4 ✓'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'p20', label: 'x = 20', num: '20', mark: 20, step: 'calc', verdict: 'out',
      role: L('faqat birinchi shart', 'только первое условие', 'only the first condition'),
      calc: L('2²⁰ > 8 ✓   lekin   log₂ 20 > 4 ✗', '2²⁰ > 8 ✓   но   log₂ 20 > 4 ✗', '2²⁰ > 8 ✓   but   log₂ 20 > 4 ✗'),
      sol: false, inA: false, inB: true,
    },
    {
      id: 'p2', label: 'x = 2', num: '2', mark: 2, step: 'calc', verdict: 'out',
      role: L('birinchisi ham bajarilmadi', 'не выполнено и первое', 'not even the first'),
      calc: '4 > 8 ✗',
      sol: false, inA: false, inB: true,
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    items: [
      {
        id: 'a', label: '(3; 16)', correct: true,
        ok: L("To'g'ri. Yigirma birinchi shartni bajardi, ikkinchisini yo'q — demak u yechim emas, keng javobga esa u kiradi.", 'Верно. Двадцать выполнило первое условие и не выполнило второе — значит оно не решение, а в широкий ответ оно входит.', 'Correct. Twenty satisfied the first condition and failed the second, so it is not a solution, yet the wide answer contains it.'),
      },
      {
        id: 'b', label: '(0; +∞)',
        hint: L("Yigirmani oling. Ikkining yigirmanchi darajasi sakkizdan katta, lekin yigirmaning logarifmi to'rtdan katta. Ikkinchi shart bajarilmadi, demak yigirma yechim emas.", 'Возьми двадцать. Два в двадцатой больше восьми, но логарифм двадцати больше четырёх. Второе условие не выполнено, значит двадцать не решение.', 'Take twenty. Two to the twentieth is greater than eight, but the logarithm of twenty is greater than four. The second condition fails, so twenty is not a solution.'),
      },
    ],
  },
  holds: [2500, 6500, 1500, 2500, 12000, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Bahsga qaytamiz.', 'Опора восстановлена. Вернёмся к спору.', 'The basics are back. Let us return to the argument.'),
    A('mount', "Mezon oddiy: son sistemaning yechimi bo'lishi uchun IKKALA shartni ham bajarishi kerak. Bittasi yetmaydi.", 'Правило простое: чтобы число было решением системы, оно должно выполнить ОБА условия. Одного мало.', 'The rule is simple: for a number to be a solution of the system it must satisfy BOTH conditions. One is not enough.'),
    A('mount', "Sonni tanlang.", 'Выбери число.', 'Pick a number.'),
    A('calc', 'Ikkala shartni ham tekshiramiz.', 'Проверяем оба условия.', 'We check both conditions.'),
    A('mark', "Uch son tekshirildi. To'rt ikkalasini ham bajardi. Yigirma birinchisini bajardi, ikkinchisini yo'q: yigirma o'n oltidan katta. Ikki esa birinchisini ham bajarmadi. Demak yechim faqat ikkala shart kesishgan joyda.", 'Три числа проверены. Четвёрка выполнила оба. Двадцать выполнило первое и не выполнило второе: двадцать больше шестнадцати. А двойка не выполнила даже первое. Значит решение только там, где условия пересекаются.', 'Three numbers checked. Four satisfied both. Twenty satisfied the first and failed the second: twenty is greater than sixteen. And two failed even the first. So the solution is only where the conditions overlap.'),
    A('next', 'Bitta son ikki javobni ajratdi. Qaysi biri to\'g\'ri?', 'Одно число развело два ответа. Какой из них верный?', 'One number separated the two answers. Which of them is correct?'),
  ],
}

// ============================================================
// SLAYD 4. GRAFIK: ikkinchi shart O'ZI ikkita chegara beradi.
// ============================================================
const LOG2 = (x) => Math.log(x) / Math.log(2)

const S4 = {
  role: 'graph',
  tag: 'log_domain',
  drag: false,
  eyebrow: L('Ikkinchi shart', 'Второе условие', 'The second condition'),
  title: L('Bitta shart — ikkita chegara', 'Одно условие — две границы', 'One condition, two boundaries'),
  chip: 'y = log₂ x',
  graph: {
    fn: LOG2,
    xDomain: [-2, 22],
    yDomain: [-4, 6],
    asymptote: 0,
    hline: 4,
    cross: 16,
    shade: { from: 0, to: 16 },
    shadeLabel: '(0; 16)',
    xTicks: [{ v: 0 }, { v: 4 }, { v: 16 }],
    yTicks: [{ v: 0 }, { v: 4 }],
    height: 168,
  },
  bonus: L(
    "Shuning uchun logarifmli shart har doim ikki tomonlama: pastdan uni aniqlanish sohasi, yuqoridan esa tengsizlikning o'zi cheklaydi.",
    'Поэтому условие с логарифмом всегда двустороннее: снизу его ограничивает область определения, сверху — само неравенство.',
    'That is why a condition with a logarithm is always two-sided: the domain bounds it from below, the inequality itself from above.',
  ),
  probe: {
    question: L('log₂ x < 4 shartining yechimi qanday?', 'Каково решение условия log₂ x < 4 ?', 'What is the solution of the condition log₂ x < 4 ?'),
    items: [
      { id: 'a', label: '(0; 16)', correct: true },
      { id: 'b', label: '(−∞; 16)', hint: L("Noldan chapda kirivi umuman yo'q, demak u yerdagi sonlar yechim bo'lolmaydi.", 'Левее нуля кривой нет совсем, значит числа оттуда решением быть не могут.', 'To the left of zero there is no curve at all, so numbers from there cannot be solutions.') },
      { id: 'c', label: '(16; +∞)', hint: L("O'n oltidan o'ngda kirivi to'g'ri chiziqdan YUQORIDA, ya'ni logarifm to'rtdan katta.", 'Правее шестнадцати кривая ВЫШЕ прямой, то есть логарифм больше четырёх.', 'To the right of sixteen the curve is ABOVE the line, so the logarithm is greater than four.') },
      { id: 'd', label: '(0; 4)', hint: L("To'rt bu logarifmning QIYMATI, chegara emas. Chegara o'n olti.", 'Четвёрка это ЗНАЧЕНИЕ логарифма, а не граница. Граница шестнадцать.', 'Four is the VALUE of the logarithm, not the boundary. The boundary is sixteen.') },
    ],
  },
  holds: [5000, 4000, 4500, 5500, 7000],
  audio: [
    A('mount', "Nuqta javobni ko'rsatdi. Endi ikkinchi shartni alohida ko'ramiz.", 'Точка показала ответ. Теперь посмотрим на второе условие отдельно.', 'The point showed the answer. Now let us look at the second condition on its own.'),
    A('curve', "Mana logarifmning kirivisi. Noldan chapda u umuman yo'q.", 'Вот кривая логарифма. Левее нуля её нет совсем.', 'Here is the logarithm curve. To the left of zero it does not exist at all.'),
    A('line', "To'rt balandligida to'g'ri chiziq. U kirivini o'n oltida kesib o'tadi.", 'Прямая на высоте четыре. Она пересекает кривую в шестнадцати.', 'A line at height four. It crosses the curve at sixteen.'),
    A('shade', "Bizga logarifm to'rtdan kichik joy kerak, ya'ni kirivi to'g'ri chiziqdan past bo'lgan joy.", 'Нам нужно, где логарифм меньше четырёх, то есть где кривая ниже прямой.', 'We need where the logarithm is less than four, that is where the curve is below the line.'),
    A('shadow', "Va mana eng muhimi: soya IKKI tomondan chegaralangan. Yuqoridan o'n olti, pastdan esa nol, chunki chapda kirivi yo'q. Bitta shart ikkita chegara berdi.", 'И вот главное: тень ограничена с ДВУХ сторон. Сверху шестнадцать, а снизу ноль, потому что левее кривой нет. Одно условие дало две границы.', 'And here is the main thing: the shadow is bounded on BOTH sides. Sixteen from above, and zero from below, because there is no curve to the left. One condition gave two boundaries.'),
  ],
}

// ============================================================
// SLAYD 5. 1-QOIDA: har shartni alohida, keyin kesishma.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'intersection',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Har birini alohida', 'Каждое отдельно', 'Each one separately'),
  rows: ['2ˣ > 2³   →   x > 3', 'log₂ x < 4   →   0 < x < 16', 'x > 3   va   x < 16'],
  probe: {
    question: L(
      "Ikki to'plam topildi. Javobga nima yoziladi?",
      'Два множества найдены. Что пойдёт в ответ?',
      'Two sets are found. What goes into the answer?',
    ),
    items: [
      { id: 'a', label: L('umumiy qism: (3; 16)', 'общая часть: (3; 16)', 'the common part: (3; 16)'), correct: true },
      { id: 'b', label: L('ikkalasi birga: (0; +∞)', 'оба вместе: (0; +∞)', 'both together: (0; +∞)'), hint: L("Bu birlashma bo'lardi. Sistemada esa shartlar BIRGA bajarilishi kerak.", 'Это было бы объединение. В системе же условия должны выполняться ВМЕСТЕ.', 'That would be a union. In a system the conditions must hold TOGETHER.') },
      { id: 'c', label: L('birinchisi: (3; +∞)', 'первое: (3; +∞)', 'the first: (3; +∞)'), hint: L("Unda ikkinchi shart nima uchun kerak edi? Yigirmani tekshiring.", 'Тогда зачем было второе условие? Проверь двадцать.', 'Then why was there a second condition? Check twenty.') },
      { id: 'd', label: L('ikkinchisi: (0; 16)', 'второе: (0; 16)', 'the second: (0; 16)'), hint: L("Unda birinchi shart nima uchun kerak edi? Ikkini tekshiring.", 'Тогда зачем было первое условие? Проверь двойку.', 'Then why was there a first condition? Check two.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Sistema bu VA', 'Правило 1. Система это И', 'Rule 1. A system means AND'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('yechim = kesishma', 'решение = пересечение', 'solution = intersection'),
    lines: [
      L('har shartni ALOHIDA yech', 'реши каждое условие ОТДЕЛЬНО', 'solve each condition SEPARATELY'),
      L("logarifmli shart o'zi bilan musbatlikni olib keladi", 'условие с логарифмом само приносит положительность', 'a condition with a logarithm brings positivity by itself'),
      L("to'plamlarni bitta o'qqa qo'y va UMUMIY qismini ol", 'положи множества на одну прямую и возьми ОБЩУЮ часть', 'put the sets on one line and take the COMMON part'),
      L("javobni ikkala shartga ham qo'yib tekshir", 'проверь ответ подстановкой в оба условия', 'check the answer by substituting into both conditions'),
    ],
    example: L('misol:  x > 3  va  0 < x < 16  →  (3; 16)', 'пример:  x > 3  и  0 < x < 16  →  (3; 16)', 'example:  x > 3  and  0 < x < 16  →  (3; 16)'),
  },
  holds: [4000, 6000, 5000],
  audio: [
    A('mount', "Chizmani ko'rdik. Endi sistemani yozuv bilan yechamiz.", 'Чертёж мы увидели. Теперь решим систему записью.', 'We have seen the drawing. Now let us solve the system in writing.'),
    A('first', "Birinchi shart: sakkiz bu ikkining kubi, demak iks uchdan katta.", 'Первое условие: восемь это два в кубе, значит икс больше трёх.', 'The first condition: eight is two cubed, so x is greater than three.'),
    A('second', "Ikkinchi shart: iks noldan katta va o'n oltidan kichik. Ikkita chegara, buni chizmada ko'rdik.", 'Второе условие: икс больше нуля и меньше шестнадцати. Две границы, мы это видели на чертеже.', 'The second condition: x is greater than zero and less than sixteen. Two boundaries, we saw that in the drawing.'),
    A('rule', "Aynan shunday. Sistema bu VA, demak javobga faqat umumiy qism ketadi.", 'Именно так. Система это И, значит в ответ идёт только общая часть.', 'Exactly. A system means AND, so only the common part goes into the answer.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: ikki noma'lum.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'check_by_point',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Ikki noma\'lum', 'Два неизвестных', 'Two unknowns'),
  was: { label: UI.was, expr: SYS_HOOK },
  now: { label: UI.now, expr: SYS_NEW },
  probe1: {
    question: L('Ikkinchi sistema birinchisidan nimasi bilan farq qiladi?', 'Чем вторая система отличается от первой?', 'How does the second system differ from the first?'),
    items: [
      { id: 'a', label: L("ikkita noma'lum: x va y", 'два неизвестных: x и y', 'two unknowns: x and y'), correct: true },
      { id: 'b', label: L('tengsizlik emas, tenglama', 'это уравнения, а не неравенства', 'these are equations, not inequalities'), hint: L("To'g'ri kuzatildi, lekin asosiy farq bu emas. Harflarni sanang.", 'Замечено верно, но главное отличие не в этом. Посчитай буквы.', 'A correct observation, but that is not the main difference. Count the letters.') },
      { id: 'c', label: L('asos boshqa', 'основание другое', 'the base is different'), hint: L("Asos o'sha ikki.", 'Основание то же, двойка.', 'The base is the same, two.') },
      { id: 'd', label: L('logarifm yo\'q', 'нет логарифма', 'there is no logarithm'), hint: L("Logarifm yo'q, bu rost. Lekin qiyinchilik boshqa joyda.", 'Логарифма нет, это правда. Но трудность в другом.', 'There is no logarithm, true. But the difficulty is elsewhere.') },
    ],
  },
  probe2: {
    question: L('Javob qanday ko\'rinishda bo\'ladi?', 'Каким будет ответ?', 'What will the answer look like?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: L('sonlar jufti', 'пара чисел', 'a pair of numbers') },
      { id: 'b', label: L('oraliq', 'промежуток', 'an interval') },
      { id: 'c', label: L('bitta son', 'одно число', 'a single number') },
      { id: 'd', label: L("yechim yo'q", 'решений нет', 'no solutions') },
    ],
  },
  holds: [4500, 7000, 3500, 3500],
  audio: [
    A('mount', "Birinchi qoida tayyor. Endi sistema boshqacha ko'rinadi.", 'Первое правило готово. Теперь система выглядит иначе.', 'The first rule is ready. Now the system looks different.'),
    A('now', "Bu yerda ikkita harf bor: iks va igrek. Va tenglamalar ham ikkita. Bir tenglama ikki noma'lumni topolmaydi -- shuning uchun ular birga turibdi.", 'Здесь две буквы: икс и игрек. И уравнений тоже два. Одно уравнение два неизвестных не найдёт, поэтому они и стоят вместе.', 'Here there are two letters: x and y. And two equations as well. One equation cannot find two unknowns, that is why they stand together.'),
    A('q1', 'Bu sistema oldingisidan nimasi bilan farq qiladi?', 'Чем эта система отличается от прежней?', 'How does this system differ from the previous one?'),
    A('q2', "Sizningcha javob qanday ko'rinishda bo'ladi? Shunchaki taxmin qiling.", 'Как думаешь, каким будет ответ? Просто предположи.', 'What do you think the answer will look like? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD, va BIRINCHI tenglama ularni AJRATMAYDI.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'check_by_point',
  eyebrow: L('Ikkisini ham tekshiramiz', 'Проверим оба', 'Let us check both'),
  title: L('Nega ikkinchi tenglama kerak', 'Зачем нужно второе уравнение', 'Why the second equation is needed'),
  expr: '2ˣ⁺ʸ = 8,   x − y = 1',
  need: L('ikkala tenglama ham', 'оба уравнения', 'both equations'),
  answerLabel: L('birinchi juft', 'первая пара', 'the first pair'),
  cards: [
    {
      tag: L('A nomzod', 'кандидат A', 'candidate A'),
      txt: 'x = 2,  y = 1',
      point: {
        label: '2³ = 8 ✓',
        calc: '2 − 1 = 1 ✓',
        verdict: 'in',
      },
    },
    {
      tag: L('B nomzod', 'кандидат B', 'candidate B'),
      txt: 'x = 1,  y = 2',
      point: {
        label: '2³ = 8 ✓',
        calc: '1 − 2 = −1 ✗',
        verdict: 'out',
      },
    },
  ],
  answer: {
    kind: 'value',
    slots: 2,
    labels: ['x =', 'y ='],
    numbers: ['−1', '0', '1', '2', '3'],
    value: ['2', '1'],
    prompt: L('Juftni yozing', 'Запиши пару', 'Write the pair'),
    wrongs: [
      { key: '1|2', hint: L("Birinchi tenglama bu juftni ham o'tkazadi: yig'indi baribir uch. Ikkinchisini tekshiring: bir minus ikki bu minus bir, bizga esa bir kerak.", 'Первое уравнение пропускает и эту пару: сумма всё равно три. Проверь второе: один минус два это минус один, а нужно один.', 'The first equation lets this pair through as well: the sum is three anyway. Check the second: one minus two is minus one, but we need one.') },
      { key: '*', hint: L("Yig'indi uchga, ayirma esa birga teng bo'lishi kerak.", 'Сумма должна равняться трём, а разность единице.', 'The sum must equal three and the difference one.') },
    ],
  },
  holds: [3000, 8000, 7000, 5000],
  audio: [
    A('mount', 'Siz taxmin qildingiz. Endi ikkala nomzodni ham tekshiramiz.', 'Прогноз есть. Проверим обоих кандидатов.', 'You made a guess. Let us check both candidates.'),
    A('p1', "Birinchi nomzod: iks ikki, igrek bir. Yig'indi uch, ikkining kubi sakkiz, birinchi tenglama bajarildi. Ayirma bir, ikkinchisi ham bajarildi.", 'Первый кандидат: икс два, игрек один. Сумма три, два в кубе восемь, первое уравнение выполнено. Разность один, второе тоже выполнено.', 'First candidate: x is two, y is one. The sum is three, two cubed is eight, the first equation holds. The difference is one, the second holds too.'),
    A('p2', "Ikkinchi nomzod: iks bir, igrek ikki. Diqqat qiling: yig'indi YANA uch, ya'ni birinchi tenglama bu juftni ham o'tkazadi. Uni ikkinchi tenglama ushlaydi: bir minus ikki bu minus bir.", 'Второй кандидат: икс один, игрек два. Обрати внимание: сумма СНОВА три, то есть первое уравнение пропускает и эту пару. Ловит её второе: один минус два это минус один.', 'Second candidate: x is one, y is two. Notice: the sum is AGAIN three, so the first equation lets this pair through too. The second one catches it: one minus two is minus one.'),
    A('write', "Mana javob savolga, nega sistemada ikkinchi tenglama kerak. Endi javobni yozing.", 'Вот и ответ на вопрос, зачем в системе второе уравнение. Теперь запиши ответ.', 'And there is the answer to why a system needs a second equation. Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 8. 2-QOIDA va JAMLANMA.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'intersection',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Bitta qoida', 'Одно правило', 'One rule'),
  cases: [
    {
      label: L('bitta noma\'lum', 'одно неизвестное', 'one unknown'),
      text: L("javob — to'plamlar kesishmasi", 'ответ — пересечение множеств', 'the answer is the intersection of the sets'),
      tone: 'graph',
    },
    {
      label: L("ikkita noma'lum", 'два неизвестных', 'two unknowns'),
      text: L('javob — sonlar jufti', 'ответ — пара чисел', 'the answer is a pair of numbers'),
      tone: 'accent',
    },
  ],
  rows: ['x + y = 3,   x − y = 1', 'x = 2,   y = 1'],
  probe: {
    question: L("Ikkala holatda ham umumiy narsa nima?", 'Что общего в обоих случаях?', 'What is common to both cases?'),
    items: [
      { id: 'a', label: L('ikkala shart ham bir vaqtda bajarilishi kerak', 'оба условия должны выполняться одновременно', 'both conditions must hold at the same time'), correct: true },
      { id: 'b', label: L('ikkalasida ham daraja bor', 'в обоих есть степень', 'both contain a power'), hint: L("Daraja tasodifiy. Ikkinchi sistemada tenglamalardan biri oddiy chiziqli.", 'Степень случайна. Во второй системе одно из уравнений обычное линейное.', 'The power is incidental. In the second system one equation is an ordinary linear one.') },
      { id: 'c', label: L("ikkalasida ham javob oraliq", 'в обоих ответ промежуток', 'in both the answer is an interval'), hint: L("Ikkinchi sistemada javob juft, oraliq emas.", 'Во второй системе ответ пара, а не промежуток.', 'In the second system the answer is a pair, not an interval.') },
      { id: 'd', label: L('hech narsa, ular butunlay boshqa', 'ничего, они совсем разные', 'nothing, they are entirely different'), hint: L("Umumiylik bor, va u eng muhimi: ikkala shart ham BIRGA bajariladi.", 'Общее есть, и оно главное: оба условия выполняются ВМЕСТЕ.', 'There is something common, and it is the main thing: both conditions hold TOGETHER.') },
    ],
  },
  rule: {
    badge: L("2-qoida. Ikki noma'lum", 'Правило 2. Два неизвестных', 'Rule 2. Two unknowns'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('javob — juft (x; y)', 'ответ — пара (x; y)', 'the answer is a pair (x; y)'),
    lines: [
      L("darajali tenglamani ko'rsatkichlar tengligiga aylantir", 'уравнение со степенью сведи к равенству показателей', 'turn the equation with a power into an equality of exponents'),
      L('oddiy sistemani yech', 'реши обычную систему', 'solve the ordinary system'),
      L("juftni IKKALA tenglamaga ham qo'yib tekshir", 'проверь пару подстановкой в ОБА уравнения', 'check the pair by substituting into BOTH equations'),
      L('bitta tenglama ikki juftni ajrata olmaydi', 'одно уравнение не различает две пары', 'one equation does not tell two pairs apart'),
    ],
    example: L('misol:  x = 2,  y = 1', 'пример:  x = 2,  y = 1', 'example:  x = 2,  y = 1'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('sistema = VA', 'система = И', 'system = AND'),
    lines: [
      L('1. har shartni alohida yech', '1. реши каждое условие отдельно', '1. solve each condition separately'),
      L("2. bitta noma'lum bo'lsa — to'plamlarning umumiy qismini ol", '2. одно неизвестное — возьми общую часть множеств', '2. one unknown — take the common part of the sets'),
      L("3. ikkita noma'lum bo'lsa — juftni top", '3. два неизвестных — найди пару', '3. two unknowns — find the pair'),
      L('4. javobni IKKALA shartga ham qo\'yib tekshir', '4. проверь ответ подстановкой в ОБА условия', '4. check the answer by substituting into BOTH conditions'),
    ],
  },
  holds: [4500, 5000, 3000, 4000],
  audio: [
    A('mount', "Ikki xil sistema ko'rdik. Endi ularda umumiy nima borligini topamiz.", 'Мы видели две разные системы. Теперь найдём, что в них общего.', 'We have seen two different systems. Now let us find what they have in common.'),
    A('rows', "Ikkining iks plyus igrek darajasi sakkizga teng, demak iks plyus igrek uchga teng. Ikkinchi tenglama esa ayirma bir deydi. Ikkitasidan iks ikki, igrek bir chiqadi.", 'Два в степени икс плюс игрек равно восьми, значит икс плюс игрек равно трём. А второе уравнение говорит, что разность единица. Из двух вместе выходит икс два, игрек один.', 'Two to the power x plus y equals eight, so x plus y equals three. And the second equation says the difference is one. From the two together we get x is two, y is one.'),
    A('q', "Ikkala holatda ham umumiy narsa nima?", 'Что общего в обоих случаях?', 'What is common to both cases?'),
    A('rule', "To'g'ri. Sistema har doim VA degani: shartlar bir vaqtda bajariladi.", 'Верно. Система всегда означает И: условия выполняются одновременно.', 'Correct. A system always means AND: the conditions hold at the same time.'),
    A('both', 'Endi ikkala holatni bitta qoidaga yig\'ing.', 'А теперь собери оба случая в одно правило.', 'Now combine both cases into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. PASTKI CHEGARANI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'log_domain',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Pastki chegara', 'Нижняя граница', 'The lower boundary'),
  left: 'log₂ x < 4',
  template: [{ slot: 0 }, ' < x < 16'],
  signs: ['0', '−∞', '1'],
  answer: '0',
  checkNote: L(
    "Tekshiruv: x = 0,5 da logarifm manfiy, ya'ni to'rtdan kichik — shart bajariladi",
    'Проверка: при x = 0,5 логарифм отрицателен, то есть меньше четырёх — условие выполняется',
    'Check: at x = 0,5 the logarithm is negative, hence less than four — the condition holds',
  ),
  wrongs: [
    { key: '−∞', hint: L("Manfiy sonning logarifmi yo'q. Chapdan chegara bor, va u nol.", 'Логарифма отрицательного числа не существует. Граница слева есть, и это ноль.', 'There is no logarithm of a negative number. There is a boundary on the left, and it is zero.') },
    { key: '1', hint: L("Bir ortiqcha: nol butun besh ham yaroqli, uning logarifmi manfiy va to'rtdan kichik.", 'Единица лишняя: нуль целых пять тоже годится, его логарифм отрицателен и меньше четырёх.', 'One is too strong: zero point five is fine as well, its logarithm is negative and less than four.') },
  ],
  probe: {
    question: L("Pastki chegara qayerdan keldi?", 'Откуда взялась нижняя граница?', 'Where did the lower boundary come from?'),
    items: [
      { id: 'a', label: L("logarifmning o'zidan: ostida faqat musbat son", 'из самого логарифма: под ним только положительное', 'from the logarithm itself: only a positive number under it'), correct: true },
      { id: 'b', label: L("tengsizlik ishorasidan", 'из знака неравенства', 'from the inequality sign'), hint: L("Ishora yuqori chegarani berdi. Pastkisi boshqa joydan.", 'Знак дал верхнюю границу. Нижняя пришла из другого места.', 'The sign gave the upper boundary. The lower one came from elsewhere.') },
      { id: 'c', label: L("to'rt sonidan", 'из четвёрки', 'from the four'), hint: L("To'rtdan o'n olti chiqdi, ya'ni YUQORI chegara.", 'Из четвёрки получилась шестнадцать, то есть ВЕРХНЯЯ граница.', 'The four gave sixteen, that is the UPPER boundary.') },
      { id: 'd', label: L('sistemadagi ikkinchi shartdan', 'из второго условия системы', 'from the second condition of the system'), hint: L("Bu shart o'zi bilan yolg'iz turganda ham pastki chegara qoladi.", 'Это условие сохраняет нижнюю границу и когда стоит одно.', 'This condition keeps the lower boundary even when it stands alone.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Pastki chegarani qo'ying.", 'Поставь нижнюю границу.', 'Place the lower boundary.'),
    A('checked', "Bo'ldi. Endi ta'riflang: u qayerdan keldi?", 'Получилось. Теперь сформулируй: откуда она взялась?', 'Done. Now put it into words: where did it come from?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'first', label: L('birinchi shartni yechish', 'решить первое условие', 'solve the first condition') },
  { id: 'second', label: L('ikkinchi shartni yechish', 'решить второе условие', 'solve the second condition') },
  { id: 'cross', label: L('umumiy qismni olish', 'взять общую часть', 'take the common part') },
  { id: 'union', label: L('ikkalasini birlashtirish', 'объединить оба', 'unite both') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'intersection',
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: SYS_HOOK,
  actions: ACTIONS_10,
  axis: AXIS_1,
  correctSet: { from: 3, to: 16 },
  steps: [
    {
      action: 'first',
      to: 'x > 3',
      wrongs: [
        { action: 'cross', hint: L("Kesishtiradigan narsa yo'q: hali birorta shart yechilmagan.", 'Пересекать нечего: ещё ни одно условие не решено.', 'There is nothing to intersect: no condition is solved yet.') },
        {
          action: 'union',
          set: { from: 0, to: null },
          hint: L("Birlashma bu «yoki». Qarang: to'plam butun o'ngga yoyildi. x = 20 ni tekshiring — ikkinchi shart bajarilmaydi.", 'Объединение это «или». Смотри: множество разошлось вправо. Проверь x = 20 — второе условие не выполняется.', 'A union is "or". Look: the set spread to the right. Check x = 20 — the second condition fails.'),
        },
      ],
    },
    {
      action: 'second',
      to: '0 < x < 16',
      wrongs: [
        { action: 'first', hint: L("Birinchi shart allaqachon yechilgan.", 'Первое условие уже решено.', 'The first condition is already solved.') },
        { action: 'cross', hint: L("Avval ikkinchi shartni yeching, keyin kesishtiring.", 'Сначала реши второе условие, потом пересекай.', 'Solve the second condition first, then intersect.') },
        { action: 'union', hint: L("Sistemada birlashma emas, kesishma.", 'В системе не объединение, а пересечение.', 'In a system it is an intersection, not a union.') },
      ],
    },
    {
      action: 'cross',
      to: '(3; 16)',
      wrongs: [
        { action: 'union', hint: L("Sistema bu VA. Umumiy qismni oling.", 'Система это И. Возьми общую часть.', 'A system means AND. Take the common part.') },
        { action: 'first', hint: L("Ikkala shart ham yechilgan.", 'Оба условия уже решены.', 'Both conditions are already solved.') },
        { action: 'second', hint: L("Ikkala shart ham yechilgan.", 'Оба условия уже решены.', 'Both conditions are already solved.') },
      ],
    },
  ],
  answer: {
    numbers: ['0', '3', '16', '+∞'],
    value: ['3', '16'],
    prompt: L('Javobni imtihonda yozganingizdek yozing', 'Запиши ответ так, как пишут на экзамене', 'Write the answer the way you would on the exam'),
    wrongs: [
      { key: '0|16', hint: L("Bu faqat ikkinchi shart. Birinchisi uchdan kichik sonlarni tashlaydi.", 'Это только второе условие. Первое отбрасывает числа меньше трёх.', 'That is only the second condition. The first discards numbers below three.') },
      { key: '3|+∞', hint: L("Bu faqat birinchi shart. Ikkinchisi o'n oltidan katta sonlarni tashlaydi.", 'Это только первое условие. Второе отбрасывает числа больше шестнадцати.', 'That is only the first condition. The second discards numbers above sixteen.') },
      { key: '*', hint: L("Oxirgi satrga qarang.", 'Смотри на последнюю строку.', 'Look at the last line.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi sistemani to\'liq o\'tamiz.', 'Правило сформулировано. Пройдём систему целиком.', 'The rule is yours now. Let us go through the system completely.'),
    A('start', "Ikki shart bor. Nimadan boshlashni tanlang.", 'Есть два условия. Выбери, с чего начать.', 'There are two conditions. Choose where to start.'),
    A('step4', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL, SON O'QISIZ.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'intersection',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Sistemani yeching', 'Реши систему', 'Solve the system'),
  start: '5ˣ < 125,   log₅ x > 0',
  actions: ACTIONS_10,
  hint: L(
    "Nolinchi daraja birga teng: log₅ x noldan katta bo'lsa, x birdan katta.",
    'Нулевая степень равна единице: если log₅ x больше нуля, то x больше единицы.',
    'The zero power equals one: if log₅ x is greater than zero, then x is greater than one.',
  ),
  steps: [
    {
      action: 'first',
      to: 'x < 3',
      wrongs: [
        { action: 'cross', hint: L("Hali kesishtiradigan narsa yo'q.", 'Пересекать пока нечего.', 'There is nothing to intersect yet.') },
        { action: 'second', hint: L("Tartib muhim emas, lekin bittasidan boshlang va oxiriga yetkazing.", 'Порядок не важен, но начни с одного и доведи до конца.', 'The order does not matter, but start with one and finish it.') },
        { action: 'union', hint: L("Sistemada birlashma emas.", 'В системе не объединение.', 'A system is not a union.') },
      ],
    },
    {
      action: 'second',
      to: 'x > 1',
      wrongs: [
        { action: 'first', hint: L("Birinchi shart yechilgan.", 'Первое условие решено.', 'The first condition is solved.') },
        { action: 'cross', hint: L("Avval ikkinchi shartni yeching.", 'Сначала реши второе условие.', 'Solve the second condition first.') },
        { action: 'union', hint: L("Sistemada birlashma emas.", 'В системе не объединение.', 'A system is not a union.') },
      ],
    },
    {
      action: 'cross',
      to: '(1; 3)',
      wrongs: [
        { action: 'union', hint: L("Sistema bu VA.", 'Система это И.', 'A system means AND.') },
        { action: 'first', hint: L("Ikkala shart ham yechilgan.", 'Оба условия решены.', 'Both conditions are solved.') },
        { action: 'second', hint: L("Ikkala shart ham yechilgan.", 'Оба условия решены.', 'Both conditions are solved.') },
      ],
    },
  ],
  answer: {
    numbers: ['0', '1', '3', '5', '+∞'],
    value: ['1', '3'],
    prompt: L("Javobni oraliq ko'rinishida yozing", 'Запиши ответ промежутком', 'Write the answer as an interval'),
    wrongs: [
      { key: '0|3', hint: L("Logarifm noldan KATTA, ya'ni x birdan katta, noldan emas. x = 0,5 ni tekshiring.", 'Логарифм БОЛЬШЕ нуля, значит x больше единицы, а не нуля. Проверь x = 0,5.', 'The logarithm is GREATER than zero, so x is greater than one, not zero. Check x = 0,5.') },
      { key: '1|5', hint: L("Bir yuz yigirma besh bu beshning kubi, demak yuqori chegara uch.", 'Сто двадцать пять это пять в кубе, значит верхняя граница три.', 'One hundred twenty five is five cubed, so the upper boundary is three.') },
      { key: '*', hint: L("Ikki shartning umumiy qismini oling.", 'Возьми общую часть двух условий.', 'Take the common part of the two conditions.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, o'qsiz, xuddi imtihondagidek.", 'Теперь полностью сам, и без прямой, как на экзамене.', 'Now completely on your own, and without the line, as on the exam.'),
    A('go', "Har shartni alohida yeching, keyin umumiy qismini oling.", 'Реши каждое условие отдельно, потом возьми общую часть.', 'Solve each condition separately, then take the common part.'),
    A('answered', "Javobni oraliq ko'rinishida yozing.", 'Ответ запиши промежутком.', 'Write the answer as an interval.'),
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
      id: 'b1', tag: 'intersection', ask: true, cols: 4,
      done: L('x > 2 va x < 7  →  (2; 7)', 'x > 2 и x < 7  →  (2; 7)', 'x > 2 and x < 7  →  (2; 7)'),
      prompt: L("x > 2 va x < 7 bo'lsa, javobda nima bo'ladi?", 'Что в ответе, если x > 2 и x < 7 ?', 'What is the answer if x > 2 and x < 7 ?'),
      items: [
        { id: 'a', label: '(2; 7)', correct: true },
        { id: 'b', label: '(−∞; +∞)', hint: L("Bu birlashma bo'lardi. Sistemada umumiy qism olinadi.", 'Это было бы объединение. В системе берётся общая часть.', 'That would be a union. In a system the common part is taken.') },
        { id: 'c', label: '(2; +∞)', hint: L("Bu faqat birinchi shart. Ikkinchisi yettidan kattalarni tashlaydi.", 'Это только первое условие. Второе отбрасывает больше семи.', 'That is only the first condition. The second discards numbers above seven.') },
        { id: 'd', label: L("yechim yo'q", 'решений нет', 'no solutions'), hint: L("Umumiy qism bor: masalan uch, to'rt, besh.", 'Общая часть есть: например три, четыре, пять.', 'There is a common part: three, four, five for instance.') },
      ],
    },
    {
      id: 'b2', tag: 'log_domain', prompt: 'log₃ x < 2', cols: 4,
      items: [
        { id: 'a', label: '(0; 9)', correct: true },
        { id: 'b', label: '(−∞; 9)', hint: L("Logarifm ostida manfiy son turolmaydi: pastdan chegara nol.", 'Под логарифмом отрицательное стоять не может: снизу граница ноль.', 'A negative number cannot stand under a logarithm: the lower boundary is zero.') },
        { id: 'c', label: '(0; 6)', hint: L("Uchning kvadrati to'qqiz, olti emas.", 'Три в квадрате это девять, а не шесть.', 'Three squared is nine, not six.') },
        { id: 'd', label: '(9; +∞)', hint: L("Logarifm ikkidan KICHIK, demak x to'qqizdan kichik.", 'Логарифм МЕНЬШЕ двух, значит x меньше девяти.', 'The logarithm is LESS than two, so x is less than nine.') },
      ],
    },
    {
      id: 'b3', tag: 'same_base', ask: true, cols: 4,
      done: L('2ˣ > 4 va 2ˣ < 32  →  (2; 5)', '2ˣ > 4 и 2ˣ < 32  →  (2; 5)', '2ˣ > 4 and 2ˣ < 32  →  (2; 5)'),
      prompt: L('2ˣ > 4 va 2ˣ < 32 sistemasining yechimi?', 'Решение системы 2ˣ > 4 и 2ˣ < 32 ?', 'The solution of the system 2ˣ > 4 and 2ˣ < 32 ?'),
      items: [
        { id: 'a', label: '(2; 5)', correct: true },
        { id: 'b', label: '(4; 32)', hint: L("To'rt va o'ttiz ikki bu darajaning QIYMATLARI, ko'rsatkichlar emas.", 'Четыре и тридцать два это ЗНАЧЕНИЯ степени, а не показатели.', 'Four and thirty two are the VALUES of the power, not the exponents.') },
        { id: 'c', label: '(2; +∞)', hint: L("Ikkinchi shart yuqoridan cheklaydi: o'ttiz ikki bu ikkining beshinchi darajasi.", 'Второе условие ограничивает сверху: тридцать два это два в пятой.', 'The second condition bounds from above: thirty two is two to the fifth.') },
        { id: 'd', label: '(5; +∞)', hint: L("Beshdan katta emas, KICHIK: ikkinchi shart shuni aytadi.", 'Не больше пяти, а МЕНЬШЕ: об этом говорит второе условие.', 'Not greater than five but LESS: that is what the second condition says.') },
      ],
    },
    {
      id: 'b4', tag: 'check_by_point', ask: true, cols: 1,
      done: L("tekshiruv: ikkala shartga ham qo'yish", 'проверка: подставить в оба условия', 'check: substitute into both conditions'),
      prompt: L(
        "Sistemaning javobini eng ishonchli qanday tekshirasiz?",
        'Как надёжнее всего проверить ответ системы?',
        'What is the most reliable way to check the answer of a system?',
      ),
      items: [
        { id: 'a', label: L("javob ichidan son olib, IKKALA shartga qo'yish", 'взять число из ответа и подставить в ОБА условия', 'take a number from the answer and substitute into BOTH conditions'), correct: true },
        { id: 'b', label: L("birinchi shartga qo'yish", 'подставить в первое условие', 'substitute into the first condition'), hint: L("Bittasi yetmaydi: yigirma birinchi shartni bajargan edi.", 'Одного мало: двадцать выполняло первое условие.', 'One is not enough: twenty satisfied the first condition.') },
        { id: 'c', label: L('chegaralarni tekshirish', 'проверить границы', 'check the boundaries'), hint: L("Qat'iy ishorada chegaralar javobga kirmaydi.", 'При строгом знаке границы в ответ не входят.', 'With a strict sign the boundaries are not in the answer.') },
        { id: 'd', label: L("qayta yechish", 'решить заново', 'solve it again'), hint: L("O'sha usul o'sha xatoni takrorlaydi.", 'Тот же способ повторит ту же ошибку.', 'The same way repeats the same mistake.') },
      ],
    },
    {
      id: 'b5', tag: 'intersection', ask: true, cols: 4,
      done: L("x > 5 va x < 3  →  yechim yo'q", 'x > 5 и x < 3  →  решений нет', 'x > 5 and x < 3  →  no solutions'),
      prompt: L("x > 5 va x < 3 bo'lsa, javobda nima bo'ladi?", 'Что в ответе, если x > 5 и x < 3 ?', 'What is the answer if x > 5 and x < 3 ?'),
      items: [
        { id: 'a', label: L("yechim yo'q", 'решений нет', 'no solutions'), correct: true },
        { id: 'b', label: '(3; 5)', hint: L("Aksincha: uch bilan besh orasida BIRINCHI shart bajarilmaydi.", 'Наоборот: между тройкой и пятёркой не выполняется ПЕРВОЕ условие.', 'On the contrary: between three and five the FIRST condition fails.') },
        { id: 'c', label: '(5; +∞)', hint: L("Beshdan o'ngda ikkinchi shart bajarilmaydi.", 'Правее пятёрки не выполняется второе условие.', 'To the right of five the second condition fails.') },
        { id: 'd', label: L('istalgan son', 'любое число', 'any number'), hint: L("Bitta son ham ikkala shartni bajarolmaydi: u bir vaqtda beshdan katta va uchdan kichik bo'lolmaydi.", 'Ни одно число не выполнит оба: нельзя быть одновременно больше пяти и меньше трёх.', 'No number satisfies both: you cannot be greater than five and less than three at once.') },
      ],
    },
    {
      id: 'b6', tag: 'base_direction', prompt: '(0,5)ˣ > 4', cols: 4,
      items: [
        { id: 'a', label: '(−∞; −2)', correct: true },
        { id: 'b', label: '(2; +∞)', hint: L("Asos birdan kichik: ishora aylanadi va chegara manfiy.", 'Основание меньше единицы: знак переворачивается и граница отрицательная.', 'The base is less than one: the sign flips and the boundary is negative.') },
        { id: 'c', label: '(−2; +∞)', hint: L("Ishora aylanganda iks minus ikkidan KICHIK bo'ladi.", 'После переворота знака икс МЕНЬШЕ минус двух.', 'After the flip x is LESS than minus two.') },
        { id: 'd', label: '(−∞; 2)', hint: L("To'rt bu nol butun beshning minus ikkinchi darajasi.", 'Четыре это нуль целых пять в минус второй степени.', 'Four is zero point five to the power minus two.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Bu shartda logarifm bor, ya'ni chegara ikkita.", 'В этом условии логарифм, значит границы две.', 'This condition has a logarithm, so there are two boundaries.'),
    A('q3', 'Ikkala shart ham daraja bilan.', 'Оба условия со степенью.', 'Both conditions have a power.'),
    A('q4', 'Tekshiruv haqida savol.', 'Вопрос про проверку.', 'A question about checking.'),
    A('q5', "Diqqat: bu yerda umumiy qism bormi?", 'Внимание: а есть ли здесь общая часть?', 'Careful: is there a common part here at all?'),
    A('q6', 'Oxirgi. Asos birdan kichik.', 'Последний. Основание меньше единицы.', 'The last one. The base is less than one.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: VA o'rniga YOKI.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'intersection',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L("Qadamlar to'g'ri, javob xato", 'Шаги верны, ответ нет', 'Steps right, answer wrong'),
  rows: [
    { id: 'r1', text: '2ˣ > 8,   log₂ x < 4' },
    { id: 'r2', text: 'x > 3' },
    { id: 'r3', text: '0 < x < 16' },
    { id: 'r4', text: L('x > 3  YOKI  x < 16', 'x > 3  ИЛИ  x < 16', 'x > 3  OR  x < 16') },
    { id: 'r5', text: L('javob: butun son o\'qi', 'ответ: вся числовая прямая', 'answer: the whole number line') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu boshlang'ich sistema, unda xato bo'lishi mumkin emas.", 'Это исходная система, ошибки в ней быть не может.', 'This is the original system, there can be no error in it.'),
    r2: L("Birinchi shart to'g'ri yechilgan: sakkiz bu ikkining kubi.", 'Первое условие решено верно: восемь это два в кубе.', 'The first condition is solved correctly: eight is two cubed.'),
    r3: L("Ikkinchi shart ham to'g'ri: pastdan nol, yuqoridan o'n olti.", 'Второе условие тоже верно: снизу ноль, сверху шестнадцать.', 'The second condition is correct too: zero below, sixteen above.'),
    r5: L("Javob haqiqatan xato. Lekin u oldingi satrda xato bo'lgan.", 'Ответ действительно неверный. Но неверным он стал в предыдущей строке.', 'The answer is indeed wrong. But it became wrong in the previous line.'),
  },
  proofPoint: 'x = 20',
  proof: L(
    "x = 20 da birinchi shart bajariladi, ikkinchisi esa yo'q: yigirma o'n oltidan katta. Demak yigirma yechim emas, javobga esa u kiradi. Sistema bu VA, YOKI emas",
    'При x = 20 первое условие выполняется, а второе нет: двадцать больше шестнадцати. Значит двадцать не решение, а в ответ оно входит. Система это И, а не ИЛИ',
    'At x = 20 the first condition holds and the second does not: twenty is greater than sixteen. So twenty is not a solution, yet the answer contains it. A system means AND, not OR',
  ),
  probe: {
    question: L('Qaysi qoida buzilgan?', 'Какое правило нарушено?', 'Which rule was broken?'),
    items: [
      { id: 'a', label: L("sistema VA degani, kesishma olinishi kerak edi", 'система это И, надо было взять пересечение', 'a system means AND, the intersection had to be taken'), correct: true },
      { id: 'b', label: L("birinchi shart noto'g'ri yechilgan", 'первое условие решено неверно', 'the first condition was solved incorrectly'), hint: L("Birinchi shart to'g'ri: iks uchdan katta.", 'Первое условие верно: икс больше трёх.', 'The first condition is right: x is greater than three.') },
      { id: 'c', label: L("logarifmning musbatligi unutilgan", 'забыта положительность логарифма', 'the positivity of the logarithm was forgotten'), hint: L("Unutilmagan: uchinchi satrda nol turibdi.", 'Не забыта: в строке 3 стоит ноль.', 'It was not forgotten: line 3 has the zero.') },
      { id: 'd', label: L('amallar tartibi', 'порядок действий', 'order of operations'), hint: L("Tartib to'g'ri edi: avval har shart alohida.", 'Порядок был правильный: сначала каждое условие отдельно.', 'The order was right: each condition separately first.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda birinchi uch satr to'g'ri. Shunga qaramay javob xato. Xato birinchi marta paydo bo'lgan satrni toping.", 'Здесь первые три строки верны. И всё же ответ неверный. Найди строку, в которой ошибка появилась впервые.', 'Here the first three lines are correct. And still the answer is wrong. Find the line where the error first appeared.'),
    A('proof', "Tekshiramiz. Yigirmani olsak, birinchi shart bajariladi, ikkinchisi esa yo'q. Demak yigirma yechim emas, javobga esa u kiradi.", 'Проверим. Возьмём двадцать: первое условие выполняется, второе нет. Значит двадцать не решение, а в ответ оно входит.', 'Let us check. Take twenty: the first condition holds, the second does not. So twenty is not a solution, yet the answer contains it.'),
    A('q2', 'Qaysi qoida buzilgan?', 'Какое правило нарушено?', 'Which rule was broken?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const PARTS_14 = ['2ˣ < 8', '2ˣ > 8', 'log₂ x > 0', 'log₂ x < 0']

const S14 = {
  role: 'build',
  led: 'student',
  tag: 'intersection',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Teskari yig\'ing', 'Собери обратно', 'Build it back'),
  axis: AXIS_3,
  sets: [{ from: 1, to: 3, tone: 'graph' }],
  targetValue: '(1; 3)',
  tasks: [
    {
      prompt: L('Ikki shartdan sistema yig\'ing', 'Собери систему из двух условий', 'Build a system from two conditions'),
      template: [{ slot: 0 }, ',   ', { slot: 1 }],
      parts: PARTS_14,
      answer: ['log₂ x > 0', '2ˣ < 8'],
      doneLabel: L('birinchi usul:  log₂ x > 0,  2ˣ < 8', 'первый способ: log₂ x > 0, 2ˣ < 8', 'first way: log₂ x > 0, 2ˣ < 8'),
      wrongs: [
        { key: '2ˣ > 8|log₂ x < 0', hint: L("Bu ikkisining umumiy qismi yo'q: birinchisi uchdan o'ngda, ikkinchisi birdan chapda.", 'У этих двух нет общей части: первое правее тройки, второе левее единицы.', 'These two have no common part: the first is right of three, the second is left of one.') },
        { key: '*', hint: L("Pastdan chegara bir: bu log₂ x > 0. Yuqoridan uch: bu 2ˣ < 8.", 'Снизу граница единица: это log₂ x > 0. Сверху тройка: это 2ˣ < 8.', 'The lower boundary is one: that is log₂ x > 0. The upper is three: that is 2ˣ < 8.') },
      ],
    },
    {
      prompt: L("Endi shartlarni O'RIN ALMASHTIRIB yozing", 'А теперь запиши те же условия в обратном порядке', 'Now write the same conditions in the reverse order'),
      template: [{ slot: 0 }, ',   ', { slot: 1 }],
      parts: PARTS_14,
      answer: ['2ˣ < 8', 'log₂ x > 0'],
      doneLabel: L('tartib javobni o\'zgartirmaydi', 'порядок ответа не меняет', 'the order does not change the answer'),
      wrongs: [
        { key: '*', hint: L("O'sha ikki shart, faqat joylari almashadi. Sistemada tartib ahamiyatsiz -- bu ham qoidaning bir qismi.", 'Те же два условия, только местами. В системе порядок не важен — это тоже часть правила.', 'The same two conditions, just swapped. In a system the order does not matter, and that is part of the rule too.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi o'sha ikki shartni o'rin almashtirib yozing. Javob o'zgaradimi?", 'А теперь запиши те же два условия в обратном порядке. Изменится ли ответ?', 'Now write the same two conditions in the reverse order. Will the answer change?'),
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
  law: L('sistema = VA', 'система = И', 'system = AND'),
  ruleLines: [
    L('1. har shartni alohida yech', '1. реши каждое условие отдельно', '1. solve each condition separately'),
    L("2. bitta noma'lum — umumiy qism, ikkita — juft", '2. одно неизвестное — общая часть, два — пара', '2. one unknown — the common part, two — a pair'),
    L('3. javobni IKKALA shartga ham qo\'yib tekshir', '3. проверь ответ подстановкой в ОБА условия', '3. check the answer by substituting into BOTH conditions'),
  ],
  predicts: [
    {
      screen: 0,
      expr: SYS_HOOK,
      right: '(3; 16)',
      map: { a: '(3; 16)', b: '(0; +∞)', both: '—', none: '—' },
    },
    {
      screen: 5,
      expr: SYS_NEW,
      right: L('sonlar jufti', 'пара чисел', 'a pair of numbers'),
      map: {
        a: L('sonlar jufti', 'пара чисел', 'a pair of numbers'),
        b: L('oraliq', 'промежуток', 'an interval'),
        c: L('bitta son', 'одно число', 'a single number'),
        d: L("yechim yo'q", 'решений нет', 'no solutions'),
      },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: 'x > 3   va   0 < x < 16   →   (3; 16)',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Qoidaga va uch nuqtali ekranga qayting', 'Вернись к правилу и к экрану с тремя точками', 'Go back to the rule and to the three-points screen'),
  },
  probe: {
    question: L('Sistemaning javobini qanday tekshirasiz?', 'Как проверить ответ системы?', 'How do you check the answer of a system?'),
    items: [
      { id: 'a', label: L("javobdan son olib, ikkala shartga qo'yish", 'взять число из ответа и подставить в оба условия', 'take a number from the answer and substitute into both conditions'), correct: true },
      { id: 'b', label: L("bitta shartga qo'yish", 'подставить в одно условие', 'substitute into one condition'), hint: L("Bittasi yetmaydi: yigirma birinchisini bajargan edi.", 'Одного мало: двадцать выполняло первое.', 'One is not enough: twenty satisfied the first.') },
      { id: 'c', label: L('darslikka qarash', 'посмотреть в учебник', 'look in the textbook'), hint: L("Darslikda aynan sizning sistemangiz bo'lmaydi.", 'В учебнике не будет именно твоей системы.', 'The textbook will not contain your exact system.') },
      { id: 'd', label: L('hech qanday', 'никак', 'there is no way'), hint: L('Butun dars tekshirdik. Nima bilan ekanini eslang.', 'Мы весь урок проверяли. Вспомни, чем.', 'We were checking all lesson. Recall with what.') },
    ],
  },
  sheetTitle: L('Sistemalar · shpargalka', 'Системы · шпаргалка', 'Systems · cheat sheet'),
  sheetSrc: L('11-sinf · 13-dars', '11 класс · урок 13', 'Grade 11 · lesson 13'),
  lifehack: L(
    "10 sekundlik tekshiruv: javobdan bitta son oling va uni IKKALA shartga ham qo'ying. Ikkalasi ham bajarilishi shart.",
    'Проверка за 10 секунд: возьми число из ответа и подставь в ОБА условия. Оба обязаны выполниться.',
    'A 10-second check: take a number from the answer and substitute it into BOTH conditions. Both must hold.',
  ),
  holds: [2500, 8000, 4500, 4500],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminingiz va mana qanday chiqdi. Taxminda xato qilish normal edi, biz shuning uchun tekshirdik.", 'Вот твой прогноз и вот как оказалось. Ошибиться в догадке было нормально, именно поэтому мы проверяли.', 'Here is your guess and here is how it turned out. Being wrong in a guess was fine, that is exactly why we checked.'),
    A('rule', "Va mana sistema, qaysidan boshladik. Ikki shart, va javobda faqat ularning umumiy qismi.", 'А вот система, с которой мы начали. Два условия, и в ответе только их общая часть.', 'And here is the system we began with. Two conditions, and only their common part in the answer.'),
    A('q', "Va eng muhimi: javobga ishonchingiz bo'lmasa, uni ikkala shartga ham qo'yib ko'ring.", 'И главное: если сомневаешься в ответе, подставь его в оба условия.', 'And the main thing: if you are unsure of the answer, substitute it into both conditions.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
