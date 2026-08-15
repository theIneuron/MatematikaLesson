// ============================================================================
// 11-sinf, Dars 03. ANIQMAS INTEGRAL.  (Неопределённый интеграл)
//
// B1 blokining UCHINCHI darsi. Faqat MA'LUMOT.
//   raskadrovka: src/books/grade11/DARS03_SKELET.md
//   kontrakt:    src/books/grade11/ETALON_11SINF.md
//
// Etalondan (12-dars) farqi NOL ekran.
//
// DARS BELGI HAQIDA EMAS. Belgi bitta satrda kiritiladi (5-ekran), va agar
// dars u haqda bo'lsa, o'quvchi 1 va 2-darsni yangi yozuvda ikkinchi marta
// o'tadi. Darsning mazmuni: HOSILALAR JADVALI O'NGDAN CHAPGA o'qilsa,
// integrallar jadvali chiqadi -- va unda birinchi marta daraja emas: sinus,
// kosinus, ko'rsatkichli, va 1/x.
//
// Va bitta xulosa jadvaldan qimmatroq: DARAJA QOIDASI HAR DOIM ISHLAMAYDI.
// Ko'rsatkich minus bir bo'lganda u nolga bo'lishni talab qiladi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_03',
  title: L('Aniqmas integral', 'Неопределённый интеграл', 'The indefinite integral'),
}

const BLOCK = { label: 'B1', from: 1, to: 7, current: 3 }

