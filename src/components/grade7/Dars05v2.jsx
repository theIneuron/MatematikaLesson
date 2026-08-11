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
const LESSON_BRAND = L('MATEMATIKA · 5-DARS', 'МАТЕМАТИКА · УРОК 5', 'MATHEMATICS · LESSON 5')
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
  dark: '#141C1E',
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

.v2-stage {
  max-width: 1290px; height: 100%; margin: 0 auto;
  padding: 0 clamp(14px, 2.6vw, 34px);
  display: flex; flex-direction: column;
}

/* ---------- SHAPKA ---------- */
.v2-head { flex-shrink: 0; padding-top: clamp(10px, 1.6vh, 16px); }
/* Sayt qobig'i chapga «Darslar ro'yxati», o'ngga til almashtirgichini
   qo'yadi -- ikkisi ham shapkani yopib qo'yardi. Keng ekranda joy beramiz. */
@media (min-width: 1024px) {
  .v2-head { padding-left: 210px; padding-right: 150px; }
}
.v2-headrow { display: flex; align-items: flex-start; gap: clamp(14px, 2vw, 28px); }
.v2-brand { display: flex; align-items: center; gap: 11px; flex-shrink: 0; }
.v2-badge {
  width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
  background: ${C.dark}; color: #FFF;
  display: flex; align-items: center; justify-content: center;
  font-family: ${MONO}; font-size: 14px; font-weight: 800;
  box-shadow: inset 0 0 0 2px rgba(255,255,255,.18);
}
.v2-brand span {
  font-size: clamp(11px, 1.2vw, 13px); font-weight: 800;
  letter-spacing: .13em; text-transform: uppercase; color: ${C.ink};
  white-space: nowrap;
}
.v2-progwrap { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; padding-top: 5px; }
.v2-segs { display: flex; gap: 6px; }
.v2-seg { flex: 1; height: 5px; border-radius: 99px; background: rgba(24,34,36,.12); transition: background .24s ease; }
.v2-seg.is-done { background: ${C.teal}; }
.v2-seg.is-now { background: ${C.orange}; }
.v2-progrow { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.v2-section {
  font-size: clamp(10px, 1.1vw, 11.5px); font-weight: 800;
  letter-spacing: .18em; text-transform: uppercase; color: ${C.ink3};
}
.v2-count { font-family: ${MONO}; font-size: 12.5px; font-weight: 700; color: ${C.ink3}; }
.v2-tools { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.v2-tool {
  height: 36px; min-width: 36px; padding: 0 10px; border-radius: 11px;
  border: none; cursor: pointer; background: ${C.cardSolid}; color: ${C.ink2};
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  font-family: ${UIF}; font-size: 13px; font-weight: 700;
  box-shadow: 0 6px 16px -12px rgba(24,34,36,.5), inset 0 0 0 1px ${C.line};
  transition: color .18s ease, background .18s ease;
}
.v2-tool:hover { color: ${C.ink}; }
.v2-tool:active { background: ${C.tealSoft}; }
.v2-tool:focus-visible { outline: 3px solid ${C.orange}; outline-offset: 2px; }
.v2-tool.is-off { color: ${C.ink3}; }

/* ---------- ISH MAYDONI ---------- */
.v2-body { flex: 1; min-height: 0; overflow: clip; display: flex; flex-direction: column; padding: clamp(6px, 1.2vh, 14px) 0; }
.v2-col { margin-block: auto; display: flex; flex-direction: column; gap: clamp(7px, 1.2vh, 13px); min-height: 0; }

.v2-titlerow { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.v2-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: clamp(10px, 1.1vw, 11.5px); font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: ${C.orange}; }
.v2-eyebrow i { width: 22px; height: 2px; background: ${C.orange}; flex-shrink: 0; }
.v2-chip {
  display: inline-flex; align-items: center; gap: 8px; flex-shrink: 0;
  padding: 6px 14px; border-radius: 999px;
  background: ${C.tealSoft}; color: ${C.teal};
  font-size: clamp(10px, 1.1vw, 11.5px); font-weight: 800;
  letter-spacing: .13em; text-transform: uppercase; white-space: nowrap;
}

/* Ikki ustun: chapda ko'rsatma va savol, o'ngda model yoki yordam */
.v2-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: clamp(12px, 1.8vw, 26px); align-items: start; min-height: 0; }
@media (max-width: 899.98px) { .v2-two { grid-template-columns: minmax(0, 1fr); } }
.v2-side { display: flex; flex-direction: column; gap: clamp(6px, 1vh, 11px); min-width: 0; }

/* ---------- OVOZ POLOSASI ---------- */
.v2-audio {
  display: flex; align-items: center; gap: 13px; min-width: 0;
  padding: clamp(8px, 1.2vw, 13px) clamp(12px, 1.6vw, 18px);
  border-radius: 14px; background: ${C.dark}; color: #FFF;
}
.v2-audio-play {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; border: none;
  background: ${C.orange}; color: #FFF; cursor: pointer;
  display: flex; align-items: center; justify-content: center; font-size: 12px;
}
.v2-audio-play:focus-visible { outline: 3px solid #FFF; outline-offset: 2px; }
.v2-audio-txt { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.v2-audio-txt b { font-size: clamp(13px, 1.6vw, 15px); font-weight: 800; }
.v2-audio-txt i { font-style: normal; font-size: clamp(11px, 1.3vw, 12.5px); color: rgba(255,255,255,.62); }
.v2-wave { display: flex; align-items: flex-end; gap: 3px; height: 18px; flex-shrink: 0; }
.v2-wave s { width: 3px; border-radius: 2px; background: ${C.teal}; text-decoration: none; animation: v2-wave 1s ease-in-out infinite; }
.v2-wave s:nth-child(1) { height: 8px; animation-delay: 0s; }
.v2-wave s:nth-child(2) { height: 15px; animation-delay: .12s; }
.v2-wave s:nth-child(3) { height: 11px; animation-delay: .24s; }
.v2-wave s:nth-child(4) { height: 17px; animation-delay: .36s; }
.v2-wave s:nth-child(5) { height: 9px; animation-delay: .48s; }
@keyframes v2-wave { 0%,100% { transform: scaleY(.5); } 50% { transform: scaleY(1); } }
.v2-wave.is-off s { animation: none; opacity: .32; }

/* ---------- KARTOCHKALAR ---------- */
.v2-card {
  position: relative; min-width: 0;
  background: ${C.cardSolid}; border-radius: 18px;
  padding: clamp(11px, 1.6vw, 20px) clamp(13px, 1.9vw, 24px);
  box-shadow: 0 18px 44px -34px rgba(24,34,36,.55), inset 0 0 0 1px ${C.line};
  display: flex; flex-direction: column; gap: clamp(6px, 1vh, 11px);
}
.v2-card-cap { font-size: clamp(10px, 1.1vw, 11.5px); font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: ${C.ink3}; }
.v2-mark { position: absolute; right: 14px; bottom: 9px; font-family: ${MONO}; font-size: 10px; letter-spacing: .18em; color: rgba(24,34,36,.16); }
.v2-pill {
  align-self: flex-start; padding: 4px 12px; border-radius: 999px;
  background: ${C.orangeSoft}; color: ${C.orange};
  font-size: clamp(10px, 1.1vw, 11.5px); font-weight: 800; letter-spacing: .12em; text-transform: uppercase;
}

/* ---------- MATNLAR ---------- */
.v2-h1 { margin: 0; font-family: ${SERIF}; font-weight: 600; line-height: 1.04; letter-spacing: -.02em; font-size: clamp(26px, 3.6vw, 42px); }
.v2-h2 { margin: 0; font-family: ${SERIF}; font-weight: 600; line-height: 1.08; font-size: clamp(21px, 2.7vw, 31px); }
.v2-lead { margin: 0; color: ${C.ink2}; font-size: clamp(13px, 1.6vw, 15.5px); line-height: 1.45; }
.v2-ask { margin: 0; font-weight: 700; font-size: clamp(15px, 1.9vw, 17.5px); line-height: 1.3; }
.v2-expr { font-family: ${MONO}; font-weight: 700; letter-spacing: -.01em; }
.v2-expr-xl { font-size: clamp(28px, 4vw, 46px); }
.v2-expr-lg { font-size: clamp(21px, 2.8vw, 32px); }
.v2-expr-md { font-size: clamp(17px, 2.1vw, 25px); }
.v2-expr-sm { font-size: clamp(13px, 1.6vw, 17px); }

/* ---------- HARAKAT BELGISI ---------- */
.v2-cta {
  display: flex; align-items: center; gap: 10px; align-self: stretch;
  padding: 9px 14px; border-radius: 12px;
  background: ${C.orangeSoft}; color: ${C.orange};
  font-size: clamp(12px, 1.5vw, 14px); font-weight: 800;
}
.v2-cta i { width: 9px; height: 9px; border-radius: 50%; background: ${C.orange}; flex-shrink: 0; animation: v2-pulse 1.9s ease-out infinite; }
@keyframes v2-pulse {
  0% { box-shadow: 0 0 0 0 rgba(231,90,44,.5); }
  70% { box-shadow: 0 0 0 9px rgba(231,90,44,0); }
  100% { box-shadow: 0 0 0 0 rgba(231,90,44,0); }
}

/* ---------- VARIANTLAR ---------- */
.v2-opts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
@media (max-width: 639.98px) { .v2-opts { grid-template-columns: minmax(0, 1fr); gap: 7px; } }
.v2-opt {
  display: flex; align-items: center; gap: 11px; min-width: 0; overflow: hidden;
  min-height: clamp(48px, 4.6vw, 56px);
  padding: clamp(9px, 1.3vw, 12px) clamp(12px, 1.7vw, 16px);
  border: none; border-radius: 13px; cursor: pointer; text-align: left;
  background: ${C.cardSolid}; color: ${C.ink};
  font-family: ${UIF}; font-size: clamp(13.5px, 1.7vw, 15.5px); font-weight: 700;
  box-shadow: 0 10px 24px -20px rgba(24,34,36,.55), inset 0 0 0 1px ${C.line};
  transition: transform .18s ease, box-shadow .18s ease, background .2s ease,
              opacity .42s ease, max-height .5s ease, min-height .5s ease, padding .38s ease;
}
.v2-opt:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 16px 30px -20px rgba(24,34,36,.6), inset 0 0 0 1px ${C.line}; }
.v2-opt:active:not(:disabled) { transform: translateY(0); background: #FBFAF7; }
.v2-opt:focus-visible { outline: 3px solid ${C.orange}; outline-offset: 2px; }
.v2-opt:disabled { cursor: default; }
.v2-opt b {
  flex-shrink: 0; width: 22px; height: 22px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(24,34,36,.06); color: ${C.ink3};
  font-family: ${MONO}; font-size: 11.5px; font-weight: 800;
}
.v2-opt span { min-width: 0; overflow-wrap: anywhere; }
.v2-opt.is-math span { font-family: ${MONO}; font-weight: 700; font-size: 1.03em; }
.v2-opt.is-ok { background: ${C.greenSoft}; box-shadow: inset 0 0 0 2px ${C.green}; }
.v2-opt.is-ok b { background: ${C.green}; color: #FFF; }
.v2-opt.is-bad { background: ${C.amberSoft}; box-shadow: inset 0 0 0 2px ${C.amber}; }
.v2-opt.is-bad b { background: ${C.amber}; color: #FFF; }
.v2-opt.is-gone { opacity: 0; max-height: 0; min-height: 0; padding-top: 0; padding-bottom: 0; pointer-events: none; }

/* ---------- IZOH ---------- */
.v2-fb {
  display: flex; flex-direction: column; gap: 3px;
  padding: clamp(9px, 1.3vw, 13px) clamp(11px, 1.6vw, 16px);
  border-radius: 12px; border-left: 4px solid transparent;
  animation: v2-in .24s ease-out both;
}
.v2-fb-ok { background: ${C.greenSoft}; border-left-color: ${C.green}; }
.v2-fb-tip { background: ${C.amberSoft}; border-left-color: ${C.amber}; }
.v2-fb-note { background: ${C.tealSoft}; border-left-color: ${C.teal}; }
.v2-fb i { font-style: normal; font-size: clamp(10px, 1.1vw, 11.5px); font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
.v2-fb-ok i { color: ${C.green}; }
.v2-fb-tip i { color: ${C.amber}; }
.v2-fb-note i { color: ${C.teal}; }
.v2-fb p { margin: 0; font-size: clamp(13px, 1.6vw, 15px); line-height: 1.42; color: ${C.ink}; }

/* ---------- TUGMALAR ---------- */
.v2-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 46px; padding: 0 clamp(16px, 2.2vw, 26px);
  border: none; border-radius: 999px; cursor: pointer;
  font-family: ${UIF}; font-size: clamp(13.5px, 1.6vw, 15.5px); font-weight: 800;
  transition: transform .18s ease, box-shadow .18s ease, background .2s ease, opacity .2s ease;
}
.v2-btn-accent { background: ${C.orange}; color: #FFF; box-shadow: 0 14px 28px -16px rgba(231,90,44,.8); }
.v2-btn-dark { background: ${C.dark}; color: #FFF; box-shadow: 0 14px 30px -18px rgba(24,34,36,.9); }
.v2-btn-soft { background: ${C.cardSolid}; color: ${C.teal}; box-shadow: inset 0 0 0 1px ${C.line}; }
.v2-btn-ghost { background: transparent; color: ${C.ink2}; box-shadow: none; }
.v2-btn:hover:not(:disabled) { transform: translateY(-1px); }
.v2-btn-ghost:hover:not(:disabled) { color: ${C.ink}; transform: none; }
.v2-btn:active:not(:disabled) { transform: translateY(1px); }
.v2-btn:focus-visible { outline: 3px solid ${C.orange}; outline-offset: 3px; }
.v2-btn:disabled { opacity: .42; cursor: default; }

/* ---------- QADAMLAR 01-05 ---------- */
.v2-steps { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 9px; }
.v2-step {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 9px 13px; border-radius: 12px; min-width: 0;
  background: rgba(24,34,36,.05); color: ${C.ink3};
  font-family: ${MONO}; font-size: 13px; font-weight: 800;
}
.v2-step em { font-style: normal; font-family: ${UIF}; font-size: 10.5px; font-weight: 700; letter-spacing: .06em; }
.v2-step.is-done { background: ${C.greenSoft}; color: ${C.green}; }
.v2-step.is-now { background: ${C.dark}; color: #FFF; }

/* ---------- YECHILGAN QATOR ---------- */
.v2-done {
  display: flex; align-items: center; gap: 9px; min-width: 0;
  padding: 6px 13px; border-radius: 10px;
  background: ${C.greenSoft}; color: ${C.green};
  font-family: ${MONO}; font-weight: 700; font-size: clamp(12.5px, 1.5vw, 14.5px);
  animation: v2-in .24s ease-out both;
}
.v2-done s { text-decoration: none; flex-shrink: 0; }

/* ---------- PASTKI PANEL ---------- */
.v2-nav { flex-shrink: 0; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px; padding: clamp(8px, 1.4vh, 14px) 0; }
.v2-dots { display: flex; align-items: center; gap: 7px; justify-self: center; }
.v2-dot { width: 7px; height: 7px; border-radius: 99px; background: rgba(24,34,36,.16); transition: all .24s ease; }
.v2-dot.is-now { width: 26px; background: ${C.orange}; }
.v2-nav-r { justify-self: end; }

@keyframes v2-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.v2-in { animation: v2-in .24s ease-out both; }
.v2-slow { animation: v2-in .52s cubic-bezier(.22,.61,.36,1) both; }

@media (prefers-reduced-motion: reduce) {
  .v2-root, .v2-fill, .v2-opt, .v2-btn, .v2-seg, .v2-dot { transition: none !important; }
  .v2-in, .v2-slow, .v2-fb, .v2-done { animation: none !important; }
  .v2-cta i, .v2-wave s { animation: none; }
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
  notes: L('Qoralama', 'Заметки', 'Notes'),
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

// Ovoz polosasi: hozirgi qisqa replika va keyingi qadam (maket bo'yicha).
const AudioBar = ({ audio, title, sub }) => {
  const t = useT()
  return (
    <div className="v2-audio">
      <button type="button" className="v2-audio-play" onClick={audio.replay} aria-label={t(UI.replay)}>{'▶'}</button>
      <span className="v2-audio-txt">
        <b>{t(title)}</b>
        {sub ? <i>{t(sub)}</i> : null}
      </span>
      <span className={'v2-wave' + (audio.muted || !audio.isPlaying ? ' is-off' : '')} aria-hidden="true">
        <s /><s /><s /><s /><s />
      </span>
    </div>
  )
}

// ============================================================================
// EKRAN QOBIG'I. Maket: chapda nishon va sarlavha, tepada segmentli progress,
// pastda «Orqaga», nuqtalar va «Davom etish». Joylashuv DOIM bir xil.
// ============================================================================
function Shell({ eyebrow, section, screen, audio, solved, onPrev, onNext, onFinish, finished, tone, notes = true, children }) {
  const t = useT()
  const canNext = useAdvanceGate(solved, audio)
  const last = screen === TOTAL - 1
  const block = Math.floor(screen / 3)
  return (
    <div className={'v2-root' + (tone ? ' is-' + tone : '')}>
      <div className="v2-stage">
        <div className="v2-head">
          <div className="v2-headrow">
            <span className="v2-brand">
              <span className="v2-badge">7</span>
              <span>{t(LESSON_BRAND)}</span>
            </span>
            <span className="v2-progwrap">
              <span className="v2-segs">
                {Array.from({ length: TOTAL }).map((_, i) => (
                  <i key={i} className={'v2-seg' + (i < screen ? ' is-done' : i === screen ? ' is-now' : '')} />
                ))}
              </span>
              <span className="v2-progrow">
                <span className="v2-section">{t(section || eyebrow)}</span>
                <span className="v2-count">{String(screen + 1).padStart(2, '0')} / {TOTAL}</span>
              </span>
            </span>
            <span className="v2-tools">
              {notes ? (
                <button type="button" className="v2-tool" aria-label={t(UI.notes)}>{'✎'}<span>{t(UI.notes)}</span></button>
              ) : null}
              <button type="button" className="v2-tool" onClick={audio.replay} aria-label={t(UI.replay)}>{'↺'}</button>
              <button
                type="button"
                className={'v2-tool' + (audio.muted ? ' is-off' : '')}
                onClick={audio.toggleMute}
                aria-label={t(UI.sound)}
              >
                {audio.muted ? '✕' : '♪'}
              </button>
            </span>
          </div>
        </div>

        <div className="v2-body">
          <div className="v2-col">{children}</div>
        </div>

        <div className="v2-nav">
          <button type="button" className="v2-btn v2-btn-ghost" onClick={onPrev} disabled={screen === 0}>
            {'← '}{t(UI.back)}
          </button>
          <span className="v2-dots" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => <i key={i} className={'v2-dot' + (i === block ? ' is-now' : '')} />)}
          </span>
          <span className="v2-nav-r">
            {last ? (
              <button type="button" className="v2-btn v2-btn-dark" onClick={onFinish} disabled={finished}>
                {finished ? t(UI.saved) : t(UI.finish)}
              </button>
            ) : (
              <button type="button" className="v2-btn v2-btn-dark" onClick={onNext} disabled={!canNext}>
                {t(UI.next)}{' →'}
              </button>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}

// Sarlavha qatori: chapda nishon va sarlavha, o'ngda holat chipi.
const TitleRow = ({ eyebrow, title, chip }) => {
  const t = useT()
  return (
    <div className="v2-titlerow">
      <span style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <span className="v2-eyebrow"><i aria-hidden="true" />{t(eyebrow)}</span>
        <h1 className="v2-h1">{t(title)}</h1>
      </span>
      {chip ? <span className="v2-chip">{'↗'} {t(chip)}</span> : null}
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
    "Kenglik 3 m · uzunlik a · yana 5 m",
    'Ширина 3 м · длина a · добавили 5 м',
    'Width 3 m · length a · added 5 m',
  ),
  section: L('XUK', 'ХУК', 'HOOK'),
  chip: L("CHIZIQ BO'YICHA KESISH", 'РАЗРЕЗ ПО ЛИНИИ', 'CUT ALONG THE LINE'),
  cardCap: L('BITTA YUZA · IKKI YOZUV', 'ОДНА ПЛОЩАДЬ · ДВЕ ЗАПИСИ', 'ONE AREA · TWO RECORDS'),
  step1: L('1-qadam. Javobni tanlang', 'Шаг 1. Выберите ответ', 'Step 1. Choose an answer'),
  step1sub: L("Ovoz to'xtaydi va bosishni kutadi", 'Озвучка остановится и будет ждать нажатия', 'The narration pauses and waits for your tap'),
  step2: L("2-qadam. Chok bo'yicha kesing", 'Шаг 2. Разрежьте по стыку', 'Step 2. Cut along the joint'),
  step2sub: L("Kesgandan keyin yozuv o'zgaradi", 'После разреза запись изменится', 'After the cut the record changes'),
  pickHint: L('Bitta variantni bosing', 'Нажмите один вариант', 'Tap one option'),
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
  result: '3a + 15',
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
    <Shell
      eyebrow={S1.eyebrow}
      section={S1.section}
      screen={screen}
      audio={audio}
      solved={!!picked}
      tone={tone}
      notes={false}
      {...rest}
    >
      <TitleRow eyebrow={S1.section} title={S1.title} chip={S1.chip} />

      <div className="v2-two">
        <div className="v2-side">
          <AudioBar
            audio={audio}
            title={picked ? S1.step2 : S1.step1}
            sub={picked ? S1.step2sub : S1.step1sub}
          />
          <p className="v2-expr v2-expr-xl" style={{ margin: 0 }}>{S1.expr}</p>
          <p className="v2-lead">{t(S1.lead)}</p>
          {!picked ? (
            <>
              <span className="v2-cta"><i aria-hidden="true" />{t(S1.pickHint)}</span>
              <Choice
                items={S1.items}
                picked={null}
                wrong={[]}
                disabled={!can}
                onPick={(o) => { setPicked(o.id); onAnswer({ screen, role: 'hook', picked: o.id, correct: null }) }}
              />
            </>
          ) : (
            <Fb tone="note" title={t(UI.note)}>{t(S1.saved)}</Fb>
          )}
        </div>

        <div className="v2-card">
          <span className="v2-card-cap">{t(S1.cardCap)}</span>
          <div style={{ height: 'clamp(120px, 25vh, 210px)' }}>
            <AreaModel phase={phase} />
          </div>
          {picked && phase === 'whole' ? (
            <button type="button" className="v2-btn v2-btn-accent" style={{ alignSelf: 'center' }} onClick={cut}>
              {'2. '}{t(S1.cutBtn)}{' →'}
            </button>
          ) : null}
          <p className="v2-expr v2-expr-lg" style={{ margin: 0, textAlign: 'center' }}>
            <span style={{ color: C.ink }}>{S1.expr}</span>
            {phase === 'parts' ? (
              <>
                <span style={{ color: C.ink3 }}>{'  →  '}</span>
                <span className="v2-in" style={{ color: C.orange }}>{S1.result}</span>
              </>
            ) : null}
          </p>
          {phase === 'parts' ? (
            <Fb tone="note" title={t(UI.note)}>{t(S1.resultCap)}</Fb>
          ) : null}
          <span className="v2-mark">G7 · D05 · 01</span>
        </div>
      </div>
    </Shell>
  )
}

// ============================================================================
// EKRAN 2. UCH TAYANCH: amallar tartibi, ikki minus, o'xshash hadlar.
// Bir vaqtda BITTASI faol.
// ============================================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'BASICS'),
  section: L('TAYANCH', 'ОПОРА', 'BASICS'),
  chip: L('BIRMA-BIR', 'ПО ОДНОЙ', 'ONE BY ONE'),
  title: L('Uch narsani eslaymiz', 'Вспомним три вещи', 'Three things to recall'),
  cardCap: L('UCH TAYANCH', 'ТРИ ОПОРЫ', 'THREE BASICS'),
  pill: L('TAYANCH', 'ОПОРА', 'BASIC'),
  steps: [
    L('1-tayanch. Amallar tartibi', 'Опора 1. Порядок действий', 'Basic 1. Order of operations'),
    L('2-tayanch. Ikki minus', 'Опора 2. Два минуса', 'Basic 2. Two minuses'),
    L("3-tayanch. O'xshash hadlar", 'Опора 3. Подобные слагаемые', 'Basic 3. Like terms'),
  ],
  stepSub: L(
    "To'g'ri javobdan keyin keyingisi ochiladi",
    'Следующая откроется после верного ответа',
    'The next one opens after a correct answer',
  ),
  final: L(
    'Uch tayanch tayyor. Endi qavslarga qaytamiz.',
    'Три опоры готовы. Возвращаемся к скобкам.',
    'Three basics are ready. Back to the brackets.',
  ),
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
  const [idx, setIdx] = useState(0)
  const [solvedIdx, setSolvedIdx] = useState(-1)
  const [done, setDone] = useState(false)
  const cur = S2.tasks[idx]

  const right = (r) => {
    setSolvedIdx(idx)
    onAnswer({ screen, role: 'support', index: idx, attempts: r.attempts })
    setTimeout(() => {
      const nx = idx + 1
      if (nx >= S2.tasks.length) { setDone(true); return }
      setIdx(nx)
      setSolvedIdx(-1)
      audio.step('q' + (nx + 1))
    }, 2200)
  }

  return (
    <Shell eyebrow={S2.eyebrow} section={S2.section} screen={screen} audio={audio} solved={done} tone={tone} {...rest}>
      <TitleRow eyebrow={S2.section} title={S2.title} chip={S2.chip} />
      <div className="v2-two">
        <div className="v2-side">
          <AudioBar audio={audio} title={S2.steps[idx] || S2.steps[2]} sub={S2.stepSub} />
          {cur ? (
            <div className="v2-card" key={idx}>
              <span className="v2-pill">{t(S2.pill)} {idx + 1} / {S2.tasks.length}</span>
              <p className="v2-expr v2-expr-lg" style={{ margin: 0 }}>{cur.prompt}</p>
              <Ask data={cur} disabled={!can} audio={audio} onRight={right} />
            </div>
          ) : null}
        </div>

        <div className="v2-card">
          <span className="v2-card-cap">{t(S2.cardCap)}</span>
          {S2.tasks.map((task, i) => {
            const isDone = i < idx || (i === idx && solvedIdx === i)
            const isNow = i === idx && solvedIdx !== i
            return (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 11, minWidth: 0,
                  padding: '9px 13px', borderRadius: 12,
                  background: isDone ? C.greenSoft : isNow ? C.orangeSoft : 'rgba(24,34,36,.04)',
                  color: isDone ? C.green : isNow ? C.orange : C.ink3,
                  transition: 'background .24s ease, color .24s ease',
                }}
              >
                <b className="v2-expr" style={{ fontSize: 13 }}>{String(i + 1).padStart(2, '0')}</b>
                <span className="v2-expr v2-expr-sm" style={{ flex: 1, minWidth: 0 }}>
                  {isDone ? task.prompt + ' ' + task.solution : task.prompt}
                </span>
                {isDone ? <span>{'✓'}</span> : null}
              </div>
            )
          })}
          {solvedIdx >= 0 && S2.tasks[solvedIdx] ? (
            <Fb tone="note" title={t(UI.note)}>{t(S2.tasks[solvedIdx].step)}</Fb>
          ) : null}
          {done ? <Fb tone="ok" title={t(UI.right)}>{t(S2.final)}</Fb> : null}
          <span className="v2-mark">G7 · D05 · 02</span>
        </div>
      </div>
    </Shell>
  )
}

const S3 = {
  eyebrow: L('SON BILAN', 'ЧИСЛОМ', 'WITH A NUMBER'),
  section: L('TEKSHIRUV', 'ПРОВЕРКА', 'CHECK'),
  chip: L('SON GUVOH', 'ЧИСЛО-СВИДЕТЕЛЬ', 'NUMBER WITNESS'),
  title: L("a o'rniga son qo'yamiz", 'Подставим вместо a число', 'Substitute a number for a'),
  cardCap: L('UCH YOZUV · BITTA SON', 'ТРИ ЗАПИСИ · ОДНО ЧИСЛО', 'THREE RECORDS · ONE VALUE'),
  step1: L('1-qadam. Sonni tanlang', 'Шаг 1. Выберите число', 'Step 1. Choose a number'),
  step1sub: L('Har qanday son yaraydi', 'Подойдёт любое из четырёх', 'Any of the four will do'),
  step2: L("2-qadam. Son o'rniga qo'yiladi", 'Шаг 2. Число подставляется', 'Step 2. The number is substituted'),
  step2sub: L('Qatorlar birin-ketin chiqadi', 'Строки появляются по очереди', 'Rows appear one by one'),
  pickHint: L('Bitta sonni bosing', 'Нажмите одно число', 'Tap one number'),
  chosen: L(
    "Shu son uchala yozuvga qo'yiladi.",
    'Это число подставляется во все три записи.',
    'This number goes into all three records.',
  ),
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
    <Shell eyebrow={S3.eyebrow} section={S3.section} screen={screen} audio={audio} solved={allShown} tone={tone} {...rest}>
      <TitleRow eyebrow={S3.section} title={S3.title} chip={S3.chip} />
      <div className="v2-two">
        <div className="v2-side">
          <AudioBar audio={audio} title={n === null ? S3.step1 : S3.step2} sub={n === null ? S3.step1sub : S3.step2sub} />
          {n === null ? (
            <>
              <span className="v2-cta"><i aria-hidden="true" />{t(S3.pickHint)}</span>
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
              <span className="v2-pill">{'a = ' + n}</span>
              <p className="v2-lead">{t(S3.chosen)}</p>
              {allShown ? <Fb tone="ok" title={t(UI.right)}>{t(S3.note)}</Fb> : null}
            </div>
          )}
        </div>

        <div className="v2-card">
          <span className="v2-card-cap">{t(S3.cardCap)}</span>
          {S3.rows.map((r, i) => {
            const on = n !== null && i < shown
            const same = i < 2
            return (
              <div
                key={i}
                className={on ? 'v2-in' : ''}
                style={{
                  display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 22px minmax(0,1fr) 18px auto',
                  alignItems: 'center', gap: 6, padding: '7px 11px', borderRadius: 11,
                  background: on && same ? C.greenSoft : on ? 'rgba(24,34,36,.04)' : 'transparent',
                  opacity: on ? 1 : 0.22,
                  transition: 'background .3s ease, opacity .3s ease',
                }}
              >
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
          <span className="v2-mark">G7 · D05 · 03</span>
        </div>
      </div>
    </Shell>
  )
}

const SCREENS = [Screen1, Screen2, Screen3]
