// ============================================================================
// 4-SINF · 10-DARS AMALIYOTI
// Ko'p xonali sonni ikki xonali songa ko'paytirish
// Dars01Practice / Dars02Practice kontrakti: 10 topshiriq, 5 mexanika,
// 2 yashil + 5 sariq + 3 qizil, UZ/RU/EN, ovozsiz, birinchi tekshiruv bali.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

const T = {
  bg: '#F5F5F0', paper: '#FFFFFF', ink: '#12212C', ink2: '#50616D', ink3: '#87949D',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', success: '#227A53', successSoft: '#E7F3EC', warn: '#A96F13', warnSoft: '#FFF5D9',
};

const LESSON_META = {
  lessonId: 'num-4-10-practice',
  lessonTitle: { uz: "10-dars. Amaliyot: ikki xonali songa ko'paytirish", ru: 'Урок 10. Практика: умножение на двузначное число', en: 'Lesson 10. Practice: multiplying by a two-digit number' },
};

const UI = {
  task: { ru: 'Задание', uz: 'Topshiriq', en: 'Task' },
  level: {
    green: { ru: 'Базовое', uz: 'Asosiy', en: 'Core' },
    yellow: { ru: 'Применение', uz: "Qo'llash", en: 'Application' },
    red: { ru: 'Перенос', uz: "Ko'chirish", en: 'Transfer' },
  },
  check: { ru: 'Проверить', uz: 'Tekshirish', en: 'Check' },
  retry: { ru: 'Попробовать ещё', uz: "Yana urinib ko'ring", en: 'Try again' },
  next: { ru: 'Следующее', uz: 'Keyingisi', en: 'Next' },
  finish: { ru: 'Завершить', uz: 'Yakunlash', en: 'Finish' },
  again: { ru: 'Пройти заново', uz: 'Qaytadan', en: 'Start again' },
  done: { ru: 'Практика пройдена', uz: 'Amaliyot tugadi', en: 'Practice complete' },
  ofTen: { ru: 'из 10', uz: '10 dan', en: 'out of 10' },
  rule: { ru: 'Запомните', uz: 'Eslab qoling', en: 'Remember' },
  typeAnswer: { ru: 'Введите числовой ответ', uz: 'Sonli javobni kiriting', en: 'Enter a numerical answer' },
  clear: { ru: 'Стереть', uz: "O'chirish", en: 'Clear' },
  matchHint: { ru: 'Сначала выберите выражение слева, затем результат справа.', uz: "Avval chapdagi ifodani, keyin o'ngdagi natijani tanlang.", en: 'First select an expression on the left, then its result on the right.' },
  slotHint: { ru: 'Выберите строку, затем подходящую карточку.', uz: "Avval qatorni, keyin mos kartani tanlang.", en: 'Select a row, then choose the matching card.' },
  placeHint: { ru: 'Выберите положение строки.', uz: 'Qatorning joylashuvini tanlang.', en: 'Choose the position of the row.' },
  firstTryNote: { ru: 'Столько заданий решено при первой проверке.', uz: "Birinchi tekshiruvda to'g'ri bajarilgan topshiriqlar soni.", en: 'This many tasks were solved correctly on the first check.' },
};

