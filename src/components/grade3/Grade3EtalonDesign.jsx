const COACH_COPY = {
  pick: {
    uz: {
      eyebrow: 'Namunaviy savol',
      title: 'Misolni kuzating va javobni tanlang',
      text: "Avval shart va ko'rgazmani tahlil qiling, keyin javob kartasini bosing.",
    },
    ru: {
      eyebrow: 'Образец задания',
      title: 'Рассмотрите пример и выберите ответ',
      text: 'Сначала изучите условие и модель, затем нажмите карточку ответа.',
    },
  },
  verify: {
    uz: {
      eyebrow: 'Xatoni topish',
      title: 'Yechimni bosqichma-bosqich tekshiring',
      text: "Har bir qadamni qoida bilan solishtirib, to'g'ri xulosani tanlang.",
    },
    ru: {
      eyebrow: 'Найди ошибку',
      title: 'Проверьте решение по шагам',
      text: 'Сравните каждый шаг с правилом и выберите верный вывод.',
    },
  },
  case: {
    uz: {
      eyebrow: 'Hayotiy masala',
      title: 'Vaziyatni matematik modelga aylantiring',
      text: "Kerakli ma'lumotni ajrating, amalni tanlang va javobni tekshiring.",
    },
    ru: {
      eyebrow: 'Практическая задача',
      title: 'Постройте математическую модель ситуации',
      text: 'Выделите данные, выберите действие и проверьте ответ.',
    },
  },
  final: {
    uz: {
      eyebrow: 'Mustaqil nazorat',
      title: 'Savolni mustaqil yeching',
      text: "Namunani eslang, lekin javobni o'zingiz toping.",
    },
    ru: {
      eyebrow: 'Самостоятельная проверка',
      title: 'Решите задание самостоятельно',
      text: 'Вспомните образец, но найдите ответ сами.',
    },
  },
};

export function Grade3QuestionCoach({ lang = 'uz', mode = 'pick', first = false }) {
  const copy = COACH_COPY[mode]?.[lang] || COACH_COPY.pick.uz;

  return (
    <div className={`grade3-question-coach grade3-question-coach-${mode}${first ? ' is-first' : ''}`} role="note">
      <span className="grade3-question-coach-icon" aria-hidden="true">
        {mode === 'verify' ? '🔎' : mode === 'case' ? '🧩' : mode === 'final' ? '🎯' : '👀'}
      </span>
      <div>
        <em className="mono">{copy.eyebrow}</em>
        <b>{copy.title}</b>
        <p>{copy.text}</p>
      </div>
      <span className="grade3-question-coach-flow mono" aria-hidden="true">1 → 2</span>
    </div>
  );
}

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
}
.stage-nav {
  background: rgba(248,247,243,0.9) !important;
  backdrop-filter: blur(14px);
  box-shadow: 0 -12px 30px -28px rgba(23,46,69,0.5);
  padding-bottom: max(clamp(11px,2vw,14px), env(safe-area-inset-bottom)) !important;
}
.stage-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(255,79,40,0.42) transparent;
}
.stage-content::-webkit-scrollbar { width: 6px; }
.stage-content::-webkit-scrollbar-thumb {
  background: rgba(255,79,40,0.38);
  border-radius: 99px;
}
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

.grade3-question-coach {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: auto minmax(0,1fr) auto;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 16px;
  background: linear-gradient(135deg, #EEF8FC, #F8FBFC);
  border: 1px solid rgba(1,154,203,0.17);
  margin-bottom: clamp(10px,1.7vw,14px);
}
.grade3-question-coach.is-first {
  box-shadow: 0 12px 26px -22px rgba(1,123,163,0.7);
}
.grade3-question-coach-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 11px;
  background: #FFFFFF;
  font-size: 18px;
  box-shadow: 0 7px 16px -12px rgba(23,46,69,0.6);
}
.grade3-question-coach em {
  display: block;
  color: #FF4F28;
  font-size: 9px;
  font-style: normal;
  font-weight: 850;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.grade3-question-coach b {
  display: block;
  color: #15344B;
  font-size: clamp(11px,1.55vw,13px);
}
.grade3-question-coach p {
  margin-top: 2px !important;
  color: #5A5A60;
  font-size: clamp(10px,1.35vw,12px);
  line-height: 1.3;
  font-weight: 620;
}
.grade3-question-coach-flow {
  padding: 5px 8px;
  border-radius: 9px;
  background: #15344B;
  color: #FFFFFF;
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
}
.grade3-question-coach-case {
  background: linear-gradient(135deg,#FFF6EF,#FFF9F4);
  border-color: rgba(255,79,40,0.18);
}
.grade3-question-coach-case .grade3-question-coach-flow {
  background: #9D3D28;
}
.grade3-question-coach-final {
  background: linear-gradient(135deg,#EEF8F1,#F7FBF8);
  border-color: rgba(31,122,77,0.19);
}
.grade3-question-coach-final em { color: #1F7A4D; }
.grade3-question-coach-final .grade3-question-coach-flow {
  background: #1F7A4D;
}
.g3-method-guide + .grade3-question-coach,
.ux-slide-guide + .grade3-question-coach {
  margin-top: -5px;
}
/* Dars02 ichidagi eski lokal coach o'rniga hamma darsdagi yagona coach ko'rinadi. */
.stage-content > .grade3-question-coach ~ * .d2-question-coach {
  display: none !important;
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
  .grade3-question-coach {
    grid-template-columns: auto minmax(0,1fr);
    gap: 8px;
    padding: 8px 9px;
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
  .grade3-question-coach-flow { display: none; }
  .grade3-question-coach p { font-size: 10px; }
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

@media (prefers-reduced-motion: reduce) {
  .progress-bar::after { display: none; }
  .option { transition: none !important; }
  .option:hover:not(:disabled) { transform: none; }
}

@media (forced-colors: active) {
  .option,
  .frame,
  .grade3-question-coach,
  .grade3-screen-type {
    border: 1px solid CanvasText !important;
  }
  .progress-bar { background: Highlight !important; }
}
`;
