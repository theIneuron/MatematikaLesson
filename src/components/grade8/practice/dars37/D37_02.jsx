// Dars37 · Amaliyot 02 — Belgilash · 🟢 🖼 · tag: parallelogram_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §9 (37-dars, 2-pozitsiya)
//
// BIRINCHI CHIZMALI TOPSHIRIQ. `fig.jsx` ning `poly` turi metodist ruxsati
// bilan qo'shildi (skelet §0a.2): ta'rifni SO'Z bilan tekshirish uni
// yodlatadi, chizma bilan tekshirish esa ko'rsatadi.
//
// OLTI TO'RTBURCHAK, UCHTASI PARALLELOGRAMM:
//   qiya parallelogramm, chapga qiya parallelogramm va TO'G'RI
//   TO'RTBURCHAK — u ham parallelogramm, va bu 38-darsga ko'prik.
// Rad etilganlar: trapetsiya (bir juft parallel), deltoid (ikki juft teng
// tomon, lekin parallel emas — З75 aynan shu), ixtiyoriy to'rtburchak.
//
// CHIZMADA HECH QANDAY BELGI YO'Q: strelka yoki shtrix qo'yilsa javob
// oldindan aytilgan bo'lardi. Figura faqat SHAKLI bilan hukm qilinadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

// Kadr kichraytirildi (o'lchov 2026-08-25): olti figura ikki qatorda turadi,
// va telefonda razbor bilan birga ular kadrdan chiqib ketardi.
const F = { fig: 'poly', w: 86, h: 60 };

