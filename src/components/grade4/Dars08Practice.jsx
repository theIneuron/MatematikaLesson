// ============================================================================
// 4-SINF · Dars 8 amaliyoti — Ko'p xonali sonlarni qo'shish va ayirish
// Dars01Practice vizual/texnik etaloni asosida: 10 topshiriq, RU/UZ, ovozsiz.
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
const matchRows = (task) => (task.pairs || task.left || []).map((item, row) => row);
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
  navy: '#173B52', success: '#227A53', successSoft: '#E7F3EC', warn: '#A96F13', warnSoft: '#FFF5D9',
};

const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';

const ENGLISH = {
  'Урок 8. Практика: сложение и вычитание': 'Lesson 8. Practice: addition and subtraction',
  'Задание': 'Task',
  'Проверить': 'Check',
  'Следующее': 'Next',
  'Завершить': 'Finish',
  'Пройти заново': 'Try again',
  'Запомни': 'Remember',
  'Попробовать ещё': 'Try once more',
  'Набери ответ': 'Enter your answer',
  'Стереть': 'Clear',
  'Сначала выбери карточку слева, затем её пару справа': 'First choose a card on the left, then choose its match on the right',
  'Выбери одну цифру': 'Choose one digit',
  'Выбери состояние верхней строки': 'Choose the state of the top row',
  'Практика пройдена': 'Practice complete',
  'из 10': 'out of 10',
  'Язык': 'Language',
  'Столько заданий решено с первой попытки.': 'This many tasks were completed correctly on the first attempt.',
  'Числа имеют разное количество цифр.': 'The numbers have different numbers of digits.',
  'Как правильно расположить их столбиком?': 'How should they be aligned for column addition?',
  'Единицы стоят под единицами': 'The ones are aligned beneath the ones',
  'Числа выровнены слева': 'The numbers are aligned on the left',
  'Так одинаковые разряды оказались не друг под другом. Найди единицы обоих чисел.': 'This does not align equal place values. Find the ones digit in each number.',
  'Второе число сдвинуто вправо': 'The second number is shifted to the right',
  'Единицы второго числа ушли правее единиц первого. Совмести последние цифры.': 'The ones digit of the second number is to the right of the first. Align the final digits.',
  'Верно. Последние цифры 6 и 2 стоят в одном разряде единиц.': 'Correct. The final digits, 6 and 2, are aligned in the ones column.',
  'При записи столбиком выравнивай числа по разряду единиц.': 'When writing numbers in columns, align them by the ones place.',
  'Разряды уже выровнены.': 'The place values are already aligned.',
  'Найди сумму.': 'Find the sum.',
  'Начни с единиц и складывай цифры одного разряда.': 'Start with the ones and add digits with the same place value.',
  'В этом примере ни в одном разряде не требуется перенос. Проверь каждую колонку отдельно.': 'This example needs no carrying. Check each column separately.',
  'Верно: 54 673 + 23 214 = 77 887.': 'Correct: 54 673 + 23 214 = 77 887.',
  'Складывай только единицы одинаковых разрядов.': 'Only add units with the same place value.',
  'Каждый результат не меньше десяти нужно обменять.': 'Each result of ten or more must be regrouped.',
  'Соедини количество с правильным обменом.': 'Match each quantity to the correct regrouping.',
  '13 единиц': '13 ones',
  '1 десяток + 3 единицы': '1 ten + 3 ones',
  '14 десятков': '14 tens',
  '1 сотня + 4 десятка': '1 hundred + 4 tens',
  '12 сотен': '12 hundreds',
  '1 тысяча + 2 сотни': '1 thousand + 2 hundreds',
  '11 тысяч': '11 thousands',
  '1 десяток тысяч + 1 тысяча': '1 ten thousand + 1 thousand',
  'Одна пара меняет величину. Десять единиц данного разряда дают одну единицу следующего разряда.': 'One pair changes the value. Ten units in one place make one unit in the next place.',
  'Верно. В каждой паре десять меньших единиц обменены на одну большую.': 'Correct. In each pair, ten smaller units have been regrouped as one larger unit.',
  'Перенос означает обмен 10 единиц на 1 единицу следующего разряда.': 'Carrying means regrouping 10 units as 1 unit in the next place.',
  'В нескольких разрядах появится перенос.': 'You will need to carry in several places.',
  'Вычисли сумму.': 'Calculate the sum.',
  'Записывай единицы результата, а десяток переноси в следующую колонку.': 'Write the ones digit of each result and carry the ten into the next column.',
  'Проверь цепочку переносов из единиц в десятки и из десятков в сотни.': 'Check the carrying from ones to tens and from tens to hundreds.',
  'Верно: 37 586 + 24 749 = 62 335.': 'Correct: 37 586 + 24 749 = 62 335.',
  'Каждый перенос прибавляется при вычислении следующего разряда.': 'Add each carried value when calculating the next place.',
  'Из результата исчезла одна цифра.': 'One digit is missing from the result.',
  'Какую цифру нужно вернуть?': 'Which digit should be restored?',
  'Проверь сотни, затем учти перенос в разряд тысяч. Пропуск должен сохранить все места результата.': 'Check the hundreds, then include the carry into the thousands. The missing digit must preserve every place in the result.',
  'Верно. Получилось 44 034: ноль сохраняет разряд сотен.': 'Correct. The result is 44 034: the zero preserves the hundreds place.',
  'Ноль внутри ответа нельзя пропускать: он сохраняет разряд.': 'Do not omit a zero inside an answer: it preserves a place value.',
  'У Мадины было 43 875 книг, затем привезли ещё 8 946.': 'Madina had 43 875 books, then another 8 946 arrived.',
  'Сколько книг стало?': 'How many books are there now?',
  '52 821': '52 821',
  '34 929': '34 929',
  'Ты нашёл разность. Слово ещё означает, что количество увеличилось.': 'You found the difference. The word another means that the quantity increased.',
  '43 883': '43 883',
  'К исходному числу прибавлена только последняя цифра. Нужно прибавить всё число 8 946 по разрядам.': 'Only the final digit was added to the original number. Add all of 8 946 by place value.',
  '438 758 946': '438 758 946',
  'Числа записаны рядом, а задача требует найти их сумму.': 'The numbers have been placed side by side, but the problem asks for their sum.',
  'Верно. После поступления стало 52 821 книга.': 'Correct. After the delivery, there were 52 821 books.',
  'Если количество увеличилось на несколько единиц, используй сложение.': 'Use addition when a quantity increases by a given amount.',
  'Каждое вычисление можно проверить обратным действием.': 'Every calculation can be checked with the inverse operation.',
  'Соедини вычисление с подходящей проверкой.': 'Match each calculation to the appropriate check.',
  'Одна проверка не возвращает исходное число. Сумму проверяй вычитанием, а разность — сложением.': 'One check does not return the original number. Check a sum with subtraction and a difference with addition.',
  'Верно. Каждая проверка вернула известное исходное число.': 'Correct. Each check returned the known original number.',
  'Сложение и вычитание являются обратными действиями.': 'Addition and subtraction are inverse operations.',
  'Для вычитания из 4 числа 9 нужно пройти через цепочку нулей.': 'To subtract 9 from 4, you must regroup through a chain of zeros.',
  'Как выглядит верхняя строка после обмена?': 'What does the top row look like after regrouping?',
  'Единицы получили десяток, но ни один разряд слева не уменьшился. Найди первый ненулевой разряд.': 'The ones received a ten, but no place to the left was reduced. Find the first non-zero place.',
  'После передачи единицы вправо каждый промежуточный разряд должен уменьшиться на один.': 'After passing one unit to the right, each intermediate place must decrease by one.',
  'Разряд десятков отдал один десяток единицам, поэтому в нём не может остаться десять.': 'The tens place gave one ten to the ones, so ten cannot remain there.',
  'Верно. Получается 4 | 9 | 9 | 9 | 14, а разность равна 31 275.': 'Correct. The row becomes 4 | 9 | 9 | 9 | 14, and the difference is 31 275.',
  'Через цепочку нулей занимай у первого ненулевого разряда слева.': 'When regrouping through zeros, borrow from the first non-zero place on the left.',
  'В вычислении потерялся один перенос.': 'One carry is missing from the calculation.',
  'Какой разряд вычислен неверно первым?': 'Which place value was calculated incorrectly first?',
  'Тысячи': 'Thousands',
  'Единицы': 'Ones',
  'Пять и шесть дают одиннадцать: единица записана верно, а перенос отправлен дальше.': 'Five plus six is eleven: the one is written correctly and the carry moves on.',
  'Десятки': 'Tens',
  'Восемь, девять и перенос дают восемнадцать. Цифра 8 в ответе верна.': 'Eight, nine and the carry make eighteen. The digit 8 in the answer is correct.',
  'Сотни': 'Hundreds',
  'Шесть, семь и перенос дают четырнадцать. Цифра 4 записана верно, но следующий перенос нужно сохранить.': 'Six, seven and the carry make fourteen. The digit 4 is correct, but the next carry must be kept.',
  'Верно. В тысячах забыли перенос из сотен. Правильная сумма — 76 481.': 'Correct. The carry from the hundreds was omitted in the thousands column. The correct sum is 76 481.',
  'Ищи первую ошибку справа налево, начиная с единиц.': 'Look for the first error from right to left, starting with the ones.',
  'На складе было 62 540 единиц товара, 17 865 единиц использовали.': 'A warehouse held 62 540 items, and 17 865 items were used.',
  'Какой план полностью решает и проверяет задачу?': 'Which plan both solves and checks the problem completely?',
  'Оценить ≈ 45 000; вычислить 44 675; проверить 44 675 + 17 865 = 62 540': 'Estimate ≈ 45 000; calculate 44 675; check 44 675 + 17 865 = 62 540',
  'Сложить и получить 80 405, потому что количество использовали': 'Add to get 80 405 because some of the quantity was used',
  'Использованная часть уменьшает остаток. Сначала выбери действие по смыслу задачи.': 'The amount used reduces what remains. First choose the operation that matches the problem.',
  'Оценить ≈ 45 000 и записать это как точный ответ': 'Estimate ≈ 45 000 and write it as the exact answer',
  'Оценка показывает только величину результата. Для точного ответа нужно выполнить вычитание.': 'An estimate shows only the approximate size of the result. Subtract to find the exact answer.',
  'Получить 44 675 и проверить ещё одним вычитанием': 'Get 44 675 and check it with another subtraction',
  'Результат найден верно, но проверка должна вернуть исходное количество обратным действием.': 'The result is correct, but the check must use the inverse operation to return the original quantity.',
  'Верно. Осталось 44 675 единиц, и обратное действие возвращает 62 540.': 'Correct. There are 44 675 items left, and the inverse operation returns 62 540.',
  'Оценка проверяет величину ответа, а обратное действие — его точность.': 'An estimate checks the size of an answer; the inverse operation checks its accuracy.',
};

