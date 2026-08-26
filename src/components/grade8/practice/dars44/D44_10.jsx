// Dars44 · Amaliyot 10 — Tenglik · 🔴 · tag: true_equalities
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §6 (44-dars, 10-pozitsiya)
//
// BITTA TENGLIKNING ALTI YOZUVI, UCHTASI ROST. Rost uchtasi bir-biridan
// olinadi: c kvadrat teng a kvadrat qo'shuv b kvadrat -> a kvadrat teng
// c kvadrat minus b kvadrat -> b teng ildiz ostida c kvadrat minus a kvadrat.
//
// Uch xato: З91 (c teng a qo'shuv b), З92 (a teng c minus b), va gipotenuza
// bilan katetning o'rnini almashtirish (b kvadrat teng c kvadrat qo'shuv
// a kvadrat) — bu З93 ning algebraik shakli.
//
// Ildiz `frac.jsx` ning `{ r: ... }` tokeni bilan chiziladi (skelet §0a.5).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'true_equalities', level: '🔴',
  col: 158, itemSize: 17,
  items: [
    { id: 'i1', hit: true, tokens: ['c² = a² + b²'] },
    { id: 'i2', tokens: ['c = a + b'] },
    { id: 'i3', hit: true, tokens: ['a² = c² − b²'] },
    { id: 'i4', tokens: ['a = c − b'] },
    { id: 'i5', hit: true, tokens: ['b = ', { r: 'c² − a²' }] },
    { id: 'i6', tokens: ['b² = c² + a²'] },
  ],
  eyebrow: L('Tenglik', 'Равенство', 'Equality'),
  setup: L(
    "Olti yozuv. Ularning uchtasi Pifagor teoremasining to'g'ri shakli — bittasidan boshqasi algebra bilan olinadi. Uchtasi esa xato: ular teoremani buzadi. Bu yerda c gipotenuza, a va b katetlar.",
    'Шесть записей. Три из них верные формы теоремы Пифагора — одна получается из другой алгеброй. Три ошибочные: они ломают теорему. Здесь c гипотенуза, a и b катеты.',
    'Six records. Three of them are correct forms of the Pythagorean theorem — one follows from another by algebra. Three are wrong: they break the theorem. Here c is the hypotenuse and a and b the legs.'),
  ask: L(
    "To'g'ri bo'lgan 3 ta tenglikni belgilang.",
    'Отметь 3 верных равенства.',
    'Mark the 3 correct equalities.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uch rost yozuv bitta tenglikning uch ko'rinishi. Birinchisi teoremaning o'zi. Ikkinchisi undan a kvadratni bir tomonga o'tkazish bilan olinadi: agar c kvadrat a kvadrat qo'shuv b kvadratga teng bo'lsa, a kvadrat c kvadrat minus b kvadratga teng. Uchinchisi shu ayirmadan ildiz chiqarish, ya'ni katetning O'ZINI topish. Sonlar bilan tekshirish oson: besh, o'n ikki, o'n uch. Bir yuz oltmish to'qqiz teng yigirma besh qo'shuv bir yuz qirq to'rt. Yigirma besh teng bir yuz oltmish to'qqiz minus bir yuz qirq to'rt. O'n ikki teng bir yuz oltmish to'qqiz minus yigirma besh ning ildizi.",
    'Верно. Три верные записи — три вида одного равенства. Первая это сама теорема. Вторая получается переносом a в квадрате в другую часть: если c в квадрате равно a в квадрате плюс b в квадрате, то a в квадрате равно c в квадрате минус b в квадрате. Третья — извлечение корня из этой разности, то есть нахождение САМОГО катета. Проверить числами легко: пять, двенадцать, тринадцать. Сто шестьдесят девять равно двадцать пять плюс сто сорок четыре. Двадцать пять равно сто шестьдесят девять минус сто сорок четыре. Двенадцать равно корню из ста шестидесяти девяти минус двадцати пяти.',
    'Correct. The three true records are three forms of one equality. The first is the theorem itself. The second comes from moving a squared across: if c squared equals a squared plus b squared, then a squared equals c squared minus b squared. The third takes the root of that difference, finding the leg ITSELF. Checking with numbers is easy: five, twelve, thirteen. One hundred sixty nine equals twenty five plus one hundred forty four. Twenty five equals one hundred sixty nine minus one hundred forty four. Twelve equals the root of one hundred sixty nine minus twenty five.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Bu yozuvda kvadratlar YO'Q, ya'ni u boshqa narsani da'vo qiladi. Sonlarda tekshiring: besh qo'shuv o'n ikki o'n yetti, gipotenuza esa o'n uch. Uzunliklarning yig'indisi gipotenuzadan har doim katta chiqadi.",
      'В этой записи НЕТ квадратов, то есть она утверждает другое. Проверь на числах: пять плюс двенадцать — семнадцать, а гипотенуза тринадцать. Сумма длин всегда выходит больше гипотенузы.',
      'This record has NO squares, so it claims something else. Check with numbers: five plus twelve is seventeen while the hypotenuse is thirteen. The sum of the lengths always comes out greater than the hypotenuse.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Bu yozuvda ayirish bor, lekin u KVADRATLARDA emas, uzunliklarda bajarilgan. Sonlarda tekshiring: o'n uch minus o'n ikki bir, katet esa besh. To'g'ri yo'l: kvadratlarni ayirib, keyin ildiz chiqarish.",
      'В этой записи вычитание есть, но выполнено оно не в КВАДРАТАХ, а в длинах. Проверь на числах: тринадцать минус двенадцать — один, а катет пять. Верный путь: вычесть квадраты и потом извлечь корень.',
      'This record does subtract, but not in the SQUARES — in the lengths. Check with numbers: thirteen minus twelve is one while the leg is five. The right route is to subtract the squares and then take the root.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Bu yozuvda gipotenuza bilan katet o'rin almashdi: yig'indi KATETNING kvadratiga tenglashtirilgan. Bunday bo'lolmaydi, chunki gipotenuza eng katta tomon: uning kvadrati ham eng katta. Sonlarda: bir yuz qirq to'rt bir yuz oltmish to'qqiz qo'shuv yigirma beshga teng emas.",
      'В этой записи гипотенуза и катет поменялись ролями: сумма приравнена к квадрату КАТЕТА. Так быть не может, ведь гипотенуза наибольшая сторона: её квадрат тоже наибольший. В числах: сто сорок четыре не равно сто шестьдесят девять плюс двадцать пять.',
      'In this record the hypotenuse and a leg have swapped roles: the sum is set equal to the square of a LEG. That cannot be, since the hypotenuse is the largest side and so is its square. In numbers: one hundred forty four does not equal one hundred sixty nine plus twenty five.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "Ildizli yozuv chetlab o'tildi, lekin u ham rost. Kvadratlarning ayirmasi katetning KVADRATINI beradi, katetning o'zini topish uchun ildiz chiqarish kerak — yozuvda aynan shu bajarilgan. Sonlarda: bir yuz oltmish to'qqiz minus yigirma besh bir yuz qirq to'rt, ildizi o'n ikki.",
      'Запись с корнем пропущена, а она тоже верна. Разность квадратов даёт КВАДРАТ катета, а чтобы найти сам катет, надо извлечь корень — в записи это и сделано. В числах: сто шестьдесят девять минус двадцать пять — сто сорок четыре, корень двенадцать.',
      'The record with the root was skipped, yet it is true as well. The difference of the squares gives the SQUARE of the leg, and to find the leg itself the root must be taken — which is exactly what the record does. In numbers: one hundred sixty nine minus twenty five is one hundred forty four, the root is twelve.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta yozuv kerak. Har birini besh, o'n ikki, o'n uch uchligida tekshirib ko'ring: rost yozuvda ikki tomon bir xil son beradi, xato yozuvda esa boshqa.",
      'Нужно ровно три записи. Проверь каждую на тройке пять, двенадцать, тринадцать: в верной записи обе части дают одно число, в ошибочной разные.',
      'Exactly three records are needed. Test each on the triple five, twelve, thirteen: in a true record both sides give the same number, in a false one they differ.') },
  ],
  wrongText: L(
    "Har yozuvni 5, 12, 13 uchligida tekshiring. Kvadratlarsiz yozuv va ishorasi almashgan yozuv o'tmaydi.",
    'Проверь каждую запись на тройке 5, 12, 13. Запись без квадратов и запись с перепутанным знаком не проходят.',
    'Test every record on the triple 5, 12, 13. A record without squares and one with the sign swapped will not pass.'),
};

export default function D44_10(props) { return <MarkAll data={DATA} {...props} />; }
