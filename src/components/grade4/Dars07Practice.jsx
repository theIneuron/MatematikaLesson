// ============================================================================
// 4-SINF · Dars 7 amaliyoti — Pozitsion va nopozitsion sanoq sistemalari
//
// Dars01Practice amaliy etaloni asosida: aynan 10 ta tekshiriladigan topshiriq,
// 2 ta oson, 5 ta o'rta va 3 ta murakkab topshiriq. Ovoz, hook, nazariy frame
// hamda qahramon yo'q. Rim yozuvi I, V, X belgilari va 1–20 oralig'ida qoladi.
//
// Mexanikalar: variant tanlash, moslashtirish, tartibli kartalardan yozuv yasash,
// raqamli klaviatura va ikki guruhga saralash. Har bir xato mazmunli tahlilga,
// to'g'ri javob esa mustahkamlovchi qoidaga olib keladi.
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

const UI = {
  title: {
    ru: 'Урок 7. Практика: позиционная и непозиционная системы счисления',
    uz: '7-dars. Amaliyot: pozitsion va nopozitsion sanoq sistemalari',
    en: 'Lesson 7. Practice: positional and non-positional numeral systems',
  },
  task: { ru: 'Задание', uz: 'Topshiriq', en: 'Task' },
  check: { ru: 'Проверить', uz: 'Tekshirish', en: 'Check' },
  next: { ru: 'Следующее', uz: 'Keyingisi', en: 'Next' },
  finish: { ru: 'Завершить', uz: 'Yakunlash', en: 'Finish' },
  again: { ru: 'Пройти заново', uz: 'Qaytadan', en: 'Start again' },
  rule: { ru: 'Запомни', uz: 'Eslab qoling', en: 'Remember' },
  retry: { ru: 'Попробовать ещё раз', uz: "Yana urinib ko'ring", en: 'Try again' },
  typeAnswer: { ru: 'Набери ответ', uz: 'Javobni kiriting', en: 'Enter your answer' },
  clear: { ru: 'Стереть', uz: "O'chirish", en: 'Delete' },
  matchHint: {
    ru: 'Сначала выбери число слева, затем его римскую запись справа.',
    uz: "Avval chapdagi sonni, keyin o'ngdagi Rim yozuvini tanlang.",
    en: 'Choose a number on the left, then its Roman numeral on the right.',
  },
  resetMatches: { ru: 'Сбросить пары', uz: 'Juftliklarni tozalash', en: 'Reset pairs' },
  constructHint: {
    ru: 'Нажимай на карточки по порядку. Нажатие на заполненное место убирает карточку.',
    uz: "Kartalarni tartib bilan bosing. To'ldirilgan joy bosilsa, karta olib tashlanadi.",
    en: 'Choose the cards in order. Choose a filled place to remove its card.',
  },
  sortHint: {
    ru: 'Выбери запись, затем нажми на подходящую систему.',
    uz: 'Yozuvni tanlang, keyin mos sanoq sistemasini bosing.',
    en: 'Choose a numeral, then choose the matching numeral system.',
  },
  done: { ru: 'Практика пройдена', uz: 'Amaliyot tugadi', en: 'Practice complete' },
  ofTen: { ru: 'из 10', uz: '10 dan', en: 'out of 10' },
  firstTryNote: {
    ru: 'Столько заданий решено с первой попытки.',
    uz: "Shuncha topshiriq birinchi urinishda to'g'ri bajarildi.",
    en: 'This many tasks were solved on the first attempt.',
  },
  language: { ru: 'Язык', uz: 'Til', en: 'Language' },
  emptyPlace: { ru: 'пустое место', uz: "bo'sh joy", en: 'empty place' },
  returnCard: { ru: 'Вернуть карточку', uz: 'Kartani qaytarish', en: 'Return card' },
  completedTasks: { ru: 'Выполненные задания', uz: 'Bajarilgan topshiriqlar', en: 'Completed tasks' },
};

const LESSON_META = {
  lessonId: 'num-4-07-practice',
  lessonTitle: UI.title,
};

const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const tx = (node, lang) => (node && typeof node === 'object' ? (node[SUPPORTED_LANGS.includes(lang) ? lang : 'uz'] ?? node.uz ?? '') : node);
const grouped = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const shuffle = (items) => {
  const out = [...items];
  for (let index = out.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [out[index], out[target]] = [out[target], out[index]];
  }
  return out;
};

