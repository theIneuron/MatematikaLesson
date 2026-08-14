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
  Cue,
  Col,
  useBoxSize,
  useSpin,
  useTween,
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
  // Yangi turlar (1-4-sinf amaliyoti naqshlari): tartiblash, ko'p tanlov,
  // moslashtirish. Variant tanlash bilan solishtirganda taxmin ishlamaydi.
  orderAsk: L('Kamayish tartibida joylashtiring.', 'Расставь по убыванию.', 'Arrange in decreasing order.'),
  orderBad: L(
    "Tartib buzilgan. Har bir qiymatni aylanadagi nuqtadan o'qing.",
    'Порядок нарушен. Читай каждое значение по точке на окружности.',
    'The order is wrong. Read each value from its point on the circle.',
  ),
  multiMissed: L(
    "Hammasi emas: yana mumkin bo'lgani bor.",
    'Не всё: осталась ещё одна возможная запись.',
    'Not all of them: one possible statement is still unmarked.',
  ),
  matchAsk: L(
    "Burchakni koordinatalari bilan birlashtiring.",
    'Соедини угол с его координатами.',
    'Match each angle with its coordinates.',
  ),
  matchBad: L(
    "Bu juftlik boshqa burchakniki.",
    'Эта пара принадлежит другому углу.',
    'That pair belongs to a different angle.',
  ),
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
      {data.question ? <Cue kind="tap">{t(data.question)}</Cue> : null}
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
            : <Cue kind="tap">{t(current.prompt)}</Cue>}
          <Options
            items={(orders[idx] || current.items).map((it) => ({ id: it.id, label: t(it.label) }))}
            picked={okId}
            wrong={wrong}
            onPick={pick}
            cols={current.cols || cols}
          />
        </div>
      ) : null}
      {/* Miltillovchi ramka olib tashlandi (metodist 2026-08-07): javob
          berilgach ham bo'sh ramka qolib, ko'zni chalg'itardi. Balandlik
          saqlanadi -- raskladka sakramaydi. */}
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
      {!solved ? <Cue kind="tap">{t(CUI.auditAsk)}</Cue> : null}
      {/* Ishora qatori qo'shilgach 1366x615 da 9px oshib ketdi: qatorlar
          balandligi bir pog'ona qisqardi, shrift TEGILMADI. */}
      <Panel style={{ display: 'flex', flexDirection: 'column', gap: solved ? 3 : 4 }}>
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
                minHeight: solved ? 24 : 27,
                padding: solved ? '2px 11px' : '3px 11px',
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
// O'nlik VERGUL bilan: butun dars «3,14» deb yozadi, tablo esa «3.14» deb
// ko'rsatardi -- bitta sahifada ikki xil yozuv. Aniq qiymat jadvalda bo'lmagan
// burchakda (o'quvchi nuqtani o'zi surganda) shu yo'l ishlaydi.
const fmt = (v) => {
  const r = round2(v)
  return (Math.abs(r) < 0.005 ? '0' : String(r)).replace('-', '−').replace('.', ',')
}
export const exactOf = (deg) => EXACT[norm(deg)] || [fmt(Math.cos(rad(deg))), fmt(Math.sin(rad(deg)))]
export const radOf = (deg) => RAD[norm(deg)] || null

// TANGENS -- 2-dars. Nisbat `y/x`, ya'ni ALLAQACHON o'qilgan ikki son.
// `null` bu «qiymat YO'Q»: abscissa nol, bo'lish yo'q. Nol EMAS, cheksizlik ham
// emas -- shuning uchun jadvalda ham `null` turadi, nol turmaydi.
export const TAN = {
  0: '0', 30: '√3/3', 45: '1', 60: '√3', 90: null,
  120: '−√3', 135: '−1', 150: '−√3/3', 180: '0',
  210: '√3/3', 225: '1', 240: '√3', 270: null,
  300: '−√3', 315: '−1', 330: '−√3/3',
}
export const tanOf = (deg) => {
  const d = norm(deg)
  if (d in TAN) return TAN[d]
  const c = Math.cos(rad(d))
  // Chegara aniq 90° dan kengroq: o'quvchi barmoq bilan aynan 90 ga tushmaydi,
  // 89,7° da esa bo'lish hali ham bor va ko'rsatkich O'SIB boradi -- uzilish
  // faqat abscissa amalda nolga aylanganda.
  if (Math.abs(c) < 0.005) return null
  return fmt(Math.sin(rad(d)) / c)
}

const CUI = {
  angle: L('Burchak', 'Угол', 'Angle'),
  cos: L('Kosinus', 'Косинус', 'Cosine'),
  sin: L('Sinus', 'Синус', 'Sine'),
  tan: L('Tangens', 'Тангенс', 'Tangent'),
  sum: L('Kvadratlar', 'Квадраты', 'Squares'),
  // 1-dars: burchak UZUNLIK bilan o'lchanadi. Tablo yozuvlari shu yerda,
  // dars faylida emas: ular hamma darsda bir xil.
  laid: L('Yotgan radius', 'Уложено радиусов', 'Radii laid'),
  laidChord: L('Yotgan vatar', 'Уложено хорд', 'Chords laid'),
  arcLen: L('Yoy uzunligi', 'Длина дуги', 'Arc length'),
  chainLen: L('Siniq chiziq uzunligi', 'Длина ломаной', 'Length of the chain'),
  rest: L('Qoldiq', 'Остаток', 'Remainder'),
  radiusLbl: L('Radius', 'Радиус', 'Radius'),
  ratio: L("Yoy ÷ radius", 'Дуга ÷ радиус', 'Arc ÷ radius'),
  layAsk: L(
    "Radiusni yoy bo'ylab yotqizing: keyingi yoy oldingisi tugagan joydan boshlanadi.",
    'Укладывай радиус по дуге: следующая дуга начинается там, где кончилась прошлая.',
    'Lay the radius along the arc: the next arc starts where the previous one ended.',
  ),
  layClose: L(
    "Aylanani yoping: qolgan bo'lak radiusdan qisqa.",
    'Замкни круг: оставшийся кусок короче радиуса.',
    'Close the circle: the piece left is shorter than the radius.',
  ),
  layMiss: L(
    "Yoy oldingisi tugagan joydan boshlanadi va UZUNLIGI o'sha-o'sha.",
    'Дуга начинается там, где кончилась прошлая, и длина у неё та же.',
    'The arc starts where the previous ended, and its length is the same.',
  ),
  // Ikki ekranda topshiriq satri UMUMAN yo'q edi: jadval va «xatoni top»
  // ekranida o'quvchi nima qilish kerakligini o'zi taxmin qilardi.
  tableAsk: L(
    "Pastdagi qiymatlardan tanlab, kataklarni to'ldiring.",
    'Заполни клетки, выбирая значения снизу.',
    'Fill the cells, choosing values from below.',
  ),
  auditAsk: L(
    'Xato yozilgan qatorni toping.',
    'Найди строку, записанную с ошибкой.',
    'Find the row written with a mistake.',
  ),
  // Son o'zgaruvchi: rus tilida «в 1 четвертях» kabi kelishik xatosi chiqmasin
  // va o'tgan zamon JINSSIZ bo'lsin (loyiha qoidasi: RU da «ты», jinssiz shakl).
  explore: L(
    "Choraklar: {k} tadan {n} ta.",
    'Пройдено четвертей: {n} из {k}.',
    'Quadrants visited: {n} of {k}.',
  ),
  // Boshlang'ich holat: nuqta KO'RINADI va uni qayerga olib borish kerakligi
  // aytiladi (metodist P0, 2026-08-07).
  grab: L(
    "Nuqtani ushlab, aylana bo'ylab suring.",
    'Возьми точку и веди её по окружности.',
    'Grab the point and drag it around the circle.',
  ),
  higher: L('Bir oz yuqoriroq.', 'Чуть выше.', 'A little higher.'),
  lower: L('Bir oz pastroq.', 'Чуть ниже.', 'A little lower.'),
  placed: L("Bo'ldi. Endi keyingisi.", 'Есть. Теперь следующая.', 'Got it. Now the next one.'),
  axisX: 'x = cos α',
  axisY: 'y = sin α',
  // Ikkinchi yorliq: koordinata nimani anglatishini butun dars davomida
  // ko'z oldida ushlab turadi (metodist qarori 2026-08-07).
  meanX: L('siljish', 'сдвиг', 'shift'),
  meanY: L('balandlik', 'высота', 'height'),
}

// Sahna: chapda chizma (butun balandlik), o'ngda ish ustuni. Piksel qotirilmagan
// -- chizma o'z qutisini o'lchab, kichik tomoniga moslashadi (poli etalon §6.3).
export function Scene({ fig, note, max = 620, h }) {
  const [ref, box] = useBoxSize()
  // O'lcham QUTIDAN olinadi, `h` dan emas: past ekranda quti `--g10-fig` bilan
  // qisqaradi va SVG ham u bilan birga qisqarishi kerak. Avval SVG `h` ni
  // olardi va qutidan CHIQIB kesilardi (metodist telefonda ko'rdi, 2026-08-11).
  const side = Math.min(max, Math.max(0, Math.min(box.w, box.h || h || 0)))
  return (
    <div className="g10-scene" style={h ? { flex: '0 0 auto' } : undefined}>
      {fig ? (
        <div
          className={'g10-scene-fig' + (h ? ' g10-scene-fig-fixed' : '')}
          ref={ref}
          style={h ? { height: `calc(${h}px * var(--g10-fig, 1))`, flex: '1 1 auto' } : undefined}
        >
          {side > 60 ? (
            <div
              className="g10-figfade"
              key={(fig.type && (fig.type.displayName || fig.type.name)) || 'fig'}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {React.cloneElement(fig, { size: side })}
            </div>
          ) : null}
        </div>
      ) : null}
      {note ? <div className="g10-scene-note">{note}</div> : null}
    </div>
  )
}

// Daftar satri: chizmadan «uchib» keladi -- yozuv chizmadan olinadi.
// Chiqarish ustuni. Element uch xil bo'lishi mumkin:
//   'matn'            -- oddiy qadam
//   { v, ok: true }   -- SHU kadrning xulosasi (yashil, kadrga bittadan)
//   { v, bad: true }  -- TAXMIN yoki rad etilgan yozuv (issiq rang)
// Matn satri L(...) bo'lishi kerak, formula esa oddiy satr.
export function NoteList({ items }) {
  const t = useT()
  return (
    <div className="g10-side">
      {items.map((n, i) => {
        const ok = !!(n && n.ok)
        const bad = !!(n && n.bad)
        const v = ok || bad ? n.v : n
        return (
          <NoteLine key={i} i={i} tone={ok ? T.ok : bad ? T.tip : undefined}>
            {typeof v === 'string' ? v : t(v)}
          </NoteLine>
        )
      })}
    </div>
  )
}

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

// Yoy-strelka: sanoq YO'NALISHINI ko'rsatadi. Uchi yoyning urinmasi bo'yicha
// buriladi va chizma o'lchamiga mos keladi -- qo'lda yozilgan uchburchak emas.
function ArcArrow({ cx, cy, r, from, to, size = 268, tone }) {
  const p1 = [cx + r * Math.cos(rad(from)), cy - r * Math.sin(rad(from))]
  const p2 = [cx + r * Math.cos(rad(to)), cy - r * Math.sin(rad(to))]
  const head = Math.max(4.5, size * 0.026)
  // Urinma: soat miliga TESKARI harakatda burchak oshadi.
  const tan = to + 90
  const tip = [p2[0] + head * 0.55 * Math.cos(rad(tan)), p2[1] - head * 0.55 * Math.sin(rad(tan))]
  const left = [p2[0] + head * 0.5 * Math.cos(rad(tan + 128)), p2[1] - head * 0.5 * Math.sin(rad(tan + 128))]
  const right = [p2[0] + head * 0.5 * Math.cos(rad(tan - 128)), p2[1] - head * 0.5 * Math.sin(rad(tan - 128))]
  return (
    <g opacity=".75">
      <path
        d={'M ' + p1[0] + ' ' + p1[1] + ' A ' + r + ' ' + r + ' 0 '
          + (to - from > 180 ? 1 : 0) + ' 0 ' + p2[0] + ' ' + p2[1]}
        fill="none" stroke={tone} strokeWidth={Math.max(1.1, size * 0.005)} strokeLinecap="round"
      />
      <polygon
        points={tip[0] + ',' + tip[1] + ' ' + left[0] + ',' + left[1] + ' ' + right[0] + ',' + right[1]}
        fill={tone}
      />
    </g>
  )
}