// ============================================================
// SLAYD 1. XUK. Kosinusmi yoki minus kosinus.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Aniqmas integral', 'Неопределённый интеграл', 'The indefinite integral'),
  title: L('Ishora qayerdan?', 'Откуда знак?', 'Where does the sign come from?'),
  expr: L('F ni toping:  f = sin x', 'Найди F:  f = sin x', 'Find F:  f = sin x'),
  rows: [
    {
      id: 'a',
      name: L('birinchi yechim', 'первое решение', 'the first solution'),
      value: 'F = cos x + C',
    },
    {
      id: 'b',
      name: L('ikkinchi yechim', 'второе решение', 'the second solution'),
      value: 'F = −cos x + C',
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Ikkalasini ham differensiallab tekshiramiz.",
      'Твой ответ записан. Сейчас продифференцируем и проверим оба.',
      'Your answer is saved. Now we will differentiate and check both.',
    ),
    items: [
      { id: 'a', label: L('birinchi', 'первое', 'the first') },
      { id: 'b', label: L('ikkinchi', 'второе', 'the second') },
      { id: 'both', label: L('ikkisi ham', 'оба', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни один', 'neither') },
    ],
  },
  holds: [5000, 4500, 4500, 4000],
  audio: [
    A('mount', "Ikki dars davomida darajalar bilan ishladik. Bugun boshqa funksiyalar keladi, va ular bilan birga bitta ishora.", 'Два урока мы работали со степенями. Сегодня приходят другие функции, а вместе с ними один знак.', 'For two lessons we worked with powers. Today other functions arrive, and with them one sign.'),
    A('r1', "Birinchi yechim: sinusning boshlang'ich funksiyasi kosinus.", 'Первое решение: первообразная синуса это косинус.', 'The first solution: the antiderivative of sine is cosine.'),
    A('r2', "Ikkinchi yechim: xuddi o'sha kosinus, lekin oldida minus turibdi.", 'Второе решение: тот же косинус, но перед ним стоит минус.', 'The second solution: the same cosine, but with a minus in front.'),
    A('ask', "Sizningcha qaysi yechim to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какое решение верное? Пока просто предположи.', 'Which solution do you think is correct? Just make a guess for now.'),
  ],
}

// ============================================================
// SLAYD 2. TAYANCH: hosilalar jadvalining uch satri.
// ============================================================
const S2 = {
  role: 'support',
  eyebrow: L('Tayanchni tekshirish', 'Проверка опоры', 'Checking the basics'),
  title: L('Uch tayanch', 'Три опоры', 'Three basics'),
  lead: L(
    "Bugun hamma tekshiruv hosilalar jadvali bo'yicha boradi. Uchta satrni eslaymiz. Bu baholanmaydi.",
    'Сегодня все проверки идут по таблице производных. Вспомним три строки. Это не оценивается.',
    'Today every check goes by the table of derivatives. Let us recall three rows. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Sinusning hosilasi kosinus', 'Производная синуса это косинус', 'The derivative of sine is cosine'),
      short: L('sinus beradi kosinus', 'синус даёт косинус', 'sine gives cosine'),
      ex: [
        { e: "(sin x)' = cos x", why: L('ishora yo\'q', 'знака нет', 'no sign appears') },
      ],
    },
    {
      id: 'c2',
      title: L('Kosinusning hosilasi MINUS sinus', 'Производная косинуса это МИНУС синус', 'The derivative of cosine is MINUS sine'),
      short: L('kosinus beradi minus sinus', 'косинус даёт минус синус', 'cosine gives minus sine'),
      ex: [
        { e: "(cos x)' = −sin x", why: L('mana shu minus bugun hal qiladi', 'вот этот минус сегодня всё и решает', 'this minus decides everything today') },
      ],
    },
    {
      id: 'c3',
      title: L('Yana ikki satr', 'Ещё две строки', 'Two more rows'),
      short: L('daraja emas', 'не степень', 'not a power'),
      ex: [
        { e: "(eˣ)' = eˣ", why: L('o\'zi o\'zgarmaydi', 'сама себя не меняет', 'it does not change itself') },
        { e: "(ln x)' = 1/x", why: L('logarifm daraja beradi minus bir', 'логарифм даёт степень минус один', 'the logarithm gives the power minus one') },
      ],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L("(cos x)' nechaga teng?", 'Чему равна (cos x)’ ?', 'What is (cos x)’ ?'),
      cols: 4,
      items: [
        { id: 'a', label: '−sin x', correct: true },
        { id: 'b', label: 'sin x', hint: L("Minus tushib qoldi. Aynan u bugungi darsning kaliti.", 'Потерян минус. Именно он ключ сегодняшнего урока.', 'The minus is lost. It is exactly the key to today.') },
        { id: 'c', label: 'cos x', hint: L("Bu funksiyaning o'zi, hosilasi emas.", 'Это сама функция, а не производная.', 'That is the function itself, not the derivative.') },
        { id: 'd', label: '−cos x', hint: L("Hosilada kosinus sinusga aylanadi.", 'В производной косинус превращается в синус.', 'In the derivative cosine turns into sine.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L("(sin x + 3)' nechaga teng?", 'Чему равна (sin x + 3)’ ?', 'What is (sin x + 3)’ ?'),
      cols: 4,
      items: [
        { id: 'a', label: 'cos x', correct: true },
        { id: 'b', label: 'cos x + 3', hint: L("Uchning hosilasi nol.", 'Производная тройки равна нулю.', 'The derivative of three is zero.') },
        { id: 'c', label: '−cos x', hint: L("Minus kosinusdan chiqadi, sinusdan emas.", 'Минус выходит из косинуса, а не из синуса.', 'The minus comes from cosine, not from sine.') },
        { id: 'd', label: 'sin x', hint: L("Sinus hosilada kosinusga aylanadi.", 'Синус в производной превращается в косинус.', 'Sine turns into cosine in the derivative.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L("(ln x)' nechaga teng?", 'Чему равна (ln x)’ ?', 'What is (ln x)’ ?'),
      cols: 4,
      items: [
        { id: 'a', label: '1/x', correct: true },
        { id: 'b', label: 'ln x', hint: L("Bu funksiyaning o'zi.", 'Это сама функция.', 'That is the function itself.') },
        { id: 'c', label: 'x', hint: L("Teskari tomon: logarifm daraja minus birni beradi.", 'Обратная сторона: логарифм даёт степень минус один.', 'The other way round: the logarithm gives the power minus one.') },
        { id: 'd', label: '1/x²', hint: L("Bu bir bo'lingan iksning hosilasi, minus bilan.", 'Это производная от одной делить на икс, и ещё с минусом.', 'That is the derivative of one over x, and with a minus too.') },
      ],
    },
  ],
  holds: [3000, 5000, 6500, 7000, 4500, 3500],
  audio: [
    A('mount', 'Uch satrni tiklaymiz. Bu baho emas.', 'Восстановим три строки. Это не оценка.', 'Let us restore three rows. This is not graded.'),
    A('c1', "Birinchi satr. Sinusning hosilasi kosinus, va bu yerda hech qanday ishora paydo bo'lmaydi.", 'Первая строка. Производная синуса это косинус, и никакого знака здесь не появляется.', 'First row. The derivative of sine is cosine, and no sign appears here.'),
    A('c2', "Ikkinchi satr, va bugun eng muhimi. Kosinusning hosilasi minus sinus. Mana shu minus butun darsni hal qiladi.", 'Вторая строка, и сегодня она главная. Производная косинуса это минус синус. Вот этот минус и решает весь урок.', 'Second row, and today the main one. The derivative of cosine is minus sine. This minus decides the whole lesson.'),
    A('c3', "Uchinchi tayanch, ikkita satr birdan. Ko'rsatkichli funksiyaning hosilasi o'zi. Logarifmning hosilasi esa bir bo'lingan iks, ya'ni daraja minus bir. Bu ikkinchisi darsning oxirida kerak bo'ladi.", 'Третья опора, сразу две строки. Производная показательной функции равна ей самой. А производная логарифма это одна делить на икс, то есть степень минус один. Вторая понадобится в конце урока.', 'Third basic, two rows at once. The derivative of the exponential function equals itself. And the derivative of the logarithm is one over x, that is the power minus one. The second will be needed at the end of the lesson.'),
    A('recap', "Qisqacha: sinus kosinus beradi, kosinus minus sinus beradi, logarifm esa bir bo'lingan iks.", 'Коротко: синус даёт косинус, косинус даёт минус синус, а логарифм одну делить на икс.', 'Briefly: sine gives cosine, cosine gives minus sine, and the logarithm gives one over x.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. Bahsni DIFFERENSIALLASH hal qiladi.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'check_by_diff',
  eyebrow: L('Differensiallab tekshiramiz', 'Проверим дифференцированием', 'Let us check by differentiating'),
  title: L('Bahsni hosila hal qiladi', 'Спор решает производная', 'The derivative settles it'),
  expr: L('kerak:  hosila = sin x', 'нужно: производная = sin x', 'needed: derivative = sin x'),
  goal: L('hosilasi sin x chiqsin', 'производная должна дать sin x', 'the derivative must give sin x'),
  rule: L(
    "Nomzodni differensiallaymiz. Hosila sinus chiqsa, nomzod yaroqli.",
    'Продифференцируем кандидата. Получился синус — кандидат годится.',
    'We differentiate the candidate. If the derivative is sine, the candidate is valid.',
  ),
  pick: L('Qaysi nomzodni tekshiramiz?', 'Какого кандидата проверим?', 'Which candidate shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('birinchi yechim', 'первое решение', 'the first solution'), value: 'F = cos x' },
    { id: 'b', key: 'inB', name: L('ikkinchi yechim', 'второе решение', 'the second solution'), value: 'F = −cos x' },
  ],
  points: [
    {
      id: 'q1', label: 'F = cos x', num: 'cos x', step: 'calc', verdict: 'out',
      role: L('birinchi yechim', 'первое решение', 'the first solution'),
      calc: "(cos x)' = −sin x  ✗",
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q2', label: 'F = −cos x', num: '−cos x', step: 'calc', verdict: 'in',
      role: L('ikkinchi yechim', 'второе решение', 'the second solution'),
      calc: "(−cos x)' = sin x  ✓",
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q3', label: 'F = −cos x + 5', num: '−cos x + 5', step: 'calc', verdict: 'in',
      role: L('nazorat uchun', 'для контроля', 'as a control'),
      calc: "(−cos x + 5)' = sin x  ✓",
      sol: true, inA: false, inB: true,
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    items: [
      {
        id: 'b', label: L('ikkinchi', 'второе', 'the second'), correct: true,
        ok: L(
          "To'g'ri. Minus kosinusni differensiallaganda ikkita minus bir birini yo'qotadi va sinus qoladi.",
          'Верно. При дифференцировании минус косинуса два минуса гасят друг друга и остаётся синус.',
          'Correct. Differentiating minus cosine, two minuses cancel each other and sine remains.',
        ),
      },
      {
        id: 'a', label: L('birinchi', 'первое', 'the first'),
        hint: L("Kosinusni differensiallang: minus sinus chiqadi, bizga esa sinus kerak edi.", 'Продифференцируй косинус: получится минус синус, а нужен был синус.', 'Differentiate cosine: you get minus sine, but sine was needed.'),
      },
      {
        id: 'both', label: L('ikkisi ham', 'оба', 'both'),
        hint: L("Ikkalasi bo'lishi mumkin emas: ularning hosilalari ishora bilan farq qiladi, o'zgarmas bilan emas.", 'Оба не могут: их производные отличаются знаком, а не постоянной.', 'Both cannot be: their derivatives differ by a sign, not by a constant.'),
      },
      {
        id: 'none', label: L('hech qaysi', 'ни один', 'neither'),
        hint: L("Bittasi yaroqli chiqdi: tekshiruv sinusni berdi.", 'Один оказался годным: проверка дала синус.', 'One turned out valid: the check gave sine.'),
      },
    ],
  },
  holds: [2500, 6000, 1500, 2500, 11000, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Bahsga qaytamiz.', 'Опора восстановлена. Вернёмся к спору.', 'The basics are back. Let us return to the argument.'),
    A('mount', "Nomzodni tekshirish uchun uni differensiallaymiz. Hosila sinus chiqsa, nomzod yaroqli.", 'Чтобы проверить кандидата, продифференцируем его. Получилась производная синус, кандидат годится.', 'To check a candidate we differentiate it. If the derivative is sine, the candidate is valid.'),
    A('mount', "Nomzodni tanlang.", 'Выбери кандидата.', 'Pick a candidate.'),
    A('calc', 'Differensiallaymiz.', 'Дифференцируем.', 'We differentiate.'),
    A('mark', "Uch nomzod tekshirildi. Kosinus minus sinus berdi, bu boshqa funksiya. Minus kosinus esa sinus berdi: ikkita minus bir birini yo'qotdi. Uchinchisi, minus kosinus plyus besh, ham sinus berdi, chunki beshning hosilasi nol. Demak minus bezak emas.", 'Три кандидата проверены. Косинус дал минус синус, это другая функция. А минус косинус дал синус: два минуса погасили друг друга. Третий, минус косинус плюс пять, тоже дал синус, потому что производная пятёрки ноль. Значит минус не украшение.', 'Three candidates checked. Cosine gave minus sine, a different function. Minus cosine gave sine: two minuses cancelled each other. The third, minus cosine plus five, also gave sine, because the derivative of five is zero. So the minus is not decoration.'),
    A('next', 'Endi javob bering: qaysi yechim yaroqli?', 'Теперь ответь: какое решение годится?', 'Now answer: which solution is valid?'),
  ],
}

// ============================================================
// SLAYD 4. NEGA MINUS: urinmalar.
// ============================================================
const FMC = (x) => -Math.cos(x)
const FC = (x) => Math.cos(x)

const S4 = {
  role: 'graph',
  tag: 'trig_sign',
  drag: false,
  eyebrow: L('Nega minus', 'Почему минус', 'Why the minus'),
  title: L('Urinma ishorani ko\'rsatadi', 'Знак показывает касательная', 'The tangent shows the sign'),
  chip: L('−cos x  va  cos x', '−cos x  и  cos x', '−cos x  and  cos x'),
  graph: {
    curves: [
      { fn: FMC, tone: 'ink', from: 1 },
      { fn: FC, tone: 'accent', from: 2 },
    ],
    xDomain: [-0.2, 6.5],
    yDomain: [-1.7, 1.7],
    xTicks: [
      { v: Math.PI / 2, label: 'π/2' },
      { v: Math.PI, label: 'π' },
      { v: (3 * Math.PI) / 2, label: '3π/2' },
    ],
    yTicks: [{ v: 0 }, { v: 1 }],
    tangentAt: Math.PI / 2,
    note: L('π/2 da qiyalik:  1  va  −1', 'наклон при π/2:  1  и  −1', 'slope at π/2:  1  and  −1'),
    height: 168,
  },
  graphSteps: 3,
  bonus: L(
    "Kerakli qiymat sinusning π/2 dagi qiymati, ya'ni bir. Minus kosinus aynan shuni beradi, kosinus esa qarama qarshisini.",
    'Нужное значение это синус в π/2, то есть единица. Минус косинус даёт ровно её, а косинус противоположное.',
    'The required value is sine at π/2, that is one. Minus cosine gives exactly that, and cosine gives the opposite.',
  ),
  probe: {
    question: L("Nega sinusning boshlang'ich funksiyasi minus kosinus?", 'Почему первообразная синуса это минус косинус?', 'Why is the antiderivative of sine minus cosine?'),
    items: [
      { id: 'a', label: L("chunki −cos x ning qiyaligi har nuqtada sin x ga teng", 'потому что наклон −cos x в каждой точке равен sin x', 'because the slope of −cos x at every point equals sin x'), correct: true },
      { id: 'b', label: L("chunki sinus va kosinus o'xshash", 'потому что синус и косинус похожи', 'because sine and cosine look alike'), hint: L("O'xshashlik hech narsani hal qilmaydi: ishora tekshiruvda ko'rinadi.", 'Похожесть ничего не решает: знак виден в проверке.', 'Looking alike settles nothing: the sign shows up in the check.') },
      { id: 'c', label: L("chunki hosilada har doim minus paydo bo'ladi", 'потому что в производной всегда появляется минус', 'because a minus always appears in the derivative'), hint: L("Sinusning hosilasida minus yo'q: u sof kosinus.", 'В производной синуса минуса нет: она чистый косинус.', 'There is no minus in the derivative of sine: it is plain cosine.') },
      { id: 'd', label: L("bu kelishuv, yodlash kerak", 'это соглашение, надо запомнить', 'it is a convention to memorise'), hint: L("Kelishuv emas: chizmada urinmaning yo'nalishi ko'rinib turibdi.", 'Не соглашение: на чертеже видно направление касательной.', 'Not a convention: the drawing shows the direction of the tangent.') },
    ],
  },
  holds: [4500, 5500, 6000, 8000],
  audio: [
    A('mount', "Hosila javobni ko'rsatdi. Endi nega shundayligini chizmada ko'ramiz.", 'Производная показала ответ. Теперь посмотрим на чертеже, почему так.', 'The derivative showed the answer. Now let us see in the drawing why it is so.'),
    A('one', "Mana minus kosinus. Nolda u eng pastda, keyin ko'tarila boshlaydi.", 'Вот минус косинус. В нуле он в самом низу, потом начинает подниматься.', 'Here is minus cosine. At zero it is at the very bottom, then it starts rising.'),
    A('two', "Va mana kosinusning o'zi. U aksincha: nolda eng tepada va pastga tushadi.", 'А вот сам косинус. Он наоборот: в нуле на самом верху и идёт вниз.', 'And here is cosine itself. It is the opposite: at zero it is at the very top and goes down.'),
    A('tangent', "Endi eng muhimi. Pi bo'lingan ikki nuqtasida ikkala egri chiziqqa urinma o'tkazamiz. Birinchisining qiyaligi bir, ikkinchisiniki minus bir. Bizga esa shu nuqtada sinusning qiymati kerak edi, ya'ni bir. Mos kelgani minus kosinus.", 'Теперь главное. В точке пи пополам проведём касательные к обеим кривым. У первой наклон один, у второй минус один. А нам нужно было значение синуса в этой точке, то есть единица. Подошёл минус косинус.', 'Now the main thing. At the point pi over two we draw tangents to both curves. The first has slope one, the second minus one. And we needed the value of sine at that point, that is one. Minus cosine is the one that fits.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1: belgi kiritiladi.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'plus_c',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Yozuv: integral belgisi', 'Запись: знак интеграла', 'The notation: the integral sign'),
  rows: [
    '∫ f(x) dx = F(x) + C',
    '∫ sin x dx = −cos x + C',
  ],
  probe: {
    question: L(
      "∫f(x)dx yozuvi F(x) dan nimasi bilan farq qiladi?",
      'Чем запись ∫f(x)dx отличается от F(x) ?',
      'How does ∫f(x)dx differ from F(x) ?',
    ),
    items: [
      { id: 'a', label: L("bu hamma boshlang'ich funksiyalar birdan, F esa ulardan bittasi", 'это все первообразные сразу, а F только одна из них', 'it is all the antiderivatives at once, while F is just one of them'), correct: true },
      { id: 'b', label: L("hech nimasi bilan, bu bir xil narsaning boshqa yozuvi", 'ничем, это другая запись того же самого', 'in no way, it is the same thing written differently'), hint: L("F bitta funksiya. Belgili yozuvga esa o'zgarmas ham kiradi, ya'ni butun oila.", 'F это одна функция. А в запись со значком входит и постоянная, то есть целое семейство.', 'F is one function. The record with the sign includes the constant too, that is a whole family.') },
      { id: 'c', label: L('bu son', 'это число', 'it is a number'), hint: L("Son keyinroq, aniq integralda chiqadi. Bu yerda javob funksiya.", 'Число получится позже, в определённом интеграле. Здесь ответ функция.', 'A number comes later, in the definite integral. Here the answer is a function.') },
      { id: 'd', label: L('bu hosila', 'это производная', 'it is the derivative'), hint: L("Aksincha: belgi teskari amalni bildiradi.", 'Наоборот: значок обозначает обратное действие.', 'On the contrary: the sign denotes the reverse operation.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Yozuv', 'Правило 1. Запись', 'Rule 1. The notation'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: '∫ f(x) dx = F(x) + C',
    lines: [
      L("belgi hamma boshlang'ich funksiyalarni birdan bildiradi", 'значок обозначает все первообразные сразу', 'the sign denotes all the antiderivatives at once'),
      L("f(x) integral ostidagi funksiya", 'f(x) это подынтегральная функция', 'f(x) is the function under the integral'),
      L("dx qaysi harf bo'yicha ish ketayotganini aytadi", 'dx говорит, по какой букве идёт действие', 'dx says which letter the operation runs over'),
      L("+ C yozuvning qismi: usiz yozuv noto'g'ri", '+ C входит в запись: без него она неверна', '+ C is part of the record: without it the record is wrong'),
    ],
    example: L('misol:  ∫ cos x dx = sin x + C', 'пример:  ∫ cos x dx = sin x + C', 'example:  ∫ cos x dx = sin x + C'),
  },
  holds: [4000, 6000, 5000],
  audio: [
    A('mount', "Ishora aniqlandi. Endi yozuvni kiritamiz, chunki har safar hamma boshlang'ich funksiyalarni sanab o'tirish noqulay.", 'Со знаком разобрались. Теперь введём запись, потому что перечислять все первообразные каждый раз неудобно.', 'The sign is settled. Now let us introduce the notation, because listing all the antiderivatives every time is inconvenient.'),
    A('def', "Cho'zilgan es harfiga o'xshash belgi integral belgisi deyiladi. U bitta funksiyani emas, hamma boshlang'ich funksiyalarni birdan bildiradi. Shuning uchun o'ng tomonda o'zgarmas turadi.", 'Значок, похожий на вытянутую букву эс, называется знаком интеграла. Он обозначает не одну функцию, а все первообразные сразу. Поэтому справа стоит постоянная.', 'The sign that looks like a stretched letter S is called the integral sign. It denotes not one function but all the antiderivatives at once. That is why the constant stands on the right.'),
    A('c', "Ostidagi funksiya integral ostidagi funksiya deyiladi, oxiridagi de iks esa qaysi harf bo'yicha ish ketayotganini aytadi.", 'Функцию под ним называют подынтегральной, а де икс в конце говорит, по какой букве идёт действие.', 'The function under it is called the integrand, and the dx at the end says which letter the operation runs over.'),
    A('rule', "To'g'ri. Belgi butun oilani bildiradi, shuning uchun o'zgarmassiz yozuv to'liq emas.", 'Верно. Значок обозначает целое семейство, поэтому без постоянной запись неполная.', 'Correct. The sign denotes a whole family, so without the constant the record is incomplete.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: daraja qoidasining CHEGARASI.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'power_rule',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Qoida qayerda to\'xtaydi', 'Где правило останавливается', 'Where the rule stops'),
  was: { label: UI.was, expr: 'f = x⁵   →   F = x⁶/6' },
  now: { label: UI.now, expr: 'f = x⁻¹   →   F = ?' },
  probe1: {
    question: L(
      "Ko'rsatkich minus bir bo'lsa, daraja qoidasi nima beradi?",
      'Что даёт правило степени при показателе минус один?',
      'What does the power rule give for the exponent minus one?',
    ),
    items: [
      { id: 'a', label: L("yangi ko'rsatkich nol bo'ladi va nolga bo'lish kerak bo'ladi", 'новый показатель станет нулём, и делить придётся на ноль', 'the new exponent becomes zero, and we would divide by zero'), correct: true },
      { id: 'b', label: L("x⁰ beradi, ya'ni bir", 'даст x⁰, то есть единицу', 'it gives x⁰, that is one'), hint: L("Qoida ko'tarish bilan tugamaydi: yangi ko'rsatkichga bo'lish ham kerak, u esa nol.", 'Правило не кончается поднятием: надо ещё поделить на новый показатель, а он ноль.', 'The rule does not end with raising: you must also divide by the new exponent, and it is zero.') },
      { id: 'c', label: L("1/x² beradi", 'даст 1/x²', 'it gives 1/x²'), hint: L("Bu hosila, teskari amal emas.", 'Это производная, а не обратное действие.', 'That is the derivative, not the reverse operation.') },
      { id: 'd', label: L("odatdagidek ishlaydi", 'работает как обычно', 'it works as usual'), hint: L("Ko'rsatkichga minus birni qo'ying va maxrajga qarang.", 'Подставь в показатель минус один и посмотри на знаменатель.', 'Put minus one in the exponent and look at the denominator.') },
    ],
  },
  probe2: {
    cols: 2,
    question: L('Unda javob nima?', 'Что же тогда будет ответом?', 'What will the answer be then?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: 'ln |x| + C' },
      { id: 'b', label: 'x⁰/0 + C' },
      { id: 'c', label: '1/x² + C' },
      { id: 'd', label: 'x + C' },
    ],
  },
  holds: [5000, 6500, 4000, 3000],
  audio: [
    A('mount', "Daraja qoidasi ikki dars ishladi: ko'rsatkichni ko'tar va yangisiga bo'l.", 'Правило степени работало два урока: подними показатель и раздели на новый.', 'The power rule worked for two lessons: raise the exponent and divide by the new one.'),
    A('now', "Endi ko'rsatkich minus bir. Uni bittaga ko'taring: nol chiqadi. Va endi shu nolga bo'lish kerak. Qoida noto'g'ri javob bermayapti, u umuman javob bermayapti.", 'Теперь показатель минус один. Подними его на один: получится ноль. И теперь на этот ноль надо делить. Правило не даёт неверный ответ, оно вообще не даёт ответа.', 'Now the exponent is minus one. Raise it by one: you get zero. And now you must divide by that zero. The rule does not give a wrong answer, it gives no answer at all.'),
    A('q1', "Savol: qoida aynan nimaga urilib to'xtaydi?", 'Вопрос: обо что именно правило останавливается?', 'The question: what exactly does the rule run into?'),
    A('q2', 'Sizningcha javob nima? Shunchaki taxmin qiling.', 'Как думаешь, что будет ответом? Просто предположи.', 'What do you think the answer is? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD: nolga bo'lish yoki logarifm.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'power_rule',
  eyebrow: L('Ikkisini ham tekshiramiz', 'Проверим обоих', 'Let us check both'),
  title: L('Ikki nomzod', 'Два кандидата', 'Two candidates'),
  expr: 'f = 1/x',
  need: '= 1/x',
  answerLabel: L('ikkinchi nomzod', 'второй кандидат', 'the second candidate'),
  cards: [
    {
      tag: L('A nomzod', 'кандидат A', 'candidate A'),
      txt: 'F = x⁰/0',
      point: {
        label: L("yangi ko'rsatkich", 'новый показатель', 'the new exponent'),
        calc: 'n + 1 = 0  ✗',
        verdict: 'out',
      },
    },
    {
      tag: L('B nomzod', 'кандидат B', 'candidate B'),
      txt: 'F = ln |x|',
      point: {
        label: L('differensiallaymiz', 'дифференцируем', 'we differentiate'),
        calc: "(ln |x|)' = 1/x  ✓",
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['ln |x| + C', 'x⁰/0 + C', '1/x² + C', 'x + C'],
    value: ['ln |x| + C'],
    label: 'F(x) =',
    prompt: L('Boshlang\'ich funksiyani yozing', 'Запиши первообразную', 'Write the antiderivative'),
    wrongs: [
      { key: 'x⁰/0 + C', hint: L("Bunday yozuvning ma'nosi yo'q: maxrajda nol turibdi.", 'Такая запись не имеет смысла: в знаменателе ноль.', 'Such a record has no meaning: there is a zero in the denominator.') },
      { key: '1/x² + C', hint: L("Bu hosila. Yo'nalish teskari.", 'Это производная. Направление обратное.', 'That is the derivative. The direction is reversed.') },
      { key: '*', hint: L("Hosilalar jadvalidan qidiring: qaysi funksiyaning hosilasi bir bo'lingan iks?", 'Ищи в таблице производных: у какой функции производная равна одной делить на икс?', 'Look in the table of derivatives: which function has derivative one over x?') },
    ],
  },
  holds: [3500, 6500, 8000, 4500],
  audio: [
    A('mount', 'Taxmin bor. Endi ikkala nomzodni ham tekshiramiz.', 'Прогноз есть. Теперь проверим обоих кандидатов.', 'The guess is made. Now let us check both candidates.'),
    A('p1', "Birinchi nomzod daraja qoidasidan chiqqan. Yangi ko'rsatkich nol, va maxrajda ham nol. Bunday yozuvning ma'nosi yo'q, shuning uchun bu javob emas.", 'Первый кандидат вышел из правила степени. Новый показатель ноль, и в знаменателе тоже ноль. Такая запись не имеет смысла, поэтому это не ответ.', 'The first candidate came from the power rule. The new exponent is zero, and the denominator is zero too. Such a record has no meaning, so it is not an answer.'),
    A('p2', "Ikkinchi nomzod jadvaldan olingan. Logarifmning hosilasi bir bo'lingan iks, ya'ni aynan kerakli funksiya. Modul kerak, chunki bir bo'lingan iks noldan chapda ham yashaydi.", 'Второй кандидат взят из таблицы. Производная логарифма это одна делить на икс, то есть ровно нужная функция. Модуль нужен, потому что одна делить на икс живёт и слева от нуля.', 'The second candidate is taken from the table. The derivative of the logarithm is one over x, exactly the function needed. The absolute value is needed because one over x also lives to the left of zero.'),
    A('write', "Demak jadvalda bu holatga alohida satr bor. Javobni yozing.", 'Значит в таблице для этого случая есть отдельная строка. Запиши ответ.', 'So the table has a separate row for this case. Write the answer.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2: JADVAL va jamlanma.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'power_rule',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Jadval', 'Таблица', 'The table'),
  cases: [
    {
      label: L('chapdan o\'ngga', 'слева направо', 'left to right'),
      text: L('hosilalar jadvali', 'таблица производных', 'the table of derivatives'),
      tone: 'graph',
    },
    {
      label: L('o\'ngdan chapga', 'справа налево', 'right to left'),
      text: L('integrallar jadvali', 'таблица интегралов', 'the table of integrals'),
      tone: 'accent',
    },
  ],
  rows: ['∫ xⁿ dx = xⁿ⁺¹/(n + 1) + C,   n ≠ −1', '∫ dx/x = ln |x| + C'],
  probe: {
    question: L("Nega 1/x uchun alohida satr bor?", 'Почему для 1/x есть отдельная строка?', 'Why is there a separate row for 1/x ?'),
    items: [
      { id: 'a', label: L("daraja qoidasi bu yerda nolga bo'lishni talab qiladi", 'правило степени потребовало бы здесь делить на ноль', 'the power rule would require dividing by zero here'), correct: true },
      { id: 'b', label: L("chunki logarifm alohida funksiya", 'потому что логарифм отдельная функция', 'because the logarithm is a separate function'), hint: L("Ko'rsatkichli funksiya ham alohida, lekin unga qoida kerak emas edi. Sabab boshqa.", 'Показательная тоже отдельная, но для неё правило и не требовалось. Причина в другом.', 'The exponential is separate too, but no rule was needed for it. The reason is different.') },
      { id: 'c', label: L("chunki 1/x nolda aniqlanmagan", 'потому что 1/x не определена в нуле', 'because 1/x is undefined at zero'), hint: L("Bu rost, lekin qoidaning to'xtashi boshqa sabab: yangi ko'rsatkich nol.", 'Это правда, но останавливает правило другое: новый показатель равен нулю.', 'True, but what stops the rule is different: the new exponent equals zero.') },
      { id: 'd', label: L("shunday kelishilgan", 'так договорились', 'that is the convention'), hint: L("Kelishuv emas: maxrajda haqiqatan nol chiqadi.", 'Не договорённость: в знаменателе действительно получается ноль.', 'Not a convention: the denominator really does come out zero.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Jadval', 'Правило 2. Таблица', 'Rule 2. The table'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: '∫ dx/x = ln |x| + C',
    lines: [
      '∫ xⁿ dx = xⁿ⁺¹/(n + 1) + C,   n ≠ −1',
      '∫ dx/x = ln |x| + C',
      '∫ sin x dx = −cos x + C',
      '∫ cos x dx = sin x + C',
    ],
    example: L('misol:  ∫ eˣ dx = eˣ + C', 'пример:  ∫ eˣ dx = eˣ + C', 'example:  ∫ eˣ dx = eˣ + C'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать в одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: "F' = f",
    lines: [
      L("1. hosilalar jadvalini o'ngdan chapga o'qing", '1. читай таблицу производных справа налево', '1. read the table of derivatives right to left'),
      L("2. ko'paytuvchi va qo'shiluvchilar 2-darsdagidek", '2. множитель и слагаемые как в уроке 2', '2. factors and terms as in lesson 2'),
      L("3. qavs bo'lsa, iks oldidagi ko'paytuvchiga bo'l", '3. если есть скобка, поделись на множитель при иксе', '3. if there is a bracket, divide by the factor at x'),
      L('4. + C yoz va differensiallab tekshir', '4. напиши + C и проверь дифференцированием', '4. write + C and check by differentiating'),
    ],
  },
  holds: [4000, 7000, 4000, 5000],
  audio: [
    A('mount', "Logarifm satri topildi. Endi butun jadvalni yozamiz.", 'Строка с логарифмом найдена. Теперь запишем всю таблицу.', 'The logarithm row is found. Now let us write the whole table.'),
    A('rows', "Jadval yangi emas. Bu o'sha hosilalar jadvali, faqat o'ngdan chapga o'qilgan. Daraja satri butun blokda ishlagan, logarifm satri esa aynan o'sha holat uchun, qayerda daraja qoidasi to'xtaydi.", 'Таблица не новая. Это та же таблица производных, только прочитанная справа налево. Строка со степенью работала весь блок, а строка с логарифмом ровно для того случая, где правило степени останавливается.', 'The table is not new. It is the same table of derivatives, only read right to left. The power row worked through the whole block, and the logarithm row is exactly for the case where the power rule stops.'),
    A('q', "Savol: nega bir bo'lingan iks uchun alohida satr kerak?", 'Вопрос: почему для одной делить на икс нужна отдельная строка?', 'The question: why does one over x need a separate row?'),
    A('rule', "To'g'ri. Daraja qoidasi u yerda nolga bo'lishni talab qiladi, shuning uchun bu holat jadvalda alohida turadi.", 'Верно. Правило степени там требует делить на ноль, поэтому этот случай стоит в таблице отдельно.', 'Correct. The power rule there requires dividing by zero, so this case stands separately in the table.'),
    A('both', 'Endi butun usulni bitta qoidaga yig\'ing.', 'А теперь собери весь способ в одно правило.', 'Now combine the whole method into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. ISHORANI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'trig_sign',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Ishorani qo\'ying', 'Поставь знак', 'Place the sign'),
  left: '∫ sin x dx',
  template: ['= ', { slot: 0 }, ' cos x + C'],
  signs: ['+', '−'],
  answer: '−',
  checkNote: L(
    "Tekshiruv: (−cos x)' = sin x",
    "Проверка: (−cos x)' = sin x",
    "Check: (−cos x)' = sin x",
  ),
  wrongs: [
    { key: '+', hint: L("Differensiallang: minus sinus chiqadi, kerak esa sinus. Ishora qarama qarshi.", 'Продифференцируй: получится минус синус, а нужен синус. Знак противоположный.', 'Differentiate: you get minus sine, but sine is needed. The sign is the opposite.') },
  ],
  probe: {
    question: L("Minus qayerdan keladi?", 'Откуда берётся минус?', 'Where does the minus come from?'),
    items: [
      { id: 'a', label: L("kosinusning hosilasidan: u minus sinus", 'из производной косинуса: она минус синус', 'from the derivative of cosine: it is minus sine'), correct: true },
      { id: 'b', label: L("sinusning hosilasidan", 'из производной синуса', 'from the derivative of sine'), hint: L("Sinusning hosilasi sof kosinus, unda minus yo'q.", 'Производная синуса чистый косинус, минуса в ней нет.', 'The derivative of sine is plain cosine, there is no minus in it.') },
      { id: 'c', label: L("o'zgarmasdan", 'из постоянной', 'from the constant'), hint: L("O'zgarmasning hosilasi nol: u ishoraga ta'sir qilmaydi.", 'Производная постоянной ноль: на знак она не влияет.', 'The derivative of a constant is zero: it does not affect the sign.') },
      { id: 'd', label: L('bu shunchaki kelishuv', 'это просто соглашение', 'it is just a convention'), hint: L("Kelishuv emas: minussiz tekshiruv mos kelmaydi.", 'Не соглашение: без минуса проверка не сходится.', 'Not a convention: without the minus the check does not match.') },
    ],
  },
  audio: [
    A('mount', 'Jadval yig\'ildi. Endi siz ishlaysiz.', 'Таблица собрана. Теперь работаешь ты.', 'The table is assembled. Now it is your turn.'),
    A('place', "Ishorani qo'ying.", 'Поставь знак.', 'Place the sign.'),
    A('checked', "Bo'ldi. Endi ta'riflang: minus qayerdan keladi?", 'Получилось. Теперь сформулируй: откуда берётся минус?', 'Done. Now put it into words: where does the minus come from?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'split', label: L("qo'shiluvchilarga ajratish", 'разбить по слагаемым', 'split into terms') },
  { id: 'table', label: L('jadval bo\'yicha yozish', 'записать по таблице', 'write by the table') },
  { id: 'plusC', label: L('+ C qo\'shish', 'добавить + C', 'add + C') },
  { id: 'inner', label: L("qavs ko'paytuvchisiga bo'lish", 'поделить на множитель скобки', 'divide by the bracket factor') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'trig_sign',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: '∫ (3x² + 2cos x) dx',
  actions: ACTIONS_10,
  steps: [
    {
      action: 'split',
      to: '∫ 3x² dx  +  ∫ 2cos x dx',
      wrongs: [
        { action: 'table', hint: L("Avval ajrating: jadval bitta funksiya uchun.", 'Сначала разбей: таблица работает для одной функции.', 'Split first: the table works for one function.') },
        { action: 'plusC', hint: L("+ C oxirida.", '+ C в конце.', '+ C at the end.') },
        { action: 'inner', hint: L("Bu yerda qavs ichida oddiy iks: bo'ladigan narsa yo'q.", 'Здесь внутри скобки простой икс: делить не на что.', 'Here the bracket holds a plain x: there is nothing to divide by.') },
      ],
    },
    {
      action: 'table',
      to: 'x³  +  2 sin x',
      wrongs: [
        { action: 'split', hint: L("Allaqachon ajratilgan.", 'Уже разбито.', 'It is already split.') },
        { action: 'plusC', hint: L("Avval har qo'shiluvchini yozing.", 'Сначала запиши каждое слагаемое.', 'Write each term first.') },
        { action: 'inner', hint: L("Qavs ichida oddiy iks.", 'Внутри скобки простой икс.', 'The bracket holds a plain x.') },
      ],
    },
    {
      action: 'plusC',
      to: 'F = x³ + 2 sin x + C',
      wrongs: [
        { action: 'table', hint: L("Jadval qo'llanildi.", 'Таблица уже применена.', 'The table is already applied.') },
        { action: 'split', hint: L("Allaqachon ajratilgan.", 'Уже разбито.', 'It is already split.') },
        { action: 'inner', hint: L("Bo'ladigan narsa yo'q.", 'Делить не на что.', 'There is nothing to divide by.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['x³ + 2 sin x + C', 'x³ − 2 sin x + C', '3x³ + 2 sin x + C', '6x − 2 sin x + C'],
    value: ['x³ + 2 sin x + C'],
    label: 'F(x) =',
    prompt: L('Javobni to\'liq yozing', 'Запиши ответ полностью', 'Write the answer in full'),
    wrongs: [
      { key: 'x³ − 2 sin x + C', hint: L("Minus kosinusdan chiqadi. Bu yerda kosinus integral ostida, uning javobi sof sinus.", 'Минус выходит из косинуса. Здесь косинус стоит под интегралом, и его ответ чистый синус.', 'The minus comes out of cosine. Here cosine is under the integral, and its answer is plain sine.') },
      { key: '6x − 2 sin x + C', hint: L("Bu hosila, teskari amal emas.", 'Это производная, а не обратное действие.', 'That is the derivative, not the reverse operation.') },
      { key: '*', hint: L("Har qo'shiluvchini jadval bo'yicha yozing va ko'paytuvchini saqlang.", 'Каждое слагаемое запиши по таблице и сохрани множитель.', 'Write each term by the table and keep the factor.') },
    ],
  },
  audio: [
    A('mount', 'Jadval sizniki. Endi ikki qo\'shiluvchili misolni o\'tamiz.', 'Таблица усвоена. Пройдём пример с двумя слагаемыми.', 'The table is yours now. Let us go through an example with two terms.'),
    A('start', "Ikki qo'shiluvchi: daraja va kosinus. Nimadan boshlashni tanlang.", 'Два слагаемых: степень и косинус. Выбери, с чего начать.', 'Two terms: a power and a cosine. Choose where to start.'),
    A('step4', 'Endi javobni to\'liq yozing.', 'Теперь запиши ответ полностью.', 'Now write the answer in full.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'trig_sign',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Integralni hisoblang', 'Найди интеграл', 'Find the integral'),
  start: '∫ (4eˣ − sin x) dx',
  actions: ACTIONS_10,
  hint: L(
    "Sinus oldidagi minus va jadvaldagi minus birga uchraydi. Ikkitasi nima beradi?",
    'Минус перед синусом и минус из таблицы встречаются вместе. Что дают два минуса?',
    'The minus before sine and the minus from the table meet together. What do two minuses give?',
  ),
  steps: [
    {
      action: 'split',
      to: '∫ 4eˣ dx  −  ∫ sin x dx',
      wrongs: [
        { action: 'table', hint: L("Avval ajrating.", 'Сначала разбей.', 'Split first.') },
        { action: 'plusC', hint: L("+ C oxirida.", '+ C в конце.', '+ C at the end.') },
        { action: 'inner', hint: L("Qavs ichida oddiy iks.", 'Внутри скобки простой икс.', 'The bracket holds a plain x.') },
      ],
    },
    {
      action: 'table',
      to: '4eˣ  +  cos x',
      wrongs: [
        { action: 'split', hint: L("Allaqachon ajratilgan.", 'Уже разбито.', 'It is already split.') },
        { action: 'plusC', hint: L("Avval jadval bo'yicha yozing.", 'Сначала запиши по таблице.', 'Write by the table first.') },
        { action: 'inner', hint: L("Bo'ladigan narsa yo'q.", 'Делить не на что.', 'There is nothing to divide by.') },
      ],
    },
    {
      action: 'plusC',
      to: 'F = 4eˣ + cos x + C',
      wrongs: [
        { action: 'table', hint: L("Jadval qo'llanildi.", 'Таблица применена.', 'The table is applied.') },
        { action: 'split', hint: L("Allaqachon ajratilgan.", 'Уже разбито.', 'It is already split.') },
        { action: 'inner', hint: L("Bo'ladigan narsa yo'q.", 'Делить не на что.', 'There is nothing to divide by.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['4eˣ + cos x + C', '4eˣ − cos x + C', 'eˣ + cos x + C', '4eˣ − sin x + C'],
    value: ['4eˣ + cos x + C'],
    label: 'F(x) =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '4eˣ − cos x + C', hint: L("Ikkita minus uchrashdi: shartdagi va jadvaldagi. Ular birgalikda plyus beradi.", 'Встретились два минуса: из условия и из таблицы. Вместе они дают плюс.', 'Two minuses met: one from the problem and one from the table. Together they give a plus.') },
      { key: '4eˣ − sin x + C', hint: L("Bu shartning o'zi. Sinus javobda kosinusga aylanishi kerak.", 'Это само условие. Синус в ответе должен превратиться в косинус.', 'That is the problem itself. Sine must turn into cosine in the answer.') },
      { key: '*', hint: L("Differensiallab tekshiring: to'rt karra ko'rsatkichli minus sinus chiqishi kerak.", 'Проверь дифференцированием: должно выйти четыре на показательную минус синус.', 'Check by differentiating: you must get four times the exponential minus sine.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Ikki qo'shiluvchi, va ikkinchisi minus bilan. Diqqat ishoraga.", 'Два слагаемых, и второе с минусом. Внимание на знак.', 'Two terms, and the second with a minus. Watch the sign.'),
    A('answered', "Javobni yozing va + C ni unutmang.", 'Запиши ответ и не забудь + C.', 'Write the answer and do not forget + C.'),
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
      id: 'b1', tag: 'trig_sign', ask: true, cols: 4,
      done: '∫ cos x dx = sin x + C',
      prompt: L('∫ cos x dx = ?', 'Чему равен ∫ cos x dx ?', 'What is ∫ cos x dx ?'),
      items: [
        { id: 'a', label: 'sin x + C', correct: true },
        { id: 'b', label: '−sin x + C', hint: L("Minus kosinusning boshlang'ich funksiyasida emas, hosilasida chiqadi.", 'Минус появляется не в первообразной косинуса, а в его производной.', 'The minus appears not in the antiderivative of cosine but in its derivative.') },
        { id: 'c', label: 'cos x + C', hint: L("Kosinus o'zgarishi kerak: teskari amal ham funksiyani almashtiradi.", 'Косинус должен измениться: обратное действие тоже меняет функцию.', 'Cosine must change: the reverse operation changes the function too.') },
        { id: 'd', label: '−cos x + C', hint: L("Bu sinusning javobi, kosinusniki emas.", 'Это ответ для синуса, а не для косинуса.', 'That is the answer for sine, not for cosine.') },
      ],
    },
    {
      id: 'b2', tag: 'plus_c', ask: true, cols: 4,
      done: '∫ eˣ dx = eˣ + C',
      prompt: L('∫ eˣ dx = ?', 'Чему равен ∫ eˣ dx ?', 'What is ∫ eˣ dx ?'),
      items: [
        { id: 'a', label: 'eˣ + C', correct: true },
        { id: 'b', label: 'eˣ', hint: L("Javob to'liq emas: belgi butun oilani bildiradi.", 'Ответ неполный: значок обозначает целое семейство.', 'The answer is incomplete: the sign denotes a whole family.') },
        { id: 'c', label: 'eˣ/x + C', hint: L("Daraja qoidasi bu yerda ishlamaydi: iks ko'rsatkichda turibdi.", 'Правило степени здесь не работает: икс стоит в показателе.', 'The power rule does not work here: x sits in the exponent.') },
        { id: 'd', label: 'x·eˣ + C', hint: L("Differensiallang: ko'paytmaning hosilasi boshqa narsa beradi.", 'Продифференцируй: производная произведения даст другое.', 'Differentiate: the derivative of a product gives something else.') },
      ],
    },
    {
      id: 'b3', tag: 'power_rule', ask: true, cols: 4,
      done: '∫ dx/x = ln |x| + C',
      prompt: L('∫ dx/x = ?', 'Чему равен ∫ dx/x ?', 'What is ∫ dx/x ?'),
      items: [
        { id: 'a', label: 'ln |x| + C', correct: true },
        { id: 'b', label: 'x⁰/0 + C', hint: L("Maxrajda nol: bunday yozuvning ma'nosi yo'q.", 'В знаменателе ноль: такая запись не имеет смысла.', 'Zero in the denominator: such a record has no meaning.') },
        { id: 'c', label: '−1/x² + C', hint: L("Bu hosila. Yo'nalish teskari.", 'Это производная. Направление обратное.', 'That is the derivative. The direction is reversed.') },
        { id: 'd', label: 'ln x + C', hint: L("Bir bo'lingan iks noldan chapda ham bor, shuning uchun modul kerak.", 'Одна делить на икс есть и слева от нуля, поэтому нужен модуль.', 'One over x also exists to the left of zero, so the absolute value is needed.') },
      ],
    },
    {
      id: 'b4', tag: 'inner_k', ask: true, cols: 4,
      done: '∫ sin 2x dx = −cos 2x / 2 + C',
      prompt: L('∫ sin 2x dx = ?', 'Чему равен ∫ sin 2x dx ?', 'What is ∫ sin 2x dx ?'),
      items: [
        { id: 'a', label: '−cos 2x / 2 + C', correct: true },
        { id: 'b', label: '−cos 2x + C', hint: L("Qavs ichidagi ikkilik hisobga olinmadi: ikkiga bo'lish kerak.", 'Двойка внутри скобки не учтена: надо поделить на два.', 'The two inside the bracket is not accounted for: divide by two.') },
        { id: 'c', label: 'cos 2x / 2 + C', hint: L("Ishora tushib qoldi: sinusning javobi minus bilan.", 'Потерян знак: ответ для синуса идёт с минусом.', 'The sign is lost: the answer for sine comes with a minus.') },
        { id: 'd', label: '−2cos 2x + C', hint: L("Ikkiga bo'linadi, ko'paytirilmaydi.", 'На два делят, а не умножают.', 'You divide by two, not multiply.') },
      ],
    },
    {
      id: 'b5', tag: 'power_rule', ask: true, cols: 1,
      done: L('daraja qoidasi nolga bo\'lardi', 'правило степени делило бы на ноль', 'the power rule would divide by zero'),
      prompt: L(
        "Nega 1/x jadvalda alohida satrda turibdi?",
        'Почему 1/x стоит в таблице отдельной строкой?',
        'Why does 1/x stand as a separate row in the table?',
      ),
      items: [
        { id: 'a', label: L("daraja qoidasi u yerda nolga bo'lishni talab qiladi", 'правило степени потребовало бы там делить на ноль', 'the power rule would require dividing by zero there'), correct: true },
        { id: 'b', label: L("chunki javobda logarifm turibdi", 'потому что в ответе стоит логарифм', 'because the answer contains a logarithm'), hint: L("Bu natija, sabab emas. Sabab qoidaning to'xtashida.", 'Это следствие, а не причина. Причина в том, что правило останавливается.', 'That is the consequence, not the cause. The cause is that the rule stops.') },
        { id: 'c', label: L("chunki 1/x kasr", 'потому что 1/x дробь', 'because 1/x is a fraction'), hint: L("Boshqa kasrlar bilan daraja qoidasi ishlaydi: masalan bir bo'lingan iks kvadrat.", 'С другими дробями правило степени работает: например с одной делить на икс в квадрате.', 'With other fractions the power rule works: for instance one over x squared.') },
        { id: 'd', label: L("shunday yodlash oson", 'так проще запомнить', 'it is easier to memorise'), hint: L("Yodlash uchun emas: qoida u yerda haqiqatan ishlamaydi.", 'Не для запоминания: правило там действительно не работает.', 'Not for memorising: the rule really does not work there.') },
      ],
    },
    {
      id: 'b6', tag: 'check_by_diff', ask: true, cols: 4,
      done: "(−cos x + 5)' = sin x",
      prompt: L("(−cos x + 5)' nechaga teng?", "Чему равна (−cos x + 5)’ ?", "What is (−cos x + 5)’ ?"),
      items: [
        { id: 'a', label: 'sin x', correct: true },
        { id: 'b', label: '−sin x', hint: L("Ikkita minus bir birini yo'qotadi.", 'Два минуса гасят друг друга.', 'Two minuses cancel each other.') },
        { id: 'c', label: 'sin x + 5', hint: L("Beshning hosilasi nol.", 'Производная пятёрки равна нулю.', 'The derivative of five is zero.') },
        { id: 'd', label: '−cos x', hint: L("Kosinus hosilada sinusga aylanadi.", 'Косинус в производной превращается в синус.', 'Cosine turns into sine in the derivative.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Endi ko'rsatkichli funksiya.", 'Теперь показательная.', 'Now the exponential.'),
    A('q3', "Bu o'sha alohida satr.", 'Это та самая отдельная строка.', 'This is that separate row.'),
    A('q4', 'Diqqat: qavs ichida ikki iks.', 'Внимание: внутри скобки два икс.', 'Careful: two x inside the bracket.'),
    A('q5', "Bu savol sababi haqida.", 'Этот вопрос про причину.', 'This question is about the reason.'),
    A('q6', 'Oxirgi. Endi teskari tomonga.', 'Последний. Теперь в обратную сторону.', 'The last one. Now the other way.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: ishora yo'qolgan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'trig_sign',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L("Tekshiruv o'zi xatoni ko'rsatadi", 'Проверка сама показывает ошибку', 'The check itself shows the error'),
  rows: [
    { id: 'r1', text: 'f(x) = sin x' },
    { id: 'r2', text: 'F(x) = cos x' },
    { id: 'r3', text: "tekshiruv:  (cos x)' = −sin x" },
    { id: 'r4', text: L('javob: F = cos x', 'ответ: F = cos x', 'answer: F = cos x') },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu berilgan funksiya, unda xato bo'lishi mumkin emas.", 'Это данная функция, ошибки в ней быть не может.', 'This is the given function, there can be no error in it.'),
    r3: L("Bu satr o'zi to'g'ri: kosinusning hosilasi haqiqatan minus sinus. Aynan shu satr oldingisining xato ekanini ko'rsatadi.", 'Эта строка верна сама по себе: производная косинуса действительно минус синус. Именно она и показывает, что предыдущая неверна.', 'This line is correct in itself: the derivative of cosine really is minus sine. And it is exactly this line that shows the previous one is wrong.'),
    r4: L("Javob haqiqatan xato, lekin u oldin xato bo'lgan.", 'Ответ действительно неверный, но неверным он стал раньше.', 'The answer is indeed wrong, but it became wrong earlier.'),
  },
  proofPoint: '−sin x  ≠  sin x',
  proof: L(
    "Tekshiruv minus sinus berdi, kerak esa sinus. Ikkalasi bir vaqtda to'g'ri bo'la olmaydi: javob minus bilan yozilishi kerak edi.",
    'Проверка дала минус синус, а нужен синус. Обе сразу верными быть не могут: ответ надо было записать с минусом.',
    'The check gave minus sine, but sine is needed. Both cannot be right at once: the answer had to be written with a minus.',
  ),
  probe: {
    question: L('Qaysi qoida buzilgan?', 'Какое правило нарушено?', 'Which rule was broken?'),
    items: [
      { id: 'a', label: L("kosinusning hosilasidagi minus hisobga olinmagan", 'не учтён минус в производной косинуса', 'the minus in the derivative of cosine was ignored'), correct: true },
      { id: 'b', label: L("+ C yozilmagan", 'не написано + C', '+ C was not written'), hint: L("Bu ham xato, lekin BIRINCHI xato ishorada: tekshiruv mos kelmadi.", 'Это тоже ошибка, но ПЕРВАЯ ошибка в знаке: проверка не сошлась.', 'That is an error too, but the FIRST error is the sign: the check did not match.') },
      { id: 'c', label: L("funksiya noto'g'ri tanlangan", 'выбрана не та функция', 'the wrong function was chosen'), hint: L("Funksiya to'g'ri: javobda kosinus turishi kerak. Faqat ishorasi bilan.", 'Функция верна: в ответе должен стоять косинус. Только со знаком.', 'The function is right: cosine belongs in the answer. Only with the sign.') },
      { id: 'd', label: L('tekshiruv noto\'g\'ri', 'проверка выполнена неверно', 'the check was done incorrectly'), hint: L("Tekshiruv to'g'ri bajarilgan, va aynan u xatoni fosh qildi.", 'Проверка выполнена верно, и именно она разоблачила ошибку.', 'The check was done correctly, and it is what exposed the error.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda hatto tekshiruv ham bajarilgan. Va shunga qaramay javob xato. Xato birinchi marta paydo bo'lgan satrni toping.", 'Здесь даже проверка выполнена. И всё же ответ неверный. Найди строку, в которой ошибка появилась впервые.', 'Here even the check was carried out. And still the answer is wrong. Find the line where the error first appeared.'),
    A('proof', "Qarang: tekshiruv minus sinus berdi, kerak esa sinus. Tekshiruv ishladi, lekin uning natijasiga e'tibor berilmadi.", 'Смотри: проверка дала минус синус, а нужен синус. Проверка сработала, но на её результат не посмотрели.', 'Look: the check gave minus sine, but sine is needed. The check worked, but nobody looked at its result.'),
    A('q2', 'Qaysi qoida buzilgan?', 'Какое правило нарушено?', 'Which rule was broken?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'inner_k',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Teskari yig\'ing', 'Собери обратно', 'Build it back'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L("differensiallang — f chiqsin", 'продифференцируй — должно выйти f', 'differentiate — you must get f'),
  tasks: [
    {
      prompt: L('∫ cos 3x dx uchun', 'Для ∫ cos 3x dx', 'For ∫ cos 3x dx'),
      template: ['= ', { slot: 0 }, ' / ', { slot: 1 }, ' + C'],
      parts: ['sin 3x', 'cos 3x', '3', '9'],
      answer: ['sin 3x', '3'],
      doneLabel: 'cos 3x  →  sin 3x / 3',
      wrongs: [
        { key: 'cos 3x|3', hint: L("Funksiya o'zgarishi kerak: kosinus sinusga aylanadi.", 'Функция должна измениться: косинус превращается в синус.', 'The function must change: cosine turns into sine.') },
        { key: '*', hint: L("Jadval sinusni beradi, qavs esa uchga bo'lishni.", 'Таблица даёт синус, а скобка деление на три.', 'The table gives sine, and the bracket gives the division by three.') },
      ],
    },
    {
      prompt: L('Endi ∫ sin 2x dx uchun', 'А теперь для ∫ sin 2x dx', 'And now for ∫ sin 2x dx'),
      template: ['= ', { slot: 0 }, ' / ', { slot: 1 }, ' + C'],
      parts: ['−cos 2x', 'cos 2x', '2', '4'],
      answer: ['−cos 2x', '2'],
      doneLabel: 'sin 2x  →  −cos 2x / 2',
      wrongs: [
        { key: 'cos 2x|2', hint: L("Ishora tushib qoldi: sinusning javobi minus bilan.", 'Потерян знак: ответ для синуса идёт с минусом.', 'The sign is lost: the answer for sine comes with a minus.') },
        { key: '*', hint: L("Ikkita narsa kerak: minus jadvaldan va ikkiga bo'lish qavsdan.", 'Нужны две вещи: минус из таблицы и деление на два из скобки.', 'Two things are needed: the minus from the table and the division by two from the bracket.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi, va u yerda ishora ham bor.", 'А теперь второе, и там ещё и знак.', 'And now the second one, and there is a sign there as well.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'check_by_diff',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: '∫ f(x) dx = F(x) + C',
  // Raqam YOZILMAYDI: yakun tanasi satrlarni o'zi 01, 02, 03 deb belgilaydi.
  ruleLines: [
    L("hosilalar jadvali o'ngdan chapga o'qilsa, integrallar jadvali chiqadi", 'таблица производных справа налево это таблица интегралов', 'the table of derivatives read right to left is the table of integrals'),
    L("kosinusdagi minus javobda sinusga o'tadi", 'минус из косинуса переходит в ответ для синуса', 'the minus from cosine moves into the answer for sine'),
    L("daraja qoidasi ko'rsatkich minus bir bo'lganda ishlamaydi", 'правило степени не работает при показателе минус один', 'the power rule fails when the exponent is minus one'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('sin x uchun ikki yechim', 'два решения для sin x', 'two solutions for sin x'),
      right: L('ikkinchi', 'второе', 'the second'),
      map: {
        a: L('birinchi', 'первое', 'the first'),
        b: L('ikkinchi', 'второе', 'the second'),
        both: L('ikkisi ham', 'оба', 'both'),
        none: '—',
      },
    },
    {
      screen: 5,
      expr: 'f = x⁻¹',
      right: 'ln |x| + C',
      map: { a: 'ln |x| + C', b: 'x⁰/0 + C', c: '1/x² + C', d: 'x + C' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '∫ sin x dx = −cos x + C',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Jadvalga va urinmalar ekraniga qayting', 'Вернись к таблице и к экрану с касательными', 'Go back to the table and to the tangents screen'),
  },
  probe: {
    question: L("Jadvalni yodlamasdan qanday tekshirasiz?", 'Как проверить себя, не помня таблицу?', 'How do you check yourself without recalling the table?'),
    items: [
      { id: 'a', label: L("javobni differensiallab, f bilan solishtirish", 'продифференцировать ответ и сравнить с f', 'differentiate the answer and compare with f'), correct: true },
      { id: 'b', label: L("son qo'yib ko'rish", 'подставить число', 'substitute a number'), hint: L("Bitta son tasodifan mos kelishi mumkin. Hosila esa hamma iks uchun tekshiradi.", 'Одно число может совпасть случайно. А производная проверяет при всех иксах.', 'One number may match by chance. The derivative checks for all x.') },
      { id: 'c', label: L('jadvalga qarash', 'посмотреть в таблицу', 'look at the table'), hint: L("Imtihonda jadval bo'lmaydi, hosila esa har doim qo'l ostida.", 'На экзамене таблицы нет, а производная всегда под рукой.', 'On the exam there is no table, but the derivative is always at hand.') },
      { id: 'd', label: L('hech qanday', 'никак', 'there is no way'), hint: L("Bor: teskari amalni oldinga qaytaring.", 'Есть: проделай обратное действие вперёд.', 'There is: run the reverse operation forwards.') },
    ],
  },
  sheetTitle: L('Aniqmas integral · shpargalka', 'Неопределённый интеграл · шпаргалка', 'The indefinite integral · cheat sheet'),
  sheetSrc: L('11-sinf · 3-dars', '11 класс · урок 3', 'Grade 11 · lesson 3'),
  lifehack: L(
    "Jadvalni eslay olmasangiz, teskari tomondan boring: qaysi funksiyani differensiallaganda shu chiqadi? Javob o'sha.",
    'Не помнишь таблицу — иди с другой стороны: какую функцию продифференцировать, чтобы вышло это? Она и есть ответ.',
    'If the table escapes you, go the other way: which function differentiates into this? That is the answer.',
  ),
  holds: [2500, 8000, 6500, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Birinchi savolda ishora hal qildi, va uni chizmada ko'rdik.", 'Вот твои прогнозы и вот как оказалось. В первом вопросе всё решил знак, и мы увидели его на чертеже.', 'Here are your guesses and here is how it turned out. In the first question the sign decided everything, and we saw it in the drawing.'),
    A('rule', "Va mana asosiy fikr. Yangi amal yo'q. Bu o'sha hosilalar jadvali, o'ngdan chapga o'qilgan. Faqat bitta joyda daraja qoidasi to'xtaydi, va o'sha joyda logarifm turadi.", 'И вот главная мысль. Нового действия нет. Это та же таблица производных, прочитанная справа налево. Только в одном месте правило степени останавливается, и там стоит логарифм.', 'And here is the main point. There is no new operation. It is the same table of derivatives read right to left. Only in one place the power rule stops, and the logarithm stands there.'),
    A('q', "Oxirgi savol: jadvalni eslay olmasangiz nima qilasiz?", 'Последний вопрос: что делать, если таблица не вспоминается?', 'The last question: what to do if the table does not come to mind?'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
