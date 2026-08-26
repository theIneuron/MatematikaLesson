// Dars15 · Amaliyot 09 — Qaysi tenglama · 🔴 · tag: which_quadratic_root
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §3 (15-dars, 9-pozitsiya)
//
// IKKI SHART BIR SAVOLDA, va shuning uchun bu 🔴: tenglama KVADRAT bo'lishi
// kerak (T1) va minus uch uning ILDIZI bo'lishi kerak (T3).
//
// Ikkinchi variant — darsning eng qimmat tuzog'i: minus uch uni chindan ham
// to'g'ri qiladi (minus uch qo'shuv uch nol), lekin bosh koeffitsiyent nolga
// teng, ya'ni bu kvadrat tenglama emas (З38). Faqat qo'yib ko'rgan o'quvchi
// shu yerda to'xtaydi.
// Uchinchi va to'rtinchi variant kvadrat, lekin minus uch ularning ildizi
// emas — razbor har birini SON bilan rad etadi.
// Variantlar aralashtiriladi (Choice ichida), razbor shartlari ASL raqamda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_quadratic_root', level: '🔴',
  correct: 0, optCols: 2, optSize: 17,
  given: [['m = −3']],
  givenLabel: L('Berilgan son', 'Данное число', 'The given number'),
  eyebrow: L('Qaysi tenglama', 'Какое уравнение', 'Which equation'),
  setup: L(
    "Ikki shartni birga tekshirish kerak: tenglama kvadrat bo'lsin va minus uch uning ildizi bo'lsin. Bitta shart yetmaydi.",
    'Проверить надо два условия сразу: уравнение должно быть квадратным и минус три должно быть его корнем. Одного условия не хватает.',
    'Two conditions must hold at once: the equation must be quadratic and minus three must be its root. One condition is not enough.'),
  ask: L(
    "m = −3 qaysi KVADRAT tenglamaning ildizi?",
    'Для какого КВАДРАТНОГО уравнения m = −3 является корнем?',
    'For which QUADRATIC equation is m = −3 a root?'),
  opts: [
    { label: ['m² + m − 6 = 0'] },
    { label: ['0·m² + m + 3 = 0'] },
    { label: ['m² − m − 6 = 0'] },
    { label: ['m² − 9m + 18 = 0'] },
  ],
  correctText: L(
    "To'g'ri. Ikki shart ham bajarildi. Bosh koeffitsiyent birga teng, ya'ni noldan farqli — tenglama kvadrat. Minus uchni qo'yamiz: minus uchning kvadrati arti to'qqiz, qo'shuv minus uch, minus olti. To'qqiz minus uch minus olti nolga teng. Demak minus uch haqiqatan ildiz. Bu tenglamaning ikkinchi ildizi ikki.",
    'Верно. Оба условия выполнены. Старший коэффициент равен единице, то есть не нулю — уравнение квадратное. Подставляем минус три: минус три в квадрате плюс девять, плюс минус три, минус шесть. Девять минус три минус шесть равно нулю. Значит минус три действительно корень. Второй корень этого уравнения — два.',
    'Correct. Both conditions hold. The leading coefficient is one, so not zero — the equation is quadratic. Substitute minus three: minus three squared is plus nine, plus minus three, minus six. Nine minus three minus six is zero. So minus three really is a root. The second root of this equation is two.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Minus uch bu tenglamani chindan ham to'g'ri qiladi: nol karra to'qqiz nol, minus uch qo'shuv uch nol. Lekin bosh koeffitsiyent NOLGA teng, ya'ni kvadrat had yo'qoladi va yozuvdan m qo'shuv uch qoladi — bu chiziqli tenglama. Savol esa kvadrat tenglamani so'ragan. Ildiz to'g'ri, tenglamaning turi noto'g'ri.",
      'Минус три действительно обращает это уравнение в верное равенство: нуль на девять нуль, минус три плюс три нуль. Но старший коэффициент равен НУЛЮ, значит квадратное слагаемое исчезает и от записи остаётся m плюс три — это линейное уравнение. А вопрос был про квадратное. Корень верный, тип уравнения нет.',
      'Minus three really does make this equation true: zero times nine is zero, minus three plus three is zero. But the leading coefficient is ZERO, so the squared term vanishes and what remains is m plus three — a linear equation. The question asked for a quadratic one. The root is right, the kind of equation is not.') },
    { when: (s) => s.picked === 2, text: L(
      "Bu tenglama kvadrat, lekin minus uch uning ildizi emas. Qo'yib ko'ring: minus uchning kvadrati arti to'qqiz, minus minus uch arti uch, minus olti. To'qqiz qo'shuv uch minus olti arti olti chiqadi, nol emas. Bu tenglamaning ildizlari uch va minus ikki.",
      'Это уравнение квадратное, но минус три не его корень. Подставь: минус три в квадрате плюс девять, минус минус три плюс три, минус шесть. Девять плюс три минус шесть даёт плюс шесть, а не нуль. Корни этого уравнения три и минус два.',
      'This equation is quadratic, but minus three is not its root. Substitute: minus three squared is plus nine, minus minus three is plus three, minus six. Nine plus three minus six gives plus six, not zero. The roots of this equation are three and minus two.') },
    { when: (s) => s.picked === 3, text: L(
      "Bu ham kvadrat tenglama, lekin ozod had va ikkinchi koeffitsiyent boshqa. Minus uchni qo'ying: to'qqiz qo'shuv yigirma yetti qo'shuv o'n sakkiz ellik to'rt chiqadi, nol emas. Bu tenglamaning ildizlari uch va olti — ikkalasi ham musbat.",
      'Это тоже квадратное уравнение, но свободный член и второй коэффициент другие. Подставь минус три: девять плюс двадцать семь плюс восемнадцать даёт пятьдесят четыре, а не нуль. Корни этого уравнения три и шесть — оба положительные.',
      'This is a quadratic equation too, but its second coefficient and constant term differ. Substitute minus three: nine plus twenty seven plus eighteen gives fifty four, not zero. The roots of this equation are three and six — both positive.') },
  ],
  wrongText: L(
    "Har variantda ikki ish qiling: bosh koeffitsiyent nolga tengmi va minus uchni qo'yganda yig'indi nol chiqadimi. Ikki shart birga bajarilishi kerak.",
    'С каждым вариантом делай два дела: проверь, не нуль ли старший коэффициент, и подставь минус три — выйдет ли нуль. Оба условия должны выполниться вместе.',
    'Do two things with every option: check whether the leading coefficient is zero, and substitute minus three to see whether the sum is zero. Both conditions must hold together.'),
};

export default function D15_09(props) { return <Choice data={DATA} {...props} />; }
