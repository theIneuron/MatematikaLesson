// ============================================================================
// 8 КЛАСС, ГЕОМЕТРИЯ — ПРИБОР `SquareSwap`: PIFAGOR TEOREMASINING ISBOTI.
//
// BLOK Б7 (уроки 44+). Katta kvadrat (tomoni a + b) ichida to'rt xil to'g'ri
// burchakli uchburchak (katetlari a va b) ikki xil holatda joylashtirilishi
// mumkin: birinchisida o'rtada qiyshiq c² kvadrat qoladi, ikkinchisida esa
// ikki burchakda a² va b² kvadratlar qoladi. Katta kvadratning o'zi
// o'zgarmadi, demak ikki holatning ochiq yuzi teng: c² = a² + b².
//
// Bu 28-mavzu darslikdagi 174-rasm (a va b qismlar)ning tugmali versiyasi.
// ============================================================================

// eslint-disable-next-line no-unused-vars -- LMS грузит сырой jsx в КЛАССИЧЕСКОМ режиме
import React, { useState } from 'react'
import { L, MATH_FONT, T, useT } from './core.jsx'
import { Fields } from './tools.jsx'

const TXT = {
  swap: L("Qayta joylashtiring", 'Переставь', 'Rearrange'),
}

// Chizma o'lchamlari, abstrakt birlik (viewBox 0..140 x 0..140).
const X0 = 18
const Y0 = 16

