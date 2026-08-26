// Dars37 · Amaliyot 03 — Guruhlar · 🟢 · tag: always_or_not
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §9 (37-dars, 3-pozitsiya)
//
// TO'RT JUFTLIK, HAR BIRI BITTA ADASHISHNI TUTADI:
//   AB = CD   / AB = BC     — qarama-qarshi va QO'SHNI tomonlar (З75)
//   ∠A = ∠C   / ∠A = ∠B     — qarama-qarshi va QO'SHNI burchaklar (З76)
//   ∠A+∠B=180 / AC = BD     — qo'shni burchaklar qoidasi va З77
//   AO = OC   / AC ⊥ BD     — diagonalning yarmi va perpendikulyarlik
//
// Kartalarda faqat BELGI turadi (skelet §0a.5), so'z yo'q — shuning uchun
// ular uch tilda ham bir xil o'qiladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'always_or_not', level: '🟢',
  zoneSize: 12, itemSize: 15, zoneLbl: 128,
  given: [['ABCD']],
  givenLabel: L('Parallelogramm', 'Параллелограмм', 'The parallelogram'),
  zones: [
    { id: 'z1', label: L("DOIM TO'G'RI", 'ВЕРНО ВСЕГДА', 'ALWAYS TRUE') },
    { id: 'z2', label: L("DOIM EMAS", 'НЕ ВСЕГДА', 'NOT ALWAYS') },
  ],
  items: [
    { id: 'i1', tokens: ['AB = CD'], zone: 'z1' },
    { id: 'i2', tokens: ['AB = BC'], zone: 'z2' },
    { id: 'i3', tokens: ['∠A = ∠C'], zone: 'z1' },
    { id: 'i4', tokens: ['∠A = ∠B'], zone: 'z2' },
    { id: 'i5', tokens: ['∠A + ∠B = 180°'], zone: 'z1' },
    { id: 'i6', tokens: ['AC = BD'], zone: 'z2' },
    { id: 'i7', tokens: ['AO = OC'], zone: 'z1' },
    { id: 'i8', tokens: ['AC ⊥ BD'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "ABCD parallelogramm, diagonallari O nuqtada kesishadi. Sakkiz da'vodan to'rttasi har parallelogrammda bajariladi, to'rttasi esa faqat ba'zilarida.",
    'ABCD параллелограмм, диагонали пересекаются в точке O. Из восьми утверждений четыре выполняются в любом параллелограмме, а четыре только в некоторых.',
    'ABCD is a parallelogram whose diagonals meet at O. Of the eight claims, four hold in every parallelogram and four only in some.'),
  ask: L("Da'voni bosing, keyin guruhini bosing.", 'Нажми утверждение, потом его группу.', 'Tap a claim, then its group.'),
  bank: L("Da'volar", 'Утверждения', 'Claims'),
  correctText: L(
    "To'g'ri. Doim bajariladigan to'rttasi — darsning tasdiqlari: qarama-qarshi tomonlar va burchaklar teng, qo'shni burchaklar yig'indisi 180 gradus, har diagonal teng ikkiga bo'linadi. Qolgan to'rttasi QO'SHIMCHA shartlar: ular rombni yoki to'g'ri to'rtburchakni bildiradi. Ular taqiqlanmagan — shunchaki HAR parallelogrammda bajarilmaydi.",
    'Верно. Четыре всегда верных — утверждения урока: противоположные стороны и углы равны, сумма соседних углов сто восемьдесят, каждая диагональ делится пополам. Остальные четыре — ДОПОЛНИТЕЛЬНЫЕ условия: они означают ромб или прямоугольник. Они не запрещены — просто выполняются не в КАЖДОМ параллелограмме.',
    'Correct. The four always-true ones are the statements of the lesson: opposite sides and angles are equal, adjacent angles sum to one hundred eighty, each diagonal is halved. The other four are EXTRA conditions: they name the rhombus or the rectangle. None is forbidden — they simply do not hold in EVERY parallelogram.'),
  wrongs: [
    { when: (s) => s.place.i2 === 'z1', text: L(
      "AB va BC — QO'SHNI tomonlar, ular B uchida uchrashadi. Parallelogrammda qarama-qarshi tomonlar teng, qo'shnilari esa teng bo'lishi shart emas: cho'zilgan parallelogrammning bo'yi enidan ancha katta. Qo'shni tomonlar teng bo'lsa, figura ROMB bo'ladi — bu 38-darsning mavzusi. Qo'shni kartaga qarang: u yerda AB va CD, ya'ni qarama-qarshi tomonlar.",
      'AB и BC — СОСЕДНИЕ стороны, они сходятся в вершине B. В параллелограмме равны противоположные стороны, а соседние равными быть не обязаны: у вытянутого параллелограмма длина заметно больше ширины. Если соседние стороны равны, фигура становится РОМБОМ — это тема урока 38. Посмотри на соседнюю карточку: там AB и CD, то есть противоположные стороны.',
      'AB and BC are ADJACENT sides, meeting at the vertex B. In a parallelogram the opposite sides are equal; adjacent ones need not be: a long parallelogram is much longer than it is wide. If adjacent sides are equal the figure becomes a RHOMBUS — the subject of lesson 38. Look at the neighbouring card: it holds AB and CD, that is, opposite sides.') },
    { when: (s) => s.place.i4 === 'z1', text: L(
      "∠A va ∠B — QO'SHNI burchaklar, ular bir tomonga yopishgan. Ular teng emas, balki yig'indisi bir yuz sakson gradusga teng: birinchisi oltmish bo'lsa, ikkinchisi yuz yigirma. Teng bo'lishi uchun ikkalasi ham to'qson gradus bo'lishi kerak, ya'ni figura to'g'ri to'rtburchak bo'lishi kerak. Qarama-qarshi burchaklar esa — ∠A va ∠C, — va ular har doim teng.",
      '∠A и ∠B — СОСЕДНИЕ углы, они прилежат к одной стороне. Они не равны, а дают в сумме сто восемьдесят градусов: если первый шестьдесят, то второй сто двадцать. Чтобы они были равны, оба должны равняться девяноста градусам, то есть фигура должна быть прямоугольником. А противоположные углы — это ∠A и ∠C, и они равны всегда.',
      '∠A and ∠B are ADJACENT angles, lying at one side. They are not equal but sum to one hundred eighty degrees: if the first is sixty, the second is one hundred twenty. For them to be equal both would have to be ninety degrees, that is, the figure would have to be a rectangle. The opposite angles are ∠A and ∠C, and those are always equal.') },
    { when: (s) => s.place.i6 === 'z1' || s.place.i8 === 'z1', text: L(
      "Diagonallarning tengligi ham, perpendikulyarligi ham har parallelogrammda bajarilmaydi. Ular qo'shimcha shartlar: teng diagonallar to'g'ri to'rtburchakni beradi, perpendikulyar diagonallar esa rombni. Cho'zilgan qiya parallelogrammni tasavvur qiling — uning diagonallari na teng, na perpendikulyar. Har doim bajariladigan xossa boshqa: har diagonal KESISHISH nuqtasida teng ikkiga bo'linadi.",
      'Ни равенство диагоналей, ни их перпендикулярность в любом параллелограмме не выполняются. Это дополнительные условия: равные диагонали дают прямоугольник, перпендикулярные — ромб. Представь вытянутый косой параллелограмм: его диагонали ни равны, ни перпендикулярны. Всегда выполняется другое свойство: каждая диагональ делится точкой ПЕРЕСЕЧЕНИЯ пополам.',
      'Neither equal nor perpendicular diagonals hold in every parallelogram. They are extra conditions: equal diagonals give a rectangle, perpendicular ones a rhombus. Picture a long slanted parallelogram: its diagonals are neither equal nor perpendicular. What always holds is different: each diagonal is halved by the point of INTERSECTION.') },
    { when: (s) => s.place.i1 === 'z2' || s.place.i3 === 'z2' || s.place.i5 === 'z2' || s.place.i7 === 'z2', text: L(
      "Bu da'vo har parallelogrammda bajariladi — u darsning tasdiqlaridan biri. Qarama-qarshi tomonlar va qarama-qarshi burchaklar teng; bir tomonga yopishgan ikki burchak bir yuz sakson gradusgacha to'ldiradi; har diagonal kesishish nuqtasida teng ikkiga bo'linadi. Bu to'rt xossa ta'rifdan chiqadi va qo'shimcha shart talab qilmaydi.",
      'Это утверждение выполняется в любом параллелограмме — оно одно из утверждений урока. Противоположные стороны и противоположные углы равны; два угла при одной стороне дополняют друг друга до ста восьмидесяти градусов; каждая диагональ делится точкой пересечения пополам. Эти четыре свойства следуют из определения и дополнительных условий не требуют.',
      'This claim holds in every parallelogram — it is one of the statements of the lesson. Opposite sides and opposite angles are equal; two angles at one side add to one hundred eighty degrees; each diagonal is halved by the point of intersection. These four properties follow from the definition and need no extra condition.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har da'voga bitta savol bering: unda QARAMA-QARSHI elementlar solishtirilyaptimi yoki QO'SHNILARI. Qarama-qarshi tomonlar va burchaklar har doim teng, qo'shnilari esa yo'q — ular boshqa qoidaga bo'ysunadi.",
      'К каждому утверждению задай один вопрос: сравниваются в нём ПРОТИВОПОЛОЖНЫЕ элементы или СОСЕДНИЕ. Противоположные стороны и углы равны всегда, а соседние нет — они подчиняются другому правилу.',
      'Ask one question of every claim: does it compare OPPOSITE elements or ADJACENT ones. Opposite sides and angles are always equal; adjacent ones are not — they obey a different rule.') },
  ],
  wrongText: L(
    "Qarama-qarshi elementlarni qo'shnilaridan ajrating. Qarama-qarshi tomonlar va burchaklar teng; qo'shni burchaklar esa 180 gacha to'ldiradi.",
    'Отличай противоположные элементы от соседних. Противоположные стороны и углы равны; соседние углы дополняют друг друга до 180.',
    'Tell opposite elements from adjacent ones. Opposite sides and angles are equal; adjacent angles add up to 180.'),
};

export default function D37_03(props) { return <Zones data={DATA} {...props} />; }
