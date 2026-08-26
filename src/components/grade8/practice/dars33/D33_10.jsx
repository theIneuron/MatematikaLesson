// Dars33 · Amaliyot 10 — Pazl · 🔴 · tag: standard_to_number
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §5 (33-dars, 10-pozitsiya)
//
// TESKARI YO'NALISH: yozuvdan songa. Uch yozuvda o'sha mantissa — 2,5, —
// farq esa faqat ko'rsatkichda: uch, minus uch va nol.
//
// Uchinchisi 31-darsning davomi: o'nning nolinchi darajasi birga teng, ya'ni
// ko'paytuvchi hech narsani o'zgartirmaydi va son o'zi bo'lib qolaveradi.
// Kartalarda yozuv bo'shliqsiz (skelet §0a.5).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'standard_to_number', level: '🔴',
  faceSize: 12, faceSizePhone: 10,
  cards: [
    { id: 'f1', side: 0, tokens: ['2,5·10³'] },
    { id: 'f2', side: 0, tokens: ['2,5·10⁻³'] },
    { id: 'f3', side: 0, tokens: ['2,5·10⁰'] },
    { id: 'v1', side: 1, v: '2500' },
    { id: 'v2', side: 1, v: '0,0025' },
    { id: 'v3', side: 1, v: '2,5' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch yozuvda bir xil mantissa turibdi — ikki butun besh o'ndan. Farq faqat ko'rsatkichda, va uni oddiy songa ochish kerak.",
    'В трёх записях стоит одна и та же мантисса — два целых пять десятых. Различие только в показателе, и запись надо раскрыть в обычное число.',
    'The three records hold the same mantissa — two point five. They differ only in the exponent, and each must be unfolded into an ordinary number.'),
  ask: L(
    'Yozuvni bosing, keyin uyani bosing.',
    'Нажми запись, потом ячейку.',
    'Tap a record, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Musbat ko'rsatkich vergulni O'NGGA suradi: uch xona o'ngga — ikki ming besh yuz. Manfiy ko'rsatkich chapga suradi: uch xona chapga — nol butun nol nol yigirma besh. Nolinchi daraja esa hech narsa qilmaydi, chunki o'nning nolinchi darajasi birga teng, va songa birni ko'paytirish uni o'zgartirmaydi — ikki butun besh o'ndan o'zi bo'lib qolaveradi. Uch yozuv, bitta mantissa, va sonlar million baravar farq qiladi: yo'nalishni faqat ko'rsatkichning ishorasi beradi.",
    'Верно. Положительный показатель сдвигает запятую ВПРАВО: на три разряда — две тысячи пятьсот. Отрицательный сдвигает влево: на три разряда — нуль целых двадцать пять десятитысячных. А нулевая степень не делает ничего, ведь десять в нулевой равно единице, и умножение на единицу число не меняет — два целых пять десятых так и остаются собой. Три записи, одна мантисса, а числа отличаются в миллион раз: направление задаёт только знак показателя.',
    'Correct. A positive exponent moves the point RIGHT: three places — two thousand five hundred. A negative one moves it left: three places — zero point zero zero two five. And the zero power does nothing, since ten to the zero is one and multiplying by one changes nothing — two point five stays itself. Three records, one mantissa, and the numbers differ a millionfold: only the sign of the exponent gives the direction.'),
  wrongs: [
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Uchinchi yozuvda ko'rsatkich NOL, va o'nning nolinchi darajasi birga teng (31-dars). Songa birni ko'paytirish hech narsani o'zgartirmaydi, ya'ni javob mantissaning o'zi. Vergul umuman surilmaydi: surish uchun ko'rsatkich noldan farqli bo'lishi kerak edi.",
      'В третьей записи показатель НУЛЕВОЙ, а десять в нулевой равно единице (урок 31). Умножение на единицу ничего не меняет, значит ответ — сама мантисса. Запятая не сдвигается вовсе: чтобы сдвигать, показатель должен быть отличен от нуля.',
      'In the third record the exponent is ZERO, and ten to the zero is one (lesson 31). Multiplying by one changes nothing, so the answer is the mantissa itself. The point does not move at all: to move it the exponent would have to be non-zero.') },
    { when: (s) => s.mate.f1 === 'v2' || s.mate.f2 === 'v1', text: L(
      "Bu ikki yozuv almashib ketdi, va farq faqat ISHORADA. Musbat ko'rsatkich sonni kattalashtiradi — vergul o'ngga suriladi va ikki ming besh yuz chiqadi. Manfiy ko'rsatkich kichraytiradi — vergul chapga suriladi va birdan kichik son chiqadi. Javobni tanlashdan oldin bitta savol bering: natija berilgan mantissadan katta bo'ladimi yoki kichik.",
      'Эти две записи поменялись местами, а различие только в ЗНАКЕ. Положительный показатель число увеличивает — запятая идёт вправо и получается две тысячи пятьсот. Отрицательный уменьшает — запятая идёт влево и получается число меньше единицы. Перед выбором ответа задай один вопрос: результат будет больше данной мантиссы или меньше.',
      'These two records were swapped, and they differ only in the SIGN. A positive exponent makes the number larger — the point goes right and gives two thousand five hundred. A negative one makes it smaller — the point goes left and gives a number below one. Before choosing, ask one question: will the result be larger or smaller than the given mantissa.') },
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Ikkinchi yozuvda ko'rsatkich manfiy uch, ya'ni vergul UCH xona chapga suriladi. Bosqichma-bosqich yuring: ikki butun besh o'ndan, nol butun yigirma besh yuzdan, nol butun nol ikki besh mingdan, nol butun nol nol yigirma besh o'n mingdan. Har qadam sonni o'n baravar kichraytiradi, va uch qadamdan keyin u ming baravar kichik bo'ladi.",
      'Во второй записи показатель минус три, значит запятая сдвигается на ТРИ разряда влево. Иди по шагам: два целых пять десятых, нуль целых двадцать пять сотых, нуль целых двадцать пять тысячных, нуль целых двадцать пять десятитысячных. Каждый шаг уменьшает число в десять раз, и после трёх шагов оно меньше в тысячу раз.',
      'In the second record the exponent is minus three, so the point moves THREE places left. Go step by step: two point five, zero point two five, zero point zero two five, zero point zero zero two five. Each step makes the number ten times smaller, and after three steps it is a thousand times smaller.') },
  ],
  wrongText: L(
    "Ishora yo'nalishni beradi: musbat bo'lsa vergul o'ngga, manfiy bo'lsa chapga suriladi. Ko'rsatkichning moduli esa necha xona surilishini aytadi.",
    'Знак задаёт направление: при положительном запятая идёт вправо, при отрицательном влево. А модуль показателя говорит, на сколько разрядов.',
    'The sign gives the direction: positive moves the point right, negative moves it left. The size of the exponent says how many places.'),
};

export default function D33_10(props) { return <PairSlots data={DATA} {...props} />; }
