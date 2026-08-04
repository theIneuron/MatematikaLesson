// PracticeHost (3-sinf) — LOKAL PREVIEW uchun platforma host'ini taqlid qiluvchi qobiq.
// Maqsad: jsx-question kontraktidagi props'ni (onReady, registerCheck, onSubmit,
// playCorrect/playWrong) berib, native "Tekshirish" tugmasini chiqarish — shunda
// mashqni local saytda alohida sinab ko'rsa bo'ladi.
// 3-sinf (8–9 yosh): grade2 bilan bir xil qobiq, kontrakt o'zgarmagan.
// Ichida UZ/RU almashtirgich, audio-led narration va Bit izohi bor.
// Grade1/Grade2/Grade5 practice/PracticeHost bilan bir xil kontrakt.

import { useState, useRef, useCallback, useEffect } from 'react';
import Grade3BitCoach, {
  useGrade3SpeechGate,
} from '../Grade3BitCoach.jsx';
// preview "to'g'ri/noto'g'ri" signal — qisqa beep (ovoz/narratsiya emas)
function beep(ok) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = ok ? 880 : 220;
    g.gain.value = 0.06;
    o.start();
    o.stop(ctx.currentTime + 0.12);
  } catch { /* preview-only */ }
}

const UI = {
  uz: {
    check: 'Tekshir',
    change: "Javobni o'zgartiring",
    next: 'Keyingi',
    finish: 'Tugatish',
    finished: 'Tugallandi',
    listen: "Avval ko'rsatmani tinglang…",
    success: "Yechim qabul qilindi. Qo'llangan usulni yana bir bor aytib ko'r.",
    fallback: "Bu javob shartga mos kelmadi. Masaladagi sonlar va amalni yana tekshirib, boshqa usulni sinab ko'r.",
  },
  ru: {
    check: 'Проверить',
    change: 'Измени ответ',
    next: 'Далее',
    finish: 'Завершить',
    finished: 'Завершено',
    listen: 'Сначала дослушай инструкцию…',
    success: 'Решение принято. Ещё раз проговори, каким способом ты его получил.',
    fallback: 'Этот ответ не подтверждается условием. Ещё раз проверь числа и действие, затем попробуй другой способ.',
  },
};

function describeSubmittedAnswer(answer, options = [], lang = 'uz') {
  if (answer == null) return '';
  if (typeof answer !== 'object') return String(answer);
  if (answer.label != null) return String(answer.label);
  if (answer.value != null) return String(answer.value);
  if (answer.sign != null) return String(answer.sign);
  if (answer.made != null) return String(answer.made);
  if (answer.idx != null) {
    const option = options[Number(answer.idx)];
    if (option && typeof option === 'object') {
      return String(option.label ?? option.value ?? option.id ?? Number(answer.idx) + 1);
    }
    return String(option ?? Number(answer.idx) + 1);
  }
  if (answer.h != null || answer.t != null || answer.o != null) {
    return [answer.h, answer.t, answer.o].filter((value) => value != null).join(' → ');
  }
  if (Array.isArray(answer.plates)) {
    const plates = answer.plates.join(' + ');
    return answer.sum != null ? `${plates} = ${answer.sum}` : plates;
  }
  if (Array.isArray(answer.labels) && answer.labels.length) {
    const labels = answer.labels.join(' → ');
    if (labels.length <= 120 || !Array.isArray(answer.indices)) return labels;
    const numbers = answer.indices.map((index) => Number(index) + 1).join(', ');
    return lang === 'ru' ? `варианты ${numbers}` : `${numbers}-variantlar`;
  }
  if (Array.isArray(answer.slots) && answer.slots.length) return answer.slots.join(' → ');
  if (answer.slots && typeof answer.slots === 'object') return Object.values(answer.slots).join(' → ');
  if (answer.map && typeof answer.map === 'object') return Object.values(answer.map).join(' → ');
  return Object.values(answer)
    .flatMap((value) => Array.isArray(value) ? value : [value])
    .filter((value) => ['string', 'number', 'boolean'].includes(typeof value))
    .join(' → ');
}

