// Dars01 amaliyoti · topshiriq 06 — O'RTA · yozuvni O'ZI yig'adi · teg P3
//
// Teskari yo'l: qiymat berilgan (20), yozuvni o'quvchi yig'adi. O'lchagich
// uning O'Z yozuvini o'qiydi -- javobni aytmaydi va aytolmaydi ham, chunki
// javob bitta emas.
//
// HAMMA PLITKA ISHLATILADI (`useAll`). Metodist 2026-08-20 da « ( 7 · 3 ) »
// yig'di: qavs ko'paytirishga tushdi, qo'lda «2» va «+» qoldi, va shu holatda
// yigirmaga yo'l yo'q edi -- ekran «javob topilmaydi» deb ko'rinardi.
// Endi yozuv TUGALLANISHI shart: o'quvchi «(7 · 3) + 2» ni yozib yigirma
// uchni ko'radi va aynan shu yo'l uchun razbor oladi.
//
// Yagona javob: (7 + 3) · 2. Yetti plitkaning boshqa hech qanday joylashuvi
// yigirmani bermaydi.
import React from 'react'
import { L } from '../../core.jsx'
import { BuildValue } from '../../tools.jsx'

export const META = { id: 't06', level: 'mid', skillTag: 'P3' }

// Qavs KO'PAYTIRISHGA tushgan holat. Uchta qiymat shu bitta yanglish
// tushunchadan chiqadi: 23, 17, 13.
const BRACKET_ON_PRODUCT = L(
  "Qavs ko'paytirishga tushdi. Lekin ko'paytirish qavssiz ham birinchi bajariladi, ya'ni bunday qavs ORTIQCHA. Qavs navbatni faqat boshqa amal atrofida o'zgartiradi.",
  'Скобка попала на умножение. Но умножение и без скобки идёт первым, значит такая скобка ЛИШНЯЯ. Очередь скобка меняет только вокруг другого действия.',
  'The bracket landed on the multiplication. But multiplication goes first even without it, so that bracket is REDUNDANT. A bracket only changes the order around a different operation.',
)
// Qavs QO'SHISHDA, lekin JUFT boshqa: 27 va 35.
const WRONG_PAIR = L(
  "Qavs joyida -- u qo'shishni birinchi qildi. Lekin qo'shilgan sonlar boshqa: nimaga ko'paytirayotganingizga qarang.",
  'Скобка на месте — она сделала сложение первым. Но сложились другие числа: посмотри, на что ты умножаешь.',
  'The bracket is in the right place, it made the addition go first. But the wrong pair was added: look at what you are multiplying by.',
)

export default function D01_06({ onSolved, disabled }) {
  return (
    <BuildValue
      prompt={L(
        "Hamma plitkadan foydalanib, qiymati 20 ga teng yozuv yig'ing.",
        'Собери запись со значением 20, использовав все плитки.',
        'Use every tile to build an expression whose value is 20.',
      )}
      target={20}
      useAll
      tiles={[
        { id: 'n7', label: '7', kind: 'num' },
        { id: 'n3', label: '3', kind: 'num' },
        { id: 'n2', label: '2', kind: 'num' },
        { id: 'plus', label: '+', kind: 'op' },
        { id: 'mul', label: '·', kind: 'op' },
        { id: 'op', label: '(', kind: 'open' },
        { id: 'cl', label: ')', kind: 'close' },
      ]}
      wrongs={[
        { value: 23, tag: 'P3', hint: BRACKET_ON_PRODUCT },
        { value: 17, tag: 'P3', hint: BRACKET_ON_PRODUCT },
        { value: 13, tag: 'P3', hint: BRACKET_ON_PRODUCT },
        { value: 27, tag: 'P3', hint: WRONG_PAIR },
        { value: 35, tag: 'P3', hint: WRONG_PAIR },
      ]}
      hints={[
        L(
          "Ko'paytirish qoida bo'yicha birinchi bajariladi va u ikki sondan FAQAT bittasini oladi. Yigirmaga esa uchtasi ham kerak.",
          'Умножение по правилу идёт первым и берёт ТОЛЬКО одно из двух чисел. А до двадцати нужны все три.',
          'By the rule multiplication goes first and takes ONLY one of the two numbers. But all three are needed to reach twenty.',
        ),
        L(
          "Qavs navbatni o'zgartiradi: uning ichidagi amal birinchi bajariladi.",
          'Скобка меняет очередь: действие внутри неё выполняется первым.',
          'A bracket changes the order: the operation inside it runs first.',
        ),
        L(
          "Tekshiruv nuqtasi: yigirma bu o'nning ikkitasi. O'nni qaysi amal beradi.",
          'Контрольная точка: двадцать это два раза по десять. Какое действие даёт десять?',
          'A checkpoint: twenty is ten taken twice. Which operation gives ten?',
        ),
      ]}
      okNote={L(
        "Qavs qo'shishni birinchi qildi: 7 + 3 = 10, keyin 10 · 2 = 20",
        'Скобка сделала сложение первым: 7 + 3 = 10, затем 10 · 2 = 20',
        'The bracket made the addition go first: 7 + 3 = 10, then 10 · 2 = 20',
      )}
      disabled={disabled}
      onSolved={onSolved}
    />
  )
}
