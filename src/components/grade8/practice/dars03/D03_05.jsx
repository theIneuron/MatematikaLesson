// Dars03 · Amaliyot 05 — Guruhlar · 🟡 · tag: does_it_cancel
//
// KETMA-KETLIK O'ZGARDI (metodist, 2026-08-24): bu topshiriq ilgari 9-o'rinda
// turgan, endi 5-o'rinda. Mexanikasi va matematikasi o'sha — 2-6 darslar
// 1-darsning o'nta mexanikasidan har xil tartibda foydalanadi
// (`DARS02_06_AMALIYOT_SKELET.md` §2).
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
//
// Sakkiz yozuv, to'rt-to'rt. Hech birida ko'paytuvchi TAYYOR turmaydi:
// har birini ajratib ko'rish kerak, ya'ni ko'z bilan taxmin qilib bo'lmaydi.
//   QISQARADI:    (q²−1)/(q+1)  ·  (3q+6)/(q+2)  ·  (q²+2q)/(q+2)  ·  (q²−4q+4)/(q−2)
//   QISQARMAYDI:  (q+1)/(q+2)   ·  (q²+1)/(q+1)  ·  5q/(5+q)       ·  (q²+3)/(q+3)
// Ikki eng qimmat tuzoq:
//   q²+1 va q²+3 — kvadratlar YIG'INDISI ko'paytuvchilarga ajralmaydi (З15);
//   5q/(5+q)     — tepada 5 ko'paytuvchi, pastda 5 QO'SHILUVCHI (З1).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'does_it_cancel', level: '🟡',
  zoneLbl: 100, itemSize: 15,
  zones: [
    { id: 'yes', label: L('QISQARADI', 'СОКРАЩАЕТСЯ', 'CANCELS') },
    { id: 'no', label: L('QISQARMAYDI', 'НЕ СОКРАЩАЕТСЯ', 'DOES NOT') },
  ],
  items: [
    { id: 'i1', tokens: [{ n: 'q² − 1', d: 'q + 1' }], zone: 'yes' },
    { id: 'i2', tokens: [{ n: '3q + 6', d: 'q + 2' }], zone: 'yes' },
    { id: 'i3', tokens: [{ n: 'q² + 2q', d: 'q + 2' }], zone: 'yes' },
    { id: 'i4', tokens: [{ n: 'q² − 4q + 4', d: 'q − 2' }], zone: 'yes' },
    { id: 'i5', tokens: [{ n: 'q + 1', d: 'q + 2' }], zone: 'no' },
    { id: 'i6', tokens: [{ n: 'q² + 1', d: 'q + 1' }], zone: 'no' },
    { id: 'i7', tokens: [{ n: '5q', d: '5 + q' }], zone: 'no' },
    { id: 'i8', tokens: [{ n: 'q² + 3', d: 'q + 3' }], zone: 'no' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkizta kasr. Ularning hech birida ko'paytuvchi tayyor turmaydi — har birini ajratib ko'rish kerak.",
    'Восемь дробей. Ни в одной множитель не стоит готовым — каждую надо попробовать разложить.',
    'Eight fractions. In none of them is the factor ready — each one has to be factored first.'),
  ask: L(
    "Kartani bosing, keyin zonani bosing. Sakkizala kasr ham joyini topishi kerak.",
    'Нажми карточку, потом зону. Все восемь дробей обязаны найти место.',
    'Tap a card, then a zone. All eight fractions must find a place.'),
  bank: L('Kasrlar', 'Дроби', 'Fractions'),
  correctText: L(
    "To'g'ri. Qisqaradiganlarida ko'paytuvchini ajratib olish mumkin: kvadratlar ayirmasi, umumiy ko'paytuvchi yoki to'liq kvadrat. Qisqarmaydiganlarida esa yo'q — kvadratlar YIG'INDISI ko'paytuvchilarga ajralmaydi, va qo'shiluvchi hech qachon qisqarmaydi.",
    'Верно. У сокращаемых множитель удаётся выделить: разность квадратов, общий множитель или полный квадрат. У остальных нет — СУММА квадратов на множители не раскладывается, а слагаемое не сокращается никогда.',
    'Correct. In the ones that cancel a factor can be taken out: a difference of squares, a common factor or a perfect square. In the others it cannot — a SUM of squares does not factor, and a summand never cancels.'),
  wrongs: [
    { when: (s) => s.place.i6 === 'yes' || s.place.i8 === 'yes', text: L(
      "Kvadratlar YIG'INDISI ko'paytuvchilarga ajralmaydi. Kvadratlar AYIRMASI ajraladi, yig'indisi esa yo'q: q ni birga teng qo'ying va ikkala tomonni hisoblang.",
      'СУММА квадратов на множители не раскладывается. Раскладывается РАЗНОСТЬ квадратов, а сумма нет: подставь q равное одному и посчитай обе стороны.',
      'A SUM of squares does not factor. A DIFFERENCE of squares does, a sum does not: put q equal to one and compute both sides.') },
    { when: (s) => s.place.i7 === 'yes', text: L(
      "Tepada beshlik ko'paytuvchi, pastda esa QO'SHILUVCHI: besh qo'shuv q. Ular bir xil ko'rinadi, lekin qisqarmaydi — q ni birga teng qo'ying: besh bo'lingan olti, bu q ga teng emas.",
      'Сверху пятёрка — множитель, снизу — СЛАГАЕМОЕ: пять плюс q. Выглядят одинаково, но не сокращаются: подставь q равное одному — пять шестых, а не q.',
      'Above, the five is a factor; below it is a SUMMAND: five plus q. They look alike but do not cancel: put q equal to one — five sixths, not q.') },
    { when: (s) => s.place.i5 === 'yes', text: L(
      "Q qo'shuv bir va q qo'shuv ikki — ikki xil qavs, va ular baribir qo'shiluvchidan iborat. Bu yerda umumiy ko'paytuvchi yo'q.",
      'Q плюс один и q плюс два — разные скобки, и состоят они всё равно из слагаемых. Общего множителя здесь нет.',
      'Q plus one and q plus two are different brackets, and they are made of summands anyway. There is no common factor here.') },
    { when: (s) => s.place.i4 === 'no', text: L(
      "Q kvadrat minus to'rt q qo'shuv to'rt — bu to'liq kvadrat: q minus ikkining kvadrati. Demak q minus ikki ikki marta ko'paytuvchi bo'lib turibdi va bittasi qisqaradi.",
      'Q в квадрате минус четыре q плюс четыре — это полный квадрат: q минус два в квадрате. Значит q минус два стоит множителем дважды, и одно сокращается.',
      'Q squared minus four q plus four is a perfect square: q minus two squared. So q minus two stands as a factor twice, and one of them cancels.') },
    { when: (s) => s.place.i1 === 'no' || s.place.i3 === 'no', text: L(
      "Bu yerda ajratish bir qadamda bo'ladi: q kvadrat minus bir — kvadratlar ayirmasi, q kvadrat qo'shuv ikki q — q ni qavsdan chiqarish.",
      'Здесь разложение в один шаг: q в квадрате минус один — разность квадратов, q в квадрате плюс два q — вынесение q.',
      'Here factoring takes one step: q squared minus one is a difference of squares, q squared plus two q is taking out q.') },
    { when: (s) => s.place.i2 === 'no', text: L(
      "Uch q qo'shuv olti — bu uchni qavsdan chiqargani: uch karra q qo'shuv ikki. Pastda ham o'sha qavs turibdi.",
      'Три q плюс шесть — это вынесенная тройка: три на q плюс два. Внизу стоит та же скобка.',
      'Three q plus six is a three taken out: three times q plus two. The same bracket stands below.') },
  ],
  wrongText: L(
    "Har kasrda bitta savol bering: yuqorini va pastni ko'paytmaga aylantira olamanmi? Aylansa — bir xil qavs bormi. Kvadratlar yig'indisi va oddiy qo'shiluvchi aylanmaydi.",
    'К каждой дроби один вопрос: могу ли я превратить верх и низ в произведение? Если да — есть ли одинаковая скобка. Сумма квадратов и обычное слагаемое не превращаются.',
    'Ask one question of each fraction: can I turn top and bottom into a product? If yes — is there an identical bracket. A sum of squares and a plain summand cannot.'),
};

export default function D03_05(props) { return <Zones data={DATA} {...props} />; }
