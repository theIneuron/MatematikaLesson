// Dars44 · Amaliyot 04 — Kod · 🟡 · tag: code_hypotenuse
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §6 (44-dars, 4-pozitsiya)
//
// UCH UCHBURCHAK, UCH GIPOTENUZA: (3,4) -> 5, (6,8) -> 10, (5,12) -> 13.
// Bankdagi tuzoqlar: 7 va 14 — З91 (uzunliklarni qo'shish) ikki marta,
// 12 — shartdagi son. Kod O'SISH tartibida: 5, 10, 13.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_hypotenuse', level: '🟡',
  expr: ['a = 3, b = 4', '   ', 'a = 6, b = 8', '   ', 'a = 5, b = 12'], exprSize: 15,
  cards: ['5', '7', '10', '12', '13', '14'],
  answer: ['5', '10', '13'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch to'g'ri burchakli uchburchakning katetlari berilgan, kodni ularning gipotenuzalari beradi.",
    'В комнате сейф, код трёхзначный. Даны катеты трёх прямоугольных треугольников, код составляют их гипотенузы.',
    'There is a safe in the room and its code has three places. The legs of three right triangles are given; their hypotenuses make the code.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch gipotenuzani toping va kodga o'sish tartibida yozing.",
    'Найди три гипотенузы и запиши их в код по возрастанию.',
    'Find the three hypotenuses and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Har uchburchakda ikki qadam: kvadratlarni qo'shish va ildizni chiqarish. To'qqiz qo'shuv o'n olti yigirma besh, ildizi besh. O'ttiz olti qo'shuv oltmish to'rt yuz, ildizi o'n. Yigirma besh qo'shuv bir yuz qirq to'rt bir yuz oltmish to'qqiz, ildizi o'n uch. O'sish tartibida: besh, o'n, o'n uch. Uchala uchlik ham darslikda keltirilgan Pifagor uchliklari — ular ko'p masalada uchraydi va yod bo'lib qoladi, lekin yodlashdan oldin hisoblab ko'rish kerak.",
    'Верно. В каждом треугольнике два шага: сложить квадраты и извлечь корень. Девять плюс шестнадцать — двадцать пять, корень пять. Тридцать шесть плюс шестьдесят четыре — сто, корень десять. Двадцать пять плюс сто сорок четыре — сто шестьдесят девять, корень тринадцать. По возрастанию: пять, десять, тринадцать. Все три тройки приведены в учебнике как пифагоровы — они встречаются во множестве задач и запоминаются сами, но прежде чем запоминать, надо посчитать.',
    'Correct. Two steps in each triangle: add the squares and take the root. Nine plus sixteen is twenty five, the root is five. Thirty six plus sixty four is one hundred, the root is ten. Twenty five plus one hundred forty four is one hundred sixty nine, the root is thirteen. In increasing order: five, ten, thirteen. All three triples appear in the textbook as Pythagorean ones — they turn up in many problems and stick in the memory, but before memorising them you should compute them.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('7') !== -1 || s.slots.indexOf('14') !== -1, text: L(
      "Bu sonlar katetlarning YIG'INDISI: uch qo'shuv to'rt yetti, olti qo'shuv sakkiz o'n to'rt. Gipotenuza esa har doim ikki katetning yig'indisidan KICHIK bo'ladi. Tekshiring: yetti kvadrat qirq to'qqiz, kvadratlarning yig'indisi esa yigirma besh — teng emas. Qo'shiladigan narsa uzunliklar emas, KVADRATLAR.",
      'Эти числа — СУММА катетов: три плюс четыре — семь, шесть плюс восемь — четырнадцать. А гипотенуза всегда МЕНЬШЕ суммы двух катетов. Проверь: семь в квадрате — сорок девять, а сумма квадратов двадцать пять — не равно. Складывать надо не длины, а КВАДРАТЫ.',
      'These numbers are the SUM of the legs: three plus four is seven, six plus eight is fourteen. The hypotenuse is always LESS than the sum of the two legs. Check: seven squared is forty nine while the sum of the squares is twenty five — not equal. What gets added is not the lengths but the SQUARES.') },
    { when: (s) => s.slots.indexOf('12') !== -1, text: L(
      "O'n ikki — uchinchi uchburchakning kateti, ya'ni shartdagi son. Gipotenuza undan uzun bo'lishi kerak, chunki u eng katta tomon. Yigirma besh qo'shuv bir yuz qirq to'rt bir yuz oltmish to'qqiz, ildizi o'n uch.",
      'Двенадцать — катет третьего треугольника, то есть число из условия. Гипотенуза должна быть длиннее, ведь она наибольшая сторона. Двадцать пять плюс сто сорок четыре — сто шестьдесят девять, корень тринадцать.',
      'Twelve is a leg of the third triangle, a number from the condition. The hypotenuse must be longer, since it is the largest side. Twenty five plus one hundred forty four is one hundred sixty nine, the root is thirteen.') },
    { when: (s) => s.set, text: L(
      "Uch gipotenuza to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: besh, o'n, o'n uch.",
      'Три гипотенузы найдены верно, а порядок нарушен. Код пишется по возрастанию: пять, десять, тринадцать.',
      'The three hypotenuses are right, the order is not. The code goes in increasing order: five, ten, thirteen.') },
    { when: (s) => s.slots.indexOf('13') === -1, text: L(
      "Kodda o'n uch yo'q, lekin uchinchi uchburchakning gipotenuzasi aynan shu. Besh kvadrat yigirma besh, o'n ikki kvadrat bir yuz qirq to'rt, yig'indi bir yuz oltmish to'qqiz — bu o'n uchning kvadrati.",
      'В коде нет тринадцати, а гипотенуза третьего треугольника именно такая. Пять в квадрате — двадцать пять, двенадцать в квадрате — сто сорок четыре, сумма сто шестьдесят девять, это квадрат тринадцати.',
      'The code has no thirteen, yet that is the hypotenuse of the third triangle. Five squared is twenty five, twelve squared is one hundred forty four, the sum is one hundred sixty nine, which is thirteen squared.') },
  ],
  wrongText: L(
    "Katetlarning KVADRATLARINI qo'shing, keyin yig'indidan ildiz chiqaring.",
    'Сложи КВАДРАТЫ катетов, потом извлеки корень из суммы.',
    'Add the SQUARES of the legs, then take the root of the sum.'),
};

export default function D44_04(props) { return <CodeLock data={DATA} {...props} />; }
