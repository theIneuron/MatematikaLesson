// Dars09 · Amaliyot 01 — Ha yoki yo'q · 🟢 · teg: sistema-ikkala-tenglama
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> TrueFalse.
//
// Uchta hukm uchta narsani ajratadi: yechim IKKALA tenglamani ham
// qanoatlantirishi, juftlikda TARTIB ahamiyatli ekani, va faqat bitta
// tenglamani qanoatlantirgan juftlik yechim emasligi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, TrueFalse } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'sistema-ikkala-tenglama', level: '🟢',
  eyebrow: L('Ha yoki yo\'q', 'Да или нет', 'Yes or no'),
  setup: L(
    "Sistema berilgan. Uch mulohaza uning yechimlari haqida.",
    'Дана система. Три суждения — про её решения.',
    'A system is given. Three claims are about its solutions.'),
  ask: L(
    "Har bir mulohaza uchun «Ha» yoki «Yo'q» ni tanlang.",
    'Для каждого суждения выбери «Да» или «Нет».',
    'Choose "Yes" or "No" for each claim.'),
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['x + y = 7'], ['xy = 12']],
  itemSize: 16,
  items: [
    { id: 's1', tokens: ['(3; 4)'], yes: true, claim: L(
      'sistemaning yechimi.', 'решение системы.', 'is a solution of the system.') },
    { id: 's2', tokens: ['(3; 4)', 'va', '(4; 3)'], yes: false, claim: L(
      'bitta va o\'sha yechim.', 'одно и то же решение.', 'are one and the same solution.') },
    { id: 's3', tokens: ['(2; 5)'], yes: false, claim: L(
      'ham sistemaning yechimi.', 'тоже решение системы.', 'is a solution of the system too.') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L('Yo\'q', 'Нет', 'No'),
  correctText: L(
    "To'g'ri, uchtasi ham. Yechim IKKALA tenglamani ham bir vaqtda qanoatlantirishi kerak: uch qo'shuv to'rt yetti, uch karra to'rt o'n ikki — ikkalasi ham bajarildi. Uch-to'rt va to'rt-uch esa boshqa-boshqa juftliklar: birinchisida iks uchga, ikkinchisida to'rtga teng. Ikki-besh esa faqat birinchi tenglamaga to'g'ri keladi, ko'paytmasi o'n ikki emas, o'n.",
    'Верно, все три. Решение должно удовлетворять ОБОИМ уравнениям сразу: три плюс четыре — семь, три умножить на четыре — двенадцать, оба выполнены. А три-четыре и четыре-три — разные пары: в первой икс равен трём, во второй четырём. Пара два-пять подходит только к первому уравнению: произведение там не двенадцать, а десять.',
    'Correct, all three. A solution must satisfy BOTH equations at once: three plus four is seven, three times four is twelve — both hold. Three-four and four-three are different pairs: in the first x is three, in the second it is four. The pair two-five fits only the first equation: its product is ten, not twelve.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s3') !== -1, text: L(
      "Ikki qo'shuv besh haqiqatan ham yetti. Lekin ikkinchi tenglamani ham tekshiring: ikki karra besh nechchi bo'ladi va u o'n ikkiga tengmi?",
      'Два плюс пять действительно семь. Но проверь и второе уравнение: сколько будет два умножить на пять и равно ли это двенадцати?',
      'Two plus five is indeed seven. But check the second equation too: what is two times five, and does it equal twelve?') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Juftlikda tartib ahamiyatli: birinchi son har doim iks, ikkinchisi igrek. Uch-to'rtda iks uchga teng, to'rt-uchda esa to'rtga — bu ikki xil yechim, garchi ikkalasi ham to'g'ri bo'lsa ham.",
      'В паре важен порядок: первое число — всегда икс, второе — игрек. В три-четыре икс равен трём, в четыре-три — четырём: это два разных решения, хотя оба верны.',
      'Order matters in a pair: the first number is always x, the second y. In three-four x is three, in four-three it is four — two different solutions, even though both are correct.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Uchni va to'rtni ikkala tenglamaga ham qo'ying: yig'indisi yetti, ko'paytmasi o'n ikki. Ikkalasi ham bajarilyapti.",
      'Подставь тройку и четвёрку в оба уравнения: сумма семь, произведение двенадцать. Оба выполняются.',
      'Put three and four into both equations: the sum is seven, the product is twelve. Both hold.') },
  ],
  wrongText: L(
    "Har juftlikni IKKALA tenglamaga ham qo'ying. Bittasi bajarilib, ikkinchisi bajarilmasa, bu juftlik yechim emas.",
    'Подставляй каждую пару в ОБА уравнения. Если одно выполняется, а другое нет, пара решением не является.',
    'Put every pair into BOTH equations. If one holds and the other does not, the pair is not a solution.'),
};

export default function D09_01(props) { return <TrueFalse data={DATA} {...props} />; }
