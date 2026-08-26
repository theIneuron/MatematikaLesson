// Dars46 · Amaliyot 07 — Tartib · 🟡 · tag: heron_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §8 (46-dars, 7-pozitsiya)
//
// HISOBNING TARTIBI, ISBOTNING EMAS. Darslikning eslatmasi (102-bet):
// formulani keltirib chiqarish iqtidorli o'quvchilar uchun, hamma esa
// formula bo'yicha HISOBLASHNI bilishi shart. Shuning uchun bu yerda
// isbot emas, to'rt hisob qadami turadi.
//
// Uchburchak: 11, 25, 30. p = 33; ayirmalar 22, 8, 3; ko'paytma 17424;
// ildizi 132.
// З97 tartibda ko'rinadi: ayirmalarni `p` dan OLDIN hisoblab bo'lmaydi,
// chunki ular `p` dan olinadi. Kartalarning matematikasi QISQA (skelet §14).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'heron_steps', level: '🟡',
  expr: ['11,  25,  30'], exprSize: 24,
  itemSize: 13,
  cards: [
    { id: 'l1', tokens: ['p = 33'], label: L('yarim perimetr', 'полупериметр', 'the semi-perimeter') },
    { id: 'l2', tokens: ['22, 8, 3'], label: L('uch ayirma', 'три разности', 'the three differences') },
    { id: 'l3', tokens: ['17424'], label: L("to'rt sonning ko'paytmasi", 'произведение четырёх чисел', 'the product of the four numbers') },
    { id: 'l4', tokens: ['S = 132'], label: L('ildiz', 'корень', 'the root') },
  ],
  start: ['l2', 'l3', 'l1', 'l4'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Uchburchakning tomonlari o'n bir, yigirma besh va o'ttiz. Geron formulasi bilan yuzani topish to'rt qadamda boradi, lekin qadamlar aralashib ketgan.",
    'Стороны треугольника одиннадцать, двадцать пять и тридцать. Нахождение площади по формуле Герона идёт в четыре шага, но шаги перепутаны.',
    'The sides of a triangle are eleven, twenty five and thirty. Finding the area by Heron formula takes four steps, but the steps are mixed up.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Birinchi qadam — yarim perimetr: o'n bir qo'shuv yigirma besh qo'shuv o'ttiz oltmish olti, yarmi o'ttiz uch. Ikkinchi qadam — uchta ayirma, va ular yarim perimetrdan olinadi: o'ttiz uch minus o'n bir yigirma ikki, o'ttiz uch minus yigirma besh sakkiz, o'ttiz uch minus o'ttiz uch. Uchinchi qadam — to'rt sonning ko'paytmasi: o'ttiz uch karra yigirma ikki yetti yuz yigirma olti, uni sakkizga ko'paytirsak besh ming yetti yuz sakson sakkiz, uchga ko'paytirsak o'n yetti ming to'rt yuz yigirma to'rt. To'rtinchi qadam — ildiz: bir yuz o'ttiz ikki. Tartibning o'zi ham qoidani ko'rsatadi — ayirmalar yarim perimetrdan CHIQADI, ya'ni ular birinchi qadamdan oldin tura olmaydi.",
    'Верно. Первый шаг — полупериметр: одиннадцать плюс двадцать пять плюс тридцать — шестьдесят шесть, половина тридцать три. Второй шаг — три разности, и они берутся от полупериметра: тридцать три минус одиннадцать — двадцать два, тридцать три минус двадцать пять — восемь, тридцать три минус тридцать — три. Третий шаг — произведение четырёх чисел: тридцать три на двадцать два — семьсот двадцать шесть, умножить на восемь — пять тысяч семьсот восемьдесят восемь, умножить на три — семнадцать тысяч четыреста двадцать четыре. Четвёртый шаг — корень: сто тридцать два. Сам порядок показывает правило — разности ВЫХОДЯТ из полупериметра, значит раньше первого шага стоять не могут.',
    'Correct. The first step is the semi-perimeter: eleven plus twenty five plus thirty is sixty six, half is thirty three. The second step is the three differences, taken from the semi-perimeter: thirty three minus eleven is twenty two, thirty three minus twenty five is eight, thirty three minus thirty is three. The third step is the product of the four numbers: thirty three times twenty two is seven hundred twenty six, times eight is five thousand seven hundred eighty eight, times three is seventeen thousand four hundred twenty four. The fourth step is the root: one hundred thirty two. The order itself shows the rule — the differences COME FROM the semi-perimeter, so they cannot stand before the first step.'),
  wrongs: [
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Ayirmalarni yarim perimetrdan OLDIN hisoblab bo'lmaydi: har ayirma yarim perimetrdan tomonni ayirish bilan chiqadi. Yarim perimetr topilmasa, ayiriladigan narsa yo'q. Bu darsning eng ko'p uchraydigan xatosi shu joyda: yarim perimetr o'rniga perimetrning o'zi olinadi va uchala ayirma noto'g'ri chiqadi.",
      'Разности нельзя считать РАНЬШЕ полупериметра: каждая разность получается вычитанием стороны из полупериметра. Не найдя полупериметр, вычитать не из чего. Самая частая ошибка урока именно здесь: вместо полупериметра берут весь периметр, и все три разности выходят неверными.',
      'The differences cannot be computed BEFORE the semi-perimeter: each comes from subtracting a side from it. Without the semi-perimeter there is nothing to subtract from. The commonest error of the lesson sits right here: the whole perimeter is taken instead of the semi-perimeter and all three differences come out wrong.') },
    { when: (s) => s.seq[0] === 'l4' || s.pos.l4 < s.pos.l3, text: L(
      "Ildizni ko'paytmadan oldin chiqarib bo'lmaydi: nimadan ildiz chiqarilishi kerak? To'rt sonning ko'paytmasidan, va u uchinchi qadamda paydo bo'ladi.",
      'Корень нельзя извлекать раньше произведения: из чего его извлекать? Из произведения четырёх чисел, а оно появляется на третьем шаге.',
      'The root cannot be taken before the product: the root of what? Of the product of the four numbers, and that appears at the third step.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Ko'paytmani ayirmalar topilmasdan yozib bo'lmaydi: ko'paytmada to'rt son bor — yarim perimetr va uchta ayirma. Uchinchi qadam ikkinchisining natijasiga tayanadi.",
      'Произведение не записать, пока не найдены разности: в произведении четыре числа — полупериметр и три разности. Третий шаг опирается на результат второго.',
      'The product cannot be written before the differences are found: it holds four numbers — the semi-perimeter and the three differences. The third step rests on the result of the second.') },
    { when: (s) => s.seq[0] === 'l3', text: L(
      "Ko'paytmadan boshlab bo'lmaydi: ko'paytiriladigan sonlar hali yo'q. Birinchi qadam har doim yarim perimetr, chunki qolgan hamma son undan chiqadi.",
      'Начинать с произведения нельзя: перемножаемых чисел ещё нет. Первый шаг всегда полупериметр, ведь все остальные числа выходят из него.',
      'You cannot start from the product: the numbers to multiply do not exist yet. The first step is always the semi-perimeter, since every other number comes from it.') },
  ],
  wrongText: L(
    "Har qadamdan bitta savol so'rang: buni hisoblash uchun qaysi son allaqachon ma'lum bo'lishi kerak?",
    'Спроси у каждого шага: какое число должно быть уже известно, чтобы его посчитать?',
    'Ask every step: which number must already be known to compute it?'),
};

export default function D46_07(props) { return <SwapOrder data={DATA} {...props} />; }
