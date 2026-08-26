// Dars31 · Amaliyot 08 — Maxraj · 🔴 · tag: denominator_of_power
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §3 (31-dars, 8-pozitsiya)
//
// NEGA MAXRAJ SO'RALADI. `TypeValue` faqat BUTUN sonni qabul qiladi
// (`parseInt`), ya'ni «3⁻⁴ nechaga teng» degan savolga javob yozib
// bo'lmaydi — u kasr. Shuning uchun savol yozuvning MAXRAJI haqida, va
// mazmun o'zgarmaydi: maxrajni topish uchun manfiy ko'rsatkichni ochish va
// darajani hisoblash kerak.
//
// Uch xato uch xil: 12 — ko'rsatkichni ko'paytuvchi deb olish; −81 —
// ishorani kasrga o'tkazish (З63); 64 — asos va ko'rsatkichni almashtirish.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'denominator_of_power', level: '🔴',
  target: 81, allowNeg: true,
  expr: ['3⁻⁴ =', { n: '1', d: 'n' }], exprSize: 28,
  eyebrow: L('Maxraj', 'Знаменатель', 'Denominator'),
  setup: L(
    "Manfiy ko'rsatkichli daraja bir bo'lingan biror son ko'rinishida yozildi. Maxrajda turgan sonni topish kerak.",
    'Степень с отрицательным показателем записали в виде единицы, делённой на некоторое число. Надо найти число, стоящее в знаменателе.',
    'A power with a negative exponent was written as one divided by some number. Find the number that stands in the denominator.'),
  label: L('Maxraj n', 'Знаменатель n', 'The denominator n'),
  ask: L('n nechaga teng?', 'Чему равно n?', 'What does n equal?'),
  correctText: L(
    "To'g'ri. Manfiy ko'rsatkich asosni maxrajga tushiradi va ko'rsatkichni musbat qiladi: uchning minus to'rtinchi darajasi bir bo'lingan uchning to'rtinchi darajasi. Endi maxrajni hisoblaymiz: uch karra uch to'qqiz, to'qqiz karra uch yigirma yetti, yigirma yetti karra uch sakson bir. Demak maxraj sakson bir, va butun yozuv bir bo'lingan sakson bir ga teng. Tekshirish: sakson birni uchning minus to'rtinchi darajasiga ko'paytirsak bir chiqishi kerak, va chindan ham shunday.",
    'Верно. Отрицательный показатель уводит основание в знаменатель и делает показатель положительным: три в минус четвёртой это единица делить на три в четвёртой. Теперь считаем знаменатель: трижды три девять, девять на три двадцать семь, двадцать семь на три восемьдесят один. Значит знаменатель восемьдесят один, а вся запись равна одной восемьдесят первой. Проверка: восемьдесят один, умноженное на три в минус четвёртой, должно дать единицу, и так оно и есть.',
    'Correct. A negative exponent sends the base into the denominator and makes the exponent positive: three to the minus four is one divided by three to the fourth. Now compute the denominator: three times three is nine, nine times three is twenty-seven, twenty-seven times three is eighty-one. So the denominator is eighty-one and the whole record equals one eighty-first. Check: eighty-one times three to the minus four must give one, and it does.'),
  wrongs: [
    { when: (s) => s.value === 12, text: L(
      "Asos ko'rsatkichga KO'PAYTIRILDI: uch karra to'rt o'n ikki. Lekin ko'rsatkich ko'paytuvchi emas, u ko'paytuvchilarning SONI. Uchning to'rtinchi darajasi degani to'rtta uchni bir-biriga ko'paytirish: uch karra uch karra uch karra uch. Sanang — sakson bir chiqadi, o'n ikki emas.",
      'Основание УМНОЖИЛИ на показатель: трижды четыре двенадцать. Но показатель не множитель, он КОЛИЧЕСТВО множителей. Три в четвёртой степени значит перемножить четыре тройки: три на три на три на три. Посчитай — получится восемьдесят один, а не двенадцать.',
      'The base was MULTIPLIED by the exponent: three times four is twelve. But the exponent is not a factor, it is the NUMBER of factors. Three to the fourth means multiplying four threes together: three times three times three times three. Count it — you get eighty-one, not twelve.') },
    { when: (s) => s.value === -81, text: L(
      "Maxraj to'g'ri hisoblandi, lekin unga minus qo'shildi. Manfiy ko'rsatkich ISHORANI olib kelmaydi — u faqat ag'daradi. Uchdan qanchasini ko'paytirsangiz ham manfiy son chiqmaydi: uchning to'rtinchi darajasi musbat, ya'ni maxraj ham musbat. Minus faqat ASOS manfiy bo'lganda paydo bo'ladi, bu yerda esa asos uch.",
      'Знаменатель посчитан верно, но к нему добавили минус. Отрицательный показатель не приносит ЗНАК — он лишь переворачивает. Сколько троек ни перемножай, отрицательного числа не выйдет: три в четвёртой положительно, значит и знаменатель положителен. Минус появляется, только если отрицательно САМО ОСНОВАНИЕ, а здесь основание три.',
      'The denominator was computed correctly, but a minus was added to it. A negative exponent does not bring a SIGN — it only turns things over. However many threes you multiply, no negative number appears: three to the fourth is positive, so the denominator is positive too. A minus shows up only when the BASE itself is negative, and here the base is three.') },
    { when: (s) => s.value === 64, text: L(
      "Asos va ko'rsatkich almashib ketdi: to'rtning kubi oltmish to'rt, lekin bizda uchning to'rtinchi darajasi turibdi. Yozuvni o'qing — pastda katta yozilgan son ASOS, tepada kichik yozilgani KO'RSATKICH. Uch marta emas, to'rt marta ko'paytiriladi, va ko'paytiriladigan son uch.",
      'Основание и показатель поменялись местами: четыре в кубе шестьдесят четыре, но у нас три в четвёртой. Читай запись — крупное число снизу это ОСНОВАНИЕ, маленькое сверху ПОКАЗАТЕЛЬ. Умножаем не три раза, а четыре, и умножаем тройки.',
      'The base and the exponent were swapped: four cubed is sixty-four, but what we have is three to the fourth. Read the record — the large number below is the BASE, the small one above is the EXPONENT. We multiply four times, not three, and it is threes that are multiplied.') },
    { when: (s) => s.value === 3 || s.value === 4 || s.value === 9 || s.value === 27, text: L(
      "Hisob oxirigacha yetmadi. Uchning to'rtinchi darajasini bosqichma-bosqich yozing: uchning kvadrati to'qqiz, kubi yigirma yetti, to'rtinchi darajasi sakson bir. Ko'rsatkich to'rt, ya'ni to'rtta ko'paytuvchi bo'lishi kerak.",
      'Счёт не доведён до конца. Распиши три в четвёртой по шагам: три в квадрате девять, в кубе двадцать семь, в четвёртой восемьдесят один. Показатель четыре, значит множителей должно быть четыре.',
      'The computation stopped short. Write three to the fourth step by step: three squared is nine, cubed is twenty-seven, to the fourth is eighty-one. The exponent is four, so there must be four factors.') },
  ],
  wrongText: L(
    "Manfiy ko'rsatkichni oching: asos maxrajga tushadi, ko'rsatkich musbat bo'ladi. Keyin darajani ko'paytirish bilan sanang — ko'rsatkich ko'paytuvchilar sonini beradi.",
    'Раскрой отрицательный показатель: основание уходит в знаменатель, показатель становится положительным. Потом сосчитай степень умножением — показатель даёт число множителей.',
    'Unfold the negative exponent: the base goes into the denominator and the exponent turns positive. Then count the power by multiplying — the exponent gives the number of factors.'),
};

export default function D31_08(props) { return <TypeValue data={DATA} {...props} />; }
