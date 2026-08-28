// Dars13 · Amaliyot 06 — Saralash · 🟡 · teg: shartni-notogri-tenglamaga-otkazish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Zones.
//
// Zona — NOM emas, XOSSA: tenglama so'zdagi QAYSI iborani tashiydi.
// Uchta ibora bir-biriga o'xshab ketadi va aynan shu joyda masala
// buziladi: «marta katta», «ga katta», «kvadrati».
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, Zones } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'shartni-notogri-tenglamaga-otkazish', level: '🟡',
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Har bir tenglama so'zdagi bitta iboradan chiqqan. Qaysi iboradan?",
    'Каждое уравнение получено из одной фразы в тексте. Из какой?',
    'Each equation came from one phrase in the text. From which one?'),
  ask: L(
    'Tenglamani bosing, keyin guruhni bosing.',
    'Нажми уравнение, потом нажми группу.',
    'Tap an equation, then tap a group.'),
  itemSize: 16,
  zones: [
    { id: 'a', label: L('Marta katta', 'Раз больше', 'Times greater') },
    { id: 'b', label: L('Ga katta', 'На больше', 'Greater by') },
    { id: 'c', label: L('Kvadrati', 'Квадрат', 'The square') },
  ],
  items: [
    { id: 'i1', tokens: ['N = 6s'], zone: 'a' },
    { id: 'i2', tokens: ['a = 4b'], zone: 'a' },
    { id: 'i3', tokens: ['N = s + 6'], zone: 'b' },
    { id: 'i4', tokens: ['a = b + 4'], zone: 'b' },
    { id: 'i5', tokens: ['N = s²'], zone: 'c' },
    { id: 'i6', tokens: ['a = b²'], zone: 'c' },
  ],
  correctText: L(
    "To'g'ri. «Marta katta» ko'paytirishga aylanadi: N olti s ga teng. «Ga katta» qo'shishga: N s qo'shuv oltiga teng. «Kvadrati» esa sonning o'zini o'ziga ko'paytiradi: N s kvadratga teng. Sonlarda ko'rinadi: s olti bo'lsa, birinchi guruh o'ttiz olti beradi, ikkinchisi o'n ikki, uchinchisi ham o'ttiz olti — lekin uchinchi guruhda bu tasodif, s ni almashtirsangiz natijalar ajralib ketadi.",
    'Верно. «Раз больше» превращается в умножение: N равно шесть s. «На больше» — в сложение: N равно s плюс шесть. А «квадрат» умножает само число на себя: N равно s в квадрате. На числах это видно: при s равном шести первая группа даёт тридцать шесть, вторая — двенадцать, третья — тоже тридцать шесть; но в третьей группе это совпадение, поменяй s и результаты разойдутся.',
    'Correct. "Times greater" becomes multiplication: N equals six s. "Greater by" becomes addition: N equals s plus six. And "the square" multiplies the number by itself: N equals s squared. On numbers it shows: at s equal to six the first group gives thirty-six, the second twelve, the third thirty-six as well — but in the third group that is a coincidence; change s and the results part ways.'),
  wrongs: [
    { when: (s) => s.place.i3 === 'a' || s.place.i4 === 'a', text: L(
      "Bu yerda qo'shish turibdi, ko'paytirish emas. «Olti marta katta» N olti s ga teng, «oltiga katta» esa N s qo'shuv oltiga teng — sonlarda tekshiring: oltidan olti marta katta o'ttiz olti, oltiga katta esa o'n ikki.",
      'Здесь стоит сложение, а не умножение. «В шесть раз больше» — N равно шесть s, «на шесть больше» — N равно s плюс шесть; проверь на числах: в шесть раз больше шести — тридцать шесть, на шесть больше — двенадцать.',
      'This is addition, not multiplication. "Six times greater" is N equals six s, while "greater by six" is N equals s plus six; check on numbers: six times six is thirty-six, six more than six is twelve.') },
    { when: (s) => s.place.i1 === 'b' || s.place.i2 === 'b', text: L(
      "Bu yerda koeffitsient turibdi, qo'shiluvchi emas. Olti s degani s ni oltiga KO'PAYTIRISH.",
      'Здесь стоит коэффициент, а не слагаемое. Шесть s означает УМНОЖИТЬ s на шесть.',
      'This is a coefficient, not an addend. Six s means MULTIPLY s by six.') },
    { when: (s) => s.place.i5 !== 'c' || s.place.i6 !== 'c', text: L(
      "Kvadrat — bu sonni o'ziga ko'paytirish, boshqa songa emas. s kvadrat oltita s ham emas, s qo'shuv olti ham emas.",
      'Квадрат — это умножение числа на само себя, а не на другое число. s в квадрате — это ни шесть s, ни s плюс шесть.',
      'A square multiplies a number by itself, not by another number. s squared is neither six s nor s plus six.') },
    { when: (s) => s.place.i1 === 'c' || s.place.i3 === 'c', text: L(
      "Uchinchi guruhga faqat kvadrat yozilgan tenglamalar tushadi. Bu yozuvda daraja yo'q.",
      'В третью группу попадают только уравнения с квадратом. В этой записи степени нет.',
      'Only equations with a square belong to the third group. This record has no power in it.') },
  ],
  wrongText: L(
    "Har bir tenglamani so'zga qaytarib o'qing: bu yerda ko'paytirilyaptimi, qo'shilyaptimi yoki son o'ziga ko'paytirilyaptimi?",
    'Прочитай каждое уравнение обратно словами: здесь умножают, прибавляют или число умножают на себя?',
    'Read each equation back into words: is something multiplied, added, or is the number multiplied by itself?'),
};

export default function D13_06(props) { return <Zones data={DATA} {...props} />; }
