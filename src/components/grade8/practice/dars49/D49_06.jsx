// Dars49 · Amaliyot 06 — Guruhlar · 🟡 · tag: possible_chord
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §11 (49-dars, 6-pozitsiya)
//
// T2: vatar diametrdan KATTA bo'lmaydi. Radius o'n, ya'ni diametr yigirma —
// va shu son chegara bo'ladi.
//
// `AB = 20` CHEGARA HOLATI: u diametrning o'zi, ya'ni MUMKIN. `AB = 21` esa
// diametrdan bir birlik katta — «deyarli bo'ladi» degan narsa yo'q.
// Kartalarda faqat BELGI, zonalarning nomi esa SO'Z (skelet §0a.4).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'possible_chord', level: '🟡',
  zoneLbl: 116, zoneSize: 14, itemSize: 18,
  given: [['R = 10']],
  givenLabel: L('Aylananing radiusi', 'Радиус окружности', 'The radius of the circle'),
  zones: [
    { id: 'z1', label: L('MUMKIN', 'ВОЗМОЖНО', 'POSSIBLE') },
    { id: 'z2', label: L('MUMKIN EMAS', 'НЕВОЗМОЖНО', 'IMPOSSIBLE') },
  ],
  items: [
    { id: 'i1', tokens: ['AB = 20'], zone: 'z1' },
    { id: 'i2', tokens: ['AB = 25'], zone: 'z2' },
    { id: 'i3', tokens: ['AB = 14'], zone: 'z1' },
    { id: 'i4', tokens: ['AB = 21'], zone: 'z2' },
    { id: 'i5', tokens: ['AB = 8'], zone: 'z1' },
    { id: 'i6', tokens: ['AB = 30'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Aylananing radiusi o'n. Olti yozuvda vatarning uzunligi berilgan. Ularning ba'zisi bu aylanada bo'lishi mumkin, ba'zisi esa umuman bo'lolmaydi.",
    'Радиус окружности десять. В шести записях дана длина хорды. Некоторые из них в этой окружности возможны, а некоторых быть не может вовсе.',
    'The radius of a circle is ten. Six records give the length of a chord. Some of them are possible in this circle, others cannot exist at all.'),
  ask: L('Yozuvni bosing, keyin uning guruhini bosing.', 'Нажми запись, потом её группу.', 'Tap a record, then tap its group.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Chegara diametrda: radius o'n, ya'ni diametr yigirma. Vatar diametrdan katta bo'lmaydi, chunki diametr aylananing eng uzun vatari — u markazdan o'tadi va ikki radiusdan yig'iladi. Yigirma birlikdagi vatar MUMKIN: u aynan diametrning o'zi. O'n to'rt va sakkiz ham mumkin: ular markazdan biror masofada turadi (o'n to'rt uchun yetti, sakkiz uchun to'qqiz taqriban). Yigirma bir, yigirma besh va o'ttiz esa mumkin emas: ular diametrdan uzun, ya'ni aylananing ichiga sig'maydi. Yigirma bir chegaraga juda yaqin, lekin bu hech narsani o'zgartirmaydi.",
    'Верно. Граница на диаметре: радиус десять, значит диаметр двадцать. Хорда не бывает больше диаметра, ведь диаметр — самая длинная хорда окружности: он проходит через центр и складывается из двух радиусов. Хорда в двадцать единиц ВОЗМОЖНА: это и есть сам диаметр. Четырнадцать и восемь тоже возможны: они стоят на некотором расстоянии от центра. А двадцать один, двадцать пять и тридцать невозможны: они длиннее диаметра, то есть внутрь окружности не помещаются. Двадцать один совсем близко к границе, но это ничего не меняет.',
    'Correct. The boundary is the diameter: with radius ten the diameter is twenty. A chord is never greater than the diameter, since the diameter is the longest chord of a circle: it passes through the centre and is made of two radii. A chord of twenty is POSSIBLE: it is the diameter itself. Fourteen and eight are possible too: they sit at some distance from the centre. Twenty one, twenty five and thirty are impossible: they are longer than the diameter and do not fit inside the circle. Twenty one is very close to the line, but that changes nothing.'),
  wrongs: [
    { when: (s) => s.place.i1 === 'z2', text: L(
      "Yigirma — bu diametrning o'zi, va u MUMKIN: diametr ham vatar, shunchaki eng uzun vatar. Markazdan unga masofa nolga teng bo'ladi, chunki u markazdan o'tadi. Qoida «katta bo'lmaydi» deydi, «kichik bo'lishi kerak» demaydi.",
      'Двадцать — это сам диаметр, и он ВОЗМОЖЕН: диаметр тоже хорда, просто самая длинная. Расстояние от центра до него равно нулю, ведь он проходит через центр. Правило говорит «не больше», а не «должна быть меньше».',
      'Twenty is the diameter itself, and it is POSSIBLE: a diameter is a chord too, simply the longest one. The distance from the centre to it is zero, since it passes through the centre. The rule says never greater, not must be smaller.') },
    { when: (s) => s.place.i4 === 'z1', text: L(
      "Yigirma bir diametrdan bir birlik katta, ya'ni bunday vatar bo'lolmaydi. Chegaraga yaqinlik hech narsani o'zgartirmaydi: aylananing ichida yigirmadan uzun kesma yo'q. Hisob bilan tekshirish ham mumkin: yarim vatar o'n bir yarim, va yuz minus bir yuz o'ttiz ikki butun yigirma besh ildiz ostida manfiy son beradi.",
      'Двадцать один на единицу больше диаметра, значит такой хорды быть не может. Близость к границе ничего не меняет: внутри окружности нет отрезка длиннее двадцати. Можно проверить и счётом: половина хорды десять с половиной, и сто минус сто десять с четвертью даёт под корнем отрицательное число.',
      'Twenty one is one unit longer than the diameter, so such a chord cannot exist. Being close to the line changes nothing: inside the circle there is no segment longer than twenty. A computation shows it too: half the chord is ten and a half, and one hundred minus one hundred ten and a quarter puts a negative under the root.') },
    { when: (s) => s.place.i3 === 'z2' || s.place.i5 === 'z2', text: L(
      "Bu vatarlar diametrdan qisqa, ya'ni ular mumkin. Har biri markazdan biror masofada turadi: o'n to'rtlik vatar uchun yarim vatar yetti, yuz minus qirq to'qqiz ellik bir, masofa taqriban yetti butun bir; sakkizlik vatar uchun esa masofa taqriban to'qqiz butun ikki. Vatar qisqa bo'lgani sari u markazdan uzoqlashadi.",
      'Эти хорды короче диаметра, значит они возможны. Каждая стоит на некотором расстоянии от центра: для хорды четырнадцать половина семь, сто минус сорок девять — пятьдесят один, расстояние около семи; для хорды восемь расстояние около девяти. Чем короче хорда, тем дальше она от центра.',
      'These chords are shorter than the diameter, so they are possible. Each sits at some distance from the centre: for the chord fourteen the half is seven, one hundred minus forty nine is fifty one, the distance about seven; for the chord eight the distance is about nine. The shorter the chord, the farther from the centre.') },
    { when: (s) => s.place.i2 === 'z1' || s.place.i6 === 'z1', text: L(
      "Bu vatarlar diametrdan ancha uzun: yigirma besh va o'ttiz, diametr esa yigirma. Aylananing ichida diametrdan uzun kesma yo'q — bu T2 ning to'g'ridan-to'g'ri natijasi.",
      'Эти хорды заметно длиннее диаметра: двадцать пять и тридцать, а диаметр двадцать. Внутри окружности нет отрезка длиннее диаметра — это прямое следствие T2.',
      'These chords are well longer than the diameter: twenty five and thirty against a diameter of twenty. Inside a circle there is no segment longer than the diameter — a direct consequence of T2.') },
  ],
  wrongText: L(
    "Diametrni hisoblang: ikki radius. Vatar undan katta bo'lmaydi, lekin unga teng bo'lishi mumkin.",
    'Посчитай диаметр: два радиуса. Хорда не бывает больше него, но может быть ему равна.',
    'Compute the diameter: two radii. A chord is never greater than it, but may equal it.'),
};

export default function D49_06(props) { return <Zones data={DATA} {...props} />; }
