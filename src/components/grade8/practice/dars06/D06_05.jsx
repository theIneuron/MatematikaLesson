// Dars06 · Amaliyot 05 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Kontent: src/books/grade8/DARS06_AMALIYOT_KONTENT_V2.md §05
//
// Metodist qarori 2026-08-24: har darsda o'nta mexanikaning biri `ClozeBank`
// bo'ladi va u DARSNING QOIDASINI so'z bilan tekshiradi. 6-darsda qoida uch
// tayanchdan iborat, uchtasi ham bo'shliqqa tushadi:
//   1) avval QAVS ichidagi amal;
//   2) keyin KO'PAYTIRISH va bo'lish, oxirida qo'shish va ayirish;
//   3) shart ORALIQ satrlardan ham yig'iladi, faqat javobdan emas.
// Bankdagi uch tuzoq: «chapdan o'ngga», «qo'shish», «javobdan».
// `parts` uch tilda bir xil shaklda: matn, uya, matn, uya, matn, uya, matn.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      "Ifodani almashtirishda avval",
      'При преобразовании выражения сначала выполняют действие в',
      'When transforming an expression, the action inside the') },
    { slot: 0 },
    { text: L(
      "ichidagi amal bajariladi, keyin",
      ', потом',
      'is done first, then') },
    { slot: 1 },
    { text: L(
      "va bo'lish, oxirida qo'shish va ayirish. Shart esa yechimning",
      'и деление, и лишь в конце сложение и вычитание. А условие берут из',
      'and division, and only at the end addition and subtraction. And the condition is taken from the') },
    { slot: 2 },
    { text: L("satrlaridan ham yig'iladi.", 'строк решения тоже.', 'lines of the solution as well.') },
  ],
  cards: [
    { id: 'w1', label: L('qavs', 'скобке', 'bracket') },
    { id: 'w2', label: L("chapdan o'ngga", 'слева направо', 'left to right') },
    { id: 'w3', label: L("ko'paytirish", 'умножение', 'multiplication') },
    { id: 'w4', label: L("qo'shish", 'сложение', 'addition') },
    { id: 'w5', label: L('oraliq', 'промежуточных', 'intermediate') },
    { id: 'w6', label: L('oxirgi', 'последней', 'final') },
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
    "To'g'ri. Tartib uch pog'onali: QAVS, keyin KO'PAYTIRISH va bo'lish, oxirida qo'shish va ayirish. Uchinchi tayanch esa faqat shu darsda paydo bo'ladi: shart yechimning ORALIQ satrlaridan ham yig'iladi. Oraliq satrda paydo bo'lgan maxraj tayyor javobda ko'rinmasligi mumkin, lekin u qo'ygan taqiq kuchida qoladi.",
    'Верно. Порядок трёхступенчатый: СКОБКА, потом УМНОЖЕНИЕ и деление, и только в конце сложение и вычитание. Третья опора появляется именно на этом уроке: условие собирают и из ПРОМЕЖУТОЧНЫХ строк решения. Знаменатель, возникший в середине, в готовом ответе может быть не виден, но поставленный им запрет остаётся в силе.',
    'Correct. The order has three levels: the BRACKET, then MULTIPLICATION and division, and only at the end addition and subtraction. The third support appears in this lesson: the condition is collected from the INTERMEDIATE lines too. A denominator that appears mid-solution may be invisible in the finished answer, but the ban it sets stays in force.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w2', text: L(
      "Chapdan o'ngga hisoblash tartibni belgilamaydi. Bir bo'linadi n ga qo'shuv bir bo'linadi n ga karra n ni chapdan o'ngga hisoblang va qavs bilan solishtiring — javob boshqa chiqadi.",
      'Счёт слева направо порядка не задаёт. Посчитай один делить на n плюс один делить на n на n слева направо и сравни со скобкой — ответ выйдет другим.',
      'Left to right does not set the order. Work out one over n plus one over n times n from left to right and compare with the bracketed version — the answer differs.') },
    { when: (s) => s.slots[1] === 'w4', text: L(
      "Qo'shish oxirgi pog'onada turadi, ko'paytirishdan keyin. Qavs bo'lmasa, avval ko'paytirish va bo'lish bajariladi.",
      'Сложение стоит на последней ступени, после умножения. Без скобки сначала выполняют умножение и деление.',
      'Addition is on the last level, after multiplication. Without a bracket multiplication and division come first.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Oxirgi satrdan shart yig'ib bo'lmaydi: o'rtada paydo bo'lgan maxraj javobda ko'rinmasligi mumkin. Har ORALIQ satrga alohida qarash kerak.",
      'По последней строке условие собрать нельзя: знаменатель, возникший в середине, в ответе может быть не виден. Смотреть надо на каждую ПРОМЕЖУТОЧНУЮ строку.',
      'The condition cannot be collected from the last line: a denominator born in the middle may be invisible in the answer. Every INTERMEDIATE line has to be looked at.') },
    { when: (s) => s.slots.indexOf('w1') === -1, text: L(
      "Qoidaning birinchi so'zi eng ustun turgan narsani aytadi, va bu qavs. Qolgan ikkitasi undan keyin keladi.",
      'Первое слово правила называет то, что стоит выше всего, и это скобка. Остальные два идут после него.',
      'The first word of the rule names what ranks highest, and that is the bracket. The other two come after it.') },
  ],
  wrongText: L(
    "Qoidaning uch tayanchi: avval QAVS, keyin KO'PAYTIRISH va bo'lish, shart esa ORALIQ satrlardan ham yig'iladi.",
    'Три опоры правила: сначала СКОБКА, потом УМНОЖЕНИЕ и деление, а условие собирают и из ПРОМЕЖУТОЧНЫХ строк.',
    'The three supports of the rule: the BRACKET first, then MULTIPLICATION and division, and the condition is collected from the INTERMEDIATE lines too.'),
};

export default function D06_05(props) { return <ClozeBank data={DATA} {...props} />; }
