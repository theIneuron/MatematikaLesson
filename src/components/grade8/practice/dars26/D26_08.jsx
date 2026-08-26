// Dars26 · Amaliyot 08 — Tartib · 🔴 · tag: system_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §8 (26-dars, 8-pozitsiya)
//
// T3 NING YO'LI: har tengsizlik ALOHIDA yechiladi, keyin ikki yechim
// kesishtiriladi, va faqat undan keyin javob yoziladi.
//
// Kesishtirishni ikkinchi tengsizlikdan OLDIN qo'yish — eng qimmat xato:
// o'shanda kesishtiradigan ikkinchi narsa hali yo'q, va javob bitta
// tengsizlikdan olinadi (З55).
// Kartada SO'Z asosiy, matematika qisqa dalil, yozuv bo'shliqsiz.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'system_steps', level: '🔴',
  expr: ['x − 2 > 0,   x + 1 < 7'], exprSize: 20,
  itemSize: 11,
  cards: [
    { id: 'l1', tokens: ['x>2'],
      label: L('birinchisini yechamiz', 'решаем первое', 'solve the first one') },
    { id: 'l2', tokens: ['x<6'],
      label: L('ikkinchisini yechamiz', 'решаем второе', 'solve the second one') },
    { id: 'l3', tokens: ['x>2; x<6'],
      label: L('kesishtiramiz', 'пересекаем', 'intersect them') },
    { id: 'l4', tokens: ['2<x<6'],
      label: L('javobni yozamiz', 'записываем ответ', 'write the answer') },
  ],
  start: ['l3', 'l1', 'l4', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Sistemani yechish to'rt qadamdan iborat, lekin qadamlar aralashib ketgan. Kesishtirish uchun ikkala yechim ham tayyor bo'lishi kerak.",
    'Решение системы состоит из четырёх шагов, но шаги перепутаны. Чтобы пересекать, оба решения должны быть готовы.',
    'Solving the system takes four steps, but the steps are mixed up. To intersect, both solutions must be ready.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval har tengsizlikni alohida yechamiz: x ikkidan katta va x oltidan kichik. Keyin ikki yechimni kesishtiramiz, va faqat undan keyin javobni yozamiz. Tekshirish: uchda uch minus ikki bir, bir noldan katta; uch qo'shuv bir to'rt, to'rt yettidan kichik.",
    'Верно. Сначала решаем каждое неравенство по отдельности: x больше двух и x меньше шести. Потом пересекаем два решения, и только затем пишем ответ. Проверка: при трёх три минус два один, один больше нуля; три плюс один четыре, четыре меньше семи.',
    'Correct. First solve each inequality separately: x greater than two and x less than six. Then intersect the two solutions, and only then write the answer. Check: at three, three minus two is one, one is greater than zero; three plus one is four, four is less than seven.'),
  wrongs: [
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Kesishtirish IKKALA yechim tayyor bo'lgandan keyin bo'ladi. Hozircha faqat bittasi topilgan, ya'ni kesishtiradigan ikkinchi narsa yo'q. Aynan shu joyda javob bitta tengsizlikdan olinadi va sistemaning ikkinchi sharti unutiladi.",
      'Пересечение идёт после того, как готовы ОБА решения. Пока найдено только одно, то есть пересекать не с чем. Именно здесь ответ берут из одного неравенства и забывают второе условие системы.',
      'The intersection comes once BOTH solutions are ready. So far only one has been found, so there is nothing to intersect with. This is exactly where the answer gets taken from a single inequality and the second condition is forgotten.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Javob KESISHTIRISHDAN keyin yoziladi. Ikki alohida yechim hali javob emas: ular ustma-ust tushadigan joyni topish kerak. Aks holda javobda ikki alohida shart qoladi, qo'sh tengsizlik esa yozilmaydi.",
      'Ответ пишется ПОСЛЕ пересечения. Два отдельных решения — ещё не ответ: надо найти место, где они накладываются. Иначе в ответе останутся два отдельных условия, а двойное неравенство не появится.',
      'The answer is written AFTER the intersection. Two separate solutions are not yet an answer: the place where they overlap must be found. Otherwise the answer keeps two separate conditions and no double inequality appears.') },
    { when: (s) => s.seq[0] === 'l3' || s.seq[0] === 'l4', text: L(
      "Kesishtirishdan yoki javobdan boshlab bo'lmaydi — ular ishning natijasi. Sistemani yechish har doim tengsizliklarni ALOHIDA yechishdan boshlanadi.",
      'Начинать с пересечения или с ответа нельзя — они результат работы. Решение системы всегда начинается с того, что неравенства решают ПО ОТДЕЛЬНОСТИ.',
      'You cannot start with the intersection or the answer — they are the result of the work. Solving a system always begins by solving the inequalities SEPARATELY.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Ikki tengsizlik qaysi tartibda yechilishi katta farq qilmaydi, lekin yozuvda ular sistemadagi TARTIBDA turadi: avval birinchisi, keyin ikkinchisi. Bu tartib yechimni o'qishni osonlashtiradi va tekshirishda ham xuddi shu tartib ishlatiladi.",
      'В каком порядке решать два неравенства, большой разницы нет, но в записи они идут в ТОМ ЖЕ порядке, что и в системе: сначала первое, потом второе. Такой порядок облегчает чтение решения, и при проверке используется он же.',
      'The order in which the two inequalities are solved matters little, but in the record they follow the ORDER of the system: the first one, then the second. That order makes the solution easier to read, and the check follows it as well.') },
  ],
  wrongText: L(
    "Avval har tengsizlikni alohida yeching, keyin ikki yechimni kesishtiring, oxirida javobni qo'sh tengsizlik bilan yozing.",
    'Сначала реши каждое неравенство по отдельности, потом пересеки два решения, в конце запиши ответ двойным неравенством.',
    'First solve each inequality separately, then intersect the two solutions, and at the end write the answer as a double inequality.'),
};

export default function D26_08(props) { return <SwapOrder data={DATA} {...props} />; }
