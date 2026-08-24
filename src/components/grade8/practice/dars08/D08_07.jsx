// Dars08 · Amaliyot 07 — Guruhlar · 🟡 · tag: modulus_or_not
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §6 (8-dars, 7-pozitsiya)
//
// Darsning uchinchi tasdig'i: JUFT darajali ildiz ostidagi juft daraja
// MODULni beradi, TOQ darajalisi esa ifodaning o'zini. Sakkiz karta shu
// ikki guruhga bo'linadi, va farq faqat DARAJANING JUFTLIGIDA — a ning
// ishorasi noma'lum, shuning uchun taxmin ishlamaydi.
// Qavsli ikki karta (a qo'shuv ikki va a minus besh) shuni ko'rsatadi:
// qoida sonlarga emas, IFODAGA tegishli.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'modulus_or_not', level: '🟡',
  zoneLbl: 92, itemSize: 17,
  zones: [
    { id: 'mod', label: L('modul', 'модуль', 'modulus') },
    { id: 'self', label: L("ifodaning o'zi", 'само выражение', 'expression itself') },
  ],
  items: [
    { id: 'i1', tokens: [{ r: 'a²' }], zone: 'mod' },
    { id: 'i2', tokens: [{ r: 'a⁴', deg: '4' }], zone: 'mod' },
    { id: 'i3', tokens: [{ r: 'a⁶', deg: '6' }], zone: 'mod' },
    { id: 'i4', tokens: [{ r: '(a + 2)⁴', deg: '4' }], zone: 'mod' },
    { id: 'i5', tokens: [{ r: 'a³', deg: '3' }], zone: 'self' },
    { id: 'i6', tokens: [{ r: 'a⁵', deg: '5' }], zone: 'self' },
    { id: 'i7', tokens: [{ r: 'a⁷', deg: '7' }], zone: 'self' },
    { id: 'i8', tokens: [{ r: '(a − 5)³', deg: '3' }], zone: 'self' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz yozuvda ildizning darajasi ildiz ostidagi daraja bilan bir xil. Natija ba'zilarida modul bo'ladi, ba'zilarida ifodaning o'zi.",
    'В восьми записях степень корня совпадает со степенью под корнем. В одних результат модуль, в других само выражение.',
    'In eight records the degree of the root matches the power under it. In some the result is a modulus, in others the expression itself.'),
  ask: L('Yozuvni bosing, keyin uning guruhini bosing.', 'Нажми запись, потом её группу.', 'Tap a record, then tap its group.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Hammasini daraja hal qiladi. Daraja JUFT bo'lsa, ildiz ostidagi son har doim nomanfiy bo'ladi, va ildiz ham nomanfiy chiqishi kerak — shuning uchun natija modul. a ni minus uchga teng qo'ying: kvadrati to'qqiz, ildizi uch, ya'ni minus uch emas. Daraja TOQ bo'lsa, ildiz osti manfiy ham bo'lishi mumkin: minus uchning kubi minus yigirma yetti, uning kub ildizi esa minus uch — sonning o'zi.",
    'Верно. Всё решает степень. Если степень ЧЁТНАЯ, подкоренное всегда неотрицательно, и корень тоже обязан быть неотрицательным — поэтому результат модуль. Подставь a равное минус трём: квадрат девять, корень три, а не минус три. Если степень НЕЧЁТНАЯ, подкоренное может быть и отрицательным: куб минус трёх минус двадцать семь, а его кубический корень минус три — само число.',
    'Correct. Everything is decided by the degree. If the degree is EVEN the radicand is always non-negative, and the root must be non-negative too, so the result is a modulus. Put a equal to minus three: its square is nine, the root is three, not minus three. If the degree is ODD the radicand may be negative: the cube of minus three is minus twenty seven and its cube root is minus three — the number itself.'),
  wrongs: [
    { when: (s) => s.place.i4 === 'self', text: L(
      "Qavs qoidani o'zgartirmaydi: bu yerda ham daraja to'rt, ya'ni juft. a ni minus besh deb oling: a qo'shuv ikki minus uchga teng, uning to'rtinchi darajasi sakson bir, sakson birdan to'rtinchi darajali ildiz esa uch. Minus uch chiqmadi, demak natija modul.",
      'Скобка правила не меняет: степень здесь тоже четвёртая, то есть чётная. Возьми a равным минус пяти: a плюс два равно минус трём, четвёртая степень восемьдесят один, а корень четвёртой степени из восьмидесяти одного три. Минус три не вышло — значит результат модуль.',
      'The bracket changes nothing: the degree here is four as well, that is even. Take a equal to minus five: a plus two is minus three, its fourth power is eighty one, and the fourth root of eighty one is three. Minus three did not come out, so the result is a modulus.') },
    { when: (s) => s.place.i8 === 'mod', text: L(
      "Bu yerda daraja uch, ya'ni TOQ. Toq darajali ildiz manfiy sondan ham olinadi, shuning uchun modul kerak emas. a ni to'rtga teng qo'ying: a minus besh minus bir, uning kubi minus bir, kub ildizi ham minus bir — ifodaning o'zi.",
      'Здесь степень три, то есть НЕЧЁТНАЯ. Корень нечётной степени берётся и из отрицательного, поэтому модуль не нужен. Возьми a равным четырём: a минус пять минус один, куб минус один, кубический корень тоже минус один — само выражение.',
      'Here the degree is three, that is ODD. An odd root can be taken of a negative number, so no modulus is needed. Take a equal to four: a minus five is minus one, its cube is minus one, and the cube root is minus one — the expression itself.') },
    { when: (s) => s.place.i3 === 'self' || s.place.i2 === 'self', text: L(
      "Ildizning darajasini sanang: to'rt va olti — juft sonlar. Juft darajali ildiz manfiy javob bermaydi, a esa manfiy bo'lishi mumkin. Aynan shu joyda modul paydo bo'ladi.",
      'Посчитай степень корня: четыре и шесть — чётные. Корень чётной степени отрицательного ответа не даёт, а a может быть отрицательным. Именно здесь и появляется модуль.',
      'Count the degree of the root: four and six are even. An even root never gives a negative answer, while a may be negative. That is exactly where the modulus appears.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har yozuvda bitta ish qiling: darajani sanang. Juft bo'lsa modul, toq bo'lsa ifodaning o'zi. Ishonchsiz bo'lsangiz a ni minus ikkiga teng qo'yib hisoblang.",
      'С каждой записью делай одно: посчитай степень. Чётная — модуль, нечётная — само выражение. Если не уверен, подставь a равное минус двум и посчитай.',
      'Do one thing with every record: count the degree. Even means a modulus, odd means the expression itself. If unsure, put a equal to minus two and compute.') },
  ],
  wrongText: L(
    "Darajaning juftligiga qarang. a ni minus ikkiga teng qo'yib tekshirsangiz farq darhol ko'rinadi.",
    'Смотри на чётность степени. Подставь a равное минус двум — разница видна сразу.',
    'Look at whether the degree is even. Put a equal to minus two and the difference shows at once.'),
};

export default function D08_07(props) { return <Zones data={DATA} {...props} />; }
