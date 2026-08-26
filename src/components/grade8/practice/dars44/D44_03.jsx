// Dars44 · Amaliyot 03 — Test · 🟢 · tag: which_is_hypotenuse
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §6 (44-dars, 3-pozitsiya)
//
// TA'RIF. Uch xato variant: eng qisqa tomon, katetlardan biri, va HARFGA
// tayanish — oxirgisi З93, va u 45-darsga ko'prik: darslikning masalasida
// eng katta tomon `√85` bo'lib, `c` harfi bilan olti yozilgan.
// `Choice` ning variantlari SO'Z, ya'ni `tr()` dan o'tadi (skelet §0a.4).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_is_hypotenuse', level: '🟢',
  correct: 0, optCols: 1, optSize: 15,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "To'g'ri burchakli uchburchakning uch tomoni bor va ulardan bittasi alohida nom oladi — gipotenuza. Qolgan ikkitasi katetlar deb ataladi.",
    'У прямоугольного треугольника три стороны, и одна из них получает особое имя — гипотенуза. Две другие называются катетами.',
    'A right triangle has three sides, and one of them gets a special name — the hypotenuse. The other two are called the legs.'),
  ask: L(
    "To'g'ri burchakli uchburchakda qaysi tomon gipotenuza?",
    'Какая сторона прямоугольного треугольника является гипотенузой?',
    'Which side of a right triangle is the hypotenuse?'),
  opts: [
    { label: L("to'g'ri burchakka qarama-qarshi turgan tomon",
      'сторона, лежащая против прямого угла', 'the side lying opposite the right angle') },
    { label: L("eng qisqa tomon", 'самая короткая сторона', 'the shortest side') },
    { label: L("to'g'ri burchakni tashkil qilgan tomonlardan biri",
      'одна из сторон, образующих прямой угол', 'one of the sides forming the right angle') },
    { label: L("har doim c harfi bilan belgilangan tomon",
      'сторона, всегда обозначенная буквой c', 'the side always labelled with the letter c') },
  ],
  correctText: L(
    "To'g'ri. Gipotenuzani BURCHAK tanlaydi: u to'g'ri burchakka qarama-qarshi yotadi. Shundan uning eng uzun tomon ekani ham chiqadi — uchburchakda katta burchakka katta tomon qarshi turadi, to'g'ri burchak esa uchtasining eng kattasi (ikkita to'g'ri burchak bir uchburchakda bo'lolmaydi, chunki yig'indi bir yuz saksondan oshib ketardi). Qolgan ikki tomon to'g'ri burchakni tashkil qiladi va katetlar deb ataladi.",
    'Верно. Гипотенузу выбирает УГОЛ: она лежит против прямого угла. Отсюда же следует, что она самая длинная — в треугольнике против большего угла лежит большая сторона, а прямой угол здесь наибольший из трёх (двух прямых углов в одном треугольнике быть не может, сумма превысила бы сто восемьдесят). Две другие стороны образуют прямой угол и называются катетами.',
    'Correct. The ANGLE chooses the hypotenuse: it lies opposite the right angle. From that it also follows that it is the longest — in a triangle the larger angle faces the larger side, and the right angle here is the largest of the three (two right angles cannot share a triangle, the sum would pass one hundred eighty). The other two sides form the right angle and are called the legs.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Aksincha: gipotenuza eng UZUN tomon. Uchburchakda katta burchakka katta tomon qarshi turadi, to'g'ri burchak esa eng katta burchak. Misolda ko'ring: katetlar olti va sakkiz, gipotenuza o'n — u ikkalasidan ham uzun.",
      'Наоборот: гипотенуза самая ДЛИННАЯ сторона. В треугольнике против большего угла лежит большая сторона, а прямой угол здесь наибольший. Посмотри на примере: катеты шесть и восемь, гипотенуза десять — она длиннее обоих.',
      'The opposite: the hypotenuse is the LONGEST side. In a triangle the larger angle faces the larger side, and the right angle is the largest here. See it on an example: the legs are six and eight, the hypotenuse ten — longer than both.') },
    { when: (s) => s.picked === 2, text: L(
      "To'g'ri burchakni tashkil qilgan tomonlar KATETLAR deb ataladi — ular burchakning tomonlari, ya'ni undan chiqadi. Gipotenuza esa burchakdan uzoqda, uning qarshisida turadi va uchburchakning qolgan ikki uchini tutashtiradi.",
      'Стороны, образующие прямой угол, называются КАТЕТАМИ — они стороны самого угла, то есть выходят из него. А гипотенуза стоит вдали от угла, против него, и соединяет две другие вершины треугольника.',
      'The sides forming the right angle are called the LEGS — they are the sides of that angle, running out of it. The hypotenuse stands away from the angle, opposite it, joining the other two vertices of the triangle.') },
    { when: (s) => s.picked === 3, text: L(
      "Harf tomonni tanlamaydi. Odatda gipotenuza c bilan belgilanadi, lekin bu shunchaki kelishuv — masalada tomonlar boshqa harflar bilan yoki umuman harfsiz, faqat sonlar bilan berilishi mumkin. Gipotenuzani topish uchun BURCHAKKA qarash kerak: qaysi tomon to'g'ri burchakning qarshisida turadi. Bu farq 45-darsda ochiq ko'rinadi.",
      'Буква сторону не выбирает. Обычно гипотенузу обозначают c, но это просто соглашение — в задаче стороны могут быть названы другими буквами или вовсе без букв, одними числами. Чтобы найти гипотенузу, надо смотреть на УГОЛ: какая сторона стоит против прямого. Это различие ясно проявится в уроке 45.',
      'A letter does not choose a side. The hypotenuse is usually labelled c, but that is a convention — in a problem the sides may carry other letters or none at all, just numbers. To find the hypotenuse you look at the ANGLE: which side stands opposite the right one. This difference shows up plainly in lesson 45.') },
  ],
  wrongText: L(
    "Gipotenuzani harf emas, BURCHAK tanlaydi: u to'g'ri burchakning qarshisida turadi.",
    'Гипотенузу выбирает не буква, а УГОЛ: она стоит против прямого угла.',
    'Not a letter but the ANGLE chooses the hypotenuse: it stands opposite the right angle.'),
};

export default function D44_03(props) { return <Choice data={DATA} {...props} />; }
