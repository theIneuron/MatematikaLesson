// ============================================================================
// 8-SINF AMALIYOTINING UMUMIY QATLAMI — TIPLAR BIR JOYDA.
// Kontrakt: src/books/grade8/TIPLAR_AMALIYOT_8SINF.md
//
// NEGA. Sinfda 55 dars, har darsda 10 topshiriq — 550 fayl. Agar har fayl
// o'z ichida maydon, hukm, razbor bloki va tekshirishni takrorlasa, bitta
// nuqsonni 550 joyda tuzatish kerak bo'ladi (CLAUDE.md §5).
//
// NIMA QOLADI TOPSHIRIQDA. Faqat MA'LUMOT: yozuv, kartalar, to'g'ri javob,
// har xato yo'lga razbor, uch til. Ya'ni metodik ish.
//
// MUHIM QOIDA (7-sinfda qimmatga tushgan xato): MATEMATIKA til blokining
// ICHIDA turmaydi. `answer`, `accepts`, `cards`, `items`, `excluded` — til
// bloklaridan TASHQARIDA, `L()` esa faqat SO'ZLAR uchun. Uch nusxa birinchi
// tahrirda ajralib ketadi va rus tilidagi topshiriq yechilmas bo'lib qoladi.
//
// HECH NARSA KO'CHIRILMAGAN. Maydon, klaviatura va javobni baholash —
// `math.jsx` (judgeExpr / judgeOdz / MathField), kontrprimer va yozuv
// renderi — `core.jsx` (Counterexample / Frac / Row), sonlar to'plami —
// `tools.jsx` (parseNumberSet), ODZ ning nollari — `mathcore.js`
// (domainHoles). Dars nimani ishlatsa, amaliyot ham SHUNI ishlatadi.
//
// XATTI-HARAKAT (metodist qarori 2026-08-21):
//   1. javob BIR marta tekshiriladi, keyin topshiriq YOPILADI;
//   2. razbor tekshirishdan KEYIN DARROV chiqadi, «maslahat» tugmasi yo'q.
// Tugma bu yerda emas, `PracticeHost.jsx` da: har tip `registerCheck` orqali
// o'z tekshiruvini hostga beradi.
//
// TIPLAR (o'ntadan yettitasi, TIPLAR_AMALIYOT_8SINF.md §5):
//   Input     — javobni yozadi: ifoda, son yoki ODZ
//   Odz       — IKKI maydon: natija VA shart, razbor alohida
//   Slots     — tayyor yechimdagi tirqishlarni kartalardan to'ldiradi
//   Build     — berilgan XOSSAGA ega yozuvni kartalardan yig'adi
//   Boundary  — ikki yozuv QAYERDA ajralishini yozadi
//   Sort      — yozuvlarni zonalarga taqsimlaydi
//   AuditRows — BIRINCHI noto'g'ri satrni topadi va kontrprimer yozadi
// Qolgan uchtasi o'zi kerak bo'lgan darsda yoziladi: `steps` (2-6 darslar),
// `line` (25-29), `figure` (37-55). Ishlatilmagan mexanika — tekshirilmagan
// mexanika, shuning uchun oldindan yozilmaydi.
// ============================================================================
/* eslint-disable react-refresh/only-export-components -- tiplar ham, uslublar
   ham shu faylda turadi: ular bir kontrakt va bo'linsa ajralib ketadi. */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Counterexample, Frac, L, MATH_FONT, Note, Row, T, tr, useSfx, useT,
} from '../core.jsx'
import { MathField, judgeExpr, judgeOdz, useIsPhone } from '../math.jsx'
import { parseNumberSet } from '../tools.jsx'
import { domainHoles, evaluate, parse } from '../mathcore.js'

export { L, tr, Frac, Row }

// Kasr — ma'lumot faylida qisqa yozilishi uchun.
export const F = (num, den) => <Frac num={num} den={den} size="big" />

// Yozuv qatori: markazda, dars bilan bir xil o'lchamda.
export const E = ({ children }) => (
  <div className="pq-expr"><Row size="big" align="center">{children}</Row></div>
)

