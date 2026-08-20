// Dars01 amaliyoti · topshiriq 02 — OSON · belgilarni o'quvchi qo'yadi · teg P1
//
// 12 □ 4 □ 3 = 24. Qiymat BERILGAN, belgi noma'lum -- ya'ni javob YIG'ILADI,
// tayyor yozuvlardan tanlanmaydi (etalon §1.1). Yagona yechim: 12 + 4 · 3.
import React from 'react'
import { L } from '../../core.jsx'
import { SlotFill } from '../../tools.jsx'

export const META = { id: 't02', level: 'easy', skillTag: 'P1' }

export default function D01_02({ onSolved, disabled }) {
  return (
    <SlotFill
      prompt={L(
        "Belgilarni shunday qo'yingki, qiymat 24 bo'lsin.",
        'Поставь знаки так, чтобы значение стало 24.',
        'Place the signs so the value comes out as 24.',
      )}
      template={['12 ', { slot: 0 }, ' 4 ', { slot: 1 }, ' 3 = 24']}
      parts={[
        { id: 'add', label: '+' },
        { id: 'sub', label: '−' },
        { id: 'mul', label: '·' },
        { id: 'div', label: ':' },
      ]}
      answer={['add', 'mul']}
      checkNote={L(
        "Ko'paytirish birinchi: 4 · 3 = 12, so'ng 12 + 12 = 24",
        'Умножение первым: 4 · 3 = 12, затем 12 + 12 = 24',
        'Multiplication first: 4 · 3 = 12, then 12 + 12 = 24',
      )}
      wrongs={[
        {
          key: 'mul|add',
          tag: 'P1',
          hint: L(
            "Bunda o'n ikkini to'rtga ko'paytirish birinchi bajariladi va ellik bir chiqadi. Qaysi amal oxirida turishi kerak.",
            'Здесь первым выполняется двенадцать умножить на четыре, и выходит пятьдесят один. Подумай, какое действие должно остаться последним.',
            'Here twelve times four goes first and the result is fifty-one. Think about which operation should be left for last.',
          ),
        },
        {
          key: 'mul|mul',
          tag: 'P1',
          hint: L(
            "Uchta sonning hammasi ko'paytirilsa yuz qirq to'rt chiqadi. Yigirma to'rt esa bundan ancha kichik.",
            'Если перемножить все три числа, выйдет сто сорок четыре. А двадцать четыре намного меньше.',
            'Multiplying all three numbers gives one hundred forty-four. Twenty-four is much smaller.',
          ),
        },
        {
          key: 'add|add',
          tag: 'P1',
          hint: L(
            "Faqat qo'shish bilan o'n to'qqiz chiqadi. Yigirma to'rtga yetish uchun sonlardan biri KATTALASHISHI kerak.",
            'Только сложением выходит девятнадцать. Чтобы дойти до двадцати четырёх, одно из чисел должно стать больше.',
            'Addition alone gives nineteen. To reach twenty-four one of the numbers has to grow.',
          ),
        },
        {
          key: '*',
          tag: 'P1',
          hint: L(
            "Yigirma to'rt bu o'n ikki va o'n ikki. Ikkinchi o'n ikkini qaysi ikki son beradi.",
            'Двадцать четыре это двенадцать и двенадцать. Какие два числа дают второе двенадцать?',
            'Twenty-four is twelve and twelve. Which two numbers give that second twelve?',
          ),
        },
      ]}
      disabled={disabled}
      onSolved={onSolved}
    />
  )
}
