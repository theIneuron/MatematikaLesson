const SCREEN_TYPE_COPY = {
  hook: { icon: '✦', uz: 'Boshlanish', ru: 'Старт' },
  exploration: { icon: '◉', uz: 'Kashfiyot', ru: 'Открытие' },
  rule: { icon: '◆', uz: 'Qoida', ru: 'Правило' },
  test: { icon: '✓', uz: 'Mashq', ru: 'Практика' },
  case: { icon: '▦', uz: 'Masala', ru: 'Задача' },
  summary: { icon: '★', uz: 'Yakun', ru: 'Итог' },
};

export function Grade3ScreenType({ screenMeta, lang = 'uz' }) {
  const type = screenMeta?.scope === 'final' && screenMeta?.type === 'test'
    ? 'final'
    : screenMeta?.type || 'exploration';
  const copy = type === 'final'
    ? { icon: '◎', uz: 'Nazorat', ru: 'Проверка' }
    : SCREEN_TYPE_COPY[type] || SCREEN_TYPE_COPY.exploration;

  return (
    <span className={`grade3-screen-type grade3-screen-type-${type}`}>
      <span aria-hidden="true">{copy.icon}</span>
      <span>{copy[lang] || copy.uz}</span>
    </span>
  );
}

export function Grade3Progress({ current, total, lang = 'uz' }) {
  const value = Math.min(total, Math.max(1, current + 1));
  const percent = total > 0 ? (value / total) * 100 : 0;
  const label = lang === 'uz'
    ? `${value}-ekran, jami ${total} ta`
    : `Экран ${value} из ${total}`;

  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-label={lang === 'uz' ? 'Dars jarayoni' : 'Прогресс урока'}
      aria-valuemin="1"
      aria-valuemax={total}
      aria-valuenow={value}
      aria-valuetext={label}
      title={label}
    >
      <div className="progress-bar" style={{ width: `${percent}%` }}/>
    </div>
  );
}

