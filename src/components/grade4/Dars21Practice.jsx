// ============================================================================
// 4-SINF · 21-DARS AMALIYOTI · KASRLARNI AYIRISH
// Dars01Practice kontrakti: 10 topshiriq, UZ/RU/EN, ovozsiz, solve-to-advance.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

// ---- MATCH-FIX (metodist qarori 2026-08-21) --------------------------------
// Juftlashtirish uch narsani kafolatlaydi:
//   1) juftlikning ikki tomoni bir xil rang va bir xil belgi oladi — uchta
//      qator uchta rangda ko'rinadi va bola nimani nima bilan bog'laganini
//      ko'zi bilan ko'radi;
//   2) band kartochkani boshqa qatorga berish mumkin, shuning uchun hammasini
//      juftlagandan keyin ham xatoni tuzatish yo'li bor — tupik yo'q;
//   3) o'ng ustun chap ustun bilan bir qatorga tushmaydi: to'g'ri javob
//      qarshisida turib qolsa, bola o'ylamay bir qatorga bosadi.
// Blok har darsda takrorlanadi ATAYLAB: LMS avtonom fayl talab qiladi
// (scripts/build-grade4-practice-lms.mjs — lokal import yo'q).
const MATCH_TONES = 6;
// Chap ustundagi qatorlarning kaliti = `pairs` obyektining kaliti.
const matchRows = (task) => (task.pairs || []).map((pair) => pair.id);
const matchTone = (rows, key) => {
  const row = rows.findIndex((item) => String(item) === String(key));
  return row < 0 ? '' : ` p4-tone${(row % MATCH_TONES) + 1}`;
};
const matchToneLeft = (task, pairs, rowKey) => (
  pairs[rowKey] === undefined ? '' : matchTone(matchRows(task), rowKey)
);
const matchToneRight = (task, pairs, rightKey) => {
  const rows = matchRows(task);
  const owner = rows.find(
    (key) => pairs[key] !== undefined && String(pairs[key]) === String(rightKey),
  );
  return owner === undefined ? '' : matchTone(rows, owner);
};
// Kartochka band bo'lsa, eski juftlik bo'shatiladi: bitta kartochka bir vaqtda
// faqat bitta qatorga tegishli bo'ladi.
const matchTie = (pairs, rowKey, rightKey) => {
  const next = {};
  Object.keys(pairs).forEach((key) => {
    if (String(pairs[key]) !== String(rightKey)) next[key] = pairs[key];
  });
  next[rowKey] = rightKey;
  return next;
};
// O'ng ustunni shunday joylaydi, ki hech bir karta o'z juftining qarshisida
// turmaydi. Aralashtirish tasodifiy, lekin natijasi tekshiriladi.
const matchSpread = (cards, aligned) => {
  const list = Array.isArray(cards) ? [...cards] : [];
  if (list.length < 2) return list;
  const stuck = () => list.some((card, row) => aligned(card, row));
  for (let attempt = 0; attempt < 24 && stuck(); attempt += 1) {
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
  }
  for (let pass = 0; pass <= list.length && stuck(); pass += 1) {
    for (let i = 0; i < list.length; i += 1) {
      if (!aligned(list[i], i)) continue;
      const j = (i + 1) % list.length;
      [list[i], list[j]] = [list[j], list[i]];
    }
  }
  return list;
};
// ---- MATCH-FIX tugashi ----------------------------------------------------

const T = {
  bg: '#F5F5F0', paper: '#FFFFFF', ink: '#12212C', ink2: '#50616D', ink3: '#87949D',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '0 16px 36px -24px rgba(23,59,82,.34)',
};

const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';
const b = (ru, uz, en) => ({ ru, uz, en });
const option = (id, ru, uz, en, correct = false, wrongRu = '', wrongUz = '', wrongEn = '') => ({
  id, text: b(ru, uz, en), correct, wrong: wrongRu ? b(wrongRu, wrongUz, wrongEn) : null,
});
const tx = (value, lang) => (value && typeof value === 'object' && !Array.isArray(value) ? (value[lang] ?? '') : value);
const adaptive = (task, pickedOption, attempts) => {
  if (attempts >= 3) return task.thirdHint;
  if (attempts >= 2) return task.secondHint;
  return pickedOption?.wrong || task.wrong?.[0] || task.secondHint;
};
const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const UI = {
  title: b('Урок 21. Практика: вычитание дробей', "21-dars. Amaliyot: kasrlarni ayirish", "Lesson 21. Practice: subtracting fractions"),
  language: b('Язык', 'Til', 'Language'),
  numerator: b('Числитель', 'Surat', 'Numerator'),
  denominator: b('Знаменатель', 'Maxraj', 'Denominator'),
  task: b('Задание', 'Topshiriq', "Task"),
  level: { green: b('Базовое', 'Asosiy', "Core"), yellow: b('Применение', "Qo'llash", "Application"), red: b('Перенос', "Ko'chirish", "Transfer") },
  check: b('Проверить', 'Tekshirish', "Check"), retry: b('Исправить ответ', 'Javobni tuzatish', "Correct the answer"),
  next: b('Следующее', 'Keyingisi', "Next"), finish: b('Завершить', 'Yakunlash', "Finish"),
  again: b('Пройти заново', 'Qaytadan ishlash', "Try again"), done: b('Практика пройдена', 'Amaliyot tugadi', "Practice complete"),
  firstTry: b('верно с первой проверки', "birinchi tekshiruvda to'g'ri", "correct on the first check"),
  allSolved: b('Все 10 заданий решены.', '10 ta topshiriqning barchasi yechildi.', "All 10 tasks have been solved."),
  rule: b('Запомните', 'Eslab qoling', "Remember"), typeAnswer: b('Введите числовой ответ', 'Sonli javobni kiriting', "Enter a numerical answer"),
  clear: b('Стереть', "O'chirish", "Delete"), matchHint: b('Выберите карточку слева, затем пару справа.', "Avval chapdagi kartani, keyin o'ngdagi juftini tanlang.", "Choose a card on the left, then its match on the right."),
  orderHint: b('Выберите место, затем карточку шага.', 'Avval joyni, keyin qadam kartasini tanlang.', "Choose a position, then a step card."),
};

const LESSON_META = {
  lessonId: 'num-4-21-practice', lessonTitle: UI.title, grade: 4, lessonNumber: 21,
  activityType: 'practice', taskCount: 10, resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'tap-removal', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'inverse-check-transfer', type: 'practice', scored: true, scope: 'final' },
];

