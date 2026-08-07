// ============================================================================
// 10-sinf ASBOBLARI. Har biri BIR marta yoziladi va hamma darsda ishlatiladi.
// Dars faqat MA'LUMOT beradi: qaysi burchak, qaysi variantlar, qaysi razbor.
// Kontrakt: src/books/grade10/ETALON_10SINF.md
//
// YILNING ASOSIY ASBOBI -- `UnitCircle` (birlik aylana): orqasida 13 dars,
// Б1 (1-6), Б2 (8-13) va 34-dars.
//
// ASOSIY QOIDA (etalon §5.0): asbob KONTROLYOR, orakul emas. U faqat ikki
// holatda gapiradi: o'quvchi natijani o'zgartirgan qadam qildi yoki javobni
// O'ZI yozdi. «Javobni ko'rsatish» tugmasi hech qaysi asbobda YO'Q.
//
// Xato javob naqshi: tovush -> variant SARIQ bo'ladi -> pastda Feedback ->
// 300 ms keyin AYNAN SHU variantning razbori OVOZ bilan aytiladi.
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Btn,
  Col,
  useBoxSize,
  useTweenAngle,
  Cols,
  MATH_FONT,
  UI_TXT,
  DoneRow,
  Expr,
  Feedback,
  Fx,
  L,
  Options,
  Panel,
  RuleCard,
  Slot,
  T,
  Tag,
  useSfx,
  useT,
} from './core.jsx'

const UI = {
  check: L('Tekshirish', 'Проверить', 'Check'),
  reset: L('Qaytadan', 'Заново', 'Reset'),
  hint: L('Maslahat', 'Подсказка', 'Hint'),
  answerIs: L('Javob', 'Ответ', 'Answer'),
  writeAnswer: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
  nextRow: L('Keyingi qadam', 'Следующий шаг', 'Next step'),
  testPoint: L('Nuqta bilan tekshirish', 'Проверить точкой', 'Check with a point'),
  // «kiradi / kirmaydi» EMAS: qayerga kirishi tushunarsiz edi. Xulosa har
  // doim bitta savolga javob beradi -- bu son tengsizlikning YECHIMIMI.
  isIn: L('yechim', 'решение', 'a solution'),
  isNotIn: L('yechim EMAS', 'НЕ решение', 'NOT a solution'),
  undef: L("logarifm YO'Q", 'логарифма НЕТ', 'no logarithm'),
  supportShow: L('Uch tayanchni ochish', 'Показать три опоры', 'Show the three basics'),
  supportHide: L('Yashirish', 'Свернуть', 'Collapse'),
  why: L('chunki', 'потому что', 'because'),
}

export { UI as TOOL_UI }

// Variantlar HAR MOUNT da aralashadi. Sababi: ma'lumot faylida to'g'ri javob
// deyarli har savolda BIRINCHI turadi, aralashtirmasa o'quvchi pozitsiyani
// yodlab oladi (2-sinfda aynan shu xato bo'lgan). `id` saqlanadi, shuning uchun
// razborlar va tegishlar joyida qoladi.
function shuffled(items) {
  const a = items.slice()
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i]
    a[i] = a[j]
    a[j] = tmp
  }
  return a
}

// Xato/to'g'ri javobning umumiy ishlovi: tovush + ovozli razbor.
function useAnswerFx(audio) {
  const sfx = useSfx()
  const t = useT()
  return {
    right: (praise) => {
      sfx.playCorrect()
      if (audio && audio.say && praise) audio.say(t(praise))
    },
    wrong: (hint) => {
      sfx.playWrong()
      if (audio && audio.say && hint) audio.say(t(hint))
    },
  }
}

