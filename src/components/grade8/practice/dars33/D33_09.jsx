// Dars33 · Amaliyot 09 — Juftlash · 🔴 · tag: number_to_standard
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §5 (33-dars, 9-pozitsiya)
//
// MANTISSA TO'RT JOYDA HAM BIR XIL — 7,2. Ya'ni javobni raqamlarga qarab
// tanlab bo'lmaydi: o'ng ustundagi to'rt karta faqat KO'RSATKICH bilan
// farq qiladi, va uni topish uchun vergulni sanash shart.
//
// Ikki juftlik manfiy ko'rsatkichli, ikkitasi musbat, va ular yonma-yon
// turadi: 0,00072 va 0,0072 bir xona bilan, 72000 va 720 ikki xona bilan.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'number_to_standard', level: '🔴',
  connect: true,
  targetSize: 17, itemSize: 17,
  items: [
    { id: 'm1', tokens: ['0,00072'] },
    { id: 'm2', tokens: ['0,0072'] },
    { id: 'm3', tokens: ['72 000'] },
    { id: 'm4', tokens: ['720'] },
  ],
  targets: [
    { id: 't1', tokens: ['7,2 · 10⁻⁴'] },
    { id: 't2', tokens: ['7,2 · 10⁻³'] },
    { id: 't3', tokens: ['7,2 · 10⁴'] },
    { id: 't4', tokens: ['7,2 · 10²'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "To'rt sonda bir xil ikki raqam turibdi — yetti va ikki. Shu sababli o'ng ustundagi to'rt yozuvning mantissasi ham bir xil, va ular faqat ko'rsatkich bilan farq qiladi.",
    'В четырёх числах стоят одни и те же две цифры — семь и два. Поэтому и мантисса у четырёх записей справа одинакова, и различаются они только показателем.',
    'The four numbers hold the same two digits — seven and two. So the mantissa of the four records on the right is the same as well, and they differ only in the exponent.'),
  ask: L(
    "Chapdan sonni bosing, keyin o'ngdan uning standart yozuvini bosing.",
    'Нажми число слева, потом его стандартную запись справа.',
    'Tap a number on the left, then its standard record on the right.'),
  correctText: L(
    "To'g'ri. Mantissa to'rt joyda ham yetti butun ikki o'ndan, ya'ni javobni faqat ko'rsatkich hal qiladi. Birinchi ikki son birdan kichik: nol butun nol nol nol yetti ikki o'n mingdan da vergul to'rt xona o'ngga suriladi, nol butun nol nol yetti ikki mingdan da esa uch xona — ya'ni minus to'rt va minus uch. Keyingi ikkitasi birdan katta: yetmish ikki mingda vergul to'rt xona chapga, yetti yuz yigirmada ikki xona chapga suriladi — to'rt va ikki. Sonlarni tartiblasangiz ko'rsatkichlar ham tartiblanadi: eng kichik songa eng kichik ko'rsatkich mos keladi.",
    'Верно. Мантисса во всех четырёх семь целых две десятых, значит ответ решает только показатель. Первые два числа меньше единицы: в нуле целых семидесяти двух стотысячных запятая сдвигается на четыре разряда вправо, а в нуле целых семидесяти двух десятитысячных на три — то есть минус четыре и минус три. Следующие два больше единицы: в семидесяти двух тысячах запятая сдвигается на четыре разряда влево, в семистах двадцати на два — четыре и два. Если упорядочить числа, упорядочатся и показатели: наименьшему числу отвечает наименьший показатель.',
    'Correct. The mantissa is seven point two in all four, so only the exponent decides. The first two numbers are below one: in zero point zero zero zero seven two the point moves four places right, in zero point zero zero seven two three places — that is minus four and minus three. The next two are above one: in seventy-two thousand the point moves four places left, in seven hundred twenty two places — four and two. Order the numbers and the exponents order with them: the smallest number takes the smallest exponent.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Bu ikki son bitta nol bilan farq qiladi, ya'ni ularning ko'rsatkichlari ham bittaga farq qiladi. Vergulni sanashning ishonchli yo'li — yettigacha bo'lgan nollarni sanash: birinchi sonda vergul va yetti orasida uchta nol bor, ya'ni jami to'rt xona; ikkinchisida ikkita nol, ya'ni uch xona. Nol ko'proq bo'lsa son kichikroq va ko'rsatkichning moduli kattaroq.",
      'Эти два числа отличаются одним нулём, значит и показатели отличаются на единицу. Надёжный способ счёта — сосчитать нули до семёрки: в первом числе между запятой и семёркой три нуля, то есть всего четыре разряда; во втором два нуля, то есть три. Больше нулей — меньше число и больше модуль показателя.',
      'These two numbers differ by one zero, so their exponents differ by one. A safe way to count is to count the zeros before the seven: in the first there are three zeros between the point and the seven, so four places in all; in the second there are two zeros, so three. More zeros means a smaller number and a larger exponent in size.') },
    { when: (s) => s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Bu ikki son ikki xonaga farq qiladi: yetmish ikki ming yetti yuz yigirmadan yuz baravar katta. Yettidan keyingi raqamlarni sanang: yetmish ikki mingda ikki, nol, nol, nol — to'rtta; yetti yuz yigirmada ikki va nol — ikkita. Katta songa katta ko'rsatkich to'g'ri keladi.",
      'Эти два числа отличаются на два разряда: семьдесят две тысячи в сто раз больше семисот двадцати. Сосчитай цифры после семёрки: в семидесяти двух тысячах два, нуль, нуль, нуль — четыре; в семистах двадцати два и нуль — две. Большему числу отвечает больший показатель.',
      'These two numbers differ by two places: seventy-two thousand is a hundred times seven hundred twenty. Count the digits after the seven: in seventy-two thousand there are two, zero, zero, zero — four; in seven hundred twenty, two and zero — two. A larger number takes a larger exponent.') },
    { when: (s) => s.pair.m1 === 't3' || s.pair.m1 === 't4' || s.pair.m2 === 't3' || s.pair.m2 === 't4', text: L(
      "Kichik songa musbat ko'rsatkich berildi. Avval ISHORANI aniqlang: son birdan kichik bo'lsa ko'rsatkich manfiy, kattaroq bo'lsa musbat. Bu ikki savolni ajrating — ishora sonning kattaligidan, modul esa vergulning surilishidan chiqadi.",
      'Маленькому числу дан положительный показатель. Сначала определи ЗНАК: число меньше единицы — показатель отрицателен, больше — положителен. Раздели два вопроса: знак берётся из величины числа, а модуль из сдвига запятой.',
      'A small number was given a positive exponent. Settle the SIGN first: below one the exponent is negative, above one positive. Separate the two questions — the sign comes from the size of the number, the magnitude from the shift of the point.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har songa ikki savol bering: u birdan kichikmi (ishora) va vergul necha xona suriladi (kattalik). Mantissa to'rt joyda ham bir xil, shuning uchun uni taqqoslash yordam bermaydi.",
      'К каждому числу задай два вопроса: меньше ли оно единицы (знак) и на сколько разрядов сдвигается запятая (величина). Мантисса во всех четырёх одинакова, поэтому сравнивать её бесполезно.',
      'Ask two questions of every number: is it below one (the sign), and how many places does the point move (the size). The mantissa is the same in all four, so comparing it does not help.') },
  ],
  wrongText: L(
    "Ishorani sonning kattaligidan, ko'rsatkichning modulini esa vergul surilgan xonalar sonidan oling. Mantissa to'rt joyda ham bir xil.",
    'Знак бери из величины числа, а модуль показателя — из числа разрядов сдвига запятой. Мантисса во всех четырёх одинакова.',
    'Take the sign from the size of the number and the magnitude of the exponent from the number of places the point moves. The mantissa is the same in all four.'),
};

export default function D33_09(props) { return <MatchPairs data={DATA} {...props} />; }