const TASKS = [
  {
    id: '01', level: 'green', kind: 'mc', skillTag: 'remove-fractions',
    visual: { type: 'bar', total: 9, filled: 8, removed: 3, label: '8/9 − 3/9' },
    setup: b('Из восьми девятых убирают три девятых.', "8/9 dan 3/9 ayirilmoqda.", "Three ninths are removed from eight ninths."), prompt: b('Найдите разность.', "Ayirmani toping.", "Find the difference."),
    options: [
      option('correct', '5/9', '5/9', "5/9", true),
      option('denominator', '5/0', '5/0', "5/0", false, 'Знаменатели не вычитают. Целое всё ещё разделено на девять частей.', "Maxrajlar ayirilmaydi. Butun hamon to'qqiz qismga bo'lingan.", "Do not subtract the denominators. The whole is still divided into nine parts."),
      option('addition', '11/9', '11/9', "11/9", false, 'Одиннадцать получилось при сложении, а здесь части убирают.', "11 qo'shishda chiqadi, bu yerda esa qismlar olib tashlanmoqda.", "Eleven would be the result of addition, but parts are being removed here."),
      option('removed', '3/9', '3/9', "3/9", false, 'Три девятых — это убранная часть, а нужно найти остаток.', "3/9 olib tashlangan qism, qoldiqni topish kerak.", "Three ninths is the removed part, but the remainder is needed."),
    ],
    secondHint: b('На модели отдельно выделены убранные и оставшиеся доли.', "Modelda olib tashlangan va qolgan ulushlar alohida yoritildi.", "The removed parts and the remaining parts are highlighted separately in the model."),
    thirdHint: b('Например, 6/8 − 2/8 = 4/8: вычитаются только числители.', "Masalan, 6/8 − 2/8 = 4/8: faqat suratlar ayiriladi.", "For example, 6/8 − 2/8 = 4/8: only the numerators are subtracted."),
    correctText: b('Верно. 8/9 − 3/9 = 5/9.', "To'g'ri. 8/9 − 3/9 = 5/9.", "Correct. 8/9 − 3/9 = 5/9."),
    rule: b('При равных знаменателях вычитают числители, знаменатель сохраняют.', "Maxrajlar teng bo'lsa, suratlar ayiriladi, maxraj saqlanadi.", "When the denominators are equal, subtract the numerators and keep the denominator."),
  },
  {
    id: '02', level: 'green', kind: 'shade', skillTag: 'remove-fractions', selectCount: 2, selectionMode: 'remove',
    visual: { type: 'bar', total: 10, filled: 7 }, allowed: [0,1,2,3,4,5,6],
    setup: b('В полоске отмечены 7/10. Нужно убрать 2/10.', "Tasmada 7/10 belgilangan. 2/10 ni olib tashlash kerak.", "The bar shows 7/10. Remove 2/10."), prompt: b('Выберите две части, которые убирают.', "Olib tashlanadigan ikkita qismni tanlang.", "Select the two parts to remove."),
    wrong: [b('Нужно убрать ровно две из семи заполненных частей.', "Yettita to'la qismdan aynan ikkitasini olib tashlash kerak.", "Remove exactly two of the seven filled parts.")],
    secondHint: b('Выбирать можно только среди семи заполненных десятых долей.', "Faqat yettita to'la o'ndan bir ulush orasidan tanlash mumkin.", "You can select only from the seven filled tenths."),
    thirdHint: b('Если из 6/8 убрать 1/8, нужно отметить одну из шести заполненных частей.', "6/8 dan 1/8 olinsa, oltita to'la qismdan bittasi belgilanadi.", "To remove 1/8 from 6/8, select one of the six filled parts."),
    correctText: b('Верно. После удаления двух долей остаётся 5/10.', "To'g'ri. Ikki ulush olib tashlangach, 5/10 qoladi.", "Correct. After two parts are removed, 5/10 remains."),
    rule: b('Удалённые доли и оставшиеся доли относятся к тому же целому.', "Olib tashlangan va qolgan ulushlar ayni bir butunga tegishli.", "The removed parts and the remaining parts belong to the same whole."),
  },
  {
    id: '03', level: 'yellow', kind: 'match', skillTag: 'subtraction-representations',
    visual: { type: 'models', items: [
      { shape: 'bar', total: 8, filled: 6, removed: 2, label: 'A' },
      { shape: 'line', total: 10, filled: 6, label: 'B' },
      { shape: 'grid', total: 12, filled: 10, removed: 4, label: 'C' },
    ] },
    setup: b('Вычитание показано тремя моделями.', "Ayirish uchta modelda ko'rsatilgan.", "Subtraction is shown using three models."), prompt: b('Соедините модель с записью.', "Modelni yozuv bilan moslashtiring.", "Match each model to its expression."),
    pairs: [{ id: 'a', left: b('A · полоска', 'A · tasma', "A · bar"), correctRight: '4/8' }, { id: 'b', left: b('B · луч', 'B · son nuri', "B · number line"), correctRight: '6/10' }, { id: 'c', left: b('C · клетки', 'C · kataklar', "C · squares"), correctRight: '6/12' }],
    right: [
      { id: '4/8', text: b('6/8 − 2/8 = 4/8', '6/8 − 2/8 = 4/8', "6/8 − 2/8 = 4/8") },
      { id: '6/10', text: b('9/10 − 3/10 = 6/10', '9/10 − 3/10 = 6/10', "9/10 − 3/10 = 6/10") },
      { id: '6/12', text: b('10/12 − 4/12 = 6/12', '10/12 − 4/12 = 6/12', "10/12 − 4/12 = 6/12") },
    ],
    wrong: [b('Сравните начальное, убранное и оставшееся число долей.', "Dastlabki, olib tashlangan va qolgan ulushlar sonini solishtiring.", "Compare the starting number of parts, the number removed and the number remaining.")],
    secondHint: b('На ошибочной модели выделены убранные и оставшиеся части.', "Xato modelda olib tashlangan va qolgan qismlar yoritildi.", "The removed and remaining parts are highlighted in the incorrect model."),
    thirdHint: b('В 5/7 − 2/7 остаются три седьмых.', "5/7 − 2/7 da 3/7 qoladi.", "Three sevenths remain in 5/7 − 2/7."),
    correctText: b('Верно. Все модели соединены с правильными разностями.', "To'g'ri. Barcha modellar to'g'ri ayirmalar bilan bog'landi.", "Correct. All the models are matched to the correct differences."),
    rule: b('Одно вычитание можно показать полоской, лучом или клетками.', "Bitta ayirishni tasma, son nuri yoki kataklar bilan ko'rsatish mumkin.", "The same subtraction can be shown with a bar, a number line or squares."),
  },
  {
    id: '04', level: 'yellow', kind: 'numpad', skillTag: 'subtract-numerators', answer: '7', maxLen: 2,
    visual: { type: 'formula', text: '11/12 − 4/12 = □/12' },
    setup: b('Знаменатели равны двенадцати.', "Maxrajlar o'n ikkiga teng.", "The denominators are both twelve."), prompt: b('Введите пропущенный числитель.', "Tushib qolgan suratni kiriting.", "Enter the missing numerator."),
    wrong: [b('Вычтите числитель 4 из числителя 11.', "11 suratidan 4 suratini ayiring.", "Subtract the numerator 4 from the numerator 11.")],
    secondHint: b('Числители выделены, знаменатель 12 остаётся неподвижным.', "Suratlar yoritildi, 12 maxraj o'zgarmay turibdi.", "The numerators are highlighted; the denominator 12 stays unchanged."),
    thirdHint: b('В 9/10 − 3/10 числитель результата равен 6.', "9/10 − 3/10 da natijaning surati 6.", "The numerator of the result in 9/10 − 3/10 is 6."),
    correctText: b('Верно. 11 − 4 = 7, поэтому разность равна 7/12.', "To'g'ri. 11 − 4 = 7, shuning uchun ayirma 7/12.", "Correct. 11 − 4 = 7, so the difference is 7/12."),
    rule: b('Знаменатель называет размер доли и не меняется.', "Maxraj ulush o'lchamini bildiradi va o'zgarmaydi.", "The denominator names the size of each part and does not change."),
  },
  {
    id: '05', level: 'yellow', kind: 'missing', skillTag: 'missing-subtrahend', answer: '3', maxLen: 2,
    visual: { type: 'formula', text: '9/11 − □/11 = 6/11' },
    setup: b('Из 9/11 вычли неизвестное число долей и получили 6/11.', "9/11 dan noma'lum miqdordagi ulush ayirilib, 6/11 olingan.", "An unknown number of parts was subtracted from 9/11, leaving 6/11."), prompt: b('Найдите пропущенный числитель.', "Tushib qolgan suratni toping.", "Find the missing numerator."),
    wrong: [b('Не путайте вычитаемую часть с остатком 6/11.', "Ayiriladigan qismni 6/11 qoldiq bilan adashtirmang.", "Do not confuse the amount subtracted with the remainder 6/11.")],
    secondHint: b('Используйте связь 9 − □ = 6.', "9 − □ = 6 bog'lanishidan foydalaning.", "Use the relationship 9 − □ = 6."),
    thirdHint: b('В 8/10 − □/10 = 5/10 пропущено число 3.', "8/10 − □/10 = 5/10 yozuvida 3 tushib qolgan.", "The missing number in 8/10 − □/10 = 5/10 is 3."),
    correctText: b('Верно. Вычитаемая часть равна 3/11.', "To'g'ri. Ayiriladigan qism 3/11.", "Correct. The amount subtracted is 3/11."),
    rule: b('Неизвестное вычитаемое находят разностью начального количества и остатка.', "Noma'lum ayiriluvchi boshlang'ich miqdor bilan qoldiqning ayirmasidan topiladi.", "Find the unknown amount subtracted by taking the remainder away from the starting amount."),
  },
  {
    id: '06', level: 'yellow', kind: 'numpad', skillTag: 'subtraction-word-problem', answer: '7', maxLen: 2,
    visual: { type: 'bar', total: 14, filled: 10, removed: 3, label: '10/14 − 3/14 = □/14' },
    setup: b('Бак был заполнен на 10/14, затем использовали 3/14.', "Sug'orish baki 10/14 qismigacha to'la edi, 3/14 qismi ishlatildi.", "The tank was 10/14 full, then 3/14 was used."), prompt: b('Введите числитель оставшейся части.', "Qolgan qismning suratini kiriting.", "Enter the numerator of the remaining part."),
    wrong: [b('Нужно найти остаток, поэтому используйте вычитание.', "Qoldiqni topish kerak, shuning uchun ayirishdan foydalaning.", "You need to find the remainder, so use subtraction.")],
    secondHint: b('Три использованные части выделены, остальные заполненные части остаются.', "Ishlatilgan uch qism yoritildi, qolgan to'la qismlar saqlanadi.", "The three used parts are highlighted, and the other filled parts remain."),
    thirdHint: b('8/12 − 2/12 = 6/12.', "8/12 − 2/12 = 6/12.", "8/12 − 2/12 = 6/12."),
    correctText: b('Верно. В баке осталось 7/14.', "To'g'ri. Bakda 7/14 qism qoldi.", "Correct. 7/14 remains in the tank."),
    rule: b('Результат 7/14 не сокращают: это другая тема.', "7/14 natijasi qisqartirilmaydi: bu boshqa mavzu.", "Do not simplify the result 7/14; that is a different topic."),
  },
  {
    id: '07', level: 'yellow', kind: 'match', skillTag: 'subtract-numerators',
    visual: { type: 'models', items: [
      { shape: 'bar', total: 10, filled: 8, removed: 3, label: '8/10 − 3/10' },
      { shape: 'bar', total: 9, filled: 7, removed: 1, label: '7/9 − 1/9' },
      { shape: 'bar', total: 12, filled: 11, removed: 5, label: '11/12 − 5/12' },
    ] },
    setup: b('В каждой записи нужно найти оставшееся число долей.', "Har bir yozuvda qolgan ulushlar sonini topish kerak.", "Find the remaining number of parts in each expression."), prompt: b('Соедините выражение с результатом.', "Ifodani natija bilan moslashtiring.", "Match each expression to its result."),
    pairs: [
      { id: 'a', left: b('8/10 − 3/10', '8/10 − 3/10', "8/10 − 3/10"), correctRight: '5/10' },
      { id: 'b', left: b('7/9 − 1/9', '7/9 − 1/9', "7/9 − 1/9"), correctRight: '6/9' },
      { id: 'c', left: b('11/12 − 5/12', '11/12 − 5/12', "11/12 − 5/12"), correctRight: '6/12' },
    ],
    right: [{ id: '5/10', text: b('5/10', '5/10', "5/10") }, { id: '6/9', text: b('6/9', '6/9', "6/9") }, { id: '6/12', text: b('6/12', '6/12', "6/12") }],
    wrong: [b('В каждой паре вычитайте только числители.', "Har bir juftda faqat suratlarni ayiring.", "Subtract only the numerators in each pair.")],
    secondHint: b('В ошибочной паре подсчитаны оставшиеся части модели.', "Xato juftlikda modelning qolgan qismlari sanaldi.", "The remaining parts of the model are counted in the incorrect match."),
    thirdHint: b('Для 9/11 − 4/11 результат равен 5/11.', "9/11 − 4/11 natijasi 5/11.", "The result of 9/11 − 4/11 is 5/11."),
    correctText: b('Верно. Получены результаты 5/10, 6/9 и 6/12.', "To'g'ri. 5/10, 6/9 va 6/12 natijalari olindi.", "Correct. The results are 5/10, 6/9 and 6/12."),
    rule: b('Число делений целого сохраняется во всех трёх моделях.', "Butundagi bo'linmalar soni uchala modelda ham saqlanadi.", "The number of equal parts in the whole stays the same in all three models."),
  },
  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'zero-result',
    visual: { type: 'bar', total: 7, filled: 7, removed: 7, label: '7/7 − 7/7' },
    setup: b('Нужно выбрать запись, где убрали все доли и получили ноль.', "Barcha ulushlar olib tashlanib, nol qolgan yozuvni tanlash kerak.", "Choose the expression in which all the parts are removed and the result is zero."), prompt: b('Какая запись верна?', "Qaysi yozuv to'g'ri?", "Which expression is correct?"),
    options: [
      option('correct', '7/7 − 7/7 = 0/7 = 0', '7/7 − 7/7 = 0/7 = 0', "7/7 − 7/7 = 0/7 = 0", true),
      option('zero-denominator', '7/7 − 7/7 = 0/0', '7/7 − 7/7 = 0/0', "7/7 − 7/7 = 0/0", false, 'Знаменатель не вычитают; нулевой знаменатель недопустим.', "Maxraj ayirilmaydi; nol maxraj bo'lishi mumkin emas.", "Do not subtract the denominator; a zero denominator is not allowed."),
      option('unlike', '3/4 − 1/6 = 2/2', '3/4 − 1/6 = 2/2', "3/4 − 1/6 = 2/2", false, 'Сегодняшнее правило нельзя напрямую применять к разным знаменателям.', "Bugungi qoidani turli maxrajlarga to'g'ridan-to'g'ri qo'llab bo'lmaydi.", "Today's rule cannot be applied directly to different denominators."),
      option('remove-zero', '7/7 − 0/7 = 0/7', '7/7 − 0/7 = 0/7', "7/7 − 0/7 = 0/7", false, 'Если ничего не убрать, останется 7/7.', "Hech narsa olib tashlanmasa, 7/7 qoladi.", "If nothing is removed, 7/7 remains."),
    ],
    secondHint: b('На модели все семь частей помечены как убранные, но семь делений сохраняются.', "Modeldagi barcha yetti qism olib tashlangan deb belgilandi, ammo yetti bo'linma saqlanadi.", "All seven parts are marked as removed in the model, but the whole still has seven equal parts."),
    thirdHint: b('5/5 − 5/5 = 0/5 = 0.', "5/5 − 5/5 = 0/5 = 0.", "5/5 − 5/5 = 0/5 = 0."),
    correctText: b('Верно. 0/7 равно нулю.', "To'g'ri. 0/7 nolga teng.", "Correct. 0/7 equals zero."),
    rule: b('Ноль выбранных долей записывают с прежним ненулевым знаменателем.', "Tanlangan ulush nol bo'lsa ham, avvalgi noldan farqli maxraj saqlanadi.", "When zero parts are selected, write 0 as the numerator and keep the same non-zero denominator."),
  },
  {
    id: '09', level: 'red', kind: 'mc', skillTag: 'keep-denominator',
    visual: { type: 'formula', text: '9/13 − 4/13 = 5/0', error: true, subtext: b('Целое по-прежнему разделено на 13 частей.', "Butun hamon 13 qismga bo'lingan.", "The whole is still divided into 13 parts.") },
    setup: b('Получена неверная разность 9/13 − 4/13 = 5/0.', "9/13 − 4/13 = 5/0 degan noto'g'ri ayirma berilgan.", "The incorrect difference 9/13 − 4/13 = 5/0 was given."), prompt: b('В чём ошибка?', "Xato nimada?", "What is the error?"),
    options: [
      option('correct', 'Вычли знаменатели', 'Maxrajlar ayirilgan', "The denominators were subtracted", true),
      option('numerator', 'Неверно вычли числители', "Suratlar noto'g'ri ayirilgan", "The numerators were subtracted incorrectly", false, 'Числители вычтены верно: 9 − 4 = 5.', "Suratlar to'g'ri ayirilgan: 9 − 4 = 5.", "The numerators were subtracted correctly: 9 − 4 = 5."),
      option('addition', 'Нужно было складывать', "Qo'shish kerak edi", "Addition should have been used", false, 'Части убирают, поэтому действие выбрано верно.', "Qismlar olib tashlanmoqda, shuning uchun amal to'g'ri tanlangan.", "Parts are being removed, so the operation is correct."),
      option('whole', 'Результат должен быть целым', "Natija butun bo'lishi kerak", "The result must be a whole number", false, 'После удаления части целого может остаться дробь.', "Butunning bir qismi olib tashlansa, kasr qolishi mumkin.", "After part of a whole is removed, a fraction can remain."),
    ],
    secondHint: b('До и после вычитания модель имеет тринадцать равных делений.', "Ayirishdan oldin ham, keyin ham modelda o'n uchta teng bo'linma bor.", "The model has thirteen equal parts both before and after the subtraction."),
    thirdHint: b('В 7/10 − 2/10 знаменатель остаётся равным 10.', "7/10 − 2/10 da maxraj 10 bo'lib qoladi.", "In 7/10 − 2/10, the denominator stays 10."),
    correctText: b('Верно. Правильная разность равна 5/13.', "To'g'ri. To'g'ri ayirma 5/13.", "Correct. The correct difference is 5/13."),
    rule: b('Вычитание меняет число долей, но не размер доли.', "Ayirish ulushlar sonini o'zgartiradi, ulush o'lchamini emas.", "Subtraction changes the number of parts, but not the size of each part."),
  },
  {
    id: '10', level: 'red', kind: 'mc', skillTag: 'inverse-check',
    visual: { type: 'bar', total: 12, filled: 10, removed: 3, label: '10/12 − 3/12 = 7/12' },
    setup: b('Получена разность 10/12 − 3/12 = 7/12.', "10/12 − 3/12 = 7/12 ayirma olindi.", "The difference 10/12 − 3/12 = 7/12 was found."), prompt: b('Какая запись правильно проверяет результат?', "Qaysi yozuv natijani to'g'ri tekshiradi?", "Which expression checks the result correctly?"),
    options: [
      option('correct', '7/12 + 3/12 = 10/12', '7/12 + 3/12 = 10/12', "7/12 + 3/12 = 10/12", true),
      option('add-start', '7/12 + 10/12 = 17/12', '7/12 + 10/12 = 17/12', "7/12 + 10/12 = 17/12", false, 'К остатку нужно вернуть убранную часть, а не начальное количество.', "Qoldiqqa boshlang'ich miqdorni emas, olib tashlangan qismni qaytarish kerak.", "Add the removed part back to the remainder, not the starting amount."),
      option('subtract-again', '7/12 − 3/12 = 4/12', '7/12 − 3/12 = 4/12', "7/12 − 3/12 = 4/12", false, 'Повторное вычитание не возвращает начальное количество.', "Qayta ayirish boshlang'ich miqdorni qaytarmaydi.", "Subtracting again does not give the starting amount."),
      option('add-removed', '10/12 + 3/12 = 13/12', '10/12 + 3/12 = 13/12', "10/12 + 3/12 = 13/12", false, 'Проверку начинают с остатка 7/12.', "Tekshiruv 7/12 qoldiqdan boshlanadi.", "The check starts with the remainder 7/12."),
    ],
    secondHint: b('Сложите оставшиеся 7/12 и убранные 3/12.', "Qolgan 7/12 bilan olib tashlangan 3/12 ni qo'shing.", "Add the remaining 7/12 and the removed 3/12."),
    thirdHint: b('Если 8/9 − 2/9 = 6/9, то проверка: 6/9 + 2/9 = 8/9.', "8/9 − 2/9 = 6/9 bo'lsa, tekshiruv: 6/9 + 2/9 = 8/9.", "If 8/9 − 2/9 = 6/9, then the check is 6/9 + 2/9 = 8/9."),
    correctText: b('Верно. Остаток плюс убранная часть возвращают начальное количество.', "To'g'ri. Qoldiq bilan olib tashlangan qismning yig'indisi boshlang'ich miqdorni qaytaradi.", "Correct. The remainder plus the removed part gives the starting amount."),
    rule: b('Вычитание проверяют сложением разности и вычитаемого.', "Ayirish ayirma bilan ayiriluvchini qo'shish orqali tekshiriladi.", "Check subtraction by adding the difference and the amount subtracted."),
  },
];
function ScaleModel({ visual, interactive = false, picked, onPick, hint = false, disabled = false }) {
  const { min, max, intervals, markerIndex, vertical, showAll, unit = '' } = visual;
  const values = Array.from({ length: intervals + 1 }, (_, i) => min + ((max - min) / intervals) * i);
  return <div className={`p4-scale ${vertical ? 'is-vertical' : ''} ${hint ? 'is-hint' : ''}`}>
    <div className="p4-scale-axis">
      {values.map((value, index) => {
        const pos = `${(index / intervals) * 100}%`;
        const style = vertical ? { bottom: pos } : { left: pos };
        const label = `${value}${unit ? ` ${unit}` : ''}`;
        return <div className="p4-scale-tick" style={style} key={value}>
          {interactive ? <button type="button" disabled={disabled} className={picked === String(value) ? 'is-picked' : ''} onClick={() => onPick(String(value))} aria-label={label}>{showAll ? label : value}</button> : <span>{showAll || index === 0 || index === intervals ? label : ''}</span>}
        </div>;
      })}
      {markerIndex !== undefined && <span className="p4-marker" style={vertical ? { bottom: `${(markerIndex / intervals) * 100}%` } : { left: `${(markerIndex / intervals) * 100}%` }} aria-hidden="true">▼</span>}
    </div>
    {visual.error && <del className="p4-error-formula">{visual.error}</del>}
  </div>;
}

