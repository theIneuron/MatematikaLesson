// Dars09 · Amaliyot 04 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §7 (9-dars, 4-pozitsiya)
//
// Darsning uch tasdig'i bitta gapda: ta'rif, manfiy ildiz ostining taqiqi va
// butun bo'lmagan ildizning chegaralari. Bankda ikki tuzoq:
//   «musbat»  — nolni chetlab o'tadi (√0 = 0);
//   «kasr»    — chegaralar BUTUN sonlar orasida, kasrlar orasida emas.
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
      'Kvadrat ildiz — kvadrati ildiz ostidagi songa teng',
      'Квадратный корень это',
      'A square root is a') },
    { slot: 0 },
    { text: L(
      'son. Kvadrat ildiz',
      'число, квадрат которого равен подкоренному. Из',
      'number whose square equals the radicand. A square root cannot be taken of a') },
    { slot: 1 },
    { text: L(
      "sondan olinmaydi. Butun chiqmasa, ildiz ikki",
      'числа квадратный корень не извлекается. Если он не целый, корень лежит между двумя',
      'number. When it is not whole, the root lies between two') },
    { slot: 2 },
    { text: L('son orasida turadi.', 'числами.', 'numbers.') },
  ],
  cards: [
    { id: 'w1', label: L('nomanfiy', 'неотрицательное', 'non-negative') },
    { id: 'w2', label: L('manfiy', 'отрицательного', 'negative') },
    { id: 'w3', label: L('butun', 'целыми', 'whole') },
    { id: 'w4', label: L('musbat', 'положительное', 'positive') },
    { id: 'w5', label: L('kasr', 'дробными', 'fractional') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying.",
    'Правило урока записано, но три слова выпали. Поставь их из карточек снизу.',
    'The rule of the lesson is written down, but three words fell out. Put them back from the cards below.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uch fakt bir gapda. Ildiz nomanfiy son: nol ham bo'lishi mumkin, chunki nol karra nol nolga teng. Manfiy sondan ildiz olinmaydi, chunki hech bir sonning kvadrati manfiy emas. Butun chiqmaganda esa ildiz ikki butun son orasida qoladi: masalan o'ttiz beshdan ildiz besh bilan olti orasida, chunki yigirma besh o'ttiz beshdan kichik, o'ttiz olti esa katta.",
    'Верно. Три факта в одном предложении. Корень неотрицателен: он может быть и нулём, ведь нуль на нуль нуль. Из отрицательного числа корень не извлекается, потому что квадрат ни одного числа не отрицателен. А когда корень не целый, он лежит между двумя целыми: например корень из тридцати пяти между пятью и шестью, ведь двадцать пять меньше тридцати пяти, а тридцать шесть больше.',
    'Correct. Three facts in one sentence. A root is non-negative: it may be zero, since zero times zero is zero. A root cannot be taken of a negative number, because no number has a negative square. And when a root is not whole it lies between two integers: the root of thirty five lies between five and six, since twenty five is less than thirty five and thirty six is more.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Musbat so'zi nolni chetlab o'tadi. Noldan ildiz esa bor va nolga teng: nol karra nol nol. Shuning uchun ta'rifda nomanfiy deyiladi.",
      'Слово положительное отбрасывает нуль. А корень из нуля есть и равен нулю: нуль на нуль нуль. Поэтому в определении сказано неотрицательное.',
      'The word positive throws away zero. Yet zero has a root and it equals zero: zero times zero is zero. That is why the definition says non-negative.') },
    { when: (s) => s.slots[2] === 'w5', text: L(
      "Chegaralar BUTUN sonlar orasida izlanadi: ular kvadratlar jadvalidan olinadi. O'ttiz beshdan ildizni kasrlar orasiga qo'yish hech narsa aytmaydi, besh bilan olti orasi esa aniq javob beradi.",
      'Границы ищутся между ЦЕЛЫМИ числами: их берут из таблицы квадратов. Поставить корень из тридцати пяти между дробями ничего не скажет, а между пятью и шестью — точный ответ.',
      'The bounds are sought between WHOLE numbers: they come from the table of squares. Putting the root of thirty five between fractions says nothing, while between five and six is a definite answer.') },
    { when: (s) => s.slots[1] === 'w1' || s.slots[1] === 'w4', text: L(
      "Ikkinchi bo'shliqda TAQIQ haqida gap boradi: ildiz olinmaydigan sonlar qanday? Ularning ildiz osti manfiy, chunki hech bir kvadrat manfiy chiqmaydi.",
      'Во второй клетке речь о ЗАПРЕТЕ: из каких чисел корень не извлекается? У них подкоренное отрицательно, ведь квадрат не бывает отрицательным.',
      'The second gap is about the BAN: from which numbers can a root not be taken? Those whose radicand is negative, since no square is ever negative.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1, text: L(
      "Bankda ikki tuzoq bor. Har so'zni son bilan tekshiring: noldan ildiz bormi va chegaralar qanday sonlar orasida izlanadi.",
      'В банке две ловушки. Проверь каждое слово числом: есть ли корень из нуля и между какими числами ищутся границы.',
      'The bank holds two traps. Test each word with numbers: does zero have a root, and between which numbers are the bounds sought.') },
  ],
  wrongText: L(
    "Qoidani ikki misolda tekshiring: noldan ildiz va o'ttiz beshdan ildiz. Birinchisi ta'rifni, ikkinchisi chegaralarni ko'rsatadi.",
    'Проверь правило на двух примерах: корень из нуля и корень из тридцати пяти. Первый показывает определение, второй границы.',
    'Test the rule on two examples: the root of zero and the root of thirty five. The first shows the definition, the second the bounds.'),
};

export default function D09_04(props) { return <ClozeBank data={DATA} {...props} />; }
