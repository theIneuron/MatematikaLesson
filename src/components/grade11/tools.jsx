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
  isTri,
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
  // Ikki ildiz orasidagi bog'lovchi. Bu SO'Z, belgi emas: `;` ni ovoz o'qimaydi
  // va ekranda ham javob «nol nuqta-vergul ikki» bo'lib ko'rinardi.
  andWord: L('va', 'и', 'and'),
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
          <Fx>{t(data.question)}</Fx>
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
                  <Fx>{t(current.prompt)}</Fx>
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
                  <Fx>{t(current.prompt)}</Fx>
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
          {/* KO'RINADIGAN tugma: ovoz uni va'da qiladi, demak u ekranda
              yozuvdan farq qilishi SHART. Ilgari `ghost` edi -- shaffof
              fon, ramkasiz. */}
          <Btn tone="soft" onClick={() => setReopen(true)} style={{ minHeight: 40 }}>
            {'▾  ' + t(UI.supportShow)}
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
          <Btn tone="soft" onClick={() => setReopen(false)} style={{ minHeight: 34, alignSelf: 'flex-start' }}>
            {'▴  ' + t(UI.supportHide)}
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

// `lock` -- ko'rsatma TUGAMAGUNCHA tugma bosilmaydi. Busiz o'quvchi birinchi
// soniyada bosib yuborardi: bosish `on_event` ni uyg'otadi, ovoz joriy gapni
// uzib keyingisiga sakraydi, va tekshirish MEZONI aytilgan ikki gap butunlay
// tushib qolardi.
export function TestPointRows({ points, pickLabel, onRevealed, onStep, single = false, sequential = false, subLabel, openCount, lock = false }) {
  const t = useT()
  const [shown, setShown] = useState([])
  const [active, setActive] = useState(null)
  // `openCount` berilsa -- ochilishni OVOZ boshqaradi, tugma kerak emas.
  const narrated = openCount !== undefined

  const reveal = (p) => {
    if (lock) return
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
      {/* Yozuv QOLADI: u ko'rsatma, harakat emas. Faqat TUGMA yopiladi --
          shunda blok balandligi ham o'zgarmaydi (tugma `Slot` ichida). */}
      {pickLabel && !allShown ? <p className="g11-ask g11-pickhide">{t(pickLabel)}</p> : null}
      {/* sequential: bitta tugma, navbatdagi nuqtani qo'yadi -- balandlik tejaydi.
          Joy `Slot` bilan OLDINDAN band: tugma chiqqanda ekran sakramaydi. */}
      <Slot mh={sequential && !narrated ? 44 : 0}>
        {sequential && !narrated && nextPoint && !lock ? (
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
              disabled={lock || shown.indexOf(p.id) !== -1}
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
              {/* Nom ustuni 100px, `g11-expr` esa nowrap qo'yadi: uzunroq
                  nom («orol, orol») telefonda chetdan chiqib ketardi va buni
                  faqat kesilish tekshiruvi ko'rardi. Nom PROZA, unga wrap. */}
              {single ? null : <span className="g11-wrap">{p.label}</span>}
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
// `drop` va `hline2` -- TENGLAMA rejimi (9-dars). Tengsizlikda javob ORALIQ va
// u `shade` bilan bo'yaladi; tenglamada javob NUQTA, shuning uchun kesishishdan
// o'qqa tushadigan chiziq kerak. `hline2` esa kirivi bilan UCHRASHMAYDIGAN
// to'g'ri chiziq: «yechim yo'q» shu bilan ko'rsatiladi, so'z bilan emas.
export function GraphProjection({ fn, xDomain, yDomain, asymptote, hline, hline2, cross, drop, dropLabel, shade, xTicks, yTicks, phase, shadeLabel, height = 190, probe = false, onProbe }) {
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
    <div className="g11-graph" style={{ width: '100%', flexShrink: 0, minWidth: 0 }}>
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

        {/* kerakli qism ostidagi to'ldirish -- 3-qadam: «kirivi to'g'ri
            chiziqdan past bo'lgan joy» */}
        {phase >= 3 && shade ? (
          <rect x={shadeFrom} y={padT} width={shadeW} height={py(0) - padT} fill="url(#g11-areafill)" className="g11-in" />
        ) : null}

        {/* O'QDAGI SOYA -- bu JAVOB, va u ALOHIDA 4-qadam.
            Ilgari to'ldirish bilan BIRGA chiqardi: ekranda javob «mana shu
            qism» gapida turardi, «o'qdagi soyaga qarang, javob shu» gapi esa
            yetti yarim sekunddan keyin kelardi -- slaydning cho'qqisi bo'shga
            aytilardi. Javob endi AYNAN o'sha gapda ochiladi. */}
        {phase >= 4 && shade ? (
          <g className="g11-in">
            <rect x={shadeFrom} y={py(0) - 4} width={shadeW} height="8" fill={T.accent} rx="4" />
            <circle cx={shadeFrom} cy={py(0)} r="5.5" fill={T.paper} stroke={T.accent} strokeWidth="3" />
            <circle cx={shadeTo} cy={py(0)} r="5.5" fill={T.paper} stroke={T.accent} strokeWidth="3" />
          </g>
        ) : null}

        {/* gorizontal to'g'ri chiziq y = c */}
        {phase >= 2 && hline !== undefined ? (
          <line x1={padL} y1={py(hline)} x2={W - padR} y2={py(hline)} stroke={T.graph} strokeWidth="2.2" className="g11-in" />
        ) : null}

        {/* IKKINCHI to'g'ri chiziq -- u kirivi bilan UCHRASHMAYDI. Uzuq chiziq
            bilan chiziladi: bu «bor, lekin kesishmaydi» degani. */}
        {phase >= 4 && hline2 !== undefined ? (
          <line x1={padL} y1={py(hline2)} x2={W - padR} y2={py(hline2)} stroke={T.tip} strokeWidth="2.2" strokeDasharray="7 5" className="g11-in" />
        ) : null}

        {/* NUQTA rejimi: kesishishdan o'qqa tushish. Javob shu nuqta. */}
        {phase >= 3 && drop && cross !== undefined && hline !== undefined ? (
          <g className="g11-in">
            <line x1={px(cross)} y1={py(hline)} x2={px(cross)} y2={py(0)} stroke={T.accent} strokeWidth="2" strokeDasharray="4 3" />
            <circle cx={px(cross)} cy={py(0)} r="5.5" fill={T.accent} />
          </g>
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
        {/* Javob yozuvi ham 4-qadamda: soya bilan bir vaqtda. */}
        {phase >= 4 && shadeLabel ? (
          <text x={(shadeFrom + shadeTo) / 2} y={H - padB + 30} textAnchor="middle" fontSize="13" fill={T.accent} fontWeight="700" fontFamily={MATH_FONT} className="g11-in g11-d1">
            {shadeLabel}
          </text>
        ) : null}
        {/* Nuqta rejimida javob yozuvi tushish bilan BIR VAQTDA: aks holda
            «mana ildiz» degan gap bo'shga aytilardi. */}
        {phase >= 3 && drop && dropLabel && cross !== undefined ? (
          <text x={px(cross)} y={H - padB + 30} textAnchor="middle" fontSize="13" fill={T.accent} fontWeight="700" fontFamily={MATH_FONT} className="g11-in g11-d1">
            {dropLabel}
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
            /* Qonun FORMULA ham, SO'Z ham bo'lishi mumkin («sistema = VA»),
               shuning uchun `t()` SHART. */
            law={t(card.law)}
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
  // «Belgi» har doim ham belgi emas: 22-darsda tanlov `mediana` va
  // `o'rtacha` so'zlari orasida, ya'ni uch tilli obyekt. Obyekt holida u
  // React ga tushib ekranni yiqitardi, va hamma tugmalar bitta kalit olardi.
  // Shuning uchun bu yerda hammasi bir marta satrga keltiriladi.
  const tri = (v) => (isTri(v) ? t(v) : v)
  const signList = (signs || []).map(tri)
  const ans = tri(answer)
  const wrongList = (wrongs || []).map((w) => ({ ...w, key: tri(w.key) }))
  const correct = checked && filled === ans

  const check = () => {
    setChecked(true)
    if (filled === ans) {
      fx.right(checkNote)
      if (onStep) onStep('checked')
      if (onSolved) onSolved({ correct: true, filled })
      return
    }
    const w = wrongList.find((x) => x.key === filled)
    const h = w ? w.hint : null
    setHint(h)
    fx.wrong(h)
  }

  return (
    <>
      {prompt ? <p className="g11-ask">{t(prompt)}</p> : null}
      <Panel className="g11-expr g11-expr-big" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', alignItems: 'center', minHeight: 64 }}>
        {/* Shablon bo'lagi SO'Z ham bo'lishi mumkin («narx · »), shuning
            uchun uya `slot` maydoni bo'yicha aniqlanadi, «satr emas» degan
            mezon bo'yicha emas. */}
        {template.map((piece, i) =>
          !(piece && typeof piece === 'object' && piece.slot !== undefined) ? (
            /* Fx SHART: aks holda shablondagi `2x` tik, yuqoridagi
               tengsizlikdagi `2x` esa kursiv bo'lib, bir ifoda ikki xil
               teriladi. */
            <span key={i}><Fx>{t(piece)}</Fx></span>
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
          {signList.map((s) => (
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
      <div className="g11-expr g11-expr-big g11-ansbox" style={{ display: 'flex', gap: 7, justifyContent: 'center', alignItems: 'center', minHeight: 58 }}>
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
// AnswerValue -- o'quvchi javobni SON bilan yozadi: x = ⬚  (yoki ikkita ildiz).
//
// `AnswerInterval` dan farqi: u oraliq uchun, bu esa TENGLAMA javobi uchun.
// Tenglamalar darslarida (9, 11, 13) javob nuqta, oraliq emas.
//
// IKKI ILDIZ. `slots: 2` da tartib AHAMIYATSIZ: «nol va ikki» ham, «ikki va
// nol» ham to'g'ri. Va tekshirish BITTA katak to'ldirilganda ham ishlaydi --
// aks holda «men bitta ildiz topdim» degan xato UMUMAN bildirilmasdi, va eng
// muhim razbor («ikkinchisini ham tekshiring») hech qachon chiqmasdi.
// ============================================================
// `labels` -- HAR katakka o'z yorlig'i: sistemada javob JUFT bo'ladi
// (`x = 2`, `y = 1`), va ularni «va» bilan ulash ma'noni buzadi.
export function AnswerValue({ numbers: rawNumbers, answer: rawAnswer, wrongs: rawWrongs, prompt, onSolved, onStep, audio, slots = 1, label = 'x =', labels, padSlot = 44, fbSlot = 70 }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [cells, setCells] = useState(() => Array.from({ length: slots }, () => null))
  const [active, setActive] = useState(0)
  const [checked, setChecked] = useState(false)
  const [hint, setHint] = useState(null)

  // Javob har doim ham son emas: 23-darsda palitrada `umumiy sabab` kabi
  // SO'ZLAR turadi, ya'ni uch tilli obyektlar. Obyekt React ga tushsa ekran
  // yiqiladi va hamma tugma bitta kalit oladi. Kalit massiv ham bo'lishi
  // mumkin -- bir necha uyali javobda uni qo'lda birlashtirib bo'lmaydi.
  const tri = (v) => (isTri(v) ? t(v) : v)
  const numbers = (rawNumbers || []).map(tri)
  const answer = (rawAnswer || []).map(tri)
  const wrongs = (rawWrongs || []).map((w) => ({
    ...w,
    key: Array.isArray(w.key) ? w.key.map(tri).join('|') : tri(w.key),
  }))

  const filled = cells.filter((c) => c !== null)
  // Yorliqli kataklarda TARTIB muhim: `x = 2, y = 1` va `x = 1, y = 2` -- ikki
  // xil javob. Yorliqsiz (ikki ildiz) esa tartib ahamiyatsiz.
  const norm = (list) => (labels ? list.join('|') : list.slice().sort().join('|'))
  const isRight = filled.length === answer.length && norm(filled) === norm(answer)
  const correct = checked && isRight

  const put = (n) => {
    if (correct) return
    const next = cells.slice()
    next[active] = n
    setCells(next)
    setChecked(false)
    setHint(null)
    setActive(slots === 1 ? 0 : (active + 1) % slots)
  }

  const clear = () => {
    if (correct) return
    setCells(Array.from({ length: slots }, () => null))
    setActive(0)
    setChecked(false)
    setHint(null)
  }

  const check = () => {
    setChecked(true)
    if (isRight) {
      fx.right(null)
      if (onStep) onStep('answered')
      if (onSolved) onSolved({ correct: true, answer: filled })
      return
    }
    const key = norm(filled)
    const exact = (wrongs || []).find((x) => norm(String(x.key).split('|')) === key)
    const any = (wrongs || []).find((x) => x.key === '*')
    const h = (exact && exact.hint) || (any && any.hint) || null
    setHint(h)
    fx.wrong(h)
    if (onSolved) onSolved({ correct: false, answer: filled })
  }

  return (
    <>
      {prompt ? <p className="g11-ask">{t(prompt)}</p> : null}
      <div className="g11-expr g11-expr-big g11-ansbox" style={{ display: 'flex', gap: 7, justifyContent: 'center', alignItems: 'center', minHeight: 58, flexWrap: 'wrap' }}>
        {labels ? null : <span><Fx>{label}</Fx></span>}
        {cells.map((v, i) => (
          <React.Fragment key={i}>
            {labels
              ? <span style={{ marginLeft: i > 0 ? 10 : 0 }}><Fx>{labels[i]}</Fx></span>
              : (i > 0 ? <span className="g11-expr g11-expr-sm" style={{ color: T.ink3 }}>{t(UI.andWord)}</span> : null)}
            <button
              type="button"
              className={'g11-slotframe' + (active === i && !correct ? ' g11-picked' : '') + (v !== null ? ' g11-snap' : '')}
              style={{
                minWidth: 64, minHeight: 50, padding: '0 10px', cursor: 'pointer', font: 'inherit',
                color: v !== null ? (correct ? T.ok : T.ink) : T.ink3,
                background: correct ? T.okSoft : 'rgba(255,253,248,.75)',
                boxShadow: correct ? '0 0 0 2px ' + T.ok : undefined,
              }}
              onClick={() => { setActive(i); setHint(null) }}
            >
              {v !== null ? v : '?'}
            </button>
          </React.Fragment>
        ))}
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
          {slots > 1 && !correct ? (
            <Btn tone="ghost" onClick={clear}>{t(UI.reset)}</Btn>
          ) : null}
          <Btn tone="accent" ready={filled.length > 0 && !correct} onClick={check} disabled={!filled.length || correct}>
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
              {/* Qadam FORMULA ham, GAP ham bo'lishi mumkin («argument 12 > 0 —
                  ildiz qoladi»), shuning uchun `t()` SHART: aks holda uch tilli
                  qiymat React bolasi sifatida tushib, ekran yiqilardi. */}
              <span style={{ minWidth: 0 }}><Fx>{t(line)}</Fx></span>
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
        /* Javob shakli TEMADAN keladi: tengsizlikda oraliq, tenglamada son.
           Zanjir ikkalasini ham biladi -- aks holda tenglama darsi uchun
           butun asbobni ikkinchi marta yozishga to'g'ri kelardi. */
        answer.kind === 'value' ? (
          <AnswerValue
            numbers={answer.numbers}
            answer={answer.value}
            wrongs={answer.wrongs}
            prompt={answer.prompt || UI.writeAnswer}
            slots={answer.slots || 1}
            label={answer.label}
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
        )
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
              <span className="g11-opt-text">{t(row.text)}</span>
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

  const rawTask = tasks[idx]
  if (!rawTask) return <DoneRow>{done.join('   ')}</DoneRow>

  // Bo'lak har doim ham formula emas: 22-darsda yig'iladigan narsa
  // `mediana` va `o'rtacha` so'zlari, ya'ni uch tilli obyekt. Obyekt
  // React ga tushsa ekran yiqiladi va tugmalar bitta kalit oladi, shuning
  // uchun bo'laklar, javob va noto'g'ri kalitlar bir marta satrga keladi.
  const tri = (v) => (isTri(v) ? t(v) : v)
  const task = {
    ...rawTask,
    parts: (rawTask.parts || []).map(tri),
    answer: (rawTask.answer || []).map(tri),
    // Kalit MASSIV ham bo'lishi mumkin: uyalar so'zlar bilan to'lganda
    // uni qo'lda birlashtirib bo'lmaydi, chunki so'z tilga bog'liq.
    wrongs: (rawTask.wrongs || []).map((w) => ({
      ...w,
      key: Array.isArray(w.key) ? w.key.map(tri).join('|') : tri(w.key),
    })),
  }

  const nSlots = task.template.filter((p) => !(typeof p === 'string' || isTri(p))).length
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
          if (!(piece && typeof piece === 'object' && piece.slot !== undefined)) return <span key={i}><Fx>{t(piece)}</Fx></span>
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

// ============================================================
// ddx -- SONLI hosila. Asbob o'quvchi tanlagan funksiyani ROSTDAN
// differensiallaydi: formulani men oldindan hisoblab qo'ymayman, aks holda
// ekranda «tekshiruv» emas, mening javobim turgan bo'lardi.
// Markaziy ayirma: (F(x+h) − F(x−h)) / 2h -- oldinga ayirmadan aniqroq.
// ============================================================
export const ddx = (F, h = 0.001) => (x) => (F(x + h) - F(x - h)) / (2 * h)

// ============================================================
// CurveBoard -- bir necha egri chiziq BITTA o'qda.
//
// Ikki ish uchun:
//   1) f va o'quvchi tanlagan F ning HOSILASI ustma-ust: mos tushdimi;
//   2) F, F+2, F−3 oilasi va berilgan nuqtadagi urinmalar: qiyalik BIR XIL,
//      ya'ni «+C hech narsani o'zgartirmaydi» ko'rinadi, aytilmaydi.
//
// `curves`: [{ fn, tone, width, dash, from, label }]  -- `from` qaysi fazada
// paydo bo'lishi. `tangentAt` -- shu x da har egriga urinma chiziladi.
// ============================================================
export function CurveBoard({ curves = [], xDomain, yDomain, xTicks = [], yTicks = [], height = 168, phase = 99, tangentAt, note }) {
  const W = 640
  const H = height
  const padL = 40
  const padR = 24
  const padT = 12
  const padB = 30
  const [x0, x1] = xDomain
  const [y0, y1] = yDomain
  const px = (x) => padL + ((x - x0) / (x1 - x0)) * (W - padL - padR)
  const py = (y) => padT + ((y1 - y) / (y1 - y0)) * (H - padT - padB)

  const path = (fn) => {
    const pts = []
    const N = 220
    for (let i = 0; i <= N; i += 1) {
      const x = x0 + ((x1 - x0) * i) / N
      const y = fn(x)
      if (!isFinite(y) || y < y0 - 2 || y > y1 + 2) { continue }
      pts.push((pts.length ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(y).toFixed(1))
    }
    return pts.join(' ')
  }

  return (
    <div className="g11-graph" style={{ width: '100%', flexShrink: 0, minWidth: 0 }}>
      <svg viewBox={'0 0 ' + W + ' ' + H} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" style={{ display: 'block', maxHeight: H }}>
        <g stroke={T.line} strokeWidth="1" opacity=".55">
          {xTicks.map((tk) => <line key={'gx' + tk.v} x1={px(tk.v)} y1={padT} x2={px(tk.v)} y2={H - padB} />)}
          {yTicks.map((tk) => <line key={'gy' + tk.v} x1={padL} y1={py(tk.v)} x2={W - padR} y2={py(tk.v)} />)}
        </g>
        <line x1={padL} y1={py(0)} x2={W - padR} y2={py(0)} stroke="rgba(23,26,29,.34)" strokeWidth="1.5" />
        <line x1={px(0)} y1={padT} x2={px(0)} y2={H - padB} stroke="rgba(23,26,29,.34)" strokeWidth="1.5" />

        {curves.map((c, i) => (
          (c.from === undefined || phase >= c.from) ? (
            <path
              key={'c' + i}
              d={path(c.fn)}
              fill="none"
              stroke={TONES[c.tone || 'ink']}
              strokeWidth={c.width || 2.4}
              strokeDasharray={c.dash || undefined}
              strokeLinecap="round"
              className="g11-in"
            />
          ) : null
        ))}

        {/* URINMALAR: qiyalik bir xil ekani ko'rinadi. */}
        {tangentAt !== undefined ? curves.map((c, i) => {
          if (c.from !== undefined && phase < c.from) return null
          if (c.noTangent) return null
          const x = tangentAt
          const y = c.fn(x)
          const k = (c.fn(x + 0.001) - c.fn(x - 0.001)) / 0.002
          if (!isFinite(y) || !isFinite(k)) return null
          const dx = (x1 - x0) / 7
          return (
            <g key={'t' + i} className="g11-in">
              <line
                x1={px(x - dx)} y1={py(y - k * dx)} x2={px(x + dx)} y2={py(y + k * dx)}
                stroke={T.accent} strokeWidth="1.6" strokeDasharray="5 4"
              />
              <circle cx={px(x)} cy={py(y)} r="4" fill={T.accent} />
            </g>
          )
        }) : null}

        {xTicks.map((tk) => (
          <text key={'tx' + tk.v} x={px(tk.v)} y={H - padB + 16} textAnchor="middle" fontSize="12" fontWeight="700" fill={T.ink2} fontFamily={MATH_FONT}>
            {tk.label !== undefined ? tk.label : tk.v}
          </text>
        ))}
        {yTicks.map((tk) => (
          <text key={'ty' + tk.v} x={padL - 8} y={py(tk.v) + 4} textAnchor="end" fontSize="12" fontWeight="700" fill={T.ink2} fontFamily={MATH_FONT}>
            {tk.label !== undefined ? tk.label : tk.v}
          </text>
        ))}
      </svg>
      {note ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{note}</Fx></div> : null}
    </div>
  )
}

// ============================================================
// ASBOB 2 (PODXOD_11SINF.md §4). EGRI CHIZIQ OSTIDAGI YUZA.
//
// B1 blokining 4-7 darslari va 47-dars shu asbobga tayanadi -- sakkiz dars.
// Shuning uchun u DARSDAN OLDIN yoziladi, dars ichida emas.
//
// Chap chegara `a` qotirilgan, o'ng chegarani `b` o'quvchi tortadi. Bo'yalgan
// yuza o'zgaradi, soni yuguradi. `trace` yoqilsa, pastda ikkinchi panel
// ochiladi: to'plangan yuzaning GRAFIGI. O'quvchi chegarani oxirigacha
// tortadi va to'plangan yuzaning o'z egri chizig'i borligini ko'radi -- bu F.
//
// IKKI PANEL, ikkita alohida o'q. Bitta o'qqa qo'yish yolg'on bo'lardi:
// S odatda f dan bir necha barobar katta, va bitta masshtabda ulardan biri
// tekis chiziqqa aylanadi.
//
// O'qdan PASTDAGI yuza boshqa rangda bo'yaladi va AYIRILADI: integral manfiy
// bo'lishi mumkin, figuraning yuzasi esa yo'q. Bu ikki xil masala.
// ============================================================
const areaUnder = (fn, a, b, n = 400) => {
  if (!(b > a)) return 0
  const h = (b - a) / n
  let s = 0
  for (let i = 0; i < n; i += 1) {
    const y0 = fn(a + i * h)
    const y1 = fn(a + (i + 1) * h)
    if (!isFinite(y0) || !isFinite(y1)) continue
    s += ((y0 + y1) / 2) * h
  }
  return s
}

const areaText = (v) => {
  if (Math.abs(v) < 0.005) return '0'
  return v.toFixed(2).replace(/0$/, '').replace(/\.$/, '').replace('.', ',')
}

// `fn2` -- polosaning PASTKI chegarasi. Berilmasa nol, ya'ni o'q: eski
// xatti-harakat o'zgarmaydi. 6-darsda ikki egri chiziq orasidagi yuza kerak,
// va u alohida asbob emas -- o'sha asbobning bir holati. «Yuqoridagi minus
// pastdagi» degan bitta ta'rif uchala holatni ham qoplaydi.
export function AreaBoard({
  fn,
  fn2,
  xDomain,
  yDomain,
  xTicks = [],
  yTicks = [],
  a,
  b,
  onB,
  step = 0.1,
  trace = false,
  sDomain,
  fLabel,
  sLabel,
  areaLabel,
  note,
  height = 168,
  phase = 99,
}) {
  const W = 640
  const padL = 44
  const padR = 22
  const padT = 10
  const padB = 26
  const traceH = trace ? 64 : 0
  const gap = trace ? 8 : 0
  const topH = height
  const H = topH + traceH + gap
  const [x0, x1] = xDomain
  const [y0, y1] = yDomain
  const px = (x) => padL + ((x - x0) / (x1 - x0)) * (W - padL - padR)
  const py = (y) => padT + ((y1 - y) / (y1 - y0)) * (topH - padT - padB)

  const bb = Math.max(a, Math.min(x1, b === undefined ? a : b))
  const low = fn2 || (() => 0)
  const dy = (x) => fn(x) - low(x)
  const S = areaUnder(dy, a, bb)

  const curve = (f) => {
    const pts = []
    const N = 240
    for (let i = 0; i <= N; i += 1) {
      const x = x0 + ((x1 - x0) * i) / N
      const y = f(x)
      if (!isFinite(y) || y < y0 - 2 || y > y1 + 2) continue
      pts.push((pts.length ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(y).toFixed(1))
    }
    return pts.join(' ')
  }

  // Bo'yalgan yuza ISHORA bo'yicha bo'laklarga bo'linadi: nol chizig'ini
  // kesib o'tganda yangi bo'lak boshlanadi va rangi almashadi.
  const bands = []
  if (bb > a) {
    const N = 160
    const h = (bb - a) / N
    let cur = null
    for (let i = 0; i <= N; i += 1) {
      const x = a + i * h
      const y = fn(x)
      const yl = low(x)
      const sign = y - yl >= 0 ? 1 : -1
      if (!cur || cur.sign !== sign) {
        if (cur && cur.pts.length > 1) bands.push(cur)
        cur = { sign, pts: [], low: [] }
      }
      cur.pts.push([px(x), py(y)])
      cur.low.push([px(x), py(yl)])
    }
    if (cur && cur.pts.length > 1) bands.push(cur)
  }

  // Pastki panel: to'plangan yuza. Masshtab butun oraliq bo'yicha olinadi,
  // aks holda chegarani tortganda o'q sakrab turardi.
  const sTop = padT + topH + gap
  const sVals = []
  if (trace) {
    const N = 120
    for (let i = 0; i <= N; i += 1) {
      const x = x0 + ((x1 - x0) * i) / N
      sVals.push([x, x <= a ? 0 : areaUnder(dy, a, x, 120)])
    }
  }
  const ys = sVals.map((v) => v[1])
  const sLo = sDomain ? sDomain[0] : Math.min(0, ...(ys.length ? ys : [0]))
  const sHi = sDomain ? sDomain[1] : Math.max(0.001, ...(ys.length ? ys : [1]))
  const spy = (v) => sTop + ((sHi - v) / (sHi - sLo)) * (traceH - 14)
  const sPath = trace
    ? sVals
      .filter((v) => v[0] <= bb + 1e-9)
      .map((v, i) => (i ? 'L' : 'M') + px(v[0]).toFixed(1) + ' ' + spy(v[1]).toFixed(1))
      .join(' ')
    : ''

  // Tortish. Ko'rsatkichning ekrandagi joyi viewBox birligiga, keyin iksga
  // aylantiriladi -- ya'ni `px` ning teskarisi. Qadamga yaxlitlanadi, aks
  // holda son titraydi va uni o'qib bo'lmaydi.
  const pull = (ev) => {
    if (!onB) return
    const box = ev.currentTarget.getBoundingClientRect()
    if (!box.width) return
    const vx = ((ev.clientX - box.left) / box.width) * W
    const raw = x0 + ((vx - padL) / (W - padL - padR)) * (x1 - x0)
    const snapped = Math.round(raw / step) * step
    onB(Math.max(a, Math.min(x1, Number(snapped.toFixed(4)))))
  }

  return (
    <div className="g11-graph" style={{ width: '100%', flexShrink: 0, minWidth: 0 }}>
      <svg
        viewBox={'0 0 ' + W + ' ' + H}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        style={{ display: 'block', maxHeight: H, touchAction: 'none', cursor: onB ? 'ew-resize' : 'default' }}
        onPointerDown={(e) => { if (onB) { e.currentTarget.setPointerCapture(e.pointerId); pull(e) } }}
        onPointerMove={(e) => { if (onB && e.buttons) pull(e) }}
      >
        <g stroke={T.line} strokeWidth="1" opacity=".55">
          {xTicks.map((tk) => <line key={'gx' + tk.v} x1={px(tk.v)} y1={padT} x2={px(tk.v)} y2={topH - padB} />)}
          {yTicks.map((tk) => <line key={'gy' + tk.v} x1={padL} y1={py(tk.v)} x2={W - padR} y2={py(tk.v)} />)}
        </g>

        {bands.map((bd, i) => (
          <path
            key={'bd' + i}
            d={'M' + bd.low[0][0].toFixed(1) + ' ' + bd.low[0][1].toFixed(1)
              + ' ' + bd.pts.map((p) => 'L' + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')
              + ' ' + bd.low.slice().reverse().map((p) => 'L' + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ') + ' Z'}
            fill={bd.sign > 0 ? T.graphSoft : T.accentSoft}
            stroke="none"
          />
        ))}

        <line x1={padL} y1={py(0)} x2={W - padR} y2={py(0)} stroke="rgba(23,26,29,.34)" strokeWidth="1.5" />
        <line x1={px(0)} y1={padT} x2={px(0)} y2={topH - padB} stroke="rgba(23,26,29,.34)" strokeWidth="1.5" />

        <path d={curve(fn)} fill="none" stroke={T.ink} strokeWidth="2.4" strokeLinecap="round" />
        {fn2 ? <path d={curve(fn2)} fill="none" stroke={T.graph} strokeWidth="2.2" strokeLinecap="round" /> : null}

        <line x1={px(a)} y1={padT} x2={px(a)} y2={topH - padB} stroke={T.ink3} strokeWidth="1.4" strokeDasharray="4 4" />
        {phase >= 1 ? (
          <g>
            <line x1={px(bb)} y1={padT} x2={px(bb)} y2={topH - padB} stroke={T.accent} strokeWidth="2" />
            <circle cx={px(bb)} cy={py(0)} r="5" fill={T.accent} />
          </g>
        ) : null}

        {xTicks.map((tk) => (
          <text key={'tx' + tk.v} x={px(tk.v)} y={topH - padB + 15} textAnchor="middle" fontSize="12" fontWeight="700" fill={T.ink2} fontFamily={MATH_FONT}>
            {tk.label !== undefined ? tk.label : tk.v}
          </text>
        ))}
        {yTicks.map((tk) => (
          <text key={'ty' + tk.v} x={padL - 8} y={py(tk.v) + 4} textAnchor="end" fontSize="12" fontWeight="700" fill={T.ink2} fontFamily={MATH_FONT}>
            {tk.label !== undefined ? tk.label : tk.v}
          </text>
        ))}
        {fLabel ? (
          <text x={W - padR} y={padT + 12} textAnchor="end" fontSize="12" fontWeight="700" fill={T.ink3} fontFamily={MATH_FONT}>{fLabel}</text>
        ) : null}

        {trace ? (
          <g>
            <line x1={padL} y1={spy(0)} x2={W - padR} y2={spy(0)} stroke="rgba(23,26,29,.2)" strokeWidth="1" />
            <path d={sPath} fill="none" stroke={T.graph} strokeWidth="2.2" strokeLinecap="round" />
            {phase >= 1 ? <circle cx={px(bb)} cy={spy(S)} r="4.5" fill={T.graph} /> : null}
            {sLabel ? (
              <text x={W - padR} y={sTop + 11} textAnchor="end" fontSize="12" fontWeight="700" fill={T.ink3} fontFamily={MATH_FONT}>{sLabel}</text>
            ) : null}
          </g>
        ) : null}
      </svg>

      {areaLabel !== undefined ? (
        <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}>
          <Fx>{areaLabel + '  ' + areaText(S)}</Fx>
        </div>
      ) : null}
      {note ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{note}</Fx></div> : null}
    </div>
  )
}

// ============================================================
// ASBOB 3 (B3 bloki). NATIJALAR DARAXTI.
//
// 16-19 va 21-darslar shu asbobga tayanadi. Metodist qarori 2026-08-15.
//
// NEGA AYNAN DARAXT. Kombinatorikaning bosh xatosi tadqiqotlarda aniq
// nomlangan: o'quvchi oltita buyumdan tanlashda 6 + 5 + 4 + 3 + 2 + 1 = 21
// deb yozadi, ya'ni KO'PAYTIRISH o'rniga QO'SHADI. Bu arifmetik xato emas:
// u ketma-ket tanlov qanday ishlashini ko'rmagan. Va bu faqat bitta narsa
// bilan tuzaladi -- daraxtni O'Z QO'LI bilan qurish bilan.
//
// Shuning uchun asbobda barglar soni yonida IKKITA hisob turadi: yig'indi va
// ko'paytma. O'quvchi qaysi biri barglar soniga mos kelganini o'zi ko'radi.
// Xato aytilmaydi, u o'ladi.
//
// `collapse` yoqilsa, bir xil TO'PLAMLar birlashtiriladi: ABC va CBA bitta
// to'plam. Shunda o'rin almashtirishdan gruppalashga o'tish ko'rinadi.
// ============================================================
// `markPaths` -- 19-dars uchun: daraxtning har bargi bu YO'L, va yo'llarni
// ichidagi «be» soniga qarab bo'yash mumkin. Shunda binom koeffitsienti
// ko'rinadi: uchta yo'lda «be» bir marta uchraydi, va formulada uchlik shundan.
export function OutcomeTree({
  levels = [],
  depth,
  collapse = false,
  markPaths,
  pathLabels,
  showCounts = true,
  sumLabel,
  prodLabel,
  leafLabel,
  note,
  height = 168,
}) {
  const W = 640
  const padT = 16
  const padB = 26
  const shown = Math.max(0, Math.min(levels.length, depth === undefined ? levels.length : depth))
  const H = height

  // Har qatlamda nechta shox: `levels[i].n`. Ochilgan qatlamlar bo'yicha
  // barglar soni ko'paytma bo'ladi.
  const counts = levels.slice(0, shown).map((lv) => lv.n)
  const prod = counts.reduce((a, b) => a * b, 1)
  const sum = counts.reduce((a, b) => a + b, 0)
  // Bir xil to'plamlar birlashtirilsa: n! ga bo'linadi (tartib ahamiyatsiz).
  const fact = (k) => (k <= 1 ? 1 : k * fact(k - 1))
  const leaves = collapse ? Math.round(prod / fact(counts.length)) : prod

  const rowY = (i) => padT + ((H - padT - padB) * i) / Math.max(1, levels.length)
  const nodesAt = (i) => counts.slice(0, i).reduce((a, b) => a * b, 1)

  const dots = []
  for (let i = 0; i <= shown; i += 1) {
    const total = nodesAt(i)
    // Ekranga sig'adigan chegara: 24 tugundan ko'pi nuqta bo'lib qoladi.
    const cap = Math.min(total, 24)
    for (let k = 0; k < cap; k += 1) {
      const x = 40 + ((W - 80) * (k + 0.5)) / cap
      dots.push({ x, y: rowY(i), i, k, total, cap })
    }
  }

  const edges = []
  for (let i = 1; i <= shown; i += 1) {
    const from = dots.filter((d) => d.i === i - 1)
    const to = dots.filter((d) => d.i === i)
    for (const b of to) {
      const parent = from[Math.min(from.length - 1, Math.floor((b.k * from.length) / b.cap))]
      if (parent) edges.push({ x1: parent.x, y1: parent.y, x2: b.x, y2: b.y, i })
    }
  }

  return (
    <div className="g11-graph" style={{ width: '100%', flexShrink: 0, minWidth: 0 }}>
      <svg viewBox={'0 0 ' + W + ' ' + H} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" style={{ display: 'block', maxHeight: H }}>
        {edges.map((e, i) => (
          <line key={'e' + i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={T.line} strokeWidth="1.4" className="g11-in" />
        ))}
        {dots.map((d, i) => {
          // Barg yo'lining «be» soni: pastki qatlamda k ta shoxdan nechtasi
          // ikkinchi tanlov bo'lgani. `markPaths` berilsa, shu son bo'yicha
          // bo'yaladi va binom koeffitsienti KO'RINADI.
          let mark = null
          if (markPaths !== undefined && d.i === shown && shown > 0) {
            let ones = 0
            let rest = d.k
            for (let lv = shown - 1; lv >= 0; lv -= 1) {
              const base = counts[lv] || 1
              if (rest % base === 1) ones += 1
              rest = Math.floor(rest / base)
            }
            mark = ones === markPaths
          }
          return (
            <circle
              key={'d' + i}
              cx={d.x}
              cy={d.y}
              r={mark ? 6 : d.i === shown ? 5 : 4}
              fill={mark ? T.ok : d.i === shown ? T.accent : T.ink3}
              className="g11-in"
            />
          )
        })}
        {levels.slice(0, shown).map((lv, i) => (
          <text key={'l' + i} x={8} y={rowY(i + 1) + 4} fontSize="12" fontWeight="700" fill={T.ink2} fontFamily={MATH_FONT}>
            {'×' + lv.n}
          </text>
        ))}
      </svg>

      {showCounts ? (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {/* IKKITA hisob yonma yon: o'quvchi qaysi biri barglarga mos
              kelganini o'zi ko'radi. Xato ko'rsatilmaydi, u o'ladi. */}
          <span className="g11-expr g11-expr-sm" style={{ color: T.ink3 }}>
            <Fx>{(sumLabel || 'sum') + ' ' + counts.join(' + ') + ' = ' + sum}</Fx>
          </span>
          <span className="g11-expr g11-expr-sm" style={{ color: T.graph }}>
            <Fx>{(prodLabel || 'prod') + ' ' + counts.join(' · ') + ' = ' + prod}</Fx>
          </span>
        </div>
      ) : null}
      {leafLabel !== undefined ? (
        <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.accent }}>
          <Fx>{leafLabel + '  ' + leaves}</Fx>
        </div>
      ) : null}
      {pathLabels !== undefined ? (
        <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ok }}>
          <Fx>{pathLabels}</Fx>
        </div>
      ) : null}
      {note ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{note}</Fx></div> : null}
    </div>
  )
}

// ============================================================
// ASBOB 4 (B3 bloki). CHASTOTA TAXTASI. Uch rejim, bitta asbob.
//
// 20-24-darslar shu asbobga tayanadi. Metodist qarori 2026-08-15.
//
// NEGA ODAMLAR BILAN, ULUSH BILAN EMAS. Ikki hodisali tajribada bir xil
// masala CHASTOTA bilan berilganda 78 foiz to'g'ri yechilgan, ULUSH bilan
// berilganda 23 foiz. Uch barobar. Va «birgalikdagi ehtimollikni shartli
// bilan chalkashtirish» xatosi 56 foizdan 11 foizga tushgan. Ya'ni yozuv
// formati bu yerda tushuntirishdan kuchliroq.
//
// TASODIF YO'Q. Sinov rejimida katakchalar `order` bo'yicha ochiladi, va
// uni DARS beradi. Sababi: vyorstka tekshiruvi har safar bir xil holatni
// ko'rishi kerak, aks holda «toza» degan javobga ishonib bo'lmaydi.
// ============================================================
export function FrequencyBoard({
  total = 100,
  groups = [],
  order,
  filled,
  cols = 20,
  mode = 'grid',
  bars = [],
  barMax,
  lineAt,
  lineLabel,
  caption,
  note,
  height = 140,
  points = [],
  trend = false,
  xLabel,
  yLabel,
  xMin,
  xMax,
  yMin,
  yMax,
}) {
  const W = 640
  const padX = 14

  if (mode === 'bars') {
    const H = height
    const padB = 24
    const padT = 12
    const top = barMax || Math.max(1, ...bars.map((b) => b.n), lineAt || 0)
    const bw = (W - padX * 2) / Math.max(1, bars.length)
    const by = (v) => padT + ((top - v) / top) * (H - padT - padB)
    return (
      <div className="g11-graph" style={{ width: '100%', flexShrink: 0, minWidth: 0 }}>
        <svg viewBox={'0 0 ' + W + ' ' + H} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" style={{ display: 'block', maxHeight: H }}>
          <line x1={padX} y1={by(0)} x2={W - padX} y2={by(0)} stroke="rgba(23,26,29,.34)" strokeWidth="1.5" />
          {bars.map((b, i) => (
            <g key={'b' + i} className="g11-in">
              <rect
                x={padX + i * bw + bw * 0.16}
                y={by(b.n)}
                width={bw * 0.68}
                height={Math.max(0, by(0) - by(b.n))}
                fill={TONES[b.tone || 'graph']}
                opacity="0.85"
                rx="3"
              />
              <text x={padX + i * bw + bw / 2} y={H - 8} textAnchor="middle" fontSize="12" fontWeight="700" fill={T.ink2} fontFamily={MATH_FONT}>{b.label}</text>
              <text x={padX + i * bw + bw / 2} y={by(b.n) - 5} textAnchor="middle" fontSize="12" fontWeight="700" fill={T.ink2} fontFamily={MATH_FONT}>{b.n}</text>
            </g>
          ))}
          {lineAt !== undefined ? (
            <g>
              <line x1={padX} y1={by(lineAt)} x2={W - padX} y2={by(lineAt)} stroke={T.accent} strokeWidth="1.8" strokeDasharray="6 4" />
              {lineLabel ? (
                <text x={W - padX} y={by(lineAt) - 6} textAnchor="end" fontSize="12" fontWeight="700" fill={T.accent} fontFamily={MATH_FONT}>{lineLabel}</text>
              ) : null}
            </g>
          ) : null}
        </svg>
        {caption !== undefined ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{caption}</Fx></div> : null}
        {note ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{note}</Fx></div> : null}
      </div>
    )
  }

  // ============================================================
  // NUQTALAR BULUTI. 23-dars uchun: ikkita qatorning bog'liqligi
  // KO'RINADI, lekin sabab ko'rinmaydi. Shuning uchun asbob faqat
  // nuqtalarni va (so'ralganda) yo'nalish chizig'ini chizadi -- sabab
  // haqida bir og'iz ham demaydi, uni dars matni aytadi.
  //
  // Nuqtalarni DARS beradi. Bu shu faylning boshidagi qoida bilan bir xil:
  // tasodifiy generator har yuklanishda boshqa rasm berardi va o'lchov
  // tekshiruvi hech narsani ushlamas edi.
  if (mode === 'scatter') {
    const H = height
    const padB = 26
    const padT = 10
    const padL = 30
    const xs = points.map((p) => p.x)
    const ys = points.map((p) => p.y)
    const x0 = xMin !== undefined ? xMin : Math.min(...xs, 0)
    const x1 = xMax !== undefined ? xMax : Math.max(...xs, 1)
    const y0 = yMin !== undefined ? yMin : Math.min(...ys, 0)
    const y1 = yMax !== undefined ? yMax : Math.max(...ys, 1)
    const px = (v) => padL + ((v - x0) / (x1 - x0 || 1)) * (W - padL - padX)
    const py = (v) => padT + ((y1 - v) / (y1 - y0 || 1)) * (H - padT - padB)
    // Yo'nalish chizig'i eng kichik kvadratlar usuli bilan: uni ham dars
    // emas, asbob hisoblaydi -- aks holda ekranda mening javobim turardi.
    let fit = null
    if (trend && points.length > 1) {
      const n = points.length
      const sx = xs.reduce((a, b) => a + b, 0)
      const sy = ys.reduce((a, b) => a + b, 0)
      const sxy = points.reduce((a, p) => a + p.x * p.y, 0)
      const sxx = points.reduce((a, p) => a + p.x * p.x, 0)
      const den = n * sxx - sx * sx
      if (den !== 0) {
        const k = (n * sxy - sx * sy) / den
        const b = (sy - k * sx) / n
        fit = { k, b }
      }
    }
    return (
      <div className="g11-graph" style={{ width: '100%', flexShrink: 0, minWidth: 0 }}>
        <svg viewBox={'0 0 ' + W + ' ' + H} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" style={{ display: 'block', maxHeight: H }}>
          <line x1={padL} y1={py(y0)} x2={W - padX} y2={py(y0)} stroke="rgba(23,26,29,.34)" strokeWidth="1.5" />
          <line x1={padL} y1={py(y0)} x2={padL} y2={padT} stroke="rgba(23,26,29,.34)" strokeWidth="1.5" />
          {xLabel ? <text x={W - padX} y={H - 7} textAnchor="end" fontSize="12" fontWeight="700" fill={T.ink2} fontFamily={MATH_FONT}>{xLabel}</text> : null}
          {yLabel ? <text x={padL - 4} y={padT + 9} textAnchor="end" fontSize="12" fontWeight="700" fill={T.ink2} fontFamily={MATH_FONT}>{yLabel}</text> : null}
          {fit ? (
            <line
              x1={px(x0)} y1={py(fit.k * x0 + fit.b)}
              x2={px(x1)} y2={py(fit.k * x1 + fit.b)}
              stroke={T.accent} strokeWidth="1.8" strokeDasharray="6 4" className="g11-in"
            />
          ) : null}
          {points.map((p, i) => (
            <circle
              key={'p' + i}
              cx={px(p.x)}
              cy={py(p.y)}
              r={p.big ? 7 : 5}
              fill={TONES[p.tone || 'graph']}
              opacity={p.dim ? 0.3 : 0.85}
              className="g11-in"
            />
          ))}
        </svg>
        {caption !== undefined ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{caption}</Fx></div> : null}
        {note ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{note}</Fx></div> : null}
      </div>
    )
  }

  const tone = []
  let at = 0
  groups.forEach((g, gi) => {
    for (let k = 0; k < g.n && at < total; k += 1, at += 1) tone[at] = gi
  })
  for (let i = at; i < total; i += 1) tone[i] = -1
  const place = (i) => (order && order.length === total ? order[i] : i)
  const openTo = filled === undefined ? total : Math.max(0, Math.min(total, filled))

  const rows = Math.ceil(total / cols)
  const cell = (W - padX * 2) / cols
  const boxH = rows * cell + 8

  return (
    <div className="g11-graph" style={{ width: '100%', flexShrink: 0, minWidth: 0 }}>
      <svg viewBox={'0 0 ' + W + ' ' + boxH} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" style={{ display: 'block', maxHeight: Math.min(height, boxH) }}>
        {Array.from({ length: total }, (_, i) => {
          const idx = place(i)
          const open = i < openTo
          const g = tone[idx]
          const r = Math.floor(idx / cols)
          const c = idx % cols
          return (
            <rect
              key={'c' + i}
              x={padX + c * cell + 1.2}
              y={4 + r * cell + 1.2}
              width={cell - 2.4}
              height={cell - 2.4}
              rx="2.4"
              fill={open && g >= 0 ? TONES[groups[g].tone || 'graph'] : T.paper}
              stroke={T.line}
              strokeWidth="1"
              opacity={open ? 1 : 0.45}
            />
          )
        })}
      </svg>
      {groups.length ? (
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {groups.map((g, i) => (
            <span key={'g' + i} className="g11-expr g11-expr-sm" style={{ color: TONES[g.tone || 'graph'], display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: TONES[g.tone || 'graph'], display: 'inline-block' }} />
              <Fx>{g.label !== undefined ? g.label + ' ' + g.n : String(g.n)}</Fx>
            </span>
          ))}
        </div>
      ) : null}
      {caption !== undefined ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{caption}</Fx></div> : null}
      {note ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{note}</Fx></div> : null}
    </div>
  )
}


// ============================================================
// SpinBoard -- AYLANISH JISMI. B4 blokining yagona asbobi (9 dars: 26-33
// va 52), shuning uchun u bitta emas, BESHTA harakatni olib yuradi. Har
// harakatning `DINAMIKA_VA_ILLUSTRATSIYA.md` bo'yicha bitta roli bor:
//
//   spin    -- tekis figura jismni SUPURADI        (tushunchani ko'rsatish)
//   section -- tekislik o'q bo'ylab yuradi          (tushunchani ko'rsatish)
//   net     -- yon sirt yoyiladi                    (belgining ma'nosi)
//   pour    -- konus silindrga uch marta to'kiladi  (hayot bilan bog'lash)
//   disks   -- jism disklarga bo'linadi             (umumlashtirish)
//
// WebGL YO'Q -- metodist qarori, `PODXOD_11SINF.md` §12. Jism tekis
// proyeksiyada chiziladi: o'q gorizontal, profil o'qdan yuqorida, uning
// aksi pastda, uchlarda ellips.
//
// IKKI O'Q BIR XIL MASSHTABDA. Birinchi variantda x va y alohida
// cho'zilardi, va shar sigaraga aylanib qolgandi -- kesim esa tor yoriqqa.
// Bu bezak masalasi emas: bunday rasmdan o'quvchi sharning kesimi ellips
// degan xulosa chiqaradi. Shuning uchun masshtab BITTA va chizma markazga
// tekislanadi.
//
// Hajmni asbob O'ZI sanaydi: V = pi * integral f kvadrat dx, o'sha
// `areaUnder`. Formula oldindan yozib qo'yilmaydi -- aks holda ekranda
// tekshiruv emas, mening javobim turgan bo'lardi.
// ============================================================

// Aylanada ko'ringan doira ellipsga aylanadi. Yassilanish koeffitsienti
// butun blok bo'yicha BITTA: har darsda boshqacha bo'lsa, jismlar bir
// biriga o'xshamay qoladi va o'quvchi ularni solishtira olmaydi.
const FLAT = 0.30

const volumeOf = (fn, a, b) => areaUnder((x) => Math.PI * fn(x) * fn(x), a, b)

export function SpinBoard({
  fn,                 // profil: o'q ustidagi radius, y = f(x)
  a,                  // aylanadigan oraliq
  b,
  xDomain,
  yDomain,
  mode = 'spin',      // spin | section | net | pour | disks
  spin = 1,           // 0 -- tekis figura, 1 -- to'liq jism
  cut,                // section: kesim qayerda
  disks = 4,          // disks: nechta disk
  solid = 'cyl',      // net va pour uchun: cyl | cone | prism
  sides = 6,          // prism: asosdagi tomonlar soni
  R = 2,              // net/pour o'lchamlari
  hh = 3,
  fill = 0,           // pour: nechta to'kish bo'ldi (0..3)
  showV = false,      // hajm sonini ko'rsatish
  vLabel,
  rLabel,
  note,
  caption,
  height = 172,
  // Ko'rish burchagi va sudrash. `tilt0` -- boshlang'ich qiya (radian),
  // 0,30 taxminan 17 gradus: shu paytgacha butun blok shu ko'rinishda
  // chizilgan. `interactive` bo'lsa, o'quvchi jismni O'ZI buradi.
  tilt0 = 0.305,
  interactive = false,
}) {
  // HOOKLAR ENG BOSHDA. Quyida `net` va `pour` rejimlari erta `return`
  // qiladi, va hooklar ulardan keyin turganda React qoidasi buzilardi:
  // rejim almashsa, «Rendered fewer hooks than expected» bilan yiqilardi.
  //
  // KO'RISH BURCHAGI. Jismning o'qi ekranda gorizontal, kesim doirasi esa
  // vertikal tekislikda yotadi. Tikka qaraganda u chiziqqa aylanadi,
  // tepadan qaraganda ellipsga ochiladi. Yassilanish = sinus(qiya), ya'ni
  // qotirilgan son emas, ko'rish burchagining natijasi.
  const [tiltUser, setTiltUser] = useState(null)
  const [angUser, setAngUser] = useState(null)
  const svgRef = useRef(null)
  const dragRef = useRef(null)

  const W = 640
  const padX = 26
  const padT = 14
  const padB = 16
  const H = height

  // ---------- yoyilma ----------
  // PRIZMA YOYILMASI -- 26-dars. Yon yoqlar bitta lentaga yoyiladi, va
  // ularning SONI asos tomonlari soniga teng. Darsning butun ma'nosi shu:
  // formulani yodlash emas, sanashni ko'rish.
  if (mode === 'net' && solid === 'prism') {
    const n = Math.max(3, Math.min(10, sides))
    const k = Math.max(0, Math.min(1, spin))
    const H = height
    const a = 1                       // asos tomoni, shartli birlik
    const need = 2.2 + n * a + 0.6    // chapda jism, o'ngda lenta
    const sc = Math.min((W - padX * 2) / need, (H - padT - padB - 14) / (hh + 1.6))
    const midY = padT + (H - padT - padB - 14) / 2
    const bodyX = padX + 1.1 * sc
    const netX = padX + 2.2 * sc
    const bh = hh * sc
    const bw = a * sc
    // Jism: oldingi ikki yoq va asoslar. Ko'p yoqli jismni tekis
    // proyeksiyada chizamiz, WebGL yo'q.
    const topY = midY - bh / 2
    const botY = midY + bh / 2
    const rr = 0.9 * sc
    return (
      <div className="g11-graph" style={{ width: '100%', flexShrink: 0, minWidth: 0 }}>
        <svg viewBox={'0 0 ' + W + ' ' + H} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" style={{ display: 'block', maxHeight: H }}>
          {/* Asos KO'PBURCHAK bo'lib chiziladi, ellips emas: bu dars
              ko'pyoqliklar haqida, va ellips u yerda silindr haqida
              yolg'on gapirardi. Cho'qqilar burchak bo'yicha hisoblanadi,
              chuqurlik `FLAT` bilan siqiladi. */}
          {(() => {
            const pt = (ang, y) => [bodyX + rr * Math.cos(ang), y + rr * FLAT * Math.sin(ang)]
            const poly = (y) => Array.from({ length: n }, (_, i) => pt((2 * Math.PI * i) / n + Math.PI / n, y).join(',')).join(' ')
            const verts = Array.from({ length: n }, (_, i) => (2 * Math.PI * i) / n + Math.PI / n)
            return (
              <>
                <polygon points={poly(topY)} fill="none" stroke={T.ink3} strokeWidth="1.4" />
                <polygon points={poly(botY)} fill="none" stroke={T.ink3} strokeWidth="1.4" />
                {verts.map((ang, i) => {
                  const [x, dy] = pt(ang, 0)
                  const front = Math.sin(ang) >= 0
                  return (
                    <line
                      key={'v' + i}
                      x1={x} y1={topY + dy} x2={x} y2={botY + dy}
                      stroke={T.ink3} strokeWidth={front ? 1.4 : 1}
                      strokeDasharray={front ? undefined : '4 3'}
                      opacity={front ? 1 : 0.55}
                    />
                  )
                })}
              </>
            )
          })()}
          {/* Lenta: har bir yoq alohida to'rtburchak, chegaralari ko'rinadi --
              shunda ularni SANASH mumkin, va bu darsning maqsadi. */}
          <g className="g11-in">
            {Array.from({ length: n }, (_, i) => {
              const open = Math.max(0, Math.min(1, k * n - i))
              if (open <= 0) return null
              return (
                <rect
                  key={'f' + i}
                  x={netX + i * bw}
                  y={midY - bh / 2}
                  width={Math.max(1, bw * open)}
                  height={bh}
                  fill={T.graph} fillOpacity="0.16" stroke={T.graph} strokeWidth="1.4"
                />
              )
            })}
          </g>
          {k > 0.95 ? (
            <text x={netX + (n * bw) / 2} y={midY + bh / 2 + 15} textAnchor="middle" fontSize="12" fontWeight="700" fill={T.ink2} fontFamily={MATH_FONT}>
              {n}
            </text>
          ) : null}
        </svg>
        {caption !== undefined ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{caption}</Fx></div> : null}
        {note ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{note}</Fx></div> : null}
      </div>
    )
  }

  if (mode === 'net') {
    // Yon sirt yoyiladi. Silindrda to'g'ri to'rtburchak chiqadi, konusda
    // sektor: radiusi yasovchi l, yoyi 2 pi r. Yuza 8-sinf planimetriyasi
    // bilan sanaladi, S yon = 2 pi r l esa YOYILMANING NATIJASI bo'lib
    // chiqadi, oldindan berilgan qoida emas.
    const l = Math.sqrt(R * R + hh * hh)
    const k = Math.max(0, Math.min(1, spin))
    const arc = 2 * Math.PI * R
    // Masshtab: chap tomonda jism (eni 2R), o'ngda yoyilma. Silindrda
    // yoyilma eni 2piR, konusda esa sektor diametri 2l. Ikkalasi ham
    // sig'ishi kerak, aks holda yoyilma kadrdan chiqib ketadi.
    const needW = 2 * R + 1.2 + (solid === 'cyl' ? arc : 2 * l)
    const needH = solid === 'cyl' ? Math.max(hh, hh) + 1.2 : Math.max(hh, 2 * l * 0.5) + 1.2
    const sc = Math.min((W - padX * 2) / needW, (H - padT - padB - 12) / needH)
    const bodyX = padX + R * sc
    const midY = padT + (H - padT - padB - 12) / 2
    const netX = padX + 2 * R * sc + 1.2 * sc
    return (
      <div className="g11-graph" style={{ width: '100%', flexShrink: 0, minWidth: 0 }}>
        <svg viewBox={'0 0 ' + W + ' ' + H} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" style={{ display: 'block', maxHeight: H }}>
          {solid === 'cyl' ? (
            <>
              <ellipse cx={bodyX} cy={midY - hh * sc / 2} rx={R * sc} ry={R * sc * FLAT} fill="none" stroke={T.ink3} strokeWidth="1.4" />
              <ellipse cx={bodyX} cy={midY + hh * sc / 2} rx={R * sc} ry={R * sc * FLAT} fill="none" stroke={T.ink3} strokeWidth="1.4" />
              <line x1={bodyX - R * sc} y1={midY - hh * sc / 2} x2={bodyX - R * sc} y2={midY + hh * sc / 2} stroke={T.ink3} strokeWidth="1.4" />
              <line x1={bodyX + R * sc} y1={midY - hh * sc / 2} x2={bodyX + R * sc} y2={midY + hh * sc / 2} stroke={T.ink3} strokeWidth="1.4" />
              {/* Animatsiya klassi ROVOTGA qo'yiladi, shaffoflik esa
                  shaklning o'ziga: `g11-in` opacity ni nolgacha va birgacha
                  yuritadi va atributni bosib ketadi. Bu 10-sinfda bir marta
                  yozib olingan grabli. */}
              <g className="g11-in">
                <rect
                  x={netX}
                  y={midY - hh * sc / 2}
                  width={Math.max(1, k * arc * sc)}
                  height={hh * sc}
                  fill={T.graph} fillOpacity="0.18" stroke={T.graph} strokeWidth="1.6"
                />
              </g>
              {k > 0.9 ? (
                <>
                  <text x={netX + arc * sc / 2} y={midY + hh * sc / 2 + 15} textAnchor="middle" fontSize="12" fontWeight="700" fill={T.ink2} fontFamily={MATH_FONT}>2πr</text>
                  <text x={netX - 5} y={midY + 4} textAnchor="end" fontSize="12" fontWeight="700" fill={T.ink2} fontFamily={MATH_FONT}>l</text>
                </>
              ) : null}
            </>
          ) : (
            <>
              <ellipse cx={bodyX} cy={midY + hh * sc / 2} rx={R * sc} ry={R * sc * FLAT} fill="none" stroke={T.ink3} strokeWidth="1.4" />
              <line x1={bodyX - R * sc} y1={midY + hh * sc / 2} x2={bodyX} y2={midY - hh * sc / 2} stroke={T.ink3} strokeWidth="1.4" />
              <line x1={bodyX + R * sc} y1={midY + hh * sc / 2} x2={bodyX} y2={midY - hh * sc / 2} stroke={T.ink3} strokeWidth="1.4" />
              {(() => {
                const full = arc / l              // sektorning to'liq burchagi
                const ang = k * full
                const r = l * sc
                const ox = netX + r
                const oy = midY + r * 0.42
                const x1 = ox - r
                const y1 = oy
                const x2 = ox - r * Math.cos(ang)
                const y2 = oy - r * Math.sin(ang)
                const large = ang > Math.PI ? 1 : 0
                return (
                  <>
                    <g className="g11-in">
                      <path
                        d={'M ' + ox + ' ' + oy + ' L ' + x1 + ' ' + y1 + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x2 + ' ' + y2 + ' Z'}
                        fill={T.accent} fillOpacity="0.16" stroke={T.accent} strokeWidth="1.6"
                      />
                    </g>
                    {k > 0.9 ? (
                      <>
                        <text x={ox - r * 0.5} y={oy - 7} textAnchor="middle" fontSize="12" fontWeight="700" fill={T.ink2} fontFamily={MATH_FONT}>l</text>
                        <text x={ox - r - 5} y={oy + 15} textAnchor="end" fontSize="12" fontWeight="700" fill={T.ink2} fontFamily={MATH_FONT}>2πr</text>
                      </>
                    ) : null}
                  </>
                )
              })()}
            </>
          )}
        </svg>
        {caption !== undefined ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{caption}</Fx></div> : null}
        {note ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{note}</Fx></div> : null}
      </div>
    )
  }

  // ---------- to'kish ----------
  if (mode === 'pour') {
    // Konus silindrga TO'KILADI. Uch marta to'kish silindrni to'ldiradi, va
    // uchdan bir koeffitsienti shu yerda TAXMIN bo'lib tug'iladi. Isbot
    // keyin, integral bilan -- darslikdagi yo'l.
    const sc = Math.min((H - padT - padB - 22) / (hh * 1.1), (W - padX * 2) / (6 * R))
    const rr = R * sc
    const hp = hh * sc
    const leftX = W * 0.34
    const rightX = W * 0.62
    const baseY = H - padB - 12
    const topY = baseY - hp
    const k = Math.max(0, Math.min(3, fill)) / 3
    const fillY = baseY - hp * k
    // Konusdagi qolgan suyuqlik: uchta to'kishdan nechtasi ketgan.
    const left = Math.max(0, 1 - (Math.max(0, Math.min(3, fill)) - Math.floor(Math.max(0, Math.min(3, fill)))))
    return (
      <div className="g11-graph" style={{ width: '100%', flexShrink: 0, minWidth: 0 }}>
        <svg viewBox={'0 0 ' + W + ' ' + H} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" style={{ display: 'block', maxHeight: H }}>
          <line x1={leftX - rr} y1={baseY} x2={leftX} y2={topY} stroke={T.ink3} strokeWidth="1.5" />
          <line x1={leftX + rr} y1={baseY} x2={leftX} y2={topY} stroke={T.ink3} strokeWidth="1.5" />
          <ellipse cx={leftX} cy={baseY} rx={rr} ry={rr * FLAT} fill={T.accent} fillOpacity={fill >= 3 ? 0.06 : 0.18 * left} stroke={T.ink3} strokeWidth="1.4" />
          <ellipse cx={rightX} cy={topY} rx={rr} ry={rr * FLAT} fill="none" stroke={T.ink3} strokeWidth="1.5" />
          <line x1={rightX - rr} y1={topY} x2={rightX - rr} y2={baseY} stroke={T.ink3} strokeWidth="1.5" />
          <line x1={rightX + rr} y1={topY} x2={rightX + rr} y2={baseY} stroke={T.ink3} strokeWidth="1.5" />
          <ellipse cx={rightX} cy={baseY} rx={rr} ry={rr * FLAT} fill="none" stroke={T.ink3} strokeWidth="1.5" />
          {k > 0 ? (
            <g className="g11-in">
              <rect x={rightX - rr} y={fillY} width={rr * 2} height={baseY - fillY} fill={T.accent} fillOpacity="0.18" />
              <ellipse cx={rightX} cy={fillY} rx={rr} ry={rr * FLAT} fill={T.accent} fillOpacity="0.26" stroke={T.accent} strokeWidth="1.5" />
            </g>
          ) : null}
          <text x={rightX} y={topY - 9} textAnchor="middle" fontSize="13" fontWeight="700" fill={T.ink2} fontFamily={MATH_FONT}>
            {Math.min(3, Math.max(0, Math.round(fill))) + ' / 3'}
          </text>
        </svg>
        {caption !== undefined ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{caption}</Fx></div> : null}
        {note ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{note}</Fx></div> : null}
      </div>
    )
  }

  // ---------- aylanish, kesim va disklar ----------
  const xd = xDomain || [a, b]
  const yd = yDomain || [-3, 3]
  // Hajm soni uchun tepada joy ajratiladi: aks holda u jismning ustiga
  // chiqib qoladi va ikkalasini ham o'qib bo'lmaydi.
  const padTop = padT + (showV ? 13 : 0)
  const sc = (H - padTop - padB) / (yd[1] - yd[0])
  const WD = (xd[1] - xd[0]) * sc + padX * 2
  const cx0 = (xd[0] + xd[1]) / 2
  const cy0 = (yd[0] + yd[1]) / 2
  const px = (x) => WD / 2 + (x - cx0) * sc
  const py = (y) => padTop + (H - padTop - padB) / 2 - (y - cy0) * sc

  const tilt = tiltUser !== null ? tiltUser : tilt0
  const flat = Math.sin(tilt)
  // Meridian (yasovchi) burchagi: sudralganda u o'q atrofida yuradi.
  const ang = angUser !== null ? angUser : Math.max(0, Math.min(1, spin)) * Math.PI

  const onDown = (e) => {
    if (!interactive) return
    const el = svgRef.current
    if (!el) return
    el.setPointerCapture(e.pointerId)
    dragRef.current = { x: e.clientX, y: e.clientY, ang, tilt }
  }
  const onMove = (e) => {
    const d = dragRef.current
    if (!d) return
    const box = svgRef.current.getBoundingClientRect()
    const kx = box.width || 1
    // Bir ekran eni = to'liq aylanish. Shunda barmoq harakati va jismning
    // burilishi mos keladi.
    setAngUser(d.ang + ((e.clientX - d.x) / kx) * Math.PI * 2)
    // Qiya 6 dan 46 gradusgacha: 6 dan pastda asos chiziqqa aylanadi va
    // jism yassi ko'rinadi, 46 dan yuqorida u tepadan qaralgan disk bo'ladi.
    const nt = d.tilt - ((e.clientY - d.y) / 220) * 0.9
    setTiltUser(Math.max(0.1, Math.min(0.8, nt)))
  }
  const onUp = () => { dragRef.current = null }

  const N = 90
  const prof = []
  for (let i = 0; i <= N; i += 1) {
    const x = a + ((b - a) * i) / N
    const y = fn(x)
    prof.push([x, isFinite(y) ? y : 0])
  }
  const pathAt = (c) => prof.map(([x, y], i) => (i ? 'L ' : 'M ') + px(x) + ' ' + py(y * c)).join(' ')

  // MERIDIAN. (x, f cos t, f sin t) nuqtasi ekranga tushadi: vertikal
  // f cos t, chuqurlik esa gorizontalga `flat` bilan siqiladi. Bu haqiqiy
  // proyeksiya, bezak emas -- shuning uchun burilganda jism yolg'on
  // gapirmaydi.
  const meridian = (t) => prof
    .map(([x, y], i) => (i ? 'L ' : 'M ') + (px(x) + y * Math.sin(t) * flat * sc) + ' ' + py(y * Math.cos(t)))
    .join(' ')

  // Parallellar: bir necha stansiyadagi kesim doiralari.
  const RINGS = 5
  const rings = []
  if (spin >= 0.98) {
    for (let i = 0; i <= RINGS; i += 1) {
      const x = a + ((b - a) * i) / RINGS
      const r = fn(x)
      if (isFinite(r) && Math.abs(r) > 0.02) rings.push({ x, r })
    }
  }

  const V = volumeOf(fn, a, b)
  const rCut = cut !== undefined ? fn(cut) : null

  const dw = disks > 0 ? (b - a) / disks : 0
  const diskList = []
  if (mode === 'disks') {
    for (let i = 0; i < disks; i += 1) {
      const xc = a + (i + 0.5) * dw
      diskList.push({ x0: a + i * dw, xc, r: fn(xc) })
    }
  }
  const vDisks = diskList.reduce((s, d) => s + Math.PI * d.r * d.r * dw, 0)

  return (
    <div className="g11-graph" style={{ width: '100%', flexShrink: 0, minWidth: 0 }}>
      <svg
        ref={svgRef}
        viewBox={'0 0 ' + WD + ' ' + H}
        width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img"
        style={{ display: 'block', maxHeight: H, touchAction: interactive ? 'none' : undefined, cursor: interactive ? 'grab' : undefined, userSelect: interactive ? 'none' : undefined, WebkitUserSelect: interactive ? 'none' : undefined }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {/* Aylanish o'qi. U shunchaki chiziq emas -- jism aynan uning
            atrofida yig'iladi, shuning uchun u har doim ko'rinadi. */}
        <line x1={px(xd[0])} y1={py(0)} x2={px(xd[1])} y2={py(0)} stroke="rgba(23,26,29,.42)" strokeWidth="1.5" strokeDasharray="7 5" />

        {mode === 'disks'
          ? diskList.map((d, i) => (
            <g key={'d' + i} className="g11-in">
              <rect x={px(d.x0)} y={py(d.r)} width={Math.max(1, px(d.x0 + dw) - px(d.x0))} height={Math.max(1, py(-d.r) - py(d.r))} fill={T.graph} fillOpacity="0.14" stroke={T.graph} strokeWidth="0.8" strokeOpacity="0.5" />
              {/* Yon yuza faqat ICHKI chegaralarda: oxirgisida ellips
                  jismdan chiqib turadi va chegara yolg'on ko'rinadi. */}
              {disks <= 8 && i < diskList.length - 1
                ? <ellipse cx={px(d.x0 + dw)} cy={py(0)} rx={Math.max(2, Math.abs(d.r * sc) * flat)} ry={Math.abs(d.r * sc)} fill="none" stroke={T.graph} strokeWidth="1.1" strokeOpacity="0.7" />
                : null}
            </g>
          ))
          : null}

        {/* Supurilgan yuza: meridianning izi. Aylanish qanchalik bo'lgan
            bo'lsa, shuncha nusxa turadi -- ya'ni iz HARAKATNING o'zi. */}
        {spin > 0
          ? Array.from({ length: 9 }, (_, i) => {
            const t = (ang * (i + 1)) / 9
            return <path key={'m' + i} d={meridian(t)} fill="none" stroke={T.graph} strokeWidth="1.1" opacity={0.10 + 0.12 * ((i + 1) / 9)} />
          })
          : null}

        {/* Parallellar: kesim doiralari. Qiya o'zgarganda ular ochiladi va
            yopiladi -- jism aynan shundan «aylanayotgandek» ko'rinadi. */}
        {rings.map((g, i) => (
          <ellipse
            key={'r' + i}
            cx={px(g.x)} cy={py(0)}
            rx={Math.max(1, Math.abs(g.r * sc) * flat)} ry={Math.abs(g.r * sc)}
            fill="none" stroke={T.graph} strokeWidth="1" strokeOpacity="0.45"
          />
        ))}

        {/* Jismning konturi: profil va uning o'qdagi aksi. */}
        <path d={pathAt(1)} fill="none" stroke={T.ink} strokeWidth="2" />
        {spin >= 0.98 ? <path d={pathAt(-1)} fill="none" stroke={T.ink} strokeWidth="2" /> : null}
        {spin >= 0.98 ? (
          <>
            <ellipse cx={px(b)} cy={py(0)} rx={Math.max(2, Math.abs(fn(b) * sc) * flat)} ry={Math.abs(fn(b) * sc)} fill={T.graph} fillOpacity="0.12" stroke={T.ink} strokeWidth="1.4" />
            {fn(a) > 0.01
              ? <ellipse cx={px(a)} cy={py(0)} rx={Math.max(2, Math.abs(fn(a) * sc) * flat)} ry={Math.abs(fn(a) * sc)} fill="none" stroke={T.ink} strokeWidth="1.2" opacity="0.5" />
              : null}
          </>
        ) : null}

        {/* Hozirgi yasovchi: qolganlaridan qalinroq, chunki aynan u
            aylanadi. Sudralganda u jism sirtida yuradi. */}
        {spin > 0 ? <path d={meridian(ang)} fill="none" stroke={T.accent} strokeWidth="2" /> : null}

        {/* Kesim: tekislik o'q bo'ylab yuradi, kesimda DOIRA ko'rinadi. */}
        {mode === 'section' && rCut !== null ? (
          <g className="g11-in">
            <line x1={px(cut)} y1={padTop} x2={px(cut)} y2={H - padB} stroke={T.accent} strokeWidth="1.6" strokeDasharray="4 4" />
            <ellipse cx={px(cut)} cy={py(0)} rx={Math.max(2, Math.abs(rCut * sc) * flat)} ry={Math.abs(rCut * sc)} fill={T.accent} fillOpacity="0.22" stroke={T.accent} strokeWidth="1.8" />
          </g>
        ) : null}
        {mode === 'section' && rCut !== null ? (
          <text
            x={px(cut) + 8}
            y={Math.max(padTop + 11, py(rCut) - 6)}
            textAnchor="start" fontSize="12" fontWeight="700" fill={T.accent} fontFamily={MATH_FONT}
          >
            {(rLabel || 'r') + ' = ' + areaText(rCut)}
          </text>
        ) : null}

        {showV ? (
          <text x={WD - padX} y={padT + 10} textAnchor="end" fontSize="13" fontWeight="700" fill={T.ink2} fontFamily={MATH_FONT}>
            {(vLabel || 'V') + ' = ' + areaText(mode === 'disks' ? vDisks : V)}
          </text>
        ) : null}
      </svg>
      {caption !== undefined ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{caption}</Fx></div> : null}
      {note ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{note}</Fx></div> : null}
    </div>
  )
}
