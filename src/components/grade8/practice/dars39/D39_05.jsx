// Dars39 · Amaliyot 05 — Tartib · 🟡 · tag: isosceles_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §11 (39-dars, 5-pozitsiya)
//
// T3 NING ISBOTI, TO'RT QADAM:
//   balandliklar -> ikki to'g'ri burchakli uchburchak teng -> mos
//   burchaklar teng -> ∠A = ∠D
// Balandliklarni oxirga surish — asosiy xato: usiz solishtiradigan
// uchburchak umuman paydo bo'lmaydi. Xulosani oldinga surish esa 37-dars
// bilan bir xil xato (З78 ning naqshi).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'isosceles_steps', level: '🟡',
  expr: ['BC ∥ AD,  AB = CD'], exprSize: 20,
  itemSize: 11,
  cards: [
    { id: 'l1', tokens: ['BH ⊥ AD,  CK ⊥ AD'],
      label: L('balandliklarni tushiramiz', 'опускаем высоты', 'drop the heights') },
    { id: 'l2', tokens: ['△ABH = △DCK'],
      label: L('ikki uchburchak teng', 'два треугольника равны', 'the two triangles are equal') },
    { id: 'l3', tokens: ['∠BAH = ∠CDK'],
      label: L('mos burchaklar teng', 'соответственные углы равны', 'the matching angles are equal') },
    { id: 'l4', tokens: ['∠A = ∠D'],
      label: L('asosidagi burchaklar teng', 'углы при основании равны', 'the base angles are equal') },
  ],
  start: ['l3', 'l1', 'l4', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Teng yonli trapetsiyada asosidagi burchaklar teng ekanini ko'rsatamiz. BC va AD asoslar, AB va CD teng yon tomonlar. Isbot to'rt qadamda boradi, lekin qadamlar aralashib ketgan.",
    'Покажем, что в равнобедренной трапеции углы при основании равны. BC и AD — основания, AB и CD — равные боковые стороны. Доказательство идёт в четыре шага, но шаги перепутаны.',
    'We show that the base angles of an isosceles trapezoid are equal. BC and AD are the bases, AB and CD the equal legs. The proof takes four steps, but the steps are mixed up.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Isbot balandliklardan boshlanadi: B va C uchlaridan katta asosga perpendikulyar tushiramiz va ikkita to'g'ri burchakli uchburchak hosil qilamiz. Bu qadam kerak, chunki trapetsiyaning o'zida solishtiradigan uchburchak yo'q — uni YASASH kerak. Keyin uchburchaklarning tengligini ko'rsatamiz: ularning gipotenuzalari teng (bular teng yon tomonlar), katetlari BH va CK esa teng, chunki ikkalasi ham parallel to'g'ri chiziqlar orasidagi masofa. Undan mos burchaklarning tengligi chiqadi, va oxirida ular aynan A va D burchaklari ekanini yozamiz. Har qadam oldingisidan chiqadi: balandliksiz uchburchak yo'q, uchburchaksiz burchaklar teng emas.",
    'Верно. Доказательство начинается с высот: из вершин B и C опускаем перпендикуляры на большее основание и получаем два прямоугольных треугольника. Этот шаг нужен, потому что в самой трапеции сравнивать нечего — треугольники надо ПОСТРОИТЬ. Потом показываем равенство треугольников: их гипотенузы равны (это равные боковые стороны), а катеты BH и CK равны, потому что оба — расстояние между параллельными прямыми. Отсюда следует равенство соответственных углов, и в конце записываем, что это и есть углы A и D. Каждый шаг вытекает из предыдущего: без высот нет треугольников, без треугольников нет равенства углов.',
    'Correct. The proof begins with the heights: from the vertices B and C we drop perpendiculars to the longer base and obtain two right triangles. This step is needed because the trapezoid itself offers nothing to compare — the triangles must be BUILT. Then we show the triangles are equal: their hypotenuses are equal (these are the equal legs), and the legs BH and CK are equal because both are the distance between parallel lines. From this follows the equality of the matching angles, and at the end we write that these are precisely the angles A and D. Each step follows from the one before: without the heights there are no triangles, without the triangles no equal angles.'),
  wrongs: [
    { when: (s) => s.pos.l1 !== 1, text: L(
      "Balandliklar BIRINCHI tushiriladi. Trapetsiyaning o'zida solishtirish uchun uchburchak yo'q — u faqat to'rtburchak. Balandliklar uni uchta bo'lakka ajratadi: ikki to'g'ri burchakli uchburchak va o'rtada to'g'ri to'rtburchak. Aynan shu ikki uchburchak isbotning asbobidir, va ularsiz keyingi qadamlarning ma'nosi yo'q.",
      'Высоты опускаются ПЕРВЫМИ. В самой трапеции треугольников для сравнения нет — она просто четырёхугольник. Высоты разбивают её на три части: два прямоугольных треугольника и прямоугольник посередине. Именно эти два треугольника и есть инструмент доказательства, без них следующие шаги лишены смысла.',
      'The heights are dropped FIRST. The trapezoid itself has no triangles to compare — it is merely a quadrilateral. The heights split it into three parts: two right triangles and a rectangle between them. Those two triangles are the instrument of the proof, and without them the later steps have no meaning.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Xulosa ENG OXIRIDA turadi: A va D burchaklarining tengligi mos burchaklarning tengligidan chiqadi. Uni oldinga surish isbotni bekor qiladi — isbotlanadigan narsa uning o'zidan oldin turib qololmaydi.",
      'Вывод стоит В КОНЦЕ: равенство углов A и D следует из равенства соответственных углов. Сдвинув его вперёд, доказательство отменяешь — доказываемое не может стоять раньше самого себя.',
      'The conclusion stands at the END: the equality of the angles A and D follows from the equality of the matching angles. Moving it forward cancels the proof — what is to be proved cannot stand before itself.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Mos burchaklarning tengligi UCHBURCHAKLAR TENGLIGIDAN keyin chiqadi: teng uchburchaklarning mos elementlari teng bo'ladi, va bu «mos» degan so'zning ma'nosi. Uchburchaklar tengligi isbotlanmagunicha, ularning burchaklari haqida hech narsa aytib bo'lmaydi.",
      'Равенство соответственных углов выводится ПОСЛЕ равенства треугольников: у равных треугольников равны соответственные элементы, в этом и смысл слова «соответственные». Пока равенство треугольников не доказано, об их углах сказать нечего.',
      'The equality of the matching angles follows AFTER the equality of the triangles: in equal triangles the matching elements are equal, and that is what «matching» means. Until the triangles are shown equal, nothing can be said about their angles.') },
    { when: (s) => s.seq[0] === 'l4' || s.seq[0] === 'l3', text: L(
      "Xulosadan yoki burchaklardan boshlab bo'lmaydi — ular isbotning natijasi. Birinchi qadam qurilish: balandliklarni tushirish. Geometriyada isbot ko'pincha shunday boshlanadi — chizmaga yangi chiziq qo'shiladi va u solishtirish imkonini beradi.",
      'Начинать с вывода или с углов нельзя — они результат доказательства. Первый шаг — построение: опустить высоты. В геометрии доказательство часто так и начинается: к чертежу добавляется новая линия, и она даёт возможность сравнивать.',
      'You cannot start with the conclusion or the angles — they are the result of the proof. The first step is a construction: drop the heights. In geometry a proof often begins just so — a new line is added to the drawing and it makes comparison possible.') },
  ],
  wrongText: L(
    "Avval qurilish — balandliklar, — keyin uchburchaklarning tengligi, undan burchaklar, va oxirida xulosa. Har qadam oldingisiga tayanadi.",
    'Сначала построение — высоты, — потом равенство треугольников, из него углы, и в конце вывод. Каждый шаг опирается на предыдущий.',
    'First the construction — the heights — then the equality of the triangles, from it the angles, and the conclusion last. Each step rests on the one before.'),
};

export default function D39_05(props) { return <SwapOrder data={DATA} {...props} />; }
