// Dars23 · Amaliyot 09 — Guruhlar · 🔴 · tag: first_bigger_or_smaller
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §5 (23-dars, 9-pozitsiya)
//
// З50 va З51 BIR JOYDA. To'rt juftlik, va har juftlik teskarisi bilan
// yonma-yon turadi — ya'ni «shu kartani ko'rdim, demak birinchi guruh»
// degan naqsh ishlamaydi:
//   1/3 va 1/4    surat teng, maxraji KATTA kasr KICHIK (З51)
//   −3 va −7      moduli katta manfiy son KICHIK (З50)
//   0,7 va 0,65   ko'proq raqamli o'nli kasr kattaroq emas
//   2/5 va 3/8    ko'z bilan aniqlab bo'lmaydi: 16/40 va 15/40
//
// Har kartada ikki son nuqta-vergul bilan ajratilgan: chapdagisi birinchi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'first_bigger_or_smaller', level: '🔴',
  zoneSize: 13, itemSize: 13, zoneLbl: 116,
  zones: [
    { id: 'z1', label: L('BIRINCHISI KATTA', 'ПЕРВОЕ БОЛЬШЕ', 'THE FIRST IS GREATER') },
    { id: 'z2', label: L('BIRINCHISI KICHIK', 'ПЕРВОЕ МЕНЬШЕ', 'THE FIRST IS SMALLER') },
  ],
  items: [
    { id: 'i1', tokens: [{ n: '1', d: '3' }, ';', { n: '1', d: '4' }], zone: 'z1' },
    { id: 'i2', tokens: [{ n: '1', d: '5' }, ';', { n: '1', d: '4' }], zone: 'z2' },
    { id: 'i3', tokens: ['−3 ; −7'], zone: 'z1' },
    { id: 'i4', tokens: ['−7 ; −3'], zone: 'z2' },
    { id: 'i5', tokens: ['0,7 ; 0,65'], zone: 'z1' },
    { id: 'i6', tokens: ['0,65 ; 0,7'], zone: 'z2' },
    { id: 'i7', tokens: [{ n: '2', d: '5' }, ';', { n: '3', d: '8' }], zone: 'z1' },
    { id: 'i8', tokens: [{ n: '3', d: '8' }, ';', { n: '2', d: '5' }], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Har kartada ikki son turibdi, chapdagisi — birinchisi. Kartalar juft-juft: har juftlikda o'sha ikki son, faqat tartibi almashgan.",
    'На каждой карточке два числа, левое — первое. Карточки идут парами: в каждой те же два числа, только порядок другой.',
    'Each card holds two numbers, the left one being the first. The cards come in pairs: each pair has the same two numbers in the opposite order.'),
  ask: L(
    'Kartani bosing, keyin guruhini bosing.',
    'Нажми карточку, потом её группу.',
    'Tap a card, then its group.'),
  bank: L('Juftliklar', 'Пары', 'Pairs'),
  correctText: L(
    "To'g'ri. Suratlari teng kasrda maxraji katta bo'lgani KICHIK. Manfiy sonlarda moduli katta bo'lgani kichik. O'nli kasrda raqamlar soni hech narsani hal qilmaydi. Oxirgi juftlikni esa faqat hisob ajratadi: o'n olti qirqdan va o'n besh qirqdan.",
    'Верно. У дробей с равными числителями меньше та, у которой знаменатель больше. У отрицательных меньше та, у которой модуль больше. В десятичной дроби число цифр не решает ничего. А последнюю пару разделяет только счёт: шестнадцать сороковых и пятнадцать сороковых.',
    'Correct. Among fractions with equal numerators the one with the larger denominator is smaller. Among negatives the one with the larger magnitude is smaller. In a decimal the count of digits decides nothing. And only computation separates the last pair: sixteen fortieths and fifteen fortieths.'),
  wrongs: [
    { when: (s) => s.place.i1 === 'z2' || s.place.i2 === 'z1', text: L(
        "Bu ikki kartada suratlar TENG, ya'ni maxraj hal qiladi: maxraj katta bo'lsa bo'lak kichikroq. Ayirma bilan tekshiring: bir uchdan minus bir to'rtdan bir o'n ikkidan — musbat.",
        'На этих двух карточках числители РАВНЫ, значит решает знаменатель: чем он больше, тем доля меньше. Проверь разностью: одна третья минус одна четвёртая это одна двенадцатая — положительна.',
        'On these two cards the numerators are EQUAL, so the denominator decides: the larger it is, the smaller the share. Check with the difference: one third minus one quarter is one twelfth — positive.') },
    { when: (s) => s.place.i3 === 'z2' || s.place.i4 === 'z1', text: L(
      "Manfiy sonlarda ko'rinish aldaydi: yetti uchdan katta, lekin MINUS yetti minus uchdan KICHIK. Son o'qiga qarang — minus yetti chapda turadi. Ayirma bilan tekshiring: minus uch minus minus yetti bu minus uch qo'shuv yetti, ya'ni to'rt — musbat.",
      'У отрицательных чисел вид обманывает: семь больше трёх, но МИНУС семь МЕНЬШЕ минус трёх. Посмотри на числовую прямую — минус семь левее. Проверь разностью: минус три минус минус семь это минус три плюс семь, то есть четыре — положительна.',
      'With negative numbers appearances deceive: seven is greater than three, but MINUS seven is SMALLER than minus three. Look at the number line — minus seven lies further left. Check with the difference: minus three minus minus seven is minus three plus seven, that is four — positive.') },
    { when: (s) => s.place.i7 === 'z2' || s.place.i8 === 'z1', text: L(
      "Bu juftlikni ko'z bilan aniqlab bo'lmaydi: ikki beshdan va uch sakkizdanda na surat, na maxraj taqqoslanadi. Umumiy maxraj qirq: ikki beshdan bu o'n olti qirqdan, uch sakkizdan bu o'n besh qirqdan. Ayirma bir qirqdan — musbat, demak ikki beshdan kattaroq.",
      'Эту пару глазом не определить: у двух пятых и трёх восьмых не сравниваются ни числители, ни знаменатели. Общий знаменатель сорок: две пятых это шестнадцать сороковых, три восьмых это пятнадцать сороковых. Разность одна сороковая — положительна, значит две пятых больше.',
      'This pair cannot be settled by eye: for two fifths and three eighths neither the numerators nor the denominators compare. The common denominator is forty: two fifths is sixteen fortieths, three eighths is fifteen fortieths. The difference is one fortieth — positive, so two fifths is greater.') },
    { when: (s) => s.place.i5 === 'z2' || s.place.i6 === 'z1', text: L(
      "O'nli kasrda raqamlar soni hech narsani hal qilmaydi: nol butun oltmish beshda ikki raqam bor, nol butun yettida bitta, lekin nol butun yetti KATTAROQ. Bir xil qavatga keltiring: yetmish yuzdan va oltmish besh yuzdan.",
      'В десятичной дроби число цифр ничего не решает: у ноля целых шестидесяти пяти две цифры, у ноля целых семи одна, но ноль целых семь БОЛЬШЕ. Приведи к одному разряду: семьдесят сотых и шестьдесят пять сотых.',
      'In a decimal the count of digits decides nothing: zero point six five has two digits and zero point seven has one, yet zero point seven is GREATER. Bring them to the same place: seventy hundredths and sixty five hundredths.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har kartada bitta ish qiling: chapdagi sondan o'ngdagisini ayiring va ishoraga qarang. Ko'rinishga qarab taxmin qilib bo'lmaydi — darsning butun mag'zi shu.",
      'С каждой карточкой делай одно: вычти из левого числа правое и посмотри на знак. По виду угадывать нельзя — в этом весь смысл урока.',
      'Do one thing with every card: subtract the right number from the left one and look at the sign. Guessing by appearance is not allowed — that is the whole point of the lesson.') },
  ],
  wrongText: L(
    "Har kartada ayirmani hisoblang: chapdagi son minus o'ngdagisi. Musbat chiqsa birinchisi katta. Maxraji katta kasr kichikroq, moduli katta manfiy son ham kichikroq.",
    'В каждой карточке вычисли разность: левое число минус правое. Положительна — первое больше. Дробь с большим знаменателем меньше, и отрицательное число с большим модулем тоже меньше.',
    'Compute the difference on every card: the left number minus the right one. Positive means the first is greater. A fraction with a larger denominator is smaller, and so is a negative number with a larger magnitude.'),
};

export default function D23_09(props) { return <Zones data={DATA} {...props} />; }
