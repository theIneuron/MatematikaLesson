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
.v2-input {
  min-width: min(260px, 100%); min-height: 46px;
  padding: 0 16px; border-radius: 12px; border: none;
  background: ${C.cardSolid}; color: ${C.ink};
  font-family: ${MONO}; font-weight: 700; font-size: clamp(16px, 2vw, 20px);
  text-align: center;
  box-shadow: inset 0 0 0 2px ${C.line};
  transition: box-shadow .18s ease;
}
.v2-input:focus { outline: none; box-shadow: inset 0 0 0 2px ${C.orange}; }
.v2-input:disabled { color: ${C.green}; box-shadow: inset 0 0 0 2px ${C.green}; }

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

/* TELEFON. Maket 1366x768 uchun chizilgan: ikki ustun bitta bo'lganda
   kontent 201px oshib ketardi (390x745 o'lchovi). Shu sababli tor ekranda
   sarlavha, model va oraliqlar kichrayadi. */
@media (max-width: 899.98px) {
  .v2-h1 { font-size: clamp(21px, 6.4vw, 26px); }
  .v2-expr-xl { font-size: clamp(24px, 8vw, 30px); }
  .v2-expr-lg { font-size: clamp(19px, 6vw, 23px); }
  .v2-col { gap: 7px; }
  .v2-card { padding: 9px 12px; gap: 6px; border-radius: 14px; }
  .v2-audio { padding: 7px 11px; gap: 10px; }
  .v2-audio-txt i { display: none; }
  .v2-two { gap: 8px; }
  .v2-opt { min-height: 44px; padding: 8px 12px; font-size: 13.5px; }
  .v2-cta { padding: 7px 11px; font-size: 12px; }
  .v2-steps { gap: 5px; }
  .v2-step { padding: 6px 7px; font-size: 11.5px; }
  .v2-step em { display: none; }
  .v2-mark { display: none; }
}

/* PAST NOUTBUK (1366x615). Amaliyot ekranlarida xato javob paytida
   to'rt variant, izoh va yechim kartochkasi birga turadi -- 12 va
   14-ekranlar 23-37px oshib ketardi (2026-08-11 o'lchovi). */
@media (max-height: 660px) and (min-width: 900px) {
  .v2-opt { min-height: 44px; padding: 7px 13px; font-size: 14px; }
  .v2-opts { gap: 7px; }
  .v2-fb { padding: 8px 12px; }
  .v2-fb p { font-size: 13.5px; line-height: 1.35; }
  .v2-card { padding: 9px 14px; gap: 6px; }
  .v2-audio { padding: 7px 13px; }
  .v2-step { padding: 6px 10px; }
  .v2-col { gap: 7px; }
}

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
  now: L('hozir', 'сейчас', 'now'),
  locked: L('yopiq', 'закрыто', 'locked'),
  type: L("To'liq javobni kiriting", 'Введите полный ответ', 'Type the full answer'),
  check: L('Tekshirish', 'Проверить', 'Check'),
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

