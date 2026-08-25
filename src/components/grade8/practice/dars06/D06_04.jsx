// Dars06 · Amaliyot 04 — Pazl · 🟡 · tag: hidden_ban_rows
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Kontent: src/books/grade8/DARS06_AMALIYOT_KONTENT_V2.md §04
//
// Ilgari bu topshiriq `HoleSlider` da edi: oraliq satrning «teshigi»ni
// surgich bilan topish. Metodist qarori 2026-08-24: o'nta mexanika 1-darsdan
// olinadi, shuning uchun savol uchga ko'paytirildi va JUFTLASHGA aylandi.
//
// Uchala satr ham yechimning ORALIQ satri: ular hisob davomida paydo bo'ladi
// va yakuniy javobda ko'rinmaydi. Har biri o'z shartini tug'diradi:
//   (d²−4)/(d−2)  -> d ≠ 2
//   (d²−4)/(d+2)  -> d ≠ −2
//   (d²−4)/(4d)   -> d ≠ 0
// Surat uchalasida bir xil, ya'ni javobni faqat chiziq TAGI hal qiladi.
// Ikki tuzoq: ishora (2 va −2) va «suratga qarash» (d² − 4 ning noli).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'hidden_ban_rows', level: '🟡',
  cards: [
    { id: 'f1', tokens: [{ n: 'd²−4', d: 'd−2' }] },
    { id: 'f2', tokens: [{ n: 'd²−4', d: 'd+2' }] },
    { id: 'f3', tokens: [{ n: 'd²−4', d: '4d' }] },
    { id: 'v1', v: '2' },
    { id: 'v2', v: '−2' },
    { id: 'v3', v: '0' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uchala yozuv ham yechimning ORALIQ satri: ular hisob o'rtasida paydo bo'ladi va yakuniy javobda ko'rinmaydi.",
    'Все три записи — ПРОМЕЖУТОЧНЫЕ строки решения: они появляются по ходу счёта и в окончательном ответе не видны.',
    'All three records are INTERMEDIATE lines of a solution: they appear during the working and are invisible in the final answer.'),
  ask: L(
    "Har satr qanday d ni taqiqlashini toping: kartani bosing, keyin uyani bosing.",
    'Найди, какое d запрещает каждая строка: нажми карточку, потом ячейку.',
    'Find which d each line forbids: tap a card, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Surat uchalasida bir xil, demak javobni faqat chiziq TAGI hal qiladi: d minus ikki ikkida, d qo'shuv ikki minus ikkida, to'rt d esa nolda nolga aylanadi. Bu shartlar yechimning O'RTASIDA tug'iladi va tayyor javobda ko'rinmaydi — shuning uchun ularni alohida yozib qo'yish kerak.",
    'Верно. Числитель у всех трёх одинаков, значит решает только то, что ПОД чертой: d минус два — при двух, d плюс два — при минус двух, четыре d — при нуле. Эти условия рождаются В СЕРЕДИНЕ решения и в готовом ответе не видны — поэтому их выписывают отдельно.',
    'Correct. The numerator is the same in all three, so only what is BELOW the bar decides: d minus two at two, d plus two at minus two, four d at zero. These conditions are born IN THE MIDDLE of the solution and are invisible in the finished answer — that is why they are written out separately.'),
  wrongs: [
    { when: (s) => s.mate.f1 === 'v2' || s.mate.f2 === 'v1', text: L(
      "Ishorani tekshiring: d minus ikki nolga ARTI ikkida aylanadi, d qo'shuv ikki esa MINUS ikkida. Ikkalasini qo'yib ko'ring.",
      'Проверь знак: d минус два обращается в нуль при ПЛЮС двух, а d плюс два — при МИНУС двух. Подставь оба.',
      'Check the sign: d minus two becomes zero at PLUS two, and d plus two at MINUS two. Substitute both.') },
    { when: (s) => s.mate.f3 && s.mate.f3 !== 'v3', text: L(
      "Uchinchi satrning maxraji — to'rt d, va u nolda nolga aylanadi. To'rtga ko'paytirish yangi taqiq qo'shmaydi: taqiqni harfning o'zi beradi.",
      'Знаменатель третьей строки — четыре d, и он обращается в нуль при нуле. Умножение на четыре нового запрета не добавляет: запрет даёт сама буква.',
      'The denominator of the third line is four d, and it becomes zero at zero. Multiplying by four adds no new ban: the letter itself gives it.') },
    { when: (s) => s.mate.f1 === 'v3' || s.mate.f2 === 'v3', text: L(
      "Nol bu satrlarda taqiq emas: nolda d minus ikki minus ikkiga, d qo'shuv ikki esa ikkiga teng — ikkalasi ham nol emas. Chiziq tagini nolga tenglang.",
      'Нуль в этих строках не запрет: при нуле d минус два равно минус двум, а d плюс два — двум, и ни то, ни другое не нуль. Приравняй к нулю то, что под чертой.',
      'Zero is not a ban in these lines: at zero d minus two is minus two and d plus two is two, neither of them zero. Set what is below the bar to zero.') },
  ],
  wrongText: L(
    "Suratga qaramang — u uchalasida bir xil. Har satrning MAXRAJINI alohida nolga tenglang: shart o'sha yerdan chiqadi.",
    'На числитель не смотри — он у всех трёх одинаков. Приравняй к нулю ЗНАМЕНАТЕЛЬ каждой строки по отдельности: условие выходит оттуда.',
    'Ignore the numerator — it is the same in all three. Set the DENOMINATOR of each line to zero separately: that is where the condition comes from.'),
};

export default function D06_04(props) { return <PairSlots data={DATA} {...props} />; }
