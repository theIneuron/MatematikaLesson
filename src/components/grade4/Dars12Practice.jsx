// ============================================================================
// 4-SINF · 12-DARS AMALIYOTI
// Ko'p xonali sonni bir xonali songa bo'lish
// 10 scored topshiriq + natija · ovozsiz · solve-to-advance
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

const T = {
  bg: '#F5F5F0', paper: '#FFFFFF', ink: '#12212C', ink2: '#50616D', ink3: '#87949D',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', success: '#227A53', successSoft: '#E7F3EC', warn: '#A96F13',
  warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};

const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';

const LESSON = {
  id: 'num-4-12-practice',
  title: { uz: "12-dars. Amaliyot: bir xonali songa bo'lish", ru: 'Урок 12. Практика: деление на однозначное число', en: 'Lesson 12. Practice: dividing by a one-digit number' },
  skillTags: ['first-incomplete-dividend', 'long-division', 'zero-in-quotient', 'remainder', 'inverse-check'],
};

const UI = {
  task: { ru: 'Задание', uz: "Topshiriq" , en: "Task"},
  levels: {
    green: { ru: 'Базовое', uz: "Asosiy" , en: "Core"},
    yellow: { ru: 'Применение', uz: "Qo'llash" , en: "Application"},
    red: { ru: 'Перенос', uz: "Ko'chirish" , en: "Transfer"},
  },
  check: { ru: 'Проверить', uz: "Tekshirish" , en: "Check"},
  retry: { ru: 'Попробовать ещё', uz: "Yana urinib ko'ring", en: 'Try again' },
  next: { ru: 'Следующее', uz: "Keyingisi" , en: "Next"},
  finish: { ru: 'Завершить', uz: "Yakunlash" , en: "Finish"},
  restart: { ru: 'Пройти заново', uz: "Qaytadan boshlash", en: 'Start again' },
  done: { ru: 'Практика завершена', uz: "Amaliyot tugadi", en: 'Practice complete' },
  firstTry: { ru: 'решено с первой попытки', uz: "birinchi urinishda to'g'ri", en: 'solved on the first try' },
  attempts: { ru: 'Всего проверок', uz: "Jami tekshiruvlar", en: 'Total checks' },
  hint: { ru: 'Подсказка', uz: "Ko'rsatma", en: 'Hint' },
  rule: { ru: 'Вывод', uz: "Xulosa", en: 'Conclusion' },
  typeAnswer: { ru: 'Введите ответ цифрами', uz: "Javobni raqamlar bilan kiriting", en: 'Enter the answer in digits' },
  clear: { ru: 'Стереть', uz: "O'chirish", en: 'Clear' },
  slotHint: { ru: 'Выберите место, затем одну карточку.', uz: "Avval joyni, keyin bitta kartani tanlang.", en: 'Choose a slot, then choose one card.' },
  matchHint: { ru: 'Выберите карточку слева, затем ответ справа.', uz: "Avval chapdagi kartani, keyin o'ngdagi javobni tanlang.", en: 'Choose a card on the left, then its answer on the right.' },
  neutral: { ru: 'Все 10 заданий решены.', uz: "10 ta topshiriqning barchasi yechildi." , en: "All 10 tasks have been solved."},
};

