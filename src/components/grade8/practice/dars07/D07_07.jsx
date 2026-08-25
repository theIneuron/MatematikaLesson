// Dars07 · Amaliyot 07 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §5 (7-dars, 7-pozitsiya)
//
// Darsning uch tasdig'i BITTA gapda: ko'paytma o'zgarmaydi, grafik giperbola,
// nolda qiymat yo'q. Bankda uch tuzoq: «yig'indisi» (o'zgarmaydigan narsani
// almashtirish), «to'g'ri chiziq» (З27), «nolga teng» (З2 ning yumshoq shakli:
// qiymat yo'q emas, nol deb o'ylash).
//
// MUHIM: bu yerda kartalar SO'Z, ya'ni `L()` ICHIDA. `parts` uch tilda BIR
// XIL shaklda: matn, uya, matn, uya, matn, uya, matn.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      'Teskari proporsionallikda x va y ning',
      'При обратной пропорциональности',
      'In inverse proportionality the') },
    { slot: 0 },
    { text: L(
      "o'zgarmaydi va k ga teng. Bunday funksiyaning grafigi",
      'x и y не меняется и равно k. График такой функции это',
      'of x and y does not change and equals k. The graph of such a function is called a') },
    { slot: 1 },
    { text: L(
      "deyiladi. Nolda esa funksiyaning qiymati",
      '. А в нуле значение функции',
      '. At zero the value of the function') },
    { slot: 2 },
    { text: L('.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L("ko'paytmasi", 'произведение', 'product') },
    { id: 'w2', label: L('giperbola', 'гипербола', 'hyperbola') },
    { id: 'w3', label: L("yo'q", 'отсутствует', 'does not exist') },
    { id: 'w4', label: L('yig\'indisi', 'сумма', 'sum') },
    { id: 'w5', label: L("to'g'ri chiziq", 'прямая', 'straight line') },
    { id: 'w6', label: L('nolga teng', 'равно нулю', 'is zero') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying.",
    'Правило урока записано, но три слова выпали. Поставь их из карточек снизу.',
    'The rule of the lesson is written down, but three words fell out. Put them back from the cards below.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uch fakt bir gapda. O'zgarmay turgani ko'paytma: x ni birga olsangiz y k ga teng, x ni ikkiga olsangiz y yarim k, ko'paytma esa ikkalasida k. Grafik giperbola, u ikki tarmoqdan tuzilgan. Nolda esa qiymat umuman yo'q — nolga bo'lish degan amal yo'q, shuning uchun grafik y o'qiga tegmaydi.",
    'Верно. Три факта в одном предложении. Неизменно произведение: при x равном одному y равно k, при x равном двум y равно половине k, а произведение в обоих случаях k. График — гипербола из двух ветвей. А в нуле значения нет вовсе: деления на нуль не существует, поэтому график не касается оси y.',
    'Correct. Three facts in one sentence. What stays constant is the product: at x equal to one y equals k, at x equal to two y is half of k, and the product is k in both cases. The graph is a hyperbola of two branches. At zero there is no value at all: division by zero is not an operation, so the graph never touches the y axis.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Yig'indi o'zgarmaydi deb tekshirib ko'ring. k ni o'n ikki deb oling: x bir bo'lganda y o'n ikki, yig'indi o'n uch; x ikki bo'lganda y olti, yig'indi sakkiz. Yig'indi o'zgardi, ko'paytma esa ikkalasida o'n ikki.",
      'Проверь, действительно ли не меняется сумма. Возьми k равным двенадцати: при x равном одному y двенадцать, сумма тринадцать; при x равном двум y шесть, сумма восемь. Сумма изменилась, а произведение в обоих случаях двенадцать.',
      'Test whether it is really the sum that stays constant. Take k as twelve: at x equal to one y is twelve and the sum is thirteen; at x equal to two y is six and the sum is eight. The sum changed, while the product is twelve in both cases.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "To'g'ri chiziq boshqa funksiyaning grafigi: u yerda x o'sganda y ham o'sadi. Bu yerda esa x o'sganda y kamayadi, va chizma ikki tarmoqqa ajraladi — o'rtada nol turadi, u yerda qiymat yo'q.",
      'Прямая — график другой функции: там с ростом x растёт y. А здесь с ростом x значение убывает, и чертёж распадается на две ветви: посередине нуль, где значения нет.',
      'A straight line is the graph of a different function: there y grows with x. Here the value drops as x grows, and the plot splits into two branches: in the middle sits zero, where there is no value.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Nolda qiymat nolga teng emas, u umuman yo'q. Qiymat nolga teng bo'lishi uchun surat nolga aylanishi kerak, surat esa k va u nolga teng emas. Chiziq tagidagi nol esa bo'lishning o'zini to'xtatadi.",
      'В нуле значение не равно нулю, его нет вовсе. Чтобы значение было нулём, числитель должен обратиться в нуль, а числитель это k и он не нуль. Нуль же под чертой прекращает само деление.',
      'At zero the value is not zero, it does not exist at all. For the value to be zero the numerator would have to vanish, and the numerator is k which is not zero. A zero below the bar stops the division itself.') },
    { when: (s) => s.slots.indexOf('w6') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w4') !== -1, text: L(
      "Bankda uchta tuzoq bor: ular gapga sintaksis bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni k ni o'n ikki deb olib son bilan tekshiring.",
      'В банке три ловушки: они подходят к предложению по языку, но не по математике. Проверь каждое слово числом, взяв k равным двенадцати.',
      'The bank holds three traps: they fit the sentence grammatically but not mathematically. Test every word with numbers, taking k as twelve.') },
  ],
  wrongText: L(
    "k ni o'n ikki deb olib jadval tuzing: x ga bir, ikki, uch qo'ying. Nima o'zgarmay turganini shu jadval aytadi.",
    'Возьми k равным двенадцати и составь табличку: подставь x равным одному, двум, трём. Табличка и скажет, что остаётся неизменным.',
    'Take k as twelve and build a small table: put x equal to one, two, three. The table itself will say what stays constant.'),
};

export default function D07_07(props) { return <ClozeBank data={DATA} {...props} />; }
