// Dars28 · Amaliyot 10 — Juftlash · 🔴 · tag: words_to_inequality
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §10 (28-dars, 10-pozitsiya)
//
// MASALA TILINING BUTUN OG'IRLIGI SHU YERDA. To'rt ibora bitta songa
// ishora qiladi, lekin to'rt xil to'plamni beradi:
//   kamida 5 ta    -> x ≥ 5   beshning o'zi kiradi
//   ko'pi bilan 5  -> x ≤ 5   beshning o'zi kiradi
//   5 tadan ko'p   -> x > 5   beshning o'zi kirmaydi
//   5 tadan kam    -> x < 5   beshning o'zi kirmaydi
//
// Ikki o'q bir vaqtda ishlaydi: YO'NALISH (kamida/ko'pi bilan) va
// QAT'IYLIK (dan ko'p/dan kam). Ularni chalkashtirish T1 ning eng qimmat
// xatosi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'words_to_inequality', level: '🔴',
  connect: true,
  targetSize: 18,
  items: [
    { id: 'm1', label: L('kamida 5 ta', 'не менее 5', 'at least 5') },
    { id: 'm2', label: L("ko'pi bilan 5 ta", 'не более 5', 'at most 5') },
    { id: 'm3', label: L("5 tadan ko'p", 'больше 5', 'more than 5') },
    { id: 'm4', label: L('5 tadan kam', 'меньше 5', 'fewer than 5') },
  ],
  targets: [
    { id: 't1', tokens: ['x ≥ 5'] },
    { id: 't2', tokens: ['x ≤ 5'] },
    { id: 't3', tokens: ['x > 5'] },
    { id: 't4', tokens: ['x < 5'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "To'rt ibora bitta songa ishora qiladi, lekin to'rt xil to'plamni beradi. Har birida ikki narsani aniqlash kerak: yo'nalish va chegara kiradimi.",
    'Четыре оборота указывают на одно число, но задают четыре разных множества. В каждом надо определить две вещи: направление и входит ли граница.',
    'Four phrases point at one number yet define four different sets. In each, two things must be settled: the direction and whether the boundary is included.'),
  ask: L(
    "Chapdan iborani bosing, keyin o'ngdan uning tengsizligini bosing.",
    'Нажми оборот слева, потом его неравенство справа.',
    'Tap a phrase on the left, then its inequality on the right.'),
  correctText: L(
    "To'g'ri. «Kamida» va «ko'pi bilan» chegarani KIRITADI, «dan ko'p» va «dan kam» esa yo'q. Yo'nalish va chegara — ikki alohida o'q, va ular bir-biriga bog'liq emas.",
    'Верно. «Не менее» и «не более» границу ВКЛЮЧАЮТ, а «больше чем» и «меньше чем» нет. Направление и граница — две отдельные оси, и друг от друга они не зависят.',
    'Correct. «At least» and «at most» INCLUDE the boundary; «more than» and «fewer than» do not. Direction and boundary are two separate axes, independent of each other.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't3' || s.pair.m3 === 't1', text: L(
      "Bu ikki ibora bir tomonga qaraydi, lekin CHEGARADA farq qiladi. «Kamida beshta» — beshtasi ham yetadi, ya'ni besh javobga kiradi. «Beshtadan ko'p» esa beshtani yetarli demaydi: kamida oltita kerak. Misolda tekshiring: beshta o'rindiq kerak bo'lsa, beshta o'rindiq yetadi; beshtadan ko'p kerak bo'lsa, beshta yetmaydi.",
      'Эти два оборота смотрят в одну сторону, но различаются НА ГРАНИЦЕ. «Не менее пяти» — пяти уже достаточно, то есть пятёрка в ответ входит. А «больше пяти» пятёрку достаточной не считает: нужно хотя бы шесть. Проверь на примере: если нужно не менее пяти мест, пяти мест хватает; если нужно больше пяти, пяти не хватает.',
      'These two phrases point the same way but differ AT THE BOUNDARY. «At least five» means five already suffices, so five enters the answer. «More than five» does not accept five as enough: at least six is needed. Test it on an example: if at least five seats are needed, five seats suffice; if more than five are needed, five do not.') },
    { when: (s) => s.pair.m2 === 't4' || s.pair.m4 === 't2', text: L(
      "Bu ikki ibora ham bir tomonga qaraydi va yana CHEGARADA farq qiladi. «Ko'pi bilan beshta» — beshtasi ham mumkin, ya'ni besh kiradi. «Beshtadan kam» esa beshtani qoldirmaydi: eng ko'pi to'rtta. Misolda tekshiring: ko'pi bilan beshta mehmon kutilsa, beshta mehmon kelishi mumkin; beshtadan kam bo'lsa esa yo'q.",
      'Эти два оборота тоже смотрят в одну сторону и снова различаются НА ГРАНИЦЕ. «Не более пяти» — пять тоже возможно, то есть пятёрка входит. А «меньше пяти» пятёрку не оставляет: самое большее четыре. Проверь на примере: если ждут не более пяти гостей, пять гостей прийти могут; а если меньше пяти — нет.',
      'These two phrases also point the same way and again differ AT THE BOUNDARY. «At most five» allows five as well, so five is included. «Fewer than five» does not keep five: four at most. Test it on an example: if at most five guests are expected, five guests may come; if fewer than five, they may not.') },
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1' || s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Bu ikki ibora TESKARI tomonga qaraydi. «Kamida» degani pastdan chegaralaydi — bundan kam bo'lmasin; «ko'pi bilan» esa yuqoridan — bundan ko'p bo'lmasin. Iborani ma'no bilan o'qing: qaysi tomonda erkinlik qolyapti. «Kamida beshta» da o'nta ham, yuztasi ham yaraydi; «ko'pi bilan beshta» da esa bir ham, ikki ham.",
      'Эти два оборота смотрят в ПРОТИВОПОЛОЖНЫЕ стороны. «Не менее» ограничивает снизу — чтобы не было меньше; «не более» сверху — чтобы не было больше. Читай оборот по смыслу: с какой стороны остаётся свобода. При «не менее пяти» годятся и десять, и сто; при «не более пяти» — и один, и два.',
      'These two phrases point in OPPOSITE directions. «At least» bounds from below — not fewer than this; «at most» bounds from above — not more than this. Read the phrase by meaning: on which side does freedom remain. With «at least five», ten and a hundred both qualify; with «at most five», one and two do.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har iborada ikki savol bering: yo'nalish qayoqqa (bundan kam bo'lmasinmi yoki ko'p bo'lmasin), va beshtaning O'ZI yaraydimi. Ikkinchi savolga javob belgining ostida chiziq bor-yo'qligini beradi.",
      'В каждом обороте задай два вопроса: куда направление (не меньше или не больше) и годится ли САМА пятёрка. Ответ на второй вопрос и даёт черту под знаком.',
      'Ask two questions of every phrase: which direction (not fewer or not more), and does five ITSELF qualify. The answer to the second question is what puts the line under the sign.') },
  ],
  wrongText: L(
    "Har iborada ikki narsani aniqlang: yo'nalish va beshtaning o'zi javobga kiradimi. «Kamida» va «ko'pi bilan» chegarani kiritadi, «dan ko'p» va «dan kam» esa yo'q.",
    'В каждом обороте определи две вещи: направление и входит ли сама пятёрка в ответ. «Не менее» и «не более» границу включают, а «больше чем» и «меньше чем» нет.',
    'Settle two things in every phrase: the direction, and whether five itself enters the answer. «At least» and «at most» include the boundary; «more than» and «fewer than» do not.'),
};

export default function D28_10(props) { return <MatchPairs data={DATA} {...props} />; }
