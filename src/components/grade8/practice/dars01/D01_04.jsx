// Dars01 · Amaliyot 04 — Pazl · 🟡 · tag: pair_ban
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots (yangi, 23-tip).
// Kontent: src/books/grade8/DARS01_AMALIYOT_KONTENT.md §04
//
// Oltita KVADRAT karta juftlanib uchta bo'sh kartaga o'tiradi: kasr va uning
// taqiqi. Uyalarning o'zaro tartibi ahamiyatsiz, juftlikning o'zi muhim.
// Ikki tuzoq: a + 5 ning noli MINUS beshda (ishora), va 2a ning noli nolda —
// ikkiga ko'paytirish yangi taqiq QO'SHMAYDI.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'pair_ban', level: '🟡',
  cards: [
    { id: 'f1', tokens: [{ n: '4', d: 'a − 8' }] },
    { id: 'f2', tokens: [{ n: '7', d: 'a + 5' }] },
    { id: 'f3', tokens: [{ n: '6', d: '2a' }] },
    { id: 'v1', v: 'a = 8' },
    { id: 'v2', v: 'a = −5' },
    { id: 'v3', v: 'a = 0' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Pastda oltita karta: uchtasida kasr, uchtasida qiymat. Har kasrning o'z taqiqi bor — ular juftlanib uchta bo'sh kartaga o'tiradi.",
    'Снизу шесть карточек: в трёх дроби, в трёх значения. У каждой дроби свой запрет — они собираются в пары и садятся в три пустые карточки.',
    'Six cards below: three hold fractions, three hold values. Every fraction has its own ban — they pair up and sit in the three empty cards.'),
  ask: L(
    "a ning qanday qiymatida kasr ma'noga ega emas? Kasrni bosing, keyin uyani bosing.",
    'При каком значении a дробь не имеет смысла? Нажми дробь, потом ячейку.',
    'At which value of a does the fraction have no value? Tap a fraction, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uchtasida ham chiziq tagi nolga tenglashtirildi: a minus sakkiz sakkizda nolga aylanadi, a qo'shuv besh minus beshda, ikki a esa nolda. Qo'yib tekshiring: minus beshda a qo'shuv besh nol bo'ladi, arti beshda esa o'n.",
    'Верно. Везде приравнивалось к нулю то, что под чертой: a минус восемь — при восьми, a плюс пять — при минус пяти, два a — при нуле. Проверь: при минус пяти a плюс пять даёт нуль.',
    'Correct. In all three what stands below the bar was set to zero: a minus eight becomes zero at eight, a plus five at minus five, two a at zero. Check by substituting: at minus five a plus five is zero, at plus five it is ten.'),
  wrongs: [
    { when: (s) => s.mate.f1 === 'v2' || s.mate.f2 === 'v1', text: L(
      "Ishorani tekshiring: a qo'shuv beshni nolga aylantirish uchun MINUS besh kerak, a minus sakkizni nolga aylantirish uchun esa arti sakkiz. Ikkalasini qo'yib ko'ring.",
      'Проверь знак: чтобы a плюс пять обратилось в нуль, нужно МИНУС пять, а чтобы a минус восемь — плюс восемь. Подставь оба.',
      'Check the sign: a plus five needs MINUS five to become zero, while a minus eight needs plus eight. Substitute both.') },
    { when: (s) => s.mate.f3 && s.mate.f3 !== 'v3', text: L(
      "Ikki a nolga faqat a nolda aylanadi: ikkiga ko'paytirish yangi taqiq qo'shmaydi. Nolni qo'ying — maxraj nol bo'ladi.",
      'Два a обращается в нуль только при a равном нулю: умножение на два нового запрета не добавляет. Подставь нуль — знаменатель станет нулём.',
      'Two a becomes zero only at a equal to zero: multiplying by two adds no new ban. Substitute zero and the denominator becomes zero.') },
    { when: (s) => s.mate.f1 === 'v3' || s.mate.f3 === 'v1', text: L(
      "a minus sakkizni nolga aylantirish uchun sakkiz kerak, nol emas: nolda bu maxraj minus sakkizga teng. Qo'yib tekshiring.",
      'Чтобы обратить a минус восемь в нуль, нужно восемь, а не нуль: при нуле этот знаменатель равен минус восьми. Проверь подстановкой.',
      'To make a minus eight zero you need eight, not zero: at zero this denominator equals minus eight. Check by substituting.') },
  ],
  wrongText: L(
    "Chiziq tagiga qaraysiz, uni nolga tenglaysiz, yechimni topasiz — kasr va qiymat kartasi shunda juft bo'ladi.",
    'Смотришь под черту, приравниваешь к нулю, решаешь — вот и пара для дроби.',
    'Look below the bar, set it to zero, solve it — that is the pair for the fraction.'),
};

export default function D01_04(props) { return <PairSlots data={DATA} {...props} />; }
