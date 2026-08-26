// Dars55 · Amaliyot 07 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §7 (55-dars, 7-pozitsiya)
//
// T1 va T3 bitta gapga yig'ilgan. Bankdagi tuzoqlar:
//   ikki so'zni ALMASHTIRISH  -> З116
//   «vektor», «juftlik»       -> З117
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      "Vektorning koordinatalari uning",
      'Координаты вектора получаются вычитанием координат его',
      "A vector's coordinates come from subtracting the coordinates of its") },
    { slot: 0 },
    { text: L(
      "koordinatalaridan",
      'из координат его', 'from the coordinates of its') },
    { slot: 1 },
    { text: L(
      "koordinatalarini ayirish bilan topiladi. Skalyar ko'paytmaning natijasi esa",
      '. А результат скалярного произведения это', '. And the result of a dot product is') },
    { slot: 2 },
    { text: L("bo'ladi.", '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('oxiri', 'конца', 'end') },
    { id: 'w2', label: L('boshi', 'начала', 'start') },
    { id: 'w3', label: L('son', 'число', 'a number') },
    { id: 'w4', label: L('vektor', 'вектор', 'a vector') },
    { id: 'w5', label: L('juftlik', 'пара чисел', 'a pair of numbers') },
    { id: 'w6', label: L('modul', 'модуль', 'a modulus') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning ikki qoidasi bitta gapga yig'ilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta. Diqqat: birinchi ikki bo'shliqqa ikkala karta ham tili bo'yicha tushadi, lekin ularni almashtirish javobni teskarilaydi.",
    'Два правила урока собраны в одно предложение, но три слова выпали. В банке шесть карточек. Внимание: в первые два пропуска по языку подходят обе карточки, но если их поменять местами, ответ развернётся.',
    'Two rules of the lesson are gathered into one sentence, but three words have dropped out. The bank holds six cards. Note: both cards fit the first two gaps by language, but swapping them reverses the answer.'),
  ask: L(
    "Bo'sh joyni bosing, keyin so'zni bosing.",
    'Нажми пропуск, потом слово.',
    'Tap a gap, then a word.'),
  bank: L("So'zlar", 'Слова', 'Words'),
  correctText: L(
    "To'g'ri. Tartibni eslab qolish uchun ma'noga qarang: vektor bu SURILISH, ya'ni boshdan oxirga o'tish. Surilishni topish uchun kelgan joydan ketgan joyni ayirasiz, ya'ni oxirdan boshni. Uchinchi so'z esa boshqa qoida haqida: skalyar ko'paytmada ikki ko'paytma QO'SHILADI, va qo'shilgandan keyin bitta son qoladi. Aynan shuning uchun u skalyar, ya'ni sonli deb ataladi.",
    'Верно. Чтобы запомнить порядок, посмотри на смысл: вектор это СМЕЩЕНИЕ, то есть переход от начала к концу. Чтобы найти смещение, из того, куда пришли, вычитают то, откуда вышли, то есть из конца начало. А третье слово о другом правиле: в скалярном произведении два произведения СКЛАДЫВАЮТСЯ, и после сложения остаётся одно число. Именно поэтому оно и называется скалярным, то есть числовым.',
    'Correct. To remember the order, look at the meaning: a vector is a SHIFT, the move from the start to the end. To find a shift you subtract where you left from where you arrived, that is, the start from the end. The third word is about a different rule: in a dot product the two products are ADDED, and after the addition one number remains. That is exactly why it is called scalar, that is, numerical.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w2', text: L(
      "Birinchi ikki so'z almashib ketdi, va bu darsning eng qimmat xatosi. Gap endi boshdan oxirni ayirishni aytmoqda, natijada esa QARAMA-QARSHI vektor chiqadi. Tekshirishning oson yo'li: boshning koordinatalariga topilgan vektorni qo'shsangiz, aynan oxiri chiqishi kerak.",
      'Первые два слова поменялись местами, и это самая дорогая ошибка урока. Теперь предложение велит вычитать из начала конец, а в результате получается ПРОТИВОПОЛОЖНЫЙ вектор. Простая проверка: прибавь найденный вектор к координатам начала — должен получиться ровно конец.',
      'The first two words swapped places, and this is the costliest error of the lesson. The sentence now says to subtract the end from the start, and the result is the OPPOSITE vector. An easy check: add the found vector to the start coordinates and exactly the end must come out.') },
    { when: (s) => s.slots[2] === 'w4' || s.slots[2] === 'w5', text: L(
      "Uchinchi bo'shliqda vektor yoki juftlik turibdi. Skalyar ko'paytmaning natijasi SON: ikki ko'paytma hisoblanadi va ular qo'shiladi, ya'ni oxirida bitta son qoladi, ikkitasi emas. Bu darsning eng ko'p uchraydigan chalkashligi — o'quvchi vektor amali vektor beradi deb kutadi.",
      'В третьем пропуске стоит вектор или пара. Результат скалярного произведения это ЧИСЛО: считаются два произведения и складываются, значит в конце остаётся одно число, а не два. Это самая частая путаница урока — ученик ждёт, что действие над векторами даст вектор.',
      'The third gap holds a vector or a pair. The result of a dot product is a NUMBER: two products are computed and added, so one number remains at the end, not two. This is the most common confusion of the lesson — the student expects an operation on vectors to give a vector.') },
    { when: (s) => s.slots.indexOf('w6') !== -1, text: L(
      "Modul — bu boshqa narsa. Modul BITTA vektordan hisoblanadi va uning uzunligini beradi; skalyar ko'paytma esa IKKI vektordan hisoblanadi. Ikkalasining natijasi ham son, lekin ular boshqa savolga javob beradi.",
      'Модуль это другое. Модуль считается по ОДНОМУ вектору и даёт его длину; а скалярное произведение считается по ДВУМ. Результат у обоих число, но отвечают они на разные вопросы.',
      'A modulus is something else. A modulus is computed from ONE vector and gives its length; a dot product is computed from TWO. Both results are numbers, but they answer different questions.') },
  ],
  wrongText: L(
    "Oxirdan boshni ayiring. Skalyar ko'paytmaning natijasi son.",
    'Из конца вычти начало. Результат скалярного произведения число.',
    'Subtract the start from the end. The result of a dot product is a number.'),
};

export default function D55_07(props) { return <ClozeBank data={DATA} {...props} />; }
