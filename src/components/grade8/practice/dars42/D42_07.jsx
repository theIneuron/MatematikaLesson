// Dars42 · Amaliyot 07 — Figuralar · 🟡 🖼 · tag: height_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §4 (42-dars, 7-pozitsiya)
//
// З88 KO'Z BILAN. Sakkiz trapetsiya, har birida bitta kesma
// (`fig.jsx` -> `poly`, `segs`). Balandlik — ikki parallel ASOS orasidagi
// PERPENDIKULYAR masofa, boshqa hech qanday kesma emas.
//
// «TASHQARIDA» HOLATI IKKITA, skelet talab qilgandek: bittasi chapga qiya
// trapetsiyada, ikkinchisi o'ngga qiya trapetsiyada. Ikkitasi kerak, chunki
// bittasi bo'lganda o'quvchi buni bitta g'alati figuraning hodisasi deb
// o'ylashi mumkin; ikki tomonga qiya holat esa buning YO'NALISHGA bog'liq
// emasligini ko'rsatadi. Ilgari bu yerda bittasi turardi, sababi «qolgan
// ikki ichki holatni siqib chiqaradi» edi — endi figuralar oltidan sakkizga
// chiqarildi va kadri ixchamlashtirildi (100x74 dan 100x52 ga: chizmaning
// ustidagi va ostidagi bo'sh joy kesildi, figuraning o'zi emas), ya'ni
// ichki holatlar ham, tashqi holatlar ham to'liq (metodist, 2026-08-25).
//
// Rad etilganlar TO'RT xil, va to'rttasi boshqa-boshqa xato:
//   qiya kesma      — uchdan asosga boradi, lekin tik emas;
//   o'rta chiziq    — asoslarga PARALLEL (43-darsga ko'prik);
//   diagonal        — ikki qarama-qarshi UCHNI tutashtiradi;
//   yon tomonga tik — perpendikulyar, LEKIN asoslarga emas. Eng kuchli
//                     tuzoq: ta'rifning «tik turadi» qismi bajarilgan,
//                     «asoslar orasida» qismi bajarilmagan.
// To'rttasining har biriga o'z razbori bor, shuning uchun to'g'ri javobning
// razbori ularni SANAMAYDI: u faqat balandlikning belgisini aytadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const F = { fig: 'poly', w: 100, h: 52 };
// Odatdagi trapetsiya: pastki asos keng, yuqorisi qisqa.
const T = [[10, 46], [30, 8], [70, 8], [90, 46]];
// Chapga qiya: yuqori asos chapga chiqib ketgan.
const TL = [[30, 46], [10, 8], [50, 8], [90, 46]];
// O'ngga qiya: yuqori asos o'ngga chiqib ketgan (TL ning ko'zgusi).
const TR = [[10, 46], [50, 8], [90, 8], [70, 46]];

