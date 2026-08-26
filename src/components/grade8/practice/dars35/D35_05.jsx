// Dars35 · Amaliyot 05 — Pazl · 🟡 · tag: row_to_median
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §7 (35-dars, 5-pozitsiya)
//
// UCH QATOR, UCH XIL HOL:
//   1,3,5   — toq, mediana o'rtadagi son: 3
//   1,3,5,7 — birinchisiga BITTA son qo'shildi, va mediana qatorda YO'Q
//             songa aylandi: (3+5):2 = 4   (T3, З72)
//   2,2,8   — toq, mediana takrorlangan son: 2
// Birinchi ikkitasi ataylab yonma-yon: bitta son qo'shilishi medianani
// qatordan chiqarib yuboradi.
//
// Kartalarda yozuv bo'shliqsiz (skelet §0a.5).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'row_to_median', level: '🟡',
  faceSize: 13, faceSizePhone: 11,
  cards: [
    { id: 'f1', side: 0, tokens: ['1,3,5'] },
    { id: 'f2', side: 0, tokens: ['1,3,5,7'] },
    { id: 'f3', side: 0, tokens: ['2,2,8'] },
    { id: 'v1', side: 1, v: '3' },
    { id: 'v2', side: 1, v: '4' },
    { id: 'v3', side: 1, v: '2' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch qator o'sish tartibida yozilgan, va har biriga mediana topish kerak. Ikkinchi qator birinchisidan bitta son bilan farq qiladi.",
    'Три ряда записаны по возрастанию, и к каждому надо найти медиану. Второй ряд отличается от первого одним числом.',
    'Three series are written in increasing order, and a median must be found for each. The second series differs from the first by one number.'),
  ask: L(
    'Qatorni bosing, keyin uyani bosing.',
    'Нажми ряд, потом ячейку.',
    'Tap a series, then a slot.'),
  bank: L('Qatorlar', 'Ряды', 'Series'),
  correctText: L(
    "To'g'ri. Birinchi qatorda uchta son bor — toq, ya'ni o'rtadagisi olinadi: uch. Ikkinchi qatorda o'sha uchta son turibdi, ustiga yettilik qo'shilgan — endi to'rtta son bor, ya'ni juft, va bitta o'rta yo'q. O'rtadagi ikki son uch va besh, ularning o'rtachasi to'rt. Diqqat qiling: to'rtlik bu qatorda umuman yo'q, lekin mediana aynan to'rt. Uchinchi qatorda yana uchta son, o'rtadagisi ikki — u takrorlangan son, va bu hech narsani buzmaydi. Ya'ni birinchi qadam har doim bir xil: nechta son borligini sanash va toq-juftligini aniqlash.",
    'Верно. В первом ряду три числа — нечётное количество, значит берётся срединное: три. Во втором те же три числа, к ним добавлена семёрка — теперь чисел четыре, количество чётное, и единого центра нет. Срединные два — три и пять, их среднее четыре. Обрати внимание: четвёрки в этом ряду нет вовсе, а медиана именно четыре. В третьем ряду снова три числа, срединное два — это повторяющееся число, и оно ничего не портит. То есть первый шаг всегда один: сосчитать, сколько чисел, и определить чётность.',
    'Correct. The first series has three numbers — an odd count, so the middle one is taken: three. The second holds the same three numbers with a seven added — now there are four, an even count, and there is no single centre. The middle two are three and five, whose mean is four. Note: there is no four in that series at all, yet the median is exactly four. The third series has three numbers again and the middle one is two — a repeated number, which spoils nothing. So the first step is always the same: count the numbers and see whether the count is odd or even.'),
  wrongs: [
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Ikkinchi qatorda TO'RTTA son bor, ya'ni sanoq juft va bitta o'rta yo'q. O'rtadagi ikki son — uch va besh, — va mediana ularning o'rtachasi: sakkiz bo'lingan ikki to'rt. To'rtlik qatorda ko'rinmaydi, lekin bu xato emas: juft qatorda mediana odatda yangi son bo'lib chiqadi. Birinchi qator bilan solishtiring — u yerda uchta son bor edi va mediana uch edi; bitta son qo'shilishi javobni almashtirdi.",
      'Во втором ряду ЧЕТЫРЕ числа, значит количество чётное и единого центра нет. Срединные два — три и пять, — и медиана их среднее: восемь делить на два четыре. Четвёрки в ряду не видно, но это не ошибка: в чётном ряду медиана обычно оказывается новым числом. Сравни с первым рядом — там было три числа и медиана три; добавление одного числа поменяло ответ.',
      'The second series has FOUR numbers, so the count is even and there is no single centre. The middle two are three and five, and the median is their mean: eight divided by two is four. No four is visible in the series, but that is no error: in an even series the median usually turns out to be a new number. Compare with the first series — three numbers there and a median of three; adding one number changed the answer.') },
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Uchinchi qatorda uchta son bor va o'rtadagisi ikki. Takrorlangan sonlar medianani buzmaydi: mediana o'rinni oladi, va ikkinchi o'rinda ikkilik turibdi. Sakkizlik katta bo'lgani bilan hech narsani o'zgartirmaydi — u chetda turibdi, va mediana chetdagi sonlarga qaramaydi.",
      'В третьем ряду три числа, и срединное два. Повторяющиеся числа медиану не портят: медиана берёт место, а на втором месте стоит двойка. То, что восьмёрка велика, ничего не меняет — она с краю, а медиана на крайние числа не смотрит.',
      'The third series has three numbers and the middle one is two. Repeated numbers do not spoil the median: it takes a position, and in the second position stands a two. That the eight is large changes nothing — it sits at the edge, and the median does not look at the edges.') },
    { when: (s) => s.mate.f1 !== 'v1', text: L(
      "Birinchi qator eng oddiysi: uchta son, o'rtadagisi uch. Toq sanoqda mediana har doim qatorning o'z soni bo'ladi va uni izlash uchun hisoblash kerak emas — faqat o'rtadagi o'rinni topish kerak. Uchta sonda bu ikkinchi o'rin.",
      'Первый ряд самый простой: три числа, срединное три. При нечётном количестве медиана всегда число самого ряда, и искать её вычислением не нужно — надо лишь найти срединное место. При трёх числах это второе место.',
      'The first series is the simplest: three numbers, the middle one is three. With an odd count the median is always a number of the series and no computing is needed — only the middle position must be found. With three numbers that is the second place.') },
  ],
  wrongText: L(
    "Har qatorda avval sonlarni sanang. Toq bo'lsa o'rtadagisini oling, juft bo'lsa o'rtadagi ikkitasini qo'shib ikkiga bo'ling.",
    'В каждом ряду сначала сосчитай числа. Нечётное количество — бери срединное, чётное — сложи два срединных и раздели на два.',
    'In every series count the numbers first. An odd count means take the middle one; an even count means add the middle two and divide by two.'),
};

export default function D35_05(props) { return <PairSlots data={DATA} {...props} />; }