export const GRADE3_ETALON_STYLES = `
/* Dars02 etaloni: barcha 3-sinf savollari uchun yagona vizual tizim. */
.lesson-root {
  color-scheme: light;
  -webkit-tap-highlight-color: transparent;
  background:
    radial-gradient(circle at 14% 10%, rgba(1,154,203,0.075), transparent 28%),
    radial-gradient(circle at 88% 78%, rgba(255,79,40,0.075), transparent 30%),
    linear-gradient(155deg, #F8F7F3 0%, #F4F1EA 100%) !important;
}

.stage { max-width: 1040px !important; }
.stage-header {
  background: rgba(248,247,243,0.88) !important;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(167,166,162,0.12);
  padding-left: 176px !important;
}
.stage-nav {
  background: rgba(248,247,243,0.9) !important;
  backdrop-filter: blur(14px);
  box-shadow: 0 -12px 30px -28px rgba(23,46,69,0.5);
  padding-bottom: max(clamp(11px,2vw,14px), env(safe-area-inset-bottom)) !important;
}
.stage-content {
  overflow: hidden !important;
  overscroll-behavior: none;
  scrollbar-width: none;
}
.stage-content::-webkit-scrollbar { display: none; }
.stage-exploration .stage-content,
.stage-rule .stage-content,
.stage-hook .stage-content {
  scrollbar-width: none;
}
.stage-exploration .stage-content::-webkit-scrollbar,
.stage-rule .stage-content::-webkit-scrollbar,
.stage-hook .stage-content::-webkit-scrollbar { display: none; }

.progress-track {
  position: relative;
  width: 100%;
  height: 7px !important;
  margin-bottom: 11px !important;
  overflow: hidden !important;
  border-radius: 99px;
  background: rgba(167,166,162,0.22) !important;
  box-shadow: inset 0 1px 2px rgba(58,53,48,0.08);
}
.progress-bar {
  position: relative;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
  background: linear-gradient(90deg,#FF6A3D,#FF4F28) !important;
  box-shadow: 0 0 10px rgba(255,79,40,0.5);
  transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
}
.progress-bar::after {
  content: '';
  position: absolute;
  inset: 0;
  width: 40%;
  background: linear-gradient(90deg,transparent,rgba(255,255,255,0.72),transparent);
  animation: grade3ProgressShine 2.8s ease-in-out infinite;
}
@keyframes grade3ProgressShine {
  0%,28% { transform: translateX(-130%); opacity: 0; }
  45% { opacity: 1; }
  72%,100% { transform: translateX(310%); opacity: 0; }
}

.chrome { min-height: 30px; }
.chrome-left { min-width: 0; }
.chrome-left > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.grade3-screen-type {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 28px;
  padding: 4px 8px;
  border-radius: 99px;
  border: 1px solid rgba(1,154,203,0.15);
  background: rgba(234,246,251,0.76);
  color: #017BA3;
  font: 800 10px 'Manrope',sans-serif;
  letter-spacing: 0.025em;
  white-space: nowrap;
}
.grade3-screen-type > span:first-child {
  font-family: 'JetBrains Mono',monospace;
  font-size: 11px;
}
.grade3-screen-type-hook,
.grade3-screen-type-case {
  border-color: rgba(255,79,40,0.16);
  background: rgba(255,243,233,0.78);
  color: #C0392B;
}
.grade3-screen-type-test {
  border-color: rgba(216,169,58,0.2);
  background: rgba(251,243,214,0.8);
  color: #7D641E;
}
.grade3-screen-type-final {
  border-color: rgba(31,122,77,0.2);
  background: rgba(227,240,232,0.84);
  color: #1F7A4D;
}
.grade3-screen-type-summary {
  border-color: rgba(31,122,77,0.2);
  background: rgba(227,240,232,0.84);
  color: #1F7A4D;
}

.frame {
  border-radius: 22px !important;
  border: 1px solid rgba(1,154,203,0.13) !important;
  background: linear-gradient(145deg, rgba(255,255,255,0.98), rgba(249,251,251,0.96)) !important;
  box-shadow: 0 22px 48px -32px rgba(23,46,69,0.42), inset 0 1px rgba(255,255,255,0.9) !important;
}
.stage-test .frame,
.stage-case .frame {
  width: min(780px, 100%);
  align-self: center;
}

.option {
  position: relative;
  background: linear-gradient(145deg, #FFFFFF 0%, #FCFBF8 100%) !important;
  border: 1px solid rgba(167,166,162,0.17) !important;
  border-radius: 14px !important;
  box-shadow: 0 6px 16px -6px rgba(58,53,48,0.14) !important;
  transition: transform 0.18s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease !important;
}
.option:hover:not(:disabled) {
  background: #FFFFFF !important;
  border-color: rgba(1,154,203,0.28) !important;
  box-shadow: 0 14px 28px -10px rgba(58,53,48,0.3), 0 0 0 3px rgba(1,154,203,0.06) !important;
  transform: translateY(-3px);
}
.option:active:not(:disabled) { transform: translateY(0) scale(0.985); }
.option:focus-visible,
.btn-white-accent:focus-visible,
.btn-ghost:focus-visible {
  outline: 3px solid rgba(1,154,203,0.42);
  outline-offset: 3px;
}
.btn-white-accent,
.btn-ghost,
.option,
.answer-input,
.numpad button {
  touch-action: manipulation;
}
.btn-white-accent,
.btn-ghost {
  min-height: 46px;
}
.btn-white-accent:active:not(:disabled),
.btn-ghost:active:not(:disabled) {
  transform: translateY(0) scale(0.975);
}
.btn-white-accent.btn-ready {
  background: linear-gradient(135deg,#FF5E34,#FF4521) !important;
  color: #FFFFFF !important;
  box-shadow: 0 12px 28px -7px rgba(255,79,40,0.52),0 0 0 1px rgba(255,79,40,0.22) !important;
}
.option-correct {
  border-color: rgba(31,122,77,0.28) !important;
  background: linear-gradient(145deg,#F0F9F3,#DDF1E5) !important;
}
.option-picked-wrong {
  border-color: rgba(216,169,58,0.3) !important;
  background: linear-gradient(145deg,#FFF9E8,#FBF0C8) !important;
}

.stage-hook .option > .mono.small:first-child,
.stage-test .option > .mono.small:first-child,
.stage-case .option > .mono.small:first-child,
.grade3-answer-letter {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  min-width: 28px !important;
  border-radius: 9px;
  background: #EDF3F6;
  color: #536673 !important;
  font-size: 11px !important;
  font-weight: 850;
}
.option-correct > .mono.small:first-child,
.option-correct .grade3-answer-letter {
  background: #1F7A4D;
  color: #FFFFFF !important;
}
.option-picked-wrong > .mono.small:first-child,
.option-picked-wrong .grade3-answer-letter {
  background: #D8A93A;
  color: #FFFFFF !important;
}

.grade3-question-figure {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 76px;
  padding: 8px 12px;
  border-radius: 16px;
  background: linear-gradient(135deg,#FFF9F4,#F4F9FB);
  border: 1px dashed rgba(1,154,203,0.2);
}
.grade3-answer-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(var(--answer-cols,2), minmax(0,1fr));
  gap: 11px;
  width: 100%;
}
.grade3-answer-card {
  display: flex !important;
  align-items: center;
  gap: 9px;
  min-height: 58px;
  padding: 10px 12px !important;
  text-align: left !important;
  font-family: 'Manrope', sans-serif !important;
  font-size: clamp(13px,1.7vw,15px) !important;
  font-weight: 750 !important;
}
.grade3-answer-grid > .option {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 9px;
  min-height: 58px !important;
  padding: 10px 12px !important;
  text-align: left !important;
  font-family: 'Manrope', sans-serif !important;
  font-size: clamp(13px,1.7vw,15px) !important;
  font-weight: 750 !important;
}
.grade3-answer-grid > .option::before {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  background: #EDF3F6;
  color: #536673;
  font: 850 11px 'JetBrains Mono', monospace;
}
.grade3-answer-grid > .option:nth-child(1)::before { content: 'A'; }
.grade3-answer-grid > .option:nth-child(2)::before { content: 'B'; }
.grade3-answer-grid > .option:nth-child(3)::before { content: 'C'; }
.grade3-answer-grid > .option:nth-child(4)::before { content: 'D'; }
.grade3-answer-grid > .option.option-correct::before {
  background: #1F7A4D;
  color: #FFFFFF;
}
.grade3-answer-grid > .option.option-picked-wrong::before {
  background: #D8A93A;
  color: #FFFFFF;
}
.grade3-answer-card > span:last-child {
  flex: 1;
  min-width: 0;
  text-align: center;
}
.grade3-bottom-feedback {
  width: min(780px,100%);
  align-self: center;
}

.frame-success,
.frame-tip,
.frame-soft {
  position: relative;
  width: min(780px,100%);
  align-self: center;
  border-radius: 16px !important;
  padding: clamp(13px,2.4vw,17px) clamp(14px,2.8vw,19px) !important;
}
.frame-success {
  border: 1px solid rgba(31,122,77,0.2) !important;
  border-left: 5px solid #1F7A4D !important;
  background: linear-gradient(135deg,#E8F6ED,#DCEFE3) !important;
  box-shadow: 0 14px 30px -24px rgba(31,122,77,0.55) !important;
}
.frame-tip {
  border: 1px solid rgba(216,169,58,0.22) !important;
  border-left: 5px solid #D8A93A !important;
  background: linear-gradient(135deg,#FFF9E8,#F9EFCB) !important;
  box-shadow: 0 14px 30px -24px rgba(180,138,30,0.5) !important;
}
.frame-soft {
  border: 1px solid rgba(255,79,40,0.18) !important;
  border-left: 5px solid #FF4F28 !important;
  background: linear-gradient(135deg,#FFF2EC,#FFE5DB) !important;
  box-shadow: 0 14px 30px -24px rgba(255,79,40,0.5) !important;
}
.answer-input {
  min-height: 48px;
  border: 1px solid rgba(167,166,162,0.2) !important;
  border-radius: 13px !important;
}
.answer-input:focus {
  outline: 3px solid rgba(1,154,203,0.2);
  outline-offset: 2px;
  border-color: rgba(1,154,203,0.34) !important;
}

@media (max-width: 639.98px) {
  .stage { max-width: 390px !important; }
  .frame { border-radius: 18px !important; }
  .stage-header {
    padding-left: 134px !important;
  }
  .grade3-screen-type {
    width: 28px;
    min-width: 28px;
    justify-content: center;
    padding: 4px;
  }
  .grade3-screen-type > span:last-child { display: none; }
  .chrome > div:last-child { gap: 8px !important; }
  .stage-header {
    padding-top: max(9px,env(safe-area-inset-top)) !important;
  }
  .grade3-answer-grid { gap: 8px; }
  .grade3-answer-card {
    min-height: 64px;
    padding: 8px !important;
    gap: 6px;
  }
  .grade3-answer-grid > .option {
    min-height: 64px !important;
    padding: 8px !important;
    gap: 6px;
  }
  .grade3-answer-grid > .option::before {
    width: 24px;
    height: 24px;
    border-radius: 8px;
  }
  .grade3-answer-letter {
    width: 24px;
    height: 24px;
    min-width: 24px !important;
    border-radius: 8px;
  }
}

/* The legacy shell lays out at 390px and is visually zoomed below that width.
   Reserve in layout coordinates so the fixed global back button still clears
   the header after zoom is applied. */
@media (max-width: 374px) {
  .stage-header {
    padding-left: 166px !important;
  }
}

/* Compact QA/phone viewport: this shared block is intentionally placed after
   the etalon declarations so it also wins when lesson-local CSS is injected
   before GRADE3_ETALON_STYLES. Essential task content stays in one viewport. */
@media (max-width: 639.98px), (max-height: 720px) {
  .stage-header {
    padding-top: max(5px, env(safe-area-inset-top)) !important;
    padding-bottom: 3px !important;
  }
  .chrome { min-height: 24px !important; }
  .progress-track {
    height: 4px !important;
    margin-bottom: 5px !important;
  }
  .stage-content {
    min-height: 0 !important;
    overflow: hidden !important;
    padding-top: 3px !important;
    padding-bottom: 3px !important;
    scrollbar-width: none !important;
  }
  .stage-content::-webkit-scrollbar { display: none !important; }
  .stage-nav {
    gap: 8px !important;
    padding-top: 4px !important;
    padding-bottom: max(4px, env(safe-area-inset-bottom)) !important;
  }
  .stage-nav button,
  .btn-white-accent,
  .btn-ghost {
    min-height: 40px !important;
    padding-top: 7px !important;
    padding-bottom: 7px !important;
  }
  .stage-content .frame,
  .stage-content .frame-soft,
  .stage-content .frame-tip,
  .stage-content .frame-success {
    padding: 8px !important;
  }
  .stage-content .option {
    min-height: 40px !important;
    padding: 7px 10px !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .progress-bar::after { display: none; }
  .option { transition: none !important; }
  .option:hover:not(:disabled) { transform: none; }
}

@media (forced-colors: active) {
  .option,
  .frame,
  .grade3-screen-type {
    border: 1px solid CanvasText !important;
  }
  .progress-bar { background: Highlight !important; }
}
`;
