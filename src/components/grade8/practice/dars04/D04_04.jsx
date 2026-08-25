// Dars04 · Amaliyot 04 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Kontent: src/books/grade8/DARS04_AMALIYOT_KONTENT_V2.md §04
//
// Metodist qarori 2026-08-24: har darsda o'nta mexanikaning biri `ClozeBank`
// bo'ladi va u DARSNING QOIDASINI so'z bilan tekshiradi. 4-darsda qoida uch
// tayanchdan iborat, uchtasi ham bo'shliqqa tushadi:
//   1) maxrajlar teng bo'lsa faqat SURATLAR qo'shiladi;
//   2) teng bo'lmasa avval UMUMIY MAXRAJ topiladi;
//   3) shart har bir DASTLABKI maxrajdan olinadi.
// Bankdagi uch tuzoq: «maxrajlar» (ikkalasini qo'shish), «javob» (shartni
// javobdan yig'ish), «yig'indining» (shartni faqat umumiy maxrajdan olish).
// `parts` uch tilda bir xil shaklda: matn, uya, matn, uya, matn, uya, matn.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      "Maxrajlar bir xil bo'lsa, faqat",
      'Если знаменатели одинаковы, складываются только',
      'If the denominators are equal, only the') },
    { slot: 0 },
    { text: L(
      "qo'shiladi, maxraj esa o'zgarmaydi. Maxrajlar har xil bo'lsa, avval",
      ', а знаменатель не меняется. Если знаменатели разные, сначала находят',
      'are added and the denominator stays. If the denominators differ, first the') },
    { slot: 1 },
    { text: L(
      "topiladi. Shart esa har bir",
      '. А условие берут из каждого',
      'is found. And the condition is taken from each') },
    { slot: 2 },
    { text: L("maxrajdan olinadi.", 'знаменателя.', 'denominator.') },
  ],
  cards: [
    { id: 'w1', label: L('suratlar', 'числители', 'numerators') },
    { id: 'w2', label: L('maxrajlar', 'знаменатели', 'denominators') },
    { id: 'w3', label: L('umumiy maxraj', 'общий знаменатель', 'common denominator') },
    { id: 'w4', label: L('javob', 'ответ', 'answer') },
    { id: 'w5', label: L('dastlabki', 'исходного', 'original') },
    { id: 'w6', label: L("yig'indining", 'суммы', "the sum's") },
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
    "To'g'ri. Qoida uch narsani birga aytadi. Maxrajlar teng bo'lsa, faqat SURATLAR qo'shiladi: maxraj bo'lakning o'lchamini aytadi, o'lcham esa qo'shishdan o'zgarmaydi. Teng bo'lmasa, avval UMUMIY MAXRAJ topiladi va ikkala kasr o'sha maxrajga keltiriladi. Uchinchisi ko'pincha esdan chiqadi: shart HAR BIR DASTLABKI maxrajdan olinadi, umumiy maxrajdan yoki tayyor javobdan emas.",
    'Верно. Правило говорит три вещи сразу. При равных знаменателях складываются только ЧИСЛИТЕЛИ: знаменатель задаёт размер доли, а размер от сложения не меняется. При разных сначала находят ОБЩИЙ ЗНАМЕНАТЕЛЬ и приводят к нему обе дроби. Третье забывают чаще всего: условие берут из КАЖДОГО ИСХОДНОГО знаменателя, а не из общего и не из готового ответа.',
    'Correct. The rule says three things at once. With equal denominators only the NUMERATORS add: the denominator sets the size of the part, and adding does not change a size. With different ones the COMMON DENOMINATOR is found first and both fractions are brought to it. The third is the one most often forgotten: the condition comes from EACH ORIGINAL denominator, not from the common one and not from the finished answer.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w2', text: L(
      "Maxrajlar qo'shilmaydi. Uch bo'linadi c ga qo'shuv to'rt bo'linadi c ga — bu yetti bo'linadi c ga, yetti bo'linadi ikki c ga emas. c ni birga teng qo'ying va tekshiring.",
      'Знаменатели не складывают. Три делить на c плюс четыре делить на c — это семь делить на c, а не семь делить на два c. Подставь c равное одному и проверь.',
      'Denominators are not added. Three over c plus four over c is seven over c, not seven over two c. Put c equal to one and check.') },
    { when: (s) => s.slots[1] === 'w4', text: L(
      "Javob oxirida chiqadi, undan oldin keltirish kerak. Ikki kasrni qo'shish uchun ularning maxrajlari BIR XIL bo'lishi shart — shuning uchun avval umumiy maxraj topiladi.",
      'Ответ появляется в конце, а до него надо привести дроби. Чтобы сложить две дроби, их знаменатели должны стать ОДИНАКОВЫМИ — для этого и находят общий знаменатель.',
      'The answer comes at the end; before it the fractions must be brought together. To add two fractions their denominators must become EQUAL — that is what the common denominator is for.') },
    { when: (s) => s.slots[2] === 'w6' || s.slots[2] === 'w4', text: L(
      "Shartni yig'indining maxrajidan ham, tayyor javobdan ham olib bo'lmaydi: keltirishda maxrajlar ko'payadi va ba'zi taqiqlar javobda ko'rinmay qoladi. Har bir DASTLABKI maxrajni alohida nolga tenglang.",
      'Условие нельзя брать ни из знаменателя суммы, ни из готового ответа: при приведении знаменатели меняются, и часть запретов в ответе не видна. Приравняй к нулю каждый ИСХОДНЫЙ знаменатель по отдельности.',
      'The condition cannot be taken from the sum\'s denominator nor from the finished answer: bringing to a common denominator changes them, and some bans become invisible in the answer. Set each ORIGINAL denominator to zero separately.') },
    { when: (s) => s.slots.indexOf('w1') === -1, text: L(
      "Qoidaning birinchi so'zi nima qo'shilishini aytadi, va bu suratlar. Qolgan ikkitasi undan keyin keladi.",
      'Первое слово правила называет то, что складывается, и это числители. Остальные два идут после него.',
      'The first word of the rule names what is added, and that is the numerators. The other two come after it.') },
  ],
  wrongText: L(
    "Qoidaning uch tayanchi: teng maxrajda faqat SURATLAR qo'shiladi, har xil maxrajda avval UMUMIY MAXRAJ topiladi, shart esa har bir DASTLABKI maxrajdan olinadi.",
    'Три опоры правила: при равных знаменателях складываются только ЧИСЛИТЕЛИ, при разных сначала находят ОБЩИЙ ЗНАМЕНАТЕЛЬ, а условие берут из каждого ИСХОДНОГО знаменателя.',
    'The three supports of the rule: with equal denominators only the NUMERATORS add, with different ones the COMMON DENOMINATOR comes first, and the condition is taken from each ORIGINAL denominator.'),
};

export default function D04_04(props) { return <ClozeBank data={DATA} {...props} />; }
