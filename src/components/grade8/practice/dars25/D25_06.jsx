// Dars25 · Amaliyot 06 — Juftlash · 🟡 · tag: inequality_to_solution
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §7 (25-dars, 6-pozitsiya)
//
// TO'RT TENGSIZLIKDA O'SHA SONLAR: ikki va olti. Farq ikki joyda —
// koeffitsiyentning ishorasida va tengsizlik belgisida, va ular BIRGA
// ishlaydi:
//    2x > 6  -> x > 3     ishora saqlanadi
//   −2x > 6  -> x < −3    manfiyga bo'lish buradi (З52)
//    2x < 6  -> x < 3
//   −2x < 6  -> x > −3
//
// Ya'ni javobda ikki narsa o'zgaradi: uchning ishorasi va belgining yo'nalishi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'inequality_to_solution', level: '🟡',
  connect: true,
  targetSize: 17, itemSize: 17,
  items: [
    { id: 'm1', tokens: ['x > 3'] },
    { id: 'm2', tokens: ['x < −3'] },
    { id: 'm3', tokens: ['x < 3'] },
    { id: 'm4', tokens: ['x > −3'] },
  ],
  targets: [
    { id: 't1', tokens: ['2x > 6'] },
    { id: 't2', tokens: ['−2x > 6'] },
    { id: 't3', tokens: ['2x < 6'] },
    { id: 't4', tokens: ['−2x < 6'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "To'rt tengsizlikda o'sha ikki son turibdi. Farq faqat koeffitsiyentning ishorasida va tengsizlik belgisida, javoblar esa to'rt xil.",
    'В четырёх неравенствах стоят одни и те же два числа. Различие только в знаке коэффициента и в знаке неравенства, а ответы четыре разных.',
    'The four inequalities hold the same two numbers. They differ only in the sign of the coefficient and in the inequality sign, yet the answers are four different ones.'),
  ask: L(
    "Chapdan yechimni bosing, keyin o'ngdan uning tengsizligini bosing.",
    'Нажми решение слева, потом его неравенство справа.',
    'Tap a solution on the left, then its inequality on the right.'),
  correctText: L(
    "To'g'ri. Musbat koeffitsiyentga bo'lish belgini saqlaydi, manfiyga bo'lish esa ikki narsani birga o'zgartiradi: o'ng tomon manfiy bo'ladi va belgi buriladi. Tekshiring: minus to'rtni oling — minus ikki karra minus to'rt sakkiz, sakkiz oltidan katta.",
    'Верно. Деление на положительный коэффициент сохраняет знак, а на отрицательный меняет сразу две вещи: правая часть становится отрицательной и знак переворачивается. Проверь: возьми минус четыре — минус два на минус четыре восемь, восемь больше шести.',
    'Correct. Dividing by a positive coefficient keeps the sign; dividing by a negative changes two things at once: the right side becomes negative and the sign flips. Check: take minus four — minus two times minus four is eight, and eight is greater than six.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Bu ikki tengsizlik koeffitsiyentning ISHORASI bilan farq qiladi, va shu bitta ishora javobni butunlay almashtiradi. Musbat ikkiga bo'lganda javob x uchdan katta bo'ladi; minus ikkiga bo'lganda esa uch minus uchga aylanadi VA belgi buriladi. Minus to'rtni ikkala tengsizlikka qo'yib solishtiring.",
      'Эти два неравенства различаются ЗНАКОМ коэффициента, и один этот знак полностью меняет ответ. При делении на положительное два ответ — x больше трёх; при делении на минус два тройка становится минус тройкой И знак переворачивается. Подставь минус четыре в оба неравенства и сравни.',
      'These two inequalities differ in the SIGN of the coefficient, and that one sign flips the answer entirely. Dividing by a positive two gives x greater than three; dividing by minus two turns the three into minus three AND flips the sign. Substitute minus four into both inequalities and compare.') },
    { when: (s) => s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Bu ikkisida ham koeffitsiyentning ishorasi hal qiladi. Musbat ikkiga bo'lganda x uchdan kichik chiqadi; minus ikkiga bo'lganda esa minus uch chiqadi va belgi buriladi — x minus uchdan KATTA. Nolni ikkala tengsizlikka qo'ying: ikkalasi ham to'g'ri chiqadi, ya'ni nol ikkala javobga ham kiradi.",
      'Здесь тоже решает знак коэффициента. При делении на положительное два выходит x меньше трёх; при делении на минус два выходит минус три и знак переворачивается — x БОЛЬШЕ минус трёх. Подставь нуль в оба неравенства: оба окажутся верными, то есть нуль входит в оба ответа.',
      'Here too the sign of the coefficient decides. Dividing by a positive two gives x less than three; dividing by minus two gives minus three and flips the sign — x is GREATER than minus three. Substitute zero into both inequalities: both come out true, so zero belongs to both answers.') },
    { when: (s) => s.pair.m1 === 't3' || s.pair.m3 === 't1', text: L(
      "Bu ikki tengsizlikda koeffitsiyent bir xil — musbat ikki, farq esa TENGSIZLIK BELGISIDA. Musbat songa bo'lish belgini o'zgartirmaydi, ya'ni «katta» «katta» bo'lib qoladi, «kichik» esa «kichik». Uchning ishorasi ikkalasida ham musbat.",
      'У этих двух неравенств коэффициент одинаков — положительное два, а различие в ЗНАКЕ НЕРАВЕНСТВА. Деление на положительное знак не меняет, то есть «больше» остаётся «больше», а «меньше» — «меньше». Знак тройки в обоих случаях положительный.',
      'These two inequalities share the coefficient — a positive two — and differ in the INEQUALITY SIGN. Dividing by a positive does not change the sign, so «greater» stays «greater» and «less» stays «less». The three is positive in both.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har tengsizlikda ikki savol bering: koeffitsiyent musbatmi yoki manfiy, va belgi qaysi tomonga qaragan. Manfiy koeffitsiyent ikki narsani birga o'zgartiradi — o'ng tomondagi sonning ishorasini va belgining yo'nalishini.",
      'В каждом неравенстве задай два вопроса: коэффициент положительный или отрицательный, и куда смотрит знак. Отрицательный коэффициент меняет сразу две вещи — знак числа справа и направление знака.',
      'Ask two questions of every inequality: is the coefficient positive or negative, and which way does the sign point. A negative coefficient changes two things at once — the sign of the number on the right and the direction of the inequality.') },
  ],
  wrongText: L(
    "Har tengsizlikni koeffitsiyentga bo'ling. Manfiy koeffitsiyentda ikki narsa o'zgaradi: o'ng tomon manfiy bo'ladi va belgi buriladi. Javobni son qo'yib tekshiring.",
    'Раздели каждое неравенство на коэффициент. При отрицательном коэффициенте меняются две вещи: правая часть становится отрицательной и знак переворачивается. Проверь ответ подстановкой.',
    'Divide each inequality by its coefficient. With a negative coefficient two things change: the right side becomes negative and the sign flips. Check your answer by substitution.'),
};

export default function D25_06(props) { return <MatchPairs data={DATA} {...props} />; }