function addressedWrongExplanation(base, answer, options, lang) {
  const selected = describeSubmittedAnswer(answer, options, lang).replace(/\s+/g, ' ').trim();
  if (!selected) return base;
  return lang === 'ru'
    ? `Ты выбрал «${selected}». Этот вариант не выполняет условие задачи. ${base}`
    : `Siz «${selected}» javobini tanladingiz. Bu variant masala shartini bajarmaydi. ${base}`;
}

export default function PracticeHost({
  Question,
  lang: langProp = 'uz',
  muted: mutedProp = false,
  title,
  onResult,
  onAdvance,
  onLanguageChange,
  onMutedChange,
  finishReady = false,
  finished = false,
  source,
}) {
  const [lang, setLang] = useState(langProp);
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState(null);
  const [qKey, setQKey] = useState(0);
  const [muted, setMuted] = useState(mutedProp);
  const [narrationDoneKey, setNarrationDoneKey] = useState('');
  const checkFnRef = useRef(null);
  const contentRef = useRef(null);
  const narrationRef = useRef('');
  const ui = UI[lang] || UI.uz;
  const {
    isSpeaking,
    speak: speakTracked,
    stop: stopTrackedSpeech,
  } = useGrade3SpeechGate();
  const narrationKey = `${qKey}:${lang}`;
  const narrationDone = muted || narrationDoneKey === narrationKey;
  const audioLocked = !muted && (!narrationDone || isSpeaking);

  const onReady = useCallback((v) => setReady(!!v), []);
  const registerCheck = useCallback((fn) => { checkFnRef.current = fn; }, []);
  const onSubmit = useCallback((res) => {
    const submitted = {
      ...(res || { correct: false }),
      meta: { ...(res?.meta || {}), source: res?.meta?.source || source },
    };
    const baseExplanation = submitted.explanationText
      || submitted.feedbackText
      || (submitted.correct ? submitted.ruleText || ui.success : ui.fallback);
    const explanation = submitted.correct
      ? baseExplanation
      : addressedWrongExplanation(baseExplanation, submitted.studentAnswer, submitted.options, lang);
    const next = { ...submitted, explanationText: explanation };
    setResult(next);
    if (!muted && explanation) speakTracked(explanation, lang);
    onResult?.(next);
  }, [lang, muted, onResult, source, speakTracked, ui.fallback, ui.success]);
  const playCorrect = useCallback(() => beep(true), []);
  const playWrong = useCallback(() => beep(false), []);

  const reset = useCallback(() => {
    setResult(null); setReady(false); checkFnRef.current = null;
    setQKey((k) => k + 1);
  }, []);

  const changeLang = (nextLang) => {
    if (nextLang === lang) return;
    stopTrackedSpeech();
    setLang(nextLang);
    onLanguageChange?.(nextLang);
    reset();
  };

  const runCheck = () => {
    if (!ready || audioLocked || finished) return;
    checkFnRef.current?.();
  };
  const clearWrongOnInteraction = useCallback((event) => {
    const target = event.target;
    if (event.type === 'click' && !target?.closest?.('button,input,select,textarea,[role="button"],[role="radio"]')) {
      return;
    }
    setResult((current) => current?.correct === false ? null : current);
  }, []);
  const replayNarration = useCallback(() => {
    if (!muted && narrationRef.current) speakTracked(narrationRef.current, lang);
  }, [lang, muted, speakTracked]);
  const toggleMuted = () => {
    const nextMuted = !muted;
    if (nextMuted) stopTrackedSpeech();
    setMuted(nextMuted);
    onMutedChange?.(nextMuted);
  };

  useEffect(() => {
    if (muted) {
      stopTrackedSpeech();
      return undefined;
    }
    const timer = window.setTimeout(() => {
      const supplied = Question?.grade3Narration?.[lang];
      const fallback = contentRef.current?.innerText
        ?.replace(/\s+/g, ' ')
        .trim()
        .slice(0, 700);
      narrationRef.current = supplied || fallback || '';
      if (narrationRef.current) {
        speakTracked(
          narrationRef.current,
          lang,
          () => setNarrationDoneKey(narrationKey),
        );
      } else {
        setNarrationDoneKey(narrationKey);
      }
    }, 80);
    return () => {
      window.clearTimeout(timer);
      stopTrackedSpeech();
    };
  }, [Question, lang, muted, narrationKey, speakTracked, stopTrackedSpeech]);

  const chip = (active) => ({
    padding: '6px 13px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#2563eb' : '#d6dae3'),
    background: active ? '#2563eb' : '#fff', color: active ? '#fff' : '#374151',
    fontFamily: "'Manrope', system-ui, sans-serif",
  });
  return (
    <div
      className={`g3-practice-host${result ? ' has-result' : ''}${result?.correct === false ? ' has-wrong' : ''}${result?.correct === true ? ' has-correct' : ''}${audioLocked ? ' is-audio-locked' : ''}`}
      data-testid="grade3-practice-host"
      aria-busy={audioLocked}
    >
      <style>{`
        .g3-practice-host {
          position: relative;
          display: flex;
          flex: 1;
          flex-direction: column;
          width: 100%;
          max-width: 1080px;
          height: 100%;
          min-height: 0;
          margin: 0 auto;
        }
        .g3-practice-toolbar {
          position: fixed;
          top: 7px;
          right: 8px;
          z-index: 1101;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .g3-practice-toolbar-title {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
        }
        .g3-practice-viewport {
          flex: 1;
          min-height: 0;
          overflow: hidden;
          padding: 10px 12px 8px;
          overscroll-behavior: contain;
        }
        .g3-practice-content {
          width: 100%;
          height: 100%;
          min-height: 0;
        }
        .g3-practice-host.is-audio-locked .g3-practice-content {
          pointer-events: none;
          user-select: none;
        }
        .g3-practice-content > div:not(.g3-question-shell) {
          height: 100%;
          min-height: 0;
          max-width: 760px !important;
          padding: 2px !important;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }
        .g3-practice-content > div:not(.g3-question-shell) > div:first-child,
        .g3-practice-content > div:not(.g3-question-shell) > p:first-of-type {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          margin: -1px !important;
          padding: 0 !important;
          overflow: hidden !important;
          clip: rect(0,0,0,0) !important;
          white-space: nowrap !important;
        }
        .g3-practice-content > div:not(.g3-question-shell) > p {
          margin: 7px 0 !important;
          font-size: clamp(14px,2vw,17px) !important;
          line-height: 1.3 !important;
        }
        .g3-practice-content > div:not(.g3-question-shell) button {
          min-height: 44px !important;
          padding: 7px 9px !important;
          font-size: clamp(13px,1.8vw,16px) !important;
        }
        .g3-practice-footer {
          min-height: 62px;
          box-sizing: border-box;
          flex-shrink: 0;
          padding: 8px 12px;
          border-top: 1px solid #EEF0F4;
          background: rgba(255,255,255,.97);
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: center;
        }
        .g3-practice-footer.has-coach {
          min-height: 88px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 8px;
        }
        .g3-practice-footer .g3-bit-coach {
          width: 100%;
          margin: 0;
        }
        .g3-practice-action {
          min-width: 150px;
          min-height: 44px;
          padding: 9px 15px;
          border: 0;
          border-radius: 13px;
          color: #fff;
          background: #2563eb;
          font: 850 15px 'Manrope',system-ui,sans-serif;
          cursor: pointer;
        }
        .g3-practice-action:disabled {
          color: #fff;
          background: #c2c8d2;
          cursor: not-allowed;
        }
        .g3-practice-host.has-result .g3-practice-content [class*="-pop"] {
          display: none !important;
        }
        .g3-practice-content .g3-custom-feedback {
          display: none !important;
        }
        .g3-practice-host.has-result .g3-practice-content button {
          border-color: #D6DAE3 !important;
          background: #fff !important;
          color: #374151 !important;
          box-shadow: none !important;
          opacity: 1 !important;
        }
        .g3-practice-host.has-result .g3-practice-content input {
          border-color: #D6DAE3 !important;
          background: #fff !important;
          color: #111827 !important;
          box-shadow: none !important;
        }
        .g3-practice-host.has-correct .g3-practice-content {
          pointer-events: none;
        }
        @media (max-width: 639.98px) {
          .g3-practice-toolbar { top: 6px; right: 4px; gap: 3px; }
          .g3-practice-toolbar button { padding: 5px 9px !important; }
          .g3-practice-viewport { padding: 8px 10px 6px; }
          .g3-practice-footer { min-height: 58px; padding: 6px 10px; }
          .g3-practice-footer.has-coach {
            min-height: 78px;
            grid-template-columns: minmax(0,1fr) 92px;
            padding: 5px 6px;
          }
          .g3-practice-footer .g3-bit-coach {
            grid-template-columns: minmax(0,1fr) 30px !important;
            min-height: 64px !important;
          }
          .g3-practice-footer .g3-bit-coach-figure { display: none !important; }
          .g3-practice-footer .g3-bit-coach-copy strong { font-size: 8px !important; }
          .g3-practice-footer .g3-bit-coach-copy p { font-size: 10.5px !important; line-height: 1.2 !important; }
          .g3-practice-action { min-width: 0; min-height: 40px; padding: 6px 8px; font-size: 12px; }
          .g3-practice-content > div:not(.g3-question-shell) > div {
            margin-block: 4px !important;
            padding-block: 6px !important;
          }
          .g3-practice-content > div:not(.g3-question-shell) button {
            min-height: 40px !important;
            padding: 5px 7px !important;
            font-size: 12px !important;
          }
        }
      `}</style>
      <div className="g3-practice-toolbar">
        <strong className="g3-practice-toolbar-title">{title || ''}</strong>
        <button data-testid="grade3-practice-replay" type="button" style={chip(false)} onClick={replayNarration} disabled={muted} aria-label={lang === 'uz' ? 'Qayta eshitish' : 'Повторить аудио'}>↻</button>
        <button data-testid="grade3-practice-sound" type="button" style={chip(!muted)} onClick={toggleMuted} aria-label={lang === 'uz' ? 'Ovoz' : 'Звук'}>{muted ? '🔇' : '🔊'}</button>
        <button type="button" style={chip(lang === 'uz')} onClick={() => changeLang('uz')}>UZ</button>
        <button type="button" style={chip(lang === 'ru')} onClick={() => changeLang('ru')}>RU</button>
      </div>

      <div className="g3-practice-viewport">
        <div
          ref={contentRef}
          className="g3-practice-content"
          inert={audioLocked ? true : undefined}
          onClickCapture={clearWrongOnInteraction}
          onInputCapture={clearWrongOnInteraction}
        >
          <Question
            key={qKey + '-' + lang}
            lang={lang}
            mode="answer"
            initialAnswer={null}
            onReady={onReady}
            registerCheck={registerCheck}
            onSubmit={onSubmit}
            playCorrect={playCorrect}
            playWrong={playWrong}
            studentName="O'quvchi"
          />
        </div>
      </div>

      <div className={`g3-practice-footer${result?.correct === false ? ' has-coach' : ''}`}>
        {!narrationDone && (
          <span role="status" style={{ padding: '10px 12px', color: '#087EA4', fontSize: 13, fontWeight: 800 }}>
            {ui.listen}
          </span>
        )}
        {result?.correct === false && (
          <Grade3BitCoach
            message={result.explanationText || result.feedbackText || ui.fallback}
            lang={lang}
            compact
            onReplay={() => {
              const explanation = result.explanationText || result.feedbackText || ui.fallback;
              if (!muted) speakTracked(explanation, lang);
            }}
          />
        )}
        {result?.correct ? (
          <button
            data-testid="grade3-practice-advance"
            className="g3-practice-action"
            type="button"
            disabled={audioLocked || finished}
            onClick={onAdvance}
          >
            {finished ? ui.finished : finishReady ? ui.finish : ui.next}
          </button>
        ) : result?.correct === false ? (
          <span style={{ padding: '10px 12px', color: '#6B7280', fontSize: 14, fontWeight: 800 }}>
            {ui.change}
          </span>
        ) : ready ? (
          <button
            data-testid="grade3-practice-check"
            className="g3-practice-action"
            type="button"
            disabled={!ready || audioLocked || finished}
            onClick={runCheck}
          >
            {ui.check}
          </button>
        ) : (
          <button data-testid="grade3-practice-check" className="g3-practice-action" type="button" disabled>
            {ui.check}
          </button>
        )}
      </div>
    </div>
  );
}
