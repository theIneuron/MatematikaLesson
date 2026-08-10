// ============================================================================
// 11-sinf ASBOBLARI. Har biri BIR marta yoziladi va hamma darsda ishlatiladi.
// Dars faqat MA'LUMOT beradi: qaysi tengsizlik, qaysi variantlar, qaysi razbor.
// Kontrakt: src/books/grade11/PODXOD_11SINF.md
//
// ASOSIY QOIDA (metodist qarori 2026-08-06): son o'qi HAR QADAMDA ishlamaydi.
// `SolutionLine` faqat ikki holatda yonadi:
//   1) qadam yechimlar to'plamini o'zgartirdi -> razbor sifatida;
//   2) o'quvchi javobni O'ZI yozdi -> tasdiq yoki rad.
// Sababi: Basadien tajribasi — o'quvchi ekranda ko'radi, qog'ozga ko'chira
// olmaydi. DTM da qog'ozda o'q bo'lmaydi.
//
// Xato javob naqshi: tovush -> variant SARIQ bo'ladi -> pastda Feedback ->
// 300 ms keyin AYNAN SHU variantning razbori OVOZ bilan aytiladi.
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Btn,
  Col,
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

// ============================================================
// SolutionLine -- son o'qi. KONTROLYOR, orakul emas.
// axis: { min, max, ticks: [{ v, label }] }
// sets: [{ from, to, tone: 'ink'|'accent'|'ok'|'tip', faded }]
//       from/to: son yoki null (cheksizlik)
// marks: [{ v, label, tone }]
// ============================================================
const TONES = { ink: T.ink, accent: T.accent, ok: T.ok, tip: T.tip, graph: T.graph, dim: T.ink3 }

export function SolutionLine({ axis, sets = [], marks = [], note, label }) {
  const W = 640
  const H = 44
  const padX = 30
  const y = 22
  const span = axis.max - axis.min
  const px = (v) => padX + ((v - axis.min) / span) * (W - padX * 2)
  const clamp = (v, fallback) => (v === null || v === undefined ? fallback : Math.max(axis.min, Math.min(axis.max, v)))

  return (
    <div style={{ width: '100%', flexShrink: 0, minWidth: 0 }}>
      {label ? <Tag tone="graph" style={{ marginBottom: 4 }}>{label}</Tag> : null}
      <svg viewBox={'0 0 ' + W + ' ' + H} width="100%" height={H} preserveAspectRatio="none" role="img">
        {/* mayda bo'linishlar -- laboratoriya o'lchov chizig'i hissi */}
        <g stroke={T.line} strokeWidth="1">
          {Array.from({ length: 21 }, (_, i) => {
            const x = padX + (i * (W - padX * 2)) / 20
            return <line key={i} x1={x} y1={y - 4} x2={x} y2={y + 4} opacity=".5" />
          })}
        </g>
        <line x1={padX - 20} y1={y} x2={W - padX + 20} y2={y} stroke="rgba(23,26,29,.28)" strokeWidth="1.6" />
        <polygon points={(W - padX + 20) + ',' + y + ' ' + (W - padX + 11) + ',' + (y - 4.5) + ' ' + (W - padX + 11) + ',' + (y + 4.5)} fill="rgba(23,26,29,.28)" />
        {sets.map((s2, i) => {
          const a = clamp(s2.from, axis.min)
          const b = clamp(s2.to, axis.max)
          const tone = TONES[s2.tone || 'accent']
          const op = s2.faded ? 0.2 : 1
          const dy = sets.length > 1 ? (i - (sets.length - 1) / 2) * 11 : 0
          return (
            <g key={i} opacity={op} className="g11-setline">
              <line x1={px(a)} y1={y + dy} x2={px(b)} y2={y + dy} stroke={tone} strokeWidth="6" strokeLinecap="butt" />
              {s2.from === null || s2.from === undefined ? (
                <polygon points={(px(a) - 12) + ',' + (y + dy) + ' ' + (px(a) - 1) + ',' + (y + dy - 6) + ' ' + (px(a) - 1) + ',' + (y + dy + 6)} fill={tone} />
              ) : (
                <circle cx={px(a)} cy={y + dy} r="5.6" fill={T.paper} stroke={tone} strokeWidth="3" />
              )}
              {s2.to === null || s2.to === undefined ? (
                <polygon points={(px(b) + 12) + ',' + (y + dy) + ' ' + (px(b) + 1) + ',' + (y + dy - 6) + ' ' + (px(b) + 1) + ',' + (y + dy + 6)} fill={tone} />
              ) : (
                <circle cx={px(b)} cy={y + dy} r="5.6" fill={T.paper} stroke={tone} strokeWidth="3" />
              )}
            </g>
          )
        })}
        {marks.map((m, i) => (
          <g key={'m' + i} className="g11-mark-in">
            <line x1={px(m.v)} y1={y - 17} x2={px(m.v)} y2={y + 17} stroke={TONES[m.tone || 'accent']} strokeWidth="2" strokeDasharray="3 3" />
            <circle cx={px(m.v)} cy={y - 17} r="3" fill={TONES[m.tone || 'accent']} />
          </g>
        ))}
      </svg>
      <div style={{ position: 'relative', height: 16 }}>
        {axis.ticks.map((tk) => (
          <span
            key={tk.v}
            className="g11-mono"
            style={{
              position: 'absolute',
              left: (px(tk.v) / W) * 100 + '%',
              transform: 'translateX(-50%)',
              fontSize: 12,
              fontWeight: 700,
              color: T.ink2,
            }}
          >
            {tk.label !== undefined ? tk.label : tk.v}
          </span>
        ))}
      </div>
      {note ? <div className="g11-expr g11-expr-sm" style={{ textAlign: 'center', color: T.ink2, marginTop: 2 }}><Fx>{note}</Fx></div> : null}
    </div>
  )
}

