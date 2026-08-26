// Dars54 · Amaliyot 02 — Ha yoki yo'q · 🟢 · tag: scalar_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §6 (54-dars, 2-pozitsiya)
//
// JAVOB: YO'Q, YO'Q (skelet §0a.1). Ikkala da'vo ham З114 ning IKKI
// TOMONI:
//   yo'nalish tomoni — (−2)a⃗ a⃗ bilan bir xil yo'nalgan deb aytilgan
//   modul tomoni     — |(−2)a⃗| = −2|a⃗| deb aytilgan
// Ikkinchi tomoni odatda umuman ko'rilmaydi: modul manfiy bo'lolmasligini
// o'quvchi hech qayerda tekshirmaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'scalar_claims', level: '🟢',
  itemSize: 15,
  items: [
    { id: 's1', yes: false, tokens: ['(−2)a'],
      claim: L(
        "a bilan bir xil yo'nalgan",
        'сонаправлен с a',
        'points the same way as a') },
    { id: 's2', yes: false, tokens: ['|(−2)a| = −2|a|'],
      claim: L('bu tenglik rost', 'это равенство верно', 'this equality is true') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki da'vo, ikkalasi ham bitta vektor haqida: minus ikki karra a. Birinchisi uning YO'NALISHI haqida, ikkinchisi uning MODULI, ya'ni uzunligi haqida.",
    'Два утверждения, оба об одном векторе: минус два a. Первое о его НАПРАВЛЕНИИ, второе о его МОДУЛЕ, то есть длине.',
    'Two statements, both about one vector: minus two a. The first is about its DIRECTION, the second about its MODULUS, that is, its length.'),
  ask: L(
    "Da'vo rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Если утверждение верно — «Да», если ложно — «Нет».',
    'If the statement is true, «Yes»; if false, «No».'),
  correctText: L(
    "To'g'ri, ikkalasi ham yolg'on, va ular bitta xatoning ikki tomoni. Koeffitsiyent manfiy bo'lsa, vektor TESKARI buriladi — demak birinchi da'vo yolg'on. Modul esa uzunlik, va uzunlik manfiy bo'lolmaydi: minus ikki karra a ning moduli ikki karra a ning moduli, ya'ni ikki karra uzun. Formulada koeffitsiyent MODUL ostiga kiradi: k karra a ning moduli k ning moduli karra a ning moduliga teng.",
    'Верно, оба ложны, и это две стороны одной ошибки. Если коэффициент отрицателен, вектор РАЗВОРАЧИВАЕТСЯ — значит первое утверждение ложно. А модуль это длина, и длина отрицательной не бывает: модуль минус два a равен двум модулям a, то есть вдвое длиннее. В формуле коэффициент входит ПОД модуль: модуль k на a равен модулю k на модуль a.',
    'Correct, both are false, and they are two sides of one error. When the coefficient is negative the vector REVERSES — so the first statement is false. And a modulus is a length, and a length is never negative: the modulus of minus two a is two moduli of a, that is, twice as long. In the formula the coefficient goes UNDER the modulus: the modulus of k times a equals the modulus of k times the modulus of a.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi da'vo YOLG'ON. Koeffitsiyent manfiy bo'lganda vektor teskari yo'nalishga buriladi — bu songa ko'paytirishning qoq qoidasi. Minus ikki karra a a bilan bir chiziqda yotadi, ya'ni kollinear, lekin qarama-qarshi tomonga qaraydi. Kollinear bo'lish va bir xil yo'nalgan bo'lish — ikki boshqa narsa.",
      'Первое утверждение ЛОЖНО. При отрицательном коэффициенте вектор разворачивается в противоположную сторону — это и есть правило умножения на число. Минус два a лежит с a на одной прямой, то есть коллинеарен, но смотрит в другую сторону. Быть коллинеарным и быть сонаправленным это разные вещи.',
      'The first statement is FALSE. With a negative coefficient the vector turns to the opposite direction — that is the very rule of multiplying by a number. Minus two a lies along the same line as a, so it is collinear, but it points the other way. Being collinear and pointing the same way are two different things.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi da'vo ham YOLG'ON, va bu tomoni odatda umuman ko'rilmaydi. O'ng tomonda manfiy son turibdi, chap tomonda esa MODUL — ya'ni uzunlik. Uzunlik manfiy bo'lolmaydi, demak tenglik allaqachon buzilgan. To'g'ri yozuv: minus ikki karra a ning moduli ikki karra a ning moduliga teng, chunki formulada koeffitsiyent modul ostiga kiradi.",
      'Второе утверждение тоже ЛОЖНО, и эту сторону обычно вообще не замечают. Справа стоит отрицательное число, а слева МОДУЛЬ, то есть длина. Длина отрицательной не бывает, значит равенство нарушено уже этим. Верная запись: модуль минус два a равен двум модулям a, ведь в формуле коэффициент входит под модуль.',
      'The second statement is FALSE too, and this side usually goes unnoticed. On the right stands a negative number, on the left a MODULUS, that is, a length. A length is never negative, so the equality is already broken. The correct record: the modulus of minus two a equals two moduli of a, since in the formula the coefficient goes under the modulus.') },
  ],
  wrongText: L(
    "Manfiy koeffitsiyent yo'nalishni buradi, modulni esa manfiy qilmaydi: u modul ostiga kiradi.",
    'Отрицательный коэффициент разворачивает направление, но модуль отрицательным не делает: он входит под модуль.',
    'A negative coefficient reverses the direction but does not make the modulus negative: it goes under the modulus.'),
};

export default function D54_02(props) { return <TrueFalse data={DATA} {...props} />; }
