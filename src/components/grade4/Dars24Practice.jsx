// ============================================================================
// 4-SINF · 24-DARS AMALIYOTI · O‘NLI KASRLAR
// Dars01Practice metodik ketma-ketligi va Dars21Practice texnik kontrakti.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

const T = {
  bg: '#F5F5F0',
  paper: '#FFFFFF',
  ink: '#12212C',
  ink2: '#50616D',
  ink3: '#87949D',
  accent: '#FF5B35',
  accentSoft: '#FFF0EA',
  cyan: '#168FA3',
  cyanSoft: '#E5F5F6',
  navy: '#173B52',
  success: '#227A53',
  successSoft: '#E7F3EC',
  warn: '#A96F13',
  warnSoft: '#FFF5D9',
};

const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';
const b = (ru, uz, en) => ({ ru, uz, en });
const option = (id, ru, uz, en, correct = false, wrongRu = '', wrongUz = '', wrongEn = '') => ({
  id, text: b(ru, uz, en), correct, wrong: wrongRu ? b(wrongRu, wrongUz, wrongEn) : null,
});
const tx = (value, lang) => (value && typeof value === 'object' && !Array.isArray(value) ? (value[lang] ?? '') : value);

const shuffle = (items, runKey) => {
  if (!items?.length) return [];
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  const rotation = [...runKey].reduce((sum, char) => sum + char.charCodeAt(0), 0) % copy.length;
  return [...copy.slice(rotation), ...copy.slice(0, rotation)];
};

const UI = {
  title: b('Урок 24. Практика: десятичные дроби', '24-dars. Amaliyot: o‘nli kasrlar', 'Lesson 24. Practice: decimal fractions'),
  language: b('Язык', 'Til', 'Language'), task: b('Задание', 'Topshiriq', 'Task'),
  level: {
    green: b('Основное', 'Asosiy', 'Core'),
    yellow: b('Применение', "Qo'llash", 'Application'),
    red: b('Перенос', "Ko'chirish", 'Transfer'),
  },
  check: b('Проверить', 'Tekshirish', 'Check'), retry: b('Исправить ответ', 'Javobni tuzatish', 'Correct the answer'),
  next: b('Следующее', 'Keyingisi', 'Next'), finish: b('Завершить', 'Yakunlash', 'Finish'),
  done: b('Практика пройдена', 'Amaliyot tugadi', 'Practice complete'),
  allSolved: b('Все 10 заданий решены.', '10 ta topshiriqning barchasi yechildi.', 'All 10 tasks have been solved.'),
  firstTry: b('верно с первой проверки', "birinchi tekshiruvda to'g'ri", 'correct on the first check'),
  again: b('Пройти заново', 'Qaytadan ishlash', 'Try again'),
  remember: b('Запомните', 'Eslab qoling', 'Remember'),
  typeAnswer: b('Введите числовой ответ', 'Sonli javobni kiriting', 'Enter a numerical answer'),
  clear: b('Удалить', "O'chirish", 'Delete'),
  matchHint: b('Выберите карточку слева, затем её пару справа.', "Avval chapdagi kartani, keyin o'ngdagi juftini tanlang.", 'Choose a card on the left, then its match on the right.'),
  orderHint: b('Выберите место, затем карточку шага.', 'Avval joyni, keyin qadam kartasini tanlang.', 'Choose a position, then a step card.'),
  visualKey: b('Модель · шаг · результат', 'Model · qadam · natija', 'Model · step · result'),
};