const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';
const tx = (value, lang) => (value && typeof value === 'object' ? (value[lang] ?? '') : value);
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
    id: '01', level: 'green', kind: 'mc', figure: '312 × 46',
    setup: { ru: 'Сначала разложите двузначный множитель на десятки и единицы.', uz: "Avval ikki xonali ko'paytiruvchini o'nlik va birlikka ajrating.", en: 'First, split the two-digit factor into tens and ones.' },
    prompt: { ru: 'Какое разложение верно?', uz: "Qaysi ajratish to'g'ri?", en: 'Which decomposition is correct?' },
    options: [
      { text: { ru: '312 × 40 + 312 × 6', uz: '312 × 40 + 312 × 6', en: '312 × 40 + 312 × 6' }, correct: true },
      { text: { ru: '312 × 4 + 312 × 6', uz: '312 × 4 + 312 × 6', en: '312 × 4 + 312 × 6' }, wrong: { ru: 'Цифра 4 стоит в десятках и означает 40, а не 4.', uz: "4 raqami o'nlar xonasida turib, 4 ni emas, 40 ni bildiradi.", en: 'The digit 4 is in the tens place, so it means 40, not 4.' } },
      { text: { ru: '312 × 400 + 312 × 6', uz: '312 × 400 + 312 × 6', en: '312 × 400 + 312 × 6' }, wrong: { ru: 'Цифра 4 означает четыре десятка, поэтому нужен множитель 40, а не 400.', uz: "4 raqami to'rt o'nlikni bildiradi, shuning uchun 400 emas, 40 kerak.", en: 'The digit 4 means four tens, so the factor must be 40, not 400.' } },
      { text: { ru: 'Только 312 × 6', uz: 'Faqat 312 × 6', en: 'Only 312 × 6' }, wrong: { ru: 'Так учитываются только единицы. Часть 40 тоже должна участвовать.', uz: "Bunda faqat birliklar hisobga olinadi. 40 qismi ham qatnashishi kerak.", en: 'That includes only the ones. The 40 part must be included as well.' } },
    ],
    correctText: { ru: 'Верно. 12 480 + 1 872 = 14 352.', uz: "To'g'ri. 12 480 + 1 872 = 14 352.", en: 'Correct. 12,480 + 1,872 = 14,352.' },
    rule: { ru: 'Двузначный множитель раскладывается на десятки и единицы.', uz: "Ikki xonali ko'paytiruvchi o'nlik va birlikka ajratiladi.", en: 'Split a two-digit factor into tens and ones.' },
  },
  {
    id: '02', level: 'green', kind: 'match', figure: '231 × 42',
    setup: { ru: 'Найдите два неполных произведения.', uz: "Ikkita to'liqsiz ko'paytmani toping.", en: 'Find the two partial products.' },
    prompt: { ru: 'Соедините выражения с результатами.', uz: 'Ifodalarni natijalar bilan moslashtiring.', en: 'Match each expression to its result.' },
    pairs: [
      { id: 'units', left: { ru: '231 × 2', uz: '231 × 2', en: '231 × 2' }, correctRight: 'r462', wrong: { ru: 'Строка единиц не сдвигается. Перемножь 231 и 2 и проверь последнюю цифру.', uz: "Birliklar qatori siljimaydi. 231 ni 2 ga ko'paytirib, oxirgi raqamni tekshiring.", en: 'The ones row is not shifted. Multiply 231 by 2 and check the final digit.' } },
      { id: 'tens', left: { ru: '231 × 40', uz: '231 × 40', en: '231 × 40' }, correctRight: 'r9240', wrong: { ru: 'Сначала найди произведение 231 и 4, затем учти, что 4 обозначает десятки.', uz: "Avval 231 ni 4 ga ko'paytiring, keyin 4 raqami o'nliklarni bildirishini hisobga oling.", en: 'First multiply 231 by 4, then remember that 4 represents tens.' } },
    ],
    right: [
      { id: 'r462', text: { ru: '462', uz: '462', en: '462' } },
      { id: 'r9240', text: { ru: '9 240', uz: '9 240', en: '9,240' } },
      { id: 'r924', text: { ru: '924', uz: '924', en: '924' } },
      { id: 'r4620', text: { ru: '4 620', uz: '4 620', en: '4,620' } },
    ],
    correctText: { ru: 'Верно. 462 + 9 240 = 9 702.', uz: "To'g'ri. 462 + 9 240 = 9 702.", en: 'Correct. 462 + 9,240 = 9,702.' },
    rule: { ru: 'Строка единиц имеет сдвиг 0, строка десятков — сдвиг 1.', uz: "Birliklar qatori 0 xona, o'nliklar qatori 1 xona siljiydi.", en: 'The ones row has no shift; the tens row shifts one place.' },
  },
  {
    id: '03', level: 'yellow', kind: 'place', figure: '684 × 25', raw: '684 × 5 = 3 420',
    setup: { ru: 'Это строка умножения на 5 единиц.', uz: "Bu 5 birlikka ko'paytirish qatori.", en: 'This is the row for multiplying by 5 ones.' },
    prompt: { ru: 'Как разместить строку единиц?', uz: 'Birliklar qatorini qanday joylashtirish kerak?', en: 'How should the ones row be positioned?' },
    choices: [
      { shift: 0, value: '3 420', correct: true },
      { shift: 1, value: '34 200', wrong: { ru: 'Строка единиц не сдвигается. Последний ноль должен остаться под единицами.', uz: "Birliklar qatori siljimaydi. Oxirgi nol birlar xonasi ostida qolishi kerak.", en: 'The ones row is not shifted. The final zero must remain under the ones place.' } },
      { shift: 2, value: '342 000', wrong: { ru: 'Два разряда сдвига относятся к сотням, а здесь множитель — 5 единиц.', uz: "Ikki xona siljishi yuzliklarga tegishli, bu yerda esa ko'paytiruvchi 5 birlik.", en: 'A two-place shift is for hundreds, but this factor is 5 ones.' } },
    ],
    correctText: { ru: 'Верно. 3 420 + 13 680 = 17 100.', uz: "To'g'ri. 3 420 + 13 680 = 17 100.", en: 'Correct. 3,420 + 13,680 = 17,100.' },
    rule: { ru: 'Первая строка начинается под единицами.', uz: 'Birinchi qator birlar xonasi ostidan boshlanadi.', en: 'The first row starts under the ones place.' },
  },
  {
    id: '04', level: 'yellow', kind: 'numpad', figure: '532 × 27', answer: '14364', maxLen: 5,
    setup: { ru: 'Вычислите произведение и сложите две строки.', uz: "Ko'paytmani hisoblab, ikki qatorni qo'shing.", en: 'Calculate the products and add the two rows.' },
    prompt: { ru: 'Какой получился результат?', uz: "Qanday natija hosil bo'ldi?", en: 'What result do you get?' },
    wrongAnswers: {
      3724: { ru: 'Это только произведение на 7 единиц. Добавьте строку умножения на 20.', uz: "Bu faqat 7 birlikka ko'paytma. 20 ga ko'paytirish qatorini ham qo'shing.", en: 'That is only the product by 7 ones. Add the row for multiplying by 20.' },
      10640: { ru: 'Это только строка десятков. Не потеряйте произведение 532 × 7.', uz: "Bu faqat o'nliklar qatori. 532 × 7 ko'paytmani yo'qotmang.", en: 'That is only the tens row. Do not lose the product 532 × 7.' },
    },
    wrongText: { ru: 'Пересчитайте отдельно строки умножения на единицы и десятки, затем выровняйте их по разрядам.', uz: "Birliklar va o'nliklarga ko'paytirish qatorlarini alohida qayta hisoblab, keyin xonalar bo'yicha tekislang.", en: 'Recalculate the ones and tens rows separately, then align them by place value.' },
    correctText: { ru: 'Верно. 3 724 + 10 640 = 14 364.', uz: "To'g'ri. 3 724 + 10 640 = 14 364.", en: 'Correct. 3,724 + 10,640 = 14,364.' },
    rule: { ru: 'Готовые строки складываются разряд под разрядом.', uz: "Tayyor qatorlar xona ostiga xona qilib qo'shiladi.", en: 'Add the completed rows with matching place values aligned.' },
  },
  {
    id: '05', level: 'yellow', kind: 'slots', figure: '264 × 18',
    setup: { ru: 'Разместите две карточки по строкам.', uz: "Ikki kartani qatorlarga joylashtiring.", en: 'Place the two cards in the correct rows.' },
    prompt: { ru: 'Какие неполные произведения нужны?', uz: "Qaysi to'liqsiz ko'paytmalar kerak?", en: 'Which partial products are needed?' },
    slots: [
      { id: 'units', label: { ru: 'Строка единиц', uz: 'Birliklar qatori', en: 'Ones row' }, correct: '2 112', wrong: { ru: 'Строка единиц равна 264 × 8 и не сдвигается.', uz: "Birliklar qatori 264 × 8 ga teng va siljimaydi.", en: 'The ones row is 264 × 8 and is not shifted.' } },
      { id: 'tens', label: { ru: 'Строка десятков', uz: "O'nliklar qatori", en: 'Tens row' }, correct: '2 640', wrong: { ru: 'Цифра 1 означает один десяток. Найди произведение на 1 и сдвинь его на один разряд.', uz: "1 raqami bir o'nlikni bildiradi. 1 ga ko'paytmani topib, uni bir xona siljiting.", en: 'The digit 1 means one ten. Find the product by 1, then shift it one place.' } },
    ],
    cards: ['2 112', '2 640', '264', '21 120'],
    correctText: { ru: 'Верно. 2 112 + 2 640 = 4 752.', uz: "To'g'ri. 2 112 + 2 640 = 4 752.", en: 'Correct. 2,112 + 2,640 = 4,752.' },
    rule: { ru: 'Каждая карточка используется только в одной строке.', uz: 'Har bir karta faqat bitta qatorda ishlatiladi.', en: 'Use each card in only one row.' },
  },
  {
    id: '06', level: 'yellow', kind: 'mc', figure: '146 × 28',
    setup: { ru: 'На каждой из 28 панелей установлено по 146 датчиков.', uz: "28 ta panelning har biriga 146 tadan sensor o'rnatilgan.", en: 'Each of 28 panels has 146 sensors installed.' },
    prompt: { ru: 'Сколько датчиков установлено всего?', uz: "Jami nechta sensor o'rnatilgan?", en: 'How many sensors are installed altogether?' },
    options: [
      { text: { ru: '4 088', uz: '4 088', en: '4,088' }, correct: true },
      { text: { ru: '1 168', uz: '1 168', en: '1,168' }, wrong: { ru: 'Это только 146 × 8. Остались ещё два десятка панелей.', uz: "Bu faqat 146 × 8. Yana ikki o'nlik panel qoldi.", en: 'That is only 146 × 8. There are still two tens of panels to include.' } },
      { text: { ru: '1 460', uz: '1 460', en: '1,460' }, wrong: { ru: 'Так цифра 2 прочитана как две единицы. В числе 28 она означает 20.', uz: "Bunda 2 raqami ikki birlik deb o'qilgan. 28 sonida u 20 ni bildiradi.", en: 'This treats the digit 2 as two ones. In 28, it means 20.' } },
      { text: { ru: '174', uz: '174', en: '174' }, wrong: { ru: 'Сложение 146 и 28 не показывает 28 одинаковых групп.', uz: "146 va 28 ni qo'shish 28 ta teng guruhni ifodalamaydi.", en: 'Adding 146 and 28 does not represent 28 equal groups.' } },
    ],
    correctText: { ru: 'Верно. 1 168 + 2 920 = 4 088 датчиков.', uz: "To'g'ri. 1 168 + 2 920 = 4 088 ta sensor.", en: 'Correct. 1,168 + 2,920 = 4,088 sensors.' },
    rule: { ru: 'В задаче на одинаковые группы количество в группе умножается на число групп.', uz: "Teng guruhlar masalasida guruhdagi miqdor guruhlar soniga ko'paytiriladi.", en: 'In an equal-groups problem, multiply the amount in each group by the number of groups.' },
  },
  {
    id: '07', level: 'yellow', kind: 'match', figure: '347 × 36',
    setup: { ru: 'Сопоставьте две строки с их готовыми значениями.', uz: "Ikki qatorni ularning tayyor qiymatlari bilan moslashtiring.", en: 'Match the two rows to their completed values.' },
    prompt: { ru: 'Какие пары верны?', uz: "Qaysi juftliklar to'g'ri?", en: 'Which pairs are correct?' },
    pairs: [
      { id: 'units', left: { ru: '347 × 6', uz: '347 × 6', en: '347 × 6' }, correctRight: 'r2082', wrong: { ru: 'Это строка единиц: вычисли произведение на 6 без дополнительного сдвига.', uz: "Bu birliklar qatori: 6 ga ko'paytmani qo'shimcha siljitmasdan hisoblang.", en: 'This is the ones row: multiply by 6 without an extra shift.' } },
      { id: 'tens', left: { ru: '347 × 30', uz: '347 × 30', en: '347 × 30' }, correctRight: 'r10410', wrong: { ru: 'Цифра 3 означает 30. Вычисли произведение на 3 и добавь один разряд сдвига.', uz: "3 raqami 30 ni bildiradi. 3 ga ko'paytmani hisoblab, bir xona siljiting.", en: 'The digit 3 means 30. Multiply by 3, then shift the result one place.' } },
    ],
    right: [
      { id: 'r2082', text: { ru: '2 082', uz: '2 082', en: '2,082' } },
      { id: 'r10410', text: { ru: '10 410', uz: '10 410', en: '10,410' } },
      { id: 'r1041', text: { ru: '1 041', uz: '1 041', en: '1,041' } },
      { id: 'r20820', text: { ru: '20 820', uz: '20 820', en: '20,820' } },
    ],
    correctText: { ru: 'Верно. 2 082 + 10 410 = 12 492.', uz: "To'g'ri. 2 082 + 10 410 = 12 492.", en: 'Correct. 2,082 + 10,410 = 12,492.' },
    rule: { ru: 'Строка десятков показывает умножение на 30, а не на 3.', uz: "O'nliklar qatori 3 ga emas, 30 ga ko'paytirishni bildiradi.", en: 'The tens row shows multiplication by 30, not by 3.' },
  },
  {
    id: '08', level: 'red', kind: 'mc', figure: '846 × 50',
    setup: { ru: 'В разряде единиц множителя стоит ноль.', uz: "Ko'paytiruvchining birlar xonasida nol turibdi.", en: 'The ones digit of the factor is zero.' },
    prompt: { ru: 'Какие две строки верны?', uz: "Qaysi ikki qator to'g'ri?", en: 'Which two rows are correct?' },
    options: [
      { text: { ru: '0 и 42 300', uz: '0 va 42 300', en: '0 and 42,300' }, correct: true },
      { text: { ru: '0 и 4 230', uz: '0 va 4 230', en: '0 and 4,230' }, wrong: { ru: '4 230 — это произведение на 5 единиц. Здесь 5 означает 50.', uz: "4 230 besh birlikka ko'paytma. Bu yerda 5 raqami 50 ni bildiradi.", en: '4,230 is the product by 5 ones. Here, the digit 5 means 50.' } },
      { text: { ru: '0 и 423 000', uz: '0 va 423 000', en: '0 and 423,000' }, wrong: { ru: 'Строка десятков сдвигается только на один разряд.', uz: "O'nliklar qatori faqat bir xona siljiydi.", en: 'The tens row shifts by only one place.' } },
      { text: { ru: '846 и 42 300', uz: '846 va 42 300', en: '846 and 42,300' }, wrong: { ru: 'Умножение на ноль даёт 0, а не исходное число 846.', uz: "Nolga ko'paytirish 846 ni emas, 0 ni beradi.", en: 'Multiplying by zero gives 0, not the original number 846.' } },
    ],
    correctText: { ru: 'Верно. 846 × 50 = 42 300.', uz: "To'g'ri. 846 × 50 = 42 300.", en: 'Correct. 846 × 50 = 42,300.' },
    rule: { ru: 'Нулевая строка не меняет сумму, но сохраняет место единиц.', uz: "Nol qatori yig'indini o'zgartirmaydi, lekin birliklar o'rnini saqlaydi.", en: 'The zero row does not change the sum, but it preserves the ones place.' },
  },
  {
    id: '09', level: 'red', kind: 'mc', figure: '317 × 21\n317 + 634 = 951',
    setup: { ru: 'В неверном решении получен ответ 951. Найдите первую ошибку.', uz: "Noto'g'ri yechimda 951 natija olingan. Birinchi xatoni toping.", en: 'An incorrect solution gives 951. Find the first mistake.' },
    prompt: { ru: 'Что нужно исправить?', uz: 'Nimani tuzatish kerak?', en: 'What needs to be corrected?' },
    options: [
      { text: { ru: 'Строку 634 заменить на 6 340', uz: '634 qatorini 6 340 ga almashtirish', en: 'Replace the row 634 with 6,340' }, correct: true },
      { text: { ru: 'Строку 317 заменить на 3 170', uz: '317 qatorini 3 170 ga almashtirish', en: 'Replace the row 317 with 3,170' }, wrong: { ru: '317 — строка единиц: умножение на 1 не требует сдвига.', uz: "317 birliklar qatori: 1 ga ko'paytirishda siljish kerak emas.", en: '317 is the ones row: multiplying by 1 does not require a shift.' } },
      { text: { ru: 'Сложить 317 и 634 ещё раз без сдвига', uz: "317 va 634 ni siljitmasdan yana qo'shish", en: 'Add 317 and 634 again without a shift' }, wrong: { ru: 'Сложение выполнено верно для неверно размещённых строк. Сначала исправьте десятки.', uz: "Noto'g'ri joylashtirilgan qatorlar uchun qo'shish to'g'ri. Avval o'nliklar qatorini tuzating.", en: 'The addition is correct for the wrongly positioned rows. Correct the tens row first.' } },
      { text: { ru: 'Ошибки нет', uz: "Xato yo'q", en: 'There is no mistake' }, wrong: { ru: 'Цифра 2 в числе 21 означает 20, поэтому вторая строка должна быть в десять раз больше.', uz: "21 sonidagi 2 raqami 20 ni bildiradi, shuning uchun ikkinchi qator o'n marta katta bo'lishi kerak.", en: 'The digit 2 in 21 means 20, so the second row must be ten times as large.' } },
    ],
    correctText: { ru: 'Верно. 317 + 6 340 = 6 657.', uz: "To'g'ri. 317 + 6 340 = 6 657.", en: 'Correct. 317 + 6,340 = 6,657.' },
    rule: { ru: 'Сначала проверяйте разряд множителя, затем сложение.', uz: "Avval ko'paytiruvchi raqamining xonasini, keyin qo'shishni tekshiring.", en: "Check the factor's place value first, then check the addition." },
  },
  {
    id: '10', level: 'red', kind: 'mc', figure: '250 × 36',
    setup: { ru: 'Выберите короткий и точный план вычисления.', uz: 'Qisqa va aniq hisob rejasini tanlang.', en: 'Choose a short and accurate calculation plan.' },
    prompt: { ru: 'Какой способ верен?', uz: "Qaysi usul to'g'ri?", en: 'Which method is correct?' },
    options: [
      { text: { ru: '250 × 30 + 250 × 6 = 9 000', uz: '250 × 30 + 250 × 6 = 9 000', en: '250 × 30 + 250 × 6 = 9,000' }, correct: true },
      { text: { ru: '250 × 3 + 250 × 6 = 2 250', uz: '250 × 3 + 250 × 6 = 2 250', en: '250 × 3 + 250 × 6 = 2,250' }, wrong: { ru: 'Цифра 3 означает 30, а не 3.', uz: '3 raqami 3 ni emas, 30 ni bildiradi.', en: 'The digit 3 means 30, not 3.' } },
      { text: { ru: '250 × 30 + 6 = 7 506', uz: '250 × 30 + 6 = 7 506', en: '250 × 30 + 6 = 7,506' }, wrong: { ru: 'Часть 6 тоже нужно умножить на 250.', uz: "6 qismini ham 250 ga ko'paytirish kerak.", en: 'The 6 part must also be multiplied by 250.' } },
      { text: { ru: '250 × 60 + 250 × 3 = 15 750', uz: '250 × 60 + 250 × 3 = 15 750', en: '250 × 60 + 250 × 3 = 15,750' }, wrong: { ru: 'Разряды 3 и 6 поменялись местами. В числе 36 три десятка и шесть единиц.', uz: "3 va 6 raqamlarining xonalari almashgan. 36 sonida uch o'nlik va olti birlik bor.", en: 'The place values of 3 and 6 have been swapped. The number 36 has three tens and six ones.' } },
    ],
    correctText: { ru: 'Верно. 7 500 + 1 500 = 9 000.', uz: "To'g'ri. 7 500 + 1 500 = 9 000.", en: 'Correct. 7,500 + 1,500 = 9,000.' },
    rule: { ru: 'В распределительном способе умножаются обе разрядные части.', uz: "Taqsimot usulida har ikkala xona qismi ko'paytiriladi.", en: 'With the distributive method, multiply both place-value parts.' },
  },
];

