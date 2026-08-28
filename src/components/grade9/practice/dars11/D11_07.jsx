// Dars11 · Amaliyot 07 — Saralash · 🟡 · teg: manfiy-kvadrat-holati
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Zones.
//
// Zona — NOM emas, XOSSA: o'rniga qo'yishdan keyin hosil bo'lgan yozuv
// nechta haqiqiy igrek beradi. Darsning ikkinchi tasdig'i shu yerda
// oltita alohida yozuvda tekshiriladi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, Zones } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'manfiy-kvadrat-holati', level: '🟡',
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "O'rniga qo'yishdan keyin har bir iks uchun shunday yozuv qoladi. Har biri nechta haqiqiy igrek beradi?",
    'После подстановки для каждого икса остаётся такая запись. Сколько действительных игреков даёт каждая?',
    'After substitution, such a record is left for each x. How many real y-values does each give?'),
  ask: L(
    'Yozuvni bosing, keyin guruhni bosing.',
    'Нажми запись, потом нажми группу.',
    'Tap a record, then tap a group.'),
  itemSize: 16,
  zones: [
    { id: 'a', label: L('Ikkita igrek', 'Два игрека', 'Two y-values') },
    { id: 'b', label: L('Bitta igrek', 'Один игрек', 'One y-value') },
    { id: 'c', label: L('Haqiqiy igrek yo\'q', 'Действительного игрека нет', 'No real y') },
  ],
  items: [
    { id: 'i1', tokens: ['y² = 25'], zone: 'a' },
    { id: 'i2', tokens: ['y² = 4'], zone: 'a' },
    { id: 'i3', tokens: ['y² = 0'], zone: 'b' },
    { id: 'i4', tokens: ['(y − 3)² = 0'], zone: 'b' },
    { id: 'i5', tokens: ['y² = −1'], zone: 'c' },
    { id: 'i6', tokens: ['y² = −16'], zone: 'c' },
  ],
  correctText: L(
    "To'g'ri. Musbat son kvadratga teng bo'lsa, igrek ikki xil bo'ladi: besh va minus besh, ikki va minus ikki. Nol esa bitta igrek beradi, chunki nolning qarama-qarshisi yana nol; qavsli yozuvda ham xuddi shunday, faqat bu yerda igrek uchga teng. Manfiy son bilan esa hech nima chiqmaydi: hech qanday haqiqiy sonning kvadrati manfiy bo'lmaydi. Aynan shu uchinchi guruh «yechim yo'q» degan javobni beradi.",
    'Верно. Если квадрат равен положительному числу, игрек бывает двух видов: пять и минус пять, два и минус два. Нуль даёт один игрек, ведь противоположное нулю — снова нуль; в записи со скобкой то же самое, только там игрек равен трём. А с отрицательным числом не выходит ничего: квадрат никакого действительного числа не бывает отрицательным. Именно эта третья группа и даёт ответ «решений нет».',
    'Correct. When a square equals a positive number, y comes in two kinds: five and minus five, two and minus two. Zero gives one y, since the opposite of zero is zero again; the bracketed record is the same, only there y equals three. With a negative number nothing comes out: no real number has a negative square. It is this third group that produces the answer "no solution".'),
  wrongs: [
    { when: (s) => s.place.i5 === 'a' || s.place.i5 === 'b' || s.place.i6 === 'a' || s.place.i6 === 'b', text: L(
      "Manfiy songa teng kvadratga haqiqiy igrek qidirildi. Ikki musbat sonning ko'paytmasi musbat, ikki manfiy sonning ko'paytmasi ham musbat — demak kvadrat manfiy bo'lolmaydi.",
      'Для квадрата, равного отрицательному числу, искали действительный игрек. Произведение двух положительных положительно, двух отрицательных тоже положительно — значит квадрат не может быть отрицательным.',
      'A real y was sought for a square equal to a negative number. The product of two positives is positive, of two negatives also positive — so a square cannot be negative.') },
    { when: (s) => s.place.i3 === 'a' || s.place.i4 === 'a', text: L(
      "Nol ikkita igrek bermaydi. Nolning qarama-qarshisi ham nol, ya'ni ikki javob bir joyga qo'shilib ketadi.",
      'Нуль не даёт двух игреков. Противоположное нулю — тоже нуль, то есть два ответа сливаются в один.',
      'Zero does not give two y-values. The opposite of zero is zero too, so the two answers merge into one.') },
    { when: (s) => s.place.i1 === 'b' || s.place.i2 === 'b', text: L(
      "Musbat son bitta emas, ikkita igrek beradi. Besh karra besh yigirma besh, minus besh karra minus besh ham yigirma besh.",
      'Положительное число даёт не один, а два игрека. Пять на пять — двадцать пять, минус пять на минус пять — тоже двадцать пять.',
      'A positive number gives two y-values, not one. Five times five is twenty-five, and minus five times minus five is twenty-five as well.') },
    { when: (s) => s.place.i1 === 'c' || s.place.i2 === 'c' || s.place.i3 === 'c' || s.place.i4 === 'c', text: L(
      "Uchinchi guruhga faqat MANFIY songa teng kvadratlar tushadi. Yigirma besh, to'rt va nol — hammasi manfiy emas.",
      'В третью группу попадают только квадраты, равные ОТРИЦАТЕЛЬНОМУ числу. Двадцать пять, четыре и нуль отрицательными не являются.',
      'Only squares equal to a NEGATIVE number belong to the third group. Twenty-five, four and zero are not negative.') },
  ],
  wrongText: L(
    "Har bir yozuvga bitta savol bering: kvadratga teng bo'lgan son musbatmi, nolmi yoki manfiymi? Guruh shu javobdan chiqadi.",
    'Задай каждой записи один вопрос: число, которому равен квадрат, положительное, нуль или отрицательное? Из этого ответа и следует группа.',
    'Ask each record one question: is the number the square equals positive, zero, or negative? The group follows from that answer.'),
};

export default function D11_07(props) { return <Zones data={DATA} {...props} />; }
