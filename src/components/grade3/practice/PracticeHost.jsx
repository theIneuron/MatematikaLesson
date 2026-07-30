/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect, useRef, useState } from 'react';
import { GRADE3_REVIEW_BADGE, GRADE3_REVIEW_MODE } from '../grade3ReviewMode.js';
import { speakGrade3Text, toGrade3SpeechText } from '../grade3Speech.js';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const IconRetry = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.5 15a9 9 0 1 0 2.1-9.4L1 10" /></svg>);
const IconAudio = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></svg>);

function beep(ok) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.frequency.value = ok ? 880 : 220;
    gain.gain.value = 0.055;
    oscillator.start();
    oscillator.stop(context.currentTime + 0.12);
    oscillator.addEventListener('ended', () => context.close?.());
  } catch {
    // Sound feedback is optional; the visual result remains available.
  }
}

const UI = {
  uz: {
    check: 'Tekshirish',
    retry: 'Qayta urinish',
    correct: 'To‘g‘ri!',
    wrong: 'Yana urinib ko‘ring',
    listen: 'Shartni tinglash',
  },
  ru: {
    check: 'Проверить',
    retry: 'Повторить',
    correct: 'Верно!',
    wrong: 'Попробуй ещё',
    listen: 'Прослушать условие',
  },
};

/**
 * Converts the short mathematical condition into speech-friendly text.
 * Kept exported so the normalisation can be unit-tested without a browser.
 */
export function normalizePracticeSpeechText(value, lang = 'uz') {
  const fraction = lang === 'ru'
    ? (numerator, denominator) => `${numerator} из ${denominator}`
    : (numerator, denominator) => `${denominator} dan ${numerator}`;
  const prepared = String(value ?? '')
    .replace(/(\d+)\s*\/\s*(\d+)/g, (_, numerator, denominator) => ` ${fraction(numerator, denominator)} `)
    .replace(/(?<=\d)\s*[xх]\s*(?=\d)/giu, ' × ')
    .replace(
      /(^|[^\p{L}\p{N}_])[xх](?=$|[^\p{L}\p{N}_])/giu,
      (_, prefix) => `${prefix}${lang === 'ru' ? ' икс ' : ' iks '}`,
    )
    .replace(/\+/g, lang === 'ru' ? ' плюс ' : ' qo‘shuv ')
    .replace(/−/g, lang === 'ru' ? ' минус ' : ' ayiruv ')
    .replace(/(?<=\d)\s+-\s+(?=\d)/g, lang === 'ru' ? ' минус ' : ' ayiruv ')
    .replace(/[–—]/g, ', ')
    .replace(/[•●◆]/gu, ' ')
    .replace(/(?:🔎|🧭|🧩|🚀|✨|✅|❓|☝️|✍️)/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return toGrade3SpeechText(prepared, lang).slice(0, 520);
}

function speakPracticeText(value, lang, ttsApiBase, voiceGender) {
  const spoken = normalizePracticeSpeechText(value, lang);
  if (!spoken) return null;
  return speakGrade3Text(spoken, {
    language: lang,
    rate: 0.92,
    ttsApiBase,
    voiceGender,
  });
}

function fallbackNarration(root) {
  if (!root) return '';
  const explicit = root.querySelector('[data-g3-narration]');
  if (explicit) return explicit.getAttribute('data-g3-narration') || explicit.textContent || '';
  const candidates = [...root.querySelectorAll('h1,h2,h3,[class*="ask"],[class*="task"],[class*="question"],p')];
  const unique = [];
  for (const node of candidates) {
    if (node.closest('[role="status"]')) continue;
    const text = node.textContent?.replace(/\s+/g, ' ').trim();
    if (text && text.length > 3 && !unique.includes(text)) unique.push(text);
    if (unique.join(' ').length >= 320 || unique.length >= 3) break;
  }
  return unique.join('. ');
}

const DRAFT_TARGETS = 'button,[role="button"],input,select,textarea';

function draftTarget(root, target) {
  const element = target?.closest?.(DRAFT_TARGETS);
  if (!element || !root?.contains(element) || element.disabled) return null;
  const candidates = [...root.querySelectorAll(DRAFT_TARGETS)];
  return {
    tag: element.tagName,
    aria: element.getAttribute('aria-label') || '',
    text: element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 80) || '',
    index: candidates.indexOf(element),
  };
}

function findDraftTarget(root, signature) {
  const candidates = [...(root?.querySelectorAll(DRAFT_TARGETS) || [])];
  return candidates.find((element) => (
    element.tagName === signature.tag &&
    (signature.aria ? element.getAttribute('aria-label') === signature.aria : true) &&
    (signature.text ? element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 80) === signature.text : true)
  )) || candidates[signature.index] || null;
}

