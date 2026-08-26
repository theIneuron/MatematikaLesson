// Dars18 · Amaliyot 08 — Tartib · 🔴 · tag: count_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §6 (18-dars, 8-pozitsiya)
//
// XULOSA OXIRIDA TURADI (З16). Ildizlar sonini aytish uchun D ning QIYMATI
// kerak, va u ikki qadamda topiladi: koeffitsiyentlarni yozib olish, keyin
// hisoblash. Xulosani yuqoriga surgan o'quvchi javobni taxmin qiladi —
// yozuvda uni tasdiqlaydigan narsa qolmaydi.
//
// Ikkinchi karta ataylab yarim hisob: «o'ttiz olti minus qirq» — bu D ning
// yozuvi, qiymati esa uchinchi kartada. Shu ikkisini almashtirish ham xato,
// va razbor buni alohida aytadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'count_steps', level: '🔴',
  expr: ['2x² − 6x + 5 = 0'], exprSize: 26,
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: ['a = 2, b = −6, c = 5'],
      label: L('koeffitsiyentlarni yozamiz', 'выписываем коэффициенты', 'write the coefficients') },
    { id: 'l2', tokens: ['D = 36 − 40'],
      label: L('formulaga qo\'yamiz', 'подставляем в формулу', 'put them into the formula') },
    { id: 'l3', tokens: ['D = −4'],
      label: L('qiymatni hisoblaymiz', 'считаем значение', 'compute the value') },
    { id: 'l4', tokens: ["ildiz yo'q"],
      label: L('xulosa chiqaramiz', 'делаем вывод', 'draw the conclusion') },
  ],
  start: ['l4', 'l3', 'l1', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Ildizlar sonini aniqlashning to'rt qadami bir qatorda turadi, lekin tartibi buzilgan. Ikkita karta diskriminant haqida: biri yozuv, ikkinchisi qiymat.",
    'Четыре шага определения числа корней стоят в одну строку, но порядок нарушен. Две карточки про дискриминант: одна запись, другая значение.',
    'The four steps of determining the number of roots stand in one row with their order broken. Two cards concern the discriminant: one the record, the other the value.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval koeffitsiyentlar ishorasi bilan yozib olinadi: a ikki, b minus olti, c besh. Keyin ular formulaga qo'yiladi: minus oltining kvadrati o'ttiz olti, minus to'rt karra ikki karra besh minus qirq. Undan keyin qiymat hisoblanadi: o'ttiz olti minus qirq minus to'rt. Va faqat oxirida xulosa: D manfiy, demak haqiqiy ildiz yo'q.",
    'Верно. Сначала выписываются коэффициенты со знаками: a два, b минус шесть, c пять. Потом они подставляются в формулу: минус шесть в квадрате тридцать шесть, минус четыре на два на пять минус сорок. Затем считается значение: тридцать шесть минус сорок минус четыре. И только в конце вывод: D отрицательно, значит действительных корней нет.',
    'Correct. First the coefficients are written out with their signs: a is two, b is minus six, c is five. Then they go into the formula: minus six squared is thirty six, minus four times two times five is minus forty. Then the value is computed: thirty six minus forty is minus four. And only at the end the conclusion: D is negative, so there are no real roots.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Xulosadan boshlab bo'lmaydi: «ildiz yo'q» degan gap hali hech narsaga tayanmaydi. Xulosa D ning QIYMATIDAN chiqadi, qiymat esa oxirgi hisobda topiladi. Boshida turgan xulosa — taxmin.",
      'Начинать с вывода нельзя: слова «корней нет» пока ни на что не опираются. Вывод следует из ЗНАЧЕНИЯ D, а значение получается в последнем вычислении. Вывод в начале — это догадка.',
      'You cannot start with the conclusion: the words «no roots» rest on nothing yet. The conclusion follows from the VALUE of D, and that value comes from the final computation. A conclusion placed first is a guess.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Xulosa D ning qiymatidan KEYIN turadi. Minus to'rt manfiy — shu yerda javob paydo bo'ladi. Qiymatsiz xulosa chiqarish uchun hech narsa yo'q: o'ttiz olti minus qirq degan yozuvning o'zi hali manfiy deb aytmaydi.",
      'Вывод стоит ПОСЛЕ значения D. Минус четыре отрицательно — вот где появляется ответ. Без значения выводить нечего: сама запись тридцать шесть минус сорок ещё не говорит, что она отрицательна.',
      'The conclusion comes AFTER the value of D. Minus four is negative — that is where the answer appears. Without the value there is nothing to conclude from: the record thirty six minus forty does not yet say it is negative.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Qiymat yozuvdan chiqadi: minus to'rt — bu o'ttiz olti minus qirqning natijasi. Demak formula avval yozilishi kerak, keyin hisoblanadi.",
      'Значение выходит из записи: минус четыре — результат тридцать шесть минус сорок. Значит формулу надо сначала записать, а потом посчитать.',
      'The value comes from the record: minus four is the result of thirty six minus forty. So the formula must be written first and computed second.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Formulaga qo'yish uchun koeffitsiyentlar kerak, va ular ISHORASI bilan yozib olinadi: b minus oltiga teng. Aks holda o'ttiz olti qaydan chiqqani ko'rinmaydi.",
      'Чтобы подставить в формулу, нужны коэффициенты, и выписываются они СО ЗНАКАМИ: b равно минус шести. Иначе не видно, откуда взялось тридцать шесть.',
      'To substitute into the formula you need the coefficients, and they are written out WITH their signs: b is minus six. Otherwise it is not visible where thirty six came from.') },
  ],
  wrongText: L(
    "Har qadamdan so'rang: buni bajarish uchun nima allaqachon yozilgan bo'lishi kerak? Xulosa esa har doim oxirida — u D ning qiymatini talab qiladi.",
    'Спроси у каждого шага: что должно быть уже записано, чтобы его сделать? А вывод всегда последний — ему нужно значение D.',
    'Ask every step: what must already be written to do it? And the conclusion always comes last — it needs the value of D.'),
};

export default function D18_08(props) { return <SwapOrder data={DATA} {...props} />; }
