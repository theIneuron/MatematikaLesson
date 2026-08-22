/* eslint-disable react-refresh/only-export-components -- Companion layout and styles intentionally share one public module. */
// Адаптивная опора после повторных ошибок — общая для теоретических уроков
// 4 класса.
//
// Контракт: ETALON_4SINF.md §7, пункт 5 — «после повторных ошибок показывает
// только необходимую опору». До этого уроки 11 и 12 давали лишь разбор
// выбранного варианта: ребёнок, ошибившийся дважды, получал тот же текст
// второй раз и упирался в тупик.
//
// Опора появляется на второй ошибке, а не на первой: первая ошибка — это ещё
// проба, и разбор варианта должен успеть сработать сам. Опора называет
// признак, по которому надо проверить, и не даёт готового ответа.
export const GRADE4_SUPPORT_HINT_AFTER = 2;

export function Grade4SupportHint({ wrongTries, solved, text, label }) {
  const show = !solved && wrongTries >= GRADE4_SUPPORT_HINT_AFTER && Boolean(text);
  if (!show) return null;
  return (
    <div className="g4-support" role="status" data-g4-role="support-hint">
      <strong>{label}</strong>
      <p>{text}</p>
    </div>
  );
}

export const grade4SupportHintCss = (T) => `
.g4-support {
  margin-top: 8px;
  padding: 10px 13px;
  border-radius: 13px;
  display: grid;
  gap: 4px;
  color: ${T.navy};
  background: ${T.warnSoft};
  box-shadow: inset 0 0 0 2px rgba(169, 111, 19, .22);
  animation: g4SupportIn .32s ease both;
}
.g4-support > strong {
  color: ${T.warn};
  font: 900 9.5px/1 'JetBrains Mono', monospace;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.g4-support > p { font: 700 12.5px/1.4 Manrope, system-ui, sans-serif; }
@keyframes g4SupportIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: none; }
}
@media (max-width: 639.98px) {
  .g4-support { margin-top: 5px; padding: 6px 8px; border-radius: 10px; }
  .g4-support > strong { font-size: 8px; }
  .g4-support > p { font-size: 9.5px; line-height: 1.3; }
}
@media (prefers-reduced-motion: reduce) {
  .g4-support { animation: none; }
}
`;
