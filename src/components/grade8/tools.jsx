// ============================================================================
// 8-sinf ASBOBLARI. Har biri BIR marta yoziladi, 55 dars shuni ishlatadi.
// Dars fayli faqat MA'LUMOT beradi (§13.2).
// Kontrakt: src/books/grade8/ETALON_8SINF.md
//
// Xato javob naqshi (§2.1 p.4): «noto'g'ri» so'zi YO'Q. Son ko'rsatiladi va
// ikki qiymat yonma-yon turadi. Darsda aynan shu yozuv uchun razbor yozilgan
// bo'lsa — u ishlatiladi, yo'q bo'lsa kontrprimer o'zi gapiradi.
//
// Asboblar:
//   Substitute  -- son qo'yib solishtirish            (ekran 1, 7)
//   TaskChain   -- qisqa topshiriqlar zanjiri          (ekran 2, 9, 14)
//   Fields      -- bitta yozuv + ketma-ket maydonlar   (ekran 3, 4, 5)
//   Transform   -- qadamba-qadam qayta yozish + ODZ    (ekran 6, 10)
//   SoloTask    -- mustaqil: natija va ODZ             (ekran 11)
//   RuleBlock   -- qoida kartochkasi + tekshiruv       (ekran 8)
//   Audit       -- birinchi xato satr + kontrprimer    (ekran 12)
//   Boundary    -- yozuvlar qayerda ajraladi           (ekran 13)
//   Inverse     -- teskari topshiriq, ikki xossa       (ekran 14)
// ============================================================================
// eslint-disable-next-line no-unused-vars -- LMS xom jsx ni KLASSIK rejimda yuklaydi
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Ask, Choice, ClosedRow, Counterexample, Frac, L, MATH_FONT, NextStep, Note, OdzLine,
  Row, RuleCard, Slot, T, UI_TXT, fmt, useInstructionGate, useSfx, useSteps, useT,
} from './core.jsx'
import { MathField, judgeExpr, judgeOdz } from './math.jsx'
import { checkReduction, domainHoles, evaluate, parse, valueAt } from './mathcore.js'

const TXT = {
  put: L("Son qo'ying:", 'Подставь число:', 'Substitute a number:'),
  checked: L('tekshirildi', 'проверено при', 'checked at'),
  odzAsk: L('ODZ:', 'ОДЗ:', 'Domain:'),
  result: L('natija:', 'результат:', 'result:'),
  none: L("qisqartirish mumkin emas", 'сокращать нечего', 'nothing to reduce'),
  noneWrong: L(
    'Bu yerda umumiy ko\'paytuvchi bor. Yana bir qarang.',
    'Здесь общий множитель есть. Посмотри ещё раз.',
    'There is a common factor here. Look again.',
  ),
  pick: L('Amalni tanlang:', 'Выбери действие:', 'Choose the action:'),
  proofAsk: L(
    "Javobingizni tekshiring: o'z soningizni qo'ying",
    'Проверь свой ответ: поставь своё число',
    'Check your answer: put in your own number',
  ),
  proofDone: L("son bilan tekshirildi:", 'проверено числом:', 'checked with:'),
  proofHole: L(
    "Bu qiymatda yozuvning qiymati yo'q. Boshqa son oling.",
    'При этом значении записи нет. Возьми другое число.',
    'At this value the record has no value. Take another number.',
  ),
  noValue: L("qiymat yo'q", 'значения нет', 'no value'),
  yours: L('sizda', 'у тебя', 'yours'),
  source: L('boshlang\'ich', 'исходная', 'original'),
  cxAt: L('bu qiymatda', 'при этом значении', 'at this value'),
  reduceNo: L(
    'Bu kasr berilgan natijaga qisqarmaydi. Qisqartirib ko\'ring.',
    'Эта дробь не сокращается до нужного результата. Сократи и посмотри.',
    'This fraction does not reduce to the required result.',
  ),
  odzNo: L(
    'Qisqartirish to\'g\'ri, lekin ODZ boshqa chiqdi.',
    'Сокращается верно, но ОДЗ вышла другая.',
    'It reduces correctly, but the domain came out different.',
  ),
  numForm: L(
    'Qiymatlarni vergul bilan yozing, masalan  4  yoki  x = 4.',
    'Запиши значения через запятую, например  4  или  x = 4.',
    'List the values separated by commas, e.g.  4  or  x = 4.',
  ),
}

// ============================================================
// Umumiy: javob + hukm
// ============================================================
function Verdict({ v, labels }) {
  const t = useT()
  if (!v) return null
  if (v.why === 'value' || v.why === 'domain') {
    return (
      <Counterexample
        at={v.at}
        note={v.note}
        mine={v.why === 'value' ? v.mine : undefined}
        ref={v.why === 'value' ? v.ref : undefined}
        labelMine={(labels && labels.mine) || TXT.yours}
        labelRef={(labels && labels.ref) || TXT.source}
      />
    )
  }
  return <Note kind="no">{v.note ? t(v.note) : null}</Note>
}

function useJudged(task, kind, onOk, audio) {
  const t = useT()
  const sfx = useSfx()
  const [val, setVal] = useState('')
  const [v, setV] = useState(null)
  const [tries, setTries] = useState(0)
  const [done, setDone] = useState(false)

  const submit = () => {
    if (done) return
    const res = kind === 'odz' ? judgeOdz(val, task) : judgeExpr(val, task)
    if (res.ok) {
      setDone(true)
      setV(null)
      sfx.playCorrect()
      if (onOk) onOk({ tries: tries + 1, value: val })
      return
    }
    // Razbor bo'lmasa urinish SANALMAYDI (§10.1 p.1)
    if (res.why !== 'parse' && res.why !== 'empty') { setTries((n) => n + 1); sfx.playWrong() }
    setV(res)
    if (audio && res.note) audio.say(t(res.note))
  }

  return { val, setVal, v, done, tries, submit, setDone }
}

