// Dars12 · Amaliyot 08 — Belgilash · 🔴 · tag: true_equality_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §3 (12-dars, 8-pozitsiya)
//
// Uchta tuzoq — uch XIL xato, va ularning hech biri bir-birining takrori emas:
//   i2  З4  — ildiz hadlarga bo'lindi (16 + 9);
//   i4      — ildiz umuman olinmadi (5 · 5 = 25 emas, 5);
//   i6  З32 — ko'paytma manfiy ko'paytuvchilardan tuzilgan: chap tomonning
//             qiymati BOR, o'ng tomonning esa YO'Q. Bu 10-darsning qoidasiga
//             qaytish (oldingi blokdan, TIPLAR §6).
//
// «Hammasi yoki hech narsa»: uchta to'g'ri tenglik ham topilishi kerak.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'true_equality_marked', level: '🔴',
  col: 176, itemSize: 15,
  items: [
    { id: 'i1', tokens: [{ r: '2 · 18' }, '=', '6'], hit: true },
    { id: 'i2', tokens: [{ r: '16 + 9' }, '=', '4 + 3'] },
    { id: 'i3', tokens: [{ r: '50 · 2' }, '=', '10'], hit: true },
    { id: 'i4', tokens: [{ r: '5 · 5' }, '=', '25'] },
    { id: 'i5', tokens: [{ r: '7 · 28' }, '=', '14'], hit: true },
    { id: 'i6', tokens: [{ r: '(−9) · (−16)' }, '=', { r: '−9' }, '·', { r: '−16' }] },
  ],
  eyebrow: L('Belgilash', 'Отметить', 'Mark'),
  setup: L(
    "Oltita tenglik. Uchtasi bajariladi, uchtasi esa yo'q — va ular uch xil sababdan buziladi.",
    'Шесть равенств. Три выполняются, три нет — и ломаются они по трём разным причинам.',
    'Six equalities. Three hold and three do not — and they break for three different reasons.'),
  ask: L(
    "To'g'ri bo'lgan 3 ta tenglikni belgilang.",
    'Отметь 3 равенства, которые верны.',
    'Mark the 3 equalities that are true.'),
  note: L('Uchta', 'Три', 'Three'),
  // RAZBOR QISQA: o'lchov 2026-08-24 (grade8-practice-panel.mjs) — telefonda RU
  // matni panel ostida 19px qolib ketardi. Uch xatoning tafsiloti `wrongs` da
  // bor, shuning uchun bu yerda ular faqat NOMLANADI.
  correctText: L(
    "To'g'ri. Uchtasida ham ko'paytma to'liq kvadrat: ikki karra o'n sakkiz o'ttiz olti, ildizi olti; ellik karra ikki yuz, ildizi o'n; yetti karra yigirma sakkiz yuz to'qsan olti, ildizi o'n to'rt. Qolgan uchtasida xato boshqa-boshqa: ildiz hadlarga bo'lindi, ildiz umuman olinmadi, va manfiy ko'paytuvchidan ildiz olinmoqchi bo'ldi.",
    'Верно. Во всех трёх произведение — полный квадрат: два на восемнадцать тридцать шесть, корень шесть; пятьдесят на два сто, корень десять; семь на двадцать восемь сто девяносто шесть, корень четырнадцать. В остальных трёх ошибки разные: корень раздали по слагаемым, корень не взяли вовсе, и попробовали взять корень из отрицательного множителя.',
    'Correct. In all three the product is a perfect square: two times eighteen is thirty six, root six; fifty times two is one hundred, root ten; seven times twenty eight is one hundred ninety six, root fourteen. In the other three the errors differ: the root was spread over terms, the root was not taken at all, and a root of a negative factor was attempted.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Bu tenglikda ildiz HADLARGA bo'lingan. Ikki tomonni hisoblang: o'n olti qo'shuv to'qqiz yigirma besh, yigirma beshdan ildiz besh; o'ng tomon esa to'rt qo'shuv uch, ya'ni yetti. Besh va yetti teng emas. Xossa faqat ko'paytma uchun ishlaydi.",
      'В этом равенстве корень раздали по СЛАГАЕМЫМ. Посчитай обе части: шестнадцать плюс девять двадцать пять, корень из двадцати пяти пять; а справа четыре плюс три, то есть семь. Пять и семь не равны. Свойство работает только для произведения.',
      'In this equality the root was distributed over TERMS. Compute both sides: sixteen plus nine is twenty five and its root is five; the right side is four plus three, that is seven. Five and seven are not equal. The property works only for a product.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Bu yerda ko'paytma to'g'ri hisoblangan, lekin ildiz olinmagan: besh karra besh yigirma besh, yigirma beshdan ildiz esa besh. O'ng tomonda yigirma besh turadi, ya'ni ildiz belgisi unutilgan. Tekshiring: yigirma beshni kvadratga oshirsangiz olti yuz yigirma besh chiqadi.",
      'Здесь произведение посчитано верно, но корень не взят: пять на пять двадцать пять, а корень из двадцати пяти пять. Справа стоит двадцать пять, то есть знак корня забыт. Проверь: двадцать пять в квадрате — шестьсот двадцать пять.',
      'Here the product is right but the root was not taken: five times five is twenty five, and the root of twenty five is five. The right side says twenty five, so the root sign was forgotten. Check: twenty five squared is six hundred twenty five.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Chap tomonni hisoblang: minus to'qqiz karra minus o'n olti yuz qirq to'rt, ildizi o'n ikki — qiymat BOR. O'ng tomonda esa minus to'qqizdan ildiz turadi, kvadrati minus to'qqizga teng son esa yo'q, ya'ni o'ng tomonning qiymati YO'Q. Bir tomonida son, ikkinchisida hech narsa bo'lgan tenglik bajarilmaydi.",
      'Посчитай левую часть: минус девять на минус шестнадцать сто сорок четыре, корень двенадцать — значение ЕСТЬ. А справа стоит корень из минус девяти, числа, чей квадрат равен минус девяти, не существует, значит у правой части значения НЕТ. Равенство, где с одной стороны число, а с другой ничего, не выполняется.',
      'Compute the left side: minus nine times minus sixteen is one hundred forty four, root twelve — the value EXISTS. On the right stands the root of minus nine, and no number squares to minus nine, so the right side has NO value. An equality with a number on one side and nothing on the other does not hold.') },
    { when: (s) => s.miss.length > 0 && s.extra.length === 0, text: L(
      "To'g'ri tenglikning biri chetlab o'tildi. Uchala ko'paytmani hisoblang: o'ttiz olti, yuz va yuz to'qsan olti — hammasi to'liq kvadrat, ildizlari olti, o'n va o'n to'rt. Har javobni kvadratga oshirib tekshirish mumkin.",
      'Одно из верных равенств осталось в стороне. Посчитай все три произведения: тридцать шесть, сто и сто девяносто шесть — все полные квадраты, корни шесть, десять и четырнадцать. Каждый ответ можно проверить возведением в квадрат.',
      'One of the true equalities was left out. Compute all three products: thirty six, one hundred and one hundred ninety six — all perfect squares with roots six, ten and fourteen. Every answer can be checked by squaring.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta tenglik kerak. Har birida bir xil ish qiling: ildiz ostidagi sonni hisoblang, ildizini oling va o'ng tomon bilan solishtiring.",
      'Нужно ровно три равенства. С каждым делай одно и то же: посчитай число под корнем, возьми корень и сравни с правой частью.',
      'Exactly three equalities are needed. Do the same with each: compute the number under the root, take its root and compare with the right side.') },
  ],
  wrongText: L(
    "Har tenglikda ildiz ostidagi sonni hisoblang, keyin ildizini oling. Uch savol yordam beradi: ildiz ostida ko'paytirishmi, ildiz olindimi, ko'paytuvchilar nomanfiymi.",
    'В каждом равенстве посчитай число под корнем, потом возьми корень. Помогут три вопроса: под корнем умножение, корень взят, множители неотрицательны.',
    'In each equality compute the number under the root, then take the root. Three questions help: is it a product under the root, was the root taken, are the factors non-negative.'),
};

export default function D12_08(props) { return <MarkAll data={DATA} {...props} />; }
