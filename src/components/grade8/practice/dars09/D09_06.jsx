// Dars09 · Amaliyot 06 — Tartib · 🟡 · tag: refine_steps · CHIZMALI
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §7 (9-dars, 6-pozitsiya), §4a
//
// Darsning uchinchi tasdig'i: aniqlash TUGAMAYDI. To'rt qadam ildizni
// o'ttiz birning atrofida qisib boradi: avval butun chegaralar, keyin yarim
// qadam, keyin keyingi o'nlik, oxirida yangi chegara.
//
// CHIZMA (metodist qarori 2026-08-24): son o'qida besh va olti, orasida «?».
// Chizma savolni ko'rsatadi, javobni aytmaydi — qadamlarning TARTIBI javob.
// Har qadam KVADRATGA oshirish bilan tekshiriladi (З16).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'refine_steps', level: '🟡',
  expr: [{ fig: 'axis', from: 5, to: 6, step: 0.5, w: 300, h: 50, marks: [{ at: 5.57, q: true }] }],
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: ['25 < 31 < 36'],
      label: L('butun chegaralar', 'целые границы', 'whole bounds') },
    { id: 'l2', tokens: ['5,5² = 30,25'],
      label: L('yarimni tekshiramiz', 'проверяем половину', 'test the half') },
    { id: 'l3', tokens: ['5,6² = 31,36'],
      label: L('keyingisini tekshiramiz', 'проверяем следующее', 'test the next one') },
    { id: 'l4', tokens: ['5,5 < ', { r: '31' }, ' < 5,6'],
      label: L('yangi chegara', 'новая граница', 'the new bound') },
  ],
  start: ['l3', 'l1', 'l4', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "O'ttiz birdan ildiz butun emas: u besh bilan olti orasida turadi. To'rt qadam uni aniqlab boradi, lekin tartibi buzilgan.",
    'Корень из тридцати одного не целый: он лежит между пятью и шестью. Четыре шага уточняют его, но порядок нарушен.',
    'The root of thirty one is not whole: it lies between five and six. Four steps refine it, but their order is broken.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval butun chegaralar: yigirma besh o'ttiz birdan kichik, o'ttiz olti katta — demak ildiz besh bilan olti orasida. Keyin o'rtasini tekshiramiz: besh butun besh o'ndan birning kvadrati o'ttiz butun yigirma besh yuzdan bir, bu o'ttiz birdan KICHIK, ya'ni ildiz undan katta. Keyin besh butun olti o'ndan bir: kvadrati o'ttiz bir butun o'ttiz olti yuzdan bir, bu o'ttiz birdan KATTA. Shunday qilib yangi chegara chiqadi. Bu ish tugamaydi: har qadamda oraliq torayadi, lekin nolga aylanmaydi.",
    'Верно. Сначала целые границы: двадцать пять меньше тридцати одного, тридцать шесть больше — значит корень между пятью и шестью. Потом проверяем середину: квадрат пяти целых пяти десятых это тридцать целых двадцать пять сотых, это МЕНЬШЕ тридцати одного, значит корень больше. Затем пять целых шесть десятых: квадрат тридцать одна целая тридцать шесть сотых, это БОЛЬШЕ. Так выходит новая граница. Эта работа не заканчивается: с каждым шагом промежуток сужается, но в нуль не обращается.',
    'Correct. First the whole bounds: twenty five is less than thirty one, thirty six is more, so the root lies between five and six. Then test the middle: five point five squared is thirty point two five, which is LESS than thirty one, so the root is bigger. Then five point six: its square is thirty one point three six, which is MORE. That gives the new bound. This work never ends: each step narrows the gap but never closes it.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Yangi chegaradan boshlab bo'lmaydi: besh butun besh o'ndan bir va besh butun olti o'ndan bir qaydan olindi? Ular tekshirishdan KEYIN paydo bo'ladi.",
      'Начинать с новой границы нельзя: откуда взялись пять целых пять десятых и пять целых шесть десятых? Они появляются ПОСЛЕ проверки.',
      'You cannot start from the new bound: where did five point five and five point six come from? They appear AFTER the testing.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Tekshirish tartibi ham muhim: avval besh butun besh o'ndan bir olinadi, chunki u oraliqning o'rtasi. Uning kvadrati kichik chiqqandan keyin keyingi qadamga o'tiladi.",
      'Порядок проверок тоже важен: сначала берут пять целых пять десятых, ведь это середина промежутка. Только после того, как её квадрат оказался меньше, переходят к следующему.',
      'The order of the tests matters too: five point five comes first because it is the middle of the interval. Only after its square turns out smaller do you move to the next one.') },
    { when: (s) => s.seq[0] === 'l3' || s.seq[0] === 'l2', text: L(
      "Kasr qadamlardan boshlab bo'lmaydi: besh butun besh o'ndan birni tekshirish uchun ildiz besh bilan olti orasida ekanini bilish kerak. Birinchi qadam — butun chegaralar.",
      'Начинать с дробных шагов нельзя: чтобы проверять пять целых пять десятых, надо знать, что корень между пятью и шестью. Первый шаг — целые границы.',
      'You cannot start from the fractional steps: to test five point five you must already know the root lies between five and six. The first step is the whole bounds.') },
    { when: (s) => s.pos.l1 > s.pos.l2, text: L(
      "Butun chegaralar birinchi turadi: ular qidiruv joyini beradi. Ularsiz qaysi kasrni tekshirish kerakligi ma'lum bo'lmaydi.",
      'Целые границы стоят первыми: они задают место поиска. Без них неизвестно, какую дробь проверять.',
      'The whole bounds come first: they set where to search. Without them there is no telling which fraction to test.') },
  ],
  wrongText: L(
    "Har qadamdan bitta savol so'rang: buni bajarish uchun qaysi son allaqachon ma'lum bo'lishi kerak?",
    'Спроси у каждого шага: какое число должно быть уже известно, чтобы его сделать?',
    'Ask every step: which number must already be known to do it?'),
};

export default function D09_06(props) { return <SwapOrder data={DATA} {...props} />; }
