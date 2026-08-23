// ============================================================================
// 8 КЛАСС — ПРИБОР `ModulusFold`: МОДУЛЬ КАК РАССТОЯНИЕ.
//
// Урок 29. Контракт ETALON_8SINF.md §7.4 (405-410).
//
// |x − c| = r показано на числовой прямой как «точки на расстоянии r от c».
// Ученик тянет раствор (ползунок-радиус) от отмеченной точки c и получает
// ДВЕ засечки — c−r и c+r, симметрично. Модуль перестаёт быть «убрать
// минус» и становится расстоянием: после этого неравенство с модулем
// читается само — |x−c| < r это между засечками, |x−c| > r это снаружи.
//
// РЕЖИМ ОПРЕДЕЛЯЕТ ФИНАЛЬНУЮ ЗАЛИВКУ: 'eq' оставляет две точки, 'lt'
// заливает отрезок МЕЖДУ ними, 'gt' заливает ДВА луча СНАРУЖИ. Прибор один
// на все три случая — различается только props.mode и то, что заливается,
// когда раствор доведён до цели.
//
// ПОСЛЕ ФИКСАЦИИ РАДИУСА — числовое поле ответа (`Fields` из `tools.jsx`,
// тот же путь accepts/hints, что у остальных приборов). Прибор — контролёр:
// сам не называет корни и не подсказывает границы.
// ============================================================================

// eslint-disable-next-line no-unused-vars -- LMS грузит сырой jsx в КЛАССИЧЕСКОМ режиме
import React, { useState } from 'react'
import { L, MATH_FONT, T, useT } from './core.jsx'
import { Fields } from './tools.jsx'

const TXT = {
  radius: L('Rastvor', 'Раствор', 'The span'),
}

const VB_W = 320
const VB_H = 92
const X0 = 26
const LINE_Y = 40

