// Dars14 · Amaliyot 03 — Ha yoki yo'q · 🟢 · tag: record_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §5 (14-dars, 3-pozitsiya)
//
// Ikki mulohaza — darsning ikki qimmat joyi:
//   s1  З35: bir yettidan ning yozuvi cheksiz, lekin son RATSIONAL. Javob «Ha».
//       Cheksizlikning o'zi hech narsani hal qilmaydi, davr borligi hal qiladi;
//   s2  IKKI IRRATSIONAL SONNING KO'PAYTMASI RATSIONAL bo'lishi mumkin:
//       ikkidan ildiz karra ikkidan ildiz ikkiga teng, ikki esa ratsional.
//       Javob «Ha». «Irratsional karra irratsional har doim irratsional»
//       degan tez xulosa shu yerda yiqiladi.
// IKKALA JAVOB HAM «HA» (metodist qarori 2026-08-25: ha-yo'q topshiriqlarida
// javob naqshi bo'lmasin — DARS07_11_AMALIYOT_SKELET.md §10 p. 9).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'record_claims', level: '🟢',
  itemSize: 16,
  items: [
    { id: 's1', yes: true,
      tokens: [{ n: '1', d: '7' }],
      claim: L("yozuvi cheksiz, lekin son ratsional", 'запись бесконечна, но число рационально', 'the record is endless, yet the number is rational') },
    { id: 's2', yes: true,
      tokens: [{ r: '2' }, '·', { r: '2' }, '=', '2'],
      claim: L("to'g'ri, demak ko'paytma ratsional", 'верно, значит произведение рационально', 'true, so the product is rational') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki mulohaza. Birinchisi kasrning onli yozuvi haqida, ikkinchisi ildizli hadlarning yig'indisi haqida.",
    'Два утверждения. Первое о десятичной записи дроби, второе о сумме слагаемых с корнями.',
    'Two claims. The first is about the decimal record of a fraction, the second about a sum of root terms.'),
  ask: L(
    "Har mulohazani tekshiring: rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Проверь каждое утверждение: верно — «Да», ложно — «Нет».',
    'Check each claim: true means «Yes», false means «No».'),
  correctText: L(
    "To'g'ri. Bir yettidan ni bo'lsangiz nol butun bir to'rt ikki sakkiz besh yetti chiqadi va bu bo'lak takrorlanib ketadi — yozuv cheksiz, lekin son kasr ko'rinishida turgani uchun ratsional. Ikkinchisi ham rost, lekin boshqa sababdan: ildizning ta'rifi bo'yicha ildizning kvadrati ildiz ostidagi songa teng, ya'ni ikkidan ildiz karra ikkidan ildiz aniq ikki. Ikki esa ratsional son. Demak ikki irratsional son ko'paytirilganda natija ratsional bo'lib qolishi mumkin — qo'shishda esa bunday bo'lmaydi: ikkidan ildiz qo'shuv ikkidan ildiz ikki karra ikkidan ildiz, u irratsional qoladi.",
    'Верно. Раздели один на семь — выйдет нуль целых сто сорок две тысячи восемьсот пятьдесят семь и эта часть будет повторяться: запись бесконечна, но число записано дробью, значит рационально. Второе тоже верно, но по другой причине: по определению корня квадрат корня равен подкоренному, то есть корень из двух на корень из двух ровно два. А два число рациональное. Значит произведение двух иррациональных чисел может оказаться рациональным — а при сложении так не выйдет: корень из двух плюс корень из двух это два корня из двух, и оно остаётся иррациональным.',
    'Correct. Divide one by seven and you get zero point one four two eight five seven with that block repeating: the record is endless, yet the number is written as a fraction, so it is rational. The second is true as well, but for a different reason: by the definition of a root, the square of a root equals the radicand, so the root of two times the root of two is exactly two. And two is rational. So a product of two irrational numbers can turn out rational — which does not happen with addition: the root of two plus the root of two is two roots of two and stays irrational.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi mulohaza rost. Ildizning ta'rifi shuni beradi: ildizning kvadrati ildiz ostidagi songa teng, ya'ni ikkidan ildiz karra ikkidan ildiz aniq ikki — hisoblash ham kerak emas. Son bilan ko'ring: bir butun qirq bir karra bir butun qirq bir taxminan ikki. Ikki ratsional, demak ikki irratsional sonning ko'paytmasi ratsional bo'lib chiqdi.",
      'Второе утверждение верно. Это даёт само определение корня: квадрат корня равен подкоренному, то есть корень из двух на корень из двух ровно два — и считать не нужно. Проверь числом: один и сорок один на один и сорок один примерно два. Два рационально, значит произведение двух иррациональных чисел оказалось рациональным.',
      'The second claim is true. The definition of a root gives it: the square of a root equals the radicand, so the root of two times the root of two is exactly two — no computing needed. Check with numbers: one point four one times one point four one is about two. Two is rational, so the product of two irrational numbers turned out rational.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi mulohaza rost. Bir yettidan ning onli yozuvi haqiqatan tugamaydi, lekin ratsionallik yozuvning uzunligi bilan o'lchanmaydi: son KASR ko'rinishida yozilgan bo'lsa, u ratsional. Bundan tashqari yozuvda takrorlanuvchi bo'lak bor — bir to'rt ikki sakkiz besh yetti aylanib turadi.",
      'Первое утверждение верно. Десятичная запись одной седьмой действительно не заканчивается, но рациональность длиной записи не измеряется: если число записано ДРОБЬЮ, оно рационально. К тому же в записи есть повторяющаяся часть — сто сорок две тысячи восемьсот пятьдесят семь идёт по кругу.',
      'The first claim is true. The decimal record of one seventh really does not end, but rationality is not measured by the length of the record: if a number is written as a FRACTION it is rational. Besides, the record has a repeating block — one four two eight five seven goes round and round.') },
  ],
  wrongText: L(
    "Ratsionallikni yozuvning uzunligi emas, KASR ko'rinishi hal qiladi. Ikkinchi mulohazada esa ikki tomonni sonlar bilan hisoblab solishtiring.",
    'Рациональность решает не длина записи, а ДРОБНЫЙ вид. А во втором утверждении посчитай обе части числами и сравни.',
    'Rationality is decided not by the length of the record but by the FRACTION form. In the second claim compute both sides with numbers and compare.'),
};

export default function D14_03(props) { return <TrueFalse data={DATA} {...props} />; }
