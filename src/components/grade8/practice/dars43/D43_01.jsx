// Dars43 · Amaliyot 01 — Figuralar · 🟢 🖼 · tag: midline_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §5 (43-dars, 1-pozitsiya)
//
// TA'RIFDA IKKI SHART: kesmaning IKKI uchi ham tomonlarning O'RTASIDA.
// Uchta o'rta chiziq uchta boshqa tomonga parallel — ya'ni «o'rta chiziq»
// bitta emas, uchburchakda ularning uchtasi bor.
//
// Rad etilganlar uch xil: mediana (bir uchi UCHDA), asosga parallel, lekin
// pastdan o'tgan kesma (uchlari chorak nuqtalarda), va uchga yaqin turgan
// qiya kesma.
//
// O'RTA NUQTA BILAN BELGILANGAN (`mids`, umumiy qatlamga 2026-08-25 da
// qo'shildi). Ilgari bu yerda belgi yo'q edi va o'rta bilan chorakning
// farqini o'quvchi KO'Z bilan hal qilardi — ya'ni topshiriq ta'rifni emas,
// ko'zni tekshirardi. Endi uch tomonning o'rtasi ham nuqta bilan turadi va
// hamma oltita figurada bir xil: nuqtalar javobni ochib qo'ymaydi (ular
// hamma joyda bir xil), lekin «kesmaning uchi o'rtadami» degan savol
// TAXMIN emas, TEKSHIRUV bo'lib qoladi. Shtrix qo'yilmadi: shtrix
// tomonlarning TENGLIGINI bildiradi, o'rtasini emas — izohi `fig.jsx` da.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const F = { fig: 'poly', w: 100, h: 74, mids: [0, 1, 2] };
const T = [[12, 62], [46, 14], [88, 62]];   // A, B, C
// O'rtalar: AB -> [29,38], BC -> [67,38], AC -> [50,62]
// Chorak nuqtalar: AB da [20,50] va [38,26]; BC da [56,26] va [78,50]

