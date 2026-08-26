// Dars24 · Amaliyot 07 — Guruhlar · 🟡 · tag: flip_or_not
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §6 (24-dars, 7-pozitsiya)
//
// T3 SHU YERDA TEKSHIRILADI: bo'lish ko'paytirishdan farq qilmaydi, ya'ni
// zonalarda ikkala amal ham aralash turadi. Hal qiluvchi narsa — sonning
// ISHORASI, amalning turi emas.
//
// Ikki karta ataylab kasrli: `×(−0,5)` va `:0,2`. Ular sonning KATTALIGI
// hech narsani hal qilmasligini ko'rsatadi — bitta kichik manfiy son ham
// ishorani buradi, katta musbat son esa yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'flip_or_not', level: '🟡',
  zoneSize: 14, itemSize: 15, zoneLbl: 120,
  zones: [
    { id: 'z1', label: L('ISHORA BURILADI', 'ЗНАК ПЕРЕВОРАЧИВАЕТСЯ', 'THE SIGN FLIPS') },
    { id: 'z2', label: L("ISHORA O'ZGARMAYDI", 'ЗНАК НЕ МЕНЯЕТСЯ', 'THE SIGN STAYS') },
  ],
  items: [
    { id: 'i1', tokens: ['×(−3)'], zone: 'z1' },
    { id: 'i2', tokens: ['×7'], zone: 'z2' },
    { id: 'i3', tokens: [':(−5)'], zone: 'z1' },
    { id: 'i4', tokens: [':4'], zone: 'z2' },
    { id: 'i5', tokens: ['×(−1)'], zone: 'z1' },
    { id: 'i6', tokens: ['×1'], zone: 'z2' },
    { id: 'i7', tokens: ['×(−0,5)'], zone: 'z1' },
    { id: 'i8', tokens: [':0,2'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Tengsizlikning ikkala qismi ustida sakkiz xil amal bajarilishi mumkin. Ularning bir qismida tengsizlik ishorasi buriladi, bir qismida esa o'zgarmaydi.",
    'Над обеими частями неравенства можно выполнить восемь разных действий. В одних знак неравенства переворачивается, в других остаётся прежним.',
    'Eight different operations can be applied to both sides of an inequality. In some of them the inequality sign flips, in others it stays.'),
  ask: L(
    'Amalni bosing, keyin guruhini bosing.',
    'Нажми действие, потом его группу.',
    'Tap an operation, then its group.'),
  bank: L('Amallar', 'Действия', 'Operations'),
  correctText: L(
    "To'g'ri. Hal qiluvchi narsa — sonning ISHORASI, amalning turi emas: bo'lish ko'paytirish bilan bir xil ish. Sonning kattaligi ham hech narsani hal qilmaydi — minus nol butun besh ham buradi.",
    'Верно. Решает ЗНАК числа, а не вид действия: деление — то же, что умножение. Величина числа тоже ничего не решает — минус ноль целых пять переворачивает так же.',
    'Correct. The SIGN of the number decides, not the kind of operation: dividing is the same work as multiplying. The size decides nothing either — minus zero point five flips it just as well.'),
  wrongs: [
    { when: (s) => s.place.i3 === 'z2', text: L(
      "Bu amal BO'LISH, lekin qoida bo'lishga ham tegishli. Minus beshga bo'lish — bu minus bir beshdanga ko'paytirish bilan bir xil ish, va u son manfiy. Tekshiring: to'rt ikkidan katta; ikkalasini minus beshga bo'lsangiz, minus nol butun sakkiz va minus nol butun to'rt chiqadi — birinchisi endi KICHIK.",
      'Это действие ДЕЛЕНИЕ, но правило относится и к делению. Деление на минус пять — то же самое, что умножение на минус одну пятую, а это число отрицательное. Проверь: четыре больше двух; раздели оба на минус пять — выйдет минус ноль целых восемь и минус ноль целых четыре, и первое теперь МЕНЬШЕ.',
      'This operation is DIVISION, but the rule covers division too. Dividing by minus five is the same work as multiplying by minus one fifth, and that number is negative. Check: four is greater than two; divide both by minus five and you get minus zero point eight and minus zero point four, and the first is now SMALLER.') },
    { when: (s) => s.place.i7 === 'z2', text: L(
      "Bu son kichik, lekin MANFIY — hal qiluvchi narsa aynan shu. Kattalik tengsizlikning ishorasiga ta'sir qilmaydi: minus nol butun besh ham, minus yuz ham bir xil ishlaydi. Tekshiring: olti to'rtdan katta; ikkalasini minus nol butun beshga ko'paytirsangiz, minus uch va minus ikki chiqadi — minus uch endi kichik.",
      'Это число маленькое, но ОТРИЦАТЕЛЬНОЕ — решает именно это. Величина на знак неравенства не влияет: и минус ноль целых пять, и минус сто работают одинаково. Проверь: шесть больше четырёх; умножь оба на минус ноль целых пять — выйдет минус три и минус два, и минус три теперь меньше.',
      'That number is small but NEGATIVE — and that is what decides. Size has no effect on the inequality sign: minus zero point five and minus one hundred work the same way. Check: six is greater than four; multiply both by minus zero point five and you get minus three and minus two, and minus three is now smaller.') },
    { when: (s) => s.place.i8 === 'z1', text: L(
      "Nol butun ikki — MUSBAT son, garchi u birdan kichik bo'lsa ham. Unga bo'lish natijani kattalashtiradi (bu aslida beshga ko'paytirish), lekin ishorani burmaydi. Burish faqat ishora manfiy bo'lganda bo'ladi.",
      'Ноль целых два — ПОЛОЖИТЕЛЬНОЕ число, хотя оно и меньше единицы. Деление на него результат увеличивает (это по сути умножение на пять), но знак не переворачивает. Переворот бывает только при отрицательном знаке.',
      'Zero point two is a POSITIVE number, even though it is less than one. Dividing by it makes the result larger (this is in fact multiplying by five), but it does not flip the sign. A flip happens only with a negative sign.') },
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1' || s.place.i6 === 'z1', text: L(
      "Bu amallarda son MUSBAT, ya'ni burish uchun sabab yo'q. Musbat songa ko'paytirish ikkala tomonni ham bir xil kattalashtiradi, tartib esa saqlanadi. Birga ko'paytirish eng sodda hol: har son o'zicha qoladi, demak tengsizlik ham o'zicha.",
      'В этих действиях число ПОЛОЖИТЕЛЬНО, значит переворачивать не из-за чего. Умножение на положительное увеличивает обе части одинаково, а порядок сохраняется. Умножение на единицу — простейший случай: каждое число остаётся собой, значит и неравенство прежнее.',
      'In these operations the number is POSITIVE, so there is no reason to flip. Multiplying by a positive enlarges both sides equally and keeps the order. Multiplying by one is the simplest case: every number stays itself, so the inequality stays as it was.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har karta bilan bitta savolni bering: bu son musbatmi yoki manfiy. Amalning ko'paytirish yoki bo'lish ekani ahamiyatsiz, sonning kattaligi ham. Faqat ishora hal qiladi.",
      'С каждой карточкой задай один вопрос: это число положительное или отрицательное. Умножение это или деление — неважно, величина числа — тоже. Решает только знак.',
      'Ask one question of every card: is this number positive or negative. Whether it is multiplication or division does not matter, nor does the size of the number. Only the sign decides.') },
  ],
  wrongText: L(
    "Faqat sonning ishorasiga qarang. Bo'lish ko'paytirishdan farq qilmaydi, va sonning kattaligi ham hech narsani hal qilmaydi.",
    'Смотри только на знак числа. Деление от умножения не отличается, и величина числа тоже ничего не решает.',
    'Look only at the sign of the number. Division does not differ from multiplication, and the size of the number decides nothing either.'),
};

export default function D24_07(props) { return <Zones data={DATA} {...props} />; }
