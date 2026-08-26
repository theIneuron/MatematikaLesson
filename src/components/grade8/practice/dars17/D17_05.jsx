// Dars17 · Amaliyot 05 — Kod · 🟡 · tag: code_D
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §5 (17-dars, 5-pozitsiya)
//
// UCH TENGLAMA, UCH XIL DISKRIMINANT: manfiy, nol va musbat. Bu 18-darsga
// tayanch — u yerda aynan shu uch hol ildizlar soniga bog'lanadi. Bu darsda
// esa faqat HISOB tekshiriladi.
//
// Bankdagi tuzoqlar:
//   −4  — birinchi tenglamada to'rtga ko'paytirish tashlab ketildi (4 − 28);
//   1   — ikkinchi tenglamada b kvadrati o'n olti emas, ikki deb olindi;
//   36  — uchinchi tenglamada c ning ishorasi hisobga olinmadi (9 − 16 emas,
//         9 + 16 = 25 to'g'ri; 36 esa 6 kvadrati, ya'ni butunlay boshqa yo'l).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_D', level: '🟡',
  expr: ['x² + 2x + 7', ';', '4x² − 4x + 1', ';', '2x² + 3x − 2'], exprSize: 15,
  cards: ['−24', '−4', '0', '1', '25', '36'],
  answer: ['−24', '0', '25'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch uchhadning diskriminanti hisoblanadi. Uchtasi uch xil chiqadi: manfiy, nol va musbat.",
    'В комнате сейф, код трёхзначный. Считается дискриминант трёх трёхчленов. Все три выйдут разными: отрицательный, нуль и положительный.',
    'There is a safe in the room and its code has three places. Compute the discriminant of the three trinomials. All three come out different: negative, zero and positive.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch diskriminantni hisoblang va kodga o'sish tartibida yozing.",
    'Посчитай три дискриминанта и запиши их в код по возрастанию.',
    'Compute the three discriminants and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchisi: ikkining kvadrati to'rt, minus to'rt karra bir karra yetti minus yigirma sakkiz, to'rt minus yigirma sakkiz minus yigirma to'rt. Ikkinchisi: minus to'rtning kvadrati o'n olti, minus to'rt karra to'rt karra bir minus o'n olti, o'n olti minus o'n olti nol. Uchinchisi: uchning kvadrati to'qqiz, minus to'rt karra ikki karra minus ikki arti o'n olti, to'qqiz qo'shuv o'n olti yigirma besh.",
    'Верно. Первый: два в квадрате четыре, минус четыре на один на семь минус двадцать восемь, четыре минус двадцать восемь минус двадцать четыре. Второй: минус четыре в квадрате шестнадцать, минус четыре на четыре на один минус шестнадцать, шестнадцать минус шестнадцать нуль. Третий: три в квадрате девять, минус четыре на два на минус два плюс шестнадцать, девять плюс шестнадцать двадцать пять.',
    'Correct. First: two squared is four, minus four times one times seven is minus twenty eight, four minus twenty eight is minus twenty four. Second: minus four squared is sixteen, minus four times four times one is minus sixteen, sixteen minus sixteen is zero. Third: three squared is nine, minus four times two times minus two is plus sixteen, nine plus sixteen is twenty five.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('−4') !== -1, text: L(
      "Minus to'rt — bu to'rt minus sakkiz, ya'ni to'rtga ko'paytirish tashlab ketilgan yoki c ning o'zi olingan. Formulada minus TO'RT a c turadi: minus to'rt karra bir karra yetti minus yigirma sakkiz. To'rt minus yigirma sakkiz minus yigirma to'rt.",
      'Минус четыре — это четыре минус восемь, то есть пропущено умножение на четыре или взято само c. В формуле стоит минус ЧЕТЫРЕ a c: минус четыре на один на семь минус двадцать восемь. Четыре минус двадцать восемь минус двадцать четыре.',
      'Minus four is four minus eight, meaning the multiplication by four was skipped or c was taken as it stands. The formula holds minus FOUR a c: minus four times one times seven is minus twenty eight. Four minus twenty eight is minus twenty four.') },
    { when: (s) => s.slots.indexOf('1') !== -1, text: L(
      "Bir — ikkinchi uchhadning OZOD HADI, diskriminant emas. b ni kvadratga oshiring: minus to'rtning kvadrati o'n olti. Keyin minus to'rt karra to'rt karra bir minus o'n olti. O'n olti minus o'n olti nol — bu uchhad to'la kvadrat, ikki x minus birning kvadrati.",
      'Единица — это СВОБОДНЫЙ ЧЛЕН второго трёхчлена, а не дискриминант. Возведи b в квадрат: минус четыре в квадрате шестнадцать. Потом минус четыре на четыре на один минус шестнадцать. Шестнадцать минус шестнадцать нуль — этот трёхчлен полный квадрат, квадрат два x минус один.',
      'One is the CONSTANT TERM of the second trinomial, not the discriminant. Square b: minus four squared is sixteen. Then minus four times four times one is minus sixteen. Sixteen minus sixteen is zero — this trinomial is a perfect square, the square of two x minus one.') },
    { when: (s) => s.slots.indexOf('36') !== -1, text: L(
      "O'ttiz olti oltining kvadrati, lekin bu uchhadlarda b hech qachon oltiga teng emas. Uchinchisida b uchga teng: uchning kvadrati to'qqiz, va unga arti o'n olti qo'shiladi — yigirma besh chiqadi, o'ttiz olti emas.",
      'Тридцать шесть — это шесть в квадрате, но ни в одном из трёхчленов b не равно шести. В третьем b равно трём: три в квадрате девять, и к нему прибавляется плюс шестнадцать — выходит двадцать пять, а не тридцать шесть.',
      'Thirty six is six squared, but b never equals six in these trinomials. In the third, b is three: three squared is nine, and plus sixteen is added — giving twenty five, not thirty six.') },
    { when: (s) => s.set, text: L(
      "Sonlar to'g'ri topilgan, tartib esa buzilgan. O'sish eng kichigidan boshlanadi, manfiy son esa nol va musbat sondan kichik: minus yigirma to'rt, nol, yigirma besh.",
      'Числа найдены верно, а порядок нет. Возрастание начинается с наименьшего, а отрицательное меньше нуля и положительного: минус двадцать четыре, нуль, двадцать пять.',
      'The numbers are right, the order is not. Increasing starts from the smallest, and a negative is below zero and below a positive: minus twenty four, zero, twenty five.') },
    { when: (s) => s.slots.indexOf('0') === -1, text: L(
      "Kodda nol yo'q, lekin u kerak: ikkinchi uchhadda o'n olti minus o'n olti nol chiqadi. Nol ham diskriminantning qiymati, va u 18-darsda alohida hol bo'ladi.",
      'В коде нет нуля, а он нужен: во втором трёхчлене шестнадцать минус шестнадцать даёт нуль. Нуль тоже значение дискриминанта, и в восемнадцатом уроке это отдельный случай.',
      'The code has no zero, but it needs one: in the second trinomial sixteen minus sixteen is zero. Zero is a value of the discriminant too, and in lesson eighteen it becomes a separate case.') },
  ],
  wrongText: L(
    "Har uchhadda uch koeffitsiyentni ishorasi bilan yozib oling, keyin b kvadratini va minus to'rt a c ni alohida hisoblang. c manfiy bo'lsa ikkinchi qo'shiluvchi musbat chiqadi.",
    'В каждом трёхчлене выпиши три коэффициента со знаками, потом посчитай b в квадрате и минус четыре a c по отдельности. Если c отрицательно, второе слагаемое выходит положительным.',
    'In each trinomial write out the three coefficients with their signs, then compute b squared and minus four a c separately. When c is negative the second part comes out positive.'),
};

export default function D17_05(props) { return <CodeLock data={DATA} {...props} />; }