const LESSON_META = {
  lessonId: 'num-4-24-practice', lessonTitle: UI.title, grade: 4, lessonNumber: 24,
  activityType: 'practice', taskCount: 10, resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
  topic: b('Десятичная запись', 'O‘nli yozuv', 'Decimal notation'),
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'choice-card', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'place-value-construction', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'notation-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'place-value-matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const TASKS = [
  {
    id: '01', level: 'green', kind: 'mc', skillTag: 'tenths-decimal-notation',
    visual: { type: 'strip', total: 10, filled: 8, main: b('■■■■■■■■□□', '■■■■■■■■□□', '■■■■■■■■□□'), note: b('Закрашено 8 из 10 равных клеток: 8/10.', '10 ta teng katakdan 8 tasi bo‘yalgan: 8/10.', '8 of 10 equal cells are shaded: 8/10.') },
    setup: b('Полоса разделена на десять равных клеток. Восемь клеток закрашены.', 'Tasma o‘nta teng katakka bo‘lingan. Sakkizta katak bo‘yalgan.', 'A strip is divided into ten equal cells. Eight cells are shaded.'),
    prompt: b('Какая десятичная запись соответствует модели?', 'Modelga qaysi o‘nli yozuv mos keladi?', 'Which decimal notation matches the model?'),
    options: [
      option('eight-tenths', '0,8', '0,8', '0.8', true),
      option('eight-hundredths', '0,08', '0,08', '0.08', false, 'В этой записи цифра 8 стоит в разряде сотых, а модель показывает десятые.', 'Bu yozuvda 8 yuzdan birlar xonasida, model esa o‘ndan birlarni ko‘rsatadi.', 'Here 8 is in the hundredths place, but the model shows tenths.'),
      option('eight-wholes', '8,0', '8,0', '8.0', false, 'Модель показывает часть одного целого, а не восемь целых.', 'Model bitta butunning qismini ko‘rsatadi, sakkizta butunni emas.', 'The model shows part of one whole, not eight wholes.'),
      option('unshaded', '0,2', '0,2', '0.2', false, 'Две клетки не закрашены; требуется запись закрашенной части.', 'Ikki katak bo‘yalmagan; bo‘yalgan qism yozuvi kerak.', 'Two cells are unshaded; the shaded part is required.'),
    ],
    secondHint: b('Одна клетка — одна десятая, поэтому 8 стоит сразу после запятой.', 'Bitta katak — o‘ndan bir; shuning uchun 8 verguldan keyingi birinchi xonada turadi.', 'One cell is one tenth, so 8 goes immediately after the decimal point.'),
    thirdHint: b('Дробь 8/10 записывается одной цифрой в разряде десятых.', '8/10 kasr o‘ndan birlar xonasida bitta raqam bilan yoziladi.', 'The fraction 8/10 uses one digit in the tenths place.'),
    correctText: b('Верно. Восемь десятых записывают как 0,8.', "To'g'ri. O'ndan sakkiz 0,8 deb yoziladi.", 'Correct. Eight tenths is written as 0.8.'),
    rule: b('Первая цифра после десятичного разделителя обозначает десятые.', 'O‘nli ajratgichdan keyingi birinchi raqam o‘ndan birlarni bildiradi.', 'The first digit after the decimal separator represents tenths.'),
  },
  {
    id: '02', level: 'green', kind: 'card', skillTag: 'decimal-place-reading',
    visual: { type: 'place', main: b('4,271', '4,271', '4.271'), places: [
      { label: b('Единицы', 'Birlar', 'Ones'), value: '4' },
      { label: b('Десятые', 'O‘ndan birlar', 'Tenths'), value: '2' },
      { label: b('Сотые', 'Yuzdan birlar', 'Hundredths'), value: '7' },
      { label: b('Тысячные', 'Mingdan birlar', 'Thousandths'), value: '1' },
    ], note: b('Каждая цифра сохраняет своё место.', 'Har bir raqam o‘z xonasini saqlaydi.', 'Each digit keeps its place.') },
    setup: b('В таблице разрядов записано число 4,271.', 'Xona jadvalida 4,271 soni yozilgan.', 'The place-value chart shows 4.271.'),
    prompt: b('Какая цифра стоит в разряде сотых?', 'Yuzdan birlar xonasida qaysi raqam turibdi?', 'Which digit is in the hundredths place?'),
    options: [
      option('hundredths', '7', '7', '7', true),
      option('tenths', '2', '2', '2', false, 'Цифра 2 находится в разряде десятых.', '2 raqami o‘ndan birlar xonasida.', 'The digit 2 is in the tenths place.'),
      option('thousandths', '1', '1', '1', false, 'Цифра 1 находится в разряде тысячных.', '1 raqami mingdan birlar xonasida.', 'The digit 1 is in the thousandths place.'),
      option('ones', '4', '4', '4', false, 'Цифра 4 находится слева от разделителя — в единицах.', '4 raqami ajratgichning chapida — birlar xonasida.', 'The digit 4 is left of the separator, in the ones place.'),
    ],
    secondHint: b('После разделителя идут десятые, затем сотые.', 'Ajratgichdan keyin o‘ndan birlar, so‘ng yuzdan birlar keladi.', 'After the separator come tenths, then hundredths.'),
    thirdHint: b('В записи 4,271 вторая цифра после запятой — 7.', '4,271 yozuvida verguldan keyingi ikkinchi raqam 7.', 'In 4.271, the second digit after the point is 7.'),
    correctText: b('Верно. Цифра сотых — 7.', "To'g'ri. Yuzdan birlar raqami — 7.", 'Correct. The hundredths digit is 7.'),
    rule: b('Сотые занимают второе место после десятичного разделителя.', 'Yuzdan birlar o‘nli ajratgichdan keyingi ikkinchi xonada turadi.', 'Hundredths occupy the second place after the decimal separator.'),
  },
  {
    id: '03', level: 'yellow', kind: 'match', skillTag: 'fraction-decimal-matching',
    visual: { type: 'cards', main: b('Знаменатели 10 · 100 · 1000', 'Maxrajlar 10 · 100 · 1000', 'Denominators 10 · 100 · 1000'), note: b('Число знаков после разделителя задаётся знаменателем.', 'Ajratgichdan keyingi xonalar sonini maxraj belgilaydi.', 'The denominator determines the number of decimal places.') },
    setup: b('Каждую обыкновенную дробь нужно связать с её десятичной записью.', 'Har bir oddiy kasrni uning o‘nli yozuvi bilan bog‘lash kerak.', 'Match each common fraction to its decimal notation.'),
    prompt: b('Соедините равные записи.', 'Teng yozuvlarni moslashtiring.', 'Match the equivalent notations.'),
    pairs: [
      { id: 'a', left: b('9/10', '9/10', '9/10'), correctRight: 'nine-tenths' },
      { id: 'b', left: b('32/100', '32/100', '32/100'), correctRight: 'thirty-two-hundredths' },
      { id: 'c', left: b('704/1000', '704/1000', '704/1000'), correctRight: 'seven-zero-four-thousandths' },
    ],
    right: [
      { id: 'nine-tenths', text: b('0,9', '0,9', '0.9') },
      { id: 'thirty-two-hundredths', text: b('0,32', '0,32', '0.32') },
      { id: 'seven-zero-four-thousandths', text: b('0,704', '0,704', '0.704') },
    ],
    wrong: [b('Сохраните столько мест после разделителя, сколько нулей в знаменателе.', 'Maxrajda nechta nol bo‘lsa, ajratgichdan keyin shuncha xona saqlang.', 'Keep as many decimal places as there are zeros in the denominator.')],
    secondHint: b('Знаменатель 100 требует двух мест после разделителя.', '100 maxraj ajratgichdan keyin ikki xonani talab qiladi.', 'A denominator of 100 requires two decimal places.'),
    thirdHint: b('10 → одно место; 100 → два; 1000 → три.', '10 → bir xona; 100 → ikki; 1000 → uch.', '10 → one place; 100 → two; 1000 → three.'),
    correctText: b('Верно. Все три дроби получили точную десятичную запись.', "To'g'ri. Uchala kasrning aniq o'nli yozuvi topildi.", 'Correct. All three fractions have their exact decimal notation.'),
    rule: b('Разряды справа от разделителя соответствуют десятым, сотым и тысячным.', 'Ajratgichning o‘ngidagi xonalar o‘ndan, yuzdan va mingdan birlarga mos keladi.', 'Places to the right of the separator correspond to tenths, hundredths and thousandths.'),
  },
  {
    id: '04', level: 'yellow', kind: 'order', skillTag: 'decimal-place-construction',
    visual: { type: 'place', main: b('Шесть целых и четыреста восемьдесят две тысячных', 'Olti butun mingdan to‘rt yuz sakson ikki', 'Six and four hundred and eighty-two thousandths'), places: [
      { label: b('Единицы', 'Birlar', 'Ones'), value: '□' },
      { label: b('Разделитель', 'Ajratgich', 'Separator'), value: b(',', ',', '.') },
      { label: b('Десятые', 'O‘ndan birlar', 'Tenths'), value: '□' },
      { label: b('Сотые', 'Yuzdan birlar', 'Hundredths'), value: '□' },
      { label: b('Тысячные', 'Mingdan birlar', 'Thousandths'), value: '□' },
    ], note: b('Опора: 6 и 482/1000.', 'Tayanch: 6 va 482/1000.', 'Support: 6 and 482/1000.') },
    setup: b('Нужно построить запись числа по названию его разрядов.', 'Son yozuvini uning xonalari nomi bo‘yicha tuzish kerak.', 'Build the notation from the named place values.'),
    prompt: b('Разместите цифры по разрядам.', 'Raqamlarni xonalar bo‘yicha joylashtiring.', 'Place the digits in their places.'),
    steps: [
      { id: 'ones', label: b('Единицы', 'Birlar', 'Ones'), correct: 'six' },
      { id: 'tenths', label: b('Десятые', 'O‘ndan birlar', 'Tenths'), correct: 'four' },
      { id: 'hundredths', label: b('Сотые', 'Yuzdan birlar', 'Hundredths'), correct: 'eight' },
      { id: 'thousandths', label: b('Тысячные', 'Mingdan birlar', 'Thousandths'), correct: 'two' },
    ],
    cards: [
      { id: 'six', text: b('6', '6', '6') },
      { id: 'four', text: b('4', '4', '4') },
      { id: 'eight', text: b('8', '8', '8') },
      { id: 'two', text: b('2', '2', '2') },
    ],
    wrong: [b('После единиц идут десятые, сотые и тысячные именно в таком порядке.', 'Birlardan keyin o‘ndan, yuzdan va mingdan birlar aynan shu tartibda keladi.', 'After ones come tenths, hundredths and thousandths in that order.')],
    secondHint: b('Цифра 6 стоит в единицах; цифра 4 — в десятых.', '6 birlar xonasida; 4 o‘ndan birlar xonasida turadi.', '6 is in ones; 4 is in tenths.'),
    thirdHint: b('Последние две позиции занимают 8 сотых и 2 тысячных.', 'Oxirgi ikki xonada 8 yuzdan bir va 2 mingdan bir turadi.', 'The final two positions hold 8 hundredths and 2 thousandths.'),
    correctText: b('Верно. Получилась запись 6,482.', "To'g'ri. 6,482 yozuvi hosil bo'ldi.", 'Correct. The notation is 6.482.'),
    rule: b('Каждая цифра записывается в разряде, названном в чтении числа.', 'Har bir raqam son o‘qilishida aytilgan xonaga yoziladi.', 'Each digit is written in the place named when the number is read.'),
  },
  {
    id: '05', level: 'yellow', kind: 'missing', skillTag: 'zero-placeholder', answer: '0', maxLen: 1,
    visual: { type: 'formula', main: b('9/100 ↔ 0,□9', '9/100 ↔ 0,□9', '9/100 ↔ 0.□9'), note: b('Пустой разряд — десятые.', 'Bo‘sh xona — o‘ndan birlar.', 'The blank place is tenths.') },
    setup: b('В дроби 9/100 есть девять сотых и нет десятых.', '9/100 kasrda yuzdan to‘qqiz bor, o‘ndan bir esa yo‘q.', 'The fraction 9/100 has nine hundredths and no tenths.'),
    prompt: b('Какую цифру нужно вписать в пустой разряд?', 'Bo‘sh xonaga qaysi raqamni yozish kerak?', 'Which digit belongs in the blank place?'),
    wrong: [b('Пустой разряд нужно сохранить нулём.', 'Bo‘sh xonani nol bilan saqlash kerak.', 'The empty place must be held by zero.')],
    secondHint: b('Цифра 9 должна остаться во втором месте после разделителя.', '9 raqami ajratgichdan keyingi ikkinchi xonada qolishi kerak.', 'The digit 9 must remain in the second place after the separator.'),
    thirdHint: b('Перед 9 сотыми запишите 0 десятых.', '9 yuzdan birdan oldin 0 o‘ndan bir yozing.', 'Write 0 tenths before the 9 hundredths.'),
    correctText: b('Верно. 9/100 записывается как 0,09.', "To'g'ri. 9/100 kasr 0,09 deb yoziladi.", 'Correct. 9/100 is written as 0.09.'),
    rule: b('Ноль удерживает пустой разряд и сохраняет значение соседней цифры.', 'Nol bo‘sh xonani ushlab, yonidagi raqamning o‘rnini saqlaydi.', 'Zero holds an empty place and preserves the neighbouring digit’s place.'),
  },
  {
    id: '06', level: 'yellow', kind: 'mc', skillTag: 'decimal-reading',
    visual: { type: 'story', main: b('Запись теплицы: «ноль целых и пятьдесят восемь тысячных»', 'Issiqxona qaydi: “nol butun mingdan ellik sakkiz”', 'Greenhouse log: “zero and fifty-eight thousandths”'), note: b('Опора: 58/1000.', 'Tayanch: 58/1000.', 'Support: 58/1000.') },
    setup: b('Датчик теплицы передал число словами.', 'Issiqxona sensori sonni so‘z bilan uzatdi.', 'A greenhouse sensor sent a number in words.'),
    prompt: b('Выберите его точную десятичную запись.', 'Uning aniq o‘nli yozuvini tanlang.', 'Choose its exact decimal notation.'),
    options: [
      option('fifty-eight-thousandths', '0,058', '0,058', '0.058', true),
      option('fifty-eight-hundredths', '0,58', '0,58', '0.58', false, 'Два места после разделителя обозначают сотые, а названы тысячные.', 'Ajratgichdan keyingi ikki xona yuzdan birlarni bildiradi, bu yerda mingdan birlar aytilgan.', 'Two places after the separator represent hundredths, but thousandths were named.'),
      option('five-zero-eight', '0,508', '0,508', '0.508', false, 'Эта запись содержит пятьсот восемь тысячных, а не пятьдесят восемь.', 'Bu yozuv mingdan besh yuz sakkizni bildiradi, ellik sakkizni emas.', 'This is five hundred and eight thousandths, not fifty-eight thousandths.'),
      option('fifty-eight-wholes', '58,0', '58,0', '58.0', false, 'Названо ноль целых, поэтому слева от разделителя должен быть 0.', 'Nol butun aytilgan, shuning uchun ajratgichning chapida 0 bo‘lishi kerak.', 'Zero wholes were named, so 0 must be left of the separator.'),
    ],
    secondHint: b('Тысячные требуют трёх мест после разделителя.', 'Mingdan birlar ajratgichdan keyin uchta xonani talab qiladi.', 'Thousandths require three places after the separator.'),
    thirdHint: b('Число 58 занимает сотые и тысячные; разряд десятых удерживает 0.', '58 soni yuzdan va mingdan birlar xonalarini egallaydi; o‘ndan birlar xonasini 0 ushlab turadi.', '58 occupies the hundredths and thousandths places; 0 holds the tenths place.'),
    correctText: b('Верно. Пятьдесят восемь тысячных — это 0,058.', "To'g'ri. Mingdan ellik sakkiz — 0,058.", 'Correct. Fifty-eight thousandths is 0.058.'),
    rule: b('При записи тысячных справа от разделителя сохраняют три разряда.', 'Mingdan birlarni yozishda ajratgichdan o‘ngda uchta xona saqlanadi.', 'When writing thousandths, keep three places to the right of the separator.'),
  },
  {
    id: '07', level: 'yellow', kind: 'match', skillTag: 'decimal-place-value',
    visual: { type: 'place', main: b('7,306', '7,306', '7.306'), places: [
      { label: b('Единицы', 'Birlar', 'Ones'), value: '7' },
      { label: b('Десятые', 'O‘ndan birlar', 'Tenths'), value: '3' },
      { label: b('Сотые', 'Yuzdan birlar', 'Hundredths'), value: '0' },
      { label: b('Тысячные', 'Mingdan birlar', 'Thousandths'), value: '6' },
    ], note: b('Ноль сохраняет разряд сотых.', 'Nol yuzdan birlar xonasini saqlaydi.', 'Zero holds the hundredths place.') },
    setup: b('Нужно разобрать запись 7,306 по разрядам.', '7,306 yozuvini xonalar bo‘yicha ajratish kerak.', 'Break down 7.306 by place value.'),
    prompt: b('Соедините разряд с его цифрой.', 'Xonani uning raqami bilan moslashtiring.', 'Match each place to its digit.'),
    pairs: [
      { id: 'ones', left: b('Единицы', 'Birlar', 'Ones'), correctRight: 'seven' },
      { id: 'tenths', left: b('Десятые', 'O‘ndan birlar', 'Tenths'), correctRight: 'three' },
      { id: 'hundredths', left: b('Сотые', 'Yuzdan birlar', 'Hundredths'), correctRight: 'zero' },
      { id: 'thousandths', left: b('Тысячные', 'Mingdan birlar', 'Thousandths'), correctRight: 'six' },
    ],
    right: [
      { id: 'seven', text: b('7', '7', '7') },
      { id: 'three', text: b('3', '3', '3') },
      { id: 'zero', text: b('0', '0', '0') },
      { id: 'six', text: b('6', '6', '6') },
    ],
    wrong: [b('Начните от разделителя и называйте места по порядку.', 'Ajratgichdan boshlab xonalarni tartib bilan ayting.', 'Start at the separator and name the places in order.')],
    secondHint: b('Сразу после разделителя стоит цифра десятых 3.', 'Ajratgichdan keyin darhol o‘ndan birlar raqami 3 turadi.', 'The tenths digit 3 is immediately after the separator.'),
    thirdHint: b('Слева направо: единицы 7, десятые 3, сотые 0, тысячные 6.', 'Chapdan o‘ngga: birlar 7, o‘ndan birlar 3, yuzdan birlar 0, mingdan birlar 6.', 'Left to right: ones 7, tenths 3, hundredths 0, thousandths 6.'),
    correctText: b('Верно. Все цифры связаны со своими разрядами.', "To'g'ri. Barcha raqamlar o'z xonalari bilan bog'landi.", 'Correct. Every digit is matched to its place.'),
    rule: b('Позиция цифры относительно разделителя определяет её разряд.', 'Raqamning ajratgichga nisbatan o‘rni uning xonasini belgilaydi.', 'A digit’s position relative to the separator determines its place.'),
  },
  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'mixed-decimal-boundary',
    visual: { type: 'place', main: b('8 целых и 4/1000', '8 butun va 4/1000', '8 wholes and 4/1000'), places: [
      { label: b('Единицы', 'Birlar', 'Ones'), value: '8' },
      { label: b('Десятые', 'O‘ndan birlar', 'Tenths'), value: '0' },
      { label: b('Сотые', 'Yuzdan birlar', 'Hundredths'), value: '0' },
      { label: b('Тысячные', 'Mingdan birlar', 'Thousandths'), value: '4' },
    ], note: b('Между единицами и тысячными два пустых разряда.', 'Birlar bilan mingdan birlar orasida ikkita bo‘sh xona bor.', 'There are two empty places between ones and thousandths.') },
    setup: b('Смешанная запись содержит восемь целых и четыре тысячных.', 'Aralash yozuv sakkiz butun va mingdan to‘rtni bildiradi.', 'The mixed notation contains eight wholes and four thousandths.'),
    prompt: b('Какая десятичная запись верна?', "Qaysi o'nli yozuv to'g'ri?", 'Which decimal notation is correct?'),
    options: [
      option('exact', '8,004', '8,004', '8.004', true),
      option('hundredths', '8,04', '8,04', '8.04', false, 'Здесь цифра 4 стоит в разряде сотых.', 'Bu yerda 4 yuzdan birlar xonasida turibdi.', 'Here 4 is in the hundredths place.'),
      option('tenths', '8,4', '8,4', '8.4', false, 'Здесь цифра 4 стоит в разряде десятых.', 'Bu yerda 4 o‘ndan birlar xonasida turibdi.', 'Here 4 is in the tenths place.'),
      option('wrong-whole', '0,804', '0,804', '0.804', false, 'Эта запись потеряла восемь целых.', 'Bu yozuv sakkizta butunni yo‘qotgan.', 'This notation loses the eight wholes.'),
    ],
    secondHint: b('Цифра 4 должна занять третье место после разделителя.', '4 raqami ajratgichdan keyingi uchinchi xonada turishi kerak.', 'The digit 4 must occupy the third place after the separator.'),
    thirdHint: b('Разряды десятых и сотых удерживаются двумя нулями.', 'O‘ndan va yuzdan birlar xonalari ikkita nol bilan saqlanadi.', 'Two zeros hold the tenths and hundredths places.'),
    correctText: b('Верно. Восемь целых и четыре тысячных записывают как 8,004.', "To'g'ri. Sakkiz butun mingdan to'rt 8,004 deb yoziladi.", 'Correct. Eight wholes and four thousandths is written as 8.004.'),
    rule: b('Внутренние нули нельзя пропускать: они удерживают пустые разряды.', 'Ichki nollarni tushirib qoldirib bo‘lmaydi: ular bo‘sh xonalarni saqlaydi.', 'Internal zeros cannot be omitted: they hold empty places.'),
  },
  {
    id: '09', level: 'red', kind: 'mc', skillTag: 'decimal-error-analysis',
    visual: { type: 'formula', main: b('Ошибочно: 64/1000 = 0,64', 'Xato: 64/1000 = 0,64', 'Incorrect: 64/1000 = 0.64'), note: b('Знаменатель 1000 требует разряда тысячных.', '1000 maxraj mingdan birlar xonasini talab qiladi.', 'A denominator of 1000 requires a thousandths place.') },
    setup: b('В десятичной записи дроби 64/1000 пропущен ноль, удерживающий разряд десятых.', '64/1000 kasrning o‘nli yozuvida o‘ndan birlar xonasini ushlaydigan nol tushirib qoldirilgan.', 'The decimal notation for 64/1000 is missing the zero that holds the tenths place.'),
    prompt: b('Как правильно исправить запись?', 'Yozuvni qanday to‘g‘rilash kerak?', 'How should the notation be corrected?'),
    options: [
      option('repair', '64/1000 = 0,064', '64/1000 = 0,064', '64/1000 = 0.064', true),
      option('no-error', 'Ошибки нет: 0,64', 'Xato yo‘q: 0,64', 'There is no error: 0.64', false, '0,64 обозначает шестьдесят четыре сотых, а дана дробь со знаменателем 1000.', '0,64 yuzdan oltmish to‘rtni bildiradi, berilgan kasrning maxraji esa 1000.', '0.64 means sixty-four hundredths, but the given denominator is 1000.'),
      option('trailing-zero', '0,640', '0,640', '0.640', false, 'Добавленный справа ноль не переносит 64 в разряды сотых и тысячных.', 'O‘ngga qo‘shilgan nol 64 ni yuzdan va mingdan birlar xonalariga ko‘chirmaydi.', 'A zero added on the right does not move 64 into the hundredths and thousandths places.'),
      option('whole', '64,0', '64,0', '64.0', false, 'Эта запись обозначает целые, а исходная дробь — часть одного целого.', 'Bu yozuv butunlarni bildiradi, berilgan kasr esa bitta butunning qismi.', 'This notation represents wholes, but the fraction is part of one whole.'),
    ],
    secondHint: b('Для тысячных нужны три места после разделителя.', 'Mingdan birlar uchun ajratgichdan keyin uchta xona kerak.', 'Thousandths need three places after the separator.'),
    thirdHint: b('Цифры 6 и 4 занимают сотые и тысячные; перед ними нужен 0 десятых.', '6 va 4 yuzdan va mingdan birlar xonalarida; ulardan oldin 0 o‘ndan bir kerak.', '6 and 4 occupy hundredths and thousandths; they need 0 tenths before them.'),
    correctText: b('Верно. 64/1000 записывается как 0,064.', "To'g'ri. 64/1000 kasr 0,064 deb yoziladi.", 'Correct. 64/1000 is written as 0.064.'),
    rule: b('Ноль ставят перед значащими цифрами, если старший дробный разряд пуст.', 'Katta kasr xonasi bo‘sh bo‘lsa, ma’noli raqamlardan oldin nol yoziladi.', 'Place zero before the significant digits when a higher fractional place is empty.'),
  },
  {
    id: '10', level: 'red', kind: 'mc', skillTag: 'decimal-notation-strategy',
    visual: { type: 'story', main: b('Диктофон: «четыре целых и двадцать семь тысячных»', 'Diktofon: “to‘rt butun mingdan yigirma yetti”', 'Recorder: “four and twenty-seven thousandths”'), note: b('Опора: 4 целых и 27/1000.', 'Tayanch: 4 butun va 27/1000.', 'Support: 4 wholes and 27/1000.') },
    setup: b('Нужно выбрать стратегию, которая сохраняет единицы, десятые, сотые и тысячные.', 'Birlar, o‘ndan, yuzdan va mingdan birlar xonalarini saqlaydigan strategiyani tanlash kerak.', 'Choose the strategy that preserves ones, tenths, hundredths and thousandths.'),
    prompt: b('Какая стратегия даёт точную запись?', 'Qaysi strategiya aniq yozuvni beradi?', 'Which strategy gives the exact notation?'),
    options: [
      option('strategy', 'После разделителя нужны 3 места: 0, 2, 7 → 4,027', 'Ajratgichdan keyin 3 xona kerak: 0, 2, 7 → 4,027', 'Three places are needed after the point: 0, 2, 7 → 4.027', true),
      option('two-places', 'Записать 27 сразу: 4,27', '27 ni darhol yozish: 4,27', 'Write 27 immediately: 4.27', false, 'Два места после разделителя обозначают сотые, а названы тысячные.', 'Ajratgichdan keyingi ikki xona yuzdan birlarni bildiradi, mingdan birlar aytilgan.', 'Two places after the separator represent hundredths, but thousandths were named.'),
      option('trailing-zero', 'Добавить ноль справа: 4,270', 'Nolni o‘ngga qo‘shish: 4,270', 'Add zero on the right: 4.270', false, 'Нужный ноль удерживает разряд десятых и стоит перед цифрой 2.', 'Kerakli nol o‘ndan birlar xonasini ushlab, 2 dan oldin turadi.', 'The required zero holds the tenths place and comes before 2.'),
      option('lose-whole', 'Записать только дробную часть: 0,027', 'Faqat kasr qismini yozish: 0,027', 'Write only the fractional part: 0.027', false, 'Эта запись потеряла четыре целых.', 'Bu yozuv to‘rtta butunni yo‘qotgan.', 'This notation loses the four wholes.'),
    ],
    secondHint: b('Слово «тысячных» требует трёх разрядов справа от разделителя.', '“Mingdan bir” so‘zi ajratgichdan o‘ngda uchta xonani talab qiladi.', 'The word “thousandths” requires three places to the right of the separator.'),
    thirdHint: b('В числе 27 тысячных нет десятых: этот разряд удерживает 0.', 'Mingdan 27 da o‘ndan bir yo‘q: bu xonani 0 ushlab turadi.', 'Twenty-seven thousandths has no tenths, so 0 holds that place.'),
    correctText: b('Верно. Точная запись — 4,027.', "To'g'ri. Aniq yozuv — 4,027.", 'Correct. The exact notation is 4.027.'),
    rule: b('Стратегия записи: назовите знаменатель, выделите нужное число дробных разрядов и заполните пустые разряды нулями.', 'Yozish strategiyasi: maxrajni aniqlang, kerakli kasr xonalarini ajrating va bo‘sh xonalarni nol bilan to‘ldiring.', 'Notation strategy: identify the denominator, reserve the required fractional places and fill empty places with zeros.'),
  },
];

