// Dars11 · Amaliyot 02 — Ha/yo'q · 🟢 · teg: notogri-orniga-qoyish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> TrueFalse.
//
// Uchala hukm ham BITTA savolga qaytadi: ifoda QAYSI tenglamaga qo'yiladi.
// Ikkinchi hukm — darsning asosiy tuzog'i: o'z tenglamasiga qaytarish.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, TrueFalse } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'notogri-orniga-qoyish', level: '🟢',
  eyebrow: L('Ha yoki yo\'q', 'Да или нет', 'Yes or no'),
  setup: L(
    "Birinchi tenglamada iks allaqachon ifodalangan. Uch hukm shu ifoda bilan nima qilish mumkinligi haqida.",
    'В первом уравнении икс уже выражен. Три суждения — о том, что с этим выражением можно делать.',
    'In the first equation x is already expressed. Three claims are about what may be done with that expression.'),
  ask: L(
    "Har bir hukm uchun «Ha» yoki «Yo'q» ni tanlang.",
    'Для каждого суждения выбери «Да» или «Нет».',
    'Choose "Yes" or "No" for each claim.'),
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['x = 2y + 1'], ['x + y = 7']],
  itemSize: 15,
  items: [
    { id: 's1', tokens: ['2y + 1'], yes: true, claim: L(
      "ni ikkinchi tenglamadagi iksning o'rniga qo'yish mumkin.",
      'можно подставить вместо икса во второе уравнение.',
      'may be substituted for x in the second equation.') },
    { id: 's2', tokens: ['2y + 1'], yes: false, claim: L(
      "ni O'Z tenglamasiga qaytarib qo'ysak, igrek topiladi.",
      'если подставить обратно в ЕГО ЖЕ уравнение, найдётся игрек.',
      'if substituted back into ITS OWN equation, gives y.') },
    { id: 's3', tokens: ['y = 2'], yes: true, claim: L(
      "topilgach, iks o'sha ifodadan topiladi.",
      'найден — икс находится из того же выражения.',
      'once found, x comes from that same expression.') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L('Yo\'q', 'Нет', 'No'),
  correctText: L(
    "To'g'ri. Ifoda IKKINCHI tenglamaga qo'yiladi: ikki igrek qo'shuv bir, qo'shuv igrek yettiga teng, ya'ni uch igrek olti, igrek ikki. Undan keyin iks o'sha ifodadan chiqadi: ikki karra ikki qo'shuv bir, ya'ni besh. O'z tenglamasiga qaytarish esa hech nima bermaydi — bu yerda usulning butun ma'nosi: bitta tenglamadan olingan ifoda IKKINCHISIGA yuboriladi.",
    'Верно. Выражение подставляют во ВТОРОЕ уравнение: два игрека плюс один, плюс игрек равно семи, то есть три игрека — шесть, игрек — два. После этого икс выходит из того же выражения: дважды два плюс один, то есть пять. А подстановка в своё же уравнение не даёт ничего — в этом весь смысл способа: выражение из одного уравнения отправляется во ВТОРОЕ.',
    'Correct. The expression goes into the SECOND equation: two y plus one, plus y equals seven, so three y is six and y is two. Then x comes out of the same expression: twice two plus one, that is five. Putting it back into its own equation gives nothing — and that is the whole point of the method: an expression from one equation is sent into the OTHER.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ifodani o'z tenglamasiga qaytarib qo'ying va nima chiqishini ko'ring: iks o'rniga ikki igrek qo'shuv bir yozilsa, ikkala tomonda bir xil narsa turadi. Bunday tenglikdan igrek topilmaydi.",
      'Подставь выражение обратно в его же уравнение и посмотри, что выйдет: если вместо икса написать два игрека плюс один, в обеих частях окажется одно и то же. Из такого равенства игрек не находится.',
      'Substitute the expression back into its own equation and see what happens: writing two y plus one for x leaves the same thing on both sides. Such an identity gives no y.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Ifoda tayyor turibdi. Ikkinchi tenglamadagi iksning o'rniga uni yozing — o'sha tenglamada faqat igrek qoladi va u yechiladi.",
      'Выражение уже готово. Напиши его вместо икса во втором уравнении — там останется один игрек, и уравнение решится.',
      'The expression is ready. Write it in place of x in the second equation — only y will be left there, and it can be solved.') },
    { when: (s) => s.bad.indexOf('s3') !== -1, text: L(
      "Sistemaning javobi — JUFTLIK, bitta son emas. Igrek topilgach, uni ifodaga qo'yib iksni ham topish kerak.",
      'Ответ системы — ПАРА, а не одно число. После игрека надо подставить его в выражение и найти икс.',
      'The answer of a system is a PAIR, not one number. After y is found, put it into the expression and find x too.') },
  ],
  wrongText: L(
    "Har bir hukmni shu savol bilan tekshiring: ifoda QAYSI tenglamaga yuborilyapti, o'zinikigami yoki ikkinchisigami?",
    'Проверяй каждое суждение вопросом: в КАКОЕ уравнение отправляется выражение — в своё или во второе?',
    'Test each claim with this question: into WHICH equation is the expression sent — its own, or the other one?'),
};

export default function D11_02(props) { return <TrueFalse data={DATA} {...props} />; }
