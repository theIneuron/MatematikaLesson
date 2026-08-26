// Dars34 · Amaliyot 06 — Kod · 🟡 · tag: code_frequencies
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §6 (34-dars, 6-pozitsiya)
//
// YANGI TANLANMA (topshiriqlar ma'lumotni takrorlamaydi): 7, 5, 7, 9, 5,
// 7, 9, 7, 9 — to'qqizta natija. Chastotalar: beshlik 2, to'qqizlik 3,
// yettilik 4. Kod o'sish tartibida — 2, 3, 4.
//
// BANKDAGI TUZOQ — VARIANTLARNING O'ZI: 5, 7, 9. Bu З69 ning ikkinchi
// yuzi: qiymatni sanoq bilan chalkashtirish. Kod chastotalardan yig'iladi,
// variantlardan emas, va tekshiruv T3 bilan: 2 + 3 + 4 = 9, ya'ni hajm.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_frequencies', level: '🟡',
  expr: ['7, 5, 7, 9, 5, 7, 9, 7, 9'], exprSize: 20,
  cards: ['2', '3', '4', '5', '7', '9'],
  answer: ['2', '3', '4'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Yangi tanlanma berilgan, unda uch xil variant bor. Har variantning chastotasini topish kerak, va kodga aynan chastotalar yoziladi.",
    'В комнате сейф, код трёхзначный. Дана новая выборка, в ней три разных варианта. Надо найти частоту каждого, и в код записываются именно частоты.',
    'There is a safe in the room and its code has three places. A new sample is given with three different variants. The frequency of each must be found, and it is the frequencies that go into the code.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch chastotani kodga o'sish tartibida yozing.",
    'Запиши три частоты в код по возрастанию.',
    'Write the three frequencies into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Tanlanmada uch xil variant bor: besh, yetti va to'qqiz. Beshlik ikki marta, to'qqizlik uch marta, yettilik to'rt marta uchraydi. O'sish tartibida: ikki, uch, to'rt. Javobni tekshirish uchun chastotalar yig'indisini oling: ikki qo'shuv uch qo'shuv to'rt to'qqiz, va tanlanmada ham to'qqizta natija bor. Bu tekshiruv har doim ishlaydi va u bepul: sanoqda bitta natija tashlab ketilsa yoki ikki marta sanalsa, yig'indi darhol boshqa chiqadi.",
    'Верно. В выборке три разных варианта: пять, семь и девять. Пятёрка встречается два раза, девятка три, семёрка четыре. По возрастанию: два, три, четыре. Чтобы проверить ответ, возьми сумму частот: два плюс три плюс четыре девять, и в выборке тоже девять результатов. Эта проверка работает всегда и достаётся даром: если при счёте один результат пропущен или сосчитан дважды, сумма сразу выйдет другой.',
    'Correct. The sample holds three different variants: five, seven and nine. The five occurs twice, the nine three times, the seven four times. In increasing order: two, three, four. To check the answer, take the sum of the frequencies: two plus three plus four is nine, and the sample has nine results too. This check always works and costs nothing: if one result is skipped or counted twice, the sum immediately comes out different.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('5') !== -1 || s.slots.indexOf('7') !== -1 || s.slots.indexOf('9') !== -1, text: L(
      "Kodga VARIANTLARNING o'zi yozildi — besh, yetti yoki to'qqiz. Lekin savol variantlar haqida emas, ularning CHASTOTASI haqida: har variant necha marta uchragani. Besh va yetti — bu tanlanmadagi qiymatlar, ikki va to'rt esa ularning sanoqlari. Ikki atamani ajratish uchun savolni ovoz chiqarib ayting: «yettilik necha marta uchradi» — to'rt marta.",
      'В код записали САМИ ВАРИАНТЫ — пять, семь или девять. Но вопрос не о вариантах, а об их ЧАСТОТЕ: сколько раз встретился каждый. Пять и семь — это значения в выборке, а два и четыре — их подсчёты. Чтобы различить, проговори вопрос вслух: «сколько раз встретилась семёрка» — четыре раза.',
      'The VARIANTS themselves were written into the code — five, seven or nine. But the question is not about the variants, it is about their FREQUENCY: how many times each occurred. Five and seven are values in the sample; two and four are their counts. To tell them apart, say the question aloud: «how many times did the seven occur» — four times.') },
    { when: (s) => s.slots.indexOf('4') === -1, text: L(
      "Kodda to'rt yo'q, lekin yettilikning chastotasi aynan to'rt. Tanlanmani yuring va faqat yettiliklarni sanang: birinchi, uchinchi, oltinchi va sakkizinchi o'rinlar. Yettilik bu tanlanmada eng ko'p uchraydigan variant. Agar uni uch deb sanagan bo'lsangiz, yig'indi sakkiz chiqadi — to'qqiz emas, ya'ni bitta natija tushib qolgan.",
      'В коде нет четырёх, а частота семёрки именно четыре. Пройди выборку и считай только семёрки: первое, третье, шестое и восьмое места. Семёрка — самый частый вариант этой выборки. Если ты сосчитал три, сумма выйдет восемь, а не девять, значит один результат потерян.',
      'The code has no four, yet the frequency of the seven is exactly four. Walk the sample counting only sevens: the first, third, sixth and eighth places. The seven is the most frequent variant of this sample. If you counted three, the sum comes to eight rather than nine, so one result was lost.') },
    { when: (s) => s.slots.indexOf('2') === -1, text: L(
      "Kodda ikki yo'q, lekin beshlikning chastotasi aynan ikki: u ikkinchi va beshinchi o'rinlarda turibdi. Eng kichik chastota kodning boshida turadi. Uni tashlab ketsangiz uchta variantdan faqat ikkitasi sanalgan bo'ladi.",
      'В коде нет двойки, а частота пятёрки именно два: она стоит на втором и пятом местах. Наименьшая частота стоит в начале кода. Если её пропустить, из трёх вариантов будут сосчитаны только два.',
      'The code has no two, yet the frequency of the five is exactly two: it stands in the second and fifth places. The smallest frequency comes first in the code. Skip it and only two of the three variants have been counted.') },
    { when: (s) => s.set, text: L(
      "Uch chastota to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: ikki, uch, to'rt. Chastotalarni tartiblashda variantlarning tartibiga qaramang — bu ikki boshqa ro'yxat.",
      'Три частоты найдены верно, а порядок нарушен. Код пишется по возрастанию: два, три, четыре. При упорядочивании частот не смотри на порядок вариантов — это два разных списка.',
      'The three frequencies are right, the order is not. The code goes in increasing order: two, three, four. When ordering the frequencies, do not look at the order of the variants — these are two different lists.') },
  ],
  wrongText: L(
    "Har variantni alohida sanang va sanoqni kodga yozing, variantning o'zini emas. Yig'indi tanlanma hajmiga — to'qqizga — teng bo'lishi kerak.",
    'Считай каждый вариант отдельно и записывай в код подсчёт, а не сам вариант. Сумма должна равняться объёму выборки — девяти.',
    'Count each variant separately and write the count into the code, not the variant itself. The sum must equal the sample size — nine.'),
};

export default function D34_06(props) { return <CodeLock data={DATA} {...props} />; }
