// Dars02 · Amaliyot 09 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Kontent: src/books/grade8/DARS02_AMALIYOT_KONTENT_V2.md §09
//
// Metodist qarori 2026-08-24: har darsda o'nta mexanikaning biri `ClozeBank`
// bo'ladi, va u DARSNING QOIDASINI so'z bilan tekshiradi. 2-darsda qoida
// uch tayanchdan iborat, va uchtasi ham bo'shliqqa tushadi:
//   1) amal — KO'PAYTIRISH (qo'shish emas: З1);
//   2) ko'paytuvchi NOL bo'lmasligi (З21);
//   3) harfli ko'paytuvchi yangi SHART qo'shishi (З2).
// Bankdagi uch tuzoq aynan shu uch adashish: «qo'shsak», «birga», «javob».
//
// MUHIM: kartalar SO'Z, ya'ni `L()` ICHIDA. `parts` uch tilda bir xil
// shaklda: matn, uya, matn, uya, matn, uya, matn — shu sababli bo'shliqlar
// tartibi UZ, RU va EN da mos tushadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L(
      "Kasrning surati va maxrajini bir xil ifodaga",
      'Если числитель и знаменатель дроби',
      'If the numerator and the denominator of a fraction are') },
    { slot: 0 },
    { text: L(
      ", kasrning qiymati o'zgarmaydi. Bu ifoda",
      'на одно и то же выражение, значение дроби не изменится. Это выражение не должно быть равно',
      'by the same expression, the value does not change. That expression must not be equal to') },
    { slot: 1 },
    { text: L(
      "teng bo'lmasligi kerak. Harfli ifoda esa yangi",
      '. А выражение с буквой добавляет новое',
      '. An expression with a letter adds a new') },
    { slot: 2 },
    { text: L("qo'shadi.", '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L("ko'paytirsak", 'умножить', 'multiplied') },
    { id: 'w2', label: L("qo'shsak", 'прибавить', 'added') },
    { id: 'w3', label: L('nolga', 'нулю', 'zero') },
    { id: 'w4', label: L('birga', 'единице', 'one') },
    { id: 'w5', label: L('shart', 'условие', 'condition') },
    { id: 'w6', label: L('javob', 'ответ', 'answer') },
  ],
  answer: ['w1', 'w3', 'w5'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying.",
    'Правило урока записано, но три слова выпали. Поставь их из карточек снизу.',
    'The rule of the lesson is written down, but three words fell out. Put them back from the cards below.'),
  ask: L(
    "Kartani bosing, keyin bo'sh kartochkani bosing.",
    'Нажми карточку, потом пустую клетку.',
    'Tap a card, then tap an empty cell.'),
  bank: L("So'zlar", 'Слова', 'Words'),
  correctText: L(
    "To'g'ri. Qoida uch narsani birga aytadi. Amal — KO'PAYTIRISH: qo'shish kasrni o'zgartiradi. Ko'paytuvchi NOL bo'lmasligi kerak: nolga ko'paytirsangiz ikkala qavatda nol qoladi va kasr yo'qoladi. Uchinchisi ko'pincha esdan chiqadi: harfli ko'paytuvchi yangi SHART qo'shadi — harf nolga aylanadigan qiymat endi mumkin emas.",
    'Верно. Правило говорит три вещи сразу. Действие — УМНОЖЕНИЕ: прибавление меняет дробь. Множитель не должен быть равен НУЛЮ: после умножения на нуль на обоих этажах остаётся нуль и дробь исчезает. Третье забывают чаще всего: буквенный множитель добавляет новое УСЛОВИЕ — значение, при котором буква обращается в нуль, теперь недопустимо.',
    'Correct. The rule says three things at once. The action is MULTIPLYING: adding changes the fraction. The factor must not equal ZERO: multiply by zero and zero is left on both floors, so the fraction disappears. The third is the one most often forgotten: a factor with a letter adds a new CONDITION — the value where the letter becomes zero is no longer allowed.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w2', text: L(
      "Qo'shish bu xossa emas. a bo'linadi a qo'shuv uchga ni oling va ikkala qavatga to'rt qo'shing, keyin a ni birga teng qo'ying: dastlabki kasr bir chorak, yangisi esa besh sakkizdan.",
      'Прибавление — это не свойство. Возьми a делить на a плюс три, прибавь к обоим этажам четыре и подставь a равное одному: исходная даёт одну четвёртую, новая — пять восьмых.',
      'Adding is not this property. Take a over a plus three, add four to both floors and put a equal to one: the original gives one quarter, the new one five eighths.') },
    { when: (s) => s.slots[1] === 'w4', text: L(
      "Birga teng bo'lish taqiqlanmagan: birga ko'paytirish hech narsani o'zgartirmaydi, lekin ruxsat etilgan. Taqiqlangan ko'paytuvchi — NOL.",
      'Равняться единице не запрещено: умножение на единицу ничего не меняет, но оно разрешено. Запрещён множитель НУЛЬ.',
      'Being equal to one is not forbidden: multiplying by one changes nothing, but it is allowed. The forbidden factor is ZERO.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Harfli ko'paytuvchi javob qo'shmaydi, SHART qo'shadi: yozuv boshqa bo'ladi, qiymat esa o'sha — faqat ruxsat etilgan qiymatlar kamayadi.",
      'Буквенный множитель добавляет не ответ, а УСЛОВИЕ: запись становится другой, значение то же — уменьшается только набор допустимых значений.',
      'A factor with a letter adds not an answer but a CONDITION: the record changes, the value stays the same — only the set of allowed values shrinks.') },
    { when: (s) => s.slots.indexOf('w1') === -1, text: L(
      "Qoidaning birinchi so'zi amalni aytadi, va bu amal ko'paytirish. Qolgan ikkitasi undan keyin keladi.",
      'Первое слово правила называет действие, и это действие — умножение. Остальные два идут после него.',
      'The first word of the rule names the action, and that action is multiplying. The other two come after it.') },
  ],
  wrongText: L(
    "Qoidaning uch tayanchi: KO'PAYTIRISH, nolga teng bo'lmagan ko'paytuvchi va harf olib keladigan yangi SHART.",
    'Три опоры правила: УМНОЖЕНИЕ, множитель, не равный нулю, и новое УСЛОВИЕ, которое приносит буква.',
    'The three supports of the rule: MULTIPLYING, a factor not equal to zero, and the new CONDITION a letter brings.'),
};

export default function D02_09(props) { return <ClozeBank data={DATA} {...props} />; }
