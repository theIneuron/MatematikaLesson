// Dars24 · Amaliyot 10 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §6 (24-dars, 10-pozitsiya)
//
// DARSNING UCH TEOREMASI BITTA GAPDA — shu jumladan O'TUVCHANLIK, u
// boshqa hech bir topshiriqda tekshirilmaydi.
//
// Bankdagi tuzoqlar:
//   «buriladi»  — musbat songa ko'paytirilganda ortiqcha burish (З53);
//   «yo'qoladi» — ko'paytirish tengsizlikni buzadi degan qarash;
//   «kichik»    — o'tuvchanlikni teskari o'qish.
// `parts` uch tilda BIR XIL shaklda: matn, uya, matn, uya, matn, uya, matn.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L(
      "Tengsizlikning ikkala qismi musbat songa ko'paytirilsa, ishora",
      'Если обе части неравенства умножить на положительное число, знак',
      'If both sides of an inequality are multiplied by a positive number, the sign') },
    { slot: 0 },
    { text: L(
      "; manfiy songa ko'paytirilsa, ishora",
      '; если умножить на отрицательное, знак меняется на',
      '; if multiplied by a negative one, the sign changes to') },
    { slot: 1 },
    { text: L(
      "o'zgaradi. a > b va b > c bo'lsa, a son c dan",
      '. Если a > b и b > c, то число a числа c',
      '. If a > b and b > c, then the number a is') },
    { slot: 2 },
    { text: L('.', '.', 'than the number c.') },
  ],
  cards: [
    { id: 'w1', label: L("o'zgarmaydi", 'не меняется', 'does not change') },
    { id: 'w2', label: L('qarama-qarshisiga', 'противоположный', 'the opposite') },
    { id: 'w3', label: L('katta', 'больше', 'greater') },
    { id: 'w4', label: L('buriladi', 'переворачивается', 'flips') },
    { id: 'w5', label: L("yo'qoladi", 'исчезает', 'disappears') },
    { id: 'w6', label: L('kichik', 'меньше', 'smaller') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning uch teoremasi bitta gapda yozilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta: uchtasi joyiga tushadi, uchtasi esa gapga mos kelib, matematikaga mos kelmaydi.",
    'Три теоремы урока записаны в одном предложении, но три слова выпали. В банке шесть карточек: три встают на место, а три подходят по языку, но не по математике.',
    'The three theorems of the lesson are written in one sentence, but three words fell out. The bank holds six cards: three fit, and three fit the sentence but not the mathematics.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Musbat songa ko'paytirish ikkala tomonni ham bir xil kattalashtiradi, ya'ni qaysi biri katta ekani o'zgarmaydi. Manfiy songa ko'paytirish esa ikkala sonni ham son o'qining narigi tomoniga o'tkazadi, va u yerda tartib teskari bo'ladi — shuning uchun ishora qarama-qarshisiga o'zgaradi. Uchinchi teorema o'tuvchanlik deyiladi: a b dan katta, b c dan katta bo'lsa, a c dan ham katta. Uni son o'qida ko'rish oson: a b dan o'ngda, b c dan o'ngda, demak a c dan ham o'ngda.",
    'Верно. Умножение на положительное увеличивает обе части одинаково, значит то, какая из них больше, не меняется. А умножение на отрицательное переносит оба числа на другую сторону числовой прямой, и там порядок обратный — поэтому знак меняется на противоположный. Третья теорема называется транзитивностью: если a больше b, а b больше c, то a больше и c. На числовой прямой это видно сразу: a правее b, b правее c, значит a правее и c.',
    'Correct. Multiplying by a positive enlarges both sides equally, so which one is greater does not change. Multiplying by a negative carries both numbers to the other side of the number line, where the order is reversed — hence the sign changes to its opposite. The third theorem is called transitivity: if a is greater than b and b is greater than c, then a is greater than c. On the number line it is plain: a lies right of b, b lies right of c, so a lies right of c as well.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Musbat songa ko'paytirilganda burish uchun sabab yo'q. Ikkala tomon ham bir xil kattalashadi va tartib saqlanadi. Tekshiring: besh uchdan katta; ikkalasini ikkiga ko'paytiring — o'n va olti, va o'n hamon katta. Burish faqat manfiy son bilan bo'ladi.",
      'При умножении на положительное переворачивать не из-за чего. Обе части увеличиваются одинаково, и порядок сохраняется. Проверь: пять больше трёх; умножь оба на два — десять и шесть, и десять по-прежнему больше. Переворот бывает только с отрицательным числом.',
      'When multiplying by a positive there is no reason to flip. Both sides grow equally and the order is kept. Check: five is greater than three; multiply both by two — ten and six, and ten is still greater. A flip happens only with a negative number.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Ko'paytirish tengsizlikni yo'qotmaydi — u faqat manfiy son bilan BURILADI. Ikki son turli edi, ko'paytirilgandan keyin ham turli qoladi, faqat qaysi biri katta ekani almashadi. Tengsizlik yo'qoladigan yagona hol — nolga ko'paytirish, va nol na musbat, na manfiy.",
      'Умножение неравенство не убирает — при отрицательном числе оно только ПЕРЕВОРАЧИВАЕТСЯ. Числа были разными и после умножения остаются разными, меняется лишь то, какое из них больше. Единственный случай, когда неравенство исчезает, — умножение на нуль, а нуль ни положителен, ни отрицателен.',
      'Multiplication does not remove an inequality — with a negative number it only FLIPS. The numbers were different and stay different after multiplying; only which one is greater changes. The single case where the inequality disappears is multiplying by zero, and zero is neither positive nor negative.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "O'tuvchanlik teskari o'qilgan. a b dan katta, b esa c dan katta bo'lsa, a c dan ham KATTA. Son o'qiga qo'yib ko'ring: c eng chapda, b o'rtada, a eng o'ngda. Sonlarda ham tekshiring: o'n, olti va ikki — o'n ikkidan katta.",
      'Транзитивность прочитана наоборот. Если a больше b, а b больше c, то a БОЛЬШЕ и c. Расставь на числовой прямой: c левее всех, b посередине, a правее всех. Проверь и числами: десять, шесть и два — десять больше двух.',
      'Transitivity was read backwards. If a is greater than b and b is greater than c, then a is GREATER than c. Place them on the number line: c furthest left, b in the middle, a furthest right. Check with numbers too: ten, six and two — ten is greater than two.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni besh va uch misolida tekshiring.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово на примере пяти и трёх.',
      'The three traps in the bank fit the language but not the mathematics. Test each word on the example of five and three.') },
  ],
  wrongText: L(
    "Har so'zni sonlar bilan tekshiring: besh va uch ni oling, ikkiga va minus ikkiga ko'paytiring. O'tuvchanlikni esa o'n, olti va ikki bilan sinab ko'ring.",
    'Проверяй каждое слово числами: возьми пять и три, умножь на два и на минус два. А транзитивность испытай на десяти, шести и двух.',
    'Test every word with numbers: take five and three, multiply by two and by minus two. And try transitivity on ten, six and two.'),
};

export default function D24_10(props) { return <ClozeBank data={DATA} {...props} />; }
