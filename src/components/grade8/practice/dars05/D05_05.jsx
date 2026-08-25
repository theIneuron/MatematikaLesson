// Dars05 · Amaliyot 05 — Test · 🟡 · tag: third_condition
//
// KETMA-KETLIK O'ZGARDI (metodist, 2026-08-24): bu topshiriq ilgari 4-o'rinda
// turgan, endi 5-o'rinda. Mexanikasi va matematikasi o'sha — 2-6 darslar
// 1-darsning o'nta mexanikasidan har xil tartibda foydalanadi
// (`DARS02_06_AMALIYOT_SKELET.md` §2).
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// h/(h+1) : (h−4)/(h+7). Ag'darib ko'paytiramiz:
//   h/(h+1) · (h+7)/(h−4) = h(h+7) / ((h+1)(h−4))
// UCHTA shart, va ular uch xil joydan keladi:
//   h ≠ −1   birinchi kasrning maxrajidan
//   h ≠ −7   BO'LUVCHINING MAXRAJIDAN — natijada u KO'RINMAY qoladi (З2)
//   h ≠ 4    BO'LUVCHINING SURATIDAN — nolga bo'lib bo'lmaydi (З26,
//            darsning uchinchi tasdig'i va eng qimmat joyi)
// Variantlar aynan shu ikki taqiqning yo'qolishi bo'yicha qurilgan.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const R = { n: 'h(h + 7)', d: '(h + 1)(h − 4)' };

const DATA = {
  tag: 'third_condition', level: '🟡',
  correct: 0, optCols: 1, optSize: 15,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Bo'lish bajarildi. Javobda yozuvning o'zi ham, HAMMA shart ham bo'lishi kerak.",
    'Деление выполнено. В ответе должна быть и сама запись, и ВСЕ условия.',
    'The division is done. The answer needs the record itself and ALL the conditions.'),
  expr: [{ n: 'h', d: 'h + 1' }, ':', { n: 'h − 4', d: 'h + 7' }], exprSize: 21,
  ask: L("To'liq va to'g'ri javob qaysi?", 'Какой ответ полный и верный?', 'Which answer is complete and correct?'),
  opts: [
    { label: [R, ',', 'h ≠ −1,', 'h ≠ −7,', 'h ≠ 4'] },
    { label: [R, ',', 'h ≠ −1,', 'h ≠ 4'] },
    { label: [R, ',', 'h ≠ −1,', 'h ≠ −7'] },
    { label: [{ n: 'h(h − 4)', d: '(h + 1)(h + 7)' }, ',', 'h ≠ −1,', 'h ≠ −7'] },
  ],
  correctText: L(
    "To'g'ri. Uchta shart uch joydan keladi. Minus bir — birinchi kasrning maxrajidan. Minus yetti — bo'luvchining maxrajidan; ag'dargandan keyin u tepaga chiqadi va javobda ko'rinmay qoladi, lekin taqiq qolaveradi. To'rt esa bo'luvchining SURATIDAN: unda bo'luvchi nolga aylanadi, nolga bo'lib esa bo'lmaydi.",
    'Верно. Три условия приходят из трёх мест. Минус один — из знаменателя первой дроби. Минус семь — из знаменателя делителя; после переворота он уходит наверх и в ответе не виден, но запрет остаётся. А четыре — из ЧИСЛИТЕЛЯ делителя: при нём делитель обращается в нуль, а на нуль делить нельзя.',
    "Correct. Three conditions come from three places. Minus one from the first fraction's denominator. Minus seven from the divisor's denominator; after flipping it moves up and is invisible in the answer, but the ban stays. And four from the divisor's NUMERATOR: there the divisor becomes zero, and you cannot divide by zero."),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Minus yetti tushib qoldi. Bo'luvchining maxraji h qo'shuv yetti edi — dastlabki yozuvda u pastda turgan, ya'ni minus yettida bo'luvchining O'ZI mavjud emas. Ag'darish taqiqni olib tashlamaydi, faqat uni ko'rinmas qiladi.",
      'Потерялось минус семь. Знаменателем делителя было h плюс семь — в исходной записи он стоял внизу, то есть при минус семи самого делителя не существует. Переворот не снимает запрет, он лишь делает его невидимым.',
      "Minus seven was dropped. The divisor's denominator was h plus seven — in the original record it stood below, so at minus seven the divisor itself does not exist. Flipping does not lift the ban, it only hides it.") },
    { when: (s) => s.picked === 2, text: L(
      "To'rt tushib qoldi — bu darsning uchinchi sharti. To'rtda bo'luvchining SURATI nolga aylanadi, ya'ni nolga bo'lish chiqadi. Bo'luvchining surati ham nol bo'lmasligi kerak.",
      'Потерялась четвёрка — это третье условие урока. При четырёх ЧИСЛИТЕЛЬ делителя обращается в нуль, то есть выходит деление на нуль. Числитель делителя тоже не должен быть нулём.',
      "Four was dropped — that is the lesson's third condition. At four the divisor's NUMERATOR becomes zero, so you get division by zero. The divisor's numerator must not be zero either.") },
    { when: (s) => s.picked === 3, text: L(
      "Kasr ag'darilmagan: bo'lishda ikkinchi kasrning surati va maxraji joy almashadi. H ni nolga teng qo'ying: dastlabki ifoda nol beradi, bu variant ham nol — lekin h ni ikkiga teng qo'ying va ular ajraladi.",
      'Дробь не перевёрнута: при делении числитель и знаменатель второй дроби меняются местами. Подставь h равное нулю: исходное даёт нуль, и этот вариант тоже — но подставь h равное двум, и они разойдутся.',
      "The fraction was not flipped: in division the second fraction's numerator and denominator swap. Put h equal to zero: the original gives zero and so does this option — but put h equal to two and they diverge.") },
  ],
  wrongText: L(
    "Uchta joyni tekshiring: birinchi kasrning maxraji, bo'luvchining maxraji va bo'luvchining SURATI. Uchalasi ham nolga aylanmasligi kerak.",
    'Проверь три места: знаменатель первой дроби, знаменатель делителя и ЧИСЛИТЕЛЬ делителя. Ни одно из них не должно обращаться в нуль.',
    "Check three places: the first fraction's denominator, the divisor's denominator, and the divisor's NUMERATOR. None of them may be zero."),
};

export default function D05_05(props) { return <Choice data={DATA} {...props} />; }
