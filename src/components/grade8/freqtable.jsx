// ============================================================================
// 8 КЛАСС — ПРИБОР `FreqTable`: XOM MA'LUMOTNI CHASTOTALAR JADVALIGA
// TERISH.
//
// Урок 34. Контракт: darslik 8-sinf algebra, IV bob, 28-§ (188-192-bet).
//
// Xom ma'lumot (variatsion qator) — sonlar qatori, tartibsiz yoki tartiblab
// berilgan. O'quvchi HAR BIR sonni bosadi, u o'z ustuniga TUSHADI va shu
// ustunning chastotasi birga oshadi. Hammasi tushgach, jadval to'liq: bu
// darslikning 3-jadvalidagi ishning aynan o'zi, lekin qog'ozda emas, qo'lda.
// ============================================================================

// eslint-disable-next-line no-unused-vars -- LMS грузит сырой jsx в КЛАССИЧЕСКОМ режиме
import React, { useState } from 'react'
import { L, MATH_FONT, T, useT } from './core.jsx'
import { Fields } from './tools.jsx'

const TXT = {
  raw: L("XOM MA'LUMOT", 'СЫРЫЕ ДАННЫЕ', 'RAW DATA'),
  table: L('CHASTOTALAR JADVALI', 'ТАБЛИЦА ЧАСТОТ', 'FREQUENCY TABLE'),
}

export function FreqTable({ raw, values, fields, note, onSolved, onStep, audio }) {
  const t = useT()
  const [used, setUsed] = useState(() => raw.map(() => false))
  const [counts, setCounts] = useState(() => values.map(() => 0))
  const [done, setDone] = useState(false)

  const left = used.filter((x) => !x).length

  const tap = (i) => {
    if (used[i] || done) return
    const nu = used.slice()
    nu[i] = true
    setUsed(nu)
    const vi = values.indexOf(raw[i])
    const nc = counts.slice()
    nc[vi] = nc[vi] + 1
    setCounts(nc)
    if (nu.every((x) => x)) {
      setDone(true)
      if (onStep) onStep('tally')
    }
  }

  return (
    <>
      <div className="g8-ft">
        <span className="g8-ft-cap">{t(TXT.raw)}</span>
        <div className="g8-ft-raw">
          {raw.map((v, i) => (
            <button key={i} type="button" className={'g8-ft-chip' + (used[i] ? ' is-used' : '')}
              disabled={used[i]} onClick={() => tap(i)} style={{ fontFamily: MATH_FONT }}>{v}</button>
          ))}
        </div>
        <span className="g8-ft-left">
          {left > 0 ? left : (done ? t(TXT.table) : '')}
        </span>

        <div className="g8-ft-cols">
          {values.map((v, i) => (
            <div key={v} className={'g8-ft-col' + (done ? ' is-done' : '')}>
              <span className="g8-ft-vv" style={{ fontFamily: MATH_FONT }}>{v}</span>
              <span className="g8-ft-nn" style={{ fontFamily: MATH_FONT }}>{counts[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {done ? (
        <Fields fields={fields} onSolved={onSolved} audio={audio} note={note}/>
      ) : null}
    </>
  )
}

export const FREQTABLE_STYLES = `
.g8-ft { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 8px; width: 100%; }
.g8-ft-cap { font-family: 'Manrope', system-ui, sans-serif; font-size: 11px; font-weight: 700;
  letter-spacing: .06em; color: ${T.ink3}; }
.g8-ft-raw { display: flex; flex-wrap: wrap; gap: 7px; justify-content: center; max-width: 100%; }
.g8-ft-chip {
  min-width: 40px; min-height: 36px; padding: 0 8px; border: 0; border-radius: 10px;
  background: ${T.accent}; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer;
  box-shadow: 0 6px 14px -10px rgba(${T.accentRgb},.8);
  transition: opacity .25s ease, transform .25s ease;
}
.g8-ft-chip.is-used { opacity: .18; transform: scale(.82); cursor: default;
  background: ${T.ink4}; box-shadow: none; }
.g8-ft-left { font-family: 'Manrope', system-ui, sans-serif; font-size: 12px; color: ${T.ink3}; min-height: 16px; }
.g8-ft-cols { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
.g8-ft-col {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  min-width: 46px; padding: 8px 6px; border-radius: 12px;
  background: ${T.paper}; box-shadow: inset 0 0 0 1px rgba(23,26,29,.06);
}
.g8-ft-vv { font-size: 14px; color: ${T.ink2}; }
.g8-ft-nn { font-size: 20px; font-weight: 700; color: ${T.tip}; }
.g8-ft-col.is-done .g8-ft-nn { color: ${T.ok}; }

@media (max-width: 640px) {
  .g8-ft-chip { min-width: 34px; min-height: 32px; font-size: 13px; }
  .g8-ft-col { min-width: 38px; }
}
`
