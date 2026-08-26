// Dars54 · Amaliyot 08 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §6 (54-dars, 8-pozitsiya)
//
// T1 bitta gapga yig'ilgan. Bankdagi tuzoqlar:
//   «k·|a|»       -> modulsiz koeffitsiyent, manfiy uzunlik beradi
//   «bir xil»     -> uchinchi bo'shliqqa (З114)
//   «perpendikulyar» -> uchinchi yo'l
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L(
      "k·a vektorining moduli",
      'Модуль вектора k·a равен',
      'The modulus of the vector k·a equals') },
    { slot: 0 },
    { text: L(
      "ga teng. Agar k musbat bo'lsa, yo'nalish a bilan",
      '. Если k положительно, направление с a', '. If k is positive, the direction is') },
    { slot: 1 },
    { text: L(
      "bo'ladi, agar k manfiy bo'lsa esa",
      ', а если k отрицательно, то', 'as a, and if k is negative, it is') },
    { slot: 2 },
    { text: L("bo'ladi.", '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('|k|·|a|', 'модулю k на модуль a', 'the modulus of k times the modulus of a') },
    { id: 'w2', label: L('bir xil', 'совпадает', 'the same') },
    { id: 'w3', label: L('teskari', 'противоположно', 'opposite') },
    { id: 'w4', label: L('k·|a|', 'k на модуль a', 'k times the modulus of a') },
    { id: 'w5', label: L('perpendikulyar', 'перпендикулярно', 'perpendicular') },
    { id: 'w6', label: L('nolga teng', 'равно нулю', 'zero') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Songa ko'paytirishning qoidasi bitta gapga yig'ilgan, lekin uchta bo'lak tushib qolgan. Bankda oltita karta. Diqqat: birinchi bo'shliqqa ikki karta juda o'xshaydi, va ular faqat modul belgisi bilan farq qiladi.",
    'Правило умножения на число собрано в одно предложение, но три куска выпали. В банке шесть карточек. Внимание: в первый пропуск очень похожи две карточки, и различаются они лишь знаком модуля.',
    'The rule for multiplying by a number is gathered into one sentence, but three pieces have dropped out. The bank holds six cards. Note: two cards fit the first gap very closely and differ only by the modulus sign.'),
  ask: L(
    "Bo'sh joyni bosing, keyin kartani bosing.",
    'Нажми пропуск, потом карточку.',
    'Tap a gap, then a card.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Qoida ikki qismdan iborat, va ular bir-biriga aralashmaydi. Uzunlik uchun koeffitsiyentning MODULI olinadi, shuning uchun natija har doim musbat. Yo'nalish uchun esa koeffitsiyentning ISHORASI qaraladi: musbat bo'lsa saqlanadi, manfiy bo'lsa teskarilanadi. Manfiy koeffitsiyent shu ikki ishni birga qiladi: strelkani buradi va uni cho'zadi yoki qisqartiradi.",
    'Верно. Правило состоит из двух частей, и они друг с другом не смешиваются. Для длины берётся МОДУЛЬ коэффициента, поэтому результат всегда положителен. А для направления смотрят на ЗНАК коэффициента: положительный — сохраняется, отрицательный — разворачивается. Отрицательный коэффициент делает оба дела сразу: разворачивает стрелку и растягивает или сжимает её.',
    'Correct. The rule has two parts and they do not mix. For the length the MODULUS of the coefficient is taken, so the result is always positive. For the direction the SIGN of the coefficient is read: positive keeps it, negative reverses it. A negative coefficient does both jobs at once: it turns the arrow around and stretches or shrinks it.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Birinchi bo'shliqda modulsiz koeffitsiyent turibdi. Shunda k manfiy bo'lganda chap tomonda modul, o'ng tomonda esa manfiy son chiqadi — bu bo'lishi mumkin emas, chunki modul uzunlikni bildiradi. Formulada koeffitsiyent modul ostiga kirishi shart, ana shunda natija har doim musbat bo'ladi.",
      'В первом пропуске стоит коэффициент без модуля. Тогда при отрицательном k слева окажется модуль, а справа отрицательное число — так быть не может, ведь модуль означает длину. В формуле коэффициент обязан входить под модуль, и тогда результат всегда положителен.',
      'The first gap holds the coefficient without a modulus. Then for a negative k the left side is a modulus and the right side a negative number — impossible, since a modulus means a length. In the formula the coefficient must go under the modulus, and then the result is always positive.') },
    { when: (s) => s.slots[2] === 'w2', text: L(
      "Uchinchi bo'shliqda «bir xil» turibdi, ya'ni gap manfiy koeffitsiyent yo'nalishni o'zgartirmaydi deb aytmoqda. Bu darsning eng qimmat xatosi. Manfiy koeffitsiyent aynan yo'nalishni buradi: minus a a ga qarama-qarshi vektor, ular ustma-ust tushmaydi.",
      'В третьем пропуске стоит «совпадает», то есть предложение говорит, будто отрицательный коэффициент направление не меняет. Это самая дорогая ошибка урока. Отрицательный коэффициент как раз разворачивает направление: минус a это вектор, противоположный a, они не совпадают.',
      'The third gap holds «the same», so the sentence says a negative coefficient does not change the direction. This is the costliest error of the lesson. A negative coefficient is precisely what reverses the direction: minus a is the vector opposite to a, and they do not coincide.') },
    { when: (s) => s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Songa ko'paytirish vektorni burmaydi va nolga aylantirmaydi. U faqat ikki narsani qiladi: uzunlikni o'zgartiradi va kerak bo'lsa teskari buradi. Natija a bilan har doim BIR CHIZIQDA yotadi, ya'ni kollinear bo'ladi. Nol faqat koeffitsiyent nolga teng bo'lganda chiqadi.",
      'Умножение на число не поворачивает вектор вбок и не обращает его в ноль. Оно делает лишь два дела: меняет длину и при надобности разворачивает. Результат всегда лежит с a на ОДНОЙ ПРЯМОЙ, то есть коллинеарен. Ноль получается только при нулевом коэффициенте.',
      'Multiplying by a number does not turn a vector sideways or make it zero. It does two things only: changes the length and reverses when needed. The result always lies along the SAME LINE as a, that is, it is collinear. Zero comes out only when the coefficient is zero.') },
  ],
  wrongText: L(
    "Uzunlik uchun koeffitsiyentning moduli, yo'nalish uchun uning ishorasi olinadi.",
    'Для длины берётся модуль коэффициента, для направления его знак.',
    'For the length the modulus of the coefficient is taken, for the direction its sign.'),
};

export default function D54_08(props) { return <ClozeBank data={DATA} {...props} />; }