const DATA = {
  tag: 'midline_marked', level: '🟢',
  col: 108, itemSize: 15,
  items: [
    // o'rta chiziq: AB va BC ning o'rtalari, AC ga parallel
    { id: 'i1', hit: true, tokens: [{ ...F, pts: T, segs: [{ from: [29, 38], to: [67, 38] }] }] },
    // mediana: B uchidan AC ning o'rtasiga
    { id: 'i2', tokens: [{ ...F, pts: T, segs: [{ from: [46, 14], to: [50, 62] }] }] },
    // o'rta chiziq: AB va AC ning o'rtalari, BC ga parallel
    { id: 'i3', hit: true, tokens: [{ ...F, pts: T, segs: [{ from: [29, 38], to: [50, 62] }] }] },
    // AC ga parallel, lekin uchlari chorak nuqtalarda — pastda o'tadi
    { id: 'i4', tokens: [{ ...F, pts: T, segs: [{ from: [20, 50], to: [78, 50] }] }] },
    // o'rta chiziq: BC va AC ning o'rtalari, AB ga parallel
    { id: 'i5', hit: true, tokens: [{ ...F, pts: T, segs: [{ from: [67, 38], to: [50, 62] }] }] },
    // uchga yaqin qiya kesma: AB ning uchdan uchi, BC ning choragi
    { id: 'i6', tokens: [{ ...F, pts: T, segs: [{ from: [38, 26], to: [56, 26] }] }] },
  ],
  eyebrow: L('Figuralar', 'Фигуры', 'Figures'),
  setup: L(
    "Olti uchburchak chizilgan, har birida bitta kesma. Har tomonning o'rtasi nuqta bilan belgilangan. O'rta chiziq ikki tomonning O'RTALARINI tutashtiradi — ikki uchi ham nuqtada bo'lishi kerak, bittasi emas.",
    'Начерчены шесть треугольников, в каждом один отрезок. Середина каждой стороны отмечена точкой. Средняя линия соединяет СЕРЕДИНЫ двух сторон — оба её конца должны быть в точках, а не один.',
    'Six triangles are drawn, each with one segment. The midpoint of each side is marked with a dot. A midline joins the MIDPOINTS of two sides — both its ends must be at the dots, not just one.'),
  ask: L(
    "Chizilgan kesma O'RTA CHIZIQ bo'lgan 3 ta figurani belgilang.",
    'Отметь 3 фигуры, где начерченный отрезок является СРЕДНЕЙ ЛИНИЕЙ.',
    'Mark the 3 figures where the drawn segment is a MIDLINE.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uchburchakda o'rta chiziq uchta bo'ladi: har juft tomonning o'rtalarini tutashtirgan kesma uchinchi tomonga parallel bo'ladi. Belgilangan uchtasi aynan shu uchtasi, va ularning har biri boshqa tomonga parallel. Rad etilganlar uch xil sababdan: birinchisining bir uchi tomonning o'rtasida emas, UCHDA — bu mediana, va u uchinchi tomonga parallel emas. Ikkinchisi tomonga parallel, lekin uchlari o'rtada emas, chorak nuqtalarda — u uchinchi tomonning yarmiga teng bo'lmaydi. Uchinchisi uchga yaqin turadi va uning uchlari ham o'rtada emas.",
    'Верно. В треугольнике средних линий три: отрезок, соединяющий середины каждой пары сторон, параллелен третьей стороне. Отмеченные три — это именно они, и каждая параллельна другой стороне. Отвергнутые отличаются по трём причинам: у первого один конец не в середине стороны, а в ВЕРШИНЕ — это медиана, и третьей стороне она не параллельна. Второй параллелен стороне, но концы у него не в серединах, а в четвертных точках — половине третьей стороны он не равен. Третий стоит близко к вершине, и его концы тоже не в серединах.',
    'Correct. A triangle has three midlines: the segment joining the midpoints of each pair of sides is parallel to the third side. The three marked ones are exactly those, each parallel to a different side. The rejected ones differ for three reasons: the first has one end not at a midpoint but at a VERTEX — that is a median, and it is not parallel to the third side. The second is parallel to a side, but its ends are at quarter points, not midpoints — it does not equal half the third side. The third sits near the apex and its ends are not at midpoints either.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Bu kesmaning bir uchi belgilangan nuqtada, ikkinchisi esa UCHDA. Bunday kesma mediana deyiladi. Ta'rif esa ikki uchni ham talab qiladi: mediana uchinchi tomonga parallel emas va uning yarmiga teng ham emas.",
      'У этого отрезка один конец в отмеченной точке, а второй в ВЕРШИНЕ. Такой отрезок называется медианой. Определение же требует оба конца: медиана не параллельна третьей стороне и её половине не равна.',
      'This segment has one end at a marked dot and the other at a VERTEX. Such a segment is called a median. The definition demands both ends: a median is neither parallel to the third side nor equal to half of it.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Bu kesma pastki tomonga parallel, lekin uchlari belgilangan nuqtalarda emas — ular nuqtalardan pastda, chorak nuqtalarda. Parallellikning o'zi yetarli emas: uchinchi tomonning yarmiga teng bo'lish uchun kesma aynan o'rtalardan o'tishi kerak. Bunday kesma uzunroq chiqadi.",
      'Этот отрезок параллелен нижней стороне, но концы у него не в отмеченных точках — они заметно ниже, в четвертных точках. Одной параллельности мало: чтобы отрезок был равен половине третьей стороны, он должен проходить именно через середины. Такой отрезок выходит длиннее.',
      'This segment is parallel to the lower side, but its ends are not at the marked dots — they sit well below, at quarter points. Parallelism alone is not enough: to equal half the third side the segment must pass through the midpoints. Such a segment comes out longer.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Bu kesma uchburchakning uchiga juda yaqin: uning uchlari belgilangan nuqtalarga yetmaydi, ular uch bilan nuqtaning orasida turadi. Tekshirish taxminga qolmaydi — kesmaning uchi nuqtaning ustida turishi kerak, bu yerda esa undan yuqorida.",
      'Этот отрезок стоит совсем близко к вершине: его концы не доходят до отмеченных точек, они между вершиной и точкой. Проверка не остаётся на глазок — конец отрезка должен стоять на точке, а здесь он выше неё.',
      'This segment sits very close to the apex: its ends fall short of the marked dots, between the vertex and the dot. Checking is not left to the eye — the end of the segment must sit on the dot, and here it sits above it.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta figura kerak. Har kesmaga ikki savol bering: birinchi uchi belgilangan nuqtadami, ikkinchi uchi ham nuqtadami? Faqat ikkala javob «ha» bo'lganda kesma o'rta chiziq bo'ladi.",
      'Нужно ровно три фигуры. К каждому отрезку задай два вопроса: первый конец в отмеченной точке, второй конец тоже в точке? Только когда оба ответа «да», отрезок является средней линией.',
      'Exactly three figures are needed. Ask two questions of every segment: is the first end on a dot, and is the second end on a dot too? Only when both answers are yes is the segment a midline.') },
  ],
  wrongText: L(
    "Kesmaning IKKI uchini alohida tekshiring: uch emas, chorak emas — aynan belgilangan nuqta.",
    'Проверяй ОБА конца отрезка отдельно: не вершина, не четверть — именно отмеченная точка.',
    'Check BOTH ends of the segment separately: not a vertex, not a quarter — exactly the marked dot.'),
};

export default function D43_01(props) { return <MarkAll data={DATA} {...props} />; }
