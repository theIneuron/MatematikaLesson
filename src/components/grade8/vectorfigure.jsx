// ============================================================================
// 8 КЛАСС, ГЕОМЕТРИЯ — ПРИБОР `VectorFigure`: YO'NALTIRILGAN KESMA TAP BILAN.
//
// BLOK Б7, VEKTOR QISMI (уроки 53+). `GeoFigure` tomonlar yo'nalishsiz edi;
// vektorda yo'nalish MUHIM — AB va BA boshqa-boshqa vektor. Shuning uchun
// alohida pribor: har bir "vector" [boshi, uchi] juftligi, id TARTIBGA
// BOG'LIQ (idOf('A','B') != idOf('B','A')).
// ============================================================================

// eslint-disable-next-line no-unused-vars -- LMS грузит сырой jsx в КЛАССИЧЕСКОМ режиме
import React, { useState } from 'react'
import { L, MATH_FONT, T, useT } from './core.jsx'

const idOf = (a, b) => a + b

export function VectorFigure({ points, vectors, target, ask, hints, after, onSolved, onStep, audio }) {
  const t = useT()
  const [picked, setPicked] = useState(null)
  const [note, setNote] = useState(null)
  const targetId = idOf(target[0], target[1])
  const done = picked === targetId

  const pick = (id) => {
    if (done) return
    if (id === targetId) {
      setPicked(id)
      setNote(null)
      if (onStep) onStep('vec')
      if (onSolved) onSolved({ correct: true })
      return
    }
    const h = (hints && hints[id]) || (hints && hints['*'])
    setNote(h || null)
    if (audio && h) audio.say(t(h))
  }

  return (
    <div className="g8-vf">
      <svg viewBox="0 0 110 100" className="g8-vf-svg" role="img" aria-label="vektorlar">
        {vectors.map(([from, to]) => {
          const id = idOf(from, to)
          const [x1, y1] = points[from]
          const [x2, y2] = points[to]
          const on = picked === id
          const dx = x2 - x1
          const dy = y2 - y1
          const len = Math.sqrt(dx * dx + dy * dy) || 1
          const ux = dx / len
          const uy = dy / len
          const ax = x2 - ux * 6
          const ay = y2 - uy * 6
          const px = -uy
          const py = ux
          const wing = 2.6
          const head = `${x2},${y2} ${ax + px * wing},${ay + py * wing} ${ax - px * wing},${ay - py * wing}`
          return (
            <g key={id}>
              <line x1={x1} y1={y1} x2={ax} y2={ay}
                stroke={on ? T.ok : T.ink3} strokeWidth={on ? 2.4 : 1.6}
                style={{ transition: 'stroke .25s ease, stroke-width .25s ease' }}/>
              <polygon points={head} fill={on ? T.ok : T.ink3}/>
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="transparent" strokeWidth="10"
                style={{ cursor: done ? 'default' : 'pointer' }}
                onClick={() => pick(id)}/>
            </g>
          )
        })}
        {Object.keys(points).map((name) => {
          const [x, y] = points[name]
          return (
            <g key={name}>
              <circle cx={x} cy={y} r="1.8" fill={T.ink}/>
              <text x={x} y={y} dx={x < 55 ? -7 : 7} dy={y < 50 ? -4 : 10}
                textAnchor="middle" fontFamily={MATH_FONT} fontSize="8" fill={T.ink}>{name}</text>
            </g>
          )
        })}
      </svg>
      <span className="g8-vf-ask">{t(ask)}</span>
      <span className="g8-vf-note">{note ? t(note) : ''}</span>
      {done && after ? <div className="g8-vf-after">{t(after)}</div> : null}
    </div>
  )
}

export const VECTORFIGURE_STYLES = `
.g8-vf { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 8px; width: 100%; }
.g8-vf-svg { width: 100%; max-width: 260px; height: 220px; }
.g8-vf-ask { font-family: 'Manrope', system-ui, sans-serif; font-size: 13px; color: ${T.ink2}; text-align: center; }
.g8-vf-note { font-family: 'Manrope', system-ui, sans-serif; font-size: 12px; color: ${T.tip}; text-align: center; min-height: 16px; }
.g8-vf-after { font-family: 'Manrope', system-ui, sans-serif; font-size: 13px; color: ${T.ok}; text-align: center; }
`
