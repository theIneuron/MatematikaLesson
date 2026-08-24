// Dars08 · Amaliyot 02 — Belgilash · 🟢 · tag: power_root_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §6 (8-dars, 2-pozitsiya)
//
// Kasr ko'rsatkich ILDIZ bilan bir xil. Uch tuzoq bitta adashishning uch
// ko'rinishi: ko'rsatkichning maxrajini BO'LISH deb olish (o'ttiz to'qqiz
// yarim, o'n ikki yarim, yigirma besh). Har birida javob ildizdan katta, ya'ni
// tekshirish oson: javobni tegishli darajaga oshirish kerak.
// Ko'rsatkich ikki qavatli kasr bo'lib turadi (`frac.jsx` -> Pow).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const H = (d) => ({ n: '1', d });

const DATA = {
  tag: 'power_root_marked', level: '🟢',
  col: 150, itemSize: 20,
  items: [
    { id: 'i1', tokens: [{ b: '9', e: H('2') }, '=', '3'], hit: true },
    { id: 'i2', tokens: [{ b: '49', e: H('2') }, '=', '24,5'] },
    { id: 'i3', tokens: [{ b: '8', e: H('3') }, '=', '2'], hit: true },
    { id: 'i4', tokens: [{ b: '25', e: H('2') }, '=', '12,5'] },
    { id: 'i5', tokens: [{ b: '16', e: H('4') }, '=', '2'], hit: true },
    { id: 'i6', tokens: [{ b: '125', e: H('3') }, '=', '25'] },
  ],
  eyebrow: L('Belgilash', 'Отметить', 'Mark'),
  setup: L(
    "Kasr ko'rsatkich ildiz bilan bir xil: ko'rsatkichning maxraji ildizning darajasini beradi.",
    'Дробный показатель это тот же корень: знаменатель показателя задаёт степень корня.',
    'A fractional exponent is the same root: the denominator of the exponent gives the degree of the root.'),
  ask: L(
    "To'g'ri yozilgan 3 ta tenglikni belgilang.",
    'Отметь 3 верно записанных равенства.',
    'Mark the 3 equalities that are written correctly.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uchtasini ham teskari amal bilan tekshirish mumkin: uch karra uch to'qqiz, ikki karra ikki karra ikki sakkiz, ikkining to'rtinchi darajasi o'n olti. Qolgan uchtasida maxraj bo'luvchi deb olingan: qirq to'qqizni ikkiga bo'lishdan o'ttiz to'qqiz yarim chiqdi, ildizi esa yetti.",
    'Верно. Все три проверяются обратным действием: три на три девять, два на два на два восемь, два в четвёртой степени шестнадцать. В остальных трёх знаменатель принят за делитель: сорок девять поделили на два и вышло двадцать четыре с половиной, а корень равен семи.',
    'Correct. All three can be checked by the reverse action: three times three is nine, two times two times two is eight, two to the fourth is sixteen. In the other three the denominator was taken for a divisor: forty nine was divided by two giving twenty four and a half, while the root is seven.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1 || s.extra.indexOf('i4') !== -1, text: L(
      "Bu yozuvda ko'rsatkichning maxraji BO'LUVCHI deb olingan. Tekshiring: o'ttiz to'qqiz yarimni kvadratga oshirsangiz mingdan oshadi, qirq to'qqiz emas. Yarim ko'rsatkich «ikkiga bo'lish» degani emas, «kvadrat ildiz» degani.",
      'Здесь знаменатель показателя принят за ДЕЛИТЕЛЬ. Проверь: двадцать четыре с половиной в квадрате даёт больше шестисот, а не сорок девять. Показатель одна вторая значит не «поделить на два», а «квадратный корень».',
      'Here the denominator of the exponent was taken for a DIVISOR. Check: twenty four and a half squared is over six hundred, not forty nine. An exponent of one half does not mean divide by two, it means the square root.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Bu yerda bir yuz yigirma besh beshga bo'lingan. Kub ildizni tekshirish uchun javobni uch marta ko'paytirish kerak: yigirma besh karra yigirma besh karra yigirma besh bir yuz yigirma beshdan ancha katta. To'g'ri javob besh: besh karra besh karra besh bir yuz yigirma besh.",
      'Здесь сто двадцать пять поделили на пять. Кубический корень проверяется троекратным умножением: двадцать пять на двадцать пять на двадцать пять намного больше ста двадцати пяти. Верный ответ пять: пять на пять на пять сто двадцать пять.',
      'Here one hundred twenty five was divided by five. A cube root is checked by multiplying three times: twenty five times twenty five times twenty five is far more than one hundred twenty five. The right answer is five: five times five times five is one hundred twenty five.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "To'rtinchi darajali ildizni chetlab o'tdingiz. Ikkini to'rt marta ko'paytiring: ikki, to'rt, sakkiz, o'n olti. Demak o'n oltining to'rtdan bir ko'rsatkichli darajasi ikkiga teng.",
      'Корень четвёртой степени остался в стороне. Умножь два четыре раза: два, четыре, восемь, шестнадцать. Значит шестнадцать в степени одна четвёртая равно двум.',
      'The fourth root was left out. Multiply two four times: two, four, eight, sixteen. So sixteen to the power one quarter equals two.') },
    { when: (s) => s.miss.indexOf('i3') !== -1, text: L(
      "Kub ildizni tekshirib ko'ring: ikki karra ikki karra ikki sakkizga teng, demak sakkizning uchdan bir ko'rsatkichli darajasi ikki. Bu tenglik to'g'ri.",
      'Проверь кубический корень: два на два на два равно восьми, значит восемь в степени одна третья это два. Это равенство верное.',
      'Check the cube root: two times two times two is eight, so eight to the power one third is two. That equality is correct.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta tenglik kerak. Har birida bitta ish qiling: javobni ko'rsatkichning maxrajiga teng marta ko'paytiring va asos chiqishini tekshiring.",
      'Нужно ровно три равенства. С каждым делай одно: умножь ответ на себя столько раз, сколько стоит в знаменателе показателя, и проверь, выйдет ли основание.',
      'Exactly three equalities are needed. Do one thing with each: multiply the answer by itself as many times as the denominator of the exponent says, and check whether the base comes out.') },
  ],
  wrongText: L(
    "Har tenglikni teskari amal bilan tekshiring: javobni maxrajga teng marta ko'paytirsangiz asos chiqishi kerak.",
    'Проверяй каждое равенство обратным действием: ответ, умноженный на себя столько раз, сколько в знаменателе, должен дать основание.',
    'Check each equality with the reverse action: the answer multiplied by itself as many times as the denominator says must give the base.'),
};

export default function D08_02(props) { return <MarkAll data={DATA} {...props} />; }
