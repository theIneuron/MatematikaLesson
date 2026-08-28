// Dars12 · Amaliyot 08 — So'zlar · 🔴 · teg: yigindini-yakuniy-javob-deb-olish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> ClozeBank.
//
// Qoida darsning uchala tasdig'ini bir gapga yig'adi. Bankdagi uch tuzoq
// darsning uch aniq adashishiga tegadi: «ikkilanadi» (yo'qotish qoidasi),
// «yakuniy javob» (yig'indini javob deb olish), «faqat bitta» (ikkinchi
// yechimni tashlab ketish).
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'yigindini-yakuniy-javob-deb-olish', level: '🔴',
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
      "Qo'shish usulida ikkala tenglama qo'shiladi: qarama-qarshi ishorada turgan had",
      'В способе сложения оба уравнения складываются: слагаемое с противоположными знаками',
      'In the addition method both equations are added: the term with opposite signs') },
    { slot: 0 },
    { text: L(
      ". Qo'shishdan keyin topilgan natija",
      '. Найденный после сложения результат —',
      '. The result found after adding is') },
    { slot: 1 },
    { text: L(
      ", u yana bir tenglamaga qo'yiladi. Kvadrat tenglamaning ikkita ildizi bo'lsa,",
      ', его подставляют ещё в одно уравнение. Если у квадратного уравнения два корня,',
      ', it is substituted into one more equation. If the quadratic has two roots,') },
    { slot: 2 },
    { text: L('.', '.', '.') },
  ],
  // KARTALAR QISQA. Uzunroq variant telefonda RU tilida kadrdan 12px
  // chiqib ketardi (tekshiruv 2026-08-28): olti karta uch qatorga
  // yoyilardi. Ma'no o'sha, so'zlar kam.
  cards: [
    { id: 'w1', label: L("yo'qoladi", 'исчезает', 'disappears') },
    { id: 'w2', label: L("hali javob emas", 'ещё не ответ', 'not the answer yet') },
    { id: 'w3', label: L('ikkalasi ham yoziladi', 'записывают оба', 'both are written down') },
    { id: 'w4', label: L('ikkilanadi', 'удваивается', 'doubles') },
    { id: 'w5', label: L('allaqachon javob', 'уже ответ', 'already the answer') },
    { id: 'w6', label: L('faqat bittasi yoziladi', 'записывают только одно', 'only one is written down') },
  ],
  answer: ['w1', 'w2', 'w3'],
  correctText: L(
    "To'g'ri, uchala so'z ham joyida. Qoida darsning uchala ishini bir gapga yig'adi: qarama-qarshi ishorada turgan had qo'shganda yo'qoladi, bir xil ishorada turgani esa ikkilanadi; qo'shishdan chiqqan natija — masalan iks qo'shi igrek yoki iks kvadrat — hali javob emas, uni yana bir tenglamaga qo'yish kerak; va kvadrat tenglama ikkita ildiz bergan joyda sistemaning ham ikkita yechimi bo'ladi, ikkalasi ham yoziladi.",
    'Верно, все три слова на месте. Правило собирает в одно предложение три дела урока: слагаемое с противоположными знаками при сложении исчезает, а с одинаковыми — удваивается; результат сложения, скажем икс плюс игрек или икс в квадрате, это ещё не ответ, его надо подставить ещё в одно уравнение; и там, где квадратное уравнение дало два корня, у системы тоже два решения, и записывают оба.',
    'Correct, all three words are in place. The rule gathers the three jobs of the lesson into one sentence: a term with opposite signs vanishes when added, one with the same sign doubles; the result of adding — say x plus y, or x squared — is not an answer yet and must go into one more equation; and where the quadratic gave two roots, the system has two solutions too, and both are written down.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Ikkilanish bir xil ishorada turgan had bilan bo'ladi: iks qo'shuv iks ikki iks. Qarama-qarshi ishorada esa nol chiqadi.",
      'Удваивается слагаемое с одинаковым знаком: икс плюс икс — два икса. А с противоположными знаками получается нуль.',
      'Doubling happens to a term with the same sign: x plus x is two x. With opposite signs the result is zero.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Qo'shishdan keyin faqat BITTA son topiladi, javob esa juftlik. Shuning uchun natija tenglamaga qaytariladi.",
      'После сложения находится только ОДНО число, а ответ — пара. Поэтому результат возвращают в уравнение.',
      'Adding gives only ONE number, while the answer is a pair. That is why the result goes back into an equation.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Ikkita ildiz ikkita yechim beradi. Bittasini tashlab ketish — sistemaning yarmini yo'qotish bilan barobar.",
      'Два корня дают два решения. Отбросить одно — то же, что потерять половину системы.',
      'Two roots give two solutions. Dropping one is the same as losing half of the system.') },
  ],
  wrongText: L(
    "Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi qarama-qarshi ishorada nima bo'lishi haqida, ikkinchisi natija javobmi yoki yo'qmi, uchinchisi esa nechta yechim yozilishi haqida.",
    'Проверяй каждую клетку самим предложением: первая про то, что бывает при противоположных знаках, вторая про то, ответ это или нет, третья про то, сколько решений записывают.',
    'Check each blank against the sentence itself: the first is about what happens with opposite signs, the second about whether the result is an answer, the third about how many solutions are written down.'),
};

export default function D12_08(props) { return <ClozeBank data={DATA} {...props} />; }
