// Dars39 · Amaliyot 02 — Burchak · 🟢 · tag: fourth_angle
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §11 (39-dars, 2-pozitsiya)
//
// TRAPETSIYADA PARALLELOGRAMMNING QOIDALARI ISHLAMAYDI: qarama-qarshi
// burchaklar teng emas. Yagona tayanch — to'rtburchakning burchaklari
// yig'indisi 360 gradus.
//
// Uch xato: 70 va 65 — qarama-qarshi burchak teng deb olish
// (parallelogrammning xossasini ko'chirish); 105 — hisobdagi xato.
// Berilgan burchaklar mos: 70 + 110 = 180 va 65 + 115 = 180, ya'ni
// AD va BC parallel bo'lgan trapetsiya chindan ham shunday bo'ladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'fourth_angle', level: '🟢',
  target: 115, allowNeg: false,
  given: [['∠A = 70°'], ['∠B = 110°'], ['∠C = 65°']],
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  eyebrow: L('Burchak', 'Угол', 'Angle'),
  setup: L(
    "ABCD trapetsiyaning uch burchagi ma'lum. To'rtinchisini topish kerak. Parallelogrammning qoidalari bu yerda ishlamaydi: trapetsiyada qarama-qarshi burchaklar teng emas.",
    'Известны три угла трапеции ABCD. Надо найти четвёртый. Правила параллелограмма здесь не работают: в трапеции противоположные углы не равны.',
    'Three angles of the trapezoid ABCD are known. The fourth must be found. The rules of the parallelogram do not work here: in a trapezoid the opposite angles are not equal.'),
  label: L('∠D, gradus', '∠D, градусов', '∠D, degrees'),
  ask: L('∠D nechaga teng?', 'Чему равен ∠D?', 'What is ∠D?'),
  correctText: L(
    "To'g'ri. Har qanday to'rtburchakning burchaklari yig'indisi uch yuz oltmish gradusga teng — bu trapetsiyada ham, parallelogrammda ham, ixtiyoriy to'rtburchakda ham bir xil. Uchta ma'lum burchakni qo'shamiz: yetmish qo'shuv yuz o'n bir yuz sakson, bir yuz sakson qo'shuv oltmish besh ikki yuz qirq besh. Uch yuz oltmishdan ikki yuz qirq beshni ayirsak, bir yuz o'n besh chiqadi. Javobni boshqa yo'l bilan ham tekshirish mumkin: bu trapetsiyada BC va AD parallel, ya'ni bir yon tomondagi burchaklar bir yuz sakson gradusgacha to'ldiradi — yetmish qo'shuv yuz o'n va oltmish besh qo'shuv bir yuz o'n besh, ikkalasi ham bir yuz sakson.",
    'Верно. Сумма углов любого четырёхугольника равна тремстам шестидесяти градусам — это одинаково и для трапеции, и для параллелограмма, и для произвольного четырёхугольника. Складываем три известных угла: семьдесят плюс сто десять сто восемьдесят, сто восемьдесят плюс шестьдесят пять двести сорок пять. Из трёхсот шестидесяти вычтем двести сорок пять — получится сто пятнадцать. Ответ можно проверить и другим путём: в этой трапеции BC и AD параллельны, значит углы при одной боковой стороне дополняют друг друга до ста восьмидесяти — семьдесят плюс сто десять и шестьдесят пять плюс сто пятнадцать, оба раза сто восемьдесят.',
    'Correct. The angles of any quadrilateral sum to three hundred sixty degrees — the same for a trapezoid, a parallelogram, or any quadrilateral at all. Add the three known angles: seventy plus one hundred ten is one hundred eighty, plus sixty-five is two hundred forty-five. Subtract two hundred forty-five from three hundred sixty and you get one hundred fifteen. The answer can be checked another way: in this trapezoid BC and AD are parallel, so the angles at one leg add to one hundred eighty — seventy plus one hundred ten, and sixty-five plus one hundred fifteen, both giving one hundred eighty.'),
  wrongs: [
    { when: (s) => s.value === 70 || s.value === 110, text: L(
      "Qarama-qarshi burchak TENG deb olindi, lekin bu PARALLELOGRAMMNING xossasi va trapetsiyada u ishlamaydi. Sabab sodda: parallelogrammda ikki juft tomon parallel, trapetsiyada esa faqat bittasi — ya'ni qarama-qarshi burchaklarni bog'laydigan ikkinchi juft parallellik yo'q. Tekshiring: agar ∠D yetmishga teng bo'lganda edi, to'rt burchakning yig'indisi uch yuz o'n besh bo'lardi, uch yuz oltmish emas.",
      'Противоположный угол принят РАВНЫМ, но это свойство ПАРАЛЛЕЛОГРАММА, и в трапеции оно не работает. Причина проста: у параллелограмма параллельны две пары сторон, а у трапеции только одна — то есть второй параллельности, связывающей противоположные углы, нет. Проверь: будь ∠D равен семидесяти, сумма четырёх углов вышла бы триста пятнадцать, а не триста шестьдесят.',
      'The opposite angle was taken as EQUAL, but that is a property of the PARALLELOGRAM and it does not work in a trapezoid. The reason is simple: a parallelogram has two parallel pairs of sides, a trapezoid only one — so the second parallelism that ties opposite angles together is missing. Check: were ∠D seventy, the four angles would sum to three hundred fifteen, not three hundred sixty.') },
    { when: (s) => s.value === 65, text: L(
      "Bu ∠C ning qiymati, ya'ni javob shartdan ko'chirilgan. ∠C va ∠D bir tomonning ikki uchida turadi va ular TENG emas — ular bir yuz sakson gradusgacha to'ldiradi, chunki BC va AD parallel. Bir yuz sakson minus oltmish besh bir yuz o'n besh. Yoki umumiy yo'l bilan: uch yuz oltmishdan uchta burchakni ayiring.",
      'Это значение ∠C, то есть ответ переписан из условия. ∠C и ∠D стоят в двух концах одной стороны и они НЕ равны — они дополняют друг друга до ста восьмидесяти, ведь BC и AD параллельны. Сто восемьдесят минус шестьдесят пять сто пятнадцать. Или общим путём: вычти из трёхсот шестидесяти три угла.',
      'This is the value of ∠C, that is, the answer was copied from the condition. ∠C and ∠D stand at the two ends of one side and they are NOT equal — they add to one hundred eighty, since BC and AD are parallel. One hundred eighty minus sixty-five is one hundred fifteen. Or by the general route: subtract the three angles from three hundred sixty.') },
    { when: (s) => s.value === 105 || s.value === 125 || s.value === 245, text: L(
      "Hisobda xato bor. Bosqichma-bosqich yuring: yetmish qo'shuv yuz o'n bir yuz sakson; bir yuz sakson qo'shuv oltmish besh ikki yuz qirq besh; uch yuz oltmish minus ikki yuz qirq besh bir yuz o'n besh. Javobni tekshiring: to'rt burchakni qo'shsangiz aynan uch yuz oltmish chiqishi kerak.",
      'В счёте ошибка. Иди по шагам: семьдесят плюс сто десять сто восемьдесят; сто восемьдесят плюс шестьдесят пять двести сорок пять; триста шестьдесят минус двести сорок пять сто пятнадцать. Проверь ответ: сложив четыре угла, надо получить ровно триста шестьдесят.',
      'There is a slip in the arithmetic. Go step by step: seventy plus one hundred ten is one hundred eighty; plus sixty-five is two hundred forty-five; three hundred sixty minus two hundred forty-five is one hundred fifteen. Check the answer: the four angles must add to exactly three hundred sixty.') },
  ],
  wrongText: L(
    "To'rtburchakning burchaklari yig'indisi 360 gradus. Uchtasini qo'shing va 360 dan ayiring; qarama-qarshi burchaklar trapetsiyada teng emas.",
    'Сумма углов четырёхугольника 360 градусов. Сложи три и вычти из 360; противоположные углы в трапеции не равны.',
    'The angles of a quadrilateral sum to 360 degrees. Add the three and subtract from 360; opposite angles are not equal in a trapezoid.'),
};

export default function D39_02(props) { return <TypeValue data={DATA} {...props} />; }
