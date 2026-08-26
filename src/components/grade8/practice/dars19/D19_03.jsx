// Dars19 · Amaliyot 03 — Ha yoki yo'q · 🟢 · tag: vieta_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §7 (19-dars, 3-pozitsiya)
//
// IKKI MULOHAZA BITTA TENGLAMA HAQIDA, va shu ataylab: bir yozuvda ikki
// qoida yonma-yon turadi va farqi ochiq ko'rinadi.
//   s1  yig'indi minus p ga teng: p arti besh, demak yig'indi minus besh — Ha;
//   s2  ko'paytma q ga teng, ISHORA ALMASHMAYDI: q arti olti, demak ko'paytma
//       arti olti, minus olti emas — Yo'q (З45 ning ikkinchi yuzi).
// Ildizlar minus ikki va minus uch: yig'indi minus besh, ko'paytma arti olti.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'vieta_claims', level: '🟢',
  itemSize: 15,
  items: [
    { id: 's1', yes: false,
      tokens: ['x² + 5x + 6 = 0'],
      claim: L("yig'indi besh", 'сумма пять', 'the sum is five') },
    { id: 's2', yes: false,
      tokens: ['x² + 5x + 6 = 0'],
      claim: L("ko'paytma minus olti", 'произведение минус шесть', 'the product is minus six') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki mulohaza bitta tenglama haqida: biri yig'indi, ikkinchisi ko'paytma. Ikki qoida bir xil emas — biri ishorani almashtiradi, ikkinchisi yo'q.",
    'Два утверждения об одном уравнении: одно про сумму, другое про произведение. Два правила не одинаковы — одно меняет знак, другое нет.',
    'Two claims about one equation: one about the sum, one about the product. The two rules are not the same — one flips the sign, the other does not.'),
  ask: L(
    "Mulohaza rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Если утверждение верно — «Да», если ложно — «Нет».',
    'If the claim is true, «Yes»; if false, «No».'),
  correctText: L(
    "To'g'ri. Ikkalasi ham yolg'on, va ikkalasida ham ishora chalkashgan. Yig'indi minus p ga teng: p arti besh, demak yig'indi MINUS besh, arti besh emas. Ko'paytma esa q ning o'ziga teng, ya'ni bu yerda ishora ALMASHMAYDI: q arti olti, demak ko'paytma ham ARTI olti, minus olti emas. Tekshirish: ildizlar minus ikki va minus uch. Minus ikki qo'shuv minus uch minus besh; minus ikki karra minus uch arti olti — ikki minus arti beradi.",
    'Верно. Оба ложны, и в обоих перепутан знак. Сумма равна минус p: p плюс пять, значит сумма МИНУС пять, а не плюс пять. Произведение же равно самому q, то есть знак здесь НЕ меняется: q плюс шесть, значит и произведение ПЛЮС шесть, а не минус шесть. Проверка: корни минус два и минус три. Минус два плюс минус три минус пять; минус два на минус три плюс шесть — два минуса дают плюс.',
    'Correct. Both are false, and both confuse a sign. The sum equals minus p: p is plus five, so the sum is MINUS five, not plus five. The product equals q itself, so the sign does NOT flip here: q is plus six, so the product is PLUS six, not minus six. Check: the roots are minus two and minus three. Minus two plus minus three is minus five; minus two times minus three is plus six — two minuses give a plus.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi mulohazada ishora ortiqcha almashtirilgan. Ko'paytma q ning O'ZIGA teng: q arti olti, demak ko'paytma arti olti. Ishorani faqat yig'indi almashtiradi. Tekshirish: ildizlar minus ikki va minus uch, ikkalasi manfiy — manfiy karra manfiy MUSBAT beradi.",
      'Во втором утверждении знак изменён лишний раз. Произведение равно САМОМУ q: q плюс шесть, значит и произведение плюс шесть. Знак меняет только сумма. Проверка: корни минус два и минус три, оба отрицательны — минус на минус даёт ПЛЮС.',
      'The second claim flipped a sign it should not. The product equals q ITSELF: q is plus six, so the product is plus six. Only the sum flips the sign. Check: the roots are minus two and minus three, both negative — negative times negative gives a PLUS.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi mulohazada ishora almashtirilmagan. Yig'indi p ga emas, MINUS p ga teng: p arti beshga teng, demak yig'indi minus besh. Ildizlarni topib tekshiring: minus ikki va minus uch, ularning yig'indisi minus besh, arti besh emas.",
      'В первом утверждении знак не изменён. Сумма равна не p, а МИНУС p: p равно плюс пяти, значит сумма минус пять. Найди корни и проверь: минус два и минус три, их сумма минус пять, а не плюс пять.',
      'The first claim did not flip the sign. The sum equals not p but MINUS p: p is plus five, so the sum is minus five. Find the roots and check: minus two and minus three, and their sum is minus five, not plus five.') },
  ],
  wrongText: L(
    "Ikki qoidani ajratib eslang: YIG'INDI ishorani almashtiradi (minus p), KO'PAYTMA esa yo'q (q ning o'zi). Ildizlarni topib tekshirish mumkin.",
    'Различай два правила: СУММА меняет знак (минус p), а ПРОИЗВЕДЕНИЕ нет (само q). Можно найти корни и проверить.',
    'Keep the two rules apart: the SUM flips the sign (minus p), the PRODUCT does not (q itself). You can find the roots and check.'),
};

export default function D19_03(props) { return <TrueFalse data={DATA} {...props} />; }
