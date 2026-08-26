// Dars24 · Amaliyot 01 — Ha yoki yo'q · 🟢 · tag: sign_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §6 (24-dars, 1-pozitsiya)
//
// T1 va T2 YONMA-YON. Ikki mulahazada AYNAN o'sha tengsizlik turadi —
// besh uchdan katta — va faqat ko'paytuvchi farq qiladi: ikki va minus
// ikki. Natijalar esa boshqacha: musbatda ishora saqlanadi, manfiyda
// buriladi (З52).
//
// Razbor son o'qiga tayanadi: minus o'n minus oltidan CHAPDA turadi, ya'ni
// kichikroq — bu «katta son minusda kichik bo'lib qoladi» degan fikrni
// ko'z bilan ko'rsatadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'sign_claims', level: '🟢',
  itemSize: 15,
  items: [
    { id: 's1', yes: false,
      tokens: ['5 > 3', '→', '−2,5 > −1,5'],
      claim: L('−2 ga bo\'lindi', 'разделили на −2', 'divided by −2') },
    { id: 's2', yes: false,
      tokens: ['5 > 3', '→', '−10 > −6'],
      claim: L('−2 ga ko\'paytirildi', 'умножили на −2', 'multiplied by −2') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Bitta tengsizlik ikki marta ko'paytirildi: biror joyda musbat songa, biror joyda manfiy songa. Natijalar to'g'ri yozilganmi?",
    'Одно и то же неравенство умножили дважды: где-то на положительное число, где-то на отрицательное. Верно ли записаны результаты?',
    'The same inequality was multiplied twice: once by a positive number and once by a negative one. Are the results written correctly?'),
  ask: L(
    "Natija to'g'ri bo'lsa «Ha», noto'g'ri bo'lsa «Yo'q».",
    'Если результат верен — «Да», если неверен — «Нет».',
    'If the result is right, «Yes»; if not, «No».'),
  correctText: L(
    "To'g'ri. Ikkalasi ham yolg'on: manfiy songa ko'paytirilganda ham, bo'linganda ham ikki tomon son o'qining narigi tomoniga o'tadi va tartib teskari bo'ladi. Minus ikki yarim minus bir yarimdan chapda, minus o'n minus oltidan chapda — ya'ni ikkalasi ham KICHIK.",
    'Верно. Оба ложны: и при умножении на отрицательное, и при делении обе части уходят на другую сторону числовой прямой, и порядок становится обратным. Минус два с половиной левее минус полутора, минус десять левее минус шести — значит оба МЕНЬШЕ.',
    'Correct. Both are false: multiplying by a negative and dividing by one both send the sides to the other side of the number line and reverse the order. Minus two and a half is left of minus one and a half, minus ten is left of minus six — so both are SMALLER.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi yozuvda ishora BURILMAGAN. Ikkala tomon minus ikkiga ko'paytirilgan, ya'ni ikkalasi ham manfiy tomonga o'tgan — va o'sha yerda tartib teskari bo'ladi. Son o'qida tekshiring: minus o'n va minus olti. Qaysi biri chapda tursa, o'sha kichik: minus o'n. Demak to'g'ri yozuv minus o'n minus oltidan kichik.",
      'Во второй записи знак НЕ ПЕРЕВЁРНУТ. Обе части умножили на минус два, то есть обе ушли в отрицательную сторону — а там порядок обратный. Проверь на числовой прямой: минус десять и минус шесть. Кто левее, тот и меньше: минус десять. Значит верная запись — минус десять меньше минус шести.',
      'In the second record the sign was NOT flipped. Both sides were multiplied by minus two, so both moved to the negative side — and there the order reverses. Check on the number line: minus ten and minus six. Whoever is further left is smaller: minus ten. So the right record is minus ten is less than minus six.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi yozuvda ham ishora BURILMAGAN. Bo'luvchi manfiy: besh bo'lingan minus ikki minus ikki yarim, uch bo'lingan minus ikki minus bir yarim. Son o'qida qarang — minus ikki yarim chapda, ya'ni KICHIK. To'g'ri yozuv minus ikki yarim minus bir yarimdan kichik bo'ladi. Manfiyga bo'lish ham manfiyga ko'paytirishdek ishlaydi.",
      'В первой записи знак тоже НЕ ПЕРЕВЁРНУТ. Делитель отрицателен: пять делить на минус два минус два с половиной, три делить на минус два минус полтора. Посмотри на числовую прямую — минус два с половиной левее, то есть МЕНЬШЕ. Верная запись: минус два с половиной меньше минус полутора. Деление на отрицательное работает так же, как умножение.',
      'In the first record the sign was NOT flipped either. The divisor is negative: five over minus two is minus two and a half, three over minus two is minus one and a half. Look at the number line — minus two and a half is further left, so it is SMALLER. The right record is minus two and a half is less than minus one and a half. Dividing by a negative works just like multiplying.') },
  ],
  wrongText: L(
    "Ko'paytuvchining ISHORASIGA qarang: musbat bo'lsa tengsizlik ishorasi saqlanadi, manfiy bo'lsa buriladi. Natijani son o'qida tekshiring.",
    'Смотри на ЗНАК множителя: положительный — знак неравенства сохраняется, отрицательный — переворачивается. Проверь результат на числовой прямой.',
    'Look at the SIGN of the multiplier: a positive one keeps the inequality sign, a negative one flips it. Check the result on the number line.'),
};

export default function D24_01(props) { return <TrueFalse data={DATA} {...props} />; }
