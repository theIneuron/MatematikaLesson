// Dars38 · Amaliyot 05 — Pazl · 🟡 · tag: rhombus_angles
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §10 (38-dars, 5-pozitsiya)
//
// ROMBDA ∠A = 50°, UCH JUFTLIK T2 NING UCH XOSSASINI KETMA-KET OCHADI:
//   ∠B    -> 130°  qo'shni burchak (parallelogrammning xossasi)
//   ∠BAC  -> 25°   diagonal burchakni TENG IKKIGA bo'ladi (romb)
//   ∠AOB  -> 90°   diagonallar PERPENDIKULYAR (romb)
// Ikkinchisi eng ko'p tashlab ketiladi: diagonalning burchakni bo'lishi
// «shunchaki kesib o'tish» deb tushuniladi.
//
// Kartalarda yozuv bo'shliqsiz (skelet §0a.5).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'rhombus_angles', level: '🟡',
  faceSize: 13, faceSizePhone: 11,
  given: [['∠A = 50°']],
  givenLabel: L('Rombda', 'В ромбе', 'In the rhombus'),
  cards: [
    { id: 'f1', side: 0, tokens: ['∠B'] },
    { id: 'f2', side: 0, tokens: ['∠BAC'] },
    { id: 'f3', side: 0, tokens: ['∠AOB'] },
    { id: 'v1', side: 1, v: '130°' },
    { id: 'v2', side: 1, v: '25°' },
    { id: 'v3', side: 1, v: '90°' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "ABCD romb, uning diagonallari O nuqtada kesishadi, va ∠A ellik gradusga teng. Uch burchakni topish kerak. Uchtasi uch xil xossaga tayanadi.",
    'ABCD ромб, его диагонали пересекаются в точке O, и ∠A равен пятидесяти градусам. Надо найти три угла. Все три опираются на три разных свойства.',
    'ABCD is a rhombus whose diagonals meet at O, and ∠A is fifty degrees. Three angles must be found. Each rests on a different property.'),
  ask: L(
    'Burchakni bosing, keyin uyani bosing.',
    'Нажми угол, потом ячейку.',
    'Tap an angle, then a slot.'),
  bank: L('Burchaklar', 'Углы', 'Angles'),
  correctText: L(
    "To'g'ri. Uch javob uch xossadan chiqadi. ∠B — ∠A ga qo'shni burchak, va bu xossa har parallelogrammda ishlaydi: bir yuz sakson minus ellik, bir yuz o'ttiz. ∠BAC esa A burchagining YARMI, chunki rombda diagonal burchakni teng ikkiga bo'ladi: ellikning yarmi yigirma besh. Bu xossa faqat rombda bor va sababi tomonlarning tengligida — AB va AD teng, ya'ni ABD uchburchak teng yonli, va diagonal uning simmetriya o'qi bo'ladi. ∠AOB esa diagonallar orasidagi burchak, va rombda ular perpendikulyar: to'qson gradus. Diqqat: uchinchi javob ∠A ga umuman bog'liq emas — u ellik bo'lsa ham, yetmish bo'lsa ham to'qson bo'lib qolaveradi.",
    'Верно. Три ответа выходят из трёх свойств. ∠B — соседний с ∠A, и это свойство работает в любом параллелограмме: сто восемьдесят минус пятьдесят, сто тридцать. А ∠BAC — ПОЛОВИНА угла A, потому что в ромбе диагональ делит угол пополам: половина пятидесяти двадцать пять. Это свойство есть только у ромба, и причина в равенстве сторон — AB и AD равны, значит треугольник ABD равнобедренный, и диагональ становится его осью симметрии. ∠AOB — угол между диагоналями, а в ромбе они перпендикулярны: девяносто градусов. Внимание: третий ответ от ∠A вообще не зависит — будь он пятьдесят или семьдесят, останется девяносто.',
    'Correct. The three answers come from three properties. ∠B is adjacent to ∠A, and that property works in every parallelogram: one hundred eighty minus fifty is one hundred thirty. ∠BAC is HALF of the angle A, because in a rhombus a diagonal bisects the angle: half of fifty is twenty-five. This property belongs to the rhombus alone, and its reason lies in the equal sides — AB and AD are equal, so the triangle ABD is isosceles and the diagonal becomes its axis of symmetry. ∠AOB is the angle between the diagonals, and in a rhombus they are perpendicular: ninety degrees. Note: the third answer does not depend on ∠A at all — whether it is fifty or seventy, ninety it stays.'),
  wrongs: [
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "∠BAC — bu A uchidagi burchakning BIR QISMI: AC diagonali uni ikki bo'lakka ajratadi. Rombda bunday bo'lish har doim TENG bo'ladi, chunki AB va AD tomonlar teng. Demak ∠BAC ellikning yarmi — yigirma besh. Belgilashni o'qing: uchta harfdan o'rtadagisi burchakning uchini, chetdagilari esa uning tomonlarini ko'rsatadi.",
      '∠BAC — это ЧАСТЬ угла при вершине A: диагональ AC делит его надвое. В ромбе такое деление всегда РАВНОЕ, потому что стороны AB и AD равны. Значит ∠BAC — половина пятидесяти, двадцать пять. Читай обозначение: из трёх букв средняя показывает вершину угла, а крайние — его стороны.',
      '∠BAC is a PART of the angle at the vertex A: the diagonal AC splits it in two. In a rhombus that split is always EQUAL, because the sides AB and AD are equal. So ∠BAC is half of fifty — twenty-five. Read the notation: of the three letters the middle one marks the vertex of the angle and the outer ones its sides.') },
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "∠AOB — diagonallar orasidagi burchak, va rombda diagonallar PERPENDIKULYAR, ya'ni bu burchak to'qson gradus. U ∠A ning qiymatiga umuman bog'liq emas: romb qanchalik qiya bo'lmasin, diagonallari to'g'ri burchak ostida kesishaveradi. Bu rombning ajratuvchi xossalaridan biri.",
      '∠AOB — угол между диагоналями, а в ромбе диагонали ПЕРПЕНДИКУЛЯРНЫ, значит этот угол девяносто градусов. От значения ∠A он не зависит вовсе: как бы ни был скошен ромб, диагонали пересекаются под прямым углом. Это одно из отличительных свойств ромба.',
      '∠AOB is the angle between the diagonals, and in a rhombus the diagonals are PERPENDICULAR, so this angle is ninety degrees. It does not depend on the value of ∠A at all: however slanted the rhombus, its diagonals cross at a right angle. This is one of the distinguishing properties of the rhombus.') },
    { when: (s) => s.mate.f1 !== 'v1', text: L(
      "∠B — ∠A ga qo'shni burchak: A va B uchlari bitta tomonning ikki uchida turadi. Bu xossa rombniki emas, PARALLELOGRAMMNIKI, ya'ni u 37-darsdan kelgan: qo'shni burchaklar bir yuz sakson gradusgacha to'ldiradi. Bir yuz sakson minus ellik bir yuz o'ttiz.",
      '∠B — угол, соседний с ∠A: вершины A и B стоят в двух концах одной стороны. Это свойство не ромба, а ПАРАЛЛЕЛОГРАММА, то есть пришло из урока 37: соседние углы дополняют друг друга до ста восьмидесяти. Сто восемьдесят минус пятьдесят сто тридцать.',
      '∠B is adjacent to ∠A: the vertices A and B stand at the two ends of one side. This property belongs not to the rhombus but to the PARALLELOGRAM, that is, it comes from lesson 37: adjacent angles add to one hundred eighty. One hundred eighty minus fifty is one hundred thirty.') },
  ],
  wrongText: L(
    "Har burchakning belgilashini o'qing: bitta harf — uchdagi to'liq burchak, uchta harf — uning bir qismi. Diagonal burchakni teng ikkiga bo'ladi, diagonallar esa perpendikulyar.",
    'Читай обозначение каждого угла: одна буква — полный угол при вершине, три буквы — его часть. Диагональ делит угол пополам, а диагонали перпендикулярны.',
    'Read the notation of every angle: one letter is the full angle at a vertex, three letters a part of it. A diagonal bisects the angle, and the diagonals are perpendicular.'),
};

export default function D38_05(props) { return <PairSlots data={DATA} {...props} />; }
