// Dars40 · Amaliyot 03 — Yuza · 🟢 · tag: area_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §12 (40-dars, 3-pozitsiya)
//
// T2 NING TO'G'RIDAN-TO'G'RI QO'LLANILISHI: asos va balandlik berilgan,
// ularni ko'paytirish kifoya. Uch xato uch xil formuladan chiqadi:
//   17 — qo'shildi (perimetr bilan chalkashtirish)
//   30 — yarimlandi (uchburchakning formulasi)
//   24 — faqat asos ikkilandi
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'area_value', level: '🟢',
  target: 60, allowNeg: false,
  given: [['a = 12'], ['h = 5']],
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  eyebrow: L('Yuza', 'Площадь', 'Area'),
  setup: L(
    "Parallelogrammning asosi o'n ikki santimetr, unga mos balandligi besh santimetr. Yuzani topish kerak.",
    'Основание параллелограмма двенадцать сантиметров, соответствующая высота пять сантиметров. Надо найти площадь.',
    'The base of a parallelogram is twelve centimetres and the matching height is five centimetres. Find the area.'),
  label: L('Yuza, kv. sm', 'Площадь, кв. см', 'The area, sq. cm'),
  ask: L('Yuza nechaga teng?', 'Чему равна площадь?', 'What is the area?'),
  correctText: L(
    "To'g'ri. Parallelogrammning yuzi asos bilan unga mos balandlikning KO'PAYTMASIGA teng: o'n ikki karra besh oltmish. Javob kvadrat santimetrda o'lchanadi, chunki ikki uzunlik ko'paytirilyapti. Nima uchun aynan ko'paytma ekanini ko'rish oson: parallelogrammning bir chetidan uchburchakni kesib olib ikkinchi chetiga qo'ysangiz, tomonlari o'n ikki va besh bo'lgan to'g'ri to'rtburchak chiqadi. Uning yuzi esa tomonlarning ko'paytmasi. Figura shakl o'zgartirdi, yuza esa o'zgarmadi.",
    'Верно. Площадь параллелограмма равна ПРОИЗВЕДЕНИЮ основания на соответствующую высоту: двенадцать на пять шестьдесят. Ответ измеряется в квадратных сантиметрах, ведь перемножаются две длины. Почему именно произведение, увидеть легко: отрежь с одного края параллелограмма треугольник и приставь к другому — получится прямоугольник со сторонами двенадцать и пять. А его площадь и есть произведение сторон. Фигура сменила форму, а площадь не изменилась.',
    'Correct. The area of a parallelogram equals the PRODUCT of the base and the matching height: twelve times five is sixty. The answer is in square centimetres, since two lengths are multiplied. Why a product is easy to see: cut a triangle off one end of the parallelogram and set it against the other — you get a rectangle with sides twelve and five. And its area is the product of its sides. The figure changed shape while the area did not.'),
  wrongs: [
    { when: (s) => s.value === 17, text: L(
      "Asos va balandlik QO'SHILDI. Qo'shish uzunlikni beradi — masalan perimetrni, — yuzani esa faqat ko'paytirish beradi. Buni katakli qog'ozda ko'rish oson: yuza — figura ichidagi kataklar SONI, va ularni sanash uchun qatorlar sonini har qatordagi kataklar soniga ko'paytirish kerak. O'n ikki karra besh oltmish katak.",
      'Основание и высоту СЛОЖИЛИ. Сложение даёт длину — например периметр, — а площадь даёт только умножение. На клетчатой бумаге это видно сразу: площадь — это КОЛИЧЕСТВО клеток внутри фигуры, и чтобы их сосчитать, надо число рядов умножить на число клеток в ряду. Двенадцать на пять шестьдесят клеток.',
      'The base and the height were ADDED. Adding gives a length — a perimeter, say — while only multiplying gives an area. On squared paper this is plain at once: the area is the NUMBER of squares inside the figure, and to count them you multiply the number of rows by the number of squares in a row. Twelve times five is sixty squares.') },
    { when: (s) => s.value === 30, text: L(
      "Javob IKKIGA bo'lindi, va bu UCHBURCHAKNING formulasi: uchburchakning yuzi asos karra balandlikning yarmiga teng. Parallelogramm esa ikkita bunday uchburchakdan iborat — diagonalni o'tkazsangiz ko'rinadi. Shuning uchun uning yuzi ikki barobar katta: o'n ikki karra besh, yarimlashsiz.",
      'Ответ разделили НА ДВА, а это формула ТРЕУГОЛЬНИКА: площадь треугольника равна половине произведения основания на высоту. Параллелограмм же состоит из двух таких треугольников — это видно, если провести диагональ. Поэтому его площадь вдвое больше: двенадцать на пять, без деления пополам.',
      'The answer was divided BY TWO, and that is the formula for a TRIANGLE: the area of a triangle is half the base times the height. A parallelogram consists of two such triangles — draw a diagonal and you see it. So its area is twice as large: twelve times five, with no halving.') },
    { when: (s) => s.value === 24 || s.value === 10, text: L(
      "Faqat bitta o'lcham ishlatildi va u ikkilandi. Yuza IKKI o'lchamdan yig'iladi: asos figuraning kengligini, balandlik esa uning qanchalik «baland» ekanini beradi. Ikkalasi ham kerak, va ular ko'paytiriladi: o'n ikki karra besh oltmish.",
      'Использован лишь один размер, и он удвоен. Площадь складывается из ДВУХ размеров: основание даёт ширину фигуры, а высота — насколько она «высокая». Нужны оба, и они перемножаются: двенадцать на пять шестьдесят.',
      'Only one measurement was used, and it was doubled. An area is built from TWO measurements: the base gives the width of the figure and the height how «tall» it is. Both are needed, and they multiply: twelve times five is sixty.') },
  ],
  wrongText: L(
    "Asosni balandlikka KO'PAYTIRING. Qo'shish uzunlikni beradi, yarimlash esa uchburchakning formulasi.",
    'УМНОЖЬ основание на высоту. Сложение даёт длину, а деление пополам — формула треугольника.',
    'MULTIPLY the base by the height. Adding gives a length, and halving is the formula for a triangle.'),
};

export default function D40_03(props) { return <TypeValue data={DATA} {...props} />; }
