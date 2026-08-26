// Dars53 · Amaliyot 05 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §5 (53-dars, 5-pozitsiya)
//
// T1 bitta gapga yig'ilgan. Bankdagi asosiy tuzoq — «boshlanishi»: bu
// aynan З112, ya'ni teng vektorlar bir nuqtadan chiqishi kerak degan fikr.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      "Vektor, bu",
      'Вектор, это отрезок, имеющий',
      'A vector is a segment that has') },
    { slot: 0 },
    { text: L(
      "ega kesma. Uzunligi va yo'nalishi bir xil bo'lgan vektorlar",
      '. Векторы с одинаковой длиной и направлением', '. Vectors with the same length and direction are') },
    { slot: 1 },
    { text: L(
      "deyiladi, ularning",
      'называются, а их', 'called, and their') },
    { slot: 2 },
    { text: L("esa ahamiyatsiz.", 'не имеет значения.', 'does not matter.') },
  ],
  cards: [
    { id: 'w1', label: L("yo'nalishga", 'направление', 'a direction') },
    { id: 'w2', label: L('teng', 'равными', 'equal') },
    { id: 'w3', label: L('joylashuvi', 'расположение', 'position') },
    { id: 'w4', label: L('uzunlikka', 'длину', 'a length') },
    { id: 'w5', label: L('kollinear', 'коллинеарными', 'collinear') },
    { id: 'w6', label: L('boshlanishi', 'начало', 'starting point') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Vektorning ta'rifi bitta gapga yig'ilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta. Diqqat: oxirgi bo'shliqqa ikki karta tili bo'yicha bemalol tushadi, lekin ularning ma'nosi qarama-qarshi.",
    'Определение вектора собрано в одно предложение, но три слова выпали. В банке шесть карточек. Внимание: в последний пропуск по языку свободно ложатся две карточки, но смысл у них противоположный.',
    'The definition of a vector is gathered into one sentence, but three words have dropped out. The bank holds six cards. Note: two cards fit the last gap smoothly by language, but their meanings are opposite.'),
  ask: L(
    "Bo'sh joyni bosing, keyin so'zni bosing.",
    'Нажми пропуск, потом слово.',
    'Tap a gap, then a word.'),
  bank: L("So'zlar", 'Слова', 'Words'),
  correctText: L(
    "To'g'ri. Vektorni oddiy kesmadan bitta narsa ajratadi: YO'NALISH. Kesmada bosh va oxir yo'q, vektorda esa bor. Ikkinchi va uchinchi so'z birga ishlaydi: vektorlar teng bo'lishi uchun uzunlik va yo'nalish yetarli, joylashuv esa hisobga olinmaydi. Aynan shu sababdan bir xil vektorni sahifaning istalgan joyiga ko'chirib chizish mumkin.",
    'Верно. Вектор от обычного отрезка отличает одно: НАПРАВЛЕНИЕ. У отрезка нет начала и конца, у вектора есть. Второе и третье слово работают вместе: для равенства векторов достаточно длины и направления, а расположение не учитывается. Именно поэтому один и тот же вектор можно перенести в любое место страницы.',
    'Correct. One thing separates a vector from an ordinary segment: DIRECTION. A segment has no start and end, a vector does. The second and third words work together: length and direction suffice for equality, while position is not counted. This is exactly why the same vector can be moved anywhere on the page.'),
  wrongs: [
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Oxirgi bo'shliqda «boshlanishi» turibdi, ya'ni gap teng vektorlarning boshlanishi ahamiyatsiz emas deb aytmoqda. Aslida aynan boshlanish ahamiyatsiz: vektorni parallel ko'chirsak, u o'zgarmaydi. Bu darsning eng qimmat chalkashligi — o'quvchi teng vektorlarni bitta nuqtadan chiqishi kerak deb o'ylaydi.",
      'В последнем пропуске стоит «начало», то есть предложение говорит, будто начало равных векторов важно. На самом деле именно начало и не важно: перенеси вектор параллельно, и он не изменится. Это самая дорогая путаница урока — ученик думает, что равные векторы обязаны выходить из одной точки.',
      'The last gap holds «starting point», so the sentence now says the start of equal vectors matters. In fact the start is precisely what does not matter: shift a vector parallel to itself and it stays the same. This is the costliest confusion of the lesson — the student thinks equal vectors must leave from one point.') },
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Birinchi bo'shliqda «uzunlikka» turibdi, lekin uzunlik oddiy kesmada ham bor. Vektorni kesmadan ajratadigan narsa yo'nalish: qaysi uchi bosh, qaysi uchi oxir. Chizmada buni strelka ko'rsatadi.",
      'В первом пропуске стоит «длину», но длина есть и у обычного отрезка. Вектор от отрезка отличает направление: какой конец начало, а какой конец. На рисунке это показывает стрелка.',
      'The first gap holds «a length», but an ordinary segment has a length too. What separates a vector from a segment is direction: which end is the start and which is the end. In a drawing the arrowhead shows this.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Ikkinchi bo'shliqda «kollinear» turibdi. Kollinear vektorlar bir yo'nalishda yotadi, lekin uzunligi boshqa bo'lishi mumkin. Bu yerda esa ikkala shart ham bajarilgan: uzunlik ham, yo'nalish ham bir xil — bunday vektorlar TENG deyiladi. Har teng vektor kollinear, lekin har kollinear vektor teng emas.",
      'Во втором пропуске стоит «коллинеарными». Коллинеарные векторы лежат в одном направлении, но длина у них может быть разной. А здесь выполнены оба условия: и длина, и направление совпадают — такие векторы называются РАВНЫМИ. Каждый равный вектор коллинеарен, но не каждый коллинеарный равен.',
      'The second gap holds «collinear». Collinear vectors lie in the same direction but may differ in length. Here both conditions hold: length and direction match — such vectors are called EQUAL. Every equal vector is collinear, but not every collinear vector is equal.') },
  ],
  wrongText: L(
    "Vektorni kesmadan yo'nalish ajratadi, tenglik uchun esa uzunlik va yo'nalish yetarli.",
    'Вектор от отрезка отличает направление, а для равенства достаточно длины и направления.',
    'Direction separates a vector from a segment, and length with direction suffice for equality.'),
};

export default function D53_05(props) { return <ClozeBank data={DATA} {...props} />; }
