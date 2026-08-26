// Dars39 · Amaliyot 01 — Ta'rif · 🟢 · tag: which_definition
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §11 (39-dars, 1-pozitsiya)
//
// TA'RIF IKKI SHARTDAN IBORAT, VA IKKINCHISI DOIM TASHLAB KETILADI (З81):
//   bir juft tomon PARALLEL, ikkinchi juft esa PARALLEL EMAS.
// Ikkinchi shart trapetsiyani parallelogrammdan ajratadi, va usiz ta'rif
// parallelogrammni ham qamrab oladi.
//
// Uch xato variant: yarim ta'rif; parallelogrammning ta'rifi; teng yonli
// trapetsiyaning belgisi (ta'rif emas, tur).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_definition', level: '🟢',
  correct: 0, optCols: 1, optSize: 15,
  eyebrow: L("Ta'rif", 'Определение', 'Definition'),
  setup: L(
    "To'rtburchak berilgan. To'rt shartdan faqat bittasi trapetsiyaning ta'rifi: qolganlari boshqa figurani ham qamrab oladi yoki trapetsiyaning bir TURINI nomlaydi.",
    'Дан четырёхугольник. Из четырёх условий лишь одно — определение трапеции: остальные захватывают и другую фигуру или называют один ВИД трапеции.',
    'A quadrilateral is given. Of the four conditions only one is the definition of a trapezoid: the others catch another figure as well, or name one KIND of trapezoid.'),
  ask: L(
    "Qaysi shart trapetsiyaning ta'rifi?",
    'Какое условие является определением трапеции?',
    'Which condition is the definition of a trapezoid?'),
  opts: [
    { label: L("bir juft tomoni parallel, ikkinchi juft tomoni parallel emas", 'одна пара сторон параллельна, другая пара не параллельна', 'one pair of sides is parallel, the other pair is not') },
    { label: L("bir juft tomoni parallel", 'одна пара сторон параллельна', 'one pair of sides is parallel') },
    { label: L("ikki juft tomoni parallel", 'две пары сторон параллельны', 'two pairs of sides are parallel') },
    { label: L("yon tomonlari teng", 'боковые стороны равны', 'the legs are equal') },
  ],
  correctText: L(
    "To'g'ri. Ta'rif IKKI shartdan iborat: bir juft tomon parallel bo'lsin — bu asoslar; ikkinchi juft esa parallel BO'LMASIN — bu yon tomonlar. Ikkinchi shart bejiz emas: usiz ta'rif parallelogrammni ham qamrab olardi. Trapetsiyada yon tomonlar bir-biriga qarab qiyalangan, va shu sababli ular kesishishi mumkin.",
    'Верно. Определение состоит из ДВУХ условий: одна пара сторон параллельна — это основания; другая пара НЕ параллельна — это боковые. Второе условие не случайно: без него определение захватило бы и параллелограмм. У трапеции боковые стороны наклонены друг к другу и потому могут пересечься.',
    'Correct. The definition consists of TWO conditions and they work together: let one pair of sides be parallel — these are the bases; and let the other pair NOT be parallel — these are the legs. The second condition is no accident: without it the definition would catch the parallelogram too, since a parallelogram also has a parallel pair of sides. So the second condition is no decoration — it is what draws the boundary. There is an easy way to remember it: in a trapezoid the bases are parallel while the legs lean TOWARDS each other or apart, and so they may meet.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Bu ta'rifning YARMI, va aynan shu eng ko'p uchraydigan xato. Bir juft tomonning parallelligi parallelogrammda ham bajariladi: unda ikki juft parallel, ya'ni «bir juft parallel» degan shart ham to'g'ri bo'ladi. Demak bu shart trapetsiyani parallelogrammdan ajratmaydi. Ta'rif esa aynan ajratishi kerak, shuning uchun unga ikkinchi shart qo'shiladi: qolgan juft parallel BO'LMASIN.",
      'Это ПОЛОВИНА определения, и именно это самая частая ошибка. Параллельность одной пары сторон выполняется и в параллелограмме: у него параллельны две пары, значит условие «одна пара параллельна» тоже верно. Значит это условие не отделяет трапецию от параллелограмма. А определение обязано отделять, поэтому к нему добавлено второе условие: другая пара НЕ параллельна.',
      'This is HALF the definition, and it is the commonest error. One parallel pair of sides holds in a parallelogram too: it has two parallel pairs, so the condition «one pair is parallel» is true of it as well. Hence this condition does not separate the trapezoid from the parallelogram. A definition must separate, and that is why a second condition is added: the other pair is NOT parallel.') },
    { when: (s) => s.picked === 2, text: L(
      "Bu PARALLELOGRAMMNING ta'rifi, 37-darsdan. Ikki juft tomon parallel bo'lsa, figura trapetsiya bo'lolmaydi — u parallelogrammga aylanadi. Ikki figura bir-birini istisno qiladi: trapetsiyada ikkinchi juft parallel emas, parallelogrammda esa parallel. Shu sababli parallelogramm trapetsiyaning alohida holi ham emas — bu ikki boshqa oila.",
      'Это определение ПАРАЛЛЕЛОГРАММА, из урока 37. Если параллельны две пары сторон, фигура трапецией быть не может — она становится параллелограммом. Две фигуры друг друга исключают: у трапеции вторая пара не параллельна, а у параллелограмма параллельна. Поэтому параллелограмм не является и частным случаем трапеции — это два разных семейства.',
      'This is the definition of the PARALLELOGRAM, from lesson 37. If two pairs of sides are parallel, the figure cannot be a trapezoid — it becomes a parallelogram. The two figures exclude each other: in a trapezoid the second pair is not parallel, in a parallelogram it is. So a parallelogram is not even a special case of the trapezoid — these are two different families.') },
    { when: (s) => s.picked === 3, text: L(
      "Yon tomonlarning tengligi — bu TENG YONLI trapetsiyaning belgisi, ya'ni bitta turning nomi, umumiy ta'rif emas. Ko'pchilik trapetsiyalarning yon tomonlari teng emas: bittasi qisqa, ikkinchisi uzun bo'lishi mumkin, va figura baribir trapetsiya bo'lib qolaveradi. Ta'rif oilaning HAMMASINI qamrashi kerak, bitta turini emas.",
      'Равенство боковых сторон — признак РАВНОБЕДРЕННОЙ трапеции, то есть название одного вида, а не общее определение. У большинства трапеций боковые стороны не равны: одна может быть короткой, другая длинной, и фигура всё равно остаётся трапецией. Определение должно охватывать ВСЁ семейство, а не один его вид.',
      'Equal legs is the mark of an ISOSCELES trapezoid, the name of one kind, not the general definition. Most trapezoids have unequal legs: one may be short and the other long, and the figure remains a trapezoid all the same. A definition must cover the WHOLE family, not one kind of it.') },
  ],
  wrongText: L(
    "Ta'rif ikki shartdan iborat: bir juft parallel VA ikkinchi juft parallel emas. Ikkinchisini tashlab ketsangiz, parallelogramm ham ta'rifga tushadi.",
    'Определение состоит из двух условий: одна пара параллельна И другая не параллельна. Если отбросить второе, под определение попадёт и параллелограмм.',
    'The definition has two conditions: one pair parallel AND the other pair not parallel. Drop the second and the parallelogram falls under the definition too.'),
};

export default function D39_01(props) { return <Choice data={DATA} {...props} />; }