export default function PracticeHost({
  Question,
  questionId,
  lang: langProp = 'uz',
  title,
  onResult,
  onDraft,
  onRetry,
  onLanguageChange,
  source,
  initialAnswer = null,
  initialResult = null,
  shuffleSeed = 0,
  active = true,
  ttsApiBase = '',
  voiceGender = 'f',
}) {
  const [localLang, setLocalLang] = useState(langProp === 'ru' ? 'ru' : 'uz');
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState(initialResult);
  const [qKey, setQKey] = useState(0);
  const [retryAnswer, setRetryAnswer] = useState(initialAnswer);
  const [narration, setNarration] = useState('');
  const checkFnRef = useRef(null);
  const contentRef = useRef(null);
  const onDraftRef = useRef(onDraft);
  const onResultRef = useRef(onResult);
  const speechCancelRef = useRef(null);
  const draftJournalRef = useRef(Array.isArray(initialAnswer?.uiJournal) ? initialAnswer.uiJournal : []);
  const replayingDraftRef = useRef(false);
  const lang = onLanguageChange ? (langProp === 'ru' ? 'ru' : 'uz') : localLang;
  const ui = UI[lang] || UI.uz;

  useEffect(() => { onDraftRef.current = onDraft; }, [onDraft]);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);
  const stopNarration = useCallback(() => {
    speechCancelRef.current?.();
    speechCancelRef.current = null;
    window.speechSynthesis?.cancel?.();
  }, []);
  useEffect(() => stopNarration, [stopNarration]);

  const onReady = useCallback((value) => setReady(Boolean(value)), []);
  const registerCheck = useCallback((fn) => {
    checkFnRef.current = typeof fn === 'function' ? fn : null;
  }, []);
  const registerNarration = useCallback((value) => setNarration(String(value || '')), []);
  const handleDraft = useCallback((draft) => {
    setRetryAnswer(draft);
    onDraftRef.current?.(draft);
  }, []);
  const handleSubmit = useCallback((submitted) => {
    const next = {
      ...(submitted || { correct: false }),
      meta: { ...(submitted?.meta || {}), source: submitted?.meta?.source || source },
    };
    setResult(next);
    setRetryAnswer(next);
    draftJournalRef.current = [];
    onDraftRef.current?.(next);
    onResultRef.current?.(next);
  }, [source]);
  const playCorrect = useCallback(() => beep(true), []);
  const playWrong = useCallback(() => beep(false), []);

  const saveUiDraft = useCallback((entry) => {
    if (replayingDraftRef.current || contentRef.current?.querySelector('.g3-question-shell')) return;
    const journal = [...draftJournalRef.current, entry].slice(-80);
    draftJournalRef.current = journal;
    const draft = { uiJournal: journal };
    setRetryAnswer(draft);
    onDraftRef.current?.(draft);
  }, []);

  const captureDraftClick = useCallback((event) => {
    const signature = draftTarget(contentRef.current, event.target);
    if (signature) saveUiDraft({ type: 'click', target: signature });
  }, [saveUiDraft]);

  const captureDraftInput = useCallback((event) => {
    const signature = draftTarget(contentRef.current, event.target);
    if (signature) saveUiDraft({ type: 'input', target: signature, value: event.target.value });
  }, [saveUiDraft]);

  useEffect(() => {
    const journal = draftJournalRef.current;
    if (!journal.length) return undefined;
    replayingDraftRef.current = true;
    const timers = journal.map((entry, index) => window.setTimeout(() => {
      const element = findDraftTarget(contentRef.current, entry.target);
      if (element && entry.type === 'input') {
        const prototype = element.tagName === 'TEXTAREA'
          ? window.HTMLTextAreaElement?.prototype
          : window.HTMLInputElement?.prototype;
        const setter = prototype && Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
        if (setter) setter.call(element, entry.value);
        else element.value = entry.value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      } else if (element) {
        element.click();
      }
      if (index === journal.length - 1) replayingDraftRef.current = false;
    }, 30 + index * 32));
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      replayingDraftRef.current = false;
    };
  }, [Question, questionId]);

  const getNarration = useCallback(() => narration || fallbackNarration(contentRef.current), [narration]);
  const playNarration = useCallback(() => {
    stopNarration();
    speechCancelRef.current = speakPracticeText(getNarration(), lang, ttsApiBase, voiceGender);
  }, [getNarration, lang, stopNarration, ttsApiBase, voiceGender]);

  useEffect(() => {
    if (!active) return undefined;
    const timer = window.setTimeout(() => {
      const text = getNarration();
      if (text) {
        stopNarration();
        speechCancelRef.current = speakPracticeText(text, lang, ttsApiBase, voiceGender);
      }
    }, 280);
    return () => {
      window.clearTimeout(timer);
      stopNarration();
    };
  }, [Question, active, getNarration, lang, questionId, stopNarration, ttsApiBase, voiceGender]);

  const retry = useCallback(() => {
    const draft = null;
    stopNarration();
    setResult(null);
    setReady(false);
    setRetryAnswer(draft);
    draftJournalRef.current = [];
    checkFnRef.current = null;
    setQKey((key) => key + 1);
    onDraftRef.current?.(draft);
    onRetry?.({ draft });
  }, [onRetry, stopNarration]);

  const changeLang = (nextLang) => {
    if (nextLang === lang) return;
    stopNarration();
    if (onLanguageChange) onLanguageChange(nextLang);
    else setLocalLang(nextLang);
  };

  const runCheck = () => checkFnRef.current?.();
  const chip = (active) => ({
    minWidth: 38,
    minHeight: 32,
    padding: '4px 9px',
    borderRadius: 999,
    border: `1.5px solid ${active ? '#2563eb' : '#d6dae3'}`,
    color: active ? '#fff' : '#374151',
    background: active ? '#2563eb' : '#fff',
    font: "800 12px 'Manrope', system-ui, sans-serif",
    cursor: 'pointer',
  });
  const btnBase = {
    minWidth: 172,
    minHeight: 44,
    padding: '9px 18px',
    borderRadius: 14,
    font: "850 16px 'Manrope', system-ui, sans-serif",
  };

  return (
    <div className={`g3-practice-host${active ? '' : ' is-inactive'}${result?.correct === false ? ' has-wrong-result' : ''}${result?.correct === true ? ' has-correct-result' : ''}`} aria-hidden={!active}>
      <style>{`
        .g3-practice-host {
          position: relative;
          display: flex;
          flex: 1;
          flex-direction: column;
          width: 100%;
          max-width: 1120px;
          height: 100%;
          min-height: 0;
          margin: 0 auto;
          overflow: hidden;
        }
        .g3-practice-host.is-inactive { display: none; }
        .g3-practice-toolbar {
          position: absolute;
          top: 6px;
          right: 8px;
          z-index: 4;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .g3-practice-qa-badge {
          padding: 4px 7px;
          border-radius: 999px;
          color: #8A4B00;
          background: #FFF0C2;
          font: 900 10px 'Manrope', system-ui, sans-serif;
          letter-spacing: .04em;
        }
        .g3-practice-audio {
          width: 34px;
          height: 32px;
          display: grid;
          place-items: center;
          padding: 0;
          border: 1.5px solid #D6DAE3;
          border-radius: 999px;
          color: #25577A;
          background: #fff;
          cursor: pointer;
        }
        .g3-practice-viewport {
          flex: 1;
          min-height: 0;
          overflow: hidden;
          padding: 7px 10px 5px;
          overscroll-behavior: none;
        }
        .g3-practice-content {
          width: 100%;
          height: 100%;
          min-height: 0;
          overflow: hidden;
        }
        .g3-practice-host.has-wrong-result
          .g3-practice-content > div:not(.g3-question-shell)
          [class*="-pop"] {
          display: none !important;
        }
        .g3-practice-footer {
          min-height: 54px;
          box-sizing: border-box;
          flex-shrink: 0;
          padding: 5px 10px;
          border-top: 1px solid #EEF0F4;
          background: rgba(255,255,255,.98);
          display: flex;
          gap: 9px;
          align-items: center;
          justify-content: center;
        }
        .g3-practice-result {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font: 850 14px 'Manrope', system-ui, sans-serif;
        }
        @media (max-width: 639.98px) {
          .g3-practice-toolbar { top: 4px; right: 5px; gap: 3px; }
          .g3-practice-qa-badge { display: none; }
          .g3-practice-viewport { padding: 5px 7px 3px; }
          .g3-practice-footer { min-height: 50px; padding: 3px 7px; }
          .g3-practice-footer .g3-practice-result { font-size: 12px; }
          .g3-practice-content > div:not(.g3-question-shell) {
            max-height: 100%;
            padding-block: 0 !important;
            overflow: hidden;
          }
          .g3-practice-content > div:not(.g3-question-shell) > div:first-child {
            font-size: 11px !important;
            line-height: 1.1 !important;
          }
          .g3-practice-content > div:not(.g3-question-shell) > p {
            margin-block: 4px !important;
            font-size: 15px !important;
            line-height: 1.28 !important;
          }
          .g3-practice-content > div:not(.g3-question-shell) > div {
            margin-block: 4px !important;
          }
          .g3-practice-content > div:not(.g3-question-shell) button {
            min-height: 44px !important;
            margin-bottom: 5px !important;
            padding-block: 7px !important;
            font-size: 16px !important;
          }
        }
        @media (max-height: 680px) {
          .g3-practice-viewport { padding-block: 3px; }
          .g3-practice-footer { min-height: 46px; }
        }
        @media (max-width: 719.98px) and (max-height: 680px) {
          .g3-practice-content > div:not(.g3-question-shell) {
            width: 100% !important;
            max-width: none !important;
            max-height: none !important;
            margin-inline: auto !important;
            padding-top: 38px !important;
            padding-bottom: 0 !important;
            box-sizing: border-box !important;
            overflow: visible !important;
            zoom: .84;
          }
          .g3-practice-content
            > div:not(.g3-question-shell):has(.g3-lesson-numpad)
            > div:not(:first-child):not(.g3-lesson-numpad):not([class*="-pop"]) {
            display: none !important;
          }
          .g3-practice-content > div:not(.g3-question-shell) .g3-lesson-numpad {
            width: min(184px, 100%) !important;
            gap: 4px !important;
            padding: 13px 7px 7px !important;
            border-radius: 19px !important;
          }
          .g3-practice-content > div:not(.g3-question-shell) .g3-lesson-numpad__speaker {
            top: 6px !important;
            height: 3px !important;
          }
          .g3-practice-content > div:not(.g3-question-shell) .g3-lesson-numpad__display {
            height: 42px !important;
            padding-inline: 8px !important;
            border-width: 2px !important;
            border-radius: 11px !important;
            font-size: 25px !important;
          }
          .g3-practice-content > div:not(.g3-question-shell) .g3-lesson-numpad__grid {
            gap: 4px !important;
          }
          .g3-practice-content > div:not(.g3-question-shell) .g3-lesson-numpad__key,
          .g3-practice-content > div:not(.g3-question-shell) .g3-lesson-numpad__spacer {
            width: 42px !important;
            height: 34px !important;
          }
          .g3-practice-host.has-correct-result
            .g3-practice-content > div:not(.g3-question-shell) {
            min-height: 100%;
            padding-top: 0 !important;
            display: flex;
            flex-direction: column;
            justify-content: center;
            zoom: 1;
          }
          .g3-practice-host.has-correct-result
            .g3-practice-content > div:not(.g3-question-shell)
            > *:not(style):not([class*="-pop"]) {
            display: none !important;
          }
          .g3-practice-host.has-correct-result
            .g3-practice-content > div:not(.g3-question-shell)
            > [class*="-pop"] {
            display: flex !important;
            margin-block: 4px !important;
            padding: 9px 11px !important;
            font-size: 14px !important;
            line-height: 1.32 !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .g3-practice-host *, .g3-practice-host *::before, .g3-practice-host *::after {
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <div className="g3-practice-toolbar">
        {GRADE3_REVIEW_MODE && <span className="g3-practice-qa-badge">{GRADE3_REVIEW_BADGE[lang] || GRADE3_REVIEW_BADGE.uz}</span>}
        <button type="button" className="g3-practice-audio" onClick={playNarration} aria-label={ui.listen} title={ui.listen}><IconAudio /></button>
        <button type="button" style={chip(lang === 'uz')} onClick={() => changeLang('uz')}>UZ</button>
        <button type="button" style={chip(lang === 'ru')} onClick={() => changeLang('ru')}>RU</button>
      </div>

      <div className="g3-practice-viewport">
        <div
          ref={contentRef}
          className="g3-practice-content"
          onClickCapture={captureDraftClick}
          onInputCapture={captureDraftInput}
        >
          <Question
            key={`${qKey}-${shuffleSeed}`}
            lang={lang}
            mode="answer"
            initialAnswer={retryAnswer}
            shuffleSeed={`${questionId || title || 'g3'}:${shuffleSeed}`}
            onReady={onReady}
            onDraft={handleDraft}
            registerCheck={registerCheck}
            registerNarration={registerNarration}
            onSubmit={handleSubmit}
            playCorrect={playCorrect}
            playWrong={playWrong}
            studentName="O'quvchi"
          />
        </div>
      </div>

      <div className="g3-practice-footer">
        {result && (
          <div className="g3-practice-result" style={{ color: result.correct ? '#1A7F43' : '#B9382F' }}>
            {result.correct ? <IconOk /> : <IconNo />}
            {result.correct ? ui.correct : ui.wrong}
          </div>
        )}
        {!result ? (
          <button
            type="button"
            disabled={!ready}
            onClick={runCheck}
            style={{ ...btnBase, border: 0, color: '#fff', background: ready ? '#2563EB' : '#C2C8D2', cursor: ready ? 'pointer' : 'not-allowed' }}
          >
            {ui.check}
          </button>
        ) : result.correct && !GRADE3_REVIEW_MODE ? null : (
          <button
            type="button"
            onClick={retry}
            style={{ ...btnBase, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, border: '1.5px solid #D6DAE3', color: '#374151', background: '#fff', cursor: 'pointer' }}
          >
            <IconRetry /> {ui.retry}
          </button>
        )}
      </div>
    </div>
  );
}