function Cells({ total, filled = 0, second = 0, removed = 0, selected = [], onToggle, allowed = null, unequal = false, selectionMode = 'add', resolved = false, layout = 'bar', disabled = false }) {
  const widths = unequal ? [1.6, .7, 1.2, .8, 1.7, 1, 1, 1, 1, 1].slice(0, total) : Array(total).fill(1);
  const gridColumns = total % 5 === 0 ? 5 : total % 4 === 0 ? 4 : Math.ceil(Math.sqrt(total));
  return <div className={`p4-cells ${layout === 'grid' ? 'is-grid' : ''}`} style={{ gridTemplateColumns: layout === 'grid' ? `repeat(${gridColumns},1fr)` : widths.map((v) => `${v}fr`).join(' ') }}>
    {Array.from({ length: total }, (_, i) => {
      const successful = resolved && selectionMode !== 'remove' && (i < filled || selected.includes(i));
      const cls = [i < filled ? 'is-filled' : '', i >= filled && i < filled + second ? 'is-second' : '', i >= Math.max(0, filled - removed) && i < filled ? 'is-removed' : '', selected.includes(i) ? (selectionMode === 'remove' ? 'is-selected-remove' : 'is-selected') : '', successful ? 'is-success' : ''].filter(Boolean).join(' ');
      const enabled = onToggle && !disabled && (!allowed || allowed.includes(i));
      return enabled ? <button type="button" aria-pressed={selected.includes(i)} aria-label={String(i + 1)} className={cls} key={i} onClick={() => onToggle(i)} style={{ animationDelay: `${i * 70}ms` }} /> : <span className={cls} key={i} style={{ animationDelay: `${i * 70}ms` }} />;
    })}
  </div>;
}

