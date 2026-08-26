// Dars30 · Amaliyot 04 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §12 (30-dars, 4-pozitsiya)
//
// UCH BO'SHLIQ — DARSNING UCH TASDIG'I. Bankdagi tuzoqlar:
//   «yig'indisi», «ko'paytmasi» — ta'rifning amalini almashtirish;
//   «kattalikni»                — З60: nisbiy xatolik kattalikni emas,
//                                 ANIQLIKNI taqqoslaydi. Ikki o'lchovning
//                                 kattaligi turlicha bo'lishi mumkin, lekin
//                                 aniqligi bir xil.
// `parts` uch tilda BIR XIL shaklda: matn, uya, matn, uya, matn, uya, matn.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  // `parts` uch tilda bir xil SHAKLDA (matn, uya, matn, uya, matn, uya, matn),
  // lekin uyaning atrofidagi so'zlar har tilda o'z joyida turadi: o'zbekchada
  // «ayirmasining moduli», ruschada esa gap «Модуль» so'zidan boshlanadi.
  // Shuning uchun birinchi matn bo'lagi ruschada bo'sh.
  parts: [
    { text: L(
      "Aniq va taqribiy qiymatlar ayirmasining",
      '',
      'The') },
    { slot: 0 },
    { text: L(
      "absolut xatolik deyiladi. Uning taqribiy qiymatga",
      'разности точного и приближённого значений — абсолютная погрешность. Её',
      'of the difference between exact and approximate is the absolute error. Its') },
    { slot: 1 },
    { text: L(
      "nisbiy xatolik. Nisbiy xatolik esa",
      'к приближённому значению — относительная погрешность. Она сравнивает',
      'to the approximation is the relative error. It compares') },
    { slot: 2 },
    { text: L(
      "taqqoslaydi.",
      '.',
      '.') },
  ],
  cards: [
    { id: 'w1', label: L('moduli', 'Модуль', 'absolute value') },
    { id: 'w2', label: L('nisbati', 'Отношение', 'ratio') },
    { id: 'w3', label: L('aniqlikni', 'точность', 'precision') },
    { id: 'w4', label: L("yig'indisi", 'Сумма', 'sum') },
    { id: 'w5', label: L("ko'paytmasi", 'Произведение', 'product') },
    { id: 'w6', label: L('kattalikni', 'величину', 'magnitude') },
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
    "To'g'ri. Absolut xatolik — ayirmaning moduli, ya'ni «qancha adashdik». Nisbiy xatolik esa nisbat, ya'ni «adashish kattalikka nisbatan qanchalik katta». Shuning uchun u ANIQLIKNI taqqoslaydi: bir kilogramm yuz kilogrammda kichik, bir kilogramm nonda esa juda katta.",
    'Верно. Абсолютная погрешность — модуль разности, то есть «насколько ошиблись». А относительная — отношение, то есть «насколько велика ошибка по сравнению с величиной». Поэтому она сравнивает ТОЧНОСТЬ: килограмм на сто килограммов мало, а на буханку хлеба огромно.',
    'Correct. The absolute error is the absolute value of the difference — «by how much we were off». The relative error is a ratio — «how big the error is next to the quantity». That is why it compares PRECISION: a kilogram out of a hundred is small, out of one loaf it is huge.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4' || s.slots[0] === 'w5', text: L(
      "Ta'rifda AYIRMA turadi, yig'indi yoki ko'paytma emas. Sabab oddiy: xatolik ikki qiymat qanchalik uzoq ekanini o'lchaydi, uzoqlikni esa ayirma beradi. Yig'indi ikki sonni qo'shib qo'yardi, ko'paytma esa umuman boshqa kattalik chiqarardi. Tekshiring: uch butun bir mingu to'rt yuz o'n olti va uch butun o'n to'rtning yig'indisi olti butundan katta — bu hech qanday xatolik emas.",
      'В определении стоит РАЗНОСТЬ, а не сумма и не произведение. Причина проста: погрешность измеряет, насколько далеки два значения, а удалённость даёт именно разность. Сумма сложила бы два числа, а произведение дало бы вовсе другую величину. Проверь: сумма трёх целых одной тысячи четырёхсот шестнадцати и трёх целых четырнадцати больше шести — это никакая не погрешность.',
      'The definition contains a DIFFERENCE, not a sum or a product. The reason is simple: an error measures how far apart two values are, and distance is given by a difference. A sum would add the two numbers, a product would produce an entirely different quantity. Check: the sum of three point one four one six and three point one four is over six — that is no error at all.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
        "Nisbiy xatolik KATTALIKNI emas, ANIQLIKNI taqqoslaydi. Kattaliklarni taqqoslash uchun ularning o'zini solishtirish kifoya. Misol: yuz kilogrammni bir kilogramm xatolik bilan o'lchash — bir foiz; bir kilogramm nonni o'sha xatolik bilan — yuz foiz.",
        'Относительная погрешность сравнивает не ВЕЛИЧИНУ, а ТОЧНОСТЬ. Чтобы сравнить величины, достаточно сравнить их сами. Пример: измерить сто килограммов с погрешностью в килограмм — один процент; килограмм хлеба с той же погрешностью — сто процентов.',
        'The relative error compares not MAGNITUDE but PRECISION. To compare magnitudes it is enough to compare the quantities themselves. Example: measuring a hundred kilograms to within a kilogram is one percent; a one-kilogram loaf to the same error is a hundred percent.') },
    { when: (s) => s.slots[1] !== 'w2', text: L(
      "Nisbiy xatolik NISBAT bilan olinadi: absolut xatolik taqribiy qiymatning moduliga BO'LINADI. Aynan bo'lish uni birliksiz songa aylantiradi — shuning uchun uni foizda yozish mumkin, va shuning uchun turli kattaliklarni taqqoslash mumkin bo'ladi.",
      'Относительную погрешность берут ОТНОШЕНИЕМ: абсолютную погрешность ДЕЛЯТ на модуль приближённого значения. Именно деление превращает её в число без единиц — поэтому её можно записывать в процентах и поэтому можно сравнивать разные величины.',
      'The relative error is taken as a RATIO: the absolute error is DIVIDED by the absolute value of the approximation. It is that division that turns it into a unitless number — which is why it can be written as a percentage and why different quantities become comparable.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni bitta misolda tekshiring: yuz kilogramm yuk va bir kilogramm non, ikkalasi ham bir kilogramm xatolik bilan.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово на одном примере: сто килограммов груза и килограмм хлеба, оба с погрешностью в килограмм.',
      'The three traps in the bank fit the language but not the mathematics. Test each word on one example: a hundred-kilogram load and a one-kilogram loaf, both measured to within a kilogram.') },
  ],
  wrongText: L(
    "Absolut xatolik — ayirmaning moduli, nisbiy xatolik — uning taqribiy qiymatga nisbati. Nisbiy xatolik aniqlikni taqqoslaydi, kattalikni emas.",
    'Абсолютная погрешность — модуль разности, относительная — её отношение к приближённому значению. Относительная погрешность сравнивает точность, а не величину.',
    'The absolute error is the absolute value of the difference; the relative error is its ratio to the approximation. The relative error compares precision, not magnitude.'),
};

export default function D30_04(props) { return <ClozeBank data={DATA} {...props} />; }
