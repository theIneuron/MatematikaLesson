// ============================================================================
// 11-sinf, Dars 56. TAKRORLASH VA KURS YAKUNI: SINOV DTM.
//
// B7 blokining oxirgi darsi va BUTUN KURSNING oxirgi darsi.
//   kontrakt: src/books/grade11/ETALON_11SINF.md, 1.2-band (DTM anatomiyasi)
//   asbob:    `SpaceFrame` (fazoviy karkas), `AnswerValue`, `Probe`
//   manba:    kursning hamma bloklari. Har masala yil bo'yi to'plangan
//             ENG KO'P uchraydigan xato ustiga qurilgan -- diagnostik
//             teglar ro'yxati bo'yicha (etalon 5-band).
//
// DARSNING BITTA GAPI: yil bo'yi bir xil xato takrorlanadi -- qoida
// KO'RINISHIGA ishonish. Har qoida SON bilan tekshiriladi.
//
// SONLAR TEKSHIRILDI (qaysi darsdan olingani bilan):
//   (x²)' = 2x,  x = −3 da −6;  qiymati esa 9   [44, 43-darslar]
//   ildiz(x²) = |x|:  x = −5 da 5               [46-dars]
//   (x³)' = 3x²:  x = 2 da 12                   [44-dars]
//   konus silindrning uchdan biri               [52-dars]
//   ichki burchak markaziyning yarmi: 80 -> 40  [51-dars]
//   integral 1 dan 3 gacha 2x dx = 8;  3 dan 1 gacha −8   [48-dars]
//   (0;0;0) dan (2;3;6) gacha masofa 7          [49, 53-darslar]
//   log₂ x = 3 -> x = 8 -> kub hajmi 512        [B2 + B4]
//   100 -> +20% -> −20% -> 96                   [49-dars]
//   ildiz(x + 6) = x -> faqat x = 3             [47-dars]
//   2²ˣ − 5·2ˣ + 4 = 0 -> x = 0; 2              [47-dars]
//   2, 3, 4, 5, 100: o'rtacha 22,8, mediana 4   [49-dars]
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_56',
  title: L('Takrorlash va kurs yakuni', 'Повторение и итог курса', 'Revision and the course summary'),
}

const BLOCK = { label: 'B7', from: 51, to: 56, current: 56 }

// DTM REJIMI. Etalon 1.2-bandi.
const MODE = 'dtm'

// ============================================================
// SLAYD 1. XUK. Hosila va qiymat.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Kurs yakuni', 'Итог курса', 'The course summary'),
  title: L('Hosila yoki qiymat', 'Производная или значение', 'The derivative or the value'),
  expr: L('kvadrat funksiya, nuqta −3', 'функция квадрат, точка −3', 'the squaring function at −3'),
  rows: [
    {
      id: 'a',
      name: L('Karim', 'Карим', 'Karim'),
      value: '9',
    },
    {
      id: 'b',
      name: L('Nargiza', 'Наргиза', 'Nargiza'),
      value: '−6',
    },
  ],
  probe: {
    question: L(
      'Hosila qanchaga teng?',
      'Чему равна производная?',
      'What does the derivative equal?',
    ),
    afterPredict: L(
      'Javobingiz yozib olindi. Oxirgi sinov boshlanadi.',
      'Твой ответ записан. Начинается последняя проверка.',
      'Your answer is saved. The last check begins.',
    ),
    items: [
      { id: 'a', label: '−6' },
      { id: 'b', label: '9' },
      { id: 'c', label: '6' },
      { id: 'd', label: '−9' },
    ],
  },
  holds: [4200, 3600, 3600],
  audio: [
    A('mount', "Kursning oxirgi darsi. Har masala yil bo'yi eng ko'p uchragan xato ustiga qurilgan.", 'Последний урок курса. Каждая задача построена на самой частой ошибке года.', 'The last lesson of the course. Each problem is built on the most frequent error of the year.'),
    A('r1', "Karim to'qqiz deb javob berdi: minus uchning kvadrati.", 'Карим ответил девять: минус три в квадрате.', 'Karim answered nine: minus three squared.'),
    A('r2', "Nargiza esa minus olti deb aytdi.", 'А Наргиза сказала минус шесть.', 'Nargiza said minus six.'),
    A('ask', "Sizningcha hosila qancha. Taxmin qiling.", 'Как думаешь, чему равна производная. Предположи.', 'What do you think the derivative is. Make a guess.'),
  ],
}

