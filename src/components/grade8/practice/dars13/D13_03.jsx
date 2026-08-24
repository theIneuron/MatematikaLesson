// Dars13 · Amaliyot 03 — Belgilash · 🟢 · tag: correct_transform_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §4 (13-dars, 3-pozitsiya)
//
// Ikki yo'nalish bir joyda: CHIQARISH (√45, √98) va KIRITISH (4√2 = √32).
// Uchta xato uch xil:
//   i4  √20 = 2√10 — kvadrat ko'paytuvchi noto'g'ri tanlandi (20 = 4 · 5);
//   i5  √8 = 4√2   — chiqarilgan son ildiz olinmasdan chiqdi (8 = 4 · 2,
//                    chiqadigan narsa 2, 4 emas);
//   i6  √13 + √13 = √26 — З34, ildiz ostilari qo'shildi.
//
// 4√2 ATAYLAB IKKI KARTADA turadi: i3 da to'g'ri tomonda (4√2 = √32), i5 da
// yolg'on tomonda (√8 = 4√2). Yozuvni tanib olish yetmaydi, hisoblash kerak.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'correct_transform_marked', level: '🟢',
  col: 168, itemSize: 17,
  items: [
    { id: 'i1', tokens: [{ r: '45' }, '=', '3', { r: '5' }], hit: true },
    { id: 'i2', tokens: [{ r: '98' }, '=', '7', { r: '2' }], hit: true },
    { id: 'i3', tokens: ['4', { r: '2' }, '=', { r: '32' }], hit: true },
    { id: 'i4', tokens: [{ r: '20' }, '=', '2', { r: '10' }] },
    { id: 'i5', tokens: [{ r: '8' }, '=', '4', { r: '2' }] },
    { id: 'i6', tokens: [{ r: '13' }, '+', { r: '13' }, '=', { r: '26' }] },
  ],
  eyebrow: L('Belgilash', 'Отметить', 'Mark'),
  setup: L(
    "Oltita o'zgartirish. Uchtasi to'g'ri bajarilgan, uchtasida esa xato bor. Har birini javobni kvadratga oshirib tekshirish mumkin.",
    'Шесть преобразований. Три выполнены верно, в трёх ошибка. Каждое можно проверить возведением ответа в квадрат.',
    'Six transformations. Three are done right, three hold a mistake. Each can be checked by squaring the answer.'),
  ask: L(
    "To'g'ri bajarilgan 3 ta o'zgartirishni belgilang.",
    'Отметь 3 преобразования, выполненных верно.',
    'Mark the 3 transformations that are done right.'),
  note: L('Uchta', 'Три', 'Three'),
  // RAZBOR IKKI MARTA QISQARTIRILDI (o'lchovlar 2026-08-24): birinchi tahrir
  // telefonda RU matni bilan kadrdan 10px chiqib ketgan (grade8-practice-check),
  // ikkinchisi panel ostida 19px qoldirgan (grade8-practice-panel). Oltita
  // kartali MarkAll ustiga uzun matn sig'maydi — tafsilot `wrongs` da turadi.
  correctText: L(
    "To'g'ri. Qirq besh bu to'qqiz karra besh, to'qsan sakkiz bu qirq to'qqiz karra ikki. Uchinchisi teskari tomonga: to'rt ildiz ostiga kvadratga oshib kiradi. Uchtasini bitta amal tasdiqlaydi: koeffitsiyentning kvadrati karra ildiz osti dastlabki sonni beradi.",
    'Верно. Сорок пять это девять на пять, девяносто восемь это сорок девять на два. Третье в обратную сторону: четыре заходит под корень, возводясь в квадрат. Все три подтверждает одно действие: квадрат коэффициента на подкоренное даёт исходное число.',
    'Correct. Forty five is nine times five, ninety eight is forty nine times two. The third goes the other way: four enters the root by being squared. One action confirms all three: the coefficient squared times the radicand gives the original number.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Yigirmani o'n karra ikki deb ajratish yaramaydi: o'ndan ildiz butun emas. Yigirma bu TO'RT karra besh, to'rtdan ildiz ikki, ya'ni ikki beshdan ildiz. Kvadratga oshirib tekshiring: ikkining kvadrati to'rt, karra o'n qirq chiqadi, yigirma emas.",
      'Разложить двадцать как десять на два не годится: корень из десяти не целый. Двадцать это ЧЕТЫРЕ на пять, корень из четырёх два, то есть два корня из пяти. Проверь возведением в квадрат: два в квадрате четыре, на десять сорок, а не двадцать.',
      'Splitting twenty as ten times two is no good: the root of ten is not whole. Twenty is FOUR times five, the root of four is two, so it is two roots of five. Check by squaring: two squared is four, times ten is forty, not twenty.') },
    { when: (s) => s.extra.indexOf('i5') !== -1, text: L(
      "Sakkiz bu to'rt karra ikki, va ildiz ostidan to'rtning O'ZI emas, uning ILDIZI chiqadi — ikki. To'g'ri javob ikki ikkidan ildiz. Kvadratga oshirib tekshiring: to'rtning kvadrati o'n olti, karra ikki o'ttiz ikki chiqadi, sakkiz emas. Yozuv o'ttiz ikkiga to'g'ri kelardi, sakkizga esa yo'q.",
      'Восемь это четыре на два, и из-под корня выходит не САМО четыре, а его КОРЕНЬ — два. Верный ответ два корня из двух. Проверь возведением в квадрат: четыре в квадрате шестнадцать, на два тридцать два, а не восемь. Такая запись подошла бы к тридцати двум, но не к восьми.',
      'Eight is four times two, and what leaves the root is not four ITSELF but its ROOT — two. The right answer is two roots of two. Check by squaring: four squared is sixteen, times two is thirty two, not eight. That record would fit thirty two, not eight.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Bu yerda ildiz ostilari qo'shildi. Ikki bir xil had qo'shilsa koeffitsiyent ikkiga ko'payadi, ildiz osti esa tegilmaydi: o'n uchdan ildiz qo'shuv o'n uchdan ildiz ikki karra o'n uchdan ildiz. Son bilan tekshiring: o'n uchdan ildiz uch butun oltmish, ikkitasi yetti butun yigirmaga yaqin; yigirma oltidan ildiz esa besh butun o'ndan bir.",
      'Здесь сложили подкоренные. При сложении двух одинаковых слагаемых коэффициент удваивается, а подкоренное не трогается: корень из тринадцати плюс корень из тринадцати это два корня из тринадцати. Проверь числом: корень из тринадцати три и шестьдесят, два таких около семи и двадцати; а корень из двадцати шести пять и одна десятая.',
      'Here the radicands were added. When two identical terms add, the coefficient doubles and the radicand is untouched: the root of thirteen plus the root of thirteen is two roots of thirteen. Check with numbers: the root of thirteen is three point six, twice that is about seven point two; the root of twenty six is five point one.') },
    { when: (s) => s.miss.indexOf('i3') !== -1, text: L(
      "Uchinchi karta teskari tomonga ishlaydi va u ham to'g'ri: koeffitsiyent ildiz ostiga KVADRATGA OSHIB kiradi. To'rtning kvadrati o'n olti, o'n olti karra ikki o'ttiz ikki, ya'ni to'rt ikkidan ildiz o'ttiz ikkidan ildizga teng.",
      'Третья карточка работает в обратную сторону, и она тоже верна: коэффициент заходит под корень, ВОЗВОДЯСЬ В КВАДРАТ. Четыре в квадрате шестнадцать, шестнадцать на два тридцать два, то есть четыре корня из двух равны корню из тридцати двух.',
      'The third card works the other way round, and it is right too: a coefficient enters the root by being SQUARED. Four squared is sixteen, sixteen times two is thirty two, so four roots of two equals the root of thirty two.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta o'zgartirish kerak. Har birida bir xil ish qiling: koeffitsiyentni kvadratga oshirib ildiz ostidagi songa ko'paytiring va dastlabki son bilan solishtiring.",
      'Нужно ровно три преобразования. С каждым делай одно и то же: возведи коэффициент в квадрат, умножь на подкоренное и сравни с исходным числом.',
      'Exactly three transformations are needed. Do the same with each: square the coefficient, multiply by the radicand and compare with the original number.') },
  ],
  wrongText: L(
    "Bitta tekshiruv hammasiga yetadi: koeffitsiyentning kvadrati karra ildiz ostidagi son. Chiqqan son dastlabki songa teng bo'lsa o'zgartirish to'g'ri.",
    'Одной проверки хватает на всё: квадрат коэффициента на подкоренное число. Если вышло исходное число — преобразование верное.',
    'One check covers them all: the coefficient squared times the radicand. If it gives the original number the transformation is right.'),
};

export default function D13_03(props) { return <MarkAll data={DATA} {...props} />; }
