// ============================================================================
// 8 КЛАСС — ПРИБОР `StandardForm`: SONNING STANDART KO'RINISHI.
//
// Урок 33. Контракт ETALON_8SINF.md §7.5.
//
// Ученик двигает ЗАПЯТУЮ вдоль цифр числа. Показатель степени меняется
// САМ (автоматически, по формуле), а САМО ЧИСЛО (мантисса × 10^показатель)
// остаётся тем же — прибор это и держит как инвариант, не проверяя его
// явно: цифры не меняются, только положение запятой и связанный с ним
// показатель.
//
// ДВА РЕЖИМА:
//   'big'   — большое число (запись начинается как целое, запятая после
//             всех цифр); двигаем запятую ВЛЕВО (кнопка «−»), показатель
//             растёт. Цель — запятая сразу после первой цифры.
//   'small' — маленькое число (цифры — это то, что после исходной запятой,
//             включая ведущие нули); двигаем запятую ВПРАВО (кнопка «+»),
//             показатель падает (уходит в минус). Цель — запятая сразу
//             после первой значащей (не нулевой) цифры.
//
// ПОСЛЕ ФИКСАЦИИ ЗАПЯТОЙ — два числовых поля (мантисса, показатель), тот
// же путь `Fields`/accepts/hints, что у остальных приборов.
// ============================================================================

// eslint-disable-next-line no-unused-vars -- LMS грузит сырой jsx в КЛАССИЧЕСКОМ режиме
import React, { useState } from 'react'
import { L, MATH_FONT, T, useT } from './core.jsx'
import { Fields } from './tools.jsx'

const TXT = {
  left: L('Chapga', 'Влево', 'Left'),
  right: L('O\'ngga', 'Вправо', 'Right'),
  point: L('Vergul', 'Запятая', 'The point'),
  exp: L('Ko\'rsatkich', 'Показатель', 'Exponent'),
}

export function StandardForm({
  digits, mode = 'big', start, target, fields, note, onSolved, onStep, audio,
}) {
  const t = useT()
  const [p, setP] = useState(start)
  const [locked, setLocked] = useState(false)

  const move = (d) => {
    if (locked) return
    const next = Math.max(0, Math.min(digits.length, p + d))
    setP(next)
    if (next === target) {
      setLocked(true)
      if (onStep) onStep('point')
    }
  }

  const exp = mode === 'big' ? (digits.length - p) : -p

  const left = p === 0 ? '0' : digits.slice(0, p).join('')
  const right = p === digits.length ? '0' : digits.slice(p).join('')

  return (
    <>
      <div className="g8-sf">
        <div className="g8-sf-num" style={{ fontFamily: MATH_FONT }}>
          <span className="g8-sf-part">{left}</span>
          <span className={'g8-sf-point' + (locked ? ' is-on' : '')}>,</span>
          <span className="g8-sf-part">{right}</span>
        </div>
        <div className="g8-sf-exp" style={{ fontFamily: MATH_FONT }}>
          <span>{'× 10'}</span>
          <span className="g8-sf-sup">{exp}</span>
        </div>

        <div className={'g8-sf-btns' + (locked ? ' is-done' : '')}>
          <button type="button" className="g8-sf-btn" disabled={locked || p <= 0}
            onClick={() => move(-1)}>{'◂ ' + t(TXT.left)}</button>
          <button type="button" className="g8-sf-btn" disabled={locked || p >= digits.length}
            onClick={() => move(1)}>{t(TXT.right) + ' ▸'}</button>
        </div>
      </div>

      {locked ? (
        <Fields fields={fields} onSolved={onSolved} audio={audio} note={note}/>
      ) : null}
    </>
  )
}

export const STANDARDFORM_STYLES = `
.g8-sf { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 8px; width: 100%; }
.g8-sf-num { display: flex; align-items: baseline; gap: 1px; font-size: clamp(28px, 4vw, 42px);
  color: ${T.ink}; background: ${T.paper}; border-radius: 14px; padding: 10px 20px;
  box-shadow: inset 0 0 0 1px rgba(23,26,29,.06); }
.g8-sf-part { white-space: pre; }
.g8-sf-point { color: ${T.accent}; font-weight: 700; transition: color .3s ease, transform .3s ease; }
.g8-sf-point.is-on { color: ${T.ok}; transform: scale(1.3); }
.g8-sf-exp { display: flex; align-items: flex-start; gap: 2px; font-size: 17px; color: ${T.ink2}; }
.g8-sf-sup { font-size: 12px; transform: translateY(-6px); font-weight: 700; color: ${T.tip}; }
.g8-sf-btns { display: flex; gap: 10px; }
.g8-sf-btn {
  min-height: 40px; padding: 0 16px; border: 0; border-radius: 11px;
  background: ${T.accent}; color: #fff;
  font-family: 'Manrope', system-ui, sans-serif; font-size: 13px; font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 18px -12px rgba(${T.accentRgb},.8);
}
.g8-sf-btn:disabled { background: ${T.ink4}; box-shadow: none; cursor: default; }
.g8-sf-btns.is-done .g8-sf-btn { opacity: .5; }

@media (max-width: 640px) {
  .g8-sf-btns { flex-direction: column; width: 100%; }
  .g8-sf-btn { width: 100%; }
}
`
