// ============================================================================
// 8 КЛАСС, ГЕОМЕТРИЯ — ПРИБОР `CircleFigure`: AYLANA CHERTYOZHI TAP BILAN.
//
// BLOK Б7, AYLANA QISMI (уроки 48+). `GeoFigure` ko'pburchak uchun edi,
// aylanada tomon yo'q, YOY bor — shuning uchun alohida pribor. Nuqtalar
// aylana bo'ylab BURCHAK (gradus) bilan joylashadi, markaz O doim markazda.
//
// Bitta juft nuqta uchun IKKI yoy bor (kichik va katta), ular ikkalasi ham
// bosiladigan holda chiziladi — o'quvchi TO'G'RI yoyni bosishi kerak.
// ============================================================================

// eslint-disable-next-line no-unused-vars -- LMS грузит сырой jsx в КЛАССИЧЕСКОМ режиме
import React, { useState } from 'react'
import { L, MATH_FONT, T, useT } from './core.jsx'

const CX = 55
const CY = 55
const R = 38

const pos = (deg) => {
  const rad = (deg * Math.PI) / 180
  return [CX + R * Math.cos(rad), CY + R * Math.sin(rad)]
}

const labelPos = (deg) => {
  const rad = (deg * Math.PI) / 180
  return [CX + (R + 10) * Math.cos(rad), CY + (R + 10) * Math.sin(rad)]
}

// Ikki nuqta orasidagi yoy yo'lini quradi. sweep=1 — a dan b ga, gradus
// ORTIB boruvchi yo'nalishda (ekranda soat yo'nalishi bo'yicha).
function arcPath(aDeg, bDeg, sweep) {
  const [ax, ay] = pos(aDeg)
  const [bx, by] = pos(bDeg)
  const span = sweep === 1
    ? ((bDeg - aDeg) % 360 + 360) % 360
    : ((aDeg - bDeg) % 360 + 360) % 360
  const large = span > 180 ? 1 : 0
  if (sweep === 1) return `M ${ax} ${ay} A ${R} ${R} 0 ${large} 1 ${bx} ${by}`
  return `M ${ax} ${ay} A ${R} ${R} 0 ${large} 0 ${bx} ${by}`
}

function whichOf(aDeg, bDeg, sweep) {
  const span = sweep === 1
    ? ((bDeg - aDeg) % 360 + 360) % 360
    : ((aDeg - bDeg) % 360 + 360) % 360
  return span > 180 ? 'major' : 'minor'
}

export function CircleFigure({
  points, radii = [], chords = [], pair, target, ask, hints, after, onSolved, onStep, audio,
}) {
  const t = useT()
  const [picked, setPicked] = useState(null)
  const [note, setNote] = useState(null)
  const done = picked === target

  const pick = (which) => {
    if (done) return
    if (which === target) {
      setPicked(which)
      setNote(null)
      if (onStep) onStep('arc')
      if (onSolved) onSolved({ correct: true })
      return
    }
    const h = (hints && hints[which]) || (hints && hints['*'])
    setNote(h || null)
    if (audio && h) audio.say(t(h))
  }

  const [aName, bName] = pair || []
  const aDeg = aName ? points[aName] : null
  const bDeg = bName ? points[bName] : null

  return (
    <div className="g8-cf">
      <svg viewBox="0 0 110 110" className="g8-cf-svg" role="img" aria-label="aylana">
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={T.ink4} strokeWidth="1.2"/>

        {pair && aDeg !== null && bDeg !== null ? [0, 1].map((sweep) => {
          const which = whichOf(aDeg, bDeg, sweep)
          const on = picked === which
          const d = arcPath(aDeg, bDeg, sweep)
          return (
            <g key={sweep}>
              <path d={d} fill="none" stroke={on ? T.ok : T.graphSoft}
                strokeWidth={on ? 3.4 : 2.4}
                style={{ transition: 'stroke .25s ease, stroke-width .25s ease' }}/>
              <path d={d} fill="none" stroke="transparent" strokeWidth="10"
                style={{ cursor: done ? 'default' : 'pointer' }}
                onClick={() => pick(which)}/>
            </g>
          )
        }) : null}

        {radii.map((name) => {
          const [x, y] = pos(points[name])
          return <line key={'r' + name} x1={CX} y1={CY} x2={x} y2={y} stroke={T.ink3} strokeWidth="1.2"/>
        })}
        {chords.map(([p1, p2]) => {
          const [x1, y1] = pos(points[p1])
          const [x2, y2] = pos(points[p2])
          return <line key={p1 + p2} x1={x1} y1={y1} x2={x2} y2={y2} stroke={T.ink3} strokeWidth="1.2" strokeDasharray="3,2"/>
        })}

        <circle cx={CX} cy={CY} r="1.6" fill={T.ink2}/>
        <text x={CX} y={CY - 5} textAnchor="middle" fontFamily={MATH_FONT} fontSize="7" fill={T.ink}>O</text>

        {Object.keys(points).map((name) => {
          const [x, y] = pos(points[name])
          const [lx, ly] = labelPos(points[name])
          return (
            <g key={name}>
              <circle cx={x} cy={y} r="1.8" fill={T.ink}/>
              <text x={lx} y={ly + 2} textAnchor="middle" fontFamily={MATH_FONT} fontSize="8" fill={T.ink}>{name}</text>
            </g>
          )
        })}
      </svg>
      <span className="g8-cf-ask">{t(ask)}</span>
      <span className="g8-cf-note">{note ? t(note) : ''}</span>
      {done && after ? <div className="g8-cf-after">{t(after)}</div> : null}
    </div>
  )
}

export const CIRCLEFIGURE_STYLES = `
.g8-cf { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 8px; width: 100%; }
.g8-cf-svg { width: 100%; max-width: 260px; height: 220px; }
.g8-cf-ask { font-family: 'Manrope', system-ui, sans-serif; font-size: 13px; color: ${T.ink2}; text-align: center; }
.g8-cf-note { font-family: 'Manrope', system-ui, sans-serif; font-size: 12px; color: ${T.tip}; text-align: center; min-height: 16px; }
.g8-cf-after { font-family: 'Manrope', system-ui, sans-serif; font-size: 13px; color: ${T.ok}; text-align: center; }
`
