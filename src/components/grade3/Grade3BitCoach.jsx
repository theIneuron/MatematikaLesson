/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect, useRef, useState } from 'react';
import Grade3EtalonBit from './Grade3EtalonBit.jsx';

const COACH_COPY = {
  uz: {
    label: 'Bit tushuntiradi',
    replay: 'Bit izohini qayta eshitish',
  },
  ru: {
    label: 'Бит объясняет',
    replay: 'Повторить объяснение Бита',
  },
};

function speechText(value, lang) {
  const text = String(value || '').trim();
  if (!text) return '';

  const words = lang === 'ru'
    ? { multiply: ' умножить на ', divide: ' разделить на ', equals: ' равно ', minus: ' минус ', plus: ' плюс ' }
    : { multiply: ' ko‘paytirish ', divide: ' bo‘lish ', equals: ' teng ', minus: ' ayirish ', plus: ' qo‘shish ' };

  return text
    .replaceAll('×', words.multiply)
    .replaceAll('·', words.multiply)
    .replaceAll(':', words.divide)
    .replaceAll('=', words.equals)
    .replaceAll('−', words.minus)
    .replaceAll('+', words.plus)
    .replace(/\s+/g, ' ')
    .trim();
}

export function stopGrade3Speech() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

export function speakGrade3Text(value, lang = 'uz') {
  if (
    typeof window === 'undefined'
    || !window.speechSynthesis
    || typeof window.SpeechSynthesisUtterance !== 'function'
  ) {
    return null;
  }

  const text = speechText(value, lang);
  if (!text) return null;

  window.speechSynthesis.cancel();
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'ru' ? 'ru-RU' : 'uz-UZ';
  utterance.rate = 0.94;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function useGrade3SpeechGate({ safetyMs = 60000 } = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const runRef = useRef(0);
  const timerRef = useRef(null);

  const clearSafetyTimer = useCallback(() => {
    if (timerRef.current == null || typeof window === 'undefined') return;
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const stop = useCallback(() => {
    runRef.current += 1;
    clearSafetyTimer();
    stopGrade3Speech();
    setIsSpeaking(false);
  }, [clearSafetyTimer]);

  const speak = useCallback((value, lang = 'uz', onDone) => {
    const run = runRef.current + 1;
    runRef.current = run;
    clearSafetyTimer();

    const utterance = speakGrade3Text(value, lang);
    if (!utterance) {
      setIsSpeaking(false);
      onDone?.();
      return false;
    }

    setIsSpeaking(true);
    let settled = false;
    const finish = () => {
      if (settled || runRef.current !== run) return;
      settled = true;
      clearSafetyTimer();
      setIsSpeaking(false);
      onDone?.();
    };

    utterance.addEventListener?.('end', finish, { once: true });
    utterance.addEventListener?.('error', finish, { once: true });
    utterance.onend = finish;
    utterance.onerror = finish;
    if (typeof window !== 'undefined') {
      timerRef.current = window.setTimeout(finish, safetyMs);
    }
    return true;
  }, [clearSafetyTimer, safetyMs]);

  useEffect(() => () => {
    runRef.current += 1;
    clearSafetyTimer();
    stopGrade3Speech();
  }, [clearSafetyTimer]);

  return { isSpeaking, speak, stop };
}

export default function Grade3BitCoach({
  message,
  lang = 'uz',
  compact = false,
  onReplay,
}) {
  const copy = COACH_COPY[lang] || COACH_COPY.uz;

  useEffect(() => () => {
    if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
    }
  }, []);

  if (!message) return null;

  const replay = () => {
    if (onReplay) onReplay();
    else speakGrade3Text(message, lang);
  };

  return (
    <aside
      className={`g3-bit-coach${compact ? ' is-compact' : ''}`}
      data-grade3-bit-feedback="true"
      role="status"
      aria-live="polite"
    >
      <div className="g3-bit-coach-figure">
        <Grade3EtalonBit state="hint" className="g3-bit-coach-avatar" />
      </div>
      <div className="g3-bit-coach-copy">
        <strong>{copy.label}</strong>
        <p>{message}</p>
      </div>
      <button type="button" onClick={replay} aria-label={copy.replay} title={copy.replay}>
        <span aria-hidden="true">🔊</span>
      </button>
      <style>{`
        .g3-bit-coach {
          position: relative;
          display: grid;
          grid-template-columns: 54px minmax(0,1fr) 38px;
          align-items: center;
          gap: 12px;
          width: min(430px,100%);
          min-height: 84px;
          margin: 12px auto 0;
          padding: 7px 10px;
          box-sizing: border-box;
          overflow: hidden;
          border: 1px solid rgba(1,154,203,.2);
          border-radius: 16px;
          background: linear-gradient(135deg,#F2FAFC,#FFF9EC);
          box-shadow: 0 16px 34px -27px rgba(23,54,71,.65);
          color: #253C49;
          animation: g3-bit-coach-in .32s cubic-bezier(.22,.8,.3,1) both;
        }
        .g3-bit-coach .g3-bit-coach-figure {
          display: block !important;
          align-self: end;
          width: 54px;
          height: 68px;
        }
        .g3-bit-coach-avatar {
          display: block;
          width: 54px;
          height: 68px;
          transform-origin: 50% 100%;
          animation: g3-bit-coach-wave 1.8s ease-in-out infinite;
        }
        .g3-bit-coach-copy {
          min-width: 0;
        }
        .g3-bit-coach-copy strong {
          display: block;
          margin-bottom: 3px;
          color: #087EA4;
          font: 850 11px 'Manrope',system-ui,sans-serif;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .g3-bit-coach-copy p {
          margin: 0;
          color: #253C49;
          font: 700 clamp(13px,1.5vw,15px)/1.32 'Source Serif 4',Georgia,serif;
        }
        .g3-bit-coach > button {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          padding: 0;
          border: 1px solid rgba(1,154,203,.2);
          border-radius: 12px;
          background: #fff;
          box-shadow: 0 6px 16px -9px rgba(23,54,71,.45);
          cursor: pointer;
        }
        .g3-bit-coach.is-compact {
          grid-template-columns: 54px minmax(0,1fr) 34px;
          min-height: 82px;
          margin-top: 8px;
          padding: 7px 9px;
          border-radius: 15px;
        }
        .g3-bit-coach.is-compact .g3-bit-coach-figure { width: 54px; height: 68px; }
        .g3-bit-coach.is-compact .g3-bit-coach-avatar { width: 54px; height: 68px; }
        .g3-bit-coach.is-compact > button { width: 34px; height: 34px; }
        @keyframes g3-bit-coach-in {
          from { opacity: 0; transform: translateY(8px) scale(.985); }
          to { opacity: 1; transform: none; }
        }
        @keyframes g3-bit-coach-wave {
          50% { transform: translateY(-2px) rotate(-1.5deg); }
        }
        @media (max-width: 520px), (max-height: 680px) {
          .g3-bit-coach.g3-bit-coach {
            grid-template-columns: 46px minmax(0,1fr) 32px;
            width: min(430px,100%);
            height: auto;
            min-height: 70px;
            max-height: none;
            gap: 8px;
            margin-top: 7px;
            padding: 6px 8px;
            border-radius: 14px;
          }
          .g3-bit-coach .g3-bit-coach-figure {
            display: block !important;
            width: 46px;
            height: 58px;
          }
          .g3-bit-coach .g3-bit-coach-avatar { width: 46px; height: 58px; }
          .g3-bit-coach > button { width: 32px; height: 32px; border-radius: 10px; }
          .g3-bit-coach-copy strong { font-size: 9px; }
          .g3-bit-coach .g3-bit-coach-copy p {
            font-size: 12px;
            line-height: 1.24;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .g3-bit-coach,
          .g3-bit-coach-avatar { animation: none; }
        }
      `}</style>
    </aside>
  );
}