const TXT = {
  none: L("Taqiqlangan qiymat yo'q", 'Нет запрещённого значения', 'No forbidden value'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  yours: L('sizda', 'у тебя', 'yours'),
  source: L("boshlang'ich", 'исходная', 'original'),
  empty: L('Javob yozilmagan.', 'Ответ не записан.', 'No answer written.'),
  noneWrong: L(
    "Taqiq bor: maxrajni nolga aylantiradigan qiymat topiladi.",
    'Запрет есть: значение, обращающее знаменатель в нуль, найдётся.',
    'There is a restriction: a value making the denominator zero does exist.',
  ),
  proofOk: L(
    'Shu qiymatda maxraj nolga aylanadi, ya\'ni satr shu joyda buziladi.',
    'При этом значении знаменатель обращается в нуль — значит строка ломается здесь.',
    'At this value the denominator becomes zero, so the line breaks here.',
  ),
  proofNo: L(
    'Bu qiymatda yozuv hisoblanadi. Maxrajni nolga aylantiradigan sonni oling.',
    'При этом значении запись считается. Возьми число, обращающее знаменатель в нуль.',
    'At this value the record still computes. Take a number that makes the denominator zero.',
  ),
  pickRow: L('Satrni bosing.', 'Нажми строку.', 'Tap a line.'),
  proofAlready: L(
    "Bu qiymatni yechimning o'zi taqiqlagan, ya'ni u dalil emas. Yechim RUXSAT BERGAN, lekin kasr hisoblanmaydigan sonni oling.",
    'Это значение решение и так запретило, значит оно не улика. Возьми число, которое решение РАЗРЕШИЛО, а дробь при нём не считается.',
    'The solution already excluded this value, so it proves nothing. Take a number the solution ALLOWED where the fraction still fails.',
  ),
  proofAsk: L('son', 'число', 'number'),
}

// ============================================================ UMUMIY HOLAT
// Har tipda bir xil: javob BIR marta tekshiriladi, keyin qulflanadi.
function useOnce({ onReady, ready }) {
  const [fb, setFb] = useState(null)
  const [checked, setChecked] = useState(false)
  useEffect(() => { onReady?.(ready && !checked) }, [ready, checked, onReady])
  return { fb, setFb, checked, setChecked, locked: checked }
}

// `registerCheck` HOSTGA funksiya beradi. Funksiya har renderda yangilanadi,
// lekin hostga bir marta uzatiladi — shuning uchun ref orqali.
function useRegister(check, registerCheck) {
  const ref = useRef(check)
  // Renderda ref ga yozilmaydi (react-hooks/refs): har renderdan KEYIN
  // yangilanadi. Host tugmani bosganda effektlar allaqachon o'tgan.
  useEffect(() => { ref.current = check })
  useEffect(() => { registerCheck?.(() => ref.current()) }, [registerCheck])
}

// Razborni TANLASH. `wrongs` — tartib bilan tekshiriladigan shartlar:
// birinchi mos kelgani chiqadi. Har xato YO'LGA o'z razbori bo'lishi kerak.
const pickWhy = (data, state) => {
  for (const w of data.wrongs || []) {
    try { if (w.when(state)) return w.text } catch { /* shart bajarilmadi */ }
  }
  return data.wrongText || null
}

// Topshiriq sarlavhasi: hamma tipda bir xil tartib.
const Head = ({ data }) => {
  const t = useT()
  return (
    <>
      <div className="pq-eyebrow">{t(data.eyebrow)}</div>
      {data.setup ? <p className="pq-setup">{t(data.setup)}</p> : null}
    </>
  )
}

const Ask = ({ children }) => (children ? <p className="pq-ask">{children}</p> : null)

// Hukm. To'g'ri bo'lsa — tasdiq matni (unda SON bilan tekshirish bor).
// Xato bo'lsa — kontrprimer yoki razbor. «Xato» so'zi yozilmaydi (§2.1).
const Fb = ({ fb }) => {
  const t = useT()
  if (!fb) return null
  if (fb.correct) return <Note kind="ok">{t(fb.text)}</Note>
  if (fb.cx) {
    return (
      <Counterexample {...{ at: fb.cx.at, note: fb.cx.note, mine: fb.cx.mine, ref: fb.cx.src,
        labelMine: TXT.yours, labelRef: TXT.source }} />
    )
  }
  return <Note kind="no">{fb.text ? t(fb.text) : null}</Note>
}

// Javobni topshirish: hostga bir xil shaklda ketadi.
// `fb` ham ketadi: javob berilgan topshiriqqa qaytilganda qobiq AYNAN SHU
// razborni ko'rsatadi, umumiy gapni emas.
const payload = (data, extra) => ({
  tag: data.tag,
  level: data.level,
  studentAnswer: extra.studentAnswer,
  correctAnswer: extra.correctAnswer,
  correct: extra.correct,
  feedback: extra.fb ? (extra.fb.text || (extra.fb.cx && extra.fb.cx.note) || null) : null,
})

// judgeExpr / judgeOdz natijasini hukm shakliga o'girish.
const toFb = (res, data, state) => {
  if (res.why === 'value' || res.why === 'domain') {
    return {
      correct: false,
      cx: {
        at: res.at,
        note: res.note || pickWhy(data, state),
        mine: res.why === 'value' ? res.mine : undefined,
        // `src` — «boshlang'ich yozuvning qiymati». Nomi ataylab `ref` emas:
        // JSX da `ref` maxsus nom va linter butun obyektni ref deb oladi.
        src: res.why === 'value' ? res.ref : undefined,
      },
    }
  }
  if (res.why === 'empty') return { correct: false, text: TXT.empty }
  return { correct: false, text: res.note || pickWhy(data, state) }
}

// «Taqiqlangan qiymat yo'q» — TUGMA, matn emas. HAMMA ODZ topshirig'ida
// turadi: faqat javobi «yo'q» bo'lganda paydo bo'lsa, o'quvchi uni PAYDO
// BO'LGANI uchun bosadi (dars kanoni §10.1).
const NoneBtn = ({ on, label, disabled, onClick }) => {
  const t = useT()
  return (
    <button
      type="button"
      className={'pq-none' + (on ? ' is-on' : '')}
      aria-pressed={on}
      disabled={disabled}
      onClick={onClick}
    >
      {t(label || TXT.none)}
    </button>
  )
}

// ============================================================ 1. INPUT
// Javobni O'ZI yozadi. kind: 'expr' | 'number' | 'odz'.
//   expr/number — judgeExpr, `data.answer` bo'yicha (satr emas, QIYMAT)
//   odz         — judgeOdz, `data.excluded` bo'yicha (to'plam solishtiriladi)
// `data.hints` — aynan shu noto'g'ri yozuv uchun yozilgan razbor.
// ============================================================
export function Input({ data, onReady, registerCheck, onSubmit }) {
  const t = useT()
  const sfx = useSfx()
  const [val, setVal] = useState('')
  const [none, setNone] = useState(false)
  const kind = data.kind || 'expr'
  const A = useOnce({ onReady, ready: none || !!String(val).trim() })

  const check = useCallback(() => {
    let correct
    let fb
    if (none) {
      correct = !!data.noneRight
      fb = correct
        ? { correct: true, text: data.correctText }
        : { correct: false, text: data.noneWrong || TXT.noneWrong }
    } else {
      const res = kind === 'odz'
        ? judgeOdz(val, { excluded: data.excluded, varName: data.varName, hints: data.hints })
        : judgeExpr(val, { answer: data.answer, hints: data.hints })
      correct = !!res.ok
      fb = correct ? { correct: true, text: data.correctText } : toFb(res, data, { value: val })
    }
    A.setFb(fb)
    A.setChecked(true)
    correct ? sfx.playCorrect() : sfx.playWrong()
    onSubmit?.(payload(data, {
      fb,
      studentAnswer: none ? 'none' : val,
      correctAnswer: kind === 'odz' ? data.excluded : data.answer,
      correct,
    }))
  }, [val, none, kind, data, A, sfx, onSubmit])
  useRegister(check, registerCheck)

  return (
    <div className="pq-wrap">
      <Head data={data} />
      {data.expr ? data.expr : null}
      <Ask>{t(data.ask)}</Ask>
      <MathField
        kind={kind}
        label={data.label}
        value={val}
        onChange={(x) => { setVal(x); setNone(false) }}
        done={A.locked}
        width={kind === 'number' ? 96 : undefined}
      />
      {data.none ? (
        <NoneBtn
          on={none}
          label={data.noneLabel}
          disabled={A.locked}
          onClick={() => { setNone(true); setVal('') }}
        />
      ) : null}
      <Fb fb={A.fb} />
    </div>
  )
}

// ============================================================ 2. ODZ
// IKKI maydon: natija VA shart. Ular ALOHIDA baholanadi va razbor ham
// alohida: «kasr to'g'ri, shart yo'qolgan» va «shart to'g'ri, kasr xato» —
// bu ikki BOSHQA xato (TIPLAR §5.2).
// data.fields: [{ kind, ask, label, answer|excluded, hints, none }]
//
// TELEFONDA BITTA MAYDON. Sabab o'lchov: `MathField` telefonda o'z ekran
// klaviaturasini chiqaradi, ikki maydon esa IKKI klaviatura degani va kontent
// ish maydonidan 23-52px chiqib ketardi (o'lchandi 390 va 360 px da). Shuning
// uchun telefonda faol maydon bitta, ikkinchisi bosiladigan satr bo'lib
// yig'iladi. Tekshirish esa o'sha-o'sha: BIR marta, ikki javob birga.
// ============================================================
export function Odz({ data, onReady, registerCheck, onSubmit }) {
  const t = useT()
  const sfx = useSfx()
  const phone = useIsPhone()
  const [edit, setEdit] = useState(0)
  const [vals, setVals] = useState(() => data.fields.map(() => ''))
  const [none, setNone] = useState(() => data.fields.map(() => false))
  const filled = data.fields.every((f, i) => none[i] || !!String(vals[i]).trim())
  const A = useOnce({ onReady, ready: filled })
  const [each, setEach] = useState(null)

  const set = (i, v) => setVals((prev) => prev.map((x, j) => (j === i ? v : x)))
  const setNoneAt = (i) => setNone((prev) => prev.map((x, j) => (j === i ? true : x)))

  const check = useCallback(() => {
    const res = data.fields.map((f, i) => {
      if (none[i]) {
        return f.noneRight
          ? { ok: true }
          : { ok: false, why: 'none', note: f.noneWrong || TXT.noneWrong }
      }
      return (f.kind || 'expr') === 'odz'
        ? judgeOdz(vals[i], { excluded: f.excluded, varName: data.varName, hints: f.hints })
        : judgeExpr(vals[i], { answer: f.answer, hints: f.hints })
    })
    const correct = res.every((r) => r.ok)
    const fb = correct
      ? { correct: true, text: data.correctText }
      : { correct: false, text: pickWhy(data, { res, vals }) }
    setEach(res)
    A.setFb(fb)
    A.setChecked(true)
    correct ? sfx.playCorrect() : sfx.playWrong()
    onSubmit?.(payload(data, {
      fb,
      studentAnswer: vals.slice(),
      correctAnswer: data.fields.map((f) => (f.kind === 'odz' ? f.excluded : f.answer)),
      correct,
    }))
  }, [vals, none, data, A, sfx, onSubmit])
  useRegister(check, registerCheck)

  return (
    <div className="pq-wrap">
      <Head data={data} />
      {data.expr ? data.expr : null}
      <div className="pq-two">
        {data.fields.map((f, i) => {
          const r = each ? each[i] : null
          // Telefonda yopilgan maydon: bosilsa ochiladi.
          if (phone && !A.checked && edit !== i) {
            const said = none[i] ? t(TXT.none) : String(vals[i] || '')
            return (
              <button type="button" key={i} className={'pq-fold' + (said ? ' is-full' : '')}
                data-fold={i} onClick={() => setEdit(i)}>
                <span className="pq-fold-ask">{t(f.ask)}</span>
                <span className="pq-fold-v">{said || '—'}</span>
              </button>
            )
          }
          return (
            <div className="pq-two-col" key={i}>
              <Ask>{t(f.ask)}</Ask>
              <MathField
                kind={f.kind || 'expr'}
                label={f.label}
                value={vals[i]}
                onChange={(x) => set(i, x)}
                done={A.locked}
                width={f.kind === 'number' ? 96 : undefined}
              />
              {f.none ? (
                <NoneBtn
                  on={none[i]}
                  label={f.noneLabel}
                  disabled={A.locked}
                  onClick={() => { setNoneAt(i); set(i, '') }}
                />
              ) : null}
              {r ? (
                <div className={'pq-mark ' + (r.ok ? 'is-ok' : 'is-no')}>
                  {r.ok ? t(f.okText || data.fieldOk) : t(r.note || f.wrongText)}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
      <Fb fb={A.fb} />
    </div>
  )
}

// ============================================================ 3. SLOTS
// Tayyor yechimdagi tirqishlarni kartalardan to'ldirish.
// rows: [[{ t }, { slot: i }]], cards: [...], answer: [...]
// Bankda ORTIQCHA kartalar SHART: aks holda topshiriq saralashga aylanadi.
// ============================================================
export function Slots({ data, onReady, registerCheck, onSubmit }) {
  const t = useT()
  const sfx = useSfx()
  const [slots, setSlots] = useState(() => data.answer.map(() => null))
  const [picked, setPicked] = useState(null)
  const A = useOnce({ onReady, ready: slots.every((s) => s !== null) })

  const used = slots.filter((s) => s !== null)
  const tapCard = (c) => { if (!A.locked) setPicked(picked === c ? null : c) }
  const tapSlot = (i) => {
    if (A.locked) return
    if (picked === null) { setSlots((p) => p.map((x, j) => (j === i ? null : x))); return }
    setSlots((p) => p.map((x, j) => (j === i ? picked : x)))
    setPicked(null)
  }

  const check = useCallback(() => {
    const bad = data.answer.map((a, i) => (slots[i] === a ? null : i)).filter((i) => i !== null)
    const correct = bad.length === 0
    const fb = correct
      ? { correct: true, text: data.correctText }
      : { correct: false, text: pickWhy(data, { slots, bad }) }
    A.setFb(fb)
    A.setChecked(true)
    correct ? sfx.playCorrect() : sfx.playWrong()
    onSubmit?.(payload(data, { fb, studentAnswer: slots.slice(), correctAnswer: data.answer, correct }))
  }, [slots, data, A, sfx, onSubmit])
  useRegister(check, registerCheck)

  return (
    <div className="pq-wrap">
      <Head data={data} />
      {data.expr ? data.expr : null}
      <div className="pq-rows">
        {data.rows.map((row, ri) => (
          <div className="pq-row" key={ri}>
            {row.map((cell, ci) => {
              if (cell.t !== undefined) return <span className="pq-tok" key={ci}>{cell.t}</span>
              const i = cell.slot
              const v = slots[i]
              let state = ''
              if (A.checked) state = v === data.answer[i] ? ' is-ok' : ' is-no'
              return (
                <button
                  type="button"
                  key={ci}
                  data-slot={i}
                  className={'pq-slot' + (v ? ' is-full' : '') + state}
                  disabled={A.locked}
                  onClick={() => tapSlot(i)}
                >
                  {v || ''}
                </button>
              )
            })}
          </div>
        ))}
      </div>
      <div className="pq-bank">
        <div className="pq-bank-lbl">{t(data.bank || TXT.bank)}</div>
        <div className="pq-cards">
          {data.cards.map((c) => (
            <button
              type="button"
              key={c}
              data-card={c}
              className={'pq-card' + (picked === c ? ' is-on' : '') + (used.indexOf(c) !== -1 ? ' is-used' : '')}
              disabled={A.locked}
              onClick={() => tapCard(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <Fb fb={A.fb} />
    </div>
  )
}

// ============================================================ 4. BUILD
// TESKARI topshiriq: berilgan XOSSAGA ega yozuvni kartalardan yig'ish.
// To'g'ri javob KO'P, shuning uchun satr solishtirilmaydi — IKKI xossa
// tekshiriladi: (1) maxrajning nollari aynan `want.holes`, (2) yozuv kasr
// (maxrajda harf bor).
//
// `wrap` — '5 / (%s)' ko'rinishidagi andoza: o'quvchi butun yozuvni emas,
// faqat MAXRAJNI yig'adi. Nega kerak: kartalardan butun kasr yig'ilganda
// topshiriq qavslarning KUCHI haqida bo'lib qoladi ('5 / x * (x - 6)' —
// bu boshqa yozuv), ODZ esa ikkinchi darajaga tushadi.
// ============================================================
const sameSet = (a, b) => {
  if (a.length !== b.length) return false
  const x = a.slice().sort((m, n) => m - n)
  const y = b.slice().sort((m, n) => m - n)
  return x.every((v, i) => Math.abs(v - y[i]) < 1e-9)
}

export function Build({ data, onReady, registerCheck, onSubmit }) {
  const t = useT()
  const sfx = useSfx()
  const [seq, setSeq] = useState([])
  const A = useOnce({ onReady, ready: seq.length > 0 })
  const built = seq.join(' ')

  const check = useCallback(() => {
    const full = data.wrap ? data.wrap.replace('%s', built) : built
    const P = parse(full)
    let correct = false
    let why = null
    let holes
    if (P.error) {
      why = data.parseWrong || TXT.empty
    } else {
      const H = domainHoles(full, data.varName)
      holes = H.holes || []
      const isFrac = full.indexOf('/') !== -1
      correct = isFrac && sameSet(holes, data.want.holes)
      if (!correct) why = pickWhy(data, { holes, isFrac, built, full })
    }
    const fb = correct ? { correct: true, text: data.correctText } : { correct: false, text: why }
    A.setFb(fb)
    A.setChecked(true)
    correct ? sfx.playCorrect() : sfx.playWrong()
    onSubmit?.(payload(data, { fb, studentAnswer: built, correctAnswer: data.want.holes, correct }))
  }, [built, data, A, sfx, onSubmit])
  useRegister(check, registerCheck)

  return (
    <div className="pq-wrap">
      <Head data={data} />
      <div className="pq-line">
        <span className="pq-line-body">
          {data.frame
            ? data.frame(built ? <span className="pq-line-den">{built}</span> : <i className="pq-line-ph">{t(data.placeholder)}</i>)
            : (built || <i className="pq-line-ph">{t(data.placeholder)}</i>)}
        </span>
        <button
          type="button"
          className="pq-back"
          disabled={A.locked || !seq.length}
          onClick={() => setSeq((s) => s.slice(0, -1))}
        >
          ⌫
        </button>
      </div>
      <Ask>{t(data.ask)}</Ask>
      <div className="pq-cards">
        {data.cards.map((c, i) => (
          <button
            type="button"
            key={c + i}
            data-card={c}
            className="pq-card"
            disabled={A.locked}
            onClick={() => setSeq((s) => s.concat(c))}
          >
            {c}
          </button>
        ))}
      </div>
      <Fb fb={A.fb} />
    </div>
  )
}

// ============================================================ 5. BOUNDARY
// «Yozuvlar QAYERDA ajraladi». Javob — qiymatlar TO'PLAMI, variant emas:
// har qanday variant javobni aytib qo'yadi.
// ============================================================
export function Boundary({ data, onReady, registerCheck, onSubmit }) {
  const t = useT()
  const sfx = useSfx()
  const [val, setVal] = useState('')
  const A = useOnce({ onReady, ready: !!String(val).trim() })

  const check = useCallback(() => {
    const mine = parseNumberSet(val)
    const correct = !!mine && sameSet(mine, data.answer)
    const fb = correct
      ? { correct: true, text: data.correctText }
      : { correct: false, text: (data.hints && data.hints[String(val).trim()]) || pickWhy(data, { mine, val }) }
    A.setFb(fb)
    A.setChecked(true)
    correct ? sfx.playCorrect() : sfx.playWrong()
    onSubmit?.(payload(data, { fb, studentAnswer: val, correctAnswer: data.answer, correct }))
  }, [val, data, A, sfx, onSubmit])
  useRegister(check, registerCheck)

  return (
    <div className="pq-wrap">
      <Head data={data} />
      <div className="pq-vs">
        <div className="pq-vs-side">{data.left}</div>
        <span className="pq-vs-sign">=</span>
        <div className="pq-vs-side">{data.right}</div>
      </div>
      <Ask>{t(data.ask)}</Ask>
      <MathField kind="number" label={data.label} value={val} onChange={setVal} done={A.locked} width={96} />
      <Fb fb={A.fb} />
    </div>
  )
}

// ============================================================ 6. SORT
// Yozuvlarni zonalarga taqsimlash. BOSISH bilan, tortish bilan emas:
// telefonda barmoq zonadan chetga tushadi.
// ============================================================
export function Sort({ data, onReady, registerCheck, onSubmit }) {
  const t = useT()
  const sfx = useSfx()
  const [place, setPlace] = useState({})
  const [picked, setPicked] = useState(null)
  const pool = data.items.filter((it) => !place[it.id])
  const A = useOnce({ onReady, ready: pool.length === 0 })

  const tapItem = (id, e) => {
    if (e) e.stopPropagation()
    if (A.locked) return
    // Zonada yotgan yozuvni bosish: agar QO'LDA yozuv bo'lsa, u SHU zonaga
    // tushadi. Bunday bo'lmasa to'lgan zonaga ikkinchi yozuvni qo'yish
    // imkonsiz bo'ladi: barmoq yotgan kartaga tegadi va uni olib qo'yadi
    // (topildi stendda, 2-topshiriq).
    if (place[id] && picked) {
      const z = place[id]
      setPlace((p) => ({ ...p, [picked]: z }))
      setPicked(null)
      return
    }
    if (place[id]) { setPlace((p) => { const n = { ...p }; delete n[id]; return n }); setPicked(null); return }
    setPicked(picked === id ? null : id)
  }
  const tapZone = (z) => {
    if (A.locked || !picked) return
    setPlace((p) => ({ ...p, [picked]: z }))
    setPicked(null)
  }

  const check = useCallback(() => {
    const bad = data.items.filter((it) => place[it.id] !== it.zone).map((it) => it.id)
    const correct = bad.length === 0
    const fb = correct
      ? { correct: true, text: data.correctText }
      : { correct: false, text: pickWhy(data, { place, bad }) }
    A.setFb(fb)
    A.setChecked(true)
    correct ? sfx.playCorrect() : sfx.playWrong()
    onSubmit?.(payload(data, {
      fb,
      studentAnswer: { ...place },
      correctAnswer: data.items.reduce((a, it) => ({ ...a, [it.id]: it.zone }), {}),
      correct,
    }))
  }, [place, data, A, sfx, onSubmit])
  useRegister(check, registerCheck)

  const chip = (it) => {
    let state = ''
    if (picked === it.id) state = ' is-on'
    if (A.checked) state = place[it.id] === it.zone ? ' is-ok' : ' is-no'
    return (
      <button
        type="button"
        key={it.id}
        data-item={it.id}
        className={'pq-chip' + state}
        disabled={A.locked}
        onClick={(e) => tapItem(it.id, e)}
      >
        {it.show}
      </button>
    )
  }

  return (
    <div className="pq-wrap">
      <Head data={data} />
      <div className="pq-zones">
        {data.zones.map((z) => (
          <div className="pq-zone" key={z.id}>
            <div className="pq-zone-lbl">{t(z.label)}</div>
            <div
              data-zone={z.id}
              className={'pq-zone-box' + (picked ? ' is-live' : '')}
              onClick={() => tapZone(z.id)}
            >
              {data.items.filter((it) => place[it.id] === z.id).map(chip)}
            </div>
          </div>
        ))}
      </div>
      <div className="pq-bank">
        <div className="pq-bank-lbl">{t(data.ask)}</div>
        <div className="pq-cards">{pool.length ? pool.map(chip) : <span className="pq-dash">—</span>}</div>
      </div>
      <Fb fb={A.fb} />
    </div>
  )
}

// ============================================================ 7. AUDITROWS
// BIRINCHI noto'g'ri satr VA kontrprimer. Ikkisi birga tekshiriladi: satrni
// topib, sonni yozmagan javob SANALMAYDI — aks holda bu beshtadan bittasini
// tanlash bo'lib qoladi (TIPLAR §5.6).
// proof: { of, varName, label, but } — `of` shu sonda QIYMATSIZ bo'lishi
// kerak VA son `but` ro'yxatida turmasligi kerak. `but` — yechimning O'ZI
// taqiqlagan qiymatlar: ular kontrprimer bo'la olmaydi, chunki yechim ularni
// allaqachon chiqarib tashlagan. Bu shart bo'lmasa 7/(x*x - 5x) topshirig'ida
// «5» ham o'tib ketardi — maxraj unda ham nolga aylanadi.
// ============================================================
export function AuditRows({ data, onReady, registerCheck, onSubmit }) {
  const t = useT()
  const sfx = useSfx()
  const [row, setRow] = useState(null)
  const [num, setNum] = useState('')
  const A = useOnce({ onReady, ready: row !== null && !!String(num).trim() })

  const check = useCallback(() => {
    const rowOk = row === data.answerId
    const n = Number(String(num).replace(',', '.'))
    const but = data.proof.but || []
    const already = but.some((v) => Math.abs(v - n) < 1e-9)
    let proofOk = false
    if (Number.isFinite(n) && !already) {
      const P = parse(data.proof.of)
      if (!P.error) {
        const env = {}
        env[data.proof.varName || 'x'] = n
        proofOk = evaluate(P.node, env) === null
      }
    }
    const correct = rowOk && proofOk
    let text = data.correctText
    if (!rowOk) text = (data.hints && data.hints[row]) || pickWhy(data, { row, n })
    else if (already) text = data.proofAlready || TXT.proofAlready
    else if (!proofOk) text = data.proofWrong || TXT.proofNo
    const fb = { correct, text }
    A.setFb(fb)
    A.setChecked(true)
    correct ? sfx.playCorrect() : sfx.playWrong()
    onSubmit?.(payload(data, {
      fb,
      studentAnswer: { row, num },
      correctAnswer: { row: data.answerId },
      correct,
    }))
  }, [row, num, data, A, sfx, onSubmit])
  useRegister(check, registerCheck)

  return (
    <div className="pq-wrap">
      <Head data={data} />
      {data.expr ? data.expr : null}
      <div className="pq-audit">
        {data.rows.map((r, i) => {
          let state = ''
          if (row === r.id) state = ' is-on'
          if (A.checked && r.id === data.answerId) state = ' is-hit'
          else if (A.checked && row === r.id) state = ' is-off'
          return (
            <button
              type="button"
              key={r.id}
              data-row={r.id}
              className={'pq-audit-row' + state}
              disabled={A.locked}
              onClick={() => setRow(r.id)}
            >
              <span className="pq-audit-n">{i + 1}</span>
              <span className="pq-audit-b">{React.isValidElement(r.show) ? r.show : t(r.show)}</span>
            </button>
          )
        })}
      </div>
      <div className="pq-proof">
        <Ask>{t(data.ask || TXT.pickRow)}</Ask>
        <MathField
          kind="number"
          label={data.proof.label}
          value={num}
          onChange={setNum}
          done={A.locked}
          width={96}
        />
      </div>
      <Fb fb={A.fb} />
    </div>
  )
}

// ============================================================ USLUBLAR
// Sinf tili: iliq qog'oz, ichki halqa, soya. Ramka chizig'i yo'q.
// DIQQAT: bu satr ichida BACKTICK yozilmaydi — shablon satr uziladi.
export const PRACTICE_STYLES = `
.pq-root {
  position: fixed; inset: 0; overflow: clip; overscroll-behavior: none;
  display: flex; flex-direction: column; isolation: isolate;
  font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink};
  zoom: var(--g8z, 1);
  background:
    radial-gradient(circle at 82% 18%, rgba(${T.graphRgb},.09), transparent 30%),
    radial-gradient(circle at 16% 88%, rgba(${T.accentRgb},.07), transparent 34%),
    linear-gradient(rgba(23,26,29,.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(23,26,29,.025) 1px, transparent 1px),
    ${T.bg};
  background-size: auto, auto, 32px 32px, 32px 32px, auto;
}
.pq-root, .pq-root * { box-sizing: border-box; }
.pq-root button { font: inherit; }
@media (max-width: 639.98px) { .pq-root { width: 390px; } }

/* ---- tepa qatori: sarlavha, chiplar, hisob ----
   TEPADA 52px BO'SH JOY. Sayt qobig'i amaliyotning ichida emas, USTIDA
   turadi: chapda «Darslar ro'yxati», o'ngda UZ/RU/EN. Ularni surib bo'lmaydi,
   faqat joy berish mumkin. Chapdan otstup bermaydi (7-sinf amaliyotidagi
   naqsh): qobiq keng, sarlavha esa uzun — ikkisi bir qatorga sig'maydi. */
.pq-top {
  flex-shrink: 0; padding: 62px clamp(12px, 3vw, 34px) 8px;
  display: flex; flex-direction: column; gap: 7px;
}
.pq-head { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.pq-title { font-size: clamp(13px, 1.2vw, 15.5px); font-weight: 800; letter-spacing: -.01em; }
.pq-score {
  margin-left: auto; font-family: ${MATH_FONT}; font-size: 13px; font-weight: 800;
  color: ${T.ink2}; white-space: nowrap;
}
.pq-chips { display: flex; gap: 5px; flex-wrap: wrap; }
.pq-tab {
  min-width: 30px; padding: 4px 8px; border-radius: 9px; cursor: pointer;
  font-family: ${MATH_FONT}; font-size: 12px; font-weight: 800;
  border: 1.5px solid rgba(23,26,29,.13); background: rgba(255,255,255,.72); color: ${T.ink2};
}
.pq-tab.is-now { border-color: ${T.graph}; background: ${T.graph}; color: #fff; }
.pq-tab.is-ok { border-color: ${T.ok}; background: ${T.okSoft}; color: ${T.ok}; }
.pq-tab.is-no { border-color: ${T.no}; background: ${T.tipSoft}; color: ${T.no}; }

/* ---- ish maydoni ---- */
.pq-body { flex: 1; min-height: 0; overflow: clip; padding: 0 clamp(12px, 3vw, 34px); }
.pq-wrap { max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 7px; }
.pq-eyebrow {
  font-size: 11px; font-weight: 800; letter-spacing: .07em; text-transform: uppercase;
  color: ${T.accent};
}
.pq-setup { font-size: clamp(13.5px, 1.15vw, 15.5px); line-height: 1.42; color: ${T.ink2}; }
.pq-ask { font-size: clamp(14px, 1.2vw, 16px); font-weight: 700; }
.pq-expr { display: flex; justify-content: center; padding: 4px 0 2px; }

/* ---- ikki maydon: natija va shart ---- */
.pq-two { display: flex; gap: clamp(10px, 2vw, 26px); flex-wrap: wrap; }
.pq-two-col { flex: 1 1 240px; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
.pq-fold {
  display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; cursor: pointer;
  padding: 8px 11px; border-radius: 12px;
  border: 1.5px dashed ${T.line}; background: rgba(255,255,255,.6);
}
.pq-fold.is-full { border-style: solid; }
.pq-fold-ask { flex: 1; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
.pq-fold-v { font-family: ${MATH_FONT}; font-size: 16px; font-weight: 800; color: ${T.ink}; }
.pq-mark { font-size: 12.5px; font-weight: 700; line-height: 1.35; }
.pq-mark.is-ok { color: ${T.ok}; }
.pq-mark.is-no { color: ${T.no}; }

/* ---- tayyor yechim va tirqishlar ---- */
.pq-rows { display: flex; flex-direction: column; gap: 4px; align-items: center; }
.pq-row { display: flex; align-items: center; gap: 3px; flex-wrap: wrap; justify-content: center; }
.pq-tok { font-family: ${MATH_FONT}; font-size: clamp(17px, 1.7vw, 22px); font-weight: 700; }
.pq-slot {
  min-width: 52px; min-height: 38px; padding: 3px 8px; border-radius: 10px; cursor: pointer;
  font-family: ${MATH_FONT}; font-size: clamp(16px, 1.6vw, 21px); font-weight: 800;
  border: 2px dashed rgba(23,26,29,.24); background: rgba(255,255,255,.6); color: ${T.ink};
}
.pq-slot.is-full { border-style: solid; border-color: ${T.graph}; background: rgba(255,255,255,.95); }
.pq-slot.is-ok { border-style: solid; border-color: ${T.ok}; background: ${T.okSoft}; color: ${T.ok}; }
.pq-slot.is-no { border-style: solid; border-color: ${T.no}; background: ${T.tipSoft}; color: ${T.no}; }

/* ---- kartalar banki ---- */
.pq-bank { display: flex; flex-direction: column; gap: 5px; }
.pq-bank-lbl { font-size: 11px; font-weight: 800; letter-spacing: .06em; color: ${T.ink4}; text-transform: uppercase; }
.pq-cards { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }
.pq-card {
  padding: 6px 11px; border-radius: 10px; cursor: pointer;
  font-family: ${MATH_FONT}; font-size: clamp(14px, 1.4vw, 18px); font-weight: 800;
  border: 1.5px solid rgba(23,26,29,.16); background: rgba(255,255,255,.85); color: ${T.ink};
}
.pq-card.is-on { border-color: ${T.graph}; background: ${T.graph}; color: #fff; }
.pq-card.is-used { opacity: .34; }
.pq-card:disabled { cursor: default; }
.pq-dash { color: ${T.ink4}; font-weight: 800; }

/* ---- yig'ilayotgan yozuv ---- */
.pq-line {
  display: flex; align-items: center; gap: 8px; min-height: 46px;
  padding: 6px 10px; border-radius: 12px;
  border: 1.5px solid rgba(23,26,29,.12); background: rgba(255,255,255,.78);
}
.pq-line-body { flex: 1; font-family: ${MATH_FONT}; font-size: clamp(16px, 1.6vw, 21px); font-weight: 800; }
.pq-line-den { border-bottom: none; }
.pq-line-ph { color: ${T.ink4}; font-family: 'Manrope', system-ui, sans-serif; font-size: 13px; font-weight: 600; font-style: normal; }
.pq-back {
  border: none; background: rgba(23,26,29,.07); border-radius: 9px; padding: 5px 10px;
  cursor: pointer; font-size: 15px; color: ${T.ink2};
}

/* ---- zonalar ---- */
.pq-zones { display: flex; flex-direction: column; gap: 5px; }
.pq-zone { display: flex; align-items: stretch; gap: 8px; }
.pq-zone-lbl {
  width: 116px; flex: 0 0 116px; display: flex; align-items: center; justify-content: flex-end;
  text-align: right; font-size: 11px; font-weight: 800; letter-spacing: .03em; color: ${T.ink4};
}
.pq-zone-box {
  flex: 1; min-height: 44px; border-radius: 12px; padding: 5px;
  border: 2px dashed rgba(23,26,29,.14); background: rgba(255,255,255,.5);
  display: flex; flex-wrap: wrap; gap: 6px; align-content: center; justify-content: center;
}
.pq-zone-box.is-live { border-color: ${T.graph}; background: rgba(255,255,255,.85); cursor: pointer; }
.pq-chip {
  padding: 4px 9px; border-radius: 10px; cursor: pointer; line-height: 1;
  border: 1.5px solid rgba(23,26,29,.16); background: rgba(255,255,255,.9);
}
.pq-chip.is-on { border-color: ${T.graph}; background: ${T.graphSoft}; }
.pq-chip.is-ok { border-color: ${T.ok}; background: ${T.okSoft}; }
.pq-chip.is-no { border-color: ${T.no}; background: ${T.tipSoft}; }

/* ---- ikki yozuv yonma-yon ---- */
.pq-vs { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 2vw, 22px); padding: 2px 0; }
.pq-vs-side { display: flex; align-items: center; }
.pq-vs-sign { font-family: ${MATH_FONT}; font-size: clamp(18px, 1.8vw, 24px); font-weight: 800; color: ${T.ink4}; }

/* ---- tayyor yechimning satrlari ---- */
.pq-audit { display: flex; flex-direction: column; gap: 3px; }
.pq-audit-row {
  display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; cursor: pointer;
  padding: 5px 10px; border-radius: 10px;
  border: 1.5px solid rgba(23,26,29,.1); background: rgba(255,255,255,.7);
}
.pq-audit-row.is-on { border-color: ${T.graph}; background: ${T.graphSoft}; }
.pq-audit-row.is-hit { border-color: ${T.ok}; background: ${T.okSoft}; }
.pq-audit-row.is-off { border-color: ${T.no}; background: ${T.tipSoft}; }
.pq-audit-n { font-family: ${MATH_FONT}; font-size: 12px; font-weight: 800; color: ${T.ink4}; }
.pq-audit-b { font-family: ${MATH_FONT}; font-size: clamp(14px, 1.4vw, 18px); font-weight: 700; }
.pq-proof { display: flex; flex-direction: column; gap: 4px; }

/* ---- «taqiqlangan qiymat yo'q» ---- */
.pq-none {
  align-self: flex-start; padding: 5px 11px; border-radius: 999px; cursor: pointer;
  font-size: 12.5px; font-weight: 700;
  border: 1.5px solid rgba(23,26,29,.16); background: rgba(255,255,255,.8); color: ${T.ink2};
}
.pq-none.is-on { border-color: ${T.graph}; background: ${T.graph}; color: #fff; }

/* ---- KASR AMALIYOTDA KICHIKROQ. Darsda u ramka ichida yolg'iz turadi va
   44px gacha o'sadi (tools.jsx); amaliyotda esa uning ustida shart, ostida
   maydon va razbor bor — shu balandlik budjetga sig'ishi kerak. ---- */
.pq-root .g8-m-big { font-size: clamp(21px, 2.1vw, 28px); }
.pq-root .g8-frac-big .g8-frac-n, .pq-root .g8-frac-big .g8-frac-d { font-size: clamp(21px, 2.1vw, 28px); }

/* ---- IXCHAM REJIM: past ekran (noutbuk 615-655). Ingliz tilidagi matn eng
   uzun, va aynan u kadrdan chiqib ketardi (o'lchandi 2026-08-21: 9-topshiriq
   615px da 155px oshib ketgan). Bu yerda razbor bilan birga hammasi sig'adi. ---- */
@media (max-height: 700px) and (min-width: 900px) {
  /* Tepa qatori BIR SATRGA yig'iladi: sarlavha va hisob chapda, chiplar
     o'ngda. Ikki satrda u 120px egallardi va 9-topshiriq shu sababdan
     sig'masdi (o'lchandi: ish maydoni 433px, kontent 467px). */
  .pq-top { flex-direction: row; align-items: center; flex-wrap: nowrap;
    gap: 12px; padding-top: 54px; padding-bottom: 4px; }
  .pq-head { flex: 0 1 auto; min-width: 0; }
  .pq-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 34vw; }
  .pq-chips { flex: 1 1 auto; justify-content: flex-end; }
  .pq-btn { padding: 7px 18px; }
  .pq-wrap { gap: 4px; }
  .pq-setup { font-size: 13px; line-height: 1.32; }
  .pq-ask { font-size: 14px; }
  .pq-expr { padding: 0; }
  .pq-root .g8-m-big { font-size: 20px; }
  .pq-root .g8-frac-big .g8-frac-n, .pq-root .g8-frac-big .g8-frac-d { font-size: 20px; }
  .pq-root .g8-note { padding: 7px 10px; font-size: 13px; line-height: 1.34; }
  .pq-root .g8-cx { padding: 6px 10px; }
  .pq-audit-row { padding: 3px 9px; }
  .pq-audit-b { font-size: 15px; }
  .pq-rows { gap: 2px; }
  .pq-slot { min-height: 34px; }
  .pq-two { gap: 12px; }
  .pq-zone-box { min-height: 40px; }
  .pq-foot { padding-top: 6px; padding-bottom: 8px; }
}

/* ---- TELEFON (390 va 360). Ustun tor, matn ko'p satrga bo'linadi va razbor
   bilan birga kadrdan chiqib ketardi (o'lchandi 2026-08-21: 2 va 7-topshiriq
   ru tilida 63-64px oshgan). Balandlik budjeti shu yerda eng qattiq. ---- */
@media (max-width: 639.98px) {
  .pq-top { padding-top: 50px; padding-bottom: 3px; gap: 4px; }
  .pq-title { font-size: 12.5px; }
  .pq-score { font-size: 11.5px; }
  .pq-tab { min-width: 26px; padding: 3px 6px; font-size: 11px; border-radius: 8px; }
  .pq-wrap { gap: 4px; }
  .pq-eyebrow { font-size: 10px; }
  .pq-setup { font-size: 12.6px; line-height: 1.3; }
  .pq-ask { font-size: 13px; }
  .pq-expr { padding: 0; }
  .pq-root .g8-m-big { font-size: 19px; }
  .pq-root .g8-frac-big .g8-frac-n, .pq-root .g8-frac-big .g8-frac-d { font-size: 19px; }
  .pq-root .g8-note { padding: 6px 9px; font-size: 12.4px; line-height: 1.32; }
  .pq-root .g8-cx { padding: 5px 9px; }
  .pq-zone { gap: 6px; }
  .pq-zone-lbl { width: 78px; flex: 0 0 78px; font-size: 9.5px; }
  .pq-zone-box { min-height: 36px; padding: 4px; gap: 4px; }
  .pq-chip { padding: 3px 7px; }
  .pq-bank-lbl { font-size: 10px; }
  .pq-cards { gap: 5px; }
  .pq-card { padding: 4px 9px; font-size: 13px; }
  .pq-audit-row { padding: 3px 8px; }
  .pq-audit-b { font-size: 14px; }
  .pq-rows { gap: 2px; }
  .pq-slot { min-height: 32px; min-width: 46px; }
  .pq-fold { padding: 6px 9px; }
  .pq-two { gap: 8px; }
  .pq-foot { padding-top: 5px; padding-bottom: 8px; }
  .pq-btn { padding: 7px 16px; font-size: 13.5px; }
}

/* ---- pastki qator ---- */
.pq-foot {
  flex-shrink: 0; padding: 8px clamp(12px, 3vw, 34px) 12px;
  display: flex; align-items: center; gap: 10px; justify-content: flex-end;
}
.pq-btn {
  padding: 9px 20px; border-radius: 12px; cursor: pointer; border: none;
  font-size: 14.5px; font-weight: 800; color: #fff; background: ${T.graph};
}
.pq-btn:disabled { opacity: .38; cursor: default; }
.pq-btn-2 { background: rgba(23,26,29,.08); color: ${T.ink}; }
.pq-final { max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 8px; text-align: center; }
.pq-final-n { font-family: ${MATH_FONT}; font-size: 40px; font-weight: 800; }
.pq-final-t { font-size: 15px; font-weight: 700; color: ${T.ink2}; }

/* ---- javob berilgan topshiriqqa qaytish: YOZUV, tirik vidjet emas ---- */
.pq-said {
  display: flex; align-items: baseline; gap: 10px; padding: 9px 12px; border-radius: 12px;
  border: 1.5px solid ${T.line}; background: rgba(255,255,255,.72);
}
.pq-said-lbl { font-size: 11.5px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; color: ${T.ink4}; }
.pq-said-v { font-family: ${MATH_FONT}; font-size: 16px; font-weight: 800; color: ${T.ink}; }
`
