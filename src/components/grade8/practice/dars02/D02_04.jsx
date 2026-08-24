// Dars02 · Amaliyot 04 — Yangi taqiq · 🟡 · tag: new_ban_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Kontent: src/books/grade8/DARS02_AMALIYOT_KONTENT_V2.md §04
//
// Ilgari bu o'rinda `HoleSlider` turgan («teshikni surgich bilan toping»).
// Metodist qarori 2026-08-24: o'nta mexanika 1-darsdan olinadi, shuning uchun
// o'sha son endi KLAVIATURADAN yoziladi — savol o'zgarmadi, dalil kuchaydi.
//
// Kasr 3/(k + 1) dan yasalgan: ikkala qavat k minus to'rtga ko'paytirilgan.
// Taqiqlar ikkita, lekin savol faqat YANGISINI so'raydi:
//   k = −1  ESKI  (dastlabki maxrajdan, ko'paytirishdan oldin ham bor edi)
//   k = 4   YANGI (ko'paytuvchi olib keldi)  <- javob
// Shu farq darsning o'zagi: xossa qiymatni saqlaydi, lekin ruxsat etilgan
// qiymatlar to'plamini QISQARTIRADI (T3, З2).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'new_ban_value', level: '🟡',
  target: 4, allowNeg: true,
  expr: [{ n: '3(k − 4)', d: '(k + 1)(k − 4)' }], exprSize: 28,
  eyebrow: L('Yangi taqiq', 'Новый запрет', 'New ban'),
  setup: L(
    "Bu kasr 3/(k + 1) dan yasalgan: surat ham, maxraj ham k minus to'rtga ko'paytirilgan. Qiymat o'zgarmadi, taqiqlar esa o'zgardi.",
    'Эта дробь сделана из 3/(k + 1): и числитель, и знаменатель умножены на k минус четыре. Значение не изменилось, а запреты изменились.',
    'This fraction is made from 3/(k + 1): both numerator and denominator are multiplied by k minus four. The value did not change, but the bans did.'),
  label: L("yangi taqiqlangan qiymat", 'новое запрещённое значение', 'the new forbidden value'),
  ask: L(
    "Ko'paytirish qanday k da YANGI taqiq olib keldi?",
    'При каком k умножение принесло НОВЫЙ запрет?',
    'At which k did the multiplication bring a NEW ban?'),
  correctText: L(
    "To'g'ri. Ko'paytuvchi k minus to'rt to'rtda nolga aylanadi, va o'sha yerda yangi maxraj ham nolga aylanadi. Dastlabki kasrda to'rt taqiqlangan emas edi: uch bo'linadi beshga, ya'ni qiymat bor. Eski taqiq esa yo'qolmadi — minus bir joyida qoladi. Ko'paytirish taqiqni olib tashlamaydi, ustiga qo'shadi.",
    'Верно. Множитель k минус четыре обращается в нуль при четырёх, и там же обнуляется новый знаменатель. В исходной дроби четыре не было запрещено: три делить на пять — значение есть. Старый запрет при этом не исчез: минус один остаётся. Умножение запрет не снимает, оно его добавляет.',
    'Correct. The factor k minus four becomes zero at four, and there the new denominator vanishes too. In the original fraction four was not banned: three over five has a value. The old ban did not disappear either: minus one stays. Multiplying does not lift a ban, it adds one.'),
  wrongs: [
    { when: (s) => s.value === -1, text: L(
      "Bu ESKI taqiq: minus bir dastlabki kasrda ham bor edi. Savol ko'paytirish OLIB KELGAN qiymatni so'radi — ko'paytuvchining o'zini nolga tenglang.",
      'Это СТАРЫЙ запрет: минус один был и в исходной дроби. Спрошено значение, которое ПРИНЕСЛО умножение, — приравняй к нулю сам множитель.',
      'That is the OLD ban: minus one was there in the original fraction too. The question asks for the value the multiplication BROUGHT — set the factor itself to zero.') },
    { when: (s) => s.value === -4, text: L(
      "Ishorani tekshiring: k minus to'rt nolga ARTI to'rtda aylanadi. Minus to'rtda u minus sakkizga teng — nol emas.",
      'Проверь знак: k минус четыре обращается в нуль при ПЛЮС четырёх. При минус четырёх он равен минус восьми, а не нулю.',
      'Check the sign: k minus four becomes zero at PLUS four. At minus four it equals minus eight, not zero.') },
    { when: (s) => s.value === 3, text: L(
      "Uch — suratdagi son, ildiz emas. Uchni qo'ying: maxraj to'rt karra minus bir, ya'ni minus to'rt. Nol emas.",
      'Три — число из числителя, а не корень. Подставь три: знаменатель равен четырём на минус один, то есть минус четырём. Не нуль.',
      'Three is a number from the numerator, not a root. Substitute three: the denominator is four times minus one, that is minus four. Not zero.') },
    { when: (s) => s.value === 0, text: L(
      "Nolda maxraj bir karra minus to'rt, ya'ni minus to'rt. Kasr bemalol hisoblanadi, demak nol taqiq emas.",
      'При нуле знаменатель равен одному на минус четыре, то есть минус четырём. Дробь спокойно считается, значит нуль не запрет.',
      'At zero the denominator is one times minus four, that is minus four. The fraction computes fine, so zero is not a ban.') },
  ],
  wrongText: L(
    "Ko'paytuvchini toping, uni nolga tenglang va yeching. Dastlabki maxrajning taqig'i ham qoladi, lekin u yangi emas.",
    'Найди множитель, приравняй его к нулю и реши. Запрет исходного знаменателя тоже остаётся, но он не новый.',
    'Find the factor, set it to zero and solve. The original denominator keeps its ban too, but that one is not new.'),
};

export default function D02_04(props) { return <TypeValue data={DATA} {...props} />; }
