// Dars06 · Amaliyot 06 — Guruhlar · 🟡 · tag: transform_correct
//
// KETMA-KETLIK O'ZGARDI (metodist, 2026-08-24): bu topshiriq ilgari 10-o'rinda
// turgan, endi 6-o'rinda. Mexanikasi va matematikasi o'sha — 2-6 darslar
// 1-darsning o'nta mexanikasidan har xil tartibda foydalanadi
// (`DARS02_06_AMALIYOT_SKELET.md` §2).
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
//
// Sakkiz yozuv, to'rt-to'rt. Har xato darsning bitta adashishiga tegadi:
//   З15 — amallar tartibi buzildi:    1/b + 1/b · b = 2/b · b
//   З1  — had bo'yicha qisqartirildi: (b + 2)/b = 2  va  (b + 3)/(b + 5) = 3/5
//   З24 — maxrajlar qo'shildi:        1/b + 1/b = 2/(2b)
// To'g'rilari orasida songa bo'lish va qavsli ko'paytirish ham bor.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'transform_correct', level: '🟡',
  zoneLbl: 86, itemSize: 13,
  zones: [
    { id: 'yes', label: L("TO'G'RI", 'ВЕРНО', 'CORRECT') },
    { id: 'no', label: L("NOTO'G'RI", 'НЕВЕРНО', 'WRONG') },
  ],
  items: [
    { id: 'i1', tokens: [{ n: '1', d: 'b' }, '+', { n: '1', d: 'b' }, '=', { n: '2', d: 'b' }], zone: 'yes' },
    { id: 'i2', tokens: [{ n: '1', d: 'b' }, ':', '2', '=', { n: '1', d: '2b' }], zone: 'yes' },
    { id: 'i3', tokens: ['(', { n: '1', d: 'b' }, '+', { n: '1', d: 'b' }, ')', '·', 'b', '=', '2'], zone: 'yes' },
    { id: 'i4', tokens: [{ n: 'b + 2', d: 'b + 2' }, '=', '1'], zone: 'yes' },
    { id: 'i5', tokens: [{ n: '1', d: 'b' }, '+', { n: '1', d: 'b' }, '·', 'b', '=', '2'], zone: 'no' },
    { id: 'i6', tokens: [{ n: '1', d: 'b' }, '+', { n: '1', d: 'b' }, '=', { n: '2', d: '2b' }], zone: 'no' },
    { id: 'i7', tokens: [{ n: 'b + 2', d: 'b' }, '=', '2'], zone: 'no' },
    { id: 'i8', tokens: [{ n: 'b + 3', d: 'b + 5' }, '=', { n: '3', d: '5' }], zone: 'no' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkizta yozuv. To'rttasi to'g'ri almashtirish, to'rttasida esa xato bor.",
    'Восемь записей. Четыре — верные преобразования, в четырёх есть ошибка.',
    'Eight records. Four are correct transformations, four contain an error.'),
  ask: L(
    "Kartani bosing, keyin zonani bosing. Sakkizala yozuv ham joyini topishi kerak.",
    'Нажми карточку, потом зону. Все восемь записей обязаны найти место.',
    'Tap a card, then a zone. All eight records must find a place.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Uch xil xato bor edi. Birinchisi — tartib: qavs bo'lmasa ko'paytirish qo'shishdan oldin bajariladi. Ikkinchisi — maxrajlar qo'shildi. Uchinchisi — QO'SHILUVCHI qisqartirildi: b qo'shuv ikkidagi b ni maxrajdagi b bilan qisqartirib bo'lmaydi, chunki u ko'paytuvchi emas.",
    'Верно. Ошибок было три вида. Первая — порядок: без скобок умножение выполняется раньше сложения. Вторая — сложили знаменатели. Третья — сократили СЛАГАЕМОЕ: b в b плюс два нельзя сократить с b в знаменателе, потому что это не множитель.',
    'Correct. There were three kinds of error. First, the order: without brackets multiplication comes before addition. Second, the denominators were added. Third, a SUMMAND was cancelled: the b in b plus two cannot cancel with the b below, because it is not a factor.'),
  wrongs: [
    { when: (s) => s.place.i5 === 'yes', text: L(
      "Qavs yo'q, demak avval KO'PAYTIRISH: bir bo'lingan b karra b bu bir. Keyin bir bo'lingan b qo'shuv bir. Ikkilik faqat qavs bo'lganda chiqardi.",
      'Скобок нет, значит сначала УМНОЖЕНИЕ: один делить на b на b — единица. Потом один делить на b плюс один. Двойка вышла бы только со скобкой.',
      'No brackets, so MULTIPLICATION first: one over b times b is one. Then one over b plus one. A two would come out only with a bracket.') },
    { when: (s) => s.place.i6 === 'yes', text: L(
      "Maxrajlar qo'shilmaydi: ular bir xil, ya'ni umumiy. B ni birga teng qo'ying: bir qo'shuv bir bu ikki, bir emas.",
      'Знаменатели не складывают: они одинаковые, то есть общие. Подставь b равное одному: один плюс один — два, а не единица.',
      'Denominators do not add: they are equal, so they are shared. Put b equal to one: one plus one is two, not one.') },
    { when: (s) => s.place.i7 === 'yes' || s.place.i8 === 'yes', text: L(
      "Bu qo'shiluvchini qisqartirish. Qisqartirish faqat KO'PAYTUVCHI bo'yicha bo'ladi. B ni birga teng qo'ying: uch bo'lingan bir bu uch, ikki emas.",
      'Это сокращение слагаемого. Сокращают только по МНОЖИТЕЛЮ. Подставь b равное одному: три делить на один — три, а не два.',
      'That is cancelling a summand. Cancelling works only by a FACTOR. Put b equal to one: three over one is three, not two.') },
    { when: (s) => s.place.i4 === 'no', text: L(
      "Bu to'g'ri: b qo'shuv ikki BUTUNLAY ikkala qavatda ham turibdi, ya'ni u ko'paytuvchi. Butun ifoda o'ziga bo'linsa bir chiqadi.",
      'Это верно: b плюс два стоит ЦЕЛИКОМ на обоих этажах, значит это множитель. Выражение, делённое само на себя, даёт единицу.',
      'This is right: b plus two stands ENTIRE on both floors, so it is a factor. An expression divided by itself gives one.') },
    { when: (s) => s.place.i2 === 'no', text: L(
      "Bu to'g'ri: songa bo'lish maxrajni kattalashtiradi. Bir bo'lingan b ni ikkiga bo'lsak, bir bo'lingan ikki b chiqadi.",
      'Это верно: деление на число увеличивает знаменатель. Один делить на b, делённое на два, даёт один делить на два b.',
      'This is right: dividing by a number grows the denominator. One over b divided by two gives one over two b.') },
    { when: (s) => s.place.i3 === 'no', text: L(
      "Bu to'g'ri: qavs ichi ikki bo'lingan b, unga b ko'paytirilsa ikkilik qoladi.",
      'Это верно: в скобке два делить на b, при умножении на b остаётся двойка.',
      'This is right: the bracket gives two over b, and multiplying by b leaves a two.') },
  ],
  wrongText: L(
    "Har yozuvda ikki savol bering: amallar tartibi to'g'rimi, va qisqartirilgani KO'PAYTUVCHIMI? Shubha bo'lsa, b ni birga teng qo'ying.",
    'К каждой записи два вопроса: верен ли порядок действий и МНОЖИТЕЛЬ ли то, что сократили? Если сомневаешься, подставь b равное одному.',
    'Ask two questions of each record: is the order of operations right, and was what got cancelled a FACTOR? If in doubt, put b equal to one.'),
};

export default function D06_06(props) { return <Zones data={DATA} {...props} />; }
