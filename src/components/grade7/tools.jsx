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
  Ask,
  Btn,
  CallToAct,
  DoneRow,
  T,
  Expr,
  Feedback,
  Fx,
  Hint,
  L,
  MATH_FONT,
  Options,
  Panel,
  RuleCard,
  Slot,
  TapMark,
  UI_TXT,
  useLang,
  useNarratedSteps,
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
  askPart: L("Nimani birinchi hisoblaymiz? Yozuvdagi amal belgisini bosing.", 'Что считаем первым? Нажми на знак действия в записи.', 'What do we do first? Tap an operation sign in the expression.'),
  askAct: L('Bu qaysi bosqich amali?', 'Какой это ступени действие?', 'Which stage is this operation?'),
  ruleFirst: L('Qoidada nima BIRINCHI keladi?', 'Что в правиле идёт первым?', 'What comes first in the rule?'),
  ruleNext: L('Keyin nima keladi?', 'Что идёт дальше?', 'What comes next?'),
  ruleHere: L("Qoida shu yerda yig'iladi", 'Здесь собирается правило', 'The rule is built here'),
  step: L('qadam', 'шаг', 'step'),
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
    // Yozuvning ICHIDAGI bosish: baho emas, kalkulyator klavishasi.
    tap: () => sfx.playTap(),
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
      // Variantning O'Z izohi bo'lsa, aynan u chiqadi (§8.3: har bir variantga
      // o'z razbori). Bo'lmasa -- hamma uchun umumiy `afterPredict`.
      const own = src && src.hint ? src.hint : data.afterPredict
      if (own) { setOk(false); setHint(own) }
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
        {data.question ? <p className="g7-qpill">{t(data.question)}</p> : null}
        {/* Qayerga bosish kerakligi KO'RINIB tursin (texnik topshiriq 5-band).
            Belgi variantlar bilan BIR CHIZIQDA: variantlar cheklangan
            kenglikda, ya'ni belgi ham o'sha ustunda turishi kerak. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'inherit' }}>
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
//
// `question` -- butun zanjir uchun SAVOL, yozuvning USTIDA turadi. Ilgari
// ekranda faqat yozuv va to'rt variant bo'lardi: `7 · 4 − 5 =` nimani
// so'rayotgani hech qayerda aytilmasdi (metodist 2026-08-14).
// Savolni SO'Z bilan beradigan bandda `question: null` yoziladi -- u o'zi
// savol, tepasiga yana bittasini qo'yish TAKROR bo'lardi.
// ============================================================
export function ProbeChain({ items, cols = 4, question, onSolved, onStep, onItem, disabled, audio }) {
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
  // Bandning O'Z savoli zanjir savolidan USTUN. `null` ham javob: u savolni
  // O'CHIRADI, ya'ni «hech narsa berilmagan» bilan «ataylab yo'q» farqlanadi.
  const ask = current && current.question !== undefined ? current.question : question

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
          <Ask tight>{ask ? t(ask) : null}</Ask>
          {/* `wrap` -- savol SO'Z bilan berilgan holat. `.g7-expr` da
              `white-space: nowrap` turadi va proza chetga chiqib KO'RINMAY
              qoladi: skroll yo'q, shuning uchun kesilgani bilinmaydi
              (ETALON_7SINF.md §6.2, 11-sinfda 557px chiqib ketgan edi). */}
          {/* `wrap` -- savol PROZA bilan berilgan. Unda bosqich rangi
              o'chiriladi: gapdagi tire amal belgisi emas.
              To'g'ri javob YOZUVGA KELIB TUSHADI: son yozuvning o'ng
              chetida qalqib chiqadi va shundan keyingina qator yig'iladi.
              Bu darsning o'sha qo'l yozuvi -- kadrlarda, yo'laklarda va
              qayta yozishda son AYNAN shunday tug'iladi. */}
          <Expr
            size="row"
            plain={current.wrap}
            className={current.wrap ? 'g7-wrap' : undefined}
            tail={okId && !current.wrap ? (
              <span className="g7-tf-tok is-born g7-probe-val">
                {t((current.items.find((x) => x.id === okId) || {}).label)}
              </span>
            ) : null}
          >
            {t(current.prompt)}
          </Expr>
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
          {/* AKKORDEON rejimi (texnik topshiriq, 8-ekran): o'quvchi qoidalarni
              BIRMA-BIR ochadi. `accordion` bo'lmasa eski kartochka ishlaydi. */}
          {card.accordion ? (
            <>
              <span className="g7-zone-cap">{t(card.badge)}</span>
              <RuleAccordion laws={card.laws} hintLabel={card.openHint} />
            </>
          ) : (
            <RuleCard
              badge={t(card.badge)}
              lawLabel={card.lawLabel ? t(card.lawLabel) : null}
              laws={card.laws ? card.laws.map((w) => ({ formula: w.formula, note: w.note ? t(w.note) : null })) : null}
              lines={(card.lines || []).map((l) => t(l))}
              example={card.example ? t(card.example) : null}
            />
          )}
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
export function SlotFill({ template, parts, answer, checkNote, wrongs, onSolved, onStep, prompt, promptCap, tightAsk, wide, disabled, audio }) {
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
    fx.tap()
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

  // `wide` -- topshiriq matni uzun bo'lgan ekran uchun (12-ekran): 660px da
  // inglizcha matn uchinchi satrga o'tib, ekran 23px oshib ketardi
  // (o'lchov 2026-08-14).
  return (
    <div className="g7-col">
      {/* Topshiriq e'loni endi UMUMIY asbob (core.jsx `Ask`): shakl bitta
          joyda turadi, ilgari o'sha razmetka bu yerda va `BracketGap` da
          ikki marta ko'chirilgan edi. */}
      <Ask kind="task" tight={tightAsk} cap={promptCap ? t(promptCap) : undefined}>{prompt ? t(prompt) : null}</Ask>
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

      <Slot mh={50}>
        {/* MARKAZDA va YIRIK. Ilgari bo'laklar chap chetda, mayda shriftda
            turardi va yozuvdan uzoqda edi -- ko'z ular orasida sakrardi
            (metodist 2026-08-14). Endi ular yozuvning TAGIDA, o'sha o'qda. */}
        <div className="g7-partsrow">
          <CallToAct kind="tap" done={correct || disabled} />
          {parts.map((p) => (
            <button
              type="button"
              key={p.id}
              className="g7-opt g7-part"
              disabled={correct || disabled}
              onClick={() => put(p.id)}
            >
              {t(p.label)}
            </button>
          ))}
        </div>
      </Slot>

      <Slot mh={46}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
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
    </div>
  )
}

