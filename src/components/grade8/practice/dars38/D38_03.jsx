// Dars38 · Amaliyot 03 — Tomon · 🟢 · tag: rhombus_side
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §10 (38-dars, 3-pozitsiya)
//
// ROMBNING TA'RIFI HISOBGA AYLANADI: to'rt tomon TENG, ya'ni perimetr
// to'rtga bo'linadi. 37-darsning 06-topshirig'i bilan solishtiring — u
// yerda parallelogramm edi va perimetr IKKIGA bo'linardi, chunki teng
// tomonlar juft-juft edi. Farqni figuraning turi beradi.
//
// Asosiy xato — o'n to'rt, ya'ni perimetrni ikkiga bo'lish: parallelogramm
// qoidasini rombga ko'chirish.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'rhombus_side', level: '🟢',
  target: 7, allowNeg: false,
  given: [['P = 28']],
  givenLabel: L('Rombning perimetri', 'Периметр ромба', 'The perimeter of the rhombus'),
  eyebrow: L('Tomon', 'Сторона', 'Side'),
  setup: L(
    "Rombning perimetri yigirma sakkiz santimetr. Uning tomonini topish kerak. Rombning ta'rifini eslang: uning to'rt tomoni ham teng.",
    'Периметр ромба двадцать восемь сантиметров. Надо найти его сторону. Вспомни определение ромба: все четыре его стороны равны.',
    'The perimeter of a rhombus is twenty-eight centimetres. Its side must be found. Recall the definition of a rhombus: all four of its sides are equal.'),
  label: L('Tomon, sm', 'Сторона, см', 'The side, cm'),
  ask: L('Rombning tomoni nechaga teng?', 'Чему равна сторона ромба?', 'What is the side of the rhombus?'),
  correctText: L(
    "To'g'ri. Rombning to'rt tomoni ham teng, ya'ni perimetr bitta tomonning to'rt barobari: yigirma sakkizni to'rtga bo'lsak yetti chiqadi. Tekshiring: yetti karra to'rt yigirma sakkiz. Bu yerda parallelogrammdan farq bor va u muhim: parallelogrammda tomonlar JUFT-JUFT teng, ya'ni perimetrni ikkiga bo'lish kerak edi va natijada ikki QO'SHNI tomonning yig'indisi chiqardi. Rombda esa hamma tomon teng, shuning uchun bo'luvchi ham boshqa. Figuraning turi hisobning o'zini o'zgartiradi.",
    'Верно. У ромба все четыре стороны равны, значит периметр — учетверённая сторона: двадцать восемь разделить на четыре даёт семь. Проверь: семью четыре двадцать восемь. Здесь есть отличие от параллелограмма, и оно важно: в параллелограмме стороны равны ПОПАРНО, поэтому периметр надо было делить на два и получалась сумма двух СОСЕДНИХ сторон. А в ромбе равны все стороны, поэтому и делитель другой. Тип фигуры меняет само вычисление.',
    'Correct. All four sides of a rhombus are equal, so the perimeter is four times one side: twenty-eight divided by four is seven. Check: seven times four is twenty-eight. There is a difference from the parallelogram here and it matters: in a parallelogram the sides are equal IN PAIRS, so the perimeter had to be divided by two and the result was the sum of two ADJACENT sides. In a rhombus all sides are equal, so the divisor differs. The kind of figure changes the computation itself.'),
  wrongs: [
    { when: (s) => s.value === 14, text: L(
      "Perimetr IKKIGA bo'lindi, va bu parallelogrammning qoidasi: u yerda tomonlar juft-juft teng, ya'ni yarmi ikki qo'shni tomonning yig'indisini beradi. Rombda esa TO'RT tomon ham teng, shuning uchun to'rtga bo'lish kerak. Tekshiring: o'n to'rtli tomon bilan perimetr ellik olti bo'lardi, yigirma sakkiz emas.",
      'Периметр разделили на ДВА, а это правило параллелограмма: там стороны равны попарно, и половина даёт сумму двух соседних сторон. В ромбе же равны ВСЕ ЧЕТЫРЕ стороны, поэтому делить надо на четыре. Проверь: при стороне четырнадцать периметр был бы пятьдесят шесть, а не двадцать восемь.',
      'The perimeter was divided by TWO, which is the parallelogram rule: there the sides are equal in pairs and half gives the sum of two adjacent sides. In a rhombus all FOUR sides are equal, so it must be divided by four. Check: with a side of fourteen the perimeter would be fifty-six, not twenty-eight.') },
    { when: (s) => s.value === 28, text: L(
      "Yigirma sakkiz — bu PERIMETR, ya'ni to'rt tomonning yig'indisi, bitta tomon emas. Bitta tomonni topish uchun uni to'rtga bo'lish kerak: yetti. Tekshirishning eng oson yo'li — javobni to'rtga ko'paytirish va perimetr chiqishini ko'rish.",
      'Двадцать восемь — это ПЕРИМЕТР, то есть сумма четырёх сторон, а не одна сторона. Чтобы найти сторону, надо разделить его на четыре: семь. Самый простой способ проверки — умножить ответ на четыре и увидеть периметр.',
      'Twenty-eight is the PERIMETER, the sum of the four sides, not one side. To find the side, divide it by four: seven. The easiest check is to multiply the answer by four and see the perimeter.') },
    { when: (s) => s.value === 4 || s.value === 6 || s.value === 8, text: L(
      "Bo'lishda xato bor. Yigirma sakkizni to'rtga bo'ling: to'rt karra yetti yigirma sakkiz, demak javob yetti. Javobni har doim teskari amal bilan tekshiring — tomonni to'rtga ko'paytirsangiz perimetr chiqishi kerak.",
      'В делении ошибка. Раздели двадцать восемь на четыре: четырежды семь двадцать восемь, значит ответ семь. Всегда проверяй ответ обратным действием — сторона, умноженная на четыре, должна дать периметр.',
      'There is a slip in the division. Divide twenty-eight by four: four times seven is twenty-eight, so the answer is seven. Always check with the inverse operation — the side times four must give the perimeter.') },
  ],
  wrongText: L(
    "Rombning to'rt tomoni ham teng, ya'ni perimetrni to'rtga bo'ling. Parallelogrammda bo'luvchi ikki edi — farqni figura beradi.",
    'У ромба все четыре стороны равны, значит дели периметр на четыре. У параллелограмма делитель был два — разницу задаёт фигура.',
    'All four sides of a rhombus are equal, so divide the perimeter by four. For a parallelogram the divisor was two — the figure decides.'),
};

export default function D38_03(props) { return <TypeValue data={DATA} {...props} />; }
