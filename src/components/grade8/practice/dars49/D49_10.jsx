// Dars49 · Amaliyot 10 — Tartib · 🔴 · tag: bisect_proof
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §11 (49-dars, 10-pozitsiya)
//
// ISBOT (`Dars49.jsx`, 1-teorema): vatarga perpendikulyar diametr uni teng
// ikkiga bo'ladi. To'rt qadam:
//   OA = OB = R      radiuslarni chizamiz
//   △AOB teng yonli  ikki tomoni radius, demak teng yonli
//   OP ⊥ AB          perpendikulyar bu uchburchakning balandligi
//   AP = PB          teng yonlida balandlik mediana ham, demak vatar bo'linadi
//
// З78 naqshi: xulosani balandlik-mediana qadamidan OLDIN qo'yish — o'shanda
// tenglik hech narsadan chiqadi. Radiuslarni oxirga surish ham xato: teng
// yonlilik ulardan chiqadi.
// Boshlang'ich tartib QAT'IY (`start`).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'bisect_proof', level: '🔴',
  expr: ['OP ⊥ AB'], exprSize: 22,
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: ['OA = OB = R'], label: L("radiuslarni chizamiz", 'проводим радиусы', 'draw the radii') },
    { id: 'l2', tokens: ['△AOB'], label: L('uchburchak teng yonli', 'треугольник равнобедренный', 'the triangle is isosceles') },
    // kartada faqat BELGI (skelet §0a.4): «balandlik» so'zi `label` da turadi
    { id: 'l3', tokens: ['OP'], label: L("perpendikulyar balandlik bo'ladi", 'перпендикуляр является высотой', 'the perpendicular is the height') },
    { id: 'l4', tokens: ['AP = PB'], label: L('balandlik mediana ham', 'высота является и медианой', 'the height is also a median') },
  ],
  start: ['l4', 'l2', 'l1', 'l3'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "AB vatariga perpendikulyar diametr o'tkazilgan, kesishish nuqtasi P. Vatarning teng ikkiga bo'linishini isbotlaymiz. Isbot to'rt qadamda boradi, lekin qadamlar aralashib ketgan.",
    'К хорде AB проведён перпендикулярный диаметр, точка пересечения P. Докажем, что хорда делится пополам. Доказательство идёт в четыре шага, но шаги перепутаны.',
    'A diameter perpendicular to the chord AB is drawn, meeting it at P. We prove that the chord is halved. The proof takes four steps, but the steps are mixed up.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Isbot radiuslardan boshlanadi: markazni vatarning ikki uchi bilan tutashtirsak, ikki kesma paydo bo'ladi, va ikkalasi ham radius — ya'ni teng. Shundan uchburchakning teng yonli ekani chiqadi: bu ikkinchi qadam, va u BIRINCHIDAN chiqadi. Uchinchi qadamda perpendikulyarni yangi ko'z bilan ko'ramiz: u shu teng yonli uchburchakda asosga tushirilgan BALANDLIK. Va faqat shundan keyin oxirgi qadam: teng yonli uchburchakda asosga tushirilgan balandlik mediana ham bo'ladi, ya'ni u asosni teng ikkiga bo'ladi — vatar teng ikkiga bo'lindi. Xulosani oldinga surib bo'lmaydi: o'shanda tenglik hech qanday asosga tayanmay qoladi.",
    'Верно. Доказательство начинается с радиусов: соединив центр с концами хорды, получим два отрезка, и оба они радиусы, то есть равны. Отсюда следует равнобедренность треугольника: это второй шаг, и он ВЫХОДИТ из первого. На третьем шаге мы смотрим на перпендикуляр по-новому: в этом равнобедренном треугольнике он ВЫСОТА к основанию. И только после этого последний шаг: в равнобедренном треугольнике высота к основанию является и медианой, то есть делит основание пополам — хорда разделена пополам. Вывод вперёд сдвигать нельзя: тогда равенство повиснет без основания.',
    'Correct. The proof starts from the radii: joining the centre to the ends of the chord gives two segments, and both are radii, hence equal. From that follows that the triangle is isosceles: that is the second step, and it FOLLOWS from the first. In the third step we see the perpendicular anew: in this isosceles triangle it is the HEIGHT to the base. And only then the last step: in an isosceles triangle the height to the base is also a median, so it halves the base — the chord is halved. The conclusion cannot be moved forward: the equality would then rest on nothing.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Xulosadan boshlab bo'lmaydi: AP teng PB degan tenglik isbotning NATIJASI, uning boshi emas. Undan oldin uchburchak, uning teng yonliligi va balandlik haqidagi qadamlar turishi kerak.",
      'Начинать с вывода нельзя: равенство AP равно PB — РЕЗУЛЬТАТ доказательства, а не его начало. Перед ним должны стоять шаги о треугольнике, его равнобедренности и высоте.',
      'You cannot start from the conclusion: AP equals PB is the RESULT of the proof, not its beginning. The steps about the triangle, its being isosceles, and the height must come first.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Xulosa balandlik haqidagi qadamdan OLDIN turolmaydi: vatarning teng bo'linishi aynan «teng yonli uchburchakda balandlik mediana ham bo'ladi» degan xossadan chiqadi. Bu xossani aytmasdan tenglikni yozsangiz, u hech narsaga tayanmaydi.",
      'Вывод не может стоять РАНЬШЕ шага о высоте: равенство частей хорды следует именно из свойства «в равнобедренном треугольнике высота к основанию является и медианой». Не назвав это свойство, ты запишешь равенство, которое ни на чём не держится.',
      'The conclusion cannot stand BEFORE the step about the height: the chord being halved follows precisely from the property that in an isosceles triangle the height to the base is also a median. Without naming that property the equality rests on nothing.') },
    { when: (s) => s.pos.l1 > s.pos.l2, text: L(
      "Uchburchakning teng yonli ekanini radiuslar chizilmasdan aytib bo'lmaydi: teng yonlilik aynan ikki tomonning radius bo'lishidan chiqadi. Birinchi qadam — radiuslarni chizish.",
      'Равнобедренность треугольника не назвать, пока не проведены радиусы: она следует именно из того, что две стороны — радиусы. Первый шаг — провести радиусы.',
      'The triangle cannot be called isosceles before the radii are drawn: that follows precisely from two sides being radii. The first step is drawing the radii.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Perpendikulyarni «balandlik» deb atash uchun uchburchak allaqachon bo'lishi kerak, va uning teng yonli ekani aytilgan bo'lishi kerak: balandlik-mediana xossasi faqat teng yonli uchburchakda ishlaydi. Ikkinchi qadam — teng yonlilik, uchinchisi — balandlik.",
      'Чтобы назвать перпендикуляр «высотой», треугольник уже должен существовать, и должна быть названа его равнобедренность: свойство высота-медиана работает только в равнобедренном треугольнике. Второй шаг — равнобедренность, третий — высота.',
      'To call the perpendicular a height the triangle must already exist and be known to be isosceles: the height-median property works only there. The second step is the isosceles property, the third the height.') },
  ],
  wrongText: L(
    "Har qadamdan bitta savol so'rang: buni aytish uchun nima allaqachon isbotlangan bo'lishi kerak?",
    'Спроси у каждого шага: что должно быть уже доказано, чтобы его произнести?',
    'Ask every step: what must already be proved to state it?'),
};

export default function D49_10(props) { return <SwapOrder data={DATA} {...props} />; }
