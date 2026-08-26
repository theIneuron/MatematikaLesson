// Dars33 · Amaliyot 01 — Ha yoki yo'q · 🟢 · tag: standard_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §5 (33-dars, 1-pozitsiya)
//
// IKKALA DA'VO HAM YOLG'ON (skelet §0a.3), va ular bitta shartning IKKI
// tomonini ko'rsatadi:
//   36·10³  — mantissa o'ndan KATTA;
//   0,4·10⁵ — mantissa birdan KICHIK.
// Ya'ni «birdan o'ngacha» degan shart ikki tomondan chegaralangan, va
// o'quvchi odatda faqat bittasini eslaydi.
//
// Ikkala javob ham «Yo'q» bo'lgani ataylab: bitta da'voni rad etib,
// ikkinchisini «demak bu to'g'ri» deb qabul qilish yo'li yopiladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'standard_claims', level: '🟢',
  itemSize: 18,
  items: [
    { id: 's1', yes: false, tokens: ['36 · 10³'],
      claim: L("bu standart ko'rinish", 'это стандартный вид', 'this is standard form') },
    { id: 's2', yes: false, tokens: ['0,4 · 10⁵'],
      claim: L("bu standart ko'rinish", 'это стандартный вид', 'this is standard form') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki yozuv o'nning darajasi bilan berilgan. Ikkalasi ham to'g'ri sonni ifodalaydi, lekin savol boshqa: bu yozuvlar standart ko'rinishmi.",
    'Две записи даны через степень десяти. Обе выражают правильное число, но вопрос в другом: являются ли эти записи стандартным видом.',
    'Two records are given through a power of ten. Both express a correct number, but the question is different: are these records in standard form.'),
  ask: L(
    "Yozuv standart ko'rinishda bo'lsa «Ha», bo'lmasa «Yo'q».",
    'Если запись в стандартном виде — «Да», если нет — «Нет».',
    'If the record is in standard form, «Yes»; if not, «No».'),
  correctText: L(
    "To'g'ri, ikkalasi ham standart ko'rinish emas. Standart ko'rinishda birinchi ko'paytuvchi birdan o'ngacha bo'lishi kerak, ya'ni birdan kichik bo'lmasin va o'nga yetmasin. Birinchi yozuvda u o'ttiz olti — o'ndan katta, ya'ni shart buzilgan; to'g'ri yozuv uch butun olti o'ndan karra o'nning to'rtinchi darajasi. Ikkinchisida esa nol butun to'rt o'ndan — birdan kichik; to'g'ri yozuv to'rt karra o'nning to'rtinchi darajasi. Ikkala holda ham son o'zgarmadi, faqat vergul bir xona surildi va ko'rsatkich unga mos ravishda tuzatildi.",
    'Верно, ни одна запись не является стандартным видом. В стандартном виде первый множитель должен быть от одного до десяти, то есть не меньше единицы и не достигать десяти. В первой записи он тридцать шесть — больше десяти, условие нарушено; верная запись три целых шесть десятых умножить на десять в четвёртой. Во второй он нуль целых четыре десятых — меньше единицы; верная запись четыре умножить на десять в четвёртой. В обоих случаях само число не изменилось, лишь запятая сдвинулась на разряд, а показатель поправился соответственно.',
    'Correct, neither record is in standard form. In standard form the first factor must be from one to ten, that is, not below one and not reaching ten. In the first record it is thirty-six — greater than ten, so the condition fails; the right record is three point six times ten to the fourth. In the second it is zero point four — less than one; the right record is four times ten to the fourth. In both cases the number itself did not change, only the point moved one place and the exponent was corrected to match.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1 && s.bad.indexOf('s2') !== -1, text: L(
      "Ikkala yozuv ham standart emas, va ikkalasi ham qabul qilindi. Shartni ikki tomondan tekshiring: birinchi ko'paytuvchi birdan kichik bo'lmasin VA o'nga yetmasin. O'ttiz olti o'ndan katta, nol butun to'rt o'ndan esa birdan kichik — har biri bitta chegarani buzadi.",
      'Ни одна запись не стандартна, а приняты обе. Проверяй условие с двух сторон: первый множитель не меньше единицы И не достигает десяти. Тридцать шесть больше десяти, а нуль целых четыре десятых меньше единицы — каждое нарушает свою границу.',
      'Neither record is standard, and both were accepted. Check the condition from both sides: the first factor must be not below one AND not reaching ten. Thirty-six exceeds ten, and zero point four is below one — each breaks its own boundary.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi yozuv standart EMAS: birinchi ko'paytuvchi o'ttiz olti, va u o'ndan katta. Shartning bu tomoni ko'pincha unutiladi, chunki o'ttiz olti oddiy son bo'lib ko'rinadi. To'g'rilash uchun vergulni bir xona chapga suring va ko'rsatkichni bittaga oshiring: uch butun olti o'ndan karra o'nning to'rtinchi darajasi. Sonning o'zi o'zgarmaydi — ikkalasi ham o'ttiz olti ming.",
      'Первая запись НЕ стандартна: первый множитель тридцать шесть, а он больше десяти. Эту сторону условия часто забывают, потому что тридцать шесть выглядит обычным числом. Чтобы исправить, сдвинь запятую на разряд влево и увеличь показатель на единицу: три целых шесть десятых умножить на десять в четвёртой. Само число не меняется — и там, и там тридцать шесть тысяч.',
      'The first record is NOT standard: the first factor is thirty-six, which exceeds ten. This side of the condition is often forgotten, because thirty-six looks like an ordinary number. To fix it, move the point one place left and raise the exponent by one: three point six times ten to the fourth. The number itself does not change — both are thirty-six thousand.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi yozuv ham standart EMAS: birinchi ko'paytuvchi nol butun to'rt o'ndan, va u birdan kichik. Standart ko'rinishda mantissa hech qachon noldan boshlanmaydi. To'g'rilash uchun vergulni bir xona o'ngga suring va ko'rsatkichni bittaga kamaytiring: to'rt karra o'nning to'rtinchi darajasi. Ikkala yozuv ham qirq ming beradi.",
      'Вторая запись тоже НЕ стандартна: первый множитель нуль целых четыре десятых, а он меньше единицы. В стандартном виде мантисса никогда не начинается с нуля. Чтобы исправить, сдвинь запятую на разряд вправо и уменьши показатель на единицу: четыре умножить на десять в четвёртой. Обе записи дают сорок тысяч.',
      'The second record is NOT standard either: the first factor is zero point four, which is below one. In standard form the mantissa never starts with a zero. To fix it, move the point one place right and lower the exponent by one: four times ten to the fourth. Both records give forty thousand.') },
  ],
  wrongText: L(
    "Birinchi ko'paytuvchini ikki tomondan tekshiring: u birdan kichik bo'lmasin va o'nga yetmasin. Vergulni surganda ko'rsatkich ham o'zgaradi.",
    'Проверяй первый множитель с двух сторон: он не меньше единицы и не достигает десяти. При сдвиге запятой показатель тоже меняется.',
    'Check the first factor from both sides: not below one and not reaching ten. When the point moves, the exponent changes too.'),
};

export default function D33_01(props) { return <TrueFalse data={DATA} {...props} />; }
