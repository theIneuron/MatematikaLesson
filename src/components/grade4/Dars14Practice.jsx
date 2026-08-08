// ============================================================================
// 4-SINF · 14-DARS AMALIYOTI
// Harakatga doir masalalar: masofa, tezlik va vaqt
// 10 ta baholanadigan topshiriq · 2 asosiy + 5 qo'llash + 3 transfer
// Ovoz, qahramon va avtomatik tushuntirish framelari yo'q.
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

const LESSON_META = {
  lessonId: 'num-4-14-practice',
  lessonTitle: {
    uz: "14-dars amaliyoti: harakatga doir masalalar",
    ru: 'Практика к уроку 14: задачи на движение',
  },
  skillTags: ['distance', 'speed', 'time', 'uniform_motion', 'word_problems'],
};

const SCREEN_META = [
  { id: 'p1', type: 'test', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 'p2', type: 'test', template: 'Matching', scored: true, scope: 'module-mikro' },
  { id: 'p3', type: 'test', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 'p4', type: 'test', template: 'NumInputScreen', scored: true, scope: 'module-mikro' },
  { id: 'p5', type: 'test', template: 'MissingValue', scored: true, scope: 'module-mikro' },
  { id: 'p6', type: 'test', template: 'NumInputScreen', scored: true, scope: 'module-mikro' },
  { id: 'p7', type: 'test', template: 'Matching', scored: true, scope: 'module-mikro' },
  { id: 'p8', type: 'test', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 'p9', type: 'test', template: 'ErrorRepair', scored: true, scope: 'module-mikro' },
  { id: 'p10', type: 'test', template: 'MCScreen', scored: true, scope: 'final' },
];

const UI = {
  title: {
    uz: "14-dars. Amaliyot: masofa, tezlik va vaqt",
    ru: 'Урок 14. Практика: расстояние, скорость и время',
  },
  task: { uz: "Topshiriq", ru: 'Задание' },
  level: {
    green: { uz: "Asosiy", ru: 'Базовое' },
    yellow: { uz: "Qo'llash", ru: 'Применение' },
    red: { uz: "Ko'chirish", ru: 'Перенос' },
  },
  check: { uz: "Tekshirish", ru: 'Проверить' },
  retry: { uz: "Yana urinib ko'ring", ru: 'Попробовать ещё' },
  next: { uz: "Keyingisi", ru: 'Следующее' },
  finish: { uz: "Yakunlash", ru: 'Завершить' },
  rule: { uz: "Eslab qoling", ru: 'Запомните' },
  matchHint: {
    uz: "Avval chapdagi kartani, keyin o'ngdagi mos kartani tanlang.",
    ru: 'Сначала выберите карточку слева, затем подходящую карточку справа.',
  },
  typeAnswer: { uz: "Sonli javobni kiriting", ru: 'Введите числовой ответ' },
  clear: { uz: "O'chirish", ru: 'Стереть' },
  done: { uz: "Amaliyot tugadi", ru: 'Практика завершена' },
  scoreNote: {
    uz: "Birinchi tekshiruvda to'g'ri bajarilgan topshiriqlar.",
    ru: 'Задания, выполненные верно при первой проверке.',
  },
  allSolved: {
    uz: "10 ta topshiriqning barchasi to'g'ri yechildi.",
    ru: 'Все 10 заданий решены верно.',
  },
  again: { uz: "Qaytadan ishlash", ru: 'Пройти заново' },
};

const tx = (value, lang) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return value;
  return value[lang] ?? value.uz ?? value.ru ?? '';
};

const shuffle = (source) => {
  const copy = [...source];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapWith]] = [copy[swapWith], copy[index]];
  }
  return copy;
};

