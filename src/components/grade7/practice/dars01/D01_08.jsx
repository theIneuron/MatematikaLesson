// Dars01 amaliyoti · topshiriq 08 — QIYIN · birinchi xato qator · teg P2
//
// Etalon §8.2: har qator to'g'ri KO'RINADI, javob esa noto'g'ri, va xatodan
// keyingi qatorlar undan TO'G'RI kelib chiqadi -- shuning uchun BIRINCHISI
// qidiriladi. Qarshi misolni dastur emas, O'QUVCHI qo'yadi: to'g'ri qiymatni
// o'zi hisoblab, 88 ning yoniga qo'yadi.
//
// 90 − 28 : 7 · 2 = 82. Xato yechimda 7 · 2 birinchi bajarilgan: 90 − 2 = 88.
import React from 'react'
import { L } from '../../core.jsx'
import { AuditWithProof } from '../PracticeHost.jsx'

export const META = { id: 't08', level: 'hard', skillTag: 'P2' }

export default function D01_08({ onSolved, disabled }) {
  return (
    <AuditWithProof
      disabled={disabled}
      onSolved={onSolved}
      audit={{
        prompt: L(
          "Yuqoridagi qatordan kelib chiqmagan BIRINCHI qatorni toping.",
          'Найди ПЕРВУЮ строку, которая не следует из строки над ней.',
          'Find the FIRST line that does not follow from the line above it.',
        ),
        rows: [
          { id: 'r1', text: '90 − 28 : 7 · 2' },
          { id: 'r2', text: '90 − 28 : 14' },
          { id: 'r3', text: '90 − 2' },
          { id: 'r4', text: '88' },
        ],
        answerId: 'r2',
        hints: {
          r1: L(
            "Bu boshlang'ich yozuv, unda hali hech narsa hisoblanmagan.",
            'Это исходная запись, в ней ещё ничего не посчитано.',
            'That is the original expression, nothing has been worked out in it yet.',
          ),
          r3: L(
            "Bu qatorga o'n to'rt yuqoridan tushdi, boshlang'ich yozuvda esa u yo'q. Demak farq bundan OLDIN paydo bo'lgan.",
            'В эту строку четырнадцать пришло сверху, а в исходной записи его нет. Значит расхождение появилось РАНЬШЕ.',
            'The fourteen in this line came from above, and it is not in the original. So the divergence happened EARLIER.',
          ),
          r4: L(
            "Bu yerda ayirish to'g'ri bajarilgan. Xato bundan ancha oldin.",
            'Здесь вычитание выполнено верно. Ошибка старше.',
            'The subtraction here is done correctly. The mistake is older than this.',
          ),
        },
        tags: { r1: 'P2', r3: 'P2', r4: 'P2' },
      }}
      proof={{
        prompt: L(
          "Birinchi qator to'g'ri hisoblanganda: 28 : 7 bu 4. Endi 4 ni 2 ga ko'paytiring va qiymatni yig'ing.",
          'Первая строка, посчитанная верно: 28 : 7 это 4. Умножь 4 на 2 и собери значение.',
          'The first line worked out correctly: 28 : 7 is 4. Multiply 4 by 2 and build the value.',
        ),
        template: ['90 − ', { slot: 0 }, ' = ', { slot: 1 }],
        parts: [
          { id: 'p8', label: '8' },
          { id: 'p2', label: '2' },
          { id: 'p82', label: '82' },
          { id: 'p88', label: '88' },
        ],
        answer: ['p8', 'p82'],
        checkNote: L(
          '82 va 88. Sonlar farq qildi, demak ikkinchi qator birinchisiga teng emas',
          '82 и 88. Числа разошлись, значит вторая строка не равна первой',
          '82 and 88. The numbers differ, so the second line is not equal to the first',
        ),
        wrongs: [
          {
            key: '*',
            tag: 'P2',
            hint: L(
              "Ikkita amal ham bitta bosqichda: avval yigirma sakkizni yettiga bo'ling, keyin natijani ikkiga ko'paytiring.",
              'Оба действия на одной ступени: сначала раздели двадцать восемь на семь, потом умножь результат на два.',
              'Both operations are on the same stage: divide twenty-eight by seven first, then multiply the result by two.',
            ),
          },
        ],
      }}
    />
  )
}
