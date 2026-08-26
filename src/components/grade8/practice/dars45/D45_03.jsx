// Dars45 · Amaliyot 03 — Tomon · 🟢 · tag: right_angle_side
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §7 (45-dars, 3-pozitsiya)
//
// SAVOL BURCHAKNING JOYI HAQIDA (T2, З95). 10, 24, 26: yuz qo'shuv besh yuz
// yetmish olti olti yuz yetmish olti, ya'ni tenglik bajariladi va uchburchak
// to'g'ri burchakli. To'g'ri burchak esa aynan ENG KATTA tomonga qarama-qarshi
// uchda turadi, ya'ni javob yigirma olti.
//
// Tuzoqlar: 10 (eng kichik), 24 (o'rtadagi — З95), 60 (perimetr).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'right_angle_side', level: '🟢',
  target: 26, allowNeg: false,
  expr: ['10,  24,  26'], exprSize: 24,
  eyebrow: L('Tomon', 'Сторона', 'Side'),
  setup: L(
    "Uchburchakning tomonlari o'n, yigirma to'rt va yigirma olti. Bu uchburchak to'g'ri burchakli, va to'g'ri burchak uning bir uchida turadi. Har uchning qarshisida bitta tomon yotadi.",
    'Стороны треугольника десять, двадцать четыре и двадцать шесть. Этот треугольник прямоугольный, и прямой угол стоит в одной из его вершин. Против каждой вершины лежит одна сторона.',
    'The sides of a triangle are ten, twenty four and twenty six. This triangle is right-angled and the right angle sits at one of its vertices. One side lies opposite each vertex.'),
  label: L("To'g'ri burchakka qarshi tomon", 'Сторона против прямого угла', 'The side opposite the right angle'),
  ask: L(
    "To'g'ri burchak qaysi tomonga qarama-qarshi turadi? O'sha tomonning uzunligini yozing.",
    'Против какой стороны лежит прямой угол? Запиши длину этой стороны.',
    'Which side does the right angle lie opposite? Write the length of that side.'),
  correctText: L(
    "To'g'ri. Avval tenglikni tekshiramiz: yuz qo'shuv besh yuz yetmish olti olti yuz yetmish olti, va yigirma olti kvadrat ham olti yuz yetmish olti — demak uchburchak haqiqatan to'g'ri burchakli. Endi burchakning joyi. Tenglik ENG KATTA tomonning kvadrati uchun bajarildi, ya'ni eng katta tomon gipotenuza bo'ladi. Gipotenuza esa to'g'ri burchakning qarshisida yotadi. Demak javob yigirma olti. Boshqa yo'l bilan ham tushunish mumkin: katta burchakka katta tomon qarshi turadi, to'g'ri burchak esa uchtasining eng kattasi.",
    'Верно. Сначала проверяем равенство: сто плюс пятьсот семьдесят шесть — шестьсот семьдесят шесть, и двадцать шесть в квадрате тоже шестьсот семьдесят шесть — значит треугольник действительно прямоугольный. Теперь место угла. Равенство выполнилось для квадрата НАИБОЛЬШЕЙ стороны, значит наибольшая сторона и есть гипотенуза. А гипотенуза лежит против прямого угла. Значит ответ двадцать шесть. Можно понять и иначе: против большего угла лежит большая сторона, а прямой угол наибольший из трёх.',
    'Correct. First check the equality: one hundred plus five hundred seventy six is six hundred seventy six, and twenty six squared is six hundred seventy six too — so the triangle really is right-angled. Now the place of the angle. The equality held for the square of the LARGEST side, so the largest side is the hypotenuse. And the hypotenuse lies opposite the right angle. So the answer is twenty six. Another way to see it: the larger angle faces the larger side, and the right angle is the largest of the three.'),
  wrongs: [
    { when: (s) => s.value === 24, text: L(
      "Yigirma to'rt — o'rtadagi tomon, va u katet. Tenglikni tekshirib ko'ring: yigirma to'rt kvadrat besh yuz yetmish olti, qolgan ikkitasining kvadratlari yig'indisi esa yuz qo'shuv olti yuz yetmish olti, ya'ni yetti yuz yetmish olti — teng emas. Tenglik faqat eng katta tomon uchun bajariladi, va to'g'ri burchak aynan unga qarshi turadi.",
      'Двадцать четыре — средняя сторона, и она катет. Проверь равенство: двадцать четыре в квадрате — пятьсот семьдесят шесть, а сумма квадратов двух других сто плюс шестьсот семьдесят шесть, то есть семьсот семьдесят шесть — не равно. Равенство выполняется только для наибольшей стороны, и прямой угол лежит именно против неё.',
      'Twenty four is the middle side and it is a leg. Check the equality: twenty four squared is five hundred seventy six, while the sum of the squares of the other two is one hundred plus six hundred seventy six, that is seven hundred seventy six — not equal. The equality holds only for the largest side, and the right angle lies opposite that one.') },
    { when: (s) => s.value === 10, text: L(
      "O'n — eng kichik tomon, ya'ni unga eng KICHIK burchak qarshi turadi. To'g'ri burchak esa uchburchakning eng katta burchagi: qolgan ikkitasining yig'indisi ham to'qsonga teng, ya'ni har biri to'qsondan kichik. Katta burchakka katta tomon qarshi turadi.",
      'Десять — наименьшая сторона, значит против неё лежит НАИМЕНЬШИЙ угол. А прямой угол в треугольнике наибольший: сумма двух остальных тоже равна девяноста, то есть каждый меньше девяноста. Против большего угла лежит большая сторона.',
      'Ten is the smallest side, so the SMALLEST angle lies opposite it. The right angle is the largest in the triangle: the other two sum to ninety as well, so each is under ninety. The larger angle faces the larger side.') },
    { when: (s) => s.value === 60 || s.value === 34, text: L(
      "Bu son tomonlarni qo'shishdan chiqqan, savol esa ularning BITTASINI so'radi. Tekshiruv shunday boradi: eng katta tomonni topamiz (yigirma olti), uning kvadratini qolgan ikkitasining kvadratlari yig'indisi bilan solishtiramiz, va tenglik bajarilsa — to'g'ri burchak shu tomonning qarshisida.",
      'Это число получено сложением сторон, а вопрос просил ОДНУ из них. Проверка идёт так: находим наибольшую сторону (двадцать шесть), сравниваем её квадрат с суммой квадратов двух других, и если равенство выполнено — прямой угол против этой стороны.',
      'This number came from adding the sides, while the question asked for ONE of them. The check runs like this: find the largest side (twenty six), compare its square with the sum of the squares of the other two, and if the equality holds the right angle lies opposite that side.') },
  ],
  wrongText: L(
    "Eng katta tomonni toping va tenglikni tekshiring. To'g'ri burchak aynan shu tomonning qarshisida turadi.",
    'Найди наибольшую сторону и проверь равенство. Прямой угол лежит именно против неё.',
    'Find the largest side and check the equality. The right angle lies opposite exactly that side.'),
};

export default function D45_03(props) { return <TypeValue data={DATA} {...props} />; }