const TASKS = [
  {
    id: '01', level: 'green', kind: 'mc', visual: {
      type: 'known-flow',
      speed: { uz: "85 km/soat", ru: '85 км/ч' },
      time: { uz: "3 soat", ru: '3 часа' },
      answer: { uz: "255 km", ru: '255 км' },
    },
    setup: {
      uz: "Transport 3 soat davomida 85 km/soat tezlikda bir tekis harakat qildi.",
      ru: 'Транспорт двигался равномерно 3 часа со скоростью 85 км/ч.',
    },
    prompt: { uz: "Qaysi kattalik noma'lum?", ru: 'Какая величина неизвестна?' },
    options: [
      { text: { uz: "Masofa", ru: 'Расстояние' }, correct: true },
      {
        text: { uz: "Tezlik", ru: 'Скорость' },
        wrong: {
          uz: "Tezlik berilgan: 85 km/soat. Topilishi kerak bo'lgan kattalik yo'l uzunligidir.",
          ru: 'Скорость уже дана: 85 км/ч. Найти нужно длину пройденного пути.',
        },
      },
      {
        text: { uz: "Vaqt", ru: 'Время' },
        wrong: {
          uz: "Vaqt berilgan: 3 soat. Savolda transport qancha yo'l yurgani noma'lum.",
          ru: 'Время уже дано: 3 часа. Неизвестно, какой путь прошёл транспорт.',
        },
      },
    ],
    hints: [
      { uz: "Berilgan sonlarning birliklariga qarang: km/soat tezlikni, soat vaqtni bildiradi.", ru: 'Посмотрите на единицы: км/ч обозначает скорость, часы обозначают время.' },
      { uz: "Tezlik va vaqt ma'lum bo'lsa, masofa topiladi: 85 ni 3 ga ko'paytiring.", ru: 'Если известны скорость и время, находят расстояние: умножьте 85 на 3.' },
    ],
    correctText: { uz: "To'g'ri. Noma'lum kattalik masofa, u 255 km ga teng.", ru: 'Верно. Неизвестная величина — расстояние, оно равно 255 км.' },
    rule: { uz: "Masofa = tezlik × vaqt.", ru: 'Расстояние = скорость × время.' },
  },
  {
    id: '02', level: 'green', kind: 'match',
    setup: { uz: "Uchta harakat kattaligi o'zaro bog'langan.", ru: 'Три величины движения связаны между собой.' },
    prompt: { uz: "Har bir kattalikni uni topish usuli bilan moslashtiring.", ru: 'Соедините каждую величину со способом её нахождения.' },
    pairs: [
      {
        id: 'speed', left: { uz: "Tezlik", ru: 'Скорость' }, correctRight: 'speed-formula',
        wrong: { uz: "Tezlik bir vaqt birligidagi masofani bildiradi. Masofani vaqtga bo'lish kerak.", ru: 'Скорость показывает путь за единицу времени. Расстояние нужно разделить на время.' },
      },
      {
        id: 'distance', left: { uz: "Masofa", ru: 'Расстояние' }, correctRight: 'distance-formula',
        wrong: { uz: "Masofa har bir vaqt bo'lagidagi yo'lni yig'adi. Tezlikni vaqtga ko'paytiring.", ru: 'Расстояние собирает путь за все единицы времени. Умножьте скорость на время.' },
      },
      {
        id: 'time', left: { uz: "Vaqt", ru: 'Время' }, correctRight: 'time-formula',
        wrong: { uz: "Vaqt nechta tezlik bo'lagi umumiy masofaga sig'ishini ko'rsatadi. Masofani tezlikka bo'ling.", ru: 'Время показывает, сколько скоростных отрезков помещается в общем пути. Разделите расстояние на скорость.' },
      },
    ],
    right: [
      { id: 'speed-formula', text: { uz: "masofa : vaqt", ru: 'расстояние : время' } },
      { id: 'distance-formula', text: { uz: "tezlik × vaqt", ru: 'скорость × время' } },
      { id: 'time-formula', text: { uz: "masofa : tezlik", ru: 'расстояние : скорость' } },
    ],
    hints: [
      { uz: "Faqat so'zga emas, qaysi kattaliklar berilganiga qarang.", ru: 'Смотрите не только на слово, но и на то, какие величины используются.' },
      { uz: "Avval masofa qatorini joylashtiring: tezlikni vaqtga ko'paytirish kerak.", ru: 'Сначала заполните строку расстояния: скорость нужно умножить на время.' },
    ],
    correctText: { uz: "To'g'ri. Uchala bog'lanish ham moslashtirildi.", ru: 'Верно. Все три связи сопоставлены правильно.' },
    rule: { uz: "Avval noma'lum kattalikni aniqlang, keyin mos amalni tanlang.", ru: 'Сначала определите неизвестную величину, затем выберите действие.' },
  },
  {
    id: '03', level: 'yellow', kind: 'mc', visual: { type: 'segments', count: 4, each: { uz: "36 km", ru: '36 км' }, total: { uz: "144 km", ru: '144 км' }, hideTotalUntilSolved: true },
    setup: { uz: "Transport 4 soat yurdi va har bir soatda 36 km yo'l bosdi.", ru: 'Транспорт ехал 4 часа и каждый час проходил 36 км.' },
    prompt: { uz: "Modelga mos amal va natijani tanlang.", ru: 'Выберите действие и результат, соответствующие модели.' },
    options: [
      { text: { uz: "36 × 4 = 144 km", ru: '36 × 4 = 144 км' }, correct: true },
      {
        text: { uz: "36 + 4 = 40 km", ru: '36 + 4 = 40 км' },
        wrong: { uz: "36 masofa, 4 esa vaqt. Turli kattaliklarni qo'shib bo'lmaydi; 36 kilometrlik to'rtta bo'lak bor.", ru: '36 — расстояние, а 4 — время. Складывать разные величины нельзя; есть четыре отрезка по 36 км.' },
      },
      {
        text: { uz: "36 : 4 = 9 km", ru: '36 : 4 = 9 км' },
        wrong: { uz: "36 km bitta soatga tegishli, umumiy masofa emas. To'rtta bir xil bo'lakni birlashtirish kerak.", ru: '36 км относится к одному часу, это не общий путь. Нужно объединить четыре одинаковых отрезка.' },
      },
      {
        text: { uz: "4 : 36", ru: '4 : 36' },
        wrong: { uz: "Vaqtni bir soatdagi masofaga bo'lish masofani bermaydi. Modelda 36 km to'rt marta takrorlangan.", ru: 'Деление времени на путь за час не даёт расстояние. В модели 36 км повторяется четыре раза.' },
      },
    ],
    hints: [
      { uz: "Modeldagi teng bo'laklar sonini va har bir bo'lak qiymatini sanang.", ru: 'Посчитайте число равных отрезков и значение каждого отрезка.' },
      { uz: "36 km to'rt marta olingan, demak 36 ni 4 ga ko'paytiring.", ru: '36 км взято четыре раза, значит, умножьте 36 на 4.' },
    ],
    correctText: { uz: "To'g'ri. To'rtta 36 kilometrlik bo'lak jami 144 km beradi.", ru: 'Верно. Четыре отрезка по 36 км дают 144 км.' },
    rule: { uz: "Masofani topish uchun tezlik vaqtga ko'paytiriladi.", ru: 'Чтобы найти расстояние, скорость умножают на время.' },
  },
  {
    id: '04', level: 'yellow', kind: 'numpad', visual: { type: 'segments', count: 5, total: { uz: "275 km", ru: '275 км' }, answer: { uz: "55 km/soat", ru: '55 км/ч' } }, answer: '55', maxLen: 4, unit: { uz: "km/soat", ru: 'км/ч' },
    setup: { uz: "Avtomobil 275 km masofani 5 soatda bosib o'tdi.", ru: 'Автомобиль прошёл 275 км за 5 часов.' },
    prompt: { uz: "Avtomobil tezligini toping.", ru: 'Найдите скорость автомобиля.' },
    wrongAnswers: {
      1375: { uz: "275 ni 5 ga ko'paytirish masofani yana besh marta oshiradi. Tezlik uchun masofani vaqtga bo'lish kerak.", ru: 'Умножение 275 на 5 увеличивает путь ещё в пять раз. Для скорости нужно разделить расстояние на время.' },
      50: { uz: "50 qulay taxmin, lekin aniq javob emas. 275 ni 5 ga aniq bo'ling.", ru: '50 — удобная оценка, но не точный ответ. Разделите 275 на 5 точно.' },
    },
    wrongDefault: {
      uz: "Kiritilgan sonni 5 ga ko'paytirib tekshiring. Tezlik to'g'ri bo'lsa, 275 km qaytishi kerak.",
      ru: 'Проверьте введённое число умножением на 5. Если скорость верна, должно получиться 275 км.',
    },
    hints: [
      { uz: "Javob 50 km/soatga yaqin bo'lishi kerak. Bo'lish amalidan foydalaning.", ru: 'Ответ должен быть близок к 50 км/ч. Используйте деление.' },
      { uz: "Faqat birinchi hisobni bajaring: 275 ni 5 ga bo'ling.", ru: 'Выполните только первый расчёт: разделите 275 на 5.' },
    ],
    correctText: { uz: "To'g'ri. Avtomobil tezligi 55 km/soat.", ru: 'Верно. Скорость автомобиля равна 55 км/ч.' },
    rule: { uz: "Tezlik = masofa : vaqt.", ru: 'Скорость = расстояние : время.' },
  },
  {
    id: '05', level: 'yellow', kind: 'missing', visual: { type: 'segments', count: 6, each: { uz: "48 km", ru: '48 км' }, total: { uz: "288 km", ru: '288 км' }, concealCountUntilSolved: true },
    setup: { uz: "Transport 288 km masofani 48 km/soat tezlikda bosib o'tdi.", ru: 'Транспорт прошёл 288 км со скоростью 48 км/ч.' },
    prompt: { uz: "Yozuvdagi bo'sh joyni to'ldiring: 288 km : 48 km/soat = □", ru: 'Заполните пропуск: 288 км : 48 км/ч = □' },
    choices: [
      { text: { uz: "6 soat", ru: '6 часов' }, correct: true },
      {
        text: { uz: "336 soat", ru: '336 часов' },
        wrong: { uz: "288 va 48 ni qo'shish vaqtni topmaydi. Masofani tezlikka bo'lish kerak.", ru: 'Сложение 288 и 48 не находит время. Расстояние нужно разделить на скорость.' },
      },
      {
        text: { uz: "13 824 soat", ru: '13 824 часа' },
        wrong: { uz: "Bu 288 ni 48 ga ko'paytirish natijasi. Vaqt noma'lum bo'lsa, bo'lish ishlatiladi.", ru: 'Это результат умножения 288 на 48. Когда неизвестно время, используют деление.' },
      },
      {
        text: { uz: "6 km", ru: '6 км' },
        wrong: { uz: "Son to'g'ri, lekin birlik noto'g'ri. Masofa tezlikka bo'linganda vaqt hosil bo'ladi.", ru: 'Число верное, но единица неверна. При делении расстояния на скорость получается время.' },
      },
    ],
    hints: [
      { uz: "48 kilometrlik nechta bo'lak 288 km ni to'ldirishini sanang.", ru: 'Посчитайте, сколько отрезков по 48 км составляют 288 км.' },
      { uz: "Avval 288 ichida nechta 48 borligini hisoblang.", ru: 'Сначала вычислите, сколько раз 48 содержится в 288.' },
    ],
    correctText: { uz: "To'g'ri. Harakat vaqti 6 soat.", ru: 'Верно. Время движения равно 6 часам.' },
    rule: { uz: "Vaqt = masofa : tezlik; javob vaqt birligida yoziladi.", ru: 'Время = расстояние : скорость; ответ записывают в единицах времени.' },
  },
  {
    id: '06', level: 'yellow', kind: 'numpad', visual: { type: 'trail', count: 6, each: { uz: "90 m", ru: '90 м' }, total: { uz: "540 m", ru: '540 м' } }, answer: '540', maxLen: 4, unit: { uz: "m", ru: 'м' },
    setup: { uz: "Robot 6 minut davomida har minutda 90 metr yurdi.", ru: 'Робот двигался 6 минут и каждую минуту проходил 90 метров.' },
    prompt: { uz: "Robot jami necha metr yurdi?", ru: 'Сколько метров всего прошёл робот?' },
    wrongAnswers: {
      15: { uz: "90 ni 6 ga bo'lish bir minutdagi masofani kichraytiradi. Bu yerda 90 metr olti marta takrorlanadi.", ru: 'Деление 90 на 6 уменьшает путь за минуту. Здесь 90 метров повторяется шесть раз.' },
      96: { uz: "90 va 6 ni qo'shib bo'lmaydi: biri masofa, biri vaqt. Oltita 90 metrlik bo'lakni birlashtiring.", ru: 'Нельзя складывать 90 и 6: это расстояние и время. Объедините шесть отрезков по 90 метров.' },
    },
    wrongDefault: {
      uz: "Kiritilgan masofani 6 ta teng minutga ajrating. Har bir qism 90 metr chiqishi kerak.",
      ru: 'Разделите введённый путь на 6 равных минут. На каждую часть должно приходиться 90 метров.',
    },
    hints: [
      { uz: "Har bir belgi bitta minutni va 90 metr yo'lni bildiradi.", ru: 'Каждая отметка обозначает одну минуту и 90 метров пути.' },
      { uz: "90 ni 6 ga ko'paytiring.", ru: 'Умножьте 90 на 6.' },
    ],
    correctText: { uz: "To'g'ri. Robot 540 metr yurdi.", ru: 'Верно. Робот прошёл 540 метров.' },
    rule: { uz: "Bir xil tezlikda masofa vaqtga mutanosib ortadi.", ru: 'При постоянной скорости расстояние увеличивается пропорционально времени.' },
  },
  {
    id: '07', level: 'yellow', kind: 'match',
    setup: { uz: "Har bir qatorda ikki kattalik berilgan va uchinchisi topilishi kerak.", ru: 'В каждой строке даны две величины, а третью нужно найти.' },
    prompt: { uz: "Vaziyatlarni to'g'ri javoblar bilan moslashtiring.", ru: 'Соедините ситуации с правильными ответами.' },
    pairs: [
      {
        id: 'case-speed', left: { uz: "324 km · 6 soat", ru: '324 км · 6 часов' }, correctRight: 'r-speed',
        wrong: { uz: "Bu qatorda masofa va vaqt berilgan, shuning uchun javob tezlik birligida bo'lishi kerak.", ru: 'В этой строке даны расстояние и время, поэтому ответ должен быть в единицах скорости.' },
      },
      {
        id: 'case-distance', left: { uz: "65 km/soat · 4 soat", ru: '65 км/ч · 4 часа' }, correctRight: 'r-distance',
        wrong: { uz: "Bu qatorda tezlik va vaqt berilgan, natija masofa bo'ladi.", ru: 'В этой строке даны скорость и время, результатом будет расстояние.' },
      },
      {
        id: 'case-time', left: { uz: "315 km · 63 km/soat", ru: '315 км · 63 км/ч' }, correctRight: 'r-time',
        wrong: { uz: "Bu qatorda masofa va tezlik berilgan, natija vaqt birligida bo'lishi kerak.", ru: 'В этой строке даны расстояние и скорость, результат должен быть в единицах времени.' },
      },
    ],
    right: [
      { id: 'r-speed', text: { uz: "54 km/soat", ru: '54 км/ч' } },
      { id: 'r-distance', text: { uz: "260 km", ru: '260 км' } },
      { id: 'r-time', text: { uz: "5 soat", ru: '5 часов' } },
    ],
    hints: [
      { uz: "Avval har bir javobning birligiga qarang: km, soat yoki km/soat.", ru: 'Сначала посмотрите на единицу каждого ответа: км, часы или км/ч.' },
      { uz: "Avval birinchi qatorni yeching: 324 ni 6 ga bo'ling va tezlik birligini tanlang.", ru: 'Сначала решите первую строку: разделите 324 на 6 и выберите единицу скорости.' },
    ],
    correctText: { uz: "To'g'ri. Uchala vaziyat ham natija va birlik bilan moslashtirildi.", ru: 'Верно. Все три ситуации сопоставлены с результатом и единицей.' },
    rule: { uz: "Javob birligi qaysi kattalik topilganini tekshirishga yordam beradi.", ru: 'Единица ответа помогает проверить, какая величина найдена.' },
  },
  {
    id: '08', level: 'red', kind: 'mc', visual: { type: 'comparison' }, wideOptions: true,
    setup: {
      uz: "A transport 276 km ni 4 soatda, B transport 320 km ni 5 soatda bosib o'tdi.",
      ru: 'Транспорт A прошёл 276 км за 4 часа, а транспорт B — 320 км за 5 часов.',
    },
    prompt: { uz: "Qaysi transport tezroq harakat qilgan?", ru: 'Какой транспорт двигался быстрее?' },
    options: [
      { text: { uz: "A: 276 : 4 = 69; B: 320 : 5 = 64. A tezroq.", ru: 'A: 276 : 4 = 69; B: 320 : 5 = 64. A быстрее.' }, correct: true },
      {
        text: { uz: "B tezroq, chunki u 320 km yo'l yurgan.", ru: 'B быстрее, потому что он прошёл 320 км.' },
        wrong: { uz: "Faqat masofani solishtirish yetarli emas: vaqtlar turlicha. Har bir transportning bir soatdagi masofasini toping.", ru: 'Сравнивать только расстояния недостаточно: время различается. Найдите путь каждого транспорта за один час.' },
      },
      {
        text: { uz: "B tezroq, chunki u 5 soat harakat qilgan.", ru: 'B быстрее, потому что он двигался 5 часов.' },
        wrong: { uz: "Ko'proq vaqt harakat qilish tezlik katta ekanini bildirmaydi. Masofani vaqtga bo'lib tezliklarni solishtiring.", ru: 'Большее время движения не означает большую скорость. Разделите расстояние на время и сравните скорости.' },
      },
    ],
    hints: [
      { uz: "Ikki yo'l bir xil soat shkalasida ko'rsatilgan. Har bir soatga qancha masofa to'g'ri kelishini toping.", ru: 'Оба пути показаны на одной шкале времени. Найдите расстояние за каждый час.' },
      { uz: "Avval faqat A transport tezligini toping: 276 ni 4 ga bo'ling.", ru: 'Сначала найдите только скорость транспорта A: разделите 276 на 4.' },
    ],
    correctText: { uz: "To'g'ri. A transportning tezligi 69 km/soat, B transportniki 64 km/soat.", ru: 'Верно. Скорость транспорта A равна 69 км/ч, транспорта B — 64 км/ч.' },
    rule: { uz: "Turli vaqtli yo'llarni tezlik orqali solishtiring, faqat masofa orqali emas.", ru: 'Пути с разным временем сравнивайте по скорости, а не только по расстоянию.' },
  },
  {
    id: '09', level: 'red', kind: 'mc', visual: { type: 'unit-flow', answer: { uz: "5 soat", ru: '5 часов' } }, wideOptions: true,
    setup: { uz: "Operator 350 km yo'l va 70 km/soat tezlik uchun vaqtni 350 × 70 deb hisoblagan.", ru: 'Оператор искал время для пути 350 км и скорости 70 км/ч с помощью действия 350 × 70.' },
    prompt: { uz: "Operator xatosini tuzatadigan yozuvni tanlang.", ru: 'Выберите запись, которая исправляет ошибку оператора.' },
    options: [
      { text: { uz: "350 : 70 = 5 soat", ru: '350 : 70 = 5 часов' }, correct: true },
      {
        text: { uz: "350 × 70 = 24 500 soat", ru: '350 × 70 = 24 500 часов' },
        wrong: { uz: "Bu operatorning xatosini takrorlaydi. Vaqtni topishda masofa tezlikka bo'linadi.", ru: 'Это повторяет ошибку оператора. Чтобы найти время, расстояние делят на скорость.' },
      },
      {
        text: { uz: "350 − 70 = 280 soat", ru: '350 − 70 = 280 часов' },
        wrong: { uz: "Masofadan tezlikni ayirib bo'lmaydi: ular turli kattaliklar. Nechta 70 km lik bo'lak 350 km ga sig'ishini toping.", ru: 'Нельзя вычитать скорость из расстояния: это разные величины. Найдите, сколько отрезков по 70 км помещается в 350 км.' },
      },
      {
        text: { uz: "350 : 70 = 5 km", ru: '350 : 70 = 5 км' },
        wrong: { uz: "Amal to'g'ri, lekin birlik xato. Masofa tezlikka bo'linganda vaqt hosil bo'ladi.", ru: 'Действие верное, но единица ошибочна. При делении расстояния на скорость получается время.' },
      },
    ],
    hints: [
      { uz: "Birliklar oqimini tekshiring: km ni km/soatga bo'lsak, soat qoladi.", ru: 'Проверьте единицы: при делении км на км/ч остаются часы.' },
      { uz: "Faqat kerakli hisobni bajaring: 350 ni 70 ga bo'ling.", ru: 'Выполните только нужный расчёт: разделите 350 на 70.' },
    ],
    correctText: { uz: "To'g'ri. 350 : 70 = 5, demak harakat vaqti 5 soat.", ru: 'Верно. 350 : 70 = 5, значит, время движения равно 5 часам.' },
    rule: { uz: "Vaqt = masofa : tezlik.", ru: 'Время = расстояние : скорость.' },
  },
  {
    id: '10', level: 'red', kind: 'mc', visual: { type: 'timeline' }, wideOptions: true,
    setup: { uz: "Avtomobil bir xil tezlikda avval 2 soat, keyin yana 6 soat yurib, jami 496 km yo'l bosdi.", ru: 'Автомобиль двигался с постоянной скоростью сначала 2 часа, затем ещё 6 часов и прошёл всего 496 км.' },
    prompt: { uz: "Tezlik va ikki qismdagi masofalarni topadigan rejani tanlang.", ru: 'Выберите план, который находит скорость и расстояния на двух участках.' },
    options: [
      {
        text: { uz: "496 : (2 + 6) = 62 km/soat; 62 × 2 = 124 km; 62 × 6 = 372 km", ru: '496 : (2 + 6) = 62 км/ч; 62 × 2 = 124 км; 62 × 6 = 372 км' },
        correct: true,
      },
      {
        text: { uz: "496 ni alohida 2 ga va 6 ga bo'lish", ru: 'Разделить 496 отдельно на 2 и на 6' },
        wrong: { uz: "496 km har bir qismning emas, ikkala qismning umumiy masofasi. Avval jami 8 soat orqali bitta tezlikni toping.", ru: '496 км — общий путь двух участков, а не путь каждого участка. Сначала найдите одну скорость по общим 8 часам.' },
      },
      {
        text: { uz: "Yo'lni teng bo'lib, 248 km va 248 km olish", ru: 'Разделить путь поровну и получить 248 км и 248 км' },
        wrong: { uz: "Vaqt qismlari teng emas: 2 soat va 6 soat. Bir xil tezlikda 6 soatlik qism uch marta uzun bo'ladi.", ru: 'Временные части не равны: 2 часа и 6 часов. При одной скорости шестичасовой участок будет в три раза длиннее.' },
      },
      {
        text: { uz: "496 × 8 = 3 968 km/soat", ru: '496 × 8 = 3 968 км/ч' },
        wrong: { uz: "496 km tezlik emas, umumiy masofa. Tezlikni topish uchun masofani jami vaqtga bo'ling.", ru: '496 км — общий путь, а не скорость. Чтобы найти скорость, разделите путь на общее время.' },
      },
    ],
    hints: [
      { uz: "Avval jami vaqtni toping: 2 + 6 = 8 soat.", ru: 'Сначала найдите общее время: 2 + 6 = 8 часов.' },
      { uz: "Hozir faqat tezlikni toping: 496 ni 8 ga bo'ling.", ru: 'Сейчас найдите только скорость: разделите 496 на 8.' },
    ],
    correctText: { uz: "To'g'ri. Tezlik 62 km/soat, qismlar esa 124 km va 372 km.", ru: 'Верно. Скорость равна 62 км/ч, а участки — 124 км и 372 км.' },
    rule: { uz: "Bir xil tezlikda avval jami vaqt orqali tezlikni, keyin har bir qism masofasini toping.", ru: 'При постоянной скорости сначала найдите скорость по общему времени, затем путь каждого участка.' },
  },
];

