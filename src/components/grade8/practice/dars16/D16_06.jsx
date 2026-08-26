// Dars16 · Amaliyot 06 — Tartib · 🟡 · tag: factor_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §4 (16-dars, 6-pozitsiya)
//
// TO'RT QADAM VA ULARNING ORASIDAGI QOIDA. Ikkinchi karta — hisob emas,
// ASOS: ko'paytma nolga aylanadi, agar ko'paytuvchilardan biri nol bo'lsa.
// Aynan shu qoida ikki ildizni beradi, va aynan shuni tashlab ketgan o'quvchi
// x ga bo'lish yo'liga o'tadi (З42).
//
// Boshlang'ich tartib QAT'IY (`start`), tasodifiy emas: aralashtirish ba'zan
// to'g'ri tartibni berib qo'yardi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'factor_steps', level: '🟡',
  expr: ['5z² − 15z = 0'], exprSize: 26,
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: ['5z(z − 3) = 0'],
      label: L("umumiy ko'paytuvchini chiqaramiz", 'выносим общий множитель', 'take out the common factor') },
    { id: 'l2', tokens: ["ko'paytma = 0"],
      label: L("bittasi nol bo'lsa yetadi", 'достаточно одного нуля', 'one zero factor is enough') },
    { id: 'l3', tokens: ['5z = 0', ';', 'z − 3 = 0'],
      label: L('har birini nolga tenglaymiz', 'приравниваем каждый к нулю', 'set each factor to zero') },
    { id: 'l4', tokens: ['z = 0', ';', 'z = 3'],
      label: L('ikki ildizni yozamiz', 'записываем два корня', 'write the two roots') },
  ],
  start: ['l3', 'l4', 'l1', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Bu tenglamada ozod had yo'q. Uni yechishning to'rt qadami bir qatorda turadi, lekin tartibi buzilgan. Qadamlardan biri hisob emas, QOIDA.",
    'В этом уравнении нет свободного члена. Четыре шага его решения стоят в одну строку, но порядок нарушен. Один из шагов — не вычисление, а ПРАВИЛО.',
    'This equation has no constant term. The four steps of solving it stand in one row with their order broken. One of the steps is not a computation but a RULE.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval umumiy ko'paytuvchi chiqariladi: besh z karra qavs ichida z minus uch. Keyin qoida ishlaydi — ko'paytma nolga aylanadi, agar ko'paytuvchilardan biri nol bo'lsa. Shundan keyin har ko'paytuvchi alohida nolga tenglanadi, va faqat oxirida ikki ildiz yoziladi: nol va uch. Tekshirish: nolda nol minus nol nol; uchda qirq besh minus qirq besh nol.",
    'Верно. Сначала выносится общий множитель: пять z на скобку z минус три. Потом работает правило — произведение обращается в нуль, если хотя бы один множитель нуль. Затем каждый множитель приравнивается к нулю по отдельности, и лишь в конце записываются два корня: нуль и три. Проверка: в нуле нуль минус нуль нуль; в трёх сорок пять минус сорок пять нуль.',
    'Correct. First the common factor comes out: five z times the bracket z minus three. Then the rule works — a product is zero when one of its factors is zero. Then each factor is set to zero separately, and only at the end the two roots are written: zero and three. Check: at zero, zero minus zero is zero; at three, forty five minus forty five is zero.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Ildizlardan boshlab bo'lmaydi: nol va uch qaydan chiqqani hali ko'rsatilmagan. Ildiz — natija, birinchi qadam emas. Yozuv javobni ISBOTLASHI kerak.",
      'Начинать с корней нельзя: откуда взялись нуль и три, ещё не показано. Корень — результат, а не первый шаг. Запись должна ДОКАЗЫВАТЬ ответ.',
      'You cannot start with the roots: where zero and three came from has not been shown yet. A root is a result, not a first step. The record must PROVE the answer.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Ko'paytuvchilarni nolga tenglash uchun ASOS kerak: nima uchun ulardan birini nolga tenglash mumkin? Chunki ko'paytma faqat shunday holda nolga aylanadi. Qoida hisobdan OLDIN turishi kerak, aks holda qadam sababsiz qoladi.",
      'Чтобы приравнивать множители к нулю, нужно ОСНОВАНИЕ: почему вообще можно приравнять один из них? Потому что произведение обращается в нуль только так. Правило должно стоять ПЕРЕД вычислением, иначе шаг остаётся без причины.',
      'To set the factors to zero you need a REASON: why may one of them be set to zero at all? Because that is the only way a product becomes zero. The rule must come BEFORE the computation, otherwise the step has no ground.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Qoida KO'PAYTMA haqida, ko'paytma esa hali yo'q: dastlabki yozuvda ayirma turadi. Avval umumiy ko'paytuvchini chiqarish kerak — o'shanda ikki ko'paytuvchi paydo bo'ladi va qoidani qo'llash mumkin bo'ladi.",
      'Правило про ПРОИЗВЕДЕНИЕ, а произведения ещё нет: в исходной записи стоит разность. Сначала надо вынести общий множитель — тогда появятся два множителя и правило станет применимым.',
      'The rule is about a PRODUCT, and there is no product yet: the original record holds a difference. The common factor must come out first — then two factors appear and the rule becomes applicable.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Nol va uch — bu ikki tenglamaning yechimlari: besh z nolga teng va z minus uch nolga teng. Demak o'sha ikki tenglama oldin yozilishi kerak.",
      'Нуль и три — решения двух уравнений: пять z равно нулю и z минус три равно нулю. Значит эти два уравнения должны быть записаны раньше.',
      'Zero and three are the solutions of two equations: five z equals zero and z minus three equals zero. So those two equations must be written earlier.') },
  ],
  wrongText: L(
    "Har qadamdan so'rang: buni bajarish uchun nima allaqachon yozilgan bo'lishi kerak? Qoida esa o'zi asoslaydigan hisobdan oldin turadi.",
    'Спроси у каждого шага: что должно быть уже записано, чтобы его сделать? А правило стоит перед тем вычислением, которое оно обосновывает.',
    'Ask every step: what must already be written to do it? And a rule stands before the computation it justifies.'),
};

export default function D16_06(props) { return <SwapOrder data={DATA} {...props} />; }