const tx = (value, lang) => (value && typeof value === 'object' ? (value[normalizeLang(lang)] ?? '') : value);
const grouped = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const TASKS = [
  {
    id: '01', level: 'green', kind: 'mc', skillTag: 'first-incomplete-dividend', figure: '8 472 : 4',
    setup: { ru: 'Начните письменное деление слева.', uz: "Yozma bo'lishni chap tomondan boshlang.", en: 'Start the long division from the left.' },
    prompt: { ru: 'Какое первое неполное делимое?', uz: "Birinchi to'liqsiz bo'linuvchi qaysi?" , en: "What is the first partial dividend?"},
    neutralRows: ['8 □ 4', '84 □ 4', '847 □ 4'], neutralFocus: 0,
    visualRows: ['8 ≥ 4', '84 ≥ 4', '847 ≥ 4'], highlight: '8 ≥ 4',
    options: [
      { id: 'a', text: '8', correct: true },
      { id: 'b', text: '84', wrong: { ru: 'Восемь уже не меньше четырёх, поэтому брать две цифры не нужно.', uz: "8 soni 4 dan kichik emas, shuning uchun ikkita raqamni olish kerak emas.", en: 'Eight is already not less than four, so you do not need to take two digits.' } },
      { id: 'c', text: '847', wrong: { ru: 'Подходящая левая часть встретилась раньше. Ищите самую короткую.', uz: "Mos chap qism oldinroq uchradi. Eng qisqa qismini izlang.", en: 'A suitable left-hand part appeared earlier. Look for the shortest one.' } },
      { id: 'd', text: '8 472', wrong: { ru: 'Всё делимое брать не нужно: сначала ищут наименьшую подходящую левую часть.', uz: "Butun bo'linuvchini olish kerak emas: avval eng kichik mos chap qism izlanadi.", en: 'You do not need the entire dividend. First find the smallest suitable part on the left.' } },
    ],
    hints: [
      { ru: 'Сравнивайте части числа с делителем слева направо.', uz: "Son qismlarini bo'luvchi bilan chapdan o'ngga taqqoslang.", en: 'Compare parts of the number with the divisor from left to right.' },
      { ru: 'Сначала посмотрите только на крайнюю левую цифру.', uz: "Avval faqat eng chapdagi raqamga qarang.", en: 'First, look only at the leftmost digit.' },
      { ru: 'Проверьте, можно ли разделить крайнюю левую цифру хотя бы один раз.', uz: "Eng chapdagi raqamni hech bo'lmasa bir marta bo'lish mumkinligini tekshiring.", en: 'Check whether the leftmost digit can be divided at least once.' },
    ],
    correctText: { ru: 'Верно. Деление начинается с 8, и частное будет четырёхзначным.', uz: "To'g'ri. Bo'lish 8 dan boshlanadi va bo'linma to'rt xonali bo'ladi.", en: 'Correct. The division starts with 8, and the quotient will have four digits.' },
    rule: { ru: 'Первое неполное делимое — наименьшая левая часть, не меньшая делителя.', uz: "Birinchi to'liqsiz bo'linuvchi bo'luvchidan kichik bo'lmagan eng kichik chap qismdir.", en: 'The first partial dividend is the smallest left-hand part that is not less than the divisor.' },
  },
  {
    id: '02', level: 'green', kind: 'digit', skillTag: 'quotient-digit', figure: '5 418 : 6',
    setup: { ru: 'Первое неполное делимое равно 54.', uz: "Birinchi to'liqsiz bo'linuvchi 54 ga teng.", en: 'The first partial dividend is 54.' },
    prompt: { ru: 'Какую первую цифру записать в частном?', uz: "Bo'linmaga qaysi birinchi raqam yoziladi?", en: 'Which first digit should be written in the quotient?' },
    neutralRows: ['6 × 8 = □', '6 × 9 = □', '6 × 10 = □'], neutralFocus: 1,
    visualRows: ['6 × 8 = 48', '6 × 9 = 54', '6 × 10 = 60'], highlight: '6 × 9 = 54',
    options: [
      { id: 'a', text: '9', correct: true },
      { id: 'b', text: '8', wrong: { ru: 'Шесть умножить на восемь даёт 48. До 54 помещается ещё одна группа.', uz: "6 ni 8 ga ko'paytirganda 48 bo'ladi. 54 ichiga yana bitta guruh sig'adi.", en: 'Six times eight is 48. One more group fits into 54.' } },
      { id: 'c', text: '10', wrong: { ru: 'Цифра частного должна быть одной цифрой, а 60 уже больше 54.', uz: "Bo'linma xonasiga bitta raqam yoziladi, 60 esa 54 dan katta.", en: 'A quotient digit must be a single digit, and 60 is already greater than 54.' } },
      { id: 'd', text: '54', wrong: { ru: 'В частное записывают число групп, а не само неполное делимое.', uz: "Bo'linmaga to'liqsiz bo'linuvchining o'zi emas, guruhlar soni yoziladi.", en: 'Write the number of groups in the quotient, not the partial dividend itself.' } },
    ],
    hints: [
      { ru: 'Найдите наибольшее произведение на 6, которое не превышает 54.', uz: "54 dan oshmaydigan 6 ning eng katta ko'paytmasini toping.", en: 'Find the greatest multiple of 6 that does not exceed 54.' },
      { ru: 'Сравните среднюю строку лестницы с числом 54.', uz: "Zinapoyaning o'rta qatorini 54 soni bilan taqqoslang.", en: 'Compare the middle row of the ladder with 54.' },
      { ru: 'Проверьте соседние произведения: одно должно подходить точно, следующее — быть больше.', uz: "Yonma-yon ko'paytmalarni tekshiring: biri aniq mos, keyingisi esa katta bo'lishi kerak.", en: 'Check neighbouring multiples: one should fit exactly and the next should be greater.' },
    ],
    correctText: { ru: 'Верно. 54 : 6 = 9.', uz: "To'g'ri. 54 : 6 = 9.", en: 'Correct. 54 ÷ 6 = 9.' },
    rule: { ru: 'Цифра частного выбирается по ближайшему произведению, не превышающему неполное делимое.', uz: "Bo'linma raqami to'liqsiz bo'linuvchidan oshmaydigan eng yaqin ko'paytma orqali tanlanadi.", en: 'Choose the quotient digit using the nearest multiple that does not exceed the partial dividend.' },
  },
  {
    id: '03', level: 'yellow', kind: 'slots', skillTag: 'division-model', figure: { ru: '18 252 деталей · 6 равных групп', uz: "18 252 ta detal · 6 ta teng guruh", en: '18,252 parts · 6 equal groups' }, markers: 6,
    neutralRows: [{ ru: '18 252 — всего', uz: "18 252 — jami", en: '18,252 — total' }, { ru: '6 — групп', uz: "6 — guruhlar", en: '6 — groups' }, { ru: 'В каждой — □', uz: "Har birida — □", en: 'In each group — □' }], neutralFocus: [0, 1],
    visualRows: [{ ru: '18 252 — всего', uz: "18 252 — jami", en: '18,252 — total' }, { ru: '6 — групп', uz: "6 — guruhlar", en: '6 — groups' }, { ru: '3 042 — в каждой', uz: "3 042 — har birida", en: '3,042 — in each group' }], highlight: { ru: '3 042 — в каждой', uz: "3 042 — har birida", en: '3,042 — in each group' },
    setup: { ru: 'Соберите запись: всего 18 252 детали, групп 6, в каждой по 3 042.', uz: "Yozuvni tuzing: jami 18 252 ta detal, 6 ta teng guruh, har birida 3 042 tadan.", en: 'Build the equation: 18,252 parts in total, 6 groups, and 3,042 in each group.' },
    prompt: { ru: 'Какая запись связывает три величины?', uz: "Qaysi yozuv uchta miqdorni bog'laydi?", en: 'Which equation connects the three quantities?' },
    slots: [
      { id: 'total', label: { ru: 'Всего', uz: "Jami" , en: "Total"}, correct: '18252' },
      { id: 'op', label: { ru: 'Действие', uz: "Amal", en: 'Operation' }, correct: 'divide' },
      { id: 'groups', label: { ru: 'Групп', uz: "Guruhlar", en: 'Groups' }, correct: '6' },
      { id: 'eq', label: { ru: 'Знак', uz: "Belgi", en: 'Sign' }, correct: 'equals' },
      { id: 'each', label: { ru: 'В каждой', uz: "Har birida", en: 'In each group' }, correct: '3042' },
    ],
    cards: [
      { id: '18252', text: '18 252' }, { id: 'divide', text: ':' }, { id: '6', text: '6' },
      { id: 'equals', text: '=' }, { id: '3042', text: '3 042' },
    ],
    correctAnswer: '18 252 : 6 = 3 042',
    wrongText: { ru: 'Проверьте роль каждой карточки: общее количество делят на число равных групп.', uz: "Har bir kartaning vazifasini tekshiring: jami miqdor teng guruhlar soniga bo'linadi.", en: 'Check the role of each card: divide the total amount by the number of equal groups.' },
    hints: [
      { ru: 'Начните с модели «всего : число групп = в одной группе».', uz: "Jami : guruhlar soni = bitta guruh modelidan boshlang.", en: 'Start with the model: total ÷ number of groups = amount in each group.' },
      { ru: 'Сначала заполните места «всего» и «групп».', uz: "Avval jami va guruhlar o'rinlarini to'ldiring.", en: 'Fill the total and groups slots first.' },
      { ru: 'Между общим количеством и числом групп нужно действие деления.', uz: "Jami miqdor bilan guruhlar soni orasida bo'lish amali kerak.", en: 'Place the division operation between the total amount and the number of groups.' },
    ],
    correctText: { ru: 'Верно. 18 252 : 6 = 3 042.', uz: "To'g'ri. 18 252 : 6 = 3 042.", en: 'Correct. 18,252 ÷ 6 = 3,042.' },
    rule: { ru: 'Общее количество делят на число равных групп.', uz: "Jami miqdor teng guruhlar soniga bo'linadi.", en: 'Divide the total amount by the number of equal groups.' },
  },
  {
    id: '04', level: 'yellow', kind: 'numpad', skillTag: 'long-division', figure: '6 936 : 3 = ?', answer: '2312', maxLen: 5,
    setup: { ru: 'Выполните письменное деление по разрядам.', uz: "Yozma bo'lishni xonalar bo'yicha bajaring.", en: 'Complete the long division place by place.' },
    prompt: { ru: 'Какое получилось частное?', uz: "Qanday bo'linma hosil bo'ldi?", en: 'What is the quotient?' },
    neutralRows: ['6 : 3 → □', '9 : 3 → □', '3 : 3 → □', '6 : 3 → □'], neutralFocus: 0,
    visualRows: ['6 : 3 → 2', '9 : 3 → 3', '3 : 3 → 1', '6 : 3 → 2'], highlight: '6 : 3 → 2',
    hintVisual: { ru: 'Начните с крайней левой цифры: 6 : 3', uz: "Eng chapdagi raqamdan boshlang: 6 : 3", en: 'Start with the leftmost digit: 6 ÷ 3' },
    wrongByValue: {
      231: { ru: 'В ответе потерян разряд единиц. Каждая цифра делимого должна дать место в частном.', uz: "Javobda birliklar xonasi yo'qolgan. Bo'linuvchining har bir raqami bo'linmada joy olishi kerak.", en: 'The ones place is missing from the answer. Each digit of the dividend must have a place in the quotient.' },
      23120: { ru: 'Ответ стал в десять раз больше: справа добавлен лишний ноль.', uz: "Javob o'n marta kattalashgan: o'ng tomonga ortiqcha nol qo'shilgan.", en: 'The answer is ten times too large because an extra zero was added on the right.' },
    },
    wrongText: { ru: 'Проверьте каждую цифру частного и её разряд. Умножение результата на 3 должно вернуть 6 936.', uz: "Bo'linmaning har bir raqami va xonasini tekshiring. Natijani 3 ga ko'paytirish 6 936 ni qaytarishi kerak.", en: 'Check every quotient digit and its place. Multiplying the result by 3 should give 6,936.' },
    hints: [
      { ru: 'Работайте циклом: разделить, умножить, вычесть, снести цифру.', uz: "Bo'lish, ko'paytirish, ayirish va raqamni tushirish sikli bilan ishlang.", en: 'Use the cycle: divide, multiply, subtract and bring down a digit.' },
      { ru: 'Начните с крайней левой цифры 6 и делителя 3.', uz: "Eng chapdagi 6 raqami va 3 bo'luvchidan boshlang.", en: 'Start with the leftmost digit, 6, and the divisor, 3.' },
      { ru: 'Сначала найдите цифру тысяч, затем переходите к следующему разряду.', uz: "Avval minglar xonasidagi raqamni topib, keyin navbatdagi xonaga o'ting.", en: 'Find the thousands digit first, then move to the next place.' },
    ],
    correctText: { ru: 'Верно. 6 936 : 3 = 2 312.', uz: "To'g'ri. 6 936 : 3 = 2 312.", en: 'Correct. 6,936 ÷ 3 = 2,312.' },
    rule: { ru: 'Каждое неполное делимое даёт одну цифру частного.', uz: "Har bir to'liqsiz bo'linuvchi bo'linmaning bitta raqamini beradi.", en: 'Each partial dividend produces one quotient digit.' },
  },
  {
    id: '05', level: 'yellow', kind: 'missing', layout: 'digits', skillTag: 'zero-in-quotient', figure: '9 045 : 5 = 18□9',
    setup: { ru: 'В частном пропущена одна разрядная цифра.', uz: "Bo'linmada bitta xona raqami tushirib qoldirilgan.", en: 'One place-value digit is missing from the quotient.' },
    prompt: { ru: 'Какая цифра должна стоять в окошке?', uz: "Katakka qaysi raqam yozilishi kerak?", en: 'Which digit belongs in the box?' },
    neutralRows: ['9 : 5 → □', '40 : 5 → □', '4 < 5 → □', '45 : 5 → □'], neutralFocus: 2,
    visualRows: ['9 : 5 → 1', '40 : 5 → 8', '4 < 5 → 0', '45 : 5 → 9'], highlight: '4 < 5 → 0',
    options: [
      { id: 'a', text: '0', correct: true },
      { id: 'b', text: '1', wrong: { ru: 'Четырёх десятков недостаточно для пяти групп. Один десяток каждой группе дать нельзя.', uz: "To'rt o'nlik beshta guruhga yetmaydi. Har bir guruhga bittadan o'nlik berib bo'lmaydi.", en: 'Four tens are not enough for five groups. You cannot give one ten to each group.' } },
      { id: 'c', text: '5', wrong: { ru: 'Цифра 5 означала бы произведение 25, но в этом разряде есть только 4.', uz: "5 raqami 25 ko'paytmani bildirar edi, bu xonada esa faqat 4 bor.", en: 'The digit 5 would give a product of 25, but there are only 4 in this place.' } },
      { id: 'd', text: '9', wrong: { ru: 'Девять относится к последнему делению 45 : 5, а не к пропущенному разряду.', uz: "9 oxirgi 45 : 5 bo'lishiga tegishli, tushirib qoldirilgan xonaga emas.", en: 'Nine belongs to the final division, 45 ÷ 5, not to the missing place.' } },
    ],
    hints: [
      { ru: 'Следите, чтобы у каждого разряда делимого было место в частном.', uz: "Bo'linuvchining har bir xonasi uchun bo'linmada joy saqlanishini kuzating.", en: 'Make sure every place of the dividend has a place in the quotient.' },
      { ru: 'Обратите внимание на шаг, где 4 меньше делителя 5.', uz: "4 soni 5 bo'luvchidan kichik bo'lgan qadamga e'tibor bering.", en: 'Focus on the step where 4 is less than the divisor, 5.' },
      { ru: 'Если текущая часть меньше делителя, разряд в частном нельзя пропускать.', uz: "Joriy qism bo'luvchidan kichik bo'lsa, bo'linmadagi xona tashlab ketilmaydi.", en: 'If the current part is less than the divisor, you still cannot skip its place in the quotient.' },
    ],
    correctText: { ru: 'Верно. 9 045 : 5 = 1 809.', uz: "To'g'ri. 9 045 : 5 = 1 809.", en: 'Correct. 9,045 ÷ 5 = 1,809.' },
    rule: { ru: 'Ноль в частном сохраняет место разряда.', uz: "Bo'linmadagi nol xona o'rnini saqlaydi.", en: 'A zero in the quotient keeps the place value in position.' },
  },
  {
    id: '06', level: 'yellow', kind: 'numpad', skillTag: 'word-division', figure: { ru: '27 648 модулей · 8 блоков', uz: "27 648 modul · 8 ta blok", en: '27,648 modules · 8 blocks' }, markers: 8, answer: '3456', maxLen: 5,
    neutralRows: [{ ru: '27 648 : 8 = □ на блок', uz: "27 648 : 8 = har bir blokda □", en: '27,648 ÷ 8 = □ per block' }], neutralFocus: 0,
    visualRows: [{ ru: '27 648 : 8 = 3 456 на блок', uz: "27 648 : 8 = har bir blokda 3 456", en: '27,648 ÷ 8 = 3,456 per block' }], highlight: '3 456',
    setup: { ru: '27 648 модулей поровну распределили между 8 блоками.', uz: "27 648 ta modul 8 ta blokka teng taqsimlandi.", en: '27,648 modules were shared equally among 8 blocks.' },
    prompt: { ru: 'Сколько модулей получил каждый блок?', uz: "Har bir blok nechta modul oldi?", en: 'How many modules did each block receive?' },
    wrongByValue: {
      345: { ru: 'В ответе потерян один разряд. Проверьте последнюю цифру делимого.', uz: "Javobda bitta xona yo'qolgan. Bo'linuvchining oxirgi raqamini tekshiring.", en: 'One place is missing from the answer. Check the final digit of the dividend.' },
      34560: { ru: 'Ответ в десять раз больше нужного. Проверьте разряды частного.', uz: "Javob keraklisidan o'n marta katta. Bo'linma xonalarini tekshiring.", en: 'The answer is ten times too large. Check the place values in the quotient.' },
      3465: { ru: 'Цифры частного переставлены. Проверьте деление по разрядам.', uz: "Bo'linma raqamlari almashib qolgan. Xonalar bo'yicha bo'lishni tekshiring.", en: 'The quotient digits are in the wrong order. Check the division place by place.' },
      221184: { ru: 'Это результат умножения на 8, а нужно разделить общее количество.', uz: "Bu 8 ga ko'paytirish natijasi, jami miqdorni esa bo'lish kerak.", en: 'This is the result of multiplying by 8, but the total amount must be divided.' },
    },
    wrongText: { ru: 'Разделите 27 648 на 8 и проверьте ответ обратным умножением.', uz: "27 648 ni 8 ga bo'lib, javobni teskari ko'paytirish bilan tekshiring.", en: 'Divide 27,648 by 8 and check the answer by multiplying.' },
    hints: [
      { ru: 'При равном распределении общее количество делят на число блоков.', uz: "Teng taqsimlashda jami miqdor bloklar soniga bo'linadi.", en: 'For equal sharing, divide the total amount by the number of blocks.' },
      { ru: 'Составьте действие 27 648 : 8.', uz: "27 648 : 8 amalini tuzing.", en: 'Write the calculation 27,648 ÷ 8.' },
      { ru: 'Начните с 27 тысяч: в каждой группе будет по 3 тысячи, затем продолжите деление.', uz: "27 mingdan boshlang: har bir guruhga 3 mingdan tushadi, keyin bo'lishni davom ettiring.", en: 'Start with 27 thousands: each group gets 3 thousands, then continue the division.' },
    ],
    correctText: { ru: 'Верно. Каждый блок получил 3 456 модулей.', uz: "To'g'ri. Har bir blok 3 456 ta modul oldi.", en: 'Correct. Each block received 3,456 modules.' },
    rule: { ru: 'Проверка: 3 456 × 8 = 27 648.', uz: "Tekshiruv: 3 456 × 8 = 27 648.", en: 'Check: 3,456 × 8 = 27,648.' },
  },
  {
    id: '07', level: 'yellow', kind: 'order', skillTag: 'division-cycle', figure: { ru: 'Цикл письменного деления', uz: "Yozma bo'lish sikli", en: 'Long-division cycle' },
    neutralRows: [{ ru: '1-й шаг — □', uz: "1-qadam — □", en: 'Step 1 — □' }, { ru: '2-й шаг — □', uz: "2-qadam — □", en: 'Step 2 — □' }, { ru: '3-й шаг — □', uz: "3-qadam — □", en: 'Step 3 — □' }, { ru: '4-й шаг — □', uz: "4-qadam — □", en: 'Step 4 — □' }], neutralFocus: 0,
    visualRows: [{ ru: '1. Разделить', uz: "1. Bo'lish", en: '1. Divide' }, { ru: '2. Умножить', uz: "2. Ko'paytirish", en: '2. Multiply' }, { ru: '3. Вычесть', uz: "3. Ayirish", en: '3. Subtract' }, { ru: '4. Снести цифру', uz: "4. Raqamni tushirish", en: '4. Bring down a digit' }], highlight: { ru: '1. Разделить', uz: "1. Bo'lish", en: '1. Divide' },
    setup: { ru: 'Расположите четыре действия письменного деления по порядку.', uz: "Yozma bo'lishning to'rtta amalini tartib bilan joylashtiring.", en: 'Put the four long-division steps in order.' },
    prompt: { ru: 'Как повторяется цикл в каждом разряде?', uz: "Har bir xonada sikl qanday takrorlanadi?", en: 'How does the cycle repeat in each place?' },
    slots: [
      { id: 'one', label: { ru: '1-й шаг', uz: "1-qadam", en: 'Step 1' }, correct: 'divide' },
      { id: 'two', label: { ru: '2-й шаг', uz: "2-qadam", en: 'Step 2' }, correct: 'multiply' },
      { id: 'three', label: { ru: '3-й шаг', uz: "3-qadam", en: 'Step 3' }, correct: 'subtract' },
      { id: 'four', label: { ru: '4-й шаг', uz: "4-qadam", en: 'Step 4' }, correct: 'bring' },
    ],
    cards: [
      { id: 'divide', text: { ru: 'Разделить', uz: "Bo'lish", en: 'Divide' } },
      { id: 'multiply', text: { ru: 'Умножить', uz: "Ko'paytirish", en: 'Multiply' } },
      { id: 'subtract', text: { ru: 'Вычесть', uz: "Ayirish", en: 'Subtract' } },
      { id: 'bring', text: { ru: 'Снести цифру', uz: "Keyingi raqamni tushirish", en: 'Bring down the next digit' } },
    ],
    correctAnswer: { ru: 'разделить → умножить → вычесть → снести цифру', uz: "bo'lish → ko'paytirish → ayirish → keyingi raqamni tushirish", en: 'divide → multiply → subtract → bring down the next digit' },
    wrongText: { ru: 'Сначала получают цифру частного, затем проверяют её произведением и вычитанием.', uz: "Avval bo'linma raqami olinadi, keyin u ko'paytirish va ayirish bilan tekshiriladi.", en: 'First find a quotient digit, then check it by multiplying and subtracting.' },
    hints: [
      { ru: 'Подумайте, какое действие сначала даёт цифру частного.', uz: "Avval qaysi amal bo'linma raqamini berishini o'ylang.", en: 'Think about which operation gives a quotient digit first.' },
      { ru: 'Первые два действия — деление и проверочное умножение.', uz: "Birinchi ikki amal bo'lish va tekshiruvchi ko'paytirishdir.", en: 'The first two operations are division and checking by multiplication.' },
      { ru: 'После умножения нужно найти остаток вычитанием.', uz: "Ko'paytirishdan keyin qoldiq ayirish bilan topiladi.", en: 'After multiplying, find the remainder by subtracting.' },
    ],
    correctText: { ru: 'Верно. Этот цикл повторяется для каждого разряда.', uz: "To'g'ri. Bu sikl har bir xona uchun takrorlanadi.", en: 'Correct. This cycle repeats for each place.' },
    rule: { ru: 'Разделить → умножить → вычесть → снести следующую цифру.', uz: "Bo'lish → ko'paytirish → ayirish → keyingi raqamni tushirish.", en: 'Divide → multiply → subtract → bring down the next digit.' },
  },
  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'remainder', figure: '23 459 : 7',
    setup: { ru: 'Найдите частное и остаток.', uz: "Bo'linma va qoldiqni toping.", en: 'Find the quotient and remainder.' },
    prompt: { ru: 'Какой ответ верен?', uz: "Qaysi javob to'g'ri?", en: 'Which answer is correct?' },
    neutralRows: ['□ × 7 + r = 23 459', '0 ≤ r < 7'], neutralFocus: 0,
    remainderMeter: { limit: '7', label: { ru: 'Допустимый остаток', uz: "Mumkin bo'lgan qoldiq", en: 'Allowed remainder' } },
    visualRows: ['7 × 3 351 = 23 457', '23 459 − 23 457 = 2', '2 < 7'], highlight: '2 < 7',
    hintVisual: '23 459 − 7 × □',
    options: [
      { id: 'a', text: { ru: '3 351, остаток 2', uz: "3 351, qoldiq 2", en: '3,351, remainder 2' }, correct: true },
      { id: 'b', text: { ru: '3 351, остаток 0', uz: "3 351, qoldiq 0", en: '3,351, remainder 0' }, wrong: { ru: 'Произведение 3 351 и 7 равно 23 457, до делимого остаётся 2.', uz: "3 351 bilan 7 ning ko'paytmasi 23 457, bo'linuvchigacha 2 qoladi.", en: 'The product of 3,351 and 7 is 23,457, leaving 2 to reach the dividend.' } },
      { id: 'c', text: { ru: '3 350, остаток 9', uz: "3 350, qoldiq 9", en: '3,350, remainder 9' }, wrong: { ru: 'Остаток 9 не может быть больше делителя 7. В частное помещается ещё одна группа.', uz: "9 qoldiq 7 bo'luvchidan katta bo'la olmaydi. Bo'linmaga yana bitta guruh sig'adi.", en: 'A remainder of 9 cannot be greater than the divisor, 7. One more group fits in the quotient.' } },
      { id: 'd', text: { ru: '3 352, без остатка', uz: "3 352, qoldiqsiz", en: '3,352, no remainder' }, wrong: { ru: 'Произведение 3 352 и 7 уже превышает 23 459.', uz: "3 352 bilan 7 ning ko'paytmasi 23 459 dan oshadi.", en: 'The product of 3,352 and 7 already exceeds 23,459.' } },
    ],
    hints: [
      { ru: 'Найдите ближайшее произведение на 7, не превышающее делимое.', uz: "Bo'linuvchidan oshmaydigan 7 ning eng yaqin ko'paytmasini toping.", en: 'Find the nearest multiple of 7 that does not exceed the dividend.' },
      { ru: 'Выделите строку проверки с неизвестным частным и остатком.', uz: "Noma'lum bo'linma va qoldiqli tekshiruv qatorini ajrating.", en: 'Focus on the check line with the unknown quotient and remainder.' },
      { ru: 'Вычтите ближайшее произведение и проверьте, что остаток меньше 7.', uz: "Eng yaqin ko'paytmani ayirib, qoldiq 7 dan kichikligini tekshiring.", en: 'Subtract the nearest multiple and check that the remainder is less than 7.' },
    ],
    correctText: { ru: 'Верно. 23 459 : 7 = 3 351, остаток 2.', uz: "To'g'ri. 23 459 : 7 = 3 351, qoldiq 2.", en: 'Correct. 23,459 ÷ 7 = 3,351 remainder 2.' },
    rule: { ru: 'Остаток всегда меньше делителя.', uz: "Qoldiq har doim bo'luvchidan kichik bo'ladi.", en: 'The remainder is always less than the divisor.' },
  },
  {
    id: '09', level: 'red', kind: 'mc', skillTag: 'zero-in-quotient', figure: '4 824 : 4 = 126  ✕',
    setup: { ru: 'В решении потеряли внутренний ноль частного.', uz: "Yechimda bo'linmaning ichki noli yo'qotilgan.", en: 'The zero inside the quotient was lost in the solution.' },
    prompt: { ru: 'Как исправить частное?', uz: "Bo'linmani qanday tuzatish kerak?", en: 'How should the quotient be corrected?' },
    neutralRows: ['4 : 4 → □', '8 : 4 → □', '2 < 4 → □', '24 : 4 → □'], neutralFocus: 2,
    visualRows: ['4 : 4 → 1', '8 : 4 → 2', '2 < 4 → 0', '24 : 4 → 6'], highlight: '2 < 4 → 0',
    options: [
      { id: 'a', text: '1 206', correct: true },
      { id: 'b', text: '126', wrong: { ru: 'Так пропущен разряд, где 2 меньше 4. Цифры справа сдвинулись.', uz: "Bunda 2 soni 4 dan kichik bo'lgan xona tashlab ketilgan. O'ngdagi raqamlar siljigan.", en: 'This skips the place where 2 is less than 4, shifting the digits on the right.' } },
      { id: 'c', text: '1 260', wrong: { ru: 'Ноль поставлен после последнего деления, а нужен перед цифрой единиц 6.', uz: "Nol oxirgi bo'lishdan keyin qo'yilgan, u esa birliklar raqami 6 dan oldin kerak.", en: 'The zero was placed after the final division, but it belongs before the ones digit, 6.' } },
      { id: 'd', text: '1 026', wrong: { ru: 'Цифра сотен должна получиться из 8 : 4. Она не может исчезнуть.', uz: "Yuzlar xonasidagi raqam 8 : 4 dan hosil bo'ladi. U yo'qolib qolmaydi.", en: 'The hundreds digit comes from 8 ÷ 4. It cannot disappear.' } },
    ],
    hints: [
      { ru: 'Сопоставьте каждую цифру делимого с местом в частном.', uz: "Bo'linuvchining har bir raqamini bo'linmadagi joyi bilan moslang.", en: 'Match each digit of the dividend to its place in the quotient.' },
      { ru: 'Выделите шаг после деления 8 : 4, когда остаётся часть 2.', uz: "8 : 4 dan keyingi, 2 qismi qoladigan qadamni ajrating.", en: 'Focus on the step after 8 ÷ 4, when the remaining part is 2.' },
      { ru: 'Между цифрами 2 и 6 частного должно сохраниться ещё одно разрядное место.', uz: "Bo'linmadagi 2 va 6 raqamlari orasida yana bitta xona joyi saqlanishi kerak.", en: 'Another place must be kept between the digits 2 and 6 in the quotient.' },
    ],
    correctText: { ru: 'Верно. 4 824 : 4 = 1 206.', uz: "To'g'ri. 4 824 : 4 = 1 206.", en: 'Correct. 4,824 ÷ 4 = 1,206.' },
    rule: { ru: 'Если часть меньше делителя, в соответствующем разряде частного записывают ноль.', uz: "Qism bo'luvchidan kichik bo'lsa, bo'linmaning mos xonasiga nol yoziladi.", en: 'When a part is less than the divisor, write zero in the corresponding place of the quotient.' },
  },
  {
    id: '10', level: 'red', kind: 'mc', skillTag: 'inverse-check', figure: { ru: '31 586 датчиков · 9 направлений', uz: "31 586 ta sensor · 9 ta yo'nalish", en: '31,586 sensors · 9 routes' }, markers: 9,
    neutralRows: ['□ × 9 + r = 31 586', '0 ≤ r < 9'], neutralFocus: 0,
    remainderMeter: { limit: '9', label: { ru: 'Допустимый остаток', uz: "Mumkin bo'lgan qoldiq", en: 'Allowed remainder' } },
    visualRows: ['3 509 × 9 + 5 = 31 586', '5 < 9'], highlight: '5 < 9',
    setup: { ru: 'Датчики распределяют поровну; часть может остаться.', uz: "Sensorlar teng taqsimlanadi; bir qismi ortib qolishi mumkin.", en: 'The sensors are shared equally, and some may be left over.' },
    prompt: { ru: 'Какие частное, остаток и проверка верны?', uz: "Qaysi bo'linma, qoldiq va tekshiruv to'g'ri?", en: 'Which quotient, remainder and check are correct?' },
    options: [
      { id: 'a', text: { ru: '3 509, ост. 5; 3 509 × 9 + 5 = 31 586', uz: "3 509, qoldiq 5; 3 509 × 9 + 5 = 31 586", en: '3,509, rem. 5; 3,509 × 9 + 5 = 31,586' }, correct: true },
      { id: 'b', text: { ru: '3 509, ост. 0; 3 509 × 9 = 31 581', uz: "3 509, qoldiq 0; 3 509 × 9 = 31 581", en: '3,509, rem. 0; 3,509 × 9 = 31,581' }, wrong: { ru: 'Произведение меньше делимого на 5, поэтому остаток нельзя записать нулём.', uz: "Ko'paytma bo'linuvchidan 5 ta kichik, shuning uchun qoldiqni nol deb bo'lmaydi.", en: 'The product is 5 less than the dividend, so the remainder cannot be zero.' } },
      { id: 'c', text: { ru: '3 508, ост. 14', uz: "3 508, qoldiq 14", en: '3,508, rem. 14' }, wrong: { ru: 'Остаток 14 больше делителя 9: ещё одна полная группа не учтена.', uz: "14 qoldiq 9 bo'luvchidan katta: yana bitta to'liq guruh hisobga olinmagan.", en: 'The remainder 14 is greater than the divisor 9, so one more complete group was not counted.' } },
      { id: 'd', text: { ru: '35 090, ост. 5', uz: "35 090, qoldiq 5", en: '35,090, rem. 5' }, wrong: { ru: 'Частное стало больше делимого. Оценка по разрядам это исключает.', uz: "Bo'linma bo'linuvchidan katta bo'lib qoldi. Xonalar bo'yicha taxmin buni rad etadi.", en: 'The quotient is greater than the dividend. A place-value estimate rules this out.' } },
    ],
    hints: [
      { ru: 'Проверьте ответ формулой: частное × делитель + остаток = делимое.', uz: "Javobni bo'linma × bo'luvchi + qoldiq = bo'linuvchi qoidasida tekshiring.", en: 'Check the answer using: quotient × divisor + remainder = dividend.' },
      { ru: 'Выделите строку обратной проверки с неизвестными частным и остатком.', uz: "Noma'lum bo'linma va qoldiqli teskari tekshiruv qatorini ajrating.", en: 'Focus on the inverse-check line with the unknown quotient and remainder.' },
      { ru: 'Найдите разность между делимым и произведением; она должна быть меньше 9.', uz: "Bo'linuvchi bilan ko'paytma orasidagi ayirmani toping; u 9 dan kichik bo'lishi kerak.", en: 'Find the difference between the dividend and the product. It must be less than 9.' },
    ],
    correctText: { ru: 'Верно. На каждом направлении 3 509 датчиков, остаётся 5.', uz: "To'g'ri. Har bir yo'nalishda 3 509 ta sensor, 5 ta ortib qoladi.", en: 'Correct. Each route gets 3,509 sensors, with 5 left over.' },
    rule: { ru: '3 509 × 9 + 5 = 31 586, а 5 < 9.', uz: "3 509 × 9 + 5 = 31 586 va 5 < 9.", en: '3,509 × 9 + 5 = 31,586, and 5 < 9.' },
  },
];

