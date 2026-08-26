// Dars25 · Amaliyot 08 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §7 (25-dars, 8-pozitsiya)
//
// UCH BO'SHLIQ — UCH ADASHISH:
//   «ishorasi saqlanadi» — had ko'chirilganda ishora o'zgaradi (T3);
//   «o'zgarmaydi»        — manfiy songa bo'lishda burish unutildi (З52);
//   «kiradi»             — chegara qat'iy tengsizlikka kiritildi (З54).
// `parts` uch tilda BIR XIL shaklda: matn, uya, matn, uya, matn, uya, matn.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L(
      "Had bir qismdan ikkinchisiga ko'chirilganda uning",
      'При переносе члена из одной части в другую его знак',
      'When a term is moved from one side to the other, its sign') },
    { slot: 0 },
    { text: L(
      ". Ikkala qism manfiy songa bo'linsa, tengsizlik ishorasi",
      '. Если обе части разделить на отрицательное число, знак неравенства',
      '. If both sides are divided by a negative number, the inequality sign') },
    { slot: 1 },
    { text: L(
      ". Qat'iy tengsizlikda chegara nuqtasi yechimga",
      '. В строгом неравенстве граничная точка в решение',
      '. In a strict inequality the boundary point is') },
    { slot: 2 },
    { text: L('.', '.', 'in the solution.') },
  ],
  cards: [
    { id: 'w1', label: L("ishorasi o'zgaradi", 'меняется', 'changes') },
    { id: 'w2', label: L('buriladi', 'переворачивается', 'flips') },
    { id: 'w3', label: L('kirmaydi', 'не входит', 'not included') },
    { id: 'w4', label: L('ishorasi saqlanadi', 'сохраняется', 'is preserved') },
    { id: 'w5', label: L("o'zgarmaydi", 'не меняется', 'stays the same') },
    { id: 'w6', label: L('kiradi', 'входит', 'included') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning uch qoidasi bitta gapda yozilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta: uchtasi joyiga tushadi, uchtasi esa gapga mos kelib, matematikaga mos kelmaydi.",
    'Три правила урока записаны в одном предложении, но три слова выпали. В банке шесть карточек: три встают на место, а три подходят по языку, но не по математике.',
    'The three rules of the lesson are written in one sentence, but three words fell out. The bank holds six cards: three fit, and three fit the sentence but not the mathematics.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Had ko'chirilganda ishorasi o'zgaradi — bu aslida ikkala qismdan bir xil sonni ayirish. Manfiy songa bo'linganda ishora buriladi, bu 24-darsning qoidasi. Qat'iy tengsizlikda chegara kirmaydi: unda ikki tomon teng bo'ladi, tenglik esa qat'iy belgini qanoatlantirmaydi.",
    'Верно. При переносе члена его знак меняется — это по сути вычитание одного числа из обеих частей. При делении на отрицательное знак переворачивается, это правило урока 24. В строгом неравенстве граница не входит: в ней обе части равны, а равенство строгому знаку не годится.',
    'Correct. When a term moves its sign changes — that is in fact subtracting the same number from both sides. When dividing by a negative the sign flips, the rule of lesson 24. In a strict inequality the boundary is out: there both sides are equal, and equality does not satisfy a strict sign.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Had ko'chirilganda ishorasi SAQLANMAYDI. Nima uchun: ko'chirish — bu ikkala qismdan bir xil sonni ayirish. Masalan x qo'shuv to'rt to'rtdan katta bo'lsa, ikkala qismdan to'rtni ayiramiz va x nolga teng bo'lgan sondan katta chiqadi. To'rt chapdan yo'qoladi va o'ngda MINUS to'rt bo'lib paydo bo'ladi.",
      'При переносе члена знак НЕ СОХРАНЯЕТСЯ. Почему: перенос — это вычитание одного и того же числа из обеих частей. Например, если x плюс четыре больше четырёх, вычтем четыре из обеих частей, и выйдет, что x больше нуля. Четвёрка исчезает слева и появляется справа с МИНУСОМ.',
      'When a term is moved its sign is NOT preserved. Why: moving a term is subtracting the same number from both sides. For example, if x plus four is greater than four, subtract four from both sides and x turns out greater than zero. The four disappears on the left and reappears on the right with a MINUS.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Manfiy songa bo'linganda tengsizlik ishorasi O'ZGARADI. Bu 24-darsning qoidasi: manfiy son ikkala tomonni ham son o'qining narigi tomoniga o'tkazadi, va u yerda tartib teskari bo'ladi. Tekshiring: minus ikki x oltidan katta bo'lsa, x minus uchdan KICHIK — minus to'rtni qo'yib ko'ring, sakkiz oltidan katta chiqadi.",
      'При делении на отрицательное знак неравенства МЕНЯЕТСЯ. Это правило урока 24: отрицательное число переносит обе части на другую сторону числовой прямой, а там порядок обратный. Проверь: если минус два x больше шести, то x МЕНЬШЕ минус трёх — подставь минус четыре, выйдет восемь больше шести.',
      'When dividing by a negative the inequality sign DOES change. That is the rule of lesson 24: a negative number carries both sides to the other side of the number line, where the order is reversed. Check: if minus two x is greater than six, then x is LESS than minus three — substitute minus four and you get eight greater than six.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Qat'iy tengsizlikda chegara nuqtasi yechimga KIRMAYDI. Chegara nuqtasida ikki tomon teng bo'ladi, qat'iy belgi esa tenglikni qabul qilmaydi. Misol: ikki x minus uch beshdan katta bo'lsa, to'rtda chap tomon beshga teng chiqadi — ya'ni to'rt yechim emas. Chegara faqat belgining ostida chiziq bo'lganda kiradi.",
      'В строгом неравенстве граничная точка в решение НЕ ВХОДИТ. В граничной точке обе части равны, а строгий знак равенства не принимает. Пример: если два x минус три больше пяти, то при четырёх левая часть выйдет равной пяти — значит четыре не решение. Граница входит только тогда, когда под знаком есть черта.',
      'In a strict inequality the boundary point is NOT included. At the boundary both sides are equal, and a strict sign does not accept equality. Example: if two x minus three is greater than five, then at four the left side comes out equal to five — so four is not a solution. The boundary is included only when the sign carries a line.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni bitta misolda tekshiring: besh minus ikki x o'n birdan kichik.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово на примере: пять минус два x меньше одиннадцати.',
      'The three traps in the bank fit the language but not the mathematics. Test each word on the example: five minus two x is less than eleven.') },
  ],
  wrongText: L(
    "Har so'zni bitta misolda tekshiring: besh minus ikki x o'n birdan kichik. U yerda uchala qoida ham ketma-ket ishlatiladi.",
    'Проверяй каждое слово на одном примере: пять минус два x меньше одиннадцати. Там все три правила используются подряд.',
    'Test every word on one example: five minus two x is less than eleven. All three rules are used there one after another.'),
};

export default function D25_08(props) { return <ClozeBank data={DATA} {...props} />; }
