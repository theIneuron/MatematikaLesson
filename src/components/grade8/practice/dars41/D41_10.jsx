// Dars41 · Amaliyot 10 — Yuza · 🔴 · tag: rect_from_triangle
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §3 (41-dars, 10-pozitsiya)
//
// DARSLIKNING MASALASI (80-bet, 2-masala): to'g'ri to'rtburchak ABCD,
// diagonal AC = 20, BP perpendikulyar AC va BP = 12. Uchburchakning yuzi
// yuz yigirma, to'rtburchakning yuzi esa ikki barobar — ikki yuz qirq.
//
// Ikki qadam: diagonal ASOS bo'ladi (gipotenuza emas, balandlik esa BP), va
// diagonal to'rtburchakni ikkita TENGDOSH uchburchakka bo'ladi (T3).
// Razborlar har xato javobni son bilan rad etadi (З16).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'rect_from_triangle', level: '🔴',
  target: 240, allowNeg: false,
  given: [['AC = 20'], ['BP = 12']],
  givenLabel: L('Diagonal va perpendikulyar', 'Диагональ и перпендикуляр', 'The diagonal and the perpendicular'),
  eyebrow: L('Yuza', 'Площадь', 'Area'),
  setup: L(
    "To'g'ri to'rtburchak ABCD berilgan. Uning diagonali AC yigirma santimetr, B uchidan shu diagonalga tushirilgan perpendikulyar BP esa o'n ikki santimetr. Diagonal to'rtburchakni ikkita uchburchakka bo'ladi.",
    'Дан прямоугольник ABCD. Его диагональ AC равна двадцати сантиметрам, а перпендикуляр BP, опущенный на эту диагональ из вершины B, равен двенадцати сантиметрам. Диагональ делит прямоугольник на два треугольника.',
    'A rectangle ABCD is given. Its diagonal AC is twenty centimetres, and the perpendicular BP dropped onto that diagonal from the vertex B is twelve centimetres. The diagonal splits the rectangle into two triangles.'),
  label: L("To'rtburchakning yuzi, sm²", 'Площадь прямоугольника, см²', 'The area of the rectangle, cm²'),
  ask: L(
    "To'g'ri to'rtburchakning yuzi nechaga teng?",
    'Чему равна площадь прямоугольника?',
    'What is the area of the rectangle?'),
  correctText: L(
    "To'g'ri. Ikki qadam. Birinchisi: ABC uchburchagida diagonal AC ni asos deb olamiz, unga mos balandlik esa BP — u aynan shu diagonalga perpendikulyar. Yigirma karra o'n ikki ikki yuz qirq, yarmi yuz yigirma. Ikkinchisi: diagonal to'g'ri to'rtburchakni ikkita teng uchburchakka bo'ladi, ya'ni to'rtburchakning yuzi ikki barobar — ikki yuz qirq. Diqqat qiladigan joy: to'rtburchakning tomonlari bu yerda umuman kerak emas, garchi ular ham topilishi mumkin bo'lsa.",
    'Верно. Два шага. Первый: в треугольнике ABC берём диагональ AC за основание, а соответствующая ей высота это BP — она как раз перпендикулярна этой диагонали. Двадцать на двенадцать — двести сорок, половина сто двадцать. Второй: диагональ делит прямоугольник на два равных треугольника, значит площадь прямоугольника вдвое больше — двести сорок. На что стоит обратить внимание: стороны прямоугольника здесь вообще не нужны, хотя их тоже можно было бы найти.',
    'Correct. Two steps. First: in the triangle ABC take the diagonal AC as the base, and the matching height is BP — it is exactly perpendicular to that diagonal. Twenty times twelve is two hundred forty, half is one hundred twenty. Second: the diagonal splits the rectangle into two equal triangles, so the area of the rectangle is twice as much — two hundred forty. Worth noticing: the sides of the rectangle are not needed here at all, even though they could be found too.'),
  wrongs: [
    { when: (s) => s.value === 120, text: L(
      "Yuz yigirma — bu BITTA uchburchakning yuzi, ABC uchburchagining yuzi. Savol esa butun to'rtburchak haqida. Diagonal to'rtburchakni ikkita teng uchburchakka bo'ladi: ularning asosi umumiy AC, balandliklari esa teng. Demak javobni ikkilantirish kerak.",
      'Сто двадцать — это площадь ОДНОГО треугольника, треугольника ABC. А вопрос про весь прямоугольник. Диагональ делит его на два равных треугольника: основание у них общее, AC, а высоты равны. Значит ответ надо удвоить.',
      'One hundred twenty is the area of ONE triangle, the triangle ABC. The question is about the whole rectangle. The diagonal splits it into two equal triangles: they share the base AC and their heights are equal. So the answer must be doubled.') },
    { when: (s) => s.value === 480, text: L(
      "To'rt yuz sakson — ikkiga bo'lish unutilgan va keyin ikkilantirilgan. Bosqichma-bosqich yuring: yigirma karra o'n ikki ikki yuz qirq — bu KO'PAYTMA, uchburchakning yuzi esa uning yarmi, yuz yigirma. Undan keyin ikkilantirish: ikki yuz qirq.",
      'Четыреста восемьдесят — деление на два пропущено, а удвоение сделано. Иди по шагам: двадцать на двенадцать — двести сорок, это ПРОИЗВЕДЕНИЕ, а площадь треугольника его половина, сто двадцать. И только потом удвоение: двести сорок.',
      'Four hundred eighty means the halving was skipped and the doubling done. Go step by step: twenty times twelve is two hundred forty — that is the PRODUCT, while the area of the triangle is half of it, one hundred twenty. Only then the doubling: two hundred forty.') },
    { when: (s) => s.value === 60 || s.value === 32 || s.value === 64, text: L(
      "Bu son berilgan uzunliklardan qo'shish yoki bo'lish bilan chiqqan, lekin yuza ko'paytma orqali topiladi. Diagonalni asos, perpendikulyarni balandlik deb oling: yigirma karra o'n ikki ning yarmi yuz yigirma, keyin ikkilantiring.",
      'Это число получено из данных длин сложением или делением, а площадь находится через произведение. Возьми диагональ за основание, перпендикуляр за высоту: половина от двадцати на двенадцать — сто двадцать, потом удвой.',
      'This number came from adding or dividing the given lengths, but the area is found through a product. Take the diagonal as the base and the perpendicular as the height: half of twenty times twelve is one hundred twenty, then double it.') },
  ],
  wrongText: L(
    "Diagonalni asos, BP ni balandlik deb oling — bitta uchburchakning yuzi chiqadi. To'rtburchak ikkita shunday uchburchakdan yig'ilgan.",
    'Возьми диагональ за основание, BP за высоту — выйдет площадь одного треугольника. Прямоугольник сложен из двух таких треугольников.',
    'Take the diagonal as the base and BP as the height — that gives the area of one triangle. The rectangle is made of two such triangles.'),
};

export default function D41_10(props) { return <TypeValue data={DATA} {...props} />; }
