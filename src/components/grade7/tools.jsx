// ============================================================================
// 7-sinf ASBOBLARI. Hammasi shu faylda, boshqa sinf bilan BO'LISHILMAYDI --
// 11-sinf naqshi (src/components/grade11/tools.jsx). Yadro ./core.jsx.
// Kontrakt: src/books/grade7/ETALON_7SINF.md
//
// ASBOBLAR (matematikani KO'RSATADI):
//   SubstituteRows -- sonli guvoh: ifoda, son qo'yish, qiymat
//   Transform      -- qadamba-qadam qayta yozish: qismni va amalni tanlash
//   DistributeDemo -- ko'paytuvchi yoylar bilan har bir qo'shiluvchiga boradi
//   SignFlipDemo   -- qavs oldidagi minus ishoralarni birma-bir ag'daradi
//   MergeDemo      -- o'xshash qo'shiluvchilar bittaga qo'shiladi
//   FlipTwiceDemo  -- ikki minus ishorani ikki marta ag'daradi
//   CrateScene     -- yashiklar sahnasi: faqat buyumlar, personaj YO'Q
//   ExplainClip    -- mini-rolik, nuqtalar bilan qadamga qaytish
//
// JAVOB SHAKLLARI (javobni QABUL QILADI, hech nima ko'rsatmaydi):
//   Probe, ProbeChain (blits paneli ham), RuleGate, SlotFill, AuditRows
// Bu farq kontraktda ishlatiladi: 11-ekran ASBOBSIZ, lekin javob shakli bor.
//
// Xato javob naqshi (1, 2 va 5-sinfdan, metodist qarori 2026-08-05):
//   1. tovush playWrong()  2. variant SARIQ bo'ladi va o'chadi
//   3. pastda Feedback bloki  4. 300 ms keyin AYNAN SHU razbor OVOZ bilan
// To'g'ri javobda: playCorrect(), variant yashil, xatolar kaskad bilan yig'iladi.
//
// TEG: har xato variantda ixtiyoriy `tag` bo'ladi va asbob uni onSolved
// payloadida qaytaradi. Baho FAQAT blitsda, qolgan ekranlar teg yozadi (8.5).
//
// import React SHART: LMS xom jsx ni KLASSIK rejimda yuklaydi.
// ============================================================================
import React, { useEffect, useMemo, useState } from 'react'
import {
  ACT,
  Btn,
  CallToAct,
  DoneRow,
  T,
  Expr,
  Feedback,
  L,
  MATH_FONT,
  Options,
  Panel,
  RuleCard,
  Slot,
  UI_TXT,
  useSfx,
  useT,
} from './core.jsx'

export const UI = {
  check: L('Tekshirish', 'Проверить', 'Check'),
  again: L('Qaytadan', 'Заново', 'Reset'),
  another: L('Boshqa son bilan', 'Подставить другое число', 'Try another number'),
  pickPart: L('Qismni tanlang', 'Выберите часть', 'Pick a part'),
  nextRow: L('Keyingi qatorni hisoblash', 'Посчитать следующую строку', 'Compute the next row'),
  whichNum: L("Qaysi sonni qo'yamiz?", 'Какое число подставить?', 'Which number shall we substitute?'),
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
export function Probe({ data, cols = 2, unscored = false, onSolved, disabled, minH, audio, fbSlot = 82, zone = true }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [hint, setHint] = useState(null)
  const [ok, setOk] = useState(false)
  // Xato variantlarning TEGLARI. Baho emas, teg: qaysi yanglish tushuncha ishga
  // tushdi (ETALON_7SINF.md 8.5). Yakunda kamchilik SO'Z bilan ataladi.
  const [tags, setTags] = useState([])

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
      if (onSolved) onSolved({ picked: opt.id, correct: true, attempts: wrong.length + 1, tags })
      return
    }
    setWrong((prev) => (prev.indexOf(opt.id) === -1 ? prev.concat(opt.id) : prev))
    if (src && src.tag) setTags((prev) => (prev.indexOf(src.tag) === -1 ? prev.concat(src.tag) : prev))
    setOk(false)
    setHint(src && src.hint ? src.hint : null)
    fx.wrong(src && src.hint ? src.hint : null)
  }

  return (
    <>
      {/* Savol va variantlar BITTA ZONADA: yorliq, savol, variantlar.
          11-sinf tuzilishi -- ekranda «osilib qolgan» element bo'lmaydi. */}
      <div className={zone ? 'g7-zone' : 'g7-nozone'}>
        {data.question && zone ? <span className="g7-zone-cap">{t(UI_TXT.question)}</span> : null}
        {data.question ? <p className="g7-qpill">{t(data.question)}</p> : null}
        {/* Qayerga bosish kerakligi KO'RINIB tursin (texnik topshiriq 5-band) */}
        <CallToAct kind="pick" done={!!picked || disabled} />
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
      </div>
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
// ProbeChain -- savollar birma-bir. Javob berilgani QATORGA yig'iladi, joy
// keyingi savolga bo'shaydi. BLITS-panel ham shu asbob: to'rt savol bitta
// panelda, javob berilgani qatorga tushadi.
//
// onItem -- har savol yopilganda: {index, correct, attempts, tags}. Blits
// YAGONA baholanadigan ekran, unga birinchi urinishlar soni kerak (8.5).
// ============================================================
export function ProbeChain({ items, cols = 4, onSolved, onStep, onItem, disabled, audio }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [idx, setIdx] = useState(0)
  const [done, setDone] = useState([])
  const [okId, setOkId] = useState(null)
  const [ok, setOk] = useState(false)
  const [wrong, setWrong] = useState([])
  const [hint, setHint] = useState(null)
  const [qTags, setQTags] = useState([])   // hozirgi savolning teglari
  const [allTags, setAllTags] = useState([])

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
      if (onItem) onItem({ index: idx, id: opt.id, correct: true, attempts: wrong.length + 1, tags: qTags })
      setTimeout(() => {
        setDone((prev) => prev.concat(row))
        setWrong([])
        setQTags([])
        setOkId(null)
        setOk(false)
        setHint(null)
        const next = idx + 1
        setIdx(next)
        if (onStep) onStep(next)
        if (next >= items.length && onSolved) onSolved({ correct: true, tags: allTags })
      }, 1900)  // maqtov o'qilishga ulgursin (1100ms da ko'z yetmasdi)
      return
    }
    setWrong((prev) => (prev.indexOf(opt.id) === -1 ? prev.concat(opt.id) : prev))
    if (src && src.tag) {
      setQTags((prev) => (prev.indexOf(src.tag) === -1 ? prev.concat(src.tag) : prev))
      setAllTags((prev) => (prev.indexOf(src.tag) === -1 ? prev.concat(src.tag) : prev))
    }
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
        <div className="g7-in" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Expr size="row">{t(current.prompt)}</Expr>
          <CallToAct kind="pick" done={!!okId || disabled} />
          {/* Namoyish faqat TO'G'RI JAVOBDAN KEYIN. Ilgari u savoldan OLDIN,
              markazlangan oq kartochkada turardi va O'SHA IFODANI boshqa
              yozuvda takrorlardi (3 · (4 + 5) va 3 ( 4 + 5 )) -- metodist
              2026-08-10 da aynan shuni belgilab ko'rsatdi. Endi takror yo'q:
              avval savol, javobdan keyin esa yoylar NEGA shunday ekanini
              ko'rsatadi, yig'ilgan variantlar joyida. */}
          {current.viz && okId ? (
            <div className="g7-in" style={{ paddingBlock: 2 }}>{current.viz(true)}</div>
          ) : null}
          <Options
            items={current.items.map((it) => ({ id: it.id, label: t(it.label) }))}
            picked={okId}
            wrong={wrong}
            onPick={pick}
            disabled={disabled}
            cols={cols}
          />
        </div>
      ) : null}
      <Feedback show={!!hint} ok={ok}>{hint ? t(hint) : null}</Feedback>
    </>
  )
}

