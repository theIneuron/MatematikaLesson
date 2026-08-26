// Dars38 · Amaliyot 06 — Kod · 🟡 · tag: code_diagonals
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §10 (38-dars, 6-pozitsiya)
//
// UCH FIGURA, UCH XIL SAVOL, VA HAMMASI DIAGONALLAR HAQIDA:
//   to'g'ri to'rtburchak, AC = 10 -> BD  = 10   (diagonallar teng)
//   romb, AC = 12                -> AO  = 6    (teng ikkiga bo'linadi)
//   kvadrat                      -> ∠AOB = 90   (perpendikulyar)
// Uchinchi savolda hech qanday uzunlik berilmagan, chunki javob undan
// bog'liq emas — kvadratning diagonallari har doim perpendikulyar.
//
// Bankdagi `45` — З79 ning izi: kvadratda diagonal BURCHAKNI qirq besh
// gradusga bo'ladi, lekin savol diagonallar ORASIDAGI burchak haqida.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_diagonals', level: '🟡',
  cards: ['5', '6', '10', '12', '45', '90'],
  answer: ['6', '10', '90'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch savol berilgan. Birinchisi: to'g'ri to'rtburchakda AC diagonali o'nga teng, BD nechaga teng. Ikkinchisi: rombda AC diagonali o'n ikkiga teng, AO nechaga teng. Uchinchisi: kvadratda diagonallar orasidagi ∠AOB burchagi necha gradus.",
    'В комнате сейф, код трёхзначный. Даны три вопроса. Первый: в прямоугольнике диагональ AC равна десяти, чему равна BD. Второй: в ромбе диагональ AC равна двенадцати, чему равен AO. Третий: чему равен угол ∠AOB между диагоналями квадрата.',
    'There is a safe in the room and its code has three places. Three questions are given. First: in a rectangle the diagonal AC is ten, what is BD. Second: in a rhombus the diagonal AC is twelve, what is AO. Third: what is the angle ∠AOB between the diagonals of a square.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch javobni kodga o'sish tartibida yozing.",
    'Запиши три ответа в код по возрастанию.',
    'Write the three answers into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Uch savol uch xossaga tegishli. To'g'ri to'rtburchakda diagonallar TENG, ya'ni BD ham o'nga teng — hech narsa hisoblanmaydi, javob shartdan ko'chiriladi. Rombda esa diagonallar teng emas, lekin har biri kesishish nuqtasida teng ikkiga bo'linadi (bu parallelogrammdan kelgan xossa): AO — AC ning yarmi, ya'ni olti. Kvadratda diagonallar perpendikulyar, chunki kvadrat ham romb: ∠AOB to'qson gradus. O'sish tartibida: olti, o'n, to'qson. Diqqat: uchinchi savolda uzunlik umuman berilmagan, va u kerak emas — burchak kvadratning o'lchamiga bog'liq emas.",
    'Верно. Три вопроса относятся к трём свойствам. В прямоугольнике диагонали РАВНЫ, значит BD тоже равна десяти — ничего вычислять не надо, ответ переписывается из условия. В ромбе диагонали не равны, но каждая делится точкой пересечения пополам (это свойство пришло от параллелограмма): AO — половина AC, то есть шесть. В квадрате диагонали перпендикулярны, ведь квадрат тоже ромб: ∠AOB девяносто градусов. По возрастанию: шесть, десять, девяносто. Внимание: в третьем вопросе длина вообще не дана, и она не нужна — угол от размера квадрата не зависит.',
    'Correct. The three questions belong to three properties. In a rectangle the diagonals are EQUAL, so BD is ten as well — nothing to compute, the answer is copied from the condition. In a rhombus the diagonals are not equal, but each is halved by the point of intersection (a property inherited from the parallelogram): AO is half of AC, that is six. In a square the diagonals are perpendicular, since a square is a rhombus too: ∠AOB is ninety degrees. In increasing order: six, ten, ninety. Note: the third question gives no length at all, and none is needed — the angle does not depend on the size of the square.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('45') !== -1, text: L(
      "Qirq besh — bu kvadratda DIAGONAL BILAN TOMON orasidagi burchak: diagonal to'qson graduslik burchakni teng ikkiga bo'ladi. Lekin savol boshqa: u ikki DIAGONAL orasidagi ∠AOB burchagini so'rayapti, va O nuqta diagonallarning kesishishida turadi. Ular perpendikulyar, ya'ni to'qson gradus. Belgilashni o'qing — o'rtadagi harf burchakning uchini beradi.",
      'Сорок пять — это угол между ДИАГОНАЛЬЮ И СТОРОНОЙ квадрата: диагональ делит прямой угол пополам. Но вопрос другой: спрашивают угол ∠AOB между двумя ДИАГОНАЛЯМИ, а точка O стоит на их пересечении. Они перпендикулярны, значит девяносто градусов. Читай обозначение — средняя буква даёт вершину угла.',
      'Forty-five is the angle between a DIAGONAL AND A SIDE of the square: the diagonal bisects the right angle. But the question is different: it asks for the angle ∠AOB between the two DIAGONALS, and the point O lies at their crossing. They are perpendicular, so ninety degrees. Read the notation — the middle letter gives the vertex of the angle.') },
    { when: (s) => s.slots.indexOf('12') !== -1 || s.slots.indexOf('5') !== -1, text: L(
      "Ikkinchi savolda AO so'ralyapti — bu diagonalning YARMI, butun diagonal emas. O'n ikkining yarmi olti. Beshlik esa boshqa savoldan chiqadi: o'nning yarmi — lekin birinchi savolda butun diagonal so'ralgan, yarmi emas. Har savolda nima so'ralayotganini alohida o'qing: butun kesmami yoki uning bo'lagimi.",
      'Во втором вопросе спрашивают AO — это ПОЛОВИНА диагонали, а не вся диагональ. Половина двенадцати шесть. А пятёрка приходит из другого вопроса: половина десяти — но в первом вопросе спрашивают целую диагональ, а не половину. В каждом вопросе читай отдельно, что спрашивают: весь отрезок или его часть.',
      'The second question asks for AO — the HALF of the diagonal, not the whole. Half of twelve is six. And the five comes from another question: half of ten — but the first question asks for the whole diagonal, not a half. In every question read separately what is asked: the whole segment or a part of it.') },
    { when: (s) => s.slots.indexOf('10') === -1, text: L(
      "Kodda o'n yo'q, lekin birinchi savolning javobi aynan u. To'g'ri to'rtburchakda diagonallar TENG — bu uning asosiy xossasi. Demak AC o'nga teng bo'lsa, BD ham o'nga teng, va hech qanday hisob kerak emas. Rombda bunday bo'lmaydi: u yerda diagonallar har xil uzunlikda.",
      'В коде нет десятки, а ответ первого вопроса именно она. В прямоугольнике диагонали РАВНЫ — это его основное свойство. Значит если AC равна десяти, то и BD равна десяти, и никаких вычислений не нужно. В ромбе так не бывает: там диагонали разной длины.',
      'The code has no ten, yet that is the answer to the first question. In a rectangle the diagonals are EQUAL — its basic property. So if AC is ten, BD is ten too, and no computing is needed. In a rhombus it is otherwise: there the diagonals differ in length.') },
    { when: (s) => s.set, text: L(
      "Uch javob to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: olti, o'n, to'qson. Uchinchi javob GRADUS, qolgan ikkitasi UZUNLIK, lekin kod ularni oddiy son sifatida tartiblaydi.",
      'Три ответа найдены верно, а порядок нарушен. Код пишется по возрастанию: шесть, десять, девяносто. Третий ответ — ГРАДУСЫ, два других — ДЛИНЫ, но код упорядочивает их просто как числа.',
      'The three answers are right, the order is not. The code goes in increasing order: six, ten, ninety. The third answer is in DEGREES and the other two are LENGTHS, but the code orders them simply as numbers.') },
  ],
  wrongText: L(
    "Har savolda figura va so'ralayotgan narsani ajrating: to'g'ri to'rtburchakda diagonallar teng, rombda har biri teng ikkiga bo'linadi, kvadratda esa ular perpendikulyar.",
    'В каждом вопросе раздели фигуру и то, что спрашивают: в прямоугольнике диагонали равны, в ромбе каждая делится пополам, в квадрате они перпендикулярны.',
    'In every question separate the figure from what is asked: in a rectangle the diagonals are equal, in a rhombus each is halved, in a square they are perpendicular.'),
};

export default function D38_06(props) { return <CodeLock data={DATA} {...props} />; }