function TaskVisual({ visual, lang }) {
  const groupItems = visual.type === 'groups'
    ? Array.from({ length: Math.min(visual.groups, 12) }, (_, index) => index)
    : [];
  const stripItems = visual.type === 'strip'
    ? Array.from({ length: visual.total }, (_, index) => index)
    : [];
  return <div className={'p4-visual p4-visual-' + visual.type}>
    <span className="p4-visual-key">{tx(UI.visualKey, lang)}</span>
    <strong className="p4-visual-main">{tx(visual.main, lang)}</strong>
    {visual.type === 'groups' && <div className="p4-groups" aria-hidden="true">
      {groupItems.map((item) => <span key={item} className={item < visual.selected ? 'is-selected' : ''}>{visual.groupSize}</span>)}
    </div>}
    {visual.type === 'strip' && <div className="p4-strip" aria-hidden="true">
      {stripItems.map((item) => <i key={item} className={item < visual.filled ? 'is-filled' : ''} />)}
    </div>}
    {visual.type === 'place' && Array.isArray(visual.places) && <div className="p4-place-chart">
      {visual.places.map((place, index) => <div key={index + '-' + tx(place.label, lang)}><small>{tx(place.label, lang)}</small><b>{tx(place.value, lang)}</b></div>)}
    </div>}
    <p>{tx(visual.note, lang)}</p>
  </div>;
}

