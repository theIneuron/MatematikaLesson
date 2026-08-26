// Dars50 · Amaliyot 04 — Tartib · 🟡 · tag: tangent_proof
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §12 (50-dars, 4-pozitsiya)
//
// ISBOT (`Dars50.jsx`, 1-teorema): urinma urinish nuqtasiga o'tkazilgan
// radiusga perpendikulyar. To'rt qadam:
//   OA         urinish nuqtasiga radius o'tkazamiz
//   B ∈ l      chiziqda boshqa nuqta olamiz
//   OB > R     u aylanadan tashqarida, ya'ni masofa kattaroq
//   OA ⊥ l     OA eng qisqa masofa, eng qisqasi esa perpendikulyar
//
// Xulosani `OB > R` dan OLDIN qo'yish — o'shanda perpendikulyarlik hech
// narsadan chiqadi. Boshqa nuqtani olishni oxirga surish ham xato:
// solishtiradigan masofa shundan paydo bo'ladi. `start` QAT'IY.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'tangent_proof', level: '🟡',
  expr: ['A ∈ l'], exprSize: 22,
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: ['OA = R'], label: L("urinish nuqtasiga radius o'tkazamiz", 'проводим радиус в точку касания', 'draw the radius to the point of tangency') },
    { id: 'l2', tokens: ['B ∈ l'], label: L('chiziqda boshqa nuqta olamiz', 'берём на прямой другую точку', 'take another point on the line') },
    { id: 'l3', tokens: ['OB > R'], label: L('u aylanadan tashqarida', 'она вне окружности', 'it lies outside the circle') },
    { id: 'l4', tokens: ['OA ⊥ l'], label: L("OA eng qisqa, demak perpendikulyar", 'OA кратчайшее, значит перпендикуляр', 'OA is the shortest, hence perpendicular') },
  ],
  start: ['l4', 'l2', 'l1', 'l3'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "To'g'ri chiziq l aylanaga A nuqtada uringan. Urinma shu nuqtaga o'tkazilgan radiusga perpendikulyar ekanini isbotlaymiz. Isbot to'rt qadamda boradi, lekin qadamlar aralashib ketgan.",
    'Прямая l касается окружности в точке A. Докажем, что касательная перпендикулярна радиусу, проведённому в эту точку. Доказательство идёт в четыре шага, но шаги перепутаны.',
    'A line l touches a circle at the point A. We prove that a tangent is perpendicular to the radius drawn to that point. The proof takes four steps, but the steps are mixed up.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Isbot solishtirish orqali boradi. Birinchi qadam — urinish nuqtasiga radius o'tkazish: uning uzunligi radiusga teng. Ikkinchi qadam — chiziqda BOSHQA nuqta olish: solishtirish uchun ikkinchi masofa kerak. Uchinchi qadam — o'sha nuqta haqidagi fakt: urinma aylana bilan faqat bitta umumiy nuqtaga ega, ya'ni qolgan hamma nuqtasi aylananing tashqarisida, va tashqaridagi nuqtagacha masofa radiusdan katta. To'rtinchi qadam — xulosa: OA chiziqdagi hamma nuqtaga qaraganda markazga eng yaqin, ya'ni u eng qisqa masofa; nuqtadan chiziqqacha eng qisqa masofa esa PERPENDIKULYAR bo'ladi. Demak OA chiziqqa perpendikulyar.",
    'Верно. Доказательство идёт через сравнение. Первый шаг — провести радиус в точку касания: его длина равна радиусу. Второй шаг — взять на прямой ДРУГУЮ точку: для сравнения нужно второе расстояние. Третий шаг — факт об этой точке: касательная имеет с окружностью лишь одну общую точку, значит все остальные её точки вне окружности, а до внешней точки расстояние больше радиуса. Четвёртый шаг — вывод: OA ближе к центру, чем любая другая точка прямой, то есть это кратчайшее расстояние; а кратчайшее расстояние от точки до прямой — ПЕРПЕНДИКУЛЯР. Значит OA перпендикулярно прямой.',
    'Correct. The proof runs by comparison. The first step draws the radius to the point of tangency: its length is the radius. The second takes ANOTHER point on the line: a second distance is needed for comparison. The third states the fact about that point: a tangent has only one point in common with the circle, so all its other points lie outside, and the distance to an outside point exceeds the radius. The fourth draws the conclusion: OA is nearer the centre than any other point of the line, so it is the shortest distance; and the shortest distance from a point to a line is the PERPENDICULAR. Hence OA is perpendicular to the line.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l4' || s.pos.l4 < s.pos.l3, text: L(
      "Xulosani solishtirishdan OLDIN qo'yib bo'lmaydi. Perpendikulyarlik «OA eng qisqa» degan faktdan chiqadi, va bu fakt uchun ikkinchi masofa bilan solishtirish kerak: OB radiusdan katta. Undan oldin xulosa hech narsaga tayanmaydi.",
      'Вывод нельзя ставить РАНЬШЕ сравнения. Перпендикулярность следует из факта «OA кратчайшее», а для этого нужно сравнение со вторым расстоянием: OB больше радиуса. До него вывод ни на чём не держится.',
      'The conclusion cannot come BEFORE the comparison. The perpendicularity follows from OA being the shortest, and that needs a comparison with a second distance: OB exceeds the radius. Before it the conclusion rests on nothing.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "«U aylanadan tashqarida» degan qadam BOSHQA nuqta olinmasdan ma'nosiz bo'ladi: «u» kim? Avval chiziqda ikkinchi nuqta olinadi, keyingina uning aylanadan tashqarida ekani aytiladi.",
      'Шаг «она вне окружности» без взятой ДРУГОЙ точки лишён смысла: кто «она»? Сначала на прямой берётся вторая точка, и только потом говорится, что она вне окружности.',
      'The step it lies outside the circle is meaningless before ANOTHER point is taken: what is it? First a second point is taken on the line, and only then it is said to lie outside.') },
    { when: (s) => s.pos.l1 > s.pos.l2, text: L(
      "Isbot radiusdan boshlanadi: solishtiriladigan birinchi masofa aynan OA. Boshqa nuqtani birinchi olsangiz, uni nima bilan solishtirish kerakligi ma'lum bo'lmaydi.",
      'Доказательство начинается с радиуса: первое сравниваемое расстояние — это OA. Если сначала взять другую точку, будет непонятно, с чем её сравнивать.',
      'The proof starts from the radius: the first distance to compare is OA. Take the other point first and there is nothing to compare it with.') },
    { when: (s) => s.seq[0] === 'l3', text: L(
      "Uchinchi qadamdan boshlab bo'lmaydi: u ikkinchi qadamning nuqtasi haqida gapiradi, va u nuqta hali olinmagan. Isbotning boshi — urinish nuqtasiga radius o'tkazish.",
      'С третьего шага начинать нельзя: он говорит о точке из второго шага, а эта точка ещё не взята. Начало доказательства — провести радиус в точку касания.',
      'You cannot start from the third step: it speaks of the point from the second step, and that point has not been taken yet. The proof begins by drawing the radius to the point of tangency.') },
  ],
  wrongText: L(
    "Har qadamdan bitta savol so'rang: bu qadamda nima haqida gapirilyapti, va u narsa allaqachon paydo bo'lganmi?",
    'Спроси у каждого шага: о чём в нём речь и появилось ли это уже?',
    'Ask every step: what does it speak about, and does that thing exist yet?'),
};

export default function D50_04(props) { return <SwapOrder data={DATA} {...props} />; }
