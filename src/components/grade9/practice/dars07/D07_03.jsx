// Dars07 · Amaliyot 03 — Ha yoki yo'q · 🟢 · teg: butun-vs-kasr-tenglama
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> TrueFalse.
//
// Butun tenglamani kasr-ratsionalidan ajratish: farq MAXRAJDA harf
// borligida, tenglamaning murakkabligida emas.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, TrueFalse } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'butun-vs-kasr-tenglama', level: '🟢',
  eyebrow: L('Ha yoki yo\'q', 'Да или нет', 'Yes or no'),
  setup: L(
    "Uch yozuv berilgan. Butun tenglamada maxrajda harf turmaydi.",
    'Даны три записи. У целого уравнения в знаменателе нет буквы.',
    'Three records are given. An integer equation has no letter in the denominator.'),
  ask: L(
    "Har bir mulohaza uchun «Ha» yoki «Yo'q» ni tanlang.",
    'Для каждого суждения выбери «Да» или «Нет».',
    'Choose "Yes" or "No" for each claim.'),
  itemSize: 15,
  items: [
    { id: 's1', tokens: ['3(x − 4) = x + 2'], yes: true, claim: L(
      'butun tenglama.', 'целое уравнение.', 'is an integer equation.') },
    { id: 's2', tokens: ['5/(x − 1) = 2'], yes: false, claim: L(
      'ham butun tenglama.', 'тоже целое уравнение.', 'is an integer equation too.') },
    { id: 's3', tokens: ['x² − 2x = 5'], yes: true, claim: L(
      'ham butun tenglama.', 'тоже целое уравнение.', 'is an integer equation too.') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L('Yo\'q', 'Нет', 'No'),
  correctText: L(
    "To'g'ri, uchtasi ham. Butun tenglamani daraja yoki qavslar emas, MAXRAJ belgilaydi: agar iks maxrajda turmasa, tenglama butun. Shuning uchun iks kvadratli yozuv ham butun, kasrli yozuv esa yo'q — undagi iks maxrajda.",
    'Верно, все три. Целое уравнение определяется не степенью и не скобками, а ЗНАМЕНАТЕЛЕМ: если икс не стоит в знаменателе, уравнение целое. Поэтому запись с икс в квадрате тоже целая, а дробная — нет: там икс в знаменателе.',
    'Correct, all three. What makes an equation integer is not the power or the brackets but the DENOMINATOR: if x is not in a denominator, the equation is integer. So the record with x squared is integer too, while the fractional one is not — its x sits in the denominator.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Bu yozuvda iks MAXRAJDA turibdi. Shuning uchun uni yechishdan oldin ODZ yozish kerak — butun tenglamada bunday shart yo'q.",
      'В этой записи икс стоит В ЗНАМЕНАТЕЛЕ. Поэтому перед решением нужно выписать ОДЗ — у целого уравнения такого условия нет.',
      'In this record x stands IN THE DENOMINATOR. That is why the domain must be written before solving — an integer equation has no such condition.') },
    { when: (s) => s.bad.indexOf('s3') !== -1, text: L(
      "Iks kvadrat butun ifodaning bir qismi: ko'phadlar qo'shish, ayirish va ko'paytirish bilan tuziladi, daraja esa ko'paytirishning o'zi.",
      'Икс в квадрате — часть целого выражения: многочлены строятся сложением, вычитанием и умножением, а степень и есть умножение.',
      'x squared is part of an integer expression: polynomials are built from addition, subtraction and multiplication, and a power is just multiplication.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Bu yozuvda maxrajda harf yo'q, faqat qavs bor. Qavs butunlikni buzmaydi — u ochilganda oddiy ko'phad qoladi.",
      'В этой записи буквы в знаменателе нет, есть только скобка. Скобка целостности не нарушает — при раскрытии останется обычный многочлен.',
      'This record has no letter in a denominator, only a bracket. A bracket does not break integrality — once opened, an ordinary polynomial is left.') },
  ],
  wrongText: L(
    "Har yozuvda bitta joyga qarang: maxrajda iks bormi? Javob shundan chiqadi.",
    'Смотри в каждой записи в одно место: есть ли икс в знаменателе? Ответ выходит из этого.',
    'Look at one place in every record: is there an x in a denominator? The answer follows from that.'),
};

export default function D07_03(props) { return <TrueFalse data={DATA} {...props} />; }
