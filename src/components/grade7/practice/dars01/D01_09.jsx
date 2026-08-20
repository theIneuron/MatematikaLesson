// Dars01 amaliyoti · topshiriq 09 — QIYIN · yig'ish, ayirish oldin · teg P3
//
// Qiymat 24, plitkalar 5 2 8 − · ( ). Yagona javob: (5 − 2) · 8 (yoki
// 8 · (5 − 2)). Qavssiz 24 chiqmaydi, ya'ni qavsni matematikaning O'ZI
// talab qiladi -- biz «qavs qo'ying» deb aytmaymiz.
//
// Bu yerda yangi qirra bor: ayirishda TARTIB muhim. (2 − 5) · 8 minus
// yigirma to'rtni beradi, va bu alohida razborga arziydi.
import React from 'react'
import { L } from '../../core.jsx'
import { BuildValue } from '../../tools.jsx'

export const META = { id: 't09', level: 'hard', skillTag: 'P3' }

const BRACKET_ON_PRODUCT = L(
  "Qavs ko'paytirishga tushdi, u esa qavssiz ham birinchi bajariladi -- bunday qavs ORTIQCHA. Ayirish qachon birinchi bo'lishi kerak.",
  'Скобка попала на умножение, а оно и без скобки идёт первым — такая скобка ЛИШНЯЯ. Подумай, когда первым должно идти вычитание.',
  'The bracket landed on the multiplication, which goes first anyway, so it is REDUNDANT. Think about when the subtraction has to go first.',
)
const WRONG_PAIR = L(
  "Qavs joyida -- u ayirishni birinchi qildi. Lekin ayrilgan sonlar boshqa: nimaga ko'paytirayotganingizga qarang.",
  'Скобка на месте — она сделала вычитание первым. Но вычитались другие числа: посмотри, на что ты умножаешь.',
  'The bracket is right, it made the subtraction go first. But the wrong pair was subtracted: look at what you are multiplying by.',
)
const REVERSED = L(
  "Sonlar to'g'ri, lekin ayirish teskari tomonga ketdi: kichikdan katta ayrildi. Ayirishda tartib qiymatni ag'daradi.",
  'Числа верные, но вычитание пошло в другую сторону: из меньшего вычли большее. В вычитании порядок переворачивает значение.',
  'The numbers are right but the subtraction ran the other way: the larger was taken from the smaller. In subtraction the order flips the value.',
)

export default function D01_09({ onSolved, disabled }) {
  return (
    <BuildValue
      prompt={L(
        "Hamma plitkadan foydalanib, qiymati 24 ga teng yozuv yig'ing.",
        'Собери запись со значением 24, использовав все плитки.',
        'Use every tile to build an expression whose value is 24.',
      )}
      target={24}
      useAll
      tiles={[
        { id: 'n5', label: '5', kind: 'num' },
        { id: 'n2', label: '2', kind: 'num' },
        { id: 'n8', label: '8', kind: 'num' },
        { id: 'minus', label: '−', kind: 'op' },
        { id: 'mul', label: '·', kind: 'op' },
        { id: 'op', label: '(', kind: 'open' },
        { id: 'cl', label: ')', kind: 'close' },
      ]}
      wrongs={[
        { value: -24, tag: 'P4', hint: REVERSED },
        { value: 2, tag: 'P3', hint: BRACKET_ON_PRODUCT },
        { value: -2, tag: 'P3', hint: BRACKET_ON_PRODUCT },
        { value: 38, tag: 'P3', hint: BRACKET_ON_PRODUCT },
        { value: -38, tag: 'P3', hint: BRACKET_ON_PRODUCT },
        { value: 11, tag: 'P3', hint: BRACKET_ON_PRODUCT },
        { value: -11, tag: 'P3', hint: BRACKET_ON_PRODUCT },
        { value: 6, tag: 'P3', hint: WRONG_PAIR },
        { value: -6, tag: 'P3', hint: WRONG_PAIR },
        { value: 30, tag: 'P3', hint: WRONG_PAIR },
        { value: -30, tag: 'P3', hint: WRONG_PAIR },
      ]}
      hints={[
        L(
          "Yigirma to'rt bu sakkiz uchta. Uchni qaysi amal beradi.",
          'Двадцать четыре это восемь трижды. Какое действие даёт три?',
          'Twenty-four is eight taken three times. Which operation gives three?',
        ),
        L(
          "Ko'paytirish qoida bo'yicha oldin bajariladi. Bizga esa AYIRISH oldin kerak.",
          'Умножение по правилу выполняется раньше. А нам нужно, чтобы раньше шло ВЫЧИТАНИЕ.',
          'By the rule multiplication runs earlier. But we need the SUBTRACTION to run earlier.',
        ),
        L(
          "Tekshiruv nuqtasi: sakkizni uchga ko'paytirish kerak, uch esa ikki sonning ayirmasi.",
          'Контрольная точка: восемь нужно умножить на три, а три это разность двух чисел.',
          'A checkpoint: the eight has to be multiplied by three, and three is the difference of two numbers.',
        ),
      ]}
      okNote={L(
        "Qavs ayirishni birinchi qildi: 5 − 2 = 3, keyin 3 · 8 = 24",
        'Скобка сделала вычитание первым: 5 − 2 = 3, затем 3 · 8 = 24',
        'The bracket made the subtraction go first: 5 − 2 = 3, then 3 · 8 = 24',
      )}
      disabled={disabled}
      onSolved={onSolved}
    />
  )
}
