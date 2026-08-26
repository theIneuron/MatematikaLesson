// Dars51 · Amaliyot 04 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §3 (51-dars, 4-pozitsiya)
//
// T1 va T2 bitta gapga yig'ilgan. Bankdagi uch tuzoq uchta boshqa
// yo'ldan keladi: «markazda» — markaziy burchakning ta'rifi, «radiuslar» —
// uning tomonlari, «o'ziga» — З109.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      "Ichki chizilgan burchakning uchi",
      'Вершина вписанного угла лежит',
      'The vertex of an inscribed angle lies') },
    { slot: 0 },
    { text: L(
      "yotadi, tomonlari esa",
      ', а его стороны это', ', and its sides are') },
    { slot: 1 },
    { text: L(
      "bo'ladi. Bunday burchak o'zi tiralgan yoyning",
      '. Такой угол равен дуге, на которую он опирается,', '. Such an angle equals the arc it subtends,') },
    { slot: 2 },
    { text: L("ga teng.", 'взятой', 'taken') },
  ],
  cards: [
    { id: 'w1', label: L('aylanada', 'на окружности', 'on the circle') },
    { id: 'w2', label: L('vatarlar', 'хорды', 'chords') },
    { id: 'w3', label: L('yarmi', 'наполовину', 'in half') },
    { id: 'w4', label: L('markazda', 'в центре', 'at the centre') },
    { id: 'w5', label: L('radiuslar', 'радиусы', 'radii') },
    { id: 'w6', label: L("o'ziga", 'целиком', 'in full') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning ta'rifi va asosiy o'lchovi bitta gapga yig'ilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta, va uchtasi gapga tili bo'yicha bemalol tushadi.",
    'Определение урока и его главное измерение собраны в одно предложение, но три слова выпали. В банке шесть карточек, и три из них по языку в предложение ложатся свободно.',
    'The definition of the lesson and its main measurement are gathered into one sentence, but three words have dropped out. The bank holds six cards, and three of them fit the sentence smoothly by language alone.'),
  ask: L(
    "Bo'sh joyni bosing, keyin so'zni bosing.",
    'Нажми пропуск, потом слово.',
    'Tap a gap, then a word.'),
  bank: L("So'zlar", 'Слова', 'Words'),
  correctText: L(
    "To'g'ri. Uch so'z uch tomondan bitta figurani chegaralaydi: uch AYLANADA turadi, tomonlar VATAR bo'ladi, o'lchov esa yoyning YARMI. Bittasini almashtirsangiz boshqa figura chiqadi: uchni markazga ko'chirsangiz markaziy burchak bo'ladi, yarmini olib tashlasangiz esa o'lchov ikki barobar xato bo'ladi.",
    'Верно. Три слова с трёх сторон очерчивают одну фигуру: вершина стоит НА ОКРУЖНОСТИ, стороны это ХОРДЫ, а измерение это ПОЛОВИНА дуги. Замени одно, и получится другая фигура: перенеси вершину в центр — выйдет центральный угол, убери половину — измерение станет вдвое неверным.',
    'Correct. Three words fence in one figure from three sides: the vertex stands ON THE CIRCLE, the sides are CHORDS, and the measurement is HALF the arc. Change one and a different figure appears: move the vertex to the centre and you get a central angle; drop the half and the measurement is off by a factor of two.'),
  wrongs: [
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Uchinchi bo'shliqda «o'ziga» turibdi, ya'ni burchak yoyga TENG deb yozilib qoldi. Bu darsning eng qimmat xatosi. Yoyga teng bo'ladigan burchak bor, lekin u boshqasi — MARKAZIY burchak. Ichki chizilgani esa undan ikki barobar tor.",
      'В третьем пропуске стоит «целиком», то есть получилось, что угол РАВЕН дуге. Это самая дорогая ошибка урока. Угол, равный дуге, существует, но он другой — ЦЕНТРАЛЬНЫЙ. А вписанный вдвое уже.',
      'The third gap holds «in full», so the sentence now says the angle EQUALS the arc. This is the costliest error of the lesson. An angle equal to the arc does exist, but it is a different one — the CENTRAL angle. The inscribed one is twice as narrow.') },
    { when: (s) => s.slots[0] === 'w4' || s.slots[1] === 'w5', text: L(
      "Bu markaziy burchakning ta'rifi: uchi markazda, tomonlari radius. Ichki chizilgan burchakda esa uch aylananing chizig'ida yotadi va tomonlari aylanani kesib o'tadi, ya'ni vatar bo'ladi. Ikki ta'rif bir-biriga yaqin turadi, lekin ular boshqa figurani beradi.",
      'Это определение центрального угла: вершина в центре, стороны радиусы. А у вписанного угла вершина лежит на линии окружности, и стороны пересекают окружность, то есть являются хордами. Два определения стоят рядом, но задают разные фигуры.',
      'This is the definition of a central angle: vertex at the centre, sides are radii. An inscribed angle has its vertex on the line of the circle and its sides cross the circle, that is, they are chords. The two definitions stand close together but describe different figures.') },
    { when: () => true, text: L(
      "Gap uchta narsani ketma-ket aytadi: uch qayerda, tomonlar nima va o'lchov qanday. Uchalasi ham ichki chizilgan burchakni markaziy burchakdan ajratadi, ya'ni bittasi ham tasodifiy emas.",
      'Предложение говорит подряд о трёх вещах: где вершина, что за стороны и каково измерение. Все три отделяют вписанный угол от центрального, то есть ни одно не случайно.',
      'The sentence states three things in a row: where the vertex is, what the sides are, and how it is measured. All three separate an inscribed angle from a central one, so none of them is incidental.') },
  ],
  wrongText: L(
    "Uch so'z uch savolga javob beradi: uch qayerda, tomonlar nima, o'lchov qanday.",
    'Три слова отвечают на три вопроса: где вершина, что за стороны, каково измерение.',
    'Three words answer three questions: where the vertex is, what the sides are, how it is measured.'),
};

export default function D51_04(props) { return <ClozeBank data={DATA} {...props} />; }
