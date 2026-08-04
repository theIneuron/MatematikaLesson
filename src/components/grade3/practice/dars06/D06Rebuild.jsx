import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const COLORS = {
  accent: '#FF4F28',
  accentSoft: '#FFF0EA',
  blue: '#0B78A5',
  blueSoft: '#E8F6FC',
  ink: '#172033',
  muted: '#667085',
  line: '#CBD5E1',
  paper: '#FFFFFF',
  stage: '#F7FAFC',
  ok: '#18794E',
  okSoft: '#E7F6EE',
  no: '#B9382F',
  noSoft: '#FDEDEC',
  gold: '#A45A00',
  goldSoft: '#FFF4D6',
};

const CSS = `
  .d6r-root {
    max-width: 720px;
    margin: 0 auto;
    padding: 4px 2px 10px;
    color: ${COLORS.ink};
  }
  .d6r-eyebrow {
    color: ${COLORS.accent};
    font-size: 12px;
    font-weight: 900;
    letter-spacing: .07em;
    text-transform: uppercase;
  }
  .d6r-setup {
    margin: 7px 0 12px;
    color: #475467;
    font-size: 16px;
    line-height: 1.5;
  }
  .d6r-ask {
    margin: 14px 0 12px;
    font-size: clamp(18px, 3vw, 21px);
    font-weight: 850;
    line-height: 1.35;
  }
  .d6r-stage {
    overflow: hidden;
    margin: 10px 0 15px;
    padding: clamp(13px, 3vw, 21px);
    border: 1px solid #D7E3EC;
    border-radius: 20px;
    background:
      radial-gradient(circle at 8% 10%, rgba(255, 205, 86, .19), transparent 24%),
      linear-gradient(145deg, #F7FCFF, #EEF7FB 58%, #FFF9EA);
  }
  .d6r-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
  }
  .d6r-option, .d6r-chip, .d6r-pair, .d6r-interval {
    min-height: 50px;
    border: 2px solid ${COLORS.line};
    border-radius: 14px;
    background: ${COLORS.paper};
    color: ${COLORS.ink};
    box-shadow: 0 6px 16px -13px rgba(16, 24, 40, .6);
    font: inherit;
    font-weight: 800;
    cursor: pointer;
    transition: transform .15s ease, border-color .15s ease, background .15s ease;
  }
  .d6r-option:hover:not(:disabled), .d6r-chip:hover:not(:disabled),
  .d6r-pair:hover:not(:disabled), .d6r-interval:hover:not(:disabled) {
    transform: translateY(-2px);
    border-color: ${COLORS.blue};
  }
  .d6r-option:focus-visible, .d6r-chip:focus-visible,
  .d6r-pair:focus-visible, .d6r-interval:focus-visible,
  .d6r-node-button:focus-visible {
    outline: 3px solid rgba(11, 120, 165, .24);
    outline-offset: 2px;
  }
  .d6r-option.is-picked, .d6r-chip.is-picked, .d6r-pair.is-picked,
  .d6r-interval.is-picked {
    border-color: ${COLORS.accent};
    background: ${COLORS.accentSoft};
  }
  .d6r-option:disabled, .d6r-chip:disabled, .d6r-pair:disabled,
  .d6r-interval:disabled, .d6r-node-button:disabled {
    cursor: default;
  }
  .d6r-line {
    position: relative;
    min-width: 0;
    padding: 19px 5px 0;
  }
  .d6r-line-axis {
    position: absolute;
    top: 48px;
    left: 4.4%;
    right: 1.5%;
    height: 3px;
    border-radius: 99px;
    background: #60758A;
  }
  .d6r-line-axis::after {
    content: '';
    position: absolute;
    right: -1px;
    top: -5px;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 11px solid #60758A;
  }
  .d6r-line-grid {
    position: relative;
    display: grid;
    align-items: start;
  }
  .d6r-node {
    position: relative;
    min-width: 0;
    height: 82px;
    text-align: center;
  }
  .d6r-node-button, .d6r-node-static {
    position: relative;
    display: block;
    width: 100%;
    height: 58px;
    padding: 0;
    border: 0;
    background: transparent;
    color: ${COLORS.ink};
  }
  .d6r-tick {
    position: absolute;
    top: 22px;
    left: 50%;
    width: 2px;
    height: 18px;
    border-radius: 99px;
    background: #60758A;
    transform: translateX(-50%);
  }
  .d6r-node.is-major .d6r-tick {
    top: 18px;
    width: 3px;
    height: 26px;
    background: #34495E;
  }
  .d6r-dot {
    position: absolute;
    z-index: 2;
    top: 24px;
    left: 50%;
    width: 14px;
    height: 14px;
    border: 4px solid ${COLORS.paper};
    border-radius: 50%;
    background: ${COLORS.accent};
    box-shadow: 0 0 0 2px ${COLORS.accent};
    transform: translate(-50%, -50%);
  }
  .d6r-dot.is-target {
    background: ${COLORS.blue};
    box-shadow: 0 0 0 2px ${COLORS.blue};
  }
  .d6r-dot.is-wrong {
    background: ${COLORS.no};
    box-shadow: 0 0 0 2px ${COLORS.no};
  }
  .d6r-marker {
    position: absolute;
    top: -6px;
    left: 50%;
    min-width: 28px;
    padding: 2px 5px;
    border-radius: 8px;
    background: ${COLORS.ink};
    color: white;
    font-size: 12px;
    font-weight: 900;
    transform: translateX(-50%);
    white-space: nowrap;
  }
  .d6r-marker.is-wrong { background: ${COLORS.no}; }
  .d6r-node-label {
    display: block;
    min-height: 20px;
    color: #40556A;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: clamp(11px, 2.1vw, 14px);
    font-weight: 800;
    white-space: nowrap;
  }
  .d6r-hint {
    margin-top: 9px;
    color: ${COLORS.muted};
    font-size: 13px;
    font-weight: 700;
    text-align: center;
  }
  .d6r-intervals {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(115px, 1fr));
    gap: 8px;
    margin-top: 4px;
  }
  .d6r-interval {
    min-height: 46px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
  }
  .d6r-section-label {
    display: block;
    margin: 12px 0 8px;
    color: ${COLORS.muted};
    font-size: 13px;
    font-weight: 850;
  }
  .d6r-match {
    display: grid;
    grid-template-columns: minmax(130px, .8fr) minmax(160px, 1.2fr);
    gap: 12px;
  }
  .d6r-match-col {
    display: grid;
    gap: 8px;
  }
  .d6r-pair {
    min-height: 52px;
    padding: 8px 10px;
  }
  .d6r-pair small {
    display: block;
    margin-top: 2px;
    color: ${COLORS.muted};
    font-weight: 700;
  }
  .d6r-order-zone {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 74px;
    padding: 11px;
    border: 2px dashed #B9C8D5;
    border-radius: 16px;
    background: rgba(255,255,255,.64);
  }
  .d6r-chip {
    min-width: 78px;
    padding: 8px 14px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 17px;
  }
  .d6r-arrow {
    color: ${COLORS.muted};
    font-weight: 900;
  }
  .d6r-feedback {
    display: flex;
    gap: 9px;
    align-items: flex-start;
    margin-top: 14px;
    padding: 12px 14px;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 750;
    line-height: 1.45;
  }
  .d6r-feedback.is-ok { background: ${COLORS.okSoft}; color: ${COLORS.ok}; }
  .d6r-feedback.is-no { background: ${COLORS.noSoft}; color: ${COLORS.no}; }
  .d6r-rule {
    margin-top: 9px;
    padding: 10px 13px;
    border: 1px solid #F2D083;
    border-radius: 12px;
    background: ${COLORS.goldSoft};
    color: ${COLORS.gold};
    font-size: 14px;
    font-weight: 800;
    line-height: 1.42;
  }
  @media (max-width: 520px) {
    .d6r-stage { padding-inline: 9px; }
    .d6r-line { padding-inline: 0; }
    .d6r-node-label { transform: rotate(-32deg); transform-origin: center top; }
    .d6r-line { padding-bottom: 13px; }
    .d6r-match { grid-template-columns: 1fr; }
  }
  @media (prefers-reduced-motion: reduce) {
    .d6r-option, .d6r-chip, .d6r-pair, .d6r-interval { transition: none; }
  }
`;

