// Dars13 · Amaliyot 05 — Juftlash · 🟡 · tag: sum_to_result
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §4 (13-dars, 5-pozitsiya)
//
// 02-topshiriqdan farqi: bu yerda ildiz ostilari HECH BIR yozuvda darrov bir
// xil emas. To'rt yozuvda ham avval chiqarish kerak, keyingina qo'shish:
//   √8 + √18   = 2√2 + 3√2 = 5√2
//   √27 + √3   = 3√3 + √3  = 4√3
//   √80 − √20  = 4√5 − 2√5 = 2√5
//   √28 + √63  = 2√7 + 3√7 = 5√7
// IKKI TAVSIFDA KOEFFITSIYENT 5 (birinchisi va oxirgisi) — faqat koeffitsiyentga
// qarab tanlab bo'lmaydi, ildiz ostini ham o'qish kerak.
//
// Chapda SO'Z (`items[].label`), o'ngda YOZUV (`targets[].tokens`), tanlangan
// juftlik egri chiziq bilan birlashtiriladi (`connect: true`).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'sum_to_result', level: '🟡',
  connect: true,
  targetSize: 15,
  items: [
    { id: 'm1', label: L('koeffitsiyenti 5, ildiz ostida 2', 'коэффициент 5, под корнем 2', 'coefficient 5, radicand 2') },
    { id: 'm2', label: L('koeffitsiyenti 4, ildiz ostida 3', 'коэффициент 4, под корнем 3', 'coefficient 4, radicand 3') },
    { id: 'm3', label: L('koeffitsiyenti 2, ildiz ostida 5', 'коэффициент 2, под корнем 5', 'coefficient 2, radicand 5') },
    { id: 'm4', label: L('koeffitsiyenti 5, ildiz ostida 7', 'коэффициент 5, под корнем 7', 'coefficient 5, radicand 7') },
  ],
  targets: [
    { id: 't1', tokens: [{ r: '8' }, '+', { r: '18' }] },
    { id: 't2', tokens: [{ r: '27' }, '+', { r: '3' }] },
    { id: 't3', tokens: [{ r: '80' }, '−', { r: '20' }] },
    { id: 't4', tokens: [{ r: '28' }, '+', { r: '63' }] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "To'rt yozuvda ildiz ostilari bir xil emas, shuning uchun darrov qo'shib bo'lmaydi. Har haddan to'liq kvadratni chiqarsangiz ildiz ostilari tenglashadi.",
    'В четырёх записях подкоренные не одинаковы, поэтому сразу складывать нельзя. Если вынести из каждого слагаемого полный квадрат, подкоренные сравняются.',
    'In these four records the radicands are not the same, so they cannot be added right away. Take the perfect square out of each term and the radicands line up.'),
  ask: L(
    "Chapdan natijani bosing, keyin o'ngdan uning yozuvini bosing.",
    'Нажми результат слева, потом его запись справа.',
    'Tap a result on the left, then its record on the right.'),
  // RAZBOR QISQA: o'lchov 2026-08-24 (grade8-practice-panel.mjs) — to'rt yozuvni
  // birma-bir hisoblab chiqqan matn telefonda 32px panel ostida qolardi. Endi
  // ikki misol to'liq ko'rsatiladi, qolgan ikkisi natijasi bilan aytiladi.
  correctText: L(
    "To'g'ri. Har yozuvda avval chiqardingiz, keyin qo'shdingiz. Sakkiz bu to'rt karra ikki — ikki ikkidan ildiz; o'n sakkiz bu to'qqiz karra ikki — uch ikkidan ildiz; ikki qo'shuv uch besh. Sakson va yigirma beshlik ildiz beradi: to'rt minus ikki, ya'ni ikki. Qolgan ikkitasi ham shunday — to'rt uchdan ildiz va besh yettidan ildiz.",
    'Верно. В каждой записи ты сначала вынес, потом сложил. Восемь это четыре на два — два корня из двух; восемнадцать это девять на два — три корня из двух; два плюс три пять. Восемьдесят и двадцать дают корень из пяти: четыре минус два, то есть два. Остальные две так же — четыре корня из трёх и пять корней из семи.',
    'Correct. In every record you took out first and added second. Eight is four times two — two roots of two; eighteen is nine times two — three roots of two; two plus three is five. Eighty and twenty both give the root of five: four minus two, that is two. The other two work the same — four roots of three and five roots of seven.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't4' || s.pair.m4 === 't1', text: L(
      "Ikki tavsifda koeffitsiyent bir xil — beshta, shuning uchun ularni faqat ILDIZ OSTI ajratadi. Birinchi yozuvda sakkiz va o'n sakkiz turadi, ikkalasida ham ikkilik: chiqargandan keyin ildiz ostida ikki qoladi. To'rtinchisida yigirma sakkiz va oltmish uch — ikkalasi ham yettiga bo'linadi, demak ildiz ostida yetti qoladi.",
      'В двух описаниях коэффициент одинаков — пять, поэтому различает их только ПОДКОРЕННОЕ. В первой записи стоят восемь и восемнадцать, в обоих двойка: после вынесения под корнем остаётся два. В четвёртой двадцать восемь и шестьдесят три — оба делятся на семь, значит под корнем останется семь.',
      'Two of the descriptions share the coefficient five, so only the RADICAND tells them apart. The first record holds eight and eighteen, both with a two: after taking out, two stays under the root. The fourth holds twenty eight and sixty three, both divisible by seven, so seven stays.') },
    { when: (s) => s.pair.m3 !== 't3', text: L(
      "Koeffitsiyent ikki bo'lgan natija AYIRMADAN chiqadi: sakson va yigirma bir xil ildiz ostini beradi, to'rt va ikki koeffitsiyent bilan, va to'rt minus ikki ikki. Qo'shish turgan yozuvlarda koeffitsiyentlar qo'shiladi, ya'ni natija kattaroq bo'ladi.",
      'Результат с коэффициентом два выходит из РАЗНОСТИ: восемьдесят и двадцать дают одно подкоренное с коэффициентами четыре и два, а четыре минус два два. Там, где сложение, коэффициенты складываются, то есть результат больше.',
      'The result with coefficient two comes from a DIFFERENCE: eighty and twenty give the same radicand with coefficients four and two, and four minus two is two. Where there is addition the coefficients add, so the result is bigger.') },
    { when: (s) => s.pair.m2 !== 't2', text: L(
      "Koeffitsiyent to'rt bo'lgan natijani ikkinchi yozuv beradi: yigirma yetti bu to'qqiz karra uch, ya'ni uch uchdan ildiz, va unga bir uchdan ildiz qo'shiladi. Ikkinchi haddan chiqarish kerak emas — u allaqachon eng qisqa ko'rinishda.",
      'Результат с коэффициентом четыре даёт вторая запись: двадцать семь это девять на три, то есть три корня из трёх, и к ним прибавляется один корень из трёх. Из второго слагаемого выносить нечего — оно уже в самом коротком виде.',
      'The result with coefficient four comes from the second record: twenty seven is nine times three, that is three roots of three, plus one root of three. The second term needs no work — it is already in its shortest form.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har yozuvda ikki qadam bor. Birinchisi: ikki haddan ham to'liq kvadratni chiqarish. Ikkinchisi: koeffitsiyentlarni qo'shish yoki ayirish. Ildiz ostidagi son esa o'zgarmaydi — u javobning ikkinchi yarmi.",
      'В каждой записи два шага. Первый: вынести полный квадрат из обоих слагаемых. Второй: сложить или вычесть коэффициенты. А подкоренное не меняется — это вторая половина ответа.',
      'Every record has two steps. First: take the perfect square out of both terms. Second: add or subtract the coefficients. The radicand does not change — it is the second half of the answer.') },
  ],
  wrongText: L(
    "Ildiz ostilarini qo'shmang: sakkizdan ildiz qo'shuv o'n sakkizdan ildiz yigirma oltidan ildizga teng emas — chap tomon yetti butunga yaqin, o'ng tomon esa besh butun. Avval chiqaring, keyin koeffitsiyentlarni qo'shing.",
    'Не складывай подкоренные: корень из восьми плюс корень из восемнадцати не равно корню из двадцати шести — слева около семи, а справа пять. Сначала вынеси, потом складывай коэффициенты.',
    'Do not add radicands: the root of eight plus the root of eighteen is not the root of twenty six — the left side is about seven, the right side five. Take out first, then add the coefficients.'),
};

export default function D13_05(props) { return <MatchPairs data={DATA} {...props} />; }
