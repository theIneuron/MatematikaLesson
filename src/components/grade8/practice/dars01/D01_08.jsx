// Dars01 · Amaliyot 08 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank (yangi, 25-tip).
// Kontent: src/books/grade8/DARS01_AMALIYOT_KONTENT.md §08
//
// Darsning qoidasi SO'Z bilan. Ikki nol qarshi qo'yiladi: maxrajdagi nol
// qiymatni YO'Q qiladi, suratdagi nol esa qiymatni NOLGA aylantiradi
// (T3, З18). Bankda ikki tuzoq: «ko'paytuvchi» — bu darsning so'zi emas,
// «aniqlanmagan» — aynan З18.
//
// MUHIM: bu yerda kartalar SO'Z, ya'ni `L()` ICHIDA — matematika emas.
// `parts` uch tilda bir xil shaklda: matn, uya, matn, uya, matn, uya, matn.
// Shu sababli bo'shliqlarning tartibi UZ, RU va EN da mos tushadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L('Kasr —', 'Дробь не имеет смысла при тех значениях, при которых в нуль обращается', 'A fraction has no value at those values where') },
    { slot: 0 },
    { text: L("nolga aylanadigan qiymatlarda ma'noga ega emas.", '. Если же в нуль обращается', 'becomes zero. Where') },
    { slot: 1 },
    { text: L("nolga aylanadigan qiymatlarda esa kasrning qiymati", ', значение дроби равно', 'becomes zero, the value of the fraction is') },
    { slot: 2 },
    { text: L("bo'ladi.", '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('maxraj', 'знаменатель', 'the denominator') },
    { id: 'w2', label: L('surat', 'числитель', 'the numerator') },
    { id: 'w3', label: L('nol', 'нулю', 'zero') },
    { id: 'w4', label: L("ko'paytuvchi", 'множитель', 'the factor') },
    { id: 'w5', label: L('aniqlanmagan', 'не определено', 'undefined') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Qoida yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying.",
    'Правило записано, но три слова выпали. Поставь их из карточек снизу.',
    'The rule is written down, but three words fell out. Put them back from the cards below.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Ikki nolning ikki xil ishi bor. Maxrajdagi nol bo'lishni to'xtatadi — qiymat yo'q. Suratdagi nol bo'lishni to'xtatmaydi: nolni beshga bo'lsangiz nol chiqadi, ya'ni qiymat bor va u nolga teng.",
    'Верно. У двух нулей две разные работы. Нуль в знаменателе прекращает деление — значения нет. Нуль в числителе деление не прекращает: нуль разделить на пять — нуль, то есть значение есть и оно равно нулю.',
    'Correct. The two zeros do two different jobs. A zero in the denominator stops the division — there is no value. A zero in the numerator does not stop it: zero divided by five is zero, so the value exists and equals zero.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w2' && s.slots[1] === 'w1', text: L(
      "Ikki so'z joyini almashtirdi. Nolni beshga bo'lib ko'ring: javob nol, qiymat bor. Endi beshni nolga bo'lishga urinib ko'ring: bunday amal yo'q. Demak qiymatni yo'q qiladigan nol chiziqning tagida turadi.",
      'Два слова поменялись местами. Раздели нуль на пять: ответ нуль, значение есть. Теперь попробуй разделить пять на нуль: такого действия нет. Значит нуль, убивающий значение, стоит под чертой.',
      'Two words swapped places. Divide zero by five: the answer is zero, the value exists. Now try dividing five by zero: there is no such operation. So the zero that kills the value stands below the bar.') },
    { when: (s) => s.slots[2] === 'w5', text: L(
      "Suratdagi nol qiymatni yo'q qilmaydi, uni nolga aylantiradi. Nol bo'lingan minus ikki nolga teng — bu aniq javob.",
      'Нуль в числителе не убивает значение, а делает его нулём. Нуль разделить на минус два равно нулю — это точный ответ.',
      'A zero in the numerator does not kill the value, it makes it zero. Zero divided by minus two equals zero — an exact answer.') },
    { when: (s) => s.slots.indexOf('w4') !== -1, text: L(
      "Ko'paytuvchi bu darsning so'zi emas: bu yerda gap chiziqning usti va tagi haqida boradi.",
      'Множитель — слово не из этого урока: здесь речь про то, что над чертой и что под ней.',
      'Factor is not a word from this lesson: here it is about what is above the bar and what is below it.') },
  ],
  wrongText: L(
    "Bitta savol bering: nol qaysi qavatda turganda bo'lish to'xtaydi? O'sha qavatning nomini birinchi bo'shliqqa qo'ying.",
    'Задай один вопрос: на каком этаже нуль прекращает деление? Название этого этажа и ставь в первую клетку.',
    'Ask one question: on which floor does a zero stop the division? Put the name of that floor into the first cell.'),
};

export default function D01_08(props) { return <ClozeBank data={DATA} {...props} />; }
