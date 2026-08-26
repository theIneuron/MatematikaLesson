// Dars27 · Amaliyot 10 — Kod · 🔴 · tag: code_smallest_integer
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §9 (27-dars, 10-pozitsiya)
//
// UCH ORALIQ, UCH XIL CHAP CHEGARA (З54):
//   (−4; 0]  chap qavs dumaloq -> minus to'rt kirmaydi -> eng kichigi −3
//   [1; 5)   chap qavs kvadrat -> bir kiradi           -> eng kichigi 1
//   (2; 9)   chap qavs dumaloq -> ikki kirmaydi        -> eng kichigi 3
//
// Ya'ni ikki holda chegaradan keyingi butun son olinadi, bir holda esa
// chegaraning O'ZI. Bankdagi tuzoqlar aynan shu: −4, 2 (chiqarib tashlangan
// chegaralar) va 0 (o'ng chegara, chap emas).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_smallest_integer', level: '🔴',
  expr: ['(−4; 0]', '   ', '[1; 5)', '   ', '(2; 9)'], exprSize: 18,
  cards: ['−4', '−3', '0', '1', '2', '3'],
  answer: ['−3', '1', '3'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch oraliq berilgan, va har birida eng kichik BUTUN sonni topish kerak. Chap qavsning turiga alohida qarang.",
    'В комнате сейф, код трёхзначный. Даны три промежутка, и в каждом надо найти наименьшее ЦЕЛОЕ число. На тип левой скобки смотри отдельно.',
    'There is a safe in the room and its code has three places. Three ranges are given, and in each the smallest WHOLE number must be found. Look at the type of the left bracket separately.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch oraliqning eng kichik butun sonini kodga o'sish tartibida yozing.",
    'Запиши наименьшие целые числа трёх промежутков в код по возрастанию.',
    'Write the smallest whole number of each of the three ranges into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchi oraliqda chap qavs dumaloq: minus to'rt kirmaydi, ya'ni undan keyingi butun son olinadi — minus uch. Ikkinchisida chap qavs kvadrat: birning o'zi kiradi, demak eng kichigi bir. Uchinchisida yana dumaloq qavs: ikki kirmaydi, undan keyingi butun son uch. O'sish tartibida: minus uch, bir, uch. Ikki holda chegaradan KEYINGI son olindi, bir holda esa chegaraning O'ZI — farqni faqat qavs hal qildi.",
    'Верно. В первом промежутке левая скобка круглая: минус четыре не входит, значит берётся следующее целое — минус три. Во втором левая скобка квадратная: сама единица входит, значит наименьшее это единица. В третьем снова круглая: два не входит, следующее целое — три. По возрастанию: минус три, один, три. В двух случаях взято число ПОСЛЕ границы, а в одном — САМА граница, и разницу решила только скобка.',
    'Correct. In the first range the left bracket is round: minus four is out, so the next whole number is taken — minus three. In the second the left bracket is square: one itself is in, so the smallest is one. In the third the bracket is round again: two is out, and the next whole number is three. In increasing order: minus three, one, three. In two cases the number AFTER the boundary was taken, in one case the boundary ITSELF — and only the bracket decided the difference.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('−4') !== -1 || s.slots.indexOf('2') !== -1, text: L(
      "Bu son oraliqqa KIRMAYDI: uning chap qavsi DUMALOQ. Tengsizlik bilan yozing — minus to'rt x dan qat'iy kichik, ya'ni minus to'rtning o'zi to'plamga tegishli emas. Eng kichik butun sonni topish uchun chegaradan keyingi butun sonni oling.",
      'Это число в промежуток НЕ ВХОДИТ: его левая скобка КРУГЛАЯ. Запиши неравенством — минус четыре строго меньше x, значит само минус четыре множеству не принадлежит. Чтобы найти наименьшее целое, возьми следующее целое за границей.',
      'That number is NOT in the range: its left bracket is ROUND. Write it as an inequality — minus four is strictly less than x, so minus four itself does not belong to the set. To find the smallest whole number, take the next whole number past the boundary.') },
    { when: (s) => s.slots.indexOf('0') !== -1, text: L(
      "Nol — birinchi oraliqning O'NG chegarasi, chap emas. Savol eng KICHIK sonni so'rayapti, ya'ni chap tomonga qarash kerak. Nol o'sha oraliqning eng KATTA butun soni bo'ladi (kvadrat qavs uni kiritadi), lekin bu boshqa savol.",
      'Нуль — ПРАВАЯ граница первого промежутка, а не левая. Спрашивают НАИМЕНЬШЕЕ число, значит смотреть надо влево. Нуль будет НАИБОЛЬШИМ целым этого промежутка (квадратная скобка его включает), но это другой вопрос.',
      'Zero is the RIGHT boundary of the first range, not the left one. The question asks for the SMALLEST number, so you must look leftwards. Zero is the LARGEST whole number of that range (the square bracket includes it), but that is a different question.') },
    { when: (s) => s.slots.indexOf('1') === -1, text: L(
      "Kodda bir yo'q, lekin ikkinchi oraliqda eng kichik butun son aynan u. Chap qavsga qarang — u KVADRAT, ya'ni birning o'zi to'plamga kiradi va undan keyingi songa o'tish kerak emas. Uch oraliqda ikki xil qavs turibdi, va har biriga alohida qarash kerak.",
      'В коде нет единицы, а во втором промежутке наименьшее целое именно она. Посмотри на левую скобку — она КВАДРАТНАЯ, значит сама единица входит и переходить к следующему числу не нужно. В трёх промежутках стоят разные скобки, и на каждую надо смотреть отдельно.',
      'The code has no one, yet in the second range one is exactly the smallest whole number. Look at the left bracket — it is SQUARE, so one itself is in and there is no need to move to the next number. The three ranges carry different brackets, and each must be looked at separately.') },
    { when: (s) => s.set, text: L(
      "Uch son to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: minus uch, bir, uch. Manfiy son har qanday musbat sondan kichik.",
      'Три числа найдены верно, а порядок нарушен. Код пишется по возрастанию: минус три, один, три. Отрицательное число меньше любого положительного.',
      'The three numbers are right, the order is not. The code goes in increasing order: minus three, one, three. A negative number is below any positive one.') },
  ],
  wrongText: L(
    "Har oraliqning CHAP qavsiga qarang: kvadrat bo'lsa chegaraning o'zi olinadi, dumaloq bo'lsa undan keyingi butun son. Keyin uch javobni o'sish tartibida joylashtiring.",
    'Смотри на ЛЕВУЮ скобку каждого промежутка: квадратная — берётся сама граница, круглая — следующее целое за ней. Потом расставь три ответа по возрастанию.',
    'Look at the LEFT bracket of each range: square means the boundary itself is taken, round means the next whole number past it. Then put the three answers in increasing order.'),
};

export default function D27_10(props) { return <CodeLock data={DATA} {...props} />; }
