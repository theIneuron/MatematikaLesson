// Dars01 amaliyoti · topshiriq 10 — QIYIN · KO'CHIRISH: so'zdan yozuvga · teg P4
//
// Zalda 6 qator, har qatorda 8 joy, va yana 5 ta alohida stul. Javob:
// 6 · 8 + 5 = 53.
//
// Qavs plitkalari SPECIAL ravishda beriladi, lekin ular KERAK EMAS: qoida
// ko'paytirishni o'zi birinchi qiladi. Aynan shu tekshiriladi -- oldingi
// ikki topshiriqda qavs zarur edi, bu yerda esa ortiqcha. Shuning uchun
// bu yerda `useAll` YO'Q: hamma plitkani ishlatish talabi qavsni majburiy
// qilib qo'yardi va topshiriqning ma'nosi teskariga aylanardi.
import React from 'react'
import { L } from '../../core.jsx'
import { BuildValue } from '../../tools.jsx'

export const META = { id: 't10', level: 'hard', skillTag: 'P4' }

const BRACKET_TOOK_CHAIRS = L(
  "Qavs beshlikni ham qatorlarga ko'paytirdi. Alohida stullar esa qatorlarda turmaydi -- ular oxirida qo'shiladi.",
  'Скобка заставила умножить на ряды и пятёрку. А отдельные стулья в рядах не стоят — они добавляются в конце.',
  'The bracket multiplied the five by the rows as well. But the separate chairs are not in the rows, they are added at the end.',
)
const WRONG_PAIR = L(
  "Ko'paytirilgan sonlar boshqa. Qatorlar nechta va har qatorda nechta joy borligiga qarang.",
  'Умножились другие числа. Посмотри, сколько рядов и сколько мест в каждом ряду.',
  'The wrong numbers were multiplied. Look at how many rows there are and how many seats in each.',
)

export default function D01_10({ onSolved, disabled }) {
  return (
    <BuildValue
      prompt={L(
        "Zalda 6 qator, har qatorda 8 joy, va yana 5 ta alohida stul. Shu holatga mos yozuv yig'ing. Hamma plitka kerak emas.",
        'В зале 6 рядов по 8 мест и ещё 5 отдельных стульев. Собери запись, которая описывает эту ситуацию. Все плитки не нужны.',
        'A hall has 6 rows of 8 seats plus 5 separate chairs. Build the expression that describes it. Not every tile is needed.',
      )}
      target={53}
      tiles={[
        { id: 'n6', label: '6', kind: 'num' },
        { id: 'n8', label: '8', kind: 'num' },
        { id: 'n5', label: '5', kind: 'num' },
        { id: 'mul', label: '·', kind: 'op' },
        { id: 'plus', label: '+', kind: 'op' },
        { id: 'op', label: '(', kind: 'open' },
        { id: 'cl', label: ')', kind: 'close' },
      ]}
      wrongs={[
        { value: 88, tag: 'P4', hint: BRACKET_TOOK_CHAIRS },
        { value: 78, tag: 'P4', hint: BRACKET_TOOK_CHAIRS },
        { value: 70, tag: 'P4', hint: BRACKET_TOOK_CHAIRS },
        { value: 46, tag: 'P4', hint: WRONG_PAIR },
        { value: 38, tag: 'P4', hint: WRONG_PAIR },
      ]}
      hints={[
        L(
          "Qatorlardagi joylar va alohida stullar -- ikki xil narsa. Ular oxirida QO'SHILADI.",
          'Места в рядах и отдельные стулья это разные вещи. В конце они СКЛАДЫВАЮТСЯ.',
          'Seats in rows and separate chairs are different things. At the end they are ADDED.',
        ),
        L(
          "Avval qatorlardagi joylarni toping, keyin alohida stullarni qo'shing.",
          'Сначала найди места в рядах, потом добавь отдельные стулья.',
          'First find the seats in the rows, then add the separate chairs.',
        ),
        L(
          "Tekshiruv nuqtasi: qavs bu yerda kerak emas -- ko'paytirish qoida bo'yicha o'zi birinchi bajariladi.",
          'Контрольная точка: скобка здесь не нужна — умножение по правилу и так выполняется первым.',
          'A checkpoint: no bracket is needed here, multiplication already goes first by the rule.',
        ),
      ]}
      okNote={L(
        "Ko'paytirish qavssiz ham birinchi bajariladi: 6 · 8 = 48, keyin 48 + 5 = 53",
        'Умножение выполняется первым и без скобки: 6 · 8 = 48, затем 48 + 5 = 53',
        'Multiplication goes first even with no bracket: 6 · 8 = 48, then 48 + 5 = 53',
      )}
      disabled={disabled}
      onSolved={onSolved}
    />
  )
}
