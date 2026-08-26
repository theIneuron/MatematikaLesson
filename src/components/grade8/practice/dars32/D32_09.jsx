// Dars32 · Amaliyot 09 — Guruhlar · 🔴 · tag: equals_a6_or_not
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §4 (32-dars, 9-pozitsiya)
//
// TO'RT JUFTLIK, HAR BIRIDA BITTA BELGI FARQ QILADI:
//   a²·a⁴  (6)  va  a²·a³  (5)   — ko'rsatkich
//   a⁸:a²  (6)  va  a⁸:a⁻²  (10) — maxrajdagi ISHORA
//   (a³)²  (6)  va  (a³)³   (9)  — tashqi ko'rsatkich
//   a⁸·a⁻² (6)  va  a⁸·a²   (10) — ko'paytuvchidagi ISHORA
//
// Ikkinchi juftlik eng sezilmasi: `a⁸:a⁻²` da ayirish qo'shishga aylanadi
// va o'n chiqadi. Uni `a⁸·a⁻²` bilan yonma-yon qo'yish ataylab — bittasida
// javob olti, ikkinchisida o'n, va yozuvlar deyarli bir xil.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'equals_a6_or_not', level: '🔴',
  zoneSize: 13, itemSize: 16, zoneLbl: 116,
  given: [['a⁶']],
  givenLabel: L('Solishtiriladigan daraja', 'Сравниваемая степень', 'The power compared'),
  zones: [
    { id: 'z1', label: L('a⁶ GA TENG', 'РАВНО a⁶', 'EQUALS a⁶') },
    { id: 'z2', label: L('TENG EMAS', 'НЕ РАВНО', 'NOT EQUAL') },
  ],
  items: [
    { id: 'i1', tokens: ['a² · a⁴'], zone: 'z1' },
    { id: 'i2', tokens: ['a² · a³'], zone: 'z2' },
    { id: 'i3', tokens: ['a⁸ : a²'], zone: 'z1' },
    { id: 'i4', tokens: ['a⁸ : a⁻²'], zone: 'z2' },
    { id: 'i5', tokens: ['(a³)²'], zone: 'z1' },
    { id: 'i6', tokens: ['(a³)³'], zone: 'z2' },
    { id: 'i7', tokens: ['a⁸ · a⁻²'], zone: 'z1' },
    { id: 'i8', tokens: ['a⁸ · a²'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz ifoda, va hammasi bitta daraja bilan solishtiriladi. Kartalar juft-juft turibdi: har juftlikda faqat BITTA belgi o'zgargan — ishora, ko'rsatkich yoki amal.",
    'Восемь выражений, и все сравниваются с одной степенью. Карточки стоят парами: в каждой паре изменён только ОДИН знак — знак числа, показатель или действие.',
    'Eight expressions, all compared with one power. The cards come in pairs: within each pair only ONE mark has changed — a sign, an exponent or an operation.'),
  ask: L('Ifodani bosing, keyin guruhini bosing.', 'Нажми выражение, потом его группу.', 'Tap an expression, then its group.'),
  bank: L('Ifodalar', 'Выражения', 'Expressions'),
  correctText: L(
    "To'g'ri. Oltini beradiganlar: ikki qo'shuv to'rt; sakkiz minus ikki; uch karra ikki; sakkiz qo'shuv minus ikki. Bermaydiganlar: ikki qo'shuv uch besh; sakkiz minus minus ikki o'n; uch karra uch to'qqiz; sakkiz qo'shuv ikki o'n. Eng sezilmas juftlik — sakkizni ikkiga bo'lish va sakkizni minus ikkinchi darajaga ko'paytirish: birinchisida sakkiz minus ikki, ikkinchisida sakkiz qo'shuv minus ikki, va ikkalasi ham olti beradi. Lekin sakkizni minus ikkinchi darajaga BO'LSANGIZ o'n chiqadi, chunki manfiy sonni ayirish uni qo'shishga aylantiradi.",
    'Верно. Шестёрку дают: два плюс четыре; восемь минус два; трижды два; восемь плюс минус два. Не дают: два плюс три пять; восемь минус минус два десять; трижды три девять; восемь плюс два десять. Самая незаметная пара — деление на a в квадрате и умножение на a в минус второй: в первом восемь минус два, во втором восемь плюс минус два, и оба дают шесть. А вот ДЕЛЕНИЕ на a в минус второй даёт десять, потому что вычитание отрицательного превращается в сложение.',
    'Correct. Those giving six: two plus four; eight minus two; three times two; eight plus minus two. Those not: two plus three is five; eight minus minus two is ten; three times three is nine; eight plus two is ten. The subtlest pair is dividing by a squared and multiplying by a to the minus two: the first is eight minus two, the second eight plus minus two, and both give six. But DIVIDING by a to the minus two gives ten, because subtracting a negative turns into adding.'),
  wrongs: [
    { when: (s) => s.place.i4 === 'z1', text: L(
      "Bu yerda maxrajdagi ko'rsatkich MANFIY: sakkiz minus minus ikki. Manfiy sonni ayirish uni qo'shishga aylantiradi, ya'ni sakkiz qo'shuv ikki — o'n. Qo'shni kartaga qarang: u yerda ham sakkiz, ham minus ikki turibdi, lekin amal ko'paytirish, va u olti beradi. Bo'lish bilan ko'paytirishning farqi aynan shu ikki kartada ko'rinadi.",
      'Здесь показатель в знаменателе ОТРИЦАТЕЛЬНЫЙ: восемь минус минус два. Вычитание отрицательного превращается в сложение, то есть восемь плюс два — десять. Посмотри на соседнюю карточку: там тоже восемь и минус два, но действие умножение, и оно даёт шесть. Различие деления и умножения видно именно на этих двух карточках.',
      'Here the denominator exponent is NEGATIVE: eight minus minus two. Subtracting a negative turns into adding, that is eight plus two — ten. Look at the neighbouring card: it also has eight and minus two, but the operation is multiplication and it gives six. The difference between dividing and multiplying shows precisely in these two cards.') },
    { when: (s) => s.place.i7 === 'z2', text: L(
      "Bu ifoda olti beradi. Ko'paytirishda ko'rsatkichlar qo'shiladi, manfiy ko'rsatkich bo'lsa ham: sakkiz qo'shuv minus ikki olti. Manfiy ko'rsatkich bilan ko'paytirish aslida bo'lishga teng — sakkizni a kvadratga bo'lish bilan bir xil natija. Shuning uchun bu karta bo'lish kartasi bilan bir zonada turadi.",
      'Это выражение даёт шесть. При умножении показатели складываются, даже отрицательный: восемь плюс минус два шесть. Умножение на отрицательную степень по сути равно делению — тот же результат, что и деление на a в квадрате. Поэтому эта карточка стоит в одной зоне с карточкой деления.',
      'This expression gives six. Multiplication adds the exponents, a negative one included: eight plus minus two is six. Multiplying by a negative power is really the same as dividing — the same result as dividing by a squared. That is why this card sits in the same zone as the division card.') },
    { when: (s) => s.place.i6 === 'z1' || s.place.i5 === 'z2', text: L(
      "Qavsli ikki kartani solishtiring: birinchisida tashqi ko'rsatkich ikki, ikkinchisida uch. Ko'rsatkichlar ko'paytiriladi, ya'ni uch karra ikki olti va uch karra uch to'qqiz. Faqat birinchisi oltini beradi. Qavs ichidagi ko'rsatkich ikkalasida ham bir xil, ya'ni javobni tashqi ko'rsatkich hal qiladi.",
      'Сравни две карточки со скобкой: в первой внешний показатель два, во второй три. Показатели перемножаются, значит трижды два шесть и трижды три девять. Шестёрку даёт только первая. Показатель внутри скобки в обеих одинаков, значит ответ решает внешний.',
      'Compare the two bracketed cards: the outer exponent is two in the first and three in the second. The exponents multiply, so three times two is six and three times three is nine. Only the first gives six. The exponent inside the bracket is the same in both, so the outer one decides.') },
    { when: (s) => s.place.i2 === 'z1' || s.place.i8 === 'z1', text: L(
      "Bu ifodalarda ko'paytirish turibdi, ya'ni ko'rsatkichlar qo'shiladi. Ikki qo'shuv uch besh, sakkiz qo'shuv ikki o'n — ikkalasi ham oltidan boshqa. Ko'paytirish natijani doim KATTALASHTIRADI, ya'ni sakkizinchi darajadan boshlangan ifoda oltiga tushib qololmaydi, agar ikkinchi ko'rsatkich musbat bo'lsa.",
      'В этих выражениях умножение, значит показатели складываются. Два плюс три пять, восемь плюс два десять — оба отличны от шести. Умножение результат всегда УВЕЛИЧИВАЕТ, значит выражение, начавшееся с восьмой степени, не может опуститься до шестой, если второй показатель положителен.',
      'These expressions are multiplications, so the exponents add. Two plus three is five, eight plus two is ten — both differ from six. Multiplication always makes the result LARGER, so an expression starting from the eighth power cannot drop to the sixth while the second exponent is positive.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har kartada ikki narsani ajrating: AMAL qaysi va ko'rsatkichlarning ISHORASI qanday. Amal qoidani beradi — qo'shish, ayirish yoki ko'paytirish, — ishora esa hisobning natijasini. Ikkalasini birga qo'llash kerak.",
      'На каждой карточке раздели два вопроса: какое ДЕЙСТВИЕ и каковы ЗНАКИ показателей. Действие даёт правило — сложить, вычесть или перемножить, — а знаки дают результат счёта. Применять надо оба сразу.',
      'Separate two things on every card: which OPERATION it is and what the SIGNS of the exponents are. The operation gives the rule — add, subtract or multiply — and the signs give the outcome. Both must be applied together.') },
  ],
  wrongText: L(
    "Amalni aniqlang, keyin ishoraga qarang. Manfiy ko'rsatkichga ko'paytirish bo'lishga teng, manfiy ko'rsatkichga bo'lish esa ko'paytirishga teng.",
    'Определи действие, потом смотри на знак. Умножение на отрицательную степень равно делению, а деление на отрицательную степень равно умножению.',
    'Identify the operation, then look at the sign. Multiplying by a negative power equals dividing, and dividing by a negative power equals multiplying.'),
};

export default function D32_09(props) { return <Zones data={DATA} {...props} />; }