export function ModulusFold({
  min, max, c, cLabel, step = 1, target, mode = 'eq', radiusLabel,
  fields, note, onSolved, onStep, audio,
}) {
  const t = useT()
  const [r, setR] = useState(0)
  const [locked, setLocked] = useState(false)

  const span = max - min
  const xOf = (v) => X0 + ((v - min) / span) * (VB_W - 2 * X0)

  const move = (v) => {
    if (locked) return
    setR(v)
    if (v === target) {
      setLocked(true)
      if (onStep) onStep('fold')
    }
  }

  const left = c - r
  const right = c + r
  const ticks = []
  for (let v = Math.ceil(min); v <= Math.floor(max); v += 1) ticks.push(v)

  return (
    <>
      <div className="g8-mf">
        <svg className="g8-mf-svg" viewBox={'0 0 ' + VB_W + ' ' + VB_H}
          preserveAspectRatio="xMidYMid meet" role="img">
          <line x1={X0} y1={LINE_Y} x2={VB_W - X0} y2={LINE_Y} className="g8-mf-axis"/>

          {/* ЗАЛИВКА: только когда раствор доведён до цели, и только в
              режиме неравенства. Между засечками для 'lt', снаружи для 'gt'. */}
          {locked && mode === 'lt' ? (
            <rect x={xOf(left)} y={LINE_Y - 5} width={xOf(right) - xOf(left)} height="10"
              className="g8-mf-fill"/>
          ) : null}
          {locked && mode === 'gt' ? (
            <>
              <rect x={X0} y={LINE_Y - 5} width={Math.max(0, xOf(left) - X0)} height="10"
                className="g8-mf-fill"/>
              <rect x={xOf(right)} y={LINE_Y - 5} width={Math.max(0, (VB_W - X0) - xOf(right))} height="10"
                className="g8-mf-fill"/>
            </>
          ) : null}

          {ticks.map((v) => (
            <g key={v}>
              <line x1={xOf(v)} y1={LINE_Y - 4} x2={xOf(v)} y2={LINE_Y + 4} className="g8-mf-tick"/>
              <text x={xOf(v)} y={LINE_Y + 18} textAnchor="middle" fontFamily={MATH_FONT}
                fontSize="9" className="g8-mf-ticklab">{v}</text>
            </g>
          ))}

          {/* РАСТВОР: горизонтальная скобка от c−r до c+r, видна с r>0. */}
          {r > 0 ? (
            <line x1={xOf(left)} y1={LINE_Y - 16} x2={xOf(right)} y2={LINE_Y - 16}
              className="g8-mf-span"/>
          ) : null}

          {/* ДВЕ ЗАСЕЧКИ: двигаются вместе с раствором, симметрично c. */}
          <circle cx={xOf(left)} cy={LINE_Y} r="5" className={'g8-mf-mark' + (locked ? ' is-on' : '')}/>
          <circle cx={xOf(right)} cy={LINE_Y} r="5" className={'g8-mf-mark' + (locked ? ' is-on' : '')}/>

          {/* ОТМЕЧЕННАЯ ТОЧКА c: крупнее и другим цветом, всегда на месте. */}
          <circle cx={xOf(c)} cy={LINE_Y} r="6" className="g8-mf-c"/>
          <text x={xOf(c)} y={LINE_Y - 24} textAnchor="middle" fontFamily={MATH_FONT}
            fontSize="13" fontWeight="700" className="g8-mf-clab">{cLabel != null ? cLabel : c}</text>
        </svg>

        <div className={'g8-mf-slider' + (locked ? ' is-done' : '')}>
          <span className="g8-mf-sname">{t(radiusLabel || TXT.radius)}</span>
          <span className="g8-mf-track">
            <input
              type="range"
              min={0}
              max={span}
              step={step}
              value={r}
              disabled={locked}
              aria-label={t(radiusLabel || TXT.radius)}
              onChange={(e) => move(Number(e.target.value))}
            />
          </span>
          <span className="g8-mf-rval" style={{ fontFamily: MATH_FONT }}>{r}</span>
        </div>
      </div>

      {locked ? (
        <Fields fields={fields} onSolved={onSolved} audio={audio} note={note}/>
      ) : null}
    </>
  )
}

export const MODULUSFOLD_STYLES = `
.g8-mf { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 8px; width: 100%; }
.g8-mf-svg { width: 100%; max-width: 360px; display: block; max-height: 22vh; }
.g8-mf-axis { stroke: ${T.ink3}; stroke-width: 1.4; }
.g8-mf-tick { stroke: ${T.ink3}; stroke-width: 1.2; }
.g8-mf-ticklab { fill: ${T.ink3}; }
.g8-mf-span { stroke: ${T.accent}; stroke-width: 1.6;
  transition: x1 .25s ease, x2 .25s ease; }
.g8-mf-mark { fill: ${T.paper}; stroke: ${T.accent}; stroke-width: 2;
  transition: cx .25s ease; }
.g8-mf-mark.is-on { fill: ${T.ok}; stroke: ${T.ok}; }
.g8-mf-c { fill: ${T.tip}; stroke: ${T.tip}; }
.g8-mf-clab { fill: ${T.tip}; }
.g8-mf-fill { fill: rgba(${T.accentRgb},.22); }
.g8-mf-slider { display: flex; align-items: center; gap: 10px; width: 100%; max-width: 360px; }
.g8-mf-sname { font-family: 'Manrope', system-ui, sans-serif; font-size: 12px; font-weight: 700;
  color: ${T.ink2}; white-space: nowrap; }
.g8-mf-track { flex: 1; display: flex; align-items: center; }
.g8-mf-track input { width: 100%; }
.g8-mf-rval { min-width: 22px; text-align: center; font-size: 15px; color: ${T.ink}; }
.g8-mf-slider.is-done .g8-mf-track input { opacity: .5; }

@media (max-width: 640px) {
  .g8-mf-slider { flex-wrap: wrap; justify-content: center; }
}
`
