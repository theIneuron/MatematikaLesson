import { useEffect, useMemo, useRef, useState } from 'react';
import { GRADE3_REVIEW_MODE } from '../grade3ReviewMode.js';
import { grade3StorageKey, readGrade3State, writeGrade3State } from '../grade3Storage.js';
import PracticeHost from './PracticeHost.jsx';
import { createPracticeQuestion } from './QuestionFactory.jsx';
import { getGrade3PracticeSource } from './sourceRegistry.js';
import { restorePracticeIndex } from './grade3PracticeUtils.js';

const EMPTY_PROGRESS = Object.freeze({
  index: 0,
  lang: 'uz',
  entries: {},
});

function createShuffleSeed() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    return crypto.getRandomValues(new Uint32Array(1))[0];
  }
  return Math.floor(Math.random() * 0xFFFFFFFF);
}

function nextShuffleSeed(currentSeed) {
  const numeric = Number(currentSeed);
  return Number.isFinite(numeric) ? numeric + 1 : createShuffleSeed();
}

function readProgress(storageKey, itemCount) {
  const saved = readGrade3State(storageKey, EMPTY_PROGRESS);
  return {
    index: restorePracticeIndex(saved?.index, itemCount),
    lang: saved?.lang === 'ru' ? 'ru' : 'uz',
    entries: saved?.entries && typeof saved.entries === 'object' ? saved.entries : {},
    startedAt: Number.isFinite(Number(saved?.startedAt)) ? Number(saved.startedAt) : Date.now(),
    completedAt: Number.isFinite(Number(saved?.completedAt)) ? Number(saved.completedAt) : null,
    finishReportedAt: Number.isFinite(Number(saved?.finishReportedAt))
      ? Number(saved.finishReportedAt)
      : null,
  };
}

function entryWithDefaults(entry) {
  return {
    result: entry?.result || null,
    draft: entry?.draft || entry?.result || null,
    attempts: Math.max(0, Number(entry?.attempts) || 0),
    errors: Math.max(0, Number(entry?.errors) || 0),
    retries: Math.max(0, Number(entry?.retries) || 0),
    shuffleSeed: Number.isFinite(Number(entry?.shuffleSeed)) ? Number(entry.shuffleSeed) : createShuffleSeed(),
  };
}

function writeProgress(storageKey, index, progress) {
  return writeGrade3State(storageKey, {
    version: 2,
    index,
    lang: progress.lang,
    entries: progress.entries,
    startedAt: progress.startedAt,
    completedAt: progress.completedAt,
    finishReportedAt: progress.finishReportedAt,
    updatedAt: Date.now(),
  });
}

function finishedPayload({ bank, lessonNumber, items, progress }) {
  const entries = items.map((item) => entryWithDefaults(progress.entries[item.id]));
  const correctAnswers = entries.filter((entry) => entry.result?.correct).length;
  const completedAt = Number(progress.completedAt) || Date.now();
  const startedAt = Number(progress.startedAt) || completedAt;
  const totalQuestions = items.length;

  return {
    lessonId: bank.lessonId || `num-3-${String(lessonNumber).padStart(2, '0')}-practice`,
    lessonTitle: bank.title,
    durationSec: Math.max(0, Math.floor((completedAt - startedAt) / 1000)),
    totalQuestions,
    correctAnswers,
    scorePercent: totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
    finalScore: correctAnswers,
    finalTotal: totalQuestions,
    passed: totalQuestions ? correctAnswers / totalQuestions >= 0.6 : false,
    firstTryStats: {
      total: entries.filter((entry) => entry.attempts > 0).length,
      firstTryCorrect: entries.filter(
        (entry) => entry.result?.correct && entry.attempts === 1 && entry.errors === 0,
      ).length,
    },
    answers: items.map((item, itemIndex) => ({
      ...(entries[itemIndex].result || {}),
      questionId: item.id,
      questionLabel: item.label,
      attempts: entries[itemIndex].attempts,
      errors: entries[itemIndex].errors,
      retries: entries[itemIndex].retries,
    })),
  };
}

