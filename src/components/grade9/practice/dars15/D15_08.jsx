// Dars15 · Amaliyot 08 — So'zlar · 🔴 · teg: toliq-korpaytirmaslik
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> ClozeBank.
//
// Qoida darsning uchala tasdig'ini bir gapga yig'adi. Bankdagi uch tuzoq
// darsning uch aniq adashishiga tegadi: «hadlarga» ajratish,
// «yo'qoladi», va takroriy ildizda «ham almashadi».
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'toliq-korpaytirmaslik', level: '🔴',
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
      "Oraliqlar usulida ifoda oxirigacha",
      'В методе интервалов выражение до конца разлагают на',
      'In the interval method the expression is fully split into') },
    { slot: 0 },
    { text: L(
      "ajratiladi va barcha ildizlar o'qqa qo'yiladi. Har bir oddiy ildizdan o'tishda ishora",
      ', и все корни наносят на ось. При переходе через каждый простой корень знак',
      ', and all the roots are put on the axis. At every simple root the sign') },
    { slot: 1 },
    { text: L(
      ", takroriy ildizda esa",
      ', а при повторяющемся корне',
      ', but at a repeated root it') },
    { slot: 2 },
    { text: L('.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L("ko'paytuvchilarga", 'множители', 'factors') },
    { id: 'w2', label: L('almashadi', 'меняется', 'changes') },
    { id: 'w3', label: L('saqlanadi', 'сохраняется', 'stays the same') },
    { id: 'w4', label: L('hadlarga', 'слагаемые', 'terms') },
    { id: 'w5', label: L("yo'qoladi", 'исчезает', 'disappears') },
    { id: 'w6', label: L('ham almashadi', 'тоже меняется', 'changes as well') },
  ],
  answer: ['w1', 'w2', 'w3'],
  correctText: L(
    "To'g'ri, uchala so'z ham joyida. Qoida darsning uchala ishini bir gapga yig'adi: ifoda OXIRIGACHA ko'paytuvchilarga ajratiladi — bitta ildiz tushib qolsa, oraliqlar ham noto'g'ri chiqadi; oddiy ildizda ishora almashadi, chunki bitta ko'paytuvchi nolni kesib o'tadi; takroriy ildizda esa saqlanadi, chunki nol ikki marta kesiladi va ikkita almashish bir-birini bekor qiladi.",
    'Верно, все три слова на месте. Правило собирает в одно предложение три дела урока: выражение разлагают на множители ДО КОНЦА — пропусти один корень, и промежутки выйдут неверными; в простом корне знак меняется, ведь нуль пересекает один множитель; а в повторяющемся сохраняется, ведь нуль пересекается дважды и две перемены взаимно уничтожаются.',
    'Correct, all three words are in place. The rule gathers the three jobs of the lesson into one sentence: the expression is factored ALL THE WAY — miss one root and the intervals come out wrong; at a simple root the sign changes, since one factor crosses zero; at a repeated root it is kept, since zero is crossed twice and the two flips cancel.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Hadlarga ajratish — bu qo'shish, oraliqlar usuli esa KO'PAYTMA bilan ishlaydi. Faqat ko'paytmaning ishorasini ko'paytuvchilar bo'yicha aniqlash mumkin.",
      'Разложить на слагаемые — это сложение, а метод интервалов работает с ПРОИЗВЕДЕНИЕМ. Только у произведения знак можно определить по множителям.',
      'Splitting into terms is addition, while the interval method works with a PRODUCT. Only for a product can the sign be read off the factors.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Ishora yo'qolmaydi — ifoda ildizda nolga aylanadi, lekin ildizning ikki tomonida ishora bor. O'tishda u almashadi.",
      'Знак не исчезает — выражение обращается в нуль в корне, но по обе стороны от корня знак есть. При переходе он меняется.',
      'The sign does not disappear — the expression becomes zero at the root, but on both sides of the root there is a sign. Crossing it flips.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Takroriy ildizda ishora almashmaydi: qavs ikki marta uchraydi, ya'ni nol ikki marta kesiladi va almashishlar bir-birini bekor qiladi.",
      'В повторяющемся корне знак не меняется: скобка встречается дважды, то есть нуль пересекается дважды, и перемены взаимно уничтожаются.',
      'At a repeated root the sign does not change: the bracket occurs twice, so zero is crossed twice and the flips cancel.') },
  ],
  wrongText: L(
    "Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi ifoda nimaga ajratilishi haqida, ikkinchisi oddiy ildizda ishora haqida, uchinchisi esa takroriy ildizda ishora haqida.",
    'Проверяй каждую клетку самим предложением: первая про то, на что разлагают выражение, вторая про знак в простом корне, третья про знак в повторяющемся.',
    'Check each blank against the sentence itself: the first is about what the expression is split into, the second about the sign at a simple root, the third about the sign at a repeated one.'),
};

export default function D15_08(props) { return <ClozeBank data={DATA} {...props} />; }
