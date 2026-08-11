// ============================================================================
// 7-sinf, Dars 5. QAVSLARNI OCHISH -- METODIST TEXNIK TOPSHIRIG'I bo'yicha
// NOLDAN yozilgan variant (2026-08-11).
//
// NEGA yangi fayl. Eski `Dars05.jsx` bosqichma-bosqich tuzatilardi va shu
// sababli eski karkasni saqlab qolardi: metodist «всё ещё похоже на прежний
// файл» dedi. Bu yerda vyorstka HAM, kompozitsiya HAM noldan.
//
// NIMA KO'CHIRILDI (ishlaydigan infratuzilma, TZ 14-bandi):
//   - ovoz: `useAudio` (HTTP TTS v5.2 kontrakti, previu zaxirasi)
//   - uch til: `L` / `tr` / `LangProvider`
//   - qulflar: `useInstructionGate` (ovoz tugamaguncha javob yopiq),
//     `useAdvanceGate` (mute-xavfsiz «Davom»)
//   - `useMobileZoom` -- telefon uchun 390px dizayn kengligi
// Vyorstka, ranglar, komponentlar -- SHU FAYLDA, `core.jsx` STYLES ulanmaydi.
//
// TZ TALABLARI, qisqacha:
//   fon #F4EFE6 (xuk #EDF5F1, qoida #FFF1E7, yakun #EDF6EE), rasm YO'Q
//   matn #182224, biruza #126E73, to'q sariq #E75A2C, yashil #287B54
//   sarlavha Source Serif 4, formula JetBrains Mono, interfeys Manrope
//   1366x768 -- skrollsiz; har interaktiv ekranda «Bosing/Tanlang»
//   keyingi bosqich HARAKATDAN keyin; 180-260 ms oddiy, 420-650 ms matematik
//   prefers-reduced-motion qo'llab-quvvatlanadi
//
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// ============================================================================
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  L,
  LangProvider,
  LangSetProvider,
  configureLesson,
  getFreeNav,
  tr,
  useAdvanceGate,
  useAudio,
  useInstructionGate,
  useMobileZoom,
  useT,
} from './core.jsx'

configureLesson({ freeNav: false })

const LESSON_ID = 'alg_7_05'
const LESSON_TITLE = L('Qavslarni ochish', 'Раскрытие скобок', 'Expanding brackets')
const TOTAL = 15

// Ovoz segmenti: `on` -- qadam nomi, matn uch tilda.
const A = (on, uz, ru, en) => ({ on, text: L(uz, ru, en) })
const seg = (list, lang) =>
  list.map((s, i) => ({
    id: s.on,
    text: tr(s.text, lang),
    trigger: i === 0 ? 'on_mount' : 'on_event:' + s.on,
  }))

// ============================================================================
// PALITRA va USLUBLAR. Hammasi shu yerda: rasm, gradient, fon surati YO'Q.
// ============================================================================
const C = {
  bg: '#F4EFE6',
  bgHook: '#EDF5F1',
  bgRule: '#FFF1E7',
  bgSum: '#EDF6EE',
  card: 'rgba(255,255,255,0.82)',
  cardSolid: '#FFFFFF',
  line: 'rgba(24,34,36,0.12)',
  ink: '#182224',
  ink2: '#5C6A6C',
  ink3: '#93A0A2',
  teal: '#126E73',
  tealSoft: '#DEECEC',
  orange: '#E75A2C',
  orangeSoft: '#FBE3D9',
  green: '#287B54',
  greenSoft: '#E2F0E8',
  amber: '#A55D19',
  amberSoft: '#FAECD8',
}

const MONO = "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace"
const SERIF = "'Source Serif 4', Georgia, 'Times New Roman', serif"
const UIF = "'Manrope', system-ui, sans-serif"

