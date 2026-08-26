// Dars30 · Amaliyot 06 — Kod · 🟡 · tag: code_bounds
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §12 (30-dars, 6-pozitsiya)
//
// T2 SOF HOLDA: `x = a ± h` yozuvi uch sonni beradi — quyi chegara, taqribiy
// qiymat va yuqori chegara. Kod tartibi «o'sish» emas, savol tartibni OCHIQ
// aytadi (bu 15-darsning 10-topshirig'idagi kabi).
//
// Bankdagi tuzoqlar:
//   6,2  — nol butun ikkini nol butun nol ikki bilan almashtirish;
//   7,02 — o'nli kasrning xonasini adashtirish;
//   8    — chegarani butun songa yaxlitlash.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_bounds', level: '🟡',
  expr: ['x = 7 ± 0,2'], exprSize: 28,
  cards: ['6,2', '6,8', '7', '7,02', '7,2', '8'],
  answer: ['6,8', '7', '7,2'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Bu yozuv aniq qiymat qayerda yotishini aytadi: taqribiy qiymatdan chegara qadar ikki tomonga.",
    'В комнате сейф, код трёхзначный. Эта запись говорит, где лежит точное значение: на величину границы в обе стороны от приближённого.',
    'There is a safe in the room and its code has three places. This record says where the exact value lies: the bound\'s distance to either side of the approximation.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Kodga eng kichik qiymat, taqribiy qiymat va eng katta qiymatni SHU TARTIBDA yozing.",
    'Запиши в код наименьшее значение, приближённое значение и наибольшее значение В ЭТОМ ПОРЯДКЕ.',
    'Write the smallest value, the approximation and the largest value into the code IN THAT ORDER.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Chegarani ikki tomonga qo'yamiz: yetti minus nol butun ikki olti butun sakkiz, yetti qo'shuv nol butun ikki yetti butun ikki. O'rtada esa taqribiy qiymatning o'zi — yetti. Ya'ni aniq qiymat olti butun sakkiz bilan yetti butun ikki orasida yotadi, va bu qo'sh tengsizlik bilan yozilgan narsaning o'zi. Diqqat: bu yerda kod o'sish tartibida ham chiqdi, lekin sabab boshqa — savol tartibni ochiq aytdi.",
    'Верно. Откладываем границу в обе стороны: семь минус ноль целых два это шесть целых восемь, семь плюс ноль целых два это семь целых два. А в середине само приближённое значение — семь. То есть точное значение лежит между шестью целыми восемью и семью целыми двумя, и это то же самое, что записано двойным неравенством. Обрати внимание: код здесь вышел и по возрастанию, но причина другая — порядок был задан вопросом.',
    'Correct. Lay the bound off to either side: seven minus zero point two is six point eight, seven plus zero point two is seven point two. In the middle stands the approximation itself — seven. So the exact value lies between six point eight and seven point two, which is exactly what a double inequality records. Note: the code here happens to be increasing as well, but for a different reason — the question named the order.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('6,2') !== -1, text: L(
      "Bu son chegarani noto'g'ri ayirishdan chiqadi. Nol butun ikki — bu o'ndan ikki, ya'ni yetti minus nol butun ikki olti butun SAKKIZ bo'ladi, olti butun ikki emas. Olti butun ikki chiqishi uchun chegara nol butun sakkiz bo'lishi kerak edi. Verguldan keyingi xonaga diqqat qiling.",
      'Это число выходит из неверного вычитания границы. Ноль целых два — это две десятых, значит семь минус ноль целых два это шесть целых ВОСЕМЬ, а не шесть целых два. Шесть целых два вышло бы при границе ноль целых восемь. Следи за разрядом после запятой.',
      'That number comes from subtracting the bound wrongly. Zero point two is two tenths, so seven minus zero point two is six point EIGHT, not six point two. Six point two would require a bound of zero point eight. Watch the place after the comma.') },
    { when: (s) => s.slots.indexOf('7,02') !== -1, text: L(
      "Bu sonda vergul ortidagi XONA adashgan: nol butun nol ikki qo'shilgan, chegara esa nol butun ikki. Nol butun ikki nol butun nol ikkidan o'n barobar katta. To'g'ri hisob: yetti qo'shuv nol butun ikki yetti butun ikki.",
      'В этом числе перепутан РАЗРЯД после запятой: прибавлено ноль целых ноль два, а граница ноль целых два. Ноль целых два в десять раз больше ноля целых ноля двух. Верный счёт: семь плюс ноль целых два это семь целых два.',
      'In that number the PLACE after the comma is confused: zero point zero two was added while the bound is zero point two. Zero point two is ten times larger than zero point zero two. The right computation: seven plus zero point two is seven point two.') },
    { when: (s) => s.slots.indexOf('8') !== -1, text: L(
      "Sakkiz — chegarani butun songa yaxlitlashdan chiqqan son. Chegara nol butun ikki, ya'ni yuqori chegara yetti butun ikki bo'ladi, sakkiz emas. Yaxlitlash bu yerda kerak emas: yozuvdagi sonlar tayyor, ularni faqat qo'shish va ayirish kerak.",
      'Восемь выходит из округления границы до целого. Граница ноль целых два, значит верхняя граница это семь целых два, а не восемь. Округлять здесь не нужно: числа в записи готовы, их надо только сложить и вычесть.',
      'Eight comes from rounding the bound to a whole number. The bound is zero point two, so the upper bound is seven point two, not eight. No rounding is needed here: the numbers in the record are ready, they only need adding and subtracting.') },
    { when: (s) => s.set, text: L(
      "Uch son to'g'ri topilgan, tartib esa buzilgan. Savol tartibni ochiq aytdi: avval eng kichik qiymat, keyin taqribiy qiymat, oxirida eng katta qiymat. Taqribiy qiymat har doim o'rtada turadi, chunki chegara ikki tomonga TENG qo'yiladi.",
      'Три числа найдены верно, а порядок нарушен. Вопрос назвал порядок прямо: сначала наименьшее значение, потом приближённое, в конце наибольшее. Приближённое значение всегда в середине, ведь граница откладывается в обе стороны ОДИНАКОВО.',
      'The three numbers are right, the order is not. The question named the order outright: the smallest value first, then the approximation, the largest last. The approximation always stands in the middle, since the bound is laid off EQUALLY to both sides.') },
  ],
  wrongText: L(
    "Chegarani taqribiy qiymatdan ayiring va unga qo'shing. Verguldan keyingi xonaga diqqat qiling, va uch sonni savolda aytilgan tartibda joylashtiring.",
    'Вычти границу из приближённого значения и прибавь к нему. Следи за разрядом после запятой и расставь три числа в порядке, названном в вопросе.',
    'Subtract the bound from the approximation and add it to the approximation. Watch the place after the comma, and put the three numbers in the order the question named.'),
};

export default function D30_06(props) { return <CodeLock data={DATA} {...props} />; }
