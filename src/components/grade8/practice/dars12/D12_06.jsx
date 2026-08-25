// Dars12 · Amaliyot 06 — Juftlash · 🟡 · tag: value_to_record
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §3 (12-dars, 6-pozitsiya)
//
// To'rt yozuvda OSON NAQSH YO'Q. Birinchisida ikkala ko'paytuvchi ham to'liq
// kvadrat (4 va 16), qolgan uchtasida esa bitta ham emas: 6 va 24, 2 va 98,
// 5 va 125. Ya'ni bir topshiriqda xossaning ikki yo'nalishi yonma-yon turadi —
// to'g'ri tomon (alohida ildiz olish) va teskari tomon (avval ko'paytirish).
//
// Chapda SO'Z (`items[].label`), o'ngda YOZUV (`targets[].tokens`), tanlangan
// juftlik egri chiziq bilan birlashtiriladi (`connect: true`). O'ng ustun
// har ochilganda aralashtiriladi (MatchPairs ichida).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'value_to_record', level: '🟡',
  connect: true,
  targetSize: 15,
  items: [
    { id: 'm1', label: L('qiymati 8', 'значение 8', 'value 8') },
    { id: 'm2', label: L('qiymati 12', 'значение 12', 'value 12') },
    { id: 'm3', label: L('qiymati 14', 'значение 14', 'value 14') },
    { id: 'm4', label: L('qiymati 25', 'значение 25', 'value 25') },
  ],
  targets: [
    { id: 't1', tokens: [{ r: '4 · 16' }] },
    { id: 't2', tokens: [{ r: '6 · 24' }] },
    { id: 't3', tokens: [{ r: '2 · 98' }] },
    { id: 't4', tokens: [{ r: '5 · 125' }] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "To'rt yozuv va to'rt qiymat. Bittasida ikkala ko'paytuvchi ham to'liq kvadrat, qolgan uchtasida bittasi ham emas — u yerda avval ko'paytirish kerak.",
    'Четыре записи и четыре значения. В одной оба множителя полные квадраты, в остальных трёх ни один — там надо сначала перемножить.',
    'Four records and four values. In one, both factors are perfect squares; in the other three, neither is — there you must multiply first.'),
  ask: L(
    "Chapdan qiymatni bosing, keyin o'ngdan uning yozuvini bosing.",
    'Нажми значение слева, потом его запись справа.',
    'Tap a value on the left, then its record on the right.'),
  correctText: L(
    "To'g'ri. Birinchi yozuvda ikki yo'l ham ishlaydi: to'rtdan ildiz ikki, o'n oltidan ildiz to'rt, ikki karra to'rt sakkiz — yoki to'rt karra o'n olti oltmish to'rt, ildizi ham sakkiz. Qolgan uchtasida esa faqat ko'paytirish qoladi: olti karra yigirma to'rt yuz qirq to'rt, ildizi o'n ikki; ikki karra to'qsan sakkiz yuz to'qsan olti, ildizi o'n to'rt; besh karra yuz yigirma besh olti yuz yigirma besh, ildizi yigirma besh.",
    'Верно. В первой записи работают оба пути: корень из четырёх два, из шестнадцати четыре, два на четыре восемь — либо четыре на шестнадцать шестьдесят четыре, корень тоже восемь. В остальных трёх остаётся только умножение: шесть на двадцать четыре сто сорок четыре, корень двенадцать; два на девяносто восемь сто девяносто шесть, корень четырнадцать; пять на сто двадцать пять шестьсот двадцать пять, корень двадцать пять.',
    'Correct. In the first record both routes work: the root of four is two, of sixteen is four, two times four is eight — or four times sixteen is sixty four, whose root is also eight. In the other three only multiplication is left: six times twenty four is one hundred forty four, root twelve; two times ninety eight is one hundred ninety six, root fourteen; five times one hundred twenty five is six hundred twenty five, root twenty five.'),
  wrongs: [
    { when: (s) => s.pair.m1 !== 't1', text: L(
      "Birinchi qiymat eng kichigi va u eng kichik ko'paytmaga tegishli: to'rt karra o'n olti oltmish to'rt, ildizi sakkiz. Boshqa uch ko'paytma yuz qirq to'rt, yuz to'qsan olti va olti yuz yigirma besh — hech biri sakkizning kvadrati emas.",
      'Первое значение самое маленькое и относится к самому маленькому произведению: четыре на шестнадцать шестьдесят четыре, корень восемь. Остальные три произведения — сто сорок четыре, сто девяносто шесть и шестьсот двадцать пять — ни одно не квадрат восьми.',
      'The first value is the smallest and belongs to the smallest product: four times sixteen is sixty four, whose root is eight. The other three products are one hundred forty four, one hundred ninety six and six hundred twenty five — none of them is eight squared.') },
    { when: (s) => s.pair.m2 === 't3' || s.pair.m3 === 't2', text: L(
      "O'n ikki va o'n to'rt bir-biriga yaqin, shuning uchun ularni kvadrat bilan ajratish kerak. O'n ikkining kvadrati yuz qirq to'rt — bu olti karra yigirma to'rt. O'n to'rtning kvadrati yuz to'qsan olti — bu ikki karra to'qsan sakkiz. Ko'paytmalarni hisoblab solishtiring.",
      'Двенадцать и четырнадцать близки, поэтому различай их квадратом. Двенадцать в квадрате сто сорок четыре — это шесть на двадцать четыре. Четырнадцать в квадрате сто девяносто шесть — это два на девяносто восемь. Посчитай произведения и сравни.',
      'Twelve and fourteen are close, so tell them apart by squaring. Twelve squared is one hundred forty four, which is six times twenty four. Fourteen squared is one hundred ninety six, which is two times ninety eight. Compute the products and compare.') },
    { when: (s) => s.pair.m4 !== 't4', text: L(
      "Yigirma beshning kvadrati olti yuz yigirma besh, va bu besh karra yuz yigirma beshga teng. Ko'paytuvchining kattasi bo'yicha tanlab bo'lmaydi: to'qsan sakkiz ham katta, lekin ikki karra to'qsan sakkiz faqat yuz to'qsan olti beradi.",
      'Двадцать пять в квадрате шестьсот двадцать пять, и это пять на сто двадцать пять. По большому множителю выбирать нельзя: девяносто восемь тоже велико, но два на девяносто восемь даёт лишь сто девяносто шесть.',
      'Twenty five squared is six hundred twenty five, which is five times one hundred twenty five. You cannot choose by the larger factor: ninety eight is large too, yet two times ninety eight only gives one hundred ninety six.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har yozuvda bitta ish qiling: ikki ko'paytuvchini ko'paytiring va chiqqan sonning ildizini toping. Yoki teskari tomondan yuring — chapdagi qiymatni kvadratga oshirib, o'sha ko'paytmani qidiring.",
      'С каждой записью делай одно: перемножь два множителя и найди корень полученного числа. Или иди с другой стороны — возведи значение слева в квадрат и ищи такое произведение.',
      'Do one thing with every record: multiply the two factors and find the root of the result. Or work backwards — square the value on the left and look for that product.') },
  ],
  wrongText: L(
    "Ko'paytuvchilarga alohida qarash bu yerda kam yordam beradi: ularning uchtasida to'liq kvadrat yo'q. Ko'paytmani hisoblang yoki chapdagi qiymatni kvadratga oshirib solishtiring.",
    'Смотреть на множители по отдельности здесь помогает мало: в трёх из них полных квадратов нет. Посчитай произведение или возведи значение слева в квадрат и сравни.',
    'Looking at the factors separately helps little here: three of them hold no perfect squares. Compute the product, or square the value on the left and compare.'),
};

export default function D12_06(props) { return <MatchPairs data={DATA} {...props} />; }
