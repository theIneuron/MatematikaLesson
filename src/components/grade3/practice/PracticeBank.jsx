import { useEffect, useMemo, useState } from 'react';
import PracticeHost from './PracticeHost.jsx';
import { createPracticeQuestion } from './QuestionFactory.jsx';
import { getGrade3PracticeSource } from './sourceRegistry.js';

const MOBILE_W = 390;

function usePracticeZoom() {
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => root.style.setProperty('--g3pqz', String(window.innerWidth < 640 ? window.innerWidth / MOBILE_W : 1));
    apply();
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);
    return () => {
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);
      root.style.removeProperty('--g3pqz');
    };
  }, []);
}

export default function PracticeBank({ bank }) {
  usePracticeZoom();
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState({});
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

  const chip = (active, result) => ({
    padding: '7px 11px',
    borderRadius: 999,
    border: `1.5px solid ${active ? '#2563EB' : result?.correct ? '#1F7A4D' : result ? '#B9382F' : '#D6DAE3'}`,
    background: active ? '#2563EB' : result?.correct ? '#E3F0E8' : result ? '#FDECEC' : '#fff',
    color: active ? '#fff' : result?.correct ? '#1F7A4D' : result ? '#B9382F' : '#374151',
    fontFamily: "'Manrope', system-ui, sans-serif",
    fontSize: 12.5,
    fontWeight: 800,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  });

  const completed = Object.values(results).filter((result) => result?.correct).length;

  return (
    <div className="g3-practice-bank-root" style={{ display: 'flex', flexDirection: 'column', fontFamily: "'Manrope', system-ui, sans-serif" }}>
      <style>{`
        .g3-practice-bank-root { position: fixed; inset: 0; overflow: hidden; background: #fff; zoom: var(--g3pqz, 1); }
        @media (max-width: 639.98px) { .g3-practice-bank-root { width: 390px; } }
      `}</style>
      <div style={{ flexShrink: 0, padding: '62px 12px 10px', borderBottom: '1px solid #EEF0F4', background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <strong style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#1F2430', fontSize: 13.5 }}>{bank.title}</strong>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <span aria-label={`${completed} / ${items.length}`} style={{ padding: '4px 9px', borderRadius: 999, color: completed === items.length ? '#1F7A4D' : '#596170', background: completed === items.length ? '#E3F0E8' : '#F1F3F6', fontSize: 12.5, fontWeight: 900 }}>{completed}/{items.length}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', overscrollBehaviorX: 'contain', paddingBottom: 2, scrollbarWidth: 'none' }}>
          {items.map((item, i) => (
            <button key={item.id} type="button" aria-label={`${i + 1}. ${item.label}`} style={chip(i === index, results[item.id])} onClick={() => setIndex(i)}>
              {results[item.id]?.correct ? '✓ ' : ''}{i + 1}. {item.level} {item.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <PracticeHost
          key={`${current.id}-${index}`}
          Question={current.Component}
          title={`${index + 1}/${items.length} · ${current.label}`}
          source={current.source}
          onResult={(result) => setResults((currentResults) => ({ ...currentResults, [current.id]: result }))}
        />
      </div>
    </div>
  );
}
