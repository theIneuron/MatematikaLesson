// Dars02 · Amaliyot 02 — To'liq javob qaysi · 🟢 · tag: full_answer_choice
//
// KETMA-KETLIK O'ZGARDI (metodist, 2026-08-24): bu topshiriq ilgari 3-o'rinda
// turgan, endi 2-o'rinda. Mexanikasi va matematikasi o'sha — 2-6 darslar
// 1-darsning o'nta mexanikasidan har xil tartibda foydalanadi (skelet §2).
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// METODIST QARORI 2026-08-22: bu topshiriq TEST tipiga o'tkazildi.
// Ilgari `SlotsBank` edi — zanjirdagi besh bo'shliq.
// `TIPLAR_AMALIYOT_8SINF.md` §5.11 to'rttadan bittasini tanlashni pul dan
// chiqargan; metodist ko'rsatmasi ustun (CLAUDE.md §6.1 p. 1), hujjatning
// o'sha bandi keyin tuzatiladi.
//
// TEST TAXMIN BILAN YECHILMASLIGI UCHUN to'rt variant deyarli bir xil:
// kasrning O'ZI uchtasida bir xil, farq faqat SHARTDA. Ya'ni tanlash uchun
// shartni o'zi chiqarish kerak, ko'rinishiga qarab emas.
//   0  6m/(m²+5m),  m ≠ −5, m ≠ 0   TO'G'RI
//   1  6m/(m²+5m),  m ≠ 0           eski shart yo'qoldi (З2)
//   2  6m/(m²+5m),  m ≠ −5          yangi shart yo'qoldi (З2)
//   3  6/(m²+5m),   m ≠ −5, m ≠ 0   faqat maxraj ko'paytirildi (З20)
// Variantlar har ochilganda aralashtiriladi (kit -> Choice), razbor
// shartlari esa ASL raqamda qoladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const F = { n: '6m', d: 'm² + 5m' };

const DATA = {
  tag: 'full_answer_choice', level: '🟢',
  correct: 0, optCols: 1, optSize: 17,
  eyebrow: L('Zanjir', 'Цепочка', 'Chain'),
  setup: L(
    "Kasrni maxraji m² + 5m bo'lgan kasrga keltirdik. Javobda yozuvning o'zi ham, sharti ham bo'lishi kerak.",
    'Дробь привели к знаменателю m² + 5m. В ответе должна быть и сама запись, и её условие.',
    'The fraction was brought to the denominator m² + 5m. The answer needs both the record and its condition.'),
  expr: [{ n: '6', d: 'm + 5' }], exprSize: 24,
  ask: L("To'liq javob qaysi?", 'Какой ответ полный?', 'Which answer is complete?'),
  opts: [
    { label: [F, ',', 'm ≠ −5,', 'm ≠ 0'] },
    { label: [F, ',', 'm ≠ 0'] },
    { label: [F, ',', 'm ≠ −5'] },
    { label: [{ n: '6', d: 'm² + 5m' }, ',', 'm ≠ −5,', 'm ≠ 0'] },
  ],
  correctText: L(
    "To'g'ri. Maxraj m ga ko'paytirilgan, demak surat ham m ga ko'paytiriladi: olti m. Shart ikkita: eskisi maxraj m qo'shuv beshdan — m minus beshga teng emas, yangisi ko'paytuvchi m dan — m nolga teng emas.",
    'Верно. Знаменатель умножен на m, значит и числитель умножается на m: шесть m. Условий два: старое из знаменателя m плюс пять — m не равно минус пяти, новое из множителя m — m не равно нулю.',
    'Correct. The denominator was multiplied by m, so the numerator is multiplied by m too: six m. There are two conditions: the old one from the denominator m plus five, and the new one from the factor m.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Kasr to'g'ri, shart esa yarim. M minus beshda dastlabki kasr ham ma'noga ega emas edi, va bu taqiq qayta yozishdan keyin ham qolaveradi.",
      'Дробь верна, а условие наполовину. При m равном минус пяти исходная дробь тоже не имела значения, и этот запрет остаётся после переписывания.',
      'The fraction is right, the condition is half. At m equal to minus five the original fraction had no value either, and that ban stays after rewriting.') },
    { when: (s) => s.picked === 2, text: L(
      "Eski shartni yozdingiz, yangisi esa yo'q. Ko'paytuvchi m yangi taqiq olib keldi: m nolda yangi maxraj nolga aylanadi. Nolni qo'ying va tekshiring.",
      'Старое условие ты записал, а нового нет. Множитель m принёс новый запрет: при m равном нулю новый знаменатель обращается в нуль. Подставь нуль и проверь.',
      'You wrote the old condition, but not the new one. The factor m brought a new ban: at m equal to zero the new denominator becomes zero. Substitute zero and check.') },
    { when: (s) => s.picked === 3, text: L(
      "Shart to'liq, lekin kasrning o'zi noto'g'ri: faqat maxraj ko'paytirilgan. Bunda qiymat o'zgaradi — m ni birga teng qo'ying, dastlabkisi bir beradi, bu variant esa bir oltidan.",
      'Условие полное, а сама дробь неверна: умножен только знаменатель. От этого значение меняется — подставь m равное одному: исходная даёт единицу, а этот вариант одну шестую.',
      'The condition is complete, but the fraction itself is wrong: only the denominator was multiplied. That changes the value — put m equal to one: the original gives one, this option gives one sixth.') },
  ],
  wrongText: L(
    "Ikki narsani birga tekshiring: surat va maxraj bitta ifodaga ko'paytirilganmi, va shartda IKKALA taqiq ham bormi.",
    'Проверяй две вещи сразу: умножены ли числитель и знаменатель на одно и то же, и стоят ли в условии ОБА запрета.',
    'Check two things at once: are numerator and denominator multiplied by the same thing, and does the condition carry BOTH bans.'),
};

export default function D02_02(props) { return <Choice data={DATA} {...props} />; }
