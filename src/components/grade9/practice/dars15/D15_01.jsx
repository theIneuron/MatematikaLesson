// Dars15 · Amaliyot 01 — Ha/yo'q · 🟢 · teg: har-safar-almashadi-deb-oylash
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> TrueFalse.
//
// Uchala hukm bitta ko'paytmaning uch tomonini tekshiradi: takroriy
// ko'paytuvchi, ildizlar SONI, va qat'iy belgida chegara nuqtalar.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, TrueFalse } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'har-safar-almashadi-deb-oylash', level: '🟢',
  eyebrow: L('Ha yoki yo\'q', 'Да или нет', 'Yes or no'),
  setup: L(
    "Ko'paytma allaqachon ko'paytuvchilarga ajratilgan, belgisi qat'iy.",
    'Произведение уже разложено на множители, знак строгий.',
    'The product is already factored, and the sign is strict.'),
  ask: L(
    "Har bir hukm uchun «Ha» yoki «Yo'q» ni tanlang.",
    'Для каждого суждения выбери «Да» или «Нет».',
    'Choose "Yes" or "No" for each claim.'),
  givenLabel: L('Tengsizlik', 'Неравенство', 'Inequality'),
  given: [['(x + 2)²(x − 3) > 0']],
  itemSize: 15,
  items: [
    { id: 's1', tokens: ['x = −2'], yes: true, claim: L(
      "— takroriy ildiz, unda ishora almashmaydi.",
      '— повторяющийся корень, в нём знак не меняется.',
      'is a repeated root, and the sign does not change there.') },
    { id: 's2', tokens: ['(x + 2)²(x − 3)'], yes: false, claim: L(
      "— uchta HAR XIL ildizga ega.",
      '— имеет три РАЗНЫХ корня.',
      'has three DIFFERENT roots.') },
    { id: 's3', tokens: ['x = 3'], yes: false, claim: L(
      "— javobga kiradi.",
      '— входит в ответ.',
      'belongs to the answer.') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L('Yo\'q', 'Нет', 'No'),
  correctText: L(
    "To'g'ri. Minus ikki takroriy ildiz: qavs kvadratda turgani uchun undan o'tishda ishora ikki marta almashadi, ya'ni o'zgarmaydi. Har xil ildizlar esa ikkita — minus ikki va uch, uchinchisi yo'q: kvadrat qo'shimcha ildiz emas, o'sha ildizni ikki marta beradi. Uchning o'zi javobga kirmaydi, chunki belgi qat'iy: u yerda ko'paytma nolga teng, noldan katta emas.",
    'Верно. Минус два — повторяющийся корень: скобка стоит в квадрате, поэтому при переходе через неё знак меняется дважды, то есть не меняется. Разных корней всего два — минус два и три, третьего нет: квадрат не даёт нового корня, он даёт тот же корень дважды. А сама тройка в ответ не входит, ведь знак строгий: там произведение равно нулю, а не больше нуля.',
    'Correct. Minus two is a repeated root: the bracket is squared, so crossing it flips the sign twice, that is, not at all. There are only two distinct roots — minus two and three; there is no third: a square adds no new root, it gives the same root twice. And three itself is not in the answer, since the sign is strict: the product equals zero there, not more than zero.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Qavs KVADRATDA turibdi, ya'ni ko'paytmada u ikki marta uchraydi. Ikki marta almashish bir-birini bekor qiladi: ishora saqlanadi.",
      'Скобка стоит в КВАДРАТЕ, то есть в произведении она встречается дважды. Двойная перемена знака взаимно уничтожается: знак сохраняется.',
      'The bracket is SQUARED, so it occurs twice in the product. Two sign flips cancel each other: the sign is kept.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ildizlarni sanab chiqing: qavslar nolga aylanadigan joylar minus ikki va uch — ikkita son. Kvadrat yangi ildiz keltirmaydi.",
      'Пересчитай корни: скобки обращаются в нуль при минус двух и трёх — два числа. Квадрат нового корня не добавляет.',
      'Count the roots: the brackets vanish at minus two and three — two numbers. A square brings no new root.') },
    { when: (s) => s.bad.indexOf('s3') !== -1, text: L(
      "Uchni ko'paytmaga qo'ying: oxirgi qavs nolga aylanadi, butun ko'paytma ham nol. Nol esa noldan katta emas, belgi qat'iy.",
      'Подставь три в произведение: последняя скобка обращается в нуль, и всё произведение нуль. А нуль не больше нуля, знак строгий.',
      'Substitute three into the product: the last bracket becomes zero, and so does the whole product. And zero is not greater than zero, the sign is strict.') },
  ],
  wrongText: L(
    "Ikkita savolga alohida javob bering: qaysi qavs ikki marta uchraydi, va qat'iy belgi ildiz nuqtalarini javobga kiritadimi?",
    'Ответь на два вопроса по отдельности: какая скобка встречается дважды, и включает ли строгий знак точки корней в ответ?',
    'Answer two questions separately: which bracket occurs twice, and does a strict sign include the root points in the answer?'),
};

export default function D15_01(props) { return <TrueFalse data={DATA} {...props} />; }