const addEnglish = (value) => {
  if (Array.isArray(value)) return value.map(addEnglish);
  if (!value || typeof value !== 'object') return value;
  const result = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, addEnglish(item)]));
  if (typeof value.ru === 'string' && typeof value.uz === 'string') {
    const english = ENGLISH[value.ru];
    if (!english) throw new Error(`Missing English translation: ${value.ru}`);
    result.en = english;
  }
  return result;
};

const LESSON_META = {
  lessonId: 'num-4-08-practice',
  lessonTitle: { uz: "8-dars. Amaliyot: qo'shish va ayirish", ru: 'Урок 8. Практика: сложение и вычитание', en: 'Lesson 8. Practice: addition and subtraction' },
};

const UI = addEnglish({
  task: { ru: 'Задание', uz: 'Topshiriq', en: "Task" }, check: { ru: 'Проверить', uz: 'Tekshirish', en: "Check" },
  next: { ru: 'Следующее', uz: 'Keyingisi', en: "Next" }, finish: { ru: 'Завершить', uz: 'Yakunlash', en: "Finish" },
  again: { ru: 'Пройти заново', uz: 'Qaytadan', en: "Try again" }, rule: { ru: 'Запомни', uz: 'Eslab qoling', en: "Remember" },
  retry: { ru: 'Попробовать ещё', uz: "Yana urinib ko'ring", en: "Try once more" }, typeAnswer: { ru: 'Набери ответ', uz: 'Javobni kiriting', en: "Enter your answer" },
  clear: { ru: 'Стереть', uz: "O'chirish", en: "Clear" },
  matchHint: { ru: 'Сначала выбери карточку слева, затем её пару справа', uz: "Avval chapdagi kartani, keyin uning o'ngdagi juftini tanlang", en: "First choose a card on the left, then choose its match on the right" },
  digitHint: { ru: 'Выбери одну цифру', uz: 'Bitta raqamni tanlang', en: "Choose one digit" },
  stateHint: { ru: 'Выбери состояние верхней строки', uz: 'Yuqori qator holatini tanlang', en: "Choose the state of the top row" },
  done: { ru: 'Практика пройдена', uz: 'Amaliyot tugadi', en: "Practice complete" }, ofTen: { ru: 'из 10', uz: '10 dan', en: "out of 10" },
  language: { ru: 'Язык', uz: 'Til', en: "Language" },
  firstTryNote: { ru: 'Столько заданий решено с первой попытки.', uz: "Birinchi urinishda to'g'ri bajarilgan topshiriqlar soni.", en: "This many tasks were completed correctly on the first attempt." },
});

