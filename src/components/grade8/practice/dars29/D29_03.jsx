// Dars29 · Amaliyot 03 — Ildizlar · 🟢 · tag: abs_equation
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §11 (29-dars, 3-pozitsiya)
//
// T2: |x| = a (a > 0) tenglamaning IKKITA ildizi bor. З58 aynan shu yerda
// tug'iladi — javobda faqat musbat ildiz qoladi.
//
// Uch xato variant: faqat yetti (З58), faqat minus yetti (o'sha xatoning
// aksi), va «ildiz yo'q» (modul manfiy bo'lmaydi degan qoidani noto'g'ri
// joyga qo'llash — bu yerda o'ng tomon MUSBAT).
// Variantlar aralashtiriladi (Choice ichida), razbor shartlari ASL raqamda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'abs_equation', level: '🟢',
  correct: 0, optCols: 2, optSize: 19,
  expr: ['|x| = 7'], exprSize: 30,
  eyebrow: L('Ildizlar', 'Корни', 'Roots'),
  setup: L(
    "Modul — sonning noldan uzoqligi. Tenglama noldan yetti birlik uzoqlikda turgan sonlarni so'rayapti.",
    'Модуль — это удалённость числа от нуля. Уравнение спрашивает про числа, стоящие в семи единицах от нуля.',
    'The absolute value is a number\'s distance from zero. The equation asks for the numbers standing seven units away from zero.'),
  ask: L(
    'Bu tenglamaning ildizlari qaysi?',
    'Каковы корни этого уравнения?',
    'What are the roots of this equation?'),
  opts: [
    { label: ['7', ';', '−7'] },
    { label: ['7'] },
    { label: ['−7'] },
    { label: L("ildiz yo'q", 'корней нет', 'no roots') },
  ],
  correctText: L(
    "To'g'ri. Son o'qida noldan yetti birlik uzoqlikda IKKI nuqta bor: biri o'ngda, biri chapda. Shuning uchun tenglamaning ikkita ildizi bor — yetti va minus yetti. Tekshiring: yettining moduli yetti, minus yettining moduli ham yetti. Ikkalasi ham tenglamani to'g'ri qiladi, ya'ni ikkalasi ham javobga kiradi. Bu qoida modul o'ng tomonda MUSBAT son turganda har doim ishlaydi.",
    'Верно. На числовой прямой в семи единицах от нуля стоят ДВЕ точки: одна справа, другая слева. Поэтому у уравнения два корня — семь и минус семь. Проверь: модуль семи семь, модуль минус семи тоже семь. Оба обращают уравнение в верное, значит оба входят в ответ. Это правило работает всегда, когда справа от модуля стоит ПОЛОЖИТЕЛЬНОЕ число.',
    'Correct. On the number line there are TWO points seven units from zero: one to the right, one to the left. So the equation has two roots — seven and minus seven. Check: the absolute value of seven is seven, and of minus seven is seven too. Both satisfy the equation, so both belong to the answer. This rule always holds when a POSITIVE number stands on the right of the bars.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Yetti — ildiz, lekin u YAGONA emas. Modul noldan uzoqlikni beradi, uzoqlik esa yo'nalishni bilmaydi: minus yetti ham noldan yetti birlik uzoqda. Tekshiring: minus yettining moduli yetti, ya'ni u ham tenglamani to'g'ri qiladi. Javobda ikkala ildiz ham bo'lishi kerak.",
      'Семь — корень, но он НЕ ЕДИНСТВЕННЫЙ. Модуль даёт удалённость от нуля, а удалённость не знает направления: минус семь тоже отстоит от нуля на семь. Проверь: модуль минус семи семь, значит и он обращает уравнение в верное. В ответе должны быть оба корня.',
      'Seven is a root, but not the ONLY one. The absolute value gives a distance from zero, and a distance knows no direction: minus seven is also seven units from zero. Check: the absolute value of minus seven is seven, so it satisfies the equation as well. Both roots must be in the answer.') },
    { when: (s) => s.picked === 2, text: L(
      "Minus yetti — ildiz, lekin u ham yagona emas. Musbat yetti ham noldan yetti birlik uzoqda, va uning moduli ham yetti. Modul o'ng tomonda musbat son turgan tenglama har doim IKKI ildiz beradi — biri musbat, biri manfiy.",
      'Минус семь — корень, но и он не единственный. Положительная семёрка тоже отстоит от нуля на семь, и её модуль тоже семь. Уравнение с модулем и положительным числом справа всегда даёт ДВА корня — положительный и отрицательный.',
      'Minus seven is a root, but not the only one either. Positive seven is also seven units from zero, and its absolute value is seven too. An equation with an absolute value and a positive number on the right always gives TWO roots — one positive and one negative.') },
    { when: (s) => s.picked === 3, text: L(
      "Ildiz bor, va hatto ikkita. «Ildiz yo'q» degan javob o'ng tomonda MANFIY son turganda to'g'ri bo'lardi: modul manfiy bo'lmaydi, shuning uchun x ning moduli minus yettiga teng degan tenglamaning ildizi yo'q. Bu yerda esa o'ng tomonda musbat yetti turibdi.",
      'Корни есть, и даже два. Ответ «корней нет» был бы верен, если бы справа стояло ОТРИЦАТЕЛЬНОЕ число: модуль отрицательным не бывает, поэтому у уравнения модуль x равен минус семи корней нет. А здесь справа стоит положительная семёрка.',
      'There are roots, two of them. The answer «no roots» would be right if a NEGATIVE number stood on the right: an absolute value is never negative, so the equation absolute value of x equals minus seven has no roots. Here a positive seven stands on the right.') },
  ],
  wrongText: L(
    "Son o'qida noldan yetti birlik uzoqlikda nechta nuqta borligini o'ylang. Har javobni tenglamaga qo'yib tekshiring: modul ikkala ishorada ham bir xil natija beradi.",
    'Подумай, сколько точек стоит на числовой прямой в семи единицах от нуля. Проверь каждый ответ подстановкой: модуль даёт одинаковый результат при обоих знаках.',
    'Think how many points on the number line are seven units from zero. Check every answer by substitution: the absolute value gives the same result for both signs.'),
};

export default function D29_03(props) { return <Choice data={DATA} {...props} />; }
