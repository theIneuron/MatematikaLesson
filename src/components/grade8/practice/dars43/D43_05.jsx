// Dars43 · Amaliyot 05 — Tartib · 🟡 · tag: split_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §5 (43-dars, 5-pozitsiya)
//
// FALYES TEOREMASINING AMALDAGI ISHI: kesmani teng bo'laklarga bo'lish
// (darslikning yasashi). Bu yerda teorema TESKARI yo'nalishda ishlatiladi —
// biz teng kesmalarni O'ZIMIZ yasaymiz (nurda), keyin ular parallel chiziqlar
// orqali berilgan kesmaga ko'chadi.
//
// З89 tartibda ko'rinadi: parallel chiziqlarni teng kesmalardan OLDIN
// o'tkazsangiz, nimaga parallel qilish kerakligi ma'lum bo'lmaydi. Nurni
// oxirga surish ham xato: yasash shundan boshlanadi.
// Boshlang'ich tartib QAT'IY (`start`).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'split_steps', level: '🟡',
  expr: ['AB : 3'], exprSize: 24,
  itemSize: 13,
  cards: [
    { id: 'l1', tokens: ['l'], label: L("A uchidan nur o'tkazamiz", 'из вершины A проводим луч', 'draw a ray from the vertex A') },
    { id: 'l2', tokens: ['3 × k'], label: L('nurda uchta teng kesma belgilaymiz', 'на луче отмечаем три равных отрезка', 'mark three equal segments on the ray') },
    { id: 'l3', tokens: ['∥'], label: L("parallel chiziqlar o'tkazamiz", 'проводим параллельные прямые', 'draw the parallel lines') },
    { id: 'l4', tokens: ['AB : 3'], label: L("kesma uch teng bo'lakka bo'linadi", 'отрезок делится на три равные части', 'the segment is split into three equal parts') },
  ],
  start: ['l3', 'l1', 'l4', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "AB kesmasini uch teng bo'lakka bo'lish kerak, lekin uzunligi butun songa bo'linmaydi — o'lchab bo'lmaydi. Falyes teoremasi buni o'lchamasdan bajaradi. To'rt qadam aralashib ketgan.",
    'Отрезок AB нужно разделить на три равные части, но его длина на целое не делится — измерить не получится. Теорема Фалеса делает это без измерения. Четыре шага перепутаны.',
    'The segment AB must be split into three equal parts, but its length is not a whole number — measuring will not do. The Thales theorem does it without measuring. The four steps are mixed up.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Yasash shu tartibda boradi. Avval A uchidan ixtiyoriy nur o'tkazamiz — u AB bilan bir chiziqda bo'lmasa kifoya, boshqa hech qanday shart yo'q. Keyin nurda uchta TENG kesma belgilaymiz: bu bizning ishimiz, ularni sirkul yoki chizg'ich bilan bemalol teng qilish mumkin. Undan keyin oxirgi nuqtani B bilan tutashtirib, qolgan ikki nuqtadan shu chiziqqa PARALLEL chiziqlar o'tkazamiz. Va faqat shundan keyin xulosa: Falyes teoremasi bo'yicha parallel chiziqlar AB dan ham teng kesmalar ajratadi, ya'ni kesma uch teng bo'lakka bo'lindi. Diqqat qiladigan joy: biz teng kesmalarni NURDA yasaymiz, chunki u yerda uzunlikni tanlash bizning qo'limizda.",
    'Верно. Построение идёт в таком порядке. Сначала из вершины A проводим произвольный луч — достаточно, чтобы он не лежал на одной прямой с AB, других условий нет. Потом на луче отмечаем три РАВНЫХ отрезка: это наша работа, их легко сделать равными циркулем или линейкой. Затем соединяем последнюю точку с B и через две остальные проводим прямые, ПАРАЛЛЕЛЬНЫЕ этой. И только после этого вывод: по теореме Фалеса параллельные прямые отсекают равные отрезки и на AB, то есть отрезок разделён на три равные части. На что стоит обратить внимание: равные отрезки мы строим НА ЛУЧЕ, потому что там длину выбираем мы сами.',
    'Correct. The construction runs in this order. First draw an arbitrary ray from the vertex A — it only needs to avoid lying on the line AB, there is no other condition. Then mark three EQUAL segments on the ray: that is our own work, and a compass or ruler makes them equal easily. Next join the last point to B and through the other two draw lines PARALLEL to it. And only then the conclusion: by the Thales theorem the parallel lines cut equal segments on AB as well, so the segment is split into three equal parts. Worth noticing: we build the equal segments ON THE RAY, because there the length is ours to choose.'),
  wrongs: [
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Parallel chiziqlarni teng kesmalardan OLDIN o'tkazib bo'lmaydi: hali nimaga parallel qilish kerakligi ma'lum emas. Parallellik oxirgi nuqtani B bilan tutashtirgan chiziqdan olinadi, u chiziq esa teng kesmalar belgilangandan keyin paydo bo'ladi.",
      'Параллельные прямые нельзя проводить РАНЬШЕ равных отрезков: ещё неизвестно, чему их делать параллельными. Направление берётся от прямой, соединяющей последнюю точку с B, а она появляется после того, как равные отрезки отмечены.',
      'The parallel lines cannot be drawn BEFORE the equal segments: it is not yet known what they should be parallel to. The direction comes from the line joining the last point to B, and that line appears only after the equal segments are marked.') },
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Xulosadan boshlab bo'lmaydi: kesma hali bo'linmagan, biz uni bo'lish ustida ishlayapmiz. Oxirgi qadam — natija, birinchi qadam esa yasashning boshlanishi.",
      'Начинать с вывода нельзя: отрезок ещё не разделён, мы только работаем над этим. Последний шаг — результат, а первый шаг — начало построения.',
      'You cannot start from the conclusion: the segment is not divided yet, we are still working on it. The last step is the result; the first step is where the construction begins.') },
    { when: (s) => s.pos.l1 > s.pos.l2, text: L(
      "Teng kesmalarni nur o'tkazilmasdan belgilab bo'lmaydi: ular NURDA yotadi. Birinchi qadam — nur, ikkinchisi — nurdagi uch teng kesma.",
      'Равные отрезки нельзя отметить, не проведя луч: они лежат НА ЛУЧЕ. Первый шаг — луч, второй — три равных отрезка на нём.',
      'The equal segments cannot be marked without the ray: they lie ON it. The first step is the ray, the second the three equal segments on it.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Xulosani parallel chiziqlardan oldin qo'yib bo'lmaydi. Kesma teng bo'laklarga aynan parallel chiziqlar tufayli bo'linadi — Falyes teoremasining sharti shu, va shart bajarilmasa xulosa ham yo'q.",
      'Вывод нельзя ставить раньше параллельных прямых. Отрезок делится на равные части именно благодаря им — это условие теоремы Фалеса, а без условия нет и вывода.',
      'The conclusion cannot come before the parallel lines. The segment is split into equal parts precisely because of them — that is the condition of the Thales theorem, and without the condition there is no conclusion.') },
  ],
  wrongText: L(
    "Har qadamdan bitta savol so'rang: buni bajarish uchun nima allaqachon chizilgan bo'lishi kerak?",
    'Спроси у каждого шага: что должно быть уже начерчено, чтобы его сделать?',
    'Ask every step: what must already be drawn to do it?'),
};

export default function D43_05(props) { return <SwapOrder data={DATA} {...props} />; }
