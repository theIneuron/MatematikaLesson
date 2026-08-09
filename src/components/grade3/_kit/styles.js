// _kit/styles.js — базовый CSS уроков 3 класса (общий для всех уроков байт-в-байт).
// Урок дописывает свой хвост: `const STYLES = BASE_STYLES + \`…\`;`
// Собран скриптом scripts/grade3-kit-extract.mjs.
export const BASE_STYLES = `
/* Metodist 2026-08-05: natija boksi oxirgi savol ostida YUMSHOQ chiqadi (fade-up dan sekinroq). */
.reveal-soft { animation: revealSoft .62s cubic-bezier(.22,.61,.36,1) both; }
@keyframes revealSoft { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .reveal-soft { animation: none; } }
html, body { margin: 0; padding: 0; }
.lesson-root, .lesson-root * { box-sizing: border-box; }
/* position: fixed + inset: 0 — dars oqimdan chiqib, doim aynan KO'RINADIGAN
   viewport'ga mixlanadi. Host (LessonPage/LMS) 100vh bilan balandroq bo'lsa ham
   body-skroll darsga ta'sir qilmaydi, "Davom" tugmasi joyidan siljimaydi.
   URL-panel ochilib-yopilganda balandlikni brauzer o'zi kuzatadi (JS o'lchovsiz). */
.lesson-root {
  font-family: 'Manrope', system-ui, sans-serif;
  color: #0E0E10;
  background: #F6F4EF;
  position: fixed;
  inset: 0;
  overflow: hidden;
  overscroll-behavior: none;
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01","cv11";
  zoom: var(--g1z, 1);
}
/* Mobil yagona masshtab (useMobileZoom): layout doim 390px, zoom real ekranga
   moslaydi — barcha telefonlarda aynan bir xil ko'rinish. Desktop tegilmaydi. */
@media (max-width: 639.98px) {
  .lesson-root { width: 390px; }
}
/* Reset margins для типографики внутри урока */
.lesson-root h1,
.lesson-root h2,
.lesson-root h3,
.lesson-root h4,
.lesson-root h5,
.lesson-root h6,
.lesson-root p,
.lesson-root ul,
.lesson-root ol { margin: 0; padding: 0; }
.title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; font-variation-settings: "opsz" 60; }
.display { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.0; letter-spacing: -0.01em; font-variation-settings: "opsz" 60; }
.italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; font-variation-settings: "opsz" 60; }
.mono { font-family: 'JetBrains Mono', monospace; }
.mop { font-family: 'Manrope', sans-serif; font-weight: 600; color: #0E0E10; display: inline-block; padding: 0 0.06em; }
.frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; line-height: 1; margin: 0 0.08em; font-family: 'Fraunces', serif; font-variation-settings: "opsz" 144; font-weight: 400; }
.frac .n, .frac .d { padding: 0 0.12em; }
.frac .bar { height: 0.08em; background: currentColor; width: 100%; margin: 0.08em 0; border-radius: 2px; }
@keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.fade-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
.delay-1 { animation-delay: 0.12s; }
.delay-2 { animation-delay: 0.24s; }
.delay-3 { animation-delay: 0.36s; }
.delay-4 { animation-delay: 0.48s; }
.feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
.feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px, 2vw, 20px); }
/* === КНОПКИ v15 (тени вместо рамок) === */
.btn {
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: #0E0E10;
  color: #F6F4EF;
  letter-spacing: 0.01em;
  border-radius: 12px;
  border: none;
  box-shadow: 0 6px 18px -4px rgba(58, 53, 48, 0.32);
}
.btn:hover:not(:disabled) {
  background: #FF4F28;
  box-shadow: 0 10px 24px -4px rgba(255, 79, 40, 0.45);
}
.btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
.btn-white-accent {
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: #FFFFFF;
  color: #FF4F28;
  letter-spacing: 0.01em;
  border-radius: 12px;
  border: none;
  box-shadow: 0 8px 22px -4px rgba(255, 79, 40, 0.35), 0 0 0 1px rgba(255, 79, 40, 0.12);
}
.btn-white-accent:hover:not(:disabled) {
  background: #FF4F28;
  color: #FFFFFF;
  box-shadow: 0 12px 28px -6px rgba(255, 79, 40, 0.55);
}
.btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(58, 53, 48, 0.14); }
/* btn-ready — "Davom" bosish kerak bo'lgan paytdagi holat: to'q rang + puls (g1) */
.btn-white-accent.btn-ready {
  background: #FF4F28;
  color: #FFFFFF;
  box-shadow: 0 10px 26px -5px rgba(255, 79, 40, 0.5), 0 0 0 1px rgba(255, 79, 40, 0.25);
  animation: btnReadyPulse 1.5s ease-in-out infinite;
}
.btn-white-accent.btn-ready:hover:not(:disabled) { background: #E8431F; color: #FFFFFF; }
@keyframes btnReadyPulse {
  0%, 100% { transform: scale(1);     box-shadow: 0 10px 26px -5px rgba(255, 79, 40, 0.45), 0 0 0 0 rgba(255, 79, 40, 0.5); }
  50%      { transform: scale(1.045); box-shadow: 0 14px 30px -6px rgba(255, 79, 40, 0.6),  0 0 0 9px rgba(255, 79, 40, 0); }
}
@media (prefers-reduced-motion: reduce) { .btn-white-accent.btn-ready { animation: none; } }
.btn-ghost {
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  color: #0E0E10;
  letter-spacing: 0.01em;
  border-radius: 12px;
  border: none;
  box-shadow: none;
}
.btn-ghost:hover:not(:disabled) {
  background: #FFFFFF;
  box-shadow: 0 6px 18px -6px rgba(58, 53, 48, 0.18);
}
.btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
/* === ОПЦИИ v15 (без рамок, на тенях) === */
.option {
  background: #FFFFFF;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  text-align: left;
  border-radius: 12px;
  width: 100%;
  border: none;
  color: #0E0E10;
  box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14);
}
.option:hover:not(:disabled) {
  background: #FDFBF7;
  box-shadow: 0 10px 22px -6px rgba(58, 53, 48, 0.22);
}
.option:disabled { cursor: default; }
.option-correct {
  background: #E3F0E8 !important;
  color: #1F7A4D !important;
  box-shadow: 0 8px 22px -6px rgba(31, 122, 77, 0.32) !important;
}
.option-wrong {
  background: #FFFFFF !important;
  color: #A7A6A2 !important;
  opacity: 0.32 !important;
  box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.06) !important;
}
.option-picked-wrong {
  background: #FBF3D6 !important;
  color: #C99A2E !important;
  box-shadow: 0 8px 22px -6px rgba(216, 169, 58, 0.32) !important;
}
/* === ТИПОГРАФИКА v15 (× 0.85 upper bounds) === */
.h-title { font-size: clamp(22px, 4vw, 30px); }
.h-sub { font-size: clamp(20px, 3.2vw, 23px); }
.body { font-size: clamp(15px, 1.9vw, 15px); line-height: 1.42; }
.eyebrow { font-size: clamp(11px, 1.3vw, 11px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
.small { font-size: clamp(13px, 1.5vw, 13px); }
.frac-display { font-size: clamp(45px, 9vw, 75px); }
.frac-mid { font-size: clamp(24px, 5vw, 24px); }
.frac-sm { font-size: clamp(16px, 2.5vw, 20px); }
/* === STAGE v15 (sticky stage-header) === */
.stage { max-width: 936px; margin: 0 auto; height: 100%; display: flex; flex-direction: column; position: relative; z-index: 1; }
.stage-header {
  flex-shrink: 0;
  background: #F6F4EF;
  padding-top: clamp(11px, 2vw, 11px);
  padding-bottom: clamp(8px, 1.5vw, 12px);
}
.stage-content {
  flex: 1;
  padding-top: clamp(8px, 1.5vw, 11px);
  padding-bottom: clamp(11px, 2.4vw, 15px);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}
.stage-nav {
  flex-shrink: 0;
  background: #F6F4EF;
  border-top: 1px solid rgba(167, 166, 162, 0.25);
  padding-top: clamp(11px, 2vw, 11px);
  padding-bottom: clamp(11px, 2vw, 11px);
  display: flex;
  gap: 12px;
}
.chrome { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0; }
.chrome-left { display: flex; align-items: center; gap: 10px; color: #5A5A60; }
/* yulduz-kopilka (yuqorida): to'g'ri javoblar to'planadi */
.g1-stars { display: flex; gap: clamp(2px,0.8vw,5px); align-items: center; }
.g1-star-slot { font-size: clamp(13px,1.9vw,17px); line-height: 1; color: rgba(167,166,162,0.4); }
.g1-star-slot.on { color: #FFC23C; animation: g1starpop 0.45s cubic-bezier(0.34,1.6,0.64,1); }
@keyframes g1starpop { 0% { transform: scale(0.3); } 60% { transform: scale(1.35); } 100% { transform: scale(1); } }
@media (prefers-reduced-motion: reduce) { .g1-star-slot.on { animation: none; } }
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #FF4F28;
  box-shadow: 0 0 8px rgba(255, 79, 40, 0.55);
}
/* === PROGRESS v15 (с orange glow) === */
.progress-track {
  height: 6px;
  background: rgba(167, 166, 162, 0.25);
  width: 100%;
  margin-bottom: 12px;
  border-radius: 99px;
  overflow: visible;
}
.progress-bar {
  height: 100%;
  background: #FF4F28;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 99px;
  box-shadow: 0 0 10px rgba(255, 79, 40, 0.55), 0 0 3px rgba(255, 79, 40, 0.40);
}
/* === SLIDER v15 === */
.track-wrap {
  position: relative;
  height: 26px;
  margin: 18px 0;
  display: flex;
  align-items: center;
}
.track-bg {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  background: rgba(167, 166, 162, 0.30);
  border-radius: 99px;
  pointer-events: none;
}
.track-fill {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  background: #FF4F28;
  border-radius: 99px;
  pointer-events: none;
  box-shadow: 0 0 8px rgba(255, 79, 40, 0.50), 0 0 2px rgba(255, 79, 40, 0.40);
  transition: width 0.15s ease-out;
}
.slider-input {
  -webkit-appearance: none;
  appearance: none;
  position: relative;
  width: 100%;
  height: 24px;
  background: transparent;
  outline: none;
  margin: 0;
  cursor: grab;
  z-index: 2;
}
.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  background: #FF4F28;
  border-radius: 50%;
  cursor: grab;
  transition: transform 0.1s;
  border: none;
  box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55);
}
.slider-input::-moz-range-thumb {
  width: 24px;
  height: 24px;
  background: #FF4F28;
  border-radius: 50%;
  cursor: grab;
  border: none;
  box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55);
}
.slider-input::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.12); }
.slider-input:disabled { cursor: not-allowed; }
.slider-input:disabled::-webkit-slider-thumb { opacity: 0.5; cursor: not-allowed; }
/* === INPUT v15 === */
.answer-input {
  font-family: 'Fraunces', serif;
  font-size: clamp(22px, 4vw, 27px);
  font-weight: 400;
  text-align: center;
  border-radius: 12px;
  background: #FFFFFF;
  padding: 8px 12px;
  outline: none;
  border: none;
  color: #0E0E10;
  transition: all 0.2s;
  box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14);
}
.answer-input:focus {
  box-shadow: 0 10px 22px -6px rgba(255, 79, 40, 0.30), 0 0 0 1px rgba(255, 79, 40, 0.20);
}
.answer-input.correct {
  background: #E3F0E8;
  color: #1F7A4D;
  box-shadow: 0 8px 20px -6px rgba(31, 122, 77, 0.30);
}
.answer-input.wrong {
  background: #FFE8E1;
  color: #FF4F28;
  box-shadow: 0 8px 20px -6px rgba(255, 79, 40, 0.36);
}
/* === FRAMES v15 === */
.frame {
  background: #FFFFFF;
  border-radius: 16px;
  padding: clamp(20px, 4.2vw, 24px);
  border: none;
  box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14);
  overflow: hidden;
}
.frame-soft {
  background: #FFE8E1;
  border-left: 4px solid #FF4F28;
  border-radius: 12px;
  padding: clamp(14px, 2.5vw, 14px);
  box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.22);
}
.frame-success {
  background: #E3F0E8;
  border-left: 4px solid #1F7A4D;
  border-radius: 12px;
  padding: clamp(14px, 2.5vw, 14px);
  box-shadow: 0 6px 16px -6px rgba(31, 122, 77, 0.22);
}
/* MATH: бледно-жёлтый callout для справочного (подсказки, выводы). */
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(14px, 2.5vw, 14px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }
/* MATH: ФАКТ-БЛОК — синяя карта, КРУПНАЯ анимация + мало текста. */
.fact-card { display: flex; gap: clamp(12px, 2.5vw, 18px); align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: clamp(90px, 18vw, 130px); height: clamp(70px, 14vw, 96px); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(12px, 1.5vw, 13px); line-height: 1.4; color: #0E0E10; }
/* MATH: ambient — мягкие плавающие круги на разрежённых экранах (декор). */
.amb { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.amb-o { position: absolute; border-radius: 50%; opacity: 0.7; animation: ambFloat 15s ease-in-out infinite; background: radial-gradient(circle at 30% 30%, rgba(255, 79, 40, 0.10), rgba(255, 79, 40, 0.02)); }
.amb-o1 { width: 90px; height: 90px; left: 5%; top: 10%; animation-delay: 0s; }
.amb-o2 { width: 130px; height: 130px; right: 3%; bottom: 6%; animation-delay: -5s; background: radial-gradient(circle at 30% 30%, rgba(1, 154, 203, 0.10), rgba(1, 154, 203, 0.02)); }
.amb-o3 { width: 58px; height: 58px; left: 42%; top: 62%; animation-delay: -9s; }
@keyframes ambFloat { 0%, 100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-14px) translateX(8px); } 66% { transform: translateY(8px) translateX(-10px); } }
/* Accessibility: prefers-reduced-motion — гасим декоративные циклы. */
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
/* === GRADE1 num_1_01 — sanash vizuallari (animatsion to'plam) === */
.g1-listen-hint { margin: 0; color: #019ACB; font-weight: 600; letter-spacing: 0.04em; opacity: 0.9; animation: g1twinkle 1.8s ease-in-out infinite; }
.g1-pips { display: flex; flex-wrap: nowrap; gap: clamp(4px, 1.2vw, 9px); justify-content: center; align-items: center; max-width: 100%; }
.g1-pips-wrap { flex-wrap: wrap; }
.g1-obj { width: clamp(36px, 8.5vw, 58px); aspect-ratio: 1 / 1; height: auto; min-width: 0; display: inline-flex; flex-shrink: 1; filter: drop-shadow(0 4px 7px rgba(58,53,48,0.18)); }
.g1-bob { animation: g1bob 3s ease-in-out infinite; }
.g1-drop { animation: g1drop 0.5s ease-out both; }
.g1-twinkle { animation: g1twinkle 2s ease-in-out infinite; }
@keyframes g1bob { 0%, 100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-7px) rotate(3deg); } }
/* Ambient — masala olami sahnasiga yengil jon. reduced-motion'da o'chadi. */
.g1-amb-cloud { animation: g1drift 9s ease-in-out infinite alternate; }
.g1-amb-cloud2 { animation: g1driftB 12s ease-in-out infinite alternate; }
.g1-amb-sun { transform-box: fill-box; transform-origin: center; animation: g1sunPulse 4.5s ease-in-out infinite; }
.g1-amb-rays { transform-box: fill-box; transform-origin: center; animation: g1sunRays 44s linear infinite; }
.g1-amb-sway { transform-box: fill-box; transform-origin: bottom center; animation: g1sway 4.8s ease-in-out infinite; }
@keyframes g1drift { 0% { transform: translateX(0); } 100% { transform: translateX(24px); } }
@keyframes g1driftB { 0% { transform: translateX(0); } 100% { transform: translateX(-20px); } }
@keyframes g1sunPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.93; } }
@keyframes g1sunRays { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes g1sway { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
@media (prefers-reduced-motion: reduce) { .g1-amb-cloud, .g1-amb-cloud2, .g1-amb-sun, .g1-amb-rays, .g1-amb-sway { animation: none; } }
/* To'g'ri javob nishonlashi — uchqun + yengil sakrash. reduced-motion'da o'chadi. */
.g1-cele-wrap { position: relative; display: inline-flex; animation: g1celePop 0.7s cubic-bezier(0.3, 1.3, 0.5, 1) both; }
@keyframes g1celePop { 0% { transform: scale(1); } 30% { transform: scale(1.14); } 60% { transform: scale(0.97); } 100% { transform: scale(1); } }
.g1-csp { position: absolute; top: 40%; left: 50%; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #FFF4CC, #FFB23C); box-shadow: 0 0 5px rgba(255,190,70,0.85); opacity: 0; pointer-events: none; }
.g1-cele-wrap .g1-csp { animation: g1sparkPop 0.8s ease-out both; }
@keyframes g1sparkPop { 0% { opacity: 0; transform: translate(-50%, -50%) scale(0.2); } 25% { opacity: 1; } 100% { opacity: 0; transform: translate(calc(-50% + var(--dx, 0px)), calc(-50% + var(--dy, -24px))) scale(1); } }
@media (prefers-reduced-motion: reduce) { .g1-cele-wrap, .g1-cele-wrap .g1-csp { animation: none; } }
@keyframes g1twinkle { 0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); } 50% { opacity: 0.5; transform: scale(0.82) rotate(8deg); } }
@keyframes g1pop { 0% { opacity: 0; transform: scale(0.4); } 60% { transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
@keyframes g1drop { 0% { opacity: 0; transform: translateY(-30px); } 72% { transform: translateY(3px); } 100% { opacity: 1; transform: translateY(0); } }
@keyframes g1pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
@keyframes g1gap { 0%, 100% { transform: scale(1); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.30); } 50% { transform: scale(1.06); box-shadow: 0 10px 22px -6px rgba(255,79,40,0.5); } }
/* CountDemo — jonli sanash */
.g1-demo { display: flex; flex-direction: column; align-items: center; gap: clamp(10px, 2.4vw, 16px); }
.g1-demo-row { display: flex; gap: clamp(12px, 3vw, 20px); justify-content: center; align-items: flex-end; min-height: clamp(60px, 13vw, 86px); }
.g1-demo-cell { position: relative; width: clamp(52px, 11vw, 78px); height: clamp(52px, 11vw, 78px); opacity: 0; }
.g1-demo-cell.on { opacity: 1; animation: g1pop 0.45s ease-out; }
.g1-demo-cell.pulse { animation: g1pop 0.45s ease-out, g1pulse 1.7s ease-in-out 0.5s infinite; }
.g1-demo-cell svg { width: 100%; height: 100%; filter: drop-shadow(0 4px 7px rgba(58,53,48,0.18)); }
.g1-demo-tag { position: absolute; top: -8px; right: -6px; background: #1F7A4D; color: #fff; font-weight: 800; font-size: clamp(11px, 1.6vw, 13px); min-width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; padding: 0 4px; }
.g1-demo-num { font-weight: 800; font-size: clamp(40px, 9vw, 62px); color: #FF4F28; line-height: 1; }
.g1-demo-num.big { font-size: clamp(52px, 13vw, 86px); }
/* TenFrame — bo'sh kataklar */
.g1-tenframe { display: flex; gap: clamp(7px, 1.8vw, 12px); justify-content: center; }
.g1-cell { width: clamp(64px, 14vw, 94px); height: clamp(64px, 14vw, 94px); border-radius: 14px; display: flex; align-items: center; justify-content: center; transition: background 0.25s, box-shadow 0.25s; }
.g1-cell-target { background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(167,166,162,0.45); }
.g1-cell-filled { background: #E3F0E8; box-shadow: inset 0 0 0 2px #1F7A4D; }
.g1-cell-empty { background: #FBF3D6; box-shadow: inset 0 0 0 2px #D8A93A; }
.g1-cell-obj { width: 74%; height: 74%; display: inline-flex; animation: g1drop 0.4s ease-out; }
.g1-cell-obj svg { width: 100%; height: 100%; filter: drop-shadow(0 3px 6px rgba(58,53,48,0.18)); }
/* interaktiv ten-frame (s5): bosiladigan kataklar */
.g1-cell-btn { position: relative; width: clamp(64px, 14vw, 94px); height: clamp(64px, 14vw, 94px); border: none; border-radius: 14px; cursor: pointer; background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(167,166,162,0.45); display: flex; align-items: center; justify-content: center; transition: background 0.2s, box-shadow 0.2s, transform 0.15s; }
.g1-cell-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: inset 0 0 0 2px #019ACB; }
.g1-cell-btn.filled { background: #E3F0E8; box-shadow: inset 0 0 0 2px #1F7A4D; cursor: default; }
.g1-cell-num { position: absolute; top: 3px; right: 6px; font-weight: 800; font-size: clamp(12px, 1.7vw, 15px); color: #1F7A4D; }
/* CountTrack / MissingTrack — son qatori */
.g1-track-label { font-weight: 800; font-size: clamp(14px, 2vw, 17px); color: #FF4F28; letter-spacing: 0.02em; min-height: 1.3em; transition: color 0.25s; }
.g1-track-label.back { color: #019ACB; }
.g1-track { display: flex; gap: clamp(7px, 1.8vw, 12px); justify-content: center; }
.g1-track-tile { width: clamp(52px, 11.5vw, 72px); height: clamp(56px, 13vw, 80px); background: #FFFFFF; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px -6px rgba(58,53,48,0.16); transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.25s, color 0.25s, box-shadow 0.25s; }
.g1-track-tile span { font-weight: 800; font-size: clamp(28px, 6.5vw, 42px); color: #0E0E10; }
.g1-track-tile.active { background: #FF4F28; transform: translateY(-7px); box-shadow: 0 12px 26px -6px rgba(255,79,40,0.5); }
.g1-track-tile.active span { color: #FFFFFF; }
.g1-track-tile.gap { background: #FBF3D6; box-shadow: inset 0 0 0 2px #D8A93A; animation: g1gap 1.4s ease-in-out infinite; }
.g1-track-tile.gap span { color: #D8A93A; }
.g1-track-tile.g1-track-filled { background: #1F7A4D; box-shadow: 0 12px 26px -6px rgba(31,122,77,0.5); }
.g1-track-tile.g1-track-filled span { color: #FFFFFF; }
/* count javob badge'i (sanagandan keyin son paydo bo'ladi) */
.g1-countfig { display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.8vw, 12px); }
.g1-countfig-ans { font-weight: 800; font-size: clamp(30px, 7vw, 46px); color: #1F7A4D; }
/* BigNumberCue (keyingi/oldingi savol uchun tayanch son) */
.g1-cue { display: flex; align-items: center; justify-content: center; gap: clamp(10px, 3vw, 22px); }
.g1-cue-num { width: clamp(82px, 20vw, 124px); height: clamp(82px, 20vw, 124px); background: #FF4F28; color: #FFFFFF; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: clamp(44px, 10vw, 68px); box-shadow: 0 12px 26px -6px rgba(255,79,40,0.5); }
.g1-cue-arrow { font-size: clamp(44px, 11vw, 70px); font-weight: 800; color: #A7A6A2; }
.g1-cue-num.g1-cue-ans { background: #1F7A4D; box-shadow: 0 12px 26px -6px rgba(31,122,77,0.5); }
.g1-pop-in { animation: g1pop 0.4s cubic-bezier(0.34,1.56,0.64,1); }
/* CountingHand — sanaydigan qo'l */
.g1-hand { position: relative; width: clamp(143px, 32vw, 218px); height: clamp(135px, 30vw, 204px); display: flex; align-items: center; justify-content: center; }
.g1-hand-big { width: clamp(200px, 50vw, 300px); height: clamp(190px, 48vw, 280px); }
.g1-hand svg { width: 100%; height: 100%; filter: drop-shadow(0 6px 12px rgba(58,53,48,0.2)); }
.g1-hand-num { position: absolute; top: -2px; right: 2px; background: #1F7A4D; color: #fff; font-weight: 800; font-size: clamp(15px, 2.4vw, 20px); min-width: 28px; height: 28px; border-radius: 14px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px -4px rgba(31,122,77,0.5); }
/* s5 dasturxon: tepadan ko'rilgan stol (naqshli) + non/choynak + likobchalar */
.g1-dasturxon { position: relative; background: #FBF3DE; border-radius: 18px; border: clamp(6px,1.6vw,9px) solid #019ACB; padding: clamp(12px,2.6vw,18px) clamp(12px,2.6vw,18px) clamp(14px,3vw,20px); display: flex; flex-direction: column; align-items: center; gap: clamp(10px,2.2vw,15px); box-shadow: 0 8px 22px -6px rgba(58,53,48,0.18); }
.g1-dasturxon::before { content: ''; position: absolute; inset: clamp(4px,1vw,6px); border: 2px dashed rgba(1,154,203,0.45); border-radius: 12px; pointer-events: none; }
.g1-dx-decor { display: flex; align-items: flex-end; justify-content: center; gap: clamp(8px,2vw,16px); position: relative; z-index: 1; }
.g1-dx-non { width: clamp(34px,8vw,48px); height: clamp(34px,8vw,48px); filter: drop-shadow(0 3px 5px rgba(58,53,48,0.18)); }
.g1-dx-teapot { width: clamp(44px,10vw,60px); height: clamp(34px,8vw,46px); filter: drop-shadow(0 3px 5px rgba(58,53,48,0.18)); }
/* SYUJET (hikoya) sahnalari — kirish (dasturxon) va ko'prik (mehmon) */
.g1-table-scene { display: flex; justify-content: center; width: 100%; }
.g1-table-svg { width: clamp(280px, 72vw, 430px); height: auto; filter: drop-shadow(0 8px 16px rgba(58,53,48,0.16)); }
/* ovqat: realroq — joyida turadi, faqat sezilmas vertikal "nafas" (aylanishsiz) */
.g1-table-non { animation: g1float 4s ease-in-out infinite; transform-box: fill-box; transform-origin: center bottom; }
.g1-table-apples { animation: g1float 4s ease-in-out 0.7s infinite; transform-box: fill-box; transform-origin: center bottom; }
@keyframes g1float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
.g1-steam { transform-box: fill-box; transform-origin: center bottom; animation: g1steam 2.9s ease-in-out infinite; }
.g1-steam2 { animation-delay: 0.95s; }
.g1-steam3 { animation-delay: 1.7s; }
@keyframes g1steam { 0% { opacity: 0; transform: translateY(6px) scale(0.8); } 35% { opacity: 0.85; } 70% { opacity: 0.5; } 100% { opacity: 0; transform: translateY(-24px) scale(1.18); } }
/* dasturxon ustidan suzib o'tuvchi yorug'lik (chap->o'ng) — "tayyor, chiroyli" */
.g1-table-sweep { animation: g1tsweep 3.6s ease-in-out infinite; }
@keyframes g1tsweep { 0% { transform: translateX(-110px) skewX(-20deg); opacity: 0; } 22% { opacity: 0.9; } 78% { opacity: 0.9; } 100% { transform: translateX(300px) skewX(-20deg); opacity: 0; } }
/* tayyorlangan dasturxon ustidagi uchqunlar */
.g1-table-spark { animation: g1tspark 1.5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes g1tspark { 0%, 100% { opacity: 0.15; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .g1-table-non, .g1-table-apples, .g1-steam, .g1-table-sweep, .g1-table-spark { animation: none; } }
.g1-guest-scene svg { width: clamp(275px, 68vw, 420px); height: auto; }
/* yo'riqnoma chipi (1-slayd): tingla -> Davom */
.g1-onboard { display: flex; align-items: center; justify-content: center; gap: clamp(8px,1.6vw,12px); align-self: center; background: #EAF6FB; border: 1px solid rgba(1,154,203,0.3); border-radius: 99px; padding: clamp(8px,1.5vw,11px) clamp(14px,2.6vw,20px); }
.g1-onboard-ic { flex-shrink: 0; animation: g1twinkle 1.8s ease-in-out infinite; }
.g1-onboard-txt { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.7vw,15px); color: #017BA3; }
.g1-onboard-arrow { color: #A7A6A2; font-weight: 800; font-size: clamp(15px,2vw,18px); }
.g1-onboard-pill { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(12px,1.5vw,13px); color: #FFFFFF; background: #FF4F28; border-radius: 99px; padding: clamp(5px,1vw,7px) clamp(12px,2.2vw,16px); }
/* mehmon: o'ngdan kirib keladi (1x), keyin yengil tebranadi */
.g1-guest { animation: g1guestEnter 0.85s cubic-bezier(0.34,1.5,0.6,1) both, g1guestBob 2.6s ease-in-out 0.9s infinite; }
.g1-guest-hand { animation: g1wave 1.1s ease-in-out infinite; transform-box: fill-box; transform-origin: bottom left; }
.g1-knock { transform-box: fill-box; transform-origin: left center; animation: g1knock 1.5s ease-in-out infinite; }
.g1-doorglow { animation: g1glow 2.2s ease-in-out infinite; }
.g1-giftspark { animation: g1giftspark 1.4s ease-in-out infinite; }
@keyframes g1guestEnter { 0% { opacity: 0; transform: translateX(48px); } 100% { opacity: 1; transform: translateX(0); } }
@keyframes g1guestBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes g1wave { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-14deg); } }
@keyframes g1knock { 0% { opacity: 0; transform: translateX(-4px) scale(0.85); } 45% { opacity: 1; } 100% { opacity: 0; transform: translateX(6px) scale(1.14); } }
@keyframes g1glow { 0%,100% { opacity: 0.22; } 50% { opacity: 0.6; } }
@keyframes g1giftspark { 0%,100% { opacity: 0.1; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .g1-guest, .g1-guest-hand, .g1-knock, .g1-doorglow, .g1-giftspark { animation: none; } }
.g1-tablescene { display: flex; flex-direction: column; align-items: center; width: 100%; }
.g1-plates { display: flex; gap: clamp(6px,1.8vw,12px); justify-content: center; position: relative; z-index: 1; flex-wrap: wrap; }
.g1-plate { position: relative; width: clamp(62px,14vw,90px); height: clamp(62px,14vw,90px); border-radius: 50%; border: clamp(3px,0.8vw,4px) solid #5FBFE0; cursor: pointer; background: radial-gradient(circle at 50% 36%, #FFFFFF 0%, #FBFAF5 54%, #E6DDCB 100%); box-shadow: 0 7px 16px -6px rgba(58,53,48,0.4), inset 0 7px 12px -5px rgba(58,53,48,0.22); display: flex; align-items: center; justify-content: center; transition: transform 0.15s; }
.g1-plate::before { content: ''; position: absolute; inset: clamp(6px,1.5vw,9px); border-radius: 50%; border: 1.5px dashed rgba(1,154,203,0.5); pointer-events: none; }
.g1-plate:hover:not(:disabled) { transform: translateY(-2px); }
.g1-plate.filled { cursor: default; }
.g1-plate-obj { width: 62%; height: 62%; display: inline-flex; }
.g1-plate-obj svg { width: 100%; height: 100%; filter: drop-shadow(0 3px 5px rgba(58,53,48,0.2)); }
.g1-plate-num { position: absolute; bottom: -2px; right: -2px; background: #1F7A4D; color: #fff; font-weight: 800; font-size: clamp(11px,1.6vw,14px); min-width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; padding: 0 4px; }
.g1-tabletop { width: clamp(230px,60vw,380px); height: clamp(20px,4.4vw,30px); background: linear-gradient(#C8893E, #B17B34); border-radius: 7px; box-shadow: 0 8px 16px -6px rgba(58,53,48,0.35); position: relative; z-index: 0; }
/* s4 figura (TOZA): idle animatsiya HTML div'da — kafolatli ishlaydi */
.g1-s4fig { position: relative; display: inline-block; line-height: 0; animation: g1idle 3.2s ease-in-out infinite; transform-origin: center bottom; }
.g1-s4fig-svg { width: clamp(150px,38vw,200px); height: auto; display: block; filter: drop-shadow(0 6px 12px rgba(58,53,48,0.18)); }
.g1-s4fig-happy { animation: g1jump 0.7s ease, g1idle 3.2s ease-in-out 0.7s infinite; }
/* DressStars (s4) eski meros — endi ishlatilmaydi (saqlangan, zararsiz) */
.g1-dress { position: relative; display: inline-flex; }
.g1-dress-svg { width: clamp(150px,38vw,200px); height: auto; display: block; filter: drop-shadow(0 6px 12px rgba(58,53,48,0.18)); }
.g1-arm-up { opacity: 0; transition: opacity 0.35s; }
.g1-arm-dn { opacity: 1; transition: opacity 0.35s; }
.g1-dress-happy .g1-arm-up { opacity: 1; }
.g1-dress-happy .g1-arm-dn { opacity: 0; }
.g1-dress-happy .g1-dress-svg { animation: g1jump 0.7s ease; transform-origin: center bottom; }
@keyframes g1jump { 0%, 100% { transform: translateY(0); } 35% { transform: translateY(-14px); } 70% { transform: translateY(0); } }
.g1-mouth-happy { opacity: 0; }
.g1-dress-happy .g1-mouth-happy { opacity: 1; }
.g1-dress-happy .g1-mouth { opacity: 0; }
.g1-spark { position: absolute; width: 14px; height: 14px; background: radial-gradient(circle, #FFD86B 0%, rgba(255,216,107,0) 70%); border-radius: 50%; pointer-events: none; }
.g1-spark1 { left: 8%; top: 22%; animation: g1spark 0.9s ease-out 0s infinite; }
.g1-spark2 { right: 6%; top: 30%; animation: g1spark 0.9s ease-out 0.3s infinite; }
.g1-spark3 { left: 16%; top: 52%; animation: g1spark 0.9s ease-out 0.6s infinite; }
@keyframes g1spark { 0% { opacity: 0; transform: scale(0.4); } 40% { opacity: 1; transform: scale(1.15); } 100% { opacity: 0; transform: scale(0.5); } }
.g1-conf { position: absolute; top: -8%; width: 8px; height: 12px; border-radius: 2px; pointer-events: none; }
.g1-conf1 { left: 16%; background: #FF4F28; animation: g1conf 1.1s ease-in 0s infinite; }
.g1-conf2 { left: 34%; background: #019ACB; animation: g1conf 1.3s ease-in 0.2s infinite; }
.g1-conf3 { left: 50%; background: #FFC23C; animation: g1conf 1.0s ease-in 0.45s infinite; }
.g1-conf4 { left: 64%; background: #1F7A4D; animation: g1conf 1.25s ease-in 0.1s infinite; }
.g1-conf5 { left: 80%; background: #FF7AA8; animation: g1conf 1.15s ease-in 0.55s infinite; }
.g1-conf6 { left: 26%; background: #9B5DE5; animation: g1conf 1.2s ease-in 0.75s infinite; }
@keyframes g1conf { 0% { opacity: 0; transform: translateY(0) rotate(0deg); } 12% { opacity: 1; } 100% { opacity: 0; transform: translateY(190px) rotate(420deg); } }
/* Reaction — yagona emotsional otklik (maskot + maqtov) */
.g1-react { display: flex; align-items: center; gap: clamp(8px,1.8vw,12px); }
/* === PNG personaj overlay — butun urok bo'ylab bitta doimiy element (personaj.md) ===
   Doimiy joylashuv (sakramaydi), pastki chap burchak, nav ustida; pointer-events yo'q
   (taplar o'tib ketadi, tugma/predmetlarni bloklamaydi). */
.g1-hero { width: auto; display: block; filter: drop-shadow(0 6px 12px rgba(58,53,48,0.24)); }
/* SVG personajlar (Ra'no/Anvar/Bit): bazaviy o'lcham + jonlanish */
.g1-char { display: block; height: 100%; width: auto; filter: drop-shadow(0 6px 12px rgba(58,53,48,0.22)); }
.g1-eyes { transform-box: fill-box; transform-origin: center; animation: g1blink 4.4s infinite; }
@keyframes g1blink { 0%, 93%, 100% { transform: scaleY(1); } 96.5% { transform: scaleY(0.12); } }
.g1-bit-ant { transform-box: fill-box; transform-origin: bottom center; animation: g1antbob 2.2s ease-in-out infinite; }
@keyframes g1antbob { 0%,100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
.g1-bit-wave, .g1-anvar-wave { transform-box: fill-box; transform-origin: bottom left; animation: g1wavebig 1s ease-in-out infinite; }
@keyframes g1wavebig { 0%,100% { transform: rotate(2deg); } 50% { transform: rotate(-26deg); } }
@keyframes g1bitfloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
/* idle — Ra'no/Anvar figuralar (cast + s4 ko'ylak) sezilarli nafas/tebranish (#8: kattaroq) */
/* idle — HTML o'rovchida (svg ildizida emas; ishonchli va yaqqol ko'rinadi) */
.g1-cast-fig, .g1-dress { animation: g1idle 3.2s ease-in-out infinite; transform-origin: center bottom; }
@keyframes g1idle { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-10px) rotate(3deg); } }
.g1-stage-hero { position: absolute; left: clamp(2px,1.6vw,28px); bottom: clamp(72px,11vh,104px); z-index: 6; pointer-events: none; display: flex; align-items: flex-end; gap: clamp(2px,1vw,8px); }
.g1-stage-hero .g1-hero { transform-origin: bottom center; }
.g1-stage-hero .g1-hero-rano { height: clamp(104px,22vh,208px); }
.g1-stage-hero .g1-hero-bit { height: clamp(80px,17vh,156px); }
/* Bit Ra'nodan kichikroq */
/* Mobil (tor ekran): personaj kichikroq va burchakka, kontentni kamroq yopadi */
@media (max-width: 640px) {
  .g1-stage-hero { left: 0; bottom: clamp(62px,9vh,84px); gap: 0; }
  .g1-stage-hero .g1-hero-rano { height: clamp(78px,14vh,116px); }
  .g1-stage-hero .g1-hero-bit { height: clamp(62px,11vh,92px); }
}
.g1-sh-pointing .g1-hero-rano { animation: g1heroIn 0.45s ease; }
.g1-sh-happy .g1-hero-rano { animation: g1mhop 0.6s ease; }
.g1-sh-encourage .g1-hero-rano { animation: g1mtilt 0.7s ease; }
.g1-sh-encourage .g1-hero-bit { animation: g1heroIn 0.45s ease 0.1s both; }
.g1-sh-celebrate .g1-hero-rano { animation: g1mhop 0.9s ease; }
/* Bit BOSHLOVCHI (present) — ramka ekranlarida diktor, Ra'no o'lchamida (kirish + suzish) */
.g1-sh-present .g1-hero-bit { height: clamp(104px,22vh,200px); animation: g1heroIn 0.45s ease, g1bitfloat 3.2s ease-in-out 0.45s infinite; }
@media (max-width: 640px) { .g1-sh-present .g1-hero-bit { height: clamp(76px,14vh,112px); } }
/* Story cast (frame ichi): Ra'no + Anvar, bosqichma-bosqich ochiladi (useStoryReveal) */
/* Orqa sahna (xona/eshik) — personajlar oldida, REAL masshtab (personaj katta, jihoz proporsional) */
.g1-scene { position: relative; width: 100%; display: flex; align-items: flex-end; justify-content: center; min-height: clamp(200px,44vw,340px); overflow: hidden; border-radius: 14px; }
.g1-scene-bg { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
.g1-scene > .g1-cast-row { position: relative; z-index: 1; padding-bottom: clamp(8px,2.4vw,18px); }
.g1-scene .g1-cast-fig { height: clamp(132px,32vw,230px); }
/* sahnada personaj kattaroq */
/* slayd 1 dasturxon (chiroyli stol) — personajlar orqasida, polda */
.g1-scene-table { position: absolute; left: 50%; bottom: clamp(2px,1.4vw,12px); transform: translateX(-50%); width: clamp(230px,60vw,420px); z-index: 0; pointer-events: none; }
.g1-scene-table .g1-table-svg { width: 100%; filter: drop-shadow(0 8px 16px rgba(58,53,48,0.14)); }
.g1-scene-intro .g1-cast-row { gap: clamp(80px,30vw,260px); }
/* personajlar dasturxon yon tomonlarida */
.g1-cast-row { display: flex; align-items: flex-end; justify-content: center; gap: clamp(18px,5vw,48px); flex-wrap: wrap; }
.g1-cast { display: flex; flex-direction: column; align-items: center; gap: clamp(6px,1.4vw,10px); opacity: 0; transform: translateY(10px) scale(0.96); transition: opacity 0.5s ease, transform 0.5s ease; }
.g1-cast.in { opacity: 1; transform: translateY(0) scale(1); }
.g1-cast-fig { height: clamp(96px,20vw,150px); display: flex; align-items: flex-end; justify-content: center; }
.g1-cast-sm .g1-cast-fig { height: clamp(72px,15vw,110px); }
.g1-cast-img { height: 100%; width: auto; display: block; filter: drop-shadow(0 6px 12px rgba(58,53,48,0.22)); }
.g1-cast-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.8vw,16px); color: #5A5A60; }
.g1-cast-sub { color: #A7A6A2; font-weight: 600; }
/* Anvar PLACEHOLDER (rasm hali yo'q): punktir ramka -> "rasm tez orada keladi" signali */
.g1-anvar-ph { height: 100%; aspect-ratio: 2 / 3; display: flex; align-items: center; justify-content: center; padding: clamp(6px,1.4vw,10px); border: 2px dashed rgba(1,154,203,0.55); border-radius: 16px; background: rgba(205,231,241,0.18); }
.g1-anvar-coming { opacity: 0.92; }
.g1-anvar-door { animation: g1pulse 1.8s ease-in-out infinite; }
.g1-anvar-happy { animation: g1mhop 0.9s ease; }
/* s10/s11 final bayram: savat + Anvar yonma-yon */
.g1-final-cel { display: flex; align-items: center; justify-content: center; gap: clamp(12px,3vw,28px); flex-wrap: wrap; }
/* s10 fakt: 5 barmoqli qo'l + matn (barmoqlar ko'rsatiladi) */
.g1-handfact { display: flex; align-items: center; gap: clamp(12px,2.6vw,18px); background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px,2.2vw,16px); box-shadow: 0 6px 16px -6px rgba(1,154,203,0.22); margin-top: clamp(10px,2vw,14px); }
.g1-handfact-hand { flex-shrink: 0; }
.g1-handfact-hand .g1-hand { width: clamp(96px,22vw,150px); height: clamp(92px,21vw,142px); }
.g1-handfact-txt { margin: 0; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(14px,2vw,18px); color: #0E5F7F; }
@media (prefers-reduced-motion: reduce) { .g1-cast { transition: none; } .g1-anvar-door, .g1-anvar-happy, .g1-cast-fig, .g1-dress { animation: none; } }
@keyframes g1heroIn { 0% { opacity: 0; transform: translateY(10px) scale(0.94); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes g1mhop { 0%,100% { transform: translateY(0) scale(1); } 30% { transform: translateY(-13px) scale(1.14); } 55% { transform: translateY(0) scale(1); } 70% { transform: translateY(-6px) scale(1.07); } }
@keyframes g1mtilt { 0%,100% { transform: rotate(0); } 25% { transform: rotate(-11deg); } 55% { transform: rotate(8deg); } 80% { transform: rotate(-4deg); } }
.g1-react-txt { font-family: 'Source Serif 4', serif; font-weight: 700; font-size: clamp(16px,2.6vw,22px); }
.g1-react-ok .g1-react-txt { color: #1F7A4D; }
.g1-react-enc .g1-react-txt { color: #D8A93A; }
/* Bit-KARTOCHKA (har javobda): matn chap, animatsion Bit o'ng — 5-sinf fakt-kartochka uslubi */
.g1-bitcard { display: flex; align-items: center; gap: clamp(10px,2.4vw,16px); width: 100%; }
.g1-bitcard-body { flex: 1; min-width: 0; }
.g1-bitcard-txt { font-family: 'Source Serif 4', serif; font-weight: 700; font-size: clamp(16px,2.6vw,22px); }
.g1-bitcard-ok .g1-bitcard-txt { color: #1F7A4D; }
.g1-bitcard-enc .g1-bitcard-txt { color: #D8A93A; }
.g1-bitcard-fig { flex-shrink: 0; height: clamp(48px,11vw,68px); }
.g1-bitcard-ok .g1-bitcard-fig .g1-char { animation: g1mhop 0.7s ease; }
.g1-bitcard-enc .g1-bitcard-fig .g1-char { animation: g1mtilt 0.7s ease; }
@media (prefers-reduced-motion: reduce) {
  .g1-hero, .g1-char, .g1-eyes, .g1-bit-ant, .g1-bit-wave, .g1-anvar-wave { animation: none !important; }
  .g1-sh-present .g1-hero-bit, .g1-bitcard-ok .g1-bitcard-fig .g1-char, .g1-bitcard-enc .g1-bitcard-fig .g1-char { animation: none !important; }
}
@media (prefers-reduced-motion: reduce) { .g1-s4fig, .g1-s4fig-happy, .g1-dress-happy .g1-dress-svg, .g1-spark1, .g1-spark2, .g1-spark3, .g1-conf1, .g1-conf2, .g1-conf3, .g1-conf4, .g1-conf5, .g1-conf6 { animation: none; } }
/* yakuniy reyting (rag'bat): 3 yulduz + maqtov */
.g1-rating { display: flex; flex-direction: column; align-items: center; gap: clamp(4px,1vw,8px); }
.g1-rating-stars { display: flex; gap: clamp(6px,1.6vw,12px); }
.g1-rating-star { width: clamp(50px,11vw,72px); height: clamp(50px,11vw,72px); display: inline-flex; }
.g1-rating-star svg { width: 100%; height: 100%; filter: drop-shadow(0 4px 8px rgba(255,194,60,0.55)); }
.g1-rating-praise { margin: 0; font-family: 'Source Serif 4', serif; font-weight: 700; font-size: clamp(22px,5vw,32px); color: #FF4F28; }
/* === GameDrill (drag+tap o'yin bloki) === */
.g1-tray { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(6px,1.7vw,12px); padding: clamp(7px,1.7vw,11px); min-height: clamp(48px,10vw,68px); background: #FBF9F4; border-radius: 14px; }
.g1-token { background: #FFFFFF; border-radius: 12px; box-shadow: 0 6px 16px -6px rgba(58,53,48,0.2); cursor: grab; touch-action: none; user-select: none; -webkit-user-select: none; display: flex; align-items: center; justify-content: center; padding: clamp(8px,1.8vw,12px); min-width: clamp(58px,13vw,78px); min-height: clamp(58px,13vw,78px); transition: transform 0.15s, box-shadow 0.15s; }
.g1-token:active { cursor: grabbing; transform: scale(1.05); }
.g1-token-sel { box-shadow: 0 0 0 3px #FF4F28, 0 8px 20px -6px rgba(255,79,40,0.4); }
/* noto'g'ri sudralganda: token yumshoq sakrab qaytadi (jazo emas) */
.g1-bounceback { animation: g1bounceback 0.5s ease; }
@keyframes g1bounceback { 0% { transform: translateY(0) scale(1); } 28% { transform: translateY(-9px) scale(1.1); } 55% { transform: translateY(0) scale(0.97); } 78% { transform: translateY(-3px) scale(1.02); } 100% { transform: translateY(0) scale(1); } }
/* savatga qo'yishni ko'rsatuvchi qo'l-demo */
.g1-bhd { position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: center; pointer-events: none; z-index: 7; padding-bottom: clamp(6px,1.6vw,12px); }
.g1-bhd-move { display: flex; flex-direction: column; align-items: center; animation: g1bhd 2.6s ease-in-out infinite; filter: drop-shadow(0 8px 14px rgba(58,53,48,0.28)); }
.g1-bhd-apple { width: clamp(30px,7vw,42px); height: clamp(30px,7vw,42px); display: inline-flex; }
.g1-bhd-apple svg { width: 100%; height: 100%; }
.g1-bhd-petal { width: clamp(26px,6vw,36px); height: clamp(32px,7.5vw,46px); border-radius: 50% 50% 50% 50% / 62% 62% 38% 38%; background: linear-gradient(155deg, #FFB6CE 0%, #FF6FA0 52%, #DA4A82 100%); display: inline-block; }
.g1-bhd-hand { width: clamp(28px,6.5vw,38px); height: auto; margin-top: -4px; }
@keyframes g1bhd { 0% { transform: translateY(12px); opacity: 0; } 12% { opacity: 1; } 46% { transform: translateY(-58px); opacity: 1; } 58% { transform: translateY(-58px) scale(0.94); } 74% { opacity: 1; } 88% { transform: translateY(-64px); opacity: 0; } 100% { transform: translateY(-64px); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .g1-bounceback, .g1-bhd-move { animation: none; } }
.g1-token-obj { width: clamp(40px,9vw,56px); height: clamp(40px,9vw,56px); display: inline-flex; pointer-events: none; }
.g1-token-obj svg { width: 100%; height: 100%; }
.g1-token-num { font-weight: 800; font-size: clamp(32px,7vw,44px); color: #0E0E10; pointer-events: none; }
.g1-piece { width: clamp(30px,7vw,44px); height: clamp(30px,7vw,44px); border-radius: 8px; display: inline-block; pointer-events: none; }
.g1-dropzone { transition: background 0.2s, box-shadow 0.2s; cursor: pointer; }
/* noto'g'ri sudralganda: yumshoq sariq puls (jazo emas, "yana sana") */
.g1-nudge { animation: g1nudge 0.45s ease; }
@keyframes g1nudge { 0%, 100% { outline: 2px solid rgba(216,169,58,0); outline-offset: 2px; } 45% { outline: 3px solid rgba(216,169,58,0.75); outline-offset: 3px; } }
@media (prefers-reduced-motion: reduce) { .g1-nudge { animation: none; } }
.g1-basket { min-width: clamp(150px,42vw,280px); min-height: clamp(80px,16vw,112px); background: #FBF3D6; border-radius: 16px; box-shadow: inset 0 0 0 2px #D8A93A; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: clamp(10px,2vw,14px); }
.g1-basket-objs { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(5px,1.4vw,9px); }
.g1-basket-objs .g1-token-obj { width: clamp(26px,6vw,38px); height: clamp(26px,6vw,38px); }
.g1-basket-count { font-weight: 800; font-size: clamp(20px,3.4vw,26px); color: #1F7A4D; }
.g1-puzzle { display: flex; gap: clamp(5px,1.4vw,8px); }
.g1-slot { width: clamp(34px,8vw,52px); height: clamp(46px,10vw,66px); border-radius: 10px; box-shadow: inset 0 0 0 2px rgba(167,166,162,0.5); display: flex; align-items: center; justify-content: center; }
.g1-slot.filled { box-shadow: none; }
.g1-slot .g1-piece { width: 82%; height: 86%; }
/* match: har variant (2/4/5 olma) o'z qatorida — raqam-uyasi chapda, olmalar bitta qatorda o'ngda */
.g1-mbaskets { display: flex; flex-direction: column; gap: clamp(8px,1.8vw,12px); align-items: stretch; width: 100%; max-width: clamp(280px,90vw,460px); margin: 0 auto; }
.g1-mbasket { background: #FFFFFF; border-radius: 14px; box-shadow: 0 6px 16px -6px rgba(58,53,48,0.16); padding: clamp(8px,1.8vw,12px) clamp(12px,2.6vw,18px); display: flex; flex-direction: row; align-items: center; gap: clamp(12px,3vw,20px); min-width: 0; }
.g1-mbasket-num { flex-shrink: 0; width: clamp(46px,10vw,60px); height: clamp(46px,9vw,58px); border-radius: 12px; box-shadow: inset 0 0 0 2px rgba(167,166,162,0.5); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: clamp(30px,6.5vw,40px); color: #1F7A4D; }
.g1-order { display: flex; gap: clamp(6px,1.6vw,10px); justify-content: center; }
.g1-pos { width: clamp(56px,12vw,74px); height: clamp(60px,13vw,80px); border-radius: 12px; box-shadow: inset 0 0 0 2px rgba(167,166,162,0.5); display: flex; align-items: center; justify-content: center; background: #FFFFFF; }
.g1-pos.filled { box-shadow: 0 6px 16px -6px rgba(31,122,77,0.3); background: #E3F0E8; }
.g1-pos .g1-token-num { color: #1F7A4D; }
.g1-ghost { position: fixed; transform: translate(-50%,-50%); z-index: 999; pointer-events: none; background: #FFFFFF; border-radius: 12px; box-shadow: 0 12px 28px -6px rgba(58,53,48,0.35); padding: clamp(6px,1.4vw,10px); display: flex; align-items: center; justify-content: center; }
/* pazl = gul yig'ish */
.g1-flowerwrap { display: flex; flex-direction: column; align-items: center; gap: clamp(8px,1.8vw,12px); }
.g1-flower { position: relative; width: clamp(210px,50vw,290px); height: clamp(210px,50vw,290px); }
.g1-flower-center { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); width: clamp(40px,10vw,58px); height: clamp(40px,10vw,58px); border-radius: 50%; background: #FFC23C; box-shadow: 0 4px 10px -4px rgba(180,138,30,0.5); }
.g1-petal-slot { position: absolute; transform: translate(-50%,-50%); width: clamp(54px,13vw,76px); height: clamp(54px,13vw,76px); border-radius: 50%; box-shadow: inset 0 0 0 2px rgba(167,166,162,0.5); display: flex; align-items: center; justify-content: center; }
.g1-petal-slot.filled { box-shadow: none; }
.g1-petal { width: clamp(38px,9vw,56px); height: clamp(48px,11vw,68px); border-radius: 50% 50% 50% 50% / 62% 62% 38% 38%; background: linear-gradient(155deg, #FFB6CE 0%, #FF6FA0 52%, #DA4A82 100%); box-shadow: 0 4px 9px -4px rgba(218,74,130,0.55), inset 0 2px 5px rgba(255,255,255,0.4); display: inline-block; pointer-events: none; }
.g1-petal-slot .g1-petal { width: 80%; height: 88%; }
/* gul yig'ilib bo'lgach: bir marta sakrab, keyin sekin aylanadi */
.g1-flower-spin { animation: g1flowerPop 0.55s ease-out, g1spin 5s linear 0.55s infinite; }
@keyframes g1flowerPop { 0% { transform: scale(1) rotate(0deg); } 45% { transform: scale(1.14) rotate(18deg); } 100% { transform: scale(1) rotate(0deg); } }
@keyframes g1spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
/* savat (3 olma + 2 gilos) */
.g1-basketwrap { display: flex; flex-direction: column; align-items: center; gap: clamp(8px,1.8vw,12px); width: 100%; }
.g1-recipe { display: flex; gap: clamp(12px,3vw,22px); }
.g1-recipe-item { display: flex; align-items: center; gap: 6px; background: #FFFFFF; border-radius: 10px; padding: 5px 10px; box-shadow: 0 4px 12px -6px rgba(58,53,48,0.16); }
.g1-recipe-ic { width: clamp(22px,4.5vw,30px); height: clamp(22px,4.5vw,30px); display: inline-flex; }
.g1-recipe-ic svg { width: 100%; height: 100%; }
.g1-recipe-cnt { font-weight: 800; font-size: clamp(14px,2vw,17px); color: #1F7A4D; }
/* SVG savat (BasketArt) + ustidan olmalar (gardishdan ko'rinadi) */
.g1-realbasket { position: relative; width: clamp(230px,60vw,356px); aspect-ratio: 220 / 170; cursor: pointer; }
.g1-rb-svg { position: absolute; inset: 0; width: 100%; height: 100%; filter: drop-shadow(0 9px 18px rgba(58,53,48,0.34)); }
.g1-rb-bowl {
  position: absolute; left: 16%; right: 16%; top: 14%; bottom: 48%; z-index: 1;
  display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: center; gap: clamp(3px,1.2vw,7px);
}
.g1-rb-bowl .g1-token-obj { width: clamp(24px,5.5vw,36px); height: clamp(24px,5.5vw,36px); animation: g1drop 0.5s ease-out; }
/* yakuniy test: savat ko'tarilib, olmalar sekin tushadi */
.g1-celebrate { display: flex; justify-content: center; }
.g1-celebrate-basket { animation: g1rise 0.6s ease-out; }
.g1-celebrate-apple { animation: g1fallin 0.7s ease-in both; }
@keyframes g1rise { from { transform: translateY(70px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes g1fallin { 0% { transform: translateY(-80px); opacity: 0; } 70% { opacity: 1; } 100% { transform: translateY(0); opacity: 1; } }
.g1-count-grid { display: flex; flex-wrap: wrap; gap: clamp(10px, 2.5vw, 18px); justify-content: center; }
.g1-item { position: relative; background: #FFFFFF; border: none; border-radius: 16px; cursor: pointer; padding: clamp(16px, 3.4vw, 24px); box-shadow: 0 6px 16px -6px rgba(58,53,48,0.16); transition: transform 0.18s, background 0.18s, box-shadow 0.18s; display: flex; align-items: center; justify-content: center; }
.g1-item:hover { transform: translateY(-2px); }
.g1-item-on { background: #E3F0E8; box-shadow: 0 8px 20px -6px rgba(31,122,77,0.3); }
.g1-item-num { position: absolute; top: 4px; right: 8px; font-weight: 800; font-size: clamp(14px, 2vw, 18px); color: #1F7A4D; }
.g1-item-icon { width: clamp(40px, 9vw, 60px); height: clamp(40px, 9vw, 60px); display: inline-flex; }
.g1-item-icon svg { width: 100%; height: 100%; filter: drop-shadow(0 4px 7px rgba(58,53,48,0.18)); }
.g1-bigcount { text-align: center; margin-top: 14px; font-weight: 800; font-size: clamp(22px, 3.4vw, 28px); color: #0E0E10; }
.g1-numrow { display: flex; align-items: center; gap: clamp(12px, 3vw, 20px); padding: clamp(5px, 1.3vw, 9px) clamp(8px, 1.6vw, 12px); border-radius: 12px; transition: background 0.3s ease; }
.g1-numrow-on { background: #FFE8E1; }
.g1-digit { font-weight: 800; font-size: clamp(36px, 8vw, 58px); color: #FF4F28; min-width: 1.2em; text-align: center; transition: transform 0.3s cubic-bezier(0.34,1.4,0.64,1); }
.g1-numrow-on .g1-digit { transform: scale(1.18); }
/* tap-pair (s5) */
.g1-groups { display: flex; gap: clamp(8px, 2vw, 16px); justify-content: center; flex-wrap: wrap; }
.g1-group { flex: 1; min-width: clamp(88px, 26vw, 150px); background: #FFFFFF; border: 2px dashed #A7A6A2; border-radius: 16px; padding: clamp(10px, 2vw, 16px); display: flex; flex-direction: column; align-items: center; gap: 10px; transition: border-color 0.18s, background 0.18s; cursor: pointer; }
.g1-group-armed { border-color: #019ACB; background: #EAF6FB; }
.g1-group-ok { border-style: solid; border-color: #1F7A4D; background: #E3F0E8; cursor: default; }
.g1-group-wrong { border-color: #D8A93A; background: #FBF3D6; }
.g1-group-faded { opacity: 0.3; cursor: default; }
.g1-slot { min-height: clamp(38px, 7vw, 50px); display: flex; align-items: center; justify-content: center; }
.g1-slot-num { font-weight: 800; font-size: clamp(34px, 8vw, 52px); color: #1F7A4D; }
.g1-tiles { display: flex; gap: clamp(8px, 2vw, 14px); justify-content: center; flex-wrap: wrap; margin-top: 4px; }
.g1-tile { background: #FFFFFF; border: none; border-radius: 14px; cursor: pointer; padding: clamp(13px, 2.6vw, 21px) clamp(21px, 4vw, 31px); font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(32px, 7vw, 46px); color: #0E0E10; box-shadow: 0 6px 16px -6px rgba(58,53,48,0.18); transition: transform 0.18s, background 0.18s, box-shadow 0.18s, color 0.18s; }
.g1-tile:hover:not(:disabled) { transform: translateY(-2px); }
.g1-tile-sel { background: #FF4F28; color: #FFFFFF; box-shadow: 0 10px 24px -6px rgba(255,79,40,0.5); }
.g1-tile-ok { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 10px 24px -6px rgba(31,122,77,0.4); }
.g1-tile-used { opacity: 0.3; cursor: default; }
.g1-tile:disabled { cursor: default; }
/* ===== Dars02 — RAQAMLI UYLAR (digit / house / street) ===== */
.g1-digit { font-family: 'Manrope', sans-serif; font-weight: 800; line-height: 1; color: #3A3530; display: inline-flex; align-items: center; justify-content: center; }
.g1-digit-ink { color: #3A3530; }
.g1-digit-accent { color: #FF4F28; }
.g1-digit-success { color: #1F7A4D; }
.g1-digit-sm { font-size: clamp(26px, 5.2vw, 38px); }
.g1-digit-mid { font-size: clamp(40px, 8vw, 60px); }
.g1-digit-big { font-size: clamp(60px, 13vw, 104px); }
/* hook — sochilgan uy raqamlari */
.g1-scatter { position: relative; width: 100%; max-width: 360px; height: clamp(150px, 26vw, 200px); }
.g1-scatter-d { position: absolute; animation: g1Float 3.4s ease-in-out infinite; filter: drop-shadow(0 4px 8px rgba(58,53,48,0.18)); }
@keyframes g1Float { 0%,100% { transform: translateY(0) rotate(var(--r,0deg)); } 50% { transform: translateY(-9px) rotate(var(--r,0deg)); } }
/* savol / izoh matni */
.g1-q { font-size: clamp(15px, 2vw, 18px); font-weight: 600; color: #3A3530; margin: 0; }
.g1-hint-txt { font-size: clamp(13px, 1.7vw, 15px); color: #8A8780; }
.g1-arrow { font-size: clamp(28px, 5vw, 44px); color: #8A8780; }
.g1-tip-txt { font-size: clamp(14px, 1.8vw, 16px); color: #3A3530; line-height: 1.45; }
/* qator konteyner + sanagich */
.g1-drow { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(8px, 1.8vw, 14px); }
.g1-dpips { min-height: clamp(92px, 18vw, 128px); display: flex; align-items: center; justify-content: center; }
/* TenFrame — "besh-besh ramka": pastki qator (besh) qizil, tepa qator (ortiqcha) ko'k */
.g1-tenframe { display: inline-flex; flex-direction: column; gap: clamp(5px, 1vw, 8px); padding: clamp(7px, 1.5vw, 11px); background: #FFFFFF; border-radius: 16px; box-shadow: 0 5px 16px -9px rgba(58, 53, 48, 0.4); }
.g1-tf-row { display: flex; gap: clamp(5px, 1vw, 8px); }
.g1-tf-cell { width: clamp(26px, 5.2vw, 38px); height: clamp(26px, 5.2vw, 38px); border-radius: 9px; border: 2px solid #E6E1D6; background: #F6F4EF; display: flex; align-items: center; justify-content: center; }
.g1-tf-base .g1-tf-cell { border-color: #FFD2C6; }
.g1-tf-dot { width: 56%; height: 56%; border-radius: 50%; background: transparent; }
.g1-tf-cell.on { background: #FFE8E1; border-color: #FF4F28; }
.g1-tf-cell.on .g1-tf-dot { background: #FF4F28; }
.g1-tf-row:not(.g1-tf-base) .g1-tf-cell.on { background: #E3F2FB; border-color: #019ACB; }
.g1-tf-row:not(.g1-tf-base) .g1-tf-cell.on .g1-tf-dot { background: #019ACB; }
@keyframes g1tfPop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.18); } 100% { transform: scale(1); opacity: 1; } }
.g1-tf-pop .g1-tf-dot { animation: g1tfPop 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) backwards; }
@media (prefers-reduced-motion: reduce) { .g1-tf-pop .g1-tf-dot { animation: none; } }
/* PROPIS — kataklı daftarda raqam yozish (Dars02'dan) + s3 raqam tanlovi */
.g1-kcell { position: relative; aspect-ratio: 64 / 92; padding: 0; overflow: hidden; border: 2.5px solid #BFE0EC; border-radius: 10px; display: flex; align-items: center; justify-content: center;
  background-color: #FBFEFF;
  background-image: linear-gradient(#D7EEF6 1.2px, transparent 1.2px), linear-gradient(90deg, #D7EEF6 1.2px, transparent 1.2px);
  background-size: clamp(15px, 3.6vw, 24px) clamp(15px, 3.6vw, 24px); }
.g1-kcell.active { border-color: #FF4F28; box-shadow: 0 0 0 2px #FFD3C7; }
.g1-kcell-write { flex: 0 0 auto; width: clamp(70px, 13vw, 94px); }
.g1-kcell .g1-write { width: 100%; height: 100%; }
.g1-write { width: clamp(80px, 17vw, 116px); height: auto; }
.g1-write-ghost { fill: none; stroke: #F2DDD3; stroke-width: 9; stroke-linecap: round; stroke-linejoin: round; }
.g1-write-ink { fill: none; stroke: #FF4F28; stroke-width: 8.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 100; stroke-dashoffset: 100; }
.g1-digit-pick { display: flex; justify-content: center; gap: clamp(8px, 2vw, 14px); }
.g1-pickbtn { width: clamp(40px, 8vw, 52px); height: clamp(40px, 8vw, 52px); border-radius: 12px; border: 2px solid #E6E1D6; background: #FFFFFF; font-family: 'Fraunces', Georgia, serif; font-size: clamp(18px, 3.4vw, 24px); font-weight: 600; color: #5A5A60; cursor: pointer; transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease, transform 0.15s ease; box-shadow: 0 3px 8px -4px rgba(58, 53, 48, 0.3); }
.g1-pickbtn:hover:not(.active) { transform: translateY(-2px); }
.g1-pickbtn.active { border-color: #FF4F28; color: #FF4F28; background: #FFF3EF; }
/* FingerHand — barmoqlar vizualizatori (s2) */
.g1-fhand { width: clamp(72px, 15vw, 104px); height: auto; }
.g1-hand-group, .g1-handbtn { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.g1-handbtn { border: 2.5px dashed #FFB9A8; border-radius: 16px; background: #FFF6F3; padding: clamp(6px, 1.4vw, 10px); cursor: pointer; transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
.g1-handbtn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px -8px rgba(255, 79, 40, 0.5); }
.g1-handbtn:disabled { cursor: default; border-style: solid; border-color: #1F7A4D; background: #E3F0E8; }
.g1-hand-cap { font-size: clamp(17px, 3vw, 22px); font-weight: 700; color: #FF4F28; }
.g1-handbtn:disabled .g1-hand-cap { color: #1F7A4D; }
/* Ten-frame drag o'yin (sd): drop zona + nuqta tokenlar */
.g1-tfdrop { padding: clamp(8px, 2vw, 14px); border-radius: 18px; border: 2.5px dashed #BFD9E6; background: #F7FBFD; transition: border-color 0.2s ease, background 0.2s ease; }
.g1-token-dot { width: clamp(20px, 4.4vw, 28px); height: clamp(20px, 4.4vw, 28px); border-radius: 50%; background: #FF4F28; display: block; box-shadow: inset 0 -2px 3px rgba(0, 0, 0, 0.15); }
/* ten-frame PREDMET rejimi (sd o'yini): kataklar neytral, ichida buyum, tushganda pop */
.g1-tf-cell-obj.on { background: #FFFDF9; border-color: #E0DACE; }
.g1-tf-row:not(.g1-tf-base) .g1-tf-cell-obj.on { background: #FFFDF9; border-color: #E0DACE; }
.g1-tf-base .g1-tf-cell-obj { border-color: #E0DACE; }
.g1-tf-item { width: 82%; height: 82%; display: flex; align-items: center; justify-content: center; animation: g1tfDrop 0.46s cubic-bezier(0.34, 1.4, 0.64, 1) backwards; }
@keyframes g1tfDrop { 0% { transform: translateY(-75%); opacity: 0; } 65% { transform: translateY(7%); } 100% { transform: translateY(0); opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .g1-tf-item { animation: none; } }
/* keyingi to'ldiriladigan katak — pulslab "qayerga qo'yish"ni ko'rsatadi */
.g1-tf-next { border-color: #FF4F28; border-style: dashed; animation: g1tfPulse 1.1s ease-in-out infinite; }
@keyframes g1tfPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255, 79, 40, 0.45); } 60% { box-shadow: 0 0 0 6px rgba(255, 79, 40, 0); } }
.g1-dropzone-wait { border-color: #FF8A6E; background: #FFF4F0; }
.g1-drophint { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: clamp(13px, 1.8vw, 15px); color: #C23B1E; font-weight: 600; }
.g1-drophint-arrow { font-size: clamp(18px, 3vw, 24px); animation: g1hintBounce 1s ease-in-out infinite; }
@keyframes g1hintBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@media (prefers-reduced-motion: reduce) { .g1-tf-next, .g1-drophint-arrow { animation: none; } }
/* s8 — raqam plitasini eshikka sudrash */
.g1-plate-drop { padding: clamp(10px, 2.4vw, 16px); border-radius: 18px; border: 2.5px dashed #BFD9E6; background: #F7FBFD; display: flex; justify-content: center; transition: border-color 0.2s ease, background 0.2s ease; }
.g1-plate-house { display: flex; flex-direction: column; align-items: center; gap: clamp(4px, 1vw, 8px); }
.g1-plate-house .g1-house-svg { width: clamp(88px, 19vw, 124px); }
.g1-token-plate { background: #FCFAF5; border: 2px solid #C9A877; box-shadow: 0 4px 10px -4px rgba(58, 53, 48, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6); min-width: clamp(48px, 10vw, 62px); min-height: clamp(48px, 10vw, 62px); }
/* sGuest (slayd 15) yaqin plan: yangi uy 0 -> 1 (Zuhra ko'chib keladi) */
.g1-newhouse-scene { display: flex; align-items: center; justify-content: center; gap: clamp(16px, 5vw, 48px); flex-wrap: wrap; min-height: clamp(170px, 32vw, 230px); }
.g1-newhouse-house .g1-house-svg { width: clamp(118px, 25vw, 176px); }
.g1-newhouse-side { display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 2vw, 14px); }
.g1-zerorow { display: flex; align-items: center; gap: clamp(6px, 1.6vw, 12px); }
.g1-newhouse-zuhra { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.g1-newhouse-zuhra .g1-char { width: clamp(58px, 12vw, 86px); height: auto; }
.g1-newhouse-empty { font-size: clamp(13px, 1.8vw, 16px); color: #8A8780; }
.g1-newhouse-num { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.g1-newhouse-note { font-size: clamp(12px, 1.7vw, 15px); color: #1F7A4D; font-weight: 600; }
.g1-count-line { display: flex; align-items: center; justify-content: center; gap: 10px; }
.g1-count-label { font-size: clamp(13px, 1.7vw, 15px); color: #8A8780; }
.g1-count-val { font-size: clamp(16px, 2.2vw, 20px); font-weight: 800; color: #FF4F28; }
/* ESHIK (raqam plitasi bilan) */
.g1-door { position: relative; display: inline-flex; flex-direction: column; align-items: center; width: clamp(54px, 11.5vw, 76px); height: clamp(78px, 16.5vw, 106px); background: repeating-linear-gradient(90deg, rgba(122,78,34,0) 0, rgba(122,78,34,0.12) 5px, rgba(255,255,255,0.05) 9px, rgba(122,78,34,0) 13px), linear-gradient(180deg, #C2864F, #9A6738); border: 2px solid #7A4E22; border-radius: 11px 11px 4px 4px; box-shadow: inset 0 2px 0 rgba(255,255,255,0.18), 0 4px 10px -5px rgba(58,53,48,0.35); overflow: hidden; }
.g1-door-panel { position: absolute; left: 16%; right: 16%; top: 34%; bottom: 9%; border: 2px solid rgba(0,0,0,0.16); border-radius: 4px; background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(0,0,0,0.07)); }
.g1-door-plate { position: relative; z-index: 2; margin-top: clamp(5px, 1.4vw, 9px); background: #FCFAF5; border: 1.5px solid #C9A877; border-radius: 6px; padding: 0 clamp(6px, 1.4vw, 10px); box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
.g1-door-knob { position: absolute; right: clamp(7px, 1.6vw, 10px); top: 56%; width: 7px; height: 7px; border-radius: 50%; background: #FFD86B; box-shadow: 0 0 0 1px #B8862E; z-index: 2; }
.g1-doorbtn { background: transparent; border: none; padding: 5px; cursor: pointer; border-radius: 12px; transition: transform 0.15s ease; }
.g1-doorbtn:hover:not(:disabled) { transform: translateY(-3px); }
.g1-doorbtn.active .g1-door { border-color: #FF4F28; box-shadow: 0 0 0 3px #FFD3C7, inset 0 2px 0 rgba(255,255,255,0.18); }
.g1-doorbtn.seen .g1-door { border-color: #1F7A4D; }
.g1-doorbtn.used { opacity: 0.4; }
.g1-doorbtn.placed { opacity: 0.45; }
.g1-doorbtn:disabled { cursor: default; }
/* UY (svg) + hovli */
.g1-house-svg { width: clamp(92px, 19vw, 126px); height: auto; display: block; }
.g1-housefig { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.g1-yard { display: flex; justify-content: center; }
.g1-s2house .g1-house-svg { width: clamp(92px, 19vw, 122px); }
/* Dars02 realizatsiyasi: uy variantlari BIR QATORDAN, gorizontal tasma (uy | predmetlar), chapga */
.g1-opt-house { display: flex; flex-direction: row; align-items: center; justify-content: flex-start; gap: clamp(12px, 3vw, 24px); width: 100%; padding-left: clamp(4px, 2vw, 14px); }
.g1-opt-house .g1-house-svg { width: clamp(56px, 12vw, 78px); flex: none; }
.g1-opt-house .g1-yard { flex: 1 1 auto; justify-content: flex-start; min-width: 0; }
.g1-opt-house .g1-pips { justify-content: flex-start; }
/* s8 / s9 — uy tugmalari */
.g1-houses { display: flex; flex-direction: column; gap: clamp(8px, 1.8vw, 14px); }
.g1-housebtn { background: #FFFFFF; border: 2px solid #E7E1D6; border-radius: 18px; padding: clamp(8px, 1.8vw, 13px); display: flex; flex-direction: column; align-items: center; gap: clamp(4px, 1vw, 8px); cursor: pointer; transition: transform 0.15s ease, border-color 0.2s ease, opacity 0.2s ease; }
/* s8/s9 uy tugmalari ham bir qatordan, gorizontal tasma (uy | predmetlar), chapga */
.g1-houses .g1-housebtn, .g1-match-houses .g1-housebtn { flex-direction: row; justify-content: flex-start; width: 100%; gap: clamp(12px, 3vw, 22px); }
.g1-houses .g1-housebtn .g1-house-svg, .g1-match-houses .g1-housebtn .g1-house-svg { width: clamp(54px, 12vw, 74px); flex: none; }
.g1-houses .g1-housebtn .g1-yard, .g1-match-houses .g1-housebtn .g1-yard { flex: 1 1 auto; justify-content: flex-start; min-width: 0; }
.g1-houses .g1-pips, .g1-match-houses .g1-pips { justify-content: flex-start; }
.g1-housebtn:hover:not(:disabled) { transform: translateY(-2px); }
.g1-housebtn-ok { border-color: #1F7A4D; background: #EFF7F1; }
.g1-housebtn-faded { opacity: 0.4; }
.g1-housebtn:disabled { cursor: default; }
.g1-housebtn .g1-house-svg { width: clamp(64px, 13.5vw, 92px); }
/* s9 — juftlash tartibi */
.g1-match { display: flex; flex-direction: column; gap: clamp(12px, 2.4vw, 18px); }
.g1-match-digits { display: flex; justify-content: center; flex-wrap: wrap; gap: clamp(8px, 2vw, 14px); }
.g1-match-houses { display: flex; flex-direction: column; gap: clamp(8px, 1.8vw, 12px); }
/* s5 — shakl belgisi */
.g1-feature { display: flex; flex-direction: column; align-items: center; gap: 8px; min-height: clamp(90px, 18vw, 130px); justify-content: center; }
.g1-feature-txt { font-size: clamp(14px, 1.9vw, 17px); font-weight: 600; color: #FF4F28; }
/* s2 — joylash katakchalari */
.g1-tapgrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(8px, 1.6vw, 12px); }
.g1-tapcell { position: relative; background: #FFFFFF; border: 2px solid #E7E1D6; border-radius: 14px; width: clamp(50px, 10vw, 64px); height: clamp(50px, 10vw, 64px); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.15s ease, border-color 0.2s ease; }
.g1-tapcell svg { width: 64%; height: 64%; opacity: 0.5; transition: opacity 0.2s ease; }
.g1-tapcell.on { border-color: #1F7A4D; background: #EFF7F1; }
.g1-tapcell.on svg { opacity: 1; }
.g1-tapcell-tag { position: absolute; top: 2px; right: 5px; font-size: 12px; color: #1F7A4D; font-weight: 700; }
.g1-tapcell:disabled { cursor: default; }
/* sd — o'yin: uy oldiga buyum torting */
.g1-collecthouse { position: relative; display: flex; flex-direction: column; align-items: center; gap: clamp(4px, 1vw, 8px); padding: clamp(8px, 1.8vw, 14px); border-radius: 18px; border: 2px dashed #D8CFBF; transition: border-color 0.2s ease, background 0.2s ease; }
.g1-collecthouse.g1-dropzone { background: #FCF7EE; }
.g1-yard-drop { min-height: clamp(40px, 8vw, 54px); align-items: center; }
/* KO'CHA sahnasi — fon + ustiga uylar/personajlar (proporsiya qulflangan) */
.g1-street { position: relative; width: 100%; max-width: 560px; margin: 0 auto; aspect-ratio: 400 / 218; container-type: size; border-radius: 14px; overflow: hidden; }
.g1-street-bg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.g1-street-houses { position: absolute; left: 2%; right: 2%; bottom: 13%; display: flex; justify-content: center; align-items: flex-end; gap: 1cqw; }
.g1-street-house { opacity: 0; transform: translateY(8%); transition: opacity 0.5s ease, transform 0.5s ease; }
.g1-street-house.in { opacity: 1; transform: none; }
.g1-street-house .g1-house-svg { width: 15cqw; }
/* 6 uy (5 raqamli + 1 bo'sh) sig'ishi uchun ozroq tor */
.g1-street-new { margin-left: 2.5cqw; }
/* yangi bo'sh uy — ko'cha oxirida ajralib turadi */
.g1-street-target .g1-house-svg { filter: drop-shadow(0 0 7px rgba(255,79,40,0.8)); }
.g1-street-anvar, .g1-street-rano, .g1-street-zuhra { position: absolute; display: flex; flex-direction: column; align-items: center; opacity: 0; transition: opacity 0.5s ease; z-index: 3; }
.g1-street-anvar.in, .g1-street-rano.in, .g1-street-zuhra.in { opacity: 1; }
/* personajlar OLD PLANDA, kichik (eshik bo'yida) — real proporsiya + chuqurlik */
.g1-street-anvar { left: 6%; bottom: 0; }
.g1-street-rano { left: 22%; bottom: 4%; }
.g1-street-zuhra { right: 4%; bottom: 0; }
.g1-street-anvar .g1-char, .g1-street-rano .g1-char, .g1-street-zuhra .g1-char { width: 6cqw; height: auto; }
.g1-street .g1-cast-name { display: none; }
.g1-street-final .g1-street-anvar { left: auto; right: 27%; bottom: 0; }
.g1-street-final .g1-street-rano { left: auto; right: 15%; bottom: 4%; }
.g1-street-final .g1-street-zuhra { right: 3%; bottom: 6%; }
/* Anvar YURIB keladi (chapdan o'z joyiga) */
@keyframes g1WalkIn {
  0%   { transform: translateX(-260%) translateY(0)    rotate(0deg); }
  18%  { transform: translateX(-205%) translateY(-5%)  rotate(2.5deg); }
  36%  { transform: translateX(-150%) translateY(0)    rotate(-2.5deg); }
  54%  { transform: translateX(-100%) translateY(-5%)  rotate(2.5deg); }
  72%  { transform: translateX(-55%)  translateY(0)    rotate(-2.5deg); }
  88%  { transform: translateX(-16%)  translateY(-3%)  rotate(1.5deg); }
  100% { transform: translateX(0)     translateY(0)    rotate(0deg); }
}
.g1-street-anvar.in { animation: g1WalkIn 2.6s ease-out both; }
/* "5 va yana" — 5 talik guruh + qolgani orasida bo'shliq (6-10 ni o'qish uchun) */
.g1-pips-five { gap: 0; }
.g1-five-grp, .g1-more-grp { display: inline-flex; flex-wrap: nowrap; gap: clamp(4px, 1.2vw, 9px); align-items: center; }
.g1-five-grp { padding-right: clamp(8px, 2.4vw, 18px); border-right: 2px dashed rgba(58,53,48,0.16); margin-right: clamp(8px, 2.4vw, 18px); }
.g1-pips-wrap.g1-pips-five { flex-wrap: wrap; row-gap: clamp(4px, 1.2vw, 9px); }
/* s2 — "5 ta tayyor" kataklari (bosib bo'lmaydi, yengil ko'rsatilgan) */
.g1-tapcell-base { border-color: #D8D0C2; background: #F4F1EA; cursor: default; }
.g1-tapcell-base svg { opacity: 0.78; }
/* final / summary — rasm + matn YONMA-YON (skrolsiz) */
.g1-final-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: clamp(12px, 2.6vw, 22px); width: 100%; }
.g1-final-row .g1-final-street { flex: 1 1 280px; max-width: 420px; }
.g1-final-row .g1-handfact { flex: 1 1 200px; max-width: 320px; display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.8vw, 12px); }
.g1-sum-row { display: flex; flex-wrap: wrap; align-items: center; gap: clamp(12px, 2.6vw, 22px); }
.g1-sum-row .g1-final-street { flex: 1 1 300px; max-width: 440px; }
.g1-sum-col { flex: 1 1 240px; min-width: 230px; display: flex; flex-direction: column; gap: clamp(10px, 2vw, 14px); }
.g1-final-street { width: 100%; }
/* s11 — final fakt: 1-5 raqamlari qatori */
.g1-factdigits { display: flex; justify-content: center; gap: clamp(6px, 1.6vw, 12px); }
.g1-handfact-txt { font-size: clamp(13px, 1.7vw, 15px); color: #3A3530; line-height: 1.4; text-align: center; margin: 0; }
/* summary — ball + bog'lanishlar */
.g1-score { font-size: clamp(18px, 2.6vw, 24px); font-weight: 800; color: #1F7A4D; margin: 6px 0 0; }
.g1-conn { display: flex; flex-direction: column; gap: 8px; }
.g1-conn-title { font-size: clamp(14px, 1.8vw, 16px); font-weight: 800; color: #3A3530; margin: 0 0 2px; }
.g1-conn-row { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; }
.g1-conn-tag { font-size: clamp(11px, 1.4vw, 13px); font-weight: 700; padding: 3px 10px; border-radius: 99px; white-space: nowrap; }
.g1-conn-ref { background: #EAF6FB; color: #017CA3; }
.g1-conn-next { background: #FFF1EC; color: #D63E18; }
.g1-conn-txt { font-size: clamp(13px, 1.7vw, 15px); color: #5A5A60; }
@media (prefers-reduced-motion: reduce) {
  .g1-scatter-d { animation: none; }
  .g1-street-house, .g1-street-anvar, .g1-street-rano, .g1-street-zuhra { transition: none; }
  .g1-street-anvar.in { animation: none; }
}
/* ====== Dars07 — qo'shishning ma'nosi: pufakchali savatlar + hovli sahnasi ====== */
/* --- birlashtirish qatori (pufakchali savatlar) --- */
.g1-cg { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: clamp(8px, 2vw, 18px); }
.g1-cg-joined { flex-direction: column; gap: clamp(8px, 1.8vw, 14px); }
.g1-cg-op { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(26px, 5.5vw, 40px); color: #FF4F28; line-height: 1; }
.g1-cg-sent { display: flex; align-items: center; gap: clamp(5px, 1.4vw, 10px); font-weight: 800; font-size: clamp(22px, 4.6vw, 34px); color: #0E0E10; }
.g1-cg-sent .g1-cg-sign { font-style: normal; color: #FF4F28; }
.g1-cg-sent .g1-cg-tot { color: #1F7A4D; }
/* birlashganda pufakcha suzib kiradi */
.d4-mount { animation: d4slidein 0.55s cubic-bezier(0.34,1.2,0.64,1) both; }
.d4-mount-r { animation: d4slideinr 0.55s cubic-bezier(0.34,1.2,0.64,1) both; }
@keyframes d4slidein { from { opacity: 0; transform: translateX(-30px) scale(0.94); } to { opacity: 1; transform: translateX(0) scale(1); } }
@keyframes d4slideinr { from { opacity: 0; transform: translateX(30px) scale(0.94); } to { opacity: 1; transform: translateX(0) scale(1); } }
/* --- TEPADAN savat (sodda %-o'lcham, container-query YO'Q) --- */
.bt { position: relative; width: clamp(100px, 25vw, 152px); aspect-ratio: 1 / 0.9; }
.bt-rim { position: absolute; inset: 0; width: 100%; height: 100%; filter: drop-shadow(0 6px 13px rgba(58,53,48,0.26)); }
.bt-fruit { position: absolute; left: 18%; right: 18%; top: 15%; bottom: 22%; display: flex; flex-wrap: wrap; align-items: center; align-content: center; justify-content: center; gap: 1.5%; }
.bt-f { aspect-ratio: 1 / 1; display: inline-flex; align-items: center; justify-content: center; }
.bt-f svg { width: 100%; height: 100%; filter: drop-shadow(0 2px 4px rgba(58,53,48,0.18)); }
/* --- o'ylov pufakchasi (ichida tepadan savat) --- */
.fb { display: inline-flex; flex-direction: column; align-items: center; }
.fb-body { background: #FFFFFF; border-radius: 50%; box-shadow: 0 6px 18px -6px rgba(58,53,48,0.3); padding: clamp(7px, 1.8vw, 13px); width: clamp(84px, 22vw, 128px); }
.fb-body .bt { width: 100%; }
.fb-dot { background: #FFFFFF; border-radius: 50%; box-shadow: 0 2px 5px -1px rgba(58,53,48,0.25); }
.fb-dot1 { width: 11px; height: 11px; margin-top: 3px; }
.fb-dot2 { width: 7px; height: 7px; margin-top: 2px; }
/* birlashtirish figurasidagi pufakcha o'lchami (skrolsiz) */
.g1-cg .fb-body { width: clamp(78px, 20vw, 116px); }
.g1-cg-joined .fb-body { width: clamp(92px, 24vw, 134px); }
/* --- s5 sudrab-birlashtirish: drop-zona = tepadan savat (punktir -> javobda yashil) + tray --- */
.g1-cg-drop { position: relative; transition: outline 0.2s, background 0.2s; }
.g1-s5-drop { width: clamp(118px, 30vw, 168px); aspect-ratio: 1 / 0.9; display: flex; align-items: center; justify-content: center; padding: 5px; border-radius: 50%; outline: 2px dashed rgba(255,79,40,0.5); outline-offset: 3px; }
.g1-s5-drop .bt { width: 100%; }
.g1-s5-drop.full { outline: 2px solid #1F7A4D; }
.g1-combine-row { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: clamp(8px, 2vw, 18px); }
.g1-combine-grouplabel { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.g1-combine-name { font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 1.5vw, 13px); color: #5A5A60; font-weight: 700; }
.g1-gameopts { display: flex; align-items: center; justify-content: center; gap: clamp(10px, 2.6vw, 18px); }
.g1-numopt { display: flex; align-items: center; justify-content: center; min-width: clamp(56px, 14vw, 78px); min-height: clamp(56px, 14vw, 78px);
  background: #FFFFFF; border: none; border-radius: 16px; box-shadow: 0 4px 12px -5px rgba(58,53,48,0.3); cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; }
.g1-numopt:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 8px 18px -7px rgba(58,53,48,0.4); }
.g1-numopt-wrong { opacity: 0.4; box-shadow: inset 0 0 0 2px #FFCDBF; cursor: default; }
.g1-numopt-ok { background: #E3F0E8; box-shadow: inset 0 0 0 2px #1F7A4D; cursor: default; }
/* AnsPop — javob raqami savol vizualida ("= N", yashil, pop). Barcha test-figuralar. */
.g1-anspop { display: inline-flex; align-items: center; gap: clamp(6px, 1.4vw, 10px); margin-left: clamp(4px, 1vw, 8px); }
.g1-anspop-eq { font-style: normal; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(26px, 5.5vw, 40px); color: #5A5A60; line-height: 1; }
.g1-anspop-num { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(44px, 9vw, 66px); line-height: 1; color: #1F7A4D; }
/* --- s6 son-yozuv varianti --- */
.g1-sent { display: inline-flex; align-items: center; gap: clamp(4px, 1.2vw, 8px); font-weight: 800; font-size: clamp(20px, 4vw, 30px); color: #0E0E10; }
.g1-sent .g1-sent-op { font-style: normal; font-weight: 800; }
.g1-sent .g1-sent-plus { color: #FF4F28; }
.g1-sent .g1-sent-minus { color: #5A5A60; }
/* --- s8 fakt kartasi (ko'k) --- */
.g1-factcard { display: flex; flex-direction: column; gap: 6px; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 14px; padding: clamp(9px, 1.8vw, 14px); }
.g1-factcard-badge { font-size: clamp(10px, 1.3vw, 12px); letter-spacing: 0.12em; text-transform: uppercase; color: #0A7FA8; font-weight: 700; }
.g1-factcard-row { display: flex; align-items: center; gap: clamp(10px, 2.4vw, 18px); }
.g1-factcard-plus { flex: 0 0 auto; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: #019ACB;
  font-size: clamp(34px, 8vw, 52px); line-height: 1; animation: factPlus 2.4s ease-in-out infinite; }
.g1-factcard-txt { margin: 0; font-size: clamp(13px, 1.8vw, 15px); line-height: 1.38; color: #0E0E10; }
@keyframes factPlus { 0%,100% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(90deg) scale(1.12); } }
/* --- hovli sahnasi (CastScene) — 560px cheklangan (skrolsiz) --- */
.g1-yardscene { position: relative; width: 100%; max-width: 560px; margin: 0 auto; aspect-ratio: 400 / 215; container-type: size; border-radius: 14px; overflow: hidden; }
.g1-yard-bg { position: absolute; inset: 0; width: 100%; height: 100%; }
.g1-yard-cast { position: absolute; inset: 0; }
.g1-yc-fig { position: absolute; bottom: 4cqh; display: flex; flex-direction: column; align-items: center; gap: 2px;
  opacity: 0; transform: translateY(8cqh) scale(0.96); transition: opacity 0.5s ease, transform 0.5s ease; }
.g1-yc-fig.in { opacity: 1; transform: translateY(0) scale(1); }
.g1-yc-fig .g1-cast-svg { height: 42cqh; width: auto; }
.g1-yc-rano { left: 16cqw; }
.g1-yc-anvar { left: 44cqw; }
.g1-yc-zuhra { right: 14cqw; }
.g1-yc-zuhra.walkin { animation: yardWalkIn 1.6s ease-out both; }
/* Dars12 maktab sahnasi — 4 personaj (Jasur kirib keladi), kattaroq + yengil tebranish (jonli) */
.g1-maktabscene .g1-yc-fig .g1-cast-svg { height: 48cqh; animation: g1castbob 3.2s ease-in-out infinite; }
.g1-maktabscene .g1-cast-name { font-size: clamp(10px, 1.5vw, 13px); }
.g1-yc-mrano { left: 2cqw; }
.g1-yc-mrano .g1-cast-svg { animation-delay: 0s; }
.g1-yc-manvar { left: 25cqw; }
.g1-yc-manvar .g1-cast-svg { animation-delay: 0.5s; }
.g1-yc-mzuhra { left: 49cqw; }
.g1-yc-mzuhra .g1-cast-svg { animation-delay: 1s; }
.g1-yc-jasur { right: 2cqw; }
.g1-yc-jasur .g1-cast-svg { animation-delay: 0.75s; }
.g1-yc-jasur.walkin { animation: yardWalkIn 1.4s cubic-bezier(0.34, 1.2, 0.64, 1) both; }
@keyframes g1castbob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3%); } }
@media (prefers-reduced-motion: reduce) { .g1-maktabscene .g1-yc-fig .g1-cast-svg { animation: none; } }
/* yerda turgan savatlar (Dars04 uslubi) — personaj yonida, oyog'i oldida, dekorativ (bo'sh) */
.g1-yard-basket { position: absolute; bottom: 1cqh; width: 15cqw; z-index: 4; opacity: 0; transition: opacity 0.5s ease; }
.g1-yard-basket.in { opacity: 1; }
.g1-yard-basket .g1-rb-svg { width: 100%; height: auto; filter: drop-shadow(0 4px 8px rgba(58,53,48,0.28)); }
.g1-yard-basket-rano { left: 1cqw; }
.g1-yard-basket-zuhra { right: 1cqw; }
/* o'ylov pufakchasi — personaj boshidan YUQORIDA, yuzni to'smaydi (Ra'no 3, Zuhra 2) */
.g1-yard-bubble { position: absolute; bottom: 54cqh; width: 16cqw; z-index: 5; opacity: 0; transition: opacity 0.5s ease; }
.g1-yard-bubble.in { opacity: 1; }
.g1-yard-bubble .fb, .g1-yard-bubble .fb-body { width: 100%; }
.g1-yard-bubble-rano { left: 13cqw; }
.g1-yard-bubble-zuhra { right: 11cqw; }
@keyframes yardWalkIn { from { opacity: 0; transform: translateX(18cqw) translateY(0) scale(1); } to { opacity: 1; transform: translateX(0) translateY(0) scale(1); } }
@media (prefers-reduced-motion: reduce) {
  .g1-factcard-plus, .g1-yc-zuhra.walkin, .d4-mount, .d4-mount-r { animation: none; }
  .g1-yc-fig, .g1-yard-bubble { transition: none; }
}
/* === Dars08 — ayirish vizuallari === */
/* BondFrame (s7, Dars06 dan): 10 katak, qizil/yashil olma, "?" yashirin qism */
@keyframes g1pop { 0% { transform: scale(0.4); opacity: 0; } 60% { transform: scale(1.12); opacity: 1; } 100% { transform: scale(1); } }
.g1-bf { display: inline-grid; grid-template-columns: repeat(5, auto); gap: clamp(4px, 1.2vw, 9px); padding: clamp(8px, 1.8vw, 12px); background: #FBF9F4; border-radius: 16px; box-shadow: inset 0 0 0 2px rgba(58,53,48,0.06); justify-items: center; }
.g1-bf-cell { width: clamp(38px, 8vw, 52px); height: clamp(38px, 8vw, 52px); border-radius: 12px; background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(58,53,48,0.08); display: flex; align-items: center; justify-content: center; }
.g1-bf-cell.on { box-shadow: inset 0 0 0 2px rgba(58,53,48,0.13); }
.g1-bf-q { font-weight: 800; font-size: clamp(20px, 4vw, 28px); color: #B6B2AB; }
.g1-bf-ap { width: 80%; height: 80%; display: inline-flex; align-items: center; justify-content: center; filter: drop-shadow(0 2px 3px rgba(58,53,48,0.2)); }
.g1-bf-ap svg { width: 100%; height: 100%; }
.g1-bf-pop { animation: g1pop 0.4s ease-out; }
/* RemoveRow (MC figuralari): total olma, oxirgi "gone" tasi xira + chizib tashlangan */
.g1-removerow { display: flex; flex-wrap: wrap; gap: clamp(6px, 1.6vw, 12px); justify-content: center; align-items: center; max-width: 470px; }
.g1-rr-item { width: clamp(34px, 7vw, 46px); height: clamp(34px, 7vw, 46px); display: inline-flex; align-items: center; justify-content: center; position: relative; transition: opacity 0.3s ease; }
.g1-rr-item svg { width: 100%; height: 100%; }
.g1-rr-gone { opacity: 0.24; }
.g1-rr-gone::after { content: ''; position: absolute; left: 10%; right: 10%; top: 50%; height: 3px; background: #C0392B; border-radius: 2px; transform: rotate(-14deg); opacity: 0.72; }
/* tap-to-remove (s0, sg): olma bosilsa uchib ketadi */
.g1-rcell { cursor: pointer; }
.g1-flyaway { animation: g1flyaway 0.5s cubic-bezier(0.4, 0, 0.6, 1) forwards; pointer-events: none; }
@keyframes g1flyaway { 0% { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); } 100% { opacity: 0; transform: translateY(-46px) scale(0.5) rotate(18deg); } }
/* nishon satri (sg) */
.g1-target-row { display: flex; align-items: center; gap: 10px; }
.g1-target-num { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(26px, 5.5vw, 40px); color: #FF4F28; line-height: 1; }
/* katta ifoda (s3 qoida): 7 − 2 = 5 */
.g1-sent-lg { font-size: clamp(28px, 6vw, 44px); gap: clamp(8px, 2vw, 14px); }
.g1-sent .g1-sent-eq { font-style: normal; font-weight: 800; color: #5A5A60; }
.g1-sent .g1-sent-res { color: #1F7A4D; }
/* ayirish belgisi variantlari */
.g1-cg-op-minus { color: #5A5A60; }
.g1-factcard-minus { animation: none; }
.g1-s5-basket { box-shadow: inset 0 0 0 2px rgba(58,53,48,0.08); }
@media (prefers-reduced-motion: reduce) {
  .g1-flyaway { animation: none; opacity: 0; }
  .g1-bf-pop { animation: none; }
}
/* === Dars09 — son oqi (NumberLine) + juftlash ===*/
.g1-nl { width: 100%; display: flex; justify-content: center; }
.g1-nl-line { width: 100%; display: flex; align-items: flex-start; justify-content: space-between; gap: clamp(2px, 1vw, 8px); padding: clamp(58px, 13vw, 76px) clamp(14px, 3.4vw, 26px) clamp(6px, 1.6vw, 12px); background: #FBF9F4; border-radius: 16px; box-shadow: inset 0 0 0 2px rgba(58,53,48,0.06); position: relative; }
.g1-nl-line::before { content: ""; position: absolute; left: calc(clamp(14px, 3.4vw, 26px) + clamp(10px, 2.2vw, 14px)); right: calc(clamp(14px, 3.4vw, 26px) + clamp(10px, 2.2vw, 14px)); top: calc(clamp(58px, 13vw, 76px) + clamp(10px, 2.2vw, 14px)); height: 3px; background: #D8D2C6; border-radius: 2px; }
/* quyon-sakrovchi: o'lchanган pozitsiyaga gorizontal siljiydi; ichki span yoy chizib sakraydi + qo'nishda sapchiydi */
.g1-nl-rabbit { position: absolute; z-index: 4; pointer-events: none; transform: translate(-50%, -100%); transition: left 1.2s cubic-bezier(0.34, 1.06, 0.66, 1), top 1.2s cubic-bezier(0.34, 1.06, 0.66, 1); }
.g1-nl-rabbit-hop { display: block; width: clamp(36px, 8.5vw, 50px); transform-origin: center bottom; animation: g1rabbithop 1.25s cubic-bezier(0.4, 0, 0.5, 1); }
.g1-nl-rabbit-hop svg { width: 100%; height: auto; display: block; transform: scaleX(1.3); transform-origin: center bottom; filter: drop-shadow(0 4px 5px rgba(58,53,48,0.2)); }
/* sakrash izi: ikki raqam orasidagi yoy chiziq (qisqa muddat ko'rinib o'chadi) */
.g1-nl-trail { position: absolute; z-index: 2; pointer-events: none; height: clamp(20px, 4.6vw, 28px); border: 2.5px dashed #FF8A6E; border-bottom: none; border-radius: 50% 50% 0 0 / 100% 100% 0 0; transform: translateY(-100%); animation: g1trail 1.5s ease-out both; }
@keyframes g1trail { 0% { opacity: 0; } 22% { opacity: 0.95; } 100% { opacity: 0; } }
@keyframes g1rabbithop {
  0%   { transform: translateY(0)     scaleX(1)    scaleY(1);    }
  16%  { transform: translateY(3px)   scaleX(1.12) scaleY(0.82); }
  50%  { transform: translateY(-24px) scaleX(0.93) scaleY(1.1);  }
  84%  { transform: translateY(0)     scaleX(1.14) scaleY(0.84); }
  100% { transform: translateY(0)     scaleX(1)    scaleY(1);    }
}
@media (prefers-reduced-motion: reduce) {
  .g1-nl-rabbit { transition: none; }
  .g1-nl-rabbit-hop { animation: none; }
  .g1-nl-trail { animation: none; opacity: 0.55; }
}
.g1-nl-tick { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; background: transparent; border: none; padding: 0 clamp(2px, 0.8vw, 6px); cursor: default; }
button.g1-nl-tick { cursor: pointer; }
.g1-nl-dot { width: clamp(20px, 4.4vw, 28px); height: clamp(20px, 4.4vw, 28px); border-radius: 50%; background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(58,53,48,0.16); transition: transform 0.2s ease, background 0.2s ease; }
.g1-nl-dot.marker { background: #FF4F28; box-shadow: 0 2px 8px rgba(255,79,40,0.4); transform: scale(1.15); }
.g1-nl-tick.inpath .g1-nl-dot { background: #FFD3C7; }
button.g1-nl-tick.picked .g1-nl-dot { background: #FFE8E1; box-shadow: inset 0 0 0 2px #FF8A6E; }
button.g1-nl-tick.ok .g1-nl-dot { background: #1F7A4D; box-shadow: 0 2px 8px rgba(31,122,77,0.4); transform: scale(1.15); }
button.g1-nl-tick:not(:disabled):hover .g1-nl-dot { transform: scale(1.12); }
.g1-nl-num { font-size: clamp(13px, 2vw, 16px); font-weight: 700; color: #5A5A60; }
.g1-nl-legend { display: flex; gap: clamp(16px, 4vw, 32px); }
.g1-nl-leg { display: inline-flex; align-items: center; gap: 6px; font-size: clamp(13px, 1.8vw, 15px); font-weight: 700; color: #0E0E10; }
.g1-nl-arrow { font-size: clamp(18px, 3.4vw, 24px); font-weight: 800; }
.g1-nl-arrow-fwd { color: #FF4F28; }
.g1-nl-arrow-back { color: #5A5A60; }
.g1-mrow { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(8px, 2vw, 14px); }
.g1-numopt-sel { box-shadow: 0 0 0 3px #FF4F28, 0 4px 12px rgba(255,79,40,0.25) !important; }
.g1-mexp { background: #FFFFFF; border: none; border-radius: 14px; padding: clamp(8px, 1.8vw, 14px) clamp(12px, 2.6vw, 20px); cursor: pointer; box-shadow: inset 0 0 0 2px rgba(58,53,48,0.1); transition: transform 0.15s ease, box-shadow 0.2s ease; }
.g1-mexp:not(:disabled):hover { transform: translateY(-2px); }
.g1-mexp:disabled { cursor: default; }
.g1-mexp-ok { box-shadow: inset 0 0 0 2px #1F7A4D, 0 4px 12px rgba(31,122,77,0.18); background: #E3F0E8; }
/* === Dars11 — TIMSOH-BELGI (> < =) — Dars04 KIT CSS, baytma-bayt === */
.d4-sign { font-family: 'Manrope', sans-serif; font-weight: 800; line-height: 1; color: #FF4F28; font-size: clamp(38px, 8vw, 58px); display: inline-flex; align-items: center; justify-content: center; }
.d4-sign-big { font-size: clamp(52px, 12vw, 86px); }
.d4-croc svg { width: 1.55em; height: 1.18em; overflow: visible; filter: drop-shadow(0 3px 6px rgba(58,53,48,0.22)); }
.d4-croc-anim { animation: d4crocopen 0.5s cubic-bezier(0.34,1.5,0.64,1) both, d4crocbreathe 2.8s ease-in-out 0.55s infinite; transform-origin: center; }
@keyframes d4crocopen { 0% { opacity: 0; transform: scaleX(0.5); } 100% { opacity: 1; transform: scaleX(1); } }
@keyframes d4crocbreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
.d4-numtile { font-family: 'Manrope', sans-serif; font-weight: 800; color: #0E0E10; font-size: clamp(30px, 6.6vw, 46px); line-height: 1; display: inline-flex; align-items: center; justify-content: center; min-width: 1.1em; }
/* === Dars12 — REKENREK (munchoq tasmasi) — YANGI MEXANIKA === */
.g1-rk { display: inline-flex; flex-direction: column; gap: clamp(9px, 2.2vw, 15px); padding: clamp(12px, 2.8vw, 18px) clamp(15px, 3.4vw, 24px); background: linear-gradient(100deg, #D9AB73 0%, #C0904F 40%, #A8763E 100%); border-radius: 18px; border: 2px solid #7E5429; box-shadow: inset 0 3px 4px rgba(255,255,255,0.34), inset 0 -4px 6px rgba(0,0,0,0.24), inset 3px 0 5px rgba(255,255,255,0.12), 0 9px 22px -8px rgba(58,53,48,0.4); }
.g1-rk-row { position: relative; display: flex; justify-content: space-between; align-items: center; min-width: clamp(170px, 44vw, 290px); max-width: 100%; height: clamp(24px, 5vw, 32px); }
.g1-rk-wire { position: absolute; left: -3px; right: -3px; top: 50%; height: 4px; background: linear-gradient(#9A8463, #6E5436 45%, #4E3A22); transform: translateY(-50%); border-radius: 3px; box-shadow: 0 1px 0 rgba(255,255,255,0.18), inset 0 1px 1px rgba(255,255,255,0.25); }
.g1-rk-grp { position: relative; z-index: 1; display: inline-flex; gap: clamp(1px, 0.5vw, 3px); }
.g1-rk-bead { position: relative; width: clamp(18px, 4.3vw, 27px); height: clamp(18px, 4.3vw, 27px); border-radius: 50%; box-shadow: 0 3px 5px rgba(58,53,48,0.34), inset 0 -3px 4px rgba(0,0,0,0.26), inset 0 2px 3px rgba(255,255,255,0.4); }
.g1-rk-bead::after { content: ""; position: absolute; top: 13%; left: 19%; width: 40%; height: 32%; border-radius: 50%; background: radial-gradient(ellipse at center, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0) 75%); pointer-events: none; }
.g1-rk-red { background: radial-gradient(circle at 36% 30%, #FBA388 0%, #EC6040 38%, #C7401F 78%, #A8331A 100%); }
.g1-rk-white { background: radial-gradient(circle at 36% 30%, #FFFFFF 0%, #F4EFE5 48%, #DCD2C0 82%, #C7BBA4 100%); }
.g1-rk-gap { margin-left: clamp(7px, 1.8vw, 13px); }
.g1-rk-bslide { animation: g1rkbead 0.62s cubic-bezier(0.34, 1.56, 0.5, 1) both; }
@keyframes g1rkbead {
  0%   { transform: translateX(44px) scale(0.8) rotate(7deg);                  opacity: 0; }
  42%  { transform: translateX(-6px) scaleX(1.2) scaleY(0.84) rotate(-4deg);   opacity: 1; }
  60%  { transform: translateX(4px)  scaleX(0.9) scaleY(1.14) rotate(2.5deg); }
  76%  { transform: translateX(-2px) scaleX(1.07) scaleY(0.96) rotate(-1deg); }
  90%  { transform: translateX(1px)  scale(1.02) rotate(0.5deg); }
  100% { transform: translateX(0)    scale(1) rotate(0); }
}
/* ramka zarbadan yengil silkinadi (jonli) */
.g1-rk-shake { animation: g1rkshake 0.5s ease-out 0.18s both; }
@keyframes g1rkshake {
  0%, 100% { transform: translateX(0) rotate(0); }
  25% { transform: translateX(-2px) rotate(-0.5deg); }
  55% { transform: translateX(2px) rotate(0.5deg); }
  80% { transform: translateX(-1px) rotate(0); }
}
@media (prefers-reduced-motion: reduce) { .g1-rk-bslide, .g1-rk-shake { animation: none; } }
/* === Dars14 — BOZOR sahnasi jonli harakatlari === */
.g1-bz-swing { transform-box: view-box; transform-origin: 330px 28px; animation: g1bzswing 3.6s ease-in-out infinite; }
@keyframes g1bzswing { 0%, 100% { transform: rotate(-2.4deg); } 50% { transform: rotate(2.4deg); } }
.g1-bz-sway { transform-box: view-box; transform-origin: 200px 44px; animation: g1bzsway 4.4s ease-in-out infinite; }
@keyframes g1bzsway { 0%, 100% { transform: translateY(0) rotate(-0.7deg); } 50% { transform: translateY(1.6px) rotate(0.7deg); } }
.g1-bz-fringe { transform-box: view-box; transform-origin: 200px 28px; animation: g1bzfringe 3.1s ease-in-out infinite; }
@keyframes g1bzfringe { 0%, 100% { transform: skewX(0deg) translateY(0); } 50% { transform: skewX(1.5deg) translateY(0.9px); } }
@media (prefers-reduced-motion: reduce) { .g1-bz-swing, .g1-bz-sway, .g1-bz-fringe { animation: none; } }
/* === Dars14 — OLMA / yashik (bozor sanoq metodi) === */
.g1-apple { display: inline-flex; width: clamp(20px, 4.6vw, 30px); }
.g1-apple svg { width: 100%; height: auto; display: block; filter: drop-shadow(0 2px 2px rgba(58,53,48,0.18)); }
.g1-crate { position: relative; display: inline-flex; flex-direction: column; align-items: center; padding: clamp(6px, 1.6vw, 9px) clamp(8px, 2vw, 12px) clamp(16px, 3.4vw, 22px); background: linear-gradient(#CDA068, #A8763E); border-radius: 9px; border: 2px solid #855A2F; box-shadow: inset 0 2px 3px rgba(255,255,255,0.28), inset 0 -3px 5px rgba(0,0,0,0.18), 0 5px 12px -5px rgba(58,53,48,0.32); }
.g1-crate-apples { display: grid; grid-template-columns: repeat(5, 1fr); gap: clamp(1px, 0.5vw, 3px); }
.g1-crate-label { position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); font-weight: 800; font-size: clamp(11px, 2.2vw, 15px); color: #FBEFD8; letter-spacing: 0.04em; }
.g1-fviz { display: flex; align-items: flex-end; justify-content: center; gap: clamp(10px, 2.6vw, 20px); flex-wrap: wrap; }
.g1-fviz-ones { display: inline-flex; flex-wrap: wrap; align-items: flex-end; gap: clamp(2px, 0.8vw, 5px); max-width: clamp(120px, 34vw, 210px); }
.g1-fviz-one { display: inline-flex; }
.g1-fviz-plus { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(20px, 4vw, 30px); color: #A7A6A2; align-self: center; }
.g1-fviz-pop .g1-fviz-one { animation: g1fpop 0.42s cubic-bezier(0.34, 1.5, 0.6, 1) both; }
@keyframes g1fpop { 0% { transform: translateY(-16px) scale(0.6); opacity: 0; } 60% { transform: translateY(2px) scale(1.1); opacity: 1; } 100% { transform: translateY(0) scale(1); } }
@media (prefers-reduced-motion: reduce) { .g1-fviz-pop .g1-fviz-one { animation: none; } }
/* ============================================================ */
/* === D2 (2-sinf Dars01) — «KEMA ICHIDA»: yuk bo'limi + MIKROGRAVITATSIYA + realistik hardware === */
/* Barcha harakat = suzish/aylanish/magnit-dok. Tortishish-tushish YO'Q. reduced-motion -> statik. */
/* ============================================================ */
/* YUK BO'LIMI interyeri — SceneBg-texnika: aspect-ratio 400/230 + container-type:size,
   fon svg preserveAspectRatio="xMidYMax meet" — fon va figuralar BIRGA miqyoslanadi. */
.d2-scene { position: relative; width: 100%; min-height: clamp(200px, 42vw, 280px); container-type: size; border-radius: 14px; overflow: hidden; background: #E3D9C4; }
.d2-scene-bg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.d2-scene-bit { position: absolute; right: 3cqw; bottom: 8cqh; height: 42cqh; z-index: 2; display: flex; align-items: flex-end; animation: d2hover 6.5s ease-in-out infinite; }
.d2-scene-bit .g1-cast-fig { height: 100%; }
.d2-scene-bit .g1-char { height: 100%; width: auto; }
.d2-bit-cheer { animation: d2hover 6.5s ease-in-out infinite; }
/* Bit vaznsizlikda suzadi (yuqori-past + yengil aylanish) */
@keyframes d2hover { 0%, 100% { transform: translateY(0) rotate(-1.5deg); } 50% { transform: translateY(-4%) rotate(1.5deg); } }
/* ambient: illyuminator yulduzlari miltillashi + neon + kasseta LED + shift porlashi */
.d2-star { animation: d2tw 2.8s ease-in-out infinite; }
@keyframes d2tw { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.d2-neon { animation: d2neon 2.2s ease-in-out infinite; }
@keyframes d2neon { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.d2-casslight { animation: d2neon 1.8s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.d2-ceilglow { animation: d2neon 4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .d2-star, .d2-neon, .d2-casslight, .d2-ceilglow, .d2-scene-bit, .d2-bit-cheer { animation: none; } }
/* MIKROGRAVITATSIYA — universal suzish: sekin yuqori-past + doimiy yengil aylanish (inersiya). */
.d2-float { animation: d2float 9s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.d2-float-b { animation-duration: 11s; animation-delay: -3s; }
@keyframes d2float { 0%, 100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-6px) rotate(2deg); } }
/* magnit-dok: buyum yondan suzib kelib ohista joylashadi (ease-out, tushish YO'Q) */
.d2-dock { animation: d2dockL 0.7s cubic-bezier(0.22, 0.9, 0.3, 1) both; }
.d2-dock-r { animation-name: d2dockR; }
@keyframes d2dockL { 0% { transform: translateX(-26px) rotate(-10deg); opacity: 0; } 70% { opacity: 1; } 100% { transform: translateX(0) rotate(0); opacity: 1; } }
@keyframes d2dockR { 0% { transform: translateX(26px) rotate(10deg); opacity: 0; } 70% { opacity: 1; } 100% { transform: translateX(0) rotate(0); opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d2-float, .d2-float-b, .d2-dock, .d2-dock-r { animation: none; } }
/* suzuvchi chang-zarralar (har ekranda ambient) */
.d2-motes { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.d2-mote { position: absolute; width: 5px; height: 5px; border-radius: 50%; background: radial-gradient(circle at 40% 40%, rgba(143,224,244,0.5), rgba(143,224,244,0)); animation: d2mote 22s linear infinite; }
.d2-mote:nth-child(1) { left: 12%; top: 20%; }
.d2-mote:nth-child(2) { left: 30%; top: 70%; width: 4px; height: 4px; }
.d2-mote:nth-child(3) { left: 52%; top: 30%; }
.d2-mote:nth-child(4) { left: 68%; top: 62%; width: 6px; height: 6px; }
.d2-mote:nth-child(5) { left: 82%; top: 24%; }
.d2-mote:nth-child(6) { left: 44%; top: 84%; width: 4px; height: 4px; }
.d2-mote:nth-child(7) { left: 90%; top: 50%; }
.d2-mote:nth-child(8) { left: 8%; top: 56%; width: 6px; height: 6px; }
@keyframes d2mote { 0% { transform: translate(0, 0); opacity: 0; } 15% { opacity: 0.7; } 85% { opacity: 0.7; } 100% { transform: translate(22px, -30px); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .d2-mote { animation: none; opacity: 0.4; } }
/* hook (s0) — KONTEYNER markazidan burst -> inersiya bilan suzish; --r butun davomida saqlanadi.
   OUTER (.d2-hbatt): pozitsiya (left/top) + burst (markazdan --dx/--dy vektor bo'ylab, rotate(--r)).
   INNER (.d2-hbatt-in): doimiy idle drift+spin (svg root'da EMAS — HTML o'rovchida). */
.d2-hbatt { position: absolute; width: 5.6cqw; z-index: 3; }
.d2-hbatt-in { display: inline-block; width: 100%; transform-origin: center; }
.d2-hbatt-in .d2-battsvg, .d2-hbatt-in .d2-casssvg { width: 100%; height: auto; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.45)); }
/* burst: markazdan (translate(-dx,-dy)) o'z joyiga, sekin ease-out (inersiya); rotate(--r) doim saqlanadi */
.d2-hbatt-burst { animation: d2burst 1.15s cubic-bezier(0.16, 0.75, 0.28, 1) both; }
@keyframes d2burst {
  0%   { transform: translate(calc(var(--dx, 0px) * -1), calc(var(--dy, 0px) * -1)) rotate(var(--r, 0deg)) scale(0.45); opacity: 0; }
  28%  { opacity: 1; }
  100% { transform: translate(0, 0) rotate(var(--r, 0deg)) scale(1); opacity: 1; }
}
/* idle: parallaks tezlikda suzish (Y) + sekin spin — inner wrapper, base --r bilan urishmaydi */
.d2-hbatt-in { animation: d2floatspin 9s ease-in-out infinite; }
@keyframes d2floatspin { 0%, 100% { transform: translateY(0) rotate(-7deg); } 50% { transform: translateY(-7px) rotate(7deg); } }
/* yig'ilish: markazga suzib kelib magnit qulf (green snap glow); --r -> 0 */
.d2-hbatt-latch { transition: left 1s cubic-bezier(0.22, 0.9, 0.3, 1), top 1s cubic-bezier(0.22, 0.9, 0.3, 1); animation: d2latch 0.6s ease-out 0.9s both; }
.d2-hbatt-latch .d2-hbatt-in { animation: none; }
@keyframes d2latch { 0% { filter: drop-shadow(0 0 0 rgba(110,242,155,0)); } 45% { filter: drop-shadow(0 0 8px rgba(110,242,155,0.95)); } 100% { filter: drop-shadow(0 2px 4px rgba(0,0,0,0.45)); } }
.d2-hcass { position: absolute; left: 52%; top: 42%; width: 12cqw; z-index: 4; filter: drop-shadow(0 3px 7px rgba(0,0,0,0.55)); }
/* konteyner (qopqog'i ochiladi, batareyalar shundan otiladi) */
.d2-hbox { position: absolute; left: 48%; top: 40%; width: 12cqw; height: 10cqh; z-index: 2; transition: opacity 0.5s ease; }
.d2-hbox i { position: absolute; left: 0; right: 0; border-radius: 2px; }
.d2-hbox-body { bottom: 0; height: 62%; background: linear-gradient(#3A4763, #1E273E); box-shadow: inset 0 0 0 1.5px #55697C; }
.d2-hbox-lid { top: 0; height: 34%; background: linear-gradient(#55697C, #3A4763); box-shadow: inset 0 0 0 1.5px #7E93A8; transform-origin: left bottom; animation: d2lidpop 0.7s cubic-bezier(0.3, 1.4, 0.5, 1) both; }
@keyframes d2lidpop { 0% { transform: rotate(0); } 100% { transform: rotate(-46deg); } }
.d2-hbox-empty { opacity: 0.55; }
@media (prefers-reduced-motion: reduce) {
  .d2-hbatt-burst, .d2-hbatt-in, .d2-hbatt-latch, .d2-hbox-lid { animation: none; }
  .d2-hbatt-latch { transition: none; }
  .d2-hbatt-burst { transform: rotate(var(--r, 0deg)); }
}
/* s1 (v11) — PackTenViz: 10 batareya suzadi -> to'g'ri javobda markazga suzib BITTA
   kassetaga joylashadi (magnit-latch porlashi + LED). Mavhum "element" CSS olib tashlandi. */
.d2-packviz { position: relative; width: 100%; max-width: clamp(250px, 62vw, 380px); height: clamp(110px, 24vw, 170px); margin: 0 auto; }
.d2-packb { position: absolute; width: clamp(14px, 3vw, 20px); transform: rotate(var(--r, 0deg)); }
.d2-packb .d2-battsvg { width: 100%; height: auto; filter: drop-shadow(0 2px 3px rgba(58,53,48,0.3)); }
/* javobgacha: sekin drift + spin (mikrogravitatsiya, s0 lug'ati) */
.d2-packb-in { display: inline-block; animation: d2floatspin 9s ease-in-out infinite; transform-origin: center; }
/* to'g'ri javobda: markazga suzib kirish (left/top + kichrayish), so'ng yo'qoladi */
.d2-packin { animation: d2packin 0.9s cubic-bezier(0.22, 0.9, 0.3, 1) forwards; }
.d2-packin .d2-packb-in { animation: none; }
@keyframes d2packin {
  55%  { opacity: 1; }
  100% { left: 48%; top: 42%; transform: rotate(0deg) scale(0.45); opacity: 0; }
}
/* yig'ilgan kasseta: markazda pop + magnit-latch porlashi (d2latch), keyin tinch suzish */
.d2-packcass { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); }
.d2-packcass-pop { display: inline-block; opacity: 0; animation: d2packpop 0.55s cubic-bezier(0.3, 1.3, 0.5, 1) 0.75s forwards, d2latch 0.6s ease-out 0.85s both; }
@keyframes d2packpop { 0% { opacity: 0; transform: scale(0.4); } 100% { opacity: 1; transform: scale(1); } }
.d2-packcass-idle { display: inline-block; animation: d2float 9s ease-in-out 1.4s infinite; }
@media (prefers-reduced-motion: reduce) {
  .d2-packb-in { animation: none; }
  .d2-packin { animation: none; opacity: 0; }
  .d2-packcass-pop { animation: none; opacity: 1; }
  .d2-packcass-idle { animation: none; }
}
/* BATAREYA / KASSETA o'lchamlari */
.d2-battsvg { width: clamp(14px, 3vw, 20px); height: auto; display: inline-block; }
.d2-battsvg-slot { width: clamp(12px, 2.6vw, 17px); }
.d2-battsvg-btn { width: clamp(12px, 2.6vw, 17px); }
.d2-casssvg { width: clamp(36px, 8vw, 56px); height: auto; display: inline-block; }
.d2-casssvg-big { width: clamp(56px, 13vw, 86px); }
.d2-casssvg-btn { width: clamp(24px, 5vw, 34px); }
.d2-mini { width: clamp(16px, 3.4vw, 24px); height: auto; display: inline-block; }
/* kasseta+batareya vizuali: o'nliklar guruhi chapda, birliklar o'ngda */
.d2-bsviz { display: flex; align-items: flex-end; justify-content: center; gap: clamp(14px, 3.4vw, 26px); flex-wrap: wrap; min-height: clamp(56px, 12vw, 84px); }
.d2-bs-grp { display: inline-flex; align-items: flex-end; gap: clamp(4px, 1vw, 8px); flex-wrap: wrap; justify-content: center; max-width: clamp(190px, 48vw, 330px); }
.d2-bs-ones { gap: clamp(2px, 0.7vw, 5px); }
.d2-bs-empty { font-weight: 800; font-size: clamp(30px, 6.5vw, 44px); color: #B6B2AB; }
.d2-bsviz-sm .d2-casssvg { width: clamp(28px, 6vw, 42px); }
.d2-bsviz-sm .d2-battsvg { width: clamp(11px, 2.4vw, 16px); }
/* katta son-displey (pult ekranlari) */
.d2-bignum { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(38px, 8vw, 58px); line-height: 1; color: #0E0E10; }
.d2-bignum-accent { color: #1F7A4D; }
/* s2 — kassetaga joylash maydoni (yuk bo'limi panel) */
.d2-field { position: relative; width: 100%; min-height: clamp(200px, 42vw, 280px); background: linear-gradient(#F3EBDA, #E8DEC9); border-radius: 14px; box-shadow: inset 0 0 0 2px #D9CCB2; overflow: hidden; }
/* suzuvchi debris — xaotik mikrogravitatsiya (batareya/sim/lampochka) */
.d2-debris { position: absolute; inset: 0; pointer-events: none; }
.d2-debris-el { position: absolute; line-height: 0; filter: drop-shadow(0 2px 4px rgba(58,53,48,0.22)); animation-name: d2debris; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
@keyframes d2debris { 0% { transform: translate(0,0) rotate(0deg); } 25% { transform: translate(14px,-11px) rotate(48deg); } 50% { transform: translate(-6px,10px) rotate(-24deg); } 75% { transform: translate(9px,6px) rotate(30deg); } 100% { transform: translate(0,0) rotate(0deg); } }
@media (prefers-reduced-motion: reduce) { .d2-debris-el { animation: none; } }
.d2-nlcue-slide { animation: d2nlcueslide 3.4s ease-in-out infinite; }
.d2-nlcue-hand { animation: d2nlcuebob 1.1s ease-in-out infinite; }
.d2-nlcue-ring { transform-box: fill-box; transform-origin: center; animation: d2nlcuering 1.1s ease-in-out infinite; }
@keyframes d2nlcueslide { 0%, 100% { transform: translateX(54px); } 50% { transform: translateX(214px); } }
@keyframes d2nlcuebob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes d2nlcuering { 0% { opacity: 0.85; transform: scale(0.7); } 70% { opacity: 0; transform: scale(1.9); } 100% { opacity: 0; transform: scale(1.9); } }
@media (prefers-reduced-motion: reduce) { .d2-nlcue-slide { animation: none; transform: translateX(134px); } .d2-nlcue-hand, .d2-nlcue-ring { animation: none; } }
.d2-fbatt { position: absolute; background: transparent; border: none; padding: 8px; cursor: pointer; transform: rotate(var(--r, 0deg)); animation: d2driftin 0.6s ease-out both, d2float 10s ease-in-out 0.6s infinite; }
.d2-fbatt .d2-battsvg { width: clamp(17px, 3.6vw, 24px); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
.d2-fbatt:hover:not(:disabled) { filter: drop-shadow(0 0 6px rgba(143,224,244,0.8)); }
.d2-fbatt:disabled { cursor: default; }
@keyframes d2driftin { 0% { opacity: 0; transform: scale(0.6) rotate(var(--r, 0deg)); } 100% { opacity: 1; transform: scale(1) rotate(var(--r, 0deg)); } }
@media (prefers-reduced-motion: reduce) { .d2-fbatt { animation: none; } }
.d2-casszone { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: clamp(130px, 33vw, 195px); min-height: clamp(104px, 23vw, 156px); border: 2.5px dashed rgba(58,71,99,0.45); border-radius: 16px; background: rgba(246,240,226,0.86); box-shadow: 0 6px 18px -8px rgba(58,53,48,0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: clamp(8px, 1.8vw, 12px); transition: border-color 0.25s, background 0.25s, box-shadow 0.25s; z-index: 2; }
.d2-casszone-tied { border-style: solid; border-color: #1F7A4D; background: rgba(227,240,232,0.92); box-shadow: 0 0 16px -6px rgba(31,122,77,0.45); }
.d2-slotgrid { display: grid; grid-template-columns: repeat(5, auto); gap: clamp(3px, 0.8vw, 6px); justify-items: center; }
.d2-slot { width: clamp(18px, 4vw, 26px); height: clamp(26px, 5.6vw, 36px); border-radius: 6px; box-shadow: inset 0 0 0 1.5px rgba(58,71,99,0.3); display: flex; align-items: center; justify-content: center; }
.d2-slot-full { box-shadow: inset 0 0 0 1.5px #1F7A4D; background: rgba(31,122,77,0.12); }
.d2-slot .g1-pop-in { animation: d2dockR 0.55s cubic-bezier(0.22, 0.9, 0.3, 1) both; }
.d2-count { font-weight: 800; font-size: clamp(13px, 1.9vw, 16px); color: #5A6B88; }
.d2-count-ok { color: #1F7A4D; }
/* manba-tugmalar (s3/s4/s8): kasseta+ / batareya+ */
.d2-srcrow { display: flex; gap: clamp(10px, 2.4vw, 18px); justify-content: center; flex-wrap: wrap; }
.d2-srcbtn { display: inline-flex; align-items: center; gap: clamp(8px, 1.8vw, 12px); font-size: clamp(15px, 2.2vw, 19px) !important; padding: clamp(10px, 2vw, 15px) clamp(14px, 2.8vw, 22px) !important; }
.d2-src-wait { opacity: 0.45; }
.d2-srcbtn:disabled { cursor: default; }
/* yuklash pulti (brushed-metal panel) — vizual + displey ichida */
.d2-console { width: 100%; background: linear-gradient(#F3EBDA, #E8DEC9); border-radius: 16px; box-shadow: inset 0 0 0 2px #D9CCB2, inset 0 2px 6px rgba(255,255,255,0.5), 0 8px 22px -10px rgba(58,53,48,0.25); padding: clamp(12px, 2.6vw, 20px); display: flex; flex-direction: column; align-items: center; gap: clamp(10px, 2.2vw, 16px); position: relative; }
.d2-console::before { content: ''; position: absolute; top: 7px; left: 10px; right: 10px; height: 4px; border-radius: 2px; background: repeating-linear-gradient(90deg, #F0A81E 0 8px, #D9CCB2 8px 14px); opacity: 0.5; }
.d2-console-sm { padding: clamp(10px, 2vw, 14px); }
.d2-console .d2-bignum { color: #2A3550; }
.d2-console .d2-bignum-accent { color: #1F7A4D; }
.d2-console .d2-bs-empty { color: #A79E88; }
.d2-console .g1-anspop-num { color: #1F7A4D; }
.d2-console .g1-anspop-eq { color: #5A6B88; }
/* s5 — neon-displey kartasi (34 <-> 30 + 4), 7-seg-ish porlash */
.d2-cardbtn { background: transparent; border: none; padding: 6px; cursor: pointer; }
.d2-cardbtn:disabled { cursor: default; }
.d2-card { display: inline-flex; align-items: center; justify-content: center; background: #0C1424; border-radius: 18px; box-shadow: inset 0 0 0 2px #2C3A60, 0 8px 22px -6px rgba(16,24,44,0.55); font-family: 'JetBrains Mono', monospace; font-weight: 800; letter-spacing: 0.06em; font-size: clamp(44px, 10vw, 68px); line-height: 1; color: #5BD6F2; text-shadow: 0 0 14px rgba(91,214,242,0.7); padding: clamp(12px, 2.6vw, 20px) clamp(20px, 4.4vw, 34px); }
.d2-card-tens { color: #FF8A6E; text-shadow: 0 0 14px rgba(255,138,110,0.6); }
.d2-card-ones { color: #6EF29B; text-shadow: 0 0 14px rgba(110,242,155,0.6); }
.d2-splitrow { display: inline-flex; align-items: center; gap: clamp(10px, 2.4vw, 18px); }
.d2-plus { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(28px, 6vw, 44px); color: #9FD8EA; }
.d2-tap-pulse { animation: d2tappulse 1.8s ease-in-out infinite; }
@keyframes d2tappulse { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
.d2-eq { font-weight: 800; font-size: clamp(20px, 4.4vw, 32px); color: #1F7A4D; }
/* s15 QOIDA recap — yakunda qoidani qayta ko'rsatadi (ko'rinadigan qonun qatori) */
.d2-recap { margin-top: clamp(8px, 1.6vw, 12px); padding: clamp(7px, 1.4vw, 10px) clamp(12px, 2.2vw, 16px); border-radius: 12px; background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(31,122,77,0.35); color: #1F7A4D; font-weight: 800; font-size: clamp(12px, 1.8vw, 15px); text-align: center; }
/* FOYDALI matematik ma'lumot/qoida kartasi */
.d2-infonote { display: flex; align-items: flex-start; gap: clamp(8px, 1.8vw, 12px); background: #EAF6FB; border-radius: 14px; padding: clamp(9px, 1.8vw, 13px) clamp(12px, 2.2vw, 16px); box-shadow: inset 3px 0 0 #019ACB; }
.d2-infonote-badge { flex-shrink: 0; font-size: clamp(9px, 1.4vw, 11px); font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #017CA3; background: #FFFFFF; border-radius: 99px; padding: 3px 10px; margin-top: 2px; }
.d2-infonote-txt { margin: 0; font-family: 'Source Serif 4', serif; font-size: clamp(13px, 1.9vw, 15px); line-height: 1.4; color: #0E0E10; }
/* s5 lyuk — noto'g'ri kodda silkinish */
.d2-hatchwrap { line-height: 0; }
.d2-hatch-shake { animation: d2hshake 0.45s ease; }
@keyframes d2hshake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-7px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(3px); } }
@media (prefers-reduced-motion: reduce) { .d2-hatch-shake { animation: none; } }
/* s0 «video» — Yer globusi: bulutlar sekin aylanadi, globus ohista suzadi (kema uzoqlashadi) */
.d2-earth { animation: d2earthdrift 26s ease-in-out infinite alternate; }
.d2-earth-clouds { transform-origin: 64px 46px; animation: d2earthspin 46s linear infinite; }
@keyframes d2earthdrift { from { transform: translate(0px, 0px); } to { transform: translate(-5px, 4px); } }
@keyframes d2earthspin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
/* s15 warp — Yer uzoqlashadi (kichrayadi + chetga suzadi), kema uchmoqda */
.d2-earth-recede { transform-origin: 64px 46px; animation: d2earthrecede 5.5s ease-in 0.4s forwards; }
@keyframes d2earthrecede { 0% { transform: scale(1) translate(0px, 0px); opacity: 1; } 100% { transform: scale(0.28) translate(34px, -22px); opacity: 0.85; } }
@media (prefers-reduced-motion: reduce) { .d2-earth, .d2-earth-clouds, .d2-earth-recede { animation: none; } }
/* s5 — lyuk oldidagi KOD TABLOSI (o'rnatilgan panel) */
.d2-hatchtablo { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.2vw, 8px); width: min(290px, 88%); background: #F6F0E2; border-radius: 14px; box-shadow: inset 0 0 0 2px #D9CCB2, 0 5px 14px -7px rgba(58,53,48,0.22); padding: clamp(8px, 1.8vw, 12px) clamp(12px, 2.2vw, 16px); margin-top: clamp(-10px, -1.6vw, -6px); }
@media (prefers-reduced-motion: reduce) { .d2-tap-pulse { animation: none; } }
/* s6 — lyuk-kod panellari (45 va 54) — v10 ANIQLIK: raqam <-> yuk bog'i ko'rinadi.
   Panelda raqobatlashuvchi harakat YO'Q (lampa statik, faqat reveal + pop). */
.d2-panels { display: flex; gap: clamp(10px, 2.4vw, 18px); justify-content: center; align-items: stretch; flex-wrap: wrap; }
.d2-panel { position: relative; flex: 1 1 150px; max-width: 340px; background: #FFFFFF; border-radius: 14px; box-shadow: 0 8px 22px -6px rgba(58,53,48,0.14); padding: clamp(12px, 2.4vw, 18px); display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.8vw, 12px); opacity: 0.22; transform: translateY(6px); transition: opacity 0.5s ease, transform 0.5s ease; }
.d2-panel.on { opacity: 1; transform: none; }
.d2-panel-num { display: inline-flex; gap: 2px; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(36px, 7.5vw, 54px); line-height: 1; color: #0E0E10; }
.d2-panel-num span { transition: color 0.3s ease; }
.d2-digit-tens { color: #FF4F28; }
.d2-digit-ones { color: #019ACB; }
.d2-lamp { width: clamp(12px, 2.6vw, 17px); height: clamp(12px, 2.6vw, 17px); border-radius: 50%; background: #C8CDD4; box-shadow: inset 0 0 0 2px rgba(0,0,0,0.15); }
.d2-lamp-still-g { background: #6EF29B; box-shadow: 0 0 8px rgba(110,242,155,0.7); }
.d2-lamp-still-y { background: #FFC23C; box-shadow: 0 0 8px rgba(255,194,60,0.7); }
.d2-hpanel { min-height: clamp(190px, 42vw, 280px); justify-content: flex-start; }
.d2-hwait { font-weight: 800; font-size: clamp(34px, 7vw, 52px); color: #B6B2AB; margin: auto 0; }
/* ikki ustun: raqam + belgi + ulagich + yuk-guruh (bog' shubhasiz ko'rinsin) */
.d2-hcols { display: flex; gap: clamp(10px, 2.4vw, 18px); align-items: stretch; justify-content: center; width: 100%; }
.d2-hcol { flex: 1 1 0; display: flex; flex-direction: column; align-items: center; gap: clamp(3px, 0.8vw, 6px); border-radius: 12px; padding: clamp(6px, 1.4vw, 10px) clamp(4px, 1vw, 8px); }
.d2-hcol-tens { background: #EAF6FB; box-shadow: inset 0 0 0 1.5px rgba(1,154,203,0.35); }
.d2-hcol-ones { background: #FFF4E0; box-shadow: inset 0 0 0 1.5px rgba(199,119,0,0.3); }
.d2-hdigit { font-weight: 800; font-size: clamp(40px, 9vw, 62px); line-height: 1; letter-spacing: 0.04em; }
.d2-hcol-tens .d2-hdigit { color: #017CA3; }
.d2-hcol-ones .d2-hdigit { color: #C77700; }
.d2-hicon { display: inline-flex; opacity: 0.9; }
.d2-hline { width: 2px; height: clamp(10px, 2.2vw, 16px); border-radius: 1px; }
.d2-hcol-tens .d2-hline { background: rgba(1,154,203,0.55); }
.d2-hcol-ones .d2-hline { background: rgba(199,119,0,0.5); }
.d2-hcargo { display: flex; flex-wrap: wrap; gap: clamp(2px, 0.6vw, 5px); justify-content: center; align-items: flex-end; min-height: clamp(38px, 8.5vw, 58px); }
.d2-hgc { width: clamp(20px, 4.4vw, 30px); height: auto; display: inline-block; }
.d2-hgb { width: clamp(10px, 2.2vw, 15px); height: auto; display: inline-block; }
/* 3-qadam: 4 va 5 KO'RINIB joy almashadi (yoy bo'ylab, bir marta, sekin) */
.d2-swap { position: relative; display: flex; align-items: center; justify-content: center; gap: clamp(34px, 9vw, 60px); min-height: clamp(40px, 8.5vw, 58px); }
.d2-swapchip { display: inline-flex; align-items: center; justify-content: center; width: clamp(34px, 7.4vw, 50px); height: clamp(34px, 7.4vw, 50px); border-radius: 12px; font-weight: 800; font-size: clamp(22px, 4.8vw, 32px); background: #FFFFFF; box-shadow: 0 6px 16px -6px rgba(58,53,48,0.3); }
.d2-swapchip-l { color: #017CA3; animation: d2swapL 1.6s cubic-bezier(0.45, 0, 0.25, 1) 0.3s forwards; }
.d2-swapchip-r { color: #C77700; animation: d2swapR 1.6s cubic-bezier(0.45, 0, 0.25, 1) 0.3s forwards; }
.d2-swaparrow { font-weight: 800; font-size: clamp(18px, 4vw, 26px); color: #A7A6A2; }
@keyframes d2swapL { 0% { transform: translate(0, 0); } 50% { transform: translate(calc(50% + clamp(26px, 6.5vw, 43px)), -18px); } 100% { transform: translateX(calc(100% + clamp(52px, 13vw, 86px))); } }
@keyframes d2swapR { 0% { transform: translate(0, 0); } 50% { transform: translate(calc(-50% - clamp(26px, 6.5vw, 43px)), 18px); } 100% { transform: translateX(calc(-100% - clamp(52px, 13vw, 86px))); } }
.d2-panel-tags { display: inline-flex; gap: clamp(8px, 2vw, 14px); }
.d2-panel-tags i { font-style: normal; font-weight: 700; font-size: clamp(10px, 1.4vw, 12px); letter-spacing: 0.08em; text-transform: uppercase; border-radius: 99px; padding: 3px 9px; }
.d2-tag-tens { background: #FFE8E1; color: #D63E18; }
.d2-tag-ones { background: #EAF6FB; color: #017CA3; }
@media (prefers-reduced-motion: reduce) { .d2-panel { transition: none; } .d2-swapchip-l, .d2-swapchip-r { animation: none; } }
/* s10 — bort kodi 63 (7-seg tablo) */
.d2-claim { display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.8vw, 12px); }
.d2-board { display: inline-flex; gap: clamp(3px, 0.8vw, 6px); font-family: 'JetBrains Mono', monospace; letter-spacing: 0.08em; font-weight: 800; font-size: clamp(44px, 10vw, 68px); line-height: 1; background: #0C1424; color: #E8F4FF; border-radius: 14px; padding: clamp(8px, 1.8vw, 14px) clamp(18px, 4vw, 30px); box-shadow: inset 0 0 0 2px #2C3A60, 0 8px 22px -6px rgba(16,24,44,0.5); }
.d2-board .d2-digit-tens { color: #FF8A6E; text-shadow: 0 0 10px rgba(255,138,110,0.5); }
.d2-board .d2-digit-ones { color: #5BD6F2; text-shadow: 0 0 10px rgba(91,214,242,0.5); }
.d2-board span { transition: color 0.3s ease; }
/* s8 — build+check boshqaruvi */
.d2-buildrows { display: flex; gap: clamp(16px, 4vw, 32px); justify-content: center; flex-wrap: wrap; }
.d2-buildcol { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.d2-collabel { font-weight: 700; font-size: clamp(10px, 1.4vw, 12px); letter-spacing: 0.1em; text-transform: uppercase; color: #5A6B88; }
.d2-pm { display: flex; gap: clamp(6px, 1.4vw, 10px); align-items: stretch; }
/* MC raqam-varianti */
.d2-mcnum { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(21px, 4.4vw, 30px); line-height: 1; color: inherit; }
.d2-qlead { margin: 0 0 clamp(4px, 1vw, 8px); text-align: center; color: #A7A6A2; font-weight: 600; font-size: clamp(12px, 1.6vw, 14px); }
/* MASALA — magnit-rack + yuk xati */
.d2-rackwrap { display: flex; align-items: center; justify-content: center; gap: clamp(10px, 2.6vw, 22px); flex-wrap: wrap; }
.d2-manifest { display: inline-flex; flex-direction: column; gap: clamp(4px, 1vw, 8px); background: #F3EBDA; border: 2px solid #D9CCB2; border-radius: 12px; padding: clamp(8px, 1.8vw, 13px) clamp(10px, 2.2vw, 16px); box-shadow: 0 6px 16px -8px rgba(58,53,48,0.28); }
.d2-manifest-title { font-weight: 800; font-size: clamp(10px, 1.4vw, 12px); letter-spacing: 0.1em; text-transform: uppercase; color: #1F7A4D; border-bottom: 1.5px dashed #D9CCB2; padding-bottom: 3px; }
.d2-manifest-row { display: inline-flex; align-items: center; gap: 7px; font-size: clamp(13px, 1.8vw, 16px); color: #2A3550; border-radius: 8px; padding: 2px 6px; }
.d2-manifest-row b { font-weight: 800; color: #5A6B88; }
/* v10: yuk-xati qatorlari KETMA-KET yonadi (audio bilan sinxron): avval "6", keyin "3" */
.d2-mrow-1 { animation: d2mrowhl 1.4s ease 1s; }
.d2-mrow-2 { animation: d2mrowhl 1.4s ease 4.2s; }
@keyframes d2mrowhl { 0%, 100% { background: transparent; } 35% { background: rgba(110,242,155,0.22); box-shadow: 0 0 10px -2px rgba(110,242,155,0.6); } }
@media (prefers-reduced-motion: reduce) { .d2-mrow-1, .d2-mrow-2 { animation: none; } }
/* magnit-rack: yuqorida magnit-bar, ostida suzuvchi yuk */
/* v10: "sirli uzun tayoq" (magnit-rack relsi) OLIB TASHLANDI — yuk endi ikki toza
   YORLIQLI guruhda: "6" chipli kassetalar + "3" chipli batareyalar; chip+guruh
   yuk-xati qatori bilan bir vaqtda ketma-ket porlaydi (tushunarli sekvensiya). */
.d2-cargogrps { display: flex; align-items: flex-end; justify-content: center; gap: clamp(14px, 3.4vw, 26px); flex-wrap: wrap; }
.d2-cgrp { position: relative; display: inline-flex; flex-direction: column; align-items: center; gap: clamp(4px, 1vw, 8px); border-radius: 14px; padding: clamp(8px, 1.8vw, 12px); }
.d2-cgrp-1 { background: rgba(91,214,242,0.08); box-shadow: inset 0 0 0 1.5px rgba(91,214,242,0.35); animation: d2grpglow 1.4s ease 1s; }
.d2-cgrp-2 { background: rgba(255,194,60,0.08); box-shadow: inset 0 0 0 1.5px rgba(255,194,60,0.35); animation: d2grpglow 1.4s ease 4.2s; }
@keyframes d2grpglow { 0%, 100% { transform: scale(1); } 35% { transform: scale(1.04); box-shadow: inset 0 0 0 2px rgba(110,242,155,0.8), 0 0 16px -2px rgba(110,242,155,0.6); } }
.d2-cgrp-chip { display: inline-flex; align-items: center; justify-content: center; min-width: clamp(24px, 5.2vw, 34px); height: clamp(24px, 5.2vw, 34px); border-radius: 99px; font-weight: 800; font-size: clamp(15px, 3vw, 21px); padding: 0 8px; }
.d2-cgrp-chip-c { background: #EAF6FB; color: #017CA3; box-shadow: inset 0 0 0 1.5px rgba(1,154,203,0.4); }
.d2-cgrp-chip-b { background: #FFF4E0; color: #C77700; box-shadow: inset 0 0 0 1.5px rgba(199,119,0,0.35); }
.d2-cgrp-items { display: flex; flex-wrap: wrap; gap: clamp(3px, 0.8vw, 6px); justify-content: center; align-items: flex-end; max-width: clamp(150px, 38vw, 250px); }
.d2-cgrp-cass { width: clamp(24px, 5.2vw, 36px); height: auto; display: inline-block; }
.d2-cgrp-batt { width: clamp(11px, 2.4vw, 16px); height: auto; display: inline-block; }
@media (prefers-reduced-motion: reduce) { .d2-cgrp-1, .d2-cgrp-2 { animation: none; } }
/* raketa + olov (faqat s11 fakt) */
.d2-rocketsvg { width: clamp(44px, 9.5vw, 66px); height: auto; display: inline-block; filter: drop-shadow(0 4px 8px rgba(16,24,44,0.4)); }
.d2-rocket-fact { width: clamp(34px, 7vw, 48px); }
.d2-flame { transform-box: fill-box; transform-origin: center top; animation: d2flick 0.5s ease-in-out infinite alternate; }
@keyframes d2flick { 0% { transform: scaleY(0.85) scaleX(0.95); } 100% { transform: scaleY(1.12) scaleX(1.05); } }
@media (prefers-reduced-motion: reduce) { .d2-flame { animation: none; } }
/* s11 fakt: teskari sanash */
.d2-factrocket { flex: 0 0 auto; display: inline-flex; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.d2-cd { display: inline-flex; flex-direction: column; gap: 2px; align-items: flex-end; }
.d2-cd i { font-style: normal; font-weight: 800; color: #019ACB; line-height: 1; }
.d2-cd i:nth-child(1) { font-size: clamp(16px, 3vw, 22px); animation: d2neon 1.8s ease-in-out infinite; }
.d2-cd i:nth-child(2) { font-size: clamp(13px, 2.4vw, 18px); opacity: 0.75; animation: d2neon 1.8s ease-in-out 0.6s infinite; }
.d2-cd i:nth-child(3) { font-size: clamp(11px, 2vw, 15px); opacity: 0.55; animation: d2neon 1.8s ease-in-out 1.2s infinite; }
@media (prefers-reduced-motion: reduce) { .d2-cd i { animation: none; } }
/* s15 — v10 UCHISH SEKVENSIYASI (3 takt, animation-delay zanjiri, holatsiz):
   1) zaryad (0-2.5s): kassetalar dvigatel slotlariga dok, indikator to'ladi;
   2) ot oldirish (~2.6s): korpus tebranadi + dvigatel porlashi;
   3) uchish (4s+): warp-chiziqlar + sayyora uzoqlashadi. reduced-motion -> statik. */
.d2-launchseq { position: relative; width: 100%; display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.d2-warp-svgwrap { position: relative; width: 100%; max-width: clamp(240px, 62vw, 380px); }
.d2-warp-svg { width: 100%; height: auto; border-radius: 14px; display: block; }
/* 2-takt: korpus tebranishi — dvigatel ot olgach boshlanadi (2.6s dan) */
.d2-hullvib { animation: d2hull 0.18s ease-in-out 2.6s infinite; }
@keyframes d2hull { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(0.6px, -0.4px); } 75% { transform: translate(-0.5px, 0.5px); } }
/* dvigatel porlashi (pastdan) — 2.6s da yonadi, so'ng lipillaydi */
.d2-engglow { position: absolute; left: 12%; right: 12%; bottom: -4px; height: clamp(10px, 2.2vw, 16px); border-radius: 99px; background: radial-gradient(ellipse at center, rgba(110,242,155,0.85), rgba(110,242,155,0)); opacity: 0; animation: d2glowon 1s ease 2.6s forwards, d2neon 1.6s ease-in-out 3.6s infinite; }
@keyframes d2glowon { from { opacity: 0; } to { opacity: 1; } }
/* 3-takt: warp-chiziqlar (delay inline 4s+), sayyora 4s dan uzoqlashadi */
.d2-streak { animation: d2warpstreak 1.3s ease-in infinite; opacity: 0; }
@keyframes d2warpstreak {
  0%   { transform: translateY(0) scaleY(1); opacity: 0.9; }
  60%  { transform: translateY(26px) scaleY(9); opacity: 1; }
  100% { transform: translateY(60px) scaleY(16); opacity: 0; }
}
.d2-planet-recede { animation: d2recede 4s ease-in 4s forwards; transform-box: fill-box; transform-origin: center; }
@keyframes d2recede { 0% { transform: scale(1); opacity: 0.95; } 100% { transform: scale(0.35); opacity: 0.35; } }
/* 1-takt: dvigatel slot-qatori — kassetalar chapdan suzib dok qiladi, indikator yashilga to'ladi */
.d2-engrow { display: flex; align-items: center; gap: clamp(10px, 2.4vw, 16px); background: #EFE8D8; border-radius: 12px; box-shadow: inset 0 0 0 2px #D9CCB2; padding: clamp(6px, 1.4vw, 10px) clamp(10px, 2.2vw, 16px); }
.d2-engslots { display: inline-flex; gap: clamp(5px, 1.2vw, 8px); }
.d2-engslot { display: inline-flex; align-items: center; justify-content: center; width: clamp(26px, 5.6vw, 38px); height: clamp(34px, 7.4vw, 50px); border-radius: 8px; background: #F6F0E2; box-shadow: inset 0 0 0 1.5px #D9CCB2; overflow: hidden; }
.d2-engcass { display: inline-flex; animation: d2engdock 0.9s cubic-bezier(0.22, 0.9, 0.3, 1) both; }
.d2-engcass-svg { width: clamp(18px, 4vw, 27px); height: auto; display: inline-block; }
@keyframes d2engdock { 0% { transform: translateX(-34px); opacity: 0; } 70% { opacity: 1; } 100% { transform: translateX(0); opacity: 1; } }
.d2-engbar { position: relative; width: clamp(60px, 14vw, 100px); height: clamp(8px, 1.8vw, 12px); border-radius: 99px; background: #EAE0CC; box-shadow: inset 0 0 0 1.5px #D9CCB2; overflow: hidden; }
.d2-engfill { position: absolute; left: 0; top: 0; bottom: 0; width: 0; border-radius: 99px; background: linear-gradient(90deg, #2FA0CC, #6EF29B); animation: d2engfill 1.8s ease-out 0.5s forwards; }
@keyframes d2engfill { from { width: 0; } to { width: 100%; } }
/* old planda Bit bayram qiladi */
.d2-launch-bit { position: absolute; right: clamp(2px, 1vw, 10px); bottom: clamp(2px, 1vw, 10px); height: clamp(56px, 12.5vw, 86px); z-index: 3; animation: d2hover 6.5s ease-in-out infinite; pointer-events: none; }
.d2-launch-bit .g1-cast-fig { height: 100%; }
.d2-launch-bit .g1-char { height: 100%; width: auto; }
@media (prefers-reduced-motion: reduce) {
  .d2-hullvib, .d2-streak, .d2-planet-recede, .d2-engcass, .d2-engfill, .d2-engglow, .d2-launch-bit { animation: none; }
  .d2-engfill { width: 100%; }
  .d2-engglow { opacity: 0.8; }
}
/* === v4 — sSORT (tasniflash: tap-to-bin) === */
.d2-sortpool { display: flex; flex-wrap: wrap; gap: clamp(8px, 2vw, 14px); justify-content: center; align-items: center; }
.d2-sortitem { background: #FFFFFF; border: 2px solid #D9CCB2; border-radius: 12px; padding: clamp(6px, 1.4vw, 10px); cursor: pointer; transition: transform 0.15s, box-shadow 0.2s, border-color 0.2s; display: inline-flex; box-shadow: 0 4px 12px -6px rgba(58,53,48,0.18); }
.d2-sortitem .d2-casssvg { width: clamp(30px, 6.5vw, 46px); }
.d2-sortitem .d2-battsvg { width: clamp(15px, 3.2vw, 21px); }
.d2-sortitem:hover:not(:disabled) { transform: translateY(-2px); }
.d2-sortitem-sel { border-color: #FF4F28; box-shadow: 0 0 14px -2px rgba(255,79,40,0.5); }
.d2-sortitem:disabled { cursor: default; }
.d2-sortdone { font-weight: 800; font-size: clamp(30px, 7vw, 46px); color: #6EF29B; }
.d2-holds { display: flex; gap: clamp(10px, 2.4vw, 18px); justify-content: center; align-items: stretch; }
.d2-hold { flex: 1 1 0; max-width: 260px; min-height: clamp(78px, 17vw, 110px); background: #FFFFFF; border: 2.5px dashed #A7A6A2; border-radius: 16px; padding: clamp(8px, 1.8vw, 12px); display: flex; flex-direction: column; align-items: center; gap: clamp(4px, 1vw, 8px); cursor: pointer; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; }
.d2-hold-armed { border-color: #5BD6F2; background: #F2FBFE; }
.d2-hold-armed:hover:not(:disabled) { box-shadow: 0 0 14px -3px rgba(91,214,242,0.6); }
.d2-hold-ok { border-style: solid; border-color: #1F7A4D; background: #E3F0E8; cursor: default; }
.d2-hold-wrong { border-color: #D8A93A; background: #FBF3D6; animation: d2holdnudge 0.45s ease; }
@keyframes d2holdnudge { 0%,100% { transform: translateX(0); } 30% { transform: translateX(-4px); } 60% { transform: translateX(4px); } }
.d2-hold:disabled { cursor: default; }
.d2-hold-label { font-weight: 800; font-size: clamp(11px, 1.6vw, 13px); letter-spacing: 0.08em; color: #5A5A60; }
.d2-hold-ok .d2-hold-label { color: #1F7A4D; }
.d2-hold-slot { flex: 1; display: flex; flex-wrap: wrap; gap: 3px; align-items: center; justify-content: center; min-height: clamp(28px, 6vw, 42px); }
.d2-hold-chip .d2-casssvg-btn { width: clamp(18px, 4vw, 28px); }
.d2-hold-chip .d2-battsvg-btn { width: clamp(10px, 2.2vw, 15px); }
.d2-hold-count { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(16px, 2.6vw, 22px); color: #A7A6A2; }
.d2-hold-count.on { color: #1F7A4D; }
@media (prefers-reduced-motion: reduce) { .d2-hold-wrong { animation: none; } }
/* === v4 — sDIAG (diagnostika: ketma-ket sub) === */
.d2-diag-head { display: flex; align-items: center; justify-content: space-between; }
.d2-diag-title { font-weight: 800; font-size: clamp(11px, 1.5vw, 13px); letter-spacing: 0.14em; text-transform: uppercase; color: #017CA3; }
.d2-diag-prog { font-weight: 800; font-size: clamp(13px, 1.8vw, 15px); color: #5A5A60; }
.d2-diag-panel-ok { box-shadow: 0 0 0 2px #1F7A4D, 0 8px 22px -6px rgba(31,122,77,0.3) !important; background: #F1FAF4 !important; }
.d2-diag-rows { display: flex; flex-direction: column; gap: clamp(6px, 1.4vw, 10px); }
.d2-diag-done { display: flex; align-items: center; gap: 10px; background: #E3F0E8; border-radius: 10px; padding: clamp(6px, 1.3vw, 9px) clamp(10px, 2vw, 14px); }
.d2-diag-check { width: clamp(18px, 3vw, 22px); height: clamp(18px, 3vw, 22px); border-radius: 50%; background: #1F7A4D; color: #fff; font-weight: 800; font-size: clamp(11px, 1.6vw, 14px); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.d2-diag-donetxt { font-weight: 700; font-size: clamp(13px, 1.8vw, 15px); color: #1F7A4D; }
.d2-diag-active { display: flex; flex-direction: column; gap: clamp(8px, 1.8vw, 12px); background: #FBF9F4; border-radius: 12px; padding: clamp(10px, 2vw, 14px); box-shadow: inset 0 0 0 2px rgba(1,154,203,0.25); }
.d2-diag-q { margin: 0; text-align: center; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(15px, 2.1vw, 18px); color: #0E0E10; }
.d2-diag-opts { display: flex; gap: clamp(8px, 2vw, 14px); justify-content: center; flex-wrap: wrap; }
.d2-tapbtn { background: #FFFFFF; border: none; border-radius: 14px; cursor: pointer; padding: clamp(8px, 1.8vw, 12px) clamp(16px, 3.4vw, 26px); box-shadow: 0 6px 16px -6px rgba(58,53,48,0.2); transition: transform 0.15s, box-shadow 0.15s, opacity 0.2s; }
.d2-tapbtn:hover:not(:disabled) { transform: translateY(-2px); }
.d2-tapbtn-wrong { opacity: 0.32; box-shadow: inset 0 0 0 2px #E7C46B; cursor: default; }
.d2-tapbtn:disabled { cursor: default; }
.d2-tapnum { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(24px, 5vw, 34px); line-height: 1; color: #0E0E10; }
/* === v4 — sCMP (taqqoslash: ikki kema) === */
.d2-cmp { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 2.4vw, 20px); flex-wrap: nowrap; }
.d2-cmp-ship { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); padding: clamp(8px, 1.8vw, 12px); border-radius: 14px; border: 2px solid transparent; transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s; }
.d2-cmp-win { border-color: #6EF29B; box-shadow: 0 0 18px -3px rgba(110,242,155,0.7); transform: translateY(-3px); }
.d2-shipsvg { width: clamp(96px, 24vw, 150px); height: auto; display: block; filter: drop-shadow(0 4px 8px rgba(16,24,44,0.4)); }
.d2-cmp-vs { font-weight: 800; font-size: clamp(22px, 4.6vw, 32px); color: #A7A6A2; }
/* === v4 — sERR (xatoni-top: ko'rsatkich qatorlari) === */
.d2-readout { display: flex; align-items: center; gap: clamp(6px, 1.4vw, 10px); flex-wrap: wrap; justify-content: center; width: 100%; }
.d2-readout-n { font-weight: 800; font-size: clamp(22px, 4.6vw, 32px); color: #0E0E10; min-width: 1.6em; text-align: right; }
.d2-readout-eq { font-weight: 800; font-size: clamp(18px, 3.4vw, 24px); color: #A7A6A2; }
.d2-readout-part { display: inline-flex; align-items: baseline; gap: 4px; font-size: clamp(13px, 1.9vw, 16px); color: #5A5A60; }
.d2-readout-part b { font-size: clamp(19px, 3.6vw, 26px); color: #0E0E10; }
.option .d2-readout-n, .option .d2-readout-part b { color: #0E0E10; }
.option-correct .d2-readout-n, .option-correct .d2-readout-part b, .option-correct .d2-readout-part, .option-correct .d2-readout-eq { color: #1F7A4D !important; }
/* === v5 — sPANEL (bort testi: har sub o'z figurasi + reveal payoff) === */
.d2-panel-fig { display: flex; justify-content: center; padding: clamp(4px, 1vw, 8px) 0; }
.d2-panel-reveal { display: flex; align-items: center; justify-content: center; padding: clamp(8px, 2vw, 14px) 0; min-height: clamp(60px, 13vw, 90px); }
.d2-err-found { display: inline-flex; align-items: center; gap: clamp(8px, 2vw, 14px); background: #E3F0E8; border-radius: 12px; padding: clamp(8px, 1.6vw, 12px) clamp(12px, 2.4vw, 18px); box-shadow: inset 0 0 0 2px #1F7A4D; }
.d2-err-badge { width: clamp(22px, 4vw, 28px); height: clamp(22px, 4vw, 28px); border-radius: 50%; background: #1F7A4D; color: #fff; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.d2-err-found .d2-readout-n, .d2-err-found .d2-readout-part b { color: #1F7A4D; }
/* === v5 — sCASE (yuk xati: kontekst + savol bitta ekranда) === */
.d2-case-ctx { margin: 0; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(14px, 2vw, 17px); line-height: 1.3; color: #0E0E10; }
/* === v7/v10 — s14 FINAL: haqiqiy devor-TABLO (bezel + boltlar + porlovchi sarlavha + skanline) === */
.d2-tablo { position: relative; width: 100%; max-width: clamp(280px, 74vw, 460px); margin: 0 auto; background: linear-gradient(#F3EBDA, #E8DEC9); border-radius: 16px; box-shadow: inset 0 0 0 3px #D9CCB2, inset 0 2px 6px rgba(255,255,255,0.5), 0 10px 26px -10px rgba(58,53,48,0.3); padding: clamp(10px, 2.2vw, 16px); }
.d2-tablo-bolt { position: absolute; width: clamp(6px, 1.3vw, 9px); height: clamp(6px, 1.3vw, 9px); border-radius: 50%; background: radial-gradient(circle at 35% 35%, #AEBEC9, #55697C); box-shadow: inset 0 -1px 1px rgba(0,0,0,0.5); }
.d2-tb1 { left: 6px; top: 6px; }
.d2-tb2 { right: 6px; top: 6px; }
.d2-tb3 { left: 6px; bottom: 6px; }
.d2-tb4 { right: 6px; bottom: 6px; }
.d2-tablo-head { display: flex; align-items: center; justify-content: center; gap: clamp(6px, 1.4vw, 10px); padding-bottom: clamp(6px, 1.4vw, 10px); margin-bottom: clamp(6px, 1.4vw, 10px); border-bottom: 2px solid rgba(58,71,99,0.22); box-shadow: 0 8px 12px -11px rgba(58,53,48,0.4); }
.d2-tablo-plus { font-weight: 800; font-size: clamp(14px, 2.8vw, 19px); color: #5A6B88; }
.d2-tablo-lamp { width: clamp(8px, 1.7vw, 12px); height: clamp(8px, 1.7vw, 12px); border-radius: 50%; background: #6EF29B; box-shadow: 0 0 8px rgba(110,242,155,0.85); animation: d2neon 2.2s ease-in-out infinite; margin-left: clamp(6px, 1.4vw, 10px); }
/* displey-oyna: ichida yuk-o'qish + skanline (ekran bo'lib o'qilsin) */
.d2-tablo-screen { position: relative; border-radius: 10px; background: #F6F0E2; box-shadow: inset 0 0 0 2px #D9CCB2; padding: clamp(10px, 2.2vw, 16px); overflow: hidden; }
.d2-tablo-screen .d2-casssvg { width: clamp(26px, 5.6vw, 40px); }
.d2-tablo-screen .d2-battsvg { width: clamp(10px, 2.2vw, 15px); }
.d2-tablo-screen .g1-anspop-num { color: #1F7A4D; }
.d2-tablo-screen .g1-anspop-eq { color: #5A6B88; }
.d2-tablo-scan { position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(180deg, rgba(58,71,99,0.025) 0 2px, transparent 2px 4px); }
.d2-tablo-scan::after { content: ''; position: absolute; left: 0; right: 0; height: 18%; background: linear-gradient(rgba(143,224,244,0), rgba(143,224,244,0.1), rgba(143,224,244,0)); animation: d2scan 4.5s linear infinite; }
@keyframes d2scan { 0% { top: -20%; } 100% { top: 120%; } }
@media (prefers-reduced-motion: reduce) { .d2-tablo-lamp, .d2-tablo-scan::after { animation: none; } }
/* FactCard s14 javob zonasida — ixcham (bir qator), skrollsiz */
.d2-fact-final { margin-top: clamp(8px, 1.8vw, 12px); padding: clamp(8px, 1.6vw, 12px) clamp(10px, 2vw, 14px); }
.d2-fact-final .g1-factcard-txt { font-size: clamp(13px, 1.8vw, 15px); line-height: 1.36; }
.d2-fact-final .d2-rocket-fact { width: clamp(30px, 6.5vw, 44px); }
/* === v10 — s8 pult-tugmalari: predmet-ikonkali, rangli (kasseta=moviy, batareya=amber) === */
.d2-conbtn { display: inline-flex; align-items: center; gap: clamp(7px, 1.6vw, 11px); border: none; border-radius: 14px; cursor: pointer; padding: clamp(10px, 2vw, 14px) clamp(13px, 2.6vw, 20px); font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(14px, 2vw, 17px); color: #1F2430; transition: transform 0.15s, box-shadow 0.2s, filter 0.2s; }
.d2-conbtn-ic { width: clamp(20px, 4.4vw, 30px); height: auto; display: inline-block; }
.d2-conbtn-icb { width: clamp(13px, 2.8vw, 19px); height: auto; display: inline-block; }
.d2-conbtn-lbl { line-height: 1; }
.d2-conbtn-cass { background: #FFFFFF; box-shadow: inset 0 0 0 2px #2AA9D0, 0 6px 16px -6px rgba(58,53,48,0.2); }
.d2-conbtn-batt { background: #FFFFFF; box-shadow: inset 0 0 0 2px #F0A81E, 0 6px 16px -6px rgba(58,53,48,0.2); }
.d2-conbtn:hover:not(:disabled) { transform: translateY(-2px); }
.d2-conbtn-cass:active:not(:disabled) { box-shadow: inset 0 0 0 2px #2AA9D0, 0 0 16px -4px rgba(42,169,208,0.55); }
.d2-conbtn-batt:active:not(:disabled) { box-shadow: inset 0 0 0 2px #F0A81E, 0 0 16px -4px rgba(240,168,30,0.55); }
.d2-conbtn:disabled { opacity: 0.38; cursor: default; filter: saturate(0.5); }
/* minus — mos rangli kichik dumaloq */
.d2-conbtn-minus { width: clamp(34px, 7vw, 44px); border: none; border-radius: 12px; cursor: pointer; font-weight: 800; font-size: clamp(18px, 3.6vw, 24px); line-height: 1; color: #5A6B88; background: #FFFFFF; box-shadow: 0 4px 12px -6px rgba(58,53,48,0.18); transition: transform 0.15s, box-shadow 0.2s; }
.d2-conbtn-minus-c { box-shadow: inset 0 0 0 1.5px rgba(42,169,208,0.5), 0 4px 12px -6px rgba(58,53,48,0.18); }
.d2-conbtn-minus-b { box-shadow: inset 0 0 0 1.5px rgba(240,168,30,0.55), 0 4px 12px -6px rgba(58,53,48,0.18); }
.d2-conbtn-minus:hover:not(:disabled) { transform: translateY(-2px); }
.d2-conbtn-minus:disabled { opacity: 0.35; cursor: default; }
/* Tekshirish — konsol GO-tugmasi (manba-tugmalardan aniq farqli, yashil) */
.d2-gobtn { border: none; border-radius: 99px; cursor: pointer; padding: clamp(11px, 2.2vw, 15px) clamp(26px, 5vw, 40px); font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(15px, 2.2vw, 18px); letter-spacing: 0.04em; color: #0B2A1A; background: linear-gradient(#8FF7B6, #5BE08E); box-shadow: inset 0 -2px 4px rgba(0,0,0,0.15), inset 0 2px 3px rgba(255,255,255,0.5), 0 8px 20px -6px rgba(110,242,155,0.65); transition: transform 0.15s, box-shadow 0.2s; }
.d2-gobtn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 26px -6px rgba(110,242,155,0.8); }
.d2-gobtn:disabled { opacity: 0.4; cursor: not-allowed; filter: saturate(0.4); }
/* === v8 — «UCHISHGA TAYYORLIK» missiya-shkalasi (dars-ichi, INFRA'дан tashqarida) === */
/* O'ng gutterда ixcham vertikal quvvat-shkala; markazда vertikal (nav/audio/javob bilan urishmaydi).
   pointer-events yo'q; skroll qo'shmaydi; Stage progress-baridan FARQLI (thematik). */
.d2-gauge { position: absolute; right: clamp(1px, 0.6vw, 8px); top: 50%; transform: translateY(-50%); z-index: 6; pointer-events: none; display: flex; flex-direction: column; align-items: center; gap: 8px; height: clamp(210px, 58vh, 370px); }
.d2-gauge-label { writing-mode: vertical-rl; text-orientation: mixed; font-size: clamp(9px, 1.4vw, 12px); letter-spacing: 0.16em; text-transform: uppercase; font-weight: 700; color: #5A6B88; opacity: 0.85; }
.d2-gauge-track { position: relative; flex: 1; width: clamp(6px, 1.3vw, 9px); border-radius: 99px; background: #E0D7C4; box-shadow: inset 0 0 0 1px #D0C4AB; overflow: visible; }
.d2-gauge-fill { position: absolute; left: 0; right: 0; bottom: 0; border-radius: 99px; background: linear-gradient(180deg, #6EF29B, #2FA0CC); box-shadow: 0 0 8px rgba(110,242,155,0.55); transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
.d2-gauge-rocket { position: absolute; left: 50%; transform: translate(-50%, 50%); width: clamp(22px, 4.6vw, 34px); transition: bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
.d2-gauge-rocket .d2-rocketsvg { width: 100%; filter: drop-shadow(0 2px 4px rgba(16,24,44,0.5)); }
/* C — yo'l xaritasi: vertikal marshrut (Yer past → Bit uyi tepa), planeta-nuqtalar */
.d2-jroute { position: relative; flex: 1; width: clamp(30px, 6.4vw, 44px); }
.d2-jroute::before { content: ''; position: absolute; left: 50%; top: 12px; bottom: 10px; width: 3px; transform: translateX(-50%); background: #D0C4AB; border-radius: 2px; }
.d2-jplanet { position: absolute; left: 50%; transform: translate(-50%, 50%); width: clamp(17px, 3.8vw, 24px); line-height: 0; filter: drop-shadow(0 1px 2px rgba(58,53,48,0.34)); }
.d2-jplanet svg { width: 100%; height: auto; display: block; overflow: visible; }
.d2-jplanet-cur { width: clamp(22px, 4.8vw, 30px); filter: drop-shadow(0 0 7px rgba(80,155,215,0.9)) drop-shadow(0 1px 2px rgba(58,53,48,0.34)); }
.d2-jhome { position: absolute; left: 50%; top: -10px; transform: translateX(-50%); font-size: clamp(17px, 3.4vw, 24px); line-height: 1; }
/* juda tor ekranда (mobil zoom-qatlam <=640) yozuv olib tashlanadi — faqat shkala + raketa */
@media (max-width: 639.98px) { .d2-gauge { height: clamp(180px, 46vh, 280px); } .d2-gauge-label { display: none; } }
@media (prefers-reduced-motion: reduce) { .d2-gauge-fill, .d2-gauge-rocket { transition: none; } }
/* ============================================================ */
/* LUMO (grade3 Dars01) — chiroq/lenta/panel, shahar, razryad-mat */
/* ============================================================ */
.lm-bignum { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(30px, 7vw, 48px); color: #3A3530; letter-spacing: 1px; }
.lm-bignum-accent { color: #ff4f28; }
.lm-motes { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.lm-mote { position: absolute; left: calc(6% + var(--i, 0) * 11%); bottom: -12px; width: 5px; height: 5px; border-radius: 50%; background: radial-gradient(circle at 40% 35%, #FFF2C6, #FF8A22); opacity: 0.68; animation: lm-mote-rise 14s linear infinite; }
.lm-mote:nth-child(2n) { left: 18%; }
.lm-mote:nth-child(3n) { left: 74%; }
.lm-mote:nth-child(4n) { left: 44%; }
.lm-mote:nth-child(5n) { left: 88%; }
@keyframes lm-mote-rise { 0% { transform: translateY(0); opacity: 0; } 12% { opacity: 0.5; } 100% { transform: translateY(-102vh); opacity: 0; } }
.lm-chiroq { width: clamp(15px, 3vw, 20px); height: auto; display: block; }
.lm-lenta { width: clamp(74px, 15vw, 96px); height: auto; display: block; }
.lm-panel { width: clamp(58px, 12vw, 80px); height: auto; display: block; }
.lm-panel-big { width: clamp(74px, 18vw, 104px); }
.lm-pv { display: flex; align-items: flex-end; justify-content: center; gap: clamp(8px, 2vw, 16px); flex-wrap: wrap; position: relative; padding: 6px; }
.lm-pv-sm { transform: scale(0.9); }
.lm-pv-grp { display: inline-flex; align-items: flex-end; gap: 4px; flex-wrap: wrap; max-width: 210px; }
.lm-pv-ones { max-width: 130px; }
.lm-pv-item { display: inline-flex; }
.lm-pv-empty { font-family: 'JetBrains Mono', monospace; font-size: clamp(28px, 6vw, 40px); font-weight: 800; color: #B8B2A8; }
.lm-mat { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(6px, 1.6vw, 12px); width: 100%; max-width: 460px; }
.lm-mat-col { display: flex; flex-direction: column; align-items: center; gap: 6px; border-radius: 14px; padding: clamp(6px, 1.4vw, 10px) 4px; background: #FBF7F0; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.06); transition: box-shadow 0.25s, background 0.25s; }
.lm-mat-emph { background: #FFF3E9; box-shadow: 0 4px 14px -6px rgba(255,79,40,0.45), inset 0 0 0 1.5px rgba(255,79,40,0.5); }
.lm-mat-head { font-size: clamp(9px, 1.5vw, 11px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; text-align: center; }
.lm-mat-cell { display: flex; flex-direction: column; align-items: center; gap: 6px; min-height: 40px; justify-content: flex-end; }
.lm-mat-zero { font-family: 'JetBrains Mono', monospace; font-size: clamp(18px, 3.4vw, 24px); font-weight: 800; color: #C4BEB4; }
.lm-mat-digit { font-family: 'JetBrains Mono', monospace; font-size: clamp(22px, 4.4vw, 32px); font-weight: 800; color: #3A3530; }
.lm-mat-digit-btn { border: none; background: #FFFFFF; border-radius: 10px; padding: 4px 12px; cursor: pointer; box-shadow: 0 2px 8px -4px rgba(58,53,48,0.3); transition: transform 0.12s, box-shadow 0.2s; }
.lm-mat-digit-btn:hover { transform: translateY(-1px); }
.lm-mat-digit-ok { background: #E9F7EE; color: #1F7A4D; box-shadow: 0 4px 12px -4px rgba(31,122,77,0.5); }
.lm-mat-panel { width: clamp(40px, 9vw, 56px); }
.lm-mat-lenta { width: clamp(52px, 11vw, 72px); }
.lm-mat-chiroq { width: clamp(13px, 2.6vw, 17px); }
/* Sahna balandligi DERAZAdan qolgan joyga moslashadi (nisbat saqlanadi): javob berilgach
   feedback ochilganda past ekranda skroll paydo bo'lmasin. 570px — sahnadan tashqari
   doimiy qism (sarlavha, savol, variantlar, tahlil, header/footer) uchun budjet.
   Baland ekranda 372px cheki ishlaydi — sahna kichraymaydi. Telefonda 100% yutadi. */
.lm-scene-bg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.lm-scene-cast { position: absolute; left: 0; right: 0; bottom: 2%; display: flex; align-items: flex-end; justify-content: center; gap: clamp(1px, 0.8vw, 8px); z-index: 2; padding: 0 3%; }
.lm-crew { display: inline-flex; align-items: flex-end; }
.lm-crew-kid { height: clamp(72px, 17vw, 122px); }
.lm-crew-kid .g1-char { height: 100%; width: auto; display: block; }
.lm-crew-host { width: clamp(42px, 10vw, 66px); margin: 0 clamp(2px, 1vw, 8px); }
.lm-crew-host .g1-cast-fig { width: 100%; height: auto; }
/* Desktopda personaj o'lchami SAHNA qutisiga bog'lanadi (vw emas): sahna kichrayganda
   qahramonlar ham kichrayadi va kesilmaydi. Nisbatlar to'liq sahnadagi (708x372) kabi:
   bola 122/372 = 33cqh, Bit 66/708 = 9.3cqw, oraliq 8/708 = 1.1cqw.
   Telefonda (< 720px) eski vw-qoidalar o'z holida qoladi — mobil ko'rinish o'zgarmaydi. */
@media (min-width: 720px) {
  .lm-scene { container-type: size; }
  .lm-scene-cast { gap: 1.1cqw; }
  .lm-crew-kid { height: 33cqh; }
  .lm-crew-host { width: 9.3cqw; margin: 0 1.1cqw; }
}
.lm-cstar { animation: lm-tw 3.4s ease-in-out infinite; }
@keyframes lm-tw { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
.lm-cwin { animation: lm-flick 4s ease-in-out infinite; }
@keyframes lm-flick { 0%, 100% { opacity: 0.68; } 50% { opacity: 1; } }
.lm-glow { animation: lm-glow-a 2.8s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes lm-glow-a { 0%, 100% { opacity: 0.72; } 50% { opacity: 1; } }
.lm-float { animation: lm-float-a 5.5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes lm-float-a { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(8deg); } }
.lm-fly { animation: lm-fly-a 7s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes lm-fly-a { 0% { transform: translate(0, 0); } 25% { transform: translate(10px, -4px); } 50% { transform: translate(20px, 2px); } 75% { transform: translate(10px, -3px); } 100% { transform: translate(0, 0); } }
/* Video-uslub silliq ochilish (sekin fade + siljish, ovozga sinxron bosqichma-bosqich) */
.lm-reveal { animation: lm-reveal-a 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
.lm-write { display: inline-block; animation: lm-reveal-a 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
@keyframes lm-reveal-a { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }
.lm-d1 { animation-delay: 0.28s; }
.lm-d2 { animation-delay: 0.56s; }
.lm-d3 { animation-delay: 0.84s; }
/* raqam yuqoridan sakrab tushadi (video-harakat) */
.lm-drop { display: inline-block; animation: lm-drop-a 0.62s cubic-bezier(0.34, 1.5, 0.5, 1) both; }
@keyframes lm-drop-a { 0% { opacity: 0; transform: translateY(-32px) scale(0.8); } 60% { opacity: 1; } 100% { opacity: 1; transform: translateY(0) scale(1); } }
.lm-fadein { display: inline-block; animation: lm-fadein-a 0.4s ease both; }
@keyframes lm-fadein-a { 0% { opacity: 0; transform: scale(0.6); } 100% { opacity: 1; transform: scale(1); } }
.lm-nl-cue { position: absolute; top: 50%; transform: translateX(-50%); z-index: 3; pointer-events: none; display: flex; flex-direction: column; align-items: center; }
.lm-nl-ring { width: 16px; height: 16px; border-radius: 50%; border: 2.5px solid #F0A81E; margin-bottom: 4px; animation: lm-nl-ring-a 1.4s ease-out infinite; }
@keyframes lm-nl-ring-a { 0% { transform: scale(0.7); opacity: 0.9; } 70% { transform: scale(1.5); opacity: 0; } 100% { opacity: 0; } }
.lm-nl-finger { font-size: clamp(20px, 5vw, 28px); line-height: 1; animation: lm-nl-finger-a 1.3s ease-in-out infinite; }
@keyframes lm-nl-finger-a { 0%, 100% { transform: translateY(3px); } 50% { transform: translateY(-4px); } }
@media (prefers-reduced-motion: reduce) { .lm-cstar, .lm-cwin, .lm-glow, .lm-float, .lm-fly, .lm-nl-ring, .lm-nl-finger { animation: none; } }
.lm-field { position: relative; width: 100%; aspect-ratio: 400 / 250; border-radius: 12px; overflow: hidden; }
.lm-flenta { position: absolute; width: clamp(60px, 13vw, 88px); border: none; background: transparent; padding: 0; cursor: pointer; transform: rotate(var(--r, 0deg)); animation: lm-fl-in 0.5s both; z-index: 2; transition: transform 0.15s; }
.lm-flenta:hover { transform: rotate(var(--r, 0deg)) scale(1.06); }
@keyframes lm-fl-in { from { opacity: 0; transform: rotate(var(--r,0deg)) scale(0.6); } to { opacity: 1; } }
.lm-panelzone { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; gap: 6px; background: rgba(20,14,34,0.55); border-radius: 14px; padding: 10px 14px; z-index: 3; }
.lm-panelzone-tied { box-shadow: 0 0 24px -4px rgba(255,184,77,0.7); }
.lm-slotgrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 3px; }
.lm-slot { width: clamp(30px, 6vw, 44px); height: clamp(8px, 1.8vw, 11px); border-radius: 4px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; }
.lm-slot-full { background: transparent; }
.lm-lenta-slot { width: clamp(30px, 6vw, 44px); }
.lm-count { font-size: clamp(12px, 2.2vw, 15px); font-weight: 800; color: #FFE7B0; }
.lm-count-ok { color: #6EF29B; }
.lm-bob { animation: lm-bob-a 2.4s ease-in-out infinite; }
@keyframes lm-bob-a { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
.lm-srcrow { display: flex; gap: clamp(8px, 2vw, 14px); flex-wrap: wrap; justify-content: center; }
.lm-srcbtn { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: clamp(8px, 1.6vw, 12px) clamp(10px, 2vw, 16px); font-weight: 700; font-size: clamp(12px, 1.7vw, 14px); }
.lm-src-wait { opacity: 0.45; }
.lm-src-ico { width: clamp(26px, 5.5vw, 38px); height: auto; }
.lm-ctrl { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.lm-ctrl-ico { width: clamp(26px, 5.5vw, 38px); display: inline-flex; }
.lm-ctrl-btn { width: clamp(30px, 6vw, 38px); height: clamp(30px, 6vw, 38px); border: none; border-radius: 10px; background: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 800; color: #ff4f28; cursor: pointer; box-shadow: 0 2px 8px -4px rgba(58,53,48,0.3); }
.lm-ctrl-btn:disabled { opacity: 0.35; cursor: default; }
.lm-eq { color: #3A3530; }
/* Missiya-karta (s0/s15) — dars maqsadi */
.lm-mission { display: flex; align-items: center; gap: clamp(8px, 1.8vw, 12px); background: #FFF6DC; border: 1.5px solid #E8CB7A; border-radius: 12px; padding: clamp(8px, 1.8vw, 12px) clamp(12px, 2.4vw, 18px); font-weight: 700; color: #5A5A60; font-size: clamp(12px, 1.7vw, 15px); }
.lm-mission-ico { font-size: clamp(18px, 3vw, 24px); line-height: 1; }
/* Savol-slayd fon-animatsiyasi: shahar chiroq-uchqunlari frame ichida ko'tarilib porlaydi */
.lm-fx { position: absolute; inset: 0; pointer-events: none; overflow: hidden; border-radius: inherit; z-index: 0; }
.lm-fx i { position: absolute; bottom: -8px; width: 7px; height: 7px; border-radius: 50%; background: radial-gradient(circle at 38% 32%, #FFF6D2, #FFC63F 60%, rgba(255,138,30,0)); opacity: 0; animation: lm-fx-rise 7s linear infinite; }
.lm-fx i:nth-child(1) { left: 8%; animation-delay: 0s; }
.lm-fx i:nth-child(2) { left: 24%; animation-delay: 2.4s; animation-duration: 8.5s; }
.lm-fx i:nth-child(3) { left: 55%; animation-delay: 1.2s; animation-duration: 7.6s; }
.lm-fx i:nth-child(4) { left: 76%; animation-delay: 3.6s; }
.lm-fx i:nth-child(5) { left: 91%; animation-delay: 0.8s; animation-duration: 9s; }
@keyframes lm-fx-rise { 0% { transform: translateY(0) scale(0.7); opacity: 0; } 12% { opacity: 0.55; } 55% { opacity: 0.4; } 100% { transform: translateY(-160px) scale(1.1); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .lm-fx i { animation: none; } }
/* Hisob-karta (sCASE) — qog'oz-hisobot ko'rinishi */
.lm-report { display: flex; flex-direction: column; gap: clamp(5px, 1.2vw, 8px); background: #FFFDF8; border: 1.5px solid #E4D9C4; border-top: 6px solid #FF4F28; border-radius: 12px; padding: clamp(10px, 2vw, 16px) clamp(16px, 3.4vw, 26px); box-shadow: 0 6px 16px -8px rgba(58,53,48,0.25); }
.lm-report-head { text-transform: uppercase; letter-spacing: 2px; font-size: clamp(10px, 1.4vw, 12px); font-weight: 800; color: #A7A6A2; text-align: center; }
.lm-report-cols { display: flex; gap: clamp(14px, 3.4vw, 28px); justify-content: center; }
.lm-report-col { display: flex; flex-direction: column; align-items: center; gap: clamp(4px, 1vw, 7px); }
.lm-report-n { width: clamp(36px, 8vw, 48px); height: clamp(36px, 8vw, 48px); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: clamp(19px, 3.6vw, 25px); font-weight: 800; }
.lm-report-lbl { font-weight: 700; color: #5A5A60; font-size: clamp(11px, 1.6vw, 14px); }
.lm-digrow { display: flex; gap: clamp(6px, 1.6vw, 12px); perspective: 500px; }
.lm-cardflip { animation: lm-cardflip-a 0.55s cubic-bezier(0.3, 0.9, 0.4, 1) both; transform-origin: center; backface-visibility: hidden; }
@keyframes lm-cardflip-a { 0% { transform: rotateY(-90deg); opacity: 0; } 55% { opacity: 1; } 100% { transform: rotateY(0); opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .lm-cardflip { animation: none; } }
.lm-digcard { width: clamp(38px, 8vw, 54px); height: clamp(48px, 10vw, 68px); display: flex; align-items: center; justify-content: center; border-radius: 12px; background: #FBF7F0; font-size: clamp(24px, 5vw, 36px); font-weight: 800; color: #3A3530; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.08); }
.lm-digcard-hot { background: #FFF3E9; color: #ff4f28; box-shadow: 0 4px 14px -6px rgba(255,79,40,0.5); }
/* Raqam o'z rangini olib yuradi — o'rin almashganda kuzatish oson (3 qizil, 4 yashil, 5 ko'k) */
.lm-dig-3 { background: #FBE9E7; color: #C0392B; box-shadow: 0 4px 12px -6px rgba(192,57,43,0.45); }
.lm-dig-4 { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 4px 12px -6px rgba(31,122,77,0.45); }
.lm-dig-5 { background: #E3F2F8; color: #019ACB; box-shadow: 0 4px 12px -6px rgba(1,154,203,0.45); }
.lm-nl { position: relative; height: 64px; margin: 0 10px; cursor: pointer; }
.lm-nl-line { position: absolute; left: 0; right: 0; top: 28px; height: 4px; border-radius: 2px; background: linear-gradient(90deg, #F2A65A, #ff4f28); }
.lm-nl-tick { position: absolute; top: 20px; width: 2px; height: 20px; background: rgba(58,53,48,0.35); transform: translateX(-1px); }
.lm-nl-lbl { position: absolute; top: 22px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 700; color: #8A8378; }
.lm-nl-mark { position: absolute; top: 6px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; }
.lm-nl-mark::after { content: ''; width: 3px; height: 34px; background: currentColor; }
.lm-nl-target { color: #1F7A4D; }
.lm-nl-guess { color: #D64545; }
.lm-nl-flag { font-size: 12px; font-weight: 800; margin-bottom: 2px; }
.lm-figwrap { display: flex; justify-content: center; padding: 6px 0; }
.lm-cmprow { display: flex; align-items: center; justify-content: center; gap: clamp(12px, 3vw, 24px); }
.lm-cmpcell { padding: clamp(8px, 2vw, 14px) clamp(14px, 3vw, 22px); border-radius: 14px; background: #FBF7F0; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.07); }
.lm-cmpvs { font-size: clamp(20px, 4vw, 28px); font-weight: 800; color: #8A8378; }
.lm-cmpslot { font-size: clamp(30px, 8vw, 46px); font-weight: 800; color: #A7A6A2; min-width: clamp(38px, 10vw, 58px); text-align: center; line-height: 1; }
.lm-sign-in { display: inline-block; color: #FF4F28; animation: lm-sign-a 0.6s cubic-bezier(0.34, 1.6, 0.5, 1) both; }
@keyframes lm-sign-a { 0% { opacity: 0; transform: scale(0.2) rotate(-14deg); } 60% { opacity: 1; } 100% { opacity: 1; transform: scale(1) rotate(0); } }
.lm-cmp-big { animation: lm-cmp-big-a 0.7s ease both; border-radius: 14px; }
@keyframes lm-cmp-big-a { 0% { transform: scale(1); } 45% { transform: scale(1.14); box-shadow: 0 0 0 3px rgba(31,122,77,0.4), inset 0 0 0 1px rgba(58,53,48,0.07); } 100% { transform: scale(1.07); box-shadow: 0 0 0 2px rgba(31,122,77,0.35), inset 0 0 0 1px rgba(58,53,48,0.07); } }
.lm-signrow { display: flex; gap: clamp(10px, 3vw, 20px); justify-content: center; }
.lm-signbtn { width: clamp(52px, 14vw, 68px); height: clamp(52px, 14vw, 68px); border-radius: 16px; border: 2.5px solid #A7A6A2; background: #FFFFFF; font-size: clamp(26px, 7vw, 34px); font-weight: 800; color: #0E0E10; cursor: pointer; transition: transform 0.15s, border-color 0.15s; }
.lm-signbtn:hover:not(:disabled) { border-color: #FF4F28; transform: translateY(-2px); }
.lm-signbtn:disabled { cursor: default; }
.lm-signbtn-ok { border-color: #1F7A4D; background: #E3F0E8; color: #1F7A4D; }
.lm-signbtn-wrong { border-color: #C0392B; background: #FBE9E7; opacity: 0.55; }
@media (prefers-reduced-motion: reduce) { .lm-sign-in, .lm-cmp-big { animation: none; } }
.lm-conn { display: flex; flex-direction: column; gap: 8px; }
.lm-conn-row { display: flex; gap: 10px; align-items: baseline; font-size: clamp(13px, 1.8vw, 15px); color: #5A554E; }
.lm-conn-lbl { font-size: 11px; font-weight: 800; color: #ff4f28; text-transform: uppercase; letter-spacing: 0.5px; flex-shrink: 0; }
.lm-meter { position: fixed; right: 8px; top: 50%; transform: translateY(-50%); z-index: 5; display: flex; flex-direction: column; align-items: center; gap: 6px; pointer-events: none; }
.lm-meter-label { font-size: 9px; font-weight: 800; color: #8A8378; writing-mode: vertical-rl; text-transform: uppercase; letter-spacing: 1px; }
.lm-meter-track { position: relative; width: 8px; height: clamp(150px, 34vh, 240px); border-radius: 6px; background: rgba(58,53,48,0.12); overflow: visible; }
.lm-meter-fill { position: absolute; left: 0; bottom: 0; width: 100%; border-radius: 6px; background: linear-gradient(0deg, #ff4f28, #F2A65A); transition: height 0.5s ease; box-shadow: 0 0 8px -1px rgba(255,79,40,0.6); }
.lm-meter-dot { position: absolute; left: 50%; transform: translate(-50%, 50%); width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 0 2px #FBF7F0; }
.lm-meter-dot-cur { width: 14px; height: 14px; box-shadow: 0 0 0 2px #FBF7F0, 0 0 10px -1px rgba(255,79,40,0.8); }
@media (max-width: 639.98px) { .lm-meter-label { display: none; } }
/* FaktCard + Qoida-card (grade3 lokal, d2- nomlari bilan mos) */
.d2-rulecard { display: flex; flex-direction: column; gap: 8px; background: #FFF3E9; border-radius: 16px; padding: clamp(12px, 2.4vw, 18px); box-shadow: 0 6px 20px -10px rgba(255,79,40,0.4); }
.d2-rulecard-badge { align-self: flex-start; background: #ff4f28; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 3px 12px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; }
.d2-rulecard-txt { margin: 0; color: #3A3530; font-weight: 700; font-size: clamp(15px, 2.1vw, 18px); line-height: 1.45; }

/* Javob maydoni xato bo'lganda: qisqa silkinish. Metodist 2026-08-06: xatoda matn
   yetarli emas, ekranda KO'RINISH kerak. */
.lm-ans-bad { animation: lm-ans-shake 0.34s ease-in-out; }
@keyframes lm-ans-shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-5px); } 40% { transform: translateX(5px); } 60% { transform: translateX(-3px); } 80% { transform: translateX(3px); } }
@media (prefers-reduced-motion: reduce) { .lm-ans-bad { animation: none; } }

/* Xato tahlili. Metodist 2026-08-09: kulrang abzas ekranning boshqa matnidan farq qilmaydi,
   bola uni O'Z xatosiga javob deb o'qimaydi. Endi alohida quti: chap chekkasi qizil, ichida
   undov belgisi. Matn JAVOBNI bermaydi — belgini ko'rsatadi, shuning uchun rang ogohlantirish,
   taqiq emas. */
.lm-hint-bad, .lesson-root p.lm-hint-bad { position: relative; margin: 0; padding: clamp(9px, 1.6vw, 12px) clamp(12px, 2vw, 15px) clamp(9px, 1.6vw, 12px) clamp(34px, 4.6vw, 40px); background: #FDECE7; border: 1px solid #F5CBBE; border-left: 4px solid #E0563A; border-radius: 10px; color: #8A3A22; font-size: clamp(13px, 1.7vw, 15px); line-height: 1.45; text-align: left; font-weight: 600; }
.lm-hint-bad::before { content: '!'; position: absolute; left: clamp(10px, 1.7vw, 13px); top: clamp(9px, 1.6vw, 12px); width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; background: #E0563A; color: #FFFFFF; border-radius: 50%; font-size: 12px; font-weight: 800; line-height: 1; }

/* FaktCard rasmi: 2-9 darslarda kartochka rasmsiz qolgan edi (metodist 2026-08-09).
   Qatlam bitta joyda — darslarda faqat SVG ning o'zi turadi. Kechroq darslarda shu qoidalar
   o'z faylida ham bor: ular STYLES quyrug'ida, ya'ni keyin keladi va ustun turadi. */
.d2-fact-hero { align-self: stretch; display: block; margin: 4px calc(-1 * clamp(12px, 2.4vw, 18px)) 8px; }
.d2-fact-hero .d2-factfig { display: block; width: 100%; }
.d2-fact-hero .d2-factfig svg { display: block; width: 100%; height: auto; border-radius: 14px; box-shadow: 0 8px 22px -8px rgba(5,10,25,0.6); }
@media (max-height: 820px) { .d2-fact-hero .d2-factfig svg { max-width: 268px; margin-inline: auto; } }
.lm-ff-tw { animation: lm-ff-tw 2.8s ease-in-out infinite; }
@keyframes lm-ff-tw { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
.lm-ff-glow { transform-box: fill-box; transform-origin: center; animation: lm-ff-glow 3.8s ease-in-out infinite; }
@keyframes lm-ff-glow { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.14); opacity: 1; } }
.lm-ff-float { animation: lm-ff-float 5.2s ease-in-out infinite; }
@keyframes lm-ff-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
.lm-ff-flare { transform-box: fill-box; transform-origin: center; animation: lm-ff-flare 5.4s ease-in-out infinite; }
@keyframes lm-ff-flare { 0%, 52%, 100% { opacity: 0; transform: scale(0.72); } 60% { opacity: 1; transform: scale(1.3); } 76% { opacity: 0.5; transform: scale(1.06); } }
.lm-ff-spin { transform-box: view-box; animation: lm-ff-spin 16s linear infinite; }
@keyframes lm-ff-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.lm-ff-ray { animation: lm-ff-ray 6.5s linear infinite; }
@keyframes lm-ff-ray { 0% { transform: translateX(0); opacity: 0; } 8% { opacity: 1; } 86% { opacity: 1; } 100% { transform: translateX(210px); opacity: 0; } }
.lm-ff-fly { animation: lm-ff-fly 7.5s ease-in-out infinite; }
@keyframes lm-ff-fly { 0% { transform: translate(0, 0); } 25% { transform: translate(26px, -12px); } 50% { transform: translate(52px, 6px); } 75% { transform: translate(26px, 14px); } 100% { transform: translate(0, 0); } }
@media (prefers-reduced-motion: reduce) {
  .lm-ff-tw, .lm-ff-glow, .lm-ff-float, .lm-ff-flare, .lm-ff-spin, .lm-ff-ray, .lm-ff-fly { animation: none; }
}
`;

