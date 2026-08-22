// ============================================================================
// 8-sinf, ILIQ ALGEBRA LABORATORIYASI dizayn qatlami.
//
// Manba: artifacts/grade8-dars01-design/DESIGN_SPEC.md va preview.html
// (metodist 2026-08-11 da bergan maket). Bu qatlam AYNAN shu maketning
// tizimi: sut rangli fon, yorug' kartochkalar, katta formulalar, 16-24px
// radius, bitta ekranda bitta fikr.
//
// NIMA UCHUN ALOHIDA FAYL: `core.jsx` boshqa palitrada (11-sinf etaloni,
// apelsin akcент). Maket palitrasini `core.jsx` ga kiritish Dars03 va Dars07
// ni buzadi, darsning ichiga ko'chirish esa infratuzilmani ko'paytiradi
// (CLAUDE.md §5). Shuning uchun: dvijok (ovoz, til, zoom) `core.jsx` dan
// IMPORT qilinadi, ko'rinish shu yerda bir marta yoziladi.
//
// STYLES ichida BACKTICK ishlatilmaydi -- fayl buziladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { L, useT } from './core.jsx'

// ============================================================
// PALITRA. Maket bergan qiymatlar, o'zgartirilmaydi.
// ============================================================
export const LT = {
  milk: '#F4EFE6',
  paper: '#FFFCF7',
  ink: '#172224',
  muted: '#667174',
  line: '#D9D1C5',
  teal: '#147D79',
  tealSoft: '#DDEDEA',
  violet: '#6957A8',
  violetSoft: '#E9E4F5',
  coral: '#E76647',
  coralSoft: '#F8E4DC',
  green: '#2D7A56',
  greenSoft: '#E2F0E7',
  red: '#B64D45',
  redSoft: '#F7E2DE',
  shadow: '55,45,34',
}

export const LAB_UI = {
  sound: L('Ovoz', 'Озвучка', 'Sound'),
  back: L('Orqaga', 'Назад', 'Back'),
  next: L('Keyingi', 'Далее', 'Next'),
  finish: L('Yakunlash', 'Завершить', 'Finish'),
  hint: L("Yo'riq", 'Подсказка', 'Guide'),
  task: L('TOPSHIRIQ', 'ЗАДАНИЕ', 'TASK'),
  pickAnswer: L('Javobni tanlang', 'Выбери ответ', 'Choose an answer'),
  afterPick: L(
    "Tanlagandan keyin shu yerda izoh chiqadi.",
    'После выбора здесь появится комментарий.',
    'A comment will appear here after you choose.',
  ),
  help: L('Yordam', 'Подсказка', 'Help'),
  soundOn: L('Ovoz yoniq', 'Озвучка включена', 'Sound on'),
  soundOff: L("Ovoz o'chiq", 'Озвучка выключена', 'Sound off'),
  correct: L("to'g'ri", 'верно', 'correct'),
  wrong: L('qayta', 'не то', 'try again'),
  locked: L('yopiq', 'закрыто', 'locked'),
  done: L('bajarildi', 'сделано', 'done'),
  now: L('hozir', 'сейчас', 'now'),
  screenOf: L('ekran', 'экран', 'screen'),
}

const nn = (n) => (n < 10 ? '0' + n : String(n))

// ============================================================
// KARKAS: shapka (sinf, dars, mavzu, progress, ovoz) + sahna + pastki panel.
// Pastki panel: orqaga, qisqa kontekst yo'rig'i, davom.
// ============================================================
export const LabShell = ({
  lessonLabel, topic, screen, total, audio, hint, onPrev, onNext, nextLabel,
  nextReady, children,
}) => {
  const t = useT()
  const pct = ((screen + 1) / total) * 100
  return (
    <div className="g8l-shell">
      <header className="g8l-top">
        <div className="g8l-brand">
          <span className="g8l-mark" aria-hidden="true">8</span>
          <span className="g8l-brand-t">
            <strong>{t(lessonLabel)}</strong>
            <small>{t(topic)}</small>
          </span>
        </div>
        <div
          className="g8l-prog"
          role="img"
          aria-label={t(LAB_UI.screenOf) + ' ' + (screen + 1) + '/' + total}
        >
          <i style={{ width: pct + '%' }} />
        </div>
        <span className="g8l-count">{nn(screen + 1)} / {total}</span>
        <button
          type="button"
          className={'g8l-audio' + (audio.muted ? ' is-off' : '')}
          onClick={audio.toggleMute}
          aria-pressed={!audio.muted}
          aria-label={t(audio.muted ? LAB_UI.soundOff : LAB_UI.soundOn)}
        >
          <span className="g8l-waves" aria-hidden="true"><i /><i /><i /></span>
          <span>{t(LAB_UI.sound)}</span>
        </button>
      </header>

      <section className="g8l-stage">{children}</section>

      <footer className="g8l-foot">
        <button
          type="button"
          className="g8l-nav"
          onClick={onPrev}
          disabled={screen === 0}
          aria-label={t(LAB_UI.back)}
        >
          {'← '}{t(LAB_UI.back)}
        </button>
        <p className="g8l-hintline">
          <b>{t(LAB_UI.hint)}:</b>
          <span>{t(hint)}</span>
        </p>
        <button
          type="button"
          className={'g8l-nav is-primary' + (nextReady ? ' is-ready' : '')}
          onClick={onNext}
          disabled={!nextReady}
          aria-label={t(nextLabel || LAB_UI.next)}
        >
          {t(nextLabel || LAB_UI.next)}{' →'}
        </button>
      </footer>
    </div>
  )
}

