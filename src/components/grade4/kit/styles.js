// 4-sinf nazariy darslari (11-20) uchun umumiy ko'rinish qatlami.
//
// Nega alohida modul: ilgari uslublar har bir DarsNN.jsx ichida nusxa turardi,
// shuning uchun o'nta dars o'nta xil ko'rinardi (CLAUDE.md §5).
//
// Ikki qat'iy qoida shu faylda hal qilinadi:
//   1) SKROLL YO'Q, lekin hech narsa kesilmaydi. `.stage` uch qatorli grid:
//      sarlavha (auto) / model (minmax(0,1fr)) / navigatsiya (auto). Model
//      zonasidagi SVG `preserveAspectRatio="xMidYMid meet"` bilan qolgan
//      balandlikka moslashadi — element o'chirilmaydi, kichrayadi.
//   2) TO'Q SAHNA faqat birinchi ekranda (ETALON, Dars01 bilan bir xil
//      gradient va radius). Qolgan ekranlar — yorug' kartochka.
import { T } from '../theoryShell/palette.js';
import { WRONG_FLASH_CSS } from '../wrongAnswerFlash.js';
import { SUMMARY_STYLES } from './summaryStyles.js';

export const KIT_STYLES = `
html:has(.lesson-root),
body:has(.lesson-root),
#root:has(.lesson-root),
.lesson-page:has(.lesson-root),
.lesson-frame:has(.lesson-root) {
  width: 100%;
  height: 100%;
  min-height: 0 !important;
  overflow: hidden !important;
  overscroll-behavior: none;
}
html, body { margin: 0; padding: 0; }

.lesson-root, .lesson-root * { box-sizing: border-box; }
.lesson-root {
  position: fixed;
  inset: 0;
  overflow: clip;
  overscroll-behavior: none;
  contain: strict;
  isolation: isolate;
  zoom: var(--g4z, 1);
  color: ${T.ink};
  font-family: 'Manrope', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  background:
    radial-gradient(circle at 12% 10%, rgba(22,143,163,.10), transparent 32%),
    radial-gradient(circle at 88% 84%, rgba(255,91,53,.08), transparent 34%),
    linear-gradient(146deg, #F7F8F4 0%, #EDF2F0 100%);
}
.lesson-root h1, .lesson-root h2, .lesson-root h3,
.lesson-root p, .lesson-root ul, .lesson-root ol { margin: 0; padding: 0; }
.lesson-root button { font: inherit; color: inherit; }
@media (max-width: 639.98px) { .lesson-root { width: 390px; } }

/* ------------------------------------------------------------------ */
/* Karkas: uch qatorli grid, o'rtasi qolgan balandlikni oladi           */
/* ------------------------------------------------------------------ */
.stage {
  width: min(936px, 100%);
  height: 100%;
  margin: 0 auto;
  padding: 0 clamp(12px, 2.4vw, 24px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: clamp(6px, 1.1vh, 12px);
}
.stage-head { padding-top: clamp(8px, 1.4vh, 14px); }
/* Host sahifa yuqori burchaklarda o'zining "Orqaga" tugmasi va til panelini
   chizadi (LessonPage.css, position: fixed, z-index 1000). Ular dars ustida
   suzadi, shuning uchun tepada joy ajratamiz — aks holda ovoz tugmasi
   bosilmay qoladi. */
.lesson-frame .stage-head { padding-top: 66px; }
@media (max-width: 720px) { .lesson-frame .stage-head { padding-top: 60px; } }
.lesson-frame .preview-language { display: none !important; }
.progress-track {
  width: 100%;
  height: 5px;
  border-radius: 999px;
  background: rgba(23,59,82,.12);
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, ${T.cyan}, ${T.lime});
  transition: width .45s cubic-bezier(.4,0,.2,1);
}
.head-row {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 26px;
}
.head-left { display: inline-flex; align-items: center; gap: 8px; min-width: 0; }
.head-eyebrow {
  color: ${T.cyan};
  font-size: clamp(10px, 1.3vw, 12px);
  font-weight: 800;
  letter-spacing: .09em;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.screen-type {
  padding: 3px 9px;
  border-radius: 999px;
  background: ${T.cyanSoft};
  color: ${T.cyan};
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .07em;
  text-transform: uppercase;
  white-space: nowrap;
}
.head-right { display: inline-flex; align-items: center; gap: 8px; }
.screen-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: ${T.ink3};
  white-space: nowrap;
}
.audio-controls { display: inline-flex; gap: 4px; }
.icon-btn {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 9px;
  background: rgba(23,59,82,.07);
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  transition: background .18s;
}
.icon-btn:hover { background: rgba(23,59,82,.13); }

/* ------------------------------------------------------------------ */
/* Ekran tanasi: sarlavha / model / javob                              */
/* ------------------------------------------------------------------ */
.stage-body {
  min-height: 0;
  display: grid;
  /* Qatorlar TEPADAN joylashadi: asosiy freym yuqorida, javob bloki darrov
     uning ostida. Ortiqcha bo'sh joy pastda qoladi (metodist qarori). */
  grid-template-rows: auto minmax(0, auto) auto;
  align-content: start;
  gap: clamp(8px, 1.6vh, 18px);
}
.screen-title {
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 650;
  font-size: clamp(18px, 2.3vw, 23px);
  line-height: 1.14;
  letter-spacing: -.012em;
  text-wrap: balance;
}
.screen-lead {
  margin-top: 5px;
  color: ${T.ink2};
  font-size: clamp(11px, 1.3vw, 12.5px);
  line-height: 1.45;
  max-width: 72ch;
}
.screen-question {
  font-weight: 750;
  font-size: clamp(13px, 1.6vw, 15px);
  line-height: 1.3;
}

/* Model zonasi. Freym slaydni vertikal to'ldirmaydi: karta o'z nisbatiga
   qarab o'lchanadi va markazda turadi (metodist qarori). Balandlik chegarasi
   qo'yilgani uchun katta ekranda ham baland oq quti chiqmaydi. */
.model-area {
  min-height: 0;
  min-width: 0;
  max-height: 54vh;
  display: grid;
  place-items: start center;
  overflow: hidden;
}
.model-card {
  /* Kenglik to'liq qoladi, BALANDLIK chizma nisbatiga ergashadi — shuning
     uchun freym slaydni vertikal to'ldirmaydi. Joy yetmasa max-height
     cheklaydi va SVG o'zi kichrayadi (kesilmaydi). */
  width: 100%;
  height: auto;
  aspect-ratio: var(--g4-model-ratio, 520 / 232);
  max-width: 100%;
  max-height: 100%;
  min-height: 0;
  padding: clamp(6px, 1.2vh, 12px) clamp(8px, 1.4vw, 14px);
  border-radius: 20px;
  background: ${T.paper};
  box-shadow:
    inset 0 0 0 1px rgba(23,59,82,.09),
    0 18px 38px -30px rgba(${T.shadowBase}, .55);
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  overflow: hidden;
}
.model-card.model-plain { background: transparent; box-shadow: none; padding: 0; }
.model-card.model-card-fit { aspect-ratio: auto; height: auto; }

/* Ochroq rang qatlami (metodist qarori 2026-08-19): karta quruq oq emas,
   yengil yashil-havorang tovlanadi. Palitra kengaymaydi — faqat T.lime va
   T.cyan ning juda past shaffofligi ishlatiladi. */
.model-card:not(.model-plain) {
  background:
    radial-gradient(circle at 12% 8%, rgba(149,201,61,.11), transparent 42%),
    radial-gradient(circle at 92% 92%, rgba(22,143,163,.10), transparent 46%),
    linear-gradient(160deg, #FFFFFF 0%, #F6FBF5 100%);
}

/* BuildScreen: bola nechta nuqtani o'zi qo'yganini ko'rsatadigan qator. */
.build-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: ${T.ink2};
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 800;
}
.build-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: rgba(23,59,82,.14);
  transition: background .25s, transform .25s;
}
.build-dot-done { background: ${T.lime}; transform: scale(1.18); }

/* ------------------------------------------------------------------ */
/* Takrorlanadigan bloklar (blocks.jsx): QOIDA kartasi va qadamlar      */
/* ------------------------------------------------------------------ */
.kit-rule { display: grid; gap: 8px; align-content: center; }
.kit-rule-row {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) auto;
  align-items: center;
  gap: 11px;
  padding: 10px 13px;
  border-radius: 15px;
  background: ${T.paper};
  box-shadow: inset 0 0 0 1px rgba(23,59,82,.1), 0 12px 26px -24px rgba(${T.shadowBase}, .5);
  opacity: .3;
  transition: opacity .4s ease;
}
.kit-rule-row.is-open { opacity: 1; }
.kit-rule-num {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  color: #FFFFFF;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 900;
}
.kit-rule-row strong { display: block; font-size: 13px; }
.kit-rule-row p { margin-top: 2px; color: ${T.ink2}; font-size: clamp(11px, 1.4vw, 13px); line-height: 1.36; }
.kit-rule-formula {
  padding: 6px 11px;
  border-radius: 10px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(13px, 1.7vw, 16px);
  white-space: nowrap;
}

.kit-steps { display: grid; gap: 6px; align-content: center; }
.kit-step {
  display: grid;
  grid-template-columns: 26px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 13px;
  background: ${T.paper};
  box-shadow: inset 0 0 0 1px rgba(23,59,82,.1);
  transition: background .25s, box-shadow .25s;
}
.kit-step b {
  min-width: 0;
  overflow-wrap: anywhere;
  color: ${T.ink};
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(13px, 1.7vw, 17px);
  font-weight: 800;
}
.kit-step-num {
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 800;
}
.kit-step.is-bad { background: ${T.warnSoft}; box-shadow: inset 0 0 0 1.8px rgba(169,111,19,.45); }
.kit-step.is-bad .kit-step-num { color: ${T.warn}; background: rgba(169,111,19,.14); }
.kit-step i {
  padding: 4px 9px;
  border-radius: 999px;
  color: ${T.warn};
  background: rgba(169,111,19,.14);
  font-size: 10px;
  font-style: normal;
  font-weight: 900;
  letter-spacing: .06em;
  text-transform: uppercase;
  white-space: nowrap;
}
.kit-step-hint { color: ${T.ink2}; font-size: 12px; text-align: center; }
/* Chizma har doim to'liq ko'rinadi: kesilmaydi, faqat kichrayadi */
.fit-svg {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: visible;
}

/* ------------------------------------------------------------------ */
/* To'q sahna — FAQAT birinchi ekran (etalon Dars01 qiymatlari)         */
/* ------------------------------------------------------------------ */
.hero-scene {
  position: relative;
  isolation: isolate;
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: clamp(10px, 1.8vh, 18px) clamp(12px, 2vw, 20px);
  border-radius: 24px;
  overflow: hidden;
  color: #EAF9FB;
  background:
    radial-gradient(circle at 86% 22%, rgba(121,211,218,.16), transparent 26%),
    radial-gradient(circle at 10% 88%, rgba(149,201,61,.10), transparent 27%),
    linear-gradient(145deg, rgba(22,143,163,.24), transparent 48%),
    linear-gradient(135deg, #153B50, #0B2232 72%);
  box-shadow: 0 22px 50px -30px rgba(14,33,44,.75);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 8px;
}
.hero-scene::after {
  content: '';
  position: absolute;
  inset: 1px;
  border-radius: 23px;
  box-shadow: inset 0 0 0 1px rgba(144,228,235,.16);
  pointer-events: none;
}
.hero-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(8px, 1vw, 10px);
  font-weight: 800;
  letter-spacing: .13em;
  color: #9DE3E7;
}
.hero-state { color: ${T.lime}; }
.hero-state.hero-state-alert { color: #FFB39B; }
.hero-body { min-height: 0; min-width: 0; display: grid; place-items: center; }

/* ------------------------------------------------------------------ */
/* Javob varianti                                                       */
/* ------------------------------------------------------------------ */
.answer-area { display: grid; gap: clamp(5px, .9vh, 9px); }
.options {
  display: grid;
  gap: clamp(6px, 1vw, 10px);
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
}
.options.options-stack { grid-template-columns: 1fr; }
/* To'rtta variant — 2x2 panjara (etalon Dars01 dagidek), bir ustunda emas. */
.options.options-two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
/* Telefonda variantlar HAR DOIM bitta ustunda: yonma-yon qo'yilsa uzun matn
   ramkadan chiqib ketadi (390px maketda tekshirilgan). */
@media (max-width: 639.98px) {
  .options, .options.options-two { grid-template-columns: 1fr; }
}
.option > span:last-child { min-width: 0; overflow-wrap: anywhere; }
/* Qisqa variantlar mazmuni bo'yicha o'lchanadi va markazga yig'iladi: uch
   ta son butun kenglikka cho'zilganda ekranda bo'sh oq lavhalar ko'rinardi
   (metodist qarori 2026-08-21). display: flex grid ustunlarini bekor qiladi,
   shuning uchun telefon uchun yozilgan "bitta ustun" qoidasi ham tegmaydi. */
.options.options-compact {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.options.options-compact .option {
  flex: 0 1 auto;
  min-width: 104px;
  justify-content: center;
}
/* Telefonda TO'RTTA ixcham variant bir qatorga sig'maydi va 3 + 1 bo'lib
   qoladi — oxirgi chip yolg'iz turadi. Ularni 2 + 2 qilib qo'yamiz. Uchta
   variant bir qatorga sig'adi, shuning uchun qoida faqat to'rtinchi chip
   bo'lganda ishlaydi. */
@media (max-width: 639.98px) {
  .options.options-compact:has(.option:nth-child(4)) .option {
    flex: 1 1 calc(50% - 6px);
    min-width: 0;
  }
}
/* Sof sonli javoblar moshirinali: loyihada son va birlik JetBrains Mono da
   yoziladi. Harf qatnashgan variant Manrope da qoladi. */
.options.options-numeric .option > span:last-child {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  letter-spacing: -.01em;
}
.option {
  min-height: 50px;
  padding: clamp(10px, 1.5vh, 14px) 14px;
  display: flex;
  align-items: center;
  gap: 9px;
  text-align: left;
  border: 0;
  border-radius: 13px;
  background: ${T.paper};
  box-shadow:
    inset 0 0 0 1px rgba(23,59,82,.12),
    0 10px 22px -20px rgba(${T.shadowBase}, .5);
  font-size: clamp(13px, 1.65vw, 15px);
  font-weight: 650;
  cursor: pointer;
  transition: box-shadow .18s, background .18s, transform .18s;
}
.option:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow:
    inset 0 0 0 1px rgba(22,143,163,.4),
    0 14px 26px -20px rgba(${T.shadowBase}, .6);
}
.option:disabled { cursor: default; }
.option-key {
  flex: 0 0 auto;
  width: 27px;
  height: 27px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: ${T.cyanSoft};
  color: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 800;
}
/* Xato javobning DOIMIY qizil holati yo'q: u data-g4-wrong-flash atributi
   orqali qisqa vaqt ko'rinadi (wrongAnswerFlash.js, qaror 2026-08-21). */
.option-right {
  background: ${T.successSoft};
  box-shadow: inset 0 0 0 1.5px rgba(34,122,83,.5);
}
.option-right .option-key { background: rgba(34,122,83,.14); color: ${T.success}; }

/* Javobdan keyingi izoh */
.feedback {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 9px;
  align-items: start;
  padding: clamp(8px, 1.2vh, 12px) 12px;
  border-radius: 13px;
  font-size: clamp(11px, 1.25vw, 12px);
  line-height: 1.42;
  opacity: 0;
}
.feedback.open { animation: g4FeedbackIn .24s ease-out forwards; }
@keyframes g4FeedbackIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: none; }
}
.feedback.correct { background: ${T.successSoft}; color: #14512F; }
.feedback.wrong { background: ${T.warnSoft}; color: #6C4708; }
.feedback-label {
  display: block;
  margin-bottom: 2px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
  opacity: .8;
}
/* Bit yechim ramkasida — etalon Dars01 o'lchovi bilan bir xil chiziqda:
   figura kattaroq, to'g'ri javobda bir marta sakraydi. */
.feedback-bit { width: 38px; height: 47px; flex: 0 0 auto; }
.feedback-bit svg { width: 100%; height: 100%; }
.feedback-bit-solution { width: 46px; height: 57px; animation: g4reactionhop .72s ease .1s both; }
@media (prefers-reduced-motion: reduce) { .feedback-bit-solution { animation: none; } }

/* ------------------------------------------------------------------ */
/* Navigatsiya                                                          */
/* ------------------------------------------------------------------ */
.stage-nav {
  padding-bottom: clamp(8px, 1.4vh, 14px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.btn-ghost, .btn-next {
  min-height: 44px;
  padding: 0 clamp(14px, 2vw, 22px);
  border: 0;
  border-radius: 13px;
  font-size: clamp(12px, 1.5vw, 14px);
  font-weight: 750;
  cursor: pointer;
  transition: background .18s, box-shadow .18s, transform .18s, opacity .18s;
}
.btn-ghost { background: transparent; color: ${T.ink2}; }
.btn-ghost:hover { background: rgba(23,59,82,.07); }
/* Matn rangi .lesson-root button qoidasidan kuchliroq yozilishi kerak: aks
   holda color inherit ustun kelib, to'q ko'k tugmada to'q matn qolib ketadi
   va yozuv o'qilmaydi. Tayyor (apelsin) holatda esa aksincha to'q matn
   aniqroq ko'rinadi. */
.lesson-root .btn-next {
  background: ${T.navy};
  color: #F2F7F8;
  box-shadow: 0 14px 28px -18px rgba(23,59,82,.85);
}
/* Etalon (Dars01): tayyor tugma apelsin fon ustida OQ yozuv bilan turadi. */
.lesson-root .btn-next.btn-ready { color: #FFFFFF; }
.btn-next:hover:not(:disabled) { transform: translateY(-1px); background: #143246; }
.btn-next:disabled { opacity: .34; cursor: default; box-shadow: none; }
.btn-next.btn-ready { background: ${T.accent}; box-shadow: 0 14px 28px -18px rgba(255,91,53,.9); }
/* Tugma tayyor holatda apelsin rangda turadi. Umumiy hover qoidasi undan
   kuchliroq bo'lgani uchun kursor ustiga kelganda tugma to'q ko'k bo'lib
   qorayib ketardi. Tayyor holat uchun o'z hover rangi: rang o'zgarmaydi,
   faqat biroz yorishadi. */
.btn-next.btn-ready:hover:not(:disabled) { background: #FF7150; }


/* ------------------------------------------------------------------ */
/* Til almashtirgich (faqat previewda)                                  */
/* ------------------------------------------------------------------ */
.preview-language {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 40;
  display: inline-flex;
  gap: 3px;
  padding: 3px;
  border-radius: 10px;
  background: rgba(255,255,255,.86);
  box-shadow: 0 8px 20px -14px rgba(${T.shadowBase}, .7);
}
.preview-language button {
  padding: 3px 8px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: ${T.ink3};
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .05em;
  cursor: pointer;
}
.preview-language .preview-active { background: ${T.navy}; color: #fff; }

/* ------------------------------------------------------------------ */
/* Umumiy mexanika bo'laklari                                           */
/* ------------------------------------------------------------------ */
.slot-row {
  display: grid;
  gap: clamp(6px, 1vw, 10px);
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  justify-content: center;
  align-items: stretch;
}
.slot {
  min-height: 58px;
  padding: 7px 9px;
  display: grid;
  place-items: center;
  gap: 2px;
  border-radius: 12px;
  background: ${T.paper};
  box-shadow: inset 0 0 0 1.5px rgba(23,59,82,.16);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(15px, 2.1vw, 19px);
  font-weight: 800;
  cursor: pointer;
  transition: box-shadow .18s, background .18s;
}
.slot small {
  font-family: 'Manrope', system-ui, sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .05em;
  text-transform: uppercase;
  color: ${T.ink3};
}
.slot-empty {
  background: rgba(23,59,82,.04);
  box-shadow: none;
  outline: 1.5px dashed rgba(23,59,82,.26);
  outline-offset: -2px;
  color: ${T.ink3};
}
.slot-active { box-shadow: inset 0 0 0 2px ${T.cyan}; background: ${T.cyanSoft}; }
.slot-done { background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.45); color: ${T.success}; }

.hint-line {
  color: ${T.ink2};
  font-size: clamp(12px, 1.5vw, 13px);
  text-align: center;
}




/* ------------------------------------------------------------------ */
/* Boy kiritish mexanikalari (inputs.jsx)                               */
/* ------------------------------------------------------------------ */
.span-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex-wrap: wrap;
}
.span-cell {
  min-width: 44px;
  min-height: 50px;
  padding: 0 6px;
  border: 0;
  border-radius: 11px;
  background: ${T.paper};
  box-shadow: inset 0 0 0 1.5px rgba(23,59,82,.16);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(19px, 2.4vw, 24px);
  font-weight: 800;
  color: ${T.ink};
  cursor: pointer;
  transition: box-shadow .16s, background .16s;
}
.span-cell:hover:not(:disabled) { box-shadow: inset 0 0 0 2px rgba(22,143,163,.45); }
.span-active { background: ${T.cyanSoft}; box-shadow: inset 0 0 0 2px ${T.cyan}; }
.span-done { background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.5); color: ${T.success}; }
.span-tail {
  margin-left: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(17px, 2.2vw, 22px);
  font-weight: 800;
  color: ${T.ink2};
}

.numpad {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: clamp(8px, 1.4vw, 14px);
  align-items: center;
}
.numpad-display {
  min-height: 54px;
  padding: 8px 14px;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 7px;
  border-radius: 13px;
  background: ${T.paper};
  box-shadow: inset 0 0 0 1.5px rgba(23,59,82,.16);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 800;
  transition: box-shadow .18s, background .18s;
}
.numpad-display small {
  font-family: 'Manrope', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: ${T.ink3};
}
.numpad-bad { background: #FFF6F3; box-shadow: inset 0 0 0 2px rgba(255,91,53,.55); color: ${T.accent}; }
.numpad-done { background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.5); color: ${T.success}; }
.numpad-keys {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 5px;
}
.numpad-key {
  min-width: 40px;
  min-height: 44px;
  border: 0;
  border-radius: 10px;
  background: ${T.paper};
  box-shadow: inset 0 0 0 1.4px rgba(23,59,82,.14);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(15px, 1.8vw, 18px);
  font-weight: 800;
  cursor: pointer;
  transition: background .14s, box-shadow .14s;
}
.numpad-key:hover:not(:disabled) { background: ${T.cyanSoft}; }
.numpad-key:disabled { opacity: .4; cursor: default; }
/* Tasdiqlash tugmasi OLOVRANG (metodist qarori 2026-08-21): ilgari u to'q
   ko'k edi va bosiladigan asosiy harakatga o'xshamasdi.

   Selektor .lesson-root bilan boshlanadi ataylab: ".lesson-root button"
   qoidasi color: inherit beradi va spetsifiklik bo'yicha yolg'iz .numpad-ok
   dan kuchli — shu sababli ptichka to'q ko'k fon ustida to'q siyoh rangida
   chizilib, deyarli ko'rinmasdi. */
.lesson-root .numpad-ok {
  background: ${T.accent};
  color: #FFFFFF;
  box-shadow: 0 10px 22px -18px rgba(255,91,53,.9);
}
.lesson-root .numpad-ok:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 14px 26px -18px rgba(255,91,53,.95);
}
.numpad-del { color: ${T.ink2}; }
@media (max-width: 720px) {
  .numpad { grid-template-columns: minmax(0, 1fr); }
  .numpad-keys { grid-template-columns: repeat(6, minmax(0, 1fr)); }
}

.chip-row {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  gap: clamp(6px, 1vw, 10px);
}
.chip {
  min-height: 48px;
  padding: 8px 10px;
  border: 0;
  border-radius: 12px;
  background: ${T.paper};
  box-shadow: inset 0 0 0 1.5px rgba(23,59,82,.15);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(14px, 1.8vw, 17px);
  font-weight: 800;
  cursor: pointer;
  transition: box-shadow .16s, background .16s;
}
.chip:hover:not(:disabled) { box-shadow: inset 0 0 0 2px rgba(22,143,163,.45); }
.chip-done { background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.5); color: ${T.success}; }

.value-table {
  min-height: 0;
  align-self: center;
  display: grid;
  gap: 5px;
  width: min(620px, 100%);
  margin: 0 auto;
}
.value-table-head, .value-table-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 5px;
}
.value-table-head span {
  padding: 6px 8px;
  border-radius: 9px;
  background: ${T.cyanSoft};
  color: ${T.cyan};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .06em;
  text-transform: uppercase;
  text-align: center;
}
.value-table-row span {
  padding: 10px 8px;
  border-radius: 11px;
  background: #F8FAF9;
  box-shadow: inset 0 0 0 1px rgba(23,59,82,.1);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(15px, 1.9vw, 19px);
  font-weight: 800;
  text-align: center;
}
.value-cell-gap {
  background: ${T.accentSoft} !important;
  box-shadow: inset 0 0 0 2px rgba(255,91,53,.4) !important;
  color: ${T.accent};
}
.value-cell-done {
  background: ${T.successSoft} !important;
  box-shadow: inset 0 0 0 2px rgba(34,122,83,.45) !important;
  color: ${T.success};
}
.value-table-figure { margin-top: 4px; min-height: 0; }

/* 15-dars: tenglashtirish balandligini tanlash shkalasi. Tugmalar diagramma
   o'qining davomi bo'lib ko'rinsin uchun bir xil kenglikda va tekis turadi. */
.level-scale {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
}
.level-tick {
  min-width: 46px;
  min-height: 46px;
  padding: 6px 10px;
  border: 0;
  border-radius: 12px;
  background: #FFFFFF;
  box-shadow: inset 0 0 0 1.5px rgba(23,59,82,.14);
  color: ${T.ink};
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: background .18s, box-shadow .18s, color .18s;
}
.level-tick:hover:not(:disabled) { box-shadow: inset 0 0 0 2px rgba(22,143,163,.45); }
.level-tick:disabled { cursor: default; }
.level-tick-active { background: rgba(255,91,53,.12); box-shadow: inset 0 0 0 2px ${T.accent}; color: ${T.accent}; }
.level-tick-done { background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.5); color: ${T.success}; }
.level-unit {
  margin-left: 4px;
  color: ${T.ink3};
  font-family: 'Manrope', sans-serif;
  font-size: 13px;
  font-weight: 700;
}

/* 16-dars: formulani belgilardan yig'ish. Yuqorida — yig'ilayotgan qator,
   pastda — belgilar. Ikkalasi bir markazda turadi. */
.formula-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex-wrap: wrap;
  padding: 8px 10px;
  border-radius: 14px;
  background: ${T.cyanSoft};
  transition: background .2s;
}
.formula-line-done { background: ${T.successSoft}; }
.formula-prefix {
  margin-right: 4px;
  color: ${T.ink};
  font-family: 'JetBrains Mono', monospace;
  font-size: 19px;
  font-weight: 800;
}
.formula-slot {
  display: grid;
  place-items: center;
  min-width: 34px;
  min-height: 38px;
  padding: 0 6px;
  border-radius: 9px;
  background: rgba(255,255,255,.7);
  box-shadow: inset 0 0 0 1.5px rgba(23,59,82,.12);
  color: ${T.ink};
  font-family: 'JetBrains Mono', monospace;
  font-size: 19px;
  font-weight: 800;
}
.formula-slot-filled {
  background: #FFFFFF;
  box-shadow: inset 0 0 0 2px rgba(22,143,163,.45);
  color: ${T.cyan};
}
.formula-line-done .formula-slot-filled { box-shadow: inset 0 0 0 2px rgba(34,122,83,.45); color: ${T.success}; }
.token-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  flex-wrap: wrap;
}
.token {
  min-width: 46px;
  min-height: 46px;
  padding: 6px 12px;
  border: 0;
  border-radius: 12px;
  background: #FFFFFF;
  box-shadow: inset 0 0 0 1.5px rgba(23,59,82,.14);
  color: ${T.ink};
  font-family: 'JetBrains Mono', monospace;
  font-size: 19px;
  font-weight: 800;
  cursor: pointer;
  transition: background .18s, box-shadow .18s, opacity .18s;
}
.token:hover:not(:disabled) { box-shadow: inset 0 0 0 2px rgba(22,143,163,.45); }
.token:disabled { cursor: default; }
.token-used { background: ${T.successSoft}; box-shadow: none; color: rgba(34,122,83,.45); opacity: .5; }
/* Formula yig'ilgach ishlatilmagan ortiqcha belgilar ham so'nadi: ular endi
   bosilmaydi, lekin ko'zga tashlanib turmasligi kerak. */
.formula-line-done ~ .token-row .token:disabled:not(.token-used) { opacity: .35; box-shadow: none; }

/* 17-dars: shkalada topiladigan qiymat. Javob shkalaning o'zida beriladi,
   bu blok esa nima izlanayotganini ushlab turadi. */
.scale-target {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  padding: 9px 16px;
  margin: 0 auto;
  width: fit-content;
  border-radius: 14px;
  background: #FFFFFF;
  box-shadow: inset 0 0 0 2px ${T.accent};
  transition: box-shadow .2s, background .2s;
}
.scale-target span {
  color: ${T.accent};
  font-family: 'JetBrains Mono', monospace;
  font-size: 26px;
  font-weight: 800;
}
.scale-target small {
  color: ${T.ink3};
  font-family: 'Manrope', sans-serif;
  font-size: 13px;
  font-weight: 700;
}
.scale-target-done { background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.5); }
.scale-target-done span { color: ${T.success}; }

@media (max-width: 620px) {
  .level-tick, .token { min-width: 40px; min-height: 42px; font-size: 16px; padding: 5px 8px; }
  .formula-slot { min-width: 28px; min-height: 34px; font-size: 17px; }
  .scale-target { padding: 7px 12px; }
  .scale-target span { font-size: 22px; }
}


/* 18-dars: kasr yozuvini tuzish. Yuqorida yig'ilayotgan kasr, pastda ikkita
   qadam — avval maxraj, keyin surat. Faol qadam yorug', ikkinchisi so'nadi. */
.fraction-entry {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: clamp(10px, 2vw, 22px);
}
.fraction-slot-pair {
  display: grid;
  justify-items: center;
  /* Kasr chizig'i raqam qutilariga tegib turmasligi kerak. */
  gap: 6px;
  padding: 8px 12px;
  border-radius: 14px;
  background: ${T.cyanSoft};
  transition: background .2s;
}
.fraction-slot-pair.is-done { background: ${T.successSoft}; }
.fraction-slot-pair i {
  display: block;
  width: 46px;
  height: 3px;
  border-radius: 2px;
  background: ${T.ink};
}
.fraction-slot {
  display: grid;
  place-items: center;
  min-width: 46px;
  min-height: 38px;
  border-radius: 9px;
  background: rgba(255,255,255,.65);
  box-shadow: inset 0 0 0 1.5px rgba(23,59,82,.14);
  color: ${T.ink3};
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px;
  font-weight: 800;
  transition: box-shadow .18s, color .18s, background .18s;
}
.fraction-slot.is-active { box-shadow: inset 0 0 0 2.4px ${T.accent}; background: #FFFFFF; }
.fraction-slot.is-filled { background: #FFFFFF; color: ${T.cyan}; box-shadow: inset 0 0 0 2px rgba(22,143,163,.45); }
.fraction-slot-pair.is-done .fraction-slot.is-filled { color: ${T.success}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.45); }
.fraction-steps { display: grid; gap: 6px; min-width: 0; }
.fraction-step { opacity: .42; transition: opacity .22s; }
.fraction-step.is-active { opacity: 1; }
.fraction-step b {
  display: block;
  margin-bottom: 3px;
  color: ${T.ink2};
  font-size: clamp(10px, 1.3vw, 12px);
  font-weight: 800;
  letter-spacing: .05em;
  text-transform: uppercase;
}
.tile-row { display: flex; flex-wrap: wrap; gap: 6px; }
.tile {
  min-width: 44px;
  min-height: 42px;
  padding: 4px 10px;
  border: 0;
  border-radius: 11px;
  background: #FFFFFF;
  box-shadow: inset 0 0 0 1.5px rgba(23,59,82,.14);
  color: ${T.ink};
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  transition: background .18s, box-shadow .18s, opacity .18s;
}
.tile:hover:not(:disabled) { box-shadow: inset 0 0 0 2px rgba(22,143,163,.45); }
.tile:disabled { cursor: default; }
.tile-done { background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.5); color: ${T.success}; }

/* 19-dars: kasrlarni kichikdan kattaga tizish. */
.order-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 14px;
  background: ${T.cyanSoft};
}
.order-slot {
  display: grid;
  place-items: center;
  width: 62px;
  height: 62px;
  border-radius: 12px;
  background: rgba(255,255,255,.6);
  box-shadow: inset 0 0 0 1.5px rgba(23,59,82,.14);
}
.order-slot.is-filled { background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(34,122,83,.45); }
.order-mini { width: 100%; height: 100%; }
.order-pool { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.order-card {
  width: 74px;
  height: 74px;
  padding: 4px;
  border: 0;
  border-radius: 14px;
  background: #FFFFFF;
  box-shadow: inset 0 0 0 1.6px rgba(23,59,82,.14);
  cursor: pointer;
  transition: box-shadow .18s, opacity .18s;
}
.order-card:hover:not(:disabled) { box-shadow: inset 0 0 0 2.4px rgba(22,143,163,.45); }
.order-card:disabled { cursor: default; }
.order-card.is-used { opacity: .34; box-shadow: none; background: ${T.successSoft}; }

/* 20-dars: tasmada bo'yalgan kataklar soni va tasdiqlash tugmasi. */
.cell-count {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.cell-count span { color: ${T.ink2}; font-size: clamp(11px, 1.4vw, 13px); font-weight: 700; }
.cell-count b {
  display: grid;
  place-items: center;
  min-width: 46px;
  min-height: 42px;
  border-radius: 12px;
  background: #FFFFFF;
  box-shadow: inset 0 0 0 2px rgba(149,201,61,.6);
  color: #4C6B18;
  font-family: 'JetBrains Mono', monospace;
  font-size: 21px;
  font-weight: 800;
}
.cell-count b.is-done { box-shadow: inset 0 0 0 2px rgba(34,122,83,.55); color: ${T.success}; }
.cell-confirm {
  min-height: 42px;
  padding: 0 16px;
  border: 0;
  border-radius: 12px;
  background: ${T.navy};
  color: #F2F7F8;
  font-size: clamp(12px, 1.5vw, 14px);
  font-weight: 750;
  cursor: pointer;
  transition: background .18s, opacity .18s;
}
.cell-confirm:hover:not(:disabled) { background: ${T.accent}; }
.cell-confirm:disabled { opacity: .35; cursor: default; }

@media (max-width: 620px) {
  .fraction-entry { grid-template-columns: minmax(0, 1fr); justify-items: center; gap: 8px; }
  .tile { min-width: 40px; min-height: 40px; font-size: 17px; }
  .order-card { width: 62px; height: 62px; }
  .order-slot { width: 54px; height: 54px; }
}

@media (prefers-reduced-motion: reduce) {
  .lesson-root *, .lesson-root *::before, .lesson-root *::after {
    animation-duration: .001ms !important;
    transition-duration: .001ms !important;
  }
}
`
// Yakuniy ekran uslublari etalondan keladi (summaryStyles.js).
+ SUMMARY_STYLES

