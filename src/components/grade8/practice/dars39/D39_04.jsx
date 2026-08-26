// Dars39 · Amaliyot 04 — Figuralar · 🟡 🖼 · tag: trapezoid_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §11 (39-dars, 4-pozitsiya)
//
// OLTI FIGURA, UCHTASI TRAPETSIYA: oddiy, TO'G'RI BURCHAKLI va TENG
// YONLI. Uchalasi ham bitta ta'rifga bo'ysunadi, lekin ular boshqacha
// ko'rinadi — shu sababli uchtasi birga turadi.
//
// Rad etilganlar: parallelogramm (IKKI juft parallel — З81), ixtiyoriy
// to'rtburchak (parallel juft yo'q), deltoid.
// Parallelogramm eng qimmat: unda ham parallel juft bor, ya'ni ta'rifning
// birinchi yarmi bajariladi. Ikkinchi yarmi esa uni rad etadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

// Kadr kichraytirildi (o'lchov 2026-08-25): olti figura ikki qatorda turadi.
const F = { fig: 'poly', w: 86, h: 60 };

const DATA = {
  tag: 'trapezoid_marked', level: '🟡',
  col: 94, itemSize: 14,
  items: [
    // oddiy trapetsiya: BC ∥ AD, yon tomonlar har xil
    { id: 'i1', hit: true, tokens: [{ ...F, pts: [[7, 50], [17, 11], [55, 11], [77, 50]] }] },
    // parallelogramm: IKKI juft parallel
    { id: 'i2', tokens: [{ ...F, pts: [[12, 50], [29, 11], [79, 11], [62, 50]] }] },
    // to'g'ri burchakli trapetsiya: A va B da to'g'ri burchak
    { id: 'i3', hit: true, tokens: [{ ...F, pts: [[12, 50], [12, 11], [60, 11], [79, 50]], right: [0, 1] }] },
    // ixtiyoriy to'rtburchak: parallel juft yo'q
    { id: 'i4', tokens: [{ ...F, pts: [[10, 53], [22, 13], [69, 21], [81, 47]] }] },
    // teng yonli trapetsiya: simmetrik
    { id: 'i5', hit: true, tokens: [{ ...F, pts: [[14, 50], [31, 11], [64, 11], [81, 50]] }] },
    // deltoid: parallel juft yo'q
    { id: 'i6', tokens: [{ ...F, pts: [[45, 3], [70, 21], [45, 57], [20, 21]] }] },
  ],
  eyebrow: L('Figuralar', 'Фигуры', 'Figures'),
  setup: L(
    "Olti to'rtburchak chizilgan. Uchtasi trapetsiya, uchtasi esa yo'q. Ta'rifning ikkala yarmini ham tekshiring: bir juft tomon parallel bo'lsin, ikkinchi juft esa parallel bo'lmasin.",
    'Начерчены шесть четырёхугольников. Три из них трапеции, три нет. Проверяй обе половины определения: одна пара сторон параллельна, другая не параллельна.',
    'Six quadrilaterals are drawn. Three of them are trapezoids, three are not. Check both halves of the definition: one pair of sides parallel, the other pair not parallel.'),
  ask: L(
    "Trapetsiya bo'lgan 3 ta figurani belgilang.",
    'Отметь 3 фигуры, являющиеся трапециями.',
    'Mark the 3 figures that are trapezoids.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uch trapetsiya uch xil ko'rinadi, lekin hammasi bitta ta'rifga bo'ysunadi: oddiy, TO'G'RI BURCHAKLI (bir yon tomoni asosga perpendikulyar) va TENG YONLI (yon tomonlari teng, lekin parallel emas). Rad etilganlarning eng qiyini parallelogramm: unda ta'rifning birinchi yarmi bajariladi, ikkinchisi esa yo'q — IKKALA juft ham parallel.",
    'Верно. Три трапеции выглядят по-разному, но подчиняются одному определению: обычная, ПРЯМОУГОЛЬНАЯ (одна боковая перпендикулярна основанию) и РАВНОБЕДРЕННАЯ (боковые равны, но не параллельны). Самый трудный из отвергнутых — параллелограмм: первая половина определения у него выполняется, а вторая нет — там параллельны ОБЕ пары.',
    'Correct. The three trapezoids look different yet obey one definition: an ordinary one, a RIGHT one (a leg perpendicular to the base) and an ISOSCELES one (equal legs that are not parallel). The hardest of the rejected ones is the parallelogram: the first half of the definition holds for it, the second does not — there BOTH pairs are parallel.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Bu PARALLELOGRAMM: unda ikkala juft tomon ham parallel. Ta'rifning birinchi yarmi bajariladi — bir juft parallel, — lekin ikkinchi yarmi buziladi: qolgan juft ham parallel. Trapetsiyada esa yon tomonlar parallel BO'LMASLIGI kerak. Ko'z bilan tekshiring: yon tomonlarni davom ettiring — parallelogrammda ular hech qachon kesishmaydi, trapetsiyada esa kesishadi.",
      'Это ПАРАЛЛЕЛОГРАММ: у него параллельны обе пары сторон. Первая половина определения выполняется — одна пара параллельна, — но вторая нарушена: другая пара тоже параллельна. А в трапеции боковые стороны параллельными быть НЕ должны. Проверь глазом: продолжи боковые стороны — у параллелограмма они не пересекутся никогда, а у трапеции пересекутся.',
      'This is a PARALLELOGRAM: both pairs of its sides are parallel. The first half of the definition holds — one pair is parallel — but the second is broken: the other pair is parallel too. In a trapezoid the legs must NOT be parallel. Check by eye: extend the legs — in a parallelogram they never meet, in a trapezoid they do.') },
    { when: (s) => s.miss.indexOf('i3') !== -1, text: L(
      "To'g'ri burchakli trapetsiya chetlab o'tildi, lekin U HAM TRAPETSIYA. Uning bir yon tomoni asosga perpendikulyar, ya'ni ikki burchagi to'g'ri — bu figurani trapetsiyalar oilasidan chiqarmaydi. Ta'rifni tekshiring: yuqori va pastki tomon parallelmi — ha; yon tomonlar parallelmi — yo'q, chunki bittasi tik, ikkinchisi qiya. Ikkala shart ham bajarildi.",
      'Прямоугольная трапеция пропущена, а ОНА ТОЖЕ ТРАПЕЦИЯ. Одна её боковая перпендикулярна основанию, то есть два угла прямые, — из семейства трапеций это фигуру не выводит. Проверь определение: параллельны ли верхняя и нижняя стороны — да; параллельны ли боковые — нет, ведь одна отвесная, а другая наклонная. Оба условия выполнены.',
      'The right trapezoid was skipped, yet IT IS A TRAPEZOID TOO. One of its legs is perpendicular to the base, so two of its angles are right — that does not push the figure out of the trapezoid family. Check the definition: are the top and bottom parallel — yes; are the legs parallel — no, since one is upright and the other slanted. Both conditions hold.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "Teng yonli trapetsiya chetlab o'tildi. Uning yon tomonlari TENG, lekin teng degani parallel degani emas: ular bir-biriga qarab qiyalangan va davom ettirilsa kesishadi. Ta'rif parallellikni tekshiradi, tenglikni emas. Simmetriya ham figurani parallelogramm qilmaydi — parallelogramm simmetrik emas, u markazga nisbatan buriladi.",
      'Равнобедренная трапеция пропущена. Её боковые стороны РАВНЫ, но равные — не значит параллельные: они наклонены друг к другу и при продолжении пересекутся. Определение проверяет параллельность, а не равенство. И симметрия фигуру параллелограммом не делает — параллелограмм не симметричен, он поворачивается относительно центра.',
      'The isosceles trapezoid was skipped. Its legs are EQUAL, but equal does not mean parallel: they lean towards each other and would meet if extended. The definition tests parallelism, not equality. Symmetry does not make the figure a parallelogram either — a parallelogram is not mirror-symmetric, it turns about its centre.') },
    { when: (s) => s.extra.indexOf('i4') !== -1 || s.extra.indexOf('i6') !== -1, text: L(
      "Bu figurada parallel juft UMUMAN yo'q. Deltoidda ikki juft teng tomon bor, lekin tenglik parallellikni almashtirmaydi; oxirgi to'rtburchakda esa to'rt tomonning har biri o'z yo'nalishida turibdi. Ta'rifning birinchi yarmi ham bajarilmasa, figura trapetsiya bo'lolmaydi.",
      'У этой фигуры параллельных пар НЕТ вовсе. У дельтоида есть две пары равных сторон, но равенство параллельности не заменяет; а у последнего четырёхугольника каждая из четырёх сторон идёт в своём направлении. Если не выполняется даже первая половина определения, фигура трапецией быть не может.',
      'This figure has NO parallel pair at all. The kite has two pairs of equal sides, but equality does not stand in for parallelism; and in the last quadrilateral each of the four sides runs its own way. If even the first half of the definition fails, the figure cannot be a trapezoid.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta figura kerak. Har figuraga ikki savol bering: bir juft tomon parallelmi, va ikkinchi juft parallel EMASMI. Ikkala javob ham «ha» bo'lganda figura trapetsiya bo'ladi.",
      'Нужно ровно три фигуры. К каждой задай два вопроса: параллельна ли одна пара сторон и НЕ параллельна ли другая. Когда оба ответа «да», фигура трапеция.',
      'Exactly three figures are needed. Ask two questions of each: is one pair of sides parallel, and is the other pair NOT parallel. When both answers are yes, the figure is a trapezoid.') },
  ],
  wrongText: L(
    "Ta'rifning ikkala yarmini ham tekshiring: bir juft parallel BO'LSIN va ikkinchi juft parallel BO'LMASIN. To'g'ri burchak ham, tomonlarning tengligi ham figurani oiladan chiqarmaydi.",
    'Проверяй обе половины определения: одна пара параллельна И другая не параллельна. Ни прямой угол, ни равенство сторон из семейства фигуру не выводят.',
    'Check both halves of the definition: one pair parallel AND the other pair not parallel. Neither a right angle nor equal sides push a figure out of the family.'),
};

export default function D39_04(props) { return <MarkAll data={DATA} {...props} />; }
