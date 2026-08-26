// Dars29 · Amaliyot 08 — Kod · 🔴 · tag: code_negative_roots
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §11 (29-dars, 8-pozitsiya)
//
// SAVOL ATAYLAB MANFIY ILDIZNI SO'RAYDI (З58): eng ko'p uchraydigan xato —
// javobda faqat musbat ildizni qoldirish, va bu topshiriq aynan unutilgan
// ildizni izlatadi.
//
// Uchinchi tenglama alohida: modul ichida AYIRMA turibdi, ya'ni ildizlar
// nolga simmetrik EMAS. x minus ikki plyus-minus beshga teng, ya'ni
// ildizlar yetti va minus uch — markaz nolda emas, IKKIDA.
// Bankdagi tuzoqlar: 6, 1 va 3 — o'sha uch tenglamaning musbat ildizlari.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_negative_roots', level: '🔴',
  expr: ['|x| = 6', '   ', '|x| = 1', '   ', '|x − 2| = 5'], exprSize: 17,
  cards: ['−6', '−3', '−1', '1', '3', '6'],
  answer: ['−6', '−3', '−1'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch tenglamaning har birida ikkita ildiz bor, lekin kodga faqat MANFIY ildiz yoziladi.",
    'В комнате сейф, код трёхзначный. У каждого из трёх уравнений два корня, но в код записывается только ОТРИЦАТЕЛЬНЫЙ.',
    'There is a safe in the room and its code has three places. Each of the three equations has two roots, but only the NEGATIVE one goes into the code.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch tenglamaning manfiy ildizini kodga o'sish tartibida yozing.",
    'Запиши отрицательные корни трёх уравнений в код по возрастанию.',
    'Write the negative root of each of the three equations into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchi ikkitasida ildizlar nolga simmetrik: minus olti va minus bir. Uchinchisida esa modul ichida ayirma turibdi — ildizlar ikkiga simmetrik: yetti va minus uch. O'sish tartibida: minus olti, minus uch, minus bir.",
    'Верно. В первых двух корни симметричны нулю: минус шесть и минус один. А в третьем внутри модуля разность — корни симметричны двойке: семь и минус три. По возрастанию: минус шесть, минус три, минус один.',
    'Correct. In the first two the roots are symmetric about zero: minus six and minus one. In the third a difference stands inside the bars — the roots are symmetric about two: seven and minus three. In increasing order: minus six, minus three, minus one.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('6') !== -1 || s.slots.indexOf('1') !== -1 || s.slots.indexOf('3') !== -1, text: L(
      "Bu son MUSBAT ildiz, savol esa manfiysini so'ragan. Har tenglamada ikkita ildiz bor, va bu topshiriq ataylab unutilib ketadigan ildizni izlatadi: modulli tenglamada javob bitta emas. Musbat ildizni topganingizdan keyin uning juftini ham yozib qo'ying.",
      'Это число — ПОЛОЖИТЕЛЬНЫЙ корень, а спрашивают отрицательный. У каждого уравнения по два корня, и это задание нарочно заставляет искать тот, который забывают: у уравнения с модулем ответ не один. Найдя положительный корень, выпиши и его пару.',
      'That number is the POSITIVE root, while the negative one is asked for. Each equation has two roots, and this task deliberately hunts for the one that gets forgotten: an equation with an absolute value has more than one answer. Once you find the positive root, write out its partner as well.') },
    { when: (s) => s.slots.indexOf('−3') === -1, text: L(
      "Kodda minus uch yo'q. Uchinchi tenglamaga qarang: modul ichida x ning o'zi emas, x minus ikki turibdi. Demak x minus ikki beshga yoki minus beshga teng. Birinchisidan x yetti, ikkinchisidan x minus uch chiqadi. Bu ildizlar nolga simmetrik emas — ular ikkiga simmetrik, chunki modul ichidagi ifoda aynan ikkida nolga aylanadi.",
      'В коде нет минус трёх. Посмотри на третье уравнение: внутри модуля не сам x, а x минус два. Значит x минус два равно пяти или минус пяти. Из первого выходит x равен семи, из второго x равен минус трём. Эти корни не симметричны нулю — они симметричны двойке, ведь выражение внутри модуля обращается в нуль именно при двух.',
      'The code has no minus three. Look at the third equation: inside the bars stands x minus two, not x itself. So x minus two equals five or minus five. The first gives x equals seven, the second x equals minus three. These roots are not symmetric about zero — they are symmetric about two, since the expression inside vanishes exactly at two.') },
    { when: (s) => s.set, text: L(
      "Uch son to'g'ri topilgan, tartib esa buzilgan. Manfiy sonlarni o'sish tartibida joylashtirish uchun son o'qiga qarang: minus olti eng chapda, keyin minus uch, keyin minus bir. Moduli katta bo'lgan manfiy son KICHIKROQ.",
      'Три числа найдены верно, а порядок нарушен. Чтобы расставить отрицательные по возрастанию, смотри на числовую прямую: минус шесть левее всех, потом минус три, потом минус один. Отрицательное число с большим модулем МЕНЬШЕ.',
      'The three numbers are right, the order is not. To arrange negatives in increasing order, look at the number line: minus six is furthest left, then minus three, then minus one. A negative number with a larger magnitude is SMALLER.') },
  ],
  wrongText: L(
    "Har tenglamada ikkala ildizni ham toping, keyin manfiysini oling. Modul ichida ayirma tursa, ildizlar nolga emas, o'sha songa simmetrik bo'ladi.",
    'В каждом уравнении найди оба корня, потом возьми отрицательный. Если внутри модуля стоит разность, корни симметричны не нулю, а тому числу.',
    'Find both roots of each equation, then take the negative one. If a difference stands inside the bars, the roots are symmetric not about zero but about that number.'),
};

export default function D29_08(props) { return <CodeLock data={DATA} {...props} />; }
