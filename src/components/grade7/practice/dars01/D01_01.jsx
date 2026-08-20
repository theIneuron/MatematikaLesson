// Dars01 amaliyoti · topshiriq 01 — OSON · tartibni o'quvchi qo'yadi · teg P1
//
// 48 : 8 + 5 · 2. Asbob o'quvchining tartibi bo'yicha ham, qoida bo'yicha ham
// hisoblaydi va ikki sonni YONMA-YON qo'yadi: o'z tartibi 16 ni, ketma-ket
// hisoblash esa 22 ni beradi. «Noto'g'ri» so'zi aytilmaydi.
//
// Bu faylda MEXANIKA YO'Q -- faqat ma'lumot. Asbob `../../tools.jsx` da.
import React from 'react'
import { L } from '../../core.jsx'
import { StepOrder } from '../../tools.jsx'
import { ASK_ORDER, RULE_LABEL, YOURS_LABEL } from '../PracticeHost.jsx'

export const META = { id: 't01', level: 'easy', skillTag: 'P1' }

export default function D01_01({ onSolved, disabled }) {
  return (
    <StepOrder
      prompt={ASK_ORDER}
      nums={[48, 8, 5, 2]}
      ops={[':', '+', '·']}
      // Qoida: avval ikkinchi bosqich chapdan o'ngga (48 : 8, keyin 5 · 2),
      // so'ng birinchi bosqich (6 + 10).
      ruleOrder={[0, 2, 1]}
      yoursLabel={YOURS_LABEL}
      ruleLabel={RULE_LABEL}
      note={L(
        "Bitta yozuv, ikki son. Bo'lish va ko'paytirish qo'shishdan oldin bajariladi.",
        'Одна запись, два числа. Деление и умножение выполняются раньше сложения.',
        'One expression, two numbers. Division and multiplication go before addition.',
      )}
      sameNote={L(
        "Tartib qoida bilan bir xil: ikkinchi bosqich oldin, birinchisi keyin.",
        'Порядок совпал с правилом: вторая ступень раньше, первая позже.',
        'Your order matched the rule: second stage first, first stage after.',
      )}
      tag="P1"
      disabled={disabled}
      onSolved={onSolved}
    />
  )
}
