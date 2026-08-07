// ============================================================================
// UMUMIY ASBOBLAR. Sinfga bog'liq EMAS: 7 va 9-sinf shuni ishlatadi.
// Kontrakt: src/books/grade7/PODXOD_7SINF.md, src/books/grade9/PODXOD_9SINF.md
// Ajratildi 2026-08-06 (metodist qarori): mayda asboblar sinf matematikasiga
// bog'liq emas, shuning uchun ular ko'chirilmaydi, IMPORT qilinadi.
//
// Ichida: Probe (qisqa savol), ProbeChain (savollar zanjiri), RuleGate
// (savol-oldin-qoida), SlotFill (uyalarni to'ldirish), AuditRows (xatoni top).
// Sinf matematikasiga bog'langan asboblar sinf papkasida qoladi.
//
// Xato javob naqshi (1, 2 va 5-sinfdan olingan, metodist qarori 2026-08-05):
//   1. tovush: playWrong()
//   2. variant SARIQ bo'ladi (qizil emas) va o'chadi
//   3. pastda Feedback bloki ochiladi: chapda sariq chiziq
//   4. 300 ms keyin AYNAN SHU variantning razbori OVOZ bilan aytiladi
// To'g'ri javobda: playCorrect(), variant yashil, xatolar kaskad bilan yig'iladi.
//
// `import React` SHART: LMS xom jsx ni KLASSIK rejimda yuklaydi.
// ============================================================================
import React, { useMemo, useState } from 'react'
import {
  Btn,
  DoneRow,
  Expr,
  Feedback,
  L,
  Options,
  Slot,
  RuleCard,
  useSfx,
  useT,
} from './lesson-core.jsx'

// Faqat sinfga bog'liq bo'lmagan matnlar. Sinfga xos matn sinf faylida.
export const UI = {
  check: L('Tekshirish', 'Проверить', 'Check'),
  again: L('Qaytadan', 'Заново', 'Reset'),
}

// Xato/to'g'ri javobning umumiy ishlovi: tovush + ovozli razbor.
export function useAnswerFx(audio) {
  const sfx = useSfx()
  const t = useT()
  return {
    right: () => sfx.playCorrect(),
    wrong: (hint) => {
      sfx.playWrong()
      if (audio && audio.say && hint) audio.say(t(hint))
    },
  }
}

// ============================================================
// Probe -- bitta savol, aynan 4 variant.
// unscored=true (prognoz): yashil/qizil YO'Q, javob shunchaki yozib olinadi.
// ============================================================
export function Probe({ data, cols = 2, unscored = false, onSolved, disabled, minH, audio, fbSlot = 82 }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [hint, setHint] = useState(null)
  const [ok, setOk] = useState(false)

  const items = useMemo(() => data.items.map((it) => ({ id: it.id, label: t(it.label) })), [data.items, t])

  const pick = (opt) => {
    const src = data.items.find((it) => it.id === opt.id)
    if (unscored) {
      setPicked(opt.id)
      // Prognoz: to'g'ri-noto'g'ri YO'Q, lekin javobdan keyin izoh chiqadi.
      if (data.afterPredict) { setOk(false); setHint(data.afterPredict) }
      if (onSolved) onSolved({ picked: opt.id, correct: null })
      return
    }
    if (src && src.correct) {
      setPicked(opt.id)
      setOk(true)
      setHint(data.ok || null)
      fx.right()
      if (audio && audio.say && data.ok) audio.say(t(data.ok))
      if (onSolved) onSolved({ picked: opt.id, correct: true, attempts: wrong.length + 1 })
      return
    }
    setWrong((prev) => (prev.indexOf(opt.id) === -1 ? prev.concat(opt.id) : prev))
    setOk(false)
    setHint(src && src.hint ? src.hint : null)
    fx.wrong(src && src.hint ? src.hint : null)
  }

  return (
    <>
      {data.question ? <p className="lc-hint" style={{ fontWeight: 700, color: '#14161A' }}>{t(data.question)}</p> : null}
      <Options
        items={items}
        picked={picked}
        wrong={wrong}
        onPick={pick}
        disabled={disabled || (unscored && !!picked)}
        cols={cols}
        minH={minH}
        neutral={unscored}
      />
      {/* fbSlot={0} -- joyni OLDINDAN band qilmaslik. Sahnali slaydlarda
          shu 80px sahnaga beriladi: javobdan keyin variantlar yig'ilib,
          razborga joy o'zi bo'shaydi. */}
      {fbSlot > 0 ? (
        <Slot mh={fbSlot}>
          <Feedback show={!!hint} ok={ok} tone={unscored ? 'neutral' : undefined}>
            {hint ? t(hint) : null}
          </Feedback>
        </Slot>
      ) : (
        <Feedback show={!!hint} ok={ok} tone={unscored ? 'neutral' : undefined}>
          {hint ? t(hint) : null}
        </Feedback>
      )}
    </>
  )
}

