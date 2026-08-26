// Dars41 · Amaliyot 04 — Kod · 🟡 · tag: code_areas
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §3 (41-dars, 4-pozitsiya)
//
// UCH UCHBURCHAK, IKKI XIL YO'L: birinchi va uchinchisida asos bilan
// balandlik berilgan, ikkinchisi to'g'ri burchakli va unda KATETLAR ishlaydi
// (T2). Gipotenuza ataylab berilgan — u hisobga kirmaydi, va aynan shu
// З86 ni tutadi.
//
// Bankdagi tuzoqlar: 60 va 70 — З85 (ikkiga bo'lish unutilgan), 40 — З86
// (gipotenuza balandlik deb olingan: yarmi sakkiz karra o'n).
// Kod O'SISH tartibida yoziladi, ya'ni javob KETMA-KETLIK: 24, 30, 35.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_areas', level: '🟡',
  expr: ['a = 10, h = 6', '   ', 'a = 6, b = 8, c = 10', '   ', 'a = 14, h = 5'], exprSize: 14,
  cards: ['24', '30', '35', '40', '60', '70'],
  answer: ['24', '30', '35'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch uchburchakning yuzi kod bo'ladi. Birinchi va uchinchisida asos bilan balandlik berilgan; ikkinchisi to'g'ri burchakli va unda katetlar bilan gipotenuza berilgan.",
    'В комнате сейф, код трёхзначный. Кодом будут площади трёх треугольников. В первом и третьем даны основание и высота; второй прямоугольный, и в нём даны катеты и гипотенуза.',
    'There is a safe in the room and its code has three places. The code is the areas of three triangles. The first and third give a base and a height; the second is right-angled and gives the legs and the hypotenuse.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch yuzani toping va kodga o'sish tartibida yozing.",
    'Найди три площади и запиши их в код по возрастанию.',
    'Find the three areas and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchisi: o'n karra olti oltmish, yarmi o'ttiz. Uchinchisi: o'n to'rt karra besh yetmish, yarmi o'ttiz besh. Ikkinchisida balandlikni izlash kerak emas — to'g'ri burchakli uchburchakda bir katet asos, ikkinchisi esa unga mos balandlik bo'ladi, chunki ular bir-biriga perpendikulyar. Olti karra sakkiz qirq sakkiz, yarmi yigirma to'rt. Gipotenuza esa hisobga umuman kirmaydi. O'sish tartibida: yigirma to'rt, o'ttiz, o'ttiz besh.",
    'Верно. Первый: десять на шесть — шестьдесят, половина тридцать. Третий: четырнадцать на пять — семьдесят, половина тридцать пять. Во втором высоту искать не нужно — в прямоугольном треугольнике один катет служит основанием, а второй соответствующей высотой, ведь они перпендикулярны друг другу. Шесть на восемь — сорок восемь, половина двадцать четыре. А гипотенуза в счёт вообще не входит. По возрастанию: двадцать четыре, тридцать, тридцать пять.',
    'Correct. The first: ten times six is sixty, half is thirty. The third: fourteen times five is seventy, half is thirty five. In the second no height needs finding — in a right triangle one leg serves as the base and the other as the matching height, since they are perpendicular to each other. Six times eight is forty eight, half is twenty four. The hypotenuse does not enter the computation at all. In increasing order: twenty four, thirty, thirty five.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('40') !== -1, text: L(
      "Qirq — bu gipotenuzani hisobga qo'shgandan chiqadi: sakkiz karra o'n ning yarmi. Lekin gipotenuza asos ham, balandlik ham bo'lolmaydi: unga mos balandlik uchburchakning ichida yotadi va u berilmagan. Bir-biriga perpendikulyar ikki tomon faqat katetlar, ya'ni olti va sakkiz.",
      'Сорок получается, если включить в счёт гипотенузу: половина от восьми на десять. Но гипотенуза не может быть ни основанием, ни высотой: соответствующая ей высота лежит внутри треугольника и не дана. Перпендикулярны друг другу только катеты, то есть шесть и восемь.',
      'Forty comes from bringing the hypotenuse into the computation: half of eight times ten. But the hypotenuse can be neither the base nor the height: the height matching it lies inside the triangle and is not given. The only two sides perpendicular to each other are the legs, six and eight.') },
    { when: (s) => s.slots.indexOf('60') !== -1 || s.slots.indexOf('70') !== -1, text: L(
      "Bu sonlar ko'paytmaning o'zi, yuza esa uning yarmi. O'n karra olti oltmish — bu shu asos va shu balandlikka qurilgan parallelogrammning yuzi. Uchburchak esa uning yarmi: o'ttiz.",
      'Эти числа — само произведение, а площадь его половина. Десять на шесть — шестьдесят, это площадь параллелограмма с тем же основанием и высотой. А треугольник его половина: тридцать.',
      'These numbers are the product itself, while the area is half of it. Ten times six is sixty — that is the area of the parallelogram on the same base and height. The triangle is half of it: thirty.') },
    { when: (s) => s.set, text: L(
      "Uch yuza to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: eng kichigidan boshlanadi. Savollarning tartibi javoblarning tartibi bilan mos kelmaydi.",
      'Три площади найдены верно, а порядок нарушен. Код пишется по возрастанию: начиная с наименьшего. Порядок вопросов с порядком ответов не совпадает.',
      'The three areas are right, the order is not. The code goes in increasing order, starting from the smallest. The order of the questions does not match the order of the answers.') },
    { when: (s) => s.slots.indexOf('24') === -1, text: L(
      "Kodda yigirma to'rt yo'q, lekin ikkinchi uchburchakning yuzi aynan shu. To'g'ri burchakli uchburchakda ikki katet bir-biriga perpendikulyar, ya'ni biri asos, ikkinchisi balandlik: olti karra sakkiz ning yarmi yigirma to'rt.",
      'В коде нет двадцати четырёх, а площадь второго треугольника именно такая. В прямоугольном треугольнике два катета перпендикулярны друг другу, то есть один основание, второй высота: половина от шести на восемь — двадцать четыре.',
      'The code has no twenty four, yet that is the area of the second triangle. In a right triangle the two legs are perpendicular to each other, so one is the base and the other the height: half of six times eight is twenty four.') },
  ],
  wrongText: L(
    "Har uchburchakda bir-biriga PERPENDIKULYAR ikki uzunlikni toping, ko'paytiring va ikkiga bo'ling.",
    'В каждом треугольнике найди две ПЕРПЕНДИКУЛЯРНЫЕ друг другу длины, перемножь и раздели на два.',
    'In every triangle find the two lengths PERPENDICULAR to each other, multiply them and halve.'),
};

export default function D41_04(props) { return <CodeLock data={DATA} {...props} />; }
