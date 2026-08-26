// Dars27 · Amaliyot 08 — Tartib · 🔴 · tag: write_interval_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §9 (27-dars, 8-pozitsiya)
//
// YOZUVNI YIG'ISH TARTIBI: chegaralar -> qat'iylik -> qavslar -> yozuv.
// Qavsni QAT'IYLIKNI aniqlashdan oldin tanlash — asosiy xato: o'shanda
// tanlov taxminga aylanadi, va З56 aynan shu joyda tug'iladi.
//
// Yechimning o'zi bu topshiriqda talab qilinmaydi: tengsizliklar tayyor
// (25 va 26-darsning ishi), bu yerda faqat YOZUV yig'iladi.
// Kartada SO'Z asosiy, matematika qisqa dalil, yozuv bo'shliqsiz.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'write_interval_steps', level: '🔴',
  expr: ['x ≥ −2,   x < 5'], exprSize: 22,
  itemSize: 11,
  cards: [
    { id: 'l1', tokens: ['−2; 5'],
      label: L('chegaralarni yozamiz', 'выписываем границы', 'write out the boundaries') },
    { id: 'l2', tokens: ['≥  <'],
      label: L("qat'iyligini aniqlaymiz", 'определяем строгость', 'decide the strictness') },
    { id: 'l3', tokens: ['[  )'],
      label: L('qavslarni tanlaymiz', 'выбираем скобки', 'choose the brackets') },
    { id: 'l4', tokens: ['[−2; 5)'],
      label: L('oraliqni yozamiz', 'записываем промежуток', 'write the range') },
  ],
  start: ['l3', 'l1', 'l4', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Sistemaning yechimi topilgan, endi uni oraliq bilan yozish kerak. Yozuv to'rt qadamda yig'iladi, lekin qadamlar aralashib ketgan.",
    'Решение системы найдено, теперь его надо записать промежутком. Запись собирается в четыре шага, но шаги перепутаны.',
    'The solution of the system has been found; now it must be written as a range. The record is assembled in four steps, but the steps are mixed up.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval chegaralarni yozamiz: minus ikki va besh — ular oraliqning chetlari bo'ladi va tartibi o'zgarmaydi, kichigi chapda turadi. Keyin qat'iylikni aniqlaymiz: chap belgi chiziqli, o'ng belgi qat'iy. Undan keyin qavslarni tanlaymiz: chiziqli belgiga kvadrat qavs, qat'iy belgiga dumaloq qavs. Va oxirida yozuvni yig'amiz: kvadrat qavs, minus ikki, nuqtali vergul, besh, dumaloq qavs. Qavsni qat'iylikdan OLDIN tanlab bo'lmaydi — tanlaydigan narsa hali aniqlanmagan bo'ladi.",
    'Верно. Сначала выписываем границы: минус два и пять — они станут концами промежутка, и порядок их не меняется, меньшая стоит слева. Потом определяем строгость: левый знак с чертой, правый строгий. Затем выбираем скобки: знаку с чертой — квадратная, строгому — круглая. И в конце собираем запись: квадратная скобка, минус два, точка с запятой, пять, круглая скобка. Выбрать скобку ДО определения строгости нельзя — выбирать пока не из чего.',
    'Correct. First write out the boundaries: minus two and five — they will be the ends of the range, and their order does not change, the smaller one on the left. Then decide the strictness: the left sign carries a line, the right is strict. Then choose the brackets: a square one for the sign with a line, a round one for the strict sign. And at the end assemble the record: square bracket, minus two, semicolon, five, round bracket. A bracket cannot be chosen BEFORE the strictness is decided — there is nothing to choose from yet.'),
  wrongs: [
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Qavslarni tanlash QAT'IYLIKNI aniqlagandan keyin bo'ladi. Aks holda tanlov taxminga aylanadi: kvadrat qavsmi yoki dumaloq — buni faqat belgining ostida chiziq bor-yo'qligi hal qiladi. Yozuvning xatosi aynan shu joyda tug'iladi.",
      'Выбор скобок идёт ПОСЛЕ определения строгости. Иначе выбор превращается в догадку: квадратная или круглая — это решает только наличие черты под знаком. Ошибка записи рождается именно здесь.',
      'Choosing the brackets comes AFTER deciding the strictness. Otherwise the choice becomes a guess: square or round is decided solely by whether the sign carries a line. This is exactly where a wrong record is born.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Oraliqni yozish QAVSLAR TANLANGANDAN keyin bo'ladi: yozuvda qavslar turadi, ular esa hali tanlanmagan. Oxirgi qadam — tayyor bo'laklarni bir joyga qo'yish, yangi qaror qabul qilish emas.",
      'Запись промежутка идёт ПОСЛЕ выбора скобок: в записи стоят скобки, а они ещё не выбраны. Последний шаг — сложить готовые части вместе, а не принимать новое решение.',
      'Writing the range comes AFTER the brackets are chosen: the record contains brackets, and they have not been chosen yet. The last step is to put the ready pieces together, not to make a new decision.') },
    { when: (s) => s.seq[0] === 'l3' || s.seq[0] === 'l4', text: L(
      "Qavsdan yoki tayyor yozuvdan boshlab bo'lmaydi — ular ishning natijasi. Birinchi qadam eng sodda: tengsizliklardagi ikki sonni ko'chirib yozish.",
      'Начинать со скобок или с готовой записи нельзя — они результат работы. Первый шаг самый простой: выписать два числа из неравенств.',
      'You cannot start with the brackets or the finished record — they are the result of the work. The first step is the simplest: copy out the two numbers from the inequalities.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Qat'iylikni aniqlash CHEGARALAR yozilgandan keyin bo'ladi: qaysi chegaraga qaysi belgi tegishli ekanini ko'rsatish uchun avval chegaralarning o'zi kerak. Tartib shu sababli qat'iy: har qadam oldingisining natijasini ishlatadi.",
      'Определение строгости идёт ПОСЛЕ того, как выписаны границы: чтобы указать, какой знак относится к какой границе, сначала нужны сами границы. Поэтому порядок и строгий: каждый шаг пользуется результатом предыдущего.',
      'Deciding the strictness comes AFTER the boundaries are written out: to say which sign belongs to which boundary you need the boundaries first. That is why the order is fixed: each step uses the result of the previous one.') },
  ],
  wrongText: L(
    "Chegaralar birinchi, yozuv oxirgi. Qavsni faqat qat'iylik aniqlangandan keyin tanlash mumkin: chiziqli belgi — kvadrat qavs, qat'iy belgi — dumaloq.",
    'Границы первыми, запись последней. Скобку можно выбирать только после того, как определена строгость: знак с чертой — квадратная, строгий — круглая.',
    'The boundaries come first, the record last. A bracket can be chosen only once the strictness is decided: a sign with a line takes a square bracket, a strict sign a round one.'),
};

export default function D27_08(props) { return <SwapOrder data={DATA} {...props} />; }
