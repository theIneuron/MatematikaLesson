// Dars08 · Amaliyot 07 — Ildiz · 🟡 · teg: butun-deb-kasr-oqish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> TypeSet.
//
// MATEMATIKA: 10/(x + 3) = 2 → 10 = 2(x + 3) → 5 = x + 3 → x = 2.
// Tuzoq 7: maxrajni o'nga teng deb olish. Tuzoq −1: 10 = 2x + 3.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { TypeSet } from '../asboblar9.jsx';

const DATA = {
  tag: 'butun-deb-kasr-oqish', level: '🟡',
  eyebrow: L('Ildiz', 'Корень', 'Root'),
  setup: L(
    "Ikkala tomonni maxrajga ko'paytiring, keyin hosil bo'lgan tenglamani yeching.",
    'Умножь обе части на знаменатель, потом реши получившееся уравнение.',
    'Multiply both sides by the denominator, then solve the equation you get.'),
  ask: L('Tenglamaning ildizini yozing.', 'Напиши корень уравнения.', 'Write the root of the equation.'),
  hint: L('Javob bitta son.', 'Ответ — одно число.', 'The answer is a single number.'),
  placeholder: '0',
  expr: [{ n: '10', d: 'x + 3' }, '= 2'],
  answer: [2],
  correctText: L(
    "To'g'ri, ikki. Ikkala tomonni iks qo'shuv uchga ko'paytirsak, o'n ikki karra qavsga teng bo'ladi; ikkiga bo'lsak besh teng iks qo'shuv uch, ya'ni iks ikkiga teng. ODZ esa iks minus uchga teng emas — ikki unga kiradi, demak ildiz haqiqiy.",
    'Верно, два. Умножив обе части на икс плюс три, получим десять равно двум умножить на скобку; разделив на два, получим пять равно икс плюс три, то есть икс равен двум. ОДЗ здесь икс не равен минус трём — двойка в него входит, значит корень настоящий.',
    'Correct, two. Multiplying both sides by x plus three gives ten equals two times the bracket; dividing by two gives five equals x plus three, so x is two. The domain is x not equal to minus three — two belongs to it, so the root is genuine.'),
  wrongs: [
    { when: (s) => s.has(7), text: L(
      "Maxrajni o'nga teng deb oldingiz. Tenglikning o'ng tomonida esa ikki turibdi: o'n ikkiga bo'linganda maxraj nechchi bo'lishi kerak?",
      'Ты приравнял знаменатель к десяти. Но в правой части стоит двойка: каким должен быть знаменатель, чтобы десять, делённое на него, дало два?',
      'You set the denominator equal to ten. But the right-hand side is two: what must the denominator be so that ten divided by it gives two?') },
    { when: (s) => s.has(-1), text: L(
      "Ko'paytirishda ikki faqat iksga tushdi. Ikkini QAVSGA ko'paytiring: u ikkala hadga ham tegishli.",
      'При умножении двойка попала только на икс. Умножь двойку на СКОБКУ: она относится к обоим слагаемым.',
      'While multiplying, the two reached only the x. Multiply the two by the BRACKET: it applies to both terms.') },
    { when: (s) => s.has(-3), text: L(
      "Minus uch — ODZ dan chiqarilgan son, ildiz emas. Uni qo'ysangiz maxraj nolga aylanadi.",
      'Минус три — исключённое из ОДЗ число, а не корень. При его подстановке знаменатель обращается в нуль.',
      'Minus three is the number excluded from the domain, not a root. Substituting it makes the denominator zero.') },
    { when: (s) => s.has(5), text: L(
      "Besh — oraliq natija: u maxrajning qiymati. Iks qo'shuv uch beshga teng bo'lsa, iks nimaga teng?",
      'Пятёрка — промежуточный результат: это значение знаменателя. Если икс плюс три равно пяти, чему равен икс?',
      'Five is an intermediate result: it is the value of the denominator. If x plus three is five, what does x equal?') },
  ],
  wrongText: L(
    "Ikkala tomonni maxrajga ko'paytiring va qavsni to'liq oching. Javobni ODZ bilan solishtirishni ham unutmang.",
    'Умножь обе части на знаменатель и раскрой скобку полностью. Не забудь сверить ответ с ОДЗ.',
    'Multiply both sides by the denominator and open the bracket fully. Do not forget to check the answer against the domain.'),
};

export default function D08_07(props) { return <TypeSet data={DATA} {...props} />; }
