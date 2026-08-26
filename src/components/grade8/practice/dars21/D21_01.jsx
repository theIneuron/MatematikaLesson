// Dars21 · Amaliyot 01 — Bir shart · 🟢 · tag: same_condition_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §3 (21-dars, 1-pozitsiya)
//
// T1 va T2 BIRINCHI QADAMDA. Bitta shart uch xil yozilishi mumkin: qavs
// bilan, qavs ochilgan holda va standart shaklda. Uchalasi ham BIR
// tenglama — o'quvchi buni bilib olishi kerak, aks holda o'z yozuvini
// «boshqacha» deb hisoblab, tayyor javobga moslashtira boshlaydi.
//
// Uch tuzoq uch xil o'qish:
//   x(x + 2) = 56 — «ketma-ket» ni «ketma-ket juft» deb o'qish;
//   2x + 1 = 56   — ko'paytma o'rniga yig'indi;
//   x² = 56       — ikkinchi sonni umuman yozmaslik (T1 bajarilmadi).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'same_condition_marked', level: '🟢',
  col: 160, itemSize: 15,
  items: [
    { id: 'i1', tokens: ['x(x + 1) = 56'], hit: true },
    { id: 'i2', tokens: ['x(x + 2) = 56'] },
    { id: 'i3', tokens: ['x² + x = 56'], hit: true },
    { id: 'i4', tokens: ['2x + 1 = 56'] },
    { id: 'i5', tokens: ['x² + x − 56 = 0'], hit: true },
    { id: 'i6', tokens: ['x² = 56'] },
  ],
  eyebrow: L('Bir shart', 'Одно условие', 'One condition'),
  setup: L(
    "Ikki ketma-ket natural sonning ko'paytmasi 56 ga teng, kichigi x. Oltita yozuvdan uchtasi shu shartni beradi.",
    'Произведение двух последовательных натуральных чисел равно 56, меньшее это x. Из шести записей три дают это условие.',
    'The product of two consecutive natural numbers is 56, the smaller one is x. Of six records, three give this condition.'),
  ask: L(
    'Shartga mos keladigan 3 ta yozuvni belgilang.',
    'Отметь 3 записи, которые соответствуют условию.',
    'Mark the 3 records that match the condition.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Kichik son x bo'lsa, keyingisi x qo'shuv bir, va ularning ko'paytmasi ellik oltiga teng. Qavsni ochish va hadni chapga o'tkazish tenglamani o'zgartirmaydi — uchala yozuvning ildizi bir xil: yetti va minus sakkiz.",
    'Верно. Если меньшее число x, то следующее x плюс один, и их произведение равно пятидесяти шести. Раскрытие скобки и перенос члена влево уравнение не меняют — у всех трёх записей одни корни: семь и минус восемь.',
    'Correct. If the smaller number is x, the next is x plus one, and their product is fifty six. Expanding the bracket and moving a term left do not change the equation — all three records share the roots seven and minus eight.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Bu yozuvda ikkinchi son x qo'shuv IKKI, ya'ni birinchisidan ikki ortiq. Bunday ikki son ketma-ket emas — ular orasida yana bitta son turadi. Bu «ikki ketma-ket JUFT son» degan boshqa masalaning yozuvi. Ketma-ket sonlar bir birlik bilan farq qiladi: yetti va sakkiz, o'n va o'n bir.",
      'В этой записи второе число это x плюс ДВА, то есть на два больше первого. Такие два числа не последовательные — между ними стоит ещё одно. Это запись другой задачи, про «два последовательных ЧЁТНЫХ числа». Последовательные числа отличаются на единицу: семь и восемь, десять и одиннадцать.',
      'In this record the second number is x plus TWO, that is two greater than the first. Two such numbers are not consecutive — there is another number between them. This is the record of a different problem, about «two consecutive EVEN numbers». Consecutive numbers differ by one: seven and eight, ten and eleven.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Bu yerda ikki son QO'SHILGAN: x qo'shuv x qo'shuv bir, ya'ni ikki x qo'shuv bir. Shartda esa ko'paytma turibdi. Farqni ko'rish uchun tekshirib ko'ring: yetti va sakkiz ning yig'indisi o'n besh, ko'paytmasi esa ellik olti. Shart qaysi amalni so'rayotganini birinchi bo'lib aniqlash kerak.",
      'Здесь два числа СЛОЖЕНЫ: x плюс x плюс один, то есть два x плюс один. А в условии стоит произведение. Чтобы увидеть разницу, проверь: сумма семи и восьми пятнадцать, а произведение пятьдесят шесть. Первым делом надо определить, какое действие требует условие.',
      'Here the two numbers are ADDED: x plus x plus one, that is two x plus one. But the condition speaks of a product. To see the difference, check: the sum of seven and eight is fifteen, while the product is fifty six. The first thing to settle is which operation the condition asks for.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Bu yozuvda ikkinchi son umuman yo'q: x kvadrat degani x karra x, ya'ni bir sonning o'ziga ko'paytirilgani. Masalada esa ikki HAR XIL son bor. Noma'lumni harf bilan belgilagandan keyin ikkinchi kattalikni ham shu harf orqali yozish kerak — bu yerda u yozilmagan.",
      'В этой записи второго числа нет вовсе: x квадрат это x на x, то есть одно число, умноженное само на себя. А в задаче два РАЗНЫХ числа. После того как неизвестное обозначено буквой, вторую величину тоже надо выразить через эту букву — здесь она не выражена.',
      'In this record the second number is missing altogether: x squared is x times x, one number multiplied by itself. But the problem has two DIFFERENT numbers. Once the unknown is denoted by a letter, the second quantity must also be expressed through that letter — here it is not.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "Bu yozuv chetlab o'tildi, lekin u ham o'sha tenglama: x kvadrat qo'shuv x minus ellik olti nolga teng. Uni olish uchun ellik oltini chap tomonga o'tkazish kifoya, ya'ni yangi hech narsa qo'shilmagan. Bu STANDART shakl — kvadrat tenglamani shu ko'rinishda yechish qulay.",
      'Эта запись осталась в стороне, а это то же самое уравнение: x квадрат плюс x минус пятьдесят шесть равно нулю. Чтобы его получить, достаточно перенести пятьдесят шесть в левую часть, ничего нового не добавлено. Это СТАНДАРТНЫЙ вид — в нём квадратное уравнение решать удобно.',
      'This record was left out, yet it is the same equation: x squared plus x minus fifty six equals zero. To get it, it is enough to move fifty six to the left side, nothing new was added. This is the STANDARD form — a quadratic equation is convenient to solve in it.') },
    { when: (s) => s.miss.indexOf('i3') !== -1, text: L(
      "Bu yozuv chetlab o'tildi, lekin u birinchisining qavsi ochilgani: x karra x qo'shuv bir — bu x kvadrat qo'shuv x. Qavsni ochish tenglamani o'zgartirmaydi, faqat ko'rinishini o'zgartiradi.",
      'Эта запись осталась в стороне, а это первая с раскрытой скобкой: x на скобку x плюс один это x квадрат плюс x. Раскрытие скобки уравнение не меняет, меняется только вид записи.',
      'This record was left out, yet it is the first one with the bracket expanded: x times the bracket x plus one is x squared plus x. Expanding a bracket does not change the equation, only the look of the record.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta yozuv kerak. Har biri bilan bitta ish qiling: kichik son x, kattasi x qo'shuv bir deb qo'ying va yozuv shu ikki sonning KO'PAYTMASINI ellik oltiga tenglayaptimi degan savolga javob bering.",
      'Нужно ровно три записи. С каждой делай одно: положи меньшее число x, большее x плюс один, и ответь, приравнивает ли запись ПРОИЗВЕДЕНИЕ этих двух чисел к пятидесяти шести.',
      'Exactly three records are needed. Do one thing with each: take the smaller number as x and the larger as x plus one, then answer whether the record sets the PRODUCT of these two numbers equal to fifty six.'),
    },
  ],
  wrongText: L(
    "Kichik son x, kattasi x qo'shuv bir. Shart ko'paytma haqida, yig'indi haqida emas. Qavsni ochish va hadni chapga o'tkazish tenglamani o'zgartirmaydi.",
    'Меньшее число x, большее x плюс один. Условие про произведение, а не про сумму. Раскрытие скобки и перенос члена влево уравнение не меняют.',
    'The smaller number is x, the larger is x plus one. The condition is about a product, not a sum. Expanding a bracket and moving a term to the left do not change the equation.'),
};

export default function D21_01(props) { return <MarkAll data={DATA} {...props} />; }