export function Probe({ data, cols = 2, unscored = false, onSolved, disabled, minH, audio, fbSlot = 74, noShuffle = false }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [order] = useState(() => (noShuffle ? data.items : shuffled(data.items)))
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [hint, setHint] = useState(null)
  const [ok, setOk] = useState(false)

  const items = useMemo(() => order.map((it) => ({ id: it.id, label: t(it.label) })), [order, t])

  const pick = (opt) => {
    const src = data.items.find((it) => it.id === opt.id)
    if (unscored) {
      setPicked(opt.id)
      if (data.afterPredict) { setOk(false); setHint(data.afterPredict) }
      if (onSolved) onSolved({ picked: opt.id, correct: null })
      return
    }
    if (src && src.correct) {
      setPicked(opt.id)
      setOk(true)
      setHint(src.ok || data.ok || null)
      fx.right(src.ok || data.ok)
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
      {data.question ? <p className="g10-ask">{t(data.question)}</p> : null}
      <Options
        items={items}
        picked={picked}
        wrong={wrong}
        onPick={pick}
        disabled={disabled || (unscored && !!picked)}
        cols={cols}
        minH={minH}
      />
      <Slot mh={fbSlot}>
        <Feedback show={!!hint} ok={ok}>{hint ? t(hint) : null}</Feedback>
      </Slot>
    </>
  )
}

// ============================================================
// ProbeChain -- savollar birma-bir. Javob berilgani QATORGA yig'iladi.
// `onEach` -- har savolning BIRINCHI urinishi natijasi (blits balli shundan).
// `renderExtra` -- savolga qo'shimcha (masalan son o'qi) chizish uchun.
// ============================================================
export function ProbeChain({ items, cols = 2, onSolved, onEach, onStep, audio, showPrompt = true, noShuffle = false }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [orders] = useState(() => items.map((q) => (noShuffle ? q.items : shuffled(q.items))))
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
      setHint(src.ok || current.ok || null)
      fx.right(src.ok || current.ok)
      if (onEach) onEach({ id: current.id, correct: true, attempts: wrong.length + 1, tag: current.tag })
      // Yig'ilgan qatorga QISQA yozuv kerak: blitsda 3 va 4-savolning prompti
      // butun gap, u qatorga sig'may 557px gorizontal oshib ketardi.
      const row = current.done ? t(current.done) : (showPrompt ? t(current.prompt) + '  ' : '') + t(src.label)
      setTimeout(() => {
        setDone((prev) => prev.concat(row))
        setWrong([])
        setOkId(null)
        setOk(false)
        setHint(null)
        const next = idx + 1
        setIdx(next)
        if (onStep) onStep('q' + (next + 1))
        if (next >= items.length && onSolved) onSolved({ correct: true })
      }, 1700)
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
        <div className="g10-in" style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {/* `ask: true` -- prompt GAP, o'ralishi kerak. Formula bo'lsa `Expr`
              (nowrap), aks holda uzun gap gorizontal oshib ketadi. */}
          {showPrompt && !current.ask
            ? (
              <Expr size="row">
                {t(current.prompt)}
                {okId ? (
                  <span className="g10-drop g10-ok-text" style={{ paddingLeft: '.4em' }}>
                    {(String(t(current.prompt)).trim().endsWith('=') ? '' : '\u2192  ')
                      + t((current.items.find((it) => it.id === okId) || {}).label)}
                  </span>
                ) : null}
              </Expr>
            )
            : <p className="g10-ask">{t(current.prompt)}</p>}
          <Options
            items={(orders[idx] || current.items).map((it) => ({ id: it.id, label: t(it.label) }))}
            picked={okId}
            wrong={wrong}
            onPick={pick}
            cols={current.cols || cols}
          />
        </div>
      ) : null}
      <Slot mh={60} className={!hint && !okId ? 'g10-await' : undefined}>
        <Feedback show={!!hint} ok={ok}>{hint ? t(hint) : null}</Feedback>
      </Slot>
    </>
  )
}

