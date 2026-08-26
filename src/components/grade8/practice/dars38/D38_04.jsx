// Dars38 · Amaliyot 04 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §10 (38-dars, 4-pozitsiya)
//
// UCH BO'SHLIQ — IKKI TA'RIF VA BITTA XOSSA. Bankdagi tuzoqlar:
//   «kvadrat»    — u IKKALA ta'rifga ham tushadi, lekin ikkalasi ham
//                  emas: kvadrat ikkovining kesishmasi, va ta'rif
//                  o'rniga uni qo'yish figuralar oilasini toraytiradi;
//   «teng»       — З80: rombning diagonallari teng emas, perpendikulyar;
//   «trapetsiya» — 39-darsning figurasi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      "Hamma burchagi to'g'ri bo'lgan parallelogramm",
      'Параллелограмм, у которого все углы прямые, называется',
      'A parallelogram with all right angles is called a') },
    { slot: 0 },
    { text: L(
      "deyiladi, tomonlari teng bo'lgan parallelogramm esa",
      ', а параллелограмм с равными сторонами называется', ', and a parallelogram with equal sides is called a') },
    { slot: 1 },
    { text: L(
      "deyiladi. Rombning diagonallari o'zaro",
      '. Диагонали ромба взаимно', '. The diagonals of a rhombus are mutually') },
    { slot: 2 },
    { text: L('.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L("to'g'ri to'rtburchak", 'прямоугольником', 'rectangle') },
    { id: 'w2', label: L('romb', 'ромбом', 'rhombus') },
    { id: 'w3', label: L('perpendikulyar', 'перпендикулярны', 'perpendicular') },
    { id: 'w4', label: L('kvadrat', 'квадратом', 'square') },
    { id: 'w5', label: L('teng', 'равны', 'equal') },
    { id: 'w6', label: L('trapetsiya', 'трапецией', 'trapezoid') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning ikki ta'rifi va bitta xossasi bitta gapga yig'ilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta, va uchtasi gapga tili bo'yicha bemalol tushadi.",
    'Два определения урока и одно свойство собраны в одно предложение, но три слова выпали. В банке шесть карточек, и три из них по языку встают в предложение совершенно спокойно.',
    'Two definitions of the lesson and one property are gathered into one sentence, but three words fell out. The bank holds six cards, and three of them slot into the sentence perfectly well as language.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Ikki ta'rif parallelogrammga IKKI xil qo'shimcha shart qo'yadi. Burchaklar bo'yicha shart to'g'ri to'rtburchakni beradi, tomonlar bo'yicha shart rombni. Ular bir-biriga bog'liq emas: figura to'g'ri to'rtburchak bo'lib, romb bo'lmasligi mumkin, va aksincha. Ikkovi bir vaqtda bajarilsa, kvadrat chiqadi — lekin kvadrat na birinchi, na ikkinchi ta'rifning o'zi: u ikkovining KESISHMASI. Rombning diagonallari haqidagi xossa esa perpendikulyarlik: ular to'g'ri burchak ostida kesishadi va har biri burchakni teng ikkiga bo'ladi. Diagonallarning TENGLIGI boshqa figuraning belgisi — to'g'ri to'rtburchakniki.",
    'Верно. Два определения накладывают на параллелограмм ДВА разных дополнительных условия. Условие по углам даёт прямоугольник, условие по сторонам — ромб. Друг от друга они не зависят: фигура может быть прямоугольником и не быть ромбом, и наоборот. Если выполнены оба, получается квадрат — но квадрат не есть ни первое, ни второе определение: он их ПЕРЕСЕЧЕНИЕ. А свойство диагоналей ромба — перпендикулярность: они пересекаются под прямым углом, и каждая делит угол пополам. РАВЕНСТВО диагоналей — признак другой фигуры, прямоугольника.',
    'Correct. The two definitions place TWO different extra conditions on a parallelogram. The condition on the angles gives the rectangle, the condition on the sides gives the rhombus. They are independent: a figure may be a rectangle and not a rhombus, and the other way round. When both hold, a square results — but the square is neither the first definition nor the second: it is their INTERSECTION. And the property of the rhombus diagonals is perpendicularity: they cross at a right angle and each bisects an angle. EQUALITY of diagonals is the mark of another figure, the rectangle.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('w4') !== -1, text: L(
      "«Kvadrat» ikkala ta'rifga ham tushayotgandek ko'rinadi, va sabab bor: kvadratning burchaklari ham to'g'ri, tomonlari ham teng. Lekin ta'rif SHU shartga ega bo'lgan HAMMA figurani nomlashi kerak. Burchaklari to'g'ri parallelogrammlar orasida tomonlari teng bo'lmaganlari ham bor — ular kvadrat emas, lekin to'g'ri to'rtburchak. Kvadrat ikki oilaning kesishmasi, ta'rifning o'zi emas.",
      '«Квадрат» кажется подходящим к обоим определениям, и причина есть: у квадрата и углы прямые, и стороны равны. Но определение должно называть ВСЕ фигуры с данным условием. Среди параллелограммов с прямыми углами есть и такие, у которых стороны не равны, — они не квадраты, но прямоугольники. Квадрат — пересечение двух семейств, а не само определение.',
      '«Square» seems to fit both definitions, and for a reason: a square has right angles and equal sides alike. But a definition must name ALL the figures meeting the condition. Among parallelograms with right angles there are those whose sides are unequal — they are not squares but rectangles. The square is the intersection of two families, not the definition itself.') },
    { when: (s) => s.slots[2] === 'w5', text: L(
      "Rombning diagonallari TENG emas, perpendikulyar. Chizib ko'ring: qiya rombda bir diagonal uzun, ikkinchisi qisqa, lekin ular to'g'ri burchak ostida kesishadi. Diagonallarning tengligi to'g'ri to'rtburchakning xossasi, va ikki xossani almashtirish ikki figurani almashtirish demakdir. Faqat kvadratda ular birga bajariladi.",
      'Диагонали ромба не РАВНЫ, а перпендикулярны. Начерти: у косого ромба одна диагональ длинная, другая короткая, но пересекаются они под прямым углом. Равенство диагоналей — свойство прямоугольника, и поменять два свойства местами значит поменять местами две фигуры. Вместе они выполняются только в квадрате.',
      'The diagonals of a rhombus are not EQUAL but perpendicular. Draw it: in a slanted rhombus one diagonal is long and the other short, yet they cross at a right angle. Equal diagonals is a property of the rectangle, and swapping the two properties means swapping the two figures. Only in a square do both hold together.') },
    { when: (s) => s.slots[0] === 'w2' || s.slots[1] === 'w1', text: L(
      "Ikki ta'rif o'rin almashdi. Shartlarni o'qing: birinchisida BURCHAKLAR haqida gap ketyapti, ikkinchisida TOMONLAR haqida. Burchaklar to'g'ri to'rtburchakni beradi (nomida ham «to'g'ri» so'zi bor), tomonlarning tengligi esa rombni.",
      'Два определения поменялись местами. Прочитай условия: в первом речь об УГЛАХ, во втором о СТОРОНАХ. Углы дают прямоугольник (в самом названии есть слово «прямой»), а равенство сторон — ромб.',
      'The two definitions changed places. Read the conditions: the first speaks of ANGLES, the second of SIDES. Angles give the rectangle (the very name says «right»), while equal sides give the rhombus.') },
    { when: (s) => s.slots.indexOf('w6') !== -1, text: L(
      "«Trapetsiya» bu gapga umuman tegishli emas: gap PARALLELOGRAMMLAR haqida, trapetsiya esa parallelogramm emas — unda faqat bir juft tomon parallel. U 39-darsning figurasi, va uni parallelogrammning turlariga qo'shib bo'lmaydi.",
      '«Трапеция» к этому предложению вообще не относится: речь о ПАРАЛЛЕЛОГРАММАХ, а трапеция параллелограммом не является — у неё параллельна только одна пара сторон. Это фигура урока 39, и в число видов параллелограмма её не включают.',
      '«Trapezoid» has nothing to do with this sentence: it speaks of PARALLELOGRAMS, and a trapezoid is not one — only one pair of its sides is parallel. It is the figure of lesson 39 and does not belong among the kinds of parallelogram.') },
  ],
  wrongText: L(
    "Shartning nimaga tegishli ekaniga qarang: burchaklarga yoki tomonlarga. Rombning diagonallari perpendikulyar, to'g'ri to'rtburchakniki esa teng.",
    'Смотри, к чему относится условие: к углам или к сторонам. Диагонали ромба перпендикулярны, а прямоугольника равны.',
    'See what the condition applies to: the angles or the sides. The diagonals of a rhombus are perpendicular, those of a rectangle equal.'),
};

export default function D38_04(props) { return <ClozeBank data={DATA} {...props} />; }
