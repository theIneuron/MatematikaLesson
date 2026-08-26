// Dars53 · Amaliyot 01 — Teng vektor · 🟢 🖼 · tag: which_equal
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §5 (53-dars, 1-pozitsiya)
//
// З112 SHU YERDA RAD ETILADI: to'g'ri javobdagi strelka a⃗ bilan bir xil
// uzunlik va yo'nalishda, lekin BOSHQA JOYDA turadi. Buni yozuv bilan
// aytish mumkin emas — «joylashuvi ahamiyatsiz» degan gap faqat chizmada
// isbotlanadi (skelet §0a.2).
// Uch rad etilgan variant uch xil sababdan: yo'nalish teskari, uzunlik
// katta, yo'nalish boshqa.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

// a⃗ ning surilishi: (46; −24). Teng vektorda AYNAN shu surilish bo'lishi
// kerak, boshlanish nuqtasi esa istalgan joyda.
// KADR KATTA: uzunlikni ko'z bilan solishtirish kerak, kichik strelkalarda
// esa ellik foizlik farq ham sezilmay qoladi.
const F = { fig: 'vec', w: 96, h: 68 };

const DATA = {
  tag: 'which_equal', level: '🟢',
  correct: 0, optCols: 2, optSize: 13,
  expr: [{ ...F, arrows: [{ from: [12, 48], to: [58, 24], name: 'a' }] }],
  eyebrow: L('Teng vektor', 'Равный вектор', 'An equal vector'),
  setup: L(
    "Yuqorida a vektori turibdi. Quyida to'rt strelka, va ulardan faqat bittasi a ga TENG. Ikki vektor teng deyiladi, agar ularning uzunligi ham, yo'nalishi ham bir xil bo'lsa; qayerda turgani esa ahamiyatsiz.",
    'Сверху стоит вектор a. Ниже четыре стрелки, и лишь одна из них РАВНА a. Два вектора называются равными, если у них одинаковы и длина, и направление; а где они стоят, не важно.',
    'The vector a stands above. Below are four arrows, and only one of them is EQUAL to a. Two vectors are called equal if both their length and their direction match; where they stand does not matter.'),
  ask: L(
    'Qaysi strelka a vektoriga teng?',
    'Какая стрелка равна вектору a?',
    'Which arrow equals the vector a?'),
  opts: [
    // TO'G'RI: o'sha surilish (32; −17), boshqa joyda
    { label: [{ ...F, arrows: [{ from: [32, 58], to: [78, 34] }] }] },
    // teskari yo'nalish
    { label: [{ ...F, arrows: [{ from: [72, 22], to: [26, 46] }] }] },
    // bir xil yo'nalish, lekin uzunroq
    { label: [{ ...F, arrows: [{ from: [9, 58], to: [78, 22] }] }] },
    // o'sha uzunlik, boshqa yo'nalish
    { label: [{ ...F, arrows: [{ from: [14, 20], to: [60, 44] }] }] },
  ],
  correctText: L(
    "To'g'ri. Birinchi strelka a bilan bir xil uzunlikda va bir xil yo'nalishda, faqat boshqa joyda turibdi — va bu hech narsani o'zgartirmaydi. Vektorni parallel ko'chirish uni o'zgartirmaydi: uzunlik ham, yo'nalish ham saqlanadi. Aynan shu sababdan vektorni istalgan nuqtadan boshlab chizish mumkin.",
    'Верно. Первая стрелка той же длины и того же направления, что и a, просто стоит в другом месте — и это ничего не меняет. Параллельный перенос вектор не меняет: сохраняются и длина, и направление. Именно поэтому вектор можно чертить из любой точки.',
    'Correct. The first arrow has the same length and the same direction as a, it merely stands elsewhere — and that changes nothing. A parallel shift does not change a vector: both length and direction are kept. This is exactly why a vector may be drawn from any point.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Bu strelka a bilan bir xil uzunlikda, lekin TESKARI yo'nalgan. Bunday vektor a ga teng emas, u qarama-qarshi vektor deyiladi va minus a deb yoziladi. Ikkovini qo'shsangiz nol vektor chiqadi. Yo'nalish vektorning yarmi: uni e'tiborsiz qoldirib bo'lmaydi.",
      'Эта стрелка той же длины, что и a, но направлена ОБРАТНО. Такой вектор не равен a, он называется противоположным и записывается минус a. Сложи их — получится нулевой вектор. Направление это половина вектора: не замечать его нельзя.',
      'This arrow has the same length as a but points the OTHER way. Such a vector does not equal a, it is called the opposite vector and is written minus a. Add the two and you get the zero vector. Direction is half of what a vector is: it cannot be ignored.') },
    { when: (s) => s.picked === 2, text: L(
      "Yo'nalish to'g'ri, lekin strelka UZUNROQ. Vektorlar teng bo'lishi uchun ikki shart birga bajarilishi kerak: yo'nalish ham, uzunlik ham. Bittasi yetmaydi. Bu strelka a ga kollinear, ya'ni bir yo'nalishda, lekin teng emas.",
      'Направление верное, но стрелка ДЛИННЕЕ. Чтобы векторы были равны, должны выполняться сразу два условия: и направление, и длина. Одного мало. Эта стрелка коллинеарна a, то есть сонаправлена, но не равна.',
      'The direction is right, but the arrow is LONGER. For vectors to be equal both conditions must hold at once: direction and length. One is not enough. This arrow is collinear with a, that is, it points the same way, but it is not equal.') },
    { when: (s) => s.picked === 3, text: L(
      "Uzunlik to'g'ri, lekin yo'nalish boshqa: a yuqoriga qiya ketadi, bu strelka esa pastga. Ikkovini ustma-ust qo'ysangiz ular mos tushmaydi. Teng vektorni tanlashda ikki narsani birga tekshiring: strelka qaysi tomonga qaragan va qanchalik uzun.",
      'Длина верная, но направление другое: a идёт наклонно вверх, а эта стрелка вниз. Наложи их друг на друга — они не совпадут. Выбирая равный вектор, проверяй сразу два: куда смотрит стрелка и насколько она длинная.',
      'The length is right, but the direction differs: a slants upwards while this arrow slants down. Lay one over the other and they will not match. When choosing an equal vector, check two things at once: which way the arrow points and how long it is.') },
  ],
  wrongText: L(
    "Ikki shart birga: bir xil uzunlik VA bir xil yo'nalish. Joylashuvi ahamiyatsiz.",
    'Два условия сразу: одинаковая длина И одинаковое направление. Расположение не важно.',
    'Two conditions at once: the same length AND the same direction. The position does not matter.'),
};

export default function D53_01(props) { return <Choice data={DATA} {...props} />; }
