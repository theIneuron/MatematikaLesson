// Dars35 · Amaliyot 06 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §7 (35-dars, 6-pozitsiya)
//
// UCH BO'SHLIQ — UCHALA O'LCHOV. Bankdagi tuzoqlar:
//   «moda» va «o'rtacha qiymat» ni almashtirish — З71;
//   «o'rtadagi son»  — З72: juft qatorda mediana bitta son emas;
//   «eng katta son» — modaning eng ko'p uchraydigan soxta ta'rifi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      "Sonlar yig'indisi ularning soniga bo'linsa,",
      'Если сумму чисел разделить на их количество, получится',
      'If the sum of the numbers is divided by their count, the result is the') },
    { slot: 0 },
    { text: L(
      "chiqadi. Eng ko'p uchraydigan qiymat",
      '. Чаще всего встречающееся значение называется', '. The value occurring most often is the') },
    { slot: 1 },
    { text: L(
      "deyiladi. Variantalar soni juft bo'lsa, mediana",
      '. Если количество вариант чётное, медиана это', '. If the number of variants is even, the median is the') },
    { slot: 2 },
    { text: L("bo'ladi.", '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L("o'rtacha qiymat", 'среднее значение', 'mean') },
    { id: 'w2', label: L('moda', 'модой', 'mode') },
    { id: 'w3', label: L("ikki o'rtadagi sonning o'rtachasi", 'среднее двух срединных чисел', 'mean of the two middle numbers') },
    { id: 'w4', label: L("o'rtadagi son", 'срединное число', 'middle number') },
    { id: 'w5', label: L('mediana', 'медианой', 'median') },
    { id: 'w6', label: L('eng katta son', 'наибольшее число', 'largest number') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning uchala o'lchovi bitta gapga yig'ilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta, va uchtasi gapga tili bo'yicha bemalol tushadi.",
    'Все три величины урока собраны в одно предложение, но три слова выпали. В банке шесть карточек, и три из них по языку встают в предложение совершенно спокойно.',
    'All three measures of the lesson are gathered into one sentence, but three words fell out. The bank holds six cards, and three of them slot into the sentence perfectly well as language.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uch o'lchov uch xil savolga javob beradi. O'rtacha qiymat — hamma sonni HISOBGA oladi va qo'shish bilan topiladi; u qatorda bo'lmasligi ham mumkin. Moda — eng ko'p uchraydigan qiymat, u SANASH bilan topiladi va har doim qatorning o'z soni bo'ladi. Mediana esa O'RINGA qaraydi: toq qatorda o'rtadagi son, juft qatorda esa o'rtadagi ikki sonning o'rtachasi. Juft holni alohida aytish shart, chunki u yerda bitta o'rta yo'q, va mediana ko'pincha qatorda umuman uchramaydi.",
    'Верно. Три величины отвечают на три разных вопроса. Среднее значение УЧИТЫВАЕТ все числа и находится сложением; его самого в ряду может и не быть. Мода — самое частое значение, находится ПОДСЧЁТОМ и всегда является числом самого ряда. А медиана смотрит на МЕСТО: в нечётном ряду это срединное число, в чётном — среднее двух срединных. Чётный случай надо оговаривать отдельно, потому что единого центра там нет, и медиана часто в ряду вообще не встречается.',
    'Correct. The three measures answer three different questions. The mean TAKES every number into account and is found by adding; it may be absent from the series. The mode is the most frequent value, found by COUNTING, and it is always a number of the series itself. The median looks at POSITION: in an odd series it is the middle number, in an even one the mean of the two middle numbers. The even case must be stated separately, because there is no single centre there, and the median often does not appear in the series at all.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w2' || s.slots[1] === 'w1', text: L(
      "Moda va o'rtacha qiymat o'rin almashdi. Gapning o'zi ularni ajratadi: «yig'indi soniga bo'linsa» — bu HISOB, ya'ni o'rtacha; «eng ko'p uchraydigan» — bu SANOQ, ya'ni moda. Ular bitta qatorda turli son berishi mumkin, masalan to'rt, to'rt, yetti qatorida moda to'rt, o'rtacha esa besh.",
      'Мода и среднее значение поменялись местами. Само предложение их различает: «сумму разделить на количество» — это ВЫЧИСЛЕНИЕ, то есть среднее; «чаще всего встречающееся» — это ПОДСЧЁТ, то есть мода. В одном ряду они могут дать разные числа: например в ряду четыре, четыре, семь мода четыре, а среднее пять.',
      'The mode and the mean changed places. The sentence itself tells them apart: «the sum divided by the count» is a COMPUTATION, that is the mean; «occurring most often» is a COUNT, that is the mode. In one series they may give different numbers: in four, four, seven the mode is four and the mean is five.') },
    { when: (s) => s.slots[2] === 'w4', text: L(
      "«O'rtadagi son» — bu TOQ qator uchun to'g'ri, gapda esa JUFT hol haqida aytilyapti. Juft qatorda bitta o'rta yo'q: to'rtta sonning o'rtasida ikkita son turadi. Shuning uchun mediana ularning o'rtachasi bo'ladi, va u qatorda umuman bo'lmasligi mumkin — masalan ikki, to'rt, olti, sakkiz qatorida mediana besh.",
      '«Срединное число» верно для НЕЧЁТНОГО ряда, а в предложении речь о ЧЁТНОМ случае. В чётном ряду единого центра нет: у четырёх чисел в середине стоят два. Поэтому медиана — их среднее, и в ряду её может не быть вовсе: например в ряду два, четыре, шесть, восемь медиана пять.',
      '«Middle number» is right for an ODD series, while the sentence speaks of the EVEN case. In an even series there is no single centre: four numbers have two in the middle. So the median is their mean, and it may be absent from the series — for instance in two, four, six, eight the median is five.') },
    { when: (s) => s.slots.indexOf('w6') !== -1, text: L(
      "«Eng katta son» hech bir bo'shliqqa tushmaydi. Moda eng KATTA emas, eng KO'P uchraydigan qiymat: uch, besh, uch, sakkiz, besh, uch qatorida eng kattasi sakkiz, moda esa uch. Eng katta son statistikada alohida atama emas — u shunchaki qatorning oxirgi elementi.",
      '«Наибольшее число» не подходит ни к одному пропуску. Мода — не САМОЕ БОЛЬШОЕ, а САМОЕ ЧАСТОЕ значение: в ряду три, пять, три, восемь, пять, три наибольшее восемь, а мода три. Наибольшее число в статистике отдельным термином не является — это просто последний элемент ряда.',
      '«Largest number» fits no gap. The mode is not the LARGEST but the MOST FREQUENT value: in three, five, three, eight, five, three the largest is eight while the mode is three. The largest number is not a separate statistical term — it is merely the last element of the series.') },
    { when: (s) => s.slots.indexOf('w5') !== -1, text: L(
      "«Mediana» so'zi gapda allaqachon turibdi — uchinchi bo'shliq uning TA'RIFINI so'rayapti, nomini emas. Ta'rif esa juft hol uchun aytilishi kerak: o'rtadagi ikki sonning o'rtachasi.",
      'Слово «медиана» в предложении уже стоит — третий пропуск спрашивает её ОПРЕДЕЛЕНИЕ, а не название. А определение надо дать для чётного случая: среднее двух срединных чисел.',
      'The word «median» already stands in the sentence — the third gap asks for its DEFINITION, not its name. And the definition must be given for the even case: the mean of the two middle numbers.') },
  ],
  wrongText: L(
    "Uch o'lchovni ish bo'yicha ajrating: o'rtacha — qo'shish, moda — sanash, mediana — o'rin. Juft qatorda mediana ikki sonning o'rtachasi.",
    'Различай три величины по действию: среднее — сложение, мода — подсчёт, медиана — место. В чётном ряду медиана среднее двух чисел.',
    'Tell the three measures apart by the work they take: the mean is adding, the mode is counting, the median is position. In an even series the median is the mean of two numbers.'),
};

export default function D35_06(props) { return <ClozeBank data={DATA} {...props} />; }
