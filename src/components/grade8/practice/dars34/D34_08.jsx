// Dars34 · Amaliyot 08 — Chastota · 🔴 · tag: missing_frequency
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §6 (34-dars, 8-pozitsiya)
//
// З70 NING TO'G'RIDAN-TO'G'RI QO'LLANILISHI. T3 odatda TEKSHIRUV bo'lib
// ishlatiladi: chastotalar yig'indisi hajmga tengmi. Bu topshiriqda esa u
// ASBOB bo'ladi — o'sha tenglik yo'qolgan sonni TOPADI.
//
// Uch xato: 13 — uchtasining yig'indisi (savolni chalkashtirish); 20 —
// hajmning o'zi; 5 — sanoqdagi xato.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'missing_frequency', level: '🔴',
  target: 7, allowNeg: false,
  // Chastotalar RO'YXAT bo'lib turadi, amal belgisisiz: `·` ni qo'ysak u
  // ko'paytirish bo'lib o'qilardi (`frac.jsx` uni ko'k rangda chizadi), va
  // topshiriq boshqa masalaga aylanib qolardi.
  expr: ['6,   4,   3,   ?'], exprSize: 26,
  given: [['n = 20']],
  givenLabel: L('Tanlanma hajmi', 'Объём выборки', 'The sample size'),
  eyebrow: L('Chastota', 'Частота', 'Frequency'),
  setup: L(
    "Jadvalda to'rt variant bor, lekin oxirgi variantning chastotasi yozilmay qolgan. Uchta chastota ma'lum: olti, to'rt va uch. Tanlanmaning hajmi ham ma'lum.",
    'В таблице четыре варианта, но частота последнего не записана. Три частоты известны: шесть, четыре и три. Объём выборки тоже известен.',
    'The table holds four variants, but the frequency of the last one was not written down. Three frequencies are known: six, four and three. The sample size is known as well.'),
  label: L("To'rtinchi chastota", 'Четвёртая частота', 'The fourth frequency'),
  ask: L(
    'Yozilmagan chastota nechaga teng?',
    'Чему равна незаписанная частота?',
    'What is the missing frequency?'),
  correctText: L(
    "To'g'ri. Chastotalar yig'indisi doim tanlanma hajmiga teng — har natija jadvalda aynan bir marta sanaladi, ya'ni hech biri tashlab ketilmaydi va hech biri ikki marta sanalmaydi. Uchta ma'lum chastotani qo'shamiz: olti qo'shuv to'rt o'n, o'n qo'shuv uch o'n uch. Hajmi yigirma, demak to'rtinchisi yigirma minus o'n uch, ya'ni yetti. Tekshiring: olti qo'shuv to'rt qo'shuv uch qo'shuv yetti yigirmaga teng. Bu tenglik odatda tekshiruv bo'lib ishlatiladi, bu yerda esa u yo'qolgan sonni topadigan ASBOB bo'ldi.",
    'Верно. Сумма частот всегда равна объёму выборки — каждый результат учтён в таблице ровно один раз, то есть ни один не пропущен и ни один не сосчитан дважды. Складываем три известные частоты: шесть плюс четыре десять, десять плюс три тринадцать. Объём двадцать, значит четвёртая равна двадцать минус тринадцать, то есть семь. Проверь: шесть плюс четыре плюс три плюс семь равно двадцати. Обычно это равенство служит проверкой, а здесь оно стало ИНСТРУМЕНТОМ, который находит пропавшее число.',
    'Correct. The sum of the frequencies always equals the sample size — every result is counted in the table exactly once, none skipped and none counted twice. Add the three known frequencies: six plus four is ten, ten plus three is thirteen. The size is twenty, so the fourth is twenty minus thirteen, that is seven. Check: six plus four plus three plus seven equals twenty. This equality usually serves as a check; here it became the TOOL that finds the missing number.'),
  wrongs: [
    { when: (s) => s.value === 13, text: L(
      "Uchta ma'lum chastota qo'shildi, lekin savol boshqa: TO'RTINCHISI so'ralyapti. O'n uch — bu uchtasining yig'indisi, ya'ni jadvalda allaqachon hisobga olingan natijalar. Yigirmatadan o'n uchtasi joyini topgan, qolgani esa to'rtinchi variantga tegishli: yigirma minus o'n uch yetti.",
      'Три известные частоты сложены, но вопрос другой: спрашивают ЧЕТВЁРТУЮ. Тринадцать — это сумма трёх, то есть результаты, уже учтённые в таблице. Из двадцати тринадцать нашли своё место, а остаток относится к четвёртому варианту: двадцать минус тринадцать семь.',
      'The three known frequencies were added, but the question is different: the FOURTH is asked for. Thirteen is the sum of the three, that is, the results already accounted for in the table. Of the twenty, thirteen have found their place, and the remainder belongs to the fourth variant: twenty minus thirteen is seven.') },
    { when: (s) => s.value === 20, text: L(
      "Yigirma — tanlanmaning HAJMI, ya'ni hamma natijalarning soni, bitta variantning chastotasi emas. Bitta variant butun tanlanmani egallay olmaydi: jadvalda yana uchta variant turibdi va ularning chastotalari noldan katta. Yig'indi yigirmaga teng bo'lishi kerak, va uning ichida to'rtinchi variantga yetti qoladi.",
      'Двадцать — это ОБЪЁМ выборки, то есть количество всех результатов, а не частота одного варианта. Один вариант не может занять всю выборку: в таблице есть ещё три варианта с ненулевыми частотами. Сумма должна равняться двадцати, и внутри неё на четвёртый вариант остаётся семь.',
      'Twenty is the SIZE of the sample, that is the count of all results, not the frequency of one variant. A single variant cannot take up the whole sample: three other variants stand in the table with non-zero frequencies. The sum must equal twenty, and within it seven remain for the fourth variant.') },
    { when: (s) => s.value === 5 || s.value === 6 || s.value === 8, text: L(
      "Ayirishda xato bor. Uchtasini qayta qo'shing: olti qo'shuv to'rt o'n, o'n qo'shuv uch o'n uch. Keyin yigirmadan o'n uchni ayiring — yetti. Javobni darhol tekshiring: to'rt chastotani qo'shsangiz aynan yigirma chiqishi kerak, aks holda javob noto'g'ri.",
      'В вычитании ошибка. Сложи три заново: шесть плюс четыре десять, десять плюс три тринадцать. Потом вычти из двадцати тринадцать — семь. Сразу проверь ответ: сумма четырёх частот должна дать ровно двадцать, иначе ответ неверен.',
      'There is a slip in the subtraction. Add the three again: six plus four is ten, ten plus three is thirteen. Then subtract thirteen from twenty — seven. Check the answer at once: the four frequencies must add to exactly twenty, otherwise the answer is wrong.') },
  ],
  wrongText: L(
    "Chastotalar yig'indisi tanlanma hajmiga teng. Ma'lum uchtasini qo'shing va hajmdan ayiring, keyin to'rttasining yig'indisini tekshiring.",
    'Сумма частот равна объёму выборки. Сложи три известные и вычти из объёма, потом проверь сумму всех четырёх.',
    'The sum of the frequencies equals the sample size. Add the three known ones and subtract from the size, then check the sum of all four.'),
};

export default function D34_08(props) { return <TypeValue data={DATA} {...props} />; }
