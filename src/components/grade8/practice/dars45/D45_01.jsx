// Dars45 · Amaliyot 01 — Test · 🟢 · tag: how_to_check
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §7 (45-dars, 1-pozitsiya)
//
// TESKARI TEOREMANI QO'LLASHNING TARTIBI. Uch xato variant: З94 (oxirida
// yozilgan tomonni olish), З91 (uchala tomonni qo'shish), eng kichik tomonni
// olish. Razbor darslikning masalasini keltiradi: √85, 7, 6 — eng katta tomon
// birinchi yozilgan, `c` harfi bilan esa olti turadi.
// `Choice` ning variantlari SO'Z, ya'ni `tr()` dan o'tadi (skelet §0a.4).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'how_to_check', level: '🟢',
  correct: 0, optCols: 1, optSize: 15,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Uchburchakning uch tomoni son bilan berilgan. Uning to'g'ri burchakli ekanini tekshirish kerak, lekin burchaklar berilmagan — faqat uzunliklar bor.",
    'Три стороны треугольника даны числами. Надо проверить, прямоугольный ли он, но углы не даны — есть только длины.',
    'The three sides of a triangle are given as numbers. Whether it is right-angled must be checked, but no angles are given — only lengths.'),
  ask: L(
    "Uchburchakning to'g'ri burchakli ekani qanday tekshiriladi?",
    'Как проверить, что треугольник прямоугольный?',
    'How do you check that a triangle is right-angled?'),
  opts: [
    { label: L("eng katta tomonning kvadratini qolgan ikkitasining kvadratlari yig'indisi bilan solishtirish",
      'сравнить квадрат наибольшей стороны с суммой квадратов двух других',
      'compare the square of the largest side with the sum of the squares of the other two') },
    { label: L("oxirida yozilgan tomonning kvadratini qolgan ikkitasi bilan solishtirish",
      'сравнить квадрат последней записанной стороны с двумя другими',
      'compare the square of the side written last with the other two') },
    { label: L("uchala tomonni qo'shib, yig'indini tekshirish",
      'сложить все три стороны и проверить сумму',
      'add all three sides and check the sum') },
    { label: L("eng kichik tomonning kvadratini qolgan ikkitasining kvadratlari yig'indisi bilan solishtirish",
      'сравнить квадрат наименьшей стороны с суммой квадратов двух других',
      'compare the square of the smallest side with the sum of the squares of the other two') },
  ],
  correctText: L(
    "To'g'ri. Tekshirish IKKI qadamda boradi va birinchi qadam ko'pincha tashlab ketiladi: avval eng katta tomonni ANIQLASH, keyin uning kvadratini qolgan ikkitasining kvadratlari yig'indisi bilan solishtirish. Nima uchun aynan eng katta: agar uchburchak to'g'ri burchakli bo'lsa, tenglik faqat gipotenuza uchun bajariladi, gipotenuza esa eng katta tomon. Darslikning masalasi buni ochiq ko'rsatadi: ildiz ostida sakson besh, yetti va olti berilgan. Eng katta tomon ildiz ostida sakson besh, ya'ni to'qqizdan bir oz katta — u BIRINCHI yozilgan, oxirida esa olti turadi.",
    'Верно. Проверка идёт в ДВА шага, и первый часто пропускают: сначала ОПРЕДЕЛИТЬ наибольшую сторону, потом сравнить её квадрат с суммой квадратов двух других. Почему именно наибольшую: если треугольник прямоугольный, равенство выполняется только для гипотенузы, а гипотенуза — наибольшая сторона. Задача учебника показывает это прямо: даны корень из восьмидесяти пяти, семь и шесть. Наибольшая сторона — корень из восьмидесяти пяти, то есть чуть больше девяти, и она записана ПЕРВОЙ, а последней стоит шесть.',
    'Correct. The check takes TWO steps and the first is often skipped: first IDENTIFY the largest side, then compare its square with the sum of the squares of the other two. Why the largest: if the triangle is right-angled the equality holds only for the hypotenuse, and the hypotenuse is the largest side. The textbook problem shows this plainly: the root of eighty five, seven and six are given. The largest side is the root of eighty five, a little over nine, and it is written FIRST while six stands last.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Yozuvdagi tartib hech narsani anglatmaydi. Darslikning masalasida eng katta tomon BIRINCHI yozilgan: ildiz ostida sakson besh, keyin yetti, keyin olti. Oxirgi tomonni olib tekshirsangiz, o'ttiz olti sakson besh qo'shuv qirq to'qqizga teng emas degan xulosa chiqadi va uchburchak to'g'ri burchakli emas deb hisoblanadi — aslida u to'g'ri burchakli. Oldin eng KATTA tomonni topish kerak.",
      'Порядок в записи ничего не значит. В задаче учебника наибольшая сторона записана ПЕРВОЙ: корень из восьмидесяти пяти, потом семь, потом шесть. Если взять последнюю сторону, выйдет, что тридцать шесть не равно восьмидесяти пяти плюс сорок девять, и треугольник признают не прямоугольным — а он прямоугольный. Сначала надо найти НАИБОЛЬШУЮ сторону.',
      'The order in the record means nothing. In the textbook problem the largest side is written FIRST: the root of eighty five, then seven, then six. Taking the last side you conclude that thirty six does not equal eighty five plus forty nine and call the triangle not right-angled — while it is. The LARGEST side must be found first.') },
    { when: (s) => s.picked === 2, text: L(
      "Tomonlarning yig'indisi perimetr bo'ladi, va u burchaklar haqida hech narsa aytmaydi: bir xil perimetrli uchburchaklardan biri to'g'ri burchakli, ikkinchisi esa bo'lmasligi mumkin. Tekshiruv KVADRATLARNI solishtiradi, uzunliklarni emas.",
      'Сумма сторон — это периметр, и об углах он не говорит ничего: из двух треугольников с одним периметром один может быть прямоугольным, а другой нет. Проверка сравнивает КВАДРАТЫ, а не длины.',
      'The sum of the sides is the perimeter, and it says nothing about the angles: of two triangles with the same perimeter one may be right-angled and the other not. The check compares SQUARES, not lengths.') },
    { when: (s) => s.picked === 3, text: L(
      "Eng kichik tomonning kvadrati qolgan ikkitasining yig'indisidan har doim kichik bo'ladi, ya'ni bunday tekshiruv hech qachon tenglik bermaydi. Uch, to'rt, besh uchligida ko'ring: to'qqiz o'n olti qo'shuv yigirma beshdan ancha kichik. Tenglik faqat ENG KATTA tomon uchun bo'lishi mumkin.",
      'Квадрат наименьшей стороны всегда меньше суммы квадратов двух других, то есть такая проверка равенства не даст никогда. Посмотри на тройке три, четыре, пять: девять заметно меньше, чем шестнадцать плюс двадцать пять. Равенство возможно только для НАИБОЛЬШЕЙ стороны.',
      'The square of the smallest side is always less than the sum of the squares of the other two, so such a check never yields equality. Look at the triple three, four, five: nine is far less than sixteen plus twenty five. Equality is possible only for the LARGEST side.') },
  ],
  wrongText: L(
    "Birinchi qadam — eng katta tomonni topish. Faqat undan keyin kvadratlar solishtiriladi.",
    'Первый шаг — найти наибольшую сторону. Только после этого сравниваются квадраты.',
    'The first step is to find the largest side. Only then are the squares compared.'),
};

export default function D45_01(props) { return <Choice data={DATA} {...props} />; }
