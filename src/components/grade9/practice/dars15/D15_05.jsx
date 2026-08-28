// Dars15 · Amaliyot 05 — Javobni kiritish · 🟡 · teg: toliq-korpaytirmaslik
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> TypeSet.
//
// MATEMATIKA: x³ − 4x² + 3x = x(x² − 4x + 3) = x(x − 1)(x − 3).
// Ildizlari: 0, 1, 3. Asosiy tuzoq — ifodani iksga BO'LIB yuborish:
// u holda nol yo'qoladi va ildiz ikkita bo'lib qoladi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { TypeSet } from '../asboblar9.jsx';

const DATA = {
  tag: 'toliq-korpaytirmaslik', level: '🟡',
  eyebrow: L('Ildizlar', 'Корни', 'Roots'),
  setup: L(
    "Avval umumiy ko'paytuvchini qavsdan chiqaring, keyin qavs ichidagini ko'paytuvchilarga ajratib oling.",
    'Сначала вынеси общий множитель за скобку, потом разложи то, что в скобке.',
    'First take the common factor out of the bracket, then factor what is left inside.'),
  ask: L(
    "Tenglamaning BARCHA ildizlarini yozing.",
    'Запиши ВСЕ корни уравнения.',
    'Write down ALL roots of the equation.'),
  hint: L(
    "Nuqta-vergul bilan ajrating.",
    'Раздели точкой с запятой.',
    'Separate them with semicolons.'),
  placeholder: '0; 0; 0',
  givenLabel: L('Tenglama', 'Уравнение', 'Equation'),
  given: [['x³ − 4x² + 3x = 0']],
  answer: [0, 1, 3],
  correctText: L(
    "To'g'ri: nol, bir va uch. Iksni qavsdan chiqarsak, iks karra iks kvadrat minus to'rt iks qo'shuv uch nolga teng bo'ladi; qavs ichidagi uch had esa iks minus bir karra iks minus uchga ajraladi. Uchta ko'paytuvchi — uchta ildiz. Ifodani iksga BO'LIB yuborish mumkin emas: iks nolga teng bo'lishi ham mumkin, va bo'lish aynan shu ildizni o'chirib tashlaydi.",
    'Верно: нуль, один и три. Вынеся икс за скобку, получим икс на икс в квадрате минус четыре икс плюс три равно нулю; а трёхчлен в скобке раскладывается на икс минус один и икс минус три. Три множителя — три корня. Делить выражение на икс нельзя: икс может быть равен нулю, и деление стирает именно этот корень.',
    'Correct: zero, one and three. Taking x out gives x times x squared minus four x plus three equals zero; and the trinomial in the bracket factors into x minus one and x minus three. Three factors — three roots. The expression must not be DIVIDED by x: x may be zero, and dividing erases exactly that root.'),
  wrongs: [
    { when: (s) => s.size === 2 && s.has(1) && s.has(3), text: L(
      "Nol tushib qoldi — ifoda iksga bo'lib yuborilgan. Iks nolga teng bo'lganda tenglama bajariladi: nol minus nol qo'shuv nol nolga teng. Nolga bo'lish taqiqlangani uchun umumiy ko'paytuvchi QAVSDAN CHIQARILADI, bo'linmaydi.",
      'Нуль потерян — выражение поделили на икс. При иксе, равном нулю, уравнение выполняется: нуль минус нуль плюс нуль равно нулю. Так как на нуль делить нельзя, общий множитель ВЫНОСЯТ за скобку, а не сокращают.',
      'The zero was lost — the expression was divided by x. At x equal to zero the equation holds: zero minus zero plus zero is zero. Since division by zero is forbidden, a common factor is TAKEN OUT of the bracket, never cancelled.') },
    { when: (s) => s.size === 1, text: L(
      "Bitta ildiz yozildi. Uchinchi darajali tenglamada uchta ildiz bo'lishi mumkin: ifodani oxirigacha ko'paytuvchilarga ajratib chiqing.",
      'Записан один корень. У уравнения третьей степени может быть три корня: разложи выражение на множители до конца.',
      'One root was written. A cubic can have three roots: factor the expression all the way.') },
    { when: (s) => s.has(4), text: L(
      "To'rt — iks kvadratning oldidagi koeffitsient, ildiz emas. To'rtni tenglamaga qo'yib ko'ring: oltmish to'rt minus oltmish to'rt qo'shuv o'n ikki, ya'ni o'n ikki, nol emas.",
      'Четыре — коэффициент при икс в квадрате, а не корень. Подставь четыре в уравнение: шестьдесят четыре минус шестьдесят четыре плюс двенадцать — двенадцать, а не нуль.',
      'Four is the coefficient of x squared, not a root. Substitute four into the equation: sixty-four minus sixty-four plus twelve is twelve, not zero.') },
    { when: (s) => s.has(-1) || s.has(-3), text: L(
      "Ishora almashdi. Qavslar iks minus bir va iks minus uch, ya'ni ildizlar MUSBAT bir va uch. Minus birni qo'yib ko'ring: minus bir minus to'rt minus uch, ya'ni minus sakkiz.",
      'Сбился знак. Скобки — икс минус один и икс минус три, значит корни ПОЛОЖИТЕЛЬНЫЕ один и три. Подставь минус один: минус один минус четыре минус три, то есть минус восемь.',
      'A sign slipped. The brackets are x minus one and x minus three, so the roots are POSITIVE one and three. Substitute minus one: minus one minus four minus three, that is minus eight.') },
  ],
  wrongText: L(
    "Umumiy ko'paytuvchi iksni qavsdan chiqaring, so'ng qavs ichidagi uch hadni ko'paytuvchilarga ajratib oling. Har bir ko'paytuvchi bittadan ildiz beradi — iksning o'zi ham.",
    'Вынеси общий множитель икс за скобку, потом разложи трёхчлен в скобке на множители. Каждый множитель даёт по корню — и сам икс тоже.',
    'Take the common factor x out of the bracket, then factor the trinomial inside. Each factor gives one root — including x itself.'),
};

export default function D15_05(props) { return <TypeSet data={DATA} {...props} />; }