// ============================================================
// SupportCards -- 4-sinf naqshi: AVVAL uch tayanch kartochkasi (birma-bir
// bosiladi), KEYIN uch topshiriq. Topshiriqlar kartochkalar YO'QOLGANDAN
// keyin paydo bo'ladi, shuning uchun balandlik o'smaydi.
// ============================================================
export function SupportCards({ cards, tasks, open, showTasks, onSolved, onStep, audio }) {
  const t = useT()
  // Tushuntirish tugagach kartochkalar YIG'ILADI: uchta baland kartochka
  // o'rniga bitta tugma qoladi. Sabab -- savollar ochilganda balandlik
  // qo'shilib, telefonda ham noutbukda ham skroll paydo bo'lardi.
  // Qayta ochilganda kartochkalar EMAS, ixcham ro'yxat chiqadi: u pastroq.
  const [reopen, setReopen] = useState(false)
  const folded = showTasks && !reopen

  return (
    <>
      {folded ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Btn tone="ghost" onClick={() => setReopen(true)} style={{ minHeight: 38 }}>
            {t(UI.supportShow)}
          </Btn>
          {/* Yig'ilgan holatda ham uch tayanch NOMI ko'rinib turadi: o'quvchi
              nima yashiringanini biladi, tugmani ko'r-ko'rona bosmaydi. */}
          <span className="g10-fold-list">
            {cards.map((c, i) => (
              <span key={c.id} className="g10-fold-item">
                <span className="g10-fold-num">{'0' + (i + 1)}</span>
                {t(c.short || c.title)}
              </span>
            ))}
          </span>
        </div>
      ) : null}

      {showTasks && reopen ? (
        <Panel tone="quiet" pad={9} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {cards.map((c, i) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'baseline', gap: 9, minHeight: 20 }}>
              <span className="g10-fold-num">{'0' + (i + 1)}</span>
              <span className="g10-hint g10-wrap" style={{ color: T.ink, fontWeight: 600 }}>{t(c.title)}</span>
              <span className="g10-expr g10-expr-sm g10-wrap" style={{ color: T.graph, marginLeft: 'auto' }}>
                <Fx>{(c.ex || []).map((x) => x.e).join('    ')}</Fx>
              </span>
            </div>
          ))}
          <Btn tone="ghost" onClick={() => setReopen(false)} style={{ minHeight: 34, alignSelf: 'flex-start' }}>
            {t(UI.supportHide)}
          </Btn>
        </Panel>
      ) : null}

      {!showTasks ? (
        <div className="g10-cols3">
          {cards.map((c, i) => {
            const on = i < open
            return (
              <Panel
                key={c.id}
                tone={on ? 'paper' : 'quiet'}
                className={on ? 'g10-reveal' : undefined}
                pad={10}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 5,
                  opacity: on ? 1 : 0.3,
                  transition: 'opacity .42s cubic-bezier(.22,.61,.36,1)',
                }}
              >
                <Tag tone={i === 2 ? 'graph' : 'quiet'}>{'0' + (i + 1)}</Tag>
                <span className="g10-hint g10-wrap" style={{ color: T.ink, fontWeight: 600, lineHeight: 1.3 }}>{t(c.title)}</span>
                {on ? (
                  /* Misollar KETMA-KET tushadi: ikkinchisi birinchisidan keyin.
                     Shunda ovoz «xuddi shunday...» deganda ko'z aynan o'sha
                     satrga tushadi. */
                  (c.ex || []).map((x, k) => (
                    <span
                      key={k}
                      className="g10-drop g10-ex"
                      style={{ animationDelay: k * 0.34 + 's' }}
                    >
                      <span className="g10-expr g10-expr-sm g10-wrap" style={{ color: T.graph }}><Fx>{x.e}</Fx></span>
                      {/* `why` FORMULA bo'lsa (oddiy satr) -- monoshirift;
                          PROZA bo'lsa (uch tilli L) -- Manrope. Monoshirift
                          faqat matematika uchun. */}
                      <span className="g10-ex-why g10-wrap">
                        {t(UI.why) + ' '}
                        <span className={typeof x.why === 'string' ? 'g10-mono' : undefined}>
                          <Fx>{t(x.why)}</Fx>
                        </span>
                      </span>
                    </span>
                  ))
                ) : (
                  <span className="g10-expr g10-expr-sm g10-dim">?</span>
                )}
              </Panel>
            )
          })}
        </div>
      ) : null}

      {showTasks ? (
        <div className="g10-in">
          <ProbeChain items={tasks} cols={2} audio={audio} onSolved={onSolved} onStep={onStep} showPrompt />
        </div>
      ) : null}
    </>
  )
}
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
        <Probe data={probe} cols={2} minH={46} audio={audio} onSolved={solved} />
      ) : (
        <>
          <RuleCard
            badge={t(card.badge)}
            law={card.law}
            laws={card.laws}
            lawLabel={card.lawLabel ? t(card.lawLabel) : null}
            lines={card.lines.map((l) => t(l))}
            example={card.example ? t(card.example) : null}
            wide={!!swapped}
          />
          <Slot mh={44}>
            {swap && !swapped ? (
              <Btn tone="soft" onClick={() => { setSwapped(true); if (onStep) onStep('both') }}>
                {t(swap.button)}
              </Btn>
            ) : null}
          </Slot>
        </>
      )}
    </>
  )
}
export function AuditRows({ rows, answerId, hints, proof, onSolved, onStep, audio, hideProof = false }) {
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
      fx.right(null)
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
      <Panel style={{ display: 'flex', flexDirection: 'column', gap: solved ? 3 : 5 }}>
        {rows.map((row, i) => {
          const isWrongPick = wrong.indexOf(row.id) !== -1
          const isAnswer = solved && row.id === answerId
          return (
            <button
              type="button"
              key={row.id}
              className={'g10-opt' + (isAnswer ? ' g10-opt-ok' : '') + (isWrongPick ? ' g10-opt-tip' : '')}
              style={{
                fontFamily: MATH_FONT,
                minHeight: solved ? 24 : 30,
                padding: solved ? '2px 11px' : '5px 11px',
                fontSize: solved ? 'clamp(11.5px, 1.5vw, 13px)' : 'clamp(13px, 1.8vw, 16px)',
                transition: 'min-height .5s, padding .5s, font-size .5s',
              }}
              disabled={solved || isWrongPick}
              onClick={() => pick(row.id)}
            >
              <span className="g10-opt-badge">{i + 1}</span>
              <span className="g10-opt-text">{row.text}</span>
            </button>
          )
        })}
      </Panel>
      {solved && proof && !hideProof ? (
        <Panel tone="teal" className="g10-in" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Tag tone="graph">{t(UI.testPoint)}</Tag>
          <span className="g10-expr g10-expr-sm g10-wrap" style={{ color: T.ink }}><Fx>{t(proof)}</Fx></span>
        </Panel>
      ) : null}
      {!solved ? (
        <Slot mh={68}>
          <Feedback show={!!hint} ok={false}>{hint ? t(hint) : null}</Feedback>
        </Slot>
      ) : null}
    </>
  )
}