const CSS = `
.v2-root {
  position: fixed; inset: 0; overflow: clip; overscroll-behavior: none;
  isolation: isolate; zoom: var(--g7z, 1);
  font-family: ${UIF}; color: ${C.ink}; background: ${C.bg};
  -webkit-font-smoothing: antialiased;
  transition: background-color .24s ease;
}
.v2-root.is-hook { background: ${C.bgHook}; }
.v2-root.is-rule { background: ${C.bgRule}; }
.v2-root.is-sum  { background: ${C.bgSum}; }
@media (max-width: 639.98px) { .v2-root { width: 390px; } }

/* Uch qavat: shapka, ish maydoni, navigatsiya. Shapka va navigatsiya
   DOIM bir joyda turadi (TZ 12-band). */
.v2-stage {
  max-width: 1120px; height: 100%; margin: 0 auto;
  padding: 0 clamp(14px, 2.4vw, 30px);
  display: flex; flex-direction: column;
}
.v2-head { flex-shrink: 0; padding-top: clamp(10px, 1.8vh, 18px); }
/* Sayt qobig'i yuqori chapga «Darslar ro'yxati» tugmasini, o'ngga esa til
   almashtirgichini qo'yadi -- ikkisi ham shapkani yopib qo'yardi.
   Faqat KENG ekranda ikki tomondan joy beramiz. */
@media (min-width: 1024px) {
  .v2-head { padding-left: 96px; padding-right: 132px; }
}
.v2-track { height: 5px; border-radius: 99px; background: rgba(24,34,36,.10); overflow: hidden; }
.v2-fill { height: 100%; background: ${C.orange}; border-radius: 99px; transition: width .42s cubic-bezier(.4,0,.2,1); }
.v2-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 9px 0 0; }
.v2-eyebrow {
  display: inline-flex; align-items: center; gap: 8px; min-width: 0;
  font-size: clamp(11px, 1.3vw, 12.5px); font-weight: 700;
  letter-spacing: .16em; text-transform: uppercase; color: ${C.ink2};
}
.v2-eyebrow i { width: 7px; height: 7px; border-radius: 50%; background: ${C.orange}; flex-shrink: 0; }
.v2-tools { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.v2-tool {
  width: 34px; height: 34px; border-radius: 10px; border: none; cursor: pointer;
  background: ${C.cardSolid}; color: ${C.ink2}; font-size: 14px;
  box-shadow: inset 0 0 0 1px ${C.line};
  transition: background .18s ease, color .18s ease;
}
.v2-tool:hover { color: ${C.ink}; }
.v2-tool:active { background: ${C.tealSoft}; }
.v2-tool:focus-visible { outline: 3px solid ${C.orange}; outline-offset: 2px; }
.v2-tool.is-off { color: ${C.ink3}; }
.v2-count { font-family: ${MONO}; font-size: 13px; font-weight: 700; color: ${C.ink2}; }

.v2-body {
  flex: 1; min-height: 0; overflow: clip;
  display: flex; flex-direction: column;
  padding: clamp(8px, 1.4vh, 16px) 0;
}
.v2-col { margin-block: auto; display: flex; flex-direction: column; gap: clamp(8px, 1.4vh, 15px); }

.v2-nav {
  flex-shrink: 0; display: flex; align-items: center; justify-content: space-between;
  gap: 12px; padding: clamp(9px, 1.5vh, 15px) 0;
  border-top: 1px solid ${C.line};
}

/* Tipografika */
.v2-h1 {
  margin: 0; font-family: ${SERIF}; font-weight: 600; line-height: 1.06;
  letter-spacing: -.015em; font-size: clamp(24px, 3.4vw, 38px);
}
.v2-h2 {
  margin: 0; font-family: ${SERIF}; font-weight: 600; line-height: 1.1;
  font-size: clamp(20px, 2.6vw, 29px);
}
.v2-lead { margin: 0; color: ${C.ink2}; font-size: clamp(14px, 1.8vw, 17px); line-height: 1.45; }
.v2-ask { margin: 0; font-weight: 700; font-size: clamp(16px, 2.1vw, 19px); line-height: 1.3; }
.v2-expr { font-family: ${MONO}; font-weight: 700; letter-spacing: -.01em; }
.v2-expr-xl { font-size: clamp(30px, 4.4vw, 48px); }
.v2-expr-lg { font-size: clamp(22px, 3vw, 34px); }
.v2-expr-md { font-size: clamp(17px, 2.2vw, 26px); }
.v2-expr-sm { font-size: clamp(14px, 1.7vw, 18px); }

/* Harakat belgisi: qayerga bosish kerak (TZ 5-band) */
.v2-cta {
  display: inline-flex; align-items: center; gap: 7px; align-self: flex-start;
  padding: 3px 11px 3px 8px; border-radius: 999px;
  background: ${C.orangeSoft}; color: ${C.orange};
  font-size: clamp(11px, 1.3vw, 12.5px); font-weight: 800;
  letter-spacing: .09em; text-transform: uppercase; white-space: nowrap;
}
.v2-cta i { width: 8px; height: 8px; border-radius: 50%; background: ${C.orange}; animation: v2-pulse 1.9s ease-out infinite; }
@keyframes v2-pulse {
  0% { box-shadow: 0 0 0 0 rgba(231,90,44,.5); }
  70% { box-shadow: 0 0 0 9px rgba(231,90,44,0); }
  100% { box-shadow: 0 0 0 0 rgba(231,90,44,0); }
}

/* Kartochka va variantlar */
.v2-card {
  background: ${C.card}; border-radius: 16px;
  padding: clamp(10px, 1.6vw, 18px) clamp(12px, 1.9vw, 22px);
  box-shadow: inset 0 0 0 1px ${C.line};
  display: flex; flex-direction: column; gap: clamp(6px, 1vh, 10px);
  min-width: 0;
}
.v2-opts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
@media (max-width: 639.98px) { .v2-opts { grid-template-columns: minmax(0, 1fr); gap: 8px; } }
.v2-opt {
  display: flex; align-items: center; gap: 12px; min-width: 0; overflow: hidden;
  min-height: clamp(52px, 5.4vw, 62px);
  padding: clamp(10px, 1.5vw, 13px) clamp(13px, 2vw, 18px);
  border: none; border-radius: 12px; cursor: pointer; text-align: left;
  background: ${C.cardSolid}; color: ${C.ink};
  font-family: ${UIF}; font-size: clamp(14px, 1.9vw, 16.5px); font-weight: 500;
  box-shadow: 0 8px 20px -16px rgba(24,34,36,.5), inset 0 0 0 1px ${C.line};
  transition: transform .18s ease, box-shadow .18s ease, background .2s ease,
              opacity .42s ease, max-height .5s ease, min-height .5s ease, padding .38s ease;
}
.v2-opt:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 26px -16px rgba(24,34,36,.55), inset 0 0 0 1px ${C.line}; }
.v2-opt:active:not(:disabled) { transform: translateY(0); background: #FBFAF7; }
.v2-opt:focus-visible { outline: 3px solid ${C.orange}; outline-offset: 2px; }
.v2-opt:disabled { cursor: default; }
.v2-opt b { flex-shrink: 0; min-width: 20px; font-size: 13.5px; font-weight: 800; color: ${C.ink3}; }
.v2-opt span { min-width: 0; overflow-wrap: anywhere; }
.v2-opt.is-math span { font-family: ${MONO}; font-weight: 700; font-size: 1.04em; }
.v2-opt.is-ok { background: ${C.greenSoft}; box-shadow: inset 0 0 0 2px ${C.green}; }
.v2-opt.is-ok b { color: ${C.green}; }
.v2-opt.is-bad { background: ${C.amberSoft}; box-shadow: inset 0 0 0 2px ${C.amber}; }
.v2-opt.is-bad b { color: ${C.amber}; }
.v2-opt.is-gone { opacity: 0; max-height: 0; min-height: 0; padding-top: 0; padding-bottom: 0; pointer-events: none; }

/* Izoh: yorliq + oddiy qora matn (5-sinf tuzilishi) */
.v2-fb {
  display: flex; flex-direction: column; gap: 4px;
  padding: clamp(10px, 1.5vw, 15px) clamp(12px, 1.8vw, 17px);
  border-radius: 12px; border-left: 4px solid transparent;
  animation: v2-in .24s ease-out both;
}
.v2-fb-ok { background: ${C.greenSoft}; border-left-color: ${C.green}; }
.v2-fb-tip { background: ${C.amberSoft}; border-left-color: ${C.amber}; }
.v2-fb-note { background: ${C.tealSoft}; border-left-color: ${C.teal}; }
.v2-fb i {
  font-style: normal; font-size: clamp(11px, 1.2vw, 12.5px); font-weight: 800;
  letter-spacing: .09em; text-transform: uppercase;
}
.v2-fb-ok i { color: ${C.green}; }
.v2-fb-tip i { color: ${C.amber}; }
.v2-fb-note i { color: ${C.teal}; }
.v2-fb p { margin: 0; font-size: clamp(14px, 1.8vw, 16px); line-height: 1.45; color: ${C.ink}; }

/* Tugmalar */
.v2-btn {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 46px; padding: 0 clamp(16px, 2.2vw, 24px);
  border: none; border-radius: 12px; cursor: pointer;
  font-family: ${UIF}; font-size: clamp(14px, 1.7vw, 16px); font-weight: 700;
  transition: transform .18s ease, box-shadow .18s ease, background .2s ease, opacity .2s ease;
}
.v2-btn-accent { background: ${C.orange}; color: #FFF; box-shadow: 0 10px 22px -12px rgba(231,90,44,.75); }
.v2-btn-accent:hover:not(:disabled) { transform: translateY(-1px); }
.v2-btn-soft { background: ${C.cardSolid}; color: ${C.teal}; box-shadow: inset 0 0 0 1px ${C.line}; }
.v2-btn-soft:hover:not(:disabled) { background: ${C.tealSoft}; }
.v2-btn-ghost { background: transparent; color: ${C.ink2}; }
.v2-btn-ghost:hover:not(:disabled) { color: ${C.ink}; }
.v2-btn:active:not(:disabled) { transform: translateY(1px); }
.v2-btn:focus-visible { outline: 3px solid ${C.orange}; outline-offset: 2px; }
.v2-btn:disabled { opacity: .45; cursor: default; }

/* Yechilgan topshiriq: yashil qator */
.v2-done {
  display: flex; align-items: center; gap: 9px; min-width: 0;
  padding: 5px 12px; border-radius: 10px;
  background: ${C.greenSoft}; color: ${C.green};
  font-family: ${MONO}; font-weight: 700;
  font-size: clamp(13px, 1.6vw, 15px);
  animation: v2-in .24s ease-out both;
}
.v2-done s { text-decoration: none; flex-shrink: 0; }

/* Progress 01-05 */
.v2-steps { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
.v2-step {
  min-width: 32px; padding: 3px 8px; border-radius: 8px; text-align: center;
  font-family: ${MONO}; font-size: 12.5px; font-weight: 700;
  background: rgba(24,34,36,.06); color: ${C.ink3};
}
.v2-step.is-now { background: ${C.orangeSoft}; color: ${C.orange}; }
.v2-step.is-done { background: ${C.greenSoft}; color: ${C.green}; }

@keyframes v2-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.v2-in { animation: v2-in .24s ease-out both; }
.v2-slow { animation: v2-in .52s cubic-bezier(.22,.61,.36,1) both; }

@media (prefers-reduced-motion: reduce) {
  .v2-root, .v2-fill, .v2-opt, .v2-btn { transition: none !important; }
  .v2-in, .v2-slow, .v2-fb, .v2-done { animation: none !important; }
  .v2-cta i { animation: none; }
}
`

