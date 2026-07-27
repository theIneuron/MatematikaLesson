const COLORS = {
  accent: '#FF4F28',
  ink: '#0E0E10',
  line: '#A7A6A2',
  paper: '#FFFFFF',
  ok: '#1F7A4D',
  okSoft: '#E3F0E8',
  no: '#B9382F',
  noSoft: '#FDECEC',
};

const CSS = `
  .g3-lesson-numpad {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    width: min(228px, 100%);
    margin-inline: auto;
    padding: 18px 10px 11px;
    border: 1px solid rgba(63, 74, 88, 0.16);
    border-radius: 25px;
    background: linear-gradient(155deg, #E9EDF1, #D9DEE4);
    box-shadow:
      0 18px 34px -24px rgba(38, 49, 62, 0.65),
      inset 0 1px rgba(255, 255, 255, 0.9);
  }
  .g3-lesson-numpad__speaker {
    position: absolute;
    top: 8px;
    width: 42px;
    height: 4px;
    border-radius: 99px;
    background: #A9B1BA;
  }
  .g3-lesson-numpad__display {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    height: clamp(50px, 9vw, 54px);
    padding: 0 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 3px solid var(--g3-numpad-display-border);
    border-radius: 15px;
    background: var(--g3-numpad-display-bg);
    color: var(--g3-numpad-display-color);
    box-shadow: inset 0 2px 8px rgba(58, 53, 48, 0.08);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: clamp(28px, 5vw, 34px);
    font-weight: 800;
    letter-spacing: 5px;
    font-variant-numeric: tabular-nums;
    transition: border-color .2s ease, background .2s ease, color .2s ease;
  }
  .g3-lesson-numpad__grid {
    display: grid;
    grid-template-columns: repeat(3, auto);
    gap: 6px;
  }
  .g3-lesson-numpad__key,
  .g3-lesson-numpad__spacer {
    width: clamp(50px, 9vw, 54px);
    height: clamp(42px, 7vw, 44px);
  }
  .g3-lesson-numpad__key {
    padding: 0;
    border: 2px solid ${COLORS.line};
    border-radius: 13px;
    background: ${COLORS.paper};
    color: ${COLORS.ink};
    box-shadow:
      0 5px 11px -7px rgba(38, 49, 62, 0.55),
      inset 0 1px rgba(255, 255, 255, 0.9);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: clamp(21px, 4vw, 25px);
    font-weight: 800;
    cursor: pointer;
    transition: transform .16s ease, box-shadow .18s ease, border-color .18s ease, opacity .18s ease;
  }
  .g3-lesson-numpad__key:hover:not(:disabled) {
    transform: translateY(-2px);
    border-color: #019ACB;
    box-shadow: 0 10px 18px -10px rgba(1, 154, 203, 0.5);
  }
  .g3-lesson-numpad__key:active:not(:disabled) {
    transform: scale(.95);
  }
  .g3-lesson-numpad__key:focus-visible {
    outline: 3px solid rgba(1, 154, 203, .3);
    outline-offset: 2px;
  }
  .g3-lesson-numpad__key:disabled {
    cursor: default;
    opacity: .62;
  }
  .g3-lesson-numpad__back {
    border-color: rgba(255, 79, 40, .34);
    background: #FFF3E9;
    color: ${COLORS.accent};
    font-size: 22px;
  }
  @media (prefers-reduced-motion: reduce) {
    .g3-lesson-numpad__key,
    .g3-lesson-numpad__display {
      transition: none;
    }
  }
`;

export default function LessonNumPad({
  value,
  setValue,
  disabled = false,
  max = 3,
  tone = 'idle',
  ariaLabel = 'Raqamli telefon klaviaturasi',
}) {
  const currentValue = String(value ?? '');
  const limit = Math.max(1, Number(max) || 1);
  const push = (digit) => {
    if (disabled) return;
    setValue((current) => {
      const text = String(current ?? '');
      return text.length >= limit ? text : text + digit;
    });
  };
  const back = () => {
    if (disabled) return;
    setValue((current) => String(current ?? '').slice(0, -1));
  };
  const toneColors = tone === 'ok'
    ? { border: COLORS.ok, background: COLORS.okSoft, color: COLORS.ok }
    : tone === 'no'
      ? { border: COLORS.no, background: COLORS.noSoft, color: COLORS.no }
      : { border: COLORS.accent, background: COLORS.paper, color: COLORS.ink };

  return (
    <>
      <style>{CSS}</style>
      <div
        className="g3-lesson-numpad"
        role="group"
        aria-label={ariaLabel}
        style={{
          '--g3-numpad-display-border': toneColors.border,
          '--g3-numpad-display-bg': toneColors.background,
          '--g3-numpad-display-color': toneColors.color,
        }}
      >
        <span className="g3-lesson-numpad__speaker" aria-hidden="true" />
        <output className="g3-lesson-numpad__display" aria-live="polite">
          {currentValue || '—'}
        </output>
        <div className="g3-lesson-numpad__grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              className="g3-lesson-numpad__key"
              type="button"
              disabled={disabled}
              aria-label={`${digit}`}
              onClick={() => push(String(digit))}
            >
              {digit}
            </button>
          ))}
          <span className="g3-lesson-numpad__spacer" aria-hidden="true" />
          <button
            className="g3-lesson-numpad__key"
            type="button"
            disabled={disabled}
            aria-label="0"
            onClick={() => push('0')}
          >
            0
          </button>
          <button
            className="g3-lesson-numpad__key g3-lesson-numpad__back"
            type="button"
            disabled={disabled}
            aria-label="Oxirgi raqamni o'chirish"
            onClick={back}
          >
            ⌫
          </button>
        </div>
      </div>
    </>
  );
}