function FractionModel({ model }) {
  if (model.shape === 'circle') return <div className="p4-model-card"><div className="p4-circle" style={{ background: `conic-gradient(${T.accent} 0 ${(model.filled / model.total) * 100}%, ${T.cyanSoft} ${(model.filled / model.total) * 100}% 100%)` }}>{Array.from({ length: model.total }, (_, i) => <span aria-hidden="true" key={i} style={{ transform: `rotate(${(i * 360) / model.total}deg)` }}/>)}</div><b>{model.label}</b></div>;
  if (model.shape === 'line') return <div className="p4-model-card"><div className="p4-number-line">{Array.from({ length: model.total + 1 }, (_, i) => <span key={i} className={i === model.filled ? 'is-point' : ''} />)}</div><b>{model.label}</b></div>;
  return <div className="p4-model-card"><Cells total={model.total} filled={model.filled} second={model.second} removed={model.removed} unequal={model.unequal} layout={model.shape}/><b>{model.label}</b></div>;
}

function Visual({ task, hintLevel, lang }) {
  const visual = task.visual;
  if (!visual) return null;
  if (visual.type === 'scale') return <div className="p4-visual"><ScaleModel visual={visual} hint={hintLevel >= 2}/></div>;
  if (visual.type === 'scale-set') return <div className="p4-visual p4-model-grid">{visual.items.map((item) => <div className="p4-model-card" key={item.label}><b>{item.label}</b><ScaleModel visual={item}/></div>)}</div>;
  if (visual.type === 'sequence') return <div className="p4-visual p4-sequence">{visual.values.map((value, i) => <span key={`${value}-${i}`}>{value}</span>)}</div>;
  if (visual.type === 'bar') return <div className="p4-visual"><Cells {...visual}/>{visual.label && <b className="p4-caption">{visual.label}</b>}</div>;
  if (visual.type === 'models') return <div className="p4-visual p4-model-grid">{visual.items.map((model, i) => <FractionModel model={model} key={`${model.label}-${i}`}/>)}</div>;
  if (visual.type === 'formula') return <div className="p4-visual p4-formula"><b className={visual.error ? 'is-error' : ''}>{visual.text}</b>{visual.subtext && <span>{tx(visual.subtext, lang)}</span>}</div>;
  if (visual.type === 'tanks') return <div className="p4-visual p4-model-grid">{visual.items.map((model) => <FractionModel model={{ ...model, shape: 'bar' }} key={model.label}/>)}</div>;
  return null;
}

