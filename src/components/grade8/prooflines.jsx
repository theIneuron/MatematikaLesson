// ============================================================================
// 8 КЛАСС, ГЕОМЕТРИЯ — ПРИБОР `ProofLines`: ISBOTNI ASOSLAB TO'LDIRISH.
//
// Блок Б6 (уроки 37+). Контракт ETALON_8SINF.md §7.3, "ProofLines —
// доказательство на чертеже".
//
// Chertyozh tepada (GeoFigure bilan bir xil chizuvchi), pastda «Berilgan»
// va «Isbotlash kerak» ustunlari, ORASIDA bo'sh qatorlar. O'quvchi har
// qatorni TO'LDIRMAYDI — u qatorning ASOSINI ro'yxatdan TANLAYDI. Chertyozh
// isbotni ALMASHTIRMAYDI, faqat ko'rgazma (ETALON §7.2).
// ============================================================================

// eslint-disable-next-line no-unused-vars -- LMS грузит сырой jsx в КЛАССИЧЕСКОМ режиме
import React, { useState } from 'react'
import { L, MATH_FONT, T, useT } from './core.jsx'
import { Fields } from './tools.jsx'

const TXT = {
  given: L('BERILGAN', 'ДАНО', 'GIVEN'),
  goal: L('ISBOTLASH KERAK', 'ТРЕБУЕТСЯ ДОКАЗАТЬ', 'TO PROVE'),
}

function StaticFigure({ points, order, marks }) {
  const poly = order.map((v) => points[v].join(',')).join(' ')
  return (
    <svg viewBox="0 0 110 100" className="g8-pl-svg" role="img" aria-label="chertyozh">
      <polygon points={poly} fill={T.paper} stroke={T.ink2} strokeWidth="1.2"/>
      {(marks || []).map((m, i) => (
        <line key={i} x1={points[m[0]][0]} y1={points[m[0]][1]}
          x2={points[m[1]][0]} y2={points[m[1]][1]}
          stroke={T.graph} strokeWidth="1" strokeDasharray={m[2] ? '3,2' : undefined}/>
      ))}
      {order.map((v) => (
        <text key={v} x={points[v][0]} y={points[v][1]}
          dx={points[v][0] < 55 ? -7 : 7} dy={points[v][1] < 50 ? -4 : 10}
          fontFamily={MATH_FONT} fontSize="7" fill={T.ink} textAnchor="middle">{v}</text>
      ))}
    </svg>
  )
}

export function ProofLines({
  points, order, marks, given, goal, lines, after, fields, note, onSolved, onStep, audio,
}) {
  const t = useT()
  const [li, setLi] = useState(0)
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [note2, setNote2] = useState(null)
  const done = li >= lines.length

  const choose = (opt) => {
    if (picked) return
    const line = lines[li]
    if (opt.right) {
      setPicked(opt.id)
      setNote2(null)
      if (audio && line.after) audio.say(t(line.after))
      return
    }
    setWrong((p) => (p.indexOf(opt.id) === -1 ? p.concat(opt.id) : p))
    setNote2(opt.hint || null)
    if (audio && opt.hint) audio.say(t(opt.hint))
  }

  const advance = () => {
    if (li + 1 >= lines.length) {
      if (onStep) onStep('reason')
      if (onSolved && !fields) onSolved({ correct: true })
      setLi(li + 1)
    } else {
      setLi(li + 1)
      setPicked(null)
      setWrong([])
      setNote2(null)
    }
  }

  return (
    <div className="g8-pl">
      <StaticFigure points={points} order={order} marks={marks}/>

      <div className="g8-pl-cols">
        <div className="g8-pl-col">
          <span className="g8-pl-cap">{t(TXT.given)}</span>
          {given.map((g, i) => <span key={i} className="g8-pl-line">{t(g)}</span>)}
        </div>
        <div className="g8-pl-col">
          <span className="g8-pl-cap">{t(TXT.goal)}</span>
          <span className="g8-pl-line">{t(goal)}</span>
        </div>
      </div>

      <div className="g8-pl-steps">
        {lines.slice(0, Math.min(li + 1, lines.length)).map((line, i) => (
          <div key={i} className="g8-pl-step">
            <span className="g8-pl-text">{t(line.text)}</span>
            {i === li ? (
              <>
                <div className="g8-pl-opts">
                  {line.options.map((o) => (
                    <button key={o.id} type="button"
                      className={'g8-pl-opt' + (picked === o.id ? ' is-ok' : '') + (wrong.indexOf(o.id) !== -1 ? ' is-no' : '')}
                      disabled={!!picked} onClick={() => choose(o)}>{t(o.label)}</button>
                  ))}
                </div>
                <span className="g8-pl-note">{note2 ? t(note2) : ''}</span>
                {picked ? (
                  <button type="button" className="g8-pl-next" onClick={advance}>
                    {t(L("Keyingi qator", 'Следующая строка', 'Next line'))}
                  </button>
                ) : null}
              </>
            ) : null}
          </div>
        ))}
      </div>

      {done && after ? <div className="g8-pl-after">{t(after)}</div> : null}
      {done && fields ? (
        <FieldsSlot fields={fields} note={note} audio={audio} onSolved={onSolved}/>
      ) : null}
    </div>
  )
}

// Ba'zi darslarda isbotdan keyin son bilan tekshirish kerak (masalan,
// diagonalning yarmi). Shuning uchun `tools.jsx`ning `Fields`i shu yerda
// ishlatiladi.
function FieldsSlot({ fields, note, audio, onSolved }) {
  return <Fields fields={fields} note={note} audio={audio} onSolved={onSolved}/>
}

export const PROOFLINES_STYLES = `
.g8-pl { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 8px; width: 100%; }
.g8-pl-svg { width: 100%; max-width: 220px; height: 160px; }
.g8-pl-cols { display: flex; gap: 18px; width: 100%; justify-content: center; flex-wrap: wrap; }
.g8-pl-col { display: flex; flex-direction: column; gap: 4px; min-width: 140px; }
.g8-pl-cap { font-family: 'Manrope', system-ui, sans-serif; font-size: 11px; font-weight: 700;
  letter-spacing: .05em; color: ${T.ink3}; }
.g8-pl-line { font-size: 14px; color: ${T.ink}; font-family: ${MATH_FONT}; }
.g8-pl-steps { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 420px; }
.g8-pl-step { display: flex; flex-direction: column; gap: 6px; align-items: center; }
.g8-pl-text { font-size: 14px; color: ${T.ink2}; text-align: center; }
.g8-pl-opts { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.g8-pl-opt {
  min-height: 38px; padding: 6px 12px; border: 0; border-radius: 10px;
  background: ${T.paper}; color: ${T.ink}; font-size: 13px; cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(23,26,29,.1);
}
.g8-pl-opt.is-ok { background: ${T.ok}; color: #fff; }
.g8-pl-opt.is-no { opacity: .5; }
.g8-pl-opt:disabled { cursor: default; }
.g8-pl-note { font-size: 12px; color: ${T.tip}; text-align: center; min-height: 15px; }
.g8-pl-next {
  min-height: 38px; padding: 0 16px; border: 0; border-radius: 10px;
  background: ${T.accent}; color: #fff; font-size: 13px; font-weight: 700; cursor: pointer;
}
.g8-pl-after { font-size: 13px; color: ${T.ok}; text-align: center; }
`