const TASKS = [
  {
    id: '01', kind: 'mc', level: '🟢', figure: 'V',
    setup: { ru: 'На панели появился римский знак.', uz: "Panelda Rim belgisi paydo bo'ldi.", en: 'A Roman numeral appeared on the panel.' },
    prompt: { ru: 'Какое значение сохраняет знак V?', uz: 'V belgisi qaysi qiymatni saqlaydi?', en: 'What value does the symbol V have?' },
    options: [
      {
        text: { ru: '1', uz: '1', en: '1' },
        wrong: {
          ru: 'Один обозначает другой римский знак. Сравни форму I и форму V.',
          uz: 'Birni boshqa Rim belgisi bildiradi. I va V belgilarining shaklini taqqoslang.',
          en: 'One is represented by a different Roman numeral. Compare the shapes of I and V.',
        },
      },
      { text: { ru: '5', uz: '5', en: '5' }, correct: true },
      {
        text: { ru: '10', uz: '10', en: '10' },
        wrong: {
          ru: 'Десять обозначает знак X. Проверь, какой знак дан в задании.',
          uz: "O'nni X belgisi bildiradi. Topshiriqda qaysi belgi berilganini tekshiring.",
          en: 'Ten is represented by X. Check which symbol is shown in the task.',
        },
      },
    ],
    correctText: { ru: 'Верно. Римский знак V обозначает пять.', uz: "To'g'ri. Rim yozuvidagi V belgisi beshni bildiradi.", en: 'Correct. The Roman numeral V represents five.' },
    rule: {
      ru: 'В римской записи каждый знак сохраняет своё основное значение.',
      uz: "Rim yozuvida har bir belgi o'zining asosiy qiymatini saqlaydi.",
      en: 'In Roman numerals, each symbol keeps its basic value.',
    },
  },
  {
    id: '02', kind: 'match', level: '🟢',
    setup: { ru: 'Четыре кода записаны двумя способами.', uz: "To'rtta kod ikki xil usulda yozilgan.", en: 'Four codes are written in two ways.' },
    prompt: { ru: 'Соедини число с его римской записью.', uz: 'Sonni uning Rim yozuvi bilan moslashtiring.', en: 'Match each number to its Roman numeral.' },
    pairs: [
      { id: 'a', left: { ru: '3', uz: '3', en: '3' }, right: { ru: 'III', uz: 'III', en: 'III' } },
      { id: 'b', left: { ru: '7', uz: '7', en: '7' }, right: { ru: 'VII', uz: 'VII', en: 'VII' } },
      { id: 'c', left: { ru: '12', uz: '12', en: '12' }, right: { ru: 'XII', uz: 'XII', en: 'XII' } },
      { id: 'd', left: { ru: '17', uz: '17', en: '17' }, right: { ru: 'XVII', uz: 'XVII', en: 'XVII' } },
    ],
    wrongText: {
      ru: 'В одной из пар нарушена сумма знаков. Проверь значения X, V и каждого I.',
      uz: "Juftliklardan birida belgilar yig'indisi buzilgan. X, V va har bir I qiymatini tekshiring.",
      en: 'One pair has the wrong sum of symbols. Check the values of X, V and each I.',
    },
    correctText: {
      ru: 'Верно. Все четыре числа соединены со своей римской записью.',
      uz: "To'g'ri. To'rtta sonning har biri o'z Rim yozuvi bilan moslashtirildi.",
      en: 'Correct. All four numbers have been matched to their Roman numerals.',
    },
    rule: {
      ru: 'Если меньший знак стоит после большего, их значения складываются.',
      uz: "Kichik belgi katta belgidan keyin tursa, ularning qiymatlari qo'shiladi.",
      en: 'If a smaller symbol comes after a larger one, add their values.',
    },
  },
  {
    id: '03', kind: 'construct', level: '🟡', slotCount: 3,
    setup: { ru: 'Для табло нужно собрать римскую запись числа 16.', uz: 'Tablo uchun 16 sonining Rim yozuvini tuzish kerak.', en: 'Build the Roman numeral for 16 for the display.' },
    prompt: { ru: 'Собери число 16 из карточек.', uz: 'Kartalardan 16 sonini yasang.', en: 'Build 16 from the cards.' },
    cards: [
      { id: 'x1', symbol: 'X' },
      { id: 'v1', symbol: 'V' },
      { id: 'i1', symbol: 'I' },
      { id: 'i2', symbol: 'I' },
      { id: 'x2', symbol: 'X' },
    ],
    answer: ['X', 'V', 'I'],
    wrongBySequence: {
      XIV: {
        ru: 'Знак I перед V образует четыре. Проверь, нужно ли для числа 16 прибавить один или вычесть его.',
        uz: "I belgisi V dan oldin tursa, to'rt hosil bo'ladi. 16 uchun birni qo'shish yoki ayirish kerakligini tekshiring.",
        en: 'I before V makes four. Check whether you need to add or subtract one for 16.',
      },
    },
    wrongText: {
      ru: 'Проверь порядок карточек: здесь нужны десять, пять и ещё один.',
      uz: "Kartalar tartibini tekshiring: bu yerda o'n, besh va yana bir kerak.",
      en: 'Check the order of the cards: you need ten, five and one more.',
    },
    correctText: { ru: 'Верно: XVI — это 10 + 5 + 1, то есть 16.', uz: "To'g'ri: XVI — 10 + 5 + 1, ya'ni 16.", en: 'Correct: XVI is 10 + 5 + 1, which is 16.' },
    rule: {
      ru: 'В записи XVI знаки идут от большего к меньшему, поэтому значения складываются.',
      uz: "XVI yozuvida belgilar katta qiymatdan kichigiga qarab turadi, shuning uchun qiymatlar qo'shiladi.",
      en: 'In XVI, the symbols go from greatest to least, so their values are added.',
    },
  },
  {
    id: '04', kind: 'mc', level: '🟡', figure: '36  ↔  63',
    setup: { ru: 'Одинаковая цифра 3 заняла разные места.', uz: "Bir xil 3 raqami turli o'rinlarni egalladi.", en: 'The same digit 3 is in different places.' },
    prompt: { ru: 'Каковы значения цифры 3 в числах 36 и 63?', uz: '36 va 63 sonlaridagi 3 raqamining qiymatlari qanday?', en: 'What are the values of the digit 3 in 36 and 63?' },
    options: [
      { text: { ru: '30 и 3', uz: '30 va 3', en: '30 and 3' }, correct: true },
      {
        text: { ru: '3 и 30', uz: '3 va 30', en: '3 and 30' },
        wrong: { ru: 'Значения переставлены. Сначала проверь место цифры 3 в числе 36.', uz: "Qiymatlar o'rni almashgan. Avval 36 sonidagi 3 raqamining o'rnini tekshiring.", en: 'The values are reversed. First check the place of the digit 3 in 36.' },
      },
      {
        text: { ru: '3 и 3', uz: '3 va 3', en: '3 and 3' },
        wrong: { ru: 'В десятичной записи место цифры меняет её значение.', uz: "O'nlik yozuvda raqamning o'rni uning qiymatini o'zgartiradi.", en: 'In decimal notation, the place of a digit changes its value.' },
      },
      {
        text: { ru: '300 и 30', uz: '300 va 30', en: '300 and 30' },
        wrong: { ru: 'Оба значения сдвинуты на один разряд влево. Посчитай цифры справа от тройки.', uz: "Ikkala qiymat ham bir xona chapga siljigan. Uchdan o'ngdagi raqamlarni sanang.", en: 'Both values have shifted one place to the left. Count the digits to the right of 3.' },
      },
    ],
    correctText: { ru: 'Верно. В числе 36 цифра 3 означает 30, а в числе 63 — 3.', uz: "To'g'ri. 36 sonida 3 raqami 30 ni, 63 sonida esa 3 ni bildiradi.", en: 'Correct. In 36, the digit 3 means 30; in 63, it means 3.' },
    rule: { ru: 'В позиционной системе значение цифры зависит от её места.', uz: "Pozitsion sistemada raqam qiymati uning o'rniga bog'liq.", en: "In a positional numeral system, a digit's value depends on its place." },
  },
  {
    id: '05', kind: 'numpad', level: '🟡', answer: '4000', maxLen: 4,
    figure: '4 204 = □ + 200 + 4',
    setup: { ru: 'В разложении числа пропало одно слагаемое.', uz: "Sonning yoyiq yozuvida bitta qo'shiluvchi yo'qoldi.", en: 'One addend is missing from the expanded form of the number.' },
    prompt: { ru: 'Какое число нужно поставить вместо квадрата?', uz: "Kvadrat o'rniga qaysi sonni qo'yish kerak?", en: 'Which number belongs in the square?' },
    wrongByAnswer: {
      4: { ru: 'Записана сама цифра, а не её значение. Определи разряд левой четвёрки.', uz: "Raqamning o'zi yozilgan, qiymati emas. Chapdagi to'rt qaysi xonada turganini aniqlang.", en: 'The digit itself was entered, not its value. Identify the place of the 4 on the left.' },
      40: { ru: 'Это значение цифры 4 в десятках. В числе 4 204 она стоит намного левее.', uz: "Bu 4 raqamining o'nlar xonasidagi qiymati. 4 204 sonida u ancha chapda turibdi.", en: 'This is the value of 4 in the tens place. In 4 204, it is much farther to the left.' },
      400: { ru: 'Это значение цифры 4 в сотнях. Посчитай, сколько цифр находится справа от левой четвёрки.', uz: "Bu 4 raqamining yuzlar xonasidagi qiymati. Chapdagi to'rtdan o'ngda nechta raqam borligini sanang.", en: 'This is the value of 4 in the hundreds place. Count the digits to the right of the 4 on the left.' },
    },
    hints: [
      { ru: 'Определи разряд левой цифры 4 по её месту в числе.', uz: "Chapdagi 4 raqamining xonasini son ichidagi o'rniga qarab aniqlang.", en: 'Use its place in the number to identify the place of the 4 on the left.' },
      { ru: 'Справа от левой четвёрки три цифры. Значит, она показывает количество тысяч.', uz: "Chapdagi to'rtdan o'ngda uchta raqam bor. Demak, u minglar miqdorini bildiradi.", en: 'There are three digits to the right of the 4 on the left. It therefore shows the number of thousands.' },
    ],
    correctText: { ru: 'Верно: 4 204 = 4 000 + 200 + 4.', uz: "To'g'ri: 4 204 = 4 000 + 200 + 4.", en: 'Correct: 4 204 = 4 000 + 200 + 4.' },
    rule: { ru: 'Развёрнутая запись показывает значение каждой цифры по её разряду.', uz: "Yoyiq yozuv har bir raqamning xona bo'yicha qiymatini ko'rsatadi.", en: 'Expanded form shows the value of each digit by its place.' },
  },
  {
    id: '06', kind: 'mc', level: '🟡', figure: '74  ·  XV', wideOptions: true,
    setup: { ru: 'Два маршрутных кода записаны разными системами.', uz: "Ikki yo'nalish kodi turli sistemalarda yozilgan.", en: 'Two route codes are written in different numeral systems.' },
    prompt: { ru: 'Как правильно проверить каждый код?', uz: "Har bir kodni qanday to'g'ri tekshirish mumkin?", en: 'How should you check each code?' },
    options: [
      {
        text: { ru: '74 = 7 десятков + 4 единицы; XV = 10 + 5', uz: "74 = 7 o'nlik + 4 birlik; XV = 10 + 5", en: '74 = 7 tens + 4 ones; XV = 10 + 5' },
        correct: true,
      },
      {
        text: { ru: '74 = 7 + 4; XV = 1 десяток + 5 единиц', uz: "74 = 7 + 4; XV = 1 o'nlik + 5 birlik", en: '74 = 7 + 4; XV = 1 ten + 5 ones' },
        wrong: { ru: 'Способы перепутаны. В числе 74 цифра 7 имеет разрядное значение, а X — римский знак.', uz: "Usullar aralashib ketgan. 74 sonida 7 xona qiymatiga ega, X esa Rim belgisidir.", en: 'The methods are mixed up. In 74, the digit 7 has a place value, while X is a Roman numeral.' },
      },
      {
        text: { ru: 'Оба кода нужно разложить по десятичным разрядам', uz: "Ikkala kodni ham o'nlik xonalarga ajratish kerak", en: 'Split both codes into decimal places' },
        wrong: { ru: 'У римской записи нет десятичных разрядов единиц и десятков.', uz: "Rim yozuvida o'nlik sistemadagi birlar va o'nlar xonalari yo'q.", en: 'Roman numerals do not have decimal ones and tens places.' },
      },
      {
        text: { ru: 'В обоих кодах нужно просто сложить написанные цифры', uz: "Ikkala kodda ham yozilgan raqamlarni shunchaki qo'shish kerak", en: 'Simply add the written digits in both codes' },
        wrong: { ru: 'В записи 74 цифра 7 означает не семь, а семь десятков.', uz: "74 yozuvida 7 raqami yettini emas, yetti o'nlikni bildiradi.", en: 'In 74, the digit 7 means seven tens, not seven.' },
      },
    ],
    correctText: { ru: 'Верно. Десятичный код проверен по разрядам, а римский — по значениям знаков.', uz: "To'g'ri. O'nlik kod xonalar orqali, Rim kodi esa belgilar qiymati orqali tekshirildi.", en: 'Correct. The decimal code was checked by place value, and the Roman code by symbol values.' },
    rule: { ru: 'Для разных систем счисления нужны разные способы разбора записи.', uz: 'Turli sanoq sistemalaridagi yozuvlar turli usulda tahlil qilinadi.', en: 'Different numeral systems need different ways of reading a numeral.' },
  },
  {
    id: '07', kind: 'sort', level: '🟡',
    setup: { ru: 'Записи смешались на двух терминалах.', uz: 'Yozuvlar ikki terminalda aralashib ketdi.', en: 'The numerals have been mixed up across two terminals.' },
    prompt: { ru: 'Раздели записи по системам счисления.', uz: "Yozuvlarni sanoq sistemalari bo'yicha ajrating.", en: 'Sort the numerals by numeral system.' },
    bins: [
      { id: 'pos', label: { ru: 'Позиционная', uz: 'Pozitsion', en: 'Positional' } },
      { id: 'nonpos', label: { ru: 'Непозиционная', uz: 'Nopozitsion', en: 'Non-positional' } },
    ],
    items: [
      { id: 'p1', text: '52', bin: 'pos' },
      { id: 'p2', text: '808', bin: 'pos' },
      { id: 'p3', text: '1 204', bin: 'pos' },
      { id: 'n1', text: 'VII', bin: 'nonpos' },
      { id: 'n2', text: 'XIII', bin: 'nonpos' },
      { id: 'n3', text: 'XVIII', bin: 'nonpos' },
    ],
    wrongText: {
      ru: 'Одна запись попала не в свою систему. Проверь: это десятичные цифры или римские знаки?',
      uz: "Yozuvlardan biri noto'g'ri sistemaga tushgan. Tekshiring: u o'nlik raqamlardanmi yoki Rim belgilaridanmi?",
      en: 'One numeral is in the wrong system. Check whether it uses decimal digits or Roman symbols.',
    },
    correctText: { ru: 'Верно. Десятичные числа и римские записи разделены по двум системам.', uz: "To'g'ri. O'nlik sonlar va Rim yozuvlari ikki sistemaga ajratildi.", en: 'Correct. The decimal numbers and Roman numerals have been sorted into the two systems.' },
    rule: { ru: 'В десятичной записи значение цифры зависит от разряда; римский знак сохраняет своё значение.', uz: "O'nlik yozuvda raqam qiymati xonaga bog'liq; Rim belgisi esa o'z qiymatini saqlaydi.", en: "In decimal notation, a digit's value depends on its place; a Roman symbol keeps its value." },
  },
  {
    id: '08', kind: 'mc', level: '🔴', figure: '222  ·  III', wideOptions: true,
    setup: { ru: 'В обеих записях один знак повторяется три раза.', uz: 'Ikkala yozuvda ham bitta belgi uch marta takrorlangan.', en: 'The same symbol is repeated three times in both numerals.' },
    prompt: { ru: 'Какое сравнение верно?', uz: "Qaysi taqqoslash to'g'ri?", en: 'Which comparison is correct?' },
    options: [
      {
        text: { ru: 'В 222 цифры означают 200, 20 и 2; в III каждый знак I означает 1', uz: '222 da raqamlar 200, 20 va 2 ni; III da har bir I belgisi 1 ni bildiradi', en: 'In 222, the digits mean 200, 20 and 2; in III, each I means 1' },
        correct: true,
      },
      {
        text: { ru: 'В обеих записях каждый повторённый знак имеет одно и то же значение', uz: 'Ikkala yozuvda ham takrorlangan har bir belgi bir xil qiymatga ega', en: 'In both numerals, each repeated symbol has the same value' },
        wrong: { ru: 'В числе 222 одинаковые цифры стоят в разных разрядах.', uz: "222 sonida bir xil raqamlar turli xonalarda turibdi.", en: 'In 222, the identical digits are in different places.' },
      },
      {
        text: { ru: 'В обеих записях место знака меняет его значение', uz: "Ikkala yozuvda ham belgining o'rni uning qiymatini o'zgartiradi", en: 'In both numerals, the place of a symbol changes its value' },
        wrong: { ru: 'В записи III каждый знак I сохраняет значение один.', uz: 'III yozuvida har bir I belgisi bir qiymatini saqlaydi.', en: 'In III, each I keeps the value one.' },
      },
      {
        text: { ru: '222 — непозиционная запись, а III — позиционная', uz: '222 — nopozitsion yozuv, III esa pozitsion yozuv', en: '222 is non-positional, while III is positional' },
        wrong: { ru: 'Названия систем переставлены. Проверь, где значение цифры зависит от разряда.', uz: "Sistemalar nomi almashgan. Qayerda raqam qiymati xonaga bog'liqligini tekshiring.", en: "The names of the systems are reversed. Check where a digit's value depends on its place." },
      },
    ],
    correctText: { ru: 'Верно. В 222 место меняет значение цифры, а каждый знак I сохраняет значение один.', uz: "To'g'ri. 222 da o'rin raqam qiymatini o'zgartiradi, har bir I belgisi esa bir qiymatini saqlaydi.", en: "Correct. In 222, place changes each digit's value, while each I keeps the value one." },
    rule: { ru: 'Повтор одинаковых знаков по-разному работает в позиционной и непозиционной записи.', uz: 'Bir xil belgining takrorlanishi pozitsion va nopozitsion yozuvda turlicha ishlaydi.', en: 'Repeating the same symbol works differently in positional and non-positional notation.' },
  },
  {
    id: '09', kind: 'mc', level: '🔴', figure: 'XIX', wideOptions: true,
    setup: { ru: 'Аналитик решил: второй знак X из-за своего места означает 100.', uz: "Tahlilchi ikkinchi X belgisi o'rni sabab 100 ni bildiradi, deb o'yladi.", en: 'An analyst decided that the second X means 100 because of its place.' },
    prompt: { ru: 'Где находится первая ошибка в рассуждении?', uz: 'Fikrlashdagi birinchi xato qayerda?', en: 'What is the first mistake in the reasoning?' },
    options: [
      {
        text: { ru: 'В римской записи X всегда означает 10, а пара IX означает 9', uz: "Rim yozuvida X har doim 10 ni, IX juftligi esa 9 ni bildiradi", en: 'In Roman numerals, X always means 10, while the pair IX means 9' },
        correct: true,
      },
      {
        text: { ru: 'Знак I между двумя X нужно прибавить к обоим знакам', uz: "Ikki X orasidagi I belgisini ikkala belgiga ham qo'shish kerak", en: 'Add the I between the two X symbols to both of them' },
        wrong: { ru: 'Один знак нельзя одновременно использовать в двух действиях. Сначала найди разрешённую пару.', uz: "Bitta belgini bir vaqtning o'zida ikki amalda ishlatib bo'lmaydi. Avval ruxsat etilgan juftlikni toping.", en: 'One symbol cannot be used in two operations at once. First find the valid pair.' },
      },
      {
        text: { ru: 'Правый знак всегда получает значение следующего десятичного разряда', uz: "O'ngdagi belgi har doim keyingi o'nlik xona qiymatini oladi", en: 'The symbol on the right always gets the value of the next decimal place' },
        wrong: { ru: 'Это правило десятичной позиционной записи, а не римских знаков.', uz: "Bu o'nlik pozitsion yozuv qoidasi, Rim belgilarining qoidasi emas.", en: 'That is a rule of positional decimal notation, not Roman numerals.' },
      },
      {
        text: { ru: 'Ошибки нет: XIX равно 111', uz: "Xato yo'q: XIX 111 ga teng", en: 'There is no mistake: XIX equals 111' },
        wrong: { ru: 'Римские знаки нельзя читать как десятичные цифры, стоящие рядом.', uz: "Rim belgilarini yonma-yon turgan o'nlik raqamlar kabi o'qib bo'lmaydi.", en: 'Roman symbols cannot be read as decimal digits placed next to one another.' },
      },
    ],
    correctText: { ru: 'Верно. XIX = X + IX = 10 + 9 = 19; оба знака X сохраняют значение 10.', uz: "To'g'ri. XIX = X + IX = 10 + 9 = 19; ikkala X belgisi ham 10 qiymatini saqlaydi.", en: 'Correct. XIX = X + IX = 10 + 9 = 19; both X symbols keep the value 10.' },
    rule: { ru: 'Не переноси правило разрядов десятичной системы на римскую запись.', uz: "O'nlik sistemaning xona qoidasini Rim yozuviga ko'chirmang.", en: 'Do not apply decimal place-value rules to Roman numerals.' },
  },
  {
    id: '10', kind: 'mc', level: '🔴', figure: '707  ·  XIV', wideOptions: true,
    setup: { ru: 'Два городских кода нужно проверить и объяснить.', uz: 'Ikki shahar kodini tekshirish va tushuntirish kerak.', en: 'Two city codes need to be checked and explained.' },
    prompt: { ru: 'Какой план проверки надёжен?', uz: 'Qaysi tekshirish rejasi ishonchli?', en: 'Which checking plan is reliable?' },
    options: [
      {
        text: { ru: '707 = 700 + 0 + 7; XIV = X + IV = 10 + 4 = 14', uz: '707 = 700 + 0 + 7; XIV = X + IV = 10 + 4 = 14', en: '707 = 700 + 0 + 7; XIV = X + IV = 10 + 4 = 14' },
        correct: true,
      },
      {
        text: { ru: 'Оба кода разложить по сотням, десяткам и единицам', uz: "Ikkala kodni ham yuzlar, o'nlar va birlar xonasiga ajratish", en: 'Split both codes into hundreds, tens and ones' },
        wrong: { ru: 'У записи XIV нет десятичных разрядов. Для неё проверь значения и порядок римских знаков.', uz: "XIV yozuvida o'nlik xonalar yo'q. Unda Rim belgilarining qiymati va tartibini tekshiring.", en: 'XIV does not have decimal places. Check the values and order of its Roman symbols.' },
      },
      {
        text: { ru: 'В обоих кодах сложить значения всех написанных знаков', uz: "Ikkala kodda ham yozilgan barcha belgilar qiymatini qo'shish", en: 'Add the values of all written symbols in both codes' },
        wrong: { ru: 'В числе 707 значение цифры задаёт разряд, а в паре IV действует вычитание.', uz: "707 sonida raqam qiymatini xona belgilaydi, IV juftligida esa ayirish ishlaydi.", en: "In 707, each digit's value comes from its place, while the pair IV uses subtraction." },
      },
      {
        text: { ru: '707 прочитать как римскую запись, а XIV разложить по разрядам', uz: "707 ni Rim yozuvi kabi o'qish, XIV ni esa xonalarga ajratish", en: 'Read 707 as a Roman numeral and split XIV into places' },
        wrong: { ru: 'Способы проверки поменялись местами. Сначала определи систему каждой записи.', uz: "Tekshirish usullari o'rni almashgan. Avval har bir yozuvning sistemasini aniqlang.", en: 'The checking methods are reversed. First identify the system used by each numeral.' },
      },
    ],
    correctText: { ru: 'Верно. Для каждого кода выбран способ, соответствующий его системе счисления.', uz: "To'g'ri. Har bir kod uchun uning sanoq sistemasiga mos usul tanlandi.", en: 'Correct. Each code uses a method that matches its numeral system.' },
    rule: { ru: 'Сначала определи систему записи, затем применяй её правило чтения.', uz: "Avval yozuv sistemasini aniqlang, keyin uning o'qish qoidasini qo'llang.", en: 'First identify the numeral system, then apply its reading rule.' },
  },
];

