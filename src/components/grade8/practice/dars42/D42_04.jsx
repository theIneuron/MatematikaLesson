// Dars42 · Amaliyot 04 — Juftlash · 🟡 · tag: find_missing
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §4 (42-dars, 4-pozitsiya)
//
// TESKARI YO'NALISH: yuza berilgan, yetmayotgan uzunlik izlanadi. Uch
// juftlikda asos, bittasida balandlik.
//   S=24, b=7, h=4 -> a=5      (2S:h = 12, undan 7 ni ayirish)
//   S=30, a=4, h=5 -> b=8
//   S=36, a=3, b=9 -> h=6      (2S:(a+b))
//   S=18, a=2, h=3 -> b=10
// Eng ko'p uchraydigan buzilish — 2S:h ning O'ZINI javob deb yozish, ya'ni
// ikki asosning yig'indisini bitta asos deb olish.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'find_missing', level: '🟡',
  connect: true,
  targetSize: 17, itemSize: 15,
  items: [
    { id: 'm1', tokens: ['S=24, b=7, h=4'] },
    { id: 'm2', tokens: ['S=30, a=4, h=5'] },
    { id: 'm3', tokens: ['S=36, a=3, b=9'] },
    { id: 'm4', tokens: ['S=18, a=2, h=3'] },
  ],
  targets: [
    { id: 't1', tokens: ['a = 5'] },
    { id: 't2', tokens: ['b = 8'] },
    { id: 't3', tokens: ['h = 6'] },
    { id: 't4', tokens: ['b = 10'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "To'rt trapetsiyaning yuzi berilgan, lekin har birida bitta uzunlik yetmaydi. Uchtasida asos, bittasida balandlik noma'lum.",
    'У четырёх трапеций дана площадь, но в каждой не хватает одной длины. В трёх неизвестно основание, в одной высота.',
    'The area of four trapezoids is given, but each is missing one length. Three lack a base, one lacks the height.'),
  ask: L(
    "Chapdan shartni bosing, keyin o'ngdan yetmayotgan qiymatni bosing.",
    'Нажми условие слева, потом недостающее значение справа.',
    'Tap a condition on the left, then the missing value on the right.'),
  correctText: L(
    "To'g'ri. Teskari yo'lda birinchi qadam bir xil: yuzani ikkilantirib balandlikka bo'lish, natijada ASOSLAR YIG'INDISI chiqadi. Birinchisida yigirma to'rtni ikkilantirsak qirq sakkiz, to'rtga bo'lsak o'n ikki — bu yig'indi, undan yettini ayirsak besh. Ikkinchisida oltmishni beshga bo'lsak o'n ikki, to'rtni ayirsak sakkiz. To'rtinchisida o'ttiz oltini uchga bo'lsak o'n ikki, ikkini ayirsak o'n. Uchinchisi boshqacha: u yerda ikki asos ham ma'lum, ya'ni yig'indi o'n ikki, yarmi olti; yetmish ikkini o'n ikkiga bo'lsak balandlik olti chiqadi.",
    'Верно. В обратном пути первый шаг одинаков: удвоить площадь и разделить на высоту, получится СУММА ОСНОВАНИЙ. В первой удвоим двадцать четыре — сорок восемь, разделим на четыре — двенадцать, это сумма; вычтем семь — пять. Во второй шестьдесят разделить на пять — двенадцать, вычтем четыре — восемь. В четвёртой тридцать шесть разделить на три — двенадцать, вычтем два — десять. Третья иная: там известны оба основания, сумма двенадцать, половина шесть; семьдесят два разделить на двенадцать — высота шесть.',
    'Correct. Going backwards the first step is always the same: double the area and divide by the height, and the SUM OF THE BASES comes out. In the first, double twenty four to forty eight, divide by four to get twelve — that is the sum; subtract seven and five remains. In the second, sixty divided by five is twelve, minus four is eight. In the fourth, thirty six divided by three is twelve, minus two is ten. The third is different: both bases are known there, the sum is twelve and half of it six; seventy two divided by twelve gives the height six.'),
  wrongs: [
    { when: (s) => s.pair.m3 && s.pair.m3 !== 't3', text: L(
      "Uchinchi shart boshqalardan farq qiladi: unda ikki asos ham berilgan, ya'ni izlanadigan narsa BALANDLIK. Yig'indining yarmi olti, va o'ttiz oltini oltiga bo'lsak balandlik olti chiqadi. Yozuvdagi harflarga qarang — nima yetmayotganini ular aytadi.",
      'Третье условие отличается от остальных: в нём даны оба основания, значит искать надо ВЫСОТУ. Половина суммы шесть, и тридцать шесть разделить на шесть — высота шесть. Смотри на буквы в записи — они и говорят, чего не хватает.',
      'The third condition differs from the others: both bases are given there, so what is missing is the HEIGHT. Half the sum is six, and thirty six divided by six gives the height six. Look at the letters in the record — they say what is missing.') },
    { when: (s) => s.pair.m1 === 't4' || s.pair.m4 === 't1', text: L(
      "Bu ikki juftlik almashib ketdi. Ikkalasida ham birinchi qadam bir xil (yig'indi o'n ikki chiqadi), lekin ayiriladigan asos boshqa: birinchisida yetti, to'rtinchisida ikki. O'n ikki minus yetti besh, o'n ikki minus ikki o'n.",
      'Эти две пары поменялись местами. В обеих первый шаг одинаков (сумма выходит двенадцать), но вычитаемое основание разное: в первой семь, в четвёртой два. Двенадцать минус семь — пять, двенадцать минус два — десять.',
      'These two pairs were swapped. In both the first step is the same (the sum comes to twelve), but the base subtracted differs: seven in the first, two in the fourth. Twelve minus seven is five, twelve minus two is ten.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Yuzani ikkilantirib balandlikka bo'lsangiz, ASOSLAR YIG'INDISI chiqadi — bu javob emas, oraliq natija. Undan ma'lum asosni ayirish kerak. Uch shartda ham yig'indi o'n ikki, ya'ni javoblar faqat ayiriladigan son bilan farq qiladi.",
      'Если удвоить площадь и разделить на высоту, выйдет СУММА ОСНОВАНИЙ — это не ответ, а промежуточный результат. Из неё надо вычесть известное основание. В трёх условиях сумма равна двенадцати, то есть ответы различаются только вычитаемым.',
      'Doubling the area and dividing by the height gives the SUM OF THE BASES — not the answer but an intermediate result. The known base must be subtracted from it. In three conditions the sum is twelve, so the answers differ only by what is subtracted.') },
  ],
  wrongText: L(
    "Yuzani ikkilantirib balandlikka bo'ling — asoslar yig'indisi chiqadi, undan ma'lum asosni ayiring.",
    'Удвой площадь и раздели на высоту — выйдет сумма оснований, вычти из неё известное основание.',
    'Double the area and divide by the height — that is the sum of the bases; subtract the known one.'),
};

export default function D42_04(props) { return <MatchPairs data={DATA} {...props} />; }
