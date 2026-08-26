// Dars31 · Amaliyot 01 — Test · 🟢 · tag: zero_power_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §3 (31-dars, 1-pozitsiya)
//
// З62 ENG QISQA SHAKLDA. Nolinchi daraja «hech narsaga ko'paytirilmagan»
// bo'lib ko'rinadi, va shu sababli javob nol deb o'ylanadi. Razbor uni
// bo'lish orqali ochadi: 7³ : 7³ bir tomondan bir, ikkinchi tomondan 7⁰.
//
// To'rtinchi variant — «aniqlanmagan»: T3 ni nolmas asosga qo'llash.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'zero_power_value', level: '🟢',
  // Ikki ustun (QA 2026-08-26): to'rt ustunda telefonda «aniqlanmagan»
  // variantining kengligi katakka sig'masdi va ramkadan chiqib ketardi.
  correct: 0, optCols: 2, optSize: 20,
  expr: ['7⁰'], exprSize: 34,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Ko'rsatkich nolga teng. Bunday daraja hech qanday ko'paytirishni bildirmaydi, lekin uning qiymati bor va u bitta songa teng.",
    'Показатель равен нулю. Такая степень не означает никакого умножения, но значение у неё есть, и оно равно одному определённому числу.',
    'The exponent is zero. Such a power means no multiplication at all, yet it has a value, and that value is one definite number.'),
  ask: L('Bu darajaning qiymati nechaga teng?', 'Чему равно значение этой степени?', 'What is the value of this power?'),
  opts: [
    { label: ['1'] },
    { label: ['0'] },
    { label: ['7'] },
    // `Choice` ning varianti SO'Z ham bo'la oladi: `label` massiv bo'lmasa,
    // u `tr()` dan o'tadi (`kit.jsx`). Qolgan mexanikalarning kartalari
    // bunday emas — u yerda faqat belgi turadi (skelet §0a.5).
    { label: L('aniqlanmagan', 'не определено', 'undefined') },
  ],
  correctText: L(
    "To'g'ri. Buni bo'lish orqali ko'rish oson. Yettining kubini yettining kubiga bo'laylik: bir xil sonni o'ziga bo'lsak, natija bir. Ikkinchi tomondan, bir xil asosli darajalar bo'linganda ko'rsatkichlar ayiriladi: uch minus uch, ya'ni yettining nolinchi darajasi. Demak yettining nolinchi darajasi birga teng. Bu faqat yetti uchun emas: asos noldan farqli bo'lgan har qanday son uchun nolinchi daraja birga teng.",
    'Верно. Это легко увидеть через деление. Разделим семь в кубе на семь в кубе: одно и то же число, делённое само на себя, даёт единицу. С другой стороны, при делении степеней с одинаковым основанием показатели вычитаются: три минус три, то есть семь в нулевой степени. Значит семь в нулевой степени равно единице. И это не только про семёрку: для любого основания, отличного от нуля, нулевая степень равна единице.',
    'Correct. Division makes it plain. Divide seven cubed by seven cubed: the same number divided by itself gives one. On the other hand, dividing powers with the same base subtracts the exponents: three minus three, that is seven to the zero. So seven to the zero equals one. And this is not only about seven: for any base other than zero, the zero power equals one.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Nol tanlandi, lekin nolinchi daraja NOLGA teng emas. Ko'rsatkichning noli «natija nol» degani emas: u ko'paytuvchilar SONI, natijaning o'zi emas. Tekshiring bo'lish bilan: yettining kubini yettining kubiga bo'lsangiz bir chiqadi, ko'rsatkichlar esa ayirilib nol qoladi. Bir xil hisobning ikki yo'li bitta javob berishi kerak, va u javob bir.",
      'Выбран нуль, но нулевая степень НЕ равна нулю. Нуль в показателе не значит «результат нуль»: это КОЛИЧЕСТВО множителей, а не сам результат. Проверь делением: семь в кубе делить на семь в кубе даёт единицу, а показатели при этом вычитаются и остаётся нуль. Два пути одного вычисления обязаны дать один ответ, и этот ответ — единица.',
      'Zero was chosen, but the zero power does NOT equal zero. A zero exponent does not mean «the result is zero»: it is the COUNT of factors, not the result itself. Check by division: seven cubed divided by seven cubed gives one, while the exponents subtract to zero. Two routes through the same computation must give one answer, and that answer is one.') },
    { when: (s) => s.picked === 2, text: L(
      "Asosning o'zi tanlandi, ya'ni ko'rsatkich e'tibordan chetda qoldi. Yetti — bu yettining BIRINCHI darajasi, nolinchisi emas. Darajalar qatoriga qarang: yettining kubi uch yuz qirq uch, kvadrati qirq to'qqiz, birinchi darajasi yetti — har qadamda yettiga bo'linyapti. Keyingi qadam yettini yettiga bo'ladi va bir beradi.",
      'Выбрано само основание, то есть показатель остался без внимания. Семь — это семь в ПЕРВОЙ степени, а не в нулевой. Посмотри на ряд степеней: семь в кубе триста сорок три, в квадрате сорок девять, в первой семь — на каждом шаге деление на семь. Следующий шаг делит семь на семь и даёт единицу.',
      'The base itself was chosen, so the exponent was left out of account. Seven is seven to the FIRST power, not the zero one. Look at the row of powers: seven cubed is three hundred forty-three, squared is forty-nine, to the first is seven — each step divides by seven. The next step divides seven by seven and gives one.') },
    { when: (s) => s.picked === 3, text: L(
      "Aniqlanmagan degan javob faqat BITTA asos uchun to'g'ri — nol uchun. Nolning nolinchi darajasi haqiqatan ham aniqlanmagan, chunki bo'lish nolga olib boradi. Bu yerda esa asos yetti, va u noldan farqli. Taqiqni ko'rsatkich emas, ASOS beradi.",
      'Ответ «не определено» верен только для ОДНОГО основания — для нуля. Нуль в нулевой степени действительно не определён, потому что деление приводит к нулю. Здесь же основание семь, и оно отлично от нуля. Запрет даёт не показатель, а ОСНОВАНИЕ.',
      'The answer «undefined» is right for only ONE base — zero. Zero to the zero really is undefined, because the division leads to zero. Here the base is seven, which is not zero. The ban comes from the BASE, not from the exponent.') },
  ],
  wrongText: L(
    "Nolinchi darajani bo'lish orqali tekshiring: bir xil darajani o'ziga bo'ling. Natija bir, ko'rsatkichlar esa ayirilib nol qoladi.",
    'Проверь нулевую степень делением: раздели одинаковую степень саму на себя. Результат — единица, а показатели при этом вычитаются в нуль.',
    'Check the zero power by division: divide the same power by itself. The result is one, while the exponents subtract to zero.'),
};

export default function D31_01(props) { return <Choice data={DATA} {...props} />; }