// ============================================================
// 1-ASBOB. BIRLIK AYLANA. Yilning asosiy asbobi.
//
// Guvoh: nuqta radiusi birga teng aylanada, ya'ni kvadratlar yig'indisi BIR.
// Xato juftlik nuqtani aylanadan CHIQARIB yuboradi -- «noto'g'ri» so'zi
// o'rniga. Aniq qiymatlar (EXACT/RAD) -- jadval EMAS, nuqtaning koordinatalari.
// ============================================================
export const EXACT = {
  0: ['1', '0'],
  30: ['√3/2', '1/2'],
  45: ['√2/2', '√2/2'],
  60: ['1/2', '√3/2'],
  90: ['0', '1'],
  120: ['−1/2', '√3/2'],
  135: ['−√2/2', '√2/2'],
  150: ['−√3/2', '1/2'],
  180: ['−1', '0'],
  210: ['−√3/2', '−1/2'],
  225: ['−√2/2', '−√2/2'],
  240: ['−1/2', '−√3/2'],
  270: ['0', '−1'],
  300: ['1/2', '−√3/2'],
  315: ['√2/2', '−√2/2'],
  330: ['√3/2', '−1/2'],
}

export const RAD = {
  0: '0', 30: 'π/6', 45: 'π/4', 60: 'π/3', 90: 'π/2',
  120: '2π/3', 135: '3π/4', 150: '5π/6', 180: 'π',
  210: '7π/6', 225: '5π/4', 240: '4π/3', 270: '3π/2',
  300: '5π/3', 315: '7π/4', 330: '11π/6',
}

const norm = (d) => ((d % 360) + 360) % 360
const rad = (d) => (d * Math.PI) / 180
const round2 = (v) => Math.round(v * 100) / 100
const fmt = (v) => {
  const r = round2(v)
  return (Math.abs(r) < 0.005 ? '0' : String(r)).replace('-', '−')
}
export const exactOf = (deg) => EXACT[norm(deg)] || [fmt(Math.cos(rad(deg))), fmt(Math.sin(rad(deg)))]
export const radOf = (deg) => RAD[norm(deg)] || null

const CUI = {
  angle: L('Burchak', 'Угол', 'Angle'),
  cos: L('Kosinus', 'Косинус', 'Cosine'),
  sin: L('Sinus', 'Синус', 'Sine'),
  sum: L('Kvadratlar', 'Квадраты', 'Squares'),
  explore: L(
    "{n} chorakda bo'ldingiz, {k} kerak.",
    'Ты побывал в {n} четвертях из {k}.',
    'You have visited {n} of {k} quadrants.',
  ),
}

// Sahna: chapda chizma (butun balandlik), o'ngda ish ustuni. Piksel qotirilmagan
// -- chizma o'z qutisini o'lchab, kichik tomoniga moslashadi (poli etalon §6.3).
export function Scene({ fig, note, max = 520, h }) {
  const [ref, box] = useBoxSize()
  const side = Math.min(max, Math.max(0, Math.min(box.w, h || box.h)))
  return (
    <div className="g10-scene" style={h ? { flex: '0 0 auto' } : undefined}>
      {fig ? (
        <div className="g10-scene-fig" ref={ref} style={h ? { height: h, flex: '1 1 auto' } : undefined}>
          {side > 60 ? React.cloneElement(fig, { size: side }) : null}
        </div>
      ) : null}
      {note ? <div className="g10-scene-note">{note}</div> : null}
    </div>
  )
}

// Daftar satri: chizmadan «uchib» keladi -- yozuv chizmadan olinadi.
export function NoteLine({ children, tone, i = 0 }) {
  return (
    <div
      className="g10-flyin g10-expr g10-expr-row g10-wrap"
      style={{ animationDelay: i * 0.06 + 's', color: tone, textAlign: 'left' }}
    >
      <Fx>{children}</Fx>
    </div>
  )
}

