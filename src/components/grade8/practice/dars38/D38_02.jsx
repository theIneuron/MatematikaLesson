// Dars38 · Amaliyot 02 — Guruhlar · 🟢 · tag: rectangle_or_rhombus
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §10 (38-dars, 2-pozitsiya)
//
// «FAQAT» SO'ZI MUHIM. Ikkala figurada ham bajariladigan xossalar
// (qarama-qarshi tomonlar teng, diagonallar teng ikkiga bo'linadi)
// kartada UMUMAN yo'q — ular ajratmaydi, ya'ni bu topshiriq uchun
// foydasiz. Kartada faqat AJRATUVCHI xossalar turadi.
//
// З80 sof shaklda: to'g'ri to'rtburchakning xossalari burchaklar va
// diagonallarning TENGLIGI haqida, rombniki esa tomonlar va
// diagonallarning PERPENDIKULYARLIGI haqida.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'rectangle_or_rhombus', level: '🟢',
  zoneSize: 12, itemSize: 15, zoneLbl: 132,
  zones: [
    { id: 'z1', label: L("FAQAT TO'G'RI TO'RTBURCHAKDA", 'ТОЛЬКО В ПРЯМОУГОЛЬНИКЕ', 'ONLY IN THE RECTANGLE') },
    { id: 'z2', label: L('FAQAT ROMBDA', 'ТОЛЬКО В РОМБЕ', 'ONLY IN THE RHOMBUS') },
  ],
  items: [
    { id: 'i1', tokens: ['∠A = 90°'], zone: 'z1' },
    { id: 'i2', tokens: ['AB = BC'], zone: 'z2' },
    { id: 'i3', tokens: ['AC = BD'], zone: 'z1' },
    { id: 'i4', tokens: ['AC ⊥ BD'], zone: 'z2' },
    { id: 'i5', tokens: ['∠D = 90°'], zone: 'z1' },
    { id: 'i6', tokens: ['BC = CD'], zone: 'z2' },
    { id: 'i7', tokens: ['∠B = ∠A'], zone: 'z1' },
    { id: 'i8', tokens: ['∠BAC = ∠CAD'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "ABCD parallelogramm. Sakkiz xossaning har biri faqat bitta figurani ajratadi: to'rttasi to'g'ri to'rtburchakni, to'rttasi rombni. Ikkala figurada ham bajariladigan xossalar bu yerda yo'q — ular hech narsani ajratmaydi.",
    'ABCD параллелограмм. Каждое из восьми свойств выделяет только одну фигуру: четыре прямоугольник, четыре ромб. Свойств, выполняющихся в обеих фигурах, здесь нет — они ничего не различают.',
    'ABCD is a parallelogram. Each of the eight properties singles out just one figure: four the rectangle, four the rhombus. Properties that hold in both are absent here — they distinguish nothing.'),
  ask: L('Xossani bosing, keyin guruhini bosing.', 'Нажми свойство, потом его группу.', 'Tap a property, then its group.'),
  bank: L('Xossalar', 'Свойства', 'Properties'),
  correctText: L(
    "To'g'ri. Ikki figura ikki BOSHQA yo'ldan yasaladi. To'g'ri to'rtburchak burchaklardan boshlanadi: hamma burchagi to'g'ri, ya'ni qo'shni burchaklar ham teng bo'lib qoladi — har biri to'qson. Undan diagonallarning tengligi kelib chiqadi. Romb esa tomonlardan boshlanadi: qo'shni tomonlar teng, ya'ni to'rttasi ham teng. Undan diagonallarning perpendikulyarligi va ularning burchaklarni teng ikkiga bo'lishi kelib chiqadi — shuning uchun AC diagonali A burchagini ikki teng bo'lakka ajratadi. Naqshni eslab qolish oson: to'g'ri to'rtburchak — BURCHAK va TENGLIK, romb — TOMON va PERPENDIKULYARLIK.",
    'Верно. Две фигуры строятся ДВУМЯ разными путями. Прямоугольник начинается с углов: все углы прямые, значит и соседние углы оказываются равными — по девяносто каждый. Отсюда следует равенство диагоналей. А ромб начинается со сторон: соседние стороны равны, значит равны все четыре. Отсюда следуют перпендикулярность диагоналей и то, что они делят углы пополам, — поэтому диагональ AC разбивает угол A на две равные части. Закономерность запомнить легко: прямоугольник — УГЛЫ и РАВЕНСТВО, ромб — СТОРОНЫ и ПЕРПЕНДИКУЛЯРНОСТЬ.',
    'Correct. The two figures are built along TWO different routes. The rectangle starts from the angles: all angles are right, so the adjacent angles turn out equal too — ninety each. From this follows the equality of the diagonals. The rhombus starts from the sides: adjacent sides are equal, so all four are. From this follow the perpendicularity of the diagonals and their bisecting of the angles — which is why the diagonal AC splits the angle A into two equal parts. The pattern is easy to remember: rectangle — ANGLES and EQUALITY, rhombus — SIDES and PERPENDICULARITY.'),
  wrongs: [
    { when: (s) => s.place.i3 === 'z2' || s.place.i4 === 'z1', text: L(
      "Diagonallarning ikki xossasi almashib ketdi. TENG diagonallar to'g'ri to'rtburchakni bildiradi, PERPENDIKULYAR diagonallar esa rombni. Chizib ko'ring: cho'zilgan to'g'ri to'rtburchakning diagonallari teng, lekin ular ancha yotiq burchak ostida kesishadi; rombning diagonallari esa to'g'ri burchak ostida kesishadi, uzunliklari esa har xil.",
      'Два свойства диагоналей поменялись местами. РАВНЫЕ диагонали означают прямоугольник, а ПЕРПЕНДИКУЛЯРНЫЕ — ромб. Начерти: у вытянутого прямоугольника диагонали равны, но пересекаются под довольно пологим углом; а у ромба диагонали пересекаются под прямым углом, зато длины у них разные.',
      'The two diagonal properties changed places. EQUAL diagonals mean a rectangle, PERPENDICULAR ones a rhombus. Draw it: in a long rectangle the diagonals are equal but cross at a shallow angle; in a rhombus they cross at a right angle while their lengths differ.') },
    { when: (s) => s.place.i2 === 'z1' || s.place.i6 === 'z1', text: L(
      "Qo'shni TOMONLARNING tengligi rombni bildiradi, to'g'ri to'rtburchakni emas. To'g'ri to'rtburchakda tomonlar teng bo'lishi shart emas — cho'zilgan to'g'ri to'rtburchakni tasavvur qiling. Agar to'g'ri to'rtburchakda qo'shni tomonlar ham teng bo'lsa, u KVADRATGA aylanadi, ya'ni bu shart uni boshqa figuraga o'tkazadi.",
      'Равенство соседних СТОРОН означает ромб, а не прямоугольник. У прямоугольника стороны равными быть не обязаны — представь вытянутый прямоугольник. Если в прямоугольнике соседние стороны тоже равны, он превращается в КВАДРАТ, то есть это условие переводит его в другую фигуру.',
      'Equality of adjacent SIDES means a rhombus, not a rectangle. In a rectangle the sides need not be equal — picture a long rectangle. If a rectangle also has equal adjacent sides it becomes a SQUARE, so this condition moves it into another figure.') },
    { when: (s) => s.place.i1 === 'z2' || s.place.i5 === 'z2' || s.place.i7 === 'z2', text: L(
      "To'g'ri BURCHAK va qo'shni burchaklarning tengligi to'g'ri to'rtburchakni bildiradi. Rombda burchaklar to'g'ri bo'lishi shart emas: qiya rombni tasavvur qiling — uning ikki burchagi o'tkir, ikkitasi o'tmas. Agar rombning burchaklari to'g'ri bo'lsa, u kvadratga aylanadi.",
      'Прямой УГОЛ и равенство соседних углов означают прямоугольник. В ромбе углы прямыми быть не обязаны: представь косой ромб — у него два угла острые, два тупые. Если углы ромба прямые, он превращается в квадрат.',
      'A right ANGLE and equal adjacent angles mean a rectangle. In a rhombus the angles need not be right: picture a slanted rhombus — two of its angles are acute and two obtuse. If a rhombus has right angles it becomes a square.') },
    { when: (s) => s.place.i8 === 'z1', text: L(
      "Diagonalning burchakni teng ikkiga bo'lishi ROMBNING xossasi. To'g'ri to'rtburchakda bu bajarilmaydi: cho'zilgan to'g'ri to'rtburchakning diagonali uning to'qson graduslik burchagini teng emas, notekis ikki bo'lakka ajratadi. Rombda esa bo'lish teng bo'ladi, chunki diagonalning ikki tomonida teng tomonlar turadi.",
      'То, что диагональ делит угол пополам, — свойство РОМБА. В прямоугольнике оно не выполняется: диагональ вытянутого прямоугольника делит его прямой угол на две неравные части. А в ромбе деление получается ровным, потому что по обе стороны диагонали стоят равные стороны.',
      'A diagonal bisecting an angle is a property of the RHOMBUS. In a rectangle it fails: the diagonal of a long rectangle splits its right angle into two unequal parts. In a rhombus the split is even, because equal sides stand on either side of the diagonal.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har xossaga bitta savol bering: u BURCHAKLAR haqidami yoki TOMONLAR haqida. Burchaklar va diagonallarning tengligi to'g'ri to'rtburchakni beradi, tomonlar va diagonallarning perpendikulyarligi rombni.",
      'К каждому свойству задай один вопрос: оно про УГЛЫ или про СТОРОНЫ. Углы и равенство диагоналей дают прямоугольник, стороны и перпендикулярность диагоналей — ромб.',
      'Ask one question of every property: is it about ANGLES or about SIDES. Angles and equal diagonals give the rectangle; sides and perpendicular diagonals give the rhombus.') },
  ],
  wrongText: L(
    "To'g'ri to'rtburchak — burchaklar va diagonallarning tengligi. Romb — tomonlar va diagonallarning perpendikulyarligi.",
    'Прямоугольник — углы и равенство диагоналей. Ромб — стороны и перпендикулярность диагоналей.',
    'The rectangle is angles and equal diagonals. The rhombus is sides and perpendicular diagonals.'),
};

export default function D38_02(props) { return <Zones data={DATA} {...props} />; }
