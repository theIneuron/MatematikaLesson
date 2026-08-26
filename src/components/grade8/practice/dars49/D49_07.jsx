// Dars49 · Amaliyot 07 — Masofa · 🟡 · tag: distance_to_chord
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §11 (49-dars, 7-pozitsiya)
//
// T3 NING TO'G'RIDAN-TO'G'RI QO'LLANILISHI: R = 25, vatar 48, ya'ni yarim
// vatar 24; 625 − 576 = 49, masofa 7.
// Tuzoqlar: 1 (yigirma besh minus yigirma to'rt — chiziqli ayirish, З91),
// 49 (ildiz chiqarilmagan), 14 (javob ikkilantirilgan).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'distance_to_chord', level: '🟡',
  target: 7, allowNeg: false,
  given: [['R = 25'], ['AB = 48']],
  givenLabel: L('Radius va vatar', 'Радиус и хорда', 'The radius and the chord'),
  eyebrow: L('Masofa', 'Расстояние', 'Distance'),
  setup: L(
    "Aylananing radiusi yigirma besh, unda AB vatari chizilgan va uning uzunligi qirq sakkiz. Markazdan vatarga perpendikulyar tushirilgan — u vatarni teng ikkiga bo'ladi va to'g'ri burchakli uchburchak hosil qiladi.",
    'Радиус окружности двадцать пять, в ней проведена хорда AB длиной сорок восемь. Из центра на хорду опущен перпендикуляр — он делит хорду пополам и образует прямоугольный треугольник.',
    'The radius of a circle is twenty five and a chord AB of length forty eight is drawn in it. A perpendicular is dropped from the centre onto the chord — it halves the chord and forms a right triangle.'),
  label: L('Markazdan vatargacha masofa', 'Расстояние от центра до хорды', 'The distance from the centre to the chord'),
  ask: L(
    'Markazdan vatargacha masofa nechaga teng?',
    'Чему равно расстояние от центра до хорды?',
    'What is the distance from the centre to the chord?'),
  correctText: L(
    "To'g'ri. Uchburchakning uch tomoni shunday: gipotenuza — radius, ya'ni yigirma besh; bir katet — vatarning YARMI, ya'ni yigirma to'rt; ikkinchi katet esa izlanadigan masofa. Olti yuz yigirma besh minus besh yuz yetmish olti qirq to'qqiz, ildizi yetti. Tekshirish: yetti, yigirma to'rt, yigirma besh — bu Pifagor uchligi (44-darsdan tanish naqsh). Diqqat qiladigan joy: vatar juda uzun, ya'ni u diametrga yaqin (diametr ellik), shuning uchun masofa kichik chiqdi.",
    'Верно. Три стороны треугольника такие: гипотенуза — радиус, двадцать пять; один катет — ПОЛОВИНА хорды, двадцать четыре; второй катет — искомое расстояние. Шестьсот двадцать пять минус пятьсот семьдесят шесть — сорок девять, корень семь. Проверка: семь, двадцать четыре, двадцать пять — пифагорова тройка (знакомая по уроку 44). На что стоит обратить внимание: хорда очень длинная, близкая к диаметру (диаметр пятьдесят), поэтому расстояние вышло малым.',
    'Correct. The three sides of the triangle are: the hypotenuse is the radius, twenty five; one leg is HALF the chord, twenty four; the other leg is the distance sought. Six hundred twenty five minus five hundred seventy six is forty nine, the root seven. Check: seven, twenty four, twenty five — a Pythagorean triple (familiar from lesson 44). Worth noticing: the chord is very long, close to the diameter (which is fifty), so the distance came out small.'),
  wrongs: [
    { when: (s) => s.value === 1, text: L(
      "Bir — chiziqli ayirish: yigirma besh minus yigirma to'rt. Lekin Pifagor teoremasi uzunliklarni emas, KVADRATLARNI ayiradi: olti yuz yigirma besh minus besh yuz yetmish olti qirq to'qqiz, va faqat undan keyin ildiz chiqariladi — yetti.",
      'Один — линейное вычитание: двадцать пять минус двадцать четыре. Но теорема Пифагора вычитает не длины, а КВАДРАТЫ: шестьсот двадцать пять минус пятьсот семьдесят шесть — сорок девять, и только потом извлекается корень — семь.',
      'One is a plain subtraction: twenty five minus twenty four. But the Pythagorean theorem subtracts SQUARES, not lengths: six hundred twenty five minus five hundred seventy six is forty nine, and only then the root is taken — seven.') },
    { when: (s) => s.value === 49, text: L(
      "Qirq to'qqiz — masofaning KVADRATI, ya'ni oraliq natija. Undan ildiz chiqarish qoladi: yetti. Tekshirish oson: yetti kvadrat qo'shuv yigirma to'rt kvadrat qirq to'qqiz qo'shuv besh yuz yetmish olti, ya'ni olti yuz yigirma besh — radiusning kvadrati.",
      'Сорок девять — КВАДРАТ расстояния, промежуточный результат. Остаётся извлечь корень: семь. Проверить легко: семь в квадрате плюс двадцать четыре в квадрате — сорок девять плюс пятьсот семьдесят шесть, то есть шестьсот двадцать пять, квадрат радиуса.',
      'Forty nine is the SQUARE of the distance, an intermediate result. Taking the root remains: seven. An easy check: seven squared plus twenty four squared is forty nine plus five hundred seventy six, that is six hundred twenty five, the square of the radius.') },
    { when: (s) => s.value === 14 || s.value === 24 || s.value === 7.5, text: L(
      "Bu son hisobning boshqa bo'lagi. Masofa — to'g'ri burchakli uchburchakning KATETI, va u ikkilantirilmaydi: ikkilantirish faqat vatarni izlaganda kerak bo'ladi, chunki u ikki yarimdan yig'iladi. Bosqichma-bosqich yuring: yarim vatar yigirma to'rt, kvadratlarni ayiring, ildizni chiqaring.",
      'Это число — другая часть счёта. Расстояние — КАТЕТ прямоугольного треугольника, и его не удваивают: удвоение нужно лишь тогда, когда ищут хорду, ведь она складывается из двух половин. Иди по шагам: половина хорды двадцать четыре, вычти квадраты, извлеки корень.',
      'This number is another part of the computation. The distance is a LEG of the right triangle and it is not doubled: doubling is needed only when the chord is sought, since it is made of two halves. Go step by step: half the chord is twenty four, subtract the squares, take the root.') },
  ],
  wrongText: L(
    "Katet — vatarning yarmi (24), gipotenuza — radius (25). Kvadratlarni ayirib ildiz chiqaring.",
    'Катет — половина хорды (24), гипотенуза — радиус (25). Вычти квадраты и извлеки корень.',
    'The leg is half the chord (24), the hypotenuse the radius (25). Subtract the squares and take the root.'),
};

export default function D49_07(props) { return <TypeValue data={DATA} {...props} />; }