function useCheckBridge(check, registerCheck) {
  const checkRef = useRef(check);
  useEffect(() => {
    checkRef.current = check;
  }, [check]);
  useEffect(() => {
    registerCheck?.(() => checkRef.current());
  }, [registerCheck]);
}

function useReady(ready, onReady) {
  useEffect(() => {
    onReady?.(ready);
  }, [ready, onReady]);
}

function playResult(correct, playCorrect, playWrong) {
  if (correct) playCorrect?.();
  else playWrong?.();
}

function getCopy(config, lang) {
  return config.copy[lang === 'ru' ? 'ru' : 'uz'];
}

function QuestionFrame({ copy, feedback, children }) {
  return (
    <div className="d6r-root">
      <style>{CSS}</style>
      <div className="d6r-eyebrow">{copy.eyebrow}</div>
      <p className="d6r-setup">{copy.setup}</p>
      <div className="d6r-ask">{copy.ask}</div>
      <div className="d6r-stage">{children}</div>
      {feedback && (
        <div
          className={`d6r-feedback ${feedback.correct ? 'is-ok' : 'is-no'}`}
          role="status"
        >
          <span aria-hidden="true">{feedback.correct ? '✓' : '↻'}</span>
          <span>{feedback.correct ? copy.correct : copy.wrong}</span>
        </div>
      )}
      {feedback?.correct && <div className="d6r-rule">💡 {copy.rule}</div>}
    </div>
  );
}

