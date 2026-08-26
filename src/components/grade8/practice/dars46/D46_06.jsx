// Dars46 · Amaliyot 06 — Balandlik · 🟡 · tag: height_from_area
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §8 (46-dars, 6-pozitsiya)
//
// OLDINGI TOPSHIRIQNING DAVOMI: u yerda 10, 17, 21 uchburchagining yuzi
// Geron formulasi bilan sakson to'rt bo'lib chiqqan edi. Endi shu yuzadan
// BALANDLIK topiladi — 41-darsning formulasi teskari yo'nalishda: h = 2S : a.
//
// Bu darsning butun g'oyasi shu: tomonlardan yuza, yuzadan esa balandlik.
// Balandlikni to'g'ridan-to'g'ri o'lchash kerak emas.
// Tuzoqlar: 4 (ikkilantirish unutilgan), 168 (ikkilangan yuzaning o'zi), 16.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'height_from_area', level: '🟡',
  target: 8, allowNeg: false,
  given: [['10, 17, 21'], ['S = 84']],
  givenLabel: L('Tomonlar va yuza', 'Стороны и площадь', 'The sides and the area'),
  eyebrow: L('Balandlik', 'Высота', 'Height'),
  setup: L(
    "Uchburchakning tomonlari o'n, o'n yetti va yigirma bir, yuzasi esa sakson to'rt — u Geron formulasi bilan topilgan. Endi yigirma bir tomoniga mos balandlikni topish kerak.",
    'Стороны треугольника десять, семнадцать и двадцать один, а площадь восемьдесят четыре — она найдена по формуле Герона. Теперь надо найти высоту, соответствующую стороне двадцать один.',
    'The sides of a triangle are ten, seventeen and twenty one, and its area is eighty four — found by Heron formula. Now the height matching the side twenty one must be found.'),
  label: L('Balandlik', 'Высота', 'The height'),
  ask: L(
    'Yigirma bir tomoniga mos balandlik nechaga teng?',
    'Чему равна высота, соответствующая стороне двадцать один?',
    'What is the height matching the side twenty one?'),
  correctText: L(
    "To'g'ri. Yuza asos bilan balandlik ko'paytmasining yarmiga teng, ya'ni balandlik topilishi uchun yuzani IKKILANTIRIB asosga bo'lish kerak: ikki karra sakson to'rt bir yuz oltmish sakkiz, uni yigirma birga bo'lsak sakkiz. Tekshiring: yigirma bir karra sakkiz bir yuz oltmish sakkiz, yarmi sakson to'rt. Va endi darsning asosiy fikri: balandlikni O'LCHAMASDAN topdik. Uchala tomondan yuza chiqdi, yuzadan esa balandlik. Aynan shu sababdan Geron formulasi kerak.",
    'Верно. Площадь равна половине произведения основания на высоту, значит чтобы найти высоту, площадь надо УДВОИТЬ и разделить на основание: дважды восемьдесят четыре — сто шестьдесят восемь, разделить на двадцать один — восемь. Проверь: двадцать один на восемь — сто шестьдесят восемь, половина восемьдесят четыре. И вот главная мысль урока: высоту мы нашли НЕ ИЗМЕРЯЯ её. Из трёх сторон вышла площадь, а из площади высота. Именно для этого и нужна формула Герона.',
    'Correct. The area is half the product of the base and the height, so to find the height you DOUBLE the area and divide by the base: twice eighty four is one hundred sixty eight, divided by twenty one is eight. Check: twenty one times eight is one hundred sixty eight, half is eighty four. And here is the main point of the lesson: we found the height WITHOUT measuring it. From the three sides came the area, and from the area the height. That is exactly what Heron formula is for.'),
  wrongs: [
    { when: (s) => s.value === 4, text: L(
      "To'rt — yuza asosga bo'lingan, lekin ikkilantirish unutilgan: sakson to'rtni yigirma birga bo'lsak to'rt chiqadi. Tekshirib ko'ring: agar balandlik to'rt bo'lganda, yuza yigirma bir karra to'rt ning yarmi, ya'ni qirq ikki bo'lardi — sakson to'rt emas. Yuza formulasida yarim bor, demak teskari yo'lda ikkilantirish bo'ladi.",
      'Четыре — площадь разделена на основание, но забыто удвоение: восемьдесят четыре разделить на двадцать один — четыре. Проверь: будь высота четыре, площадь равнялась бы половине от двадцати одного на четыре, то есть сорока двум, а не восьмидесяти четырём. В формуле площади есть половина, значит в обратном пути есть удвоение.',
      'Four means the area was divided by the base but the doubling forgotten: eighty four divided by twenty one is four. Check: were the height four, the area would be half of twenty one times four, that is forty two, not eighty four. The area formula has a half, so the reverse route has a doubling.') },
    { when: (s) => s.value === 168, text: L(
      "Bir yuz oltmish sakkiz — bu ikkilangan yuza, ya'ni oraliq natija. Undan keyin asosga bo'lish qoladi: bir yuz oltmish sakkizni yigirma birga bo'lsak sakkiz.",
      'Сто шестьдесят восемь — это удвоенная площадь, промежуточный результат. Дальше остаётся разделить на основание: сто шестьдесят восемь разделить на двадцать один — восемь.',
      'One hundred sixty eight is the doubled area, an intermediate result. What remains is dividing by the base: one hundred sixty eight divided by twenty one is eight.') },
    { when: (s) => s.value === 16 || s.value === 10 || s.value === 17, text: L(
      "Bu son shartdagi tomonlardan olingan yoki hisobda adashishdan chiqqan. Bosqichma-bosqich yuring: yuzani ikkilantiring (bir yuz oltmish sakkiz), keyin asosga bo'ling (yigirma bir). Javob sakkiz chiqadi, va u eng uzun tomonga mos balandlik — shuning uchun u KICHIK, chunki katta tomonga kichik balandlik mos keladi.",
      'Это число взято из данных сторон или получилось из ошибки в счёте. Иди по шагам: удвой площадь (сто шестьдесят восемь), потом раздели на основание (двадцать один). Выйдет восемь, и это высота к самой длинной стороне — потому она и МАЛА, ведь большей стороне соответствует меньшая высота.',
      'This number was taken from the given sides or came from a slip in the arithmetic. Go step by step: double the area (one hundred sixty eight), then divide by the base (twenty one). Eight comes out, and it is the height to the longest side — hence SMALL, since a longer side matches a smaller height.') },
  ],
  wrongText: L(
    "Yuzani ikkilantirib asosga bo'ling: h teng ikki S bo'linadi a.",
    'Удвой площадь и раздели на основание: h равно два S делить на a.',
    'Double the area and divide by the base: h equals two S over a.'),
};

export default function D46_06(props) { return <TypeValue data={DATA} {...props} />; }
