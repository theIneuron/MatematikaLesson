// Dars40 · Amaliyot 09 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §12 (40-dars, 9-pozitsiya)
//
// UCH BO'SHLIQ — FORMULA VA T3. Bankdagi tuzoqlar:
//   «yon tomon» — З83: balandlikni tomon bilan almashtirish;
//   «o'sha»     — З84: asos o'zgarganda balandlik o'zgarmaydi degan fikr;
//   «diagonal»  — formulada umuman qatnashmaydigan kesma.
// Uchinchi bo'shliq alohida muhim: u yuzaning o'zgarmasligini emas,
// BALANDLIKNING o'zgarishini aytadi — bu ikki fakt bir gapda turadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L(
      "Parallelogrammning yuzi",
      'Площадь параллелограмма равна произведению',
      'The area of a parallelogram equals the') },
    { slot: 0 },
    { text: L(
      "bilan unga mos",
      'на соответствующую', 'times the matching') },
    { slot: 1 },
    { text: L(
      "ko'paytmasiga teng. Boshqa tomon asos qilib olinsa, balandlik",
      '. Если взять за основание другую сторону, высота будет', '. If a different side is taken as the base, the height will be') },
    { slot: 2 },
    { text: L("bo'ladi.", '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('asos', 'основания', 'base') },
    { id: 'w2', label: L('balandlik', 'высоту', 'height') },
    { id: 'w3', label: L('boshqacha', 'другой', 'different') },
    { id: 'w4', label: L('yon tomon', 'боковой стороны', 'side') },
    { id: 'w5', label: L("o'sha", 'той же', 'the same') },
    { id: 'w6', label: L('diagonal', 'диагонали', 'diagonal') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning formulasi va uchinchi tasdig'i bitta gapga yig'ilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta, va uchtasi gapga tili bo'yicha bemalol tushadi.",
    'Формула урока и его третье утверждение собраны в одно предложение, но три слова выпали. В банке шесть карточек, и три из них по языку встают в предложение совершенно спокойно.',
    'The formula of the lesson and its third statement are gathered into one sentence, but three words fell out. The bank holds six cards, and three of them slot into the sentence perfectly well as language.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Formulada ikki o'lcham qatnashadi va ular bir-biriga MOS bo'lishi kerak: asos va aynan o'sha asosga tushirilgan balandlik. Gapning oxirgi qismi esa eng qimmat fakt: asos o'zgarsa, balandlik ham boshqacha bo'ladi. Bu ziddiyat emas — YUZA o'zgarmaydi, chunki u figuraning xossasi, o'lchash usulining emas. Ikki fakt birga ishlaydi: o'lchamlar juftlik bo'lib o'zgaradi, ularning ko'paytmasi esa doim bir xil qoladi. Shuning uchun «bitta balandlik» degan gap noto'g'ri: parallelogrammda balandlik har asos uchun alohida.",
    'Верно. В формуле участвуют два размера, и они должны СООТВЕТСТВОВАТЬ друг другу: основание и высота, опущенная именно на это основание. А последняя часть предложения — самый дорогой факт: если основание меняется, высота будет другой. Противоречия здесь нет — ПЛОЩАДЬ не меняется, ведь это свойство фигуры, а не способа измерения. Два факта работают вместе: размеры меняются парой, а произведение их остаётся прежним. Поэтому слова «одна высота» неверны: у параллелограмма высота своя для каждого основания.',
    'Correct. Two measurements enter the formula and they must MATCH each other: the base and the height dropped onto that very base. The last part of the sentence carries the costliest fact: if the base changes, the height will be different. There is no contradiction — the AREA does not change, since it is a property of the figure, not of the way it is measured. The two facts work together: the measurements change as a pair while their product stays the same. That is why «a single height» is wrong: a parallelogram has its own height for each base.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('w4') !== -1, text: L(
      "«Yon tomon» — bu darsning eng qimmat xatosi. Yon tomon balandlik emas: u qiya, ya'ni asosdan uzoqlikni o'lchamaydi. Ikki tomonning ko'paytmasi faqat to'g'ri to'rtburchakda yuzani beradi, u yerda yon tomon aynan balandlikka teng bo'lgani uchun. Qiya parallelogrammda esa u balandlikdan uzun, va formula haqiqiy yuzadan kattaroq son beradi.",
      '«Боковая сторона» — самая дорогая ошибка урока. Боковая сторона не высота: она наклонная и удалённость от основания не измеряет. Произведение двух сторон даёт площадь только у прямоугольника, где боковая сторона в точности равна высоте. А у косого параллелограмма она длиннее высоты, и формула даст число больше настоящей площади.',
      '«Side» is the costliest error of the lesson. A side is not a height: it is slanted and does not measure the distance from the base. The product of two sides gives the area only in a rectangle, where the side equals the height exactly. In a slanted parallelogram it is longer than the height, and the formula would give a number larger than the true area.') },
    { when: (s) => s.slots[2] === 'w5', text: L(
      "«O'sha» degan so'z gapni yolg'on qiladi. Asos o'zgarsa, balandlik ham o'zgaradi — bu darsning uchinchi tasdig'i. Misol: yuzi yigirma to'rt bo'lgan figurada olti uzunlikdagi asosga to'rt balandlik, o'n ikki uzunlikdagi asosga esa ikki balandlik to'g'ri keladi. O'zgarmaydigan narsa — YUZA, balandlik emas. Ikki faktni chalkashtirmang.",
      'Слово «той же» делает предложение ложным. Если основание меняется, меняется и высота — это третье утверждение урока. Пример: в фигуре площадью двадцать четыре основанию длиной шесть отвечает высота четыре, а основанию двенадцать — высота два. Неизменной остаётся ПЛОЩАДЬ, а не высота. Не путай два факта.',
      'The word «the same» makes the sentence false. If the base changes, the height changes too — that is the third statement of the lesson. An example: in a figure of area twenty-four a base of six takes a height of four, and a base of twelve takes a height of two. What stays unchanged is the AREA, not the height. Do not confuse the two facts.') },
    { when: (s) => s.slots.indexOf('w6') !== -1, text: L(
      "Diagonal yuzaning formulasida umuman qatnashmaydi. U ikki qarama-qarshi uchni tutashtiradi va figurani ikki uchburchakka ajratadi, lekin asosdan uzoqlikni o'lchamaydi. Bir xil asos va bir xil diagonal bilan yuzasi turlicha bo'lgan parallelogrammlar yasash mumkin, ya'ni diagonal yuzani aniqlamaydi.",
      'Диагональ в формуле площади не участвует вовсе. Она соединяет две противоположные вершины и делит фигуру на два треугольника, но удалённость от основания не измеряет. С одним и тем же основанием и одной и той же диагональю можно построить параллелограммы разной площади, значит диагональ площадь не определяет.',
      'A diagonal does not enter the area formula at all. It joins two opposite vertices and splits the figure into two triangles, but it does not measure the distance from the base. With the same base and the same diagonal, parallelograms of different areas can be built, so a diagonal does not determine the area.') },
    { when: (s) => s.slots[0] === 'w2' || s.slots[1] === 'w1', text: L(
      "Ikki so'z o'rin almashdi, lekin bu formulani buzmaydi — ko'paytirishda tartib ahamiyatsiz. Baribir gapni to'g'ri o'qish kerak: «asos bilan unga mos balandlik», chunki «unga» degan so'z asosga ishora qiladi. Teskari tartibda gap «balandlik bilan unga mos asos» bo'lib qolardi, va u g'alati yangraydi.",
      'Два слова поменялись местами, и на саму формулу это не влияет — при умножении порядок не важен. И всё же предложение надо читать верно: «основания на соответствующую высоту», ведь слово «соответствующую» указывает на основание. В обратном порядке вышло бы «высоты на соответствующее основание», и звучит это странно.',
      'The two words changed places, and that does not break the formula — order does not matter in multiplication. Still the sentence must read correctly: «the base times the matching height», since «matching» refers to the base. Reversed it would read «the height times the matching base», which sounds odd.') },
  ],
  wrongText: L(
    "Formulada asos va unga MOS balandlik turadi. Asos o'zgarsa balandlik ham o'zgaradi, yuza esa o'zgarmaydi.",
    'В формуле стоят основание и СООТВЕТСТВУЮЩАЯ ему высота. Если основание меняется, меняется и высота, а площадь нет.',
    'The formula holds the base and its MATCHING height. If the base changes the height changes too, while the area does not.'),
};

export default function D40_09(props) { return <ClozeBank data={DATA} {...props} />; }