// Javobni KIRITISH (maket, 9-ekran). Bo'shliqlar e'tiborga olinmaydi,
// `accept` ro'yxatidagi teng shakllar ham qabul qilinadi.
function TypeAnswer({ task, disabled, onRight, audio }) {
  const t = useT()
  const [val, setVal] = useState('')
  const [fb, setFb] = useState(null)
  const [ok, setOk] = useState(false)
  const norm = (x) => String(x).toLowerCase().replace(/\s+/g, '').replace(/[*x]/g, '·').replace(/[-−]/g, '-')
  const check = () => {
    const good = [task.solution].concat(task.accept || []).some((v) => norm(v) === norm(val))
    if (good) {
      setOk(true)
      setFb({ tone: 'ok', title: t(UI.right), text: task.ok })
      if (onRight) onRight({ id: 'typed', attempts: 1 })
      return
    }
    const miss = (task.misses || []).find((m) => norm(m.value) === norm(val))
    setFb({ tone: 'tip', title: t(UI.hint), text: miss ? miss.hint : task.wrongDefault })
    if (audio && audio.say) audio.say(t(miss ? miss.hint : task.wrongDefault))
  }
  return (
    <>
      <span className="v2-cta"><i aria-hidden="true" />{t(UI.type)}</span>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="v2-input"
          value={val}
          disabled={disabled || ok}
          onChange={(e) => { setVal(e.target.value); setFb(null) }}
          onKeyDown={(e) => { if (e.key === 'Enter' && val.trim()) check() }}
          aria-label={t(UI.type)}
          spellCheck={false}
        />
        <button type="button" className="v2-btn v2-btn-dark" disabled={disabled || ok || !val.trim()} onClick={check}>
          {t(UI.check)}
        </button>
      </div>
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
      <button type="button" data-control="1" className="v2-audio-play" onClick={audio.replay} aria-label={t(UI.replay)}>{'▶'}</button>
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
    // `lesson-root`, `stage-content`, `stage-nav`, `g7-count`, `g7-tool-sound`
    // -- MAVJUD tekshiruv skriptlari shu nomlarni qidiradi. Ular faqat
    // ILGAK: vyorstka `v2-` klasslarida.
    <div className={'lesson-root v2-root' + (tone ? ' is-' + tone : '')}>
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
                <span className="g7-count v2-count">{String(screen + 1).padStart(2, '0')} / {TOTAL}</span>
              </span>
            </span>
            <span className="v2-tools">
              {notes ? (
                <button type="button" className="v2-tool" aria-label={t(UI.notes)}>{'✎'}<span>{t(UI.notes)}</span></button>
              ) : null}
              <button type="button" className="v2-tool" onClick={audio.replay} aria-label={t(UI.replay)}>{'↺'}</button>
              <button
                type="button"
                className={'g7-tool-sound v2-tool' + (audio.muted ? ' is-off' : '')}
                onClick={audio.toggleMute}
                aria-label={t(UI.sound)}
              >
                {audio.muted ? '✕' : '♪'}
              </button>
            </span>
          </div>
        </div>

        <div className="stage-content v2-body">
          <div className="v2-col">{children}</div>
        </div>

        <div className="stage-nav v2-nav">
          <button type="button" className="v2-btn v2-btn-ghost" onClick={onPrev} disabled={screen === 0}>
            {'← '}{t(UI.back)}
          </button>
          <span className="v2-dots" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => <i key={i} className={'v2-dot' + (i === block ? ' is-now' : '')} />)}
          </span>
          <span className="v2-nav-r">
            {last ? (
              <button type="button" data-next="1" className="v2-btn v2-btn-dark" onClick={onFinish} disabled={finished}>
                {finished ? t(UI.saved) : t(UI.finish)}
              </button>
            ) : (
              <button type="button" data-next="1" className="v2-btn v2-btn-dark" onClick={onNext} disabled={!canNext}>
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
      solution: '27',
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
      solution: '4',
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
      solution: '5a',
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
              <p className="v2-expr v2-expr-lg" style={{ margin: 0 }}>{t(cur.prompt)}</p>
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

// ============================================================================
// EKRAN 4. AYNIQ FARQ: ko'paytuvchi va qo'shiluvchi.
// ============================================================================
const S4 = {
  eyebrow: L('FARQ', 'РАЗЛИЧИЕ', 'THE DIFFERENCE'),
  section: L('FARQ', 'РАЗЛИЧИЕ', 'THE DIFFERENCE'),
  chip: L('IKKI HOLAT', 'ДВА СЛУЧАЯ', 'TWO CASES'),
  title: L('Qavs oldida nima turibdi?', 'Что стоит перед скобкой?', 'What stands before the brackets?'),
  step: L('Ikki yozuvni solishtiring', 'Сравните две записи', 'Compare the two records'),
  stepSub: L('Farq bitta belgida', 'Разница в одном знаке', 'The difference is one sign'),
  cardCap: L('NIMA QAYERGA YETADI', 'ЧТО КУДА ДОХОДИТ', 'WHAT REACHES WHERE'),
  left: {
    cap: L("KO'PAYTUVCHI", 'МНОЖИТЕЛЬ', 'MULTIPLIER'),
    expr: '3 · (a + 5)',
    note: L("Har bir qo'shiluvchiga yetadi", 'Доходит до каждого слагаемого', 'Reaches every term'),
    res: '3a + 15',
  },
  right: {
    cap: L("QO'SHILUVCHI", 'СЛАГАЕМОЕ', 'ADDEND'),
    expr: '3 + (a + 5)',
    note: L("Bir marta qo'shiladi", 'Прибавляется один раз', 'Is added once'),
    res: '3 + a + 5',
  },
  probe: {
    question: L('Qaysi yozuvda uchlik a ga ham, beshga ham yetadi?', 'В какой записи тройка доходит и до a, и до пяти?', 'In which record does the three reach both a and five?'),
    ok: L(
      "To'g'ri. Ko'paytuvchi qavsni taqsimlaydi, qo'shiluvchi esa yo'q.",
      'Верно. Множитель распределяется по скобке, слагаемое нет.',
      'Correct. A multiplier distributes over the brackets, an addend does not.',
    ),
    items: [
      { id: 'm', label: '3 · (a + 5)', correct: true },
      { id: 'p', label: '3 + (a + 5)', hint: L("Bu yerda uchlik shunchaki qo'shiladi.", 'Здесь тройка просто прибавляется.', 'Here the three is simply added.') },
      { id: 'both', label: L('Ikkalasida ham', 'В обеих', 'In both'), hint: L("Qo'shiluvchi taqsimlanmaydi, uni tekshirib ko'rdik.", 'Слагаемое не распределяется, мы это проверяли.', 'An addend does not distribute, we checked that.') },
      { id: 'none', label: L('Hech qaysisida', 'Ни в одной', 'In neither'), hint: L("Ko'paytuvchi aynan shunday ishlaydi.", 'Множитель работает именно так.', 'That is exactly how a multiplier works.') },
    ],
  },
  audio: [
    A('mount', "Ikki yozuv o'xshash, lekin qavs oldida turgan narsa har xil. Qaysi birida uchlik ikkala qo'shiluvchiga yetadi?", 'Две записи похожи, но перед скобкой стоит разное. В какой из них тройка доходит до обоих слагаемых?', 'Two similar records, but different things stand before the brackets. In which one does the three reach both terms?'),
  ],
}

function Screen4({ screen, onAnswer, tone, ...rest }) {
  const t = useT()
  const audio = useAudio(useMemo(() => seg(S4.audio, rest.lang), [rest.lang]))
  const can = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const card = (d, color, soft, arrows) => (
    <div className="v2-card" style={{ gap: 5, boxShadow: 'inset 0 0 0 1px ' + C.line + ', 0 14px 34px -30px rgba(24,34,36,.5)', borderTop: '3px solid ' + color }}>
      <span className="v2-pill" style={{ background: soft, color }}>{t(d.cap)}</span>
      <p className="v2-expr v2-expr-md" style={{ margin: 0, color }}>{d.expr}</p>
      <p className="v2-lead" style={{ minHeight: 20 }}>{arrows ? '↓        ↓' : '↓'}</p>
      <p className="v2-expr v2-expr-sm" style={{ margin: 0 }}>{d.res}</p>
      <p className="v2-lead">{t(d.note)}</p>
    </div>
  )
  return (
    <Shell eyebrow={S4.eyebrow} section={S4.section} screen={screen} audio={audio} solved={done} tone={tone} {...rest}>
      <TitleRow eyebrow={S4.section} title={S4.title} chip={S4.chip} />
      <AudioBar audio={audio} title={S4.step} sub={S4.stepSub} />
      <div className="v2-two">
        {card(S4.left, C.teal, C.tealSoft, true)}
        {card(S4.right, C.orange, C.orangeSoft, false)}
      </div>
      <div className="v2-card">
        <Ask data={S4.probe} disabled={!can} audio={audio}
          onRight={(r) => { setDone(true); onAnswer({ screen, role: 'explain', ...r }) }} />
        <span className="v2-mark">G7 · D05 · 04</span>
      </div>
    </Shell>
  )
}

// ============================================================================
// EKRAN 5. YUZA MODELI: bosish -> ajralish -> uch yozuv -> xulosa.
// ============================================================================
const S5 = {
  eyebrow: L('YUZA', 'ПЛОЩАДЬ', 'AREA'),
  section: L('QANDAY ISHLAYDI', 'КАК ЭТО РАБОТАЕТ', 'HOW IT WORKS'),
  chip: L("AJRATIB KO'RAMIZ", 'РАЗДЕЛИМ МОДЕЛЬ', 'SPLIT THE MODEL'),
  title: L('Nega aynan 3a + 15', 'Почему получилось 3a + 15', 'Why it comes out as 3a + 15'),
  cardCap: L('YUZA · IKKI QISM', 'ПЛОЩАДЬ · ДВЕ ЧАСТИ', 'AREA · TWO PARTS'),
  step1: L('Modelni ajrating', 'Разделите модель', 'Split the model'),
  step1sub: L('Bosgandan keyin izoh boshlanadi', 'После нажатия начнётся объяснение', 'The explanation starts after the tap'),
  step2: L('Ikki qism, ikki yozuv', 'Две части, две записи', 'Two parts, two records'),
  step2sub: L("Har qism o'z yozuvini beradi", 'Каждая часть даёт свою запись', 'Each part gives its own record'),
  btn: L('Modelni ajratish', 'Разделить модель', 'Split the model'),
  lines: [
    { cap: L('Chap qism', 'Левая часть', 'Left part'), expr: '3 · a' },
    { cap: L("O'ng qism", 'Правая часть', 'Right part'), expr: '3 · 5' },
    { cap: L('Birgalikda', 'Вместе', 'Together'), expr: '3a + 15' },
  ],
  note: L(
    "Yuza o'zgarmadi, faqat ikki qismga bo'lindi. Shuning uchun yozuvlar teng.",
    'Площадь не изменилась, её просто разделили. Поэтому записи равны.',
    'The area did not change, it was only split. That is why the records are equal.',
  ),
  audio: [
    A('mount', "Modelni ajratish tugmasini bosing.", 'Нажми кнопку разделить модель.', 'Tap the split the model button.'),
    A('l1', "Chap qism: uchni a ga ko'paytiramiz.", 'Левая часть: три умножить на a.', 'Left part: three times a.'),
    A('l2', "O'ng qism: uchni beshga ko'paytiramiz.", 'Правая часть: три умножить на пять.', 'Right part: three times five.'),
    A('l3', "Birgalikda uch a plyus o'n besh.", 'Вместе: три a плюс пятнадцать.', 'Together: three a plus fifteen.'),
  ],
}

function Screen5({ screen, onAnswer, tone, ...rest }) {
  const t = useT()
  const audio = useAudio(useMemo(() => seg(S5.audio, rest.lang), [rest.lang]))
  const can = useInstructionGate(audio)
  const [rev, setRev] = useState(0)

  useEffect(() => {
    if (rev === 0 || rev >= 5) return undefined
    const tmr = setTimeout(() => {
      setRev((n) => { const nx = n + 1; if (nx >= 2 && nx <= 4) audio.step('l' + (nx - 1)); return nx })
    }, rev === 1 ? 520 : 900)
    return () => clearTimeout(tmr)
  }, [rev]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Shell eyebrow={S5.eyebrow} section={S5.section} screen={screen} audio={audio} solved={rev >= 5} tone={tone} {...rest}>
      <TitleRow eyebrow={S5.section} title={S5.title} chip={S5.chip} />
      <div className="v2-two">
        <div className="v2-side">
          <AudioBar audio={audio} title={rev === 0 ? S5.step1 : S5.step2} sub={rev === 0 ? S5.step1sub : S5.step2sub} />
          {rev === 0 ? (
            <>
              <span className="v2-cta"><i aria-hidden="true" />{t(UI.tap)}</span>
              <button
                type="button"
                className="v2-btn v2-btn-accent"
                style={{ alignSelf: 'flex-start' }}
                disabled={!can}
                onClick={() => { setRev(1); onAnswer({ screen, role: 'explain', picked: 'split' }) }}
              >
                {t(S5.btn)}{' →'}
              </button>
            </>
          ) : (
            <div className="v2-card" style={{ gap: 8 }}>
              {S5.lines.slice(0, Math.max(0, rev - 1)).map((ln, i) => (
                <div key={i} className="v2-in" style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span className="v2-card-cap" style={{ minWidth: 96 }}>{t(ln.cap)}</span>
                  <span className="v2-expr v2-expr-md" style={{ color: i === 2 ? C.orange : C.teal }}>{ln.expr}</span>
                </div>
              ))}
              {rev >= 5 ? <Fb tone="ok" title={t(UI.right)}>{t(S5.note)}</Fb> : null}
            </div>
          )}
        </div>

        <div className="v2-card">
          <span className="v2-card-cap">{t(S5.cardCap)}</span>
          <div style={{ height: 'clamp(120px, 26vh, 220px)' }}>
            <AreaModel phase={rev === 0 ? 'whole' : rev === 1 ? 'cut' : 'parts'} />
          </div>
          <span className="v2-mark">G7 · D05 · 05</span>
        </div>
      </div>
    </Shell>
  )
}

// ============================================================================
// EKRAN 6. QAVS OLDIDA MINUS. To'rt javob, har biriga izoh.
// ============================================================================
const S6 = {
  eyebrow: L('YANGI HOLAT', 'НОВЫЙ СЛУЧАЙ', 'A NEW CASE'),
  section: L('YANGI HOLAT', 'НОВЫЙ СЛУЧАЙ', 'A NEW CASE'),
  chip: L('ISHORALAR', 'ЗНАКИ', 'SIGNS'),
  title: L('Qavs oldida minus', 'Перед скобкой минус', 'A minus before the brackets'),
  cardCap: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  step: L('Javobni tanlang', 'Выберите ответ', 'Choose an answer'),
  stepSub: L("Xato bo'lsa, yana urinib ko'ring", 'При ошибке можно попробовать снова', 'If you miss, try again'),
  expr: '−(a − 7)',
  probe: {
    question: L('Qavsni ochsak nima chiqadi?', 'Что получится, если раскрыть скобки?', 'What do we get if we expand?'),
    ok: L(
      "To'g'ri. Minus ikkala qo'shiluvchining ishorasini almashtirdi.",
      'Верно. Минус поменял знак у обоих слагаемых.',
      'Correct. The minus flipped the sign of both terms.',
    ),
    items: [
      { id: 'p1', label: '−a + 7', correct: true },
      { id: 'p2', label: '−a − 7', hint: L("Ikkinchisining ishorasi almashmagan: minus yettini minusga ko'paytirsak, plyus yetti.", 'У второго знак не поменялся: минус семь на минус даёт плюс семь.', 'The second sign did not flip: minus seven times minus gives plus seven.') },
      { id: 'p3', label: 'a − 7', hint: L("Qavs shunchaki o'chirilgan. Minus ikkala ishorani almashtirishi shart.", 'Скобки просто стёрли. Минус обязан поменять оба знака.', 'The brackets were erased. The minus must flip both signs.') },
      { id: 'p4', label: '−a − 7 + 7', hint: L("Yettilik ikki marta hisoblangan. Har qo'shiluvchi bir marta almashadi.", 'Семёрка учтена дважды. Каждое слагаемое меняет знак один раз.', 'The seven is counted twice. Each term flips once.') },
    ],
  },
  reveal: [
    { cap: L('Birinchi', 'Первое', 'First'), expr: '(−1) · a = −a' },
    { cap: L('Ikkinchi', 'Второе', 'Second'), expr: '(−1) · (−7) = +7' },
    { cap: L('Birgalikda', 'Вместе', 'Together'), expr: '−a + 7' },
  ],
  audio: [
    A('mount', "Qavs oldida endi son emas, minus turibdi. Qavsni ochsak nima chiqadi?", 'Перед скобкой теперь не число, а минус. Что получится, если раскрыть скобки?', 'Now a minus stands before the brackets, not a number. What do we get if we expand?'),
    A('r1', "Birinchi qo'shiluvchi: minus bir kerra a.", 'Первое слагаемое: минус один умножить на a.', 'First term: minus one times a.'),
    A('r2', "Ikkinchisi: minus bir kerra minus yetti, ya'ni plyus yetti.", 'Второе: минус один на минус семь, то есть плюс семь.', 'Second: minus one times minus seven, that is plus seven.'),
    A('r3', 'Birgalikda minus a plyus yetti.', 'Вместе минус a плюс семь.', 'Together minus a plus seven.'),
  ],
}

function Screen6({ screen, onAnswer, tone, ...rest }) {
  const t = useT()
  const audio = useAudio(useMemo(() => seg(S6.audio, rest.lang), [rest.lang]))
  const can = useInstructionGate(audio)
  const [rev, setRev] = useState(0)

  useEffect(() => {
    if (rev === 0 || rev > S6.reveal.length) return undefined
    const tmr = setTimeout(() => {
      setRev((n) => { const nx = n + 1; if (nx <= S6.reveal.length) audio.step('r' + nx); return nx })
    }, rev === 1 ? 420 : 900)
    return () => clearTimeout(tmr)
  }, [rev]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Shell eyebrow={S6.eyebrow} section={S6.section} screen={screen} audio={audio} solved={rev > 0} tone={tone} {...rest}>
      <TitleRow eyebrow={S6.section} title={S6.title} chip={S6.chip} />
      <div className="v2-two">
        <div className="v2-side">
          <AudioBar audio={audio} title={S6.step} sub={S6.stepSub} />
          <p className="v2-expr v2-expr-xl" style={{ margin: 0 }}>{S6.expr}</p>
          <div className="v2-card">
            <Ask data={S6.probe} disabled={!can} audio={audio}
              onRight={(r) => { setRev(1); onAnswer({ screen, role: 'explain', ...r }) }} />
          </div>
        </div>

        <div className="v2-card">
          <span className="v2-card-cap">{t(S6.cardCap)}</span>
          {rev === 0 ? (
            <p className="v2-lead">{t(S6.stepSub)}</p>
          ) : (
            S6.reveal.slice(0, rev).map((ln, i) => (
              <div key={i} className="v2-in" style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span className="v2-card-cap" style={{ minWidth: 84 }}>{t(ln.cap)}</span>
                <span className="v2-expr v2-expr-md" style={{ color: i === 2 ? C.orange : C.teal }}>{ln.expr}</span>
              </div>
            ))
          )}
          <span className="v2-mark">G7 · D05 · 06</span>
        </div>
      </div>
    </Shell>
  )
}

// ============================================================================
// EKRAN 7. SON BILAN ISBOT: avval javob, keyin a = 10 qo'yiladi.
// ============================================================================
const S7 = {
  eyebrow: L('ISBOT', 'ДОКАЗАТЕЛЬСТВО', 'PROOF'),
  section: L('TEKSHIRUV', 'ПРОВЕРКА', 'CHECK'),
  chip: L('a = 10', 'a = 10', 'a = 10'),
  title: L('Javobni son bilan tekshiramiz', 'Проверим ответ числом', 'Check the answer with a number'),
  cardCap: L("QO'YIB KO'RAMIZ", 'ПОДСТАВЛЯЕМ', 'SUBSTITUTING'),
  step: L('Teng yozuvni tanlang', 'Выберите равную запись', 'Choose the equal record'),
  stepSub: L('Keyin son bilan tekshiramiz', 'Потом проверим числом', 'Then we check with a number'),
  probe: {
    question: L("Qaysi yozuv −(a − 7) ga teng?", 'Какая запись равна −(a − 7)?', 'Which record equals −(a − 7)?'),
    ok: L('Endi buni son bilan tekshiramiz.', 'Теперь проверим это числом.', 'Now let us check it with a number.'),
    items: [
      { id: 'c1', label: '−a + 7', correct: true },
      { id: 'c2', label: '−a − 7', hint: L("Ikkinchi qo'shiluvchining ishorasi almashmagan.", 'У второго слагаемого знак не поменялся.', 'The second term kept its sign.') },
      { id: 'c3', label: 'a − 7', hint: L("Qavs shunchaki o'chirilgan.", 'Скобки просто стёрли.', 'The brackets were simply erased.') },
      { id: 'c4', label: 'a + 7', hint: L("Birinchisining ishorasi ham almashadi.", 'У первого слагаемого знак тоже меняется.', 'The first term flips too.') },
    ],
  },
  rows: [
    { expr: '−(a − 7)', sub: '−(10 − 7)', val: '−3', ok: true },
    { expr: '−a + 7', sub: '−10 + 7', val: '−3', ok: true },
    { expr: '−a − 7', sub: '−10 − 7', val: '−17', ok: false },
  ],
  note: L(
    'Birinchi ikkitasi bir xil son berdi. Demak yozuvlar teng.',
    'Первые две дали одно и то же число. Значит, записи равны.',
    'The first two give the same value. So the records are equal.',
  ),
  audio: [
    A('mount', "Qaysi yozuv boshlang'ichga teng? Javobni tanlang.", 'Какая запись равна исходной? Выбери ответ.', 'Which record equals the original? Choose an answer.'),
    A('sub', "Endi a o'rniga o'n qo'yamiz.", 'Теперь подставим вместо a десять.', 'Now we substitute ten for a.'),
  ],
}

function Screen7({ screen, onAnswer, tone, ...rest }) {
  const t = useT()
  const audio = useAudio(useMemo(() => seg(S7.audio, rest.lang), [rest.lang]))
  const can = useInstructionGate(audio)
  const [ok, setOk] = useState(false)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!ok || shown >= S7.rows.length) return undefined
    const tmr = setTimeout(() => setShown((k) => k + 1), shown === 0 ? 620 : 560)
    return () => clearTimeout(tmr)
  }, [ok, shown])

  return (
    <Shell eyebrow={S7.eyebrow} section={S7.section} screen={screen} audio={audio} solved={ok} tone={tone} {...rest}>
      <TitleRow eyebrow={S7.section} title={S7.title} chip={S7.chip} />
      <div className="v2-two">
        <div className="v2-side">
          <AudioBar audio={audio} title={S7.step} sub={S7.stepSub} />
          <div className="v2-card">
            <Ask data={S7.probe} disabled={!can} audio={audio}
              onRight={(r) => { setOk(true); audio.step('sub'); onAnswer({ screen, role: 'explain', ...r }) }} />
          </div>
        </div>

        <div className="v2-card">
          <span className="v2-card-cap">{t(S7.cardCap)}</span>
          {!ok ? <p className="v2-lead">{t(S7.stepSub)}</p> : null}
          {ok ? S7.rows.map((r, i) => {
            const on = i < shown
            return (
              <div key={i} className={on ? 'v2-in' : ''} style={{
                display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 20px minmax(0,1fr) 16px auto',
                alignItems: 'center', gap: 6, padding: '7px 11px', borderRadius: 11,
                background: on && r.ok ? C.greenSoft : on ? 'rgba(24,34,36,.04)' : 'transparent',
                opacity: on ? 1 : 0.2, transition: 'background .3s ease, opacity .3s ease',
              }}>
                <span className="v2-expr v2-expr-sm">{r.expr}</span>
                <span style={{ color: C.ink3 }}>{'→'}</span>
                <span className="v2-expr v2-expr-sm">{on ? r.sub : ''}</span>
                <span style={{ color: C.ink3 }}>{'='}</span>
                <span className="v2-expr v2-expr-md" style={{ color: on ? (r.ok ? C.green : C.ink2) : 'transparent' }}>{on ? r.val : '?'}</span>
              </div>
            )
          }) : null}
          {ok && shown >= S7.rows.length ? <Fb tone="ok" title={t(UI.right)}>{t(S7.note)}</Fb> : null}
          <span className="v2-mark">G7 · D05 · 07</span>
        </div>
      </div>
    </Shell>
  )
}