const Feedback = ({ ok, text, rule, lang, feedbackRef }) => (
  <div ref={feedbackRef} className={`p4-fb ${ok ? 'is-ok' : 'is-no'}`} role="status" aria-live="polite">
    <p className="p4-fb-txt">{text}</p>
    {ok && rule && <p className="p4-rule"><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>}
  </div>
);

const NumPad = ({ value, onChange, max, disabled, lang }) => (
  <div className="p4-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}>
    <output className="p4-pad-display" aria-live="polite">{value ? grouped(value) : '—'}</output>
    <div className="p4-pad-keys">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
        <button key={number} type="button" className="p4-key" disabled={disabled} onClick={() => onChange(value.length >= max ? value : value + number)}>{number}</button>
      ))}
      <button type="button" className="p4-key p4-key-del" disabled={disabled} aria-label={tx(UI.clear, lang)} onClick={() => onChange(value.slice(0, -1))}>⌫</button>
    </div>
  </div>
);

function Task({ task, lang, isLast, onSolved }) {
  // Xato javobdan keyin variantlar qayta aralashadi (metodist qarori 2026-08-21).
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- wrongRound ataylab yangi tartib beradi
  const options = useMemo(() => task.kind === 'mc' ? shuffle(task.options) : [], [task, wrongRound]);
  const rightCards = useMemo(() => task.kind === 'match' ? shuffle(task.right) : [], [task]);
  const slotCards = useMemo(() => task.kind === 'slots' ? shuffle(task.cards) : [], [task]);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [placed, setPlaced] = useState({});
  const [activeSlot, setActiveSlot] = useState(task.kind === 'slots' ? task.slots[0].id : null);
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [advancing, setAdvancing] = useState(false);
  const advancedRef = useRef(false);
  const feedbackRef = useRef(null);

  // Javobning to'g'riligi `checked` dan ALOHIDA hisoblanadi: tekshirishda
  // xato bo'lsa variantlar qayta aralashtiriladi.
  const answerCorrect = (
    (task.kind === 'mc' && picked?.correct === true)
    || (task.kind === 'place' && task.choices[picked]?.correct === true)
    || (task.kind === 'numpad' && typed === task.answer)
    || (task.kind === 'match' && task.pairs.every((pair) => pairs[pair.id] === pair.correctRight))
    || (task.kind === 'slots' && task.slots.every((slot) => placed[slot.id] === slot.correct))
  );
  const solved = checked && answerCorrect;

  const canCheck = (task.kind === 'mc' && picked !== null)
    || (task.kind === 'place' && picked !== null)
    || (task.kind === 'numpad' && typed !== '')
    || (task.kind === 'match' && task.pairs.every((pair) => pairs[pair.id]))
    || (task.kind === 'slots' && task.slots.every((slot) => placed[slot.id]));

  const wrongText = (() => {
    if (task.kind === 'mc') return picked?.wrong;
    if (task.kind === 'place') return task.choices[picked]?.wrong;
    if (task.kind === 'numpad') return task.wrongAnswers?.[typed] ?? task.wrongText;
    if (task.kind === 'match') return task.pairs.find((pair) => pairs[pair.id] !== pair.correctRight)?.wrong;
    if (task.kind === 'slots') return task.slots.find((slot) => placed[slot.id] !== slot.correct)?.wrong;
    return null;
  })();

  useEffect(() => {
    if (!checked || !feedbackRef.current) return undefined;
    let timeout;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      timeout = setTimeout(() => {
        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        feedbackRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
      }, 180);
    }));
    return () => { cancelAnimationFrame(raf); clearTimeout(timeout); };
  }, [checked]);

  const select = (value) => { if (!solved) { setPicked(value); setChecked(false); } };
  const retry = () => {
    setChecked(false);
    setPicked(null);
    setTyped('');
    setPairs({});
    setActiveLeft(null);
    setPlaced({});
    setActiveSlot(task.kind === 'slots' ? task.slots[0].id : null);
  };

  const connect = (rightId) => {
    if (activeLeft === null || solved) return;
    setPairs((old) => {
      const next = { ...old };
      Object.keys(next).forEach((leftId) => { if (next[leftId] === rightId) delete next[leftId]; });
      next[activeLeft] = rightId;
      return next;
    });
    setActiveLeft(null);
    setChecked(false);
  };

  const placeCard = (card) => {
    if (!activeSlot || solved) return;
    const next = { ...placed };
    Object.keys(next).forEach((slotId) => { if (next[slotId] === card) delete next[slotId]; });
    next[activeSlot] = card;
    setPlaced(next);
    const nextEmpty = task.slots.find((slot) => !next[slot.id]);
    if (nextEmpty) setActiveSlot(nextEmpty.id);
    setChecked(false);
  };

  return (
    <section className="p4-task" aria-labelledby={`task-${task.id}`}>
      <p className={`p4-eyebrow is-${task.level}`}><span>{tx(UI.level[task.level], lang)}</span> · {tx(UI.task, lang)} {task.id}</p>
      <p className="p4-setup">{tx(task.setup, lang)}</p>
      <div className="p4-figure">
        <pre className="p4-bignum">{task.figure}</pre>
        {task.raw && <p className="p4-raw">{task.raw}</p>}
      </div>
      <h2 id={`task-${task.id}`} className="p4-ask">{tx(task.prompt, lang)}</h2>

      {task.kind === 'mc' && <div className="p4-options">{options.map((option, index) => (
        <button key={`${task.id}-${index}`} type="button" className={`p4-option ${picked === option ? (checked ? (option.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`} aria-pressed={picked === option} disabled={solved} onClick={() => select(option)}>
          <span className="p4-letter">{'ABCD'[index]}</span><span>{tx(option.text, lang)}</span>
        </button>
      ))}</div>}

      {task.kind === 'place' && <div className="p4-place" role="group" aria-label={tx(UI.placeHint, lang)}>{task.choices.map((choice) => (
        <button key={choice.shift} type="button" className={`p4-place-row ${picked === choice ? (checked ? (choice.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`} aria-pressed={picked === choice} disabled={solved} onClick={() => select(choice)}>
          <span>{choice.shift} {{ uz: 'xona', ru: choice.shift === 1 ? 'разряд' : 'разряда', en: 'place' }[lang]}</span><b>{choice.value}</b>
        </button>
      ))}</div>}

      {task.kind === 'match' && <div className="p4-match">
        <p className="p4-note">{tx(UI.matchHint, lang)}</p>
        <div className="p4-match-cols">
          <div className="p4-match-col">{task.pairs.map((pair) => (
            <button key={pair.id} type="button" className={`p4-match-item ${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''}`} aria-pressed={activeLeft === pair.id} disabled={solved} onClick={() => { setActiveLeft(pair.id); setChecked(false); }}>
              <span>{tx(pair.left, lang)}</span>{pairs[pair.id] && <b className="p4-tie">{tx(task.right.find((right) => right.id === pairs[pair.id])?.text, lang)}</b>}
            </button>
          ))}</div>
          <div className="p4-match-col">{rightCards.map((right) => {
            const used = Object.values(pairs).includes(right.id);
            return <button key={right.id} type="button" className={`p4-match-item p4-match-right ${used ? 'is-used' : ''}`} aria-pressed={used} disabled={solved || activeLeft === null || used} onClick={() => connect(right.id)}>{tx(right.text, lang)}</button>;
          })}</div>
        </div>
      </div>}

      {task.kind === 'slots' && <div className="p4-slots">
        <p className="p4-note">{tx(UI.slotHint, lang)}</p>
        <div className="p4-slot-list">{task.slots.map((slot) => (
          <button key={slot.id} type="button" className={`p4-slot ${activeSlot === slot.id ? 'is-active' : ''}`} aria-pressed={activeSlot === slot.id} disabled={solved} onClick={() => { setActiveSlot(slot.id); setChecked(false); }}>
            <span>{tx(slot.label, lang)}</span><b>{placed[slot.id] ?? '—'}</b>
          </button>
        ))}</div>
        <div className="p4-card-bank" role="group" aria-label={tx(UI.slotHint, lang)}>{slotCards.map((card) => {
          const used = Object.values(placed).includes(card);
          return <button key={card} type="button" className={`p4-card ${used ? 'is-used' : ''}`} aria-pressed={used} disabled={solved} onClick={() => placeCard(card)}>{card}</button>;
        })}</div>
      </div>}

      {task.kind === 'numpad' && <NumPad value={typed} onChange={(value) => { setTyped(value); setChecked(false); }} max={task.maxLen} disabled={solved} lang={lang} />}

      {checked && <Feedback feedbackRef={feedbackRef} ok={solved} text={tx(solved ? task.correctText : wrongText, lang)} rule={task.rule} lang={lang} />}

      <div className="p4-actions">
        {!solved && <button type="button" className="p4-btn" disabled={!canCheck} onClick={() => { setChecked(true); setAttempts((old) => old + 1); if (!answerCorrect) setWrongRound((old) => old + 1); }}>{tx(UI.check, lang)}</button>}
        {checked && !solved && <button type="button" className="p4-btn p4-btn-ghost" onClick={retry}>{tx(UI.retry, lang)}</button>}
        {solved && <button
          type="button"
          className="p4-btn p4-btn-ready"
          disabled={advancing}
          onClick={() => {
            if (advancedRef.current) return;
            advancedRef.current = true;
            setAdvancing(true);
            onSolved(attempts === 1);
          }}
        >{tx(isLast ? UI.finish : UI.next, lang)}</button>}
      </div>
    </section>
  );
}

