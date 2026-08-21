// ============================================================================
// 4-SINF · Dars 5 amaliyoti — Ko'p xonali sonlarni yaxlitlash
// Dars01Practice vizual/texnik etaloni asosida: 10 topshiriq, RU/UZ, ovozsiz.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';
import { PRACTICE_FIX_CSS } from './grade4PracticeFixStyles.js';

const T = {
  bg: '#F5F5F0', paper: '#FFFFFF', ink: '#12212C', ink2: '#50616D', ink3: '#87949D',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', success: '#227A53', successSoft: '#E7F3EC', warn: '#A96F13', warnSoft: '#FFF5D9',
};

const UI = {
  title: { ru: 'Урок 5. Практика: округление чисел', uz: "5-dars. Amaliyot: sonlarni yaxlitlash", en: 'Lesson 5. Practice: rounding numbers' },
  task: { ru: 'Задание', uz: 'Topshiriq' , en: "Task"}, check: { ru: 'Проверить', uz: 'Tekshirish' , en: "Check"},
  next: { ru: 'Следующее', uz: 'Keyingisi' , en: "Next"}, again: { ru: 'Пройти заново', uz: 'Qaytadan', en: 'Start again' },
  rule: { ru: 'Запомни', uz: 'Eslab qoling' , en: "Remember"}, retry: { ru: 'Проверить ещё раз', uz: 'Yana bir tekshiring' , en: "Check again"},
  chooseGap: { ru: 'Нажми на место границы между классами', uz: 'Sinflar chegarasi joyiga bosing' , en: "Tap where the boundary between the three-digit groups belongs"},
  typeAnswer: { ru: 'Набери ответ', uz: 'Javobni kiriting' , en: "Enter your answer"}, clear: { ru: 'Стереть', uz: "O'chirish", en: 'Clear' },
  matchHint: { ru: 'Сначала выбери строку слева, затем пару справа', uz: "Avval chapdagi qatorni, keyin o'ngdagi juftini tanlang" , en: "First choose a row on the left, then its match on the right"},
  done: { ru: 'Практика пройдена', uz: 'Amaliyot tugadi' , en: "Practice complete"}, ofTen: { ru: 'из 10', uz: '10 dan' , en: "out of 10"},
};

const LESSON_META = {
  lessonId: 'num-4-05-practice',
  lessonTitle: UI.title,
  skillTags: ['rounding', 'place-value', 'estimation'],
};