export function SquareSwap({
  a, b, ask, after, fields, note, onSolved, onStep, audio,
}) {
  const t = useT()
  const [mode, setMode] = useState('c')
  const done = mode === 'ab'

  const S = a + b
  const U = 100 / S

  const swap = () => {
    if (done) return
    setMode('ab')
    if (onStep) onStep('swap')
  }

  const aU = a * U
  const bU = b * U
  const sU = S * U

  const P0 = [X0, Y0]
  const P1 = [X0 + sU, Y0]
  const P2 = [X0 + sU, Y0 + sU]
  const P3 = [X0, Y0 + sU]
  const Q0 = [X0 + aU, Y0]
  const Q1 = [X0 + sU, Y0 + aU]
  const Q2 = [X0 + bU, Y0 + sU]
  const Q3 = [X0, Y0 + bU]

  const poly = (pts) => pts.map((p) => p.join(',')).join(' ')

  const c2 = a * a + b * b
  const a2 = a * a
  const b2 = b * b

  return (
    <>
      <div className="g8-sw">
        <svg viewBox="0 0 140 140" className="g8-sw-svg" role="img" aria-label="kvadrat">
          <polygon points={poly([P0, P1, P2, P3])} fill="none" stroke={T.ink3} strokeWidth="1.2"/>
          {mode === 'c' ? (
            <>
              <polygon points={poly([Q0, Q1, Q2, Q3])} fill={T.okSoft} stroke={T.ok} strokeWidth="1.3"/>
              <polygon points={poly([P0, Q0, Q3])} fill={T.graphSoft} stroke={T.ink2} strokeWidth="1"/>
              <polygon points={poly([P1, Q1, Q0])} fill={T.graphSoft} stroke={T.ink2} strokeWidth="1"/>
              <polygon points={poly([P2, Q2, Q1])} fill={T.graphSoft} stroke={T.ink2} strokeWidth="1"/>
              <polygon points={poly([P3, Q3, Q2])} fill={T.graphSoft} stroke={T.ink2} strokeWidth="1"/>
              <text x={(Q0[0] + Q1[0] + Q2[0] + Q3[0]) / 4} y={(Q0[1] + Q1[1] + Q2[1] + Q3[1]) / 4 + 3}
                textAnchor="middle" fontFamily={MATH_FONT} fontSize="10" fontWeight="700" fill={T.ok}>c²</text>
            </>
          ) : (
            <>
              <rect x={X0} y={Y0} width={aU} height={aU} fill={T.graphSoft} stroke={T.ink2} strokeWidth="1"/>
              <text x={X0 + aU / 2} y={Y0 + aU / 2 + 3} textAnchor="middle" fontFamily={MATH_FONT} fontSize="10" fontWeight="700" fill={T.graph}>a²</text>
              <rect x={X0 + aU} y={Y0 + aU} width={bU} height={bU} fill={T.accentSoft} stroke={T.accent} strokeWidth="1"/>
              <text x={X0 + aU + bU / 2} y={Y0 + aU + bU / 2 + 3} textAnchor="middle" fontFamily={MATH_FONT} fontSize="10" fontWeight="700" fill={T.accent}>b²</text>
              <polygon points={poly([[X0 + aU, Y0], [X0 + sU, Y0], [X0 + sU, Y0 + aU]])} fill={T.okSoft} stroke={T.ink2} strokeWidth="1"/>
              <polygon points={poly([[X0 + aU, Y0], [X0 + sU, Y0 + aU], [X0 + aU, Y0 + aU]])} fill={T.okSoft} stroke={T.ink2} strokeWidth="1"/>
              <polygon points={poly([[X0, Y0 + aU], [X0 + aU, Y0 + aU], [X0, Y0 + sU]])} fill={T.okSoft} stroke={T.ink2} strokeWidth="1"/>
              <polygon points={poly([[X0 + aU, Y0 + aU], [X0 + aU, Y0 + sU], [X0, Y0 + sU]])} fill={T.okSoft} stroke={T.ink2} strokeWidth="1"/>
            </>
          )}
        </svg>

        <div className="g8-sw-out">
          <span className="g8-sw-cap">{t(L("KATTA KVADRAT", 'БОЛЬШОЙ КВАДРАТ', 'THE BIG SQUARE'))}</span>
          <span className="g8-sw-val" style={{ fontFamily: MATH_FONT }}>{'(a + b)² = ' + (S * S)}</span>
          <span className="g8-sw-sub" style={{ fontFamily: MATH_FONT }}>
            {mode === 'c' ? ('c² = ' + c2) : ('a² + b² = ' + a2 + ' + ' + b2 + ' = ' + (a2 + b2))}
          </span>
        </div>

        <div className="g8-sw-btns">
          <button type="button" className="g8-sw-btn" disabled={done} onClick={swap}>
            {t(TXT.swap)}
          </button>
        </div>

        <span className="g8-sw-ask">{!done ? t(ask) : ''}</span>
      </div>

      {done ? (
        <>
          {after ? <div className="g8-sw-after">{t(after)}</div> : null}
          <Fields fields={fields} note={note} audio={audio} onSolved={onSolved}/>
        </>
      ) : null}
    </>
  )
}

export const SQUARESWAP_STYLES = `
.g8-sw { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 8px; width: 100%; }
.g8-sw-svg { width: 100%; max-width: 260px; height: 220px; }
.g8-sw-out { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.g8-sw-cap { font-family: 'Manrope', system-ui, sans-serif; font-size: 11px; color: ${T.ink3}; }
.g8-sw-val { font-size: 16px; font-weight: 700; color: ${T.ink2}; }
.g8-sw-sub { font-size: 20px; font-weight: 700; color: ${T.ok}; }
.g8-sw-btns { display: flex; gap: 10px; }
.g8-sw-btn {
  min-height: 42px; padding: 0 18px; border: 0; border-radius: 11px;
  background: ${T.accent}; color: #fff; font-family: 'Manrope', system-ui, sans-serif;
  font-size: 13px; font-weight: 700; cursor: pointer;
  box-shadow: 0 8px 18px -12px rgba(${T.accentRgb},.8);
}
.g8-sw-btn:disabled { background: ${T.ink4}; box-shadow: none; cursor: default; }
.g8-sw-ask { font-family: 'Manrope', system-ui, sans-serif; font-size: 13px; color: ${T.ink2}; text-align: center; min-height: 18px; }
.g8-sw-after { font-size: 13px; color: ${T.ok}; text-align: center; }
`
