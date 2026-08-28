// Dars13 · Amaliyot 01 — Test · 🟢 · teg: ozgaruvchi-notogri-tanlash
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Choice.
//
// MANTIQIY savol (TIPLAR_AMALIYOT_9SINF.md §2.1): hisob emas, ish
// TARTIBI so'ralyapti. To'rtala variant to'rtta boshqa boshlanishni
// taklif qiladi, va uchtasi masalani chalkashtiradi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'ozgaruvchi-notogri-tanlash', level: '🟢',
  correct: 0, optCols: 1, optSize: 15,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Masala so'z bilan berilgan: ikki xonali son va uning raqamlari haqida. Sistema tuzish kerak.",
    'Задача дана словами: про двузначное число и его цифры. Нужно составить систему.',
    'The problem is given in words: about a two-digit number and its digits. A system must be built.'),
  ask: L(
    'Ishni nimadan boshlash kerak?',
    'С чего нужно начать работу?',
    'Where must the work begin?'),
  opts: [
    { label: L(
      "Har bir noma'lum aniq nimani anglatishini belgilashdan",
      'С определения того, что именно означает каждое неизвестное',
      'By defining exactly what each unknown means') },
    { label: L(
      "Darhol tenglama yozishdan",
      'Со записи уравнения сразу же',
      'By writing an equation straight away') },
    { label: L(
      "Javobni taxmin qilib, keyin tekshirishdan",
      'С угадывания ответа и последующей проверки',
      'By guessing the answer and then checking it') },
    { label: L(
      "Grafik chizishdan",
      'С построения графика',
      'By drawing a graph') },
  ],
  correctText: L(
    "To'g'ri. Sistema tuzishdan oldin har bir harf nimani bildirishi yozilishi kerak: iks — o'nlar raqami, igrek — birlar raqami, yoki N — sonning o'zi, s — raqamlar yig'indisi. Bu shakl uchun emas: shu yozuvsiz «son» bilan «raqamlar yig'indisi» chalkashib ketadi, va oxirida topilgan son masalaning qaysi savoliga javob berayotgani ham noaniq bo'lib qoladi.",
    'Верно. Прежде чем составлять систему, надо записать, что означает каждая буква: икс — цифра десятков, игрек — цифра единиц, или N — само число, s — сумма цифр. Это не для формы: без такой записи «число» и «сумма цифр» перепутаются, а в конце окажется неясно, на какой вопрос задачи отвечает найденное число.',
    'Correct. Before building a system you must write down what each letter stands for: x is the tens digit, y the units digit, or N the number itself and s the digit sum. This is not a formality: without it "the number" and "the digit sum" get mixed up, and at the end it stays unclear which question of the problem the number answers.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Tenglama nima haqida yoziladi, agar harflar nimani bildirishi hali aytilmagan bo'lsa? N besh s ga teng degan yozuv N bilan s aniqlanmaguncha ma'nosiz.",
      'О чём писать уравнение, если ещё не сказано, что означают буквы? Запись N равно пять s бессмысленна, пока N и s не определены.',
      'What would an equation be about if it has not been said what the letters stand for? Writing N equals five s is meaningless until N and s are defined.') },
    { when: (s) => s.picked === 2, text: L(
      "Taxmin bitta javobni topishi mumkin, lekin u boshqasi yo'qligini ko'rsatmaydi. Sistema esa hamma yechimni beradi va shartga zidini ochib tashlaydi.",
      'Угадывание может найти один ответ, но не покажет, что другого нет. Система же даёт все решения и вскрывает противоречащее условию.',
      'Guessing may find one answer but cannot show there is no other. A system gives every solution and exposes the one that contradicts the statement.') },
    { when: (s) => s.picked === 3, text: L(
      "Grafik bu masalada yordam bermaydi: raqamlar butun sonlar, ularni chizmadan aniq o'qib bo'lmaydi. Bu yerda asbob — sistema.",
      'График в этой задаче не поможет: цифры — целые числа, с чертежа их точно не считать. Инструмент здесь — система.',
      'A graph will not help here: digits are whole numbers and cannot be read off a drawing exactly. The tool here is a system.') },
  ],
  wrongText: L(
    "Sistemani yozib ko'ring va o'zingizdan so'rang: bu yerdagi harflar nimani bildiradi? Javob topilmasa, birinchi qadam tushib qolgan.",
    'Попробуй записать систему и спроси себя: что означают эти буквы? Если ответа нет, значит пропущен первый шаг.',
    'Try writing the system and ask yourself: what do these letters mean? If there is no answer, the first step was skipped.'),
};

export default function D13_01(props) { return <Choice data={DATA} {...props} />; }
