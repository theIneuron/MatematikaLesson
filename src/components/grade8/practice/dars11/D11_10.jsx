// Dars11 · Amaliyot 10 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §9 (11-dars, 10-pozitsiya)
//
// Darsning uch xossasi bitta gapda. Bankdagi uch tuzoq uch adashish:
//   «qo'shadi»  — kvadrat ildizni yechadi, ustiga qo'shmaydi;
//   «musbat»    — nolni chetlab o'tadi, nolda esa xossa ishlaydi;
//   «kichik»    — З33 ning teskarisi: ildiz osti katta bo'lsa ildiz KATTA.
//
// MUHIM: kartalar SO'Z, ya'ni `L()` ICHIDA. `parts` uch tilda BIR XIL
// shaklda: matn, uya, matn, uya, matn, uya, matn.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L(
      'Kvadratga oshirish ildizni',
      'Возведение в квадрат',
      'Squaring') },
    { slot: 0 },
    { text: L(
      "lekin faqat ildiz osti",
      'корень, но только когда подкоренное',
      'the root, but only when the radicand is') },
    { slot: 1 },
    { text: L(
      "bo'lganda. Ildiz osti katta bo'lsa, ildiz ham",
      '. Больше подкоренное — корень',
      '. A bigger radicand makes the root') },
    { slot: 2 },
    { text: L("bo'ladi.", '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('yechadi', 'снимает', 'undoes') },
    { id: 'w2', label: L('nomanfiy', 'неотрицательно', 'non-negative') },
    { id: 'w3', label: L('katta', 'больше', 'bigger') },
    { id: 'w4', label: L("qo'shadi", 'добавляет', 'adds') },
    { id: 'w5', label: L('musbat', 'положительно', 'positive') },
    { id: 'w6', label: L('kichik', 'меньше', 'smaller') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning uch xossasi bitta gapda yozilgan, lekin uchta so'z tushib qolgan.",
    'Три свойства урока записаны в одном предложении, но три слова выпали.',
    'The three properties of the lesson are written in one sentence, but three words fell out.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uch xossa bir gapda. Kvadratga oshirish ildizni yechadi: o'n bir dan ildizni kvadratga oshirsangiz o'n bir qaytadi. Lekin bu ildiz osti nomanfiy bo'lganda ishlaydi — nol ham mumkin, shuning uchun «musbat» emas. Uchinchisi taqqoslash uchun kerak: yigirma olti yigirma beshdan katta, demak yigirma oltidan ildiz ham beshdan katta.",
    'Верно. Три свойства в одном предложении. Возведение в квадрат снимает корень: возведи корень из одиннадцати в квадрат — вернётся одиннадцать. Но это работает при неотрицательном подкоренном — нуль тоже подходит, поэтому не «положительно». Третье нужно для сравнения: двадцать шесть больше двадцати пяти, значит и корень из двадцати шести больше пяти.',
    'Correct. Three properties in one sentence. Squaring undoes the root: square the root of eleven and eleven comes back. But it works when the radicand is non-negative — zero is allowed, so not positive. The third is needed for comparison: twenty six is more than twenty five, so the root of twenty six is more than five.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Kvadrat ildizga hech narsa qo'shmaydi, u ildizni YECHADI. O'n bir dan ildizni kvadratga oshirib ko'ring: o'n bir chiqadi, ya'ni ildiz belgisi yo'qoladi.",
      'Квадрат ничего к корню не добавляет, он корень СНИМАЕТ. Возведи корень из одиннадцати в квадрат: выйдет одиннадцать, то есть знак корня исчезает.',
      'A square adds nothing to a root, it UNDOES it. Square the root of eleven: eleven comes out, so the root sign disappears.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Musbat so'zi nolni chetlab o'tadi, nolda esa xossa ishlaydi: noldan ildiz nolga teng, uning kvadrati ham nol. Shuning uchun shart nomanfiy deb yoziladi.",
      'Слово положительно отбрасывает нуль, а при нуле свойство работает: корень из нуля равен нулю, и его квадрат тоже нуль. Поэтому условие пишется как неотрицательно.',
      'The word positive throws away zero, yet at zero the property works: the root of zero is zero and its square is zero too. That is why the condition is written as non-negative.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Bu xossa teskari qaragan. Ikki sonni solishtiring: to'rtdan ildiz ikki, to'qqizdan ildiz uch. Ildiz osti o'sdi, ildiz ham o'sdi — demak katta ildiz osti KATTA ildiz beradi.",
      'Свойство смотрит в другую сторону. Сравни два числа: корень из четырёх два, корень из девяти три. Подкоренное выросло, и корень вырос — значит большее подкоренное даёт БОЛЬШИЙ корень.',
      'The property points the wrong way. Compare two numbers: the root of four is two, the root of nine is three. The radicand grew and the root grew — so a bigger radicand gives a BIGGER root.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankda uch tuzoq bor: ular gapga so'z bo'yicha to'g'ri keladi, matematika bo'yicha esa yo'q. Har birini son bilan tekshiring — to'rt va to'qqiz yetadi.",
      'В банке три ловушки: они подходят к предложению по языку, но не по математике. Проверь каждую числом — хватит четырёх и девяти.',
      'The bank holds three traps: they fit the sentence by language but not by mathematics. Test each with numbers — four and nine are enough.') },
  ],
  wrongText: L(
    "Qoidani ikki misolda tekshiring: o'n bir dan ildizning kvadrati va to'rt bilan to'qqizning ildizlari.",
    'Проверь правило на двух примерах: квадрат корня из одиннадцати и корни из четырёх и девяти.',
    'Test the rule on two examples: the square of the root of eleven, and the roots of four and nine.'),
};

export default function D11_10(props) { return <ClozeBank data={DATA} {...props} />; }
