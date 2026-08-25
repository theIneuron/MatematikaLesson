// Dars10 · Amaliyot 03 — Ha yoki yo'q · 🟢 · tag: two_answers_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §8 (10-dars, 3-pozitsiya)
//
// Darsning uchinchi tasdig'i ikki mulohazada YUZMA-YUZ qo'yiladi:
//   s1  TENGLAMA: x kvadrati qirq to'qqizga teng — ikki yechim, javob «Ha»;
//   s2  ILDIZ BELGISI: qirq to'qqizdan ildiz plyus-minus yetti emas, javob
//       «Yo'q» (З29).
// Ikkisi bir mavzuga tegishli, lekin javoblari qarama-qarshi — aynan shu
// farq darsning eng nozik joyi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'two_answers_claims', level: '🟢',
  itemSize: 17,
  items: [
    { id: 's1', tokens: ['x² = 49'], yes: true,
      claim: L('ikki yechimi bor', 'имеет два решения', 'has two solutions') },
    { id: 's2', tokens: [{ r: '49' }, '= ±7'], yes: false,
      claim: L("tenglik to'g'ri", 'равенство верно', 'the equality is true') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki yozuv bitta son atrofida: birinchisi tenglama, ikkinchisi ildiz belgisi. Ular bir xil narsa emas.",
    'Две записи вокруг одного числа: первая уравнение, вторая знак корня. Это не одно и то же.',
    'Two records about the same number: the first is an equation, the second a root sign. They are not the same thing.'),
  ask: L(
    "Mulohaza rost bo'lsa «Ha» ni, yolg'on bo'lsa «Yo'q» ni bosing.",
    'Если утверждение верно — нажми «Да», если ложно — «Нет».',
    'Tap «Yes» if the claim is true, «No» if it is false.'),
  correctText: L(
    "To'g'ri. Tenglamada haqiqatan ikki yechim bor: yetti karra yetti qirq to'qqiz va minus yetti karra minus yetti ham qirq to'qqiz. Ildiz belgisi esa boshqa ish qiladi — u BITTA nomanfiy sonni beradi, ya'ni yettini. Shuning uchun tenglamaning javobi ikkita, ildizning qiymati esa bitta. Plyus-minus belgisi tenglamani yechganda YOZILADI, ildizning ta'rifiga esa kirmaydi.",
    'Верно. У уравнения действительно два решения: семь на семь сорок девять и минус семь на минус семь тоже сорок девять. А знак корня делает другое — он даёт ОДНО неотрицательное число, то есть семь. Поэтому у уравнения два ответа, а у корня одно значение. Знак плюс-минус ПИШУТ при решении уравнения, в определение корня он не входит.',
    'Correct. The equation really does have two solutions: seven times seven is forty nine and minus seven times minus seven is forty nine too. The root sign does something else — it gives ONE non-negative number, that is seven. So the equation has two answers while the root has one value. The plus-minus sign is WRITTEN when solving an equation; it is not part of the definition of a root.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi yozuv TENGLAMA, va unda ikki yechim bor. Ikkalasini qo'yib tekshiring: yetti karra yetti qirq to'qqiz, minus yetti karra minus yetti ham qirq to'qqiz. Ikki minus arti beradi.",
      'Первая запись это УРАВНЕНИЕ, и у него два решения. Проверь оба подстановкой: семь на семь сорок девять, минус семь на минус семь тоже сорок девять. Два минуса дают плюс.',
      'The first record is an EQUATION and it has two solutions. Check both by substituting: seven times seven is forty nine, and minus seven times minus seven is forty nine as well. Two minuses give a plus.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi yozuvda ildiz BELGISI turadi, tenglama emas. Ta'rifda ikki shart bor: kvadrati ildiz ostiga teng bo'lsin va sonning o'zi nomanfiy bo'lsin. Minus yetti ikkinchi shartni bajarmaydi, shuning uchun ildiz faqat yettiga teng.",
      'Во второй записи стоит ЗНАК корня, а не уравнение. В определении два условия: квадрат равен подкоренному и само число неотрицательно. Минус семь не выполняет второе, поэтому корень равен только семи.',
      'The second record has the root SIGN, not an equation. The definition has two conditions: the square equals the radicand and the number itself is non-negative. Minus seven fails the second, so the root equals seven only.') },
  ],
  wrongText: L(
    "Har mulohazada bitta savol bering: bu tenglamami yoki ildiz belgisimi? Tenglamada ikki javob, ildizda bitta.",
    'Задай к каждому утверждению один вопрос: это уравнение или знак корня? У уравнения два ответа, у корня один.',
    'Ask one question about each claim: is this an equation or a root sign? An equation has two answers, a root has one.'),
};

export default function D10_03(props) { return <TrueFalse data={DATA} {...props} />; }
