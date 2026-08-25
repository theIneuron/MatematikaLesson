// Dars12 · Amaliyot 04 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §3 (12-dars, 4-pozitsiya)
//
// Darsning uch tasdig'i BITTA gapda: nimaga teng, qanday shartda, va nima
// uchun bunday xossa YO'Q. Bankda uch tuzoq, har biri aniq bir adashish:
//   «yig'indisiga» — З4, ildizni hadlarga bo'lish;
//   «musbat»       — nolni chiqarib tashlaydi, holbuki nol ham yaraydi
//                    (nol karra to'qqiz nol, ildizi nol);
//   «ko'paytmalar» — xossa qaysi amal uchun YO'Q ekanini almashtiradi.
//
// MUHIM: kartalar SO'Z, ya'ni `L()` ICHIDA. `parts` uch tilda BIR XIL
// shaklda: matn, uya, matn, uya, matn, uya, matn — shunda bo'shliqlarning
// tartibi UZ, RU va EN da mos tushadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      "Ko'paytmadan olingan ildiz ildizlarning",
      'Корень из произведения равен',
      'The root of a product equals the') },
    { slot: 0 },
    { text: L(
      "teng, agar ikkala ko'paytuvchi ham",
      'корней, если оба множителя',
      'of the roots, if both factors are') },
    { slot: 1 },
    { text: L(
      "bo'lsa. Bunday xossa esa",
      '. А такого свойства для',
      '. There is no such property for') },
    { slot: 2 },
    { text: L('uchun yo\'q.', 'нет.', '.') },
  ],
  cards: [
    { id: 'w1', label: L("ko'paytmasiga", 'произведению', 'product') },
    { id: 'w2', label: L('nomanfiy', 'неотрицательны', 'non-negative') },
    { id: 'w3', label: L("yig'indi", 'суммы', 'sums') },
    { id: 'w4', label: L("yig'indisiga", 'сумме', 'sum') },
    { id: 'w5', label: L('musbat', 'положительны', 'positive') },
    { id: 'w6', label: L("ko'paytma", 'произведения', 'products') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta bor: uchtasi joyiga tushadi, uchtasi esa gapga mos kelib, matematikaga mos kelmaydi.",
    'Правило урока записано, но три слова выпали. В банке шесть карточек: три встают на место, а три подходят по языку, но не по математике.',
    'The rule of the lesson is written down, but three words fell out. The bank holds six cards: three fit, and three fit the sentence but not the mathematics.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uch fakt bir gapda. Ildiz ildizlarning ko'paytmasiga teng: to'rt karra to'qqizdan ildiz olti, va ikki karra uch ham olti. Shart nomanfiylik, ya'ni nol ham yaraydi: nol karra to'qqiz nol, nolning ildizi nol, va nolning ildizi karra to'qqizning ildizi ham nol. Yig'indi uchun esa bunday xossa yo'q: to'qqiz qo'shuv o'n oltidan ildiz besh, uch qo'shuv to'rt esa yetti.",
    'Верно. Три факта в одном предложении. Корень равен произведению корней: корень из четырёх на девять — шесть, и два на три тоже шесть. Условие — неотрицательность, то есть нуль тоже годится: нуль на девять нуль, корень из нуля нуль, и корень из нуля на корень из девяти тоже нуль. А для суммы такого свойства нет: корень из девяти плюс шестнадцати пять, а три плюс четыре семь.',
    'Correct. Three facts in one sentence. The root equals the product of the roots: the root of four times nine is six, and two times three is six too. The condition is non-negativity, so zero also qualifies: zero times nine is zero, the root of zero is zero, and the root of zero times the root of nine is zero as well. For a sum there is no such property: the root of nine plus sixteen is five, while three plus four is seven.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Birinchi bo'shliqqa yig'indi tushdi. Son bilan tekshiring: to'rt karra to'qqizdan ildiz olti, ildizlarning yig'indisi esa ikki qo'shuv uch, ya'ni besh. Olti va besh teng emas. Ildizlar KO'PAYTIRILADI, chunki ildiz ostida ko'paytirish turadi.",
      'В первый пропуск попала сумма. Проверь числом: корень из четырёх на девять — шесть, а сумма корней два плюс три, то есть пять. Шесть и пять не равны. Корни ПЕРЕМНОЖАЮТСЯ, потому что под корнем умножение.',
      'A sum landed in the first gap. Check with numbers: the root of four times nine is six, while the sum of the roots is two plus three, that is five. Six and five are not equal. The roots MULTIPLY, because under the root there is a product.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "«Musbat» shartni juda tor qiladi: u nolni chiqarib tashlaydi, holbuki nolda xossa ishlaydi. Nol karra o'ttiz olti nol, nolning ildizi nol; ikkinchi tomonda nolning ildizi karra o'ttiz oltining ildizi, ya'ni nol karra olti — yana nol. Shu sababli qoidada nomanfiy, ya'ni noldan kichik emas deyiladi.",
      '«Положительны» делает условие слишком узким: оно выбрасывает нуль, а в нуле свойство работает. Нуль на тридцать шесть нуль, корень из нуля нуль; с другой стороны корень из нуля на корень из тридцати шести, то есть нуль на шесть — снова нуль. Поэтому в правиле стоит неотрицательны, то есть не меньше нуля.',
      '«Positive» makes the condition too narrow: it throws out zero, yet the property works at zero. Zero times thirty six is zero and the root of zero is zero; on the other side the root of zero times the root of thirty six is zero times six, zero again. That is why the rule says non-negative, that is, not less than zero.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Oxirgi bo'shliqqa ko'paytma tushdi, lekin gap teskari bo'lib qoldi: xossa aynan ko'paytma uchun BOR. Yo'q bo'lgani yig'indi: to'qqiz qo'shuv o'n oltidan ildiz besh, ildizlarning yig'indisi esa yetti.",
      'В последний пропуск попало произведение, и предложение перевернулось: для произведения свойство как раз ЕСТЬ. Нет его для суммы: корень из девяти плюс шестнадцати пять, а сумма корней семь.',
      'A product landed in the last gap and the sentence flipped: for a product the property does hold. It is for a sum that it fails: the root of nine plus sixteen is five, while the sum of the roots is seven.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni to'rt karra to'qqiz misolida son bilan tekshiring.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово числом на примере четыре на девять.',
      'The three traps in the bank fit the language but not the mathematics. Test each word with numbers on the example four times nine.') },
  ],
  wrongText: L(
    "Har so'zni qo'ygandan keyin gapni to'rt karra to'qqiz misolida o'qing va ikki tomonni hisoblang. Yolg'on so'z birinchi hisobda ko'rinadi.",
    'Поставив каждое слово, прочти предложение на примере четыре на девять и посчитай обе части. Ложное слово видно на первом же счёте.',
    'After placing each word, read the sentence on the example four times nine and compute both sides. A false word shows up on the first computation.'),
};

export default function D12_04(props) { return <ClozeBank data={DATA} {...props} />; }
