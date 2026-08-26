// Dars24 · Amaliyot 04 — Kod · 🟡 · tag: code_smaller_side
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §6 (24-dars, 4-pozitsiya)
//
// SAVOL ATAYLAB «KICHIK TOMON» HAQIDA. Ikkinchi qatorda kichik tomon
// ALMASHADI: ko'paytirishdan oldin uch kichik edi, minus birga
// ko'paytirilgandan keyin esa minus besh kichik bo'lib qoladi. Ya'ni
// «kichik tomon o'z joyida qoladi» degan qarash shu yerda buziladi (T2).
//
//   3 < 5   ×2     -> 6 va 10,   kichigi 6
//   3 < 5   ×(−1)  -> −3 va −5,  kichigi −5
//   2 > 1   ×3     -> 6 va 3,    kichigi 3
// Bankdagi tuzoqlar — o'sha uch qatorning KATTA tomonlari: −3, 5, 10.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_smaller_side', level: '🟡',
  expr: ['3 < 5  ×2', '   ', '3 < 5  ×(−1)', '   ', '2 > 1  ×3'], exprSize: 15,
  cards: ['−5', '−3', '3', '5', '6', '10'],
  answer: ['−5', '3', '6'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch tengsizlikning ikkala qismi berilgan songa ko'paytirildi. Har natijaning KICHIK tomonini topish kerak.",
    'В комнате сейф, код трёхзначный. У трёх неравенств обе части умножили на указанное число. Надо найти МЕНЬШУЮ сторону каждого результата.',
    'There is a safe in the room and its code has three places. Both sides of three inequalities were multiplied by the given number. Find the SMALLER side of each result.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch natijaning kichik tomonini kodga o'sish tartibida yozing.",
    'Запиши меньшие стороны трёх результатов в код по возрастанию.',
    'Write the smaller side of each of the three results into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchi qatorda kichigi olti, uchinchisida uch — ishora saqlanadi. Ikkinchi qatorda esa minus birga ko'paytirilgandan keyin KICHIK tomon almashadi: uch minus uchga, besh minus beshga aylanadi, va endi minus besh kichik. O'sish tartibida: minus besh, uch, olti.",
    'Верно. В первой строке меньшее шесть, в третьей три — знак сохраняется. А во второй после умножения на минус один МЕНЬШАЯ сторона меняется: три становится минус три, пять минус пять, и теперь меньшее это минус пять. По возрастанию: минус пять, три, шесть.',
    'Correct. In the first line the smaller is six, in the third three — the sign is kept. In the second, after multiplying by minus one, the SMALLER side changes: three becomes minus three, five becomes minus five, and now minus five is the smaller. In increasing order: minus five, three, six.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('−3') !== -1, text: L(
      "Ikkinchi qatorda minus uch KICHIK emas, KATTA. Ikkala son ham manfiy: minus uch va minus besh. Son o'qida minus besh chapda turadi, ya'ni u kichik. Aynan shu joyda tomonlar almashadi — bu qator shuning uchun qo'yilgan.",
      'Во второй строке минус три не МЕНЬШЕ, а БОЛЬШЕ. Оба числа отрицательны: минус три и минус пять. На числовой прямой минус пять левее, значит меньше именно он. Ровно здесь стороны и меняются местами — ради этого строка и поставлена.',
      'In the second line minus three is not the SMALLER but the GREATER. Both numbers are negative: minus three and minus five. On the number line minus five lies further left, so it is the smaller one. This is exactly where the sides swap — that is why this line is here.') },
    { when: (s) => s.slots.indexOf('10') !== -1 || s.slots.indexOf('5') !== -1, text: L(
      "Bu son KATTA tomonda turibdi, savol esa kichik tomonni so'rayapti. Birinchi qatorda olti va o'n bor: o'n katta. Uchinchi qatorda olti va uch: bu yerda olti katta. Har natijaning ikki tomonini yozib, kichigini tanlang.",
      'Это число стоит на БОЛЬШЕЙ стороне, а спрашивают меньшую. В первой строке шесть и десять: десять больше. В третьей шесть и три: здесь больше шесть. Выпиши обе стороны каждого результата и выбери меньшую.',
      'That number is on the GREATER side, while the smaller one is asked for. The first line gives six and ten: ten is greater. The third gives six and three: here six is greater. Write out both sides of each result and pick the smaller.') },
    { when: (s) => s.set, text: L(
      "Uch son to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi, ya'ni eng kichigidan boshlanadi: minus besh, uch, olti. Manfiy son har qanday musbat sondan kichik.",
      'Три числа найдены верно, а порядок нарушен. Код пишется по возрастанию, то есть начинается с наименьшего: минус пять, три, шесть. Отрицательное число меньше любого положительного.',
      'The three numbers are right, the order is not. The code goes in increasing order, starting from the smallest: minus five, three, six. A negative number is below any positive one.') },
    { when: (s) => s.slots.indexOf('−5') === -1, text: L(
      "Kodda minus besh yo'q, lekin ikkinchi qatorda aynan u kichik tomon. Ikkala qismni minus birga ko'paytiring: uch minus uchga, besh esa minus beshga aylanadi. Endi qaysi biri kichik? Minus besh — u son o'qida chapda.",
      'В коде нет минус пяти, а во второй строке меньшая сторона именно она. Умножь обе части на минус один: три станет минус три, а пять станет минус пять. Какое из них меньше? Минус пять — оно левее на числовой прямой.',
      'The code has no minus five, yet in the second line that is the smaller side. Multiply both sides by minus one: three becomes minus three and five becomes minus five. Which is smaller? Minus five — it lies further left on the number line.') },
  ],
  wrongText: L(
    "Har qatorda ikkala tomonni ham ko'paytiring va ikki natijani yozing. Keyin qaysi biri kichik ekanini son o'qida aniqlang: manfiy songa ko'paytirilganda tomonlar almashadi.",
    'В каждой строке умножь обе стороны и выпиши два результата. Потом определи на числовой прямой, какой из них меньше: при умножении на отрицательное стороны меняются местами.',
    'In every line multiply both sides and write out the two results. Then decide on the number line which is smaller: multiplying by a negative swaps the sides.'),
};

export default function D24_04(props) { return <CodeLock data={DATA} {...props} />; }