const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';
const tx = (node, lang) => (node && typeof node === 'object' ? (node[lang] ?? node.uz) : node);
const grouped = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const shuffle = (items) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const TASKS = [
  {
    id: '01', kind: 'mc', level: '🟢', figure: '64 372 → ?',
    setup: { ru: 'Табло показывает точное число.', uz: "Tablo aniq sonni ko'rsatmoqda.", en: 'The display shows an exact number.' },
    prompt: { ru: 'Округли число до десятков.', uz: "Sonni o'nlikkacha yaxlitlang.", en: 'Round the number to the nearest ten.' },
    options: [
      { text: { ru: '64 370', uz: '64 370' , en: "64 370"}, correct: true },
      { text: { ru: '64 380', uz: '64 380' , en: "64 380"}, wrong: { ru: 'Цифра единиц равна 2, поэтому десятки не увеличиваются.', uz: "Birlar xonasidagi raqam 2, shuning uchun o'nlar oshmaydi.", en: 'The ones digit is 2, so the tens digit does not increase.' } },
      { text: { ru: '64 300', uz: '64 300' , en: "64 300"}, wrong: { ru: 'Так число округлено до сотен. Требуется сохранить десятки.', uz: "Bunda son yuzlikkacha yaxlitlangan. O'nlar xonasini saqlash kerak.", en: 'This rounds the number to the nearest hundred. The tens place must be preserved.' } },
      { text: { ru: '64 372', uz: '64 372' , en: "64 372"}, wrong: { ru: 'Это точное число. После округления цифра единиц заменяется нулём.', uz: "Bu aniq son. Yaxlitlangandan keyin birlar xonasi nol bilan almashtiriladi.", en: 'This is the exact number. After rounding, the ones digit is replaced by zero.' } },
    ],
    correctText: { ru: 'Верно: 64 372 ≈ 64 370. Двойка ведёт вниз.', uz: "To'g'ri: 64 372 ≈ 64 370. Ikki pastga olib boradi.", en: 'Correct: 64,372 ≈ 64,370. A 2 rounds down.' },
    rule: { ru: 'Для округления до десятков смотри на единицы.', uz: "O'nlikkacha yaxlitlashda birlar xonasiga qarang.", en: 'To round to the nearest ten, look at the ones digit.' },
  },
  {
    id: '02', kind: 'gap', level: '🟢', number: 538476, correctGap: 3,
    setup: { ru: 'Нужно отделить сохраняемую часть от заменяемой.', uz: "Saqlanadigan qismni almashtiriladigan qismdan ajratish kerak.", en: 'Separate the part that stays from the part that will be replaced.' },
    prompt: { ru: 'Поставь границу округления до тысяч.', uz: "Minglikkacha yaxlitlash chegarasini qo'ying.", en: 'Place the boundary for rounding to the nearest thousand.' },
    gapWrong: {
      1: { ru: 'Так отделены только единицы, это граница округления до десятков.', uz: "Bunda faqat birlar ajratildi, bu o'nlikkacha yaxlitlash chegarasi.", en: 'This separates only the ones, which is the boundary for rounding to tens.' },
      2: { ru: 'Так отделены десятки и единицы, это граница округления до сотен.', uz: "Bunda o'nlar va birlar ajratildi, bu yuzlikkacha yaxlitlash chegarasi.", en: 'This separates the tens and ones, which is the boundary for rounding to hundreds.' },
      4: { ru: 'Так заменились бы четыре цифры, а нужно заменить три разряда справа.', uz: "Bunda to'rtta raqam almashardi, o'ngdagi uchta xonani almashtirish kerak.", en: 'This would replace four digits, but only the three places on the right should be replaced.' },
      5: { ru: 'Граница поставлена перед десятками тысяч. Требуется округление до тысяч.', uz: "Chegara o'n minglar oldiga qo'yildi. Minglikkacha yaxlitlash kerak.", en: 'The boundary is before the ten-thousands digit, but the number must be rounded to thousands.' },
    },
    correctText: { ru: 'Верно: 538 | 476. Сохраняется класс тысяч, решение принимает цифра 4.', uz: "To'g'ri: 538 | 476. Minglar sinfi saqlanadi, qarorni 4 raqami beradi.", en: 'Correct: 538 | 476. The thousands group stays, and the digit 4 decides the rounding.' },
    rule: { ru: 'Справа от разряда округления все цифры будут заменены нулями.', uz: "Yaxlitlash xonasidan o'ngdagi barcha raqamlar nolga almashtiriladi.", en: 'All digits to the right of the rounding place are replaced by zeros.' },
  },
  {
    id: '03', kind: 'mc', level: '🟡', figure: '132 600 ── 132 649 ── 132 700',
    setup: { ru: 'Число находится между соседними сотнями.', uz: "Son qo'shni yuzliklar orasida joylashgan.", en: 'The number lies between two neighbouring hundreds.' },
    prompt: { ru: 'К какой сотне оно ближе?', uz: "U qaysi yuzlikka yaqinroq?", en: 'Which hundred is it closer to?' },
    options: [
      { text: { ru: '132 600', uz: '132 600' , en: "132 600"}, correct: true },
      { text: { ru: '132 700', uz: '132 700' , en: "132 700"}, wrong: { ru: 'До 132 600 осталось 49, а до 132 700 — 51. Нижняя сотня ближе.', uz: "132 600 gacha 49, 132 700 gacha 51 qoldi. Pastki yuzlik yaqinroq.", en: 'The distance to 132,600 is 49, while the distance to 132,700 is 51. The lower hundred is closer.' } },
      { text: { ru: '132 650', uz: '132 650' , en: "132 650"}, wrong: { ru: '132 650 — середина, а не результат округления до сотен.', uz: "132 650 o'rta nuqta, yuzlikkacha yaxlitlash natijasi emas.", en: '132,650 is the midpoint, not a result of rounding to the nearest hundred.' } },
      { text: { ru: '132 640', uz: '132 640' , en: "132 640"}, wrong: { ru: 'Такое число не кратно ста. Результат должен оканчиваться двумя нулями.', uz: "Bu son yuzga karrali emas. Natija ikkita nol bilan tugashi kerak.", en: 'This number is not a multiple of one hundred. The result must end in two zeros.' } },
    ],
    correctText: { ru: 'Верно. 132 649 находится ниже середины 132 650 и округляется до 132 600.', uz: "To'g'ri. 132 649 soni 132 650 o'rta nuqtadan pastda va 132 600 gacha yaxlitlanadi.", en: 'Correct. 132,649 is below the midpoint 132,650, so it rounds to 132,600.' },
    rule: { ru: 'Цифры от 0 до 4 ведут к нижнему круглому числу.', uz: "0 dan 4 gacha bo'lgan raqamlar pastki yaxlit songa olib boradi.", en: 'Digits from 0 to 4 round down to the lower round number.' },
  },
  {
    id: '04', kind: 'numpad', level: '🟡', answer: '417000', maxLen: 6, figure: '417 286 → ?',
    setup: { ru: 'Городскому экрану нужна точность до тысяч.', uz: "Shahar ekraniga minglikkacha aniqlik kerak.", en: 'The city display needs an answer rounded to the nearest thousand.' },
    prompt: { ru: 'Введи округлённое число.', uz: "Yaxlitlangan sonni kiriting.", en: 'Enter the rounded number.' },
    hints: [
      { ru: 'Сохрани разряд тысяч и посмотри на сотни.', uz: "Minglar xonasini saqlang va yuzlar xonasiga qarang.", en: 'Keep the thousands place and look at the hundreds digit.' },
      { ru: 'В сотнях стоит 2. Тысячи не увеличиваются, а три младших разряда становятся нулями.', uz: "Yuzlar xonasida 2 turibdi. Minglar oshmaydi, uchta kichik xona nolga aylanadi.", en: 'The hundreds digit is 2. The thousands do not increase, and the three lower places become zeros.' },
    ],
    correctText: { ru: 'Верно: 417 286 ≈ 417 000.', uz: "To'g'ri: 417 286 ≈ 417 000.", en: 'Correct: 417,286 ≈ 417,000.' },
    rule: { ru: 'При округлении до тысяч решение принимает цифра сотен.', uz: "Minglikkacha yaxlitlashda qarorni yuzlar xonasidagi raqam beradi.", en: 'When rounding to the nearest thousand, the hundreds digit decides.' },
  },
  {
    id: '05', kind: 'numpad', level: '🟡', answer: '8', maxLen: 1, figure: '285 760 → 285 □00',
    setup: { ru: 'В результате округления до сотен пропала одна цифра.', uz: "Yuzlikkacha yaxlitlash natijasida bitta raqam tushib qolgan.", en: 'One digit is missing from the result rounded to the nearest hundred.' },
    prompt: { ru: 'Какую цифру нужно вернуть?', uz: "Qaysi raqamni qaytarish kerak?", en: 'Which digit is missing?' },
    hints: [
      { ru: 'Посмотри на десятки исходного числа.', uz: "Boshlang'ich sonning o'nlar xonasiga qarang.", en: 'Look at the tens digit of the original number.' },
      { ru: 'В десятках стоит 6, поэтому 7 сотен увеличиваются до 8 сотен.', uz: "O'nlar xonasida 6, shuning uchun 7 yuzlik 8 yuzlikka oshadi.", en: 'The tens digit is 6, so 7 hundreds increase to 8 hundreds.' },
    ],
    correctText: { ru: 'Верно. Получается 285 800.', uz: "To'g'ri. 285 800 hosil bo'ladi.", en: 'Correct. The result is 285,800.' },
    rule: { ru: 'Цифры от 5 до 9 увеличивают сохраняемый разряд на один.', uz: "5 dan 9 gacha bo'lgan raqamlar saqlanadigan xonani birga oshiradi.", en: 'Digits from 5 to 9 increase the kept digit by one.' },
  },
  {
    id: '06', kind: 'mc', level: '🟡', figure: '73 482',
    setup: { ru: 'На обзорном табло нужно показать примерное число посетителей.', uz: "Umumiy tabloda tashrifchilar sonini taxminan ko'rsatish kerak.", en: 'The overview display needs an approximate visitor count.' },
    prompt: { ru: 'Какое значение подходит для точности до тысяч?', uz: "Minglikkacha aniqlik uchun qaysi qiymat mos?", en: 'Which value is suitable when rounding to the nearest thousand?' },
    options: [
      { text: { ru: 'Около 73 000', uz: 'Taxminan 73 000', en: 'About 73,000' }, correct: true },
      { text: { ru: 'Около 74 000', uz: 'Taxminan 74 000', en: 'About 74,000' }, wrong: { ru: 'В сотнях стоит 4, поэтому тысячи не увеличиваются.', uz: "Yuzlar xonasida 4, shuning uchun minglar oshmaydi.", en: 'The hundreds digit is 4, so the thousands do not increase.' } },
      { text: { ru: 'Ровно 73 482', uz: 'Aynan 73 482', en: 'Exactly 73,482' }, wrong: { ru: 'Это точное значение, а обзорному табло требуется приближение до тысяч.', uz: "Bu aniq qiymat, umumiy tablo esa minglikkacha taqribiy qiymatni talab qiladi.", en: 'This is the exact value, but the overview display needs an approximation to the nearest thousand.' } },
      { text: { ru: 'Около 70 000', uz: 'Taxminan 70 000', en: 'About 70,000' }, wrong: { ru: 'Это округление до десятков тысяч, а требуется точность до тысяч.', uz: "Bu o'n minglikkacha yaxlitlash, minglikkacha aniqlik kerak.", en: 'This is rounding to the nearest ten thousand, but the required precision is to the nearest thousand.' } },
    ],
    correctText: { ru: 'Верно. Для обзорного табло подходит приблизительное значение 73 000.', uz: "To'g'ri. Umumiy tablo uchun 73 000 taqribiy qiymati mos.", en: 'Correct. An approximate value of 73,000 is suitable for the overview display.' },
    rule: { ru: 'Точность округления выбирается по задаче.', uz: "Yaxlitlash aniqligi vazifaga qarab tanlanadi.", en: 'Choose the rounding precision to suit the problem.' },
  },
  {
    id: '07', kind: 'match', level: '🟡',
    setup: { ru: 'Округли три числа до сотен.', uz: "Uchta sonni yuzlikkacha yaxlitlang.", en: 'Round the three numbers to the nearest hundred.' },
    prompt: { ru: 'Соедини число с результатом.', uz: "Sonni natija bilan moslashtiring.", en: 'Match each number to its result.' },
    pairs: [
      { id: 'a', left: { ru: '91 249', uz: '91 249' , en: "91 249"}, right: { ru: '91 200', uz: '91 200' , en: "91 200"} },
      { id: 'b', left: { ru: '91 250', uz: '91 250' , en: "91 250"}, right: { ru: '91 300', uz: '91 300' , en: "91 300"} },
      { id: 'c', left: { ru: '91 851', uz: '91 851' , en: "91 851"}, right: { ru: '91 900', uz: '91 900' , en: "91 900"} },
    ],
    wrongText: { ru: 'Проверь первую неверную пару по цифре десятков: 0–4 ведут вниз, 5–9 вверх.', uz: "Birinchi noto'g'ri juftlikni o'nlar xonasidagi raqam bo'yicha tekshiring: 0–4 pastga, 5–9 yuqoriga olib boradi.", en: 'Check the first incorrect pair using the tens digit: 0–4 round down and 5–9 round up.' },
    correctText: { ru: 'Верно. Во всех трёх парах решение принято по цифре десятков.', uz: "To'g'ri. Uchala juftlikda ham qaror o'nlar xonasidagi raqam bo'yicha qabul qilindi.", en: 'Correct. In all three pairs, the tens digit decided the rounding.' },
    rule: { ru: 'При округлении до сотен смотри на десятки.', uz: "Yuzlikkacha yaxlitlashda o'nlar xonasiga qarang.", en: 'To round to the nearest hundred, look at the tens digit.' },
  },
  {
    id: '08', kind: 'mc', level: '🔴', figure: '999 650 → ?',
    setup: { ru: 'Округление увеличивает разряд, в котором уже стоит 9.', uz: "Yaxlitlash 9 turgan xonani oshiradi.", en: 'Rounding increases a place that already contains 9.' },
    prompt: { ru: 'Округли число до тысяч.', uz: "Sonni minglikkacha yaxlitlang.", en: 'Round the number to the nearest thousand.' },
    options: [
      { text: { ru: '1 000 000', uz: '1 000 000' , en: "1 000 000"}, correct: true },
      { text: { ru: '999 000', uz: '999 000' , en: "999 000"}, wrong: { ru: 'В сотнях стоит 6, поэтому нужно округлять вверх.', uz: "Yuzlar xonasida 6, shuning uchun yuqoriga yaxlitlash kerak.", en: 'The hundreds digit is 6, so the number must round up.' } },
      { text: { ru: '999 700', uz: '999 700' , en: "999 700"}, wrong: { ru: 'Справа от тысяч должны остаться нули, а не округлённые сотни.', uz: "Minglar xonasidan o'ngda yaxlitlangan yuzlar emas, nollar qolishi kerak.", en: 'Zeros should remain to the right of the thousands, not rounded hundreds.' } },
      { text: { ru: '990 000', uz: '990 000' , en: "990 000"}, wrong: { ru: 'Так потерялся разряд тысяч. Увеличение проходит через все три девятки.', uz: "Bunda minglar xonasi yo'qoldi. Oshirish uchta to'qqiz orqali o'tadi.", en: 'This loses the thousands place. The increase carries through all three nines.' } },
    ],
    correctText: { ru: 'Верно. 999 тысяч увеличиваются на одну тысячу и образуют 1 000 000.', uz: "To'g'ri. 999 ming bir mingga oshib, 1 000 000 ni hosil qiladi.", en: 'Correct. Increasing 999 thousands by one thousand makes 1,000,000.' },
    rule: { ru: 'При переносе через 9 появляется новый старший разряд.', uz: "9 orqali o'tishda yangi katta xona paydo bo'ladi.", en: 'Carrying through a 9 creates a new higher place.' },
  },
  {
    id: '09', kind: 'mc', level: '🔴', figure: '246 349 → 246 400',
    setup: { ru: 'Бит округлил число до сотен и получил неверный результат.', uz: "Bit sonni yuzlikkacha yaxlitlab, noto'g'ri natija oldi.", en: 'Bit rounded the number to the nearest hundred and got an incorrect result.' },
    prompt: { ru: 'В чём ошибка?', uz: "Xato nimada?" , en: "What is the mistake?"},
    options: [
      { text: { ru: 'Он посмотрел на цифру сотен вместо цифры десятков', uz: "U o'nlar o'rniga yuzlar xonasidagi raqamga qaradi", en: 'He looked at the hundreds digit instead of the tens digit' }, correct: true },
      { text: { ru: 'Он должен был сохранить единицы', uz: "U birlar xonasini saqlashi kerak edi", en: 'He should have kept the ones digit' }, wrong: { ru: 'При округлении до сотен десятки и единицы заменяются нулями.', uz: "Yuzlikkacha yaxlitlashda o'nlar va birlar nolga almashtiriladi.", en: 'When rounding to the nearest hundred, the tens and ones are replaced by zeros.' } },
      { text: { ru: 'Он должен был округлить до тысяч', uz: "U minglikkacha yaxlitlashi kerak edi", en: 'He should have rounded to the nearest thousand' }, wrong: { ru: 'Условие требует сотни. Менять точность нельзя.', uz: "Shart yuzlikni talab qiladi. Aniqlikni o'zgartirib bo'lmaydi.", en: 'The task requires rounding to hundreds. The precision cannot be changed.' } },
      { text: { ru: 'Результат верный', uz: "Natija to'g'ri", en: 'The result is correct' }, wrong: { ru: 'В десятках стоит 4, поэтому сотни не увеличиваются. Верный результат 246 300.', uz: "O'nlar xonasida 4, shuning uchun yuzlar oshmaydi. To'g'ri natija 246 300.", en: 'The tens digit is 4, so the hundreds do not increase. The correct result is 246,300.' } },
    ],
    correctText: { ru: 'Верно. Решение принимает цифра справа от сотен — это 4, поэтому результат 246 300.', uz: "To'g'ri. Qarorni yuzlardan o'ngdagi 4 raqami beradi, shuning uchun natija 246 300.", en: 'Correct. The digit immediately to the right of the hundreds is 4, so the result is 246,300.' },
    rule: { ru: 'Смотри на цифру сразу справа от разряда округления.', uz: "Yaxlitlash xonasidan darhol o'ngdagi raqamga qarang.", en: 'Look at the digit immediately to the right of the rounding place.' },
  },
  {
    id: '10', kind: 'mc', level: '🔴', figure: '612 748',
    setup: { ru: 'Для карты города нужна оценка до десятков тысяч.', uz: "Shahar xaritasi uchun o'n minglikkacha baho kerak.", en: 'The city map needs an estimate to the nearest ten thousand.' },
    prompt: { ru: 'Какой результат и способ верны?', uz: "Qaysi natija va usul to'g'ri?", en: 'Which result and method are correct?' },
    options: [
      { text: { ru: '610 000: посмотреть на тысячи и заменить справа четыре цифры', uz: "610 000: minglar xonasiga qarash va o'ngdagi to'rtta raqamni almashtirish", en: '610,000: look at the thousands digit and replace the four digits on the right' }, correct: true },
      { text: { ru: '620 000: посмотреть на десятки тысяч', uz: "620 000: o'n minglar xonasiga qarash", en: '620,000: look at the ten-thousands digit' }, wrong: { ru: 'Решение принимает цифра справа от десятков тысяч — цифра 2. Она ведёт вниз.', uz: "Qarorni o'n minglardan o'ngdagi 2 raqami beradi. U pastga olib boradi.", en: 'The digit to the right of the ten-thousands place, 2, decides. It rounds down.' } },
      { text: { ru: '613 000: округлить сначала сотни, потом тысячи', uz: "613 000: avval yuzlik, keyin minglikkacha yaxlitlash", en: '613,000: round to hundreds first, then to thousands' }, wrong: { ru: 'Последовательное округление искажает задачу. Сразу работай с требуемым разрядом.', uz: "Ketma-ket yaxlitlash vazifani buzadi. Darhol kerakli xona bilan ishlang.", en: 'Rounding in stages changes the problem. Work directly with the required place.' } },
      { text: { ru: '612 700: сохранить точные тысячи', uz: "612 700: aniq minglarni saqlash", en: '612,700: keep the exact thousands' }, wrong: { ru: 'Так сохранена точность до сотен, а карте нужны десятки тысяч.', uz: "Bunda yuzlikkacha aniqlik saqlangan, xaritaga esa o'n mingliklar kerak.", en: 'This keeps precision to the nearest hundred, but the map requires ten thousands.' } },
    ],
    correctText: { ru: 'Верно. Цифра тысяч равна 2, поэтому 612 748 округляется до 610 000.', uz: "To'g'ri. Minglar xonasidagi raqam 2, shuning uchun 612 748 soni 610 000 gacha yaxlitlanadi.", en: 'Correct. The thousands digit is 2, so 612,748 rounds to 610,000.' },
    rule: { ru: 'Сначала выбери точность, затем используй одну решающую цифру.', uz: "Avval aniqlikni tanlang, keyin bitta hal qiluvchi raqamdan foydalaning.", en: 'Choose the precision first, then use one deciding digit.' },
  },
];