const NumPad = ({ value, onChange, max, disabled, lang }) => (
  <div className="p4-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}>
    <div className="p4-pad-display" aria-live="polite">{value ? grouped(value) : '—'}</div>
    <div className="p4-pad-keys">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
        <button
          key={number}
          type="button"
          className="p4-key"
          disabled={disabled}
          onClick={() => onChange(value.length >= max ? value : `${value}${number}`)}
        >{number}</button>
      ))}
      <button
        type="button"
        className="p4-key p4-key-del"
        disabled={disabled || !value}
        aria-label={tx(UI.clear, lang)}
        onClick={() => onChange(value.slice(0, -1))}
      >⌫</button>
    </div>
  </div>
);

const Feedback = ({ ok, text, rule, lang, feedbackRef }) => (
  <div
    ref={feedbackRef}
    className={`p4-fb ${ok ? 'is-ok' : 'is-no'}`}
    role="status"
    aria-live="polite"
  >
    <p className="p4-fb-txt">{text}</p>
    {ok && rule && <p className="p4-rule"><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>}
  </div>
);

function MatchTask({ task, lang, pairs, setPairs, activeLeft, setActiveLeft, solved, firstWrong }) {
  const rightPairs = useMemo(() => shuffle(task.pairs), [task]);

  const chooseLeft = (index) => {
    setPairs((old) => {
      const next = { ...old };
      delete next[index];
      return next;
    });
    setActiveLeft(index);
  };

  return (
    <div className="p4-match">
      <p className="p4-note">{tx(UI.matchHint, lang)}</p>
      <div className="p4-match-cols">
        <div className="p4-match-col">
          {task.pairs.map((pair, index) => (
            <button
              key={pair.id}
              type="button"
              className={`p4-match-item ${activeLeft === index ? 'is-active' : ''} ${pairs[index] ? 'is-tied' : ''} ${firstWrong === index ? 'is-no' : ''}`}
              disabled={solved}
              aria-pressed={activeLeft === index}
              onClick={() => chooseLeft(index)}
            >
              <span>{tx(pair.left, lang)}</span>
              {pairs[index] && <b className="p4-tie">{tx(task.pairs.find((item) => item.id === pairs[index])?.right, lang)}</b>}
            </button>
          ))}
        </div>
        <div className="p4-match-col">
          {rightPairs.map((pair) => {
            const usedByOther = Object.entries(pairs).some(([index, id]) => id === pair.id && Number(index) !== activeLeft);
            return (
              <button
                key={pair.id}
                type="button"
                className="p4-match-item p4-match-right"
                disabled={solved || activeLeft === null || usedByOther}
                aria-pressed={activeLeft !== null && pairs[activeLeft] === pair.id}
                onClick={() => {
                  if (activeLeft === null) return;
                  setPairs((old) => ({ ...old, [activeLeft]: pair.id }));
                  setActiveLeft(null);
                }}
              >{tx(pair.right, lang)}</button>
            );
          })}
        </div>
      </div>
      {!solved && Object.keys(pairs).length > 0 && (
        <button
          type="button"
          className="p4-mini-action"
          onClick={() => { setPairs({}); setActiveLeft(null); }}
        >{tx(UI.resetMatches, lang)}</button>
      )}
    </div>
  );
}

