// Dars11 · Amaliyot 03 — Test · 🟢 · teg: notogri-orniga-qoyish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Choice.
//
// MANTIQIY savol (TIPLAR_AMALIYOT_9SINF.md §2.1): hisob emas, SABAB
// so'ralyapti. To'rtala variant to'rtta boshqa tushuntirishga tegadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'notogri-orniga-qoyish', level: '🟢',
  correct: 0, optCols: 1, optSize: 15,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Birinchi tenglamadan igrek ifodalandi va o'sha ifoda O'SHA tenglamaga qaytarib qo'yildi. Hech qanday yangi natija chiqmadi.",
    'Из первого уравнения выражен игрек, и это выражение подставили обратно в ТО ЖЕ уравнение. Никакого нового результата не вышло.',
    'y was expressed from the first equation, and that expression was put back into the SAME equation. No new result came out.'),
  ask: L(
    "Nima uchun bunday qo'yish hech nima bermaydi?",
    'Почему такая подстановка ничего не даёт?',
    'Why does such a substitution give nothing?'),
  givenLabel: L('Ifoda', 'Выражение', 'Expression'),
  given: [['y = 3x − 4']],
  opts: [
    { label: L(
      "Ikkala tomonda bir xil narsa hosil bo'ladi va o'zgaruvchi yo'qoladi",
      'В обеих частях получается одно и то же, и переменная исчезает',
      'The same thing appears on both sides and the variable disappears') },
    { label: L(
      "Ifodaning o'zida xato bor",
      'В самом выражении есть ошибка',
      'The expression itself contains a mistake') },
    { label: L(
      "Bunday qo'yish qoidada taqiqlangan",
      'Такая подстановка запрещена правилом',
      'Such a substitution is forbidden by a rule') },
    { label: L(
      "Ikkinchi tenglama umuman kerak emas",
      'Второе уравнение вообще не нужно',
      'The second equation is not needed at all') },
  ],
  correctText: L(
    "To'g'ri. Igrekning o'rniga uch iks minus to'rt yozilsa, tenglama uch iks minus to'rt uch iks minus to'rtga teng bo'ladi — bu har qanday iksda bajariladigan tenglik. O'zgaruvchi ikkala tomonda ham qisqaradi, ya'ni yangi ma'lumot yo'q. Yangi ma'lumot faqat IKKINCHI tenglamada turibdi, shuning uchun ifoda o'sha yerga yuboriladi.",
    'Верно. Если вместо игрека написать три икс минус четыре, уравнение станет «три икс минус четыре равно три икс минус четыре» — это равенство выполняется при любом иксе. Переменная сокращается в обеих частях, то есть новой информации нет. Новая информация лежит только во ВТОРОМ уравнении, туда выражение и отправляют.',
    'Correct. Writing three x minus four for y turns the equation into "three x minus four equals three x minus four" — an identity true for every x. The variable cancels on both sides, so there is no new information. The new information sits only in the SECOND equation, and that is where the expression is sent.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ifoda to'g'ri: u shu tenglamaning o'zidan olingan. Muammo ifodada emas, uni QAYERGA qo'yishda.",
      'Выражение верное: оно получено из самого этого уравнения. Дело не в выражении, а в том, КУДА его подставили.',
      'The expression is right: it came from that very equation. The trouble is not the expression but WHERE it was put.') },
    { when: (s) => s.picked === 2, text: L(
      "Bu taqiq emas. Qo'yish mumkin, faqat undan hech nima chiqmaydi — natijani o'zingiz yozib ko'ring: uch iks minus to'rt uch iks minus to'rtga teng.",
      'Это не запрет. Подставить можно, только ничего не получится — выпиши результат сам: три икс минус четыре равно три икс минус четыре.',
      'This is not a prohibition. You may substitute, only nothing comes of it — write the result out: three x minus four equals three x minus four.') },
    { when: (s) => s.picked === 3, text: L(
      "Aksincha: yangi ma'lumot faqat ikkinchi tenglamada. Bittasi ifoda beradi, ikkinchisi shu ifodani SONGA aylantiradi.",
      'Наоборот: новая информация только во втором уравнении. Одно даёт выражение, другое превращает это выражение в ЧИСЛО.',
      'The opposite: the new information is only in the second equation. One gives the expression, the other turns that expression into a NUMBER.') },
  ],
  wrongText: L(
    "Igrekning o'rniga uch iks minus to'rtni yozing va hosil bo'lgan tenglikka qarang. Unda nechta har xil narsa qoldi?",
    'Напиши вместо игрека три икс минус четыре и посмотри на получившееся равенство. Сколько в нём осталось разного?',
    'Write three x minus four in place of y and look at the equality you get. How much of it is still different?'),
};

export default function D11_03(props) { return <Choice data={DATA} {...props} />; }
