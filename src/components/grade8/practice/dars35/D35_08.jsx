// Dars35 · Amaliyot 08 — Guruhlar · 🔴 · tag: mode_or_none
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §7 (35-dars, 8-pozitsiya)
//
// TO'RT JUFTLIK, HAR BIRIDA BITTA RAQAM O'ZGARGAN:
//   2,2,5   / 2,5,9    — takror bor / yo'q
//   4,7,7,9 / 4,7,8,9  — takror bor / yo'q
//   1,1,1   / 1,2,3    — hamma son bir xil / hammasi har xil
//   3,6,6,8 / 3,6,8,9  — takror bor / yo'q
// Uchinchi juftlikning birinchi qatori chegara holati: hamma son bir xil,
// va bunday qatorda ham moda bor — u bitta.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'mode_or_none', level: '🔴',
  zoneSize: 13, itemSize: 15, zoneLbl: 116,
  zones: [
    { id: 'z1', label: L('MODASI BOR', 'МОДА ЕСТЬ', 'HAS A MODE') },
    { id: 'z2', label: L("MODASI YO'Q", 'МОДЫ НЕТ', 'HAS NO MODE') },
  ],
  items: [
    { id: 'i1', tokens: ['2, 2, 5'], zone: 'z1' },
    { id: 'i2', tokens: ['2, 5, 9'], zone: 'z2' },
    { id: 'i3', tokens: ['4, 7, 7, 9'], zone: 'z1' },
    { id: 'i4', tokens: ['4, 7, 8, 9'], zone: 'z2' },
    { id: 'i5', tokens: ['1, 1, 1'], zone: 'z1' },
    { id: 'i6', tokens: ['1, 2, 3'], zone: 'z2' },
    { id: 'i7', tokens: ['3, 6, 6, 8'], zone: 'z1' },
    { id: 'i8', tokens: ['3, 6, 8, 9'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz qator. Ba'zilarida moda bor, ba'zilarida yo'q. Kartalar juft-juft turibdi: har juftlikda faqat bitta son o'zgargan.",
    'Восемь рядов. У одних мода есть, у других нет. Карточки стоят парами: в каждой паре изменено только одно число.',
    'Eight series. Some have a mode, some do not. The cards come in pairs: within each pair only one number has changed.'),
  ask: L('Qatorni bosing, keyin guruhini bosing.', 'Нажми ряд, потом его группу.', 'Tap a series, then its group.'),
  bank: L('Qatorlar', 'Ряды', 'Series'),
  correctText: L(
    "To'g'ri. Moda eng ko'p uchraydigan qiymat, ya'ni u faqat TAKROR bo'lganda paydo bo'ladi. Har qiymat bir martadan uchrasa, hech biri boshqasidan ko'p emas — bunday qatorda moda yo'q. Kartalarni juft-juft solishtiring: har juftlikda bitta son o'zgargan, va shu o'zgarish takrorni yo'q qiladi yoki yaratadi. Bir, bir, bir qatori alohida turadi: unda hamma son bir xil, ya'ni birlik uch marta uchraydi va u moda. Bu chegara holati «hamma son bir xil bo'lsa moda yo'q» degan taxminni rad etadi — aksincha, u yerda moda eng aniq ko'rinadi.",
    'Верно. Мода — самое частое значение, значит она появляется только при ПОВТОРЕ. Если каждое значение встретилось по одному разу, ни одно не встречается чаще других — в таком ряду моды нет. Сравнивай карточки парами: в каждой паре изменено одно число, и это изменение либо убирает повтор, либо создаёт его. Ряд один, один, один стоит особняком: в нём все числа одинаковы, то есть единица встречается три раза и она мода. Этот пограничный случай опровергает догадку «если все числа одинаковы, моды нет» — наоборот, там мода видна яснее всего.',
    'Correct. The mode is the most frequent value, so it appears only where there is a REPEAT. If every value occurs once, none occurs more than the others — such a series has no mode. Compare the cards in pairs: in each pair one number has changed, and that change either removes a repeat or creates one. The series one, one, one stands apart: every number is the same, so the one occurs three times and is the mode. This boundary case refutes the guess that «if all numbers are equal there is no mode» — on the contrary, the mode is clearest there.'),
  wrongs: [
    { when: (s) => s.place.i5 === 'z2', text: L(
      "Bir, bir, bir qatorida moda BOR va u birga teng. Moda eng ko'p uchraydigan qiymat, va bu yerda birlik uch marta uchraydi — bundan ko'p uchraydigan boshqa qiymat yo'q. «Hamma son bir xil bo'lsa tanlaydigan narsa yo'q» degan fikr noto'g'ri: tanlash bor, faqat u aniq — bitta qiymat hamma o'rinni egallagan.",
      'В ряду один, один, один мода ЕСТЬ и равна единице. Мода — самое частое значение, а здесь единица встречается три раза, и более частого значения нет. Мысль «если все числа одинаковы, выбирать нечего» неверна: выбор есть, просто он очевиден — одно значение заняло все места.',
      'The series one, one, one DOES have a mode, and it equals one. The mode is the most frequent value, and here the one occurs three times with no more frequent value present. The thought «if all numbers are equal there is nothing to choose» is wrong: there is a choice, only an obvious one — a single value has taken every place.') },
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1' || s.place.i6 === 'z1' || s.place.i8 === 'z1', text: L(
      "Bu qatorda hamma son BIR MARTADAN uchraydi, ya'ni hech biri eng ko'p emas. Moda uchun kamida bitta qiymat boshqalardan ko'proq takrorlanishi kerak. Qo'shni kartaga qarang: u yerda bitta son o'zgargan va takror paydo bo'lgan — aynan o'sha takror modani beradi.",
      'В этом ряду каждое число встречается ПО ОДНОМУ разу, значит ни одно не является самым частым. Для моды нужно, чтобы хотя бы одно значение повторялось чаще остальных. Посмотри на соседнюю карточку: там изменено одно число и появился повтор — именно он и даёт моду.',
      'In this series every number occurs ONCE, so none is the most frequent. For a mode, at least one value must repeat more than the others. Look at the neighbouring card: one number has changed there and a repeat appeared — and that repeat is what gives the mode.') },
    { when: (s) => s.place.i1 === 'z2' || s.place.i3 === 'z2' || s.place.i7 === 'z2', text: L(
      "Bu qatorda takror bor, ya'ni moda ham bor. Takrorlangan qiymatni toping: birinchi qatorda ikkilik ikki marta, ikkinchisida yettilik ikki marta, uchinchisida oltilik ikki marta turibdi. Qolgan sonlar bir martadan, demak takrorlangani eng ko'p uchraydigani — va u moda.",
      'В этом ряду есть повтор, значит есть и мода. Найди повторяющееся значение: в первом ряду двойка два раза, во втором семёрка два раза, в третьем шестёрка два раза. Остальные числа по одному разу, значит повторившееся и есть самое частое — оно и мода.',
      'This series has a repeat, so it has a mode. Find the repeated value: in the first series the two occurs twice, in the second the seven twice, in the third the six twice. The other numbers occur once, so the repeated one is the most frequent — and it is the mode.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har qatorga bitta savol bering: biror son ikki yoki undan ko'p marta uchraydimi. Uchrasa — moda bor; hamma son har xil bo'lsa — moda yo'q. Sonlarning kattaligi yoki qatorning uzunligi ahamiyatsiz.",
      'К каждому ряду задай один вопрос: встречается ли какое-нибудь число два и более раз. Встречается — мода есть; все числа разные — моды нет. Величина чисел и длина ряда значения не имеют.',
      'Ask one question of every series: does some number occur twice or more. If yes, there is a mode; if all numbers differ, there is none. The size of the numbers and the length of the series do not matter.') },
  ],
  wrongText: L(
    "Takrorni izlang: biror qiymat boshqalardan ko'proq uchrasa, moda bor. Hamma son bir martadan uchrasa, moda yo'q.",
    'Ищи повтор: если какое-то значение встречается чаще остальных, мода есть. Если все числа по одному разу, моды нет.',
    'Look for a repeat: if some value occurs more often than the rest, there is a mode. If every number occurs once, there is none.'),
};

export default function D35_08(props) { return <Zones data={DATA} {...props} />; }
