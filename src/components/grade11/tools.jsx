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

// ============================================================
// SpaceFrame -- FAZOVIY KARKAS. B5 bloki, 35-41 darslar: koordinatalar,
// vektorlar, skalyar ko'paytma, tekislik tenglamasi, tekisliklar orasidagi
// burchak, masofalar, almashtirish va o'xshashlik.
//
// NEGA BITTA ASBOB. Yetti darsning hammasida bitta chizma: koordinata
// o'qlari, pol kataklari va shu karkas ichidagi obyektlar. Rejim
// o'zgaradi, GEOMETRIYA o'zgarmaydi -- shuning uchun bu bitta asbobning
// rejimlari, o'nta asbob emas.
//
// WEBGL YO'Q (PODXOD_11SINF.md §13). Proyeksiya qo'lda hisoblanadi:
// kamera azimuti `yaw`, ko'tarilishi `tilt`, nuqta ekranga ortogonal
// tushadi. O'ng vektor r = (-sin a, cos a, 0), tepa vektor
// u = (-cos a sin t, -sin a sin t, cos t) va ko'rish yo'nalishi
// d = r x u o'zaro perpendikular. Ya'ni burilganda ekranda AYNAN shu
// tomondan ko'rinadigan narsa turadi: chuqurlik `d` bo'yicha hisoblanadi
// va orqadagi qirralar punktir bo'ladi.
//
// ASBOB OXIRGI SATRNI YOZMAYDI (etalon §3). Uzunlik, skalyar ko'paytma,
// burchak va masofa faqat dars `value` bergan joyda chiqadi: razborda --
// ha, javobni o'quvchi yozadigan ekranda -- yo'q.
//
// MA'LUMOT (hammasi ixtiyoriy, dars faqat kerakligini beradi):
//   mode      'point'|'dist'|'mid'|'vec'|'sum'|'dot'|'plane'|'dihedral'|
//             'drop'|'map'
//   box       [4,4,4] yoki [[-3,3],[-3,3],[-1,4]] -- karkas o'lchami
//   points    [{ at, label, sub, tone, proj, coords }]
//   vectors   [{ from, to, label, tone, coords, dash }]
//   sum       { a, b, c, rule:'triangle'|'parallelogram'|'box', at, step }
//   lambda    son -- birinchi vektorni songa ko'paytirish
//   planes    [{ n:[a,b,c], d, label, tone, normal:false, at }]
//             ya'ni a x + b y + c z + d = 0
//   drop      { from, to:'plane'|'plane:Oxy'|'axis:Oz', foot }
//   ratio     son -- kesmani λ nisbatda bo'luvchi nuqta (`mid` rejimi)
//   map       { kind:'shift'|'center'|'plane'|'axis'|'homothety',
//               shape:'tetra'|'cube'|[[x,y,z],...], vec, center, plane,
//               axis, k, t }
//   value     'len'|'dot'|'angle'|'dist'|'coords'|'eq'|'none'
//
// KATTALIKLARNI DARS BERADI, generator emas: `Math.random` yo'q. Aks
// holda har yuklanishda boshqa rasm chiqadi va o'lchov tekshiruvi hech
// narsa ushlamaydi -- B3 va B4 bloklarining qoidasi.
// ============================================================

const SPACE_UI = {
  // HALOL CHIZG'ICH. Perpendikular bo'lmagan kesma MASOFA emas, va asbob
  // uni javobga olmaydi. Qoidani o'quvchi o'qimaydi, unga DUCH KELADI.
  slant: L('qiya', 'наклонная', 'slant'),
  dist: L('masofa', 'расстояние', 'distance'),
  answer: L('javob', 'ответ', 'answer'),
}

const V = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k],
  dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  len: (a) => Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]),
  unit: (a) => {
    const l = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2])
    return l < 1e-9 ? [0, 0, 0] : [a[0] / l, a[1] / l, a[2] / l]
  },
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  lerp: (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t],
  mid: (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2],
}

// Karkas o'lchami bitta ko'rinishga keltiriladi: son -- noldan shu
// songacha, juftlik -- oralig'i.
const boxRanges = (box) => {
  const b = box || [4, 4, 4]
  const one = (v) => (Array.isArray(v)
    ? [Math.min(v[0], v[1]), Math.max(v[0], v[1])]
    : [Math.min(0, v), Math.max(0, v)])
  return [one(b[0]), one(b[1]), one(b[2])]
}

// Son ekranda: butun son butun bo'lib qoladi. `areaText` bu yerda yaramaydi
// -- u 2 ni «2,0» qilib yozadi, va koordinatalar uchligi «(2,0; 3,0; 4,0)»
// bo'lib chiqadi. Darslikda esa (2; 3; 4).
const numTxt = (v) => {
  if (Math.abs(v) < 0.005) return '0'
  const r = Math.round(v * 100) / 100
  const body = Math.abs(r - Math.round(r)) < 1e-9
    ? String(Math.round(r))
    : r.toFixed(2).replace(/0$/, '').replace('.', ',')
  // MINUS matematik belgi (U+2212), defis emas: JS `String(-8)` defis beradi,
  // va u Source Serif da qisqa chiziqcha bo'lib ko'rinadi. Dars ma'lumotida
  // hamma joyda aynan shu belgi ishlatilgan, chizma ham shunday bo'lishi kerak.
  return body.replace('-', '−')
}

// Koordinatalar uchligi ekranda darslikdagidek yoziladi: (2; 3; 4).
const trio = (p) => '(' + p.map((v) => numTxt(v)).join('; ') + ')'

const TONE = { ink: T.ink, accent: T.accent, graph: T.graph, ok: T.ok, tip: T.tip, dim: T.ink3 }

