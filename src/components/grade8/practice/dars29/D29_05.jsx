// Dars29 · Amaliyot 05 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §11 (29-dars, 5-pozitsiya)
//
// UCH BO'SHLIQ — T1 va T3. Bankdagi tuzoqlar:
//   «nolga»  — modulni har doim nol deb hisoblash;
//   «teng»   — manfiy sonning moduli o'ziga teng degan qarash (T1 buzildi);
//   «kesma»  — З59 aynan shu so'zda yashaydi: |x| ≥ a ning yechimi kesma
//              emas, ikki nur.
// `parts` uch tilda BIR XIL shaklda: matn, uya, matn, uya, matn, uya, matn.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      "Manfiy bo'lmagan sonning moduli",
      'Модуль неотрицательного числа равен',
      'The absolute value of a non-negative number equals') },
    { slot: 0 },
    { text: L(
      "teng, manfiy sonning moduli esa unga",
      'ему самому, а модуль отрицательного числа равен ему',
      'the number itself, and the absolute value of a negative number equals its') },
    { slot: 1 },
    { text: L(
      "songa teng. |x| ≥ a tengsizlikning yechimi esa",
      '. А решением неравенства |x| ≥ a являются',
      '. And the solution of the inequality |x| ≥ a is') },
    { slot: 2 },
    { text: L("bo'ladi.", '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L("o'ziga", 'самому себе', 'itself') },
    { id: 'w2', label: L('qarama-qarshi', 'противоположному', 'opposite') },
    { id: 'w3', label: L('ikki nur', 'два луча', 'two rays') },
    { id: 'w4', label: L('nolga', 'нулю', 'zero') },
    { id: 'w5', label: L('teng', 'равному', 'equal') },
    { id: 'w6', label: L('kesma', 'отрезок', 'a segment') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning ikki qoidasi bitta gapda yozilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta: uchtasi joyiga tushadi, uchtasi esa gapga mos kelib, matematikaga mos kelmaydi.",
    'Два правила урока записаны в одном предложении, но три слова выпали. В банке шесть карточек: три встают на место, а три подходят по языку, но не по математике.',
    'The two rules of the lesson are written in one sentence, but three words fell out. The bank holds six cards: three fit, and three fit the sentence but not the mathematics.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Manfiy bo'lmagan son allaqachon noldan o'ng tomonda turadi, ya'ni uning noldan uzoqligi o'zining qiymati: beshning moduli besh. Manfiy son esa chapda turadi, va uning uzoqligi qarama-qarshi son bilan o'lchanadi: minus beshning moduli besh, ya'ni minus minus besh. Uchinchi qoida tengsizlik haqida: modul a dan katta yoki teng bo'lsa, son noldan UZOQ turishi kerak — bunday sonlar kesmaning ikki tomonida yotadi, ya'ni javob ikki nur.",
    'Верно. Неотрицательное число уже стоит справа от нуля, значит его удалённость от нуля равна ему самому: модуль пяти пять. А отрицательное стоит слева, и его удалённость измеряется противоположным числом: модуль минус пяти пять, то есть минус минус пять. Третье правило про неравенство: если модуль больше или равен a, число должно стоять ДАЛЬШЕ от нуля — такие числа лежат по обе стороны от отрезка, то есть ответ это два луча.',
    'Correct. A non-negative number already stands to the right of zero, so its distance from zero is the number itself: the absolute value of five is five. A negative number stands to the left, and its distance is measured by its opposite: the absolute value of minus five is five, that is minus minus five. The third rule is about an inequality: if the absolute value is greater than or equal to a, the number must stand FURTHER from zero — such numbers lie on both sides of the segment, so the answer is two rays.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Modul har doim nolga teng emas — nolga teng bo'lgan yagona hol bu sonning O'ZI nol bo'lgan holdir. Manfiy bo'lmagan sonning moduli o'ziga teng: uchning moduli uch, o'n ikkining moduli o'n ikki. Modul sonni yo'qotmaydi, faqat uning ishorasini olib tashlaydi.",
      'Модуль не всегда равен нулю — нулю он равен в единственном случае, когда САМО число нуль. Модуль неотрицательного числа равен ему самому: модуль трёх три, модуль двенадцати двенадцать. Модуль число не стирает, он лишь убирает знак.',
      'An absolute value is not always zero — it is zero only when the number ITSELF is zero. The absolute value of a non-negative number equals the number itself: the absolute value of three is three, of twelve is twelve. The absolute value does not erase the number, it only removes the sign.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Manfiy sonning moduli o'ziga TENG emas — u qarama-qarshi songa teng. Aks holda modul manfiy chiqardi, holbuki u noldan uzoqlik va manfiy bo'lmaydi. Tekshiring: minus beshning moduli minus besh emas, besh. Ya'ni manfiy sonda minus olib tashlanadi.",
      'Модуль отрицательного числа НЕ равен ему самому — он равен противоположному числу. Иначе модуль вышел бы отрицательным, а он есть удалённость от нуля и отрицательным не бывает. Проверь: модуль минус пяти не минус пять, а пять. То есть у отрицательного числа минус убирается.',
      'The absolute value of a negative number does NOT equal the number itself — it equals its opposite. Otherwise the absolute value would come out negative, while it is a distance from zero and never negative. Check: the absolute value of minus five is not minus five but five. So for a negative number the minus is removed.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Kesma — bu «modul KICHIK yoki teng» degan tengsizlikning yechimi, ya'ni nolga yaqin sonlar. «Modul KATTA yoki teng» esa aksincha: noldan uzoq sonlar, va ular kesmaning TASHQARISIDA yotadi — bittasi chapda, bittasi o'ngda. Shuning uchun javob ikki nur bo'ladi. Nolni tekshiring: uning moduli nol, u a dan katta emas — demak nol bu tengsizlikning yechimi emas, kesmaning o'rtasi esa aynan nol.",
      'Отрезок — это решение неравенства «модуль МЕНЬШЕ или равен», то есть числа вблизи нуля. А «модуль БОЛЬШЕ или равен» наоборот: числа вдали от нуля, и они лежат ВНЕ отрезка — один слева, другой справа. Поэтому ответ это два луча. Проверь нулём: его модуль нуль, он не больше a — значит нуль решением этого неравенства не является, а середина отрезка это как раз нуль.',
      'A segment is the solution of «absolute value LESS than or equal», the numbers near zero. «Absolute value GREATER than or equal» is the opposite: the numbers far from zero, lying OUTSIDE the segment — one part on the left, one on the right. Hence the answer is two rays. Check with zero: its absolute value is zero, which is not greater than a — so zero is not a solution of this inequality, while zero is precisely the middle of the segment.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni besh, minus besh va nol misolida tekshiring.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово на примере пяти, минус пяти и нуля.',
      'The three traps in the bank fit the language but not the mathematics. Test each word on the example of five, minus five and zero.') },
  ],
  wrongText: L(
    "Har so'zni sonlar bilan tekshiring: besh, minus besh va nol. Modul noldan uzoqlik, ya'ni u manfiy bo'lmaydi; «katta yoki teng» esa noldan uzoq sonlarni oladi.",
    'Проверяй каждое слово числами: пять, минус пять и нуль. Модуль — удалённость от нуля, значит отрицательным он не бывает; а «больше или равно» берёт числа вдали от нуля.',
    'Test every word with numbers: five, minus five and zero. The absolute value is a distance from zero, so it is never negative; and «greater than or equal» takes the numbers far from zero.'),
};

export default function D29_05(props) { return <ClozeBank data={DATA} {...props} />; }
