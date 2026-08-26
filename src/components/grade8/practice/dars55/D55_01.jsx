// Dars55 · Amaliyot 01 — Ha yoki yo'q · 🟢 · tag: coord_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §7 (55-dars, 1-pozitsiya)
//
// JAVOB: HA, HA (skelet §0a.1). Ikkinchisi qimmat: javob SON, va aynan
// shu uni xato qilib ko'rsatadi (З117). O'quvchi butun yil davomida
// vektor amali vektor beradi deb o'rgandi.
//   |a| uchun: 3² + 4² = 25, ildizi 5
//   a·b uchun: 2·4 + 3·1 = 11
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'coord_claims', level: '🟢',
  itemSize: 15,
  items: [
    { id: 's1', yes: true, tokens: ['a(3; 4),  |a| = 5'],
      claim: L('bu yozuv rost', 'эта запись верна', 'this record is true') },
    { id: 's2', yes: true, tokens: ['a(2; 3) · b(4; 1) = 11'],
      claim: L('bu yozuv rost', 'эта запись верна', 'this record is true') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki yozuv. Birinchisida vektorning moduli, ya'ni uzunligi hisoblangan. Ikkinchisida ikki vektorning skalyar ko'paytmasi.",
    'Две записи. В первой посчитан модуль вектора, то есть его длина. Во второй скалярное произведение двух векторов.',
    'Two records. In the first the modulus of a vector, that is, its length, is computed. In the second the dot product of two vectors.'),
  ask: L(
    "Yozuv rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Если запись верна — «Да», если ложна — «Нет».',
    'If the record is true, «Yes»; if false, «No».'),
  correctText: L(
    "To'g'ri, ikkalasi ham rost. Birinchisida uch kvadrat to'qqiz, to'rt kvadrat o'n olti, yig'indisi yigirma besh, uning ildizi besh. Ikkinchisida ikki karra to'rt sakkiz, uch karra bir uch, yig'indisi o'n bir. Ikkinchi javob g'alati ko'rinishi mumkin, chunki u SON, vektor emas. Lekin skalyar ko'paytma aynan shunday: ikki vektordan bitta son chiqadi, va u aynan shuning uchun SKALYAR deb ataladi.",
    'Верно, обе записи истинны. В первой три в квадрате девять, четыре в квадрате шестнадцать, вместе двадцать пять, корень из двадцати пяти пять. Во второй два на четыре восемь, три на один три, вместе одиннадцать. Второй ответ может показаться странным, ведь это ЧИСЛО, а не вектор. Но скалярное произведение именно таково: из двух векторов выходит одно число, и потому оно и называется СКАЛЯРНЫМ.',
    'Correct, both are true. In the first, three squared is nine, four squared is sixteen, together twenty-five, and the root of twenty-five is five. In the second, two times four is eight, three times one is three, together eleven. The second answer may look odd, since it is a NUMBER, not a vector. But that is exactly what a dot product is: two vectors give one number, and that is precisely why it is called SCALAR.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi yozuv ROST, garchi javob son bo'lsa ham. Skalyar ko'paytmada mos koordinatalar ko'paytiriladi va natijalar QO'SHILADI: ikki karra to'rt sakkiz, uch karra bir uch, sakkiz qo'shuv uch o'n bir. Qo'shilgandan keyin ikki son emas, bitta son qoladi — vektor emas. Bu darsning eng ko'p uchraydigan chalkashligi.",
      'Вторая запись ВЕРНА, хотя ответ и число. В скалярном произведении соответствующие координаты перемножаются, а результаты СКЛАДЫВАЮТСЯ: два на четыре восемь, три на один три, восемь плюс три одиннадцать. После сложения остаётся одно число, а не два — не вектор. Это самая частая путаница урока.',
      'The second record is TRUE, even though the answer is a number. In a dot product the matching coordinates are multiplied and the results are ADDED: two times four is eight, three times one is three, eight plus three is eleven. After the addition one number remains, not two — not a vector. This is the most common confusion of the lesson.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi yozuv ROST. Modul Pifagor teoremasidan chiqadi: koordinatalar katetlar, modul esa gipotenuza. Uch va to'rt katetlarda gipotenuza besh — bu tanish uchlik, va u 44-darsdan beri ishlatilyapti.",
      'Первая запись ВЕРНА. Модуль выходит из теоремы Пифагора: координаты это катеты, а модуль гипотенуза. При катетах три и четыре гипотенуза пять — это знакомая тройка, она используется с сорок четвёртого урока.',
      'The first record is TRUE. The modulus comes from the Pythagorean theorem: the coordinates are the legs and the modulus is the hypotenuse. With legs three and four the hypotenuse is five — the familiar triple, in use since lesson forty-four.') },
  ],
  wrongText: L(
    "Modul Pifagordan chiqadi, skalyar ko'paytma esa SON: ko'paytmalar qo'shiladi.",
    'Модуль выходит из Пифагора, а скалярное произведение это ЧИСЛО: произведения складываются.',
    'The modulus comes from Pythagoras, and a dot product is a NUMBER: the products are added.'),
};

export default function D55_01(props) { return <TrueFalse data={DATA} {...props} />; }