const DATA = {
  tag: 'parallelogram_marked', level: '🟢',
  col: 94, itemSize: 14,
  items: [
    // qiya parallelogramm: AB = DC = (20, −48), BC = AD = (58, 0)
    { id: 'i1', hit: true, tokens: [{ ...F, pts: [[12, 50], [29, 11], [79, 11], [62, 50]] }] },
    // trapetsiya: faqat BC va AD parallel
    { id: 'i2', tokens: [{ ...F, pts: [[9, 50], [28, 11], [64, 11], [83, 50]] }] },
    // chapga qiya parallelogramm
    { id: 'i3', hit: true, tokens: [{ ...F, pts: [[26, 50], [9, 11], [58, 11], [76, 50]] }] },
    // deltoid: ikki juft QO'SHNI tomon teng, parallel juft yo'q
    { id: 'i4', tokens: [{ ...F, pts: [[45, 3], [70, 21], [45, 57], [20, 21]] }] },
    // to'g'ri to'rtburchak — u ham parallelogramm
    { id: 'i5', hit: true, tokens: [{ ...F, pts: [[14, 47], [14, 13], [76, 13], [76, 47]] }] },
    // ixtiyoriy to'rtburchak: parallel juft yo'q
    { id: 'i6', tokens: [{ ...F, pts: [[10, 53], [22, 13], [69, 21], [81, 47]] }] },
  ],
  eyebrow: L('Belgilash', 'Отметь', 'Mark'),
  setup: L(
    "Olti to'rtburchak chizilgan. Uchtasi parallelogramm, uchtasi esa yo'q. Ta'rifni eslang: parallelogrammda qarama-qarshi tomonlar juft-juft parallel bo'lishi kerak, ya'ni IKKI juft ham.",
    'Начерчены шесть четырёхугольников. Три из них параллелограммы, три нет. Вспомни определение: у параллелограмма противоположные стороны параллельны попарно, то есть ОБЕ пары.',
    'Six quadrilaterals are drawn. Three of them are parallelograms, three are not. Recall the definition: in a parallelogram the opposite sides are parallel in pairs, that is, BOTH pairs.'),
  ask: L(
    "Parallelogramm bo'lgan 3 ta figurani belgilang.",
    'Отметь 3 фигуры, являющиеся параллелограммами.',
    'Mark the 3 figures that are parallelograms.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Ikki juft tomonni alohida tekshiring: yuqori va pastki parallelmi, chap va o'ng parallelmi. Ikkala javob «ha» bo'lsa — parallelogramm. To'g'ri to'rtburchak ham parallelogramm: uning ikki jufti parallel, ustiga burchaklari to'g'ri. Rad etilganlar: trapetsiyada bir juft parallel; deltoidda teng tomonlar bor, parallel juft yo'q; oxirgisida parallel juft umuman yo'q.",
    'Верно. Проверяй две пары сторон по отдельности: параллельны ли верхняя и нижняя, параллельны ли левая и правая. Оба ответа «да» — параллелограмм. Прямоугольник тоже параллелограмм: обе пары параллельны, да ещё углы прямые. Отвергнутые: у трапеции параллельна одна пара; у дельтоида равные стороны есть, параллельных пар нет; у последнего их нет вовсе.',
    'Correct. Check the two pairs of sides separately: are the top and bottom parallel, are the left and right parallel. Both answers yes — a parallelogram. The rectangle is a parallelogram too: both pairs parallel and the angles right besides. The rejected ones: a trapezoid has one parallel pair; a kite has equal sides but no parallel pair; the last has none at all.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Bu figurada ikki juft tomon TENG, lekin parallel emas — u deltoid deyiladi. Ta'rif tenglikni emas, PARALLELLIKNI talab qiladi, va bu ikki narsa bir xil emas. Teng tomonlar bir-biriga qarab burilgan bo'lishi mumkin, parallel tomonlar esa hech qachon kesishmaydi. Figuraga qarang: yuqori ikki tomon bir-biriga qarab yaqinlashadi, ya'ni ular parallel emas.",
      'У этой фигуры две пары сторон РАВНЫ, но не параллельны — она называется дельтоидом. Определение требует не равенства, а ПАРАЛЛЕЛЬНОСТИ, а это не одно и то же. Равные стороны могут быть повёрнуты друг к другу, а параллельные никогда не пересекаются. Посмотри на фигуру: две верхние стороны сходятся друг к другу, значит они не параллельны.',
      'This figure has two pairs of EQUAL sides, but they are not parallel — it is called a kite. The definition demands not equality but PARALLELISM, and these are not the same. Equal sides may be turned towards each other; parallel ones never meet. Look at the figure: the two upper sides converge, so they are not parallel.') },
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Bu figurada BIR juft tomon parallel — yuqori va pastki, — lekin yon tomonlar bir-biriga qarab qiyalangan. Ta'rif esa IKKI juftni talab qiladi. Bir juft parallel bo'lgan to'rtburchak trapetsiya deyiladi, va u 39-darsning mavzusi. Ikki figurani ajratish uchun yon tomonlarga alohida qarang.",
      'У этой фигуры параллельна ОДНА пара сторон — верхняя и нижняя, — а боковые наклонены друг к другу. Определение же требует ОБЕИХ пар. Четырёхугольник с одной параллельной парой называется трапецией, и это тема урока 39. Чтобы различить две фигуры, посмотри на боковые стороны отдельно.',
      'This figure has ONE parallel pair — top and bottom — while the sides lean towards each other. The definition demands BOTH pairs. A quadrilateral with one parallel pair is called a trapezoid, the subject of lesson 39. To tell the two figures apart, look at the side edges separately.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Bu figurada parallel juft umuman yo'q: to'rt tomonning har biri o'z yo'nalishida turibdi. Tekshirishning oson yo'li — qarama-qarshi ikki tomonni ko'z bilan davom ettirish: agar ular kesishsa, parallel emas.",
      'У этой фигуры параллельных пар нет вовсе: каждая из четырёх сторон идёт в своём направлении. Простой способ проверки — мысленно продолжить две противоположные стороны: если они пересекутся, значит не параллельны.',
      'This figure has no parallel pair at all: each of the four sides runs in its own direction. An easy way to check is to extend two opposite sides in your mind: if they would meet, they are not parallel.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "To'g'ri to'rtburchak chetlab o'tildi, lekin U HAM PARALLELOGRAMM. Ta'rifni tekshiring: yuqori va pastki tomon parallelmi — ha; chap va o'ng tomon parallelmi — ha. Ikkala shart ham bajarildi. Burchaklarning to'g'ri bo'lgani ta'rifga xalaqit bermaydi, aksincha — u qo'shimcha xossa. To'g'ri to'rtburchak parallelogrammning alohida holi, va shuning uchun parallelogrammning hamma xossasi unda ham ishlaydi.",
      'Прямоугольник пропущен, а ОН ТОЖЕ ПАРАЛЛЕЛОГРАММ. Проверь определение: параллельны ли верхняя и нижняя стороны — да; параллельны ли левая и правая — да. Оба условия выполнены. То, что углы прямые, определению не мешает, наоборот — это дополнительное свойство. Прямоугольник частный случай параллелограмма, и поэтому все свойства параллелограмма работают и в нём.',
      'The rectangle was skipped, yet IT IS A PARALLELOGRAM TOO. Check the definition: are the top and bottom parallel — yes; are the left and right parallel — yes. Both conditions hold. The angles being right does not interfere with the definition, on the contrary — it is an extra property. A rectangle is a special case of the parallelogram, and so every property of a parallelogram works in it.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta figura kerak. Har figuraga ikki savol bering: yuqori va pastki tomon parallelmi, chap va o'ng tomon parallelmi. Faqat ikkala javob ham «ha» bo'lganda figura parallelogramm bo'ladi.",
      'Нужно ровно три фигуры. К каждой задай два вопроса: параллельны ли верхняя и нижняя стороны, параллельны ли левая и правая. Только когда оба ответа «да», фигура параллелограмм.',
      'Exactly three figures are needed. Ask two questions of each: are the top and bottom parallel, are the left and right parallel. Only when both answers are yes is the figure a parallelogram.') },
  ],
  wrongText: L(
    "Har figurada IKKI juft tomonni alohida tekshiring. Tomonlarning tengligi parallellikni almashtirmaydi, va bir juft parallel yetarli emas.",
    'В каждой фигуре проверяй ОБЕ пары сторон отдельно. Равенство сторон параллельности не заменяет, и одной параллельной пары недостаточно.',
    'Check BOTH pairs of sides separately in every figure. Equal sides do not stand in for parallel ones, and one parallel pair is not enough.'),
};

export default function D37_02(props) { return <MarkAll data={DATA} {...props} />; }
