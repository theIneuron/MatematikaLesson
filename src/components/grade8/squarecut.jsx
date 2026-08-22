// ============================================================================
// 8 КЛАСС — ПРИБОР `SquareCut`: ДОСТРОЕНИЕ ДО ПОЛНОГО КВАДРАТА.
//
// Уроки 17, 22. Контракт ETALON_8SINF.md §7.2 / §7.3.
//
// x² + bx нарисовано как квадрат со стороной x и прилегающий прямоугольник
// b на x. Ученик режет прямоугольник пополам («Kesish») и прикладывает
// половину к нижней стороне квадрата («Biriktirish») — в углу остаётся
// дырка ровно (b/2)². Формула корней перестаёт быть заклинанием: она
// получается достроением, а её вывод ученик проделывает руками.
//
// ДВИЖЕНИЕ ПОЛОВИНЫ — CSS-ПЕРЕХОД НА x/y/width/height САМОГО <rect>, тот же
// приём, что у полосы решений в `twosides.jsx` (`.g8-ts-band`). Прибор не
// рисует одну и ту же геометрию дважды — он меняет атрибуты, и браузер сам
// анимирует смену.
//
// ПОСЛЕ СБОРКИ — числовое поле «чему равна дырка», проверяемое ядром
// (`Fields` из `tools.jsx`, тот же путь accepts/hints, что у остальных
// приборов). Прибор — контролёр: сам не подсказывает значение дырки.
// ============================================================================

// eslint-disable-next-line no-unused-vars -- LMS грузит сырой jsx в КЛАССИЧЕСКОМ режиме
import React, { useState } from 'react'
import { L, MATH_FONT, T, fmt, useT } from './core.jsx'
import { Fields } from './tools.jsx'

const TXT = {
  record: L('Yozuv', 'Запись', 'The record'),
}

const VB_W = 300
const VB_H = 190
const SQ = 104
const HB = 30
const X0 = 42
const Y0 = 16

export function SquareCut({
  b, label, cutLabel, attachLabel, fields, note, onSolved, onStep, audio,
}) {
  const t = useT()
  const [stage, setStage] = useState(0)
  const half = b / 2

  const cut = () => {
    if (stage !== 0) return
    setStage(1)
    if (onStep) onStep('cut')
  }
  const attach = () => {
    if (stage !== 1) return
    setStage(2)
    if (onStep) onStep('attach')
  }

  // Половина, что ОСТАЁТСЯ у правой стороны квадрата: x = X0+SQ, вертикально.
  const stayX = X0 + SQ
  const stayY = Y0
  const stayW = HB
  const stayH = SQ

  // Половина, что ДВИЖЕТСЯ: до приложения — рядом со второй, после —
  // под квадратом, горизонтально. Меняются все четыре атрибута сразу.
  const moveX = stage >= 2 ? X0 : X0 + SQ + HB
  const moveY = stage >= 2 ? Y0 + SQ : Y0
  const moveW = stage >= 2 ? SQ : HB
  const moveH = stage >= 2 ? HB : SQ

  return (
    <>
      <div className="g8-sc">
        {label ? (
          <p className="g8-sc-label" style={{ fontFamily: MATH_FONT }}>
            <span>{t(TXT.record)}</span>{'  '}{label}
          </p>
        ) : null}
        <svg className="g8-sc-svg" viewBox={'0 0 ' + VB_W + ' ' + VB_H}
          preserveAspectRatio="xMidYMid meet" role="img">
          {/* КВАДРАТ x на x */}
          <rect x={X0} y={Y0} width={SQ} height={SQ} className="g8-sc-sq"/>
          <text x={X0 - 10} y={Y0 + SQ / 2 + 4} textAnchor="middle" fontFamily={MATH_FONT}
            fontSize="13" className="g8-sc-lab">x</text>

          {/* ПОЛОСА, ЧТО ОСТАЁТСЯ У КВАДРАТА */}
          <rect x={stayX} y={stayY} width={stayW} height={stayH} className="g8-sc-stay"/>
          {stage === 0 ? (
            <text x={X0 + SQ + HB} y={Y0 - 6} textAnchor="middle" fontFamily={MATH_FONT}
              fontSize="13" className="g8-sc-lab">b</text>
          ) : (
            <text x={stayX + stayW / 2} y={stayY + stayH / 2 + 4} textAnchor="middle"
              fontFamily={MATH_FONT} fontSize="12" className="g8-sc-lab">b/2</text>
          )}

          {/* ПОЛОСА, ЧТО ДВИЖЕТСЯ */}
          <rect x={moveX} y={moveY} width={moveW} height={moveH} className="g8-sc-move"/>
          {stage >= 1 ? (
            <text
              x={moveX + moveW / 2}
              y={moveY + moveH / 2 + 4}
              textAnchor="middle" fontFamily={MATH_FONT} fontSize="12" className="g8-sc-lab g8-sc-move-lab"
            >b/2</text>
          ) : null}

          {/* ЛИНИЯ РАЗРЕЗА между двумя половинами, видна с 1-й стадии */}
          <line x1={X0 + SQ + HB} y1={Y0} x2={X0 + SQ + HB} y2={Y0 + SQ}
            className={'g8-sc-cut' + (stage >= 1 ? ' is-on' : '')}/>

          {/* ДЫРКА В УГЛУ — появляется после приложения */}
          <rect x={X0 + SQ} y={Y0 + SQ} width={HB} height={HB}
            className={'g8-sc-hole' + (stage >= 2 ? ' is-on' : '')}/>
          <text x={X0 + SQ + HB / 2} y={Y0 + SQ + HB / 2 + 4} textAnchor="middle"
            fontFamily={MATH_FONT} fontSize="11"
            className={'g8-sc-holelab' + (stage >= 2 ? ' is-on' : '')}>(b/2)²</text>
        </svg>

        <div className="g8-sc-btns">
          <button type="button" className="g8-sc-btn" disabled={stage !== 0} onClick={cut}>
            {t(cutLabel)}
          </button>
          <button type="button" className="g8-sc-btn" disabled={stage !== 1} onClick={attach}>
            {t(attachLabel)}
          </button>
        </div>
      </div>

      {stage >= 2 ? (
        <Fields fields={fields} onSolved={onSolved} audio={audio} note={note}/>
      ) : null}
    </>
  )
}

