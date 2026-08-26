// Dars46 · Amaliyot 09 — Kod · 🔴 · tag: code_heron
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §8 (46-dars, 9-pozitsiya)
//
// BITTA UCHBURCHAK (20, 20, 32) UCHUN UCH SAVOL, va ular bir-biriga
// bog'langan:
//   yarim perimetr         -> 36
//   32 tomoniga balandlik  -> 12   (2S : a, ya'ni S allaqachon kerak)
//   yuza                   -> 192  (Geron: 36 · 16 · 16 · 4 = 36864, ildizi 192)
// Kod o'sish tartibida: 12, 36, 192 — ya'ni javoblarning tartibi savollarning
// tartibi bilan MOS KELMAYDI, va ikkinchi savol uchinchisining natijasini
// talab qiladi.
//
// Bankdagi tuzoqlar: 72 (perimetrning o'zi — З97), 384 (ikkilangan yuza),
// 6 (yuza tomonga bo'lingan, ikkilantirish unutilgan).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_heron', level: '🔴',
  expr: ['20,  20,  32'], exprSize: 22,
  cards: ['6', '12', '36', '72', '192', '384'],
  answer: ['12', '36', '192'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Bitta teng yonli uchburchak berilgan: tomonlari yigirma, yigirma va o'ttiz ikki. Uch savol shu uchburchak haqida: yarim perimetri, o'ttiz ikki tomoniga mos balandligi va yuzasi.",
    'В комнате сейф, код трёхзначный. Дан один равнобедренный треугольник: стороны двадцать, двадцать и тридцать два. Три вопроса об этом треугольнике: его полупериметр, высота к стороне тридцать два и площадь.',
    'There is a safe in the room and its code has three places. One isosceles triangle is given: sides twenty, twenty and thirty two. Three questions about it: its semi-perimeter, the height to the side thirty two, and its area.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch javobni toping va kodga o'sish tartibida yozing.",
    'Найди три ответа и запиши их в код по возрастанию.',
    'Find the three answers and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Yarim perimetr: yigirma qo'shuv yigirma qo'shuv o'ttiz ikki yetmish ikki, yarmi o'ttiz olti. Yuza Geron formulasi bilan: ayirmalar o'n olti, o'n olti va to'rt; o'ttiz olti karra o'n olti besh yuz yetmish olti, yana o'n oltiga ko'paytirsak to'qqiz ming ikki yuz o'n olti, to'rtga ko'paytirsak o'ttiz olti ming sakkiz yuz oltmish to'rt; ildizi bir yuz to'qson ikki. Balandlik esa yuzadan chiqadi: ikki karra bir yuz to'qson ikki uch yuz sakson to'rt, uni o'ttiz ikkiga bo'lsak o'n ikki. Diqqat qiladigan joy: ikkinchi savolga javob berish uchun uchinchi savolni AVVAL yechish kerak. Bu teng yonli uchburchakda balandlikni boshqa yo'l bilan ham topish mumkin: asosning yarmi o'n olti, yon tomoni yigirma, ya'ni Pifagor teoremasi bilan balandlik o'n ikki — ikki yo'l bir xil javob beradi.",
    'Верно. Полупериметр: двадцать плюс двадцать плюс тридцать два — семьдесят два, половина тридцать шесть. Площадь по формуле Герона: разности шестнадцать, шестнадцать и четыре; тридцать шесть на шестнадцать — пятьсот семьдесят шесть, ещё на шестнадцать — девять тысяч двести шестнадцать, на четыре — тридцать шесть тысяч восемьсот шестьдесят четыре; корень сто девяносто два. А высота выходит из площади: дважды сто девяносто два — триста восемьдесят четыре, разделить на тридцать два — двенадцать. На что стоит обратить внимание: чтобы ответить на второй вопрос, надо СНАЧАЛА решить третий. В этом равнобедренном треугольнике высоту можно найти и иначе: половина основания шестнадцать, боковая сторона двадцать, значит по теореме Пифагора высота двенадцать — два пути дают один ответ.',
    'Correct. The semi-perimeter: twenty plus twenty plus thirty two is seventy two, half is thirty six. The area by Heron formula: the differences are sixteen, sixteen and four; thirty six times sixteen is five hundred seventy six, times sixteen again is nine thousand two hundred sixteen, times four is thirty six thousand eight hundred sixty four; the root is one hundred ninety two. The height then comes from the area: twice one hundred ninety two is three hundred eighty four, divided by thirty two is twelve. Worth noticing: to answer the second question you must solve the third FIRST. In this isosceles triangle the height can also be found another way: half the base is sixteen and the leg is twenty, so by the Pythagorean theorem the height is twelve — two routes, one answer.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('72') !== -1, text: L(
      "Yetmish ikki — perimetrning o'zi, yarim perimetr esa uning yarmi: o'ttiz olti. Agar yetmish ikkini formulaga qo'ysangiz, ayirmalar ham butunlay boshqa chiqadi: yetmish ikki minus yigirma ellik ikki, yetmish ikki minus o'ttiz ikki qirq — va yuza haqiqiy qiymatdan bir necha barobar katta bo'lardi.",
      'Семьдесят два — сам периметр, а полупериметр его половина: тридцать шесть. Если подставить семьдесят два в формулу, разности выйдут совсем другими: семьдесят два минус двадцать — пятьдесят два, семьдесят два минус тридцать два — сорок, и площадь оказалась бы в несколько раз больше настоящей.',
      'Seventy two is the perimeter itself, while the semi-perimeter is half of it: thirty six. Put seventy two into the formula and the differences come out entirely different: seventy two minus twenty is fifty two, seventy two minus thirty two is forty — and the area would be several times the true one.') },
    { when: (s) => s.slots.indexOf('384') !== -1 || s.slots.indexOf('6') !== -1, text: L(
      "Bu ikki son balandlikni topishdagi yarim qadamlar. Uch yuz sakson to'rt — ikkilangan yuza, undan keyin o'ttiz ikkiga bo'lish qoladi. Olti esa ikkilantirishsiz chiqadi: bir yuz to'qson ikkini o'ttiz ikkiga bo'lsak olti — lekin yuza formulasida yarim bor, ya'ni teskari yo'lda ikkilantirish bo'ladi.",
      'Эти два числа — половинчатые шаги при нахождении высоты. Триста восемьдесят четыре — удвоенная площадь, дальше остаётся разделить на тридцать два. А шесть выходит без удвоения: сто девяносто два разделить на тридцать два — шесть, но в формуле площади есть половина, значит в обратном пути есть удвоение.',
      'These two numbers are half steps on the way to the height. Three hundred eighty four is the doubled area; dividing by thirty two still remains. Six comes from skipping the doubling: one hundred ninety two divided by thirty two is six — but the area formula has a half, so the reverse route has a doubling.') },
    { when: (s) => s.set, text: L(
      "Uch javob to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: o'n ikki, o'ttiz olti, bir yuz to'qson ikki. Savollar boshqa tartibda berilgan.",
      'Три ответа найдены верно, а порядок нарушен. Код пишется по возрастанию: двенадцать, тридцать шесть, сто девяносто два. Вопросы заданы в другом порядке.',
      'The three answers are right, the order is not. The code goes in increasing order: twelve, thirty six, one hundred ninety two. The questions come in a different order.') },
    { when: (s) => s.slots.indexOf('192') === -1, text: L(
      "Kodda bir yuz to'qson ikki yo'q, lekin uchburchakning yuzi aynan shu. Geron formulasi: o'ttiz olti karra o'n olti karra o'n olti karra to'rt, ya'ni o'ttiz olti ming sakkiz yuz oltmish to'rt; ildizi bir yuz to'qson ikki. Tekshirish: asos o'ttiz ikki, balandlik o'n ikki, yarim ko'paytma bir yuz to'qson ikki.",
      'В коде нет ста девяноста двух, а площадь треугольника именно такая. Формула Герона: тридцать шесть на шестнадцать на шестнадцать на четыре, то есть тридцать шесть тысяч восемьсот шестьдесят четыре; корень сто девяносто два. Проверка: основание тридцать два, высота двенадцать, половина произведения сто девяносто два.',
      'The code has no one hundred ninety two, yet that is the area of the triangle. Heron formula: thirty six times sixteen times sixteen times four, that is thirty six thousand eight hundred sixty four; the root is one hundred ninety two. Check: base thirty two, height twelve, half the product is one hundred ninety two.') },
  ],
  wrongText: L(
    "Avval yarim perimetr, keyin Geron formulasi bilan yuza, va faqat undan keyin balandlik: h teng ikki S bo'linadi a.",
    'Сначала полупериметр, потом площадь по формуле Герона, и только затем высота: h равно два S делить на a.',
    'First the semi-perimeter, then the area by Heron formula, and only then the height: h equals two S over a.'),
};

export default function D46_09(props) { return <CodeLock data={DATA} {...props} />; }
