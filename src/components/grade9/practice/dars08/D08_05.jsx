// Dars08 · Amaliyot 05 — Guruhlar · 🟡 · teg: maxraj-nolga-teng
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Zones.
//
// Uchinchi zona alohida: maxraj bor, lekin u HECH QACHON nolga aylanmaydi,
// demak ODZ butun sonlar o'qi. «Maxraj bor — demak taqiq bor» degan
// yolg'on qoida shu yerda ochiladi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, Zones } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'maxraj-nolga-teng', level: '🟡',
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Guruhni maxraj hal qiladi: u qaysi sonda nolga aylanadi?",
    'Группу решает знаменатель: при каком числе он обращается в нуль?',
    'The group is decided by the denominator: at which number does it become zero?'),
  ask: L("Har bir yozuvni o'z guruhiga qo'ying.", 'Разложи каждую запись в свою группу.', 'Put each record into its own group.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  zoneLbl: 118, zoneSize: 16, itemSize: 17,
  zones: [
    { id: 'a', label: L('ODZ: x ≠ 0', 'ОДЗ: x ≠ 0', 'Domain: x ≠ 0') },
    { id: 'b', label: L('ODZ: x ≠ 4', 'ОДЗ: x ≠ 4', 'Domain: x ≠ 4') },
    { id: 'c', label: L('ODZ: barcha sonlar', 'ОДЗ: все числа', 'Domain: all numbers') },
  ],
  items: [
    { id: 'i1', tokens: [{ n: '5', d: 'x' }], zone: 'a' },
    { id: 'i2', tokens: [{ n: 'x + 1', d: 'x' }], zone: 'a' },
    { id: 'i3', tokens: [{ n: '7', d: 'x − 4' }], zone: 'b' },
    { id: 'i4', tokens: [{ n: '2', d: 'x − 4' }], zone: 'b' },
    { id: 'i5', tokens: [{ n: 'x', d: 'x² + 1' }], zone: 'c' },
    { id: 'i6', tokens: [{ n: '3', d: 'x² + 2' }], zone: 'c' },
  ],
  correctText: L(
    "To'g'ri. ODZ ni surat emas, MAXRAJ hal qiladi: suratda nima turishi ahamiyatsiz. Oxirgi ikkitasida maxrajda kvadrat ustiga musbat son qo'shilgan — bunday yig'indi hech qachon nolga aylanmaydi, shuning uchun taqiq ham yo'q. Maxrajning borligining o'zi hali taqiq degani emas.",
    'Верно. ОДЗ решает не числитель, а ЗНАМЕНАТЕЛЬ: что стоит в числителе, неважно. В последних двух в знаменателе к квадрату прибавлено положительное число — такая сумма никогда не обращается в нуль, поэтому и запрета нет. Наличие знаменателя само по себе ещё не запрет.',
    'Correct. The domain is decided by the DENOMINATOR, not the numerator: what stands on top does not matter. In the last two a positive number is added to a square in the denominator — such a sum never becomes zero, so there is no ban. Having a denominator is not yet a ban.'),
  wrongs: [
    { when: (s) => s.place.i5 !== 'c' || s.place.i6 !== 'c', text: L(
      "Maxrajni nolga tenglashtirib ko'ring: kvadrat manfiy bo'lmaydi, ustiga musbat son qo'shiladi. Bunday yig'indi eng kichik holatda nechchiga teng?",
      'Приравняй знаменатель к нулю: квадрат неотрицателен, к нему прибавляют положительное число. Чему равна такая сумма в самом малом случае?',
      'Set the denominator to zero: a square is never negative and a positive number is added to it. What is the smallest such a sum can be?') },
    { when: (s) => s.place.i2 !== 'a', text: L(
      "Suratda iks qo'shuv bir turgani ODZ ga ta'sir qilmaydi. Maxrajga qarang: u qaysi sonda nolga aylanadi?",
      'То, что в числителе стоит икс плюс один, на ОДЗ не влияет. Смотри на знаменатель: при каком числе он обращается в нуль?',
      'The x plus one in the numerator does not affect the domain. Look at the denominator: at which number does it become zero?') },
    { when: (s) => s.place.i3 !== 'b' || s.place.i4 !== 'b', text: L(
      "Iks minus to'rt qaysi sonda nolga aylanadi? Uni nolga tenglashtiring.",
      'При каком числе икс минус четыре обращается в нуль? Приравняй его к нулю.',
      'At which number does x minus four become zero? Set it equal to zero.') },
    { when: (s) => s.place.i1 !== 'a', text: L(
      "Maxrajda toza iks turibdi, u nolda nolga aylanadi. Suratdagi besh bunga aloqasi yo'q.",
      'В знаменателе стоит чистый икс, он обращается в нуль при нуле. Пятёрка в числителе к этому отношения не имеет.',
      'The denominator is a bare x, and it becomes zero at zero. The five in the numerator has nothing to do with it.') },
  ],
  wrongText: L(
    "Har yozuvda faqat MAXRAJGA qarang va uni nolga tenglashtiring. Yechimi bo'lmasa, ODZ — barcha sonlar.",
    'Смотри в каждой записи только на ЗНАМЕНАТЕЛЬ и приравнивай его к нулю. Если решения нет, ОДЗ — все числа.',
    'Look only at the DENOMINATOR in each record and set it to zero. If there is no solution, the domain is all numbers.'),
};

export default function D08_05(props) { return <Zones data={DATA} {...props} />; }