export const SQUARECUT_STYLES = `
.g8-sc { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 8px; }
.g8-sc-label { font-size: 15px; color: ${T.ink}; display: flex; gap: 6px; align-items: baseline; }
.g8-sc-label span:first-child { font-family: 'Manrope', system-ui, sans-serif; font-size: 10px;
  letter-spacing: .1em; text-transform: uppercase; color: ${T.ink3}; }
.g8-sc-svg { width: 100%; max-width: 320px; display: block; max-height: 30vh; }
.g8-sc-sq { fill: ${T.graphSoft}; stroke: ${T.graph}; stroke-width: 1.6; }
.g8-sc-stay { fill: ${T.accentSoft}; stroke: ${T.accent}; stroke-width: 1.4; }
.g8-sc-move { fill: ${T.accentSoft}; stroke: ${T.accent}; stroke-width: 1.4;
  transition: x .6s cubic-bezier(.22,.9,.3,1), y .6s cubic-bezier(.22,.9,.3,1),
    width .6s cubic-bezier(.22,.9,.3,1), height .6s cubic-bezier(.22,.9,.3,1); }
.g8-sc-move-lab { transition: x .6s cubic-bezier(.22,.9,.3,1), y .6s cubic-bezier(.22,.9,.3,1); }
.g8-sc-lab { fill: ${T.ink2}; }
.g8-sc-cut { stroke: ${T.tip}; stroke-width: 1.6; stroke-dasharray: 4 4; opacity: 0;
  transition: opacity .3s ease; }
.g8-sc-cut.is-on { opacity: 1; }
.g8-sc-hole { fill: ${T.paper}; stroke: ${T.tip}; stroke-width: 1.6; stroke-dasharray: 3 3;
  opacity: 0; transition: opacity .5s ease .3s; }
.g8-sc-hole.is-on { opacity: 1; }
.g8-sc-holelab { fill: ${T.tip}; font-weight: 700; opacity: 0; transition: opacity .5s ease .5s; }
.g8-sc-holelab.is-on { opacity: 1; }
.g8-sc-btns { display: flex; gap: 10px; }
.g8-sc-btn {
  min-height: 40px; padding: 0 18px; border: 0; border-radius: 11px;
  background: ${T.accent}; color: #fff;
  font-family: 'Manrope', system-ui, sans-serif; font-size: 13px; font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 18px -12px rgba(${T.accentRgb},.8);
}
.g8-sc-btn:disabled { background: ${T.ink4}; box-shadow: none; cursor: default; }

@media (max-width: 640px) {
  .g8-sc-btns { flex-direction: column; width: 100%; }
  .g8-sc-btn { width: 100%; }
}
`
