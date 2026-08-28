// Dars17 · Amaliyot 09 — So'zlar · 🔴 · teg: maxraj-nolini-javobga-kiritish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> ClozeBank.
//
// Qoida darsning uchala tasdig'idan ikkitasini to'liq, uchinchisini
// (qisqartirish teshik nuqtani yo'qotadi) 07 va 08-topshiriqlar bilan
// birga yopadi. Kartalar butun ibora bilan tushadi: uch tilda inkor
// boshqa joyda turadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'maxraj-nolini-javobga-kiritish', level: '🔴',
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning qoidasi yozilgan, lekin uchta ibora tushib qolgan. Ularni pastdagi kartalardan qo'ying.",
    'Правило урока записано, но три выражения выпали. Поставь их из карточек снизу.',
    'The rule of the lesson is written down, but three phrases fell out. Put them back from the cards below.'),
  ask: L(
    "Kartani bosing, keyin bo'sh kartochkani bosing.",
    'Нажми карточку, потом пустую клетку.',
    'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  parts: [
    { text: L(
      "Kasr tengsizlikda maxrajga ko'paytirilmaydi, hammasi",
      'В дробном неравенстве на знаменатель не умножают, всё переносят',
      'In a fractional inequality you do not multiply by the denominator, everything is moved') },
    { slot: 0 },
    { text: L(
      "ko'chiriladi. Suratning nol nuqtasi qat'iy emas tengsizlikda javobga",
      '. Нуль числителя в нестрогом неравенстве в ответ',
      ". A numerator's zero in a non-strict inequality") },
    { slot: 1 },
    { text: L(
      ", maxrajning nol nuqtasi esa",
      ', а нуль знаменателя',
      ", while a denominator's zero") },
    { slot: 2 },
    { text: L('.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('bitta tomonga', 'в одну сторону', 'to one side') },
    { id: 'w2', label: L('kiradi', 'входит', 'belongs in the answer') },
    { id: 'w3', label: L("hech qachon kirmaydi", 'не входит никогда', 'never does') },
    { id: 'w4', label: L('ikkala tomonga', 'в обе стороны', 'to both sides') },
    { id: 'w5', label: L('kirmaydi', 'не входит', 'is excluded from the answer') },
    { id: 'w6', label: L('har doim kiradi', 'входит всегда', 'always does') },
  ],
  answer: ['w1', 'w2', 'w3'],
  correctText: L(
    "To'g'ri, uchala ibora ham joyida. Qoida darsning uchala ishini bir gapga yig'adi: maxrajga ko'paytirmaymiz, chunki uning ishorasi noma'lum va tengsizlik belgisi teskariga aylanib ketishi mumkin; surat noli qat'iy emas tengsizlikda javobga kiradi, chunki u yerda kasr nolga teng; maxraj noli esa hech qachon kirmaydi, chunki u yerda kasrning qiymati umuman yo'q — belgi qanday bo'lishidan qat'i nazar.",
    'Верно, все три выражения на месте. Правило собирает в одно предложение три дела урока: на знаменатель не умножаем, ведь его знак неизвестен и знак неравенства может перевернуться; нуль числителя при нестрогом знаке в ответ входит, ведь там дробь равна нулю; а нуль знаменателя не входит никогда, ведь там у дроби нет значения вовсе — при любом знаке.',
    'Correct, all three phrases are in place. The rule gathers the three jobs of the lesson into one sentence: we do not multiply by the denominator, since its sign is unknown and the inequality may flip; a numerator zero belongs in the answer of a non-strict inequality, since the fraction equals zero there; and a denominator zero never does, since the fraction has no value there at all — whatever the sign.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Hadlar ikkala tomonga ko'chirilmaydi, aks holda tengsizlik joyida qoladi. Maqsad — bitta tomonda bitta kasr qoldirish, ikkinchi tomonda nol.",
      'Слагаемые не переносят в обе стороны, иначе неравенство останется на месте. Цель — оставить одну дробь с одной стороны, а с другой нуль.',
      'Terms are not moved to both sides, or the inequality stays where it was. The aim is to leave a single fraction on one side and zero on the other.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Surat nolida kasr NOLGA teng, belgi esa qat'iy emas — ya'ni nol qiymat ruxsat etilgan. Demak bu nuqta javobga kiradi.",
      'В нуле числителя дробь равна НУЛЮ, а знак нестрогий — то есть нулевое значение разрешено. Значит эта точка входит в ответ.',
      'At a numerator zero the fraction equals ZERO, and the sign is non-strict — so the zero value is allowed. Hence that point belongs to the answer.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Maxraj nolida kasrning qiymati umuman yo'q: nolga bo'lish mumkin emas. Belgi qat'iy bo'ladimi yoki qat'iy emasmi, bu nuqta hech qachon javobga kirmaydi.",
      'В нуле знаменателя у дроби нет значения вовсе: на нуль делить нельзя. Строгий знак или нестрогий — эта точка не входит в ответ никогда.',
      'At a denominator zero the fraction has no value at all: division by zero is impossible. Strict sign or not, that point is never in the answer.') },
  ],
  wrongText: L(
    "Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi hadlar qayerga ko'chirilishi haqida, ikkinchisi surat noli haqida, uchinchisi esa maxraj noli haqida.",
    'Проверяй каждую клетку самим предложением: первая про то, куда переносят слагаемые, вторая про нуль числителя, третья про нуль знаменателя.',
    'Check each blank against the sentence itself: the first is about where the terms are moved, the second about the numerator zero, the third about the denominator zero.'),
};

export default function D17_09(props) { return <ClozeBank data={DATA} {...props} />; }