// ============================================================
// ProbeChain -- savollar birma-bir. Javob berilgani QATORGA yig'iladi,
// joy keyingi savolga bo'shaydi.
// ============================================================
export function ProbeChain({ items, cols = 4, onSolved, onStep, audio }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [idx, setIdx] = useState(0)
  const [done, setDone] = useState([])
  const [okId, setOkId] = useState(null)
  const [ok, setOk] = useState(false)
  const [wrong, setWrong] = useState([])
  const [hint, setHint] = useState(null)

  const current = items[idx]

  const pick = (opt) => {
    const src = current.items.find((it) => it.id === opt.id)
    if (src && src.correct) {
      setOkId(opt.id)
      setOk(true)
      setHint(current.ok || null)
      fx.right()
      if (audio && audio.say && current.ok) audio.say(t(current.ok))
      const row = t(current.prompt) + ' ' + t(src.label)
      setTimeout(() => {
        setDone((prev) => prev.concat(row))
        setWrong([])
        setOkId(null)
        setOk(false)
        setHint(null)
        const next = idx + 1
        setIdx(next)
        if (onStep) onStep(next)
        if (next >= items.length && onSolved) onSolved({ correct: true })
      }, 1900)  // maqtov o'qilishga ulgursin (1100ms da ko'z yetmasdi)
      return
    }
    setWrong((prev) => (prev.indexOf(opt.id) === -1 ? prev.concat(opt.id) : prev))
    setOk(false)
    setHint(src && src.hint ? src.hint : null)
    fx.wrong(src && src.hint ? src.hint : null)
  }

  return (
    <>
      {done.map((row, i) => (
        <DoneRow key={i}>{row}</DoneRow>
      ))}
      {current ? (
        <div className="lc-in" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {current.viz ? (
            <div className="lc-frame-card" style={{ padding: '4px 8px', maxWidth: 380, width: '100%', margin: '0 auto' }}>
              {current.viz(!!okId)}
            </div>
          ) : null}
          <Expr size="row">{t(current.prompt)}</Expr>
          <Options
            items={current.items.map((it) => ({ id: it.id, label: t(it.label) }))}
            picked={okId}
            wrong={wrong}
            onPick={pick}
            cols={cols}
          />
        </div>
      ) : null}
      <Slot mh={82}>
        <Feedback show={!!hint} ok={ok}>{hint ? t(hint) : null}</Feedback>
      </Slot>
    </>
  )
}

// ============================================================
// RuleGate -- SAVOL-OLDIN-QOIDA (3-sinf naqshi, Dars13-16).
// Qoida kartochkasi FAQAT to'g'ri javobdan keyin ochiladi.
// swap bo'lsa: kartochka O'RNIGA jamlanma keladi (pastga QO'SHILMAYDI).
// ============================================================
export function RuleGate({ probe, rule, swap, onSolved, onStep, audio }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const [swapped, setSwapped] = useState(false)

  const solved = (res) => {
    setOpen(true)
    if (onStep) onStep('rule')
    if (onSolved) onSolved(res)
  }

  const card = swapped && swap ? swap : rule

  return (
    <>
      {!open ? (
        <Probe data={probe} cols={2} minH={48} audio={audio} onSolved={solved} />
      ) : (
        <>
          <DoneRow>{t(probe.shortAnswer)}</DoneRow>
          {rule.demo ? (
            <div className="lc-frame-card" style={{ padding: '4px 8px', maxWidth: 380, width: '100%', margin: '0 auto' }}>
              {rule.demo}
            </div>
          ) : null}
          <RuleCard
            badge={t(card.badge)}
            title={card.title ? t(card.title) : null}
            lines={card.lines.map((l) => t(l))}
            example={card.example ? t(card.example) : null}
          />
          <Slot mh={44}>
            {swap && !swapped ? (
              <Btn tone="soft" ready onClick={() => { setSwapped(true); if (onStep) onStep('both') }}>
                {t(swap.button)}
              </Btn>
            ) : null}
          </Slot>
        </>
      )}
    </>
  )
}

