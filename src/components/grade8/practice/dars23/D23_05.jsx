// Dars23 · Amaliyot 05 — Teskari ayirma · 🟡 · tag: reverse_difference
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §5 (23-dars, 5-pozitsiya)
//
// З49 NING ENG QISQA TEKSHIRUVI. Sonlarning o'zi berilmagan va kerak ham
// emas: ayirmani almashtirish natijani QARAMA-QARSHI songa aylantiradi.
//
// Uch xato yo'l: o'n ikki (tartib e'tiborga olinmadi — З49 aynan shu),
// nol (ayirmalar bir-birini yo'qotadi degan qarash), yigirma to'rt
// (ikki ayirma qo'shildi).
// `allowNeg` — javob manfiy, ya'ni maydon minusni qabul qilishi shart.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'reverse_difference', level: '🟡',
  target: -12, allowNeg: true,
  expr: ['a − b = 12'], exprSize: 28,
  eyebrow: L('Teskari ayirma', 'Обратная разность', 'The reversed difference'),
  setup: L(
    "a va b sonlarining ayirmasi berilgan. Sonlarning o'zi noma'lum, lekin teskari ayirmani topish mumkin.",
    'Дана разность чисел a и b. Сами числа неизвестны, но обратную разность найти можно.',
    'The difference of the numbers a and b is given. The numbers themselves are unknown, but the reversed difference can be found.'),
  label: L("b − a ning qiymati", 'значение b − a', 'the value of b − a'),
  ask: L('b − a nimaga teng?', 'Чему равно b − a?', 'What does b − a equal?'),
  correctText: L(
    "To'g'ri. a dan b ni ayirganda o'n ikki ortiqcha qolgan bo'lsa, teskarisida ayni o'sha o'n ikki YETISHMAYDI: b − a minus o'n ikkiga teng. Sonlarni bilish shart emas, lekin tekshirib ko'rish mumkin: a yigirma, b sakkiz bo'lsin — yigirma minus sakkiz o'n ikki, sakkiz minus yigirma esa minus o'n ikki. Boshqa sonlarda ham xuddi shunday. Bu yerdan darsning qoidasi ham ko'rinadi: a b dan katta, chunki a − b musbat.",
    'Верно. Если при вычитании b из a остаётся двенадцать лишних, то в обратном порядке этих же двенадцати НЕ ХВАТАЕТ: b − a равно минус двенадцати. Знать числа не обязательно, но проверить можно: пусть a двадцать, b восемь — двадцать минус восемь двенадцать, а восемь минус двадцать минус двенадцать. С другими числами так же. Отсюда видно и правило урока: a больше b, ведь a − b положительна.',
    'Correct. If subtracting b from a leaves twelve to spare, then in the reversed order those same twelve are MISSING: b − a equals minus twelve. Knowing the numbers is not required, but you can check: let a be twenty and b eight — twenty minus eight is twelve, and eight minus twenty is minus twelve. The same holds for any other numbers. From this the rule of the lesson is also visible: a is greater than b, since a − b is positive.'),
  wrongs: [
    { when: (s) => s.value === 12, text: L(
      "Ayirmada TARTIB muhim. a − b va b − a bir xil emas: birinchisi o'n ikki bo'lsa, ikkinchisi minus o'n ikki. Sonlarda tekshiring: yigirma minus sakkiz o'n ikki, sakkiz minus yigirma minus o'n ikki. Aynan shu farq taqqoslashda ham ishlaydi — ayirmani teskari olsangiz, xulosa ham teskari chiqadi.",
      'В разности важен ПОРЯДОК. a − b и b − a это не одно и то же: если первая двенадцать, то вторая минус двенадцать. Проверь числами: двадцать минус восемь двенадцать, восемь минус двадцать минус двенадцать. Ровно эта разница работает и в сравнении — возьмёшь разность наоборот, и вывод выйдет обратным.',
      'ORDER matters in a difference. a − b and b − a are not the same: if the first is twelve, the second is minus twelve. Check with numbers: twenty minus eight is twelve, eight minus twenty is minus twelve. Exactly this difference works in comparison too — take the difference the other way round and the conclusion reverses.') },
    { when: (s) => s.value === 0, text: L(
      "Nol chiqishi uchun a bilan b teng bo'lishi kerak edi, o'shanda ayirma ham nol bo'lardi. Bu yerda esa ayirma o'n ikki, ya'ni sonlar teng emas: a b dan o'n ikki birlikka katta. Demak teskari ayirma ham noldan farqli.",
      'Нуль вышел бы, если бы a и b были равны — тогда и разность была бы нулём. А здесь разность двенадцать, то есть числа не равны: a больше b на двенадцать единиц. Значит и обратная разность не нуль.',
      'Zero would come out if a and b were equal — then the difference would be zero as well. But here the difference is twelve, so the numbers are not equal: a exceeds b by twelve units. Hence the reversed difference is non-zero too.') },
    { when: (s) => s.value === 24 || s.value === -24, text: L(
      "Bu son ikki ayirmani qo'shishdan chiqadi, savol esa faqat bittasini so'rayapti. b − a bu a − b ning qarama-qarshi soni, ya'ni moduli o'sha, ishorasi boshqa. Sonlarda tekshiring: yigirma va sakkiz — sakkiz minus yigirma minus o'n ikki.",
      'Это число выходит из сложения двух разностей, а спрашивают только одну. b − a это число, противоположное a − b: модуль тот же, знак другой. Проверь числами: двадцать и восемь — восемь минус двадцать минус двенадцать.',
      'That number comes from adding the two differences, while only one is asked for. b − a is the opposite of a − b: the same magnitude, the other sign. Check with numbers: twenty and eight — eight minus twenty is minus twelve.') },
  ],
  wrongText: L(
    "Ayirmani teskari olsangiz, natija qarama-qarshi songa aylanadi. Sonlar bilan tekshiring: masalan a yigirma, b sakkiz.",
    'Возьмёшь разность наоборот — результат станет противоположным числом. Проверь числами: например a двадцать, b восемь.',
    'Reverse the difference and the result becomes the opposite number. Check with numbers: for instance a is twenty and b is eight.'),
};

export default function D23_05(props) { return <TypeValue data={DATA} {...props} />; }
