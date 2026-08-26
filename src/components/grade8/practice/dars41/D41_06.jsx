// Dars41 · Amaliyot 06 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §3 (41-dars, 6-pozitsiya)
//
// Darsning qoidasi SO'Z bilan. Bu yerda kartalar SO'Z, ya'ni `L()` ICHIDA —
// matematika emas (skelet §0a.4). `parts` uch tilda bir xil TARTIBDA:
// matn, uya, matn, uya, matn, uya, matn — shu sababli bo'shliqlarning
// ma'nosi UZ, RU va EN da mos tushadi (asos, balandlik, yarim).
//
// Bankdagi uch tuzoq: «perimetrini» (yuza bilan perimetrni chalkashtirish),
// «yon tomoniga» (З86 ning so'z shakli), «ikkilanganini» (З85 ning teskarisi).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L('Uchburchakning yuzi', 'Площадь треугольника:', 'The area of a triangle:') },
    { slot: 0 },
    { text: L('bilan unga mos', 'умножить на соответствующую', 'times the matching') },
    { slot: 1 },
    { text: L("ko'paytmasining", 'и взять', ', and then') },
    { slot: 2 },
    { text: L('teng.', '.', 'of that.') },
  ],
  cards: [
    { id: 'w1', label: L('asosi', 'основание', 'the base') },
    { id: 'w2', label: L('balandligi', 'высоту', 'height') },
    { id: 'w3', label: L('yarmiga', 'половину', 'half') },
    { id: 'w4', label: L('perimetri', 'периметр', 'the perimeter') },
    { id: 'w5', label: L('yon tomoni', 'боковую сторону', 'side') },
    { id: 'w6', label: L('ikkilanganiga', 'двойную величину', 'the double') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Qoida yozilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta, va ularning hammasi gapga tili bo'yicha bemalol tushadi — farqni faqat ma'no beradi.",
    'Правило записано, но три слова выпали. В банке шесть карточек, и все они по языку встают в предложение совершенно спокойно — различие даёт только смысл.',
    'The rule is written down, but three words fell out. The bank holds six cards, and every one of them fits the sentence as language — only the meaning tells them apart.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Qoidada uch narsa muhim. Birinchisi — asos, ya'ni tomonlardan biri. Ikkinchisi — unga MOS balandlik: har asosning o'z balandligi bor, va ular aralashib ketmasligi kerak. Uchinchisi — yarim: asos bilan balandlikning ko'paytmasi parallelogrammning yuzini beradi, uchburchak esa uning yarmi. Uchta so'zdan bittasini tashlab ketsangiz, formula boshqa figuraga o'tib qoladi.",
    'Верно. В правиле важны три вещи. Первая — основание, то есть одна из сторон. Вторая — СООТВЕТСТВУЮЩАЯ ему высота: у каждого основания своя высота, и путать их нельзя. Третья — половина: произведение основания на высоту даёт площадь параллелограмма, а треугольник его половина. Пропусти одно из трёх слов, и формула перейдёт к другой фигуре.',
    'Correct. Three things matter in the rule. The first is the base, that is, one of the sides. The second is the MATCHING height: every base has its own height and they must not be mixed up. The third is the half: the product of base and height gives the area of a parallelogram, and the triangle is half of it. Drop one of the three words and the formula moves to a different figure.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('w6') !== -1, text: L(
      "«Ikkilangani» teskari tomonga olib boradi: uchburchak parallelogrammdan KICHIK, katta emas. Asos sakkiz, balandlik uch bo'lsa, ko'paytma yigirma to'rt, uchburchakning yuzi esa o'n ikki — ikkilangani emas, yarmi.",
      '«Двойная величина» ведёт в обратную сторону: треугольник МЕНЬШЕ параллелограмма, а не больше. Если основание восемь, высота три, произведение двадцать четыре, а площадь треугольника двенадцать — половина, а не двойная величина.',
      'The double leads the other way: a triangle is SMALLER than the parallelogram, not larger. With base eight and height three the product is twenty four and the area of the triangle is twelve — half, not double.') },
    { when: (s) => s.slots.indexOf('w5') !== -1, text: L(
      "Yon tomon balandlik o'rnini bosolmaydi: u asosga perpendikulyar emas, shunchaki qiya turadi. Faqat to'g'ri burchakli uchburchakda ikki tomon bir vaqtda perpendikulyar bo'ladi, va o'shanda ular ikkalasi ham KATET bo'ladi, gipotenuza emas.",
      'Боковая сторона высоту не заменяет: она не перпендикулярна основанию, а просто наклонена. Только в прямоугольном треугольнике две стороны перпендикулярны одновременно, и там обе они КАТЕТЫ, а не гипотенуза.',
      'A side cannot stand in for the height: it is not perpendicular to the base, merely slanted. Only in a right triangle are two sides perpendicular at once, and there both of them are LEGS, not the hypotenuse.') },
    { when: (s) => s.slots.indexOf('w4') !== -1, text: L(
      "Perimetr bu darsning so'zi emas: u chiziqning uzunligini o'lchaydi, yuza esa ichidagi joyni. Perimetrni balandlikka ko'paytirishning ma'nosi yo'q.",
      'Периметр — слово не из этого урока: он измеряет длину линии, а площадь место внутри. Умножать периметр на высоту смысла нет.',
      'The perimeter is not a word from this lesson: it measures the length of a line, while the area is the room inside. Multiplying a perimeter by a height makes no sense.') },
    { when: (s) => s.slots[0] === 'w2' || s.slots[1] === 'w1', text: L(
      "Ikki so'z joyini almashtirdi. Birinchi bo'shliqqa TOMON tushadi — asos, — ikkinchisiga esa o'sha asosga tushirilgan perpendikulyar, ya'ni balandlik. Gapni o'qib chiqing: yuza asosi bilan unga mos balandligi ko'paytmasining yarmiga teng.",
      'Два слова поменялись местами. В первый пропуск встаёт СТОРОНА — основание, — а во второй перпендикуляр, опущенный на это основание, то есть высота. Прочитай предложение: основание умножить на соответствующую высоту и взять половину.',
      'Two words swapped places. The first gap takes a SIDE — the base — and the second the perpendicular dropped onto that base, the height. Read the sentence: take the base, multiply it by the matching height.') },
  ],
  wrongText: L(
    "Qoidada uch narsa bor: tomon, unga tushirilgan perpendikulyar va yarim. Uchtasi shu tartibda turadi.",
    'В правиле три вещи: сторона, опущенный на неё перпендикуляр и половина. Все три стоят в этом порядке.',
    'The rule has three things: a side, the perpendicular dropped onto it, and a half. All three stand in that order.'),
};

export default function D41_06(props) { return <ClozeBank data={DATA} {...props} />; }
