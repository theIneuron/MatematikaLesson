// Dars53 · Amaliyot 02 — Guruhlar · 🟢 🖼 · tag: equal_or_not
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §5 (53-dars, 2-pozitsiya)
//
// З112 SAKKIZ KARTADA TAKRORLANADI. To'rt teng strelka kadrning to'rt
// boshqa joyida turadi — «joylashuv ahamiyatsiz» degan gap shu bilan
// isbotlanadi. Rad etilganlar uch xil sababdan: yo'nalish teskari,
// uzunlik katta yoki kichik, yo'nalish boshqa.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

// KADR JUDA KICHIK: sakkiz karta kichik telefonda uch qatorga bo'linadi,
// va 58px li kadrda ular razbor bilan birga oltmish pikselgacha kadrdan
// chiqib ketardi (o'lchov 2026-08-25).
// Teng vektorning surilishi hamma joyda AYNAN (21; −11).
const F = { fig: 'vec', w: 46, h: 32 };

const DATA = {
  tag: 'equal_or_not', level: '🟢',
  zoneSize: 12, itemSize: 12, zoneLbl: 96,
  given: [[{ ...F, arrows: [{ from: [5, 23], to: [26, 12], name: 'a' }] }]],
  givenLabel: L('Vektor', 'Вектор', 'The vector'),
  zones: [
    { id: 'z1', label: L('a GA TENG', 'РАВНЫ a', 'EQUAL TO a') },
    { id: 'z2', label: L('TENG EMAS', 'НЕ РАВНЫ', 'NOT EQUAL') },
  ],
  items: [
    { id: 'i1', tokens: [{ ...F, arrows: [{ from: [3, 26], to: [24, 15] }] }], zone: 'z1' },
    { id: 'i2', tokens: [{ ...F, arrows: [{ from: [36, 8], to: [15, 19] }] }], zone: 'z2' },
    { id: 'i3', tokens: [{ ...F, arrows: [{ from: [18, 28], to: [39, 17] }] }], zone: 'z1' },
    { id: 'i4', tokens: [{ ...F, arrows: [{ from: [2, 29], to: [34, 12] }] }], zone: 'z2' },
    { id: 'i5', tokens: [{ ...F, arrows: [{ from: [5, 18], to: [26, 7] }] }], zone: 'z1' },
    { id: 'i6', tokens: [{ ...F, arrows: [{ from: [10, 21], to: [21, 15] }] }], zone: 'z2' },
    { id: 'i7', tokens: [{ ...F, arrows: [{ from: [11, 29], to: [32, 18] }] }], zone: 'z1' },
    { id: 'i8', tokens: [{ ...F, arrows: [{ from: [5, 8], to: [26, 19] }] }], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Yuqorida a vektori turibdi. Sakkiz strelka kadrning turli joylarida chizilgan. Har birini a bilan solishtiring: uzunligi ham, yo'nalishi ham bir xilmi.",
    'Сверху стоит вектор a. Восемь стрелок начерчены в разных местах кадра. Сравни каждую с a: совпадают ли длина и направление.',
    'The vector a stands above. Eight arrows are drawn in different places of the frame. Compare each with a: do the length and the direction match?'),
  ask: L('Strelkani bosing, keyin guruhini bosing.', 'Нажми стрелку, потом её группу.', 'Tap an arrow, then its group.'),
  bank: L('Strelkalar', 'Стрелки', 'Arrows'),
  correctText: L(
    "To'g'ri. To'rt strelka a ga teng, garchi ular kadrning to'rt boshqa joyida tursa ham — biri pastda, biri o'ngda, biri yuqorida. Joylashuv vektorni o'zgartirmaydi, chunki vektor ikki narsadan iborat: uzunlik va yo'nalish. Rad etilgan to'rttasi esa uch xil sababdan chiqib qoldi: bittasi teskari yo'nalgan, ikkitasining uzunligi boshqa, bittasi esa boshqa tomonga qaragan.",
    'Верно. Четыре стрелки равны a, хотя стоят в четырёх разных местах кадра — одна внизу, одна справа, одна вверху. Расположение вектор не меняет, ведь вектор состоит из двух вещей: длины и направления. А четыре отклонённых выпали по трём разным причинам: одна направлена обратно, у двух другая длина, а одна смотрит в другую сторону.',
    'Correct. Four arrows equal a, though they stand in four different places of the frame — one at the bottom, one to the right, one at the top. Position does not change a vector, since a vector consists of two things: length and direction. The four rejected ones fell out for three different reasons: one points backwards, two have a different length, and one looks another way.'),
  wrongs: [
    { when: (s) => s.place.i2 === 'z1', text: L(
      "Teskari yo'nalgan strelka teng guruhiga tushib qoldi. U a bilan bir xil uzunlikda va bir xil chiziqda yotadi, lekin strelkaning uchi qarama-qarshi tomonda. Bunday vektor minus a deb yoziladi. Uzunlikni solishtirgandan keyin STRELKANING UCHI qayerda ekanini ham ko'ring.",
      'Стрелка, направленная обратно, попала в группу равных. Она той же длины, что и a, и лежит на той же прямой, но её остриё смотрит в противоположную сторону. Такой вектор записывается минус a. Сравнив длину, посмотри ещё и на то, где ОСТРИЁ стрелки.',
      'An arrow pointing the other way landed in the equal group. It has the same length as a and lies along the same line, but its tip points the opposite way. Such a vector is written minus a. After comparing the length, look also at where the TIP of the arrow is.') },
    { when: (s) => s.place.i4 === 'z1' || s.place.i6 === 'z1', text: L(
      "Uzunligi boshqa strelka teng guruhiga tushdi. Bittasi a dan sezilarli uzun, bittasi esa qisqa. Yo'nalish to'g'ri bo'lgani yetmaydi: tenglik uchun IKKALA shart ham bajarilishi kerak. Yo'nalishi bir xil, uzunligi boshqa vektorlar kollinear deyiladi, lekin teng emas.",
      'В группу равных попала стрелка другой длины. Одна заметно длиннее a, другая короче. Верного направления мало: для равенства должны выполняться ОБА условия. Векторы одного направления, но разной длины называются коллинеарными, но не равными.',
      'An arrow of a different length landed in the equal group. One is noticeably longer than a, the other shorter. The right direction is not enough: equality needs BOTH conditions. Vectors with the same direction but different lengths are called collinear, not equal.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Uchtadan ko'p strelka boshqa guruhda. Har birini ikki savol bilan tekshiring: qaysi tomonga qaragan va qanchalik uzun. Strelka kadrning qayerida turgani uchinchi savol emas — u umuman savol emas.",
      'Больше трёх стрелок стоят не в своей группе. Проверяй каждую двумя вопросами: куда смотрит и насколько длинная. Где стрелка стоит в кадре — это не третий вопрос, это вообще не вопрос.',
      'More than three arrows are in the wrong group. Check each with two questions: which way it points and how long it is. Where the arrow stands in the frame is not a third question — it is not a question at all.') },
    { when: () => true, text: L(
      "Bitta strelka boshqa guruhda qoldi. Tekshirish o'sha: yo'nalish va uzunlik. To'rt strelka a ga teng, garchi ular turli joyda turgan bo'lsa ham.",
      'Одна стрелка осталась не в своей группе. Проверка та же: направление и длина. Четыре стрелки равны a, хотя и стоят в разных местах.',
      'One arrow stayed in the wrong group. The check is the same: direction and length. Four arrows equal a, though they stand in different places.') },
  ],
  wrongText: L(
    "Ikki savol: qaysi tomonga qaragan va qanchalik uzun. Qayerda turgani ahamiyatsiz.",
    'Два вопроса: куда смотрит и насколько длинная. Где стоит — не важно.',
    'Two questions: which way it points and how long it is. Where it stands does not matter.'),
};

export default function D53_02(props) { return <Zones data={DATA} {...props} />; }
