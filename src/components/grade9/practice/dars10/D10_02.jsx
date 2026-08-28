// Dars10 · Amaliyot 02 — Ha/yo'q · 🟢 · teg: nechta-kesishish-notogri
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> TrueFalse.
//
// Uchala mulohaza ham kesishishlar SONI haqida. Tuzoq — «doim bitta».
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, TrueFalse } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'nechta-kesishish-notogri', level: '🟢',
  eyebrow: L('Ha yoki yo\'q', 'Да или нет', 'Yes or no'),
  setup: L(
    "Bitta tekislikda chiziq va parabola turibdi. Uch mulohaza ularning umumiy nuqtalari soni haqida.",
    'На одной плоскости стоят прямая и парабола. Три суждения — про число их общих точек.',
    'A line and a parabola stand on one plane. Three claims are about the number of their common points.'),
  ask: L(
    "Har bir mulohaza uchun «Ha» yoki «Yo'q» ni tanlang.",
    'Для каждого суждения выбери «Да» или «Нет».',
    'Choose "Yes" or "No" for each claim.'),
  itemSize: 15,
  items: [
    { id: 's1', tokens: ['2'], yes: true, claim: L(
      "ta umumiy nuqta — shunday bo'lishi mumkin.",
      'общие точки — так бывает.',
      'common points — this is possible.') },
    { id: 's2', tokens: ['0'], yes: true, claim: L(
      'ta umumiy nuqta — bu ham mumkin.',
      'общих точек — так тоже бывает.',
      'common points — this happens too.') },
    { id: 's3', tokens: ['1'], yes: false, claim: L(
      "ta umumiy nuqta — yagona mumkin bo'lgan hol.",
      'общая точка — единственно возможный случай.',
      'common point — the only possible case.') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L('Yo\'q', 'Нет', 'No'),
  correctText: L(
    "To'g'ri. Chiziqni parabola bo'ylab yuqoriga surib boring: avval u parabolani ikki joyda kesadi, keyin faqat urinib o'tadi, keyin esa umuman tegmaydi. Demak umumiy nuqtalar soni ikkita, bitta yoki nolta bo'lishi mumkin — bu tenglashtirishdan chiqqan kvadrat tenglamaning nechta ildizi borligi bilan bir xil savol.",
    'Верно. Двигай прямую вдоль параболы вверх: сначала она пересекает параболу в двух местах, потом лишь касается, а потом не задевает вовсе. Значит, общих точек может быть две, одна или ни одной — это тот же вопрос, сколько корней у квадратного уравнения, полученного приравниванием.',
    'Correct. Slide the line up along the parabola: first it crosses in two places, then it only touches, then it misses entirely. So the number of common points can be two, one, or none — the same question as how many roots the quadratic from equating them has.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s3') !== -1, text: L(
      "Bitta nuqta — bu faqat URINISH holati, ya'ni maxsus hol. Chiziqni parabolaga nisbatan yuqoriroq yoki pastroq suring va nechta kesishish qolganini sanang.",
      'Одна точка — это только случай КАСАНИЯ, то есть особый случай. Сдвинь прямую выше или ниже относительно параболы и сосчитай, сколько пересечений осталось.',
      'One point is only the TOUCHING case, a special one. Move the line higher or lower relative to the parabola and count how many crossings remain.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Parabola butun tekislikni to'ldirmaydi: uning ustida ham, ostida ham bo'sh joy bor. O'sha bo'sh joydan o'tgan chiziq parabolaga tegmaydi.",
      'Парабола не заполняет всю плоскость: и над ней, и под ней есть пустое место. Прямая, прошедшая по этому пустому месту, параболы не касается.',
      'A parabola does not fill the plane: there is empty room above it and below it. A line running through that empty room never touches the parabola.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Tenglashtirsak, kvadrat tenglama hosil bo'ladi. Kvadrat tenglamaning nechta ildizi bo'lishi mumkinligini eslang — har bir ildiz bitta umumiy nuqta beradi.",
      'Приравняв, получим квадратное уравнение. Вспомни, сколько корней бывает у квадратного уравнения, — каждый корень даёт одну общую точку.',
      'Equating gives a quadratic equation. Recall how many roots a quadratic can have — each root gives one common point.') },
  ],
  wrongText: L(
    "Tenglashtirishdan chiqqan kvadrat tenglamaning ildizlari soni bilan umumiy nuqtalar soni bir xil. Kvadrat tenglamada esa ildiz ikkita, bitta yoki umuman bo'lmasligi mumkin.",
    'Число общих точек совпадает с числом корней квадратного уравнения, полученного приравниванием. А у квадратного уравнения корней бывает два, один или ни одного.',
    'The number of common points equals the number of roots of the quadratic obtained by equating. And a quadratic has two roots, one, or none.'),
};

export default function D10_02(props) { return <TrueFalse data={DATA} {...props} />; }
