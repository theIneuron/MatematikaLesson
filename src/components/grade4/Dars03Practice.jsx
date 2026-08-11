// ============================================================================
// 4-SINF · Dars 3 amaliyoti — Ko'p xonali sonning xona tarkibi
// Dars01Practice vizual/texnik etaloni asosida: 10 topshiriq, RU/UZ, ovozsiz.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

const T = {
  bg: '#F5F5F0', paper: '#FFFFFF', ink: '#12212C', ink2: '#50616D', ink3: '#87949D',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', success: '#227A53', successSoft: '#E7F3EC', warn: '#A96F13', warnSoft: '#FFF5D9',
};

const UI = {
  title: { ru: 'Урок 3. Практика: разрядный состав числа', uz: "3-dars. Amaliyot: sonning xona tarkibi", en: 'Lesson 3. Practice: place-value composition' },
  task: { ru: 'Задание', uz: 'Topshiriq' , en: "Task"}, check: { ru: 'Проверить', uz: 'Tekshirish' , en: "Check"},
  next: { ru: 'Следующее', uz: 'Keyingisi' , en: "Next"}, again: { ru: 'Пройти заново', uz: 'Qaytadan', en: 'Start again' },
  rule: { ru: 'Запомни', uz: 'Eslab qoling' , en: "Remember"}, retry: { ru: 'Проверить ещё раз', uz: 'Yana bir tekshiring' , en: "Check again"},
  chooseGap: { ru: 'Нажми на место границы между классами', uz: 'Sinflar chegarasi joyiga bosing' , en: "Tap where the boundary between the three-digit groups belongs"},
  typeAnswer: { ru: 'Набери ответ', uz: 'Javobni kiriting' , en: "Enter your answer"}, clear: { ru: 'Стереть', uz: "O'chirish", en: 'Clear' },
  matchHint: { ru: 'Сначала выбери строку слева, затем пару справа', uz: "Avval chapdagi qatorni, keyin o'ngdagi juftini tanlang" , en: "First choose a row on the left, then its match on the right"},
  done: { ru: 'Практика пройдена', uz: 'Amaliyot tugadi' , en: "Practice complete"}, ofTen: { ru: 'из 10', uz: '10 dan' , en: "out of 10"},
};