// ============================================================
// SLAYD 2. MASALA 1. Yilning to'rt qoidasi son bilan tekshiriladi.
// ============================================================
const S2 = {
  role: 'points',
  section: 'practice',
  led: 'student',
  tag: 'check_by_point',
  eyebrow: L('Masala 1', 'Задача 1', 'Problem 1'),
  title: L('Qoidani son bilan tekshiring', 'Проверь правило числом', 'Check the rule with a number'),
  expr: L('yilning to\'rt qoidasi', 'четыре правила года', 'four rules of the year'),
  goal: L('har qoidani sinash', 'испытать каждое правило', 'test each rule'),
  rule: L(
    "Har qoidaga bitta son qo'yamiz.",
    'В каждое правило подставляем одно число.',
    'We put one number into each rule.',
  ),
  pick: L('Qaysi qoidani tekshiramiz?', 'Какое правило проверим?', 'Which rule shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('ko\'rinishiga ishonish', 'верить виду', 'trust the look'), value: '?' },
    { id: 'b', key: 'inB', name: L('son bilan tekshirish', 'проверить числом', 'check with a number'), value: '✓' },
  ],
  points: [
    {
      id: 'q1', label: '√(x²) = |x|', num: 'x = −5 → 5', step: 'calc', verdict: 'in',
      calc: L('ildiz manfiy bermaydi', 'корень не даёт минус', 'a root gives no minus'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q2', label: '(x³) ′ = 3x²', num: 'x = 2 → 12', step: 'calc', verdict: 'in',
      calc: L('ko\'rsatkich oldiga chiqdi', 'показатель вышел вперёд', 'the exponent came forward'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q3', label: L('konus = silindr / 3', 'конус = цилиндр / 3', 'cone = cylinder / 3'), num: L('to\'kish uch marta', 'три переливания', 'three pours'), step: 'calc', verdict: 'in',
      calc: L('uchdan bir koeffitsiyenti', 'коэффициент треть', 'the one third coefficient'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q4', label: L('ichki = markaziy', 'вписанный = центральный', 'inscribed = central'), num: '80° → 40°', step: 'calc', verdict: 'out',
      calc: L('yarmi bo\'lishi kerak', 'должна быть половина', 'it must be a half'),
      sol: false, inA: true, inB: false,
    },
  ],
  probe: {
    question: L(
      'Qoidani qanday tekshirish kerak?',
      'Как проверять правило?',
      'How should a rule be checked?',
    ),
    items: [
      { id: 'b', label: L('bitta son qo\'yib', 'подставив одно число', 'by putting in one number'), correct: true },
      { id: 'a', label: L('ko\'rinishiga qarab', 'по виду', 'by the look'), hint: L("To'rtinchi qoida ko'rinishdan to'g'ri edi, lekin son uni yiqitdi.", 'Четвёртое правило по виду было верным, но число его опрокинуло.', 'The fourth rule looked right, and a number knocked it down.') },
      { id: 'c', label: L('darslikdan izlab', 'поискав в учебнике', 'by looking in the book'), hint: L("Imtihonda darslik yo'q, son esa har doim bor.", 'На экзамене учебника нет, а число есть всегда.', 'There is no textbook on the exam, and a number is always available.') },
      { id: 'd', label: L('tekshirmasa ham bo\'ladi', 'можно не проверять', 'no need to check'), hint: L("Bu yil bo'yi eng qimmat xato bo'ldi.", 'Это была самая дорогая ошибка года.', 'That was the most expensive error of the year.') },
    ],
  },
  holds: [3000, 2400, 2600, 8500],
  audio: [
    A('mount', "Birinchi masala. To'rtta qoida, va ularning uchtasi to'g'ri.", 'Первая задача. Четыре правила, и три из них верны.', 'The first problem. Four rules, and three of them are right.'),
    A('mount', "Qoidani o'zingiz tanlaysiz.", 'Правило выбираешь сам.', 'You choose the rule yourself.'),
    A('calc', 'Son qo\'yamiz.', 'Подставляем число.', 'We put in a number.'),
    A('mark', "Mana natija. Uchta qoida sinovdan o'tdi, to'rtinchisi esa yiqildi: ichki burchak markaziyning yarmiga teng, o'ziga emas. Diqqat: to'rtta qoidaning hammasi ko'rinishdan bir xil ishonchli edi. Farqni faqat son ko'rsatdi, va bu kursning eng foydali odati.", 'Вот результат. Три правила прошли проверку, а четвёртое упало: вписанный угол равен половине центрального, а не ему самому. Внимание: все четыре правила по виду были одинаково убедительны. Разницу показало только число, и это самая полезная привычка курса.', 'Here is the result. Three rules passed, the fourth fell: an inscribed angle equals half the central one, not the whole. Careful: all four rules looked equally convincing. Only a number told them apart, and that is the most useful habit of the course.'),
  ],
}

// ============================================================
// SLAYD 3. MASALA 2. Chegaralar tartibi.
// ============================================================
const S3 = {
  role: 'sign',
  section: 'practice',
  led: 'student',
  tag: 'bounds_order',
  eyebrow: L('Masala 2', 'Задача 2', 'Problem 2'),
  title: L('Ishorani qo\'ying', 'Поставь знак', 'Place the sign'),
  left: L(
    'Chegaralar teskari tartibda',
    'Границы в обратном порядке',
    'The bounds are reversed',
  ),
  template: [L('3 dan 1 gacha  ', 'от 3 до 1  ', 'from 3 to 1  '), { slot: 0 }, L('  1 dan 3 gacha', '  от 1 до 3', '  from 1 to 3')],
  signs: ['<', '>'],
  answer: '<',
  checkNote: L(
    'bittasi sakkiz, ikkinchisi minus sakkiz',
    'один восемь, другой минус восемь',
    'one is eight, the other minus eight',
  ),
  wrongs: [
    { key: '>', hint: L("Teskari tartib MANFIY javob beradi, manfiy son esa musbatdan kichik.", 'Обратный порядок даёт ОТРИЦАТЕЛЬНЫЙ ответ, а отрицательное меньше положительного.', 'The reversed order gives a NEGATIVE answer, and a negative is less than a positive.') },
  ],
  probe: {
    question: L(
      'Chegaralarni almashtirsak?',
      'Если поменять границы?',
      'If the bounds swap?',
    ),
    items: [
      { id: 'a', label: L('ishora almashadi', 'знак меняется', 'the sign flips'), correct: true },
      { id: 'b', label: L('javob o\'zgarmaydi', 'ответ не меняется', 'the answer stays'), hint: L("Sakkiz va minus sakkiz boshqa sonlar.", 'Восемь и минус восемь это разные числа.', 'Eight and minus eight are different numbers.') },
      { id: 'c', label: L('javob nolga aylanadi', 'ответ станет нулём', 'the answer becomes zero'), hint: L("Nol faqat yuzalar qisqarganda chiqadi.", 'Ноль выходит только когда площади сокращаются.', 'Zero appears only when areas cancel.') },
      { id: 'd', label: L('integral yo\'qoladi', 'интеграл исчезает', 'the integral vanishes'), hint: L("Integral qoladi, faqat ishorasi almashadi.", 'Интеграл остаётся, меняется только знак.', 'The integral remains, only the sign flips.') },
    ],
  },
  audio: [
    A('mount', "Ikkinchi masala integral blokidan.", 'Вторая задача из блока интеграла.', 'The second problem comes from the integral block.'),
    A('write', "Ishorani qo'ying.", 'Поставь знак.', 'Place the sign.'),
  ],
}

// ============================================================
// SLAYD 4. MASALA 3. Chizma: fazoda masofa.
// ============================================================
const S4 = {
  role: 'graph',
  section: 'practice',
  tag: 'dist_flat',
  drag: false,
  graphSteps: 2,
  eyebrow: L('Masala 3', 'Задача 3', 'Problem 3'),
  title: L('Boshdan nuqtagacha', 'От начала до точки', 'From the origin to the point'),
  chip: 'A (2; 3; 6)',
  space: {
    mode: 'dist',
    box: [7, 7, 7],
    frame: true,
    axisNums: true,
    points: [
      { at: [0, 0, 0], label: 'O' },
      { at: [2, 3, 6], label: 'A', coords: true, proj: true },
    ],
    value: 'dist',
    height: 186,
  },
  probe: {
    question: L(
      'Masofa qanchaga teng?',
      'Чему равно расстояние?',
      'What is the distance?',
    ),
    items: [
      { id: 'a', label: '7', correct: true },
      { id: 'b', label: '11', hint: L("O'n bir bu koordinatalar yig'indisi, masofa esa kvadratlardan chiqadi.", 'Одиннадцать это сумма координат, а расстояние выходит из квадратов.', 'Eleven is the sum of coordinates, a distance comes from the squares.') },
      { id: 'c', label: '49', hint: L("Qirq to'qqiz kvadratlar yig'indisi: ildiz olinmagan.", 'Сорок девять это сумма квадратов: корень не взят.', 'Forty nine is the sum of squares: the root is missing.') },
      { id: 'd', label: '6', hint: L("Olti bu eng katta koordinata.", 'Шесть это наибольшая координата.', 'Six is the largest coordinate.') },
    ],
  },
  holds: [4500, 4500],
  audio: [
    A('mount', "Uchinchi masala chizmada, fazo blokidan. Nuqtaning uchta soyasi ko'rinadi.", 'Третья задача на чертеже, из блока пространства. Видны три тени точки.', 'The third problem is on a drawing, from the space block. The three shadows of the point are visible.'),
    A('mount', "Masofa kvadratlar yig'indisidan olingan ildizga teng: to'rt plyus to'qqiz plyus o'ttiz olti qirq to'qqiz, ildizi yetti. Bu sonlar aynan shunday tanlangan: javob butun chiqadi.", 'Расстояние равно корню из суммы квадратов: четыре плюс девять плюс тридцать шесть сорок девять, корень семь. Числа подобраны именно так: ответ выходит целым.', 'The distance is the root of the sum of squares: four plus nine plus thirty six is forty nine, whose root is seven. The numbers are chosen so the answer comes out whole.'),
  ],
}

// Zanjir amallari: ikki blokning amallari bir ro'yxatda.
const ACTIONS_56 = [
  { id: 'log', label: L('logarifmni yechish', 'решить логарифм', 'solve the logarithm') },
  { id: 'subst', label: L('almashtirish kiritish', 'ввести замену', 'introduce a substitution') },
  { id: 'back', label: L('iksga qaytish', 'вернуться к иксу', 'go back to x') },
  { id: 'vol', label: L('hajmni hisoblash', 'посчитать объём', 'compute the volume') },
  { id: 'check', label: L('javobni tekshirish', 'проверить ответ', 'check the answer') },
]

// ============================================================
// SLAYD 4b -> SLAYD 5. MASALA 4. Zanjir: logarifmdan hajmga.
// ============================================================
const S5 = {
  role: 'chain',
  section: 'practice',
  led: 'student',
  tag: 'same_base',
  noLine: true,
  eyebrow: L('Masala 4', 'Задача 4', 'Problem 4'),
  title: L('Logarifmdan hajmga', 'От логарифма к объёму', 'From a logarithm to a volume'),
  start: L('log₂ x = 3, qirra x bo\'lgan kub', 'log₂ x = 3, куб с ребром x', 'log₂ x = 3, a cube with edge x'),
  actions: ACTIONS_56,
  steps: [
    {
      action: 'log',
      to: 'x = 8',
      wrongs: [
        { action: 'vol', hint: L("Hajm uchun qirra kerak, u hali topilmagan.", 'Для объёма нужно ребро, а оно ещё не найдено.', 'The volume needs the edge, not found yet.') },
        { action: 'subst', hint: L("Almashtirish bu yerda kerak emas: logarifm oddiy.", 'Замена здесь не нужна: логарифм простой.', 'No substitution here: the logarithm is simple.') },
        { action: 'back', hint: L("Qaytish uchun almashtirish kiritilishi kerak edi.", 'Чтобы возвращаться, нужна была замена.', 'To go back a substitution was needed.') },
      ],
    },
    {
      action: 'vol',
      to: '512',
      wrongs: [
        { action: 'log', hint: L("Logarifm yechildi: iks sakkizga teng.", 'Логарифм решён: икс равен восьми.', 'The logarithm is solved: x is eight.') },
        { action: 'check', hint: L("Tekshiruv oxirida bo'ladi.", 'Проверка будет в конце.', 'The check comes last.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['512', '64', '24', '384'],
    value: ['512'],
    label: 'V =',
    prompt: L('Hajmni yozing', 'Запиши объём', 'Write the volume'),
    wrongs: [
      { key: '64', hint: L("Oltmish to'rt bu bitta yoq yuzasi, ya'ni sakkiz kvadrat.", 'Шестьдесят четыре это площадь одной грани, то есть восемь в квадрате.', 'Sixty four is the area of one face, eight squared.') },
      { key: '24', hint: L("Yigirma to'rt bu uch karra sakkiz: hajm emas.", 'Двадцать четыре это три на восемь: это не объём.', 'Twenty four is three times eight: not a volume.') },
      { key: '384', hint: L("Uch yuz sakson to'rt bu to'liq SIRT: olti karra oltmish to'rt.", 'Триста восемьдесят четыре это полная ПОВЕРХНОСТЬ: шесть на шестьдесят четыре.', 'Three hundred eighty four is the total SURFACE: six times sixty four.') },
      { key: '*', hint: L("Iks sakkizga teng, hajm esa sakkizning kubi.", 'Икс равен восьми, а объём это восемь в кубе.', 'x is eight, and the volume is eight cubed.') },
    ],
  },
  audio: [
    A('mount', "To'rtinchi masala ikki blokni bog'laydi: logarifm qirrani beradi, qirra esa hajmni.", 'Четвёртая задача связывает два блока: логарифм даёт ребро, а ребро объём.', 'The fourth problem joins two blocks: the logarithm gives the edge, and the edge gives the volume.'),
    A('step3', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 6. MASALA 5. Foizlar qo'shilmaydi.
// ============================================================
const S6 = {
  role: 'twoway',
  section: 'practice',
  tag: 'word_model',
  eyebrow: L('Masala 5', 'Задача 5', 'Problem 5'),
  title: L('Narx qaytdimi', 'Вернулась ли цена', 'Did the price come back'),
  expr: L('100, +20%, keyin −20%', '100, +20%, потом −20%', '100, +20%, then −20%'),
  need: L('foizlar qo\'shiladimi', 'складываются ли проценты', 'do percents add'),
  answerLabel: L('to\'g\'ri javob', 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      txt: L('foizlarni qo\'shdi', 'сложил проценты', 'added the percents'),
      point: {
        label: L('uning javobi', 'его ответ', 'his answer'),
        calc: '100',
        verdict: 'out',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L('ko\'paytuvchilarni oldi', 'взяла множители', 'took the factors'),
      point: {
        label: L('uning javobi', 'её ответ', 'her answer'),
        calc: '96',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['96', '100', '104', '80'],
    value: ['96'],
    label: L('narx =', 'цена =', 'price ='),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '100', hint: L("Ikkinchi tushish YANGI narxdan olinadi, va u kattaroq edi.", 'Второе падение считается от НОВОЙ цены, а она была больше.', 'The second fall is taken from the NEW price, which was larger.') },
      { key: '104', hint: L("Narx oshmaydi: tushish o'sishdan katta bazadan olindi.", 'Цена не растёт: падение шло от большей базы, чем рост.', 'The price does not rise: the fall came from a larger base than the rise.') },
      { key: '80', hint: L("Sakson faqat tushishni hisobga oladi, o'sishni esa yo'q.", 'Восемьдесят учитывает только падение, а рост нет.', 'Eighty counts only the fall, not the rise.') },
      { key: '*', hint: L("Bir butun ikki karra nol butun sakkiz nol butun to'qsan olti beradi.", 'Один и две десятых на ноль целых восемь даёт ноль целых девяносто шесть.', 'One point two times zero point eight gives zero point nine six.') },
    ],
  },
  holds: [3200, 3600, 5200],
  audio: [
    A('mount', "Beshinchi masala matnli masalalar blokidan.", 'Пятая задача из блока текстовых задач.', 'The fifth problem comes from the word-problem block.'),
    A('p1', "Aziz foizlarni qo'shdi: yigirma o'sdi, yigirma tushdi, demak nol.", 'Азиз сложил проценты: двадцать выросло, двадцать упало, значит ноль.', 'Aziz added the percents: up twenty, down twenty, so zero.'),
    A('p2', "Dilnoza esa ko'paytuvchilarni oldi. Bir butun ikki, keyin nol butun sakkiz, natijada nol butun to'qsan olti. Foizlar qo'shilmaydi, chunki ikkinchi o'zgarish boshqa bazadan hisoblanadi.", 'А Дилноза взяла множители. Один и две десятых, потом ноль целых восемь, в итоге ноль целых девяносто шесть. Проценты не складываются, потому что второе изменение считается от другой базы.', 'Dilnoza took the factors. One point two, then zero point eight, giving zero point nine six. Percents do not add, because the second change is taken from a different base.'),
    A('write', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 7. MASALA 6. Begona ildiz.
// ============================================================
const S7 = {
  role: 'points',
  section: 'practice',
  led: 'student',
  tag: 'equal_roots',
  eyebrow: L('Masala 6', 'Задача 6', 'Problem 6'),
  title: L('Qaysi nomzod ildiz', 'Какой кандидат корень', 'Which candidate is a root'),
  expr: '√(x + 6) = x',
  goal: L('asl tenglamaga qo\'yish', 'подставить в исходное', 'substitute into the original'),
  rule: L(
    "Har nomzodni ASL tenglamaga qo'yamiz.",
    'Каждого кандидата подставляем в ИСХОДНОЕ уравнение.',
    'We substitute each candidate into the ORIGINAL equation.',
  ),
  pick: L('Qaysi nomzodni tekshiramiz?', 'Какого кандидата проверим?', 'Which candidate shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('kvadrat tenglamaning ildizlari', 'корни квадратного', 'the roots of the quadratic'), value: '2' },
    { id: 'b', key: 'inB', name: L('tekshiruvdan o\'tganlari', 'прошедшие проверку', 'those that survive'), value: '1' },
  ],
  points: [
    {
      id: 'q1', label: 'x = 3', num: '3 = 3', step: 'calc', verdict: 'in',
      calc: L('tenglik saqlandi', 'равенство сохранилось', 'the equality holds'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q2', label: 'x = −2', num: '2 ≠ −2', step: 'calc', verdict: 'out',
      calc: L('ildiz manfiy bermaydi', 'корень не даёт минус', 'a root gives no minus'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q3', label: 'x = 0', num: '2,45 ≠ 0', step: 'calc', verdict: 'out',
      calc: L('chap tomon katta', 'слева больше', 'the left side is larger'),
      sol: false, inA: false, inB: false,
    },
    {
      id: 'q4', label: 'x = 10', num: '4 ≠ 10', step: 'calc', verdict: 'out',
      calc: L('o\'ng tomon katta', 'справа больше', 'the right side is larger'),
      sol: false, inA: false, inB: false,
    },
  ],
  probe: {
    question: L(
      'Tekshiruv qachon majburiy?',
      'Когда проверка обязательна?',
      'When is a check mandatory?',
    ),
    items: [
      { id: 'a', label: L('kvadratga ko\'targandan keyin', 'после возведения в квадрат', 'after squaring'), correct: true },
      { id: 'b', label: L('har doim', 'всегда', 'always'), hint: L("Yomon odat emas, lekin savol qachon TASHLAB KETISH mumkin emasligi haqida.", 'Не плохая привычка, но вопрос о том, когда её нельзя ПРОПУСТИТЬ.', 'Not a bad habit, but the question is when it cannot be SKIPPED.') },
      { id: 'c', label: L('hech qachon', 'никогда', 'never'), hint: L("Bu darsda tekshiruv begona ildizni ushladi.", 'На этом уроке проверка поймала посторонний корень.', 'In this lesson the check caught an extraneous root.') },
      { id: 'd', label: L('faqat logarifmda', 'только в логарифме', 'only in a logarithm'), hint: L("Bu yerda logarifm yo'q, tekshiruv esa kerak bo'ldi.", 'Здесь логарифма нет, а проверка понадобилась.', 'There is no logarithm here, and a check was needed.') },
    ],
  },
  holds: [3000, 2400, 2600, 8000],
  audio: [
    A('mount', "Oltinchi masala tenglamalar blokidan.", 'Шестая задача из блока уравнений.', 'The sixth problem comes from the equations block.'),
    A('mount', "Nomzodni o'zingiz tanlaysiz.", 'Кандидата выбираешь сам.', 'You choose the candidate yourself.'),
    A('calc', 'Qo\'yamiz.', 'Подставляем.', 'We substitute.'),
    A('mark', "Mana natija. Faqat uch qoldi. Minus ikki kvadrat tenglamaning ildizi edi, lekin asl tenglamada chap tomon musbat, o'ng tomon esa manfiy. Kvadratga ko'tarish shu farqni yo'q qiladi, shuning uchun bunday o'tishdan keyin tekshiruv yechimning bir qismi bo'ladi.", 'Вот результат. Остался только три. Минус два был корнем квадратного уравнения, но в исходном слева положительно, а справа отрицательно. Возведение в квадрат стирает эту разницу, поэтому после такого перехода проверка становится частью решения.', 'Here is the result. Only three survived. Minus two was a root of the quadratic, but in the original the left side is positive and the right negative. Squaring erases that difference, so after such a step the check becomes part of the solution.'),
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
  actions: ACTIONS_56,
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
        { action: 'log', hint: L("Logarifm bu yerda yechilmaydi: tenglama ko'rsatkichli.", 'Логарифм здесь не решается: уравнение показательное.', 'No logarithm here: the equation is exponential.') },
        { action: 'back', hint: L("Qaytish uchun avval almashtirish kerak.", 'Чтобы вернуться, сначала нужна замена.', 'To go back, the substitution comes first.') },
        { action: 'vol', hint: L("Hajm bu masalada yo'q.", 'Объёма в этой задаче нет.', 'There is no volume here.') },
      ],
    },
    {
      action: 'back',
      to: 'x = 0;  x = 2',
      wrongs: [
        { action: 'subst', hint: L("Almashtirish kiritildi va kvadrat tenglama yechildi: bir va to'rt.", 'Замена введена и квадратное решено: один и четыре.', 'The substitution is in and the quadratic solved: one and four.') },
        { action: 'check', hint: L("Tekshiruv keyin: avval iksga qaytish kerak.", 'Проверка потом: сначала надо вернуться к иксу.', 'The check comes after: first go back to x.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['0;  2', '1;  4', '2', '0'],
    value: ['0;  2'],
    label: 'x =',
    prompt: L('Hamma ildizlarni yozing', 'Запиши все корни', 'Write all the roots'),
    wrongs: [
      { key: '1;  4', hint: L("Bu t ning qiymatlari, iks emas.", 'Это значения t, а не икса.', 'Those are the values of t, not of x.') },
      { key: '2', hint: L("Bitta ildiz tushib qolgan: t birga teng bo'lganda iks nol.", 'Потерян один корень: когда t равно единице, икс ноль.', 'One root is lost: when t is one, x is zero.') },
      { key: '0', hint: L("Bitta ildiz tushib qolgan: t to'rtga teng bo'lganda iks ikki.", 'Потерян один корень: когда t равно четырём, икс два.', 'One root is lost: when t is four, x is two.') },
      { key: '*', hint: L("Ikki daraja iks birga teng bo'lsa iks nol, to'rtga teng bo'lsa iks ikki.", 'Если два в степени икс равно одному, икс ноль; если четырём, икс два.', 'If two to the x is one, x is zero; if four, x is two.') },
    ],
  },
  audio: [
    A('mount', "Yettinchi masala mustaqil. Yil bo'yi eng ko'p ishlatilgan usul: almashtirish.", 'Седьмая задача самостоятельная. Самый частый приём года: замена.', 'The seventh problem is on your own. The most used technique of the year: substitution.'),
    A('step3', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 9. MASALA 8. Perpendikulyarlik.
// ============================================================
const S9 = {
  role: 'sign',
  section: 'practice',
  led: 'student',
  tag: 'perp_zero',
  eyebrow: L('Masala 8', 'Задача 8', 'Problem 8'),
  title: L('Ishorani qo\'ying', 'Поставь знак', 'Place the sign'),
  left: L(
    'Vektorlar PERPENDIKULYAR',
    'Векторы ПЕРПЕНДИКУЛЯРНЫ',
    'The vectors are PERPENDICULAR',
  ),
  template: [L('skalyar ko\'paytma  ', 'скалярное произведение  ', 'the dot product  '), { slot: 0 }, '  0'],
  signs: ['=', '<'],
  answer: '=',
  checkNote: L(
    'to\'qsan darajaning kosinusi nol',
    'косинус девяноста равен нулю',
    'the cosine of ninety is zero',
  ),
  wrongs: [
    { key: '<', hint: L("Manfiy ko'paytma o'tmas burchakni beradi, perpendikulyarlikda esa aynan nol.", 'Отрицательное произведение даёт тупой угол, а при перпендикулярности ровно ноль.', 'A negative product means an obtuse angle, perpendicularity gives exactly zero.') },
  ],
  probe: {
    question: L(
      'Bu shart nechta blokda ishlatildi?',
      'В скольких блоках использовалось это условие?',
      'In how many blocks was this used?',
    ),
    items: [
      { id: 'a', label: L('ikkitasida: fazo va geometriya', 'в двух: пространство и геометрия', 'in two: space and geometry'), correct: true },
      { id: 'b', label: L('faqat bittasida', 'только в одном', 'in one only'), hint: L("Fazoda vektorlar bilan, geometriyada esa urinma va radius bilan ishlatildi.", 'В пространстве с векторами, а в геометрии с касательной и радиусом.', 'In space with vectors, and in geometry with a tangent and a radius.') },
      { id: 'c', label: L('hech qayerda', 'нигде', 'nowhere'), hint: L("Bu darsning o'zida ham ikki marta uchradi.", 'Даже в этом уроке оно встретилось дважды.', 'Even in this lesson it appeared twice.') },
      { id: 'd', label: L('hamma blokda', 'во всех блоках', 'in every block'), hint: L("Integral va ehtimollikda perpendikulyarlik uchramaydi.", 'В интеграле и вероятности перпендикулярность не встречается.', 'Perpendicularity does not appear in the integral or probability blocks.') },
    ],
  },
  audio: [
    A('mount', "Sakkizinchi masala fazo blokidan.", 'Восьмая задача из блока пространства.', 'The eighth problem comes from the space block.'),
    A('write', "Ishorani qo'ying.", 'Поставь знак.', 'Place the sign.'),
  ],
}

// ============================================================
// SLAYD 10. MASALA 9. Teskari masala: uch daraja.
// ============================================================
const S10 = {
  role: 'build',
  section: 'practice',
  led: 'student',
  tag: 'similar_area',
  right: '2/2',
  eyebrow: L('Masala 9', 'Задача 9', 'Problem 9'),
  title: L('Uch qatorni yig\'ing', 'Собери три строки', 'Build the three rows'),
  targetLabel: L('Koeffitsiyent', 'Коэффициент', 'The ratio'),
  targetValue: 'k',
  tasks: [
    {
      prompt: L('Uzunlik va sirt', 'Длина и поверхность', 'Length and surface'),
      template: [L('uzunlik ', 'длина ', 'length '), { slot: 0 }, L(',  sirt ', ',  поверхность ', ',  surface '), { slot: 1 }],
      parts: ['k', 'k²', 'k³', '1'],
      answer: ['k', 'k²'],
      doneLabel: L('uzunlik k, sirt k²', 'длина k, поверхность k²', 'length k, surface k²'),
      wrongs: [
        { key: 'k²|k', hint: L("Tartib teskari: uzunlik birinchi darajada.", 'Порядок обратный: длина в первой степени.', 'The order is reversed: a length is to the first power.') },
        { key: 'k|k³', hint: L("Kub HAJMga tegishli, sirt esa ikki o'lchovli.", 'Куб относится к ОБЪЁМУ, а поверхность двумерна.', 'The cube belongs to the VOLUME, a surface is two dimensional.') },
        { key: '*', hint: L("Uzunlik bir o'lchov, sirt ikki o'lchov.", 'Длина одно измерение, поверхность два.', 'A length is one dimension, a surface two.') },
      ],
    },
    {
      prompt: L('Hajm', 'Объём', 'Volume'),
      template: [L('hajm ', 'объём ', 'volume '), { slot: 0 }],
      parts: ['k³', 'k²', 'k', '3k'],
      answer: ['k³'],
      doneLabel: L('hajm k³', 'объём k³', 'volume k³'),
      wrongs: [
        { key: 'k²', hint: L("Kvadrat SIRTda.", 'Квадрат у ПОВЕРХНОСТИ.', 'The square belongs to a SURFACE.') },
        { key: 'k', hint: L("Birinchi daraja uzunlikda.", 'Первая степень у длины.', 'The first power belongs to a length.') },
        { key: '*', hint: L("Hajm uch o'lchovli.", 'Объём трёхмерен.', 'A volume is three dimensional.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'qqizinchi masala teskari: yilning eng foydali jadvalini yig'asiz.", 'Девятая задача обратная: собираешь самую полезную таблицу года.', 'The ninth problem is reverse: you build the most useful table of the year.'),
    A('built1', "Endi hajm.", 'Теперь объём.', 'Now the volume.'),
  ],
}

// ============================================================
// SLAYD 11. MASALA 10. O'rtacha va mediana.
// ============================================================
const S11 = {
  role: 'twoway',
  section: 'practice',
  tag: 'mean_vs_median',
  eyebrow: L('Masala 10', 'Задача 10', 'Problem 10'),
  title: L('Qaysi son to\'plamni tasvirlaydi', 'Какое число описывает набор', 'Which number describes the set'),
  expr: '2,  3,  4,  5,  100',
  need: L('tipik qiymat', 'типичное значение', 'the typical value'),
  answerLabel: L('to\'g\'ri javob', 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      txt: L('o\'rtachani oldi', 'взял среднее', 'took the mean'),
      point: {
        label: L('uning soni', 'его число', 'his number'),
        calc: '22,8',
        verdict: 'out',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L('medianani oldi', 'взяла медиану', 'took the median'),
      point: {
        label: L('uning soni', 'её число', 'her number'),
        calc: '4',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['4', '22,8', '100', '5'],
    value: ['4'],
    label: L('tipik qiymat =', 'типичное значение =', 'typical value ='),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '22,8', hint: L("O'rtacha yuzni ham hisobga oladi, va u to'plamning hech bir soniga o'xshamaydi.", 'Среднее учитывает и сотню, и оно не похоже ни на одно число набора.', 'The mean counts the hundred too, and it resembles no number in the set.') },
      { key: '100', hint: L("Yuz bu chetdagi qiymat.", 'Сто это выброс.', 'One hundred is the outlier.') },
      { key: '5', hint: L("Besh o'rtada emas: chapida uchta son, o'ngida bitta.", 'Пять не в середине: слева три числа, справа одно.', 'Five is not in the middle: three numbers left, one right.') },
      { key: '*', hint: L("Tartiblangan to'plamning o'rtasidagi son medianadir.", 'Число в середине упорядоченного набора это медиана.', 'The number in the middle of the ordered set is the median.') },
    ],
  },
  holds: [4200, 2800, 5500],
  audio: [
    A('mount', "O'ninchi masala, kursning oxirgisi. Statistika blokidan.", 'Десятая задача, последняя в курсе. Из блока статистики.', 'The tenth problem, the last of the course. From the statistics block.'),
    A('p1', "Aziz o'rtachani oldi.", 'Азиз взял среднее.', 'Aziz took the mean.'),
    A('p2', "Dilnoza esa medianani oldi. To'plamda bitta chetdagi qiymat bor, va u o'rtachani tortib ketadi. Mediana chetdagi qiymatga sezgir emas.", 'А Дилноза взяла медиану. В набоpе один выброс, и он тянет среднее. Медиана к выбросу не чувствительна.', 'Dilnoza took the median. The set holds one outlier, and it drags the mean. The median is not sensitive to it.'),
    A('write', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 12. BLITS. Yilning yetti blokidan oltitasi.
// ============================================================
const S12 = {
  role: 'blitz',
  led: 'student',
  eyebrow: L('Blits', 'Блиц', 'Quick round'),
  title: L('Olti savol, olti blok', 'Шесть вопросов, шесть блоков', 'Six questions, six blocks'),
  items: [
    {
      id: 'b1', tag: 'check_by_diff', ask: true, cols: 2,
      done: '2x³',
      prompt: L('6x² ning boshlang\'ich funksiyasi?', 'Первообразная 6x²?', 'The antiderivative of 6x²?'),
      items: [
        { id: 'a', label: '2x³', correct: true },
        { id: 'b', label: '6x³', hint: L("Differensiallab tekshiring: olti iks kub o'n sakkiz iks kvadrat beradi.", 'Проверь дифференцированием: шесть икс куб даёт восемнадцать икс квадрат.', 'Check by differentiating: six x cubed gives eighteen x squared.') },
        { id: 'c', label: '12x', hint: L("Bu hosila tomoni.", 'Это в сторону производной.', 'That goes the derivative way.') },
        { id: 'd', label: '3x³', hint: L("Uch iks kubning hosilasi to'qqiz iks kvadrat.", 'Производная трёх икс куб это девять икс квадрат.', 'The derivative of three x cubed is nine x squared.') },
      ],
    },
    {
      id: 'b2', tag: 'base_direction', ask: true, cols: 2,
      done: 'x < 2',
      prompt: '0,5ˣ > 0,25',
      items: [
        { id: 'a', label: 'x < 2', correct: true },
        { id: 'b', label: 'x > 2', hint: L("Asos birdan kichik: yo'nalish almashadi.", 'Основание меньше единицы: направление переворачивается.', 'The base is under one: the direction flips.') },
        { id: 'c', label: 'x < 4', hint: L("To'rt emas ikki: nol butun yigirma besh bu yarimning KVADRATI.", 'Не четыре, а два: ноль целых двадцать пять это КВАДРАТ половины.', 'Not four but two: zero point two five is the SQUARE of a half.') },
        { id: 'd', label: 'x > 4', hint: L("Ikki xato birga: son ham, yo'nalish ham.", 'Две ошибки сразу: и число, и направление.', 'Two errors at once: the number and the direction.') },
      ],
    },
    {
      id: 'b3', tag: 'order_matters', ask: true, cols: 2,
      done: '6',
      prompt: L('1, 2, 3 dan takrorsiz uch xonali son?', 'Трёхзначные из 1, 2, 3 без повторов?', 'Three-digit numbers from 1, 2, 3 with no repeats?'),
      items: [
        { id: 'a', label: '6', correct: true },
        { id: 'b', label: '27', hint: L("Yigirma yetti bu takrorlash mumkin bo'lganda.", 'Двадцать семь это при разрешённых повторах.', 'Twenty seven is with repeats allowed.') },
        { id: 'c', label: '3', hint: L("Uch bu faqat birinchi raqamning variantlari.", 'Три это только варианты первой цифры.', 'Three is only the first digit options.') },
        { id: 'd', label: '9', hint: L("To'qqiz bu ikki xonali son bo'lganda va takror mumkin bo'lsa.", 'Девять это для двузначного с повторами.', 'Nine is for a two-digit number with repeats.') },
      ],
    },
    {
      id: 'b4', tag: 'third_coefficient', ask: true, cols: 2,
      done: '1/3',
      prompt: L('Piramida hajmida qanday koeffitsiyent?', 'Какой коэффициент в объёме пирамиды?', 'Which coefficient is in a pyramid volume?'),
      items: [
        { id: 'a', label: '1/3', correct: true },
        { id: 'b', label: '1/2', hint: L("Yarim tekislikdagi uchburchakda.", 'Половина в треугольнике на плоскости.', 'A half belongs to a triangle in the plane.') },
        { id: 'c', label: '1', hint: L("Koeffitsiyentsiz PRIZMA hisoblanadi.", 'Без коэффициента считают ПРИЗМУ.', 'Without a coefficient we compute a PRISM.') },
        { id: 'd', label: '4/3', hint: L("To'rt uchdan bir SHAR hajmida.", 'Четыре третьих в объёме ШАРА.', 'Four thirds belongs to a BALL volume.') },
      ],
    },
    {
      id: 'b5', tag: 'sym_coord', ask: true, cols: 2,
      done: '(2; −3; 4)',
      prompt: L('Oxz ga nisbatan (2; 3; 4) ning simmetrigi?', 'Симметричная (2; 3; 4) относительно Oxz?', 'The point symmetric to (2; 3; 4) about Oxz?'),
      items: [
        { id: 'a', label: '(2; −3; 4)', correct: true },
        { id: 'b', label: '(−2; 3; 4)', hint: L("Bu Oyz tekisligiga nisbatan.", 'Это относительно Oyz.', 'That is about Oyz.') },
        { id: 'c', label: '(2; 3; −4)', hint: L("Bu Oxy tekisligiga nisbatan.", 'Это относительно Oxy.', 'That is about Oxy.') },
        { id: 'd', label: '(−2; −3; −4)', hint: L("Bu koordinata boshiga nisbatan.", 'Это относительно начала координат.', 'That is about the origin.') },
      ],
    },
    {
      id: 'b6', tag: 'deriv_sign_monotone', ask: true, cols: 2,
      done: L('o\'sadi', 'возрастает', 'rises'),
      prompt: L('Hosila oraliqda musbat. Funksiya?', 'Производная положительна на промежутке. Функция?', 'The derivative is positive on the interval. The function?'),
      items: [
        { id: 'a', label: L('o\'sadi', 'возрастает', 'rises'), correct: true },
        { id: 'b', label: L('kamayadi', 'убывает', 'falls'), hint: L("Kamayish manfiy hosila bilan.", 'Убывание идёт с отрицательной производной.', 'A fall comes with a negative derivative.') },
        { id: 'c', label: L('musbat', 'положительна', 'is positive'), hint: L("Funksiyaning ishorasi hosilaning ishorasidan chiqmaydi.", 'Знак функции не следует из знака производной.', 'The sign of the function does not follow from its derivative.') },
        { id: 'd', label: L('ekstremumi bor', 'имеет экстремум', 'has an extremum'), hint: L("Ekstremum uchun ishora almashishi kerak.", 'Для экстремума знак должен смениться.', 'An extremum needs a sign change.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits. Oltita savol, olti blokdan, va faqat shu ekran natijaga kiradi.", 'Блиц. Шесть вопросов из шести блоков, и только этот экран идёт в результат.', 'Quick round. Six questions from six blocks, and only this screen counts.'),
  ],
}

// ============================================================
// SLAYD 13. XATONI TOPING. Statsionar nuqta ekstremum deb olingan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'stationary_not_extremum',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Bir satr xato', 'Одна строка неверна', 'One line is wrong'),
  rows: [
    { id: 'r1', text: 'f = x³' },
    { id: 'r2', text: 'f ′ = 3x²' },
    { id: 'r3', text: L('nol: x = 0', 'ноль: x = 0', 'zero: x = 0') },
    { id: 'r4', text: L('x = 0 -> minimum', 'x = 0 -> минимум', 'x = 0 -> a minimum') },
    { id: 'r5', text: L('javob: minimum nolda', 'ответ: минимум в нуле', 'answer: a minimum at zero') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Hosila to'g'ri: uch iks kvadrat.", 'Производная верна: три икс квадрат.', 'The derivative is right: three x squared.'),
    r3: L("Nol to'g'ri topilgan: uch iks kvadrat nolda nolga aylanadi.", 'Ноль найден верно: три икс квадрат в нуле обращается в ноль.', 'The zero is right: three x squared vanishes at zero.'),
    r5: L("Oxirgi satr faqat ko'chirma.", 'Последняя строка только перепись.', 'The last line is just a copy.'),
  },
  proofPoint: L('ishora almashmadi', 'знак не сменился', 'the sign did not flip'),
  proof: L(
    "Uch iks kvadrat nolning ikki tomonida ham MUSBAT. Ishora almashmadi, demak ekstremum yo'q: funksiya nolda bir zumga to'xtaydi va yana o'sadi.",
    'Три икс квадрат ПОЛОЖИТЕЛЬНО с двух сторон от нуля. Знак не сменился, значит экстремума нет: функция на мгновение замирает в нуле и снова растёт.',
    'Three x squared is POSITIVE on both sides of zero. The sign did not flip, so there is no extremum: the function pauses at zero and rises again.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('ishora tekshirilmagan', 'знак не проверен', 'the sign was not checked'), correct: true },
      { id: 'b', label: L('hosila xato', 'производная неверна', 'the derivative is wrong'), hint: L("Hosila to'g'ri: uch iks kvadrat.", 'Производная верна: три икс квадрат.', 'The derivative is right: three x squared.') },
      { id: 'c', label: L('nol xato topilgan', 'ноль найден неверно', 'the zero is wrong'), hint: L("Nol to'g'ri: nolda hosila nolga teng.", 'Ноль верен: в нуле производная равна нулю.', 'The zero is right: at zero the derivative vanishes.') },
      { id: 'd', label: L('javob to\'g\'ri', 'ответ верный', 'the answer is right'), hint: L("Kub funksiyada ekstremum yo'q: u to'xtamasdan o'sadi.", 'У кубической функции экстремума нет: она растёт без остановки.', 'The cube function has no extremum: it rises without stopping.') },
    ],
  },
  audio: [
    A('mount', "Masalalar tugadi. Oxirgi marta boshqaning yechimiga qaraymiz.", 'Задачи закончились. Последний раз посмотрим на чужое решение.', 'The problems are done. One last look at someone else solution.'),
    A('q1', "Diqqat: hamma hisob to'g'ri. Xato xulosada.", 'Внимание: весь счёт верен. Ошибка в выводе.', 'Careful: all the arithmetic is right. The error is in the conclusion.'),
    A('proof', "Qarang: hosila nolda haqiqatan nolga aylanadi, lekin bu yetmaydi. Uch iks kvadrat nolning chapida ham, o'ngida ham musbat, ya'ni ishora almashmadi. Statsionar nuqta faqat nomzod, hukmni esa ishora chiqaradi. Kub funksiyasi nolda gorizontal urinma oladi va o'sishda davom etadi. Bu yil bo'yi eng ko'p uchragan xato turi: to'g'ri hisob va noto'g'ri xulosa.", 'Смотри: производная в нуле действительно обращается в ноль, но этого мало. Три икс квадрат положительно и слева от нуля, и справа, то есть знак не сменился. Стационарная точка это только кандидат, а решает знак. Кубическая функция получает в нуле горизонтальную касательную и продолжает расти. Это самый частый тип ошибки за год: верный счёт и неверный вывод.', 'Look: the derivative does vanish at zero, but that is not enough. Three x squared is positive both left and right of zero, so the sign did not flip. A stationary point is only a candidate, and the sign decides. The cube function gets a horizontal tangent at zero and keeps rising. This is the most frequent error type of the year: right arithmetic, wrong conclusion.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA: urinma tenglamasi.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'tangent_point',
  right: '2/2',
  eyebrow: L('Teskari masala', 'Обратная задача', 'The reverse task'),
  title: L('Urinmani yig\'ing', 'Собери касательную', 'Build the tangent'),
  targetLabel: L('Nuqta', 'Точка', 'The point'),
  targetValue: 'x₀ = 1,  f (1) = 2,  f ′ (1) = 3',
  tasks: [
    {
      prompt: L('Tenglamani yig\'ing', 'Собери уравнение', 'Build the equation'),
      template: ['y − ', { slot: 0 }, ' = ', { slot: 1 }, ' (x − 1)'],
      parts: ['2', '3', '1', 'x'],
      answer: ['2', '3'],
      doneLabel: 'y − 2 = 3 (x − 1)',
      wrongs: [
        { key: '3|2', hint: L("Chapda funksiyaning QIYMATI, o'ngda esa HOSILA turadi.", 'Слева ЗНАЧЕНИЕ функции, а справа ПРОИЗВОДНАЯ.', 'The VALUE goes on the left, the DERIVATIVE on the right.') },
        { key: '2|x', hint: L("Qiyalik SON bo'lishi kerak: hosila nuqtada hisoblangan.", 'Наклон должен быть ЧИСЛОМ: производная посчитана в точке.', 'The slope must be a NUMBER: the derivative is evaluated at the point.') },
        { key: '*', hint: L("Formula y minus f dan x nol teng f shtrix karra x minus x nol.", 'Формула: y минус значение равно производной на x минус x нулевое.', 'The formula: y minus the value equals the derivative times x minus x zero.') },
      ],
    },
    {
      prompt: L('Ochib yozing', 'Раскрой', 'Expand it'),
      template: ['y = 3x ', { slot: 0 }],
      parts: ['− 1', '+ 1', '− 2', '+ 2'],
      answer: ['− 1'],
      doneLabel: 'y = 3x − 1',
      wrongs: [
        { key: '+ 1', hint: L("Ishora teskari: minus uch plyus ikki minus bir beradi.", 'Знак обратный: минус три плюс два даёт минус один.', 'The sign is reversed: minus three plus two gives minus one.') },
        { key: '− 2', hint: L("Ikki qo'shilmagan: qavs ochilganda minus uch chiqadi, keyin plyus ikki.", 'Двойка не добавлена: при раскрытии выходит минус три, потом плюс два.', 'The two is missing: expanding gives minus three, then plus two.') },
        { key: '*', hint: L("Uch karra minus bir minus uch, ustiga ikki qo'shiladi.", 'Три на минус один это минус три, плюс два.', 'Three times minus one is minus three, plus two.') },
      ],
    },
  ],
  audio: [
    A('mount', "Kursning oxirgi topshirig'i: urinma tenglamasi.", 'Последнее задание курса: уравнение касательной.', 'The last task of the course: the tangent equation.'),
    A('built1', "Endi qavsni ochib yozing.", 'Теперь раскрой скобку.', 'Now expand the bracket.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN. KURSNING OXIRGI EKRANI.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'check_by_point',
  gapMap: 8,
  eyebrow: L('Kurs yakuni', 'Итог курса', 'The course summary'),
  title: L('Yil bo\'yi bitta odat', 'Одна привычка на весь год', 'One habit for the whole year'),
  law: L('qoidani son bilan tekshir', 'проверяй правило числом', 'check the rule with a number'),
  ruleLines: [
    L('to\'g\'ri hisob noto\'g\'ri xulosani qutqarmaydi', 'верный счёт не спасает неверный вывод', 'right arithmetic does not save a wrong conclusion'),
    L('teng kuchli bo\'lmagan o\'tishdan keyin tekshiruv', 'после неравносильного перехода — проверка', 'after a non-equivalent step, check'),
    L('o\'lchov darajani beradi', 'измерение задаёт степень', 'the dimension sets the power'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('kvadratning −3 dagi hosilasi', 'производная квадрата в −3', 'the derivative of the square at −3'),
      right: '−6',
      map: { a: '−6', b: '9', c: '6', d: '−9' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: L('qiymat 9, hosila −6', 'значение 9, производная −6', 'value 9, derivative −6'),
  },
  levels: {
    full: L('Kurs siz uchun yopildi', 'Курс у тебя закрыт', 'The course is covered'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Xaritada ko\'rsatilgan darslarga qayting', 'Вернись к урокам, указанным в карте', 'Go back to the lessons named in the map'),
  },
  probe: {
    question: L(
      'Kursning eng foydali odati qaysi?',
      'Какая привычка курса самая полезная?',
      'Which habit of the course is the most useful?',
    ),
    items: [
      { id: 'a', label: L('qoidani son bilan tekshirish', 'проверять правило числом', 'checking a rule with a number'), correct: true },
      { id: 'b', label: L('formulalarni yodlash', 'заучивать формулы', 'memorising formulas'), hint: L("Formulalar kerak, lekin yodlangan formula ham xato ishlatiladi: bugungi to'rtinchi qoida shunday edi.", 'Формулы нужны, но и заученную формулу применяют неверно: сегодняшнее четвёртое правило было таким.', 'Formulas matter, but even a memorised formula gets misapplied: today the fourth rule was such a case.') },
      { id: 'c', label: L('tez hisoblash', 'быстро считать', 'computing fast'), hint: L("Tezlik foydali, lekin bugun hamma xato yechimda hisob TO'G'RI edi.", 'Скорость полезна, но сегодня во всех неверных решениях счёт был ВЕРНЫМ.', 'Speed helps, but today every wrong solution had RIGHT arithmetic.') },
      { id: 'd', label: L('chizmani chizish', 'рисовать чертёж', 'drawing a diagram'), hint: L("Chizma yo'lni ko'rsatadi, lekin hukmni son chiqaradi: uchburchak besh, olti, yetti to'g'ri burchakli KO'RINADI.", 'Чертёж показывает путь, но решает число: треугольник пять, шесть, семь ВЫГЛЯДИТ прямоугольным.', 'A drawing shows the way, but a number decides: the triangle five, six, seven LOOKS right-angled.') },
    ],
  },
  sheetTitle: L('Kurs yakuni · shpargalka', 'Итог курса · шпаргалка', 'Course summary · cheat sheet'),
  sheetSrc: L('11-sinf · 56-dars', '11 класс · урок 56', 'Grade 11 · lesson 56'),
  lifehack: L(
    "Har qoidaga bitta son qo'ying: yolg'on qoida shu joyda yiqiladi.",
    'Подставь в каждое правило одно число: ложное правило падает именно здесь.',
    'Put one number into each rule: a false rule falls right there.',
  ),
  holds: [3200, 5000, 7000],
  audio: [
    A('mount', "Kurs tugadi. Oxirgi natijaga qaraymiz.", 'Курс закончен. Смотрим последний результат.', 'The course is over. Let us look at the last result.'),
    A('p1', "Mana taxminingiz va mana javob. Hosila minus olti, qiymat esa to'qqiz: ikki xil savol, ikki xil son.", 'Вот твоя догадка и вот ответ. Производная минус шесть, а значение девять: два разных вопроса, два разных числа.', 'Here is your guess and here is the answer. The derivative is minus six and the value nine: two different questions, two different numbers.'),
    A('rule', "O'ng tomonda butun yil bo'yicha kamchiliklar xaritasi: qaysi blokda qaysi joy takrorlashni talab qiladi. Va kursning bitta umumiy fikri. Yil bo'yi eng qimmat xato bitta bo'ldi: qoidaning KO'RINISHIGA ishonish. Bugun to'rtta qoidadan uchtasi to'g'ri edi, to'rtinchisi esa ko'rinishdan xuddi shunday ishonchli bo'lib turdi va faqat son uni yiqitdi. Shuning uchun har qoidaga bitta son qo'yish kerak, har teng kuchli bo'lmagan o'tishdan keyin javobni asl yozuvga qaytarish kerak, va har xulosadan oldin ishorani tekshirish kerak. Imtihonda vaqt shu tekshiruvlarga ketadi, va aynan shu vaqt ballni beradi.", 'Справа карта пробелов по всему году: в каком блоке какое место требует повтора. И одна общая мысль курса. Самая дорогая ошибка года была одна: верить ВИДУ правила. Сегодня из четырёх правил три были верны, а четвёртое выглядело столь же убедительно, и опрокинуло его только число. Поэтому в каждое правило надо подставлять число, после каждого неравносильного перехода возвращать ответ в исходную запись, и перед каждым выводом проверять знак. На экзамене время уходит на эти проверки, и именно это время даёт балл.', 'On the right is the gap map for the whole year: which block, which spot needs review. And one shared thought of the course. The most expensive error of the year was one: trusting the LOOK of a rule. Today three of four rules were right, and the fourth looked just as convincing, and only a number knocked it down. So put a number into every rule, return the answer to the original record after every non-equivalent step, and check the sign before every conclusion. On the exam the time goes into those checks, and that time is what earns the score.'),
    A('q', 'Kursning oxirgi savoli.', 'Последний вопрос курса.', 'The last question of the course.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  mode: MODE,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
