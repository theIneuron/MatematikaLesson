// Dars33 · Amaliyot 02 — Ko'rsatkich · 🟢 · tag: exponent_big
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §5 (33-dars, 2-pozitsiya)
//
// KATTA SON, YA'NI KO'RSATKICH MUSBAT (T2). Mantissa TAYYOR berilgan —
// bu yerda tekshiriladigan narsa faqat ko'rsatkich, ya'ni vergulning necha
// xona surilgani.
//
// Uch xato: 7 — raqamlar sonini sanash (4 300 000 da yettita raqam bor);
// 5 — vergulni bir kam surish; −6 — ishorani teskari qo'yish (З67).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'exponent_big', level: '🟢',
  target: 6, allowNeg: true,
  expr: ['4 300 000 = 4,3 · 10ⁿ'], exprSize: 22,
  eyebrow: L("Ko'rsatkich", 'Показатель', 'Exponent'),
  setup: L(
    "Katta son standart ko'rinishda yozildi. Birinchi ko'paytuvchi tayyor turibdi, o'nning ko'rsatkichini topish kerak.",
    'Большое число записали в стандартном виде. Первый множитель уже готов, надо найти показатель десяти.',
    'A large number has been written in standard form. The first factor is ready; the exponent of ten must be found.'),
  label: L("Ko'rsatkich n", 'Показатель n', 'The exponent n'),
  ask: L('n nechaga teng?', 'Чему равно n?', 'What does n equal?'),
  correctText: L(
    "To'g'ri. Vergulni to'rtdan keyin qo'yish uchun uni chapga surish kerak: to'rt million uch yuz mingda vergul oxirida turibdi, va u olti xona chapga suriladi — nol, nol, nol, nol, uch, va oxirida to'rtdan keyin to'xtaydi. Har chapga surilgan xona ko'rsatkichni bittaga OSHIRADI, chunki mantissa kichrayganini o'nning darajasi qoplashi kerak. Demak ko'rsatkich olti. Tekshirish: to'rt butun uch o'ndan ni o'nning oltinchi darajasiga ko'paytiring — to'rt million uch yuz ming chiqadi.",
    'Верно. Чтобы поставить запятую после четвёрки, её надо сдвинуть влево: в четырёх миллионах трёхстах тысячах запятая стоит в конце, и она сдвигается на шесть разрядов влево — нуль, нуль, нуль, нуль, три, и наконец останавливается после четвёрки. Каждый сдвиг влево УВЕЛИЧИВАЕТ показатель на единицу, потому что уменьшение мантиссы должна возместить степень десяти. Значит показатель шесть. Проверка: умножь четыре целых три десятых на десять в шестой — получится четыре миллиона триста тысяч.',
    'Correct. To place the point after the four it must move left: in four million three hundred thousand the point stands at the end, and it moves six places left — zero, zero, zero, zero, three, and finally stops after the four. Each move to the left RAISES the exponent by one, because the power of ten must make up for the shrinking mantissa. So the exponent is six. Check: multiply four point three by ten to the sixth — you get four million three hundred thousand.'),
  wrongs: [
    { when: (s) => s.value === 7, text: L(
      "Raqamlar SONI sanaldi: to'rt million uch yuz mingda yettita raqam bor. Lekin ko'rsatkich raqamlarni emas, VERGUL surilgan xonalarni sanaydi, va vergul birinchi raqamdan KEYIN to'xtaydi. To'rtta raqamning o'zi joyida qoladi va sanoqqa kirmaydi. Tekshiring: o'nning yettinchi darajasi qirq uch million beradi, to'rt million uch yuz ming emas.",
      'Сосчитали КОЛИЧЕСТВО цифр: в четырёх миллионах трёхстах тысячах семь цифр. Но показатель считает не цифры, а разряды СДВИГА запятой, а запятая останавливается ПОСЛЕ первой цифры. Сама четвёрка остаётся на месте и в счёт не входит. Проверь: десять в седьмой даёт сорок три миллиона, а не четыре миллиона триста тысяч.',
      'The COUNT of digits was taken: four million three hundred thousand has seven digits. But the exponent counts not digits, it counts the places the point MOVES, and the point stops AFTER the first digit. The four itself stays put and is not counted. Check: ten to the seventh gives forty-three million, not four million three hundred thousand.') },
    { when: (s) => s.value === 5, text: L(
      "Vergul bir xona kam surildi. Sanashning ishonchli yo'li — vergulni bosqichma-bosqich ko'chirish va har qadamni ovoz chiqarib aytish: to'rt million uch yuz ming, keyin to'rt yuz o'ttiz ming, keyin qirq uch ming, uch ming to'rt yuz o'ttiz emas… Yoki oddiyroq: to'rtdan keyingi raqamlarni sanang — uch, nol, nol, nol, nol, nol, ya'ni oltita.",
      'Запятую сдвинули на разряд меньше. Надёжный способ счёта — переносить запятую по шагам и проговаривать каждый: четыре миллиона триста тысяч, потом четыреста тридцать тысяч, потом сорок три тысячи… Или проще: сосчитай цифры после четвёрки — три, нуль, нуль, нуль, нуль, нуль, то есть шесть.',
      'The point was moved one place too few. A safe way to count is to move the point step by step and say each step aloud: four million three hundred thousand, then four hundred thirty thousand, then forty-three thousand… Or more simply: count the digits after the four — three, zero, zero, zero, zero, zero, that is six.') },
    { when: (s) => s.value === -6, text: L(
      "Ko'rsatkichning kattaligi to'g'ri, ishorasi esa teskari. Bu son KATTA — to'rt milliondan ortiq, — ya'ni uni olish uchun to'rt butun uch o'ndan ni KATTALASHTIRISH kerak. Manfiy ko'rsatkich esa kichraytiradi: o'nning minus oltinchi darajasi bir millionning bir bo'lagi, va to'rt butun uch o'ndan ni unga ko'paytirsangiz nol butun nol nol nol nol nol qirq uch chiqadi. Musbat ko'rsatkich katta sonni, manfiysi kichik sonni beradi.",
      'Величина показателя верна, а знак перевёрнут. Это число БОЛЬШОЕ — больше четырёх миллионов, — значит, чтобы его получить, четыре целых три десятых надо УВЕЛИЧИТЬ. А отрицательный показатель уменьшает: десять в минус шестой это одна миллионная, и четыре целых три десятых, умноженные на неё, дают нуль целых сорок три десятимиллионных. Положительный показатель даёт большое число, отрицательный — маленькое.',
      'The size of the exponent is right, the sign is inverted. This number is LARGE — over four million — so to reach it, four point three must be made BIGGER. A negative exponent makes things smaller: ten to the minus six is one millionth, and four point three times that is a tiny fraction. A positive exponent gives a large number, a negative one a small number.') },
  ],
  wrongText: L(
    "Vergul necha xona surilganini sanang, raqamlarni emas. Chapga surilsa ko'rsatkich musbat va har xona uni bittaga oshiradi.",
    'Считай, на сколько разрядов сдвинулась запятая, а не количество цифр. При сдвиге влево показатель положителен, и каждый разряд увеличивает его на единицу.',
    'Count how many places the point moved, not how many digits there are. Moving left makes the exponent positive, and each place raises it by one.'),
};

export default function D33_02(props) { return <TypeValue data={DATA} {...props} />; }
