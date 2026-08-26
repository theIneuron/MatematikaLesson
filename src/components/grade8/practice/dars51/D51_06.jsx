// Dars51 · Amaliyot 06 — Ha yoki yo'q · 🟡 🖼 · tag: inscribed_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §3 (51-dars, 6-pozitsiya)
//
// JAVOB: HA, YO'Q (skelet §0a.1). Har da'voning yonida CHIZMA turadi:
//   1) diametrga tiralgan burchak — rost, T3 ning alohida holi;
//   2) yoyga TENG deb yozilgan burchak — yolg'on, З109.
// Ikkinchi chizmada yoy 100 gradus, ya'ni burchak 50 bo'lishi kerak,
// da'voda esa 100 turibdi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const F = { fig: 'circ', plain: true, w: 62, h: 62, r: 22, cx: 31, cy: 31 };

const DATA = {
  tag: 'inscribed_claims', level: '🟡',
  itemSize: 13,
  items: [
    // AC — diametr (0° va 180°), B 265° da: burchak to'g'ri
    { id: 's1', yes: true,
      tokens: [{ ...F, chords: [{ a: 0, b: 265, names: ['A', 'B'] }, { a: 180, b: 265, names: ['C', null] }], radii: [0, 180] }, '  ∠B = 90°'],
      claim: L('shu yozuv rost', 'эта запись верна', 'this record is true') },
    // yoy AC = 100° (40° dan 140° gacha), B 290° da: burchak 50, 100 emas
    { id: 's2', yes: false,
      tokens: [{ ...F, chords: [{ a: 140, b: 290, names: ['A', 'B'] }, { a: 40, b: 290, names: ['C', null] }], radii: [140, 40] }, '  yoy 100°,  ∠B = 100°'],
      claim: L('shu yozuv rost', 'эта запись верна', 'this record is true') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki chizma va ikki yozuv. Birinchisida AC diametr, ya'ni u markazdan o'tadi va uning yoyi bir yuz sakson gradus. Ikkinchisida AC yoyi bir yuz gradus. Ikkala chizmada ham B uchidan ichki chizilgan burchak chiqqan.",
    'Два рисунка и две записи. На первом AC это диаметр, то есть он проходит через центр и его дуга сто восемьдесят градусов. На втором дуга AC сто градусов. На обоих рисунках из вершины B выходит вписанный угол.',
    'Two drawings and two records. In the first, AC is a diameter, so it passes through the centre and its arc is a hundred and eighty degrees. In the second, the arc AC is a hundred degrees. In both drawings an inscribed angle leaves the vertex B.'),
  ask: L(
    "Yozuv rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Если запись верна — «Да», если ложна — «Нет».',
    'If the record is true, «Yes»; if false, «No».'),
  correctText: L(
    "To'g'ri. Ikkala javob ham bitta qoidadan chiqadi. Birinchisida yoy bir yuz sakson, uning yarmi to'qson, demak diametrga tiralgan burchak har doim to'g'ri burchak. Ikkinchisida yoy bir yuz, uning yarmi ellik, yozuvdagi bir yuz emas. Bitta qoida ikki javobni ham beradi: yarmini oling.",
    'Верно. Оба ответа выходят из одного правила. В первом дуга сто восемьдесят, её половина девяносто, значит угол, опирающийся на диаметр, всегда прямой. Во втором дуга сто, её половина пятьдесят, а не сто, как в записи. Одно правило даёт оба ответа: бери половину.',
    'Correct. Both answers follow from one rule. In the first the arc is a hundred and eighty, its half is ninety, so an angle subtending a diameter is always right. In the second the arc is a hundred, its half is fifty, not the hundred in the record. One rule gives both answers: take the half.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi yozuv YOLG'ON. Unda burchak yoyga teng deb olingan, aslida u yoyning yarmi: bir yuzning yarmi ellik. Chizmaga qarang, birinchi chizma bilan solishtiring: u yerda yoy bir yuz sakson va burchak to'qson, ya'ni ikki barobar kichik. Bu yerda ham xuddi shunday bo'lishi kerak.",
      'Вторая запись ЛОЖНА. В ней угол взят равным дуге, а на самом деле он половина дуги: половина ста это пятьдесят. Посмотри на рисунок и сравни с первым: там дуга сто восемьдесят, а угол девяносто, то есть вдвое меньше. Здесь должно быть так же.',
      'The second record is FALSE. In it the angle was taken equal to the arc, while it is half of it: half of a hundred is fifty. Look at the drawing and compare it with the first: there the arc is a hundred and eighty and the angle is ninety, twice as small. The same must hold here.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi yozuv ROST. AC diametr bo'lgani uchun u aylanani teng ikkiga bo'ladi, ya'ni yoyi bir yuz sakson gradus. Uning yarmi to'qson, demak burchak to'g'ri. Bu darsning alohida holi va u har doim ishlaydi: B nuqtasini aylana bo'ylab siljitsangiz ham burchak to'qson bo'lib qolaveradi.",
      'Первая запись ВЕРНА. Раз AC диаметр, он делит окружность пополам, то есть его дуга сто восемьдесят градусов. Её половина девяносто, значит угол прямой. Это частный случай урока, и он работает всегда: сдвинь точку B по окружности — угол так и останется девяносто.',
      'The first record is TRUE. Since AC is a diameter, it splits the circle in half, so its arc is a hundred and eighty degrees. Its half is ninety, so the angle is right. This is a special case of the lesson and it always holds: slide the point B along the circle and the angle stays ninety.') },
  ],
  wrongText: L(
    "Ikkala yozuvni bitta qoida hal qiladi: burchak yoyning yarmi. Yoyni ikkiga bo'ling.",
    'Обе записи решает одно правило: угол — половина дуги. Раздели дугу на два.',
    'One rule decides both records: the angle is half the arc. Divide the arc by two.'),
};

export default function D51_06(props) { return <TrueFalse data={DATA} {...props} />; }
