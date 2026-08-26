// Dars15 · Amaliyot 07 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §3 (15-dars, 7-pozitsiya)
//
// Darsning ta'rifi va ikki nom bir gapda. Bankdagi uch tuzoq — uch aniq
// adashish:
//   «birga teng»  — a ga birdan boshqa qiymat berilmaydi deb o'ylash; ta'rif
//                   faqat NOLNI chiqarib tashlaydi (keltirilgan tenglama
//                   19-darsda keladi, va u ALOHIDA hol);
//   «ikkinchi koeffitsiyent» — a va b ning nomlarini almashtirish;
//   «ildiz»       — c ni ildiz deb atash, ya'ni element bilan javobni
//                   aralashtirish.
//
// MUHIM: kartalar SO'Z, ya'ni `L()` ICHIDA. `parts` uch tilda BIR XIL
// shaklda: matn, uya, matn, uya, matn, uya, matn.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      "ax² + bx + c = 0 ko'rinishidagi tenglama kvadrat tenglama deyiladi, bunda a",
      'Уравнение вида ax² + bx + c = 0 называется квадратным, где a',
      'An equation of the form ax² + bx + c = 0 is called quadratic, where a is') },
    { slot: 0 },
    { text: L(
      '. Bu yerda a —',
      '. Здесь a —',
      '. Here a is') },
    { slot: 1 },
    { text: L(
      ', c esa —',
      ', а c —',
      ', and c is') },
    { slot: 2 },
    { text: L('deyiladi.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('nolga teng emas', 'не равно нулю', 'not zero') },
    { id: 'w2', label: L('bosh koeffitsiyent', 'старший коэффициент', 'the leading coefficient') },
    { id: 'w3', label: L('ozod had', 'свободный член', 'the constant term') },
    { id: 'w4', label: L('birga teng', 'равно единице', 'equal to one') },
    { id: 'w5', label: L('ikkinchi koeffitsiyent', 'второй коэффициент', 'the second coefficient') },
    { id: 'w6', label: L('ildiz', 'корень', 'a root') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning ta'rifi yozilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta: uchtasi joyiga tushadi, uchtasi esa gapga mos kelib, matematikaga mos kelmaydi.",
    'Определение урока записано, но три слова выпали. В банке шесть карточек: три встают на место, а три подходят по языку, но не по математике.',
    'The definition is written down, but three words fell out. The bank holds six cards: three fit, and three fit the sentence but not the mathematics.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Ta'rif faqat bitta qiymatni chiqarib tashlaydi — nolni: a nol bo'lsa kvadrat had yo'qoladi. Qolgan hamma son yaraydi, shu bilan birga kasr ham, irratsional son ham. a — bosh koeffitsiyent, u kvadrat hadning oldida turadi; c — ozod had, u harfsiz son. Ikkinchi koeffitsiyent esa b, va u bu gapda nomlanmagan.",
    'Верно. Определение исключает только одно значение — нуль: если a нуль, квадратное слагаемое исчезает. Все остальные числа годятся, в том числе дробные и иррациональные. a — старший коэффициент, он стоит перед квадратным слагаемым; c — свободный член, число без буквы. А второй коэффициент это b, и в этом предложении он не назван.',
    'Correct. The definition rules out exactly one value — zero: if a is zero the squared term disappears. Every other number qualifies, fractions and irrationals included. a is the leading coefficient, standing in front of the squared term; c is the constant term, the number without a letter. The second coefficient is b, and this sentence does not name it.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "«Birga teng» shartni juda toraytiradi. Uch x kvadrat minus besh x qo'shuv ikki nolga teng degan tenglamada a uchga teng, va u ham kvadrat tenglama. Ta'rif faqat nolni chiqaradi. Bosh koeffitsiyent birga teng bo'lgan tenglama alohida nomga ega, u 19-darsda keladi.",
      '«Равно единице» слишком сужает условие. В уравнении три икс квадрат минус пять икс плюс два равно нулю a равно трём, и это тоже квадратное уравнение. Определение исключает только нуль. Уравнение со старшим коэффициентом единица имеет отдельное имя, оно будет в девятнадцатом уроке.',
      '«Equal to one» narrows the condition too far. In three x squared minus five x plus two equals zero, a is three, and that is a quadratic equation too. The definition rules out zero only. An equation whose leading coefficient is one has its own name, and it comes in lesson nineteen.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Ikkinchi koeffitsiyent — b, ya'ni x ning oldidagi son. a esa kvadrat hadning oldida turadi va u bosh koeffitsiyent deyiladi. Nomlar hadning DARAJASI bo'yicha beriladi: a ikkinchi darajada, b birinchi darajada, c darajasiz.",
      'Второй коэффициент — это b, число перед иксом. А a стоит перед квадратным слагаемым и называется старшим коэффициентом. Имена даются по СТЕПЕНИ слагаемого: a при второй степени, b при первой, c без степени.',
      'The second coefficient is b, the number in front of x. a stands in front of the squared term and is called the leading coefficient. The names follow the DEGREE of the term: a at the second degree, b at the first, c with no degree.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Ildiz — bu koeffitsiyent emas, JAVOB: tenglamani to'g'ri qiladigan son. c esa yozuvning bir qismi, uni tenglamaning o'zidan o'qib olinadi. Bir tenglamada uch koeffitsiyent bor va ikkitagacha ildiz bo'lishi mumkin — bu boshqa-boshqa narsalar.",
      'Корень — это не коэффициент, а ОТВЕТ: число, обращающее уравнение в верное равенство. А c — часть записи, его читают из самого уравнения. В одном уравнении три коэффициента и до двух корней — это разные вещи.',
      'A root is not a coefficient but the ANSWER: the number that makes the equation true. c is part of the record, read off the equation itself. One equation has three coefficients and up to two roots — different things entirely.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni uch x kvadrat minus besh x qo'shuv ikki misolida tekshiring.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово на примере три икс квадрат минус пять икс плюс два.',
      'The three traps in the bank fit the language but not the mathematics. Test each word on the example three x squared minus five x plus two.') },
  ],
  wrongText: L(
    "Har so'zni qo'ygandan keyin gapni uch x kvadrat minus besh x qo'shuv ikki misolida o'qing. Yolg'on so'z birinchi misolda ko'rinadi.",
    'Поставив каждое слово, прочти предложение на примере три икс квадрат минус пять икс плюс два. Ложное слово видно на первом же примере.',
    'After placing each word, read the sentence on the example three x squared minus five x plus two. A false word shows up on the first example.'),
};

export default function D15_07(props) { return <ClozeBank data={DATA} {...props} />; }
