// Dars22 · Amaliyot 07 — Ha yoki yo'q · 🟡 · tag: factor_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §4 (22-dars, 7-pozitsiya)
//
// T1 NING `a` SI — З38 NING YASHIRINGAN JOYI. Birinchi mulohazada bosh
// koeffitsiyent birga teng va u ko'rinmaydi; ikkinchisida esa u ikkiga teng
// va yozuvdan TUSHIB QOLGAN. Natijada ikkinchi yozuv asl uchhaddan ikki
// barobar kichik: qavslarni ochsangiz x² − x − 2 chiqadi.
//
// Ildizlar to'g'ri topilgan bo'lsa ham, `a` unutilsa yozuv yolg'on bo'ladi —
// shuning uchun tekshirish har doim QAVSLARNI OCHISH bilan tugaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'factor_claims', level: '🟡',
  itemSize: 14,
  items: [
    { id: 's1', yes: false,
      tokens: ['x² − 4x + 3 = (x − 1)(x + 3)'],
      claim: L("yozuv to'g'ri", 'запись верна', 'the record is right') },
    { id: 's2', yes: false,
      tokens: ['2x² − 2x − 4 = (x − 2)(x + 1)'],
      claim: L("yozuv to'g'ri", 'запись верна', 'the record is right') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki uchhad ko'paytuvchilarga ajratilgan. Har yozuvni qavslarni ochib tekshirish kerak: chap va o'ng tomon bir xil chiqishi shart.",
    'Два трёхчлена разложены на множители. Каждую запись надо проверить раскрытием скобок: левая и правая части должны совпасть.',
    'Two trinomials have been factored. Each record must be checked by expanding: the left and right sides must agree.'),
  ask: L(
    "Yozuv to'g'ri bo'lsa «Ha», noto'g'ri bo'lsa «Yo'q».",
    'Если запись верна — «Да», если неверна — «Нет».',
    'If the record is right, «Yes»; if not, «No».'),
  correctText: L(
    "To'g'ri. Ikkala yozuv ham yolg'on, lekin sabablari boshqa. Birinchisida ildizning ishorasi almashgan: ildizlar bir va uch, ya'ni ikkinchi qavs x minus uch bo'lishi kerak edi. Ikkinchisida ildizlar to'g'ri, lekin BOSH KOEFFITSIYENT tushib qolgan — yozuv ikki barobar kichik chiqadi.",
    'Верно. Обе записи ложны, но причины разные. В первой заменён знак корня: корни один и три, значит вторая скобка должна была быть x минус три. Во второй корни верны, но выпал СТАРШИЙ КОЭФФИЦИЕНТ — запись выходит вдвое меньше.',
    "Correct. Both records are false, for different reasons. In the first a root's sign was flipped: the roots are one and three, so the second bracket had to be x minus three. In the second the roots are right but the LEADING COEFFICIENT dropped out — the record comes out half the size."),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi yozuvda BOSH KOEFFITSIYENT tushib qolgan. Ildizlar to'g'ri: ikki va minus bir. Lekin uchhadning oldida ikki turibdi, va u qavslar oldiga chiqishi kerak. Tekshiring: qavslarni oching — x kvadrat minus x minus ikki chiqadi, asl uchhad esa ikki x kvadrat minus ikki x minus to'rt. Ikkinchisi birinchisidan ikki barobar katta.",
      'Во второй записи выпал СТАРШИЙ КОЭФФИЦИЕНТ. Корни верны: два и минус один. Но перед трёхчленом стоит двойка, и она должна выйти перед скобки. Проверь: раскрой скобки — выйдет x квадрат минус x минус два, а исходный трёхчлен это два x квадрат минус два x минус четыре. Второй вдвое больше первого.',
      'In the second record the LEADING COEFFICIENT has dropped out. The roots are right: two and minus one. But a two stands before the trinomial and it must come out in front of the brackets. Check: expand and you get x squared minus x minus two, while the original trinomial is two x squared minus two x minus four. The latter is twice the former.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi yozuvda qavsning ishorasi almashgan. Uchhadning ildizlari bir va uch: birda bir minus to'rt qo'shuv uch nol, uchda to'qqiz minus o'n ikki qo'shuv uch nol. Ildiz uchga teng bo'lsa, qavs x MINUS uch bo'ladi, x qo'shuv uch emas — qavs nolga aylanadigan joy ildizni ko'rsatadi. Nolni qo'yib tekshiring: chap tomon uch, o'ng tomon minus uch.",
      'В первой записи сменился знак скобки. Корни трёхчлена один и три: при одном один минус четыре плюс три нуль, при трёх девять минус двенадцать плюс три нуль. Если корень равен трём, скобка это x МИНУС три, а не x плюс три — корень показывает то место, где скобка обращается в нуль. Проверь нулём: слева три, справа минус три.',
      'In the first record the sign of the bracket changed. The roots of the trinomial are one and three: at one, one minus four plus three is zero; at three, nine minus twelve plus three is zero. If a root is three, the bracket is x MINUS three, not x plus three — a root marks where the bracket vanishes. Check at zero: the left side is three, the right side is minus three.') },
  ],
  wrongText: L(
    "Har yozuvni qavslarni ochib tekshiring. Ildizlarni to'g'ri topish yetarli emas: bosh koeffitsiyent birdan farqli bo'lsa, u qavslar OLDIDA turishi kerak.",
    'Проверяй каждую запись раскрытием скобок. Верно найти корни мало: если старший коэффициент не равен единице, он должен стоять ПЕРЕД скобками.',
    'Check every record by expanding. Finding the roots correctly is not enough: if the leading coefficient is not one, it must stand IN FRONT of the brackets.'),
};

export default function D22_07(props) { return <TrueFalse data={DATA} {...props} />; }
