// Dars42 · Amaliyot 05 — Kod · 🟡 · tag: code_areas
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §4 (42-dars, 5-pozitsiya)
//
// UCH TRAPETSIYA, IKKINCHISI BOSHQA YO'LDAN: unda asoslar emas, O'RTA CHIZIQ
// berilgan (T2), ya'ni yig'indining yarmi allaqachon tayyor va ikkiga bo'lish
// KERAK EMAS. Aynan shu joyda o'quvchi «har doim ikkiga bo'linadi» degan
// odatga tayanib qoladi.
//
// Bankdagi tuzoqlar: 48 va 70 — yarim unutilgan; 56 — o'rta chiziqni asoslar
// yig'indisi deb olib ikkilantirish.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_areas', level: '🟡',
  expr: ['a = 6, b = 10, h = 3', '   ', 'm = 7, h = 4', '   ', 'a = 5, b = 9, h = 5'], exprSize: 14,
  cards: ['24', '28', '35', '48', '56', '70'],
  answer: ['24', '28', '35'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch trapetsiyaning yuzi kod bo'ladi. Birinchi va uchinchisida ikki asos bilan balandlik berilgan; ikkinchisida esa asoslar emas, O'RTA CHIZIQ berilgan.",
    'В комнате сейф, код трёхзначный. Кодом будут площади трёх трапеций. В первой и третьей даны два основания и высота; во второй даны не основания, а СРЕДНЯЯ ЛИНИЯ.',
    'There is a safe in the room and its code has three places. The code is the areas of three trapezoids. The first and third give two bases and a height; the second gives not the bases but the MIDLINE.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch yuzani toping va kodga o'sish tartibida yozing.",
    'Найди три площади и запиши их в код по возрастанию.',
    'Find the three areas and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchisi: olti qo'shuv o'n o'n olti, yarmi sakkiz, sakkiz karra uch yigirma to'rt. Uchinchisi: besh qo'shuv to'qqiz o'n to'rt, yarmi yetti, yetti karra besh o'ttiz besh. Ikkinchisida esa ikkiga bo'lish kerak emas: o'rta chiziq — bu asoslar yig'indisining yarmi, ya'ni ish allaqachon bajarilgan. Yetti karra to'rt yigirma sakkiz. O'sish tartibida: yigirma to'rt, yigirma sakkiz, o'ttiz besh. Diqqat qiladigan joy: uchinchi trapetsiyaning o'rta chizig'i ham yettiga teng, ya'ni ikkinchi va uchinchisi bir xil o'rta chiziqqa ega, lekin balandliklari boshqa.",
    'Верно. Первая: шесть плюс десять — шестнадцать, половина восемь, восемь на три — двадцать четыре. Третья: пять плюс девять — четырнадцать, половина семь, семь на пять — тридцать пять. А во второй делить на два не нужно: средняя линия и есть половина суммы оснований, работа уже сделана. Семь на четыре — двадцать восемь. По возрастанию: двадцать четыре, двадцать восемь, тридцать пять. На что стоит обратить внимание: у третьей трапеции средняя линия тоже равна семи, то есть у второй и третьей она одна, а высоты разные.',
    'Correct. The first: six plus ten is sixteen, half is eight, eight times three is twenty four. The third: five plus nine is fourteen, half is seven, seven times five is thirty five. In the second no halving is needed: the midline IS half the sum of the bases, the work is already done. Seven times four is twenty eight. In increasing order: twenty four, twenty eight, thirty five. Worth noticing: the third trapezoid also has midline seven, so the second and third share a midline but differ in height.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('56') !== -1, text: L(
      "Ellik olti — o'rta chiziq asoslar YIG'INDISI deb olingan va yana ikkilantirilgan. O'rta chiziq esa yig'indining YARMI: agar asoslar besh va to'qqiz bo'lsa, o'rta chiziq yetti. Uni to'g'ridan-to'g'ri balandlikka ko'paytirish kerak: yetti karra to'rt yigirma sakkiz.",
      'Пятьдесят шесть — средняя линия принята за СУММУ оснований и ещё удвоена. А средняя линия — ПОЛОВИНА суммы: если основания пять и девять, средняя линия семь. Её надо прямо умножить на высоту: семь на четыре — двадцать восемь.',
      'Fifty six means the midline was taken for the SUM of the bases and doubled again. The midline is HALF the sum: with bases five and nine the midline is seven. It is multiplied by the height directly: seven times four is twenty eight.') },
    { when: (s) => s.slots.indexOf('48') !== -1 || s.slots.indexOf('70') !== -1, text: L(
      "Bu sonlarda yarim yo'q: o'n olti karra uch qirq sakkiz, o'n to'rt karra besh yetmish. Asoslarning yig'indisini olganingizdan keyin uni ikkiga bo'lish kerak — yoki, boshqa yo'l bilan, o'rta chiziqni topish kerak.",
      'В этих числах нет половины: шестнадцать на три — сорок восемь, четырнадцать на пять — семьдесят. После сложения оснований сумму надо разделить на два — или, что то же, найти среднюю линию.',
      'These numbers are missing the half: sixteen times three is forty eight, fourteen times five is seventy. After adding the bases the sum must be halved — or, which is the same, the midline must be found.') },
    { when: (s) => s.set, text: L(
      "Uch yuza to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: yigirma to'rt, yigirma sakkiz, o'ttiz besh.",
      'Три площади найдены верно, а порядок нарушен. Код пишется по возрастанию: двадцать четыре, двадцать восемь, тридцать пять.',
      'The three areas are right, the order is not. The code goes in increasing order: twenty four, twenty eight, thirty five.') },
    { when: (s) => s.slots.indexOf('28') === -1, text: L(
      "Kodda yigirma sakkiz yo'q, lekin ikkinchi trapetsiyaning yuzi aynan shu. U yerda o'rta chiziq berilgan, ya'ni asoslar bilan ishlash kerak emas: o'rta chiziqni balandlikka ko'paytirish kifoya.",
      'В коде нет двадцати восьми, а площадь второй трапеции именно такая. Там дана средняя линия, значит с основаниями работать не нужно: достаточно умножить среднюю линию на высоту.',
      'The code has no twenty eight, yet that is the area of the second trapezoid. The midline is given there, so no work with the bases is needed: multiplying the midline by the height is enough.') },
  ],
  wrongText: L(
    "Asoslar berilgan bo'lsa — qo'shib yarmini oling; o'rta chiziq berilgan bo'lsa — u allaqachon yarim.",
    'Если даны основания — сложи и возьми половину; если дана средняя линия — она уже половина.',
    'If the bases are given, add them and halve; if the midline is given, it is already the half.'),
};

export default function D42_05(props) { return <CodeLock data={DATA} {...props} />; }
