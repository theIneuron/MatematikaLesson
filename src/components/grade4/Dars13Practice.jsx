// ============================================================================
// 4-SINF · 13-DARS AMALIYOTI
// Ko'p xonali sonni ikki xonali songa bo'lish
// 10 scored topshiriq + natija · ovozsiz · solve-to-advance
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

const T = {
  bg: '#F5F5F0', paper: '#FFFFFF', ink: '#12212C', ink2: '#50616D', ink3: '#87949D',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', success: '#227A53', successSoft: '#E7F3EC', warn: '#A96F13',
  warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};

const LESSON = {
  id: 'num-4-13-practice',
  title: { ru: 'Урок 13. Практика: деление на двузначное число', uz: "13-dars. Amaliyot: ikki xonali songa bo'lish" },
  skillTags: ['first-incomplete-dividend', 'trial-quotient-digit', 'long-division', 'zero-in-quotient', 'remainder', 'inverse-check'],
};

const UI = {
  task: { ru: 'Задание', uz: "Topshiriq" },
  levels: {
    green: { ru: 'Базовое', uz: "Asosiy" },
    yellow: { ru: 'Применение', uz: "Qo'llash" },
    red: { ru: 'Перенос', uz: "Ko'chirish" },
  },
  check: { ru: 'Проверить', uz: "Tekshirish" },
  retry: { ru: 'Попробовать ещё', uz: "Yana urinib ko'ring" },
  next: { ru: 'Следующее', uz: "Keyingisi" },
  finish: { ru: 'Завершить', uz: "Yakunlash" },
  restart: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
  done: { ru: 'Практика завершена', uz: "Amaliyot tugadi" },
  firstTry: { ru: 'решено с первой попытки', uz: "birinchi urinishda to'g'ri" },
  attempts: { ru: 'Всего проверок', uz: "Jami tekshiruvlar" },
  hint: { ru: 'Подсказка', uz: "Ko'rsatma" },
  rule: { ru: 'Вывод', uz: "Xulosa" },
  typeAnswer: { ru: 'Введите ответ цифрами', uz: "Javobni raqamlar bilan kiriting" },
  clear: { ru: 'Стереть', uz: "O'chirish" },
  slotHint: { ru: 'Выберите место, затем одну карточку.', uz: "Avval joyni, keyin bitta kartani tanlang." },
  matchHint: { ru: 'Выберите карточку слева, затем ответ справа.', uz: "Avval chapdagi kartani, keyin o'ngdagi javobni tanlang." },
  neutral: { ru: 'Все 10 заданий решены.', uz: "10 ta topshiriqning barchasi yechildi." },
};

