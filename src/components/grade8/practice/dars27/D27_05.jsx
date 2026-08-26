// Dars27 · Amaliyot 05 — Guruhlar · 🟡 · tag: three_inside
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §9 (27-dars, 5-pozitsiya)
//
// UCH JUFTLIK — BIR XIL SONLAR, BOSHQA QAVSLAR (З54 va З56 birga):
//   [3;8] va (3;8)   chap chegara uchda
//   (1;3] va (1;3)   o'ng chegara uchda
//   [0;3] va [0;3)   yana o'ng chegara uchda
// To'rtinchi juftlik esa boshqa: `(2;4)` da uch ICHKARIDA turadi, `[4;9]`
// da esa uch umuman uzoqda. Ular chegaraga tegishli bo'lmagan holni
// ko'rsatadi: qavsning turi faqat CHEGARADA hal qiladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'three_inside', level: '🟡',
  zoneSize: 14, itemSize: 16, zoneLbl: 116,
  given: [['x = 3']],
  givenLabel: L('Tekshirilayotgan son', 'Проверяемое число', 'The number tested'),
  zones: [
    { id: 'z1', label: L('3 KIRADI', '3 ВХОДИТ', '3 IS IN') },
    { id: 'z2', label: L('3 KIRMAYDI', '3 НЕ ВХОДИТ', '3 IS OUT') },
  ],
  items: [
    { id: 'i1', tokens: ['[3; 8]'], zone: 'z1' },
    { id: 'i2', tokens: ['(3; 8)'], zone: 'z2' },
    { id: 'i3', tokens: ['(1; 3]'], zone: 'z1' },
    { id: 'i4', tokens: ['(1; 3)'], zone: 'z2' },
    { id: 'i5', tokens: ['[0; 3]'], zone: 'z1' },
    { id: 'i6', tokens: ['[0; 3)'], zone: 'z2' },
    { id: 'i7', tokens: ['(2; 4)'], zone: 'z1' },
    { id: 'i8', tokens: ['[4; 9]'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz oraliq, va hammasida bitta son tekshiriladi: uch. Uch oraliqda u chegarada turadi, bir oraliqda ichkarida, bir oraliqda esa umuman uzoqda.",
    'Восемь промежутков, и во всех проверяется одно число: три. В трёх парах оно стоит на границе, в одном промежутке внутри, а в одном вовсе далеко.',
    'Eight ranges, and one number is tested in all of them: three. In three pairs it sits on the boundary, in one range it is inside, and in one it is far away.'),
  ask: L(
    'Oraliqni bosing, keyin guruhini bosing.',
    'Нажми промежуток, потом его группу.',
    'Tap a range, then its group.'),
  bank: L('Oraliqlar', 'Промежутки', 'Ranges'),
  correctText: L(
    "To'g'ri. Uch chegarada turgan joyda qavs hal qiladi. Ichkaridagi son uchun esa qavsning turi ahamiyatsiz, uzoqdagi son uchun ham: qavs faqat CHEGARADA ishlaydi.",
    'Верно. Там, где три стоит на границе, решает скобка. А для числа внутри тип скобки не важен, как и для далёкого: скобка работает только НА ГРАНИЦЕ.',
    'Correct. Where the three sits on the boundary the bracket decides. For a number inside the bracket type does not matter, nor for a distant one: a bracket works only ON THE BOUNDARY.'),
  wrongs: [
    { when: (s) => s.place.i7 === 'z2', text: L(
      "Bu oraliqda uch CHEGARADA emas, ICHKARIDA turadi: ikki bilan to'rt orasida. Ichkaridagi son uchun qavsning turi ahamiyatsiz — u har qanday holda ham to'plamga kiradi. Tengsizlik bilan yozing: ikki uchdan kichik, uch to'rtdan kichik — ikkala shart ham bajarildi.",
      'В этом промежутке тройка стоит не НА ГРАНИЦЕ, а ВНУТРИ: между двумя и четырьмя. Для числа внутри тип скобки не важен — оно входит в любом случае. Запиши неравенством: два меньше трёх, три меньше четырёх — оба условия выполнены.',
      'In this range the three sits not ON the boundary but INSIDE: between two and four. For a number inside, the bracket type does not matter — it belongs either way. Write it as an inequality: two is less than three, three is less than four — both conditions hold.') },
    { when: (s) => s.place.i8 === 'z1', text: L(
      "Bu oraliqda uch UMUMAN yo'q: to'plam to'rtdan boshlanadi, uch esa undan kichik. Kvadrat qavs faqat chegaraning O'ZINI kiritadi, chegaradan chapdagi sonlarni emas. Tekshiring: to'rt uchdan kichik emas, ya'ni birinchi shart buzildi.",
      'В этом промежутке тройки нет ВОВСЕ: множество начинается с четырёх, а три меньше. Квадратная скобка включает только САМУ границу, а не числа левее неё. Проверь: четыре не меньше трёх, значит первое условие нарушено.',
      'In this range there is no three AT ALL: the set starts at four, and three is smaller. A square bracket includes only the boundary ITSELF, not the numbers to its left. Check: four is not less than three, so the first condition fails.') },
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1' || s.place.i6 === 'z1', text: L(
      "Bu oraliqda uch chegarada turibdi, va uning qavsi DUMALOQ — ya'ni chegara chiqarib tashlanadi. Tengsizlik bilan yozing va uchning o'zini qo'ying: uch uchdan qat'iy kichik emas, u unga teng. Qavsning shakli bitta narsani hal qiladi, lekin u aynan shu joyda hal qiladi.",
      'В этом промежутке тройка стоит на границе, и её скобка КРУГЛАЯ — значит граница исключается. Запиши неравенством и подставь саму тройку: три не строго меньше трёх, оно ему равно. Форма скобки решает одну вещь, но решает её именно здесь.',
      'In this range the three sits on the boundary and its bracket is ROUND — so the boundary is excluded. Write it as an inequality and substitute three itself: three is not strictly less than three, it equals it. The shape of the bracket decides one thing, and this is exactly where it decides it.') },
    { when: (s) => s.place.i1 === 'z2' || s.place.i3 === 'z2' || s.place.i5 === 'z2', text: L(
      "Bu oraliqda uch chegarada turibdi, va uning qavsi KVADRAT — ya'ni chegara kiradi. Uchning o'zini qo'ying: uch uchga teng, va kvadrat qavs tenglikni qabul qiladi. Qo'shni kartaga qarang — u yerda o'sha sonlar, lekin qavs dumaloq, va javob boshqa.",
      'В этом промежутке тройка стоит на границе, и её скобка КВАДРАТНАЯ — значит граница входит. Подставь саму тройку: три равно трём, а квадратная скобка равенство принимает. Посмотри на соседнюю карточку — там те же числа, но скобка круглая, и ответ другой.',
      'In this range the three sits on the boundary and its bracket is SQUARE — so the boundary is in. Substitute three itself: three equals three, and a square bracket accepts equality. Look at the neighbouring card — the same numbers there, but a round bracket, and a different answer.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har oraliqda ikki savol bering: uch chegaradami yoki ichkarida, va agar chegarada bo'lsa — qavs qanday. Ichkaridagi son har doim kiradi, chegaradagi son esa faqat kvadrat qavsda kiradi.",
      'В каждом промежутке задай два вопроса: тройка на границе или внутри, и если на границе — какая скобка. Число внутри входит всегда, а число на границе — только при квадратной скобке.',
      'Ask two questions of every range: is the three on the boundary or inside, and if on the boundary — which bracket. A number inside always belongs; a number on the boundary belongs only with a square bracket.') },
  ],
  wrongText: L(
    "Avval uch chegarada turganini yoki ichkarida ekanini aniqlang. Chegarada bo'lsa, qavsning turiga qarang: kvadrat kiritadi, dumaloq chiqarib tashlaydi.",
    'Сначала определи, стоит ли тройка на границе или внутри. Если на границе — смотри на тип скобки: квадратная включает, круглая исключает.',
    'First decide whether the three sits on the boundary or inside. If on the boundary, look at the bracket type: square includes, round excludes.'),
};

export default function D27_05(props) { return <Zones data={DATA} {...props} />; }
