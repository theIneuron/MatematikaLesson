// Dars47 · Amaliyot 03 — Test · 🟢 · tag: half_base
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §9 (47-dars, 3-pozitsiya)
//
// З100 SO'Z BILAN: Pifagor teoremasi YARIM asosga va yon tomonga qo'llanadi.
// Uch xato variant: to'liq asos (З100), ikki yon tomon (ular orasidagi
// burchak to'g'ri emas), perimetr.
// `Choice` ning variantlari SO'Z, ya'ni `tr()` dan o'tadi (skelet §0a.4).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'half_base', level: '🟢',
  correct: 0, optCols: 1, optSize: 15,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Teng tomonli uchburchakning balandligi berilmagan, faqat tomoni ma'lum. Balandlikni topish uchun Pifagor teoremasi ishlatiladi, lekin uni to'g'ri ikki uzunlikka qo'llash kerak.",
    'Высота равностороннего треугольника не дана, известна только сторона. Чтобы найти высоту, применяют теорему Пифагора, но приложить её надо к верным двум длинам.',
    'The height of an equilateral triangle is not given, only its side. The Pythagorean theorem is used to find the height, but it must be applied to the right two lengths.'),
  ask: L(
    "Teng tomonli uchburchakda balandlikni topish uchun Pifagor teoremasi nimaga qo'llanadi?",
    'К чему применяется теорема Пифагора, чтобы найти высоту равностороннего треугольника?',
    'What is the Pythagorean theorem applied to in order to find the height of an equilateral triangle?'),
  opts: [
    { label: L("yarim asos va yon tomonga", 'к половине основания и боковой стороне', 'to half the base and the side') },
    { label: L("to'liq asos va yon tomonga", 'к полному основанию и боковой стороне', 'to the whole base and the side') },
    { label: L("ikki yon tomonga", 'к двум боковым сторонам', 'to the two sides') },
    { label: L("perimetr va yon tomonga", 'к периметру и боковой стороне', 'to the perimeter and the side') },
  ],
  correctText: L(
    "To'g'ri. Balandlik teng tomonli uchburchakni ikki bir xil TO'G'RI BURCHAKLI uchburchakka bo'ladi, va Pifagor teoremasi faqat shu kichik uchburchakda ishlaydi. Uning gipotenuzasi — yon tomon, katetlari esa balandlik va asosning YARMI. Nima uchun yarim: balandlik teng tomonli uchburchakda mediana ham bo'ladi, ya'ni asosni teng ikkiga bo'ladi. Tomon o'n bo'lsa: yuz minus yigirma besh yetmish besh, balandlik ildiz ostida yetmish besh.",
    'Верно. Высота делит равносторонний треугольник на два одинаковых ПРЯМОУГОЛЬНЫХ, и теорема Пифагора работает только в этом малом треугольнике. Его гипотенуза — боковая сторона, а катеты — высота и ПОЛОВИНА основания. Почему половина: в равностороннем треугольнике высота является и медианой, то есть делит основание пополам. При стороне десять: сто минус двадцать пять — семьдесят пять, высота равна корню из семидесяти пяти.',
    'Correct. The height splits the equilateral triangle into two identical RIGHT triangles, and the Pythagorean theorem works only inside that small triangle. Its hypotenuse is the side, and its legs are the height and HALF the base. Why half: in an equilateral triangle the height is also a median, so it halves the base. With side ten: one hundred minus twenty five is seventy five, so the height is the root of seventy five.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "To'liq asos bilan hisoblab bo'lmaydi: balandlik asosning O'RTASIGA tushadi, ya'ni to'g'ri burchakli uchburchakning kateti asosning yarmi. Tomon o'n bo'lsa, to'liq asos bilan yuz minus yuz, ya'ni nol chiqadi — nol uzunlikdagi balandlik esa yo'q. Bu javobning o'zi xatoni ko'rsatadi.",
      'С полным основанием считать нельзя: высота падает в СЕРЕДИНУ основания, значит катет прямоугольного треугольника — половина основания. При стороне десять с полным основанием выйдет сто минус сто, то есть нуль — а высоты нулевой длины не бывает. Сам ответ и показывает ошибку.',
      'The whole base cannot be used: the height falls at the MIDPOINT of the base, so the leg of the right triangle is half the base. With side ten the whole base gives one hundred minus one hundred, that is zero — and there is no height of zero length. The answer itself reveals the error.') },
    { when: (s) => s.picked === 2, text: L(
      "Ikki yon tomonning orasidagi burchak to'g'ri emas: teng tomonli uchburchakning har burchagi oltmish gradus. Pifagor teoremasi faqat TO'G'RI burchakli uchburchakda ishlaydi, ya'ni avval balandlik chizib, to'g'ri burchak yasash kerak.",
      'Угол между двумя боковыми сторонами не прямой: каждый угол равностороннего треугольника шестьдесят градусов. Теорема Пифагора работает только в ПРЯМОУГОЛЬНОМ треугольнике, значит сначала надо провести высоту и получить прямой угол.',
      'The angle between the two sides is not right: every angle of an equilateral triangle is sixty degrees. The Pythagorean theorem works only in a RIGHT triangle, so the height must be drawn first to create a right angle.') },
    { when: (s) => s.picked === 3, text: L(
      "Perimetr Pifagor teoremasiga kirmaydi: teorema uchburchakning TOMONLARI bilan ishlaydi, ularning yig'indisi bilan emas. Teng tomonli uchburchakda perimetr tomonning uch barobari, lekin bu balandlikni topishga yordam bermaydi.",
      'Периметр в теорему Пифагора не входит: теорема работает со СТОРОНАМИ треугольника, а не с их суммой. В равностороннем треугольнике периметр втрое больше стороны, но найти высоту это не помогает.',
      'The perimeter does not enter the Pythagorean theorem: the theorem works with the SIDES of the triangle, not their sum. In an equilateral triangle the perimeter is three times the side, but that does not help find the height.') },
  ],
  wrongText: L(
    "Balandlik asosni teng ikkiga bo'ladi. To'g'ri burchakli uchburchakning katetlari — balandlik va yarim asos.",
    'Высота делит основание пополам. Катеты прямоугольного треугольника — высота и половина основания.',
    'The height halves the base. The legs of the right triangle are the height and half the base.'),
};

export default function D47_03(props) { return <Choice data={DATA} {...props} />; }
