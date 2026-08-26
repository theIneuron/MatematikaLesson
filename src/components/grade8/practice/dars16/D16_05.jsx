// Dars16 · Amaliyot 05 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §4 (16-dars, 5-pozitsiya)
//
// Darsning uch ishi bitta gapda, va uchinchi bo'shliq eng qimmati: x ga
// bo'lish ildizni YO'QOTADI (З42). Bankdagi «topadi» aynan teskarisini
// aytadi va gapga mukammal tushadi.
// Qolgan ikki tuzoq: «musbat» (x kvadrat musbat songa teng bo'lganda ildiz
// BOR, ya'ni gap yolg'on bo'lib qoladi — З41) va «bir» (`ax² + bx = 0` da
// ildizlardan biri har doim nol, bir emas).
//
// MUHIM: kartalar SO'Z, ya'ni `L()` ICHIDA. `parts` uch tilda BIR XIL shaklda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      "ax² + bx = 0 tenglamada umumiy ko'paytuvchi qavsdan chiqariladi, va ildizlardan biri har doim",
      'В уравнении ax² + bx = 0 общий множитель выносится за скобку, и один из корней всегда равен',
      'In a x squared plus b x equals zero the common factor is taken out, and one of the roots is always') },
    { slot: 0 },
    { text: L(
      "bo'ladi. ax² + c = 0 tenglamada esa x² ",
      '. А в уравнении ax² + c = 0, если x² равен',
      '. In a x squared plus c equals zero, if x squared comes out') },
    { slot: 1 },
    { text: L(
      "songa teng chiqsa, ildiz yo'q. Ikki tomonni x ga bo'lish esa ildizni",
      'числу, корней нет. А деление обеих частей на x',
      'number, there are no roots. And dividing both sides by x') },
    { slot: 2 },
    { text: L('.', ' корень.', 'a root.') },
  ],
  cards: [
    { id: 'w1', label: L('nolga teng', 'нулю', 'zero') },
    { id: 'w2', label: L('manfiy', 'отрицательному', 'a negative') },
    { id: 'w3', label: L("yo'qotadi", 'теряет', 'loses') },
    { id: 'w4', label: L('birga teng', 'единице', 'one') },
    { id: 'w5', label: L('musbat', 'положительному', 'a positive') },
    { id: 'w6', label: L('topadi', 'находит', 'finds') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning uch ishi bitta gapda yozilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta: uchtasi joyiga tushadi, uchtasi esa gapga mos kelib, matematikaga mos kelmaydi.",
    'Три дела урока записаны в одном предложении, но три слова выпали. В банке шесть карточек: три встают на место, а три подходят по языку, но не по математике.',
    'The three jobs of the lesson are written in one sentence, but three words fell out. The bank holds six cards: three fit, and three fit the sentence but not the mathematics.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Umumiy ko'paytuvchi x bo'lgani uchun ko'paytuvchilardan biri x ning o'zi bo'ladi, va u nolda nolga aylanadi — demak nol har doim ildiz. Ikkinchi holda x kvadrat manfiy songa teng bo'lolmaydi: har qanday sonning kvadrati nomanfiy. Uchinchisi esa darsning eng qimmat joyi: x ga bo'lish x nolga teng bo'lgan holni tekshirmasdan chetga chiqaradi, ya'ni bitta ildiz yo'qoladi.",
    'Верно. Общий множитель — сам x, поэтому один из множителей это x, и в нуле он обращается в нуль — значит нуль всегда корень. Во втором случае x квадрат не может равняться отрицательному числу: квадрат любого числа неотрицателен. А третье — самое дорогое место урока: деление на x отбрасывает случай x равного нулю без проверки, то есть один корень теряется.',
    'Correct. The common factor is x itself, so one of the factors is x, and it vanishes at zero — meaning zero is always a root. In the second case x squared cannot equal a negative number: any number squared is non-negative. The third is the most valuable point of the lesson: dividing by x discards the case x equals zero without checking it, so one root is lost.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Bir emas, nol. Qavsdan chiqargandan keyin birinchi ko'paytuvchi x ning O'ZI bo'ladi, va u faqat nolda nolga aylanadi. Misolda tekshiring: x kvadrat minus to'rt x nolga teng tenglamada bir ildiz emas — bir minus to'rt minus uch chiqadi.",
      'Не единице, а нулю. После вынесения первый множитель — это САМ x, и он обращается в нуль только в нуле. Проверь на примере: в уравнении x квадрат минус четыре x равно нулю единица не корень — один минус четыре даёт минус три.',
      'Not one, but zero. After factoring, the first factor is x ITSELF, and it vanishes only at zero. Check on an example: in x squared minus four x equals zero, one is not a root — one minus four gives minus three.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Teskarisi bo'lib qoldi: x kvadrat MUSBAT songa teng chiqsa, ildiz bor va u ikkita. Ildiz yo'q bo'ladigan hol — x kvadrat MANFIY songa teng chiqishi, chunki har qanday sonning kvadrati nomanfiy. Tekshiring: x kvadrat to'qqizga teng bo'lsa ildizlar uch va minus uch; x kvadrat minus to'qqizga teng bo'lsa ildiz yo'q.",
      'Вышло наоборот: если x квадрат равен ПОЛОЖИТЕЛЬНОМУ числу, корни есть, и их два. Корней нет, когда x квадрат равен ОТРИЦАТЕЛЬНОМУ числу, ведь квадрат любого числа неотрицателен. Проверь: если x квадрат равно девяти, корни три и минус три; если минус девяти — корней нет.',
      'It came out backwards: if x squared equals a POSITIVE number there are roots, and there are two of them. Roots are absent when x squared equals a NEGATIVE number, since any square is non-negative. Check: x squared equals nine gives roots three and minus three; x squared equals minus nine gives none.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Bo'lish ildizni topmaydi, YO'QOTADI. x ga bo'lish uchun x nolga teng bo'lmasligi kerak, ya'ni bu qadam nol holini tekshirmasdan chetga chiqarib tashlaydi. Misol: x kvadrat minus to'rt x nolga teng tenglamani x ga bo'lsangiz x minus to'rt qoladi va faqat to'rt chiqadi, nol esa yo'qoladi — holbuki u ildiz.",
      'Деление корень не находит, а ТЕРЯЕТ. Чтобы делить на x, x не должен быть нулём, то есть этот шаг отбрасывает случай нуля без проверки. Пример: раздели x квадрат минус четыре x равно нулю на x — останется x минус четыре и выйдет только четыре, а нуль пропадёт, хотя он корень.',
      'Dividing does not find a root, it LOSES one. To divide by x, x must not be zero, so this step discards the zero case unchecked. Example: divide x squared minus four x equals zero by x and x minus four remains, giving only four, while zero disappears — although it is a root.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni x kvadrat minus to'rt x nolga teng misolida tekshiring.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово на примере x квадрат минус четыре x равно нулю.',
      'The three traps in the bank fit the language but not the mathematics. Test each word on the example x squared minus four x equals zero.') },
  ],
  wrongText: L(
    "Har so'zni misol bilan tekshiring: x kvadrat minus to'rt x nolga teng va x kvadrat minus to'qqizga teng. Ikki misol uchala bo'shliqni ham hal qiladi.",
    'Проверяй каждое слово примером: x квадрат минус четыре x равно нулю и x квадрат равно минус девяти. Двух примеров хватает на все три пропуска.',
    'Test every word with an example: x squared minus four x equals zero, and x squared equals minus nine. Two examples settle all three gaps.'),
};

export default function D16_05(props) { return <ClozeBank data={DATA} {...props} />; }