const tx = (node, lang) => (node && typeof node === 'object' ? (node[normalizeLang(lang)] ?? '') : node);
const grouped = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const shuffle = (items) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const TASKS = addEnglish([
  {
    id: '01', kind: 'mc', level: '🟢', figure: '47 306 + 5 482',
    setup: { ru: 'Числа имеют разное количество цифр.', uz: 'Sonlardagi raqamlar soni har xil.', en: "The numbers have different numbers of digits." },
    prompt: { ru: 'Как правильно расположить их столбиком?', uz: "Ularni ustun shaklida qanday to'g'ri joylashtirish kerak?", en: "How should they be aligned for column addition?" },
    options: [
      { visual: ' 47306\n+ 5482', text: { ru: 'Единицы стоят под единицами', uz: 'Birliklar birliklar ostida turibdi', en: "The ones are aligned beneath the ones" }, correct: true },
      { visual: ' 47306\n+5482 ', text: { ru: 'Числа выровнены слева', uz: 'Sonlar chap tomondan tekislangan', en: "The numbers are aligned on the left" }, wrong: { ru: 'Так одинаковые разряды оказались не друг под другом. Найди единицы обоих чисел.', uz: "Bunday joylashuvda bir xil xonalar ustma-ust kelmadi. Ikkala sonning birlar xonasini toping.", en: "This does not align equal place values. Find the ones digit in each number." } },
      { visual: ' 47306\n+  5482', text: { ru: 'Второе число сдвинуто вправо', uz: "Ikkinchi son o'ngga siljitilgan", en: "The second number is shifted to the right" }, wrong: { ru: 'Единицы второго числа ушли правее единиц первого. Совмести последние цифры.', uz: "Ikkinchi sonning birliklari birinchi son birliklaridan o'ngga o'tib ketdi. Oxirgi raqamlarni tekislang.", en: "The ones digit of the second number is to the right of the first. Align the final digits." } },
    ],
    correctText: { ru: 'Верно. Последние цифры 6 и 2 стоят в одном разряде единиц.', uz: "To'g'ri. Oxirgi 6 va 2 raqamlari birlar xonasida ustma-ust turibdi.", en: "Correct. The final digits, 6 and 2, are aligned in the ones column." },
    rule: { ru: 'При записи столбиком выравнивай числа по разряду единиц.', uz: "Ustun shaklida yozganda sonlarni birlar xonasi bo'yicha tekislang.", en: "When writing numbers in columns, align them by the ones place." },
  },
  {
    id: '02', kind: 'numpad', level: '🟢', answer: '77887', maxLen: 5, figure: '54 673 + 23 214',
    setup: { ru: 'Разряды уже выровнены.', uz: 'Xonalar allaqachon tekislangan.', en: "The place values are already aligned." },
    prompt: { ru: 'Найди сумму.', uz: "Yig'indini toping.", en: "Find the sum." },
    hints: [
      { ru: 'Начни с единиц и складывай цифры одного разряда.', uz: "Birlar xonasidan boshlang va bir xil xona raqamlarini qo'shing.", en: "Start with the ones and add digits with the same place value." },
      { ru: 'В этом примере ни в одном разряде не требуется перенос. Проверь каждую колонку отдельно.', uz: "Bu misolda hech bir xonada ko'chirish kerak emas. Har bir ustunni alohida tekshiring.", en: "This example needs no carrying. Check each column separately." },
    ],
    correctText: { ru: 'Верно: 54 673 + 23 214 = 77 887.', uz: "To'g'ri: 54 673 + 23 214 = 77 887.", en: "Correct: 54 673 + 23 214 = 77 887." },
    rule: { ru: 'Складывай только единицы одинаковых разрядов.', uz: "Faqat bir xil xona birliklarini qo'shing.", en: "Only add units with the same place value." },
  },
  {
    id: '03', kind: 'match', level: '🟡',
    setup: { ru: 'Каждый результат не меньше десяти нужно обменять.', uz: "10 yoki undan katta har bir natijani almashtirish kerak.", en: "Each result of ten or more must be regrouped." },
    prompt: { ru: 'Соедини количество с правильным обменом.', uz: "Miqdorni to'g'ri almashtirish bilan moslashtiring.", en: "Match each quantity to the correct regrouping." },
    pairs: [
      { id: 'a', left: { ru: '13 единиц', uz: '13 birlik', en: "13 ones" }, right: { ru: '1 десяток + 3 единицы', uz: "1 o'nlik + 3 birlik", en: "1 ten + 3 ones" } },
      { id: 'b', left: { ru: '14 десятков', uz: "14 o'nlik", en: "14 tens" }, right: { ru: '1 сотня + 4 десятка', uz: "1 yuzlik + 4 o'nlik", en: "1 hundred + 4 tens" } },
      { id: 'c', left: { ru: '12 сотен', uz: '12 yuzlik', en: "12 hundreds" }, right: { ru: '1 тысяча + 2 сотни', uz: '1 minglik + 2 yuzlik', en: "1 thousand + 2 hundreds" } },
      { id: 'd', left: { ru: '11 тысяч', uz: '11 minglik', en: "11 thousands" }, right: { ru: '1 десяток тысяч + 1 тысяча', uz: "1 o'n minglik + 1 minglik", en: "1 ten thousand + 1 thousand" } },
    ],
    wrongText: { ru: 'Одна пара меняет величину. Десять единиц данного разряда дают одну единицу следующего разряда.', uz: "Juftliklardan biri miqdorni o'zgartirib yubordi. Bir xonaning 10 birligi keyingi xonaning 1 birligini beradi.", en: "One pair changes the value. Ten units in one place make one unit in the next place." },
    correctText: { ru: 'Верно. В каждой паре десять меньших единиц обменены на одну большую.', uz: "To'g'ri. Har bir juftlikda 10 ta kichik birlik 1 ta katta birlikka almashtirildi.", en: "Correct. In each pair, ten smaller units have been regrouped as one larger unit." },
    rule: { ru: 'Перенос означает обмен 10 единиц на 1 единицу следующего разряда.', uz: "Ko'chirish 10 birlikni keyingi xonaning 1 birligiga almashtirishni bildiradi.", en: "Carrying means regrouping 10 units as 1 unit in the next place." },
  },
  {
    id: '04', kind: 'numpad', level: '🟡', answer: '62335', maxLen: 5, figure: '37 586 + 24 749',
    setup: { ru: 'В нескольких разрядах появится перенос.', uz: "Bir nechta xonada ko'chirish paydo bo'ladi.", en: "You will need to carry in several places." },
    prompt: { ru: 'Вычисли сумму.', uz: "Yig'indini hisoblang.", en: "Calculate the sum." },
    hints: [
      { ru: 'Записывай единицы результата, а десяток переноси в следующую колонку.', uz: "Natijaning birliklarini yozing, o'nlikni esa keyingi ustunga ko'chiring.", en: "Write the ones digit of each result and carry the ten into the next column." },
      { ru: 'Проверь цепочку переносов из единиц в десятки и из десятков в сотни.', uz: "Birliklardan o'nliklarga va o'nliklardan yuzliklarga ko'chirish zanjirini tekshiring.", en: "Check the carrying from ones to tens and from tens to hundreds." },
    ],
    correctText: { ru: 'Верно: 37 586 + 24 749 = 62 335.', uz: "To'g'ri: 37 586 + 24 749 = 62 335.", en: "Correct: 37 586 + 24 749 = 62 335." },
    rule: { ru: 'Каждый перенос прибавляется при вычислении следующего разряда.', uz: "Har bir ko'chirilgan qiymat keyingi xonani hisoblashda qo'shiladi.", en: "Add each carried value when calculating the next place." },
  },
  {
    id: '05', kind: 'digit', level: '🟡', answer: '0', figure: '26 438 + 17 596 = 44 □34',
    setup: { ru: 'Из результата исчезла одна цифра.', uz: "Natijadan bitta raqam yo'qoldi.", en: "One digit is missing from the result." },
    prompt: { ru: 'Какую цифру нужно вернуть?', uz: 'Qaysi raqamni qaytarish kerak?', en: "Which digit should be restored?" },
    wrongText: { ru: 'Проверь сотни, затем учти перенос в разряд тысяч. Пропуск должен сохранить все места результата.', uz: "Yuzliklarni tekshiring, keyin minglar xonasiga ko'chirishni hisobga oling. Bo'sh joy natijadagi barcha xonalarni saqlashi kerak.", en: "Check the hundreds, then include the carry into the thousands. The missing digit must preserve every place in the result." },
    correctText: { ru: 'Верно. Получилось 44 034: ноль сохраняет разряд сотен.', uz: "To'g'ri. 44 034 hosil bo'ldi: nol yuzlar xonasini saqlaydi.", en: "Correct. The result is 44 034: the zero preserves the hundreds place." },
    rule: { ru: 'Ноль внутри ответа нельзя пропускать: он сохраняет разряд.', uz: "Javob ichidagi nolni tashlab ketmang: u xonani saqlaydi.", en: "Do not omit a zero inside an answer: it preserves a place value." },
  },
  {
    id: '06', kind: 'mc', level: '🟡', figure: '43 875 + 8 946',
    setup: { ru: 'У Мадины было 43 875 книг, затем привезли ещё 8 946.', uz: "Madinada 43 875 ta kitob bor edi, keyin yana 8 946 ta kitob keltirildi.", en: "Madina had 43 875 books, then another 8 946 arrived." },
    prompt: { ru: 'Сколько книг стало?', uz: "Kitoblar soni nechta bo'ldi?", en: "How many books are there now?" },
    options: [
      { text: { ru: '52 821', uz: '52 821', en: "52 821" }, correct: true },
      { text: { ru: '34 929', uz: '34 929', en: "34 929" }, wrong: { ru: 'Ты нашёл разность. Слово ещё означает, что количество увеличилось.', uz: "Siz ayirmani topdingiz. Yana so'zi miqdor ko'payganini bildiradi.", en: "You found the difference. The word another means that the quantity increased." } },
      { text: { ru: '43 883', uz: '43 883', en: "43 883" }, wrong: { ru: 'К исходному числу прибавлена только последняя цифра. Нужно прибавить всё число 8 946 по разрядам.', uz: "Boshlang'ich songa faqat oxirgi raqam qo'shilgan. 8 946 sonining barcha xonalarini qo'shish kerak.", en: "Only the final digit was added to the original number. Add all of 8 946 by place value." } },
      { text: { ru: '438 758 946', uz: '438 758 946', en: "438 758 946" }, wrong: { ru: 'Числа записаны рядом, а задача требует найти их сумму.', uz: "Sonlar yonma-yon yozilgan, masalada esa ularning yig'indisini topish kerak.", en: "The numbers have been placed side by side, but the problem asks for their sum." } },
    ],
    correctText: { ru: 'Верно. После поступления стало 52 821 книга.', uz: "To'g'ri. Kitoblar kelgach, jami 52 821 ta kitob bo'ldi.", en: "Correct. After the delivery, there were 52 821 books." },
    rule: { ru: 'Если количество увеличилось на несколько единиц, используй сложение.', uz: "Miqdor biror songa ko'paygan bo'lsa, qo'shish amalidan foydalaning.", en: "Use addition when a quantity increases by a given amount." },
  },
  {
    id: '07', kind: 'match', level: '🟡',
    setup: { ru: 'Каждое вычисление можно проверить обратным действием.', uz: "Har bir hisobni teskari amal bilan tekshirish mumkin.", en: "Every calculation can be checked with the inverse operation." },
    prompt: { ru: 'Соедини вычисление с подходящей проверкой.', uz: "Hisobni mos tekshiruv bilan bog'lang.", en: "Match each calculation to the appropriate check." },
    pairs: [
      { id: 'a', left: '31 748 + 6 925 = 38 673', right: '38 673 − 6 925 = 31 748' },
      { id: 'b', left: '72 410 − 18 265 = 54 145', right: '54 145 + 18 265 = 72 410' },
      { id: 'c', left: '49 320 + 24 608 = 73 928', right: '73 928 − 24 608 = 49 320' },
    ],
    wrongText: { ru: 'Одна проверка не возвращает исходное число. Сумму проверяй вычитанием, а разность — сложением.', uz: "Tekshiruvlardan biri boshlang'ich sonni qaytarmaydi. Yig'indini ayirish, ayirmani esa qo'shish bilan tekshiring.", en: "One check does not return the original number. Check a sum with subtraction and a difference with addition." },
    correctText: { ru: 'Верно. Каждая проверка вернула известное исходное число.', uz: "To'g'ri. Har bir tekshiruv ma'lum boshlang'ich sonni qaytardi.", en: "Correct. Each check returned the known original number." },
    rule: { ru: 'Сложение и вычитание являются обратными действиями.', uz: "Qo'shish va ayirish o'zaro teskari amallardir.", en: "Addition and subtraction are inverse operations." },
  },
  {
    id: '08', kind: 'state', level: '🔴', figure: '50 004 − 18 729',
    setup: { ru: 'Для вычитания из 4 числа 9 нужно пройти через цепочку нулей.', uz: "4 dan 9 ni ayirish uchun nollar zanjiri orqali maydalash kerak.", en: "To subtract 9 from 4, you must regroup through a chain of zeros." },
    prompt: { ru: 'Как выглядит верхняя строка после обмена?', uz: "Almashtirishdan keyin yuqori qator qanday ko'rinadi?", en: "What does the top row look like after regrouping?" },
    options: [
      { value: '4 | 9 | 9 | 9 | 14', correct: true },
      { value: '5 | 0 | 0 | 0 | 14', wrong: { ru: 'Единицы получили десяток, но ни один разряд слева не уменьшился. Найди первый ненулевой разряд.', uz: "Birliklar o'nlik oldi, ammo chapdagi hech bir xona kamaymadi. Chapdagi birinchi noldan farqli xonani toping.", en: "The ones received a ten, but no place to the left was reduced. Find the first non-zero place." } },
      { value: '4 | 10 | 10 | 10 | 14', wrong: { ru: 'После передачи единицы вправо каждый промежуточный разряд должен уменьшиться на один.', uz: "Birlik o'ngga uzatilgach, har bir oraliq xona bittaga kamayishi kerak.", en: "After passing one unit to the right, each intermediate place must decrease by one." } },
      { value: '4 | 9 | 9 | 10 | 14', wrong: { ru: 'Разряд десятков отдал один десяток единицам, поэтому в нём не может остаться десять.', uz: "O'nlar xonasi birliklarga bir o'nlik berdi, shuning uchun unda o'nta qolmaydi.", en: "The tens place gave one ten to the ones, so ten cannot remain there." } },
    ],
    correctText: { ru: 'Верно. Получается 4 | 9 | 9 | 9 | 14, а разность равна 31 275.', uz: "To'g'ri. 4 | 9 | 9 | 9 | 14 holati hosil bo'ladi, ayirma esa 31 275 ga teng.", en: "Correct. The row becomes 4 | 9 | 9 | 9 | 14, and the difference is 31 275." },
    rule: { ru: 'Через цепочку нулей занимай у первого ненулевого разряда слева.', uz: "Nollar zanjirida chapdagi birinchi noldan farqli xonadan maydalang.", en: "When regrouping through zeros, borrow from the first non-zero place on the left." },
  },
  {
    id: '09', kind: 'mc', level: '🔴', figure: '47 685 + 28 796 = 75 481',
    setup: { ru: 'В вычислении потерялся один перенос.', uz: "Hisoblashda bitta ko'chirish yo'qolgan.", en: "One carry is missing from the calculation." },
    prompt: { ru: 'Какой разряд вычислен неверно первым?', uz: "Birinchi bo'lib qaysi xona noto'g'ri hisoblangan?", en: "Which place value was calculated incorrectly first?" },
    options: [
      { text: { ru: 'Тысячи', uz: 'Mingliklar', en: "Thousands" }, correct: true },
      { text: { ru: 'Единицы', uz: 'Birliklar', en: "Ones" }, wrong: { ru: 'Пять и шесть дают одиннадцать: единица записана верно, а перенос отправлен дальше.', uz: "Besh va olti o'n bir bo'ladi: bir raqami to'g'ri yozilgan, ko'chirish esa keyingi xonaga o'tgan.", en: "Five plus six is eleven: the one is written correctly and the carry moves on." } },
      { text: { ru: 'Десятки', uz: "O'nliklar", en: "Tens" }, wrong: { ru: 'Восемь, девять и перенос дают восемнадцать. Цифра 8 в ответе верна.', uz: "Sakkiz, to'qqiz va ko'chirilgan bir o'n sakkiz bo'ladi. Javobdagi 8 raqami to'g'ri.", en: "Eight, nine and the carry make eighteen. The digit 8 in the answer is correct." } },
      { text: { ru: 'Сотни', uz: 'Yuzliklar', en: "Hundreds" }, wrong: { ru: 'Шесть, семь и перенос дают четырнадцать. Цифра 4 записана верно, но следующий перенос нужно сохранить.', uz: "Olti, yetti va ko'chirilgan bir o'n to'rt bo'ladi. 4 raqami to'g'ri yozilgan, ammo keyingi ko'chirishni saqlash kerak.", en: "Six, seven and the carry make fourteen. The digit 4 is correct, but the next carry must be kept." } },
    ],
    correctText: { ru: 'Верно. В тысячах забыли перенос из сотен. Правильная сумма — 76 481.', uz: "To'g'ri. Mingliklarda yuzliklardan ko'chirilgan bir unutildi. To'g'ri yig'indi 76 481.", en: "Correct. The carry from the hundreds was omitted in the thousands column. The correct sum is 76 481." },
    rule: { ru: 'Ищи первую ошибку справа налево, начиная с единиц.', uz: "Birinchi xatoni o'ngdan chapga, birlar xonasidan boshlab qidiring.", en: "Look for the first error from right to left, starting with the ones." },
  },
  {
    id: '10', kind: 'mc', level: '🔴', figure: '62 540 − 17 865',
    setup: { ru: 'На складе было 62 540 единиц товара, 17 865 единиц использовали.', uz: "Omborda 62 540 birlik mahsulot bor edi, 17 865 birligi ishlatildi.", en: "A warehouse held 62 540 items, and 17 865 items were used." },
    prompt: { ru: 'Какой план полностью решает и проверяет задачу?', uz: "Qaysi reja masalani to'liq yechadi va tekshiradi?", en: "Which plan both solves and checks the problem completely?" },
    options: [
      { text: { ru: 'Оценить ≈ 45 000; вычислить 44 675; проверить 44 675 + 17 865 = 62 540', uz: "≈45 000 deb baholash; 44 675 ni hisoblash; 44 675 + 17 865 = 62 540 bilan tekshirish", en: "Estimate ≈ 45 000; calculate 44 675; check 44 675 + 17 865 = 62 540" }, correct: true },
      { text: { ru: 'Сложить и получить 80 405, потому что количество использовали', uz: "Miqdor ishlatilgani uchun qo'shib, 80 405 ni olish", en: "Add to get 80 405 because some of the quantity was used" }, wrong: { ru: 'Использованная часть уменьшает остаток. Сначала выбери действие по смыслу задачи.', uz: "Ishlatilgan qism qoldiqni kamaytiradi. Avval masala mazmuniga mos amalni tanlang.", en: "The amount used reduces what remains. First choose the operation that matches the problem." } },
      { text: { ru: 'Оценить ≈ 45 000 и записать это как точный ответ', uz: "≈45 000 deb baholab, uni aniq javob sifatida yozish", en: "Estimate ≈ 45 000 and write it as the exact answer" }, wrong: { ru: 'Оценка показывает только величину результата. Для точного ответа нужно выполнить вычитание.', uz: "Taxmin faqat natijaning kattaligini ko'rsatadi. Aniq javob uchun ayirishni bajarish kerak.", en: "An estimate shows only the approximate size of the result. Subtract to find the exact answer." } },
      { text: { ru: 'Получить 44 675 и проверить ещё одним вычитанием', uz: "44 675 ni topib, yana bir ayirish bilan tekshirish", en: "Get 44 675 and check it with another subtraction" }, wrong: { ru: 'Результат найден верно, но проверка должна вернуть исходное количество обратным действием.', uz: "Natija to'g'ri topilgan, ammo tekshiruv teskari amal bilan boshlang'ich miqdorni qaytarishi kerak.", en: "The result is correct, but the check must use the inverse operation to return the original quantity." } },
    ],
    correctText: { ru: 'Верно. Осталось 44 675 единиц, и обратное действие возвращает 62 540.', uz: "To'g'ri. 44 675 birlik qoldi va teskari amal 62 540 ni qaytardi.", en: "Correct. There are 44 675 items left, and the inverse operation returns 62 540." },
    rule: { ru: 'Оценка проверяет величину ответа, а обратное действие — его точность.', uz: "Taxmin javob kattaligini, teskari amal esa uning aniqligini tekshiradi.", en: "An estimate checks the size of an answer; the inverse operation checks its accuracy." },
  },
]);

