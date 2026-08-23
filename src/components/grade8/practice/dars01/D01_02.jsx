// Dars01 * Amaliyot 02 -- Nol chiziqning qaysi tomonida * 🟢 * tag: zero_side
// Faqat MA'LUMOT. Tip: kit.jsx -> YesNo (ha/yo'q + dalil son bilan).
// TASDIQ 3 + ADASHISH Z18 (suratdagi va maxrajdagi nol aralashtiriladi).
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { YesNo, L } from '../kit.jsx';

const DATA = {
  tag: 'zero_side', level: '🟢',
  eyebrow: L('Surat va maxrajdagi nol', 'Нуль в числителе и знаменателе', 'Zero above and below the bar'),
  varName: 'x',
  left: 'x/x',
  proofRef: '0',
  right: false,
  expr: [{ n: 'x', d: 'x' }],
  exprSize: 30,
  claim: L(
    "x = 0 da x/x kasrining qiymati har doim 0.",
    'При x = 0 значение дроби x/x всегда равно 0.',
    'At x = 0 the value of the fraction x/x always equals 0.',
  ),
  yesLabel: L("To'g'ri", 'Верно', 'True'),
  noLabel: L("Noto'g'ri", 'Неверно', 'False'),
  proofAsk: L(
    "Qaysi qiymatda tekshirdingiz? Sonni yozing.",
    'При каком значении ты это проверил? Впиши число.',
    'At which value did you check it? Type the number.',
  ),
  hintsPick: {
    yes: L(
      "Suratdagi nol bilan maxrajdagi nol BIR XIL joyda paydo bo'lishi ham mumkin. O'sha joyda kasrning UMUMAN qiymati yo'q.",
      'Нуль в числителе и нуль в знаменателе могут появиться В ОДНОЙ И ТОЙ ЖЕ точке. Там у дроби значения нет ВООБЩЕ.',
      'A zero above the bar and a zero below it can appear at the SAME point. There the fraction has NO value at all.',
    ),
    no: L(
      "Da'vo shu misolda haqiqatan buziladi -- endi buni SON bilan ko'rsating.",
      'Утверждение в этом примере действительно нарушается -- теперь покажи это ЧИСЛОМ.',
      'The claim really does break in this example -- now show it with a NUMBER.',
    ),
  },
  proofWrong: L(
    "Bu qiymatda kasr hisoblanadi va uni da'voni buzish uchun ishlatib bo'lmaydi. Maxrajni nolga aylantiradigan qiymatni oling.",
    'При этом значении дробь считается, и его нельзя использовать, чтобы нарушить утверждение. Возьми значение, обращающее знаменатель в нуль.',
    'At this value the fraction computes, so it cannot break the claim. Take the value that makes the denominator zero.',
  ),
  correctText: L(
    "To'g'ri. x = 0 da suratda HAM, maxrajda HAM nol turadi, ya'ni kasrning umuman qiymati yo'q -- u nolga teng emas.",
    'Верно. При x = 0 нуль стоит И в числителе, И в знаменателе, значит у дроби вообще нет значения -- она не равна нулю.',
    'Correct. At x = 0 there is a zero BOTH above and below the bar, so the fraction has no value at all -- it is not zero.',
  ),
};

export default function D01_02(props) { return <YesNo data={DATA} {...props} />; }