// Ekran sarlavhasi. `em` -- firuza urg'u, maket bo'yicha.
export const Head = ({ eyebrow, title, em, lead }) => {
  const t = useT()
  return (
    <div className="g8l-head">
      <p className="g8l-eyebrow">{t(eyebrow)}</p>
      <h1 className="g8l-h1">
        {t(title)}{em ? <em>{' ' + t(em)}</em> : null}
      </h1>
      {lead ? <p className="g8l-lead">{t(lead)}</p> : null}
    </div>
  )
}

// IKKI QAVATLI kasr: chiziq bilan. `blocked` -- maxraj nolga aylandi.
export const Frac = ({ num, den, blocked, hot }) => (
  <span className={'g8l-frac' + (blocked ? ' is-blocked' : '') + (hot ? ' is-hot' : '')}>
    <span className="g8l-frac-n">{num}</span>
    <span className="g8l-frac-d">{den}</span>
  </span>
)

export const Tag = ({ children, tone }) => (
  <span className={'g8l-tag' + (tone ? ' is-' + tone : '')}>{children}</span>
)

export const Caption = ({ children }) => <p className="g8l-caption">{children}</p>

// Bosish kerak bo'lgan joyni ko'rsatuvchi kursor (maket: animatsion strelka).
export const Cursor = () => <span className="g8l-cursor" aria-hidden="true" />

// ============================================================
// VARIANTLAR. Rang YOLG'IZ ko'rsatkich emas: belgi ham, matn ham bor
// (accessibility talabi).
// ============================================================
const BADGE = ['A', 'B', 'C', 'D', 'E']