const LESSON_META = {
  lessonId: LESSON.id,
  lessonTitle: LESSON.title,
  skillTags: LESSON.skillTags,
};

const SCREEN_META = [
  { id: 'p01', type: 'practice', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 'p02', type: 'practice', template: 'digit-choice', scored: true, scope: 'module-mikro' },
  { id: 'p03', type: 'practice', template: 'custom', scored: true, scope: 'module-mikro' },
  { id: 'p04', type: 'practice', template: 'NumInputScreen', scored: true, scope: 'module-mikro' },
  { id: 'p05', type: 'practice', template: 'missing-digit', scored: true, scope: 'module-mikro' },
  { id: 'p06', type: 'practice', template: 'NumInputScreen', scored: true, scope: 'module-mikro' },
  { id: 'p07', type: 'practice', template: 'ordering', scored: true, scope: 'module-mikro' },
  { id: 'p08', type: 'practice', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 'p09', type: 'practice', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 'p10', type: 'practice', template: 'MCScreen', scored: true, scope: 'final' },
];

function Visual({ task, hintLevel, solved, lang }) {
  const neutralFocus = Array.isArray(task.neutralFocus) ? task.neutralFocus : [task.neutralFocus];
  const rows = solved ? task.visualRows : task.neutralRows;
  return (
    <div className={`g4p-visual ${hintLevel >= 2 ? 'is-hint' : ''}`}>
      <pre className="g4p-figure">{tx(task.figure, lang)}</pre>
      {task.markers && <div className="g4p-markers" aria-hidden="true">{Array.from({ length: task.markers }, (_, i) => <span key={i} />)}</div>}
      {task.grid && <div className="g4p-grid-wrap" role="img" aria-label={tx(task.grid.label, lang)}><div className="g4p-dot-grid" style={{ gridTemplateColumns: `repeat(${task.grid.cols}, 10px)` }}>{Array.from({ length: task.grid.rows * task.grid.cols }, (_, i) => <span key={i} />)}</div><b>{tx(task.grid.label, lang)}</b></div>}
      {task.remainderMeter && <div className="g4p-remainder-meter" role="img" aria-label={`${tx(task.remainderMeter.label, lang)}: 0 ≤ r < ${task.remainderMeter.limit}`}><div className="g4p-meter-track"><span /></div><small>0 ≤ r &lt; {task.remainderMeter.limit}</small></div>}
      {task.estimateScale && <div className="g4p-estimate-scale" role="img" aria-label={`${task.estimateScale.from}, ${task.estimateScale.marker}, ${task.estimateScale.to}`}><span>{task.estimateScale.from}</span><div><i /></div><b>{task.estimateScale.marker}</b><span>{task.estimateScale.to}</span></div>}
      {rows && <div className={`g4p-model-rows ${solved ? 'is-solved' : 'is-neutral'}`} aria-live="polite">{rows.map((row, rowIndex) => (
        <span key={`${task.id}-${solved ? 'exact' : 'neutral'}-${rowIndex}`} style={solved ? { animationDelay: `${rowIndex * 45}ms` } : undefined} className={`${!solved && hintLevel >= 2 && neutralFocus.includes(rowIndex) ? 'is-focus' : ''} ${solved && task.highlight && tx(row, lang).includes(tx(task.highlight, lang)) ? 'is-focus' : ''}`}>{tx(row, lang)}</span>
      ))}</div>}
    </div>
  );
}

