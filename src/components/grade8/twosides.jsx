// ============================================================================
// 8 КЛАСС — ПРИБОР `TwoSides`: ДЕЙСТВИЕ СРАЗУ НАД ДВУМЯ ЧАСТЯМИ.
//
// Уроки 9, 10, 14–20, 23–27, 29, 30 — шестнадцать из пятидесяти пяти. Контракт
// ETALON_8SINF.md §7.3.
//
// Устройство прибора и есть его методика:
//
//   1. КНОПКИ «ПРИМЕНИТЬ ТОЛЬКО К ЛЕВОЙ» НЕ СУЩЕСТВУЕТ. Действие всегда идёт
//      к обеим частям — «перенести через равно» перестаёт быть отдельным
//      правилом и становится следствием.
//   2. Под записью — числовая прямая с закрашенным множеством решений. Одна
//      точка, промежуток, вся прямая, пустое множество: это ВИДНО, а не
//      названо словом.
//   3. При делении на отрицательное знак переворачивается, и закрашенная часть
//      перескакивает через точку. Если ученик знак не перевернул, прибор берёт
//      число ИЗ ЕГО ЧАСТИ, подставляет в исходную запись и показывает ложь.
//      Правило «при умножении на отрицательное знак меняется» ученик получает
//      не как строчку для запоминания, а как то, без чего проверка не проходит.
//   4. Прибор — контролёр, а не оракул: верное действие он не подсвечивает.
//
// Множество на прямой описывается уроком, а не выводится прибором: разбор
// неравенства — это математика урока, и она обязана быть видна в данных, где
// её проверит `check-grade8.mjs`.
// ============================================================================

// eslint-disable-next-line no-unused-vars -- LMS грузит сырой jsx в КЛАССИЧЕСКОМ режиме
import React, { useState } from 'react'
import { Ask, L, MATH_FONT, Note, Slot, T, useInstructionGate, useSfx, useT } from './core.jsx'

const TXT = {
  both: L(
    "Amal IKKALA qismga birdan qo'llanadi",
    'Действие применяется сразу к ОБЕИМ частям',
    'The action applies to BOTH sides at once',
  ),
  check: L('Tekshiramiz', 'Проверяем', 'Let us check'),
  empty: L("Yechim yo'q", 'Решений нет', 'No solutions'),
  all: L("Har qanday son", 'Любое число', 'Any number'),
}

// ============================================================
// ЧИСЛОВАЯ ПРЯМАЯ. Множество: { lt } { le } { gt } { ge } { point } { points }
// { none } { all } { between: [a, b] }. Закрашенное лежит НА самой оси толстой
// линией, точка на границе — пустая или полная, и это единственный способ
// показать разницу между строгим и нестрогим знаком.
//
// `points: [a, b, ...]` — БЛОК Б3 (квадратные уравнения). У квадратного
// уравнения корней обычно два, и это не луч и не интервал — это две отдельные
// точки без закраски между ними. `point` (единственное число) остаётся для
// одного корня, `points` для двух и больше.
// ============================================================
const VB = 420
const AX = 34