function ChoiceInput({ task, lang, runSeed, pickedId, setPickedId, checked, correct, locked }) {
  const options = useMemo(() => shuffle(task.options, `${task.id}:${runSeed}`), [task.options, task.id, runSeed]);
  return <div className="p4-options" role="group" aria-label={tx(task.prompt, lang)}>
    {options.map((item, index) => {
      const state = checked && pickedId === item.id ? (correct ? 'ok' : 'no') : (pickedId === item.id ? 'on' : '');
      return <button key={item.id} type="button" className={`p4-option ${state ? `is-${state}` : ''}`} aria-pressed={pickedId === item.id} disabled={locked} onClick={() => setPickedId(item.id)}>
        <span className="p4-letter" aria-hidden="true">{'ABCD'[index]}</span>
        <span>{tx(item.text, lang)}</span>
      </button>;
    })}
  </div>;
}

function NumberInput({ task, lang, typed, setTyped, locked }) {
  const append = (digit) => setTyped((value) => value.length < (task.maxLen ?? 4) ? `${value}${digit}` : value);
  return <div className="p4-pad">
    <div className="p4-number-display" role="status" aria-label={tx(UI.typeAnswer, lang)}>{typed || '—'}</div>
    <div className="p4-pad-keys">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => <button key={digit} type="button" disabled={locked} onClick={() => append(digit)}>{digit}</button>)}
      <button type="button" className="p4-key-del" disabled={locked || !typed} onClick={() => setTyped((value) => value.slice(0, -1))} aria-label={tx(UI.clear, lang)}>⌫</button>
    </div>
  </div>;
}