export const Options = ({ items, picked, wrongs, onPick, cols, disabled, compact }) => {
  const t = useT()
  // Metodist qoidasi 2026-08-11: to'rtta variant IKKI USTUNDA (2x2), qolgan
  // hollarda (ikki, uch, besh) hammasi BITTA QATORDA turadi.
  const auto = items.length === 4 ? 2 : items.length
  const columns = cols || auto
  return (
    <div
      className={'g8l-opts' + (compact ? ' is-compact' : '')}
      style={{ gridTemplateColumns: 'repeat(' + columns + ', minmax(0, 1fr))' }}
      role="group"
    >
      {items.map((item, i) => {
        const isPicked = picked === i
        const isWrong = (wrongs || []).indexOf(i) !== -1
        const cls = ['g8l-opt']
        if (isPicked) cls.push('is-correct')
        else if (isWrong) cls.push('is-wrong')
        return (
          <button
            type="button"
            key={i}
            className={cls.join(' ')}
            disabled={disabled || isWrong || picked !== null}
            onClick={() => onPick(i)}
          >
            <span className="g8l-opt-key" aria-hidden="true">
              {isPicked ? '✓' : isWrong ? '✕' : BADGE[i]}
            </span>
            <span className="g8l-opt-t">{t(item)}</span>
            {isPicked || isWrong ? (
              <span className="g8l-opt-state">{t(isPicked ? LAB_UI.correct : LAB_UI.wrong)}</span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

// Izoh maydoni. kind: 'ok' | 'bad' | 'plain'
// Balandlik CSS bilan beriladi (inline style media-so'rovni bosib ketardi, va
// past telefonda maydonni kichraytirish imkonsiz bo'lib qolardi).
export const Feedback = ({ kind = 'plain', children }) => (
  <div className={'g8l-fb is-' + kind} aria-live="polite">
    {children}
  </div>
)

// ============================================================
// QULFLANGAN RO'YXAT (2- va 8-ekran): qadamlar FAQAT navbat bilan ochiladi.
// Yopiq qadamni bosish hech narsa qilmaydi.
// ============================================================
export const LockedList = ({ items, opened, onOpen, render }) => {
  const t = useT()
  return (
    <div className="g8l-locked" role="list">
      {items.map((item, i) => {
        const done = i < opened
        const active = i === opened - 1
        const lockedNow = i > opened
        const isNext = i === opened
        return (
          <button
            type="button"
            key={i}
            role="listitem"
            className={
              'g8l-lock' + (done ? ' is-done' : '') + (active ? ' is-active' : '')
              + (lockedNow ? ' is-locked' : '') + (isNext ? ' is-next' : '')
            }
            disabled={lockedNow}
            aria-disabled={lockedNow}
            onClick={() => { if (!lockedNow) onOpen(i) }}
          >
            <span className="g8l-lock-h">
              <span className="g8l-lock-n" aria-hidden="true">{nn(i + 1)}</span>
              <span className="g8l-lock-t">{t(item.title)}</span>
              <span className="g8l-lock-s">
                {done ? '✓ ' + t(LAB_UI.done) : lockedNow ? t(LAB_UI.locked) : t(LAB_UI.now)}
              </span>
            </span>
            {done && item.body ? <span className="g8l-lock-b">{t(item.body)}</span> : null}
            {render ? render(i, done) : null}
          </button>
        )
      })}
    </div>
  )
}

// ============================================================
// QADAMBA-QADAM OCHILISH. Taymer bilan: har qadam ochilganda `onStep(i)`
// chaqiriladi -- ovoz bo'lagi AYNAN shu payt gapiradi (maket: audio_sync).
//
// `runKey` -- ochilish MANBASI (masalan tanlangan son). U o'zgarsa, kaskad
// noldan qaytadan boshlanadi: o'quvchi 3 dan keyin 0 ni bosса, qadamlar
// yangi son uchun qayta ochilishi kerak. `null`, `undefined` yoki `false`
// bo'lsa kaskad turadi. Nol -- HAQIQIY qiymat, u kaskadni ishga tushiradi.
// ============================================================
export function useStaged(total, runKey, ms = 520, onStep) {
  const [state, setState] = useState({ key: null, n: 0 })
  const cb = useRef(onStep)
  useEffect(() => { cb.current = onStep })
  useEffect(() => {
    if (runKey === null || runKey === undefined || runKey === false) return undefined
    let alive = true
    const timers = []
    for (let i = 1; i <= total; i += 1) {
      timers.push(setTimeout(() => {
        if (!alive) return
        setState({ key: runKey, n: i })
        if (cb.current) cb.current(i)
      }, i * ms))
    }
    return () => { alive = false; timers.forEach(clearTimeout) }
  }, [runKey, total, ms])
  return state.key === runKey ? state.n : 0
}

// Paydo bo'ladigan qatlam. Asosiy holat KO'RINADIGAN: animatsiya faqat
// kirishni bezaydi. `prefers-reduced-motion` da element shunchaki turadi
// (animatsiya bilan yashirilmaydi -- bu grade10 da tutilgan tuzoq).
export const Reveal = ({ show, children, className, delay }) => {
  if (!show) return null
  return (
    <div
      className={'g8l-reveal' + (className ? ' ' + className : '')}
      style={delay ? { animationDelay: delay + 'ms' } : undefined}
    >
      {children}
    </div>
  )
}

// ============================================================
// BESH TOPSHIRIQLI ZANJIR (9, 10, 11, 12, 14-ekranlar).
//
// Qoida: keyingi topshiriq FAQAT to'g'ri javobdan va izohdan keyin ochiladi
// (1.25 s). Xato javob -- o'sha variantning O'Z izohi, tayyor yechim YO'Q.
// Ikki xatodan keyin `helpNote` ochiladi (metodik profil: differensiatsiya).
// ============================================================
export const Sequence = ({ tasks, helpNote, method, onFirstTry, onDone, onOpen }) => {
  const t = useT()
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState([])
  const [picked, setPicked] = useState(null)
  const [wrongs, setWrongs] = useState([])
  const [fb, setFb] = useState(null)
  const timer = useRef(null)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const task = tasks[index]

  const pick = useCallback((i) => {
    if (picked !== null) return
    const right = i === task.correct
    if (right) {
      setPicked(i)
      setFb({ kind: 'ok', text: task.ok })
      if (onFirstTry) onFirstTry(index, wrongs.length === 0)
      const last = index === tasks.length - 1
      const nextDone = done.concat([index])
      setDone(nextDone)
      if (last) { if (onDone) onDone() }
      timer.current = setTimeout(() => {
        if (last) return
        setIndex(index + 1)
        setPicked(null)
        setWrongs([])
        setFb(null)
        if (onOpen) onOpen(index + 1)
      }, 1250)
      return
    }
    const nextWrongs = wrongs.concat([i])
    setWrongs(nextWrongs)
    setFb({ kind: 'bad', text: (task.hints && task.hints[i]) || task.hint, help: nextWrongs.length >= 2 })
  }, [picked, task, wrongs, done, index, tasks.length, onFirstTry, onDone, onOpen])

  return (
    <div className="g8l-seq">
      <div className="g8l-seq-tabs" role="list">
        {tasks.map((_, i) => {
          const isDone = done.indexOf(i) !== -1
          const isNow = i === index
          return (
            <span
              key={i}
              role="listitem"
              className={'g8l-seq-tab' + (isDone ? ' is-done' : isNow ? ' is-now' : ' is-locked')}
            >
              {t(LAB_UI.task)} {i + 1}{isDone ? ' ✓' : ''}
            </span>
          )
        })}
      </div>

      <div className="g8l-seq-card">
        <div className="g8l-seq-problem">
          <p className="g8l-seq-micro">{t(task.micro)}</p>
          <div className="g8l-seq-formula">{task.body}</div>
          {task.at ? <div className="g8l-seq-at">{task.at}</div> : null}
          {task.note ? <p className="g8l-seq-note">{t(task.note)}</p> : null}
          {/* USUL ko'z oldida turadi: variantni taxmin qilish emas, qadamni
              bajarish kerak. Metodist 2026-08-11: «dorabotay kak metodist». */}
          {method ? (
            <ol className="g8l-seq-method">
              {method.map((line, i) => (
                <li key={i}><b>{i + 1}</b>{t(line)}</li>
              ))}
            </ol>
          ) : null}
        </div>
        <div className="g8l-seq-answer">
          <h2 className="g8l-seq-h">{t(LAB_UI.pickAnswer)}</h2>
          <Options
            items={task.options}
            picked={picked}
            wrongs={wrongs}
            onPick={pick}
            compact
          />
          <Feedback kind={fb ? fb.kind : 'plain'}>
            {fb ? t(fb.text) : t(LAB_UI.afterPick)}
            {fb && fb.help && helpNote ? (
              <span className="g8l-help"><b>{t(LAB_UI.help)}:</b> {t(helpNote)}</span>
            ) : null}
          </Feedback>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// STYLES. Rasm YO'Q: fon, don, o'q -- hammasi CSS.
// ============================================================
export const LAB_STYLES = `
html:has(.g8l-root),
body:has(.g8l-root),
#root:has(.g8l-root),
.lesson-page:has(.g8l-root),
.lesson-frame:has(.g8l-root) {
  width: 100%;
  height: 100%;
  min-height: 0 !important;
  overflow: hidden !important;
  overscroll-behavior: none;
}
html, body { margin: 0; padding: 0; }
.g8l-root, .g8l-root * { box-sizing: border-box; }

.g8l-root {
  position: fixed;
  inset: 0;
  overflow: clip;
  overscroll-behavior: none;
  isolation: isolate;
  font-family: 'Manrope', system-ui, sans-serif;
  color: ${LT.ink};
  -webkit-font-smoothing: antialiased;
  zoom: var(--g8z, 1);
  /* Fon AYNAN maketdagi rang, ustida faqat CSS doni (rasm yo'q). */
  background: ${LT.milk};
}
@media (max-width: 639.98px) { .g8l-root { width: 390px; } }
/* Don: faqat CSS nuqtalari, rastr YO'Q. */
.g8l-grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: .2;
  background-image: radial-gradient(rgba(116,107,93,.75) .55px, transparent .6px);
  background-size: 7px 7px;
  mask-image: linear-gradient(to bottom, #000, transparent 78%);
  -webkit-mask-image: linear-gradient(to bottom, #000, transparent 78%);
}
.g8l-root h1, .g8l-root h2, .g8l-root h3, .g8l-root p { margin: 0; padding: 0; }
.g8l-root button { font: inherit; color: inherit; }
.g8l-root :focus-visible { outline: 2px solid ${LT.teal}; outline-offset: 3px; border-radius: 12px; }

/* ============ KARKAS ============ */
.g8l-shell {
  position: relative;
  z-index: 1;
  width: min(1290px, 100%);
  height: 100%;
  margin: 0 auto;
  padding: 0 clamp(12px, 3.2vw, 44px);
  display: flex;
  flex-direction: column;
}
/* Sayt qobig'i yuqori qatorni ikki tomondan bosadi: chapda darslar ro'yxati,
   o'ngda UZ/RU/EN tanlagichi. Ularni surib bo'lmaydi, faqat joy berish mumkin. */
@media (min-width: 1024px) { .g8l-top { padding-left: 96px; padding-right: 168px; } }
.g8l-top {
  flex-shrink: 0;
  min-height: clamp(46px, 7.6vh, 62px);
  display: flex;
  align-items: center;
  gap: clamp(9px, 1.5vw, 18px);
}
.g8l-brand { display: flex; align-items: center; gap: 10px; min-width: 0; flex-shrink: 0; }
.g8l-mark {
  width: clamp(28px, 2.4vw, 34px);
  height: clamp(28px, 2.4vw, 34px);
  border: 2px solid ${LT.ink};
  border-radius: 11px;
  display: grid;
  place-items: center;
  font: 700 15px 'JetBrains Mono', monospace;
  background: ${LT.paper};
  box-shadow: 3px 3px 0 ${LT.tealSoft};
  flex-shrink: 0;
}
.g8l-brand-t strong {
  display: block;
  font-size: clamp(10px, .85vw, 12px);
  letter-spacing: .13em;
  text-transform: uppercase;
  white-space: nowrap;
}
.g8l-brand-t small {
  display: block;
  margin-top: 1px;
  font-size: clamp(9px, .75vw, 11px);
  font-weight: 700;
  color: ${LT.muted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 26vw;
}
.g8l-prog {
  flex: 1;
  min-width: 40px;
  height: 8px;
  border-radius: 20px;
  background: #DED8CE;
  overflow: hidden;
}
.g8l-prog > i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, ${LT.teal}, #29A59D);
  transition: width .45s cubic-bezier(.2,.8,.2,1);
}
.g8l-count {
  flex-shrink: 0;
  font: 700 clamp(10px, .9vw, 12px) 'JetBrains Mono', monospace;
  color: ${LT.muted};
  font-variant-numeric: tabular-nums;
}
.g8l-audio {
  flex-shrink: 0;
  border: 1px solid #CFC7BA;
  background: rgba(255,252,247,.74);
  border-radius: 99px;
  padding: 8px 13px;
  font-size: clamp(10px, .85vw, 12px);
  font-weight: 800;
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
}
.g8l-waves { display: flex; align-items: flex-end; gap: 2px; height: 14px; }
.g8l-waves i {
  display: block;
  width: 2px;
  border-radius: 3px;
  background: ${LT.teal};
  animation: g8l-wave 1s ease-in-out infinite;
}
.g8l-waves i:nth-child(1) { height: 5px; }
.g8l-waves i:nth-child(2) { height: 12px; animation-delay: .12s; }
.g8l-waves i:nth-child(3) { height: 8px; animation-delay: .24s; }
.g8l-audio.is-off .g8l-waves i { animation: none; height: 3px; background: ${LT.muted}; }
@keyframes g8l-wave { 50% { transform: scaleY(.42); } }

.g8l-stage {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: clamp(4px, .9vh, 9px) 0 clamp(4px, .9vh, 10px);
  overflow: clip;
}
.g8l-foot {
  flex-shrink: 0;
  min-height: clamp(48px, 8.4vh, 66px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid rgba(23,34,36,.1);
}
.g8l-nav {
  border: 1px solid #CFC7BA;
  background: ${LT.paper};
  border-radius: 14px;
  padding: clamp(8px, 1.4vh, 12px) clamp(13px, 1.4vw, 20px);
  font-weight: 800;
  font-size: clamp(11px, .95vw, 14px);
  cursor: pointer;
  min-width: clamp(88px, 8vw, 112px);
  transition: transform .2s cubic-bezier(.2,.8,.2,1), box-shadow .2s;
}
.g8l-nav.is-primary { background: ${LT.ink}; color: ${LT.paper}; border-color: ${LT.ink}; }
.g8l-nav:disabled { opacity: .3; cursor: default; }
.g8l-nav:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 8px 18px -10px rgba(${LT.shadow},.6); }
.g8l-nav.is-ready:not(:disabled) { box-shadow: 0 0 0 3px rgba(20,125,121,.18); }
.g8l-hintline {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: clamp(10px, .9vw, 12px);
  font-weight: 700;
  color: ${LT.muted};
  text-align: center;
  min-width: 0;
}
.g8l-hintline b { color: ${LT.teal}; flex-shrink: 0; }

/* ============ SARLAVHA ============ */
.g8l-head { flex-shrink: 0; }
.g8l-eyebrow {
  font-size: clamp(9px, .78vw, 11px);
  letter-spacing: .18em;
  text-transform: uppercase;
  color: ${LT.teal};
  font-weight: 800;
  margin-bottom: 4px;
}
.g8l-h1 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(21px, 2.55vw, 40px);
  line-height: 1.04;
  letter-spacing: -.025em;
  font-weight: 600;
  max-width: 1050px;
}
.g8l-h1 em { font-style: normal; color: ${LT.teal}; }
.g8l-lead {
  font-size: clamp(11px, 1.05vw, 16px);
  line-height: 1.4;
  color: ${LT.muted};
  margin-top: 5px;
  max-width: 940px;
}
.g8l-body {
  flex: 1;
  min-height: 0;
  margin-top: clamp(6px, 1.4vh, 15px);
  display: flex;
  flex-direction: column;
  gap: clamp(6px, 1.1vh, 13px);
  overflow: clip;
}

/* ============ UMUMIY ELEMENTLAR ============ */
.g8l-card {
  background: rgba(255,252,247,.9);
  border: 1px solid ${LT.line};
  border-radius: clamp(14px, 1.4vw, 22px);
  box-shadow: 0 16px 44px -26px rgba(${LT.shadow},.5);
}
.g8l-f {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  letter-spacing: -.03em;
  font-size: clamp(15px, 1.5vw, 24px);
}
.g8l-f.is-big { font-size: clamp(18px, 2.1vw, 34px); }
.g8l-f.is-hero { font-size: clamp(24px, 3vw, 48px); }
.g8l-frac {
  display: inline-flex;
  flex-direction: column;
  vertical-align: middle;
  text-align: center;
  line-height: 1.08;
  min-width: 2.6em;
}
.g8l-frac-n { padding: 0 .32em .16em; border-bottom: 2px solid currentColor; }
.g8l-frac-d { padding: .16em .32em 0; }
.g8l-frac.is-blocked .g8l-frac-d { color: ${LT.red}; }
.g8l-frac.is-hot .g8l-frac-d { color: ${LT.coral}; }
.g8l-tag {
  display: inline-block;
  font: 700 clamp(9px, .78vw, 11px) 'JetBrains Mono', monospace;
  letter-spacing: .06em;
  border-radius: 99px;
  padding: 5px 10px;
  background: ${LT.tealSoft};
  color: ${LT.teal};
}
.g8l-tag.is-violet { background: ${LT.violetSoft}; color: ${LT.violet}; }
.g8l-tag.is-coral { background: ${LT.coralSoft}; color: #A54530; }
.g8l-caption {
  border-left: 3px solid ${LT.teal};
  padding: 7px 11px;
  background: rgba(221,237,234,.55);
  border-radius: 0 12px 12px 0;
  font-size: clamp(10px, .88vw, 13px);
  color: #385556;
  line-height: 1.35;
}
.g8l-cursor {
  width: 20px;
  height: 26px;
  display: inline-block;
  position: relative;
  flex-shrink: 0;
  filter: drop-shadow(0 3px 3px rgba(0,0,0,.2));
}
.g8l-cursor:before {
  content: "";
  position: absolute;
  inset: 0;
  background: ${LT.coral};
  clip-path: polygon(0 0, 0 86%, 24% 67%, 39% 100%, 53% 93%, 39% 62%, 68% 62%);
}
/* Bosish kerak bo'lgan element.
   IKKI TUZATISH (metodist, 2026-08-11):
   1. Ramka ICHKARIDA: tashqi ramka qo'shni kartochka va izoh ustiga chiqib,
      matnni bosib turardi.
   2. Pulsatsiya CHEKLANGAN: besh marta chaqnab to'xtaydi, keyin tinch statik
      ramka qoladi. Cheksiz miltillash diqqatni chalg'itadi va bezdiradi. */
/* Metodist qarori 2026-08-11: MIGLASH YO'Q. Bosish kerak bo'lgan element
   TINCH statik ramka bilan belgilanadi, hech qanday animatsiya yo'q --
   javob variantlari bor ekranlarda miltillash e'tiborni buzadi. */
.g8l-pulse {
  position: relative;
  outline: 2px solid ${LT.coral};
  outline-offset: -1px;
}
.g8l-reveal { animation: g8l-up .42s cubic-bezier(.2,.8,.2,1) both; }
@keyframes g8l-up { from { opacity: 0; transform: translateY(9px); } }
.g8l-screen { animation: g8l-in .45s ease both; display: flex; flex-direction: column; height: 100%; min-height: 0; }
@keyframes g8l-in { from { opacity: 0; transform: translateY(10px); } }

/* ============ VARIANTLAR ============ */
.g8l-opts { display: grid; gap: clamp(6px, .9vh, 9px); }
.g8l-opt {
  border: 1px solid ${LT.line};
  background: ${LT.paper};
  border-radius: 15px;
  padding: clamp(8px, 1.3vh, 13px) clamp(9px, .9vw, 15px);
  font-weight: 800;
  font-size: clamp(11px, .95vw, 14px);
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: transform .2s cubic-bezier(.2,.8,.2,1), border-color .2s, background .2s;
}
.g8l-opts.is-compact .g8l-opt { padding: clamp(7px, 1.1vh, 11px) 11px; }
.g8l-opt:not(:disabled):hover { transform: translateY(-2px); border-color: ${LT.teal}; }
.g8l-opt:disabled { cursor: default; }
.g8l-opt-key {
  width: 27px;
  height: 27px;
  border-radius: 9px;
  background: ${LT.tealSoft};
  color: ${LT.teal};
  display: grid;
  place-items: center;
  font: 700 12px 'JetBrains Mono', monospace;
  flex: 0 0 auto;
}
.g8l-opt-t { font-family: 'JetBrains Mono', monospace; letter-spacing: -.02em; min-width: 0; }
.g8l-opt-state {
  margin-left: auto;
  font-size: 10px;
  letter-spacing: .1em;
  text-transform: uppercase;
  flex-shrink: 0;
}
.g8l-opt.is-correct { border-color: ${LT.green}; background: ${LT.greenSoft}; color: #1E5C3F; }
.g8l-opt.is-correct .g8l-opt-key { background: ${LT.green}; color: #fff; }
.g8l-opt.is-wrong { border-color: ${LT.red}; background: ${LT.redSoft}; color: #7C342F; opacity: .92; }
.g8l-opt.is-wrong .g8l-opt-key { background: ${LT.red}; color: #fff; }
.g8l-fb {
  border-radius: 14px;
  padding: clamp(8px, 1.2vh, 12px) 13px;
  font-size: clamp(10px, .9vw, 13px);
  font-weight: 700;
  line-height: 1.4;
  background: #EEE9E1;
  color: ${LT.muted};
}
.g8l-fb.is-ok { background: ${LT.greenSoft}; color: #215B40; }
.g8l-fb.is-bad { background: ${LT.redSoft}; color: #7C342F; }
.g8l-help { display: block; margin-top: 6px; color: #6B4A2C; }
.g8l-help b { color: ${LT.coral}; }

/* ============ QULFLANGAN RO'YXAT ============ */
.g8l-locked { display: flex; flex-direction: column; gap: clamp(5px, .8vh, 9px); }
.g8l-lock {
  border: 1px solid ${LT.line};
  background: ${LT.paper};
  border-radius: 15px;
  padding: clamp(8px, 1.2vh, 12px) clamp(10px, 1vw, 14px);
  text-align: left;
  cursor: pointer;
  transition: background .22s, border-color .22s, box-shadow .22s;
}
.g8l-lock-h { display: flex; align-items: center; gap: 10px; font-weight: 800; }
.g8l-lock-n {
  width: 28px;
  height: 28px;
  border-radius: 9px;
  background: #ECE6DC;
  display: grid;
  place-items: center;
  font: 700 11px 'JetBrains Mono', monospace;
  flex: 0 0 auto;
}
.g8l-lock-t { font-size: clamp(11px, .95vw, 14px); min-width: 0; }
.g8l-lock-s {
  margin-left: auto;
  font-size: 9px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: ${LT.muted};
  flex-shrink: 0;
}
.g8l-lock-b {
  display: block;
  margin: 6px 0 0 38px;
  font-size: clamp(10px, .85vw, 12px);
  font-weight: 600;
  line-height: 1.4;
  color: #456466;
}
.g8l-lock.is-next { border-color: ${LT.coral}; box-shadow: 0 0 0 3px rgba(231,102,71,.16); }
.g8l-lock.is-done { background: ${LT.tealSoft}; border-color: rgba(20,125,121,.35); }
.g8l-lock.is-done .g8l-lock-n { background: ${LT.teal}; color: #fff; }
.g8l-lock.is-done .g8l-lock-s { color: ${LT.teal}; }
.g8l-lock.is-locked { opacity: .4; cursor: not-allowed; }

/* ============ BESHLIK ZANJIR ============ */
/* Boks kontent balandligida: sahnani to'ldirib cho'zilmaydi (metodist
   2026-08-11: «боксы очень большие по размеру»). */
.g8l-seq { flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: flex-start; gap: clamp(6px, 1vh, 11px); }
.g8l-seq-tabs { display: grid; grid-template-columns: repeat(5, 1fr); gap: 7px; flex-shrink: 0; }
.g8l-seq-tab {
  border: 1px solid ${LT.line};
  background: rgba(255,252,247,.65);
  border-radius: 13px;
  padding: clamp(6px, 1vh, 11px) 4px;
  text-align: center;
  font: 700 clamp(8px, .72vw, 10px) 'JetBrains Mono', monospace;
  letter-spacing: .04em;
  color: ${LT.muted};
}
.g8l-seq-tab.is-now { background: ${LT.teal}; color: #fff; border-color: ${LT.teal}; }
.g8l-seq-tab.is-done { background: ${LT.greenSoft}; color: ${LT.green}; border-color: #BFD8C9; }
.g8l-seq-tab.is-locked { opacity: .45; }
.g8l-seq-card {
  flex: 0 0 auto;
  min-height: 0;
  align-items: stretch;
  display: grid;
  grid-template-columns: .82fr 1.18fr;
  gap: clamp(9px, 1.2vw, 17px);
  padding: clamp(10px, 1.5vh, 17px);
  background: rgba(255,252,247,.9);
  border: 1px solid ${LT.line};
  border-radius: clamp(14px, 1.4vw, 22px);
  box-shadow: 0 16px 44px -26px rgba(${LT.shadow},.5);
}
.g8l-seq-problem {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: clamp(8px, 1.4vh, 16px);
  background: #EEE9E1;
  border-radius: 18px;
  padding: clamp(10px, 1.6vh, 18px);
  min-width: 0;
}
.g8l-seq-micro { font-size: clamp(9px, .85vw, 12px); font-weight: 700; color: ${LT.muted}; }
.g8l-seq-formula {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: clamp(15px, 1.85vw, 30px);
  letter-spacing: -.03em;
  line-height: 1.25;
}
/* x ning qiymati ALOHIDA SATRDA turadi: formulaning yonida u yozuvni
   uzib ko'rsatadi (metodist 2026-08-11, 11-ekran). */
.g8l-seq-at {
  margin-top: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: clamp(12px, 1.3vw, 20px);
  color: ${LT.teal};
}
.g8l-seq-note { font-size: clamp(9px, .82vw, 12px); line-height: 1.4; color: #5B6668; font-weight: 600; }
/* Yechish usuli: uch qadam, doim ko'rinib turadi. */
.g8l-seq-method {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  max-width: 260px;
}
.g8l-seq-method li {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 9px;
  border-radius: 11px;
  background: rgba(255,252,247,.85);
  color: #3F5557;
  font-size: clamp(9px, .8vw, 12px);
  font-weight: 700;
  line-height: 1.3;
  text-align: left;
}
.g8l-seq-method b {
  width: 17px;
  height: 17px;
  border-radius: 6px;
  background: ${LT.tealSoft};
  color: ${LT.teal};
  display: grid;
  place-items: center;
  font: 700 9px 'JetBrains Mono', monospace;
  flex: 0 0 auto;
}
.g8l-seq-answer { display: flex; flex-direction: column; justify-content: center; gap: clamp(6px, .9vh, 10px); min-width: 0; }
.g8l-seq-h {
  font-size: clamp(11px, .95vw, 15px);
  font-weight: 800;
  font-family: 'Manrope', sans-serif;
}

/* Telefonda o'sha qobiq yuqori 56 pikselni butunlay egallaydi (fixed,
   z-index 1000), shuning uchun shapkaga joy beriladi va sarlavha shkalasi
   bir pog'ona pasayadi -- aks holda dars nomi tanlagich ostida qoladi. */
@media (max-width: 1023.98px) {
  /* Qobiq tugmasi 44px + 8px chekka = 52px. Shundan kam bo'lsa dars nomi
     «Darslar ro'yxati» tugmasi ostida qolib ketadi. */
  .g8l-top { padding-top: 52px; }
}
@media (max-width: 700px) {
  /* Usul qadamlari YOTIQ qatorga o'tadi: uchtasi ham qoladi, faqat zichlashadi.
     Qadamni yashirish mumkin emas -- u yechishning o'zi. */
  .g8l-seq-method { max-width: none; flex-direction: row; flex-wrap: wrap; gap: 4px; justify-content: center; }
  .g8l-seq-method li { padding: 4px 7px; font-size: 9px; border-radius: 9px; gap: 5px; }
  .g8l-seq-method b { width: 14px; height: 14px; font-size: 8px; }
}
@media (max-width: 639.98px) {
  .g8l-h1 { font-size: 18px; }
  .g8l-lead { font-size: 10.5px; margin-top: 3px; }
  .g8l-eyebrow { font-size: 8px; margin-bottom: 2px; }
  /* Chiziqli progress telefonda ingichka bo'lakka aylanadi va o'qilmaydi:
     hisoblagich (01 / 15) o'sha ma'lumotni beradi. */
  .g8l-prog { display: none; }
  .g8l-brand-t small { max-width: 44vw; }
  /* Yo'riq ikki satrga o'tsa, tugmalar torayib ketmasligi kerak. */
  .g8l-nav { flex-shrink: 0; white-space: nowrap; }
  /* Telefonda yo'riq bitta qatorga siqiladi: «Yo'riq:» yorlig'i olib
     tashlanadi, matnning o'zi qoladi. */
  .g8l-hintline { font-size: 9px; line-height: 1.25; }
  .g8l-hintline b { display: none; }
}

/* HAQIQIY telefonda kontentga ~660 px qoladi (yuqorida holat qatori, pastda
   brauzer paneli). 745 px bilan sinash yetarli EMAS -- 10-sinfda shu xato
   tutilgan. Zich tir: yetakchi matn olib tashlanadi, variantlar va izohlar
   bir pog'ona kichrayadi. */
@media (max-width: 700px) and (max-height: 700px) {
  .g8l-top { padding-top: 50px; min-height: 40px; }
  .g8l-h1 { font-size: 15.5px; }
  .g8l-lead { display: none; }
  .g8l-foot { min-height: 42px; }
  .g8l-opt { padding: 6px 9px; font-size: 10.5px; border-radius: 12px; }
  .g8l-opt-key { width: 21px; height: 21px; border-radius: 7px; font-size: 10px; }
  .g8l-opts.is-compact .g8l-opt { padding: 5px 8px; }
  .g8l-fb { padding: 6px 9px; font-size: 9.5px; }
  .g8l-seq-answer .g8l-fb { min-height: 46px; }
  .g8l-seq-tab { padding: 5px 3px; border-radius: 10px; }
  .g8l-lock { padding: 6px 9px; border-radius: 12px; }
  .g8l-lock-n { width: 22px; height: 22px; border-radius: 7px; font-size: 10px; }
  .g8l-caption { display: none; }
  .g8l-seq-method li { padding: 3px 6px; font-size: 8.5px; }
}

/* ============ HARAKATNI KAMAYTIRISH ============ */
@media (prefers-reduced-motion: reduce) {
  .g8l-root *, .g8l-root *:before, .g8l-root *:after {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
  }
}
`
