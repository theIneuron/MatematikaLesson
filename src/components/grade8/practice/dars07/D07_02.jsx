// Dars07 · Amaliyot 02 — Ha yoki yo'q · 🟢 · tag: zero_and_product
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §5 (7-dars, 2-pozitsiya)
//
// Ikki mulohaza — darsning ikki qimmat joyi:
//   s1  З2: nolda qiymat NOLGA TENG deb o'ylash. Aslida u yerda qiymat
//       umuman yo'q — javob «Yo'q»;
//   s2  З27: x o'sganda y KAMAYADI. O'zgarmay turgani qiymat emas, ko'paytma —
//       javob ham «Yo'q».
// Ikkinchi mulohazada aynan SON berilgan (x ikkidan to'rtga), shunda javob
// «tuyg'u» bilan emas, hisob bilan chiqadi.
//
// IKKALA JAVOB HAM «YO'Q» (metodist qarori 2026-08-25). Ilgari har ha-yo'q
// topshirig'ida bittasi «ha», bittasi «yo'q» edi — yigirma uch topshiriqda
// birdek. O'quvchi buni ikkinchi darsda payqaydi va matematikaga qaramasdan
// naqsh bo'yicha bosadi. Endi kombinatsiya darsdan darsga o'zgaradi
// (taqsimot: DARS07_11_AMALIYOT_SKELET.md §10 p. 9).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'zero_and_product', level: '🟢',
  itemSize: 18,
  items: [
    { id: 's1', tokens: [{ n: '8', d: 'x' }], at: 'x = 0', yes: false,
      claim: L('qiymati nolga teng', 'значение равно нулю', 'its value is zero') },
    { id: 's2', tokens: [{ n: '8', d: 'x' }], at: 'x = 2 → 4', yes: false,
      claim: L('qiymati ortadi', 'значение растёт', 'the value grows') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki mulohaza bitta funksiya haqida. Har birida tekshiriladigan qiymat va da'vo turadi.",
    'Два утверждения об одной функции. В каждом есть проверяемое значение и само утверждение.',
    'Two claims about one function. Each shows the value to test and the claim itself.'),
  ask: L(
    "Mulohaza rost bo'lsa «Ha» ni, yolg'on bo'lsa «Yo'q» ni bosing.",
    'Если утверждение верно — нажми «Да», если ложно — «Нет».',
    'Tap «Yes» if the claim is true, «No» if it is false.'),
  correctText: L(
    "To'g'ri. Ikkalasi ham yolg'on. Nolda qiymat nolga teng emas — u umuman yo'q: sakkizni nolga bo'lish degan amal yo'q, shuning uchun grafik y o'qiga tegmaydi. Ikkinchisida ikkini qo'ysangiz to'rt chiqadi, to'rtni qo'ysangiz ikki — qiymat ortmaydi, KAMAYADI. O'zgarmay turgani qiymat emas, ko'paytma: ikki karra to'rt sakkiz, to'rt karra ikki ham sakkiz.",
    'Верно. Оба ложны. В нуле значение не равно нулю — его вовсе нет: восемь разделить на нуль нельзя, поэтому график не касается оси y. Во втором при двух выходит четыре, при четырёх — два: значение не растёт, а УБЫВАЕТ. Неизменным остаётся не значение, а произведение: два на четыре восемь, четыре на два тоже восемь.',
    'Correct. Both are false. At zero the value is not zero — there is none at all: eight divided by zero is not an operation, so the graph never touches the y axis. In the second, two gives four and four gives two: the value does not grow, it DECREASES. What stays the same is not the value but the product: two times four is eight, four times two is eight as well.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Nolda qiymat NOL emas, umuman yo'q. Qiymat nolga teng bo'lishi uchun surat nolga aylanishi kerak, surat esa sakkiz. Chiziq tagidagi nol esa bo'lishning o'zini to'xtatadi: sakkizni nolga bo'lish degan amal yo'q.",
      'В нуле значение не НУЛЬ, его нет вовсе. Чтобы значение равнялось нулю, должен обратиться в нуль числитель, а числитель это восемь. Нуль же под чертой прекращает само деление: восемь разделить на нуль нельзя.',
      'At zero the value is not ZERO, it does not exist at all. For the value to be zero the numerator would have to vanish, and the numerator is eight. A zero below the bar stops the division itself: eight divided by zero is not an operation.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi mulohazani son bilan tekshiring: ikkida sakkiz bo'lingan ikki to'rtga teng, to'rtda esa sakkiz bo'lingan to'rt ikkiga teng. To'rtdan ikki kichik, ya'ni qiymat ortmadi, kamaydi. Harf chiziq tagida turganda x o'sishi maxrajni kattalashtiradi.",
      'Проверь второе утверждение числом: при двух восемь делить на два равно четырём, при четырёх восемь делить на четыре равно двум. Два меньше четырёх, значит значение не выросло, а убыло. Когда буква под чертой, рост x увеличивает знаменатель.',
      'Check the second claim with numbers: at two, eight over two is four; at four, eight over four is two. Two is less than four, so the value did not grow, it dropped. When the letter is below the bar, growing x makes the denominator bigger.') },
  ],
  wrongText: L(
    "Har mulohazada qiymatni chiziq tagiga qo'ying va hisoblang. Ikki qiymat chiqsa, ularni solishtiring.",
    'В каждом утверждении подставь значение под черту и посчитай. Если вышло два значения — сравни их.',
    'In each claim put the value below the bar and compute. If two values come out, compare them.'),
};

export default function D07_02(props) { return <TrueFalse data={DATA} {...props} />; }