// ============================================================================
// EKRAN 8. UCH QOIDA: savol-ruxsat, keyin akkordeon.
// ============================================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  section: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  chip: L('BIRMA-BIR OCHING', 'ОТКРЫВАЙТЕ ПО ОДНОМУ', 'OPEN ONE BY ONE'),
  title: L("Uch qoidani yig'amiz", 'Соберём три правила', 'Let us build three rules'),
  cardCap: L('DARSNING UCH QOIDASI', 'ТРИ ПРАВИЛА УРОКА', 'THREE RULES OF THE LESSON'),
  step: L('Avval javob bering', 'Сначала ответьте', 'Answer first'),
  stepSub: L('Keyin qoidalar ochiladi', 'Потом откроются правила', 'Then the rules open'),
  probe: {
    question: L("Qavs oldidagi minus nimani o'zgartiradi?", 'Что меняет минус перед скобкой?', 'What does a minus before the brackets change?'),
    ok: L('Endi qoidalarni oching.', 'Теперь откройте правила.', 'Now open the rules.'),
    items: [
      { id: 'a', label: L("Hamma qo'shiluvchining ishorasini", 'Знак у всех слагаемых', 'The sign of every term'), correct: true },
      { id: 'b', label: L('Faqat birinchisining', 'Только у первого', 'Only the first one'), hint: L("Son qo'yib tekshirdik: ikkalasi ham almashadi.", 'Мы проверили числом: меняются оба.', 'We checked with a number: both flip.') },
      { id: 'c', label: L('Hech nimani', 'Ничего', 'Nothing'), hint: L("Unda qavsni o'chirsa bo'lardi. Son buni rad etdi.", 'Тогда скобки можно было бы стереть. Число это опровергло.', 'Then the brackets could be erased. The number refuted that.') },
      { id: 'd', label: L('Faqat oxirgisining', 'Только у последнего', 'Only the last one'), hint: L("Birinchi qo'shiluvchiga qarang: uning ishorasi ham almashdi.", 'Посмотри на первое слагаемое: его знак тоже изменился.', 'Look at the first term: its sign changed too.') },
    ],
  },
  laws: [
    { formula: 'a(b + c) = ab + ac', note: L("ko'paytuvchi HAR BIR qo'shiluvchiga", 'множитель умножается на КАЖДОЕ слагаемое', 'the multiplier reaches EVERY term'), example: '3(a + 5) = 3a + 15' },
    { formula: '−(x − y) = −x + y', note: L('minus HAR BIR ishorani almashtiradi', 'минус меняет знак КАЖДОГО слагаемого', 'the minus flips EVERY sign'), example: '−(a − 7) = −a + 7' },
    { formula: 'x + (y − z) = x + y − z', note: L('plyus ishoralarga tegmaydi', 'плюс знаки не трогает', 'a plus changes nothing'), example: '3 + (a + 5) = 3 + a + 5' },
  ],
  audio: [
    A('mount', "Qavs oldidagi minus nimani o'zgartiradi?", 'Что меняет минус перед скобкой?', 'What does a minus before the brackets change?'),
    A('rules', 'Endi qoidalarni birma-bir oching.', 'Теперь открой правила по одному.', 'Now open the rules one by one.'),
  ],
}