const tx = (value, lang) => (value && typeof value === 'object' ? (value[lang] ?? value.uz ?? value.ru) : value);
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
    id: '01', level: 'green', kind: 'mc', skillTag: 'first-incomplete-dividend', figure: '9 828 : 36',
    setup: { ru: 'Начните письменное деление слева.', uz: "Yozma bo'lishni chap tomondan boshlang." },
    prompt: { ru: 'Какое первое неполное делимое?', uz: "Birinchi to'liqsiz bo'linuvchi qaysi?" },
    neutralRows: ['9 □ 36', '98 □ 36', '982 □ 36'], neutralFocus: 1,
    visualRows: ['9 < 36', '98 ≥ 36', '982 ≥ 36'], highlight: '98 ≥ 36',
    options: [
      { id: 'a', text: '98', correct: true },
      { id: 'b', text: '9', wrong: { ru: 'Девять меньше делителя 36, поэтому деление с одной цифры начать нельзя.', uz: "9 soni 36 bo'luvchidan kichik, shuning uchun bitta raqamdan bo'lishni boshlab bo'lmaydi." } },
      { id: 'c', text: '982', wrong: { ru: 'Часть 98 уже не меньше 36. Третью цифру брать не нужно.', uz: "98 qismi 36 dan kichik emas. Uchinchi raqamni olish kerak emas." } },
      { id: 'd', text: '9 828', wrong: { ru: 'Нужно выбрать самую короткую подходящую часть слева, а не всё делимое.', uz: "Butun bo'linuvchini emas, chapdagi eng qisqa mos qismini tanlash kerak." } },
    ],
    hints: [
      { ru: 'Сравнивайте левые части числа с делителем 36 по очереди.', uz: "Sonning chap qismlarini 36 bo'luvchi bilan navbatma-navbat taqqoslang." },
      { ru: 'Сначала выделите 9, затем при необходимости добавьте следующую цифру.', uz: "Avval 9 ni ajrating, keyin zarur bo'lsa navbatdagi raqamni qo'shing." },
      { ru: 'Первая цифра мала; проверьте число, составленное из первых двух цифр.', uz: "Birinchi raqam kichik; dastlabki ikki raqamdan tuzilgan sonni tekshiring." },
    ],
    correctText: { ru: 'Верно. Первое неполное делимое — 98.', uz: "To'g'ri. Birinchi to'liqsiz bo'linuvchi 98." },
    rule: { ru: 'Берут наименьшую левую часть, которая не меньше делителя.', uz: "Bo'luvchidan kichik bo'lmagan eng kichik chap qism olinadi." },
  },
  {
    id: '02', level: 'green', kind: 'digit', skillTag: 'trial-quotient-digit', figure: '167 : 28',
    setup: { ru: 'Подберите пробную цифру частного по соседним произведениям.', uz: "Bo'linmaning sinov raqamini yonma-yon ko'paytmalar orqali tanlang." },
    prompt: { ru: 'Какая цифра подходит?', uz: "Qaysi raqam mos keladi?" },
    neutralRows: ['28 × 4 = □', '28 × 5 = □', '28 × 6 = □'], neutralFocus: [1, 2],
    visualRows: ['28 × 4 = 112', '28 × 5 = 140', '28 × 6 = 168'], highlight: '28 × 5 = 140',
    options: [
      { id: 'a', text: '5', correct: true },
      { id: 'b', text: '4', wrong: { ru: 'После 112 остаётся 55, а это не меньше 28. Помещается ещё одна группа.', uz: "112 dan keyin 55 qoladi, bu 28 dan kichik emas. Yana bitta guruh sig'adi." } },
      { id: 'c', text: '6', wrong: { ru: 'Произведение 168 уже больше неполного делимого 167.', uz: "168 ko'paytma 167 to'liqsiz bo'linuvchidan katta." } },
      { id: 'd', text: '28', wrong: { ru: 'В разряд частного записывают одну пробную цифру, а не делитель.', uz: "Bo'linma xonasiga bo'luvchi emas, bitta sinov raqami yoziladi." } },
    ],
    hints: [
      { ru: 'Ищите наибольшее произведение на 28, не превышающее 167.', uz: "167 dan oshmaydigan 28 ning eng katta ko'paytmasini izlang." },
      { ru: 'Сравните две соседние строки 140 и 168 с числом 167.', uz: "Yonma-yon 140 va 168 qatorlarini 167 bilan taqqoslang." },
      { ru: 'Подходящее произведение должно быть не больше 167, а следующее — уже больше.', uz: "Mos ko'paytma 167 dan katta bo'lmasligi, keyingisi esa katta bo'lishi kerak." },
    ],
    correctText: { ru: 'Верно. 140 ≤ 167 < 168, поэтому пробная цифра равна 5.', uz: "To'g'ri. 140 ≤ 167 < 168, shuning uchun sinov raqami 5." },
    rule: { ru: 'Пробную цифру проверяют умножением на двузначный делитель.', uz: "Sinov raqami ikki xonali bo'luvchiga ko'paytirib tekshiriladi." },
  },
  {
    id: '03', level: 'yellow', kind: 'slots', skillTag: 'division-model', figure: { ru: '18 432 детали · 48 равных групп', uz: "18 432 ta detal · 48 ta teng guruh" },
    grid: { rows: 6, cols: 8, label: { ru: '48 групп = 6 × 8', uz: "48 ta guruh = 6 × 8" } },
    neutralRows: [{ ru: '18 432 — всего', uz: "18 432 — jami" }, { ru: '48 — групп', uz: "48 — guruhlar" }, { ru: 'В каждой — □', uz: "Har birida — □" }], neutralFocus: [0, 1],
    visualRows: [{ ru: '18 432 — всего', uz: "18 432 — jami" }, { ru: '48 — групп', uz: "48 — guruhlar" }, { ru: '384 — в каждой', uz: "384 — har birida" }], highlight: { ru: '384 — в каждой', uz: "384 — har birida" },
    setup: { ru: 'Соберите запись: всего 18 432 детали, групп 48, в каждой по 384.', uz: "Yozuvni tuzing: jami 18 432 ta detal, 48 ta teng guruh, har birida 384 tadan." },
    prompt: { ru: 'Какая запись связывает три величины?', uz: "Qaysi yozuv uchta miqdorni bog'laydi?" },
    slots: [
      { id: 'total', label: { ru: 'Всего', uz: "Jami" }, correct: '18432' },
      { id: 'op', label: { ru: 'Действие', uz: "Amal" }, correct: 'divide' },
      { id: 'groups', label: { ru: 'Групп', uz: "Guruhlar" }, correct: '48' },
      { id: 'eq', label: { ru: 'Знак', uz: "Belgi" }, correct: 'equals' },
      { id: 'each', label: { ru: 'В каждой', uz: "Har birida" }, correct: '384' },
    ],
    cards: [
      { id: '18432', text: '18 432' }, { id: 'divide', text: ':' }, { id: '48', text: '48' },
      { id: 'equals', text: '=' }, { id: '384', text: '384' },
    ],
    correctAnswer: '18 432 : 48 = 384',
    wrongText: { ru: 'Проверьте модель: общее количество делят на число равных групп.', uz: "Modelni tekshiring: jami miqdor teng guruhlar soniga bo'linadi." },
    hints: [
      { ru: 'Используйте схему «всего : число групп = в одной группе».', uz: "Jami : guruhlar soni = bitta guruh sxemasidan foydalaning." },
      { ru: 'Сначала поставьте 18 432 в место «всего», а 48 — в место «групп».', uz: "Avval 18 432 ni jami, 48 ni guruhlar o'rniga qo'ying." },
      { ru: 'Между общим количеством и числом групп нужно действие деления.', uz: "Jami miqdor bilan guruhlar soni orasida bo'lish amali kerak." },
    ],
    correctText: { ru: 'Верно. 18 432 : 48 = 384.', uz: "To'g'ri. 18 432 : 48 = 384." },
    rule: { ru: 'Общее количество делят на число равных групп.', uz: "Jami miqdor teng guruhlar soniga bo'linadi." },
  },
  {
    id: '04', level: 'yellow', kind: 'numpad', skillTag: 'long-division', figure: '17 472 : 24 = ?', answer: '728', maxLen: 4,
    setup: { ru: 'Подбирайте каждую цифру частного по произведениям на 24.', uz: "Bo'linmaning har bir raqamini 24 ga ko'paytmalar orqali tanlang." },
    prompt: { ru: 'Какое получилось частное?', uz: "Qanday bo'linma hosil bo'ldi?" },
    neutralRows: ['174 : 24 → □', '67 : 24 → □', '192 : 24 → □'], neutralFocus: 0,
    visualRows: ['174 : 24 → 7', '67 : 24 → 2', '192 : 24 → 8'], highlight: '174 : 24 → 7',
    hintVisual: { ru: 'Первое неполное делимое: 174 : 24', uz: "Birinchi to'liqsiz bo'linuvchi: 174 : 24" },
    wrongByValue: {
      78: { ru: 'В частном потерян разряд. Проверьте все три неполных делимых.', uz: "Bo'linmada bitta xona yo'qolgan. Uchta to'liqsiz bo'linuvchining barchasini tekshiring." },
      7280: { ru: 'Справа добавлен лишний ноль, поэтому ответ увеличился в десять раз.', uz: "O'ng tomonga ortiqcha nol qo'shilgani uchun javob o'n marta kattalashgan." },
    },
    wrongText: { ru: 'Проверьте каждую пробную цифру умножением на 24 и сохраните разряды частного.', uz: "Har bir sinov raqamini 24 ga ko'paytirib tekshiring va bo'linma xonalarini saqlang." },
    hints: [
      { ru: 'Начните с первого неполного делимого 174.', uz: "Birinchi to'liqsiz bo'linuvchi 174 dan boshlang." },
      { ru: 'Найдите ближайшее произведение 24, не превышающее 174.', uz: "174 dan oshmaydigan 24 ning eng yaqin ko'paytmasini toping." },
      { ru: 'После первой цифры вычтите её произведение и снесите следующую цифру.', uz: "Birinchi raqamdan keyin uning ko'paytmasini ayirib, navbatdagi raqamni tushiring." },
    ],
    correctText: { ru: 'Верно. 17 472 : 24 = 728.', uz: "To'g'ri. 17 472 : 24 = 728." },
    rule: { ru: 'Каждую пробную цифру проверяют произведением и остатком.', uz: "Har bir sinov raqami ko'paytma va qoldiq bilan tekshiriladi." },
  },
  {
    id: '05', level: 'yellow', kind: 'missing', layout: 'digits', skillTag: 'zero-in-quotient', figure: '24 816 : 24 = 1□34',
    setup: { ru: 'В частном пропущена одна разрядная цифра.', uz: "Bo'linmada bitta xona raqami tushirib qoldirilgan." },
    prompt: { ru: 'Какая цифра должна стоять в окошке?', uz: "Katakka qaysi raqam yozilishi kerak?" },
    neutralRows: ['24 : 24 → □', '8 < 24 → □', '81 : 24 → □', '96 : 24 → □'], neutralFocus: 1,
    visualRows: ['24 : 24 → 1', '8 < 24 → 0', '81 : 24 → 3', '96 : 24 → 4'], highlight: '8 < 24 → 0',
    options: [
      { id: 'a', text: '0', correct: true },
      { id: 'b', text: '1', wrong: { ru: 'Восемь меньше 24, поэтому в этом разряде даже одна группа не помещается.', uz: "8 soni 24 dan kichik, shuning uchun bu xonaga hatto bitta guruh ham sig'maydi." } },
      { id: 'c', text: '2', wrong: { ru: 'Две группы дали бы 48, а текущая часть равна только 8.', uz: "Ikki guruh 48 ni berar edi, joriy qism esa faqat 8 ga teng." } },
      { id: 'd', text: '4', wrong: { ru: 'Цифра 4 относится к последнему шагу 96 : 24.', uz: "4 raqami oxirgi 96 : 24 qadamiga tegishli." } },
    ],
    hints: [
      { ru: 'У каждого разряда делимого должно сохраниться место в частном.', uz: "Bo'linuvchining har bir xonasi uchun bo'linmada joy saqlanishi kerak." },
      { ru: 'Обратите внимание на шаг, где текущая часть 8 меньше 24.', uz: "Joriy 8 qismi 24 dan kichik bo'lgan qadamga e'tibor bering." },
      { ru: 'Если текущая часть меньше делителя, переходят дальше, не теряя разряд частного.', uz: "Joriy qism bo'luvchidan kichik bo'lsa, bo'linma xonasini yo'qotmasdan davom etiladi." },
    ],
    correctText: { ru: 'Верно. 24 816 : 24 = 1 034.', uz: "To'g'ri. 24 816 : 24 = 1 034." },
    rule: { ru: 'Внутренний ноль сохраняет разряд частного.', uz: "Ichki nol bo'linma xonasini saqlaydi." },
  },
  {
    id: '06', level: 'yellow', kind: 'numpad', skillTag: 'word-division', figure: { ru: '42 525 м дороги · 45 бригад', uz: "42 525 m yo'l · 45 ta brigada" }, answer: '945', maxLen: 6,
    grid: { rows: 5, cols: 9, label: { ru: '45 бригад = 5 × 9', uz: "45 ta brigada = 5 × 9" } },
    neutralRows: [{ ru: '42 525 : 45 = □ на бригаду', uz: "42 525 : 45 = har bir brigadaga □" }], neutralFocus: 0,
    visualRows: [{ ru: '42 525 : 45 = 945 на бригаду', uz: "42 525 : 45 = har bir brigadaga 945" }], highlight: '945',
    setup: { ru: '42 525 метров дороги поровну распределили между 45 бригадами.', uz: "42 525 metr yo'l 45 ta brigadaga teng taqsimlandi." },
    prompt: { ru: 'Какой участок получила каждая бригада?', uz: "Har bir brigada necha metrlik yo'l oldi?" },
    wrongByValue: {
      94: { ru: 'В ответе потеряна цифра единиц. Проверьте последний шаг деления.', uz: "Javobda birliklar raqami yo'qolgan. Bo'lishning oxirgi qadamini tekshiring." },
      9450: { ru: 'Ответ увеличен в десять раз. Проверьте разряды частного.', uz: "Javob o'n marta kattalashgan. Bo'linma xonalarini tekshiring." },
      42570: { ru: 'Это результат сложения 42 525 и 45, а требуется деление.', uz: "Bu 42 525 bilan 45 ni qo'shish natijasi, masalada esa bo'lish kerak." },
      1913625: { ru: 'Это умножение на число бригад вместо деления.', uz: "Bu brigadalar soniga bo'lish o'rniga ko'paytirish natijasi." },
    },
    wrongText: { ru: 'Разделите 42 525 на 45 и проверьте ответ обратным умножением.', uz: "42 525 ni 45 ga bo'lib, javobni teskari ko'paytirish bilan tekshiring." },
    hints: [
      { ru: 'При равном распределении общий путь делят на число бригад.', uz: "Teng taqsimlashda jami yo'l brigadalar soniga bo'linadi." },
      { ru: 'Составьте действие 42 525 : 45.', uz: "42 525 : 45 amalini tuzing." },
      { ru: 'Для первой цифры частного сравните 425 с произведениями на 45.', uz: "Bo'linmaning birinchi raqami uchun 425 ni 45 ga ko'paytmalar bilan taqqoslang." },
    ],
    correctText: { ru: 'Верно. Каждая бригада получила 945 метров.', uz: "To'g'ri. Har bir brigada 945 metr yo'l oldi." },
    rule: { ru: 'Проверка: 945 × 45 = 42 525.', uz: "Tekshiruv: 945 × 45 = 42 525." },
  },
  {
    id: '07', level: 'yellow', kind: 'match', skillTag: 'quotient-digits', figure: '14 784 : 32',
    setup: { ru: 'Каждое неполное делимое даёт одну цифру частного.', uz: "Har bir to'liqsiz bo'linuvchi bo'linmaning bitta raqamini beradi." },
    prompt: { ru: 'Соедините неполные делимые с цифрами частного.', uz: "To'liqsiz bo'linuvchilarni bo'linma raqamlari bilan moslashtiring." },
    pairs: [
      { id: 'p147', left: '147', correctRight: 'd4', wrong: { ru: 'Проверьте произведения 32 на 4 и на 5. Второе уже больше 147.', uz: "32 ning 4 va 5 ga ko'paytmalarini tekshiring. Ikkinchisi 147 dan katta." } },
      { id: 'p198', left: '198', correctRight: 'd6', wrong: { ru: 'Ищите ближайшее произведение 32, которое не превышает 198.', uz: "198 dan oshmaydigan 32 ning eng yaqin ko'paytmasini izlang." } },
      { id: 'p64', left: '64', correctRight: 'd2', wrong: { ru: 'Это точное произведение 32 на одну из цифр.', uz: "Bu 32 ning raqamlardan biriga aniq ko'paytmasi." } },
    ],
    right: [{ id: 'd2', text: '2' }, { id: 'd4', text: '4' }, { id: 'd6', text: '6' }],
    correctAnswer: '147 → 4; 198 → 6; 64 → 2',
    neutralRows: ['147 → □', '198 → □', '64 → □'], neutralFocus: 2,
    visualRows: ['147 → 4', '198 → 6', '64 → 2'], highlight: '64 → 2',
    hints: [
      { ru: 'Для каждого числа отдельно найдите ближайшее произведение на 32.', uz: "Har bir son uchun 32 ning eng yaqin ko'paytmasini alohida toping." },
      { ru: 'Начните с точного случая 64 и сравните его с 32.', uz: "Aniq 64 holatidan boshlang va uni 32 bilan taqqoslang." },
      { ru: 'Для 147 проверьте границу между произведениями на 4 и на 5.', uz: "147 uchun 4 va 5 ga ko'paytmalar orasidagi chegarani tekshiring." },
    ],
    correctText: { ru: 'Верно. Цифры частного образуют число 462.', uz: "To'g'ri. Bo'linma raqamlari 462 sonini hosil qiladi." },
    rule: { ru: '14 784 : 32 = 462.', uz: "14 784 : 32 = 462." },
  },
  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'remainder', figure: '28 763 : 35',
    setup: { ru: 'Найдите частное и остаток.', uz: "Bo'linma va qoldiqni toping." },
    prompt: { ru: 'Какой ответ верен?', uz: "Qaysi javob to'g'ri?" },
    neutralRows: ['□ × 35 + r = 28 763', '0 ≤ r < 35'], neutralFocus: 0,
    remainderMeter: { limit: '35', label: { ru: 'Допустимый остаток', uz: "Mumkin bo'lgan qoldiq" } },
    visualRows: ['35 × 821 = 28 735', '28 763 − 28 735 = 28', '28 < 35'], highlight: '28 < 35',
    hintVisual: '28 763 − 35 × □',
    options: [
      { id: 'a', text: { ru: '821, остаток 28', uz: "821, qoldiq 28" }, correct: true },
      { id: 'b', text: { ru: '820, остаток 63', uz: "820, qoldiq 63" }, wrong: { ru: 'Остаток 63 больше делителя 35. В частное помещается ещё одна группа.', uz: "63 qoldiq 35 bo'luvchidan katta. Bo'linmaga yana bitta guruh sig'adi." } },
      { id: 'c', text: { ru: '822, остаток 28', uz: "822, qoldiq 28" }, wrong: { ru: 'Произведение 822 и 35 уже больше делимого; остаток нельзя просто оставить прежним.', uz: "822 bilan 35 ning ko'paytmasi bo'linuvchidan katta; qoldiqni o'zgarishsiz qoldirib bo'lmaydi." } },
      { id: 'd', text: { ru: '821, остаток 35', uz: "821, qoldiq 35" }, wrong: { ru: 'Остаток не может быть равен делителю: это ещё одна полная группа.', uz: "Qoldiq bo'luvchiga teng bo'la olmaydi: bu yana bitta to'liq guruh." } },
    ],
    hints: [
      { ru: 'Проверьте варианты обратным умножением и условием об остатке.', uz: "Variantlarni teskari ko'paytirish va qoldiq sharti bilan tekshiring." },
      { ru: 'Выделите строку проверки с неизвестным частным и остатком.', uz: "Noma'lum bo'linma va qoldiqli tekshiruv qatorini ajrating." },
      { ru: 'Вычтите произведение из делимого и сравните разность с 35.', uz: "Ko'paytmani bo'linuvchidan ayirib, ayirmani 35 bilan taqqoslang." },
    ],
    correctText: { ru: 'Верно. 28 763 : 35 = 821, остаток 28.', uz: "To'g'ri. 28 763 : 35 = 821, qoldiq 28." },
    rule: { ru: 'Остаток должен быть меньше двузначного делителя.', uz: "Qoldiq ikki xonali bo'luvchidan kichik bo'lishi kerak." },
  },
  {
    id: '09', level: 'red', kind: 'mc', skillTag: 'trial-digit-repair', figure: '15 456 : 32\n154 : 32 → 5  ✕',
    setup: { ru: 'В решении для 154 выбрали пробную цифру 5.', uz: "Yechimda 154 uchun 5 sinov raqami tanlangan." },
    prompt: { ru: 'Как исправить первую цифру частного?', uz: "Bo'linmaning birinchi raqamini qanday tuzatish kerak?" },
    neutralRows: ['32 × 5 = 160', '160 > 154', { ru: 'Исправленная цифра — □', uz: "Tuzatilgan raqam — □" }], neutralFocus: [0, 1],
    visualRows: ['32 × 4 = 128', '32 × 5 = 160', '160 > 154'], highlight: '32 × 4 = 128',
    options: [
      { id: 'a', text: '483', correct: true },
      { id: 'b', text: '583', wrong: { ru: 'Первая цифра 5 слишком велика: 32 × 5 = 160, а 160 > 154.', uz: "Birinchi 5 raqami juda katta: 32 × 5 = 160 va 160 > 154." } },
      { id: 'c', text: '48', wrong: { ru: 'Так потерян разряд единиц. Частное должно содержать три разрядные цифры.', uz: "Bunda birliklar xonasi yo'qolgan. Bo'linma uchta xona raqamidan iborat bo'lishi kerak." } },
      { id: 'd', text: '403', wrong: { ru: 'Ноль ошибочно поставлен в разряд десятков. После первого вычитания новое неполное делимое позволяет получить ненулевую цифру.', uz: "Nol o'nlar xonasiga xato qo'yilgan. Birinchi ayirishdan keyingi yangi to'liqsiz bo'linuvchi noldan farqli raqam beradi." } },
    ],
    hints: [
      { ru: 'Умножьте пробную цифру на настоящий делитель и сравните с 154.', uz: "Sinov raqamini haqiqiy bo'luvchiga ko'paytirib, 154 bilan taqqoslang." },
      { ru: 'Выделите неравенство 160 > 154.', uz: "160 > 154 tengsizligini ajrating." },
      { ru: 'Если произведение слишком велико, пробную цифру уменьшают на один и проверяют снова.', uz: "Ko'paytma juda katta bo'lsa, sinov raqami bittaga kamaytirilib yana tekshiriladi." },
    ],
    correctText: { ru: 'Верно. Первая цифра 4, полное частное равно 483.', uz: "To'g'ri. Birinchi raqam 4, to'liq bo'linma 483 ga teng." },
    rule: { ru: 'Слишком большую пробную цифру уменьшают.', uz: "Juda katta sinov raqami kamaytiriladi." },
  },
  {
    id: '10', level: 'red', kind: 'mc', skillTag: 'estimate-and-check', figure: '31 680 : 48',
    setup: { ru: 'Сначала оцените ответ, затем проверьте точное частное.', uz: "Avval javobni taxmin qiling, keyin aniq bo'linmani tekshiring." },
    prompt: { ru: 'Какой вывод согласуется и с оценкой, и с проверкой?', uz: "Qaysi xulosa taxmin va tekshiruvning ikkalasiga ham mos?" },
    neutralRows: ['32 000 : 50 ≈ 640', '□ × 48 = 31 680'], neutralFocus: 0,
    estimateScale: { from: '600', marker: '≈ 640', to: '700' },
    visualRows: ['32 000 : 50 ≈ 640', '660 × 48 = 31 680'], highlight: '660 × 48 = 31 680',
    hintVisual: '32 000 : 50 ≈ □',
    options: [
      { id: 'a', text: { ru: 'Точное частное 660; 660 × 48 = 31 680', uz: "Aniq bo'linma 660; 660 × 48 = 31 680" }, correct: true },
      { id: 'b', text: { ru: 'Точное частное 640, потому что такова оценка', uz: "Aniq bo'linma 640, chunki taxmin shunday" }, wrong: { ru: 'Оценка показывает только порядок величины. Обратное умножение 640 на 48 не возвращает делимое.', uz: "Taxmin faqat kattalikni ko'rsatadi. 640 ni 48 ga teskari ko'paytirish bo'linuvchini qaytarmaydi." } },
      { id: 'c', text: { ru: 'Точное частное 66', uz: "Aniq bo'linma 66" }, wrong: { ru: 'Этот ответ в десять раз меньше оценки около 640.', uz: "Bu javob 640 atrofidagi taxmindan o'n marta kichik." } },
      { id: 'd', text: { ru: 'Точное частное 6 600', uz: "Aniq bo'linma 6 600" }, wrong: { ru: 'Этот ответ в десять раз больше оценки и даёт слишком большое произведение.', uz: "Bu javob taxmindan o'n marta katta va juda katta ko'paytma beradi." } },
    ],
    hints: [
      { ru: 'Точный ответ должен быть близок к 640 и вернуть делимое при умножении на 48.', uz: "Aniq javob 640 ga yaqin bo'lib, 48 ga ko'paytirilganda bo'linuvchini qaytarishi kerak." },
      { ru: 'Сравните порядок каждого варианта с оценкой 640.', uz: "Har bir variantning kattaligini 640 taxmin bilan taqqoslang." },
      { ru: 'Проверьте ближайший вариант умножением на 48.', uz: "Eng yaqin variantni 48 ga ko'paytirib tekshiring." },
    ],
    correctText: { ru: 'Верно. 31 680 : 48 = 660.', uz: "To'g'ri. 31 680 : 48 = 660." },
    rule: { ru: 'Оценка контролирует величину, а обратное умножение подтверждает точность.', uz: "Taxmin kattalikni nazorat qiladi, teskari ko'paytirish esa aniqlikni tasdiqlaydi." },
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
  { id: 'p07', type: 'practice', template: 'matching', scored: true, scope: 'module-mikro' },
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

function MatchBoard({ task, rightCards, pairs, setPairs, activeLeft, setActiveLeft, checked, solved, lang }) {
  const activate = (leftId) => {
    if (solved) return;
    setPairs((old) => { const next = { ...old }; delete next[leftId]; return next; });
    setActiveLeft(leftId);
  };
  const connect = (rightId) => {
    if (!activeLeft || solved) return;
    setPairs((old) => {
      const next = { ...old };
      Object.keys(next).forEach((leftId) => { if (next[leftId] === rightId) delete next[leftId]; });
      next[activeLeft] = rightId;
      return next;
    });
    setActiveLeft(null);
  };
  return (
    <div className="g4p-match">
      <p className="g4p-note">{tx(UI.matchHint, lang)}</p>
      <div className="g4p-match-cols">
        <div className="g4p-match-col">{task.pairs.map((pair) => {
          const right = task.right.find((item) => item.id === pairs[pair.id]);
          const wrong = checked && pairs[pair.id] !== pair.correctRight;
          return <button key={pair.id} type="button" className={`${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''} ${checked ? (wrong ? 'is-no' : 'is-ok') : ''}`} aria-pressed={activeLeft === pair.id} disabled={solved} onClick={() => activate(pair.id)}><span>{tx(pair.left, lang)}</span>{right && <b>{tx(right.text, lang)}</b>}</button>;
        })}</div>
        <div className="g4p-match-col">{rightCards.map((right) => {
          const used = Object.values(pairs).includes(right.id);
          return <button key={right.id} type="button" className={used ? 'is-used' : ''} aria-pressed={used} disabled={solved || !activeLeft || used} onClick={() => connect(right.id)}>{tx(right.text, lang)}</button>;
        })}</div>
      </div>
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

function Task({ task, taskIndex, lang, onSolved }) {
  const isChoice = task.kind === 'mc' || task.kind === 'digit' || task.kind === 'missing';
  const isAssign = task.kind === 'slots' || task.kind === 'order';
  const options = useMemo(() => isChoice ? shuffle(task.options) : [], [isChoice, task]);
  const cards = useMemo(() => isAssign ? shuffle(task.cards) : [], [isAssign, task]);
  const rightCards = useMemo(() => task.kind === 'match' ? shuffle(task.right) : [], [task]);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [placed, setPlaced] = useState({});
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [activeSlot, setActiveSlot] = useState(isAssign ? task.slots[0].id : null);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const advancedRef = useRef(false);
  const checkingRef = useRef(false);
  const feedbackRef = useRef(null);

  const isCorrect = isChoice
    ? options[picked]?.correct === true
    : task.kind === 'numpad'
      ? typed === task.answer
      : task.kind === 'match'
        ? task.pairs.every((pair) => pairs[pair.id] === pair.correctRight)
        : task.slots.every((slot) => placed[slot.id] === slot.correct);
  const canCheck = isChoice
    ? picked !== null
    : task.kind === 'numpad'
      ? typed.length > 0
      : task.kind === 'match'
        ? task.pairs.every((pair) => pairs[pair.id])
        : task.slots.every((slot) => placed[slot.id]);
  const wrongText = isChoice
    ? options[picked]?.wrong
    : task.kind === 'numpad'
      ? (task.wrongByValue?.[typed] ?? task.wrongText)
      : task.kind === 'match'
        ? task.pairs.find((pair) => pairs[pair.id] !== pair.correctRight)?.wrong
        : task.wrongText;

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
    if (isCorrect) setSolved(true);
  };
  const answerDetails = () => {
    if (isChoice) return {
      options: options.map((option) => tx(option.text, lang)),
      correctIndex: options.findIndex((option) => option.correct),
      correctAnswer: tx(options.find((option) => option.correct)?.text, lang),
      studentAnswerIndex: picked,
      studentAnswer: tx(options[picked]?.text, lang),
    };
    if (task.kind === 'numpad') return { options: null, correctIndex: null, correctAnswer: task.answer, studentAnswerIndex: null, studentAnswer: typed };
    if (task.kind === 'match') return {
      options: rightCards.map((right) => tx(right.text, lang)), correctIndex: null, correctAnswer: tx(task.correctAnswer, lang), studentAnswerIndex: null,
      studentAnswer: task.pairs.map((pair) => `${tx(pair.left, lang)} → ${tx(task.right.find((right) => right.id === pairs[pair.id])?.text, lang)}`).join('; '),
    };
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

  return (
    <section className="g4p-task" aria-labelledby={`g4p-task-${task.id}`}>
      <p className={`g4p-eyebrow is-${task.level}`}><span>{tx(UI.levels[task.level], lang)}</span> · {tx(UI.task, lang)} {task.id}</p>
      <p className="g4p-setup">{tx(task.setup, lang)}</p>
      <Visual task={task} hintLevel={checked && !solved ? attempts : 0} solved={solved} lang={lang} />
      <h1 id={`g4p-task-${task.id}`} className="g4p-question">{tx(task.prompt, lang)}</h1>

      {isChoice && <div className={`g4p-options ${task.kind === 'digit' || task.layout === 'digits' ? 'is-digits' : ''}`}>{options.map((option, index) => (
        <button key={option.id} type="button" className={`${picked === index ? 'is-selected' : ''} ${checked && picked === index ? (option.correct ? 'is-ok' : 'is-no') : ''}`} aria-pressed={picked === index} disabled={solved} onClick={() => { setPicked(index); clearFeedback(); }}><span className="g4p-letter">{'ABCD'[index]}</span><span>{tx(option.text, lang)}</span></button>
      ))}</div>}
      {task.kind === 'numpad' && <NumPad value={typed} max={task.maxLen} disabled={solved} lang={lang} onChange={(value) => { setTyped(value); clearFeedback(); }} />}
      {isAssign && <AssignBoard task={task} cards={cards} placed={placed} setPlaced={(updater) => { setPlaced(updater); clearFeedback(); }} activeSlot={activeSlot} setActiveSlot={(slot) => { setActiveSlot(slot); clearFeedback(); }} checked={checked} solved={solved} lang={lang} />}
      {task.kind === 'match' && <MatchBoard task={task} rightCards={rightCards} pairs={pairs} setPairs={(updater) => { setPairs(updater); clearFeedback(); }} activeLeft={activeLeft} setActiveLeft={(left) => { setActiveLeft(left); clearFeedback(); }} checked={checked} solved={solved} lang={lang} />}

      {checked && <Feedback task={task} solved={solved} attempts={attempts} wrongText={wrongText} lang={lang} feedbackRef={feedbackRef} />}
      <div className="g4p-actions">
        {!solved && <button type="button" className="g4p-btn" disabled={!canCheck || checked} onClick={check}>{tx(UI.check, lang)}</button>}
        {checked && !solved && <button type="button" className="g4p-btn is-ghost" onClick={clearFeedback}>{tx(UI.retry, lang)}</button>}
        {solved && <button type="button" className="g4p-btn is-ready" onClick={advance}>{tx(taskIndex === TASKS.length - 1 ? UI.finish : UI.next, lang)}</button>}
      </div>
    </section>
  );
}

export default function Grade4Dars13Practice({ lang: langProp, onFinished }) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = preview ? previewLang : langProp;
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
      {preview && <div className="g4p-lang" role="group" aria-label="Language">{['ru', 'uz'].map((code) => <button key={code} type="button" className={lang === code ? 'is-active' : ''} aria-pressed={lang === code} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}
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
.g4p-match{display:flex;flex-direction:column;gap:9px}.g4p-match-cols{display:grid;grid-template-columns:1fr 1fr;gap:9px}.g4p-match-col{display:flex;min-width:0;flex-direction:column;gap:8px}.g4p-match-col button{display:flex;min-width:0;min-height:52px;align-items:center;justify-content:center;gap:8px;padding:8px;border:0;border-radius:12px;background:${T.paper};color:${T.navy};font:800 14px 'JetBrains Mono',monospace;box-shadow:0 7px 18px -15px rgba(${T.shadowBase},.7);cursor:pointer}.g4p-match-col button b{color:${T.success}}.g4p-match-col button.is-active{background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.55)}.g4p-match-col button.is-tied,.g4p-match-col button.is-ok{background:${T.successSoft}}.g4p-match-col button.is-no{background:${T.warnSoft}}.g4p-match-col button.is-used{background:${T.cyanSoft};opacity:.55}
.g4p-feedback{padding:13px 15px;border-radius:14px;line-height:1.48}.g4p-feedback.is-ok{background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}.g4p-feedback.is-no{background:${T.warnSoft};box-shadow:inset 4px 0 0 ${T.warn}}.g4p-feedback p{font:500 clamp(14px,2vw,16px)/1.48 'Source Serif 4',Georgia,serif}.g4p-hint,.g4p-rule{margin-top:7px!important;color:${T.ink2}}.g4p-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:9px}.g4p-actions.is-center{justify-content:center}.g4p-btn{min-width:108px;min-height:46px;padding:10px 18px;border:0;border-radius:13px;background:${T.paper};color:${T.accent};font:800 14px 'Manrope',sans-serif;box-shadow:0 9px 22px -14px rgba(255,91,53,.52);cursor:pointer}.g4p-btn.is-ready{background:${T.accent};color:#fff}.g4p-btn.is-ghost{background:transparent;color:${T.ink2};box-shadow:none}.g4p-btn:disabled{opacity:.42;cursor:not-allowed;transform:none}
.g4p-result{display:flex;min-height:430px;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center;border-radius:22px;background:${T.paper};box-shadow:0 18px 44px -34px rgba(${T.shadowBase},.68)}.g4p-result-kicker{color:${T.accent};font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.g4p-result h1{color:${T.success};font:800 clamp(44px,9vw,68px) 'JetBrains Mono',monospace}.g4p-result>p:not(.g4p-result-kicker):not(.g4p-note){color:${T.ink2}}.g4p-stat{display:flex;width:min(330px,100%);align-items:center;justify-content:space-between;padding:12px 14px;border-radius:13px;background:${T.cyanSoft};color:${T.cyan}}.g4p-stat b{font:800 20px 'JetBrains Mono',monospace}
@media(max-width:560px){.g4p-options{grid-template-columns:1fr}.g4p-slots{grid-template-columns:repeat(2,minmax(0,1fr))}.g4p-setup{line-height:1.4}.g4p-visual{padding:12px}.g4p-result{min-height:360px;padding:18px 12px}}@media(max-width:380px){.g4p-slots{grid-template-columns:1fr}.g4p-head-row{align-items:flex-start}.g4p-title{font-size:14px}}
@media(prefers-reduced-motion:reduce){.g4p-root *,.g4p-root *::before,.g4p-root *::after{animation:none!important;scroll-behavior:auto!important;transition:none!important}.g4p-options button:hover:not(:disabled){transform:none}}
`;