const LESSON_META = {
  lessonId: 'num-4-03-practice',
  lessonTitle: UI.title,
  skillTags: ['place-value', 'expanded-form', 'digit-value'],
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
    id: '01', kind: 'mc', level: '🟢', figure: '682 314',
    setup: { ru: 'Две одинаковые цифры могут иметь разные значения.', uz: "Bir xil raqamlar turli qiymatga ega bo'lishi mumkin.", en: 'Two identical digits can have different values.' },
    prompt: { ru: 'Каково значение цифры 8?', uz: '8 raqamining qiymati qancha?', en: 'What is the value of the digit 8?' },
    options: [
      { text: { ru: '80 000', uz: '80 000' , en: "80 000"}, correct: true },
      { text: { ru: '8 000', uz: '8 000' , en: "8 000"}, wrong: { ru: 'Такое значение было бы у цифры в разряде тысяч. Здесь справа от 8 четыре цифры.', uz: "Bu qiymat minglar xonasidagi raqamga tegishli bo'lardi. Bu yerda 8 dan o'ngda to'rtta raqam bor.", en: 'That would be the value of a digit in the thousands place. Here, there are four digits to the right of 8.' } },
      { text: { ru: '800', uz: '800' , en: "800"}, wrong: { ru: 'Сотни находятся в третьем месте справа. Цифра 8 стоит левее.', uz: "Yuzlar o'ngdan uchinchi o'rinda turadi. 8 raqami undan chapda.", en: 'The hundreds place is third from the right. The digit 8 is farther to the left.' } },
      { text: { ru: '8', uz: '8' , en: "8"}, wrong: { ru: 'Это сама цифра, а не её разрядное значение.', uz: "Bu raqamning o'zi, uning xona qiymati emas.", en: 'That is the digit itself, not its place value.' } },
    ],
    correctText: { ru: 'Верно. Цифра 8 стоит в десятках тысяч и означает 80 000.', uz: "To'g'ri. 8 raqami o'n minglar xonasida turib, 80 000 ni bildiradi.", en: 'Correct. The digit 8 is in the ten-thousands place and means 80,000.' },
    rule: { ru: 'Значение цифры определяется её местом в числе.', uz: "Raqamning qiymati uning sondagi o'rniga bog'liq.", en: "A digit's value is determined by its position in the number." },
  },
  {
    id: '02', kind: 'placepick', level: '🟢', figure: '357 206',
    setup: { ru: 'Найди нужный разряд в таблице числа.', uz: 'Son jadvalidan kerakli xonani toping.', en: 'Find the required place in the number table.' },
    prompt: { ru: 'Нажми цифру, которая означает 50 000.', uz: '50 000 ni bildiradigan raqamni bosing.', en: 'Tap the digit that represents 50,000.' },
    places: [
      { digit: '3', label: { ru: 'сотни тысяч', uz: 'yuz minglar' , en: "hundred thousands"}, wrong: { ru: 'Цифра 3 означает 300 000. Нужны десятки тысяч.', uz: "3 raqami 300 000 ni bildiradi. O'n minglar xonasi kerak.", en: 'The digit 3 represents 300,000. You need the ten-thousands place.' } },
      { digit: '5', label: { ru: 'десятки тысяч', uz: "o'n minglar" , en: "ten thousands"}, correct: true },
      { digit: '7', label: { ru: 'тысячи', uz: 'minglar', en: 'thousands' }, wrong: { ru: 'Цифра 7 означает 7 000. Посмотри на разряд слева.', uz: "7 raqami 7 000 ni bildiradi. Chapdagi xonaga qarang.", en: 'The digit 7 represents 7,000. Look at the place to its left.' } },
      { digit: '2', label: { ru: 'сотни', uz: 'yuzlar', en: 'hundreds' }, wrong: { ru: 'Цифра 2 находится в классе единиц и означает 200.', uz: "2 raqami birlar sinfida turib, 200 ni bildiradi.", en: 'The digit 2 is in the ones period and represents 200.' } },
      { digit: '0', label: { ru: 'десятки', uz: "o'nlar" , en: "tens"}, wrong: { ru: 'В десятках стоит ноль. Нужен разряд десятков тысяч.', uz: "O'nlar xonasida nol turibdi. O'n minglar xonasi kerak.", en: 'There is a zero in the tens place. You need the ten-thousands place.' } },
      { digit: '6', label: { ru: 'единицы', uz: 'birlar' , en: "ones"}, wrong: { ru: 'Цифра 6 означает шесть единиц.', uz: '6 raqami olti birlikni bildiradi.', en: 'The digit 6 represents six ones.' } },
    ],
    correctText: { ru: 'Верно. Цифра 5 стоит в десятках тысяч и означает 50 000.', uz: "To'g'ri. 5 raqami o'n minglar xonasida turib, 50 000 ni bildiradi.", en: 'Correct. The digit 5 is in the ten-thousands place and represents 50,000.' },
    rule: { ru: 'Сначала назови разряд, затем вычисляй значение цифры.', uz: "Avval xonani ayting, keyin raqam qiymatini aniqlang.", en: "Name the place first, then determine the digit's value." },
  },
  {
    id: '03', kind: 'match', level: '🟡', figure: '406 281',
    setup: { ru: 'Свяжи цифру с её значением в числе.', uz: "Raqamni sondagi qiymati bilan bog'lang.", en: 'Match each digit to its value in the number.' },
    prompt: { ru: 'Собери правильные пары.', uz: "To'g'ri juftliklarni tuzing." , en: "Make the correct pairs."},
    pairs: [
      { id: 'a', left: { ru: 'цифра 4', uz: '4 raqami', en: 'digit 4' }, right: { ru: '400 000', uz: '400 000' , en: "400 000"} },
      { id: 'b', left: { ru: 'цифра 6', uz: '6 raqami', en: 'digit 6' }, right: { ru: '6 000', uz: '6 000' , en: "6 000"} },
      { id: 'c', left: { ru: 'цифра 8', uz: '8 raqami', en: 'digit 8' }, right: { ru: '80', uz: '80' , en: "80"} },
    ],
    wrongText: { ru: 'Проверь первую неверную пару: посчитай, сколько цифр стоит справа от выбранной цифры.', uz: "Birinchi noto'g'ri juftlikni tekshiring: tanlangan raqamdan o'ngda nechta raqam borligini sanang.", en: 'Check the first incorrect pair: count how many digits are to the right of the chosen digit.' },
    correctText: { ru: 'Верно. Одинаковая цифра меняет значение при переходе в другой разряд.', uz: "To'g'ri. Raqam boshqa xonaga o'tganda uning qiymati o'zgaradi.", en: 'Correct. The same digit changes value when it moves to a different place.' },
    rule: { ru: 'Каждый шаг влево увеличивает значение цифры в десять раз.', uz: "Chapga har bir qadam raqam qiymatini o'n marta oshiradi." , en: "Each step to the left makes the value of the digit ten times greater."},
  },
  {
    id: '04', kind: 'numpad', level: '🟡', answer: '723409', maxLen: 6, figure: '700 000 + 20 000 + 3 000 + 400 + 9',
    setup: { ru: 'Собери число из разрядных слагаемых.', uz: "Sonni xona qo'shiluvchilaridan tuzing." , en: "Build the number from its place-value parts."},
    prompt: { ru: 'Какое число получится?', uz: "Qaysi son hosil bo'ladi?", en: 'Which number is formed?' },
    hints: [
      { ru: 'Расположи слагаемые от сотен тысяч до единиц и сохрани пустой разряд десятков.', uz: "Qo'shiluvchilarni yuz minglardan birlargacha joylashtiring va bo'sh o'nlar xonasini saqlang.", en: 'Arrange the parts from hundred thousands to ones and keep the empty tens place.' },
      { ru: 'Последние три разряда — 409, потому что десятков нет.', uz: "Oxirgi uchta xona 409, chunki o'nliklar yo'q.", en: 'The last three places are 409 because there are no tens.' },
    ],
    correctText: { ru: 'Верно: 723 409. Пустой разряд десятков занял ноль.', uz: "To'g'ri: 723 409. Bo'sh o'nlar xonasini nol egalladi.", en: 'Correct: 723,409. Zero holds the empty tens place.' },
    rule: { ru: 'При сборке числа каждому разряду сохраняй отдельное место.', uz: "Sonni tuzishda har bir xona uchun alohida o'rin saqlang.", en: 'When building a number, keep a separate position for every place.' },
  },
  {
    id: '05', kind: 'numpad', level: '🟡', answer: '5000', maxLen: 4, figure: '905 070 = 900 000 + □ + 70',
    setup: { ru: 'В разложении пропущено одно слагаемое.', uz: "Yoyiq yozuvda bitta qo'shiluvchi tushib qolgan.", en: 'One term is missing from the expanded form.' },
    prompt: { ru: 'Какое значение нужно вернуть?', uz: 'Qaysi qiymatni qaytarish kerak?', en: 'Which value is missing?' },
    hints: [
      { ru: 'Найди ненулевую цифру, которой ещё нет среди слагаемых.', uz: "Qo'shiluvchilarda hali yo'q noldan farqli raqamni toping.", en: 'Find the non-zero digit that is not yet represented by a term.' },
      { ru: 'Цифра 5 стоит в разряде тысяч, поэтому означает 5 000.', uz: '5 raqami minglar xonasida turib, 5 000 ni bildiradi.', en: 'The digit 5 is in the thousands place, so it represents 5,000.' },
    ],
    correctText: { ru: 'Верно. Пропущенное слагаемое — 5 000.', uz: "To'g'ri. Tushib qolgan qo'shiluvchi 5 000.", en: 'Correct. The missing term is 5,000.' },
    rule: { ru: 'В развёрнутую запись входят значения всех ненулевых цифр.', uz: "Yoyiq yozuvga barcha noldan farqli raqamlarning qiymati kiradi.", en: 'Expanded form includes the values of all non-zero digits.' },
  },
  {
    id: '06', kind: 'mc', level: '🟡', figure: '241 608',
    setup: { ru: 'Датчик сообщает код городского участка.', uz: "Sensor shahar hududi kodini ko'rsatdi.", en: 'The sensor displays a city-area code.' },
    prompt: { ru: 'Что означает цифра 4 в этом коде?', uz: 'Bu koddagi 4 raqami nimani bildiradi?', en: 'What does the digit 4 represent in this code?' },
    options: [
      { text: { ru: '40 000', uz: '40 000' , en: "40 000"}, correct: true },
      { text: { ru: '4 000', uz: '4 000' , en: "4 000"}, wrong: { ru: 'Это значение разряда тысяч. Цифра 4 стоит на один разряд левее.', uz: "Bu minglar xonasining qiymati. 4 raqami undan bir xona chapda turibdi.", en: 'That is a value in the thousands place. The digit 4 is one place farther left.' } },
      { text: { ru: '400', uz: '400' , en: "400"}, wrong: { ru: 'Сотни находятся в правом классе. Цифра 4 — в классе тысяч.', uz: "Yuzlar o'ng sinfda joylashadi. 4 raqami minglar sinfida.", en: 'Hundreds are in the period on the right. The digit 4 is in the thousands period.' } },
      { text: { ru: '4', uz: '4' , en: "4"}, wrong: { ru: 'Названа цифра, но не её значение в числе.', uz: "Raqam aytildi, ammo uning sondagi qiymati emas.", en: 'That names the digit, but not its value in the number.' } },
    ],
    correctText: { ru: 'Верно. Цифра 4 находится в десятках тысяч и означает 40 000.', uz: "To'g'ri. 4 raqami o'n minglar xonasida turib, 40 000 ni bildiradi.", en: 'Correct. The digit 4 is in the ten-thousands place and represents 40,000.' },
    rule: { ru: 'Разрядное значение равно цифре, умноженной на стоимость её места.', uz: "Xona qiymati raqam bilan uning o'rin qiymati ko'paytmasiga teng.", en: 'Place value equals the digit multiplied by the value of its position.' },
  },
  {
    id: '07', kind: 'match', level: '🟡',
    setup: { ru: 'Переведи числа из стандартной записи в развёрнутую.', uz: "Sonlarni odatiy yozuvdan yoyiq yozuvga o'tkazing.", en: 'Convert the numbers from standard form to expanded form.' },
    prompt: { ru: 'Соедини равные записи.', uz: 'Teng yozuvlarni moslashtiring.', en: 'Match the equivalent forms.' },
    pairs: [
      { id: 'a', left: { ru: '608 205', uz: '608 205' , en: "608 205"}, right: { ru: '600 000 + 8 000 + 200 + 5', uz: '600 000 + 8 000 + 200 + 5' , en: "600 000 + 8 000 + 200 + 5"} },
      { id: 'b', left: { ru: '390 041', uz: '390 041' , en: "390 041"}, right: { ru: '300 000 + 90 000 + 40 + 1', uz: '300 000 + 90 000 + 40 + 1' , en: "300 000 + 90 000 + 40 + 1"} },
      { id: 'c', left: { ru: '720 600', uz: '720 600' , en: "720 600"}, right: { ru: '700 000 + 20 000 + 600', uz: '700 000 + 20 000 + 600' , en: "700 000 + 20 000 + 600"} },
    ],
    wrongText: { ru: 'Проверь первую неверную пару по старшему ненулевому разряду и местам нулей.', uz: "Birinchi noto'g'ri juftlikni katta noldan farqli xona va nollar o'rni bo'yicha tekshiring.", en: 'Check the first incorrect pair using the highest non-zero place and the positions of the zeros.' },
    correctText: { ru: 'Верно. Каждое слагаемое вернулось в свой разряд.', uz: "To'g'ri. Har bir qo'shiluvchi o'z xonasiga qaytdi.", en: 'Correct. Each term returned to its proper place.' },
    rule: { ru: 'Нулевые слагаемые можно не писать, но их места в числе сохраняются.', uz: "Nol qo'shiluvchilar yozilmasligi mumkin, ammo ularning sondagi o'rni saqlanadi.", en: 'Zero-valued terms may be omitted, but their positions in the number are preserved.' },
  },
  {
    id: '08', kind: 'mc', level: '🔴', figure: '500 006',
    setup: { ru: 'В числе есть только две ненулевые цифры.', uz: "Sonda faqat ikkita noldan farqli raqam bor.", en: 'The number has only two non-zero digits.' },
    prompt: { ru: 'Какая развёрнутая запись верна?', uz: "Qaysi yoyiq yozuv to'g'ri?", en: 'Which expanded form is correct?' },
    options: [
      { text: { ru: '500 000 + 6', uz: '500 000 + 6' , en: "500 000 + 6"}, correct: true },
      { text: { ru: '50 000 + 6', uz: '50 000 + 6' , en: "50 000 + 6"}, wrong: { ru: 'Цифра 5 потеряла разряд сотен тысяч и стала в десять раз меньше.', uz: "5 raqami yuz minglar xonasini yo'qotib, o'n marta kichraydi.", en: 'The digit 5 lost the hundred-thousands place and became ten times smaller.' } },
      { text: { ru: '500 000 + 60', uz: '500 000 + 60' , en: "500 000 + 60"}, wrong: { ru: 'Цифра 6 стоит в единицах, а не в десятках.', uz: "6 raqami o'nlar xonasida emas, birlar xonasida turibdi.", en: 'The digit 6 is in the ones place, not the tens place.' } },
      { text: { ru: '500 + 6', uz: '500 + 6' , en: "500 + 6"}, wrong: { ru: 'Так получится 506, а исходное число шестизначное.', uz: "Bunday 506 hosil bo'ladi, boshlang'ich son esa olti xonali.", en: 'This makes 506, but the original number has six digits.' } },
    ],
    correctText: { ru: 'Верно. Нули не дают слагаемых, но сохраняют расстояние между 5 и 6.', uz: "To'g'ri. Nollar qo'shiluvchi bermaydi, ammo 5 bilan 6 orasidagi o'rinlarni saqlaydi.", en: 'Correct. Zeros do not add terms, but they preserve the positions between 5 and 6.' },
    rule: { ru: 'Записывай значения ненулевых цифр, не сдвигая их разряды.', uz: "Noldan farqli raqamlar qiymatini ularning xonasini siljitmasdan yozing.", en: 'Write the values of non-zero digits without shifting their places.' },
  },
  {
    id: '09', kind: 'mc', level: '🔴', figure: '470 203 = 400 000 + 7 000 + 200 + 3',
    setup: { ru: 'В разложении одна цифра получила неверное значение.', uz: "Yoyiq yozuvda bitta raqam noto'g'ri qiymat oldi.", en: 'One digit has the wrong value in the expanded form.' },
    prompt: { ru: 'Где находится ошибка?', uz: 'Xato qayerda?', en: 'Where is the mistake?' },
    options: [
      { text: { ru: '7 означает 70 000, а не 7 000', uz: '7 raqami 7 000 emas, 70 000 ni bildiradi', en: '7 represents 70,000, not 7,000' }, correct: true },
      { text: { ru: '4 должно означать 40 000', uz: '4 raqami 40 000 ni bildirishi kerak', en: '4 should represent 40,000' }, wrong: { ru: 'Цифра 4 стоит в сотнях тысяч и правильно означает 400 000.', uz: "4 raqami yuz minglar xonasida turib, to'g'ri ravishda 400 000 ni bildiradi.", en: 'The digit 4 is in the hundred-thousands place and correctly represents 400,000.' } },
      { text: { ru: '2 должно означать 20', uz: '2 raqami 20 ni bildirishi kerak', en: '2 should represent 20' }, wrong: { ru: 'Цифра 2 стоит в сотнях и правильно означает 200.', uz: "2 raqami yuzlar xonasida turib, to'g'ri ravishda 200 ni bildiradi.", en: 'The digit 2 is in the hundreds place and correctly represents 200.' } },
      { text: { ru: 'Разложение верно', uz: "Yoyiq yozuv to'g'ri", en: 'The expanded form is correct' }, wrong: { ru: 'Сумма справа даёт 407 203, а не 470 203.', uz: "O'ng tomondagi yig'indi 470 203 emas, 407 203 ni beradi.", en: 'The sum on the right is 407,203, not 470,203.' } },
    ],
    correctText: { ru: 'Верно. Цифра 7 стоит в десятках тысяч, поэтому её значение 70 000.', uz: "To'g'ri. 7 raqami o'n minglar xonasida, shuning uchun uning qiymati 70 000.", en: 'Correct. The digit 7 is in the ten-thousands place, so its value is 70,000.' },
    rule: { ru: 'Проверяй значение каждой цифры по названию её разряда.', uz: "Har bir raqam qiymatini uning xona nomi bo'yicha tekshiring.", en: 'Check each digit value using the name of its place.' },
  },
  {
    id: '10', kind: 'numpad', level: '🔴', answer: '609020', maxLen: 6, figure: '600 000 + 9 000 + 20',
    setup: { ru: 'Собери новый код из трёх значений.', uz: 'Yangi kodni uchta qiymatdan tuzing.', en: 'Build a new code from three values.' },
    prompt: { ru: 'Какое число получится?', uz: "Qaysi son hosil bo'ladi?", en: 'Which number is formed?' },
    hints: [
      { ru: 'Отметь шесть мест и поставь каждую ненулевую цифру в свой разряд.', uz: "Oltita o'rinni belgilang va har bir noldan farqli raqamni o'z xonasiga qo'ying.", en: 'Mark six positions and place each non-zero digit in its proper place.' },
      { ru: 'Сотни тысяч — 6, тысячи — 9, десятки — 2. Остальные места заняты нулями.', uz: "Yuz minglar 6, minglar 9, o'nlar 2. Qolgan o'rinlarni nollar egallaydi.", en: 'The hundred-thousands digit is 6, the thousands digit is 9 and the tens digit is 2. Zeros fill the other places.' },
    ],
    correctText: { ru: 'Верно: 609 020. Все пустые разряды сохранены нулями.', uz: "To'g'ri: 609 020. Barcha bo'sh xonalar nollar bilan saqlandi.", en: 'Correct: 609,020. Zeros preserve all empty places.' },
    rule: { ru: 'Переход от значений к числу выполняется по разрядной сетке.', uz: "Qiymatlardan songa o'tish xona jadvali bo'yicha bajariladi.", en: 'Use the place-value grid to convert values into a number.' },
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
  const options = useMemo(() => task.kind === 'mc' ? shuffle(task.options) : [], [task]);
  const rightPairs = useMemo(() => task.kind === 'match' ? shuffle(task.pairs) : [], [task]);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [gap, setGap] = useState(null);
  const [place, setPlace] = useState(null);
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const feedbackRef = useRef(null);

  const solved = checked && (
    (task.kind === 'mc' && options[picked]?.correct === true)
    || (task.kind === 'gap' && gap === task.correctGap)
    || (task.kind === 'numpad' && typed === task.answer)
    || (task.kind === 'placepick' && task.places[place]?.correct === true)
    || (task.kind === 'match' && task.pairs.every((pair, i) => pairs[i] === pair.id))
  );
  const canCheck = (task.kind === 'mc' && picked !== null)
    || (task.kind === 'gap' && gap !== null)
    || (task.kind === 'numpad' && typed !== '')
    || (task.kind === 'placepick' && place !== null)
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
    if (task.kind === 'mc') return options[picked]?.wrong;
    if (task.kind === 'gap') return task.gapWrong?.[gap];
    if (task.kind === 'numpad') return task.hints[Math.min(Math.max(attempts - 1, 0), task.hints.length - 1)];
    if (task.kind === 'placepick') return task.places[place]?.wrong;
    return task.wrongText;
  })();

  const retry = () => {
    setChecked(false);
    if (task.kind === 'mc') setPicked(null);
    if (task.kind === 'gap') setGap(null);
    if (task.kind === 'numpad') setTyped('');
    if (task.kind === 'placepick') setPlace(null);
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
          className={`p4-option ${picked === i ? (checked ? (option.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`}
          disabled={solved}
          onClick={() => { setPicked(i); setChecked(false); }}
        ><span className="p4-letter">{'ABCD'[i]}</span><span>{tx(option.text, lang)}</span></button>
      ))}</div>}

      {task.kind === 'numpad' && <NumPad value={typed} setValue={(fn) => { setTyped(fn); setChecked(false); }} max={task.maxLen} disabled={solved} lang={lang} />}

      {task.kind === 'placepick' && <div className="p4-place-grid">{task.places.map((item, i) => (
        <button
          key={`${item.digit}-${i}`}
          type="button"
          className={`p4-place ${place === i ? (checked ? (item.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`}
          disabled={solved}
          onClick={() => { setPlace(i); setChecked(false); }}
        ><span>{item.digit}</span><small>{tx(item.label, lang)}</small></button>
      ))}</div>}

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
        {!solved && <button type="button" className="p4-btn" disabled={!canCheck} onClick={() => { setChecked(true); setAttempts((n) => n + 1); }}>{tx(UI.check, lang)}</button>}
        {checked && !solved && <button type="button" className="p4-btn p4-btn-ghost" onClick={retry}>{tx(UI.retry, lang)}</button>}
        {solved && <button type="button" className="p4-btn p4-btn-ready" onClick={() => onSolved(attempts === 1)}>{tx(UI.next, lang)}</button>}
      </div>
    </div>
  );
}

