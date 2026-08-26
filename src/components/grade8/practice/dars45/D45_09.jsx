// Dars45 · Amaliyot 09 — Guruhlar · 🔴 · tag: right_or_not
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §7 (45-dars, 9-pozitsiya)
//
// SAKKIZ UCHLIK, IKKI CHEGARA HOLATI: `4, 7, 8` da 65 va 64, `8, 9, 12` da
// 145 va 144 — farq bittada. Bunday kartani faqat aniq hisob ajratadi,
// «katta-kichikligiga qarab» taxmin qilish ishlamaydi.
//
// To'g'ri burchakli uchtasi tanish uchliklarning kattalashtirilgani
// (`12, 16, 20` — bu 3-4-5 ning to'rt barobari), ikkitasi esa kamroq
// uchraydi (`9, 40, 41` va `20, 21, 29`) — ya'ni yodlash bilan qutulib
// bo'lmaydi.
// Kartalarda faqat BELGI turadi, zonalar nomi esa SO'Z (skelet §0a.4).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'right_or_not', level: '🔴',
  zoneLbl: 128, zoneSize: 13, itemSize: 15,
  zones: [
    { id: 'z1', label: L("TO'G'RI BURCHAKLI", 'ПРЯМОУГОЛЬНЫЙ', 'RIGHT-ANGLED') },
    { id: 'z2', label: L('BUNDAY EMAS', 'НЕ ТАКОЙ', 'NOT SO') },
  ],
  items: [
    { id: 'i1', tokens: ['3, 4, 5'], zone: 'z1' },
    { id: 'i2', tokens: ['4, 7, 8'], zone: 'z2' },
    { id: 'i3', tokens: ['9, 40, 41'], zone: 'z1' },
    { id: 'i4', tokens: ['8, 9, 12'], zone: 'z2' },
    { id: 'i5', tokens: ['20, 21, 29'], zone: 'z1' },
    { id: 'i6', tokens: ['11, 12, 15'], zone: 'z2' },
    { id: 'i7', tokens: ['12, 16, 20'], zone: 'z1' },
    { id: 'i8', tokens: ['6, 8, 11'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz uchlik berilgan, har birida uchinchi son eng katta. Ba'zilari to'g'ri burchakli uchburchakning tomonlari bo'la oladi, ba'zilari esa yo'q.",
    'Даны восемь троек, в каждой третье число наибольшее. Некоторые могут быть сторонами прямоугольного треугольника, некоторые нет.',
    'Eight triples are given, the third number the largest in each. Some can be the sides of a right triangle, some cannot.'),
  ask: L('Kartani bosing, keyin uning guruhini bosing.', 'Нажми карточку, потом её группу.', 'Tap a card, then tap its group.'),
  bank: L('Uchliklar', 'Тройки', 'Triples'),
  correctText: L(
    "To'g'ri. To'rt uchlikda tenglik bajariladi. Uch, to'rt, besh: to'qqiz qo'shuv o'n olti yigirma besh. To'qqiz, qirq, qirq bir: sakson bir qo'shuv bir ming olti yuz bir ming olti yuz sakson bir, va qirq bir kvadrat ham shu. Yigirma, yigirma bir, yigirma to'qqiz: to'rt yuz qo'shuv to'rt yuz qirq bir sakkiz yuz qirq bir. O'n ikki, o'n olti, yigirma: bir yuz qirq to'rt qo'shuv ikki yuz ellik olti to'rt yuz — bu uch, to'rt, besh ning to'rt barobari. Qolgan to'rttasida tenglik yo'q, va ikkitasi chegaraga juda yaqin: to'rt, yetti, sakkiz da oltmish besh va oltmish to'rt; sakkiz, to'qqiz, o'n ikki da bir yuz qirq besh va bir yuz qirq to'rt. Farq bittada, lekin xulosa uchun bu kifoya: bu uchburchaklar to'g'ri burchakli emas, ularning eng katta burchagi to'qsondan bir oz katta.",
    'Верно. В четырёх тройках равенство выполняется. Три, четыре, пять: девять плюс шестнадцать — двадцать пять. Девять, сорок, сорок один: восемьдесят один плюс тысяча шестьсот — тысяча шестьсот восемьдесят один, и сорок один в квадрате столько же. Двадцать, двадцать один, двадцать девять: четыреста плюс четыреста сорок один — восемьсот сорок один. Двенадцать, шестнадцать, двадцать: сто сорок четыре плюс двести пятьдесят шесть — четыреста; это тройка три, четыре, пять, увеличенная вчетверо. В остальных четырёх равенства нет, и две совсем близко к границе: у четыре, семь, восемь — шестьдесят пять и шестьдесят четыре; у восемь, девять, двенадцать — сто сорок пять и сто сорок четыре. Разница в единицу, но для вывода этого достаточно: эти треугольники не прямоугольные, их наибольший угол чуть больше девяноста.',
    'Correct. The equality holds in four triples. Three, four, five: nine plus sixteen is twenty five. Nine, forty, forty one: eighty one plus one thousand six hundred is one thousand six hundred eighty one, and forty one squared is the same. Twenty, twenty one, twenty nine: four hundred plus four hundred forty one is eight hundred forty one. Twelve, sixteen, twenty: one hundred forty four plus two hundred fifty six is four hundred — that is three, four, five scaled four times. In the other four there is no equality, and two sit very close to the line: for four, seven, eight it is sixty five against sixty four; for eight, nine, twelve, one hundred forty five against one hundred forty four. A gap of one, but that is enough for the conclusion: those triangles are not right-angled, and their largest angle is a little over ninety.'),
  wrongs: [
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1', text: L(
      "Bu ikki uchlik chegaraga juda yaqin, lekin tenglik BAJARILMAYDI. To'rt, yetti, sakkiz: o'n olti qo'shuv qirq to'qqiz oltmish besh, sakkiz kvadrat esa oltmish to'rt. Sakkiz, to'qqiz, o'n ikki: oltmish to'rt qo'shuv sakson bir bir yuz qirq besh, o'n ikki kvadrat esa bir yuz qirq to'rt. Yig'indi kvadratdan KATTA bo'lsa, eng katta burchak to'qsondan katta, ya'ni uchburchak o'tmas burchakli.",
      'Эти две тройки совсем близко к границе, но равенство НЕ выполняется. Четыре, семь, восемь: шестнадцать плюс сорок девять — шестьдесят пять, а восемь в квадрате шестьдесят четыре. Восемь, девять, двенадцать: шестьдесят четыре плюс восемьдесят один — сто сорок пять, а двенадцать в квадрате сто сорок четыре. Если сумма БОЛЬШЕ квадрата, наибольший угол больше девяноста, то есть треугольник тупоугольный.',
      'These two triples sit very close to the line, but the equality does NOT hold. Four, seven, eight: sixteen plus forty nine is sixty five while eight squared is sixty four. Eight, nine, twelve: sixty four plus eighty one is one hundred forty five while twelve squared is one hundred forty four. When the sum EXCEEDS the square, the largest angle is over ninety, so the triangle is obtuse.') },
    { when: (s) => s.place.i3 === 'z2' || s.place.i5 === 'z2', text: L(
      "Bu ikki uchlik kamroq uchraydi, lekin tenglik ularda bajariladi. To'qqiz, qirq, qirq bir: sakson bir qo'shuv bir ming olti yuz bir ming olti yuz sakson bir, ildizi qirq bir. Yigirma, yigirma bir, yigirma to'qqiz: to'rt yuz qo'shuv to'rt yuz qirq bir sakkiz yuz qirq bir, ildizi yigirma to'qqiz. Uchlikning tanishligi hech narsani hal qilmaydi — faqat hisob hal qiladi.",
      'Эти две тройки встречаются реже, но равенство в них выполняется. Девять, сорок, сорок один: восемьдесят один плюс тысяча шестьсот — тысяча шестьсот восемьдесят один, корень сорок один. Двадцать, двадцать один, двадцать девять: четыреста плюс четыреста сорок один — восемьсот сорок один, корень двадцать девять. Узнаваемость тройки ничего не решает — решает только счёт.',
      'These two triples turn up less often, but the equality holds in them. Nine, forty, forty one: eighty one plus one thousand six hundred is one thousand six hundred eighty one, the root is forty one. Twenty, twenty one, twenty nine: four hundred plus four hundred forty one is eight hundred forty one, the root is twenty nine. How familiar a triple looks decides nothing — only the arithmetic does.') },
    { when: (s) => s.place.i6 === 'z1' || s.place.i8 === 'z1', text: L(
      "Bu uchliklarda farq katta. O'n bir, o'n ikki, o'n besh: bir yuz yigirma bir qo'shuv bir yuz qirq to'rt ikki yuz oltmish besh, o'n besh kvadrat esa ikki yuz yigirma besh. Olti, sakkiz, o'n bir: o'ttiz olti qo'shuv oltmish to'rt yuz, o'n bir kvadrat esa bir yuz yigirma bir. Ikkinchisi diqqatga sazovor: olti va sakkiz tanish katetlar, lekin gipotenuza o'n bo'lishi kerak, o'n bir emas.",
      'В этих тройках разница большая. Одиннадцать, двенадцать, пятнадцать: сто двадцать один плюс сто сорок четыре — двести шестьдесят пять, а пятнадцать в квадрате двести двадцать пять. Шесть, восемь, одиннадцать: тридцать шесть плюс шестьдесят четыре — сто, а одиннадцать в квадрате сто двадцать один. Второе примечательно: шесть и восемь — знакомые катеты, но гипотенуза должна быть десять, а не одиннадцать.',
      'The gaps in these triples are large. Eleven, twelve, fifteen: one hundred twenty one plus one hundred forty four is two hundred sixty five while fifteen squared is two hundred twenty five. Six, eight, eleven: thirty six plus sixty four is one hundred while eleven squared is one hundred twenty one. The second is worth noting: six and eight are the familiar legs, but the hypotenuse must be ten, not eleven.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har kartada uch qadam: ikki kichik sonning kvadratlarini qo'shish, eng kattasining kvadratini chiqarish, ikkisini solishtirish. Uchliklarning tanishligi yoki sonlarning kattaligi javob bermaydi.",
      'В каждой карточке три шага: сложить квадраты двух меньших, возвести в квадрат наибольшее, сравнить. Ни узнаваемость тройки, ни величина чисел ответа не дают.',
      'Three steps in every card: add the squares of the two smaller numbers, square the largest, compare. Neither familiarity nor the size of the numbers gives the answer.') },
  ],
  wrongText: L(
    "Har uchlikni hisoblab tekshiring. Farq bittada bo'lsa ham, uchburchak to'g'ri burchakli emas.",
    'Проверяй каждую тройку счётом. Даже при разнице в единицу треугольник не прямоугольный.',
    'Check every triple by computing. Even a gap of one means the triangle is not right-angled.'),
};

export default function D45_09(props) { return <Zones data={DATA} {...props} />; }
