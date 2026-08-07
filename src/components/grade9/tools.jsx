// ============================================================================
// 9-sinf ASBOBI 1 -- SONLAR O'QI VA ISHORALAR.
// Kontrakt: src/books/grade9/PODXOD_9SINF.md (1-asbob), ETALON_9SINF.md §1.
//
// Yil bo'yicha 13 dars shu asbobda: B1 (1-6) va B3 (14-20).
//
// Asbob TO'RT fazadan iborat, har biri MAJBURIY EMAS -- dars qaysi kerakligini
// o'zi tanlaydi:
//   place    o'quvchi ildizlarni o'qqa qo'yadi (ochiq yoki to'ldirilgan)
//   witness  oraliqqa SON qo'yib ishorani hisoblaydi (ETALON §1 talab 3)
//   flips    nuqtadan o'tganda nechta ko'paytuvchi ishorani o'zgartiradi
//            (ETALON §1 talab 4 -- darslik 33-bet obosnovaniyesi)
//   shade    o'quvchi javobni O'QDA YIG'ADI, tayyor yozuvni TANLAMAYDI
//            (ETALON §1 talab 1)
//
// Dars faqat MA'LUMOT beradi: qaysi ifoda, qaysi ildizlar, qaysi razbor.
// Asbob ichida dars matni YO'Q -- faqat interfeys yozuvlari.
//
// Ochiq / to'ldirilgan nuqta FARQLANADI (ETALON §1 talab 5). Atama:
// ochiq nuqta / to'ldirilgan nuqta (metodist qarori 2026-08-06).
//
// `import React` SHART: LMS xom jsx ni KLASSIK rejimda yuklaydi.
// ============================================================================
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Btn,
  Expr,
  Feedback,
  L,
  Options,
  Slot,
  T,
  useInstructionGate,
  useT,
} from '../shared/lesson-core.jsx'
import { useAnswerFx } from '../shared/lesson-tools.jsx'

const UI = {
  placeHint: L("Ildizlarni o'qqa qo'ying", 'Поставь корни на ось', 'Place the roots on the axis'),
  whichNum: L("Qaysi sonni qo'yamiz?", 'Какое число подставим?', 'Which number shall we substitute?'),
  shadeHint: L('Kerakli oraliqlarni belgilang', 'Закрась нужные промежутки', 'Shade the intervals you need'),
  check: L('Tekshirish', 'Проверить', 'Check'),
  again: L('Qaytadan', 'Заново', 'Start over'),
  answerIs: L('Javob', 'Ответ', 'Answer'),
}

// ============================================================
// Geometriya. Balandlik QAT'IY: slayd budjeti buzilmaydi.
// ============================================================
const VB_W = 900
const PAD = 54
const AXIS_Y = 64
const VB_H = 100

const posOf = (v, from, to) => PAD + ((v - from) / (to - from)) * (VB_W - 2 * PAD)

// Ildizlar oraliqlarni beradi: n ildiz -> n+1 oraliq.
function intervalsOf(roots, from, to) {
  const cuts = [from].concat(roots.map((r) => r.at)).concat([to])
  const out = []
  for (let i = 0; i < cuts.length - 1; i += 1) {
    out.push({ i, lo: cuts[i], hi: cuts[i + 1], loRoot: i > 0 ? roots[i - 1] : null, hiRoot: i < roots.length ? roots[i] : null })
  }
  return out
}

