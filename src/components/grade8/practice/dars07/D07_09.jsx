// Dars07 · Amaliyot 09 — Pazl · 🔴 · tag: same_x_pairs
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §5 (7-dars, 9-pozitsiya)
//
// Uch formulada x BIR XIL — minus uch. Demak javobni faqat k hal qiladi, va
// ishora ishning yarmi: 24 va −24 bir xil kattalikni beradi, ishorasi esa
// qarama-qarshi (З28). Uchinchi juftlik boshqa kattalik — 18, ya'ni «ishora
// to'g'ri, son noto'g'ri» yo'li ham yopiladi.
// Kartalar KVADRAT (76px), shuning uchun yozuv qisqa: kasr va «y = −8».
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'same_x_pairs', level: '🔴',
  cards: [
    { id: 'f1', tokens: [{ n: '24', d: 'x' }] },
    { id: 'f2', tokens: [{ n: '−24', d: 'x' }] },
    { id: 'f3', tokens: [{ n: '18', d: 'x' }] },
    { id: 'v1', v: 'y = −8' },
    { id: 'v2', v: 'y = 8' },
    { id: 'v3', v: 'y = −6' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  given: [['x = −3']],
  givenLabel: L('Hamma joyda', 'Везде', 'Everywhere'),
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch formula, va hammasida x bir xil qiymatga teng. Pastda uchta javob turadi — ular formulalar bilan juftlanib uchta bo'sh kartaga o'tiradi.",
    'Три формулы, и во всех x равен одному и тому же. Снизу три ответа — они собираются в пары с формулами и садятся в три пустые карточки.',
    'Three formulas, and x is the same in all of them. Three answers are below — they pair up with the formulas and sit in the three empty cards.'),
  ask: L(
    "Formulani bosing, keyin uyani bosing.",
    'Нажми формулу, потом ячейку.',
    'Tap a formula, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uchtasida ham minus uchga bo'lindi: yigirma to'rtni minus uchga bo'lsangiz minus sakkiz, minus yigirma to'rtni minus uchga bo'lsangiz arti sakkiz, o'n sakkizni minus uchga bo'lsangiz minus olti. Ikki minus arti beradi — aynan shu ikkinchi formulani ajratib turadi. Tekshirish: minus uch karra minus sakkiz yigirma to'rt.",
    'Верно. Везде делили на минус три: двадцать четыре на минус три — минус восемь, минус двадцать четыре на минус три — плюс восемь, восемнадцать на минус три — минус шесть. Два минуса дают плюс, именно это отличает вторую формулу. Проверка: минус три на минус восемь — двадцать четыре.',
    'Correct. All three were divided by minus three: twenty four over minus three is minus eight, minus twenty four over minus three is plus eight, eighteen over minus three is minus six. Two minuses give a plus, and that is exactly what sets the second formula apart. Check: minus three times minus eight is twenty four.'),
  wrongs: [
    { when: (s) => s.mate.f1 === 'v2' || s.mate.f2 === 'v1', text: L(
      "Ishorani tekshiring. Yigirma to'rt musbat, minus uch manfiy — bo'linma MANFIY chiqadi. Minus yigirma to'rtda esa ikki minus bor va ular arti beradi. Ikkalasini ko'paytirib tekshiring.",
      'Проверь знак. Двадцать четыре положительно, минус три отрицательно — частное ОТРИЦАТЕЛЬНО. А в минус двадцати четырёх два минуса, и они дают плюс. Проверь оба умножением.',
      'Check the sign. Twenty four is positive, minus three is negative, so the quotient is NEGATIVE. In minus twenty four there are two minuses and they give a plus. Check both by multiplying.') },
    { when: (s) => s.mate.f3 && s.mate.f3 !== 'v3', text: L(
      "O'n sakkiz boshqa kattalik: uni minus uchga bo'lsangiz olti chiqadi, sakkiz emas. Tekshiring: minus uch karra minus olti o'n sakkiz, minus uch karra minus sakkiz esa yigirma to'rt.",
      'Восемнадцать — другая величина: делённое на минус три оно даёт шесть, а не восемь. Проверь: минус три на минус шесть — восемнадцать, а минус три на минус восемь — двадцать четыре.',
      'Eighteen is a different size: divided by minus three it gives six, not eight. Check: minus three times minus six is eighteen, while minus three times minus eight is twenty four.') },
    { when: (s) => s.mate.f1 === 'v3' || s.mate.f3 === 'v1', text: L(
      "Ishora to'g'ri, kattalik esa yo'q. Yigirma to'rt bilan o'n sakkizni minus uchga bo'lib solishtiring: birinchisi sakkiz, ikkinchisi olti beradi.",
      'Знак верный, а величина нет. Раздели двадцать четыре и восемнадцать на минус три и сравни: первое даёт восемь, второе шесть.',
      'The sign is right but the size is not. Divide twenty four and eighteen by minus three and compare: the first gives eight, the second six.') },
  ],
  wrongText: L(
    "Har formulada minus uchni chiziq tagiga qo'yib bo'lishni bajaring. Javobni ko'paytirib tekshiring: minus uch karra javob suratdagi songa teng bo'lishi kerak.",
    'В каждой формуле подставь минус три под черту и выполни деление. Проверь умножением: минус три на ответ должно дать число из числителя.',
    'In each formula put minus three below the bar and do the division. Check by multiplying: minus three times your answer must give the number in the numerator.'),
};

export default function D07_09(props) { return <PairSlots data={DATA} {...props} />; }
