import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  META,
  SCREENS,
  SUPPORTED_LANGS,
  TTS_LOCALES,
  UI,
  text,
} from './Dars01Content.js';
import './Dars01.css';

const TOTAL_SCREENS = SCREENS.length;
const MOBILE_DESIGN_W = 390;

function useMobileZoom(breakpoint = 640) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const root = document.documentElement;
    const apply = () => {
      const zoom = window.innerWidth < breakpoint
        ? window.innerWidth / MOBILE_DESIGN_W
        : 1;
      root.style.setProperty('--g8z', String(zoom));
    };
    apply();
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);
    return () => {
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);
      root.style.removeProperty('--g8z');
    };
  }, [breakpoint]);
}

function useRevealScroll(trigger, delay = 160) {
  const ref = useRef(null);
  useEffect(() => {
    if (!trigger) return undefined;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => {
      ref.current?.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'nearest',
      });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [trigger, delay]);
  return ref;
}

function stopSpeech(mediaRef) {
  if (mediaRef.current) {
    try {
      mediaRef.current.pause();
      mediaRef.current.src = '';
    } catch {
      // Ignore media cleanup failures.
    }
    mediaRef.current = null;
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

function useNarration({ value, lang, ttsApiBase, voiceGender }) {
  const mediaRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const stop = useCallback(() => {
    stopSpeech(mediaRef);
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    stopSpeech(mediaRef);
    const narration = text(value, lang);
    if (!narration) return;

    if (ttsApiBase) {
      const gender = voiceGender === 'f' ? 'f' : 'm';
      const base = String(ttsApiBase).replace(/\/$/, '');
      const audio = new Audio(
        `${base}/api/tts?text=${encodeURIComponent(narration)}&g=${gender}`,
      );
      mediaRef.current = audio;
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
      audio.play().catch(() => setIsPlaying(false));
      return;
    }

    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.lang = TTS_LOCALES[lang];
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  }, [lang, ttsApiBase, value, voiceGender]);

  useEffect(() => () => stopSpeech(mediaRef), [lang, value]);

  return { isPlaying, play, stop };
}

function playFeedbackSound(url) {
  if (!url) return;
  try {
    const audio = new Audio(url);
    audio.play().catch(() => {});
  } catch {
    // Sound is optional.
  }
}

function numberValue(value) {
  const normalized = String(value ?? '')
    .trim()
    .replace(',', '.')
    .replace(/\s+/g, '');
  if (!normalized) return Number.NaN;
  return Number(normalized);
}

function Frac({ numerator, denominator, alert = false }) {
  return (
    <span className={`g8-frac ${alert ? 'g8-den-alert' : ''}`}>
      <span className="g8-frac-num">{numerator}</span>
      <span className="g8-frac-den">{denominator}</span>
    </span>
  );
}

function Formula({ children, className = '' }) {
  return <div className={`g8-main-formula ${className}`}>{children}</div>;
}

function ChoiceGroup({
  label,
  options,
  value,
  onChange,
  disabled = false,
  columns = 2,
}) {
  return (
    <div className="g8-field">
      {label && <span className="g8-field-label">{label}</span>}
      <div
        className={columns === 1 ? 'g8-step-builder' : 'g8-option-grid'}
        role="group"
        aria-label={label}
      >
        {options.map((option, index) => (
          <button
            key={option.id}
            type="button"
            className={`g8-choice ${value === option.id ? 'is-selected' : ''}`}
            aria-pressed={value === option.id}
            disabled={disabled}
            onClick={() => onChange(option.id)}
          >
            <span className="g8-choice-index">{option.short ?? String.fromCharCode(65 + index)}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Feedback({ state, content, lang }) {
  const visible = Boolean(state.feedback);
  const feedbackRef = useRevealScroll(
    visible ? `${state.feedback}-${state.attempts}` : '',
  );
  if (!visible) return null;

  const correct = state.feedback === 'correct';
  const hints = content.hints ?? [];
  const hintIndex = Math.max(0, Math.min(state.attempts - 1, hints.length - 1));
  const message = correct
    ? text(content.success, lang)
    : text(hints[hintIndex] ?? UI.review, lang);

  return (
    <div
      ref={feedbackRef}
      className={`g8-feedback ${correct ? 'is-correct' : 'is-hint'}`}
      role="status"
      aria-live="polite"
    >
      {correct ? <Check size={20} aria-hidden="true" /> : <Lightbulb size={20} aria-hidden="true" />}
      <div>
        <strong>{text(correct ? UI.correct : UI.hint, lang)}</strong>
        <p>{message}</p>
      </div>
    </div>
  );
}

function CheckButton({ lang, disabled, solved, onClick }) {
  if (solved) return null;
  return (
    <div className="g8-actions">
      <button
        type="button"
        className="g8-btn"
        disabled={disabled}
        onClick={onClick}
      >
        <Check size={18} aria-hidden="true" />
        {text(UI.check, lang)}
      </button>
    </div>
  );
}

function Screen0({ content, lang, state, complete }) {
  return (
    <>
      <Formula>
        <span className="g8-math">K(x)</span>
        <span>=</span>
        <Frac numerator="2x + 1" denominator="x − 3" />
      </Formula>
      <div className="g8-values" aria-label={text(UI.candidateValues, lang)}>
        {[0, 2, 3, 4].map((value) => (
          <div key={value} className="g8-value-chip" style={{ display: 'grid', placeItems: 'center' }}>
            x = {value}
          </div>
        ))}
      </div>
      {!state.solved && (
        <div className="g8-actions">
          <button type="button" className="g8-btn" onClick={() => complete({ started: true })}>
            {text(content.action, lang)}
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}
      <Feedback state={state} content={{ success: content.lead }} lang={lang} />
    </>
  );
}

function Screen1({ content, lang, state, setState, evaluate }) {
  const answers = state.answers ?? {};
  const setAnswer = (key, value) => setState({ answers: { ...answers, [key]: value }, feedback: null });
  const ready = String(answers.a ?? '').trim()
    && answers.b
    && String(answers.c ?? '').trim();
  const check = () => {
    const correct = numberValue(answers.a) === 5
      && answers.b === 'x-3'
      && numberValue(answers.c) === 3;
    evaluate(correct, {
      answer: answers,
      misconception: correct ? null : 'prerequisite-gap',
      prerequisiteTags: ['substitution', 'denominator', 'linear-equation'],
    });
  };

  return (
    <>
      <div className="g8-micro-grid">
        <div className="g8-card">
          <span className="g8-kicker">A</span>
          <div className="g8-inline-math">2x + 1, x = 2</div>
          <div className="g8-field" style={{ marginTop: 16 }}>
            <label htmlFor="g8-s1-a">{text(content.prompts[0], lang)}</label>
            <input
              id="g8-s1-a"
              className="g8-input"
              inputMode="decimal"
              value={answers.a ?? ''}
              disabled={state.solved}
              onChange={(event) => setAnswer('a', event.target.value)}
            />
          </div>
        </div>
        <div className="g8-card">
          <span className="g8-kicker">B</span>
          <div className="g8-inline-math"><Frac numerator="5" denominator="x − 3" /></div>
          <ChoiceGroup
            label={text(content.prompts[1], lang)}
            value={answers.b}
            disabled={state.solved}
            onChange={(value) => setAnswer('b', value)}
            columns={1}
            options={[
              { id: '5', label: '5' },
              { id: 'x-3', label: 'x − 3' },
              { id: 'x', label: 'x' },
            ]}
          />
        </div>
        <div className="g8-card">
          <span className="g8-kicker">C</span>
          <div className="g8-inline-math">x − 3 = 0</div>
          <div className="g8-field" style={{ marginTop: 16 }}>
            <label htmlFor="g8-s1-c">{text(content.prompts[2], lang)}</label>
            <input
              id="g8-s1-c"
              className="g8-input"
              inputMode="decimal"
              value={answers.c ?? ''}
              disabled={state.solved}
              onChange={(event) => setAnswer('c', event.target.value)}
            />
          </div>
        </div>
      </div>
      <CheckButton lang={lang} disabled={!ready} solved={state.solved} onClick={check} />
      <Feedback state={state} content={content} lang={lang} />
    </>
  );
}

const STRUCTURE_EXPRESSIONS = [
  { id: 'e0', node: <span>3x + 1</span>, correct: 'no-variable-denominator' },
  { id: 'e1', node: <span>x² − 4</span>, correct: 'no-variable-denominator' },
  { id: 'e2', node: <Frac numerator="5" denominator="x − 2" />, correct: 'variable-denominator' },
  { id: 'e3', node: <Frac numerator="x + 1" denominator="2x − 3" />, correct: 'variable-denominator' },
];

function Screen2({ content, lang, state, setState, evaluate }) {
  const assignments = state.assignments ?? {};
  const update = (id, group) => {
    setState({ assignments: { ...assignments, [id]: group }, feedback: null });
  };
  const ready = STRUCTURE_EXPRESSIONS.every((item) => assignments[item.id]);
  const check = () => {
    const correct = STRUCTURE_EXPRESSIONS.every(
      (item) => assignments[item.id] === item.correct,
    );
    evaluate(correct, {
      answer: assignments,
      misconception: correct ? null : 'm-den-value',
    });
  };

  return (
    <>
      <div className="g8-grid-two">
        {STRUCTURE_EXPRESSIONS.map((item, index) => (
          <div key={item.id} className="g8-card">
            <div className="g8-inline-math">{item.node}</div>
            <div className="g8-option-grid" style={{ marginTop: 14 }}>
              {['no-variable-denominator', 'variable-denominator'].map((group, groupIndex) => (
                <button
                  key={group}
                  type="button"
                  className={`g8-choice ${assignments[item.id] === group ? 'is-selected' : ''}`}
                  aria-pressed={assignments[item.id] === group}
                  disabled={state.solved}
                  onClick={() => update(item.id, group)}
                >
                  <span className="g8-choice-index">{groupIndex + 1}</span>
                  <span>{text(content.groups[groupIndex], lang)}</span>
                </button>
              ))}
            </div>
            <span className="g8-sr-only">{index + 1}</span>
          </div>
        ))}
      </div>
      <CheckButton lang={lang} disabled={!ready} solved={state.solved} onClick={check} />
      <Feedback state={state} content={content} lang={lang} />
    </>
  );
}

function Screen3({ content, lang, state, setState, complete }) {
  const value = state.selectedValue;
  const reason = state.selectedReason;
  const ready = Number.isFinite(value) && Number.isInteger(reason);
  return (
    <>
      <Formula>
        <span className="g8-math">K(x)</span>
        <span>=</span>
        <Frac numerator="2x + 1" denominator="x − 3" />
      </Formula>
      <ChoiceGroup
        label={text(UI.select, lang)}
        value={Number.isFinite(value) ? String(value) : null}
        disabled={state.solved}
        onChange={(next) => setState({ selectedValue: Number(next), feedback: null })}
        options={[0, 2, 3, 4].map((item) => ({ id: String(item), label: `x = ${item}` }))}
      />
      <div style={{ marginTop: 20 }}>
        <ChoiceGroup
          label={text(content.title, lang)}
          value={Number.isInteger(reason) ? String(reason) : null}
          disabled={state.solved}
          onChange={(next) => setState({ selectedReason: Number(next), feedback: null })}
          options={content.reasons.map((item, index) => ({
            id: String(index),
            label: text(item, lang),
          }))}
        />
      </div>
      {!state.solved && (
        <div className="g8-actions">
          <button
            type="button"
            className="g8-btn"
            disabled={!ready}
            onClick={() => complete({
              selectedValue: value,
              selectedReason: reason,
              hypothesisSaved: true,
            })}
          >
            {text(content.action, lang)}
          </button>
        </div>
      )}
      <Feedback state={state} content={content} lang={lang} />
    </>
  );
}

const VALUE_ROWS = [
  { x: 0, numerator: 1, denominator: -3, result: '−1/3' },
  { x: 2, numerator: 5, denominator: -1, result: '−5' },
  { x: 3, numerator: 7, denominator: 0, result: null },
  { x: 4, numerator: 9, denominator: 1, result: '9' },
];

function Screen4({ content, lang, state, setState, evaluate }) {
  const viewed = state.viewed ?? [];
  const allViewed = VALUE_ROWS.every((row) => viewed.includes(row.x));
  const questionRef = useRevealScroll(allViewed ? 'value-table-complete' : '', 260);
  const visit = (x) => {
    const next = viewed.includes(x) ? viewed : [...viewed, x];
    setState({ viewed: next, active: x, feedback: null });
  };
  const check = () => evaluate(state.different === 3, {
    answer: state.different,
    misconception: state.different === 3 ? null : 'm-den-zero-ok',
  });

  return (
    <>
      <Formula>
        <span className="g8-math">K(x)</span>
        <span>=</span>
        <Frac numerator="2x + 1" denominator="x − 3" alert={state.active === 3} />
      </Formula>
      <div className="g8-values">
        {VALUE_ROWS.map((row) => (
          <button
            key={row.x}
            type="button"
            className={`g8-value-chip ${state.active === row.x ? 'is-active' : ''}`}
            onClick={() => visit(row.x)}
          >
            x = {row.x} {viewed.includes(row.x) ? '✓' : ''}
          </button>
        ))}
      </div>
      <div className="g8-table-wrap">
        <table className="g8-data-table">
          <thead>
            <tr>
              <th>x</th>
              <th>2x + 1</th>
              <th>x − 3</th>
              <th>K(x)</th>
            </tr>
          </thead>
          <tbody>
            {VALUE_ROWS.map((row) => {
              const shown = viewed.includes(row.x);
              return (
                <tr key={row.x} className={shown && row.denominator === 0 ? 'is-alert' : ''}>
                  <td>{row.x}</td>
                  <td>{shown ? row.numerator : '—'}</td>
                  <td>{shown ? row.denominator : '—'}</td>
                  <td>
                    {shown
                      ? (row.result ?? <span className="g8-undefined">{text(UI.undefined, lang)}</span>)
                      : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {allViewed && (
        <div ref={questionRef} style={{ marginTop: 20 }}>
          <ChoiceGroup
            label={text(content.lead, lang)}
            value={Number.isFinite(state.different) ? String(state.different) : null}
            disabled={state.solved}
            onChange={(next) => setState({ different: Number(next), feedback: null })}
            options={[0, 2, 3, 4].map((item) => ({ id: String(item), label: `x = ${item}` }))}
          />
        </div>
      )}
      <CheckButton
        lang={lang}
        disabled={!allViewed || !Number.isFinite(state.different)}
        solved={state.solved}
        onClick={check}
      />
      <Feedback state={state} content={content} lang={lang} />
    </>
  );
}

function Screen5({ content, lang, state, setState, evaluate }) {
  const options = [
    { id: 'p', label: 'P(x)' },
    { id: 'q', label: 'Q(x)' },
    { id: 'both', label: text(LANG_BOTH, lang) },
  ];
  const ready = state.defined && state.undefined;
  const check = () => evaluate(
    state.defined === 'p' && state.undefined === 'q',
    {
      answer: { defined: state.defined, undefined: state.undefined },
      misconception: state.defined === 'p' && state.undefined === 'q'
        ? null
        : 'm-num-zero',
    },
  );
  return (
    <>
      <div className="g8-grid-two">
        <div className="g8-card">
          <Formula>
            <span className="g8-math">P(x)</span>
            <span>=</span>
            <Frac numerator="x − 3" denominator="x + 1" />
          </Formula>
          <div className="g8-equation-row"><span className="g8-inline-math">P(3) = 0/4 = 0</span></div>
        </div>
        <div className="g8-card">
          <Formula>
            <span className="g8-math">Q(x)</span>
            <span>=</span>
            <Frac numerator="x + 1" denominator="x − 3" alert />
          </Formula>
          <div className="g8-equation-row"><span className="g8-inline-math">Q(3) = 4/0</span></div>
        </div>
      </div>
      <div className="g8-grid-two">
        <ChoiceGroup
          label={text(content.questionDefined, lang)}
          value={state.defined}
          disabled={state.solved}
          onChange={(next) => setState({ defined: next, feedback: null })}
          options={options}
          columns={1}
        />
        <ChoiceGroup
          label={text(content.questionUndefined, lang)}
          value={state.undefined}
          disabled={state.solved}
          onChange={(next) => setState({ undefined: next, feedback: null })}
          options={options}
          columns={1}
        />
      </div>
      <CheckButton lang={lang} disabled={!ready} solved={state.solved} onClick={check} />
      <Feedback state={state} content={content} lang={lang} />
    </>
  );
}

const LANG_BOTH = {
  uz: 'Ikkalasi ham',
  ru: 'Оба',
  en: 'Both',
};

function Screen6({ content, lang, state, setState, evaluate }) {
  const order = state.order ?? [];
  const addStep = (index) => {
    if (order.includes(index) || state.solved) return;
    setState({ order: [...order, index], feedback: null });
  };
  const clear = () => setState({ order: [], feedback: null });
  const ready = order.length === 3 && state.sign;
  const check = () => {
    const orderCorrect = order.join(',') === '0,1,2';
    const correct = orderCorrect && state.sign === 'ne';
    evaluate(correct, {
      answer: { order, sign: state.sign },
      misconception: correct ? null : 'm-check-numerator',
    });
  };
  return (
    <>
      <div className="g8-step-builder">
        <div className="g8-built-steps" aria-live="polite">
          {order.length === 0 && <span className="g8-card-copy">{text(UI.select, lang)}</span>}
          {order.map((index, position) => (
            <span key={index} className="g8-built-step">
              {position + 1}. {text(content.steps[index], lang)}
              {position < order.length - 1 && <span className="g8-built-arrow">→</span>}
            </span>
          ))}
        </div>
        <div className="g8-grid-three" style={{ marginTop: 0 }}>
          {content.steps.map((step, index) => (
            <button
              key={index}
              type="button"
              className={`g8-choice ${order.includes(index) ? 'is-selected' : ''}`}
              disabled={state.solved || order.includes(index)}
              onClick={() => addStep(index)}
            >
              <span className="g8-choice-index">{index + 1}</span>
              <span>{text(step, lang)}</span>
            </button>
          ))}
        </div>
        {!state.solved && order.length > 0 && (
          <button type="button" className="g8-btn g8-btn-secondary" onClick={clear}>
            <RotateCcw size={17} aria-hidden="true" />
            {text(UI.clear, lang)}
          </button>
        )}
      </div>
      <div className="g8-rule-box">
        <div className="g8-equation-row">
          <span className="g8-inline-math">x − 3</span>
          <ChoiceGroup
            label={null}
            value={state.sign}
            disabled={state.solved}
            onChange={(next) => setState({ sign: next, feedback: null })}
            options={[
              { id: 'ne', label: '≠' },
              { id: 'eq', label: '=' },
            ]}
          />
          <span className="g8-inline-math">0</span>
        </div>
      </div>
      <CheckButton lang={lang} disabled={!ready} solved={state.solved} onClick={check} />
      <Feedback state={state} content={content} lang={lang} />
    </>
  );
}

const RULE_EXPRESSIONS = [
  { id: 'r0', node: <span>4x − 7</span>, correct: 'whole' },
  { id: 'r1', node: <Frac numerator="x + 2" denominator="5" />, correct: 'whole' },
  { id: 'r2', node: <Frac numerator="x + 2" denominator="x − 5" />, correct: 'fraction' },
];

function Screen7({ content, lang, state, setState, evaluate }) {
  const classes = state.classes ?? {};
  const setClass = (id, value) => setState({ classes: { ...classes, [id]: value }, feedback: null });
  const ready = RULE_EXPRESSIONS.every((item) => classes[item.id])
    && String(state.excluded ?? '').trim();
  const check = () => {
    const correct = RULE_EXPRESSIONS.every((item) => classes[item.id] === item.correct)
      && numberValue(state.excluded) === 5;
    evaluate(correct, {
      answer: { classes, excluded: state.excluded },
      misconception: correct ? null : 'm-whole-restricted',
    });
  };
  return (
    <>
      <div className="g8-grid-two">
        <div className="g8-rule-box" style={{ marginTop: 0 }}>
          <h3>{text(content.wholeLabel, lang)}</h3>
          <p>{text(content.wholeDefinition, lang)}</p>
        </div>
        <div className="g8-rule-box" style={{ marginTop: 0 }}>
          <h3>{text(content.fractionLabel, lang)}</h3>
          <p>{text(content.fractionDefinition, lang)}</p>
        </div>
      </div>
      <p className="g8-lead">{text(content.instruction, lang)}</p>
      <div className="g8-grid-three">
        {RULE_EXPRESSIONS.map((item) => (
          <div key={item.id} className="g8-card">
            <div className="g8-inline-math">{item.node}</div>
            <ChoiceGroup
              label={null}
              value={classes[item.id]}
              disabled={state.solved}
              onChange={(value) => setClass(item.id, value)}
              columns={1}
              options={[
                { id: 'whole', label: text(content.wholeLabel, lang) },
                { id: 'fraction', label: text(content.fractionLabel, lang) },
              ]}
            />
          </div>
        ))}
      </div>
      <div className="g8-field" style={{ marginTop: 18 }}>
        <label htmlFor="g8-s7-excluded">x ≠</label>
        <input
          id="g8-s7-excluded"
          className="g8-input"
          inputMode="decimal"
          value={state.excluded ?? ''}
          disabled={state.solved}
          onChange={(event) => setState({ excluded: event.target.value, feedback: null })}
        />
      </div>
      <CheckButton lang={lang} disabled={!ready} solved={state.solved} onClick={check} />
      <Feedback state={state} content={content} lang={lang} />
    </>
  );
}

function Screen8({ content, lang, state, setState, evaluate }) {
  const ready = state.firstPart && String(state.excluded ?? '').trim();
  const check = () => {
    const correct = state.firstPart === 'denominator'
      && numberValue(state.excluded) === -4;
    evaluate(correct, {
      answer: { firstPart: state.firstPart, excluded: state.excluded },
      misconception: correct
        ? null
        : (state.firstPart === 'denominator' ? 'm-sign-linear' : 'm-check-numerator'),
    });
  };
  return (
    <>
      <Formula>
        <span className="g8-math">R(x)</span>
        <span>=</span>
        <Frac numerator="3x − 2" denominator="x + 4" />
      </Formula>
      <ol className="g8-solution-steps">
        <li><span className="g8-inline-math">x + 4</span></li>
        <li><span className="g8-inline-math">x + 4 ≠ 0</span></li>
        <li><span className="g8-inline-math">x ≠ −4</span></li>
      </ol>
      <div className="g8-grid-two">
        <ChoiceGroup
          label={text(content.lead, lang)}
          value={state.firstPart}
          disabled={state.solved}
          onChange={(next) => setState({ firstPart: next, feedback: null })}
          columns={1}
          options={[
            { id: 'numerator', label: text(UI.numerator, lang) },
            { id: 'denominator', label: text(UI.denominator, lang) },
          ]}
        />
        <div className="g8-field">
          <label htmlFor="g8-s8-value">x ≠</label>
          <input
            id="g8-s8-value"
            className="g8-input"
            inputMode="decimal"
            value={state.excluded ?? ''}
            disabled={state.solved}
            onChange={(event) => setState({ excluded: event.target.value, feedback: null })}
          />
        </div>
      </div>
      <CheckButton lang={lang} disabled={!ready} solved={state.solved} onClick={check} />
      <Feedback state={state} content={content} lang={lang} />
    </>
  );
}

function Screen9({ content, lang, state, setState, evaluate }) {
  const ready = state.sign && String(state.value ?? '').trim();
  const check = () => {
    const correct = state.sign === 'ne' && numberValue(state.value) === 3;
    evaluate(correct, {
      answer: { sign: state.sign, value: state.value },
      misconception: correct
        ? null
        : (state.sign === 'ne' ? 'm-sign-linear' : 'm-den-zero-ok'),
    });
  };
  return (
    <>
      <Formula>
        <span className="g8-math">F(x)</span>
        <span>=</span>
        <Frac numerator="5" denominator="2x − 6" />
      </Formula>
      <div className="g8-grid-two">
        <div className="g8-card">
          <div className="g8-equation-row">
            <span className="g8-inline-math">2x − 6</span>
            <ChoiceGroup
              label={null}
              value={state.sign}
              disabled={state.solved}
              onChange={(next) => setState({ sign: next, feedback: null })}
              options={[
                { id: 'ne', label: '≠' },
                { id: 'eq', label: '=' },
              ]}
            />
            <span className="g8-inline-math">0</span>
          </div>
        </div>
        <div className="g8-card">
          <div className="g8-equation-row">
            <span className="g8-inline-math">x ≠</span>
            <input
              aria-label={text(UI.excludedValue, lang)}
              className="g8-input"
              inputMode="decimal"
              value={state.value ?? ''}
              disabled={state.solved}
              onChange={(event) => setState({ value: event.target.value, feedback: null })}
            />
          </div>
        </div>
      </div>
      <CheckButton lang={lang} disabled={!ready} solved={state.solved} onClick={check} />
      <Feedback state={state} content={content} lang={lang} />
    </>
  );
}

function Screen10({ content, lang, state, setState, evaluate }) {
  const check = () => evaluate(state.method === 'b', {
    answer: state.method,
    misconception: state.method === 'b' ? null : 'm-one-test',
  });
  return (
    <>
      <Formula>
        <span className="g8-math">G(x)</span>
        <span>=</span>
        <Frac numerator="x + 1" denominator="3x − 9" />
      </Formula>
      <ChoiceGroup
        label={text(content.title, lang)}
        value={state.method}
        disabled={state.solved}
        onChange={(next) => setState({ method: next, feedback: null })}
        columns={1}
        options={[
          { id: 'a', short: 'A', label: text(content.methodA, lang) },
          { id: 'b', short: 'B', label: text(content.methodB, lang) },
        ]}
      />
      <CheckButton lang={lang} disabled={!state.method} solved={state.solved} onClick={check} />
      <Feedback state={state} content={content} lang={lang} />
    </>
  );
}

function Screen11({ content, lang, state, setState, evaluate }) {
  const ready = state.aType && state.bType && String(state.excluded ?? '').trim();
  const check = () => {
    const correct = state.aType === 'whole'
      && state.bType === 'fraction'
      && numberValue(state.excluded) === 5;
    evaluate(correct, {
      answer: {
        aType: state.aType,
        bType: state.bType,
        excluded: state.excluded,
      },
      misconception: correct ? null : 'm-whole-restricted',
    });
  };
  const typeOptions = [
    { id: 'whole', label: text(SCREENS[7].wholeLabel, lang) },
    { id: 'fraction', label: text(SCREENS[7].fractionLabel, lang) },
  ];
  return (
    <>
      <div className="g8-grid-two">
        <div className="g8-card">
          <Formula><span className="g8-math">A(x) = x² − 5x + 4</span></Formula>
          <ChoiceGroup
            label={text(UI.select, lang)}
            value={state.aType}
            disabled={state.solved}
            onChange={(next) => setState({ aType: next, feedback: null })}
            options={typeOptions}
            columns={1}
          />
        </div>
        <div className="g8-card">
          <Formula>
            <span className="g8-math">B(x)</span>
            <span>=</span>
            <Frac numerator="x + 7" denominator="x − 5" />
          </Formula>
          <ChoiceGroup
            label={text(UI.select, lang)}
            value={state.bType}
            disabled={state.solved}
            onChange={(next) => setState({ bType: next, feedback: null })}
            options={typeOptions}
            columns={1}
          />
          <div className="g8-field" style={{ marginTop: 12 }}>
            <label htmlFor="g8-s11-value">x ≠</label>
            <input
              id="g8-s11-value"
              className="g8-input"
              inputMode="decimal"
              value={state.excluded ?? ''}
              disabled={state.solved}
              onChange={(event) => setState({ excluded: event.target.value, feedback: null })}
            />
          </div>
        </div>
      </div>
      <CheckButton lang={lang} disabled={!ready} solved={state.solved} onClick={check} />
      <Feedback state={state} content={content} lang={lang} />
    </>
  );
}

function Screen12({ content, lang, state, setState, evaluate }) {
  const ready = Number.isInteger(state.wrongStep) && String(state.excluded ?? '').trim();
  const check = () => {
    const correct = state.wrongStep === 1 && numberValue(state.excluded) === -2;
    evaluate(correct, {
      answer: { wrongStep: state.wrongStep, excluded: state.excluded },
      misconception: correct ? null : 'm-check-numerator',
    });
  };
  return (
    <>
      <Formula>
        <span className="g8-math">H(x)</span>
        <span>=</span>
        <Frac numerator="x − 4" denominator="x + 2" />
      </Formula>
      <div className="g8-step-builder">
        {content.statements.map((statement, index) => (
          <button
            key={index}
            type="button"
            className={`g8-error-step ${state.wrongStep === index ? 'is-selected' : ''}`}
            aria-pressed={state.wrongStep === index}
            disabled={state.solved}
            onClick={() => setState({ wrongStep: index, feedback: null })}
          >
            <span className="g8-error-number">{index + 1}</span>
            <span>{text(statement, lang)}</span>
          </button>
        ))}
      </div>
      <div className="g8-field" style={{ marginTop: 18 }}>
        <label htmlFor="g8-s12-value">x ≠</label>
        <input
          id="g8-s12-value"
          className="g8-input"
          inputMode="decimal"
          value={state.excluded ?? ''}
          disabled={state.solved}
          onChange={(event) => setState({ excluded: event.target.value, feedback: null })}
        />
      </div>
      <CheckButton lang={lang} disabled={!ready} solved={state.solved} onClick={check} />
      <Feedback state={state} content={content} lang={lang} />
    </>
  );
}

function Screen13({ content, lang, state, setState, evaluate }) {
  const ready = state.numerator && state.denominator && state.part;
  const accepted = ['x+2', '2x+4'];
  const check = () => {
    const correct = accepted.includes(state.denominator)
      && state.part === 'denominator';
    evaluate(correct, {
      answer: {
        numerator: state.numerator,
        denominator: state.denominator,
        part: state.part,
      },
      misconception: correct ? null : 'm-check-numerator',
    });
  };
  return (
    <>
      <div className="g8-summary-rule">
        <Frac
          numerator={state.numerator || 'A(x)'}
          denominator={state.denominator || 'B(x)'}
          alert={Boolean(state.denominator)}
        />
        <span>, x = −2</span>
      </div>
      <div className="g8-grid-two">
        <ChoiceGroup
          label={text(content.chooseNumerator, lang)}
          value={state.numerator}
          disabled={state.solved}
          onChange={(next) => setState({ numerator: next, feedback: null })}
          columns={1}
          options={[
            { id: 'x+1', label: 'x + 1' },
            { id: '3x-5', label: '3x − 5' },
            { id: '7', label: '7' },
          ]}
        />
        <ChoiceGroup
          label={text(content.chooseDenominator, lang)}
          value={state.denominator}
          disabled={state.solved}
          onChange={(next) => setState({ denominator: next, feedback: null })}
          columns={1}
          options={[
            { id: 'x-2', label: 'x − 2' },
            { id: 'x+2', label: 'x + 2' },
            { id: '2x+4', label: '2x + 4' },
            { id: 'x+4', label: 'x + 4' },
          ]}
        />
      </div>
      <div style={{ marginTop: 18 }}>
        <ChoiceGroup
          label={text(content.question, lang)}
          value={state.part}
          disabled={state.solved}
          onChange={(next) => setState({ part: next, feedback: null })}
          options={[
            { id: 'numerator', label: text(UI.numerator, lang) },
            { id: 'denominator', label: text(UI.denominator, lang) },
          ]}
        />
      </div>
      <CheckButton lang={lang} disabled={!ready} solved={state.solved} onClick={check} />
      <Feedback state={state} content={content} lang={lang} />
    </>
  );
}

function Screen14({ content, lang, state, setState, evaluate }) {
  const ready = String(state.excluded ?? '').trim() && state.allowed && state.reason;
  const check = () => {
    const correct = numberValue(state.excluded) === -4
      && state.allowed === 'yes'
      && state.reason === 'zero-numerator';
    evaluate(correct, {
      answer: {
        excluded: state.excluded,
        allowed: state.allowed,
        reason: state.reason,
      },
      misconception: correct
        ? null
        : (state.reason === 'zero-numerator' ? 'm-sign-linear' : 'm-num-zero'),
      masteryTags: ['condition', 'procedure', 'reasoning', 'transfer'],
    });
  };
  return (
    <>
      <Formula>
        <span className="g8-math">C(p)</span>
        <span>=</span>
        <Frac numerator="12 − p" denominator="2p + 8" />
      </Formula>
      <div className="g8-grid-two">
        <div className="g8-field">
          <label htmlFor="g8-s14-value">p ≠</label>
          <input
            id="g8-s14-value"
            className="g8-input"
            inputMode="decimal"
            value={state.excluded ?? ''}
            disabled={state.solved}
            onChange={(event) => setState({ excluded: event.target.value, feedback: null })}
          />
        </div>
        <ChoiceGroup
          label={text(content.allowedQuestion, lang)}
          value={state.allowed}
          disabled={state.solved}
          onChange={(next) => setState({ allowed: next, feedback: null })}
          options={[
            { id: 'yes', label: text(UI.allowed, lang) },
            { id: 'no', label: text(UI.excluded, lang) },
          ]}
        />
      </div>
      <div style={{ marginTop: 18 }}>
        <ChoiceGroup
          label={text(content.lead, lang)}
          value={state.reason}
          disabled={state.solved}
          onChange={(next) => setState({ reason: next, feedback: null })}
          columns={1}
          options={[
            { id: 'zero-numerator', label: text(content.reasons[0], lang) },
            { id: 'any-zero', label: text(content.reasons[1], lang) },
            { id: 'negative', label: text(content.reasons[2], lang) },
          ]}
        />
      </div>
      <CheckButton lang={lang} disabled={!ready} solved={state.solved} onClick={check} />
      <Feedback state={state} content={content} lang={lang} />
    </>
  );
}

function Screen15({ content, lang, state, setState, evaluate, allStates }) {
  const hypothesis = allStates[3] ?? {};
  const hypothesisCorrect = hypothesis.selectedValue === 3
    && hypothesis.selectedReason === 1;
  const ready = state.part && state.zero && state.hypothesis;
  const check = () => evaluate(
    state.part === 'denominator'
      && state.zero === 'allowed'
      && state.hypothesis === (hypothesisCorrect ? 'matched' : 'revised'),
    {
      answer: {
        part: state.part,
        zero: state.zero,
        hypothesis: state.hypothesis,
      },
      masteryTags: ['concept', 'condition', 'reasoning'],
    },
  );
  return (
    <>
      <div className="g8-summary-rule">
        <Frac numerator="A(x)" denominator="B(x)" />
        <span>:</span>
        <span>B(x) ≠ 0</span>
      </div>
      <div className="g8-grid-three">
        <ChoiceGroup
          label={text(content.promptCheck, lang)}
          value={state.part}
          disabled={state.solved}
          onChange={(next) => setState({ part: next, feedback: null })}
          columns={1}
          options={[
            { id: 'numerator', label: text(UI.numerator, lang) },
            { id: 'denominator', label: text(UI.denominator, lang) },
          ]}
        />
        <ChoiceGroup
          label={text(content.promptZero, lang)}
          value={state.zero}
          disabled={state.solved}
          onChange={(next) => setState({ zero: next, feedback: null })}
          columns={1}
          options={[
            { id: 'allowed', label: text(UI.allowed, lang) },
            { id: 'excluded', label: text(UI.excluded, lang) },
          ]}
        />
        <ChoiceGroup
          label={text(content.promptHypothesis, lang)}
          value={state.hypothesis}
          disabled={state.solved}
          onChange={(next) => setState({ hypothesis: next, feedback: null })}
          columns={1}
          options={[
            { id: 'matched', label: text(content.matched, lang) },
            { id: 'revised', label: text(content.revised, lang) },
          ]}
        />
      </div>
      <div className="g8-hypothesis-note">
        x = {hypothesis.selectedValue ?? '—'} · {Number.isInteger(hypothesis.selectedReason)
          ? text(SCREENS[3].reasons[hypothesis.selectedReason], lang)
          : '—'}
      </div>
      <CheckButton lang={lang} disabled={!ready} solved={state.solved} onClick={check} />
      <Feedback state={state} content={content} lang={lang} />
      {state.solved && <div className="g8-bridge">{text(content.bridge, lang)}</div>}
    </>
  );
}

const SCREEN_COMPONENTS = [
  Screen0,
  Screen1,
  Screen2,
  Screen3,
  Screen4,
  Screen5,
  Screen6,
  Screen7,
  Screen8,
  Screen9,
  Screen10,
  Screen11,
  Screen12,
  Screen13,
  Screen14,
  Screen15,
];

function Stage({
  screen,
  lang,
  setLang,
  content,
  narration,
  audioEnabled,
  setAudioEnabled,
  onBack,
  onNext,
  nextDisabled,
  onFinish,
  children,
}) {
  const contentRef = useRef(null);
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [screen]);

  const toggleAudio = () => {
    if (audioEnabled) {
      narration.stop();
      setAudioEnabled(false);
      return;
    }
    setAudioEnabled(true);
  };

  return (
    <main className="g8-stage">
      <header className="g8-header">
        <div className="g8-topline">
          <div className="g8-brand">
            <span className="g8-brand-mark" aria-hidden="true" />
            <span>MATH.LAB 8</span>
            <span className="g8-brand-module">{text(META.module, lang)}</span>
          </div>
          <div className="g8-controls">
            <div className="g8-language" aria-label={text(UI.language, lang)}>
              {SUPPORTED_LANGS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="g8-lang-btn"
                  aria-pressed={lang === item}
                  onClick={() => setLang(item)}
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="g8-icon-btn"
              aria-label={text(audioEnabled ? UI.soundOff : UI.soundOn, lang)}
              title={text(audioEnabled ? UI.soundOff : UI.soundOn, lang)}
              onClick={toggleAudio}
            >
              {audioEnabled ? <Volume2 size={19} aria-hidden="true" /> : <VolumeX size={19} aria-hidden="true" />}
            </button>
            {audioEnabled && (
              <button
                type="button"
                className="g8-icon-btn"
                aria-label={text(UI.replay, lang)}
                title={text(UI.replay, lang)}
                onClick={narration.play}
              >
                <RotateCcw size={18} className={narration.isPlaying ? 'is-spinning' : ''} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
        <div
          className="g8-progress"
          role="progressbar"
          aria-label={text(UI.progress, lang)}
          aria-valuemin="1"
          aria-valuemax={TOTAL_SCREENS}
          aria-valuenow={screen + 1}
        >
          <div
            className="g8-progress-fill"
            style={{ width: `${((screen + 1) / TOTAL_SCREENS) * 100}%` }}
          />
        </div>
        <div className="g8-meta">
          <span className="g8-eyebrow">{text(content.eyebrow, lang)}</span>
          <span className="g8-screen-count">
            {String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}
          </span>
        </div>
      </header>

      <section ref={contentRef} className="g8-content">
        <div className="g8-shell" key={content.id}>
          <h1 className="g8-title">{text(content.title, lang)}</h1>
          <p className="g8-lead">{text(content.lead, lang)}</p>
          {children}
        </div>
      </section>

      <footer className="g8-nav">
        {screen === 0 ? (
          <span className="g8-nav-spacer" />
        ) : (
          <button type="button" className="g8-btn g8-btn-secondary" onClick={onBack}>
            <ArrowLeft size={18} aria-hidden="true" />
            {text(UI.back, lang)}
          </button>
        )}
        {screen === TOTAL_SCREENS - 1 ? (
          <button
            type="button"
            className="g8-btn"
            disabled={nextDisabled}
            onClick={onFinish}
          >
            {text(UI.finish, lang)}
            <Check size={18} aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            className="g8-btn"
            disabled={nextDisabled}
            onClick={onNext}
          >
            {text(UI.next, lang)}
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        )}
      </footer>
    </main>
  );
}

export default function Grade8Dars01({
  studentName,
  lang: langProp,
  ttsApiBase = '',
  voiceGender = 'm',
  correctSoundUrl = '',
  wrongSoundUrl = '',
  onFinished,
}) {
  useMobileZoom();

  const initialLang = SUPPORTED_LANGS.includes(langProp) ? langProp : 'uz';
  const [lang, setLang] = useState(initialLang);
  const [screen, setScreen] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const narrationEnabledRef = useRef(false);
  const [screenStates, setScreenStates] = useState(
    () => SCREENS.map(() => ({ attempts: 0, solved: false, feedback: null })),
  );
  const startTimeRef = useRef(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const content = SCREENS[screen];
  const currentState = screenStates[screen];
  const narration = useNarration({
    value: content.audio,
    lang,
    ttsApiBase,
    voiceGender,
  });
  const playNarration = narration.play;

  useEffect(() => {
    if (!audioEnabled) {
      narrationEnabledRef.current = false;
      return undefined;
    }

    if (!narrationEnabledRef.current) {
      narrationEnabledRef.current = true;
      playNarration();
      return undefined;
    }

    const timer = window.setTimeout(playNarration, 180);
    return () => window.clearTimeout(timer);
  }, [audioEnabled, playNarration]);

  const setCurrentState = useCallback((patch) => {
    setScreenStates((previous) => previous.map((item, index) => (
      index === screen ? { ...item, ...patch } : item
    )));
  }, [screen]);

  const complete = useCallback((answer = {}) => {
    setScreenStates((previous) => previous.map((item, index) => (
      index === screen
        ? {
          ...item,
          ...answer,
          answer,
          solved: true,
          feedback: 'correct',
          firstTry: item.attempts === 0,
        }
        : item
    )));
    playFeedbackSound(correctSoundUrl);
  }, [correctSoundUrl, screen]);

  const evaluate = useCallback((correct, details = {}) => {
    setScreenStates((previous) => previous.map((item, index) => {
      if (index !== screen || item.solved) return item;
      const attempts = item.attempts + 1;
      return {
        ...item,
        ...details,
        attempts,
        hintsUsed: correct ? (item.hintsUsed ?? 0) : (item.hintsUsed ?? 0) + 1,
        solved: correct,
        feedback: correct ? 'correct' : 'hint',
        firstTry: correct ? attempts === 1 : item.firstTry,
      };
    }));
    playFeedbackSound(correct ? correctSoundUrl : wrongSoundUrl);
  }, [correctSoundUrl, screen, wrongSoundUrl]);

  const goNext = () => setScreen((current) => Math.min(current + 1, TOTAL_SCREENS - 1));
  const goBack = () => setScreen((current) => Math.max(current - 1, 0));

  const finish = () => {
    const checked = screenStates.filter((item) => item.attempts > 0 || item.solved);
    const firstTryCorrect = checked.filter((item) => item.firstTry === true).length;
    const misconceptions = screenStates
      .map((item) => item.misconception)
      .filter(Boolean);
    const payload = {
      lessonId: META.lessonId,
      lessonTitle: META.title,
      lang,
      studentName: studentName || null,
      completed: screenStates.every((item) => item.solved),
      durationMs: Date.now() - startTimeRef.current,
      accuracy: checked.length ? Math.round((firstTryCorrect / checked.length) * 100) : 0,
      attempts: screenStates.reduce((sum, item) => sum + (item.attempts ?? 0), 0),
      hintsUsed: screenStates.reduce((sum, item) => sum + (item.hintsUsed ?? 0), 0),
      hypothesis: screenStates[3]?.answer ?? null,
      prerequisiteTags: screenStates[1]?.prerequisiteTags ?? [],
      misconceptionTags: [...new Set(misconceptions)],
      transferPassed: Boolean(screenStates[14]?.solved),
      answers: screenStates.map((item, index) => ({
        screenId: SCREENS[index].id,
        solved: item.solved,
        attempts: item.attempts ?? 0,
        firstTry: item.firstTry ?? null,
        answer: item.answer ?? null,
      })),
    };
    if (typeof onFinished === 'function') onFinished(payload);
  };

  const CurrentScreen = SCREEN_COMPONENTS[screen];
  const commonProps = useMemo(() => ({
    content,
    lang,
    state: currentState,
    setState: setCurrentState,
    evaluate,
    complete,
    allStates: screenStates,
  }), [complete, content, currentState, evaluate, lang, screenStates, setCurrentState]);

  return (
    <div className="lesson-root g8-lesson-root">
      <Stage
        screen={screen}
        lang={lang}
        setLang={setLang}
        content={content}
        narration={narration}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
        onBack={goBack}
        onNext={goNext}
        nextDisabled={!currentState.solved}
        onFinish={finish}
      >
        <CurrentScreen {...commonProps} />
      </Stage>
    </div>
  );
}