// ============================================================
// RuleGate -- SAVOL-OLDIN-QOIDA (3-sinf naqshi, Dars13-16).
// Qoida kartochkasi FAQAT to'g'ri javobdan keyin ochiladi.
// swap bo'lsa: kartochka O'RNIGA jamlanma keladi (pastga QO'SHILMAYDI).
// ============================================================
export function RuleGate({ probe, rule, swap, onSolved, onStep, disabled, audio }) {
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
        <Probe data={probe} cols={2} minH={48} audio={audio} disabled={disabled} onSolved={solved} />
      ) : (
        <>
          <DoneRow>{t(probe.shortAnswer)}</DoneRow>
          {rule.demo ? (
            <div className="g7-panel g7-panel-paper" style={{ padding: '4px 8px', maxWidth: 380, width: '100%', margin: '0 auto' }}>
              {rule.demo}
            </div>
          ) : null}
          {/* Formulalar LawBox ramkasida (11-sinf naqshi): asosiy yozuv oddiy
              ish satridan farq qilib turadi. `laws` bo'lmasa eski `lines`
              rejimi ishlaydi. */}
          <RuleCard
            badge={t(card.badge)}
            lawLabel={card.lawLabel ? t(card.lawLabel) : null}
            laws={card.laws ? card.laws.map((w) => ({ formula: w.formula, note: w.note ? t(w.note) : null })) : null}
            lines={(card.lines || []).map((l) => t(l))}
            example={card.example ? t(card.example) : null}
          />
          {/* Slot FAQAT `swap` bo'lganda: aks holda 44px BO'SH joy egallanardi va
              uch ramkali qoida kartochkasi 615px da sig'masdan kesilardi. */}
          {swap && !swapped ? (
            <Slot mh={44} style={{ alignItems: 'center' }}>
              <Btn tone="soft" ready onClick={() => { setSwapped(true); if (onStep) onStep('both') }}>
                {t(swap.button)}
              </Btn>
            </Slot>
          ) : null}
        </>
      )}
    </>
  )
}