export default function PracticeBank({
  bank,
  ttsApiBase = '',
  voiceGender = 'f',
  onFinished,
}) {
  const lessonNumber = Number(bank.title?.match(/Dars\s+(\d+)/i)?.[1]);
  const source = bank.source || getGrade3PracticeSource(lessonNumber);
  const items = useMemo(() => bank.items.map((spec, itemIndex) => {
    const baseSource = spec.source || source;
    const sourcedSpec = {
      ...spec,
      scene: spec.scene || bank.scene,
      source: baseSource
        ? {
          ...baseSource,
          skill: baseSource.skills?.length
            ? baseSource.skills[itemIndex % baseSource.skills.length]
            : baseSource.skill,
        }
        : null,
    };
    return {
      ...sourcedSpec,
      Component: spec.text
        ? createPracticeQuestion(sourcedSpec)
        : spec.Component || createPracticeQuestion(sourcedSpec),
    };
  }), [bank, source]);
  const storageKey = grade3StorageKey('practice', lessonNumber || bank.id || bank.title || 'unknown');
  const [progress, setProgress] = useState(() => {
    const saved = readProgress(storageKey, items.length);
    const entries = { ...saved.entries };
    items.forEach((item) => {
      entries[item.id] = entryWithDefaults(entries[item.id]);
    });
    return { ...saved, entries };
  });
  const finishEmittedRef = useRef(Boolean(progress.finishReportedAt));
  const completedAtRef = useRef(progress.completedAt);
  const finishReportedAtRef = useRef(progress.finishReportedAt);
  const index = Math.max(0, Math.min(items.length - 1, progress.index));
  const current = items[index] || items[0];

  useEffect(() => {
    writeProgress(storageKey, index, {
      ...progress,
      completedAt: progress.completedAt || completedAtRef.current,
      finishReportedAt: progress.finishReportedAt || finishReportedAtRef.current,
    });
  }, [index, progress, storageKey]);

  const updateEntry = (itemId, updater) => {
    setProgress((previous) => {
      const priorEntry = entryWithDefaults(previous.entries[itemId]);
      const entries = {
        ...previous.entries,
        [itemId]: updater(priorEntry),
      };
      const completedNow = items.length > 0 && items.every(
        (item) => entries[item.id]?.result?.correct === true,
      );
      const completedAt = completedNow
        ? (previous.completedAt || completedAtRef.current || Date.now())
        : previous.completedAt;
      if (completedAt) completedAtRef.current = completedAt;
      return {
        ...previous,
        entries,
        completedAt,
      };
    });
  };

  const goTo = (nextIndex) => {
    if (!GRADE3_REVIEW_MODE && nextIndex > 0) {
      const previousId = items[nextIndex - 1]?.id;
      if (!progress.entries[previousId]?.result?.correct) return;
    }
    setProgress((previous) => ({ ...previous, index: nextIndex }));
  };

  const metrics = useMemo(() => {
    const entries = items.map((item) => entryWithDefaults(progress.entries[item.id]));
    return {
      completed: entries.filter((entry) => entry.result?.correct).length,
      attempted: entries.filter((entry) => entry.attempts > 0).length,
      errors: entries.reduce((sum, entry) => sum + entry.errors, 0),
      retries: entries.reduce((sum, entry) => sum + entry.retries, 0),
    };
  }, [items, progress.entries]);
  const allComplete = items.length > 0 && metrics.completed === items.length;

  useEffect(() => {
    if (
      !allComplete ||
      typeof onFinished !== 'function' ||
      progress.finishReportedAt ||
      finishEmittedRef.current
    ) {
      return;
    }

    finishEmittedRef.current = true;
    const completedAt = progress.completedAt || completedAtRef.current || Date.now();
    completedAtRef.current = completedAt;
    const finishReportedAt = Date.now();
    finishReportedAtRef.current = finishReportedAt;
    const reportedProgress = { ...progress, completedAt, finishReportedAt };
    // Persist the guard before invoking host code so an immediate Reload cannot
    // emit the same completed attempt twice.
    writeProgress(storageKey, index, reportedProgress);

    try {
      onFinished(finishedPayload({
        bank,
        lessonNumber,
        items,
        progress: reportedProgress,
      }));
    } catch (error) {
      console.error('[grade3 practice] onFinished failed.', error);
    }
  }, [
    allComplete,
    bank,
    index,
    items,
    lessonNumber,
    onFinished,
    progress,
    storageKey,
  ]);

  const chip = (active, entry, enabled) => ({
    minWidth: 22,
    height: 26,
    padding: '2px 3px',
    borderRadius: 8,
    border: `1.5px solid ${active ? '#2563EB' : entry?.result?.correct ? '#1F7A4D' : entry?.result ? '#B9382F' : '#D6DAE3'}`,
    color: active ? '#fff' : entry?.result?.correct ? '#1F7A4D' : entry?.result ? '#B9382F' : '#374151',
    background: active ? '#2563EB' : entry?.result?.correct ? '#E3F0E8' : entry?.result ? '#FDECEC' : '#fff',
    font: "900 11px 'Manrope', system-ui, sans-serif",
    cursor: enabled ? 'pointer' : 'not-allowed',
    opacity: enabled ? 1 : 0.48,
  });

  if (!current) return null;

  return (
    <div className="g3-practice-bank-root">
      <style>{`
        .g3-practice-bank-root {
          position: fixed;
          inset: 0;
          z-index: 90;
          display: flex;
          flex-direction: column;
          width: 100vw;
          height: 100dvh;
          overflow: hidden;
          background: #fff;
          font-family: 'Manrope', system-ui, sans-serif;
          overscroll-behavior: none;
        }
        .g3-practice-bank-header {
          min-height: 54px;
          box-sizing: border-box;
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          align-content: center;
          gap: 3px;
          flex-shrink: 0;
          padding: 4px 10px 4px 55px;
          border-bottom: 1px solid #EEF0F4;
          background: rgba(255,255,255,.98);
        }
        .g3-practice-bank-summary {
          display: flex;
          min-width: 0;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #596170;
          font-size: 10.5px;
          font-weight: 850;
          white-space: nowrap;
        }
        .g3-practice-bank-summary .is-complete { color: #1F7A4D; }
        .g3-practice-bank-nav {
          display: grid;
          grid-template-columns: repeat(10, minmax(20px, 1fr));
          min-width: 0;
          gap: 3px;
          overflow: hidden;
        }
        .lesson-back {
          top: 8px;
          left: 8px;
          z-index: 94;
          width: 38px;
          justify-content: center;
          min-height: 36px;
          box-sizing: border-box;
          padding: 0;
          overflow: hidden;
          font-size: 0;
        }
        .lesson-back::before {
          content: '←';
          font-size: 18px;
          line-height: 1;
        }
        .g3-practice-bank-body {
          position: relative;
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        @media (min-width: 720px) {
          .g3-practice-bank-header {
            grid-template-columns: minmax(250px, 520px) auto;
            justify-content: center;
            gap: 14px;
            padding-right: 112px;
          }
          .g3-practice-bank-summary { order: 2; font-size: 11.5px; }
          .g3-practice-bank-nav { order: 1; }
        }
        @media (max-width: 390px) {
          .g3-practice-bank-header {
            min-height: 52px;
            padding-left: 52px;
            padding-right: 7px;
          }
          .g3-practice-bank-summary { gap: 5px; font-size: 9.5px; }
          .g3-practice-bank-nav { gap: 2px; }
        }
        @media (max-height: 680px) {
          .g3-practice-bank-header { min-height: 48px; padding-block: 2px; }
          .g3-practice-bank-summary { line-height: 1; }
          .g3-practice-bank-nav button { height: 23px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .g3-practice-bank-root *, .g3-practice-bank-root *::before, .g3-practice-bank-root *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <header className="g3-practice-bank-header">
        <div
          className="g3-practice-bank-summary"
          aria-label={`Bajarildi ${metrics.completed}. Urinildi ${metrics.attempted}. Xatolar ${metrics.errors}. Takrorlar ${metrics.retries}.`}
          title={`✓ ${metrics.completed}/${items.length} · urinish ${metrics.attempted} · xato ${metrics.errors} · qayta ${metrics.retries}`}
        >
          <span className={metrics.completed === items.length ? 'is-complete' : ''}>✓ {metrics.completed}/{items.length}</span>
          <span>• {metrics.attempted}</span>
          <span>! {metrics.errors}</span>
          <span>↻ {metrics.retries}</span>
        </div>
        <nav className="g3-practice-bank-nav" aria-label="Amaliyot topshiriqlari">
          {items.map((item, itemIndex) => {
            const entry = entryWithDefaults(progress.entries[item.id]);
            const enabled = GRADE3_REVIEW_MODE || itemIndex === 0 || Boolean(progress.entries[items[itemIndex - 1]?.id]?.result?.correct);
            return (
              <button
                key={item.id}
                type="button"
                disabled={!enabled}
                aria-current={itemIndex === index ? 'step' : undefined}
                aria-label={`${itemIndex + 1}. ${item.label}`}
                title={`${itemIndex + 1}. ${item.level} ${item.label}`}
                style={chip(itemIndex === index, entry, enabled)}
                onClick={() => goTo(itemIndex)}
              >
                {entry.result?.correct ? '✓' : itemIndex + 1}
              </button>
            );
          })}
        </nav>
      </header>

      <div className="g3-practice-bank-body">
        {items.map((item, itemIndex) => {
          const entry = entryWithDefaults(progress.entries[item.id]);
          return (
            <PracticeHost
              key={item.id}
              active={itemIndex === index}
              Question={item.Component}
              questionId={item.id}
              lang={progress.lang}
              title={`${itemIndex + 1}/${items.length} · ${item.label}`}
              source={item.source}
              initialAnswer={entry.draft}
              initialResult={entry.result}
              shuffleSeed={entry.shuffleSeed}
              ttsApiBase={ttsApiBase}
              voiceGender={voiceGender}
              onLanguageChange={(lang) => setProgress((previous) => ({ ...previous, lang }))}
              onDraft={(draft) => updateEntry(item.id, (prior) => ({ ...prior, draft }))}
              onRetry={({ draft }) => updateEntry(item.id, (prior) => ({
                ...prior,
                result: null,
                draft,
                retries: prior.retries + 1,
                shuffleSeed: nextShuffleSeed(prior.shuffleSeed),
              }))}
              onResult={(result) => updateEntry(item.id, (prior) => ({
                ...prior,
                result,
                draft: result,
                attempts: prior.attempts + 1,
                errors: prior.errors + (result.correct ? 0 : 1),
              }))}
            />
          );
        })}
      </div>
    </div>
  );
}
