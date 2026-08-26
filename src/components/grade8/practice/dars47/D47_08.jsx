// Dars47 · Amaliyot 08 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §9 (47-dars, 8-pozitsiya)
//
// 02-TOPSHIRIQNING DAVOMI: u yerda balandlikning KVADRATI topilgan edi
// (yetmish besh), bu yerda balandlikning o'zi va yuza to'ldiriladi.
//
// Kartalar SO'Z va BELGI aralash — `ClozeBank` ning kartasi `L()` oladi,
// ya'ni ildizli yozuv ham karta matni bo'lib turadi (skelet §0a.5, `D37_05`
// da `180°` xuddi shunday ishlatilgan).
// Bankdagi tuzoqlar: «o'ziga» (З100), «√125» (ayirish o'rniga qo'shish),
// «50√3» (yarim unutilgan).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L('Teng tomonli uchburchakda balandlik asosning', 'В равностороннем треугольнике высота находится применением теоремы Пифагора к', 'In an equilateral triangle the height is found by applying the Pythagorean theorem to') },
    { slot: 0 },
    { text: L("va yon tomonga Pifagor teoremasini qo'llashdan topiladi. a = 10 bo'lsa, h =", 'основания и боковой стороне. При a = 10 получаем h =', 'the base and the side. With a = 10 we get h =') },
    { slot: 1 },
    { text: L(', yuzasi esa S =', ', а площадь S =', ', and the area S =') },
    { slot: 2 },
    { text: L('.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('yarmiga', 'половине', 'half') },
    { id: 'w2', label: L('√75', '√75', '√75') },
    { id: 'w3', label: L('25√3', '25√3', '25√3') },
    { id: 'w4', label: L("o'ziga", 'всему', 'the whole of') },
    { id: 'w5', label: L('√125', '√125', '√125') },
    { id: 'w6', label: L('50√3', '50√3', '50√3') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Teng tomonli uchburchakning tomoni o'n. Qoida va hisob bitta gapga yig'ilgan, lekin uch joyi tushib qolgan.",
    'Сторона равностороннего треугольника десять. Правило и вычисление собраны в одно предложение, но три места выпали.',
    'The side of an equilateral triangle is ten. The rule and the computation are gathered into one sentence, but three pieces fell out.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uch qadam ketma-ket bajarildi. Birinchisi: balandlik asosni teng ikkiga bo'ladi, ya'ni to'g'ri burchakli uchburchakning kateti asosning YARMI — besh. Ikkinchisi: yuz minus yigirma besh yetmish besh, demak balandlik ildiz ostida yetmish besh. Uchinchisi: yuza asos karra balandlikning yarmi, ya'ni yarim karra o'n karra ildiz ostida yetmish besh. Ildiz ostida yetmish beshni sodda ko'rinishga keltiramiz: yetmish besh yigirma besh karra uch, ya'ni ildizi besh karra ildiz uch. Shunda yuza besh karra besh karra ildiz uch, ya'ni yigirma besh karra ildiz uch.",
    'Верно. Три шага выполнены по порядку. Первый: высота делит основание пополам, значит катет прямоугольного треугольника — ПОЛОВИНА основания, пять. Второй: сто минус двадцать пять — семьдесят пять, значит высота равна корню из семидесяти пяти. Третий: площадь — половина произведения основания на высоту, то есть половина от десяти на корень из семидесяти пяти. Приведём корень к простому виду: семьдесят пять это двадцать пять на три, значит корень равен пяти на корень из трёх. Тогда площадь пять на пять на корень из трёх, то есть двадцать пять на корень из трёх.',
    'Correct. Three steps were done in order. First: the height halves the base, so the leg of the right triangle is HALF the base, five. Second: one hundred minus twenty five is seventy five, so the height is the root of seventy five. Third: the area is half the base times the height, that is half of ten times the root of seventy five. Simplify the root: seventy five is twenty five times three, so its root is five times the root of three. Then the area is five times five times the root of three, that is twenty five times the root of three.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('w4') !== -1, text: L(
      "«O'ziga» qo'yilsa, to'liq asos katet bo'lib qoladi va hisob buziladi: yuz minus yuz nol chiqadi, ya'ni balandlik nolga teng bo'lardi. Balandlik uchdan asosning O'RTASIGA tushadi — bu teng tomonli uchburchakda har doim shunday, chunki balandlik mediana ham bo'ladi.",
      'Со словом «всему» полное основание становится катетом, и счёт ломается: сто минус сто — нуль, то есть высота оказалась бы нулевой. Высота падает из вершины в СЕРЕДИНУ основания — в равностороннем треугольнике так всегда, ведь высота является и медианой.',
      'With the whole of, the full base becomes a leg and the arithmetic breaks: one hundred minus one hundred is zero, so the height would be zero. The height drops from the vertex to the MIDPOINT of the base — always so in an equilateral triangle, since the height is also a median.') },
    { when: (s) => s.slots.indexOf('w5') !== -1, text: L(
      "Ildiz ostida bir yuz yigirma besh — kvadratlar QO'SHILGAN: yuz qo'shuv yigirma besh. Lekin yon tomon gipotenuza, ya'ni u eng katta: balandlik undan kichik bo'lishi kerak. Ildiz ostida bir yuz yigirma besh o'ndan katta, ya'ni javob mumkin emasligini darhol ko'rsatadi. Kvadratlarni ayirish kerak.",
      'Корень из ста двадцати пяти — квадраты СЛОЖЕНЫ: сто плюс двадцать пять. Но боковая сторона это гипотенуза, то есть наибольшая: высота должна быть меньше её. Корень из ста двадцати пяти больше десяти, и это сразу показывает, что ответ невозможен. Квадраты надо вычитать.',
      'The root of one hundred twenty five means the squares were ADDED: one hundred plus twenty five. But the side is the hypotenuse, the largest: the height must be less than it. The root of one hundred twenty five exceeds ten, which shows at once that the answer is impossible. The squares must be subtracted.') },
    { when: (s) => s.slots.indexOf('w6') !== -1, text: L(
      "Ellik karra ildiz uch — yuza formulasida YARIM unutilgan: o'n karra besh karra ildiz uch. Uchburchakning yuzi asos karra balandlikning YARMI, ya'ni javob ikki barobar kichik: yigirma besh karra ildiz uch.",
      'Пятьдесят на корень из трёх — в формуле площади забыта ПОЛОВИНА: десять на пять на корень из трёх. Площадь треугольника — ПОЛОВИНА произведения основания на высоту, значит ответ вдвое меньше: двадцать пять на корень из трёх.',
      'Fifty times the root of three means the HALF was forgotten in the area formula: ten times five times the root of three. The area of a triangle is HALF the base times the height, so the answer is half that: twenty five times the root of three.') },
    { when: (s) => s.slots[1] === 'w5' && s.slots[2] === 'w6', text: L(
      "Ikki joyda ham xato bir xil sababdan: birinchisida qo'shish o'rniga ayirish kerak, ikkinchisida esa yarimni tushirib qoldirmaslik kerak. Ikkisini alohida tekshirib ko'ring: balandlik yon tomondan kichik, yuza esa asos karra balandlikning yarmi.",
      'В двух местах ошибка по одной причине: в первом вместо сложения нужно вычитание, во втором нельзя терять половину. Проверь каждое отдельно: высота меньше боковой стороны, а площадь — половина произведения основания на высоту.',
      'The error in both places has one cause: the first needs subtraction instead of addition, the second must not lose the half. Check each separately: the height is less than the side, and the area is half the base times the height.') },
  ],
  wrongText: L(
    "Uch qadam: yarim asos, kvadratlarni ayirish, keyin yuza — asos karra balandlikning yarmi.",
    'Три шага: половина основания, вычитание квадратов, потом площадь — половина произведения основания на высоту.',
    'Three steps: half the base, subtract the squares, then the area — half the base times the height.'),
};

export default function D47_08(props) { return <ClozeBank data={DATA} {...props} />; }