// ============================================================
// RuleAccordion -- uch qoida, o'quvchi BIRMA-BIR ochadi (texnik topshiriq,
// 8-ekran). Har qoidada: formula, qisqa tushuntirish va misol.
// Bir vaqtda BITTASI ochiq: uchtasi birdan ochilsa 615px ga sig'maydi va
// diqqat ham tarqaladi.
// ============================================================
export function RuleAccordion({ laws, hintLabel }) {
  const t = useT()
  const [open, setOpen] = useState(-1)
  return (
    <div className="g7-acc">
      {laws.map((law, i) => {
        const isOpen = open === i
        return (
          <div key={i} className={'g7-acc-item' + (isOpen ? ' is-open' : '')}>
            <button
              type="button"
              className="g7-acc-head"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span className="g7-acc-formula">{law.formula}</span>
              <span className="g7-acc-sign" aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            <div className="g7-acc-body" hidden={!isOpen}>
              <p className="g7-acc-note">{t(law.note)}</p>
              {law.example ? <p className="g7-acc-ex">{law.example}</p> : null}
            </div>
          </div>
        )
      })}
      {open < 0 && hintLabel ? <CallToAct kind="tap" text={hintLabel} /> : null}
    </div>
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
// `prompt` -- TOPSHIRIQ. Qatorlar tugma ekani ham, ULARDAN QAYSI BIRI
// so'ralayotgani ham ekranda yozilmagan edi: sarlavha mavzuni ataydi,
// «birinchi xato qator» esa faqat ovozda aytilardi (metodist 2026-08-14).
// Yechilgach e'lon YO'QOLADI -- uning o'rniga isbot topshirig'i keladi
// (§6.1: yangi qadam avvalgisini almashtiradi, ustiga qo'shilmaydi).
export function AuditRows({ rows, answerId, hints, tags, proof, prompt, promptCap, onSolved, onStep, disabled, audio }) {
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
      {!solved ? <Ask kind="task" tight cap={promptCap ? t(promptCap) : undefined}>{prompt ? t(prompt) : null}</Ask> : null}
      <div className="g7-panel g7-panel-paper" style={{ display: 'flex', flexDirection: 'column', gap: solved ? 2 : 4 }}>
        {/* Qator topilgach ekranda FAQAT IKKI qator qoladi: boshlang'ich
            yozuv va topilgan qator. Qolganlari kerak emas -- isbot aynan
            shu ikkitasini solishtiradi, va ular ketgach isbot shakli
            uchun joy bo'shaydi (o'lchov 2026-08-14: beshta yirik qator
            bilan ekran 179px oshib ketardi). */}
        {(solved ? rows.filter((r, i) => i === 0 || r.id === answerId) : rows).map((row, i) => {
          const isWrongPick = wrong.indexOf(row.id) !== -1
          const isAnswer = solved && row.id === answerId
          return (
            <button
              type="button"
              key={row.id}
              className={'g7-opt' + (isAnswer ? ' g7-opt-ok' : '') + (isWrongPick ? ' g7-opt-tip' : '')}
              style={{
                fontFamily: MATH_FONT,
                /* yechilgach qatorlar KOMPAKT: ikkinchi savolga joy bo'shaydi.
                   2026-08-13: 26 -> 23. Tuzoq ekranida qatorlar ustiga qarshi
                   misol yig'ilishi qo'shiladi va noutbukda 12px oshib ketardi.
                   Kichraytirish faqat YECHILGAN holatga tegadi. */
                // Metodist qarori 2026-08-14: javobdan keyin qatorlar
                // KICHRAYMAYDI va o'lcham hamma yerdagidek -- yagona
                // son o'lchami.
                minHeight: solved ? 26 : 34,
                padding: solved ? '2px 12px' : '2px 12px',
                fontSize: solved ? 'clamp(14px, 1.7vw, 18px)' : 'var(--g7-num)',
                transition: 'min-height .4s, padding .4s, font-size .4s',
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
      {/* Qatorlar TUGMA ekani ko'rinib tursin: boshqa asboblarda bu belgi
          bor edi, bu yerda esa yo'q edi -- yozuvlar oddiy ro'yxatga
          o'xshardi. Javob berilgach belgi yo'qoladi. */}
      {/* Belgi panel bilan BIR CHIZIQDA: panel torayganda u chekkada
          osilib qolmasin. */}
      <CallToAct kind="tap" done={solved || disabled} />
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
export function SubstituteRows({ rows, numbers, question, options, onSolved, onStep, compareNote, disabled, letter = 'a', audio, okText, askFirst = false }) {
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

  // Jadval variantlar YIG'ILGANDAN keyin ko'rinadi (askFirst rejimi).
  const [rowsIn, setRowsIn] = useState(false)
  useEffect(() => {
    if (!askFirst) { setRowsIn(true); return undefined }
    if (!picked) return undefined
    const tmr = setTimeout(() => setRowsIn(true), 620)
    return () => clearTimeout(tmr)
  }, [askFirst, picked])

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
    // askFirst -- 7-ekran naqshi: AVVAL savol, javobdan KEYIN qatorlar.
    // Shunda son qo'yish javobni OSHKOR QILMAYDI, balki uni ISBOTLAYDI.
    if (askFirst && !rowsIn) return undefined
    if (n === null || shown >= rows.length || disabled) return undefined
    const tmr = setTimeout(revealNext, shown === 0 ? 420 : 620)
    return () => clearTimeout(tmr)
  }, [n, shown, disabled, rowsIn]) // eslint-disable-line react-hooks/exhaustive-deps

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

      {/* askFirst rejimida tekshirish jadvali JAVOBDAN KEYIN chiqadi: shunda
          u javobni oshkor qilmaydi VA joyni band qilmaydi (615px noutbukda
          to'rt variant bilan birga 46px oshib ketardi).
          KECHIKISH shart: variantlar yig'ilishi 0,5 s davom etadi, jadval
          esa darrov chiqsa, o'sha lahzada ekran 30px oshib ketadi. */}
      <div className="g7-zone" style={{ gap: 4, display: askFirst && !rowsIn ? 'none' : undefined }}>
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

      {allShown || askFirst ? (
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
  // Qo'shilayotgan JUFT: to'g'ri amaldan keyin 420 ms davomida shu juft
  // bir-biriga siljiydi, so'ng yangi qator keladi.
  const [merging, setMerging] = useState(null)
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
      fx.right()
      // JUFT AVVAL QO'SHILADI, keyin yangi qator keladi. Bu darsning bitta
      // qo'l yozuvi: kadrlarda va yo'laklarda ikkita son bir-biriga siljib
      // BITTA songa aylanadi, bu yerda esa shu paytgacha qator shunchaki
      // paydo bo'lardi. Endi hamma joyda bir xil: hisoblash KO'RINADI.
      setMerging(part)
      setTimeout(() => {
        setMerging(null)
        const next = lines.concat(step.to)
        setLines(next)
        setPart(null)
        setHint(null)
        if (onStep) onStep('step' + next.length)
        if (next.length - 1 >= steps.length && onSolved) {
          onSolved({ correct: true, lines: next, attempts: misses + 1, tags })
        }
      }, 420) // §7.1: yozuv ICHIDAGI harakatning belgilangan vaqti
      return
    }
    const w = (step.wrongs || []).find((x) => x.action === actionId)
    fail(w ? w.hint : null, w ? w.tag : null)
  }

  return (
    <>
      {/* Topshiriq e'loni umumiy `Ask` bilan -- darsdagi qolgan ekranlar
          kabi. Ilgari bu yerda o'z razmetkasi turardi: yorliqsiz va
          kartochkali, ya'ni boshqa ekranlardan farq qilardi va balandroq edi. */}
      {!finished ? <Ask kind="task" tight>{t(part ? UI.askAct : UI.askPart)}</Ask> : null}
      {/* Ramka YIRIKROQ: qatorlar markazda va ular uchun joy oldindan band. */}
      {/* Balandlik OLDINDAN band: o'tgan qatorlar ixcham (27px), joriy qator
          yirik (46px), pastda esa bo'sh qator uchun joy. Panel to'ladi,
          O'SMAYDI (§6.1). */}
      <Slot mh={steps.length * 36 + 64} style={{ alignItems: 'stretch', justifyContent: 'flex-start' }}>
      <div className="g7-panel g7-panel-paper" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Qatorlar SODDA: yozuv va boshqa hech narsa. 2026-08-13 da bu yerga
            o'qituvchi gapi qo'shib ko'rildi va qator flex-konteynerga o'raldi --
            natijada noutbukda 133px oshib ketdi. Gap 4-ekranda, alohida
            `SolutionSteps` blokida qoladi: u yerda o'lchov toza. */}
        {lines.map((line, i) => {
          const live = !finished && i === lines.length - 1
          if (!live) {
            // O'TGAN QATORLAR IXCHAM. Ilgari hamma qator bir xil yirik edi va
            // panel har qadamda o'sardi: 170 -> 214 -> 258px, noutbukda 65px
            // oshib ketardi (o'lchov 2026-08-14 -- obhod buni ko'rmagan,
            // chunki u asbobni oxirigacha to'g'ri o'tmaydi).
            // Ixchamlashtirish METODIK jihatdan ham to'g'ri: ish JORIY
            // qatorda ketadi, o'tganlari esa daftardagidek yuqorida turadi.
            return (
              <div key={i} className={'g7-expr g7-expr-row g7-tf-past' + (i === lines.length - 1 && i > 0 ? ' g7-pop' : '')}>
                <Fx>{line}</Fx>
              </div>
            )
          }
          // FAOL QATOR: o'quvchi CHIPSNI emas, YOZUVNING O'ZINI bosadi.
          // Amal belgisini bosish uning IKKI YONIDAGI sonni ham oladi -- ya'ni
          // «juftni tanlash» bitta harakat. Ilgari bu ikkita alohida savol edi
          // (mayda chipslar va uchta tugma), va o'quvchi nimaga javob
          // berayotganini tushunmasdi (metodist surati 2026-08-13).
          const toks = String(line).split(' ')
          // Qavs songa YOPISHIB keladi: «(12», «2)». Juftni solishtirishda u
          // olib tashlanadi, aks holda «12 − 4» hech qachon mos kelmaydi va
          // qavsli ekran (10-ekran) QOTIB qoladi -- metodist 2026-08-13 da
          // aynan shuni topdi.
          const bare = (x) => String(x === undefined ? '' : x).replace(/[()]/g, '')
          const trioAt = (k) => [bare(toks[k - 1]), toks[k], bare(toks[k + 1])].join(' ')
          return (
            <div key={i} className="g7-expr g7-expr-row g7-tf-live" style={{ minHeight: 31 }}>
              {toks.map((tok, k) => {
                const isOp = ['+', '−', '·', ':'].indexOf(tok) !== -1
                const trio = isOp ? trioAt(k) : null
                const can = isOp && currentParts.indexOf(trio) !== -1
                const inPart = part && trio && part === trio
                const lit = part && (part === trio || (!isOp && ((toks[k + 1] && part === trioAt(k + 1)) || (toks[k - 1] && part === trioAt(k - 1)))))
                // Qo'shilish: chap son o'ngga, o'ng son chapga siljiydi,
                // belgi esa ular bilan birga so'nadi.
                const mL = merging && toks[k + 1] && merging === trioAt(k + 1)
                const mR = merging && toks[k - 1] && merging === trioAt(k - 1)
                const mOp = merging && trio && merging === trio
                const mCls = mL ? ' is-mergeL' : mR ? ' is-mergeR' : mOp ? ' is-mergeOp' : ''
                return can ? (
                  <button
                    key={k}
                    type="button"
                    className={'g7-tf-op' + (inPart ? ' is-picked' : '') + (!part && !disabled ? ' is-hint' : '') + mCls}
                    disabled={disabled || !!merging}
                    onClick={() => { fx.tap(); setPart(trio); setHint(null) }}
                  >
                    {tok}
                  </button>
                ) : (
                  <span key={k} className={'g7-tf-tok' + stageOf(tok) + (lit ? ' is-lit' : '') + mCls}>{tok}</span>
                )
              })}
            </div>
          )
        })}
      </div>
      </Slot>


      <Slot mh={72}>
        {!finished && part ? (
          <div className="g7-shakebox" style={{ width: '100%' }}>
            <div key={shake} className={shake ? 'g7-shake' : undefined}>
              <Options
                items={actions.map((a) => ({ id: a.id, label: t(a.label) }))}
                picked={null}
                wrong={[]}
                onPick={(o) => act(o.id)}
                disabled={disabled}
                cols={3}
                minH={40}
                collapse={false}
                badges={false}
              />
            </div>
          </div>
        ) : finished && footNote ? (
          /* FAQAT yakunda. Ilgari bu satr birinchi soniyadan turardi va
             o'quvchi hali hech nima hisoblamasdan «Qiymat topildi» degan
             yozuvni o'qirdi (metodist surati 2026-08-14). */
          <Expr size="sm">{footNote}</Expr>
        ) : null}
      </Slot>

      <Slot mh={58}>
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

// ============================================================================
// UCHTA YANGI ASBOB (2026-08-13, metodist qarori). 1-4-sinf darslaridan
// ko'chirilgan usullar, 7-sinf kontraktiga moslangan.
//
//   StepOrder   -- o'quvchi amallar tartibini YOZUVNING O'ZIDA belgilaydi,
//                  asbob esa UNING tartibi bo'yicha hisoblaydi va natijani
//                  qoida bo'yicha natija bilan yonma-yon qo'yadi.
//                  (4-sinf DividerPlacement usuli: qo'l yozuvning ichida)
//   BracketGap  -- o'quvchi qavsni yozuv ichidagi tirqishga qo'yadi.
//                  (o'sha 4-sinf usuli, ajratgich o'rniga qavs)
//   RuleBuilder -- qoidani o'quvchi bo'laklardan YIG'ADI, tayyor kartochkani
//                  o'qimaydi. (4-sinf RuleBuilderScreen)
//
// Uchalasi ham 5.1 qoidalariga bo'ysunadi: «javobni ko'rsatish» tugmasi YO'Q,
// asbob faqat o'quvchi qadam qo'ygandan KEYIN ishga tushadi, oxirgi qatorni
// asbob yozmaydi.
//
// ARIFMETIKA SHU YERDA. Asbob javobni jadvaldan qidirmaydi, HISOBLAYDI --
// shuning uchun uni istalgan darsga istalgan son bilan berish mumkin.
// ============================================================================

const STAGE2 = ['·', ':']
// Belgi qaysi bosqichda ekanini QAYTARADI. Rang shu yerdan keladi, ya'ni
// bitta joydan: yozuv, yo'lak va kino bir xil bo'yaladi.
// KO'RSATUVCHI QURILMA. Metodist qarori 2026-08-13: «sichqoncha tortadi,
// barmoq bosadi». Sabab -- telefonda tortish sahifa SKROLLI bilan raqobat
// qiladi va brauzer ko'pincha jestni o'zi olib qo'yadi: o'quvchi qavsni emas,
// ekranni tortadi. Shuning uchun tortish FAQAT aniq ko'rsatuvchi qurilmada
// (sichqoncha) yoqiladi, barmoqda esa avvalgidek bosish qoladi.
export const canDrag = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

export const stageOf = (tok) => (STAGE2.indexOf(tok) !== -1 ? ' is-s2' : (tok === '+' || tok === '−' ? ' is-s1' : ''))

const applyOp = (a, op, b) => {
  if (op === '+') return a + b
  if (op === '−') return a - b
  if (op === '·') return a * b
  if (op === ':') return b === 0 ? NaN : a / b
  return NaN
}

// Qoida bo'yicha: avval II bosqich chapdan o'ngga, so'ng I bosqich chapdan o'ngga.
export const evalByRule = (nums, ops) => {
  const n = nums.slice()
  const o = ops.slice()
  for (let i = 0; i < o.length;) {
    if (STAGE2.indexOf(o[i]) !== -1) {
      n.splice(i, 2, applyOp(n[i], o[i], n[i + 1]))
      o.splice(i, 1)
    } else i++
  }
  while (o.length) {
    n.splice(0, 2, applyOp(n[0], o[0], n[1]))
    o.splice(0, 1)
  }
  return n[0]
}

// O'quvchi bergan tartib bo'yicha: `order` -- amal indekslari bosilgan navbatda.
export const evalByOrder = (nums, ops, order) => {
  const n = nums.slice()
  const live = ops.map((op, i) => ({ op, i }))
  order.forEach((opIdx) => {
    const pos = live.findIndex((x) => x.i === opIdx)
    if (pos === -1) return
    n.splice(pos, 2, applyOp(n[pos], live[pos].op, n[pos + 1]))
    live.splice(pos, 1)
  })
  return n[0]
}

// Qavs `from..to` (nums indekslari, ikki chekkasi ham kiradi) ichini oladi.
export const evalWithBracket = (nums, ops, from, to) => {
  const inner = evalByRule(nums.slice(from, to + 1), ops.slice(from, to))
  const n = nums.slice(0, from).concat([inner], nums.slice(to + 1))
  const o = ops.slice(0, from).concat(ops.slice(to))
  return evalByRule(n, o)
}

// Butun son butun bo'lib qoladi; kasr uch xonagacha, RU va UZ da VERGUL bilan
// (darslik ham vergul yozadi, 12-bet), EN da nuqta bilan.
export const fmtNum = (v, lang) => {
  if (v === null || v === undefined || !isFinite(v)) return '—'
  const r = Math.round(v * 1000) / 1000
  const s = String(r)
  return lang === 'en' ? s : s.replace('.', ',')
}

const exprText = (nums, ops, labels) =>
  nums.map((x, i) => {
    const s = labels && labels[i] !== undefined ? labels[i] : String(x)
    return i ? ' ' + ops[i - 1] + ' ' + s : s
  }).join('')

// ============================================================
// StepOrder -- amallar tartibini o'quvchi belgilaydi.
// Amal belgisini bosish unga NAVBAT RAQAMINI beradi. Hamma raqam qo'yilgach
// asbob ikkita sonni yonma-yon qo'yadi: o'quvchi tartibi va qoida tartibi.
// Bu 1-dars uchun SON GUVOHINING o'rnini bosadi: darsda harf yo'q, shuning
// uchun son qo'yish emas, IKKI TARTIB bilan qayta hisoblash ishlatiladi
// (PODXOD_7SINF.md §9).
// ============================================================
// `prompt` -- TOPSHIRIQ. Bu asbobda «to'g'ri javob» yo'q, shuning uchun
// o'quvchi undan nima kutilayotganini o'zi taxmin qila olmaydi: belgilarni
// bosish kerakligini ham, ularni QAYSI MA'NODA bosishini ham (hisoblash
// navbati) faqat ovoz aytardi. Ovoz o'chiq bo'lsa ekran jim edi.
export function StepOrder({
  nums, ops, ruleOrder, yoursLabel, ruleLabel, note, sameNote, tag, prompt,
  onSolved, onStep, disabled, audio,
}) {
  const t = useT()
  const lang = useLang()
  const fx = useAnswerFx(audio)
  const [order, setOrder] = useState([])
  const [fired, setFired] = useState(false)
  // Sichqoncha amal ustida bo'lsa, uning IKKI SONI yoritiladi: amal nimani
  // biriktirishini ko'rsatadi, lekin QAYSI BIRI birinchi ekanini AYTMAYDI.
  // Telefonda hover yo'q -- u yerda bosish o'zi shu ishni bajaradi.
  const [hoverOp, setHoverOp] = useState(null)

  const done = order.length === ops.length
  // Sonlarni endi YO'LAKLAR o'zi hisoblaydi va ko'rsatadi (CollapseTrack),
  // shuning uchun bu yerda ular saqlanmaydi. Faqat TARTIBLAR solishtiriladi.
  const same = done && order.join(',') === (ruleOrder || []).join(',')

  useEffect(() => {
    if (!done || fired) return
    setFired(true)
    fx.right()
    if (onStep) onStep('done')
    // Bu ekranda «xato javob» yo'q: har ikkala tartib ham ko'rsatiladi.
    // Teg esa o'quvchi qoidadan boshqa tartib qo'ygan bo'lsa yoziladi --
    // aynan o'sha yanglish tushuncha ishga tushgan bo'ladi (§8.5).
    if (onSolved) onSolved({ correct: true, attempts: 1, tags: !same && tag ? [tag] : [] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, fired])

  const tapOp = (i) => {
    if (disabled || done) return
    if (order.indexOf(i) !== -1) return
    fx.tap()
    setOrder((prev) => prev.concat(i))
  }

  const reset = () => {
    if (disabled) return
    setOrder([])
    setFired(false)
  }

  return (
    <>
      {/* Topshiriq YECHILGANDAN KEYIN HAM qoladi (§5.3: ekranga qaytgan
          o'quvchi savolni va o'z javobini ko'radi). Tor shakl: bu ekranda
          ikkita yo'lak va izoh uchun joy oldindan band qilingan. */}
      <Ask kind="task" tight>{prompt ? t(prompt) : null}</Ask>
      <div className="g7-panel g7-panel-paper g7-steporder">
        <div className="g7-so-row">
          {nums.map((x, i) => (
            <React.Fragment key={'n' + i}>
              {i ? (
                <button
                  type="button"
                  className={'g7-so-op' + stageOf(ops[i - 1]) + (order.indexOf(i - 1) !== -1 ? ' is-set' : '')}
                  disabled={disabled || done || order.indexOf(i - 1) !== -1}
                  onClick={() => tapOp(i - 1)}
                  onMouseEnter={() => setHoverOp(i - 1)}
                  onMouseLeave={() => setHoverOp(null)}
                  onFocus={() => setHoverOp(i - 1)}
                  onBlur={() => setHoverOp(null)}
                  aria-label={ops[i - 1]}
                >
                  <span className={'g7-so-sign' + stageOf(ops[i - 1])}>{ops[i - 1]}</span>
                  <span className="g7-so-num">
                    {order.indexOf(i - 1) !== -1 ? order.indexOf(i - 1) + 1 : ''}
                  </span>
                </button>
              ) : null}
              <span className={'g7-so-val' + (hoverOp !== null && (hoverOp === i || hoverOp === i - 1) ? ' is-lit' : '')}>{x}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* QADAM HISOBI. Metodist 2026-08-14: bosgandan keyin nima
          bo'lganini ko'rish kerak edi -- belgi burchagida 11 px raqam
          yetarli emas. Endi «qadam 1 / 3» yozuv ostida turadi. */}
      {/* Tartib qo'yilgach bu qator KERAK EMAS: belgi ham, hisoblagich ham,
          «Qaytadan» ham. Bo'sh 34px esa layfxak yangi shaklga o'tgach
          budjetdan chiqib ketardi (o'lchov 2026-08-14, 3-ekran +3px).
          Ekran QISQARADI, o'smaydi -- §6.1 buni taqiqlamaydi. */}
      <Slot mh={done ? 0 : 34}>
        <div className="g7-so-bar" style={done ? { display: 'none' } : undefined}>
          <CallToAct kind="tap" done={done || disabled} />
          <span className="g7-so-count">
            {t(UI.step)} {Math.min(order.length + (done ? 0 : 1), ops.length)} / {ops.length}
          </span>
          {order.length && !done ? (
            <Btn tone="ghost" onClick={reset}>{t(UI.again)}</Btn>
          ) : null}
        </div>
      </Slot>

      {/* Ikki YO'LAK BIRINCHI soniyadan joy egallaydi: ekran «o'sib» ketmaydi,
          faqat to'ladi (§6.1). Ikkalasi BIR VAQTDA yig'iladi -- ma'no aynan
          ularning AJRALIB ketishida, shuning uchun ular yonma-yon ketishi
          kerak, navbat bilan emas. */}
      {/* IKKI YO'LAK BIRINCHI soniyadan KO'RINADI, bo'sh bo'lsa ham.
          Metodist 2026-08-14: ilgari bu yer javobgacha BO'SH turardi va
          o'quvchi nima uchun bosayotganini bilmasdi. Endi u nima to'lishini
          oldindan ko'radi: o'z tartibi va qoida tartibi. */}
      <Slot mh={96}>
        <div className="g7-so-out">
          {done ? (
            <>
              <CollapseTrack nums={nums} ops={ops} order={order} label={t(yoursLabel)} tone="tip" />
              <CollapseTrack nums={nums} ops={ops} order={ruleOrder || order} label={t(ruleLabel)} tone="ok" />
            </>
          ) : (
            <>
              <div className="g7-so-out-row is-wait">
                <span className="g7-so-out-cap">{t(yoursLabel)}</span>
                <span className="g7-so-wait">{'—'}</span>
              </div>
              <div className="g7-so-out-row is-rule is-wait">
                <span className="g7-so-out-cap">{t(ruleLabel)}</span>
                <span className="g7-so-wait">{'—'}</span>
              </div>
            </>
          )}
        </div>
      </Slot>

      <Slot mh={58}>
        {done ? (
          <Feedback show ok={!same} tone={same ? 'neutral' : undefined}>
            {same ? t(sameNote || note) : t(note)}
          </Feedback>
        ) : null}
      </Slot>
    </>
  )
}

// ============================================================
// BracketGap -- qavsni yozuv ichiga QO'YISH. 4-sinfdagi ajratgich usuli:
// o'quvchi tayyor yozuvlardan birini TANLAMAYDI, qavsni o'zi qo'yadi.
// Shu sababli bu ekran «to'rt variantdan bittasi» kvotasiga KIRMAYDI.
//
// Tirqishlar: 0 dan nums.length gacha. Birinchi bosish -- ochuvchi qavs,
// ikkinchisi -- yopuvchi. `answer` {from, to}: qavs nums[from..to] ni oladi.
// ============================================================
export function BracketGap({ rounds, onSolved, onStep, disabled, audio }) {
  const t = useT()
  const lang = useLang()
  const fx = useAnswerFx(audio)
  const [ri, setRi] = useState(0)
  const [open, setOpen] = useState(null)
  const [okRounds, setOkRounds] = useState([])
  const [hint, setHint] = useState(null)
  const [tags, setTags] = useState([])
  const [misses, setMisses] = useState(0)

  const r = rounds[ri]
  const finished = ri >= rounds.length

  const settle = (from, to) => {
    const value = evalWithBracket(r.nums, r.ops, from, to)
    const key = from + '-' + to
    const hit = from === r.answer.from && to === r.answer.to
    if (hit) {
      fx.right()
      const row = '( ' + exprText(r.nums.slice(from, to + 1), r.ops.slice(from, to), r.labels && r.labels.slice(from, to + 1)) + ' ) → ' + fmtNum(value, lang)
      setOkRounds((prev) => prev.concat(row))
      setHint(null)
      setOpen(null)
      const next = ri + 1
      setRi(next)
      if (onStep) onStep('ok' + (ri + 1))
      if (next >= rounds.length && onSolved) {
        onSolved({ correct: true, attempts: misses + 1, tags })
      }
      return
    }
    const h = (r.hints && r.hints[key]) || (r.hints && r.hints['*']) || null
    const tg = (r.tagsBy && r.tagsBy[key]) || r.tag || null
    if (tg) setTags((prev) => (prev.indexOf(tg) === -1 ? prev.concat(tg) : prev))
    setMisses((m) => m + 1)
    setHint(h)
    setOpen(null)
    fx.wrong(h)
  }


  return (
    <>
      {okRounds.map((row, i) => <DoneRow key={i}>{row}</DoneRow>)}

      {!finished ? (
        <>
          <Ask kind="task">{r.prompt ? t(r.prompt) : null}</Ask>

          <div className="g7-panel g7-panel-paper g7-brgap">
            <div className="g7-so-row">
              {/* Tirqishlar IKKI XIL. Ochuvchi qavs son OLDIDA, yopuvchi esa
                  son ORTIDA -- BELGIDAN OLDIN. Ilgari ikkalasi ham son oldida
                  turardi va yopuvchi qavs belgidan KEYIN tushardi:
                  «18 − 6 : ) 3» -- matematik jihatdan ma'nosiz yozuv
                  (metodist surati 2026-08-13). */}
              {/* BO'SH TIRQISH JOY EGALLAMAYDI (metodist surati 2026-08-14).
                  Ilgari har tirqish 26px turardi qachonki u bo'sh bo'lsa ham,
                  va yozuv uzilib ketardi: 18 [bo'shliq] − [.] 6 [bo'shliq] : ...
                  Endi tirqish faqat KERAK bo'lganda ochiladi:
                    ochuvchi  -- qavs qo'yilmagunicha hammasi,
                                 qo'yilgach faqat TANLANGANI qoladi;
                    yopuvchi  -- faqat ochuvchidan O'NGDAGILARI.
                  Qolgani nolga yig'iladi, ya'ni yozuv zich turadi. */}
              {r.nums.map((x, i) => {
                const openOn = open === null || open === i
                const closeOn = open !== null && i >= open
                return (
                <React.Fragment key={'b' + i}>
                  <button
                    type="button"
                    className={'g7-brgap-slot' + (open === i ? ' is-open' : '') + (open === null && !disabled ? ' is-hint' : '') + (openOn ? '' : ' is-idle')}
                    /* Qo'yilgan ochuvchi qavsni BOSIB OLIB TASHLASH mumkin.
                       Ilgari u qulflanardi: o'quvchi noto'g'ri joyni tanlasa,
                       fikridan qaytolmasdi va MAJBURAN xato javob berardi
                       (metodist 2026-08-14: «ya oshibayus kuda stavit»). */
                    disabled={disabled || (open !== null && open !== i)}
                    onClick={() => { fx.tap(); setHint(null); setOpen(open === i ? null : i) }}
                    aria-label="("
                    aria-hidden={openOn ? undefined : 'true'}
                    tabIndex={openOn ? undefined : -1}
                  >
                    {/* Tirqishda NUQTA emas, XIRA QAVS turadi. Nuqta darsdagi
                        KO'PAYTIRISH belgisi bilan bir xil edi va o'quvchi
                        «· 3» ni «uchga ko'paytirish» deb o'qirdi -- ko'z
                        chalg'irdi va qavs noto'g'ri joyga qo'yilardi
                        (metodist surati 2026-08-14). Xira qavs esa darrov
                        aytadi: bu yerga QAVS qo'yiladi. */}
                    <span>{open === i ? '(' : (open === null ? '(' : '')}</span>
                  </button>
                  <span className="g7-so-val">{r.labels && r.labels[i] !== undefined ? r.labels[i] : x}</span>
                  <button
                    type="button"
                    className={'g7-brgap-slot' + (closeOn ? ' is-close is-hint' : ' is-idle')}
                    disabled={disabled || !closeOn}
                    onClick={() => { if (closeOn) settle(open, i) }}
                    aria-label=")"
                    aria-hidden={closeOn ? undefined : 'true'}
                    tabIndex={closeOn ? undefined : -1}
                  >
                    <span>{closeOn ? ')' : ''}</span>
                  </button>
                  {i < r.nums.length - 1 ? (
                    <span className="g7-so-sign g7-so-sign-flat">{r.ops[i]}</span>
                  ) : null}
                </React.Fragment>
                )
              })}
            </div>
          </div>

          <Slot mh={30}>
            <CallToAct kind="tap" done={disabled} />
          </Slot>

          {/* Qavssiz qiymat BIRINCHI soniyadan turadi: o'quvchi nimadan
              boshlaganini ko'rib tursin. */}
          {/* Proza HINT bilan chiqadi, Expr bilan EMAS: `.g7-expr` monoshrift va
              `white-space: nowrap`, ya'ni gap chetga chiqib KO'RINMAY qolardi
              (ETALON_7SINF.md §6.2). Faqat matematika monoshrift bilan. */}
          <Slot mh={30}>
            {r.baseNote ? <Hint>{t(r.baseNote)}</Hint> : null}
          </Slot>
        </>
      ) : null}

      <Slot mh={62}>
        <Feedback show={!!hint} ok={false}>{hint ? t(hint) : null}</Feedback>
      </Slot>
    </>
  )
}

// ============================================================
// RuleBuilder -- qoidani o'quvchi YIG'ADI (4-sinf usuli). Tayyor kartochka
// to'g'ri yig'ilgandan KEYIN ochiladi va yig'ish maydonini ALMASHTIRADI:
// ikkalasi birga 400px ga sig'maydi (§6.1, «yangi qadam avvalgisini
// almashtiradi»).
// ============================================================
// `help` -- BIRINCHI xatodan KEYIN ochiladigan lug'at (metodist qarori
// 2026-08-13). §8.4: yordam urinishlar bo'yicha o'sadi va JAVOBNI ochmaydi.
// Bosqichlar lug'ati javob emas: tartibni u aytmaydi, faqat qaysi amal qaysi
// bosqichda ekanini eslatadi.
export function RuleBuilder({
  fragments, answer, wrongHint, tag, rule, after, help, onSolved, onStep, disabled, audio,
}) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [built, setBuilt] = useState([])
  const [solved, setSolved] = useState(false)
  const [hint, setHint] = useState(null)
  const [misses, setMisses] = useState(0)

  // Variantlar har kirishda aralashadi (§8.3).
  const shuffled = useMemo(() => {
    const a = fragments.slice()
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp
    }
    return a
  }, [fragments])

  const complete = built.length === answer.length

  const [dragOn] = useState(() => canDrag())
  const [over, setOver] = useState(false)

  // ZANJIR (metodist qarori 2026-08-13). Ilgari o'quvchi beshta bo'lakni
  // BIR YO'LA tartiblardi -- bu 120 ta variant, va yordam faqat xatodan keyin
  // kelardi. Endi har qadamda BITTA savol: «keyin nima?». Qolgan bo'laklar
  // variant bo'lib turadi, to'g'risi qatorga qo'shiladi, xatosi izoh beradi.
  // Qadamlar oson, natija esa o'sha -- qoidani o'quvchi O'ZI yig'adi.
  const add = (id) => {
    if (disabled || solved || built.indexOf(id) !== -1) return
    if (id === answer[built.length]) {
      setHint(null)
      const next = built.concat(id)
      setBuilt(next)
      if (next.length === answer.length) {
        setSolved(true)
        fx.right()
        if (onStep) onStep('ok')
        if (onSolved) onSolved({ correct: true, attempts: misses + 1, tags: misses && tag ? [tag] : [] })
      }
      return
    }
    setMisses((m) => m + 1)
    setHint(wrongHint || null)
    fx.wrong(wrongHint)
  }

  // Tortish HTML5 drag bilan: u faqat sichqonchada yoqiladi, shuning uchun
  // telefondagi skroll bilan raqobatga umuman kirmaydi.
  const dragProps = (id) => (dragOn ? {
    draggable: !disabled && !solved,
    onDragStart: (e) => { e.dataTransfer.setData('text/plain', id); e.dataTransfer.effectAllowed = 'move' },
  } : {})

  const dropProps = dragOn ? {
    onDragOver: (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (!over) setOver(true) },
    onDragLeave: () => setOver(false),
    onDrop: (e) => { e.preventDefault(); setOver(false); add(e.dataTransfer.getData('text/plain')) },
  } : {}

  const drop = (id) => {
    if (disabled || solved) return
    setHint(null)
    setBuilt((prev) => prev.filter((x) => x !== id))
  }

  const check = () => {
    if (built.join('|') === answer.join('|')) {
      setSolved(true)
      fx.right()
      if (onStep) onStep('ok')
      if (onSolved) onSolved({ correct: true, attempts: misses + 1, tags: misses && tag ? [tag] : [] })
      return
    }
    setMisses((m) => m + 1)
    setHint(wrongHint || null)
    fx.wrong(wrongHint)
  }

  const labelOf = (id) => {
    const f = fragments.find((x) => x.id === id)
    return f ? t(f.label) : ''
  }

  if (solved) {
    return (
      <>
        {/* Yig'ilgan zanjir satri OLIB TASHLANDI (metodist 2026-08-14):
            javob chiqqach u kerak emas -- o'sha gap qoida kartochkasida
            yana bir marta turadi, faqat darslik so'zlari bilan. Ikkitasi
            birga esa ekranning yarmini yeb qo'yardi. */}
        <RuleCard {...rule} />
        {after}
      </>
    )
  }

  return (
    <>
      <div className={'g7-panel g7-panel-paper g7-rb-built' + (over ? ' is-over' : '') + (dragOn ? ' is-drag' : '')} {...dropProps}>
        {built.length ? (
          built.map((id, i) => (
            <button
              type="button"
              key={id}
              className="g7-rb-chip is-built"
              disabled={disabled}
              onClick={() => drop(id)}
            >
              <span className="g7-rb-no">{i + 1}</span>
              {labelOf(id)}
            </button>
          ))
        ) : (
          /* Bo'sh maydon endi NIMA uchun turganini AYTADI. Ilgari u yerda
             uchta nuqta turardi va o'quvchi ramka nima ekanini tushunmasdi
             (metodist 2026-08-14). Endi: gap, va uning oxirida yozuv
             kursori miltillaydi -- «bu yerga yozilyapti» degan tanish
             ishora. */
          <span className="g7-rb-empty">
            {t(UI.ruleHere)}
            <i className="g7-rb-caret" aria-hidden="true" />
          </span>
        )}
      </div>

      <div className="g7-zone" style={{ gap: 4, paddingBottom: 6 }}>
        <p className="g7-qpill">{t(built.length ? UI.ruleNext : UI.ruleFirst)}</p>
      </div>
      <Slot mh={104}>
        <div className="g7-rb-pool">
          <CallToAct kind="tap" done={complete || disabled} />
          {/* Har qadamda FAQAT IKKI variant: to'g'risi va bitta yaqin xatosi
              (metodist qarori 2026-08-13). Beshta bo'lakni birdan ko'rish
              o'quvchini bosib qo'yardi. Xato variant qolganlardan olinadi,
              ya'ni u har doim ishonarli. */}
          {shuffled
            .filter((f) => built.indexOf(f.id) === -1)
            .filter((f, _i, rest) => {
              const right = answer[built.length]
              if (f.id === right) return true
              const others = rest.filter((x) => x.id !== right)
              return others.length ? others[built.length % others.length].id === f.id : false
            })
            .map((f) => (
            <button
              type="button"
              key={f.id}
              className="g7-rb-chip"
              disabled={disabled || built.indexOf(f.id) !== -1}
              onClick={() => add(f.id)}
              {...dragProps(f.id)}
            >
              {t(f.label)}
            </button>
          ))}
        </div>
      </Slot>


      <Slot mh={56}>
        <Feedback show={!!hint} ok={false}>{hint ? t(hint) : null}</Feedback>
      </Slot>

      {misses > 0 && help ? help : null}
    </>
  )
}

// ============================================================
// HookMachines -- XUK SAHNASI. Metodist qarori 2026-08-13: 1-ekranda sahna
// bo'lishi va u HARAKATLANISHI kerak (1-4-sinf naqshi: elementlar kaskad
// bilan kiradi va keyin «yashaydi»).
//
// Sahna JUMBOQ QO'YADI, uni YECHMAYDI. Ikkala mashina bir xil ko'rinadi,
// hech biri to'g'ri deb belgilanmaydi, hisoblash TARTIBI ko'rsatilmaydi --
// aks holda 1-ekrandagi taxminning ma'nosi qolmaydi (§6.5: xukda na ball,
// na yashil rang, na belgi).
//
// Personaj YO'Q (§7.4). Rasm fayli ham yo'q -- faqat SVG va CSS.
// ============================================================
// YETTI SEGMENTLI RAQAM. Shrift EMAS, GEOMETRIYA: har raqam yettita
// ko'pburchak. Sababi ikkita. Birinchi -- haqiqiy kalkulyator ko'rinishi
// aynan shunday chiqadi, o'chgan segmentlar ham xira ko'rinib turadi.
// Ikkinchi -- xususiy shrift ishlatish TAQIQLANGAN (CLAUDE.md §5), o'zimiz
// chizgan shakl esa hech kimga tegishli emas.
const SEG_ON = {
  '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc',
  '5': 'afgcd', '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg',
  '-': 'g', '−': 'g', ' ': '',
}
// Katak 22 x 38, qalinlik 4. Nuqtalar qo'lda emas, bitta jadvaldan.
const SEG_PTS = {
  a: '4,1 18,1 15,5 7,5',
  b: '19,2 19,17 15.5,14.5 15.5,6',
  c: '19,21 19,36 15.5,32 15.5,23.5',
  d: '4,37 18,37 15,33 7,33',
  e: '3,21 3,36 6.5,32 6.5,23.5',
  f: '3,2 3,17 6.5,14.5 6.5,6',
  g: '4,19 18,19 15,22 7,22',
}
function SegDigit({ ch, x, y, scale = 1 }) {
  const on = SEG_ON[ch] === undefined ? 'abcdefg' : SEG_ON[ch]
  return (
    <g transform={'translate(' + x + ',' + y + ') scale(' + scale + ')'}>
      {Object.keys(SEG_PTS).map((k) => (
        <polygon
          key={k}
          /* `g7-lcdseg`, `g7-seg` EMAS. Eski nom yuqori paneldagi progress
             bo'laklari bilan URISHARDI, va telefon uslublarida o'sha nom
             `display: none` bilan yopilardi -- ya'ni TELEFONDA kalkulyator
             raqamlari umuman ko'rinmasdi. Xuk esa aynan «sonlar farq qildi»
             ustiga qurilgan: telefonda darsning birinchi ekrani ma'nosini
             yo'qotardi (2026-08-14 o'lchovi, 860px dan pastda). */
          className={'g7-lcdseg' + (on.indexOf(k) !== -1 ? ' is-on' : '')}
          points={SEG_PTS[k]}
        />
      ))}
    </g>
  )
}

// Sonni segmentli raqamlarga yoyadi va O'NGGA tekislaydi -- kalkulyatorda
// son har doim o'ng chetdan boshlanadi.
function SegNumber({ value, cx, y, scale = 1, cells = 3 }) {
  const s = String(value)
  const w = 26 * scale
  const chars = s.split('')
  const pad = cells - chars.length
  const all = (pad > 0 ? Array(pad).fill(' ') : []).concat(chars)
  const total = all.length * w
  const x0 = cx - total / 2
  return (
    <g>
      {all.map((ch, i) => (
        <SegDigit key={i} ch={ch} x={x0 + i * w} y={y} scale={scale} />
      ))}
    </g>
  )
}

// `fix` -- YAKUNDAGI intreaktiv. O'quvchi oddiy kalkulyatorni BOSADI, u
// qoida bo'yicha qayta hisoblaydi: sakkiz yigirmaga aylanadi, «teng emas»
// esa «teng» bo'ladi. Dars o'quvchi mashinani O'RGATGANI bilan tugaydi.
// Tugma alohida qatorda EMAS -- yakunning balandlik budjetida bo'sh qator
// yo'q, shuning uchun bosiladigan narsa mashinaning O'ZI.
//   fix = { value, sign, hint, doneHint, onFix }
export function HookMachines({ tokens, left, right, sign = '≠', fix }) {
  const t = useT()
  const [fixed, setFixed] = useState(false)
  const n = tokens.length
  const step = 34
  const x0 = 310 - ((n - 1) * step) / 2
  const canFix = !!fix && !fixed
  const leftVal = fixed && fix ? fix.value : left.value
  const shownSign = fixed && fix && fix.sign ? fix.sign : sign
  const doFix = () => {
    if (!canFix) return
    setFixed(true)
    if (fix.onFix) fix.onFix()
  }
  return (
    /* Topshiriq satri sahnaning TASHQARISIDA turadi. Ilgari u `g7-hookscene`
       ICHIDA edi, o'sha blokda esa `max-height` bor: sahna balandligi
       cheklangani uchun satr blokdan chiqib ketardi va uni keyingi kartochka
       yopib qo'yardi (metodist surati 2026-08-14). */
    <div className="g7-scenewrap">
    <div className="g7-scene g7-hookscene">
      <svg viewBox="0 0 620 176" className="g7-scene-svg" role="img" aria-label={tokens.join(' ')}>
        {/* Yozuv lentasi: belgilar birma-bir tushadi */}
        <rect className="g7-hk-tape" x={x0 - 22} y="4" width={(n - 1) * step + 44} height="40" rx="11" />
        {tokens.map((tok, i) => (
          <text
            key={i}
            /* Amal belgisi bosqich rangida -- darsdagi hamma yozuv kabi. */
            className={'g7-hk-tok' + stageOf(tok)}
            x={x0 + i * step}
            y="32"
            textAnchor="middle"
            style={{ animationDelay: (0.08 * i).toFixed(2) + 's' }}
          >
            {tok}
          </text>
        ))}

        {/* Ikki kabel: yozuv ikkala mashinaga BIR XIL ketadi */}
        <path className="g7-hk-wire" d="M262 46 C 200 62, 168 66, 152 84" style={{ animationDelay: '.62s' }} />
        <path className="g7-hk-wire" d="M358 46 C 420 62, 452 66, 468 84" style={{ animationDelay: '.62s' }} />
        {/* Kabel bo'ylab yuguradigan impuls: sahna tirik turadi */}
        <path className="g7-hk-pulse" d="M262 46 C 200 62, 168 66, 152 84" style={{ animationDelay: '1.5s' }} />
        <path className="g7-hk-pulse" d="M358 46 C 420 62, 452 66, 468 84" style={{ animationDelay: '1.5s' }} />

        {/* Mashinalar. Ikkalasi BIR XIL: hech qaysisi ajratib ko'rsatilmaydi */}
        {[{ cx: 148, val: leftVal, cap: left.cap, d: 1.0, wide: false }, { cx: 468, val: right.value, cap: right.cap, d: 1.0, wide: true }].map((m, i) => (
          <g
            key={i}
            className={'g7-hk-dev' + (i === 0 && canFix ? ' is-fixable' : '') + (i === 0 && fixed ? ' is-fixed' : '')}
            style={{ animationDelay: (m.d).toFixed(2) + 's' }}
            role={i === 0 && canFix ? 'button' : undefined}
            tabIndex={i === 0 && canFix ? 0 : undefined}
            aria-label={i === 0 && fix ? t(fix.hint) : undefined}
            onClick={i === 0 ? doFix : undefined}
            onKeyDown={i === 0 && canFix ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doFix() } } : undefined}
          >
            {/* Korpus. Ikkita mashina endi BIR XIL EMAS: oddiysi ixcham va
                qalin ramkali, muhandisligi keng va tugmalar qatoriga ega.
                Farq xukning O'ZI haqida -- ular boshqa-boshqa asboblar. */}
            <rect className="g7-hk-body" x={m.cx - (m.wide ? 104 : 84)} y="80" width={m.wide ? 208 : 168} height={m.wide ? 74 : 62} rx="14" />
            {/* LCD: to'q maydon, ichida xira segmentlar ham ko'rinadi */}
            <rect className="g7-hk-lcd" x={m.cx - (m.wide ? 88 : 68)} y={88} width={m.wide ? 176 : 136} height="38" rx="6" />
            <rect className="g7-hk-gloss" x={m.cx - (m.wide ? 84 : 64)} y="91" width={m.wide ? 168 : 128} height="8" rx="4" />
            {/* KURSOR: son chiqquncha miltillab turadi, keyin so'nadi */}
            <rect className="g7-hk-cur" x={m.cx + (m.wide ? 66 : 56)} y="97" width="4" height="24"
              style={{ animationDelay: (m.d + 0.1).toFixed(2) + 's' }} />
            {/* `key` da qiymat turibdi: son o'zgarganda guruh QAYTA
                chiziladi va yonish animatsiyasi boshidan ketadi -- ya'ni
                raqamlar «qayta terilgandek» ko'rinadi. */}
            {/* Qayta hisoblagach son KUTMAYDI: kirish animatsiyasining
                kechikishi faqat birinchi chiqishda kerak edi. */}
            <g key={'num' + m.val} className="g7-hk-num" style={{ animationDelay: (fixed && i === 0 ? 0 : m.d + 0.85).toFixed(2) + 's' }}>
              <SegNumber value={m.val} cx={m.cx + (m.wide ? 40 : 30)} y={91} scale={0.82} cells={3} />
            </g>
            {/* Bosish nishoni: ramka element ICHIDA va besh marta chaqnaydi
                (metodist qoidasi -- pulsatsiya cheksiz emas). */}
            {i === 0 && canFix ? (
              <rect className="g7-hk-tap" x={m.cx - 86} y="78" width="172" height="66" rx="15" />
            ) : null}
            {/* Muhandislik mashinasida tugmalar qatori */}
            {m.wide ? (
              <g className="g7-hk-keys">
                {[0, 1, 2, 3, 4, 5].map((k) => (
                  <rect key={k} x={m.cx - 84 + k * 29} y="132" width="24" height="14" rx="4" />
                ))}
              </g>
            ) : null}
            <text className="g7-hk-cap" x={m.cx} y={m.wide ? 170 : 158} textAnchor="middle">{t(m.cap)}</text>
          </g>
        ))}

        {/* «Teng emas» -- oxirida chiqadi va pulsatsiya qiladi. Yakunda u
            «teng» ga AYLANADI: `key` almashgani uchun belgi qayta chiziladi. */}
        <g key={'sg' + shownSign} className={'g7-hk-ne' + (fixed ? ' is-fixed' : '')} style={{ animationDelay: fixed ? '0s' : '2.05s' }}>
          <circle className="g7-hk-ring" cx="310" cy="112" r="21" />
          <text x="310" y="120" textAnchor="middle">{shownSign}</text>
        </g>

      </svg>
    </div>
      {/* Topshiriq SVG ning ICHIDA emas. Sahna telefonda kichrayadi va u
          bilan birga SVG matni ham kichrayardi: yozuv mashina imzolari
          ustiga tushib, o'qilmay qolardi. Oddiy matn esa sahna o'lchamidan
          MUSTAQIL va har ekranda bir xil o'qiladi. */}
      {fix ? (
        <p className={'g7-hk-ask' + (fixed ? ' is-done' : '')}>
          {!fixed ? <i className="g7-hk-ask-dot" aria-hidden="true" /> : null}
          {t(fixed ? fix.doneHint : fix.hint)}
        </p>
      ) : null}
    </div>
  )
}

// ============================================================
// LawReveal -- QONUN JONLANADI. Qoida yig'ilgandan KEYIN uning qismlari
// birma-bir yonadi: qavs, uchinchi bosqich, ikkinchi, birinchi. So'ngida
// chiziq chapdan o'ngga o'tadi -- «bitta bosqich ichida chapdan o'ngga».
// Javobni ochmaydi: o'quvchi qoidani ALLAQACHON yig'ib bo'lgan.
// ============================================================
// ============================================================
// StairsReveal -- QOIDA LESTNITSASI (metodist tasdiqladi 2026-08-14).
// Qoida endi satr emas, RASM: to'rt pog'ona, ular bo'ylab yozuv yuqoridan
// pastga tushadi. Har pog'onada o'z chipi yonadi -- qavs, uchinchi, ikkinchi,
// birinchi bosqich. Pastda esa chiziq chapdan o'ngga o'tadi: «bitta bosqich
// ichida chapdan o'ngga».
//
// Nega lestnitsa: «bosqich» so'zining O'ZI pog'ona degani, va o'quvchi
// qoidani kontrol ishda aynan shu rasm bilan eslaydi.
// Harakat BIR MARTA o'tadi va to'xtaydi (§7.1, pulsatsiya cheksiz emas).
// Faqat CSS va SVG, rasm fayli yo'q (CLAUDE.md §5).
// ============================================================
// ============================================================
// ReadViz -- YOZUVNI O'QISH namoyishi (2-ekran, metodist tasdiqladi
// 2026-08-14). To'g'ri javobdan KEYIN chiqadi va javobni YOZUVNING
// O'ZIDA ko'rsatadi -- so'z bilan takrorlamaydi.
//   count   -- har amal belgisi ustida navbat raqami: 1, 2, 3, 4
//   pair    -- belgi va uning IKKI SONI yoritiladi, qolgani xiralashadi
//   bracket -- qavs ichidagi qism yoritiladi, tashqarisi xiralashadi
// ============================================================
export function ReadViz({ tokens, mode, mark }) {
  const isOp = (tok) => ['+', '−', '·', ':'].indexOf(tok) !== -1
  let opNo = 0
  return (
    <div className="g7-rv">
      {tokens.map((tok, i) => {
        const op = isOp(tok)
        if (op) opNo += 1
        let lit = false
        if (mode === 'pair') lit = i >= mark - 1 && i <= mark + 1
        if (mode === 'bracket') lit = i >= mark[0] && i <= mark[1]
        const dim = (mode === 'pair' || mode === 'bracket') && !lit
        return (
          <span
            key={i}
            className={'g7-rv-tok' + stageOf(tok) + (lit ? ' is-lit' : '') + (dim ? ' is-dim' : '')}
            style={{ animationDelay: (i * 0.07).toFixed(2) + 's' }}
          >
            {tok}
            {mode === 'count' && op ? <i className="g7-rv-no">{opNo}</i> : null}
          </span>
        )
      })}
    </div>
  )
}

export function StairsReveal({ items, sweep }) {
  const n = items.length
  const W = 620
  const H = 150
  const stepW = (W - 60) / n
  const stepH = (H - 46) / n
  return (
    <div className="g7-stairs">
      <svg viewBox={'0 0 ' + W + ' ' + H} className="g7-stairs-svg" role="img" aria-label={items.map((x) => (x && x.label) || x).join(' ')}>
        {items.map((x, i) => {
          const xL = 30 + i * stepW
          const yT = 22 + i * stepH
          const tone = x && x.tone ? x.tone : 'off'
          return (
            <g key={i} className={'g7-stair is-' + tone} style={{ animationDelay: (i * 0.45).toFixed(2) + 's' }}>
              {/* Pog'onaning YUZASI va undan pastga tushadigan QIRRASI --
                  ikkalasi birga haqiqiy lestnitsani beradi. */}
              <rect className="g7-stair-top" x={xL} y={yT} width={stepW - 6} height="10" rx="5" />
              {i < n - 1 ? (
                <rect className="g7-stair-riser" x={xL + stepW - 12} y={yT + 8} width="6" height={stepH} rx="3" />
              ) : null}
              {/* Pog'ona yorlig'i: qavs, III, II, I */}
              <text className="g7-stair-lab" x={xL + (stepW - 6) / 2} y={yT - 8} textAnchor="middle">
                {(x && x.label !== undefined ? x.label : x)}
              </text>
            </g>
          )
        })}
        {/* Yozuv pog'onalar bo'ylab pastga tushadi */}
        <circle className="g7-stair-ball" cx={30 + (stepW - 6) / 2} cy="15" r="10" />
      </svg>
      {sweep ? <p className="g7-stairs-sweep">{sweep}</p> : null}
    </div>
  )
}

export function LawReveal({ items, sweep }) {
  return (
    <div className="g7-lawrev">
      {items.map((x, i) => (
        <React.Fragment key={i}>
          {i ? (
            <span className="g7-lawrev-arr" style={{ animationDelay: (i * 0.42 - 0.14).toFixed(2) + 's' }}>
              {'→'}
            </span>
          ) : null}
          {/* Qism O'Z bosqichining rangida yonadi -- darsda yozuvlar shu
              ranglar bilan yozilgan, ya'ni qoida tanish ranglardan yig'iladi.
              Ro'yxat elementi `{ label, tone }` bo'lishi ham mumkin. */}
          <span
            className={'g7-lawrev-chip' + (x && x.tone ? ' is-' + x.tone : '')}
            style={{ animationDelay: (i * 0.42).toFixed(2) + 's' }}
          >
            {x && x.label !== undefined ? x.label : x}
          </span>
        </React.Fragment>
      ))}
      {sweep ? (
        <span className="g7-lawrev-sweep" style={{ animationDelay: (items.length * 0.42).toFixed(2) + 's' }}>
          {sweep}
        </span>
      ) : null}
    </div>
  )
}

// ============================================================
// TwoValues -- ikkita oq kartochka, o'rtasida aylanada «teng emas» belgisi.
// ETALON_7SINF.md §6.5 xuk uchun aynan shu shaklni talab qiladi. Qoida
// ekranida O'SHA blok qaytadan chiqadi: bittasi so'nadi, ikkinchisi yashil
// bo'ladi -- xuk savoli javobini QOIDA ekranida oladi (2 va 3-sinf usuli).
// 390 da kartochkalar bir-birining OSTIGA tushadi (§6.2).
// ============================================================
export function TwoValues({ left, right, dim, ok, sign = '≠' }) {
  const t = useT()
  const card = (d, side) => (
    <div className={'g7-tv' + (dim === side ? ' is-dim' : '') + (ok === side ? ' is-ok' : '')}>
      <span className="g7-tv-cap">{t(d.cap)}</span>
      <span className="g7-tv-val">{d.value}</span>
    </div>
  )
  return (
    <div className="g7-tv-row">
      {card(left, 'left')}
      {/* Belgi HECH QACHON «teng» ga aylanmaydi: sakkiz bilan yigirma qoida
          topilgandan keyin ham teng emas. Yashil rang «qaysi biri QIYMAT»
          ekanini bildiradi, tenglikni emas. Ilgari bu yerda `=` chiqardi --
          matematik jihatdan YOLG'ON edi. */}
      <span className="g7-tv-ne" aria-hidden="true">{sign}</span>
      {card(right, 'right')}
    </div>
  )
}

// ============================================================
// CollapseTrack -- YO'LAK: yozuv BERILGAN TARTIB bo'yicha o'zi yig'iladi.
// Har qadamda juft bir-biriga siljiydi va bitta songa aylanadi.
//
// Bu asbob JAVOB BERILGANDAN KEYIN ishlaydi: 2-ekranda to'g'ri javobdan
// so'ng, 3 va 7-ekranlarda o'quvchi tartibni qo'ygandan so'ng. Shuning
// uchun u javobni ochib qo'ymaydi -- allaqachon ma'lum narsani KO'RSATADI.
//
// Kadrlar tartibdan HISOBLANADI, qo'lda yozilmaydi: bitta yo'lak istalgan
// yozuv va istalgan tartib uchun ishlaydi.
// ============================================================
const interleave = (nums, ops, lang) =>
  nums.flatMap((x, i) => (i ? [ops[i - 1], fmtNum(x, lang)] : [fmtNum(x, lang)]))

export const collapseFrames = (nums, ops, order, lang) => {
  const frames = []
  const n = nums.slice()
  const live = ops.map((op, i) => ({ op, i }))
  frames.push({ toks: interleave(n, live.map((l) => l.op), lang) })
  order.forEach((opIdx) => {
    const pos = live.findIndex((x) => x.i === opIdx)
    if (pos === -1) return
    // Belgilar ro'yxatida son 2k o'rinda, amal 2k+1 o'rinda turadi.
    frames.push({ toks: interleave(n, live.map((l) => l.op), lang), merge: [pos * 2, pos * 2 + 2] })
    const val = applyOp(n[pos], live[pos].op, n[pos + 1])
    n.splice(pos, 2, val)
    live.splice(pos, 1)
    frames.push({ toks: interleave(n, live.map((l) => l.op), lang), born: pos * 2 })
  })
  return frames
}

export function CollapseTrack({ nums, ops, order, label, tone, delay = 0, stepMs = 520, onDone }) {
  const lang = useLang()
  const frames = useMemo(() => collapseFrames(nums, ops, order, lang), [nums, ops, order, lang])
  const [i, setI] = useState(0)
  const [started, setStarted] = useState(delay === 0)

  useEffect(() => {
    if (started) return undefined
    const tmr = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(tmr)
  }, [started, delay])

  useEffect(() => {
    if (!started || i >= frames.length - 1) return undefined
    const tmr = setTimeout(() => setI((v) => v + 1), stepMs)
    return () => clearTimeout(tmr)
  }, [started, i, frames.length, stepMs])

  const f = frames[started ? i : 0]
  const done = i >= frames.length - 1

  useEffect(() => {
    if (done && onDone) onDone()
  }, [done, onDone])

  return (
    <div className={'g7-track-row' + (tone ? ' is-' + tone : '') + (done ? ' is-done' : '')}>
      <span className="g7-track-cap">{label}</span>
      <span className="g7-track-expr">
        {f.toks.map((tok, k) => (
          <span
            key={i + '-' + k}
            className={
              'g7-film-tok' + stageOf(tok) +
              (f.merge && f.merge[0] === k ? ' is-mergeL' : '') +
              (f.merge && f.merge[1] === k ? ' is-mergeR' : '') +
              (f.born === k ? ' is-born' : '')
            }
          >
            {tok}
          </span>
        ))}
      </span>
    </div>
  )
}

// ============================================================
// CollapseFilm -- TUSHUNTIRISH KADRLARI. Metodist qarori 2026-08-13:
// 3-7-ekranlarda tushuntirish EKRANDA ko'rinishi kerak, ovozda emas.
//
// Har kadrda ikkita son BIR-BIRIGA SILJIYDI va bitta songa aylanadi -- ya'ni
// harakat aynan MATEMATIK o'zgarishni ko'rsatadi (§7.1). Kengligi emas,
// faqat `transform` o'zgaradi: 390 da yozuv kesilmasin.
//
// Kadrni OVOZ boshqaradi (`useNarratedSteps`, §7.2): bo'lak tugagach keyingi
// kadr keladi; ovoz o'chiq bo'lsa -- taymer bo'yicha. Pastdagi nuqtalar bilan
// o'quvchi orqaga qaytishi mumkin (6-sinf naqshi).
//
// `frames[k]`:
//   tokens -- ekrandagi belgilar ro'yxati
//   merge  -- [chap, o'ng] qo'shiluvchi indekslari: ular BIR-BIRIGA siljiydi
//   born   -- shu kadrda TUG'ILGAN son indeksi: u paydo bo'ladi
//   cap    -- kadr izohi (SO'Z bilan, matematik yozuv emas)
// ============================================================
export function CollapseFilm({ frames, audio, onDone, hold = false }) {
  const t = useT()
  const caps = useMemo(() => frames.map((f) => t(f.cap)), [frames, t])
  const voiced = useNarratedSteps(audio, caps)
  const [manual, setManual] = useState(null)

  // POL. `useNarratedSteps` ovoz bo'laklariga ergashadi, TTS ishlamasa esa
  // navbat BIR ZUMDA oxirigacha uchib ketadi va kino umuman ko'rinmay qoladi
  // (2026-08-13 da aynan shunday bo'ldi: 5-ekran darrov asbobni ko'rsatdi).
  // Shuning uchun kadr sekundiga bir martadan tez ALMASHMAYDI. Bu §7.2 dagi
  // qorovulning teskarisi: u kechikishdan, bu esa SHOSHILISHDAN saqlaydi.
  const target = Math.min(voiced, frames.length - 1)
  const [gate, setGate] = useState(0)
  useEffect(() => {
    if (gate >= target) return undefined
    const tmr = setTimeout(() => setGate((g) => (g < target ? g + 1 : g)), 1500)
    return () => clearTimeout(tmr)
  }, [gate, target])

  const idx = manual === null ? gate : manual
  const last = gate >= frames.length - 1

  useEffect(() => {
    if (last && onDone) onDone()
  }, [last, onDone])

  const f = frames[idx]

  return (
    <>
      <div className="g7-panel g7-panel-paper g7-film">
        <div className="g7-film-row">
          {f.tokens.map((tok, i) => {
            const isL = f.merge && f.merge[0] === i
            const isR = f.merge && f.merge[1] === i
            const isBorn = f.born === i
            const cls =
              'g7-film-tok' + stageOf(tok) +
              (isL ? ' is-mergeL' : '') +
              (isR ? ' is-mergeR' : '') +
              (isBorn ? ' is-born' : '')
            return (
              <span key={idx + '-' + i} className={cls}>
                {tok}
              </span>
            )
          })}
        </div>
      </div>

      {/* Izoh SO'Z bilan. Balandligi oldindan band: kadr almashganda ekran
          sakramaydi. */}
      <Slot mh={44}>
        <p className="g7-film-cap" key={idx}>{caps[idx]}</p>
      </Slot>

      {/* Nuqtalar: o'quvchi kadrga qaytishi mumkin. Oldinga o'tkazmaydi --
          kino o'zi ketadi, aks holda o'quvchi tushuntirishni «tez o'tkazib»
          yuborardi. */}
      {frames.length > 1 ? (
        <div className="g7-clip-bar">
          {frames.map((_, n) => (
            <button
              key={n}
              type="button"
              className={'g7-clip-dot' + (n === idx ? ' g7-clip-dot-on' : '') + (n < idx ? ' g7-clip-dot-past' : '')}
              onClick={() => { if (n <= gate) setManual(n) }}
              aria-label={String(n + 1)}
            />
          ))}
          {manual !== null ? (
            <button type="button" className="g7-clip-replay" onClick={() => setManual(null)} aria-label="now">{'▸'}</button>
          ) : null}
        </div>
      ) : null}
      {hold ? null : null}
    </>
  )
}

// ============================================================
// HistoryTape -- BOSILGAN YO'L. Har bajarilgan qadam kichik plashka qoldiradi:
// «6 : 3 -> 2». Ekran oxirida BUTUN yo'l ko'rinib turadi.
//
// Ikki vazifasi bor. Birinchi -- usul bajarilgach ekran BO'SHAB qolmaydi.
// Ikkinchi va muhimi -- 8-ekranda ikkala usulning lentasi yonma-yon qo'yiladi
// va ular BIR XIL ekani ko'rinadi: qoida shu yerdan chiqadi.
//
// Belgi bosqich rangida: lenta ham o'sha bog'lovchi rangni davom ettiradi.
// ============================================================
export function HistoryTape({ items, label }) {
  const t = useT()
  if (!items || !items.length) return null
  return (
    <div className="g7-tape">
      {label ? <span className="g7-tape-cap">{t(label)}</span> : null}
      <div className="g7-tape-row">
        {items.map((it, i) => (
          <span key={i} className="g7-tape-chip" style={{ animationDelay: (i * 0.06).toFixed(2) + 's' }}>
            {String(it).split(/(\s[·:+−]\s)/).map((part, k) => (
              <span key={k} className={stageOf(part.trim())}>{part}</span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// SolutionSteps -- O'QITUVCHI YECHIMI. Metodist qarori 2026-08-13 (surat:
// darslikdagi to'liq yechim). Har qator OLDINGISIDAN kelib chiqadi, yonida
// esa o'qituvchining TIRIK gapi turadi -- «avval qavs ichini hisoblaymiz».
//
// Qatorlar BIRMA-BIR o'sadi, pachka bo'lib chiqmaydi (1-4-sinf naqshi).
// O'quvchi O'Z harakatini qilgandan KEYIN ishga tushadi: shuning uchun bu
// javobni ochish emas, allaqachon olingan javobning YO'LINI ko'rsatish (§8.1).
//
// Atamalar so'zma-so'z (§3), izoh esa jonli tilda -- metodist 2026-08-13.
// ============================================================
// `rowH` -- bitta qatorning balandligi. Ramka BUTUN yechim uchun joyni
// BIRINCHI soniyadan band qiladi va qator qo'shilganda O'SMAYDI (§6.1,
// metodist talabi 2026-08-13). Aks holda ekran har qatorda sakraydi va
// budjetdan oshib ketishi mumkin.
export function SolutionSteps({ lines, label, stepMs = 1250, rowH = 44, onDone }) {
  const t = useT()
  const [n, setN] = useState(1)
  const last = n >= lines.length

  useEffect(() => {
    if (last) { if (onDone) onDone(); return undefined }
    const tmr = setTimeout(() => setN((v) => v + 1), stepMs)
    return () => clearTimeout(tmr)
  }, [n, last, stepMs, onDone])

  return (
    <div className="g7-panel g7-panel-paper g7-sol" style={{ minHeight: lines.length * rowH + (label ? 26 : 0) }}>
      {label ? <span className="g7-sol-cap">{t(label)}</span> : null}
      {lines.slice(0, n).map((ln, i) => (
        <div key={i} className="g7-sol-row">
          {/* Amal belgilari BOSQICH rangida: yozuvda ko'z avval AMALGA tushadi,
              songa emas -- mavzu aynan amallar tartibi haqida. Ranglar butun
              darsdagi bilan bir xil (metodist qarori 2026-08-13). */}
          <span className="g7-sol-expr">
            {String(ln.expr).split(' ').map((tok, k) => (
              <span key={k} className={'g7-sol-tok' + stageOf(tok) + (tok === '(' || tok === ')' ? ' is-par' : '')}>
                {tok}
              </span>
            ))}
          </span>
          <span className="g7-sol-say">{t(ln.say)}</span>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// NumberLineTracks -- SON O'QIDA ikki yo'l. 7-ekran uchun (metodist qarori
// 2026-08-13): «bitta bosqich ichida chapdan o'ngga» ni SO'Z bilan emas,
// HARAKAT bilan ko'rsatish.
//
// Yuqorida qoida bo'yicha: nuqta 20 dan 5 ga ORQAGA, so'ng 3 ga OLDINGA -- 18.
// Pastda esa «avval qo'shish»: 5 va 3 qo'shilib 8 bo'ladi, nuqta 8 ga orqaga
// ketadi -- 12. Ikki nuqta boshqa joyda TO'XTAYDI, va buni ko'rish uchun
// hech qanday izoh kerak emas.
//
// Javobni ochmaydi: o'quvchi 7-ekranda tartibni O'ZI qo'ygandan keyin
// chiziladi (§8.1).
// ============================================================
// `manual` -- sakrashni TAYMER emas, O'QUVCHI boshqaradi: u chiziqni bosadi
// va keyingi sakrash chiziladi. Ikki sabab. Birinchi -- kontrakt: qadamni
// taymer yetaklashi mumkin emas (ETALON_7SINF.md §7). Ikkinchi -- 7-ekranda
// o'quvchi javob bergandan KEYIN faqat tomosha qilardi, ya'ni darsning
// eng muhim xulosasi uning qo'lidan chiqib ketardi (metodist 2026-08-14).
export function NumberLineTracks({ from = 10, to = 22, tracks, audio, stepMs = 2200, manual, prompt }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  // BOSQICHMA-BOSQICH ochilish (metodist qarori 2026-08-13). Ilgari hamma
  // yoylar deyarli birdan chiqardi va o'quvchi harakatni ko'rib ulgurmasdi.
  const total = tracks.reduce((n, tr) => n + tr.jumps.length + 1, 0)
  const [tick, setTick] = useState(manual ? 1 : 0)
  useEffect(() => {
    if (manual) return undefined
    if (tick >= total) return undefined
    const tmr = setTimeout(() => setTick((v) => v + 1), stepMs)
    return () => clearTimeout(tmr)
  }, [tick, total, stepMs, manual])
  const done = tick >= total
  const advance = () => {
    if (!manual || done) return
    fx.tap()
    setTick((v) => v + 1)
  }
  // Nechta element ochilgani: yo'lak boshlanishi + har sakrash.
  let seen = 0
  const W = 620
  const pad = 44
  const x = (v) => pad + ((v - from) / (to - from)) * (W - 2 * pad)
  const ticks = []
  for (let v = from; v <= to; v += 2) ticks.push(v)

  return (
    <>
    {/* TURTKI. Metodist 2026-08-14: topshiriqdan OLDIN o'quvchini ekranga
        tegishga undash kerak. Ilgari bu yerda faqat pastdagi «Bosing»
        belgisi turardi -- ikkita yo'lakdan KEYIN, ya'ni ko'z unga
        yetmasdi va chiziq shunchaki turaverardi.
        Endi taklif TEPADA, sahnaning o'zi esa chaqnaydi (besh marta,
        keyin tinchiydi -- pulsatsiya cheksiz emas). */}
    {manual && !done ? <Ask kind="task" tight>{prompt ? t(prompt) : null}</Ask> : null}
    <div
      className={'g7-nl' + (manual && !done ? ' is-tappable' : '') + (manual && tick <= 1 ? ' is-inviting' : '')}
      role={manual && !done ? 'button' : undefined}
      tabIndex={manual && !done ? 0 : undefined}
      onClick={manual ? advance : undefined}
      onKeyDown={manual && !done ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); advance() } } : undefined}
    >
      {/* BOSISH STIKERI: tegish belgisi birinchi bosishgacha uradi. */}
      {manual && tick <= 1 ? <TapMark /> : null}
      {tracks.map((tr, i) => {
        const base = seen
        seen += tr.jumps.length + 1
        const shownJumps = Math.max(0, Math.min(tr.jumps.length, tick - base))
        const rowOn = tick > base - 1
        if (!rowOn) return <div key={i} className="g7-nl-row is-wait" />
        return (
        <div key={i} className="g7-nl-row">
          <span className="g7-nl-cap">{t(tr.cap)}</span>
          <svg viewBox={'0 0 ' + W + ' 74'} className="g7-nl-svg" role="img" aria-label={String(tr.end)}>
            <line className="g7-nl-axis" x1={pad} y1="52" x2={W - pad} y2="52" />
            {ticks.map((v) => (
              <g key={v}>
                <line className="g7-nl-tick" x1={x(v)} y1="47" x2={x(v)} y2="57" />
                <text className="g7-nl-num" x={x(v)} y="70" textAnchor="middle">{v}</text>
              </g>
            ))}
            {tr.jumps.slice(0, shownJumps).map((j, k) => {
              const x1 = x(j.from)
              const x2 = x(j.to)
              const mid = (x1 + x2) / 2
              const back = j.to < j.from
              // Yoyning BALANDLIGI navbat bo'yicha o'zgaradi: ikkita sakrash
              // bir xil balandlikda bo'lsa, ular ustma-ust tushadi va yorliqlar
              // aralashib ketadi (metodist surati 2026-08-13).
              const apex = k === 0 ? 12 : 26
              // O'Q UCHI harakat YO'NALISHINI ko'rsatadi: orqaga -- chapga,
              // oldinga -- o'ngga. Busiz ikkala yoy bir xil ko'rinadi va
              // «orqaga qadam, oldinga qadam» degan ma'no ekranda yo'qoladi.
              // Uch aynan BORIB TO'XTAGAN nuqtada turadi va harakat tomonga
              // qaraydi. Ilgari orqaga va oldinga uchun bir xil shakl
              // chizilardi va yo'nalish o'qilmasdi (metodist surati).
              const dir = x2 >= x1 ? 1 : -1
              const head = 'M' + x2 + ' 48 l ' + (-9 * dir) + ' -5 l 0 10 z'
              return (
                <g key={k} className="g7-nl-jump">
                  <path
                    className={'g7-nl-arc' + (back ? ' is-back' : ' is-fwd')}
                    d={'M' + x1 + ' 48 Q ' + mid + ' ' + apex + ' ' + x2 + ' 48'}
                  />
                  <path className={'g7-nl-head' + (back ? ' is-back' : ' is-fwd')} d={head} />
                  <text className="g7-nl-lab" x={mid} y={apex + 2} textAnchor="middle">{j.label}</text>
                </g>
              )
            })}
            {shownJumps >= tr.jumps.length ? (
              <>
                <circle className="g7-nl-dot" cx={x(tr.end)} cy="52" r="7" />
                <text className="g7-nl-end" x={x(tr.end)} y="38" textAnchor="middle">{tr.end}</text>
              </>
            ) : (
              <circle className="g7-nl-dot is-start" cx={x(tr.jumps[0].from)} cy="52" r="7" />
            )}
          </svg>
        </div>
        )
      })}
      {/* Bosish nishoni chiziqning O'ZIDA emas, pastida: sahna bosiladi,
          belgi esa qayerga bosishni aytadi. Hamma sakrash chizilgach
          belgi yo'qoladi. */}
      {manual ? <CallToAct kind="tap" done={done} /> : null}
    </div>
    </>
  )
}

export { UI as TOOL_UI }