export default function Grade4Dars03Practice({ lang: langProp, onFinished }) {
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
      <style>{STYLES}</style>
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
.p4-place-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:7px}.p4-place{display:flex;min-height:68px;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding:7px 3px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};cursor:pointer}.p4-place span{font:800 clamp(20px,4vw,27px) 'JetBrains Mono',monospace}.p4-place small{font-size:9px;font-weight:800;color:${T.ink3};text-align:center}.p4-place.is-on{border-color:${T.accent};background:${T.accentSoft}}.p4-place.is-ok{border-color:${T.success};background:${T.successSoft}}.p4-place.is-no{border-color:${T.warn};background:${T.warnSoft}}
.p4-match-cols{display:flex;gap:10px;margin-top:8px}.p4-match-col{display:flex;flex-direction:column;gap:8px;flex:1}.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-height:56px;padding:8px 10px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};font:800 clamp(12px,2.2vw,16px) 'Manrope',sans-serif;color:${T.navy};cursor:pointer}.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}.p4-match-item.is-tied{border-color:rgba(34,122,83,.35)}.p4-match-item.is-no{border-color:${T.warn};background:${T.warnSoft}}.p4-tie{font-size:11px;color:${T.success}}
.p4-fb{padding:12px 14px;border-radius:14px}.p4-fb.is-ok{background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}.p4-fb.is-no{background:${T.warnSoft};box-shadow:inset 4px 0 0 ${T.warn}}.p4-fb-txt{margin:0;font-family:'Source Serif 4',Georgia,serif;font-size:clamp(14px,2.1vw,16px);line-height:1.45}.p4-rule{margin:8px 0 0;font-size:13px;color:${T.ink2}}
.p4-actions{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:10px;margin-top:4px}.p4-btn{min-height:46px;padding:10px 22px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font-family:inherit;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5),inset 0 0 0 1px rgba(255,91,53,.2)}.p4-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.p4-btn-ready{background:${T.accent};color:#fff}.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}.p4-done{display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 12px;text-align:center}.p4-done h2{margin:0;font-family:'Source Serif 4',Georgia,serif}.p4-score{margin:0;font-family:'JetBrains Mono',monospace}.p4-score b{font-size:clamp(32px,7vw,44px);color:${T.success}}.p4-score span{font-size:14px;color:${T.ink3}}
@media(max-width:520px){.p4-options{grid-template-columns:1fr}.p4-match-cols{gap:8px}.p4-match-item{font-size:12px;padding:7px}.p4-place-grid{grid-template-columns:repeat(3,1fr)}}
@media(prefers-reduced-motion:reduce){.p4-root *,.p4-root *::before{transition:none!important;animation:none!important}}
`;