export default function Grade4Dars10Practice({ lang: langProp, onFinished }) {
  const preview = langProp === undefined || langProp === null;
  const initialLang = normalizeLang(langProp);
  const [previewLang, setPreviewLang] = useState(initialLang);
  const lang = preview ? normalizeLang(previewLang) : initialLang;
  const [index, setIndex] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [finished, setFinished] = useState(false);
  const finishedRef = useRef(false);
  const task = TASKS[index];
  const percent = Math.round(((finished ? TASKS.length : index) / TASKS.length) * 100);

  const onSolved = (wasFirstTry) => {
    const nextFirstTry = firstTry + (wasFirstTry ? 1 : 0);
    if (wasFirstTry) setFirstTry(nextFirstTry);
    if (index + 1 === TASKS.length) {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setFinished(true);
      onFinished?.({
        lessonId: LESSON_META.lessonId,
        lessonTitle: LESSON_META.lessonTitle[lang],
        totalQuestions: 10,
        correctAnswers: nextFirstTry,
        scorePercent: Math.round((nextFirstTry / 10) * 100),
      });
      return;
    }
    setIndex((old) => old + 1);
  };

  const restart = () => {
    finishedRef.current = false;
    setIndex(0);
    setFirstTry(0);
    setFinished(false);
  };

  return (
    <div className="p4-root">
      <style>{STYLES}</style>
      {preview && <div className="p4-lang" role="group" aria-label={tx({ uz: "Ko'rib chiqish tili", ru: 'Язык предпросмотра', en: 'Preview language' }, lang)}>{SUPPORTED_LANGS.map((code) => (
        <button key={code} type="button" className={code === lang ? 'is-active' : ''} aria-pressed={code === lang} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>
      ))}</div>}
      <header className="p4-head">
        <div className="p4-progress" role="progressbar" aria-label={tx(LESSON_META.lessonTitle, lang)} aria-valuemin="0" aria-valuemax="10" aria-valuenow={finished ? 10 : index}>
          <div className="p4-progress-bar" style={{ width: `${percent}%` }} />
        </div>
        <div className="p4-head-row"><span className="p4-title">{tx(LESSON_META.lessonTitle, lang)}</span><span className="p4-counter">{finished ? 10 : index + 1} / 10</span></div>
      </header>
      <main className="p4-main">
        {finished ? <section className="p4-done" aria-live="polite">
          <h2>{tx(UI.done, lang)}</h2>
          <p className="p4-score"><b>{firstTry}</b> <span>{tx(UI.ofTen, lang)}</span></p>
          <p className="p4-note">{tx(UI.firstTryNote, lang)}</p>
          <button type="button" className="p4-btn p4-btn-ready" onClick={restart}>{tx(UI.again, lang)}</button>
        </section> : <Task key={task.id} task={task} lang={lang} isLast={index === TASKS.length - 1} onSolved={onSolved} />}
      </main>
    </div>
  );
}