function NumberLine({
  min,
  max,
  step,
  labelEvery = null,
  selected = null,
  target = null,
  markers = [],
  onSelect = null,
  disabled = false,
  hint = '',
}) {
  const values = useMemo(() => {
    const count = Math.round((max - min) / step);
    return Array.from({ length: count + 1 }, (_, index) => min + index * step);
  }, [min, max, step]);

  const markerByValue = useMemo(
    () => new Map(markers.map((marker) => [marker.value, marker])),
    [markers],
  );

  return (
    <div>
      <div className="d6r-line">
        <div className="d6r-line-axis" aria-hidden="true" />
        <div
          className="d6r-line-grid"
          style={{ gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))` }}
        >
          {values.map((value) => {
            const marker = markerByValue.get(value);
            const isMajor = value === min
              || value === max
              || (labelEvery && (value - min) % labelEvery === 0);
            const shouldLabel = isMajor || marker;
            const body = (
              <>
                {marker && (
                  <span className={`d6r-marker ${marker.kind === 'wrong' ? 'is-wrong' : ''}`}>
                    {marker.label}
                  </span>
                )}
                <span className="d6r-tick" />
                {target === value && <span className="d6r-dot is-target" />}
                {selected === value && <span className="d6r-dot" />}
              </>
            );

            return (
              <div className={`d6r-node ${isMajor ? 'is-major' : ''}`} key={value}>
                {onSelect ? (
                  <button
                    type="button"
                    className="d6r-node-button"
                    disabled={disabled}
                    aria-label={`${value}`}
                    aria-pressed={selected === value}
                    onClick={() => onSelect(value)}
                  >
                    {body}
                  </button>
                ) : (
                  <span className="d6r-node-static" aria-hidden="true">{body}</span>
                )}
                <span className="d6r-node-label">{shouldLabel ? value : ''}</span>
              </div>
            );
          })}
        </div>
      </div>
      {hint && <div className="d6r-hint">{hint}</div>}
    </div>
  );
}

function OptionButtons({ options, picked, onPick, disabled }) {
  return (
    <div className="d6r-options">
      {options.map((option, index) => (
        <button
          type="button"
          className={`d6r-option ${picked === index ? 'is-picked' : ''}`}
          key={`${option}-${index}`}
          disabled={disabled}
          aria-pressed={picked === index}
          onClick={() => onPick(index)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function ChoiceQuestion(props, config) {
  const {
    lang = 'uz',
    mode = 'answer',
    initialAnswer = null,
    playCorrect,
    playWrong,
    onReady,
    registerCheck,
    onSubmit,
  } = props || {};
  const copy = getCopy(config, lang);
  const [picked, setPicked] = useState(initialAnswer?.studentAnswer?.idx ?? null);
  const [feedback, setFeedback] = useState(
    typeof initialAnswer?.correct === 'boolean' ? { correct: initialAnswer.correct } : null,
  );
  const [solved, setSolved] = useState(initialAnswer?.correct === true);
  const locked = mode === 'review' || solved;

  useReady(picked != null && !locked, onReady);

  const check = useCallback(() => {
    if (picked == null) return false;
    const correct = picked === config.correct;
    setFeedback({ correct });
    setSolved(correct);
    playResult(correct, playCorrect, playWrong);
    onSubmit?.({
      questionText: copy.ask,
      options: copy.options.map((label, index) => ({ id: String(index), label })),
      studentAnswer: { idx: picked, label: copy.options[picked] },
      correctAnswer: { idx: config.correct, label: copy.options[config.correct] },
      correct,
      feedbackText: correct ? copy.correct : copy.wrong,
      explanationText: correct ? copy.correct : copy.wrong,
      ruleText: copy.rule,
      meta: { tag: config.tag, level: config.level, interaction: config.interaction, gradeSources: '1,2,5' },
    });
    return correct;
  }, [picked, config, copy, onSubmit, playCorrect, playWrong]);
  useCheckBridge(check, registerCheck);

  const pick = (index) => {
    if (locked) return;
    setPicked(index);
    setFeedback(null);
  };

  return (
    <QuestionFrame copy={copy} feedback={feedback}>
      <NumberLine {...config.line} />
      <OptionButtons options={copy.options} picked={picked} onPick={pick} disabled={locked} />
    </QuestionFrame>
  );
}

function PointQuestion(props, config) {
  const {
    lang = 'uz',
    mode = 'answer',
    initialAnswer = null,
    playCorrect,
    playWrong,
    onReady,
    registerCheck,
    onSubmit,
  } = props || {};
  const copy = getCopy(config, lang);
  const [value, setValue] = useState(initialAnswer?.studentAnswer?.value ?? null);
  const [feedback, setFeedback] = useState(
    typeof initialAnswer?.correct === 'boolean' ? { correct: initialAnswer.correct } : null,
  );
  const [solved, setSolved] = useState(initialAnswer?.correct === true);
  const locked = mode === 'review' || solved;

  useReady(value != null && !locked, onReady);
  const check = useCallback(() => {
    if (value == null) return false;
    const correct = value === config.correct;
    setFeedback({ correct });
    setSolved(correct);
    playResult(correct, playCorrect, playWrong);
    onSubmit?.({
      questionText: copy.ask,
      studentAnswer: { value },
      correctAnswer: { value: config.correct },
      correct,
      feedbackText: correct ? copy.correct : copy.wrong,
      explanationText: correct ? copy.correct : copy.wrong,
      ruleText: copy.rule,
      meta: { tag: config.tag, level: config.level, interaction: 'number-line-point', gradeSources: '1,2,5' },
    });
    return correct;
  }, [value, config, copy, onSubmit, playCorrect, playWrong]);
  useCheckBridge(check, registerCheck);

  return (
    <QuestionFrame copy={copy} feedback={feedback}>
      <NumberLine
        {...config.line}
        selected={value}
        disabled={locked}
        onSelect={(next) => {
          if (locked) return;
          setValue(next);
          setFeedback(null);
        }}
        hint={copy.tapHint}
      />
    </QuestionFrame>
  );
}

function IntervalQuestion(props, config) {
  const {
    lang = 'uz',
    mode = 'answer',
    initialAnswer = null,
    playCorrect,
    playWrong,
    onReady,
    registerCheck,
    onSubmit,
  } = props || {};
  const copy = getCopy(config, lang);
  const [picked, setPicked] = useState(initialAnswer?.studentAnswer?.idx ?? null);
  const [feedback, setFeedback] = useState(
    typeof initialAnswer?.correct === 'boolean' ? { correct: initialAnswer.correct } : null,
  );
  const [solved, setSolved] = useState(initialAnswer?.correct === true);
  const locked = mode === 'review' || solved;
  const intervals = config.boundaries.slice(0, -1).map((left, index) => [
    left,
    config.boundaries[index + 1],
  ]);

  useReady(picked != null && !locked, onReady);
  const check = useCallback(() => {
    if (picked == null) return false;
    const correct = picked === config.correct;
    setFeedback({ correct });
    setSolved(correct);
    playResult(correct, playCorrect, playWrong);
    const chosen = intervals[picked];
    onSubmit?.({
      questionText: copy.ask,
      studentAnswer: { idx: picked, interval: chosen },
      correctAnswer: { idx: config.correct, interval: intervals[config.correct] },
      correct,
      feedbackText: correct ? copy.correct : copy.wrong,
      explanationText: correct ? copy.correct : copy.wrong,
      ruleText: copy.rule,
      meta: { tag: config.tag, level: config.level, interaction: 'interval-pick', gradeSources: '1,2,5' },
    });
    return correct;
  }, [picked, config, copy, intervals, onSubmit, playCorrect, playWrong]);
  useCheckBridge(check, registerCheck);

  return (
    <QuestionFrame copy={copy} feedback={feedback}>
      <NumberLine {...config.line} />
      <span className="d6r-section-label">{copy.chooseInterval}</span>
      <div className="d6r-intervals">
        {intervals.map(([left, right], index) => (
          <button
            type="button"
            className={`d6r-interval ${picked === index ? 'is-picked' : ''}`}
            key={`${left}-${right}`}
            disabled={locked}
            aria-pressed={picked === index}
            onClick={() => {
              if (locked) return;
              setPicked(index);
              setFeedback(null);
            }}
          >
            {left}—{right}
          </button>
        ))}
      </div>
    </QuestionFrame>
  );
}

function MatchQuestion(props, config) {
  const {
    lang = 'uz',
    mode = 'answer',
    initialAnswer = null,
    playCorrect,
    playWrong,
    onReady,
    registerCheck,
    onSubmit,
  } = props || {};
  const copy = getCopy(config, lang);
  const [active, setActive] = useState(config.markers[0].label);
  const [pairs, setPairs] = useState(initialAnswer?.studentAnswer?.pairs ?? {});
  const [feedback, setFeedback] = useState(
    typeof initialAnswer?.correct === 'boolean' ? { correct: initialAnswer.correct } : null,
  );
  const [solved, setSolved] = useState(initialAnswer?.correct === true);
  const locked = mode === 'review' || solved;
  const labels = config.markers.map((marker) => marker.label);
  const complete = labels.every((label) => pairs[label] != null);

  useReady(complete && !locked, onReady);
  const check = useCallback(() => {
    if (!complete) return false;
    const correct = config.markers.every((marker) => pairs[marker.label] === marker.value);
    setFeedback({ correct });
    setSolved(correct);
    playResult(correct, playCorrect, playWrong);
    onSubmit?.({
      questionText: copy.ask,
      studentAnswer: { pairs },
      correctAnswer: {
        pairs: Object.fromEntries(config.markers.map((marker) => [marker.label, marker.value])),
      },
      correct,
      feedbackText: correct ? copy.correct : copy.wrong,
      explanationText: correct ? copy.correct : copy.wrong,
      ruleText: copy.rule,
      meta: { tag: config.tag, level: config.level, interaction: 'tap-match', gradeSources: '1,2,5' },
    });
    return correct;
  }, [complete, pairs, config, copy, onSubmit, playCorrect, playWrong]);
  useCheckBridge(check, registerCheck);

  const assign = (value) => {
    if (locked || !active) return;
    setPairs((current) => ({ ...current, [active]: value }));
    const currentIndex = labels.indexOf(active);
    setActive(labels[Math.min(currentIndex + 1, labels.length - 1)]);
    setFeedback(null);
  };

  return (
    <QuestionFrame copy={copy} feedback={feedback}>
      <NumberLine {...config.line} markers={config.markers} />
      <div className="d6r-match">
        <div className="d6r-match-col">
          <span className="d6r-section-label">{copy.pointsLabel}</span>
          {labels.map((label) => (
            <button
              type="button"
              className={`d6r-pair ${active === label ? 'is-picked' : ''}`}
              key={label}
              disabled={locked}
              aria-pressed={active === label}
              onClick={() => {
                setActive(label);
                setFeedback(null);
              }}
            >
              {copy.pointWord} {label}
              <small>{pairs[label] == null ? copy.notMatched : `→ ${pairs[label]}`}</small>
            </button>
          ))}
        </div>
        <div className="d6r-match-col">
          <span className="d6r-section-label">{copy.numbersLabel}</span>
          {config.numberPool.map((value) => (
            <button
              type="button"
              className="d6r-pair"
              key={value}
              disabled={locked}
              onClick={() => assign(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </QuestionFrame>
  );
}

function DoubleChoiceQuestion(props, config) {
  const {
    lang = 'uz',
    mode = 'answer',
    initialAnswer = null,
    playCorrect,
    playWrong,
    onReady,
    registerCheck,
    onSubmit,
  } = props || {};
  const copy = getCopy(config, lang);
  const [answerIdx, setAnswerIdx] = useState(initialAnswer?.studentAnswer?.answerIdx ?? null);
  const [reasonIdx, setReasonIdx] = useState(initialAnswer?.studentAnswer?.reasonIdx ?? null);
  const [feedback, setFeedback] = useState(
    typeof initialAnswer?.correct === 'boolean' ? { correct: initialAnswer.correct } : null,
  );
  const [solved, setSolved] = useState(initialAnswer?.correct === true);
  const locked = mode === 'review' || solved;

  useReady(answerIdx != null && reasonIdx != null && !locked, onReady);
  const check = useCallback(() => {
    if (answerIdx == null || reasonIdx == null) return false;
    const correct = answerIdx === config.correctAnswer && reasonIdx === config.correctReason;
    setFeedback({ correct });
    setSolved(correct);
    playResult(correct, playCorrect, playWrong);
    onSubmit?.({
      questionText: copy.ask,
      studentAnswer: {
        answerIdx,
        answer: copy.answers[answerIdx],
        reasonIdx,
        reason: copy.reasons[reasonIdx],
      },
      correctAnswer: {
        answerIdx: config.correctAnswer,
        answer: copy.answers[config.correctAnswer],
        reasonIdx: config.correctReason,
        reason: copy.reasons[config.correctReason],
      },
      correct,
      feedbackText: correct ? copy.correct : copy.wrong,
      explanationText: correct ? copy.correct : copy.wrong,
      ruleText: copy.rule,
      meta: { tag: config.tag, level: config.level, interaction: 'answer-and-reason', gradeSources: '1,2,5' },
    });
    return correct;
  }, [answerIdx, reasonIdx, config, copy, onSubmit, playCorrect, playWrong]);
  useCheckBridge(check, registerCheck);

  const pickAnswer = (index) => {
    if (locked) return;
    setAnswerIdx(index);
    setFeedback(null);
  };
  const pickReason = (index) => {
    if (locked) return;
    setReasonIdx(index);
    setFeedback(null);
  };

  return (
    <QuestionFrame copy={copy} feedback={feedback}>
      <NumberLine {...config.line} />
      <span className="d6r-section-label">{copy.answerLabel}</span>
      <OptionButtons
        options={copy.answers}
        picked={answerIdx}
        onPick={pickAnswer}
        disabled={locked}
      />
      <span className="d6r-section-label">{copy.reasonLabel}</span>
      <OptionButtons
        options={copy.reasons}
        picked={reasonIdx}
        onPick={pickReason}
        disabled={locked}
      />
    </QuestionFrame>
  );
}

function ErrorCorrectionQuestion(props, config) {
  const {
    lang = 'uz',
    mode = 'answer',
    initialAnswer = null,
    playCorrect,
    playWrong,
    onReady,
    registerCheck,
    onSubmit,
  } = props || {};
  const copy = getCopy(config, lang);
  const [value, setValue] = useState(initialAnswer?.studentAnswer?.value ?? null);
  const [reasonIdx, setReasonIdx] = useState(initialAnswer?.studentAnswer?.reasonIdx ?? null);
  const [feedback, setFeedback] = useState(
    typeof initialAnswer?.correct === 'boolean' ? { correct: initialAnswer.correct } : null,
  );
  const [solved, setSolved] = useState(initialAnswer?.correct === true);
  const locked = mode === 'review' || solved;

  useReady(value != null && reasonIdx != null && !locked, onReady);
  const check = useCallback(() => {
    if (value == null || reasonIdx == null) return false;
    const correct = value === config.correctValue && reasonIdx === config.correctReason;
    setFeedback({ correct });
    setSolved(correct);
    playResult(correct, playCorrect, playWrong);
    onSubmit?.({
      questionText: copy.ask,
      studentAnswer: { value, reasonIdx, reason: copy.reasons[reasonIdx] },
      correctAnswer: {
        value: config.correctValue,
        reasonIdx: config.correctReason,
        reason: copy.reasons[config.correctReason],
      },
      correct,
      feedbackText: correct ? copy.correct : copy.wrong,
      explanationText: correct ? copy.correct : copy.wrong,
      ruleText: copy.rule,
      meta: { tag: config.tag, level: config.level, interaction: 'find-and-fix-error', gradeSources: '1,2,5' },
    });
    return correct;
  }, [value, reasonIdx, config, copy, onSubmit, playCorrect, playWrong]);
  useCheckBridge(check, registerCheck);

  return (
    <QuestionFrame copy={copy} feedback={feedback}>
      <NumberLine
        {...config.line}
        selected={value}
        markers={[{ value: config.wrongValue, label: copy.wrongMarker, kind: 'wrong' }]}
        disabled={locked}
        onSelect={(next) => {
          if (locked) return;
          setValue(next);
          setFeedback(null);
        }}
        hint={copy.tapHint}
      />
      <span className="d6r-section-label">{copy.reasonLabel}</span>
      <OptionButtons
        options={copy.reasons}
        picked={reasonIdx}
        disabled={locked}
        onPick={(index) => {
          if (locked) return;
          setReasonIdx(index);
          setFeedback(null);
        }}
      />
    </QuestionFrame>
  );
}

function OrderQuestion(props, config) {
  const {
    lang = 'uz',
    mode = 'answer',
    initialAnswer = null,
    playCorrect,
    playWrong,
    onReady,
    registerCheck,
    onSubmit,
  } = props || {};
  const copy = getCopy(config, lang);
  const [order, setOrder] = useState(initialAnswer?.studentAnswer?.order ?? []);
  const [feedback, setFeedback] = useState(
    typeof initialAnswer?.correct === 'boolean' ? { correct: initialAnswer.correct } : null,
  );
  const [solved, setSolved] = useState(initialAnswer?.correct === true);
  const locked = mode === 'review' || solved;
  const remaining = config.pool.filter((value) => !order.includes(value));

  useReady(order.length === config.correct.length && !locked, onReady);
  const check = useCallback(() => {
    if (order.length !== config.correct.length) return false;
    const correct = order.every((value, index) => value === config.correct[index]);
    setFeedback({ correct });
    setSolved(correct);
    playResult(correct, playCorrect, playWrong);
    onSubmit?.({
      questionText: copy.ask,
      studentAnswer: { order },
      correctAnswer: { order: config.correct },
      correct,
      feedbackText: correct ? copy.correct : copy.wrong,
      explanationText: correct ? copy.correct : copy.wrong,
      ruleText: copy.rule,
      meta: { tag: config.tag, level: config.level, interaction: 'build-order', gradeSources: '1,2,5' },
    });
    return correct;
  }, [order, config, copy, onSubmit, playCorrect, playWrong]);
  useCheckBridge(check, registerCheck);

  return (
    <QuestionFrame copy={copy} feedback={feedback}>
      <NumberLine {...config.line} />
      <span className="d6r-section-label">{copy.yourOrder}</span>
      <div className="d6r-order-zone">
        {order.length === 0 && <span className="d6r-hint">{copy.empty}</span>}
        {order.map((value, index) => (
          <React.Fragment key={value}>
            {index > 0 && <span className="d6r-arrow">→</span>}
            <button
              type="button"
              className="d6r-chip is-picked"
              disabled={locked}
              aria-label={`${value}, ${copy.remove}`}
              onClick={() => {
                if (locked) return;
                setOrder((current) => current.filter((item) => item !== value));
                setFeedback(null);
              }}
            >
              {value}
            </button>
          </React.Fragment>
        ))}
      </div>
      <span className="d6r-section-label">{copy.cards}</span>
      <div className="d6r-options">
        {remaining.map((value) => (
          <button
            type="button"
            className="d6r-chip"
            key={value}
            disabled={locked}
            onClick={() => {
              if (locked) return;
              setOrder((current) => [...current, value]);
              setFeedback(null);
            }}
          >
            {value}
          </button>
        ))}
      </div>
    </QuestionFrame>
  );
}

const Q01 = {
  tag: 'd06-read-point',
  level: 'easy',
  interaction: 'read-number-line',
  correct: 1,
  line: { min: 200, max: 300, step: 10, labelEvery: 50, target: 250 },
  copy: {
    uz: {
      eyebrow: "1-bosqich · O'qni o'qi",
      setup: "Ko'k nuqta son o'qidagi bitta belgida turibdi.",
      ask: "Nuqta qaysi sonni ko'rsatmoqda?",
      options: ['205', '250', '240'],
      correct: "To'g'ri: 200 dan keyin beshta o'nlik — 250.",
      wrong: "Yana sanab ko'r: har bir kichik qadam 10 ga teng.",
      rule: "Son o'ngga qarab har bir qadamda bir xil miqdorga ortadi.",
    },
    ru: {
      eyebrow: 'Шаг 1 · Прочитай ось',
      setup: 'Синяя точка стоит на одной из отметок числовой оси.',
      ask: 'Какое число показывает точка?',
      options: ['205', '250', '240'],
      correct: 'Верно: после 200 пять десятков — это 250.',
      wrong: 'Посчитай снова: каждый маленький шаг равен 10.',
      rule: 'При движении вправо число на каждом шаге увеличивается на одну и ту же величину.',
    },
  },
};

const Q02 = {
  tag: 'd06-find-scale-step',
  level: 'easy',
  interaction: 'scale-choice',
  correct: 1,
  line: { min: 200, max: 300, step: 20, labelEvery: 100 },
  copy: {
    uz: {
      eyebrow: '2-bosqich · Masshtabni top',
      setup: "200 dan 300 gacha bo'lgan yo'l 5 ta teng qadamga bo'lingan.",
      ask: "Bitta qadam nechaga teng?",
      options: ['10', '20', '100'],
      correct: "To'g'ri: 300 − 200 = 100, 100 ÷ 5 = 20.",
      wrong: "Avval uchlar farqini top, keyin teng qadamlar soniga bo'l.",
      rule: "Qadam qiymati = uchlar orasidagi farq ÷ teng oraliqlar soni.",
    },
    ru: {
      eyebrow: 'Шаг 2 · Найди масштаб',
      setup: 'Путь от 200 до 300 разделён на 5 равных шагов.',
      ask: 'Чему равен один шаг?',
      options: ['10', '20', '100'],
      correct: 'Верно: 300 − 200 = 100, 100 ÷ 5 = 20.',
      wrong: 'Сначала найди разность концов, затем раздели её на число равных промежутков.',
      rule: 'Цена шага = разность концов ÷ число равных промежутков.',
    },
  },
};

const Q03 = {
  tag: 'd06-place-point',
  level: 'easy',
  correct: 470,
  line: { min: 400, max: 500, step: 10, labelEvery: 50 },
  copy: {
    uz: {
      eyebrow: "3-bosqich · Nuqtani qo'y",
      setup: "Son o'qida har bir kichik qadam 10 ga teng.",
      ask: "470 soni turadigan belgini bos.",
      tapHint: "Belgini tanlash uchun uning ustiga bos.",
      correct: "Ajoyib: 400 dan 470 gacha 7 ta o'nlik qadam bor.",
      wrong: "400 dan boshlab o'nliklab sanab, yana bir belgi tanla.",
      rule: "Sonni joylashtirishda avval tayanch sonni, keyin qadamlar sonini aniqlaymiz.",
    },
    ru: {
      eyebrow: 'Шаг 3 · Поставь точку',
      setup: 'Каждый маленький шаг на оси равен 10.',
      ask: 'Нажми на отметку, где находится число 470.',
      tapHint: 'Чтобы выбрать отметку, нажми на неё.',
      correct: 'Отлично: от 400 до 470 семь шагов по десять.',
      wrong: 'Считай десятками от 400 и выбери другую отметку.',
      rule: 'Чтобы поставить число, определяем опорное число и количество шагов от него.',
    },
  },
};

const Q04 = {
  tag: 'd06-find-interval',
  level: 'medium',
  correct: 2,
  boundaries: [600, 620, 640, 660, 680, 700],
  line: { min: 600, max: 700, step: 20, labelEvery: 100 },
  copy: {
    uz: {
      eyebrow: "4-bosqich · Oraliqni ko'r",
      setup: "642 soni o'qda ikki qo'shni belgi orasida yotadi.",
      ask: "642 qaysi oraliqqa tegishli?",
      chooseInterval: "Oraliqni tanla",
      correct: "To'g'ri: 640 < 642 < 660.",
      wrong: "642 dan kichik eng yaqin va undan katta eng yaqin belgilarni top.",
      rule: "Son oraliqda bo'lsa, chap chegara undan kichik, o'ng chegara undan katta bo'ladi.",
    },
    ru: {
      eyebrow: 'Шаг 4 · Увидь промежуток',
      setup: 'Число 642 находится между двумя соседними отметками.',
      ask: 'К какому промежутку относится 642?',
      chooseInterval: 'Выбери промежуток',
      correct: 'Верно: 640 < 642 < 660.',
      wrong: 'Найди ближайшую отметку меньше 642 и ближайшую отметку больше него.',
      rule: 'Для числа внутри промежутка левая граница меньше числа, а правая — больше.',
    },
  },
};

const Q05 = {
  tag: 'd06-left-right-compare',
  level: 'medium',
  interaction: 'visual-compare',
  correct: 0,
  line: {
    min: 400,
    max: 500,
    step: 10,
    labelEvery: 50,
    markers: [{ value: 420, label: 'A' }, { value: 460, label: 'B' }],
  },
  copy: {
    uz: {
      eyebrow: "5-bosqich · Chap va o'ng",
      setup: "A nuqta 420 da, B nuqta 460 da turibdi.",
      ask: "Qaysi hukm to'g'ri?",
      options: ['420 < 460', '420 > 460', '420 = 460'],
      correct: "To'g'ri: chaproqda turgan son kichik.",
      wrong: "O'qning o'ng tomoniga yurganda sonlar kattalashishini esla.",
      rule: "Son o'qida chapdagi son kichik, o'ngdagi son katta.",
    },
    ru: {
      eyebrow: 'Шаг 5 · Лево и право',
      setup: 'Точка A стоит на 420, точка B — на 460.',
      ask: 'Какое утверждение верно?',
      options: ['420 < 460', '420 > 460', '420 = 460'],
      correct: 'Верно: число левее меньше.',
      wrong: 'Вспомни: при движении вправо числа увеличиваются.',
      rule: 'На числовой оси число слева меньше, а число справа больше.',
    },
  },
};

const Q06 = {
  tag: 'd06-move-on-line',
  level: 'medium',
  correct: 400,
  line: {
    min: 340,
    max: 440,
    step: 10,
    labelEvery: 50,
    markers: [{ value: 360, label: 'START' }],
  },
  copy: {
    uz: {
      eyebrow: "6-bosqich · O'qda harakat",
      setup: "Robot 360 dan boshladi va o'ngga 40 birlik yurdi.",
      ask: "Robot to'xtaydigan belgini bos.",
      tapHint: "40 birlik — bu 10 dan 4 ta qadam.",
      correct: "To'g'ri: 360 + 40 = 400.",
      wrong: "O'ngga yurish — qo'shish. 10 dan to'rtta qadam sana.",
      rule: "O'ngga siljish qo'shishga, chapga siljish ayirishga mos keladi.",
    },
    ru: {
      eyebrow: 'Шаг 6 · Движение по оси',
      setup: 'Робот начал с 360 и прошёл 40 единиц вправо.',
      ask: 'Нажми на отметку, где остановится робот.',
      tapHint: '40 единиц — это 4 шага по 10.',
      correct: 'Верно: 360 + 40 = 400.',
      wrong: 'Движение вправо означает сложение. Сделай четыре шага по 10.',
      rule: 'Движение вправо соответствует сложению, влево — вычитанию.',
    },
  },
};

const Q07 = {
  tag: 'd06-match-points',
  level: 'medium',
  markers: [
    { value: 420, label: 'A' },
    { value: 460, label: 'B' },
    { value: 490, label: 'C' },
  ],
  numberPool: [490, 420, 460],
  line: { min: 400, max: 500, step: 10, labelEvery: 50 },
  copy: {
    uz: {
      eyebrow: "7-bosqich · Moslashtir",
      setup: "Har bir harf son o'qidagi bitta belgiga qo'yilgan.",
      ask: "A, B va C nuqtalarni mos sonlar bilan bog'la.",
      pointsLabel: '1. Nuqtani tanla',
      numbersLabel: '2. Mos sonni bos',
      pointWord: 'Nuqta',
      notMatched: 'son tanlanmagan',
      correct: "Hammasi to'g'ri: A = 420, B = 460, C = 490.",
      wrong: "Kamida bitta juftlik adashgan. Tayanch 400 dan o'nliklab sana.",
      rule: "Bir nechta nuqtani o'qishda har biri uchun bitta tayanch va bir xil qadamdan foydalanamiz.",
    },
    ru: {
      eyebrow: 'Шаг 7 · Сопоставь',
      setup: 'Каждая буква поставлена на одну из отметок числовой оси.',
      ask: 'Соедини точки A, B и C с подходящими числами.',
      pointsLabel: '1. Выбери точку',
      numbersLabel: '2. Нажми подходящее число',
      pointWord: 'Точка',
      notMatched: 'число не выбрано',
      correct: 'Всё верно: A = 420, B = 460, C = 490.',
      wrong: 'Хотя бы одна пара неверна. Считай десятками от опорного числа 400.',
      rule: 'Для нескольких точек используем одно опорное число и одинаковый шаг шкалы.',
    },
  },
};

const Q08 = {
  tag: 'd06-answer-with-reason',
  level: 'hard',
  correctAnswer: 1,
  correctReason: 0,
  line: { min: 600, max: 700, step: 10, labelEvery: 50, target: 650 },
  copy: {
    uz: {
      eyebrow: "8-bosqich · Javobni asosla",
      setup: "Ko'k nuqta 600 va 700 orasida turibdi.",
      ask: "Nuqtaning sonini va to'g'ri izohni tanla.",
      answerLabel: 'Javob',
      reasonLabel: 'Nima uchun?',
      answers: ['605', '650', '560'],
      reasons: [
        "600 dan keyin 5 ta o'nlik qadam bor",
        '600 dan keyin 5 ta birlik qadam bor',
        '700 dan 5 birlik ayirildi',
      ],
      correct: "Javob ham, asos ham to'g'ri: 600 + 5 × 10 = 650.",
      wrong: "Javob va izoh bir-biriga mos bo'lishi kerak. Qadam qiymatini tekshir.",
      rule: "Asoslangan javob sonni ham, u qanday topilganini ham ko'rsatadi.",
    },
    ru: {
      eyebrow: 'Шаг 8 · Обоснуй ответ',
      setup: 'Синяя точка стоит между 600 и 700.',
      ask: 'Выбери число точки и правильное объяснение.',
      answerLabel: 'Ответ',
      reasonLabel: 'Почему?',
      answers: ['605', '650', '560'],
      reasons: [
        'После 600 сделано 5 шагов по десять',
        'После 600 сделано 5 шагов по единице',
        'Из 700 вычли 5 единиц',
      ],
      correct: 'И ответ, и объяснение верны: 600 + 5 × 10 = 650.',
      wrong: 'Ответ и объяснение должны соответствовать друг другу. Проверь цену шага.',
      rule: 'Обоснованный ответ показывает и число, и способ, которым оно найдено.',
    },
  },
};

const Q09 = {
  tag: 'd06-find-error',
  level: 'hard',
  correctValue: 580,
  wrongValue: 620,
  correctReason: 0,
  line: { min: 540, max: 640, step: 10, labelEvery: 50 },
  copy: {
    uz: {
      eyebrow: "9-bosqich · Xatoni tuzat",
      setup: "Bit 580 sonini qizil belgi bilan ko'rsatdi, lekin xato qildi.",
      ask: "580 uchun to'g'ri belgini va xatoning sababini tanla.",
      wrongMarker: 'Bit: 580?',
      tapHint: "Avval to'g'ri belgini bos, keyin izohni tanla.",
      reasonLabel: 'Xato nimada?',
      reasons: [
        "580 soni 600 dan kichik, shuning uchun 600 ning chapida bo'lishi kerak",
        "580 soni 600 dan katta, shuning uchun 600 ning o'ngida bo'lishi kerak",
        "Son o'qida yo'nalishning ahamiyati yo'q",
      ],
      correct: "Xato topildi: 580 — 600 dan chapda ikki o'nlik qadam.",
      wrong: "Belgi va sababni yana tekshir: 580 ni 600 bilan taqqosla.",
      rule: "Javobni tekshirish uchun sonning tayanchdan kichik yoki kattaligini avval baholaymiz.",
    },
    ru: {
      eyebrow: 'Шаг 9 · Исправь ошибку',
      setup: 'Бит отметил число 580 красной меткой, но ошибся.',
      ask: 'Выбери правильную отметку для 580 и причину ошибки.',
      wrongMarker: 'Бит: 580?',
      tapHint: 'Сначала нажми правильную отметку, затем выбери объяснение.',
      reasonLabel: 'В чём ошибка?',
      reasons: [
        '580 меньше 600, поэтому должно быть слева от 600',
        '580 больше 600, поэтому должно быть справа от 600',
        'Направление на числовой оси не имеет значения',
      ],
      correct: 'Ошибка найдена: 580 — на два шага по десять левее 600.',
      wrong: 'Проверь отметку и объяснение: сравни 580 с 600.',
      rule: 'Для проверки сначала оцениваем, меньше или больше число опорного.',
    },
  },
};

const Q10 = {
  tag: 'd06-transfer-order',
  level: 'hard',
  pool: [256, 242, 250],
  correct: [242, 250, 256],
  line: { min: 240, max: 260, step: 2, labelEvery: 10 },
  copy: {
    uz: {
      eyebrow: "10-bosqich · Bilimni ko'chir",
      setup: "Bu o'qda qadam 2 ga teng. Kartalarni chapdan o'ngga joylashtir.",
      ask: "242, 250 va 256 sonlarini o'sish tartibida tuz.",
      yourOrder: 'Sening tartibing',
      empty: 'Quyidagi kartalardan boshlang',
      cards: 'Kartalar',
      remove: "tartibdan olib tashlash",
      correct: "Zo'r: 242 → 250 → 256. Chapdan o'ngga sonlar ortadi.",
      wrong: "Tartibni o'q bilan solishtir. Eng kichik son birinchi bo'lishi kerak.",
      rule: "O'sish tartibi son o'qidagi chapdan o'ngga harakatga mos keladi.",
    },
    ru: {
      eyebrow: 'Шаг 10 · Перенеси знание',
      setup: 'Шаг этой оси равен 2. Расположи карточки слева направо.',
      ask: 'Расположи числа 242, 250 и 256 по возрастанию.',
      yourOrder: 'Твой порядок',
      empty: 'Начни с карточек ниже',
      cards: 'Карточки',
      remove: 'убрать из порядка',
      correct: 'Отлично: 242 → 250 → 256. Слева направо числа увеличиваются.',
      wrong: 'Сравни порядок с осью. Наименьшее число должно быть первым.',
      rule: 'Порядок возрастания соответствует движению по числовой оси слева направо.',
    },
  },
};

export function D06_01(props) {
  return ChoiceQuestion(props, Q01);
}

export function D06_02(props) {
  return ChoiceQuestion(props, Q02);
}

export function D06_03(props) {
  return PointQuestion(props, Q03);
}

export function D06_04(props) {
  return IntervalQuestion(props, Q04);
}

export function D06_05(props) {
  return ChoiceQuestion(props, Q05);
}

export function D06_06(props) {
  return PointQuestion(props, Q06);
}

export function D06_07(props) {
  return MatchQuestion(props, Q07);
}

export function D06_08(props) {
  return DoubleChoiceQuestion(props, Q08);
}

export function D06_09(props) {
  return ErrorCorrectionQuestion(props, Q09);
}

export function D06_10(props) {
  return OrderQuestion(props, Q10);
}
