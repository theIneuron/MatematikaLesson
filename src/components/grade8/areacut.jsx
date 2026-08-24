// ============================================================================
// 8 КЛАСС, ГЕОМЕТРИЯ — ПРИБОР `AreaCut`: KESIB, KO'CHIRIB, TO'RTBURCHAK.
//
// Блок Б6 (уроки 40+). Контракт ETALON_8SINF.md §7.3, "AreaCut — площадь
// перекройкой": фигура режется и складывается заново, формула получается
// достроением, не потому что так написано.
//
// Parallelogramm — siljigan to'g'ri to'rtburchak. Yon tomonni siljitib
// (qirqib, ko'chirib) rostlaganda, chertyozh silliq parallelogrammdan
// to'g'ri to'rtburchakka aylanadi. Bu — 18-mavzuning 1- va 2-xossasi
// (teng shakllar teng yuzli, qismlarga bo'lish yuzni saqlaydi) ko'zga
// ko'rinadigan holi: shakl o'zgaradi, YUZ O'ZGARMAYDI (asos va balandlik
// o'zgarmas turadi).
// ============================================================================

// eslint-disable-next-line no-unused-vars -- LMS грузит сырой jsx в КЛАССИЧЕСКОМ режиме
import React, { useState } from 'react'
import { L, MATH_FONT, T, useT } from './core.jsx'
import { Fields } from './tools.jsx'

const TXT = {
  base: L('asos', 'основание', 'the base'),
  height: L('balandlik', 'высота', 'the height'),
  area: L('yuza', 'площадь', 'the area'),
}

// Chizma o'lchamlari, abstrakt birlik (viewBox 0..180 x 0..120).
const X0 = 30
const Y1 = 95
const SCALE = 3.2

export function AreaCut({
  base, height, shiftStart, shiftMax, shiftStep = 5,
  ask, after, fields, note, onSolved, onStep, audio,
}) {
  const t = useT()
  const [shift, setShift] = useState(shiftStart)
  const [done, setDone] = useState(false)

  const aS = base * SCALE
  const hS = height * SCALE
  const shiftS = shift * SCALE
  const y0 = Y1 - hS

  const A = [X0, Y1]
  const D = [X0 + aS, Y1]
  const B = [X0 + shiftS, y0]
  const C = [X0 + shiftS + aS, y0]
  const P = [X0 + shiftS, Y1]

  const bump = (d) => {
    if (done) return
    const next = Math.max(0, Math.min(shiftMax, shift + d * shiftStep))
    setShift(next)
    if (next === 0) {
      setDone(true)
      if (onStep) onStep('cut')
    }
  }

  const poly = [A, B, C, D].map((p) => p.join(',')).join(' ')

  return (
    <>
      <div className="g8-ac">
        <svg viewBox="0 0 220 120" className="g8-ac-svg" role="img" aria-label="parallelogramm">
          <polygon points={poly} fill={T.graphSoft} stroke={T.ink2} strokeWidth="1.3"/>
          {shift > 0 ? (
            <line x1={B[0]} y1={B[1]} x2={P[0]} y2={P[1]}
              stroke={T.tip} strokeWidth="1" strokeDasharray="3,2"/>
          ) : (
            <rect x={P[0] - 5} y={y0} width="5" height="5" fill="none" stroke={T.ok} strokeWidth="1"/>
          )}
          <text x={(A[0] + D[0]) / 2} y={Y1 + 12} textAnchor="middle" fontFamily={MATH_FONT} fontSize="9" fill={T.ink2}>{base}</text>
          <text x={B[0] - 10} y={(B[1] + P[1]) / 2} textAnchor="middle" fontFamily={MATH_FONT} fontSize="9" fill={T.tip}>{height}</text>
        </svg>

        <div className="g8-ac-out">
          <span className="g8-ac-cap">{t(TXT.area)}</span>
          <span className="g8-ac-val" style={{ fontFamily: MATH_FONT }}>{base * height}</span>
        </div>

        <div className="g8-ac-btns">
          <button type="button" className="g8-ac-btn" disabled={done || shift <= 0} onClick={() => bump(-1)}>
            {t(L("Kesib ko'chiring", 'Отрежь и передвинь', 'Cut and slide'))}
          </button>
        </div>

        <span className="g8-ac-ask">{!done ? t(ask) : ''}</span>
      </div>

      {done ? (
        <>
          {after ? <div className="g8-ac-after">{t(after)}</div> : null}
          <Fields fields={fields} note={note} audio={audio} onSolved={onSolved}/>
        </>
      ) : null}
    </>
  )
}

export const AREACUT_STYLES = `
.g8-ac { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 8px; width: 100%; }
.g8-ac-svg { width: 100%; max-width: 300px; height: 160px; }
.g8-ac-out { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.g8-ac-cap { font-family: 'Manrope', system-ui, sans-serif; font-size: 11px; color: ${T.ink3}; }
.g8-ac-val { font-size: 22px; font-weight: 700; color: ${T.ok}; }
.g8-ac-btns { display: flex; gap: 10px; }
.g8-ac-btn {
  min-height: 42px; padding: 0 18px; border: 0; border-radius: 11px;
  background: ${T.accent}; color: #fff; font-family: 'Manrope', system-ui, sans-serif;
  font-size: 13px; font-weight: 700; cursor: pointer;
  box-shadow: 0 8px 18px -12px rgba(${T.accentRgb},.8);
}
.g8-ac-btn:disabled { background: ${T.ink4}; box-shadow: none; cursor: default; }
.g8-ac-ask { font-family: 'Manrope', system-ui, sans-serif; font-size: 13px; color: ${T.ink2}; text-align: center; min-height: 18px; }
.g8-ac-after { font-size: 13px; color: ${T.ok}; text-align: center; }
`
