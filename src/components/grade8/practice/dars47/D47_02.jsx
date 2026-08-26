// Dars47 · Amaliyot 02 — Kvadrat · 🟢 · tag: equilateral_h2
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §9 (47-dars, 2-pozitsiya)
//
// DARSLIKNING MASALASI (104-bet, 2-masala): teng tomonli uchburchakning
// tomoni o'n, balandligi izlanadi. Bu topshiriqda faqat BIRINCHI qadam
// so'raladi — balandlikning KVADRATI, — ya'ni ildizsiz javob. Balandlikning
// o'zi va yuza 08-topshiriqda topiladi.
//
// З100 aynan shu yerda tutiladi: Pifagor teoremasi asosning YARMIGA
// qo'llanadi, to'liq asosga emas. To'liq asos bilan nol chiqadi — javob
// mumkin emasligi darhol ko'rinadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'equilateral_h2', level: '🟢',
  target: 75, allowNeg: false,
  given: [['a = 10']],
  givenLabel: L('Teng tomonli uchburchak', 'Равносторонний треугольник', 'An equilateral triangle'),
  eyebrow: L('Kvadrat', 'Квадрат', 'Square'),
  setup: L(
    "Teng tomonli uchburchakning tomoni o'n. Balandlik uchdan tushiriladi va asosni teng ikkiga bo'ladi, ya'ni to'g'ri burchakli uchburchak hosil bo'ladi: gipotenuzasi yon tomon, bir kateti esa asosning yarmi.",
    'Сторона равностороннего треугольника десять. Высота опускается из вершины и делит основание пополам, то есть возникает прямоугольный треугольник: гипотенуза — боковая сторона, один катет — половина основания.',
    'The side of an equilateral triangle is ten. The height drops from a vertex and halves the base, so a right triangle appears: the hypotenuse is the side and one leg is half the base.'),
  label: L('Balandlikning kvadrati', 'Квадрат высоты', 'The square of the height'),
  ask: L(
    'Balandlikning kvadrati nechaga teng?',
    'Чему равен квадрат высоты?',
    'What is the square of the height?'),
  correctText: L(
    "To'g'ri. Balandlik teng tomonli uchburchakni ikki bir xil to'g'ri burchakli uchburchakka bo'ladi. Ularning har birida gipotenuza — yon tomon, ya'ni o'n; bir katet — asosning YARMI, ya'ni besh; ikkinchi katet esa balandlikning o'zi. Pifagor teoremasidan: balandlikning kvadrati yuz minus yigirma besh, ya'ni yetmish besh. Tekshirish: yetmish besh sakson bir dan kichik, ya'ni balandlik to'qqizdan kichik — va bu to'g'ri, chunki balandlik yon tomondan (o'ndan) qisqa bo'lishi kerak.",
    'Верно. Высота делит равносторонний треугольник на два одинаковых прямоугольных. В каждом гипотенуза — боковая сторона, то есть десять; один катет — ПОЛОВИНА основания, то есть пять; второй катет — сама высота. По теореме Пифагора: квадрат высоты равен сто минус двадцать пять, то есть семьдесят пять. Проверка: семьдесят пять меньше восьмидесяти одного, значит высота меньше девяти — и это верно, ведь высота должна быть короче боковой стороны, то есть десяти.',
    'Correct. The height splits the equilateral triangle into two identical right triangles. In each the hypotenuse is the side, ten; one leg is HALF the base, five; the other leg is the height itself. By the Pythagorean theorem the square of the height is one hundred minus twenty five, that is seventy five. A check: seventy five is less than eighty one, so the height is under nine — which is right, since the height must be shorter than the side, ten.'),
  wrongs: [
    { when: (s) => s.value === 0, text: L(
      "Nol — Pifagor teoremasi TO'LIQ asosga qo'llangan: yuz minus yuz. Lekin balandlik asosni teng ikkiga bo'ladi, ya'ni to'g'ri burchakli uchburchakning kateti asosning yarmi — besh, o'n emas. Nol javob mumkin emasligini darhol ko'rsatadi: nol uzunlikdagi balandlik bo'lmaydi.",
      'Нуль — теорема Пифагора применена к ПОЛНОМУ основанию: сто минус сто. Но высота делит основание пополам, значит катет прямоугольного треугольника — половина основания, пять, а не десять. Нуль сразу показывает, что ответ невозможен: высоты нулевой длины не бывает.',
      'Zero means the Pythagorean theorem was applied to the WHOLE base: one hundred minus one hundred. But the height halves the base, so the leg of the right triangle is half the base, five, not ten. Zero shows at once that the answer is impossible: there is no height of zero length.') },
    { when: (s) => s.value === 125, text: L(
      "Bir yuz yigirma besh — kvadratlar qo'shilgan: yuz qo'shuv yigirma besh. Lekin bu yerda gipotenuza BERILGAN (yon tomon o'n), ya'ni katetni topish uchun kvadratlar AYIRILADI. Qo'shish gipotenuzani izlaganda bo'ladi.",
      'Сто двадцать пять — квадраты сложены: сто плюс двадцать пять. Но здесь гипотенуза ДАНА (боковая сторона десять), значит для нахождения катета квадраты ВЫЧИТАЮТСЯ. Сложение бывает, когда ищут гипотенузу.',
      'One hundred twenty five means the squares were added: one hundred plus twenty five. But here the hypotenuse is GIVEN (the side is ten), so finding a leg means SUBTRACTING the squares. Addition is for when the hypotenuse is sought.') },
    { when: (s) => s.value === 50 || s.value === 25 || s.value === 5, text: L(
      "Bu son hisobning yarmida to'xtashdan chiqqan. Bosqichma-bosqich yuring: yon tomon o'n, uning kvadrati yuz; yarim asos besh, uning kvadrati yigirma besh; balandlikning kvadrati ikkisining ayirmasi, ya'ni yetmish besh.",
      'Это число получено остановкой на середине счёта. Иди по шагам: боковая сторона десять, её квадрат сто; половина основания пять, её квадрат двадцать пять; квадрат высоты — их разность, то есть семьдесят пять.',
      'This number came from stopping halfway. Go step by step: the side is ten and its square one hundred; half the base is five and its square twenty five; the square of the height is their difference, seventy five.') },
  ],
  wrongText: L(
    "Gipotenuza — yon tomon, katet — asosning YARMI. Kvadratlarni ayiring.",
    'Гипотенуза — боковая сторона, катет — ПОЛОВИНА основания. Вычти квадраты.',
    'The hypotenuse is the side, the leg is HALF the base. Subtract the squares.'),
};

export default function D47_02(props) { return <TypeValue data={DATA} {...props} />; }
