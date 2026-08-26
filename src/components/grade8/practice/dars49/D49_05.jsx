// Dars49 · Amaliyot 05 — Kod · 🟡 · tag: code_chords
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §11 (49-dars, 5-pozitsiya)
//
// UCH SAVOL, IKKI YO'NALISH:
//   R=10, AB=12 -> d = 8    (yarim vatar 6: 100 − 36 = 64)
//   R=13, AB=10 -> d = 12   (yarim vatar 5: 169 − 25 = 144)
//   R=25, d=15  -> AB = 40  (yarim vatar 20, keyin IKKILANTIRISH)
// З104 ikki joyda tutiladi: birinchi ikki savolda vatarning YARMI olinadi
// (to'liq uzunlik bilan ildiz ostida manfiy son chiqadi), uchinchisida esa
// javob yarim vatar EMAS — uni ikkilantirish kerak.
// Bankdagi tuzoqlar: 20 (yarim vatar, ikkilantirish unutilgan), 50 (diametr),
// 24 (yaqin son).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_chords', level: '🟡',
  expr: ['R = 10, AB = 12', '   ', 'R = 13, AB = 10', '   ', 'R = 25, d = 15'], exprSize: 13,
  cards: ['8', '12', '20', '24', '40', '50'],
  answer: ['8', '12', '40'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Birinchi ikki savolda radius va vatar berilgan, markazdan masofa kerak; uchinchisida radius va masofa berilgan, vatar kerak. Markazdan tushirilgan perpendikulyar vatarni teng ikkiga bo'ladi.",
    'В комнате сейф, код трёхзначный. В первых двух вопросах даны радиус и хорда, нужно расстояние от центра; в третьем даны радиус и расстояние, нужна хорда. Перпендикуляр из центра делит хорду пополам.',
    'There is a safe in the room, its code three digits. The first two questions give a radius and a chord and ask for the distance from the centre; the third gives a radius and a distance and asks for the chord. The perpendicular from the centre halves the chord.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch javobni toping va kodga o'sish tartibida yozing.",
    'Найди три ответа и запиши их в код по возрастанию.',
    'Find the three answers and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchisi: yarim vatar olti, yuz minus o'ttiz olti oltmish to'rt, ildizi sakkiz. Ikkinchisi: yarim vatar besh, bir yuz oltmish to'qqiz minus yigirma besh bir yuz qirq to'rt, ildizi o'n ikki. Uchinchisi teskari yo'nalishda: olti yuz yigirma besh minus ikki yuz yigirma besh to'rt yuz, ildizi yigirma — lekin bu YARIM vatar, ya'ni javob uning ikki barobari, qirq. O'sish tartibida: sakkiz, o'n ikki, qirq. Diqqat qiladigan joy: ikkinchi savolda vatar birinchisidan qisqa, masofa esa katta — bir aylanada vatar qanchalik qisqa bo'lsa, u markazdan shunchalik uzoqda turadi.",
    'Верно. Первый: половина хорды шесть, сто минус тридцать шесть — шестьдесят четыре, корень восемь. Второй: половина хорды пять, сто шестьдесят девять минус двадцать пять — сто сорок четыре, корень двенадцать. Третий в обратную сторону: шестьсот двадцать пять минус двести двадцать пять — четыреста, корень двадцать, но это ПОЛОВИНА хорды, значит ответ вдвое больше, сорок. По возрастанию: восемь, двенадцать, сорок. На что стоит обратить внимание: во втором вопросе хорда короче, чем в первом, а расстояние больше — в одной окружности чем короче хорда, тем дальше она от центра.',
    'Correct. The first: half the chord is six, one hundred minus thirty six is sixty four, the root eight. The second: half the chord is five, one hundred sixty nine minus twenty five is one hundred forty four, the root twelve. The third runs the other way: six hundred twenty five minus two hundred twenty five is four hundred, the root twenty — but that is HALF the chord, so the answer is twice that, forty. In increasing order: eight, twelve, forty. Worth noticing: in the second question the chord is shorter than in the first while the distance is larger — in one circle the shorter the chord, the farther it sits from the centre.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('20') !== -1, text: L(
      "Yigirma — uchinchi savolda ikkilantirish unutilgan. Ildiz ostidan chiqqan son vatarning YARMI: markazdan tushirilgan perpendikulyar vatarni teng ikkiga bo'ladi, ya'ni to'g'ri burchakli uchburchakning kateti yarim vatar. To'liq vatar uchun uni ikkiga ko'paytirish kerak: qirq.",
      'Двадцать — в третьем вопросе забыто удвоение. Число из-под корня — это ПОЛОВИНА хорды: перпендикуляр из центра делит хорду пополам, значит катет прямоугольного треугольника — половина хорды. Для всей хорды его надо умножить на два: сорок.',
      'Twenty means the doubling was forgotten in the third question. The number from under the root is HALF the chord: the perpendicular from the centre halves the chord, so the leg of the right triangle is half of it. For the whole chord multiply by two: forty.') },
    { when: (s) => s.slots.indexOf('50') !== -1 || s.slots.indexOf('24') !== -1, text: L(
      "Ellik — bu diametr, ya'ni radiusning ikki barobari; u vatarning uzunligi emas (garchi vatar unga teng bo'lishi ham mumkin — o'zi diametr bo'lganda). Yigirma to'rt esa hisobda chiqmaydigan son. Har savolni bosqichma-bosqich yuring: kvadratlarni ayirib ildiz chiqaring, keyin nima topilganini — masofami yoki yarim vatarmi — aniqlang.",
      'Пятьдесят — это диаметр, вдвое больше радиуса; длиной хорды он не является (хотя хорда может быть ему равна — когда она сама диаметр). А двадцать четыре в счёте не появляется. Иди по шагам в каждом вопросе: вычти квадраты, извлеки корень, потом определи, что найдено — расстояние или половина хорды.',
      'Fifty is the diameter, twice the radius; it is not the length of the chord (though a chord may equal it — when it is a diameter itself). Twenty four does not appear in the arithmetic at all. Go step by step in every question: subtract the squares, take the root, then decide what was found — a distance or half a chord.') },
    { when: (s) => s.set, text: L(
      "Uch javob to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: sakkiz, o'n ikki, qirq.",
      'Три ответа найдены верно, а порядок нарушен. Код пишется по возрастанию: восемь, двенадцать, сорок.',
      'The three answers are right, the order is not. The code goes in increasing order: eight, twelve, forty.') },
    { when: (s) => s.slots.indexOf('40') === -1, text: L(
      "Kodda qirq yo'q, lekin uchinchi savolning javobi aynan shu. Ildiz yigirmani beradi, u esa yarim vatar; to'liq vatar qirq. Bu savol boshqa ikkitasidan farq qiladi: u yerda masofa izlanardi, bu yerda esa vatarning o'zi.",
      'В коде нет сорока, а ответ третьего вопроса именно такой. Корень даёт двадцать, а это половина хорды; вся хорда сорок. Этот вопрос отличается от двух других: там искали расстояние, а здесь саму хорду.',
      'The code has no forty, yet that is the answer to the third question. The root gives twenty, which is half the chord; the whole chord is forty. That question differs from the other two: there a distance was sought, here the chord itself.') },
  ],
  wrongText: L(
    "Katet — vatarning YARMI. Masofa izlansa ildizni oling, vatar izlansa ildizni ikkilantiring.",
    'Катет — ПОЛОВИНА хорды. Ищешь расстояние — берёшь корень, ищешь хорду — удваиваешь корень.',
    'The leg is HALF the chord. Seeking a distance you take the root; seeking a chord you double it.'),
};

export default function D49_05(props) { return <CodeLock data={DATA} {...props} />; }
