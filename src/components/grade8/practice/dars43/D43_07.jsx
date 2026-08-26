// Dars43 · Amaliyot 07 — Asos · 🟡 · tag: second_base
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §5 (43-dars, 7-pozitsiya)
//
// TESKARI YO'L: o'rta chiziq va bir asos berilgan, ikkinchi asos izlanadi.
// m = (a+b)/2 dan a+b = 2m, ya'ni o'n sakkiz; undan beshni ayirsak o'n uch.
//
// Eng ko'p uchraydigan xato — to'rt, ya'ni o'rta chiziqdan asosni to'g'ridan
// to'g'ri ayirish (yarim hisobga olinmagan, З90 ning bir shakli).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'second_base', level: '🟡',
  target: 13, allowNeg: false,
  given: [['m = 9'], ['a = 5']],
  givenLabel: L("O'rta chiziq va bir asos", 'Средняя линия и одно основание', 'The midline and one base'),
  eyebrow: L('Asos', 'Основание', 'Base'),
  setup: L(
    "Trapetsiyaning o'rta chizig'i to'qqiz santimetr, bir asosi besh santimetr. O'rta chiziq ikki asosning yig'indisining yarmiga teng.",
    'Средняя линия трапеции девять сантиметров, одно основание пять сантиметров. Средняя линия равна половине суммы оснований.',
    'The midline of a trapezoid is nine centimetres and one base is five centimetres. The midline equals half the sum of the bases.'),
  label: L('Ikkinchi asos, sm', 'Второе основание, см', 'The second base, cm'),
  ask: L(
    'Ikkinchi asos nechaga teng?',
    'Чему равно второе основание?',
    'What is the second base?'),
  correctText: L(
    "To'g'ri. O'rta chiziq yig'indining yarmi bo'lsa, yig'indi o'rta chiziqning ikki barobari: to'qqiz karra ikki o'n sakkiz. Bu ikki asosning yig'indisi, undan ma'lum asosni ayiramiz: o'n sakkiz minus besh o'n uch. Tekshiring: besh qo'shuv o'n uch o'n sakkiz, uning yarmi to'qqiz — o'rta chiziq shu. Diqqat qiladigan joy: o'rta chiziq ikki asosning ORASIDA yotadi, ya'ni javob to'qqizdan katta bo'lishi kerak edi, chunki ikkinchi asos beshdan katta.",
    'Верно. Если средняя линия — половина суммы, то сумма вдвое больше средней линии: девять на два — восемнадцать. Это сумма двух оснований, вычитаем известное: восемнадцать минус пять — тринадцать. Проверь: пять плюс тринадцать — восемнадцать, половина девять, это и есть средняя линия. На что стоит обратить внимание: средняя линия лежит МЕЖДУ основаниями, значит ответ должен был выйти больше девяти, ведь второе основание больше пяти.',
    'Correct. If the midline is half the sum, the sum is twice the midline: nine times two is eighteen. That is the sum of the two bases; subtract the known one: eighteen minus five is thirteen. Check: five plus thirteen is eighteen, half of it nine, which is the midline. Worth noticing: the midline lies BETWEEN the bases, so the answer had to come out above nine, since the second base exceeds five.'),
  wrongs: [
    { when: (s) => s.value === 4, text: L(
      "To'rt — o'rta chiziqdan asos to'g'ridan-to'g'ri ayirilgan: to'qqiz minus besh. Lekin o'rta chiziq asoslardan biri emas, u ikkisining O'RTASI. Avval yig'indini tiklash kerak: to'qqizni ikkilantiring, o'n sakkiz chiqadi, keyin beshni ayiring. Tekshirish oson: agar ikkinchi asos to'rt bo'lganda, o'rta chiziq besh qo'shuv to'rt ning yarmi, ya'ni to'rt yarim bo'lardi.",
      'Четыре — основание вычтено прямо из средней линии: девять минус пять. Но средняя линия не одно из оснований, она СЕРЕДИНА между ними. Сначала надо восстановить сумму: удвой девять, выйдет восемнадцать, потом вычти пять. Проверка простая: будь второе основание четыре, средняя линия равнялась бы половине от пяти плюс четыре, то есть четырём с половиной.',
      'Four means the base was subtracted straight from the midline: nine minus five. But the midline is not one of the bases, it is the MIDDLE between them. The sum must be restored first: double nine to eighteen, then subtract five. An easy check: were the second base four, the midline would be half of five plus four, that is four and a half.') },
    { when: (s) => s.value === 14 || s.value === 18, text: L(
      "Yig'indi to'g'ri tiklangan (o'n sakkiz), lekin ma'lum asos ayirilmagan yoki noto'g'ri son ayirilgan. O'n sakkiz — bu IKKI asosning yig'indisi, javob esa bittasi: o'n sakkiz minus besh o'n uch.",
      'Сумма восстановлена верно (восемнадцать), но известное основание не вычтено или вычтено не то число. Восемнадцать — это сумма ДВУХ оснований, а ответ одно из них: восемнадцать минус пять — тринадцать.',
      'The sum was restored correctly (eighteen), but the known base was not subtracted, or the wrong number was. Eighteen is the sum of BOTH bases, while the answer is one of them: eighteen minus five is thirteen.') },
    { when: (s) => s.value === 7 || s.value === 22, text: L(
      "Bu son qo'shish yoki ikkilantirishning noto'g'ri joyda bajarilishidan chiqqan. Bosqichma-bosqich yuring: yig'indi ikki karra to'qqiz, ya'ni o'n sakkiz; ikkinchi asos o'n sakkiz minus besh. Har javobni tekshirib ko'ring: ikki asosni qo'shib yarmini olsangiz, to'qqiz chiqishi kerak.",
      'Это число получилось из сложения или удвоения не в том месте. Иди по шагам: сумма — дважды девять, то есть восемнадцать; второе основание — восемнадцать минус пять. Всегда проверяй ответ: сложив основания и взяв половину, надо получить девять.',
      'This number came from adding or doubling in the wrong place. Go step by step: the sum is twice nine, that is eighteen; the second base is eighteen minus five. Always check the answer: adding the bases and halving must give nine.') },
  ],
  wrongText: L(
    "O'rta chiziqni ikkilantiring — asoslar yig'indisi chiqadi, undan ma'lum asosni ayiring.",
    'Удвой среднюю линию — выйдет сумма оснований, вычти из неё известное основание.',
    'Double the midline — that gives the sum of the bases; subtract the known one.'),
};

export default function D43_07(props) { return <TypeValue data={DATA} {...props} />; }
