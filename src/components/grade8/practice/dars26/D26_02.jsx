// Dars26 · Amaliyot 02 — Guruhlar · 🟢 · tag: in_or_out
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §8 (26-dars, 2-pozitsiya)
//
// 01-TOPSHIRIQDAN FARQI — BITTA CHIZIQ. U yerda tengsizliklar qat'iy edi
// va chegaralar chetda qolgan; bu yerda belgilar ostida chiziq bor, ya'ni
// minus ikki ham, uch ham YECHIM (З54).
//
// Ikki topshiriq ketma-ket turgani shuning uchun: qoida «chegara kirmaydi»
// emas, «belgiga qarab kiradi yoki kirmaydi».
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'in_or_out', level: '🟢',
  zoneSize: 14, itemSize: 16, zoneLbl: 112,
  given: [['x ≥ −2,   x ≤ 3']],
  givenLabel: L('Sistema', 'Система', 'The system'),
  zones: [
    { id: 'z1', label: L('YECHIM', 'РЕШЕНИЕ', 'A SOLUTION') },
    { id: 'z2', label: L('YECHIM EMAS', 'НЕ РЕШЕНИЕ', 'NOT A SOLUTION') },
  ],
  items: [
    { id: 'i1', tokens: ['−2'], zone: 'z1' },
    { id: 'i2', tokens: ['−3'], zone: 'z2' },
    { id: 'i3', tokens: ['0'], zone: 'z1' },
    { id: 'i4', tokens: ['4'], zone: 'z2' },
    { id: 'i5', tokens: ['3'], zone: 'z1' },
    { id: 'i6', tokens: ['−2,5'], zone: 'z2' },
    { id: 'i7', tokens: ['2,5'], zone: 'z1' },
    { id: 'i8', tokens: ['10'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sistemaning ikkala belgisi ostida ham chiziq bor: x minus ikkidan katta yoki TENG, va uchdan kichik yoki TENG. Sakkiz sonni shu shart bilan tekshirish kerak.",
    'Под обоими знаками системы есть черта: x больше минус двух или РАВЕН ему, и меньше трёх или РАВЕН. Восемь чисел надо проверить по этому условию.',
    'Both signs of the system carry a line: x is greater than minus two or EQUAL to it, and less than three or EQUAL to it. Eight numbers must be tested against this.'),
  ask: L(
    'Sonni bosing, keyin guruhini bosing.',
    'Нажми число, потом его группу.',
    'Tap a number, then its group.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Chegaralarning o'zi ham kiradi: belgilar ostida chiziq bor. 01-topshiriqda esa chiziq yo'q edi va chegaralar chiqib ketgan.",
    'Верно. Сами границы тоже входят: под знаками есть черта. А в задании 01 черты не было, и границы выпадали.',
    'Correct. The boundaries themselves are included: the signs carry a line. In task 01 there was no line and the boundaries fell out.'),
  wrongs: [
    { when: (s) => s.place.i1 === 'z2' || s.place.i5 === 'z2', text: L(
      "Bu son — CHEGARA, va bu sistemada chegara YECHIM bo'ladi. Belgi ostidagi chiziqqa qarang: «katta yoki teng», «kichik yoki teng». Minus ikki minus ikkiga teng, ya'ni birinchi shart bajarildi; va minus ikki uchdan kichik, ya'ni ikkinchisi ham. Ikkala shart ham bajarildi — demak yechim.",
      'Это число — ГРАНИЦА, и в этой системе граница ЯВЛЯЕТСЯ решением. Посмотри на черту под знаком: «больше или равно», «меньше или равно». Минус два равно минус двум, значит первое условие выполнено; и минус два меньше трёх, значит второе тоже. Оба условия выполнены — значит решение.',
      'That number is a BOUNDARY, and in this system a boundary IS a solution. Look at the line under the sign: «greater than or equal», «less than or equal». Minus two equals minus two, so the first condition holds; and minus two is less than three, so the second holds too. Both hold — hence a solution.') },
    { when: (s) => s.place.i6 === 'z1', text: L(
      "Minus ikki butun besh minus ikkidan KICHIK, ya'ni birinchi shart buzildi. Manfiy sonlarda ko'rinish aldaydi: ikki butun besh ikkidan katta, lekin MINUS ikki butun besh minus ikkidan kichik — son o'qida u chaproqda turadi. Ikkinchi shart bajarilgan bo'lsa ham, bittasi buzilgani yetarli.",
      'Минус два целых пять МЕНЬШЕ минус двух, значит первое условие нарушено. У отрицательных чисел вид обманывает: два целых пять больше двух, но МИНУС два целых пять меньше минус двух — на числовой прямой оно левее. Пусть второе условие и выполнено, нарушения одного достаточно.',
      'Minus two point five is LESS than minus two, so the first condition fails. With negative numbers appearances deceive: two point five is greater than two, but MINUS two point five is less than minus two — on the number line it lies further left. Even though the second condition holds, one failure is enough.') },
    { when: (s) => s.place.i4 === 'z1' || s.place.i8 === 'z1', text: L(
      "Bu son uchdan KATTA, ya'ni ikkinchi shart buzildi. Birinchi shart bajarilgan — to'rt ham, o'n ham minus ikkidan katta — lekin sistemada ikkala shart ham talab qilinadi. Bitta shartning bajarilishi yechim bermaydi.",
      'Это число БОЛЬШЕ трёх, значит второе условие нарушено. Первое выполнено — и четыре, и десять больше минус двух — но в системе требуются оба. Выполнение одного условия решения не даёт.',
      'That number is GREATER than three, so the second condition fails. The first holds — both four and ten are greater than minus two — but a system demands both. Satisfying one condition does not make a solution.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har sonni ikki marta tekshiring: minus ikki bilan solishtiring, keyin uch bilan. Chegaralarning o'ziga alohida qarang — bu sistemada ular kiradi, chunki belgilar ostida chiziq bor.",
      'Проверяй каждое число дважды: сравни с минус двумя, потом с тройкой. На сами границы посмотри отдельно — в этой системе они входят, ведь под знаками есть черта.',
      'Test every number twice: compare it with minus two, then with three. Look at the boundaries separately — in this system they are included, since the signs carry a line.') },
  ],
  wrongText: L(
    "Har sonni ikkala shart bilan ham solishtiring. Belgilar ostidagi chiziq chegaralarni yechimga kiritadi. Manfiy sonlarda son o'qiga qarang.",
    'Сверяй каждое число с обоими условиями. Черта под знаками включает границы в решение. У отрицательных чисел смотри на числовую прямую.',
    'Compare every number with both conditions. The line under the signs includes the boundaries in the solution. For negative numbers, look at the number line.'),
};

export default function D26_02(props) { return <Zones data={DATA} {...props} />; }