const NumberStrip = ({ value, picked, onPick, disabled, state }) => {
  const digits = String(value).split('');
  return (
    <div className="p4-strip">
      {digits.map((digit, index) => {
        const gap = digits.length - index - 1;
        return (
          <span className="p4-strip-part" key={`${digit}-${index}`}>
            <span className="p4-digit">{digit}</span>
            {gap > 0 && (
              <button
                type="button"
                className={`p4-gap ${picked === gap ? 'is-placed' : ''} ${picked === gap && state ? `is-${state}` : ''}`}
                disabled={disabled}
                aria-label={String(gap)}
                onClick={() => onPick(gap)}
              ><i /></button>
            )}
          </span>
        );
      })}
    </div>
  );
};

const NumPad = ({ value, setValue, max, disabled, lang }) => (
  <div className="p4-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}>
    <div className="p4-pad-display">{value ? grouped(value) : '—'}</div>
    <div className="p4-pad-keys">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
        <button key={n} type="button" className="p4-key" disabled={disabled} onClick={() => setValue((old) => old.length >= max ? old : old + n)}>{n}</button>
      ))}
      <button type="button" className="p4-key p4-key-del" disabled={disabled} aria-label={tx(UI.clear, lang)} onClick={() => setValue((old) => old.slice(0, -1))}>⌫</button>
    </div>
  </div>
);

