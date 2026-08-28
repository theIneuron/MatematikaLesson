// Dars09 · Amaliyot 04 — Guruhlar · 🟡 · teg: sistema-ikkala-tenglama
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Zones.
//
// Uch zona bitta narsani ajratadi: juftlik NECHTA tenglamani qanoatlantiradi.
// Ikkitasi — yechim, bittasi — hali yechim emas.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, Zones } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'sistema-ikkala-tenglama', level: '🟡',
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Har juftlikni ikkala tenglamaga ham qo'ying: yig'indi yettimi, ko'paytma o'n ikkimi?",
    'Подставь каждую пару в оба уравнения: сумма семь? произведение двенадцать?',
    'Put every pair into both equations: is the sum seven? is the product twelve?'),
  ask: L("Har bir juftlikni o'z guruhiga qo'ying.", 'Разложи каждую пару в свою группу.', 'Put each pair into its own group.'),
  bank: L('Juftliklar', 'Пары', 'Pairs'),
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['x + y = 7'], ['xy = 12']],
  zoneLbl: 124, zoneSize: 15, itemSize: 18,
  zones: [
    { id: 'a', label: L('Sistemaning yechimi', 'Решение системы', 'Solution of the system') },
    { id: 'b', label: L("Faqat yig'indi to'g'ri", 'Верна только сумма', 'Only the sum is right') },
    { id: 'c', label: L("Faqat ko'paytma to'g'ri", 'Верно только произведение', 'Only the product is right') },
  ],
  items: [
    { id: 'i1', tokens: ['(3; 4)'], zone: 'a' },
    { id: 'i2', tokens: ['(4; 3)'], zone: 'a' },
    { id: 'i3', tokens: ['(2; 5)'], zone: 'b' },
    { id: 'i4', tokens: ['(1; 6)'], zone: 'b' },
    { id: 'i5', tokens: ['(2; 6)'], zone: 'c' },
    { id: 'i6', tokens: ['(12; 1)'], zone: 'c' },
  ],
  correctText: L(
    "To'g'ri. Faqat ikkita juftlik ikkala shartni ham bajardi — va ular bir-biridan farq qiladi: uch-to'rtda iks uchga teng, to'rt-uchda to'rtga. Qolganlari bittasini bajardi, ikkinchisini yo'q: shuning uchun ular yechim emas, garchi bitta tenglamaga to'g'ri kelsa ham.",
    'Верно. Только две пары выполнили оба условия — и они различны: в три-четыре икс равен трём, в четыре-три четырём. Остальные выполнили одно условие, а другое нет: поэтому они не решения, хотя одному уравнению и подходят.',
    'Correct. Only two pairs satisfied both conditions — and they differ: in three-four x is three, in four-three it is four. The others satisfied one condition but not the other, so they are not solutions even though they fit one equation.'),
  wrongs: [
    { when: (s) => s.place.i3 === 'a' || s.place.i4 === 'a', text: L(
      "Yig'indi to'g'ri chiqdi, lekin ko'paytmani ham hisoblang: ikki karra besh va bir karra olti o'n ikkiga tengmi?",
      'Сумма верна, но посчитай и произведение: равны ли двенадцати два умножить на пять и один умножить на шесть?',
      'The sum is right, but compute the product too: are two times five and one times six equal to twelve?') },
    { when: (s) => s.place.i5 === 'a' || s.place.i6 === 'a', text: L(
      "Ko'paytma to'g'ri chiqdi, lekin yig'indini ham tekshiring: ikki qo'shuv olti sakkiz, o'n ikki qo'shuv bir esa o'n uch — ikkalasi ham yetti emas.",
      'Произведение верно, но проверь и сумму: два плюс шесть — восемь, двенадцать плюс один — тринадцать, и ни то, ни другое не семь.',
      'The product is right, but check the sum too: two plus six is eight, twelve plus one is thirteen — neither is seven.') },
    { when: (s) => s.place.i1 !== 'a' || s.place.i2 !== 'a', text: L(
      "Bu juftliklarni ikkala tenglamaga ham qo'ying: yig'indi yetti, ko'paytma o'n ikki. Ikkalasi ham bajarilyapti, demak ikkalasi ham yechim.",
      'Подставь эти пары в оба уравнения: сумма семь, произведение двенадцать. Оба выполняются, значит обе пары — решения.',
      'Put these pairs into both equations: sum seven, product twelve. Both hold, so both pairs are solutions.') },
  ],
  wrongText: L(
    "Har juftlik uchun ikkita hisob bajaring: yig'indi va ko'paytma. Guruhni ular nechtasi to'g'ri chiqqani hal qiladi.",
    'Для каждой пары сделай два вычисления: сумму и произведение. Группу решает то, сколько из них сошлось.',
    'For every pair do two computations: the sum and the product. The group is decided by how many of them came out right.'),
};

export default function D09_04(props) { return <Zones data={DATA} {...props} />; }
