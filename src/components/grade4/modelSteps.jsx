/* eslint-disable react-refresh/only-export-components -- Companion hook, layout and styles intentionally share one public module. */
// Общий шаг-за-шагом разбор модели для теоретических уроков 4 класса.
//
// Зачем: ETALON_4SINF.md §4 требует наблюдаемого действия ученика на каждом
// содержательном экране. Экран, который сам себя показывает под озвучку, этого
// требования не выполняет — ребёнок смотрит, а не действует. Эталонный урок 1
// решает это так: объяснение разбито на шаги, и каждый шаг открывает сам
// ученик (AnimatedExplanationScreen в Dars01.jsx).
//
// Модуль не знает про LangContext конкретного урока: `t` и уже переведённые
// подписи передаются снаружи. Так один и тот же разбор работает в уроках с
// разными наборами цветов и своими провайдерами языка.
import { useState } from 'react';

// Уроки держат озвучку как { uz: [...], ru: [...], en: [...] }, а шагу нужен
// один трёхъязычный объект.
export const grade4StepNarrations = (audioValue) => {
  const length = audioValue?.uz?.length ?? 0;
  return Array.from({ length }, (_, index) => ({
    uz: audioValue?.uz?.[index] ?? '',
    ru: audioValue?.ru?.[index] ?? '',
    en: audioValue?.en?.[index] ?? '',
  }));
};

// narrations — по одному сегменту озвучки на шаг; audio — результат useAudio/
// useNarration урока; t — переводчик урока.
export function useGrade4ModelSteps({ narrations, audio, t, startRevealed = false }) {
  // startRevealed: ученик уже проходил этот экран и вернулся назад. Тогда
  // модель остаётся открытой, а не закрывается заново.
  const [visited, setVisited] = useState(() => (
    startRevealed ? new Set(narrations.map((_, index) => index)) : new Set()
  ));
  const [phase, setPhase] = useState(startRevealed ? narrations.length - 1 : null);
  const total = narrations.length;

  // Шаги открываются только по порядку: перескок вперёд ломает логику разбора.
  const reveal = (index) => {
    if (index > visited.size && !visited.has(index)) return;
    setPhase(index);
    setVisited((previous) => {
      if (previous.has(index)) return previous;
      const next = new Set(previous);
      next.add(index);
      return next;
    });
    const narration = narrations[index];
    if (narration && audio?.pushOneOff) audio.pushOneOff(t(narration));
  };

  const replay = () => {
    setVisited(new Set());
    setPhase(null);
  };

  return {
    phase,
    visited,
    revealed: visited.size,
    // beat совместим с визуальными компонентами уроков: они показывают
    // элемент с индексом i при beat >= i. До первого шага beat = -1,
    // то есть модель закрыта и ученику есть что открывать.
    beat: visited.size - 1,
    total,
    done: visited.size === total,
    reveal,
    replay,
  };
}

export function Grade4ModelTimeline({
  steps,
  phase,
  visited,
  onReveal,
  onReplay,
  startPrompt,
  resultText,
  replayLabel,
  stepWordLabel,
}) {
  const done = visited.size === steps.length;
  return (
    <div className="g4-steps" data-g4-role="model-steps">
      <p className="g4-steps-prompt" role="status">
        {done && resultText ? resultText : startPrompt}
      </p>
      <div className="g4-steps-track">
        {steps.map((label, index) => (
          <button
            type="button"
            key={label}
            className={`g4-step ${index === phase ? 'g4-step-active' : ''} ${visited.has(index) ? 'g4-step-visited' : ''} ${phase === null && index === 0 ? 'g4-step-awaiting' : ''}`}
            disabled={index > visited.size && !visited.has(index)}
            aria-label={`${stepWordLabel} ${index + 1}. ${label}`}
            aria-current={index === phase ? 'step' : undefined}
            onClick={() => onReveal(index)}
          >
            <span aria-hidden="true">{visited.has(index) ? '✓' : index + 1}</span>
            <strong>{label}</strong>
          </button>
        ))}
      </div>
      {done && onReplay && (
        <button type="button" className="g4-steps-replay" onClick={onReplay}>
          <span aria-hidden="true">↻</span> {replayLabel}
        </button>
      )}
    </div>
  );
}