function NumPad({ value, onChange, max, disabled, lang }) {
  return (
    <div className="g4p-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}>
      <output className="g4p-pad-display" aria-live="polite">{value ? grouped(value) : '—'}</output>
      <div className="g4p-pad-keys">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
          <button key={number} type="button" disabled={disabled} onClick={() => onChange(value.length >= max ? value : `${value}${number}`)}>{number}</button>
        ))}
        <button type="button" className="is-delete" disabled={disabled} aria-label={tx(UI.clear, lang)} onClick={() => onChange(value.slice(0, -1))}>⌫</button>
      </div>
    </div>
  );
}

function AssignBoard({ task, cards, placed, setPlaced, activeSlot, setActiveSlot, checked, solved, lang }) {
  const activateSlot = (slotId) => {
    if (solved) return;
    setPlaced((old) => { const next = { ...old }; delete next[slotId]; return next; });
    setActiveSlot(slotId);
  };
  const chooseCard = (cardId) => {
    if (!activeSlot || solved) return;
    setPlaced((old) => {
      const next = { ...old };
      Object.keys(next).forEach((slotId) => { if (next[slotId] === cardId) delete next[slotId]; });
      next[activeSlot] = cardId;
      return next;
    });
  };
  return (
    <div className="g4p-assign">
      <p className="g4p-note">{tx(UI.slotHint, lang)}</p>
      <div className="g4p-slots">{task.slots.map((slot) => {
        const card = task.cards.find((item) => item.id === placed[slot.id]);
        const wrong = checked && placed[slot.id] !== slot.correct;
        return <button key={slot.id} type="button" className={`${activeSlot === slot.id ? 'is-active' : ''} ${checked ? (wrong ? 'is-no' : 'is-ok') : ''}`} aria-pressed={activeSlot === slot.id} disabled={solved} onClick={() => activateSlot(slot.id)}><small>{tx(slot.label, lang)}</small><b>{card ? tx(card.text, lang) : '—'}</b></button>;
      })}</div>
      <div className="g4p-cards">{cards.map((card) => {
        const used = Object.values(placed).includes(card.id);
        return <button key={card.id} type="button" className={used ? 'is-used' : ''} aria-pressed={used} disabled={solved || !activeSlot || used} onClick={() => chooseCard(card.id)}>{tx(card.text, lang)}</button>;
      })}</div>
    </div>
  );
}

