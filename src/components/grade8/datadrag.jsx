// ============================================================================
// 8 КЛАСС — ПРИБОР `DataDrag`: O'RTA QIYMAT KETADI, MEDIANA TURADI.
//
// Урок 35. Контракт ETALON_8SINF.md: «среднее уезжает, медиана стоит».
//
// Yetti son turgan joyida qoladi, bittasi (oxirgisi) tugma bilan suriladi.
// O'rta qiymat HAR safar o'zgaradi (yig'indi o'zgargani uchun). Mediana esa
// son eng kattasi bo'lib qolar ekan, QATOR O'RTASIDAGI ikki songa tayanadi
// va o'zgarmaydi — toki suriladigan son shu ikki son orasiga TUSHMAGUNCHA.
// Shu ikki bosqich (mediana qimirlamaydi, keyin qimirlaydi) pribor ichida
// ikki alohida holat sifatida kuzatiladi.
// ============================================================================

// eslint-disable-next-line no-unused-vars -- LMS грузит сырой jsx в КЛАССИЧЕСКОМ режиме
import React, { useState } from 'react'
import { L, MATH_FONT, T, useT } from './core.jsx'
import { Fields } from './tools.jsx'

const TXT = {
  mean: L("o'rta qiymat", 'среднее значение', 'the mean'),
  median: L('mediana', 'медиана', 'the median'),
}

function stats(fixed, point) {
  const all = fixed.concat([point]).sort((a, b) => a - b)
  const n = all.length
  const mean = Math.round((all.reduce((s, x) => s + x, 0) / n) * 100) / 100
  const median = n % 2 === 0
    ? Math.round(((all[n / 2 - 1] + all[n / 2]) / 2) * 100) / 100
    : all[(n - 1) / 2]
  return { mean, median }
}

export function DataDrag({
  fixed, start, min, max, step = 1, goals, ask, ask2, freezeNote, moveNote,
  stepLabel, fields, note, onSolved, onStep, audio,
}) {
  const t = useT()
  const [point, setPoint] = useState(start)
  const [gi, setGi] = useState(0)
  const [hit, setHit] = useState(!goals || !goals.length)
  const [moved, setMoved] = useState(false)
  const startMedian = stats(fixed, start).median

  const cur = stats(fixed, point)

  const bump = (d) => {
    const next = Math.max(min, Math.min(max, point + d * step))
    setPoint(next)
    const s = stats(fixed, next)
    if (!hit && goals && goals[gi] && Math.abs(s.mean - goals[gi].mean) < 0.005) {
      const last = gi + 1 >= goals.length
      if (last) setHit(true)
      else setGi(gi + 1)
      if (audio && goals[gi].after) audio.say(t(goals[gi].after))
      return
    }
    if (hit && !moved && s.median !== startMedian) {
      setMoved(true)
      if (onStep) onStep('shift')
      if (audio && moveNote) audio.say(t(moveNote))
    }
  }

  return (
    <>
      <div className="g8-dd">
        <div className="g8-dd-row" style={{ fontFamily: MATH_FONT }}>
          {fixed.map((v, i) => <span key={i} className="g8-dd-pt">{v}</span>)}
          <span className="g8-dd-pt is-live">{point}</span>
        </div>

        <div className="g8-dd-out">
          <div className="g8-dd-cell">
            <span className="g8-dd-cap">{t(TXT.mean)}</span>
            <span className="g8-dd-val" style={{ fontFamily: MATH_FONT }}>{cur.mean}</span>
          </div>
          <div className={'g8-dd-cell' + (moved ? ' is-shift' : '')}>
            <span className="g8-dd-cap">{t(TXT.median)}</span>
            <span className="g8-dd-val" style={{ fontFamily: MATH_FONT }}>{cur.median}</span>
          </div>
        </div>

        <div className="g8-dd-btns">
          <button type="button" className="g8-dd-btn" disabled={point <= min}
            onClick={() => bump(-1)}>{'−'}</button>
          <button type="button" className="g8-dd-btn is-plus" disabled={point >= max}
            onClick={() => bump(1)}>{'+'}</button>
        </div>

        <span className="g8-dd-ask">
          {t(!hit && goals && goals[gi] ? goals[gi].ask : (moved ? '' : (hit ? ask2 : ask)))}
        </span>
      </div>

      {moved ? (
        <Fields fields={fields} onSolved={onSolved} audio={audio} note={note}/>
      ) : null}
    </>
  )
}

export const DATADRAG_STYLES = `
.g8-dd { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 8px; width: 100%; }
.g8-dd-row { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
.g8-dd-pt {
  min-width: 38px; text-align: center; padding: 6px 4px; border-radius: 10px;
  background: ${T.paper}; font-size: 15px; color: ${T.ink2};
  box-shadow: inset 0 0 0 1px rgba(23,26,29,.06);
}
.g8-dd-pt.is-live { background: ${T.accent}; color: #fff; font-weight: 700; }
.g8-dd-out { display: flex; gap: 14px; }
.g8-dd-cell { display: flex; flex-direction: column; align-items: center; gap: 3px; min-width: 84px; }
.g8-dd-cap { font-family: 'Manrope', system-ui, sans-serif; font-size: 11px; color: ${T.ink3}; }
.g8-dd-val { font-size: 22px; font-weight: 700; color: ${T.tip}; transition: color .3s ease; }
.g8-dd-cell.is-shift .g8-dd-val { color: ${T.ok}; }
.g8-dd-btns { display: flex; gap: 10px; }
.g8-dd-btn {
  min-width: 52px; min-height: 40px; border: 0; border-radius: 11px;
  background: ${T.accent}; color: #fff; font-size: 18px; font-weight: 700; cursor: pointer;
  box-shadow: 0 8px 18px -12px rgba(${T.accentRgb},.8);
}
.g8-dd-btn:disabled { background: ${T.ink4}; box-shadow: none; cursor: default; }
.g8-dd-ask { font-family: 'Manrope', system-ui, sans-serif; font-size: 13px; color: ${T.ink2}; text-align: center; min-height: 18px; }

@media (max-width: 640px) {
  .g8-dd-pt { min-width: 32px; font-size: 13px; }
  .g8-dd-out { gap: 10px; }
}
`