// ============================================================
// 0. Reveal — TUSHUNTIRISH qadamba-qadam, ovoz bilan sinxron.
//    blocks: [JSX, JSX, ...] -- har biri bitta fikr, bitta ovoz bo'lagi.
//    Qadam ochilganda `sN` bo'lagi gapiradi; ovoz yoniq bo'lsa keyingisi
//    o'zi ochiladi, o'chiq bo'lsa o'quvchi «keyingi» bilan yuradi (core).
//    `children` — funksiya: (r) => JSX, oxirgi qadamdan keyin savol qo'yish uchun.
// ============================================================
export function Reveal({ blocks, audio, name = 's', onDone, gap = 26, children }) {
  const r = useSteps(blocks.length, audio, { name, ms: 2600 })
  const fired = useRef(false)
  useEffect(() => {
    if (r.atLast && !fired.current) { fired.current = true; if (onDone) onDone() }
  }, [r.atLast, onDone])
  return (
    <>
      {blocks.slice(0, r.i + 1).map((b, k) => (
        <div key={k} className={k === r.i && k > 0 ? 'g8-in' : undefined} style={{ flexShrink: 0 }}>{b}</div>
      ))}
      <Slot mh={gap}>
        <NextStep show={!r.atLast} onClick={r.next} />
      </Slot>
      {typeof children === 'function' ? children(r) : children}
    </>
  )
}

// ============================================================
// 1. Substitute — o'quvchi SONNI O'ZI tanlaydi, qatorlar hisoblanadi.
//    rows: [{ id, show, expr }]   ask: { question, items:[{id,label,correct,hint}] }
// ============================================================
// tone: 'ok' | 'cool'. Xuk ekranida 'cool' — TAXMIN baholanmaydi (§14).
export function Substitute({ rows, varName = 'a', ask, minChecked = 2, decimals = 2, tone = 'ok', onSolved, audio, after }) {
  const t = useT()
  const sfx = useSfx()
  const [num, setNum] = useState('')
  const [checked, setChecked] = useState([])
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [note, setNote] = useState(null)

  const askFired = useRef(false)
  useEffect(() => {
    if (!ask || askFired.current) return
    if (checked.length < minChecked) return
    askFired.current = true
    if (audio) audio.step('ask')
  }, [checked.length, minChecked, ask, audio])

  const values = useMemo(() => {
    if (!checked.length) return null
    const env = {}
    env[varName] = checked[checked.length - 1]
    return rows.map((r) => {
      const got = valueAt(r.expr, env)
      return got.error ? null : got.value
    })
  }, [checked, rows, varName])

  const put = () => {
    const n = Number(String(num).replace(',', '.'))
    if (!Number.isFinite(n)) return
    setChecked((prev) => (prev.indexOf(n) === -1 ? prev.concat(n) : prev))
    setNum('')
    if (audio) audio.step('sub' + Math.min(2, checked.length + 1))
  }

  const show = (v) => {
    if (v === null || v === undefined) return t(TXT.noValue)
    if (Number.isInteger(v)) return String(v)
    return v.toFixed(decimals)
  }

  const pick = (opt) => {
    const src = ask.items.find((i) => i.id === opt.id)
    if (src && src.correct) {
      setPicked(opt.id)
      setNote(after || null)
      sfx.playCorrect()
      if (audio && after) audio.say(t(after))
      if (onSolved) onSolved({ correct: true, tries: wrong.length + 1 })
      return
    }
    setWrong((prev) => (prev.indexOf(opt.id) === -1 ? prev.concat(opt.id) : prev))
    setNote(src && src.hint ? src.hint : null)
    sfx.playWrong()
    if (audio && src && src.hint) audio.say(t(src.hint))
  }

  return (
    <>
      {/* Yozuvlar QOG'OZ yuzada: 11-sinf tilida har mazmun bloki yuza. */}
      <div className="g8-panel g8-panel-paper g8-subrows">
        {rows.map((r, i) => (
          <div className="g8-subrow" key={r.id}>
            <span className="g8-subrow-l">{r.show}</span>
            <span className="g8-subrow-arrow">{checked.length ? '→' : ''}</span>
            <span className={'g8-subrow-v' + (values && values[i] === null ? ' g8-t-dim' : '')}>
              {values ? show(values[i]) : ''}
            </span>
          </div>
        ))}
      </div>

      <Slot mh={44}>
        <MathField
          kind="number"
          label={TXT.put}
          value={num}
          onChange={setNum}
          onSubmit={put}
          width={72}
        />
      </Slot>

      <Slot mh={22}>
        {checked.length ? (
          <div className="g8-checked">
            {t(TXT.checked)} {checked.map((c) => fmt(c)).join(', ')}
          </div>
        ) : null}
      </Slot>

      <Slot mh={ask ? 74 : 0}>
        {ask && checked.length >= minChecked ? (
          <div className="g8-in">
            <Ask>{t(ask.question)}</Ask>
            <Choice
              items={ask.items.map((i) => ({ id: i.id, label: t(i.label) }))}
              picked={picked}
              wrong={wrong}
              onPick={pick}
              cols={2}
              tone={tone}
            />
          </div>
        ) : null}
      </Slot>

      <Slot mh={58}>
        <Note kind={picked ? 'ok' : 'no'}>{note ? t(note) : null}</Note>
      </Slot>
    </>
  )
}

