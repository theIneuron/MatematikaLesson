// Dars03 · Amaliyot 10 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Kontent: src/books/grade8/DARS03_AMALIYOT_KONTENT_V2.md §10
//
// Metodist qarori 2026-08-24: har darsda o'nta mexanikaning biri `ClozeBank`
// bo'ladi va u DARSNING QOIDASINI so'z bilan tekshiradi. 3-darsda qoida uch
// tayanchdan iborat, uchtasi ham bo'shliqqa tushadi:
//   1) nima qisqaradi — KO'PAYTUVCHI (qo'shiluvchi emas);
//   2) buning uchun ikkala qavat ham AJRATILADI;
//   3) shart DASTLABKI maxrajdan olinadi (javobdan emas).
// Bankdagi uch tuzoq aynan shu uch adashish: «qo'shiluvchi», «qisqartiriladi»
// o'rniga emas — «javobdan» va «suratdan».
// `parts` uch tilda bir xil shaklda: matn, uya, matn, uya, matn, uya, matn.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L(
      "Kasrni qisqartirish — surat va maxrajni ularning umumiy",
      'Сократить дробь — значит разделить числитель и знаменатель на их общий',
      'To cancel a fraction is to divide numerator and denominator by their common') },
    { slot: 0 },
    { text: L(
      "ga bo'lish. Uni ko'rish uchun ikkala qavatni ham",
      '. Чтобы его увидеть, оба этажа сначала надо',
      '. To see it, both floors must first be') },
    { slot: 1 },
    { text: L(
      "kerak. Shart esa qisqargan javobdan emas,",
      'на множители. А условие берут не из сокращённого ответа, а из',
      '. And the condition is taken not from the cancelled answer but from the') },
    { slot: 2 },
    { text: L("maxrajdan olinadi.", 'знаменателя.', 'denominator.') },
  ],
  cards: [
    { id: 'w1', label: L("ko'paytuvchi", 'множитель', 'factor') },
    { id: 'w2', label: L("qo'shiluvchi", 'слагаемое', 'term') },
    { id: 'w3', label: L('ajratish', 'разложить', 'factored') },
    { id: 'w4', label: L("ko'paytirish", 'умножить', 'multiplied') },
    { id: 'w5', label: L('dastlabki', 'исходного', 'the original') },
    { id: 'w6', label: L('qisqargan', 'сокращённого', 'the cancelled') },
  ],
  answer: ['w1', 'w3', 'w5'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying.",
    'Правило урока записано, но три слова выпали. Поставь их из карточек снизу.',
    'The rule of the lesson is written down, but three words fell out. Put them back from the cards below.'),
  ask: L(
    "Kartani bosing, keyin bo'sh kartochkani bosing.",
    'Нажми карточку, потом пустую клетку.',
    'Tap a card, then tap an empty cell.'),
  bank: L("So'zlar", 'Слова', 'Words'),
  correctText: L(
    "To'g'ri. Qoida uch narsani birga aytadi. Qisqaradigan narsa — KO'PAYTUVCHI: qo'shiluvchini qisqartirib bo'lmaydi. Ko'paytuvchini ko'rish uchun ikkala qavatni AJRATISH kerak, aks holda u yozuvda ko'rinmaydi. Va shart DASTLABKI maxrajdan olinadi: qisqargan javobda taqiqlardan ba'zilari ko'rinmay qoladi, lekin ular yo'qolmaydi.",
    'Верно. Правило говорит три вещи сразу. Сокращается МНОЖИТЕЛЬ: слагаемое сократить нельзя. Чтобы множитель увидеть, оба этажа надо РАЗЛОЖИТЬ, иначе в записи его не видно. И условие берут из ИСХОДНОГО знаменателя: в сокращённом ответе часть запретов не видна, но они никуда не делись.',
    'Correct. The rule says three things at once. What cancels is a FACTOR: a term cannot be cancelled. To see the factor both floors must be FACTORED, otherwise it is invisible in the record. And the condition is taken from the ORIGINAL denominator: in the cancelled answer some bans are invisible, but they have not gone anywhere.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w2', text: L(
      "Qo'shiluvchini qisqartirib bo'lmaydi. b qo'shuv besh bo'lingan b qo'shuv yettini oling va b ni birga teng qo'ying: uch to'rtdan chiqadi, besh yettidan emas.",
      'Слагаемое сократить нельзя. Возьми b плюс пять делить на b плюс семь и подставь b равное одному: выйдет три четвёртых, а не пять седьмых.',
      'A term cannot be cancelled. Take b plus five over b plus seven and put b equal to one: you get three quarters, not five sevenths.') },
    { when: (s) => s.slots[1] === 'w4', text: L(
      "Qisqartirishdan oldin ikkala qavat KO'PAYTIRILMAYDI, AJRATILADI: ko'paytuvchilarga ajratilmagan yozuvda umumiy ko'paytuvchi ko'rinmaydi.",
      'Перед сокращением оба этажа не УМНОЖАЮТ, а РАСКЛАДЫВАЮТ: в неразложенной записи общий множитель не виден.',
      'Before cancelling, both floors are not MULTIPLIED but FACTORED: in an unfactored record the common factor is invisible.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Shartni qisqargan javobdan olib bo'lmaydi: qisqargan ko'paytuvchi yozuvdan ketadi, taqiq esa qoladi. Shuning uchun dastlabki maxrajga qaraladi.",
      'Условие нельзя брать из сокращённого ответа: сокращённый множитель уходит из записи, а запрет остаётся. Поэтому смотрят на исходный знаменатель.',
      'The condition cannot be taken from the cancelled answer: the cancelled factor leaves the record, but the ban stays. That is why one looks at the original denominator.') },
    { when: (s) => s.slots.indexOf('w1') === -1, text: L(
      "Qoidaning birinchi so'zi nima qisqarishini aytadi, va bu ko'paytuvchi. Qolgan ikkitasi undan keyin keladi.",
      'Первое слово правила называет то, что сокращается, и это множитель. Остальные два идут после него.',
      'The first word of the rule names what cancels, and that is a factor. The other two come after it.') },
  ],
  wrongText: L(
    "Qoidaning uch tayanchi: KO'PAYTUVCHI qisqaradi, buning uchun ikkala qavat AJRATILADI, shart esa DASTLABKI maxrajdan olinadi.",
    'Три опоры правила: сокращается МНОЖИТЕЛЬ, для этого оба этажа РАСКЛАДЫВАЮТ, а условие берут из ИСХОДНОГО знаменателя.',
    'The three supports of the rule: a FACTOR cancels, for that both floors are FACTORED, and the condition comes from the ORIGINAL denominator.'),
};

export default function D03_10(props) { return <ClozeBank data={DATA} {...props} />; }
