// Dars46 · Amaliyot 08 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §8 (46-dars, 8-pozitsiya)
//
// UCHTA BO'SHLIQ — DARSNING UCH TASDIG'I. Uchinchisi eng qarshi-sezgi joyi:
// katta tomonga KICHIK balandlik mos keladi (З98).
//
// Kartalar SO'Z, ya'ni `L()` ICHIDA (skelet §0a.4). Bankdagi tuzoqlar:
// «perimetrining o'ziga» (З97), «asos va balandlik» (bu 41-darsning yo'li),
// «katta» (З98).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L('Yarim perimetr uchburchak', 'Полупериметр равен', 'The semi-perimeter equals') },
    { slot: 0 },
    { text: L('teng. Geron formulasi', 'треугольника. Формула Герона применяется, когда известны', 'of the triangle. Heron formula is used when') },
    { slot: 1 },
    { text: L("ma'lum bo'lganda ishlatiladi, va katta tomonga", ', и большей стороне соответствует', 'are known, and the longer side matches the') },
    { slot: 2 },
    { text: L('balandlik mos keladi.', 'высота.', 'height.') },
  ],
  cards: [
    { id: 'w1', label: L('perimetrining yarmiga', 'половине периметра', 'half the perimeter') },
    { id: 'w2', label: L('uchala tomon', 'все три стороны', 'all three sides') },
    { id: 'w3', label: L('kichik', 'меньшая', 'smaller') },
    { id: 'w4', label: L("perimetrining o'ziga", 'всему периметру', 'the whole perimeter') },
    { id: 'w5', label: L('asos va balandlik', 'основание и высота', 'the base and the height') },
    { id: 'w6', label: L('katta', 'большая', 'larger') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning uch tasdig'i bitta gapga yig'ilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta, va hammasi gapga tili bo'yicha tushadi.",
    'Три утверждения урока собраны в одно предложение, но три слова выпали. В банке шесть карточек, и все они по языку встают в предложение.',
    'The three statements of the lesson are gathered into one sentence, but three words fell out. The bank holds six cards and all of them fit the sentence as language.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uch tasdiq uch xil narsani aytadi. Birinchisi — ta'rif: yarim perimetr perimetrning yarmi, va formulaning hamma ko'paytuvchisi shundan chiqadi. Ikkinchisi — shart: formula uchala tomon ma'lum bo'lganda ishlaydi, balandlik kerak emas. Uchinchisi — qarshi-sezgi fakt: katta tomonga KICHIK balandlik mos keladi. Nima uchun shunday: yuza bitta, va u asos bilan balandlikning ko'paytmasidan yig'iladi — asos katta bo'lsa, o'sha yuzani berish uchun balandlik kichik bo'lishi kerak. Bir misolda ko'rish mumkin: to'qqiz, o'n ikki, o'n besh uchburchagining yuzi ellik to'rt; o'n ikki tomoniga mos balandlik to'qqiz, to'qqiz tomoniga mos balandlik esa o'n ikki. Tomon o'sdi, balandlik kichraydi.",
    'Верно. Три утверждения говорят о трёх разных вещах. Первое — определение: полупериметр это половина периметра, и все множители формулы выходят из него. Второе — условие: формула работает, когда известны все три стороны, высота не нужна. Третье — контринтуитивный факт: большей стороне соответствует МЕНЬШАЯ высота. Почему так: площадь одна, и складывается она из произведения основания на высоту — если основание больше, то для той же площади высота должна быть меньше. Это видно на примере: у треугольника девять, двенадцать, пятнадцать площадь пятьдесят четыре; высота к стороне двенадцать равна девяти, а высота к стороне девять — двенадцати. Сторона выросла, высота уменьшилась.',
    'Correct. The three statements say three different things. The first is a definition: the semi-perimeter is half the perimeter, and every factor of the formula comes from it. The second is a condition: the formula works when all three sides are known, no height needed. The third is a counter-intuitive fact: the longer side matches the SMALLER height. Why: the area is one, and it is built from the product of base and height — with a larger base the height must be smaller to give the same area. An example shows it: in the triangle nine, twelve, fifteen the area is fifty four; the height to the side twelve is nine, and the height to the side nine is twelve. The side grew, the height shrank.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('w4') !== -1, text: L(
      "«Perimetrining o'ziga» — bu darsning eng qimmat xatosi. Yarim perimetr aynan YARIM: agar tomonlar o'n uch, o'n to'rt, o'n besh bo'lsa, perimetr qirq ikki, yarim perimetr esa yigirma bir. Perimetrning o'zini olsangiz, uchala ayirma ham noto'g'ri chiqadi va yuza butunlay boshqa bo'ladi.",
      '«Всему периметру» — самая дорогая ошибка урока. Полупериметр — это именно ПОЛОВИНА: если стороны тринадцать, четырнадцать, пятнадцать, то периметр сорок два, а полупериметр двадцать один. Взяв весь периметр, получишь неверными все три разности, и площадь выйдет совсем другой.',
      'The whole perimeter is the costliest error of the lesson. The semi-perimeter is exactly HALF: with sides thirteen, fourteen, fifteen the perimeter is forty two and the semi-perimeter twenty one. Take the whole perimeter and all three differences come out wrong, and the area entirely different.') },
    { when: (s) => s.slots.indexOf('w6') !== -1, text: L(
      "«Katta» munosabatni teskari qiladi. Bitta uchburchakni oling: yuzasi o'zgarmaydi, ya'ni asos bilan balandlikning ko'paytmasi ham o'zgarmaydi. Asos katta bo'lsa, ko'paytma o'sha bo'lib qolishi uchun balandlik kichik bo'lishi kerak. Sonlarda: to'qqiz, o'n ikki, o'n besh uchburchagida yuza ellik to'rt, o'n ikki tomoniga balandlik to'qqiz, to'qqiz tomoniga esa o'n ikki.",
      '«Большая» переворачивает соотношение. Возьми один треугольник: площадь у него не меняется, значит и произведение основания на высоту не меняется. Если основание больше, то для сохранения произведения высота должна быть меньше. В числах: в треугольнике девять, двенадцать, пятнадцать площадь пятьдесят четыре, высота к стороне двенадцать равна девяти, а к стороне девять — двенадцати.',
      'Larger reverses the relation. Take one triangle: its area does not change, so neither does the product of base and height. With a larger base the height must be smaller to keep the product. In numbers: in the triangle nine, twelve, fifteen the area is fifty four, the height to the side twelve is nine and to the side nine twelve.') },
    { when: (s) => s.slots.indexOf('w5') !== -1, text: L(
      "Asos va balandlik bilan yuza 41-darsning formulasi orqali topiladi, va o'shanda Geron formulasi kerak emas. Geron formulasining butun qimmati shundaki, u BALANDLIKSIZ ishlaydi: faqat uchala tomon kerak.",
      'По основанию и высоте площадь находится формулой урока 41, и тогда формула Герона не нужна. Вся ценность формулы Герона в том, что она работает БЕЗ ВЫСОТЫ: нужны только три стороны.',
      'With a base and a height the area comes from the formula of lesson 41, and then Heron formula is not needed. The whole value of Heron formula is that it works WITHOUT a height: only the three sides are needed.') },
    { when: (s) => s.slots[0] === 'w4' && s.slots[2] === 'w6', text: L(
      "Ikki bo'shliq ham teskari tanlangan. Ikkalasini alohida tekshirish oson: yarim perimetr har doim perimetrdan ikki barobar kichik, va bitta uchburchakda katta tomonga kichik balandlik mos keladi.",
      'Оба пропуска выбраны наоборот. Проверить каждый легко: полупериметр всегда вдвое меньше периметра, а в одном треугольнике большей стороне соответствует меньшая высота.',
      'Both gaps were filled the wrong way round. Each is easy to check: the semi-perimeter is always half the perimeter, and within one triangle the longer side matches the smaller height.') },
  ],
  wrongText: L(
    "Uch bo'shliq: yarim perimetrning ta'rifi, formulaning sharti, va tomon bilan balandlikning munosabati.",
    'Три пропуска: определение полупериметра, условие формулы и соотношение стороны с высотой.',
    'Three gaps: the definition of the semi-perimeter, the condition of the formula, and how a side relates to its height.'),
};

export default function D46_08(props) { return <ClozeBank data={DATA} {...props} />; }
