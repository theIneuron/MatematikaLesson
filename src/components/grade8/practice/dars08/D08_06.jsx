// Dars08 · Amaliyot 06 — Moslashtirish · 🟡 · tag: power_to_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §6 (8-dars, 6-pozitsiya)
//
// To'rt daraja, to'rt qiymat. Asoslar ataylab bir-biriga o'xshamaydi va
// katta asos katta qiymat bermaydi: sakkiz ikkini beradi, sakson bir esa
// to'qqizni ham, uchni ham — ko'rsatkichga qarab. Ya'ni javobni asosning
// kattaligi bo'yicha taxmin qilib bo'lmaydi.
// O'ng ustun har ochilganda aralashtiriladi (MatchPairs ichida).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const H = (d) => ({ n: '1', d });

const DATA = {
  tag: 'power_to_value', level: '🟡',
  connect: true,
  itemSize: 19, targetSize: 19,
  items: [
    { id: 'm1', tokens: [{ b: '8', e: H('3') }] },
    { id: 'm2', tokens: [{ b: '81', e: H('4') }] },
    { id: 'm3', tokens: [{ b: '256', e: H('4') }] },
    { id: 'm4', tokens: [{ b: '81', e: H('2') }] },
  ],
  targets: [
    { id: 't1', tokens: ['2'] },
    { id: 't2', tokens: ['3'] },
    { id: 't3', tokens: ['4'] },
    { id: 't4', tokens: ['9'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Moslashtirish', 'Соответствие', 'Match'),
  setup: L(
    "To'rt darajaning ko'rsatkichi kasr. Ikki yozuvda asos bir xil, ko'rsatkich esa boshqa — demak qiymatlari ham boshqa.",
    'У четырёх степеней показатель дробный. В двух записях основание одно и то же, а показатели разные — значит и значения разные.',
    'The four powers have fractional exponents. Two records share the same base but differ in exponent, so their values differ too.'),
  ask: L(
    "Chapdan darajani bosing, keyin o'ngdan uning qiymatini bosing.",
    'Нажми степень слева, потом её значение справа.',
    'Tap a power on the left, then its value on the right.'),
  correctText: L(
    "To'g'ri. Har birida teskari amal bilan tekshirish mumkin: ikki karra ikki karra ikki sakkiz; uchning to'rtinchi darajasi sakson bir; to'rtning to'rtinchi darajasi ikki yuz ellik olti; to'qqiz karra to'qqiz sakson bir. Sakson bir ikki marta uchraydi, lekin ko'rsatkichi boshqa: to'rtdan bir uchni beradi, ikkidan bir esa to'qqizni.",
    'Верно. Каждое проверяется обратным действием: два на два на два восемь; три в четвёртой степени восемьдесят один; четыре в четвёртой двести пятьдесят шесть; девять на девять восемьдесят один. Восемьдесят один встречается дважды, но показатели разные: одна четвёртая даёт три, а одна вторая девять.',
    'Correct. Each is checked by the reverse action: two times two times two is eight; three to the fourth is eighty one; four to the fourth is two hundred fifty six; nine times nine is eighty one. Eighty one appears twice, but with different exponents: one quarter gives three, one half gives nine.'),
  wrongs: [
    { when: (s) => s.pair.m2 === 't4' || s.pair.m4 === 't2', text: L(
      "Bu ikki yozuvda asos bir xil, ko'rsatkich esa boshqa. Maxraji to'rt bo'lgani to'rtinchi darajali ildizni so'raydi: uchni to'rt marta ko'paytiring — sakson bir chiqadi. Maxraji ikki bo'lgani kvadrat ildizni so'raydi: to'qqiz karra to'qqiz sakson bir.",
      'В этих двух записях основание одно, а показатели разные. Тот, у которого знаменатель четыре, просит корень четвёртой степени: умножь три четыре раза — выйдет восемьдесят один. Тот, у которого два, просит квадратный корень: девять на девять восемьдесят один.',
      'These two records share a base but differ in exponent. The one with denominator four asks for the fourth root: multiply three four times and eighty one comes out. The one with two asks for the square root: nine times nine is eighty one.') },
    { when: (s) => s.pair.m1 === 't3' || s.pair.m3 === 't1', text: L(
      "Ildizning darajasini solishtiring. Sakkizda maxraj uch: ikki karra ikki karra ikki sakkiz. Ikki yuz ellik oltida maxraj to'rt: to'rtni to'rt marta ko'paytiring — ikki yuz ellik olti chiqadi.",
      'Сравни степени корней. У восьми знаменатель три: два на два на два восемь. У двухсот пятидесяти шести знаменатель четыре: умножь четыре четыре раза — выйдет двести пятьдесят шесть.',
      'Compare the degrees of the roots. Eight has denominator three: two times two times two is eight. Two hundred fifty six has denominator four: multiply four four times and two hundred fifty six comes out.') },
    { when: (s) => s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Asos katta bo'lgani qiymati ham katta degani emas. Ikki yuz ellik oltidan TO'RTINCHI darajali ildiz olinadi, sakson birdan esa kvadrat ildiz. Ikkalasini teskari amal bilan tekshiring.",
      'Большее основание не значит большее значение. Из двухсот пятидесяти шести берётся корень ЧЕТВЁРТОЙ степени, а из восьмидесяти одного квадратный. Проверь оба обратным действием.',
      'A bigger base does not mean a bigger value. Two hundred fifty six takes a FOURTH root, eighty one a square root. Check both with the reverse action.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har yozuvda bitta ish qiling: ko'rsatkichning maxrajiga qarang va javobni shuncha marta ko'paytirib asosni tekshiring.",
      'С каждой записью делай одно: посмотри на знаменатель показателя и проверь основание, умножив ответ столько раз.',
      'Do one thing with every record: look at the denominator of the exponent and check the base by multiplying the answer that many times.') },
  ],
  wrongText: L(
    "Ko'rsatkichning maxraji ildizning darajasini aytadi. Javobni shuncha marta ko'paytirsangiz asos chiqishi kerak.",
    'Знаменатель показателя называет степень корня. Ответ, умноженный столько раз, должен дать основание.',
    'The denominator of the exponent names the degree of the root. The answer multiplied that many times must give the base.'),
};

export default function D08_06(props) { return <MatchPairs data={DATA} {...props} />; }