// Ko'rsatkichlar paneli. Chizmaning ichida ham, o'ng ustunda ham turadi --
// keng ekranda uni ustunga chiqarish chizmani bo'shatadi va bo'sh joyni to'ldiradi.
// `hide` -- ekranga TEGISHLI bo'lmagan qatorlarni olib tashlaydi. Nima uchun:
// tablo to'rt qatorda, va ba'zi ekranda ulardan ikkitasi savolga aloqador emas
// («sinus 1,2 bo'la oladimi?» ekranida kosinus va sinus qiymatlari emas,
// KVADRATLAR yig'indisi guvoh). Ortiqcha ikki qator 120 px, va yakuniy holatda
// ekran budjetdan chiqib, pastki qatorlar jimgina kesilardi.
// `tan` -- 2-dars uchun tangens qatori. Nega alohida prop: tangens BOR ekrandan
// ko'ra yo'q ekran ko'proq, va ortiqcha qator kompakt telefonda 40 px.
export function Readout({ angle, ghost = null, counter = false, live = false, tan = false, hide = [] }) {
  const t = useT()
  const has = angle !== null && angle !== undefined
  const [ex, ey] = has ? exactOf(angle) : ['', '']
  const radLabel = has ? radOf(angle) : null
  const cv = ghost ? ghost.x : (has ? Math.cos(rad(angle)) : 0)
  const sv = ghost ? ghost.y : (has ? Math.sin(rad(angle)) : 0)
  const c2 = round2(cv * cv)
  const s2 = round2(sv * sv)
  const sum = round2(c2 + s2)
  const dec = (v) => v.toFixed(2).replace('.', ',')
  // Hali hech narsa o'lchanmagan. Nomlar QOLADI -- bu asbobning shkalasi,
  // o'quvchi nima o'lchanishini oldindan biladi. Qiymat o'rnida esa tinch
  // chiziqcha: «ko'rsatkich yo'q» degani, «qiymati chiziqcha» degani emas.
  const blank = !has && !ghost
  const wait = <i className="g10-rd-wait" aria-label="—" />
  return (
    <div className="g10-readout">
      <div className="g10-readout-body">
        {hide.indexOf('angle') === -1 ? (
          <div className="g10-rd">
            <span className="g10-rd-key">{t(CUI.angle)}</span>
            <span className="g10-rd-val">{has ? Math.round(angle) + '°' + (radLabel ? '  ·  ' + radLabel : '') : wait}</span>
          </div>
        ) : null}
        {hide.indexOf('cos') === -1 ? (
          <div className="g10-rd">
            <span className="g10-rd-key">{t(CUI.cos)}</span>
            <span className="g10-rd-val g10-rd-val-accent">{has ? ex : wait}</span>
          </div>
        ) : null}
        {hide.indexOf('sin') === -1 ? (
          <div className="g10-rd">
            <span className="g10-rd-key">{t(CUI.sin)}</span>
            <span className="g10-rd-val g10-rd-val-accent">{has ? ey : wait}</span>
          </div>
        ) : null}
        {/* TANGENS. Uzilish shu yerda KO'RINADI: abscissa nolga aylanganda
            ko'rsatkich issiq rangdagi CHIZIQCHAGA aylanadi. Dastur «cheksizlik»
            deb yozmaydi -- cheksizlik son emas, va uni sonday ko'rsatish aynan
            `tangens-bez-nulya` xatosini o'rgatgan bo'lardi.
            Qator BALANDLIGI o'zgarmaydi: chiziqcha ham, son ham bitta satr.
            Ikkinchi satr («qiymat yo'q») qo'yilmadi -- u paydo bo'lganda
            raskladka sakraydi va yakuniy holat budjetdan chiqadi. Ma'nosini
            ekranning javob qatori SO'Z bilan aytadi. */}
        {tan && hide.indexOf('tan') === -1 ? (
          <div className="g10-rd">
            <span className="g10-rd-key">{t(CUI.tan)}</span>
            {!has ? (
              <span className="g10-rd-val">{wait}</span>
            ) : tanOf(angle) === null ? (
              <span className="g10-rd-val" style={{ color: T.tip }}>—</span>
            ) : (
              <span className="g10-rd-val g10-rd-val-accent">{tanOf(angle)}</span>
            )}
          </div>
        ) : null}
        {counter ? (
          <div className="g10-rd g10-rd-sum">
            <span className="g10-rd-key">{t(CUI.sum)}</span>
            <span
              className="g10-rd-val g10-rd-val-sum"
              style={{ color: blank ? T.ink3 : sum === 1 ? T.ok : T.tip }}
            >
              {blank ? wait : live ? dec(c2) + ' + ' + dec(s2) + ' = ' + dec(sum) : dec(sum)}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

// Tablo chizma YONIDA turmaydi: u yozuv ustunida yashaydi (etalon §5.1).
// Yonida turganda ikkalasi bitta qutini bo'lishadi, sahna esa qutini kvadrat
// deb hisoblaydi -- natijada tablo qutidan chiqib, jimgina kesiladi. Shuning
// uchun UnitCircle uni umuman chizmaydi: chaqiruvchi <Readout/> ni o'zi qo'yadi.
export function UnitCircle({
  size: sizeIn = 268,
  angle,
  onAngle,
  snap,
  marks = [],
  ghost = null,  // taxmin nuqtasi: {x, y, drop?, label?} -- javob emas, FARAZ
  chord = null,
  bisector = false,
  locked = false,
  reflect = false,
  drop = false,
  values = false,
  tween = true,
  axes = true,   // o'qlar PODPISANGAN: qayerda kosinus, qayerda sinus
  ticks = false, // 15° li shtrixlar, RAQAMSIZ: mo'ljal bor, javob yo'q
  start = null,  // nuqta yo'q paytda «meni ushla» markeri shu burchakda
  meaning = false, // o'q yorlig'i tagida MA'NOSI: balandlik / siljish
  // YOY -- 1-dars uchun (radianlar). {to, laid, label}: 0 dan `to` gacha yoy
  // YO'G'ON chiziq bilan ajratiladi, `laid` berilsa har RADIAN chegarasida
  // ajratuvchi shtrix chiziladi -- «radius yoyga necha marta yotdi» KO'RINADI.
  // Bu yerda burchak UZUNLIK bilan o'lchanadi, koordinata bilan emas.
  arc = null,
  // Uzunligi radiusga teng VATAR (0 dan). Yoy bilan yonma-yon turadi va
  // ular boshqa nuqtada tugaydi: vatar 60°, yoy esa 57° da (З1 ni yopadi).
  unitChord = false,
  // Ko'pburchak: berilgan burchaklarni TO'G'RI kesmalar bilan tutashtiradi.
  // Vatarlarni yotqizganda oltitasi aylanani AYNAN yopadi (muntazam oltiburchak),
  // yoylarni yotqizganda esa yopmaydi -- farq shu ikki rasmda ko'rinadi.
  poly = [],
}) {
  const t = useT()
  const ref = useRef(null)
  const size = sizeIn
  const cx = size / 2
  const cy = size / 2
  const R = size * 0.42
  const shown = useTweenAngle(angle === null || angle === undefined ? 0 : angle, tween ? 620 : 0)
  const at = angle === null || angle === undefined ? angle : (tween ? shown : angle)

  const px = (x, y) => [cx + R * x, cy - R * y]
  const ptOf = (deg) => px(Math.cos(rad(deg)), Math.sin(rad(deg)))

  // Yoy yo'li. `sweep = 0` -- SVG da y teskari, shuning uchun soat miliga
  // QARSHI yo'nalish (musbat, darslik str. 133) shu bayroq bilan chiqadi.
  // To'liq aylanani bitta `A` bilan chizib bo'lmaydi (boshi oxiriga tegib
  // ketadi va yoy YO'QOLADI) -- shuning uchun ikkiga bo'linadi.
  const arcPath = (toDeg) => {
    const d = Math.min(359.99, Math.max(0, toDeg))
    if (d <= 180) {
      const [x2, y2] = ptOf(d)
      return `M ${cx + R} ${cy} A ${R} ${R} 0 0 0 ${x2} ${y2}`
    }
    const [mx, my] = ptOf(180)
    const [x2, y2] = ptOf(d)
    return `M ${cx + R} ${cy} A ${R} ${R} 0 0 0 ${mx} ${my} A ${R} ${R} 0 0 0 ${x2} ${y2}`
  }
  const DEG_PER_RAD = 180 / Math.PI

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
  const [ax, ay] = has ? ptOf(at) : [cx, cy]
  const [ex, ey] = has ? exactOf(angle) : ['', '']
  const radLabel = has ? radOf(angle) : null
  const [gx, gy] = ghost ? px(ghost.x, ghost.y) : [0, 0]
  // Nuqta o'lchami CHIZMAGA bog'liq: 140 px li aylanada qotib qolgan 6.5 px
  // juda yo'g'on, 500 px da esa juda mayda ko'rinardi.
  const rDot = Math.max(4, size * 0.025)
  const rMark = Math.max(3.2, size * 0.019)
  const vFs = Math.max(11, Math.round(size * 0.053))
  // Jonli hisoblagich: kvadratlar QO'SHILUVCHILARI bilan ko'rsatiladi, aks
  // holda «hisoblagichga qara» degan gap bo'sh qoladi (metodist, 2026-08-07).
  const cv = ghost ? ghost.x : (has ? Math.cos(rad(angle)) : 0)
  const sv = ghost ? ghost.y : (has ? Math.sin(rad(angle)) : 0)
  const c2 = round2(cv * cv)
  const s2 = round2(sv * sv)
  const sum = round2(c2 + s2)
  const dec = (v) => v.toFixed(2).replace('.', ',')
  const [sx, sy] = start !== null && start !== undefined ? ptOf(start) : [cx, cy]

  return (
    <div className="g10-circle-wrap">
      <svg
        ref={ref}
        className={'g10-circle' + (onAngle && !locked ? '' : ' g10-circle-locked')}
        width={size}
        height={size}
        style={{ maxWidth: size, maxHeight: size }}
        preserveAspectRatio="xMidYMid meet"
        viewBox={'0 0 ' + size + ' ' + size}
        onPointerDown={pick}
        onPointerMove={(e) => { if (e.buttons === 1) pick(e) }}
        role="img"
      >
        <line x1={cx - R * 1.15} y1={cy} x2={cx + R * 1.15} y2={cy} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
        <line x1={cx} y1={cy + R * 1.15} x2={cx} y2={cy - R * 1.15} stroke="rgba(23,26,29,.28)" strokeWidth="1" />

        <circle
          cx={cx} cy={cy} r={R} fill="none"
          stroke={!locked && onAngle ? T.accent : T.ink3}
          strokeWidth="1.6"
          opacity={!locked && onAngle ? 0.55 : 1}
        />
        {/* Aylana bosiladigan joy ekanini KO'RSATADI. */}
        {!locked && onAngle ? (
          <circle className="g10-hotring" cx={cx} cy={cy} r={R} fill="none" stroke={T.accent} strokeWidth="6" opacity=".18" />
        ) : null}

        {/* YOY: burchakning UZUNLIK o'lchovi. Aylananing ustiga yo'g'onroq
            chiziq bilan yotadi, shuning uchun «qaysi qismi» degan savol
            tug'ilmaydi. Radius chegaralari shtrix bilan: nechta radius
            yotgani sanaladi, aytilmaydi. */}
        {arc && arc.to > 0 ? (
          <g>
            <path d={arcPath(arc.to)} fill="none" stroke={T.accent} strokeWidth="4.4" strokeLinecap="round" opacity=".9" />
            {arc.laid
              ? Array.from({ length: arc.laid }, (unused, i) => (i + 1) * DEG_PER_RAD)
                .filter((d) => d <= arc.to + 0.5)
                .map((d) => {
                  const [x1, y1] = px(Math.cos(rad(d)) * 0.93, Math.sin(rad(d)) * 0.93)
                  const [x2, y2] = px(Math.cos(rad(d)) * 1.07, Math.sin(rad(d)) * 1.07)
                  return <line key={'lr' + d} x1={x1} y1={y1} x2={x2} y2={y2} stroke={T.ink} strokeWidth="1.8" opacity=".8" />
                })
              : null}
            {/* Boshlanish nuqtasi: nolda ham shtrix turadi, aks holda birinchi
                yoyning qayerdan boshlanganini ko'rsatib bo'lmaydi. */}
            <line x1={cx + R * 0.93} y1={cy} x2={cx + R * 1.07} y2={cy} stroke={T.ink} strokeWidth="1.8" opacity=".8" />
          </g>
        ) : null}

        {/* Yotqizilgan VATARLAR: to'g'ri kesmalar zanjiri. */}
        {poly.length > 1 ? (
          <g>
            {poly.slice(1).map((d, i) => {
              const [x1, y1] = ptOf(poly[i])
              const [x2, y2] = ptOf(d)
              return <line key={'pl' + d} x1={x1} y1={y1} x2={x2} y2={y2} stroke={T.graph} strokeWidth="3.2" strokeLinecap="round" />
            })}
            {poly.map((d) => {
              const [x1, y1] = ptOf(d)
              return <circle key={'pv' + d} cx={x1} cy={y1} r={rMark} fill={T.graph} />
            })}
          </g>
        ) : null}

        {/* VATAR uzunligi radiusga teng: to'g'ri chiziq 60° da tugaydi,
            yoy esa 57° da. Ikki nuqta orasidagi TIRQISH ko'rinadi -- shu
            farq uchun bu ikkisi bir vaqtda chiziladi. */}
        {unitChord ? (
          <g>
            <line
              x1={cx + R} y1={cy}
              x2={ptOf(60)[0]} y2={ptOf(60)[1]}
              stroke={T.graph} strokeWidth="2.4" strokeDasharray="5 4"
            />
            <circle cx={ptOf(60)[0]} cy={ptOf(60)[1]} r={rMark} fill={T.graph} />
          </g>
        ) : null}

        {/* Shtrixlar 15° da, RAQAMSIZ: nishon bor, javob yo'q. Halqadan
            TASHQARIDA chiziladi, aks holda ular ko'rinmay qolardi. */}
        {ticks ? (
          <g>
            {Array.from({ length: 24 }, (unused, i) => i * 15).map((d) => {
              const big = d % 90 === 0
              const [x1, y1] = px(Math.cos(rad(d)) * 1.02, Math.sin(rad(d)) * 1.02)
              const [x2, y2] = px(Math.cos(rad(d)) * (big ? 1.09 : 1.06), Math.sin(rad(d)) * (big ? 1.09 : 1.06))
              return <line key={d} x1={x1} y1={y1} x2={x2} y2={y2} stroke={T.ink2} strokeWidth={big ? 1.6 : 1} opacity={big ? 0.7 : 0.4} />
            })}
          </g>
        ) : null}

        {/* O'qlar podpisi: qayerda kosinus, qayerda sinus (metodist P1).
            KICHIK chizmada podpis tushadi: 132 px dan past bo'lganda u belgi
            yorlig'i ustiga chiqadi va ikkisi ham o'qilmay qoladi. Kichik
            chizma -- faqat YORDAMCHI isbot (12-slayd), ishchi yuza emas. */}
        {axes && size >= 132 ? (
          <g
            fontFamily={MATH_FONT} fontSize={Math.max(11, Math.round(size * 0.05))} fontWeight="700"
            fill={T.ink3} stroke={T.bg} strokeWidth={Math.max(3, size * 0.014)} paintOrder="stroke"
          >
            <text x={cx + R * 0.97} y={cy + Math.max(17, R * 0.26)} textAnchor="end">{CUI.axisX}</text>
            <text x={cx + Math.max(10, R * 0.09)} y={cy - R * 0.92} textAnchor="start">{CUI.axisY}</text>
            {meaning ? (
              <g
                fontSize={Math.max(11, Math.round(size * 0.038))} fontWeight="600" fill={T.ink3} opacity=".85"
                stroke={T.bg} strokeWidth={Math.max(3, size * 0.012)} paintOrder="stroke"
              >
                <text x={cx + R * 0.97} y={cy + Math.max(17, R * 0.26) + Math.max(13, size * 0.052)} textAnchor="end">{t(CUI.meanX)}</text>
                <text x={cx + Math.max(10, R * 0.09)} y={cy - R * 0.92 + Math.max(13, size * 0.052)} textAnchor="start">{t(CUI.meanY)}</text>
              </g>
            ) : null}
          </g>
        ) : null}

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
            {chord.dots === false ? null : [1, -1].map((sgn) => {
              const c = sgn * Math.sqrt(Math.max(0, 1 - chord.y * chord.y))
              const [hx, hy] = px(c, chord.y)
              return <circle key={sgn} cx={hx} cy={hy} r={rMark * 1.15} fill={T.graph} />
            })}
          </g>
        ) : null}

        {marks.map((m) => {
          const [mx, my] = ptOf(m.deg)
          // `tone` MA'NO nomi bilan beriladi ('graph', 'accent', 'ink3'), rangni
          // asbob tanlaydi. Dars faylida faqat ma'lumot bo'lishi kerak (etalon
          // §5.3): palitraga murojaat qilgan dars fayli statik tekshiruvda
          // o'qilmaydi ham. Tayyor rang ham qabul qilinadi -- eski chaqiriqlar uchun.
          const tone = (typeof m.tone === 'string' && T[m.tone]) || m.tone || T.ink3
          return (
            <g key={'m' + m.deg + (m.label || '')}>
              <line x1={cx} y1={cy} x2={mx} y2={my} stroke={tone} strokeWidth="1.1" strokeDasharray="3 3" opacity=".65" />
              <circle cx={mx} cy={my} r={rMark} fill={tone} />
              {m.label ? (() => {
                // Yorliq KADRDAN CHIQMASLIGI kerak. Kichik chizmada (past
                // ekranda 12-slayd 102 px ga tushdi) chapdagi «120°» viewBox
                // dan chiqib, jimgina kesilardi -- diqqat: `overflow: hidden`
                // buni ko'rsatmaydi ham (metodist telefonda ko'rdi, 2026-08-11).
                const fsM = Math.max(11, Math.min(13, size * 0.075))
                const wide = String(m.label).length * fsM * 0.58
                const out = mx >= cx
                let anchor = out ? 'start' : 'end'
                let lx = mx + (out ? 9 : -9)
                if (!out && lx - wide < 2) { anchor = 'start'; lx = mx + 7 }
                if (out && lx + wide > size - 2) { anchor = 'end'; lx = mx - 7 }
                const ly = Math.max(fsM, Math.min(size - 3, my + (my > cy ? 14 : -8)))
                return (
                  <text
                    x={lx} y={ly}
                    fontFamily={MATH_FONT} fontSize={fsM} fontWeight="700"
                    fill={tone} textAnchor={anchor}
                    stroke={T.bg} strokeWidth={Math.max(2.4, size * 0.012)} paintOrder="stroke"
                  >
                    {m.label}
                  </text>
                )
              })() : null}
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
                <text x={(ax + cx) / 2} y={cy + (ay > cy ? -7 : 16)} fontFamily={MATH_FONT} fontSize={vFs} fontWeight="700" fill={T.accent} stroke={T.bg} strokeWidth={Math.max(3, size * 0.013)} paintOrder="stroke" textAnchor="middle">{ex}</text>
                <text x={ax + (ax >= cx ? 8 : -8)} y={(ay + cy) / 2} fontFamily={MATH_FONT} fontSize={vFs} fontWeight="700" fill={T.accent} stroke={T.bg} strokeWidth={Math.max(3, size * 0.013)} paintOrder="stroke" textAnchor={ax >= cx ? 'start' : 'end'}>{ey}</text>
              </g>
            ) : null}
            <circle cx={ax} cy={ay} r={rDot} fill={T.accent} />
          </g>
        ) : null}

        {/* Nuqta hali qo'yilmagan: KO'RINADIGAN marker + sanoq yo'nalishi. */}
        {!has && start !== null && start !== undefined ? (
          <g>
            <ArcArrow cx={cx} cy={cy} r={R * 0.42} from={4} to={62} size={size} tone={T.ink3} />
            <circle className="g10-grab" cx={sx} cy={sy} r={rDot * 1.35} fill="none" stroke={T.accent} strokeWidth="2.2" />
            <circle cx={sx} cy={sy} r={rDot * 0.62} fill={T.accent} />
          </g>
        ) : null}

        {ghost ? (
          <g className="g10-pop">
            <line x1={cx} y1={cy} x2={gx} y2={gy} stroke={T.tip} strokeWidth="1.6" strokeDasharray="5 4" />
            {/* Proyeksiyalar: taxmin KOORDINATA juftligi ekani ko'rinsin.
                4-ekranda shu narsa isbot bo'ladi: (1/2; 1/2) nuqtasi
                bissektrisada turadi, lekin aylanaga YETMAYDI. */}
            {ghost.drop ? (
              <g stroke={T.tip} strokeWidth="1.2" strokeDasharray="3 3" opacity=".8">
                <line x1={gx} y1={gy} x2={gx} y2={cy} />
                <line x1={gx} y1={gy} x2={cx} y2={gy} />
              </g>
            ) : null}
            <circle cx={gx} cy={gy} r={rDot} fill="none" stroke={T.tip} strokeWidth="2.4" />
            {ghost.label ? (
              <text
                x={gx + rDot * 1.7} y={gy - rDot * 1.1}
                fontFamily={MATH_FONT} fontSize={vFs} fontWeight="700" fill={T.tip}
                stroke={T.bg} strokeWidth={Math.max(3, size * 0.013)} paintOrder="stroke"
                textAnchor="start"
              >
                {typeof ghost.label === 'string' ? ghost.label : t(ghost.label)}
              </text>
            ) : null}
          </g>
        ) : null}
      </svg>

    </div>
  )
}

// ============================================================
// MAZMUNIY KO'PRIKLAR (metodist qarori 2026-08-07). Uchta teshik:
//   1) 8-9-sinf ta'rifi bilan bog'lanmagan  -> WheelBridge
//   2) nega aylana kerakligi ko'rsatilmagan -> RightTriangleLimit
//   3) √3/2 va 1/2 qayerdan kelgani yo'q    -> EquiFig
// Hayotiy kontekst (darslik 133-bet: davriy jarayonlar) -> WheelBridge ning
// birinchi qadami: charx.
// ============================================================

// Charx: kabinaning MARKAZDAN balandligi = burilish burchagining sinusi.
// ============================================================
// CHARXDAN UCHBURCHAKKA -- BITTA chizma, to'rt qadam.
//
// Avval ikkita alohida komponent bor edi va kadr almashganda biri o'chib,
// ikkinchisi yonardi. O'quvchi uchun bu IKKI BOSHQA rasm: «charx qayoqqa
// ketdi, uchburchak qayerdan keldi?» Endi hech narsa almashmaydi -- charxning
// o'zida ALLAQACHON bor uchta chiziq (radius, balandlik, markaz sathi)
// joyida qoladi, obod bilan tayanch esa so'nadi. Uchburchak charxdan
// «qirqib olinadi», ya'ni ko'prik ko'z bilan ko'rinadi.
//
// step 0 -- charx aylanmoqda: radius = c, balandlik = a
// step 1 -- charx so'nadi, uchburchak qoladi (asos, to'g'ri burchak, yorliqlar)
// step 2 -- gipotenuza birga qadar siqiladi, yorliq c -> 1
// step 3 -- o'sha markaz atrofida birlik aylana chiziladi
// step 4 -- diqqat asosga: b akssentga bo'yaladi
// step 5 -- ikki son bitta juftlikka yig'iladi: (b; a)
//
// 3-EKRAN uchun yana ikki qadam. Avval u yerda chizma step=5 da MUZLAB
// turardi: ovoz «katetlar kvadratlarining yig'indisi» deyardi, ekranda esa
// hech narsa o'zgarmasdi -- chiqarish faqat o'ng ustunda yashardi.
// step 6 -- kamera ortga chekinadi, katetlar va gipotenuza ustiga KVADRATLAR
//           quriladi: b², a², c². Pifagor ekranda ko'rinadi, so'zda emas.
// step 7 -- o'rniga qo'yish: yorliqlar cos²α, sin²α va 1² ga aylanadi, ya'ni
//           ayniyat chizmadan o'qiladi.
// ============================================================
export function WheelBridge({ size = 268, step = 0 }) {
  const t = useT()
  // Charx TURGAN joyi: u qimirlamaydi, faqat so'nadi.
  const wx = size / 2
  const wy = size * 0.46
  const RB = size * 0.34
  // Kamera. Uchta holat: charx (markazda), uchburchak (kattalashgan, pastki
  // chapga suriladi), birlik aylana (yana markazda). Uchburchak o'z kadrini
  // TO'LDIRISHI kerak -- aks holda charxdan keyin u kichkina bo'lib qoladi.
  const CAM = [
    { x: 0.50, y: 0.46, r: 0.34 },
    { x: 0.30, y: 0.68, r: 0.56 },
    { x: 0.50, y: 0.50, r: 0.34 },
    { x: 0.50, y: 0.50, r: 0.34 },
    { x: 0.50, y: 0.50, r: 0.34 },
    { x: 0.50, y: 0.50, r: 0.34 },
    // 6-7: kvadratlar kadrga SIG'ISHI kerak, shuning uchun kamera ortga
    // chekinadi va markaz chapga-pastga suriladi (kvadratlar o'ngga va
    // yuqoriga-chapga o'sadi). r ni kichraytirish mumkin emas: kvadrat ichidagi
    // `cos²α` yorlig'i tomonidan KENG bo'lib qolardi.
    { x: 0.45, y: 0.55, r: 0.30 },
    { x: 0.45, y: 0.55, r: 0.30 },
  ]
  const cam = CAM[Math.min(step, CAM.length - 1)]
  const cx = useTween(size * cam.x, 820)
  const cy = useTween(size * cam.y, 820)
  const len = useTween(size * cam.r, 820)
  // Charx faqat 0-qadamda aylanadi; keyin hozirgi burchakdan 52° ga YUMSHOQ
  // buriladi -- shu sababli to'xtash sakrash bo'lib ko'rinmaydi.
  const spin = useSpin(step === 0 ? 24 : 0, 55)
  const live = ((spin % 360) + 360) % 360
  const at = useTweenAngle(step === 0 ? live : 52, step === 0 ? 0 : 720)
  // Obod kamera qo'zg'algunga qadar so'nib ulgursin.
  const wheel = useTween(step >= 1 ? 0 : 1, 420)
  const tri = useTween(step >= 1 ? 1 : 0, 620)
  const circ = useTween(step >= 3 ? 1 : 0, 640)
  // 4-qadam: diqqat gorizontalga ko'chadi. Radius kulrangga tushadi -- uzunligi
  // allaqachon ma'lum (bir), endi gap KATETLARDA.
  const cosf = useTween(step >= 4 ? 1 : 0, 560)
  // 5-qadam: ikkala son bir juftlikka yig'iladi.
  const pair = useTween(step >= 5 ? 1 : 0, 560)
  // 6-qadam: Pifagor kvadratlari. 7-qadam: yorliqlarda o'rniga qo'yish.
  const sqr = useTween(step >= 6 ? 1 : 0, 620)
  const subst = step >= 7

  const px = cx + len * Math.cos(rad(at))
  const py = cy - len * Math.sin(rad(at))
  // Kvadratlarning uchlari CHIZMADAN olinadi (qo'lda yozilgan son yo'q):
  // b -- pastga, a -- o'ngga, c -- gipotenuzadan uchburchak TASHQARISIGA.
  const dhx = px - cx
  const dhy = py - cy
  const bSq = [[cx, cy], [px, cy], [px, cy + Math.abs(dhx)], [cx, cy + Math.abs(dhx)]]
  const aSq = [[px, cy], [px, py], [px + Math.abs(dhy), py], [px + Math.abs(dhy), cy]]
  const cSq = [[cx, cy], [px, py], [px + dhy, py - dhx], [cx + dhy, cy - dhx]]
  const poly = (pts) => pts.map((p) => p[0] + ',' + p[1]).join(' ')
  const mid = (pts) => [
    pts.reduce((s, p) => s + p[0], 0) / pts.length,
    pts.reduce((s, p) => s + p[1], 0) / pts.length,
  ]
  const fs = Math.max(11, Math.round(size * 0.05))
  // Kvadrat ichidagi yorliq kichikroq, lekin 11 px dan MAYDA emas.
  const fsq = Math.max(11, Math.round(fs * 0.86))
  const cw = Math.max(7, size * 0.034)
  const sq = Math.max(7, size * 0.035)
  const ground = wy + RB * 1.52
  const halo = { paintOrder: 'stroke', stroke: T.bg, strokeWidth: fs * 0.34, strokeLinejoin: 'round' }
  const cabin = (x, y, on) => (
    <g>
      <line x1={x} y1={y} x2={x} y2={y + cw * 0.5} stroke={on ? T.accent : T.ink3} strokeWidth={on ? 1.4 : 0.9} />
      <rect
        x={x - cw / 2} y={y + cw * 0.5} width={cw} height={cw * 0.78} rx={cw * 0.22}
        fill={on ? T.accent : T.paper} stroke={on ? T.accent : T.ink3} strokeWidth="1"
      />
    </g>
  )
  const cLabel = step >= 2 ? '1' : 'c'

  return (
    <svg width={size} height={size} viewBox={'0 0 ' + size + ' ' + size} preserveAspectRatio="xMidYMid meet" role="img">
      {/* --- CHARX: so'nadi, lekin uchburchakni joyida qoldiradi --- */}
      {wheel > 0.01 ? (
        <g opacity={wheel}>
          <line x1={wx} y1={wy} x2={wx - RB * 0.58} y2={ground} stroke={T.ink3} strokeWidth="3" strokeLinecap="round" />
          <line x1={wx} y1={wy} x2={wx + RB * 0.58} y2={ground} stroke={T.ink3} strokeWidth="3" strokeLinecap="round" />
          <line x1={wx - RB * 0.95} y1={ground} x2={wx + RB * 0.95} y2={ground} stroke={T.ink2} strokeWidth="2.4" strokeLinecap="round" />
          <circle cx={wx} cy={wy} r={RB} fill="none" stroke={T.ink3} strokeWidth="2" />
          {Array.from({ length: 8 }, (unused, k) => k * 45).map((d) => {
            const a = d + at
            const x = wx + RB * Math.cos(rad(a))
            const y = wy + -RB * Math.sin(rad(a))
            return (
              <g key={d}>
                <line x1={cx} y1={cy} x2={x} y2={y} stroke={T.ink3} strokeWidth=".8" opacity=".45" />
                {cabin(x, y, false)}
              </g>
            )
          })}
          {/* Markaz sathi: shu punktir keyin uchburchakning ASOSI bo'ladi */}
          <line
            x1={wx - RB * 1.3} y1={wy} x2={wx + RB * 1.3} y2={wy}
            stroke="rgba(23,26,29,.32)" strokeWidth="1" strokeDasharray="5 4"
          />
          <ArcArrow cx={wx} cy={wy} r={RB * 0.4} from={4} to={Math.max(14, at) - 6} size={size} tone={T.accent} />
        </g>
      ) : null}

      {/* --- PIFAGOR KVADRATLARI (3-ekran) ---
          Ovoz «katetlar kvadratlarining yig'indisi» deganda ekranda AYNAN shu
          yig'indi paydo bo'ladi. Chiziqlardan pastda turadi: chizma o'zi
          o'zgarmaydi, unga qo'shiladi. */}
      {sqr > 0.01 ? (
        <g opacity={sqr}>
          <polygon points={poly(cSq)} fill="rgba(23,26,29,.05)" stroke={T.ink3} strokeWidth="1.2" />
          <polygon points={poly(bSq)} fill="rgba(201,84,44,.12)" stroke={T.accent} strokeWidth="1.2" />
          <polygon points={poly(aSq)} fill="rgba(23,108,112,.12)" stroke={T.graph} strokeWidth="1.2" />
          <g fontFamily={MATH_FONT} fontSize={fsq} fontWeight="700">
            {/* Gipotenuza kvadratining yorlig'i markazdan TASHQARIGA suriladi:
                markazda u nuqta va punktir bilan yonma-yon tushib qolardi. */}
            <text
              key={subst ? 'c1' : 'c0'} className={subst ? 'g10-valpop' : undefined}
              x={mid(cSq)[0] + dhy * 0.24} y={mid(cSq)[1] - dhx * 0.24 + fsq * 0.34}
              fill={T.ink2} textAnchor="middle" {...halo}
            >
              {subst ? '1²' : 'c²'}
            </text>
            <text
              key={subst ? 'b1' : 'b0'} className={subst ? 'g10-valpop' : undefined}
              x={mid(bSq)[0]} y={mid(bSq)[1] + fsq * 0.34} fill={T.accent} textAnchor="middle" {...halo}
            >
              {subst ? 'cos²α' : 'b²'}
            </text>
            <text
              key={subst ? 'a1' : 'a0'} className={subst ? 'g10-valpop' : undefined}
              x={mid(aSq)[0]} y={mid(aSq)[1] + fsq * 0.34} fill={T.graph} textAnchor="middle" {...halo}
            >
              {subst ? 'sin²α' : 'a²'}
            </text>
          </g>
        </g>
      ) : null}

      {/* --- BIRLIK AYLANA: o'sha markaz, o'sha radius --- */}
      {circ > 0.01 ? (
        <g opacity={circ}>
          <circle cx={cx} cy={cy} r={len} fill="none" stroke={T.ink3} strokeWidth="1.6" />
          <line x1={cx - len * 1.25} y1={cy} x2={cx + len * 1.25} y2={cy} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
          <line x1={cx} y1={cy - len * 1.25} x2={cx} y2={cy + len * 1.25} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
        </g>
      ) : null}

      {/* --- UCHBURCHAK: asos punktirdan «qattiqlashadi» --- */}
      {tri > 0.01 ? (
        <g opacity={tri}>
          <line x1={cx} y1={cy} x2={px} y2={cy} stroke={T.ink3} strokeWidth="1.8" />
          {cosf > 0.01 ? (
            <line x1={cx} y1={cy} x2={px} y2={cy} stroke={T.accent} strokeWidth="2.6" opacity={cosf} />
          ) : null}
          <rect x={px - (px >= cx ? sq : 0)} y={cy - sq} width={sq} height={sq} fill="none" stroke={T.ink3} strokeWidth="1" />
          <path
            d={'M ' + (cx + len * 0.3) + ' ' + cy + ' A ' + (len * 0.3) + ' ' + (len * 0.3)
              + ' 0 0 0 ' + (cx + len * 0.3 * Math.cos(rad(at))) + ' ' + (cy - len * 0.3 * Math.sin(rad(at)))}
            fill="none" stroke={T.ink2} strokeWidth="1.2"
          />
        </g>
      ) : null}

      {/* --- HAR QADAMDA TURADIGAN UCH CHIZIQ --- */}
      <line x1={cx} y1={cy} x2={px} y2={py} stroke={T.ink3} strokeWidth="1.6" />
      <line x1={cx} y1={cy} x2={px} y2={py} stroke={T.accent} strokeWidth="2.6" opacity={1 - cosf} />
      <line x1={px} y1={py} x2={px} y2={cy} stroke={T.graph} strokeWidth="2.6" />
      <circle cx={cx} cy={cy} r={Math.max(3, size * 0.016)} fill={T.ink3} />
      {wheel > 0.01 ? <g opacity={wheel}>{cabin(px, py, true)}</g> : null}
      {tri > 0.01 ? <circle cx={px} cy={py} r={Math.max(4, size * 0.023)} fill={T.accent} opacity={tri} /> : null}

      {/* --- JUFTLIK: balandlik o'qqa ko'chiriladi, ikki son bir yozuvga --- */}
      {pair > 0.01 ? (
        <g opacity={pair}>
          <line x1={px} y1={py} x2={cx} y2={py} stroke={T.graph} strokeWidth="1.2" strokeDasharray="4 4" />
          <line x1={cx - sq * 0.4} y1={py} x2={cx + sq * 0.4} y2={py} stroke={T.graph} strokeWidth="2.2" />
          <line x1={px} y1={cy - sq * 0.4} x2={px} y2={cy + sq * 0.4} stroke={T.accent} strokeWidth="2.2" />
        </g>
      ) : null}

      {/* --- YORLIQLAR: «balandlik» yorlig'i «a» ga AYLANADI --- */}
      <g fontFamily={MATH_FONT} fontSize={fs} fontWeight="700">
        {wheel > 0.01 ? (
          <text
            x={px + cw * 0.9} y={(py + cy) / 2 + fs * 0.35}
            fill={T.graph} textAnchor="start" opacity={wheel} {...halo}
          >
            {t(CUI.meanY)}
          </text>
        ) : null}
        {wheel > 0.01 ? (
          <text
            x={wx + RB * 0.52 * Math.cos(rad(at / 2))} y={wy - RB * 0.52 * Math.sin(rad(at / 2)) + fs * 0.35}
            fill={T.accent} textAnchor="middle" opacity={wheel} {...halo}
          >
            α
          </text>
        ) : null}
        {tri > 0.01 ? (
          <g opacity={tri}>
            <text x={cx + len * 0.38} y={cy - 7} fill={T.ink2} textAnchor="middle" {...halo}>α</text>
            {/* Kvadratlar chiqqanda katet yorlig'i O'Z kvadratiga ko'chadi:
                ekranda bitta `a` va bitta `a²` bo'ladi, ikkitasi bir joyda
                to'planmaydi. */}
            <text x={px + 9} y={(py + cy) / 2 + fs * 0.35} fill={T.graph} textAnchor="start" opacity={1 - sqr} {...halo}>a</text>
            <text x={(cx + px) / 2} y={cy + fs + 2} fill={T.ink3} textAnchor="middle" opacity={(1 - cosf) * (1 - sqr)} {...halo}>b</text>
            {cosf > 0.01 ? (
              <text x={(cx + px) / 2} y={cy + fs + 2} fill={T.accent} textAnchor="middle" opacity={cosf * (1 - sqr)} {...halo}>b</text>
            ) : null}
            {pair > 0.01 ? (
              <text
                x={px} y={py - fs * 0.75} fill={T.ink} textAnchor="middle" opacity={pair * (1 - sqr)}
                fontSize={Math.max(11, fs * 0.92)} {...halo}
              >
                (b; a)
              </text>
            ) : null}
            {/* Shaffoflik GURUHDA turishi kerak: `g10-valpop` animatsiyasi
                `opacity: 1` bilan tugaydi va elementdagi atributni bosib
                ketadi (CSS animatsiyasi prezentatsiya atributidan kuchli). */}
            <g opacity={1 - sqr}>
              <text
                key={cLabel} className="g10-valpop"
                x={(cx + px) / 2 - fs * 0.8} y={(cy + py) / 2 - 6} fill={T.accent} textAnchor="end" {...halo}
              >
                {cLabel}
              </text>
            </g>
          </g>
        ) : null}
      </g>
    </svg>
  )
}

// Ko'prik: sin α = a / c  ->  c = 1  ->  sin α = a.
// step 0 -- uchburchak, 1 -- gipotenuza birga aylanadi, 2 -- aylana chiziladi.
// Nega aylana kerak: to'g'ri burchakli uchburchakda o'tkir burchak 90° dan
// kichik, 120° u yerga SIG'MAYDI. Aylanada esa nuqta shunchaki uzoqroq boradi.
export function RightTriangleLimit({ size = 268, step = 0 }) {
  const cx = size / 2
  const cy = size / 2
  const R = size * 0.32
  const fs = Math.max(11, Math.round(size * 0.048))
  const px2 = (d, k) => [cx + R * k * Math.cos(rad(d)), cy - R * k * Math.sin(rad(d))]
  const [tx, ty] = px2(52, 1)
  const [wx, wy] = px2(120, 1)
  return (
    <svg width={size} height={size} viewBox={'0 0 ' + size + ' ' + size} preserveAspectRatio="xMidYMid meet" role="img">
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={T.ink3} strokeWidth="1.4" opacity={step >= 1 ? 1 : 0.25} />
      <line x1={cx - R * 1.2} y1={cy} x2={cx + R * 1.2} y2={cy} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
      <line x1={cx} y1={cy - R * 1.2} x2={cx} y2={cy + R * 1.2} stroke="rgba(23,26,29,.28)" strokeWidth="1" />

      {/* O'tkir burchak: uchburchak ishlaydi */}
      <g opacity={step >= 1 ? 0.35 : 1}>
        <line x1={cx} y1={cy} x2={tx} y2={cy} stroke={T.ink3} strokeWidth="1.6" />
        <line x1={tx} y1={cy} x2={tx} y2={ty} stroke={T.graph} strokeWidth="2" />
        <line x1={cx} y1={cy} x2={tx} y2={ty} stroke={T.accent} strokeWidth="2" />
        <rect
          x={tx - Math.max(6, size * 0.03)} y={cy - Math.max(6, size * 0.03)}
          width={Math.max(6, size * 0.03)} height={Math.max(6, size * 0.03)}
          fill="none" stroke={T.ink3} strokeWidth="1"
        />
        <circle cx={tx} cy={ty} r={Math.max(4, size * 0.022)} fill={T.accent} />
      </g>

      {/* 120°: uchburchak yo'q, nuqta esa bor */}
      {step >= 1 ? (
        <g>
          <path
            d={'M ' + (cx + R * 0.42) + ' ' + cy + ' A ' + (R * 0.42) + ' ' + (R * 0.42) + ' 0 0 0 ' + (cx + R * 0.42 * Math.cos(rad(120))) + ' ' + (cy - R * 0.42 * Math.sin(rad(120)))}
            fill="none" stroke={T.tip} strokeWidth="1.6"
          />
          <line x1={cx} y1={cy} x2={wx} y2={wy} stroke={T.accent} strokeWidth="2.4" />
          <line x1={wx} y1={wy} x2={wx} y2={cy} stroke={T.graph} strokeWidth="2" strokeDasharray="4 3" />
          <circle cx={wx} cy={wy} r={Math.max(4, size * 0.024)} fill={T.accent} />
          <text x={cx + R * 0.5} y={cy - R * 0.3} fontFamily={MATH_FONT} fontSize={fs} fontWeight="700" fill={T.tip} textAnchor="middle">120°</text>
        </g>
      ) : null}
    </svg>
  )
}

// √3/2 va 1/2 qayerdan: tomoni 1 bo'lgan teng tomonli uchburchak balandlik
// bilan ikkiga bo'linadi.
//
// step 0 -- QURILISH: tomoni 1, balandlik `h`, asos teng ikkiga bo'lingani
//           shtrixlar bilan belgilangan. `√3/2` ekranda YO'Q.
// step 1 -- XULOSA: Pifagordan keyin `h` yorlig'i `√3/2` ga aylanadi.
// Nega shunday: avval chizmada `√3/2` birinchi kadrdan turardi, ya'ni chiqarish
// allaqachon ekranda yozilganini isbotlardi (metodist, 2026-08-11).
export function EquiFig({ size = 268, step = 0 }) {
  const cx = size / 2
  const cy = size / 2
  const side = size * 0.5
  const h = (side * Math.sqrt(3)) / 2
  const ax = cx
  const ay = cy - h / 2
  const bx = cx - side / 2
  const by = cy + h / 2
  const dx = cx + side / 2
  const fs = Math.max(11, Math.round(size * 0.05))
  const sq = Math.max(7, size * 0.032)
  return (
    <svg width={size} height={size} viewBox={'0 0 ' + size + ' ' + size} preserveAspectRatio="xMidYMid meet" role="img">
      {/* Ishlatiladigan YARIM ajratib ko'rsatiladi: hamma yorliq aynan shunga
          tegishli. Avval «1» chap tomonda, «1/2» esa o'ngda turardi -- ular
          har xil yarmiga tegishli bo'lib, chizma yolg'on gapirardi. */}
      <polygon points={ax + ',' + ay + ' ' + ax + ',' + by + ' ' + dx + ',' + by} fill={T.accentSoft || 'rgba(201,84,44,.10)'} stroke="none" />
      <polygon points={ax + ',' + ay + ' ' + bx + ',' + by + ' ' + dx + ',' + by} fill="none" stroke={T.ink3} strokeWidth="1.8" />
      <line x1={ax} y1={ay} x2={ax} y2={by} stroke={T.graph} strokeWidth="2.4" />
      <rect x={ax} y={by - sq} width={sq} height={sq} fill="none" stroke={T.ink3} strokeWidth="1" />
      <circle cx={ax} cy={ay} r={Math.max(3, size * 0.016)} fill={T.ink3} />
      <circle cx={dx} cy={by} r={Math.max(3, size * 0.016)} fill={T.ink3} />

      {/* 30° -- balandlikning O'NG tomonidagi burchak, 60° -- o'ng pastdagi. */}
      <path
        d={'M ' + ax + ' ' + (ay + h * 0.26) + ' A ' + (h * 0.26) + ' ' + (h * 0.26) + ' 0 0 0 ' + (ax + h * 0.26 * Math.sin(rad(30))) + ' ' + (ay + h * 0.26 * Math.cos(rad(30)))}
        fill="none" stroke={T.ink2} strokeWidth="1.1"
      />
      <path
        d={'M ' + (dx - side * 0.22) + ' ' + by + ' A ' + (side * 0.22) + ' ' + (side * 0.22) + ' 0 0 1 ' + (dx - side * 0.22 * Math.cos(rad(60))) + ' ' + (by - side * 0.22 * Math.sin(rad(60)))}
        fill="none" stroke={T.ink2} strokeWidth="1.1"
      />

      {/* Asos teng ikkiga bo'lingani KO'RINADI: har yarmida bitta shtrix. */}
      <g stroke={T.ink2} strokeWidth="1.4" opacity=".8">
        <line x1={(bx + ax) / 2} y1={by - 4} x2={(bx + ax) / 2} y2={by + 4} />
        <line x1={(ax + dx) / 2} y1={by - 4} x2={(ax + dx) / 2} y2={by + 4} />
      </g>

      <g fontFamily={MATH_FONT} fontWeight="700">
        <text x={(ax + dx) / 2 + fs * 0.55} y={(ay + by) / 2 - 4} fontSize={fs} fill={T.accent} textAnchor="start">1</text>
        <text
          key={step >= 1 ? 'h1' : 'h0'} className={step >= 1 ? 'g10-valpop' : undefined}
          x={ax - 8} y={(ay + by) / 2} fontSize={fs} fill={step >= 1 ? T.ok : T.graph} textAnchor="end"
        >
          {step >= 1 ? '√3/2' : 'h'}
        </text>
        <text x={(bx + ax) / 2} y={by + fs + 3} fontSize={fs} fill={T.ink} textAnchor="middle">1/2</text>
        <text x={(ax + dx) / 2} y={by + fs + 3} fontSize={fs} fill={T.ink} textAnchor="middle">1/2</text>
        {/* Ko'paytiruvchi 10,5 px polini bosmasin: `fs` ning o'zi polda
            turganda `fs * 0.78` 8,6 px chiqadi. Shu xato 2-darsda tutildi
            (2026-08-13), bu yerda esa hozircha chizma katta bo'lgani uchun
            ko'rinmagan -- ya'ni kutib turgan xato edi. */}
        <text x={ax + fs * 0.5} y={ay + h * 0.34} fontSize={Math.max(11, fs * 0.78)} fill={T.ink2} textAnchor="start">30°</text>
        <text x={dx - side * 0.3} y={by - 8} fontSize={Math.max(11, fs * 0.78)} fill={T.ink2} textAnchor="middle">60°</text>
      </g>
    </svg>
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
      {!done ? <Cue kind="drag">{t(prompt)}</Cue> : null}
      <Scene
        fig={(
          <UnitCircle
            angle={angle}
            onAngle={put}
            values
            drop
            ticks
            start={angle === null ? 0 : null}
            tween={false}
          />
        )}
        note={(
          <div className="g10-side">
            {/* Burchak qatori bu ekranda YO'Q. Bu yerda savol «burchak qancha»
                emas: o'quvchi nuqtani yurgizadi va KVADRATLAR yig'indisiga
                qaraydi. Ortiqcha qator kompakt telefonda 40 px, va yakuniy
                holatda pastki qatorlar kesilardi. */}
            <Readout angle={angle} counter live hide={['angle']} />
            {/* Xulosa qatorlari FAQAT tekshirishdan keyin: aks holda javob
                harakatdan oldin ekranda turadi (metodist P0, 2026-08-07). */}
            {done ? notes.map((n, i) => <NoteLine key={i} i={i}>{typeof n === 'string' ? n : t(n)}</NoteLine>) : null}
            <Slot mh={56} className="g10-fb-sm">
              {/* Quti -- HARAKATGA javob. Birinchi harakatgacha u jim: nima
                  qilish kerakligi ishora qatorida yozilgan, ikki joyda
                  takrorlanmaydi (metodist 2026-08-11). */}
              <Feedback show={done || seen.length > 0} ok={done}>
                {done
                  ? t(okText)
                  : t(CUI.explore).replace('{n}', String(seen.length)).replace('{k}', String(need))}
              </Feedback>
            </Slot>
          </div>
        )}
      />
    </>
  )
}

// ============================================================
// RADIUSNI YOY BO'YLAB YOTQIZISH -- 1-darsning ASOSIY guvohi.
//
// O'quvchi radius uzunligidagi yoylarni birin-ketin qo'yadi va TO'LIQ
// aylanaga ularning oltitasi sig'ib, ustiga radiusdan qisqa bo'lak
// qolganini KO'RADI. Shu bilan `pi` son bo'lib qoladi: yarim aylana uch
// yarim radius, 360 emas. Dastur «noto'g'ri» deb yozmaydi -- u yoyni
// yotqizadi va sanoq o'zi ko'rinadi.
//
// Nishon: keyingi yoyning oxiri, ya'ni (yotganlar + 1) radian. Bosish
// aniqligi 22° -- yoy uzunligi 57°, ya'ni yarmidan kam.
// ============================================================
export function LayRadius({ prompt, need = 6, mode = 'arc', okText, notes, audio, onSolved }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [laid, setLaid] = useState(0)
  const [closed, setClosed] = useState(false)
  const [miss, setMiss] = useState(false)
  // Yoy rejimida qadam bir radian (57,3°), vatar rejimida esa AYNAN 60°:
  // uzunligi radiusga teng vatar muntazam oltiburchak tomonidir. Shuning
  // uchun vatarlar aylanani yopadi, yoylar esa yopmaydi -- 1-darsning
  // «vatar yoy emas» farqi shu ikki sanoqda ko'rinadi.
  const chord = mode === 'chord'
  const DEG = chord ? 60 : 180 / Math.PI
  const to = closed ? 359.99 : laid * DEG
  const restRad = chord ? 0 : round2(2 * Math.PI - need)
  // Vatar rejimida oltinchi vatar aylanani o'zi yopadi, qo'shimcha bosish
  // kerak emas: bu ayni farqning o'zi.
  const total = chord ? need : need + 1

  const gap = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b))

  const put = (deg) => {
    if (closed) return
    const target = laid < need ? (laid + 1) * DEG : 360
    if (gap(norm(deg), norm(target)) > 22) {
      setMiss(true)
      fx.wrong(CUI.layMiss)
      return
    }
    setMiss(false)
    const next = laid + 1
    if (next < total) {
      setLaid(Math.min(next, need))
      return
    }
    setLaid(need)
    setClosed(true)
    fx.right(okText)
    if (onSolved) onSolved({ correct: true })
  }

  return (
    <>
      {!closed ? <Cue kind="tap">{t(laid < need ? (prompt || CUI.layAsk) : CUI.layClose)}</Cue> : null}
      <Scene
        fig={(
          <UnitCircle
            angle={null}
            onAngle={put}
            arc={chord ? null : { to, laid: closed ? need : laid }}
            poly={chord ? Array.from({ length: laid + 1 }, (unused, i) => i * 60) : []}
            ticks
            start={laid === 0 ? 0 : null}
            tween={false}
          />
        )}
        note={(
          <div className="g10-side">
            {/* Tablo asbobning O'SHA tablosi: nomi qiymat USTIDA, o'lchamlari
                etalon §6.4 dagi shkala bo'yicha. Ko'rsatkich yo'q joyda tinch
                chiziqcha turadi, shkala esa qoladi -- «o'chiq asbob» ko'rinishi. */}
            <div className="g10-readout">
              <div className="g10-readout-body">
                <div className="g10-rd">
                  <span className="g10-rd-key">{t(chord ? CUI.laidChord : CUI.laid)}</span>
                  <span className="g10-rd-val">{laid || <i className="g10-rd-wait" aria-label="—" />}</span>
                </div>
                <div className="g10-rd">
                  <span className="g10-rd-key">{t(chord ? CUI.chainLen : CUI.arcLen)}</span>
                  <span className="g10-rd-val g10-rd-val-accent">{laid ? String(laid) + ',00' : <i className="g10-rd-wait" aria-label="—" />}</span>
                </div>
                {/* Qoldiq FAQAT aylana yopilgach: undan oldin u javobni berib qo'yardi. */}
                <div className="g10-rd g10-rd-sum">
                  <span className="g10-rd-key">{t(CUI.rest)}</span>
                  <span className="g10-rd-val g10-rd-val-sum">{closed ? String(restRad).replace('.', ',') : <i className="g10-rd-wait" aria-label="—" />}</span>
                </div>
              </div>
            </div>
            {closed && notes ? notes.map((n, i) => <NoteLine key={i} i={i}>{typeof n === 'string' ? n : t(n)}</NoteLine>) : null}
            <Slot mh={56} className="g10-fb-sm">
              <Feedback show={closed || miss} ok={closed}>
                {closed ? t(okText) : t(CUI.layMiss)}
              </Feedback>
            </Slot>
          </div>
        )}
      />
    </>
  )
}