function Line({ from = -6, to = 6, set, flash }) {
  const px = (v) => 22 + ((v - from) / (to - from)) * (VB - 44)
  const ticks = []
  for (let v = Math.ceil(from); v <= Math.floor(to); v += 1) ticks.push(v)

  const s = set || {}
  let band = null
  let dot = null
  let dots = null
  let open = true
  if (s.none) band = null
  else if (s.all) band = [from, to]
  else if (s.points) dots = s.points
  else if (s.lt !== undefined) { band = [from, s.lt]; dot = s.lt }
  else if (s.le !== undefined) { band = [from, s.le]; dot = s.le; open = false }
  else if (s.gt !== undefined) { band = [s.gt, to]; dot = s.gt }
  else if (s.ge !== undefined) { band = [s.ge, to]; dot = s.ge; open = false }
  else if (s.between) { band = s.between; open = false }
  else if (s.point !== undefined) { dot = s.point; open = false }

  return (
    <svg className={'g8-ts-line' + (flash ? ' is-flash' : '')} viewBox={'0 0 ' + VB + ' 58'}
      preserveAspectRatio="xMidYMid meet" role="img">
      {band ? (
        <rect x={px(band[0])} y={AX - 5} width={Math.max(0, px(band[1]) - px(band[0]))}
          height="10" rx="5" className="g8-ts-band"/>
      ) : null}
      <line x1="12" y1={AX} x2={VB - 12} y2={AX} className="g8-ts-ax"/>
      <polygon points={(VB - 12) + ',' + AX + ' ' + (VB - 21) + ',' + (AX - 4.5) + ' ' + (VB - 21) + ',' + (AX + 4.5)}
        className="g8-ts-arrow"/>
      {ticks.map((v) => (
        <g key={'t' + v}>
          <line x1={px(v)} y1={AX - 4} x2={px(v)} y2={AX + 4} className="g8-ts-tick"/>
          <text x={px(v)} y={AX + 19} textAnchor="middle" fontFamily={MATH_FONT}
            fontSize="11" className="g8-ts-num">{v}</text>
        </g>
      ))}
      {dot !== null && dot !== undefined ? (
        <circle cx={px(dot)} cy={AX} r="5.5" className={'g8-ts-dot' + (open ? ' is-open' : '')}/>
      ) : null}
      {dots ? dots.map((v, i) => (
        <circle key={'d' + i} cx={px(v)} cy={AX} r="5.5" className="g8-ts-dot"/>
      )) : null}
      {s.none ? (
        <text x={VB / 2} y={AX - 12} textAnchor="middle" fontFamily={MATH_FONT}
          fontSize="12" className="g8-ts-word">{'∅'}</text>
      ) : null}
    </svg>
  )
}

// ============================================================
// ЗАПИСЬ: левая часть, знак, правая часть. Знак — отдельный элемент, потому
// что именно он переворачивается, и это движение должно быть видно.
// ============================================================
function Record({ rec, flip }) {
  return (
    <div className="g8-ts-rec" style={{ fontFamily: MATH_FONT }}>
      <span className="g8-ts-side">{rec.left}</span>
      <span className={'g8-ts-rel' + (flip ? ' is-flip' : '')}>{rec.rel}</span>
      <span className="g8-ts-side">{rec.right}</span>
    </div>
  )
}

export function TwoSides({
  start, steps, from = -6, to = 6, note, onSolved, onStep, audio,
}) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [at, setAt] = useState(0)
  const [rec, setRec] = useState(start)
  const [set, setSet] = useState(start.set || null)
  const [wrong, setWrong] = useState([])
  const [msg, setMsg] = useState(null)
  const [counter, setCounter] = useState(null)
  const [flip, setFlip] = useState(false)
  const [done, setDone] = useState(false)

  const step = steps[at]

  const pick = (opt) => {
    const src = step.actions.find((a) => a.id === opt.id)
    if (!src) return
    if (src.right) {
      setRec(src.to)
      setSet(src.set !== undefined ? src.set : set)
      setFlip(!!src.flip)
      setCounter(null)
      setMsg(src.note || null)
      sfx.playCorrect()
      if (onStep) onStep('a' + (at + 1))
      if (audio && src.note) audio.say(t(src.note))
      const next = at + 1
      if (next >= steps.length) {
        setDone(true)
        if (onSolved) onSolved({ correct: true, tries: wrong.length + 1 })
      } else {
        setAt(next)
      }
      return
    }
    setWrong((p) => (p.indexOf(opt.id) === -1 ? p.concat(opt.id) : p))
    // ОПРОВЕРЖЕНИЕ ЧИСЛОМ, а не слово «неверно»: берём число из множества,
    // которое получилось БЫ у ученика, и подставляем в ИСХОДНУЮ запись.
    setCounter(src.counter || null)
    setMsg(src.hint || null)
    sfx.playWrong()
    if (audio && src.hint) audio.say(t(src.hint))
  }

  return (
    <>
      <div className="g8-frame g8-ts">
        <Record rec={rec} flip={flip}/>
        <Line from={from} to={to} set={set} flash={flip}/>
      </div>

      <Slot mh={54}>
        {done ? null : (
          <div className="g8-ts-ask">
            <Ask>{t(step.ask)}</Ask>
            <span className="g8-ts-both">{t(TXT.both)}</span>
            <div className="g8-ts-acts">
              {step.actions.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={'g8-opt' + (wrong.indexOf(a.id) !== -1 ? ' g8-opt-tip' : '')}
                  disabled={!canAnswer}
                  onClick={() => pick(a)}
                >
                  {t(a.label)}
                </button>
              ))}
            </div>
          </div>
        )}
      </Slot>

      <Slot mh={62}>
        {counter ? (
          <div className="g8-ts-counter" style={{ fontFamily: MATH_FONT }}>
            <span className="g8-ts-cx">{counter.at}</span>
            <span className="g8-ts-carrow">{'→'}</span>
            <span className="g8-ts-cval">{counter.gives}</span>
            <span className="g8-ts-cno">{t(counter.verdict)}</span>
          </div>
        ) : (
          <Note kind={done ? 'ok' : 'no'}>{msg ? t(msg) : (done && note ? t(note) : null)}</Note>
        )}
      </Slot>
    </>
  )
}

