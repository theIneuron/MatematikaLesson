// Dars09 · Amaliyot 02 — Guruhlar · 🟢 · tag: whole_or_not
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §7 (9-dars, 2-pozitsiya)
//
// Darsning ikkinchi tasdig'i: ildiz HAR QANDAY nomanfiy sonda bor, lekin
// butun chiqmaydi. Sakkiz karta shu ikki guruhga bo'linadi.
// Ikki karta ataylab chalg'itadi:
//   121 — to'liq kvadratga o'xshamaydi, lekin o'n birning kvadrati;
//   50  — «besh karra o'n» degan ko'rinishi bor, kvadrat esa emas (7² = 49).
// Guruh nomi so'z: ildiz butun chiqadi / chiqmaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'whole_or_not', level: '🟢',
  zoneLbl: 96, itemSize: 18,
  zones: [
    { id: 'whole', label: L('butun', 'целый', 'whole') },
    { id: 'not', label: L('butun emas', 'не целый', 'not whole') },
  ],
  items: [
    { id: 'i1', tokens: [{ r: '36' }], zone: 'whole' },
    { id: 'i2', tokens: [{ r: '81' }], zone: 'whole' },
    { id: 'i3', tokens: [{ r: '121' }], zone: 'whole' },
    { id: 'i4', tokens: [{ r: '144' }], zone: 'whole' },
    { id: 'i5', tokens: [{ r: '10' }], zone: 'not' },
    { id: 'i6', tokens: [{ r: '30' }], zone: 'not' },
    { id: 'i7', tokens: [{ r: '50' }], zone: 'not' },
    { id: 'i8', tokens: [{ r: '200' }], zone: 'not' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz yozuvning hammasida qiymat bor, chunki ildiz osti manfiy emas. Farq faqat shunda: ba'zilarining qiymati butun son, ba'zilarining esa yo'q.",
    'У всех восьми записей значение есть, ведь подкоренное неотрицательно. Разница только в одном: у одних значение целое, у других нет.',
    'All eight records have a value, since the radicand is non-negative. The only difference is this: some values are whole numbers, some are not.'),
  ask: L('Yozuvni bosing, keyin uning guruhini bosing.', 'Нажми запись, потом её группу.', 'Tap a record, then tap its group.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. To'rtta to'liq kvadrat: oltining kvadrati o'ttiz olti, to'qqizning kvadrati sakson bir, o'n birning kvadrati bir yuz yigirma bir, o'n ikkining kvadrati bir yuz qirq to'rt. Qolgan to'rttasi ikki butun son orasida qoladi: o'n uch bilan to'rt orasida, o'ttiz besh bilan olti orasida, ellik yetti bilan sakkiz orasida, ikki yuz o'n to'rt bilan o'n besh orasida. Qiymat baribir bor, faqat butun emas.",
    'Верно. Четыре полных квадрата: квадрат шести тридцать шесть, девяти восемьдесят один, одиннадцати сто двадцать один, двенадцати сто сорок четыре. Остальные четыре лежат между двумя целыми: десять между тремя и четырьмя, тридцать между пятью и шестью, пятьдесят между семью и восемью, двести между четырнадцатью и пятнадцатью. Значение всё равно есть, просто не целое.',
    'Correct. Four perfect squares: six squared is thirty six, nine squared is eighty one, eleven squared is one hundred twenty one, twelve squared is one hundred forty four. The other four lie between two integers: ten between three and four, thirty between five and six, fifty between seven and eight, two hundred between fourteen and fifteen. The value still exists, it just is not whole.'),
  wrongs: [
    { when: (s) => s.place.i3 === 'not', text: L(
      "Bir yuz yigirma bir to'liq kvadrat: o'n bir karra o'n bir bir yuz yigirma bir. Ko'rinishi odatiy emas, lekin ko'paytirib tekshirish uni darhol ochadi.",
      'Сто двадцать один — полный квадрат: одиннадцать на одиннадцать сто двадцать один. Вид непривычный, но умножение открывает это сразу.',
      'One hundred twenty one is a perfect square: eleven times eleven is one hundred twenty one. It looks unfamiliar, but multiplying reveals it at once.') },
    { when: (s) => s.place.i7 === 'whole', text: L(
      "Ellik to'liq kvadrat emas. Yaqin kvadratlarni sanang: yetti karra yetti qirq to'qqiz, sakkiz karra sakkiz oltmish to'rt. Ellik ular orasida qoladi, demak ildizi butun emas.",
      'Пятьдесят не полный квадрат. Посчитай близкие квадраты: семь на семь сорок девять, восемь на восемь шестьдесят четыре. Пятьдесят лежит между ними, значит корень не целый.',
      'Fifty is not a perfect square. Count the nearby squares: seven times seven is forty nine, eight times eight is sixty four. Fifty lies between them, so its root is not whole.') },
    { when: (s) => s.place.i8 === 'whole' || s.place.i6 === 'whole', text: L(
      "Bu sonlarni kvadratlar bilan solishtiring: o'ttiz yigirma besh bilan o'ttiz olti orasida, ikki yuz esa bir yuz to'qson olti bilan ikki yuz yigirma besh orasida. Ikki kvadrat orasidagi son to'liq kvadrat emas.",
      'Сравни эти числа с квадратами: тридцать между двадцатью пятью и тридцатью шестью, а двести между ста девяноста шестью и двумястами двадцатью пятью. Число между двумя квадратами не полный квадрат.',
      'Compare these numbers with squares: thirty lies between twenty five and thirty six, and two hundred between one hundred ninety six and two hundred twenty five. A number between two squares is not a perfect square.') },
    { when: (s) => s.place.i1 === 'not' || s.place.i2 === 'not' || s.place.i4 === 'not', text: L(
      "Bu sonlar to'liq kvadrat: oltini, to'qqizni yoki o'n ikkini o'ziga ko'paytirib ko'ring. Ildizi butun chiqadi.",
      'Эти числа полные квадраты: умножь шесть, девять или двенадцать на себя. Корень выйдет целым.',
      'These numbers are perfect squares: multiply six, nine or twelve by itself. The root comes out whole.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har yozuvda bitta ish qiling: ildiz ostidagi songa yetadigan butun kvadrat izlang. Topilsa — birinchi guruh, topilmasa — ikkinchisi.",
      'С каждой записью делай одно: ищи целый квадрат, равный подкоренному. Нашёлся — первая группа, нет — вторая.',
      'Do one thing with every record: look for a whole square equal to the radicand. Found means the first group, not found means the second.') },
  ],
  wrongText: L(
    "Butun sonlarning kvadratlarini sanab chiqing: bir, to'rt, to'qqiz, o'n olti, yigirma besh, o'ttiz olti, qirq to'qqiz, oltmish to'rt. Ildiz osti shu ro'yxatda bo'lsa, ildiz butun.",
    'Перечисли квадраты целых: один, четыре, девять, шестнадцать, двадцать пять, тридцать шесть, сорок девять, шестьдесят четыре. Если подкоренное в этом списке, корень целый.',
    'List the squares of integers: one, four, nine, sixteen, twenty five, thirty six, forty nine, sixty four. If the radicand is on that list, the root is whole.'),
};

export default function D09_02(props) { return <Zones data={DATA} {...props} />; }