// ============================================================
// IKKI AYLANA -- radianning radiusga BOG'LIQ EMASLIGI.
//
// Bitta va o'sha burchak ikki aylanada boshqa uzunlikdagi yoy qoldiradi,
// lekin `yoy / radius` nisbati JOYIDA turadi. O'quvchi radiusni ikki
// tomonga ham suradi; ekran yopiladi, qachonki nisbat qimirlamagani ikki
// chekkada ham ko'rilsa. Shu bilan «yoy uzunroq -- burchak kattaroq»
// tugaydi.
// ============================================================
// Chizmaning o'zi: o'lchamni `Scene` beradi (`cloneElement` bilan), foizda
// hisoblash MUMKIN EMAS -- flex ichida balandlik foizi hisoblanmaydi va SVG
// qutidan chiqib ketadi (etalon §5.2 dagi grabli).
function TwoCirclesFig({ size = 268, k = 0.62, angle = 57.3 }) {
  const cx = size / 2
  const cy = size / 2
  const R = size * 0.42
  const r = R * k
  const aRad = rad(angle)
  const pathOf = (rr) => {
    const x2 = cx + rr * Math.cos(aRad)
    const y2 = cy - rr * Math.sin(aRad)
    return `M ${cx + rr} ${cy} A ${rr} ${rr} 0 0 0 ${x2} ${y2}`
  }
  return (
    <div className="g10-circle-wrap">
      <svg
        className="g10-circle g10-circle-locked"
        width={size} height={size}
        style={{ maxWidth: size, maxHeight: size }}
        viewBox={'0 0 ' + size + ' ' + size}
        preserveAspectRatio="xMidYMid meet"
        role="img"
      >
        <line x1={cx - R * 1.12} y1={cy} x2={cx + R * 1.12} y2={cy} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={T.ink3} strokeWidth="1.4" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.graph} strokeWidth="1.4" />
        <line
          x1={cx} y1={cy}
          x2={cx + R * Math.cos(aRad)} y2={cy - R * Math.sin(aRad)}
          stroke={T.ink3} strokeWidth="1" strokeDasharray="3 3"
        />
        <path d={pathOf(R)} fill="none" stroke={T.accent} strokeWidth="4.2" strokeLinecap="round" />
        <path d={pathOf(r)} fill="none" stroke={T.graph} strokeWidth="4.2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export function ScaleCircles({ prompt, angle = 57.3, okText, notes, audio, onSolved }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [k, setK] = useState(0.62)
  const [seen, setSeen] = useState([])
  const [done, setDone] = useState(false)
  // Ekran O'ZI bir marta «nafas oladi»: radius kengayadi va qisqaradi, nisbat
  // esa joyida turadi. Shusiz o'quvchi polzunokni tortmaguncha ekran QOTIB
  // turardi, ovoz esa harakat haqida gapirardi (etalon §5.1).
  const [demo, setDemo] = useState(0)
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return undefined
    const steps = [0.9, 0.45, 0.62]
    const timers = steps.map((v, i) => setTimeout(() => setDemo(v), 900 + i * 1100))
    return () => timers.forEach(clearTimeout)
  }, [])
  // Qo'l bilan tortilgach demo TO'XTAYDI: o'quvchi boshqarganda ekran o'zi
  // qimirlamasligi kerak.
  const kShown = useTween(seen.length || done ? k : (demo || k), 700)
  const arcBig = round2(angle / (180 / Math.PI))
  const arcSmall = round2(arcBig * kShown)

  const move = (v) => {
    if (done) return
    setK(v)
    const edge = v <= 0.5 ? 'low' : v >= 0.9 ? 'high' : null
    if (!edge || seen.indexOf(edge) !== -1) return
    const next = seen.concat(edge)
    setSeen(next)
    if (next.length >= 2) {
      setDone(true)
      fx.right(okText)
      if (onSolved) onSolved({ correct: true })
    }
  }

  return (
    <>
      {!done ? <Cue kind="drag">{t(prompt)}</Cue> : null}
      <Scene
        fig={<TwoCirclesFig k={kShown} angle={angle} />}
        note={(
          <div className="g10-side">
            <div className="g10-readout">
              <div className="g10-readout-body">
                <div className="g10-rd">
                  <span className="g10-rd-key">{t(CUI.radiusLbl)}</span>
                  <span className="g10-rd-val">{String(round2(kShown)).replace('.', ',')}</span>
                </div>
                <div className="g10-rd">
                  <span className="g10-rd-key">{t(CUI.arcLen)}</span>
                  <span className="g10-rd-val g10-rd-val-accent">{String(arcSmall).replace('.', ',')}</span>
                </div>
                {/* Nisbat -- ASOSIY ko'rsatkich: radius o'zgarganda ham JOYIDA turadi. */}
                <div className="g10-rd g10-rd-sum">
                  <span className="g10-rd-key">{t(CUI.ratio)}</span>
                  <span className="g10-rd-val g10-rd-val-sum">{String(round2(arcSmall / kShown)).replace('.', ',')}</span>
                </div>
              </div>
            </div>
            {/* Bajarilgach polzunok OLIB TASHLANADI, o'chirilgan holda
                qoldirilmaydi: yakuniy holatda uning o'rniga xulosa satrlari
                keladi. Etalon §6.2: yangi qadam oldingisini O'RNINI OLADI,
                aks holda ekran budjetdan chiqadi (1-darsning 5-ekrani
                1366x615 da 27 px chiqib ketgan edi). */}
            {!done ? (
              <input
                className="g10-range"
                type="range"
                min={35}
                max={95}
                value={Math.round(k * 100)}
                onChange={(e) => move(Number(e.target.value) / 100)}
                aria-label={t(CUI.radiusLbl)}
              />
            ) : null}
            {done && notes ? notes.map((n, i) => <NoteLine key={i} i={i}>{typeof n === 'string' ? n : t(n)}</NoteLine>) : null}
            <Slot mh={56} className="g10-fb-sm">
              <Feedback show={done} ok={done}>{done ? t(okText) : null}</Feedback>
            </Slot>
          </div>
        )}
      />
    </>
  )
}