const DATA = {
  tag: 'height_marked', level: '🟡',
  col: 108, itemSize: 15,
  items: [
    // balandlik: yuqori asosning chap uchidan pastki asosga tik tushadi
    { id: 'i1', hit: true, tokens: [{ ...F, pts: T, segs: [{ from: [30, 8], to: [30, 46] }] }] },
    // qiya kesma: uchdan pastki asosga boradi, lekin tik emas
    { id: 'i2', tokens: [{ ...F, pts: T, segs: [{ from: [30, 8], to: [52, 46] }] }] },
    // balandlik figuradan TASHQARIDA, chapga qiya trapetsiyada
    // (kesma USLUBI hamma figurada bir xil: punktir qo'yilsa, u «alohida»
    // bo'lib ko'rinardi va javobni ochib qo'yardi)
    { id: 'i3', hit: true, tokens: [{ ...F, pts: TL, segs: [{ from: [10, 8], to: [10, 46] }] }] },
    // o'rta chiziq: asoslarga PARALLEL, balandlik emas
    { id: 'i4', tokens: [{ ...F, pts: T, segs: [{ from: [20, 27], to: [80, 27] }] }] },
    // diagonal
    { id: 'i5', tokens: [{ ...F, pts: T, segs: [{ from: [10, 46], to: [70, 8] }] }] },
    // balandlik: yuqori asosning o'ng uchidan
    { id: 'i6', hit: true, tokens: [{ ...F, pts: T, segs: [{ from: [70, 8], to: [70, 46] }] }] },
    // balandlik figuradan TASHQARIDA, o'ngga qiya trapetsiyada
    { id: 'i7', hit: true, tokens: [{ ...F, pts: TR, segs: [{ from: [90, 8], to: [90, 46] }] }] },
    // YON TOMONGA tik: pastki asosdagi [55,46] dan o'ng yon tomonga
    // perpendikulyar, oyog'i [82,32] — yon tomonning ustida (y=32 da yon
    // tomonning x i 82,6; kesma bilan yon tomonning skalyar ko'paytmasi
    // nolga teng). To'g'ri burchak KVADRATCHA bilan ko'rsatilgan
    // (`fig.jsx` -> `rmark`): perpendikulyarlik ko'rinmasa, tuzoq oddiy
    // qiya kesmadan farq qilmay qolardi va razbordagi «yon tomonga tik»
    // degan gapni o'quvchi tekshirib bo'lmasdi.
    { id: 'i8', tokens: [{ ...F, pts: T, segs: [{ from: [55, 46], to: [82, 32] }], rmark: [{ at: [82, 32], to1: [55, 46], to2: [90, 46] }] }] },
  ],
  eyebrow: L('Figuralar', 'Фигуры', 'Figures'),
  setup: L(
    "Sakkiz trapetsiya chizilgan, har birida bitta kesma. Balandlik — ikki ASOS orasidagi PERPENDIKULYAR masofa, ya'ni u ikkala asosga ham tik turadi.",
    'Начерчены восемь трапеций, в каждой один отрезок. Высота — ПЕРПЕНДИКУЛЯРНОЕ расстояние между ОСНОВАНИЯМИ, то есть она стоит прямо к обоим основаниям.',
    'Eight trapezoids are drawn, each with one segment. The height is the PERPENDICULAR distance between the BASES, that is, it stands square to both of them.'),
  ask: L(
    "Chizilgan kesma BALANDLIK bo'lgan 4 ta figurani belgilang.",
    'Отметь 4 фигуры, где начерченный отрезок является ВЫСОТОЙ.',
    'Mark the 4 figures where the drawn segment is the HEIGHT.'),
  note: L("To'rtta", 'Четыре', 'Four'),
  correctText: L(
    "To'g'ri. Belgilangan to'rttasida kesma ikki asosga ham tik turadi, ya'ni ular orasidagi eng qisqa masofani o'lchaydi. Ikkitasida balandlik figuraning ichida, ikkitasida tashqarisida tushadi — biri chapga, biri o'ngga qiya trapetsiyada. Tashqarida tushishi hech narsani o'zgartirmaydi: masofa ikki PARALLEL CHIZIQ orasida o'lchanadi, va bunday trapetsiyaning yuzi ham o'sha formula bilan topiladi.",
    'Верно. У отмеченных четырёх отрезок стоит прямо к обоим основаниям, то есть измеряет кратчайшее расстояние между ними. У двух высота падает внутри фигуры, у двух вне — одна трапеция наклонена влево, другая вправо. То, что высота падает вне, ничего не меняет: расстояние измеряется между двумя ПАРАЛЛЕЛЬНЫМИ ПРЯМЫМИ, и площадь такой трапеции находится по той же формуле.',
    'Correct. In the four marked ones the segment stands square to both bases, so it measures the shortest distance between them. In two the height falls inside the figure, in two outside — one trapezoid leans left, the other right. Falling outside changes nothing: the distance is measured between two PARALLEL LINES, and the area of such a trapezoid is found by the same formula.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i8') !== -1, text: L(
      "Bu kesma haqiqatan perpendikulyar, lekin YON TOMONGA: pastki uchi pastki asosda, yuqori uchi esa yon tomonning ustida, va u yon tomon bilan to'g'ri burchak tashkil qiladi. Balandlik esa ikki ASOS orasidagi masofa. Ta'rifning «tik turadi» qismi bajarilgan, «asoslar orasida» qismi bajarilmagan.",
      'Этот отрезок действительно перпендикулярен, но БОКОВОЙ СТОРОНЕ: нижний конец на нижнем основании, верхний на боковой стороне, и прямой угол он образует с ней. А высота — расстояние между ОСНОВАНИЯМИ. Часть определения «стоит прямо» выполнена, часть «между основаниями» нет.',
      'This segment really is perpendicular, but to the LEG: its lower end is on the lower base, its upper end on the leg, and the right angle it makes is with the leg. The height, though, is the distance between the BASES. The part of the definition that says square holds; the part that says between the bases does not.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Bu kesma ikki yon tomonning o'rtalarini tutashtiradi va asoslarga PARALLEL turadi — bu o'rta chiziq. Balandlik esa aksincha: asoslarga tik. Ikki chiziqni bir-biri bilan almashtirib bo'lmaydi, ular hatto perpendikulyar yo'nalishda.",
      'Этот отрезок соединяет середины боковых сторон и идёт ПАРАЛЛЕЛЬНО основаниям — это средняя линия. А высота наоборот: она перпендикулярна основаниям. Эти две линии не заменяют друг друга, они даже направлены перпендикулярно.',
      'This segment joins the midpoints of the legs and runs PARALLEL to the bases — it is the midline. The height is the opposite: square to the bases. The two lines cannot stand in for each other, they even run at right angles.') },
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Bu kesma yuqori asosdan pastki asosga boradi, lekin QIYA. Balandlik ikki asos orasidagi eng qisqa masofa, qiya kesma esa har doim undan uzun. Kesmaning pastki asos bilan tashkil qilgan burchagiga qarang — u to'g'ri emas.",
      'Этот отрезок идёт от верхнего основания к нижнему, но НАКЛОННО. Высота — кратчайшее расстояние между основаниями, а наклонный отрезок всегда длиннее. Посмотри на угол между отрезком и нижним основанием — он не прямой.',
      'This segment runs from the upper base to the lower one, but SLANTED. The height is the shortest distance between the bases, and a slanted segment is always longer. Look at the angle it makes with the lower base — it is not right.') },
    { when: (s) => s.extra.indexOf('i5') !== -1, text: L(
      "Bu diagonal: u ikki qarama-qarshi UCHNI tutashtiradi. Diagonal trapetsiyani ikki uchburchakka bo'lish uchun kerak (yuza formulasi shundan chiqadi), lekin uning uzunligi balandlik emas.",
      'Это диагональ: она соединяет две противоположные ВЕРШИНЫ. Диагональ нужна, чтобы разбить трапецию на два треугольника (так выводится формула площади), но её длина не высота.',
      'This is a diagonal: it joins two opposite VERTICES. A diagonal is needed to split the trapezoid into two triangles (that is how the area formula comes out), but its length is not the height.') },
    { when: (s) => s.miss.indexOf('i3') !== -1 || s.miss.indexOf('i7') !== -1, text: L(
      "Figura kesma uning tashqarisida turgani uchun chetlab o'tildi. Lekin balandlik ikki PARALLEL CHIZIQ orasidagi masofa: asoslar ikki parallel chiziqda yotadi, va masofani qayerda o'lchash ahamiyatsiz. Bunday figura ikkita — biri chapga, biri o'ngga qiya, ya'ni bu qiyalikning yo'nalishiga bog'liq emas.",
      'Фигура пропущена потому, что отрезок стоит вне неё. Но высота — расстояние между двумя ПАРАЛЛЕЛЬНЫМИ ПРЯМЫМИ: основания лежат на двух параллельных прямых, и где измерять это расстояние, неважно. Таких фигур две — одна наклонена влево, другая вправо, то есть от направления наклона это не зависит.',
      'The figure was skipped because the segment stands outside it. But the height is the distance between two PARALLEL LINES: the bases lie on two parallel lines, and where that distance is measured does not matter. There are two such figures — one leaning left, one right — so it does not depend on the lean either.') },
    { when: (s) => s.marked.length !== 4, text: L(
      "Aynan to'rtta figura kerak. Har kesmaga bitta savol bering: u ikki ASOSGA tik turadimi? Kesma figuraning ichida yoki tashqarisida turishi javobni o'zgartirmaydi.",
      'Нужно ровно четыре фигуры. К каждому отрезку задай один вопрос: стоит ли он прямо к обоим ОСНОВАНИЯМ? Внутри фигуры он стоит или вне — ответа это не меняет.',
      'Exactly four figures are needed. Ask one question of every segment: does it stand square to both BASES? Whether it stands inside the figure or outside changes nothing.') },
  ],
  wrongText: L(
    "Kesma ikki ASOSGA tik turishi kerak. Parallel kesma — o'rta chiziq, uchni uchga tutashtirgani — diagonal, yon tomonga tik turgani esa asoslar orasidagi masofa emas.",
    'Отрезок должен стоять прямо к обоим ОСНОВАНИЯМ. Параллельный отрезок — средняя линия, соединяющий вершины — диагональ, а перпендикулярный боковой стороне — не расстояние между основаниями.',
    'The segment must stand square to both BASES. A parallel segment is the midline, one joining vertices is a diagonal, and one perpendicular to a leg is not the distance between the bases.'),
};

export default function D42_07(props) { return <MarkAll data={DATA} {...props} />; }