export function SpaceFrame({
  mode = 'point',
  box,
  points = [],
  vectors = [],
  sum,
  lambda,
  planes = [],
  drop,
  ratio,
  map,
  value = 'none',
  valueLabel,
  grid = true,
  frame = false,
  axisNums = false,
  caption,
  note,
  height = 176,
  interactive = false,
  // RAKURS: `yaw` -- karkasni Oz o'qi atrofida burish (0 da darslikning
  // 1-rasmidagi ko'rinish), `depth` -- chuqurlik o'qining QISQARISHI
  // (kabinet proyeksiyasida 0,5).
  yaw0 = 0,
  depth0 = 0.5,
  // YOZUVNING POLI VA MASSHTABI. Asbobning yozuvlari chizmaning O'Z birligida
  // beriladi, va chizma keyin slotga sig'dirish uchun kichraytiriladi -- ya'ni
  // yozuv ham u bilan kichrayadi. 11-sinfda slot keng, kichraytirish yo'q, va
  // 11 birlik ekranda 11 pikselga tushadi. Boshqa sinfda slot torroq bo'lsa,
  // o'sha 11 birlik 9 pikselga aylanadi -- va 10,5 piksellik poldan past
  // tushadi (10-sinfda o'lchangan, 2026-08-21).
  //
  // `textScale` -- tashqi qatlam masshtabni O'LCHAB berishi uchun: chizma
  // kichrayganida yozuv teng darajada kattalashadi va ekranda o'z o'lchamida
  // qoladi. Standarti bir, ya'ni 11-sinf uchun hech narsa o'zgarmaydi.
  textScale = 1,
}) {
  // HOOKLAR ENG BOSHDA. Bu asbobda erta `return` yo'q, lekin qoida bir
  // xil: SpinBoard da holat rejim tekshiruvidan keyin turgani uchun React
  // rejim almashganda «Rendered fewer hooks than expected» bilan yiqilgan.
  const [yawU, setYawU] = useState(null)
  const [depthU, setDepthU] = useState(null)
  const svgRef = useRef(null)
  const dragRef = useRef(null)
  const tt = useT()
  // Uch tilli satr bu asbobda faqat CHIZILADI, taqqoslanmaydi -- shuning
  // uchun uni asbobning O'ZI tarjima qiladi. B2 va B3 bloklarida `L()`
  // obyektining to'g'ridan to'g'ri React ga tushishi ekranni o'n bir marta
  // yiqitgan, va har safar sabab bitta edi.
  const S = (v) => (isTri(v) ? tt(v) : v)

  const ranges = boxRanges(box)
  const rx = ranges[0]
  const ry = ranges[1]
  const rz = ranges[2]
  const yaw = yawU !== null ? yawU : yaw0
  const kk = Math.max(0.28, Math.min(0.85, depthU !== null ? depthU : depth0))

  const cen = [(rx[0] + rx[1]) / 2, (ry[0] + ry[1]) / 2, (rz[0] + rz[1]) / 2]
  const dx = rx[1] - rx[0]
  const dy = ry[1] - ry[0]
  const dz = rz[1] - rz[0]
  const span = Math.max(dx, dy, dz)

  const padX = 44
  const padT = 14
  const padB = 14
  const valueRow = value !== 'none' ? 15 : 0
  const availH = Math.max(24, height - padT - padB - valueRow)

  // PROYEKSIYA -- KABINET, darslikdagi (1-3 rasmlar): y o'ngga, z tepaga,
  // x esa 45 gradus pastga chapga va YARIM uzunlikda.
  //
  // NEGA ORTOGRAFIK KAMERA EMAS. Birinchi oktantning tepasidan qaraydigan
  // kamerada ko'rish yo'nalishi (cos, sin, sin) -- barcha koordinatalari
  // MUSBAT. Shu sababli (1; 1; 1) yoki (2; 2; 1) kabi yo'nalishlar
  // deyarli kameraga qarab turadi va ekranda YIG'ILADI: stend 36-darsning
  // (2; 2; 1) vektorini 9 pikselli qilib chizdi. Bu kameraning aybi emas,
  // uning haqiqati -- lekin bunday chizmadan dars chiqmaydi. Darsliklar
  // shu sababli qiya (kabinet) proyeksiyadan foydalanadi: unda faqat
  // (2,83; 1; 1) atrofidagi yo'nalishlar yig'iladi, ular esa dars
  // ma'lumotida uchramaydi.
  //
  // Burish HALOL qoladi: karkas Oz atrofida haqiqatan buriladi (qattiq
  // harakat), keyin qotirilgan parallel proyeksiya qo'llanadi. O'qlar
  // o'z harflari bilan birga buriladi -- stol ustidagi modelni burganda
  // aynan shunday bo'ladi.
  const C45 = Math.SQRT1_2
  const cs = Math.cos(yaw)
  const sn = Math.sin(yaw)
  const flat = (p) => {
    const x = p[0] - cen[0]
    const y = p[1] - cen[1]
    const X = x * cs + y * sn
    const Y = -x * sn + y * cs
    return [Y - kk * C45 * X, (p[2] - cen[2]) - kk * C45 * X, X]
  }

  // MIQYOS: karkasning sakkiz cho'qqisi proyeksiyada o'lchanadi. Asbob
  // sudralsa -- o'lcham BARCHA burilishlar bo'yicha eng yomon holatdan
  // olinadi, aks holda chizma sudralganda «nafas olardi» va o'quvchi
  // o'lcham o'zgardi deb o'ylardi. Sudralmasa -- aynan shu burilish
  // bo'yicha, ya'ni chizma joyni bekorga egallamaydi.
  let exW = 0.001
  let exH = 0.001
  const corn = []
  for (let i = 0; i < 2; i += 1) {
    for (let j = 0; j < 2; j += 1) {
      for (let k = 0; k < 2; k += 1) corn.push([rx[i], ry[j], rz[k]])
    }
  }
  const samples = interactive ? 24 : 1
  for (let s = 0; s < samples; s += 1) {
    const th = interactive ? (2 * Math.PI * s) / samples : yaw
    const c2 = Math.cos(th)
    const s2 = Math.sin(th)
    corn.forEach((p) => {
      const x = p[0] - cen[0]
      const y = p[1] - cen[1]
      const X = x * c2 + y * s2
      const Y = -x * s2 + y * c2
      exW = Math.max(exW, Math.abs(Y - kk * C45 * X))
      exH = Math.max(exH, Math.abs((p[2] - cen[2]) - kk * C45 * X))
    })
  }
  const sc = availH / (2 * exH + 0.5)
  // viewBox ENI mazmundan chiqadi, qotirilgan 640 dan emas: qotirilganda
  // chizma kartochkaning to'rtdan bir qismini egallardi, chunki SVG eni
  // bo'yicha 100% ga cho'ziladi -- bo'sh joyi bilan birga.
  const W = Math.max(190, Math.round(2 * exW * sc) + padX * 2)
  const cx = W / 2
  // Chizma TEPADA, son PASTDA: tepada z o'qining uchi va harfi turadi,
  // va son aynan shu yerga urilardi.
  const cy = padT + availH / 2

  const P = (p) => {
    const f = flat(p)
    return [cx + f[0] * sc, cy - f[1] * sc]
  }
  const px = (p) => P(p)[0]
  const py = (p) => P(p)[1]
  // Chuqurlik: kabinet proyeksiyasida chuqurlik o'qi TOMOSHABINGA qaraydi,
  // ya'ni X kattasi ko'zga yaqinrog'i. Orqadagi qirraning punktir bo'lishi
  // shundan, qo'lda tanlangan emas.
  const depth = (p) => flat(p)[2]

  const onDown = (e) => {
    if (!interactive) return
    const el = svgRef.current
    if (!el) return
    el.setPointerCapture(e.pointerId)
    dragRef.current = { x: e.clientX, y: e.clientY, yaw, kk }
  }
  const onMove = (e) => {
    const d = dragRef.current
    if (!d) return
    const bx = svgRef.current.getBoundingClientRect()
    const k = bx.width || 1
    // Bir ekran eni = to'liq aylanish: barmoq harakati va karkasning
    // burilishi mos keladi.
    setYawU(d.yaw + ((e.clientX - d.x) / k) * Math.PI * 2)
    // Yuqoriga pastga sudrash CHUQURLIK qisqarishini o'zgartiradi: 0,28 da
    // karkas deyarli tekis ko'rinadi, 0,85 da chuqurlik o'qi cho'ziladi va
    // «tepadan» qaragandek bo'ladi.
    setDepthU(d.kk + ((e.clientY - d.y) / 260) * 0.7)
  }
  const onUp = () => { dragRef.current = null }

  // ---------- karkas: sakkiz cho'qqi va o'n ikki qirra ----------
  const corners = []
  for (let i = 0; i < 2; i += 1) {
    for (let j = 0; j < 2; j += 1) {
      for (let k = 0; k < 2; k += 1) corners.push([rx[i], ry[j], rz[k]])
    }
  }
  const edges = []
  for (let i = 0; i < corners.length; i += 1) {
    for (let j = i + 1; j < corners.length; j += 1) {
      let diffs = 0
      for (let c = 0; c < 3; c += 1) if (Math.abs(corners[i][c] - corners[j][c]) > 1e-9) diffs += 1
      if (diffs === 1) edges.push([i, j])
    }
  }

  // ---------- tekislik va karkas kesishmasi ----------
  // Tekislik KO'PBURCHAK bo'lib chiziladi, va uning chegarasi karkas
  // qirralaridagi kesishish nuqtalari. Qo'lda qo'yilgan to'rtburchak
  // burilganda yolg'on gapirardi.
  const planePoly = (n, d) => {
    const f = (p) => V.dot(n, p) + d
    const pts = []
    edges.forEach((e) => {
      const A = corners[e[0]]
      const B = corners[e[1]]
      const fa = f(A)
      const fb = f(B)
      if (Math.abs(fa - fb) < 1e-9) return
      const t = fa / (fa - fb)
      if (t < -1e-9 || t > 1 + 1e-9) return
      pts.push(V.lerp(A, B, t))
    })
    const uniq = []
    pts.forEach((p) => {
      let seen = false
      uniq.forEach((q) => { if (V.len(V.sub(p, q)) < 1e-6) seen = true })
      if (!seen) uniq.push(p)
    })
    if (uniq.length < 3) return []
    const c = uniq.reduce((s, p) => V.add(s, p), [0, 0, 0]).map((v) => v / uniq.length)
    const nn = V.unit(n)
    const seed = Math.abs(nn[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]
    const u1 = V.unit(V.cross(nn, seed))
    const u2 = V.cross(nn, u1)
    return uniq
      .map((p) => ({ p, a: Math.atan2(V.dot(V.sub(p, c), u2), V.dot(V.sub(p, c), u1)) }))
      .sort((A, B) => A.a - B.a)
      .map((o) => o.p)
  }
  // Tekislikning karkas markaziga eng yaqin nuqtasi: NORMAL strelkasi shu
  // yerdan chiqadi, chunki u chizmaning o'rtasida ko'rinadi.
  const planeFoot = (n, d) => {
    const l2 = V.dot(n, n)
    return l2 < 1e-9 ? cen : V.sub(cen, V.mul(n, (V.dot(n, cen) + d) / l2))
  }

  // ---------- ikki yo'nalish orasidagi yoy ----------
  // Yoy HAQIQIY: ikki yo'nalish orasida sferik interpolyatsiya bilan
  // yuriladi, ya'ni chizmada burchakning o'zi turadi, uning taqlidi emas.
  const arcPath = (o, d1, d2, r) => {
    const a = V.unit(d1)
    const b = V.unit(d2)
    const cosw = Math.max(-1, Math.min(1, V.dot(a, b)))
    const w = Math.acos(cosw)
    if (w < 1e-3 || Math.abs(Math.PI - w) < 1e-3) return ''
    const N = 22
    const out = []
    for (let i = 0; i <= N; i += 1) {
      const t = i / N
      const s1 = Math.sin((1 - t) * w) / Math.sin(w)
      const s2 = Math.sin(t * w) / Math.sin(w)
      out.push(V.add(o, V.mul(V.add(V.mul(a, s1), V.mul(b, s2)), r)))
    }
    return out.map((p, i) => (i ? 'L ' : 'M ') + P(p).join(' ')).join(' ')
  }

  // ---------- strelka ----------
  const arrow = (from, to, tone, opts) => {
    const o = opts || {}
    const A = P(from)
    const B = P(to)
    const ang = Math.atan2(B[1] - A[1], B[0] - A[0])
    const h = o.head === undefined ? 9 : o.head
    const w = 0.42
    return (
      <g key={o.key} opacity={o.op === undefined ? 1 : o.op}>
        <line
          x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]}
          stroke={tone} strokeWidth={o.thin ? 1.5 : 2.1}
          strokeDasharray={o.dash ? '5 4' : undefined}
          strokeLinecap="round"
        />
        {h > 0 ? (
          <path
            d={'M ' + B[0] + ' ' + B[1]
              + ' L ' + (B[0] - h * Math.cos(ang - w)) + ' ' + (B[1] - h * Math.sin(ang - w))
              + ' L ' + (B[0] - h * Math.cos(ang + w)) + ' ' + (B[1] - h * Math.sin(ang + w)) + ' Z'}
            fill={tone}
          />
        ) : null}
      </g>
    )
  }

  // ---------- matn ----------
  // Indeks `tspan` bilan chiziladi, Unicode belgi bilan emas: shriftda
  // pastki indeks HARFGA o'xshab ketadi (etalon §7).
  // Har yozuvning O'Z poli: 11 birlik. Ilgari o'qlardagi sonlar 9,5 birlik
  // bilan yozilgan edi, ya'ni kichraytirishsiz ham poldan past chiqardi.
  const FS = (v) => Math.max(11, (v || 13) * textScale)

  const label = (p, text, tone, opts) => {
    const o = opts || {}
    const A = P(p)
    // O'NG CHEGARADA yozuv chapga o'giriladi. Aks holda uzun uchlik
    // «(2; 3; 4)» viewBox dan chiqib ketadi va KESILADI: `.stage-content`
    // da `overflow: clip`, ya'ni sig'magan narsa surilmaydi, yo'qoladi.
    const flip = o.anchor === undefined && A[0] > W * 0.62
    const dxx = o.dx === undefined ? 7 : o.dx
    return (
      <text
        key={o.key}
        x={A[0] + (flip ? -Math.abs(dxx) : dxx)}
        y={A[1] + (o.dy === undefined ? -7 : o.dy)}
        fontSize={FS(o.size)}
        fontWeight={o.weight || 700}
        fontStyle={o.roman ? 'normal' : 'italic'}
        fill={tone}
        fontFamily={MATH_FONT}
        textAnchor={o.anchor || (flip ? 'end' : 'start')}
      >
        {text}
        {o.sub ? <tspan fontSize={Math.max(11, FS(o.size) * 0.72)} dy="3" fontStyle="normal">{o.sub}</tspan> : null}
      </text>
    )
  }

  // ---------- asbob HISOBLAYDIGAN sonlar ----------
  const vecOf = (v) => V.sub(v.to, v.from)
  const v0 = vectors[0] ? vecOf(vectors[0]) : null
  const v1 = vectors[1] ? vecOf(vectors[1]) : null
  const dotVal = v0 && v1 ? V.dot(v0, v1) : null
  const angVal = v0 && v1 && V.len(v0) > 1e-9 && V.len(v1) > 1e-9
    ? (Math.acos(Math.max(-1, Math.min(1, V.dot(v0, v1) / (V.len(v0) * V.len(v1))))) * 180) / Math.PI
    : null

  // Kesma o'rtasi yoki λ nisbatda bo'luvchi nuqta. Ikkinchisi darslikning
  // 116-betidagi formulaning o'zi.
  let midPoint = null
  if (points.length >= 2) {
    const A = points[0].at
    const B = points[1].at
    midPoint = ratio === undefined || ratio === null
      ? V.mid(A, B)
      : [
        (A[0] + ratio * B[0]) / (1 + ratio),
        (A[1] + ratio * B[1]) / (1 + ratio),
        (A[2] + ratio * B[2]) / (1 + ratio),
      ]
  }

  // HALOL CHIZG'ICH. Nishon: tekislik, koordinata tekisligi yoki o'q.
  // Perpendikular BO'LMASA -- «qiya», va soni YO'Q.
  let dropInfo = null
  if (drop && drop.from) {
    const target = drop.to || 'plane'
    let n = null
    let axis = null
    if (target.indexOf('axis:') === 0) {
      const which = target.slice(5)
      axis = which === 'Ox' ? [1, 0, 0] : which === 'Oy' ? [0, 1, 0] : [0, 0, 1]
    } else if (target === 'plane:Oxy') n = [0, 0, 1]
    else if (target === 'plane:Oxz') n = [0, 1, 0]
    else if (target === 'plane:Oyz') n = [1, 0, 0]
    else {
      const idx = target.indexOf(':') > 0 ? Number(target.slice(target.indexOf(':') + 1)) : 0
      const pl = planes[idx] || planes[0]
      n = pl ? pl.n : [0, 0, 1]
    }
    let foot = drop.foot
    if (!foot) {
      if (axis) foot = V.mul(axis, V.dot(drop.from, axis))
      else {
        const idx = target.indexOf(':') > 0 ? Number(target.slice(target.indexOf(':') + 1)) : 0
        const pl = target.indexOf('plane:O') === 0
          ? { n, d: 0 }
          : (planes[idx] || planes[0] || { n, d: 0 })
        const l2 = V.dot(pl.n, pl.n) || 1
        foot = V.sub(drop.from, V.mul(pl.n, (V.dot(pl.n, drop.from) + (pl.d || 0)) / l2))
      }
    }
    const seg = V.sub(foot, drop.from)
    const l = V.len(seg)
    let perp = false
    if (l > 1e-9) {
      perp = axis
        ? Math.abs(V.dot(V.unit(seg), V.unit(axis))) < 0.02
        : Math.abs(Math.abs(V.dot(V.unit(seg), V.unit(n))) - 1) < 0.02
    }
    dropInfo = { foot, seg, len: l, perp, axis, n }
  }

  // ALMASHTIRISH: shakl va uning TASVIRI. Tasvirni asbob hisoblaydi --
  // dars faqat qanday almashtirish va koeffitsiyentni beradi.
  let mapInfo = null
  if (map) {
    const SH = {
      tetra: [[0, 0, 0], [2, 0, 0], [0, 2, 0], [0, 0, 2]],
      cube: [[0, 0, 0], [2, 0, 0], [2, 2, 0], [0, 2, 0], [0, 0, 2], [2, 0, 2], [2, 2, 2], [0, 2, 2]],
    }
    const LN = {
      tetra: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]],
      cube: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]],
    }
    const shape = Array.isArray(map.shape) ? map.shape : SH[map.shape || 'tetra']
    const links = Array.isArray(map.shape)
      ? (map.links || shape.map((_, i) => [i, (i + 1) % shape.length]))
      : LN[map.shape || 'tetra']
    const img = (p) => {
      const k = map.kind || 'shift'
      if (k === 'shift') return V.add(p, map.vec || [1, 1, 1])
      if (k === 'center') return V.sub(V.mul(map.center || [0, 0, 0], 2), p)
      if (k === 'plane') {
        const w = map.plane || 'Oxy'
        return w === 'Oxy' ? [p[0], p[1], -p[2]] : w === 'Oxz' ? [p[0], -p[1], p[2]] : [-p[0], p[1], p[2]]
      }
      if (k === 'axis') {
        const w = map.axis || 'Oz'
        return w === 'Oz' ? [-p[0], -p[1], p[2]] : w === 'Oy' ? [-p[0], p[1], -p[2]] : [p[0], -p[1], -p[2]]
      }
      // Gomotetiya: markazdan koeffitsiyent bilan. k < 0 bo'lsa tasvir
      // markazning BOSHQA tomonida -- «minus yo'qoldi» xatosi shu yerda
      // ko'rinadi.
      const c = map.center || [0, 0, 0]
      return V.add(c, V.mul(V.sub(p, c), map.k === undefined ? 2 : map.k))
    }
    const t = map.t === undefined ? 1 : Math.max(0, Math.min(1, map.t))
    // Koordinatasi ko'rsatiladigan cho'qqi: markazdan ENG UZOQ turgani.
    // Nol cho'qqisi ko'pincha markazning o'zi bo'ladi va uning tasviri
    // «(0; 0; 0)» bo'lib chiqadi -- bu hech narsani ko'rsatmaydi.
    const c0 = map.center || [0, 0, 0]
    let watch = map.watch === undefined ? 0 : map.watch
    if (map.watch === undefined) {
      let best = -1
      shape.forEach((p, i) => {
        const dd = V.len(V.sub(p, c0))
        if (dd > best + 1e-9) { best = dd; watch = i }
      })
    }
    mapInfo = {
      src: shape,
      dst: shape.map((p) => V.lerp(p, img(p), t)),
      full: shape.map(img),
      links,
      t,
      watch,
    }
  }

  // Ekrandagi SON. Dars so'ramasa -- yo'q: javobni o'quvchi yozadi.
  let readout = null
  if (value === 'len' && v0) readout = (S(valueLabel) || '|a|') + ' = ' + numTxt(V.len(v0))
  if (value === 'dot' && dotVal !== null) readout = (S(valueLabel) || 'a · b') + ' = ' + numTxt(dotVal)
  if (value === 'angle' && angVal !== null) readout = (S(valueLabel) || 'φ') + ' = ' + numTxt(angVal) + '°'
  if (value === 'dist') {
    if (dropInfo) readout = dropInfo.perp ? tt(SPACE_UI.dist) + ' = ' + numTxt(dropInfo.len) : null
    else if (points.length >= 2) {
      readout = (S(valueLabel) || 'AB') + ' = ' + numTxt(V.len(V.sub(points[1].at, points[0].at)))
    }
  }
  if (value === 'coords') {
    const p = mapInfo ? mapInfo.full[mapInfo.watch] : midPoint
    if (p) readout = (S(valueLabel) || 'C') + ' ' + trio(p)
  }
  if (value === 'eq' && planes[0]) {
    const n = planes[0].n
    const d = planes[0].d || 0
    const head = n[0] === 0 ? '' : (n[0] < 0 ? '−' : '') + (Math.abs(n[0]) === 1 ? '' : numTxt(Math.abs(n[0]))) + 'x'
    const term = (k, s) => (k === 0 ? '' : (k > 0 ? ' + ' : ' − ') + (Math.abs(k) === 1 && s ? '' : numTxt(Math.abs(k))) + s)
    readout = (head + term(n[1], 'y') + term(n[2], 'z') + term(d, '')).replace(/^ \+ /, '') + ' = 0'
  }

  // ---------- o'qlar va pol kataklari ----------
  const axisList = [
    // x o'qining sonlari o'qning TASHQI tomonida: ichkarida pol kataklari,
    // proyeksiyalar va A1 yozuvi turadi.
    { key: 'x', dir: [1, 0, 0], r: rx, nx: -8, ny: -3, na: 'end' },
    { key: 'y', dir: [0, 1, 0], r: ry, nx: 3, ny: 14, na: 'start' },
    { key: 'z', dir: [0, 0, 1], r: rz, nx: -7, ny: 4, na: 'end' },
  ]
  const gridLines = []
  if (grid && rz[0] <= 0 && rz[1] >= 0) {
    for (let x = Math.ceil(rx[0]); x <= rx[1] + 1e-9; x += 1) gridLines.push([[x, ry[0], 0], [x, ry[1], 0]])
    for (let y = Math.ceil(ry[0]); y <= ry[1] + 1e-9; y += 1) gridLines.push([[rx[0], y, 0], [rx[1], y, 0]])
  }

  // MASOFA rejimi: AB -- qirralari |Δx|, |Δy|, |Δz| bo'lgan
  // parallelepipedning DIAGONALI (darslik, 115-bet izohi). Formula
  // yodlanadigan narsa emas, chizmada ko'rinadigan narsa bo'ladi.
  let distBox = null
  if (mode === 'dist' && points.length >= 2) {
    const A = points[0].at
    const B = points[1].at
    const c1 = [B[0], A[1], A[2]]
    const c2 = [B[0], B[1], A[2]]
    distBox = {
      A,
      B,
      // Uchta qirra uchta AYIRMA: har birining yozuvi o'z tomonida turadi,
      // aks holda uchtasi bir joyga yig'ilib o'qilmas bo'lib qoladi.
      legs: [
        { from: A, to: c1, txt: numTxt(Math.abs(B[0] - A[0])), dx: -2, dy: 15 },
        { from: c1, to: c2, txt: numTxt(Math.abs(B[1] - A[1])), dx: 5, dy: 14 },
        { from: c2, to: B, txt: numTxt(Math.abs(B[2] - A[2])), dx: 7, dy: 2 },
      ],
      hidden: [
        [A, [A[0], B[1], A[2]]], [[A[0], B[1], A[2]], c2],
        [A, [A[0], A[1], B[2]]], [[A[0], A[1], B[2]], [B[0], A[1], B[2]]],
        [[A[0], A[1], B[2]], [A[0], B[1], B[2]]], [[A[0], B[1], B[2]], B],
        [[B[0], A[1], B[2]], B], [c1, [B[0], A[1], B[2]]],
      ],
    }
  }

  return (
    <div className="g11-graph" style={{ width: '100%', flexShrink: 0, minWidth: 0 }}>
      <svg
        ref={svgRef}
        viewBox={'0 0 ' + W + ' ' + height}
        width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img"
        style={{
          display: 'block',
          maxHeight: height,
          touchAction: interactive ? 'none' : undefined,
          cursor: interactive ? 'grab' : undefined,
          userSelect: interactive ? 'none' : undefined,
          WebkitUserSelect: interactive ? 'none' : undefined,
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {/* POL KATAKLARI. Nuqta havoda emas, o'lchamli joyda turadi:
            kataklar bo'lmasa uch o'lchovli chizma tekis rasmga aylanadi. */}
        {gridLines.map((g, i) => (
          <line key={'g' + i} x1={px(g[0])} y1={py(g[0])} x2={px(g[1])} y2={py(g[1])}
            stroke={T.ink3} strokeOpacity="0.26" strokeWidth="0.7" />
        ))}

        {/* KARKAS QIRRALARI. Orqadagilari punktir, va bu chuqurlik bo'yicha
            HISOBLANADI -- shuning uchun burilganda ham to'g'ri qoladi. */}
        {frame ? edges.map((e, k) => {
          const back = depth(V.mid(corners[e[0]], corners[e[1]])) < 0
          return (
            <line key={'e' + k}
              x1={px(corners[e[0]])} y1={py(corners[e[0]])}
              x2={px(corners[e[1]])} y2={py(corners[e[1]])}
              stroke={T.ink3} strokeWidth={back ? 0.9 : 1.2}
              strokeDasharray={back ? '4 4' : undefined}
              strokeOpacity={back ? 0.5 : 0.8}
            />
          )
        }) : null}

        {/* O'QLAR: uchtasi ham ko'rinadi, musbat tomonida strelka va harf. */}
        {axisList.map((ax) => {
          const a = V.mul(ax.dir, ax.r[0])
          const b = V.mul(ax.dir, ax.r[1])
          const tip = V.mul(ax.dir, ax.r[1] + span * 0.1)
          // Belgilar QADAMI oraliqqa qarab: -4 dan 4 gacha har birlikda
          // sakkiz son chiqadi va ular proyeksiyada bir-biriga urilardi.
          const stepA = ax.r[1] - ax.r[0] > 7 ? 2 : 1
          const marks = []
          for (let v = Math.ceil(ax.r[0] / stepA) * stepA; v <= ax.r[1] + 1e-9; v += stepA) {
            if (Math.abs(v) > 1e-9) marks.push(v)
          }
          return (
            <g key={'ax' + ax.key}>
              <line x1={px(a)} y1={py(a)} x2={px(b)} y2={py(b)} stroke={T.ink2} strokeWidth="1.3" />
              {arrow(b, tip, T.ink2, { thin: true, head: 7, key: 'ah' + ax.key })}
              {label(tip, ax.key, T.ink2, { key: 'al' + ax.key, size: 13, dx: 5, dy: -4 })}
              {marks.map((v, i) => {
                const p = V.mul(ax.dir, v)
                const A = P(p)
                return (
                  <g key={'t' + ax.key + i}>
                    <circle cx={A[0]} cy={A[1]} r="1.6" fill={T.ink3} />
                    {axisNums
                      ? (
                        <text x={A[0] + ax.nx} y={A[1] + ax.ny} fontSize={FS(9.5)} fill={T.ink3}
                          textAnchor={ax.na} fontFamily="'JetBrains Mono', monospace">{v}</text>
                      ) : null}
                  </g>
                )
              })}
            </g>
          )
        })}

        {/* TEKISLIKLAR. Ko'pburchak karkas bilan kesishmasidan chiqadi,
            NORMAL esa strelka bo'lib turadi: 38 va 39 darslarning butun
            ma'nosi shu strelkada. */}
        {planes.map((pl, i) => {
          const poly = planePoly(pl.n, pl.d || 0)
          if (!poly.length) return null
          const tone = TONE[pl.tone] || T.graph
          const foot = pl.at || planeFoot(pl.n, pl.d || 0)
          const tip = V.add(foot, V.mul(V.unit(pl.n), span * 0.5))
          return (
            <g key={'pl' + i}>
              <polygon
                points={poly.map((p) => P(p).join(',')).join(' ')}
                fill={tone} fillOpacity="0.14" stroke={tone} strokeWidth="1.5"
              />
              {pl.normal === false ? null : arrow(foot, tip, tone, { key: 'pn' + i })}
              {pl.label !== undefined
                ? label(
                  poly.reduce((best, q) => (P(q)[0] > P(best)[0] ? q : best), poly[0]),
                  S(pl.label), tone, { key: 'pll' + i, dx: 7, dy: -6 },
                )
                : null}
            </g>
          )
        })}

        {/* IKKI TEKISLIK ORASIDAGI BURCHAK. Asbob IKKI juft burchakni ham
            chizadi va qaysi biri JAVOB ekanini yozadi: blokning asosiy
            chalkashligi shu -- o'tmas burchak o'tkirning o'rniga olinadi. */}
        {mode === 'dihedral' && planes.length >= 2 ? (() => {
          const n1 = V.unit(planes[0].n)
          const n2 = V.unit(planes[1].n)
          const c = Math.max(-1, Math.min(1, V.dot(n1, n2)))
          const phi = (Math.acos(c) * 180) / Math.PI
          const acute = Math.min(phi, 180 - phi)
          // NORMALLAR KESISHISH CHIZIG'IDA turadi, havoda emas: burchak
          // ikki tekislikning QIRRASIDA o'lchanadi. Nuqta karkas markaziga
          // eng yaqin bo'lgani olinadi -- ikkita chiziqli tenglama:
          //   n1 (cen + a n1 + b n2) + d1 = 0
          //   n2 (cen + a n1 + b n2) + d2 = 0
          // MUHIM: `n1` va `n2` BIRLIK vektorlar, shuning uchun ozod had
          // ham shu uzunlikka bo'linadi. Aks holda nuqta tekislikning
          // USTIDA yotmaydi -- birinchi urinishda normallar qirradan
          // yarim birlik nariroqda turdi va buni faqat surat ko'rsatdi.
          const l1 = V.len(planes[0].n) || 1
          const l2 = V.len(planes[1].n) || 1
          const d1 = (planes[0].d || 0) / l1
          const d2 = (planes[1].d || 0) / l2
          const m12 = V.dot(n1, n2)
          const det = 1 - m12 * m12
          const r1 = -(V.dot(n1, cen) + d1)
          const r2 = -(V.dot(n2, cen) + d2)
          const aa = Math.abs(det) < 1e-9 ? 0 : (r1 - m12 * r2) / det
          const bb = Math.abs(det) < 1e-9 ? 0 : (r2 - m12 * r1) / det
          const o = V.add(cen, V.add(V.mul(n1, aa), V.mul(n2, bb)))
          const r = span * 0.24
          const n2b = V.mul(n2, -1)
          return (
            <g>
              {/* IKKI TEKISLIKNING QIRRASI. Burchak aynan shu chiziqda
                  o'lchanadi, shuning uchun chiziq CHIZILADI: normal
                  strelkalari havoda turgan chizmada o'quvchi burchakni
                  nimaga nisbatan o'lchashini ko'rmaydi. */}
              {(() => {
                const u = V.cross(n1, n2)
                if (V.len(u) < 1e-6) return null
                const uu = V.unit(u)
                let t0 = -1e9
                let t1 = 1e9
                const rr = [rx, ry, rz]
                for (let k = 0; k < 3; k += 1) {
                  if (Math.abs(uu[k]) < 1e-9) continue
                  const ta = (rr[k][0] - o[k]) / uu[k]
                  const tb = (rr[k][1] - o[k]) / uu[k]
                  t0 = Math.max(t0, Math.min(ta, tb))
                  t1 = Math.min(t1, Math.max(ta, tb))
                }
                if (!(t1 > t0)) return null
                const q0 = V.add(o, V.mul(uu, t0))
                const q1 = V.add(o, V.mul(uu, t1))
                return <line x1={px(q0)} y1={py(q0)} x2={px(q1)} y2={py(q1)} stroke={T.ink} strokeWidth="2" />
              })()}
              {arrow(o, V.add(o, V.mul(n1, r * 2.2)), T.graph, { key: 'dn1', thin: true })}
              {arrow(o, V.add(o, V.mul(n2, r * 2.2)), T.accent, { key: 'dn2', thin: true })}
              {arrow(o, V.add(o, V.mul(n2b, r * 2.2)), T.accent, { key: 'dn2b', thin: true, dash: true, op: 0.45 })}
              <path d={arcPath(o, n1, n2, r * 1.3)} fill="none" stroke={T.ok} strokeWidth="1.7" />
              <path d={arcPath(o, n1, n2b, r * 1.95)} fill="none" stroke={T.ink3} strokeWidth="1.2"
                strokeDasharray="4 3" />
              {/* IKKI SON pastdagi satrda turadi, chizmaning ustida emas:
                  proyeksiyada bissektrisalar yaqin ko'rinadi va sonlar
                  ustma-ust tushardi -- 212 px da esa umuman o'qilmasdi.
                  Yashil son -- javob, kulrangi -- qo'shimchasi. */}
              <text x={6} y={height - 4} fontSize={FS(12)} fontWeight="700" fontFamily={MATH_FONT}>
                <tspan fill={T.ok}>{tt(SPACE_UI.answer) + ' ' + numTxt(acute) + '°'}</tspan>
                <tspan dx="9" fill={T.ink3} fontSize={FS(11.5)}>{'/ ' + numTxt(Math.max(phi, 180 - phi)) + '°'}</tspan>
              </text>
            </g>
          )
        })() : null}

        {/* MASOFA: AB parallelepipedning diagonali, qirralari esa
            koordinatalar AYIRMASI. Ikki marta Pifagor -- ko'rinib turadi. */}
        {distBox ? (
          <g>
            {distBox.hidden.map((s, i) => (
              <line key={'dh' + i} x1={px(s[0])} y1={py(s[0])} x2={px(s[1])} y2={py(s[1])}
                stroke={T.ink3} strokeWidth="0.9" strokeDasharray="4 4" strokeOpacity="0.7" />
            ))}
            {distBox.legs.map((s, i) => (
              <g key={'dl' + i}>
                <line x1={px(s.from)} y1={py(s.from)} x2={px(s.to)} y2={py(s.to)}
                  stroke={T.graph} strokeWidth="1.7" />
                {label(V.mid(s.from, s.to), s.txt, T.graph,
                  { key: 'dlt' + i, roman: true, size: 11, weight: 700, dx: s.dx, dy: s.dy })}
              </g>
            ))}
            <line x1={px(distBox.A)} y1={py(distBox.A)} x2={px(distBox.B)} y2={py(distBox.B)}
              stroke={T.ink} strokeWidth="2.1" />
          </g>
        ) : null}

        {/* KESMA va O'RTASI: o'rtasi UCHLARNING o'rtachasi ekanini asbob
            hisoblab ko'rsatadi, dars sonni takrorlamaydi. */}
        {mode === 'mid' && points.length >= 2 ? (
          <g>
            <line x1={px(points[0].at)} y1={py(points[0].at)} x2={px(points[1].at)} y2={py(points[1].at)}
              stroke={T.ink} strokeWidth="1.9" />
            <g className="g11-in">
              <circle cx={px(midPoint)} cy={py(midPoint)} r="4.2" fill={T.graph} />
              {label(midPoint, 'C', T.graph, { key: 'mcl', dx: 7, dy: -7 })}
              {label(midPoint, trio(midPoint), T.graph,
                { key: 'mcc', dx: 7, dy: 13, roman: true, size: 11.5, weight: 600 })}
            </g>
          </g>
        ) : null}

        {/* VEKTORLAR. Koordinatalarini ASBOB yozadi: dars sonlarni
            takrorlamaydi, va uchni surganda son o'zi o'zgaradi. */}
        {vectors.map((v, i) => {
          const tone = TONE[v.tone] || T.graph
          const c = vecOf(v)
          const m = V.mid(v.from, v.to)
          return (
            <g key={'v' + i}>
              {arrow(v.from, v.to, tone, { key: 'va' + i, dash: v.dash })}
              {v.label !== undefined ? label(m, S(v.label), tone, { key: 'vl' + i, dx: 6, dy: -6 }) : null}
              {v.coords
                ? label(m, trio(c), tone, {
                  key: 'vc' + i,
                  dx: v.label !== undefined ? 20 : 6,
                  dy: -6,
                  roman: true,
                  size: 11.5,
                  weight: 600,
                })
                : null}
            </g>
          )
        })}

        {/* SONGA KO'PAYTIRISH: λ < 0 bo'lsa strelka teskari tomonga o'tadi.
            Bu qoida emas, ekranda ko'rinadigan fakt. */}
        {lambda !== undefined && vectors[0] ? (() => {
          const v = vectors[0]
          const to = V.add(v.from, V.mul(vecOf(v), lambda))
          return (
            <g className="g11-in">
              {arrow(v.from, to, T.accent, { key: 'lam' })}
              {label(V.mid(v.from, to), numTxt(lambda) + ' a', T.accent, { key: 'laml', dx: 6, dy: 14 })}
            </g>
          )
        })() : null}

        {/* YIG'INDI. Uchburchak, parallelogramm va parallelepiped qoidasi --
            bitta amalning uch ko'rinishi, shuning uchun bitta rejim. */}
        {sum ? (() => {
          const at = sum.at || [0, 0, 0]
          const a = sum.a || [1, 0, 0]
          const b = sum.b || [0, 1, 0]
          const c = sum.c
          const step = sum.step === undefined ? 99 : sum.step
          const rule = sum.rule || 'triangle'
          const A = V.add(at, a)
          const B = V.add(at, b)
          const AB = V.add(A, b)
          const ABC = c ? V.add(AB, c) : null
          const tip = ABC || AB
          return (
            <g>
              {step >= 1 ? arrow(at, A, T.graph, { key: 'sa' }) : null}
              {step >= 1 ? label(V.mid(at, A), 'a', T.graph, { key: 'sal', dx: 4, dy: 15 }) : null}
              {step >= 2 ? arrow(rule === 'triangle' ? A : at, rule === 'triangle' ? AB : B, T.tip, { key: 'sb' }) : null}
              {step >= 2
                ? label(rule === 'triangle' ? V.mid(A, AB) : V.mid(at, B), 'b', T.tip,
                  { key: 'sbl', dx: 8, dy: rule === 'triangle' ? 13 : -6 })
                : null}
              {/* Parallelogramm: yopiluvchi tomonlar PUNKTIR, chunki ular
                  ko'chirilgan nusxa, yangi vektor emas. */}
              {step >= 3 && rule !== 'triangle' ? (
                <g>
                  <line x1={px(A)} y1={py(A)} x2={px(AB)} y2={py(AB)} stroke={T.ink3}
                    strokeWidth="1.1" strokeDasharray="4 4" />
                  <line x1={px(B)} y1={py(B)} x2={px(AB)} y2={py(AB)} stroke={T.ink3}
                    strokeWidth="1.1" strokeDasharray="4 4" />
                </g>
              ) : null}
              {step >= 3 && rule === 'box' && c ? (() => {
                const C = V.add(at, c)
                const segs = [
                  [A, V.add(A, c)], [B, V.add(B, c)], [C, V.add(C, a)], [C, V.add(C, b)],
                  [AB, ABC], [V.add(A, c), ABC], [V.add(B, c), ABC],
                ]
                return (
                  <g>
                    {arrow(at, C, T.ink2, { key: 'sc', thin: true })}
                    {label(V.mid(at, C), 'c', T.ink2, { key: 'scl', dx: -15, dy: 4 })}
                    {segs.map((s, i) => (
                      <line key={'sbx' + i} x1={px(s[0])} y1={py(s[0])} x2={px(s[1])} y2={py(s[1])}
                        stroke={T.ink3} strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.8" />
                    ))}
                  </g>
                )
              })() : null}
              {step >= 3 ? arrow(at, tip, T.accent, { key: 'ss' }) : null}
              {step >= 3
                ? label(V.lerp(at, tip, 0.3), c ? 'a + b + c' : 'a + b', T.accent,
                  { key: 'ssl', dx: -8, dy: -9, size: 12.5, anchor: 'end' })
                : null}
              {step >= 3
                ? label(tip, trio(V.sub(tip, at)), T.accent,
                  { key: 'ssc', dx: 8, dy: 16, roman: true, size: 11.5, weight: 600 })
                : null}
            </g>
          )
        })() : null}

        {/* SKALYAR KO'PAYTMA: son burchak YONIDA turadi va 90 gradusda
            NOLGA aylanadi. Perpendikularlik formuladagi tekshiruv emas,
            ko'rinadigan narsa bo'ladi. */}
        {mode === 'dot' && v0 && v1 ? (() => {
          const o = vectors[0].from
          const r = Math.min(V.len(v0), V.len(v1)) * 0.34
          const perp = Math.abs(dotVal) < 0.005
          const bis = V.unit(V.add(V.unit(v0), V.unit(v1)))
          return (
            <g>
              <path d={arcPath(o, v0, v1, r)} fill="none" stroke={perp ? T.ok : T.ink2} strokeWidth="1.6" />
              {/* TO'G'RI BURCHAK belgisi -- kvadratcha. Geometriya belgisi,
                  matnli «perpendikular» emas. */}
              {perp ? (() => {
                const u1 = V.mul(V.unit(v0), r)
                const u2 = V.mul(V.unit(v1), r)
                const q = [o, V.add(o, u1), V.add(o, V.add(u1, u2)), V.add(o, u2)]
                return <polygon points={q.map((p) => P(p).join(',')).join(' ')} fill="none" stroke={T.ok} strokeWidth="1.5" />
              })() : null}
              {angVal !== null
                ? label(V.add(o, V.mul(bis, r * 2.1)), numTxt(angVal) + '°', perp ? T.ok : T.ink2,
                  { key: 'dang', roman: true, size: 12, dx: 3, dy: 3 })
                : null}
            </g>
          )
        })() : null}

        {/* HALOL CHIZG'ICH. Perpendikular bo'lsa -- «masofa» va son. Qiya
            bo'lsa -- «qiya» so'zi va SONSIZ. To'g'ri perpendikular
            KO'RSATILMAYDI: u javob bo'lardi. */}
        {dropInfo ? (
          <g>
            <line
              x1={px(drop.from)} y1={py(drop.from)} x2={px(dropInfo.foot)} y2={py(dropInfo.foot)}
              stroke={dropInfo.perp ? T.ok : T.tip} strokeWidth="2"
              strokeDasharray={dropInfo.perp ? undefined : '6 4'}
            />
            <circle cx={px(dropInfo.foot)} cy={py(dropInfo.foot)} r="3.4" fill={dropInfo.perp ? T.ok : T.tip} />
            {dropInfo.perp ? (() => {
              const r = span * 0.14
              const u1 = V.mul(V.unit(V.sub(drop.from, dropInfo.foot)), r)
              const along = dropInfo.axis
                ? V.unit(dropInfo.axis)
                : V.unit(V.cross(dropInfo.n, V.sub(drop.from, dropInfo.foot)))
              const u2 = V.mul(along, r)
              const q = [dropInfo.foot, V.add(dropInfo.foot, u1),
                V.add(dropInfo.foot, V.add(u1, u2)), V.add(dropInfo.foot, u2)]
              return <polygon points={q.map((p) => P(p).join(',')).join(' ')} fill="none" stroke={T.ok} strokeWidth="1.4" />
            })() : null}
            {/* Perpendikular bo'lsa SO'Z yozilmaydi: to'g'ri burchak
                belgisi va pastdagi son yetarli, aks holda yozuv nuqta
                harfi bilan urilardi. Qiyada so'z SHART -- soni yo'q, va
                nima uchun yo'qligini aynan shu so'z aytadi. */}
            {dropInfo.perp && value === 'dist' ? null : label(
              V.mid(drop.from, dropInfo.foot),
              dropInfo.perp ? tt(SPACE_UI.dist) : tt(SPACE_UI.slant),
              dropInfo.perp ? T.ok : T.tip,
              { key: 'dlab', roman: true, size: 11.5, dx: 7, dy: 14, weight: 700 },
            )}
          </g>
        ) : null}

        {/* ALMASHTIRISH: shakl va TASVIRI. `t` bilan tasvir joyiga ko'zga
            KO'RINIB boradi -- DINAMIKA_VA_ILLUSTRATSIYA talabi: harakat
            o'zi ma'no tashiydi. */}
        {mapInfo ? (
          <g>
            {mapInfo.links.map((e, k) => (
              <line key={'ms' + k}
                x1={px(mapInfo.src[e[0]])} y1={py(mapInfo.src[e[0]])}
                x2={px(mapInfo.src[e[1]])} y2={py(mapInfo.src[e[1]])}
                stroke={T.ink} strokeWidth="1.7" />
            ))}
            {mapInfo.t > 0.02 ? mapInfo.links.map((e, k) => (
              <line key={'md' + k}
                x1={px(mapInfo.dst[e[0]])} y1={py(mapInfo.dst[e[0]])}
                x2={px(mapInfo.dst[e[1]])} y2={py(mapInfo.dst[e[1]])}
                stroke={T.accent} strokeWidth="1.7" opacity={0.35 + 0.65 * mapInfo.t} />
            )) : null}
            {mapInfo.t >= 0.99 ? mapInfo.src.map((p, i) => (
              <line key={'ml' + i}
                x1={px(p)} y1={py(p)} x2={px(mapInfo.dst[i])} y2={py(mapInfo.dst[i])}
                stroke={T.ink3} strokeWidth="0.9" strokeDasharray="3 4" />
            )) : null}
            {/* Parallel ko'chirishda ALMASHTIRISHNING O'ZI -- vektor.
                Ikki shaklni yonma-yon qo'yish uni ko'rsatmaydi. */}
            {map.kind === 'shift' && mapInfo.t > 0.02
              ? arrow(mapInfo.src[mapInfo.watch], mapInfo.dst[mapInfo.watch], T.ink2, { key: 'mv', thin: true })
              : null}
            {/* Gomotetiyada markazdan O'TUVCHI nurlar: tasvir cho'qqisi
                nurning ustida yotadi, va k ning ishorasi nurning qaysi
                tomonida ekanini aytadi. */}
            {map.kind === 'homothety'
              ? mapInfo.src.map((p, i) => (
                <line key={'mr' + i}
                  x1={px(map.center || [0, 0, 0])} y1={py(map.center || [0, 0, 0])}
                  x2={px(mapInfo.dst[i])} y2={py(mapInfo.dst[i])}
                  stroke={T.ink3} strokeWidth="0.8" strokeDasharray="3 4" strokeOpacity="0.8" />
              ))
              : null}
            {map.center && (map.kind === 'center' || map.kind === 'homothety') ? (
              <g>
                <circle cx={px(map.center)} cy={py(map.center)} r="3.6" fill={T.ink} />
                {label(map.center, 'O', T.ink, { key: 'mc', dx: -15, dy: 4 })}
              </g>
            ) : null}
          </g>
        ) : null}

        {/* NUQTALAR va PROYEKSIYALARI. Proyeksiya nuqtaning O'ZI emas --
            shuning uchun u boshqa rangda va punktir bilan bog'langan.
            35-darsning asosiy chalkashligi aynan shu. */}
        {points.map((pt, i) => {
          const p = pt.at
          const tone = TONE[pt.tone] || T.accent
          const p1 = [p[0], p[1], 0]
          const pX = [p[0], 0, 0]
          const pY = [0, p[1], 0]
          const pZ = [0, 0, p[2]]
          // [nuqta, indeks, dx, dy, anchor]
          const subs = [
            [p1, '1', 8, 14, undefined],
            [pX, 'x', 8, 3, undefined],
            [pY, 'y', 2, -8, undefined],
            [pZ, 'z', 8, 3, undefined],
          ].filter((s) => V.len(s[0]) > 1e-9)
          return (
            <g key={'p' + i}>
              {pt.proj ? (
                <g>
                  {[[p, p1], [p1, pX], [p1, pY], [p, pZ]].map((s, k) => (
                    <line key={'pg' + k} x1={px(s[0])} y1={py(s[0])} x2={px(s[1])} y2={py(s[1])}
                      stroke={T.ink3} strokeWidth="1" strokeDasharray="4 4" />
                  ))}
                  {subs.map((s, k) => (
                    <g key={'pp' + k}>
                      <circle cx={px(s[0])} cy={py(s[0])} r="2.6" fill={T.ink3} />
                      {/* Yozuv har birining O'Z tomonida: to'rttasi bir
                          xil surilganda ular polda bir joyga yig'ilardi. */}
                      {label(s[0], S(pt.label) || 'A', T.ink3,
                        { key: 'ppl' + k, sub: s[1], size: 11, weight: 600, dx: s[2], dy: s[3], anchor: s[4] })}
                    </g>
                  ))}
                </g>
              ) : null}
              <circle cx={px(p)} cy={py(p)} r="4.2" fill={tone} />
              {pt.label !== undefined
                ? label(p, S(pt.label), tone, {
                  key: 'pl' + i,
                  sub: pt.sub,
                  dx: pt.dx === undefined ? 7 : pt.dx,
                  dy: pt.dy === undefined ? -7 : pt.dy,
                })
                : null}
              {pt.coords
                ? label(p, trio(p), tone, {
                  key: 'pc' + i,
                  dx: pt.dx === undefined ? 7 : pt.dx,
                  dy: (pt.dy === undefined ? -7 : pt.dy) + 20,
                  roman: true,
                  size: 11.5,
                  weight: 600,
                })
                : null}
            </g>
          )
        })}

        {readout ? (
          <text x={W - 6} y={height - 4} textAnchor="end" fontSize="13" fontWeight="700"
            fill={T.ink2} fontFamily={MATH_FONT}>
            {readout}
          </text>
        ) : null}
      </svg>
      {caption !== undefined
        ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{S(caption)}</Fx></div>
        : null}
      {note
        ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{S(note)}</Fx></div>
        : null}
    </div>
  )
}

// ============================================================
// SecantBoard -- B6 blokining asbobi: HOSILA.
//
// Darslikning 12-13-rasmlari ustiga qurilgan: B nuqta egri chiziq bo'ylab
// A ga yaqinlashadi, kesuvchi esa urinma holatiga o'tadi. Shu bitta
// harakat butun bobning ma'nosi, va uni SON bilan birga ko'rsatish kerak:
// ekranda ayirmali nisbat 4, 3, 2,5 ... deb o'zgaradi va 2 ga intiladi.
//
// NEGA ALOHIDA ASBOB. `CurveBoard` egri chiziq va TAYYOR urinmani chizadi,
// ya'ni javobni allaqachon bilgan holatni. O'quvchi esa yaqinlashishni
// ko'rmasa, «urinma -- kesuvchining limiti» degan gap quruq qoladi.
//
// QIYALIK HALOL: urinma qiyaligi `ddx` bilan, ya'ni FUNKSIYANING O'ZIDAN
// sanaladi. Dars ma'lumotida qiyalik yozilmaydi -- aks holda chizmada
// mening javobim turgan bo'lardi, tekshiruv emas.
//
// Rejimlar:
//   secant   -- kesuvchi -> urinma, ayirmali nisbat soni bilan;
//   speed    -- o'sha geometriya, lekin o'qlar t va s: o'rtacha va oniy tezlik;
//   tangent  -- urinma va uning tenglamasi, qiyalik uchburchak bilan o'qiladi;
//   sign     -- grafik ostida f' ning ishora lentasi: qayerda o'sadi, qayerda
//               kamayadi, qayerda statsionar nuqta.
// ============================================================
export function SecantBoard({
  fn,
  xDomain = [-1, 5],
  yDomain = [-1, 9],
  xTicks = [],
  yTicks = [],
  mode = 'secant',
  x0 = 1,
  hs = [2, 1, 0.5],
  phase = 99,
  tangentAt,
  keepSecant = false,
  legs = true,
  hLabel,
  riseLabel,
  ratioLabel,
  slopeLabel,
  eq,
  signs = [],
  marks = [],
  showDeriv = false,
  derivLabel,
  curveLabel,
  aLabel = 'A',
  bLabel = 'B',
  slopeTriangle = false,
  caption,
  note,
  height = 178,
}) {
  const tt = useT()
  const S = (v) => (isTri(v) ? tt(v) : v)

  const W = 640
  const H = height
  const padL = 42
  const padR = 26
  const padT = 14
  const bandRow = mode === 'sign' ? 22 : 0
  const readRow = mode === 'sign' ? 0 : 17
  const padB = 26 + bandRow + readRow
  const xa0 = xDomain[0]
  const xa1 = xDomain[1]
  const ya0 = yDomain[0]
  const ya1 = yDomain[1]
  const px = (x) => padL + ((x - xa0) / (xa1 - xa0)) * (W - padL - padR)
  const py = (y) => padT + ((ya1 - y) / (ya1 - ya0)) * (H - padT - padB)

  const path = (F) => {
    const pts = []
    const N = 260
    for (let i = 0; i <= N; i += 1) {
      const x = xa0 + ((xa1 - xa0) * i) / N
      const y = F(x)
      if (!isFinite(y) || y < ya0 - 3 || y > ya1 + 3) { pts.push(null); continue }
      pts.push([px(x), py(y)])
    }
    let d = ''
    let open = false
    pts.forEach((p) => {
      if (!p) { open = false; return }
      d += (open ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ' '
      open = true
    })
    return d.trim()
  }

  // Nuqtadan qiyalik bilan chizilgan to'g'ri chiziq -- ko'rinish oynasiga
  // qirqiladi, ya'ni chizma chetidan chiqib ketmaydi.
  const lineThrough = (xp, yp, k) => {
    const cand = []
    const at = (x) => yp + k * (x - xp)
    cand.push([xa0, at(xa0)])
    cand.push([xa1, at(xa1)])
    if (Math.abs(k) > 1e-9) {
      cand.push([xp + (ya0 - yp) / k, ya0])
      cand.push([xp + (ya1 - yp) / k, ya1])
    }
    const inside = cand.filter((p) => p[0] >= xa0 - 1e-6 && p[0] <= xa1 + 1e-6
      && p[1] >= ya0 - 1e-6 && p[1] <= ya1 + 1e-6)
    if (inside.length < 2) return null
    inside.sort((p, q) => p[0] - q[0])
    return [inside[0], inside[inside.length - 1]]
  }

  const step = Math.max(0, Math.min(phase, hs.length))
  const tAt = tangentAt === undefined ? hs.length : tangentAt
  const showTan = mode === 'tangent' || (mode !== 'sign' && phase >= tAt)
  const showSec = mode !== 'tangent' && mode !== 'sign' && (phase < tAt || keepSecant)
  // `keepSecant: 'first'` -- urinma paydo bo'lganda EKRANDA eng KENG
  // kesuvchi qoladi, oxirgisi emas. Sababi: h kichik bo'lganda kesuvchi va
  // urinma deyarli ustma-ust tushadi, va oxirgi kadr «o'rtacha 4,25, oniy 4»
  // degan farqni KO'RSATMAY qoladi (43-darsning 4-slaydida shu chiqdi).
  const hIdx = (showTan && keepSecant === 'first') ? 0 : Math.min(step, hs.length - 1)
  const h = hs[hIdx]

  const ya = fn(x0)
  const xb = x0 + h
  const yb = fn(xb)
  const secK = (yb - ya) / h
  const tanK = ddx(fn)(x0)

  const sec = showSec ? lineThrough(x0, ya, secK) : null
  const tan = showTan ? lineThrough(x0, ya, tanK) : null

  // Yozuv chizmaning ICHIDA qolishi kerak: B nuqta oynaning tepasida
   // bo'lganda uning yorlig'i qirqilib ketardi (stend ushladi).
  const clampY = (y) => Math.max(padT + 11, Math.min(H - padB - 4, y))

  const txt = (x, y, s, opt) => (
    <text
      key={opt.key}
      x={x}
      y={y}
      textAnchor={opt.anchor || 'middle'}
      fontSize={opt.size || 12}
      fontWeight={opt.weight || 700}
      fill={opt.fill || T.ink2}
      fontFamily={opt.roman ? undefined : MATH_FONT}
      opacity={opt.opacity}
      className={opt.cls}
    >
      {s}
    </text>
  )

  return (
    <div className="g11-graph" style={{ width: '100%', flexShrink: 0, minWidth: 0 }}>
      <svg viewBox={'0 0 ' + W + ' ' + H} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" style={{ display: 'block', maxHeight: H }}>
        <g stroke={T.line} strokeWidth="1" opacity=".5">
          {xTicks.map((tk) => <line key={'gx' + tk.v} x1={px(tk.v)} y1={padT} x2={px(tk.v)} y2={H - padB} />)}
          {yTicks.map((tk) => <line key={'gy' + tk.v} x1={padL} y1={py(tk.v)} x2={W - padR} y2={py(tk.v)} />)}
        </g>
        <line x1={padL} y1={py(0)} x2={W - padR} y2={py(0)} stroke="rgba(23,26,29,.34)" strokeWidth="1.5" />
        <line x1={px(0)} y1={padT} x2={px(0)} y2={H - padB} stroke="rgba(23,26,29,.34)" strokeWidth="1.5" />

        {/* Statsionar nuqta belgisi bor joyda o'q belgisi CHIZILMAYDI: ikkisi
            bir xil balandlikda turadi va ustma-ust tushib qolardi. */}
        {xTicks.filter((tk) => !marks.some((mk) => Math.abs(mk.v - tk.v) < 1e-6))
          .map((tk) => txt(px(tk.v), H - padB + 15, tk.label !== undefined ? tk.label : tk.v, { key: 'tx' + tk.v, size: 11.5 }))}
        {yTicks.map((tk) => txt(padL - 8, py(tk.v) + 4, tk.label !== undefined ? tk.label : tk.v, { key: 'ty' + tk.v, size: 11.5, anchor: 'end' }))}

        {/* HOSILANING GRAFIGI -- faqat so'ralganda. Punktir, boshqa rang:
            u f ning grafigi bilan aralashib ketmasligi kerak. */}
        {showDeriv ? (
          <g>
            <path d={path(ddx(fn))} fill="none" stroke={T.tip} strokeWidth="2" strokeDasharray="6 4" opacity=".85" />
            {derivLabel ? txt(
              W - padR - 4,
              Math.max(padT + 11, Math.min(H - padB - 4, py(ddx(fn)(xa1 - (xa1 - xa0) * 0.06)) - 8)),
              S(derivLabel), { key: 'dl', anchor: 'end', fill: T.tip, size: 12 },
            ) : null}
          </g>
        ) : null}

        <path d={path(fn)} fill="none" stroke={T.ink} strokeWidth="2.6" />
        {/* Egri chiziqning yorlig'i: chiziq o'ng chetda TEPADA bo'lsa, yozuv
            uning USTIGA sig'maydi va chizma chetiga tiqiladi -- shunda u
            chiziqning OSTIGA tushadi (darsda 4-slaydda ko'rindi). */}
        {curveLabel ? txt(
          W - padR - 4,
          (() => {
            const ye = py(fn(xa1 - (xa1 - xa0) * 0.04))
            return clampY(ye - padT < (H - padT - padB) * 0.28 ? ye + 17 : ye - 9)
          })(),
          S(curveLabel), { key: 'cl', anchor: 'end', size: 12.5, fill: T.ink2 },
        ) : null}

        {/* ISHORA LENTASI. Grafik ostida: qayerda f' musbat, qayerda manfiy.
            Bu javob emas -- dars ma'lumoti nima yozsa, shu ko'rinadi. */}
        {mode === 'sign' ? (
          <g>
            {signs.map((sg, i) => {
              const a = px(Math.max(sg.from === null || sg.from === undefined ? xa0 : sg.from, xa0))
              const b = px(Math.min(sg.to === null || sg.to === undefined ? xa1 : sg.to, xa1))
              const plus = sg.sign !== '−' && sg.sign !== '-'
              return (
                <g key={'sg' + i}>
                  <rect
                    x={a + 1.5}
                    y={H - padB + 22}
                    width={Math.max(2, b - a - 3)}
                    height={16}
                    rx={5}
                    fill={plus ? T.okSoft : T.accentSoft}
                  />
                  {txt((a + b) / 2, H - padB + 34, plus ? '+' : '−', { key: 'sgt' + i, fill: plus ? T.ok : T.accent, size: 13 })}
                </g>
              )
            })}
            {marks.map((mk, i) => (
              <g key={'mk' + i}>
                <line x1={px(mk.v)} y1={padT} x2={px(mk.v)} y2={H - padB + 22} stroke={T.ink3} strokeWidth="1" strokeDasharray="3 3" opacity=".7" />
                <circle cx={px(mk.v)} cy={py(fn(mk.v))} r="4.6" fill={T.paper} stroke={T.accent} strokeWidth="2.6" />
                {mk.label !== undefined ? txt(px(mk.v), H - padB + 14, S(mk.label), { key: 'mkl' + i, size: 11.5, fill: T.accent }) : null}
              </g>
            ))}
          </g>
        ) : null}

        {/* Δx va Δy oyoqlari: darslikning 16-rasmi. */}
        {showSec && legs && isFinite(yb) ? (
          <g stroke={T.ink3} strokeWidth="1.2" strokeDasharray="4 3" opacity=".8">
            <line x1={px(x0)} y1={py(ya)} x2={px(xb)} y2={py(ya)} />
            <line x1={px(xb)} y1={py(ya)} x2={px(xb)} y2={py(yb)} />
          </g>
        ) : null}
        {showSec && legs && isFinite(yb) ? (
          <g>
            {/* `h` yozuvi o'q chizig'iga tushib qolmasin: oyoq o'qqa yaqin
                bo'lsa, yozuv TEPAGA chiqadi. */}
            {hLabel ? txt(
              (px(x0) + px(xb)) / 2,
              clampY(Math.abs(py(ya) - py(0)) < 18 ? py(ya) - 6 : py(ya) + 14),
              S(hLabel), { key: 'hl', size: 11.5, fill: T.ink3 },
            ) : null}
            {riseLabel ? txt(px(xb) + 6, clampY((py(ya) + py(yb)) / 2 + 4), S(riseLabel), { key: 'rl', size: 11.5, fill: T.ink3, anchor: 'start' }) : null}
          </g>
        ) : null}

        {sec ? (
          <line
            x1={px(sec[0][0])} y1={py(sec[0][1])} x2={px(sec[1][0])} y2={py(sec[1][1])}
            stroke={T.graph} strokeWidth="2.2" opacity={showTan ? 0.4 : 1}
          />
        ) : null}
        {tan ? (
          <line
            x1={px(tan[0][0])} y1={py(tan[0][1])} x2={px(tan[1][0])} y2={py(tan[1][1])}
            stroke={T.accent} strokeWidth="2.6" className="g11-in"
          />
        ) : null}

        {/* QIYALIK UCHBURCHAGI: bir qadam o'ngga, k qadam tepaga. Shundan
            keyin `k` chizmadan O'QILADI, formuladan emas. */}
        {slopeTriangle && showTan ? (
          <g>
            <line x1={px(x0)} y1={py(ya)} x2={px(x0 + 1)} y2={py(ya)} stroke={T.accent} strokeWidth="1.6" strokeDasharray="4 3" />
            <line x1={px(x0 + 1)} y1={py(ya)} x2={px(x0 + 1)} y2={py(ya + tanK)} stroke={T.accent} strokeWidth="1.6" strokeDasharray="4 3" />
            {txt((px(x0) + px(x0 + 1)) / 2, py(ya) + (tanK >= 0 ? 14 : -6), '1', { key: 'st1', size: 11.5, fill: T.accent })}
            {txt(px(x0 + 1) + 6, (py(ya) + py(ya + tanK)) / 2 + 4, numTxt(tanK), { key: 'st2', size: 11.5, fill: T.accent, anchor: 'start' })}
          </g>
        ) : null}

        {mode !== 'sign' ? (
          <g>
            <circle cx={px(x0)} cy={py(ya)} r="5" fill={T.paper} stroke={T.ink} strokeWidth="2.8" />
            {txt(px(x0) - 9, clampY(py(ya) + 16), S(aLabel), { key: 'al', size: 12.5, anchor: 'end', fill: T.ink2 })}
          </g>
        ) : null}
        {showSec && isFinite(yb) ? (
          <g>
            <circle cx={px(xb)} cy={py(yb)} r="5" fill={T.paper} stroke={T.graph} strokeWidth="2.8" />
            {/* O'ng chetga yaqin bo'lsa, yozuv nuqtaning CHAP tomoniga o'tadi:
                aks holda u chizmadan chiqib ketardi. */}
            {px(xb) > W - padR - 26
              ? txt(px(xb) - 9, clampY(py(yb) - 7 < padT + 11 ? py(yb) + 17 : py(yb) - 7), S(bLabel), { key: 'bl', size: 12.5, anchor: 'end', fill: T.graph })
              : txt(px(xb) + 9, clampY(py(yb) - 7 < padT + 11 ? py(yb) + 17 : py(yb) - 7), S(bLabel), { key: 'bl', size: 12.5, anchor: 'start', fill: T.graph })}
          </g>
        ) : null}

        {/* PASTDAGI SATR. Chapda ayirmali nisbat (kesuvchi), o'ngda urinma
            qiyaligi. Ikkisi bir vaqtda ko'rinsa, o'quvchi ularni
            SOLISHTIRADI -- «o'rtacha» va «oniy» farqi shu yerda tug'iladi. */}
        {readRow ? (
          <g>
            {showSec && ratioLabel && isFinite(secK)
              ? txt(padL, H - 5, S(ratioLabel) + ' = ' + numTxt(secK), { key: 'rr', anchor: 'start', size: 13, fill: T.graph })
              : null}
            {showTan && slopeLabel
              ? txt(W - 6, H - 5, S(slopeLabel) + ' = ' + numTxt(tanK), { key: 'sl', anchor: 'end', size: 13, fill: T.accent })
              : null}
            {mode === 'tangent' && eq
              ? txt(padL, H - 5, S(eq), { key: 'eq', anchor: 'start', size: 13, fill: T.accent })
              : null}
          </g>
        ) : null}
      </svg>
      {caption !== undefined
        ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{S(caption)}</Fx></div>
        : null}
      {note
        ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{S(note)}</Fx></div>
        : null}
    </div>
  )
}

// ============================================================
// PlaneBoard -- B7 blokining asbobi: TEKIS CHIZMA (planimetriya).
//
// NEGA KERAK. 11-sinfda fazoviy asboblar bor (`SpinBoard`, `SpaceFrame`),
// tekis chizma esa yo'q edi: balandligi bilan uchburchak, ichki burchagi
// bilan aylana, o'xshash uchburchaklar juftligi -- birortasini ham
// mavjud asboblar chizmaydi. Etalon 1.1 `graph` rolini olib tashlashga
// faqat «temada ma'noli chizma bo'lmasa» ruxsat beradi, planimetriyada
// esa chizmaning O'ZI mavzu.
//
// MA'LUMOT BILAN BOSHQARILADI, rejim bilan emas: figura nuqtalar,
// kesmalar, burchaklar va aylanalardan yig'iladi. Shu sababli bitta
// asbob uchburchakni ham, aylanani ham, o'xshashlik juftligini ham
// chizadi -- va yangi figura uchun kod O'ZGARMAYDI.
//
// MIQYOS BIR XIL ikki o'q bo'yicha: aks holda aylana ellipsga, to'g'ri
// burchak esa o'tmas burchakka aylanardi (6-sinfda aynan shu xato
// bo'lgan). Ko'rinish oynasi ko'rinadigan geometriyadan HISOBLANADI,
// shuning uchun dars ma'lumotida `xDomain` yozish shart emas.
//
// Ochilish: har bir elementda `showAt` -- kadr raqami. Ovoz gapirganda
// chizma o'sha qadamda to'ladi.
// ============================================================
export function PlaneBoard({
  pts = [],          // [{ id, at: [x, y], label, sub, dx, dy, tone, showAt, hollow }]
  segs = [],         // [{ from, to, tone, dash, width, label, ticks, showAt }]
  angles = [],       // [{ at, from, to, label, right, tone, showAt }]
  circles = [],      // [{ at: [x, y], r, tone, dash, showAt }]
  fills = [],        // [{ ids: ['A','B','C'], tone, showAt }]
  marks = [],        // [{ at: [x, y], label, tone, showAt }]  -- yozuvsiz belgi
  phase = 99,
  height = 190,
  pad = 30,
  caption,
  note,
  answer,            // pastdagi javob yozuvi (son yoki matn)
  answerLabel,
}) {
  const tt = useT()
  const S = (v) => (isTri(v) ? tt(v) : v)

  const H = height
  const shown = (o) => phase >= (o.showAt || 0)

  const P = {}
  pts.forEach((p) => { P[p.id] = p.at })
  const at = (id) => (Array.isArray(id) ? id : P[id])

  // KO'RINISH OYNASI ko'rinadigan geometriyadan yig'iladi.
  const xs = []
  const ys = []
  pts.filter(shown).forEach((p) => { xs.push(p.at[0]); ys.push(p.at[1]) })
  circles.filter(shown).forEach((c) => {
    xs.push(c.at[0] - c.r, c.at[0] + c.r)
    ys.push(c.at[1] - c.r, c.at[1] + c.r)
  })
  marks.filter(shown).forEach((m) => { xs.push(m.at[0]); ys.push(m.at[1]) })
  // Hech narsa ko'rinmasa ham chizma yiqilmasligi kerak.
  if (!xs.length) { xs.push(0, 1); ys.push(0, 1) }

  const x0 = Math.min(...xs)
  const x1 = Math.max(...xs)
  const y0 = Math.min(...ys)
  const y1 = Math.max(...ys)
  const readRow = answer !== undefined ? 17 : 0
  // POL va SHIFT bir xil: pastdagi nuqtaning yorlig'i 16 px pastga tushadi,
  // va 14 px joy unga yetmagan -- yozuv chizmadan chiqib ketgan edi
  // (mashina tekshiruvi ushladi, ko'z ko'rmadi).
  const availH = H - pad * 2 - readRow
  const spanX = Math.max(0.001, x1 - x0)
  const spanY = Math.max(0.001, y1 - y0)
  // OYNA KENGLIGI MAZMUNDAN. Miqyos ikki o'q bo'yicha bir xil (aks holda
  // aylana ellipsga aylanadi), va shu sababli baland figura kartochkaning
  // faqat o'rtasini egallardi -- yon tomonlarda bo'sh joy qolardi. Oyna
  // kengligini mazmunga tenglashtiramiz: SVG konteynerga cho'ziladi va
  // chizma butun kenglikni egallaydi. B5 blokida `SpaceFrame` da xuddi
  // shu tuzatish qilingan.
  const kFit = availH / spanY
  const W = Math.max(200, Math.min(900, spanX * kFit + pad * 2))
  const availW = W - pad * 2
  // MIQYOS BITTA: kichigi olinadi, shunda figura buzilmaydi.
  const k = Math.min(availW / spanX, availH / spanY)
  const cx = (x0 + x1) / 2
  const cy = (y0 + y1) / 2
  const px = (x) => W / 2 + (x - cx) * k
  const py = (y) => pad + availH / 2 - (y - cy) * k

  const tone = (t) => TONES[t || 'ink'] || T.ink

  const txt = (x, y, s, opt) => (
    <text
      key={opt.key}
      x={x}
      y={y}
      textAnchor={opt.anchor || 'middle'}
      fontSize={opt.size || 12.5}
      fontWeight={opt.weight || 700}
      fill={opt.fill || T.ink2}
      fontFamily={MATH_FONT}
      className={opt.cls}
    >
      {s}
    </text>
  )

  // Kesma o'rtasidagi TENGLIK belgilari: bir, ikki yoki uchta chizmoq.
  const tickMarks = (a, b, n, col, key) => {
    const ax = px(a[0]); const ay = py(a[1])
    const bx = px(b[0]); const by = py(b[1])
    const mx = (ax + bx) / 2; const my = (ay + by) / 2
    const len = Math.max(1e-6, Math.hypot(bx - ax, by - ay))
    const ux = (bx - ax) / len; const uy = (by - ay) / len
    const nx = -uy; const ny = ux
    const out = []
    for (let i = 0; i < n; i += 1) {
      const off = (i - (n - 1) / 2) * 5
      out.push(
        <line
          key={key + 't' + i}
          x1={mx + ux * off - nx * 5}
          y1={my + uy * off - ny * 5}
          x2={mx + ux * off + nx * 5}
          y2={my + uy * off + ny * 5}
          stroke={col}
          strokeWidth="1.6"
        />,
      )
    }
    return out
  }

  return (
    <div className="g11-graph" style={{ width: '100%', flexShrink: 0, minWidth: 0 }}>
      <svg viewBox={'0 0 ' + W + ' ' + H} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" style={{ display: 'block', maxHeight: H }}>
        {/* YUZA bo'yog'i eng ostida: chiziqlar uning ustida qoladi. */}
        {fills.filter(shown).map((f, i) => (
          <polygon
            key={'f' + i}
            points={f.ids.map((id) => px(at(id)[0]) + ',' + py(at(id)[1])).join(' ')}
            fill={f.tone === 'ok' ? T.okSoft : T.accentSoft}
            opacity={f.opacity === undefined ? 0.85 : f.opacity}
          />
        ))}

        {circles.filter(shown).map((c, i) => (
          <circle
            key={'c' + i}
            cx={px(c.at[0])}
            cy={py(c.at[1])}
            r={c.r * k}
            fill="none"
            stroke={tone(c.tone)}
            strokeWidth={c.width || 2.2}
            strokeDasharray={c.dash || undefined}
          />
        ))}

        {segs.filter(shown).map((sg, i) => {
          const a = at(sg.from)
          const b = at(sg.to)
          if (!a || !b) return null
          const col = tone(sg.tone)
          const mx = (px(a[0]) + px(b[0])) / 2
          const my = (py(a[1]) + py(b[1])) / 2
          // Yozuv kesmaga PERPENDIKULAR suriladi, ustiga tushmaydi.
          const len = Math.max(1e-6, Math.hypot(px(b[0]) - px(a[0]), py(b[1]) - py(a[1])))
          const nx = -(py(b[1]) - py(a[1])) / len
          const ny = (px(b[0]) - px(a[0])) / len
          return (
            <g key={'s' + i} className={sg.showAt ? 'g11-in' : undefined}>
              <line
                x1={px(a[0])} y1={py(a[1])} x2={px(b[0])} y2={py(b[1])}
                stroke={col}
                strokeWidth={sg.width || 2.4}
                strokeDasharray={sg.dash || undefined}
              />
              {sg.ticks ? tickMarks(a, b, sg.ticks, col, 's' + i) : null}
              {/* Yozuv kesmadan 17 px suriladi: 13 px da punktir balandlik
                  ustiga tushib qolgan edi (stend ushladi). */}
              {sg.label !== undefined
                ? txt(mx + nx * 17, my + ny * 17 + 4, S(sg.label), { key: 'sl' + i, size: 12, fill: col })
                : null}
            </g>
          )
        })}

        {angles.filter(shown).map((an, i) => {
          const o = at(an.at)
          const a = at(an.from)
          const b = at(an.to)
          if (!o || !a || !b) return null
          const col = tone(an.tone || 'accent')
          const ox = px(o[0]); const oy = py(o[1])
          const dir = (q) => {
            const dx = px(q[0]) - ox; const dy = py(q[1]) - oy
            const L2 = Math.max(1e-6, Math.hypot(dx, dy))
            return [dx / L2, dy / L2]
          }
          const u = dir(a)
          const v = dir(b)
          const R = an.r || 20
          if (an.right) {
            // TO'G'RI burchak kvadrat bilan belgilanadi.
            const q = R * 0.62
            return (
              <path
                key={'a' + i}
                d={'M ' + (ox + u[0] * q) + ' ' + (oy + u[1] * q)
                  + ' L ' + (ox + (u[0] + v[0]) * q) + ' ' + (oy + (u[1] + v[1]) * q)
                  + ' L ' + (ox + v[0] * q) + ' ' + (oy + v[1] * q)}
                fill="none"
                stroke={col}
                strokeWidth="1.7"
              />
            )
          }
          const p1 = [ox + u[0] * R, oy + u[1] * R]
          const p2 = [ox + v[0] * R, oy + v[1] * R]
          const cross = u[0] * v[1] - u[1] * v[0]
          const sweep = cross > 0 ? 1 : 0
          const mid = [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2]
          const ml = Math.max(1e-6, Math.hypot(mid[0], mid[1]))
          return (
            <g key={'a' + i}>
              <path
                d={'M ' + p1[0] + ' ' + p1[1] + ' A ' + R + ' ' + R + ' 0 0 ' + sweep + ' ' + p2[0] + ' ' + p2[1]}
                fill="none"
                stroke={col}
                strokeWidth="1.7"
              />
              {an.label !== undefined
                ? txt(ox + (mid[0] / ml) * (R + 15), oy + (mid[1] / ml) * (R + 15) + 4, S(an.label), { key: 'al' + i, size: 12, fill: col })
                : null}
            </g>
          )
        })}

        {marks.filter(shown).map((m, i) => (
          <g key={'m' + i}>
            <circle cx={px(m.at[0])} cy={py(m.at[1])} r="3.4" fill={tone(m.tone || 'ink')} />
            {m.label !== undefined
              ? txt(px(m.at[0]), py(m.at[1]) - 9, S(m.label), { key: 'ml' + i, size: 11.5, fill: tone(m.tone || 'ink') })
              : null}
          </g>
        ))}

        {pts.filter(shown).map((p, i) => (
          <g key={'p' + i} className={p.showAt ? 'g11-in' : undefined}>
            <circle
              cx={px(p.at[0])}
              cy={py(p.at[1])}
              r="4.6"
              fill={p.hollow ? T.paper : tone(p.tone)}
              stroke={p.hollow ? tone(p.tone) : 'none'}
              strokeWidth={p.hollow ? 2.6 : 0}
            />
            {p.label !== undefined
              ? txt(
                px(p.at[0]) + (p.dx === undefined ? 0 : p.dx),
                py(p.at[1]) + (p.dy === undefined ? -11 : p.dy),
                S(p.label),
                { key: 'pl' + i, size: 13, fill: T.ink2 },
              )
              : null}
          </g>
        ))}

        {answer !== undefined ? (
          <text x={W - 6} y={H - 4} textAnchor="end" fontSize="13" fontWeight="700" fill={T.accent} fontFamily={MATH_FONT}>
            {(answerLabel ? S(answerLabel) + ' = ' : '') + S(answer)}
          </text>
        ) : null}
      </svg>
      {caption !== undefined
        ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{S(caption)}</Fx></div>
        : null}
      {note
        ? <div className="g11-expr g11-expr-sm g11-wrap" style={{ textAlign: 'center', color: T.ink2 }}><Fx>{S(note)}</Fx></div>
        : null}
    </div>
  )
}