function ConstructTask({ task, lang, slots, setSlots, solved }) {
  const usedIds = slots.filter(Boolean);
  return (
    <div className="p4-construct">
      <p className="p4-note">{tx(UI.constructHint, lang)}</p>
      <div className="p4-slots" role="group" aria-label={tx(task.prompt, lang)}>
        {Array.from({ length: task.slotCount }, (_, index) => {
          const card = task.cards.find((item) => item.id === slots[index]);
          return (
            <button
              key={`slot-${index}`}
              type="button"
              className={`p4-slot ${card ? 'is-filled' : ''}`}
              disabled={solved || !card}
              aria-label={card
                ? `${index + 1}: ${card.symbol}`
                : `${index + 1}: ${tx(UI.emptyPlace, lang)}`}
              onClick={() => setSlots((old) => old.map((id, slotIndex) => slotIndex === index ? null : id))}
            >{card?.symbol || '·'}</button>
          );
        })}
      </div>
      <div className="p4-card-bank" role="group" aria-label={tx(UI.constructHint, lang)}>
        {task.cards.map((card) => {
          const used = usedIds.includes(card.id);
          return (
            <button
              key={card.id}
              type="button"
              className={`p4-symbol-card ${used ? 'is-used' : ''}`}
              disabled={solved || used || !slots.includes(null)}
              aria-pressed={used}
              onClick={() => setSlots((old) => {
                const firstEmpty = old.indexOf(null);
                return old.map((id, index) => index === firstEmpty ? card.id : id);
              })}
            >{card.symbol}</button>
          );
        })}
      </div>
    </div>
  );
}