function SegmentTrack({ count, each, total, answer, solved, trail = false, hideTotalUntilSolved = false, concealCountUntilSolved = false, hint = false, lang }) {
  const shownTotal = hideTotalUntilSolved && !solved
    ? { uz: "? km", ru: '? км' }
    : total;
  return (
    <div className={`p4-track-card ${trail ? 'is-trail' : ''} ${solved ? 'is-solved' : ''}`} aria-hidden="true">
      <div className={`p4-track-total ${hint && (hideTotalUntilSolved || trail) ? 'is-hint-locus' : ''}`}>{tx(shownTotal, lang) || '?'}</div>
      <div className={`p4-track ${concealCountUntilSolved && !solved ? 'is-pending' : ''} ${hint && concealCountUntilSolved && !solved ? 'is-hint-locus' : ''}`}>
        {concealCountUntilSolved && !solved ? <span className="p4-track-segment">
          <i>?</i><b>{tx(each, lang)} × ?</b>
        </span> : Array.from({ length: count }, (_, index) => (
          <span key={index} className="p4-track-segment">
            <i>{index + 1}</i>
            {each && <b>{tx(each, lang)}</b>}
          </span>
        ))}
      </div>
      {answer && <div className={`p4-visual-answer ${solved ? 'is-shown' : ''} ${hint ? 'is-hint-locus' : ''}`}>{solved ? tx(answer, lang) : '?'}</div>}
    </div>
  );
}

