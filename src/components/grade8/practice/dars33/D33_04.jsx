// Dars33 · Amaliyot 04 — Belgilash · 🟡 · tag: negative_exponent_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §5 (33-dars, 4-pozitsiya)
//
// UCH JUFTLIK, HAR BIRIDA O'SHA RAQAMLAR, FARQ FAQAT VERGULNING O'RNIDA:
//   0,004 va 4000 ; 0,00071 va 71 ; 0,09 va 9,2
// Uchinchi juftlik chegara holati: to'qqiz butun ikki o'ndan ning
// ko'rsatkichi NOL, ya'ni na musbat, na manfiy. Bu ataylab — «manfiy emas»
// degani «musbat» degani emas.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'negative_exponent_marked', level: '🟡',
  col: 112, itemSize: 17,
  items: [
    { id: 'i1', tokens: ['0,004'], hit: true },
    { id: 'i2', tokens: ['4000'] },
    { id: 'i3', tokens: ['0,00071'], hit: true },
    { id: 'i4', tokens: ['71'] },
    { id: 'i5', tokens: ['0,09'], hit: true },
    { id: 'i6', tokens: ['9,2'] },
  ],
  eyebrow: L('Belgilash', 'Отметь', 'Mark'),
  setup: L(
    "Olti son. Har birini standart ko'rinishda yozsak, o'nning ko'rsatkichi paydo bo'ladi. Uchtasida u manfiy chiqadi, uchtasida esa yo'q.",
    'Шесть чисел. Если каждое записать в стандартном виде, появится показатель степени десяти. У трёх он отрицателен, у трёх нет.',
    'Six numbers. Writing each in standard form brings out an exponent of ten. For three of them it is negative, for three it is not.'),
  ask: L(
    "Standart yozuvida ko'rsatkich MANFIY bo'ladigan 3 ta sonni belgilang.",
    'Отметь 3 числа, у которых в стандартной записи показатель ОТРИЦАТЕЛЕН.',
    'Mark the 3 numbers whose standard record has a NEGATIVE exponent.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Ko'rsatkich sonning KATTALIGIGA qaraydi: son birdan kichik bo'lsa ko'rsatkich manfiy, birdan katta bo'lsa musbat. Nol butun nol nol to'rt mingdan to'rt karra o'nning minus uchinchi darajasi; nol butun nol nol nol yetti bir yuz mingdan yetti butun bir o'ndan karra o'nning minus to'rtinchi darajasi; nol butun to'qqiz yuzdan to'qqiz karra o'nning minus ikkinchi darajasi. Rad etilganlar orasida to'qqiz butun ikki o'ndan alohida turadi: u birdan katta, lekin o'ndan kichik, ya'ni uning mantissasi o'zi va ko'rsatkich NOL. Nol na musbat, na manfiy — «manfiy emas» degani «musbat» degani emas.",
    'Верно. Показатель смотрит на ВЕЛИЧИНУ числа: меньше единицы — показатель отрицателен, больше — положителен. Нуль целых четыре тысячных это четыре на десять в минус третьей; нуль целых девять сотых это девять на десять в минус второй. Среди отвергнутых особняком стоит девять целых две десятых: оно больше единицы, но меньше десяти, значит мантисса это оно само, а показатель НУЛЬ. Нуль не положителен и не отрицателен.',
    'Correct. The exponent looks at the SIZE of the number: below one it is negative, above one it is positive. Zero point zero zero four is four times ten to the minus three; zero point zero zero zero seven one is seven point one times ten to the minus four; zero point zero nine is nine times ten to the minus two. Among the rejected ones nine point two stands apart: it is above one but below ten, so the mantissa is the number itself and the exponent is ZERO. Zero is neither positive nor negative — «not negative» does not mean «positive».'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "To'qqiz butun ikki o'ndan ning ko'rsatkichi manfiy EMAS, u NOL. Bu son birdan katta, ya'ni uni kichraytirish shart emas; u o'ndan ham kichik, ya'ni kattalashtirish ham shart emas. Mantissaning o'zi allaqachon oraliqda turibdi, va standart yozuv to'qqiz butun ikki o'ndan karra o'nning nolinchi darajasi bo'ladi. Vergul umuman surilmaydi, shuning uchun sanaladigan xona ham yo'q.",
      'У девяти целых двух десятых показатель НЕ отрицательный, он НУЛЕВОЙ. Это число больше единицы, значит уменьшать не надо; оно меньше десяти, значит и увеличивать не надо. Мантисса уже в промежутке, и стандартная запись это девять целых две десятых на десять в нулевой. Запятая не сдвигается вовсе, поэтому и считать нечего.',
      'The exponent of nine point two is NOT negative, it is ZERO. This number is above one, so nothing needs shrinking; it is below ten, so nothing needs growing. The mantissa is already in range, and the standard record is nine point two times ten to the zero. The point does not move at all, so there is nothing to count.') },
    { when: (s) => s.extra.indexOf('i2') !== -1 || s.extra.indexOf('i4') !== -1, text: L(
      "Bu son birdan KATTA, ya'ni uning ko'rsatkichi musbat. To'rt ming — to'rt karra o'nning kubi; yetmish bir — yetti butun bir o'ndan karra o'n. Qo'shni kartaga qarang: u yerda o'sha raqamlar turibdi, lekin vergul boshqa joyda, va aynan vergulning o'rni ishorani hal qiladi.",
      'Это число БОЛЬШЕ единицы, значит его показатель положителен. Четыре тысячи это четыре на десять в кубе; семьдесят один это семь целых одна десятая на десять. Посмотри на соседнюю карточку: там те же цифры, но запятая в другом месте, и именно её место решает знак.',
      'This number is ABOVE one, so its exponent is positive. Four thousand is four times ten cubed; seventy-one is seven point one times ten. Look at the neighbouring card: the same digits there, but the point sits elsewhere, and it is the place of the point that decides the sign.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "Nol butun to'qqiz yuzdan chetlab o'tildi, lekin u ham birdan kichik. Vergulni to'qqizdan keyin qo'yish uchun uni ikki xona O'NGGA surish kerak, va o'ngga surish ko'rsatkichni MANFIY qiladi: to'qqiz karra o'nning minus ikkinchi darajasi. Son kichik ko'rinmasligi mumkin, lekin u birdan kichik, va qoida shunga qaraydi.",
      'Нуль целых девять сотых остались в стороне, а это число тоже меньше единицы. Чтобы поставить запятую после девятки, её надо сдвинуть на два разряда ВПРАВО, а сдвиг вправо делает показатель ОТРИЦАТЕЛЬНЫМ: девять на десять в минус второй. Число может не выглядеть маленьким, но оно меньше единицы, и правило смотрит именно на это.',
      'Zero point zero nine was left out, yet it too is below one. To place the point after the nine it must move two places RIGHT, and moving right makes the exponent NEGATIVE: nine times ten to the minus two. The number may not look small, but it is below one, and that is what the rule looks at.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta son kerak. Har biriga bitta savol bering: son birdan kichikmi. Kichik bo'lsa ko'rsatkich manfiy, katta bo'lsa musbat, birdan o'ngacha bo'lsa esa nol.",
      'Нужно ровно три числа. К каждому задай один вопрос: меньше ли оно единицы. Меньше — показатель отрицателен, больше — положителен, а от одного до десяти — нуль.',
      'Exactly three numbers are needed. Ask one question of each: is it below one. Below — the exponent is negative; above — positive; between one and ten — zero.') },
  ],
  wrongText: L(
    "Sonni bir bilan solishtiring: birdan kichik bo'lsa ko'rsatkich manfiy. Birdan o'ngacha bo'lgan sonda esa ko'rsatkich nol, manfiy emas.",
    'Сравни число с единицей: меньше единицы — показатель отрицателен. А у числа от одного до десяти показатель нулевой, а не отрицательный.',
    'Compare the number with one: below one means a negative exponent. And a number from one to ten has a zero exponent, not a negative one.'),
};

export default function D33_04(props) { return <MarkAll data={DATA} {...props} />; }
