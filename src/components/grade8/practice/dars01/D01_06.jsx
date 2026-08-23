// Dars01 * Amaliyot 06 -- Mos ko'paytuvchini chizib tashlash * 🟡 * tag: reduce_reason
// Faqat MA'LUMOT. Tip: kit.jsx -> Cancel (tayyor gap YO'Q -- surat va
// maxrajdan mos ko'paytuvchi QO'L bilan chizib tashlanadi, keyin IKKITA
// SON yoziladi).
//
// METODIST QARORI 2026-08-22: ilgari shu joyda Why turgan edi (amal va asos
// tayyor gaplardan tanlanardi) -- "qiziq emas". Endi o'quvchi hech qanday
// gapni O'QIMAYDI: yozuvning o'zida ikki bo'lakni bosib, ularni ZACHYORKAYDI.
//
// METODIST QARORI 2026-08-23: dastlabki savol -- "shartni SO'Z bilan
// yozing (x != 7)" -- ikki muammoga ega edi: (1) telefonda "!=" belgisini
// yozish noqulay, (2) javob ZACHYORKALANGAN bo'lakning sonini ko'chirib
// yozishdan iborat edi -- juda oddiy. Endi IKKITA SON so'raladi:
//   1. Taqiqlangan qiymat (SON, matn emas).
//   2. Tekshirish: soddalashtirilgan yozuvning x = 3 dagi QIYMATI -- bu
//      hisoblashni talab qiladi, ekranda tayyor ko'rinmaydi.
//
// Matematika o'zgarmagan: x·x - 49 = (x-7)(x+7), (x-7) qisqaradi, qoladi
// x+7, taqiq 7, x = 3 da x+7 = 10 (nazariyaning (x·x-4)/(x-2) namunasidan
// BOSHQA son).
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Cancel, L } from '../kit.jsx';

const DATA = {
  tag: 'reduce_reason', level: '🟡',
  eyebrow: L('Qisqartirish', 'Сокращение', 'Reduction'),
  ask: L(
    "Suratdan maxrajga mos ko'paytuvchini bosing, keyin maxrajni bosing.",
    'Нажми в числителе множитель, совпадающий со знаменателем, потом сам знаменатель.',
    'Tap the numerator factor matching the denominator, then tap the denominator.',
  ),
  numerator: [
    { id: 'a', v: '(x − 7)' },
    { id: 'b', v: '(x + 7)' },
  ],
  denominator: [
    { id: 'c', v: '(x − 7)' },
  ],
  matchNum: 'a',
  matchDen: 'c',
  hintsNum: {
    b: L(
      "(x + 7) maxrajdagi (x − 7) bilan BIR XIL emas: ishoralari qarama-qarshi. Faqat AYNAN bir xil ko'paytuvchi qisqaradi.",
      '(x + 7) не совпадает с (x − 7) в знаменателе: знаки противоположны. Сокращается только ТОЧНО ТАКОЙ ЖЕ множитель.',
      '(x + 7) does not match (x − 7) in the denominator: the signs are opposite. Only the EXACT same factor cancels.',
    ),
  },
  forbid: 7,
  forbidAsk: L(
    "Chizilgan ko'paytuvchi qaysi x da nolga aylanadi?",
    'При каком x обращается в нуль зачёркнутый множитель?',
    'At what x does the crossed-out factor become zero?',
  ),
  forbidLabel: L('taqiqlangan qiymat', 'запрещённое значение', 'forbidden value'),
  hintsForbid: {
    '-7': L(
      "Minus yetti -- (x + 7) ning ildizi, u esa CHIZILMAGAN. Chizib tashlangani (x − 7): x − 7 = 0 dan x = 7.",
      'Минус семь — корень (x + 7), а он НЕ зачёркнут. Зачёркнут (x − 7): из x − 7 = 0 выходит x = 7.',
      'Minus seven is the root of (x + 7), which was NOT crossed out. The crossed factor is (x − 7): x − 7 = 0 gives x = 7.',
    ),
  },
  forbidWrong: L(
    "Chizib tashlangan ko'paytuvchi (x − 7). Uni nolga tenglashtiring: x − 7 = 0.",
    'Зачёркнутый множитель — (x − 7). Приравняй его к нулю: x − 7 = 0.',
    'The crossed-out factor is (x − 7). Set it to zero: x − 7 = 0.',
  ),
  checkAsk: L(
    "Qolgan (x + 7) x = 3 da nechaga teng?",
    'Чему равно оставшееся (x + 7) при x = 3?',
    'What does the remaining (x + 7) equal at x = 3?',
  ),
  checkLabel: L('qiymat', 'значение', 'value'),
  checkAnswer: 10,
  hintsCheck: {
    '49': L(
      "Bu boshlang'ich, qisqartirilmagan yozuvning qiymati. Qisqartirgandan keyin faqat x + 7 qoladi, uni hisoblang.",
      'Это значение исходной, несокращённой записи. После сокращения остаётся только x + 7, посчитай его.',
      'That is the value of the original, unreduced record. After reducing, only x + 7 remains -- compute that.',
    ),
    '7': L(
      "Bu taqiqlangan qiymat, savol esa boshqa: x + 7 ning x = 3 dagi qiymati.",
      'Это запрещённое значение, а вопрос про другое: чему равно x + 7 при x = 3.',
      'That is the forbidden value; the question asks something else: the value of x + 7 at x = 3.',
    ),
  },
  checkWrong: L(
    "x + 7 ga x = 3 ni qo'ying: 3 + 7.",
    'Подставь x = 3 в x + 7: 3 + 7.',
    'Substitute x = 3 into x + 7: 3 + 7.',
  ),
  correctText: L(
    "To'g'ri. (x − 7) surat va maxrajda bir xil, u qisqaradi va qoladi x + 7, shart esa x != 7 bo'lib qoladi. Tekshirish: x = 3 da x + 7 = 10 -- bu boshlang'ich yozuvning x = 3 dagi qiymati bilan bir xil.",
    'Верно. (x − 7) одинаков в числителе и знаменателе, он сокращается, остаётся x + 7, а условие остаётся x != 7. Проверка: при x = 3 x + 7 = 10 -- это совпадает со значением исходной записи при x = 3.',
    'Correct. (x − 7) is the same in numerator and denominator, it cancels, leaving x + 7, and the condition stays x != 7. Check: at x = 3, x + 7 = 10 -- matching the value of the original record at x = 3.',
  ),
};

export default function D01_06(props) { return <Cancel data={DATA} {...props} />; }
