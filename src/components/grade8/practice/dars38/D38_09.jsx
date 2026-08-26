// Dars38 · Amaliyot 09 — Xulosa · 🔴 · tag: which_conclusion
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §10 (38-dars, 9-pozitsiya)
//
// BITTA SHARTDAN BITTA XULOSA. Diagonallarning tengligi to'g'ri
// to'rtburchakni beradi — na kamroq, na ko'proq:
//   romb      — З80: xossalar aralashtirilgan
//   kvadrat   — З79: bitta shart ikki figurani birdan bermaydi
//   trapetsiya — shartda figura PARALLELOGRAMM deb aytilgan
// Uchinchi xato eng qo'poli: shart o'qilmagan.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_conclusion', level: '🔴',
  correct: 0, optCols: 2, optSize: 15,
  expr: ['AC = BD'], exprSize: 28,
  eyebrow: L('Xulosa', 'Вывод', 'Conclusion'),
  setup: L(
    "Parallelogrammning diagonallari teng ekani ma'lum. Boshqa hech narsa berilmagan: tomonlar haqida ham, burchaklar haqida ham gap yo'q.",
    'Известно, что диагонали параллелограмма равны. Больше ничего не дано: ни про стороны, ни про углы речи нет.',
    'It is known that the diagonals of a parallelogram are equal. Nothing else is given: neither about the sides nor about the angles.'),
  ask: L('Bu qanday figura?', 'Что это за фигура?', 'What figure is this?'),
  opts: [
    { label: L("to'g'ri to'rtburchak", 'прямоугольник', 'a rectangle') },
    { label: L('romb', 'ромб', 'a rhombus') },
    { label: L('kvadrat', 'квадрат', 'a square') },
    { label: L('trapetsiya', 'трапеция', 'a trapezoid') },
  ],
  correctText: L(
    "To'g'ri. Diagonallarning tengligi — bu aynan to'g'ri to'rtburchakning belgisi. Sababi: diagonallar parallelogrammni to'rt uchburchakka ajratadi, va diagonallar teng bo'lsa, ularning yarmlari ham teng bo'ladi; o'shanda asosdagi burchaklar tenglashadi va har burchak to'qson gradusga chiqadi. Xulosa aynan shu shartdan chiqadigan qadar bo'lishi kerak — na kamroq, na ko'proq. Kvadrat deyish ko'proq bo'lardi: kvadrat uchun yana bitta shart kerak — tomonlar teng bo'lsin yoki diagonallar perpendikulyar bo'lsin. Bu yerda esa ikkinchi shart yo'q, ya'ni figura cho'zilgan to'g'ri to'rtburchak bo'lishi ham mumkin.",
    'Верно. Равенство диагоналей — это признак именно прямоугольника. Причина: диагонали разбивают параллелограмм на четыре треугольника, и если диагонали равны, равны и их половины; тогда углы при основании уравниваются и каждый угол выходит по девяносто градусов. Вывод должен быть ровно таким, какой следует из условия, — не меньше и не больше. Сказать «квадрат» было бы больше: для квадрата нужно ещё одно условие — равные стороны или перпендикулярные диагонали. А здесь второго условия нет, значит фигура вполне может быть вытянутым прямоугольником.',
    'Correct. Equal diagonals is precisely the mark of a rectangle. The reason: the diagonals split the parallelogram into four triangles, and if the diagonals are equal so are their halves; then the base angles even out and each angle comes to ninety degrees. The conclusion must be exactly what the condition yields — no less and no more. Saying «a square» would be more: a square needs one further condition — equal sides or perpendicular diagonals. Here the second condition is absent, so the figure may well be a long rectangle.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Romb boshqa shartdan chiqadi: uning diagonallari PERPENDIKULYAR, teng emas. Ikki xossani almashtirmang. Chizib tekshiring: qiya rombning diagonallari har xil uzunlikda — bittasi uzun, ikkinchisi qisqa, — lekin ular to'g'ri burchak ostida kesishadi. Berilgan shart esa tenglik haqida, ya'ni u boshqa figurani ko'rsatadi.",
      'Ромб выходит из другого условия: у него диагонали ПЕРПЕНДИКУЛЯРНЫ, а не равны. Не меняй два свойства местами. Проверь чертежом: у косого ромба диагонали разной длины — одна длинная, другая короткая, — но пересекаются они под прямым углом. А данное условие о равенстве, значит оно указывает на другую фигуру.',
      'The rhombus follows from a different condition: its diagonals are PERPENDICULAR, not equal. Do not swap the two properties. Check by drawing: in a slanted rhombus the diagonals differ in length — one long, one short — yet they cross at a right angle. The given condition speaks of equality, so it points to another figure.') },
    { when: (s) => s.picked === 2, text: L(
      "Kvadrat uchun BITTA shart yetmaydi. Diagonallarning tengligi to'g'ri to'rtburchakni beradi, kvadrat bo'lishi uchun esa yana bittasi kerak: tomonlar teng bo'lsin yoki diagonallar perpendikulyar bo'lsin. Misol keltiring: uzunligi o'n, eni ikki bo'lgan to'g'ri to'rtburchakni chizing — uning diagonallari teng, lekin u kvadratdan juda uzoq. Xulosa shartdan ko'ra kuchliroq bo'lmasligi kerak.",
      'Для квадрата ОДНОГО условия мало. Равенство диагоналей даёт прямоугольник, а чтобы вышел квадрат, нужно ещё одно: равные стороны или перпендикулярные диагонали. Приведи пример: начерти прямоугольник длиной десять и шириной два — диагонали у него равны, а до квадрата очень далеко. Вывод не должен быть сильнее условия.',
      'ONE condition is not enough for a square. Equal diagonals give a rectangle; for a square one more is needed: equal sides or perpendicular diagonals. Give an example: draw a rectangle ten long and two wide — its diagonals are equal and it is very far from a square. A conclusion must not be stronger than its condition.') },
    { when: (s) => s.picked === 3, text: L(
      "Shartda figura PARALLELOGRAMM deb aytilgan, trapetsiya esa parallelogramm emas: unda faqat bir juft tomon parallel. Ya'ni trapetsiya bu savolga umuman kirmaydi. Shartni oxirigacha o'qish kerak: u figuraning oilasini ham, qo'shimcha xossasini ham beradi.",
      'В условии фигура названа ПАРАЛЛЕЛОГРАММОМ, а трапеция параллелограммом не является: у неё параллельна лишь одна пара сторон. То есть трапеция в этот вопрос вообще не входит. Условие надо дочитывать до конца: оно задаёт и семейство фигуры, и её дополнительное свойство.',
      'The condition calls the figure a PARALLELOGRAM, and a trapezoid is not one: only one pair of its sides is parallel. So the trapezoid does not enter this question at all. The condition must be read to the end: it gives both the family of the figure and its extra property.') },
  ],
  wrongText: L(
    "Xulosa shartdan chiqadigan qadar bo'lsin. Teng diagonallar to'g'ri to'rtburchakni beradi; kvadrat uchun yana bitta shart kerak.",
    'Вывод должен быть ровно по условию. Равные диагонали дают прямоугольник; для квадрата нужно ещё одно условие.',
    'Let the conclusion match the condition exactly. Equal diagonals give a rectangle; a square needs one more condition.'),
};

export default function D38_09(props) { return <Choice data={DATA} {...props} />; }
