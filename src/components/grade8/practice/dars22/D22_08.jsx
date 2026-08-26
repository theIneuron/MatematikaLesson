// Dars22 · Amaliyot 08 — Tartib · 🔴 · tag: biquad_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §4 (22-dars, 8-pozitsiya)
//
// BIKVADRAT TENGLAMANING BUTUN YO'LI BIR QATORDA. Eng qimmat qadam —
// OXIRGISI: belgilashga qaytish. Uni tashlab ketgan o'quvchi t ning
// qiymatlarini javob deb yozadi, holbuki savol x haqida edi.
//
// Oxirgi kartada plyus-minus turadi (З40): har musbat t dan IKKI x chiqadi.
// Kartada SO'Z asosiy, matematika qisqa dalil (telefonda ustun ~85px),
// shuning uchun yozuv bo'shliqsiz.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'biquad_steps', level: '🔴',
  expr: ['x⁴ − 20x² + 64 = 0'], exprSize: 22,
  itemSize: 11,
  cards: [
    { id: 'l1', tokens: ['x²=t'],
      label: L('belgilash kiritamiz', 'вводим замену', 'introduce the substitution') },
    { id: 'l2', tokens: ['t²−20t+64=0'],
      label: L('kvadrat tenglamani yozamiz', 'записываем квадратное уравнение', 'write the quadratic equation') },
    { id: 'l3', tokens: ['t=4;t=16'],
      label: L('t larni topamiz', 'находим t', 'find the values of t') },
    { id: 'l4', tokens: ['x=±2;±4'],
      label: L('x ga qaytamiz', 'возвращаемся к x', 'return to x') },
  ],
  start: ['l2', 'l1', 'l4', 'l3'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Bikvadrat tenglama to'rt qadamda yechiladi: belgilash, kvadrat tenglama, t lar, x ga qaytish. Qadamlar aralashib ketgan.",
    'Биквадратное уравнение решается в четыре шага: замена, квадратное уравнение, значения t, возврат к x. Шаги перепутаны.',
    'A biquadratic equation is solved in four steps: substitution, quadratic equation, values of t, return to x. The steps are mixed up.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval belgilash, keyin kvadrat tenglama: t kvadrat minus yigirma t qo'shuv oltmish to'rt nolga teng, ildizlari to'rt va o'n olti. Va faqat oxirida x ga qaytamiz: plyus-minus ikki va plyus-minus to'rt. Oxirgi qadamni tashlab ketsangiz, t ning qiymatlari javob bo'lib qoladi.",
    'Верно. Сначала замена, потом квадратное уравнение: t квадрат минус двадцать t плюс шестьдесят четыре равно нулю, корни четыре и шестнадцать. И только в конце возвращаемся к x: плюс-минус два и плюс-минус четыре. Пропустишь последний шаг — значения t останутся ответом.',
    'Correct. First the substitution, then the quadratic: t squared minus twenty t plus sixty four equals zero, with roots four and sixteen. And only at the end back to x: plus or minus two and plus or minus four. Skip that last step and the values of t stay as the answer.'),
  wrongs: [
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "x ga qaytish ILDIZLARDAN keyin turadi: qaytadigan narsa hali topilmagan. Avval t ning qiymatlari kerak, undan keyingina har biridan x olinadi. Bu oxirgi qadam eng ko'p tashlab ketiladi, chunki t topilganda ish tugagandek tuyuladi.",
      'Возврат к x идёт ПОСЛЕ корней: возвращаться пока не из чего. Сначала нужны значения t, и только потом из каждого берут x. Этот последний шаг пропускают чаще всего, потому что после нахождения t кажется, что работа окончена.',
      'The return to x comes AFTER the roots: there is nothing to return from yet. The values of t are needed first, and only then is x taken from each. This last step is skipped most often, because once t is found the work feels finished.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Kvadrat tenglamani belgilashdan OLDIN yozib bo'lmaydi: t harfi qayerdan chiqqani aytilmagan bo'lsa, t kvadrat minus yigirma t degan yozuvning ma'nosi yo'q. Birinchi qadam — x kvadratni t deb belgilash, aynan shu belgilash to'rtinchi darajani ikkinchisiga tushiradi.",
      'Квадратное уравнение нельзя записать ДО замены: если не сказано, откуда взялась буква t, запись t квадрат минус двадцать t не имеет смысла. Первый шаг — обозначить x квадрат через t, именно эта замена опускает четвёртую степень до второй.',
      'The quadratic equation cannot be written BEFORE the substitution: if it is not said where the letter t came from, the record t squared minus twenty t means nothing. The first step is to denote x squared by t — that substitution is what lowers the fourth power to the second.') },
    { when: (s) => s.seq[0] === 'l4' || s.seq[0] === 'l3', text: L(
      "Javobdan yoki t larning qiymatidan boshlab bo'lmaydi — ular ishning natijasi. Bikvadrat tenglama har doim BELGILASHDAN boshlanadi: bu darajani tushiradigan yagona qadam.",
      'Начинать с ответа или со значений t нельзя — они результат работы. Биквадратное уравнение всегда начинается с ЗАМЕНЫ: это единственный шаг, понижающий степень.',
      'You cannot start with the answer or with the values of t — they are the result of the work. A biquadratic equation always starts with the SUBSTITUTION: it is the only step that lowers the degree.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "t larni topish uchun avval TENGLAMA kerak. To'rt va o'n olti o'z-o'zidan chiqmaydi: ular t kvadrat minus yigirma t qo'shuv oltmish to'rt nolga teng degan yozuvdan chiqadi.",
      'Чтобы найти t, сначала нужно УРАВНЕНИЕ. Четыре и шестнадцать не берутся сами собой: они выходят из записи t квадрат минус двадцать t плюс шестьдесят четыре равно нулю.',
      'To find the values of t an EQUATION is needed first. Four and sixteen do not appear by themselves: they come out of the record t squared minus twenty t plus sixty four equals zero.') },
  ],
  wrongText: L(
    "Belgilash birinchi, x ga qaytish oxirgi. t ning qiymatlari javob emas: savol x haqida, va har musbat t dan ikki x chiqadi.",
    'Замена первая, возврат к x последний. Значения t не ответ: вопрос про x, и из каждого положительного t выходят два x.',
    'The substitution comes first, the return to x last. The values of t are not the answer: the question is about x, and each positive t yields two values of x.'),
};

export default function D22_08(props) { return <SwapOrder data={DATA} {...props} />; }