function SortTask({ task, lang, assignments, setAssignments, active, setActive, solved, firstWrong }) {
  const order = useMemo(() => shuffle(task.items), [task]);
  const unassigned = order.filter((item) => !assignments[item.id]);
  return (
    <div className="p4-sort">
      <p className="p4-note">{tx(UI.sortHint, lang)}</p>
      <div className="p4-sort-pool" role="group" aria-label={tx(task.prompt, lang)}>
        {unassigned.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`p4-sort-token ${active === item.id ? 'is-active' : ''}`}
            disabled={solved}
            aria-pressed={active === item.id}
            onClick={() => setActive(item.id)}
          >{item.text}</button>
        ))}
        {unassigned.length === 0 && <span className="p4-pool-done">✓</span>}
      </div>
      <div className="p4-sort-bins">
        {task.bins.map((bin) => (
          <div className="p4-sort-bin" key={bin.id}>
            <button
              type="button"
              className="p4-sort-bin-head"
              disabled={solved || active === null}
              onClick={() => {
                if (active === null) return;
                setAssignments((old) => ({ ...old, [active]: bin.id }));
                setActive(null);
              }}
            >{tx(bin.label, lang)}</button>
            <div className="p4-sort-bin-items">
              {order.filter((item) => assignments[item.id] === bin.id).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`p4-sort-token is-placed ${firstWrong === item.id ? 'is-no' : ''}`}
                  disabled={solved}
                  aria-label={`${tx(UI.returnCard, lang)} ${item.text}`}
                  onClick={() => {
                    setAssignments((old) => {
                      const next = { ...old };
                      delete next[item.id];
                      return next;
                    });
                    setActive(item.id);
                  }}
                >{item.text}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// `platform` berilganda tugma qatori chizilmaydi: uni LMS o'zi beradi va
// tekshiruvni `registerCheck` orqali chaqiradi (LMS kontrakti).
function Task({ task, lang, isLast, onSolved ,
  platform = false, mode, onReady, registerCheck, onSubmit, playCorrect, playWrong,
}) {
  // Xato javobdan keyin variantlar qayta aralashadi (metodist qarori 2026-08-21).
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- wrongRound ataylab yangi tartib beradi
  const options = useMemo(() => task.kind === 'mc' ? shuffle(task.options) : [], [task, wrongRound]);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [slots, setSlots] = useState(() => Array.from({ length: task.slotCount || 0 }, () => null));
  const [assignments, setAssignments] = useState({});
  const [activeSort, setActiveSort] = useState(null);
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [advancing, setAdvancing] = useState(false);
  const advancedRef = useRef(false);
  const feedbackRef = useRef(null);

  const sequence = task.kind === 'construct'
    ? slots.map((id) => task.cards.find((card) => card.id === id)?.symbol || '').join('')
    : '';
  // Javobning to'g'riligi `checked` dan ALOHIDA hisoblanadi: tekshirishda
  // xato bo'lsa variantlar qayta aralashtiriladi.
  const answerCorrect = (
    (task.kind === 'mc' && picked?.correct === true)
    || (task.kind === 'numpad' && typed === task.answer)
    || (task.kind === 'match' && task.pairs.every((pair, index) => pairs[index] === pair.id))
    || (task.kind === 'construct' && sequence === task.answer.join(''))
    || (task.kind === 'sort' && task.items.every((item) => assignments[item.id] === item.bin))
  );
  const solved = checked && answerCorrect;
  const canCheck = (task.kind === 'mc' && picked !== null)
    || (task.kind === 'numpad' && typed !== '')
    || (task.kind === 'match' && Object.keys(pairs).length === task.pairs.length)
    || (task.kind === 'construct' && slots.length > 0 && slots.every(Boolean))
    || (task.kind === 'sort' && Object.keys(assignments).length === task.items.length);
  const firstMatchWrong = task.kind === 'match' && checked
    ? task.pairs.findIndex((pair, index) => pairs[index] !== pair.id)
    : -1;
  const firstSortWrong = task.kind === 'sort' && checked
    ? task.items.find((item) => assignments[item.id] !== item.bin)?.id
    : null;

  useEffect(() => {
    if (!checked || !feedbackRef.current) return undefined;
    let timeout;
    const firstFrame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        timeout = window.setTimeout(() => {
          const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
          feedbackRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
        }, 160);
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      window.clearTimeout(timeout);
    };
  }, [checked]);

  const wrongText = (() => {
    if (task.kind === 'mc') return picked?.wrong;
    if (task.kind === 'numpad') {
      return task.wrongByAnswer?.[typed]
        || task.hints[Math.min(Math.max(attempts - 1, 0), task.hints.length - 1)];
    }
    if (task.kind === 'construct') return task.wrongBySequence?.[sequence] || task.wrongText;
    return task.wrongText;
  })();

  const resetAnswer = () => {
    setChecked(false);
    if (task.kind === 'mc') setPicked(null);
    if (task.kind === 'numpad') setTyped('');
    if (task.kind === 'match') { setPairs({}); setActiveLeft(null); }
    if (task.kind === 'construct') setSlots(Array.from({ length: task.slotCount }, () => null));
    if (task.kind === 'sort') { setAssignments({}); setActiveSort(null); }
  };

  const markChanged = (change) => {
    change();
    setChecked(false);
  };

  // Tekshirish bir joyda: lokal tugma ham, platforma ham shuni chaqiradi.
  const check = () => { if (mode === 'review') return; setChecked(true); setAttempts((count) => count + 1); if (!answerCorrect) setWrongRound((old) => old + 1); };
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
    <section className="p4-task" aria-labelledby={`p4-question-${task.id}`}>
      <p className="p4-eyebrow">{task.level} {tx(UI.task, lang)} {task.id}</p>
      <p className="p4-setup">{tx(task.setup, lang)}</p>
      {task.figure && (
        <div className="p4-figure">
          <span className="p4-bignum">{tx(task.figure, lang)}</span>
        </div>
      )}
      <h2 className="p4-ask" id={`p4-question-${task.id}`}>{tx(task.prompt, lang)}</h2>

      {task.kind === 'mc' && (
        <div className={`p4-options ${task.wideOptions ? 'is-wide' : ''}`} role="group" aria-label={tx(task.prompt, lang)}>
          {options.map((option, index) => (
            <button
              key={`${task.id}-${index}`}
              type="button"
              className={`p4-option ${picked === option ? (checked ? (option.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`}
              disabled={solved}
              aria-pressed={picked === option}
              onClick={() => markChanged(() => setPicked(option))}
            >
              <span className="p4-letter">{'ABCD'[index]}</span>
              <span>{tx(option.text, lang)}</span>
            </button>
          ))}
        </div>
      )}

      {task.kind === 'numpad' && (
        <NumPad
          value={typed}
          max={task.maxLen}
          disabled={solved}
          lang={lang}
          onChange={(value) => markChanged(() => setTyped(value))}
        />
      )}

      {task.kind === 'match' && (
        <MatchTask
          task={task}
          lang={lang}
          pairs={pairs}
          setPairs={(value) => markChanged(() => setPairs(value))}
          activeLeft={activeLeft}
          setActiveLeft={setActiveLeft}
          solved={solved}
          firstWrong={firstMatchWrong}
        />
      )}

      {task.kind === 'construct' && (
        <ConstructTask
          task={task}
          lang={lang}
          slots={slots}
          setSlots={(value) => markChanged(() => setSlots(value))}
          solved={solved}
        />
      )}

      {task.kind === 'sort' && (
        <SortTask
          task={task}
          lang={lang}
          assignments={assignments}
          setAssignments={(value) => markChanged(() => setAssignments(value))}
          active={activeSort}
          setActive={setActiveSort}
          solved={solved}
          firstWrong={firstSortWrong}
        />
      )}

      {checked && (
        <Feedback
          feedbackRef={feedbackRef}
          ok={solved}
          text={tx(solved ? task.correctText : wrongText, lang)}
          rule={task.rule}
          lang={lang}
        />
      )}

      {!platform && <div className="p4-actions">
        {!solved && (
          <button
            type="button"
            className="p4-btn"
            disabled={!canCheck}
            onClick={check}
          >{tx(UI.check, lang)}</button>
        )}
        {checked && !solved && (
          <button type="button" className="p4-btn p4-btn-ghost" onClick={resetAnswer}>
            {tx(UI.retry, lang)}
          </button>
        )}
        {solved && (
          <button
            type="button"
            className="p4-btn p4-btn-ready"
            disabled={advancing}
            onClick={() => {
              if (advancedRef.current) return;
              advancedRef.current = true;
              setAdvancing(true);
              onSolved(attempts === 1);
            }}
          >{tx(isLast ? UI.finish : UI.next, lang)}</button>
        )}
      </div>}
    </section>
  );
}

export default function Grade4Dars07Practice({ lang: langProp, onFinished }) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = preview ? previewLang : (SUPPORTED_LANGS.includes(langProp) ? langProp : 'uz');
  const [index, setIndex] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [finished, setFinished] = useState(false);
  const completionEmittedRef = useRef(false);
  const task = TASKS[index];
  const completedCount = finished ? TASKS.length : index;
  const percent = Math.round((completedCount / TASKS.length) * 100);

  const onSolved = (wasFirstTry) => {
    const nextFirstTry = firstTry + (wasFirstTry ? 1 : 0);
    if (wasFirstTry) setFirstTry(nextFirstTry);
    if (index + 1 === TASKS.length) {
      if (completionEmittedRef.current) return;
      completionEmittedRef.current = true;
      setFinished(true);
      onFinished?.({
        lessonId: LESSON_META.lessonId,
        lessonTitle: tx(LESSON_META.lessonTitle, lang),
        lessonTitleLocalized: LESSON_META.lessonTitle,
        totalQuestions: 10,
        correctAnswers: nextFirstTry,
        scorePercent: Math.round((nextFirstTry / 10) * 100),
      });
    } else {
      setIndex((current) => current + 1);
    }
  };

  const restart = () => {
    completionEmittedRef.current = false;
    setIndex(0);
    setFirstTry(0);
    setFinished(false);
  };

  return (
    <div className="p4-root">
      <style>{STYLES}</style>
      {preview && (
        <div className="p4-lang" role="group" aria-label={tx(UI.language, lang)}>
          {SUPPORTED_LANGS.map((code) => (
            <button
              key={code}
              type="button"
              className={code === lang ? 'is-active' : ''}
              aria-pressed={code === lang}
              onClick={() => setPreviewLang(code)}
            >{code.toUpperCase()}</button>
          ))}
        </div>
      )}
      <header className="p4-head">
        <div
          className="p4-progress"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax={TASKS.length}
          aria-valuenow={completedCount}
          aria-label={tx(UI.completedTasks, lang)}
        >
          <div className="p4-progress-bar" style={{ width: `${percent}%` }} />
        </div>
        <div className="p4-head-row">
          <h1 className="p4-title">{tx(UI.title, lang)}</h1>
          <span className="p4-counter">{finished ? 10 : index + 1} / 10</span>
        </div>
      </header>
      <main className="p4-main">
        {finished ? (
          <section className="p4-done" aria-labelledby="p4-done-title" aria-live="polite">
            <h2 id="p4-done-title">{tx(UI.done, lang)}</h2>
            <p className="p4-score"><b>{firstTry}</b> <span>{tx(UI.ofTen, lang)}</span></p>
            <p className="p4-note">{tx(UI.firstTryNote, lang)}</p>
            <button type="button" className="p4-btn p4-btn-ready" onClick={restart}>{tx(UI.again, lang)}</button>
          </section>
        ) : (
          <Task
            key={task.id}
            task={task}
            lang={lang}
            isLast={index === TASKS.length - 1}
            onSolved={onSolved}
          />
        )}
      </main>
    </div>
  );
}

