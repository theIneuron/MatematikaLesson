// Dars13 · Amaliyot 08 — Pazl · 🔴 · tag: out_in_pairs
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §4 (13-dars, 8-pozitsiya)
//
// IKKI JUFTDA ILDIZ OSTI BIR XIL (uchlik): √48 = 4√3 va √75 = 5√3. Demak
// juftlikni faqat KOEFFITSIYENT hal qiladi va uni hisoblash kerak — «ildiz
// ostiga qarab tanlash» yo'li yopiq. Uchinchi juftlik boshqa ildiz ostini
// beradi (√44 = 2√11) va u yerda tuzoq boshqacha: 44 = 4 · 11, chiqadigan
// son to'rt emas, uning ildizi — ikki.
//
// IKKALA TOMON HAM MATEMATIKA, shuning uchun kartalar `side` bilan beriladi
// (8-dars amaliyotida kiritilgan naqsh): `side: 0` — chap bo'lak, `side: 1` —
// o'ng. Aks holda ildizni matnga aylantirish kerak bo'lardi va ustki chiziq
// yo'qolardi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'out_in_pairs', level: '🔴',
  faceSize: 14,
  cards: [
    { id: 'f1', side: 0, tokens: [{ r: '48' }] },
    { id: 'f2', side: 0, tokens: [{ r: '75' }] },
    { id: 'f3', side: 0, tokens: [{ r: '44' }] },
    { id: 'v1', side: 1, tokens: ['4', { r: '3' }] },
    { id: 'v2', side: 1, tokens: ['5', { r: '3' }] },
    { id: 'v3', side: 1, tokens: ['2', { r: '11' }] },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Chapda uch ildiz, o'ngda ularning eng qisqa ko'rinishi. Ikki javobda ildiz osti bir xil — uchlik, demak ildiz ostiga qarab tanlab bo'lmaydi.",
    'Слева три корня, справа их самый короткий вид. В двух ответах подкоренное одинаково — тройка, значит выбрать по подкоренному не получится.',
    'Three roots on the left, their shortest form on the right. Two of the answers share the radicand — a three, so you cannot choose by the radicand.'),
  ask: L(
    "Kartani bosing, keyin uyani bosing. Har ildiz o'z qisqa ko'rinishi bilan juftlanadi.",
    'Нажми карточку, потом ячейку. Каждый корень встаёт в пару со своим коротким видом.',
    'Tap a card, then a slot. Each root pairs with its own shortest form.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Qirq sakkiz bu o'n olti karra uch, o'n oltidan ildiz to'rt — to'rt uchdan ildiz. Yetmish besh bu yigirma besh karra uch, yigirma beshdan ildiz besh — besh uchdan ildiz. Ikkalasida ham ildiz ostida uch qoldi, farqi faqat koeffitsiyentda. Qirq to'rt bu to'rt karra o'n bir, to'rtdan ildiz ikki — ikki o'n birdan ildiz. Tekshirish: to'rtning kvadrati o'n olti karra uch qirq sakkiz; beshning kvadrati yigirma besh karra uch yetmish besh; ikkining kvadrati to'rt karra o'n bir qirq to'rt.",
    'Верно. Сорок восемь это шестнадцать на три, корень из шестнадцати четыре — четыре корня из трёх. Семьдесят пять это двадцать пять на три, корень из двадцати пяти пять — пять корней из трёх. В обоих под корнем осталась тройка, разница только в коэффициенте. Сорок четыре это четыре на одиннадцать, корень из четырёх два — два корня из одиннадцати. Проверка: четыре в квадрате шестнадцать на три сорок восемь; пять в квадрате двадцать пять на три семьдесят пять; два в квадрате четыре на одиннадцать сорок четыре.',
    'Correct. Forty eight is sixteen times three, the root of sixteen is four — four roots of three. Seventy five is twenty five times three, the root of twenty five is five — five roots of three. Both kept a three under the root; only the coefficient differs. Forty four is four times eleven, the root of four is two — two roots of eleven. Check: four squared is sixteen times three, forty eight; five squared is twenty five times three, seventy five; two squared is four times eleven, forty four.'),
  wrongs: [
    { when: (s) => s.mate.f1 === 'v2' || s.mate.f2 === 'v1', text: L(
      "Ildiz ostilari bir xil bo'lgani uchun juftlikni koeffitsiyent hal qiladi, va u hisoblanishi kerak. Kvadratga oshirib tekshiring: to'rtning kvadrati o'n olti, karra uch qirq sakkiz — bu qirq sakkizga to'g'ri keladi, yetmish beshga esa yo'q. Beshning kvadrati yigirma besh, karra uch yetmish besh.",
      'Подкоренные одинаковы, поэтому пару решает коэффициент, и его надо посчитать. Проверь возведением в квадрат: четыре в квадрате шестнадцать, на три сорок восемь — это подходит к сорока восьми, но не к семидесяти пяти. Пять в квадрате двадцать пять, на три семьдесят пять.',
      'The radicands match, so the coefficient decides the pair, and it must be computed. Check by squaring: four squared is sixteen, times three is forty eight — that fits forty eight, not seventy five. Five squared is twenty five, times three is seventy five.') },
    { when: (s) => s.mate.f3 && s.mate.f3 !== 'v3', text: L(
      "Qirq to'rtning ildiz ostida o'n bir qoladi, uch emas: qirq to'rt uchga bo'linmaydi. Uni to'rt karra o'n bir deb ajratish kerak, va chiqadigan son to'rtning O'ZI emas, uning ildizi — ikki. Tekshiring: ikkining kvadrati to'rt, karra o'n bir qirq to'rt.",
      'У сорока четырёх под корнем остаётся одиннадцать, а не три: сорок четыре на три не делится. Его надо разложить как четыре на одиннадцать, и выходит не САМО четыре, а его корень — два. Проверь: два в квадрате четыре, на одиннадцать сорок четыре.',
      'Forty four keeps eleven under the root, not three: forty four is not divisible by three. It splits as four times eleven, and what leaves is not four ITSELF but its root — two. Check: two squared is four, times eleven is forty four.') },
    { when: (s) => s.mate.f1 === 'v3' || s.mate.f2 === 'v3', text: L(
      "Ildiz ostidagi son ham tekshirilishi kerak. Qirq sakkiz va yetmish besh uchga bo'linadi, qirq to'rt esa yo'q — u o'n birga bo'linadi. Har juftlikda ikkita narsa mos kelishi shart: koeffitsiyent ham, ildiz osti ham.",
      'Подкоренное тоже надо проверять. Сорок восемь и семьдесят пять делятся на три, а сорок четыре нет — оно делится на одиннадцать. В каждой паре должны совпасть две вещи: и коэффициент, и подкоренное.',
      'The radicand needs checking too. Forty eight and seventy five are divisible by three, forty four is not — it is divisible by eleven. In every pair two things must agree: the coefficient and the radicand.') },
  ],
  wrongText: L(
    "Har juftlikni bitta amal bilan tekshiring: o'ng tomondagi koeffitsiyentni kvadratga oshirib ildiz ostidagi songa ko'paytiring. Chiqqan son chap tomondagi ildiz ostiga teng bo'lishi kerak.",
    'Проверяй каждую пару одним действием: возведи коэффициент справа в квадрат и умножь на его подкоренное. Должно выйти подкоренное слева.',
    'Check every pair with one action: square the coefficient on the right and multiply by its radicand. The result must equal the radicand on the left.'),
};

export default function D13_08(props) { return <PairSlots data={DATA} {...props} />; }