// ============================================================================
// UMUMIY BO'LAKLAR
// ============================================================================
const UI = {
  back: L('Orqaga', 'Назад', 'Back'),
  next: L('Davom etish', 'Продолжить', 'Continue'),
  finish: L('Darsni yakunlash', 'Завершить урок', 'Finish the lesson'),
  saved: L('Saqlandi', 'Сохранено', 'Saved'),
  pick: L('Tanlang', 'Выберите', 'Choose'),
  tap: L('Bosing', 'Нажмите', 'Tap'),
  hint: L('Maslahat', 'Подсказка', 'Hint'),
  right: L("To'g'ri", 'Верно', 'Correct'),
  note: L('Izoh', 'Пояснение', 'Note'),
  sound: L('Ovoz', 'Звук', 'Sound'),
  replay: L('Qayta', 'Повторить', 'Replay'),
}

const Cta = ({ kind = 'pick', done }) => {
  const t = useT()
  if (done) return null
  return (
    <span className="v2-cta"><i aria-hidden="true" />{t(kind === 'tap' ? UI.tap : UI.pick)}</span>
  )
}

const Fb = ({ tone = 'tip', title, children }) => (
  <div className={'v2-fb v2-fb-' + tone}>
    <i>{title}</i>
    <p>{children}</p>
  </div>
)