// ============================================================
// Probe -- bitta savol, aynan 4 variant.
// unscored=true (prognoz): yashil/qizil YO'Q, javob shunchaki yozib olinadi.
// ============================================================
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
      {/* Javob SAVOL satriga ko'chadi -- ilgari bu faqat ProbeChain da
          bor edi, ya'ni faqat ikki slaydda. Endi hamma savolda. */}
      {data.question ? (
        <p className="g11-ask">
          {t(data.question)}
          {picked && !unscored ? (
            <span className="g11-answer-in g11-ok-text g11-ans-tail">
              {'\u2192\u00a0\u00a0' + t((data.items.find((it) => it.id === picked) || {}).label)}
            </span>
          ) : null}
        </p>
      ) : null}
      <Options
        items={items}
        picked={picked}
        wrong={wrong}
        onPick={pick}
        disabled={disabled || (unscored && !!picked)}
        cols={cols}
        minH={minH}
        /* Javob savol satriga ko'chgan bo'lsa, variant yo'qoladi: matn
           ekranda ikki marta turmaydi. Prognoz savolida (unscored) va
           savolsiz Probe da eski holat saqlanadi. */
        vanish={!!data.question && !unscored}
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
        <div className="g11-in" style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {/* `ask: true` -- prompt GAP, o'ralishi kerak. Formula bo'lsa `Expr`
              (nowrap), aks holda uzun gap gorizontal oshib ketadi. */}
          {/* Savol ALOHIDA RAMKADA: ekranning asosiy obyekti u, variantlar
              emas. Javob shu ramka ichida, tenglik belgisidan keyin paydo
              bo'ladi -- ko'z boshqa joyga ko'chmaydi. */}
          {showPrompt && !current.ask
            ? (
              <div className="g11-qframe">
                <Expr size="quest">
                  {t(current.prompt)}
                  {okId ? (
                    <span className="g11-answer-in g11-ok-text" style={{ paddingLeft: '.4em' }}>
                      {(String(t(current.prompt)).trim().endsWith('=') ? '' : '\u2192  ')
                        + t((current.items.find((it) => it.id === okId) || {}).label)}
                    </span>
                  ) : null}
                </Expr>
              </div>
            )
            : (
              <div className="g11-qframe">
                <p className="g11-ask g11-ask-big">
                  {t(current.prompt)}
                  {okId ? (
                    <span className="g11-answer-in g11-ok-text g11-ans-tail">
                      {'\u2192\u00a0\u00a0' + t((current.items.find((it) => it.id === okId) || {}).label)}
                    </span>
                  ) : null}
                </p>
              </div>
            )}
          <Options
            items={(orders[idx] || current.items).map((it) => ({ id: it.id, label: t(it.label) }))}
            picked={okId}
            wrong={wrong}
            onPick={pick}
            cols={current.cols || cols}
            /* Javob ramka ichiga ko'chdi -- variant qolmaydi. */
            vanish={showPrompt}
          />
        </div>
      ) : null}
      <Slot mh={60}>
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
          <span className="g11-fold-list">
            {cards.map((c, i) => (
              <span key={c.id} className="g11-fold-item">
                <span className="g11-fold-num">{'0' + (i + 1)}</span>
                {t(c.short || c.title)}
              </span>
            ))}
          </span>
        </div>
      ) : null}

      {showTasks && reopen ? (
        <Panel tone="quiet" pad={9} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {cards.map((c, i) => (
            <div key={c.id} className="g11-fold-row">
              <span className="g11-fold-num">{'0' + (i + 1)}</span>
              <span className="g11-hint g11-wrap" style={{ color: T.ink, fontWeight: 600 }}>{t(c.title)}</span>
              {/* Misollar QATOR bo'lib yopishmasin: har biri alohida elementda.
                  Ilgari ular to'rt bo'shliq bilan bitta satrga ulanardi va
                  uchinchi tayanchda to'rtta tenglik ketma-ket chiqib ketardi. */}
              <span className="g11-fold-ex">
                {(c.ex || []).map((x, k) => (
                  <span key={k} className="g11-expr g11-expr-sm g11-wrap" style={{ color: T.graph }}>
                    <Fx>{x.e}</Fx>
                  </span>
                ))}
              </span>
            </div>
          ))}
          <Btn tone="ghost" onClick={() => setReopen(false)} style={{ minHeight: 34, alignSelf: 'flex-start' }}>
            {t(UI.supportHide)}
          </Btn>
        </Panel>
      ) : null}

      {!showTasks ? (
        <div className="g11-cols3">
          {cards.map((c, i) => {
            const on = i < open
            return (
              <Panel
                key={c.id}
                tone={on ? 'paper' : 'quiet'}
                className={on ? 'g11-reveal' : undefined}
                pad={10}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 5,
                  opacity: on ? 1 : 0.3,
                  transition: 'opacity .42s cubic-bezier(.22,.61,.36,1)',
                }}
              >
                <Tag tone={i === 2 ? 'graph' : 'quiet'}>{'0' + (i + 1)}</Tag>
                <span className="g11-hint g11-wrap" style={{ color: T.ink, fontWeight: 600, lineHeight: 1.3 }}>{t(c.title)}</span>
                {on ? (
                  /* Misollar KETMA-KET tushadi: ikkinchisi birinchisidan keyin.
                     Shunda ovoz «xuddi shunday...» deganda ko'z aynan o'sha
                     satrga tushadi. */
                  (c.ex || []).map((x, k) => (
                    <span
                      key={k}
                      className="g11-drop g11-ex"
                      style={{ animationDelay: k * 0.34 + 's' }}
                    >
                      <span className="g11-expr g11-expr-sm g11-wrap" style={{ color: T.graph }}><Fx>{x.e}</Fx></span>
                      {/* `why` FORMULA bo'lsa (oddiy satr) -- monoshirift;
                          PROZA bo'lsa (uch tilli L) -- Manrope. Monoshirift
                          faqat matematika uchun. */}
                      <span className="g11-ex-why g11-wrap">
                        {t(UI.why) + ' '}
                        <span className={typeof x.why === 'string' ? 'g11-mono' : undefined}>
                          <Fx>{t(x.why)}</Fx>
                        </span>
                      </span>
                    </span>
                  ))
                ) : (
                  <span className="g11-expr g11-expr-sm g11-dim">?</span>
                )}
              </Panel>
            )
          })}
        </div>
      ) : null}

      {showTasks ? (
        <div className="g11-in">
          <ProbeChain items={tasks} cols={2} audio={audio} onSolved={onSolved} onStep={onStep} showPrompt />
        </div>
      ) : null}
    </>
  )
}

