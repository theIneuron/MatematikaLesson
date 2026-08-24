// Dars10 · Amaliyot 06 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §8 (10-dars, 6-pozitsiya)
//
// Darsning uch tasdig'i bitta gapda: modul, ildiz ostining sharti va
// tenglama bilan ildiz belgisining farqi. Bankdagi uch tuzoq aynan uch
// adashish: «o'zini» (З31), «musbat» (nolni tashlaydi), «ikkita» (З29).
//
// MUHIM: kartalar SO'Z, ya'ni `L()` ICHIDA. `parts` uch tilda BIR XIL
// shaklda: matn, uya, matn, uya, matn, uya, matn.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      'Kvadratdan olingan ildiz sonning',
      'Корень из квадрата даёт не само число, а его',
      'The root of a square gives not the number itself but its') },
    { slot: 0 },
    { text: L(
      "beradi, o'zini emas. Ildiz ostidagi ifoda esa",
      '. А подкоренное выражение обязано быть',
      '. The radicand itself must be') },
    { slot: 1 },
    { text: L(
      "bo'lishi shart. x kvadrati a ga teng tenglamada ikki javob bor, ildiz belgisi esa",
      '. У уравнения x² = a два ответа, а знак корня даёт',
      '. The equation x² = a has two answers, while the root sign gives') },
    { slot: 2 },
    { text: L('son beradi.', 'число.', 'number.') },
  ],
  cards: [
    { id: 'w1', label: L('modulini', 'модуль', 'modulus') },
    { id: 'w2', label: L('nomanfiy', 'неотрицательным', 'non-negative') },
    { id: 'w3', label: L('bitta', 'одно', 'one') },
    { id: 'w4', label: L('kvadratini', 'квадрат', 'square') },
    { id: 'w5', label: L('musbat', 'положительным', 'positive') },
    { id: 'w6', label: L('ikkita', 'два', 'two') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying.",
    'Правило урока записано, но три слова выпали. Поставь их из карточек снизу.',
    'The rule of the lesson is written down, but three words fell out. Put them back from the cards below.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uch fakt bir gapda. Minus beshning kvadratidan ildiz besh, ya'ni modul. Ildiz osti nomanfiy bo'lishi kerak — nol ham mumkin, shuning uchun «musbat» emas. Tenglamada ikki javob bor, chunki ikki sonning kvadrati bir xil; ildiz belgisi esa ulardan nomanfiyini tanlaydi va bitta son beradi.",
    'Верно. Три факта в одном предложении. Корень из квадрата минус пяти равен пяти, то есть модулю. Подкоренное обязано быть неотрицательным — нуль тоже подходит, поэтому не «положительным». У уравнения два ответа, ведь квадраты двух чисел совпадают; а знак корня выбирает из них неотрицательное и даёт одно число.',
    'Correct. Three facts in one sentence. The root of the square of minus five is five, that is the modulus. The radicand must be non-negative — zero is allowed, so not positive. The equation has two answers because two numbers share a square; the root sign picks the non-negative one and gives a single number.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Kvadrat bu yerda allaqachon yozuvda turadi: ildiz uni YECHADI, yana qo'shmaydi. Minus beshni qo'ying: kvadrati yigirma besh, ildizi besh — bu minus beshning moduli.",
      'Квадрат здесь уже стоит в записи: корень его СНИМАЕТ, а не добавляет ещё один. Подставь минус пять: квадрат двадцать пять, корень пять — это модуль минус пяти.',
      'The square is already in the record: the root UNDOES it rather than adding another. Substitute minus five: the square is twenty five, the root is five — that is the modulus of minus five.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Musbat so'zi nolni chetlab o'tadi, nol esa ruxsat etilgan: noldan ildiz nolga teng. Shuning uchun shart nomanfiy deb yoziladi.",
      'Слово положительным отбрасывает нуль, а нуль разрешён: корень из нуля равен нулю. Поэтому условие пишется как неотрицательное.',
      'The word positive throws away zero, yet zero is allowed: the root of zero is zero. That is why the condition is written as non-negative.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Ikkita javob TENGLAMAGA tegishli, gapning bu qismi esa ildiz BELGISI haqida. Belgi nomanfiy sonni tanlaydi, ya'ni bitta son beradi — aks holda ildizlarni qo'shib bo'lmas edi.",
      'Два ответа относятся к УРАВНЕНИЮ, а эта часть предложения про ЗНАК корня. Знак выбирает неотрицательное число, то есть даёт одно — иначе корни нельзя было бы складывать.',
      'Two answers belong to the EQUATION, while this part of the sentence is about the root SIGN. The sign picks the non-negative number, that is one number — otherwise roots could not be added.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankdagi uch tuzoq gapga so'z bo'yicha to'g'ri keladi, matematika bo'yicha esa yo'q. Har birini minus besh bilan tekshiring.",
      'Три ловушки в банке подходят к предложению по языку, но не по математике. Проверь каждую на минус пяти.',
      'The three traps in the bank fit the sentence by language but not by mathematics. Test each one on minus five.') },
  ],
  wrongText: L(
    "Qoidani minus besh bilan tekshiring: kvadratga oshiring, keyin ildiz oling. Javob nimaga teng chiqdi?",
    'Проверь правило на минус пяти: возведи в квадрат, потом возьми корень. Чему равен ответ?',
    'Test the rule on minus five: square it, then take the root. What did the answer come out to be?'),
};

export default function D10_06(props) { return <ClozeBank data={DATA} {...props} />; }
