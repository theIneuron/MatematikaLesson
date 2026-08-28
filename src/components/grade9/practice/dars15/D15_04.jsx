// Dars15 · Amaliyot 04 — Belgilash · 🟡 · teg: toliq-korpaytirmaslik
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> PlacePoint.
//
// Grafik y = x(x − 3)(x + 1) chizilgan: Ox ni UCHTA nuqtada kesib o'tadi —
// minus bir, nol va uch. Nolni tashlab ketish (ya'ni iksga qisqartirish)
// darsning asosiy adashishi, va chizmada bu ko'rinib turadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { PlacePoint } from '../asboblar9.jsx';

const DATA = {
  tag: 'toliq-korpaytirmaslik', level: '🟡',
  eyebrow: L('Belgilash', 'Отметка', 'Marking'),
  setup: L(
    "Grafik chizilgan. U Ox o'qini bir necha joyda kesib o'tadi.",
    'График построен. Он пересекает ось Ox в нескольких местах.',
    'The graph is drawn. It crosses the Ox axis in several places.'),
  ask: L(
    "Grafik Ox ni kesgan BARCHA nuqtalarni qo'ying.",
    'Поставь ВСЕ точки, где график пересекает Ox.',
    'Place ALL the points where the graph crosses Ox.'),
  expr: ['y = x(x − 3)(x + 1)'],
  plane: { x0: -3, x1: 4, y0: -6, y1: 6 },
  curves: [
    { f: (x) => x * (x - 3) * (x + 1) },
  ],
  answer: [[-1, 0], [0, 0], [3, 0]],
  correctText: L(
    "To'g'ri, uchta nuqta: minus bir, nol va uch. Har bir ko'paytuvchi bittadan ildiz beradi — iksning o'zi nolni, iks minus uch uchni, iks qo'shuv bir minus birni. NOLNI tashlab ketish eng ko'p uchraydigan xato: ifodani iksga qisqartirsangiz, ildiz yo'qoladi va oraliqlar soni ham noto'g'ri chiqadi. Chizmada bu ko'rinib turadi: grafik nolda ham o'qni kesib o'tadi.",
    'Верно, три точки: минус один, нуль и три. Каждый множитель даёт по корню — сам икс даёт нуль, икс минус три даёт три, икс плюс один даёт минус один. Потерять НУЛЬ — самая частая ошибка: если сократить выражение на икс, корень исчезнет, и промежутков окажется неверное число. На чертеже это видно: график пересекает ось и в нуле.',
    'Correct, three points: minus one, zero and three. Each factor gives one root — x itself gives zero, x minus three gives three, x plus one gives minus one. Losing the ZERO is the most common mistake: cancelling the expression by x erases that root, and the number of intervals comes out wrong too. The drawing shows it: the graph crosses the axis at zero as well.'),
  // RAZBOR SHARTLARI FAQAT YETILADIGAN HOLATLARGA QO'YILGAN. Mexanika
  // aynan UCHTA nuqta qo'yilmaguncha «Tekshirish» ni ochmaydi, shuning
  // uchun «nuqta yetmaydi» degan shart hech qachon bajarilmasdi
  // (tekshiruv 2026-08-28). Nolni tashlab ketish esa boshqa ko'rinishda
  // chiqadi: o'quvchi nolning O'RNIGA boshqa nuqta qo'yadi.
  wrongs: [
    { when: (s) => !s.has(0, 0) && s.has(1, 0), text: L(
      "Nol tushib qoldi, uning o'rniga bir qo'yilgan. Birinchi ko'paytuvchi iksning O'ZI: u nolda nolga aylanadi, demak nol ham ildiz. Bir esa ildiz emas: bir karra minus ikki karra ikki minus to'rt beradi.",
      'Нуль потерян, а на его место поставлена единица. Первый множитель — САМ икс: он обращается в нуль при нуле, значит нуль тоже корень. А единица корнем не является: один на минус два на два даёт минус четыре.',
      'The zero was lost and one was put in its place. The first factor is X ITSELF: it becomes zero at zero, so zero is a root too. And one is not a root: one times minus two times two gives minus four.') },
    { when: (s) => !s.has(0, 0), text: L(
      "Nol tushib qoldi. Birinchi ko'paytuvchi iksning O'ZI: u nolda nolga aylanadi, demak nol ham ildiz. Chizmada grafik nolda o'qni kesib o'tadi.",
      'Нуль потерян. Первый множитель — САМ икс: он обращается в нуль при нуле, значит нуль тоже корень. На чертеже график пересекает ось в нуле.',
      'The zero was lost. The first factor is X ITSELF: it becomes zero at zero, so zero is a root too. On the drawing the graph crosses the axis at zero.') },
    { when: (s) => s.has(-3, 0), text: L(
      "Ishora almashdi. Qavsda iks QO'SHUV bir turibdi, u minus birda nolga aylanadi. Minus uchda esa grafik o'qdan ancha pastda.",
      'Сбился знак. В скобке икс ПЛЮС один, она обращается в нуль при минус одном. А при минус трёх график далеко ниже оси.',
      'A sign slipped. The bracket has x PLUS one, which becomes zero at minus one. At minus three the graph is far below the axis.') },
    { when: (s) => s.has(1, 0), text: L(
      "Bir ildiz emas: birni qo'ying — bir karra minus ikki karra ikki, ya'ni minus to'rt, nol emas. Qavs iks minus uch bo'lsa, ildiz uchga teng.",
      'Единица не корень: подставь один — один на минус два на два, то есть минус четыре, а не нуль. Если скобка икс минус три, корень равен трём.',
      'One is not a root: substitute it — one times minus two times two, that is minus four, not zero. If the bracket is x minus three, the root is three.') },
    { when: (s) => s.pts.some((p) => p[1] !== 0), text: L(
      "Nuqtalardan biri o'qdan chetda qolgan. Grafik Ox ni kesgan joyda igrek nolga teng, demak uchala nuqta ham gorizontal o'qda yotadi.",
      'Одна из точек оказалась не на оси. Там, где график пересекает Ox, игрек равен нулю, значит все три точки лежат на горизонтальной оси.',
      'One of the points ended up off the axis. Where the graph crosses Ox, y equals zero, so all three points lie on the horizontal axis.') },
  ],
  wrongText: L(
    "Har bir ko'paytuvchini alohida nolga tenglashtiring: iks, iks minus uch va iks qo'shuv bir. Har biri bittadan ildiz beradi, va hammasi Ox da yotadi.",
    'Приравняй каждый множитель к нулю по отдельности: икс, икс минус три и икс плюс один. Каждый даёт по корню, и все они лежат на Ox.',
    'Set each factor to zero separately: x, x minus three, and x plus one. Each gives one root, and they all lie on Ox.'),
};

export default function D15_04(props) { return <PlacePoint data={DATA} {...props} />; }
