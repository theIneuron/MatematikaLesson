// Dars47 · Amaliyot 04 — Ha yoki yo'q · 🟡 · tag: rope_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §9 (47-dars, 4-pozitsiya)
//
// JAVOB: YO'Q, HA (skelet §0a.1). Ikki da'vo BIR xil ipni ikki xil bo'ladi,
// ya'ni farq faqat NISBATDA:
//   4, 4, 4 -> teng tomonli uchburchak, to'g'ri burchak YO'Q (З101)
//   3, 4, 5 -> misr uchburchagi, to'g'ri burchak BOR (T1)
// Bu darslikning 104-betdagi amaliy masalasi: ustunni tik o'rnatish.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'rope_claims', level: '🟡',
  itemSize: 16,
  given: [['ip = 12']],
  givenLabel: L('Ipning uzunligi', 'Длина верёвки', 'The length of the rope'),
  items: [
    { id: 's1', yes: false, tokens: ['12 → 4, 4, 4'],
      claim: L("ustun tik turadi", 'столб стоит вертикально', 'the pole stands upright') },
    { id: 's2', yes: true, tokens: ['12 → 3, 4, 5'],
      claim: L("ustun tik turadi", 'столб стоит вертикально', 'the pole stands upright') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Quruvchi o'n ikki birlik uzunlikdagi ipni uchga bo'lib, uchi bilan uchburchak yasaydi: bir tomoni yerda, bir tomoni ustun bo'ylab, uchinchisi ularni tutashtiradi. Ustun yerga tik turishi uchun shu uchburchakning burchagi to'g'ri bo'lishi kerak.",
    'Строитель делит верёвку длиной двенадцать единиц на три части и складывает из них треугольник: одна сторона по земле, одна по столбу, третья соединяет их. Чтобы столб стоял вертикально, угол этого треугольника должен быть прямым.',
    'A builder divides a rope of twelve units into three parts and makes a triangle: one side along the ground, one along the pole, the third joining them. For the pole to stand upright that angle of the triangle must be right.'),
  ask: L(
    "Ip shunday bo'linganda ustun tik turadimi? «Ha» yoki «Yo'q».",
    'Будет ли столб стоять вертикально при таком делении верёвки? «Да» или «Нет».',
    'Will the pole stand upright with the rope divided this way? Tap «Yes» or «No».'),
  correctText: L(
    "To'g'ri. Birinchi bo'linishda uchala bo'lak teng: to'rt, to'rt, to'rt. Bu teng tomonli uchburchak, uning har burchagi oltmish gradus — ya'ni to'g'ri burchak yo'q, va ustun qiya turadi. Hisob bilan tekshirish: o'n olti qo'shuv o'n olti o'ttiz ikki, uchinchi tomonning kvadrati esa o'n olti — teng emas. Ikkinchi bo'linishda esa uch, to'rt, besh: to'qqiz qo'shuv o'n olti yigirma besh, va besh kvadrat ham yigirma besh — tenglik bajariladi, demak burchak to'g'ri. Ipni TENG bo'laklarga bo'lish eng oson yo'l bo'lib ko'rinadi, lekin u kerakli natijani bermaydi: nisbat uch, to'rt, besh bo'lishi kerak.",
    'Верно. При первом делении все три части равны: четыре, четыре, четыре. Это равносторонний треугольник, каждый угол в нём шестьдесят градусов — прямого угла нет, и столб стоит косо. Проверка счётом: шестнадцать плюс шестнадцать — тридцать два, а квадрат третьей стороны шестнадцать — не равно. А при втором делении три, четыре, пять: девять плюс шестнадцать — двадцать пять, и пять в квадрате двадцать пять — равенство выполняется, значит угол прямой. Делить верёвку на РАВНЫЕ части кажется самым простым, но нужного результата это не даёт: отношение должно быть три, четыре, пять.',
    'Correct. In the first division all three parts are equal: four, four, four. That is an equilateral triangle with every angle sixty degrees — no right angle, and the pole leans. A check by computing: sixteen plus sixteen is thirty two while the square of the third side is sixteen — not equal. In the second division it is three, four, five: nine plus sixteen is twenty five, and five squared is twenty five — the equality holds, so the angle is right. Dividing the rope into EQUAL parts looks easiest, but it does not give what is needed: the ratio must be three, four, five.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Teng bo'laklar to'g'ri burchak bermaydi. To'rt, to'rt, to'rt — teng tomonli uchburchak, va uning burchaklari oltmish gradusga teng, to'qsonga emas. Hisob bilan: o'n olti qo'shuv o'n olti o'ttiz ikki, uchinchi tomonning kvadrati esa o'n olti — tenglik yo'q. Ip teng bo'linsa, ustun qiya turadi.",
      'Равные части прямого угла не дают. Четыре, четыре, четыре — равносторонний треугольник, и углы в нём по шестьдесят градусов, а не девяносто. Счётом: шестнадцать плюс шестнадцать — тридцать два, а квадрат третьей стороны шестнадцать — равенства нет. При равном делении верёвки столб стоит косо.',
      'Equal parts give no right angle. Four, four, four is an equilateral triangle and its angles are sixty degrees, not ninety. By computing: sixteen plus sixteen is thirty two while the square of the third side is sixteen — no equality. With the rope divided equally the pole leans.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi bo'linish aynan kerakli bo'linish: uch, to'rt, besh. To'qqiz qo'shuv o'n olti yigirma besh, besh kvadrat ham yigirma besh — tenglik bajariladi, ya'ni teskari teorema bo'yicha uchburchak to'g'ri burchakli. Ustun yerga tik turadi, va quruvchilar bu usuldan ming yillar beri foydalanadi.",
      'Второе деление и есть нужное: три, четыре, пять. Девять плюс шестнадцать — двадцать пять, и пять в квадрате двадцать пять — равенство выполняется, значит по обратной теореме треугольник прямоугольный. Столб стоит вертикально, и строители пользуются этим приёмом тысячи лет.',
      'The second division is exactly the one needed: three, four, five. Nine plus sixteen is twenty five and five squared is twenty five — the equality holds, so by the converse theorem the triangle is right-angled. The pole stands upright, and builders have used this trick for thousands of years.') },
  ],
  wrongText: L(
    "Har bo'linishni hisoblab tekshiring: ikki kichik bo'lakning kvadratlari yig'indisi kattasining kvadratiga tengmi?",
    'Проверяй каждое деление счётом: равна ли сумма квадратов двух меньших частей квадрату большей?',
    'Check each division by computing: does the sum of the squares of the two smaller parts equal the square of the largest?'),
};

export default function D47_04(props) { return <TrueFalse data={DATA} {...props} />; }
