// ============================================================================
// 8 КЛАСС — ПРИБОР `FactorPair`: ПАРА ПО СУММЕ И ПРОИЗВЕДЕНИЮ.
//
// Уроки 19, 22. Контракт ETALON_8SINF.md §7.2 / §7.3.
//
// Ученик ставит два числа в две ячейки; прибор считает их сумму и
// произведение и сравнивает с нужными. ДИАГНОСТИКА ТОЧЕЧНАЯ: видно, какая
// из двух величин не сошлась. «Сумма верна, произведение нет» — это другая
// ошибка, чем «обе мимо», и разбор у них разный (передаётся уроком, прибор
// сам слов не придумывает). Теорема Виета проверяется подбором, а не
// заучиванием знаков.
// ============================================================================

// eslint-disable-next-line no-unused-vars -- LMS грузит сырой jsx в КЛАССИЧЕСКОМ режиме
import React, { useState } from 'react'
import { Ask, L, MATH_FONT, Note, Slot, T, fmt, useInstructionGate, useSfx, useT } from './core.jsx'
import { MathField } from './math.jsx'

const TXT = {
  sumLabel: L("Yig'indi", 'Сумма', 'Sum'),
  prodLabel: L("Ko'paytma", 'Произведение', 'Product'),
  check: L('Tekshirish', 'Проверить', 'Check'),
}

const EPS = 1e-9

export function FactorPair({
  target, cellLabels, ask, hintSumOff, hintProductOff, hintBothOff, after, note, onSolved, onStep, audio,
}) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [tries, setTries] = useState(0)
  const [done, setDone] = useState(false)
  const [msg, setMsg] = useState(null)
  const [last, setLast] = useState(null)

  const check = () => {
    if (done) return
    const na = Number(String(a).replace(',', '.'))
    const nb = Number(String(b).replace(',', '.'))
    if (!Number.isFinite(na) || !Number.isFinite(nb)) return
    const sum = na + nb
    const product = na * nb
    const sumOk = Math.abs(sum - target.sum) < EPS
    const prodOk = Math.abs(product - target.product) < EPS
    setLast({ sum, product, sumOk, prodOk })
    const attempt = tries + 1
    setTries(attempt)
    if (onStep) onStep('v' + attempt)

    if (sumOk && prodOk) {
      setDone(true)
      setMsg(after || null)
      sfx.playCorrect()
      if (audio && after) audio.say(t(after))
      if (onSolved) onSolved({ correct: true, tries: attempt })
      return
    }
    sfx.playWrong()
    const why = !sumOk && !prodOk ? hintBothOff : !sumOk ? hintSumOff : hintProductOff
    setMsg(why || null)
    if (audio && why) audio.say(t(why))
  }

  return (
    <>
      <Slot mh={50}>
        <Ask>{t(ask)}</Ask>
      </Slot>

      <div className="g8-fp">
        <div className="g8-fp-cells">
          <MathField
            kind="number" width={68}
            label={cellLabels ? cellLabels[0] : undefined}
            value={a} onChange={setA} disabled={done || !canAnswer}
          />
          <MathField
            kind="number" width={68}
            label={cellLabels ? cellLabels[1] : undefined}
            value={b} onChange={setB} disabled={done || !canAnswer}
          />
          <button
            type="button" className="g8-fp-go"
            disabled={done || !canAnswer || !String(a).trim() || !String(b).trim()}
            onClick={check}
          >
            {t(TXT.check)}
          </button>
        </div>

        {last ? (
          <div className="g8-fp-out">
            <span className={'g8-fp-chip' + (last.sumOk ? ' is-ok' : ' is-no')}>
              <i>{t(TXT.sumLabel)}</i>{' '}{fmt(last.sum)}
            </span>
            <span className={'g8-fp-chip' + (last.prodOk ? ' is-ok' : ' is-no')}>
              <i>{t(TXT.prodLabel)}</i>{' '}{fmt(last.product)}
            </span>
          </div>
        ) : null}
      </div>

      <Slot mh={48}>
        <Note kind={done ? 'ok' : msg ? 'no' : 'plain'}>{msg ? t(msg) : (done && note ? t(note) : null)}</Note>
      </Slot>
    </>
  )
}

export const FACTORPAIR_STYLES = `
.g8-fp { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100%; }
.g8-fp-cells { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; }
.g8-fp-go {
  min-height: 40px; padding: 0 16px; border: 0; border-radius: 11px;
  background: ${T.accent}; color: #fff;
  font-family: 'Manrope', system-ui, sans-serif; font-size: 13px; font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 18px -12px rgba(${T.accentRgb},.8);
}
.g8-fp-go:disabled { background: ${T.ink4}; box-shadow: none; cursor: default; }
.g8-fp-out { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.g8-fp-chip {
  display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 10px;
  font-family: ${MATH_FONT}; font-size: 14px; background: ${T.paper};
  box-shadow: inset 0 0 0 1px rgba(23,26,29,.08);
}
.g8-fp-chip i { font-style: normal; font-family: 'Manrope', system-ui, sans-serif; font-size: 10px;
  letter-spacing: .06em; text-transform: uppercase; color: ${T.ink3}; }
.g8-fp-chip.is-ok { box-shadow: inset 0 0 0 2px rgba(${T.okRgb},.5); color: ${T.ok}; }
.g8-fp-chip.is-no { box-shadow: inset 0 0 0 2px rgba(${T.tipRgb},.45); color: ${T.tip}; }

@media (max-width: 640px) {
  .g8-fp-cells { width: 100%; }
  .g8-fp-go { width: 100%; }
}
`
