// Dars27 · Amaliyot 06 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §9 (27-dars, 6-pozitsiya)
//
// UCH BO'SHLIQ — T1 va T2 ning ta'riflari. Bankdagi tuzoqlar:
//   «yarim-interval» — uchinchi tur, lekin u BITTA chegarasi kirgan
//                      to'plam, ikkalasi ham kirgan emas;
//   «dumaloq qavs»   — kesmani interval bilan almashtirish (З56);
//   «oraliq»         — umumiy so'z: kesma ham, interval ham, yarim-interval
//                      ham oraliq, ya'ni bu javob hech narsani aytmaydi.
// `parts` uch tilda BIR XIL shaklda: matn, uya, matn, uya, matn, uya, matn.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      "a ≤ x ≤ b tengsizlikni qanoatlantiruvchi sonlar to'plami",
      'Множество чисел, удовлетворяющих a ≤ x ≤ b, называется',
      'The set of numbers satisfying a ≤ x ≤ b is called a') },
    { slot: 0 },
    { text: L(
      "deyiladi va u",
      'и записывается через',
      'and is written with a') },
    { slot: 1 },
    { text: L(
      "bilan yoziladi. a < x < b to'plami esa",
      '. А множество a < x < b называется',
      '. And the set a < x < b is called an') },
    { slot: 2 },
    { text: L('deyiladi.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('kesma', 'отрезком', 'segment') },
    { id: 'w2', label: L('kvadrat qavs', 'квадратные скобки', 'square bracket') },
    { id: 'w3', label: L('interval', 'интервалом', 'interval') },
    { id: 'w4', label: L('yarim-interval', 'полуинтервалом', 'half-interval') },
    { id: 'w5', label: L('dumaloq qavs', 'круглые скобки', 'round bracket') },
    { id: 'w6', label: L('oraliq', 'промежутком', 'range') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning ikki ta'rifi bitta gapda yozilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta: uchtasi joyiga tushadi, uchtasi esa gapga mos kelib, matematikaga mos kelmaydi.",
    'Два определения урока записаны в одном предложении, но три слова выпали. В банке шесть карточек: три встают на место, а три подходят по языку, но не по математике.',
    'The two definitions of the lesson are written in one sentence, but three words fell out. The bank holds six cards: three fit, and three fit the sentence but not the mathematics.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Ikkala belgining ostida ham chiziq bo'lsa — chegaralar to'plamga kiradi, va bunday to'plam kesma deyiladi; u kvadrat qavs bilan yoziladi. Ikkala belgi ham qat'iy bo'lsa — chegaralar chiqarib tashlanadi, bunday to'plam interval deyiladi va dumaloq qavs bilan yoziladi. Uchinchi tur — yarim-interval: unda BITTA chegara kiradi, ikkinchisi yo'q, va yozuvda ikki xil qavs turadi.",
    'Верно. Если под обоими знаками есть черта — границы входят в множество, и такое множество называется отрезком; записывают его квадратными скобками. Если оба знака строгие — границы исключаются, такое множество называется интервалом и записывается круглыми скобками. Третий вид — полуинтервал: в нём входит ОДНА граница, а другая нет, и в записи стоят разные скобки.',
    'Correct. If both signs carry a line, the boundaries belong to the set, and such a set is called a segment, written with square brackets. If both signs are strict, the boundaries are excluded, and such a set is called an interval, written with round brackets. The third kind is the half-interval: ONE boundary is in and the other is out, and the record holds two different brackets.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4' || s.slots[2] === 'w4', text: L(
      "Yarim-interval — uchinchi tur, va u BITTA chegarasi kirgan to'plam. Bu gapda esa ikkala chegara ham bir xil: birinchi yozuvda ikkalasi ham kiradi, ikkinchisida ikkalasi ham kirmaydi. Yarim-intervalning yozuvi boshqacha ko'rinadi, masalan ikki x dan kichik yoki teng, x esa beshdan qat'iy kichik.",
      'Полуинтервал — третий вид, и это множество, в котором входит ОДНА граница. А в этом предложении обе границы одинаковы: в первой записи входят обе, во второй не входит ни одна. Запись полуинтервала выглядит иначе, например два меньше или равно x, а x строго меньше пяти.',
      'A half-interval is the third kind, a set where ONE boundary is in. In this sentence both boundaries behave alike: in the first record both are in, in the second neither is. A half-interval looks different, for instance two less than or equal to x, and x strictly less than five.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Dumaloq qavs chegarani CHIQARIB TASHLAYDI, gapda esa chegara kirgan to'plam haqida aytilyapti: belgilarning ostida chiziq bor. Kesma kvadrat qavs bilan yoziladi. Dumaloq qavs keyingi gapda, interval haqida aytilganda kerak bo'ladi.",
      'Круглая скобка границу ИСКЛЮЧАЕТ, а в предложении речь о множестве, куда граница входит: под знаками есть черта. Отрезок записывается квадратными скобками. Круглая скобка понадобится в следующей части, где речь об интервале.',
      'A round bracket EXCLUDES the boundary, while the sentence speaks of a set that includes it: the signs carry a line. A segment is written with square brackets. The round bracket is needed in the next clause, about the interval.') },
    { when: (s) => s.slots.indexOf('w6') !== -1, text: L(
      "«Oraliq» — umumiy so'z, va u hech narsani ajratmaydi: kesma ham oraliq, interval ham oraliq, yarim-interval ham oraliq. Bu yerda esa aniq TUR so'ralyapti. Umumiy so'z ta'rifning o'rnini bosolmaydi.",
      '«Промежуток» — общее слово, и оно ничего не различает: и отрезок промежуток, и интервал промежуток, и полуинтервал тоже. А здесь спрашивают конкретный ВИД. Общее слово определения не заменяет.',
      '«Range» is the general word and it distinguishes nothing: a segment is a range, an interval is a range, a half-interval is a range too. Here a specific KIND is asked for. A general word cannot stand in for a definition.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni ikki bilan besh misolida tekshiring.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово на примере двух и пяти.',
      'The three traps in the bank fit the language but not the mathematics. Test each word on the example of two and five.') },
  ],
  wrongText: L(
    "Belgilarning ostidagi chiziqqa qarang: ikkalasida ham chiziq bo'lsa — kesma va kvadrat qavs; ikkalasi ham qat'iy bo'lsa — interval va dumaloq qavs.",
    'Смотри на черту под знаками: есть под обоими — отрезок и квадратные скобки; оба строгие — интервал и круглые скобки.',
    'Look at the line under the signs: a line under both means a segment and square brackets; both strict means an interval and round brackets.'),
};

export default function D27_06(props) { return <ClozeBank data={DATA} {...props} />; }
