// Dars17 · Amaliyot 04 — Javobni kiritish · 🟡 · teg: nollarni-toliq-belgilamaslik
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> TypeSet.
//
// MATEMATIKA: (x² − 1)/(x − 6). Surat nollari: x² − 1 = 0, ya'ni −1 va 1.
// Maxraj noli: 6. O'qqa UCHALA nuqta ham qo'yiladi — ikki xil qoida
// bilan, lekin uchalasi ham belgilanadi. Asosiy tuzoq — maxraj nolini
// «bu ildiz emas» deb tashlab ketish.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { TypeSet } from '../asboblar9.jsx';

const DATA = {
  tag: 'nollarni-toliq-belgilamaslik', level: '🟡',
  eyebrow: L('Nol nuqtalar', 'Нулевые точки', 'Zero points'),
  setup: L(
    "Oraliqlar usuli uchun o'qqa surat va maxrajning HAMMA nol nuqtalari qo'yiladi.",
    'Для метода интервалов на ось наносят ВСЕ нулевые точки числителя и знаменателя.',
    'For the interval method ALL zero points of the numerator and denominator go on the axis.'),
  ask: L(
    "Surat va maxrajning BARCHA nol nuqtalarini yozing.",
    'Запиши ВСЕ нулевые точки числителя и знаменателя.',
    'Write down ALL zero points of the numerator and the denominator.'),
  hint: L(
    "Nuqta-vergul bilan ajrating.",
    'Раздели точкой с запятой.',
    'Separate them with semicolons.'),
  placeholder: '0; 0; 0',
  givenLabel: L('Kasr', 'Дробь', 'Fraction'),
  given: [['(x² − 1)/(x − 6)']],
  answer: [-1, 1, 6],
  correctText: L(
    "To'g'ri: minus bir, bir va olti. Surat iks minus bir karra iks qo'shuv birga ajraladi, demak uning nollari minus bir va bir; maxrajning noli esa olti. Uchalasi ham o'qqa qo'yiladi, chunki har uchtasida ham ifoda ishorasini almashtirishi mumkin. Lekin ular ikki xil: surat nollari qat'iy emas tengsizlikda javobga kiradi, olti esa hech qachon kirmaydi.",
    'Верно: минус один, один и шесть. Числитель раскладывается на икс минус один и икс плюс один, значит его нули — минус один и один; а нуль знаменателя — шесть. Все три наносят на ось, ведь в каждой из них выражение может сменить знак. Но они разного рода: нули числителя в нестрогом неравенстве в ответ входят, а шестёрка не входит никогда.',
    'Correct: minus one, one and six. The numerator factors into x minus one and x plus one, so its zeros are minus one and one; the zero of the denominator is six. All three go on the axis, since the expression may change sign at each. But they are of two kinds: the numerator zeros belong in the answer of a non-strict inequality, while six never does.'),
  wrongs: [
    { when: (s) => s.size === 2 && s.has(-1) && s.has(1), text: L(
      "Maxrajning noli tushib qoldi. Olti ham o'qqa qo'yiladi: u yerda kasrning qiymati yo'q, va ifoda aynan shu nuqtada ishorasini almashtirishi mumkin.",
      'Нуль знаменателя потерян. Шесть тоже наносят на ось: там у дроби нет значения, и знак выражения может смениться именно в этой точке.',
      'The zero of the denominator was lost. Six goes on the axis too: the fraction has no value there, and the sign may change at exactly that point.') },
    { when: (s) => s.size === 2 && s.has(1) && s.has(6), text: L(
      "Suratning ikkinchi noli tushib qoldi. Iks kvadrat minus bir ikkita ko'paytuvchiga ajraladi: iks minus bir va iks qo'shuv bir, ya'ni ikkita nol.",
      'Второй нуль числителя потерян. Икс в квадрате минус один раскладывается на два множителя: икс минус один и икс плюс один, то есть два нуля.',
      'The second zero of the numerator was lost. x squared minus one factors into two brackets: x minus one and x plus one, that is two zeros.') },
    { when: (s) => s.size === 1, text: L(
      "Bitta nuqta yozildi. Suratda ikkita nol, maxrajda bitta — hammasi uchta.",
      'Записана одна точка. У числителя два нуля, у знаменателя один — всего три.',
      'One point was written. The numerator has two zeros, the denominator one — three in all.') },
    { when: (s) => s.has(-6), text: L(
      "Maxrajning ishorasi teskari o'qildi. Iks minus olti nolga aylanishi uchun iks OLTIGA teng bo'lishi kerak.",
      'Знак знаменателя прочитан наоборот. Чтобы икс минус шесть обратилось в нуль, икс должен быть равен ШЕСТИ.',
      'The sign of the denominator was read backwards. For x minus six to become zero, x must equal SIX.') },
  ],
  wrongText: L(
    "Ikkita ishni alohida qiling: suratni nolga tenglashtirib ko'paytuvchilarga ajratib chiqing, va maxrajni ham nolga tenglashtiring. Hamma nuqtani birga yozing.",
    'Сделай две работы по отдельности: приравняй числитель к нулю и разложи на множители, и приравняй к нулю знаменатель. Запиши все точки вместе.',
    'Do two things separately: set the numerator to zero and factor it, and set the denominator to zero as well. Write down all the points together.'),
};

export default function D17_04(props) { return <TypeSet data={DATA} {...props} />; }