function NumPad({ value, onChange, max, disabled, lang }) {
  return <div className="p4-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}><div className="p4-pad-display">{value || '—'}</div><div className="p4-pad-keys">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => <button type="button" key={digit} disabled={disabled} onClick={() => onChange(value.length >= max ? value : `${value}${digit}`)}>{digit}</button>)}
    <button type="button" className="is-delete" disabled={disabled} aria-label={tx(UI.clear, lang)} onClick={() => onChange(value.slice(0, -1))}>⌫</button>
  </div></div>;
}

function Feedback({ ok, text, rule, lang, feedbackRef }) {
  return <div ref={feedbackRef} className={`p4-feedback ${ok ? 'is-ok' : 'is-no'}`} role="status" aria-live="polite"><p>{tx(text, lang)}</p>{ok && <p className="p4-rule"><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>}</div>;
}

// `platform` berilganda tugma qatori chizilmaydi: uni LMS o'zi beradi va
// tekshiruvni `registerCheck` orqali chaqiradi (LMS kontrakti).
function Task({ task, lang, isLast, onSolved ,
  platform = false, mode, onReady, registerCheck, onSubmit, playCorrect, playWrong,
}) {
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [placed, setPlaced] = useState({});
  const [activeStep, setActiveStep] = useState(null);
  const [selected, setSelected] = useState([]);
  const [fraction, setFraction] = useState({ n: null, d: null });
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [advancing, setAdvancing] = useState(false);
  const checkingRef = useRef(false);
  const advancedRef = useRef(false);
  const feedbackRef = useRef(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- yangi tartib ataylab: qayta boshlash va topshiriq kalitlari aralashtirishni chaqiradi
  const rightCards = useMemo(() => matchSpread(task.right, (card, row) => card.id === task.pairs[row]?.correctRight), [task.right]);
  const orderCards = useMemo(() => shuffle(task.cards || []), [task.cards]);

  useEffect(() => {
    if (checked) window.setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
  }, [checked]);

  const answerReady = (() => {
    if (task.kind === 'mc' || task.kind === 'ticks') return picked !== null;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed !== '';
    if (task.kind === 'match') return Object.keys(pairs).length === task.pairs.length;
    if (task.kind === 'order') return Object.keys(placed).length === task.steps.length;
    if (task.kind === 'shade') return selected.length > 0;
    if (task.kind === 'fracbuild') return fraction.n !== null && fraction.d !== null;
    return false;
  })();
  // Variantlar aralashtiriladi va XATO javobdan keyin qayta aralashadi:
  // bola javobni o'rni bo'yicha eslab qolmasin (metodist qarori 2026-08-21).
  // Tanlov ID bo'yicha saqlanadi, shuning uchun tartib o'zgarsa ham javob
  // va uning izohi kartaning o'ziga bog'langan qoladi.
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- wrongRound ataylab yangi tartib beradi
  const mcOptions = useMemo(() => (task.kind === 'mc' ? shuffle(task.options) : []), [task.id, task.options, task.kind, wrongRound]);
  const mcPicked = task.kind === 'mc' ? task.options.find((item) => item.id === picked) : null;
  const answerCorrect = () => {
    if (task.kind === 'mc') return Boolean(mcPicked?.correct);
    if (task.kind === 'ticks') return picked === task.answer;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed === task.answer;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    if (task.kind === 'order') return task.cards.every((card) => placed[task.steps[card.order].id] === card.id);
    if (task.kind === 'shade') return selected.length === task.selectCount;
    if (task.kind === 'fracbuild') return fraction.n === task.answer.n && fraction.d === task.answer.d;
    return false;
  };
  const answerSnapshot = () => {
    if (['mc', 'sign', 'card'].includes(task.kind)) return { optionId: task.options[picked]?.id, text: task.options[picked]?.text };
    if (task.kind === 'numpad' || task.kind === 'missing') return { value: typed };
    if (task.kind === 'ticks') return { value: picked };
    if (task.kind === 'match') return { pairs };
    if (task.kind === 'order') return { order: task.steps.map((step) => placed[step.id]) };
    if (task.kind === 'shade') return { selected: [...selected], selectedCount: selected.length };
    return { numerator: fraction.n, denominator: fraction.d };
  };
  const correctSnapshot = () => {
    if (['mc', 'sign', 'card'].includes(task.kind)) { const correct = task.options.find((item) => item.correct); return { optionId: correct.id, text: correct.text }; }
    if (task.kind === 'numpad' || task.kind === 'missing' || task.kind === 'ticks') return { value: task.answer };
    if (task.kind === 'match') return { pairs: Object.fromEntries(task.pairs.map((pair) => [pair.id, pair.correctRight])) };
    if (task.kind === 'order') return { order: task.cards.slice().sort((a, b) => a.order - b.order).map((card) => card.id) };
    if (task.kind === 'shade') {
      const numerator = task.selectionMode === 'remove' ? task.visual.filled - task.selectCount : task.visual.filled + task.selectCount;
      return { selectedCount: task.selectCount, fraction: `${numerator}/${task.visual.total}` };
    }
    return { numerator: task.answer.n, denominator: task.answer.d };
  };
  const resetResponse = () => {
    checkingRef.current = false; setChecked(false); setPicked(null); setTyped(''); setPairs({}); setActiveLeft(null); setPlaced({}); setActiveStep(null); setSelected([]); setFraction({ n: null, d: null });
  };
  const check = () => {
    if (!answerReady || solved || checked || checkingRef.current) return;
    checkingRef.current = true;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts); setChecked(true);
    if (answerCorrect()) setSolved(true); else setWrongRound((old) => old + 1);
  };
  const hintLevel = checked && !solved ? attempts : 0;
  const wrongText = adaptive(task, mcPicked, attempts);
  const setAnswer = (setter, value) => { checkingRef.current = false; setter(value); setChecked(false); };
  const toggleSelected = (index) => setAnswer(setSelected, selected.includes(index) ? selected.filter((value) => value !== index) : [...selected, index]);

  // --- LMS platforma kontrakti ------------------------------------------
  // Mexanikaga tegilmaydi: natija mavjud holatlardan o'qiladi.
  useEffect(() => { onReady?.(Boolean(answerReady) && !solved && mode !== 'review'); },
    [answerReady, solved, mode, onReady]);
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
  return <section className={`p4-task ${hintLevel >= 2 ? 'is-hint' : ''}`} aria-labelledby={`task-${task.id}`}>
    <p className={`p4-eyebrow is-${task.level}`}><span>{tx(UI.level[task.level], lang)}</span> · {tx(UI.task, lang)} {Number(task.id)}</p>
    <p className="p4-setup">{tx(task.setup, lang)}</p>
    {task.kind === 'ticks' ? <div className="p4-visual"><ScaleModel visual={task.visual} interactive picked={picked} onPick={(value) => setAnswer(setPicked, value)} hint={hintLevel >= 2} disabled={solved}/></div> :
      task.kind === 'shade' ? <div className="p4-visual"><Cells total={task.visual.total} filled={task.visual.filled} second={task.visual.second} removed={task.visual.removed} selected={selected} allowed={task.allowed} onToggle={toggleSelected} selectionMode={task.selectionMode} resolved={solved} disabled={solved}/></div> : <Visual task={task} hintLevel={hintLevel} lang={lang}/>}
    <h2 id={`task-${task.id}`} className="p4-ask">{tx(task.prompt, lang)}</h2>

    {task.kind === 'mc' && <div className="p4-options">{mcOptions.map((item, index) => <button type="button" key={item.id} disabled={solved} aria-pressed={picked === item.id} className={`p4-option ${picked === item.id ? (checked ? (item.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`} onClick={() => setAnswer(setPicked, item.id)}><span className="p4-letter">{'ABCD'[index]}</span><span>{tx(item.text, lang)}</span></button>)}</div>}
    {(task.kind === 'numpad' || task.kind === 'missing') && <NumPad value={typed} onChange={(value) => setAnswer(setTyped, value)} max={task.maxLen || 4} disabled={solved} lang={lang}/>}
    {task.kind === 'match' && <div className="p4-match"><p className="p4-note">{tx(UI.matchHint, lang)}</p><div className="p4-match-cols"><div className="p4-match-col">{task.pairs.map((pair) => <button type="button" key={pair.id} disabled={solved} aria-pressed={activeLeft === pair.id} className={`p4-match-item ${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''}${matchToneLeft(task, pairs, pair.id)}`} onClick={() => { checkingRef.current = false; setActiveLeft(pair.id); setChecked(false); }}><span>{tx(pair.left, lang)}</span>{pairs[pair.id] && <b>{tx(task.right.find((right) => right.id === pairs[pair.id])?.text, lang)}</b>}</button>)}</div><div className="p4-match-col">{rightCards.map((right) => { const used = Object.values(pairs).includes(right.id); return <button type="button" key={right.id} disabled={solved || activeLeft === null} className={`p4-match-item ${used ? 'is-used' : ''}${matchToneRight(task, pairs, right.id)}`} onClick={() => { checkingRef.current = false; setPairs((old) => matchTie(old, activeLeft, right.id)); setActiveLeft(null); setChecked(false); }}>{tx(right.text, lang)}</button>; })}</div></div></div>}
    {task.kind === 'order' && <div className="p4-order"><p className="p4-note">{tx(UI.orderHint, lang)}</p><div className="p4-order-slots">{task.steps.map((step) => <button type="button" key={step.id} disabled={solved} aria-pressed={activeStep === step.id} className={`p4-order-slot ${activeStep === step.id ? 'is-active' : ''}`} onClick={() => { checkingRef.current = false; setActiveStep(step.id); setChecked(false); }}><small>{tx(step.label, lang)}</small><b>{placed[step.id] ? tx(task.cards.find((card) => card.id === placed[step.id])?.text, lang) : '—'}</b></button>)}</div><div className="p4-card-bank">{orderCards.map((card) => { const used = Object.values(placed).includes(card.id); return <button type="button" key={card.id} disabled={solved || activeStep === null || used} className={`p4-card ${used ? 'is-used' : ''}`} onClick={() => { checkingRef.current = false; setPlaced((old) => ({ ...old, [activeStep]: card.id })); setActiveStep(null); setChecked(false); }}>{tx(card.text, lang)}</button>; })}</div></div>}
    {task.kind === 'fracbuild' && <div className="p4-frac-builder"><div><span>{tx(UI.numerator, lang)}</span>{task.nChoices.map((value) => <button type="button" key={value} disabled={solved} className={fraction.n === value ? 'is-active' : ''} onClick={() => { checkingRef.current = false; setFraction((old) => ({ ...old, n: value })); setChecked(false); }}>{value}</button>)}</div><hr/><div><span>{tx(UI.denominator, lang)}</span>{task.dChoices.map((value) => <button type="button" key={value} disabled={solved} className={fraction.d === value ? 'is-active' : ''} onClick={() => { checkingRef.current = false; setFraction((old) => ({ ...old, d: value })); setChecked(false); }}>{value}</button>)}</div></div>}

    {checked && <Feedback feedbackRef={feedbackRef} ok={solved} text={solved ? task.correctText : wrongText} rule={task.rule} lang={lang}/>}
    {!platform && <div className="p4-actions">{!checked && !solved && <button type="button" className="p4-btn" disabled={!answerReady} onClick={check}>{tx(UI.check, lang)}</button>}{checked && !solved && <button type="button" className="p4-btn p4-btn-ghost" onClick={resetResponse}>{tx(UI.retry, lang)}</button>}{solved && <button type="button" className="p4-btn p4-btn-ready" disabled={advancing} onClick={() => { if (advancedRef.current) return; advancedRef.current = true; checkingRef.current = false; setAdvancing(true); onSolved({ taskId: task.id, taskNumber: Number(task.id), level: task.level, kind: task.kind, skillTag: task.skillTag, attempts, firstTry: attempts === 1, correct: true, setup: task.setup, prompt: task.prompt, studentAnswer: answerSnapshot(), correctAnswer: correctSnapshot(), answerChoices: task.options?.map(({ id, text, correct }) => ({ id, text, correct: Boolean(correct) })) ?? task.right ?? task.cards ?? null, screenMeta: SCREEN_META.find((screen) => screen.taskId === task.id) }); }}>{tx(isLast ? UI.finish : UI.next, lang)}</button>}</div>}
  </section>;
}

