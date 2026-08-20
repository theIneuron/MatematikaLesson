// Dars01 amaliyoti · topshiriq 07 — O'RTA · qavs qiymatni O'ZGARTIRADI · teg P3
//
// 60 − 12 : 3 + 5. Uchinchi topshiriqning teskarisi: u yerda qavs qiymatni
// tushirdi, bu yerda esa bo'linuvchini ALMASHTIRADI. Qavssiz 61, (60 − 12)
// bilan 21.
import React from 'react'
import { L } from '../../core.jsx'
import { BracketGap } from '../../tools.jsx'

export const META = { id: 't07', level: 'mid', skillTag: 'P3' }

export default function D01_07({ onSolved, disabled }) {
  return (
    <BracketGap
      rounds={[
        {
          nums: [60, 12, 3, 5],
          ops: ['−', ':', '+'],
          answer: { from: 0, to: 1 },
          prompt: L(
            "Qavsni shunday qo'yingki, qiymat 21 bo'lsin.",
            'Поставь скобку так, чтобы значение стало 21.',
            'Place a bracket so the value comes out as 21.',
          ),
          baseNote: L(
            'Qavssiz bu yozuvning qiymati 61',
            'Без скобок значение этой записи равно 61',
            'With no brackets the value of this expression is 61',
          ),
          hints: {
            '1-2': L(
              "Bu qavs hech nimani o'zgartirmadi: bo'lish qoida bo'yicha ham birinchi bajariladi.",
              'Эта скобка ничего не изменила: деление и по правилу выполняется первым.',
              'That bracket changed nothing: division goes first by the rule anyway.',
            ),
            '2-3': L(
              "Endi uch va besh qo'shildi va bo'linuvchi o'zgardi. Qiymat butun son ham bo'lmadi.",
              'Теперь сложились три и пять, и делитель изменился. Значение вышло даже не целым.',
              'Now three and five were added and the divisor changed. The value is not even a whole number.',
            ),
            '1-3': L(
              "Bu qavs bo'lish bilan qo'shishni birga oldi va ellik bir chiqdi.",
              'Эта скобка забрала вместе деление и сложение, и получилось пятьдесят один.',
              'That bracket took the division together with the addition, and the value came out fifty-one.',
            ),
            '*': L(
              "Yigirma bir bu o'n olti va besh. O'n oltini qaysi bo'lish beradi.",
              'Двадцать один это шестнадцать и пять. Какое деление даёт шестнадцать?',
              'Twenty-one is sixteen and five. Which division gives sixteen?',
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