// Nuqta tanlagich: alohida komponent, chunki 3-ekranda u CHAP ustunda turadi.
export function TestPointPicker({ points, shown, onPick, pickLabel, vertical = false, dense = false }) {
  const t = useT()
  return (
    <>
      {pickLabel ? <p className="g11-ask">{t(pickLabel)}</p> : null}
      <div
        className={vertical ? 'g11-pick-v' : undefined}
        style={{ display: 'flex', flexDirection: vertical ? 'column' : 'row', flexWrap: vertical ? 'nowrap' : 'wrap', gap: 8 }}
      >
        {points.map((p) => {
          const done = shown.indexOf(p.id) !== -1
          return (
            <button
              type="button"
              key={p.id}
              className={'g11-opt' + (done ? ' g11-opt-ok' : '')}
              style={{
                fontFamily: MATH_FONT,
                justifyContent: 'space-between',
                ...(dense ? { minHeight: 40, padding: '7px 13px' } : null),
              }}
              disabled={done}
              onClick={() => onPick(p)}
            >
              <span className="g11-opt-text">
                {p.label}
                {p.role ? <span className="g11-opt-role">{t(p.role)}</span> : null}
              </span>
              {done ? <span className="g11-opt-badge">{'\u2713'}</span> : null}
            </button>
          )
        })}
      </div>
    </>
  )
}

// Laboratoriya jadvali: qo'yish, hisoblash, xulosa.
export function TestPointTable({ points, shown, head }) {
  const t = useT()
  const verdictText = (v) => (v === 'in' ? t(UI.isIn) : v === 'out' ? t(UI.isNotIn) : t(UI.undef))
  return (
    <Panel style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {head ? (
        <div
          style={{ display: 'grid', gridTemplateColumns: '84px minmax(0,1.2fr) auto', gap: 10, alignItems: 'center' }}
        >
          {head.map((h, i) => (
            <span key={i} className="g11-tag g11-tag-quiet" style={{ justifySelf: i === 2 ? 'end' : 'start' }}>{t(h)}</span>
          ))}
        </div>
      ) : null}
      {points.map((p) => {
        const isShown = shown.indexOf(p.id) !== -1
        return (
          <div
            key={p.id}
            className="g11-expr g11-expr-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '84px minmax(0,1.2fr) auto',
              alignItems: 'center',
              gap: 10,
              minHeight: 34,
              opacity: isShown ? 1 : 0.26,
            }}
          >
            <span>{p.label}</span>
            <span className={'g11-wrap' + (isShown ? ' g11-drop' : '')}>
              <Fx>{isShown ? t(p.calc) : '?'}</Fx>
            </span>
            <span style={{ textAlign: 'right' }}>
              {isShown ? (
                <Tag tone={p.verdict === 'in' ? 'ok' : p.verdict === 'out' ? 'quiet' : 'tip'}>{verdictText(p.verdict)}</Tag>
              ) : null}
            </span>
          </div>
        )
      })}
    </Panel>
  )
}