// ============================================================
// SlotFill -- bo'sh uyalarni to'ldirish: belgilar yoki bo'laklar.
// Tekshiruv SON QO'YIB bajariladi.
// ============================================================
export function SlotFill({ template, parts, answer, checkNote, wrongs, onSolved, onStep, prompt, audio }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [filled, setFilled] = useState(() => answer.map(() => null))
  const [active, setActive] = useState(0)
  const [checked, setChecked] = useState(false)
  const [hint, setHint] = useState(null)
  const complete = filled.every((v) => v !== null)
  const correct = checked && filled.join('|') === answer.join('|')

  const put = (partId) => {
    if (correct) return
    const next = filled.slice()
    next[active] = partId
    setFilled(next)
    setChecked(false)
    setHint(null)
    const empty = next.findIndex((v) => v === null)
    setActive(empty === -1 ? active : empty)
  }

  const check = () => {
    setChecked(true)
    if (filled.join('|') === answer.join('|')) {
      fx.right()
      if (onStep) onStep('checked')
      if (onSolved) onSolved({ correct: true, filled })
      return
    }
    const key = filled.join('|')
    const exact = (wrongs || []).find((x) => x.key === key)
    const fallback = (wrongs || []).find((x) => x.key === '*')
    const h = (exact && exact.hint) || (fallback && fallback.hint) || null
    setHint(h)
    fx.wrong(h)
  }

  const reset = () => {
    setFilled(answer.map(() => null))
    setActive(0)
    setChecked(false)
    setHint(null)
  }

  const labelOf = (id) => {
    const p = parts.find((x) => x.id === id)
    return p ? t(p.label) : ''
  }

  return (
    <>
      {prompt ? <p className="lc-hint" style={{ fontWeight: 700, color: '#14161A' }}>{t(prompt)}</p> : null}
      <div className="lc-frame-card lc-expr lc-expr-big" style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center', alignItems: 'center', minHeight: 56 }}>
        {template.map((piece, i) => {
          if (typeof piece === 'string') return <span key={i}>{piece}</span>
          const idx = piece.slot
          const value = filled[idx]
          return (
            <button
              type="button"
              key={i}
              onClick={() => { setActive(idx); setHint(null) }}
              className={'lc-frame' + (active === idx && !correct ? ' lc-picked' : '')}
              style={{
                minWidth: 46,
                minHeight: 44,
                padding: '0 8px',
                cursor: 'pointer',
                font: 'inherit',
                color: value ? (correct ? '#1F7A4D' : '#14161A') : '#9AA1AC',
                background: 'rgba(255,255,255,.75)',
              }}
            >
              {value ? labelOf(value) : '?'}
            </button>
          )
        })}
      </div>

      <Slot mh={46}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
          {parts.map((p) => (
            <button
              type="button"
              key={p.id}
              className="lc-opt"
              style={{ minHeight: 40, width: 'auto', padding: '6px 14px', fontFamily: "'JetBrains Mono', monospace", display: 'inline-flex', justifyContent: 'center' }}
              disabled={correct}
              onClick={() => put(p.id)}
            >
              {t(p.label)}
            </button>
          ))}
        </div>
      </Slot>

      <Slot mh={46}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <Btn tone="accent" ready={complete && !correct} onClick={check} disabled={!complete || correct}>
            {t(UI.check)}
          </Btn>
          {!correct ? <Btn tone="ghost" onClick={reset}>{t(UI.again)}</Btn> : null}
        </div>
      </Slot>

      <Slot mh={74}>
        {correct && checkNote ? <Feedback show ok>{t(checkNote)}</Feedback> : null}
        {!correct ? <Feedback show={!!hint} ok={false}>{hint ? t(hint) : null}</Feedback> : null}
      </Slot>
    </>
  )
}

// ============================================================
// AuditRows -- BIRINCHI xato qadamni topish. Javobdan keyin xato
// SON QO'YIB isbotlanadi, «bu yerda xato» degan matn bilan emas.
// ============================================================
export function AuditRows({ rows, answerId, hints, proof, onSolved, onStep, audio }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [hint, setHint] = useState(null)
  const solved = picked === answerId

  const pick = (id) => {
    if (solved) return
    if (id === answerId) {
      setPicked(id)
      setHint(null)
      fx.right()
      if (onStep) onStep('proof')
      if (onSolved) onSolved({ correct: true, attempts: wrong.length + 1 })
      return
    }
    setWrong((prev) => (prev.indexOf(id) === -1 ? prev.concat(id) : prev))
    setHint(hints[id] || null)
    fx.wrong(hints[id])
  }

  return (
    <>
      <div className="lc-frame-card" style={{ display: 'flex', flexDirection: 'column', gap: solved ? 2 : 4 }}>
        {rows.map((row, i) => {
          const isWrongPick = wrong.indexOf(row.id) !== -1
          const isAnswer = solved && row.id === answerId
          return (
            <button
              type="button"
              key={row.id}
              className={'lc-opt' + (isAnswer ? ' lc-opt-ok' : '') + (isWrongPick ? ' lc-opt-tip' : '')}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                /* yechilgach qatorlar KOMPAKT: ikkinchi savolga joy bo'shaydi */
                minHeight: solved ? 26 : 33,
                padding: solved ? '2px 11px' : '5px 11px',
                fontSize: solved ? 'clamp(12px, 1.6vw, 14px)' : 'clamp(14px, 1.9vw, 17px)',
                transition: 'min-height .5s, padding .5s, font-size .5s',
              }}
              disabled={solved || isWrongPick}
              onClick={() => pick(row.id)}
            >
              <span className="lc-opt-badge">{i + 1}</span>
              <span className="lc-opt-text">{row.text}</span>
            </button>
          )
        })}
      </div>
      {solved && proof ? <DoneRow>{t(proof)}</DoneRow> : null}
      {!solved ? (
        <Slot mh={70}>
          <Feedback show={!!hint} ok={false}>{hint ? t(hint) : null}</Feedback>
        </Slot>
      ) : null}
    </>
  )
}

export { UI as TOOL_UI }
