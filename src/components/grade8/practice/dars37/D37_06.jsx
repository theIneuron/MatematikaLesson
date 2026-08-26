// Dars37 · Amaliyot 06 — Tomon · 🟡 · tag: neighbour_side
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §9 (37-dars, 6-pozitsiya)
//
// T2 NI HISOBGA AYLANTIRISH. Perimetr to'rt tomonning yig'indisi, lekin
// parallelogrammda ular JUFT-JUFT teng, ya'ni perimetr ikki qo'shni
// tomon yig'indisining ikkilangani: P = 2(a + b).
//
// Asosiy xato — yigirma sakkiz, ya'ni perimetrdan bitta tomonni ayirish:
// o'shanda qarama-qarshi tomonlar umuman hisobga olinmaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'neighbour_side', level: '🟡',
  target: 10, allowNeg: false,
  given: [['P = 36'], ['AB = 8']],
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  eyebrow: L('Tomon', 'Сторона', 'Side'),
  setup: L(
    "Parallelogrammning perimetri o'ttiz olti santimetr, bir tomoni sakkiz santimetr. Unga qo'shni tomonni topish kerak. Perimetr — to'rt tomonning yig'indisi.",
    'Периметр параллелограмма тридцать шесть сантиметров, одна сторона восемь сантиметров. Надо найти соседнюю с ней сторону. Периметр — сумма четырёх сторон.',
    'The perimeter of a parallelogram is thirty-six centimetres and one side is eight centimetres. The adjacent side must be found. The perimeter is the sum of the four sides.'),
  label: L("Qo'shni tomon, sm", 'Соседняя сторона, см', 'The adjacent side, cm'),
  ask: L("Qo'shni tomon nechaga teng?", 'Чему равна соседняя сторона?', 'What is the adjacent side?'),
  correctText: L(
    "To'g'ri. Parallelogrammda qarama-qarshi tomonlar teng, ya'ni to'rt tomon ikki juftlikka ajraladi: sakkiz, sakkiz va noma'lum tomon ikki marta. Perimetr — ularning yig'indisi: ikki karra sakkiz o'n olti, o'ttiz oltidan o'n oltini ayirsak yigirma qoladi, va bu ikki teng tomonning yig'indisi. Demak har biri o'n santimetr. Boshqacha yozish ham mumkin: perimetr ikki qo'shni tomon yig'indisining ikkilangani, ya'ni o'ttiz oltini ikkiga bo'lsak o'n sakkiz chiqadi — bu bitta juft qo'shni tomon; undan sakkizni ayirsak o'n qoladi. Tekshiring: sakkiz qo'shuv o'n qo'shuv sakkiz qo'shuv o'n o'ttiz oltiga teng.",
    'Верно. В параллелограмме противоположные стороны равны, значит четыре стороны разбиваются на две пары: восемь, восемь и неизвестная сторона дважды. Периметр — их сумма: дважды восемь шестнадцать, из тридцати шести вычтем шестнадцать, останется двадцать, и это сумма двух равных сторон. Значит каждая по десять сантиметров. Можно записать иначе: периметр — удвоенная сумма двух соседних сторон, то есть тридцать шесть делить на два восемнадцать — это одна пара соседних сторон; вычтем восемь, останется десять. Проверь: восемь плюс десять плюс восемь плюс десять равно тридцати шести.',
    'Correct. In a parallelogram the opposite sides are equal, so the four sides fall into two pairs: eight, eight, and the unknown side twice. The perimeter is their sum: two times eight is sixteen, subtract sixteen from thirty-six and twenty remains, which is the sum of the two equal sides. So each is ten centimetres. It can be written another way: the perimeter is twice the sum of two adjacent sides, so thirty-six divided by two is eighteen — one pair of adjacent sides; subtract eight and ten remains. Check: eight plus ten plus eight plus ten equals thirty-six.'),
  wrongs: [
    { when: (s) => s.value === 28, text: L(
      "Perimetrdan bitta tomon ayirildi: o'ttiz olti minus sakkiz yigirma sakkiz. Lekin sakkiz santimetrli tomon figurada IKKI marta turibdi — unga qarama-qarshi tomon ham sakkizga teng. Va qolgan yigirma sakkiz ham bitta tomon emas, ikkitasining yig'indisi bo'lardi. Tekshiring: sakkiz qo'shuv yigirma sakkiz qo'shuv sakkiz qo'shuv yigirma sakkiz yetmish ikki chiqadi, o'ttiz olti emas.",
      'Из периметра вычли одну сторону: тридцать шесть минус восемь двадцать восемь. Но сторона в восемь сантиметров стоит в фигуре ДВАЖДЫ — противоположная ей тоже равна восьми. Да и оставшиеся двадцать восемь были бы не одной стороной, а суммой двух. Проверь: восемь плюс двадцать восемь плюс восемь плюс двадцать восемь даёт семьдесят два, а не тридцать шесть.',
      'One side was subtracted from the perimeter: thirty-six minus eight is twenty-eight. But the eight-centimetre side appears TWICE in the figure — the side opposite it is eight as well. And the remaining twenty-eight would be the sum of two sides, not one. Check: eight plus twenty-eight plus eight plus twenty-eight gives seventy-two, not thirty-six.') },
    { when: (s) => s.value === 18, text: L(
      "O'n sakkiz — bu perimetrning yarmi, ya'ni IKKI qo'shni tomonning yig'indisi, bitta tomon emas. Undan sakkizni ayirish kerak: o'n sakkiz minus sakkiz o'n. Tekshiring: agar qo'shni tomon o'n sakkiz bo'lganda edi, perimetr sakkiz qo'shuv o'n sakkiz ni ikkilagan — ellik ikki — bo'lardi.",
      'Восемнадцать — это половина периметра, то есть сумма ДВУХ соседних сторон, а не одна сторона. Из неё надо вычесть восемь: восемнадцать минус восемь десять. Проверь: будь соседняя сторона восемнадцать, периметр равнялся бы удвоенной сумме восьми и восемнадцати — пятидесяти двум.',
      'Eighteen is half the perimeter, that is the sum of TWO adjacent sides, not one side. Eight must be subtracted from it: eighteen minus eight is ten. Check: were the adjacent side eighteen, the perimeter would be twice the sum of eight and eighteen — fifty-two.') },
    { when: (s) => s.value === 4 || s.value === 9 || s.value === 20, text: L(
      "Hisobda xato bor. Bosqichma-bosqich yuring: sakkizli tomonlar ikkita, ularning yig'indisi o'n olti. O'ttiz oltidan o'n oltini ayiring — yigirma. Bu ikki teng tomonning yig'indisi, ya'ni har biri o'n. Javobni har doim tekshiring: to'rt tomonni qo'shsangiz perimetr chiqishi kerak.",
      'В счёте ошибка. Иди по шагам: сторон по восемь две, их сумма шестнадцать. Из тридцати шести вычти шестнадцать — двадцать. Это сумма двух равных сторон, значит каждая по десять. Всегда проверяй ответ: сложив четыре стороны, надо получить периметр.',
      'There is a slip in the arithmetic. Go step by step: there are two sides of eight, and their sum is sixteen. Subtract sixteen from thirty-six — twenty. That is the sum of the two equal sides, so each is ten. Always check the answer: adding the four sides must give the perimeter.') },
  ],
  wrongText: L(
    "Har tomon figurada IKKI marta turadi. Perimetrni ikkiga bo'ling — bu ikki qo'shni tomonning yig'indisi, — keyin ma'lum tomonni ayiring.",
    'Каждая сторона стоит в фигуре ДВАЖДЫ. Раздели периметр на два — это сумма двух соседних сторон, — потом вычти известную сторону.',
    'Every side appears TWICE in the figure. Divide the perimeter by two — that is the sum of two adjacent sides — then subtract the known side.'),
};

export default function D37_06(props) { return <TypeValue data={DATA} {...props} />; }