function Screen8({ screen, onAnswer, tone, ...rest }) {
  const t = useT()
  const audio = useAudio(useMemo(() => seg(S8.audio, rest.lang), [rest.lang]))
  const can = useInstructionGate(audio)
  const [ok, setOk] = useState(false)
  const [open, setOpen] = useState(-1)

  return (
    <Shell eyebrow={S8.eyebrow} section={S8.section} screen={screen} audio={audio} solved={ok} tone={tone} {...rest}>
      <TitleRow eyebrow={S8.section} title={S8.title} chip={S8.chip} />
      <div className="v2-two">
        <div className="v2-side">
          <AudioBar audio={audio} title={S8.step} sub={S8.stepSub} />
          <div className="v2-card">
            <Ask data={S8.probe} disabled={!can} audio={audio}
              onRight={(r) => { setOk(true); audio.step('rules'); onAnswer({ screen, role: 'rule', ...r }) }} />
          </div>
        </div>

        <div className="v2-card">
          <span className="v2-card-cap">{t(S8.cardCap)}</span>
          {!ok ? <p className="v2-lead">{t(S8.stepSub)}</p> : null}
          {ok ? (
            <>
              {open < 0 ? <span className="v2-cta"><i aria-hidden="true" />{t(UI.tap)}</span> : null}
              {S8.laws.map((law, i) => {
                const isOpen = open === i
                return (
                  <div key={i} style={{ borderRadius: 12, background: isOpen ? C.tealSoft : 'rgba(24,34,36,.04)', transition: 'background .2s ease' }}>
                    <button
                      type="button"
                      className="v2-opt"
                      style={{ width: '100%', background: 'transparent', boxShadow: 'none', minHeight: 44 }}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                    >
                      <b>{isOpen ? '−' : '+'}</b>
                      <span className="v2-expr v2-expr-sm">{law.formula}</span>
                    </button>
                    {isOpen ? (
                      <div className="v2-in" style={{ padding: '0 16px 11px 16px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <p className="v2-lead" style={{ color: C.ink }}>{t(law.note)}</p>
                        <p className="v2-expr v2-expr-sm" style={{ margin: 0, color: C.teal }}>{law.example}</p>
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </>
          ) : null}
          <span className="v2-mark">G7 · D05 · 08</span>
        </div>
      </div>
    </Shell>
  )
}

// ============================================================================
// PRAKTIKA QOBIG'I (9-12 va 14-ekranlar). Beshta misol, 01-05 polosasi,
// keyingisi FAQAT to'g'ri javobdan keyin ochiladi (TZ).
// ============================================================================
function Practice({ data, screen, onAnswer, tone, ...rest }) {
  const t = useT()
  const audio = useAudio(useMemo(() => seg(data.audio, rest.lang), [rest.lang]))
  const can = useInstructionGate(audio)
  const [idx, setIdx] = useState(0)
  const [solved, setSolved] = useState(false)
  const [done, setDone] = useState(false)
  const cur = data.tasks[idx]

  const right = (r) => {
    setSolved(true)
    onAnswer({ screen, role: data.role || 'practice', index: idx, attempts: r.attempts })
    setTimeout(() => {
      const nx = idx + 1
      if (nx >= data.tasks.length) { setDone(true); return }
      setIdx(nx)
      setSolved(false)
      audio.step('q' + (nx + 1))
    }, 2300)
  }

  return (
    <Shell eyebrow={data.eyebrow} section={data.section} screen={screen} audio={audio} solved={done} tone={tone} {...rest}>
      <TitleRow eyebrow={data.section} title={data.title} chip={data.chip} />
      <AudioBar audio={audio} title={data.step} sub={data.stepSub} />
      <div className="v2-steps">
        {data.tasks.map((_, i) => (
          <span key={i} className={'v2-step' + (i < idx || (i === idx && done) ? ' is-done' : i === idx ? ' is-now' : '')}>
            {String(i + 1).padStart(2, '0')}
            <em>{i < idx ? '✓' : i === idx ? t(UI.now) : t(UI.locked)}</em>
          </span>
        ))}
      </div>

      <div className="v2-two">
        <div className="v2-card" key={idx}>
          <span className="v2-pill">{t(data.pill)} {Math.min(idx + 1, data.tasks.length)} / {data.tasks.length}</span>
          {cur ? (
            <>
              {/* Ko'p qatorli topshiriq (12-ekran) ALOHIDA qatorlarda va
                  kichikroq: bitta uzun satr sig'masdi. */}
              {String(t(cur.prompt)).indexOf(';') >= 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {String(t(cur.prompt)).split(';').map((ln, i) => (
                    <span key={i} className="v2-expr v2-expr-sm" style={{ color: C.ink }}>
                      <span style={{ color: C.ink3, marginRight: 8 }}>{String(i + 1).padStart(2, '0')}</span>
                      {ln.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="v2-expr v2-expr-lg" style={{ margin: 0 }}>{t(cur.prompt)}</p>
              )}
              {data.input ? (
                <TypeAnswer task={cur} disabled={!can} audio={audio} onRight={right} />
              ) : (
                <Ask data={cur} disabled={!can} audio={audio} onRight={right} />
              )}
            </>
          ) : (
            <Fb tone="ok" title={t(UI.right)}>{t(data.final)}</Fb>
          )}
          <span className="v2-mark">G7 · D05 · {String(screen + 1).padStart(2, '0')}</span>
        </div>

        <div className="v2-card">
          <span className="v2-card-cap">{t(data.cardCap)}</span>
          {solved && cur ? (
            <>
              <p className="v2-expr v2-expr-md v2-in" style={{ margin: 0, color: C.green }}>{t(cur.prompt)} {t(cur.solution)}</p>
              <Fb tone="note" title={t(UI.note)}>{t(cur.step)}</Fb>
            </>
          ) : (
            <p className="v2-lead">{t(data.help)}</p>
          )}
          {idx > 0 || done ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
              {/* FAQAT oxirgi ikkitasi: beshtasi yig'ilganda ekran 75px oshib
                  ketardi (2026-08-11 o'lchovi, noutbuk 1366x615). */}
              {data.tasks.slice(0, done ? data.tasks.length : idx).slice(-2).map((tk, i) => (
                <span key={i} className="v2-done"><s>{'✓'}</s>{t(tk.prompt)} {t(tk.solution)}</span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Shell>
  )
}

// Qisqartma: variant + izoh
const O = (id, label, hint) => ({ id, label, hint })
const OK = (id, label) => ({ id, label, correct: true })

// ============================================================================
// EKRAN 9. QAVSLARNI OCHISH -- besh misol.
// ============================================================================
// Kiritish rejimida `misses` -- aynan shu yozuvga izoh, `wrongDefault` --
// qolgan hamma holat uchun. Variantlar `items` da qoladi: ular xatolar
// ro'yxati sifatida ham, kelajakda tanlov rejimi uchun ham kerak.
const WRONG_DEFAULT = L(
  "Har bir qo'shiluvchini alohida ko'paytiring va ishoralarni tekshiring.",
  'Умножьте на каждое слагаемое отдельно и проверьте знаки.',
  'Multiply each term separately and check the signs.',
)
const S9 = {
  eyebrow: L('MASHQ', 'ТРЕНИРОВКА', 'PRACTICE'),
  section: L('AMALIYOT', 'ПРАКТИКА', 'PRACTICE'),
  chip: L('BESH MISOL', 'ПЯТЬ ПРИМЕРОВ', 'FIVE EXAMPLES'),
  title: L('Qavslarni oching', 'Раскройте скобки', 'Expand the brackets'),
  // Maket bo'yicha javob KIRITILADI (metodist 2026-08-11: «как в макете»).
  input: true,
  pill: L('MISOL', 'ПРИМЕР', 'EXAMPLE'),
  cardCap: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
  step: L('Besh misol navbat bilan', 'Пять примеров по очереди', 'Five examples in turn'),
  stepSub: L("To'liq javobni kiriting", 'Введите полный ответ', 'Type the full answer'),
  help: L("Har bir qo'shiluvchini alohida ko'paytiring.", 'Умножайте на каждое слагаемое отдельно.', 'Multiply each term separately.'),
  final: L('Beshtasi ham yechildi.', 'Все пять решены.', 'All five are solved.'),
  tasks: [
    {
      prompt: '2(x + 3) =', solution: '2x + 6', accept: ['6 + 2x'],
      step: L('Ikkilik x ga ham, uchga ham boradi.', 'Двойка идёт и к x, и к тройке.', 'The two reaches both x and the three.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      wrongDefault: WRONG_DEFAULT,
      misses: [
        { value: '2x + 3', hint: L("Ikkilik uchgacha yetmagan.", 'Двойка не дошла до тройки.', 'The two did not reach the three.') },
        { value: 'x + 6', hint: L("Ikkilik x ga ko'paytirilmagan.", 'Двойка не умножила x.', 'The two did not multiply x.') },
      ],
      items: [
        OK('a', '2x + 6'),
        O('b', '2x + 3', L("Ikkilik uchgacha yetmagan.", 'Двойка не дошла до тройки.', 'The two did not reach the three.')),
        O('c', 'x + 6', L("Ikkilik x ga ko'paytirilmagan.", 'Двойка не умножила x.', 'The two did not multiply x.')),
        O('d', '2x + 5', L("Ikkilik uchga qo'shilgan, ko'paytirilmagan.", 'Двойку прибавили к тройке, а не умножили.', 'The two was added to the three, not multiplied.')),
      ],
    },
    {
      prompt: '4(a − 6) =', solution: '4a − 24', accept: ['-24 + 4a'],
      step: L("Qavsdagi minus saqlanadi.", 'Минус внутри скобки сохраняется.', 'The minus inside stays.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      wrongDefault: WRONG_DEFAULT,
      items: [
        OK('a', '4a − 24'),
        O('b', '4a − 6', L("To'rtlik oltigacha yetmagan.", 'Четвёрка не дошла до шестёрки.', 'The four did not reach the six.')),
        O('c', '4a + 24', L("Qavsda minus edi, ishora saqlanadi.", 'В скобке был минус, знак сохраняется.', 'There was a minus inside, the sign stays.')),
        O('d', 'a − 24', L("To'rtlik a ga ham ko'paytiriladi.", 'Четвёрка умножает и a.', 'The four multiplies a as well.')),
      ],
    },
    {
      prompt: '−(m + 8) =', solution: '−m − 8', accept: ['-8 - m'],
      step: L('Minus ikkala ishorani almashtiradi.', 'Минус меняет оба знака.', 'The minus flips both signs.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      wrongDefault: WRONG_DEFAULT,
      items: [
        OK('a', '−m − 8'),
        O('b', '−m + 8', L("Sakkiz plyus edi, minusdan keyin minus bo'ladi.", 'Восемь была со знаком плюс, после минуса станет минус.', 'The eight was positive, after the minus it becomes negative.')),
        O('c', 'm − 8', L("Birinchi hadning ishorasi ham almashadi.", 'У первого слагаемого знак тоже меняется.', 'The first term flips too.')),
        O('d', 'm + 8', L("Qavs shunchaki o'chirilgan.", 'Скобки просто стёрли.', 'The brackets were simply erased.')),
      ],
    },
    {
      prompt: '5(2y + 1) =', solution: '10y + 5', accept: ['5 + 10y'],
      step: L("Beshlik ikkiga ham, birga ham ko'payadi.", 'Пятёрка умножает и двойку, и единицу.', 'The five multiplies both the two and the one.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      wrongDefault: WRONG_DEFAULT,
      items: [
        OK('a', '10y + 5'),
        O('b', '10y + 1', L("Beshlik birgacha yetmagan.", 'Пятёрка не дошла до единицы.', 'The five did not reach the one.')),
        O('c', '7y + 5', L("Besh va ikki qo'shilgan, ko'paytirilmagan.", 'Пять и два сложили, а не умножили.', 'Five and two were added, not multiplied.')),
        O('d', '10y + 6', L("Beshni birga ko'paytiring, qo'shmang.", 'Пять надо умножить на единицу, а не прибавить.', 'Multiply five by one, do not add.')),
      ],
    },
    {
      prompt: '−3(c − 2) =', solution: '−3c + 6', accept: ['6 - 3c'],
      step: L("Minus uch minus ikkiga ko'paytirilsa, plyus olti.", 'Минус три на минус два даёт плюс шесть.', 'Minus three times minus two gives plus six.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      wrongDefault: WRONG_DEFAULT,
      items: [
        OK('a', '−3c + 6'),
        O('b', '−3c − 6', L("Ikki minus plyus beradi.", 'Два минуса дают плюс.', 'Two minuses give a plus.')),
        O('c', '3c − 6', L("Ko'paytuvchi manfiy, c ning ishorasi ham manfiy.", 'Множитель отрицательный, знак у c тоже минус.', 'The multiplier is negative, so c is negative too.')),
        O('d', '−3c + 2', L("Ikkilik uchga ko'paytirilmagan.", 'Двойку не умножили на тройку.', 'The two was not multiplied by the three.')),
      ],
    },
  ],
  audio: [
    A('mount', 'Besh misol navbat bilan. Birinchisi.', 'Пять примеров по очереди. Первый.', 'Five examples in turn. The first one.'),
    A('q2', 'Ikkinchi misol.', 'Второй пример.', 'The second example.'),
    A('q3', 'Uchinchi misol.', 'Третий пример.', 'The third example.'),
    A('q4', "To'rtinchi misol.", 'Четвёртый пример.', 'The fourth example.'),
    A('q5', 'Beshinchi misol.', 'Пятый пример.', 'The fifth example.'),
  ],
}

// ============================================================================
// EKRAN 10. KEYINGI QADAMNI TANLASH.
// ============================================================================
const STEP_OPEN = L('Qavsni ochish', 'Раскрыть скобки', 'Expand the brackets')
const STEP_LIKE = L("O'xshashlarni yig'ish", 'Привести подобные', 'Collect like terms')
const STEP_NUM = L("Sonlarni qo'shish", 'Сложить числа', 'Add the numbers')
const STEP_SIGN = L('Ishoralarni almashtirib ochish', 'Раскрыть со сменой знаков', 'Expand flipping the signs')
const STEP_BOTH = L('Ikkala qavsni ochish', 'Раскрыть обе скобки', 'Expand both brackets')

const S10 = {
  eyebrow: L('QADAM', 'ШАГ', 'STEP'),
  section: L('AMALIYOT', 'ПРАКТИКА', 'PRACTICE'),
  chip: L('KEYINGI QADAM', 'СЛЕДУЮЩИЙ ШАГ', 'NEXT STEP'),
  title: L('Keyingi qadamni tanlang', 'Выберите следующий шаг', 'Choose the next step'),
  pill: L('YOZUV', 'ЗАПИСЬ', 'RECORD'),
  cardCap: L("NIMA BO'LADI", 'ЧТО ПОЛУЧИТСЯ', 'WHAT COMES OUT'),
  step: L('Yechim qanday davom etadi', 'Как продолжается решение', 'How the solution continues'),
  stepSub: L('Bitta qadam tanlanadi', 'Выбирается один шаг', 'One step is chosen'),
  help: L("Avval qavs, keyin o'xshashlar.", 'Сначала скобки, потом подобные.', 'Brackets first, then like terms.'),
  final: L('Yechim tartibi tayyor.', 'Порядок решения освоен.', 'The order of solving is clear.'),
  role: 'practice',
  tasks: [
    {
      prompt: '3(x + 4) − 2x', solution: '→ 3x + 12 − 2x',
      step: L('Avval qavs ochiladi.', 'Сначала раскрываются скобки.', 'The brackets open first.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [
        OK('a', STEP_OPEN),
        O('b', STEP_LIKE, L("Qavs ichida x yo'q holda o'xshash yig'ib bo'lmaydi.", 'Пока скобка не раскрыта, подобные собрать нельзя.', 'Like terms cannot be collected before the brackets open.')),
        O('c', STEP_NUM, L("Qo'shiladigan son hali chiqmagan.", 'Числа для сложения ещё не появились.', 'The numbers to add are not there yet.')),
        O('d', STEP_SIGN, L("Qavs oldida minus emas, uchlik turibdi.", 'Перед скобкой не минус, а тройка.', 'A three stands before the brackets, not a minus.')),
      ],
    },
    {
      prompt: '3x + 12 − 2x', solution: '→ x + 12',
      step: L("x lar yig'iladi.", 'Собираются слагаемые с x.', 'The x terms are collected.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [
        OK('a', STEP_LIKE),
        O('b', STEP_OPEN, L("Bu yerda qavs yo'q.", 'Здесь скобок нет.', 'There are no brackets here.')),
        O('c', STEP_NUM, L("O'n ikki yolg'iz son, qo'shadigan juftligi yo'q.", 'Двенадцать одна, складывать не с чем.', 'Twelve is alone, nothing to add it to.')),
        O('d', STEP_SIGN, L("Ishoralarni almashtiradigan minus yo'q.", 'Нет минуса, который меняет знаки.', 'There is no minus to flip signs.')),
      ],
    },
    {
      prompt: '5 − (a − 3)', solution: '→ 5 − a + 3',
      step: L('Minus ikkala ishorani almashtiradi.', 'Минус меняет оба знака.', 'The minus flips both signs.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [
        OK('a', STEP_SIGN),
        O('b', STEP_OPEN, L("Ochish to'g'ri, lekin ishoralar almashishini unutmang.", 'Раскрыть верно, но знаки обязаны поменяться.', 'Expanding is right, but the signs must flip.')),
        O('c', STEP_LIKE, L("Qavs ochilmagan, o'xshashlar hali ko'rinmaydi.", 'Скобка не раскрыта, подобных пока не видно.', 'The bracket is closed, no like terms yet.')),
        O('d', STEP_NUM, L('Uchlik hali qavs ichida.', 'Тройка пока внутри скобки.', 'The three is still inside.')),
      ],
    },
    {
      prompt: '5 − a + 3', solution: '→ 8 − a',
      step: L("Besh va uch qo'shiladi.", 'Пять и три складываются.', 'Five and three add up.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [
        OK('a', STEP_NUM),
        O('b', STEP_LIKE, L("a yolg'iz, unga juft yo'q.", 'a одно, пары ему нет.', 'a is alone, it has no pair.')),
        O('c', STEP_OPEN, L("Qavs yo'q.", 'Скобок нет.', 'There are no brackets.')),
        O('d', STEP_SIGN, L("Ishorani almashtiradigan sabab yo'q.", 'Нет причины менять знаки.', 'There is no reason to flip signs.')),
      ],
    },
    {
      prompt: '2(y + 1) + 3(y − 2)', solution: '→ 2y + 2 + 3y − 6',
      step: L('Ikkala qavs ham ochiladi.', 'Раскрываются обе скобки.', 'Both brackets open.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [
        OK('a', STEP_BOTH),
        O('b', STEP_OPEN, L('Bu yerda qavs ikkita.', 'Здесь скобки две.', 'There are two brackets here.')),
        O('c', STEP_LIKE, L("Avval qavslar, keyin o'xshashlar.", 'Сначала скобки, потом подобные.', 'Brackets first, then like terms.')),
        O('d', STEP_NUM, L('Sonlar hali qavs ichida.', 'Числа пока внутри скобок.', 'The numbers are still inside.')),
      ],
    },
  ],
  audio: [
    A('mount', 'Yechim qanday davom etishini tanlang.', 'Выбери, как продолжается решение.', 'Choose how the solution continues.'),
    A('q2', 'Ikkinchi yozuv.', 'Вторая запись.', 'The second record.'),
    A('q3', 'Uchinchi yozuv.', 'Третья запись.', 'The third record.'),
    A('q4', "To'rtinchi yozuv.", 'Четвёртая запись.', 'The fourth record.'),
    A('q5', 'Beshinchi yozuv.', 'Пятая запись.', 'The fifth record.'),
  ],
}

// ============================================================================
// EKRAN 11. ISHORALARNI QO'YISH.
// ============================================================================
const S11 = {
  eyebrow: L('ISHORALAR', 'ЗНАКИ', 'SIGNS'),
  section: L('AMALIYOT', 'ПРАКТИКА', 'PRACTICE'),
  chip: L('ISHORA JUFTI', 'ПАРА ЗНАКОВ', 'SIGN PAIR'),
  title: L("Ishoralarni qo'ying", 'Расставьте знаки', 'Place the signs'),
  pill: L('IFODA', 'ВЫРАЖЕНИЕ', 'EXPRESSION'),
  cardCap: L('QOIDA ISHLAYDI', 'ПРАВИЛО РАБОТАЕТ', 'THE RULE AT WORK'),
  step: L('Ikki ishorani tanlang', 'Выберите два знака', 'Choose two signs'),
  stepSub: L('Qavs oldidagi belgiga qarang', 'Смотрите на знак перед скобкой', 'Look at the sign before the brackets'),
  help: L('Minus ikkalasini, plyus hech qaysisini almashtirmaydi.', 'Минус меняет оба, плюс не меняет ничего.', 'A minus flips both, a plus flips nothing.'),
  final: L('Ishoralar qoidasi mustahkam.', 'Правило знаков закреплено.', 'The sign rule is secured.'),
  role: 'practice',
  tasks: [
    {
      prompt: '−(a − 4) =', solution: '−a + 4',
      step: L('Minus ikkalasini almashtirdi.', 'Минус поменял оба знака.', 'The minus flipped both.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [OK('a', '−a + 4'), O('b', '−a − 4', L("Ikkinchisi minus edi, plyus bo'ladi.", 'Второе было минус, станет плюс.', 'The second was minus, it becomes plus.')), O('c', 'a + 4', L('Birinchisining ishorasi ham almashadi.', 'У первого знак тоже меняется.', 'The first flips too.')), O('d', 'a − 4', L("Qavs shunchaki o'chirilgan.", 'Скобки просто стёрли.', 'The brackets were erased.'))],
    },
    {
      prompt: '+(b − 5) =', solution: 'b − 5',
      step: L('Plyus ishoralarga tegmaydi.', 'Плюс знаки не трогает.', 'A plus leaves the signs alone.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [OK('a', 'b − 5'), O('b', 'b + 5', L('Plyus ichkaridagi minusni almashtirmaydi.', 'Плюс не меняет минус внутри.', 'A plus does not flip the inner minus.')), O('c', '−b − 5', L("Plyus b ning ishorasini o'zgartirmaydi.", 'Плюс не меняет знак b.', 'A plus does not change the sign of b.')), O('d', '−b + 5', L('Bu minus uchun javob.', 'Это ответ для минуса.', 'That is the answer for a minus.'))],
    },
    {
      prompt: '−(x + 7) =', solution: '−x − 7',
      step: L("Ikkala had ham manfiy bo'ldi.", 'Оба слагаемых стали отрицательными.', 'Both terms became negative.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [OK('a', '−x − 7'), O('b', '−x + 7', L("Yettilik plyus edi, minus bo'ladi.", 'Семёрка была плюс, станет минус.', 'The seven was plus, it becomes minus.')), O('c', 'x − 7', L('Birinchisi ham almashadi.', 'Первое тоже меняется.', 'The first flips too.')), O('d', 'x + 7', L("Minus e'tiborsiz qolgan.", 'Минус не учли.', 'The minus was ignored.'))],
    },
    {
      prompt: '−(−m + 2) =', solution: 'm − 2',
      step: L('Ikki minus plyus berdi.', 'Два минуса дали плюс.', 'Two minuses gave a plus.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [OK('a', 'm − 2'), O('b', '−m − 2', L('Ichkarida minus edi, ikki minus plyus beradi.', 'Внутри был минус, два минуса дают плюс.', 'There was a minus inside, two minuses give a plus.')), O('c', 'm + 2', L("Ikkilik plyus edi, minus bo'ladi.", 'Двойка была плюс, станет минус.', 'The two was plus, it becomes minus.')), O('d', '−m + 2', L('Hech nima almashmagan.', 'Ничего не поменялось.', 'Nothing flipped.'))],
    },
    {
      prompt: '+(k + 9) =', solution: 'k + 9',
      step: L("Plyus hech nimani o'zgartirmadi.", 'Плюс ничего не изменил.', 'The plus changed nothing.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [OK('a', 'k + 9'), O('b', '−k − 9', L('Bu minus uchun javob.', 'Это ответ для минуса.', 'That is the answer for a minus.')), O('c', 'k − 9', L("Plyus to'qqizning ishorasini o'zgartirmaydi.", 'Плюс не меняет знак девятки.', 'A plus does not change the nine.')), O('d', '−k + 9', L('Plyus k ga tegmaydi.', 'Плюс не трогает k.', 'A plus does not touch k.'))],
    },
  ],
  audio: [
    A('mount', "Qavs oldidagi belgiga qarab ishoralarni qo'ying.", 'Расставьте знаки, глядя на знак перед скобкой.', 'Place the signs by looking at the sign before the brackets.'),
    A('q2', 'Ikkinchi ifoda.', 'Второе выражение.', 'The second expression.'),
    A('q3', 'Uchinchi ifoda.', 'Третье выражение.', 'The third expression.'),
    A('q4', "To'rtinchi ifoda.", 'Четвёртое выражение.', 'The fourth expression.'),
    A('q5', 'Beshinchi ifoda.', 'Пятое выражение.', 'The fifth expression.'),
  ],
}

// ============================================================================
// EKRAN 12. BIRINCHI XATO QATOR.
// ============================================================================
const LINE1 = L('1-qator', 'Строка 1', 'Line 1')
const LINE2 = L('2-qator', 'Строка 2', 'Line 2')
const LINE3 = L('3-qator', 'Строка 3', 'Line 3')
const NOERR = L("Xato yo'q", 'Ошибки нет', 'No error')

const S12 = {
  eyebrow: L('XATO', 'ОШИБКА', 'ERROR'),
  section: L('AMALIYOT', 'ПРАКТИКА', 'PRACTICE'),
  chip: L('BIRINCHI XATO', 'ПЕРВАЯ ОШИБКА', 'THE FIRST ERROR'),
  title: L('Xato birinchi qayerda?', 'Где ошибка появилась первой?', 'Where does the error first appear?'),
  pill: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
  cardCap: L('QARSHI MISOL', 'КОНТРПРИМЕР', 'COUNTEREXAMPLE'),
  step: L('Birinchi xato qatorni toping', 'Найдите первую ошибочную строку', 'Find the first wrong line'),
  stepSub: L('Keyingi qatorlar undan kelib chiqadi', 'Дальнейшие строки следуют из неё', 'The later lines follow from it'),
  help: L("Har qatorni son bilan tekshirib ko'ring.", 'Проверьте каждую строку числом.', 'Check each line with a number.'),
  final: L("Xatoni topish ko'nikmasi tayyor.", 'Навык поиска ошибки готов.', 'The error-finding skill is ready.'),
  role: 'practice',
  tasks: [
    {
      prompt: '2(x + 3) = 2x + 3', solution: L('xato 1-qatorda', 'ошибка в строке 1', 'error in line 1'),
      step: L('Ikkilik uchgacha yetmagan.', 'Двойка не дошла до тройки.', 'The two did not reach the three.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [OK('a', LINE1), O('b', LINE2, L("Ikkinchi qator umuman yo'q.", 'Второй строки здесь нет.', 'There is no second line here.')), O('c', LINE3, L("Uchinchi qator ham yo'q.", 'Третьей строки тоже нет.', 'There is no third line either.')), O('d', NOERR, L("x = 1 da chapda 8, o'ngda 5.", 'При x = 1 слева 8, справа 5.', 'For x = 1 the left is 8, the right is 5.'))],
    },
    {
      prompt: '−(a − 5) = −a − 5', solution: L('xato 1-qatorda', 'ошибка в строке 1', 'error in line 1'),
      step: L('Ikkinchi ishora ham almashishi kerak edi.', 'Второй знак тоже должен был поменяться.', 'The second sign had to flip as well.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [OK('a', LINE1), O('b', LINE2, L('Bu yerda bitta qator.', 'Здесь одна строка.', 'There is one line here.')), O('c', LINE3, L("Uchinchi qator yo'q.", 'Третьей строки нет.', 'There is no third line.')), O('d', NOERR, L("a = 1 da chapda 4, o'ngda −6.", 'При a = 1 слева 4, справа −6.', 'For a = 1 the left is 4, the right is −6.'))],
    },
    {
      prompt: '3(x + 2) = 3x + 6;  3x + 6 − x = 2x + 6;  2x + 6 = 8x', solution: L('xato 3-qatorda', 'ошибка в строке 3', 'error in line 3'),
      step: L("Ikki x va oltini qo'shib bo'lmaydi.", 'Два x и шесть сложить нельзя.', 'Two x and six cannot be added.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [OK('c', LINE3), O('a', LINE1, L("Birinchi qator to'g'ri: 3x va 6.", 'Первая строка верна: 3x и 6.', 'The first line is right: 3x and 6.')), O('b', LINE2, L("Ikkinchisi ham to'g'ri: 3x − x = 2x.", 'Вторая тоже верна: 3x − x = 2x.', 'The second is right too: 3x − x = 2x.')), O('d', NOERR, L("Uchinchi qator xato: o'xshash emas.", 'Третья строка неверна: слагаемые не подобны.', 'The third line is wrong: the terms are not alike.'))],
    },
    {
      prompt: '4 − (b + 1) = 4 − b + 1;  4 − b + 1 = 5 − b', solution: L('xato 1-qatorda', 'ошибка в строке 1', 'error in line 1'),
      step: L("Bir plyus edi, minusdan keyin minus bo'ladi.", 'Единица была плюс, после минуса станет минус.', 'The one was plus, after the minus it becomes minus.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [OK('a', LINE1), O('b', LINE2, L("Ikkinchi qator birinchidan to'g'ri kelib chiqqan.", 'Вторая строка верно следует из первой.', 'The second line follows correctly from the first.')), O('c', LINE3, L("Uchinchi qator yo'q.", 'Третьей строки нет.', 'There is no third line.')), O('d', NOERR, L("b = 0 da chapda 3, o'ngda 5.", 'При b = 0 слева 3, справа 5.', 'For b = 0 the left is 3, the right is 5.'))],
    },
    {
      prompt: '2(y − 3) = 2y − 6;  2y − 6 + 6 = 2y;  2y = y', solution: L('xato 3-qatorda', 'ошибка в строке 3', 'error in line 3'),
      step: L('Ikki y va y bir xil emas.', 'Два y и y это не одно и то же.', 'Two y and y are not the same.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [OK('c', LINE3), O('a', LINE1, L("Birinchi qator to'g'ri.", 'Первая строка верна.', 'The first line is right.')), O('b', LINE2, L("Ikkinchisi ham to'g'ri.", 'Вторая тоже верна.', 'The second is right too.')), O('d', NOERR, L("y = 1 da chapda 2, o'ngda 1.", 'При y = 1 слева 2, справа 1.', 'For y = 1 the left is 2, the right is 1.'))],
    },
  ],
  audio: [
    A('mount', 'Birinchi xato qatorni toping.', 'Найдите первую ошибочную строку.', 'Find the first wrong line.'),
    A('q2', 'Ikkinchi yechim.', 'Второе решение.', 'The second solution.'),
    A('q3', 'Uchinchi yechim.', 'Третье решение.', 'The third solution.'),
    A('q4', "To'rtinchi yechim.", 'Четвёртое решение.', 'The fourth solution.'),
    A('q5', 'Beshinchi yechim.', 'Пятое решение.', 'The fifth solution.'),
  ],
}

const Screen9 = (p) => <Practice data={S9} {...p} />
const Screen10 = (p) => <Practice data={S10} {...p} />
const Screen11 = (p) => <Practice data={S11} {...p} />
const Screen12 = (p) => <Practice data={S12} {...p} />

// ============================================================================
// EKRAN 13. MASALA va BONUS FAKT.
// ============================================================================
const S13 = {
  eyebrow: L('MASALA', 'ЗАДАЧА', 'WORD PROBLEM'),
  section: L('MASALA', 'ЗАДАЧА', 'WORD PROBLEM'),
  chip: L('HAYOTDAN', 'ИЗ ЖИЗНИ', 'FROM LIFE'),
  title: L('Uchta tovar, har biriga chegirma', 'Три товара, у каждого скидка', 'Three items, each discounted'),
  cardCap: L('YOZUV', 'ЗАПИСЬ', 'THE RECORD'),
  step: L('Masalani yozuvga aylantiring', 'Переведите задачу в запись', 'Turn the problem into a record'),
  stepSub: L("Har bir tovardan 100 so'm chegirma", 'С каждого товара скидка 100 сумов', '100 sums off each item'),
  lead: L(
    "Tovar narxi a so'm. Har biridan 100 so'm chegirma. Uchta tovar olindi.",
    'Товар стоит a сумов. С каждого скидка 100 сумов. Купили три товара.',
    'An item costs a sums. Each is 100 sums off. Three items were bought.',
  ),
  probe: {
    question: L("Uchtasi uchun qancha to'lanadi?", 'Сколько заплатят за три?', 'How much is paid for three?'),
    ok: L("To'g'ri. Endi qavsni ochamiz.", 'Верно. Теперь раскроем скобки.', 'Correct. Now let us expand.'),
    items: [
      OK('a', '3(a − 100)'),
      O('b', '3a − 100', L('Chegirma har bir tovardan, uchtasidan uch marta.', 'Скидка с каждого товара, значит трижды.', 'The discount is per item, so three times.')),
      O('c', 'a − 300', L("Uchta tovar, ya'ni uchta narx.", 'Товара три, значит и цен три.', 'Three items means three prices.')),
      O('d', '3a + 300', L("Chegirma qo'shilmaydi, ayiriladi.", 'Скидка вычитается, а не прибавляется.', 'A discount is subtracted, not added.')),
    ],
  },
  reveal: '3(a − 100) = 3a − 300',
  revealNote: L(
    'Uchlik narxga ham, chegirmaga ham yetadi.',
    'Тройка доходит и до цены, и до скидки.',
    'The three reaches both the price and the discount.',
  ),
  factCap: L('BILASIZMI', 'А ЗНАЕТЕ ЛИ ВЫ', 'DID YOU KNOW'),
  fact: L(
    "Ustunda ko'paytirish ham qavs ochish: 23 · 4 = (20 + 3) · 4 = 80 + 12 = 92.",
    'Умножение в столбик тоже раскрытие скобок: 23 · 4 = (20 + 3) · 4 = 80 + 12 = 92.',
    'Column multiplication is expanding too: 23 · 4 = (20 + 3) · 4 = 80 + 12 = 92.',
  ),
  audio: [
    A('mount', "Tovar narxi a so'm, har biridan yuz so'm chegirma. Uchta tovar uchun qancha to'lanadi?", 'Товар стоит a сумов, с каждого скидка сто сумов. Сколько заплатят за три товара?', 'An item costs a sums, each is one hundred off. How much for three items?'),
    A('open', 'Qavsni ochamiz: uch a minus uch yuz.', 'Раскроем скобки: три a минус триста.', 'Expand: three a minus three hundred.'),
  ],
}

function Screen13({ screen, onAnswer, tone, ...rest }) {
  const t = useT()
  const audio = useAudio(useMemo(() => seg(S13.audio, rest.lang), [rest.lang]))
  const can = useInstructionGate(audio)
  const [ok, setOk] = useState(false)
  const [fact, setFact] = useState(false)
  useEffect(() => {
    if (!ok) return undefined
    const tmr = setTimeout(() => setFact(true), 1600)
    return () => clearTimeout(tmr)
  }, [ok])
  return (
    <Shell eyebrow={S13.eyebrow} section={S13.section} screen={screen} audio={audio} solved={ok} tone={tone} {...rest}>
      <TitleRow eyebrow={S13.section} title={S13.title} chip={S13.chip} />
      <div className="v2-two">
        <div className="v2-side">
          <AudioBar audio={audio} title={S13.step} sub={S13.stepSub} />
          <p className="v2-lead">{t(S13.lead)}</p>
          <div className="v2-card">
            <Ask data={S13.probe} disabled={!can} audio={audio}
              onRight={(r) => { setOk(true); audio.step('open'); onAnswer({ screen, role: 'task', ...r }) }} />
          </div>
        </div>
        <div className="v2-card">
          <span className="v2-card-cap">{t(S13.cardCap)}</span>
          {ok ? (
            <>
              <p className="v2-expr v2-expr-lg v2-in" style={{ margin: 0, color: C.orange }}>{S13.reveal}</p>
              <Fb tone="note" title={t(UI.note)}>{t(S13.revealNote)}</Fb>
            </>
          ) : (
            <p className="v2-lead">{t(S13.stepSub)}</p>
          )}
          {fact ? (
            <div className="v2-in" style={{ marginTop: 6, padding: '11px 14px', borderRadius: 12, background: C.tealSoft, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="v2-card-cap" style={{ color: C.teal }}>{t(S13.factCap)}</span>
              <p className="v2-lead" style={{ color: C.ink }}>{t(S13.fact)}</p>
            </div>
          ) : null}
          <span className="v2-mark">G7 · D05 · 13</span>
        </div>
      </div>
    </Shell>
  )
}

// ============================================================================
// EKRAN 14. YAKUNIY ARALASHMA: besh topshiriq, hamma tur bo'yicha.
// ============================================================================
const S14 = {
  eyebrow: L('YAKUNIY', 'ФИНАЛ', 'FINAL'),
  section: L('YAKUNIY MIKS', 'ФИНАЛЬНЫЙ МИКС', 'FINAL MIX'),
  chip: L('BESH TUR', 'ПЯТЬ ТИПОВ', 'FIVE TYPES'),
  title: L('Hammasi birga', 'Всё вместе', 'Everything together'),
  pill: L('TOPSHIRIQ', 'ЗАДАНИЕ', 'TASK'),
  cardCap: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
  step: L('Besh topshiriq ketma-ket', 'Пять заданий подряд', 'Five tasks in a row'),
  stepSub: L("Keyingisi to'g'ri javobdan keyin", 'Следующее после верного ответа', 'The next comes after a correct answer'),
  help: L('Darsning uch qoidasini eslang.', 'Вспомните три правила урока.', 'Recall the three rules of the lesson.'),
  final: L('Dars topshiriqlari bajarildi.', 'Задания урока выполнены.', 'The lesson tasks are done.'),
  role: 'blitz',
  tasks: [
    {
      prompt: '−2(x + 5) =', solution: '−2x − 10',
      step: L("Manfiy ko'paytuvchi ikkala hadga.", 'Отрицательный множитель к обоим слагаемым.', 'A negative multiplier to both terms.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [OK('a', '−2x − 10'), O('b', '−2x + 10', L("Beshlik plyus edi, minusga ko'paytirilsa manfiy bo'ladi.", 'Пятёрка была плюс, на минус даёт минус.', 'The five was plus, times minus gives minus.')), O('c', '2x − 10', L('x ning ishorasi ham manfiy.', 'Знак у x тоже минус.', 'The sign of x is negative too.')), O('d', '−2x − 5', L('Ikkilik beshgacha yetmagan.', 'Двойка не дошла до пятёрки.', 'The two did not reach the five.'))],
    },
    {
      prompt: '7 − (c − 2) =', solution: '7 − c + 2',
      step: L('Minus ikkala ishorani almashtirdi.', 'Минус поменял оба знака.', 'The minus flipped both signs.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [OK('a', '7 − c + 2'), O('b', '7 − c − 2', L("Ikkilik minus edi, plyus bo'ladi.", 'Двойка была минус, станет плюс.', 'The two was minus, it becomes plus.')), O('c', '7 + c − 2', L("c ning ishorasi minus bo'ladi.", 'Знак у c станет минус.', 'The sign of c becomes minus.')), O('d', '7 − c − 2 + 2', L('Ikkilik bir marta hisoblanadi.', 'Двойка учитывается один раз.', 'The two counts once.'))],
    },
    {
      prompt: '3 + (y − 1) =', solution: '3 + y − 1',
      step: L('Plyus ishoralarga tegmaydi.', 'Плюс знаки не трогает.', 'A plus leaves the signs alone.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [OK('a', '3 + y − 1'), O('b', '3 − y + 1', L('Qavs oldida plyus, minus emas.', 'Перед скобкой плюс, а не минус.', 'A plus stands before the brackets, not a minus.')), O('c', '3y − 3', L("Bu qo'shuv, ko'paytirish emas.", 'Это сложение, а не умножение.', 'This is addition, not multiplication.')), O('d', '3 + y + 1', L('Bir minus edi.', 'Единица была со знаком минус.', 'The one was negative.'))],
    },
    {
      prompt: '5(a − 1) = 5a − 1', solution: L("xato: 5a − 5 bo'lishi kerak", 'ошибка: должно быть 5a − 5', 'error: it should be 5a − 5'),
      step: L('Beshlik birgacha yetmagan.', 'Пятёрка не дошла до единицы.', 'The five did not reach the one.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [OK('a', L('Xato bor', 'Ошибка есть', 'There is an error')), O('b', L("Xato yo'q", 'Ошибки нет', 'No error'), L("a = 1 da chapda 0, o'ngda 4.", 'При a = 1 слева 0, справа 4.', 'For a = 1 the left is 0, the right is 4.')), O('c', L('Faqat ishorada xato', 'Ошибка только в знаке', 'Only the sign is wrong'), L("Ishora to'g'ri, son noto'g'ri.", 'Знак верный, неверно число.', 'The sign is right, the number is wrong.')), O('d', L('Qavs ortiqcha', 'Скобка лишняя', 'The bracket is extra'), L("Qavs kerak, u ko'paytiruvchi qamrovini ko'rsatadi.", 'Скобка нужна: она показывает, на что действует множитель.', 'The bracket shows what the multiplier acts on.'))],
    },
    {
      prompt: L("Ikkita daftar, har biridan 50 so'm chegirma", 'Две тетради, с каждой скидка 50 сумов', 'Two notebooks, 50 sums off each'), solution: '2(a − 50) = 2a − 100',
      step: L('Chegirma har bir daftardan.', 'Скидка с каждой тетради.', 'The discount is per notebook.'),
      ok: L("To'g'ri.", 'Верно.', 'Correct.'),
      items: [OK('a', '2a − 100'), O('b', '2a − 50', L("Chegirma ikkitasidan, ya'ni ikki marta.", 'Скидка с двух, значит дважды.', 'The discount applies twice.')), O('c', 'a − 100', L('Daftar ikkita, narx ham ikkita.', 'Тетради две, значит и цен две.', 'Two notebooks means two prices.')), O('d', '2a + 100', L('Chegirma ayiriladi.', 'Скидка вычитается.', 'A discount is subtracted.'))],
    },
  ],
  audio: [
    A('mount', 'Besh topshiriq: hamma turdan.', 'Пять заданий: по всем типам.', 'Five tasks covering all types.'),
    A('q2', 'Ikkinchi topshiriq.', 'Второе задание.', 'The second task.'),
    A('q3', 'Uchinchi topshiriq.', 'Третье задание.', 'The third task.'),
    A('q4', "To'rtinchi topshiriq.", 'Четвёртое задание.', 'The fourth task.'),
    A('q5', 'Beshinchi topshiriq.', 'Пятое задание.', 'The fifth task.'),
  ],
}

const Screen14 = (p) => <Practice data={S14} {...p} />

// ============================================================================
// EKRAN 15. YAKUN. To'rt ko'nikma kartochkasi birin-ketin.
// ============================================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  section: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  chip: L('DARS TUGADI', 'УРОК ПРОЙДЕН', 'LESSON COMPLETE'),
  title: L("Darsda nimani o'rgandim", 'Что я изучил за урок', 'What I learned in this lesson'),
  cardCap: L('KEYINGI MAVZUGA TAYYORLIK', 'ГОТОВНОСТЬ К СЛЕДУЮЩЕЙ ТЕМЕ', 'READY FOR THE NEXT TOPIC'),
  step: L("To'rt ko'nikma", 'Четыре навыка', 'Four skills'),
  stepSub: L('Ovoz bilan birga chiqadi', 'Появляются вместе с озвучкой', 'They appear with the narration'),
  skills: [
    { n: '01', text: L("Qavsdagi har bir hadga ko'paytiraman", 'Умножаю на каждый член скобки', 'I multiply every term in the brackets'), ex: '3(a + 5) = 3a + 15' },
    { n: '02', text: L('Minusdan keyin ikkala ishorani almashtiraman', 'Меняю оба знака после минуса', 'I flip both signs after a minus'), ex: '−(a − 7) = −a + 7' },
    { n: '03', text: L("Tenglikni son qo'yib tekshiraman", 'Проверяю равенство подстановкой', 'I check equality by substitution'), ex: 'a = 10 → −3 = −3' },
    { n: '04', text: L('Birinchi xato qatorni topaman', 'Нахожу первую ошибочную строку', 'I find the first wrong line'), ex: '2(x + 3) ≠ 2x + 3' },
  ],
  ready: L(
    "Keyingi blok: qavsli tenglamalar. Qavsni ochmasdan ularni yechib bo'lmaydi.",
    'Следующий блок: уравнения со скобками. Без раскрытия их не решить.',
    'Next block: equations with brackets. They cannot be solved without expanding.',
  ),
  audio: [
    A('mount', "Qavsdagi har bir hadga ko'paytiraman.", 'Умножаю на каждый член скобки.', 'I multiply every term in the brackets.'),
    A('s2', 'Minusdan keyin ikkala ishorani almashtiraman.', 'Меняю оба знака после минуса.', 'I flip both signs after a minus.'),
    A('s3', "Tenglikni son qo'yib tekshiraman.", 'Проверяю равенство подстановкой.', 'I check equality by substitution.'),
    A('s4', 'Birinchi xato qatorni topaman.', 'Нахожу первую ошибочную строку.', 'I find the first wrong line.'),
  ],
}

function Screen15({ screen, tone, ...rest }) {
  const t = useT()
  const audio = useAudio(useMemo(() => seg(S15.audio, rest.lang), [rest.lang]))
  const [n, setN] = useState(1)
  useEffect(() => {
    if (n >= S15.skills.length) return undefined
    const tmr = setTimeout(() => setN((k) => { audio.step('s' + (k + 1)); return k + 1 }), 1100)
    return () => clearTimeout(tmr)
  }, [n]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Shell eyebrow={S15.eyebrow} section={S15.section} screen={screen} audio={audio} solved tone={tone} notes={false} {...rest}>
      <TitleRow eyebrow={S15.section} title={S15.title} chip={S15.chip} />
      <AudioBar audio={audio} title={S15.step} sub={S15.stepSub} />
      <div className="v2-two">
        <div className="v2-side">
          {S15.skills.slice(0, Math.min(n, 2)).map((s, i) => (
            <div key={i} className="v2-card v2-in" style={{ gap: 3 }}>
              <span className="v2-card-cap" style={{ color: C.green }}>{s.n}</span>
              <p className="v2-ask" style={{ margin: 0 }}>{t(s.text)}</p>
              <p className="v2-expr v2-expr-sm" style={{ margin: 0, color: C.teal }}>{s.ex}</p>
            </div>
          ))}
        </div>
        <div className="v2-side">
          {S15.skills.slice(2, Math.max(2, n)).map((s, i) => (
            <div key={i} className="v2-card v2-in" style={{ gap: 3 }}>
              <span className="v2-card-cap" style={{ color: C.green }}>{s.n}</span>
              <p className="v2-ask" style={{ margin: 0 }}>{t(s.text)}</p>
              <p className="v2-expr v2-expr-sm" style={{ margin: 0, color: C.teal }}>{s.ex}</p>
            </div>
          ))}
          {n >= S15.skills.length ? (
            <div className="v2-card v2-in">
              <span className="v2-card-cap">{t(S15.cardCap)}</span>
              <p className="v2-lead" style={{ color: C.ink }}>{t(S15.ready)}</p>
              <span className="v2-mark">G7 · D05 · 15</span>
            </div>
          ) : null}
        </div>
      </div>
    </Shell>
  )
}

const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8,
  Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15]