function MotionVisual({ visual, solved, hintLevel = 0, lang }) {
  if (!visual) return null;

  if (visual.type === 'known-flow') {
    return (
      <div className="p4-known-flow" aria-hidden="true">
        <div className="p4-known-chip"><small>{tx({ uz: "Tezlik", ru: 'Скорость' }, lang)}</small><b>{tx(visual.speed, lang)}</b></div>
        <span className="p4-flow-op">×</span>
        <div className="p4-known-chip"><small>{tx({ uz: "Vaqt", ru: 'Время' }, lang)}</small><b>{tx(visual.time, lang)}</b></div>
        <span className="p4-flow-op">→</span>
        <div className={`p4-known-chip is-target ${solved ? 'is-solved' : ''} ${hintLevel >= 2 ? 'is-hint-locus' : ''}`}><small>{tx(solved ? { uz: "Masofa", ru: 'Расстояние' } : { uz: "Noma'lum", ru: 'Неизвестно' }, lang)}</small><b>{solved ? tx(visual.answer, lang) : '?'}</b></div>
      </div>
    );
  }

  if (visual.type === 'segments') {
    return <SegmentTrack count={visual.count} each={visual.each} total={visual.total} answer={visual.answer} solved={solved} hideTotalUntilSolved={visual.hideTotalUntilSolved} concealCountUntilSolved={visual.concealCountUntilSolved} hint={hintLevel >= 2} lang={lang} />;
  }

  if (visual.type === 'trail') {
    return <SegmentTrack count={visual.count} each={visual.each} total={solved ? visual.total : { uz: "? m", ru: '? м' }} solved={solved} trail hint={hintLevel >= 2} lang={lang} />;
  }

  if (visual.type === 'comparison') {
    return (
      <div className={`p4-comparison ${solved ? 'is-solved' : ''}`} aria-hidden="true">
        <div className="p4-time-scale"><div>{[0, 1, 2, 3, 4, 5].map((hour) => <span key={hour}>{hour}</span>)}</div></div>
        <div className={`p4-compare-row ${hintLevel >= 2 ? 'is-hint-locus' : ''}`}><b>A</b><div>{[0, 1, 2, 3, 4].map((part) => <i key={part} className={part < 4 ? 'is-a' : 'is-empty'} />)}</div><span>{solved ? tx({ uz: "69 km/soat", ru: '69 км/ч' }, lang) : tx({ uz: "276 km; 4 soat", ru: '276 км; 4 часа' }, lang)}</span></div>
        <div className="p4-compare-row"><b>B</b><div>{[0, 1, 2, 3, 4].map((part) => <i key={part} className="is-b" />)}</div><span>{solved ? tx({ uz: "64 km/soat", ru: '64 км/ч' }, lang) : tx({ uz: "320 km; 5 soat", ru: '320 км; 5 часов' }, lang)}</span></div>
      </div>
    );
  }

  if (visual.type === 'unit-flow') {
    return (
      <div className={`p4-unit-flow ${solved ? 'is-solved' : ''}`} aria-hidden="true">
        <span>{tx({ uz: "350 km", ru: '350 км' }, lang)}</span><b className={hintLevel >= 2 ? 'is-hint-locus' : ''}>{solved ? ':' : '□'}</b><span>{tx({ uz: "70 km/soat", ru: '70 км/ч' }, lang)}</span><b>→</b><strong>{solved ? tx(visual.answer, lang) : '?'}</strong>
        <small>{tx(solved ? { uz: "km : (km/soat) → soat", ru: 'км : (км/ч) → часы' } : { uz: "Birliklarni tekshiring", ru: 'Проверьте единицы' }, lang)}</small>
      </div>
    );
  }

  if (visual.type === 'timeline') {
    return (
      <div className={`p4-timeline ${solved ? 'is-solved' : ''}`} aria-hidden="true">
        <div className={`p4-timeline-total ${hintLevel >= 2 ? 'is-hint-locus' : ''}`}><span>{tx({ uz: "496 km", ru: '496 км' }, lang)}</span><b>2 + 6 = 8 {tx({ uz: "soat", ru: 'часов' }, lang)}</b></div>
        <div className="p4-timeline-parts"><span className="is-short">2 {tx({ uz: "soat", ru: 'часа' }, lang)}<b>{solved ? tx({ uz: "124 km", ru: '124 км' }, lang) : '?'}</b></span><span className="is-long">6 {tx({ uz: "soat", ru: 'часов' }, lang)}<b>{solved ? tx({ uz: "372 km", ru: '372 км' }, lang) : '?'}</b></span></div>
        <div className={`p4-visual-answer ${solved ? 'is-shown' : ''}`}>{solved ? tx({ uz: "62 km/soat", ru: '62 км/ч' }, lang) : '?'}</div>
      </div>
    );
  }

  return null;
}