const NumPad = ({ value, setValue, max, disabled, lang }) => (
  <div className="p4-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}>
    <div className="p4-pad-display" aria-live="polite">{value ? grouped(value) : '—'}</div>
    <div className="p4-pad-keys">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
        <button key={n} type="button" className="p4-key" disabled={disabled} onClick={() => setValue((old) => old.length >= max ? old : old + n)}>{n}</button>
      ))}
      <button type="button" className="p4-key p4-key-del" disabled={disabled} aria-label={tx(UI.clear, lang)} onClick={() => setValue((old) => old.slice(0, -1))}>⌫</button>
    </div>
  </div>
);

const Feedback = ({ ok, text, rule, lang, feedbackRef }) => (
  <div ref={feedbackRef} className={`p4-fb ${ok ? 'is-ok' : 'is-no'}`} role="status" aria-live="polite">
    <p className="p4-fb-txt">{text}</p>
    {ok && rule && <p className="p4-rule"><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>}
  </div>
);

// `platform` berilganda tugma qatori chizilmaydi: uni LMS o'zi beradi va
// tekshiruvni `registerCheck` orqali chaqiradi (LMS kontrakti).
function Task({ task, lang, last, onSolved ,
  platform = false, mode, onReady, registerCheck, onSubmit, playCorrect, playWrong,
}) {
  // Xato javobdan keyin variantlar qayta aralashadi (metodist qarori 2026-08-21).
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- wrongRound ataylab yangi tartib beradi
  const choices = useMemo(() => task.kind === 'mc' ? shuffle(task.options) : (task.options || []), [task, wrongRound]);
  const rightPairs = useMemo(() => task.kind === 'match' ? matchSpread(task.pairs, (card, row) => card.id === task.pairs[row]?.id) : [], [task]);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [advancing, setAdvancing] = useState(false);
  const advancedRef = useRef(false);
  const feedbackRef = useRef(null);

  // Tanlov INDEKS emas, variant OBYEKTI: aralashtirilganda havola saqlanadi.
  const pickedChoice = picked;
  // Javobning to'g'riligi `checked` dan ALOHIDA hisoblanadi: tekshirishda
  // xato bo'lsa variantlar qayta aralashtiriladi.
  const answerCorrect = (
    ((task.kind === 'mc' || task.kind === 'state') && pickedChoice?.correct === true)
    || (task.kind === 'digit' && String(picked) === task.answer)
    || (task.kind === 'numpad' && typed === task.answer)
    || (task.kind === 'match' && task.pairs.every((pair, i) => pairs[i] === pair.id))
  );
  const solved = checked && answerCorrect;
  const canCheck = ((task.kind === 'mc' || task.kind === 'state' || task.kind === 'digit') && picked !== null)
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
    if (task.kind === 'mc' || task.kind === 'state') return pickedChoice?.wrong;
    if (task.kind === 'numpad') return task.hints[Math.min(Math.max(attempts - 1, 0), task.hints.length - 1)];
    return task.wrongText;
  })();

  const retry = () => {
    setChecked(false);
    setPicked(null);
    setTyped('');
    if (task.kind === 'match') { setPairs({}); setActiveLeft(null); }
  };

  // Tekshirish bir joyda: lokal tugma ham, platforma ham shuni chaqiradi.
  const check = () => { if (mode === 'review') return; setChecked(true); setAttempts((n) => n + 1); if (!answerCorrect) setWrongRound((old) => old + 1); };
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
    <div className="p4-task">
      <p className="p4-eyebrow">{task.level} {tx(UI.task, lang)} {task.id}</p>
      <p className="p4-setup">{tx(task.setup, lang)}</p>
      {task.figure && <div className="p4-figure"><span className="p4-bignum">{tx(task.figure, lang)}</span></div>}
      <h2 className="p4-ask">{tx(task.prompt, lang)}</h2>

      {task.kind === 'mc' && <div className="p4-options">{choices.map((option, i) => (
        <button
          key={`${task.id}-${i}`}
          type="button"
          className={`p4-option ${picked === option ? (checked ? (option.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`}
          disabled={solved}
          aria-pressed={picked === option}
          onClick={() => { setPicked(option); setChecked(false); }}
        >
          <span className="p4-letter">{'ABCD'[i]}</span>
          <span className="p4-option-copy">{option.visual && <span className="p4-column" aria-hidden="true">{option.visual}</span>}<span>{tx(option.text, lang)}</span></span>
        </button>
      ))}</div>}

      {task.kind === 'numpad' && <NumPad value={typed} setValue={(fn) => { setTyped(fn); setChecked(false); }} max={task.maxLen} disabled={solved} lang={lang} />}

      {task.kind === 'digit' && <div className="p4-digits" role="group" aria-label={tx(UI.digitHint, lang)}>{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
        <button key={digit} type="button" className={`p4-digit-choice ${picked === digit ? (checked ? (String(digit) === task.answer ? 'is-ok' : 'is-no') : 'is-on') : ''}`} disabled={solved} aria-pressed={picked === digit} onClick={() => { setPicked(digit); setChecked(false); }}>{digit}</button>
      ))}</div>}

      {task.kind === 'state' && <div className="p4-state" role="group" aria-label={tx(UI.stateHint, lang)}>{choices.map((option) => (
        <button key={option.value} type="button" className={`p4-state-option ${picked === option ? (checked ? (option.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`} disabled={solved} aria-pressed={picked === option} onClick={() => { setPicked(option); setChecked(false); }}>{option.value}</button>
      ))}</div>}

      {task.kind === 'match' && <div className="p4-match">
        <p className="p4-note">{tx(UI.matchHint, lang)}</p>
        <div className="p4-match-cols">
          <div className="p4-match-col">{task.pairs.map((pair, i) => (
            <button key={pair.id} type="button" className={`p4-match-item ${activeLeft === i ? 'is-active' : ''} ${pairs[i] ? 'is-tied' : ''} ${firstMatchWrong === i ? 'is-no' : ''}${matchToneLeft(task, pairs, i)}`} disabled={solved} aria-pressed={activeLeft === i} onClick={() => { setActiveLeft(i); setChecked(false); }}>
              {tx(pair.left, lang)}{pairs[i] && <b className="p4-tie">{tx(rightPairs.find((right) => right.id === pairs[i])?.right, lang)}</b>}
            </button>
          ))}</div>
          <div className="p4-match-col">{rightPairs.map((pair) => {
            const used = Object.values(pairs).includes(pair.id);
            return <button key={pair.id} type="button" className={`p4-match-item p4-match-right${matchToneRight(task, pairs, pair.id)}`} disabled={solved || activeLeft === null} aria-pressed={used} onClick={() => {
              if (activeLeft === null) return;
              setPairs((old) => matchTie(old, activeLeft, pair.id)); setActiveLeft(null); setChecked(false);
            }}>{tx(pair.right, lang)}</button>;
          })}</div>
        </div>
      </div>}

      {checked && <Feedback feedbackRef={feedbackRef} ok={solved} text={tx(solved ? task.correctText : wrongText, lang)} rule={task.rule} lang={lang} />}

      {!platform && <div className="p4-actions">
        {!solved && <button type="button" className="p4-btn" disabled={!canCheck} onClick={check}>{tx(UI.check, lang)}</button>}
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
        >{tx(last ? UI.finish : UI.next, lang)}</button>}
      </div>}
    </div>
  );
}

