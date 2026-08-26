// Dars20 · Amaliyot 07 — Tartib · 🟡 · tag: solve_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §8 (20-dars, 7-pozitsiya)
//
// DARSNING BUTUN MANTIG'I BIR QATORDA. To'rt qadam: shart, ko'paytirish,
// ildizlar, solishtirish. Shartni OXIRGA surish — З2: o'shanda begona ildiz
// javobga kirib ketadi, chunki uni chiqarib tashlaydigan narsa qolmaydi.
//
// Bu tenglamada aynan shu holat bor: ikki ildizdan bittasi (to'rt) taqiqqa
// tushadi va rad etiladi, javobda esa faqat minus to'rt qoladi (T2, T3, З3).
// Boshlang'ich tartib QAT'IY (`start`).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'solve_steps', level: '🟡',
  expr: [{ n: 'x² − 16', d: 'x − 4' }, '= 0'], exprSize: 24,
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: ['x ≠ 4'],
      label: L('shartni yozamiz', 'записываем условие', 'write the condition') },
    { id: 'l2', tokens: ['x² − 16 = 0'],
      label: L('maxrajga ko\'paytiramiz', 'умножаем на знаменатель', 'multiply by the denominator') },
    { id: 'l3', tokens: ['x = 4', ';', 'x = −4'],
      label: L('ildizlarni topamiz', 'находим корни', 'find the roots') },
    { id: 'l4', tokens: ['x = −4'],
      label: L('shart bilan solishtiramiz', 'сверяем с условием', 'check against the condition') },
  ],
  start: ['l2', 'l4', 'l3', 'l1'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Darsning butun mantig'i to'rt qadamda: shart, ko'paytirish, ildizlar, solishtirish. Tartib buzilgan — va bu yerda tartibning o'zi javobni hal qiladi.",
    'Вся логика урока в четырёх шагах: условие, умножение, корни, сверка. Порядок нарушен — а здесь именно порядок и решает ответ.',
    'The whole logic of the lesson in four steps: condition, multiplication, roots, comparison. The order is broken — and here the order itself decides the answer.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval shart: maxraj x minus to'rt, demak x to'rtga teng bo'lmasligi kerak. Keyin maxrajga ko'paytiramiz va x kvadrat minus o'n olti nolga teng bo'ladi. Undan keyin ildizlar: to'rt va minus to'rt. Va faqat oxirida solishtirish: to'rt shartga zid, ya'ni u BEGONA ildiz — javobda faqat minus to'rt qoladi. Tekshirish: minus to'rtda surat nol, maxraj minus sakkiz, kasr nolga teng.",
    'Верно. Сначала условие: знаменатель x минус четыре, значит x не равен четырём. Потом умножаем на знаменатель и получаем x квадрат минус шестнадцать равно нулю. Затем корни: четыре и минус четыре. И только в конце сверка: четыре противоречит условию, то есть это ПОСТОРОННИЙ корень — в ответе остаётся лишь минус четыре. Проверка: при минус четырёх числитель нуль, знаменатель минус восемь, дробь равна нулю.',
    'Correct. First the condition: the denominator is x minus four, so x must not be four. Then multiply by the denominator and get x squared minus sixteen equals zero. Then the roots: four and minus four. And only at the end the comparison: four contradicts the condition, so it is an EXTRANEOUS root — only minus four remains in the answer. Check: at minus four the numerator is zero, the denominator minus eight, and the fraction equals zero.'),
  wrongs: [
    { when: (s) => s.pos.l1 > s.pos.l3, text: L(
      "Shart ILDIZLARDAN OLDIN yozilishi kerak. Aks holda to'rt topilgandan keyin uni rad etadigan narsa qolmaydi, va begona ildiz javobga kirib ketadi. To'rtni asl tenglamaga qo'yib ko'ring: maxraj nol bo'ladi, ya'ni yozuvning o'zi ma'nosini yo'qotadi.",
      'Условие надо записать ДО корней. Иначе, найдя четыре, отбросить его будет нечем, и посторонний корень попадёт в ответ. Подставь четыре в исходное уравнение: знаменатель обратится в нуль, то есть сама запись потеряет смысл.',
      'The condition must be written BEFORE the roots. Otherwise, once four is found there is nothing to reject it with, and the extraneous root slips into the answer. Substitute four into the original equation: the denominator vanishes, so the record itself loses meaning.') },
    { when: (s) => s.seq[0] === 'l4' || s.seq[0] === 'l3', text: L(
      "Javobdan yoki ildizlardan boshlab bo'lmaydi: ular hali topilmagan. Birinchi qadam — shart, chunki u dastlabki yozuvdan darrov ko'rinadi va keyingi hamma qadamga tegishli.",
      'Начинать с ответа или с корней нельзя: они ещё не найдены. Первый шаг — условие, ведь оно видно сразу из исходной записи и относится ко всем следующим шагам.',
      'You cannot start with the answer or the roots: they have not been found yet. The first step is the condition, since it is visible straight from the original record and governs every step that follows.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Maxrajga ko'paytirishdan OLDIN shartni yozib olish kerak: ko'paytirgandan keyin maxraj yozuvdan yo'qoladi, va u bilan birga taqiq ham ko'rinmay qoladi. Aynan shu joyda begona ildiz paydo bo'ladi.",
      'ПЕРЕД умножением на знаменатель надо выписать условие: после умножения знаменатель из записи исчезает, а вместе с ним перестаёт быть виден и запрет. Именно здесь и появляется посторонний корень.',
      'The condition must be written BEFORE multiplying by the denominator: after the multiplication the denominator disappears from the record, and the ban disappears with it. That is exactly where an extraneous root is born.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Solishtirish uchun ildizlar kerak: to'rt va minus to'rt topilgandan keyingina ularni shart bilan taqqoslash mumkin. Solishtirish — oxirgi qadam.",
      'Для сверки нужны корни: только найдя четыре и минус четыре, их можно сопоставить с условием. Сверка — последний шаг.',
      'Comparison needs the roots: only once four and minus four are found can they be matched against the condition. The comparison is the last step.') },
  ],
  wrongText: L(
    "Shart har doim birinchi: maxrajga ko'paytirgandan keyin u yozuvdan yo'qoladi. Solishtirish esa oxirida — u ildizlarni talab qiladi.",
    'Условие всегда первое: после умножения на знаменатель оно из записи исчезает. А сверка последняя — ей нужны корни.',
    'The condition always comes first: after multiplying by the denominator it vanishes from the record. The comparison comes last — it needs the roots.'),
};

export default function D20_07(props) { return <SwapOrder data={DATA} {...props} />; }
