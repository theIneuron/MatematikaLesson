// ============================================================================
// 4-SINF · 11-DARS AMALIYOTI
// Ko'p xonali sonni uch xonali songa ko'paytirish
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
  lessonId: 'num-4-11-practice',
  lessonTitle: { uz: "11-dars. Amaliyot: uch xonali songa ko'paytirish", ru: 'Урок 11. Практика: умножение на трёхзначное число', en: 'Lesson 11. Practice: multiplying by a three-digit number' },
};

const UI = {
  task: { ru: 'Задание', uz: 'Topshiriq' , en: "Task"},
  level: {
    green: { ru: 'Базовое', uz: 'Asosiy' , en: "Core"},
    yellow: { ru: 'Применение', uz: "Qo'llash" , en: "Application"},
    red: { ru: 'Перенос', uz: "Ko'chirish" , en: "Transfer"},
  },
  check: { ru: 'Проверить', uz: 'Tekshirish' , en: "Check"},
  retry: { ru: 'Попробовать ещё', uz: "Yana urinib ko'ring", en: 'Try again' },
  next: { ru: 'Следующее', uz: 'Keyingisi' , en: "Next"},
  finish: { ru: 'Завершить', uz: 'Yakunlash' , en: "Finish"},
  again: { ru: 'Пройти заново', uz: 'Qaytadan', en: 'Start again' },
  done: { ru: 'Практика пройдена', uz: 'Amaliyot tugadi' , en: "Practice complete"},
  ofTen: { ru: 'из 10', uz: '10 dan' , en: "out of 10"},
  rule: { ru: 'Запомните', uz: 'Eslab qoling' , en: "Remember"},
  typeAnswer: { ru: 'Введите числовой ответ', uz: 'Sonli javobni kiriting' , en: "Enter a numerical answer"},
  clear: { ru: 'Стереть', uz: "O'chirish", en: 'Clear' },
  matchHint: { ru: 'Сначала выберите выражение слева, затем результат справа.', uz: "Avval chapdagi ifodani, keyin o'ngdagi natijani tanlang." , en: "First select an expression on the left, then its result on the right."},
  slotHint: { ru: 'Выберите строку, затем подходящую карточку.', uz: "Avval qatorni, keyin mos kartani tanlang." , en: "Select a row, then choose the matching card."},
  missingHint: { ru: 'Выберите значение для пустого места.', uz: "Bo'sh joy uchun mos qiymatni tanlang.", en: 'Choose the value that belongs in the blank.' },
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
    id: '01', level: 'green', kind: 'mc', figure: '218 × 427',
    setup: { ru: 'Разложите трёхзначный множитель на сотни, десятки и единицы.', uz: "Uch xonali ko'paytiruvchini yuzlik, o'nlik va birlikka ajrating.", en: 'Split the three-digit factor into hundreds, tens and ones.' },
    prompt: { ru: 'Какое разложение верно?', uz: "Qaysi ajratish to'g'ri?" , en: "Which decomposition is correct?"},
    options: [
      { text: { ru: '218 × 400 + 218 × 20 + 218 × 7', uz: '218 × 400 + 218 × 20 + 218 × 7' , en: "218 × 400 + 218 × 20 + 218 × 7"}, correct: true },
      { text: { ru: '218 × 4 + 218 × 20 + 218 × 7', uz: '218 × 4 + 218 × 20 + 218 × 7' , en: "218 × 4 + 218 × 20 + 218 × 7"}, wrong: { ru: 'Цифра 4 стоит в сотнях и означает 400, а не 4.', uz: '4 raqami yuzlar xonasida turib, 4 ni emas, 400 ni bildiradi.', en: 'The digit 4 is in the hundreds place, so it means 400, not 4.' } },
      { text: { ru: '218 × 400 + 218 × 2 + 218 × 7', uz: '218 × 400 + 218 × 2 + 218 × 7' , en: "218 × 400 + 218 × 2 + 218 × 7"}, wrong: { ru: 'Цифра 2 стоит в десятках и означает 20.', uz: "2 raqami o'nlar xonasida turib, 20 ni bildiradi.", en: 'The digit 2 is in the tens place, so it means 20.' } },
      { text: { ru: 'Только 218 × 7', uz: 'Faqat 218 × 7', en: 'Only 218 × 7' }, wrong: { ru: 'Так учитываются только единицы. Сотни и десятки потеряны.', uz: "Bunda faqat birliklar hisoblanadi. Yuzlik va o'nliklar yo'qolgan.", en: 'That includes only the ones. The hundreds and tens are missing.' } },
    ],
    correctText: { ru: 'Верно. 87 200 + 4 360 + 1 526 = 93 086.', uz: "To'g'ri. 87 200 + 4 360 + 1 526 = 93 086.", en: 'Correct. 87,200 + 4,360 + 1,526 = 93,086.' },
    rule: { ru: 'Каждая разрядная часть даёт своё неполное произведение.', uz: "Har bir xona qismi o'z to'liqsiz ko'paytmasini beradi.", en: 'Each place-value part gives its own partial product.' },
  },
  {
    id: '02', level: 'green', kind: 'match', figure: '172 × 315',
    setup: { ru: 'Найдите строки единиц, десятков и сотен.', uz: "Birliklar, o'nliklar va yuzliklar qatorlarini toping.", en: 'Find the ones, tens and hundreds rows.' },
    prompt: { ru: 'Соедините выражения с результатами.', uz: 'Ifodalarni natijalar bilan moslashtiring.' , en: "Match each expression to its result."},
    pairs: [
      { id: 'units', left: { ru: '172 × 5', uz: '172 × 5' , en: "172 × 5"}, correctRight: 'r860', wrong: { ru: 'Это строка единиц. Вычисли произведение на 5 без сдвига.', uz: "Bu birliklar qatori. 5 ga ko'paytmani siljitmasdan hisoblang.", en: 'This is the ones row. Multiply by 5 without a shift.' } },
      { id: 'tens', left: { ru: '172 × 10', uz: '172 × 10' , en: "172 × 10"}, correctRight: 'r1720', wrong: { ru: 'Один десяток требует одного разряда сдвига. Сначала вычисли произведение на 1.', uz: "Bir o'nlik bir xona siljishini talab qiladi. Avval 1 ga ko'paytmani hisoblang.", en: 'One ten requires a one-place shift. First multiply by 1.' } },
      { id: 'hundreds', left: { ru: '172 × 300', uz: '172 × 300' , en: "172 × 300"}, correctRight: 'r51600', wrong: { ru: 'Три сотни требуют двух разрядов сдвига. Сначала вычисли произведение на 3.', uz: "Uch yuzlik ikki xona siljishini talab qiladi. Avval 3 ga ko'paytmani hisoblang.", en: 'Three hundreds require a two-place shift. First multiply by 3.' } },
    ],
    right: [
      { id: 'r860', text: { ru: '860', uz: '860' , en: "860"} },
      { id: 'r1720', text: { ru: '1 720', uz: '1 720' , en: "1 720"} },
      { id: 'r51600', text: { ru: '51 600', uz: '51 600' , en: "51 600"} },
      { id: 'r172', text: { ru: '172', uz: '172' , en: "172"} },
      { id: 'r5160', text: { ru: '5 160', uz: '5 160' , en: "5 160"} },
      { id: 'r516', text: { ru: '516', uz: '516' , en: "516"} },
    ],
    correctText: { ru: 'Верно. 860 + 1 720 + 51 600 = 54 180.', uz: "To'g'ri. 860 + 1 720 + 51 600 = 54 180.", en: 'Correct. 860 + 1,720 + 51,600 = 54,180.' },
    rule: { ru: 'Строки единиц, десятков и сотен имеют сдвиги 0, 1 и 2.', uz: "Birliklar, o'nliklar va yuzliklar qatorlari 0, 1 va 2 xona siljiydi.", en: 'The ones, tens and hundreds rows shift 0, 1 and 2 places.' },
  },
  {
    id: '03', level: 'yellow', kind: 'slots', figure: '214 × 312',
    setup: { ru: 'Разместите три неполных произведения по строкам.', uz: "Uchta to'liqsiz ko'paytmani qatorlarga joylashtiring.", en: 'Place the three partial products in the correct rows.' },
    prompt: { ru: 'Какие карточки нужны?', uz: 'Qaysi kartalar kerak?', en: 'Which cards are needed?' },
    slots: [
      { id: 'units', label: { ru: 'Строка единиц', uz: 'Birliklar qatori' , en: "Ones row"}, correct: '428', wrong: { ru: 'Для строки единиц вычисли 214 × 2 и не добавляй сдвиг.', uz: "Birliklar qatori uchun 214 ni 2 ga ko'paytiring va siljish qo'shmang.", en: 'For the ones row, calculate 214 × 2 without adding a shift.' } },
      { id: 'tens', label: { ru: 'Строка десятков', uz: "O'nliklar qatori" , en: "Tens row"}, correct: '2 140', wrong: { ru: 'Для строки десятков вычисли произведение на 1 и сдвинь его на один разряд.', uz: "O'nliklar qatori uchun 1 ga ko'paytmani hisoblab, uni bir xona siljiting.", en: 'For the tens row, multiply by 1 and shift the result one place.' } },
      { id: 'hundreds', label: { ru: 'Строка сотен', uz: 'Yuzliklar qatori' , en: "Hundreds row"}, correct: '64 200', wrong: { ru: 'Для строки сотен вычисли произведение на 3 и сдвинь его на два разряда.', uz: "Yuzliklar qatori uchun 3 ga ko'paytmani hisoblab, uni ikki xona siljiting.", en: 'For the hundreds row, multiply by 3 and shift the result two places.' } },
    ],
    cards: ['428', '2 140', '64 200', '214', '6 420', '42 800'],
    correctText: { ru: 'Верно. 428 + 2 140 + 64 200 = 66 768.', uz: "To'g'ri. 428 + 2 140 + 64 200 = 66 768.", en: 'Correct. 428 + 2,140 + 64,200 = 66,768.' },
    rule: { ru: 'Каждая карточка занимает только одну строку.', uz: 'Har bir karta faqat bitta qatorni egallaydi.', en: 'Each card occupies only one row.' },
  },
  {
    id: '04', level: 'yellow', kind: 'numpad', figure: '127 × 324', answer: '41148', maxLen: 5,
    setup: { ru: 'Вычислите три строки и сложите их.', uz: "Uchta qatorni hisoblab, ularni qo'shing.", en: 'Calculate the three rows and add them.' },
    prompt: { ru: 'Какой получился результат?', uz: "Qanday natija hosil bo'ldi?" , en: "What result do you get?"},
    wrongAnswers: {
      508: { ru: 'Это только строка единиц. Добавьте строки десятков и сотен.', uz: "Bu faqat birliklar qatori. O'nliklar va yuzliklar qatorlarini ham qo'shing.", en: 'That is only the ones row. Add the tens and hundreds rows.' },
      2540: { ru: 'Это только строка десятков. Остались ещё две строки.', uz: "Bu faqat o'nliklar qatori. Yana ikkita qator qoldi.", en: 'That is only the tens row. Two rows are still missing.' },
      38100: { ru: 'Это только строка сотен. Не потеряйте 508 и 2 540.', uz: "Bu faqat yuzliklar qatori. 508 va 2 540 ni yo'qotmang.", en: 'That is only the hundreds row. Do not lose 508 and 2,540.' },
    },
    wrongText: { ru: 'Пересчитайте строки единиц, десятков и сотен, затем сложите их разряд под разрядом.', uz: "Birliklar, o'nliklar va yuzliklar qatorlarini qayta hisoblab, keyin xona ostiga xona qilib qo'shing.", en: 'Recalculate the ones, tens and hundreds rows, then add them with matching place values aligned.' },
    correctText: { ru: 'Верно. 508 + 2 540 + 38 100 = 41 148.', uz: "To'g'ri. 508 + 2 540 + 38 100 = 41 148.", en: 'Correct. 508 + 2,540 + 38,100 = 41,148.' },
    rule: { ru: 'Три готовые строки складываются по разрядам.', uz: "Uchta tayyor qator xonalar bo'yicha qo'shiladi.", en: 'Add the three completed rows by place value.' },
  },
  {
    id: '05', level: 'yellow', kind: 'missing', figure: '326 × 400', raw: '326 × 4 = 1 304\n1 304 × 100 = ___',
    setup: { ru: 'Цифра 4 находится в разряде сотен.', uz: '4 raqami yuzlar xonasida turibdi.', en: 'The digit 4 is in the hundreds place.' },
    prompt: { ru: 'Какое значение пропущено?', uz: 'Qaysi qiymat tushirib qoldirilgan?', en: 'Which value is missing?' },
    choices: [
      { value: '1 304', wrong: { ru: 'Это произведение на 4 единицы, без сдвига.', uz: "Bu 4 birlikka siljishsiz ko'paytma.", en: 'That is the product by 4 ones, without a shift.' } },
      { value: '13 040', wrong: { ru: 'Один сдвиг соответствует десяткам. Для сотен нужны два.', uz: "Bir siljish o'nliklarga mos. Yuzliklar uchun ikkita siljish kerak.", en: 'One shift corresponds to tens. Hundreds need two shifts.' } },
      { value: '130 400', correct: true },
      { value: '1 304 000', wrong: { ru: 'Три сдвига соответствовали бы тысячам, а не сотням.', uz: "Uch siljish mingliklarga mos bo'lar edi, yuzliklarga emas.", en: 'Three shifts would correspond to thousands, not hundreds.' } },
    ],
    correctText: { ru: 'Верно. 326 × 400 = 130 400.', uz: "To'g'ri. 326 × 400 = 130 400.", en: 'Correct. 326 × 400 = 130,400.' },
    rule: { ru: 'Строка сотен сдвигается на два разряда.', uz: 'Yuzliklar qatori ikki xona siljiydi.', en: 'The hundreds row shifts two places.' },
  },
  {
    id: '06', level: 'yellow', kind: 'mc', figure: '136 × 204',
    setup: { ru: 'В каждой из 204 коробок находится по 136 деталей.', uz: '204 ta qutining har birida 136 tadan detal bor.', en: 'Each of 204 boxes contains 136 parts.' },
    prompt: { ru: 'Сколько деталей всего?', uz: 'Jami nechta detal bor?', en: 'How many parts are there altogether?' },
    options: [
      { text: { ru: '27 744', uz: '27 744' , en: "27 744"}, correct: true },
      { text: { ru: '544', uz: '544' , en: "544"}, wrong: { ru: 'Это только 136 × 4. Часть 200 ещё не учтена.', uz: 'Bu faqat 136 × 4. 200 qismi hali hisobga olinmagan.', en: 'That is only 136 × 4. The 200 part has not been included yet.' } },
      { text: { ru: '3 264', uz: '3 264' , en: "3 264"}, wrong: { ru: 'Так число 204 превратилось в 24. Ноль удерживает разряд десятков.', uz: "Bunda 204 soni 24 ga aylangan. Nol o'nlar xonasini saqlaydi.", en: 'This turns 204 into 24. The zero holds the tens place.' } },
      { text: { ru: '340', uz: '340' , en: "340"}, wrong: { ru: 'Сложение 204 и 136 не показывает 204 одинаковые группы.', uz: "204 va 136 ni qo'shish 204 ta teng guruhni ifodalamaydi.", en: 'Adding 204 and 136 does not represent 204 equal groups.' } },
    ],
    correctText: { ru: 'Верно. 27 200 + 0 + 544 = 27 744 детали.', uz: "To'g'ri. 27 200 + 0 + 544 = 27 744 ta detal.", en: 'Correct. 27,200 + 0 + 544 = 27,744 parts.' },
    rule: { ru: 'Ноль сохраняет разряд, даже если его строка равна нулю.', uz: "Nol qatori nolga teng bo'lsa ham, xona o'rnini saqlaydi.", en: 'Zero preserves a place even when its row equals zero.' },
  },
  {
    id: '07', level: 'yellow', kind: 'match', figure: '312 × 241',
    setup: { ru: 'Сопоставьте каждую разрядную часть с готовой строкой.', uz: "Har bir xona qismini tayyor qator bilan moslashtiring.", en: 'Match each place-value part to its completed row.' },
    prompt: { ru: 'Какие пары верны?', uz: "Qaysi juftliklar to'g'ri?" , en: "Which pairs are correct?"},
    pairs: [
      { id: 'units', left: { ru: '312 × 1', uz: '312 × 1' , en: "312 × 1"}, correctRight: 'r312', wrong: { ru: 'Это строка единиц: произведение на 1 не получает дополнительного сдвига.', uz: "Bu birliklar qatori: 1 ga ko'paytma qo'shimcha siljimaydi.", en: 'This is the ones row: the product by 1 receives no extra shift.' } },
      { id: 'tens', left: { ru: '312 × 40', uz: '312 × 40' , en: "312 × 40"}, correctRight: 'r12480', wrong: { ru: 'Четыре десятка требуют одного разряда сдвига после умножения на 4.', uz: "To'rt o'nlik 4 ga ko'paytirgandan keyin bir xona siljishini talab qiladi.", en: 'Four tens require a one-place shift after multiplying by 4.' } },
      { id: 'hundreds', left: { ru: '312 × 200', uz: '312 × 200' , en: "312 × 200"}, correctRight: 'r62400', wrong: { ru: 'Две сотни требуют двух разрядов сдвига после умножения на 2.', uz: "Ikki yuzlik 2 ga ko'paytirgandan keyin ikki xona siljishini talab qiladi.", en: 'Two hundreds require a two-place shift after multiplying by 2.' } },
    ],
    right: [
      { id: 'r312', text: { ru: '312', uz: '312' , en: "312"} },
      { id: 'r12480', text: { ru: '12 480', uz: '12 480' , en: "12 480"} },
      { id: 'r62400', text: { ru: '62 400', uz: '62 400' , en: "62 400"} },
      { id: 'r1248', text: { ru: '1 248', uz: '1 248' , en: "1 248"} },
      { id: 'r6240', text: { ru: '6 240', uz: '6 240' , en: "6 240"} },
      { id: 'r3120', text: { ru: '3 120', uz: '3 120' , en: "3 120"} },
    ],
    correctText: { ru: 'Верно. 312 + 12 480 + 62 400 = 75 192.', uz: "To'g'ri. 312 + 12 480 + 62 400 = 75 192.", en: 'Correct. 312 + 12,480 + 62,400 = 75,192.' },
    rule: { ru: 'Готовое значение строки уже включает её разрядный сдвиг.', uz: "Qatorning tayyor qiymati uning xona siljishini allaqachon o'z ichiga oladi.", en: 'A completed row value already includes its place-value shift.' },
  },
  {
    id: '08', level: 'red', kind: 'mc', figure: '243 × 506',
    setup: { ru: 'В середине множителя стоит ноль.', uz: "Ko'paytiruvchining o'rtasida nol turibdi.", en: 'There is a zero in the middle of the factor.' },
    prompt: { ru: 'Какие три строки верны?', uz: "Qaysi uchta qator to'g'ri?", en: 'Which three rows are correct?' },
    options: [
      { text: { ru: '1 458; 0; 121 500', uz: '1 458; 0; 121 500' , en: "1 458; 0; 121 500"}, correct: true },
      { text: { ru: '1 458; 0; 12 150', uz: '1 458; 0; 12 150' , en: "1 458; 0; 12 150"}, wrong: { ru: 'Строка сотен сдвинута только на один разряд. Для 500 нужны два.', uz: 'Yuzliklar qatori faqat bir xona siljigan. 500 uchun ikkita siljish kerak.', en: 'The hundreds row is shifted only one place. Multiplying by 500 needs two shifts.' } },
      { text: { ru: '1 458; 12 150; 121 500', uz: '1 458; 12 150; 121 500' , en: "1 458; 12 150; 121 500"}, wrong: { ru: 'В десятках стоит ноль, поэтому произведение на 50 не требуется.', uz: "O'nlar xonasida nol turibdi, shuning uchun 50 ga ko'paytma kerak emas.", en: 'The tens digit is zero, so no product by 50 is needed.' } },
      { text: { ru: '1 458; 0; 1 215', uz: '1 458; 0; 1 215' , en: "1 458; 0; 1 215"}, wrong: { ru: '1 215 — это произведение на 5 без сдвига. Здесь 5 означает 500.', uz: "1 215 beshga siljishsiz ko'paytma. Bu yerda 5 raqami 500 ni bildiradi.", en: '1,215 is the unshifted product by 5. Here, the digit 5 means 500.' } },
    ],
    correctText: { ru: 'Верно. 1 458 + 0 + 121 500 = 122 958.', uz: "To'g'ri. 1 458 + 0 + 121 500 = 122 958.", en: 'Correct. 1,458 + 0 + 121,500 = 122,958.' },
    rule: { ru: 'Нулевая строка сохраняет место десятков, а строка сотен остаётся на двух сдвигах.', uz: "Nol qatori o'nliklar o'rnini saqlaydi, yuzliklar qatori esa ikki siljishda qoladi.", en: 'The zero row preserves the tens place, while the hundreds row remains shifted two places.' },
  },
  {
    id: '09', level: 'red', kind: 'mc', figure: '184 × 123\n552 + 3 680 + 1 840 = 6 072',
    setup: { ru: 'В неверном решении строка сотен размещена неправильно.', uz: "Noto'g'ri yechimda yuzliklar qatori noto'g'ri joylashtirilgan.", en: 'The hundreds row is positioned incorrectly in this solution.' },
    prompt: { ru: 'Как исправить строку сотен?', uz: 'Yuzliklar qatorini qanday tuzatish kerak?', en: 'How should the hundreds row be corrected?' },
    options: [
      { text: { ru: '1 840 заменить на 18 400', uz: '1 840 ni 18 400 ga almashtirish', en: 'Replace 1,840 with 18,400' }, correct: true },
      { text: { ru: '1 840 оставить без изменения', uz: "1 840 ni o'zgartirmaslik", en: 'Leave 1,840 unchanged' }, wrong: { ru: '1 840 — это только один разряд сдвига. Для сотен нужны два.', uz: '1 840 faqat bir xona siljigan. Yuzliklar uchun ikkita siljish kerak.', en: '1,840 has only a one-place shift. Hundreds need two shifts.' } },
      { text: { ru: '1 840 заменить на 184', uz: '1 840 ni 184 ga almashtirish', en: 'Replace 1,840 with 184' }, wrong: { ru: '184 — это умножение на 1 единицу без сдвига.', uz: "184 bir birlikka siljishsiz ko'paytma.", en: '184 is the unshifted product by 1 one.' } },
      { text: { ru: '1 840 заменить на 184 000', uz: '1 840 ni 184 000 ga almashtirish', en: 'Replace 1,840 with 184,000' }, wrong: { ru: 'Три разряда сдвига соответствовали бы тысячам, а не сотням.', uz: "Uch xona siljishi mingliklarga mos bo'lar edi, yuzliklarga emas.", en: 'A three-place shift would correspond to thousands, not hundreds.' } },
    ],
    correctText: { ru: 'Верно. 552 + 3 680 + 18 400 = 22 632.', uz: "To'g'ri. 552 + 3 680 + 18 400 = 22 632.", en: 'Correct. 552 + 3,680 + 18,400 = 22,632.' },
    rule: { ru: 'Сначала проверяйте разряд цифры множителя, затем сумму строк.', uz: "Avval ko'paytiruvchi raqamining xonasini, keyin qatorlar yig'indisini tekshiring.", en: "Check each factor digit's place value first, then check the sum of the rows." },
  },
  {
    id: '10', level: 'red', kind: 'mc', figure: '250 × 324',
    setup: { ru: 'Выберите короткий точный план вычисления.', uz: 'Qisqa va aniq hisob rejasini tanlang.', en: 'Choose a short and accurate calculation plan.' },
    prompt: { ru: 'Какой способ верен?', uz: "Qaysi usul to'g'ri?" , en: "Which method is correct?"},
    options: [
      { text: { ru: '250 × 300 + 250 × 20 + 250 × 4 = 81 000', uz: '250 × 300 + 250 × 20 + 250 × 4 = 81 000' , en: "250 × 300 + 250 × 20 + 250 × 4 = 81 000"}, correct: true },
      { text: { ru: '250 × 3 + 250 × 2 + 250 × 4 = 2 250', uz: '250 × 3 + 250 × 2 + 250 × 4 = 2 250' , en: "250 × 3 + 250 × 2 + 250 × 4 = 2 250"}, wrong: { ru: 'Цифры 3 и 2 потеряли значения сотен и десятков.', uz: "3 va 2 raqamlari yuzlik va o'nlik qiymatlarini yo'qotgan.", en: 'The digits 3 and 2 have lost their hundreds and tens values.' } },
      { text: { ru: '250 × 300 + 20 + 4 = 75 024', uz: '250 × 300 + 20 + 4 = 75 024' , en: "250 × 300 + 20 + 4 = 75 024"}, wrong: { ru: 'Части 20 и 4 тоже нужно умножить на 250.', uz: "20 va 4 qismlarini ham 250 ga ko'paytirish kerak.", en: 'The 20 and 4 parts must also be multiplied by 250.' } },
      { text: { ru: '250 × 300 + 250 × 2 + 250 × 4 = 76 500', uz: '250 × 300 + 250 × 2 + 250 × 4 = 76 500' , en: "250 × 300 + 250 × 2 + 250 × 4 = 76 500"}, wrong: { ru: 'Цифра 2 означает 20, а не 2.', uz: '2 raqami 2 ni emas, 20 ni bildiradi.', en: 'The digit 2 means 20, not 2.' } },
    ],
    correctText: { ru: 'Верно. 75 000 + 5 000 + 1 000 = 81 000.', uz: "To'g'ri. 75 000 + 5 000 + 1 000 = 81 000.", en: 'Correct. 75,000 + 5,000 + 1,000 = 81,000.' },
    rule: { ru: 'В распределительном способе умножается каждая разрядная часть.', uz: "Taqsimot usulida har bir xona qismi ko'paytiriladi.", en: 'With the distributive method, multiply every place-value part.' },
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
    || (task.kind === 'missing' && task.choices[picked]?.correct === true)
    || (task.kind === 'numpad' && typed === task.answer)
    || (task.kind === 'match' && task.pairs.every((pair) => pairs[pair.id] === pair.correctRight))
    || (task.kind === 'slots' && task.slots.every((slot) => placed[slot.id] === slot.correct))
  );
  const solved = checked && answerCorrect;

  const canCheck = (task.kind === 'mc' && picked !== null)
    || (task.kind === 'missing' && picked !== null)
    || (task.kind === 'numpad' && typed !== '')
    || (task.kind === 'match' && task.pairs.every((pair) => pairs[pair.id]))
    || (task.kind === 'slots' && task.slots.every((slot) => placed[slot.id]));

  const wrongText = (() => {
    if (task.kind === 'mc') return picked?.wrong;
    if (task.kind === 'missing') return task.choices[picked]?.wrong;
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
      <div className="p4-figure"><pre className="p4-bignum">{task.figure}</pre>{task.raw && <p className="p4-raw">{task.raw}</p>}</div>
      <h2 id={`task-${task.id}`} className="p4-ask">{tx(task.prompt, lang)}</h2>

      {task.kind === 'mc' && <div className="p4-options">{options.map((option, index) => (
        <button key={`${task.id}-${index}`} type="button" className={`p4-option ${picked === option ? (checked ? (option.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`} aria-pressed={picked === option} disabled={solved} onClick={() => select(option)}>
          <span className="p4-letter">{'ABCD'[index]}</span><span>{tx(option.text, lang)}</span>
        </button>
      ))}</div>}

      {task.kind === 'missing' && <div className="p4-missing" role="group" aria-label={tx(UI.missingHint, lang)}>{task.choices.map((choice) => (
        <button key={choice.value} type="button" className={`p4-missing-card ${picked === choice ? (checked ? (choice.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`} aria-pressed={picked === choice} disabled={solved} onClick={() => select(choice)}>{choice.value}</button>
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

export default function Grade4Dars11Practice({ lang: langProp, onFinished }) {
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
.p4-figure{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 10px;border-radius:16px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}.p4-bignum{margin:0;white-space:pre-wrap;text-align:center;font:800 clamp(22px,5vw,36px)/1.35 'JetBrains Mono',monospace;color:${T.navy}}.p4-raw{margin:0;white-space:pre-line;text-align:center;font:700 14px/1.55 'JetBrains Mono',monospace;color:${T.ink2}}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.p4-option{display:flex;align-items:center;gap:9px;min-height:56px;padding:10px 12px;text-align:left;font-family:inherit;font-weight:700;font-size:clamp(13px,1.9vw,15px);color:${T.ink};background:${T.paper};border:1px solid rgba(23,59,82,.12);border-radius:14px;cursor:pointer}.p4-option:hover:not(:disabled),.p4-missing-card:hover:not(:disabled),.p4-card:hover:not(:disabled){border-color:rgba(22,143,163,.45);transform:translateY(-1px)}.p4-letter{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;background:${T.cyanSoft};color:${T.cyan};font:800 11px 'JetBrains Mono',monospace}.p4-option.is-on,.p4-missing-card.is-on{border-color:${T.accent};background:${T.accentSoft}}.p4-option.is-ok,.p4-missing-card.is-ok{border-color:rgba(34,122,83,.45);background:${T.successSoft};color:${T.success}}.p4-option.is-no,.p4-missing-card.is-no{border-color:rgba(169,111,19,.45);background:${T.warnSoft};color:${T.warn}}
.p4-missing{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.p4-missing-card{min-height:54px;padding:9px 12px;border:1px solid rgba(23,59,82,.12);border-radius:13px;background:${T.paper};font:800 clamp(17px,3.5vw,22px) 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer}
.p4-match-cols{display:flex;gap:10px}.p4-match-col{display:flex;flex-direction:column;gap:8px;flex:1}.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-height:56px;padding:8px 10px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};font:800 clamp(12px,2.2vw,16px) 'Manrope',sans-serif;color:${T.navy};cursor:pointer}.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}.p4-match-item.is-tied{border-color:rgba(34,122,83,.35)}.p4-match-item.is-used{background:${T.successSoft}}.p4-match-item:disabled{cursor:default;opacity:.58}.p4-tie{font-size:12px;color:${T.success}}
.p4-slot-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:8px}.p4-slot{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-height:68px;padding:8px;border:1px dashed rgba(23,59,82,.3);border-radius:13px;background:${T.paper};color:${T.ink2};font-family:inherit;cursor:pointer}.p4-slot.is-active{border-style:solid;border-color:${T.accent};background:${T.accentSoft}}.p4-slot span{font-size:11px;font-weight:800}.p4-slot b{font:800 17px 'JetBrains Mono',monospace;color:${T.navy}}.p4-card-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:10px}.p4-card{min-width:96px;min-height:48px;padding:8px 12px;border:1px solid rgba(23,59,82,.14);border-radius:12px;background:${T.paper};font:800 16px 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer}.p4-card.is-used{background:${T.cyanSoft};border-color:${T.cyan}}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:8px;width:min(240px,100%);margin:0 auto;padding:12px;border-radius:18px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8)}.p4-pad-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:50px;border:2px solid ${T.accent};border-radius:13px;background:${T.paper};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;color:${T.navy}}.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:100%}.p4-key{min-width:44px;min-height:44px;border:1px solid rgba(23,59,82,.16);border-radius:12px;background:${T.paper};font:800 clamp(18px,3.6vw,22px) 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer}.p4-key-del{background:${T.accentSoft};color:${T.accent}}
.p4-fb{padding:12px 14px;border-radius:14px}.p4-fb.is-ok{background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}.p4-fb.is-no{background:${T.warnSoft};box-shadow:inset 4px 0 0 ${T.warn}}.p4-fb-txt{margin:0;font-family:'Source Serif 4',Georgia,serif;font-size:clamp(14px,2.1vw,16px);line-height:1.45}.p4-rule{margin:8px 0 0;font-size:13px;color:${T.ink2}}
.p4-actions{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:10px;margin-top:4px}.p4-btn{min-height:46px;padding:10px 22px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font-family:inherit;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5),inset 0 0 0 1px rgba(255,91,53,.2)}.p4-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.p4-btn-ready{background:${T.accent};color:#fff}.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}.p4-done{display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 12px;text-align:center}.p4-done h2{margin:0;font-family:'Source Serif 4',Georgia,serif}.p4-score{margin:0;font-family:'JetBrains Mono',monospace}.p4-score b{font-size:clamp(32px,7vw,44px);color:${T.success}}.p4-score span{font-size:14px;color:${T.ink3}}
@media(max-width:520px){.p4-options,.p4-missing{grid-template-columns:1fr}.p4-match-cols{gap:8px}.p4-slot-list{grid-template-columns:1fr}.p4-match-item{font-size:12px;padding:7px}}
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