export function TestPointRows({ points, pickLabel, onRevealed, onStep, single = false, sequential = false, subLabel, openCount }) {
  const t = useT()
  const [shown, setShown] = useState([])
  const [active, setActive] = useState(null)
  // `openCount` berilsa -- ochilishni OVOZ boshqaradi, tugma kerak emas.
  const narrated = openCount !== undefined

  const reveal = (p) => {
    if (shown.indexOf(p.id) !== -1) return
    setActive(p.id)
    const next = shown.concat(p.id)
    setShown(next)
    if (onStep) onStep(p.step || 'calc')
    if (onRevealed) onRevealed({ id: p.id, all: next.length >= points.length })
  }

  const verdictText = (v) => (v === 'in' ? t(UI.isIn) : v === 'out' ? t(UI.isNotIn) : t(UI.undef))
  const nextPoint = points.find((p) => shown.indexOf(p.id) === -1)
  const allShown = narrated ? openCount >= points.length : !nextPoint
  const isOpen = (p, i) => (narrated ? i < openCount : shown.indexOf(p.id) !== -1)

  return (
    <>
      {pickLabel && !allShown ? <p className="g11-ask g11-pickhide">{t(pickLabel)}</p> : null}
      {/* sequential: bitta tugma, navbatdagi nuqtani qo'yadi -- balandlik tejaydi */}
      <Slot mh={sequential && !narrated ? 44 : 0}>
        {sequential && !narrated && nextPoint ? (
          <Btn tone="soft" ready onClick={() => reveal(nextPoint)}>
            {t(subLabel)} {nextPoint.label}
          </Btn>
        ) : null}
      </Slot>
      {sequential || narrated ? null : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {points.map((p) => (
            <button
              type="button"
              key={p.id}
              className={'g11-opt' + (active === p.id ? ' g11-picked' : '')}
              style={{ minHeight: 36, width: 'auto', padding: '5px 13px', fontFamily: MATH_FONT, display: 'inline-flex' }}
              disabled={shown.indexOf(p.id) !== -1}
              onClick={() => reveal(p)}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
      <Panel style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {points.map((p, pi) => {
          const isShown = isOpen(p, pi)
          return (
            <div
              key={p.id}
              className="g11-expr g11-expr-row g11-tprow"
              style={{
                display: 'grid',
                gridTemplateColumns: single ? 'minmax(0,1fr) auto' : '100px minmax(0,1.2fr) auto',
                alignItems: 'center',
                gap: 8,
                minHeight: 30,
                opacity: isShown ? 1 : 0.28,
              }}
            >
              {single ? null : <span>{p.label}</span>}
              {/* `calc` uch tilli bo'lishi mumkin (ikki bilan solishtirish
                  so'z bilan yozilgan), shuning uchun `t()` SHART. */}
              <span className={'g11-wrap' + (isShown ? ' g11-in' : '')}>
                <Fx>{isShown ? t(p.calc) : '?'}</Fx>
              </span>
              <span style={{ textAlign: 'right' }}>
                {isShown ? (
                  <Tag tone={p.verdict === 'in' ? 'ok' : p.verdict === 'out' ? 'quiet' : 'tip'} className="g11-drop">
                    {verdictText(p.verdict)}
                  </Tag>
                ) : null}
              </span>
            </div>
          )
        })}
      </Panel>
    </>
  )
}

// ============================================================
// BaseSlider -- asosni surib, monotonlik qanday almashishini KO'RSATADI.
// a > 1 -> chiziq yuqoriga, 0 < a < 1 -> pastga, a = 1 -> logarifm YO'Q.
// Bu darsning butun ikkinchi blokining sababi, shuning uchun so'z emas,
// harakat bilan beriladi.
// ============================================================
export function BaseSlider({ height = 92, initial = 0.5, onChange, min = 0.2, max = 5, step = 0.05, mark }) {
  const t = useT()
  const [a, setA] = useState(initial)
  const W = 320
  const H = height
  const padL = 10
  const padR = 10
  const padT = 6
  const padB = 6
  const x0 = 0.08
  const x1 = 6
  const y0 = -3
  const y1 = 3
  const px = (x) => padL + ((x - x0) / (x1 - x0)) * (W - padL - padR)
  const py = (y) => padT + ((y1 - y) / (y1 - y0)) * (H - padT - padB)
  const isOne = Math.abs(a - 1) < 0.03
  const showOne = min < 1 && max > 1

  const path = useMemo(() => {
    if (Math.abs(a - 1) < 0.03) return ''
    const ln = Math.log(a)
    const pts = []
    for (let i = 0; i <= 160; i += 1) {
      const x = x0 + ((x1 - x0) * i) / 160
      const y = Math.log(x) / ln
      if (!isFinite(y) || y < y0 - 0.5 || y > y1 + 0.5) continue
      pts.push((pts.length ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(y).toFixed(1))
    }
    return pts.join(' ')
  }, [a]) // eslint-disable-line react-hooks/exhaustive-deps

  const grows = a > 1
  const tone = isOne ? T.tip : grows ? T.graph : T.accent

  return (
    <div className="g11-slider" style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <svg viewBox={'0 0 ' + W + ' ' + H} width="100%" height={H} role="img" style={{ display: 'block' }}>
        <line x1={padL} y1={py(0)} x2={W - padR} y2={py(0)} stroke="rgba(23,26,29,.26)" strokeWidth="1.2" />
        <line x1={px(1)} y1={padT} x2={px(1)} y2={H - padB} stroke={T.line} strokeWidth="1" strokeDasharray="3 3" />
        {path ? <path d={path} fill="none" stroke={tone} strokeWidth="2.6" strokeLinecap="round" /> : null}
        <text x={px(1)} y={H - 1} textAnchor="middle" fontSize="9" fill={T.ink3} fontFamily={MATH_FONT}>1</text>
        {/* Yo'nalish strelkasi: chiziq YUQORIGA yoki PASTGA ketishini ko'rsatadi */}
        {path ? (
          <g stroke={tone} strokeWidth="2" fill="none">
            <path d={grows
              ? 'M' + (W - padR - 26) + ' ' + (padT + 20) + ' l 9 -9 l 9 9'
              : 'M' + (W - padR - 26) + ' ' + (H - padB - 20) + ' l 9 9 l 9 -9'} />
          </g>
        ) : null}
      </svg>
      <input
        className="g11-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={a}
        aria-label="a"
        onChange={(e) => {
          const v = Number(e.target.value)
          setA(v)
          if (onChange) onChange(v)
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span className="g11-mono" style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>
          <Fx>{'a = ' + a.toFixed(2).replace('.', ',')}</Fx>
          {mark !== undefined ? (
            <span style={{ color: T.ink3, fontWeight: 600 }}><Fx>{'   \u00b7   ' + mark}</Fx></span>
          ) : null}
        </span>
        <Tag tone={isOne && showOne ? 'tip' : grows ? 'graph' : 'accent'}>
          {isOne && showOne ? t(UI_TXT.baseNo1) : grows ? t(UI_TXT.grows) : t(UI_TXT.falls)}
        </Tag>
      </div>
    </div>
  )
}

// ============================================================
// GraphProjection -- kirivi va uning o'qdagi SOYASI.
// ODZ shu yerda QOIDA emas: chegaradan chapda kirivi YO'Q.
// Fazalar: 0 bo'sh o'qlar, 1 kirivi, 2 gorizontal to'g'ri chiziq, 3 soya.
// ============================================================
export function GraphProjection({ fn, xDomain, yDomain, asymptote, hline, cross, shade, xTicks, yTicks, phase, shadeLabel, height = 190, probe = false, onProbe }) {
  const W = 640
  const H = height
  const padL = 44
  const padR = 26
  const padT = 14
  const padB = 34
  const [x0, x1] = xDomain
  const [y0, y1] = yDomain
  const px = (x) => padL + ((x - x0) / (x1 - x0)) * (W - padL - padR)
  const py = (y) => padT + ((y1 - y) / (y1 - y0)) * (H - padT - padB)

  const path = useMemo(() => {
    const pts = []
    const N = 300
    const start = asymptote !== undefined ? asymptote + (x1 - x0) / 8000 : x0
    for (let i = 0; i <= N; i += 1) {
      const x = start + ((x1 - start) * i) / N
      const y = fn(x)
      if (!isFinite(y)) continue
      if (y < y0 - 1 || y > y1 + 1) continue
      pts.push((pts.length ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(y).toFixed(1))
    }
    return pts.join(' ')
  }, [fn, x0, x1, y0, y1, asymptote]) // eslint-disable-line react-hooks/exhaustive-deps

  // Kirivi CHIZILADI: uzunlik HAQIQIY o'lchanadi, aks holda animatsiya
  // yarmi bo'sh o'tib, chiziq sakrab chiqadi.
  const pathRef = useRef(null)
  const [len, setLen] = useState(0)
  useEffect(() => {
    if (!pathRef.current) return
    try {
      const L = pathRef.current.getTotalLength()
      if (L && isFinite(L)) setLen(Math.ceil(L))
    } catch { /* jsdom da yo'q */ }
  }, [path])

  // Tortiladigan nuqta: o'quvchi kirivi bo'ylab yuradi va qaysi joyda logarifm
  // c dan kichik ekanini O'ZI ko'radi. Faqat 3-fazadan keyin.
  const [pX, setPX] = useState(null)
  const move = (evt) => {
    if (!probe || phase < 3) return
    const rect = evt.currentTarget.getBoundingClientRect()
    if (!rect.width) return
    const rel = ((evt.clientX - rect.left) / rect.width) * W
    const x = x0 + ((rel - padL) / (W - padL - padR)) * (x1 - x0)
    const lo = asymptote !== undefined ? asymptote + (x1 - x0) / 500 : x0
    const cx = Math.max(lo, Math.min(x1, x))
    setPX(cx)
    if (onProbe) onProbe({ x: cx, y: fn(cx) })
  }
  const pY = pX === null ? null : fn(pX)
  const shadeFrom = shade ? px(shade.from) : 0
  const shadeTo = shade ? px(shade.to) : 0
  const shadeW = Math.max(0, shadeTo - shadeFrom)

  return (
    <div style={{ width: '100%', flexShrink: 0, minWidth: 0 }}>
      <svg
        viewBox={'0 0 ' + W + ' ' + H}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        style={{ display: 'block', maxHeight: H, touchAction: probe ? 'none' : undefined, cursor: probe && phase >= 3 ? 'ew-resize' : undefined }}
        onPointerDown={(e) => { if (probe && phase >= 3) { e.currentTarget.setPointerCapture(e.pointerId); move(e) } }}
        onPointerMove={(e) => { if (e.buttons) move(e) }}
      >
        <defs>
          <linearGradient id="g11-areafill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={T.accent} stopOpacity=".22" />
            <stop offset="100%" stopColor={T.accent} stopOpacity=".04" />
          </linearGradient>
        </defs>

        {/* to'r */}
        <g stroke={T.line} strokeWidth="1" opacity=".55">
          {xTicks.map((tk) => (
            <line key={'gx' + tk.v} x1={px(tk.v)} y1={padT} x2={px(tk.v)} y2={H - padB} />
          ))}
          {yTicks.map((tk) => (
            <line key={'gy' + tk.v} x1={padL} y1={py(tk.v)} x2={W - padR} y2={py(tk.v)} />
          ))}
        </g>

        {/* o'qlar */}
        <line x1={padL} y1={py(0)} x2={W - padR} y2={py(0)} stroke="rgba(23,26,29,.34)" strokeWidth="1.5" />
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="rgba(23,26,29,.34)" strokeWidth="1.5" />

        {/* asimptota: chiziq bu yerdan CHAPDA mavjud emas */}
        {phase >= 1 && asymptote !== undefined ? (
          <g className="g11-in">
            <line x1={px(asymptote)} y1={padT} x2={px(asymptote)} y2={H - padB} stroke={T.tip} strokeWidth="1.6" strokeDasharray="5 4" />
            <rect x={padL} y={padT} width={Math.max(0, px(asymptote) - padL)} height={H - padT - padB} fill="rgba(23,26,29,.045)" />
          </g>
        ) : null}

        {/* kerakli qism ostidagi to'ldirish */}
        {phase >= 3 && shade ? (
          <rect x={shadeFrom} y={padT} width={shadeW} height={py(0) - padT} fill="url(#g11-areafill)" className="g11-in" />
        ) : null}

        {/* o'qdagi SOYA -- javob */}
        {phase >= 3 && shade ? (
          <g className="g11-in g11-d1">
            <rect x={shadeFrom} y={py(0) - 4} width={shadeW} height="8" fill={T.accent} rx="4" />
            <circle cx={shadeFrom} cy={py(0)} r="5.5" fill={T.paper} stroke={T.accent} strokeWidth="3" />
            <circle cx={shadeTo} cy={py(0)} r="5.5" fill={T.paper} stroke={T.accent} strokeWidth="3" />
          </g>
        ) : null}

        {/* gorizontal to'g'ri chiziq y = c */}
        {phase >= 2 && hline !== undefined ? (
          <line x1={padL} y1={py(hline)} x2={W - padR} y2={py(hline)} stroke={T.graph} strokeWidth="2.2" className="g11-in" />
        ) : null}

        {/* kirivi */}
        {phase >= 1 ? (
          <path
            ref={pathRef}
            d={path}
            fill="none"
            stroke={T.ink}
            strokeWidth="2.6"
            strokeLinecap="round"
            className={len ? 'g11-draw' : undefined}
            style={len ? { strokeDasharray: len, '--len': len } : undefined}
          />
        ) : null}

        {/* kesishish nuqtasi */}
        {phase >= 2 && cross !== undefined ? (
          <g className="g11-in g11-d1">
            <circle cx={px(cross)} cy={py(hline)} r="5.5" fill={T.graph} />
            <circle cx={px(cross)} cy={py(hline)} r="10" fill="none" stroke={T.graph} strokeWidth="1.2" opacity=".4" />
          </g>
        ) : null}

        {/* belgilar */}
        {xTicks.map((tk) => (
          <text key={'tx' + tk.v} x={px(tk.v)} y={H - padB + 17} textAnchor="middle" fontSize="12" fontWeight="700" fill={T.ink2} fontFamily={MATH_FONT}>
            {tk.label !== undefined ? tk.label : tk.v}
          </text>
        ))}
        {yTicks.map((tk) => (
          <text key={'ty' + tk.v} x={padL - 9} y={py(tk.v) + 4} textAnchor="end" fontSize="12" fontWeight="700" fill={T.ink2} fontFamily={MATH_FONT}>
            {tk.label !== undefined ? tk.label : tk.v}
          </text>
        ))}
        {/* tortiladigan nuqta */}
        {probe && phase >= 3 && pX !== null && isFinite(pY) ? (
          <g>
            <line x1={px(pX)} y1={py(pY)} x2={px(pX)} y2={py(0)} stroke={T.ink} strokeWidth="1" strokeDasharray="3 3" opacity=".5" />
            <circle cx={px(pX)} cy={py(pY)} r="7" fill={T.paper} stroke={pY < hline ? T.accent : T.ink2} strokeWidth="3" />
          </g>
        ) : null}
        {phase >= 3 && shadeLabel ? (
          <text x={(shadeFrom + shadeTo) / 2} y={H - padB + 30} textAnchor="middle" fontSize="13" fill={T.accent} fontWeight="700" fontFamily={MATH_FONT} className="g11-in g11-d2">
            {shadeLabel}
          </text>
        ) : null}
      </svg>
    </div>
  )
}

// ============================================================
// RuleGate -- SAVOL-OLDIN-QOIDA. Kartochka FAQAT to'g'ri javobdan keyin.
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

// ============================================================
// SignFill -- bitta uyaga belgi qo'yish. Tekshiruv SON QO'YIB bajariladi.
// ============================================================
export function SignFill({ template, signs, answer, checkNote, wrongs, prompt, onSolved, onStep, audio }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [filled, setFilled] = useState(null)
  const [checked, setChecked] = useState(false)
  const [hint, setHint] = useState(null)
  const correct = checked && filled === answer

  const check = () => {
    setChecked(true)
    if (filled === answer) {
      fx.right(checkNote)
      if (onStep) onStep('checked')
      if (onSolved) onSolved({ correct: true, filled })
      return
    }
    const w = (wrongs || []).find((x) => x.key === filled)
    const h = w ? w.hint : null
    setHint(h)
    fx.wrong(h)
  }

  return (
    <>
      {prompt ? <p className="g11-ask">{t(prompt)}</p> : null}
      <Panel className="g11-expr g11-expr-big" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', alignItems: 'center', minHeight: 64 }}>
        {template.map((piece, i) =>
          typeof piece === 'string' ? (
            /* Fx SHART: aks holda shablondagi `2x` tik, yuqoridagi
               tengsizlikdagi `2x` esa kursiv bo'lib, bir ifoda ikki xil
               teriladi. */
            <span key={i}><Fx>{piece}</Fx></span>
          ) : (
            <span
              key={i}
              className={'g11-slotframe' + (filled ? ' g11-snap' : '')}
              style={{
                minWidth: 54,
                minHeight: 50,
                padding: '0 10px',
                color: filled ? (correct ? T.ok : T.ink) : T.ink3,
                boxShadow: correct ? '0 0 0 2px ' + T.ok : undefined,
                background: correct ? T.okSoft : undefined,
              }}
            >
              {filled || '?'}
            </span>
          ),
        )}
      </Panel>
      <Slot mh={50}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {signs.map((s) => (
            <button
              type="button"
              key={s}
              className={'g11-opt' + (filled === s ? ' g11-picked' : '')}
              style={{ minHeight: 40, width: 'auto', padding: '6px 20px', fontFamily: MATH_FONT, display: 'inline-flex', justifyContent: 'center' }}
              disabled={correct}
              onClick={() => { setFilled(s); setChecked(false); setHint(null) }}
            >
              {s}
            </button>
          ))}
          <Btn tone="accent" ready={!!filled && !correct} onClick={check} disabled={!filled || correct}>
            {t(UI.check)}
          </Btn>
        </div>
      </Slot>
      <Slot mh={70}>
        {correct && checkNote ? <Feedback show ok>{t(checkNote)}</Feedback> : null}
        {!correct ? <Feedback show={!!hint} ok={false}>{hint ? t(hint) : null}</Feedback> : null}
      </Slot>
    </>
  )
}

// ============================================================
// AnswerInterval -- o'quvchi javobni O'ZI yozadi: ( a ; b ).
// Klaviatura kerak emas -- sonlar palitrasidan tanlanadi (telefon uchun).
// Bu asbob 7, 10 va 11-slaydlarda MAJBURIY: DTM da javobni qog'ozga yozish
// kerak, ekrandagi o'q u yerda bo'lmaydi.
// ============================================================
export function AnswerInterval({ numbers, answer, wrongs, prompt, onSolved, onStep, audio, padSlot = 44, fbSlot = 70 }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [slots, setSlots] = useState([null, null])
  const [active, setActive] = useState(0)
  const [checked, setChecked] = useState(false)
  const [hint, setHint] = useState(null)
  const full = slots[0] !== null && slots[1] !== null
  const correct = checked && slots[0] === answer[0] && slots[1] === answer[1]

  const put = (n) => {
    if (correct) return
    const next = slots.slice()
    next[active] = n
    setSlots(next)
    setChecked(false)
    setHint(null)
    setActive(active === 0 ? 1 : 0)
  }

  const check = () => {
    setChecked(true)
    if (slots[0] === answer[0] && slots[1] === answer[1]) {
      fx.right(null)
      if (onStep) onStep('answered')
      if (onSolved) onSolved({ correct: true, answer: slots })
      return
    }
    const key = slots[0] + '|' + slots[1]
    const exact = (wrongs || []).find((x) => x.key === key)
    const any = (wrongs || []).find((x) => x.key === '*')
    const h = (exact && exact.hint) || (any && any.hint) || null
    setHint(h)
    fx.wrong(h)
    if (onSolved) onSolved({ correct: false, answer: slots })
  }

  return (
    <>
      {prompt ? <p className="g11-ask">{t(prompt)}</p> : null}
      <div className="g11-expr g11-expr-big" style={{ display: 'flex', gap: 7, justifyContent: 'center', alignItems: 'center', minHeight: 58 }}>
        <span>(</span>
        {[0, 1].map((i) => (
          <button
            type="button"
            key={i}
            className={'g11-slotframe' + (active === i && !correct ? ' g11-picked' : '') + (slots[i] !== null ? ' g11-snap' : '')}
            style={{
              minWidth: 64, minHeight: 50, padding: '0 10px', cursor: 'pointer', font: 'inherit',
              color: slots[i] !== null ? (correct ? T.ok : T.ink) : T.ink3,
              background: correct ? T.okSoft : 'rgba(255,253,248,.75)',
              boxShadow: correct ? '0 0 0 2px ' + T.ok : undefined,
            }}
            onClick={() => { setActive(i); setHint(null) }}
          >
            {slots[i] !== null ? slots[i] : '?'}
          </button>
        ))}
        <span>)</span>
        <span style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>;</span>
      </div>
      <Slot mh={padSlot}>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
          {numbers.map((n) => (
            <button
              type="button"
              key={n}
              className="g11-opt"
              style={{ minHeight: 38, width: 'auto', padding: '5px 14px', fontFamily: MATH_FONT, display: 'inline-flex', justifyContent: 'center' }}
              disabled={correct}
              onClick={() => put(n)}
            >
              {n}
            </button>
          ))}
          <Btn tone="accent" ready={full && !correct} onClick={check} disabled={!full || correct}>
            {t(UI.check)}
          </Btn>
        </div>
      </Slot>
      <Slot mh={fbSlot}>
        <Feedback show={!!hint && !correct} ok={false}>{hint ? t(hint) : null}</Feedback>
      </Slot>
    </>
  )
}

// ============================================================
// TransformChain -- qadamba-qadam qayta yozish. Darsning ish oti.
// O'quvchi AMALNI tanlaydi, yangi satr paydo bo'ladi. «Darrov javob» YO'Q.
// Son o'qi FAQAT xato qadamda yonadi (razbor) -- shuning uchun to'g'ri
// yechganda o'quvchi qog'ozdagidek toza yozuv bilan ishlaydi.
// ============================================================
export function TransformChain({ start, steps, actions, axis, correctSet, answer, onSolved, onStep, audio, noLine = false, hintText, split = false, solo = false }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [lines, setLines] = useState([start])
  const [hint, setHint] = useState(null)
  const [wrongSet, setWrongSet] = useState(null)
  const [shake, setShake] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)
  // solo: qadam tugmalari boshida YO'Q, faqat maslahat ochilganda chiqadi.
  const [stepsOpen, setStepsOpen] = useState(!solo)

  const stepIdx = lines.length - 1
  const step = steps[stepIdx]
  const finished = solo && !stepsOpen ? true : stepIdx >= steps.length

  const act = (actionId) => {
    if (!step) return
    if (actionId === step.action) {
      const next = lines.concat(step.to)
      setLines(next)
      setHint(null)
      setWrongSet(null)
      fx.right(null)
      if (onStep) onStep('step' + next.length)
      return
    }
    const w = (step.wrongs || []).find((x) => x.action === actionId)
    setHint(w ? w.hint : step.needHint || null)
    setWrongSet(w && w.set ? w.set : null)
    setShake((s) => s + 1)
    fx.wrong(w ? w.hint : step.needHint)
  }

  const showLine = !noLine && (wrongSet || answered)

  const notebook = (
    <>
      <Panel>
        <div className="g11-note-lines">
          {lines.map((line, i) => (
            <div
              key={i}
              className={'g11-expr g11-expr-row' + (i === lines.length - 1 && i > 0 ? ' g11-drop' : '')}
              style={{ minHeight: 32, display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <span className="g11-mono" style={{ fontSize: '.6em', color: T.ink3, minWidth: 14, fontWeight: 700 }}>{i + 1}</span>
              {/* Fx BITTA span ichida bo'lishi SHART. To'g'ridan-to'g'ri flex
                  ichiga qo'yilsa, `log`, indeks va qolgan qism ALOHIDA flex
                  elementga aylanadi va `gap: 10` ularni bir-biridan uzoqlash-
                  tiradi: ekranda `log ₀,₅` bo'lib ko'rinardi. */}
              <span style={{ minWidth: 0 }}><Fx>{line}</Fx></span>
            </div>
          ))}
          {!finished ? (
            <div className="g11-expr g11-expr-row g11-slotframe" style={{ minHeight: 32, opacity: 0.55, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>?</div>
          ) : null}
        </div>
      </Panel>
      {/* Qadam yechimlar to'plamini o'zgartirgani -- ALOHIDA aytiladi.
          11-ekranda son o'qi yo'q, shuning uchun bu belgi yagona signal. */}
      <Slot mh={24}>
        {wrongSet ? <Tag tone="tip" className="g11-in">{t(UI_TXT.setChanged)}</Tag> : null}
      </Slot>
      <Slot mh={noLine ? 0 : 58}>
        {showLine ? (
          <SolutionLine
            axis={axis}
            sets={
              wrongSet
                ? [{ ...correctSet, tone: 'ok', faded: true }, { ...wrongSet, tone: 'tip' }]
                : [{ ...correctSet, tone: 'ok' }]
            }
          />
        ) : null}
      </Slot>
    </>
  )

  const controls = (
    <>
      {!finished ? (
        <div className="g11-shakebox" style={{ width: '100%' }}>
          <div key={shake} className={shake ? 'g11-shake' : undefined}>
            <Options
              items={actions.map((a2) => ({ id: a2.id, label: t(a2.label) }))}
              picked={null}
              wrong={[]}
              onPick={(o) => act(o.id)}
              cols={split ? 1 : 2}
              collapse={false}
              badges={false}
              dense
            />
          </div>
        </div>
      ) : (
        <AnswerInterval
          numbers={answer.numbers}
          answer={answer.value}
          wrongs={answer.wrongs}
          prompt={answer.prompt || UI.writeAnswer}
          padSlot={answer.padSlot}
          fbSlot={answer.fbSlot}
          audio={audio}
          onStep={onStep}
          onSolved={(r) => {
            if (r.correct) {
              setAnswered(true)
              if (onSolved) onSolved({ correct: true, lines })
            }
          }}
        />
      )}

      {!finished ? (
        <Slot mh={68}>
          <Feedback show={!!hint || hintOpen} ok={false}>
            {hintOpen && !hint ? t(hintText) : hint ? t(hint) : null}
          </Feedback>
        </Slot>
      ) : null}

      {/* Maslahat FAQAT tugma bilan, o'zi chiqmaydi va javobni ochmaydi. */}
      {/* Maslahat FAQAT tugma bilan. solo rejimida u qadam tugmalarini ham
          ochadi -- javobni ochmaydi. */}
      {hintText && !(hintOpen && stepsOpen) ? (
        <Slot mh={38}>
          <Btn
            tone="ghost"
            onClick={() => { setHintOpen(true); setStepsOpen(true) }}
            style={{ alignSelf: 'flex-start' }}
          >
            {t(UI.hint)}
          </Btn>
        </Slot>
      ) : null}
      {solo && hintOpen ? (
        <Slot mh={68}>
          <Feedback show ok={false}>{t(hintText)}</Feedback>
        </Slot>
      ) : null}
    </>
  )

  if (split) {
    return (
      <Cols l={1.15} r={1}>
        <Col>{notebook}</Col>
        <Col>{controls}</Col>
      </Cols>
    )
  }

  return (
    <>
      {notebook}
      {controls}
    </>
  )
}

// ============================================================
// AuditRows -- BIRINCHI xato qadamni topish. Javobdan keyin xato SON QO'YIB
// isbotlanadi. 11-sinfda MAJBURIY asbob: javobni tekshirmaslik KUCHLILARNING
// xatosi (Ganesan & Dindyal: yuqori uchdan birda 26,9%, pastda 7,9%).
// ============================================================
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
              className={'g11-opt' + (isAnswer ? ' g11-opt-ok' : '') + (isWrongPick ? ' g11-opt-tip' : '')}
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
              <span className="g11-opt-badge">{i + 1}</span>
              <span className="g11-opt-text">{row.text}</span>
            </button>
          )
        })}
      </Panel>
      {solved && proof && !hideProof ? (
        <Panel tone="teal" className="g11-in" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Tag tone="graph">{t(UI.testPoint)}</Tag>
          <span className="g11-expr g11-expr-sm g11-wrap" style={{ color: T.ink }}><Fx>{t(proof)}</Fx></span>
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
// BuildExpr -- TESKARI masala: berilgan yechimlar to'plami bo'yicha
// tengsizlikni yig'ish. Struktura tushunilganini to'g'ridan-to'g'ri
// hisoblashdan yaxshiroq ko'rsatadi.
// ============================================================
export function BuildExpr({ tasks, onSolved, onStep, audio }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [idx, setIdx] = useState(0)
  const [done, setDone] = useState([])
  const [slots, setSlots] = useState({})
  const [active, setActive] = useState(0)
  const [checked, setChecked] = useState(false)
  const [hint, setHint] = useState(null)

  const task = tasks[idx]
  if (!task) return <DoneRow>{done.join('   ')}</DoneRow>

  const nSlots = task.template.filter((p) => typeof p !== 'string').length
  const filledAll = Array.from({ length: nSlots }, (_, i) => slots[i]).every((v) => v !== undefined)
  const key = Array.from({ length: nSlots }, (_, i) => slots[i]).join('|')
  const correct = checked && key === task.answer.join('|')

  const put = (p) => {
    if (correct) return
    const next = { ...slots, [active]: p }
    setSlots(next)
    setChecked(false)
    setHint(null)
    let free = -1
    for (let i = 0; i < nSlots; i += 1) if (next[i] === undefined) { free = i; break }
    setActive(free === -1 ? active : free)
  }

  const check = () => {
    setChecked(true)
    if (key === task.answer.join('|')) {
      fx.right(null)
      if (onStep) onStep('built' + (idx + 1))
      setTimeout(() => {
        setDone((prev) => prev.concat(t(task.doneLabel)))
        setSlots({})
        setActive(0)
        setChecked(false)
        setHint(null)
        const next = idx + 1
        setIdx(next)
        if (next >= tasks.length && onSolved) onSolved({ correct: true })
      }, 1500)
      return
    }
    const w = (task.wrongs || []).find((x) => x.key === key)
    const any = (task.wrongs || []).find((x) => x.key === '*')
    const h = (w && w.hint) || (any && any.hint) || null
    setHint(h)
    fx.wrong(h)
  }

  return (
    <>
      {done.map((d, i) => <DoneRow key={i}>{d}</DoneRow>)}
      <p className="g11-ask">{t(task.prompt)}</p>
      <Panel className="g11-expr g11-expr-big" style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center', alignItems: 'center', minHeight: 64 }}>
        {task.template.map((piece, i) => {
          if (typeof piece === 'string') return <span key={i}>{piece}</span>
          // Uya raqami shablonda oldindan yozilgan -- render vaqtida
          // hisoblagichni o'zgartirmaymiz.
          const si = piece.slot
          return (
            <button
              type="button"
              key={i}
              className={'g11-slotframe' + (active === si && !correct ? ' g11-picked' : '') + (slots[si] !== undefined ? ' g11-snap' : '')}
              style={{
                minWidth: 62, minHeight: 50, padding: '0 8px', cursor: 'pointer', font: 'inherit',
                color: slots[si] !== undefined ? (correct ? T.ok : T.ink) : T.ink3,
                background: correct ? T.okSoft : 'rgba(255,253,248,.75)',
                boxShadow: correct ? '0 0 0 2px ' + T.ok : undefined,
              }}
              onClick={() => { setActive(si); setHint(null) }}
            >
              {slots[si] !== undefined ? slots[si] : '?'}
            </button>
          )
        })}
      </Panel>
      <Slot mh={48}>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
          {task.parts.map((p) => (
            <button
              type="button"
              key={p}
              className="g11-opt"
              style={{ minHeight: 38, width: 'auto', padding: '5px 13px', fontFamily: MATH_FONT, display: 'inline-flex', justifyContent: 'center' }}
              disabled={correct}
              onClick={() => put(p)}
            >
              {p}
            </button>
          ))}
          <Btn tone="accent" ready={filledAll && !correct} onClick={check} disabled={!filledAll || correct}>
            {t(UI.check)}
          </Btn>
        </div>
      </Slot>
      <Slot mh={50}>
        {correct && task.axis ? (
          <SolutionLine axis={task.axis} sets={[{ ...task.set, tone: 'ok' }]} note={t(task.matchedLabel)} />
        ) : null}
      </Slot>
      <Slot mh={68}>
        <Feedback show={!!hint && !correct} ok={false}>{hint ? t(hint) : null}</Feedback>
      </Slot>
    </>
  )
}
