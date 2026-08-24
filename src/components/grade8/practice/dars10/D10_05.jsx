// Dars10 · Amaliyot 05 — Guruhlar · 🟡 · tag: exists_always_or_never
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §8 (10-dars, 5-pozitsiya)
//
// Darsning ikkinchi tasdig'i: ildiz ildiz osti nomanfiy bo'lgan joyda bor.
// Sakkiz yozuv ikki QARAMA-QARSHI guruhga bo'linadi: biri har qanday c da
// ma'noga ega, ikkinchisi hech qanday c da ega emas. O'rtacha holat («faqat
// ba'zi c da») bu yerda ataylab yo'q — u 08-topshiriqda alohida so'raladi.
//
// Tuzoqlar: c⁴ juft daraja (har doim nomanfiy), minus c kvadrat minus to'rt
// esa har doim manfiy — ikkalasi ham «harf bor, demak noma'lum» degan
// taxminni rad etadi (З32).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'exists_always_or_never', level: '🟡',
  zoneLbl: 100, itemSize: 17,
  zones: [
    { id: 'always', label: L('har doim bor', 'есть всегда', 'always exists') },
    { id: 'never', label: L('hech qachon', 'нет никогда', 'never exists') },
  ],
  items: [
    { id: 'i1', tokens: [{ r: 'c²' }], zone: 'always' },
    { id: 'i2', tokens: [{ r: 'c² + 1' }], zone: 'always' },
    { id: 'i3', tokens: [{ r: '(c − 3)²' }], zone: 'always' },
    { id: 'i4', tokens: [{ r: 'c⁴' }], zone: 'always' },
    { id: 'i5', tokens: [{ r: '−c² − 4' }], zone: 'never' },
    { id: 'i6', tokens: [{ r: '−9' }], zone: 'never' },
    { id: 'i7', tokens: [{ r: '−(5²)' }], zone: 'never' },
    { id: 'i8', tokens: [{ r: '1 − 4' }], zone: 'never' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz yozuv. Ba'zilari c ning har qanday qiymatida ma'noga ega, ba'zilari esa hech qanday qiymatida ega emas.",
    'Восемь записей. Одни имеют смысл при любом значении c, другие не имеют ни при каком.',
    'Eight records. Some have a value for every c, others have none for any c.'),
  ask: L('Yozuvni bosing, keyin uning guruhini bosing.', 'Нажми запись, потом её группу.', 'Tap a record, then tap its group.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Birinchi guruhda ildiz osti hech qachon manfiy bo'lmaydi: kvadrat nomanfiy, kvadrat qo'shuv bir kamida bir, qavsning kvadrati ham nomanfiy, to'rtinchi daraja esa kvadratning kvadrati. Ikkinchi guruhda ildiz osti hech qachon nomanfiy bo'lmaydi: minus c kvadrat minus to'rt eng kattasi minus to'rt, qolganlari esa oddiy manfiy sonlar — minus to'qqiz, minus yigirma besh va minus uch.",
    'Верно. В первой группе подкоренное никогда не отрицательно: квадрат неотрицателен, квадрат плюс один не меньше единицы, квадрат скобки тоже неотрицателен, а четвёртая степень это квадрат квадрата. Во второй группе подкоренное никогда не бывает неотрицательным: минус c в квадрате минус четыре в лучшем случае минус четыре, а остальные просто отрицательные числа — минус девять, минус двадцать пять и минус три.',
    'Correct. In the first group the radicand is never negative: a square is non-negative, a square plus one is at least one, the square of a bracket is non-negative too, and a fourth power is the square of a square. In the second group the radicand is never non-negative: minus c squared minus four is at best minus four, and the rest are plain negative numbers — minus nine, minus twenty five and minus three.'),
  wrongs: [
    { when: (s) => s.place.i4 === 'never', text: L(
      "To'rtinchi daraja — kvadratning kvadrati, ya'ni u ham nomanfiy. c ni minus ikkiga qo'ying: minus ikkining to'rtinchi darajasi o'n olti, ildizi to'rt. Manfiy natija chiqmaydi.",
      'Четвёртая степень это квадрат квадрата, значит она тоже неотрицательна. Подставь c равное минус двум: минус два в четвёртой степени шестнадцать, корень четыре. Отрицательного результата не выйдет.',
      'A fourth power is the square of a square, so it is non-negative too. Put c equal to minus two: minus two to the fourth is sixteen and the root is four. A negative result never appears.') },
    { when: (s) => s.place.i5 === 'always', text: L(
      "Bu yozuvda minus butun kvadratga tegishli. c ni nolga qo'ying: minus nol minus to'rt, ya'ni minus to'rt. c ni ikkiga qo'ying: minus to'rt minus to'rt, ya'ni minus sakkiz. Qanday c olsangiz ham natija manfiy.",
      'В этой записи минус относится ко всему квадрату. Подставь c равное нулю: минус нуль минус четыре, то есть минус четыре. Подставь два: минус четыре минус четыре, то есть минус восемь. Какое c ни возьми, результат отрицателен.',
      'In this record the minus belongs to the whole square. Put c equal to zero: minus zero minus four is minus four. Put two: minus four minus four is minus eight. Whichever c you take, the result is negative.') },
    { when: (s) => s.place.i8 === 'always' || s.place.i7 === 'always', text: L(
      "Bu yozuvlarda harf yo'q, demak ildiz ostini oxirigacha hisoblash kifoya: bir minus to'rt minus uch, minus qavs ichida besh kvadrat esa minus yigirma besh. Ikkalasi ham manfiy.",
      'В этих записях буквы нет, значит подкоренное достаточно посчитать до конца: один минус четыре — минус три, а минус квадрат пяти — минус двадцать пять. Оба отрицательны.',
      'These records have no letter, so it is enough to compute the radicand to the end: one minus four is minus three, and minus five squared is minus twenty five. Both are negative.') },
    { when: (s) => s.place.i2 === 'never' || s.place.i3 === 'never' || s.place.i1 === 'never', text: L(
      "Bu yozuvlarda ildiz osti kvadratdan tuzilgan, kvadrat esa manfiy bo'lmaydi. c ni minus o'nga ham, nolga ham qo'yib ko'ring: natija har doim nomanfiy.",
      'В этих записях подкоренное собрано из квадрата, а квадрат не бывает отрицательным. Подставь c и минус десять, и нуль: результат всегда неотрицателен.',
      'In these records the radicand is built from a square, and a square is never negative. Put c equal to minus ten and to zero: the result is non-negative every time.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har yozuvda bitta ish qiling: c ga ikki qiymat qo'ying — nol va minus o'n. Ildiz osti ikkalasida ham nomanfiy chiqsa, birinchi guruh; ikkalasida ham manfiy chiqsa, ikkinchisi.",
      'С каждой записью делай одно: подставь c равное нулю и минус десяти. Если подкоренное в обоих случаях неотрицательно — первая группа, если в обоих отрицательно — вторая.',
      'Do one thing with every record: put c equal to zero and to minus ten. If the radicand is non-negative both times it is the first group; if negative both times, the second.') },
  ],
  wrongText: L(
    "Ildiz ostiga qarang: u kvadratdan tuzilganmi yoki oldida minus turadimi. Ikki qiymat qo'yib tekshiring.",
    'Смотри на подкоренное: собрано ли оно из квадрата или перед ним стоит минус. Проверь подстановкой двух значений.',
    'Look at the radicand: is it built from a square, or does a minus stand in front of it. Check by substituting two values.'),
};

export default function D10_05(props) { return <Zones data={DATA} {...props} />; }
