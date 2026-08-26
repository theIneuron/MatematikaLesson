// Dars39 · Amaliyot 10 — Kod · 🔴 · tag: code_trapezoid_angles
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §11 (39-dars, 10-pozitsiya)
//
// UCH TRAPETSIYA, UCH XIL HOL:
//   to'g'ri burchakli, ∠A = 90°  -> ∠B = 90    (З82: ular ikkita)
//   oddiy, ∠A = 65°              -> ∠B = 115   (180 gacha to'ldirish)
//   TENG YONLI, ∠A = 72°         -> ∠B = 108   (yon tomondagi burchak!)
// Uchinchisi eng qimmat: teng yonli trapetsiyada TENG burchaklar bor,
// lekin ular ASOSDA turadi — ∠A va ∠D. ∠B esa yon tomonning ikkinchi
// uchida, ya'ni u ∠A ga teng emas, balki uni 180 gacha to'ldiradi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_trapezoid_angles', level: '🔴',
  cards: ['45', '65', '72', '90', '108', '115'],
  answer: ['90', '108', '115'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch trapetsiyada BC va AD asoslar, va har birida ∠B so'ralyapti. Birinchisi to'g'ri burchakli trapetsiya, unda ∠A to'qson gradus. Ikkinchisi oddiy trapetsiya, unda ∠A oltmish besh gradus. Uchinchisi teng yonli trapetsiya, unda ∠A yetmish ikki gradus.",
    'В комнате сейф, код трёхзначный. В трёх трапециях BC и AD — основания, и в каждой спрашивается ∠B. Первая — прямоугольная трапеция, в ней ∠A девяносто градусов. Вторая — обычная трапеция, в ней ∠A шестьдесят пять градусов. Третья — равнобедренная трапеция, в ней ∠A семьдесят два градуса.',
    'There is a safe in the room and its code has three places. In three trapezoids BC and AD are the bases, and ∠B is asked for in each. The first is a right trapezoid with ∠A of ninety degrees. The second is an ordinary trapezoid with ∠A of sixty-five degrees. The third is an isosceles trapezoid with ∠A of seventy-two degrees.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch javobni kodga o'sish tartibida yozing.",
    'Запиши три ответа в код по возрастанию.',
    'Write the three answers into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Uchala savolda bitta qoida: A va B bitta yon tomonning ikki uchida, asoslar parallel — demak ∠A bilan ∠B bir yuz sakson gacha to'ldiradi. To'qson, bir yuz o'n besh, bir yuz sakkiz. Uchinchisi eng qimmat: teng yonli trapetsiyada teng burchaklar ASOSDA turadi — ∠A va ∠D. ∠B esa ∠A ga teng emas.",
    'Верно. Во всех трёх вопросах одно правило: A и B стоят в двух концах одной боковой стороны, основания параллельны — значит ∠A и ∠B дополняют друг друга до ста восьмидесяти. Девяносто, сто пятнадцать, сто восемь. Третий вопрос самый дорогой: в равнобедренной трапеции равные углы стоят ПРИ ОСНОВАНИИ — ∠A и ∠D. А ∠B углу ∠A не равен.',
    'Correct. One rule works in all three questions: A and B stand at the two ends of one leg and the bases are parallel — so ∠A and ∠B add to one hundred eighty. Ninety, one hundred fifteen, one hundred eight. The third is the costliest: in an isosceles trapezoid the equal angles stand at the BASE — ∠A and ∠D. ∠B does not equal ∠A.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('72') !== -1, text: L(
      "Yetmish ikki — bu ∠A ning O'ZI, va u teng yonli trapetsiyada ∠D ga teng, ∠B ga emas. Teng burchaklar ASOSNING ikki uchida turadi: A va D bitta asosda. B esa yon tomonning ikkinchi uchida, ya'ni u ∠A ni bir yuz sakson gacha to'ldiradi: bir yuz sakkiz. Harflarni chizmada joylashtiring — bu chalkashlikni bir zumda hal qiladi.",
      'Семьдесят два — это САМ ∠A, и в равнобедренной трапеции он равен ∠D, а не ∠B. Равные углы стоят у двух концов ОСНОВАНИЯ: A и D на одном основании. А B — на другом конце боковой стороны, значит он дополняет ∠A до ста восьмидесяти: сто восемь. Расставь буквы на чертеже — это снимает путаницу мгновенно.',
      'Seventy-two is ∠A ITSELF, and in an isosceles trapezoid it equals ∠D, not ∠B. The equal angles stand at the two ends of the BASE: A and D on one base. B is at the other end of the leg, so it completes ∠A to one hundred eighty: one hundred eight. Place the letters on a drawing — that clears the confusion at once.') },
    { when: (s) => s.slots.indexOf('65') !== -1, text: L(
      "Oltmish besh — bu ikkinchi trapetsiyaning ∠A si, javob emas. ∠B uni bir yuz sakson gacha to'ldiradi: bir yuz o'n besh. Bu trapetsiya oddiy, ya'ni unda hech qanday teng burchak yo'q — javob har doim ayirish bilan topiladi.",
      'Шестьдесят пять — это ∠A второй трапеции, а не ответ. ∠B дополняет его до ста восьмидесяти: сто пятнадцать. Эта трапеция обычная, то есть равных углов в ней нет — ответ всегда находится вычитанием.',
      'Sixty-five is the ∠A of the second trapezoid, not the answer. ∠B completes it to one hundred eighty: one hundred fifteen. This trapezoid is an ordinary one, with no equal angles at all — the answer always comes by subtraction.') },
    { when: (s) => s.slots.indexOf('45') !== -1, text: L(
      "Qirq besh bu topshiriqdagi hech bir hisobdan chiqmaydi. Har savolda bitta amal bor: bir yuz saksondan berilgan burchakni ayirish. Uchta javob to'qson, bir yuz sakkiz va bir yuz o'n besh — hammasi to'qsondan katta yoki teng, chunki berilgan burchaklarning hammasi to'qsondan kichik yoki teng.",
      'Сорок пять ни из одного вычисления этого задания не выходит. В каждом вопросе одно действие: вычесть данный угол из ста восьмидесяти. Три ответа — девяносто, сто восемь и сто пятнадцать — все не меньше девяноста, ведь все данные углы не больше девяноста.',
      'Forty-five comes from no computation in this task. Every question has one operation: subtract the given angle from one hundred eighty. The three answers — ninety, one hundred eight and one hundred fifteen — are all at least ninety, since all the given angles are at most ninety.') },
    { when: (s) => s.set, text: L(
      "Uch javob to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: to'qson, bir yuz sakkiz, bir yuz o'n besh. Savollarning tartibi bilan javoblarning tartibi mos kelmaydi.",
      'Три ответа найдены верно, а порядок нарушен. Код пишется по возрастанию: девяносто, сто восемь, сто пятнадцать. Порядок вопросов с порядком ответов не совпадает.',
      'The three answers are right, the order is not. The code goes in increasing order: ninety, one hundred eight, one hundred fifteen. The order of the questions does not match the order of the answers.') },
  ],
  wrongText: L(
    "Uch savolda ham ∠B so'ralyapti, va u ∠A ni 180 gacha to'ldiradi. Teng yonli trapetsiyada teng burchaklar asosda turadi, yon tomonda emas.",
    'Во всех трёх вопросах спрашивают ∠B, и он дополняет ∠A до 180. В равнобедренной трапеции равные углы стоят при основании, а не при боковой стороне.',
    'All three questions ask for ∠B, which completes ∠A to 180. In an isosceles trapezoid the equal angles stand at the base, not at a leg.'),
};

export default function D39_10(props) { return <CodeLock data={DATA} {...props} />; }