// Xato javob ko'rsatkichi va to'g'ri javobdan keyingi xiralashish — umumiy
// modulda (wrongAnswerFlash.js), 1-10 darslar bilan bir xil.
+ WRONG_FLASH_CSS

// Past ekranlar uchun ixchamlashtirish. SUMMARY_STYLES dan KEYIN turadi,
// shuning uchun bir xil solishtirmali og'irlikda ustun keladi.
//
// Sabab: yakuniy ekranda beshta blok bor (sarlavha, savol, qoida, mukofot,
// ko'prik). 620 px balandlikdagi noutbukda ular sig'may, skroll paydo bo'lardi
// — bu esa "skroll yo'q" kontraktini buzadi. Element o'chirilmaydi, faqat
// ichki bo'shliqlar va yordamchi matn qisqaradi.
+ `
@media (max-height: 720px) {
  .stage-body { gap: clamp(5px, 1vh, 10px); }
  .model-area { max-height: 46vh; }
  .final-mission-heading p { display: none; }
  .final-mission-heading h1 { font-size: clamp(16px, 2vw, 20px); }
  .summary-card { padding: 8px 11px; }
  .summary-stack { gap: 7px; }
  .reward-stage, .reward-stage-compact { padding: 8px 11px; }
  .next-mission { padding: 7px 10px; }
  .reflection-option { min-height: 38px; padding: 6px 10px; }
  .bit-answer-comment { padding: 7px 9px; }
}
/* Past, lekin keng ekran (noutbuk): yakuniy ekran bir ustunga tizilgani uchun
   sig'may qolardi. Savol kartasi va yon ustunni yonma-yon qo'yamiz — balandlik
   ikki barobar kamayadi, hech narsa yashirilmaydi. */
@media (max-height: 720px) and (min-width: 860px) {
  .summary-final-layout {
    width: min(1000px, 100%);
    grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
    gap: 10px;
    align-items: start;
  }
}
@media (max-height: 620px) {
  .model-area { max-height: 40vh; }
  .option { min-height: 44px; padding: 8px 12px; }
}
`;
