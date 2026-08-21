// ============================================================================
// 4-SINF · Dars 9 amaliyoti — Ko'p xonali sonni bir xonali songa ko'paytirish
// Dars01Practice vizual/texnik etaloni asosida: 10 topshiriq, RU/UZ, ovozsiz.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

const T = {
  bg: '#F5F5F0', paper: '#FFFFFF', ink: '#12212C', ink2: '#50616D', ink3: '#87949D',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', success: '#227A53', successSoft: '#E7F3EC', warn: '#A96F13', warnSoft: '#FFF5D9',
};

const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';

const ENGLISH = {
  'Урок 9. Практика: умножение на однозначное число': 'Lesson 9. Practice: multiplying by a one-digit number',
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
  'Нажми на место для множителя': 'Select the position for the multiplier',
  'Практика пройдена': 'Practice complete',
  'из 10': 'out of 10',
  'Язык': 'Language',
  'Столько заданий решено с первой попытки.': 'This many tasks were completed correctly on the first attempt.',
  'В четырёх одинаковых группах по 1 920 деталей.': 'There are 1 920 parts in each of four equal groups.',
  'Какая запись верно показывает действие, точный ответ и оценку?': 'Which expression shows the operation, exact answer and estimate correctly?',
  '1 920 × 4 = 7 680; примерно 8 000': '1 920 × 4 = 7 680; approximately 8 000',
  '1 920 + 4 = 1 924': '1 920 + 4 = 1 924',
  'Здесь прибавлено число групп, а нужно взять одинаковое количество четыре раза.': 'This adds the number of groups, but the same quantity must be taken four times.',
  '1 920 × 4 = 7 680; примерно 2 000': '1 920 × 4 = 7 680; approximately 2 000',
  'Точный ответ верен, но оценка должна учитывать четыре одинаковые группы.': 'The exact answer is correct, but the estimate must account for four equal groups.',
  '1 920 × 4 = 768; примерно 800': '1 920 × 4 = 768; approximately 800',
  'В произведении потерян один разряд. Сравни ответ с четырьмя числами около двух тысяч.': 'A place value is missing from the product. Compare the answer with four quantities of about two thousand.',
  'Верно. Четыре группы содержат 7 680 деталей, что близко к 8 000.': 'Correct. Four groups contain 7 680 parts, which is close to 8 000.',
  'Одинаковые группы удобно записывать умножением.': 'Multiplication is a convenient way to represent equal groups.',
  'Нужно записать вычисление столбиком.': 'The calculation must be written in columns.',
  'Под какой цифрой нужно поставить множитель 6?': 'Beneath which digit should the multiplier 6 be placed?',
  'тысячи': 'thousands',
  'Так 6 оказалось под тысячами. Найди крайнюю правую цифру многозначного числа.': 'This places 6 beneath the thousands. Find the rightmost digit of the multi-digit number.',
  'сотни': 'hundreds',
  'Так 6 оказалось под сотнями. Найди последнюю цифру числа.': 'This places 6 beneath the hundreds. Find the final digit of the number.',
  'десятки': 'tens',
  'Так 6 оказалось под десятками. Сдвинь его ещё на один разряд вправо.': 'This places 6 beneath the tens. Move it one more place to the right.',
  'единицы': 'ones',
  'Верно. Множитель 6 стоит под цифрой 2 в разряде единиц.': 'Correct. The multiplier 6 is beneath the digit 2 in the ones place.',
  'Однозначный множитель записывается под единицами.': 'Write a one-digit multiplier beneath the ones digit.',
  'Разложим число по разрядам.': 'Let us partition the number by place value.',
  'Соедини каждую часть с её произведением.': 'Match each part to its product.',
  'Одна пара меняет разрядную величину. Умножь каждое слагаемое на четыре, сохраняя его разряд.': 'One pair changes the place value. Multiply each addend by four while preserving its place.',
  'Верно. Сумма частичных произведений равна 12 820.': 'Correct. The sum of the partial products is 12 820.',
  'При умножении число можно разложить на разрядные слагаемые.': 'A number can be partitioned into place-value addends before multiplication.',
  'При вычислении будет несколько переносов.': 'You will need to carry several times.',
  'Найди произведение.': 'Find the product.',
  'Начни с единиц. Записывай единицы результата, а десятки переноси в следующий разряд.': 'Start with the ones. Write the ones digit of the result and carry the tens into the next place.',
  'Проверь перенос после умножения единиц и после умножения десятков.': 'Check the carry after multiplying the ones and after multiplying the tens.',
  'Верно: 2 764 × 5 = 13 820.': 'Correct: 2 764 × 5 = 13 820.',
  'Каждый перенос прибавляется к произведению следующего разряда.': 'Add each carried value to the product in the next place.',
  'Из произведения исчезла одна цифра.': 'One digit is missing from the product.',
  'Какую цифру нужно вернуть?': 'Which digit should be restored?',
  'На шаге умножения нуля не теряй перенос из предыдущего разряда.': 'When multiplying the zero, do not lose the carry from the previous place.',
  'Верно. Получилось 28 252: на месте нуля учтён перенос.': 'Correct. The result is 28 252: the carry was included in the zero place.',
  'Ноль сохраняет место разряда и не отменяет перенос.': 'A zero preserves its place and does not cancel a carry.',
  'В каждой из семи коробок находится 1 864 детали.': 'Each of seven boxes contains 1 864 parts.',
  'Сколько деталей во всех коробках?': 'How many parts are there in all the boxes?',
  'Здесь к количеству деталей прибавлено число коробок. Одинаковую группу нужно взять семь раз.': 'This adds the number of boxes to the number of parts. The equal group must be taken seven times.',
  'Проверь перенос при умножении десятков и сотен.': 'Check the carries when multiplying the tens and hundreds.',
  'В произведение добавлен лишний разряд. Сравни ответ с оценкой: две тысячи, взятые семь раз.': 'An extra place was added to the product. Compare the answer with an estimate of two thousand taken seven times.',
  'Верно. В семи коробках 13 048 деталей.': 'Correct. There are 13 048 parts in seven boxes.',
  'Количество одинаковых групп является множителем.': 'The number of equal groups is a multiplier.',
  'До точного вычисления полезно оценить величину ответа.': 'It is useful to estimate the size of the answer before calculating exactly.',
  'Соедини точное произведение с его оценкой.': 'Match each exact product to its estimate.',
  'примерно 3 600': 'approximately 3 600',
  'примерно 8 400': 'approximately 8 400',
  'примерно 6 200': 'approximately 6 200',
  'Одна оценка слишком далека от точного результата. Округли многозначное число, но не меняй множитель.': 'One estimate is too far from the exact result. Round the multi-digit number, but do not change the multiplier.',
  'Верно. Все точные ответы близки к своим оценкам.': 'Correct. All the exact answers are close to their estimates.',
  'Оценка помогает заметить потерянный или лишний разряд.': 'Estimation helps you spot a missing or extra place value.',
  'В числе есть внутренний ноль, а множитель — наибольшая однозначная цифра.': 'The number contains an internal zero, and the multiplier is the greatest one-digit number.',
  'Вычисли произведение.': 'Calculate the product.',
  'Не пропускай разряд с нулём: к нулю нужно прибавить перенос.': 'Do not skip the place containing zero: add the carry to the zero.',
  'Проверь все переносы справа налево и сравни результат с 4 700 × 9.': 'Check every carry from right to left and compare the result with 4 700 × 9.',
  'Верно: 4 709 × 9 = 42 381.': 'Correct: 4 709 × 9 = 42 381.',
  'Внутренний ноль участвует в алгоритме как отдельный разряд.': 'An internal zero participates in the algorithm as a separate place value.',
  'В записи ответа потеряно место одного разряда.': 'One place value is missing from the written answer.',
  'В чём первая ошибка?': 'What is the first error?',
  'Пропущен разряд сотен с нулём; верный ответ 12 072': 'The zero in the hundreds place is missing; the correct answer is 12 072',
  'Нужно умножать слева направо': 'You must multiply from left to right',
  'Направление алгоритма не объясняет потерю разряда. Проверь, где должен остаться внутренний ноль.': 'The direction of the algorithm does not explain the missing place. Check where the internal zero belongs.',
  'Ноль всегда можно убрать из ответа': 'A zero can always be removed from an answer',
  'Удаление внутреннего нуля сдвигает остальные цифры и меняет значение числа.': 'Removing an internal zero shifts the other digits and changes the value of the number.',
  'Ошибка только в последней цифре': 'Only the final digit is wrong',
  'Последняя цифра 2 получена верно. Сравни количество разрядов точного ответа с оценкой.': 'The final digit 2 is correct. Compare the number of places in the exact answer with the estimate.',
  'Верно. Ноль удерживает сотни, поэтому произведение равно 12 072.': 'Correct. The zero holds the hundreds place, so the product is 12 072.',
  'Нельзя удалять внутренний ноль: он сохраняет разряд числа.': 'Do not remove an internal zero: it preserves the place value of the number.',
  'Число 4 999 всего на один меньше 5 000.': 'The number 4 999 is just one less than 5 000.',
  'Какой способ самый короткий и правильный?': 'Which method is the shortest and correct?',
  'Число 4 999 меньше 5 000, а не больше. Компенсация выбрана в неверную сторону.': 'The number 4 999 is less than 5 000, not greater. The compensation goes in the wrong direction.',
  'Единицу тоже берут семь раз, поэтому компенсация должна учитывать множитель.': 'The one is also taken seven times, so the compensation must include the multiplier.',
  'Это произведение для числа 5 000. Нужно учесть разницу между 5 000 и 4 999.': 'This is the product for 5 000. You must account for the difference between 5 000 and 4 999.',
  'Верно. Из 35 000 вычитаются семь единиц, и получается 34 993.': 'Correct. Subtracting seven ones from 35 000 gives 34 993.',
  'Для числа рядом с круглым удобно умножить круглое число и выполнить компенсацию.': 'For a number close to a round number, multiply the round number and then compensate.',
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
  lessonId: 'num-4-09-practice',
  lessonTitle: { uz: "9-dars. Amaliyot: bir xonali songa ko'paytirish", ru: 'Урок 9. Практика: умножение на однозначное число', en: 'Lesson 9. Practice: multiplying by a one-digit number' },
};