// ============================================================
// NumberAxis -- faqat KO'RSATADI, hech narsa hal qilmaydi.
// roots: [{ at, filled }]  signs: { [i]: '+' | '-' }  shaded: [i, ...]
// ============================================================
export function NumberAxis({
  from,
  to,
  roots = [],
  signs = {},
  shaded = [],
  activeInterval = null,
  ticks = true,
  onIntervalClick = null,
  h = VB_H,
}) {
  const intervals = useMemo(() => intervalsOf(roots, from, to), [roots, from, to])
  const tickVals = []
  if (ticks) for (let v = Math.ceil(from); v <= Math.floor(to); v += 1) tickVals.push(v)

  return (
    <svg viewBox={'0 0 ' + VB_W + ' ' + h} className="g9-axis" style={{ width: '100%', height: h, display: 'block' }}>
      {/* belgilangan oraliqlar -- o'qning O'ZIDA qalin chiziq */}
      {intervals.map((iv) => {
        const on = shaded.indexOf(iv.i) !== -1
        if (!on) return null
        return (
          <rect
            key={'sh' + iv.i}
            x={posOf(iv.lo, from, to)}
            y={AXIS_Y - 5}
            width={posOf(iv.hi, from, to) - posOf(iv.lo, from, to)}
            height={10}
            rx={5}
            fill={T.accent}
            opacity={0.9}
          />
        )
      })}

      {/* faol oraliq -- yumshoq fon */}
      {activeInterval !== null && intervals[activeInterval] ? (
        <rect
          x={posOf(intervals[activeInterval].lo, from, to)}
          y={AXIS_Y - 34}
          width={posOf(intervals[activeInterval].hi, from, to) - posOf(intervals[activeInterval].lo, from, to)}
          height={40}
          rx={9}
          fill={T.coolSoft}
        />
      ) : null}

      {/* o'q */}
      <line x1={PAD - 30} y1={AXIS_Y} x2={VB_W - PAD + 22} y2={AXIS_Y} stroke={T.ink} strokeWidth="2" />
      <polygon
        points={(VB_W - PAD + 22) + ',' + AXIS_Y + ' ' + (VB_W - PAD + 8) + ',' + (AXIS_Y - 5) + ' ' + (VB_W - PAD + 8) + ',' + (AXIS_Y + 5)}
        fill={T.ink}
      />
      <text x={VB_W - PAD + 30} y={AXIS_Y + 5} fontFamily="'JetBrains Mono', monospace" fontSize="19" fontStyle="italic" fill={T.ink2}>x</text>

      {/* butun sonlar */}
      {tickVals.map((v) => (
        <g key={'t' + v}>
          <line x1={posOf(v, from, to)} y1={AXIS_Y - 4} x2={posOf(v, from, to)} y2={AXIS_Y + 4} stroke={T.ink3} strokeWidth="1.5" />
          <text x={posOf(v, from, to)} y={AXIS_Y + 22} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="14" fill={T.ink3}>{v}</text>
        </g>
      ))}

      {/* ishoralar -- o'q USTIDA */}
      {intervals.map((iv) => {
        const s = signs[iv.i]
        if (!s) return null
        const cx = (posOf(iv.lo, from, to) + posOf(iv.hi, from, to)) / 2
        return (
          <text
            key={'s' + iv.i}
            x={cx}
            y={AXIS_Y - 16}
            textAnchor="middle"
            className="g9-sign"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="26"
            fontWeight="700"
            fill={s === '+' ? T.ok : T.accent}
          >
            {s === '+' ? '+' : '−'}
          </text>
        )
      })}

      {/* ildizlar. filled=false -> OCHIQ nuqta (ichi oq) */}
      {roots.map((r) => (
        <g key={'r' + r.at} className="g9-root">
          <circle
            cx={posOf(r.at, from, to)}
            cy={AXIS_Y}
            r={7}
            fill={r.filled ? T.ink : T.paper}
            stroke={T.ink}
            strokeWidth="2.4"
          />
          <text
            x={posOf(r.at, from, to)}
            y={AXIS_Y + 34}
            textAnchor="middle"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="17"
            fontWeight="700"
            fill={T.ink}
          >
            {r.at}
          </text>
        </g>
      ))}

      {/* bosiladigan oraliqlar -- eng ustida, ko'rinmas */}
      {onIntervalClick
        ? intervals.map((iv) => (
            <rect
              key={'hit' + iv.i}
              x={posOf(iv.lo, from, to)}
              y={AXIS_Y - 30}
              width={posOf(iv.hi, from, to) - posOf(iv.lo, from, to)}
              height={54}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onClick={() => onIntervalClick(iv.i)}
            />
          ))
        : null}
    </svg>
  )
}

// Javobni MATN bilan yozish -- faqat natijani ko'rsatish uchun.
export function intervalsToText(shaded, roots, from, to, filledSet) {
  const ivs = intervalsOf(roots, from, to)
  return shaded
    .slice()
    .sort((a, b) => a - b)
    .map((i) => intervalLabel(ivs[i], filledSet))
    .join(',  ')
}

// Bitta oraliqni SO'Z bilan yozish: «x < 1», «1 < x < 3», «x > 3».
export function intervalLabel(iv, filledSet) {
  const lo = iv.loRoot
  const hi = iv.hiRoot
  if (!lo && hi) return 'x ' + (filledSet ? '≤ ' : '< ') + hi.at
  if (lo && !hi) return 'x ' + (filledSet ? '≥ ' : '> ') + lo.at
  if (lo && hi) return lo.at + (filledSet ? ' ≤ ' : ' < ') + 'x' + (filledSet ? ' ≤ ' : ' < ') + hi.at
  return ''
}

// ============================================================
// OCHILISH SOATI. Ochilishni OVOZ boshqaradi, o'quvchi EMAS.
//
// Metodist qarori 2026-08-06: tushuntirishni o'quvchi qadamlab ochmaydi --
// tushuntirish O'ZI ochiladi va o'zi gapiradi. Tugma faqat JAVOB uchun.
// Naqsh 3-sinfdan olindi (grade3/Dars01.jsx): dars bo'laklari `after_previous`
// bilan ketma-ket aytiladi, ekran esa joriy bo'lak `id` siga qarab holatini
// ko'rsatadi.
//
// `keys` -- bo'lak `id` lari TARTIB bilan. Qaysi biri aytilayotgan bo'lsa,
// shuncha qadam ochilgan hisoblanadi.
//
// OVOZ O'CHIQ bo'lsa taymer bilan ochiladi. Bu SHART: aks holda ovozsiz
// o'quvchi tushuntirishning faqat birinchi bosqichini ko'rib qolardi
// (3-sinfdagi zaif joy).
const MUTE_STEP_MS = 1100

