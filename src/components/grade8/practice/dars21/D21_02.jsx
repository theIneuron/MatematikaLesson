// Dars21 · Amaliyot 02 — Eni · 🟢 · tag: rect_side
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §3 (21-dars, 2-pozitsiya)
//
// T2 va T3 BIR TOPSHIRIQDA. Tenglama tayyor holda berilgan (topshiriq 🟢),
// ya'ni tekshiriladigan ish — yechish va IKKI ildizdan bittasini masala
// sharti bilan rad etish.
//
// Uch xato yo'l: sakkiz (bo'yi topildi, eni so'ralgan edi), minus sakkiz
// (haqiqiy ildiz, lekin uzunlik manfiy bo'lmaydi — З47), qirq (yuza javob
// deb yozildi).
// Harf `a`: 03-topshiriqda ham `a`, chunki ikkalasi ham TOMON haqida.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'rect_side', level: '🟢',
  target: 5, allowNeg: true,
  expr: ['a(a + 3) = 40'], exprSize: 28,
  eyebrow: L('Eni', 'Ширина', 'Width'),
  setup: L(
    "To'rtburchakning bo'yi enidan 3 sm ortiq, yuzi esa 40 sm². Eni a bilan belgilangan va shartdan tenglama tuzilgan. Tenglamaning ikki ildizi bor, javob esa bitta.",
    'Длина прямоугольника на 3 см больше ширины, а площадь равна 40 см². Ширина обозначена через a, и по условию составлено уравнение. У уравнения два корня, а ответ один.',
    "A rectangle's length is 3 cm greater than its width, and its area is 40 cm². The width is denoted by a, and the equation follows from the condition. The equation has two roots, but the answer is one."),
  label: L("Enining uzunligi, sm", 'Ширина, см', 'The width, cm'),
  ask: L('Enini toping.', 'Найди ширину.', 'Find the width.'),
  correctText: L(
    "To'g'ri. Qavsni ochamiz: a kvadrat qo'shuv uch a minus qirq nolga teng. Diskriminanti bir yuz oltmish to'qqiz, ildizlari besh va minus sakkiz. Minus sakkiz tenglamani to'g'ri qiladi, lekin uzunligi minus sakkiz santimetr bo'lgan tomon yo'q. Tekshirish: eni besh, bo'yi sakkiz, yuzi qirq.",
    'Верно. Раскрываем скобку: a квадрат плюс три a минус сорок равно нулю. Дискриминант сто шестьдесят девять, корни пять и минус восемь. Минус восемь обращает уравнение в верное, но стороны длиной минус восемь сантиметров не бывает. Проверка: ширина пять, длина восемь, площадь сорок.',
    'Correct. Expand the bracket: a squared plus three a minus forty equals zero. The discriminant is one hundred sixty nine, the roots five and minus eight. Minus eight satisfies the equation, but a side of minus eight centimetres does not exist. Check: width five, length eight, area forty.'),
  wrongs: [
    { when: (s) => s.value === 8, text: L(
      "Bu son masalada bor, lekin u BO'YI. Savol enini so'ragan, eni esa harf bilan belgilangan: a. Sakkiz — bu a qo'shuv uch, ya'ni ikkinchi tomon. Tenglamaning ildizi enini beradi, undan keyin bo'yini topish uchun yana uch qo'shiladi.",
      'Это число в задаче есть, но это ДЛИНА. Спрашивали ширину, а ширина обозначена буквой a. Восемь — это a плюс три, то есть вторая сторона. Корень уравнения даёт ширину, и уже потом, чтобы найти длину, прибавляют три.',
      'That number does appear in the problem, but it is the LENGTH. The question asked for the width, and the width is the letter a. Eight is a plus three, the other side. The root of the equation gives the width; only then does one add three to get the length.') },
    { when: (s) => s.value === -8, text: L(
      "Bu son tenglamaning haqiqiy ildizi: minus sakkiz karra minus besh qirqqa teng. Lekin masala TOMON UZUNLIGINI so'rayapti, uzunlik esa manfiy bo'lmaydi. Shuning uchun bu ildiz masala shartiga zid va javobga kiritilmaydi. Tenglamaning ildizi bo'lish yetarli emas — javob masalaning o'ziga ham to'g'ri kelishi kerak.",
      'Это настоящий корень уравнения: минус восемь на минус пять равно сорока. Но задача спрашивает ДЛИНУ СТОРОНЫ, а длина отрицательной не бывает. Значит этот корень противоречит условию задачи и в ответ не включается. Быть корнем уравнения мало — ответ должен подойти и самой задаче.',
      'That is a genuine root of the equation: minus eight times minus five equals forty. But the problem asks for the LENGTH OF A SIDE, and a length is never negative. So this root contradicts the condition and is not included in the answer. Being a root of the equation is not enough — the answer must fit the problem itself.') },
    { when: (s) => s.value === 40 || s.value === 20, text: L(
      "Bu son yuzadan olingan, tomondan emas. Qirq — bu ikki tomonning KO'PAYTMASI, ya'ni butun to'rtburchakning yuzi. Tomonni topish uchun tenglamani yechish kerak: a kvadrat qo'shuv uch a minus qirq nolga teng.",
      'Это число взято из площади, а не из стороны. Сорок — это ПРОИЗВЕДЕНИЕ двух сторон, то есть площадь всего прямоугольника. Чтобы найти сторону, надо решить уравнение: a квадрат плюс три a минус сорок равно нулю.',
      'That number comes from the area, not from a side. Forty is the PRODUCT of the two sides, the area of the whole rectangle. To find a side you must solve the equation: a squared plus three a minus forty equals zero.') },
  ],
  wrongText: L(
    "Qavsni ochib standart shaklga keltiring va ikkala ildizni toping. Keyin har birini masala shartiga solishtiring: tomon uzunligi manfiy bo'lmaydi. Javobni tekshiring — eni karra bo'yi qirqqa teng bo'lsin.",
    'Раскрой скобку, приведи к стандартному виду и найди оба корня. Потом сверь каждый с условием задачи: длина стороны не бывает отрицательной. Проверь ответ — ширина на длину должна дать сорок.',
    'Expand the bracket, bring it to standard form and find both roots. Then compare each with the problem: a side length is never negative. Check your answer — width times length must be forty.'),
};

export default function D21_02(props) { return <TypeValue data={DATA} {...props} />; }
