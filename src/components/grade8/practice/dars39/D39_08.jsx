// Dars39 · Amaliyot 08 — Pazl · 🔴 · tag: angle_to_neighbour
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §11 (39-dars, 8-pozitsiya)
//
// UCH JUFTLIK, VA UCHINCHISI З82 NING O'ZI:
//   ∠A = 60°  -> ∠B = 120°
//   ∠D = 95°  -> ∠C = 85°
//   ∠A = 90°  -> ∠B = 90°     <- to'g'ri burchakli trapetsiya
// Uchinchi juftlikda «180 gacha to'ldirish» qoidasi ham TO'G'RI BURCHAK
// beradi, ya'ni to'g'ri burchakli trapetsiyada ular IKKITA. Bu fakt
// odatda unutiladi: bitta to'g'ri burchak chizilgan bo'lsa ham,
// ikkinchisi avtomatik paydo bo'ladi.
//
// Kartalarda yozuv bo'shliqsiz (skelet §0a.5).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'angle_to_neighbour', level: '🔴',
  faceSize: 12, faceSizePhone: 10,
  given: [['BC ∥ AD']],
  givenLabel: L('Trapetsiya ABCD', 'Трапеция ABCD', 'The trapezoid ABCD'),
  cards: [
    { id: 'f1', side: 0, tokens: ['∠A=60°'] },
    { id: 'f2', side: 0, tokens: ['∠D=95°'] },
    { id: 'f3', side: 0, tokens: ['∠A=90°'] },
    { id: 'v1', side: 1, v: '∠B=120°' },
    { id: 'v2', side: 1, v: '∠C=85°' },
    { id: 'v3', side: 1, v: '∠B=90°' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch trapetsiyada BC va AD asoslar. Har birida bitta burchak berilgan, va o'sha YON TOMONDAGI qo'shni burchakni topish kerak: A bilan B bitta yon tomonda, D bilan C ikkinchisida.",
    'В трёх трапециях BC и AD — основания. В каждой дан один угол, и надо найти соседний с ним угол при ТОЙ ЖЕ боковой стороне: A и B на одной боковой, D и C на другой.',
    'In three trapezoids BC and AD are the bases. One angle is given in each, and the adjacent angle at the SAME leg must be found: A and B lie on one leg, D and C on the other.'),
  ask: L(
    'Berilgan burchakni bosing, keyin uyani bosing.',
    'Нажми данный угол, потом ячейку.',
    'Tap the given angle, then a slot.'),
  bank: L('Burchaklar', 'Углы', 'Angles'),
  correctText: L(
    "To'g'ri. Asoslar parallel, yon tomon esa ularni kesib o'tadi — demak bitta yon tomondagi ikki burchak bir yuz sakson gradusgacha to'ldiradi. Birinchisida: bir yuz sakson minus oltmish, bir yuz yigirma. Ikkinchisida: bir yuz sakson minus to'qson besh, sakson besh. Uchinchisida esa bir yuz sakson minus to'qson — yana to'qson. Bu oxirgi hol alohida: agar trapetsiyaning bitta burchagi to'g'ri bo'lsa, o'sha yon tomondagi ikkinchi burchak ham TO'G'RI bo'ladi, ya'ni bunday trapetsiyada to'g'ri burchak hech qachon yolg'iz turmaydi — ular ikkita. Uni to'g'ri burchakli trapetsiya deyishadi, va uning bir yon tomoni asoslarga perpendikulyar bo'ladi.",
    'Верно. Основания параллельны, а боковая сторона их пересекает — значит два угла при одной боковой дополняют друг друга до ста восьмидесяти. В первой: сто восемьдесят минус шестьдесят, сто двадцать. Во второй: сто восемьдесят минус девяносто пять, восемьдесят пять. В третьей: сто восемьдесят минус девяносто — снова девяносто. Этот последний случай особый: если один угол трапеции прямой, то и второй при той же боковой стороне ПРЯМОЙ, то есть в такой трапеции прямой угол никогда не бывает один — их два. Её называют прямоугольной трапецией, и одна её боковая сторона перпендикулярна основаниям.',
    'Correct. The bases are parallel and the leg cuts across them — so the two angles at one leg add to one hundred eighty. In the first: one hundred eighty minus sixty is one hundred twenty. In the second: one hundred eighty minus ninety-five is eighty-five. In the third: one hundred eighty minus ninety — ninety again. This last case is special: if one angle of a trapezoid is right, the second at the same leg is RIGHT too, so in such a trapezoid a right angle is never alone — there are two. It is called a right trapezoid, and one of its legs is perpendicular to the bases.'),
  wrongs: [
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Uchinchi juftlikda javob berilgan burchakka TENG chiqadi, va shu sababli u xato bo'lib ko'rinadi. Lekin hisob o'sha: bir yuz sakson minus to'qson to'qson. Bu tasodif emas, balki fakt: to'g'ri burchakli trapetsiyada to'g'ri burchak IKKITA bo'ladi. Chizmani tasavvur qiling — bir yon tomon asoslarga perpendikulyar bo'lsa, u ikkala asos bilan ham to'g'ri burchak hosil qiladi.",
      'В третьей паре ответ оказывается РАВЕН данному углу, и потому кажется ошибочным. Но счёт тот же: сто восемьдесят минус девяносто девяносто. Это не совпадение, а факт: в прямоугольной трапеции прямых угла ДВА. Представь чертёж — если боковая сторона перпендикулярна основаниям, она образует прямой угол с обоими.',
      'In the third pair the answer comes out EQUAL to the given angle, and so it looks wrong. But the arithmetic is the same: one hundred eighty minus ninety is ninety. This is not a coincidence but a fact: a right trapezoid has TWO right angles. Picture the drawing — if a leg is perpendicular to the bases, it makes a right angle with both.') },
    { when: (s) => s.mate.f1 === 'v2' || s.mate.f2 === 'v1', text: L(
      "Bu ikki javob almashib ketdi. Har birini alohida hisoblang: bir yuz sakson minus oltmish bir yuz yigirma; bir yuz sakson minus to'qson besh sakson besh. Tekshirishning oson yo'li: burchak to'g'ri burchakdan kichik bo'lsa, uning qo'shnisi o'tmas bo'ladi, va aksincha.",
      'Эти два ответа поменялись местами. Посчитай каждый отдельно: сто восемьдесят минус шестьдесят сто двадцать; сто восемьдесят минус девяносто пять восемьдесят пять. Простая проверка: если угол меньше прямого, соседний будет тупым, и наоборот.',
      'These two answers were swapped. Compute each on its own: one hundred eighty minus sixty is one hundred twenty; one hundred eighty minus ninety-five is eighty-five. An easy check: if the angle is below a right angle its neighbour is obtuse, and the other way round.') },
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Ikkinchi juftlikda ∠D berilgan va ∠C so'ralyapti — bular BOSHQA yon tomonda, D va C uchlari CD tomonining ikki uchida. Qoida o'sha: bir yuz sakson minus to'qson besh sakson besh. Harflarni tekshiring: A bilan B bitta yon tomonda, D bilan C esa ikkinchisida.",
      'Во второй паре дан ∠D и спрашивается ∠C — они при ДРУГОЙ боковой стороне: вершины D и C стоят в двух концах стороны CD. Правило то же: сто восемьдесят минус девяносто пять восемьдесят пять. Проверь буквы: A с B на одной боковой, D с C на другой.',
      'In the second pair ∠D is given and ∠C is asked for — they lie at the OTHER leg: the vertices D and C stand at the two ends of the side CD. The rule is the same: one hundred eighty minus ninety-five is eighty-five. Check the letters: A with B on one leg, D with C on the other.') },
  ],
  wrongText: L(
    "Bitta yon tomondagi ikki burchak 180 gacha to'ldiradi. To'g'ri burchakda bu qoida yana to'g'ri burchak beradi — ular ikkita bo'ladi.",
    'Два угла при одной боковой стороне дополняют друг друга до 180. При прямом угле это правило снова даёт прямой — их получается два.',
    'Two angles at one leg add to 180. At a right angle the rule gives a right angle again — there turn out to be two.'),
};

export default function D39_08(props) { return <PairSlots data={DATA} {...props} />; }
