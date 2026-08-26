// Dars54 · Amaliyot 05 — Tartib · 🟡 🖼 · tag: midpoint_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §6 (54-dars, 5-pozitsiya)
//
// З115 OXIRGI QADAMDA TUG'ILADI: qavs ochilmasa yarim koeffitsiyent
// yo'qoladi. Chiqarish zanjiri:
//   C — AB ning o'rtasi
//   OC = OA + AC
//   AC = ½AB = ½(OB − OA)
//   OC = OA + ½OB − ½OA = ½(OA + OB)
// Chizmada O dan uch strelka chiqadi, AB esa strelkasiz kesma.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'midpoint_steps', level: '🟡',
  expr: [{
    fig: 'vec', w: 112, h: 72,
    segs: [{ from: [98, 40], to: [50, 10] }],
    arrows: [
      { from: [10, 62], to: [98, 40], ref: true, name: 'OA' },
      { from: [10, 62], to: [50, 10], ref: true, name: 'OB' },
      { from: [10, 62], to: [74, 25], name: 'OC' },
    ],
    dots: [{ at: [74, 25], name: 'C', dy: -5 }],
  }],
  itemSize: 11,
  cards: [
    { id: 'l1', tokens: ['C — AB'],
      label: L("C kesmaning o'rtasi", 'C середина отрезка', 'C is the midpoint of the segment') },
    { id: 'l2', tokens: ['OC = OA + AC'],
      label: L("uchburchak qoidasi bilan yozamiz", 'записываем по правилу треугольника', 'write it by the triangle rule') },
    { id: 'l3', tokens: ['AC = ½(OB − OA)'],
      label: L("AC ni yarim AB deb almashtiramiz", 'заменяем AC на половину AB', 'replace AC with half of AB') },
    { id: 'l4', tokens: ['OC = ½(OA + OB)'],
      label: L("qavsni ochib yig'amiz", 'раскрываем скобку и собираем', 'expand the bracket and gather') },
  ],
  start: ['l3', 'l1', 'l4', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "O'rtaga tortilgan vektorning formulasini to'rt qadamda chiqaramiz, lekin qadamlar aralashib ketgan. Chizmada O nuqtasidan A va B ga vektorlar chiqqan, C esa AB kesmasining o'rtasi.",
    'Формулу вектора к середине выводим в четыре шага, но шаги перепутаны. На рисунке из точки O выходят векторы к A и B, а C середина отрезка AB.',
    'We derive the formula for the vector to a midpoint in four steps, but the steps are mixed up. In the drawing vectors leave the point O towards A and B, and C is the midpoint of the segment AB.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Zanjir shart bilan boshlanadi: C — AB ning o'rtasi, va bundan keyingi hamma narsa shundan chiqadi. Keyin uchburchak qoidasi: O dan C ga borish uchun avval A ga, keyin A dan C ga borish mumkin. Uchinchi qadamda AC ni almashtiramiz: u AB ning yarmi, AB esa OB ayirmoq OA. Oxirida qavsni ochamiz: OA qo'shuv yarim OB ayirmoq yarim OA, ya'ni yarim OA qo'shuv yarim OB. Yarim koeffitsiyent aynan shu yerda tug'iladi, va uni tashlab ketish darsning tipik xatosi.",
    'Верно. Цепочка начинается с условия: C середина AB, и всё дальнейшее выходит из него. Потом правило треугольника: чтобы попасть из O в C, можно сначала прийти в A, а из A в C. На третьем шаге заменяем AC: это половина AB, а AB это OB минус OA. В конце раскрываем скобку: OA плюс половина OB минус половина OA, то есть половина OA плюс половина OB. Коэффициент половина рождается именно здесь, и потерять его — типичная ошибка урока.',
    'Correct. The chain starts with the condition: C is the midpoint of AB, and everything else follows from it. Then the triangle rule: to get from O to C one may first go to A and from A to C. In the third step AC is replaced: it is half of AB, and AB is OB minus OA. Finally the bracket is expanded: OA plus half OB minus half OA, that is, half OA plus half OB. The coefficient of a half is born exactly here, and losing it is the typical error of the lesson.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Birinchi qadamda tayyor formula turibdi, lekin uni chiqarish hali boshlanmagan. Aynan shu bo'shliq xatoni tug'diradi: formula yodlanadi, va yodlangan formuladan yarim koeffitsiyent oson tushib qoladi. Chiqarilgan formulada esa u yo'qolmaydi — ko'rinib turadi, qayerdan kelgani.",
      'На первом шаге стоит готовая формула, но её вывод ещё не начат. Именно этот пробел и порождает ошибку: формулу заучивают, а из заученной формулы коэффициент половина легко выпадает. А в выведенной формуле он не теряется — видно, откуда он взялся.',
      'The first step holds the finished formula, but its derivation has not begun. It is exactly this gap that breeds the error: the formula gets memorised, and from a memorised formula the coefficient of a half easily drops out. In a derived formula it does not get lost — you can see where it came from.') },
    { when: (s) => s.seq.indexOf('l3') < s.seq.indexOf('l2'), text: L(
      "AC almashtirilyapti, lekin u hali hech qayerda yozilmagan. AC birinchi marta uchburchak qoidasida paydo bo'ladi: OC teng OA qo'shuv AC. Faqat shundan keyin uni almashtirish mumkin.",
      'AC заменяется, но он ещё нигде не записан. AC впервые появляется в правиле треугольника: OC равно OA плюс AC. Только после этого его можно заменять.',
      'AC is being replaced, but it has not been written anywhere yet. AC first appears in the triangle rule: OC equals OA plus AC. Only after that can it be replaced.') },
    { when: (s) => s.seq.indexOf('l1') > 0, text: L(
      "Shart boshida turishi kerak. C — AB ning o'rtasi degan gap butun chiqarishning asosi: aynan shu sababdan AC AB ning YARMI bo'ladi. Shartsiz uchinchi qadamdagi yarim koeffitsiyent asossiz bo'lib qoladi.",
      'Условие должно стоять в начале. Фраза «C середина AB» это основание всего вывода: именно поэтому AC оказывается ПОЛОВИНОЙ AB. Без условия коэффициент половина на третьем шаге повисает в воздухе.',
      'The condition must stand first. The phrase «C is the midpoint of AB» is the ground of the whole derivation: it is why AC turns out to be HALF of AB. Without the condition the half in the third step has nothing to rest on.') },
  ],
  wrongText: L(
    "Shart, keyin uchburchak qoidasi, keyin AC ni almashtirish, oxirida qavsni ochish.",
    'Условие, потом правило треугольника, потом замена AC, в конце раскрытие скобки.',
    'The condition, then the triangle rule, then replacing AC, and expanding the bracket at the end.'),
};

export default function D54_05(props) { return <SwapOrder data={DATA} {...props} />; }
