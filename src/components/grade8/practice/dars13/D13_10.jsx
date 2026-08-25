// Dars13 · Amaliyot 10 — Tartib · 🔴 · tag: take_out_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §4 (13-dars, 10-pozitsiya)
//
// Chiqarishning to'rt qadami, va oxirgisi TEKSHIRISH — darsning uchinchi
// tasdig'i (T3). Tekshirishni oxirida qoldirish shart: uni yuqoriga surgan
// o'quvchi hali javobi yo'q narsani kvadratga oshirmoqchi bo'ladi.
//
// Ajratishda ENG KATTA to'liq kvadrat olinadi: yetmish ikki bu o'ttiz olti
// karra ikki. Sakkiz karra to'qqiz deb ajratish qiymatni buzmaydi, lekin
// yozuv qisqarmaydi — razborda shu aytiladi.
// Boshlang'ich tartib QAT'IY (`start`), tasodifiy emas: aralashtirish ba'zan
// to'g'ri tartibni berib qo'yardi va topshiriq bir bosishda yopilardi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'take_out_steps', level: '🔴',
  expr: [{ r: '72' }], exprSize: 30,
  itemSize: 13,
  cards: [
    { id: 'l1', tokens: ['72 = 36 · 2'],
      label: L("eng katta to'liq kvadratni ajratamiz", 'выделяем наибольший полный квадрат', 'pick out the largest perfect square') },
    { id: 'l2', tokens: [{ r: '36' }, '·', { r: '2' }],
      label: L('ildizni ikkiga ajratamiz', 'раздаём корень на два', 'split the root in two') },
    { id: 'l3', tokens: ['6', { r: '2' }],
      label: L('birinchi ildizni hisoblaymiz', 'считаем первый корень', 'compute the first root') },
    { id: 'l4', tokens: ['36 · 2 = 72'],
      label: L('javobni kvadratga oshirib tekshiramiz', 'проверяем ответ возведением в квадрат', 'check by squaring the answer') },
  ],
  start: ['l4', 'l2', 'l1', 'l3'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Yetmish ikkidan ildizni qisqartirishning to'rt qadami bir qatorda turadi, lekin tartibi buzilgan. Oxirgi qadam — tekshirish.",
    'Четыре шага сокращения корня из семидесяти двух стоят в одну строку, но порядок нарушен. Последний шаг — проверка.',
    'The four steps of shortening the root of seventy two stand in one row, but their order is broken. The last step is the check.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval ajratish: yetmish ikki bu o'ttiz olti karra ikki, va o'ttiz olti eng katta to'liq kvadrat. Keyin 12-darsning xossasi ishlaydi: ildiz ikkiga bo'linadi. Undan keyin birinchi ildiz hisoblanadi — olti, ikkinchisi esa ildiz ostida qoladi. Faqat oxirida tekshirish: oltining kvadrati o'ttiz olti, karra ikki yetmish ikki. Ildiz ostidagi son qaytib keldi, demak o'zgartirish to'g'ri.",
    'Верно. Сначала разложение: семьдесят два это тридцать шесть на два, и тридцать шесть — наибольший полный квадрат. Потом работает свойство из урока 12: корень раздаётся на два. Затем считается первый корень — шесть, а второй остаётся под корнем. И только в конце проверка: шесть в квадрате тридцать шесть, на два семьдесят два. Подкоренное вернулось, значит преобразование верное.',
    'Correct. First the split: seventy two is thirty six times two, and thirty six is the largest perfect square. Then the property from lesson 12 works: the root divides in two. Then the first root is computed — six, while the second stays under the root. Only at the end comes the check: six squared is thirty six, times two is seventy two. The radicand came back, so the transformation is right.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Tekshirishdan boshlab bo'lmaydi: tekshirish uchun JAVOB kerak, javob esa hali yo'q. Kvadratga oshirish o'zgartirishni yopadi, ochmaydi.",
      'Начинать с проверки нельзя: для проверки нужен ОТВЕТ, а его ещё нет. Возведение в квадрат закрывает преобразование, а не открывает его.',
      'You cannot start with the check: a check needs an ANSWER, and there is none yet. Squaring closes a transformation, it does not open one.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Tekshirish oltini kvadratga oshiradi, demak olti allaqachon topilgan bo'lishi kerak. Tekshiruv oxirgi qadam: u javobni ISBOTLAYDI, hisoblamaydi.",
      'Проверка возводит в квадрат шесть, значит шесть должно быть уже найдено. Проверка — последний шаг: она ДОКАЗЫВАЕТ ответ, а не считает его.',
      'The check squares the six, so six must already be found. The check is the last step: it PROVES the answer, it does not compute it.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Ildizni ikkiga ajratish uchun ikki ko'paytuvchi allaqachon yozilgan bo'lishi kerak. Birinchi qadam aynan shu: yetmish ikkini o'ttiz olti karra ikki deb yozish. Ajratmasdan bo'linadigan narsa yo'q.",
      'Чтобы раздать корень на два, два множителя должны быть уже записаны. Первый шаг именно в этом: записать семьдесят два как тридцать шесть на два. Без разложения раздавать нечего.',
      'To split the root in two, the two factors must already be written. That is the first step: writing seventy two as thirty six times two. Without the split there is nothing to divide.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Olti — bu o'ttiz oltidan ildizning qiymati, demak ikki ildiz oldin yozilishi kerak. Aks holda olti qaysi sondan chiqqani ko'rinmaydi.",
      'Шесть — это значение корня из тридцати шести, значит два корня должны быть записаны раньше. Иначе не видно, из какого числа вышло шесть.',
      'Six is the value of the root of thirty six, so the two roots must be written first. Otherwise it is not visible which number six came from.') },
  ],
  wrongText: L(
    "Har qadamdan bitta savol so'rang: buni bajarish uchun nima allaqachon yozilgan bo'lishi kerak? Tekshirish esa har doim oxirida turadi — u javobni talab qiladi.",
    'Спроси у каждого шага: что должно быть уже записано, чтобы его сделать? А проверка всегда последняя — ей нужен готовый ответ.',
    'Ask every step: what must already be written to do it? And the check always comes last — it needs a finished answer.'),
};

export default function D13_10(props) { return <SwapOrder data={DATA} {...props} />; }
