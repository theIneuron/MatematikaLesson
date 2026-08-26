// Dars33 · Amaliyot 08 — Test · 🔴 · tag: which_standard
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §5 (33-dars, 8-pozitsiya)
//
// UCH XATO VARIANT — UCH XIL XATO, LEKIN HAMMASI BITTA SONDAN CHIQADI:
//   4,5·10⁷   — ishora almashgan (З67), va son ulkan bo'lib qoladi
//   45·10⁻⁸   — mantissa o'ndan katta (З66), qiymati esa TO'G'RI
//   0,45·10⁻⁶ — mantissa birdan kichik (З66 ning ikkinchi tomoni), qiymati
//               ham TO'G'RI
// Oxirgi ikkitasi qimmat: ular SONNI to'g'ri beradi, lekin YOZUV standart
// emas. Razbor shu farqni ochiq aytadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_standard', level: '🔴',
  correct: 0, optCols: 2, optSize: 19,
  expr: ['0,000 000 45'], exprSize: 26,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Juda kichik son berilgan. To'rt yozuvdan uchtasi to'g'ri qiymatni beradi, lekin standart ko'rinishda faqat bittasi turadi.",
    'Дано очень маленькое число. Три записи из четырёх дают верное значение, но в стандартном виде стоит только одна.',
    'A very small number is given. Three of the four records give the right value, but only one is in standard form.'),
  ask: L(
    "Bu sonning standart ko'rinishi qaysi?",
    'Какая запись — стандартный вид этого числа?',
    'Which record is the standard form of this number?'),
  opts: [
    { label: ['4,5 · 10⁻⁷'] },
    { label: ['4,5 · 10⁷'] },
    { label: ['45 · 10⁻⁸'] },
    { label: ['0,45 · 10⁻⁶'] },
  ],
  correctText: L(
    "To'g'ri. Birinchi nolmas raqam to'rt, va vergulni undan keyin qo'yish uchun uni yetti xona o'ngga surish kerak — o'ngga surilgani ko'rsatkichni manfiy qiladi. Mantissa to'rt butun besh o'ndan: birdan katta, o'ndan kichik, ya'ni shart bajarildi. Diqqat qilinadigan joy: qolgan uch variantdan ikkitasi ham AYNAN o'sha sonni beradi — qirq besh karra o'nning minus sakkizinchi darajasi va nol butun qirq besh yuzdan karra o'nning minus oltinchi darajasi. Ular yolg'on emas, lekin ular STANDART emas: standart ko'rinishning butun ma'nosi shundaki, bitta songa bitta yozuv to'g'ri keladi.",
    'Верно. Первая ненулевая цифра — четвёрка, и чтобы поставить запятую после неё, надо сдвинуть её на семь разрядов вправо, а сдвиг вправо делает показатель отрицательным. Мантисса четыре целых пять десятых: больше единицы, меньше десяти, условие выполнено. На что стоит обратить внимание: два из оставшихся вариантов дают ТО ЖЕ САМОЕ число — сорок пять на десять в минус восьмой и нуль целых сорок пять сотых на десять в минус шестой. Они не ложны, но они не СТАНДАРТНЫ: весь смысл стандартного вида в том, что одному числу отвечает одна запись.',
    'Correct. The first non-zero digit is four, and to place the point after it you move it seven places right, and moving right makes the exponent negative. The mantissa is four point five: above one, below ten, so the condition holds. Worth noting: two of the remaining options give the VERY SAME number — forty-five times ten to the minus eight, and zero point four five times ten to the minus six. They are not false, but they are not STANDARD: the whole point of standard form is that one number gets one record.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ishora almashgan. Bu variant to'g'ri son ham bermaydi: to'rt butun besh o'ndan karra o'nning yettinchi darajasi qirq besh million. Berilgan son esa birdan ancha kichik. Sonning kattaligiga qarab ishorani darhol aniqlash mumkin: son birdan kichik bo'lsa ko'rsatkich manfiy, boshqa variant yo'q.",
      'Знак перевёрнут. Этот вариант не даёт даже верного числа: четыре целых пять десятых на десять в седьмой это сорок пять миллионов. А данное число намного меньше единицы. Знак можно определить сразу по величине: если число меньше единицы, показатель отрицателен, других вариантов нет.',
      'The sign is inverted. This option does not even give the right number: four point five times ten to the seventh is forty-five million. The given number is far below one. The sign can be settled at once by size: a number below one takes a negative exponent, and there is no other option.') },
    { when: (s) => s.picked === 2, text: L(
      "Bu yozuv to'g'ri SONNI beradi, lekin u standart emas: mantissa qirq besh, va u o'ndan katta. Tekshiring — qirq besh karra o'nning minus sakkizinchi darajasi haqiqatan ham berilgan son. Lekin standart ko'rinishning sharti mantissaga qo'yilgan, va uni bajarish uchun vergulni yana bir xona chapga surish kerak: o'shanda mantissa to'rt butun besh o'ndan bo'ladi va ko'rsatkich bittaga ortadi.",
      'Эта запись даёт верное ЧИСЛО, но она не стандартна: мантисса сорок пять, а она больше десяти. Проверь — сорок пять на десять в минус восьмой это действительно данное число. Но условие стандартного вида наложено на мантиссу, и чтобы его выполнить, надо сдвинуть запятую ещё на разряд влево: тогда мантисса станет четыре целых пять десятых, а показатель увеличится на единицу.',
      'This record gives the right NUMBER, but it is not standard: the mantissa is forty-five, which exceeds ten. Check — forty-five times ten to the minus eight really is the given number. But the standard-form condition applies to the mantissa, and to meet it the point must move one more place left: then the mantissa becomes four point five and the exponent rises by one.') },
    { when: (s) => s.picked === 3, text: L(
      "Bu yozuv ham to'g'ri sonni beradi, lekin mantissa nol butun qirq besh yuzdan — u birdan KICHIK. Standart ko'rinishda mantissa hech qachon noldan boshlanmaydi. To'g'rilash uchun vergulni bir xona o'ngga suring va ko'rsatkichni bittaga kamaytiring: to'rt butun besh o'ndan karra o'nning minus yettinchi darajasi. Uch yozuv bitta sonni beradi, standart esa faqat bittasi.",
      'Эта запись тоже даёт верное число, но мантисса нуль целых сорок пять сотых — она МЕНЬШЕ единицы. В стандартном виде мантисса никогда не начинается с нуля. Чтобы исправить, сдвинь запятую на разряд вправо и уменьши показатель на единицу: четыре целых пять десятых на десять в минус седьмой. Три записи дают одно число, а стандартна только одна.',
      'This record also gives the right number, but the mantissa is zero point four five — BELOW one. In standard form the mantissa never starts with a zero. To fix it, move the point one place right and lower the exponent by one: four point five times ten to the minus seven. Three records give one number, and only one of them is standard.') },
  ],
  wrongText: L(
    "Avval ishorani sonning kattaligidan aniqlang, keyin mantissani ikki tomondan tekshiring. To'g'ri qiymat berish yetarli emas — yozuv standart bo'lishi kerak.",
    'Сначала определи знак по величине числа, потом проверь мантиссу с двух сторон. Верного значения мало — запись должна быть стандартной.',
    'First settle the sign by the size of the number, then check the mantissa from both sides. Giving the right value is not enough — the record must be standard.'),
};

export default function D33_08(props) { return <Choice data={DATA} {...props} />; }
