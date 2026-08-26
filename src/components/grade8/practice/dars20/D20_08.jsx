// Dars20 · Amaliyot 08 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §8 (20-dars, 8-pozitsiya)
//
// DARSNING UCH TASDIG'I BITTA GAPDA. Bankdagi tuzoqlar:
//   «qo'shiladi»  — З2 ning teskarisi: taqiqlangan qiymat chiqarib
//                   tashlanadi, qo'shilmaydi;
//   «kamroq»      — T2 ning teskarisi: maxrajga ko'paytirilgan tenglama
//                   KO'PROQ ildizga ega bo'lishi mumkin, kamroq emas;
//   «asosiy»      — begona ildizni javobning bir qismi deb atash (З3).
// TERMIN: `ODZ` yozilmaydi (`ETALON_8SINF.md` §9.1) — `ruhsat etilgan
// qiymatlar` yoziladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L(
      'Yechishdan oldin maxrajni nolga aylantiradigan qiymatlar',
      'Прежде чем решать, значения, обращающие знаменатель в нуль,',
      'Before solving, the values that make the denominator zero are') },
    { slot: 0 },
    { text: L(
      ". Maxrajlarga ko'paytirilgandan keyin tenglama",
      '. После умножения на знаменатели уравнение может иметь',
      '. After multiplying by the denominators the equation may have') },
    { slot: 1 },
    { text: L(
      "ildizga ega bo'lishi mumkin. Ruhsat etilgan qiymatlardan chetga chiqqan ildiz esa",
      'корней. А корень, вышедший за допустимые значения,',
      'roots. And a root that falls outside the admissible values is called') },
    { slot: 2 },
    { text: L('deyiladi.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('chiqarib tashlanadi', 'исключаются', 'excluded') },
    { id: 'w2', label: L("ko'proq", 'больше', 'more') },
    { id: 'w3', label: L('begona', 'посторонним', 'extraneous') },
    { id: 'w4', label: L("qo'shiladi", 'добавляются', 'added') },
    { id: 'w5', label: L('kamroq', 'меньше', 'fewer') },
    { id: 'w6', label: L('asosiy', 'основным', 'principal') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning uch tasdig'i bitta gapda yozilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta: uchtasi joyiga tushadi, uchtasi esa gapga mos kelib, matematikaga mos kelmaydi.",
    'Три утверждения урока записаны в одном предложении, но три слова выпали. В банке шесть карточек: три встают на место, а три подходят по языку, но не по математике.',
    'The three statements of the lesson are written in one sentence, but three words fell out. The bank holds six cards: three fit, and three fit the sentence but not the mathematics.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Maxrajni nolga aylantiradigan qiymatlar chiqarib tashlanadi — nolga bo'lish degan amal yo'q. Maxrajlarga ko'paytirilgan tenglama esa KATTAROQ bo'ladi va ko'proq ildizga ega bo'lishi mumkin: taqiqlangan nuqta yozuvdan yo'qoladi va u yerda paydo bo'lgan ildizni hech narsa to'xtatmaydi. Shunday ildiz begona deyiladi va javobga kirmaydi.",
    'Верно. Значения, обращающие знаменатель в нуль, исключаются — деления на нуль не существует. А уравнение после умножения на знаменатели становится ШИРЕ и может иметь больше корней: запрещённая точка исчезает из записи, и появившийся там корень уже ничем не остановлен. Такой корень называется посторонним и в ответ не входит.',
    'Correct. The values that make the denominator zero are excluded — division by zero is not an operation. And the equation after multiplying by the denominators becomes WIDER and may have more roots: the banned point disappears from the record, and a root appearing there is no longer stopped by anything. Such a root is called extraneous and does not enter the answer.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Taqiqlangan qiymat qo'shilmaydi, CHIQARIB TASHLANADI. Maxraj nolga aylanadigan joyda kasrning qiymati yo'q, ya'ni u yerda tenglamani tekshirib ham bo'lmaydi. Misol: x minus to'rt maxrajida to'rt chiqarib tashlanadi.",
      'Запрещённое значение не добавляется, а ИСКЛЮЧАЕТСЯ. Там, где знаменатель обращается в нуль, у дроби нет значения, то есть уравнение там даже не проверить. Пример: при знаменателе x минус четыре исключается четыре.',
      'A banned value is not added but EXCLUDED. Where the denominator vanishes the fraction has no value, so the equation cannot even be tested there. Example: with the denominator x minus four, four is excluded.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Teskarisi bo'lib qoldi: ko'paytirilgan tenglama KO'PROQ ildizga ega bo'lishi mumkin, kamroq emas. Misol: kasr ko'rinishidagi tenglamada bitta ildiz bo'lsa, maxrajga ko'paytirilgandan keyin ikkita chiqishi mumkin — ortiqchasi begona. Ildiz KAMAYIB qolishi esa boshqa xatoning natijasi.",
      'Вышло наоборот: умноженное уравнение может иметь БОЛЬШЕ корней, а не меньше. Пример: если у дробного уравнения один корень, после умножения на знаменатель их может стать два — лишний посторонний. А уменьшение числа корней — результат другой ошибки.',
      'It came out backwards: the multiplied equation may have MORE roots, not fewer. Example: if a fractional equation has one root, after multiplying by the denominator there may be two — the extra one extraneous. Losing roots is the result of a different mistake.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "«Asosiy» ildiz degan tushuncha yo'q, va bunday ildiz javobning bir qismi ham emas. Ruhsat etilgan qiymatlardan chetdagi ildiz BEGONA deyiladi va rad etiladi: uni asl tenglamaga qo'yib bo'lmaydi, chunki maxraj nolga aylanadi.",
      'Понятия «основной» корень нет, и частью ответа такой корень не является. Корень, вышедший за допустимые значения, называется ПОСТОРОННИМ и отбрасывается: его нельзя подставить в исходное уравнение, ведь знаменатель обратится в нуль.',
      'There is no such thing as a «principal» root, and such a root is not part of the answer. A root outside the admissible values is called EXTRANEOUS and is rejected: it cannot be substituted into the original equation, since the denominator would vanish.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni x kvadrat minus o'n olti bo'lingan x minus to'rt misolida tekshiring.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово на примере x квадрат минус шестнадцать делить на x минус четыре.',
      'The three traps in the bank fit the language but not the mathematics. Test each word on the example x squared minus sixteen over x minus four.') },
  ],
  wrongText: L(
    "Har so'zni bitta misolda tekshiring: x kvadrat minus o'n olti bo'lingan x minus to'rt nolga teng. U yerda ikki ildiz chiqadi, bittasi esa rad etiladi.",
    'Проверяй каждое слово на одном примере: x квадрат минус шестнадцать делить на x минус четыре равно нулю. Там выходят два корня, и один отбрасывается.',
    'Test every word on one example: x squared minus sixteen over x minus four equals zero. Two roots come out and one is rejected.'),
};

export default function D20_08(props) { return <ClozeBank data={DATA} {...props} />; }
