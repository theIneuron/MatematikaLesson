// Dars13 · Amaliyot 02 — Guruhlar · 🟢 · tag: same_radicand
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §4 (13-dars, 2-pozitsiya)
//
// З34 NING ENG ODDIY KO'RINISHI: ildizli hadlar ildiz ostilari BIR XIL
// bo'lganda qo'shiladi. Bu yerda hamma yozuvda ildiz ostilari ochiq turadi,
// ya'ni oldin chiqarish kerak emas — bu 🟢 pozitsiya, tanib olish darajasi.
// Chiqarishni talab qiladigan yozuvlar (√32 + √8, √12 + √27) 05-topshiriqda,
// ya'ni 🟡 da turadi.
//
// Ikkinchi guruhning razbori har doim SON bilan ishlaydi: √2 + √3 = √5 degan
// yozuv bir hisobda yiqiladi — 1,41 qo'shuv 1,73 uch yarimga yaqin, √5 esa
// 2,23. Shu bilan З4 ham qoplanadi.
// Zona sarlavhasi qisqa SO'Z: telefonda ustun keni 74px (kit.jsx, Zones).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'same_radicand', level: '🟢',
  zoneSize: 16, itemSize: 15,
  zones: [
    { id: 'z1', label: L("QO'SHILADI", 'СКЛАДЫВАЮТСЯ', 'ADD UP') },
    { id: 'z2', label: L("QO'SHILMAYDI", 'НЕ СКЛАДЫВАЮТСЯ', 'DO NOT') },
  ],
  items: [
    { id: 'i1', tokens: ['2', { r: '3' }, '+', '5', { r: '3' }], zone: 'z1' },
    { id: 'i2', tokens: [{ r: '2' }, '+', { r: '3' }], zone: 'z2' },
    { id: 'i3', tokens: ['7', { r: '5' }, '−', '2', { r: '5' }], zone: 'z1' },
    { id: 'i4', tokens: [{ r: '5' }, '+', { r: '7' }], zone: 'z2' },
    { id: 'i5', tokens: ['4', { r: '2' }, '+', { r: '2' }], zone: 'z1' },
    { id: 'i6', tokens: ['3', { r: '2' }, '+', '3', { r: '5' }], zone: 'z2' },
    { id: 'i7', tokens: ['6', { r: '7' }, '−', '3', { r: '7' }], zone: 'z1' },
    { id: 'i8', tokens: [{ r: '6' }, '−', { r: '10' }], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz yozuv. Ba'zilarini bitta ildizli hadga yig'ish mumkin, ba'zilarini esa yo'q — ular shu ko'rinishda qoladi.",
    'Восемь записей. Одни можно свести к одному слагаемому с корнем, другие нет — они остаются как есть.',
    'Eight records. Some can be collected into a single term with a root, others cannot — they stay as they are.'),
  ask: L(
    "Yozuvni bosing, keyin guruhini bosing. Ildiz ostilari bir xilmi?",
    'Нажми запись, потом её группу. Подкоренные одинаковы?',
    'Tap a record, then its group. Are the radicands the same?'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  // RAZBOR QISQA: o'lchov 2026-08-24 (grade8-practice-panel.mjs) — sakkiz kartali
  // Zones ustiga uzun razbor kelib, telefonda RU matni 54px panel ostida
  // qolardi. Sonli rad etish `wrongs` ning birinchi shartida to'liq turadi.
  correctText: L(
    "To'g'ri. Ildizli had ham had: uni harfli haddek qo'shish mumkin, faqat ildiz ostilari bir xil bo'lsa. Ikki uchdan ildiz qo'shuv besh uchdan ildiz yetti uchdan ildizni beradi — koeffitsiyentlar qo'shiladi, ildiz osti tegilmaydi. Ikkinchi guruhda ildiz ostilari boshqa: ikkidan ildiz bir butun qirq bir, uchdan ildiz bir butun yetmish uch, ularni bir hadga yig'ib bo'lmaydi.",
    'Верно. Слагаемое с корнем — тоже слагаемое: его складывают как буквенное, но только при одинаковых подкоренных. Два корня из трёх плюс пять корней из трёх дают семь корней из трёх — складываются коэффициенты, подкоренное не трогаем. Во второй группе подкоренные разные: корень из двух один и сорок один, корень из трёх один и семьдесят три, в одно слагаемое их не свести.',
    'Correct. A term with a root is still a term: it adds like a letter term, but only when the radicands match. Two roots of three plus five roots of three give seven roots of three — the coefficients add, the radicand is untouched. In the second group the radicands differ: the root of two is one point four one, the root of three one point seven three, and they cannot be collected into one term.'),
  wrongs: [
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1' || s.place.i8 === 'z1', text: L(
      "Ildiz ostilari boshqa bo'lgan yozuv birinchi guruhga tushdi. Ikkidan ildiz qo'shuv uchdan ildizni beshdan ildiz deb yozib ko'ring va sonlar bilan tekshiring: bir butun qirq bir qo'shuv bir butun yetmish uch uch butun o'n to'rtga yaqin, beshdan ildiz esa faqat ikki butun yigirma uch. Ildiz ostilari qo'shilmaydi.",
      'Запись с разными подкоренными попала в первую группу. Попробуй записать корень из двух плюс корень из трёх как корень из пяти и проверь числами: один и сорок один плюс один и семьдесят три — около трёх и четырнадцати, а корень из пяти всего два и двадцать три. Подкоренные не складываются.',
      'A record with different radicands went into the first group. Try writing the root of two plus the root of three as the root of five and check with numbers: one point four one plus one point seven three is about three point one four, while the root of five is only two point two three. Radicands do not add.') },
    { when: (s) => s.place.i6 === 'z1', text: L(
      "Bu yozuvda koeffitsiyentlar bir xil — uch va uch, lekin qo'shishni koeffitsiyent hal qilmaydi. Ildiz ostilari ikki va besh, ya'ni boshqa-boshqa hadlar. Xuddi uch a qo'shuv uch b ni bir hadga yig'ib bo'lmagani kabi.",
      'В этой записи коэффициенты одинаковы — три и три, но складывание решают не коэффициенты. Подкоренные два и пять, то есть слагаемые разные. Так же как три a плюс три b нельзя свести к одному слагаемому.',
      'In this record the coefficients match — three and three — but coefficients are not what decides. The radicands are two and five, so the terms are different. Just as three a plus three b cannot be collected into one term.') },
    { when: (s) => s.place.i5 === 'z2', text: L(
      "Bu yozuvda ikkinchi hadning koeffitsiyenti KO'RINMAYDI, lekin u bor va birga teng: ikkidan ildiz bu bir karra ikkidan ildiz. Ildiz ostilari bir xil, demak qo'shiladi: to'rt qo'shuv bir besh, natija besh ikkidan ildiz.",
      'В этой записи коэффициент второго слагаемого НЕ ВИДЕН, но он есть и равен единице: корень из двух это один корень из двух. Подкоренные одинаковы, значит складываются: четыре плюс один пять, итог пять корней из двух.',
      'In this record the second coefficient is INVISIBLE, but it exists and equals one: the root of two is one root of two. The radicands match, so they add: four plus one is five, giving five roots of two.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har yozuvda bitta narsaga qarang: ildiz ostidagi sonlar bir xilmi. Bir xil bo'lsa koeffitsiyentlar qo'shiladi, boshqa bo'lsa yozuv shundayligicha qoladi.",
      'В каждой записи смотри на одно: одинаковы ли числа под корнями. Одинаковы — складываются коэффициенты, разные — запись остаётся как есть.',
      'Look at one thing in every record: are the numbers under the roots the same. If they are, the coefficients add; if not, the record stays as it is.') },
  ],
  wrongText: L(
    "Ildizli hadni harfli haddek ko'ring: ikki uch qo'shuv besh uch yetti uchni beradi, ikki a qo'shuv besh b esa hech narsani bermaydi. Shubha bo'lsa sonlarni qo'yib solishtiring.",
    'Смотри на слагаемое с корнем как на буквенное: два икс плюс пять икс дают семь икс, а два a плюс пять b ничего не дают. При сомнении подставь числа и сравни.',
    'Treat a root term like a letter term: two x plus five x gives seven x, while two a plus five b gives nothing. When in doubt substitute numbers and compare.'),
};

export default function D13_02(props) { return <Zones data={DATA} {...props} />; }