const Feedback = ({ ok, text, rule, lang, feedbackRef }) => (
  <div ref={feedbackRef} className={`p4-fb ${ok ? 'is-ok' : 'is-no'}`} role="status">
    <p className="p4-fb-txt">{text}</p>
    {ok && rule && <p className="p4-rule"><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>}
  </div>
);

function Task({ task, lang, onSolved }) {
  // Xato javobdan keyin qayta aralashadi: `wrongRound` o'sadi.
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- wrongRound ataylab yangi tartib beradi
  const options = useMemo(() => (task.kind === 'mc' ? shuffle(task.options) : []), [task, wrongRound]);
  const rightPairs = useMemo(() => task.kind === 'match' ? shuffle(task.pairs) : [], [task]);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [gap, setGap] = useState(null);
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const feedbackRef = useRef(null);

  // Javobning to'g'riligi `checked` dan ALOHIDA hisoblanadi: tekshirish
  // tugmasi bosilganda xato bo'lsa variantlarni qayta aralashtirish kerak.
  const answerCorrect = (
    (task.kind === 'mc' && picked?.correct === true)
    || (task.kind === 'gap' && gap === task.correctGap)
    || (task.kind === 'numpad' && typed === task.answer)
    || (task.kind === 'match' && task.pairs.every((pair, i) => pairs[i] === pair.id))
  );
  const solved = checked && answerCorrect;
  const canCheck = (task.kind === 'mc' && picked !== null)
    || (task.kind === 'gap' && gap !== null)
    || (task.kind === 'numpad' && typed !== '')
    || (task.kind === 'match' && Object.keys(pairs).length === task.pairs.length);
  const firstMatchWrong = task.kind === 'match' && checked
    ? task.pairs.findIndex((pair, i) => pairs[i] !== pair.id)
    : -1;

  useEffect(() => {
    if (!checked || !feedbackRef.current) return undefined;
    let timeout;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      timeout = setTimeout(() => {
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        feedbackRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
      }, 180);
    }));
    return () => { cancelAnimationFrame(raf); clearTimeout(timeout); };
  }, [checked]);

  const wrongText = (() => {
    if (task.kind === 'mc') return picked?.wrong;
    if (task.kind === 'gap') return task.gapWrong?.[gap];
    if (task.kind === 'numpad') return task.hints[Math.min(Math.max(attempts - 1, 0), task.hints.length - 1)];
    return task.wrongText;
  })();

  const retry = () => {
    setChecked(false);
    if (task.kind === 'mc') setPicked(null);
    if (task.kind === 'gap') setGap(null);
    if (task.kind === 'numpad') setTyped('');
    if (task.kind === 'match') { setPairs({}); setActiveLeft(null); }
  };

  return (
    <div className="p4-task">
      <p className="p4-eyebrow">{task.level} {tx(UI.task, lang)} {task.id}</p>
      <p className="p4-setup">{tx(task.setup, lang)}</p>
      {(task.figure || task.number) && (
        <div className="p4-figure">
          {task.kind === 'gap'
            ? <NumberStrip value={task.number} picked={gap} onPick={(value) => { setGap(value); setChecked(false); }} disabled={solved} state={checked ? (solved ? 'ok' : 'no') : null} />
            : <span className={`p4-bignum ${typeof task.figure === 'object' ? 'is-words' : ''}`}>{tx(task.figure, lang)}</span>}
          {task.kind === 'gap' && <p className="p4-note">{tx(UI.chooseGap, lang)}</p>}
        </div>
      )}
      <h2 className="p4-ask">{tx(task.prompt, lang)}</h2>

      {task.kind === 'mc' && <div className="p4-options">{options.map((option, i) => (
        <button
          key={`${task.id}-${i}`}
          type="button"
          className={`p4-option ${picked === option ? (checked ? (option.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`}
          disabled={solved}
          onClick={() => { setPicked(option); setChecked(false); }}
        ><span className="p4-letter">{'ABCD'[i]}</span><span>{tx(option.text, lang)}</span></button>
      ))}</div>}

      {task.kind === 'numpad' && <NumPad value={typed} setValue={(fn) => { setTyped(fn); setChecked(false); }} max={task.maxLen} disabled={solved} lang={lang} />}

      {task.kind === 'match' && <div className="p4-match">
        <p className="p4-note">{tx(UI.matchHint, lang)}</p>
        <div className="p4-match-cols">
          <div className="p4-match-col">{task.pairs.map((pair, i) => (
            <button key={pair.id} type="button" className={`p4-match-item ${activeLeft === i ? 'is-active' : ''} ${pairs[i] ? 'is-tied' : ''} ${firstMatchWrong === i ? 'is-no' : ''}`} disabled={solved} onClick={() => { setActiveLeft(i); setChecked(false); }}>
              {tx(pair.left, lang)}{pairs[i] && <b className="p4-tie">{tx(rightPairs.find((right) => right.id === pairs[i])?.right, lang)}</b>}
            </button>
          ))}</div>
          <div className="p4-match-col">{rightPairs.map((pair) => (
            <button key={pair.id} type="button" className="p4-match-item p4-match-right" disabled={solved || activeLeft === null || Object.values(pairs).includes(pair.id)} onClick={() => {
              if (activeLeft === null) return;
              setPairs((old) => ({ ...old, [activeLeft]: pair.id })); setActiveLeft(null); setChecked(false);
            }}>{tx(pair.right, lang)}</button>
          ))}</div>
        </div>
      </div>}

      {checked && <Feedback feedbackRef={feedbackRef} ok={solved} text={tx(solved ? task.correctText : wrongText, lang)} rule={task.rule} lang={lang} />}

      <div className="p4-actions">
        {!solved && <button type="button" className="p4-btn" disabled={!canCheck} onClick={() => { setChecked(true); setAttempts((n) => n + 1); if (!answerCorrect) setWrongRound((old) => old + 1); }}>{tx(UI.check, lang)}</button>}
        {checked && !solved && <button type="button" className="p4-btn p4-btn-ghost" onClick={retry}>{tx(UI.retry, lang)}</button>}
        {solved && <button type="button" className="p4-btn p4-btn-ready" onClick={() => onSolved(attempts === 1)}>{tx(UI.next, lang)}</button>}
      </div>
    </div>
  );
}