function useRevealClock(audio, keys, active) {
  const [reached, setReached] = useState(0)
  const keyStr = keys.join('|')

  useEffect(() => { setReached(0) }, [keyStr])

  useEffect(() => {
    if (!active) return
    const seg = audio.currentSegment
    if (!seg) return
    const i = keys.indexOf(seg)
    if (i !== -1) setReached((r) => Math.max(r, i + 1))
  }, [audio.currentSegment, active, keyStr]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!active || !audio.muted || reached >= keys.length) return undefined
    const timer = setTimeout(() => setReached((r) => r + 1), MUTE_STEP_MS)
    return () => clearTimeout(timer)
  }, [active, audio.muted, reached, keyStr]) // eslint-disable-line react-hooks/exhaustive-deps

  return reached
}

// ============================================================
// SignAxis -- asbobning O'ZI.
//
// FAZALAR: place -> witness -> flips -> shade (dars kerakligini tanlaydi).
// TUGMA FAQAT JAVOB UCHUN. «Dальше» turidagi tugma YO'Q: tushuntirish
// ochilishi ovozga bog'langan (yuqoridagi `useRevealClock`).
//
// Dars ovozidagi bo'lak `id` lari:
//   place    root1..rootN (javobdan keyin), keyin iv1..ivM (o'zi)
//   witness  sub (javobdan keyin), keyin line2..lineL va sign (o'zi)
//   flips    why1..whyN (javobdan keyin), keyin sign1..signN (o'zi)
//   shade    shaded (javobdan keyin)
// ============================================================
export function SignAxis({
  expr,
  exprSize = 'mid',
  from,
  to,
  roots,
  phases = ['place', 'witness', 'flips', 'shade'],
  candidates,
  revealIntervals = false,
  witness,
  alternate = false,
  flips = [],
  signs0 = {},
  shade,
  texts = {},
  audio,
  onSolved,
  onStep,
}) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const gate = useInstructionGate(audio)

  const [phase, setPhase] = useState(phases[0])
  const [placed, setPlaced] = useState(() => (phases.indexOf('place') === -1 ? roots : []))
  const [signs, setSigns] = useState(signs0)
  const [shaded, setShaded] = useState([])
  const [wrong, setWrong] = useState([])
  const [hint, setHint] = useState(null)
  const [ok, setOk] = useState(false)
  const [solved, setSolved] = useState(false)
  const [numPicked, setNumPicked] = useState(false)
  const [flipIdx, setFlipIdx] = useState(0)
  const [whyOpen, setWhyOpen] = useState(false)
  const [flipApplied, setFlipApplied] = useState(false)

  const intervals = useMemo(() => intervalsOf(roots, from, to), [roots, from, to])
  const step = (name) => { if (onStep) onStep(name) }
  const placeDone = placed.length >= roots.length
  const lines = witness ? witness.lines : []

  // --- ochilish soatlari ---
  const ivKeys = useMemo(() => intervals.map((_, i) => 'iv' + (i + 1)), [intervals])
  const ivShown = useRevealClock(audio, ivKeys, phase === 'place' && placeDone && revealIntervals)

  const wKeys = useMemo(() => {
    const k = []
    for (let i = 2; i <= lines.length; i += 1) k.push('line' + i)
    k.push('sign')
    return k
  }, [lines.length])
  const wReached = useRevealClock(audio, wKeys, phase === 'witness' && numPicked)
  const linesShown = numPicked ? Math.min(1 + wReached, lines.length) : 0
  const signShown = phase === 'witness' && wReached >= wKeys.length

  const fKeys = useMemo(() => ['sign' + (flipIdx + 1)], [flipIdx])
  const fReached = useRevealClock(audio, fKeys, phase === 'flips' && whyOpen)

  const nextPhase = (cur) => {
    const i = phases.indexOf(cur)
    return i === -1 || i + 1 >= phases.length ? null : phases[i + 1]
  }
  const advance = (cur) => {
    const n = nextPhase(cur)
    if (n) { setPhase(n); step(n) }
    else { setSolved(true); step('done'); if (onSolved) onSolved({ correct: true }) }
  }

  // place: hamma oraliq ochilgach o'zi keyingi fazaga o'tadi
  useEffect(() => {
    if (phase !== 'place' || !placeDone) return undefined
    if (!revealIntervals) { const x = setTimeout(() => advance('place'), 600); return () => clearTimeout(x) }
    if (ivShown < intervals.length) return undefined
    const x = setTimeout(() => advance('place'), 900)
    return () => clearTimeout(x)
  }, [phase, placeDone, revealIntervals, ivShown, intervals.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // witness: ishora ko'rinib, ovoz tugagach o'zi o'tadi
  useEffect(() => {
    if (!signShown) return undefined
    if (alternate) {
      const total = roots.length + 1
      const next = {}
      for (let i = 0; i < total; i += 1) {
        const flipped = (Math.abs(i - witness.interval) % 2) === 1
        next[i] = flipped ? (witness.sign === '+' ? '-' : '+') : witness.sign
      }
      setSigns((s) => ({ ...s, ...next }))
    } else {
      setSigns((s) => ({ ...s, [witness.interval]: witness.sign }))
    }
    setHint(texts.witnessOk || null)
    setOk(true)
    const x = setTimeout(() => advance('witness'), 1500)
    return () => clearTimeout(x)
  }, [signShown]) // eslint-disable-line react-hooks/exhaustive-deps

  // flips: izohdan keyin ishora O'ZI ag'dariladi
  useEffect(() => {
    if (phase !== 'flips' || !whyOpen || flipApplied) return undefined
    if (fReached < 1) return undefined
    const cur = flips[flipIdx]
    setFlipApplied(true)
    setSigns((s) => ({ ...s, ...cur.signAfter }))
    const n = flipIdx + 1
    const x = setTimeout(() => {
      setWhyOpen(false)
      setFlipApplied(false)
      setHint(null)
      setOk(false)
      if (n >= flips.length) advance('flips')
      else setFlipIdx(n)
    }, 1400)
    return () => clearTimeout(x)
  }, [fReached, whyOpen, flipApplied, phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // --- javoblar ---
  const pickCandidate = (c) => {
    if (!c.ok) {
      setWrong((p) => (p.indexOf(c.v) === -1 ? p.concat(c.v) : p))
      setOk(false)
      setHint(c.hint || null)
      fx.wrong(c.hint || null)
      return
    }
    const root = roots.find((r) => r.at === c.v)
    if (!root || placed.some((p) => p.at === c.v)) return
    const next = placed.concat(root).sort((a, b) => a.at - b.at)
    setPlaced(next)
    setHint(null)
    fx.right()
    step('root' + next.length)
  }

  const pickWitness = (o) => {
    if (!o.ok) {
      setWrong((p) => (p.indexOf(o.id) === -1 ? p.concat(o.id) : p))
      setOk(false)
      setHint(o.hint || null)
      fx.wrong(o.hint || null)
      return
    }
    setNumPicked(true)
    setWrong([])
    setHint(null)
    fx.right()
    step('sub')
  }

  const pickFlip = (o) => {
    const cur = flips[flipIdx]
    if (!o.correct) {
      setWrong((p) => (p.indexOf(o.id) === -1 ? p.concat(o.id) : p))
      setOk(false)
      setHint(o.hint || null)
      fx.wrong(o.hint || null)
      return
    }
    setWhyOpen(true)
    setWrong([])
    setHint(cur.ok || null)
    setOk(true)
    fx.right()
    step('why' + (flipIdx + 1))
  }

  const toggleInterval = (i) => {
    if (solved) return
    setShaded((prev) => (prev.indexOf(i) === -1 ? prev.concat(i) : prev.filter((x) => x !== i)))
    setHint(null)
  }
  const checkShade = () => {
    const want = shade.answer.slice().sort((a, b) => a - b).join(',')
    const got = shaded.slice().sort((a, b) => a - b).join(',')
    if (want === got) {
      setOk(true)
      setHint(shade.okText || texts.ok || null)
      fx.right()
      setSolved(true)
      step('shaded')
      if (onSolved) onSolved({ correct: true })
      return
    }
    const h = (shade.wrongs && (shade.wrongs[got] || shade.wrongs['*'])) || null
    setOk(false)
    setHint(h)
    fx.wrong(h)
  }

  const answerText = solved && shade ? intervalsToText(shade.answer, roots, from, to, shade.filledSet) : null
  const curFlip = phase === 'flips' ? flips[flipIdx] : null
  const activeIv =
    phase === 'place' && placeDone && revealIntervals && ivShown > 0 ? ivShown - 1
      : phase === 'witness' && !signShown ? witness.interval
        : null

  return (
    <>
      {expr ? <Expr size={exprSize}>{expr}</Expr> : null}

      <div className="lc-frame-card g9-axis-card">
        <NumberAxis
          from={from}
          to={to}
          roots={placed}
          signs={signs}
          shaded={shaded}
          activeInterval={activeIv}
          onIntervalClick={phase === 'shade' && !solved ? toggleInterval : null}
        />
        <Slot mh={22}>
          {phase === 'place' && placeDone && revealIntervals && ivShown > 0 ? (
            <div className="g9-axis-cap lc-in" key={ivShown}>
              {intervalLabel(intervals[Math.min(ivShown, intervals.length) - 1], false)}
            </div>
          ) : null}
        </Slot>
      </div>

      {/* place: ildizlarni O'QUVCHI qo'yadi */}
      {phase === 'place' && !placeDone ? (
        <>
          <p className="lc-hint g9-ask">{t(texts.place || UI.placeHint)}</p>
          <Options
            items={(candidates || []).map((c) => ({ id: String(c.v), label: String(c.v) }))}
            picked={null}
            wrong={wrong.map(String)}
            onPick={(o) => pickCandidate((candidates || []).find((c) => String(c.v) === o.id))}
            disabled={!gate}
            cols={4}
            minH={40}
            collapse={false}
            badges={false}
          />
        </>
      ) : null}

      {/* witness */}
      {phase === 'witness' ? (
        !numPicked ? (
          <>
            <p className="lc-hint g9-ask">{t(texts.witness || UI.whichNum)}</p>
            <Options
              items={witness.options.map((o) => ({ id: o.id, label: o.label || String(o.v) }))}
              picked={null}
              wrong={wrong}
              onPick={(o) => pickWitness(witness.options.find((x) => x.id === o.id))}
              disabled={!gate}
              cols={4}
              minH={40}
              collapse={false}
              badges={false}
            />
          </>
        ) : (
          <div className="g9-witness">
            {lines.slice(0, linesShown).map((line, i) => (
              <div key={i} className="lc-expr lc-expr-sm g9-witness-row lc-in">{line}</div>
            ))}
            <Slot mh={26}>
              {signShown ? (
                <div className="g9-witness-sign lc-in" style={{ color: witness.sign === '+' ? T.ok : T.accent }}>
                  {t(witness.signWord)}
                </div>
              ) : null}
            </Slot>
          </div>
        )
      ) : null}

      {/* flips: savolga O'QUVCHI javob beradi, izoh va ishora O'ZI keladi */}
      {curFlip ? (
        !whyOpen ? (
          <>
            <p className="lc-hint g9-ask">{t(curFlip.question)}</p>
            <Options
              items={curFlip.options.map((o) => ({ id: o.id, label: t(o.label) }))}
              picked={null}
              wrong={wrong}
              onPick={(o) => pickFlip(curFlip.options.find((x) => x.id === o.id))}
              disabled={!gate}
              cols={2}
              minH={42}
            />
          </>
        ) : (
          <div className="g9-why lc-in">
            {(curFlip.why || []).map((w, i) => (
              <div key={i} className={'g9-why-row' + (w.changes ? ' g9-why-yes' : '')}>
                <span className="g9-why-mark">{w.changes ? '↕' : '='}</span>
                <span className="lc-expr lc-expr-sm">{w.factor}</span>
                <span className="g9-why-txt">{t(w.txt)}</span>
              </div>
            ))}
          </div>
        )
      ) : null}

      {/* shade: javobni O'QUVCHI yig'adi */}
      {phase === 'shade' ? (
        <>
          <p className="lc-hint g9-ask">{t(texts.shade || UI.shadeHint)}</p>
          <Slot mh={46}>
            {!solved ? (
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <Btn tone="accent" ready={shaded.length > 0 && gate} onClick={checkShade} disabled={!shaded.length || !gate}>
                  {t(UI.check)}
                </Btn>
                <Btn tone="ghost" onClick={() => { setShaded([]); setHint(null) }}>{t(UI.again)}</Btn>
              </div>
            ) : (
              <div className="g9-answer lc-in">
                <span className="g9-answer-tag">{t(UI.answerIs)}</span>
                <span className="g9-answer-val">{answerText}</span>
              </div>
            )}
          </Slot>
        </>
      ) : null}

      <Slot mh={72}>
        <Feedback show={!!hint} ok={ok}>{hint ? t(hint) : null}</Feedback>
      </Slot>
    </>
  )
}

// ============================================================
// ParabolaAxis -- 1-ASBOBNING TO'LIQ KO'RINISHI.
//
// Metodist qarori 2026-08-06: slaydning yarmi bo'sh edi (noutbukda 61%,
// telefonda 50%), o'q esa 529px dan faqat 100px ni olardi. Sabab: asbob
// YARIM qurilgan edi -- `PODXOD_9SINF.md` §4 da «yuqorida grafik, pastda
// sonlar o'qi» deb yozilgan, grafik esa yo'q edi.
//
// FARQ podxod matnidan: grafik va o'q IKKI alohida qism emas, BITTA obyekt --
// parabolaning Ox o'qi AYNAN o'sha sonlar o'qi. Sabab metodik: o'quvchi
// bo'yalgan oraliqni grafikning aynan shu bo'lagi ostida ko'radi, ikki
// alohida rasmda esa bu bog'lanishni o'zi qurishi kerak bo'lardi.
//
// TUSHUNTIRISHDA O'QUVCHI BOSHQARADI, LEKIN JAVOB BERMAYDI (metodist qarori):
// u o'qdagi nuqtani TORTADI. Tortganda bir vaqtda:
//   - nuqta parabola bo'ylab yuradi,
//   - pastda ko'paytuvchilar HAQIQIY son bilan hisoblanadi,
//   - ishorasini o'zgartirgan ko'paytuvchi RANGINI o'zgartiradi,
//   - ko'paytma ishorasi rangi bilan ag'dariladi.
// Ildizdan o'tganda `onCross(at)` chaqiriladi -- dars shu joyga ovoz bog'laydi.
//
// Ikki ildizdan ham o'tib bo'lgach ishoralar o'qqa MUHRLANADI va javob
// bo'yaladi. Ya'ni tushuntirish o'quvchining QO'LI bilan tugaydi.
//
// BALANDLIK NAFAS OLADI (metodist qarori): razbor yo'q -- grafik to'liq,
// razbor chiqdi -- grafik silliq siqiladi. Shuning uchun bo'sh slot kerak
// emas va skroll ham paydo bo'lmaydi.
// ============================================================
const PX_W = 900
const PX_PAD = 56

export function ParabolaAxis({
  from,
  to,
  yFrom,
  yTo,
  f,                    // (x) => son. Grafik va hisob SHU funksiyadan.
  factors,              // [{ label, f }] -- pastdagi chiplar
  roots,                // [{ at, filled }]
  signs = {},           // muhrlangan ishoralar
  shaded = [],          // bo'yalgan oraliqlar
  x,                    // joriy nuqta
  onX,                  // tortganda
  compact = false,      // razbor ochiq -> pastroq
  showHandle = true,
}) {
  const H = compact ? 210 : 284
  const svgRef = useRef(null)
  const boxRef = useRef(null)
  const [w, setW] = useState(PX_W)
  const [dragging, setDragging] = useState(false)

  // `viewBox` QAT'IY 900 birlik edi. Telefonda konteyner 358px, ya'ni butun
  // rasm 0.4 ga siqilardi: grafik kichkina, yozuvlar o'qilmas, kartochka
  // ichida bo'sh joy. Endi konteyner O'LCHANADI va 1 birlik = 1 piksel.
  useEffect(() => {
    const el = boxRef.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined
    const apply = () => { const r = el.getBoundingClientRect(); if (r.width > 40) setW(Math.round(r.width)) }
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const pad = Math.max(24, Math.min(PX_PAD, w * 0.07))
  const sx = (v) => pad + ((v - from) / (to - from)) * (w - 2 * pad)
  const sy = (v) => 26 + ((yTo - v) / (yTo - yFrom)) * (H - 74)
  const y0 = sy(0)

  const intervals = useMemo(() => intervalsOf(roots, from, to), [roots, from, to])

  // Parabola chizig'i: 160 nuqta -- silliq va yengil.
  const path = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 160; i += 1) {
      const v = from + ((to - from) * i) / 160
      pts.push((i === 0 ? 'M' : 'L') + sx(v).toFixed(1) + ' ' + sy(f(v)).toFixed(1))
    }
    return pts.join(' ')
  }, [from, to, yFrom, yTo, H, w, f]) // eslint-disable-line react-hooks/exhaustive-deps

  // Tortish. Pointer -- sichqoncha va barmoq uchun bir xil.
  const fromEvent = (e) => {
    const el = svgRef.current
    if (!el) return null
    const r = el.getBoundingClientRect()
    const vx = ((e.clientX - r.left) / r.width) * w
    const v = from + ((vx - pad) / (w - 2 * pad)) * (to - from)
    return Math.max(from + 0.05, Math.min(to - 0.05, Math.round(v * 20) / 20))
  }
  const move = (e) => { if (!dragging || !onX) return; const v = fromEvent(e); if (v !== null) onX(v) }
  const down = (e) => { if (!onX) return; setDragging(true); const v = fromEvent(e); if (v !== null) onX(v) }
  useEffect(() => {
    if (!dragging) return undefined
    const up = () => setDragging(false)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => { window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up) }
  }, [dragging])

  const val = x === null || x === undefined ? null : f(x)
  const pos = val !== null && val > 0

  return (
    <div ref={boxRef} style={{ width: '100%' }}>
    <svg
      ref={svgRef}
      viewBox={'0 0 ' + w + ' ' + H}
      className="g9-plane"
      style={{ width: '100%', height: H, display: 'block', touchAction: 'none' }}
      onPointerDown={down}
      onPointerMove={move}
    >
      {/* grafikning musbat va manfiy bo'lagi -- Ox dan yuqori va past */}
      <defs>
        {/* yuqoridan ham qirqiladi: parabola shoxi kartochkadan CHIQIB ketmasin */}
        <clipPath id="g9clipUp"><rect x="0" y="12" width={w} height={Math.max(0, y0 - 12)} /></clipPath>
        <clipPath id="g9clipDn"><rect x="0" y={y0} width={w} height={H - y0} /></clipPath>
      </defs>

      {/* Oy o'qi */}
      <line x1={sx(0)} y1={20} x2={sx(0)} y2={H - 44} stroke={T.line} strokeWidth="1.5" />

      {/* bo'yalgan javob -- Ox ning O'ZIDA, grafikning tegishli bo'lagi ostida */}
      {shaded.map((i) => intervals[i] ? (
        <rect
          key={'sh' + i}
          x={sx(intervals[i].lo)}
          y={y0 - 4}
          width={sx(intervals[i].hi) - sx(intervals[i].lo)}
          height={8}
          rx={4}
          fill={signs[i] === '-' ? T.accent : T.ok}
          opacity={0.9}
          className="g9-fill"
        />
      ) : null)}

      {/* Ox */}
      <line x1={pad - 20} y1={y0} x2={w - 12} y2={y0} stroke={T.ink} strokeWidth="2" />
      <polygon points={(w - 12) + ',' + y0 + ' ' + (w - 24) + ',' + (y0 - 5) + ' ' + (w - 24) + ',' + (y0 + 5)} fill={T.ink} />
      {/* `x` yozuvi o'q USTIDA: o'ngda qo'yilsa telefonda qirqilardi */}
      <text x={w - 10} y={y0 - 9} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontSize="15" fontStyle="italic" fill={T.ink3}>x</text>

      {/* butun sonlar */}
      {Array.from({ length: Math.floor(to) - Math.ceil(from) + 1 }, (_, k) => Math.ceil(from) + k).map((v) => (
        <g key={'t' + v}>
          <line x1={sx(v)} y1={y0 - 4} x2={sx(v)} y2={y0 + 4} stroke={T.ink3} strokeWidth="1.4" />
          {v !== 0 ? <text x={sx(v)} y={y0 + 21} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="13" fill={T.ink3}>{v}</text> : null}
        </g>
      ))}

      {/* parabola: Ox dan yuqorisi YASHIL, pasti TO'Q SARIQ */}
      <path d={path} fill="none" stroke={T.ok} strokeWidth="3" clipPath="url(#g9clipUp)" className="g9-curve" />
      <path d={path} fill="none" stroke={T.accent} strokeWidth="3" clipPath="url(#g9clipDn)" className="g9-curve" />

      {/* muhrlangan ishoralar */}
      {intervals.map((iv) => {
        const s = signs[iv.i]
        if (!s) return null
        return (
          <text
            key={'s' + iv.i}
            x={(sx(iv.lo) + sx(iv.hi)) / 2}
            y={y0 - 16}
            textAnchor="middle"
            className="g9-sign"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="27"
            fontWeight="800"
            fill={s === '+' ? T.ok : T.accent}
            stroke={T.paper}
            strokeWidth="4"
            paintOrder="stroke"
          >
            {s === '+' ? '+' : '−'}
          </text>
        )
      })}

      {/* ildizlar */}
      {roots.map((r) => (
        <circle key={'r' + r.at} cx={sx(r.at)} cy={y0} r={6.5} fill={r.filled ? T.ink : T.paper} stroke={T.ink} strokeWidth="2.3" />
      ))}

      {/* JORIY NUQTA: o'qdan grafikka tik chiziq va grafikdagi nuqta */}
      {val !== null ? (
        <g className={dragging ? undefined : 'g9-handle-idle'}>
          <line x1={sx(x)} y1={y0} x2={sx(x)} y2={sy(val)} stroke={pos ? T.ok : T.accent} strokeWidth="1.6" strokeDasharray="3 3" />
          <circle cx={sx(x)} cy={sy(val)} r={6} fill={pos ? T.ok : T.accent} />
          {showHandle ? (
            <>
              <circle cx={sx(x)} cy={y0} r={13} fill={T.paper} stroke={pos ? T.ok : T.accent} strokeWidth="3" style={{ cursor: 'grab' }} />
              <text x={sx(x)} y={y0 + 5} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="800" fill={pos ? T.ok : T.accent}>x</text>
            </>
          ) : null}
          <text x={sx(x)} y={H - 24} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="15" fontWeight="700" fill={T.ink}>
            {'x = ' + (Math.round(x * 10) / 10)}
          </text>
        </g>
      ) : null}
    </svg>
    </div>
  )
}

// ============================================================
// LiveProduct -- ko'paytuvchilar HAQIQIY son bilan, o'z ishorasi bilan.
// Nuqta tortilganda ishorasini o'zgartirgan chip rangini o'zgartiradi --
// «qaysi ko'paytuvchi ag'darildi» degan savol shu yerda KO'RINADI.
// ============================================================
export function LiveProduct({ factors, x, f }) {
  if (x === null || x === undefined) return null
  const val = f(x)
  const r1 = (v) => Math.round(v * 10) / 10
  return (
    <div className="g9-live">
      {factors.map((fa, i) => {
        const v = fa.f(x)
        const cls = 'g9-chip ' + (v > 0 ? 'g9-chip-pos' : v < 0 ? 'g9-chip-neg' : 'g9-chip-zero')
        return (
          <React.Fragment key={i}>
            {i > 0 ? <span className="g9-live-op">·</span> : null}
            <span className={cls}>
              <span className="g9-chip-lab">{fa.label}</span>
              <span className="g9-chip-val">{r1(v)}</span>
            </span>
          </React.Fragment>
        )
      })}
      <span className="g9-live-op">=</span>
      <span className={'g9-chip g9-chip-res ' + (val > 0 ? 'g9-chip-pos' : val < 0 ? 'g9-chip-neg' : 'g9-chip-zero')}>
        <span className="g9-chip-val">{r1(val)}</span>
      </span>
    </div>
  )
}

// ============================================================
// AxisStill -- harakatsiz o'q: yakun, final va takrorlash ekranlari uchun.
// ============================================================
export function AxisStill({ from, to, roots, signs, shaded, caption, h = 96 }) {
  const t = useT()
  return (
    <div className="lc-frame-card">
      <NumberAxis from={from} to={to} roots={roots} signs={signs || {}} shaded={shaded || []} h={h} />
      {caption ? <div className="g9-axis-cap">{t(caption)}</div> : null}
    </div>
  )
}

// ============================================================
// Uslublar. Yadro uslublariga QO'SHIMCHA: dars ikkisini ham qo'yadi.
// Ichida backtick YO'Q (u faylni sindiradi -- 3-sinf saboqi).
// ============================================================
export const AXIS_STYLES = `
/* ============================================================
   O'LCHOV SHKALASI 3-SINF BILAN BIR XIL (metodist talabi 2026-08-06).
   Yadro uslublaridan KEYIN ulanadi, shuning uchun ustun keladi.
   Manba: src/components/grade3/_kit/styles.js
     .h-sub   clamp(20px, 3.2vw, 23px), 'Source Serif 4' 600, lh 1.1
     .body    clamp(15px, 1.9vw, 15px), lh 1.42        -- yadroda ham shunday
     .eyebrow clamp(11px, 1.3vw, 11px), 0.18em         -- yadroda ham shunday
     .fade-up 0.4s ease-out, delay 0.12 / 0.24 / 0.36 / 0.48
     tugma va variant: radius 12px                     -- yadroda ham shunday
   Ya'ni farq faqat SARLAVHA shriftida va ochilish tezligida edi.
   7-sinfga TEGMAYDI: uni o'zgartirish qarori berilmagan.
   ============================================================ */
.lesson-root .lc-title {
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.005em;
  font-variation-settings: "opsz" 60;
  font-size: clamp(20px, 3.2vw, 23px);
}
.lesson-root .lc-in,
.lesson-root .lc-rule-line,
.lesson-root .lc-rule-example { animation-duration: .4s; }

.g9-axis-card { padding: clamp(6px, 1.2vw, 10px) clamp(4px, 1vw, 8px); }
.g9-axis { overflow: visible; }
.g9-sign { animation: g9-sign-in .34s cubic-bezier(.34,1.4,.64,1) both; }
@keyframes g9-sign-in { from { opacity: 0; } to { opacity: 1; } }
.g9-root circle { animation: g9-root-in .3s ease-out both; }
@keyframes g9-root-in { from { opacity: 0; } to { opacity: 1; } }

.g9-ask { font-weight: 700; color: #14161A; }

.g9-witness {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 2px 0;
}
.g9-witness-row { text-align: center; }
.g9-witness-sign {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 600;
  font-size: clamp(15px, 2.2vw, 19px);
  margin-top: 1px;
}

.g9-answer {
  display: flex; align-items: baseline; justify-content: center; gap: 10px;
}
.g9-answer-tag {
  font-size: 11px; letter-spacing: .18em; text-transform: uppercase;
  font-weight: 700; color: #9AA1AC;
}
.g9-answer-val {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: clamp(17px, 2.5vw, 23px);
  color: #1F7A4D;
}

/* --- 1-asbobning to'liq ko'rinishi: grafik + o'q + tirik hisob --- */
.g9-plane-card { padding: clamp(4px, .9vw, 8px) clamp(2px, .6vw, 6px); }
.g9-plane { overflow: visible; user-select: none; }
.g9-curve { animation: g9-draw .5s ease-out both; }
@keyframes g9-draw { from { opacity: 0; } to { opacity: 1; } }
.g9-fill { animation: g9-fill-in .45s cubic-bezier(.4,0,.2,1) both; transform-origin: left center; }
@keyframes g9-fill-in { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.g9-handle-idle { animation: g9-nudge 2.4s ease-in-out infinite; }
@keyframes g9-nudge { 0%, 88%, 100% { opacity: 1; } 94% { opacity: .5; } }

.g9-live {
  display: flex; align-items: center; justify-content: center;
  gap: clamp(4px, 1vw, 8px);
  flex-wrap: nowrap;
}
.g9-live-op {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(14px, 2vw, 18px); font-weight: 700; color: #9AA1AC;
}
.g9-chip {
  display: inline-flex; flex-direction: column; align-items: center;
  padding: clamp(3px, .8vw, 6px) clamp(7px, 1.4vw, 12px);
  border-radius: 10px;
  background: #FFFFFF;
  box-shadow: 0 4px 12px -5px rgba(20,22,26,.16);
  transition: background .22s, color .22s, box-shadow .22s;
}
.g9-chip-lab {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(11px, 1.4vw, 12px); font-weight: 600; color: #9AA1AC;
  white-space: nowrap;
}
.g9-chip-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(15px, 2.2vw, 19px); font-weight: 800; line-height: 1.1;
}
.g9-chip-pos { background: #E3F0E8; }
.g9-chip-pos .g9-chip-val { color: #1F7A4D; }
.g9-chip-neg { background: #FDEDE8; }
.g9-chip-neg .g9-chip-val { color: #E8552B; }
.g9-chip-zero { background: #FBF3D6; }
.g9-chip-zero .g9-chip-val { color: #C99A2E; }
.g9-chip-res { box-shadow: 0 6px 16px -5px rgba(20,22,26,.22); }
.g9-chip-res .g9-chip-val { font-size: clamp(17px, 2.6vw, 22px); }

.g9-drag-hint {
  display: flex; align-items: center; justify-content: center; gap: 7px;
  font-size: clamp(12px, 1.6vw, 14px); font-weight: 600; color: #0E7C8B;
}
.g9-drag-hint span { animation: g9-slide-hint 1.8s ease-in-out infinite; }
@keyframes g9-slide-hint { 0%, 100% { transform: translateX(3px); } 50% { transform: translateX(-3px); } }

.g9-why {
  display: flex; flex-direction: column; gap: 3px;
  padding: clamp(4px, 1vw, 7px) clamp(8px, 1.6vw, 13px);
  border-radius: 11px;
  background: #FFFFFF;
  box-shadow: 0 6px 16px -6px rgba(20,22,26,.14);
}
.g9-why-row {
  display: flex; align-items: center; gap: 9px;
  font-size: clamp(12px, 1.5vw, 13px);
  color: #5C636E;
  opacity: .55;
}
.g9-why-yes { opacity: 1; color: #14161A; font-weight: 600; }
.g9-why-mark {
  flex-shrink: 0; width: 19px; text-align: center;
  font-family: 'JetBrains Mono', monospace; font-weight: 800;
  color: #9AA1AC;
}
.g9-why-yes .g9-why-mark { color: #E8552B; }
.g9-why-txt { flex: 1; min-width: 0; }

.g9-axis-cap {
  text-align: center;
  font-size: clamp(12px, 1.5vw, 13px);
  color: #5C636E;
  padding-top: 2px;
}
`

export { UI as AXIS_UI }
