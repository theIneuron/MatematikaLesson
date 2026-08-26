// Dars44 · Amaliyot 07 — Tomon · 🟡 · tag: rhombus_side
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §6 (44-dars, 7-pozitsiya)
//
// DARSLIKNING MASALASI (94-bet, 2-masala): rombning diagonallari 10 va 24,
// tomoni topiladi. Ikki qadam: diagonallar bir-birini teng ikkiga bo'ladi va
// perpendikulyar (38-dars), ya'ni katetlar YARIM diagonallar — 5 va 12;
// keyin Pifagor teoremasi — 13.
//
// Asosiy tuzoq — 26: yarim diagonal olinmagan, butun diagonallar katet deb
// ishlatilgan. Ikkinchisi 17: З91 (besh qo'shuv o'n ikki).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'rhombus_side', level: '🟡',
  target: 13, allowNeg: false,
  given: [['d₁ = 10'], ['d₂ = 24']],
  givenLabel: L('Rombning diagonallari', 'Диагонали ромба', 'The diagonals of the rhombus'),
  eyebrow: L('Tomon', 'Сторона', 'Side'),
  setup: L(
    "Rombning diagonallari o'n va yigirma to'rt santimetr. Rombning diagonallari bir-birini teng ikkiga bo'ladi va o'zaro perpendikulyar — bu 38-darsning xossasi. Demak diagonallar rombni to'rt bir xil to'g'ri burchakli uchburchakka bo'ladi.",
    'Диагонали ромба десять и двадцать четыре сантиметра. Диагонали ромба делят друг друга пополам и взаимно перпендикулярны — это свойство из урока 38. Значит диагонали разбивают ромб на четыре одинаковых прямоугольных треугольника.',
    'The diagonals of a rhombus are ten and twenty four centimetres. The diagonals of a rhombus bisect each other and are mutually perpendicular — that is the property from lesson 38. So they split the rhombus into four identical right triangles.'),
  label: L('Rombning tomoni, sm', 'Сторона ромба, см', 'The side of the rhombus, cm'),
  ask: L(
    'Rombning tomoni nechaga teng?',
    'Чему равна сторона ромба?',
    'What is the side of the rhombus?'),
  correctText: L(
    "To'g'ri. Uch qadam. Birinchisi: diagonallar bir-birini teng ikkiga bo'ladi, ya'ni yarim diagonallar besh va o'n ikki. Ikkinchisi: ular o'zaro perpendikulyar, ya'ni bu yarim diagonallar to'g'ri burchakli uchburchakning KATETLARI, rombning tomoni esa uning gipotenuzasi. Uchinchisi: yigirma besh qo'shuv bir yuz qirq to'rt bir yuz oltmish to'qqiz, ildizi o'n uch. Tekshirish: besh, o'n ikki, o'n uch — darslikda keltirilgan Pifagor uchligi. Diqqat qiladigan joy: rombning to'rtala tomoni teng, ya'ni bitta uchburchakni hisoblash kifoya.",
    'Верно. Три шага. Первый: диагонали делят друг друга пополам, значит полудиагонали пять и двенадцать. Второй: они взаимно перпендикулярны, значит эти полудиагонали — КАТЕТЫ прямоугольного треугольника, а сторона ромба его гипотенуза. Третий: двадцать пять плюс сто сорок четыре — сто шестьдесят девять, корень тринадцать. Проверка: пять, двенадцать, тринадцать — пифагорова тройка из учебника. На что стоит обратить внимание: все четыре стороны ромба равны, значит достаточно посчитать один треугольник.',
    'Correct. Three steps. First: the diagonals bisect each other, so the half diagonals are five and twelve. Second: they are mutually perpendicular, so those half diagonals are the LEGS of a right triangle and the side of the rhombus is its hypotenuse. Third: twenty five plus one hundred forty four is one hundred sixty nine, the root is thirteen. Check: five, twelve, thirteen — a Pythagorean triple from the textbook. Worth noticing: all four sides of a rhombus are equal, so computing one triangle is enough.'),
  wrongs: [
    { when: (s) => s.value === 26, text: L(
      "Yigirma olti — butun diagonallar katet deb olingan: yuz qo'shuv besh yuz yetmish olti olti yuz yetmish olti, ildizi yigirma olti. Lekin uchburchakning katetlari butun diagonallar emas, ularning YARMI: diagonallar kesishish nuqtasida bir-birini teng ikkiga bo'ladi. Beshni va o'n ikkini oling.",
      'Двадцать шесть — за катеты взяты целые диагонали: сто плюс пятьсот семьдесят шесть — шестьсот семьдесят шесть, корень двадцать шесть. Но катеты треугольника не целые диагонали, а их ПОЛОВИНЫ: в точке пересечения диагонали делят друг друга пополам. Возьми пять и двенадцать.',
      'Twenty six comes from taking the whole diagonals as legs: one hundred plus five hundred seventy six is six hundred seventy six, the root is twenty six. But the legs of the triangle are not the whole diagonals, they are their HALVES: at the point of intersection the diagonals bisect each other. Take five and twelve.') },
    { when: (s) => s.value === 17, text: L(
      "O'n yetti — yarim diagonallar to'g'ri topilgan, lekin ular QO'SHILGAN: besh qo'shuv o'n ikki. Pifagor teoremasi uzunliklarni emas, kvadratlarni qo'shadi: yigirma besh qo'shuv bir yuz qirq to'rt bir yuz oltmish to'qqiz, ildizi o'n uch.",
      'Семнадцать — полудиагонали найдены верно, но они СЛОЖЕНЫ: пять плюс двенадцать. Теорема Пифагора складывает не длины, а квадраты: двадцать пять плюс сто сорок четыре — сто шестьдесят девять, корень тринадцать.',
      'Seventeen means the half diagonals were found correctly but then ADDED: five plus twelve. The Pythagorean theorem adds squares, not lengths: twenty five plus one hundred forty four is one hundred sixty nine, the root is thirteen.') },
    { when: (s) => s.value === 34 || s.value === 7 || s.value === 12, text: L(
      "Bu son diagonallarni qo'shish yoki ayirishdan chiqqan. Bosqichma-bosqich yuring: yarim diagonallar besh va o'n ikki, ular katetlar; kvadratlarini qo'shing — bir yuz oltmish to'qqiz; ildizini chiqaring — o'n uch. Tomon har doim yarim diagonaldan uzun bo'ladi, chunki u gipotenuza.",
      'Это число получено сложением или вычитанием диагоналей. Иди по шагам: полудиагонали пять и двенадцать, это катеты; сложи их квадраты — сто шестьдесят девять; извлеки корень — тринадцать. Сторона всегда длиннее полудиагонали, ведь она гипотенуза.',
      'This number came from adding or subtracting the diagonals. Go step by step: the half diagonals are five and twelve, and they are the legs; add their squares — one hundred sixty nine; take the root — thirteen. The side is always longer than a half diagonal, since it is the hypotenuse.') },
  ],
  wrongText: L(
    "Diagonallarni ikkiga bo'ling — katetlar shu; keyin kvadratlarini qo'shib ildiz chiqaring.",
    'Раздели диагонали на два — это катеты; потом сложи их квадраты и извлеки корень.',
    'Halve the diagonals — those are the legs; then add their squares and take the root.'),
};

export default function D44_07(props) { return <TypeValue data={DATA} {...props} />; }