function NumPad({ value, onChange, max, disabled, unit, lang }) {
  return (
    <div className="p4-pad">
      <div className="p4-pad-display" aria-live="polite"><span>{value || '0'}</span>{unit && <small>{tx(unit, lang)}</small>}</div>
      <div className="p4-pad-keys" role="group" aria-label={tx(UI.typeAnswer, lang)}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
          <button key={number} type="button" className="p4-key" disabled={disabled} onClick={() => onChange(value.length >= max ? value : value + number)}>{number}</button>
        ))}
        <button type="button" className="p4-key p4-key-del" disabled={disabled} aria-label={tx(UI.clear, lang)} onClick={() => onChange(value.slice(0, -1))}>⌫</button>
      </div>
    </div>
  );
}

function Feedback({ ok, text, rule, lang, feedbackRef }) {
  return (
    <div ref={feedbackRef} className={`p4-fb ${ok ? 'is-ok' : 'is-no'}`} role="status" aria-live="polite">
      <p className="p4-fb-txt">{text}</p>
      {ok && rule && <p className="p4-rule"><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>}
    </div>
  );
}

function Task({ task, screenMeta, lang, isLast, onSolved }) {
  const options = useMemo(() => task.kind === 'mc' ? shuffle(task.options) : [], [task]);
  const missingChoices = useMemo(() => task.kind === 'missing' ? shuffle(task.choices) : [], [task]);
  const rightCards = useMemo(() => task.kind === 'match' ? shuffle(task.right) : [], [task]);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [advancing, setAdvancing] = useState(false);
  const advancedRef = useRef(false);
  const checkingRef = useRef(false);
  const feedbackRef = useRef(null);

  const choiceList = task.kind === 'mc' ? options : missingChoices;
  const solved = checked && (
    ((task.kind === 'mc' || task.kind === 'missing') && choiceList[picked]?.correct === true)
    || (task.kind === 'numpad' && typed === task.answer)
    || (task.kind === 'match' && task.pairs.every((pair) => pairs[pair.id] === pair.correctRight))
  );

  const canCheck = ((task.kind === 'mc' || task.kind === 'missing') && picked !== null)
    || (task.kind === 'numpad' && typed !== '')
    || (task.kind === 'match' && task.pairs.every((pair) => pairs[pair.id]));

  const specificWrong = (() => {
    if (task.kind === 'mc' || task.kind === 'missing') return choiceList[picked]?.wrong;
    if (task.kind === 'numpad') return task.wrongAnswers?.[typed];
    if (task.kind === 'match') return task.pairs.find((pair) => pairs[pair.id] !== pair.correctRight)?.wrong;
    return null;
  })();
  const wrongPairId = task.kind === 'match'
    ? task.pairs.find((pair) => pairs[pair.id] && pairs[pair.id] !== pair.correctRight)?.id
    : null;
  const adaptiveHint = task.hints?.[Math.min(Math.max(attempts - 2, 0), task.hints.length - 1)];
  const wrongText = attempts <= 1
    ? (specificWrong || task.wrongDefault || task.hints?.[0])
    : (adaptiveHint || specificWrong || task.wrongDefault);

  useEffect(() => {
    if (!checked || !feedbackRef.current) return undefined;
    let timer;
    const firstFrame = requestAnimationFrame(() => requestAnimationFrame(() => {
      timer = window.setTimeout(() => {
        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        feedbackRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
      }, 180);
    }));
    return () => {
      cancelAnimationFrame(firstFrame);
      window.clearTimeout(timer);
    };
  }, [checked]);

  const select = (index) => {
    if (solved) return;
    checkingRef.current = false;
    setPicked(index);
    setChecked(false);
  };

  const connect = (rightId) => {
    if (activeLeft === null || solved || Object.values(pairs).includes(rightId)) return;
    checkingRef.current = false;
    setPairs((current) => ({ ...current, [activeLeft]: rightId }));
    setActiveLeft(null);
    setChecked(false);
  };

  const retry = () => {
    checkingRef.current = false;
    setChecked(false);
    setPicked(null);
    setTyped('');
    setPairs({});
    setActiveLeft(null);
  };

  const check = () => {
    if (!canCheck || solved || checkingRef.current) return;
    checkingRef.current = true;
    setAttempts((current) => current + 1);
    setChecked(true);
  };

  const buildAnswer = () => {
    if (task.kind === 'mc' || task.kind === 'missing') {
      const correctIndex = choiceList.findIndex((option) => option.correct);
      return {
        options: choiceList.map((option) => tx(option.text, lang)),
        correctIndex,
        correctAnswer: tx(choiceList[correctIndex]?.text, lang),
        studentAnswerIndex: picked,
        studentAnswer: tx(choiceList[picked]?.text, lang),
      };
    }
    if (task.kind === 'numpad') {
      return {
        options: null,
        correctIndex: null,
        correctAnswer: task.answer,
        studentAnswerIndex: null,
        studentAnswer: typed,
      };
    }
    const studentAnswer = task.pairs.map((pair) => `${tx(pair.left, lang)} → ${tx(task.right.find((right) => right.id === pairs[pair.id])?.text, lang)}`).join(' | ');
    const correctAnswer = task.pairs.map((pair) => `${tx(pair.left, lang)} → ${tx(task.right.find((right) => right.id === pair.correctRight)?.text, lang)}`).join(' | ');
    return {
      options: rightCards.map((right) => tx(right.text, lang)),
      correctIndex: null,
      correctAnswer,
      studentAnswerIndex: null,
      studentAnswer,
    };
  };

  const advance = () => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    setAdvancing(true);
    onSolved({
      taskId: task.id,
      stage: screenMeta.scope,
      question: tx(task.prompt, lang),
      ...buildAnswer(),
      correct: true,
      firstTry: attempts === 1,
      attempts,
      solved: true,
    });
  };

  return (
    <section className="p4-task" aria-labelledby={`p4-question-${task.id}`}>
      <p className={`p4-eyebrow is-${task.level}`}><span>{tx(UI.level[task.level], lang)}</span> · {tx(UI.task, lang)} {task.id}</p>
      <p className="p4-setup">{tx(task.setup, lang)}</p>
      {task.visual && <div className="p4-figure"><MotionVisual visual={task.visual} solved={solved} hintLevel={checked && !solved ? attempts : 0} lang={lang} /></div>}
      <h2 id={`p4-question-${task.id}`} className="p4-ask">{tx(task.prompt, lang)}</h2>

      {task.kind === 'mc' && <div className={`p4-options ${task.wideOptions ? 'is-wide' : ''}`}>{options.map((option, index) => (
        <button key={`${task.id}-${tx(option.text, 'uz')}`} type="button" className={`p4-option ${picked === index ? (checked ? (option.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`} aria-pressed={picked === index} disabled={solved} onClick={() => select(index)}>
          <span className="p4-letter">{'ABCD'[index]}</span><span>{tx(option.text, lang)}</span>
        </button>
      ))}</div>}

      {task.kind === 'missing' && <div className="p4-missing" role="group" aria-label={tx(task.prompt, lang)}>{missingChoices.map((choice, index) => (
        <button key={tx(choice.text, 'uz')} type="button" className={`p4-missing-card ${picked === index ? (checked ? (choice.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`} aria-pressed={picked === index} disabled={solved} onClick={() => select(index)}>{tx(choice.text, lang)}</button>
      ))}</div>}

      {task.kind === 'match' && <div className="p4-match">
        <p className="p4-note">{tx(UI.matchHint, lang)}</p>
        <div className="p4-match-cols">
          <div className="p4-match-col">{task.pairs.map((pair) => (
            <button key={pair.id} type="button" className={`p4-match-item ${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''} ${checked && !solved && attempts >= 2 && wrongPairId === pair.id ? 'is-no' : ''}`} aria-pressed={activeLeft === pair.id} disabled={solved} onClick={() => {
              checkingRef.current = false;
              setPairs((current) => {
                const next = { ...current };
                delete next[pair.id];
                return next;
              });
              setActiveLeft(pair.id);
              setChecked(false);
            }}>
              <span>{tx(pair.left, lang)}</span>{pairs[pair.id] && <b className="p4-tie">{tx(task.right.find((right) => right.id === pairs[pair.id])?.text, lang)}</b>}
            </button>
          ))}</div>
          <div className="p4-match-col">{rightCards.map((right) => {
            const used = Object.values(pairs).includes(right.id);
            return <button key={right.id} type="button" className={`p4-match-item p4-match-right ${used ? 'is-used' : ''}`} aria-pressed={used} disabled={solved || activeLeft === null || used} onClick={() => connect(right.id)}>{tx(right.text, lang)}</button>;
          })}</div>
        </div>
      </div>}

      {task.kind === 'numpad' && <NumPad value={typed} onChange={(value) => { checkingRef.current = false; setTyped(value); setChecked(false); }} max={task.maxLen} disabled={solved} unit={task.unit} lang={lang} />}

      {checked && <Feedback feedbackRef={feedbackRef} ok={solved} text={tx(solved ? task.correctText : wrongText, lang)} rule={task.rule} lang={lang} />}

      <div className="p4-actions">
        {!checked && !solved && <button type="button" className="p4-btn" disabled={!canCheck} onClick={check}>{tx(UI.check, lang)}</button>}
        {checked && !solved && <button type="button" className="p4-btn p4-btn-ghost" onClick={retry}>{tx(UI.retry, lang)}</button>}
        {solved && <button type="button" className="p4-btn p4-btn-ready" disabled={advancing} onClick={advance}>{tx(isLast ? UI.finish : UI.next, lang)}</button>}
      </div>
    </section>
  );
}

