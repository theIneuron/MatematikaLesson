// Dars42 · Amaliyot 03 — Guruhlar · 🟢 · tag: same_area_groups
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §4 (42-dars, 3-pozitsiya)
//
// BALANDLIK IKKI GURUHDA HAM 4 VA 6, ya'ni faqat `h` ga qarab ajratib
// bo'lmaydi: hisoblash kerak. Ikki karta ATAYLAB yonma-yon turadi —
// `5,7,4` va `5,7,6`: bir xil asoslar, boshqa balandlik, va ular BOSHQA
// guruhga tushadi.
//
// Kartalarda faqat BELGI turadi (skelet §0a.4): uch son `a`, `b`, `h`
// tartibida, va bu tartib setup da aytiladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'same_area_groups', level: '🟢',
  zoneLbl: 104, zoneSize: 18, itemSize: 14,
  zones: [
    { id: 'z1', tokens: ['S = 24'] },
    { id: 'z2', tokens: ['S = 36'] },
  ],
  items: [
    { id: 'i1', tokens: ['5, 7, 4'], zone: 'z1' },
    { id: 'i2', tokens: ['5, 7, 6'], zone: 'z2' },
    { id: 'i3', tokens: ['2, 6, 6'], zone: 'z1' },
    { id: 'i4', tokens: ['8, 10, 4'], zone: 'z2' },
    { id: 'i5', tokens: ['1, 7, 6'], zone: 'z1' },
    { id: 'i6', tokens: ['7, 11, 4'], zone: 'z2' },
    { id: 'i7', tokens: ['3, 9, 4'], zone: 'z1' },
    { id: 'i8', tokens: ['4, 8, 6'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz trapetsiya berilgan. Har kartada uch son turadi shu tartibda: birinchi asos, ikkinchi asos va balandlik. Yuzalar ikki xil chiqadi.",
    'Даны восемь трапеций. В каждой карточке три числа в таком порядке: первое основание, второе основание и высота. Площади получаются двух видов.',
    'Eight trapezoids are given. Each card holds three numbers in this order: the first base, the second base and the height. The areas come out in two kinds.'),
  ask: L('Kartani bosing, keyin uning guruhini bosing.', 'Нажми карточку, потом её группу.', 'Tap a card, then tap its group.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Har kartada ikki qadam: asoslarni qo'shib yarmini olish, keyin balandlikka ko'paytirish. Besh qo'shuv yetti o'n ikki, yarmi olti, olti karra to'rt yigirma to'rt. O'sha asoslar, lekin balandligi olti bo'lsa: olti karra olti o'ttiz olti — boshqa guruh. Ikki qo'shuv olti sakkiz, yarmi to'rt, to'rt karra olti yigirma to'rt. Balandlikning o'zi hech narsani hal qilmaydi: to'rt ham, olti ham ikki guruhda uchraydi.",
    'Верно. В каждой карточке два шага: сложить основания и взять половину, потом умножить на высоту. Пять плюс семь — двенадцать, половина шесть, шесть на четыре — двадцать четыре. Те же основания, но высота шесть: шесть на шесть — тридцать шесть, другая группа. Два плюс шесть — восемь, половина четыре, четыре на шесть — двадцать четыре. Сама высота ничего не решает: и четыре, и шесть встречаются в обеих группах.',
    'Correct. Two steps in every card: add the bases and halve, then multiply by the height. Five plus seven is twelve, half is six, six times four is twenty four. The same bases with height six: six times six is thirty six, the other group. Two plus six is eight, half is four, four times six is twenty four. The height alone decides nothing: both four and six appear in either group.'),
  wrongs: [
    { when: (s) => s.place.i1 === 'z2' && s.place.i2 === 'z2', text: L(
      "Ikki karta bir xil asoslar bilan boshlanadi, lekin balandliklari boshqa: to'rt va olti. Ular BOSHQA guruhga tushadi. Har birini alohida hisoblang: olti karra to'rt yigirma to'rt, olti karra olti o'ttiz olti.",
      'Две карточки начинаются с одинаковых оснований, но высоты у них разные: четыре и шесть. Они попадают в РАЗНЫЕ группы. Посчитай каждую отдельно: шесть на четыре — двадцать четыре, шесть на шесть — тридцать шесть.',
      'Two cards start with the same bases but their heights differ: four and six. They fall into DIFFERENT groups. Compute each on its own: six times four is twenty four, six times six is thirty six.') },
    { when: (s) => s.place.i3 === 'z2' || s.place.i5 === 'z2', text: L(
      "Bu kartalarning balandligi olti, lekin asoslari kichik: ikki qo'shuv olti sakkiz, yarmi to'rt; bir qo'shuv yetti sakkiz, yarmi to'rt. To'rt karra olti yigirma to'rt. Balandlik katta bo'lgani yuza katta bo'lishini bildirmaydi.",
      'У этих карточек высота шесть, но основания маленькие: два плюс шесть — восемь, половина четыре; один плюс семь — восемь, половина четыре. Четыре на шесть — двадцать четыре. Большая высота не означает большую площадь.',
      'These cards have height six but small bases: two plus six is eight, half is four; one plus seven is eight, half is four. Four times six is twenty four. A large height does not mean a large area.') },
    { when: (s) => s.place.i4 === 'z1' || s.place.i6 === 'z1', text: L(
      "Bu kartalarning balandligi to'rt, lekin asoslari katta: sakkiz qo'shuv o'n sakkiz, yarmi to'qqiz; yetti qo'shuv o'n bir o'n sakkiz, yarmi to'qqiz. To'qqiz karra to'rt o'ttiz olti.",
      'У этих карточек высота четыре, но основания большие: восемь плюс десять — восемнадцать, половина девять; семь плюс одиннадцать — восемнадцать, половина девять. Девять на четыре — тридцать шесть.',
      'These cards have height four but large bases: eight plus ten is eighteen, half is nine; seven plus eleven is eighteen, half is nine. Nine times four is thirty six.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har kartada ikki qadam bajariladi va ikkinchisini tashlab ketib bo'lmaydi. Avval asoslarning yig'indisining yarmi, keyin uni balandlikka ko'paytirish — chiqqan son guruhning nomida turadi.",
      'В каждой карточке выполняются два шага, и второй пропустить нельзя. Сначала половина суммы оснований, потом умножение на высоту — полученное число и стоит в названии группы.',
      'Two steps are done in every card and the second cannot be skipped. First half the sum of the bases, then multiply by the height — the result is what the group name says.') },
  ],
  wrongText: L(
    "Ikki asosni qo'shib yarmini oling, keyin balandlikka ko'paytiring. Balandlikning o'zi guruhni aytmaydi.",
    'Сложи два основания и возьми половину, потом умножь на высоту. Сама высота группу не подсказывает.',
    'Add the two bases and halve, then multiply by the height. The height alone does not name the group.'),
};

export default function D42_03(props) { return <Zones data={DATA} {...props} />; }
