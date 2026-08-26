// Dars54 · Amaliyot 09 — Pazl · 🔴 · tag: identity_to_result
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §6 (54-dars, 9-pozitsiya)
//
// T2 NING TENGLIKLARI, boshqa hech qayerda tekshirilmaydi:
//   (2+3)a = 5a          (k+l)a = ka + la
//   (2·3)a = 6a          (kl)a = k(la)
//   2(a+b) = 2a + 2b     k(a+b) = ka + kb
// Birinchi ikki yozuvda O'SHA ikki son va o'sha harf, farq faqat AMALDA.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'identity_to_result', level: '🔴',
  faceSize: 15, faceSizePhone: 13,
  cards: [
    { id: 'f1', side: 0, tokens: ['(2 + 3)a'] },
    { id: 'f2', side: 0, tokens: ['(2 · 3)a'] },
    { id: 'f3', side: 0, tokens: ['2(a + b)'] },
    { id: 'v1', side: 1, v: '5a' },
    { id: 'v2', side: 1, v: '6a' },
    { id: 'v3', side: 1, v: '2a + 2b' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch yozuv. Birinchi ikkitasida o'sha ikki son va o'sha vektor turibdi, farq faqat qavs ichidagi AMALDA. Uchinchisida esa koeffitsiyent qavs ichidagi yig'indiga ko'paytirilgan.",
    'Три записи. В первых двух стоят те же два числа и тот же вектор, различает их только ДЕЙСТВИЕ в скобках. А в третьей коэффициент умножен на сумму в скобках.',
    'Three records. The first two hold the same two numbers and the same vector, and only the OPERATION in the brackets separates them. In the third the coefficient multiplies a sum in brackets.'),
  ask: L(
    'Yozuvni bosing, keyin uyani bosing.',
    'Нажми запись, потом ячейку.',
    'Tap a record, then a slot.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Birinchi ikki yozuvni faqat qavs ichidagi amal ajratadi: ikki qo'shuv uch besh beradi, ikki karra uch esa olti. Vektor ikkalasida ham o'sha, ya'ni javob koeffitsiyentda hal bo'ladi. Uchinchisi taqsimot qonuni: koeffitsiyent qavs ichidagi HAR IKKALA vektorga tegadi, faqat birinchisiga emas. Sonlar bilan qanday ishlagan bo'lsak, vektorlar bilan ham xuddi shunday ishlaymiz.",
    'Верно. Первые две записи различает только действие в скобках: два плюс три даёт пять, а два на три даёт шесть. Вектор в обеих один и тот же, значит ответ решается коэффициентом. Третья это распределительный закон: коэффициент достаётся ОБОИМ векторам в скобках, а не только первому. Как работали с числами, так же работаем и с векторами.',
    'Correct. Only the operation in the brackets separates the first two records: two plus three gives five, two times three gives six. The vector is the same in both, so the coefficient settles the answer. The third is the distributive law: the coefficient reaches BOTH vectors in the brackets, not only the first. We work with vectors exactly as we worked with numbers.'),
  wrongs: [
    { when: (s) => s.mate.f1 === 'v2' || s.mate.f2 === 'v1', text: L(
      "Birinchi ikki yozuv o'rin almashdi. Qavs ichiga diqqat qiling: birinchisida QO'SHUV belgisi, ikkinchisida KO'PAYTIRISH. Ikki qo'shuv uch besh, ikki karra uch olti. Yozuvlar ataylab bir-biriga o'xshatib qo'yilgan: shu ikki sonni ko'rib, amalni o'qimasdan javob berish oson.",
      'Первые две записи поменялись местами. Обрати внимание на скобки: в первой знак ПЛЮС, во второй УМНОЖЕНИЕ. Два плюс три пять, два на три шесть. Записи нарочно сделаны похожими: увидев эти два числа, легко ответить, не прочитав действие.',
      'The first two records swapped places. Look inside the brackets: the first has a PLUS, the second a MULTIPLICATION. Two plus three is five, two times three is six. The records were made alike on purpose: seeing those two numbers, it is easy to answer without reading the operation.') },
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Uchinchi yozuv taqsimot qonuni. Ikki karra a qo'shuv b degani ikki karra a qo'shuv IKKI karra b, ya'ni koeffitsiyent qavs ichidagi ikkala vektorga ham tegadi. Bittasiga tegib ikkinchisini o'tkazib yuborish — sonlarda ham, vektorlarda ham bir xil xato.",
      'Третья запись это распределительный закон. Два на a плюс b означает два a плюс ДВА b, то есть коэффициент достаётся обоим векторам в скобках. Умножить один и пропустить другой — одинаковая ошибка и с числами, и с векторами.',
      'The third record is the distributive law. Two times a plus b means two a plus TWO b, that is, the coefficient reaches both vectors in the brackets. Multiplying one and skipping the other is the same error with numbers as with vectors.') },
    { when: () => true, text: L(
      "Har yozuvda qavsning ichiga qarang: u yerda qo'shish, ko'paytirish yoki ikki vektorning yig'indisi turishi mumkin, va ular uch xil javob beradi.",
      'В каждой записи смотри внутрь скобки: там может стоять сложение, умножение или сумма двух векторов, и они дают три разных ответа.',
      'In each record look inside the brackets: there may be an addition, a multiplication, or a sum of two vectors, and they give three different answers.') },
  ],
  wrongText: L(
    "Qavsning ichidagi amalni o'qing: qo'shish, ko'paytirish yoki ikki vektorning yig'indisi.",
    'Прочитай действие внутри скобки: сложение, умножение или сумма двух векторов.',
    'Read the operation inside the brackets: addition, multiplication, or a sum of two vectors.'),
};

export default function D54_09(props) { return <PairSlots data={DATA} {...props} />; }