// CSS отдаётся строкой: у каждого урока свой блок <style>, но правила разбора
// должны быть одни и те же. T — палитра урока.
export const grade4ModelStepsCss = (T) => `
.g4-steps { display: grid; gap: 8px; }
.g4-steps-prompt {
  min-height: 34px;
  padding: 8px 12px;
  border-radius: 12px;
  color: ${T.navy};
  background: ${T.cyanSoft};
  font: 700 13px/1.35 Manrope, system-ui, sans-serif;
}
.g4-steps-track { display: grid; gap: 8px; grid-auto-columns: minmax(0, 1fr); grid-auto-flow: column; }
.g4-step {
  min-width: 44px;
  min-height: 44px;
  padding: 7px 9px;
  border: 0;
  border-radius: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: ${T.ink2};
  background: ${T.paper};
  box-shadow: inset 0 0 0 2px rgba(80, 97, 109, .14);
  text-align: left;
  transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
}
.g4-step > span {
  flex: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: ${T.ink3};
  background: rgba(80, 97, 109, .12);
  font: 900 11px/1 'JetBrains Mono', monospace;
}
/* overflow-wrap обязателен: длинная подпись («Выравнивание») не влезала в свою
   колонку и давала горизонтальный скролл всей сцены на 360 px. */
.g4-step > strong { min-width: 0; overflow-wrap: anywhere; font: 800 11.5px/1.2 Manrope, system-ui, sans-serif; }
.g4-step:disabled { cursor: not-allowed; opacity: .48; }
.g4-step:not(:disabled):hover { transform: translateY(-2px); }
.g4-step-awaiting { box-shadow: inset 0 0 0 2px ${T.accent}; animation: g4StepPulse 1.7s ease-in-out infinite; }
.g4-step-visited { color: ${T.navy}; background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34, 122, 83, .3); }
.g4-step-visited > span { color: #fff; background: ${T.success}; }
.g4-step-active { color: #fff; background: ${T.navy}; box-shadow: inset 0 0 0 2px ${T.cyan}; }
.g4-step-active > span { color: ${T.navy}; background: #fff; }
.g4-steps-replay {
  justify-self: start;
  min-height: 44px;
  padding: 0 15px;
  border: 0;
  border-radius: 13px;
  cursor: pointer;
  color: ${T.navy};
  background: ${T.warnSoft};
  font: 850 12px/1 Manrope, system-ui, sans-serif;
}
@keyframes g4StepPulse {
  0%, 100% { box-shadow: inset 0 0 0 2px ${T.accent}; }
  50% { box-shadow: inset 0 0 0 2px ${T.accent}, 0 0 0 5px rgba(255, 91, 53, .16); }
}
@media (max-width: 639.98px) {
  .g4-steps { gap: 4px; }
  .g4-steps-prompt { min-height: 24px; padding: 4px 8px; font-size: 11px; line-height: 1.25; }
  .g4-steps-track { gap: 4px; }
  /* На узком экране номер встаёт над подписью: подписи достаётся вся ширина
     колонки, а высота остаётся в пределах уже заданных 44 px. */
  .g4-step { min-height: 44px; padding: 4px 6px; border-radius: 10px; gap: 1px; flex-direction: column; align-items: flex-start; justify-content: center; }
  .g4-step > span { width: 18px; height: 18px; font-size: 10px; }
  .g4-step > strong { font-size: 11px; }
  .g4-steps-replay { min-height: 44px; padding: 0 10px; font-size: 11px; }
}
@media (prefers-reduced-motion: reduce) {
  .g4-step, .g4-step-awaiting { animation: none !important; transition: none !important; }
  .g4-step:not(:disabled):hover { transform: none; }
}
`;
