// Dars37 · Amaliyot 08 — Test · 🔴 · tag: which_definition
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §9 (37-dars, 8-pozitsiya)
//
// `Choice` NING VARIANTI SO'Z BO'LA OLADI: `label` massiv bo'lmasa, u
// `tr()` dan o'tadi (`kit.jsx`). Shu sababli ta'rifni tanlash topshirig'i
// aynan shu mexanikada — qolgan mexanikalarning kartalari tarjima
// qilinmaydi (skelet §0a.5).
//
// UCH XATO VARIANT — UCH FIGURA:
//   «ikki tomoni teng»       -> deltoid ham shunday (З75)
//   «diagonallari teng»      -> to'g'ri to'rtburchakning belgisi (З77)
//   «bir juft tomoni parallel» -> trapetsiya (39-dars)
// Razbor har biriga MISOL keltiradi, ya'ni rad etish ko'rinadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_definition', level: '🔴',
  correct: 0, optCols: 1, optSize: 15,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "To'rtburchak berilgan. To'rt shartdan faqat bittasi uni parallelogramm qilishga YETADI: qolganlari boshqa figuralarda ham bajariladi yoki parallelogrammning xossasi bo'lib, ta'rifi emas.",
    'Дан четырёхугольник. Из четырёх условий лишь одно ДОСТАТОЧНО, чтобы он был параллелограммом: остальные выполняются и в других фигурах или являются свойством параллелограмма, а не его определением.',
    'A quadrilateral is given. Of the four conditions only one is ENOUGH to make it a parallelogram: the others also hold in other figures, or are a property of the parallelogram rather than its definition.'),
  ask: L(
    "Qaysi shart to'rtburchakni parallelogramm qiladi?",
    'Какое условие делает четырёхугольник параллелограммом?',
    'Which condition makes the quadrilateral a parallelogram?'),
  opts: [
    { label: L("qarama-qarshi tomonlari juft-juft parallel", 'противоположные стороны попарно параллельны', 'the opposite sides are parallel in pairs') },
    { label: L("ikki tomoni teng", 'две стороны равны', 'two sides are equal') },
    { label: L("diagonallari teng", 'диагонали равны', 'the diagonals are equal') },
    { label: L("bir juft tomoni parallel", 'одна пара сторон параллельна', 'one pair of sides is parallel') },
  ],
  correctText: L(
    "To'g'ri. Ta'rif ikki shartni birga talab qiladi, va «juft-juft» so'zi aynan shuni bildiradi. Qolgan uchtasi boshqa figurani ham qamrab oladi: ikki tomonning tengligi deltoidda ham bor; diagonallarning tengligi faqat to'g'ri to'rtburchakda; bir juft parallellik esa trapetsiyani ham qabul qiladi.",
    'Верно. Определение требует двух условий сразу, и слово «попарно» означает именно это. Три остальных захватывают и другие фигуры: равенство двух сторон есть и у дельтоида; равенство диагоналей только у прямоугольника; параллельность одной пары принимает и трапецию.',
    'Correct. The definition demands two conditions at once, and the words «in pairs» mean exactly that. The other three catch other figures as well: equal sides occur in a kite; equal diagonals only in a rectangle; one parallel pair admits the trapezoid.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ikki tomonning tengligi yetarli emas, va misol keltirish oson: deltoid. Unda ikki juft qo'shni tomon teng, lekin hech bir juft parallel emas — u parallelogramm bo'lolmaydi. Ta'rif TENGLIKKA emas, PARALLELLIKKA tayanadi. Tomonlarning tengligi parallelogrammda bajariladi, lekin u ta'rifdan CHIQADIGAN xossa, va xossani ta'rif o'rniga qo'yib bo'lmaydi.",
      'Равенства двух сторон недостаточно, и пример привести легко: дельтоид. В нём равны две пары соседних сторон, но параллельных пар нет — параллелограммом он быть не может. Определение опирается не на РАВЕНСТВО, а на ПАРАЛЛЕЛЬНОСТЬ. Равенство сторон в параллелограмме выполняется, но это свойство, ВЫТЕКАЮЩЕЕ из определения, а свойство вместо определения ставить нельзя.',
      'Equality of two sides is not enough, and a counterexample is easy: the kite. It has two pairs of equal adjacent sides but no parallel pair — it cannot be a parallelogram. The definition rests not on EQUALITY but on PARALLELISM. Equality of sides does hold in a parallelogram, but it is a property that FOLLOWS from the definition, and a property cannot stand in for a definition.') },
    { when: (s) => s.picked === 2, text: L(
      "Diagonallarning tengligi parallelogrammning umumiy belgisi EMAS. Cho'zilgan qiya parallelogrammni chizing: uning bir diagonali uzun, ikkinchisi qisqa — figura parallelogramm bo'lib qolaveradi. Diagonallar teng bo'lgan parallelogramm to'g'ri to'rtburchak deyiladi, va bu 38-darsning mavzusi. Ya'ni bu shart parallelogrammlarning faqat bir qismini tanlaydi.",
      'Равенство диагоналей — НЕ общий признак параллелограмма. Начерти вытянутый косой параллелограмм: одна диагональ у него длинная, другая короткая — фигура остаётся параллелограммом. Параллелограмм с равными диагоналями называется прямоугольником, и это тема урока 38. То есть это условие выделяет лишь часть параллелограммов.',
      'Equal diagonals is NOT a general mark of the parallelogram. Draw a long slanted parallelogram: one diagonal is long and the other short — the figure remains a parallelogram. A parallelogram with equal diagonals is called a rectangle, the subject of lesson 38. So this condition picks out only some parallelograms.') },
    { when: (s) => s.picked === 3, text: L(
      "Bir juft tomonning parallelligi yetarli emas: bunday to'rtburchak TRAPETSIYA ham bo'lishi mumkin. Trapetsiyani chizing — uning yuqori va pastki tomoni parallel, yon tomonlari esa bir-biriga qarab qiyalangan. Ta'rif IKKI juftni talab qiladi, va aynan ikkinchi juft trapetsiyani rad etadi. Bu eng ko'p uchraydigan xato: shartning yarmi eslab qolinadi.",
      'Параллельности одной пары сторон недостаточно: такой четырёхугольник может оказаться ТРАПЕЦИЕЙ. Начерти трапецию — её верхняя и нижняя стороны параллельны, а боковые наклонены друг к другу. Определение требует ОБЕИХ пар, и именно вторая пара отвергает трапецию. Это самая частая ошибка: запоминается половина условия.',
      'One parallel pair of sides is not enough: such a quadrilateral may well be a TRAPEZOID. Draw a trapezoid — its top and bottom are parallel while the sides lean towards each other. The definition demands BOTH pairs, and it is the second pair that rejects the trapezoid. This is the commonest error: half the condition is remembered.') },
  ],
  wrongText: L(
    "Har shartga qarshi MISOL izlang: shart bajariladigan, lekin parallelogramm bo'lmagan figura topilsa, u shart ta'rif bo'lolmaydi.",
    'К каждому условию ищи КОНТРПРИМЕР: если нашлась фигура, где условие выполняется, а параллелограмма нет, это условие определением быть не может.',
    'Look for a COUNTEREXAMPLE to every condition: if a figure exists where the condition holds and there is no parallelogram, that condition cannot be the definition.'),
};

export default function D37_08(props) { return <Choice data={DATA} {...props} />; }
