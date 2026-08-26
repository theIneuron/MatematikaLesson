// Dars26 · Amaliyot 09 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §8 (26-dars, 9-pozitsiya)
//
// UCH BO'SHLIQ — DARSNING UCH TASDIG'I. Bankdagi tuzoqlar:
//   «kamida bitta»    — З55 ning TA'RIFDAGI ildizi: sistema «yoki» emas,
//                       «va» degan so'z bilan ishlaydi;
//   «birga»           — ikki tengsizlikni bir vaqtda yechishga urinish;
//   «birlashtiriladi» — З55 ning o'zi: kesishtirish o'rniga birlashtirish.
// `parts` uch tilda BIR XIL shaklda: matn, uya, matn, uya, matn, uya, matn.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L(
      "Sistemaning yechimi —",
      'Решение системы — это значение, обращающее в верные',
      'A solution of the system is a value that makes') },
    { slot: 0 },
    { text: L(
      "tengsizlikni to'g'ri qiladigan qiymat. Har tengsizlik",
      'неравенства. Каждое неравенство решается',
      'inequalities true. Each inequality is solved') },
    { slot: 1 },
    { text: L(
      "yechiladi, keyin ikki yechim to'g'ri chiziqda",
      ', потом два решения на числовой прямой',
      ', and then the two solutions are') },
    { slot: 2 },
    { text: L('.', '.', 'on the number line.') },
  ],
  cards: [
    { id: 'w1', label: L('har ikki', 'оба', 'both') },
    { id: 'w2', label: L('alohida', 'по отдельности', 'separately') },
    { id: 'w3', label: L('kesishtiriladi', 'пересекаются', 'intersected') },
    { id: 'w4', label: L('kamida bitta', 'хотя бы одно', 'at least one of the') },
    { id: 'w5', label: L('birga', 'вместе', 'together') },
    { id: 'w6', label: L('birlashtiriladi', 'объединяются', 'united') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning uch tasdig'i bitta gapda yozilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta: uchtasi joyiga tushadi, uchtasi esa gapga mos kelib, matematikaga mos kelmaydi.",
    'Три утверждения урока записаны в одном предложении, но три слова выпали. В банке шесть карточек: три встают на место, а три подходят по языку, но не по математике.',
    'The three statements of the lesson are written in one sentence, but three words fell out. The bank holds six cards: three fit, and three fit the sentence but not the mathematics.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Sistemada «va» turadi: qiymat har ikki tengsizlikni ham to'g'ri qilishi kerak. Yechish alohida boradi, va oxirida ikki yechim kesishtiriladi — javob ular ustma-ust tushgan joy. Birlashtirish boshqa amal va boshqa javob beradi.",
    'Верно. В системе стоит «и»: значение должно обращать в верные оба неравенства. Решают их по отдельности, а в конце два решения пересекают — ответ там, где они накладываются. Объединение — другое действие и даёт другой ответ.',
    'Correct. A system carries «and»: the value must make both inequalities true. They are solved separately, and at the end the two solutions are intersected — the answer is where they overlap. Union is a different operation giving a different answer.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "«Kamida bitta» — bu boshqa shart, va u sistema emas. Sistemada ikkala tengsizlik ham bir vaqtda bajarilishi kerak. Misolda ko'ring: x ikkidan katta va x oltidan kichik. Bir soni ikkinchi shartni bajaradi, lekin birinchisini yo'q — demak u yechim emas. «Kamida bitta» degan qarash bilan bir yechim bo'lib qolardi.",
      '«Хотя бы одно» — это другое условие, и это не система. В системе оба неравенства должны выполняться одновременно. Посмотри на примере: x больше двух и x меньше шести. Единица выполняет второе условие, но не первое — значит решением не является. При подходе «хотя бы одно» единица оказалась бы решением.',
      '«At least one» is a different condition, and it is not a system. In a system both inequalities must hold at once. Look at an example: x greater than two and x less than six. One satisfies the second condition but not the first — so it is not a solution. Under an «at least one» reading, one would count as a solution.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Tengsizliklar BIRGA emas, ALOHIDA yechiladi. Ular bitta yozuvda tursa ham, har birining o'z x li hadi va o'z chegarasi bor: birinchisidan x ikkidan katta chiqadi, ikkinchisidan x oltidan kichik. Faqat yechimlar TOPILGANDAN keyin ular bir joyga qo'yiladi.",
      'Неравенства решаются НЕ ВМЕСТЕ, а ПО ОТДЕЛЬНОСТИ. Пусть они и стоят в одной записи, у каждого свой член с x и своя граница: из первого выходит x больше двух, из второго x меньше шести. И только ПОСЛЕ того как решения найдены, их сводят вместе.',
      'The inequalities are solved SEPARATELY, not TOGETHER. Even though they stand in one record, each has its own term with x and its own boundary: the first gives x greater than two, the second x less than six. Only AFTER the solutions are found are they brought together.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Kesishtirish o'rniga BIRLASHTIRISH qo'yilgan, va bu butunlay boshqa javob beradi. Kesishma — ikki yechim USTMA-UST tushgan joy, birlashma esa ikkalasining hammasi. Misol: x ikkidan katta va x oltidan kichik. Kesishma — ikki bilan olti orasi; birlashma esa butun son o'qi bo'lardi, chunki har son yo ikkidan katta, yo oltidan kichik.",
      'Вместо пересечения поставлено ОБЪЕДИНЕНИЕ, а это совсем другой ответ. Пересечение — место, где два решения НАКЛАДЫВАЮТСЯ, а объединение — всё из обоих. Пример: x больше двух и x меньше шести. Пересечение — промежуток от двух до шести; а объединение было бы всей числовой прямой, ведь любое число либо больше двух, либо меньше шести.',
      'UNION was put in place of intersection, and that gives a completely different answer. An intersection is where the two solutions OVERLAP; a union is everything from both. Example: x greater than two and x less than six. The intersection is the range from two to six; the union would be the whole number line, since every number is either greater than two or less than six.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni bitta misolda tekshiring: x ikkidan katta va x oltidan kichik.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово на примере: x больше двух и x меньше шести.',
      'The three traps in the bank fit the language but not the mathematics. Test each word on the example: x greater than two and x less than six.') },
  ],
  wrongText: L(
    "Har so'zni bitta misolda tekshiring: x ikkidan katta va x oltidan kichik. Sistemada ikkala shart ham bajarilishi kerak, yechimlar esa kesishtiriladi.",
    'Проверяй каждое слово на примере: x больше двух и x меньше шести. В системе должны выполняться оба условия, а решения пересекаются.',
    'Test every word on the example: x greater than two and x less than six. A system requires both conditions, and the solutions are intersected.'),
};

export default function D26_09(props) { return <ClozeBank data={DATA} {...props} />; }
