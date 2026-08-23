// Dars01 * Amaliyot 09 -- Birinchi noto'g'ri satr * 🔴 * tag: first_wrong_line
// Faqat MA'LUMOT. Tip: kit.jsx -> Audit (satr + kontrprimer).
// Ko'paytuvchi -- to'qqiz: nazariyaning x(x-3) namunasidan BOSHQA son.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Audit, L } from '../kit.jsx';

const DATA = {
  tag: 'first_wrong_line', level: '🔴',
  eyebrow: L('Tayyor yechim', 'Готовое решение', 'A ready solution'),
  setup: L(
    "Yechim to'liq emas -- bitta satrda xato.",
    'Решение неполное -- ошибка в одной строке.',
    'The solution is incomplete -- one line is wrong.',
  ),
  expr: [{ n: '7', d: 'x · x − 9x' }],
  exprSize: 26,
  rows: [
    { id: 'r1', show: 'x · x − 9x = 0' },
    { id: 'r2', show: 'x (x − 9) = 0' },
    { id: 'r3', show: 'x − 9 = 0' },
    { id: 'r4', show: 'x = 9' },
    { id: 'r5', show: 'x != 9' },
  ],
  answerId: 'r3',
  proof: { of: '7/(x·x − 9·x)', varName: 'x', but: [9], label: L('son', 'число', 'number') },
  hints: {
    r1: L("Birinchi satr to'g'ri.", 'Первая строка верна.', 'The first line is right.'),
    r2: L("Ikkinchi satr ham to'g'ri: x qavsdan tashqariga chiqarilgan.", 'Вторая строка тоже верна: x вынесен за скобку.', 'The second line is right too: x was factored out.'),
    r4: L("To'rtinchi satr uchinchisidan to'g'ri chiqadi. Xato undan OLDIN.", 'Четвёртая строка верно следует из третьей. Ошибка РАНЬШЕ.', 'The fourth line follows correctly. The error is EARLIER.'),
    r5: L("Beshinchi satr to'g'ri. Xato yuqorida.", 'Пятая строка верна. Ошибка выше.', 'The fifth line is right. The error is higher up.'),
  },
  proofAlready: L(
    "Bu qiymatni yechimning o'zi taqiqlagan, ya'ni u dalil emas. Yechim RUXSAT BERGAN, lekin kasr hisoblanmaydigan sonni oling.",
    'Это значение решение и так запретило, значит оно не улика. Возьми число, которое решение РАЗРЕШИЛО, а дробь при нём не считается.',
    'The solution already excluded this value, so it proves nothing. Take a number the solution ALLOWED where the fraction still fails.',
  ),
  proofWrong: L(
    "Satr to'g'ri topildi. Endi son kerak: yechim RUXSAT ETGAN, lekin maxrajni nolga aylantiradigan qiymat.",
    'Строка найдена верно. Теперь нужно число: значение, которое решение РАЗРЕШИЛО, а знаменатель при нём обращается в нуль.',
    'The line is found. Now the number: a value the solution ALLOWED where the denominator still becomes zero.',
  ),
  correctText: L(
    "To'g'ri. 3-satrda x ko'paytuvchisi tashlab ketilgan: ko'paytma x = 0 da ham nolga aylanadi. Javob: x != 0 va x != 9.",
    'Верно. В строке 3 отброшен множитель x: произведение обращается в нуль и при x = 0. Ответ: x != 0 и x != 9.',
    'Correct. Line 3 dropped the factor x: the product vanishes at x = 0 too. The answer is x != 0 and x != 9.',
  ),
  wrongText: L(
    "Har satrni yuqoridagisidan kelib chiqadimi deb tekshiring.",
    'Проверяй каждую строку: следует ли она из строки выше.',
    'Check each line against the one above it.',
  ),
};

export default function D01_09(props) { return <Audit data={DATA} {...props} />; }
