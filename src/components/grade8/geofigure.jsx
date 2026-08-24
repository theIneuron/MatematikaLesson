// ============================================================================
// 8 КЛАСС, ГЕОМЕТРИЯ — ПРИБОР `GeoFigure`: CHERTYOZH TAP BILAN.
//
// Блок Б6 (уроки 37+). Контракт ETALON_8SINF.md §7.3, "GeoFigure — чертёж
// с тапом".
//
// Chertyozh UMUMAN QO'LDA chizilmaydi: u vertekslar koordinatalaridan
// quriladi (`points`), shuning uchun uni istalgan shaklga aylantirish va
// TAP joyini MASHINA bilan tekshirish mumkin.
//
// Bir bosqichda BIR TUR nishon buriladi (tomon YOKI burchak), lekin
// `steps` massivi orqali bir necha bosqich ketma-ket qo'yiladi (masalan,
// avval teng tomonlarni, keyin teng burchaklarni belgilash) — natijalar
// (xossalar) ikkisi ham BITTA chertyozhda ko'rinadi.
//
// Chertyozh o'zi hech narsani ISBOTLAMAYDI: u faqat KO'RGAZMA, xulosa
// audio/matnda aytiladi (ETALON §7.2, "правило редакции 2").
// ============================================================================

// eslint-disable-next-line no-unused-vars -- LMS грузит сырой jsx в КЛАССИЧЕСКОМ режиме
import React, { useState } from 'react'
import { L, MATH_FONT, T, useT } from './core.jsx'

const idOf = (a, b) => [a, b].sort().join('')

function edgesOf(order) {
  return order.map((a, i) => [a, order[(i + 1) % order.length]])
}

// Har bir uchning ichkariga qaragan burchak nishonini joylash uchun
// yo'nalish: qo'shni ikki tomon o'rtachasi tomon siljitilgan nuqta.
function angleAnchor(points, order, v) {
  const i = order.indexOf(v)
  const n = order.length
  const prev = points[order[(i - 1 + n) % n]]
  const next = points[order[(i + 1) % n]]
  const here = points[v]
  const mx = (prev[0] + next[0]) / 2
  const my = (prev[1] + next[1]) / 2
  const dx = mx - here[0]
  const dy = my - here[1]
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  return [here[0] + (dx / len) * 14, here[1] + (dy / len) * 14]
}

function GeoStep({ points, order, kind, targets, need, ask, hints, onDone, audio }) {
  const t = useT()
  const [picked, setPicked] = useState([])
  const [note, setNote] = useState(null)
  const goal = need || targets.length
  const done = picked.length >= goal

  const pick = (id) => {
    if (done) return
    if (targets.indexOf(id) !== -1) {
      if (picked.indexOf(id) === -1) {
        const next = picked.concat(id)
        setPicked(next)
        setNote(null)
        if (next.length >= goal && onDone) onDone()
      }
      return
    }
    const h = (hints && hints[id]) || (hints && hints['*'])
    setNote(h || null)
    if (audio && h) audio.say(t(h))
  }

  const poly = order.map((v) => points[v].join(',')).join(' ')

  return (
    <>
      <svg viewBox="0 0 110 100" className="g8-gf-svg" role="img" aria-label="chertyozh">
        <polygon points={poly} fill={T.paper} stroke={T.ink2} strokeWidth="1.2"/>
        {kind === 'edges' ? edgesOf(order).map(([a, b]) => {
          const id = idOf(a, b)
          const p1 = points[a]
          const p2 = points[b]
          const on = picked.indexOf(id) !== -1
          return (
            <g key={id}>
              <line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]}
                stroke={on ? T.ok : T.ink4} strokeWidth={on ? 2.6 : 1.4}
                style={{ transition: 'stroke .25s ease, stroke-width .25s ease' }}/>
              <line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]}
                stroke="transparent" strokeWidth="9" style={{ cursor: done ? 'default' : 'pointer' }}
                onClick={() => pick(id)}/>
            </g>
          )
        }) : null}
        {kind === 'angles' ? order.map((v) => {
          const on = picked.indexOf(v) !== -1
          const [ax, ay] = angleAnchor(points, order, v)
          return (
            <g key={v}>
              <circle cx={ax} cy={ay} r={on ? 4.2 : 3} fill={on ? T.ok : T.graphSoft}
                stroke={on ? T.ok : T.graph} strokeWidth="1.1"/>
              <circle cx={ax} cy={ay} r="8" fill="transparent"
                style={{ cursor: done ? 'default' : 'pointer' }} onClick={() => pick(v)}/>
            </g>
          )
        }) : null}
        {order.map((v) => (
          <text key={v} x={points[v][0]} y={points[v][1]}
            dx={points[v][0] < 55 ? -7 : 7} dy={points[v][1] < 50 ? -4 : 10}
            fontFamily={MATH_FONT} fontSize="7" fill={T.ink} textAnchor="middle">{v}</text>
        ))}
      </svg>
      <span className="g8-gf-ask">{t(ask)}</span>
      <span className="g8-gf-note">{note ? t(note) : ''}</span>
    </>
  )
}

export function GeoFigure({ points, order, steps, after, onSolved, onStep, audio }) {
  const t = useT()
  const [si, setSi] = useState(0)
  const [done, setDone] = useState(false)
  const step = steps[si]

  const next = () => {
    if (onStep) onStep('mark')
    if (si + 1 >= steps.length) {
      setDone(true)
      if (onSolved) onSolved({ correct: true })
    } else {
      setSi(si + 1)
    }
  }

  return (
    <div className="g8-gf">
      <GeoStep key={si} points={points} order={order} kind={step.kind}
        targets={step.targets} need={step.need} ask={step.ask} hints={step.hints}
        onDone={next} audio={audio}/>
      {done && after ? <div className="g8-gf-after">{t(after)}</div> : null}
    </div>
  )
}

export const GEOFIGURE_STYLES = `
.g8-gf { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 8px; width: 100%; }
.g8-gf-svg { width: 100%; max-width: 280px; height: 200px; }
.g8-gf-ask { font-family: 'Manrope', system-ui, sans-serif; font-size: 13px; color: ${T.ink2}; text-align: center; }
.g8-gf-note { font-family: 'Manrope', system-ui, sans-serif; font-size: 12px; color: ${T.tip}; text-align: center; min-height: 16px; }
.g8-gf-after { font-family: 'Manrope', system-ui, sans-serif; font-size: 13px; color: ${T.ok}; text-align: center; }
`
