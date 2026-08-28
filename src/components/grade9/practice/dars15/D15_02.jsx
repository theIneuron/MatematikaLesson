// Dars15 · Amaliyot 02 — Test · 🟢 · teg: har-safar-almashadi-deb-oylash
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Choice.
//
// MANTIQIY savol (TIPLAR_AMALIYOT_9SINF.md §2.1): SABAB so'ralyapti,
// hisob emas. To'rtala variant to'rtta boshqa tushuntirishga tegadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'har-safar-almashadi-deb-oylash', level: '🟢',
  correct: 0, optCols: 1, optSize: 15,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Oraliqlar usulida oddiy ildizdan o'tganda ishora almashadi, takroriy ildizda esa saqlanadi.",
    'В методе интервалов при переходе через простой корень знак меняется, а при повторяющемся сохраняется.',
    'In the interval method the sign changes at a simple root but is kept at a repeated one.'),
  ask: L(
    "Nima uchun takroriy ildizda ishora almashmaydi?",
    'Почему в повторяющемся корне знак не меняется?',
    'Why does the sign not change at a repeated root?'),
  givenLabel: L('Takroriy ildiz', 'Повторяющийся корень', 'Repeated root'),
  given: [['(x − a)²']],
  opts: [
    { label: L(
      "Ikki marta almashish bir-birini bekor qiladi",
      'Двойная перемена знака взаимно уничтожается',
      'Two sign flips cancel each other out') },
    { label: L(
      "Takroriy ildiz umuman ildiz hisoblanmaydi",
      'Повторяющийся корень вообще не считается корнем',
      'A repeated root does not count as a root at all') },
    { label: L(
      "Kvadrat har doim musbat, shuning uchun u ishoraga ta'sir qilmaydi",
      'Квадрат всегда положителен, поэтому он на знак не влияет',
      'A square is always positive, so it has no effect on the sign') },
    { label: L(
      "Shunday kelishilgan, sababi yo'q",
      'Так договорились, причины нет',
      'It is a convention, there is no reason') },
  ],
  correctText: L(
    "To'g'ri. Ildiz ikki marta uchraganda, u ikki marta nolni kesib o'tadi: birinchi o'tish ishorani almashtiradi, ikkinchisi uni joyiga qaytaradi. Shu sababli natijada ishora o'zgarmaydi. Uchinchi variant ham qismi bilan to'g'ri — kvadrat manfiy bo'lmaydi — lekin u nima uchun ISHORA ALMASHMASLIGINI tushuntirmaydi: kvadrat nolga aylanishi mumkin, va ildiz aynan shu yerda turibdi.",
    'Верно. Когда корень встречается дважды, нуль пересекается дважды: первый переход меняет знак, второй возвращает его на место. Поэтому в итоге знак не меняется. Третий вариант отчасти верен — квадрат не бывает отрицательным — но он не объясняет, почему ЗНАК НЕ МЕНЯЕТСЯ: квадрат может обратиться в нуль, и корень стоит именно там.',
    'Correct. When a root occurs twice, zero is crossed twice: the first crossing flips the sign, the second puts it back. So in the end the sign is unchanged. The third option is partly true — a square is never negative — but it does not explain why THE SIGN DOES NOT CHANGE: a square can become zero, and the root sits exactly there.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Takroriy ildiz ham ildiz: o'sha nuqtada ifoda nolga aylanadi. Qat'iy tengsizlikda u javobdan chiqariladi, ya'ni e'tibordan qolmaydi.",
      'Повторяющийся корень — тоже корень: в этой точке выражение обращается в нуль. В строгом неравенстве его исключают из ответа, то есть без внимания он не остаётся.',
      'A repeated root is a root: the expression becomes zero there. In a strict inequality it is excluded from the answer, so it is not ignored.') },
    { when: (s) => s.picked === 2, text: L(
      "Kvadrat manfiy bo'lmaydi — bu to'g'ri, lekin u NOLGA aylanishi mumkin, va ildiz aynan shu joyda. Ishora almashmasligining sababi boshqa: ildiz ikki marta uchraydi.",
      'Квадрат не бывает отрицательным — это верно, но он может обратиться в НУЛЬ, и корень стоит именно там. Причина неизменности знака другая: корень встречается дважды.',
      'A square is never negative — true, but it can become ZERO, and the root sits exactly there. The reason the sign is kept is different: the root occurs twice.') },
    { when: (s) => s.picked === 3, text: L(
      "Bu kelishuv emas, hisobning natijasi. Ko'paytmani ikkita ildizga ajratib yozing va har biridan o'tishda ishorani kuzatib boring — ikkita almashish bir-birini bekor qiladi.",
      'Это не договорённость, а результат вычисления. Распиши произведение на два корня и следи за знаком при переходе через каждый — две перемены взаимно уничтожаются.',
      'This is not a convention but the outcome of a computation. Write the product out as two roots and follow the sign across each — the two flips cancel.') },
  ],
  wrongText: L(
    "Kvadratni ikkita bir xil qavs deb yozing. Har bir qavsdan o'tishda ishora almashadi — ikki marta almashsa, natija qanday bo'ladi?",
    'Запиши квадрат как две одинаковые скобки. При переходе через каждую скобку знак меняется — а если он меняется дважды, что получится?',
    'Write the square as two identical brackets. The sign flips at each one — and if it flips twice, what is the result?'),
};

export default function D15_02(props) { return <Choice data={DATA} {...props} />; }
