import { useEffect, useMemo, useRef, useState } from 'react';
import PracticeHost from './PracticeHost.jsx';
import { createPracticeQuestion } from './QuestionFactory.jsx';
import { getGrade3PracticeSource } from './sourceRegistry.js';

export default function PracticeBank({ bank, onFinished }) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState({});
  const [finished, setFinished] = useState(false);
  const [practiceLang, setPracticeLang] = useState('uz');
  const [practiceMuted, setPracticeMuted] = useState(false);
  const startTimeRef = useRef(0);
  const lessonNumber = Number(bank.title?.match(/Dars\s+(\d+)/i)?.[1]);
  const source = bank.source || getGrade3PracticeSource(lessonNumber);
  const items = useMemo(() => bank.items.map((spec, itemIndex) => {
    const baseSource = spec.source || source;
    const sourcedSpec = {
      ...spec,
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
      Component: spec.text ? createPracticeQuestion(sourcedSpec) : spec.Component || createPracticeQuestion(sourcedSpec),
    };
  }), [bank, source]);
  const current = items[index] || items[0];

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const chip = (active) => ({
    minWidth: 0,
    padding: '6px 4px',
    borderRadius: 10,
    border: `1.5px solid ${active ? '#FF4F28' : '#D6DAE3'}`,
    background: active ? '#FF4F28' : '#fff',
    color: active ? '#fff' : '#374151',
    fontFamily: "'Manrope', system-ui, sans-serif",
    fontSize: 12.5,
    fontWeight: 800,
    cursor: 'pointer',
  });

  const completed = Object.values(results).filter((result) => result?.correct).length;
  const finishReady = completed === items.length && items.length > 0;
  const practiceId = `num-3-${String(lessonNumber).padStart(2, '0')}-practice`;

  const advance = () => {
    if (finished) return;
    if (finishReady) {
      const payload = {
        lessonId: practiceId,
        lessonTitle: bank.title,
        type: 'practice',
        durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
        totalQuestions: items.length,
        correctAnswers: completed,
        scorePercent: items.length > 0 ? Math.round((completed / items.length) * 100) : 0,
        passed: completed === items.length,
        answers: results,
      };
      try {
        window.localStorage.setItem(`grade3:${practiceId}:progress`, JSON.stringify({
          completed: true,
          completedAt: new Date().toISOString(),
          solved: completed,
          total: items.length,
        }));
      } catch {
        // Completion still works when browser storage is unavailable.
      }
      setFinished(true);
      if (typeof onFinished === 'function') {
        onFinished(payload);
      } else if (typeof window !== 'undefined' && typeof window.CustomEvent === 'function') {
        window.dispatchEvent(new window.CustomEvent('grade3:practice-finished', { detail: payload }));
      }
      return;
    }

    const laterIncomplete = items.findIndex(
      (item, itemIndex) => itemIndex > index && !results[item.id]?.correct,
    );
    const nextIncomplete = laterIncomplete >= 0
      ? laterIncomplete
      : items.findIndex((item) => !results[item.id]?.correct);
    if (nextIncomplete >= 0) setIndex(nextIncomplete);
  };

  return (
    <div className="g3-practice-bank-root" data-testid="grade3-practice-root" data-practice-id={practiceId}>
      <style>{`
        .g3-practice-bank-root {
          position: fixed;
          inset: 0;
          z-index: 900;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #fff;
          font-family: 'Manrope', system-ui, sans-serif;
        }
        .g3-practice-bank-header {
          position: relative;
          min-height: 52px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          padding: 7px 112px 7px 124px;
          border-bottom: 1px solid #EEF0F4;
          background: rgba(255,255,255,.97);
        }
        .g3-practice-bank-title {
          order: 1;
          min-width: 120px;
          max-width: 280px;
          overflow: hidden;
          color: #1F2430;
          font-size: 13.5px;
          font-weight: 900;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .g3-practice-bank-nav {
          order: 2;
          display: grid;
          grid-template-columns: repeat(10,minmax(0,1fr));
          flex: 1;
          min-width: 0;
          gap: 5px;
        }
        .g3-practice-bank-score {
          order: 3;
          flex-shrink: 0;
          padding: 4px 9px;
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 900;
        }
        .lesson-back {
          top: 8px;
          left: 8px;
          z-index: 1100;
          min-height: 36px;
          box-sizing: border-box;
          padding: 7px 11px;
          font-size: 12px;
        }
        @media (max-width: 900px) {
          .g3-practice-bank-header { padding-left: 116px; }
          .g3-practice-bank-title { display: none; }
        }
        @media (max-width: 639.98px) {
          .g3-practice-bank-root { width: 100%; }
          .g3-practice-bank-header {
            min-height: 82px;
            gap: 5px;
            padding: 43px 6px 5px;
          }
          .g3-practice-bank-nav{gap:3px}
          .g3-practice-bank-nav button{padding:4px 2px!important;border-radius:8px!important;font-size:10px!important}
          .g3-practice-bank-score {
            display: none;
          }
        }
      `}</style>
      <header className="g3-practice-bank-header">
        <div style={{ display: 'contents' }}>
          <strong className="g3-practice-bank-title" title={bank.title}>{bank.title}</strong>
          <div style={{ display: 'contents' }}>
            <span data-testid="grade3-practice-score" className="g3-practice-bank-score" aria-label={`${completed} / ${items.length}`} style={{ color: '#596170', background: '#F1F3F6' }}>{completed}/{items.length}</span>
          </div>
        </div>
        <nav className="g3-practice-bank-nav" aria-label="Amaliyot topshiriqlari">
          {items.map((item, i) => (
            <button
              key={item.id}
              data-testid={`grade3-practice-task-${i + 1}`}
              type="button"
              aria-label={`${i + 1}. ${item.label}`}
              aria-current={i === index ? 'step' : undefined}
              style={chip(i === index)}
              onClick={() => setIndex(i)}
            >
              {i + 1}
            </button>
          ))}
        </nav>
      </header>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <PracticeHost
          key={`${current.id}-${index}`}
          Question={current.Component}
          lang={practiceLang}
          muted={practiceMuted}
          title={`${index + 1}/${items.length} · ${current.label}`}
          source={current.source}
          onAdvance={advance}
          onLanguageChange={setPracticeLang}
          onMutedChange={setPracticeMuted}
          finishReady={finishReady}
          finished={finished}
          onResult={(result) => setResults((currentResults) => ({ ...currentResults, [current.id]: result }))}
        />
      </div>
    </div>
  );
}
