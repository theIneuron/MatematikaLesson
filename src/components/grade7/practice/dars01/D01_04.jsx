// Dars01 amaliyoti · topshiriq 04 — O'RTA · bir bosqich ichida tartib · teg P2
//
// 7 + 36 : 9 · 2. Blokning eng qimmat xatosi shu yerda: ko'paytirishni
// bo'lishdan OLDIN bajarish. Qoida bo'yicha 15, «muhimlik bo'yicha» esa 9.
// Ikki son yonma-yon turadi va o'quvchi farqni O'ZI ko'radi.
import React from 'react'
import { L } from '../../core.jsx'
import { StepOrder } from '../../tools.jsx'
import { ASK_ORDER, RULE_LABEL, YOURS_LABEL } from '../PracticeHost.jsx'

export const META = { id: 't04', level: 'mid', skillTag: 'P2' }

export default function D01_04({ onSolved, disabled }) {
  return (
    <StepOrder
      prompt={ASK_ORDER}
      nums={[7, 36, 9, 2]}
      ops={['+', ':', '·']}
      // Ikkinchi bosqich chapdan o'ngga: 36 : 9, keyin 4 · 2; so'ng 7 + 8.
      ruleOrder={[1, 2, 0]}
      yoursLabel={YOURS_LABEL}
      ruleLabel={RULE_LABEL}
      note={L(
        "Bo'lish va ko'paytirish BIR bosqichda turadi, shuning uchun tartibni muhimlik emas, yozuvdagi O'RIN hal qiladi.",
        'Деление и умножение стоят на ОДНОЙ ступени, поэтому порядок решает не важность, а МЕСТО в записи.',
        'Division and multiplication are on ONE stage, so the order is decided by POSITION in the expression, not importance.',
      )}
      sameNote={L(
        "Bir bosqichda chapdan o'ngga: bo'lish oldin turgani uchun oldin bajarildi.",
        'Внутри одной ступени слева направо: деление стоит раньше, значит и выполняется раньше.',
        'Within one stage, left to right: the division stands earlier, so it runs earlier.',
      )}
      tag="P2"
      disabled={disabled}
      onSolved={onSolved}
    />
  )
}
