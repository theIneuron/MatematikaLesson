// Dars16 · Amaliyot 08 — Tartib · 🔴 · teg: kesishma-emas-birlashma-deb-oylash
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> OrderLines.
//
// MATEMATIKA: x² − 25 < 0 -> −5 < x < 5; 3x ≥ 6 -> x ≥ 2.
// Umumiy qism: 2 ≤ x < 5. Chap chegara ikkinchi tengsizlikdan (yopiq),
// o'ng chegara birinchisidan (ochiq).
//
// Zanjirning muhim joyi: har bir tengsizlik ALOHIDA yechiladi, va faqat
// undan keyin umumiy qism olinadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, OrderLines } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'kesishma-emas-birlashma-deb-oylash', level: '🔴',
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Tengsizliklar sistemasini yechishning beshta qadami aralashtirilgan.",
    'Пять шагов решения системы неравенств перемешаны.',
    'Five steps of solving a system of inequalities are shuffled.'),
  ask: L('Qadamlarni to\'g\'ri tartibga soling.', 'Расставь шаги по порядку.', 'Put the steps in the right order.'),
  empty: L('Kartochkalarni tartib bilan bosing', 'Нажимай карточки по порядку', 'Tap the cards in order'),
  itemSize: 14,
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['x² − 25 < 0'], ['3x ≥ 6']],
  lines: [
    { id: 'c1', label: L(
      "Har bir tengsizlikni ALOHIDA yechamiz",
      'Решаем каждое неравенство ОТДЕЛЬНО',
      'Solve each inequality SEPARATELY') },
    { id: 'c2', label: L(
      'Birinchisi:',
      'Первое:',
      'The first:'), tokens: ['−5 < x < 5'] },
    { id: 'c3', label: L(
      'Ikkinchisi:',
      'Второе:',
      'The second:'), tokens: ['x ≥ 2'] },
    { id: 'c4', label: L(
      "Ikkala yechimni bitta o'qqa qo'yib, umumiy qismini olamiz",
      'Наносим оба решения на одну ось и берём общую часть',
      'Put both solutions on one axis and take the common part') },
    { id: 'c5', label: L('Javob:', 'Ответ:', 'Answer:'), tokens: ['2 ≤ x < 5'] },
  ],
  answer: ['c1', 'c2', 'c3', 'c4', 'c5'],
  correctText: L(
    "To'g'ri. Sistemaning yechimi bir yo'la topilmaydi: avval har bir tengsizlik alohida yechiladi, keyin ikkala javob bitta o'qqa qo'yiladi va ustma-ust tushgan qism olinadi. Javobdagi chegaralar ikki xil turda, va bu tasodif emas: ikki ikkinchi tengsizlikdan keldi, u qat'iy emas, shuning uchun kiradi; besh birinchisidan keldi, u qat'iy, shuning uchun kirmaydi.",
    'Верно. Решение системы не находится сразу: сначала каждое неравенство решают отдельно, потом оба ответа наносят на одну ось и берут наложившуюся часть. Границы в ответе разного типа, и это не случайность: двойка пришла из второго неравенства, оно нестрогое, поэтому входит; пятёрка — из первого, оно строгое, поэтому не входит.',
    'Correct. The solution of a system is not found in one go: each inequality is solved separately first, then both answers go on one axis and the overlapping part is taken. The boundaries in the answer are of different kinds, and that is no accident: two came from the second inequality, which is non-strict, so it is included; five came from the first, which is strict, so it is out.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c4') < s.seq.indexOf('c2') || s.seq.indexOf('c4') < s.seq.indexOf('c3'), text: L(
      "Umumiy qismni nimadan olamiz, agar tengsizliklardan hech bo'lmasa bittasi hali yechilmagan bo'lsa? Avval ikkala javob ham tayyor bo'lishi kerak.",
      'Из чего брать общую часть, если хотя бы одно неравенство ещё не решено? Сначала должны быть готовы оба ответа.',
      'What would you take the common part of if at least one inequality is not solved yet? Both answers must be ready first.') },
    { when: (s) => s.seq.indexOf('c5') < s.seq.indexOf('c4'), text: L(
      "Javob umumiy qismni olishdan keyin yoziladi. Ikkita alohida javob hali sistemaning javobi emas.",
      'Ответ пишут после того, как взята общая часть. Два отдельных ответа — ещё не ответ системы.',
      'The answer is written after the common part is taken. Two separate answers are not yet the answer of the system.') },
    { when: (s) => s.seq.indexOf('c2') < s.seq.indexOf('c1') || s.seq.indexOf('c3') < s.seq.indexOf('c1'), text: L(
      "Yechimlar o'z-o'zidan paydo bo'lmaydi: birinchi qadam — har bir tengsizlikni alohida yechishga qaror qilish.",
      'Решения не появляются сами: первый шаг — решить каждое неравенство отдельно.',
      'The solutions do not appear by themselves: the first step is to solve each inequality on its own.') },
    { when: (s) => s.seq.indexOf('c3') < s.seq.indexOf('c2'), text: L(
      "Tengsizliklar sistemada yozilgan tartibda yechiladi: avval birinchisi, keyin ikkinchisi. Javob o'zgarmaydi, lekin yozuv o'qilishi kerak.",
      'Неравенства решают в том порядке, в каком они записаны в системе: сначала первое, потом второе. Ответ не изменится, но запись должна читаться.',
      'The inequalities are solved in the order they are written in the system: the first, then the second. The answer does not change, but the record must read cleanly.') },
  ],
  wrongText: L(
    "Zanjirni yuqoridan pastga o'qing: umumiy qismni olish uchun ikkala yechim ham tayyor bo'lishi kerakmi?",
    'Прочитай цепочку сверху вниз: нужны ли готовыми оба решения, чтобы взять общую часть?',
    'Read the chain from top to bottom: must both solutions be ready before the common part can be taken?'),
};

export default function D16_08(props) { return <OrderLines data={DATA} {...props} />; }