const UI = addEnglish({
  task: { ru: 'Задание', uz: 'Topshiriq', en: "Task" }, check: { ru: 'Проверить', uz: 'Tekshirish', en: "Check" },
  next: { ru: 'Следующее', uz: 'Keyingisi', en: "Next" }, finish: { ru: 'Завершить', uz: 'Yakunlash', en: "Finish" },
  again: { ru: 'Пройти заново', uz: 'Qaytadan', en: "Try again" }, rule: { ru: 'Запомни', uz: 'Eslab qoling', en: "Remember" },
  retry: { ru: 'Попробовать ещё', uz: "Yana urinib ko'ring", en: "Try once more" }, typeAnswer: { ru: 'Набери ответ', uz: 'Javobni kiriting', en: "Enter your answer" },
  clear: { ru: 'Стереть', uz: "O'chirish", en: "Clear" },
  matchHint: { ru: 'Сначала выбери карточку слева, затем её пару справа', uz: "Avval chapdagi kartani, keyin uning o'ngdagi juftini tanlang", en: "First choose a card on the left, then choose its match on the right" },
  digitHint: { ru: 'Выбери одну цифру', uz: 'Bitta raqamni tanlang', en: "Choose one digit" },
  placeHint: { ru: 'Нажми на место для множителя', uz: "Ko'paytiruvchi turadigan joyni bosing", en: "Select the position for the multiplier" },
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
    id: '01', kind: 'mc', level: '🟢', figure: '1 920 · 1 920 · 1 920 · 1 920',
    setup: { ru: 'В четырёх одинаковых группах по 1 920 деталей.', uz: "To'rtta bir xil guruhning har birida 1 920 tadan detal bor.", en: "There are 1 920 parts in each of four equal groups." },
    prompt: { ru: 'Какая запись верно показывает действие, точный ответ и оценку?', uz: "Qaysi yozuv amalni, aniq javobni va taxminni to'g'ri ko'rsatadi?", en: "Which expression shows the operation, exact answer and estimate correctly?" },
    options: [
      { text: { ru: '1 920 × 4 = 7 680; примерно 8 000', uz: '1 920 × 4 = 7 680; taxminan 8 000', en: "1 920 × 4 = 7 680; approximately 8 000" }, correct: true },
      { text: { ru: '1 920 + 4 = 1 924', uz: "1 920 + 4 = 1 924", en: "1 920 + 4 = 1 924" }, wrong: { ru: 'Здесь прибавлено число групп, а нужно взять одинаковое количество четыре раза.', uz: "Bu yerda guruhlar soni qo'shilgan. Bir xil miqdorni to'rt marta olish kerak.", en: "This adds the number of groups, but the same quantity must be taken four times." } },
      { text: { ru: '1 920 × 4 = 7 680; примерно 2 000', uz: '1 920 × 4 = 7 680; taxminan 2 000', en: "1 920 × 4 = 7 680; approximately 2 000" }, wrong: { ru: 'Точный ответ верен, но оценка должна учитывать четыре одинаковые группы.', uz: "Aniq javob to'g'ri, ammo taxmin to'rtta bir xil guruhni hisobga olishi kerak.", en: "The exact answer is correct, but the estimate must account for four equal groups." } },
      { text: { ru: '1 920 × 4 = 768; примерно 800', uz: '1 920 × 4 = 768; taxminan 800', en: "1 920 × 4 = 768; approximately 800" }, wrong: { ru: 'В произведении потерян один разряд. Сравни ответ с четырьмя числами около двух тысяч.', uz: "Ko'paytmada bitta xona yo'qolgan. Javobni ikki mingga yaqin to'rtta son bilan taqqoslang.", en: "A place value is missing from the product. Compare the answer with four quantities of about two thousand." } },
    ],
    correctText: { ru: 'Верно. Четыре группы содержат 7 680 деталей, что близко к 8 000.', uz: "To'g'ri. To'rtta guruhda 7 680 ta detal bor, bu 8 000 ga yaqin.", en: "Correct. Four groups contain 7 680 parts, which is close to 8 000." },
    rule: { ru: 'Одинаковые группы удобно записывать умножением.', uz: "Bir xil guruhlarni ko'paytirish bilan yozish qulay.", en: "Multiplication is a convenient way to represent equal groups." },
  },
  {
    id: '02', kind: 'place', level: '🟢', figure: '4 312 × 6', digits: ['4', '3', '1', '2'],
    setup: { ru: 'Нужно записать вычисление столбиком.', uz: "Hisobni ustun shaklida yozish kerak.", en: "The calculation must be written in columns." },
    prompt: { ru: 'Под какой цифрой нужно поставить множитель 6?', uz: "6 ko'paytiruvchini qaysi raqam ostiga qo'yish kerak?", en: "Beneath which digit should the multiplier 6 be placed?" },
    options: [
      { id: 'thousands', label: { ru: 'тысячи', uz: 'mingliklar', en: "thousands" }, wrong: { ru: 'Так 6 оказалось под тысячами. Найди крайнюю правую цифру многозначного числа.', uz: "Bunday joylashuvda 6 mingliklar ostida qoldi. Ko'p xonali sonning eng o'ngdagi raqamini toping.", en: "This places 6 beneath the thousands. Find the rightmost digit of the multi-digit number." } },
      { id: 'hundreds', label: { ru: 'сотни', uz: 'yuzliklar', en: "hundreds" }, wrong: { ru: 'Так 6 оказалось под сотнями. Найди последнюю цифру числа.', uz: "Bunday joylashuvda 6 yuzliklar ostida qoldi. Sonning oxirgi raqamini toping.", en: "This places 6 beneath the hundreds. Find the final digit of the number." } },
      { id: 'tens', label: { ru: 'десятки', uz: "o'nliklar", en: "tens" }, wrong: { ru: 'Так 6 оказалось под десятками. Сдвинь его ещё на один разряд вправо.', uz: "Bunday joylashuvda 6 o'nliklar ostida qoldi. Uni yana bir xona o'ngga siljiting.", en: "This places 6 beneath the tens. Move it one more place to the right." } },
      { id: 'ones', label: { ru: 'единицы', uz: 'birliklar', en: "ones" }, correct: true },
    ],
    correctText: { ru: 'Верно. Множитель 6 стоит под цифрой 2 в разряде единиц.', uz: "To'g'ri. 6 ko'paytiruvchi birlar xonasidagi 2 raqami ostida turibdi.", en: "Correct. The multiplier 6 is beneath the digit 2 in the ones place." },
    rule: { ru: 'Однозначный множитель записывается под единицами.', uz: "Bir xonali ko'paytiruvchi birliklar ostiga yoziladi.", en: "Write a one-digit multiplier beneath the ones digit." },
  },
  {
    id: '03', kind: 'match', level: '🟡', figure: '3 205 × 4',
    setup: { ru: 'Разложим число по разрядам.', uz: "Sonni xona qo'shiluvchilariga ajratamiz.", en: "Let us partition the number by place value." },
    prompt: { ru: 'Соедини каждую часть с её произведением.', uz: "Har bir qismni uning ko'paytmasi bilan moslashtiring.", en: "Match each part to its product." },
    pairs: [
      { id: 'a', left: '3 000 × 4', right: '12 000' },
      { id: 'b', left: '200 × 4', right: '800' },
      { id: 'c', left: '0 × 4', right: '0' },
      { id: 'd', left: '5 × 4', right: '20' },
    ],
    wrongText: { ru: 'Одна пара меняет разрядную величину. Умножь каждое слагаемое на четыре, сохраняя его разряд.', uz: "Juftliklardan biri xona qiymatini o'zgartirdi. Har bir qo'shiluvchini xona qiymatini saqlagan holda to'rtga ko'paytiring.", en: "One pair changes the place value. Multiply each addend by four while preserving its place." },
    correctText: { ru: 'Верно. Сумма частичных произведений равна 12 820.', uz: "To'g'ri. Qism ko'paytmalar yig'indisi 12 820 ga teng.", en: "Correct. The sum of the partial products is 12 820." },
    rule: { ru: 'При умножении число можно разложить на разрядные слагаемые.', uz: "Ko'paytirishda sonni xona qo'shiluvchilariga ajratish mumkin.", en: "A number can be partitioned into place-value addends before multiplication." },
  },
  {
    id: '04', kind: 'numpad', level: '🟡', answer: '13820', maxLen: 5, figure: '2 764 × 5',
    setup: { ru: 'При вычислении будет несколько переносов.', uz: "Hisoblashda bir nechta ko'chirish bo'ladi.", en: "You will need to carry several times." },
    prompt: { ru: 'Найди произведение.', uz: "Ko'paytmani toping.", en: "Find the product." },
    hints: [
      { ru: 'Начни с единиц. Записывай единицы результата, а десятки переноси в следующий разряд.', uz: "Birlar xonasidan boshlang. Natijaning birliklarini yozing, o'nliklarni keyingi xonaga ko'chiring.", en: "Start with the ones. Write the ones digit of the result and carry the tens into the next place." },
      { ru: 'Проверь перенос после умножения единиц и после умножения десятков.', uz: "Birliklarni va o'nliklarni ko'paytirgandan keyingi ko'chirishlarni tekshiring.", en: "Check the carry after multiplying the ones and after multiplying the tens." },
    ],
    correctText: { ru: 'Верно: 2 764 × 5 = 13 820.', uz: "To'g'ri: 2 764 × 5 = 13 820.", en: "Correct: 2 764 × 5 = 13 820." },
    rule: { ru: 'Каждый перенос прибавляется к произведению следующего разряда.', uz: "Har bir ko'chirilgan qiymat keyingi xona ko'paytmasiga qo'shiladi.", en: "Add each carried value to the product in the next place." },
  },
  {
    id: '05', kind: 'digit', level: '🟡', answer: '2', figure: '4 036 × 7 = 28 □52',
    setup: { ru: 'Из произведения исчезла одна цифра.', uz: "Ko'paytmadan bitta raqam yo'qoldi.", en: "One digit is missing from the product." },
    prompt: { ru: 'Какую цифру нужно вернуть?', uz: 'Qaysi raqamni qaytarish kerak?', en: "Which digit should be restored?" },
    wrongText: { ru: 'На шаге умножения нуля не теряй перенос из предыдущего разряда.', uz: "Nolni ko'paytirish qadamida oldingi xonadan ko'chirilgan qiymatni yo'qotmang.", en: "When multiplying the zero, do not lose the carry from the previous place." },
    correctText: { ru: 'Верно. Получилось 28 252: на месте нуля учтён перенос.', uz: "To'g'ri. 28 252 hosil bo'ldi: nol turgan xonada ko'chirish hisobga olindi.", en: "Correct. The result is 28 252: the carry was included in the zero place." },
    rule: { ru: 'Ноль сохраняет место разряда и не отменяет перенос.', uz: "Nol xona o'rnini saqlaydi va ko'chirishni bekor qilmaydi.", en: "A zero preserves its place and does not cancel a carry." },
  },
  {
    id: '06', kind: 'mc', level: '🟡', figure: '1 864 × 7',
    setup: { ru: 'В каждой из семи коробок находится 1 864 детали.', uz: "Yettita qutining har birida 1 864 tadan detal bor.", en: "Each of seven boxes contains 1 864 parts." },
    prompt: { ru: 'Сколько деталей во всех коробках?', uz: "Barcha qutilarda nechta detal bor?", en: "How many parts are there in all the boxes?" },
    options: [
      { text: '13 048', correct: true },
      { text: '1 871', wrong: { ru: 'Здесь к количеству деталей прибавлено число коробок. Одинаковую группу нужно взять семь раз.', uz: "Bu yerda detallar soniga qutilar soni qo'shilgan. Bir xil guruhni yetti marta olish kerak.", en: "This adds the number of boxes to the number of parts. The equal group must be taken seven times." } },
      { text: '12 648', wrong: { ru: 'Проверь перенос при умножении десятков и сотен.', uz: "O'nliklar va yuzliklarni ko'paytirishdagi ko'chirishni tekshiring.", en: "Check the carries when multiplying the tens and hundreds." } },
      { text: '130 048', wrong: { ru: 'В произведение добавлен лишний разряд. Сравни ответ с оценкой: две тысячи, взятые семь раз.', uz: "Ko'paytmaga ortiqcha xona qo'shilgan. Javobni ikki mingni yetti marta olish taxmini bilan taqqoslang.", en: "An extra place was added to the product. Compare the answer with an estimate of two thousand taken seven times." } },
    ],
    correctText: { ru: 'Верно. В семи коробках 13 048 деталей.', uz: "To'g'ri. Yettita qutida 13 048 ta detal bor.", en: "Correct. There are 13 048 parts in seven boxes." },
    rule: { ru: 'Количество одинаковых групп является множителем.', uz: "Bir xil guruhlar soni ko'paytiruvchi bo'ladi.", en: "The number of equal groups is a multiplier." },
  },
  {
    id: '07', kind: 'match', level: '🟡',
    setup: { ru: 'До точного вычисления полезно оценить величину ответа.', uz: "Aniq hisoblashdan oldin javob kattaligini taxmin qilish foydali.", en: "It is useful to estimate the size of the answer before calculating exactly." },
    prompt: { ru: 'Соедини точное произведение с его оценкой.', uz: "Aniq ko'paytmani uning taxmini bilan moslashtiring.", en: "Match each exact product to its estimate." },
    pairs: [
      { id: 'a', left: '1 248 × 3 = 3 744', right: { ru: 'примерно 3 600', uz: 'taxminan 3 600', en: "approximately 3 600" } },
      { id: 'b', left: '2 096 × 4 = 8 384', right: { ru: 'примерно 8 400', uz: 'taxminan 8 400', en: "approximately 8 400" } },
      { id: 'c', left: '3 105 × 2 = 6 210', right: { ru: 'примерно 6 200', uz: 'taxminan 6 200', en: "approximately 6 200" } },
    ],
    wrongText: { ru: 'Одна оценка слишком далека от точного результата. Округли многозначное число, но не меняй множитель.', uz: "Taxminlardan biri aniq natijadan juda uzoq. Ko'p xonali sonni yaxlitlang, ammo ko'paytiruvchini o'zgartirmang.", en: "One estimate is too far from the exact result. Round the multi-digit number, but do not change the multiplier." },
    correctText: { ru: 'Верно. Все точные ответы близки к своим оценкам.', uz: "To'g'ri. Barcha aniq javoblar o'z taxminlariga yaqin.", en: "Correct. All the exact answers are close to their estimates." },
    rule: { ru: 'Оценка помогает заметить потерянный или лишний разряд.', uz: "Taxmin yo'qolgan yoki ortiqcha xonani aniqlashga yordam beradi.", en: "Estimation helps you spot a missing or extra place value." },
  },
  {
    id: '08', kind: 'numpad', level: '🔴', answer: '42381', maxLen: 5, figure: '4 709 × 9',
    setup: { ru: 'В числе есть внутренний ноль, а множитель — наибольшая однозначная цифра.', uz: "Son ichida nol bor, ko'paytiruvchi esa eng katta bir xonali raqam.", en: "The number contains an internal zero, and the multiplier is the greatest one-digit number." },
    prompt: { ru: 'Вычисли произведение.', uz: "Ko'paytmani hisoblang.", en: "Calculate the product." },
    hints: [
      { ru: 'Не пропускай разряд с нулём: к нулю нужно прибавить перенос.', uz: "Nol turgan xonani tashlab ketmang: nolga ko'chirilgan qiymatni qo'shish kerak.", en: "Do not skip the place containing zero: add the carry to the zero." },
      { ru: 'Проверь все переносы справа налево и сравни результат с 4 700 × 9.', uz: "Barcha ko'chirishlarni o'ngdan chapga tekshiring va natijani 4 700 × 9 bilan taqqoslang.", en: "Check every carry from right to left and compare the result with 4 700 × 9." },
    ],
    correctText: { ru: 'Верно: 4 709 × 9 = 42 381.', uz: "To'g'ri: 4 709 × 9 = 42 381.", en: "Correct: 4 709 × 9 = 42 381." },
    rule: { ru: 'Внутренний ноль участвует в алгоритме как отдельный разряд.', uz: "Ichki nol algoritmda alohida xona sifatida qatnashadi.", en: "An internal zero participates in the algorithm as a separate place value." },
  },
  {
    id: '09', kind: 'mc', level: '🔴', figure: '3 018 × 4 = 1 272',
    setup: { ru: 'В записи ответа потеряно место одного разряда.', uz: "Javob yozuvida bitta xona o'rni yo'qolgan.", en: "One place value is missing from the written answer." },
    prompt: { ru: 'В чём первая ошибка?', uz: 'Birinchi xato nimada?', en: "What is the first error?" },
    options: [
      { text: { ru: 'Пропущен разряд сотен с нулём; верный ответ 12 072', uz: "Nol turgan yuzlar xonasi tashlab ketilgan; to'g'ri javob 12 072", en: "The zero in the hundreds place is missing; the correct answer is 12 072" }, correct: true },
      { text: { ru: 'Нужно умножать слева направо', uz: "Chapdan o'ngga ko'paytirish kerak", en: "You must multiply from left to right" }, wrong: { ru: 'Направление алгоритма не объясняет потерю разряда. Проверь, где должен остаться внутренний ноль.', uz: "Algoritm yo'nalishi xona yo'qolishini tushuntirmaydi. Ichki nol qayerda qolishi kerakligini tekshiring.", en: "The direction of the algorithm does not explain the missing place. Check where the internal zero belongs." } },
      { text: { ru: 'Ноль всегда можно убрать из ответа', uz: "Javobdan nolni har doim olib tashlash mumkin", en: "A zero can always be removed from an answer" }, wrong: { ru: 'Удаление внутреннего нуля сдвигает остальные цифры и меняет значение числа.', uz: "Ichki nolni olib tashlash qolgan raqamlarni siljitadi va son qiymatini o'zgartiradi.", en: "Removing an internal zero shifts the other digits and changes the value of the number." } },
      { text: { ru: 'Ошибка только в последней цифре', uz: 'Xato faqat oxirgi raqamda', en: "Only the final digit is wrong" }, wrong: { ru: 'Последняя цифра 2 получена верно. Сравни количество разрядов точного ответа с оценкой.', uz: "Oxirgi 2 raqami to'g'ri olingan. Aniq javob xonalari sonini taxmin bilan taqqoslang.", en: "The final digit 2 is correct. Compare the number of places in the exact answer with the estimate." } },
    ],
    correctText: { ru: 'Верно. Ноль удерживает сотни, поэтому произведение равно 12 072.', uz: "To'g'ri. Nol yuzlar xonasini saqlaydi, shuning uchun ko'paytma 12 072 ga teng.", en: "Correct. The zero holds the hundreds place, so the product is 12 072." },
    rule: { ru: 'Нельзя удалять внутренний ноль: он сохраняет разряд числа.', uz: "Ichki nolni olib tashlab bo'lmaydi: u son xonasini saqlaydi.", en: "Do not remove an internal zero: it preserves the place value of the number." },
  },
  {
    id: '10', kind: 'mc', level: '🔴', figure: '4 999 × 7',
    setup: { ru: 'Число 4 999 всего на один меньше 5 000.', uz: "4 999 soni 5 000 dan faqat birga kichik.", en: "The number 4 999 is just one less than 5 000." },
    prompt: { ru: 'Какой способ самый короткий и правильный?', uz: "Qaysi usul eng qisqa va to'g'ri?", en: "Which method is the shortest and correct?" },
    options: [
      { text: '(5 000 − 1) × 7 = 35 000 − 7 = 34 993', correct: true },
      { text: '(5 000 + 1) × 7 = 35 000 + 7', wrong: { ru: 'Число 4 999 меньше 5 000, а не больше. Компенсация выбрана в неверную сторону.', uz: "4 999 soni 5 000 dan katta emas, kichik. Kompensatsiya noto'g'ri yo'nalishda tanlangan.", en: "The number 4 999 is less than 5 000, not greater. The compensation goes in the wrong direction." } },
      { text: '(5 000 − 1) × 7 = 35 000 − 1', wrong: { ru: 'Единицу тоже берут семь раз, поэтому компенсация должна учитывать множитель.', uz: "Bir ham yetti marta olinadi, shuning uchun kompensatsiyada ko'paytiruvchini hisobga olish kerak.", en: "The one is also taken seven times, so the compensation must include the multiplier." } },
      { text: '5 000 × 7 = 35 000', wrong: { ru: 'Это произведение для числа 5 000. Нужно учесть разницу между 5 000 и 4 999.', uz: "Bu 5 000 sonining ko'paytmasi. 5 000 va 4 999 orasidagi farqni hisobga olish kerak.", en: "This is the product for 5 000. You must account for the difference between 5 000 and 4 999." } },
    ],
    correctText: { ru: 'Верно. Из 35 000 вычитаются семь единиц, и получается 34 993.', uz: "To'g'ri. 35 000 dan yetti birlik ayiriladi va 34 993 hosil bo'ladi.", en: "Correct. Subtracting seven ones from 35 000 gives 34 993." },
    rule: { ru: 'Для числа рядом с круглым удобно умножить круглое число и выполнить компенсацию.', uz: "Yaxlit songa yaqin son uchun yaxlit sonni ko'paytirib, kompensatsiya qilish qulay.", en: "For a number close to a round number, multiply the round number and then compensate." },
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

function Task({ task, lang, last, onSolved }) {
  // Xato javobdan keyin variantlar qayta aralashadi (metodist qarori 2026-08-21).
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- wrongRound ataylab yangi tartib beradi
  const choices = useMemo(() => task.kind === 'mc' ? shuffle(task.options) : (task.options || []), [task, wrongRound]);
  const rightPairs = useMemo(() => task.kind === 'match' ? shuffle(task.pairs) : [], [task]);
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
    ((task.kind === 'mc' || task.kind === 'place') && pickedChoice?.correct === true)
    || (task.kind === 'digit' && String(picked) === task.answer)
    || (task.kind === 'numpad' && typed === task.answer)
    || (task.kind === 'match' && task.pairs.every((pair, i) => pairs[i] === pair.id))
  );
  const solved = checked && answerCorrect;
  const canCheck = ((task.kind === 'mc' || task.kind === 'place' || task.kind === 'digit') && picked !== null)
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
    if (task.kind === 'mc' || task.kind === 'place') return pickedChoice?.wrong;
    if (task.kind === 'numpad') return task.hints[Math.min(Math.max(attempts - 1, 0), task.hints.length - 1)];
    return task.wrongText;
  })();

  const retry = () => {
    setChecked(false);
    setPicked(null);
    setTyped('');
    if (task.kind === 'match') { setPairs({}); setActiveLeft(null); }
  };

  return (
    <div className="p4-task">
      <p className="p4-eyebrow">{task.level} {tx(UI.task, lang)} {task.id}</p>
      <p className="p4-setup">{tx(task.setup, lang)}</p>
      {task.figure && <div className="p4-figure"><span className="p4-bignum">{tx(task.figure, lang)}</span></div>}
      <h2 className="p4-ask">{tx(task.prompt, lang)}</h2>

      {task.kind === 'mc' && <div className="p4-options">{choices.map((option, i) => (
        <button key={`${task.id}-${i}`} type="button" className={`p4-option ${picked === option ? (checked ? (option.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`} disabled={solved} aria-pressed={picked === option} onClick={() => { setPicked(option); setChecked(false); }}>
          <span className="p4-letter">{'ABCD'[i]}</span><span>{tx(option.text, lang)}</span>
        </button>
      ))}</div>}

      {task.kind === 'place' && <div className="p4-place" role="group" aria-label={tx(UI.placeHint, lang)}>
        <div className="p4-place-row p4-place-number" aria-hidden="true">{task.digits.map((digit, i) => <span key={`${digit}-${i}`}>{digit}</span>)}</div>
        <div className="p4-place-row">{choices.map((option) => (
          <button key={option.id} type="button" className={`p4-place-slot ${picked === option ? (checked ? (option.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`} disabled={solved} aria-label={tx(option.label, lang)} aria-pressed={picked === option} onClick={() => { setPicked(option); setChecked(false); }}>
            <span>{picked === option ? '6' : '·'}</span><small>{tx(option.label, lang)}</small>
          </button>
        ))}</div>
      </div>}

      {task.kind === 'numpad' && <NumPad value={typed} setValue={(fn) => { setTyped(fn); setChecked(false); }} max={task.maxLen} disabled={solved} lang={lang} />}

      {task.kind === 'digit' && <div className="p4-digits" role="group" aria-label={tx(UI.digitHint, lang)}>{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
        <button key={digit} type="button" className={`p4-digit-choice ${picked === digit ? (checked ? (String(digit) === task.answer ? 'is-ok' : 'is-no') : 'is-on') : ''}`} disabled={solved} aria-pressed={picked === digit} onClick={() => { setPicked(digit); setChecked(false); }}>{digit}</button>
      ))}</div>}

      {task.kind === 'match' && <div className="p4-match">
        <p className="p4-note">{tx(UI.matchHint, lang)}</p>
        <div className="p4-match-cols">
          <div className="p4-match-col">{task.pairs.map((pair, i) => (
            <button key={pair.id} type="button" className={`p4-match-item ${activeLeft === i ? 'is-active' : ''} ${pairs[i] ? 'is-tied' : ''} ${firstMatchWrong === i ? 'is-no' : ''}`} disabled={solved} aria-pressed={activeLeft === i} onClick={() => { setActiveLeft(i); setChecked(false); }}>
              {tx(pair.left, lang)}{pairs[i] && <b className="p4-tie">{tx(rightPairs.find((right) => right.id === pairs[i])?.right, lang)}</b>}
            </button>
          ))}</div>
          <div className="p4-match-col">{rightPairs.map((pair) => {
            const used = Object.values(pairs).includes(pair.id);
            return <button key={pair.id} type="button" className="p4-match-item p4-match-right" disabled={solved || activeLeft === null || used} aria-pressed={used} onClick={() => {
              if (activeLeft === null || used) return;
              setPairs((old) => ({ ...old, [activeLeft]: pair.id })); setActiveLeft(null); setChecked(false);
            }}>{tx(pair.right, lang)}</button>;
          })}</div>
        </div>
      </div>}

      {checked && <Feedback feedbackRef={feedbackRef} ok={solved} text={tx(solved ? task.correctText : wrongText, lang)} rule={task.rule} lang={lang} />}

      <div className="p4-actions">
        {!solved && <button type="button" className="p4-btn" disabled={!canCheck} onClick={() => { setChecked(true); setAttempts((n) => n + 1); if (!answerCorrect) setWrongRound((old) => old + 1); }}>{tx(UI.check, lang)}</button>}
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
      </div>
    </div>
  );
}

