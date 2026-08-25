// Dars08 · Amaliyot 04 — Pazl · 🟡 · tag: power_to_root
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §6 (8-dars, 4-pozitsiya)
//
// Uch juftlik BITTA qoidani uch marta so'raydi: kasr ko'rsatkichda MAXRAJ
// ildizning darajasi, SURAT esa ildiz ostidagi daraja. Uch yozuvda asos bir
// xil (besh), farq faqat ko'rsatkichda — demak taxmin qilib bo'lmaydi.
//
// IKKI TOMON HAM MATEMATIKA, shuning uchun kartalarda `side` ochiq berilgan
// (kit.jsx, PairSlots): o'ng tomonda ildiz turadi va u USTKI CHIZIQ bilan
// chizilishi kerak, matn bo'lib emas.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'power_to_root', level: '🟡',
  cardSize: 94, faceSize: 24, cardSizePhone: 68, faceSizePhone: 17,
  cards: [
    { id: 'f1', side: 0, tokens: [{ b: '5', e: { n: '1', d: '2' } }] },
    { id: 'f2', side: 0, tokens: [{ b: '5', e: { n: '3', d: '2' } }] },
    { id: 'f3', side: 0, tokens: [{ b: '5', e: { n: '2', d: '3' } }] },
    { id: 'v1', side: 1, tokens: [{ r: '5' }] },
    { id: 'v2', side: 1, tokens: [{ r: '5³' }] },
    { id: 'v3', side: 1, tokens: [{ r: '5²', deg: '3' }] },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uchta darajada asos bir xil, ko'rsatkich esa boshqa. Har biriga bitta ildiz yozuvi mos keladi.",
    'В трёх степенях основание одно и то же, а показатели разные. Каждой соответствует одна запись с корнем.',
    'The three powers share the same base but have different exponents. Each matches one record with a root.'),
  ask: L(
    "Darajani bosing, keyin uyani bosing.",
    'Нажми степень, потом ячейку.',
    'Tap a power, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Ikki savolga javob berdingiz: qanday ildiz va qanday daraja. Maxraj ikki bo'lsa kvadrat ildiz, uch bo'lsa kub ildiz. Surat esa ildiz ostiga daraja qo'yadi: uch bo'lsa beshning kubi, ikki bo'lsa beshning kvadrati. Birinchi yozuvda surat bir, shuning uchun ildiz ostida beshning o'zi qoladi.",
    'Верно. Ты ответил на два вопроса: какой корень и какая степень. Знаменатель два — квадратный корень, три — кубический. А числитель ставит степень под корень: три — куб пяти, два — квадрат пяти. В первой записи числитель единица, поэтому под корнем остаётся сама пятёрка.',
    'Correct. You answered two questions: which root and which power. A denominator of two means the square root, three means the cube root. The numerator puts a power under the root: three gives five cubed, two gives five squared. In the first record the numerator is one, so five itself stays under the root.'),
  wrongs: [
    { when: (s) => s.mate.f2 === 'v3' || s.mate.f3 === 'v2', text: L(
      "Surat va maxraj o'rin almashdi. Ikkinchi darajaning ko'rsatkichi uch ikkidan: maxraj ikki, ya'ni KVADRAT ildiz, ildiz ostida esa beshning kubi. Uchinchisida teskari: ildiz kub, ildiz ostida kvadrat.",
      'Числитель и знаменатель поменялись местами. У второй степени показатель три вторых: знаменатель два, значит корень КВАДРАТНЫЙ, а под корнем куб пяти. У третьей наоборот: корень кубический, а под корнем квадрат.',
      'The numerator and the denominator swapped places. The second power has exponent three halves: the denominator is two, so the root is a SQUARE root and five cubed stands under it. The third is the other way round: a cube root with a square under it.') },
    { when: (s) => s.mate.f1 && s.mate.f1 !== 'v1', text: L(
      "Birinchi darajaning ko'rsatkichi bir ikkidan: maxraj ikki — kvadrat ildiz, surat bir — ildiz ostida daraja yo'q. Ildiz ostida beshning o'zi turishi kerak.",
      'У первой степени показатель одна вторая: знаменатель два — квадратный корень, числитель один — степени под корнем нет. Под корнем должна стоять сама пятёрка.',
      'The first power has exponent one half: the denominator two gives a square root, the numerator one leaves no power under the root. Five itself must stand under the root.') },
    { when: (s) => s.mate.f3 === 'v1' || s.mate.f1 === 'v3', text: L(
      "Ildizning darajasiga qarang: bir yozuvda ildiz belgisi ustida uch turadi, boshqasida hech narsa yo'q — demak u kvadrat ildiz. Ko'rsatkichlarning maxrajini shu bilan solishtiring.",
      'Посмотри на степень корня: в одной записи над знаком корня стоит три, в другой ничего — значит корень квадратный. Сравни с этим знаменатели показателей.',
      'Look at the degree of the root: one record has a three above the root sign, the other has nothing, so it is a square root. Compare the denominators of the exponents with that.') },
  ],
  wrongText: L(
    "Har darajada ikki savol bering: maxraj nima deydi (ildizning darajasi) va surat nima deydi (ildiz ostidagi daraja).",
    'В каждой степени задай два вопроса: что говорит знаменатель (степень корня) и что говорит числитель (степень под корнем).',
    'Ask two questions about every power: what the denominator says (the degree of the root) and what the numerator says (the power under the root).'),
};

export default function D08_04(props) { return <PairSlots data={DATA} {...props} />; }
