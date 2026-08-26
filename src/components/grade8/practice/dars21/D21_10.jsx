// Dars21 · Amaliyot 10 — Tenglama · 🔴 · tag: time_units
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §3 (21-dars, 10-pozitsiya)
//
// DARSNING O'Z SAHNASI (Dars21.jsx xuki): avtobus va taksi bir yo'lni
// bosadi, taksi tezroq va oldin yetib keladi. Javob: 60 va 80.
//
// Uch xato variant uch xil yo'l:
//   = 10        — daqiqa soatga o'tkazilmadi (З45). Vaqt SOATDA yozilgan
//                 (40 bo'lingan v), o'ng tomonda esa daqiqa turibdi;
//   ayirma teskari — taksi tezroq, ya'ni uning VAQTI kam: kattadan kichik
//                 ayiriladi;
//   yig'indi    — «10 daqiqa ko'p» degani ayirma, yig'indi emas.
// Bu topshiriq kasr-ratsional tenglama (20-dars): maxrajlar v va v + 20.
// Variantlar aralashtiriladi (Choice ichida), razbor shartlari ASL raqamda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'time_units', level: '🔴',
  correct: 0, optCols: 1, optSize: 15,
  eyebrow: L('Tenglama', 'Уравнение', 'The equation'),
  setup: L(
    "Avtobus va taksi bitta 40 km yo'lni bosib o'tdi. Taksining tezligi avtobusnikidan 20 km/soat ortiq, va u yo'lni 10 daqiqa kam vaqtda bosdi. Avtobusning tezligi v deb belgilangan.",
    'Автобус и такси прошли один и тот же путь в 40 км. Скорость такси на 20 км/ч больше, и путь оно прошло на 10 минут быстрее. Скорость автобуса обозначена через v.',
    'A bus and a taxi covered the same 40 km route. The taxi is 20 km/h faster and covered the route 10 minutes sooner. The speed of the bus is denoted by v.'),
  ask: L(
    'Qaysi tenglama masala shartiga mos keladi?',
    'Какое уравнение соответствует условию задачи?',
    "Which equation matches the problem's condition?"),
  opts: [
    { label: [{ n: '40', d: 'v' }, '−', { n: '40', d: 'v + 20' }, '=', { n: '1', d: '6' }] },
    { label: [{ n: '40', d: 'v' }, '−', { n: '40', d: 'v + 20' }, '= 10'] },
    { label: [{ n: '40', d: 'v + 20' }, '−', { n: '40', d: 'v' }, '=', { n: '1', d: '6' }] },
    { label: [{ n: '40', d: 'v' }, '+', { n: '40', d: 'v + 20' }, '=', { n: '1', d: '6' }] },
  ],
  correctText: L(
    "To'g'ri. Vaqt — yo'lning tezlikka bo'linmasi. Avtobus ko'proq vaqt sarfladi, shuning uchun uning vaqtidan taksinikini ayiramiz. O'ng tomonda ham SOAT turishi kerak: o'n daqiqa soatning oltidan biri. Tekshirish: v teng oltmishda ayirma oltidan bir soat.",
    'Верно. Время — это путь, делённый на скорость. Автобус потратил больше времени, поэтому из его времени вычитаем время такси. Справа тоже должны стоять ЧАСЫ: десять минут это одна шестая часа. Проверка: при v равном шестидесяти разность одна шестая часа.',
    'Correct. Time is distance divided by speed. The bus spent more time, so we subtract the taxi time from the bus time. The right side must carry HOURS too: ten minutes is one sixth of an hour. Check: at v equal to sixty the difference is one sixth of an hour.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
        "Chap tomon to'g'ri, o'ngda esa BIRLIK mos kelmayapti: qirq bo'lingan v soat beradi, o'n esa daqiqa. O'n daqiqani soatga o'tkazing: o'n bo'lingan oltmish, ya'ni oltidan bir.",
        'Левая часть верна, а справа не сходятся ЕДИНИЦЫ: сорок делить на v даёт часы, а десять — это минуты. Переведи десять минут в часы: десять делить на шестьдесят, то есть одна шестая.',
        'The left side is right, but the UNITS on the right do not match: forty over v gives hours, while ten is minutes. Convert ten minutes to hours: ten over sixty, that is one sixth.') },
    { when: (s) => s.picked === 2, text: L(
      "Ayirma TESKARI olingan. Taksining tezligi katta, ya'ni u o'sha yo'lni KAMROQ vaqtda bosadi. Kichik vaqtdan kattasini ayirsangiz manfiy son chiqadi, o'ng tomonda esa musbat oltidan bir turibdi. Tekshiring: v teng oltmishda yarim soatdan uch uchdan ikki soatni ayirsangiz minus oltidan bir chiqadi.",
      'Разность взята НАОБОРОТ. Скорость такси больше, значит тот же путь оно проходит за МЕНЬШЕЕ время. Если из меньшего времени вычесть большее, выйдет отрицательное число, а справа стоит положительная одна шестая. Проверь: при v равном шестидесяти из получаса вычесть две трети часа даёт минус одну шестую.',
      'The difference is taken the WRONG WAY ROUND. The taxi is faster, so it covers the same route in LESS time. Subtracting the greater time from the smaller one gives a negative number, while the right side is a positive one sixth. Check: at v equal to sixty, half an hour minus two thirds of an hour is minus one sixth.') },
    { when: (s) => s.picked === 3, text: L(
      "Bu yerda ikki vaqt QO'SHILGAN, shartda esa ular taqqoslangan: bittasi ikkinchisidan o'n daqiqa ko'p. «Ko'p» degan so'z AYIRMANI beradi, yig'indini emas. Yig'indi ikki mashinaning umumiy vaqti bo'lardi, va u oltidan bir soatdan ancha katta chiqadi.",
      'Здесь два времени СЛОЖЕНЫ, а в условии они сравниваются: одно на десять минут больше другого. Слово «больше» даёт РАЗНОСТЬ, а не сумму. Сумма была бы общим временем двух машин, и она много больше одной шестой часа.',
      'Here the two times are ADDED, but the condition compares them: one is ten minutes greater than the other. The word «greater» gives a DIFFERENCE, not a sum. A sum would be the total time of both vehicles, and it is far more than one sixth of an hour.') },
  ],
  wrongText: L(
    "Vaqt — yo'lni tezlikka bo'lish. Kim ko'p vaqt sarflagan bo'lsa, ayirma o'shanikidan boshlanadi. Ikki tomonning birligi bir xil bo'lsin: tezlik soatda berilgan, demak daqiqani soatga o'tkazing.",
    'Время — это путь, делённый на скорость. Разность начинается с того, кто потратил больше времени. Единицы в обеих частях должны совпадать: скорость дана в часах, значит переведи минуты в часы.',
    'Time is distance divided by speed. The difference starts from whoever spent more time. The units on both sides must agree: the speed is per hour, so convert the minutes to hours.'),
};

export default function D21_10(props) { return <Choice data={DATA} {...props} />; }
