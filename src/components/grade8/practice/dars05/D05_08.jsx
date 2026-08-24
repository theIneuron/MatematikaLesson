// Dars05 · Amaliyot 08 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Kontent: src/books/grade8/DARS05_AMALIYOT_KONTENT_V2.md §08
//
// Metodist qarori 2026-08-24: har darsda o'nta mexanikaning biri `ClozeBank`
// bo'ladi va u DARSNING QOIDASINI so'z bilan tekshiradi. 5-darsda qoida uch
// tayanchdan iborat, uchtasi ham bo'shliqqa tushadi:
//   1) IKKINCHI kasr ag'dariladi (birinchisi emas);
//   2) shart uchta joydan yig'iladi, va uchinchisi bo'luvchining SURATI;
//   3) sabab bitta — NOLGA bo'lish mumkin emas.
// Bankdagi uch tuzoq: «birinchi», «maxraji», «birga».
// `parts` uch tilda bir xil shaklda: matn, uya, matn, uya, matn, uya, matn.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L(
      "Kasrni kasrga bo'lish uchun",
      'Чтобы разделить дробь на дробь, переворачивают',
      'To divide a fraction by a fraction, the') },
    { slot: 0 },
    { text: L(
      "kasr ag'dariladi. Uchinchi shart bo'luvchining",
      'дробь. Третье условие даёт',
      'one is flipped. The third condition comes from the') },
    { slot: 1 },
    { text: L(
      "keladi, chunki",
      'делителя, потому что делить на',
      'of the divisor, because dividing by') },
    { slot: 2 },
    { text: L("bo'lish mumkin emas.", 'нельзя.', 'is impossible.') },
  ],
  cards: [
    { id: 'w1', label: L('ikkinchi', 'вторую', 'second') },
    { id: 'w2', label: L('birinchi', 'первую', 'first') },
    { id: 'w3', label: L('suratidan', 'числитель', 'numerator') },
    { id: 'w4', label: L('maxrajidan', 'знаменатель', 'denominator') },
    { id: 'w5', label: L('nolga', 'нуль', 'zero') },
    { id: 'w6', label: L('birga', 'единицу', 'one') },
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
    "To'g'ri. Bo'lishda faqat IKKINCHI kasr ag'dariladi — birinchisi tegilmaydi. Shart uch joydan yig'iladi: birinchi kasrning maxraji, bo'luvchining maxraji va bo'luvchining SURATI. Uchinchisi eng ko'p unutiladi, chunki u javobda deyarli hech qachon ko'rinmaydi: bo'luvchining surati nolga aylansa, bo'luvchining o'zi nol bo'ladi, NOLGA bo'lish esa mumkin emas.",
    'Верно. При делении переворачивают только ВТОРУЮ дробь — первую не трогают. Условие собирается из трёх мест: знаменатель первой дроби, знаменатель делителя и ЧИСЛИТЕЛЬ делителя. Третье забывают чаще всего, ведь в ответе его почти никогда не видно: если числитель делителя обращается в нуль, сам делитель равен нулю, а делить на НУЛЬ нельзя.',
    'Correct. In division only the SECOND fraction is flipped — the first is untouched. The condition is collected from three places: the denominator of the first fraction, the denominator of the divisor and the NUMERATOR of the divisor. The third is forgotten most often because it is almost never visible in the answer: if the numerator of the divisor becomes zero, the divisor itself is zero, and dividing by ZERO is impossible.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w2', text: L(
      "Birinchi kasr tegilmaydi. Uni ag'darsangiz, boshqa amal chiqadi: ikki bo'linadi e ga bo'linadi uch bo'linadi e ga — bu ikki uchdan, e ni ikkiga teng qo'yib tekshiring.",
      'Первую дробь не трогают. Если перевернуть её, получится другое действие: два делить на e разделить на три делить на e — это две третьих, проверь при e равном двум.',
      'The first fraction is untouched. Flip it and you get a different operation: two over e divided by three over e is two thirds — check with e equal to two.') },
    { when: (s) => s.slots[1] === 'w4', text: L(
      "Bo'luvchining maxraji ham shart beradi, lekin u UCHINCHISI emas — u ikkinchisi. Uchinchi shart bo'luvchining SURATIDAN keladi: aynan surat bo'luvchini nolga aylantiradi.",
      'Знаменатель делителя тоже даёт условие, но это не ТРЕТЬЕ, а второе. Третье условие приходит от ЧИСЛИТЕЛЯ делителя: именно числитель обращает делитель в нуль.',
      'The denominator of the divisor gives a condition too, but that is not the THIRD one — it is the second. The third comes from the NUMERATOR of the divisor: it is the numerator that makes the divisor zero.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Birga bo'lish taqiqlanmagan: birga bo'lsangiz hech narsa o'zgarmaydi. Taqiqlangani — NOLGA bo'lish.",
      'Делить на единицу не запрещено: от деления на единицу ничего не меняется. Запрещено делить на НУЛЬ.',
      'Dividing by one is not forbidden: it changes nothing. What is forbidden is dividing by ZERO.') },
    { when: (s) => s.slots.indexOf('w1') === -1, text: L(
      "Qoidaning birinchi so'zi qaysi kasr ag'darilishini aytadi, va bu ikkinchisi. Qolgan ikkitasi undan keyin keladi.",
      'Первое слово правила называет, какую дробь переворачивают, и это вторая. Остальные два идут после него.',
      'The first word of the rule names which fraction is flipped, and that is the second one. The other two come after it.') },
  ],
  wrongText: L(
    "Qoidaning uch tayanchi: IKKINCHI kasr ag'dariladi, uchinchi shart bo'luvchining SURATIDAN keladi, sababi esa NOLGA bo'lish mumkin emasligi.",
    'Три опоры правила: переворачивают ВТОРУЮ дробь, третье условие приходит от ЧИСЛИТЕЛЯ делителя, а причина в том, что делить на НУЛЬ нельзя.',
    'The three supports of the rule: the SECOND fraction is flipped, the third condition comes from the NUMERATOR of the divisor, and the reason is that dividing by ZERO is impossible.'),
};

export default function D05_08(props) { return <ClozeBank data={DATA} {...props} />; }
