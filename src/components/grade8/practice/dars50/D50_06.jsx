// Dars50 · Amaliyot 06 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §12 (50-dars, 6-pozitsiya)
//
// UCH BO'SHLIQ: urinmaning nomi, uning radiusga munosabati (T2) va `d = R`
// dagi nuqtalar soni (T1).
//
// Kartalar SO'Z (skelet §0a.4). Bankdagi tuzoqlar: «kesuvchi» (nom
// almashadi), «parallel» (perpendikulyar o'rniga), «ikkita» (З107).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L("Aylana bilan faqat bitta umumiy nuqtasi bo'lgan to'g'ri chiziq", 'Прямая, имеющая с окружностью только одну общую точку, называется', 'A line having only one point in common with a circle is called a') },
    { slot: 0 },
    { text: L("deyiladi. U urinish nuqtasiga o'tkazilgan radiusga", '. Она', '. It is') },
    { slot: 1 },
    { text: L(". d = R bo'lganda umumiy nuqta", ' радиусу, проведённому в точку касания. При d = R у прямой и окружности', 'to the radius drawn to the point of tangency. When d = R the number of common points is') },
    { slot: 2 },
    { text: L("bo'ladi.", '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('urinma', 'касательной', 'tangent') },
    { id: 'w2', label: L('perpendikulyar', 'перпендикулярна', 'perpendicular') },
    { id: 'w3', label: L('bitta', 'одна общая точка', 'one') },
    { id: 'w4', label: L('kesuvchi', 'секущей', 'secant') },
    { id: 'w5', label: L('parallel', 'параллельна', 'parallel') },
    { id: 'w6', label: L('ikkita', 'две общие точки', 'two') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning uch tasdig'i bitta gapga yig'ilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta, va hammasi gapga tili bo'yicha tushadi.",
    'Три утверждения урока собраны в одно предложение, но три слова выпали. В банке шесть карточек, и все они по языку встают в предложение.',
    'The three statements of the lesson are gathered into one sentence, but three words fell out. The bank holds six cards and all of them fit the sentence as language.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uch bo'shliq uch narsani belgilaydi. Birinchisi — NOM: bitta umumiy nuqtali chiziq urinma deyiladi; ikki nuqtali chiziq esa kesuvchi, va bu boshqa nom. Ikkinchisi — MUNOSABAT: urinma urinish nuqtasidagi radiusga perpendikulyar; parallel bo'lishi mumkin emas, chunki radius aylananing markazidan urinish nuqtasiga boradi va chiziqqa yetib keladi. Uchinchisi — SON: masofa radiusga teng bo'lganda umumiy nuqta aynan bitta bo'ladi. Uchtasi birga urinmani ikki qo'shnisidan ajratadi: kesuvchidan (ikki nuqta) va tegmaydigan chiziqdan (nolta nuqta).",
    'Верно. Три пропуска задают три вещи. Первое — ИМЯ: прямая с одной общей точкой называется касательной; прямая с двумя точками — секущая, а это другое имя. Второе — ОТНОШЕНИЕ: касательная перпендикулярна радиусу в точке касания; параллельной она быть не может, ведь радиус идёт из центра к точке касания и доходит до прямой. Третье — ЧИСЛО: когда расстояние равно радиусу, общая точка ровно одна. Все три вместе отделяют касательную от двух её соседей: от секущей (две точки) и от прямой без общих точек (ноль точек).',
    'Correct. The three gaps settle three things. The first is the NAME: a line with one common point is a tangent; a line with two is a secant, which is another name. The second is the RELATION: a tangent is perpendicular to the radius at the point of tangency; it cannot be parallel, since the radius runs from the centre to that point and reaches the line. The third is the NUMBER: when the distance equals the radius there is exactly one common point. Together the three separate a tangent from its two neighbours: the secant (two points) and the line that misses the circle (none).'),
  wrongs: [
    { when: (s) => s.slots.indexOf('w6') !== -1, text: L(
      "«Ikkita» — bu kesuvchining soni, urinmaning emas. Masofa radiusga TENG bo'lganda chiziq aylanaga tegadi va bitta nuqta qoladi. Ikki nuqta paydo bo'lishi uchun masofa radiusdan KICHIK bo'lishi kerak, ya'ni chiziq aylananing ichiga kirishi kerak.",
      '«Две» — это число для секущей, а не для касательной. Когда расстояние РАВНО радиусу, прямая касается окружности и остаётся одна точка. Чтобы появились две точки, расстояние должно быть МЕНЬШЕ радиуса, то есть прямая должна зайти внутрь окружности.',
      'Two is the number for a secant, not a tangent. When the distance EQUALS the radius the line touches the circle and one point remains. For two points the distance must be LESS than the radius, that is, the line must enter the circle.') },
    { when: (s) => s.slots.indexOf('w5') !== -1, text: L(
      "Parallel bo'lishi mumkin emas: radius aylananing markazidan urinish nuqtasiga boradi, ya'ni u chiziqqa TEGADI. Parallel chiziqlar esa hech qachon uchrashmaydi. Teorema esa aniq narsani aytadi: urinish nuqtasidagi radius bilan urinma orasidagi burchak to'g'ri.",
      'Параллельной она быть не может: радиус идёт из центра окружности в точку касания, то есть ДОХОДИТ до прямой. А параллельные прямые не встречаются никогда. Теорема же говорит точное: угол между радиусом в точке касания и касательной прямой.',
      'It cannot be parallel: the radius runs from the centre of the circle to the point of tangency, so it MEETS the line. Parallel lines never meet. And the theorem says something exact: the angle between the radius at the point of tangency and the tangent is right.') },
    { when: (s) => s.slots.indexOf('w4') !== -1, text: L(
      "Kesuvchi — bu boshqa chiziq: uning aylana bilan IKKI umumiy nuqtasi bor va u aylananing ichidan o'tadi. Gapning boshida esa «faqat bitta umumiy nuqta» deyilgan, ya'ni bu urinmaning ta'rifi.",
      'Секущая — другая прямая: у неё с окружностью ДВЕ общие точки, и она проходит внутри окружности. А в начале предложения сказано «только одна общая точка», то есть это определение касательной.',
      'A secant is a different line: it has TWO points in common with the circle and passes through its interior. The sentence begins with only one point in common, which is the definition of a tangent.') },
    { when: (s) => s.slots[1] === 'w5' && s.slots[2] === 'w6', text: L(
      "Ikki bo'shliq ham teskari tanlangan, va ikkalasi bir narsani buzadi: urinma aylanaga TEGADI. Tegish nuqtasida radius chiziqqa yetib keladi (demak parallel emas), va tegish bitta nuqtada bo'ladi (demak ikkita emas).",
      'Оба пропуска выбраны неверно, и оба ломают одно: касательная КАСАЕТСЯ окружности. В точке касания радиус доходит до прямой (значит не параллельна), и касание происходит в одной точке (значит не две).',
      'Both gaps were filled wrongly, and both break one thing: a tangent TOUCHES the circle. At the point of tangency the radius reaches the line (so not parallel), and the touching happens at one point (so not two).') },
  ],
  wrongText: L(
    "Uch bo'shliq: chiziqning nomi, uning radiusga munosabati, va d = R dagi nuqtalar soni.",
    'Три пропуска: имя прямой, её отношение к радиусу и число точек при d = R.',
    'Three gaps: the name of the line, its relation to the radius, and the number of points when d = R.'),
};

export default function D50_06(props) { return <ClozeBank data={DATA} {...props} />; }
