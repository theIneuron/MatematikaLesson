// Dars39 · Amaliyot 06 — Guruhlar · 🟡 · tag: trapezoid_or_not
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §11 (39-dars, 6-pozitsiya)
//
// SAKKIZ SHART, VA HAMMASI BELGI BILAN YOZILGAN (skelet §0a.5):
// `∥` parallel, `∦` parallel emas. Ular uch tilda ham bir xil o'qiladi.
//
// Rad etilgan to'rttasi to'rt xil sababdan:
//   BC∥AD, AB∥CD        — ikki juft parallel: parallelogramm
//   AB∦CD, BC∦AD        — hech bir juft parallel emas
//   AB=CD, BC=AD        — parallelogrammning boshqa belgisi
//   ∠A=∠B=∠C=∠D=90°     — to'g'ri to'rtburchak, ya'ni yana parallelogramm
// To'rtinchi karta boshqa harflar bilan (MNPQ): belgilash o'zgarsa ham
// ta'rif o'zgarmasligini ko'rsatadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'trapezoid_or_not', level: '🟡',
  zoneSize: 12, itemSize: 13, zoneLbl: 124,
  zones: [
    { id: 'z1', label: L("TRAPETSIYA BO'LADI", 'ЭТО ТРАПЕЦИЯ', 'IS A TRAPEZOID') },
    { id: 'z2', label: L("BO'LMAYDI", 'НЕ ТРАПЕЦИЯ', 'IS NOT') },
  ],
  items: [
    { id: 'i1', tokens: ['BC ∥ AD,  AB ∦ CD'], zone: 'z1' },
    { id: 'i2', tokens: ['BC ∥ AD,  AB ∥ CD'], zone: 'z2' },
    { id: 'i3', tokens: ['AB ∥ CD,  AD ∦ BC'], zone: 'z1' },
    { id: 'i4', tokens: ['AB ∦ CD,  BC ∦ AD'], zone: 'z2' },
    { id: 'i5', tokens: ['BC ∥ AD,  BC ≠ AD,  AB ∦ CD'], zone: 'z1' },
    { id: 'i6', tokens: ['AB = CD,  BC = AD'], zone: 'z2' },
    { id: 'i7', tokens: ['MN ∥ PQ,  MQ ∦ NP'], zone: 'z1' },
    { id: 'i8', tokens: ['∠A = ∠B = ∠C = ∠D = 90°'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz shart to'rtburchakning tomonlari haqida. Belgilar: ikki chiziq — parallel, chizilgan ikki chiziq — parallel emas. Har shartga qarab figura trapetsiya bo'ladimi yoki yo'qmi aniqlash kerak.",
    'Восемь условий о сторонах четырёхугольника. Знаки: две черты — параллельны, перечёркнутые две черты — не параллельны. По каждому условию надо определить, будет ли фигура трапецией.',
    'Eight conditions about the sides of a quadrilateral. The signs: two strokes mean parallel, the struck-through pair means not parallel. From each condition decide whether the figure is a trapezoid.'),
  ask: L('Shartni bosing, keyin guruhini bosing.', 'Нажми условие, потом его группу.', 'Tap a condition, then its group.'),
  bank: L('Shartlar', 'Условия', 'Conditions'),
  correctText: L(
    "To'g'ri. Trapetsiya uchun IKKI shart birga kerak: bir juft parallel bo'lsin va ikkinchi juft parallel BO'LMASIN. Qabul qilingan to'rt kartada ikkovi ham yozilgan; oxirgisida harflar boshqa, ta'rif esa o'sha. Rad etilganlarning uchtasi bitta oiladan — parallelogrammdan: ikki juft parallellik, tomonlarning tengligi va to'rt to'g'ri burchak. To'rtinchisida parallel juft umuman yo'q.",
    'Верно. Для трапеции нужны ДВА условия сразу: одна пара параллельна и другая НЕ параллельна. В четырёх принятых записаны оба; в последней другие буквы, а определение то же. Три отвергнутые — из одного семейства, параллелограмма: две параллельные пары, равенство сторон и четыре прямых угла. В четвёртой параллельных пар нет вовсе.',
    'Correct. A trapezoid needs TWO conditions together: one pair parallel and the other NOT parallel. The four accepted cards state both; the last uses different letters while the definition stays the same. Three of the rejected belong to one family, the parallelogram: two parallel pairs, equal sides, four right angles. The fourth has no parallel pair at all.'),
  wrongs: [
    { when: (s) => s.place.i2 === 'z1', text: L(
      "Bu shartda IKKALA juft ham parallel, ya'ni figura parallelogramm. Ta'rifning birinchi yarmi bajariladi, ikkinchisi esa buziladi: trapetsiyada qolgan juft parallel BO'LMASLIGI kerak. Bu eng ko'p uchraydigan xato, chunki «bir juft parallel» degan so'zlar bu yerda ham to'g'ri — lekin ta'rif ikki shartdan iborat.",
      'В этом условии параллельны ОБЕ пары, значит фигура параллелограмм. Первая половина определения выполняется, а вторая нарушена: в трапеции другая пара параллельной быть НЕ должна. Это самая частая ошибка, ведь слова «одна пара параллельна» здесь тоже верны — но определение состоит из двух условий.',
      'In this condition BOTH pairs are parallel, so the figure is a parallelogram. The first half of the definition holds while the second is broken: in a trapezoid the other pair must NOT be parallel. This is the commonest error, since the words «one pair is parallel» are true here as well — but the definition has two conditions.') },
    { when: (s) => s.place.i6 === 'z1' || s.place.i8 === 'z1', text: L(
      "Bu shartlar parallellik haqida umuman gapirmaydi, lekin ular parallelogrammni beradi. Ikki juft tomonning tengligi parallelogrammning belgisi — bu 37-darsdan; to'rt to'g'ri burchak esa to'g'ri to'rtburchakni beradi, u ham parallelogramm. Ikkala holda ham ikkinchi juft parallel bo'lib qoladi, ya'ni trapetsiyaning sharti buziladi.",
      'Эти условия о параллельности вовсе не говорят, но дают параллелограмм. Равенство двух пар сторон — признак параллелограмма, это из урока 37; четыре прямых угла дают прямоугольник, который тоже параллелограмм. В обоих случаях вторая пара оказывается параллельной, то есть условие трапеции нарушается.',
      'These conditions say nothing about parallelism, yet they give a parallelogram. Equality of two pairs of sides is a mark of the parallelogram, from lesson 37; four right angles give a rectangle, which is a parallelogram too. In both cases the second pair turns out parallel, so the trapezoid condition fails.') },
    { when: (s) => s.place.i4 === 'z1', text: L(
      "Bu shartda hech bir juft parallel EMAS, ya'ni ta'rifning birinchi yarmi ham bajarilmaydi. Trapetsiyada kamida bitta juft parallel bo'lishi SHART — bular asoslar. Parallel jufti yo'q to'rtburchakning maxsus nomi yo'q, u shunchaki to'rtburchak.",
      'В этом условии НЕ параллельна ни одна пара, значит не выполняется даже первая половина определения. В трапеции хотя бы одна пара ОБЯЗАНА быть параллельной — это основания. У четырёхугольника без параллельных пар особого названия нет, он просто четырёхугольник.',
      'In this condition NO pair is parallel, so even the first half of the definition fails. In a trapezoid at least one pair MUST be parallel — those are the bases. A quadrilateral with no parallel pair has no special name; it is simply a quadrilateral.') },
    { when: (s) => s.place.i7 === 'z2' || s.place.i3 === 'z2' || s.place.i5 === 'z2', text: L(
      "Bu shartda ikkala talab ham bajarilgan: bir juft parallel, ikkinchisi esa parallel emas. Demak figura trapetsiya. Harflarning boshqa bo'lgani (MNPQ) yoki qo'shimcha shartning yozilgani ta'rifni o'zgartirmaydi — muhimi qaysi juft parallel va qaysinisi emas.",
      'В этом условии выполнены оба требования: одна пара параллельна, другая нет. Значит фигура — трапеция. Другие буквы (MNPQ) или дописанное дополнительное условие определения не меняют — важно, какая пара параллельна, а какая нет.',
      'In this condition both requirements are met: one pair is parallel, the other is not. So the figure is a trapezoid. Different letters (MNPQ) or an extra condition written in do not change the definition — what matters is which pair is parallel and which is not.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har shartda ikki narsani alohida toping: qaysi juft parallel va qaysinisi parallel emas. Ikkala javob ham bo'lganda va ular BOSHQA-BOSHQA juftlar haqida bo'lganda figura trapetsiya bo'ladi.",
      'В каждом условии найди две вещи по отдельности: какая пара параллельна и какая не параллельна. Когда есть оба ответа и они о РАЗНЫХ парах, фигура трапеция.',
      'In every condition find two things separately: which pair is parallel and which is not. When both answers are present and they concern DIFFERENT pairs, the figure is a trapezoid.') },
  ],
  wrongText: L(
    "Ikki shartni birga tekshiring: bir juft parallel bo'lsin va ikkinchisi parallel bo'lmasin. Tomonlarning tengligi va to'g'ri burchaklar parallelogrammni beradi.",
    'Проверяй два условия сразу: одна пара параллельна и другая не параллельна. Равенство сторон и прямые углы дают параллелограмм.',
    'Check two conditions together: one pair parallel and the other not. Equal sides and right angles give a parallelogram.'),
};

export default function D39_06(props) { return <Zones data={DATA} {...props} />; }
