// ============================================================================
// 8 КЛАСС — ПРИБОР `ZoomLine`: ЛУПА НА ЧИСЛОВОЙ ПРЯМОЙ.
//
// Механика блока Б2 (уроки 9, 10, 14) и урока 30. Контракт ETALON_8SINF.md §7.3.
//
// Зачем прибор. Иррациональность в учебниках даётся определением в рамке:
// «число, которое нельзя записать дробью». Определение ученик запоминает и
// продолжает считать, что корень из двух это 1,41. Лупа показывает другое:
// ученик увеличивает отрезок, метка каждый раз остаётся ВНУТРИ и никогда не
// ложится на деление. Процесс уточнения не заканчивается — и это видно, а не
// сказано.
//
// Тот же прибор берёт приближённые вычисления (урок 30): там значение НА
// деление ложится, и разница между двумя случаями видна одним движением.
//
// ЗНАЧЕНИЕ СЧИТАЕТСЯ ИЗ ЗАПИСИ, а не приходит числом из данных урока: автор
// не может ошибиться в цифрах после запятой, потому что он их не пишет.
// Правило то же, что у графика (§7.2 п. 1) и у лестницы степеней.
// ============================================================================

// eslint-disable-next-line no-unused-vars -- LMS грузит сырой jsx в КЛАССИЧЕСКОМ режиме
import React, { useState } from 'react'
import { Ask, L, MATH_FONT, Note, Slot, T, useInstructionGate, useSfx, useShuffled, useT } from './core.jsx'
import { valueAt } from './mathcore.js'

const TXT = {
  zoom: L('Kattalashtirish', 'Приблизить', 'Zoom in'),
  between: L('Metka shu ikki son orasida', 'Метка между этими числами', 'The mark is between these two'),
  depth: L('kattalashtirish', 'увеличение', 'zoom'),
}

const VB = 420
const TICKS = 10

// Сколько знаков после запятой на этой глубине: шаг 0,1 — один знак, 0,01 — два.
const digitsOf = (step) => Math.max(0, Math.round(-Math.log10(step)))

// Подпись берёт МИНИМАЛЬНОЕ нужное число знаков: у концов отрезка их меньше,
// чем у делений внутри. Без обрезки хвостов выходило «1,4140», хотя это 1,414,
// и ученик читал лишнюю цифру как значащую.
const show = (v, step) => {
  const s = v.toFixed(digitsOf(step)).replace(/0+$/, '').replace(/\.$/, '')
  return s.replace('.', ',')
}

// ============================================================
// ОТРЕЗОК. Деления через равные промежутки, метка стоит там, где ей место по
// значению. Ни одно деление не подписывается «примерно»: подписи честные.
// ============================================================
function Segment({ lo, step, value, hi }) {
  const t = useT()
  const px = (v) => 26 + ((v - lo) / (hi - lo)) * (VB - 52)
  const ticks = []
  for (let i = 0; i <= TICKS; i += 1) ticks.push(lo + i * step)
  // Подписываем только концы и середину: одиннадцать подписей на 390 слипаются.
  const labelled = (i) => i === 0 || i === TICKS || i === TICKS / 2

  return (
    <svg className="g8-zl-line" viewBox={'0 0 ' + VB + ' 74'} preserveAspectRatio="xMidYMid meet"
      role="img" aria-label={t(TXT.between)}>
      <line x1="14" y1="34" x2={VB - 14} y2="34" className="g8-zl-ax"/>
      {ticks.map((v, i) => (
        <g key={i}>
          <line x1={px(v)} y1={labelled(i) ? 24 : 28} x2={px(v)} y2={labelled(i) ? 44 : 40}
            className="g8-zl-tick"/>
          {labelled(i) ? (
            <text x={px(v)} y="60" textAnchor="middle" className="g8-zl-num"
              style={{ fontFamily: MATH_FONT }}>{show(v, step)}</text>
          ) : null}
        </g>
      ))}
      {/* МЕТКА: линия и точка. Она НЕ подписывается числом — иначе прибор
          сам скажет ответ, которого ученик ещё не получил. */}
      <g className="g8-zl-mark">
        <line x1={px(value)} y1="14" x2={px(value)} y2="52"/>
        <circle cx={px(value)} cy="34" r="4.6"/>
      </g>
    </svg>
  )
}