// ============================================================
// 2. TaskChain — qisqa topshiriqlar birma-bir. Javob berilgani INGICHKA
//    satrga yig'iladi (galochka YO'Q), joy keyingisiga bo'shaydi.
//    items: [{ prompt, show, kind, answer|excluded|of, hints, none, closed }]
// ============================================================
export function TaskChain({ items, onSolved, onStep, audio }) {
  const t = useT()
  const [idx, setIdx] = useState(0)
  const [closed, setClosed] = useState([])
  const cur = items[idx]

  const advance = (line) => {
    setClosed((prev) => prev.concat(line))
    const next = idx + 1
    setIdx(next)
    if (audio) audio.step('t' + next)
    if (onStep) onStep(next)
    if (next >= items.length && onSolved) onSolved({ correct: true })
  }

  return (
    <>
      {closed.map((line, i) => <ClosedRow key={i}>{line}</ClosedRow>)}
      {cur ? (
        <ChainItem
          key={idx}
          item={cur}
          audio={audio}
          onOk={() => advance(cur.closed ? t(cur.closed) : (t(cur.prompt) + '  ' + (cur.answer || '')))}
        />
      ) : null}
    </>
  )
}

function ChainItem({ item, onOk, audio }) {
  const t = useT()
  const kind = item.kind || 'expr'
  const j = useJudged(item, kind, onOk, audio)
  const [noneWrong, setNoneWrong] = useState(null)

  const pressNone = () => {
    if (item.none === true) { onOk({ tries: j.tries + 1 }); return }
    setNoneWrong(TXT.noneWrong)
    if (audio) audio.say(t(TXT.noneWrong))
  }

  return (
    <div className="g8-in">
      {item.prompt ? <Ask>{t(item.prompt)}</Ask> : null}
      {item.show ? <Row size="row" align="center">{item.show}</Row> : null}
      <Slot mh={44}>
        <MathField
          kind={kind}
          value={j.val}
          onChange={(x) => { j.setVal(x); setNoneWrong(null) }}
          onSubmit={j.submit}
          done={j.done}
          none={item.none !== undefined}
          onNone={pressNone}
        />
      </Slot>
      <Slot mh={62}>
        {noneWrong ? <Note kind="no">{t(noneWrong)}</Note> : <Verdict v={j.v} labels={item.labels} />}
      </Slot>
    </div>
  )
}

// ============================================================
// 3. Fields — bitta yozuv, ketma-ket maydonlar. Oldingisi to'ldirilmasa
//    keyingisi ochilmaydi. ODZ satri maxrajda harf bo'lsa turadi.
//    fields: [{ label, ask, kind, answer|of|excluded, hints }]
// ============================================================
export function Fields({ show, odz, fields, onSolved, onStep, audio, note }) {
  const t = useT()
  const [step, setStep] = useState(0)

  const done = (i) => {
    const next = i + 1
    setStep(next)
    if (onStep) onStep('f' + next)
    if (next >= fields.length && onSolved) onSolved({ correct: true })
  }

  return (
    <>
      {show ? <div className="g8-work">{show}</div> : null}
      {odz ? <OdzLine value={odz} /> : null}
      {fields.map((f, i) => (
        <Slot key={i} mh={i <= step ? 66 : 0}>
          {i <= step ? (
            <FieldOne
              field={f}
              audio={audio}
              onOk={() => done(i)}
            />
          ) : null}
        </Slot>
      ))}
      <Slot mh={note ? 44 : 0}>
        {note && step >= fields.length ? <Note kind="ok">{t(note)}</Note> : null}
      </Slot>
    </>
  )
}

function FieldOne({ field, onOk, audio }) {
  const t = useT()
  const j = useJudged(field, field.kind || 'expr', onOk, audio)
  return (
    <div className="g8-in">
      {field.ask ? <Ask>{t(field.ask)}</Ask> : null}
      <MathField
        kind={field.kind || 'expr'}
        label={field.label}
        value={j.val}
        onChange={j.setVal}
        onSubmit={j.submit}
        done={j.done}
      />
      <Slot mh={j.v ? 58 : 0}><Verdict v={j.v} labels={field.labels} /></Slot>
    </div>
  )
}

