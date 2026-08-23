// ============================================================================
// 8 КЛАСС — ПРИБОР `TreeBuild`: DARAXT SHOXLARI KO'PAYADI.
//
// Урок 36. Контракт: darslik 8-sinf algebra, 30-31-§ (200-204-bet).
//
// Ikki bosqich buriladi: birinchi bosqichdagi shoxlar soni va har bir
// shoxdan chiqadigan ikkinchi bosqich shoxchalari soni. Daraxt jonli
// chiziladi, va yaproqlar soni (natijalar soni) HAR SAFAR ikkalasining
// ko'paytmasi sifatida hisoblanadi — bu darslikning ko'paytirish qoidasi
// (31-§) aynan shu.
//
// Har ikki bosqichda ham SHOX BO'LMASA (nol), sayohatni yakunlab bo'lmaydi,
// yaproq yo'q: bu tabiiy "o'lik natija" holati.
// ============================================================================

// eslint-disable-next-line no-unused-vars -- LMS грузит сырой jsx в КЛАССИЧЕСКОМ режиме
import React, { useState } from 'react'
import { L, MATH_FONT, T, useT } from './core.jsx'
import { Fields } from './tools.jsx'

const TXT = {
  n1: L('1-bosqich shoxlari', 'ветви 1-го шага', 'branches at step 1'),
  n2: L('2-bosqich shoxchalari', 'ветви 2-го шага', 'branches at step 2'),
  leaves: L('yaproqlar (natijalar)', 'листья (результаты)', 'leaves (outcomes)'),
}

function Fan({ from, count, dy, color }) {
  const out = []
  const spread = Math.min(46, count * 9)
  for (let i = 0; i < count; i += 1) {
    const t = count === 1 ? 0.5 : i / (count - 1)
    const y = from.y + dy - spread + t * spread * 2
    out.push(
      <line key={i} x1={from.x} y1={from.y} x2={from.x + 44} y2={y}
        stroke={color} strokeWidth="1.6" opacity="0.85"/>,
    )
  }
  return out
}

export function TreeBuild({
  n1Start = 2, n1Min = 0, n1Max = 5, n2Start = 2, n2Min = 0, n2Max = 5,
  goals, ask, ask2, broke, zeroNote, stepLabel, fields, note, onSolved, onStep, audio,
}) {
  const t = useT()
  const [n1, setN1] = useState(n1Start)
  const [n2, setN2] = useState(n2Start)
  const [gi, setGi] = useState(0)
  const [hit, setHit] = useState(!goals || !goals.length)
  const [found, setFound] = useState(false)

  const leaves = n1 * n2
  const dead = n1 === 0 || n2 === 0

  const set = (which, next) => {
    const a = which === 1 ? next : n1
    const b = which === 2 ? next : n2
    if (which === 1) setN1(next); else setN2(next)
    const res = a === 0 || b === 0 ? null : a * b
    if (goals && goals.length && !hit && res === (goals[gi] && goals[gi].value)) {
      const last = gi + 1 >= goals.length
      if (last) setHit(true)
      else setGi(gi + 1)
      if (audio && goals[gi].after) audio.say(t(goals[gi].after))
      return
    }
    if (res === null) {
      if (!hit && audio && zeroNote) audio.say(t(zeroNote))
      if (hit && !found) {
        setFound(true)
        if (onStep) onStep('branch')
        if (audio && broke) audio.say(t(broke))
      }
    }
  }

  return (
    <>
      <div className="g8-tb">
        <svg viewBox="0 0 260 140" className="g8-tb-svg">
          <circle cx="26" cy="70" r="9" fill={T.accent}/>
          {!dead ? <Fan from={{ x: 35, y: 70 }} count={n1} dy={0} color={T.graph}/> : null}
          {!dead ? Array.from({ length: n1 }).map((_, i) => {
            const spread = Math.min(46, n1 * 9)
            const ty = n1 === 1 ? 70 : 70 - spread + (i / (n1 - 1)) * spread * 2
            return (
              <g key={i}>
                <circle cx="79" cy={ty} r="6" fill={T.graphSoft} stroke={T.graph} strokeWidth="1.2"/>
                <Fan from={{ x: 85, y: ty }} count={n2} dy={0} color={T.tip}/>
              </g>
            )
          }) : null}
        </svg>

        <div className={'g8-tb-out' + (dead ? ' is-dead' : '')}>
          <span className="g8-tb-cap">{t(TXT.leaves)}</span>
          <span className="g8-tb-val" style={{ fontFamily: MATH_FONT }}>{dead ? '0' : leaves}</span>
        </div>

        <div className="g8-tb-cols">
          <div className="g8-tb-col">
            <span className="g8-tb-cap">{t(TXT.n1)}</span>
            <span className="g8-tb-nn" style={{ fontFamily: MATH_FONT }}>{n1}</span>
            <span className="g8-tb-btns">
              <button type="button" className="g8-tb-btn" disabled={n1 <= n1Min} onClick={() => set(1, n1 - 1)}>{'−'}</button>
              <button type="button" className="g8-tb-btn is-plus" disabled={n1 >= n1Max} onClick={() => set(1, n1 + 1)}>{'+'}</button>
            </span>
          </div>
          <div className="g8-tb-col">
            <span className="g8-tb-cap">{t(TXT.n2)}</span>
            <span className="g8-tb-nn" style={{ fontFamily: MATH_FONT }}>{n2}</span>
            <span className="g8-tb-btns">
              <button type="button" className="g8-tb-btn" disabled={n2 <= n2Min} onClick={() => set(2, n2 - 1)}>{'−'}</button>
              <button type="button" className="g8-tb-btn is-plus" disabled={n2 >= n2Max} onClick={() => set(2, n2 + 1)}>{'+'}</button>
            </span>
          </div>
        </div>

        <span className="g8-tb-ask">
          {found ? '' : t(!hit && goals && goals[gi] ? goals[gi].ask : ask2)}
        </span>
      </div>

      {found ? (
        <Fields fields={fields} onSolved={onSolved} audio={audio} note={note}/>
      ) : null}
    </>
  )
}

export const TREEBUILD_STYLES = `
.g8-tb { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 8px; width: 100%; }
.g8-tb-svg { width: 100%; max-width: 300px; height: 130px; }
.g8-tb-out { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.g8-tb-cap { font-family: 'Manrope', system-ui, sans-serif; font-size: 11px; color: ${T.ink3}; }
.g8-tb-val { font-size: 24px; font-weight: 700; color: ${T.tip}; }
.g8-tb-out.is-dead .g8-tb-val { color: ${T.no}; }
.g8-tb-cols { display: flex; gap: 18px; }
.g8-tb-col { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.g8-tb-nn { font-size: 16px; font-weight: 700; color: ${T.ink}; }
.g8-tb-btns { display: flex; gap: 6px; }
.g8-tb-btn {
  min-width: 38px; min-height: 34px; border: 0; border-radius: 9px;
  background: ${T.accent}; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer;
  box-shadow: 0 6px 14px -10px rgba(${T.accentRgb},.8);
}
.g8-tb-btn:disabled { background: ${T.ink4}; box-shadow: none; cursor: default; }
.g8-tb-ask { font-family: 'Manrope', system-ui, sans-serif; font-size: 13px; color: ${T.ink2}; text-align: center; min-height: 18px; }

@media (max-width: 640px) {
  .g8-tb-cols { gap: 12px; }
}
`
