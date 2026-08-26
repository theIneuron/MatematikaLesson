// Dars48 · Amaliyot 02 — Yoy · 🟢 · tag: major_arc
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §10 (48-dars, 2-pozitsiya)
//
// KATTA YOY 360 DAN AYIRISH BILAN TOPILADI (T2). Markaziy burchak bir yuz
// o'n besh gradus, ya'ni katta yoy ikki yuz qirq besh.
// Tuzoqlar: 115 (З103 — katta yoyni burchakka tenglash), 65 (180 dan ayirish),
// 180 (yarim aylana). Razbor javobni yig'indi bilan tekshiradi (З16).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'major_arc', level: '🟢',
  target: 245, allowNeg: false,
  given: [['∠AOB = 115°']],
  givenLabel: L('Markaziy burchak', 'Центральный угол', 'The central angle'),
  eyebrow: L('Yoy', 'Дуга', 'Arc'),
  setup: L(
    "Aylananing markazi O, unda A va B nuqtalari belgilangan. Markaziy burchak ∠AOB bir yuz o'n besh gradusga teng. A va B nuqtalari aylanani ikki yoyga bo'ladi, va ularning gradus o'lchovlari yig'indisi uch yuz oltmish gradus.",
    'Центр окружности O, на ней отмечены точки A и B. Центральный угол ∠AOB равен ста пятнадцати градусам. Точки A и B делят окружность на две дуги, и сумма их градусных мер равна трёмстам шестидесяти градусам.',
    'The centre of the circle is O with the points A and B marked on it. The central angle ∠AOB is one hundred fifteen degrees. The points A and B split the circle into two arcs whose degree measures add up to three hundred sixty degrees.'),
  label: L('Katta yoy, gradus', 'Большая дуга, градусов', 'The major arc, degrees'),
  ask: L(
    'Katta yoy AB nechaga teng?',
    'Чему равна большая дуга AB?',
    'What is the major arc AB?'),
  correctText: L(
    "To'g'ri. Kichik yoyning o'lchovi markaziy burchakka teng, ya'ni bir yuz o'n besh gradus. Katta yoy esa aylananing qolgan qismi: uch yuz oltmish minus bir yuz o'n besh, ya'ni ikki yuz qirq besh gradus. Tekshirish oson: bir yuz o'n besh qo'shuv ikki yuz qirq besh uch yuz oltmish — butun aylana. Nima uchun markaziy burchakning o'zi ikki yuz qirq besh bo'lolmaydi: burchak bir yuz saksondan katta bo'lolmaydi, aylana esa uch yuz oltmish gradus — shuning uchun katta yoy uchun burchak yetmaydi va ayirish kerak bo'ladi.",
    'Верно. Мера малой дуги равна центральному углу, то есть ста пятнадцати градусам. А большая дуга — остаток окружности: триста шестьдесят минус сто пятнадцать, то есть двести сорок пять градусов. Проверка простая: сто пятнадцать плюс двести сорок пять — триста шестьдесят, вся окружность. Почему сам центральный угол не может быть двести сорок пять: угол не бывает больше ста восьмидесяти, а окружность — триста шестьдесят градусов, поэтому для большой дуги угла не хватает и нужно вычитание.',
    'Correct. The measure of the minor arc equals the central angle, one hundred fifteen degrees. The major arc is the rest of the circle: three hundred sixty minus one hundred fifteen, that is two hundred forty five degrees. An easy check: one hundred fifteen plus two hundred forty five is three hundred sixty, the whole circle. Why the central angle itself cannot be two hundred forty five: an angle never exceeds one hundred eighty, while the circle is three hundred sixty degrees — so for the major arc the angle falls short and a subtraction is needed.'),
  wrongs: [
    { when: (s) => s.value === 115, text: L(
      "Bir yuz o'n besh — bu KICHIK yoyning o'lchovi, u markaziy burchakka teng. Katta yoy esa boshqa yoy: uni topish uchun uch yuz oltmishdan burchakni ayirish kerak. Ikki yoyning o'lchovi bir xil bo'lolmaydi, aks holda ularning yig'indisi ikki yuz o'ttiz bo'lardi, uch yuz oltmish emas.",
      'Сто пятнадцать — это мера МАЛОЙ дуги, она равна центральному углу. А большая дуга другая: чтобы её найти, надо из трёхсот шестидесяти вычесть угол. Меры двух дуг не могут быть одинаковыми, иначе их сумма была бы двести тридцать, а не триста шестьдесят.',
      'One hundred fifteen is the measure of the MINOR arc, equal to the central angle. The major arc is a different one: to find it, subtract the angle from three hundred sixty. The two arcs cannot share a measure, otherwise their sum would be two hundred thirty, not three hundred sixty.') },
    { when: (s) => s.value === 65, text: L(
      "Oltmish besh — bir yuz saksondan ayirilgan. Lekin aylana bir yuz sakson gradus emas, uch yuz oltmish gradus: bir yuz sakson — bu faqat YARIM aylana. To'liq aylanadan ayiring: uch yuz oltmish minus bir yuz o'n besh.",
      'Шестьдесят пять — вычитание из ста восьмидесяти. Но окружность не сто восемьдесят градусов, а триста шестьдесят: сто восемьдесят — это лишь ПОЛОВИНА окружности. Вычитай из полной окружности: триста шестьдесят минус сто пятнадцать.',
      'Sixty five means subtracting from one hundred eighty. But a circle is not one hundred eighty degrees, it is three hundred sixty: one hundred eighty is only HALF the circle. Subtract from the full circle: three hundred sixty minus one hundred fifteen.') },
    { when: (s) => s.value === 180 || s.value === 360 || s.value === 230, text: L(
      "Bu son aylananing o'lchovlaridan biri, lekin javob emas. Bosqichma-bosqich yuring: kichik yoy bir yuz o'n besh, butun aylana uch yuz oltmish, katta yoy esa ularning ayirmasi — ikki yuz qirq besh. Javobni har doim tekshiring: ikki yoyning yig'indisi uch yuz oltmish chiqishi kerak.",
      'Это число — одна из мер окружности, но не ответ. Иди по шагам: малая дуга сто пятнадцать, вся окружность триста шестьдесят, большая дуга — их разность, двести сорок пять. Всегда проверяй ответ: сумма двух дуг должна дать триста шестьдесят.',
      'This number is one of the measures of the circle, but not the answer. Go step by step: the minor arc is one hundred fifteen, the whole circle three hundred sixty, the major arc their difference — two hundred forty five. Always check the answer: the two arcs must add to three hundred sixty.') },
  ],
  wrongText: L(
    "Katta yoy uchun 360 dan markaziy burchakni ayiring, keyin ikki yoyni qo'shib tekshiring.",
    'Для большой дуги вычти центральный угол из 360, потом проверь, сложив две дуги.',
    'For the major arc subtract the central angle from 360, then check by adding the two arcs.'),
};

export default function D48_02(props) { return <TypeValue data={DATA} {...props} />; }