function MatchInput({ task, lang, runSeed, pairs, setPairs, activeLeft, setActiveLeft, locked }) {
  const right = useMemo(() => shuffle(task.right, `${task.id}:${runSeed}`), [task.right, task.id, runSeed]);
  const used = new Set(Object.values(pairs));
  return <div>
    <p className="p4-interaction-hint">{tx(UI.matchHint, lang)}</p>
    <div className="p4-match">
      <div className="p4-match-col">
        {task.pairs.map((pair) => <button key={pair.id} type="button" className={activeLeft === pair.id ? 'is-active' : pairs[pair.id] ? 'is-filled' : ''} disabled={locked} onClick={() => setActiveLeft(pair.id)}>{tx(pair.left, lang)}{pairs[pair.id] ? <small>✓</small> : null}</button>)}
      </div>
      <div className="p4-match-col">
        {right.map((item) => <button key={item.id} type="button" disabled={locked || !activeLeft || (used.has(item.id) && pairs[activeLeft] !== item.id)} onClick={() => {
          if (!activeLeft) return;
          setPairs((value) => ({ ...value, [activeLeft]: item.id }));
          setActiveLeft(null);
        }}>{tx(item.text, lang)}</button>)}
      </div>
    </div>
  </div>;
}

function OrderInput({ task, lang, runSeed, placed, setPlaced, activeStep, setActiveStep, locked }) {
  const cards = useMemo(() => shuffle(task.cards, `${task.id}:${runSeed}`), [task.cards, task.id, runSeed]);
  const used = new Set(Object.values(placed));
  return <div>
    <p className="p4-interaction-hint">{tx(UI.orderHint, lang)}</p>
    <div className="p4-order-slots">
      {task.steps.map((step) => {
        const card = task.cards.find((item) => item.id === placed[step.id]);
        return <button key={step.id} type="button" className={activeStep === step.id ? 'is-active' : card ? 'is-filled' : ''} disabled={locked} onClick={() => setActiveStep(step.id)}><small>{tx(step.label, lang)}</small><strong>{card ? tx(card.text, lang) : '…'}</strong></button>;
      })}
    </div>
    <div className="p4-card-bank">
      {cards.map((card) => <button key={card.id} type="button" disabled={locked || !activeStep || (used.has(card.id) && placed[activeStep] !== card.id)} onClick={() => {
        if (!activeStep) return;
        setPlaced((value) => ({ ...value, [activeStep]: card.id }));
        setActiveStep(null);
      }}>{tx(card.text, lang)}</button>)}
    </div>
  </div>;
}