// ============================================================
// props:
//   expr    — запись, из которой считается значение, например sqrt(2);
//   label   — как эта запись выглядит на экране;
//   depth   — сколько увеличений разрешено;
//   ask     — вопрос, он появляется ПОСЛЕ последнего увеличения;
//   items   — варианты ответа с разбором на каждый неверный;
//   after   — что сказать, когда ответ верен.
// ============================================================
export function ZoomLine({
  expr, label, depth = 3, ask, items, after, note, onSolved, onStep, audio,
}) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  // `valueAt` отдаёт ОБЪЕКТ с полем value: ядро возвращает и разбор ошибки,
  // а не только число.
  const read = valueAt(expr, {})
  const value = read && typeof read.value === 'number' ? read.value : 0
  const start = Math.floor(value)

  const [lo, setLo] = useState(start)
  const [step, setStep] = useState(0.1)
  const [n, setN] = useState(0)
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [msg, setMsg] = useState(null)

  const hi = lo + step * TICKS
  const last = n >= depth
  // Variantlar aralashadi (bag-report 2026-08-26, 4-bag).
  const opts = useShuffled(items)

  const zoom = () => {
    if (last) return
    // Ищем деление, ЛЕВЕЕ которого метка не лежит: она всегда внутри одного
    // из десяти промежутков, и увеличиваем именно его.
    const k = Math.min(TICKS - 1, Math.floor((value - lo) / step + 1e-9))
    setLo(lo + k * step)
    setStep(step / 10)
    setN(n + 1)
    sfx.playCorrect()
    if (onStep) onStep('z' + (n + 1))
  }

  const pick = (it) => {
    if (picked) return
    if (it.right) {
      setPicked(it.id)
      setMsg(after || null)
      sfx.playCorrect()
      if (audio && after) audio.say(t(after))
      if (onSolved) onSolved({ correct: true, tries: wrong.length + 1 })
      return
    }
    setWrong((p) => (p.indexOf(it.id) === -1 ? p.concat(it.id) : p))
    setMsg(it.hint || null)
    sfx.playWrong()
    if (audio && it.hint) audio.say(t(it.hint))
  }

  return (
    <>
      <div className="g8-frame g8-zl">
        <div className="g8-zl-head" style={{ fontFamily: MATH_FONT }}>
          <span className="g8-zl-name">{label}</span>
          <span className="g8-zl-brk">
            {show(lo, step)}{'  <  '}{label}{'  <  '}{show(hi, step)}
          </span>
        </div>
        <Segment lo={lo} step={step} hi={hi} value={value}/>
        <div className="g8-zl-foot">
          <span className="g8-zl-depth">{t(TXT.depth)} {n} / {depth}</span>
          <button
            type="button"
            className="g8-zl-btn"
            disabled={last || !canAnswer}
            onClick={zoom}
          >
            {t(TXT.zoom)}
          </button>
        </div>
      </div>

      {/* ВОПРОС ТОЛЬКО ПОСЛЕ ПОСЛЕДНЕГО УВЕЛИЧЕНИЯ: пока ученик увеличивает,
          он собирает наблюдение, и спрашивать его рано. */}
      <Slot mh={last ? 40 : 0}>
        {last ? <Ask>{t(ask)}</Ask> : null}
      </Slot>

      <Slot mh={last && !picked ? 96 : 0}>
        {last && !picked ? (
          <div className="g8-zl-opts">
            {opts.map((i) => (
              <button
                key={i.id}
                data-id={i.id}
                type="button"
                className={'g8-opt' + (wrong.indexOf(i.id) !== -1 ? ' g8-opt-tip' : '')}
                disabled={!canAnswer}
                onClick={() => pick(i)}
              >
                {t(i.label)}
              </button>
            ))}
          </div>
        ) : null}
      </Slot>

      <Slot mh={48}>
        <Note kind={picked ? 'ok' : 'no'}>{msg ? t(msg) : (picked && note ? t(note) : null)}</Note>
      </Slot>
    </>
  )
}

// ============================================================
// CSS. ВНИМАНИЕ: строка шаблонная — обратная кавычка или обратный слэш внутри
// неё, даже в комментарии, дают белую страницу без объяснения причины.
// ============================================================
export const ZOOM_STYLES = `
.g8-zl { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 8px; }
.g8-zl-head { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.g8-zl-name { font-size: 20px; color: ${T.ink}; }
.g8-zl-brk { font-size: 15px; color: ${T.graph}; white-space: pre; }
.g8-zl-line { width: 100%; max-width: 420px; display: block; max-height: 12vh; }
.g8-zl-ax { stroke: ${T.ink2}; stroke-width: 1.5; }
.g8-zl-tick { stroke: ${T.ink3}; stroke-width: 1.2; }
.g8-zl-num { fill: ${T.ink3}; font-size: 10.5px; }
.g8-zl-mark line { stroke: ${T.tip}; stroke-width: 2; }
.g8-zl-mark circle { fill: ${T.tip}; stroke: ${T.paper}; stroke-width: 1.6; }
.g8-zl-foot { display: flex; align-items: center; gap: 12px; }
.g8-zl-depth { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink3}; }
.g8-zl-btn {
  min-height: 36px; padding: 0 16px; border: 0; border-radius: 11px;
  background: ${T.accent}; color: #fff;
  font-family: 'Manrope', system-ui, sans-serif; font-size: 13px; font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 18px -12px rgba(${T.accentRgb},.8);
}
.g8-zl-btn:disabled { background: ${T.ink4}; box-shadow: none; cursor: default; }
.g8-zl-opts { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; width: 100%; }

@media (max-width: 640px) {
  .g8-zl-name { font-size: 18px; }
  .g8-zl-brk { font-size: 13.5px; }
  .g8-zl-opts { flex-direction: column; }
  .g8-zl-opts .g8-opt { width: 100%; }
}
`
