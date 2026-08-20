// Dars01 amaliyoti · topshiriq 03 — OSON · qavsni o'quvchi qo'yadi · teg P3
//
// 9 + 6 : 3. Qavssiz qiymat 11; (9 + 6) : 3 esa 5 beradi. Tayyor yozuv
// TANLANMAYDI -- shu sababli bu topshiriq «to'rt variantdan bittasi»
// kvotasiga kirmaydi (etalon §4.2).
import React from 'react'
import { L } from '../../core.jsx'
import { BracketGap } from '../../tools.jsx'

export const META = { id: 't03', level: 'easy', skillTag: 'P3' }

export default function D01_03({ onSolved, disabled }) {
  return (
    <BracketGap
      rounds={[
        {
          nums: [9, 6, 3],
          ops: ['+', ':'],
          answer: { from: 0, to: 1 },
          prompt: L(
            "Qavsni shunday qo'yingki, qiymat 5 bo'lsin.",
            'Поставь скобку так, чтобы значение стало 5.',
            'Place a bracket so the value comes out as 5.',
          ),
          baseNote: L(
            'Qavssiz bu yozuvning qiymati 11',
            'Без скобок значение этой записи равно 11',
            'With no brackets the value of this expression is 11',
          ),
          hints: {
            '1-2': L(
              "Bu qavs hech nimani o'zgartirmadi: bo'lish qoida bo'yicha ham birinchi bajariladi.",
              'Эта скобка ничего не изменила: деление и по правилу выполняется первым.',
              'That bracket changed nothing: division goes first by the rule anyway.',
            ),
            '0-2': L(
              "Qavs butun yozuvni qamrab oldi, ichidagi tartib esa o'sha-o'sha qoldi.",
              'Скобка обняла всю запись, а порядок внутри остался тем же.',
              'The bracket wrapped the whole expression, and the order inside stayed the same.',
            ),
            '*': L(
              "Besh bu o'n beshning uchdan biri. O'n beshni qaysi amal beradi.",
              'Пять это третья часть пятнадцати. Какое действие даёт пятнадцать?',
              'Five is one third of fifteen. Which operation gives fifteen?',
            ),
          },
          tag: 'P3',
        },
      ]}
      disabled={disabled}
      onSolved={onSolved}
    />
  )
}