export default function Grade4Dars09Practice({ lang: langProp, onFinished }) {
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
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.p4-option{display:flex;align-items:center;gap:9px;min-height:56px;padding:10px 12px;text-align:left;font-family:inherit;font-weight:700;font-size:clamp(13px,1.9vw,15px);color:${T.ink};background:${T.paper};border:1px solid rgba(23,59,82,.12);border-radius:14px;cursor:pointer;transition:transform .2s ease,border-color .2s ease}.p4-option:hover:not(:disabled){border-color:rgba(22,143,163,.4);transform:translateY(-2px)}.p4-letter{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:8px;background:${T.cyanSoft};color:${T.cyan};font:800 11px 'JetBrains Mono',monospace}.p4-option.is-on{border-color:${T.accent};background:${T.accentSoft}}.p4-option.is-ok,.p4-place-slot.is-ok,.p4-digit-choice.is-ok{border-color:rgba(34,122,83,.4);background:${T.successSoft};color:${T.success}}.p4-option.is-no,.p4-place-slot.is-no,.p4-digit-choice.is-no{border-color:rgba(169,111,19,.4);background:${T.warnSoft};color:${T.warn}}
.p4-place{width:min(420px,100%);margin:0 auto;padding:12px;border-radius:16px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}.p4-place-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.p4-place-number span{display:flex;align-items:center;justify-content:center;min-height:44px;font:800 clamp(23px,5vw,32px) 'JetBrains Mono',monospace;color:${T.navy}}.p4-place-slot{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:58px;padding:5px 2px;border:1px solid rgba(23,59,82,.14);border-radius:11px;background:${T.bg};color:${T.ink3};cursor:pointer}.p4-place-slot>span{font:800 20px 'JetBrains Mono',monospace}.p4-place-slot small{font:700 9px 'Manrope',sans-serif;overflow-wrap:anywhere}.p4-place-slot.is-on{border-color:${T.accent};background:${T.accentSoft};color:${T.accent}}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:8px;width:min(240px,100%);margin:0 auto;padding:12px;border-radius:18px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8)}.p4-pad-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:50px;border:2px solid ${T.accent};border-radius:13px;background:${T.paper};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;color:${T.navy}}.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:100%}.p4-key{min-height:44px;border:1px solid rgba(23,59,82,.16);border-radius:12px;background:${T.paper};font:800 clamp(18px,3.6vw,22px) 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer}.p4-key-del{background:${T.accentSoft};color:${T.accent}}
.p4-digits{display:grid;grid-template-columns:repeat(5,minmax(44px,1fr));gap:8px;width:min(360px,100%);margin:0 auto}.p4-digit-choice{min-height:48px;border:1px solid rgba(23,59,82,.14);border-radius:12px;background:${T.paper};font:800 20px 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer}.p4-digit-choice.is-on{border-color:${T.accent};background:${T.accentSoft}}
.p4-match-cols{display:flex;gap:10px;margin-top:8px}.p4-match-col{display:flex;flex-direction:column;gap:8px;flex:1;min-width:0}.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-height:56px;padding:8px 10px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};font:800 clamp(11px,2vw,15px) 'Manrope',sans-serif;color:${T.navy};cursor:pointer;overflow-wrap:anywhere}.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}.p4-match-item.is-tied{border-color:rgba(34,122,83,.35)}.p4-match-item.is-no{border-color:${T.warn};background:${T.warnSoft}}.p4-tie{font-size:10px;color:${T.success};text-align:center}
.p4-fb{padding:12px 14px;border-radius:14px}.p4-fb.is-ok{background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}.p4-fb.is-no{background:${T.warnSoft};box-shadow:inset 4px 0 0 ${T.warn}}.p4-fb-txt{margin:0;font-family:'Source Serif 4',Georgia,serif;font-size:clamp(14px,2.1vw,16px);line-height:1.45}.p4-rule{margin:8px 0 0;font-size:13px;color:${T.ink2}}
.p4-actions{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:10px;margin-top:4px}.p4-btn{min-height:46px;padding:10px 22px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font-family:inherit;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5),inset 0 0 0 1px rgba(255,91,53,.2)}.p4-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.p4-btn-ready{background:${T.accent};color:#fff}.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}.p4-done{display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 12px;text-align:center}.p4-done h2{margin:0;font:600 clamp(24px,5vw,34px) 'Source Serif 4',Georgia,serif}.p4-score{margin:0;font-family:'JetBrains Mono',monospace}.p4-score b{font-size:clamp(32px,7vw,44px);color:${T.success}}.p4-score span{font-size:14px;color:${T.ink3}}
@media(max-width:520px){.p4-options{grid-template-columns:1fr}.p4-match-cols{gap:8px}.p4-match-item{font-size:11px;padding:7px}.p4-place-slot small{font-size:8px}.p4-head{padding-top:54px}}
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
`;
