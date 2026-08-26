// Dars48 · Amaliyot 03 — Guruhlar · 🟢 · tag: equal_or_subtract
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §10 (48-dars, 3-pozitsiya)
//
// T2 IKKI QISMGA BO'LINADI, va jadval aynan shu bo'linishni tekshiradi:
// yoy yarim aylanadan kichik yoki teng bo'lsa, uning o'lchovi markaziy
// burchakka TENG; katta bo'lsa, markaziy burchak 360 dan AYIRISH bilan
// topiladi.
//
// `180°` — CHEGARA holati: u yarim aylana, va ikki qoida bir xil javob
// beradi (360 minus 180 ham 180). D37_04 dagi `90°` bilan bir xil naqsh:
// chegara istisno emas, o'sha qoidaning alohida holi.
// Kartalarda faqat BELGI, zonalarning nomi esa SO'Z (skelet §0a.4).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'equal_or_subtract', level: '🟢',
  zoneLbl: 132, zoneSize: 13, itemSize: 17,
  zones: [
    { id: 'z1', label: L('BURCHAKKA TENG', 'РАВНА УГЛУ', 'EQUALS THE ANGLE') },
    { id: 'z2', label: L('360° DAN AYIRILADI', 'ВЫЧИТАЕТСЯ ИЗ 360°', 'SUBTRACTED FROM 360°') },
  ],
  items: [
    { id: 'i1', tokens: ['60°'], zone: 'z1' },
    { id: 'i2', tokens: ['200°'], zone: 'z2' },
    { id: 'i3', tokens: ['95°'], zone: 'z1' },
    { id: 'i4', tokens: ['245°'], zone: 'z2' },
    { id: 'i5', tokens: ['150°'], zone: 'z1' },
    { id: 'i6', tokens: ['290°'], zone: 'z2' },
    { id: 'i7', tokens: ['180°'], zone: 'z1' },
    { id: 'i8', tokens: ['310°'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz yoyning gradus o'lchovi berilgan. Har biri uchun markaziy burchakni topish kerak, lekin yo'l ikki xil: ba'zi yoylar uchun burchak yoyning o'ziga teng, ba'zilari uchun esa uch yuz oltmishdan ayirish kerak.",
    'Даны градусные меры восьми дуг. Для каждой надо найти центральный угол, но путей два: для одних дуг угол равен самой дуге, для других надо вычитать из трёхсот шестидесяти.',
    'The degree measures of eight arcs are given. The central angle must be found for each, but there are two routes: for some arcs the angle equals the arc itself, for others you subtract from three hundred sixty.'),
  ask: L('Yoyni bosing, keyin uning guruhini bosing.', 'Нажми дугу, потом её группу.', 'Tap an arc, then tap its group.'),
  bank: L('Yoylar', 'Дуги', 'Arcs'),
  correctText: L(
    "To'g'ri. Chegara yarim aylanada: bir yuz sakson gradus. Undan kichik yoki teng yoylar uchun markaziy burchak yoyning o'ziga teng — oltmish, to'qson besh, bir yuz ellik va bir yuz sakson. Undan katta yoylar uchun esa burchak uch yuz oltmishdan ayirish bilan topiladi: ikki yuz uchun bir yuz oltmish, ikki yuz qirq besh uchun bir yuz o'n besh, ikki yuz to'qson uchun yetmish, uch yuz o'n uchun ellik. Nima uchun shunday: markaziy burchak bir yuz saksondan katta bo'lolmaydi. Bir yuz sakson alohida holat — u yarim aylana, va ikki qoida bir xil javob beradi: uch yuz oltmish minus bir yuz sakson ham bir yuz sakson. Bu istisno emas, o'sha qoidaning chegarasi.",
    'Верно. Граница на полуокружности: сто восемьдесят градусов. Для дуг меньше или равных ей центральный угол равен самой дуге — шестьдесят, девяносто пять, сто пятьдесят и сто восемьдесят. А для больших дуг угол находится вычитанием из трёхсот шестидесяти: для двухсот — сто шестьдесят, для двухсот сорока пяти — сто пятнадцать, для двухсот девяноста — семьдесят, для трёхсот десяти — пятьдесят. Почему так: центральный угол не бывает больше ста восьмидесяти. Сто восемьдесят — особый случай: это полуокружность, и оба правила дают один ответ, ведь триста шестьдесят минус сто восемьдесят тоже сто восемьдесят. Это не исключение, а граница того же правила.',
    'Correct. The boundary is the semicircle: one hundred eighty degrees. For arcs less than or equal to it the central angle equals the arc itself — sixty, ninety five, one hundred fifty and one hundred eighty. For larger arcs the angle comes from subtracting from three hundred sixty: two hundred gives one hundred sixty, two hundred forty five gives one hundred fifteen, two hundred ninety gives seventy, three hundred ten gives fifty. Why: a central angle never exceeds one hundred eighty. One hundred eighty is a special case: it is the semicircle, and both rules give the same answer, since three hundred sixty minus one hundred eighty is one hundred eighty too. Not an exception but the boundary of the same rule.'),
  wrongs: [
    { when: (s) => s.place.i7 === 'z2', text: L(
      "Bir yuz sakson — chegara holati, va uni birinchi guruhga qo'yish kerak: yoy yarim aylanaga TENG bo'lganda ham o'lchovi markaziy burchakka teng. Diqqat qiladigan joy: bu yerda ikki qoida bir xil javob beradi, chunki uch yuz oltmish minus bir yuz sakson ham bir yuz sakson. Ya'ni xato javob emas, xato QOIDA tanlangan — va boshqa songa o'sha qoida noto'g'ri javob berardi.",
      'Сто восемьдесят — граничный случай, и его надо отнести к первой группе: когда дуга РАВНА полуокружности, её мера тоже равна центральному углу. На что стоит обратить внимание: здесь оба правила дают один ответ, ведь триста шестьдесят минус сто восемьдесят тоже сто восемьдесят. То есть неверен не ответ, а выбранное ПРАВИЛО — на другом числе оно дало бы неверный результат.',
      'One hundred eighty is the boundary case and belongs to the first group: when an arc EQUALS the semicircle its measure equals the central angle too. Worth noticing: both rules give the same answer here, since three hundred sixty minus one hundred eighty is one hundred eighty as well. So it is not the answer that is wrong but the RULE chosen — on another number it would give a wrong result.') },
    { when: (s) => s.place.i1 === 'z2' || s.place.i3 === 'z2' || s.place.i5 === 'z2', text: L(
      "Bu yoylar yarim aylanadan KICHIK, ya'ni ular kichik yoy va ularning o'lchovi markaziy burchakka to'g'ridan-to'g'ri teng. Ayirish kerak emas. Tekshirish: agar oltmish gradusli yoy uchun ayirsangiz, burchak uch yuz bo'lardi — bunday markaziy burchak yo'q.",
      'Эти дуги МЕНЬШЕ полуокружности, значит они малые, и их мера равна центральному углу напрямую. Вычитать не нужно. Проверка: если для дуги шестьдесят градусов вычесть, угол вышел бы триста — такого центрального угла не бывает.',
      'These arcs are LESS than a semicircle, so they are minor and their measure equals the central angle directly. No subtraction is needed. A check: subtracting for a sixty-degree arc would give an angle of three hundred — no such central angle exists.') },
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1' || s.place.i6 === 'z1' || s.place.i8 === 'z1', text: L(
      "Bu yoylar yarim aylanadan KATTA, ya'ni ularning o'lchovi markaziy burchakka teng bo'lolmaydi: burchak bir yuz saksondan oshmaydi. Uch yuz oltmishdan ayirish kerak: ikki yuz uchun bir yuz oltmish, uch yuz o'n uchun ellik.",
      'Эти дуги БОЛЬШЕ полуокружности, значит их мера не может равняться центральному углу: угол не превышает ста восьмидесяти. Надо вычитать из трёхсот шестидесяти: для двухсот — сто шестьдесят, для трёхсот десяти — пятьдесят.',
      'These arcs are GREATER than a semicircle, so their measure cannot equal the central angle: an angle never exceeds one hundred eighty. Subtract from three hundred sixty: two hundred gives one hundred sixty, three hundred ten gives fifty.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har yoyni bir yuz sakson bilan solishtiring: kichik yoki teng bo'lsa birinchi guruh, katta bo'lsa ikkinchisi. Yarim aylana — chegara, va u birinchi guruhga kiradi.",
      'Сравни каждую дугу со ста восьмьюдесятью: меньше или равна — первая группа, больше — вторая. Полуокружность — граница, и она относится к первой группе.',
      'Compare every arc with one hundred eighty: less than or equal means the first group, greater means the second. The semicircle is the boundary and belongs to the first group.') },
  ],
  wrongText: L(
    "Chegara — 180°. Undan kichik yoki teng bo'lsa burchakka teng, katta bo'lsa 360 dan ayiriladi.",
    'Граница — 180°. Меньше или равно — равна углу, больше — вычитается из 360.',
    'The boundary is 180°. Less or equal means it equals the angle, greater means subtracting from 360.'),
};

export default function D48_03(props) { return <Zones data={DATA} {...props} />; }
