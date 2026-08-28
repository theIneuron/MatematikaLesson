// Dars16 · Amaliyot 04 — Saralash · 🟡 · teg: faqat-bitta-tengsizlikni-tekshirish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Zones.
//
// Zona — NOM emas, XOSSA: son sistemaning ikkala shartini bajaradimi,
// yoki faqat bittasini. Kartochkalar SON, ya'ni telefonda ham qisqa.
//
// TEKSHIRUV (x ≥ −2 va x < 5):
//   0, 4    ikkalasi ham bajariladi     -> yechim
//   5, 8    x ≥ −2 ha, x < 5 yo'q       -> faqat birinchisi
//   −3, −7  x < 5 ha, x ≥ −2 yo'q       -> faqat ikkinchisi
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, Zones } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'faqat-bitta-tengsizlikni-tekshirish', level: '🟡',
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Har bir sonni sistemaning IKKALA tengsizligiga ham qo'yib ko'ring.",
    'Подставь каждое число в ОБА неравенства системы.',
    'Put each number into BOTH inequalities of the system.'),
  ask: L(
    'Sonni bosing, keyin guruhni bosing.',
    'Нажми число, потом нажми группу.',
    'Tap a number, then tap a group.'),
  itemSize: 17,
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['x ≥ −2'], ['x < 5']],
  zones: [
    { id: 'a', label: L('Sistemaning yechimi', 'Решение системы', 'A solution of the system') },
    { id: 'b', label: L('Faqat birinchisini', 'Только первому', 'Only the first') },
    { id: 'c', label: L('Faqat ikkinchisini', 'Только второму', 'Only the second') },
  ],
  items: [
    { id: 'i1', tokens: ['0'], zone: 'a' },
    { id: 'i2', tokens: ['4'], zone: 'a' },
    { id: 'i3', tokens: ['5'], zone: 'b' },
    { id: 'i4', tokens: ['8'], zone: 'b' },
    { id: 'i5', tokens: ['−3'], zone: 'c' },
    { id: 'i6', tokens: ['−7'], zone: 'c' },
  ],
  correctText: L(
    "To'g'ri. Nol va to'rt ikkala shartni ham bajaradi — bular sistemaning yechimlari. Besh va sakkiz minus ikkidan katta, lekin beshdan kichik emas: beshning o'zi ham kirmaydi, chunki ikkinchi belgi qat'iy. Minus uch va minus yetti esa beshdan kichik, lekin minus ikkidan kichik bo'lib qolgan. Ikkinchi va uchinchi guruhning borligi darsning butun gapi: bitta tengsizlikni tekshirish yetmaydi.",
    'Верно. Нуль и четыре выполняют оба условия — это решения системы. Пять и восемь больше минус двух, но не меньше пяти: сама пятёрка тоже не входит, ведь второй знак строгий. А минус три и минус семь меньше пяти, но оказались меньше минус двух. Существование второй и третьей группы и есть весь смысл урока: проверить одно неравенство недостаточно.',
    'Correct. Zero and four satisfy both conditions — they are solutions of the system. Five and eight are greater than minus two but not less than five: five itself is out too, since the second sign is strict. And minus three and minus seven are less than five but turned out to be below minus two. The very existence of the second and third groups is the whole point of the lesson: checking one inequality is not enough.'),
  wrongs: [
    { when: (s) => s.place.i3 === 'a' || s.place.i4 === 'a', text: L(
      "Bu sonlar birinchi shartni bajaradi, lekin ikkinchisini yo'q: ular beshdan kichik emas. Beshning o'zi ham yechim emas, chunki belgi qat'iy — «kichik», «kichik yoki teng» emas.",
      'Эти числа выполняют первое условие, но не второе: они не меньше пяти. Сама пятёрка тоже не решение, ведь знак строгий — «меньше», а не «меньше или равно».',
      'These numbers satisfy the first condition but not the second: they are not less than five. Five itself is not a solution either, since the sign is strict — "less than", not "less than or equal".') },
    { when: (s) => s.place.i5 === 'a' || s.place.i6 === 'a', text: L(
      "Bu sonlar ikkinchi shartni bajaradi, lekin birinchisini yo'q: minus uch minus ikkidan KICHIK. Sonlar o'qida manfiy sonlar chapga qarab kichrayadi.",
      'Эти числа выполняют второе условие, но не первое: минус три МЕНЬШЕ минус двух. На числовой оси отрицательные числа убывают влево.',
      'These numbers satisfy the second condition but not the first: minus three is LESS than minus two. On the number line negative numbers get smaller to the left.') },
    { when: (s) => s.place.i1 !== 'a' || s.place.i2 !== 'a', text: L(
      "Nolni va to'rtni ikkala shartga qo'yib ko'ring: ikkalasi ham minus ikkidan katta va ikkalasi ham beshdan kichik. Demak ular sistemaning yechimlari.",
      'Подставь нуль и четыре в оба условия: оба больше минус двух и оба меньше пяти. Значит они решения системы.',
      'Put zero and four into both conditions: both are greater than minus two and both less than five. So they are solutions of the system.') },
    { when: (s) => s.place.i3 === 'c' || s.place.i4 === 'c' || s.place.i5 === 'b' || s.place.i6 === 'b', text: L(
      "Guruhlar almashib ketdi. Birinchi shart — iks minus ikkidan katta yoki teng, ikkinchisi — iks beshdan kichik. Har sonni ikkalasiga alohida qo'yib chiqing.",
      'Группы перепутаны. Первое условие — икс больше или равен минус двум, второе — икс меньше пяти. Подставь каждое число в оба по очереди.',
      'The groups got swapped. The first condition is x greater than or equal to minus two, the second is x less than five. Put each number into both in turn.') },
  ],
  wrongText: L(
    "Har son uchun ikkita tekshiruv qiling: u minus ikkidan katta yoki tengmi, va beshdan kichikmi? Ikkalasi ham «ha» bo'lsa — birinchi guruh.",
    'Для каждого числа делай две проверки: больше или равно минус двум, и меньше пяти? Если оба «да» — первая группа.',
    'Make two checks for each number: is it at least minus two, and is it less than five? Both "yes" — the first group.'),
};

export default function D16_04(props) { return <Zones data={DATA} {...props} />; }