export function UnitCircle({
  size = 268,
  angle,
  onAngle,
  snap,
  marks = [],
  ghost = null,
  chord = null,
  bisector = false,
  counter = false,
  readout = true,
  locked = false,
  reflect = false,
  drop = false,
  values = false,
  tween = true,
}) {
  const t = useT()
  const ref = useRef(null)
  const cx = size / 2
  const cy = size / 2
  const R = size * 0.37
  const shown = useTweenAngle(angle === null || angle === undefined ? 0 : angle, tween ? 620 : 0)
  const live = angle === null || angle === undefined ? angle : (tween ? shown : angle)

  const px = (x, y) => [cx + R * x, cy - R * y]
  const ptOf = (deg) => px(Math.cos(rad(deg)), Math.sin(rad(deg)))

  const pick = (event) => {
    if (locked || !onAngle) return
    const svg = ref.current
    if (!svg) return
    const box = svg.getBoundingClientRect()
    const x = ((event.clientX - box.left) / box.width) * size - cx
    const y = cy - ((event.clientY - box.top) / box.height) * size
    let deg = norm((Math.atan2(y, x) * 180) / Math.PI)
    if (snap && snap.length) {
      let best = null
      let dist = 999
      snap.forEach((sv) => {
        const d = Math.min(Math.abs(norm(sv) - deg), 360 - Math.abs(norm(sv) - deg))
        if (d < dist) { dist = d; best = norm(sv) }
      })
      if (best !== null && dist <= 12) deg = best
    }
    onAngle(deg)
  }

  const has = angle !== null && angle !== undefined
  const [ax, ay] = has ? ptOf(live) : [cx, cy]
  const [ex, ey] = has ? exactOf(angle) : ['', '']
  const radLabel = has ? radOf(angle) : null
  const sum = ghost ? round2(ghost.x * ghost.x + ghost.y * ghost.y) : 1
  const [gx, gy] = ghost ? px(ghost.x, ghost.y) : [0, 0]

  return (
    <div className="g10-circle-wrap">
      <svg
        ref={ref}
        className="g10-circle"
        width={size}
        height={size}
        style={{ maxWidth: size, maxHeight: size }}
        preserveAspectRatio="xMidYMid meet"
        viewBox={'0 0 ' + size + ' ' + size}
        onPointerDown={pick}
        onPointerMove={(e) => { if (e.buttons === 1) pick(e) }}
        role="img"
      >
        <line x1={cx - R * 1.22} y1={cy} x2={cx + R * 1.22} y2={cy} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
        <line x1={cx} y1={cy + R * 1.22} x2={cx} y2={cy - R * 1.22} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={T.ink3} strokeWidth="1.6" />

        {bisector ? (
          <line
            x1={cx - R * 0.86} y1={cy + R * 0.86} x2={cx + R * 0.86} y2={cy - R * 0.86}
            stroke={T.graph} strokeWidth="1.2" strokeDasharray="4 4"
          />
        ) : null}

        {chord ? (
          <g>
            <line
              x1={cx - R * 1.16} y1={cy - R * chord.y} x2={cx + R * 1.16} y2={cy - R * chord.y}
              stroke={T.graph} strokeWidth="1.6"
            />
            {[1, -1].map((sgn) => {
              const c = sgn * Math.sqrt(Math.max(0, 1 - chord.y * chord.y))
              const [hx, hy] = px(c, chord.y)
              return <circle key={sgn} cx={hx} cy={hy} r="5.5" fill={T.graph} />
            })}
          </g>
        ) : null}

        {marks.map((m) => {
          const [mx, my] = ptOf(m.deg)
          const tone = m.tone || T.ink3
          return (
            <g key={'m' + m.deg + (m.label || '')}>
              <line x1={cx} y1={cy} x2={mx} y2={my} stroke={tone} strokeWidth="1.1" strokeDasharray="3 3" opacity=".65" />
              <circle cx={mx} cy={my} r="5" fill={tone} />
              {m.label ? (
                <text
                  x={mx + (mx >= cx ? 9 : -9)} y={my + (my > cy ? 14 : -8)}
                  fontFamily={MATH_FONT} fontSize="12" fontWeight="700"
                  fill={tone} textAnchor={mx >= cx ? 'start' : 'end'}
                >
                  {m.label}
                </text>
              ) : null}
            </g>
          )
        })}

        {reflect && has ? (
          <line
            x1={ax} y1={ay}
            x2={px(Math.sin(rad(angle)), Math.cos(rad(angle)))[0]}
            y2={px(Math.sin(rad(angle)), Math.cos(rad(angle)))[1]}
            stroke={T.graph} strokeWidth="1.2" strokeDasharray="3 3"
          />
        ) : null}

        {has ? (
          <g>
            <line x1={cx} y1={cy} x2={ax} y2={ay} stroke={T.accent} strokeWidth="2" />
            {drop ? (
              <g>
                <line key={'dx' + Math.round(angle)} className="g10-draw" style={{ '--len': Math.abs(ay - cy) }} x1={ax} y1={ay} x2={ax} y2={cy} stroke={T.graph} strokeWidth="1.6" />
                <line key={'dy' + Math.round(angle)} className="g10-draw" style={{ '--len': Math.abs(ax - cx) }} x1={ax} y1={ay} x2={cx} y2={ay} stroke={T.graph} strokeWidth="1.6" />
              </g>
            ) : (
              <g>
                <line x1={ax} y1={ay} x2={ax} y2={cy} stroke={T.accent} strokeWidth="1" strokeDasharray="3 3" opacity=".55" />
                <line x1={ax} y1={ay} x2={cx} y2={ay} stroke={T.accent} strokeWidth="1" strokeDasharray="3 3" opacity=".55" />
              </g>
            )}
            {values ? (
              <g key={'v' + Math.round(angle)} className="g10-valpop">
                <text x={(ax + cx) / 2} y={cy + (ay > cy ? -7 : 16)} fontFamily={MATH_FONT} fontSize="13" fontWeight="700" fill={T.accent} textAnchor="middle">{ex}</text>
                <text x={ax + (ax >= cx ? 8 : -8)} y={(ay + cy) / 2} fontFamily={MATH_FONT} fontSize="13" fontWeight="700" fill={T.accent} textAnchor={ax >= cx ? 'start' : 'end'}>{ey}</text>
              </g>
            ) : null}
            <circle cx={ax} cy={ay} r="6.5" fill={T.accent} />
          </g>
        ) : null}

        {ghost ? (
          <g className="g10-pop">
            <line x1={cx} y1={cy} x2={gx} y2={gy} stroke={T.tip} strokeWidth="1.6" strokeDasharray="5 4" />
            <circle cx={gx} cy={gy} r="6" fill="none" stroke={T.tip} strokeWidth="2.4" />
          </g>
        ) : null}
      </svg>

      {readout ? (
        <div className="g10-readout">
          <div className="g10-readout-row">
            <span className="g10-readout-key">{t(CUI.angle)}</span>
            <span className="g10-readout-val">{has ? Math.round(angle) + '°' : '—'}{radLabel ? '  ·  ' + radLabel : ''}</span>
          </div>
          <div className="g10-readout-row">
            <span className="g10-readout-key">{t(CUI.cos)}</span>
            <span className="g10-readout-val g10-readout-val-accent">{has ? ex : '—'}</span>
          </div>
          <div className="g10-readout-row">
            <span className="g10-readout-key">{t(CUI.sin)}</span>
            <span className="g10-readout-val g10-readout-val-accent">{has ? ey : '—'}</span>
          </div>
          {counter ? (
            <div className="g10-readout-row" style={{ marginTop: 2 }}>
              <span className="g10-readout-key">{t(CUI.sum)}</span>
              <span className="g10-readout-val" style={{ color: sum === 1 ? T.ok : T.tip, fontWeight: 800 }}>
                {String(sum).replace('.', ',')}
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

// ============================================================
// QO'L BILAN TUSHUNTIRISH (3-7 ekranlar). Kadrlarni OVOZ ochadi, lekin
// ekran o'quvchi bir marta HARAKAT qilmaguncha yopilmaydi (etalon §4.5).
// ============================================================

// Nuqtani aylana bo'ylab yurgizish: hisoblagichni birdan uzishga urinish.
export function ExploreCircle({ prompt, need = 3, okText, notes, audio, onSolved }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [angle, setAngle] = useState(null)
  const [seen, setSeen] = useState([])
  const [done, setDone] = useState(false)

  const put = (deg) => {
    if (done) return
    setAngle(deg)
    const q = Math.floor(norm(deg) / 90)
    if (seen.indexOf(q) !== -1) return
    const next = seen.concat(q)
    setSeen(next)
    if (next.length >= need) {
      setDone(true)
      fx.right(okText)
      if (onSolved) onSolved({ correct: true })
    }
  }

  return (
    <>
      <p className="g10-ask">{t(prompt)}</p>
      <Scene
        fig={<UnitCircle angle={angle} onAngle={put} counter drop readout={false} tween={false} />}
        note={(
          <div className="g10-side">
            {notes.slice(0, Math.max(1, seen.length)).map((n, i) => <NoteLine key={i} i={i}>{typeof n === 'string' ? n : t(n)}</NoteLine>)}
            <Slot mh={56} className="g10-fb-sm">
              <Feedback show={seen.length > 0} ok={done}>
                {done ? t(okText) : t(CUI.explore).replace('{n}', String(seen.length)).replace('{k}', String(need))}
              </Feedback>
            </Slot>
          </div>
        )}
      />
    </>
  )
}

// Nuqtani BERILGAN burchakka qo'yish. Bir nechta nishon -- ketma-ket.
export function PlaceAngle({ prompt, targets, tolerance = 12, steps, okText, wrongText, audio, onSolved, extra }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [idx, setIdx] = useState(0)
  const [angle, setAngle] = useState(null)
  const [miss, setMiss] = useState(false)
  const done = idx >= targets.length
  const target = targets[Math.min(idx, targets.length - 1)]

  const put = (deg) => {
    if (done) return
    setAngle(deg)
    const d = Math.min(Math.abs(norm(deg) - norm(target)), 360 - Math.abs(norm(deg) - norm(target)))
    if (d <= tolerance) {
      setMiss(false)
      const next = idx + 1
      setIdx(next)
      fx.right(next >= targets.length ? okText : null)
      if (next >= targets.length && onSolved) onSolved({ correct: true })
      return
    }
    setMiss(true)
    fx.wrong(wrongText)
  }

  const shown = done ? targets[targets.length - 1] : angle
  const promptNow = Array.isArray(prompt) ? prompt[Math.min(idx, prompt.length - 1)] : prompt
  return (
    <>
      <p className="g10-ask">{t(promptNow)}</p>
      <Scene
        fig={<UnitCircle angle={shown} onAngle={put} snap={targets} drop readout={false} values={done} locked={done} {...extra} />}
        note={(
          <div className="g10-side">
            {steps ? steps.slice(0, done ? steps.length : idx + 1).map((n, i) => <NoteLine key={i} i={i}>{typeof n === 'string' ? n : t(n)}</NoteLine>) : null}
            <Slot mh={56} className="g10-fb-sm">
              <Feedback show={done || miss} ok={done}>{t(done ? okText : wrongText)}</Feedback>
            </Slot>
          </div>
        )}
      />
    </>
  )
}

// SON KIRITISH. Variant tanlash EMAS -- o'quvchi javobni O'ZI yozadi.
// Tekshiruv HAQIQIY (son bilan solishtiriladi), shuning uchun ruxsat etilgan.
export function NumberEntry({ prompt, answer, okText, hints, audio, onSolved, compact }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [text, setText] = useState('')
  const [state, setState] = useState(null)
  const [tries, setTries] = useState(0)
  const [hint, setHint] = useState(null)

  const push = (ch) => {
    if (state === 'ok') return
    setState(null); setHint(null)
    setText((prev) => (prev.length >= 8 ? prev : prev + ch))
  }
  const back = () => { if (state !== 'ok') { setState(null); setHint(null); setText((p) => p.slice(0, -1)) } }

  const check = () => {
    const value = parseFloat(text.replace('−', '-').replace(',', '.'))
    if (Number.isNaN(value)) return
    if (Math.abs(value - answer) < 1e-6) {
      setState('ok'); setHint(okText || null)
      fx.right(okText)
      if (onSolved) onSolved({ correct: true, attempts: tries + 1 })
      return
    }
    const n = tries + 1
    setTries(n); setState('no')
    const which = hints && hints[Math.min(n, hints.length) - 1]
    setHint(which || null)
    fx.wrong(which || null)
  }

  const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ',', '−']
  return (
    <>
      {prompt ? <p className="g10-ask" style={compact ? { fontSize: 13 } : undefined}>{t(prompt)}</p> : null}
      <Slot mh={compact ? 40 : 46}>
        <div className={'g10-entry' + (state === 'ok' ? ' g10-entry-ok' : state === 'no' ? ' g10-entry-bad' : '')} style={compact ? { minHeight: 38, fontSize: 17 } : undefined}>
          <span>{text || ''}</span>
          {state !== 'ok' ? <span className="g10-entry-caret">|</span> : null}
        </div>
      </Slot>
      <Slot mh={compact ? 36 : 40}>
        <div className="g10-pad">
          {KEYS.map((k) => (
            <button type="button" key={k} className="g10-key" style={compact ? { minHeight: 34, fontSize: 13 } : undefined} disabled={state === 'ok'} onClick={() => push(k)}>{k}</button>
          ))}
        </div>
      </Slot>
      <Slot mh={compact ? 40 : 44}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <Btn tone="ghost" onClick={back} disabled={state === 'ok' || !text} style={compact ? { minHeight: 36, padding: '6px 14px' } : undefined}>⌫</Btn>
          <Btn tone="accent" ready={!!text && state !== 'ok'} onClick={check} disabled={!text || state === 'ok'} style={compact ? { minHeight: 36, padding: '6px 16px' } : undefined}>{t(UI.check)}</Btn>
        </div>
      </Slot>
      <Slot mh={compact ? 54 : 62} className={compact ? 'g10-fb-sm' : undefined}>
        <Feedback show={!!hint} ok={state === 'ok'}>{hint ? t(hint) : null}</Feedback>
      </Slot>
    </>
  )
}

// «Bunday bo'lishi mumkin emas»: avval o'quvchi O'ZI ko'tarishga urinadi,
// keyin dastur yozuv bo'yicha nuqta qo'yadi, keyin o'quvchi KONTRSONNI yozadi.
export function ReachLimit({ prompt, entry, okText, tryText, audio, onSolved }) {
  const t = useT()
  const [angle, setAngle] = useState(null)
  const [tries, setTries] = useState(0)
  const [phase, setPhase] = useState('try')

  const put = (deg) => {
    if (phase !== 'try') return
    setAngle(deg)
    const n = tries + 1
    setTries(n)
    if (Math.sin(rad(deg)) >= 0.97 || n >= 4) setPhase('ghost')
  }

  return (
    <>
      <p className="g10-ask">{t(prompt)}</p>
      <Scene
        fig={(
          <UnitCircle
            angle={phase === 'try' ? angle : 90}
            onAngle={put}
            ghost={phase === 'try' ? null : { x: 0.5, y: 1.2 }}
            counter={phase !== 'try'}
            drop
            readout={false}
            locked={phase !== 'try'}
            tween={false}
          />
        )}
        note={(
          <div className="g10-side">
            {phase === 'try' ? (
              <Slot mh={58} className="g10-fb-sm"><Feedback show={tries > 0} ok={false}>{t(tryText)}</Feedback></Slot>
            ) : (
              <>
                <NoteLine i={0}>sin α = 1,2</NoteLine>
                <NoteLine i={1}>cos²α = 1 − 1,44</NoteLine>
                <NumberEntry compact prompt={entry.prompt} answer={entry.answer} okText={okText} hints={entry.hints} audio={audio}
                  onSolved={() => { setPhase('done'); if (onSolved) onSolved({ correct: true }) }} />
              </>
            )}
          </div>
        )}
      />
    </>
  )
}

// Uch burchak jadvali: har qator RADIUS bilan tekshiriladi. Xato juftlik
// nuqtani aylanadan chiqarib yuboradi, dastur «noto'g'ri» demaydi.
export function TableFill({ rows, chips, onSolved, audio, wrongNote, swapNote, okText }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [filled, setFilled] = useState(() => rows.map(() => [null, null]))
  const [active, setActive] = useState([0, 0])
  const [checked, setChecked] = useState(false)
  const [hint, setHint] = useState(null)
  const [ghost, setGhost] = useState(null)

  const complete = filled.every((r) => r[0] !== null && r[1] !== null)
  const allRight = rows.every((r, i) => filled[i][0] === r.cos && filled[i][1] === r.sin)

  const put = (chipId) => {
    if (allRight && checked) return
    const next = filled.map((r) => r.slice())
    next[active[0]][active[1]] = chipId
    setFilled(next); setChecked(false); setHint(null); setGhost(null)
    for (let i = 0; i < rows.length; i += 1) {
      for (let j = 0; j < 2; j += 1) {
        if (next[i][j] === null) { setActive([i, j]); return }
      }
    }
  }

  const valueOf = (id) => { const c = chips.find((x) => x.id === id); return c ? c.value : 0 }
  const labelOf = (id) => { const c = chips.find((x) => x.id === id); return c ? c.label : '?' }

  const check = () => {
    setChecked(true)
    if (allRight) {
      fx.right(okText); setHint(null); setGhost(null)
      if (onSolved) onSolved({ correct: true })
      return
    }
    const bad = rows.findIndex((r, i) => filled[i][0] !== r.cos || filled[i][1] !== r.sin)
    const swapped = filled[bad][0] === rows[bad].sin && filled[bad][1] === rows[bad].cos
    setGhost({ x: valueOf(filled[bad][0]), y: valueOf(filled[bad][1]) })
    const note = swapped ? swapNote : wrongNote
    setHint(note)
    fx.wrong(note)
  }

  return (
    <Scene
      fig={<UnitCircle angle={rows[active[0]] ? rows[active[0]].deg : null} ghost={ghost} counter={!!ghost} readout={false} locked />}
      note={(
        <div className="g10-side">
          <Panel style={{ display: 'grid', gridTemplateColumns: '52px 70px 70px', gap: 5, alignItems: 'center' }}>
            <span className="g10-readout-key" />
            <span className="g10-readout-key">cos</span>
            <span className="g10-readout-key">sin</span>
            {rows.map((r, i) => (
              <React.Fragment key={r.deg}>
                <span className="g10-expr g10-expr-sm" style={{ fontWeight: 700 }}>{r.label}</span>
                {[0, 1].map((j) => {
                  const val = filled[i][j]
                  const right = checked && val === (j === 0 ? r.cos : r.sin)
                  const wrongCell = checked && val !== null && !right
                  const cls = ['g10-cell']
                  if (active[0] === i && active[1] === j && !allRight) cls.push('g10-cell-active')
                  if (right) cls.push('g10-cell-ok')
                  if (wrongCell) cls.push('g10-cell-bad')
                  return (
                    <button type="button" key={j} className={cls.join(' ')} onClick={() => { setActive([i, j]); setHint(null); setGhost(null) }}>
                      {val ? labelOf(val) : '?'}
                    </button>
                  )
                })}
              </React.Fragment>
            ))}
          </Panel>
          <Slot mh={40}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
              {chips.map((c) => (
                <button type="button" key={c.id} className="g10-chip" disabled={checked && allRight} onClick={() => put(c.id)}>{c.label}</button>
              ))}
            </div>
          </Slot>
          <Slot mh={42}>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <Btn tone="accent" ready={complete && !(checked && allRight)} onClick={check} disabled={!complete || (checked && allRight)}>{t(UI.check)}</Btn>
              {checked && !allRight ? (
                <Btn tone="ghost" onClick={() => { setFilled(rows.map(() => [null, null])); setActive([0, 0]); setChecked(false); setHint(null); setGhost(null) }}>{t(UI.reset)}</Btn>
              ) : null}
            </div>
          </Slot>
          <Slot mh={58} className="g10-fb-sm">
            <Feedback show={checked} ok={allRight}>{checked ? t(allRight ? okText : hint) : null}</Feedback>
          </Slot>
        </div>
      )}
    />
  )
}

// «O'zing yasa»: berilgan xossali nuqta. Tekshiruv KOORDINATA bilan,
// chorak NOMI bilan emas (chorak 4-darsda kiritiladi).
export function BuildPoint({ prompt, test, hints, okText, onSolved, audio, snap }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [angle, setAngle] = useState(null)
  const [state, setState] = useState(null)
  const [hint, setHint] = useState(null)

  const put = (deg) => {
    if (state === 'ok') return
    setAngle(deg)
    const c = Math.cos(rad(deg))
    const s = Math.sin(rad(deg))
    if (test(c, s)) {
      setState('ok'); setHint(okText || null)
      fx.right(okText)
      if (onSolved) onSolved({ correct: true })
      return
    }
    const which = hints.find((h) => h.when(c, s))
    setState('no'); setHint(which ? which.text : null)
    fx.wrong(which ? which.text : null)
  }

  return (
    <>
      <p className="g10-ask">{t(prompt)}</p>
      <Scene
        fig={<UnitCircle angle={angle} onAngle={put} snap={snap} locked={state === 'ok'} values={state === 'ok'} />}
        note={(
          <div className="g10-side">
            <Slot mh={70} className="g10-fb-sm">
              <Feedback show={!!hint} ok={state === 'ok'}>{hint ? t(hint) : null}</Feedback>
            </Slot>
          </div>
        )}
      />
    </>
  )
}
