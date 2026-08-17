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
  cantDivide: L("bo'lish mumkin emas", 'делить нельзя', 'division is impossible'),
  hasValue: L('qiymat bor', 'значение есть', 'the value exists'),
  plotter: L('Plotter', 'Плоттер', 'Plotter'),
  table: L('Jadval', 'Таблица', 'Table'),
  value: L('qiymat', 'значение', 'value'),
  buildHere: L("Bo'laklarni shu yerga tartib bilan qo'ying", 'Складывай фрагменты сюда по порядку', 'Put the fragments here in order'),
  lineFig: L('Son o\'qi', 'Числовая прямая', 'Number line'),
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
//
// `sign` — IKKI yozuv orasidagi doiradagi belgi (§14, «Xuk»): `≠` — bahs
// AYNIYLIK haqida bo'lsa, `?` — bahs MAVJUDLIK haqida bo'lsa (1-darsda
// aynan shu: bir yozuv nolda bor, ikkinchisi yo'q). Belgi asbobda turadi,
// dars faylida chizilmaydi — aks holda 55 darsda 55 marta chiziladi.
export function Substitute({ rows, varName = 'a', ask, predict, minChecked = 2, decimals = 2, tone = 'ok', sign, onSolved, audio, after }) {
  const t = useT()
  const sfx = useSfx()
  const [num, setNum] = useState('')
  const [checked, setChecked] = useState([])
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [note, setNote] = useState(null)
  // TAXMIN (xuk): pozitsiya asbobdan OLDIN olinadi va BAHOLANMAYDI (§2.1).
  const [guess, setGuess] = useState(null)

  const askFired = useRef(false)
  useEffect(() => {
    if (!ask || askFired.current) return
    if (checked.length < minChecked) return
    if (predict && !guess) return
    askFired.current = true
    if (audio) audio.step('ask')
  }, [checked.length, minChecked, ask, audio, predict, guess])

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
      // `predicted` — 15-ekranga: taxmin natija bilan YONMA-YON turadi (§13).
      if (onSolved) onSolved({ correct: true, tries: wrong.length + 1, predicted: guess })
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
          <React.Fragment key={r.id}>
            {i > 0 && sign && rows.length === 2 ? (
              <div className="g8-subsign" aria-hidden="true"><span>{sign}</span></div>
            ) : null}
            <div className="g8-subrow">
              <span className="g8-subrow-l">{r.show}</span>
              <span className="g8-subrow-arrow">{checked.length ? '→' : ''}</span>
              <span className={'g8-subrow-v' + (values && values[i] === null ? ' g8-t-dim' : '')}>
                {values ? show(values[i]) : ''}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* TAXMIN asbobdan OLDIN: pozitsiya -> asbob -> xulosa. Pozitsiya
          olingach blok INGICHKA satrga yig'iladi — ekran o'smaydi, joy
          xulosa savoliga bo'shaydi (§14 p. 2). */}
      {predict ? (
        <Slot mh={guess ? 28 : 78}>
          {guess ? (
            <ClosedRow>
              {t(predict.tag)}{'  '}
              {t((predict.items.find((i) => i.id === guess) || {}).label)}
            </ClosedRow>
          ) : (
            <div>
              <Ask>{t(predict.question)}</Ask>
              <Choice
                items={predict.items.map((i) => ({ id: i.id, label: t(i.label) }))}
                picked={null}
                onPick={(opt) => { setGuess(opt.id); if (audio) audio.step('guess') }}
                cols={2}
                tone="cool"
              />
            </div>
          )}
        </Slot>
      ) : null}

      {/* Xulosa chiqarilgach asbob INGICHKA satrga yig'iladi: maydon ham,
          «tekshirildi» qatori ham kerak emas, tekshirilgan sonlar esa qoladi.
          Bu shunchaki tartib emas — telefonda maydon bilan birga EKRAN
          KLAVIATURASI ham turadi va u 138 piksel egallaydi; xulosadan keyin
          ekran 360 px da 36 piksel chiqib ketardi (o'lchandi 2026-08-13). */}
      {picked ? (
        <Slot mh={28}>
          <ClosedRow>{t(TXT.checked)} {checked.map((c) => fmt(c)).join(', ')}</ClosedRow>
        </Slot>
      ) : (
        <>
          <Slot mh={44}>
            <MathField
              kind="number"
              label={TXT.put}
              value={num}
              onChange={setNum}
              onSubmit={put}
              disabled={!!predict && !guess}
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
        </>
      )}

      {/* Joy TAXMIN olinganda band qilinadi, oldin emas: xukda ikki yozuv,
          taxmin bloki va savol bir vaqtda 615 pikselli noutbukka sig'maydi
          (o'lchandi 2026-08-13, 70 piksel chiqib ketgan edi). Taxmin ingichka
          satrga yig'ilgach, savol AYNAN uning joyiga tushadi (§14 p. 2). */}
      <Slot mh={ask && (!predict || guess) ? 74 : 0}>
        {ask && checked.length >= minChecked && (!predict || guess) ? (
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
    // Razbor topshiriqdan olinadi: «umumiy ko'paytuvchi bor» 3-darsning
    // razbori, 1-darsda maxrajni nolga aylantiruvchi SON bor.
    const why = item.noneWrong || TXT.noneWrong
    setNoneWrong(why)
    if (audio) audio.say(t(why))
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
          noneLabel={item.noneLabel}
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
// ODZ satri IKKI holatda turadi:
//   `odz` berilgan   -- satr TAYYOR: bu ekranda ODZ shart, javob emas;
//   `odz` YO'Q, lekin maydonlar orasida kind 'odz' bor -- satr BO'SH turadi
//   va O'QUVCHI javob berganda to'ladi (§4: «Pishet ee uchenik, pribor ne
//   zapolnyaet»). Oldin bunday emas edi: javobni so'raydigan ekranda satr
//   javobni O'ZI ko'rsatib turardi, ya'ni asbob orakul bo'lib qolardi.
export function Fields({ show, odz, fields, onSolved, onStep, audio, note }) {
  const t = useT()
  const [step, setStep] = useState(0)
  const [written, setWritten] = useState(null)
  const asksOdz = fields.some((f) => f.kind === 'odz')

  const done = (i, res) => {
    const next = i + 1
    setStep(next)
    if (fields[i].kind === 'odz' && res && res.value) setWritten(res.value)
    if (onStep) onStep('f' + next)
    if (next >= fields.length && onSolved) onSolved({ correct: true })
  }

  return (
    <>
      {show ? <div className="g8-frame g8-work">{show}</div> : null}
      {odz ? <OdzLine value={odz} /> : null}
      {!odz && asksOdz ? <OdzLine value={written} empty={!written} /> : null}
      {fields.map((f, i) => (
        <Slot key={i} mh={i <= step ? 66 : 0}>
          {i <= step ? (
            <FieldOne
              field={f}
              audio={audio}
              onOk={(res) => done(i, res)}
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
  const [noneWrong, setNoneWrong] = useState(null)

  // «Taqiqlangan qiymat yo'q» — TUGMA, matn emas (§10.1). Tugma HAMMA
  // topshiriqda turadi: faqat javobi «yo'q» bo'lganda paydo bo'lsa, uni
  // o'quvchi PAYDO BO'LGANI uchun bosadi.
  const pressNone = () => {
    if (field.none === true) { onOk({ tries: j.tries + 1, value: field.noneValue }); return }
    const why = field.noneWrong || TXT.noneWrong
    setNoneWrong(why)
    if (audio) audio.say(t(why))
  }

  return (
    <div className="g8-in">
      {field.ask ? <Ask>{t(field.ask)}</Ask> : null}
      <MathField
        kind={field.kind || 'expr'}
        label={field.label}
        value={j.val}
        onChange={(x) => { j.setVal(x); setNoneWrong(null) }}
        onSubmit={j.submit}
        done={j.done}
        none={field.none !== undefined}
        noneLabel={field.noneLabel}
        onNone={pressNone}
      />
      <Slot mh={j.v || noneWrong ? 58 : 0}>
        {noneWrong ? <Note kind="no">{t(noneWrong)}</Note> : <Verdict v={j.v} labels={field.labels} />}
      </Slot>
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
      {show ? <div className="g8-frame g8-work">{show}</div> : null}
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
        {/* Ikki ustun, bitta emas: to'rt yozuv bitta ustunda 258 piksel
            egallardi va 615 pikselli noutbukda qoida kartochkasi ish zonasidan
            16 piksel chiqib ketardi (o'lchandi 2026-08-13). Yozuvlar qisqa
            (kasrlar), 390 px da 2 x 2 bo'lib turadi — §14 talab qilgan sxema. */}
        <Choice
          items={check.items.map((i) => ({ id: i.id, label: i.label }))}
          multi
          dense
          checked={marks}
          wrong={wrong}
          onPick={pick}
          disabled={open}
          cols={2}
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
            {/* Satr JSX ham, uch tilli yozuv ham bo'lishi mumkin: oxirgi satrda
                «ODZ» so'zi turadi va u tilga bog'liq. */}
            <span className="g8-audit-b">{React.isValidElement(r.show) ? r.show : t(r.show)}</span>
          </button>
        ))}
      </div>

      {/* Joy BIRINCHI soniyadan band (§14 p. 1): oldin bu slot javobdan keyin
          0 dan 44 ga o'sardi, va telefonda kontrprimer maydoni ish zonasidan
          PASTGA chiqib ketardi — `overflow: clip` sababli u shunchaki
          yo'qolardi, ya'ni topshiriqni yopish imkoni yo'q edi
          (o'lchandi 2026-08-13, 390 va 360 px). */}
      <Slot mh={44}>
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
export function Boundary({ left, right, odzLeft, odzRight, fig, answer, hints, question, onSolved, audio, note }) {
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
      {/* VERTIKAL: har yozuv O'Z ODZ satri bilan bitta blok bo'ladi.
          Ilgari ikki qator yonma-yon turardi va vertikalga o'tganda yozuv
          bilan uning sohasi AJRALIB qolardi. */}
      <div className="g8-pair">
        <div className="g8-bnd">
          {left}
          <OdzLine value={odzLeft} />
        </div>
        <div className="g8-bnd">
          {right}
          <OdzLine value={odzRight} />
        </div>
      </div>
      {/* IKKI YOZUV BITTA O'QDA: qayerda ajralishi KO'RINADI, aytilmaydi.
          Nuqtalar birma-bir keladi, ajralish nuqtasida chapdagi BO'SH. */}
      {fig ? (
        <div className="g8-frame g8-frame-fig">
          {/* Чертёж может прийти ГОТОВЫМ УЗЛОМ: так сюда встаёт координатная
              плоскость из plot.jsx, у которой своя математика и свои оси.
              Объект вида { kind, data } остаётся для прежних фигур. */}
          {React.isValidElement(fig)
            ? fig
            : React.createElement(FIGURES[fig.kind] || PairFig, { data: fig.data, phase: 3 })}
        </div>
      ) : null}
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
export function Blitz({ items, lead, onSolved, onReady, audio, buildView, scoreLabel }) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [state, setState] = useState({})   // id -> { picked, first, tries }
  const [note, setNote] = useState(null)
  const done = items.every((q) => state[q.id] && state[q.id].picked)
  // ПОСЛЕДОВАТЕЛЬНО (методист, 2026-08-17). Вопросы выходят по одному:
  // все четыре сразу читаются как анкета, а не как блиц.
  const at = items.findIndex((q) => !(state[q.id] && state[q.id].picked))
  const scored = items.filter((q) => state[q.id] && state[q.id].first).length
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

  const closeBuild = (q, clean) => {
    const prev = state[q.id] || { tries: 0 }
    if (prev.picked) return
    setState((s2) => ({ ...s2, [q.id]: { ...prev, picked: 'built', tries: 1, first: clean } }))
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
      {/* VERTIKAL (metodist, 2026-08-13). To'rt savol BITTA panelda qoladi:
          javob berilgani INGICHKA satrga yig'iladi va ekrandan ketmaydi,
          shuning uchun o'quvchi javoblarini yonma-yon ko'radi (§10). */}
      <div className="g8-blitz">
        {items.map((q, i) => {
          const st = state[q.id] || {}
          if (!st.picked && i !== at) return null
          if (st.picked) {
            const chosen = q.options.find((o) => o.id === st.picked)
            return (
              <div className="g8-blitz-done" key={q.id}>
                <span className="g8-blitz-n">{i + 1}</span>
                <span className="g8-blitz-ask">{t(q.ask)}</span>
                <span className="g8-blitz-ans">{t(chosen ? chosen.label : (q.builtLabel || ''))}</span>
                <span className={'g8-blitz-dot' + (st.first ? ' is-first' : '')}/>
              </div>
            )
          }
          return (
            <div className="g8-blitz-q" key={q.id}>
              <div className="g8-blitz-head">
                <span className="g8-blitz-n">{i + 1}</span>
                <span className="g8-blitz-ask">{t(q.ask)}</span>
              </div>
              {q.build && buildView
                ? buildView(q, (clean) => closeBuild(q, clean))
                : (
              <Choice
                items={q.options.map((o) => ({ id: o.id, label: t(o.label) }))}
                picked={null}
                wrong={st.wrong || []}
                onPick={(opt) => pick(q, opt)}
                disabled={!canAnswer}
                cols={2}
                dense
              />
              )}
            </div>
          )
        })}
        {/* СЧЁТ идёт по ПЕРВОЙ попытке: со второго раза вопрос не
            засчитывается — иначе перебор вариантов выглядит как знание. */}
        {done ? (
          <div className="g8-blitz-score">
            <b>{scored} / {items.length}</b>
            <span>{t(scoreLabel)}</span>
          </div>
        ) : null}
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
// 11. TapPart — DARSNING ASOSIY ASBOBI (metodist qarori 2026-08-13).
//
//     7-sinfdagi `StepOrder` ning 8-sinf uchun tarjimasi: qo'l YOZUVNING
//     ICHIDA ishlaydi. O'quvchi ikki qavatli kasrning QAYSI qismidan taqiq
//     kelib chiqishini o'zi bosadi, keyin o'z sonini qo'yadi va natijani
//     ko'radi: son yoki «bo'lish mumkin emas».
//
//     IKKI REJIM, BITTA KOD YO'LI:
//       demo = true  -- dastur o'zi boradi: qo'l ko'rsatkichi qismga keladi,
//                       son kasrga UCHIB tushadi, izoh qadamni nomlaydi.
//                       Lekin SAVOLLAR baribir o'quvchiga beriladi va
//                       javobsiz demo TO'XTAB TURADI (3-sinf `TapBinDemo`).
//       demo = false -- xuddi shu qadamlarni o'quvchi O'ZI bajaradi.
//     Shuning uchun o'quvchi AYNAN ko'rgan ishni takrorlaydi.
//
//     Qadamlar: qismni bosish -> sonni qo'yish -> chiziq uziladi -> ODZ.
//     Oxirgi qadamni asbob YOZMAYDI: ODZ ni o'quvchi yozadi (§4, §2.2.1).
// ============================================================
export function TapPart({
  num, den, expr, varName = 'x', size = 'big',
  tapAsk, tapWrong, probe, odz, demo = false, hint, fig,
  onSolved, onStep, audio,
}) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [picked, setPicked] = useState(null)      // 'num' | 'den'
  const [wrongPart, setWrongPart] = useState(false)
  const [num1, setNum1] = useState('')
  const [put, setPut] = useState(null)            // qo'yilgan son
  const [broke, setBroke] = useState(false)       // chiziq uzildi
  const [answered, setAnswered] = useState(null)  // yo'l-yo'lakay savol
  const [tries, setTries] = useState(0)           // qo'yilgan sonlar soni
  const [pulse, setPulse] = useState(0)           // maxraj bir taktda urib qo'yadi
  const [wrongAns, setWrongAns] = useState([])
  const [note, setNote] = useState(null)
  const [odzDone, setOdzDone] = useState(false)
  const [odzVal, setOdzVal] = useState(null)
  // Demo: qo'l va uchish. Bular FAQAT demo rejimida bor.
  const [hand, setHand] = useState(demo ? 'den' : null)
  const [fly, setFly] = useState(false)

  // `onStep` HAR RENDERDA yangi funksiya bo'ladi (u `audio` ustida yopiladi,
  // `audio` esa har renderda yangi obyekt). Uni effekt bog'liqligiga qo'yish
  // TAYMERNI HAR RENDERDA BEKOR QILADI: chiziqning uzilishi hech qachon
  // boshlanmagan va 4-ekran YOPILMAGAN edi (topildi 2026-08-13 prokliklashda).
  // Shuning uchun refda.
  const stepRef = useRef(onStep)
  stepRef.current = onStep
  const fire = (name) => { if (stepRef.current) stepRef.current(name) }

  // --- demo: qo'l qismga keladi va o'zi bosadi -------------------------------
  useEffect(() => {
    if (!demo || picked) return undefined
    const tm = setTimeout(() => { setPicked('den'); setHand(null); fire('p1') }, 1400)
    return () => clearTimeout(tm)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo, picked])

  // --- demo: son kasrga uchib tushadi ---------------------------------------
  useEffect(() => {
    if (!demo || !picked || put !== null) return undefined
    const a = setTimeout(() => setFly(true), 700)
    const b = setTimeout(() => { setFly(false); setPut(probe.at); fire('p2') }, 1500)
    return () => { clearTimeout(a); clearTimeout(b) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo, picked, put])

  // Maxrajning qo'yilgan sondagi qiymati: asbob HISOBLAYDI, javob aytmaydi.
  const denAt = useMemo(() => {
    if (put === null) return null
    const env = {}
    env[varName] = put
    const got = valueAt(String(den).replace(/−/g, '-'), env)
    return got.error ? null : got.value
  }, [put, den, varName])
  const dead = denAt === 0

  // --- chiziq uziladi: FAQAT maxraj nolga aylanganda, bir marta -------------
  //     Son mos kelmasa maydon ochiq qoladi va o'quvchi boshqa son oladi:
  //     kerakli sonni ASBOB aytmaydi (§2.2.1).
  //
  //     `probe.none` — maxrajni nolga aylantiradigan son UMUMAN yo'q (masalan
  //     songa bo'linadi). Unda chiziq uzilmaydi, savol esa ikki urinishdan
  //     keyin keladi: o'quvchi «bunday son yo'q» degan xulosani O'ZI oladi.
  useEffect(() => {
    if (broke) return undefined
    const ready = probe.none ? tries >= (probe.tries || 2) : (put !== null && dead)
    if (!ready) return undefined
    const tm = setTimeout(() => { setBroke(true); fire('p3') }, 420)
    return () => clearTimeout(tm)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [put, dead, broke, tries])

  const tap = (part) => {
    if (picked || demo) return
    if (part === 'den') {
      setPicked('den')
      setWrongPart(false)
      sfx.playCorrect()
      fire('p1')
      return
    }
    setWrongPart(true)
    setNote(tapWrong || null)
    sfx.playWrong()
    if (audio && tapWrong) audio.say(t(tapWrong))
  }

  const submitNum = () => {
    const n = Number(String(num1).replace(',', '.'))
    if (!Number.isFinite(n)) return
    setPut(n)
    setNum1('')
    setTries((k) => k + 1)
    setPulse((k) => k + 1)
    fire('p2')
  }

  const pickAns = (opt) => {
    const src = probe.items.find((i) => i.id === opt.id)
    if (src && src.right) {
      setAnswered(opt.id)
      setNote(null)
      sfx.playCorrect()
      fire('p4')
      return
    }
    setWrongAns((p) => (p.indexOf(opt.id) === -1 ? p.concat(opt.id) : p))
    setNote(src && src.hint ? src.hint : null)
    sfx.playWrong()
    if (audio && src && src.hint) audio.say(t(src.hint))
  }

  const odzTask = { ...odz, kind: 'odz', varName }
  const j = useJudged(odzTask, 'odz', (r) => {
    setOdzDone(true)
    // O'quvchi `!=` yozadi, ekranda esa darslikdagidek `≠` turishi kerak.
    setOdzVal(typeof r.value === 'string' ? r.value.replace(/!=/g, '≠') : r.value)
    fire('odz')
    if (onSolved) onSolved({ correct: true, tries: r.tries })
  }, audio)

  return (
    <>
      {/* YOZUV RAMKADA (1-5-sinf naqshi). Qismlar bosiladigan: qo'l
          yozuvning ICHIDA ishlaydi. */}
      <div className="g8-frame g8-tap-wrap">
        <span className={'g8-frac g8-frac-' + size + (broke && dead ? ' g8-frac-broke' : '')}>
          <button
            type="button"
            data-part="num"
            className={'g8-frac-n g8-tap' + (picked === 'num' ? ' is-on' : '') + (wrongPart ? ' is-tip' : '')}
            disabled={!!picked || demo || !canAnswer}
            onClick={() => tap('num')}
          >
            {num}
          </button>
          <span className="g8-frac-bar" />
          <button
            type="button"
            data-part="den"
            key={'den' + pulse}
            className={'g8-frac-d g8-tap' + (picked === 'den' ? ' is-on' : '') + (pulse ? ' g8-tap-beat' : '')}
            disabled={!!picked || demo || !canAnswer}
            onClick={() => tap('den')}
          >
            {put !== null && dead ? '0' : den}
          </button>
        </span>
        {hand ? <span className="g8-tap-hand" aria-hidden="true">☝</span> : null}
        {fly ? <span className="g8-tap-fly" aria-hidden="true">{fmt(probe.at)}</span> : null}
      </div>

      {/* Qo'yilgan son va natija. «Xato» so'zi yo'q: son va natija turadi. */}
      <Slot mh={26}>
        {put !== null ? (
          <div className="g8-tap-res">
            <span className="g8-tap-at">{varName} {'='} {fmt(put)}</span>
            <span className="g8-tap-arrow">{'→'}</span>
            <span className={dead ? 'g8-tap-dead' : 'g8-tap-live'}>
              {dead ? t(TXT.cantDivide) : t(TXT.hasValue)}
            </span>
          </div>
        ) : null}
      </Slot>

      {/* Sonni O'QUVCHI qo'yadi (demo rejimida asbob o'zi). Son maxrajni
          nolga aylantirmasa, maydon OCHIQ qoladi: kerakli sonni asbob
          aytmaydi, o'quvchi o'zi topadi. */}
      {/* Maydon savol chiqqandan keyin KERAK EMAS: songa bo'linadigan
          yozuvda maxraj hech qachon nolga aylanmaydi, va maydon ekranda
          bo'sh turib qolardi (skrinshot, 5-ekran). */}
      <Slot mh={picked && !dead && !demo && !broke ? 44 : 0}>
        {picked && !dead && !demo && !broke && canAnswer ? (
          <MathField
            kind="number"
            label={probe.label || TXT.put}
            value={num1}
            onChange={setNum1}
            onSubmit={submitNum}
            width={72}
          />
        ) : null}
      </Slot>

      {/* YO'L-YO'LAKAY SAVOL. Javobsiz demo ham, ish ham davom etmaydi. */}
      <Slot mh={74}>
        {broke && !answered ? (
          <div className="g8-in">
            <Ask>{t(probe.question)}</Ask>
            <Choice
              items={probe.items.map((i) => ({ id: i.id, label: t(i.label) }))}
              picked={answered}
              wrong={wrongAns}
              onPick={pickAns}
              cols={2}
              disabled={!canAnswer}
            />
          </div>
        ) : null}
        {answered && !odzDone ? (
          <div className="g8-in">
            <Ask>{t(odz.ask)}</Ask>
            <MathField
              kind="odz"
              value={j.val}
              onChange={j.setVal}
              onSubmit={j.submit}
              done={j.done}
              none={odz.none !== undefined}
              noneLabel={odz.noneLabel}
              onNone={() => {
                if (odz.none === true) {
                  setOdzDone(true)
                  setOdzVal(odz.noneValue)
                  fire('odz')
                  if (onSolved) onSolved({ correct: true, tries: 1 })
                  return
                }
                setNote(odz.noneWrong || null)
                if (audio && odz.noneWrong) audio.say(t(odz.noneWrong))
              }}
            />
          </div>
        ) : null}
      </Slot>

      <Slot mh={26}>
        {answered ? <OdzLine value={odzVal} empty={!odzVal} blink={!!odzVal} /> : null}
      </Slot>

      {/* XULOSA FIGURASI: javob yozilgach taqiq son o'qida KO'RINADI.
          20-darsdagi begona ildizga tayyorgarlik shu yerdan boshlanadi. */}
      {fig && odzDone ? (
        <div className="g8-frame g8-frame-fig">
          {React.createElement(FIGURES[fig.kind] || FracFig, { data: fig.data, phase: 3 })}
        </div>
      ) : null}

      <Slot mh={58}>
        {odzDone && hint ? <Note kind="ok">{t(hint)}</Note> : null}
        {!odzDone && j.v ? <Verdict v={j.v} /> : null}
        {!odzDone && !j.v && note ? <Note kind="no">{t(note)}</Note> : null}
      </Slot>
    </>
  )
}

// ============================================================
// 12. PlotVsTable — XUK: BITTA yozuv, IKKI MASHINA, boshqa javob.
//     7-sinf urok 1 naqshi («oddiy va injener kalkulyator»), 8-sinf uchun:
//     plotter uzluksiz chiziq chizadi va teshikni ko'rsatmaydi, jadval esa
//     o'sha qatorga chiziqcha qo'yadi. Fakt HAQIQIY va tekshirib ko'rish
//     mumkin: plotter nuqtalarni birlashtiradi.
//     Taxmin BAHOLANMAYDI: firuza, galochka yo'q (§14).
// ============================================================
export function PlotVsTable({
  expr, rows, hole, holeValue, ask, sign = '?', onSolved, audio, after, sceneNode,
}) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [note, setNote] = useState(null)

  const pick = (opt) => {
    const src = ask.items.find((i) => i.id === opt.id)
    if (src && src.right) {
      setPicked(opt.id)
      setNote(after || null)
      sfx.playCorrect()
      if (audio && after) audio.say(t(after))
      if (onSolved) onSolved({ correct: true, tries: wrong.length + 1, predicted: src.label })
      return
    }
    setWrong((p) => (p.indexOf(opt.id) === -1 ? p.concat(opt.id) : p))
    setNote(src && src.hint ? src.hint : null)
    sfx.playWrong()
    if (audio && src && src.hint) audio.say(t(src.hint))
  }

  // Chiziq nuqtalardan quriladi. Plotter teshikni CHIZMAYDI -- shuning uchun
  // chiziq uzluksiz, va aynan shu xukning mazmuni.
  const xs = rows.map((r) => r.x)
  const ys = rows.map((r) => (r.v === null ? holeValue : r.v))
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const minY = Math.min(...ys), maxY = Math.max(...ys)
  const px = (x) => 10 + ((x - minX) / (maxX - minX || 1)) * 396
  const py = (y) => 56 - ((y - minY) / (maxY - minY || 1)) * 44
  const path = rows.map((r, i) => (i ? 'L' : 'M') + px(r.x) + ' ' + py(r.v === null ? holeValue : r.v)).join(' ')

  return (
    <>
      <Row size="big" align="center">{expr}</Row>

      {/* СЦЕНА ХУКА (§6). Если урок дал свою сцену, она РИСУЕТСЯ ВМЕСТО пары
          панелей: две картинки об одном и том же — это не сцена плюс прибор,
          а дубль, и он выбивает хук за фолд. */}
      {sceneNode ? sceneNode : (
      <div className="g8-pair">
        <div className="g8-pair-c g8-machine">
          <span className="g8-machine-h">{t(TXT.plotter)}</span>
          <svg viewBox="0 0 420 64" className="g8-plot" role="img" aria-label={t(TXT.plotter)}>
            <line x1="10" y1="56" x2="410" y2="56" className="g8-plot-ax" />
            <line x1="10" y1="6" x2="10" y2="56" className="g8-plot-ax" />
            <path d={path} className="g8-plot-line" />
            <circle cx={px(hole)} cy={py(holeValue)} r="4.5" className="g8-plot-dot" />
            <text x={px(hole)} y={py(holeValue) - 9} className="g8-plot-lab">{fmt(holeValue)}</text>
          </svg>
        </div>
        {/* Belgi AYNAN ikki mashina ORASIDA turadi. */}
        <div className="g8-signrow"><span className="g8-subsign"><span>{sign}</span></span></div>
        <div className="g8-pair-c g8-machine">
          <span className="g8-machine-h">{t(TXT.table)}</span>
          <ValueTable head={['x', TXT.value]} rows={rows} mark={hole} cascade />
        </div>
      </div>
      )}

      <Slot mh={74}>
        <div className="g8-in">
          <Ask>{t(ask.question)}</Ask>
          <Choice
            items={ask.items.map((i) => ({ id: i.id, label: t(i.label) }))}
            picked={picked}
            wrong={wrong}
            onPick={pick}
            cols={2}
            tone="cool"
            disabled={!canAnswer}
            dense
          />
        </div>
      </Slot>

      <Slot mh={44}>
        <Note kind={picked ? 'ok' : 'no'}>{note ? t(note) : null}</Note>
      </Slot>
    </>
  )
}

// ============================================================
// 13. RuleBuilder — QOIDANI O'QUVCHI YIG'ADI (4-sinf usuli, 7-sinf urok 1).
//     Tayyor kartochkani O'QISH bilan almashtiriladi: o'quvchi bo'laklardan
//     ta'rifni tuzadi, va faqat TO'G'RI yig'ilgandan keyin darslik matni
//     ochiladi. Kartochka yopiq turganda AYNAN shu balandlikda qulf turadi.
// ============================================================
export function RuleBuilder({ fragments, answer, wrongHint, card, after, onSolved, onStep, audio }) {
  const t = useT()
  const sfx = useSfx()
  const [built, setBuilt] = useState([])
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState(null)
  const [misses, setMisses] = useState(0)

  // Bo'laklar har kirishda aralashadi.
  const bag = useMemo(() => {
    const a = fragments.slice()
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp
    }
    return a
  }, [fragments])

  const labelOf = (id) => {
    const f = fragments.find((x) => x.id === id)
    return f ? t(f.label) : ''
  }

  const add = (id) => {
    if (open || built.indexOf(id) !== -1) return
    const next = built.concat(id)
    setBuilt(next)
    setNote(null)
    if (next.length !== answer.length) return
    if (next.join('|') === answer.join('|')) {
      setOpen(true)
      sfx.playCorrect()
      if (onStep) onStep('card')
      if (onSolved) onSolved({ correct: true, tries: misses + 1 })
      return
    }
    setMisses((m) => m + 1)
    setNote(wrongHint || null)
    sfx.playWrong()
    if (audio && wrongHint) audio.say(t(wrongHint))
  }

  const drop = (id) => {
    if (open) return
    setNote(null)
    setBuilt((prev) => prev.filter((x) => x !== id))
  }

  return (
    <>
      <Slot mh={54}>
        <div className="g8-rb-built">
          {built.length
            ? built.map((id, i) => (
              <button type="button" key={id} data-id={id} className="g8-rb-chip is-built" onClick={() => drop(id)}>
                <span className="g8-rb-no">{i + 1}</span>{labelOf(id)}
              </button>
            ))
            : <span className="g8-rb-empty">{t(TXT.buildHere)}</span>}
        </div>
      </Slot>

      <Slot mh={open ? 0 : 78}>
        {!open ? (
          <div className="g8-rb-bag">
            {bag.filter((f) => built.indexOf(f.id) === -1).map((f) => (
              <button type="button" key={f.id} data-id={f.id} className="g8-rb-chip" onClick={() => add(f.id)}>
                {t(f.label)}
              </button>
            ))}
          </div>
        ) : null}
      </Slot>

      <RuleCard
        title={card.title ? t(card.title) : null}
        lines={card.lines.map((l) => t(l))}
        source={card.source ? t(card.source) : null}
        masked={!open}
        lockLabel={card.locked}
      />

      <Slot mh={46}>
        {open ? after : <Note kind="no">{note ? t(note) : null}</Note>}
      </Slot>
    </>
  )
}

// ============================================================
// 15. FIGURALAR — tushuntirish ekranlarining JONLI obyektlari.
//
//     Har figura BITTA obyekt bo'lib, `phase` bilan holatini o'zgartiradi.
//     4-sinfdagi `ClassGroupingAnimation` naqshi: rasm to'plami emas, BITTA
//     chizmaning holatlari. Figura nomi dars ma'lumotida SATR bilan beriladi,
//     shuning uchun dars faylida JSX qolmaydi.
// ============================================================

// 15.1. Ikki qavatli kasr: maxraj tanlanadi, songa aylanadi, chiziq uziladi.
//       phase 0 — yozuv; 1 — maxraj ajratilgan; 2 — maxrajda nol, chiziq uzildi;
//       3 — ODZ satri paydo bo'ldi.
function FracFig({ data, phase }) {
  const t = useT()
  const zero = phase >= 2
  return (
    <div className="g8-fig">
      <span className={'g8-frac g8-frac-big' + (zero ? ' g8-frac-broke' : '')}>
        <span className="g8-frac-n">{data.num}</span>
        <span className="g8-frac-bar" />
        <span className={'g8-frac-d' + (phase >= 1 ? ' g8-fig-pick' : '')}>
          {zero ? '0' : data.den}
        </span>
      </span>
      <Slot h={26}>
        {phase >= 2 ? (
          <span className="g8-fig-cap g8-tap-dead">
            {data.varName} {'='} {fmt(data.at)}{'   →   '}{t(TXT.cantDivide)}
          </span>
        ) : null}
      </Slot>
      <Slot h={26}>{phase >= 3 ? <OdzLine value={data.odz} blink /> : null}</Slot>
    </div>
  )
}

// 15.2. Son o'qi va TESHIK. 20-darsdagi begona ildizga tayyorgarlik: taqiq
//       o'qda BO'SH nuqta bo'lib ko'rinadi, so'z bilan emas.
//       phase 0 — o'q; 1 — sonlar; 2 — teshik ochildi; 3 — yozuv ostida.
function LineFig({ data, phase }) {
  const t = useT()
  const { from, to, hole } = data
  const px = (v) => 16 + ((v - from) / (to - from || 1)) * 388
  const ticks = []
  for (let v = from; v <= to; v += 1) ticks.push(v)
  return (
    <div className="g8-fig">
      <svg viewBox="0 0 420 62" className="g8-line" role="img" aria-label={t(TXT.lineFig)}>
        <line x1="8" y1="34" x2="412" y2="34" className="g8-line-ax" />
        <path d="M412 34 l-7 -4 v8 z" className="g8-line-tip" />
        {ticks.map((v, i) => (
          <g key={v} style={{ animationDelay: (0.06 * i) + 's' }} className={phase >= 1 ? 'g8-line-tk' : 'g8-line-off'}>
            <line x1={px(v)} y1="29" x2={px(v)} y2="39" className="g8-line-ax" />
            <text x={px(v)} y="54" className="g8-line-lab">{v}</text>
          </g>
        ))}
        {phase >= 2 ? (
          <circle cx={px(hole)} cy="34" r="6" className="g8-line-hole" />
        ) : null}
      </svg>
      <Slot h={26}>
        {phase >= 3 ? <OdzLine value={data.odz} blink /> : null}
      </Slot>
    </div>
  )
}

// 15.3. Jadval va plotter yonma-yon. Xukdagi ikki mashina QAYTADI, endi
//       o'quvchi ularni O'ZI o'qiydi.
//       phase 0 — bo'sh; 1 — jadval to'ladi; 2 — chiziqcha; 3 — ODZ.
function TableFig({ data, phase }) {
  const t = useT()
  const rows = phase >= 2
    ? data.rows
    : (phase >= 1
      ? data.rows.map((r) => (r.v === null ? { x: r.x, v: '' } : r))
      : data.rows.map((r) => ({ x: r.x, v: '' })))
  return (
    <div className="g8-fig">
      <Row size="row" align="center">{data.expr}</Row>
      <ValueTable head={['x', TXT.value]} rows={rows} mark={data.hole} cascade={phase >= 1} />
      <Slot h={26}>
        {phase >= 3 ? <OdzLine value={data.odz} blink /> : null}
      </Slot>
    </div>
  )
}

// 15.4. Ikki yozuv BITTA o'qda. Qayerda ajralishi ko'rinadi: bir nuqtada
//       chapdagi yozuvning nuqtasi BO'SH bo'ladi.
//       phase 0 — o'q; 1 — o'ng yozuv nuqtalari; 2 — chap yozuv nuqtalari;
//       3 — ajralish nuqtasi ochiladi.
function PairFig({ data, phase }) {
  const t = useT()
  const { from, to, hole, points } = data
  const px = (v) => 14 + ((v - from) / (to - from || 1)) * 392
  // IKKI QATOR nuqta: yuqorida chap yozuv, pastda o'ng yozuv. Bitta qatorda
  // ular bir-birini yopib qo'yardi va ajralish ko'rinmasdi. Yozuvlar SVG dan
  // TASHQARIDA: ichkarida ular birinchi nuqtaning ustiga tushardi
  // (o'lchandi 2026-08-14 skrinshotda).
  return (
    <div className="g8-fig">
      <div className="g8-fig-keys">
        <span className="g8-fig-key g8-fig-key-a">{data.leftLabel}</span>
        <span className="g8-fig-key g8-fig-key-b">{data.rightLabel}</span>
      </div>
      <svg viewBox="0 0 420 58" className="g8-line g8-line-tall" role="img" aria-label={t(TXT.lineFig)}>
        <line x1="8" y1="42" x2="412" y2="42" className="g8-line-ax" />
        {points.map((v, i) => (
          <g key={v} style={{ animationDelay: (0.07 * i) + 's' }} className={phase >= 1 ? 'g8-line-tk' : 'g8-line-off'}>
            <line x1={px(v)} y1="38" x2={px(v)} y2="46" className="g8-line-ax" />
            <text x={px(v)} y="56" className="g8-line-lab">{v}</text>
            <circle cx={px(v)} cy="26" r="4.5" className="g8-pt-b" />
          </g>
        ))}
        {phase >= 2 ? points.map((v, i) => (
          v === hole
            ? <circle key={'h' + v} cx={px(v)} cy="12" r="5.5" className="g8-line-hole" style={{ animationDelay: (0.07 * i) + 's' }} />
            : <circle key={'a' + v} cx={px(v)} cy="12" r="4.5" className="g8-pt-a" style={{ animationDelay: (0.07 * i) + 's' }} />
        )) : null}
      </svg>
    </div>
  )
}

const FIGURES = { frac: FracFig, line: LineFig, table: TableFig, pair: PairFig }

// ============================================================
// 16. Film — KADRLAR LENTASI (4-sinf `AnimatedExplanation` naqshi).
//
//     Tushuntirish ekrani shunday quriladi: TEPADA bitta obyekt, PASTDA
//     kadrlar lentasi. O'quvchi kadrni bosadi — obyekt o'sha holatga o'tadi,
//     ovoz aynan shu fikrni aytadi, kadrga belgi qo'yiladi. Ochilmagan kadr
//     bosilmaydi: tartib saqlanadi.
//
//     NEGA lenta: o'quvchi tushuntirish NECHTA qadamdan iboratligini va
//     hozir QAYERDA turganini ko'radi, va kerak bo'lsa kadrga QAYTADI.
//     Taymer bilan ochiladigan ko'rsatishda bu ikkalasi ham yo'q edi.
//
//     Kadrda `ask` bo'lsa — savol beriladi va javobsiz kadr yopilmaydi:
//     «yo'l-yo'lakay savol» talabi shu yerda bajariladi.
// ============================================================
export function Film({ fig, data, frames, done, onDone, onStep, audio }) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [at, setAt] = useState(0)
  const [seen, setSeen] = useState([0])
  const [answered, setAnswered] = useState({})
  const [wrong, setWrong] = useState([])
  const [note, setNote] = useState(null)
  const firedRef = useRef(false)
  const stepRef = useRef(onStep)
  stepRef.current = onStep

  const Fig = FIGURES[fig] || FracFig
  const cur = frames[at]
  const needAsk = cur && cur.ask && !answered[cur.id]
  const all = frames.every((f) => seen.indexOf(f.id) !== -1 || seen.indexOf(frames.indexOf(f)) !== -1)

  useEffect(() => {
    if (!all || needAsk || firedRef.current) return
    firedRef.current = true
    if (onDone) onDone()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, needAsk])

  const go = (i) => {
    if (i > seen.length) return          // tartib: kadrlar ketma-ket ochiladi
    if (needAsk && i !== at) return      // savolsiz keyingi kadrga o'tilmaydi
    setAt(i)
    setNote(null)
    setSeen((prev) => (prev.indexOf(i) === -1 ? prev.concat(i) : prev))
    if (stepRef.current) stepRef.current('k' + (i + 1))
  }

  const pick = (opt) => {
    const src = cur.ask.items.find((x) => x.id === opt.id)
    if (src && src.right) {
      setAnswered((p) => ({ ...p, [cur.id]: opt.id }))
      setNote(null)
      sfx.playCorrect()
      return
    }
    setWrong((p) => (p.indexOf(opt.id) === -1 ? p.concat(opt.id) : p))
    setNote(src && src.hint ? src.hint : null)
    sfx.playWrong()
    if (audio && src && src.hint) audio.say(t(src.hint))
  }

  return (
    <>
      <div className="g8-frame g8-frame-fig">
        <Fig data={data} phase={cur ? cur.phase : 0} />
      </div>

      {/* Kadr matni: bitta qator, aynan shu qadam haqida. */}
      <Slot h={30}>
        <span className="g8-film-say">{cur ? t(cur.text) : ''}</span>
      </Slot>

      {/* LENTA. Ko'rilgan kadrda belgi, ochilmagani bosilmaydi. */}
      <div className={'g8-film' + (done ? ' is-done' : '')}>
        {frames.map((f, i) => (
          <button
            type="button"
            key={f.id}
            data-frame={f.id}
            className={'g8-film-k'
              + (i === at ? ' is-at' : '')
              + (seen.indexOf(i) !== -1 ? ' is-seen' : '')}
            disabled={i > seen.length || (needAsk && i !== at)}
            onClick={() => go(i)}
          >
            <span className="g8-film-n">{seen.indexOf(i) !== -1 && i !== at ? '✓' : i + 1}</span>
            <span className="g8-film-l">{t(f.label)}</span>
          </button>
        ))}
      </div>

      {/* Yo'l-yo'lakay SAVOL: javobsiz kadr yopilmaydi. */}
      <Slot mh={needAsk ? 70 : 0}>
        {needAsk ? (
          <div className="g8-in">
            <Ask>{t(cur.ask.question)}</Ask>
            <Choice
              items={cur.ask.items.map((i) => ({ id: i.id, label: t(i.label) }))}
              picked={null}
              wrong={wrong}
              onPick={pick}
              cols={2}
              disabled={!canAnswer}
              dense
            />
          </div>
        ) : null}
      </Slot>

      <Slot mh={note ? 44 : 0}>
        <Note kind="no">{note ? t(note) : null}</Note>
      </Slot>
    </>
  )
}

// ============================================================
// 14. TwoValues — XUKKA QAYTISH (2 va 3-sinf usuli). Qoida kartochkasi
//     ochilgandan keyin 1-ekrandagi ikki mashina QAYTADI: bittasi o'chadi,
//     ikkinchisi yashil bo'ladi. Xukning savoli 15-ekranda emas, AYNAN
//     qoida ekranida javob oladi.
// ============================================================
export function TwoValues({ left, right, winner = 'right', note }) {
  const t = useT()
  return (
    <div className="g8-twov">
      <span className={'g8-twov-c' + (winner === 'left' ? ' is-win' : ' is-off')}>{t(left)}</span>
      <span className={'g8-twov-c' + (winner === 'right' ? ' is-win' : ' is-off')}>{t(right)}</span>
      {note ? <span className="g8-twov-note">{t(note)}</span> : null}
    </div>
  )
}

// ============================================================
// 10. ValueTable — QIYMATLAR JADVALI: bitta yozuvning ikkinchi ko'rinishi.
//     Ekran 5 («ikkinchi ko'rinish») va keyinchalik 7, 34, 35-darslar uchun.
//
//     Teshik joyida CHIZIQCHA turadi, NOL emas: bu ikkisi 1-darsning asosiy
//     farqi. Chiziqcha `dash` bilan beriladi, ya'ni ma'lumotdan.
//     Balandligi qat'iy: ikki qator, 34 va 30 piksel.
// ============================================================
//     `cascade` — yacheykalar BIRMA-BIR to'ladi (120 ms qadam), chiziqcha
//     ESA OXIRIDA keladi va bir taktda ODZ rangi bilan miltillaydi. Shunda
//     «chiziqcha nol emas» degan fikr ko'rinadi, aytilmaydi.
export function ValueTable({ head, rows, mark, cascade }) {
  const t = useT()
  const holeAt = rows.findIndex((r) => r.v === null)
  const delay = (i) => (cascade ? { animationDelay: (i === holeAt ? rows.length * 0.12 + 0.2 : i * 0.12) + 's' } : undefined)
  return (
    <div className="g8-vt" role="table">
      <div className="g8-vt-row g8-vt-head" role="row">
        <span className="g8-vt-h">{t(head[0])}</span>
        {rows.map((r) => <span key={'x' + r.x} role="cell">{r.x}</span>)}
      </div>
      <div className="g8-vt-row" role="row">
        <span className="g8-vt-h">{t(head[1])}</span>
        {rows.map((r, i) => (
          <span
            key={'v' + r.x}
            role="cell"
            style={delay(i)}
            className={(cascade ? 'g8-vt-in ' : '')
              + (r.v === null ? 'g8-vt-hole' : (mark === r.x ? 'g8-t-accent' : ''))}
          >
            {r.v === null ? '—' : r.v}
          </span>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// Kichik yordamchi: kasrni ma'lumotdan yasash (§20 p.19 — SLASH bilan emas).
// ============================================================
export const F = (num, den, size) => <Frac num={num} den={den} size={size} />

export const TOOLS_STYLES = `
/* ============ BLITS (ekran 14): to'rt savol BITTA panelda ============ */
.g8-blitz { display: flex; flex-direction: column; gap: 5px; flex-shrink: 0; }
/* Javob berilgan savol: bitta ingichka satr. Ekrandan KETMAYDI. */
.g8-blitz-done {
  display: flex; align-items: center; gap: 8px; min-height: 28px;
  padding: 4px 12px; border-radius: 14px; background: ${T.okSoft};
  font-family: 'Manrope', sans-serif; font-size: clamp(11px, .95vw, 12.5px);
  animation: g8vtin .3s ease both;
}
.g8-blitz-done .g8-blitz-ask { color: ${T.ink2}; white-space: normal; overflow-wrap: anywhere; line-height: 1.22; }
.g8-blitz-ans { margin-left: auto; color: ${T.ok}; font-weight: 700; flex-shrink: 0; }
/* 859 dan pastda bitta ustun: yonma-yon ikki savol yozuvni uch satrga yoradi. */

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
/* ============ QIYMATLAR JADVALI (ekran 5) ============
   Ustunlar SONI ma'lumotdan keladi, shuning uchun grid auto-fit emas, flex:
   1366 da besh ustun ham, yettita ham bir xil sig'adi. */
.g8-vt { display: flex; flex-direction: column; gap: 4px; flex-shrink: 0; width: 100%; min-width: 0; }
.g8-vt-row {
  display: flex; align-items: center; gap: 4px;
  font-family: ${MATH_FONT}; font-variant-numeric: tabular-nums lining-nums;
  font-size: clamp(14px, 1.3vw, 18px);
}
.g8-vt-row > span {
  flex: 1 1 0; min-width: 0; text-align: center; height: 30px;
  display: flex; align-items: center; justify-content: center;
  background: ${T.paper}; border-radius: 8px; box-shadow: inset 0 0 0 1px ${T.line2};
}
.g8-vt-head > span { height: 34px; color: ${T.ink2}; }
.g8-vt-h {
  flex: 0 0 clamp(46px, 6vw, 74px) !important;
  font-family: 'JetBrains Mono', monospace; font-size: 11.5px;
  letter-spacing: .06em; color: ${T.ink3};
  background: transparent !important; box-shadow: none !important;
}
/* Teshik: chiziqcha, NOL emas. Rang ODZ qatlamining rangi. */
.g8-vt-hole { color: ${T.graph}; font-weight: 700; }
/* Yacheyka birma-bir keladi. Balandlik O'ZGARMAYDI: faqat shaffoflik. */
.g8-vt-in { animation: g8vtin .34s cubic-bezier(.22,.61,.36,1) both; }
@keyframes g8vtin { from { opacity: 0; } to { opacity: 1; } }
.g8-vt-in.g8-vt-hole { animation: g8vtin .34s cubic-bezier(.22,.61,.36,1) both, g8vthole 1s ease 1; }
@keyframes g8vthole { 0%,100% { box-shadow: inset 0 0 0 1px ${T.line2}; } 45% { box-shadow: inset 0 0 0 2px rgba(${T.graphRgb},.6); } }

/* ============ TapPart: QO'L YOZUVNING ICHIDA (asosiy asbob) ============ */
.g8-tap-wrap { position: relative; display: flex; justify-content: center; flex-shrink: 0; padding: 2px 0; }
.g8-tap {
  border: 0; background: transparent; font: inherit; color: inherit;
  cursor: pointer; border-radius: 8px; padding: 0 .3em;
  transition: background .2s, box-shadow .2s, color .2s;
}
.g8-tap:disabled { cursor: default; }
.g8-tap:hover:not(:disabled) { background: rgba(${T.accentRgb},.08); }
/* Tanlangan qism AJRALIB turadi: taqiq aynan shundan kelib chiqadi. */
.g8-tap.is-on { background: ${T.graphSoft}; box-shadow: inset 0 0 0 1.5px rgba(${T.graphRgb},.45); color: ${T.graph}; }
.g8-tap.is-tip { background: ${T.tipSoft}; color: ${T.tipInk}; }
/* Chiziq UZILADI: maxraj nolga aylanganda kasr ikkiga bo'linadi. */
.g8-frac-broke .g8-frac-bar {
  background: ${T.tip};
  animation: g8break .42s cubic-bezier(.22,.61,.36,1) both;
}
@keyframes g8break {
  from { clip-path: inset(0 0 0 0); }
  to { clip-path: polygon(0 0, 42% 0, 42% 100%, 0 100%, 0 0, 58% 0, 100% 0, 100% 100%, 58% 100%, 58% 0); }
}
.g8-frac-broke .g8-frac-d { color: ${T.tipInk}; }
/* Maxraj bir taktda urib qo'yadi: son qo'yilganda u O'ZGARMAGANINI ko'rsatadi.
   Bu songa bo'linadigan yozuvda asosiy fikr (5-ekran). */
.g8-tap-beat { animation: g8beat .42s cubic-bezier(.22,.61,.36,1) both; }
@keyframes g8beat {
  0% { box-shadow: inset 0 0 0 0 rgba(${T.accentRgb},0); }
  45% { box-shadow: inset 0 0 0 2px rgba(${T.accentRgb},.55); }
  100% { box-shadow: inset 0 0 0 1.5px rgba(${T.graphRgb},.45); }
}
/* Qo'l ko'rsatkichi: FAQAT demoda, o'quvchi harakatidan keyin qaytmaydi. */
.g8-tap-hand {
  position: absolute; left: 50%; bottom: -6px; font-size: 20px; line-height: 1;
  animation: g8hand 1.1s ease-in-out infinite;
}
@keyframes g8hand { 0%,100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, -5px); } }
/* Son kasrga UCHIB tushadi (3-sinf naqshi, elastik). */
.g8-tap-fly {
  position: absolute; left: calc(50% + 44px); top: 2px;
  font-family: ${MATH_FONT}; font-size: clamp(16px, 1.6vw, 22px); font-weight: 700; color: ${T.accent};
  animation: g8fly .8s cubic-bezier(.34,1.36,.5,1) both;
}
@keyframes g8fly {
  from { transform: translate(14px, -26px) scale(1.2); opacity: 0; }
  25% { opacity: 1; }
  75% { opacity: 1; }
  to { transform: translate(-6px, 30px) scale(.85); opacity: 0; }
}
.g8-tap-res {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  font-family: ${MATH_FONT}; font-size: clamp(14px, 1.3vw, 17px);
}
.g8-tap-at { color: ${T.ink2}; }
.g8-tap-arrow { color: ${T.ink4}; }
.g8-tap-dead { color: ${T.tipInk}; font-weight: 700; }
.g8-tap-live { color: ${T.ok}; font-weight: 700; }

/* ============ XUK: PLOTTER va JADVAL ============ */
.g8-machine { flex-direction: column; gap: 2px; align-items: stretch !important; }
.g8-machine-h {
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px;
  letter-spacing: .12em; text-transform: uppercase; color: ${T.ink3}; text-align: center;
  line-height: 1;
}
/* Balandligi QAT'IY. Avtomatik balandlikda chizma 92 px bo'lib, 615 px li
   noutbukda ekran 34 px chiqib ketardi (o'lchandi 2026-08-13). Nisbat
   6,5 ga 1 — shuning uchun past bo'lsa ham keng qoladi.
   DIQQAT: STYLES ichida BEKTIK ishlatilmaydi, u shablon satrni uzadi. */
.g8-plot { display: block; width: 100%; max-width: 460px; height: clamp(52px, 7vh, 64px); margin: 0 auto; overflow: visible; }
.g8-plot-ax { stroke: ${T.ink4}; stroke-width: 1; }
/* Chiziq CHIZILADI: plotter nuqtalarni birlashtiradi va teshikni ko'rsatmaydi. */
.g8-plot-line {
  fill: none; stroke: ${T.graph}; stroke-width: 2.2; stroke-linecap: round;
  stroke-dasharray: 300; animation: g8draw 1.1s ease .2s both;
}
@keyframes g8draw { from { stroke-dashoffset: 300; } to { stroke-dashoffset: 0; } }
.g8-plot-dot { fill: ${T.accent}; animation: g8vtin .3s ease 1.3s both; }
.g8-plot-lab {
  fill: ${T.accent}; font-family: ${MATH_FONT}; font-size: 11px; font-weight: 700;
  text-anchor: middle; animation: g8vtin .3s ease 1.4s both;
}
.g8-signrow { display: flex; justify-content: center; }

/* ============ RAMKA va KASKAD (1-5-sinf naqshi) ============
   3 va 5-sinfda har mazmun bloki RAMKADA turadi (.frame, .frame-tip) va
   kaskad bilan chiqadi (fade-up delay-1/2/3). 8-sinfda bu YO'Q edi: yozuv,
   natija va savol yalang'och maydonda yotardi, ko'z ushlaydigan narsa yo'q
   edi (metodist, 2026-08-14). */
.g8-frame {
  padding: clamp(8px, 1.4vh, 14px) clamp(10px, 1.4vw, 16px);
  border-radius: 16px;
  background: ${T.paper};
  box-shadow: 0 10px 26px -14px rgba(${T.shadow},.22), inset 0 0 0 1px ${T.line};
  flex-shrink: 0; min-width: 0; overflow: clip;
  animation: g8up .34s cubic-bezier(.22,.61,.36,1) both;
}
.g8-frame-fig { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.g8-frame-quiet { background: rgba(255,253,248,.6); box-shadow: inset 0 0 0 1px ${T.line}; }
@keyframes g8up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
/* Kaskad: o'qish tartibi HARAKAT bilan beriladi, shrift o'lchami bilan emas. */
.g8-cascade > * { animation: g8up .34s cubic-bezier(.22,.61,.36,1) both; }
.g8-cascade > *:nth-child(1) { animation-delay: .12s; }
.g8-cascade > *:nth-child(2) { animation-delay: .24s; }
.g8-cascade > *:nth-child(3) { animation-delay: .36s; }
.g8-cascade > *:nth-child(4) { animation-delay: .48s; }

/* ============ FIGURA: bitta obyekt, holatlari ============ */
.g8-fig { display: flex; flex-direction: column; align-items: center; gap: 2px; width: 100%; min-width: 0; }
.g8-fig-cap { font-family: ${MATH_FONT}; font-size: clamp(13px, 1.2vw, 16px); }
.g8-fig-pick { background: ${T.graphSoft}; border-radius: 8px; box-shadow: inset 0 0 0 1.5px rgba(${T.graphRgb},.45); }
.g8-fig-keys { display: flex; gap: 14px; justify-content: center; line-height: 1; }
.g8-fig-key { display: inline-flex; align-items: center; gap: 5px; font-family: ${MATH_FONT}; font-size: 12.5px; color: ${T.ink2}; }
.g8-fig-key::before { content: ''; width: 9px; height: 9px; border-radius: 50%; }
.g8-fig-key-a::before { background: ${T.accent}; }
.g8-fig-key-b::before { background: ${T.ok}; }

.g8-line { display: block; width: 100%; max-width: 460px; height: clamp(46px, 6.2vh, 62px); margin: 0 auto; overflow: visible; }
.g8-line-ax { stroke: ${T.ink3}; stroke-width: 1.4; }
.g8-line-tip { fill: ${T.ink3}; }
.g8-line-lab { fill: ${T.ink2}; font-family: ${MATH_FONT}; font-size: 11px; text-anchor: middle; }
/* Ikki qatorli figura balandroq: uchta qavat (chap yozuv, o'ng yozuv, o'q). */
.g8-line-tall { height: clamp(50px, 7.2vh, 74px); }
.g8-line-tk { animation: g8vtin .3s ease both; }
.g8-line-off { opacity: 0; }
/* TESHIK: bo'sh doira. «Taqiqlangan» so'zi emas, KO'RINADIGAN bo'shliq. */
.g8-line-hole {
  fill: ${T.bg}; stroke: ${T.accent}; stroke-width: 2.4;
  animation: g8hole .5s cubic-bezier(.34,1.36,.5,1) both;
}
@keyframes g8hole { from { r: 0; opacity: 0; } to { r: 6; opacity: 1; } }
.g8-pt-a { fill: ${T.accent}; animation: g8vtin .3s ease both; }
.g8-pt-b { fill: ${T.ok}; animation: g8vtin .3s ease both; }

/* ============ LENTA KADRLARI ============ */
.g8-film { display: flex; gap: 5px; flex-shrink: 0; min-width: 0; }
.g8-film-k {
  flex: 1 1 0; min-width: 0;
  display: flex; align-items: center; gap: 6px;
  min-height: 40px; padding: 5px 9px;
  border: 0; border-radius: 13px; cursor: pointer; text-align: left;
  background: rgba(255,253,248,.6); box-shadow: inset 0 0 0 1px ${T.line};
  font-family: 'Manrope', sans-serif; font-size: clamp(10.5px, .92vw, 12.5px);
  color: ${T.ink2}; transition: background .2s, box-shadow .2s, color .2s;
}
.g8-film-k:disabled { opacity: .4; cursor: default; }
.g8-film-k.is-seen { color: ${T.ink}; background: ${T.paper}; }
.g8-film-k.is-at {
  color: ${T.ink}; background: ${T.paper};
  box-shadow: 0 10px 24px -14px rgba(${T.shadow},.4), inset 0 0 0 1.5px rgba(${T.accentRgb},.5);
}
.g8-film-n {
  flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  background: ${T.graphSoft}; color: ${T.graph};
}
.g8-film-k.is-at .g8-film-n { background: ${T.accent}; color: #fff; }
.g8-film-k.is-seen:not(.is-at) .g8-film-n { background: ${T.okSoft}; color: ${T.ok}; }
.g8-film-l { min-width: 0; overflow-wrap: anywhere; line-height: 1.2; }
.g8-film-say {
  display: block; text-align: center;
  font-family: 'Manrope', sans-serif; font-size: clamp(12px, 1.05vw, 14px);
  color: ${T.ink}; line-height: 1.25;
}
@media (max-width: 639.98px) {
  .g8-film { flex-wrap: wrap; }
  .g8-film-k { flex: 1 1 46%; min-height: 36px; }
  .g8-frame { padding: 7px 9px; border-radius: 13px; }
}

/* ============ CHEGARA: yozuv va uning sohasi bitta blokda ============ */
.g8-bnd {
  display: flex; flex-direction: column; align-items: center; gap: 1px;
  padding: 3px 9px; border-radius: 13px; background: ${T.paper};
  box-shadow: inset 0 0 0 1px ${T.line}; min-width: 0;
}
.g8-bnd-probe { display: flex; justify-content: center; gap: clamp(6px, 1.4vw, 16px); }
.g8-bnd-cell {
  display: inline-flex; align-items: baseline; gap: 7px;
  font-family: ${MATH_FONT}; font-size: clamp(12.5px, 1.15vw, 15px);
  animation: g8vtin .34s ease both;
}
.g8-bnd-cell b { color: ${T.ink2}; font-weight: 600; }
.g8-bnd-cell i { font-style: normal; font-weight: 700; }
.g8-bnd-cell i:nth-of-type(1) { color: ${T.accent}; }
.g8-bnd-cell i:nth-of-type(2) { color: ${T.ok}; }

/* ============ RuleBuilder: qoidani o'quvchi yig'adi ============ */
.g8-rb-built {
  display: flex; flex-wrap: wrap; gap: 5px; align-items: center;
  min-height: 44px; padding: 6px 9px; border-radius: 13px;
  background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line};
}
.g8-rb-empty { font-family: 'Manrope', sans-serif; font-size: 11.5px; color: ${T.ink3}; }
.g8-rb-bag { display: flex; flex-wrap: wrap; gap: 5px; align-content: flex-start; }
.g8-rb-chip {
  display: inline-flex; align-items: center; gap: 5px;
  min-height: 34px; padding: 5px 11px; border: 0; border-radius: 999px;
  background: rgba(255,253,248,.75); box-shadow: inset 0 0 0 1px ${T.line};
  font-family: 'Manrope', sans-serif; font-size: clamp(11.5px, 1vw, 13px); font-weight: 600;
  color: ${T.ink}; cursor: pointer; text-align: left;
  transition: box-shadow .2s, background .2s;
}
.g8-rb-chip:hover { box-shadow: inset 0 0 0 1.5px rgba(${T.accentRgb},.4); }
.g8-rb-chip.is-built { background: ${T.graphSoft}; box-shadow: inset 0 0 0 1px rgba(${T.graphRgb},.3); }
.g8-rb-no { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${T.graph}; }

/* ============ XUKKA QAYTISH (qoida ekranida) ============ */
.g8-twov { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; justify-content: center; }
.g8-twov-c {
  padding: 4px 11px; border-radius: 999px;
  font-family: ${MATH_FONT}; font-size: clamp(13px, 1.2vw, 16px); font-weight: 700;
  transition: opacity .3s, background .3s;
}
.g8-twov-c.is-win { background: ${T.okSoft}; color: ${T.ok}; box-shadow: inset 0 0 0 1px rgba(${T.okRgb},.3); }
.g8-twov-c.is-off { opacity: .32; }
.g8-twov-note {
  font-family: 'Manrope', sans-serif; font-size: 11.5px; color: ${T.ink2};
  flex: 1 1 100%; text-align: center;
}

/* Ikki yozuv orasidagi doiradagi belgi (xuk, §14). Balandligi QAT'IY:
   yozuvlar orasiga qo'shilganda ekran o'smasligi kerak. */
.g8-subsign { display: flex; align-items: center; justify-content: center; height: 22px; flex-shrink: 0; }
.g8-subsign > span {
  display: inline-flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border-radius: 50%;
  background: ${T.paper}; color: ${T.graph};
  box-shadow: inset 0 0 0 1.5px rgba(${T.graphRgb},.42);
  font-family: ${MATH_FONT}; font-size: 15px; line-height: 1;
}
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
/* VERTIKAL (metodist, 2026-08-13): ikki yozuv ham, ikki mashina ham
   BIRI IKKINCHISINING OSTIDA turadi, yonma-yon emas. */
.g8-pair { display: flex; flex-direction: column; gap: clamp(5px, 1vh, 10px); flex-shrink: 0; min-width: 0; }
.g8-pair > * { min-width: 0; }
.g8-pair-c { min-width: 0; display: flex; align-items: center; justify-content: center; }
/* Vertikal joylashuvda mashina BUTUN kenglikni oladi: markazga siqilgan
   grafik o'qilmaydi (o'lchandi 2026-08-13 skrinshotda). */
.g8-machine { width: 100%; }
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

/* СЧЁТ БЛИЦА по первой попытке (методист, 2026-08-17). */
.g8-blitz-score { display: flex; align-items: center; gap: 12px; justify-content: center;
  padding: 12px 20px; border-radius: 16px; background: ${T.paper};
  box-shadow: inset 0 0 0 1px rgba(23,26,29,.10); margin-top: 4px; }
.g8-blitz-score b { font-size: 30px; color: ${T.accent}; }
.g8-blitz-score span { font-size: 18px; color: ${T.ink2}; }
.g8-blitz-dot { width: 10px; height: 10px; border-radius: 50%; flex: none;
  box-shadow: inset 0 0 0 2px rgba(23,26,29,.20); }
.g8-blitz-dot.is-first { background: ${T.ok}; box-shadow: none; }

@media (max-width: 760px), (max-height: 720px) {
  .g8-blitz-score { padding: 8px 14px; }
  .g8-blitz-score b { font-size: 24px; }
  .g8-blitz-score span { font-size: 15px; }
}
`
