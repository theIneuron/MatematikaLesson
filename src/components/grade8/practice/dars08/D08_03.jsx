// Dars08 · Amaliyot 03 — Qiymat · 🟢 · tag: power_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §6 (8-dars, 3-pozitsiya)
//
// 64 ning ikki uchdan bir ko'rsatkichli darajasi. Ikki qadam: kub ildiz (4),
// keyin kvadrat (16). Xato javoblar ikki qadamning har birida to'xtash yoki
// ko'rsatkichni amal deb olishdan chiqadi:
//   4   — faqat ildiz olindi, daraja qoldi;
//   8   — yarim ko'rsatkich deb olindi (kvadrat ildiz);
//   128 — 64 ni ikkiga ko'paytirish;
//   32  — 64 ni ikkiga bo'lish.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'power_value', level: '🟢',
  target: 16, allowNeg: false,
  expr: [{ b: '64', e: { n: '2', d: '3' } }], exprSize: 34,
  eyebrow: L('Qiymat', 'Значение', 'Value'),
  setup: L(
    "Ko'rsatkichning maxraji ildizning darajasini beradi, surati esa ildiz ostidagi darajani. Ikki qadam ikki xil ish qiladi.",
    'Знаменатель показателя задаёт степень корня, а числитель степень подкоренного. Два шага делают две разные работы.',
    'The denominator of the exponent gives the degree of the root, the numerator the power of the radicand. Two steps do two different jobs.'),
  label: L('qiymati', 'значение', 'the value'),
  ask: L('Bu daraja nimaga teng?', 'Чему равна эта степень?', 'What does this power equal?'),
  correctText: L(
    "To'g'ri. Maxraj uch — kub ildiz olinadi: to'rt karra to'rt karra to'rt oltmish to'rt, demak ildiz to'rt. Surat ikki — to'rtni kvadratga oshiramiz va o'n olti chiqadi. Tartibni almashtirsa ham javob o'sha: oltmish to'rt kvadratga oshirilsa to'rt ming to'qqiz yuz to'qson olti, uning kub ildizi ham o'n olti.",
    'Верно. Знаменатель три — берём кубический корень: четыре на четыре на четыре шестьдесят четыре, значит корень четыре. Числитель два — возводим четыре в квадрат и получаем шестнадцать. Порядок можно и поменять: шестьдесят четыре в квадрате это четыре тысячи девяносто шесть, и его кубический корень тоже шестнадцать.',
    'Correct. The denominator is three, so take the cube root: four times four times four is sixty four, so the root is four. The numerator is two, so square the four and get sixteen. The order can be swapped: sixty four squared is four thousand ninety six, and its cube root is sixteen as well.'),
  wrongs: [
    { when: (s) => s.value === 4, text: L(
      "Ildiz to'g'ri olingan, lekin daraja qolib ketdi. Ko'rsatkichning surati ikki, ya'ni ildizdan keyin natijani kvadratga oshirish kerak. To'rt karra to'rt qancha?",
      'Корень взят верно, но степень осталась. Числитель показателя два, значит после корня результат надо возвести в квадрат. Сколько будет четыре на четыре?',
      'The root is right, but the power was left out. The numerator of the exponent is two, so after the root the result must be squared. What is four times four?') },
    { when: (s) => s.value === 8, text: L(
      "Bu kvadrat ildizning javobi: sakkiz karra sakkiz oltmish to'rt. Lekin ko'rsatkichning maxraji ikki emas, UCH — demak ildiz kub ildiz bo'ladi.",
      'Это ответ квадратного корня: восемь на восемь шестьдесят четыре. Но в знаменателе показателя не два, а ТРИ — значит корень кубический.',
      'That is the square root answer: eight times eight is sixty four. But the denominator of the exponent is not two, it is THREE, so the root is a cube root.') },
    { when: (s) => s.value === 128 || s.value === 32, text: L(
      "Ko'rsatkich ko'paytiruvchi ham, bo'luvchi ham emas. U ikki ish buyuradi: qanday ildiz olish va natijani qanday darajaga oshirish. Oltmish to'rtdan kub ildiz oling, keyin javobni kvadratga oshiring.",
      'Показатель не множитель и не делитель. Он говорит две вещи: какой корень взять и в какую степень возвести результат. Возьми кубический корень из шестидесяти четырёх, потом возведи ответ в квадрат.',
      'The exponent is neither a multiplier nor a divisor. It says two things: which root to take and to which power to raise the result. Take the cube root of sixty four, then square the answer.') },
    { when: (s) => s.value === 64, text: L(
      "Bu asosning o'zi: daraja umuman bajarilmadi. Maxraj uch — kub ildiz, surat ikki — kvadrat. Ikki qadam ham kerak.",
      'Это само основание: степень вообще не выполнена. Знаменатель три — кубический корень, числитель два — квадрат. Нужны оба шага.',
      'That is the base itself: the power was not applied at all. The denominator is three for the cube root, the numerator is two for the square. Both steps are needed.') },
  ],
  wrongText: L(
    "Ikki qadamda ishlang: avval maxraj aytgan ildizni oling, keyin natijani surat aytgan darajaga oshiring.",
    'Работай в два шага: сначала возьми корень, который назвал знаменатель, потом возведи результат в степень, которую назвал числитель.',
    'Work in two steps: first take the root the denominator names, then raise the result to the power the numerator names.'),
};

export default function D08_03(props) { return <TypeValue data={DATA} {...props} />; }