export default function Grade4Dars21Practice({ lang: langProp, onFinished }) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = normalizeLang(preview ? previewLang : langProp);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [firstTry, setFirstTry] = useState(0);
  const [finished, setFinished] = useState(false);
  const finishedRef = useRef(false);
  const startedAtRef = useRef(0);
  useEffect(() => { if (!startedAtRef.current) startedAtRef.current = Date.now(); }, []);
  const task = TASKS[index];
  const percent = Math.round(((finished ? 10 : index) / 10) * 100);

  const onSolved = (record) => {
    const nextAnswers = [...answers, record];
    const nextFirstTry = firstTry + (record.firstTry ? 1 : 0);
    setAnswers(nextAnswers); setFirstTry(nextFirstTry);
    if (index === 9) {
      if (finishedRef.current) return;
      finishedRef.current = true; setFinished(true);
      const levelBreakdown = ['green', 'yellow', 'red'].reduce((result, level) => ({ ...result, [level]: { total: TASKS.filter((item) => item.level === level).length, firstTry: nextAnswers.filter((item) => item.level === level && item.firstTry).length } }), {});
      onFinished?.({
        lessonId: LESSON_META.lessonId, lessonTitle: tx(LESSON_META.lessonTitle, lang), lessonTitleLocalized: LESSON_META.lessonTitle,
        studentName: null, activityType: 'practice', completed: true, totalQuestions: 10, answeredQuestions: 10,
        correctAnswers: nextFirstTry, firstTryCorrect: nextFirstTry, scorePercent: Math.round((nextFirstTry / 10) * 100),
        finalScore: nextFirstTry, finalTotal: 10, passed: nextFirstTry >= 6,
        firstTryStats: { total: 10, firstTryCorrect: nextFirstTry, correct: nextFirstTry, answered: 10, scorePercent: Math.round((nextFirstTry / 10) * 100) },
        attemptsTotal: nextAnswers.reduce((sum, item) => sum + item.attempts, 0),
        // eslint-disable-next-line react-hooks/purity -- duration is captured when the lesson finishes
        durationSec: startedAtRef.current ? Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000)) : 0,
        skillTags: [...new Set(TASKS.map((item) => item.skillTag))], levelBreakdown, lessonMeta: LESSON_META, screenMeta: SCREEN_META, answers: nextAnswers,
      });
      return;
    }
    setIndex((old) => old + 1);
  };
  const restart = () => { finishedRef.current = false; startedAtRef.current = Date.now(); setIndex(0); setAnswers([]); setFirstTry(0); setFinished(false); };

  return <div className="p4-root"><style>{STYLES}</style>
    {preview && <div className="p4-lang" role="group" aria-label={tx(UI.language, lang)}>{SUPPORTED_LANGS.map((code) => <button type="button" key={code} aria-pressed={lang === code} className={lang === code ? 'is-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}
    <header className="p4-head"><div className="p4-progress" role="progressbar" aria-label={tx(UI.title, lang)} aria-valuemin="0" aria-valuemax="10" aria-valuenow={finished ? 10 : index}><div className="p4-progress-bar" style={{ width: `${percent}%` }}/></div><div className="p4-head-row"><span className="p4-title">{tx(UI.title, lang)}</span><span className="p4-counter">{finished ? 10 : index + 1} / 10</span></div></header>
    <main className="p4-main">{finished ? <section className="p4-done" aria-live="polite"><span className="p4-medal" aria-hidden="true">★</span><h2>{tx(UI.done, lang)}</h2><p className="p4-score"><b>{firstTry}</b><span>/ 10</span></p><p className="p4-note">{tx(UI.firstTry, lang)}</p><p className="p4-complete">{tx(UI.allSolved, lang)}</p><button type="button" className="p4-btn p4-btn-ready" onClick={restart}>{tx(UI.again, lang)}</button></section> : <Task key={task.id} task={task} lang={lang} isLast={index === 9} onSolved={onSolved}/>}</main>
  </div>;
}

const STYLES = `
.p4-root{position:relative;display:flex;flex-direction:column;min-height:100dvh;overflow-x:hidden;padding:0 0 18px;font-family:'Manrope',system-ui,sans-serif;color:${T.ink};background:${T.bg}}
.p4-root *,.p4-root *::before,.p4-root *::after{box-sizing:border-box}.p4-root h1,.p4-root h2,.p4-root h3,.p4-root h4,.p4-root h5,.p4-root h6,.p4-root p,.p4-root ul,.p4-root ol{margin:0}.p4-root button:focus-visible{outline:3px solid rgba(22,143,163,.45);outline-offset:3px}
.p4-lang{position:fixed;top:9px;right:9px;display:flex;gap:4px;padding:3px;z-index:20;border-radius:999px;background:${T.paper};box-shadow:${T.shadowBase}}.p4-lang button{min-width:44px;min-height:44px;padding:0 12px;border:0;border-radius:999px;background:transparent;color:${T.ink2};font:800 12px 'Manrope',sans-serif;cursor:pointer}.p4-lang button.is-active{background:${T.accent};color:#fff}
.p4-head{width:100%;padding:54px clamp(12px,4vw,24px) 7px}.p4-progress,.p4-head-row{width:min(100%,936px);margin-inline:auto}.p4-progress{height:6px;border-radius:99px;background:rgba(23,59,82,.12);overflow:hidden}.p4-progress-bar{height:100%;background:linear-gradient(90deg,${T.cyan},${T.accent});box-shadow:0 0 14px rgba(255,79,40,.42);transition:width .4s ease}.p4-head-row{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-top:8px}.p4-title{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(15px,2.4vw,19px)}.p4-counter{white-space:nowrap;font:700 13px 'JetBrains Mono',monospace;color:${T.ink3}}
.p4-main{flex:1;width:min(100%,936px);margin:0 auto;padding:3px clamp(12px,4vw,24px)}.p4-task{display:flex;flex-direction:column;gap:10px;width:100%;max-width:820px;margin:0 auto}.p4-eyebrow{font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.p4-eyebrow.is-green{color:${T.success}}.p4-eyebrow.is-yellow{color:${T.warn}}.p4-eyebrow.is-red{color:${T.accent}}.p4-setup{font-size:clamp(14px,2vw,16px);line-height:1.45;color:${T.ink2}}.p4-ask{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(17px,2.6vw,21px);line-height:1.3}.p4-note{font-size:13px;line-height:1.4;color:${T.ink3}}
.p4-visual{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;min-height:118px;padding:12px;border-radius:18px;background:${T.paper};box-shadow:${T.shadowBase};overflow:hidden}.p4-model-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:stretch}.p4-model-card{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;min-width:0;padding:8px;border-radius:14px;background:#FBFBF8}.p4-model-card>b,.p4-caption{font:800 13px 'JetBrains Mono',monospace;color:${T.navy}}
.p4-task.is-hint .p4-visual{box-shadow:inset 0 0 0 3px rgba(255,91,53,.2),${T.shadowBase}}.p4-task.is-hint .p4-formula b{color:${T.warn}}
.p4-scale{position:relative;width:min(100%,560px);height:92px;padding:30px 26px 18px}.p4-scale-axis{position:relative;width:100%;height:5px;margin-top:24px;border-radius:99px;background:${T.navy}}.p4-scale-tick{position:absolute;top:50%;transform:translate(-50%,-50%);width:3px;height:22px;border-radius:2px;background:${T.cyan}}.p4-scale-tick span,.p4-scale-tick button{position:absolute;top:25px;left:50%;transform:translateX(-50%);min-width:44px;min-height:44px;padding:4px;border:0;background:transparent;color:${T.navy};font:800 12px 'JetBrains Mono',monospace;white-space:nowrap}.p4-scale-tick button{border-radius:10px;cursor:pointer}.p4-scale-tick button:hover,.p4-scale-tick button.is-picked{background:${T.accentSoft};color:${T.accent}}.p4-marker{position:absolute;top:-34px;transform:translateX(-50%);color:${T.accent};font-size:24px;transition:left .4s ease,bottom .4s ease}.p4-scale.is-hint .p4-scale-axis{box-shadow:0 0 0 5px rgba(255,91,53,.16)}.p4-scale.is-vertical{width:150px;height:240px;padding:22px 45px}.p4-scale.is-vertical .p4-scale-axis{width:5px;height:190px;margin:0 auto}.p4-scale.is-vertical .p4-scale-tick{top:auto;left:50%;transform:translate(-50%,50%);width:24px;height:3px}.p4-scale.is-vertical .p4-scale-tick span,.p4-scale.is-vertical .p4-scale-tick button{top:50%;left:30px;transform:translateY(-50%)}.p4-scale.is-vertical .p4-marker{top:auto;left:-34px;transform:translateY(50%) rotate(-90deg)}.p4-error-formula{display:block;margin-top:13px;text-align:center;color:${T.warn};font:800 14px 'JetBrains Mono',monospace}.p4-sequence{gap:8px}.p4-sequence span{display:flex;align-items:center;justify-content:center;min-width:66px;min-height:50px;border-radius:12px;background:${T.cyanSoft};font:800 18px 'JetBrains Mono',monospace;color:${T.navy}}
.p4-cells{display:grid;width:min(100%,520px);gap:4px}.p4-cells>span,.p4-cells>button{min-width:0;min-height:62px;border:0;border-radius:8px;background:${T.cyanSoft};box-shadow:inset 0 0 0 1px rgba(22,143,163,.2);animation:p4-cell-in .28s both}.p4-cells>button{cursor:pointer}.p4-cells .is-filled{background:${T.cyan}}.p4-cells .is-second,.p4-cells .is-selected{background:${T.lime}}.p4-cells .is-removed,.p4-cells .is-selected-remove{background:${T.warnSoft};box-shadow:inset 0 0 0 2px ${T.warn}}.p4-cells .is-success{background:${T.success};box-shadow:inset 0 0 0 1px rgba(34,122,83,.34)}.p4-circle{position:relative;overflow:hidden;width:84px;height:84px;border-radius:50%;box-shadow:inset 0 0 0 2px ${T.paper},0 0 0 2px ${T.cyan}}.p4-circle>span{position:absolute;top:0;left:50%;height:50%;border-left:2px solid rgba(255,255,255,.92);transform-origin:50% 100%}.p4-number-line{position:relative;display:flex;align-items:center;width:150px;height:52px;margin-bottom:20px;border-bottom:4px solid ${T.navy}}.p4-number-line span{position:relative;flex:1;height:14px;border-left:2px solid ${T.cyan}}.p4-number-line span:last-child{flex:0}.p4-number-line span.is-point::after{content:'';position:absolute;left:-7px;bottom:-1px;width:12px;height:12px;border-radius:50%;background:${T.accent};box-shadow:0 0 0 4px ${T.accentSoft}}.p4-number-line::before,.p4-number-line::after{position:absolute;bottom:-23px;font:800 11px 'JetBrains Mono',monospace;color:${T.ink2}}.p4-number-line::before{content:'0';left:-2px}.p4-number-line::after{content:'1';right:-2px}
.p4-cells.is-grid{width:min(100%,260px)}.p4-cells.is-grid>span,.p4-cells.is-grid>button{min-height:44px}
.p4-formula{flex-direction:column}.p4-formula b{font:800 clamp(18px,4vw,27px) 'JetBrains Mono',monospace;color:${T.navy}}.p4-formula b.is-error{color:${T.warn};text-decoration:line-through}.p4-formula span{color:${T.ink2}}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.p4-option{display:flex;align-items:center;gap:9px;min-height:54px;padding:9px 11px;text-align:left;font-family:inherit;font-weight:700;font-size:clamp(13px,1.9vw,15px);line-height:1.35;color:${T.ink};background:${T.paper};border:0;border-radius:14px;cursor:pointer;box-shadow:${T.shadowBase};transition:border-color .18s,background-color .18s,transform .18s}.p4-option:hover:not(:disabled){transform:translateY(-1px)}.p4-letter{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;background:${T.cyanSoft};color:${T.cyan};font:800 11px 'JetBrains Mono',monospace}.p4-option.is-on{background:${T.accentSoft};box-shadow:inset 0 0 0 2px ${T.accent}}.p4-option.is-ok{background:${T.successSoft};color:${T.success}}.p4-option.is-no{background:${T.warnSoft};color:${T.warn};animation:p4-shake .17s ease}
.p4-match-cols{display:flex;gap:9px;margin-top:7px}.p4-match-col{display:flex;flex-direction:column;gap:7px;flex:1}.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:48px;padding:7px 9px;border:0;border-radius:12px;background:${T.paper};font:800 clamp(12px,2.2vw,15px) 'Manrope',sans-serif;color:${T.navy};cursor:pointer;box-shadow:${T.shadowBase}}.p4-match-item.is-active{background:${T.accentSoft};box-shadow:inset 0 0 0 2px ${T.accent}}.p4-match-item.is-tied{background:${T.cyanSoft}}.p4-match-item.is-used{background:${T.successSoft}}.p4-match-item:disabled{cursor:default;opacity:.62}.p4-match-item b{font-size:12px;color:${T.success}}
.p4-order-slots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:7px}.p4-order-slot{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:74px;padding:7px;border:0;border-radius:13px;background:${T.paper};color:${T.ink2};font-family:inherit;cursor:pointer;box-shadow:${T.shadowBase}}.p4-order-slot.is-active{background:${T.accentSoft};box-shadow:inset 0 0 0 2px ${T.accent}}.p4-order-slot small{font-weight:800}.p4-order-slot b{font:800 12px/1.25 'JetBrains Mono',monospace;color:${T.navy}}.p4-card-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-top:8px}.p4-card{min-width:44px;min-height:46px;padding:7px 11px;border:0;border-radius:12px;background:${T.paper};font:800 13px 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer;box-shadow:${T.shadowBase}}.p4-card.is-used{background:${T.cyanSoft}}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:7px;width:min(232px,100%);margin:0 auto;padding:10px;border-radius:17px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8)}.p4-pad-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:48px;border-radius:13px;background:${T.paper};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;color:${T.navy};box-shadow:inset 0 0 0 2px ${T.accent}}.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;width:100%}.p4-pad-keys button{min-width:44px;min-height:44px;border:0;border-radius:11px;background:${T.paper};font:800 clamp(18px,3.6vw,22px) 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer;box-shadow:0 5px 14px -12px rgba(23,59,82,.7)}.p4-pad-keys .is-delete{background:${T.accentSoft};color:${T.accent}}
.p4-frac-builder{display:grid;gap:8px;padding:12px;border-radius:17px;background:${T.paper};box-shadow:${T.shadowBase}}.p4-frac-builder>div{display:flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap}.p4-frac-builder span{min-width:90px;color:${T.ink2};font-weight:800}.p4-frac-builder button{min-width:44px;min-height:44px;border:0;border-radius:11px;background:${T.cyanSoft};color:${T.cyan};font:800 17px 'JetBrains Mono',monospace;cursor:pointer}.p4-frac-builder button.is-active{background:${T.accent};color:#fff}.p4-frac-builder hr{width:180px;margin:0 auto;border:0;border-top:3px solid ${T.navy}}
.p4-feedback{padding:11px 13px;border-radius:14px;animation:p4-result .22s ease both}.p4-feedback.is-ok{background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}.p4-feedback.is-no{background:${T.warnSoft};box-shadow:inset 4px 0 0 ${T.warn}}.p4-feedback p{font-family:'Source Serif 4',Georgia,serif;font-size:clamp(14px,2.1vw,16px);line-height:1.42}.p4-rule{margin-top:7px!important;color:${T.ink2}}
.p4-actions{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:9px}.p4-btn{min-width:44px;min-height:46px;padding:9px 20px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font-family:inherit;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5)}.p4-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.p4-btn-ready{background:${T.accent};color:#fff}.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}
.p4-done{display:flex;flex-direction:column;align-items:center;gap:9px;padding:24px 12px;text-align:center}.p4-done h2{font-family:'Source Serif 4',Georgia,serif}.p4-medal{display:flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:50%;background:${T.accent};color:#fff;font-size:34px;box-shadow:0 0 0 9px ${T.accentSoft}}.p4-score{display:flex;align-items:baseline;gap:5px;font-family:'JetBrains Mono',monospace}.p4-score b{font-size:clamp(32px,7vw,44px);color:${T.success}}.p4-score span{font-size:16px;color:${T.ink3}}.p4-complete{color:${T.ink2}}
@keyframes p4-cell-in{from{opacity:.35;transform:scale(.94)}to{opacity:1;transform:none}}@keyframes p4-result{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}@keyframes p4-shake{0%,100%{transform:none}35%{transform:translateX(-4px)}70%{transform:translateX(4px)}}
@media(max-width:640px){.p4-model-grid{grid-template-columns:1fr}.p4-options{grid-template-columns:1fr}.p4-order-slots{grid-template-columns:repeat(2,minmax(0,1fr))}.p4-scale.is-vertical{height:220px}.p4-visual{min-height:104px}.p4-match-cols{gap:7px}}
@media(prefers-reduced-motion:reduce){.p4-root *,.p4-root *::before,.p4-root *::after{scroll-behavior:auto!important;animation:none!important;transition:none!important}}

/* PRACTICE-FIX boshlanishi — metodist qarori 2026-08-21.
   1) Tekshirish tugmasi o'ngda (2-dars etaloni).
   2) Moslashtirishda ikki tomondagi kartochkalar bir xil o'lchamda: ustun grid
      bo'ladi va qatorlari 1fr, shuning uchun juftlar qator bo'yicha tekislanadi.
   Bu blok har darsda takrorlanadi ATAYLAB: LMS avtonom fayl talab qiladi. */
.p4-actions, .g4p-actions { justify-content: flex-end; }
.p4-match-cols, .g4p-match-cols { align-items: stretch; }
.p4-match-col, .g4p-match-col { display: grid; grid-auto-rows: 1fr; align-content: stretch; }
/* PRACTICE-FIX tugashi */

/* MATCH-FIX boshlanishi — metodist qarori 2026-08-21.
   Juftlikning ikki tomoni bir xil rang va bir xil belgi oladi: uchta qator
   uchta rangda ko'rinadi. Rang tanlangan (is-active) va band (is-used)
   holatlaridan ustun turishi kerak, shuning uchun !important. Tanlov va
   tekshiruv holatlari esa rangdan ustun: ular pastda, keyingi qatorlarda.
   Blok har darsda takrorlanadi ATAYLAB: LMS avtonom fayl talab qiladi. */
.p4-match [class*="p4-tone"],.g4p-match [class*="p4-tone"]{position:relative;opacity:1!important}
.p4-match [class*="p4-tone"]::before,.g4p-match [class*="p4-tone"]::before{position:absolute;top:2px;left:4px;font-size:9px;line-height:1;opacity:.9;pointer-events:none}
.p4-match [class*="p4-tone"] b,.g4p-match [class*="p4-tone"] b,.p4-match [class*="p4-tone"] small,.g4p-match [class*="p4-tone"] small{color:inherit!important}
.p4-match .p4-tone1,.g4p-match .p4-tone1{background:#DCF0F3!important;border-color:#0E7C8F!important;box-shadow:inset 0 0 0 2px #0E7C8F!important;color:#0B5A68!important}
.p4-match .p4-tone1::before,.g4p-match .p4-tone1::before{content:"●";color:#0E7C8F}
.p4-match .p4-tone2,.g4p-match .p4-tone2{background:#E9E4F7!important;border-color:#5E45AD!important;box-shadow:inset 0 0 0 2px #5E45AD!important;color:#3E2E75!important}
.p4-match .p4-tone2::before,.g4p-match .p4-tone2::before{content:"■";color:#5E45AD}
.p4-match .p4-tone3,.g4p-match .p4-tone3{background:#FBE2EA!important;border-color:#AE3760!important;box-shadow:inset 0 0 0 2px #AE3760!important;color:#77223F!important}
.p4-match .p4-tone3::before,.g4p-match .p4-tone3::before{content:"◆";color:#AE3760}
.p4-match .p4-tone4,.g4p-match .p4-tone4{background:#E2E8F0!important;border-color:#3C5A80!important;box-shadow:inset 0 0 0 2px #3C5A80!important;color:#27405C!important}
.p4-match .p4-tone4::before,.g4p-match .p4-tone4::before{content:"★";color:#3C5A80}
.p4-match .p4-tone5,.g4p-match .p4-tone5{background:#EFE6DA!important;border-color:#6B4A2B!important;box-shadow:inset 0 0 0 2px #6B4A2B!important;color:#4A3219!important}
.p4-match .p4-tone5::before,.g4p-match .p4-tone5::before{content:"▲";color:#6B4A2B}
.p4-match .p4-tone6,.g4p-match .p4-tone6{background:#FBEBCB!important;border-color:#A2690F!important;box-shadow:inset 0 0 0 2px #A2690F!important;color:#6E4708!important}
.p4-match .p4-tone6::before,.g4p-match .p4-tone6::before{content:"✚";color:#A2690F}
.p4-match .is-active,.g4p-match .is-active{background:#FFF0EA!important;border-color:#FF5B35!important;box-shadow:inset 0 0 0 2px #FF5B35!important;color:#12212C!important}
.p4-match .is-ok,.g4p-match .is-ok{background:#E7F3EC!important;border-color:#227A53!important;box-shadow:inset 0 0 0 2px #227A53!important;color:#1B5E40!important}
.p4-match .is-no,.g4p-match .is-no{background:#FFF5D9!important;border-color:#A96F13!important;box-shadow:inset 0 0 0 2px #A96F13!important;color:#7C5210!important}
/* MATCH-FIX tugashi */
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