export default function Grade4Dars08Practice({ lang: langProp, onFinished }) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState(normalizeLang(langProp));
  const lang = preview ? normalizeLang(previewLang) : normalizeLang(langProp);
  const [index, setIndex] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [finished, setFinished] = useState(false);
  const finishCalledRef = useRef(false);
  const task = TASKS[index];
  const percent = Math.round(((finished ? TASKS.length : index) / TASKS.length) * 100);

  const onSolved = (wasFirstTry) => {
    const nextFirstTry = firstTry + (wasFirstTry ? 1 : 0);
    setFirstTry(nextFirstTry);
    if (index + 1 === TASKS.length) {
      if (finishCalledRef.current) return;
      finishCalledRef.current = true;
      setFinished(true);
      onFinished?.({ lessonId: LESSON_META.lessonId, lessonTitle: tx(LESSON_META.lessonTitle, lang), totalQuestions: 10, correctAnswers: nextFirstTry, scorePercent: Math.round((nextFirstTry / 10) * 100) });
    } else setIndex((old) => old + 1);
  };

  const restart = () => {
    finishCalledRef.current = false;
    setIndex(0); setFirstTry(0); setFinished(false);
  };

  return (
    <div className="p4-root">
      <style>{STYLES}</style>
      {preview && <div className="p4-lang" role="group" aria-label={tx(UI.language, lang)}>{SUPPORTED_LANGS.map((code) => <button key={code} type="button" className={code === lang ? 'is-active' : ''} aria-pressed={code === lang} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}
      <header className="p4-head">
        <div className="p4-progress" role="progressbar" aria-label={tx(LESSON_META.lessonTitle, lang)} aria-valuemin="0" aria-valuemax="10" aria-valuenow={finished ? 10 : index}><div className="p4-progress-bar" style={{ width: `${percent}%` }} /></div>
        <div className="p4-head-row"><h1 className="p4-title">{tx(LESSON_META.lessonTitle, lang)}</h1><span className="p4-counter">{finished ? 10 : index + 1} / 10</span></div>
      </header>
      <main className="p4-main">
        {finished ? <div className="p4-done" role="status" aria-live="polite">
          <h2>{tx(UI.done, lang)}</h2><p className="p4-score"><b>{firstTry}</b> <span>{tx(UI.ofTen, lang)}</span></p>
          <p className="p4-note">{tx(UI.firstTryNote, lang)}</p>
          <button type="button" className="p4-btn p4-btn-ready" onClick={restart}>{tx(UI.again, lang)}</button>
        </div> : <Task key={task.id} task={task} lang={lang} last={index === TASKS.length - 1} onSolved={onSolved} />}
      </main>
    </div>
  );
}

const STYLES = `
.p4-root{position:relative;min-height:100%;padding:0 0 24px;font-family:'Manrope',system-ui,sans-serif;color:${T.ink};background:${T.bg}}
.p4-root *,.p4-root *::before,.p4-root *::after{box-sizing:border-box}.p4-root button:focus-visible{outline:3px solid rgba(22,143,163,.45);outline-offset:3px}
.p4-lang{position:absolute;top:8px;right:8px;display:flex;gap:6px;z-index:5}.p4-lang button{min-width:44px;min-height:44px;border:0;border-radius:99px;background:${T.paper};color:${T.ink2};font-weight:800;cursor:pointer;box-shadow:0 4px 12px -8px rgba(23,59,82,.4)}.p4-lang button.is-active{background:${T.accent};color:#fff}
.p4-head{padding:46px clamp(12px,4vw,24px) 8px}.p4-progress{height:6px;border-radius:99px;background:rgba(23,59,82,.12);overflow:hidden}.p4-progress-bar{height:100%;background:linear-gradient(90deg,${T.cyan},${T.accent});transition:width .4s ease}.p4-head-row{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-top:8px}.p4-title{margin:0;font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(15px,2.4vw,19px)}.p4-counter{white-space:nowrap;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:13px;color:${T.ink3}}
.p4-main{max-width:720px;margin:0 auto;padding:4px clamp(12px,4vw,24px)}.p4-task{display:flex;flex-direction:column;gap:12px}.p4-eyebrow{margin:6px 0 0;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${T.accent}}.p4-setup{margin:0;font-size:clamp(14px,2vw,16px);line-height:1.5;color:${T.ink2}}.p4-ask{margin:2px 0 0;font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(17px,2.6vw,21px);line-height:1.25}.p4-note{margin:8px 0 0;font-size:13px;color:${T.ink3}}
.p4-figure{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 10px;border-radius:16px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}.p4-bignum{font:800 clamp(22px,5.4vw,36px) 'JetBrains Mono',monospace;color:${T.navy};text-align:center}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.p4-option{display:flex;align-items:center;gap:9px;min-height:56px;padding:10px 12px;text-align:left;font-family:inherit;font-weight:700;font-size:clamp(13px,1.9vw,15px);color:${T.ink};background:${T.paper};border:1px solid rgba(23,59,82,.12);border-radius:14px;cursor:pointer;transition:transform .2s ease,border-color .2s ease}.p4-option:hover:not(:disabled){border-color:rgba(22,143,163,.4);transform:translateY(-2px)}.p4-letter{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:8px;background:${T.cyanSoft};color:${T.cyan};font:800 11px 'JetBrains Mono',monospace}.p4-option-copy{display:flex;flex-direction:column;gap:5px;min-width:0}.p4-column{white-space:pre;font:800 15px/1.15 'JetBrains Mono',monospace;color:${T.navy}}.p4-option.is-on{border-color:${T.accent};background:${T.accentSoft}}.p4-option.is-ok,.p4-state-option.is-ok,.p4-digit-choice.is-ok{border-color:rgba(34,122,83,.4);background:${T.successSoft};color:${T.success}}.p4-option.is-no,.p4-state-option.is-no,.p4-digit-choice.is-no{border-color:rgba(169,111,19,.4);background:${T.warnSoft};color:${T.warn}}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:8px;width:min(240px,100%);margin:0 auto;padding:12px;border-radius:18px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8)}.p4-pad-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:50px;border:2px solid ${T.accent};border-radius:13px;background:${T.paper};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;color:${T.navy}}.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:100%}.p4-key{min-height:44px;border:1px solid rgba(23,59,82,.16);border-radius:12px;background:${T.paper};font:800 clamp(18px,3.6vw,22px) 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer}.p4-key-del{background:${T.accentSoft};color:${T.accent}}
.p4-digits{display:grid;grid-template-columns:repeat(5,minmax(44px,1fr));gap:8px;width:min(360px,100%);margin:0 auto}.p4-digit-choice{min-height:48px;border:1px solid rgba(23,59,82,.14);border-radius:12px;background:${T.paper};font:800 20px 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer}.p4-digit-choice.is-on,.p4-state-option.is-on{border-color:${T.accent};background:${T.accentSoft}}
.p4-state{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.p4-state-option{min-height:56px;padding:10px;border:1px solid rgba(23,59,82,.12);border-radius:14px;background:${T.paper};font:800 clamp(13px,3vw,17px) 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer}
.p4-match-cols{display:flex;gap:10px;margin-top:8px}.p4-match-col{display:flex;flex-direction:column;gap:8px;flex:1;min-width:0}.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-height:56px;padding:8px 10px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};font:800 clamp(11px,2vw,15px) 'Manrope',sans-serif;color:${T.navy};cursor:pointer;overflow-wrap:anywhere}.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}.p4-match-item.is-tied{border-color:rgba(34,122,83,.35)}.p4-match-item.is-no{border-color:${T.warn};background:${T.warnSoft}}.p4-tie{font-size:10px;color:${T.success};text-align:center}
.p4-fb{padding:12px 14px;border-radius:14px}.p4-fb.is-ok{background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}.p4-fb.is-no{background:${T.warnSoft};box-shadow:inset 4px 0 0 ${T.warn}}.p4-fb-txt{margin:0;font-family:'Source Serif 4',Georgia,serif;font-size:clamp(14px,2.1vw,16px);line-height:1.45}.p4-rule{margin:8px 0 0;font-size:13px;color:${T.ink2}}
.p4-actions{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:10px;margin-top:4px}.p4-btn{min-height:46px;padding:10px 22px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font-family:inherit;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5),inset 0 0 0 1px rgba(255,91,53,.2)}.p4-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.p4-btn-ready{background:${T.accent};color:#fff}.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}.p4-done{display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 12px;text-align:center}.p4-done h2{margin:0;font:600 clamp(24px,5vw,34px) 'Source Serif 4',Georgia,serif}.p4-score{margin:0;font-family:'JetBrains Mono',monospace}.p4-score b{font-size:clamp(32px,7vw,44px);color:${T.success}}.p4-score span{font-size:14px;color:${T.ink3}}
@media(max-width:520px){.p4-options,.p4-state{grid-template-columns:1fr}.p4-match-cols{gap:8px}.p4-match-item{font-size:11px;padding:7px}.p4-head{padding-top:54px}}
@media(prefers-reduced-motion:reduce){.p4-root *,.p4-root *::before,.p4-root *::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}}

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
.p4-match .p4-tone2,.g4p-match .p4-tone2{background:#FBEBCB!important;border-color:#A2690F!important;box-shadow:inset 0 0 0 2px #A2690F!important;color:#6E4708!important}
.p4-match .p4-tone2::before,.g4p-match .p4-tone2::before{content:"▲";color:#A2690F}
.p4-match .p4-tone3,.g4p-match .p4-tone3{background:#E9E4F7!important;border-color:#5E45AD!important;box-shadow:inset 0 0 0 2px #5E45AD!important;color:#3E2E75!important}
.p4-match .p4-tone3::before,.g4p-match .p4-tone3::before{content:"■";color:#5E45AD}
.p4-match .p4-tone4,.g4p-match .p4-tone4{background:#FBE2EA!important;border-color:#AE3760!important;box-shadow:inset 0 0 0 2px #AE3760!important;color:#77223F!important}
.p4-match .p4-tone4::before,.g4p-match .p4-tone4::before{content:"◆";color:#AE3760}
.p4-match .p4-tone5,.g4p-match .p4-tone5{background:#E2E8F0!important;border-color:#3C5A80!important;box-shadow:inset 0 0 0 2px #3C5A80!important;color:#27405C!important}
.p4-match .p4-tone5::before,.g4p-match .p4-tone5::before{content:"★";color:#3C5A80}
.p4-match .p4-tone6,.g4p-match .p4-tone6{background:#DFF0E4!important;border-color:#1F7A4C!important;box-shadow:inset 0 0 0 2px #1F7A4C!important;color:#145536!important}
.p4-match .p4-tone6::before,.g4p-match .p4-tone6::before{content:"✚";color:#1F7A4C}
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
