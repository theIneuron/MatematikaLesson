// Dars14 · Amaliyot 03 — Ha yoki yo'q · 🟢 · tag: record_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §5 (14-dars, 3-pozitsiya)
//
// Ikki mulohaza — darsning ikki qimmat joyi:
//   s1  З35: bir yettidan ning yozuvi cheksiz, lekin son RATSIONAL. Javob «Ha».
//       Cheksizlikning o'zi hech narsani hal qilmaydi, davr borligi hal qiladi;
//   s2  З34, oldingi darsdan: ikkidan ildiz qo'shuv ikkidan ildiz to'rtdan
//       ildizga teng emas. Javob «Yo'q». Bu bir vaqtda ikki narsani tekshiradi —
//       ildiz ostilari qo'shilmasligini va irratsional son ratsionalga
//       aylanib qolmasligini.
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
    { id: 's2', yes: false,
      tokens: [{ r: '2' }, '+', { r: '2' }, '=', { r: '4' }],
      claim: L("to'g'ri, demak yig'indi ratsional", 'верно, значит сумма рациональна', 'true, so the sum is rational') },
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
    "To'g'ri. Bir yettidan ni bo'lsangiz nol butun bir to'rt ikki sakkiz besh yetti chiqadi va bu bo'lak takrorlanib ketadi — yozuv cheksiz, lekin son kasr ko'rinishida turgani uchun ratsional. Ikkinchisida esa ildiz ostilari qo'shilgan. Ikkidan ildiz qo'shuv ikkidan ildiz ikki karra ikkidan ildizni beradi, ya'ni taxminan ikki butun sakson uch. To'rtdan ildiz esa aniq ikki. Ikki butun sakson uch ikkiga teng emas, demak yig'indi ratsional ham bo'lmadi.",
    'Верно. Раздели один на семь — выйдет нуль целых сто сорок две тысячи восемьсот пятьдесят семь и эта часть будет повторяться: запись бесконечна, но число записано дробью, значит рационально. А во втором сложили подкоренные. Корень из двух плюс корень из двух дают два корня из двух, то есть примерно два и восемьдесят три. А корень из четырёх ровно два. Два и восемьдесят три не равно двум, значит и рациональной сумма не стала.',
    'Correct. Divide one by seven and you get zero point one four two eight five seven with that block repeating: the record is endless, yet the number is written as a fraction, so it is rational. In the second, the radicands were added. The root of two plus the root of two gives two roots of two, about two point eight three. The root of four is exactly two. Two point eight three is not two, so the sum did not become rational either.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi mulohazada ildiz ostilari qo'shildi. Ikki bir xil had qo'shilsa koeffitsiyent ikkilanadi, ildiz osti esa o'zgarmaydi: natija ikki karra ikkidan ildiz. Son bilan tekshiring: ikkidan ildiz bir butun qirq bir, ikkitasi ikki butun sakson ikki; to'rtdan ildiz esa ikki. Irratsional sonni ikkiga ko'paytirish uni ratsional qilmaydi.",
      'Во втором утверждении сложили подкоренные. При сложении двух одинаковых слагаемых удваивается коэффициент, а подкоренное не меняется: выходит два корня из двух. Проверь числом: корень из двух один и сорок один, два таких два и восемьдесят два; а корень из четырёх два. Умножение иррационального числа на два рациональным его не делает.',
      'In the second claim the radicands were added. When two identical terms add, the coefficient doubles and the radicand stays: the result is two roots of two. Check with numbers: the root of two is one point four one, twice that is two point eight two; the root of four is two. Doubling an irrational number does not make it rational.') },
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
