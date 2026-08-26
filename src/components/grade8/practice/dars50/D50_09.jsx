// Dars50 · Amaliyot 09 — Kod · 🔴 · tag: code_chords
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §12 (50-dars, 9-pozitsiya)
//
// KESUVCHI VATARINING UZUNLIGI: AB = 2·ildiz(R² − d²). Uch kesuvchi:
//   R=10, d=8  -> 2·6  = 12
//   R=17, d=15 -> 2·8  = 16
//   R=25, d=7  -> 2·24 = 48
// FORMULADA IKKI AMAL BOR: ildiz va IKKILANTIRISH. Bankdagi tuzoqlar:
// 6 (yarim vatar, ikkilantirish unutilgan — 49-darsning З104 si), 24 (yana
// yarim vatar), 32 (ikkilantirish ikki marta bajarilgan).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_chords', level: '🔴',
  expr: ['R = 10, d = 8', '   ', 'R = 17, d = 15', '   ', 'R = 25, d = 7'], exprSize: 14,
  cards: ['6', '12', '16', '24', '32', '48'],
  answer: ['12', '16', '48'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali: u uch vatarning uzunligidan yig'iladi. Uch holatda ham masofa radiusdan kichik, ya'ni chiziq kesuvchi, va markazdan tushirilgan perpendikulyar vatarni teng ikkiga bo'ladi.",
    'В комнате сейф, код трёхзначный: его составляют длины трёх хорд. Во всех трёх случаях расстояние меньше радиуса, значит прямая секущая, а перпендикуляр из центра делит хорду пополам.',
    'There is a safe in the room, its code three digits: it is made of the lengths of the three chords. In all three cases the distance is less than the radius, so the line is a secant, and the perpendicular from the centre halves the chord.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch vatarning uzunligini toping va kodga o'sish tartibida yozing.",
    'Найди длины трёх хорд и запиши их в код по возрастанию.',
    'Find the lengths of the three chords and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Har holatda ikki qadam. Birinchisi: yuz minus oltmish to'rt o'ttiz olti, ildizi olti — bu YARIM vatar, to'liq vatar o'n ikki. Ikkinchisi: ikki yuz sakson to'qqiz minus ikki yuz yigirma besh oltmish to'rt, ildizi sakkiz, vatar o'n olti. Uchinchisi: olti yuz yigirma besh minus qirq to'qqiz besh yuz yetmish olti, ildizi yigirma to'rt, vatar qirq sakkiz. O'sish tartibida: o'n ikki, o'n olti, qirq sakkiz. Formulada ikkilantirish tasodifiy emas: perpendikulyar vatarni teng ikkiga bo'ladi, ya'ni ildiz faqat bir yarmini beradi.",
    'Верно. В каждом случае два шага. Первый: сто минус шестьдесят четыре — тридцать шесть, корень шесть, это ПОЛОВИНА хорды, вся хорда двенадцать. Второй: двести восемьдесят девять минус двести двадцать пять — шестьдесят четыре, корень восемь, хорда шестнадцать. Третий: шестьсот двадцать пять минус сорок девять — пятьсот семьдесят шесть, корень двадцать четыре, хорда сорок восемь. По возрастанию: двенадцать, шестнадцать, сорок восемь. Удвоение в формуле не случайно: перпендикуляр делит хорду пополам, значит корень даёт лишь одну половину.',
    'Correct. Two steps in every case. First: one hundred minus sixty four is thirty six, the root six, which is HALF the chord, so the whole chord is twelve. Second: two hundred eighty nine minus two hundred twenty five is sixty four, the root eight, the chord sixteen. Third: six hundred twenty five minus forty nine is five hundred seventy six, the root twenty four, the chord forty eight. In increasing order: twelve, sixteen, forty eight. The doubling in the formula is no accident: the perpendicular halves the chord, so the root gives only one half.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('6') !== -1 || s.slots.indexOf('24') !== -1, text: L(
      "Bu sonlar YARIM vatar: ildizdan chiqqan natija. Markazdan tushirilgan perpendikulyar vatarni teng ikkiga bo'ladi, ya'ni to'g'ri burchakli uchburchakning kateti faqat bir yarmi. To'liq vatar uchun natijani ikkilantirish kerak: olti ikkilanib o'n ikki, yigirma to'rt ikkilanib qirq sakkiz.",
      'Эти числа — ПОЛОВИНА хорды, результат из-под корня. Перпендикуляр из центра делит хорду пополам, значит катетом прямоугольного треугольника оказывается лишь одна половина. Для всей хорды результат надо удвоить: шесть удваивается в двенадцать, двадцать четыре в сорок восемь.',
      'These numbers are HALF the chord, the result from under the root. The perpendicular from the centre halves the chord, so the leg of the right triangle is only one half. For the whole chord the result must be doubled: six becomes twelve, twenty four becomes forty eight.') },
    { when: (s) => s.slots.indexOf('32') !== -1, text: L(
      "O'ttiz ikki — ikkinchi holatda ikkilantirish IKKI marta bajarilgan: sakkiz, keyin o'n olti, keyin o'ttiz ikki. Ikkilantirish faqat bir marta kerak, chunki vatar aynan IKKI yarimdan yig'iladi. Tekshirish oson: vatar diametrdan katta bo'lolmaydi, diametr esa o'ttiz to'rt — o'ttiz ikki unga juda yaqin, lekin masofa o'n besh bo'lgani uchun vatar ancha qisqa bo'lishi kerak.",
      'Тридцать два — во втором случае удвоение сделано ДВА раза: восемь, потом шестнадцать, потом тридцать два. Удваивать надо лишь однажды, ведь хорда складывается ровно из ДВУХ половин. Проверить легко: хорда не бывает больше диаметра, а диаметр тридцать четыре — тридцать два слишком близко к нему, тогда как при расстоянии пятнадцать хорда должна быть заметно короче.',
      'Thirty two means the doubling was done TWICE in the second case: eight, then sixteen, then thirty two. Doubling is needed once only, since the chord is made of exactly TWO halves. An easy check: a chord never exceeds the diameter, and the diameter is thirty four — thirty two sits far too close to it, while at a distance of fifteen the chord must be much shorter.') },
    { when: (s) => s.set, text: L(
      "Uch javob to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: o'n ikki, o'n olti, qirq sakkiz.",
      'Три ответа найдены верно, а порядок нарушен. Код пишется по возрастанию: двенадцать, шестнадцать, сорок восемь.',
      'The three answers are right, the order is not. The code goes in increasing order: twelve, sixteen, forty eight.') },
    { when: (s) => s.slots.indexOf('48') === -1, text: L(
      "Kodda qirq sakkiz yo'q, lekin uchinchi vatarning uzunligi aynan shu. Olti yuz yigirma besh minus qirq to'qqiz besh yuz yetmish olti, ildizi yigirma to'rt, va uni ikkilantirsak qirq sakkiz. Bu vatar diametrga yaqin (diametr ellik), chunki masofa juda kichik — yetti.",
      'В коде нет сорока восьми, а длина третьей хорды именно такая. Шестьсот двадцать пять минус сорок девять — пятьсот семьдесят шесть, корень двадцать четыре, удвоим — сорок восемь. Эта хорда близка к диаметру (диаметр пятьдесят), потому что расстояние совсем мало — семь.',
      'The code has no forty eight, yet that is the length of the third chord. Six hundred twenty five minus forty nine is five hundred seventy six, the root twenty four, doubled forty eight. That chord is close to the diameter (which is fifty), because the distance is very small — seven.') },
  ],
  wrongText: L(
    "Kvadratlarni ayirib ildiz chiqaring, keyin natijani IKKILANTIRING: vatar ikki yarimdan yig'ilgan.",
    'Вычти квадраты, извлеки корень, потом УДВОЙ результат: хорда сложена из двух половин.',
    'Subtract the squares, take the root, then DOUBLE the result: a chord is made of two halves.'),
};

export default function D50_09(props) { return <CodeLock data={DATA} {...props} />; }