const STYLES = `
.p4-root{position:relative;min-height:100%;padding:0 0 24px;font-family:'Manrope',system-ui,sans-serif;color:${T.ink};background:${T.bg}}
.p4-root *,.p4-root *::before,.p4-root *::after{box-sizing:border-box}.p4-root button:focus-visible{outline:3px solid rgba(22,143,163,.45);outline-offset:3px}
.p4-lang{position:absolute;top:8px;right:8px;display:flex;gap:6px;z-index:5}.p4-lang button{min-width:44px;min-height:44px;border:0;border-radius:99px;background:${T.paper};color:${T.ink2};font-weight:800;cursor:pointer;box-shadow:0 4px 12px -8px rgba(23,59,82,.4)}.p4-lang button.is-active{background:${T.accent};color:#fff}
.p4-head{padding:46px clamp(12px,4vw,24px) 8px}.p4-progress{height:6px;border-radius:99px;background:rgba(23,59,82,.12);overflow:hidden}.p4-progress-bar{height:100%;background:linear-gradient(90deg,${T.cyan},${T.accent});transition:width .4s ease}.p4-head-row{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-top:8px}.p4-title{margin:0;font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(15px,2.4vw,19px)}.p4-counter{white-space:nowrap;font:700 13px 'JetBrains Mono',monospace;color:${T.ink3}}
.p4-main{max-width:720px;margin:0 auto;padding:4px clamp(12px,4vw,24px)}.p4-task{display:flex;flex-direction:column;gap:12px;animation:p4-rise .42s ease both}.p4-eyebrow{margin:6px 0 0;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${T.accent}}.p4-setup{margin:0;font-size:clamp(14px,2vw,16px);line-height:1.5;color:${T.ink2}}.p4-ask{margin:2px 0 0;font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(17px,2.6vw,21px);line-height:1.25}.p4-note{margin:0;font-size:13px;line-height:1.45;color:${T.ink3}}
.p4-figure{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 10px;border-radius:16px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}.p4-bignum{font:800 clamp(26px,6vw,40px) 'JetBrains Mono',monospace;color:${T.navy};text-align:center}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.p4-options.is-wide{grid-template-columns:1fr}.p4-option{display:flex;align-items:center;gap:9px;min-height:56px;padding:10px 12px;text-align:left;font-family:inherit;font-weight:700;font-size:clamp(13px,1.9vw,15px);line-height:1.35;color:${T.ink};background:${T.paper};border:1px solid rgba(23,59,82,.12);border-radius:14px;cursor:pointer;transition:transform .22s ease,border-color .22s ease,background .22s ease}.p4-option:hover:not(:disabled){border-color:rgba(22,143,163,.4);transform:translateY(-2px)}.p4-letter{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;background:${T.cyanSoft};color:${T.cyan};font:800 11px 'JetBrains Mono',monospace}.p4-option.is-on{border-color:${T.accent};background:${T.accentSoft}}.p4-option.is-ok{border-color:rgba(34,122,83,.4);background:${T.successSoft};color:${T.success}}.p4-option.is-no{border-color:rgba(169,111,19,.4);background:${T.warnSoft};color:${T.warn}}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:8px;width:min(240px,100%);margin:0 auto;padding:12px;border-radius:18px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8)}.p4-pad-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:50px;border:2px solid ${T.accent};border-radius:13px;background:${T.paper};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;color:${T.navy}}.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:100%}.p4-key{min-height:44px;border:1px solid rgba(23,59,82,.16);border-radius:12px;background:${T.paper};font:800 clamp(18px,3.6vw,22px) 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer}.p4-key-del{background:${T.accentSoft};color:${T.accent}}
.p4-match{display:flex;flex-direction:column;gap:8px}.p4-match-cols{display:flex;gap:10px}.p4-match-col{display:flex;flex-direction:column;gap:8px;flex:1}.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-height:56px;padding:8px 10px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};font:800 clamp(12px,2.2vw,16px) 'Manrope',sans-serif;color:${T.navy};cursor:pointer}.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}.p4-match-item.is-tied{border-color:rgba(34,122,83,.35)}.p4-match-item.is-no{border-color:${T.warn};background:${T.warnSoft}}.p4-tie{font-size:11px;color:${T.success}}.p4-mini-action{align-self:flex-start;min-height:44px;padding:8px 12px;border:0;border-radius:10px;background:transparent;color:${T.ink2};font-family:inherit;font-weight:800;cursor:pointer}
.p4-construct{display:flex;flex-direction:column;align-items:center;gap:12px}.p4-slots,.p4-card-bank{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px}.p4-slot,.p4-symbol-card{display:inline-flex;align-items:center;justify-content:center;width:56px;min-height:58px;border-radius:14px;font:800 27px 'JetBrains Mono',monospace}.p4-slot{border:2px dashed rgba(23,59,82,.2);background:rgba(255,255,255,.45);color:${T.ink3}}.p4-slot.is-filled{border-style:solid;border-color:${T.cyan};background:${T.cyanSoft};color:${T.navy};cursor:pointer}.p4-symbol-card{border:1px solid rgba(23,59,82,.13);background:${T.paper};color:${T.navy};cursor:pointer;box-shadow:0 7px 18px -14px rgba(23,59,82,.55);transition:transform .2s ease}.p4-symbol-card:hover:not(:disabled){transform:translateY(-3px)}.p4-symbol-card.is-used{opacity:.3}
.p4-sort{display:flex;flex-direction:column;gap:10px}.p4-sort-pool{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;min-height:62px;padding:8px;border-radius:14px;background:rgba(255,255,255,.55)}.p4-pool-done{font-size:26px;color:${T.success}}.p4-sort-token{min-width:58px;min-height:44px;padding:8px 12px;border:1px solid rgba(23,59,82,.14);border-radius:12px;background:${T.paper};color:${T.navy};font:800 15px 'JetBrains Mono',monospace;cursor:pointer}.p4-sort-token.is-active{border-color:${T.accent};background:${T.accentSoft};transform:translateY(-2px)}.p4-sort-token.is-placed{min-width:52px}.p4-sort-token.is-no{border-color:${T.warn};background:${T.warnSoft};color:${T.warn}}.p4-sort-bins{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.p4-sort-bin{min-height:126px;padding:8px;border-radius:14px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}.p4-sort-bin-head{width:100%;min-height:44px;padding:8px;border:0;border-radius:10px;background:${T.cyanSoft};color:${T.cyan};font-family:inherit;font-weight:800;cursor:pointer}.p4-sort-bin-head:disabled{cursor:default;opacity:.78}.p4-sort-bin-items{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:6px;padding-top:8px}
.p4-fb{padding:12px 14px;border-radius:14px;animation:p4-rise .35s ease both}.p4-fb.is-ok{background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}.p4-fb.is-no{background:${T.warnSoft};box-shadow:inset 4px 0 0 ${T.warn}}.p4-fb-txt{margin:0;font-family:'Source Serif 4',Georgia,serif;font-size:clamp(14px,2.1vw,16px);line-height:1.45}.p4-rule{margin:8px 0 0;font-size:13px;line-height:1.45;color:${T.ink2}}
.p4-actions{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:10px;margin-top:4px}.p4-btn{min-height:46px;padding:10px 22px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font-family:inherit;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5),inset 0 0 0 1px rgba(255,91,53,.2)}.p4-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.p4-btn-ready{background:${T.accent};color:#fff}.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}.p4-done{display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 12px;text-align:center;animation:p4-rise .42s ease both}.p4-done h2{margin:0;font-family:'Source Serif 4',Georgia,serif}.p4-score{margin:0;font-family:'JetBrains Mono',monospace}.p4-score b{font-size:clamp(32px,7vw,44px);color:${T.success}}.p4-score span{font-size:14px;color:${T.ink3}}
@keyframes p4-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:520px){.p4-options{grid-template-columns:1fr}.p4-match-cols{gap:8px}.p4-match-item{font-size:12px;padding:7px}.p4-sort-bins{grid-template-columns:1fr}.p4-slot,.p4-symbol-card{width:50px;min-height:52px}}
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
