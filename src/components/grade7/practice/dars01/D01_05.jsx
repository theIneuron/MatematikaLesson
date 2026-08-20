// Dars01 amaliyoti · topshiriq 05 — O'RTA · qadamba-qadam qayta yozish · teg P3
//
// 80 − (14 + 6) : 5 = 76. Uch qadam: qavs, bo'lish, ayirish. Har qadamda
// o'quvchi yozuvning QISMINI tanlaydi va amalni ATAYDI. Yozuv daftardek
// pastga o'sadi, «darrov javob» tugmasi yo'q.
import React from 'react'
import { L } from '../../core.jsx'
import { Transform } from '../../tools.jsx'
import { NEED_PART, REWRITE_ACTIONS } from '../PracticeHost.jsx'

export const META = { id: 't05', level: 'mid', skillTag: 'P3' }

export default function D01_05({ onSolved, disabled }) {
  return (
    <Transform
      start="80 − (14 + 6) : 5"
      actions={REWRITE_ACTIONS}
      steps={[
        {
          part: '14 + 6',
          action: 'bracket',
          to: '80 − 20 : 5',
          parts: ['14 + 6', '6 : 5', '80 − 14'],
          needPart: NEED_PART,
          wrongs: [
            {
              action: 'stage2',
              part: '6 : 5',
              hint: L(
                "Oltilik qavs ichida turadi va u yerdan chiqmaydi: bo'lish qavsdan KEYIN keladi.",
                'Шестёрка стоит внутри скобки и не выходит из неё: деление идёт ПОСЛЕ скобки.',
                'The six is inside the bracket and does not leave it: the division comes AFTER the bracket.',
              ),
              tag: 'P3',
            },
            {
              action: 'stage1',
              part: '80 − 14',
              hint: L(
                "O'n to'rt qavs ichida, sakson esa tashqarida. Ular orasida ayirish hozircha bajarilmaydi.",
                'Четырнадцать внутри скобки, восемьдесят снаружи. Вычитание между ними пока не выполняется.',
                'Fourteen is inside the bracket, eighty is outside. The subtraction between them does not run yet.',
              ),
              tag: 'P3',
            },
          ],
        },
        {
          part: '20 : 5',
          action: 'stage2',
          to: '80 − 4',
          parts: ['20 : 5', '80 − 20'],
          needPart: NEED_PART,
          wrongs: [
            {
              action: 'stage1',
              part: '80 − 20',
              hint: L(
                "Yozuvda hali bo'lish turibdi, u esa ikkinchi bosqich amali.",
                'В записи ещё осталось деление, а оно действие второй ступени.',
                'A division is still in the expression, and it is a second-stage operation.',
              ),
              tag: 'P1',
            },
          ],
        },
        {
          part: '80 − 4',
          action: 'stage1',
          to: '76',
          parts: ['80 − 4'],
          needPart: NEED_PART,
          wrongs: [
            {
              action: 'bracket',
              hint: L(
                "Qavs ishini tugatdi va yo'qoldi.",
                'Скобка сделала своё дело и исчезла.',
                'The bracket has done its job and is gone.',
              ),
            },
          ],
        },
      ]}
      footNote={L('Qiymat topildi', 'Значение найдено', 'The value is found')}
      disabled={disabled}
      onSolved={onSolved}
    />
  )
}