const looksMath = (s) => /[0-9()+−·=]/.test(String(s))

// Variantlar: har bittasida O'Z izohi; to'g'ri javob yechimni ochadi.
// `picked` bo'lgach tanlanmaganlari yig'iladi (joy razborga bo'shaydi).
const Choice = ({ items, picked, wrong, onPick, disabled }) => {
  const t = useT()
  const solved = !!picked
  const [tight, setTight] = useState(false)
  useEffect(() => {
    if (!solved) { setTight(false); return undefined }
    const tmr = setTimeout(() => setTight(true), 520)
    return () => clearTimeout(tmr)
  }, [solved])
  return (
    <div className="v2-opts" style={tight ? { gridTemplateColumns: 'minmax(0,1fr)', gap: 0 } : null}>
      {items.map((it, i) => {
        const isOk = picked === it.id
        const isBad = wrong.indexOf(it.id) !== -1
        const gone = solved && !isOk
        const label = t(it.label)
        return (
          <button
            key={it.id}
            type="button"
            className={'v2-opt' + (looksMath(label) ? ' is-math' : '') + (isOk ? ' is-ok' : isBad ? ' is-bad' : '') + (gone ? ' is-gone' : '')}
            disabled={disabled || isBad || solved}
            onClick={() => onPick(it)}
          >
            <b>{isOk ? '✓' : isBad ? '↺' : String.fromCharCode(65 + i)}</b>
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}

// Bitta savol: savol matni, «Tanlang», variantlar, izoh.
// `onRight` FAQAT to'g'ri javobda chaqiriladi -- shundan keyin yechim ochiladi.
function Ask({ data, disabled, onRight, onWrong, audio }) {
  const t = useT()
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [fb, setFb] = useState(null)

  const pick = (opt) => {
    const src = data.items.find((x) => x.id === opt.id)
    if (src && src.correct) {
      setPicked(opt.id)
      setFb({ tone: 'ok', title: t(UI.right), text: data.ok })
      if (onRight) onRight({ id: opt.id, attempts: wrong.length + 1 })
      return
    }
    setWrong((p) => (p.indexOf(opt.id) === -1 ? p.concat(opt.id) : p))
    setFb({ tone: 'tip', title: t(UI.hint), text: src ? src.hint : null })
    if (audio && audio.say && src && src.hint) audio.say(t(src.hint))
    if (onWrong) onWrong(opt.id)
  }

  return (
    <>
      {data.question ? <p className="v2-ask">{t(data.question)}</p> : null}
      <Cta done={!!picked || disabled} />
      <Choice items={data.items} picked={picked} wrong={wrong} onPick={pick} disabled={disabled} />
      {fb && fb.text ? <Fb tone={fb.tone} title={fb.title}>{t(fb.text)}</Fb> : null}
    </>
  )
}

// Ketma-ket topshiriqlar: 01-05, keyingisi FAQAT to'g'ri javobdan keyin
// ochiladi, yechilgani yashil qatorga yig'iladi (TZ, 9-12 va 14-ekranlar).
function TaskRunner({ tasks, disabled, audio, onDone, onItem }) {
  const t = useT()
  const [idx, setIdx] = useState(0)
  const [done, setDone] = useState([])
  const [solved, setSolved] = useState(false)
  const cur = tasks[idx]

  const right = (r) => {
    setSolved(true)
    if (onItem) onItem({ index: idx, attempts: r.attempts })
    const row = (cur.prompt || '') + '  ' + (cur.solution || '')
    const tmr = setTimeout(() => {
      setDone((p) => p.concat(row))
      setSolved(false)
      const nx = idx + 1
      setIdx(nx)
      if (nx >= tasks.length && onDone) onDone()
      else if (audio) audio.step('q' + (nx + 1))
    }, 2100)
    return () => clearTimeout(tmr)
  }

  return (
    <>
      <div className="v2-steps">
        {tasks.map((_, i) => (
          <span key={i} className={'v2-step' + (i < idx ? ' is-done' : i === idx ? ' is-now' : '')}>
            {String(i + 1).padStart(2, '0')}
          </span>
        ))}
      </div>
      {done.slice(-2).map((row, i) => (
        <span key={i} className="v2-done"><s>{'✓'}</s>{row}</span>
      ))}
      {cur ? (
        <div className="v2-card v2-in" key={idx}>
          {cur.prompt ? <p className="v2-expr v2-expr-md">{cur.prompt}</p> : null}
          <Ask data={cur} disabled={disabled} audio={audio} onRight={right} />
          {solved && cur.step ? (
            <Fb tone="note" title={t(UI.note)}>{t(cur.step)}</Fb>
          ) : null}
        </div>
      ) : null}
    </>
  )
}

// ============================================================================
// EKRAN QOBIG'I: shapka, ish maydoni, navigatsiya -- doim bir joyda.
// ============================================================================
function Shell({ eyebrow, screen, audio, solved, onPrev, onNext, onFinish, finished, tone, children }) {
  const t = useT()
  const canNext = useAdvanceGate(solved, audio)
  const last = screen === TOTAL - 1
  return (
    <div className={'v2-root' + (tone ? ' is-' + tone : '')}>
      <div className="v2-stage">
        <div className="v2-head">
          <div className="v2-track"><div className="v2-fill" style={{ width: Math.round(((screen + 1) / TOTAL) * 100) + '%' }} /></div>
          <div className="v2-top">
            <span className="v2-eyebrow"><i aria-hidden="true" />{t(eyebrow)}</span>
            <span className="v2-tools">
              <button type="button" className="v2-tool" onClick={audio.replay} aria-label={t(UI.replay)}>{'↺'}</button>
              <button
                type="button"
                className={'v2-tool' + (audio.muted ? ' is-off' : '')}
                onClick={audio.toggleMute}
                aria-label={t(UI.sound)}
              >
                {audio.muted ? '✕' : '♪'}
              </button>
              <span className="v2-count">{screen + 1} / {TOTAL}</span>
            </span>
          </div>
        </div>

        <div className="v2-body">
          <div className="v2-col">{children}</div>
        </div>

        <div className="v2-nav">
          <button type="button" className="v2-btn v2-btn-ghost" onClick={onPrev} disabled={screen === 0}>
            {t(UI.back)}
          </button>
          {last ? (
            <button type="button" className="v2-btn v2-btn-accent" onClick={onFinish} disabled={finished}>
              {finished ? t(UI.saved) : t(UI.finish)}
            </button>
          ) : (
            <button type="button" className="v2-btn v2-btn-accent" onClick={onNext} disabled={!canNext}>
              {t(UI.next)}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CHIZMA: to'g'ri to'rtburchakning YUZASI. Faqat SVG, foto YO'Q.
// phase: whole -> cut -> parts
// ============================================================================
function AreaModel({ phase = 'whole', label = 'a', per = 5, rows = 3 }) {
  const x0 = 64
  const yTop = 30
  const row = 38
  const unit = 40
  const oldW = 300
  const h = row * rows
  const newW = per * unit
  const seam = x0 + oldW
  const cut = phase === 'cut' || phase === 'parts'
  const parts = phase === 'parts'
  const shift = cut ? 8 : 0
  const leftFill = cut ? C.tealSoft : C.orangeSoft
  const leftLine = cut ? C.teal : C.orange

  return (
    <svg viewBox="0 0 620 170" style={{ width: '100%', height: '100%', display: 'block' }} aria-hidden="true">
      <g stroke={C.ink3} strokeWidth="1.4">
        <line x1="42" y1={yTop} x2="42" y2={yTop + h} />
        <line x1="36" y1={yTop} x2="48" y2={yTop} />
        <line x1="36" y1={yTop + h} x2="48" y2={yTop + h} />
      </g>
      <text x="24" y={yTop + h / 2 + 6} textAnchor="middle" fontFamily={MONO} fontSize="16" fontWeight="700" fill={C.ink2}>{rows}</text>

      <g style={{ transform: 'translateX(' + -shift + 'px)', transition: 'transform .5s cubic-bezier(.3,0,.2,1)' }}>
        <rect x={x0} y={yTop} width={oldW} height={h} rx="6" fill={leftFill} stroke={leftLine} strokeWidth="2.4"
          style={{ transition: 'fill .5s ease, stroke .5s ease' }} />
        {[1, 2].map((r) => (
          <line key={r} x1={x0} y1={yTop + r * row} x2={x0 + oldW} y2={yTop + r * row} stroke={leftLine} strokeWidth="1" opacity=".3" />
        ))}
        <text x={x0 + oldW / 2} y={yTop - 10} textAnchor="middle" fontFamily={MONO} fontSize="20" fontWeight="700" fill={C.ink}>{label}</text>
        <g style={{ opacity: parts ? 1 : 0, transition: 'opacity .45s ease .25s' }}>
          <rect x={x0 + oldW / 2 - 42} y={yTop + h / 2 - 21} width="84" height="42" rx="10" fill={C.cardSolid} opacity=".9" />
          <text x={x0 + oldW / 2} y={yTop + h / 2 + 10} textAnchor="middle" fontFamily={MONO} fontSize="27" fontWeight="700" fill={C.teal}>
            {rows}{label}
          </text>
        </g>
      </g>

      <g style={{ transform: 'translateX(' + shift + 'px)', transition: 'transform .5s cubic-bezier(.3,0,.2,1)' }}>
        <rect x={seam} y={yTop} width={newW} height={h} rx="6" fill={C.orangeSoft} stroke={C.orange} strokeWidth="2.4" />
        {[0, 1, 2].map((r) =>
          Array.from({ length: per }).map((_, c) => (
            <rect key={r + '-' + c} x={seam + c * unit + 3} y={yTop + r * row + 3} width={unit - 6} height={row - 6} rx="3"
              fill={C.orange} style={{ opacity: parts ? 0.24 : 0, transition: 'opacity .2s ease', transitionDelay: (r * per + c) * 0.05 + 's' }} />
          )),
        )}
        {!parts ? [1, 2].map((r) => (
          <line key={'n' + r} x1={seam} y1={yTop + r * row} x2={seam + newW} y2={yTop + r * row} stroke={C.orange} strokeWidth="1" opacity=".3" />
        )) : null}
        <text x={seam + newW / 2} y={yTop - 10} textAnchor="middle" fontFamily={MONO} fontSize="20" fontWeight="700" fill={C.ink}>{per}</text>
        <g style={{ opacity: parts ? 1 : 0, transition: 'opacity .45s ease .25s' }}>
          <rect x={seam + newW / 2 - 42} y={yTop + h / 2 - 21} width="84" height="42" rx="10" fill={C.cardSolid} opacity=".9" />
          <text x={seam + newW / 2} y={yTop + h / 2 + 10} textAnchor="middle" fontFamily={MONO} fontSize="27" fontWeight="700" fill={C.orange}>
            {rows * per}
          </text>
        </g>
      </g>

      {/* Chokni yopadigan yamoq: butun figura ko'rinishi uchun */}
      <g style={{ opacity: cut ? 0 : 1, transition: 'opacity .3s ease' }}>
        <rect x={seam - 7} y={yTop - 2} width="14" height={h + 4} fill={C.orangeSoft} />
        <line x1={seam - 8} y1={yTop} x2={seam + 8} y2={yTop} stroke={C.orange} strokeWidth="2.4" />
        <line x1={seam - 8} y1={yTop + h} x2={seam + 8} y2={yTop + h} stroke={C.orange} strokeWidth="2.4" />
        {[1, 2].map((r) => (
          <line key={'s' + r} x1={seam - 8} y1={yTop + r * row} x2={seam + 8} y2={yTop + r * row} stroke={C.orange} strokeWidth="1" opacity=".3" />
        ))}
      </g>
      <line x1={seam} y1={yTop - 5} x2={seam} y2={yTop + h + 5} stroke={C.ink} strokeWidth="2" strokeDasharray="7 6"
        style={{ opacity: cut ? 1 : 0, transition: 'opacity .3s ease' }} />
    </svg>
  )
}

export default function Dars05v2({ lang: langProp = 'ru', onFinished, ttsApiBase }) {
  const [lang, setLang] = useState(langProp)
  useEffect(() => setLang(langProp), [langProp])
  // `useMobileZoom` `--g7z` ni yozadi -- shu sababli qobiq ham shu
  // o'zgaruvchini o'qiydi (bitta manba, ikkinchi nom kerak emas).
  useMobileZoom()
  const [screen, setScreen] = useState(0)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)
  const startedAt = useRef(Date.now())

  const onAnswer = useCallback((rec) => {
    setAnswers((prev) => prev.concat(rec))
  }, [])
  const next = useCallback(() => setScreen((s) => Math.min(s + 1, TOTAL - 1)), [])
  const prev = useCallback(() => setScreen((s) => Math.max(s - 1, 0)), [])
  const finish = useCallback(() => {
    setFinished(true)
    const payload = {
      lessonId: LESSON_ID,
      lessonTitle: tr(LESSON_TITLE, lang),
      lang,
      completed: true,
      durationSec: Math.floor((Date.now() - startedAt.current) / 1000),
      answers,
      freeNav: getFreeNav(),
    }
    if (onFinished) onFinished(payload)
    else console.log('[Dars05v2] onFinished', payload)
  }, [answers, lang, onFinished])

  const Current = SCREENS[screen]
  const tone = screen === 0 ? 'hook' : screen === 7 ? 'rule' : screen === TOTAL - 1 ? 'sum' : null

  return (
    <LangProvider value={lang}>
      <LangSetProvider value={setLang}>
        <style>{CSS}</style>
        <Current
          screen={screen}
          lang={lang}
          tone={tone}
          answers={answers}
          onAnswer={onAnswer}
          onNext={next}
          onPrev={prev}
          onFinish={finish}
          finished={finished}
          ttsApiBase={ttsApiBase}
        />
      </LangSetProvider>
    </LangProvider>
  )
}

// ============================================================================
// EKRAN 1. DINAMIK XUK. Ikki harakat: javobni tanlash, keyin kesish.
// Javob BAHOLANMAYDI (TZ). Qoralama ham YO'Q.
// ============================================================================
const S1 = {
  eyebrow: L('QAVSLARNI OCHISH', 'РАСКРЫТИЕ СКОБОК', 'EXPANDING BRACKETS'),
  title: L('Qavslarni nega ochamiz?', 'Зачем раскрывать скобки?', 'Why expand brackets?'),
  lead: L(
    "Kengligi uch metr issiqxona. Uzunligi a edi, yana besh metr qo'shildi.",
    'Теплица шириной три метра. Длина была a, пристроили ещё пять.',
    'A greenhouse three metres wide. It was a long, five more were added.',
  ),
  expr: '3(a + 5)',
  question: L('Yuza qanchaga oshdi?', 'На сколько выросла площадь?', 'By how much did the area grow?'),
  items: [
    { id: 'p15', label: L('15 kvadrat metrga', 'На 15 м²', 'By 15 sq m') },
    { id: 'p5', label: L('5 kvadrat metrga', 'На 5 м²', 'By 5 sq m') },
    { id: 'p3a', label: L('3a ga', 'На 3a', 'By 3a') },
    { id: 'unk', label: L("a noma'lum, bilib bo'lmaydi", 'Пока не знаем a, нельзя', 'Cannot tell without a') },
  ],
  cutBtn: L("Chok bo'yicha kesish", 'Разрезать по стыку', 'Cut along the joint'),
  saved: L('Taxmin yozildi', 'Догадка записана', 'Guess saved'),
  result: '3(a + 5) → 3a + 15',
  resultCap: L('Yuza bitta, yozuv ikkita', 'Площадь одна, а записи две', 'One area, two records'),
  audio: [
    A('mount', "Issiqxona kengligi uch metr, uzunligi a. Yana besh metr qo'shildi. Butun yuza uchni a plyus beshga ko'paytirganga teng. Sizningcha, yuza qanchaga oshdi?", 'Теплица шириной три метра, длиной a. Пристроили ещё пять. Вся площадь это три умножить на a плюс пять. Как думаешь, на сколько выросла площадь?', 'A greenhouse three metres wide, a metres long. Five more were added. The whole area is three times a plus five. By how much did the area grow?'),
    A('cut', "Endi chok bo'yicha kesamiz.", 'Теперь разрежем по стыку.', 'Now we cut along the joint.'),
    A('parts', "Yangi qism uch metrga besh metr, ya'ni o'n besh kvadrat metr. Qo'shimcha a ga bog'liq emas.", 'Новая часть три метра на пять, то есть пятнадцать квадратных метров. Прибавка не зависит от a.', 'The new part is three by five, that is fifteen square metres. The increase does not depend on a.'),
  ],
}

function Screen1({ screen, onAnswer, tone, ...rest }) {
  const t = useT()
  const audio = useAudio(useMemo(() => seg(S1.audio, rest.lang), [rest.lang]))
  const can = useInstructionGate(audio)
  const [picked, setPicked] = useState(null)
  const [phase, setPhase] = useState('whole')

  const cut = () => {
    setPhase('cut')
    audio.step('cut')
    setTimeout(() => { setPhase('parts'); audio.step('parts') }, 620)
  }

  return (
    <Shell eyebrow={S1.eyebrow} screen={screen} audio={audio} solved={!!picked} tone={tone} {...rest}>
      <h1 className="v2-h1">{t(S1.title)}</h1>
      {!picked ? <p className="v2-lead">{t(S1.lead)}</p> : null}

      <div style={{ height: 'clamp(96px, 22vh, 168px)' }}>
        <AreaModel phase={phase} />
      </div>

      <p className="v2-expr v2-expr-lg" style={{ color: C.orange, textAlign: 'center', margin: 0 }}>
        {phase === 'parts' ? S1.result : S1.expr}
      </p>
      {phase === 'parts' ? <p className="v2-lead v2-in" style={{ textAlign: 'center' }}>{t(S1.resultCap)}</p> : null}

      {!picked ? (
        <>
          <p className="v2-ask">{t(S1.question)}</p>
          <Cta done={!can} />
          <Choice
            items={S1.items}
            picked={null}
            wrong={[]}
            disabled={!can}
            onPick={(o) => { setPicked(o.id); onAnswer({ screen, role: 'hook', picked: o.id, correct: null }) }}
          />
        </>
      ) : null}

      {picked && phase === 'whole' ? (
        <div className="v2-in" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button type="button" className="v2-btn v2-btn-accent" onClick={cut}>{t(S1.cutBtn)}</button>
          <Cta kind="tap" />
          <span className="v2-lead">{t(S1.saved)}</span>
        </div>
      ) : null}
    </Shell>
  )
}

// ============================================================================
// EKRAN 2. UCH TAYANCH: amallar tartibi, ikki minus, o'xshash hadlar.
// Bir vaqtda BITTASI faol.
// ============================================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'BASICS'),
  title: L('Uch narsani eslaymiz', 'Вспомним три вещи', 'Three things to recall'),
  tasks: [
    {
      prompt: '3 · (4 + 5) =',
      solution: '= 27',
      step: L("Avval qavs ichi, keyin ko'paytirish.", 'Сначала скобка, потом умножение.', 'Brackets first, then multiply.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [
        { id: 'a', label: '27', correct: true },
        { id: 'b', label: '17', hint: L("Uchlik butun yig'indiga ko'paytiriladi.", 'Тройка умножается на всю сумму.', 'The three multiplies the whole sum.') },
        { id: 'c', label: '32', hint: L("Uchlik ko'paytiradi, qo'shilmaydi.", 'Тройка умножает, а не прибавляется.', 'The three multiplies, it is not added.') },
        { id: 'd', label: '12', hint: L('Qavsda ikki son bor, ikkisi ham qatnashadi.', 'В скобках два числа, оба участвуют.', 'Two numbers inside, both take part.') },
      ],
    },
    {
      prompt: '−(−4) =',
      solution: '= 4',
      step: L('Ikki minus plyus beradi.', 'Два минуса дают плюс.', 'Two minuses give a plus.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '−4', hint: L('Ishora ikki marta almashdi.', 'Знак поменялся дважды.', 'The sign flipped twice.') },
        { id: 'c', label: '0', hint: L("Minuslar sonni yo'qotmaydi, ishorani almashtiradi.", 'Минусы не уничтожают число, они меняют знак.', 'The minuses do not cancel the number, they flip the sign.') },
        { id: 'd', label: '8', hint: L("Bu ko'paytirish emas, ishora.", 'Это не умножение, а знак.', 'This is a sign, not a multiplication.') },
      ],
    },
    {
      prompt: '2a + 3a =',
      solution: '= 5a',
      step: L("O'xshash hadlar qo'shiladi.", 'Подобные слагаемые складываются.', 'Like terms add up.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [
        { id: 'a', label: '5a', correct: true },
        { id: 'b', label: '6a', hint: L("Bu qo'shish, ko'paytirish emas.", 'Это сложение, а не умножение.', 'This is addition, not multiplication.') },
        { id: 'c', label: '5a²', hint: L("Harf o'zgarmaydi, faqat oldidagi son qo'shiladi.", 'Буква не меняется, складываются только числа перед ней.', 'The letter stays, only the numbers add.') },
        { id: 'd', label: '23a', hint: L("Sonlar yonma-yon yozilmaydi, qo'shiladi.", 'Числа не приписываются рядом, а складываются.', 'The numbers are added, not written side by side.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Uch narsani eslaymiz. Birinchisi: amallar tartibi.', 'Вспомним три вещи. Первое: порядок действий.', 'Three things to recall. First: the order of operations.'),
    A('q2', 'Ikkinchisi: ikki minus.', 'Второе: два минуса.', 'Second: two minuses.'),
    A('q3', "Uchinchisi: o'xshash hadlar.", 'Третье: подобные слагаемые.', 'Third: like terms.'),
  ],
}

function Screen2({ screen, onAnswer, tone, ...rest }) {
  const t = useT()
  const audio = useAudio(useMemo(() => seg(S2.audio, rest.lang), [rest.lang]))
  const can = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Shell eyebrow={S2.eyebrow} screen={screen} audio={audio} solved={done} tone={tone} {...rest}>
      <h2 className="v2-h2">{t(S2.title)}</h2>
      <TaskRunner
        tasks={S2.tasks}
        disabled={!can}
        audio={audio}
        onItem={(r) => onAnswer({ screen, role: 'support', ...r })}
        onDone={() => setDone(true)}
      />
    </Shell>
  )
}

// ============================================================================
// EKRAN 3. SON QO'YISH. Chapda sonlar, bosilgach uch yozuv birin-ketin.
// ============================================================================
const S3 = {
  eyebrow: L('SON BILAN', 'ЧИСЛОМ', 'WITH A NUMBER'),
  title: L("a o'rniga son qo'yamiz", 'Подставим вместо a число', 'Substitute a number for a'),
  ask: L("Qaysi sonni qo'yamiz?", 'Какое число подставим?', 'Which number shall we use?'),
  numbers: [1, 2, 4, 10],
  rows: [
    { expr: '3(a + 5)', sub: (n) => '3(' + n + ' + 5)', val: (n) => 3 * (n + 5) },
    { expr: '3a + 15', sub: (n) => '3 · ' + n + ' + 15', val: (n) => 3 * n + 15 },
    { expr: '3a + 5', sub: (n) => '3 · ' + n + ' + 5', val: (n) => 3 * n + 5 },
  ],
  note: L(
    "Birinchi ikkitasi bir xil son berdi. Uchinchisi boshqa son berdi.",
    'Первые две дали одно и то же число. Третья дала другое.',
    'The first two give the same value. The third gives a different one.',
  ),
  audio: [
    A('mount', "a o'rniga son qo'yamiz. Sonni tanlang.", 'Подставим вместо a число. Выбери число.', 'Let us substitute a number for a. Choose a number.'),
    A('r1', "Boshlang'ich yozuv.", 'Исходная запись.', 'The original expression.'),
    A('r2', 'Ikkinchi yozuv ham xuddi shu sonni berdi.', 'Вторая запись дала то же число.', 'The second gives the same value.'),
    A('r3', 'Uchinchisi esa boshqa son berdi.', 'А третья дала другое число.', 'The third gives a different value.'),
  ],
}

function Screen3({ screen, onAnswer, tone, ...rest }) {
  const t = useT()
  const audio = useAudio(useMemo(() => seg(S3.audio, rest.lang), [rest.lang]))
  const can = useInstructionGate(audio)
  const [n, setN] = useState(null)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (n === null || shown >= S3.rows.length) return undefined
    const tmr = setTimeout(() => {
      setShown((k) => { audio.step('r' + (k + 1)); return k + 1 })
    }, shown === 0 ? 420 : 620)
    return () => clearTimeout(tmr)
  }, [n, shown]) // eslint-disable-line react-hooks/exhaustive-deps

  const allShown = shown >= S3.rows.length
  return (
    <Shell eyebrow={S3.eyebrow} screen={screen} audio={audio} solved={allShown} tone={tone} {...rest}>
      <h2 className="v2-h2">{t(S3.title)}</h2>
      {n === null ? (
        <>
          <p className="v2-ask">{t(S3.ask)}</p>
          <Cta done={!can} />
          <div className="v2-opts">
            {S3.numbers.map((v, i) => (
              <button
                key={v}
                type="button"
                className="v2-opt is-math"
                disabled={!can}
                onClick={() => { setN(v); onAnswer({ screen, role: 'explain', picked: String(v) }) }}
              >
                <b>{String.fromCharCode(65 + i)}</b>
                <span>{'a = ' + v}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="v2-card">
          {S3.rows.map((r, i) => {
            const on = i < shown
            const same = i < 2
            return (
              <div key={i} className={on ? 'v2-in' : ''} style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr) 26px minmax(0,1fr) 20px auto',
                alignItems: 'center', gap: 6, maxWidth: 640, opacity: on ? 1 : 0.18,
              }}>
                <span className="v2-expr v2-expr-sm">{r.expr}</span>
                <span style={{ color: C.ink3 }}>{'→'}</span>
                <span className="v2-expr v2-expr-sm">{on ? r.sub(n) : ''}</span>
                <span style={{ color: C.ink3 }}>{'='}</span>
                <span className="v2-expr v2-expr-md" style={{ color: on ? (same ? C.green : C.ink2) : 'transparent' }}>
                  {on ? r.val(n) : '?'}
                </span>
              </div>
            )
          })}
          {allShown ? <Fb tone="note" title={t(UI.note)}>{t(S3.note)}</Fb> : null}
        </div>
      )}
    </Shell>
  )
}

const SCREENS = [Screen1, Screen2, Screen3]
