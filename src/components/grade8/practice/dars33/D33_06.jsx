// Dars33 · Amaliyot 06 — Tartib · 🟡 · tag: to_standard_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §5 (33-dars, 6-pozitsiya)
//
// TO'RT QADAM: birinchi nolmas raqamni topamiz -> vergulni undan keyin
// qo'yamiz -> necha xona surilganini sanaymiz -> ko'rsatkichni yozamiz.
//
// З67 NING JOYI uchinchi va to'rtinchi qadam orasida: ko'rsatkichni
// SANASHDAN oldin yozish — o'shanda ishora taxminga aylanadi. Xato tartibda
// esa sanashni vergul ko'chirilishidan oldin qo'yish turadi: sanaladigan
// narsa hali yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'to_standard_steps', level: '🟡',
  expr: ['0,00062'], exprSize: 28,
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: ['6'],
      label: L('birinchi nolmas raqamni topamiz', 'находим первую ненулевую цифру', 'find the first non-zero digit') },
    { id: 'l2', tokens: ['6,2'],
      label: L("vergulni undan keyin qo'yamiz", 'ставим запятую после неё', 'put the point after it') },
    { id: 'l3', tokens: ['4 xona'],
      label: L('necha xona surilganini sanaymiz', 'считаем, на сколько разрядов сдвинули', 'count how many places it moved') },
    { id: 'l4', tokens: ['6,2 · 10⁻⁴'],
      label: L("ko'rsatkichni yozamiz", 'записываем показатель', 'write the exponent') },
  ],
  start: ['l3', 'l4', 'l1', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Kichik sonni standart ko'rinishga keltirish to'rt qadamda boradi, lekin qadamlar aralashib ketgan. Ko'rsatkichni yozish oxirgi qadam: undan oldin sanash kerak.",
    'Приведение маленького числа к стандартному виду идёт в четыре шага, но шаги перепутаны. Запись показателя — последний шаг: до него надо сосчитать.',
    'Bringing a small number to standard form takes four steps, but the steps are mixed up. Writing the exponent is the last step: before it you must count.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval birinchi nolmas raqamni topamiz — bu oltilik, chunki undan oldingi nollar sonning kattaligini ko'rsatadi, mantissaga esa kirmaydi. Keyin vergulni oltidan keyin qo'yamiz va olti butun ikki o'ndan ni olamiz: mantissa endi birdan o'ngacha. Undan keyin vergul necha xona surilganini sanaymiz — to'rt xona o'ngga. Va oxirida ko'rsatkichni yozamiz: o'ngga surilgani uni MANFIY qiladi, ya'ni minus to'rt. Ko'rsatkichni sanashdan oldin yozib bo'lmaydi — o'shanda yoziladigan son hali yo'q, va ishora taxminga aylanadi.",
    'Верно. Сначала находим первую ненулевую цифру — это шестёрка, ведь нули перед ней показывают величину числа, а в мантиссу не входят. Потом ставим запятую после шестёрки и получаем шесть целых две десятых: мантисса теперь от одного до десяти. Затем считаем, на сколько разрядов сдвинулась запятая, — на четыре вправо. И в конце записываем показатель: сдвиг вправо делает его ОТРИЦАТЕЛЬНЫМ, то есть минус четыре. Записать показатель до счёта нельзя — тогда записывать нечего, а знак превращается в догадку.',
    'Correct. First we find the first non-zero digit — the six, since the zeros before it show the size of the number and do not belong to the mantissa. Then we put the point after the six and get six point two: the mantissa is now between one and ten. Then we count how many places the point moved — four to the right. And at the end we write the exponent: moving right makes it NEGATIVE, that is minus four. The exponent cannot be written before the counting — there would be nothing to write, and the sign would become a guess.'),
  wrongs: [
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Ko'rsatkichni yozish SANASHDAN keyin bo'ladi. Aks holda yoziladigan son hali yo'q va ishora taxminga aylanadi — aynan shu joyda kichik son uchun musbat ko'rsatkich yozib qo'yiladi. Sanoq esa ikki narsani birdan beradi: kattaligini (to'rt) va ishorasini (o'ngga surildi, demak manfiy).",
      'Запись показателя идёт ПОСЛЕ счёта. Иначе записывать нечего, и знак превращается в догадку — именно здесь у маленького числа появляется положительный показатель. А счёт даёт сразу две вещи: величину (четыре) и знак (сдвиг вправо, значит минус).',
      'Writing the exponent comes AFTER the counting. Otherwise there is nothing to write and the sign becomes a guess — this is exactly where a small number gets a positive exponent. The counting gives two things at once: the size (four) and the sign (moved right, hence negative).') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Xonalarni sanash VERGUL KO'CHIRILGANDAN keyin bo'ladi: sanaladigan narsa — vergulning eski va yangi o'rni orasidagi masofa, va yangi o'rni hali belgilanmagan. Avval mantissani yig'ing, keyin masofani sanang.",
      'Счёт разрядов идёт ПОСЛЕ переноса запятой: считается расстояние между старым и новым местом запятой, а новое место ещё не выбрано. Сначала собери мантиссу, потом считай расстояние.',
      'Counting the places comes AFTER the point is moved: what is counted is the distance between the old and the new position of the point, and the new one has not been chosen yet. Assemble the mantissa first, then count the distance.') },
    { when: (s) => s.seq[0] === 'l4' || s.seq[0] === 'l3', text: L(
      "Ko'rsatkichdan yoki sanoqdan boshlab bo'lmaydi — ular ishning natijasi. Birinchi qadam eng sodda: sonda birinchi nolmas raqamni topish. Aynan u mantissaning birinchi raqami bo'ladi.",
      'Начинать с показателя или со счёта нельзя — они результат работы. Первый шаг самый простой: найти в числе первую ненулевую цифру. Именно она станет первой цифрой мантиссы.',
      'You cannot start with the exponent or the counting — they are the result of the work. The first step is the simplest: find the first non-zero digit in the number. That digit becomes the first digit of the mantissa.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Vergulni qo'yish RAQAM TOPILGANDAN keyin bo'ladi: vergul qaysi raqamdan keyin turishini bilmasdan uni ko'chirib bo'lmaydi. Boshidagi nollar mantissaga kirmaydi, shuning uchun birinchi nolmas raqamni izlash birinchi ish bo'ladi.",
      'Постановка запятой идёт ПОСЛЕ того, как найдена цифра: не зная, после какой цифры она встанет, переносить её нельзя. Нули в начале в мантиссу не входят, поэтому поиск первой ненулевой цифры — первое дело.',
      'Placing the point comes AFTER the digit is found: without knowing which digit it follows, it cannot be moved. The leading zeros do not belong to the mantissa, so finding the first non-zero digit is the first job.') },
  ],
  wrongText: L(
    "Birinchi nolmas raqam birinchi, ko'rsatkich oxirgi. Ko'rsatkichni faqat vergul surilgan xonalarni sanagandan keyin yozish mumkin.",
    'Первая ненулевая цифра первой, показатель последним. Записывать показатель можно только после того, как сосчитаны разряды сдвига.',
    'The first non-zero digit comes first, the exponent last. The exponent can be written only after the places of the shift are counted.'),
};

export default function D33_06(props) { return <SwapOrder data={DATA} {...props} />; }
