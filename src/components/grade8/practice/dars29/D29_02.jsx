// Dars29 · Amaliyot 02 — Guruhlar · 🟢 · tag: four_or_minus_four
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §11 (29-dars, 2-pozitsiya)
//
// KARTALAR JUFT-JUFT, farq esa minusning JOYIDA: ichkaridami yoki
// tashqarida. Modul ichidagi minus yo'qoladi (T1), tashqaridagisi qoladi.
//
// Ikki juftlikda modul ichida AYIRMA turadi: `|1 − 5|` va `−|1 − 5|`, hamda
// `|−4 − 0|` va `0 − |4|`. Ular hisobning tartibini tekshiradi: avval
// ichkarisi, keyin modul, oxirida tashqi belgi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'four_or_minus_four', level: '🟢',
  zoneSize: 16, itemSize: 16, zoneLbl: 104,
  zones: [
    { id: 'z1', tokens: ['4'] },
    { id: 'z2', tokens: ['−4'] },
  ],
  items: [
    { id: 'i1', tokens: ['|4|'], zone: 'z1' },
    { id: 'i2', tokens: ['−|4|'], zone: 'z2' },
    { id: 'i3', tokens: ['|−4|'], zone: 'z1' },
    { id: 'i4', tokens: ['−|−4|'], zone: 'z2' },
    { id: 'i5', tokens: ['|1 − 5|'], zone: 'z1' },
    { id: 'i6', tokens: ['−|1 − 5|'], zone: 'z2' },
    { id: 'i7', tokens: ['|−4 − 0|'], zone: 'z1' },
    { id: 'i8', tokens: ['0 − |4|'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz yozuvning qiymati yo to'rtga, yo minus to'rtga teng. Kartalar juft-juft turibdi, va farq minusning joyida: modul ichidami yoki tashqarisida.",
    'Значение восьми записей равно либо четырём, либо минус четырём. Карточки идут парами, а различие в месте минуса: внутри модуля или снаружи.',
    'The value of the eight records is either four or minus four. The cards come in pairs, differing in where the minus stands: inside the bars or outside.'),
  ask: L(
    'Yozuvni bosing, keyin guruhini bosing.',
    'Нажми запись, потом её группу.',
    'Tap a record, then its group.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Modul ICHIDAGI minus natijaga ta'sir qilmaydi, OLDIDAGI minus esa qoladi. Hisob tartibi: avval ichkarisi, keyin modul, oxirida tashqi belgi. Oxirgi kartada ayirish modul olingandan KEYIN bajariladi.",
    'Верно. Минус ВНУТРИ модуля на результат не влияет, а стоящий ПЕРЕД ним остаётся. Порядок вычисления: сначала внутреннее, потом модуль, в конце внешний знак. На последней карточке вычитание идёт ПОСЛЕ взятия модуля.',
    'Correct. A minus INSIDE the bars does not affect the result; one BEFORE them stays. The order: the inside first, then the absolute value, the outer sign last. On the last card the subtraction happens AFTER the absolute value.'),
  wrongs: [
    { when: (s) => s.place.i8 === 'z1', text: L(
      "Bu yozuvda modul ichida FAQAT to'rt turibdi. Tartib: avval to'rtning moduli olinadi — to'rt, — keyin noldan ayiriladi: nol minus to'rt minus to'rt. Qo'shni karta bilan solishtiring: u yerda ayirish modul ICHIDA, va natija boshqacha chiqadi.",
      'В этой записи внутри модуля стоит ТОЛЬКО четвёрка. Порядок: сначала берётся модуль четырёх — четыре, — потом он вычитается из нуля: нуль минус четыре минус четыре. Сравни с соседней карточкой: там вычитание ВНУТРИ модуля, и результат другой.',
      'In this record ONLY the four stands inside the bars. The order: first the absolute value of four is taken — four — and then it is subtracted from zero: zero minus four is minus four. Compare with the neighbouring card: there the subtraction is INSIDE the bars and the result differs.') },
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1' || s.place.i6 === 'z1', text: L(
      "Bu yozuvda minus modulning OLDIDA turibdi. Modul avval hisoblanadi va u har doim manfiy bo'lmagan son beradi, keyin esa oldidagi minus uni qarama-qarshi songa aylantiradi. Modul ichidagi minus yo'qoladi, tashqaridagisi esa yo'qolmaydi.",
      'В этой записи минус стоит ПЕРЕД модулем. Модуль вычисляется первым и всегда даёт неотрицательное число, а потом стоящий перед ним минус превращает его в противоположное. Минус внутри модуля исчезает, а снаружи не исчезает.',
      'In this record the minus stands BEFORE the bars. The absolute value is computed first and always gives a non-negative number; then the minus in front turns it into its opposite. A minus inside disappears, one outside does not.') },
    { when: (s) => s.place.i3 === 'z2' || s.place.i5 === 'z2' || s.place.i7 === 'z2', text: L(
      "Bu yozuvda minus modul ICHIDA turibdi, ya'ni u natijaga ta'sir qilmaydi. Modul noldan uzoqlikni beradi, uzoqlik esa manfiy bo'lmaydi: minus to'rt noldan to'rt birlik uzoqda, to'rtning o'zi ham to'rt birlik uzoqda.",
      'В этой записи минус стоит ВНУТРИ модуля, значит на результат он не влияет. Модуль даёт удалённость от нуля, а удалённость отрицательной не бывает: минус четыре отстоит от нуля на четыре, и сама четвёрка тоже на четыре.',
      'In this record the minus stands INSIDE the bars, so it does not affect the result. The absolute value gives a distance from zero, and a distance is never negative: minus four is four units from zero, and four is four units from zero as well.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har yozuvda bitta savolni bering: minus modulning ichidami yoki tashqarisida. Ichida bo'lsa u yo'qoladi, tashqarisida bo'lsa qoladi. Hisobni tartib bilan bajaring: ichkarisi, modul, tashqi belgi.",
      'В каждой записи задай один вопрос: минус внутри модуля или снаружи. Внутри — он исчезает, снаружи — остаётся. Вычисляй по порядку: внутреннее, модуль, внешний знак.',
      'Ask one question of every record: is the minus inside the bars or outside. Inside it disappears, outside it stays. Compute in order: the inside, the absolute value, the outer sign.') },
  ],
  wrongText: L(
    "Minusning joyiga qarang: modul ichida bo'lsa yo'qoladi, tashqarisida bo'lsa qoladi. Hisob tartibi — ichkarisi, modul, tashqi belgi.",
    'Смотри, где стоит минус: внутри модуля он исчезает, снаружи остаётся. Порядок вычисления — внутреннее, модуль, внешний знак.',
    'Look at where the minus stands: inside the bars it disappears, outside it stays. The order of computation is the inside, the absolute value, the outer sign.'),
};

export default function D29_02(props) { return <Zones data={DATA} {...props} />; }