export default function Grade4Dars14Practice({ lang: langProp, onFinished }) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = langProp || previewLang;
  const [index, setIndex] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const finishedRef = useRef(false);
  const startedAtRef = useRef(0);
  const task = TASKS[index];
  const completedCount = finished ? TASKS.length : index;
  const percent = Math.round((completedCount / TASKS.length) * 100);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  const handleSolved = (answer) => {
    const completedAnswer = { ...answer, screenIdx: index };
    const nextAnswers = [...answers];
    nextAnswers[index] = completedAnswer;
    setAnswers(nextAnswers);
    const nextFirstTry = firstTry + (answer.firstTry ? 1 : 0);
    if (answer.firstTry) setFirstTry(nextFirstTry);

    if (index + 1 === TASKS.length) {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setFinished(true);
      const attemptsTotal = nextAnswers.reduce((sum, item) => sum + (item?.attempts ?? 0), 0);
      const payload = {
        lessonId: LESSON_META.lessonId,
        lessonTitle: tx(LESSON_META.lessonTitle, lang),
        durationSec: Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000)),
        totalQuestions: TASKS.length,
        correctAnswers: nextFirstTry,
        scorePercent: Math.round((nextFirstTry / TASKS.length) * 100),
        finalScore: nextFirstTry,
        finalTotal: TASKS.length,
        passed: nextFirstTry / TASKS.length >= 0.6,
        firstTryStats: {
          total: TASKS.length,
          firstTryCorrect: nextFirstTry,
          percent: Math.round((nextFirstTry / TASKS.length) * 100),
        },
        attemptsTotal,
        skillTags: LESSON_META.skillTags,
        answers: nextAnswers,
      };
      onFinished?.(payload);
      return;
    }
    setIndex((current) => current + 1);
  };

  const restart = () => {
    finishedRef.current = false;
    startedAtRef.current = Date.now();
    setIndex(0);
    setFirstTry(0);
    setAnswers([]);
    setFinished(false);
  };

  return (
    <div className="p4-root">
      <style>{STYLES}</style>
      {preview && <div className="p4-lang" role="group" aria-label="Language">{['ru', 'uz'].map((code) => (
        <button key={code} type="button" className={code === lang ? 'is-active' : ''} aria-pressed={code === lang} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>
      ))}</div>}
      <header className="p4-head">
        <div className="p4-progress" role="progressbar" aria-label={tx(UI.title, lang)} aria-valuemin="0" aria-valuemax={TASKS.length} aria-valuenow={completedCount}>
          <div className="p4-progress-bar" style={{ width: `${percent}%` }} />
        </div>
        <div className="p4-head-row"><h1 className="p4-title">{tx(UI.title, lang)}</h1><span className="p4-counter">{finished ? 10 : index + 1} / 10</span></div>
      </header>
      <main className="p4-main">
        {finished ? <section className="p4-done" aria-labelledby="p4-done-title" aria-live="polite">
          <span className="p4-done-mark">✓</span>
          <h2 id="p4-done-title">{tx(UI.done, lang)}</h2>
          <p className="p4-score"><b>{firstTry}</b><span>/ 10</span></p>
          <p className="p4-note">{tx(UI.scoreNote, lang)}</p>
          <div className="p4-mastery">
            <strong>{tx(UI.allSolved, lang)}</strong>
            <span>{tx({ uz: "Masofa = tezlik × vaqt", ru: 'Расстояние = скорость × время' }, lang)}</span>
            <span>{tx({ uz: "Tezlik = masofa : vaqt", ru: 'Скорость = расстояние : время' }, lang)}</span>
            <span>{tx({ uz: "Vaqt = masofa : tezlik", ru: 'Время = расстояние : скорость' }, lang)}</span>
          </div>
          <button type="button" className="p4-btn p4-btn-ready" onClick={restart}>{tx(UI.again, lang)}</button>
        </section> : <Task key={task.id} task={task} screenMeta={SCREEN_META[index]} lang={lang} isLast={index === TASKS.length - 1} onSolved={handleSolved} />}
      </main>
    </div>
  );
}