// Оформление уроков, собранных из данных (вторая дорога кита). В уроках 1-36 этот хвост лежал
// в каждом файле со своим префиксом (d33-, d34- …); здесь он один и называется lg3-.
export const LESSON_STYLES = BASE_STYLES + `
.lm-mat-stack { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.lm-scene { position: relative; width: min(100%, calc(clamp(160px, calc(100dvh - 570px), 372px) * 400 / 210)); aspect-ratio: 400 / 210; margin-inline: auto; border-radius: 14px; overflow: hidden; }
@media (prefers-reduced-motion: reduce) { .lm-reveal, .lm-write, .lm-drop, .lm-fadein { animation: none; } }
.d2-factcard { display: flex; flex-direction: column; gap: 6px; background: #14203C; border-radius: 14px; padding: clamp(12px, 2.4vw, 18px); }
.d2-factcard-badge { align-self: flex-start; background: rgba(255,184,77,0.2); color: #FFC23C; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; }
.d2-factcard-txt { margin: 0; color: #EAF0F8; font-size: clamp(14px, 1.9vw, 16px); line-height: 1.5; }
/* --- FactCard KENG tungi-bog' paneli + 3D orbita (Dars01 SymPy hisobi bayt-aniq) --- */
.d2-fact-hero { align-self: stretch; display: block; margin: 4px calc(-1 * clamp(12px, 2.4vw, 18px)) 8px; }
.d2-fact-hero .d2-factfig { display: block; width: 100%; }
.d2-fact-hero .d2-factfig svg { display: block; width: 100%; height: auto; border-radius: 14px; box-shadow: 0 8px 22px -8px rgba(5,10,25,0.6); }
.lumo-orbit-front, .lumo-orbit-back { transform-box: view-box; transform-origin: 170px 78px; animation: 13s linear infinite; }
.lumo-orbit-front { animation-name: lumoOrbitFront; }
.lumo-orbit-back { animation-name: lumoOrbitBack; }
.rd-glow { transform-box: view-box; transform-origin: 170px 78px; animation: rdPulse 3.8s ease-in-out infinite; }
.star-tw { animation: starTw 2.8s ease-in-out infinite; }
.comet { transform-box: view-box; animation: cometDrift 10s linear infinite; }
.heat-wave { animation: starTw 2.2s ease-in-out infinite; }
.bulb-rays { animation: rayPulse 3.8s ease-in-out infinite; }
@keyframes rayPulse { 0%, 100% { opacity: 0.22; } 50% { opacity: 0.5; } }
@keyframes starTw { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
@keyframes cometDrift { 0% { transform: translate(30px,116px); opacity: 0; } 6% { opacity: 0.85; } 32% { opacity: 0.85; } 46% { transform: translate(250px,20px); opacity: 0; } 100% { transform: translate(250px,20px); opacity: 0; } }
@keyframes rdPulse { 0%, 100% { opacity: 0.8; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
@keyframes lumoOrbitFront {
  0% { transform: translate(74px,0px) scale(1); opacity: 1; }
  8.33% { transform: translate(64.09px,-20.69px) scale(1.22); opacity: 1; }
  16.67% { transform: translate(37px,-35.84px) scale(1.455); opacity: 1; }
  25% { transform: translate(0px,-41.38px) scale(1.565); opacity: 1; }
  33.33% { transform: translate(-37px,-35.84px) scale(1.455); opacity: 1; }
  41.67% { transform: translate(-64.09px,-20.69px) scale(1.22); opacity: 1; }
  50% { transform: translate(-74px,0px) scale(1); opacity: 1; }
  58.33% { transform: translate(-64.09px,20.69px) scale(0.847); opacity: 0; }
  66.67% { transform: translate(-37px,35.84px) scale(0.762); opacity: 0; }
  75% { transform: translate(0px,41.38px) scale(0.735); opacity: 0; }
  83.33% { transform: translate(37px,35.84px) scale(0.762); opacity: 0; }
  91.67% { transform: translate(64.09px,20.69px) scale(0.847); opacity: 0; }
  100% { transform: translate(74px,0px) scale(1); opacity: 1; }
}
@keyframes lumoOrbitBack {
  0% { transform: translate(74px,0px) scale(1); opacity: 0; }
  8.33% { transform: translate(64.09px,-20.69px) scale(1.22); opacity: 0; }
  16.67% { transform: translate(37px,-35.84px) scale(1.455); opacity: 0; }
  25% { transform: translate(0px,-41.38px) scale(1.565); opacity: 0; }
  33.33% { transform: translate(-37px,-35.84px) scale(1.455); opacity: 0; }
  41.67% { transform: translate(-64.09px,-20.69px) scale(1.22); opacity: 0; }
  50% { transform: translate(-74px,0px) scale(1); opacity: 0; }
  58.33% { transform: translate(-64.09px,20.69px) scale(0.847); opacity: 1; }
  66.67% { transform: translate(-37px,35.84px) scale(0.762); opacity: 1; }
  75% { transform: translate(0px,41.38px) scale(0.735); opacity: 1; }
  83.33% { transform: translate(37px,35.84px) scale(0.762); opacity: 1; }
  91.67% { transform: translate(64.09px,20.69px) scale(0.847); opacity: 1; }
  100% { transform: translate(74px,0px) scale(1); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) { .lumo-orbit-front, .lumo-orbit-back, .rd-glow, .star-tw, .comet, .heat-wave, .bulb-rays { animation: none; } .lumo-orbit-back, .comet { opacity: 0; } .bulb-rays { opacity: 0.35; } }
/* === DARS11: RazryadShift taxtasi === */
.rz-wrap { display: flex; flex-direction: column; gap: 6px; width: min(340px, 92%); }
.rz-heads { display: grid; grid-template-columns: repeat(3, 1fr); text-align: center; font-size: clamp(9px, 1.5vw, 11px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; }
.rz-board { position: relative; height: clamp(56px, 12vw, 72px); }
.rz-cell { position: absolute; top: 0; bottom: 0; width: calc(100% / 3 - 6px); margin: 0 3px; background: #FBF7F0; border-radius: 12px; box-shadow: inset 0 0 0 1.5px rgba(58, 53, 48, 0.08); }
.rz-chip { position: absolute; top: 0; bottom: 0; width: calc(100% / 3); display: flex; align-items: center; justify-content: center; font-size: clamp(26px, 6vw, 38px); font-weight: 800; color: #3A3530; transition: left 0.9s ease, opacity 0.6s ease; }
/* saralash kartasi: to'g'ri savatga "uchib ketadi" */
.rz-fly { animation: rz-fly-a 1s ease forwards; }
@keyframes rz-fly-a { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(46px) scale(0.55); opacity: 0; } }
/* zanjir tuguni yonishi */
.rz-node-on { animation: rz-node-a 0.5s ease; }
@keyframes rz-node-a { 0% { transform: scale(0.7); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
/* 5 soniyalik soat (Dars01 naqshi) */
@media (prefers-reduced-motion: reduce) { .rz-chip { transition: none; } .rz-fly, .rz-node-on, .lm-reveal { animation: none; } }
/* === DARS12: YO'LAKLAR va KESISH (SplitArray) ===
   Metodist: yo'lak HAQIQIY ko'rinsin. Shuning uchun yo'laklar TUPROQ maydonida yotadi,
   chekkalarida o't tutamlari, har yo'lak oxirida uycha. */
.d12-ground { position: relative; width: 100%; max-width: 470px; padding: clamp(12px, 2.6vw, 18px) clamp(8px, 1.8vw, 14px); border-radius: 16px;
  background: radial-gradient(120% 90% at 50% 0%, #24402C 0%, #1A3021 55%, #12241A 100%); box-shadow: inset 0 0 0 1.5px rgba(20,40,24,0.9), inset 0 8px 18px -10px rgba(0,0,0,0.6); overflow: hidden; }
/* tuproq donadorligi */
.d12-ground::after { content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.35;
  background-image: radial-gradient(#3E5A44 0.6px, transparent 0.7px), radial-gradient(#2C4433 0.5px, transparent 0.6px);
  background-size: 13px 11px, 9px 15px; background-position: 0 0, 5px 7px; }
/* o't tutamlari chekkalarda */
.d12-grass { position: absolute; left: 0; right: 0; height: clamp(9px, 2vw, 13px); pointer-events: none; }
.d12-grass-top { top: 2px; }
.d12-grass-bot { bottom: 2px; transform: scaleY(-1); }
.d12-grass i { position: absolute; bottom: 0; width: 2px; height: 100%; border-radius: 2px 2px 0 0; background: linear-gradient(180deg, #4E8A5A 0%, #2E5A38 100%); transform-origin: bottom center; animation: d12-sway 3.4s ease-in-out infinite; }
@keyframes d12-sway { 0%, 100% { transform: rotate(-7deg); } 50% { transform: rotate(7deg); } }
.d12-field { position: relative; z-index: 1; display: flex; flex-direction: column; gap: clamp(6px, 1.4vw, 10px); width: 100%; }
.d12-hut { flex: 0 0 auto; width: clamp(18px, 4.2vw, 26px); margin-left: clamp(4px, 1.2vw, 8px); }
/* xuk ekranidagi bitta namuna yo'lak — pastroq maydon */
.d12-sample-row { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 2vw, 16px); flex-wrap: wrap; }
.d12-sample-cap { font-size: clamp(10px, 1.5vw, 12px); font-weight: 800; color: #5A5A60; max-width: 22ch; line-height: 1.35; }
.d12-ground-sample { max-width: 290px; padding: clamp(7px, 1.6vw, 11px) clamp(7px, 1.6vw, 10px); }
/* SAHNA KECHQURUN: syujet «bog' qorong'i» — tungi qatlam (SVG o'zi o'zgarmaydi) */
/* tungi qatlam AYNAN sahna ichida (freym chetlariga chiqmaydi): .lm-scene overflow hidden */
.d12-night .lm-scene { filter: brightness(0.64) saturate(0.88); }
.d12-night .lm-scene::after { content: ''; position: absolute; inset: 0; z-index: 3; pointer-events: none;
  background: linear-gradient(180deg, rgba(24,34,86,0.42) 0%, rgba(12,18,48,0.5) 100%); }
.d12-row { position: relative; display: flex; align-items: center; gap: clamp(3px, 0.8vw, 6px); }
/* nurlarning YERGA tushgan yorug'i — yo'lak «porlab turgani» shundan ko'rinadi */
.d12-row::before { content: ''; position: absolute; left: -8px; right: -8px; top: -5px; bottom: -5px; border-radius: 14px; pointer-events: none;
  background: radial-gradient(58% 130% at 42% 50%, rgba(255,214,140,0.20) 0%, rgba(255,214,140,0.07) 45%, rgba(255,214,140,0) 72%); }
.d12-plitas { display: flex; gap: clamp(3px, 0.8vw, 6px); flex: 0 0 auto; }
.d12-plitas .d12-plita { width: clamp(58px, 14vw, 82px); }
.d12-toshchas { display: flex; gap: clamp(3px, 0.8vw, 6px); flex: 0 0 auto; }
.d12-toshchas .d12-toshcha { width: clamp(14px, 3.4vw, 20px); }
.d12-plita, .d12-toshcha { display: inline-block; transition: opacity 0.45s; }
/* kesish chizig'i: yorug' vertikal ajratgich */
.d12-cut { flex: 0 0 auto; width: 3px; align-self: stretch; min-height: clamp(14px, 3.4vw, 20px); border-radius: 2px; background: linear-gradient(180deg, rgba(127,224,216,0) 0%, #7FE0D8 22%, #FFF6DC 50%, #7FE0D8 78%, rgba(127,224,216,0) 100%); box-shadow: 0 0 8px 1px rgba(127,224,216,0.75); animation: d12-cut-in 0.5s ease; }
@keyframes d12-cut-in { 0% { opacity: 0; transform: scaleY(0.2); } 100% { opacity: 1; transform: none; } }
.d12-row-split { gap: clamp(6px, 1.6vw, 12px); }
/* yorliqlar guruhlar USTIDA turadi: chapdagi plitalar ustida, o'ngdagi toshchalar ustida
   (satr bilan bir xil o'lchamlar: 2 plita + oraliq, keyin kesish chizig'i) */
.d12-labels { display: flex; align-items: flex-end; gap: clamp(6px, 1.6vw, 12px); font-size: clamp(10px, 1.6vw, 12px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; }
/* yorliqlar TUPROQ (to'q) fonida — yorug' ranglar */
.d12-label-l { width: calc(2 * clamp(58px, 14vw, 82px) + clamp(3px, 0.8vw, 6px)); text-align: center; color: #8FE8B4; }
.d12-label-r { width: calc(3 * clamp(14px, 3.4vw, 20px) + 2 * clamp(3px, 0.8vw, 6px) + 3px); text-align: center; color: #8FD8F0; }
.d12-spark { animation: d12-spark-a 3s ease-in-out infinite; }
@keyframes d12-spark-a { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
/* s1: ochiladigan ikki karta */
/* === DARS12: USTUN (stolbik) demo === */
.d12-col { display: inline-flex; flex-direction: column; align-items: flex-start; gap: 0; background: #FFF8EF; border-radius: 14px; padding: clamp(10px, 2vw, 16px) clamp(14px, 3vw, 22px); box-shadow: inset 0 0 0 1.5px rgba(255,79,40,0.18); }
/* ustun satrlari — 5-sinf naqshi: monoshrift, O'NGGA tekislangan, kenglik ch birligida,
   shuning uchun raqamlar xonalar bo'yicha aniq ustun-ustun tushadi va belgi
   ko'paytuvchining chap yonida turadi (kitobdagi joylashuv). */
.d12-colr { white-space: pre; text-align: right; min-width: 3ch; font-size: clamp(21px, 4.4vw, 30px); line-height: 1.42; font-weight: 800; color: #3A3530; }
/* ko'chirilgan o'nlik AYNAN o'nliklar ustuni ustida: satr 3 ustun, o'nlik — o'rtasi (50%) */
.d12-colr-carry { position: relative; width: 3ch; height: clamp(13px, 2.4vw, 17px); font-size: clamp(21px, 4.4vw, 30px); }
.d12-carry { position: absolute; left: 50%; top: 0; transform: translateX(-50%); font-size: clamp(11px, 2vw, 14px); line-height: 1; font-weight: 800; color: #FF4F28; }
.d12-col-sign { color: #8A8378; }
.d12-col-hot { color: #1F7A4D; }
.d12-col-rule { height: 2.5px; width: 3ch; font-size: clamp(21px, 4.4vw, 30px); background: #3A3530; border-radius: 2px; margin: 4px 0; }
.d12-col-total { align-self: center; font-size: clamp(15px, 2.8vw, 20px); font-weight: 800; color: #FF4F28; margin-top: 8px; white-space: nowrap; }
@media (prefers-reduced-motion: reduce) { .d12-spark, .d12-cut { animation: none; } }
/* past ekranlarda (768px) fakt rasmi va masala sahnasi ixchamlashadi — skrollsiz qoladi */
@media (max-height: 820px) {
  .d2-fact-hero .d2-factfig svg { max-width: 268px; margin-inline: auto; }
}
/* xuk ekrani (s0): sahna ham ETALON o'lchamida (Dars01 s0 = 629x330) */
/* yakuniy ekran (s14): sahna ETALON o'lchamida — Dars01 dagi 570px budjet */
.d13-final-scene .lm-scene { width: min(100%, calc(clamp(200px, calc(100dvh - 560px), 372px) * 400 / 210)); }
/* === DARS13: TOSH SANDIQ va TARQATISH (ShareOut) === */
.d13-box { display: inline-flex; flex-direction: column; gap: clamp(4px, 1vw, 7px); padding: clamp(8px, 1.8vw, 13px) clamp(9px, 2vw, 14px);
  border-radius: 12px; background: linear-gradient(180deg, #6B5540 0%, #4E3E2E 100%); box-shadow: inset 0 0 0 2px #7E6A52, inset 0 6px 14px -8px rgba(0,0,0,0.55); }
.d13-box-plitas { display: grid; grid-template-columns: repeat(3, auto); gap: clamp(3px, 0.8vw, 6px); }
.d13-box-plitas .d12-plita { width: clamp(44px, 10vw, 62px); }
.d13-box-toshchas { display: flex; gap: clamp(3px, 0.8vw, 6px); justify-content: center; }
.d13-box-toshchas .d12-toshcha { width: clamp(13px, 3vw, 18px); }
/* xuk ekranida sandiq + izoh yonma-yon */
.d13-boxrow { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 2vw, 16px); flex-wrap: wrap; }
/* xuk panelida sandiq IXCHAM: balandlik tejaladi, skroll chiqmaydi */
.d13-boxrow .d13-box { padding: clamp(6px, 1.4vw, 9px) clamp(7px, 1.6vw, 10px); gap: clamp(3px, 0.7vw, 5px); }
.d13-boxrow .d13-box-plitas { gap: clamp(2px, 0.6vw, 4px); }
.d13-boxrow .d13-box-plitas .d12-plita { width: clamp(34px, 7.6vw, 46px); }
.d13-boxrow .d13-box-toshchas .d12-toshcha { width: clamp(10px, 2.3vw, 14px); }
.d13-boxcap { font-size: clamp(10px, 1.5vw, 12px); font-weight: 800; color: #5A5A60; max-width: 16ch; line-height: 1.35; }
/* tarqatish: sandiq -> uch yo'lak */
.d13-share { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); width: 100%; }
.d13-share-src { display: flex; justify-content: center; }
.d13-share-dst { max-width: 470px; }
/* bo'sh o'rin (tarqatishdan oldin) — chiziqli kontur */
.d13-slot { display: inline-block; width: clamp(58px, 14vw, 82px); height: clamp(14px, 3.2vw, 20px); border-radius: 4px; border: 1.5px dashed rgba(160,190,170,0.45); }
.d13-slot-sm { width: clamp(14px, 3.4vw, 20px); border-radius: 50%; }
/* yo'lak yorlig'i (30 -> 32) */
.d13-tag { margin-left: clamp(4px, 1.2vw, 8px); font-size: clamp(11px, 1.9vw, 15px); font-weight: 800; color: #8FE8B4; background: rgba(31,122,77,0.28); border-radius: 999px; padding: 1px 8px; }
.d13-tag-full { color: #FFE6A6; background: rgba(255,184,77,0.24); }
.d13-note { font-size: clamp(10px, 1.6vw, 12px); font-weight: 800; color: #5A5A60; }
/* burchak usuli (ugolok) — 5-sinf DivBoard naqshi */
.d13-div { padding: clamp(4px, 1.2vw, 8px) clamp(6px, 1.6vw, 10px); background: #FFF8EF; border-radius: 12px; box-shadow: inset 0 0 0 1.5px rgba(255,79,40,0.16); }
/* === DARS14: BUYURTMA TAXTASI va SAVATLAR === */
/* === DARS14: IFODA SVYORTKASI === */
/* === DARS14: QOIDA uch satr === */
/* === DARS14: QAVS panellari === */
/* === DARS14: USTUN (stolbik) — 5-sinf naqshi ===
   Har satr: BELGI sloti (2 monoshrift belgisi) + TANA. Ikkisi bir shriftda, shuning uchun
   xonalar aniq ustun-ustun tushadi, belgi esa pastdagi sonning chap yonida turadi. */
/* === DARS14: masala sahnasi (uch tokcha + yerdagi lampalar) === */
/* yakuniy ekran (s14): sahna ETALON o'lchamida (Dars01 s14) */
/* ============================================================
   DARS15 — jo'natish maydonchasi: vagonetka, son uchburchagi, tekshirish satri.
   ============================================================ */
/* sahna o'lchami — ETALON (Dars01 s0: 629x330 @1440x900), ekran uchun alohida klass:
   global .lm-scene budjetini ko'tarish HAMMA darsni kichraytiradi (metodist saboqi). */
/* Sahna o'lchami BALANDLIK BUDJETIDAN chiqadi (Dars13 naqshi): xuk ekranida sahna +
   vagonetka paneli + 4 variant sig'ishi kerak, shuning uchun budjet donor bilan bir xil. */
/* --- VAGONETKA --- */
@keyframes d15roll { from { transform: translateX(0); } to { transform: translateX(14%); } }
/* --- SON UCHBURCHAGI (darslik topshirig'i) --- */
/* --- TEKSHIRISH SATRI --- */
.d15-check { display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px; border-radius: 999px;
  background: #E3F0E8; border: 2px solid #9CCBB0; }
.d15-check-no { background: #FDE8E4; border-color: #E9AFA2; }
.d15-check-sign { font-size: clamp(12px, 1.8vw, 15px); font-weight: 800; color: #1F7A4D; }
.d15-check-no .d15-check-sign { color: #C0392B; }
.d15-check-expr { font-size: clamp(13px, 2.2vw, 17px); font-weight: 800; color: #0E0E10; }
.d15-check-cap { font-size: clamp(9.5px, 1.4vw, 11.5px); font-weight: 700; color: #5A5A60; text-transform: uppercase; letter-spacing: .4px; }
/* --- TESKARI YO'L (s2) --- */
/* --- QOIDA KARTASI (s4) --- */
.d15-rulelines { display: flex; flex-direction: column; gap: 5px; }
.d15-ruleline { font-size: clamp(12.5px, 1.9vw, 15px); font-weight: 700; color: #0E0E10; }
.d15-ruleex { align-self: flex-start; margin-top: 2px; padding: 3px 10px; border-radius: 999px;
  background: #FFE8E1; color: #FF4F28; font-size: clamp(12px, 1.9vw, 15px); font-weight: 800; }
/* --- TEKSHIRISH PANELLARI (s6) --- */
/* --- BONUS: iks harfi (s10) --- */
/* --- FACTCARD: tovush to'lqini borib qaytadi --- */
@keyframes d15wave {
  0%, 100% { opacity: 0; transform: translateX(0); }
  35% { opacity: 1; transform: translateX(18px); }
  70% { opacity: .5; transform: translateX(0); }
}
@media (prefers-reduced-motion: reduce) {
  .d15-cart-go, .d15-wave, .d15-count-tick { animation: none; }
}
/* ============================================================
   DARS16 — bog' vazifasi: 1-darsning konsoli, darslik jadvali, merka-polosalar.
   ============================================================ */
/* --- KONSOL (1-darsdan ko'chirilgan uslub; bu yerda ikki yacheyka) --- */
@keyframes lm-cons-pop { from { transform: scale(0.6); opacity: 0; } to { transform: none; opacity: 1; } }
/* --- MERKA: bir qatorda lampalar --- */
/* --- XUK: ikki gulzor paneli --- */
/* --- DARSLIK JADVALI (26-bet): uch ustun, shapka tepada --- */
/* --- MERKA-POLOSALAR (necha marta ko'p) --- */
/* --- s3, s5, s10, s12 mayda matnlar --- */
/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */
/* --- FACTCARD: yuk ko'tarilishi --- */
@keyframes d16lift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@media (prefers-reduced-motion: reduce) { .d16-load { animation: none; } }
/* ============================================================
   DARS17 — saralash zali: qatorlar massivi, sonlar o'qi, ikki tokcha.
   ============================================================ */
/* --- XUK: 12 lampa uyumi --- */
/* --- QATORLAR MASSIVI (ArrayViz) --- */
/* --- BO'LUVCHILAR RO'YXATI --- */
/* --- IKKI TOKCHA (1-darsning lm-bin mexanikasi) --- */
/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */
/* --- FACTCARD: soat teng bo'laklarga bo'linadi --- */
@keyframes d17slice { 0%, 45%, 100% { opacity: 0; } 15%, 30% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d17-slice { animation: none; opacity: .6; } }
/* ============================================================
   DARS19 — ustaxona: modul detallari, konsol, jadval, svyortka.
   ============================================================ */
/* --- XUK: buyurtma qatori (4 modul-plastinka) --- */
/* --- MODUL QISMLARI (s1) --- */
/* --- YIG'ISH STOLI GURUHLARI (s2-s3) --- */
/* --- IFODA SATRLARI --- */
/* --- KONSOL (1-dars uslubi, 15-darsdan ko'chirilgan CSS) --- */
.lm-console { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(8px, 2vw, 14px); width: 100%; max-width: 440px; }
.lm-cons { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.2vw, 8px); padding: clamp(9px, 2vw, 14px) 4px; border-radius: 16px; background: #FBF7F0; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.07); transition: box-shadow 0.28s, background 0.28s; }
.lm-cons-lit { background: #FFF6E9; box-shadow: 0 5px 16px -9px rgba(255,154,46,0.75), inset 0 0 0 1.5px rgba(255,154,46,0.5); }
.lm-cons-head { font-size: clamp(9px, 1.5vw, 11px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; text-align: center; }
.lm-cons-screen { display: flex; align-items: center; justify-content: center; gap: clamp(4px, 1.2vw, 8px); min-height: clamp(32px, 7vw, 44px); }
.lm-cons-x { font-size: clamp(16px, 3.4vw, 23px); font-weight: 800; color: #3A3530; display: inline-block; }
.lm-cons-val { font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3.2vw, 22px); font-weight: 800; color: #FF4F28; }
.d16-plate { font-size: clamp(14px, 2.8vw, 20px); font-weight: 800; color: #0E0E10; padding: 2px 8px;
  border-radius: 9px; background: rgba(255,236,200,.55); box-shadow: inset 0 0 0 1px rgba(190,150,90,.28); }
.d16-row { display: inline-flex; gap: clamp(1px, 0.5vw, 3px); padding: clamp(3px, 0.8vw, 5px) clamp(4px, 1vw, 6px);
  border-radius: 8px; background: rgba(255,236,200,.55); box-shadow: inset 0 0 0 1px rgba(190,150,90,.28); }
.d16-row-lamp { display: inline-flex; width: clamp(9px, 2.2vw, 14px); height: clamp(9px, 2.2vw, 14px); }
.d16-row-lamp svg { width: 100%; height: 100%; }
/* --- DARSLIK JADVALI (15-darsdan ko'chirilgan CSS) --- */
.d16-tbl { width: 100%; max-width: 420px; border: 2px solid #C9B79A; border-radius: 10px; overflow: hidden; background: #FFFFFF; }
.d16-tbl-row { display: grid; grid-template-columns: repeat(3, 1fr); }
.d16-tbl-head { background: #F3E7CE; border-bottom: 2px solid #C9B79A; }
.d16-tbl-cell { padding: clamp(5px, 1.2vw, 8px) clamp(3px, 1vw, 6px); text-align: center; font-size: clamp(10px, 1.6vw, 12.5px);
  font-weight: 700; color: #5A5A60; border-right: 1px solid #DCCDB0; display: flex; align-items: center; justify-content: center; }
.d16-tbl-row .d16-tbl-cell:last-child { border-right: none; }
.d16-tbl-val { font-size: clamp(17px, 3.6vw, 24px); font-weight: 800; color: #0E0E10; min-height: clamp(34px, 8vw, 46px); }
.d16-tbl-hot { color: #FF4F28; background: #FFF4EF; }
/* --- IFODA SVYORTKASI (13-darsdan ko'chirilgan CSS) --- */
.d14-expr { display: flex; align-items: center; justify-content: center; gap: clamp(6px, 1.4vw, 11px); flex-wrap: wrap; min-height: clamp(34px, 7vw, 48px); }
.d14-tok { font-size: clamp(22px, 4.8vw, 32px); font-weight: 800; color: #3A3530; padding: 2px 6px; border-radius: 8px; transition: background 0.25s ease, color 0.25s ease; }
.d14-tok-hot { background: rgba(255,79,40,0.16); color: #FF4F28; box-shadow: inset 0 0 0 1.5px rgba(255,79,40,0.45); }
.d14-tok-fresh { background: rgba(31,122,77,0.14); color: #1F7A4D; box-shadow: inset 0 0 0 1.5px rgba(31,122,77,0.4); }
.d14-tok-big { font-size: clamp(28px, 6vw, 42px); color: #1F7A4D; }
/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */
/* --- FACTCARD: ikkilantirish zanjiri navbat bilan yonadi --- */
@keyframes d19slice { 0%, 8% { opacity: 0.25; } 28%, 100% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d19-slice { animation: none; opacity: 1; } }

/* ============================================================
   DARS18 — taqsimot rafi: detallar, tokchalar, saralash.
   ============================================================ */

/* --- XUK: buyurtma yorlig'i --- */

/* --- DETALLAR --- */

/* --- TOKCHALAR (qismni tengdan tarqatish) --- */

/* --- IFODA SATRLARI --- */

/* --- TOKCHAGA SARALASH (16-darsdan ko'chirilgan mexanika, chip kengroq) --- */
.lm-digtray { display: flex; gap: 10px; justify-content: center; min-height: clamp(44px, 10vw, 58px); align-items: center; }
.lm-digtray-empty { font-size: clamp(15px, 3.2vw, 21px); font-weight: 800; color: #C4BEB4; letter-spacing: 1px; }
.lm-digchip { display: inline-flex; align-items: center; justify-content: center; min-width: clamp(76px, 17vw, 104px); height: clamp(42px, 9vw, 56px); border: none; border-radius: 12px; background: #FFFFFF;
  font-size: clamp(15px, 3.2vw, 22px); font-weight: 800; color: #3A3530; cursor: pointer; padding: 0 10px;
  box-shadow: 0 3px 10px -4px rgba(58,53,48,0.35); transition: transform 0.12s; }
.lm-digchip-sel { background: #FFF3E9; color: #FF4F28; transform: translateY(-3px); box-shadow: 0 6px 16px -5px rgba(255,79,40,0.55); }
.lm-bin { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: clamp(10px, 2vw, 16px) 6px; border: none;
  border-radius: 14px; background: #FBF7F0; cursor: pointer; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.07); transition: box-shadow 0.2s; }
.lm-bin-open { box-shadow: 0 4px 14px -6px rgba(255,79,40,0.4), inset 0 0 0 1.5px rgba(255,79,40,0.4); }
.lm-bin-full { background: #E3F0E8; box-shadow: inset 0 0 0 1.5px rgba(31,122,77,0.35); }
.lm-bin-head { font-size: clamp(9px, 1.5vw, 11px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; text-align: center; }
.lm-bin-slot { min-width: clamp(60px, 13vw, 84px); height: clamp(34px, 7vw, 44px); display: flex; align-items: center; justify-content: center;
  border-radius: 10px; background: #FFFFFF; font-size: clamp(14px, 3vw, 20px); font-weight: 800; color: #3A3530;
  box-shadow: inset 0 0 0 1px rgba(58,53,48,0.06); }
.lm-bin:disabled { cursor: default; }

/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */

/* --- FACTCARD: uch xil ajratish navbat bilan yonadi --- */
@keyframes d18split { 0%, 6% { opacity: 0.25; } 24%, 100% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d18-split { animation: none; opacity: 1; } }

/* ============================================================
   DARS19 — teng ulash stoli: tarqatish, ortiqcha lagani, qoldiq.
   ============================================================ */

/* --- XUK: buyurtma --- */

/* --- TARQATISH DOSKASI --- */

/* --- IFODA SATRLARI --- */


/* --- YOPIQ MAYDON (Bit tuzog'i) --- */

/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */

/* --- FACTCARD: hafta strelkasi --- */
@keyframes d19arc { 0%, 10% { transform: rotate(0deg); } 55%, 100% { transform: rotate(308deg); } }
@media (prefers-reduced-motion: reduce) { .d19-arc { animation: none; } }

/* ============================================================
   DARS20 — nazorat terminali: tekshiruv juftliklari, moslik.
   ============================================================ */


/* --- TEKSHIRUV JUFTLIGI --- */

/* --- IFODA SATRLARI --- */

/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */

/* --- FACTCARD: skaner chizig'i --- */
@keyframes d20scan { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(132px); } }

/* ============================================================
   DARS21 — ustun terminali: yozuv, o'tkazish, qadamlar.
   ============================================================ */


/* --- USTUN (13-darsdan ko'chirilgan CSS) --- */
.d14-col { display: inline-flex; flex-direction: column; align-items: flex-start; gap: 0; background: #FFF8EF; border-radius: 12px;
  padding: clamp(8px, 1.8vw, 13px) clamp(12px, 2.4vw, 18px); box-shadow: inset 0 0 0 1.5px rgba(190,150,90,.3); }
.d14-colr { white-space: pre; text-align: left; font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.6vw, 25px);
  font-weight: 800; color: #3A3530; line-height: 1.25; }
.d14-col-slot { color: #8A8378; }
.d14-col-sign { color: #8A8378; }
.d14-col-hot { color: #1F7A4D; }
.d14-colr-carry { position: relative; height: clamp(11px, 2.1vw, 15px); font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.6vw, 25px); }
.d14-carry { position: absolute; top: 0; transform: translateX(-50%); font-family: 'JetBrains Mono', monospace;
  font-size: clamp(10px, 2vw, 14px); font-weight: 800; color: #FF4F28; }
.d14-col-rule { height: 2.3px; background: #3A3530; border-radius: 2px; margin: 3px 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.6vw, 25px); }

/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */

/* --- FACTCARD: qadamlar navbat bilan yonadi --- */
@keyframes d21step { 0%, 10% { opacity: 0.3; } 30%, 100% { opacity: 1; } }

/* ============================================================
   DARS22 — katta modul: katak to'r, ikki bo'lak, qismlar.
   ============================================================ */

.lg3-order { display: inline-flex; gap: clamp(6px, 1.6vw, 12px); align-items: center; padding: clamp(4px, 1vw, 7px) clamp(8px, 1.8vw, 12px);
  border-radius: 10px; background: rgba(255,236,200,.5); box-shadow: inset 0 0 0 1px rgba(190,150,90,.26); }
.lg3-order-plate { font-size: clamp(15px, 3vw, 21px); font-weight: 800; color: #3A3530; padding: 3px 10px;
  border-radius: 8px; background: #FFFFFF; box-shadow: 0 2px 8px -4px rgba(58,53,48,0.35); }
.lg3-note { font-size: clamp(9.5px, 1.5vw, 12px); font-weight: 700; color: #5A5A60; text-align: center; }
.lg3-expr { font-size: clamp(15px, 3vw, 22px); font-weight: 800; color: #3A3530; }
.lg3-final { font-size: clamp(18px, 3.6vw, 26px); font-weight: 800; color: #1F7A4D; }
.lg3-bad { font-size: clamp(14px, 2.8vw, 20px); font-weight: 800; color: #C0392B; }
.lg3-errline { font-size: clamp(13px, 2.5vw, 19px); font-weight: 800; color: #C0392B; padding: 3px 12px;
  border-radius: 9px; background: rgba(192,57,43,.08); box-shadow: inset 0 0 0 1px rgba(192,57,43,.3); text-align: center; }
.lg3-steplabel { font-size: clamp(13px, 2.4vw, 18px); font-weight: 800; color: #3A3530; text-align: center; }
.lg3-res { font-size: clamp(19px, 3.8vw, 26px); font-weight: 800; color: #1F7A4D; }
.lg3-plate { font-size: clamp(19px, 4vw, 28px); font-weight: 800; color: #0E0E10; padding: 4px 14px;
  border-radius: 12px; background: rgba(255,236,200,.55); box-shadow: inset 0 0 0 1px rgba(190,150,90,.28); }
.lg3-trap { display: flex; gap: 10px; justify-content: center; }
.lg3-bins { display: grid; grid-template-columns: repeat(2, minmax(120px, 1fr)); gap: clamp(8px, 2vw, 16px); width: 100%; max-width: 460px; }

/* --- KATAK TO'R --- */
.lg3-grid { display: inline-flex; align-items: flex-start; gap: clamp(5px, 1.2vw, 9px);
  padding: clamp(5px, 1.2vw, 8px); border-radius: 10px; background: rgba(255,236,200,.45);
  box-shadow: inset 0 0 0 1px rgba(190,150,90,.26); }
.lg3-grid-part { display: inline-flex; flex-direction: column; gap: 2px; }
.lg3-grid-row { display: inline-flex; gap: 2px; }
.lg3-cell { display: inline-block; width: clamp(6px, 1.5vw, 10px); height: clamp(6px, 1.5vw, 10px); border-radius: 2px; }
.lg3-cell-a { background: #F2A85C; box-shadow: inset 0 0 0 0.5px #C97F35; }
.lg3-cell-b { background: #6FD0E4; box-shadow: inset 0 0 0 0.5px #3E8FA8; }
.lg3-gridrow { display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; gap: clamp(6px, 1.6vw, 12px); }
.lg3-gridcap { display: flex; flex-direction: column; align-items: center; gap: 3px; }

/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */
.lg3-hook-scene .lm-scene { width: min(100%, calc(clamp(180px, calc(100dvh - 570px), 372px) * 400 / 210)); }
.lg3-final-scene .lm-scene { width: min(100%, calc(clamp(200px, calc(100dvh - 560px), 372px) * 400 / 210)); }

/* --- FACTCARD: zinapoya --- */
.lg3-stair { animation: d22stair 3.6s ease-in-out infinite; }
@keyframes d22stair { 0%, 12% { opacity: 0.3; } 34%, 100% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .lg3-stair { animation: none; opacity: 1; } }

.lg3-boxwrap { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.lg3-boxrow { display: grid; grid-template-columns: repeat(6, auto); gap: clamp(4px, 1vw, 7px); justify-content: center; }
.lg3-box { width: clamp(20px, 3.4vw, 27px); height: clamp(17px, 2.9vw, 23px); border-radius: 3px;
  background: #EFE6D6; border: 1.5px solid #D8CDB8; opacity: 0.5; transition: none; }
.lg3-box-on { background: linear-gradient(180deg, #FFCB8E 0 26%, #F2A85C 26% 100%); border-color: #C97F35;
  opacity: 1; animation: d23pop 0.32s ease-out both; }
@keyframes d23pop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
.lg3-rest { display: inline-flex; gap: clamp(4px, 1vw, 7px); align-items: center; padding: clamp(4px, 1vw, 7px) clamp(8px, 1.8vw, 13px);
  border-radius: 999px; background: #FDECE7; border: 1.5px dashed #E0563A; }
.lg3-kg { width: clamp(11px, 1.9vw, 15px); height: clamp(11px, 1.9vw, 15px); border-radius: 50%;
  background: #E0563A; border: 1.2px solid #B33F27; }

.lg3-fig { display: block; margin: 0 auto; }
.lg3-figrow { display: flex; align-items: center; justify-content: center; gap: clamp(10px, 2.4vw, 18px); flex-wrap: wrap; }
.lg3-frac { display: inline-flex; flex-direction: column; align-items: center; line-height: 1.05;
  font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(20px, 3.4vw, 27px); }
.lg3-frac-top { color: #2E7E9E; }
.lg3-frac-bar { display: block; width: clamp(24px, 4vw, 32px); height: 2.4px; background: #5D5A52; margin: 3px 0; border-radius: 2px; }
.lg3-frac-bot { color: #C97F35; }
.lg3-fracname { font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.6vw, 12px); font-weight: 800; letter-spacing: 0.4px; }

/* Yangi uslub yo'q: hamma qoida 24-darsdan ko'chib keldi va nomi almashtirildi. */

.lg3-pair { display: inline-flex; align-items: center; justify-content: center; gap: clamp(8px, 2vw, 16px); flex-wrap: nowrap; }
.lg3-pair-one { display: inline-flex; flex-direction: column; align-items: center; gap: 4px; }
.lg3-pair-cap { font-size: clamp(13px, 2.2vw, 17px); font-weight: 800; color: #5D5A52; }
.lg3-pair-sign { font-size: clamp(20px, 3.6vw, 28px); font-weight: 800; color: #C97F35; min-width: clamp(18px, 3vw, 26px); text-align: center; }

/* Yangi uslub yo'q: hamma qoida oldingi darsdan ko'chib keldi va nomi almashtirildi. */

/* Yangi uslub yo'q: juftlik uslublari oldingi darsdan ko'chib keldi. */

/* Yangi uslub yo'q: juftlik uslublari oldingi darsdan ko'chib keldi. */

/* Yangi uslub yo'q: juftlik uslublari oldingi darsdan ko'chib keldi. */

/* Yangi uslub yo'q: juftlik uslublari oldingi darsdan ko'chib keldi. */

/* Yangi uslub yo'q: juftlik uslublari oldingi darsdan ko'chib keldi. */

/* Yangi uslub yo'q: figuralar kitdan keladi va CSS ga bog'liq emas. */

/* Yangi uslub yo'q: figuralar kitdan keladi va CSS ga bog'liq emas. */

/* Yangi uslub yo'q: figuralar kitdan keladi va CSS ga bog'liq emas. */
`;
