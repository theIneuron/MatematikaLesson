// Dars22 · Amaliyot 10 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §4 (22-dars, 10-pozitsiya)
//
// DARSNING UCH TASDIG'I BITTA GAPDA. Bankdagi tuzoqlar:
//   «ildiz»    — qavslar oldiga ildiz yozish (З38: `a` ning o'rni bo'sh
//                qolmaydi, u yerda BOSH KOEFFITSIYENT turadi);
//   «x = t»    — belgilashning darajasini yo'qotish: o'shanda to'rtinchi
//                daraja ikkinchiga tushmaydi;
//   «musbat»   — T3 ning teskarisi.
// `parts` uch tilda BIR XIL shaklda: matn, uya, matn, uya, matn, uya, matn.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L(
      "Uchhadni ko'paytuvchilarga ajratganda qavslar oldida",
      'При разложении трёхчлена на множители перед скобками стоит',
      'When a trinomial is factored, in front of the brackets stands') },
    { slot: 0 },
    { text: L(
      'turadi. Bikvadrat tenglamada',
      '. В биквадратном уравнении делают замену',
      '. In a biquadratic equation one makes the substitution') },
    { slot: 1 },
    { text: L(
      "belgilash qilinadi. Agar t",
      '. Если t выходит',
      '. If t comes out') },
    { slot: 2 },
    { text: L(
      "chiqsa, undan haqiqiy x topilmaydi.",
      ', действительный x из него не находится.',
      ', no real x can be found from it.') },
  ],
  cards: [
    { id: 'w1', label: L('bosh koeffitsiyent', 'старший коэффициент', 'the leading coefficient') },
    { id: 'w2', label: L('x² = t', 'x² = t', 'x² = t') },
    { id: 'w3', label: L('manfiy', 'отрицательным', 'negative') },
    { id: 'w4', label: L('ildiz', 'корень', 'a root') },
    { id: 'w5', label: L('x = t', 'x = t', 'x = t') },
    { id: 'w6', label: L('musbat', 'положительным', 'positive') },
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
    "To'g'ri. Qavslar oldida bosh koeffitsiyent turadi: u birga teng bo'lsa ko'rinmaydi, birdan farqli bo'lsa yozilishi shart. Belgilash x KVADRATGA qo'yiladi — aynan shu darajani tushiradi. Manfiy t dan esa haqiqiy x topilmaydi.",
    'Верно. Перед скобками стоит старший коэффициент: если он равен единице, его не видно, а если нет — писать обязательно. Замену делают для x КВАДРАТ, именно она опускает степень. А из отрицательного t действительный x не находится.',
    'Correct. The leading coefficient stands before the brackets: if it is one it is invisible, otherwise it must be written. The substitution is made for x SQUARED — that is what lowers the degree. And a negative t yields no real x.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Qavslar oldida ildiz turmaydi — ildizlar QAVSLARNING ICHIDA turadi, va har biri minus bilan. Qavslar oldidagi joy bosh koeffitsiyentniki, ya'ni x kvadratning oldidagi son. Ikki x kvadrat minus ikki x minus to'rt uchun u ikkiga teng.",
      'Перед скобками корень не стоит — корни стоят ВНУТРИ скобок, каждый со знаком минус. Место перед скобками принадлежит старшему коэффициенту, то есть числу перед x квадрат. Для два x квадрат минус два x минус четыре он равен двум.',
      'A root does not stand in front of the brackets — the roots stand INSIDE them, each with a minus. The place in front belongs to the leading coefficient, the number before x squared. For two x squared minus two x minus four it is two.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Belgilash x kvadratga qo'yiladi, x ning o'ziga emas. Agar x t ga teng desangiz, hech narsa o'zgarmaydi: to'rtinchi daraja to'rtinchi bo'lib qolaveradi. Faqat x kvadrat t ga teng deganda x to'rtinchi daraja t kvadratga aylanadi va tenglama kvadratga tushadi.",
      'Замену делают для x квадрат, а не для самого x. Если сказать, что x равен t, ничего не изменится: четвёртая степень так и останется четвёртой. Только когда x квадрат равен t, x в четвёртой становится t квадрат и уравнение опускается до квадратного.',
      'The substitution is made for x squared, not for x itself. If you say x equals t, nothing changes: the fourth power stays the fourth. Only when x squared equals t does x to the fourth become t squared and the equation drop to a quadratic.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Teskarisi bo'lib qoldi. MUSBAT t dan x bemalol topiladi, va hatto ikkita: plyus va minus. Topilmaydigan hol — t MANFIY bo'lgan hol: x kvadrat manfiy songa teng bo'lolmaydi.",
      'Вышло наоборот. Из ПОЛОЖИТЕЛЬНОГО t x находится спокойно, и даже два: плюс и минус. Не находится тогда, когда t ОТРИЦАТЕЛЬНО: x квадрат не может равняться отрицательному числу.',
      'It came out backwards. From a POSITIVE t, x is found easily — two values in fact, plus and minus. It cannot be found when t is NEGATIVE: x squared cannot equal a negative number.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni bitta misolda tekshiring: x to'rtinchi daraja minus yigirma x kvadrat qo'shuv oltmish to'rt nolga teng.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово на примере: x в четвёртой минус двадцать x квадрат плюс шестьдесят четыре равно нулю.',
      'The three traps in the bank fit the language but not the mathematics. Test each word on the example: x to the fourth minus twenty x squared plus sixty four equals zero.') },
  ],
  wrongText: L(
    "Har so'zni misolda tekshiring. Qavslar oldiga koeffitsiyent yoziladi, belgilash x KVADRATGA qo'yiladi, va rad etiladigan t — manfiy t.",
    'Проверяй каждое слово на примере. Перед скобками пишут коэффициент, замену делают для x КВАДРАТ, а отбрасывают отрицательное t.',
    'Test every word on an example. A coefficient is written before the brackets, the substitution is made for x SQUARED, and the t that gets rejected is the negative one.'),
};

export default function D22_10(props) { return <ClozeBank data={DATA} {...props} />; }