const STYLES = `
.p4-root{position:relative;min-height:100dvh;padding:0 0 24px;overflow-x:hidden;font-family:'Manrope',system-ui,sans-serif;color:${T.ink};background:${T.bg}}
.p4-root *,.p4-root *::before,.p4-root *::after{box-sizing:border-box}.p4-root h1,.p4-root h2,.p4-root p{margin:0}.p4-root button:focus-visible{outline:3px solid rgba(22,143,163,.45);outline-offset:3px}
.p4-lang{position:absolute;top:8px;right:8px;display:flex;gap:6px;z-index:5}.p4-lang button{min-width:44px;min-height:44px;border:0;border-radius:99px;background:${T.paper};color:${T.ink2};font-weight:800;font-size:11px;cursor:pointer;box-shadow:0 4px 12px -8px rgba(23,59,82,.4)}.p4-lang button.is-active{background:${T.accent};color:#fff}
.p4-head{max-width:936px;margin:0 auto;padding:54px clamp(12px,4vw,24px) 8px}.p4-progress{height:6px;border-radius:99px;background:rgba(23,59,82,.12);overflow:hidden}.p4-progress-bar{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.accent});box-shadow:0 0 12px rgba(255,91,53,.35);transition:width .4s ease}.p4-head-row{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-top:8px}.p4-title{min-width:0;font-family:'Source Serif 4',Georgia,serif;font-weight:650;font-size:clamp(15px,2.4vw,19px);line-height:1.2}.p4-counter{flex:0 0 auto;white-space:nowrap;font:800 13px 'JetBrains Mono',monospace;color:${T.ink3}}
.p4-main{width:100%;max-width:936px;margin:0 auto;padding:4px clamp(12px,4vw,24px)}.p4-task{display:flex;flex-direction:column;gap:11px;animation:p4-rise .36s ease both}.p4-eyebrow{font-size:11px;font-weight:850;letter-spacing:.12em;text-transform:uppercase}.p4-eyebrow.is-green{color:${T.success}}.p4-eyebrow.is-yellow{color:${T.warn}}.p4-eyebrow.is-red{color:${T.accent}}.p4-setup{max-width:780px;font-size:clamp(13px,2vw,16px);line-height:1.45;color:${T.ink2}}.p4-ask{font-family:'Source Serif 4',Georgia,serif;font-weight:650;font-size:clamp(17px,2.7vw,22px);line-height:1.25}.p4-note{font-size:12px;line-height:1.4;color:${T.ink3}}
.p4-figure{width:100%;padding:12px;border-radius:17px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.07),0 14px 28px -28px rgba(23,59,82,.42);transition:box-shadow .28s ease,background .28s ease}.p4-figure.is-hint{background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.5),0 14px 28px -28px rgba(23,59,82,.42)}
.p4-known-flow{display:grid;grid-template-columns:minmax(105px,1fr) auto minmax(105px,1fr) auto minmax(105px,1fr);align-items:center;gap:8px;max-width:690px;margin:0 auto}.p4-known-chip{min-width:0;min-height:58px;padding:8px;border-radius:13px;display:grid;place-items:center;gap:3px;text-align:center;background:${T.cyanSoft};color:${T.cyan};transition:background .32s ease,box-shadow .32s ease}.p4-known-chip small{font-size:10px;font-weight:800}.p4-known-chip b{font:850 clamp(13px,2.3vw,18px) 'JetBrains Mono',monospace;color:${T.navy}}.p4-known-chip.is-target{background:${T.accentSoft};color:${T.accent}}.p4-known-chip.is-target.is-solved{background:${T.successSoft};color:${T.success}}.p4-flow-op{color:${T.accent};font:900 20px 'JetBrains Mono',monospace}
.p4-track-card{display:grid;gap:7px;max-width:740px;margin:0 auto}.p4-track-total{text-align:center;font:850 15px 'JetBrains Mono',monospace;color:${T.navy}}.p4-track{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:4px;min-width:0}.p4-track-segment{position:relative;min-width:0;min-height:45px;padding:5px 2px;border-radius:9px;display:grid;place-items:center;background:${T.cyanSoft};box-shadow:inset 0 -4px rgba(22,143,163,.12)}.p4-track-segment::after{content:'';position:absolute;right:-4px;top:50%;width:5px;height:2px;background:${T.accent}}.p4-track-segment:last-child::after{display:none}.p4-track-segment i{width:19px;height:19px;border-radius:50%;display:grid;place-items:center;background:${T.cyan};color:#fff;font:normal 800 9px 'JetBrains Mono',monospace}.p4-track-segment b{min-width:0;text-align:center;font:800 clamp(8px,1.7vw,11px) 'JetBrains Mono',monospace;color:${T.navy};overflow-wrap:anywhere}.p4-track-card.is-trail .p4-track-segment{background:linear-gradient(90deg,${T.cyanSoft},${T.accentSoft})}.p4-visual-answer{justify-self:center;min-width:86px;padding:6px 12px;border-radius:10px;text-align:center;background:#F0F2F2;color:${T.ink3};font:850 13px 'JetBrains Mono',monospace;transition:.28s ease}.p4-visual-answer.is-shown{background:${T.successSoft};color:${T.success}}
.p4-comparison{display:grid;gap:7px;max-width:780px;margin:0 auto}.p4-time-scale{display:grid;grid-template-columns:32px minmax(0,1fr) 120px;gap:7px;color:${T.ink3};font:700 9px 'JetBrains Mono',monospace}.p4-time-scale>div{grid-column:2;display:flex;justify-content:space-between}.p4-compare-row{display:grid;grid-template-columns:32px minmax(0,1fr) 120px;align-items:center;gap:7px}.p4-compare-row>b{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;background:${T.navy};color:#fff;font:850 12px 'JetBrains Mono',monospace}.p4-compare-row>div{display:grid;grid-template-columns:repeat(5,1fr);gap:4px}.p4-compare-row i{min-height:26px;border-radius:7px}.p4-compare-row i.is-a{background:${T.cyan}}.p4-compare-row i.is-b{background:${T.accent}}.p4-compare-row i.is-empty{background:#E9ECEC}.p4-compare-row>span{text-align:right;font:750 10px 'JetBrains Mono',monospace;color:${T.ink2}}
.p4-unit-flow{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;max-width:700px;margin:0 auto}.p4-unit-flow>span,.p4-unit-flow>strong{padding:9px 12px;border-radius:11px;background:${T.cyanSoft};color:${T.navy};font:850 clamp(13px,2.5vw,18px) 'JetBrains Mono',monospace}.p4-unit-flow>strong{min-width:76px;text-align:center;background:${T.successSoft};color:${T.success}}.p4-unit-flow>b{color:${T.accent};font:900 19px 'JetBrains Mono',monospace}.p4-unit-flow>small{flex-basis:100%;text-align:center;color:${T.ink3};font:750 10px 'JetBrains Mono',monospace}
.p4-timeline{display:grid;gap:8px;max-width:760px;margin:0 auto}.p4-timeline-total{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:7px 10px;border-radius:11px;background:${T.cyanSoft};color:${T.navy};font:800 12px 'JetBrains Mono',monospace}.p4-timeline-parts{display:grid;grid-template-columns:2fr 6fr;gap:5px}.p4-timeline-parts>span{min-width:0;min-height:48px;padding:7px;border-radius:10px;display:grid;place-items:center;text-align:center;background:${T.accentSoft};color:${T.accent};font:800 11px 'JetBrains Mono',monospace}.p4-timeline-parts>span.is-long{background:${T.cyanSoft};color:${T.cyan}}.p4-timeline-parts b{font-size:12px;color:${T.navy}}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.p4-options.is-wide{grid-template-columns:1fr}.p4-option{display:flex;align-items:center;gap:9px;min-width:0;min-height:54px;padding:9px 11px;text-align:left;font-family:inherit;font-weight:750;font-size:clamp(12px,1.8vw,15px);line-height:1.35;color:${T.ink};background:${T.paper};border:1px solid rgba(23,59,82,.11);border-radius:13px;cursor:pointer;transition:transform .18s ease,border-color .18s ease,background .18s ease}.p4-option:hover:not(:disabled){border-color:rgba(22,143,163,.4);transform:translateY(-1px)}.p4-option:disabled{cursor:default}.p4-letter{flex:0 0 auto;width:27px;height:27px;border-radius:8px;display:grid;place-items:center;background:${T.cyanSoft};color:${T.cyan};font:850 10px 'JetBrains Mono',monospace}.p4-option.is-on{border-color:${T.accent};background:${T.accentSoft}}.p4-option.is-ok{border-color:rgba(34,122,83,.42);background:${T.successSoft};color:${T.success}}.p4-option.is-no{border-color:rgba(169,111,19,.42);background:${T.warnSoft};color:${T.warn}}
.p4-missing{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.p4-missing-card{min-height:52px;padding:8px 10px;border:1px solid rgba(23,59,82,.12);border-radius:13px;background:${T.paper};color:${T.navy};font:850 clamp(14px,2.5vw,18px) 'JetBrains Mono',monospace;cursor:pointer;transition:border-color .18s ease,background .18s ease,color .18s ease}.p4-missing-card.is-on{border-color:${T.accent};background:${T.accentSoft}}.p4-missing-card.is-ok{border-color:rgba(34,122,83,.42);background:${T.successSoft};color:${T.success}}.p4-missing-card.is-no{border-color:rgba(169,111,19,.42);background:${T.warnSoft};color:${T.warn}}
.p4-match-cols{display:flex;gap:9px}.p4-match-col{display:flex;flex:1 1 0;min-width:0;flex-direction:column;gap:7px}.p4-match-item{display:flex;min-width:0;min-height:52px;padding:7px 9px;border:1px solid rgba(23,59,82,.12);border-radius:12px;align-items:center;justify-content:center;flex-direction:column;gap:3px;text-align:center;background:${T.paper};color:${T.navy};font:800 clamp(11px,1.9vw,14px) 'Manrope',sans-serif;line-height:1.25;overflow-wrap:anywhere;cursor:pointer;transition:border-color .18s ease,background .18s ease,color .18s ease}.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}.p4-match-item.is-tied{border-color:rgba(34,122,83,.35)}.p4-match-item.is-no{border-color:${T.warn};background:${T.warnSoft};color:${T.warn}}.p4-match-item.is-used{background:${T.successSoft}}.p4-match-item:disabled{cursor:default;opacity:.62}.p4-tie{color:${T.success};font:800 10px 'JetBrains Mono',monospace}
.p4-track-total.is-hint-locus,.p4-track.is-hint-locus,.p4-visual-answer.is-hint-locus,.p4-compare-row.is-hint-locus,.p4-timeline-total.is-hint-locus,.p4-known-chip.is-hint-locus{border-radius:9px;box-shadow:0 0 0 3px rgba(255,91,53,.38)}.p4-unit-flow>b.is-hint-locus{min-width:34px;border-radius:9px;background:${T.accentSoft};box-shadow:0 0 0 3px rgba(255,91,53,.32);text-align:center}
.p4-track-card.is-solved .p4-track-total,.p4-comparison.is-solved,.p4-unit-flow.is-solved,.p4-timeline.is-solved{animation:p4-math-pop .32s ease both}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:7px;width:min(228px,100%);margin:0 auto;padding:10px;border-radius:17px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8)}.p4-pad-display{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:46px;border:2px solid ${T.accent};border-radius:12px;background:${T.paper};color:${T.navy};font:850 clamp(19px,4vw,24px) 'JetBrains Mono',monospace}.p4-pad-display small{font-size:10px;color:${T.ink2}}.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;width:100%}.p4-key{min-width:44px;min-height:44px;border:1px solid rgba(23,59,82,.14);border-radius:11px;background:${T.paper};color:${T.navy};font:850 18px 'JetBrains Mono',monospace;cursor:pointer}.p4-key-del{background:${T.accentSoft};color:${T.accent}}
.p4-fb{padding:11px 13px;border-radius:13px;animation:p4-rise .3s ease both}.p4-fb.is-ok{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.p4-fb.is-no{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.p4-fb-txt{font-family:'Source Serif 4',Georgia,serif;font-size:clamp(13px,2vw,16px);line-height:1.42}.p4-rule{margin-top:6px!important;font-size:12px;line-height:1.4;color:${T.ink2}}
.p4-actions{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:9px;margin-top:2px}.p4-btn{min-height:46px;padding:9px 21px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font-family:inherit;font-weight:850;font-size:14px;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5),inset 0 0 0 1px rgba(255,91,53,.2)}.p4-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.p4-btn-ready{background:${T.accent};color:#fff}.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}
.p4-done{display:flex;max-width:680px;margin:0 auto;flex-direction:column;align-items:center;gap:9px;padding:18px 12px;text-align:center;animation:p4-rise .36s ease both}.p4-done-mark{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:${T.success};color:#fff;font-size:24px;font-weight:900}.p4-done h2{font-family:'Source Serif 4',Georgia,serif;font-size:clamp(22px,4vw,30px)}.p4-score{display:flex;align-items:baseline;gap:5px;font-family:'JetBrains Mono',monospace}.p4-score b{font-size:clamp(34px,7vw,46px);color:${T.success}}.p4-score span{font-size:15px;color:${T.ink3}}.p4-mastery{width:100%;padding:12px;border-radius:15px;display:grid;gap:6px;text-align:left;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.07)}.p4-mastery strong{color:${T.success};font-size:13px}.p4-mastery span{padding:6px 9px;border-radius:9px;background:${T.cyanSoft};color:${T.navy};font:750 12px 'JetBrains Mono',monospace}
@keyframes p4-rise{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}@keyframes p4-math-pop{from{opacity:.72;transform:scale(.985)}to{opacity:1;transform:none}}
@media(max-width:520px){.p4-head{padding-top:58px}.p4-main{padding-top:1px}.p4-task{gap:9px}.p4-figure{padding:9px}.p4-known-flow{grid-template-columns:1fr auto 1fr;gap:5px}.p4-known-flow .p4-flow-op:nth-of-type(2){display:none}.p4-known-chip.is-target{grid-column:1/-1;min-height:46px}.p4-options{grid-template-columns:1fr}.p4-option{min-height:50px;padding:8px 10px}.p4-time-scale{grid-template-columns:28px minmax(0,1fr);padding-right:0}.p4-compare-row{grid-template-columns:28px minmax(0,1fr)}.p4-compare-row>span{grid-column:2;text-align:center;font-size:9px}.p4-match-cols{gap:6px}.p4-match-item{min-height:50px;padding:6px 5px;font-size:10px}.p4-timeline-total{font-size:10px}.p4-timeline-parts>span{font-size:10px}.p4-mastery span{font-size:10px}}
@media(max-width:390px){.p4-title{font-size:14px}.p4-counter{font-size:11px}.p4-setup{font-size:13px}.p4-ask{font-size:17px}.p4-track-segment b{font-size:8px}.p4-unit-flow>span,.p4-unit-flow>strong{padding:8px;font-size:12px}}
@media(prefers-reduced-motion:reduce){.p4-root *,.p4-root *::before,.p4-root *::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}}
`;