export default function Grade4Dars05Practice({ lang: langProp, onFinished }) {
  const normalizedLang = normalizeLang(langProp);
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = preview ? previewLang : normalizedLang;
  const [index, setIndex] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [finished, setFinished] = useState(false);
  const advancedRef = useRef(-1);
  const finishedRef = useRef(false);
  const task = TASKS[index];
  const percent = Math.round(((finished ? TASKS.length : index) / TASKS.length) * 100);

  const onSolved = (wasFirstTry) => {
    if (finishedRef.current || advancedRef.current === index) return;
    advancedRef.current = index;
    const nextFirstTry = firstTry + (wasFirstTry ? 1 : 0);
    if (wasFirstTry) setFirstTry(nextFirstTry);
    if (index + 1 === TASKS.length) {
      finishedRef.current = true;
      setFinished(true);
      onFinished?.({ lessonId: LESSON_META.lessonId, lessonTitle: tx(LESSON_META.lessonTitle, lang), totalQuestions: 10, correctAnswers: nextFirstTry, scorePercent: Math.round((nextFirstTry / 10) * 100) });
    } else setIndex((old) => old + 1);
  };

  return (
    <div className="p4-root">
      <style>{STYLES + PRACTICE_FIX_CSS}</style>
      {preview && <div className="p4-lang">{SUPPORTED_LANGS.map((code) => <button key={code} type="button" className={code === lang ? 'is-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}
      <header className="p4-head">
        <div className="p4-progress"><div className="p4-progress-bar" style={{ width: `${percent}%` }} /></div>
        <div className="p4-head-row"><span className="p4-title">{tx(UI.title, lang)}</span><span className="p4-counter">{finished ? 10 : index + 1} / 10</span></div>
      </header>
      <main className="p4-main">
        {finished ? <div className="p4-done">
          <h2>{tx(UI.done, lang)}</h2><p className="p4-score"><b>{firstTry}</b> <span>{tx(UI.ofTen, lang)}</span></p>
          <p className="p4-note">{tx({ uz: "Birinchi urinishda to'g'ri bajarilgan topshiriqlar soni.", ru: 'Столько заданий решено с первой попытки.', en: 'Tasks solved correctly on the first try.' }, lang)}</p>
          <button type="button" className="p4-btn p4-btn-ready" onClick={() => { setIndex(0); setFirstTry(0); setFinished(false); }}>{tx(UI.again, lang)}</button>
        </div> : <Task key={task.id} task={task} lang={lang} onSolved={onSolved} />}
      </main>
    </div>
  );
}

const STYLES = `
.p4-root{position:relative;min-height:100%;padding:0 0 24px;font-family:'Manrope',system-ui,sans-serif;color:${T.ink};background:${T.bg}}
.p4-root *,.p4-root *::before,.p4-root *::after{box-sizing:border-box}.p4-root button:focus-visible{outline:3px solid rgba(22,143,163,.45);outline-offset:3px}
.p4-lang{position:absolute;top:8px;right:8px;display:flex;gap:6px;z-index:5}.p4-lang button{min-width:44px;min-height:44px;border:0;border-radius:99px;background:${T.paper};color:${T.ink2};font-weight:800;cursor:pointer;box-shadow:0 4px 12px -8px rgba(23,59,82,.4)}.p4-lang button.is-active{background:${T.accent};color:#fff}
.p4-head{padding:46px clamp(12px,4vw,24px) 8px}.p4-progress{height:6px;border-radius:99px;background:rgba(23,59,82,.12);overflow:hidden}.p4-progress-bar{height:100%;background:linear-gradient(90deg,${T.cyan},${T.accent});transition:width .4s ease}.p4-head-row{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-top:8px}.p4-title{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(15px,2.4vw,19px)}.p4-counter{white-space:nowrap;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:13px;color:${T.ink3}}
.p4-main{max-width:720px;margin:0 auto;padding:4px clamp(12px,4vw,24px)}.p4-task{display:flex;flex-direction:column;gap:12px}.p4-eyebrow{margin:6px 0 0;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${T.accent}}.p4-setup{margin:0;font-size:clamp(14px,2vw,16px);line-height:1.5;color:${T.ink2}}.p4-ask{margin:2px 0 0;font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(17px,2.6vw,21px);line-height:1.25}.p4-note{margin:8px 0 0;font-size:13px;color:${T.ink3}}
.p4-figure{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 10px;border-radius:16px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}.p4-bignum{font-family:'JetBrains Mono',monospace;font-weight:800;font-size:clamp(26px,6vw,40px);color:${T.navy};text-align:center}.p4-bignum.is-words{font-family:'Source Serif 4',Georgia,serif;font-size:clamp(18px,4vw,28px)}
.p4-strip{display:flex;align-items:center;justify-content:center}.p4-strip-part{display:flex;align-items:center}.p4-digit{min-width:clamp(18px,4.5vw,34px);text-align:center;font-family:'JetBrains Mono',monospace;font-weight:800;font-size:clamp(26px,6vw,38px);color:${T.navy}}.p4-gap{display:inline-flex;align-items:center;justify-content:center;width:44px;min-height:46px;padding:0;border:0;background:transparent;cursor:pointer}.p4-gap i{width:3px;height:26px;border-radius:2px;background:rgba(23,59,82,.14)}.p4-gap.is-placed i{height:38px;background:${T.accent}}.p4-gap.is-ok i{background:${T.success}}.p4-gap.is-no i{background:${T.warn}}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.p4-option{display:flex;align-items:center;gap:9px;min-height:56px;padding:10px 12px;text-align:left;font-family:inherit;font-weight:700;font-size:clamp(13px,1.9vw,15px);color:${T.ink};background:${T.paper};border:1px solid rgba(23,59,82,.12);border-radius:14px;cursor:pointer}.p4-option:hover:not(:disabled){border-color:rgba(22,143,163,.4);transform:translateY(-2px)}.p4-letter{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:8px;background:${T.cyanSoft};color:${T.cyan};font:800 11px 'JetBrains Mono',monospace}.p4-option.is-on{border-color:${T.accent};background:${T.accentSoft}}.p4-option.is-ok{border-color:rgba(34,122,83,.4);background:${T.successSoft};color:${T.success}}.p4-option.is-no{border-color:rgba(169,111,19,.4);background:${T.warnSoft};color:${T.warn}}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:8px;width:min(240px,100%);margin:0 auto;padding:12px;border-radius:18px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8)}.p4-pad-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:50px;border:2px solid ${T.accent};border-radius:13px;background:${T.paper};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;color:${T.navy}}.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:100%}.p4-key{min-height:44px;border:1px solid rgba(23,59,82,.16);border-radius:12px;background:${T.paper};font:800 clamp(18px,3.6vw,22px) 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer}.p4-key-del{background:${T.accentSoft};color:${T.accent}}
.p4-match-cols{display:flex;gap:10px;margin-top:8px}.p4-match-col{display:flex;flex-direction:column;gap:8px;flex:1}.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-height:56px;padding:8px 10px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};font:800 clamp(12px,2.2vw,16px) 'Manrope',sans-serif;color:${T.navy};cursor:pointer}.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}.p4-match-item.is-tied{border-color:rgba(34,122,83,.35)}.p4-match-item.is-no{border-color:${T.warn};background:${T.warnSoft}}.p4-tie{font-size:11px;color:${T.success}}
.p4-fb{padding:12px 14px;border-radius:14px}.p4-fb.is-ok{background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}.p4-fb.is-no{background:${T.warnSoft};box-shadow:inset 4px 0 0 ${T.warn}}.p4-fb-txt{margin:0;font-family:'Source Serif 4',Georgia,serif;font-size:clamp(14px,2.1vw,16px);line-height:1.45}.p4-rule{margin:8px 0 0;font-size:13px;color:${T.ink2}}
.p4-actions{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:10px;margin-top:4px}.p4-btn{min-height:46px;padding:10px 22px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font-family:inherit;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5),inset 0 0 0 1px rgba(255,91,53,.2)}.p4-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.p4-btn-ready{background:${T.accent};color:#fff}.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}.p4-done{display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 12px;text-align:center}.p4-done h2{margin:0;font-family:'Source Serif 4',Georgia,serif}.p4-score{margin:0;font-family:'JetBrains Mono',monospace}.p4-score b{font-size:clamp(32px,7vw,44px);color:${T.success}}.p4-score span{font-size:14px;color:${T.ink3}}
@media(max-width:520px){.p4-options{grid-template-columns:1fr}.p4-match-cols{gap:8px}.p4-match-item{font-size:12px;padding:7px}}
@media(prefers-reduced-motion:reduce){.p4-root *,.p4-root *::before{transition:none!important;animation:none!important}}
`;