function Feedback({ task, solved, attempts, wrongText, lang, feedbackRef }) {
  const stagedText = solved
    ? task.correctText
    : attempts === 1
      ? (wrongText ?? task.hints[0])
      : task.hints[Math.min(attempts - 1, 2)];
  return (
    <div ref={feedbackRef} className={`g4p-feedback ${solved ? 'is-ok' : 'is-no'}`} role="status" aria-live="polite" aria-atomic="true">
      <p>{!solved && <b>{tx(UI.hint, lang)}. </b>}{tx(stagedText, lang)}</p>
      {solved && <p className="g4p-rule"><b>{tx(UI.rule, lang)}.</b> {tx(task.rule, lang)}</p>}
    </div>
  );
}

// `platform` berilganda tugma qatori chizilmaydi: uni LMS o'zi beradi va
// tekshiruvni `registerCheck` orqali chaqiradi (LMS kontrakti).
function Task({ task, taskIndex, lang, onSolved ,
  platform = false, mode, onReady, registerCheck, onSubmit, playCorrect, playWrong,
}) {
  const isChoice = task.kind === 'mc' || task.kind === 'digit' || task.kind === 'missing';
  const isAssign = task.kind === 'slots' || task.kind === 'order';
  // Xato javobdan keyin variantlar qayta aralashadi (metodist qarori 2026-08-21).
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- wrongRound ataylab yangi tartib beradi
  const options = useMemo(() => isChoice ? shuffle(task.options) : [], [isChoice, task, wrongRound]);
  const cards = useMemo(() => isAssign ? shuffle(task.cards) : [], [isAssign, task]);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [placed, setPlaced] = useState({});
  const [activeSlot, setActiveSlot] = useState(isAssign ? task.slots[0].id : null);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const advancedRef = useRef(false);
  const checkingRef = useRef(false);
  const feedbackRef = useRef(null);

  const isCorrect = isChoice
    ? picked?.correct === true
    : task.kind === 'numpad'
      ? typed === task.answer
      : task.slots.every((slot) => placed[slot.id] === slot.correct);
  const canCheck = isChoice
    ? picked !== null
    : task.kind === 'numpad'
      ? typed.length > 0
      : task.slots.every((slot) => placed[slot.id]);
  const wrongText = isChoice ? picked?.wrong : task.kind === 'numpad' ? (task.wrongByValue?.[typed] ?? task.wrongText) : task.wrongText;

  useEffect(() => {
    if (!checked || !feedbackRef.current) return undefined;
    let timer;
    const first = requestAnimationFrame(() => requestAnimationFrame(() => {
      timer = setTimeout(() => {
        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        feedbackRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
      }, 120);
    }));
    return () => { cancelAnimationFrame(first); clearTimeout(timer); };
  }, [checked, attempts]);

  const clearFeedback = () => {
    checkingRef.current = false;
    if (!solved) setChecked(false);
  };
  const check = () => {
    if (!canCheck || checked || solved || checkingRef.current) return;
    checkingRef.current = true;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setChecked(true);
    if (isCorrect) setSolved(true); else setWrongRound((old) => old + 1);
  };
  const answerDetails = () => {
    if (isChoice) return {
      options: options.map((option) => tx(option.text, lang)),
      correctIndex: options.findIndex((option) => option.correct),
      correctAnswer: tx(options.find((option) => option.correct)?.text, lang),
      studentAnswerIndex: picked,
      studentAnswer: tx(picked?.text, lang),
    };
    if (task.kind === 'numpad') return { options: null, correctIndex: null, correctAnswer: task.answer, studentAnswerIndex: null, studentAnswer: typed };
    return {
      options: cards.map((card) => tx(card.text, lang)), correctIndex: null,
      correctAnswer: tx(task.correctAnswer, lang), studentAnswerIndex: null,
      studentAnswer: task.slots.map((slot) => tx(task.cards.find((card) => card.id === placed[slot.id])?.text, lang)).join(' · '),
    };
  };
  const advance = () => {
    if (!solved || advancedRef.current) return;
    advancedRef.current = true;
    onSolved({
      stage: taskIndex === TASKS.length - 1 ? 'final' : 'module-mikro', screenIdx: taskIndex, taskId: task.id, kind: task.kind, level: task.level,
      skillTag: task.skillTag, question: tx(task.prompt, lang), ...answerDetails(), correct: true,
      attempts, firstTryCorrect: attempts === 1,
    });
  };

  // --- LMS platforma kontrakti ------------------------------------------
  // Mexanikaga tegilmaydi: natija mavjud holatlardan o'qiladi.
  useEffect(() => { onReady?.(Boolean(canCheck) && !solved && mode !== 'review'); },
    [canCheck, solved, mode, onReady]);
  const checkRef = useRef(check);
  useEffect(() => { checkRef.current = check; });
  useEffect(() => { registerCheck?.(() => checkRef.current?.()); }, [registerCheck]);
  const reportedRef = useRef(-1);
  useEffect(() => {
    if (!checked) return;
    if (reportedRef.current === attempts) return;
    reportedRef.current = attempts;
    (solved ? playCorrect : playWrong)?.();
    onSubmit?.({
      questionText: typeof task.prompt === 'object' ? task.prompt.uz : String(task.prompt ?? ''),
      correct: Boolean(solved),
      meta: { taskId: task.id, kind: task.kind, attempts: attempts },
    });
  }, [attempts, checked, solved, onSubmit, playCorrect, playWrong, task]);
  // ----------------------------------------------------------------------
  return (
    <section className="g4p-task" aria-labelledby={`g4p-task-${task.id}`}>
      <p className={`g4p-eyebrow is-${task.level}`}><span>{tx(UI.levels[task.level], lang)}</span> · {tx(UI.task, lang)} {task.id}</p>
      <p className="g4p-setup">{tx(task.setup, lang)}</p>
      <Visual task={task} hintLevel={checked && !solved ? attempts : 0} solved={solved} lang={lang} />
      <h1 id={`g4p-task-${task.id}`} className="g4p-question">{tx(task.prompt, lang)}</h1>

      {isChoice && <div className={`g4p-options ${task.kind === 'digit' || task.layout === 'digits' ? 'is-digits' : ''}`}>{options.map((option, index) => (
        <button key={option.id} type="button" className={`${picked === option ? 'is-selected' : ''} ${checked && picked === option ? (option.correct ? 'is-ok' : 'is-no') : ''}`} aria-pressed={picked === option} disabled={solved} onClick={() => { setPicked(option); clearFeedback(); }}><span className="g4p-letter">{'ABCD'[index]}</span><span>{tx(option.text, lang)}</span></button>
      ))}</div>}
      {task.kind === 'numpad' && <NumPad value={typed} max={task.maxLen} disabled={solved} lang={lang} onChange={(value) => { setTyped(value); clearFeedback(); }} />}
      {isAssign && <AssignBoard task={task} cards={cards} placed={placed} setPlaced={(updater) => { setPlaced(updater); clearFeedback(); }} activeSlot={activeSlot} setActiveSlot={(slot) => { setActiveSlot(slot); clearFeedback(); }} checked={checked} solved={solved} lang={lang} />}

      {checked && <Feedback task={task} solved={solved} attempts={attempts} wrongText={wrongText} lang={lang} feedbackRef={feedbackRef} />}
      {!platform && <div className="g4p-actions">
        {!solved && <button type="button" className="g4p-btn" disabled={!canCheck || checked} onClick={check}>{tx(UI.check, lang)}</button>}
        {checked && !solved && <button type="button" className="g4p-btn is-ghost" onClick={clearFeedback}>{tx(UI.retry, lang)}</button>}
        {solved && <button type="button" className="g4p-btn is-ready" onClick={advance}>{tx(taskIndex === TASKS.length - 1 ? UI.finish : UI.next, lang)}</button>}
      </div>}
    </section>
  );
}

