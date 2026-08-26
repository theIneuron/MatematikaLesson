// Dars33 · Amaliyot 07 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §5 (33-dars, 7-pozitsiya)
//
// UCH BO'SHLIQ — T1 va T2. Bankdagi tuzoqlar:
//   «noldan birgacha»  — mantissaning oralig'ini pastga surish (З66);
//   «musbat» ikkinchi marta — kichik son uchun ham musbat ko'rsatkich (З67);
//   «nol»              — ishorasiz javob, ya'ni savolni chetlab o'tish.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      "Standart ko'rinishda birinchi ko'paytuvchi",
      'В стандартном виде первый множитель — число',
      'In standard form the first factor is a number from') },
    { slot: 0 },
    { text: L(
      "bo'ladi, katta son uchun ko'rsatkich",
      ', для большого числа показатель', ', for a large number the exponent is') },
    { slot: 1 },
    { text: L(
      ", kichik son uchun esa",
      ', а для маленького', ', and for a small number it is') },
    { slot: 2 },
    { text: L('.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L("birdan o'ngacha", 'от одного до десяти', 'one to ten') },
    { id: 'w2', label: L('musbat', 'положительный', 'positive') },
    { id: 'w3', label: L('manfiy', 'отрицательный', 'negative') },
    { id: 'w4', label: L('noldan birgacha', 'от нуля до одного', 'zero to one') },
    { id: 'w5', label: L('nol', 'нулевой', 'zero') },
    { id: 'w6', label: L("o'ndan yuzgacha", 'от десяти до ста', 'ten to a hundred') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Standart ko'rinishning ta'rifi bitta gapga yig'ilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta, va uchtasi gapga tili bo'yicha bemalol tushadi.",
    'Определение стандартного вида собрано в одно предложение, но три слова выпали. В банке шесть карточек, и три из них по языку встают в предложение совершенно спокойно.',
    'The definition of standard form is gathered into one sentence, but three words fell out. The bank holds six cards, and three of them slot into the sentence perfectly well as language.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Mantissa birdan o'ngacha bo'ladi: birdan kichik bo'lsa boshida ortiqcha nol paydo bo'ladi, o'nga yetsa yana bir xona ortadi — ikkala holda ham yozuv yagona bo'lmay qoladi. Ko'rsatkich esa sonning kattaligini tashiydi: katta son uchun mantissani KATTALASHTIRISH kerak, ya'ni ko'rsatkich musbat; kichik son uchun kichraytirish kerak, ya'ni manfiy. Yana bir hol bor: son birdan o'ngacha bo'lsa hech narsa o'zgartirilmaydi va ko'rsatkich nolga teng — lekin bu na katta, na kichik son.",
    'Верно. Мантисса от одного до десяти: если она меньше единицы, в начале появляется лишний нуль, а если достигает десяти, прибавляется ещё разряд — в обоих случаях запись перестаёт быть единственной. Показатель же несёт величину числа: для большого числа мантиссу надо УВЕЛИЧИТЬ, значит показатель положителен; для маленького уменьшить, значит отрицателен. Есть и третий случай: если число от одного до десяти, менять нечего и показатель равен нулю — но это ни большое, ни маленькое число.',
    'Correct. The mantissa runs from one to ten: below one an extra zero appears at the front, and at ten another place is added — in both cases the record stops being unique. The exponent carries the size of the number: for a large number the mantissa must be made BIGGER, so the exponent is positive; for a small one it must be made smaller, so it is negative. There is a third case: if the number is between one and ten, nothing is changed and the exponent is zero — but that is neither a large nor a small number.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "«Noldan birgacha» oraliq bir xona pastga surilgan. Bunday mantissa nol butun bir necha o'ndan ko'rinishida bo'lardi, ya'ni har yozuv nol bilan boshlanardi — nol butun uch olti o'ndan karra o'nning beshinchi darajasi. Bu son to'g'ri, lekin yozuv standart emas: mantissa kamida BIRGA teng bo'lishi kerak.",
      '«От нуля до одного» — промежуток сдвинут на разряд вниз. Такая мантисса выглядела бы как нуль целых сколько-то десятых, то есть каждая запись начиналась бы с нуля: нуль целых тридцать шесть сотых на десять в пятой. Число верное, но запись не стандартная: мантисса должна быть не меньше ЕДИНИЦЫ.',
      '«Zero to one» shifts the range one place down. Such a mantissa would look like zero point something, so every record would start with a zero: zero point three six times ten to the fifth. The number is right, but the record is not standard: the mantissa must be at least ONE.') },
    { when: (s) => s.slots[2] === 'w2', text: L(
      "Kichik son uchun ko'rsatkich MANFIY bo'ladi, musbat emas. Musbat ko'rsatkich mantissani kattalashtiradi, kichik son uchun esa uni kichraytirish kerak. Tekshiring: to'rt karra o'nning uchinchi darajasi to'rt ming, to'rt karra o'nning minus uchinchi darajasi esa nol butun nol nol to'rt. Ikki yozuvda o'sha to'rtlik, lekin sonlar ming baravar farq qiladi.",
      'Для маленького числа показатель ОТРИЦАТЕЛЕН, а не положителен. Положительный показатель мантиссу увеличивает, а для маленького числа её надо уменьшить. Проверь: четыре на десять в третьей это четыре тысячи, а четыре на десять в минус третьей это нуль целых четыре тысячных. В обеих записях та же четвёрка, а числа отличаются в миллион раз.',
      'For a small number the exponent is NEGATIVE, not positive. A positive exponent enlarges the mantissa, while a small number needs it shrunk. Check: four times ten cubed is four thousand, and four times ten to the minus three is zero point zero zero four. The same four in both records, and the numbers differ a millionfold.') },
    { when: (s) => s.slots.indexOf('w5') !== -1, text: L(
      "«Nol» — bu uchinchi hol, va u gapda so'ralmagan. Ko'rsatkich nolga teng bo'lganda son birdan o'ngacha bo'ladi, ya'ni u na katta, na kichik: to'qqiz butun ikki o'ndan karra o'nning nolinchi darajasi. Gap esa aynan katta va kichik sonlar haqida.",
      '«Нулевой» — это третий случай, и в предложении о нём не спрашивают. При нулевом показателе число от одного до десяти, то есть ни большое, ни маленькое: девять целых две десятых на десять в нулевой. А речь в предложении именно о больших и маленьких числах.',
      '«Zero» is the third case, and the sentence does not ask about it. With a zero exponent the number lies between one and ten, that is, neither large nor small: nine point two times ten to the zero. The sentence speaks precisely of large and small numbers.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni ikki misolda tekshiring: to'rt ming va nol butun nol nol to'rt.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово на двух примерах: четыре тысячи и нуль целых четыре тысячных.',
      'The three traps in the bank fit the language but not the mathematics. Test each word on two examples: four thousand and zero point zero zero four.') },
  ],
  wrongText: L(
    "Mantissaning oralig'ini ikki tomondan eslang, keyin ko'rsatkichning ishorasini sonning kattaligidan chiqaring: katta son — musbat, kichik son — manfiy.",
    'Вспомни промежуток мантиссы с двух сторон, потом выведи знак показателя из величины числа: большое — положительный, маленькое — отрицательный.',
    'Recall the range of the mantissa from both sides, then derive the sign of the exponent from the size of the number: large means positive, small means negative.'),
};

export default function D33_07(props) { return <ClozeBank data={DATA} {...props} />; }
