// Dars19 · Amaliyot 04 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §7 (19-dars, 4-pozitsiya)
//
// UCH BO'SHLIQ — TA'RIF VA IKKI FORMULA. Bankdagi tuzoqlar:
//   «nolga teng»  — keltirilgan tenglamada bosh koeffitsiyent BIRGA teng;
//                   nol bo'lsa tenglama kvadrat ham bo'lmaydi (З38, 15-dars);
//   «p»           — З45: yig'indi p ning O'ZIGA teng deb o'ylash;
//   «minus q»     — ko'paytmaga ortiqcha minus qo'shish.
// Ikki tuzoq ikki formulaga tegishli, va ular BIR-BIRINING teskarisi: yig'indi
// ishorani almashtiradi, ko'paytma esa yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      'Keltirilgan tenglamada bosh koeffitsiyent',
      'В приведённом уравнении старший коэффициент',
      'In a reduced equation the leading coefficient is') },
    { slot: 0 },
    { text: L(
      ". Uning ildizlari uchun yig'indi",
      '. Для его корней сумма равна',
      '. For its roots the sum equals') },
    { slot: 1 },
    { text: L(
      "ga, ko'paytma esa",
      ', а произведение равно',
      ', and the product equals') },
    { slot: 2 },
    { text: L('ga teng.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('birga teng', 'равен единице', 'one') },
    { id: 'w2', label: L('minus p', 'минус p', 'minus p') },
    { id: 'w3', label: L('q', 'q', 'q') },
    { id: 'w4', label: L('nolga teng', 'равен нулю', 'zero') },
    { id: 'w5', label: L('p', 'p', 'p') },
    { id: 'w6', label: L('minus q', 'минус q', 'minus q') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Teoremaning ta'rifi va ikki formulasi bitta gapda. Bankda oltita karta: uchtasi joyiga tushadi, uchtasi esa gapga mos kelib, matematikaga mos kelmaydi.",
    'Определение теоремы и две её формулы в одном предложении. В банке шесть карточек: три встают на место, а три подходят по языку, но не по математике.',
    'The definition and the two formulas of the theorem in one sentence. The bank holds six cards: three fit, and three fit the sentence but not the mathematics.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Keltirilgan tenglamada bosh koeffitsiyent birga teng — shu sababli formulalar shunday qisqa. Yig'indi minus p ga teng: ikkinchi koeffitsiyent ishorasini almashtiradi. Ko'paytma esa q ning o'ziga teng, ishora saqlanadi. Misolda tekshiring: x kvadrat minus besh x qo'shuv olti, ildizlari ikki va uch — yig'indi besh, ya'ni minus p; ko'paytma olti, ya'ni q.",
    'Верно. В приведённом уравнении старший коэффициент равен единице — потому формулы такие короткие. Сумма равна минус p: второй коэффициент меняет знак. А произведение равно самому q, знак сохраняется. Проверь на примере: x квадрат минус пять x плюс шесть, корни два и три — сумма пять, то есть минус p; произведение шесть, то есть q.',
    'Correct. In a reduced equation the leading coefficient is one — which is why the formulas are so short. The sum equals minus p: the second coefficient flips its sign. The product equals q itself, keeping its sign. Check on an example: x squared minus five x plus six has roots two and three — the sum is five, that is minus p; the product is six, that is q.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Bosh koeffitsiyent nolga teng bo'lsa, tenglama umuman kvadrat bo'lmaydi — 15-darsda ko'rilgan. Keltirilgan tenglamada u BIRGA teng, va shu sababli formulalarda a ko'rinmaydi.",
      'Если старший коэффициент равен нулю, уравнение вообще не квадратное — это было в пятнадцатом уроке. В приведённом он равен ЕДИНИЦЕ, и потому в формулах a не появляется.',
      'If the leading coefficient were zero the equation would not be quadratic at all — as seen in lesson fifteen. In a reduced equation it is ONE, which is why a never appears in the formulas.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Yig'indi p ning O'ZIGA emas, MINUS p ga teng. Misolda tekshiring: x kvadrat minus besh x qo'shuv olti tenglamasida p minus besh, ildizlari esa ikki va uch — yig'indi arti besh. Agar yig'indi p ga teng bo'lsa, minus besh chiqardi, bu esa yolg'on.",
      'Сумма равна не САМОМУ p, а МИНУС p. Проверь на примере: в уравнении x квадрат минус пять x плюс шесть p равно минус пяти, а корни два и три — сумма плюс пять. Если бы сумма равнялась p, вышло бы минус пять, а это ложь.',
      'The sum equals not p ITSELF but MINUS p. Check on an example: in x squared minus five x plus six, p is minus five while the roots are two and three — the sum is plus five. If the sum equalled p it would be minus five, which is false.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Ko'paytmaga minus qo'shish kerak emas: u q ning O'ZIGA teng. Misolda tekshiring: x kvadrat minus besh x qo'shuv olti da q arti olti, ildizlari ikki va uch, ko'paytmasi arti olti. Ishorani faqat yig'indi almashtiradi.",
      'К произведению минус добавлять не надо: оно равно САМОМУ q. Проверь на примере: в x квадрат минус пять x плюс шесть q равно плюс шести, корни два и три, произведение плюс шесть. Знак меняет только сумма.',
      'The product needs no added minus: it equals q ITSELF. Check on an example: in x squared minus five x plus six, q is plus six, the roots are two and three and their product is plus six. Only the sum flips the sign.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni x kvadrat minus besh x qo'shuv olti misolida tekshiring: ildizlari ikki va uch.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово на примере x квадрат минус пять x плюс шесть: его корни два и три.',
      'The three traps in the bank fit the language but not the mathematics. Test each word on x squared minus five x plus six: its roots are two and three.') },
  ],
  wrongText: L(
    "Har so'zni x kvadrat minus besh x qo'shuv olti misolida tekshiring: ildizlari ikki va uch, yig'indi besh, ko'paytma olti.",
    'Проверяй каждое слово на примере x квадрат минус пять x плюс шесть: корни два и три, сумма пять, произведение шесть.',
    'Test every word on x squared minus five x plus six: roots two and three, sum five, product six.'),
};

export default function D19_04(props) { return <ClozeBank data={DATA} {...props} />; }