function Feedback({ task, lang, correct, attempts, picked }) {
  const pickedOption = task.options?.find((item) => item.id === picked);
  const wrongText = attempts >= 3 ? task.thirdHint : attempts >= 2 ? task.secondHint : (pickedOption?.wrong || task.wrong?.[0] || task.secondHint);
  return <div className={`p4-feedback p4-fb ${correct ? 'is-ok' : 'is-no'}`} role="status" aria-live="polite" aria-atomic="true">
    <p className="p4-fb-txt"><strong>{correct ? tx(task.correctText, lang) : tx(wrongText, lang)}</strong></p>
    {correct && <p className="p4-rule"><b>{tx(UI.remember, lang)}:</b> {tx(task.rule, lang)}</p>}
  </div>;
}

function PracticeTask({ task, index, lang, runSeed, onSolved }) {
  const [pickedId, setPickedId] = useState(null);
  const [typed, setTyped] = useState('');
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [placed, setPlaced] = useState({});
  const [activeStep, setActiveStep] = useState(null);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const advancedRef = useRef(false);
  const feedbackRef = useRef(null);

  useEffect(() => {
    if (checked) feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [checked, attempts]);

  const responseReady = task.kind === 'mc' || task.kind === 'card'
    ? pickedId !== null
    : task.kind === 'numpad' || task.kind === 'missing'
      ? typed !== ''
      : task.kind === 'match'
        ? Object.keys(pairs).length === task.pairs.length
        : Object.keys(placed).length === task.steps.length;

  const responseCorrect = () => {
    if (task.kind === 'mc' || task.kind === 'card') return task.options.find((item) => item.id === pickedId)?.correct === true;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed === String(task.answer);
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    return task.steps.every((step) => placed[step.id] === step.correct);
  };

  const resetResponse = () => {
    setPickedId(null); setTyped(''); setPairs({}); setActiveLeft(null); setPlaced({}); setActiveStep(null); setChecked(false);
  };

  const check = () => {
    if (!responseReady || solved) return;
    const nextAttempts = attempts + 1;
    const correct = responseCorrect();
    setAttempts(nextAttempts); setChecked(true);
    if (correct) setSolved(true);
  };

  const answerSnapshot = () => {
    if (task.kind === 'mc' || task.kind === 'card') {
      const chosen = task.options.find((item) => item.id === pickedId);
      const correct = task.options.find((item) => item.correct);
      return { studentAnswerId: pickedId, studentAnswer: tx(chosen?.text, lang), correctAnswerId: correct?.id, correctAnswer: tx(correct?.text, lang) };
    }
    if (task.kind === 'numpad' || task.kind === 'missing') return { studentAnswer: typed, correctAnswer: String(task.answer) };
    if (task.kind === 'match') return { studentAnswer: { ...pairs }, correctAnswer: Object.fromEntries(task.pairs.map((pair) => [pair.id, pair.correctRight])) };
    return { studentAnswer: { ...placed }, correctAnswer: Object.fromEntries(task.steps.map((step) => [step.id, step.correct])) };
  };

  const advance = () => {
    if (!solved || advancedRef.current) return;
    advancedRef.current = true;
    onSolved({
      taskId: task.id, screenId: SCREEN_META[index].id, level: task.level, kind: task.kind,
      skillTag: task.skillTag, correct: true, attempts, firstTry: attempts === 1,
      setup: task.setup, prompt: task.prompt, ...answerSnapshot(),
      choices: task.options?.map((item) => ({ id: item.id, text: item.text, correct: item.correct })) ?? null,
      screenMeta: SCREEN_META[index],
    });
  };

  return <section className="p4-card" aria-labelledby={`p4-task-${task.id}`}>
    <div className="p4-task-top"><span aria-label={`${tx(UI.task, lang)} ${index + 1}/10`}>{index + 1}/10</span><span className={`p4-level is-${task.level}`}>{tx(UI.level[task.level], lang)}</span></div>
    <h2 id={`p4-task-${task.id}`}>{tx(task.prompt, lang)}</h2>
    <p className="p4-setup">{tx(task.setup, lang)}</p>
    <TaskVisual visual={task.visual} lang={lang} />
    {(task.kind === 'mc' || task.kind === 'card') && <ChoiceInput task={task} lang={lang} runSeed={runSeed} pickedId={pickedId} setPickedId={(value) => { setPickedId(value); setChecked(false); }} checked={checked} correct={solved} locked={solved} />}
    {(task.kind === 'numpad' || task.kind === 'missing') && <NumberInput task={task} lang={lang} typed={typed} setTyped={(value) => { setTyped(value); setChecked(false); }} locked={solved} />}
    {task.kind === 'match' && <MatchInput task={task} lang={lang} runSeed={runSeed} pairs={pairs} setPairs={(value) => { setPairs(value); setChecked(false); }} activeLeft={activeLeft} setActiveLeft={setActiveLeft} locked={solved} />}
    {task.kind === 'order' && <OrderInput task={task} lang={lang} runSeed={runSeed} placed={placed} setPlaced={(value) => { setPlaced(value); setChecked(false); }} activeStep={activeStep} setActiveStep={setActiveStep} locked={solved} />}
    {checked && <div ref={feedbackRef}><Feedback task={task} lang={lang} correct={solved} attempts={attempts} picked={pickedId} /></div>}
    <div className="p4-actions">
      {!solved && !checked && <button type="button" className="p4-btn" disabled={!responseReady} onClick={check}>{tx(UI.check, lang)}</button>}
      {!solved && checked && <button type="button" className="p4-btn p4-btn-ghost" onClick={resetResponse}>{tx(UI.retry, lang)}</button>}
      {solved && <button type="button" className="p4-btn p4-btn-ready" onClick={advance}>{index === 9 ? tx(UI.finish, lang) : tx(UI.next, lang)}</button>}
    </div>
  </section>;
}

function ResultScreen({ lang, firstTryCorrect, onRestart }) {
  return <section className="p4-card p4-done" role="status" aria-live="polite">
    <div className="p4-result-mark" aria-hidden="true">10/10</div>
    <h2>{tx(UI.done, lang)}</h2>
    <p>{tx(UI.allSolved, lang)}</p>
    <strong>{firstTryCorrect}/10 — {tx(UI.firstTry, lang)}</strong>
    <button type="button" className="p4-btn p4-btn-ready" onClick={onRestart}>{tx(UI.again, lang)}</button>
  </section>;
}

export default function Grade4Dars24Practice({ studentName, lang: langProp, onFinished }) {
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = normalizeLang(langProp ?? previewLang);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [runId, setRunId] = useState(0);
  const finishedRef = useRef(false);
  const startedAtRef = useRef(0);

  useEffect(() => {
    if (!startedAtRef.current) startedAtRef.current = Date.now();
  }, []);

  const completeTask = (record) => {
    if (finishedRef.current) return;
    const nextAnswers = [...answers, record];
    const nextFirstTry = firstTryCorrect + (record.firstTry ? 1 : 0);
    setAnswers(nextAnswers);
    setFirstTryCorrect(nextFirstTry);
    if (index < TASKS.length - 1) {
      setIndex((value) => value + 1);
      return;
    }
    finishedRef.current = true;
    setFinished(true);
    // Completion is a user-event boundary; reading the wall clock here is intentional.
    // eslint-disable-next-line react-hooks/purity
    const durationSec = Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000));
    const attemptsTotal = nextAnswers.reduce((sum, item) => sum + item.attempts, 0);
    const levelBreakdown = Object.fromEntries(['green', 'yellow', 'red'].map((level) => {
      const rows = nextAnswers.filter((item) => item.level === level);
      const firstTry = rows.filter((item) => item.firstTry).length;
      return [level, { total: rows.length, solved: rows.filter((item) => item.correct).length, firstTry, firstTryCorrect: firstTry, attempts: rows.reduce((sum, item) => sum + item.attempts, 0) }];
    }));
    const scorePercent = Math.round((nextFirstTry / TASKS.length) * 100);
    onFinished?.({
      lessonId: LESSON_META.lessonId, lessonTitle: tx(LESSON_META.lessonTitle, lang), lessonTitleLocalized: LESSON_META.lessonTitle,
      studentName: studentName ?? null, grade: LESSON_META.grade, lessonNumber: LESSON_META.lessonNumber,
      activityType: LESSON_META.activityType, lang, assessment: true, completed: true,
      totalQuestions: TASKS.length, answeredQuestions: nextAnswers.length, correctAnswers: nextFirstTry,
      firstTryCorrect: nextFirstTry, scorePercent, finalScore: nextFirstTry, finalTotal: TASKS.length,
      passed: nextFirstTry >= 6, firstTryStats: { total: TASKS.length, firstTryCorrect: nextFirstTry, correct: nextFirstTry, answered: nextAnswers.length, scorePercent },
      attemptsTotal, durationSec, skillTags: [...new Set(TASKS.map((task) => task.skillTag))],
      levelBreakdown, lessonMeta: LESSON_META, screenMeta: SCREEN_META, answers: nextAnswers,
    });
  };

  const restart = () => {
    finishedRef.current = false; startedAtRef.current = Date.now(); setIndex(0); setAnswers([]); setFirstTryCorrect(0); setFinished(false); setRunId((value) => value + 1);
  };

  return <div className="p4-root">
    <style>{CSS}</style>
    <main className="p4-main">
      <header className="p4-header">
        <div><span className="p4-kicker">4 · 24</span><h1>{tx(UI.title, lang)}</h1></div>
        {langProp === undefined && <div className="p4-lang" role="group" aria-label={tx(UI.language, lang)}>
          {SUPPORTED_LANGS.map((code) => <button key={code} type="button" className={lang === code ? 'is-active' : ''} aria-pressed={lang === code} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}
        </div>}
      </header>
      <div className="p4-progress" role="progressbar" aria-valuemin="1" aria-valuemax="10" aria-valuenow={finished ? 10 : index + 1}><i style={{ width: `${finished ? 100 : (index + 1) * 10}%` }} /></div>
      {finished ? <ResultScreen lang={lang} firstTryCorrect={firstTryCorrect} onRestart={restart} /> : <PracticeTask key={`${runId}-${TASKS[index].id}`} task={TASKS[index]} index={index} lang={lang} runSeed={runId} onSolved={completeTask} />}
    </main>
  </div>;
}