// ============================================================
// SlotFill -- bo'sh uyalarni to'ldirish: belgilar yoki bo'laklar.
// Tekshiruv SON QO'YIB bajariladi.
// ============================================================
export function SlotFill({ template, parts, answer, checkNote, wrongs, onSolved, onStep, prompt, disabled, audio }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [filled, setFilled] = useState(() => answer.map(() => null))
  const [active, setActive] = useState(0)
  const [checked, setChecked] = useState(false)
  const [hint, setHint] = useState(null)
  const [tags, setTags] = useState([])
  const [tries, setTries] = useState(0)
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
      if (onSolved) onSolved({ correct: true, filled, attempts: tries + 1, tags })
      return
    }
    setTries((n) => n + 1)
    const key = filled.join('|')
    const exact = (wrongs || []).find((x) => x.key === key)
    const fallback = (wrongs || []).find((x) => x.key === '*')
    const h = (exact && exact.hint) || (fallback && fallback.hint) || null
    const tag = exact && exact.tag ? exact.tag : null
    if (tag) setTags((prev) => (prev.indexOf(tag) === -1 ? prev.concat(tag) : prev))
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
      {prompt ? (
        <div className="g7-zone" style={{ gap: 4, paddingBottom: 6 }}>
          <span className="g7-zone-cap">{t(UI_TXT.zoneTask)}</span>
          <p className="g7-qpill">{t(prompt)}</p>
        </div>
      ) : null}
      <div className="g7-panel g7-panel-paper g7-expr g7-expr-big g7-slotfill-panel" style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center', alignItems: 'center', minHeight: 48 }}>
        {template.map((piece, i) => {
          if (typeof piece === 'string') return <span key={i}>{piece}</span>
          const idx = piece.slot
          const value = filled[idx]
          return (
            <button
              type="button"
              key={i}
              onClick={() => { setActive(idx); setHint(null) }}
              className={'g7-frame' + (active === idx && !correct ? ' g7-picked' : '')}
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
        {/* Chapga tekislangan: ekranda hamma narsa chapdan boshlanadi,
            markazlangan qator «suzib yurgandek» ko'rinardi. */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, justifyContent: 'flex-start' }}>
          <CallToAct kind="tap" done={correct || disabled} />
          {parts.map((p) => (
            <button
              type="button"
              key={p.id}
              className="g7-opt"
              // 34px lik chipslar bosish nishoni uchun KICHIK edi (telefonda
              // eng kam 44px). 5-sinf variantlari kabi baland qilindi.
              style={{ minHeight: 48, minWidth: 56, width: 'auto', padding: '8px 18px', fontFamily: MATH_FONT, fontSize: 'clamp(16px, 2vw, 19px)', display: 'inline-flex', justifyContent: 'center' }}
              disabled={correct || disabled}
              onClick={() => put(p.id)}
            >
              {t(p.label)}
            </button>
          ))}
        </div>
      </Slot>

      <Slot mh={46}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-start' }}>
          <Btn tone="accent" ready={complete && !correct && !disabled} onClick={check} disabled={!complete || correct || disabled}>
            {t(UI.check)}
          </Btn>
          {!correct ? <Btn tone="ghost" onClick={reset}>{t(UI.again)}</Btn> : null}
        </div>
      </Slot>

      <Slot mh={58}>
        {correct && checkNote ? <Feedback show ok>{t(checkNote)}</Feedback> : null}
        {!correct ? <Feedback show={!!hint} ok={false}>{hint ? t(hint) : null}</Feedback> : null}
      </Slot>
    </>
  )
}

// ============================================================
// CompareCards -- IKKI YONMA-YON KARTOCHKA: ko'paytuvchi va qo'shiluvchi.
// Texnik topshiriq 2026-08-10, 4-ekran: farqni RANG, YOY va qisqa misol
// bilan ko'rsatish. Foto yo'q -- yoylar oddiy SVG, qolgani CSS.
// Chapdagi yoylar HAR BIR qo'shiluvchiga boradi, o'ngda yoy umuman yo'q:
// qo'shiluvchi taqsimlanmaydi.
// ============================================================
export function CompareCards({ left, right }) {
  const t = useT()
  const card = (d, tone, arcs) => (
    <div className="g7-cmp" style={{ borderTopColor: tone }}>
      <span className="g7-cmp-cap" style={{ color: tone, background: tone === T.graph ? T.graphSoft : T.accentSoft }}>
        {t(d.cap)}
      </span>
      <div className="g7-cmp-expr" style={{ color: tone }}>{d.expr}</div>
      <svg viewBox="0 0 200 26" className="g7-cmp-arc" aria-hidden="true">
        {arcs ? (
          <g fill="none" stroke={tone} strokeWidth="2" strokeLinecap="round">
            <path d="M40 4 C 40 20, 108 20, 108 6" />
            <path d="M40 4 C 40 24, 166 24, 166 6" />
            <path d="M104 10 l4 -5 l4 5" fill={tone} stroke="none" />
            <path d="M162 10 l4 -5 l4 5" fill={tone} stroke="none" />
          </g>
        ) : null}
      </svg>
      <p className="g7-cmp-note">{t(d.note)}</p>
      <div className="g7-cmp-res">{d.res}</div>
    </div>
  )
  return (
    <div className="g7-cmp-row">
      {card(left, T.graph, true)}
      {card(right, T.accent, false)}
    </div>
  )
}

// ============================================================
// AuditRows -- BIRINCHI xato qadamni topish. Javobdan keyin xato
// SON QO'YIB isbotlanadi, «bu yerda xato» degan matn bilan emas.
// ============================================================
export function AuditRows({ rows, answerId, hints, tags, proof, onSolved, onStep, disabled, audio }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [hint, setHint] = useState(null)
  const [hitTags, setHitTags] = useState([])
  const solved = picked === answerId

  const pick = (id) => {
    if (solved) return
    if (id === answerId) {
      setPicked(id)
      setHint(null)
      fx.right()
      if (onStep) onStep('proof')
      if (onSolved) onSolved({ correct: true, attempts: wrong.length + 1, tags: hitTags })
      return
    }
    setWrong((prev) => (prev.indexOf(id) === -1 ? prev.concat(id) : prev))
    const tag = tags ? tags[id] : null
    if (tag) setHitTags((prev) => (prev.indexOf(tag) === -1 ? prev.concat(tag) : prev))
    setHint(hints[id] || null)
    fx.wrong(hints[id])
  }

  return (
    <>
      <div className="g7-panel g7-panel-paper" style={{ display: 'flex', flexDirection: 'column', gap: solved ? 2 : 4 }}>
        {rows.map((row, i) => {
          const isWrongPick = wrong.indexOf(row.id) !== -1
          const isAnswer = solved && row.id === answerId
          return (
            <button
              type="button"
              key={row.id}
              className={'g7-opt' + (isAnswer ? ' g7-opt-ok' : '') + (isWrongPick ? ' g7-opt-tip' : '')}
              style={{
                fontFamily: MATH_FONT,
                /* yechilgach qatorlar KOMPAKT: ikkinchi savolga joy bo'shaydi */
                minHeight: solved ? 26 : 33,
                padding: solved ? '2px 11px' : '5px 11px',
                fontSize: solved ? 'clamp(12px, 1.6vw, 14px)' : 'clamp(14px, 1.9vw, 17px)',
                transition: 'min-height .5s, padding .5s, font-size .5s',
              }}
              disabled={solved || isWrongPick || disabled}
              onClick={() => pick(row.id)}
            >
              <span className="g7-opt-badge">{i + 1}</span>
              <span className="g7-opt-text">{row.text}</span>
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

// ============================================================
// SubstituteRows -- SONLI GUVOH, darsning asosiy asbobi.
// Harf tanlangan songa AYLANADI, keyin qatorlar birma-bir hisoblanadi.
// Xato yozuv «noto'g'ri» so'zi bilan emas, IKKI XIL SON bilan rad etiladi.
// ============================================================
// `letter` -- son qo'yiladigan harf. Sarlavhada «a = 4» deb ko'rsatiladi,
// shuning uchun harf QOTIB QOLMAYDI: 12-ekranda o'zgaruvchi m.
export function SubstituteRows({ rows, numbers, question, options, onSolved, onStep, compareNote, disabled, letter = 'a', audio, okText }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [n, setN] = useState(numbers.length === 1 ? numbers[0] : null)
  const [shown, setShown] = useState(0)
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [hint, setHint] = useState(null)
  const [ok, setOk] = useState(false)
  const [round, setRound] = useState(0)
  const [tags, setTags] = useState([])

  const allShown = shown >= rows.length
  const sourceVal = useMemo(() => {
    const src = rows.find((r) => r.role === 'source')
    return src && n !== null ? src.val(n) : null
  }, [rows, n])

  const chooseNumber = (value) => {
    setN(value)
    setShown(0)
    if (onStep) onStep('sub')
  }

  const revealNext = () => {
    const next = shown + 1
    setShown(next)
    if (onStep) onStep('row' + next)
  }

  // Son tanlangach qatorlar O'ZI ochiladi, har biri pauza bilan. Ilgari har
  // qatorga alohida tugma bosish kerak edi -- uch ortiqcha bosish, va
  // hisoblash o'quvchi uchun «amal» emas, KUZATUV.
  useEffect(() => {
    if (n === null || shown >= rows.length || disabled) return undefined
    const tmr = setTimeout(revealNext, shown === 0 ? 420 : 620)
    return () => clearTimeout(tmr)
  }, [n, shown, disabled]) // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (opt) => {
    const src = options.find((o) => o.id === opt.id)
    if (src && src.correct) {
      setPicked(opt.id)
      setOk(true)
      setHint(okText || null)
      fx.right()
      if (audio && audio.say && okText) audio.say(t(okText))
      if (onSolved) onSolved({ picked: opt.id, correct: true, attempts: wrong.length + 1, tags })
      return
    }
    setWrong((prev) => (prev.indexOf(opt.id) === -1 ? prev.concat(opt.id) : prev))
    if (src && src.tag) setTags((prev) => (prev.indexOf(src.tag) === -1 ? prev.concat(src.tag) : prev))
    setOk(false)
    setHint(src && src.hint ? src.hint : null)
    fx.wrong(src && src.hint ? src.hint : null)
  }

  const anotherNumber = () => {
    const rest = numbers.filter((v) => v !== n)
    if (!rest.length) return
    setN(rest[round % rest.length])
    setRound((r) => r + 1)
    setShown(0)
  }

  return (
    <>
      {numbers.length > 1 && n === null ? (
        <div className="g7-zone">
          <span className="g7-zone-cap">{t(UI_TXT.question)}</span>
          <p className="g7-qpill">{t(UI.whichNum)}</p>
          <CallToAct kind="pick" done={disabled} />
          <Options
            items={numbers.map((v) => ({ id: String(v), label: letter + ' = ' + v }))}
            picked={null}
            wrong={[]}
            onPick={(o) => chooseNumber(Number(o.id))}
            disabled={disabled}
            cols={2}
            minH={40}
            collapse={false}
            badges={false}
          />
        </div>
      ) : null}

      <div className="g7-zone" style={{ gap: 4 }}>
        <span className="g7-zone-cap">{t(UI_TXT.zoneCheck)}</span>
        {rows.map((row, i) => {
          const isDone = i < shown
          const val = n !== null ? row.val(n) : null
          const matches = row.role === 'source' || (isDone && val === sourceVal)
          return (
            <div
              key={row.id}
              className="g7-expr g7-expr-row"
              style={{
                display: 'grid',
                // Qator butun kenglikka CHO'ZILMASIN: 1130px da ifoda chapda,
                // natija esa o'ng chekkada qolib, o'rtada ulkan bo'shliq
                // paydo bo'lardi (2026-08-10 suratlar). Endi 620px chegara.
                maxWidth: 620,
                gridTemplateColumns: 'minmax(0,1fr) 22px minmax(0,1.1fr) 14px auto',
                alignItems: 'center',
                gap: 4,
                minHeight: 32,
              }}
            >
              <span>{row.expr}</span>
              <span style={{ opacity: n === null ? 0.25 : 0.5 }}>→</span>
              <span className={n === null ? 'g7-dim' : 'g7-in'}>{n === null ? '' : row.sub(n)}</span>
              <span style={{ opacity: isDone ? 0.5 : 0.15 }}>=</span>
              <span
                className={isDone ? (matches ? 'g7-num g7-pop' : 'g7-pop') : ''}
                style={{ minWidth: 44, textAlign: 'right', opacity: isDone ? 1 : 0.15 }}
              >
                {isDone ? val : '?'}
              </span>
            </div>
          )
        })}
      </div>

      <Slot mh={40}>
        {allShown && compareNote ? (
          <div className="g7-shakebox"><Expr size="mid" tone="#E8552B" pop>{compareNote}</Expr></div>
        ) : null}
      </Slot>

      {allShown ? (
        <Slot mh={84}>
          <div className="g7-in g7-zone" style={{ gap: 7 }}>
            <span className="g7-zone-cap">{t(UI_TXT.question)}</span>
            <p className="g7-qpill">{t(question)}</p>
            <CallToAct kind="pick" done={!!picked || disabled} />
            <Options
              items={options.map((o) => ({ id: o.id, label: t(o.label) }))}
              picked={picked}
              wrong={wrong}
              onPick={pick}
              disabled={disabled}
              cols={2}
            />
          </div>
        </Slot>
      ) : null}

      {hint || picked ? (
        <Slot mh={72}>
          <Feedback show={!!hint} ok={ok}>{hint ? t(hint) : null}</Feedback>
          {picked && numbers.length > 1 && !hint ? (
            <Btn tone="ghost" onClick={anotherNumber}>{t(UI.another)}</Btn>
          ) : null}
        </Slot>
      ) : null}
    </>
  )
}

// ============================================================
// Transform -- qadamba-qadam qayta yozish. Darsning ish oti.
// O'quvchi IFODANING QISMINI tanlaydi, keyin AMALNI tanlaydi.
// «Darrov javob» tugmasi YO'Q -- uni bosadigan joy yo'q.
// ============================================================
export function Transform({ start, steps, parts, actions, onSolved, onStep, footNote, disabled, audio }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [lines, setLines] = useState([start])
  const [part, setPart] = useState(null)
  const [hint, setHint] = useState(null)
  const [shake, setShake] = useState(0)
  const [tags, setTags] = useState([])
  const [misses, setMisses] = useState(0)

  const stepIdx = lines.length - 1
  const step = steps[stepIdx]
  const finished = stepIdx >= steps.length
  const currentParts = step ? step.parts || parts || [] : []

  const fail = (h, tag) => {
    setHint(h || null)
    setShake((s) => s + 1)
    setMisses((m) => m + 1)
    if (tag) setTags((prev) => (prev.indexOf(tag) === -1 ? prev.concat(tag) : prev))
    fx.wrong(h)
  }

  const act = (actionId) => {
    if (!step) return
    if (step.part && part !== step.part) {
      const w = (step.wrongs || []).find((x) => x.action === actionId && (!x.part || x.part === part))
      fail(w ? w.hint : step.needPart, w ? w.tag : null)
      return
    }
    if (actionId === step.action) {
      const next = lines.concat(step.to)
      setLines(next)
      setPart(null)
      setHint(null)
      fx.right()
      if (onStep) onStep('step' + next.length)
      if (next.length - 1 >= steps.length && onSolved) {
        onSolved({ correct: true, lines: next, attempts: misses + 1, tags })
      }
      return
    }
    const w = (step.wrongs || []).find((x) => x.action === actionId)
    fail(w ? w.hint : null, w ? w.tag : null)
  }

  return (
    <>
      <div className="g7-panel g7-panel-paper" style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {lines.map((line, i) => (
          <div key={i} className={'g7-expr g7-expr-row' + (i === lines.length - 1 && i > 0 ? ' g7-pop' : '')} style={{ minHeight: 31 }}>
            {line}
          </div>
        ))}
        {!finished ? (
          <div className="g7-expr g7-expr-row g7-frame g7-pulse" style={{ minHeight: 31, opacity: 0.5 }}>?</div>
        ) : null}
      </div>

      <Slot mh={38}>
        {!finished && currentParts.length ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <span className="g7-eyebrow" style={{ display: 'inline' }}>{t(UI.pickPart)}</span>
            {currentParts.map((p) => (
              <button
                type="button"
                key={p}
                className={'g7-opt' + (part === p ? ' g7-picked' : '')}
                style={{ minHeight: 32, padding: '5px 10px', fontFamily: MATH_FONT, width: 'auto', display: 'inline-flex' }}
                disabled={disabled}
                onClick={() => { setPart(p); setHint(null) }}
              >
                {p}
              </button>
            ))}
          </div>
        ) : null}
      </Slot>

      <Slot mh={92}>
        {!finished ? (
          <div className="g7-shakebox" style={{ width: '100%' }}>
            <div key={shake} className={shake ? 'g7-shake' : undefined}>
              <Options
                items={actions.map((a) => ({ id: a.id, label: t(a.label) }))}
                picked={null}
                wrong={[]}
                onPick={(o) => act(o.id)}
                disabled={disabled}
                cols={2}
                minH={40}
                collapse={false}
                badges={false}
              />
            </div>
          </div>
        ) : footNote ? (
          <Expr size="sm">{footNote}</Expr>
        ) : null}
      </Slot>

      <Slot mh={74}>
        <Feedback show={!!hint} ok={false}>{hint ? t(hint) : null}</Feedback>
      </Slot>
    </>
  )
}

// ============================================================================
// DINAMIK NAMOYISHCHILAR -- savol va qoidani HARAKAT bilan ko'rsatadi.
// Bular ham ASBOB: bir marta yoziladi, hamma darsda ishlatiladi. Har biri
// balandligi QAT'IY (budjet 400px), shuning uchun slaydni yormaydi.
//
//   DistributeDemo -- ko'paytuvchi har bir qo'shiluvchiga yoy bo'ylab boradi
//   SignFlipDemo   -- qavs oldidagi minus ishoralarni birma-bir ag'daradi
//   MergeDemo      -- o'xshash qo'shiluvchilar bittaga qo'shilib ketadi
//   FlipTwiceDemo  -- ikki minus ishorani ikki marta ag'daradi
// ============================================================================

// Ko'paytuvchi qavs ichidagi HAR BIR qo'shiluvchiga boradi.
export function DistributeDemo({ factor = '3', t1 = 'a', t2 = '5', op = '+', run = 0, h = 58 }) {
  return (
    <svg viewBox="0 0 320 62" style={{ width: '100%', height: h, display: 'block' }} aria-hidden="true">
      <g fontFamily={MATH_FONT} fontSize="21" fontWeight="700" fill="#14161A">
        <text x="26" y="26" textAnchor="middle">{factor}</text>
        <text x="48" y="26" textAnchor="middle">(</text>
        <text x="70" y="26" textAnchor="middle">{t1}</text>
        <text x="94" y="26" textAnchor="middle">{op}</text>
        <text x="118" y="26" textAnchor="middle">{t2}</text>
        <text x="140" y="26" textAnchor="middle">)</text>
      </g>
      <g fill="none" stroke="#E8552B" strokeWidth="2" strokeLinecap="round">
        <path key={'p1-' + run} d="M26 34 C 26 52, 70 52, 70 36" className="g7-arc" style={{ animationDelay: '.05s' }} />
        <path key={'p2-' + run} d="M26 34 C 40 58, 118 58, 118 36" className="g7-arc" style={{ animationDelay: '.45s' }} />
      </g>
      <g fill="#E8552B" stroke="none">
        <polygon key={'a1-' + run} points="70,33 66,41 74,41" className="g7-arc-tip" style={{ animationDelay: '.35s' }} />
        <polygon key={'a2-' + run} points="118,33 114,41 122,41" className="g7-arc-tip" style={{ animationDelay: '.75s' }} />
      </g>
    </svg>
  )
}

// Qavs oldidagi minus HAR BIR qo'shiluvchining ishorasini ag'daradi.
export function SignFlipDemo({ before = '−( a − 7 )', pairs = [['a', '−a'], ['− 7', '+ 7']], run = 0, h = 56 }) {
  return (
    <div key={run} style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', height: h, justifyContent: 'center' }}>
      <div className="g7-expr g7-expr-row" style={{ opacity: 0.5 }}>{before}</div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {pairs.map((pair, i) => (
          <span key={i} className="g7-flip" style={{ animationDelay: 0.25 + i * 0.45 + 's' }}>
            <span className="g7-flip-old">{pair[0]}</span>
            <span className="g7-flip-new">{pair[1]}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// O'xshash qo'shiluvchilar bittaga qo'shiladi: chiplar yaqinlashib qo'shiladi.
export function MergeDemo({ left = '4x', right = '3x', result = 'x', op = '−', run = 0, h = 46 }) {
  return (
    <div key={run} style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', height: h }}>
      <span className="g7-chip g7-merge-l">{left}</span>
      <span className="g7-chip-op">{op}</span>
      <span className="g7-chip g7-merge-r">{right}</span>
      <span className="g7-chip-op">=</span>
      <span className="g7-chip g7-chip-ok g7-merge-res">{result}</span>
    </div>
  )
}

// Ikki minus: ishora ikki marta ag'dariladi va boshiga qaytadi.
export function FlipTwiceDemo({ value = '4', run = 0, h = 46 }) {
  return (
    <div key={run} style={{ display: 'flex', gap: 7, alignItems: 'center', justifyContent: 'center', height: h }}>
      <span className="g7-chip g7-flip1">−</span>
      <span className="g7-chip g7-flip2">−</span>
      <span className="g7-chip">{value}</span>
      <span className="g7-chip-op">=</span>
      <span className="g7-chip g7-chip-ok g7-merge-res">+{value}</span>
    </div>
  )
}

// ============================================================================
// SAHNA va MINI-ROLIK.
//
// `CrateScene` -- qavsning FIZIK modeli: uchta bir xil yashik, har birida
// bitta muhrlangan `a` bloki va beshta batareya. Ya'ni 3(a + 5) ni ko'z bilan
// ko'rish mumkin. Holatlar: closed -> open -> regroup -> result.
// Qayta guruhlash aynan taqsimot qonuni: hamma `a` chapga, hamma batareya
// o'ngga. Personaj YO'Q -- faqat buyumlar.
//
// `ExplainClip` -- «mini-rolik»: qadamlar o'z-o'zidan ketma-ket o'ynaydi,
// pastda izoh almashadi, nuqtalarni bosib qadamga qaytish mumkin.
// 3-sinf naqshi: sahna balandligi DERAZAGA moslashadi (clamp + 100dvh),
// shuning uchun past ekranda ham skroll paydo bo'lmaydi.
// ============================================================================

// ============================================================================
// PlotScene -- QAVSNING YUZA MODELI (area model).
//
// Nega aynan yuza. Jahon metodikasida qavsni ochish AYNAN shu model bilan
// kiritiladi: o'quvchi to'g'ri to'rtburchak yuzini ikki xil hisoblashni
// allaqachon biladi, demak 3(a + 5) va 3a + 15 tengligi YANGI QOIDA emas,
// eski bilimning harflar bilan yozilishi. Yashiklar modeli buni ko'rsatmasdi:
// yashikni QAYTA SANASH kerak edi, sanash esa tenglikni isbotlamaydi.
// Darslik dunyosi ham shu: 19-betda maydon a ga b, yer olingach yuza oshadi.
//
// Sahna: kengligi 3 m issiqxona. Uzunligi `a` edi, yana 5 m qo'shildi.
// Fazalar:
//   old     -- faqat eski qism, tepasida `a`
//   grown   -- o'ng tomonga 5 m lik yangi qism O'SADI
//   whole   -- chok so'nadi, butun figura bitta bo'ladi -> 3(a + 5)
//   cut     -- chok punktir bo'ladi va ikki qism ajraladi
//   counted -- yangi qismda 15 ta birlik kvadrat birma-bir yonadi -> 3a va 15
//
// `plain` -- bezaksiz rejim: o'simlik nuqtalari olib tashlanadi va sahna
// SOF TO'G'RI TO'RTBURCHAK bo'lib qoladi (metodist 2026-08-10: «если не
// понравится, можем сделать как прямоугольник»). Bitta bayroq, qayta yozish emas.
// ============================================================================

const PLOT = {
  x0: 64,          // figuraning chap cheti
  yTop: 32,        // yuqori cheti
  row: 38,         // 1 metr = 38 px balandlik
  rows: 3,         // kengligi 3 metr
  oldW: 300,       // `a` -- uzunligi NOMA'LUM, shuning uchun kataksiz
  unit: 40,        // 1 metr = 40 px uzunlik
}

// `plain` YOQILGAN (metodist 2026-08-10: «лучше сделай прямоугольником»):
// o'simlik nuqtalari YO'Q, sof to'g'ri to'rtburchak. Bezakni qaytarish uchun
// `plain={false}` yetarli -- kod o'chirilmagan.
export function PlotScene({ phase = 'old', label = 'a', per = 5, plain = true }) {
  const grown = phase !== 'old'
  const whole = phase === 'whole'
  const cut = phase === 'cut' || phase === 'counted'
  const counted = phase === 'counted'

  const { x0, yTop, row, rows, oldW, unit } = PLOT
  const h = row * rows
  const newW = per * unit
  const seamX = x0 + oldW
  const shift = cut ? 7 : 0

  const oldFill = whole ? T.accentSoft : T.graphSoft
  const oldLine = whole ? T.accent : T.graph

  return (
    <svg viewBox="0 0 620 170" className="g7-scene-svg" aria-hidden="true">
      {/* Butun chizma bitta guruhda: o'smaguncha u MARKAZDA turadi, aks holda
          figura kartochkaning chap yarmida qolib, o'ng yarmi bo'sh oq dog'
          bo'lardi (2026-08-10 suratlar, 5-slayd). O'sish paytida guruh
          chapga suriladi -- «joy ochildi» degan harakat. */}
      <g className="g7-plot-shift" style={{ transform: 'translateX(' + (grown ? 0 : newW / 2) + 'px)' }}>
      {/* Kenglik o'lchovi: 3 m. Chapda, figuradan tashqarida. */}
      <g stroke={T.ink3} strokeWidth="1.4">
        <line x1="40" y1={yTop} x2="40" y2={yTop + h} />
        <line x1="34" y1={yTop} x2="46" y2={yTop} />
        <line x1="34" y1={yTop + h} x2="46" y2={yTop + h} />
      </g>
      <text x="22" y={yTop + h / 2 + 6} textAnchor="middle" fontFamily="'Manrope', sans-serif" fontSize="16" fontWeight="700" fill={T.ink2}>3</text>

      {/* ESKI QISM: uzunligi a. Kataklar YO'Q -- a noma'lum. */}
      <g className="g7-plot-part" style={{ transform: 'translateX(' + -shift + 'px)' }}>
        <rect x={x0} y={yTop} width={oldW} height={h} rx="6" fill={oldFill} stroke={oldLine} strokeWidth="2.4" style={{ transition: 'fill .5s ease, stroke .5s ease' }} />
        {[1, 2].map((r) => (
          <line key={r} x1={x0} y1={yTop + r * row} x2={x0 + oldW} y2={yTop + r * row} stroke={oldLine} strokeWidth="1" opacity="0.32" />
        ))}
        {!plain
          ? [0, 1, 2].map((r) =>
              [0, 1, 2, 3, 4].map((c) => (
                <circle key={r + '-' + c} cx={x0 + 34 + c * 58} cy={yTop + row * r + row / 2} r="4" fill={T.graph} opacity="0.24" />
              )),
            )
          : null}
        <text x={x0 + oldW / 2} y={yTop - 12} textAnchor="middle" fontFamily={MATH_FONT} fontSize="21" fontWeight="700" fill={T.ink}>{label}</text>
        <g className="g7-plot-num" style={{ opacity: counted ? 1 : 0 }}>
          {/* Son kataklar va nuqtalar ustida turadi -- ostiga yorug' pod
              qo'yilmasa, o'qilmaydi. */}
          <rect x={x0 + oldW / 2 - 40} y={yTop + h / 2 - 21} width="80" height="42" rx="10" fill={T.paperSolid} opacity="0.88" />
          <text x={x0 + oldW / 2} y={yTop + h / 2 + 11} textAnchor="middle" fontFamily={MATH_FONT} fontSize="30" fontWeight="700" fill={T.graph}>
            {rows}<tspan fontStyle="italic">{label}</tspan>
          </text>
        </g>
      </g>

      {/* YANGI QISM: 5 metr. Kengligi 0 dan o'sadi -- «polosani prirezali». */}
      <g className="g7-plot-part" style={{ transform: 'translateX(' + shift + 'px)', opacity: grown ? 1 : 0, transition: 'transform .5s cubic-bezier(.3,0,.2,1), opacity .3s ease' }}>
        <rect className="g7-plot-grow" x={seamX} y={yTop} width={grown ? newW : 0} height={h} rx="6" fill={T.accentSoft} stroke={T.accent} strokeWidth="2.4" />
        {/* Qatorlar YANGI qismda ham davom etadi: kenglik ikkalasida bir xil,
            uch metr. Aks holda ikki figura ko'rinadi, bitta emas. */}
        {grown
          ? [1, 2].map((r) => (
              <line key={'nr' + r} x1={seamX} y1={yTop + r * row} x2={seamX + newW} y2={yTop + r * row} stroke={T.accent} strokeWidth="1" opacity={counted ? 0 : 0.3} style={{ transition: 'opacity .3s ease' }} />
            ))
          : null}
        {!plain && grown
          ? [0, 1, 2].map((r) =>
              [0, 1, 2, 3, 4].map((c) => (
                <circle key={'nd' + r + '-' + c} cx={seamX + 20 + c * unit} cy={yTop + row * r + row / 2} r="4" fill={T.graph} opacity={counted ? 0 : 0.24} style={{ transition: 'opacity .3s ease' }} />
              )),
            )
          : null}
        {/* Birlik kvadratlar: 3 qator x 5 ustun. Sanash SHU YERDA ishlaydi --
            yangi qismning har tomoni MA'LUM, shuning uchun 15 ni a ni
            bilmasdan ayta olamiz. Darsning butun ma'nosi shu. */}
        {[0, 1, 2].map((r) =>
          Array.from({ length: per }).map((_, c) => (
            <rect
              key={r + '-' + c}
              className="g7-plot-cell"
              x={seamX + c * unit + 3}
              y={yTop + r * row + 3}
              width={unit - 6}
              height={row - 6}
              rx="3"
              fill={T.accent}
              style={{ opacity: counted ? 0.26 : 0, transitionDelay: (r * per + c) * 0.055 + 's' }}
            />
          )),
        )}
        <text x={seamX + newW / 2} y={yTop - 12} textAnchor="middle" fontFamily={MATH_FONT} fontSize="18" fontWeight="700" fill={T.ink} style={{ opacity: grown ? 1 : 0, transition: 'opacity .4s ease .2s' }}>{per}</text>
        <g className="g7-plot-num" style={{ opacity: counted ? 1 : 0 }}>
          <rect x={seamX + newW / 2 - 40} y={yTop + h / 2 - 21} width="80" height="42" rx="10" fill={T.paperSolid} opacity="0.88" />
          <text x={seamX + newW / 2} y={yTop + h / 2 + 11} textAnchor="middle" fontFamily={MATH_FONT} fontSize="30" fontWeight="700" fill={T.accent}>{rows * per}</text>
        </g>
      </g>

      {/* CHOKNI YOPADIGAN YAMOQ. Ikki to'rtburchakning O'Z chegarasi va O'Z
          yumaloq burchagi bor, shuning uchun chiziqni «o'chirish» YETMAYDI:
          ustidan bir xil rangli yamoq qo'yiladi, keyin yuqori va pastki
          chegara chok ustidan QAYTA chiziladi. Shundagina figura bitta. */}
      <g style={{ opacity: whole ? 1 : 0, transition: 'opacity .45s ease' }}>
        <rect x={seamX - 7} y={yTop - 2} width="14" height={h + 4} fill={T.accentSoft} />
        <line x1={seamX - 8} y1={yTop} x2={seamX + 8} y2={yTop} stroke={T.accent} strokeWidth="2.4" />
        <line x1={seamX - 8} y1={yTop + h} x2={seamX + 8} y2={yTop + h} stroke={T.accent} strokeWidth="2.4" />
        {[1, 2].map((r) => (
          <line key={'sr' + r} x1={seamX - 8} y1={yTop + r * row} x2={seamX + 8} y2={yTop + r * row} stroke={T.accent} strokeWidth="1" opacity="0.3" />
        ))}
      </g>

      {/* CHOK. Butun bo'lganda so'nadi, kesilganda punktir bo'lib qaytadi. */}
      <line
        className="g7-plot-seam"
        x1={seamX} y1={yTop - 4} x2={seamX} y2={yTop + h + 4}
        stroke={cut ? T.ink : T.accent}
        strokeWidth={cut ? 2 : 2.4}
        strokeDasharray={cut ? '7 6' : 'none'}
        style={{ opacity: !grown ? 0 : whole ? 0 : 1 }}
      />
      </g>
    </svg>
  )
}

// Mini-rolik: qadamlar o'zi ketma-ket o'ynaydi, nuqtalar bilan qaytish mumkin.
export function ExplainClip({ steps, render, autoMs = 1900, onDone }) {
  const t = useT()
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return undefined
    if (i >= steps.length - 1) {
      setPlaying(false)
      if (onDone) onDone()
      return undefined
    }
    const timer = setTimeout(() => setI((n) => n + 1), autoMs)
    return () => clearTimeout(timer)
  }, [i, playing, steps.length, autoMs, onDone])

  const goto = (n) => { setPlaying(false); setI(n) }
  const replay = () => { setI(0); setPlaying(true) }

  return (
    <>
      <div className="g7-scene g7-scene-clip">{render(steps[i].state)}</div>
      <Slot mh={30}>
        <p className="g7-clip-cap" key={i}>{t(steps[i].caption)}</p>
      </Slot>
      <div className="g7-clip-bar">
        {steps.map((s, n) => (
          <button
            key={n}
            type="button"
            className={'g7-clip-dot' + (n === i ? ' g7-clip-dot-on' : '') + (n < i ? ' g7-clip-dot-past' : '')}
            onClick={() => goto(n)}
            aria-label={String(n + 1)}
          />
        ))}
        <button type="button" className="g7-clip-replay" onClick={replay} aria-label="replay">↺</button>
      </div>
    </>
  )
}

export { UI as TOOL_UI }
