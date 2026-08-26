// Dars42 · Amaliyot 06 — Ha yoki yo'q · 🟡 · tag: midline_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §4 (42-dars, 6-pozitsiya)
//
// JAVOB: HA, HA (skelet §0a.1). Ikkalasi ham rost, va bu topshiriqni OSON
// qilmaydi: o'quvchi «bittasi yolg'on bo'lishi kerak» degan kutish bilan
// keladi va odatda birinchisini rad etadi («yarim yo'q, demak xato»).
//
// Ikki da'vo bir-biriga yaqin turadi: birinchisi FORMULA (T2), ikkinchisi
// o'sha formulaning ichidagi o'rta chiziqning O'ZI. Razbor ikkisini bitta
// misolda yonma-yon hisoblaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'midline_claims', level: '🟡',
  itemSize: 16,
  given: [['m = (a + b) : 2']],
  givenLabel: L("O'rta chiziq", 'Средняя линия', 'The midline'),
  items: [
    { id: 's1', yes: true, tokens: ['S = m · h'], at: 'a = 7, b = 5, h = 4',
      claim: L('har trapetsiyada shunday', 'так в любой трапеции', 'so in every trapezoid') },
    { id: 's2', yes: true, tokens: ['m = 6'], at: 'a = 7, b = 5',
      claim: L("o'rta chiziq shunday chiqadi", 'средняя линия получается такой', 'the midline comes out like this') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Trapetsiyaning o'rta chizig'i asoslar yig'indisining yarmiga teng. Ikki da'vo ham shu chiziq haqida: birinchisi yuza formulasini beradi, ikkinchisi aniq sonlarni tekshiradi.",
    'Средняя линия трапеции равна половине суммы оснований. Оба утверждения про эту линию: первое даёт формулу площади, второе проверяет конкретные числа.',
    'The midline of a trapezoid equals half the sum of the bases. Both claims are about that line: the first gives the area formula, the second checks concrete numbers.'),
  ask: L(
    "Da'vo to'g'ri bo'lsa «Ha» ni, xato bo'lsa «Yo'q» ni bosing.",
    'Если утверждение верно — нажми «Да», если ошибочно — «Нет».',
    'Tap «Yes» if the claim is right, «No» if it is wrong.'),
  correctText: L(
    "To'g'ri, ikkalasi ham rost. Birinchi formulada yarim ko'rinmaydi, lekin u YO'QOLGAN emas — o'rta chiziqning ichida turadi: o'rta chiziqning o'zi yig'indining yarmi. Ikkinchi da'vo shuni sonlarda ko'rsatadi: yetti qo'shuv besh o'n ikki, yarmi olti. Endi ikki yo'lni yonma-yon hisoblang. Birinchi yo'l: o'n ikkining yarmi olti, olti karra to'rt yigirma to'rt. Ikkinchi yo'l: olti karra to'rt yigirma to'rt. Bitta javob, chunki bu bitta formulaning ikki yozuvi.",
    'Верно, оба утверждения истинны. В первой формуле половины не видно, но она не ПОТЕРЯНА — она внутри средней линии: сама средняя линия и есть половина суммы. Второе утверждение показывает это на числах: семь плюс пять — двенадцать, половина шесть. Теперь посчитай два пути рядом. Первый: половина двенадцати шесть, шесть на четыре — двадцать четыре. Второй: шесть на четыре — двадцать четыре. Один ответ, потому что это две записи одной формулы.',
    'Correct, both claims are true. The half is not visible in the first formula, but it is not LOST — it sits inside the midline: the midline itself is half the sum. The second claim shows this in numbers: seven plus five is twelve, half is six. Now compute the two routes side by side. First: half of twelve is six, six times four is twenty four. Second: six times four is twenty four. One answer, because these are two writings of one formula.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi formulada yarim yo'qolgandek ko'rinadi, lekin u o'rta chiziqning ichida. Berilgan sonlarni qo'ying: o'rta chiziq olti, olti karra to'rt yigirma to'rt — bu asoslar bilan hisoblagandagi javobning o'zi. Ikkiga bo'lishni YANA bir marta bajarish kerak emas.",
      'В первой формуле половина как будто потеряна, но она внутри средней линии. Подставь данные числа: средняя линия шесть, шесть на четыре — двадцать четыре, тот же ответ, что и при счёте через основания. Делить на два ЕЩЁ раз не нужно.',
      'The half looks lost in the first formula, but it is inside the midline. Substitute the given numbers: the midline is six, six times four is twenty four — the same answer as computing through the bases. There is no need to halve a SECOND time.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi da'voni tekshirish uchun ikki asosni qo'shib ikkiga bo'lish kifoya: yetti qo'shuv besh o'n ikki, yarmi olti. O'rta chiziq har doim ikki asosning ORASIDA yotadi — kattasidan kichik, kichigidan katta.",
      'Чтобы проверить второе утверждение, достаточно сложить основания и разделить на два: семь плюс пять — двенадцать, половина шесть. Средняя линия всегда лежит МЕЖДУ основаниями — меньше большего и больше меньшего.',
      'To check the second claim just add the bases and halve: seven plus five is twelve, half is six. The midline always lies BETWEEN the bases — less than the larger, more than the smaller.') },
  ],
  wrongText: L(
    "Ikki yo'lni bitta misolda hisoblang: asoslar orqali va o'rta chiziq orqali. Javob bir xil chiqishi kerak.",
    'Посчитай два пути на одном примере: через основания и через среднюю линию. Ответ должен выйти одинаковым.',
    'Compute both routes on one example: through the bases and through the midline. The answer must come out the same.'),
};

export default function D42_06(props) { return <TrueFalse data={DATA} {...props} />; }