const CSS = `
.p4-root{position:relative;min-height:100dvh;overflow-x:clip;padding:46px 0 16px;font-family:'Manrope',system-ui,sans-serif;color:${T.ink};background:${T.bg}}
.p4-root *,.p4-root *::before,.p4-root *::after{box-sizing:border-box}
.p4-root button,.p4-root select{min-width:44px;min-height:44px}
.p4-main{width:min(100%,720px);margin:0 auto;padding:0 clamp(12px,4vw,24px)}
.p4-header{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:8px}
.p4-header>div{min-width:0}
.p4-header h1{margin:4px 0 0;font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(16px,2.4vw,20px);line-height:1.2}
.p4-kicker{display:inline-flex;padding:3px 8px;border-radius:99px;background:${T.accentSoft};color:${T.accent};font:800 10px 'JetBrains Mono',monospace}
.p4-lang{position:absolute;top:8px;right:8px;display:flex;gap:6px;z-index:5}
.p4-lang button{min-width:44px;min-height:44px;border:0;border-radius:99px;background:${T.paper};color:${T.ink2};font:800 11px 'Manrope',system-ui,sans-serif;cursor:pointer;box-shadow:0 4px 12px -8px rgba(23,59,82,.4)}
.p4-lang button.is-active{background:${T.accent};color:#fff}
.p4-progress{height:6px;margin-bottom:10px;overflow:hidden;border-radius:99px;background:rgba(23,59,82,.12)}
.p4-progress i{display:block;height:100%;background:linear-gradient(90deg,${T.cyan},${T.accent});transition:width .4s ease}
.p4-card{display:flex;flex-direction:column;gap:9px;width:100%;padding:0;border:0;background:transparent;box-shadow:none}
.p4-task-top{display:flex;align-items:center;justify-content:space-between;gap:10px;color:${T.accent};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
.p4-level{padding:0;border:0;border-radius:0;background:transparent;color:${T.accent}}
.p4-card h2{margin:0;font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(17px,2.6vw,21px);line-height:1.25}
.p4-setup{margin:0;color:${T.ink2};font-size:clamp(13px,2vw,15px);line-height:1.45}
.p4-visual{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;width:100%;min-height:96px;padding:12px 10px;overflow:hidden;border:0;border-radius:16px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08);text-align:center}
.p4-visual-key{color:${T.cyan};font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.p4-visual-main{color:${T.navy};font:800 clamp(18px,3.5vw,27px) 'JetBrains Mono',monospace}
.p4-visual p{margin:0;color:${T.ink2};font-size:12px;line-height:1.35}
.p4-groups{display:flex;flex-wrap:wrap;justify-content:center;gap:5px}
.p4-groups span{display:grid;place-items:center;min-width:34px;height:34px;border:0;border-radius:10px;background:${T.cyanSoft};color:${T.navy};font:800 12px 'JetBrains Mono',monospace;box-shadow:inset 0 0 0 1px rgba(22,143,163,.18)}
.p4-groups span.is-selected{background:${T.accentSoft};color:${T.accent};box-shadow:inset 0 0 0 1.5px rgba(255,91,53,.34)}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.p4-option{display:flex;align-items:center;gap:9px;min-height:56px;padding:10px 12px;border:1px solid rgba(23,59,82,.12);border-radius:14px;background:${T.paper};color:${T.ink};font:700 clamp(13px,1.9vw,15px)/1.35 'Manrope',system-ui,sans-serif;text-align:left;cursor:pointer;transition:transform .16s,border-color .2s,background .2s}
.p4-option:hover:not(:disabled){border-color:rgba(22,143,163,.4);transform:translateY(-2px)}
.p4-option:disabled{cursor:default}
.p4-letter{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:8px;background:${T.cyanSoft};color:${T.cyan};font:800 11px 'JetBrains Mono',monospace}
.p4-option.is-on{border-color:${T.accent};background:${T.accentSoft}}
.p4-option.is-ok{border-color:rgba(34,122,83,.4);background:${T.successSoft};color:${T.success}}
.p4-option.is-ok .p4-letter{background:${T.success};color:#fff}
.p4-option.is-no{border-color:rgba(169,111,19,.4);background:${T.warnSoft};color:${T.warn}}
.p4-option.is-no .p4-letter{background:${T.warn};color:#fff}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:7px;width:min(240px,100%);margin:0 auto;padding:10px;border-radius:18px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8);box-shadow:inset 0 1px rgba(255,255,255,.9)}
.p4-number-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:48px;border:2px solid ${T.accent};border-radius:13px;background:${T.paper};color:${T.navy};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;letter-spacing:2px}
.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;width:100%}
.p4-pad-keys button{min-width:44px;min-height:44px;border:1px solid rgba(23,59,82,.16);border-radius:12px;background:${T.paper};color:${T.navy};font:800 clamp(17px,3.6vw,21px) 'JetBrains Mono',monospace;cursor:pointer}
.p4-pad-keys button:hover:not(:disabled){border-color:${T.cyan}}
.p4-pad-keys .p4-key-del{grid-column:span 3;background:${T.accentSoft};color:${T.accent}}
.p4-interaction-hint{margin:0;color:${T.ink3};font-size:12px;line-height:1.35;text-align:center}
.p4-match{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.p4-match-col{display:flex;flex-direction:column;gap:7px}
.p4-match button{display:flex;align-items:center;justify-content:space-between;gap:6px;min-height:46px;padding:7px 9px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:800 clamp(11px,2vw,14px)/1.25 'Manrope',system-ui,sans-serif;text-align:left;cursor:pointer}
.p4-match button.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-match button.is-filled{border-color:rgba(34,122,83,.35);background:${T.successSoft}}
.p4-match small{color:${T.success};font-size:13px}
.p4-order-slots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}
.p4-order-slots button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:68px;padding:6px;border:1px solid rgba(23,59,82,.12);border-radius:13px;background:${T.paper};color:${T.ink2};font-family:'Manrope',system-ui,sans-serif;cursor:pointer}
.p4-order-slots button.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-order-slots button.is-filled{border-color:rgba(34,122,83,.35);background:${T.successSoft}}
.p4-order-slots small{font-size:10px;font-weight:800}
.p4-order-slots strong{color:${T.navy};font:800 12px/1.25 'JetBrains Mono',monospace}
.p4-card-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-top:7px}
.p4-card-bank button{min-width:88px;min-height:44px;padding:7px 10px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:800 12px 'JetBrains Mono',monospace;cursor:pointer;box-shadow:0 5px 14px -12px rgba(23,59,82,.7)}
.p4-card-bank button:hover:not(:disabled){border-color:${T.cyan}}
button:disabled{opacity:.48;cursor:not-allowed;transform:none!important}
.p4-fb{padding:12px 14px;border-radius:14px}
.p4-fb.is-ok{background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}
.p4-fb.is-no{background:${T.warnSoft};box-shadow:inset 4px 0 0 ${T.warn}}
.p4-fb-txt{margin:0;font:clamp(14px,2.1vw,16px)/1.45 'Source Serif 4',Georgia,serif}
.p4-fb.is-ok .p4-fb-txt{color:#1B6644}
.p4-fb.is-no .p4-fb-txt{color:#8A5C10}
.p4-rule{margin:8px 0 0;color:${T.ink2};font:13px/1.4 'Manrope',system-ui,sans-serif}
.p4-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px}
.p4-btn{min-width:44px;min-height:46px;padding:9px 20px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font:800 14px 'Manrope',system-ui,sans-serif;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5),inset 0 0 0 1px rgba(255,91,53,.2)}
.p4-btn:disabled{opacity:.45;box-shadow:none}
.p4-btn-ready{background:${T.accent};color:#fff}
.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}
.p4-root button:focus-visible,.p4-root select:focus-visible{outline:3px solid rgba(22,143,163,.45);outline-offset:3px}
.p4-done{align-items:center;gap:9px;padding:20px 12px;text-align:center}
.p4-done h2{margin:0;font-family:'Source Serif 4',Georgia,serif;font-size:clamp(19px,3vw,24px)}
.p4-done p{margin:0;color:${T.ink2}}
.p4-result-mark{color:${T.success};font:800 clamp(32px,7vw,44px) 'JetBrains Mono',monospace}
.p4-strip{display:grid;grid-template-columns:repeat(10,minmax(18px,1fr));gap:4px;width:min(100%,520px)}
.p4-strip i{height:34px;border:0;border-radius:8px;background:${T.cyanSoft};box-shadow:inset 0 0 0 1px rgba(22,143,163,.18)}
.p4-strip i.is-filled{background:${T.cyan};box-shadow:inset 0 0 0 1px rgba(23,59,82,.12)}
.p4-place-chart{display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:6px;width:min(100%,620px)}
.p4-place-chart>div{display:grid;gap:4px;padding:7px;border-radius:12px;background:#FBFBF8;box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}
.p4-place-chart small{min-height:2em;color:${T.ink3};font-size:9px;font-weight:700}
.p4-place-chart b{display:grid;place-items:center;min-height:38px;border-radius:10px;background:${T.paper};color:${T.navy};font:800 20px 'JetBrains Mono',monospace;box-shadow:inset 0 0 0 1.5px rgba(23,59,82,.14)}
@media(max-width:520px){
  .p4-root{padding:42px 0 8px}
  .p4-main{padding:0 7px}
  .p4-header{align-items:center;gap:6px;margin-bottom:5px}
  .p4-header h1{font-size:15px;line-height:1.1}
  .p4-kicker{display:none}
  .p4-lang{top:4px;right:4px;gap:4px}
  .p4-progress{margin-bottom:6px}
  .p4-card{gap:5px}
  .p4-card h2{font-size:15px;line-height:1.15}
  .p4-setup{font-size:11px;line-height:1.2}
  .p4-task-top{font-size:9px}
  .p4-visual{min-height:70px;gap:3px;padding:7px 6px}
  .p4-visual-key{font-size:8px}
  .p4-visual-main{font-size:14px}
  .p4-visual p{font-size:10px;line-height:1.15}
  .p4-groups{gap:3px}
  .p4-groups span{min-width:27px;height:27px;font-size:10px}
  .p4-options{grid-template-columns:repeat(2,minmax(0,1fr));gap:4px}
  .p4-option{min-height:44px;padding:4px 6px;font-size:11px;line-height:1.15}
  .p4-interaction-hint{display:none}
  .p4-match{gap:5px}
  .p4-match-col{gap:3px}
  .p4-match button{min-height:44px;padding:4px 5px;font-size:10px}
  .p4-order-slots{gap:3px}
  .p4-order-slots button{min-height:50px;padding:3px}
  .p4-order-slots small{font-size:8px}
  .p4-order-slots strong{font-size:10px}
  .p4-card-bank{gap:4px;margin-top:3px}
  .p4-card-bank button{min-width:68px;padding:4px;font-size:10px}
  .p4-pad{width:min(320px,100%);gap:5px;padding:6px}
  .p4-number-display{min-height:44px;font-size:21px}
  .p4-pad-keys{grid-template-columns:repeat(5,1fr);gap:4px}
  .p4-pad-keys button{font-size:17px}
  .p4-pad-keys .p4-key-del{grid-column:span 5}
  .p4-fb{padding:7px 9px}
  .p4-fb-txt{font-size:11px;line-height:1.25}
  .p4-rule{margin-top:3px;font-size:10px;line-height:1.25}
  .p4-btn{min-height:44px;padding:7px 14px;font-size:12px}
  .p4-done{padding:20px 8px}
  .p4-strip i{height:25px}
  .p4-place-chart{grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:3px}
  .p4-place-chart>div{gap:2px;padding:3px}
  .p4-place-chart small{font-size:8px}
  .p4-place-chart b{min-height:29px;font-size:15px}
}
@media(prefers-reduced-motion:reduce){
  .p4-root *,.p4-root *::before,.p4-root *::after{scroll-behavior:auto!important;transition:none!important;animation:none!important}
}
`;
