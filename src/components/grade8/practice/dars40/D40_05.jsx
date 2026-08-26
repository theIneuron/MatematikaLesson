// Dars40 · Amaliyot 05 — Tartib · 🟡 · tag: area_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §12 (40-dars, 5-pozitsiya)
//
// TO'RT QADAM: asosni tanlaymiz -> unga MOS balandlikni topamiz ->
// ko'paytiramiz -> birlik bilan yozamiz.
//
// BIRINCHI QADAM TANLOV: parallelogrammda asos bitta emas, istalgan tomon
// asos bo'la oladi. Balandlikni asos tanlashdan OLDIN olish — З84 ning
// tug'iladigan joyi: o'shanda «mos» degan so'z ma'nosini yo'qotadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'area_steps', level: '🟡',
  expr: ['ABCD'], exprSize: 24,
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: ['AD = 10'],
      label: L('asosni tanlaymiz', 'выбираем основание', 'choose the base') },
    { id: 'l2', tokens: ['BH = 4'],
      label: L("unga mos balandlikni topamiz", 'находим соответствующую высоту', 'find the matching height') },
    { id: 'l3', tokens: ['10 · 4'],
      label: L("ko'paytiramiz", 'перемножаем', 'multiply') },
    { id: 'l4', tokens: ['40 sm²'],
      label: L('birlik bilan yozamiz', 'записываем с единицей', 'write with the unit') },
  ],
  start: ['l2', 'l4', 'l1', 'l3'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Parallelogrammning yuzini to'rt qadamda topamiz, lekin qadamlar aralashib ketgan. Birinchi qadam TANLOV: parallelogrammda asos bitta emas, istalgan tomon asos bo'la oladi.",
    'Площадь параллелограмма находим в четыре шага, но шаги перепутаны. Первый шаг — ВЫБОР: основание у параллелограмма не одно, им может быть любая сторона.',
    'We find the area of a parallelogram in four steps, but the steps are mixed up. The first step is a CHOICE: a parallelogram has no single base, any side may serve as one.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval asosni TANLAYMIZ — bu qadam bejiz emas, chunki parallelogrammda asos bitta emas: to'rt tomonning istalgani asos bo'la oladi. Keyin aynan SHU asosga mos balandlikni topamiz: qarama-qarshi tomondan tanlangan asosga tushirilgan perpendikulyar. «Mos» degan so'z shu yerda hal qiluvchi: boshqa asosning balandligi boshqa son bo'ladi. Undan keyin ko'paytiramiz va oxirida birlik bilan yozamiz — yuza kvadrat santimetrda o'lchanadi, chunki ikki uzunlik ko'paytirilgan. Balandlikni asos tanlashdan oldin olish — eng qimmat xato: o'shanda ikki o'lcham bir-biriga mos kelmasligi mumkin, va ko'paytma yuzani bermaydi.",
    'Верно. Сначала ВЫБИРАЕМ основание — этот шаг не случаен, ведь основание у параллелограмма не одно: им может быть любая из четырёх сторон. Потом находим высоту, соответствующую именно ЭТОМУ основанию: перпендикуляр, опущенный от противоположной стороны на выбранное основание. Слово «соответствующая» здесь решающее: у другого основания высота будет другой. Затем перемножаем и в конце записываем с единицей — площадь измеряется в квадратных сантиметрах, ведь перемножены две длины. Взять высоту до выбора основания — самая дорогая ошибка: тогда два размера могут не соответствовать друг другу, и произведение площади не даст.',
    'Correct. First we CHOOSE the base — that step is no accident, since a parallelogram has no single base: any of the four sides may serve. Then we find the height matching THAT base: the perpendicular dropped from the opposite side onto the chosen base. The word «matching» is decisive here: another base has another height. Then we multiply, and at the end we write the unit — the area is in square centimetres, since two lengths were multiplied. Taking the height before choosing the base is the costliest error: the two measurements may then fail to match, and the product does not give the area.'),
  wrongs: [
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Balandlik ASOS TANLANGANDAN keyin olinadi. Parallelogrammda balandlik bitta emas: har asosning o'z balandligi bor, va ular har xil sonlar. Avval balandlikni olsangiz, keyin esa boshqa tomonni asos deb hisoblasangiz, ikki o'lchov bir-biriga mos kelmaydi va ko'paytma yuzani bermaydi. «Mos» degan so'z aynan shu tartibni talab qiladi.",
      'Высота берётся ПОСЛЕ выбора основания. Высота у параллелограмма не одна: у каждого основания своя, и это разные числа. Если сначала взять высоту, а потом счесть основанием другую сторону, два размера не будут соответствовать друг другу и произведение площади не даст. Слово «соответствующая» и требует этого порядка.',
      'The height is taken AFTER the base is chosen. A parallelogram has no single height: each base has its own, and they are different numbers. Take the height first and then treat another side as the base, and the two measurements will not match, so the product will not give the area. The word «matching» is what demands this order.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Ko'paytirish IKKI O'LCHOV topilgandan keyin bo'ladi: ko'paytiriladigan sonlar hali yo'q. Bu qadam yangi qaror qabul qilmaydi — u tayyor ikki sonni birlashtiradi.",
      'Умножение идёт ПОСЛЕ того, как найдены два размера: перемножать пока нечего. Этот шаг нового решения не принимает — он соединяет два готовых числа.',
      'Multiplication comes AFTER the two measurements are found: there is nothing to multiply yet. This step makes no new decision — it joins two ready numbers.') },
    { when: (s) => s.pos.l4 !== 4, text: L(
      "Birlik bilan yozish ENG OXIRGI qadam: yoziladigan son hali topilmagan. Birlik ham tasodifiy emas — yuza KVADRAT santimetrda o'lchanadi, chunki ikki uzunlik ko'paytirilgan. Uzunlikning birligi bilan yozish javobni boshqa kattalikka aylantirib qo'yadi.",
      'Запись с единицей — САМЫЙ ПОСЛЕДНИЙ шаг: записывать пока нечего. И единица не случайна — площадь измеряется в КВАДРАТНЫХ сантиметрах, ведь перемножены две длины. Написать единицу длины значит превратить ответ в другую величину.',
      'Writing with the unit is the VERY LAST step: there is no number to write yet. And the unit is no accident — the area is in SQUARE centimetres, since two lengths were multiplied. Writing a unit of length turns the answer into a different quantity.') },
    { when: (s) => s.seq[0] === 'l3' || s.seq[0] === 'l4', text: L(
      "Hisobdan yoki tayyor javobdan boshlab bo'lmaydi — ular ishning natijasi. Birinchi qadam tanlov: qaysi tomonni asos qilib olamiz. Aynan shu tanlov keyingi qadamni belgilaydi.",
      'Начинать с вычисления или с готового ответа нельзя — они результат работы. Первый шаг — выбор: какую сторону берём за основание. Именно он и определяет следующий шаг.',
      'You cannot start with the computation or the finished answer — they are the result of the work. The first step is a choice: which side to take as the base. That choice sets the next step.') },
  ],
  wrongText: L(
    "Asos birinchi, birlik oxirgi. Balandlik asos tanlangandan keyin topiladi — u tanlangan asosga MOS bo'lishi kerak.",
    'Основание первым, единица последней. Высота находится после выбора основания — она должна СООТВЕТСТВОВАТЬ выбранному основанию.',
    'The base first, the unit last. The height is found after the base is chosen — it must MATCH the chosen base.'),
};

export default function D40_05(props) { return <SwapOrder data={DATA} {...props} />; }