// ============================================================
// 4. Transform — qadamba-qadam qayta yozish. O'quvchi AMALNI tanlaydi va
//    natijani O'ZI YOZADI. «Darrov javob» tugmasi yo'q -- uni bosadigan
//    joy ham yo'q. ODZ satri o'zgarmasa MIRЖILLAMAYDI.
//    steps: [{ action, ask, answer, accepts, hints, show, wrongAction }]
// ============================================================
export function Transform({ start, steps, actions, odz, onSolved, onStep, audio, foot }) {
  const t = useT()
  const sfx = useSfx()
  const [lines, setLines] = useState([start])
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState(null)
  const [shake, setShake] = useState(0)

  const i = lines.length - 1
  const step = steps[i]
  const finished = i >= steps.length

  const act = (id) => {
    if (!step) return
    if (id === step.action) { setOpen(true); setNote(null); return }
    const w = (step.wrongs || []).find((x) => x.action === id)
    setNote(w ? w.hint : null)
    setShake((s) => s + 1)
    sfx.playWrong()
    if (audio && w && w.hint) audio.say(t(w.hint))
  }

  const ok = () => {
    const next = lines.concat(step.show)
    setLines(next)
    setOpen(false)
    setNote(null)
    if (onStep) onStep('s' + next.length)
    if (next.length - 1 >= steps.length && onSolved) onSolved({ correct: true })
  }

  return (
    <>
      <div className="g8-work">
        {lines.map((line, k) => (
          <div className={'g8-work-line' + (k === lines.length - 1 && k > 0 ? ' g8-pop' : '')} key={k}>{line}</div>
        ))}
      </div>

      {odz ? <OdzLine value={odz} /> : null}

      <Slot mh={44}>
        {!finished && !open ? (
          <div className="g8-shakebox">
            <div key={shake} className={shake ? 'g8-shake' : undefined}>
              <div className="g8-acts">
                <span className="g8-acts-tag">{t(TXT.pick)}</span>
                {actions.map((a) => (
                  <button type="button" key={a.id} className="g8-act" onClick={() => act(a.id)}>
                    {t(a.label)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
        {finished && foot ? <Ask>{t(foot)}</Ask> : null}
      </Slot>

      <Slot mh={open ? 66 : 0}>
        {open && step ? (
          <FieldOne key={i} field={step} audio={audio} onOk={ok} />
        ) : null}
      </Slot>

      <Slot mh={58}>
        <Note kind="no">{note ? t(note) : null}</Note>
      </Slot>
    </>
  )
}

// ============================================================
// 5. SoloTask — mustaqil ishlash: natija va ODZ, qadamlar so'ralmaydi.
//    Bu ekranda PROTSESS emas, NATIJA tekshiriladi (ekran 11).
//
//    EKRAN 11 ASBOBSIZ o'tiladi (redaksiya 2, §2.2.1). `bare` shuni beradi:
//    amallar qatori YO'Q, yordam tugmasi YO'Q, ODZ satri O'ZI to'lmaydi.
//    Yozuv, ikki maydon va o'quvchining SONI bilan tekshirish — boshqa hech nima.
//
//    Sabab: Basadien, 19 ishtirokchi — grafik paket bilan olti hafta ishlagandan
//    keyin QOG'OZDA yechish uchun o'rtacha ball 10 dan 4,2. Asbob har qadamda
//    turса, o'quvchi ekranga qarab o'rganadi, varaqqa ko'chirishni emas.
//
//    proof — o'quvchining o'z soni: javobni O'ZI tekshiradi (§2.2.2, З16).
//    Bu «xohlasang bos» tugmasi emas: proof berilgan bo'lsa, u to'lmaguncha
//    topshiriq YOPILMAYDI.
// ============================================================
export function SoloTask({ show, result, odz, proof, onSolved, audio, note }) {
  const t = useT()
  const canAnswer = useInstructionGate(audio)
  const [okResult, setOkResult] = useState(false)
  const [okOdz, setOkOdz] = useState(false)
  const [num, setNum] = useState('')
  const [checked, setChecked] = useState(false)
  const [numNote, setNumNote] = useState(null)

  const needProof = !!proof
  const fieldsDone = okResult && okOdz

  const finish = (a, b, p) => {
    if (a && b && (!needProof || p) && onSolved) onSolved({ correct: true })
  }

  // O'quvchi o'z sonini qo'yadi va IKKI yozuvning qiymatini yonma-yon ko'radi.
  // Asbob javobni AYTMAYDI: u faqat qiymatlarni hisoblaydi (§2.2.1).
  const check = () => {
    const n = Number(String(num).replace(',', '.'))
    if (!Number.isFinite(n)) return
    const env = {}
    env[proof.varName || 'a'] = n
    const A = parse(proof.from)
    const B = parse(proof.to)
    const va = A.error ? undefined : evaluate(A.node, env)
    const vb = B.error ? undefined : evaluate(B.node, env)
    if (va === null || vb === null) {
      setNumNote(proof.hole || TXT.proofHole)
      return
    }
    const same = typeof va === 'number' && typeof vb === 'number' && Math.abs(va - vb) < 1e-9
    setChecked(true)
    setNumNote(null)
    if (same) finish(okResult, okOdz, true)
    else setNumNote(proof.diff || null)
  }

  return (
    <>
      {show ? <div className="g8-work">{show}</div> : null}
      <Slot mh={66}>
        {canAnswer ? (
          <FieldOne field={result} audio={audio} onOk={() => { setOkResult(true); finish(true, okOdz, checked) }} />
        ) : null}
      </Slot>
      <Slot mh={66}>
        {canAnswer ? (
          <FieldOne field={{ ...odz, kind: 'odz' }} audio={audio} onOk={() => { setOkOdz(true); finish(okResult, true, checked) }} />
        ) : null}
      </Slot>
      {needProof ? (
        <Slot mh={50}>
          {fieldsDone && !checked ? (
            <div className="g8-proof">
              <Ask>{t(proof.ask || TXT.proofAsk)}</Ask>
              <MathField kind="number" value={num} onChange={setNum} onSubmit={check} width={72} />
            </div>
          ) : null}
          {checked ? <ClosedRow>{t(proof.done || TXT.proofDone)} {num}</ClosedRow> : null}
        </Slot>
      ) : null}
      <Slot mh={44}>
        {numNote ? <Note kind="no">{t(numNote)}</Note> : null}
        {fieldsDone && (!needProof || checked) && !numNote && note ? <Note kind="ok">{t(note)}</Note> : null}
      </Slot>
    </>
  )
}

// ============================================================
// 6. RuleBlock — SAVOL, keyin qoida kartochkasi.
//
//    TARTIB TESKARI QILINDI (redaksiya 2, §13 «Ekran 1 va 8 batafsil»).
//    Oldin kartochka «Qoidani ko'rsatish» tugmasi bilan ochilardi, keyin savol
//    berilardi. Endi: savol -> TO'G'RI javob -> kartochka.
//
//    Sabab metodik, oformleniye emas: o'quvchi natijani OLMASDAN o'qigan
//    ta'rif — yodlash uchun matn; XUDDI SHU ta'rif natijadan keyin — u hozir
//    qilgan ishning NOMI. Shu uchun qoida 8-ekranda, 3-ekranda emas.
//
//    Kartochka yopiq turganda AYNAN SHU kartochka chiziladi, faqat matn
//    o'rniga xira chiziq turadi (`masked`). Balandlik shuning uchun ikki
//    holatda BIR XIL va ochilganda ekran SAKRAMAYDI (§14) -- qulfning
//    balandligini qo'lda o'lchab qo'yish kerak emas.
//
//    check: { question, items:[{id,label,right,hint}], done, more }
// ============================================================
export function RuleBlock({ card, check, onSolved, onStep, audio }) {
  const t = useT()
  const sfx = useSfx()
  const [marks, setMarks] = useState([])
  const [wrong, setWrong] = useState([])
  const [note, setNote] = useState(null)
  const [open, setOpen] = useState(false)
  const rights = useMemo(() => check.items.filter((i) => i.right).map((i) => i.id), [check.items])

  const pick = (opt) => {
    if (open) return
    const src = check.items.find((i) => i.id === opt.id)
    if (!src.right) {
      setWrong((prev) => (prev.indexOf(opt.id) === -1 ? prev.concat(opt.id) : prev))
      setNote(src.hint || null)
      sfx.playWrong()
      if (audio && src.hint) audio.say(t(src.hint))
      return
    }
    const next = marks.indexOf(opt.id) === -1 ? marks.concat(opt.id) : marks
    setMarks(next)
    const all = rights.every((r) => next.indexOf(r) !== -1)
    setNote(all ? (check.done || null) : (check.more || null))
    if (all) {
      sfx.playCorrect()
      setOpen(true)
      if (onStep) onStep('card')
      if (onSolved) onSolved({ correct: true, tries: wrong.length + 1 })
      return
    }
    if (audio && check.more) audio.say(t(check.more))
  }

  return (
    <>
      <div>
        <Ask>{t(check.question)}</Ask>
        <Choice
          items={check.items.map((i) => ({ id: i.id, label: i.label }))}
          multi
          dense
          checked={marks}
          wrong={wrong}
          onPick={pick}
          disabled={open}
          cols={1}
        />
      </div>

      {/* Yopiq va ochiq holat -- BITTA kartochka: balandlik bir xil. */}
      <RuleCard
        title={card.title ? t(card.title) : null}
        lines={card.lines.map((l) => t(l))}
        source={card.source ? t(card.source) : null}
        masked={!open}
        lockLabel={card.locked}
      />

      <Slot mh={46}>
        <Note kind={note === check.done ? 'ok' : 'no'}>{note ? t(note) : null}</Note>
      </Slot>
    </>
  )
}

// ============================================================
// 7. Audit — BIRINCHI xato satr, keyin o'quvchining KONTRPRIMERI.
//    rows: [{ id, show }]  ask: { label, at, of, note }
// ============================================================
export function Audit({ rows, answerId, hints, ask, onSolved, onStep, audio }) {
  const t = useT()
  const sfx = useSfx()
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [note, setNote] = useState(null)
  const [num, setNum] = useState('')
  const [proved, setProved] = useState(false)
  const solved = picked === answerId

  const pick = (id) => {
    if (solved) return
    if (id === answerId) {
      setPicked(id)
      setNote(null)
      sfx.playCorrect()
      if (onStep) onStep('proof')
      return
    }
    setWrong((prev) => (prev.indexOf(id) === -1 ? prev.concat(id) : prev))
    setNote(hints[id] || null)
    sfx.playWrong()
    if (audio && hints[id]) audio.say(t(hints[id]))
  }

  const prove = () => {
    const n = Number(String(num).replace(',', '.'))
    if (!Number.isFinite(n)) return
    const env = {}
    env[ask.varName || 'a'] = n
    const P = parse(ask.of)
    const v = P.error ? undefined : evaluate(P.node, env)
    if (v === null) {
      setProved(true)
      if (onSolved) onSolved({ correct: true, tries: wrong.length + 1 })
      return
    }
    setNote(ask.wrong || null)
    if (audio && ask.wrong) audio.say(t(ask.wrong))
  }

  return (
    <>
      <div className={'g8-audit' + (solved ? ' g8-audit-tight' : '')}>
        {rows.map((r, i) => (
          <button
            type="button"
            key={r.id}
            className={'g8-audit-row'
              + (solved && r.id === answerId ? ' g8-audit-hit' : '')
              + (wrong.indexOf(r.id) !== -1 ? ' g8-audit-off' : '')}
            disabled={solved || wrong.indexOf(r.id) !== -1}
            onClick={() => pick(r.id)}
          >
            <span className="g8-audit-n">{i + 1}</span>
            <span className="g8-audit-b">{r.show}</span>
          </button>
        ))}
      </div>

      <Slot mh={solved ? 44 : 0}>
        {solved && !proved ? (
          <MathField kind="number" label={ask.label} value={num} onChange={setNum} onSubmit={prove} width={72} />
        ) : null}
        {proved ? <Note kind="ok">{t(ask.note)}</Note> : null}
      </Slot>

      <Slot mh={58}>
        {!proved ? <Note kind="no">{note ? t(note) : null}</Note> : null}
      </Slot>
    </>
  )
}

// ============================================================
// 8. Boundary — «yozuvlar QAYERDA ajraladi». Javob — qiymatlar TO'PLAMI.
//    Bu savolni variant bilan berish mumkin emas: har qanday variant
//    javobni aytib qo'yadi (raskadrovka, ekran 13).
// ============================================================
export function Boundary({ left, right, odzLeft, odzRight, answer, hints, question, onSolved, audio, note }) {
  const t = useT()
  const [val, setVal] = useState('')
  const [v, setV] = useState(null)
  const [done, setDone] = useState(false)
  const [tries, setTries] = useState(0)

  const submit = () => {
    if (done) return
    const got = parseNumberSet(val)
    if (!got) {
      setV({ why: 'parse', note: TXT.numForm })
      return
    }
    const want = answer.slice().sort((a, b) => a - b)
    const same = got.length === want.length && got.every((x, i) => Math.abs(x - want[i]) < 1e-9)
    if (same) { setDone(true); setV(null); if (onSolved) onSolved({ correct: true, tries: tries + 1 }); return }
    setTries((n) => n + 1)
    const key = got.map((x) => fmt(x)).join(',')
    const hint = (hints && (hints[key] || hints['*'])) || null
    setV({ why: 'set', note: hint })
    if (audio && hint) audio.say(t(hint))
  }

  return (
    <>
      <div className="g8-pair">
        <div className="g8-pair-c">{left}</div>
        <div className="g8-pair-c">{right}</div>
      </div>
      <div className="g8-pair">
        <div className="g8-pair-c"><OdzLine value={odzLeft} /></div>
        <div className="g8-pair-c"><OdzLine value={odzRight} /></div>
      </div>
      <Ask>{t(question)}</Ask>
      <Slot mh={44}>
        <MathField kind="expr" value={val} onChange={setVal} onSubmit={submit} done={done} />
      </Slot>
      <Slot mh={62}>
        {done ? <Note kind="ok">{note ? t(note) : null}</Note> : <Verdict v={v} />}
      </Slot>
    </>
  )
}

// ============================================================
// 8a. Blitz — YAGONA yangi asbob (redaksiya 2). EKRAN 14.
//
//     To'rt savol BITTA panelda, to'rt ekranda EMAS: shunda o'quvchi
//     javoblarini yonma-yon ko'radi, va bu uch ekran budjetini tejaydi.
//
//     Savollar BELGINI so'raydi, yozuvni emas: «qachon ODZ o'zgaradi»,
//     «qayerda ko'paytuvchiga qisqartirish, qayerda hadlab bo'lish».
//
//     BALL YO'Q (metodist qarori 2026-08-06, §0 p. 6): nazariy dars
//     baholanmaydi. Birinchi urinishlardan TAYYORLIK DARAJASI yig'iladi va u
//     SO'Z bilan aytiladi, foiz bilan emas (§2.2.5).
//
//     items: [{ id, ask, options:[{id,label,right}], tag, hint }] — aynan 4 ta.
//     onReady({ first, total, tags }) — 15-ekran shu ma'lumotdan yashaydi.
// ============================================================
export function Blitz({ items, lead, onSolved, onReady, audio }) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [state, setState] = useState({})   // id -> { picked, first, tries }
  const [note, setNote] = useState(null)
  const done = items.every((q) => state[q.id] && state[q.id].picked)
  const reported = useRef(false)

  const pick = (q, opt) => {
    const src = q.options.find((o) => o.id === opt.id)
    const prev = state[q.id] || { tries: 0 }
    if (prev.picked) return
    if (!src.right) {
      const tries = prev.tries + 1
      setState((s) => ({ ...s, [q.id]: { ...prev, tries, wrong: (prev.wrong || []).concat(opt.id) } }))
      setNote(q.hint || null)
      sfx.playWrong()
      if (audio && q.hint) audio.say(t(q.hint))
      return
    }
    const tries = prev.tries + 1
    sfx.playCorrect()
    setNote(null)
    setState((s) => ({ ...s, [q.id]: { ...prev, picked: opt.id, tries, first: tries === 1 } }))
  }

  // Natija BIR MARTA yuboriladi: birinchi urinishlar soni va yopilmagan teglar.
  useEffect(() => {
    if (!done || reported.current) return
    reported.current = true
    const first = items.filter((q) => state[q.id] && state[q.id].first).length
    const tags = items.filter((q) => state[q.id] && !state[q.id].first).map((q) => q.tag)
    if (onReady) onReady({ first, total: items.length, tags })
    if (onSolved) onSolved({ correct: true, tries: 1 })
  }, [done, items, state, onReady, onSolved])

  return (
    <>
      <Ask>{t(lead || UI_TXT.blitzLead)}</Ask>
      <div className="g8-blitz">
        {items.map((q, i) => {
          const st = state[q.id] || {}
          return (
            <div className="g8-blitz-q" key={q.id}>
              <div className="g8-blitz-head">
                <span className="g8-blitz-n">{i + 1}</span>
                <span className="g8-blitz-ask">{t(q.ask)}</span>
              </div>
              <Choice
                items={q.options.map((o) => ({ id: o.id, label: t(o.label) }))}
                picked={st.picked || null}
                wrong={st.wrong || []}
                onPick={(opt) => pick(q, opt)}
                disabled={!canAnswer}
                cols={q.options.length > 2 ? 2 : 1}
              />
            </div>
          )
        })}
      </div>
      <Slot mh={46}>
        {note && !done ? <Note kind="no">{t(note)}</Note> : null}
      </Slot>
    </>
  )
}

// «4», «x = 4», «x=4, x=-4», «4; -4» — bitta javob.
export function parseNumberSet(src) {
  const s = String(src || '').replace(/[−–]/g, '-').replace(/[;]/g, ',')
  const parts = s.split(',').map((x) => x.trim()).filter(Boolean)
  if (!parts.length) return null
  const out = []
  for (const p of parts) {
    const m = p.match(/^(?:[A-Za-z]\s*=\s*)?(-?\d+(?:[.,]\d+)?)$/)
    if (!m) return null
    out.push(Number(m[1].replace(',', '.')))
  }
  return out.sort((a, b) => a - b)
}

// ============================================================
// 9. Inverse — TESKARI topshiriq: natija va ODZ berilgan, kasrni o'quvchi
//    YOZADI. To'g'ri javob ko'p, shuning uchun IKKI XOSSA tekshiriladi.
//    Plitka bilan berilsa topshiriq to'rtta variantni saralashga aylanadi.
// ============================================================
export function Inverse({ prompt, reduceTo, excluded, varName = 'a', hints, onSolved, audio, note }) {
  const t = useT()
  const [val, setVal] = useState('')
  const [v, setV] = useState(null)
  const [done, setDone] = useState(false)
  const [tries, setTries] = useState(0)

  const submit = () => {
    if (done) return
    const src = String(val || '').trim()
    if (!src) return
    const p = parse(src)
    if (p.error) { setV({ why: 'parse', note: L('Yozuv tugallanmagan.', 'Запись не дописана.', 'Incomplete record.') }); return }
    const keyed = hints ? hints[src.replace(/\s+/g, '')] : null

    const red = checkReduction(src, reduceTo, {})
    if (!red.ok) {
      setTries((n) => n + 1)
      setV({
        why: red.why === 'value' ? 'value' : 'set',
        note: keyed || TXT.reduceNo,
        at: red.point ? varName + ' = ' + fmt(red.point[varName]) : '',
        mine: red.why === 'value' ? red.mine : undefined,
        ref: red.why === 'value' ? red.ref : undefined,
      })
      if (audio) audio.say(t(keyed || TXT.reduceNo))
      return
    }
    const holes = domainHoles(src, varName).holes || []
    const want = (excluded || []).slice().sort((a, b) => a - b)
    const same = holes.length === want.length && holes.every((x, i) => Math.abs(x - want[i]) < 1e-9)
    if (!same) {
      setTries((n) => n + 1)
      setV({ why: 'set', note: keyed || TXT.odzNo })
      if (audio) audio.say(t(keyed || TXT.odzNo))
      return
    }
    setDone(true)
    setV(null)
    if (onSolved) onSolved({ correct: true, tries: tries + 1 })
  }

  return (
    <>
      <Ask>{t(prompt)}</Ask>
      <Slot mh={44}>
        <MathField value={val} onChange={setVal} onSubmit={submit} done={done} />
      </Slot>
      <Slot mh={62}>
        {done ? <Note kind="ok">{note ? t(note) : null}</Note> : <Verdict v={v} />}
      </Slot>
    </>
  )
}

// ============================================================
// Kichik yordamchi: kasrni ma'lumotdan yasash (§20 p.19 — SLASH bilan emas).
// ============================================================
export const F = (num, den, size) => <Frac num={num} den={den} size={size} />

export const TOOLS_STYLES = `
/* ============ BLITS (ekran 14): to'rt savol BITTA panelda ============ */
.g8-blitz { display: grid; gap: clamp(8px, 1.1vw, 12px); flex-shrink: 0; grid-template-columns: 1fr 1fr; }
/* 859 dan pastda bitta ustun: yonma-yon ikki savol yozuvni uch satrga yoradi. */
@media (max-width: 859.98px) { .g8-blitz { grid-template-columns: 1fr; } }
.g8-blitz-q {
  display: flex; flex-direction: column; gap: 5px;
  padding: clamp(9px, 1.2vw, 13px) clamp(10px, 1.3vw, 14px);
  border-radius: 16px;
  background: ${T.paper};
  box-shadow: 0 10px 26px -12px rgba(${T.shadow},.22), inset 0 0 0 1px ${T.line};
  overflow: clip;
  min-width: 0;
}
.g8-blitz-head { display: flex; align-items: baseline; gap: 8px; }
.g8-blitz-n {
  flex-shrink: 0;
  font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700;
  color: ${T.ink3};
}
/* Savol SO'Z bilan: Manrope, ko'chirish bilan. Serif nowrap prozа chetga
   chiqib G'OYIB BO'LADI (11-sinfda 557px vylet bergan). */
.g8-blitz-ask {
  font-family: 'Manrope', sans-serif;
  font-size: clamp(12.5px, 1.05vw, 14px); line-height: 1.35; font-weight: 700;
  color: ${T.ink}; white-space: normal; overflow-wrap: anywhere;
}
.g8-blitz .g8-opt { min-height: clamp(38px, 2.9vw, 44px); padding: 7px 12px; font-size: clamp(12px, 1vw, 13.5px); }
.g8-blitz .g8-opt-badge { min-width: 14px; font-size: 11.5px; }

/* ============ O'Z SONI BILAN TEKSHIRISH (ekran 11) ============ */
.g8-proof { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

/* ============ SON QO'YISH JADVALI ============ */
.g8-subrows { display: flex; flex-direction: column; gap: 3px; flex-shrink: 0; }
.g8-subrow {
  display: grid; grid-template-columns: minmax(0,1fr) 18px 92px;
  align-items: center; gap: 8px; min-height: 32px;
  font-family: ${MATH_FONT}; font-variant-numeric: tabular-nums lining-nums;
  font-size: clamp(15px, 1.5vw, 20px);
  word-spacing: .1em;
}
.g8-subrow-arrow { color: ${T.ink4}; }
.g8-subrow-v { text-align: right; font-weight: 700; }
.g8-checked {
  font-size: 11.5px; color: ${T.ink3}; letter-spacing: .04em;
  font-family: 'JetBrains Mono', monospace;
}

/* ============ QAYTA YOZISH: tetraddagidek pastga o'sadi ============ */
.g8-work {
  display: flex; flex-direction: column; gap: 3px; flex-shrink: 0;
  padding: clamp(9px, 1.2vw, 13px) clamp(11px, 1.4vw, 15px);
  border-radius: 16px;
  background: ${T.paper};
  box-shadow: 0 10px 26px -12px rgba(${T.shadow},.22), inset 0 0 0 1px ${T.line};
  overflow: clip;
  min-width: 0;
}
.g8-work-line {
  min-height: 32px; display: flex; align-items: center;
  font-family: ${MATH_FONT}; font-variant-numeric: tabular-nums lining-nums;
  font-size: clamp(15px, 1.6vw, 21px);
  word-spacing: .12em;
}

/* ============ AMALLAR QATORI ============
   Noutbukda BITTA satr, telefonda ko'chadi: 390 da to'rt tugma 158px
   vylet bergan (11-sinf saboqi). */
.g8-acts { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; }
.g8-acts-tag {
  font-size: 10px; letter-spacing: .15em; text-transform: uppercase;
  color: ${T.ink3}; font-weight: 700;
}
.g8-act {
  min-height: 34px; padding: 0 12px;
  border: 0; border-radius: 11px;
  background: ${T.paper}; color: ${T.ink};
  font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 16px -12px rgba(${T.shadow},.4), inset 0 0 0 1px ${T.line};
  transition: transform .24s cubic-bezier(.22,.61,.36,1), box-shadow .24s;
}
.g8-act:hover { transform: translateY(-1px); box-shadow: 0 12px 22px -14px rgba(${T.shadow},.5), inset 0 0 0 1px ${T.line}; }

/* ============ TAYYOR YECHIM: birinchi xato satr ============ */
.g8-audit { display: flex; flex-direction: column; gap: 5px; flex-shrink: 0; }
.g8-audit-tight { gap: 2px; }
.g8-audit-row {
  display: flex; align-items: center; gap: 10px;
  min-height: 38px; padding: 6px 12px;
  border: 0; border-radius: 12px;
  background: ${T.paper}; color: ${T.ink};
  font-family: ${MATH_FONT}; font-size: clamp(14px, 1.4vw, 18px);
  word-spacing: .1em;
  text-align: left; cursor: pointer;
  box-shadow: 0 8px 20px -14px rgba(${T.shadow},.4), inset 0 0 0 1px ${T.line};
  transition: min-height .35s cubic-bezier(.22,.61,.36,1), padding .35s, font-size .35s, opacity .3s, box-shadow .24s, transform .24s;
  min-width: 0;
}
.g8-audit-tight .g8-audit-row { min-height: 30px; padding: 3px 12px; font-size: clamp(12.5px, 1.2vw, 15px); }
.g8-audit-row:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 14px 26px -14px rgba(${T.shadow},.5), inset 0 0 0 1px ${T.line}; }
/* Topilgan xato satr AMBER bilan belgilanadi, qizil bilan EMAS (§18). */
.g8-audit-hit { background: ${T.tipSoft}; box-shadow: inset 0 0 0 1px rgba(${T.tipRgb},.3); }
.g8-audit-off { opacity: .34; }
.g8-audit-n { color: ${T.ink3}; font-family: 'JetBrains Mono', monospace; font-size: 11px; min-width: 12px; flex-shrink: 0; }
.g8-audit-b { min-width: 0; white-space: normal; overflow-wrap: anywhere; }

/* ============ IKKI YOZUV YONMA-YON ============ */
.g8-pair { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(8px, 1.4vw, 18px); flex-shrink: 0; min-width: 0; }
.g8-pair > * { min-width: 0; }
.g8-pair-c { min-width: 0; display: flex; align-items: center; justify-content: center; }
/* Telefonda ikki yozuv USTUN bo'ladi: yonma-yon ular chetga chiqadi. */
@media (max-width: 859.98px) {
  .g8-pair { grid-template-columns: minmax(0, 1fr); gap: 6px; }
  .g8-work { padding: 9px 10px; border-radius: 13px; }
  .g8-audit-row { min-height: 34px; padding: 5px 10px; }
  /* BLITS telefonda bitta ustun bo'ladi va to'rt kartochka QO'SHILADI:
     390 da 16, 360 da 7 piksel chiqib ketgan edi. To'rt savol ham qoladi,
     zichlashadigan narsa -- oraliq va variant balandligi. */
  .g8-blitz { gap: 6px; }
  .g8-blitz-q { padding: 7px 9px; gap: 3px; border-radius: 13px; }
  .g8-blitz-ask { font-size: 12px; line-height: 1.28; }
  .g8-blitz .g8-opt { min-height: 34px; padding: 5px 10px; font-size: 12px; }
  .g8-blitz .g8-choice { gap: 4px; }
}
`
