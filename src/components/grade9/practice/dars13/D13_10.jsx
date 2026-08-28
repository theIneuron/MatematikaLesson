// Dars13 · Amaliyot 10 — So'zlar · 🔴 · teg: javobni-masala-tiliga-qaytarmaslik
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> ClozeBank.
//
// Qoida darsning uchala tasdig'ini bir gapga yig'adi: belgilash, har
// shartning o'z tenglamasi, va shartga zid yechimni rad etish. Bankdagi
// uch tuzoq darsning uch aniq adashishiga tegadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'javobni-masala-tiliga-qaytarmaslik', level: '🔴',
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying.",
    'Правило урока записано, но три слова выпали. Поставь их из карточек снизу.',
    'The rule of the lesson is written down, but three words fell out. Put them back from the cards below.'),
  ask: L(
    "Kartani bosing, keyin bo'sh kartochkani bosing.",
    'Нажми карточку, потом пустую клетку.',
    'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  parts: [
    { text: L(
      "Masalani sistema orqali yechishda avval har bir noma'lum nimani anglatishi",
      'При решении задачи через систему сначала',
      'When solving a problem through a system, what each unknown means is') },
    { slot: 0 },
    { text: L(
      ". So'zdagi har bir shart",
      ', что означает каждое неизвестное. Каждое условие в тексте превращается в',
      'first. Each condition in the text becomes') },
    { slot: 1 },
    { text: L(
      "tenglamaga aylanadi. Matematik to'g'ri chiqqan yechim masala shartiga zid bo'lsa, u",
      'уравнение. Если математически верное решение противоречит условию задачи, его',
      'equation. If a mathematically correct solution contradicts the problem, it is') },
    { slot: 2 },
    { text: L('.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('belgilanadi', 'определяют', 'defined') },
    { id: 'w2', label: L('alohida', 'отдельное', 'a separate') },
    { id: 'w3', label: L('rad etiladi', 'отбрасывают', 'rejected') },
    { id: 'w4', label: L('taxmin qilinadi', 'угадывают', 'guessed') },
    { id: 'w5', label: L('bitta umumiy', 'одно общее', 'one common') },
    { id: 'w6', label: L('qabul qilinadi', 'принимают', 'accepted') },
  ],
  answer: ['w1', 'w2', 'w3'],
  correctText: L(
    "To'g'ri, uchala so'z ham joyida. Qoida darsning uchala ishini bir gapga yig'adi: harflar nimani bildirishi ISHNING BOSHIDA yoziladi, taxmin qilinmaydi; har bir shart o'z tenglamasini oladi, ikkitasi bitta tenglamaga siqilmaydi; va oxirida har bir yechim masalaning shartiga qaytariladi — matematik to'g'ri chiqqani ham zid bo'lsa rad etiladi.",
    'Верно, все три слова на месте. Правило собирает в одно предложение три дела урока: что означают буквы, записывают В НАЧАЛЕ работы, а не угадывают; каждое условие получает своё уравнение, два в одно не сжимаются; и в конце каждое решение возвращают в условие задачи — даже математически верное отбрасывается, если противоречит.',
    'Correct, all three words are in place. The rule gathers the three jobs of the lesson into one sentence: what the letters mean is written down AT THE START, not guessed; each condition gets its own equation, two are not squeezed into one; and at the end every solution goes back to the statement — even a mathematically correct one is rejected if it contradicts it.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Noma'lum taxmin qilinmaydi, belgilanadi. Taxmin bitta javob topishi mumkin, lekin boshqasi yo'qligini ko'rsatmaydi.",
      'Неизвестное не угадывают, а определяют. Угадывание может найти один ответ, но не покажет, что другого нет.',
      'An unknown is not guessed, it is defined. Guessing may find one answer but cannot show there is no other.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Ikki shart bitta tenglamaga siqilmaydi: har biri o'z tenglamasini beradi, va shu ikkitasidan sistema tuziladi.",
      'Два условия не сжимаются в одно уравнение: каждое даёт своё, и из этих двух составляется система.',
      'Two conditions do not squeeze into one equation: each gives its own, and the system is built from the two.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Zid yechim qabul qilinmaydi. Nol raqamlar yig'indisi bo'lolmaydi, manfiy son natural bo'lolmaydi — bunday nomzod tashlab yuboriladi.",
      'Противоречащее решение не принимают. Нуль не бывает суммой цифр, отрицательное число не бывает натуральным — такой кандидат отбрасывается.',
      'A contradicting solution is not accepted. Zero cannot be a digit sum, a negative number cannot be natural — such a candidate is thrown out.') },
  ],
  wrongText: L(
    "Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi ish boshida nima qilinishi haqida, ikkinchisi har shart nechta tenglama berishi haqida, uchinchisi esa zid yechim bilan nima qilinishi haqida.",
    'Проверяй каждую клетку самим предложением: первая про то, что делают в начале, вторая про то, сколько уравнений даёт каждое условие, третья про то, что делают с противоречащим решением.',
    'Check each blank against the sentence itself: the first is about what is done at the start, the second about how many equations each condition gives, the third about what is done with a contradicting solution.'),
};

export default function D13_10(props) { return <ClozeBank data={DATA} {...props} />; }
