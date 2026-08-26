// Dars37 · Amaliyot 09 — Tartib · 🔴 · tag: proof_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §9 (37-dars, 9-pozitsiya)
//
// «QARAMA-QARSHI TOMONLAR TENG» ISBOTI, TO'RT QADAM:
//   diagonal -> almashinuvchi burchaklar -> uchburchaklar teng -> tomonlar
// З78 aynan shu yerda: xulosani uchburchaklar tengligidan OLDIN qo'yish.
// O'shanda tomonlarning tengligi HECH NARSADAN chiqadi, ya'ni isbot
// isbot bo'lmay qoladi.
//
// Diagonalni oxirga surish ham xato: isbot boshlanadigan chiziq shu, va
// usiz umuman uchburchak paydo bo'lmaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'proof_steps', level: '🔴',
  expr: ['ABCD'], exprSize: 26,
  itemSize: 11,
  cards: [
    { id: 'l1', tokens: ['AC'],
      label: L("diagonalni o'tkazamiz", 'проводим диагональ', 'draw the diagonal') },
    { id: 'l2', tokens: ['∠1 = ∠2,  ∠3 = ∠4'],
      label: L('almashinuvchi burchaklar teng', 'накрест лежащие углы равны', 'the alternate angles are equal') },
    { id: 'l3', tokens: ['△ABC = △CDA'],
      label: L('uchburchaklar teng', 'треугольники равны', 'the triangles are equal') },
    { id: 'l4', tokens: ['AB = CD,  BC = AD'],
      label: L('mos tomonlar teng', 'соответственные стороны равны', 'the matching sides are equal') },
  ],
  start: ['l3', 'l4', 'l1', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "ABCD parallelogrammda qarama-qarshi tomonlar teng ekanini isbotlaymiz. Isbot to'rt qadamda boradi, lekin qadamlar aralashib ketgan. Har qadam oldingisining natijasiga tayanadi.",
    'Докажем, что в параллелограмме ABCD противоположные стороны равны. Доказательство идёт в четыре шага, но шаги перепутаны. Каждый шаг опирается на результат предыдущего.',
    'We prove that in the parallelogram ABCD the opposite sides are equal. The proof takes four steps, but the steps are mixed up. Each step rests on the result of the one before.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Isbot diagonaldan boshlanadi: AC parallelogrammni ikki uchburchakka bo'ladi, va solishtiradigan narsa paydo bo'ladi. Keyin parallellikdan foydalanamiz: almashinuvchi burchaklar teng. Undan uchburchaklarning tengligi chiqadi — ikki burchak va umumiy tomon AC. Va faqat SHUNDAN KEYIN mos tomonlar teng deb yoziladi. Xulosani oldinga surish yozuvni isbotga o'xshatadi, lekin isbot qilmaydi.",
    'Верно. Доказательство начинается с диагонали: AC разбивает параллелограмм на два треугольника, и появляется то, что можно сравнивать. Потом пользуемся параллельностью: накрест лежащие углы равны. Отсюда выводим равенство треугольников — два угла и общая сторона AC. И только ПОСЛЕ ЭТОГО пишем равенство соответственных сторон. Сдвинув вывод вперёд, получишь запись, похожую на доказательство, но не доказательство.',
    'Correct. The proof begins with the diagonal: AC splits the parallelogram into two triangles, and something to compare appears. Then we use the parallelism: the alternate angles are equal. From this the triangles are equal — two angles and the common side AC. And only AFTER THAT do we write that the matching sides are equal. Moving the conclusion forward makes the record look like a proof without being one.'),
  wrongs: [
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Xulosa uchburchaklar tengligidan OLDIN turibdi, ya'ni tomonlarning tengligi hech narsadan chiqyapti. Isbotda har qator o'zidan oldingi qatorga tayanishi kerak: AB va CD teng, CHUNKI ular teng uchburchaklarning mos tomonlari. Bu «chunki» ni olib tashlasangiz, qolgan narsa da'vo bo'ladi, isbot emas.",
      'Вывод стоит ПЕРЕД равенством треугольников, то есть равенство сторон получается из ничего. В доказательстве каждая строка обязана опираться на предыдущую: AB и CD равны, ПОТОМУ ЧТО это соответственные стороны равных треугольников. Убери это «потому что», и останется утверждение, а не доказательство.',
      'The conclusion stands BEFORE the equality of the triangles, so the equality of the sides comes from nothing. In a proof every line must rest on the one before: AB and CD are equal BECAUSE they are matching sides of equal triangles. Remove that «because» and what remains is a claim, not a proof.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Uchburchaklarning tengligi BURCHAKLARDAN keyin chiqadi: tenglik belgisini asoslash uchun ikki burchak va umumiy tomon kerak. Burchaklarsiz uchburchaklarda faqat bitta umumiy tomon bo'ladi — AC, — va bitta tomon tenglikni bermaydi.",
      'Равенство треугольников выводится ПОСЛЕ углов: чтобы обосновать признак, нужны два угла и общая сторона. Без углов у треугольников есть лишь одна общая сторона — AC, — а одной стороны для равенства мало.',
      'The equality of the triangles follows AFTER the angles: to justify the criterion you need two angles and the common side. Without the angles the triangles share only one side — AC — and one side does not give equality.') },
    { when: (s) => s.pos.l1 !== 1, text: L(
      "Diagonal BIRINCHI o'tkaziladi: usiz uchburchak ham, almashinuvchi burchak ham yo'q. Diagonal isbotning asbobidir — u figurani ikki bo'lakka ajratadi va parallellikni burchaklar tiliga o'giradi. Boshlanish shu yerda.",
      'Диагональ проводится ПЕРВОЙ: без неё нет ни треугольников, ни накрест лежащих углов. Диагональ — инструмент доказательства: она делит фигуру надвое и переводит параллельность на язык углов. Начало именно здесь.',
      'The diagonal is drawn FIRST: without it there are neither triangles nor alternate angles. The diagonal is the instrument of the proof — it splits the figure in two and translates parallelism into the language of angles. That is where it begins.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Almashinuvchi burchaklar DIAGONALDAN keyin paydo bo'ladi: ular parallel to'g'ri chiziqlarni kesuvchi bilan hosil bo'ladi, va bu yerda kesuvchi aynan AC. Diagonal chizilmagunicha kesuvchi yo'q, ya'ni almashinuvchi burchaklar haqida gapirish mumkin emas.",
      'Накрест лежащие углы появляются ПОСЛЕ диагонали: они образуются при пересечении параллельных прямых секущей, и здесь секущая — именно AC. Пока диагональ не проведена, секущей нет, а значит и говорить о накрест лежащих углах нельзя.',
      'The alternate angles appear AFTER the diagonal: they arise where a transversal crosses parallel lines, and here the transversal is AC. Until the diagonal is drawn there is no transversal, so alternate angles cannot be spoken of.') },
  ],
  wrongText: L(
    "Diagonal birinchi, xulosa oxirgi. Har qadam oldingisiga tayanadi: burchaklarsiz uchburchaklar teng emas, uchburchaklarsiz tomonlar teng emas.",
    'Диагональ первой, вывод последним. Каждый шаг опирается на предыдущий: без углов нет равенства треугольников, без треугольников нет равенства сторон.',
    'The diagonal first, the conclusion last. Each step rests on the one before: without the angles the triangles are not equal, without the triangles the sides are not equal.'),
};

export default function D37_09(props) { return <SwapOrder data={DATA} {...props} />; }
