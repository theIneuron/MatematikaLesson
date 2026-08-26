// Dars24 · Amaliyot 06 — Tartib · 🟡 · tag: divide_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §6 (24-dars, 6-pozitsiya)
//
// T3: BO'LISH KO'PAYTIRISHDAN FARQ QILMAYDI. Qadamlar: bo'lish, ishorani
// burish, javob, tekshirish. Ishorani burish ALOHIDA qadam bo'lib turadi —
// aynan shu narsa amalning ichida yashiringan holda unutiladi (З52).
//
// Oxirgi qadam — З16: javob SON bilan tekshiriladi. Minus to'rtni qo'ysangiz
// sakkiz oltidan katta chiqadi, ya'ni javob ishlaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'divide_steps', level: '🟡',
  expr: ['−2a > 6'], exprSize: 26,
  itemSize: 11,
  cards: [
    { id: 'l1', tokens: [':(−2)'],
      label: L("ikkala qismni −2 ga bo'lamiz", 'делим обе части на −2', 'divide both sides by −2') },
    { id: 'l2', tokens: ['> → <'],
      label: L('ishorani buramiz', 'переворачиваем знак', 'flip the sign') },
    { id: 'l3', tokens: ['a<−3'],
      label: L('javobni yozamiz', 'записываем ответ', 'write the answer') },
    { id: 'l4', tokens: ['a=−4: 8>6'],
      label: L('son bilan tekshiramiz', 'проверяем числом', 'check with a number') },
  ],
  start: ['l2', 'l1', 'l4', 'l3'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Tengsizlikdan a ni topish kerak. Yechim to'rt qadamdan iborat, lekin qadamlar aralashib ketgan.",
    'Из неравенства надо найти a. Решение состоит из четырёх шагов, но шаги перепутаны.',
    'The value of a must be found from the inequality. The solution has four steps, but the steps are mixed up.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval bo'lish, keyin ishorani burish — bo'luvchi manfiy. Undan keyin javob: a minus uchdan kichik. Va oxirida tekshirish: a minus to'rt bo'lsa, minus ikki karra minus to'rt sakkiz, sakkiz oltidan katta. Burish alohida qadam bo'lishi kerak — bo'lishning ichida yashiringan holda u unutiladi.",
    'Верно. Сначала деление, потом переворот знака — делитель отрицателен. Затем ответ: a меньше минус трёх. И в конце проверка: при a равном минус четырём минус два на минус четыре восемь, восемь больше шести. Переворот должен быть отдельным шагом — спрятанным внутри деления его забывают.',
    'Correct. First the division, then the flip — the divisor is negative. Then the answer: a is less than minus three. And at the end the check: at a equal to minus four, minus two times minus four is eight, and eight is greater than six. The flip must be a separate step — hidden inside the division it gets forgotten.'),
  wrongs: [
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Ishorani burish BO'LISHDAN keyin bo'ladi: hali hech narsa qilinmagan bo'lsa, burishga sabab yo'q. Burish — bo'lishning natijasi, chunki uni bo'luvchining ISHORASI keltirib chiqaradi. Musbat songa bo'linganda bu qadam umuman bo'lmaydi.",
      'Переворот знака идёт ПОСЛЕ деления: пока ничего не сделано, переворачивать не из-за чего. Переворот — следствие деления, ведь его вызывает ЗНАК делителя. При делении на положительное этого шага не бывает вовсе.',
      'The flip comes AFTER the division: while nothing has been done there is no reason to flip. The flip is a consequence of the division, since it is caused by the SIGN of the divisor. When dividing by a positive number this step does not occur at all.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Tekshirish JAVOBDAN keyin turadi: minus to'rtni qayerdan olish kerakligi javobsiz noma'lum. Avval a minus uchdan kichik degan xulosa chiqadi, keyin undan biror son olinadi va dastlabki tengsizlikka qo'yiladi.",
      'Проверка идёт ПОСЛЕ ответа: без ответа непонятно, откуда взять минус четыре. Сначала выходит вывод, что a меньше минус трёх, потом из него берут какое-нибудь число и подставляют в исходное неравенство.',
      'The check comes AFTER the answer: without the answer it is unclear where minus four should come from. First the conclusion that a is less than minus three, then a number is taken from it and substituted into the original inequality.') },
    { when: (s) => s.seq[0] === 'l3' || s.seq[0] === 'l4', text: L(
      "Javobdan yoki tekshirishdan boshlab bo'lmaydi — ular ishning natijasi. Yechim har doim AMALDAN boshlanadi: bu yerda ikkala qismni koeffitsiyentga bo'lish.",
      'Начинать с ответа или с проверки нельзя — они результат работы. Решение всегда начинается с ДЕЙСТВИЯ: здесь это деление обеих частей на коэффициент.',
      'You cannot start with the answer or the check — they are the result of the work. A solution always starts with an OPERATION: here, dividing both sides by the coefficient.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Javob ishorani burgandan KEYIN yoziladi. Aks holda a minus uchdan katta degan yozuv chiqadi, va u xato: minus to'rtni qo'ysangiz dastlabki tengsizlik bajariladi, minus ikkini qo'ysangiz esa yo'q.",
      'Ответ пишется ПОСЛЕ переворота знака. Иначе выйдет запись, что a больше минус трёх, и она неверна: подставь минус четыре — исходное неравенство выполняется, подставь минус два — нет.',
      'The answer is written AFTER the flip. Otherwise you get the record that a is greater than minus three, and it is wrong: substitute minus four and the original inequality holds, substitute minus two and it does not.') },
  ],
  wrongText: L(
    "Avval bo'lish, keyin ishorani burish, keyin javob, oxirida tekshirish. Burish alohida qadam: uni bo'luvchining ishorasi keltirib chiqaradi.",
    'Сначала деление, потом переворот знака, потом ответ, в конце проверка. Переворот — отдельный шаг: его вызывает знак делителя.',
    'First the division, then the flip, then the answer, and the check at the end. The flip is a separate step caused by the sign of the divisor.'),
};

export default function D24_06(props) { return <SwapOrder data={DATA} {...props} />; }
