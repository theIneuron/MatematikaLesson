// ============================================================================
// 11-sinf, Dars 02. QOIDALAR.  (Правила)
//
// B1 blokining IKKINCHI darsi. Faqat MA'LUMOT.
//   raskadrovka: src/books/grade11/DARS02_SKELET.md
//   kontrakt:    src/books/grade11/ETALON_11SINF.md
//
// Etalondan (12-dars) farqi NOL ekran. Yangi asbob yo'q: `graph` roli
// 1-darsda yozilgan `CurveBoard` ni chizadi.
//
// DARSNING BITTA GAPI: ortiqcha ko'paytuvchi OLDINDAN so'ndiriladi. U qayerdan
// kelishi muhim emas: ko'rsatkichdan ham, qavs ichidagi ikki iksdan ham.
// 1-dars ko'rsatkichdan kelganini so'ndirishni o'rgatgan edi, bu dars uni
// umumlashtiradi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_02',
  title: L('Qoidalar', 'Правила', 'The rules'),
}

const BLOCK = { label: 'B1', from: 1, to: 7, current: 2 }

// ============================================================
// SLAYD 1. XUK. Bitta masala, ikki xil ko'rinishdagi javob.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Qoidalar', 'Правила', 'The rules'),
  title: L('Ikki yechim', 'Два решения', 'Two solutions'),
  // Xuk BIRINCHI darajali qavsda turibdi, kvadratda emas. Sabab vyorstka:
  // (2x+1)² ning ochilgani «F = 4x³/3 + 2x² + x» bo'ladi va telefonda
  // 52px kesilardi, 3-slayd esa balandlikdan chiqib ketardi. Matematika
  // o'zgarmadi: ikki xil ko'rinishdagi javob, farqi o'zgarmas son.
  expr: L(
    'F ni toping:  f = 2x + 1',
    'Найди F:  f = 2x + 1',
    'Find F:  f = 2x + 1',
  ),
  rows: [
    {
      id: 'a',
      name: L("qo'shiluvchilar bo'yicha", 'по слагаемым', 'term by term'),
      value: 'F = x² + x + C',
    },
    {
      id: 'b',
      name: L('qavs orqali', 'через скобку', 'via the bracket'),
      value: 'F = (2x+1)²/4 + C',
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
  holds: [5000, 5500, 5500, 4000],
  audio: [
    A('mount', "O'tgan dars bitta qoida berdi: ko'rsatkichni ko'tar va yangisiga bo'l. Bugun qoidalar uchta bo'ladi.", 'Прошлый урок дал одно правило: подними показатель и раздели на новый. Сегодня правил станет три.', 'The previous lesson gave one rule: raise the exponent and divide by the new one. Today there will be three rules.'),
    A('r1', "Birinchi yechim: ikkita qo'shiluvchi alohida hisoblandi, iks kvadrat va iks.", 'Первое решение: два слагаемых посчитали по отдельности, икс в квадрате и икс.', 'The first solution: the two terms were computed separately, x squared and x.'),
    A('r2', "Ikkinchi yechim: yozuvda qavs ko'rildi va u yaxlit olindi. Bitta satr, va maxrajda qayerdandir to'rt paydo bo'ldi.", 'Второе решение: в записи увидели скобку и взяли её целиком. Одна строка, и в знаменателе откуда-то взялась четвёрка.', 'The second solution: a bracket was seen in the record and taken as a whole. One line, and a four appeared in the denominator out of nowhere.'),
    A('ask', "Sizningcha qaysi yechim to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какое решение верное? Пока просто предположи.', 'Which solution do you think is correct? Just make a guess for now.'),
  ],
}

// ============================================================
// SLAYD 2. TAYANCH: hosila haqida uch narsa.
// ============================================================
const S2 = {
  role: 'support',
  eyebrow: L('Tayanchni tekshirish', 'Проверка опоры', 'Checking the basics'),
  title: L('Uch tayanch', 'Три опоры', 'Three basics'),
  lead: L(
    "Qoidalarni ochishdan oldin hosila haqida uch narsani eslaymiz. Bu baholanmaydi.",
    'Прежде чем открывать правила, вспомним три вещи о производной. Это не оценивается.',
    'Before opening the rules, let us recall three things about the derivative. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L("O'zgarmas ko'paytuvchi joyida qoladi", 'Постоянный множитель остаётся на месте', 'A constant factor stays where it is'),
      short: L("ko'paytuvchi o'tib ketadi", 'множитель проходит насквозь', 'the factor passes through'),
      ex: [
        { e: "(5x³)' = 15x²", why: L('beshlik joyida, uchlik ko\'rsatkichdan chiqdi', 'пятёрка на месте, тройка вышла из показателя', 'the five stays, the three came out of the exponent') },
        { e: "(7x)' = 7", why: L('yettilik hech qayerga ketmadi', 'семёрка никуда не делась', 'the seven did not go anywhere') },
      ],
    },
    {
      id: 'c2',
      title: L("Yig'indi hosilasi — hosilalar yig'indisi", 'Производная суммы — сумма производных', 'The derivative of a sum is the sum of derivatives'),
      short: L("qo'shiluvchilar bo'yicha", 'по слагаемым', 'term by term'),
      ex: [
        { e: "(x³ + 4x)' = 3x² + 4", why: L('har qo\'shiluvchi alohida', 'каждое слагаемое отдельно', 'each term on its own') },
      ],
    },
    {
      id: 'c3',
      title: L('Qavsning hosilasi', 'Производная скобки', 'The derivative of a bracket'),
      short: L('ichkarisi tashqariga chiqadi', 'внутренняя выходит наружу', 'the inner one comes out'),
      ex: [
        { e: "((2x+1)⁴)' = 8(2x+1)³", why: L("to'rtlik ko'rsatkichdan, ikkilik qavsdan", 'четвёрка из показателя, двойка из скобки', 'the four from the exponent, the two from the bracket') },
        { e: "((3x−2)⁵)' = 15(3x−2)⁴", why: L('besh karra uch, o\'n besh', 'пять на три, пятнадцать', 'five times three, fifteen') },
      ],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L("(7x²)' nechaga teng?", 'Чему равна (7x²)’ ?', 'What is (7x²)’ ?'),
      cols: 4,
      items: [
        { id: 'a', label: '14x', correct: true },
        { id: 'b', label: '2x', hint: L("Yettilik hech qayerga ketmadi: u ko'paytuvchi bo'lib qoladi.", 'Семёрка никуда не делась: она остаётся множителем.', 'The seven did not go anywhere: it stays as a factor.') },
        { id: 'c', label: '7x', hint: L("Ko'rsatkich oldinga chiqadi va yettiga ko'payadi: ikki karra yetti.", 'Показатель выходит вперёд и умножается на семь: два на семь.', 'The exponent moves to the front and multiplies the seven: two times seven.') },
        { id: 'd', label: '14x²', hint: L("Ko'rsatkich bir kamayadi: ikki emas, bir.", 'Показатель уменьшается на один: не два, а один.', 'The exponent drops by one: one, not two.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L("((2x+1)⁴)' nechaga teng?", 'Чему равна ((2x+1)⁴)’ ?', 'What is ((2x+1)⁴)’ ?'),
      cols: 4,
      items: [
        { id: 'a', label: '8(2x+1)³', correct: true },
        { id: 'b', label: '4(2x+1)³', hint: L("Qavsning hosilasi unutildi: u ikkiga teng va tashqariga chiqadi.", 'Забыта производная скобки: она равна двум и выходит наружу.', 'The derivative of the bracket is forgotten: it equals two and comes out.') },
        { id: 'c', label: '4(2x+1)⁴', hint: L("Ko'rsatkich bir kamayishi kerak: to'rt emas, uch.", 'Показатель должен уменьшиться на один: не четыре, а три.', 'The exponent must drop by one: three, not four.') },
        { id: 'd', label: '(2x+1)³', hint: L("Ko'rsatkich ham ko'paytuvchi bo'lib chiqadi, faqat qavs emas.", 'Показатель тоже выходит множителем, не только скобка.', 'The exponent comes out as a factor too, not only the bracket.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L("Sakkizlik qayerdan keldi?", 'Откуда взялась восьмёрка?', 'Where did the eight come from?'),
      cols: 2,
      items: [
        { id: 'a', label: L("to'rtlik ko'rsatkichdan, ikkilik qavsdan", 'четвёрка из показателя, двойка из скобки', 'the four from the exponent, the two from the bracket'), correct: true },
        { id: 'b', label: L("bu ikkining kubi", 'это два в кубе', 'that is two cubed'), hint: L("Beshinchi darajada tekshiring: o'n chiqadi, ikkining to'rtinchi darajasi esa o'n olti.", 'Проверь на пятой степени: выйдет десять, а два в четвёртой это шестнадцать.', 'Check with the fifth power: you get ten, while two to the fourth is sixteen.') },
        { id: 'c', label: L("faqat qavsdan", 'только из скобки', 'from the bracket alone'), hint: L("Qavsning o'zi ikkilikni beradi. To'rtlik ko'rsatkichdan keladi.", 'Сама скобка даёт двойку. Четвёрка приходит из показателя.', 'The bracket itself gives the two. The four comes from the exponent.') },
        { id: 'd', label: L('tasodifiy son', 'случайное число', 'a random number'), hint: L("Qavs ichida uch bo'lsa, javobda o'n ikki chiqadi. Tasodif emas.", 'Если внутри скобки тройка, в ответе выйдет двенадцать. Это не случайность.', 'With a three inside the bracket the answer gives twelve. That is not chance.') },
      ],
    },
  ],
  holds: [3000, 8000, 5500, 8500, 5000, 3500],
  audio: [
    A('mount', 'Uch narsani tiklaymiz. Bu baho emas.', 'Восстановим три вещи. Это не оценка.', 'Let us restore three things. This is not graded.'),
    A('c1', "Birinchi tayanch. O'zgarmas ko'paytuvchi hosilada joyida qoladi. Besh iks kubning hosilasi o'n besh iks kvadrat: beshlik joyida, uchlik esa ko'rsatkichdan chiqdi.", 'Первая опора. Постоянный множитель в производной остаётся на месте. Производная пять икс в кубе это пятнадцать икс в квадрате: пятёрка на месте, а тройка вышла из показателя.', 'First basic. A constant factor stays where it is in the derivative. The derivative of five x cubed is fifteen x squared: the five stays, and the three came out of the exponent.'),
    A('c2', "Ikkinchi tayanch. Yig'indining hosilasi bu hosilalar yig'indisi. Har qo'shiluvchi alohida hisoblanadi.", 'Вторая опора. Производная суммы это сумма производных. Каждое слагаемое считается отдельно.', 'Second basic. The derivative of a sum is the sum of derivatives. Each term is computed separately.'),
    A('c3', "Uchinchi tayanch, va bugun eng muhimi. Qavs ichida oddiy iks emas, ikki iks turgan bo'lsa, differensiallashda o'sha ikkilik tashqariga ko'paytuvchi bo'lib chiqadi. Shuning uchun javobda to'rtlik emas, sakkizlik turibdi.", 'Третья опора, и сегодня она главная. Если внутри скобки не просто икс, а два икс, при дифференцировании эта двойка выходит наружу множителем. Поэтому в ответе стоит не четвёрка, а восьмёрка.', 'Third basic, and today the main one. If inside the bracket there is not just x but two x, then when differentiating that two comes out as a factor. That is why the answer has an eight, not a four.'),
    A('recap', "Qisqacha: ko'paytuvchi o'tib ketadi, qo'shiluvchilar alohida, qavs ichidagisi tashqariga chiqadi.", 'Коротко: множитель проходит насквозь, слагаемые отдельно, внутренность скобки выходит наружу.', 'Briefly: a factor passes through, terms go separately, the inside of a bracket comes out.'),
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
  expr: L('kerak:  hosila = 2x + 1', 'нужно: производная = 2x + 1', 'needed: derivative = 2x + 1'),
  goal: L('hosilasi 2x + 1 chiqsin', 'производная должна дать 2x + 1', 'the derivative must give 2x + 1'),
  rule: L(
    "Tekshiruv bitta: differensiallaymiz va 2x + 1 bilan solishtiramiz.",
    'Проверка одна: продифференцировать и сравнить с 2x + 1.',
    'One check: differentiate and compare with 2x + 1.',
  ),
  pick: L('Qaysi yechimni tekshiramiz?', 'Какое решение проверим?', 'Which solution shall we check?'),
  // `F = ` YOZILMAYDI: da'vo ustuni past telefonda tor bo'lib qoladi va
  // «F = (2x+1)²/4» o'ng chetdan 26px kesilardi. Yozuvni nomi tanitadi.
  claims: [
    { id: 'a', key: 'inA', name: L("qo'shiluvchilar bo'yicha", 'по слагаемым', 'term by term'), value: 'x² + x' },
    { id: 'b', key: 'inB', name: L('qavs orqali', 'через скобку', 'via the bracket'), value: '(2x+1)²/4' },
  ],
  // Uchala `calc` BIR SATRDA turishi kerak: telefonda har bir o'rash 22px
  // beradi. Oraliq qadam ovozda aytiladi, ekranda esa natija.
  points: [
    {
      id: 'q1', label: 'x² + x', num: 'x² + x', step: 'calc', verdict: 'in',
      role: L("qo'shiluvchilar bo'yicha", 'по слагаемым', 'term by term'),
      calc: "(x² + x)' = 2x + 1  ✓",
      sol: true, inA: true, inB: false,
    },
    {
      id: 'q2', label: '(2x+1)²/4', num: '(2x+1)²/4', step: 'calc', verdict: 'in',
      role: L('qavs orqali', 'через скобку', 'via the bracket'),
      calc: "((2x+1)²/4)' = 4(2x+1)/4 = 2x + 1  ✓",
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q3', label: '(2x+1)²/2', num: '(2x+1)²/2', step: 'calc', verdict: 'out',
      role: L('nazorat uchun', 'для контроля', 'as a control'),
      calc: "((2x+1)²/2)' = 2(2x+1)  ✗",
      sol: false, inA: false, inB: false,
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    items: [
      {
        id: 'both', label: L('ikkisi ham', 'оба', 'both'), correct: true,
        ok: L(
          "To'g'ri. Farq bir to'rtdan, ya'ni o'zgarmas son.",
          'Верно. Разница равна одной четвёртой, то есть постоянной.',
          'Correct. The difference is one quarter, that is a constant.',
        ),
      },
      {
        id: 'a', label: L('faqat birinchi', 'только первое', 'the first only'),
        hint: L("Ikkinchisining tekshiruvi aynan o'sha hosilani berdi. Demak u ham yaroqli.", 'Проверка второго дала ровно ту же производную. Значит и оно годится.', 'Checking the second gave exactly the same derivative. So it is valid too.'),
      },
      {
        id: 'b', label: L('faqat ikkinchi', 'только второе', 'the second only'),
        hint: L("Qo'shiluvchilar bo'yicha yozuv ham kerakli hosilani berdi. Ular bir to'rtdanga farq qiladi, bu esa o'zgarmas.", 'Запись по слагаемым тоже дала нужную производную. Они отличаются на одну четвёртую, а это постоянная.', 'The term by term record also gave the required derivative. They differ by one quarter, and that is a constant.'),
      },
      {
        id: 'none', label: L('hech qaysi', 'ни одно', 'neither'),
        hint: L("Tekshiruv kerakli hosilani ikki marta berdi. Demak yaroqli yechim bor.", 'Проверка дала нужную производную дважды. Значит годное решение есть.', 'The check gave the required derivative twice. So a valid solution does exist.'),
      },
    ],
  },
  holds: [2500, 6500, 1500, 2500, 11500, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Bahsga qaytamiz.', 'Опора восстановлена. Вернёмся к спору.', 'The basics are back. Let us return to the argument.'),
    A('mount', "Yechimni tekshirish uchun uni differensiallaymiz. Hosila ikki iks plyus bir bersa, yechim yaroqli.", 'Чтобы проверить решение, продифференцируем его. Если производная даст два икс плюс один, решение годится.', 'To check a solution we differentiate it. If the derivative gives two x plus one, the solution is valid.'),
    A('mount', "Yechimni tanlang.", 'Выбери решение.', 'Pick a solution.'),
    A('calc', 'Differensiallaymiz.', 'Дифференцируем.', 'We differentiate.'),
    A('mark', "Uchta yozuv tekshirildi. Qo'shiluvchilar bo'yicha yozilgani ikki iks plyus bir berdi. Qavs orqali yozilgani ham o'sha natijani berdi: to'rtta qavs bo'lingan to'rt, ya'ni bitta qavs. Uchinchisi esa ikki barobar ko'p chiqdi. Demak birinchi ikkitasi bir xil javob, faqat boshqacha yozilgan.", 'Три записи проверены. Запись по слагаемым дала два икс плюс один. Запись через скобку дала тот же результат: четыре скобки делить на четыре, то есть одна скобка. А третья дала вдвое больше. Значит первые две это один и тот же ответ, просто записанный по, разному.', 'Three records checked. The term by term one gave two x plus one. The bracket one gave the same result: four brackets over four, that is one bracket. The third gave twice as much. So the first two are one and the same answer, just written differently.'),
    A('next', 'Endi javob bering: qaysi yechim yaroqli?', 'Теперь ответь: какое решение годится?', 'Now answer: which solution is valid?'),
  ],
}

// ============================================================
// SLAYD 4. NEGA KO'PAYTUVCHI O'TIB KETADI: urinmalar.
// ============================================================
const FA = (x) => (x * x * x) / 3
const FB = (x) => 2 * x * x * x

const S4 = {
  role: 'graph',
  tag: 'linearity',
  drag: false,
  eyebrow: L("Nega ko'paytuvchi o'tib ketadi", 'Почему множитель проходит насквозь', 'Why the factor passes through'),
  title: L('Qiyalik ham olti barobar', 'Наклон тоже в шесть раз', 'The slope grows six times too'),
  chip: L('x³/3  va  2x³', 'x³/3  и  2x³', 'x³/3  and  2x³'),
  // Oyna TOR olinadi. Keng oynada (o'qi o'n birlik) iks kubi bo'lingan uch
  // deyarli to'g'ri chiziqqa aylanadi va ikkala urinma ham gorizontal
  // ko'rinadi: ekran «olti barobar» degan gapni TASDIQLAMAYDI. Ko'rinmagan
  // guvoh guvoh emas -- shuning uchun yana `note` da ikkita son turibdi.
  graph: {
    curves: [
      { fn: FA, tone: 'ink', from: 1 },
      { fn: FB, tone: 'accent', from: 2 },
    ],
    xDomain: [-1.3, 1.3],
    yDomain: [-4.2, 4.2],
    xTicks: [{ v: -1 }, { v: 1 }],
    yTicks: [{ v: 0 }, { v: 2 }],
    tangentAt: 1,
    note: L('x = 1 da qiyalik:  1  va  6', 'наклон при x = 1:  1  и  6', 'slope at x = 1:  1  and  6'),
    height: 168,
  },
  graphSteps: 3,
  bonus: L(
    "Ko'paytuvchi egri chiziqni ham, uning qiyaligini ham bir xil marta cho'zadi. Shuning uchun boshlang'ich funksiyada u o'zgarmagan holda qoladi.",
    'Множитель растягивает и кривую, и её наклон в одно и то же число раз. Поэтому в первообразной он остаётся тем же самым.',
    'A factor stretches both the curve and its slope by the same number of times. That is why it stays unchanged in the antiderivative.',
  ),
  probe: {
    question: L("Nega ikkinchi egri chiziqning qiyaligi olti barobar katta?", 'Почему у второй кривой наклон в шесть раз больше?', 'Why is the slope of the second curve six times greater?'),
    items: [
      { id: 'a', label: L("butun egri chiziq vertikal bo'yicha olti barobar cho'zilgan", 'вся кривая растянута по вертикали в шесть раз', 'the whole curve is stretched six times vertically'), correct: true },
      { id: 'b', label: L("chunki u yuqorida turibdi", 'потому что она выше', 'because it is higher'), hint: L("Balandlik qiyalik emas. O'tgan darsda o'zgarmas egrini ko'targan edi, qiyalik esa o'zgarmagan.", 'Высота это не наклон. В прошлом уроке постоянная поднимала кривую, а наклон не менялся.', 'Height is not slope. In the previous lesson a constant lifted the curve while the slope stayed the same.') },
      { id: 'c', label: L("chunki ko'rsatkich boshqa", 'потому что показатель другой', 'because the exponent is different'), hint: L("Ko'rsatkich o'sha, uchinchi. Faqat daraja oldidagi ko'paytuvchi o'zgardi.", 'Показатель тот же, третий. Изменился только множитель перед степенью.', 'The exponent is the same, the third. Only the factor in front of the power changed.') },
      { id: 'd', label: L("bu faqat shu nuqtada shunday", 'так вышло только в этой точке', 'it only happened at this point'), hint: L("Boshqa nuqtani oling: u yerda ham roppa rosa olti barobar chiqadi.", 'Возьми любую другую точку: там тоже будет ровно в шесть раз.', 'Take any other point: there it is exactly six times as well.') },
    ],
  },
  holds: [4500, 5500, 6500, 8000],
  audio: [
    A('mount', "Bahs yopildi. Endi qoidalarni birma bir ochamiz, birinchisi ko'paytuvchi haqida.", 'Спор закрыт. Теперь откроем правила по одному, первое про множитель.', 'The argument is settled. Now let us open the rules one by one, the first about a factor.'),
    A('one', "Mana iks kubi bo'lingan uch. Bu iks kvadrat uchun boshlang'ich funksiya, buni o'tgan darsdan bilamiz.", 'Вот икс в кубе делить на три. Это первообразная для икс в квадрате, её мы знаем с прошлого урока.', 'Here is x cubed over three. It is the antiderivative of x squared, known from the previous lesson.'),
    A('two', "Endi ikkinchi egri chiziq: ikki iks kubi. U birinchisidan olti barobar baland, chunki bir uchdan olti barobar orttirilgan.", 'Теперь вторая кривая: два икс в кубе. Она в шесть раз выше первой, потому что одну треть увеличили в шесть раз.', 'Now the second curve: two x cubed. It is six times higher than the first, because one third was increased six times.'),
    A('tangent', "Va mana eng muhimi. Bitta nuqtada ikkala egri chiziqqa urinma o'tkazamiz. Birinchisining qiyaligi bir, ikkinchisiniki olti. Ko'paytuvchi egri chiziqni ham, qiyalikni ham bir xil marta cho'zdi. Shuning uchun teskari amalda u o'zgarmagan holda o'tib ketadi.", 'И вот главное. В одной точке проведём касательные к обеим кривым. У первой наклон один, у второй шесть. Множитель растянул и кривую, и наклон в одинаковое число раз. Поэтому в обратном действии он проходит насквозь без изменений.', 'And here is the main thing. At one point we draw tangents to both curves. The first has slope one, the second six. The factor stretched both the curve and the slope by the same number of times. That is why in the reverse operation it passes through unchanged.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1: ko'paytuvchi va qo'shiluvchilar.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'linearity',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L("Ko'paytuvchi va qo'shiluvchilar", 'Множитель и слагаемые', 'Factors and terms'),
  rows: [
    '6x²   →   2x³ + C',
    '4x    →   2x² + C',
    '6x² + 4x   →   2x³ + 2x² + C',
  ],
  probe: {
    question: L('f = 10x⁴ uchun nima chiqadi?', 'Что получится для f = 10x⁴ ?', 'What comes out for f = 10x⁴ ?'),
    items: [
      { id: 'a', label: '2x⁵ + C', correct: true },
      { id: 'b', label: '10x⁵ + C', hint: L("Yangi ko'rsatkichga bo'lish unutildi: o'n bo'lingan besh bu ikki.", 'Забыли поделить на новый показатель: десять делить на пять это два.', 'The division by the new exponent was forgotten: ten over five is two.') },
      { id: 'c', label: '40x³ + C', hint: L("Bu hosila, teskari amal emas.", 'Это производная, а не обратное действие.', 'That is the derivative, not the reverse operation.') },
      { id: 'd', label: 'x⁵/5 + C', hint: L("O'nlik yo'qolib qoldi. Ko'paytuvchi hech qayerga ketmaydi.", 'Десятка пропала. Множитель никуда не девается.', 'The ten disappeared. A factor does not go anywhere.') },
    ],
  },
  rule: {
    badge: L("1-qoida. Ko'paytuvchi va qo'shiluvchilar", 'Правило 1. Множитель и слагаемые', 'Rule 1. Factors and terms'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'a·f + b·g   →   a·F + b·G + C',
    lines: [
      L("o'zgarmas ko'paytuvchi o'zgarmasdan o'tib ketadi", 'постоянный множитель проходит насквозь без изменений', 'a constant factor passes through unchanged'),
      L("har qo'shiluvchi alohida hisoblanadi", 'каждое слагаемое считается отдельно', 'each term is computed separately'),
      L("har biriga daraja qoidasi qo'llaniladi", 'к каждому применяется правило степени', 'the power rule applies to each of them'),
      L('+ C oxirida bir marta yoziladi', '+ C пишется один раз в конце', '+ C is written once at the end'),
    ],
    example: L('misol:  6x² + 4x  →  2x³ + 2x² + C', 'пример:  6x² + 4x  →  2x³ + 2x² + C', 'example:  6x² + 4x  →  2x³ + 2x² + C'),
  },
  holds: [4000, 6500, 4000],
  audio: [
    A('mount', "Chizmani ko'rdik. Endi buni qoida qilib yozamiz.", 'Чертёж мы увидели. Теперь запишем это правилом.', 'We have seen the drawing. Now let us write it as a rule.'),
    A('rows', "Olti iks kvadrat uchun boshlang'ich funksiya ikki iks kubi: oltilik joyida qoldi, uchlik esa bo'lishdan keldi. To'rt iks uchun ikki iks kvadrat. Va ikkalasi birga bo'lsa, javoblar shunchaki qo'shiladi.", 'Для шести икс в квадрате первообразная это два икс в кубе: шестёрка осталась на месте, а тройка пришла от деления. Для четырёх икс это два икс в квадрате. А если они стоят вместе, ответы просто складываются.', 'For six x squared the antiderivative is two x cubed: the six stayed, and the three came from the division. For four x it is two x squared. And when they stand together, the answers simply add up.'),
    A('q', "Savol: o'n iks to'rtinchi darajada uchun nima chiqadi?", 'Вопрос: что получится для десять икс в четвёртой?', 'The question: what comes out for ten x to the fourth?'),
    A('rule', "To'g'ri. Ko'paytuvchi tegilmagan holda qoladi, qo'shiluvchilar esa alohida hisoblanadi.", 'Верно. Множитель остаётся нетронутым, а слагаемые считаются по отдельности.', 'Correct. The factor stays untouched, and the terms are computed separately.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: qavs yettinchi darajada.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'inner_k',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Endi qavs yettinchi darajada', 'Теперь скобка в седьмой', 'Now the bracket to the seventh'),
  was: { label: UI.was, expr: 'f = 2x + 1   →   F = (2x+1)²/4' },
  now: { label: UI.now, expr: 'f = (2x+1)⁷   →   F = ?' },
  probe1: {
    question: L('Bu holat oldingisidan nimasi bilan qiyinroq?', 'Чем этот случай труднее прежнего?', 'Why is this case harder than the previous one?'),
    items: [
      { id: 'a', label: L("qavsni ochib bo'lmaydi: sakkizta qo'shiluvchi chiqadi", 'раскрыть скобку уже нельзя: получится восемь слагаемых', 'the bracket cannot be expanded: eight terms would appear'), correct: true },
      { id: 'b', label: L("chunki ko'rsatkich toq", 'потому что показатель нечётный', 'because the exponent is odd'), hint: L("Toq yoki juftligi ahamiyatsiz: oltinchi daraja bilan ham xuddi shunday bo'lardi.", 'Чётность здесь ни при чём: с шестой степенью было бы то же самое.', 'Parity is beside the point: with the sixth power it would be the same.') },
      { id: 'c', label: L("chunki bu yerda + C kerak emas", 'потому что здесь не нужно + C', 'because no + C is needed here'), hint: L("Kerak: o'zgarmas haqidagi qoida har doim ishlaydi.", 'Нужно: правило про постоянную работает всегда.', 'It is needed: the rule about the constant always works.') },
      { id: 'd', label: L("chunki daraja beshdan katta", 'потому что степень больше пяти', 'because the power is greater than five'), hint: L("Gap darajaning kattaligida emas: qavssiz yettinchi daraja bilan darrov ish bitardi.", 'Дело не в величине степени: с седьмой без скобки мы справились бы сразу.', 'It is not about the size of the power: without a bracket the seventh would be immediate.') },
    ],
  },
  probe2: {
    // Ikki ustun: to'rtta uzun formula telefonda chetdan chiqib ketardi.
    cols: 2,
    question: L('Nimaga bo\'lishga to\'g\'ri keladi?', 'На что придётся делить?', 'What will we have to divide by?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '(2x+1)⁸/16' },
      { id: 'b', label: '(2x+1)⁸/8' },
      { id: 'c', label: '(2x+1)⁸/2' },
      { id: 'd', label: '(2x+1)⁸' },
    ],
  },
  holds: [4500, 6500, 3500, 3000],
  audio: [
    A('mount', "Birinchi darajada oson edi: qo'shiluvchilar bo'yicha ham hisoblasa bo'lardi.", 'С первой степенью было проще: можно было посчитать и по слагаемым.', 'With the first power it was easier: one could also count term by term.'),
    A('now', "Endi o'sha qavs yettinchi darajada. Uni ochish degani sakkizta qo'shiluvchini yozish degani, va buni hech kim qilmaydi. Demak usul kerak.", 'Теперь та же скобка в седьмой степени. Раскрыть её значит выписать восемь слагаемых, и этого никто делать не станет. Значит нужен способ.', 'Now the same bracket to the seventh power. Expanding it means writing out eight terms, and nobody will do that. So a method is needed.'),
    A('q1', 'Bu holat oldingisidan nimasi bilan qiyinroq?', 'Чем этот случай труднее прежнего?', 'Why is this case harder than the previous one?'),
    A('q2', 'Sizningcha nimaga bo\'linadi? Shunchaki taxmin qiling.', 'Как думаешь, на что поделим? Просто предположи.', 'What do you think we divide by? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD: sakkizga yoki o'n oltiga.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'inner_k',
  eyebrow: L('Ikkisini ham differensiallaymiz', 'Продифференцируем обе', 'Let us differentiate both'),
  title: L('Ikki nomzod', 'Два кандидата', 'Two candidates'),
  expr: 'f = (2x+1)⁷',
  need: "= (2x+1)⁷",
  answerLabel: L('ikkinchi nomzod', 'второй кандидат', 'the second candidate'),
  cards: [
    {
      tag: L('A nomzod', 'кандидат A', 'candidate A'),
      txt: 'F = (2x+1)⁸/8',
      point: {
        label: L('differensiallaymiz', 'дифференцируем', 'we differentiate'),
        calc: "16(2x+1)⁷/8 = 2(2x+1)⁷  ✗",
        verdict: 'out',
      },
    },
    {
      tag: L('B nomzod', 'кандидат B', 'candidate B'),
      txt: 'F = (2x+1)⁸/16',
      point: {
        label: L('differensiallaymiz', 'дифференцируем', 'we differentiate'),
        calc: "16(2x+1)⁷/16 = (2x+1)⁷  ✓",
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['(2x+1)⁸/8', '(2x+1)⁸/16', '(2x+1)⁸', '(2x+1)⁷/16'],
    value: ['(2x+1)⁸/16'],
    label: 'F(x) =',
    prompt: L('Boshlang\'ich funksiyani yozing', 'Запиши первообразную', 'Write the antiderivative'),
    wrongs: [
      { key: '(2x+1)⁸/8', hint: L("Differensiallang: kerakligidan ikki barobar ko'p chiqadi. Qavs o'zining ikkiligini qo'shadi.", 'Продифференцируй: выйдет вдвое больше нужного. Скобка добавляет свою двойку.', 'Differentiate it: you get twice what is needed. The bracket adds its own two.') },
      { key: '(2x+1)⁸', hint: L("Unda hosila o'n olti barobar ko'p chiqadi.", 'Тогда производная выйдет в шестнадцать раз больше.', 'Then the derivative comes out sixteen times too big.') },
      { key: '*', hint: L("Ikkita ko'paytuvchini so'ndirish kerak: ko'rsatkichdan sakkiz va qavsdan ikki.", 'Гасить надо два множителя: восемь из показателя и два из скобки.', 'Two factors must be cancelled: eight from the exponent and two from the bracket.') },
    ],
  },
  holds: [3500, 7500, 7500, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi ikkala nomzodni ham differensiallaymiz.', 'Прогноз есть. Теперь продифференцируем обоих кандидатов.', 'The guess is made. Now let us differentiate both candidates.'),
    A('p1', "Birinchi nomzod: qavs sakkizinchi darajada, bo'lingan sakkizga. Differensiallaymiz: ko'rsatkichdan sakkiz, qavsdan ikki, jami o'n olti. O'n oltini sakkizga bo'lsak, ikki qoladi. Kerakligidan ikki barobar ko'p.", 'Первый кандидат: скобка в восьмой, делить на восемь. Дифференцируем: восемь из показателя, два из скобки, вместе шестнадцать. Шестнадцать делить на восемь это два. Вдвое больше нужного.', 'The first candidate: the bracket to the eighth, over eight. We differentiate: eight from the exponent, two from the bracket, sixteen together. Sixteen over eight is two. Twice as much as needed.'),
    A('p2', "Ikkinchi nomzod: bo'lingan o'n oltiga. O'sha o'n olti o'n oltiga bo'linadi va bir qoladi. Aynan kerakli narsa.", 'Второй кандидат: делить на шестнадцать. Те же шестнадцать делятся на шестнадцать и остаётся один. Ровно то, что нужно.', 'The second candidate: over sixteen. The same sixteen divides by sixteen and one remains. Exactly what is needed.'),
    A('write', "Demak o'n olti bu sakkiz karra ikki: biri ko'rsatkichdan, ikkinchisi qavsdan. Javobni yozing.", 'Значит шестнадцать это восемь на два: одно из показателя, другое из скобки. Запиши ответ.', 'So sixteen is eight times two: one from the exponent, the other from the bracket. Write the answer.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2: qavs, va uch qoidaning JAMLANMASI.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'inner_k',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Qavs qoidasi', 'Правило скобки', 'The bracket rule'),
  cases: [
    {
      label: L("ko'rsatkichdan", 'из показателя', 'from the exponent'),
      text: L("yangi ko'rsatkichga bo'linadi", 'делим на новый показатель', 'divide by the new exponent'),
      tone: 'graph',
    },
    {
      label: L('qavsdan', 'из скобки', 'from the bracket'),
      text: L("iks oldidagi ko'paytuvchiga ham bo'linadi", 'делим ещё и на множитель при иксе', 'divide also by the factor at x'),
      tone: 'accent',
    },
  ],
  rows: ['f(kx + b)   →   F(kx + b) / k + C', '(2x+1)⁷   →   (2x+1)⁸ / 16 + C'],
  probe: {
    question: L("Nega iks oldidagi ko'paytuvchiga ham bo'linadi?", 'Почему делят ещё и на множитель при иксе?', 'Why do we also divide by the factor at x?'),
    items: [
      { id: 'a', label: L("differensiallashda qavs uni tashqariga chiqaradi", 'при дифференцировании скобка выбрасывает его наружу', 'when differentiating, the bracket throws it out'), correct: true },
      { id: 'b', label: L("shunday yozish qisqaroq", 'так записывается короче', 'it is a shorter way to write'), hint: L("Bu qisqartma emas: bo'lmasa hosila k barobar ko'p chiqadi.", 'Это не сокращение: без деления производная выходит в k раз больше.', 'It is not a shorthand: without the division the derivative comes out k times too big.') },
      { id: 'c', label: L("ozod hadga bo'linadi", 'делим на свободный член', 'we divide by the constant term'), hint: L("Qavs ichidagi son differensiallashda yo'qoladi. Tashqariga faqat iks oldidagi ko'paytuvchi chiqadi.", 'Число внутри скобки при дифференцировании исчезает. Наружу выходит только множитель при иксе.', 'The number inside the bracket vanishes when differentiating. Only the factor at x comes out.') },
      { id: 'd', label: L("bo'lish shart emas, bu aniqlik", 'делить не обязательно, это уточнение', 'dividing is optional, a refinement'), hint: L("Shart: differensiallab tekshiring, javob mos kelmaydi.", 'Обязательно: проверь дифференцированием, ответ не сойдётся.', 'It is required: check by differentiating, the answer will not match.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Qavs', 'Правило 2. Скобка', 'Rule 2. The bracket'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'f(kx + b)   →   F(kx + b) / k + C',
    lines: [
      L("qavsni yaxlit belgi deb qarab, daraja qoidasini qo'llang", 'смотри на скобку как на единый знак и применяй правило степени', 'treat the bracket as one symbol and apply the power rule'),
      L("keyin iks oldidagi ko'paytuvchiga bo'ling", 'потом раздели на множитель при иксе', 'then divide by the factor at x'),
      L('qavs ichidagi son hech narsaga ta\'sir qilmaydi', 'число внутри скобки ни на что не влияет', 'the number inside the bracket changes nothing'),
      L('+ C va differensiallab tekshiruv', '+ C и проверка дифференцированием', '+ C and the check by differentiating'),
    ],
    example: L('misol:  (3x−2)⁴  →  (3x−2)⁵/15 + C', 'пример:  (3x−2)⁴  →  (3x−2)⁵/15 + C', 'example:  (3x−2)⁴  →  (3x−2)⁵/15 + C'),
  },
  swap: {
    button: L('Uch qoidani yig\'ish', 'Собрать три правила', 'Combine the three rules'),
    badge: L('Darsning uch qoidasi', 'Три правила урока', 'The three rules of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: "F' = f",
    lines: [
      L("1. o'zgarmas ko'paytuvchi o'zgarmasdan o'tadi", '1. постоянный множитель проходит без изменений', '1. a constant factor passes through unchanged'),
      L("2. qo'shiluvchilar alohida hisoblanadi", '2. слагаемые считаются по отдельности', '2. terms are computed separately'),
      L("3. qavs bo'lsa, iks oldidagi ko'paytuvchiga ham bo'linadi", '3. если есть скобка, делим ещё и на множитель при иксе', '3. if there is a bracket, divide also by the factor at x'),
      L('4. + C, keyin differensiallab tekshir', '4. + C, потом проверка дифференцированием', '4. + C, then check by differentiating'),
    ],
  },
  holds: [4000, 6500, 4000, 5000],
  audio: [
    A('mount', "Nomzodlar javobni ko'rsatdi. Endi umumiy qoidani yozamiz.", 'Кандидаты показали ответ. Теперь запишем общее правило.', 'The candidates showed the answer. Now let us write the general rule.'),
    A('rows', "Qavs ichida iks oldida ko'paytuvchi tursa, avval odatdagidek ishlaymiz, keyin o'sha ko'paytuvchiga bo'lamiz. Ikki iks plyus bir yettinchi darajada uchun sakkiz karra ikki, ya'ni o'n olti chiqadi.", 'Если внутри скобки при иксе стоит множитель, сначала работаем как обычно, потом делим на этот множитель. Для два икс плюс один в седьмой выходит восемь на два, то есть шестнадцать.', 'If inside the bracket there is a factor at x, we first work as usual and then divide by that factor. For two x plus one to the seventh we get eight times two, that is sixteen.'),
    A('q', "Savol: nega aynan iks oldidagi ko'paytuvchiga bo'linadi?", 'Вопрос: почему делим именно на множитель при иксе?', 'The question: why do we divide by the factor at x?'),
    A('rule', "To'g'ri. Differensiallashda qavs o'sha ko'paytuvchini tashqariga chiqaradi, oldindan qo'yilgan bo'linish esa uni so'ndiradi.", 'Верно. При дифференцировании скобка выбрасывает этот множитель наружу, а заранее поставленное деление его гасит.', 'Correct. When differentiating, the bracket throws that factor out, and the division put there in advance cancels it.'),
    A('both', 'Endi uchala qoidani bitta ro\'yxatga yig\'ing.', 'А теперь собери все три правила в один список.', 'Now collect all three rules into one list.'),
  ],
}

// ============================================================
// SLAYD 9. MAXRAJNI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'inner_k',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Maxrajni qo\'ying', 'Поставь знаменатель', 'Place the denominator'),
  left: 'f = (3x−2)⁴',
  template: ['F = (3x−2)⁵ / ', { slot: 0 }, ' + C'],
  signs: ['5', '15', '3'],
  answer: '15',
  checkNote: L(
    "Tekshiruv: 15(3x−2)⁴/15 = (3x−2)⁴",
    'Проверка: 15(3x−2)⁴/15 = (3x−2)⁴',
    'Check: 15(3x−2)⁴/15 = (3x−2)⁴',
  ),
  wrongs: [
    { key: '5', hint: L("Ko'rsatkich hisobga olindi, qavs esa yo'q: hosila uch barobar ko'p chiqadi.", 'Показатель учтён, а скобка нет: производная выйдет втрое больше.', 'The exponent is accounted for, the bracket is not: the derivative comes out three times too big.') },
    { key: '3', hint: L("Qavs hisobga olindi, ko'rsatkich esa yo'q: hosila besh barobar ko'p chiqadi.", 'Скобка учтена, а показатель нет: производная выйдет впятеро больше.', 'The bracket is accounted for, the exponent is not: the derivative comes out five times too big.') },
  ],
  probe: {
    question: L("Maxraj nimalardan yig'iladi?", 'Из чего складывается знаменатель?', 'What is the denominator made of?'),
    items: [
      { id: 'a', label: L("yangi ko'rsatkich va iks oldidagi ko'paytuvchidan", 'из нового показателя и множителя при иксе', 'from the new exponent and the factor at x'), correct: true },
      { id: 'b', label: L("faqat yangi ko'rsatkichdan", 'только из нового показателя', 'from the new exponent only'), hint: L("Unda qavsdan kelgan uchlik ortiqcha bo'lib qoladi.", 'Тогда останется лишняя тройка из скобки.', 'Then an extra three from the bracket is left over.') },
      { id: 'c', label: L("faqat iks oldidagi ko'paytuvchidan", 'только из множителя при иксе', 'from the factor at x only'), hint: L("Unda ko'rsatkichdan kelgan beshlik ortiqcha bo'lib qoladi.", 'Тогда останется лишняя пятёрка из показателя.', 'Then an extra five from the exponent is left over.') },
      { id: 'd', label: L('ixtiyoriy son', 'это любое число', 'it is any number'), hint: L("Ixtiyoriy son bu C. Maxraj esa qat'iy aniqlangan.", 'Любое число это C. А знаменатель определён строго.', 'Any number is C. The denominator is strictly determined.') },
    ],
  },
  audio: [
    A('mount', 'Qoidalar yig\'ildi. Endi siz ishlaysiz.', 'Правила собраны. Теперь работаешь ты.', 'The rules are assembled. Now it is your turn.'),
    A('place', "Maxrajni qo'ying.", 'Поставь знаменатель.', 'Place the denominator.'),
    A('checked', "Bo'ldi. Endi ta'riflang: maxraj nimalardan yig'iladi?", 'Получилось. Теперь сформулируй: из чего складывается знаменатель?', 'Done. Now put it into words: what is the denominator made of?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'power', label: L("ko'rsatkichni ko'tarish", 'поднять показатель', 'raise the exponent') },
  { id: 'inner', label: L("qavs ko'paytuvchisiga bo'lish", 'поделить на множитель скобки', 'divide by the bracket factor') },
  { id: 'plusC', label: L('+ C qo\'shish', 'добавить + C', 'add + C') },
  { id: 'factor', label: L("ko'paytuvchini chiqarish", 'вынести множитель', 'pull the factor out') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'inner_k',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: 'f = 4(3x+1)²',
  actions: ACTIONS_10,
  steps: [
    {
      action: 'power',
      to: '4 · (3x+1)³ / 3',
      wrongs: [
        { action: 'inner', hint: L("Avval ko'rsatkichni ko'taring: hozircha bo'ladigan narsa yo'q.", 'Сначала подними показатель: делить пока нечего.', 'Raise the exponent first: there is nothing to divide yet.') },
        { action: 'plusC', hint: L("+ C oxirida qo'shiladi, hozircha erta.", '+ C добавляется в конце, пока рано.', '+ C is added at the end, it is too early.') },
        { action: 'factor', hint: L("Ko'paytuvchi allaqachon oldinda turibdi: to'rtlik yozuvdan tashqarida.", 'Множитель уже стоит впереди: четвёрка вынесена.', 'The factor already stands in front: the four is outside.') },
      ],
    },
    {
      action: 'inner',
      to: '4 · (3x+1)³ / 9',
      wrongs: [
        { action: 'power', hint: L("Ko'rsatkich ko'tarilgan.", 'Показатель уже поднят.', 'The exponent is already raised.') },
        { action: 'plusC', hint: L("Hali hammasi emas: qavs hisobga olinmadi.", 'Ещё не всё: скобка не учтена.', 'Not yet: the bracket is not accounted for.') },
        { action: 'factor', hint: L("Ko'paytuvchi joyida.", 'Множитель уже вынесен.', 'The factor is already out.') },
      ],
    },
    {
      action: 'plusC',
      to: 'F = 4(3x+1)³ / 9 + C',
      wrongs: [
        { action: 'power', hint: L("Ko'rsatkich ko'tarilgan.", 'Показатель уже поднят.', 'The exponent is already raised.') },
        { action: 'inner', hint: L("Qavsga bo'lindi: uch karra uch, to'qqiz.", 'На скобку уже поделено: три на три, девять.', 'The bracket division is done: three times three, nine.') },
        { action: 'factor', hint: L("Ko'paytuvchi joyida.", 'Множитель уже вынесен.', 'The factor is already out.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['4(3x+1)³/9 + C', '4(3x+1)³/3 + C', '4(3x+1)³ + C', '24(3x+1) + C'],
    value: ['4(3x+1)³/9 + C'],
    label: 'F(x) =',
    prompt: L('Javobni to\'liq yozing', 'Запиши ответ полностью', 'Write the answer in full'),
    wrongs: [
      { key: '4(3x+1)³/3 + C', hint: L("Faqat ko'rsatkichga bo'lindi. Qavs yana bitta uchlikni beradi.", 'Поделено только на показатель. Скобка даёт ещё одну тройку.', 'Divided by the exponent only. The bracket gives one more three.') },
      { key: '24(3x+1) + C', hint: L("Bu hosila, teskari amal emas.", 'Это производная, а не обратное действие.', 'That is the derivative, not the reverse operation.') },
      { key: '*', hint: L("Maxraj ikki sondan yig'iladi: yangi ko'rsatkich va qavs ko'paytuvchisi.", 'Знаменатель складывается из двух чисел: новый показатель и множитель скобки.', 'The denominator is made of two numbers: the new exponent and the bracket factor.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi ko\'paytuvchi ham, qavs ham bor misolni o\'tamiz.', 'Правило сформулировано. Пройдём пример, где есть и множитель, и скобка.', 'The rule is stated. Let us go through an example with both a factor and a bracket.'),
    A('start', "To'rtlik oldinda, qavs esa kvadratda. Nimadan boshlashni tanlang.", 'Четвёрка впереди, скобка в квадрате. Выбери, с чего начать.', 'The four is in front, the bracket is squared. Choose where to start.'),
    A('step4', 'Endi javobni to\'liq yozing.', 'Теперь запиши ответ полностью.', 'Now write the answer in full.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'inner_k',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Boshlang\'ich funksiyani toping', 'Найди первообразную', 'Find the antiderivative'),
  start: 'f = 10(2x−3)⁴',
  actions: ACTIONS_10,
  hint: L(
    "Maxraj ikki sondan yig'iladi, va oldindagi o'nlik ular bilan qisqaradi.",
    'Знаменатель складывается из двух чисел, и десятка впереди с ними сокращается.',
    'The denominator is made of two numbers, and the ten in front cancels with them.',
  ),
  steps: [
    {
      action: 'power',
      to: '10 · (2x−3)⁵ / 5',
      wrongs: [
        { action: 'inner', hint: L("Avval ko'rsatkichni ko'taring.", 'Сначала подними показатель.', 'Raise the exponent first.') },
        { action: 'plusC', hint: L("+ C oxirida.", '+ C в конце.', '+ C at the end.') },
        { action: 'factor', hint: L("O'nlik allaqachon oldinda.", 'Десятка уже впереди.', 'The ten is already in front.') },
      ],
    },
    {
      action: 'inner',
      to: '10 · (2x−3)⁵ / 10',
      wrongs: [
        { action: 'power', hint: L("Ko'rsatkich ko'tarilgan.", 'Показатель уже поднят.', 'The exponent is already raised.') },
        { action: 'plusC', hint: L("Qavs hali hisobga olinmadi.", 'Скобка ещё не учтена.', 'The bracket is not accounted for yet.') },
        { action: 'factor', hint: L("O'nlik joyida.", 'Десятка на месте.', 'The ten is in place.') },
      ],
    },
    {
      action: 'plusC',
      to: 'F = (2x−3)⁵ + C',
      wrongs: [
        { action: 'power', hint: L("Ko'rsatkich ko'tarilgan.", 'Показатель уже поднят.', 'The exponent is already raised.') },
        { action: 'inner', hint: L("Bo'lindi: besh karra ikki, o'n.", 'Уже поделено: пять на два, десять.', 'Already divided: five times two, ten.') },
        { action: 'factor', hint: L("O'nlik joyida.", 'Десятка на месте.', 'The ten is in place.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['(2x−3)⁵ + C', '2(2x−3)⁵ + C', '(2x−3)⁵/10 + C', '40(2x−3)³ + C'],
    value: ['(2x−3)⁵ + C'],
    label: 'F(x) =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '2(2x−3)⁵ + C', hint: L("Faqat yangi ko'rsatkichga bo'lindi. Qavs yana ikkilikni beradi.", 'Поделено только на новый показатель. Скобка даёт ещё двойку.', 'Divided by the new exponent only. The bracket gives one more two.') },
      { key: '40(2x−3)³ + C', hint: L("Bu hosila. Yo'nalish teskari.", 'Это производная. Направление обратное.', 'That is the derivative. The direction is reversed.') },
      { key: '*', hint: L("Differensiallab tekshiring: hosila o'n karra qavs to'rtinchi darajada chiqishi kerak.", 'Проверь дифференцированием: производная должна дать десять скобок в четвёртой.', 'Check by differentiating: the derivative must give ten brackets to the fourth.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Oldinda o'nlik, qavs ichida ikki iks. Ikkalasi ham javobga ta'sir qiladi.", 'Впереди десятка, внутри скобки два икс. Оба влияют на ответ.', 'A ten in front, two x inside the bracket. Both affect the answer.'),
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
      id: 'b1', tag: 'linearity', ask: true, cols: 4,
      done: '8x³  →  2x⁴ + C',
      prompt: L("f = 8x³ uchun boshlang'ich funksiya?", 'Первообразная для f = 8x³ ?', 'The antiderivative of f = 8x³ ?'),
      items: [
        { id: 'a', label: '2x⁴ + C', correct: true },
        { id: 'b', label: '8x⁴ + C', hint: L("Yangi ko'rsatkichga bo'lish unutildi: sakkiz bo'lingan to'rt bu ikki.", 'Забыли поделить на новый показатель: восемь делить на четыре это два.', 'The division by the new exponent was forgotten: eight over four is two.') },
        { id: 'c', label: '24x² + C', hint: L("Bu hosila.", 'Это производная.', 'That is the derivative.') },
        { id: 'd', label: 'x⁴/4 + C', hint: L("Sakkizlik yo'qoldi. Ko'paytuvchi o'tib ketadi.", 'Восьмёрка пропала. Множитель проходит насквозь.', 'The eight disappeared. A factor passes through.') },
      ],
    },
    {
      // cols: 2 -- bu blitsdagi eng uzun variantlar. To'rt ustunda telefonda
      // «(4x+3)³/12 + C» chetdan chiqib ketardi.
      id: 'b2', tag: 'inner_k', ask: true, cols: 2,
      done: '(4x+3)²  →  (4x+3)³/12 + C',
      prompt: L("f = (4x+3)² uchun?", 'Для f = (4x+3)² ?', 'For f = (4x+3)² ?'),
      items: [
        { id: 'a', label: '(4x+3)³/12 + C', correct: true },
        { id: 'b', label: '(4x+3)³/3 + C', hint: L("Qavs hisobga olinmadi: to'rtlikka ham bo'linadi.", 'Скобка не учтена: делим ещё и на четвёрку.', 'The bracket is not accounted for: divide by the four as well.') },
        { id: 'c', label: '(4x+3)³/4 + C', hint: L("Ko'rsatkich hisobga olinmadi: uchlikka ham bo'linadi.", 'Показатель не учтён: делим ещё и на тройку.', 'The exponent is not accounted for: divide by the three as well.') },
        { id: 'd', label: '(4x+3)³/7 + C', hint: L("Sonlar qo'shilmaydi, ko'paytiriladi: uch karra to'rt.", 'Числа не складываются, а умножаются: три на четыре.', 'The numbers are not added but multiplied: three times four.') },
      ],
    },
    {
      id: 'b3', tag: 'plus_c', ask: true, cols: 4,
      done: 'x⁵ + 2x  →  x⁶/6 + x² + C',
      prompt: L("f = x⁵ + 2x uchun?", 'Для f = x⁵ + 2x ?', 'For f = x⁵ + 2x ?'),
      items: [
        { id: 'a', label: 'x⁶/6 + x² + C', correct: true },
        { id: 'b', label: 'x⁶/6 + x²', hint: L("Javob to'liq emas: + C yozilmagan.", 'Ответ неполный: не написано + C.', 'The answer is incomplete: + C is missing.') },
        { id: 'c', label: 'x⁶/6 + 2x² + C', hint: L("Ikkilik ikkiga bo'linadi va bir qoladi.", 'Двойка делится на два и остаётся один.', 'The two divides by two and one remains.') },
        { id: 'd', label: '5x⁴ + 2 + C', hint: L("Bu hosila.", 'Это производная.', 'That is the derivative.') },
      ],
    },
    {
      id: 'b4', tag: 'inner_k', ask: true, cols: 1,
      done: L('qavs beshlikni chiqaradi', 'скобка выбрасывает пятёрку', 'the bracket throws out a five'),
      prompt: L(
        "Qavs ichida 5x − 1 tursa, nega beshga ham bo'linadi?",
        'Если внутри скобки 5x − 1, почему делят ещё и на пять?',
        'If the bracket holds 5x − 1, why do we also divide by five?',
      ),
      items: [
        { id: 'a', label: L("differensiallashda qavs beshlikni tashqariga chiqaradi", 'при дифференцировании скобка выбрасывает пятёрку наружу', 'when differentiating, the bracket throws the five out'), correct: true },
        { id: 'b', label: L("chunki birlik ayirilyapti", 'потому что вычитается единица', 'because one is subtracted'), hint: L("Qavs ichidagi son hosilada yo'qoladi va hech narsaga ta'sir qilmaydi.", 'Число внутри скобки исчезает в производной и ни на что не влияет.', 'The number inside the bracket vanishes in the derivative and affects nothing.') },
        { id: 'c', label: L("beshlik yangi ko'rsatkich", 'пятёрка это новый показатель', 'the five is the new exponent'), hint: L("Ko'rsatkich qavsning tepasida turadi, beshlik esa ichida.", 'Показатель стоит сверху скобки, а пятёрка внутри.', 'The exponent sits above the bracket, the five is inside.') },
        { id: 'd', label: L("bo'lish shart emas", 'делить не обязательно', 'dividing is optional'), hint: L("Bo'lmasa hosila besh barobar ko'p chiqadi.", 'Без деления производная выйдет в пять раз больше.', 'Without the division the derivative comes out five times too big.') },
      ],
    },
    {
      id: 'b5', tag: 'linearity', ask: true, cols: 4,
      done: '6x⁵ − 4x³  →  x⁶ − x⁴ + C',
      prompt: L("f = 6x⁵ − 4x³ uchun?", 'Для f = 6x⁵ − 4x³ ?', 'For f = 6x⁵ − 4x³ ?'),
      items: [
        { id: 'a', label: 'x⁶ − x⁴ + C', correct: true },
        { id: 'b', label: '6x⁶ − 4x⁴ + C', hint: L("Har qo'shiluvchi o'z yangi ko'rsatkichiga bo'linadi: oltiga va to'rtga.", 'Каждое слагаемое делится на свой новый показатель: на шесть и на четыре.', 'Each term is divided by its own new exponent: by six and by four.') },
        { id: 'c', label: 'x⁶ + x⁴ + C', hint: L("Ayirish saqlanadi: ikkinchi qo'shiluvchi manfiy edi.", 'Вычитание сохраняется: второе слагаемое было отрицательным.', 'The subtraction is kept: the second term was negative.') },
        { id: 'd', label: '30x⁴ − 12x² + C', hint: L("Bu hosila.", 'Это производная.', 'That is the derivative.') },
      ],
    },
    {
      id: 'b6', tag: 'check_by_diff', ask: true, cols: 2,
      done: "((2x+5)⁴/8)' = (2x+5)³",
      prompt: L("((2x+5)⁴/8)' nechaga teng?", "Чему равна ((2x+5)⁴/8)’ ?", "What is ((2x+5)⁴/8)’ ?"),
      items: [
        { id: 'a', label: '(2x+5)³', correct: true },
        { id: 'b', label: '(2x+5)³/2', hint: L("To'rt karra ikki bu sakkiz, va sakkiz sakkizga bo'linadi.", 'Четыре на два это восемь, и восемь делится на восемь.', 'Four times two is eight, and eight divides by eight.') },
        { id: 'c', label: '4(2x+5)³', hint: L("Sakkizga bo'linganini unutmang.", 'Не забудь про деление на восемь.', 'Do not forget the division by eight.') },
        { id: 'd', label: '(2x+5)⁴', hint: L("Ko'rsatkich bir kamayadi.", 'Показатель уменьшается на один.', 'The exponent drops by one.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Endi qavs bilan.", 'Теперь со скобкой.', 'Now with a bracket.'),
    A('q3', "Ikki qo'shiluvchi. Diqqat javobning oxiriga.", 'Два слагаемых. Внимание на конец ответа.', 'Two terms. Watch the end of the answer.'),
    A('q4', 'Bu savol sababi haqida.', 'Этот вопрос про причину.', 'This question is about the reason.'),
    A('q5', "Ayirish bilan.", 'С вычитанием.', 'With subtraction.'),
    A('q6', 'Oxirgi. Endi teskari tomonga.', 'Последний. Теперь в обратную сторону.', 'The last one. Now the other way.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: qavs ko'paytuvchisi yo'qolgan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'inner_k',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L("Tekshiruv o'zi xatoni ko'rsatadi", 'Проверка сама показывает ошибку', 'The check itself shows the error'),
  rows: [
    { id: 'r1', text: 'f(x) = (3x+2)⁴' },
    { id: 'r2', text: 'F(x) = (3x+2)⁵/5' },
    { id: 'r3', text: "tekshiruv:  ((3x+2)⁵/5)' = 3(3x+2)⁴" },
    { id: 'r4', text: L('javob: F = (3x+2)⁵/5', 'ответ: F = (3x+2)⁵/5', 'answer: F = (3x+2)⁵/5') },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu berilgan funksiya, unda xato bo'lishi mumkin emas.", 'Это данная функция, ошибки в ней быть не может.', 'This is the given function, there can be no error in it.'),
    r3: L("Bu satr o'zi to'g'ri: hosila haqiqatan uch karra qavs to'rtinchi darajada. Aynan shu satr oldingisining xato ekanini ko'rsatadi.", 'Эта строка верна сама по себе: производная действительно три скобки в четвёртой. Именно она и показывает, что предыдущая неверна.', 'This line is correct in itself: the derivative really is three brackets to the fourth. And it is exactly this line that shows the previous one is wrong.'),
    r4: L("Javob haqiqatan xato, lekin u oldin xato bo'lgan.", 'Ответ действительно неверный, но неверным он стал раньше.', 'The answer is indeed wrong, but it became wrong earlier.'),
  },
  proofPoint: "3(3x+2)⁴  ≠  (3x+2)⁴",
  proof: L(
    "Tekshiruv uch karra qavs berdi, kerak esa bitta. Demak oldindan yana uchga bo'lish kerak edi: F = (3x+2)⁵/15 + C",
    'Проверка дала три скобки, а нужна одна. Значит надо было заранее поделить ещё на три: F = (3x+2)⁵/15 + C',
    'The check gave three brackets, but one is needed. So it had to be divided by three more in advance: F = (3x+2)⁵/15 + C',
  ),
  probe: {
    question: L('Qaysi qoida buzilgan?', 'Какое правило нарушено?', 'Which rule was broken?'),
    items: [
      { id: 'a', label: L("qavs ko'paytuvchisiga bo'lish unutilgan", 'забыли поделить на множитель скобки', 'the division by the bracket factor was forgotten'), correct: true },
      { id: 'b', label: L("+ C yozilmagan", 'не написано + C', '+ C was not written'), hint: L("Bu ham xato, lekin BIRINCHI xato maxrajda: hosila mos kelmadi.", 'Это тоже ошибка, но ПЕРВАЯ ошибка в знаменателе: производная не сошлась.', 'That is an error too, but the FIRST error is in the denominator: the derivative did not match.') },
      { id: 'c', label: L("ko'rsatkich noto'g'ri ko'tarilgan", 'показатель поднят неверно', 'the exponent was raised incorrectly'), hint: L("Ko'rsatkich to'g'ri: to'rt plyus bir bu besh.", 'Показатель верен: четыре плюс один это пять.', 'The exponent is right: four plus one is five.') },
      { id: 'd', label: L('tekshiruv noto\'g\'ri', 'проверка выполнена неверно', 'the check was done incorrectly'), hint: L("Tekshiruv to'g'ri bajarilgan, va aynan u xatoni fosh qildi.", 'Проверка выполнена верно, и именно она разоблачила ошибку.', 'The check was done correctly, and it is what exposed the error.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda hatto tekshiruv ham bajarilgan. Va shunga qaramay javob xato. Xato birinchi marta paydo bo'lgan satrni toping.", 'Здесь даже проверка выполнена. И всё же ответ неверный. Найди строку, в которой ошибка появилась впервые.', 'Here even the check was carried out. And still the answer is wrong. Find the line where the error first appeared.'),
    A('proof', "Qarang: tekshiruv uch karra qavs berdi, kerak esa bitta qavs. Tekshiruv ishladi, lekin uning natijasiga e'tibor berilmadi.", 'Смотри: проверка дала три скобки, а нужна одна. Проверка сработала, но на её результат не посмотрели.', 'Look: the check gave three brackets, but one is needed. The check worked, but nobody looked at its result.'),
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
      prompt: L('f = (2x+7)³ uchun', 'Для f = (2x+7)³', 'For f = (2x+7)³'),
      template: ['F = ', { slot: 0 }, ' / ', { slot: 1 }, ' + C'],
      parts: ['(2x+7)⁴', '(2x+7)³', '8', '4'],
      answer: ['(2x+7)⁴', '8'],
      doneLabel: '(2x+7)³  →  (2x+7)⁴/8',
      wrongs: [
        { key: '(2x+7)⁴|4', hint: L("Faqat yangi ko'rsatkichga bo'lindi: qavs yana ikkilikni beradi.", 'Поделено только на новый показатель: скобка даёт ещё двойку.', 'Divided by the new exponent only: the bracket gives one more two.') },
        { key: '*', hint: L("Suratda ko'rsatkich bittaga katta, maxrajda esa to'rt karra ikki.", 'В числителе показатель на один больше, в знаменателе четыре на два.', 'The numerator has one more in the exponent, the denominator is four times two.') },
      ],
    },
    {
      prompt: L('Endi f = (5x−1)² uchun', 'А теперь для f = (5x−1)²', 'And now for f = (5x−1)²'),
      template: ['F = ', { slot: 0 }, ' / ', { slot: 1 }, ' + C'],
      parts: ['(5x−1)³', '(5x−1)²', '15', '3'],
      answer: ['(5x−1)³', '15'],
      doneLabel: '(5x−1)²  →  (5x−1)³/15',
      wrongs: [
        { key: '(5x−1)³|3', hint: L("Ko'rsatkich hisobga olindi, qavsdagi beshlik esa yo'q.", 'Показатель учтён, а пятёрка из скобки нет.', 'The exponent is accounted for, the five from the bracket is not.') },
        { key: '*', hint: L("Ko'rsatkichdan uch, qavsdan besh: ularni ko'paytiring.", 'Три из показателя, пять из скобки: перемножь их.', 'Three from the exponent, five from the bracket: multiply them.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi: qavs ichida beshlik turibdi.", 'А теперь второе: внутри скобки стоит пятёрка.', 'And now the second one: there is a five inside the bracket.'),
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
  law: "F' = f",
  // Raqam YOZILMAYDI: yakun tanasi satrlarni o'zi 01, 02, 03 deb belgilaydi,
  // va matndagi «1.» bilan birga raqam ikki marta chiqib qolardi.
  ruleLines: [
    L("ko'paytuvchi o'zgarmasdan o'tadi, qo'shiluvchilar alohida", 'множитель проходит без изменений, слагаемые отдельно', 'a factor passes unchanged, terms go separately'),
    L("qavs bo'lsa, iks oldidagi ko'paytuvchiga ham bo'l", 'если есть скобка, поделись ещё и на множитель при иксе', 'if there is a bracket, divide also by the factor at x'),
    L('+ C yoz va differensiallab tekshir', 'напиши + C и проверь дифференцированием', 'write + C and check by differentiating'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L("2x + 1 uchun ikki yechim", 'два решения для 2x + 1', 'two solutions for 2x + 1'),
      right: L('ikkisi ham', 'оба', 'both'),
      map: {
        a: L('birinchi', 'первое', 'the first'),
        b: L('ikkinchi', 'второе', 'the second'),
        both: L('ikkisi ham', 'оба', 'both'),
        none: '—',
      },
    },
    {
      screen: 5,
      expr: 'f = (2x+1)⁷',
      right: '(2x+1)⁸/16',
      map: { a: '(2x+1)⁸/16', b: '(2x+1)⁸/8', c: '(2x+1)⁸/2', d: '(2x+1)⁸' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '(2x+1)²/4  =  x² + x + 1/4',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Qavs qoidasiga va urinmalar ekraniga qayting', 'Вернись к правилу скобки и к экрану с касательными', 'Go back to the bracket rule and to the tangents screen'),
  },
  probe: {
    question: L("Qavs ichida 4x − 5 tursa, nima o'zgaradi?", 'Что меняется, если внутри скобки 4x − 5 ?', 'What changes if the bracket holds 4x − 5 ?'),
    items: [
      { id: 'a', label: L("to'rtga ham bo'linadi", 'делим ещё и на четыре', 'we divide by four as well'), correct: true },
      { id: 'b', label: L("beshga ham bo'linadi", 'делим ещё и на пять', 'we divide by five as well'), hint: L("Qavs ichidagi son hosilada yo'qoladi. Iks oldidagi ko'paytuvchi muhim.", 'Число внутри скобки исчезает в производной. Важен множитель при иксе.', 'The number inside the bracket vanishes in the derivative. The factor at x is what matters.') },
      { id: 'c', label: L('hech narsa', 'ничего', 'nothing'), hint: L("Differensiallang: to'rtlik tashqariga chiqadi va javob mos kelmaydi.", 'Продифференцируй: четвёрка выйдет наружу и ответ не сойдётся.', 'Differentiate: the four comes out and the answer will not match.') },
      { id: 'd', label: L("ko'rsatkich o'zgaradi", 'меняется показатель', 'the exponent changes'), hint: L("Ko'rsatkich qavs ichidagiga bog'liq emas.", 'Показатель не зависит от того, что внутри скобки.', 'The exponent does not depend on what is inside the bracket.') },
    ],
  },
  sheetTitle: L('Qoidalar · shpargalka', 'Правила · шпаргалка', 'The rules · cheat sheet'),
  sheetSrc: L('11-sinf · 2-dars', '11 класс · урок 2', 'Grade 11 · lesson 2'),
  lifehack: L(
    "Qavs ko'rsangiz, ikkita songa qarang: yangi ko'rsatkich va iks oldidagi ko'paytuvchi. Maxraj ularning ko'paytmasi.",
    'Видишь скобку, смотри на два числа: новый показатель и множитель при иксе. Знаменатель это их произведение.',
    'When you see a bracket, look at two numbers: the new exponent and the factor at x. The denominator is their product.',
  ),
  holds: [2500, 8000, 5500, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Birinchi savolda ikkala yechim ham to'g'ri edi: ular bir to'rtdanga farq qiladi, bu esa o'zgarmas.", 'Вот твои прогнозы и вот как оказалось. В первом вопросе верны были оба решения: они отличаются на одну четвёртую, а это постоянная.', 'Here are your guesses and here is how it turned out. In the first question both solutions were correct: they differ by one quarter, and that is a constant.'),
    A('rule', "Va mana asosiy fikr. Ortiqcha ko'paytuvchi oldindan so'ndiriladi. U ko'rsatkichdan kelsa ham, qavs ichidan kelsa ham, farqi yo'q.", 'И вот главная мысль. Лишний множитель гасят заранее. Пришёл он из показателя или из скобки, разницы нет.', 'And here is the main point. An extra factor is cancelled in advance. Whether it came from the exponent or from the bracket makes no difference.'),
    A('q', "Oxirgi savol: qavs ichidagi sonlar o'zgarsa, nima bo'ladi?", 'Последний вопрос: что будет, если числа внутри скобки изменятся?', 'The last question: what happens if the numbers inside the bracket change?'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
