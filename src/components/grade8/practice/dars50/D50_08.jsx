// Dars50 · Amaliyot 08 — Nuqtalar · 🔴 · tag: units_case
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §12 (50-dars, 8-pozitsiya)
//
// З106 SHU YERDA: darslikning 424-mashqi — radius va masofa TURLI birlikda
// berilgan. Bir desimetr o'n santimetr, ya'ni masofa to'qqiz santimetr
// radiusdan KICHIK, va chiziq aylanani ikki nuqtada kesadi.
//
// BIRLIKLAR SETUP MATNIDA TURADI, kartada emas: birlik nomlari uch tilda
// boshqacha yoziladi (skelet §0a.4). Shu sababli bu topshiriq `TypeValue` da
// — javob SON, savol esa matnda.
// Asosiy tuzoq — nol: bir va to'qqizni to'g'ridan-to'g'ri solishtirish.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'units_case', level: '🔴',
  target: 2, allowNeg: false,
  eyebrow: L('Nuqtalar', 'Точки', 'Points'),
  setup: L(
    "Aylananing radiusi bir desimetr, markazdan to'g'ri chiziqqacha masofa esa to'qqiz santimetr. Bir desimetr o'n santimetrga teng. To'g'ri chiziq bilan aylananing umumiy nuqtalari soni kerak.",
    'Радиус окружности один дециметр, а расстояние от центра до прямой девять сантиметров. Один дециметр равен десяти сантиметрам. Нужно число общих точек прямой и окружности.',
    'The radius of a circle is one decimetre and the distance from the centre to a line is nine centimetres. One decimetre equals ten centimetres. The number of common points of the line and the circle is required.'),
  label: L('Umumiy nuqtalar soni', 'Число общих точек', 'The number of common points'),
  ask: L(
    "To'g'ri chiziq bilan aylananing nechta umumiy nuqtasi bor?",
    'Сколько общих точек у прямой и окружности?',
    'How many points do the line and the circle have in common?'),
  correctText: L(
    "To'g'ri. Birinchi qadam — birliklarni bir xilga keltirish: bir desimetr o'n santimetr, ya'ni radius o'n santimetr, masofa esa to'qqiz santimetr. Endi solishtirish mumkin: to'qqiz o'ndan kichik, ya'ni masofa radiusdan KICHIK va chiziq aylanani ikki nuqtada kesadi. Javob ikki. Birliklarni keltirmasdan solishtirsangiz, bir va to'qqizni solishtirgan bo'lardingiz va masofa katta chiqardi — javob nol bo'lardi, ya'ni butunlay boshqa. Vatarning uzunligini ham topish mumkin: ikki karra ildiz ostida yuz minus sakson bir, ya'ni ikki karra ildiz ostida o'n to'qqiz.",
    'Верно. Первый шаг — привести единицы к одной: один дециметр это десять сантиметров, значит радиус десять сантиметров, а расстояние девять сантиметров. Теперь можно сравнивать: девять меньше десяти, значит расстояние МЕНЬШЕ радиуса и прямая пересекает окружность в двух точках. Ответ два. Если сравнивать не приведя единицы, ты сравнил бы один и девять, и расстояние вышло бы больше — ответ был бы нуль, то есть совсем другой. Можно найти и длину хорды: дважды корень из ста минус восьмидесяти одного, то есть дважды корень из девятнадцати.',
    'Correct. The first step is bringing the units together: one decimetre is ten centimetres, so the radius is ten centimetres and the distance nine centimetres. Now they can be compared: nine is less than ten, so the distance is LESS than the radius and the line crosses the circle at two points. The answer is two. Comparing without converting, you would have compared one and nine and found the distance larger — the answer would be zero, something entirely different. The chord can be found too: twice the root of one hundred minus eighty one, that is twice the root of nineteen.'),
  wrongs: [
    { when: (s) => s.value === 0, text: L(
      "Nol — sonlar BIRLIKKA keltirilmasdan solishtirilgan: bir va to'qqiz. Lekin bir desimetr to'qqiz santimetrdan kichik emas, aksincha — u o'n santimetr, ya'ni kattaroq. Birliklarni bir xilga keltirsangiz, radius o'n santimetr, masofa to'qqiz santimetr bo'ladi: masofa kichik, chiziq kesib o'tadi, javob ikki. Bu darslikning 424-mashqi, va u aynan shu xatoni tekshirish uchun berilgan.",
      'Нуль — числа сравнены без приведения к ЕДИНИЦЕ: один и девять. Но один дециметр не меньше девяти сантиметров, наоборот — это десять сантиметров, то есть больше. Приведя единицы, получим радиус десять сантиметров и расстояние девять: расстояние меньше, прямая пересекает, ответ два. Это упражнение 424 из учебника, и дано оно как раз для проверки этой ошибки.',
      'Zero means the numbers were compared without converting UNITS: one against nine. But one decimetre is not less than nine centimetres — it is ten centimetres, which is more. Convert the units and the radius is ten centimetres against a distance of nine: the distance is smaller, the line crosses, the answer is two. This is exercise 424 from the textbook, set precisely to catch that error.') },
    { when: (s) => s.value === 1, text: L(
      "Bir — urinmaning javobi, va u masofa radiusga TENG bo'lganda bo'ladi. Bu yerda esa masofa to'qqiz santimetr, radius o'n santimetr — ular teng emas, masofa kichik. Chiziq aylananing ichiga kiradi va uni ikki nuqtada kesadi.",
      'Один — ответ для касательной, и он бывает, когда расстояние РАВНО радиусу. А здесь расстояние девять сантиметров, радиус десять — они не равны, расстояние меньше. Прямая заходит внутрь окружности и пересекает её в двух точках.',
      'One is the answer for a tangent, and it happens when the distance EQUALS the radius. Here the distance is nine centimetres against a radius of ten — not equal, the distance is smaller. The line enters the circle and crosses it at two points.') },
    { when: (s) => s.value === 9 || s.value === 10 || s.value === 19, text: L(
      "Bu son shartdagi uzunlik yoki hisobning bo'lagi, savol esa NUQTALARNING sonini so'radi — u faqat nol, bir yoki ikki bo'lishi mumkin. Birliklarni keltiring, masofani radius bilan solishtiring, keyin uch holatdan birini tanlang.",
      'Это число — длина из условия или часть счёта, а вопрос просил число ТОЧЕК: оно может быть только нуль, один или два. Приведи единицы, сравни расстояние с радиусом и выбери один из трёх случаев.',
      'This number is a length from the condition or a piece of the arithmetic, while the question asked for the number of POINTS: that can only be zero, one or two. Convert the units, compare the distance with the radius, and pick one of the three cases.') },
  ],
  wrongText: L(
    "Avval birliklarni bir xilga keltiring: 1 dm = 10 sm. Keyingina masofani radius bilan solishtiring.",
    'Сначала приведи единицы к одной: 1 дм = 10 см. Только потом сравнивай расстояние с радиусом.',
    'First bring the units together: 1 dm = 10 cm. Only then compare the distance with the radius.'),
};

export default function D50_08(props) { return <TypeValue data={DATA} {...props} />; }