const STYLES = `
.p4-root{position:relative;min-height:100%;padding:0 0 24px;font-family:'Manrope',system-ui,sans-serif;color:${T.ink};background:${T.bg}}
.p4-root *,.p4-root *::before,.p4-root *::after{box-sizing:border-box}.p4-root button:focus-visible{outline:3px solid rgba(22,143,163,.45);outline-offset:3px}
.p4-lang{position:absolute;top:8px;right:8px;display:flex;gap:6px;z-index:5}.p4-lang button{min-width:44px;min-height:44px;border:0;border-radius:99px;background:${T.paper};color:${T.ink2};font-weight:800;cursor:pointer;box-shadow:0 4px 12px -8px rgba(23,59,82,.4)}.p4-lang button.is-active{background:${T.accent};color:#fff}
.p4-head{padding:46px clamp(12px,4vw,24px) 8px}.p4-progress{height:6px;border-radius:99px;background:rgba(23,59,82,.12);overflow:hidden}.p4-progress-bar{height:100%;background:linear-gradient(90deg,${T.cyan},${T.accent});transition:width .35s ease}.p4-head-row{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-top:8px}.p4-title{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(15px,2.4vw,19px)}.p4-counter{white-space:nowrap;font:700 13px 'JetBrains Mono',monospace;color:${T.ink3}}
.p4-main{max-width:720px;margin:0 auto;padding:4px clamp(12px,4vw,24px)}.p4-task{display:flex;flex-direction:column;gap:12px}.p4-eyebrow{margin:6px 0 0;font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.p4-eyebrow.is-green{color:${T.success}}.p4-eyebrow.is-yellow{color:${T.warn}}.p4-eyebrow.is-red{color:${T.accent}}.p4-setup{margin:0;font-size:clamp(14px,2vw,16px);line-height:1.5;color:${T.ink2}}.p4-ask{margin:2px 0 0;font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(17px,2.6vw,21px);line-height:1.3}.p4-note{margin:0;font-size:13px;color:${T.ink3}}
.p4-figure{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 10px;border-radius:16px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}.p4-bignum{margin:0;white-space:pre-wrap;text-align:center;font:800 clamp(22px,5vw,36px)/1.35 'JetBrains Mono',monospace;color:${T.navy}}.p4-raw{margin:0;font:700 14px 'JetBrains Mono',monospace;color:${T.ink2}}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.p4-option{display:flex;align-items:center;gap:9px;min-height:56px;padding:10px 12px;text-align:left;font-family:inherit;font-weight:700;font-size:clamp(13px,1.9vw,15px);color:${T.ink};background:${T.paper};border:1px solid rgba(23,59,82,.12);border-radius:14px;cursor:pointer}.p4-option:hover:not(:disabled),.p4-place-row:hover:not(:disabled),.p4-card:hover:not(:disabled){border-color:rgba(22,143,163,.45);transform:translateY(-1px)}.p4-letter{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;background:${T.cyanSoft};color:${T.cyan};font:800 11px 'JetBrains Mono',monospace}.p4-option.is-on,.p4-place-row.is-on{border-color:${T.accent};background:${T.accentSoft}}.p4-option.is-ok,.p4-place-row.is-ok{border-color:rgba(34,122,83,.45);background:${T.successSoft};color:${T.success}}.p4-option.is-no,.p4-place-row.is-no{border-color:rgba(169,111,19,.45);background:${T.warnSoft};color:${T.warn}}
.p4-place{display:grid;gap:8px}.p4-place-row{display:grid;grid-template-columns:minmax(82px,.45fr) 1fr;align-items:center;min-height:54px;padding:8px 12px;border:1px solid rgba(23,59,82,.12);border-radius:13px;background:${T.paper};color:${T.ink2};font-family:inherit;cursor:pointer}.p4-place-row span{text-align:left;font-size:12px;font-weight:800}.p4-place-row b{text-align:right;font:800 clamp(18px,4vw,25px) 'JetBrains Mono',monospace;color:${T.navy}}
.p4-match-cols{display:flex;gap:10px}.p4-match-col{display:flex;flex-direction:column;gap:8px;flex:1}.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-height:56px;padding:8px 10px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};font:800 clamp(12px,2.2vw,16px) 'Manrope',sans-serif;color:${T.navy};cursor:pointer}.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}.p4-match-item.is-tied{border-color:rgba(34,122,83,.35)}.p4-match-item.is-used{background:${T.successSoft}}.p4-match-item:disabled{cursor:default;opacity:.58}.p4-tie{font-size:12px;color:${T.success}}
.p4-slot-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:8px}.p4-slot{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-height:64px;padding:8px;border:1px dashed rgba(23,59,82,.3);border-radius:13px;background:${T.paper};color:${T.ink2};font-family:inherit;cursor:pointer}.p4-slot.is-active{border-style:solid;border-color:${T.accent};background:${T.accentSoft}}.p4-slot span{font-size:12px;font-weight:800}.p4-slot b{font:800 18px 'JetBrains Mono',monospace;color:${T.navy}}.p4-card-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:10px}.p4-card{min-width:96px;min-height:48px;padding:8px 12px;border:1px solid rgba(23,59,82,.14);border-radius:12px;background:${T.paper};font:800 16px 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer}.p4-card.is-used{background:${T.cyanSoft};border-color:${T.cyan}}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:8px;width:min(240px,100%);margin:0 auto;padding:12px;border-radius:18px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8)}.p4-pad-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:50px;border:2px solid ${T.accent};border-radius:13px;background:${T.paper};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;color:${T.navy}}.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:100%}.p4-key{min-width:44px;min-height:44px;border:1px solid rgba(23,59,82,.16);border-radius:12px;background:${T.paper};font:800 clamp(18px,3.6vw,22px) 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer}.p4-key-del{background:${T.accentSoft};color:${T.accent}}
.p4-fb{padding:12px 14px;border-radius:14px}.p4-fb.is-ok{background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}.p4-fb.is-no{background:${T.warnSoft};box-shadow:inset 4px 0 0 ${T.warn}}.p4-fb-txt{margin:0;font-family:'Source Serif 4',Georgia,serif;font-size:clamp(14px,2.1vw,16px);line-height:1.45}.p4-rule{margin:8px 0 0;font-size:13px;color:${T.ink2}}
.p4-actions{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:10px;margin-top:4px}.p4-btn{min-height:46px;padding:10px 22px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font-family:inherit;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5),inset 0 0 0 1px rgba(255,91,53,.2)}.p4-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.p4-btn-ready{background:${T.accent};color:#fff}.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}.p4-done{display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 12px;text-align:center}.p4-done h2{margin:0;font-family:'Source Serif 4',Georgia,serif}.p4-score{margin:0;font-family:'JetBrains Mono',monospace}.p4-score b{font-size:clamp(32px,7vw,44px);color:${T.success}}.p4-score span{font-size:14px;color:${T.ink3}}
@media(max-width:520px){.p4-options{grid-template-columns:1fr}.p4-match-cols{gap:8px}.p4-slot-list{grid-template-columns:1fr}.p4-match-item{font-size:12px;padding:7px}.p4-place-row{grid-template-columns:76px 1fr}}
@media(prefers-reduced-motion:reduce){.p4-root *,.p4-root *::before,.p4-root *::after{transition:none!important;animation:none!important}}

/* PRACTICE-FIX boshlanishi — metodist qarori 2026-08-21.
   1) Tekshirish tugmasi o'ngda (2-dars etaloni).
   2) Moslashtirishda ikki tomondagi kartochkalar bir xil o'lchamda: ustun grid
      bo'ladi va qatorlari 1fr, shuning uchun juftlar qator bo'yicha tekislanadi.
   Bu blok har darsda takrorlanadi ATAYLAB: LMS avtonom fayl talab qiladi. */
.p4-actions, .g4p-actions { justify-content: flex-end; }
.p4-match-cols, .g4p-match-cols { align-items: stretch; }
.p4-match-col, .g4p-match-col { display: grid; grid-auto-rows: 1fr; align-content: stretch; }
/* PRACTICE-FIX tugashi */
`;
