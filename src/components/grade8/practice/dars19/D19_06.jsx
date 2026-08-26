// Dars19 · Amaliyot 06 — Tartib · 🟡 · tag: vieta_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §7 (19-dars, 6-pozitsiya)
//
// TANLASH USULINING TO'RT QADAMI. Ikkinchi qadam — ISHORA TAHLILI, va u
// hisobdan oldin turadi: ko'paytma manfiy bo'lsa, ildizlar ishorasi har xil
// bo'lishi ALDINDAN ma'lum, va shu bilan tekshirish kerak bo'lgan juftliklar
// soni ikki barobar kamayadi.
//
// З46 shu yerda: juftlikni faqat ko'paytma bo'yicha topib, yig'indi bilan
// tekshirmaslik. Bir va o'n besh ham ko'paytmani beradi (minus bir va o'n
// besh), lekin ularning yig'indisi o'n to'rt, minus ikki emas.
// Boshlang'ich tartib QAT'IY (`start`).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'vieta_steps', level: '🟡',
  expr: ['x² + 2x − 15 = 0'], exprSize: 26,
  itemSize: 11,
  cards: [
    { id: 'l1', tokens: ["yig'indi −2, ko'paytma −15"],
      label: L('teoremani yozamiz', 'записываем теорему', 'write the theorem') },
    { id: 'l2', tokens: ["ishoralar har xil"],
      label: L("ko'paytma manfiy", 'произведение отрицательно', 'the product is negative') },
    { id: 'l3', tokens: ['1 · 15', ';', '3 · 5'],
      label: L("15 ning juftliklari", 'пары для 15', 'the pairs for 15') },
    { id: 'l4', tokens: ['3', ';', '−5'],
      label: L("yig'indisi −2 bo'lgan juftlik", 'пара с суммой −2', 'the pair summing to −2') },
  ],
  start: ['l4', 'l3', 'l2', 'l1'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Tanlash usulining to'rt qadami bir qatorda turadi, lekin tartibi buzilgan. Qadamlardan biri hisob emas, ISHORA tahlili — u tekshirishni qisqartiradi.",
    'Четыре шага способа подбора стоят в одну строку, но порядок нарушен. Один из шагов — не вычисление, а разбор ЗНАКА: он сокращает перебор.',
    'The four steps of the selection method stand in one row with their order broken. One of the steps is not a computation but a SIGN analysis: it shortens the search.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval teorema yoziladi: yig'indi minus p, ya'ni minus ikki; ko'paytma q, ya'ni minus o'n besh. Keyin ishora tahlili: ko'paytma MANFIY, demak ildizlar ishorasi har xil — bu tekshirishni ikki barobar qisqartiradi. Undan keyin o'n beshning juftliklari yoziladi: bir bilan o'n besh, uch bilan besh. Va faqat oxirida yig'indi bo'yicha tanlanadi: uch va minus besh, chunki uch minus besh minus ikki.",
    'Верно. Сначала записывается теорема: сумма минус p, то есть минус два; произведение q, то есть минус пятнадцать. Потом разбор знака: произведение ОТРИЦАТЕЛЬНО, значит знаки корней разные — это вдвое сокращает перебор. Затем выписываются пары для пятнадцати: один и пятнадцать, три и пять. И только в конце выбирается по сумме: три и минус пять, ведь три минус пять минус два.',
    'Correct. First the theorem is written: the sum is minus p, that is minus two; the product is q, that is minus fifteen. Then the sign analysis: the product is NEGATIVE, so the roots have different signs — which halves the search. Then the pairs for fifteen are listed: one and fifteen, three and five. And only at the end the choice by sum: three and minus five, since three minus five is minus two.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Javobdan boshlab bo'lmaydi: uch va minus besh qaydan chiqqani hali ko'rsatilmagan. Juftlik ko'paytma va yig'indidan topiladi, ular esa teoremadan.",
      'Начинать с ответа нельзя: откуда взялись три и минус пять, ещё не показано. Пара находится из произведения и суммы, а они — из теоремы.',
      'You cannot start with the answer: where three and minus five came from has not been shown. The pair follows from the product and the sum, and those follow from the theorem.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Ishora tahlili juftliklarni yozishdan OLDIN turadi, va shuning uchun foydali: ko'paytma manfiy ekanini bilsangiz, ikki musbat sonni sinab ko'rish kerak emas. Tahlilni keyinga surish uni ma'nosiz qiladi.",
      'Разбор знака стоит ДО выписывания пар, и потому он полезен: зная, что произведение отрицательно, не нужно перебирать два положительных числа. Отложенный разбор теряет смысл.',
      'The sign analysis comes BEFORE listing the pairs, and that is what makes it useful: knowing the product is negative saves you from testing two positive numbers. Deferring it makes it pointless.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Ishora tahlili KO'PAYTMANING ishorasiga tayanadi, ko'paytmani esa teorema beradi. Demak teorema oldin yozilishi kerak: yig'indi minus ikki, ko'paytma minus o'n besh.",
      'Разбор знака опирается на знак ПРОИЗВЕДЕНИЯ, а произведение даёт теорема. Значит теорему надо записать раньше: сумма минус два, произведение минус пятнадцать.',
      'The sign analysis relies on the sign of the PRODUCT, and the product comes from the theorem. So the theorem must be written first: the sum is minus two, the product minus fifteen.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Yig'indi bo'yicha tanlash uchun tanlaydigan JUFTLIKLAR bo'lishi kerak. O'n beshning juftliklari avval yoziladi, keyin ular ichidan yig'indisi minus ikki bo'lgani olinadi: uch va minus besh. Bir bilan o'n besh ham ko'paytmani beradi, lekin yig'indisi to'g'ri kelmaydi.",
      'Чтобы выбирать по сумме, нужны ПАРЫ, из которых выбирать. Пары для пятнадцати выписываются раньше, а потом из них берётся та, чья сумма минус два: три и минус пять. Один и пятнадцать тоже дают произведение, но сумма не совпадает.',
      'To choose by sum you need PAIRS to choose from. The pairs for fifteen are listed first, then the one summing to minus two is taken: three and minus five. One and fifteen give the product too, but their sum does not match.') },
  ],
  wrongText: L(
    "Har qadamdan so'rang: buni bajarish uchun nima allaqachon yozilgan bo'lishi kerak? Ishora tahlili esa juftliklardan oldin turadi — u tekshirishni qisqartiradi.",
    'Спроси у каждого шага: что должно быть уже записано, чтобы его сделать? А разбор знака стоит до пар — он сокращает перебор.',
    'Ask every step: what must already be written to do it? And the sign analysis comes before the pairs — it shortens the search.'),
};

export default function D19_06(props) { return <SwapOrder data={DATA} {...props} />; }
