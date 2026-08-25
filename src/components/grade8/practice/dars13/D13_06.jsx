// Dars13 · Amaliyot 06 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §4 (13-dars, 6-pozitsiya)
//
// Darsning uch tasdig'i BITTA gapda: nima chiqariladi, qachon qo'shiladi,
// va o'zgartirish qanday tekshiriladi. Bankda uch tuzoq:
//   «har qanday ko'paytuvchi» — chiqarish sharti yo'qoladi (to'liq kvadrat);
//   «koeffitsiyentlari»        — qo'shish sharti almashadi: hadlarni
//                               koeffitsiyent emas, ILDIZ OSTI birlashtiradi;
//   «ikkiga bo'lib»           — tekshirishning yolg'on usuli.
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
      'Ildiz ostidan',
      'Из-под корня выносится множитель, который является',
      'A factor can be taken out from under the root if it is') },
    { slot: 0 },
    { text: L(
      "bo'lgan ko'paytuvchi chiqariladi. Ildizli hadlar",
      '. Слагаемые с корнями складываются, когда одинаковы их',
      '. Terms with roots add when their') },
    { slot: 1 },
    { text: L(
      "bir xil bo'lganda qo'shiladi. O'zgartirish esa javobni",
      '. А преобразование проверяется, если ответ',
      'are the same. A transformation is checked by') },
    { slot: 2 },
    { text: L('tekshiriladi.', '.', 'the answer.') },
  ],
  cards: [
    { id: 'w1', label: L('to\'liq kvadrat', 'полным квадратом', 'a perfect square') },
    { id: 'w2', label: L('ildiz ostilari', 'подкоренные', 'radicands') },
    { id: 'w3', label: L('kvadratga oshirib', 'возвести в квадрат', 'squaring') },
    { id: 'w4', label: L('har qanday ko\'paytuvchi', 'любым множителем', 'any factor') },
    { id: 'w5', label: L('koeffitsiyentlari', 'коэффициенты', 'coefficients') },
    { id: 'w6', label: L('ikkiga bo\'lib', 'разделить на два', 'halving') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta: uchtasi joyiga tushadi, uchtasi esa gapga mos kelib, matematikaga mos kelmaydi.",
    'Правило урока записано, но три слова выпали. В банке шесть карточек: три встают на место, а три подходят по языку, но не по математике.',
    'The rule of the lesson is written down, but three words fell out. The bank holds six cards: three fit, and three fit the sentence but not the mathematics.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uch fakt bir gapda. Chiqariladigan ko'paytuvchi to'liq kvadrat bo'lishi kerak, aks holda ildiz ostidan butun son chiqmaydi: ellikda yigirma besh shunday, o'nda esa emas. Hadlarni ildiz ostilari birlashtiradi, koeffitsiyentlar esa faqat qo'shiladi: uch ikkidan ildiz qo'shuv bir ikkidan ildiz to'rt ikkidan ildiz. Tekshirish esa bitta amal — javobni kvadratga oshirish: to'rtning kvadrati o'n olti, karra ikki o'ttiz ikki, va chap tomonni ham kvadratga oshirsangiz o'ttiz ikki chiqadi.",
    'Верно. Три факта в одном предложении. Выносимый множитель должен быть полным квадратом, иначе из-под корня не выйдет целое число: в пятидесяти таков двадцать пять, а десять нет. Слагаемые объединяет подкоренное, а коэффициенты лишь складываются: три корня из двух плюс один корень из двух четыре корня из двух. Проверка — одно действие: возвести ответ в квадрат: четыре в квадрате шестнадцать, на два тридцать два, и левая часть в квадрате тоже тридцать два.',
    'Correct. Three facts in one sentence. The factor taken out must be a perfect square, otherwise no whole number leaves the root: in fifty that factor is twenty five, while ten is not one. Terms are joined by their radicands, and the coefficients merely add: three roots of two plus one root of two is four roots of two. The check is one action — square the answer: four squared is sixteen, times two is thirty two, and squaring the left side gives thirty two too.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "«Har qanday ko'paytuvchi» shartni yo'q qiladi. Ellikni o'n karra besh deb ajratib ko'ring: o'ndan ildiz butun emas, demak ildiz ostidan chiqaradigan narsa yo'q. Chiqadigan ko'paytuvchi to'liq kvadrat bo'lishi shart — yigirma besh, to'qqiz, to'rt kabi.",
      '«Любым множителем» уничтожает условие. Разложи пятьдесят как десять на пять: корень из десяти не целый, значит выносить нечего. Выносимый множитель обязан быть полным квадратом — как двадцать пять, девять, четыре.',
      '«Any factor» destroys the condition. Split fifty as ten times five: the root of ten is not whole, so there is nothing to take out. The factor taken out must be a perfect square — like twenty five, nine, four.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Koeffitsiyentlar hadlarni birlashtirmaydi. Uch ikkidan ildiz va uch beshdan ildizni oling: koeffitsiyentlari bir xil, lekin ularni bir hadga yig'ib bo'lmaydi — sonlar bilan tekshiring, birinchisi to'rt butun yigirma to'rt, ikkinchisi olti butun yetmish. Birlashtiradigan narsa ildiz ostidagi son.",
      'Коэффициенты слагаемые не объединяют. Возьми три корня из двух и три корня из пяти: коэффициенты одинаковы, но в одно слагаемое их не свести — проверь числами, первое четыре и двадцать четыре, второе шесть и семьдесят. Объединяет подкоренное число.',
      'Coefficients do not join terms. Take three roots of two and three roots of five: the coefficients match, yet they cannot be collected into one term — check with numbers, the first is four point two four, the second six point seven. What joins them is the radicand.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Ikkiga bo'lish tekshirish emas. Ildiz belgisini yechadigan amal — kvadratga oshirish: agar javobning kvadrati dastlabki ildiz ostidagi songa teng chiqsa, o'zgartirish to'g'ri. Ellikni ikkiga bo'lsangiz yigirma besh chiqadi, javob esa besh ikkidan ildiz — bu ikki boshqa narsa.",
      'Деление на два не проверка. Действие, снимающее знак корня, — возведение в квадрат: если квадрат ответа равен исходному подкоренному, преобразование верно. Пятьдесят делить на два двадцать пять, а ответ пять корней из двух — это разные вещи.',
      'Halving is not a check. The action that undoes a root is squaring: if the square of the answer equals the original radicand, the transformation is right. Fifty halved is twenty five, while the answer is five roots of two — two different things.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni ellikdan ildiz misolida tekshiring.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово на примере корня из пятидесяти.',
      'The three traps in the bank fit the language but not the mathematics. Test each word on the example of the root of fifty.') },
  ],
  wrongText: L(
    "Har so'zni qo'ygandan keyin gapni ellikdan ildiz misolida o'qing va hisoblab ko'ring. Yolg'on so'z birinchi hisobda ko'rinadi.",
    'Поставив каждое слово, прочти предложение на примере корня из пятидесяти и посчитай. Ложное слово видно на первом же счёте.',
    'After placing each word, read the sentence on the example of the root of fifty and compute. A false word shows up on the first computation.'),
};

export default function D13_06(props) { return <ClozeBank data={DATA} {...props} />; }
