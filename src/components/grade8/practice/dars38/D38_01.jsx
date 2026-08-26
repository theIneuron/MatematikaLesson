// Dars38 · Amaliyot 01 — Figuralar · 🟢 🖼 · tag: rhombus_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §10 (38-dars, 1-pozitsiya)
//
// OLTI FIGURA, UCHTASI ROMB: qiya romb, KVADRAT va tik turgan romb.
// Kvadratning romblar orasida turgani T3 ning ko'z bilan ko'riladigan
// yeri: kvadrat ham romb, chunki uning to'rt tomoni teng.
//
// Rad etilganlar: to'g'ri to'rtburchak (tomonlari teng emas), deltoid
// (teng tomonlar bor, lekin parallelogramm emas), oddiy parallelogramm.
// Chizmada belgi yo'q — figura shakli bilan hukm qilinadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

// Kadr kichraytirildi (o'lchov 2026-08-25): olti figura ikki qatorda turadi.
const F = { fig: 'poly', w: 86, h: 60 };

const DATA = {
  tag: 'rhombus_marked', level: '🟢',
  col: 94, itemSize: 14,
  items: [
    // qiya romb: hamma tomon ~50
    { id: 'i1', hit: true, tokens: [{ ...F, pts: [[14, 49], [34, 13], [77, 13], [57, 49]] }] },
    // to'g'ri to'rtburchak: burchaklari to'g'ri, tomonlari teng emas
    { id: 'i2', tokens: [{ ...F, pts: [[12, 45], [12, 15], [77, 15], [77, 45]] }] },
    // kvadrat — u ham romb
    { id: 'i3', hit: true, tokens: [{ ...F, pts: [[22, 11], [67, 11], [67, 54], [22, 54]] }] },
    // deltoid: teng tomonlar bor, lekin parallelogramm emas
    { id: 'i4', tokens: [{ ...F, pts: [[45, 3], [70, 21], [45, 57], [20, 21]] }] },
    // tik turgan romb (diagonallari tik va yotiq)
    { id: 'i5', hit: true, tokens: [{ ...F, pts: [[45, 6], [79, 32], [45, 57], [10, 32]] }] },
    // oddiy parallelogramm: tomonlari teng emas
    { id: 'i6', tokens: [{ ...F, pts: [[10, 49], [31, 15], [81, 15], [60, 49]] }] },
  ],
  eyebrow: L('Figuralar', 'Фигуры', 'Figures'),
  setup: L(
    "Olti to'rtburchak chizilgan. Uchtasi romb, uchtasi esa yo'q. Romb — tomonlari teng bo'lgan parallelogramm, ya'ni ikki shart birga bajarilishi kerak.",
    'Начерчены шесть четырёхугольников. Три из них ромбы, три нет. Ромб — параллелограмм с равными сторонами, то есть должны выполняться два условия сразу.',
    'Six quadrilaterals are drawn. Three of them are rhombi, three are not. A rhombus is a parallelogram with equal sides, so two conditions must hold together.'),
  ask: L(
    "Romb bo'lgan 3 ta figurani belgilang.",
    'Отметь 3 фигуры, являющиеся ромбами.',
    'Mark the 3 figures that are rhombi.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Romb ikki shartni birga talab qiladi: figura parallelogramm bo'lsin VA to'rt tomoni teng bo'lsin. Uchinchi figura KVADRAT, va u ham romb — uning to'rt tomoni teng. Rad etilganlar: to'g'ri to'rtburchak va oddiy parallelogrammda tomonlar teng emas; deltoidda teng tomonlar QO'SHNI, va figura parallelogramm emas.",
    'Верно. Ромб требует двух условий сразу: фигура должна быть параллелограммом И четыре её стороны равны. Третья фигура — КВАДРАТ, и он тоже ромб: у него четыре равные стороны. Отвергнутые: у прямоугольника и обычного параллелограмма стороны не равны; у дельтоида равные стороны СОСЕДНИЕ, и фигура не параллелограмм.',
    'Correct. A rhombus demands two conditions together: the figure must be a parallelogram AND its four sides equal. The third figure is a SQUARE, and it is a rhombus too: it has four equal sides. The rejected ones: the rectangle and the ordinary parallelogram have unequal sides; the kite has equal ADJACENT sides and is not a parallelogram.'),
  wrongs: [
    { when: (s) => s.miss.indexOf('i3') !== -1, text: L(
      "Kvadrat chetlab o'tildi, lekin U HAM ROMB. Ta'rifni tekshiring: kvadrat parallelogrammmi — ha; uning to'rt tomoni tengmi — ha. Ikkala shart ham bajarildi. Burchaklarning to'g'ri bo'lgani rombga xalaqit bermaydi — u shunchaki QO'SHIMCHA xossa, va aynan shu qo'shimcha kvadratni bir vaqtda ham romb, ham to'g'ri to'rtburchak qiladi.",
      'Квадрат пропущен, а ОН ТОЖЕ РОМБ. Проверь определение: параллелограмм ли квадрат — да; равны ли четыре его стороны — да. Оба условия выполнены. Прямые углы ромбу не мешают — это просто ДОПОЛНИТЕЛЬНОЕ свойство, и именно оно делает квадрат одновременно и ромбом, и прямоугольником.',
      'The square was skipped, yet IT IS A RHOMBUS TOO. Check the definition: is a square a parallelogram — yes; are its four sides equal — yes. Both conditions hold. The right angles do not interfere with being a rhombus — they are simply an EXTRA property, and it is that extra which makes the square both a rhombus and a rectangle at once.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Deltoidda teng tomonlar bor, lekin ular QO'SHNI juftliklar bo'lib turadi, va figura parallelogramm emas: uning hech bir juft tomoni parallel emas. Romb ikki shartni birga talab qiladi. Bu yerda faqat bittasi — tenglik — qisman bajarilgan, va u ham to'rt tomonning hammasi uchun emas.",
      'У дельтоида равные стороны есть, но стоят они СОСЕДНИМИ парами, и фигура не параллелограмм: ни одна пара сторон у неё не параллельна. Ромб требует двух условий сразу. Здесь выполнено лишь одно — равенство, — да и то не для всех четырёх сторон.',
      'The kite does have equal sides, but they stand in ADJACENT pairs, and the figure is not a parallelogram: none of its side pairs is parallel. A rhombus demands two conditions together. Here only one — equality — is met, and not even for all four sides.') },
    { when: (s) => s.extra.indexOf('i2') !== -1 || s.extra.indexOf('i6') !== -1, text: L(
      "Bu figuraning tomonlari TENG EMAS: bo'yi enidan uzun. U parallelogramm (yoki to'g'ri to'rtburchak), lekin romb bo'lish uchun to'rt tomonning hammasi teng bo'lishi kerak. Ko'z bilan tekshiring: yuqori tomonni yon tomon bilan solishtiring — ular sezilarli farq qiladi.",
      'У этой фигуры стороны НЕ РАВНЫ: длина больше ширины. Она параллелограмм (или прямоугольник), но чтобы быть ромбом, все четыре стороны должны быть равны. Проверь глазом: сравни верхнюю сторону с боковой — они заметно различаются.',
      'This figure has UNEQUAL sides: it is longer than it is wide. It is a parallelogram (or a rectangle), but to be a rhombus all four sides must be equal. Check by eye: compare the top side with the side edge — they differ noticeably.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta figura kerak. Har figuraga ikki savol bering: u parallelogrammmi va to'rt tomoni tengmi. Faqat ikkala javob ham «ha» bo'lganda figura romb bo'ladi.",
      'Нужно ровно три фигуры. К каждой задай два вопроса: параллелограмм ли она и равны ли четыре её стороны. Только когда оба ответа «да», фигура ромб.',
      'Exactly three figures are needed. Ask two questions of each: is it a parallelogram, and are its four sides equal. Only when both answers are yes is the figure a rhombus.') },
  ],
  wrongText: L(
    "Ikki shartni birga tekshiring: figura parallelogrammmi va to'rt tomoni tengmi. Kvadrat ikkalasini ham bajaradi.",
    'Проверяй два условия сразу: параллелограмм ли фигура и равны ли четыре её стороны. Квадрат выполняет оба.',
    'Check two conditions together: is the figure a parallelogram, and are its four sides equal. The square meets both.'),
};

export default function D38_01(props) { return <MarkAll data={DATA} {...props} />; }
