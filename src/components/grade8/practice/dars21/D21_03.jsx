// Dars21 · Amaliyot 03 — Guruhlar · 🟢 · tag: accept_or_reject
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §3 (21-dars, 3-pozitsiya)
//
// З47 SOF HOLDA: tenglamaning ildizi bo'lish yetarli emas, javob masalaning
// kattaligiga mos kelishi kerak. Kartalar juft-juft, faqat ishora farq
// qiladi — ya'ni tanlovni SON emas, MA'NO hal qiladi.
//
// Ikki alohida karta:
//   0    — ishorasi yo'q, lekin uzunligi nol bo'lgan tomon ham yo'q;
//   2,5  — butun emas, LEKIN uzunlik butun bo'lishi shart emas: bu karta
//          «chiroyli emas — demak noto'g'ri» degan qarashni rad etadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'accept_or_reject', level: '🟢',
  zoneSize: 15, itemSize: 15, zoneLbl: 112,
  zones: [
    { id: 'z1', label: L('JAVOBGA KIRADI', 'ВХОДИТ В ОТВЕТ', 'ENTERS THE ANSWER') },
    { id: 'z2', label: L('RAD ETILADI', 'ОТБРАСЫВАЕТСЯ', 'REJECTED') },
  ],
  items: [
    { id: 'i1', tokens: ['6'], zone: 'z1' },
    { id: 'i2', tokens: ['−6'], zone: 'z2' },
    { id: 'i3', tokens: ['1'], zone: 'z1' },
    { id: 'i4', tokens: ['−1'], zone: 'z2' },
    { id: 'i5', tokens: ['9'], zone: 'z1' },
    { id: 'i6', tokens: ['0'], zone: 'z2' },
    { id: 'i7', tokens: ['2,5'], zone: 'z1' },
    { id: 'i8', tokens: ['−2,5'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Masalada a harfi tomon uzunligini bildiradi. Sakkiz son tenglamaning ildizi bo'lib chiqdi. Har birini masala sharti bilan solishtirish kerak.",
    'В задаче буква a означает длину стороны. Восемь чисел оказались корнями уравнения. Каждое надо сверить с условием задачи.',
    'In the problem the letter a stands for the length of a side. Eight numbers turned out to be roots of the equation. Each must be compared with the condition.'),
  ask: L(
    'Sonni bosing, keyin guruhini bosing.',
    'Нажми число, потом его группу.',
    'Tap a number, then its group.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Tomon uzunligi musbat bo'lishi kerak: to'rt manfiy son ham, nol ham rad etiladi — uzunligi nolga teng tomon yo'q. Ikki butun besh esa qoladi: uzunlik butun bo'lishi shart emas.",
    'Верно. Длина стороны должна быть положительной: отбрасываются и четыре отрицательных числа, и нуль — стороны длиной нуль не бывает. А два и пять десятых остаётся: длина не обязана быть целой.',
    'Correct. A side length must be positive: the four negative numbers and zero are all rejected — a side of length zero does not exist. But two point five stays: a length need not be whole.'),
  wrongs: [
    { when: (s) => s.place.i6 === 'z1', text: L(
      "Nol boshqa manfiy sonlardan farq qiladi, lekin u ham javob bo'lolmaydi. Tomonning uzunligi nolga teng bo'lsa, tomonning o'zi yo'q: shakl nuqtaga aylanadi va yuzasi ham nol bo'ladi. Masala esa yuzasi noldan katta bo'lgan to'rtburchak haqida.",
      'Нуль отличается от отрицательных чисел, но ответом тоже быть не может. Если длина стороны равна нулю, то и самой стороны нет: фигура вырождается, и площадь тоже нуль. А задача про прямоугольник с площадью больше нуля.',
      'Zero differs from the negative numbers, yet it cannot be the answer either. If a side has length zero, there is no side at all: the figure collapses and the area is zero too. But the problem is about a rectangle whose area is greater than zero.') },
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1' || s.place.i8 === 'z1', text: L(
      "Manfiy son tenglamaning ildizi bo'lishi mumkin, lekin uzunlik bo'lolmaydi. Chizg'ichda manfiy bo'linma yo'q: minus olti santimetrli tomonni chizib bo'lmaydi. Shuning uchun bunday ildiz masala shartiga zid va javobga kiritilmaydi.",
      'Отрицательное число может быть корнем уравнения, но длиной быть не может. На линейке нет отрицательных делений: сторону в минус шесть сантиметров не начертить. Поэтому такой корень противоречит условию задачи и в ответ не включается.',
      'A negative number can be a root of an equation, but it cannot be a length. A ruler has no negative marks: a side of minus six centimetres cannot be drawn. So such a root contradicts the condition and is not included in the answer.') },
    { when: (s) => s.place.i7 === 'z2', text: L(
      "Bu son butun emas, lekin bu rad etishga sabab emas. Uzunlik butun son bo'lishi shart emas: ikki butun besh santimetr — bu ikki santimetr yarim, chizg'ichda bemalol ko'rsatiladi. Rad etish faqat MA'NO bo'yicha bo'ladi: manfiy uzunlik yo'q, nol uzunlik yo'q, qolgani esa bo'ladi.",
      'Это число не целое, но отбрасывать его не за что. Длина не обязана быть целой: два и пять десятых сантиметра это два с половиной сантиметра, на линейке они прекрасно показываются. Отбрасывают только по СМЫСЛУ: отрицательной длины нет, нулевой нет, а остальное бывает.',
      'That number is not a whole number, but that is no reason to reject it. A length need not be whole: two point five centimetres is two and a half centimetres, easy to show on a ruler. Rejection happens only by MEANING: no negative length, no zero length, everything else is possible.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har son bilan bitta savolni bering: shunday uzunlikdagi tomonni chizib bo'ladimi. Manfiy sonda ham, nolda ham javob yo'q, qolganlarida esa ha. Sonning butun yoki kasr ekani bu savolga aloqasiz.",
      'С каждым числом задай один вопрос: можно ли начертить сторону такой длины. У отрицательного и у нуля ответа нет, у остальных есть. А целое число или дробное — к этому вопросу отношения не имеет.',
      'Ask one question of every number: can a side of that length be drawn. For a negative number and for zero there is no answer; for the rest there is. Whether the number is whole or fractional has nothing to do with it.') },
  ],
  wrongText: L(
    "Tomon uzunligi musbat bo'lishi kerak: manfiy sonlar ham, nol ham rad etiladi. Kasr son esa rad etilmaydi — uzunlik butun bo'lishi shart emas.",
    'Длина стороны должна быть положительной: отбрасываются и отрицательные числа, и нуль. А дробное число не отбрасывается — длина не обязана быть целой.',
    'A side length must be positive: both the negative numbers and zero are rejected. A fractional number is not — a length need not be whole.'),
};

export default function D21_03(props) { return <Zones data={DATA} {...props} />; }