// ============================================================
// CSS. ВНИМАНИЕ: строка шаблонная — обратная кавычка или обратный слэш внутри
// неё, даже в комментарии, дают белую страницу без объяснения причины.
// ============================================================
export const TWOSIDES_STYLES = `
.g8-ts { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px; }
.g8-ts-rec { display: flex; align-items: center; gap: 14px; font-size: clamp(20px, 2vw, 28px); color: ${T.ink}; }
.g8-ts-side { white-space: nowrap; }
.g8-ts-rel { color: ${T.accent}; font-weight: 600; display: inline-block; }
.g8-ts-rel.is-flip { animation: g8-ts-flip .5s cubic-bezier(.34,1.4,.64,1) both; }
@keyframes g8-ts-flip { 0% { transform: rotate(0); } 55% { transform: rotate(180deg) scale(1.15); } 100% { transform: rotate(180deg); } }

.g8-ts-line { width: 100%; max-height: 11vh; display: block; }
.g8-ts-ax { stroke: ${T.ink2}; stroke-width: 1.6; }
.g8-ts-arrow { fill: ${T.ink2}; }
.g8-ts-tick { stroke: ${T.ink3}; stroke-width: 1.2; }
.g8-ts-num { fill: ${T.ink3}; }
.g8-ts-band { fill: ${T.accent}; opacity: .85; transition: x .35s ease, width .35s ease; }
.g8-ts-word { fill: ${T.ink2}; }
.g8-ts-dot { fill: ${T.accent}; stroke: ${T.paper}; stroke-width: 2; }
.g8-ts-dot.is-open { fill: ${T.paper}; stroke: ${T.accent}; stroke-width: 2.4; }
.g8-ts-line.is-flash .g8-ts-band { animation: g8-ts-blink .5s ease 1; }
@keyframes g8-ts-blink { 0%, 100% { opacity: .85; } 50% { opacity: .25; } }

.g8-ts-ask { display: flex; flex-direction: column; align-items: center; gap: 5px; width: 100%; }
.g8-ts-both { font-size: 11.5px; letter-spacing: .04em; color: ${T.graph}; }
.g8-ts-acts { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; width: 100%; }

.g8-ts-counter { display: flex; align-items: center; gap: 10px; justify-content: center;
  background: ${T.tipSoft}; border-radius: 12px; padding: 8px 14px; font-size: 16px; }
.g8-ts-cx { color: ${T.ink}; }
.g8-ts-carrow { color: ${T.ink3}; }
.g8-ts-cval { color: ${T.tip}; font-weight: 600; }
.g8-ts-cno { font-family: 'Manrope', system-ui, sans-serif; font-size: 12.5px; color: ${T.tip}; }

@media (max-width: 640px) {
  .g8-ts-rec { font-size: 19px; gap: 10px; }
  .g8-ts-acts { flex-direction: column; }
  .g8-ts-acts .g8-opt { width: 100%; }
  .g8-ts-counter { flex-wrap: wrap; font-size: 14px; }
}
`