// Nuqtani BERILGAN burchakka qo'yish. Bir nechta nishon -- ketma-ket.
// `extra.arcLive` -- yoy nuqta bilan BIRGA o'sadi: 1-darsda o'quvchi burchakni
// uzunlik bilan o'lchaydi, shuning uchun yoy javob emas, O'LCHOV asbobi.
export function PlaceAngle({ prompt, targets, tolerance = 12, steps, okText, wrongText, audio, onSolved, extra }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [idx, setIdx] = useState(0)
  const [angle, setAngle] = useState(null)
  const [miss, setMiss] = useState(null) // null | 'far' | 'up' | 'down'
  const done = idx >= targets.length
  const target = targets[Math.min(idx, targets.length - 1)]

  const put = (deg) => {
    if (done) return
    setAngle(deg)
    // Ishorali farq: nishon SOAT MILIGA TESKARI tomonda bo'lsa musbat.
    let delta = norm(target) - norm(deg)
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360
    if (Math.abs(delta) <= tolerance) {
      setMiss(null)
      setAngle(norm(target)) // chizma yozuvga MOS bo'lsin: aniq nishonga o'tiradi
      const next = idx + 1
      setIdx(next)
      fx.right(next >= targets.length ? okText : null)
      if (next >= targets.length && onSolved) onSolved({ correct: true })
      return
    }
    // Yaqin promax -> YO'NALISH aytiladi, uzoq promax -> mazmunli izoh.
    const near = Math.abs(delta) <= 45
    const which = near ? (delta > 0 ? 'up' : 'down') : 'far'
    setMiss(which)
    fx.wrong(near ? (delta > 0 ? CUI.higher : CUI.lower) : wrongText)
  }

  const shown = done ? targets[targets.length - 1] : angle
  const promptNow = Array.isArray(prompt) ? prompt[Math.min(idx, prompt.length - 1)] : prompt
  // Topilgan nishonlar belgilanib qoladi: ikkinchi nuqta OLDINDAN chizilmaydi,
  // lekin topilgani yo'qolmaydi ham (metodist P2, 2026-08-07).
  const foundMarks = targets.slice(0, done ? targets.length - 1 : idx).map((deg) => ({
    deg, tone: T.ok, label: Math.round(deg) + '°',
  }))
  const extraMarks = (extra && extra.marks) || []
  const missText = miss === 'up' ? CUI.higher : miss === 'down' ? CUI.lower : wrongText
  return (
    <>
      {!done ? <Cue kind="drag">{t(promptNow)}</Cue> : null}
      <Scene
        fig={(
          <UnitCircle
            angle={shown}
            onAngle={put}
            snap={targets}
            drop
            ticks
            start={angle === null ? 0 : null}
            values={done}
            locked={done}
            {...extra}
            // Yoy nuqta bilan birga o'sadi. `extra` dan KEYIN turadi: aks holda
            // `extra` dagi tayyor `arc` uni bosib ketardi va yoy qotib qolardi.
            arc={extra && extra.arcLive ? { to: shown === null || shown === undefined ? 0 : norm(shown) } : (extra && extra.arc) || null}
            marks={extraMarks.concat(foundMarks)}
          />
        )}
        note={(
          <div className="g10-side">
            {/* FAQAT bajarilgan nishonlarning qatori. Joriy nishonning javobi
                ekranga CHIQMAYDI, aks holda «o'zing top» ma'nosini yo'qotadi. */}
            {steps ? steps.slice(0, done ? steps.length : idx).map((n, i) => <NoteLine key={i} i={i}>{typeof n === 'string' ? n : t(n)}</NoteLine>) : null}
            <Slot mh={56} className="g10-fb-sm">
              <Feedback show={done || !!miss || idx > 0} ok={done || (!miss && idx > 0)}>
                {t(done ? okText : miss ? missText : CUI.placed)}
              </Feedback>
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

  // Kasr ham, o'nlik ham qabul qilinadi (metodist qarori 2026-08-07):
  // jadvalda 1/2 yozilgan, klaviaturada 0,5 talab qilish nomuvofiq edi.
  const parseAnswer = (raw) => {
    const clean = String(raw).replace(/−/g, '-').replace(/,/g, '.').trim()
    if (clean.indexOf('/') !== -1) {
      const parts = clean.split('/')
      if (parts.length !== 2) return NaN
      const a = parseFloat(parts[0])
      const b = parseFloat(parts[1])
      if (Number.isNaN(a) || Number.isNaN(b) || b === 0) return NaN
      return a / b
    }
    return parseFloat(clean)
  }

  const check = () => {
    const value = parseAnswer(text)
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

  const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ',', '/', '−']
  return (
    <>
      {prompt && state !== 'ok' ? <Cue kind="type" compact={compact}>{t(prompt)}</Cue> : null}
      <Slot mh={compact ? 40 : 46}>
        <div className={'g10-entry' + (state === 'ok' ? ' g10-entry-ok' : state === 'no' ? ' g10-entry-bad' : '')} style={compact ? { minHeight: 38, fontSize: 17 } : undefined}>
          <span>{text || ''}</span>
          {state !== 'ok' ? <span className="g10-entry-caret">|</span> : null}
        </div>
      </Slot>
      {/* Javob TO'G'RI bo'lgach klaviatura ham, tugmalar ham OLIB TASHLANADI.
          Ular o'chirilgan holda ham 110 px egallaydi va yakuniy holatda ekran
          budjetdan chiqib ketadi (etalon §6.2: yangi qadam oldingisining
          O'RNINI OLADI). Bosiladigan narsa qolmagach, joyni ushlab turishning
          ma'nosi ham yo'q: razbor o'sha joyga chiqadi. */}
      {state !== 'ok' ? (
        <>
          <Slot mh={compact ? 36 : 40}>
            <div className="g10-pad">
              {KEYS.map((k) => (
                <button type="button" key={k} className="g10-key" style={compact ? { minHeight: 34, fontSize: 13 } : undefined} onClick={() => push(k)}>{k}</button>
              ))}
            </div>
          </Slot>
          <Slot mh={compact ? 40 : 44}>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <Btn tone="ghost" onClick={back} disabled={!text} style={compact ? { minHeight: 36, padding: '6px 14px' } : undefined}>⌫</Btn>
              <Btn tone="accent" ready={!!text} onClick={check} disabled={!text} style={compact ? { minHeight: 36, padding: '6px 16px' } : undefined}>{t(UI.check)}</Btn>
            </div>
          </Slot>
        </>
      ) : null}
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
      {phase === 'try' ? <Cue kind="drag">{t(prompt)}</Cue> : null}
      <Scene
        fig={(
          <UnitCircle
            angle={phase === 'try' ? angle : 90}
            onAngle={put}
            ghost={phase === 'try' ? null : { x: 0.5, y: 1.2 }}
            drop
            ticks
            start={phase === 'try' && angle === null ? 0 : null}
            locked={phase !== 'try'}
            tween={false}
          />
        )}
        note={(
          <div className="g10-side">
            <Readout
              angle={phase === 'try' ? angle : 90}
              ghost={phase === 'try' ? null : { x: 0.5, y: 1.2 }}
              counter={phase !== 'try'}
              live
              // Rad etish fazasida guvoh -- KVADRATLAR yig'indisi (1,69), koordinatalar
              // emas. Ular ikki qator, ya'ni 120 px, va yakuniy holat budjetga sig'masdi.
              hide={phase === 'try' ? [] : ['angle', 'cos', 'sin']}
            />
            {phase === 'try' ? (
              <Slot mh={58} className="g10-fb-sm"><Feedback show={tries > 0} ok={false}>{t(tryText)}</Feedback></Slot>
            ) : (
              <>
                {/* ОДНА строка, не две: вывод целиком читается и так, а вторая
                    строка стоила 24 px — с ней конечное состояние экрана не
                    влезало в бюджет и низ обрезался. */}
                <NoteLine i={0}>{'sin α = 1,2   →   cos²α = 1 − 1,44'}</NoteLine>
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

// ============================================================
// TARTIBLASH. 1-4-sinf amaliyotidagi `order` turi. Nima uchun kerak:
// «burchak o'sса ikkala qiymat ham o'sadi» degan xato FAQAT shu turda
// fosh bo'ladi -- variant tanlashda uni taxmin bilan aylanib o'tish mumkin.
// ============================================================
export function OrderRow({ prompt, items, answer, marks, okText, badText, audio, onSolved }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [order] = useState(() => shuffled(items))
  const [slots, setSlots] = useState(() => answer.map(() => null))
  const [checked, setChecked] = useState(false)
  const [hint, setHint] = useState(null)
  const done = checked && slots.join('|') === answer.join('|')
  const full = slots.every((x) => x !== null)

  const put = (id) => {
    if (done || slots.indexOf(id) !== -1) return
    const next = slots.slice()
    const free = next.indexOf(null)
    if (free === -1) return
    next[free] = id
    setSlots(next); setChecked(false); setHint(null)
  }
  const pull = (i) => {
    if (done) return
    const next = slots.slice()
    next[i] = null
    setSlots(next); setChecked(false); setHint(null)
  }
  const check = () => {
    setChecked(true)
    if (slots.join('|') === answer.join('|')) {
      fx.right(okText); setHint(okText || null)
      if (onSolved) onSolved({ correct: true })
      return
    }
    setHint(badText || CUI.orderBad)
    fx.wrong(badText || CUI.orderBad)
  }
  // Yorliq SO'Z bo'lishi ham mumkin (masalan «45 ga qisqartirish»), formula ham.
  // So'z bo'lsa u `L(...)` obyekti bo'lib keladi va uni `t()` dan O'TKAZISH shart:
  // aks holda React obyektni chizmoqchi bo'lib DARSNI YIQITADI («Objects are not
  // valid as a React child»). Aynan shu 1-darsning 10-ekranida bo'ldi.
  const lab = (v) => (v && typeof v === 'object' ? t(v) : v)
  const labelOf = (id) => { const x = items.find((y) => y.id === id); return x ? lab(x.label) : '?' }

  return (
    <>
      {!done ? <Cue kind="order">{t(prompt || CUI.orderAsk)}</Cue> : null}
      <Scene
        fig={checked && !done ? <UnitCircle angle={null} marks={marks || []} locked /> : null}
        note={(
          <div className="g10-side">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              {slots.map((id, i) => (
                <button
                  type="button" key={i}
                  className={'g10-cell' + (done ? ' g10-cell-ok' : checked && id !== answer[i] ? ' g10-cell-bad' : '')}
                  style={{ minWidth: 74, minHeight: 42 }}
                  onClick={() => pull(i)}
                >
                  {id ? <Fx>{labelOf(id)}</Fx> : (i + 1) + '.'}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginTop: 6 }}>
              {order.map((x) => (
                <button
                  type="button" key={x.id}
                  className="g10-chip"
                  disabled={slots.indexOf(x.id) !== -1 || done}
                  onClick={() => put(x.id)}
                >
                  <Fx>{lab(x.label)}</Fx>
                </button>
              ))}
            </div>
            <Slot mh={44}>
              {!done ? (
                <Btn tone="accent" ready={full} disabled={!full} onClick={check}>{t(UI.check)}</Btn>
              ) : null}
            </Slot>
            <Slot mh={58} className="g10-fb-sm">
              <Feedback show={!!hint} ok={done}>{hint ? t(hint) : null}</Feedback>
            </Slot>
          </div>
        )}
      />
    </>
  )
}

// ============================================================
// KO'P TANLOV. `multi`: hammasini belgilash kerak. To'rtdan bittasini
// tanlashda taxmin 25% ishlaydi, bu yerda ishlamaydi.
// ============================================================
export function MultiPick({ prompt, items, okText, audio, onSolved }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [order] = useState(() => shuffled(items))
  const [on, setOn] = useState([])
  const [checked, setChecked] = useState(false)
  const [hint, setHint] = useState(null)
  const need = items.filter((x) => x.ok).map((x) => x.id).sort().join('|')
  const done = checked && on.slice().sort().join('|') === need

  const toggle = (id) => {
    if (done) return
    setOn((prev) => (prev.indexOf(id) === -1 ? prev.concat(id) : prev.filter((x) => x !== id)))
    setChecked(false); setHint(null)
  }
  const check = () => {
    setChecked(true)
    const picked = on.slice().sort().join('|')
    if (picked === need) {
      fx.right(okText); setHint(okText || null)
      if (onSolved) onSolved({ correct: true })
      return
    }
    const wrong = items.find((x) => !x.ok && on.indexOf(x.id) !== -1)
    const missed = items.find((x) => x.ok && on.indexOf(x.id) === -1)
    const msg = wrong ? wrong.hint : (missed ? CUI.multiMissed : null)
    setHint(msg); fx.wrong(msg)
  }

  return (
    <>
      {!done ? <Cue kind="multi">{t(prompt)}</Cue> : null}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {order.map((x) => {
          const isOn = on.indexOf(x.id) !== -1
          const bad = checked && isOn && !x.ok
          const miss = checked && !isOn && x.ok && done === false
          return (
            <button
              type="button" key={x.id}
              className={'g10-opt' + (isOn && !bad ? ' g10-opt-ok' : '') + (bad ? ' g10-opt-tip' : '')}
              style={{
                width: 'auto', minWidth: 120, justifyContent: 'center',
                boxShadow: miss ? 'inset 0 0 0 2px ' + T.tip : undefined,
              }}
              disabled={done}
              onClick={() => toggle(x.id)}
            >
              <span className="g10-opt-badge">{isOn ? '✓' : '○'}</span>
              <span className="g10-opt-text" style={{ flex: 'none' }}><Fx>{x.label && typeof x.label === 'object' ? t(x.label) : x.label}</Fx></span>
            </button>
          )
        })}
      </div>
      <Slot mh={46}>
        {!done ? <Btn tone="accent" ready={on.length > 0} disabled={!on.length} onClick={check}>{t(UI.check)}</Btn> : null}
      </Slot>
      <Slot mh={62}>
        <Feedback show={!!hint} ok={done}>{hint ? t(hint) : null}</Feedback>
      </Slot>
    </>
  )
}

// ============================================================
// MOSLASHTIRISH. `match`: burchak <-> koordinatalar. To'g'ri juftlik
// QATORGA yig'iladi -- 1-4-sinfdagi naqsh, telefonda ham ishlaydi
// (chiziq tortish emas, ikki teginish).
// ============================================================
export function MatchPairs({ prompt, left, right, marks, okText, audio, onSolved }) {
  const t = useT()
  // Подпись бывает и формулой (`π/6` — одна на все языки), и словами (`вершина`
  // — тогда это `L(...)`). Собранная строка склеивала подпись как есть, и
  // словесная давала «[object Object]». Один переводчик на все три места.
  const lab = (x) => (x && typeof x === 'object' ? t(x) : x)
  const fx = useAnswerFx(audio)
  const [rights] = useState(() => shuffled(right))
  const [pick, setPick] = useState(null)
  const [done, setDone] = useState([])
  const [bad, setBad] = useState(null)
  const [hint, setHint] = useState(null)
  const finished = done.length >= left.length

  const tapRight = (r) => {
    if (!pick || finished) return
    if (r.id === pick.id) {
      const next = done.concat({ l: pick, r })
      setDone(next); setPick(null); setBad(null); setHint(null)
      fx.right(next.length >= left.length ? okText : null)
      if (next.length >= left.length && onSolved) onSolved({ correct: true })
      return
    }
    setBad(r.id)
    const msg = r.hint || CUI.matchBad
    setHint(msg); fx.wrong(msg)
  }

  const openLeft = left.filter((l) => !done.some((d) => d.l.id === l.id))
  const openRight = rights.filter((r) => !done.some((d) => d.r.id === r.id))

  return (
    <>
      {!finished ? <Cue kind="match">{t(prompt || CUI.matchAsk)}</Cue> : null}
      {done.map((d) => (
        <DoneRow key={d.l.id}><Fx>{lab(d.l.label) + '  →  ' + lab(d.r.label)}</Fx></DoneRow>
      ))}
      <div style={{
        display: 'flex', gap: 'clamp(8px, 2.6vw, 28px)', justifyContent: 'center',
        alignItems: 'flex-start', flexWrap: 'wrap', maxWidth: '100%',
      }}>
        {bad && marks ? (
          <div style={{ width: 'clamp(118px, 22vw, 240px)', flexShrink: 0 }}>
            <Scene fig={<UnitCircle angle={null} marks={marks} locked />} max={240} h={240} />
          </div>
        ) : null}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, minWidth: 0 }}>
          {openLeft.map((l) => (
            <button
              type="button" key={l.id}
              className={'g10-opt' + (pick && pick.id === l.id ? ' g10-opt-ok' : '')}
              style={{ width: 'auto', minWidth: 84, maxWidth: '100%', justifyContent: 'center' }}
              onClick={() => { setPick(l); setBad(null); setHint(null) }}
            >
              <span className="g10-opt-text" style={{ flex: 'none' }}><Fx>{lab(l.label)}</Fx></span>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, minWidth: 0, maxWidth: 208 }}>
          {openRight.map((r) => (
            <button
              type="button" key={r.id}
              className={'g10-opt' + (bad === r.id ? ' g10-opt-tip' : '')}
              style={{ width: 'auto', minWidth: 118, maxWidth: '100%', justifyContent: 'center', opacity: pick ? 1 : 0.72 }}
              disabled={!pick}
              onClick={() => tapRight(r)}
            >
              <span className="g10-opt-text"><Fx>{lab(r.label)}</Fx></span>
            </button>
          ))}
        </div>
      </div>
      <Slot mh={58}>
        <Feedback show={!!hint} ok={finished}>{hint ? t(hint) : null}</Feedback>
      </Slot>
    </>
  )
}

// Uch burchak jadvali: har qator RADIUS bilan tekshiriladi. Xato juftlik
// nuqtani aylanadan chiqarib yuboradi, dastur «noto'g'ri» demaydi.
// `figH` -- chizmani YORDAMCHI tirga o'tkazadi (`g10-scene-fig-fixed`, poli
// 100 px). Nima uchun kerak: 4-darsning 9-ekranida jadvalda TO'RT qator bor
// (har chorakdan bittasi), va 393 px da ishchi tirdagi 212 px li chizma bilan
// birga ekran budjetdan 17 px chiqib ketardi. Katakchani kichraytirish MUMKIN
// EMAS: 30 px bu barmoq. Chizma esa bu ekranda ishchi yuza emas -- o'quvchi
// jadvalda ishlaydi, chizma faqat burchakni belgilab turadi, ya'ni aynan
// yordamchi. Prop berilmasa hech narsa o'zgarmaydi (3-darsning jadvali).
export function TableFill({ rows, chips, onSolved, audio, wrongNote, swapNote, okText, figH }) {
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
    <>
      {!(checked && allRight) ? <Cue kind="fill" compact>{t(CUI.tableAsk)}</Cue> : null}
    <Scene
      h={figH}
      max={figH || 620}
      fig={<UnitCircle angle={rows[active[0]] ? rows[active[0]].deg : null} ghost={ghost} locked />}
      note={(
        <div className="g10-side">
          <Panel style={{ display: 'grid', gridTemplateColumns: '52px 70px 70px', gap: 5, alignItems: 'center' }}>
            <span className="g10-rd-key" />
            <span className="g10-rd-key">cos</span>
            <span className="g10-rd-key">sin</span>
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
    </>
  )
}

// «O'zing yasa»: berilgan xossali nuqta. Tekshiruv KOORDINATA bilan,
// chorak NOMI bilan emas (chorak 4-darsda kiritiladi).
// `readout` -- tabloning sozlamasi (masalan `{ tan: true }`). Nima uchun prop:
// tablo ekranning SAVOLIGA tegishli, asbobning o'ziga emas -- 2-darsda
// tangens qatori kerak, 3-darsda esa u ekranni budjetdan chiqarardi.
export function BuildPoint({ prompt, test, hints, okText, onSolved, audio, snap, readout }) {
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
      {state !== 'ok' ? <Cue kind="drag">{t(prompt)}</Cue> : null}
      <Scene
        fig={<UnitCircle angle={angle} onAngle={put} snap={snap} ticks start={angle === null ? 0 : null} locked={state === 'ok'} values={state === 'ok'} />}
        note={(
          <div className="g10-side">
            <Readout angle={angle} {...(readout || {})} />
            <Slot mh={70} className="g10-fb-sm">
              <Feedback show={!!hint} ok={state === 'ok'}>{hint ? t(hint) : null}</Feedback>
            </Slot>
          </div>
        )}
      />
    </>
  )
}