export default function Grade4Dars12Practice({ lang: langProp, onFinished }) {
  const normalizedLang = normalizeLang(langProp);
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = preview ? previewLang : normalizedLang;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [firstTry, setFirstTry] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const startTimeRef = useRef(0);
  const finishedRef = useRef(false);
  const task = TASKS[index];
  const progress = showResult ? 100 : Math.round((index / TASKS.length) * 100);
  const attemptsTotal = answers.reduce((sum, answer) => sum + answer.attempts, 0);

  useEffect(() => { if (!startTimeRef.current) startTimeRef.current = Date.now(); }, []);

  const onSolved = (answer) => {
    const nextAnswers = [...answers];
    nextAnswers[index] = answer;
    const nextFirstTry = firstTry + (answer.firstTryCorrect ? 1 : 0);
    setAnswers(nextAnswers);
    setFirstTry(nextFirstTry);
    if (index !== TASKS.length - 1) { setIndex((old) => old + 1); return; }
    setShowResult(true);
    if (finishedRef.current) return;
    finishedRef.current = true;
    const scorePercent = Math.round((nextFirstTry / TASKS.length) * 100);
    const levelBreakdown = ['green', 'yellow', 'red'].reduce((result, level) => ({
      ...result,
      [level]: { total: TASKS.filter((item) => item.level === level).length, firstTry: nextAnswers.filter((item) => item.level === level && item.firstTryCorrect).length },
    }), {});
    onFinished?.({
      lessonId: LESSON_META.lessonId, lessonTitle: tx(LESSON_META.lessonTitle, lang), lessonTitleLocalized: LESSON_META.lessonTitle,
      activityType: 'practice', completed: true, durationSec: startTimeRef.current ? Math.max(0, Math.round((Date.now() - startTimeRef.current) / 1000)) : 0,
      totalQuestions: TASKS.length, answeredQuestions: TASKS.length, correctAnswers: nextFirstTry, firstTryCorrect: nextFirstTry,
      scorePercent, finalScore: nextFirstTry, finalTotal: TASKS.length, passed: scorePercent >= 70,
      firstTryStats: { correct: nextFirstTry, total: TASKS.length, percent: scorePercent },
      attemptsTotal: nextAnswers.reduce((sum, item) => sum + item.attempts, 0), skillTags: LESSON_META.skillTags,
      levelBreakdown, lessonMeta: LESSON_META, screenMeta: SCREEN_META, answers: nextAnswers,
    });
  };
  const restart = () => {
    finishedRef.current = false;
    startTimeRef.current = Date.now();
    setIndex(0); setAnswers([]); setFirstTry(0); setShowResult(false);
  };

  return (
    <div className={`g4p-root ${preview ? 'is-preview' : ''}`}>
      <style>{STYLES}</style>
      {preview && <div className="g4p-lang" role="group" aria-label={tx({ uz: "Ko'rib chiqish tili", ru: 'Язык предпросмотра', en: 'Preview language' }, lang)}>{SUPPORTED_LANGS.map((code) => <button key={code} type="button" className={lang === code ? 'is-active' : ''} aria-pressed={lang === code} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}
      <header className="g4p-head">
        <div className="g4p-progress" role="progressbar" aria-label={tx(LESSON.title, lang)} aria-valuemin="0" aria-valuemax="10" aria-valuenow={showResult ? 10 : index}><span style={{ width: `${progress}%` }} /></div>
        <div className="g4p-head-row"><span className="g4p-title">{tx(LESSON.title, lang)}</span><span className="g4p-counter">{showResult ? 10 : index + 1} / 10</span></div>
      </header>
      <main className="g4p-main">
        {showResult ? <section className="g4p-result" aria-live="polite">
          <p className="g4p-result-kicker">{tx(UI.done, lang)}</p>
          <h1>{firstTry} / 10</h1>
          <p>{tx(UI.firstTry, lang)}</p>
          <div className="g4p-stat"><span>{tx(UI.attempts, lang)}</span><b>{attemptsTotal}</b></div>
          <p className="g4p-note">{tx(UI.neutral, lang)}</p>
          <div className="g4p-actions is-center">
            <button type="button" className="g4p-btn is-ghost" onClick={restart}>{tx(UI.restart, lang)}</button>
          </div>
        </section> : <Task key={task.id} task={task} taskIndex={index} lang={lang} onSolved={onSolved} />}
      </main>
    </div>
  );
}

const STYLES = `
.g4p-root{position:relative;min-height:100dvh;overflow-x:clip;padding:0 0 24px;background:${T.bg};color:${T.ink};font-family:'Manrope',system-ui,sans-serif}.g4p-root *,.g4p-root *::before,.g4p-root *::after{box-sizing:border-box}.g4p-root h1,.g4p-root h2,.g4p-root p{margin:0}.g4p-root button{transition:background-color .18s ease,color .18s ease,box-shadow .18s ease,transform .18s ease,opacity .18s ease}.g4p-root button:focus-visible{outline:3px solid rgba(22,143,163,.45);outline-offset:3px}
.g4p-lang{position:absolute;z-index:4;top:9px;right:9px;display:flex;gap:3px;padding:3px;border-radius:999px;background:${T.paper};box-shadow:0 7px 20px -13px rgba(${T.shadowBase},.55)}.g4p-lang button{min-width:44px;min-height:44px;padding:8px 11px;border:0;border-radius:999px;background:transparent;color:${T.ink2};font:800 12px 'Manrope',sans-serif;cursor:pointer}.g4p-lang button.is-active{background:${T.accent};color:#fff}
.g4p-head{max-width:936px;margin:0 auto;padding:18px clamp(12px,4vw,28px) 8px}.is-preview .g4p-head{padding-top:64px}.g4p-progress{height:6px;overflow:hidden;border-radius:999px;background:rgba(23,59,82,.12)}.g4p-progress span{display:block;height:100%;border-radius:inherit;background:${T.accent};box-shadow:0 0 12px rgba(255,91,53,.42);transition:width .4s ease}.g4p-head-row{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-top:9px}.g4p-title{min-width:0;font:600 clamp(15px,2.2vw,19px)/1.25 'Source Serif 4',Georgia,serif}.g4p-counter{flex:0 0 auto;color:${T.ink3};font:700 13px 'JetBrains Mono',monospace}
.g4p-main{width:100%;max-width:936px;margin:0 auto;padding:5px clamp(12px,4vw,28px)}.g4p-task{display:flex;flex-direction:column;gap:12px}.g4p-eyebrow{font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.g4p-eyebrow.is-green{color:${T.success}}.g4p-eyebrow.is-yellow{color:${T.warn}}.g4p-eyebrow.is-red{color:${T.accent}}.g4p-setup{color:${T.ink2};font-size:clamp(14px,2vw,16px);line-height:1.48}.g4p-question{font:600 clamp(19px,2.8vw,25px)/1.25 'Source Serif 4',Georgia,serif}.g4p-note{color:${T.ink3};font-size:13px;line-height:1.4}
.g4p-visual{display:flex;flex-direction:column;align-items:center;gap:10px;min-width:0;padding:14px;border-radius:18px;background:${T.paper};box-shadow:0 12px 30px -24px rgba(${T.shadowBase},.58)}.g4p-figure{max-width:100%;margin:0;overflow-wrap:anywhere;white-space:pre-wrap;text-align:center;color:${T.navy};font:800 clamp(21px,5vw,36px)/1.3 'JetBrains Mono',monospace}.g4p-markers{display:flex;max-width:100%;flex-wrap:wrap;justify-content:center;gap:7px}.g4p-markers span{width:18px;height:18px;border-radius:6px;background:${T.cyanSoft};box-shadow:inset 0 0 0 2px rgba(22,143,163,.28)}.g4p-grid-wrap{display:flex;max-width:100%;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap}.g4p-dot-grid{display:grid;gap:3px;padding:7px;border-radius:10px;background:${T.cyanSoft};box-shadow:inset 0 0 0 2px rgba(22,143,163,.18)}.g4p-dot-grid span{width:10px;height:10px;border-radius:3px;background:${T.cyan}}.g4p-grid-wrap b{color:${T.cyan};font:800 12px/1.3 'Manrope',sans-serif}.g4p-model-rows{display:flex;max-width:100%;flex-wrap:wrap;justify-content:center;gap:7px}.g4p-model-rows span{padding:7px 10px;border-radius:9px;background:${T.cyanSoft};color:${T.cyan};font:700 13px 'JetBrains Mono',monospace;transition:background-color .32s ease,color .32s ease,box-shadow .32s ease,transform .32s ease}.g4p-visual.is-hint .g4p-model-rows.is-neutral .is-focus,.g4p-model-rows.is-solved .is-focus{background:${T.accentSoft};color:${T.accent};box-shadow:0 0 0 3px rgba(255,91,53,.18)}.g4p-model-rows.is-solved span{animation:g4p-math-reveal .32s ease both}.g4p-remainder-meter{width:min(340px,100%);text-align:center}.g4p-meter-track{position:relative;height:12px;overflow:hidden;border-radius:999px;background:linear-gradient(90deg,${T.cyanSoft},${T.accentSoft})}.g4p-meter-track span{position:absolute;inset:3px;border-radius:999px;background:repeating-linear-gradient(90deg,rgba(22,143,163,.42) 0 8px,transparent 8px 14px)}.g4p-remainder-meter small{display:block;margin-top:4px;color:${T.ink3};font:700 11px 'JetBrains Mono',monospace}.g4p-estimate-scale{display:grid;width:min(360px,100%);grid-template-columns:auto minmax(100px,1fr) auto;align-items:center;gap:4px 8px;color:${T.ink3};font:700 11px 'JetBrains Mono',monospace}.g4p-estimate-scale>div{position:relative;grid-column:2;grid-row:1;height:8px;border-radius:999px;background:${T.cyanSoft}}.g4p-estimate-scale i{position:absolute;top:-4px;left:40%;width:4px;height:16px;border-radius:999px;background:${T.accent}}.g4p-estimate-scale>span:first-child{grid-column:1;grid-row:1}.g4p-estimate-scale>span:last-child{grid-column:3;grid-row:1}.g4p-estimate-scale b{grid-column:2;grid-row:2;text-align:center;color:${T.accent};font:800 11px 'JetBrains Mono',monospace}@keyframes g4p-math-reveal{from{opacity:.25;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
.g4p-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.g4p-options button{display:flex;min-width:0;min-height:56px;align-items:center;gap:9px;padding:10px 12px;border:0;border-radius:14px;background:${T.paper};color:${T.ink};text-align:left;font:700 clamp(13px,1.8vw,15px)/1.35 'Manrope',sans-serif;box-shadow:0 8px 22px -18px rgba(${T.shadowBase},.72);cursor:pointer}.g4p-options button:hover:not(:disabled){transform:translateY(-1px)}.g4p-options button.is-selected{background:${T.accentSoft};box-shadow:0 0 0 2px rgba(255,91,53,.48)}.g4p-options button.is-ok{background:${T.successSoft};color:${T.success};box-shadow:0 0 0 2px rgba(34,122,83,.3)}.g4p-options button.is-no{background:${T.warnSoft};color:${T.warn};box-shadow:0 0 0 2px rgba(169,111,19,.3)}.g4p-letter{display:inline-flex;flex:0 0 30px;width:30px;height:30px;align-items:center;justify-content:center;border-radius:9px;background:${T.cyanSoft};color:${T.cyan};font:800 11px 'JetBrains Mono',monospace}.g4p-options.is-digits button{justify-content:center;text-align:center;font:800 23px 'JetBrains Mono',monospace}
.g4p-pad{display:flex;width:min(250px,100%);flex-direction:column;align-items:center;gap:9px;margin:0 auto;padding:12px;border-radius:18px;background:#E5EBEE}.g4p-pad-display{display:flex;width:100%;min-height:52px;align-items:center;justify-content:center;border-radius:13px;background:${T.paper};color:${T.navy};font:800 25px 'JetBrains Mono',monospace;box-shadow:inset 0 0 0 2px rgba(255,91,53,.55)}.g4p-pad-keys{display:grid;width:100%;grid-template-columns:repeat(3,1fr);gap:7px}.g4p-pad-keys button{min-width:44px;min-height:44px;border:0;border-radius:11px;background:${T.paper};color:${T.navy};font:800 20px 'JetBrains Mono',monospace;box-shadow:0 5px 12px -10px rgba(${T.shadowBase},.7);cursor:pointer}.g4p-pad-keys .is-delete{background:${T.accentSoft};color:${T.accent}}
.g4p-assign{display:flex;flex-direction:column;gap:9px}.g4p-slots{display:grid;grid-template-columns:repeat(auto-fit,minmax(112px,1fr));gap:8px}.g4p-slots button{display:flex;min-width:0;min-height:64px;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:7px;border:0;border-radius:13px;background:${T.paper};color:${T.ink2};box-shadow:inset 0 0 0 2px rgba(23,59,82,.1);cursor:pointer}.g4p-slots button.is-active{background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.55)}.g4p-slots button.is-ok{background:${T.successSoft}}.g4p-slots button.is-no{background:${T.warnSoft}}.g4p-slots small{font:800 11px 'Manrope',sans-serif}.g4p-slots b{max-width:100%;overflow-wrap:anywhere;color:${T.navy};font:800 15px 'JetBrains Mono',monospace}.g4p-cards{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}.g4p-cards button{min-width:62px;min-height:46px;padding:8px 12px;border:0;border-radius:12px;background:${T.paper};color:${T.navy};font:800 14px 'Manrope',sans-serif;box-shadow:0 7px 18px -15px rgba(${T.shadowBase},.7);cursor:pointer}.g4p-cards button.is-used{background:${T.cyanSoft};color:${T.cyan};opacity:.55}
.g4p-feedback{padding:13px 15px;border-radius:14px;line-height:1.48}.g4p-feedback.is-ok{background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}.g4p-feedback.is-no{background:${T.warnSoft};box-shadow:inset 4px 0 0 ${T.warn}}.g4p-feedback p{font:500 clamp(14px,2vw,16px)/1.48 'Source Serif 4',Georgia,serif}.g4p-hint,.g4p-rule{margin-top:7px!important;color:${T.ink2}}.g4p-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:9px}.g4p-actions.is-center{justify-content:center}.g4p-btn{min-width:108px;min-height:46px;padding:10px 18px;border:0;border-radius:13px;background:${T.paper};color:${T.accent};font:800 14px 'Manrope',sans-serif;box-shadow:0 9px 22px -14px rgba(255,91,53,.52);cursor:pointer}.g4p-btn.is-ready{background:${T.accent};color:#fff}.g4p-btn.is-ghost{background:transparent;color:${T.ink2};box-shadow:none}.g4p-btn:disabled{opacity:.42;cursor:not-allowed;transform:none}
.g4p-result{display:flex;min-height:430px;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center;border-radius:22px;background:${T.paper};box-shadow:0 18px 44px -34px rgba(${T.shadowBase},.68)}.g4p-result-kicker{color:${T.accent};font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.g4p-result h1{color:${T.success};font:800 clamp(44px,9vw,68px) 'JetBrains Mono',monospace}.g4p-result>p:not(.g4p-result-kicker):not(.g4p-note){color:${T.ink2}}.g4p-stat{display:flex;width:min(330px,100%);align-items:center;justify-content:space-between;padding:12px 14px;border-radius:13px;background:${T.cyanSoft};color:${T.cyan}}.g4p-stat b{font:800 20px 'JetBrains Mono',monospace}
@media(max-width:560px){.g4p-options{grid-template-columns:1fr}.g4p-slots{grid-template-columns:repeat(2,minmax(0,1fr))}.g4p-setup{line-height:1.4}.g4p-visual{padding:12px}.g4p-result{min-height:360px;padding:18px 12px}}@media(max-width:380px){.g4p-slots{grid-template-columns:1fr}.g4p-head-row{align-items:flex-start}.g4p-title{font-size:14px}}
@media(prefers-reduced-motion:reduce){.g4p-root *,.g4p-root *::before,.g4p-root *::after{animation:none!important;scroll-behavior:auto!important;transition:none!important}.g4p-options button:hover:not(:disabled){transform:none}}

/* PRACTICE-FIX boshlanishi — metodist qarori 2026-08-21.
   1) Tekshirish tugmasi o'ngda (2-dars etaloni).
   2) Moslashtirishda ikki tomondagi kartochkalar bir xil o'lchamda: ustun grid
      bo'ladi va qatorlari 1fr, shuning uchun juftlar qator bo'yicha tekislanadi.
   Bu blok har darsda takrorlanadi ATAYLAB: LMS avtonom fayl talab qiladi. */
.p4-actions, .g4p-actions { justify-content: flex-end; }
.p4-match-cols, .g4p-match-cols { align-items: stretch; }
.p4-match-col, .g4p-match-col { display: grid; grid-auto-rows: 1fr; align-content: stretch; }
/* PRACTICE-FIX tugashi */
/* NOSCROLL boshlanishi — metodist qarori 2026-08-21.
   Past ekranda (1280x720 noutbuk, 360x640 telefon) topshiriq skrollga
   ketmasligi kerak: bola «Tekshirish» tugmasini ko'rmasa, uni bosmaydi.
   Faqat BO'SH JOY qisqaradi — bosiladigan maydon 44 px dan kichraymaydi
   (MOBIL_DESKTOP_MOSLASH.md). Blok har darsda takrorlanadi ATAYLAB: LMS
   avtonom fayl talab qiladi. */
@media (max-height:820px){
.p4-root,.g4p-root{padding-bottom:12px}
.p4-head,.g4p-head{padding-top:52px;padding-bottom:4px}
.p4-task,.g4p-task{gap:8px}
.p4-eyebrow,.g4p-eyebrow{margin-top:0}
.p4-ask,.g4p-ask{margin-top:0}
.p4-note,.g4p-note{margin-top:4px}
.p4-actions,.g4p-actions{margin-top:0}
.p4-figure{padding-top:8px;padding-bottom:8px}
.p4-pad,.g4p-pad{padding:8px;gap:6px}
.p4-pad-display,.g4p-pad-display{min-height:44px}
.p4-pad-keys,.g4p-pad-keys{gap:5px}
.p4-options,.g4p-options{gap:7px}
.p4-match-cols,.g4p-match-cols{gap:8px;margin-top:4px}
.p4-match-col,.g4p-match-col{gap:6px}
.p4-header,.g4p-header{margin-bottom:4px}
.p4-header h1,.g4p-header h1{margin-top:2px}
.p4-task-top{margin-bottom:2px}
.p4-setup,.g4p-setup{line-height:1.4}
.p4-match-item,.g4p-match-item{min-height:44px;padding-top:5px;padding-bottom:5px}
.p4-match button,.g4p-match button{min-height:44px;padding-top:5px;padding-bottom:5px}
.p4-fb,.p4-feedback,.g4p-feedback{padding-top:9px;padding-bottom:9px}
.p4-rule,.g4p-rule{margin-top:6px}
.p4-cells,.p4-grid{gap:4px}
.p4-card-bank,.p4-order-slots,.p4-slot-list,.p4-sort-pool{gap:6px}
}
@media (max-height:760px){
.p4-head,.g4p-head{padding-bottom:0}
.p4-main,.g4p-main{padding-top:0;padding-bottom:0}
.p4-root,.g4p-root{padding-bottom:8px}
.p4-task,.g4p-task{gap:5px}
.p4-figure{padding-top:4px;padding-bottom:4px}
.p4-eyebrow,.g4p-eyebrow{font-size:10px}
.p4-setup,.g4p-setup{font-size:clamp(13px,1.8vw,14px)}
.p4-ask,.g4p-ask{font-size:clamp(15px,2.2vw,18px)}
.p4-pad,.g4p-pad{padding:4px;gap:4px}
.p4-pad-keys,.g4p-pad-keys{gap:4px}
.p4-pad-display,.g4p-pad-display{min-height:40px}
.p4-visual,.g4p-visual{padding-top:8px;padding-bottom:8px;min-height:0}
.p4-svg,.g4p-svg{max-height:96px}
}
@media (max-height:700px){
.p4-head,.g4p-head{padding-top:52px;padding-bottom:2px}
.p4-task,.g4p-task{gap:6px}
.p4-figure{padding-top:6px;padding-bottom:6px}
.p4-bignum,.g4p-bignum{font-size:clamp(20px,4.4vw,30px)}
.p4-pad,.g4p-pad{padding:6px;gap:5px}
.p4-match-col,.g4p-match-col{gap:5px}
}
/* NOSCROLL tugashi */
`;
